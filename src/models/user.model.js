const mongoose = require('mongoose');
const CONSTANT = require('../utils/constant');

const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        required: true,
        enum: Object.values(CONSTANT.USER_TYPES)
    },
    profilePic: {
        type: String,
        default: ''
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String
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
    address: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    activatedAt: {
        type: Date,
        default: null
    },
    deactivatedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    loginAt: {
        type: Date,
        default: null
    },
    loginIp: {
        type: String,
        default: null
    },
    loginSystemKey: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

userSchema.index({ email: 1, unique: true });
userSchema.index({ userType: 1 });

userSchema.pre('save', async function (next) {
    this.fullName = `${this.firstName} ${this.lastName}`;
    this.updatedAt = Date.now();
    if (this.role === 'Customer' || this.role === 'Vendor') {
        this.isActive = false;
        this.activatedAt = undefined;
        this.deactivatedAt = undefined;
        this.isDeleted = false;
        this.deletedAt = undefined;
        this.loginAt = undefined;
        this.loginIp = undefined;
        this.loginSystemKey = undefined;
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;