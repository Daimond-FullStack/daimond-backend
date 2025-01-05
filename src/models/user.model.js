const mongoose = require('mongoose');
const CONSTANT = require('../utils/constant');

const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        required: true,
        enum: Object.values(CONSTANT.USER_TYPES)
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    activatedAt: {
        type: Date,
        default: null,
    },
    deactivatedAt: {
        type: Date,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    indexConfigs: [
        { fields: { email: 1 }, unique: true },
        { fields: { userType: 1 } },
    ]
});

userSchema.pre('save', async function (next) {
    this.fullName = `${this.firstName} ${this.lastName}`;
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;