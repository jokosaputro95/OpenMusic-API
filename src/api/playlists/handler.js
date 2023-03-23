const autoBind = require('auto-bind');

class PlaylistsHandler {
    constructor(
        playlistsService,
        validator,
        playlistsSongsActivitiesService,
    ) {
        this._playlistsService = playlistsService;
        this._validator = validator;
        this._playlistsSongsActivitiesService = playlistsSongsActivitiesService;

        autoBind(this);
    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload);

        const { name } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        const playlistId = await this._playlistsService.addPlaylist(name, credentialId);

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

        const playlists = await this._playlistsService.getPlaylist(credentialId);

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
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistsOwner(playlistId, credentialId);
        await this._playlistsService.deletePlaylistById(playlistId);

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    async postSongToPlaylistByIdHandler(request, h) {
        this._validator.validatePostsSongInPlaylistPayload(request.payload);

        const { songId } = request.payload;
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

        await this._playlistsService.addSongToPlaylist(playlistId, songId)

        const action = 'add';
        await this._playlistsSongsActivitiesService.activitiesAddSongPlaylist({
            playlistId,
            songId,
            userId: credentialId,
            action,
        });

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke dalam playlist',
        });
        response.code(201);
        return response;
    }

    async getSongsInPlaylistByIdHandler(request, h) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

        const playlist = await this._playlistsService.getSongsFromInPlaylist(playlistId);

        const response = h.response({
            status: 'success',
            data: {
                playlist,
            },
        });
        response.code(200);
        return response;
    }

    async deleteSongsInPlaylistByIdHandler(request, h) {
        this._validator.validateDeleteSongInPlaylistPayload(request.payload);

        const { songId } = request.payload;
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

        await this._playlistsService.deleteSongFromPlaylist(playlistId, songId);

        const action = 'delete';
        await this._playlistsSongsActivitiesService.activitiesAddSongPlaylist({
            playlistId,
            songId,
            userId: credentialId,
            action,
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