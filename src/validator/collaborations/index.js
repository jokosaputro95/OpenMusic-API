const InvariantError = require('../../exceptions/InvariantError');
const { CollaborationsPayloadSchema } = require('./schema');

const CollaborationsValidator = {
    validateCollaborationsPayload: (payload) => {
        const validationResult = CollaborationsPayloadSchema.validate(payload);
        
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = CollaborationsValidator;