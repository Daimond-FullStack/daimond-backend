require("dotenv").config();

const serverConfig = {
  SERVER: {
    ENVIRONMENT: String(process.env.ENVIRONMENT),
    PORT: Number(process.env.PORT),
    URL: String(process.env.SERVER_URL),
    CLIENT: String(process.env.CLIENT_URL)
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
  },
  MULTER: {
    PATH: String(process.env.MULTER_PATH)
  },
  COMPANY: {
    INFORMATON: {
      PERSONAL: {
        NAME: String(process.env.COMAPANY_NAME),
        ADDRESS: String(process.env.COMAPANY_ADDRESS),
        LOCATION: String(process.env.COMAPANY_LOCATION),
        PHONE_NUMBER: String(process.env.COMAPANY_PHONE_NUMBER),
        EMAIL: String(process.env.COMAPANY_EMAIL)
      },
      BANK: {
        NAME: String(process.env.BANK_NAME),
        ADDRESS: String(process.env.BANK_ADDRESS),
        ACCOUNT_NUMBER: String(process.env.BANK_ACCOUNT_NUMBER),
        ABA_ROUTING_NUMBER: String(process.env.BANK_ABA_ROUTING_NUMBER),
        SWIFT_CODE: String(process.env.BANK_SWIFT_CODE)
      }
    }
  }
};

module.exports = serverConfig;