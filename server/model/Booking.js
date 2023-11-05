const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const bookingSchema = new mongoose.Schema({
    bookingStartDate: {
        type: Date,
        required: [true, "Please Input Start Date!"]
    },
    bookingEndDate: {
        type: Date,
        required: true
    },
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
    jumlah: { type: Number, required: true },
    total: { type: Number, required: true },
    user: {
        type: ObjectId,
        ref: "User"
    },
    status: { type: String, default: "process" }
});

module.exports = mongoose.model("Booking", bookingSchema);