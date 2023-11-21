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
            if(jumlah <= 0 || typeof jumlah !== 'number') {
                return res.status(400).json({ message: "Masukkan jumlah yang valid" });
            }
            
            const produk = await Produk.findOne({ _id: produkId });
            if(!produk) {
                return res.status(400).json({ message: "Produk not found" });
            }

            let bookingEndDate = new Date(bookingStartDate.valueOf() + (jumlah * 60000));
            let total = produk.produkPrice * jumlah;
            // let tax = total * 0.1;

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
                total : total,
                user : req.user._id
            }
            const booking = await Booking.create(newBooking);

            res.status(201).json({ message: "Success Booking", booking: booking });
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
            const customer = await User.findOne({ _id: req.user._id });
            if(!customer) {
                return res.status(400).json({ message: "User not found" });
            }
            const booking = await Booking.find({ user: customer._id });
            let totalCheckout = 0;
            let poinBooking = 0;
            booking.forEach( data => {
                totalCheckout += parseFloat(data.total);
            })

            if (totalCheckout > customer.saldo) {
                return res.status(400).json({ message: "Saldo tidak cukup!" });
            }

            customer.saldo -= totalCheckout;
            poinBooking = totalCheckout / 10000;
            customer.poin += parseInt(poinBooking);
            booking.status = "Clear";

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
            res.status(200).json({ message: "Data booking deleted" });
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    }
}