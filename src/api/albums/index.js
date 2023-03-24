const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'albums',
    version: '1.0.0',
    register: async (server, { AlbumsService, SongsService, AlbumsValidator }) => {
        const albumsHandler = new AlbumsHandler(
            AlbumsService,
            SongsService,
            AlbumsValidator,
        );
        server.route(routes(albumsHandler));
    },
};