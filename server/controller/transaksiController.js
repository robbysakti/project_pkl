const Transaksi = require('../model/Transaksi');
const Produk = require('../model/Produk')
const KoinProd = require('../model/KoinProd')
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
            if(jumlah <= 0 || typeof jumlah !== 'number') {
                return res.status(400).json({ message: "Masukkan jumlah yang valid" });
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

            res.status(201).json({ message: "Success add transaksi", transaksi: addTransaksi });
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    checkOut : async (req, res) => {
        try {
            const { id } = req.body
            const customer = await User.findOne({ _id: id });
            if(!customer) {
                return res.status(400).json({ message: "User not found" });
            }
            const transaksi = await Transaksi.find({ user: customer._id, status: "process" });
            let totalCheckout = 0;
            let poinTransaksi = 0;
            transaksi.forEach( async(data) => {
                totalCheckout += parseFloat(data.total);
                data.status = "clear";
                await data.save();
            })

            if (totalCheckout > customer.saldo) {
                return res.status(400).json({ message: "Saldo tidak cukup!" });
            }

            customer.saldo -= totalCheckout;
            poinTransaksi = totalCheckout / 10000;
            customer.poin += parseInt(poinTransaksi);

            await customer.save();
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
            const transaksi = await Transaksi.find({ user: req.user._id, status: "clear" });
            transaksi.length === 0 ? res.status(404).json({ message : "No data transaksi found" }) : res.status(200).json(transaksi);
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    updateTransaki : async (req, res) => {
        const updates = Object.keys(req.body);
        const allowUpdates = ["jumlah"];
        const isValidOperation = updates.every((update) => allowUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(403).json({ message : "Invalid key parameter" })
        }

        try {
            const transaksi = await Transaksi.findById(req.params.id);
            updates.forEach((update) => {
                transaksi[update] = req.body[update];
            });
            transaksi.total = transaksi.produk.price * req.body.jumlah;

            await transaksi.save();
            res.status(200).json(transaksi);
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
    },
    tukarKoin : async (req, res) => {
        try {
            const { produkId, jumlah } = req.body;

            if(produkId === undefined) {
                return res.status(400).json({ message: "Please select id produk" });
            }
            if(jumlah <= 0 || typeof jumlah !== 'number') {
                return res.status(400).json({ message: "Masukkan jumlah yang valid" });
            }
            
            const produk = await KoinProd.findOne({ _id: produkId });
            if(!produk) {
                return res.status(400).json({ message: "Produk not found" });
            }

            const customer = await User.findOne({ _id: req.user._id });
            if(!customer) {
                return res.status(400).json({ message: "User not found" });
            }

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
                },
                status : "clear"
            }
            const addTransaksi = await Transaksi.create(transaksi);
            
            if (totalCheckout > customer.poin) {
                return res.status(400).json({ message: "Koin tidak cukup!" });
            }
            const total = produk.produkPrice * jumlah;
            customer.poin -= total;

            await customer.save();
            res.status(200).json({ transaksi: transaksi, user: customer });

            res.status(201).json({ message: "Success Tukar Koin", transaksi: addTransaksi });
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
}