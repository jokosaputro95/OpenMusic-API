const autoBind = require('auto-bind');

class CollaborationsHandler {
    constructor(collaborationsService, playlistsService, usersService, validator) {
        this._collaborationsService = collaborationsService;
        this._playlistsService = playlistsService;
        this._usersService = usersService;
        this._validator = validator;

        autoBind(this);
    }

    async postCollaborationHandler(request, h) {
        this._validator.validateCollaborationPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistsOwner(playlistId, credentialId);
        await this._usersService.getUserById(userId);

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
    }

    async deleteCollaborationHandler(request, h) {
        this._validator.validateCollaborationPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistsOwner(playlistId, credentialId);
        await this._collaborationsService.deleteCollaborator(playlistId, userId);

        const response = h.response({
            status: 'success',
            message: 'Kolaborasi berhasil dihapus',
        });
        response.code(200);
        return response;
    }
}

module.exports = CollaborationsHandler;