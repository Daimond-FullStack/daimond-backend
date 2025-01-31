const mongoose = require('mongoose');
const CONSTANT = require('../utils/constant');

const expenseSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: Object.values(CONSTANT.EXPENSE_CATEGORY)
    },
    invoiceNumber: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: String,
        required: true
    },
    expenseDate: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

expenseSchema.index({ email: 1 });
expenseSchema.index({ userType: 1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;