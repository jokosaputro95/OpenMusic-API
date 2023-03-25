const InvariantError = require('../../exceptions/InvariantError');
const {
    PlaylistsPayloadSchema,
    PlaylistSongsPayloadSchema,
} = require('./schema');

const PlaylistsValidator = {
    validatePlaylistsPayload: (payload) => {
        const validationResult = PlaylistsPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validatePlaylistSongsPayload: (payload) => {
        const validationResult = PlaylistSongsPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistsValidator;