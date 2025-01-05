const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf } = format;
const fs = require('fs');
const path = require('path');
const serverConfig = require('../../config');

const logFormat = printf(({ level, message, timestamp, ...info }) => {
  const meta = info && Object.keys(info).length > 0 ? ` | ${JSON.stringify(info)}` : '';
  return `${timestamp} [${level.toUpperCase()}]: ${message}${meta}`;
});

const createLoggerInstance = (logDir) => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const getDailyLogFilePath = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentHour = new Date().getHours();
    const folderPath = path.join(logDir, currentDate);
    const filePath = path.join(folderPath, `${currentHour}.log`);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    return filePath;
  };

  const logger = createLogger({
    level: 'debug',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
      new transports.Console(),
      new transports.File({ filename: getDailyLogFilePath(logDir) }),
    ],
  });

  return {
    info(message, meta) {
      logger.info(message, meta);
    },
    warn(message, meta) {
      logger.warn(message, meta);
    },
    error(message, meta) {
      logger.error(message, meta);
    },
    debug(message, meta) {
      logger.debug(message, meta);
    },
  };
};

const logger = createLoggerInstance(serverConfig.LOGGER.PATH); // Application logger
const cronLogger = createLoggerInstance(serverConfig.LOGGER.CRON_PATH); // Cron logger

module.exports = { logger, cronLogger };