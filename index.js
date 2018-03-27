const bot=require("./lib/bot/bot.js");

"temporaire"
var envVars = process.env;
var config= require("./config.js");

"fin temporaire"
console.log(config.message)
bot.run(config)
