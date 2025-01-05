require("dotenv").config();

const serverConfig = {
  SERVER: {
    ENVIRONMENT: String(process.env.ENVIRONMENT),
    PORT: Number(process.env.PORT),
    URL: String(process.env.SERVER_URL)
  },
  SSL: {
    KEY: String(process.env.KEY),
    CERTIFICATE: String(process.env.CERTIFICATE),
  },
  MONGODB: {
    HOST: String(process.env.DB_HOST),
    NAME: String(process.env.DB_NAME)
  },
  LOGGER: {
    PATH: String(process.env.LOGGER_PATH),
    CRON_PATH: String(process.env.CRON_LOGGER_PATH)
  },
  JWT: {
    SECRET: String(process.env.SECRET_KEY),
    EXPIRATION: String(process.env.EXPIRATION)
  },
  CRYPTO: {
    SECRET_KEY: String(process.env.ENCRYPTION_SECRET_KEY),
    IV: String(process.env.ENCRYPTION_IV),
    ALGORITHM: String(process.env.ENCRYPTION_ALGORITHM),
    RANDOM_BYTES: Number(process.env.RANDOM_BYTES)
  },
  NODEMAILER: {
    HOST: String(process.env.HOST),
    USER_NAME: String(process.env.USER_NAME),
    EMAIL: String(process.env.EMAIL),
    PASSWORD: String(process.env.PASSWORD)
  },
  BCRYPT: {
    SALT: Number(process.env.BCRYPT_SALT)
  }
};

module.exports = serverConfig;