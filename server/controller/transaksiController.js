const Transaksi = require('../model/Transaksi');
const Produk = require('../model/Produk')
const User = require('../model/User');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    createTransaksi : async (req, res) => {
        try {
            const { produkId, jumlah } = req.body;

            if(produkId === undefined) {
                return res.status(400).json({ message: "Please select id produk" });
            }
            
            const produk = await Produk.findOne({ _id: produkId });
            if(!produk) {
                return res.status(400).json({ message: "Produk not found" });
            }

            const user = await User.findOne({ _id: req.user._id });
            if(!user) {
                return res.status(400).json({ message: "User not found" });
            }

            const total = produk.produkPrice * jumlah;
            const invoice = Math.floor(1000000 + Math.random() * 900000);
            const transaksi = {
                invoice,
                produk: {
                    _id: produk._id,
                    name: produk.produkName,
                    price: produk.produkPrice
                },
                jumlah : jumlah,
                total : total,
                user : {
                    _id : req.user._id
                }
            }
            const addTransaksi = await Transaksi.create(transaksi);

            res.status(201).json({ message: "Success add transaksi", addTransaksi });
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    checkOut : async (req, res) => {
        try {
            const customer = await User.findOne({ _id: req.user._id });
            if(!customer) {
                return res.status(400).json({ message: "User not found" });
            }
            const transaksi = await Transaksi.find({ user: customer._id });
            let totalCheckout = 0;
            transaksi.forEach( data => {
                totalCheckout += data.total;
            })

            if (totalCheckout > customer.saldo) {
                return res.status(400).json({ message: "Saldo tidak cukup!" });
            }

            customer.saldo -= totalCheckout;
            transaksi.status = "Clear"

            await customer.save();
            await transaksi.save();
            res.status(200).json({ transaksi: transaksi, user: customer });
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    viewcheckOut : async (req, res) => {
        try {
            const transaksi = await Transaksi.find({ user: req.user._id, status: "process" });
            transaksi.length === 0 ? res.status(404).json({ message : "No data checkout found" }) : res.status(200).json(transaksi);
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    viewHistoryTransaksi : async (req, res) => {
        try {
            const transaksi = await Transaksi.find({ user: req.user._id });
            transaksi.length === 0 ? res.status(404).json({ message : "No data transaksi found" }) : res.status(200).json(transaksi);
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    deleteHTransaksi : async (req, res) => {
        try {
            const { id } = req.params;
            const transaksi = await Transaksi.findOne({ _id: id });
            
            if(!transaksi) {
                return res.status(404).json({ message: "No data transaksi found" });
            }

            await transaksi.remove()
            res.status(200).json({ message: "Data transaksi deleted" });
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    }
}