const { logger } = require('../utils/winston');
const { errorResponse } = require('../utils/responses');

const allowedRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access: User with role ${req.user.role} attempted to access ${req.originalUrl}`);
      return errorResponse(res, null, error.stack, 'Forbidden', 403);
    }
    next();
  };
};

module.exports = allowedRoles;