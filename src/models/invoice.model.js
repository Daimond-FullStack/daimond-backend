const mongoose = require("mongoose");
const CONSTANT = require("../utils/constant");

const invoiceSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    invoiceNumber: { type: String, required: true },
    address: { type: String, required: true },
    shipTo: { type: String, required: true },
    terms: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    numberOfItems: { type: Number, required: true },
    totalValue: { type: String, required: true },
    status: { type: String, enum: Object.values(CONSTANT.MEMO_STATUS), default: CONSTANT.MEMO_STATUS.PENDING },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ status: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
