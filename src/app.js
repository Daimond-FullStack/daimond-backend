const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");

require('./models');
const serverConfig = require("./config");
const { logger } = require("./utils/winston");
const connectToExpress = require("./connections/express.connection");
const connectToMongoDB  = require("./connections/mongoose.connection");

secureTokens = module.exports = new Map();

// Configuration
const PORT = serverConfig.SERVER.PORT;
const URL = serverConfig.SERVER.URL;
const ENVIRONMENT = serverConfig.SERVER.ENVIRONMENT;

// Initialize express app and server
const app = express();

let server;
if (serverConfig.SSL.KEY && serverConfig.SSL.CERTIFICATE) {
    server = https.createServer({
        key: fs.readFileSync(serverConfig.SSL.KEY),
        cert: fs.readFileSync(serverConfig.SSL.CERTIFICATE)
    }, app);
} else {
    server = http.createServer(app);
}

// Connect to MongoDB and start the server
async function initializeServer() {
    try {
        // Connect to MongoDB database
        await connectToMongoDB()
            .then(() => {
                logger.info("💚 MongoDB Database connected successfully. ✨");
            })
            .catch((error) => {
                logger.error("🚨 MongoDB connection error:", error);
                throw new Error("Failed to connect to MongoDB");
            });

        // Connect to Express configurations
        await connectToExpress(app)
            .then(() => {
                logger.info("🚀 Express initialized successfully. ✨");
            })
            .catch((error) => {
                logger.error("🚨 Express initialization error:", error);
                throw new Error("Failed to initialize Express");
            });

        // Start the server
        server.listen(PORT, () => {
            logger.info(`🌐 Server Started on 🖥️  ${URL} ✨`);
            logger.info(`🌍 Environment: ${ENVIRONMENT} ✨`);
            logger.info('='.repeat(57));
        });

    } catch (error) {
        logger.error('📉 Failed to start server:', error);
        process.exit(1);
    }
}

initializeServer();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('🔄 SIGTERM received. Shutting down gracefully');

    server.close(() => {
        logger.info('🔄 HTTP server closed');
    });

    try {
        process.exit(0);
    } catch (error) {
        logger.error('🚨 Error during shutdown:', error);
        process.exit(1);
    }
});