const autoBind = require('auto-bind');

class PlaylistsHandler {
    constructor(
        PlaylistsService,
        PlaylistsSongsService,
        PlaylistsSongsActivitiesService,
        PlaylistsValidator,

    ) {
        this._playlistsService = PlaylistsService;
        this._playlistsSongsService = PlaylistsSongsService;
        this._playlistsSongsActivitiesService = PlaylistsSongsActivitiesService;
        this._playlistsValidator = PlaylistsValidator;
        
        autoBind(this);
    }

    async postPlaylistsHandler(request, h) {
        this._playlistsValidator.validatePlaylistsPayload(request.payload);

        const { name } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        const playlistId = await this._playlistsService.addPlaylist({name, owner: credentialId});

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;

        const playlists = await this._playlistsService.getPlaylists(credentialId);

        const response = h.response({
            status: 'success',
            data: {
                playlists,
            },
        });
        response.code(200);
        return response;
    }

    async deletePlaylistByIdHandler(request, h) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistsOwner(id, credentialId);
        await this._playlistsService.deletePlaylistById(id);

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    async postSongToPlaylistByIdHandler(request, h) {
        this._playlistsValidator.validateSongInPlaylistPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        const { songId } = request.payload;

        await this._playlistsService.verifyPlaylistsAccess(playlistId, credentialId);
        await this._playlistsSongsService.addSongToPlaylist(playlistId, songId);

        await this._playlistsSongsActivitiesService.activitiesAddSongPlaylist(playlistId, songId, credentialId);

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke dalam playlist',
        });
        response.code(201);
        return response;
    }

    async getSongsFromPlaylistByIdHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;

        await this._playlistsService.verifyPlaylistsAccess(playlistId, credentialId);

        const playlist = await this._playlistsSongsService.getSongsFromPlaylist(playlistId);

        const response = h.response({
            status: 'success',
            data: {
                playlist,
            },
        });
        response.code(200);
        return response;
    }

    async deleteSongsFromPlaylistByIdHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        const { songId } = request.payload;

        await this._playlistsService.verifyPlaylistsAccess(playlistId, credentialId);
        await this._playlistsSongsService.deleteSongFromPlaylist(playlistId, songId);

        const action = 'delete';
        await this._playlistsSongsActivitiesService.activitiesAddSongPlaylist({
            playlistId, songId, userId: credentialId, action,
        });

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist',
        });
        response.code(200);
        return response;
    }

    async getPlaylistActivitiesByIdHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

        const activities = await this._playlistsSongsActivitiesService.getActivitiesSongPlaylist(playlistId);

        const response = h.response({
            status: 'success',
            data: activities,
        });
        return response;
    }
}

module.exports = PlaylistsHandler;