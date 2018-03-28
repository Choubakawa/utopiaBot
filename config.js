if (typeof process != 'undefined') {
  var envVars = process.env; 
} else {
  var envVars = require('system').env;
}

module.exports = {
  "lang": "fr-fr",
  "token": envVars.TOKEN,
  "name": "utopiaBot",
  "password": envVars.PASSWORD,
  "rolesID":{
    "verify": envVars.VERIFY
  },
  "forum":{
    "link": "http://planellum-fornax.forumactif.org",
    "groups" : [
      {
        "name" : "Membres de Planellum",
        "link" : "/g4-membres-de-planellum"
      }
    ]
  },
  "messageTitle" : "Token Discord",
  "message" : "Hello {pseudo}, \n \n Merci pour ta demande, on est content que tu veuilles rejoindre la nouvelle taverne du forum ! \n Voici le message à copier/ coller sur Discord pour être validé : \n \n [code]!UB token {token}[/code] \n \n Ton pseudo sera automatiquement changé si besoin et tu seras ajouté au groupe des membres vérifiés ;) \n \n -- \n Si tu n'as pas fait de demande pour être ajouté au Discord (nouvelle chatbox) de Never Utopia, nous sommes désolés :() \n N'hésite pas à nous le signaler ou envoyer un MP à Choubakawa pour nous prévenir que quelqu'un se fait passer pour toi."
  }
