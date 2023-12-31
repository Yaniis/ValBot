const Discord = require('discord.js');
const axios = require('axios');
const { GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { initRole } = require('./functions');
const command = require('./commands');

const Client = new Discord.Client({ partials: ["CHANNEL"], intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]});

const defaultRole = [
    { name: 'Iron 1', color: '#8d8d8d' },
    { name: 'Iron 2', color: '#8d8d8d' },
    { name: 'Iron 3', color: '#8d8d8d' },
    { name: 'Silver 1', color: '#646363' },
    { name: 'Silver 2', color: '#646363' },
    { name: 'Silver 3', color: '#646363' },
    { name: 'Gold 1', color: '#bea614' },
    { name: 'Gold 2', color: '#bea614' },
    { name: 'Gold 3', color: '#bea614' },
    { name: 'Platinum 1', color: '#2e5b97' },
    { name: 'Platinum 2', color: '#2e5b97' },
    { name: 'Platinum 3', color: '#2e5b97' },
    { name: 'Diamond 1', color: '#833a8b' },
    { name: 'Diamond 2', color: '#833a8b' },
    { name: 'Diamond 3', color: '#833a8b' },
    { name: 'Ascendant 1', color: '#33803b' },
    { name: 'Ascendant 2', color: '#33803b' },
    { name: 'Ascendant 3', color: '#33803b' },
    { name: 'Immortal 1', color: '#a01f1f' },
    { name: 'Immortal 2', color: '#a01f1f' },
    { name: 'Immortal 3', color: '#a01f1f' },
    { name: 'Radiant', color: '#ac7303' },
];


Client.on('ready', () => {
    console.log('Bot connecté');
});


Client.on('guildCreate', (server) => {

    initRole(defaultRole, server); // Créé tout les rôles par défaut

});

Client.on('messageCreate', async (message) => {

    let rank;
    let role;
    const regexRank = /^[\w\s]+#[A-Za-z0-9]+$/;
    let correctValue = true;

    const idChannel = '1127772777127084032';

    if ( message.channel.id === idChannel) {
        console.log('Vous êtes dans le bon');
    }

    if(message.content === "") {
        correctValue = false;
    }

    if (!regexRank.test(message.content)){
        correctValue = false;
    }

    if ( correctValue ){

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

            role = message.guild.roles.cache.find(role => role.name === rank);
            console.log(rank);

            const user = message.author;
            const member = message.guild.members.cache.get(user.id);

            if (!role) {
                return message.reply('Impossible de trouver le rôle spécifié')
            }

            if (!member.roles.cache.has(role.id)) { // Vérifie si l'utilisateur ne possède pas déjà le rôle

                member.roles.add(role)
                    .then(() => {

                        let userRole = member.roles.cache.map(r => r);

                        Object.values(userRole).forEach(function (value) {

                            if (defaultRole.some(obj => obj.name === value.name)){ // Vérifie si l'utilisateur ne possède pas déjà un des rôles rank
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

    /**
     *  Commands
     */

    if (!message.content.startsWith('/') || message.author.bot) return;

    if (message.content === '/ResetRoleValorant'){
        command.execute(defaultRole, message.guild, message);
    }


})

Client.login(process.env.TOKEN);