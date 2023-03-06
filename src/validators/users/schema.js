const Joi = require('joi');

const UserPayloadSchema = Joi.object({
    username: Joi.string().max(30).required().lowercase(),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
});

module.exports = { UserPayloadSchema }