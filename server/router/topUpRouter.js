const express = require("express");
const topUpController = require('../controller/topUpController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.patch('/saldo/:id', auth, checkRole("admin"), topUpController.createTopUpSaldo);
router.get('/readAll', auth, checkRole("admin"), topUpController.viewHistoryTopUpAll);
router.get('/read', auth, topUpController.viewHistoryTopUp);
router.get('/read/:id', auth, topUpController.viewCheckTopUp);
router.delete('/delete/:id', auth, topUpController.deleteHistoryTopUp);

module.exports = router;
