const autoBind = require('auto-bind');
const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
    constructor(collaborationsService, playlistService, usersService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistService = playlistService;
        this._usersService = usersService;
        this._validator = validator;

        autoBind(this);
    }

    async postCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { playlistId, userId } = request.payload;
            const { id: credentialId } = request.auth.credentials;
            
            await this._usersService.getUserById(userId);

            await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
            const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

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

    async deleteCollaborationHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { playlistId, userId } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
            await this._collaborationsService.deleteCollaboration(playlistId, userId);

            const response = h.response({
                status: 'success',
                message: 'Kolaborasi berhasil dihapus',
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

module.exports = CollaborationsHandler;