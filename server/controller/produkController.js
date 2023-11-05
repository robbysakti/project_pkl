const Produk = require('../model/Produk');
const Category = require('../model/Category');
const Image = require('../model/Image');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    addProduk : async (req, res) => {
        try {
            const { produkName, produkPrice, description, category } = req.body;
        
            if (req.files) {
                const categoryDb = await Category.findOne({ _id: category });
                const newProduk = new Produk({
                    category, //category id
                    produkName, 
                    produkPrice,
                    description
                });

                const produk = await Produk.create(newProduk);
                categoryDb.produk.push({ _id: produk._id });
                await categoryDb.save();

                for (let i = 0; i < req.files.length; i++) {
                    const imageSave = await Image.create({
                        imageUrl: `images/${req.files[i].filename}`
                    });
                    produk.image.push({ _id: imageSave._id });
                    await produk.save();
                }
                res.status(201).json(produk);
            } else {
                return res.status(400).json({ message: "Image not found!" });
            }
        }
        catch(err) {
            for (let i = 0; i < req.files.length; i++) {
                await fs.unlink(path.join(`public/images/${req.files[i].filename}`));
            }
            res.status(500).json({ message: err.message });
        }
    },
    viewProduk : async (req, res) => {
        try {
            const produk = await Produk.find()
                .populate({ path: "category", select: "id categoryName" })
                .populate({ path: "image", select: "id imageUrl" })
            produk.length === 0 ? res.status(404).json({ message : "No data bank found" }) : res.status(200).json(produk);
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    updateProduk : async (req, res) => {
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            "produkName", 
            "produkPrice",
            "description", 
            "category"
        ];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            await fs.unlink(path.join(`public/images/${req.file.filename}`));
            return res.status(403).json({ message: "Wrong key parameter" })
        }

        try {
            const produk = await Produk.findById(req.params.id)
            populate({ path: "category", select: "id categoryName" }).
            populate({ path: "image", select: "id imageUrl" });

            updates.forEach((update) => {
                produk[update] = req.body[update];
            });
            await produk.save();
            res.status(200).json(produk);
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    deleteProduk : async(req, res) => {
        try {
            const { id } = req.params;
            const produk = await Produk.findOne({ _id: id });
            
            if(!produk) {
                return res.status(404).json({ message: "Produk not found" });
            }
            const categoryDb = await Category.findOne({ _id: produk.category });
            
            async function deleteCategory() {
                for(let i = 0; i < categoryDb.produk.length; i++) {
                    if(categoryDb.produk[i]._id.toString() === produk._id.toString()) {
                        categoryDb.produk.pull({ _id: produk._id });
                        await categoryDb.save();
                    }
                }
            }
            async function deleteImage() {
                for(let i = 0; i < produk.image.length; i++) {
                    Image.findOne({ _id: produk.image[i]._id }).
                    then((image) => {
                        fs.unlink(path.join(`public/${image.imageUrl}`));
                        image.remove();
                    }).
                    catch((error) => {
                        res.status(500).json({ message: error.message });
                    });
                }
            }

            await produk.remove()
                .then(() => deleteCategory())
                .then(() => deleteImage())
            res.status(200).json({ message: "Produk deleted" });
        }
        catch(err) {
            return res.status(500).json({ message: err.message });
        }
    }
}