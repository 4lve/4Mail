const DiscordJS = require('discord.js');
const Mailjs = require("@cemalgnlts/mailjs");
/**
  * 
  * @param {DiscordJS.Client} client
  * @param {DiscordJS.Interaction} interaction
*/ 

module.exports = {
    
    category: 'general',
    description: 'Replies with pong',
    slash: true,
    testOnly: true,
    options: [
        {
            name: 'username',
            description: 'The start of the mail',
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        },
        {
            name: 'password',
            description: 'The password of the mail',
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING,
        }
    ],
    
    callback: async ({ interaction, args }) => {
        await interaction.deferReply({
            ephemeral: true
        })

        await interaction.editReply({
            content: `Hey`
        })
    },
}