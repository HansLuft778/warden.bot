let config = require('./config.json')
const fs = require("fs")
const path = require("path")
//This functions.js file serves as a global functions context for all bots that may resuse the same code.
/**
 * @author (testfax) Medi0cr3 @testfax
 * @function adjustActive,botIdent,fileNameBotMatch
 */
const bot = {
    adjustActive: function(current,mode) {
        if (mode) { 
            const activeBot = config.botTypes.find(bot => bot.botName === mode);
            const indexNum = config.botTypes.indexOf(activeBot);
            config.botTypes[indexNum].active = true
            console.log("[STARTUP]".yellow,`${bot.botIdent().activeBot.botName}`.green,"Development Mode:".bgRed,'✅')
            return true
        }
        try {
            const activeBot = config.botTypes.find(bot => bot.hostname === current);
            const indexNum = config.botTypes.indexOf(activeBot);
            config.botTypes[indexNum].active = true
            //todo Overwrite the config.json file with new array.
            return true
        }
        catch (e) {
            console.log("ERROR: Incorrect hostname!!!!".bgRed,)
            console.log(`Insert the following into "hostname" in config.json for the correct bot.`.bgRed)
            console.log("Hostname ---->>>>>".red,`${current}`.bgYellow)
        }
    },
    botIdent: function() {
        const activeBot = config.botTypes.find(bot => bot.active === true);
        let inactiveBots = []
        inactiveBots.push(config.botTypes.filter(bot => bot.active === false).map(bot => bot.botName))
        return {activeBot,inactiveBots}
    },
    fileNameBotMatch: function(e) {
        //This only works, because the codebase is not one of the matching bot names. Case-Sensitive.
        // Example.   This codebase is: /warden.bot/ and not /Warden/ name of bot should be reserved for programming.
        function isError(val) { return val instanceof Error }
        let foundBotName = null;
        let stackLines = null;
        if (isError(e)) { stackLines = e.stack.split("\n") }
        else { stackLines = e.split(path.sep) }
        for (const line of stackLines) {
            const botNameMatch = bot.botIdent().inactiveBots[0].find(element => line.includes(element));
            if (botNameMatch && botNameMatch.length > 0) {
              foundBotName = botNameMatch;
              return foundBotName
            }
          }
        return foundBotName
    },
    getSortedRoleIDs: (message) => {
        /**
       * Function takes a input string and returns the closest matching Server Role ID
       * @param   {object} message        Pass through the message object
       * @returns {object}                Returns an Object of role id's and their positions IN REVERSE ORDER
       */
        try {
          let roleNameObj = {};
          let size = 0;
          message.guild.roles.cache.forEach(() => {size+=1});
          size-=1 // removing the count for @everyone from size
          message.guild.roles.cache.forEach((role) => {
            if (role.name != "@everyone" && role.name != "@here") {
              roleNameObj[size - parseInt(role.rawPosition)] = [role.id,`<@&${role.id}>`];
            }
          });
          return roleNameObj
        } catch (err) {
          console.log(err);
        }
    },
    getRoleID: (message, name) => {
        /**
         * Function takes a input string and returns the closest matching Server Role ID
         * @param   {object} message    Pass through the message object
         * @param   {string} name       The Role name you need to check
         * @returns {string}            Returns the Role ID
         */
        try {
            let roleList = []
            message.guild.roles.cache.forEach(role => {
                if (role.name !='@everyone' && role.name != '@here') {
                    roleList.push(bot.cleanString(role.name));
                }
            });
            switch(name.toLowerCase())
            {
                case "pc": return '428260067901571073';
                case "xb": return '533774176478035991';
                case "ps": return '428259777206812682';
                case "bgs": case "loyalist": return '712110659814293586';
                case "axi": case "axin": return '848726942786387968';
                default: break;
            }
            let best = compare.findBestMatch(name, roleList);
            return message.guild.roles.cache.find(role => bot.cleanString(role.name) == roleList[best["bestMatchIndex"]]).id.toString()
        } catch (err) {
            console.log(err);
        }
    },
    cleanString: (input) => {
        var output = "";
        for(var i=0;i<input.length;i++)
        {
            if(input.charCodeAt(i)<=127)
            {
                output+=input.charAt(i);
            }
        }
        return output.trim();
    },
    examplezzzzz: function() {},
    examplesssss: "SomeExampleVariable",
}

module.exports = bot