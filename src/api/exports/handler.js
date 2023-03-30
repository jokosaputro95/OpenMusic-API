const autoBind = require('auto-bind');

class ExportsHandler {
    constructor(ProducerService, PlaylistsService, ExportsValidator) {
        this._producerService = ProducerService;
        this._playlistsService = PlaylistsService;
        this._exportsValidator = ExportsValidator;

        autoBind(this);
    }

    async postToExportPlaylistHandler(request, h) {
        this._exportsValidator.validateExportPlaylistsPayload(request.payload);

        const { id: credentialId } = request.auth.credentials;
        const { playlistId } = request.params;

        await this._playlistsService.verifyPlaylistsOwner(playlistId, credentialId);

        const message = {
            playlistId,
            targetEmail: request.payload.targetEmail,
        };

        await this._producerService.sendMessage(
            'export:playlist',
            JSON.stringify(message),
        );

        const response = h.response({
            status: 'success',
            message: 'Permintaan Anda dalam antrian',
        });

        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;
