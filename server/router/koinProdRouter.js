const express = require("express");
const { uploadMultiple, uploadSingle } = require('../middleware/multer');
const koinProdController = require("../controller/koinProdController");
const imageController = require("../controller/imageController");
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.post('/create', auth, checkRole("admin"), uploadMultiple, koinProdController.addKoinProd);
router.patch('/update/:id', auth, checkRole("admin"), koinProdController.updateKoinProd);
router.get('/read', koinProdController.viewKoinProd);
router.delete('/delete/:id', auth, checkRole("admin"), koinProdController.deleteKoinProd);

// add image item._id
router.post('/add-image/:id', auth, checkRole("admin"), uploadSingle, imageController.addImageProduk);
// delete image
router.delete('/delete-image/:koinProdId/:imageId', auth, checkRole("admin"), imageController.deleteImageProduk);

module.exports = router;