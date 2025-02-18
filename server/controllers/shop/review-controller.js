const Review = require("../../models/review");
const Order = require("../../models/order");
const Product = require("../../models/product");

const addReview = async (req, res) => {
    try {
        const { productId, userId, username, reviewMessage, reviewValue } = req.body;
        const order = await Order.findOne({ userId, "cartItems.productId": productId, orderStatus: "confirmed" });
        if (!order) {
            return res.status(403).json({
                success: false,
                message: "You need to purchase product to review it."
            })
        }
        const checkExistingReview = await Review.findOne({ productId, userId });
        if (checkExistingReview) {
            return res.status(400).json({
                success: false,
                message: "You already reviewed this product."
            })
        }
        const newReview = new Review({ productId, userId, username, reviewMessage, reviewValue });
        await newReview.save();
        const reviews = await Review.find({ productId });
        const totalReviewsLength = reviews.length;
        const averageReview = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLength;
        await Product.findByIdAndUpdate(productId, { averageReview });
        return res.status(201).json({
            success: true,
            data: newReview
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error"
        });
    }
};

const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ productId });
        return res.status(200).json({
            success: true,
            data: reviews
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error"
        });
    }
};

module.exports = { addReview, getReviews };