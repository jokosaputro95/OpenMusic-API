const Joi = require('joi');

const CollaborationsPayloadSchema = Joi.object({
    playlistId: Joi.string().required(),
    userId: Joi.string().max(50).required(),
});

module.exports = { CollaborationsPayloadSchema };