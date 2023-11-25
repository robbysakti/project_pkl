const express = require("express");
const bookingController = require('../controller/bookingController');
// const { uploadSingle } = require('../middleware/multer');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create', auth, bookingController.createBooking);
router.get('/read_checkout', auth, bookingController.viewCheckOut);
router.get('/read', auth, bookingController.viewHistoryBooking);
router.get('/read/:id', auth, bookingController.showDetailBooking);
router.delete('/delete/:id', auth, bookingController.deleteBooking);
router.put('/checkout', auth, bookingController.checkOut);

module.exports = router;
