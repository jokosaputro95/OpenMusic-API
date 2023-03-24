const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'songs',
    version: '1.0.0',
    register: async (server, {songsService, songsValidator}) => {
        const songsHandler = new SongsHandler(songsService, songsValidator);
        server.route(routes(songsHandler));
    },
};