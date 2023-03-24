const autoBind = require('auto-bind');

class CollaborationsHandler {
    constructor(CollaborationsService, PlaylistsService, CollaborationsValidator) {
        this._collaborationsService = CollaborationsService;
        this._playlistsService = PlaylistsService;
        this._collaborationsValidator = CollaborationsValidator;

        autoBind(this);
    }

    async postCollaborationHandler(request, h) {
        this._collaborationsValidator.validateCollaborationsPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistsOwner(playlistId, credentialId);

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
        this._collaborationsValidator.validateCollaborationsPayload(request.payload);

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