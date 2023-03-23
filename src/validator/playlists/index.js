const { PlaylistsPayloadSchema, PlaylistSongsPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
    validatePlaylistPayload: (payload) => {
        const validationResult = PlaylistsPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validatePostSongPlaylistPayload: (payload) => {
        const validationResult = PlaylistSongsPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateDeleteSongPlaylistPayload: (payload) => {
        const validationResult = PlaylistSongsPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistsValidator;