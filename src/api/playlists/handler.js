const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
    constructor(
        PlaylistsService,
        PlaylistsSongsService,
        PlaylistsSongsActivitiesService,
        PlaylistsValidator
    ) {
        this._playlistsService = PlaylistsService;
        this._playlistsSongsService = PlaylistsSongsService;
        this._playlistsSongsActivitiesService = PlaylistsSongsActivitiesService;
        this._playlistsValidator = PlaylistsValidator;

        autoBind(this);
    }

    async postPlaylistHandler(request, h) {
        try {
            this._playlistsValidator.validatePlaylistsPayload(request.payload);

            const { name } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId });

            const resposne = h.resposne({
                status: 'success',
                message: 'Playlist berhasil ditambahkan',
                data: {
                    playlistId,
                },
            });
            resposne.code(201);
            return resposne;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
        }
    }

    async getPlaylistsHandler(request) {
        const { id: credentialId } = request.auth.credentials;

        const playlists = await this._playlistsService.getPlaylist(credentialId);

        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }

    async deletePlaylistByIdHandler(request, h) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(id, credentialId);
        await this._playlistsService.deletePlaylistById(id);

        return h.response({
            status: 'success',
            message: 'Playlist berhasil dihapus',
        });
    }

    async postSongToPlaylistHandler(request, h) {
        this._playlistsValidator.validateSongPlaylistsPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        const { songId } = request.payload;

        await this._playlistsService.verifyPlaylistAccess(
            playlistId,
            credentialId,
        );

        await this._playlistsSongsService.addSongToPlaylist(playlistId, songId);

        const action = 'add';
        await this._playlistsSongsActivitiesService.activitiesAddSongPlaylist(
            playlistId,
            songId,
            credentialId,
            action
        );

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasl ditambahkan ke dalam playlist',
        });

        response.code(201);
        return response;
    }

    async getSongsFromPlaylistByIdHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;

        await this._playlistsService.verifyPlaylistAccess(
            playlistId,
            credentialId
        );

        const playlist = await this._playlistsSongsService.getSongsFromPlaylist(
            playlistId
        );

        return {
            status: 'success',
            data: {
                playlist,
            },
        };
    }

    async deleteSongFromPlaylistByIdHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;
        const { songId } = request.payload;

        await this._playlistsService.verifyPlaylistAccess(
            playlistId,
            credentialId
        );
        await this._playlistsSongsService.deleteSongFromPlaylist(
            playlistId,
            songId
        );
        const action = 'delete';
        await this._playlistsSongsActivitiesService.activitiesDeleteSongPlaylist(
            playlistId,
            songId,
            credentialId,
            action
        );

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist',
        };
    }

    async getPlaylistActivitiesHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;

        await this._playlistsService.verifyPlaylistAccess(
            playlistId,
            credentialId
        );

        const activities =
            await this._playlistsSongsActivitiesService.getActivitiesSongPlaylist(
                playlistId
            );

        return {
            status: 'success',
            data: activities,
        };
    }
}

module.exports = PlaylistsHandler;