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

        const loginSession = await mailjs.login(mailUsername, password)
        if(!loginSession.status) {
            await interaction.editReply({ content: `Error occured when creating account: \`\`\`cs\n# Could Not Login\n\`\`\`` })
            return
        }

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


        await interaction.editReply({
            content: `Created mail ${newChannel}`
        })
    },
}