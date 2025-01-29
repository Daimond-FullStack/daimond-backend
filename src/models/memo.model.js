const mongoose = require("mongoose");
const CONSTANT = require("../utils/constant");

const memoSchema = new mongoose.Schema({
    memoNumber: { type: String, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    numberOfItems: { type: Number, required: true },
    totalValue: { type: String, required: true },
    status: { type: String, enum: Object.values(CONSTANT.MEMO_STATUS), default: CONSTANT.MEMO_STATUS.PENDING },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

memoSchema.index({ memoNumber: 1 }, { unique: true });
memoSchema.index({ status: 1 });

const Memo = mongoose.model("Memo", memoSchema);

module.exports = Memo;
