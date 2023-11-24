const KoinProd = require('../model/KoinProd');
const Category = require('../model/Category');
const Image = require('../model/Image');
const fs = require('fs-extra');
const path = require('path');
const { existsSync } = require('fs');

module.exports = {
    addKoinProd : async (req, res) => {
        try {
            const { koinProdName, koinProdPrice, description, category } = req.body;
        
            if (req.files) {
                const categoryDb = await Category.findOne({ _id: category });
                const newKoinProd = new KoinProd({
                    category, //category id
                    koinProdName, 
                    koinProdPrice,
                    description
                });

                const koinProd = await KoinProd.create(newKoinProd);
                categoryDb.produk.push({ _id: koinProd._id });
                await categoryDb.save();

                for (let i = 0; i < req.files.length; i++) {
                    const imageSave = await Image.create({
                        imageUrl: `images/${req.files[i].filename}`
                    });
                    koinProd.image.push({ _id: imageSave._id });
                    await koinProd.save();
                }
                res.status(201).json({prod: koinProd, img:req.files});
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
    viewKoinProd : async (req, res) => {
        try {
            const koinProd = await KoinProd.find()
                .populate({ path: "category", select: "id categoryName" })
                .populate({ path: "image", select: "id imageUrl" })
            koinProd.length === 0 ? res.status(404).json({ message : "No data produk found" }) : res.status(200).json(koinProd);
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    updateKoinProd : async (req, res) => {
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            "koinProdName", 
            "koinProdPrice",
            "description", 
            "category"
        ];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            await fs.unlink(path.join(`public/images/${req.file.filename}`));
            return res.status(403).json({ message: "Wrong key parameter" })
        }

        try {
            const koinProd = await KoinProd.findById(req.params.id)
            .populate({ path: "category", select: "id categoryName" })
            .populate({ path: "image", select: "id imageUrl" });

            updates.forEach((update) => {
                koinProd[update] = req.body[update];
            });
            await koinProd.save();
            res.status(200).json(koinProd);
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    deleteKoinProd : async(req, res) => {
        try {
            const { id } = req.params;
            const koinProd = await KoinProd.findOne({ _id: id });
            
            if(!koinProd) {
                return res.status(404).json({ message: "Produk not found" });
            }
            const categoryDb = await Category.findOne({ _id: koinProd.category });
            
            async function deleteCategory() {
                for(let i = 0; i < categoryDb.produk.length; i++) {
                    if(categoryDb.produk[i]._id.toString() === koinProd._id.toString()) {
                        categoryDb.produk.pull({ _id: koinProd._id });
                        await categoryDb.save();
                    }
                }
            }
            async function deleteImage() {
                for(let i = 0; i < koinProd.image.length; i++) {
                    Image.findOne({ _id: koinProd.image[i]._id }).
                    then((image) => {
                        image.deleteOne();

                        if (!existsSync(path.join(`public/images/${image.imageUrl}`))) {
                            return 'No File'
                        }
                        fs.unlink(path.join(`public/${image.imageUrl}`));
                    }).
                    catch((error) => {
                        res.status(500).json({ message: error.message });
                    });
                }
            }

            await koinProd.deleteOne()
                .then(() => deleteCategory())
                .then(() => deleteImage())
            res.status(200).json({ message: "Produk deleted" });
        }
        catch(err) {
            return res.status(500).json({ message: err.message });
        }
    }
}