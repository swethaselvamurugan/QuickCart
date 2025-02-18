const expresss = require("express");
const {handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct} = require("../../controllers/admin/products-controller");
const {upload} = require("../../helpers/cloudinary");

const router = expresss.Router();

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.get("/get", fetchAllProducts);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;