const multer = require('multer');
const path = require('path');
const fs = require('fs');

const serverConfig = require('../config');

// Helper function to ensure a directory exists
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Validate file extension
const isValidExtension = async (mimetype, allowedExtension) => {
  return allowedExtension.includes(mimetype);
};

// Validate file size
const isValidFileSize = async (fileSize, maxSize) => {
  return fileSize <= maxSize;
};

// Insert spaces between camel case words
function insertSpacesBetweenWords(fieldName) {
  return fieldName
    .replace(/[^a-zA-Z0-9.]/g, '_') // Replace invalid characters
    .replace(/\.[^.]+$/, '').toLowerCase();
}

// Validate file fields, size, and type
const validateFile = async (responseObj, file, fieldName, allowedExtension, maxSizeInMb) => {
  let error = '';
  let isValidFile = true;
  responseObj.statusCode = 400;

  const field = insertSpacesBetweenWords(fieldName);

  if (!file) {
    isValidFile = false;
    error = `The ${field} field is required.`;
  } else if (file.fieldname !== fieldName) {
    isValidFile = false;
    error = `The ${field} field is required.`;
  } else {
    // Validate extension
    if (allowedExtension.length > 0) {
      let extension = path.extname(file.originalname).toLowerCase();
      if (extension.length === 1) {
        const fileNameParts = file.mimetype.split('/');
        extension = `.${fileNameParts[1]}`;
      }
      const isValidExt = await isValidExtension(extension, allowedExtension);

      if (!isValidExt) {
        isValidFile = false;
        error = `The type of ${field} must be ${allowedExtension.join('/')}.`;
      }
    }

    // Validate file size
    if (maxSizeInMb) {
      const isValidSize = await isValidFileSize(file.size, maxSizeInMb * 1024 * 1024);

      if (!isValidSize) {
        isValidFile = false;
        error = `Please select a ${field} which has a size up to ${maxSizeInMb.toString()} MB.`;
      }
    }
  }

  if (!isValidFile) {
    return error;
  }
};

// Store files locally
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const baseDirectory = serverConfig.MULTER.PATH;
    ensureDirectoryExists(baseDirectory);

    // Construct the dynamic path
    let subDirectory = `${baseDirectory}`;
    if (file?.role && file?.id) {
      subDirectory += `/${file.role}/${file.id}`;
    }
    subDirectory += `/${file.fieldname}`;

    // Ensure the directory exists
    ensureDirectoryExists(subDirectory);

    cb(null, subDirectory);
  },
  filename: function (req, file, cb) {
    const sanitizedFilename = file.originalname
      .replace(/[^a-zA-Z0-9.]/g, '_') // Replace invalid characters
      .replace(/\.[^.]+$/, '').toLowerCase();
    const uniqueIdentifier = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${sanitizedFilename}_${uniqueIdentifier}${extension}`);
  },
});

// Middleware for local uploads
const upload = multer({ storage: storage });

// Delete local file
const deleteLocalFile = async (fileUrl) => {
  try {
    // Extract the relative path from the URL
    const filePath = fileUrl.replace(/\\/g, '/').split('public/')[1];
    const normalizedPath = path.join(__dirname, 'public', filePath);

    if (fs.existsSync(normalizedPath)) {
      fs.unlinkSync(normalizedPath);
      logger.info('File deleted successfully:', normalizedPath);
    } else {
      logger.info('File not found:', normalizedPath);
    }
  } catch (error) {
    logger.error('Error deleting file:', error.message);
  }
};

module.exports = { validateFile, upload, deleteLocalFile };
