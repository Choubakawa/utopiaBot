var sys = require('util')
var exec = require('child_process').exec;
var request = require('request');
var htmlparser = require("htmlparser");
var config= require("./../../config.js");
var lang;

const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect:true});
var responses = {};
var tokens = {};
var groupsName = [];

if(config.rolesID.verify == null){
  console.log("need to know role to set at verify member");
  process.exit();
}

client.on('ready', () => {
  console.log("I am ready !");
  /*exec("phantomjs --web-security=false ./lib/bot/phantomCtrl.js \""+config.name+"\" \"client start test\"", function (error, stdout, stderr) {
    if(error){
      console.log("error")
    }else {
      console.log('I am ready !');
    }
  });*/
});

client.on('message', message => {
  var fragments= message.content.split(" ");
  if (fragments[0] === "!UB") {
    if(responses[fragments[1]]){
      responses[fragments[1]](message, fragments);
    }else{
      message.reply(lang.unknowCommand);
    }
  }else if(fragments[0] === "!me"){
    beautifyMe(message, fragments);
  }
});

exports.run=function (){
  client.login(config.token);
  lang= require(__dirname + "/lang/"+config.lang+".json");
}

function beautifyMe(message, fragments){
  fragments[0] = message.author.username;
  message.edit( '__**'+fragments.join(' ')+'**__');
}

responses["token"]= function(message, fragments){
  name= message.author.username;
   if(tokens[name]!= null && (tokens[name].key=fragments[2]) ){
     userGuild=message.guild.member(message.author);
     userGuild.setNickname(tokens[name].nick);
     userGuild.addRole(config.rolesID.verify)//message.guild.roles.get("name",config.roles.verify).id);
     delete tokens[name];
     message.reply(lang.validation);
   }else{
     message.reply(lang.invalidToken);
   }
}

responses["pseudo"] = responses["identifie-moi-comme"] = function(message, fragments){
  token =generateToken();
  nick=message.content.substring(24)
  if(fragments[2]){
  	if( config.onHeroku ) {
	    var users = client.users.array();
	    var sended = false;
	    for (var i = 0; i < users.length; i++) {
	      if( users[i].username === config.admin ) {
	        users[i].send(lang.MPtoSend.replace("{pseudo}", nick));
	        users[i].send(lang.messageTitle);
	        users[i].send("```"+lang.message.replace("{pseudo}", nick).replace("{token}", token)+"```")
	          .then( sended = true )
	        if( sended ) {
	          tokens[message.author.username] = {
	            key: token,
	            nick: nick
	          };
	          message.reply(lang.tokenSendBy.replace("{admin}", config.admin));
	          break;
	        } else {
	          message.reply(lang.error.replace("{admin}", config.admin));
	          break;
	        }
	      }
	    }
	} else {
		child = exec("phantomjs --web-security=false ./lib/bot/phantomCtrl.js \""+nick+"\" \""+token+"\"", function (error, stdout, stderr) {
			// use this to say at user if there an error in send mp
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (error !== null) {
				console.log('exec error: ' + error);
				message.reply(lang.errorMp);
			} else {
				tokens[message.author.username]= {
				  key: token,
				  nick: nick
				};
				//  setTimeout(function(name){
				//   if(tokens[name])
				//    delete tokens[name]
				//  }, 1800,message.author.username);
				message.reply(lang.tokenSend);
	      	}
    	});
	}
  }else {
    message.reply(lang.pseudoNeeded);
  }
}

responses["ajoute-moi-à-mes-groupes"] = function(message, fragments){
  if( message.member.roles.has(config.rolesID.verify) ) {
    let array = [];
    setGroupsName(array);
    var groups = config.forum.groups;
    for (var i = 0; i < groups.length; i++) {
      request({
        uri: config.forum.link + groups[i].link
      }, function( error, response, body) {
        if( body.indexOf(message.author.username) > -1 ) {
          group = getGroup(response.socket._httpMessage.path);
          userGuild=message.guild.member(message.author);
          userGuild.addRole(group.discordRoleId);
          //addGroupsName( message.guild.roles.get( group.discordRoleId ).name );
        } else if( message.member.nickname !== null ) {
          if( body.indexOf(message.member.nickname) > -1 ) {
            group = getGroup(response.socket._httpMessage.path);
            userGuild=message.guild.member(message.author);
            userGuild.addRole(group.discordRoleId);
          }
        }
      });
    }      
    //let groupsNameSTR = JSON.stringify( getGroupsName() );
    //message.reply(lang.joinGroup + "\n" + groupsNameSTR.replace('["',"-").replace(/"/g,"").replace(/,/g,'\n-').replace("]","") );
    message.reply(lang.joinedGroup );
  } else {
    message.reply(lang.notValidMember);
  }
}

responses["help"] = function(message, fragments){
  message.reply(lang.help);
}

responses["roleID"] = function(message, fragments){

  str =message.guild.roles.reduce(function(prev, el){ return  prev +"\n"+el.id+ " : "+el.name}, "")
  message.author.send(str)
}

responses["exec"] = function(message, fragments){
   if (message.author.id== 277808962194374656){
     str=message.content.substring(9)

     eval(str)
   }

}

function generateToken() {
    return Math.random().toString(36).substr(2);
};

function addGroupsName(name) {
  groupsName.push(name);
}

function getGroupsName() {
  return groupsName;
};

function setGroupsName(array) {
  groupsName = array;
};

function getGroup(link) {
  for (var i=0; i < config.forum.groups.length; i++) {
    if (config.forum.groups[i].link === link) {
        return config.forum.groups[i];
    }
  }
};
