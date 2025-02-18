const Product = require("../../models/product");

const searchProducts = async (req, res) => {
    try {
        const { keyword } = req.params;
        if (!keyword || typeof keyword !== "string") {
            return res.status(400).json({
                succes: false,
                message: "Keyword is required and must be in string format."
            })
        }
        const regEx = new RegExp(keyword, "i");
        const createSearchQuery = {
            $or: [
                { title: regEx },
                { description: regEx },
                { category: regEx },
                { brand: regEx },
            ]
        }
        const searchResults = await Product.find(createSearchQuery);
        return res.status(200).json({
            succes: true,
            data: searchResults 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Some error occured."
        });
    }
}

module.exports = { searchProducts };