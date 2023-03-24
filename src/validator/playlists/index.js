const { PlaylistPayloadSchema, SongsInPlaylistPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
    validatePlaylistsPayload: (payload) => {
        const validationResult = PlaylistPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
    validateSongInPlaylistPayload: (payload) => {
        const validationResult = SongsInPlaylistPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistsValidator;