const Order = require("../../models/order");

const getAllOrdersOfAllUsers = async (req, res) => {
    try {
        const orders = await Order.find();
        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: "No orders found."
            })
        }
        return res.status(200).json({
            success: true,
            data: orders
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error"
        })
    }
}

const getOrderDetailsForAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            })
        }
        return res.status(200).json({
            success: true,
            data: order
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error"
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            })
        }
        await Order.findByIdAndUpdate(id, { orderStatus });
        return res.status(200).json({
            success: true,
            message: "Order status is updated successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error"
        })
    }
}

module.exports = { getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus };