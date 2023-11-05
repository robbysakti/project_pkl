const express = require("express");
const bookingController = require('../controller/bookingController');
const { uploadSingle } = require('../middleware/multer');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create', uploadSingle, bookingController.createBooking);
router.get('/read', auth, bookingController.viewBooking);
router.get('/read/:id', auth, bookingController.showDetailBooking);
router.delete('/delete/:id', auth, bookingController.deleteBooking);
router.put('/checkout/:id', auth, bookingController.checkOut);

module.exports = router;
