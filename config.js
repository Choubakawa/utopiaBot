if (typeof process != 'undefined') {
  var envVars = process.env; 
} else {
  var envVars = require('system').env;
}

module.exports = {
  "onHeroku": true,
  "lang": "fr-fr",
  "token": envVars.TOKEN,
  "name": envVars.NAME,
  "admin": envVars.ADMIN,
  "password": envVars.PASSWORD,
  "rolesID":{
    "verify": envVars.VERIFY
  },
 "forum":{
    "link": "http://planellum-fornax.forumactif.org",
    "groups" : [
      {
        "name" : "Membres de Planellum",
        "link" : "/g4-membres-de-planellum",
        "discordRoleId" : envVars.MEMBERS
      },
      {
        "name" : "Amis de Planellum",
        "link" : "/g9-amis-de-planellum",
        "discordRoleId" : envVars.FRIENDS
      },
      {
        "name" : "Candidats",
        "link" : "/g19-candidats",
        "discordRoleId" : envVars.APPLICANTS
      },
      {
        "name" : "Administrateurs",
        "link" : "/g1-administrateurs",
        "discordRoleId" : envVars.ADMINS
      },
      {
        "name" : "Padawan",
        "link" : "/g12-padawan",
        "discordRoleId" : envVars.PADAWAN
      }
    ]
  }
 }
