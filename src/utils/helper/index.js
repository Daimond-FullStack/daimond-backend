const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const serverConfig = require('../../config');

// Hash the password before saving to the database
exports.hashValue = async (password) => {
    const saltRounds = serverConfig.BCRYPT.SALT;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

// Verify password during login
exports.compareHashValue = async (plainTextPassword, hashedPassword) => {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
}

exports.generateJWT = (payload) => {
    const secret = serverConfig.JWT.SECRET;
    const expiresIn = serverConfig.JWT.EXPIRATION;

    const token = jwt.sign(payload, secret, { expiresIn });

    return token;
}

exports.verifyJWT = (token) => {
    try {
        const secret = serverConfig.JWT.SECRET;
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        return null;
    }
}

exports.generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};
