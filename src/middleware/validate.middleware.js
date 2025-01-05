const { errorResponse } = require('../utils/responses');
const { logger } = require('../utils/winston');

function validateRequest(schema) {
    return (req, res, next) => {
        if (!schema) {
            return next();
        }

        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            logger.error('Request body validation error : ', errorMessages);
            return errorResponse(res, { errors: errorMessages }, error.stack, 'Request body validation error.', 400);
        }

        next();
    };
}

module.exports = validateRequest;