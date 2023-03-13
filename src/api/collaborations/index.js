const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'collaborations',
    version: '1.0.0',
    register: async (server, {
        collaborationsService,
        playlistService,
        usersService,
        validator,
    }) => {
        const collaborationsHandler = new CollaborationsHandler(
            collaborationsService,
            playlistService,
            usersService,
            validator,
        );

        server.route(routes(collaborationsHandler));
    },
};