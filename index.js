const bot=require("./lib/bot/bot.js");

"temporaire"
var envVars = require('system').env;
var config= require("./config.js");

"fin temporaire"
console.log(config.message)
bot.run(config)
