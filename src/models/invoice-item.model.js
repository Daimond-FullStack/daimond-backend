const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Memo', required: true },
    refNo: { type: String, required: true },
    description: { type: String, default: '' },
    carats: { type: Number, required: true },
    pricePerCarat: { type: String, required: true },
    price: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

invoiceItemSchema.index({ invoiceId: 1 });
invoiceItemSchema.index({ refNo: 1 }, { unique: true });

const InvoiceItem = mongoose.model("InvoiceItem", invoiceItemSchema);

module.exports = InvoiceItem;
