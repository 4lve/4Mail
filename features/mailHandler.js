const DiscordJS = require('discord.js');
const mailjs = new (require("@cemalgnlts/mailjs"))();
/**
  * 
  * @param {DiscordJS.Client} client
*/

module.exports = (client, instance) => {
    client.on('interactionCreate', async (interaction) => {
      if(interaction.type != 'MESSAGE_COMPONENT') return
      const customId = interaction.customId

      const token = (interaction.message.embeds[0].fields[2].value)
      const mailId = (interaction.message.embeds[0].fields[3].value)

      if(customId == 'delete') {
        mailjs.token = token
        const succ = await mailjs.deleteMe()
        console.log(succ)
        await interaction.channel.delete()
      }
    })
}

module.exports.config = {
    displayName: 'Bot Status And Setup',
    dbName: 'setup'
}