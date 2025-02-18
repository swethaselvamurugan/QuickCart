const expresss = require("express");
const { searchProducts } = require("../../controllers/shop/search-controller");

const router = expresss.Router();

router.get("/:keyword", searchProducts);

module.exports = router;