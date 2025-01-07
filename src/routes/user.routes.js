const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

const CONSTANT = require('../utils/constant');

const allowedRoles = require('../middleware/role.middleware');
const validateRequest = require('../middleware/validate.middleware');

const { registrationSchema, updateStatusSchema, loginSchema, requestResetPasswordSchema, resetPasswordSchema, deleteUserSchema } = require('../validations/user.validation');
const authMiddleware = require('../middleware/auth.middleware');

// Registration route
router.post(
    '/register',
    authMiddleware,
    validateRequest(registrationSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    userController.registerUser
);

// Activated/Deactivated route
router.post(
    '/update-status',
    authMiddleware,
    validateRequest(updateStatusSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    userController.updateUserStatus
);

// Login route
router.post(
    '/login',
    validateRequest(loginSchema),
    userController.loginUser
);

// Request Reset User Password route
router.post(
    '/request-reset-password',
    validateRequest(requestResetPasswordSchema),
    userController.requestResetUserPassword
);

// Reset User Password route
router.post(
    '/reset-password',
    validateRequest(resetPasswordSchema),
    userController.resetUserPassword
);

// User Delete route
router.post(
    '/delete',
    authMiddleware,
    validateRequest(deleteUserSchema),
    allowedRoles([CONSTANT.USER_TYPES.ADMIN]),
    userController.deleteUser
);

module.exports = router;