const mongoose = require('mongoose');
const serverConfig = require('../config');
const { logger } = require('../utils/winston');

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(serverConfig.MONGODB.HOST);
        logger.info('='.repeat(57));
        logger.info('🔗 MongoDB Database connection established successfully! ✨');

        return mongoose;
    } catch (error) {
        logger.error('🚨 MongoDB connection error:', error);
        process.exit(1);
    }
};

process.on("unhandledRejection", (error) => {
    logger.error("UNHANDLED REJECTION! 💥 Shutting down... 📴");
    logger.error(error.name, error.message);
    process.exit(1);
});

module.exports = connectToMongoDB;