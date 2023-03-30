const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'collaborations',
    version: '1.0.0',
    register: async (server, {
        CollaborationsService,
        PlaylistsService,
        CollaborationsValidator,
    }) => {
        const collaborationsHandler = new CollaborationsHandler(
            CollaborationsService,
            PlaylistsService,
            CollaborationsValidator,
        );

        server.route(routes(collaborationsHandler));
    },
};
