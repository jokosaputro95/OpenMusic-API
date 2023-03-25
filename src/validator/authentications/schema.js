const Joi = require('joi');

const PostAuthenticationPayloadSchema = Joi.object({
    username: Joi.string().max(50).required(),
    password: Joi.string().max(100).required(),
});

const PutAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
});

module.exports = {
    PostAuthenticationPayloadSchema,
    PutAuthenticationPayloadSchema,
    DeleteAuthenticationPayloadSchema
};