require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumsValidator = require('./validators/albums');
const SongsValidator = require('./validators/songs');
const AlbumsService = require('./services/postgresql/AlbumsServices');

const init = async () => {
    const albumService = new AlbumsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register({
        plugin: albums,
        options: {
            service: albumService,
            validator: AlbumsValidator,
        },
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();