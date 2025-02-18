const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/product");

const handleImageUpload = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtil(url);
        return res.json({
            success: true,
            result
        })
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: "Error occured."
        })
    }
};

const addProduct = async (req, res) => {
    try {
        const { image, title, description, category, brand, price, saleprice, totalstock } = req.body;
        const newProduct = new Product({ image, title, description, category, brand, price, saleprice, totalstock });
        await newProduct.save();
        return res.status(201).json({
            success: true,
            data: newProduct
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured"
        });
    }
};

const fetchAllProducts = async (req, res) => {
    try {
        const listOfProducts = await Product.find({});
        return res.status(200).json({
            success: true,
            data: listOfProducts
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured"
        });
    }
};

const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { image, title, description, category, brand, price, saleprice, totalstock } = req.body;
        let findProduct = await Product.findById(id);
        if (!findProduct)
            return res.status(404).json({
                success: false,
                message: "Product not found."
            })
        findProduct.image = image || findProduct.image;
        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        findProduct.brand = brand || findProduct.brand;
        findProduct.price = price === "" ? 0 : price || findProduct.price;
        findProduct.saleprice = saleprice === "" ? 0 : saleprice || findProduct.saleprice;
        findProduct.totalstock = totalstock || findProduct.totalstock;
        await findProduct.save();
        return res.status(200).json({
            success: true,
            data: findProduct
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured"
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const findProduct = await Product.findByIdAndDelete(id);
        if (!findProduct)
            return res.status(404).json({
                success: false,
                message: "Product not found."
            })
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occured"
        });
    }
};

module.exports = { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct };