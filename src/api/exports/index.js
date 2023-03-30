const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'exports',
    version: '1.0.0',
    register: async (server, { ProducerService, PlaylistsService, ExportsValidator }) => {
        const exportsHandler = new ExportsHandler(
            ProducerService,
            PlaylistsService,
            ExportsValidator,
        );

        server.route(routes(exportsHandler));
    },
};
