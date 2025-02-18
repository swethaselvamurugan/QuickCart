const expresss = require("express");
const {getFilteredProducts, getProductDetails} = require("../../controllers/shop/products-controller");

const router = expresss.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductDetails);

module.exports = router;