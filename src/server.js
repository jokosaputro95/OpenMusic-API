require('dotenv').config();
const Hapi = require('@hapi/hapi');

// Albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgresql/AlbumsServices');
const AlbumsValidator = require('./validators/albums');

// Songs
const songs = require('./api/songs');
const SongsService = require('./services/postgresql/SongsServices');
const SongsValidator = require('./validators/songs');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
    const albumsService = new AlbumsService();
    const songsService = new SongsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumsService,
                validator: AlbumsValidator,
            },
        },
        {
            plugin: songs,
               options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
    ]);

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;
        
        if (response instanceof ClientError) {
            const newResponse = h.response({
                status: 'fail',
                message: respons.message,
            });
            newResponse.code(respons.statusCode);
            return newResponse;
        }
        return response.continue || response;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();