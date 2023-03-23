const Joi = require('joi');

const PostAuthenticationPayloadSchema = Joi.object({
    username: Joi.string().max(50).required().lowercase(),
    password: Joi.string().required(),
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
    DeleteAuthenticationPayloadSchema,
};