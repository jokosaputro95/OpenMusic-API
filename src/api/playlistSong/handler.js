const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler {
    constructor(playlistService, songService, playlistSongService, playlistSongsActivitiesService, validator) {
        this._playlistService = playlistService;
        this._songService = songService;
        this._playlistSongService = playlistSongService;
        this._playlistSongsActivitiesService = playlistSongsActivitiesService;
        this._validator = validator;

        autoBind(this);
    }

    async postPlaylistSongsHandler(request, h) {
        try {
            this._validator.validatePlaylistSongPayload(request.payload);

            const { songId } = request.payload;
            const { id: credentialId } = request.auth.credentials;
            const { id: playlistId } = request.params;

            await this._songService.getSongById(songId);
            await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
            await this._playlistSongService.addPlaylistSong(playlistId, { songId });

            const action = 'add';
            await this._playlistSongsActivitiesService.addPlaylistSongActivities(playlistId, {
                songId, userId: credentialId, action,
            });

            const response = h.response({
                status: 'success',
                message: 'Playlist song berhasil ditambahkan',
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server Error!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async getPlaylistSongsHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistService.verifyPlaylistAccess(id, credentialId);
            const playlist = await this._playlistSongService.getPlaylistSong(id);

            const response = h.response({
                status: 'success',
                data: {
                    playlist,
                },
            });
            // response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server Error!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }

    async deletePlaylistSongsHandler(request, h) {
        try {
            this._validator.validatePlaylistSongPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { songId } = request.payload;
            const { id } = request.params;

            await this._playlistService.verifyPlaylistAccess(id, credentialId);
            await this._playlistSongService.deletePlaylistSong(id, songId);

            const action = 'delete';
            await this._playlistSongsActivitiesService.addPlaylistSongActivities(id, {
                songId, userId: credentialId, action,
            });

            const response = h.response({
                status: 'success',
                message: 'Playlist song berhasil dihapus',
            });
            response.code(200);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }

            // Server Error!
            const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(500);
            console.error(error);
            return response;
        }
    }
}

module.exports = PlaylistSongsHandler;