const Produk = require('../model/Produk');
const Image = require('../model/Image');
const fs = require('fs-extra');
const path = require('path');
const { existsSync } = require('fs');

module.exports = {
    addImageProduk : async(req, res) => {
        const { id } = req.params; //id produk

        try {
            if(req.file) {
                const produk = await Produk.findOne({ _id: id });
                const imageSave = await Image.create({
                    imageUrl: `images/${req.file.filename}`
                })

                produk.image.push({
                    _id: imageSave._id
                })
                await produk.save();
                
                res.status(201).json(imageSave);
            } else {
                res.status(400).json({ message: "please upload image" });
            }
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    },
    deleteImageProduk : async(req, res) => {
        const { imageId, produkId } = req.params; //id image, id produk

        try {
            const produk = await Produk.findOne({ _id: produkId });
            const image = await Produk.findOne({ _id: imageId });

            if(!produk) {
                res.status(404).json({ message: "Produk not found" });
            }
            if(!image) {
                res.status(404).json({ message: "Image not found" });
            }

            async function deleteImageOnProduk() {
                for(let i = 0; i < produk.image.length; i++) {
                    if(produk.image[i]._id.toString() === image._id.toString()) {
                        produk.image.pull({ _id: image._id });
                        await produk.save();
                    }
                }
            }
            await image.remove()
                .then(() => deleteImageOnProduk())
                .then(() => {
                    if (!existsSync(path.join(`public/images/${image.imageUrl}`))) {
                        return 'No File'
                    }
                    
                    fs.unlink(path.join(`public/images/${image.imageUrl}`))
                });
            res.status(200).json({ message: "Image deleted" });
        }
        catch(err) {
            res.status(500).json({ message: err.message });
        }
    }
}