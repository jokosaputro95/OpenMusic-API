const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'albums',
    version: '1.0.0',
    register: async (server, {
        AlbumsService, SongsService, AlbumsValidator, StorageService, UploadsValidator,
    }) => {
        const albumsHandler = new AlbumsHandler(
            AlbumsService,
            SongsService,
            AlbumsValidator,
            StorageService,
            UploadsValidator,
        );

        server.route(routes(albumsHandler));
    },
};
