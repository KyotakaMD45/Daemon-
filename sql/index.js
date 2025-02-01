const { chargerDonneesGroupe, sauvegarderDonneesGroupe } = require('../utils');

// Activation/Désactivation de l'anti-lien
async function definirAntiLien(idGroupe, etat, action) {
    try {
        const donnees = chargerDonneesGroupe();
        if (!donnees.antilien) donnees.antilien = {};
        if (!donnees.antilien[idGroupe]) donnees.antilien[idGroupe] = {};
        
        donnees.antilien[idGroupe] = {
            actif: etat === 'activer',
            action: action || 'supprimer' // Action par défaut : suppression
        };
        
        sauvegarderDonneesGroupe(donnees);
        return true;
    } catch (erreur) {
        console.error('Erreur lors de la configuration de l’anti-lien :', erreur);
        return false;
    }
}

async function obtenirAntiLien(idGroupe) {
    try {
        const donnees = chargerDonneesGroupe();
        return donnees.antilien?.[idGroupe] || null;
    } catch (erreur) {
        console.error('Erreur lors de la récupération de l’anti-lien :', erreur);
        return null;
    }
}

async function supprimerAntiLien(idGroupe) {
    try {
        const donnees = chargerDonneesGroupe();
        if (donnees.antilien && donnees.antilien[idGroupe]) {
            delete donnees.antilien[idGroupe];
            sauvegarderDonneesGroupe(donnees);
        }
        return true;
    } catch (erreur) {
        console.error('Erreur lors de la suppression de l’anti-lien :', erreur);
        return false;
    }
}

// Gestion des avertissements
async function ajouterAvertissement(idGroupe, idUtilisateur) {
    try {
        const donnees = chargerDonneesGroupe();
        if (!donnees.avertissements) donnees.avertissements = {};
        if (!donnees.avertissements[idGroupe]) donnees.avertissements[idGroupe] = {};
        if (!donnees.avertissements[idGroupe][idUtilisateur]) donnees.avertissements[idGroupe][idUtilisateur] = 0;
        
        donnees.avertissements[idGroupe][idUtilisateur]++;
        sauvegarderDonneesGroupe(donnees);
        return donnees.avertissements[idGroupe][idUtilisateur];
    } catch (erreur) {
        console.error('Erreur lors de l’ajout d’un avertissement :', erreur);
        return 0;
    }
}

async function reinitialiserAvertissements(idGroupe, idUtilisateur) {
    try {
        const donnees = chargerDonneesGroupe();
        if (donnees.avertissements?.[idGroupe]?.[idUtilisateur]) {
            donnees.avertissements[idGroupe][idUtilisateur] = 0;
            sauvegarderDonneesGroupe(donnees);
        }
        return true;
    } catch (erreur) {
        console.error('Erreur lors de la réinitialisation des avertissements :', erreur);
        return false;
    }
}

// Vérification des administrateurs
async function estSuperUtilisateur(idUtilisateur) {
    try {
        const donnees = chargerDonneesGroupe();
        return donnees.superUtilisateurs?.includes(idUtilisateur) || false;
    } catch (erreur) {
        console.error('Erreur lors de la vérification des permissions :', erreur);
        return false;
    }
}

// Messages de bienvenue et d’adieu
async function activerBienvenue(idGroupe, actif, message) {
    try {
        const donnees = chargerDonneesGroupe();
        if (!donnees.bienvenue) donnees.bienvenue = {};
        
        donnees.bienvenue[idGroupe] = {
            actif: actif,
            message: message || 'Bienvenue {utilisateur} dans le groupe ! 🎉'
        };
        
        sauvegarderDonneesGroupe(donnees);
        return true;
    } catch (erreur) {
        console.error('Erreur lors de l’activation du message de bienvenue :', erreur);
        return false;
    }
}

async function desactiverBienvenue(idGroupe) {
    try {
        const donnees = chargerDonneesGroupe();
        if (donnees.bienvenue?.[idGroupe]) {
            delete donnees.bienvenue[idGroupe];
            sauvegarderDonneesGroupe(donnees);
        }
        return true;
    } catch (erreur) {
        console.error('Erreur lors de la désactivation du message de bienvenue :', erreur);
        return false;
    }
}

async function estBienvenueActive(idGroupe) {
    try {
        const donnees = chargerDonneesGroupe();
        return donnees.bienvenue?.[idGroupe]?.actif || false;
    } catch (erreur) {
        console.error('Erreur lors de la vérification du message de bienvenue :', erreur);
        return false;
    }
}

async function activerAdieu(idGroupe, actif, message) {
    try {
        const donnees = chargerDonneesGroupe();
        if (!donnees.adieu) donnees.adieu = {};
        
        donnees.adieu[idGroupe] = {
            actif: actif,
            message: message || 'Au revoir {utilisateur} 👋'
        };
        
        sauvegarderDonneesGroupe(donnees);
        return true;
    } catch (erreur) {
        console.error('Erreur lors de l’activation du message d’adieu :', erreur);
        return false;
    }
}

async function desactiverAdieu(idGroupe) {
    try {
        const donnees = chargerDonneesGroupe();
        if (donnees.adieu?.[idGroupe]) {
            delete donnees.adieu[idGroupe];
            sauvegarderDonneesGroupe(donnees);
        }
        return true;
    } catch (erreur) {
        console.error('Erreur lors de la désactivation du message d’adieu :', erreur);
        return false;
    }
}

async function estAdieuActive(idGroupe) {
    try {
        const donnees = chargerDonneesGroupe();
        return donnees.adieu?.[idGroupe]?.actif || false;
    } catch (erreur) {
        console.error('Erreur lors de la vérification du message d’adieu :', erreur);
        return false;
    }
}

// Protection contre les mots interdits
async function definirAntiMauvaisMot(idGroupe, etat, action) {
    try {
        const donnees = chargerDonneesGroupe();
        if (!donnees.antiMots) donnees.antiMots = {};
        
        donnees.antiMots[idGroupe] = {
            actif: etat === 'activer',
            action: action || 'supprimer'
        };
        
        sauvegarderDonneesGroupe(donnees);
        return true;
    } catch (erreur) {
        console.error('Erreur lors de la configuration de l’anti-mots interdits :', erreur);
        return false;
    }
}

async function obtenirAntiMauvaisMot(idGroupe) {
    try {
        const donnees = chargerDonneesGroupe();
        return donnees.antiMots?.[idGroupe] || null;
    } catch (erreur) {
        console.error('Erreur lors de la récupération de l’anti-mots interdits :', erreur);
        return null;
    }
}

async function supprimerAntiMauvaisMot(idGroupe) {
    try {
        const donnees = chargerDonneesGroupe();
        if (donnees.antiMots?.[idGroupe]) {
            delete donnees.antiMots[idGroupe];
            sauvegarderDonneesGroupe(donnees);
        }
        return true;
    } catch (erreur) {
        console.error('Erreur lors de la suppression de l’anti-mots interdits :', erreur);
        return false;
    }
}

module.exports = {
    definirAntiLien,
    obtenirAntiLien,
    supprimerAntiLien,
    ajouterAvertissement,
    reinitialiserAvertissements,
    estSuperUtilisateur,
    activerBienvenue,
    desactiverBienvenue,
    estBienvenueActive,
    activerAdieu,
    desactiverAdieu,
    estAdieuActive,
    definirAntiMauvaisMot,
    obtenirAntiMauvaisMot,
    supprimerAntiMauvaisMot
};
