const mongoose = require('mongoose');
const CONSTANT = require('../utils/constant');

const customerSchema = new mongoose.Schema({
    userType: {
        type: String,
        required: true,
        enum: Object.values(CONSTANT.CUSTOMER)
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String
    },
    email: {
        type: String,
        default: "",
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

customerSchema.index({ email: 1 });
customerSchema.index({ userType: 1 });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;