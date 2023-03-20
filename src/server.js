require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const ClientError = require('./exceptions/ClientError');

// Albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgresql/AlbumsServices');
const AlbumsValidator = require('./validators/albums');

// Songs
const songs = require('./api/songs');
const SongsService = require('./services/postgresql/SongsServices');
const SongsValidator = require('./validators/songs');

// Users
const users = require('./api/users');
const UsersService = require('./services/postgresql/UsersServices');
const UsersValidator = require('./validators/users');

// Authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgresql/AuthenticationsService');
const TokenManager = require('./tokenize/tokenManager');
const AuthenticationsValidator = require('./validators/authentications');

// Playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgresql/PlaylistsServices');
const playlistsValidator = require('./validators/playlists');
const PlaylistsSongsService = require('./services/postgresql/PlaylistsSongsService');
const PlaylistsSongsActivitiesService = require('./services/postgresql/PlaylistsSongsActivitiesService');

// Collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgresql/CollaborationsServices');
const CollaborationsValidator = require('./validators/collaborations');

const init = async () => {
    const albumsService = new AlbumsService();
    const songsService = new SongsService();
    const authenticationsService = new AuthenticationsService();
    const usersService = new UsersService();
    const collaborationsService = new CollaborationsService();
    const playlistsService = new PlaylistsService(collaborationsService);
    const playlistsSongsService = new PlaylistsSongsService();
    const playlistsSongsActivitiesService = new PlaylistsSongsActivitiesService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
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
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
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
                CollaborationsValidator: CollaborationsValidator,
            },
        },
    ]);

    server.ext('onPreResponse', (request, h) => {
        // mendapatkan konteks response dari request
        const { response } = request;
        console.log(response);
        
        if (response instanceof Error) {
            console.log(response.message);

            // penanganan client error secara internal.
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: respons.message,
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
                message: 'Maaf, terjadi kegagalan pada server kami.',
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