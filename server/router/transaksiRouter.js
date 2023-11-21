const express = require("express");
const transaksiController = require('../controller/transaksiController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create', auth, transaksiController.createTransaksi);
router.post('/checkout', auth, transaksiController.checkOut);
router.get('/read', auth, transaksiController.viewHistoryTransaksi);
router.get('/read_checkout', auth, transaksiController.viewcheckOut);
router.delete('/delete/:id', auth, transaksiController.deleteHTransaksi);

module.exports = router;
