const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

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
        return error;   
    }
}

exports.generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

exports.generateProfessionalDiamondID = (vendorName) => {
    const date = new Date();
    const year = date.getFullYear();
    
    // Get Vendor Initials (First 2 letters of vendor name, capitalize)
    const vendorInitials = vendorName.slice(0, 2).toUpperCase();

    // Generate a random 4-digit number or UUID for uniqueness
    const randomElement = uuidv4().slice(0, 4).toUpperCase();
    
    // Format the Diamond ID in a stylish manner
    const diamondID = `DAI-${vendorInitials}-${year}-${randomElement}`;
    
    return diamondID;
};