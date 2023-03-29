require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const config = require('./utils/config/config');
const ClientError = require('./exceptions/ClientError');

// Albums
const albums = require('./api/albums');
const albumsValidator = require('./validator/albums');
const AlbumsService = require('./services/postgresql/AlbumsService');

// Songs
const songs = require('./api/songs');
const songsValidator = require('./validator/songs');
const SongsService = require('./services/postgresql/SongsService');

// Authentications
const authentications = require('./api/authentications');
const authenticationsValidator = require('./validator/authentications');
const AuthenticationsService = require('./services/postgresql/AuthenticationsService');
const tokenManager = require('./tokenize/TokenManager');

// Users
const users = require('./api/users');
const usersValidator = require('./validator/users');
const UsersService = require('./services/postgresql/UsersService');

// Playlists
const playlists = require('./api/playlists');
const playlistsValidator = require('./validator/playlists');
const PlaylistsService = require('./services/postgresql/PlaylistsService');
const PlaylistsSongsService = require('./services/postgresql/PlaylistsSongsService');
const PlaylistsSongsActivitiesService = require('./services/postgresql/PlaylistsSongsActivitiesService');

// Collaborations
const collaborations = require('./api/collaborations');
const CollaborationsValidator = require('./validator/collaborations');
const CollaborationsService = require('./services/postgresql/CollaborationsService');

// Exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// Uploads
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// Cache
const CacheService = require('./services/redis/CacheService');

const init = async () => {
    const cacheService = new CacheService();
    const albumsService = new AlbumsService(cacheService);
    const songsService = new SongsService();
    const authenticationsService = new AuthenticationsService();
    const usersService = new UsersService();
    const collaborationsService = new CollaborationsService();
    const playlistsService = new PlaylistsService(collaborationsService);
    const playlistsSongsService = new PlaylistsSongsService();
    const playlistsSongsActivitiesService = new PlaylistsSongsActivitiesService();
    const storageService = new StorageService(path.resolve(__dirname, 'api/albums/file/covers'));

    const server = Hapi.server({
        host: config.app.host,
        port: config.app.port,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // registrasi plugin eksternal
    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ]);

    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    await server.register([
        {
            plugin: albums,
            options: {
                AlbumsService: albumsService,
                SongsService: songsService,
                AlbumsValidator: albumsValidator,
                StorageService: storageService,
                UploadsValidator,
            },
        },
        {
            plugin: songs,
            options: {
                SongsService: songsService,
                SongsValidator: songsValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                AuthenticationsService: authenticationsService,
                UsersService: usersService,
                TokenManager: tokenManager,
                AuthenticationsValidator: authenticationsValidator,
            },
        },
        {
            plugin: users,
            options: {
                UsersService: usersService,
                UsersValidator: usersValidator,
            },
        },
        {
            plugin: playlists,
            options: {
                PlaylistsService: playlistsService,
                PlaylistsSongsService: playlistsSongsService,
                PlaylistsSongsActivitiesService: playlistsSongsActivitiesService,
                PlaylistsValidator: playlistsValidator,
            },
        },
        {
            plugin: collaborations,
            options: {
                CollaborationsService: collaborationsService,
                PlaylistsService: playlistsService,
                CollaborationsValidator,
            },
        },
        {
            plugin: _exports,
            options: {
                ProducerService,
                PlaylistsService: playlistsService,
                ExportsValidator,
            },
        },
    ]);

    server.ext('onPreResponse', (request, h) => {
        // mendapatkan konteks response dari request
        const { response } = request;
        // console.log(response);
        if (response instanceof Error) {
            // penanganan client error secara internal.
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
            if (!response.isServer) {
                return h.continue;
            }

            // penanganan server error sesuai kebutuhan
            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami',
            });
            newResponse.code(500);
            return newResponse;
        }

        // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
