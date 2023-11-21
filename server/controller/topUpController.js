const TopUp = require('../model/TopUpAdmin');
const User = require('../model/User');

module.exports = {
    createTopUpSaldo : async (req, res) => {
        try {
            const { total } = req.body;
            const { id } = req.params;

            if(id === undefined) {
                return res.status(400).json({ message: "Please input id user" });
            }
            if(total <= 0 || typeof total !== 'number') {
                return res.status(400).json({ message: "Masukkan nominal yang valid" });
            }
            
            const user = await User.findOne({ _id: id });
            if(!user) {
                return res.status(400).json({ message: "User not found" });
            }

            const invoice = Math.floor(1000000 + Math.random() * 900000);
            const topUp = {
                invoice,
                user : {
                    _id : user._id,
                    name : user.name
                },
                total : total,
                admin : {
                    _id: req.user._id,
                    name: req.user.name
                }
            }
            const topup = await TopUp.create(topUp);
            user.saldo += total;
            await user.save();

            res.status(201).json({ message: "Success Top Up", topup });
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    viewHistoryTopUpAll : async (req, res) => {
        try {
            const topup = await TopUp.find();
            topup.length === 0 ? res.status(404).json({ message : "No data top up found" }) : res.status(200).json(topup);
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    viewHistoryTopUp : async (req, res) => {
        try {
            const topup = await TopUp.find({ user: req.user._id });
            topup.length === 0 ? res.status(404).json({ message : "No data top up found" }) : res.status(200).json(topup);
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    viewCheckTopUp : async (req, res) => {
        try {
            const { id } = req.params;
            const topup = await TopUp.findOne({ _id: id });
            topup.length === 0 ? res.status(404).json({ message : "No data top up found" }) : res.status(200).json(topup);
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    deleteHistoryTopUp : async (req, res) => {
        try {
            const { id } = req.params;
            const topup = await TopUp.findOne({ _id: id });
            
            if(!topup) {
                return res.status(404).json({ message: "No data top up found" });
            }

            await topup.remove()
            res.status(200).json({ message: "Data top up deleted" });
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    }
}