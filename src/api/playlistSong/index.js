const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'playlistSongs',
    version: '1.0.0',
    register: async (server, { playlistService, songService, playlistSongService, playlistSongsActivitiesService, validator }) => {
        const playlistSongsHandler = new PlaylistSongsHandler(
            playlistService,
            songService,
            playlistSongService,
            playlistSongsActivitiesService,
            validator,
        );
        server.route(routes(playlistSongsHandler));
    },
};