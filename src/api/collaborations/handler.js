const autoBind = require('auto-bind');

class CollaborationsHandler {
    constructor(CollaborationsService, PlaylistsService, CollaborationsValidator) {
        this._collaborationsService = CollaborationsService;
        this._playlistsService = PlaylistsService;
        this._collaborationsValidator = CollaborationsValidator;

        autoBind(this);
    }

    async postCollaborationHandler(request, h) {
        try {
            this._collaborationsValidator.validateCollaborationPayload(request.payload);
            
            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;

            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            
            const collaborationId = await this._collaborationsService.addCollaborator(playlistId, userId);

            const response = h.response({
                status: 'success',
                message: 'Kolaborasi berhasil ditambahkan',
                data: {
                    collaborationId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error) {
                throw error;
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

    async deleteCollaborationHandler(request, h) {
        try {
            this._collaborationsValidator.validateCollaborationPayload(request.payload);
            
            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;

            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            await this._collaborationsService.deleteCollaborator(playlistId, userId);

            const response = h.response({
                status: 'success',
                message: 'Kolaborasi berhasil dihapus',
            });
            return response;
        } catch (error) {
            if (error) {
                throw error;
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

module.exports = CollaborationsHandler;