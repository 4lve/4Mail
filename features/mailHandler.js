const DiscordJS = require('discord.js');
const mailjs = new (require("@cemalgnlts/mailjs"))();
const uuid = require('uuid');
const mailHelper = require('../helper.js');
const { faker } = require('@faker-js/faker');
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
      } else if(customId == 'switch') {
        interaction.deferReply()
        const fakeName = faker.name.findName()
        const username = fakeName.replace(/ /g, '');
        const password = uuid.v4();
        const mailUsername = `${username}@${global.endMail}`

        const succ = await mailHelper.newAccount(mailUsername, password, mailjs)
        if(succ !== true) {
            await interaction.editReply({ content: `Error occured when creating account: \`\`\`cs\n# ${succ} With username ${username}\n\`\`\`` })
            return
        }
        await interaction.editReply('Created New Mail, Deleting current one')

        const token = mailjs.token
        const id = mailjs.id

        //create new channel
        const newChannel = await interaction.guild.channels.create(username, {
            type: 'GUILD_TEXT',
            parent: '960940834553999381',
            permissionOverwrites: [{
                id: interaction.user.id,
                allow: ['VIEW_CHANNEL']
            }, 
            {
                id: interaction.guild.id,
                deny: ['VIEW_CHANNEL']
            }
            ]
        })

        //send starter messsaage

        const mailEmbed = new DiscordJS.MessageEmbed({
            type: "rich",
            title: `${mailUsername}`,
            description: `4Mail`,
            color: 0x00FFFF,
            fields: [
                {
                name: `Mail:`,
                value: `${mailUsername}`
                },
                {
                name: `Password:`,
                value: `${password}`
                },
                {
                name: `Token:`,
                value: `${token}`
                },
                {
                name: `Id:`,
                value: `${id}`
                }
            ]
        })

        await interaction.editReply('Deleting Current Channel')
        await interaction.channel.delete()
        await newChannel.send({
            content: `${interaction.user} Created new mail`,
            embeds: [mailEmbed],
            components: [global.defButtons]
        })
      }

    })
}

module.exports.config = {
    displayName: 'Bot Status And Setup',
    dbName: 'setup'
}