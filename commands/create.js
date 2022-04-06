const DiscordJS = require('discord.js');
const mailjs = new (require("@cemalgnlts/mailjs"))();
const uuid = require('uuid');
const mailHelper = require('../helper.js');
const { faker } = require('@faker-js/faker');
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
        const username = args[0] || faker.name.findName().replace(/ /g, '.');
        const password = args[1] || uuid.v4();
        const mailUsername = `${username}@${global.endMail}`

        await interaction.deferReply({
            ephemeral: true
        })

        const succ = await mailHelper.newAccount(mailUsername, password, mailjs)
        if(succ !== true) {
            await interaction.editReply({ content: `Error occured when creating account: \`\`\`cs\n# ${succ}\n\`\`\`` })
            return
        }

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


        await newChannel.send({
            content: `${interaction.user} Created new mail`,
            embeds: [mailEmbed],
            components: [global.defButtons]
        })

        await interaction.editReply({
            content: `${interaction.user} => ${newChannel}`
        })
    },
}