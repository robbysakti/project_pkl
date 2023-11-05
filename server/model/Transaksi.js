const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const transaksiSchema = new mongoose.Schema({
    invoice: {
        type: String,
        required: true
    },
    produk: {
        _id: {
            type: ObjectId,
            ref: "Produk"
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
    },
    total: { type: Number, required: true },
    user: [{
        type: ObjectId,
        ref: "User"
    }],
});

module.exports = mongoose.model("Transaksi", transaksiSchema);