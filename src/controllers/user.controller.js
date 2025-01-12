const userService = require('../services/user.service');

const { successResponse, errorResponse } = require('../utils/responses');

const uploadProfilePic = async (req, res) => {
    try {
        const user = await userService.upload(req);

        if (!user) return;

        return successResponse(res, user, 'User profile uploaded successfully.', 201);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const removeProfilePic = async (req, res) => {
    try {
        const user = await userService.remove(req);

        if (!user) return;

        return successResponse(res, user, 'User profile removed successfully.', 201);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const registerUser = async (req, res) => {
    try {
        const user = await userService.register(req, res);

        if (!user) return;

        return successResponse(res, user, 'User registered successfully.', 201);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const user = await userService.updateStatus(req);

        if (!user) return;

        return successResponse(res, user, 'User status updated successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const loginUser = async (req, res) => {
    try {
        const user = await userService.login(req, res);

        if (!user) return;

        return successResponse(res, user, 'User login successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const requestResetUserPassword = async (req, res) => {
    try {
        const user = await userService.requestResetPassword(req, res);

        if (!user) return;

        return successResponse(res, user, 'Email has been sent successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const resetUserPassword = async (req, res) => {
    try {
        const user = await userService.resetPassword(req, res);

        if (!user) return;

        return successResponse(res, user, 'Password Reset Successful.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await userService.deletation(req, res);

        if (!user) return;

        return successResponse(res, user, 'User deleted successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const allUser = async (req, res) => {
    try {
        const user = await userService.all(req, res);

        if (!user) return;

        return successResponse(res, user, 'User fetched successfully.', 200);
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    uploadProfilePic,
    removeProfilePic,
    registerUser,
    updateUserStatus,
    loginUser,
    requestResetUserPassword,
    resetUserPassword,
    deleteUser,
    allUser
};