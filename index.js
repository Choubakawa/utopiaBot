const bot=require("./lib/bot/bot.js");

"temporaire"
var config = require("./config.js");

"fin temporaire"
config !== null ? console.log("Config loaded.") : console.log("No config loaded.");
bot.run(config)
