const jwt = require('jsonwebtoken');
const { logger } = require('../utils/winston');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET); 
    req.user = decoded; 

    next(); 
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;