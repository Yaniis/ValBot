function initRole(list, server) {

    list.forEach(roleData => {

        server.roles.create({
            name: roleData.name,
            color: roleData.color,
            mentionable: true,
            managed: false,
        })
            .then( (r) => {
                console.log(`Le rôle ${r.name} a été créé dans le serveur ${server.name}.`);
            })
            .catch(console.error);
    });

}

module.exports = {
    initRole
}