const Discord = require('discord.js');
const axios = require('axios');
const { GatewayIntentBits  } = require('discord.js');
const config = require('./config.json');

const Client = new Discord.Client({ partials: ["CHANNEL"], intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]});


Client.on('ready', () => {
    console.log('Bot connecté');
});

const roles = {
    'Platinum 1' : '1127764285473427456',
    'Immortal 3' : '1127764391069233172'
};

Client.on('messageCreate', async (message) => {

    let rank;
    let role;
    const regexRank = /^[\w\s]+#[A-Za-z0-9]+$/;
    let value = true;

    if(message.content === "") {
        value = false;
    }

    if (!regexRank.test(message.content)){
        value = false;
    }

    if (value){

        let username = message.content.split("#")[0];
        let tag = message.content.split("#")[1];
        let urlApi = `https://api.kyroskoh.xyz/valorant/v1/mmr/EU/${username}/${tag}`;

        axios.get(urlApi, {
            headers: {
                'Access-Control-Allow-Origin' : '*'
            }
        }).then(response => {
            let text = response.data;
            rank = text.split(" - ")[0];

            role = message.guild.roles.cache.get(roles[rank]);

            const user = message.author;
            const member = message.guild.members.cache.get(user.id);

            if (!role) {
                return message.reply('Impossible de trouver le rôle spécifié')
            }

            if (!member.roles.cache.has(role.id)) { // Vérifie si l'utilisateur ne possède pas déjà le rôle

                member.roles.add(role)
                    .then(() => {

                        let userRole = member.roles.cache.map(role => role.id);

                        Object.values(roles).forEach(function (value) {

                            if (userRole.includes(value) && value !== role.id){ // Vérifie si l'utilisateur ne possède pas déjà un des rôles rank
                                member.roles.remove(value);
                                return; // Arrête la boucle
                            }

                        })

                        message.reply(`Tu possèdes le rang : ${rank}, ton rôle t'as été attribué`);

                    })

            } else {
                message.reply(`Ton rang est toujours : ${rank}`);
            }


        }).catch(error => {
            message.reply("Aucun utilisateur n'existe avec cet identifiant");
        });

    }

})

Client.login(config.token);