var sys = require('util')
var exec = require('child_process').exec;
var request = require('request');
var htmlparser = require("htmlparser");
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
    var users = client.users.array();
    var sended = false;
    for (var i = 0; i < users.length; i++) {
      if( users[i].username === config.admin ) {
        users[i].send(lang.MPtoSend.replace("{pseudo}", nick));
        users[i].send(config.messageTitle);
        users[i].send("```"+config.message.replace("{pseudo}", nick).replace("{token}", token)+"```")
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
   /* to send MP
    console.log("send :" , "phantomjs --web-security=false ./lib/bot/phantomCtrl.js \""+nick+"\" \""+token+"\"")
    child = exec("phantomjs --web-security=false ./lib/bot/phantomCtrl.js \""+nick+"\" \""+token+"\"", function (error, stdout, stderr) {
      // use this to say at user if there an error in send mp
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
        message.reply(lang.errorMp);
      }
      else {
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
    });*/
  }else {
    message.reply(lang.pseudoNeeded);
  }
}

responses["pseudo"] = responses["ajoute-moi-à-mes-groupes"] = function(message, fragments){
  if( message.member.roles.has(config.rolesID.verify) ) {
    var groups = config.forum.groups;
    var groupJoin = [];
    for (var i = 0; i < groups.length; i++) {
      request({
        uri: config.forum.link + groups[i].link
      }, function( error, response, body) {
/*        var reqBody = JSON.stringify( response.body );
        reqBody = JSON.parse( reqBody );*/
        var rawHtml = JSON.stringify( response.body );
        var handler = new htmlparser.DefaultHandler(function (error, dom) {
          if (error)
            console.log( error );
        });
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(rawHtml);
        sys.puts(sys.inspect(handler.dom, false, null));
    });
  }
  message.reply(lang.joinGroup);
  } else {
    message.reply(lang.notValidMember);
  }
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
