require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const ClientError = require('./exceptions/ClientError');

// Albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgresql/AlbumsServices');
const AlbumsValidator = require('./validator/albums');

// Songs
const songs = require('./api/songs');
const SongsService = require('./services/postgresql/SongsServices');
const SongsValidator = require('./validator/songs');

// Users
const users = require('./api/users');
const UsersService = require('./services/postgresql/UsersServices');
const UsersValidator = require('./validator/users');

// Authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgresql/AuthenticationsService');
const TokenManager = require('./tokenize/tokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// Playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgresql/PlaylistsServices');
const PlaylistsValidator = require('./validator/playlists');
const PlaylistsSongsActivitiesService = require('./services/postgresql/PlaylistsSongsActivitiesService');

// Collaborations
const collaborations = require('./api/collaborations');
const CollabortionsService = require('./services/postgresql/CollaborationsServices');
const CollaborationsValidator = require('./validator/collaborations');


const init = async () => {
    const albumsService = new AlbumsService();
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const collaborationService = new CollabortionsService();
    const playlistsService = new PlaylistsService(songsService, collaborationService);
    const playlistSongsActivitiesService = new PlaylistsSongsActivitiesService();

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
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
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
            plugin: playlists,
            options: {
                playlistsService,
                validator: PlaylistsValidator,
                playlistSongsActivitiesService,
            },
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService: collaborationService,
                playlistsService,
                usersService,
                validator: CollaborationsValidator,
            },
        },
    ]);

    server.ext('onPreResponse', (request, h) => {
        // mendapatkan konteks response dari request
        const { response } = request;
        console.log(response);

        if (response instanceof Error) {
            console.log(response.message);
            const { statusCode, message } = response.output.payload;
            if (statusCode === 401 || statusCode === 413 || statusCode === 415) {
                return h.response({
                    status: 'fail',
                    message,
                })
                    .code(statusCode);
            }

            // penanganan client error secara internal.
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: typeof response.message !== "string"
                        ? response.message.toString()
                        : response.message,
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