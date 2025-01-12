const serverConfig = require("../config");
const { deleteLocalFile } = require("../middleware/multer.middleware");
const { ROLES_AND_PERMISSION } = require("../utils/constant");
const { findOne, create, update, deleteMany, find, countDocuments } = require("../utils/database");
const { sendEmail } = require("../utils/email");
const { hashValue, generateJWT, compareHashValue, generateRandomToken } = require("../utils/helper");
const { errorResponse } = require("../utils/responses");

const upload = async (req, res) => {
    try {
        const file = req.file;

        const filePath = (file?.destination + '/' + file?.filename).replace('.', '');

        return filePath;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const remove = async (req, res) => {
    try {
        const payload = req.body;

        const deleteProfile = await deleteLocalFile(payload.url);

        return deleteProfile;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const register = async (req, res) => {
    try {
        const payload = req.body;

        const verifyUser = await findOne({ model: 'User', query: { email: payload.email, isDeleted: false } });

        if (verifyUser) {
            return errorResponse(res, null, 'Already Exist', 'User already exists.', 400);
        }

        payload.password = await hashValue(payload.password);

        const createUser = await create({ model: 'User', data: payload });

        return createUser;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const updateStatus = async (req, res) => {
    try {
        const payload = req.body;

        const verifyUser = await findOne({ model: 'User', query: { _id: payload.userId, isDeleted: false } });

        if (!verifyUser) {
            return errorResponse(res, null, 'Not Found', 'No account found, contact your admin.', 404);
        }

        let updateObj = {};
        if (verifyUser.isActive) {
            updateObj.isActive = false;
            updateObj.deactivatedAt = new Date();
        } else {
            updateObj.isActive = true;
            updateObj.activatedAt = new Date();
        }

        const updateUser = await update({ model: 'User', query: { _id: payload.userId }, updateData: { $set: updateObj } });

        return updateUser;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const login = async (req, res) => {
    try {
        const payload = req.body;

        const verifyUser = await findOne({ model: 'User', query: { email: payload.email, isDeleted: false } });

        if (!verifyUser) {
            return errorResponse(res, null, 'Not Found', 'No account found, contact your admin.', 404);
        }

        if (!verifyUser.isActive) {
            return errorResponse(res, null, 'Deactivated User', 'Your account is deactivated. Please contact your administrator for assistance.', 400);
        }

        if (!await compareHashValue(payload.password, verifyUser.password)) {
            return errorResponse(res, null, 'Invalid  Password', 'The password you entered is incorrect.', 400);
        }

        let updateObj = {};
        updateObj.loginAt = new Date();
        updateObj.loginSystemKey = payload.loginSystemKey;
        updateObj.loginIp = payload.loginIp;

        const updateUser = await update({ model: 'User', query: { _id: verifyUser._id }, updateData: { $set: updateObj } });

        const accessToken = generateJWT({
            userId: updateUser._id,
            name: updateUser.fullName,
            userType: updateUser.userType,
            secretKey: updateUser.loginSystemKey,
            ip: updateUser.loginIp,
            loginAt: updateUser.loginAt
        });

        return { user: updateUser, accessToken };
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const requestResetPassword = async (req, res) => {
    try {
        const payload = req.body;

        const verifyUser = await findOne({ model: 'User', query: { email: payload.email, isDeleted: false } });

        if (!verifyUser) {
            return errorResponse(res, null, 'Not Found', 'No account found, contact your admin.', 404);
        }

        if (!verifyUser.isActive) {
            return errorResponse(res, null, 'Deactivated User', 'Your account is deactivated. Please contact your administrator for assistance.', 400);
        }

        const token = await find({ model: 'Token', query: { userId: verifyUser._id } });
        if (token.length) await deleteMany({ model: 'Token', query: { userId: verifyUser._id } });

        const resetToken = generateRandomToken(serverConfig.CRYPTO.RANDOM_BYTES);
        const hash = await hashValue(resetToken);

        await create({
            model: 'Token',
            data: {
                userId: verifyUser._id,
                token: hash,
                generatedAt: Date.now()
            }
        });

        const link = `${serverConfig.SERVER.CLIENT}/reset-password?email=${verifyUser.email}&token=${resetToken}&id=${verifyUser._id}`;

        const emailOptions = {
            link: link,
            to: payload.email,
            subject: 'NATURE DAIM INC: Reset Password',
            templatePath: process.cwd() + '/src/utils/email/templates/reset-password-mail.handlebars',
            templateData: {
                username: verifyUser.firstName + " " + verifyUser.lastName,
                link: `${link}`,
            },
        };

        // Send Email With verification Link
        sendEmail(emailOptions);

        return {};
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const resetPassword = async (req, res) => {
    try {
        const payload = req.body;

        const verifyToken = await findOne({ model: 'Token', query: { userId: payload.userId } });

        if (!verifyToken) {
            return errorResponse(res, null, 'Link Expired', 'It appears that this link to reset your password has expired. Please tap on Forgot Password in the app again to proceed.', 404);
        }

        const isValidToken = await compareHashValue(payload.token, verifyToken.token);

        if (!isValidToken) {
            return errorResponse(res, null, 'Invalid Token', 'We are unable to process your password reset request at this moment. Please tap on Forgot Password in the app again to proceed.', 400);
        }

        const verifyUser = await findOne({ model: 'User', query: { _id: payload.userId, isDeleted: false } });

        if (!verifyUser) {
            return errorResponse(res, null, 'Not Found', 'No account found, contact your admin.', 404);
        }

        if (!verifyUser.isActive) {
            return errorResponse(res, null, 'Deactivated User', 'Your account is deactivated. Please contact your administrator for assistance.', 400);
        }

        const isOldPassword = await compareHashValue(payload.newPassword, verifyUser?.password);

        if (isOldPassword) {
            return errorResponse(res, null, 'Same Password', 'You used that password recently. Choose a different password.', 400);
        }

        if (payload.newPassword !== payload.confirmPassword) {
            return errorResponse(res, null, 'Password Different', 'New password must be the same as confirm password.', 400);
        }

        const hash = await hashValue(payload.newPassword);

        const updateUser = await update({ model: 'User', query: { _id: verifyUser._id }, updateData: { $set: { password: hash } } });
        await deleteMany({ model: 'Token', query: { userId: verifyUser._id } });

        return updateUser;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const deletation = async (req, res) => {
    try {
        const payload = req.body;

        const verifyUser = await findOne({ model: 'User', query: { _id: payload.userId, isDeleted: false } });

        if (!verifyUser) {
            return errorResponse(res, null, 'Not Found', 'No account found, contact your admin.', 404);
        }

        let updateObj = {};
        updateObj.isDeleted = true;
        updateObj.deletedAt = new Date();

        const updateUser = await update({ model: 'User', query: { _id: payload.userId }, updateData: { $set: updateObj } });

        return updateUser;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

const all = async (req, res) => {
    try {
        const payload = req.body;

        payload.page = payload.page ?? 1
        payload.limit = payload.limit ?? 10

        const skip = (payload.page - 1) * payload.limit;

        const userCount = countDocuments({
            model: 'User',
            query: {
                userType: { $in: Object.values(ROLES_AND_PERMISSION) },
                isDeleted: false,
                $or: [
                    { firstName: { $regex: payload.search, $options: 'i' } },
                    { lastName: { $regex: payload.search, $options: 'i' } },
                    { email: { $regex: payload.search, $options: 'i' } }
                ]
            }
        });

        const users = find({
            model: 'User',
            query: {
                userType: { $in: Object.values(ROLES_AND_PERMISSION) },
                isDeleted: false,
                $or: [
                    { firstName: { $regex: payload.search, $options: 'i' } },
                    { lastName: { $regex: payload.search, $options: 'i' } },
                    { email: { $regex: payload.search, $options: 'i' } }
                ]
            },
            options: {
                skip,
                limit: payload.limit,
                sort: {
                    [payload.sortingKey]: payload.sortingOrder == 'Asc' ? 1 : -1
                }
            }
        });

        const userResponse = await Promise.allSettled([userCount, users]);

        const response = {
            totalDocs: userResponse[0].value,
            totalPages: Math.ceil(userResponse[0].value / payload.limit),
            currentPage: payload.page,
            limit: payload.limit,
            docs: userResponse[1].value
        };

        return response;
    } catch (error) {
        return errorResponse(res, error, error.stack, 'Internal server error.', 500);
    }
};

module.exports = {
    upload,
    remove,
    register,
    updateStatus,
    login,
    requestResetPassword,
    resetPassword,
    deletation,
    all
};