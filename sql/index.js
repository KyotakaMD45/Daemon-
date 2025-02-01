const { loadUserGroupData, saveUserGroupData } = require('../utils');

// Fonction pour configurer le système d'antilink
async function setAntilink(groupId, type, action) {
    try {
        const data = loadUserGroupData();
        if (!data.antilink) data.antilink = {};
        if (!data.antilink[groupId]) data.antilink[groupId] = {};
        
        data.antilink[groupId] = {
            enabled: type === 'on',
            action: action || 'supprimer' // Action par défaut : supprimer
        };
        
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Erreur lors de la configuration de l\'antilink :', error);
        return false;
    }
}

// Fonction pour récupérer la configuration antilink
async function getAntilink(groupId, type) {
    try {
        const data = loadUserGroupData();
        if (!data.antilink || !data.antilink[groupId]) return null;
        
        return type === 'on' ? data.antilink[groupId] : null;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'antilink :', error);
        return null;
    }
}

// Fonction pour supprimer la configuration antilink
async function removeAntilink(groupId, type) {
    try {
        const data = loadUserGroupData();
        if (data.antilink && data.antilink[groupId]) {
            delete data.antilink[groupId];
            saveUserGroupData(data);
        }
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'antilink :', error);
        return false;
    }
}

// Fonction pour incrémenter le nombre d'avertissements
async function incrementWarningCount(groupId, userId) {
    try {
        const data = loadUserGroupData();
        if (!data.warnings) data.warnings = {};
        if (!data.warnings[groupId]) data.warnings[groupId] = {};
        if (!data.warnings[groupId][userId]) data.warnings[groupId][userId] = 0;
        
        data.warnings[groupId][userId]++;
        saveUserGroupData(data);
        return data.warnings[groupId][userId];
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation du compteur d\'avertissements :', error);
        return 0;
    }
}

// Fonction pour réinitialiser le nombre d'avertissements
async function resetWarningCount(groupId, userId) {
    try {
        const data = loadUserGroupData();
        if (data.warnings && data.warnings[groupId] && data.warnings[groupId][userId]) {
            data.warnings[groupId][userId] = 0;
            saveUserGroupData(data);
        }
        return true;
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du compteur d\'avertissements :', error);
        return false;
    }
}

// Fonction pour vérifier si l'utilisateur est sudo
async function isSudo(userId) {
    try {
        const data = loadUserGroupData();
        return data.sudo && data.sudo.includes(userId);
    } catch (error) {
        console.error('Erreur lors de la vérification du sudo :', error);
        return false;
    }
}

// Fonction pour ajouter un message de bienvenue
async function addWelcome(jid, enabled, message) {
    try {
        const data = loadUserGroupData();
        if (!data.welcome) data.welcome = {};
        
        data.welcome[jid] = {
            enabled: enabled,
            message: message || 'Bienvenue {user} dans le groupe ! 🎉'
        };
        
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du message de bienvenue :', error);
        return false;
    }
}

// Fonction pour supprimer un message de bienvenue
async function delWelcome(jid) {
    try {
        const data = loadUserGroupData();
        if (data.welcome && data.welcome[jid]) {
            delete data.welcome[jid];
            saveUserGroupData(data);
        }
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression du message de bienvenue :', error);
        return false;
    }
}

// Fonction pour vérifier si le message de bienvenue est activé
async function isWelcomeOn(jid) {
    try {
        const data = loadUserGroupData();
        return data.welcome && data.welcome[jid] && data.welcome[jid].enabled;
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'activation du message de bienvenue :', error);
        return false;
    }
}

// Fonction pour ajouter un message d'au revoir
async function addGoodbye(jid, enabled, message) {
    try {
        const data = loadUserGroupData();
        if (!data.goodbye) data.goodbye = {};
        
        data.goodbye[jid] = {
            enabled: enabled,
            message: message || 'Au revoir {user} 👋'
        };
        
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du message d\'au revoir :', error);
        return false;
    }
}

// Fonction pour supprimer un message d'au revoir
async function delGoodBye(jid) {
    try {
        const data = loadUserGroupData();
        if (data.goodbye && data.goodbye[jid]) {
            delete data.goodbye[jid];
            saveUserGroupData(data);
        }
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression du message d\'au revoir :', error);
        return false;
    }
}

// Fonction pour vérifier si le message d'au revoir est activé
async function isGoodByeOn(jid) {
    try {
        const data = loadUserGroupData();
        return data.goodbye && data.goodbye[jid] && data.goodbye[jid].enabled;
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'activation du message d\'au revoir :', error);
        return false;
    }
}

// Fonction pour configurer le système anti-badword
async function setAntiBadword(groupId, type, action) {
    try {
        const data = loadUserGroupData();
        if (!data.antibadword) data.antibadword = {};
        if (!data.antibadword[groupId]) data.antibadword[groupId] = {};
        
        data.antibadword[groupId] = {
            enabled: type === 'on',
            action: action || 'supprimer'
        };
        
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Erreur lors de la configuration de l\'antibadword :', error);
        return false;
    }
}

// Fonction pour récupérer la configuration antibadword
async function getAntiBadword(groupId, type) {
    try {
        const data = loadUserGroupData();
        console.log('Chargement de la configuration antibadword pour le groupe :', groupId);
        console.log('Données actuelles :', data.antibadword);
        
        if (!data.antibadword || !data.antibadword[groupId]) {
            console.log('Aucune configuration antibadword trouvée');
            return null;
        }
        
        const config = data.antibadword[groupId];
        console.log('Configuration trouvée :', config);
        
        return type === 'on' ? config : null;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'antibadword :', error);
        return null;
    }
}

// Fonction pour supprimer la configuration antibadword
async function removeAntiBadword(groupId, type) {
    try {
        const data = loadUserGroupData();
        if (data.antibadword && data.antibadword[groupId]) {
            delete data.antibadword[groupId];
            saveUserGroupData(data);
        }
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'antibadword :', error);
        return false;
    }
}

// Fonction pour configurer le chatbot
async function setChatbot(groupId, enabled) {
    try {
        const data = loadUserGroupData();
        if (!data.chatbot) data.chatbot = {};
        
        data.chatbot[groupId] = {
            enabled: enabled
        };
        
        saveUserGroupData(data);
        return true;
    } catch (error) {
        console.error('Erreur lors de la configuration du chatbot :', error);
        return false;
    }
}

// Fonction pour récupérer la configuration du chatbot
async function getChatbot(groupId) {
    try {
        const data = loadUserGroupData();
        return data.chatbot?.[groupId] || null;
    } catch (error) {
        console.error('Erreur lors de la récupération du chatbot :', error);
        return null;
    }
}

// Fonction pour supprimer la configuration du chatbot
async function removeChatbot(groupId) {
    try {
        const data = loadUserGroupData();
        if (data.chatbot && data.chatbot[groupId]) {
            delete data.chatbot[groupId];
            saveUserGroupData(data);
        }
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression du chatbot :', error);
        return false;
    }
}

module.exports = {
    setAntilink,
    getAntilink,
    removeAntilink,
    incrementWarningCount,
    resetWarningCount,
    isSudo,
    addWelcome,
    delWelcome,
    isWelcomeOn,
    addGoodbye,
    delGoodBye,
    isGoodByeOn,
    setAntiBadword,
    getAntiBadword,
    removeAntiBadword,
    setChatbot,
    getChatbot,
    removeChatbot,
};
