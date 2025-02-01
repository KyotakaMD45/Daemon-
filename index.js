/**
 * Nom du Bot - Un bot WhatsApp
 * Copyright (c) 2024 [Auteur]
 * 
 * Ce programme est un logiciel libre : vous pouvez le redistribuer et/ou le modifier
 * selon les termes de la licence MIT.
 * 
 * Crédits :
 * - Bibliothèque Baileys par @adiwajshing
 * - Implémentation du code d'appairage inspirée de [Source]
 */

require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const { 
    default: makeWASocket,
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    makeInMemoryStore,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})

let phoneNumber = ""
let owner = JSON.parse(fs.readFileSync('./database/owner.json'))

global.botname = ""
global.themeemoji = ""

const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
         
async function startBot() {
    let { version, isLatest } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache()

    const Bot = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        browser: ["OS", "Navigateur", "Version"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    })

    store.bind(Bot.ev)

    // Gestion des messages
    Bot.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!Bot.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            
            await handleMessages(Bot, chatUpdate, true)
        } catch (err) {
            console.error("Erreur dans messages.upsert : ", err)
        }
    })

    // Gestion de la connexion
    Bot.ev.on('connection.update', async (s) => {
        const { connection, lastDisconnect } = s
        if (connection == "open") {
            console.log(chalk.yellow(`🌿 Connecté à => ` + JSON.stringify(Bot.user, null, 2)))
            
            // Envoyer un message au numéro du bot
            const botNumber = Bot.user.id.split(':')[0] + '@s.whatsapp.net';
            await Bot.sendMessage(botNumber, { 
                text: `🎉 *Hello, Boss !* 🤖\n\n` +
                      `✅ *Connexion réussie !*\n` +
                      `🕒 *Heure actuelle :* ${new Date().toLocaleString()}\n` +
                      `📡 *Statut :* _En ligne et opérationnel_\n\n` +
                      `💡 *Commandes disponibles :* Tapez *!help* pour voir la liste.\n\n` +
                      `✨ _Merci d'utiliser ${global.botname || 'ton bot'} !_ 🚀`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '',
                        newsletterName: global.botname || '',
                        serverMessageId: -1
                    }
                }
            });

            await delay(1999)
            console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.botname || 'BOT'} ]`)}\n\n`))
            console.log(chalk.cyan(`< ================================================== >`))
            console.log(chalk.magenta(`\n${global.themeemoji || ''}`))
            console.log(chalk.magenta(`${global.themeemoji || ''} NUMÉRO WA : ${owner}`))
            console.log(chalk.green(`${global.themeemoji || ''} 🤖 Bot connecté avec succès ! ✅`))
        }
        if (
            connection === "close" &&
            lastDisconnect &&
            lastDisconnect.error &&
            lastDisconnect.error.output.statusCode != 401
        ) {
            startBot()
        }
    })

    Bot.ev.on('creds.update', saveCreds)
    
    // Modifier l'écouteur d'événement pour journaliser l'objet de mise à jour
    Bot.ev.on('group-participants.update', async (update) => {
        console.log('Événement de mise à jour de groupe :', JSON.stringify(update, null, 2))
        await handleGroupParticipantUpdate(Bot, update)
    })

    return Bot
}

// Démarrer le bot avec une gestion des erreurs
startBot().catch(error => {
    console.error('Erreur fatale :', error)
    process.exit(1)
})

// Meilleure gestion des erreurs
process.on('uncaughtException', (err) => {
    console.error('Exception non capturée :', err)
    // Ne pas quitter immédiatement pour permettre la reconnexion
})

process.on('unhandledRejection', (err) => {
    console.error('Rejet non géré :', err)
    // Ne pas quitter immédiatement pour permettre la reconnexion
})

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Mise à jour ${__filename}`))
    delete require.cache[file]
    require(file)
})
