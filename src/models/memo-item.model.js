const mongoose = require("mongoose");

const memoItemSchema = new mongoose.Schema({
    memoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Memo', required: true },
    stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
    refNo: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerCarat: { type: String, required: true },
    returnInCarat: { type: String, required: true },
    soldInCarat: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

memoItemSchema.index({ diamondId: 1 }, { unique: true });
memoItemSchema.index({ diamondName: 1 });
memoItemSchema.index({ refNo: 1 });
memoItemSchema.index({ vendor: 1 });
memoItemSchema.index({ location: 1 });
memoItemSchema.index({ status: 1 });

const MemoItem = mongoose.model("MemoItem", memoItemSchema);

module.exports = MemoItem;
