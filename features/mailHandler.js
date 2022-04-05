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
        mailjs.deleteMe()
        await interaction.channel.delete()
      }else if(customId == 'refresh') {
        mailjs.token = token
        const mails = await mailjs.getMessages()
        
        if(!mails.data[0]) return interaction.reply({
          content: 'No mails found.',
          ephemeral: true
        })

        const selectedMail = mails.data[0]

        const mailEmbed = new DiscordJS.MessageEmbed({
          type: "rich",
          title: `${selectedMail.subject}`,
          description: `New Mail Recived`,
          color: 0x00FFFF,
          fields: [
              {
              name: `From:`,
              value: `${selectedMail.from.address}`
              },
              {
              name: `Subject:`,
              value: `${selectedMail.subject}`
              },
              {
              name: `Intro:`,
              value: `${selectedMail.intro}`
              },
              {
              name: `Id:`,
              value: `${selectedMail.id}`
                }
            ]
        })

        await interaction.reply({
          embeds: [mailEmbed],
        })
        mailjs.deleteMessage(selectedMail.id)
        .then(console.log)
      }
    })
}

module.exports.config = {
    displayName: 'Bot Status And Setup',
    dbName: 'setup'
}