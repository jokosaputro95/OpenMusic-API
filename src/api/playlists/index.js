const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'playlists',
    version: '1.0.0',
    register: async (
        server,
        {
            playlistsService,
            playlistSongsActivitiesService,
            validator
        }
    ) => {
        const playlistHandler = new PlaylistsHandler(
            playlistsService,
            playlistSongsActivitiesService,
            validator
        );
        server.route(routes(playlistHandler));
    },
};