const { logger } = require('../utils/winston');
const { errorResponse } = require('../utils/responses');
const { verifyJWT } = require('../utils/helper');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return errorResponse(res, null, 'Unauthorized', 'Unauthorized: No token provided', 401);
    }

    const decoded = verifyJWT(authHeader);

    if (decoded && decoded.message) {
      return errorResponse(res, null, 'Token Expired', 'Unauthorized: Token has expired. Please login again.', 401);
    }

    req.user = decoded;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return errorResponse(res, error, error.stack, 'Unauthorized: Invalid token', 401);
  }
};

module.exports = authMiddleware;