const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
    productId: String,
    userId: String,
    username: String,
    reviewMessage: String,
    reviewValue: Number
}, { timestamps: true });

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;