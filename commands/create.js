const DiscordJS = require('discord.js');
const { ICommand } = require('wokcommands');
/**
  * 
  * @param {DiscordJS.Client} client
  * @param {[ICommand]} 
*/

module.exports = {
    
    description: 'Replies with pong',
    slash: true,
    testOnly: true,
    
    callback: ({ message, interaction }) => {
      return 'ok';
    },
}