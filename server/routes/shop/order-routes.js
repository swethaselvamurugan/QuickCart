const expresss = require("express");
const { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails } = require("../../controllers/shop/order-controller");

const router = expresss.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;