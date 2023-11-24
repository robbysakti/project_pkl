const express = require("express");
const transaksiController = require('../controller/transaksiController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create', auth, transaksiController.createTransaksi);
router.put('/checkout', auth, transaksiController.checkOut);
router.put('/tukar_koin', auth, transaksiController.tukarKoin);
router.get('/read', auth, transaksiController.viewHistoryTransaksi);
router.get('/read_checkout', auth, transaksiController.viewcheckOut);
router.patch('/update/:id', auth, transaksiController.updateTransaksi);
router.delete('/delete/:id', auth, transaksiController.deleteTransaksi);

module.exports = router;
