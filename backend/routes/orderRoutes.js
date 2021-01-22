const express = require("express")
const router = express.Router()
const {protect, isAdmin} = require("../middleware/authMiddleware")

const {addOrderItems, getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrders, getAllOrders} = require("../controllers/orderController")


router.route("/").post(protect, addOrderItems).get(protect, isAdmin, getAllOrders)
router.route("/myorders").get(protect, getMyOrders)
router.route("/:id").get(protect, getOrderById)
router.route("/:id/pay").put(protect, updateOrderToPaid)
router.route("/:id/deliver").put(protect, isAdmin, updateOrderToDelivered)

module.exports = router