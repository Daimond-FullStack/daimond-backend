const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema({
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: false },
    manualEntry: { type: Boolean, default: false },
    refNo: { type: String, required: true },
    description: { type: String, default: '' },
    carat: { type: Number, required: true },
    pricePerCarat: { type: String, required: true },
    price: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

invoiceItemSchema.index({ invoiceId: 1 });

const InvoiceItem = mongoose.model("InvoiceItem", invoiceItemSchema);

module.exports = InvoiceItem;
