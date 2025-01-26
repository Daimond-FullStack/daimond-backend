const mongoose = require("mongoose");

const memoItemSchema = new mongoose.Schema({
    memoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Memo', required: true },
    refNo: { type: String, required: true },
    description: { type: String, default: '' },
    carats: { type: Number, required: true },
    pricePerCarat: { type: String, required: true },
    returnInCarats: { type: String, default: '' },
    soldInCarats: { type: String, default: '' },
    price: { type: String, required: true },
    remarks: { type: String, default: '' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

memoItemSchema.index({ memoId: 1 });
memoItemSchema.index({ refNo: 1 }, { unique: true });

const MemoItem = mongoose.model("MemoItem", memoItemSchema);

module.exports = MemoItem;
