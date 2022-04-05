const DiscordJS = require('discord.js');
const mailjs = new (require("@cemalgnlts/mailjs"))();
const uuid = require('uuid');
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
        const username = args[0] || uuid.v4().replace(/-/g, '');
        const password = args[1] || uuid.v4();
        const mailUsername = `${username}@${global.endMail}`

        await interaction.deferReply({
            ephemeral: true
        })

        const newAccount = await mailjs.register(mailUsername, password)

        if(!newAccount.status) {
            let errMsg = JSON.parse(newAccount.data).violations[0].message
            //more readable error message
            if(errMsg === 'This value is already used.') errMsg = 'This username is already used.'
            await interaction.editReply({ content: `Error occured when creating account: \`\`\`cs\n# ${errMsg}\n\`\`\`` })
            return
        }

        const loginSession = await mailjs.login(mailUsername.toLowerCase(), password)
        if(!loginSession.status) {
            await interaction.editReply({ content: `Error occured when creating account: \`\`\`cs\n# Could Not Login\n\`\`\`` })
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

        const buttons = new DiscordJS.MessageActionRow()
            .addComponents(
                new DiscordJS.MessageButton()
                    .setCustomId('refresh')
                    .setEmoji('🔄')
                    .setLabel('Refresh Mail')
                    .setStyle(DiscordJS.Constants.MessageButtonStyles.SUCCESS)
            )
            .addComponents(
                new DiscordJS.MessageButton()
                    .setCustomId('delete')
                    .setLabel('Delete Mail Account')
                    .setStyle(DiscordJS.Constants.MessageButtonStyles.DANGER)
            )

        await newChannel.send({
            content: `${interaction.user} Created new mail`,
            embeds: [mailEmbed],
            components: [buttons]
        })

        await interaction.editReply({
            content: `${interaction.user} => ${newChannel}`
        })
    },
}