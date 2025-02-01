// messageConfig.js

module.exports = {
  welcomeMessage: (userName) => `Bienvenue ${userName}, heureux de vous voir ici sur notre serveur !`,
  goodbyeMessage: (userName) => `Au revoir ${userName}, à bientôt !`,
  helpMessage: `Voici les commandes disponibles :
  - !help : Affiche cette aide.
  - !ping : Vérifie la latence du bot.
  - !userinfo [utilisateur] : Affiche les informations d'un utilisateur.
  - !serverinfo : Affiche des informations sur le serveur.`,
  errorMessage: "Oups, une erreur est survenue. Essayez de nouveau.",
  permissionError: "Vous n'avez pas l'autorisation de faire cela.",
  invalidCommandMessage: "Commande invalide. Tapez !help pour voir les commandes disponibles.",
  pingResponse: "Pong ! La latence est de",
  botStatus: (status) => `Le bot est actuellement ${status}.`,
  welcomeDmMessage: "Bienvenue sur notre serveur ! Si vous avez des questions, tapez !help.",
  farewellMessage: "Merci d'avoir été avec nous, à très bientôt !",
  botReadyMessage: "Le bot est prêt et opérationnel !",
  botOfflineMessage: "Le bot est actuellement hors ligne. Nous nous excusons pour la gêne.",
};
