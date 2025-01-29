const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

const CONSTANT = require('../utils/constant');

const allowedRoles = require('../middleware/role.middleware');
const validateRequest = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const { upload } = require('../middleware/multer.middleware');

const userValidator = require('../validations/user.validation');

// Upload Image route
router.post(
    '/upload-image',
    authMiddleware,
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    upload.single('ProfilePic'),
    userController.uploadProfilePic
);

// Remove Image route
router.post(
    '/remove-image',
    authMiddleware,
    validateRequest(userValidator.removeImageSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    userController.removeProfilePic
);

// Registration route
router.post(
    '/register',
    authMiddleware,
    validateRequest(userValidator.registrationSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    userController.registerUser
);

// Activated/Deactivated route
router.post(
    '/update-status',
    authMiddleware,
    validateRequest(userValidator.updateStatusSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    userController.updateUserStatus
);

// Login route
router.post(
    '/login',
    validateRequest(userValidator.loginSchema),
    userController.loginUser
);

// Request Reset User Password route
router.post(
    '/request-reset-password',
    validateRequest(userValidator.requestResetPasswordSchema),
    userController.requestResetUserPassword
);

// Reset User Password route
router.post(
    '/reset-password',
    validateRequest(userValidator.resetPasswordSchema),
    userController.resetUserPassword
);

// User Delete route
router.post(
    '/delete',
    authMiddleware,
    validateRequest(userValidator.deleteUserSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    userController.deleteUser
);

// All User List route
router.post(
    '/all-user',
    authMiddleware,
    validateRequest(userValidator.allUserSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    userController.allUser
);

module.exports = router;