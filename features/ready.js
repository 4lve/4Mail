const DiscordJS = require('discord.js');
const { ICommand } = require('wokcommands');
/**
  * 
  * @param {DiscordJS.Client} client
*/

module.exports = (client, instance) => {
    console.log('Bot Online!')
}

module.exports.config = {
    displayName: 'Bot Status And Setup',
    dbName: 'setup'
}