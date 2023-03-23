const { CollaborationsPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const CollaborationsValidator = {
    validateCollaborationPayload: (payload) => {
        const validationResult = CollaborationsPayloadSchema.validate(payload);
        
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = CollaborationsValidator;