const express = require("express");
const { uploadMultiple, uploadSingle } = require('../middleware/multer');
const produkController = require("../controller/produkController");
const imageController = require("../controller/imageController");
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.post('/create', auth, checkRole("admin"), uploadSingle, produkController.addProduk);
router.patch('/update/:id', auth, checkRole("admin"), produkController.updateProduk);
router.get('/read', produkController.viewProduk);
router.delete('/delete/:id', auth, checkRole("admin"), produkController.deleteProduk);

// add image item._id
router.post('/add-image/:id', auth, checkRole("admin"), uploadSingle, imageController.addImageProduk);
// delete image
router.delete('/delete-image/:produkId/:imageId', auth, checkRole("admin"), imageController.deleteImageProduk);

module.exports = router;