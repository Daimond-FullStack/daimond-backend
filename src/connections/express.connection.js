const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { v4: uuidv4 } = require('uuid');

// const routes = require('../routes');
// const { logger } = require('../utils/winston');
// const { Decrypt } = require('../utils/crypto');

const connectToExpress = async (app) => {
  try {
    app.use(helmet());

    app.use(express.json({ limit: "50mb", type: ["application/json", "text/plain"] }));

    app.use(cors());

    app.use(express.urlencoded({ extended: true }));

    app.use("/health", async (req, res, next) => {
      res.status(200).json({
        statusCode: 200,
        status: '💚 Healthy',
        message: new Date().toISOString()
      });
    });

    // app.use(async (req, res, next) => {
    //   logger.info('='.repeat(57));

    //   const startTime = Date.now();
    //   const requestId = uuidv4();

    //   const remoteAddress = req.headers['remoteaddress'] || req.headers['RemoteAddress'];

    //   if (!remoteAddress) {
    //     logger.error(`❌ [Request ID: ${requestId}] Missing remote address in headers 🚫`);
    //     return sendError(res, 400, "Missing remote address in headers", {});
    //   }

    //   const systemSecret = Decrypt(remoteAddress);
    //   const [systemKey, ip] = systemSecret ? systemSecret?.split('|') : [null, null];

    //   if (systemKey == null && ip == null) {
    //     logger.error(`❌ [Request ID: ${requestId}] Invalid remote address in headers 🚫`);
    //     return sendError(res, 400, "Invalid remote address in headers", {});
    //   }

    //   // Log the request details with the unique request ID
    //   logger.info(`🔔 [Request ID: ${requestId}] New Request Info: ${req.method} ${req.path} 🌐`);
    //   logger.info(`📡 [Request ID: ${requestId}] Client IP: ${ip}`);
    //   logger.info(`🔑 [Request ID: ${requestId}] System Key: ${systemKey}`);
    //   logger.info(`📋 [Request ID: ${requestId}] Headers: ${JSON.stringify(req.headers)}`);
    //   logger.info(`📦 [Request ID: ${requestId}] Body: ${JSON.stringify(req.body)}`);

    //   // Override res.send to include response logs
    //   const originalSend = res.send;
    //   res.send = (body) => {
    //     try {
    //       const parsedBody = JSON.parse(body);
    //       logger.info(
    //         `✅ [Request ID: ${requestId}] ⏱ Response Info: ${res.statusCode} - Status: ${parsedBody.status
    //         } - Message: ${parsedBody.message} 📤`
    //       );
    //     } catch (error) {
    //       logger.warn(`⚠️ [Request ID: ${requestId}] Response could not be parsed as JSON.`);
    //       logger.info(`[Request ID: ${requestId}] ⏱ Response Info: ${res.statusCode} 📤`);
    //     }

    //     logger.info(`📡 [Request ID: ${requestId}] Client IP: ${ip}`);
    //     logger.info(`🔑 [Request ID: ${requestId}] System Key: ${systemKey}`);

    //     const duration = Date.now() - startTime;
    //     logger.info(`⏳ [Request ID: ${requestId}] Response to ${req.originalUrl} completed in ${duration}ms 🕒`);

    //     // Call the original res.send
    //     originalSend.call(res, body);
    //     logger.info('='.repeat(57));
    //   };

    //   next();
    // });

    /** Application API Routes */
    // app.use('/api', routes);

    // Error handlers
    process.on("unhandledRejection", (error) => {
      logger.info("UNHANDLED REJECTION! 💥 Shutting down... 📴");
      logger.info(error.name, error.message);
      process.exit(1);
    });

    process.on("uncaughtException", (error) => {
      logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down... 📴");
      logger.error(error.name, error.message);
      process.exit(1);
    });
  } catch (error) {
    logger.error("🚨 Server connection error : ", error);
  }
}

module.exports = connectToExpress;