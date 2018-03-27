var sys = require('util')
var exec = require('child_process').exec;
var envVars = require('system').env;
var config= require("./../../config.js");
var lang;

const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect:true});
var responses={};
var tokens = {};

if(config.rolesID.verify == null){
  console.log("need to know role to set at verify member");
  process.exit();
}

client.on('ready', () => {
  console.log("client.on ready enter");
  exec("phantomjs --web-security=false ./lib/bot/phantomCtrl.js \""+config.name+"\" \"client start test\"", function (error, stdout, stderr) {
    if(error){
      console.log("error")
    }else {
      console.log('I am ready!');
    }
  });
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
  lang= require(__dirname + "/lang/"+(config.lang || "fr-fr")+".json");
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
    console.log("send :" , "phantomjs --web-security=false ./lib/bot/phantomCtrl.js \""+nick+"\" \""+token+"\"")
    child = exec("phantomjs --web-security=false ./lib/bot/phantomCtrl.js \""+nick+"\" \""+token+"\"", function (error, stdout, stderr) {
      // use this to say at user if there an error in send mp
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      else {
        tokens[message.author.username]= {
          key: token,
          nick: nick
        };
      /*  setTimeout(function(name){
          if(tokens[name])
            delete tokens[name]
          }, 1800,message.author.username);*/
        message.reply(lang.tokenSend);
      }
    });
  }else {
    message.reply(lang.pseudoNeeded);
  }
}


responses["roleID"] = function(message, fragments){

  str =message.guild.roles.reduce(function(prev, el){ return  prev +"\n"+el.id+ " : "+el.name}, "")
  message.author.sendMessage(str)
}

responses["exec"] = function(message, fragments){
   if (message.author.id== 282068703984746496){
     str=message.content.substring(9)

     eval(str)
   }

}

function generateToken() {
    return Math.random().toString(36).substr(2);
};
