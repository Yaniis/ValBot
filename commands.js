const { initRole } = require('./functions');

module.exports = {
    name: 'ResetRoleValorant',
    description: 'Réinitialise tous les rangs liés à Valorant',
    async execute(list, server, message) {
        // Vérifier si l'utilisateur est un administrateur

        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send('Seuls les administrateurs peuvent exécuter cette commande.');
        }

        const roleNamesToDelete = list.map(roleData => roleData.name);
        const rolesToDelete = server.roles.cache.filter(role => roleNamesToDelete.includes(role.name));

        const progressMessage = await message.channel.send('Suppression des rôles en cours...');

        const deletionPromises = rolesToDelete.map(role => role.delete());
        await Promise.all(deletionPromises);

        // Vérifier les résultats des suppressions
        let successfulDeletions = [];
        let failedDeletions = [];
        for (let i = 0; i < deletionPromises.length; i++) {
            const deletionResult = deletionPromises[i];
            if (deletionResult.status === 'fulfilled') {
                successfulDeletions.push(rolesToDelete[i]);
            } else {
                failedDeletions.push(rolesToDelete[i]);
            }
        }

        let completionMessage = 'Suppression des rôles terminée. Les rôles ont été réinitialisés.';
        if (failedDeletions.length > 0) {
            completionMessage += `\nCertains rôles n'ont pas pu être supprimés : ${failedDeletions.map(role => role.name).join(', ')}`;
        }
        await progressMessage.edit(completionMessage);

        if (rolesToDelete.size === 0) {
            initRole(list, server);
        }
    },
};
