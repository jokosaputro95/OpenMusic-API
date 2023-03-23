const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
    name: Joi.string().required(),
});

const SongsInPlaylistPayloadSchema = Joi.object({
    songId: Joi.string().required(),
});

module.exports = { PlaylistPayloadSchema, SongsInPlaylistPayloadSchema };