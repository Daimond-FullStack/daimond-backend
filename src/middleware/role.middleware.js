const { logger } = require('../utils/winston');
const { errorResponse } = require('../utils/responses');

const allowedRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      logger.warn(`Unauthorized access: User with role ${req.user.userType} attempted to access ${req.originalUrl}`);
      return errorResponse(res, null, 'Forbidden', 'Forbidden: You do not have permission to access this resource.', 403);
    }
    next();
  };
};

module.exports = allowedRoles;