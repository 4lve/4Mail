const DiscordJS = require('discord.js');
const mailjs = new (require("@cemalgnlts/mailjs"))();
/**
  * 
  * @param {DiscordJS.Client} client
*/

const deleteMsgButton = new DiscordJS.MessageActionRow()
  .addComponents(
      new DiscordJS.MessageButton()
          .setCustomId('msgdelete')
          .setEmoji('🗑️')
          .setLabel('Delete Message')
          .setStyle(DiscordJS.Constants.MessageButtonStyles.DANGER)
  )

module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
      if(interaction.type != 'MESSAGE_COMPONENT') return
      const customId = interaction.customId



      if(customId == 'delete') {
        await interaction.channel.delete()
      }else if(customId == 'refresh') {
        await interaction.deferReply()
        const token = (interaction.message.embeds[0].fields[2].value)
        const mailId = (interaction.message.embeds[0].fields[3].value)
        mailjs.token = token
        const mails = await mailjs.getMessages()
        
        if(!mails.data[0]) return interaction.editReply({
          content: 'No mails found.',
          components: [deleteMsgButton]
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
              }
          ],
          timestamp: new Date(),
          footer: {
            text: selectedMail.id,
          },
        })

        await interaction.editReply({
          embeds: [mailEmbed],
          components: [deleteMsgButton]
        })
        //mailjs.deleteMessage(selectedMail.id)
      } else if(customId == 'msgdelete') {
        interaction.message.delete()
      }

    })
}

module.exports.config = {
    displayName: 'Bot Status And Setup',
    dbName: 'setup'
}