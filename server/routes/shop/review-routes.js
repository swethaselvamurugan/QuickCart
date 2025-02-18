const expresss = require("express");
const { addReview, getReviews } = require("../../controllers/shop/review-controller");

const router = expresss.Router();

router.post("/add", addReview);
router.get("/:productId", getReviews);

module.exports = router;