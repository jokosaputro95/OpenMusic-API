const Joi = require('joi');

const PlaylistsPayloadSchema = Joi.object({
    name: Joi.string().max(50).required(),
  });
  
  const PlaylistSongsPayloadSchema = Joi.object({
    songId: Joi.string().max(50).required(),
  });

module.exports = {
    PlaylistsPayloadSchema,
    PlaylistSongsPayloadSchema
};