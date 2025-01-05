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
            return res.status(400).json({ errors: errorMessages });
        }

        next();
    };
}

module.exports = validateRequest;