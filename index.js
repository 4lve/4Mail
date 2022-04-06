const DiscordJS = require('discord.js')
const WOKCommands = require('wokcommands')
const path = require('path')
require('dotenv').config()

const fs = require('fs')

global.endMail = JSON.parse(fs.readFileSync(path.join(__dirname, './mail.json'), 'utf8')).default

global.defButtons = new DiscordJS.MessageActionRow()
  .addComponents(
    new DiscordJS.MessageButton()
      .setCustomId('refresh')
      .setEmoji('🔄')
      .setLabel('Refresh Mail')
      .setStyle(DiscordJS.Constants.MessageButtonStyles.SUCCESS)
  )
  .addComponents(
    new DiscordJS.MessageButton()
      .setCustomId('switch')
      .setLabel('Switch Mail')
      .setStyle(DiscordJS.Constants.MessageButtonStyles.DANGER)
  )
  .addComponents(
    new DiscordJS.MessageButton()
      .setCustomId('delete')
      .setLabel('Delete Mail Account')
      .setStyle(DiscordJS.Constants.MessageButtonStyles.DANGER)
  )

const { Intents } = DiscordJS

const client = new DiscordJS.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
})

client.on('ready', () => {
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    featuresDir: path.join(__dirname, 'features'),
    testServers: ['960888039977132113'],
    botOwners: ['347818082787393539'],
    disabledDefaultCommands: [
        'help',
        'command',
        'language',
        'prefix',
        'requiredrole',
        'channelonly',
        'slash'
    ],
    mongoUri: process.env.MONGO_URI
  })
})

client.login(process.env.TOKEN)