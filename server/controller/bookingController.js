const Produk = require('../model/Produk');
const Booking = require('../model/Booking');
const User = require('../model/User');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    createBooking : async (req, res) => {
        try {
            const { produkId, bookingStartDate, jumlah } = req.body;

            if(
                produkId === undefined ||
                bookingStartDate  === undefined ||
                jumlah  === undefined
            ) {
                return res.status(400).json({ message: "Please input all data" });
            }
            
            const produk = await Produk.findOne({ _id: produkId });
            if(!produk) {
                return res.status(400).json({ message: "Produk not found" });
            }

            let bookingEndDate = new Date(bookingStartDate.valueOf() + (jumlah * 60000));
            let total = produk.produkPrice * jumlah;
            let tax = total * 0.1;

            const invoice = Math.floor(1000000 + Math.random() * 900000);
            const newBooking = {
                bookingStartDate,
                bookingEndDate,
                invoice,
                produk : {
                    _id : produk.id,
                    name : produk.produkName,
                    price : produk.produkPrice
                },
                jumlah,
                total : total += tax,
                user : req.user._id
            }
            const booking = await Booking.create(newBooking);

            res.status(201).json({ message: "Success Booking", booking });
        }
        catch(err) {
            if(req.file) {
                await fs.unlink(path.join(`public/images/${req.file.filename}`));
            }
            res.status(500).json({ message: err.message });
        }
    },
    checkOut : async (req, res) => {
        const { id } = req.params;

        try {
            const booking = await Booking.findOne({ _id: id });
            const { user } = booking;
            const customer = await User.findOne({ _id: user });

            if (customer.saldo > 0) {
                res.status(400).json({ message: "Saldo tidak cukup!" });
            }

            customer.saldo -= booking.total;
            booking.status = "Clear"

            await customer.save();
            await booking.save();
            res.status(200).json({ booking: booking, user: customer });
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    viewBooking : async (req, res) => {
        try {
            const booking = await Booking.find();
            booking.length === 0 ? res.status(404).json({ message : "No data booking found" }) : res.status(200).json(booking);
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    showDetailBooking : async (req, res) => {
        try {
            const { id } = req.params;
            const booking = await Booking.findOne({ _id: id });
            booking.length === 0 ? res.status(404).json({ message : "No data booking found" }) : res.status(200).json(booking);
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    deleteBooking : async (req, res) => {
        try {
            const { id } = req.params;
            const booking = await Booking.findOne({ _id: id });
            
            if(!booking) {
                return res.status(404).json({ message: "No data booking found" });
            }

            await booking.remove()
            res.status(200).json(booking);
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    }
}