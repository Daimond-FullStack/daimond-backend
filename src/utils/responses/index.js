const { logger } = require('../winston');

const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  logger.info(`${statusCode} - ${message}`);
  return res.status(statusCode).json({ status: 'Success', message, data });
};

const errorResponse = (res, error, stack = '', message = 'Error', statusCode = 500) => {
  logger.error(`${statusCode} - ${message} - ${stack} - ${error}`);
  return res.status(statusCode).json({ status: 'Error', message, stack, error });
};

module.exports = {
  successResponse,
  errorResponse
};