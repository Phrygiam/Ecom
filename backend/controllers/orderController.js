const Order = require("../models/orderModel")

// description: Create new order
// route POST /api/orders
// acccess: Private

const addOrderItems = async(req, res) => {

    try {
        
        const {orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, user} = req.body.order
                  
        const order = new Order ({
            user: user,
            orderItems: orderItems,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            itemsPrice: itemsPrice,
            taxPrice: taxPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalPrice
        })    
            
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
        
    } catch (error) {
        res.status(404).json({error: "Order not found"})
    }   
             
}

// description: Get order by ID
// route GET api/orders/:id
// acccess: Private

const getOrderById = async(req, res) => {

    try {
        
        const order = await Order.findById(req.params.id).populate("user", "name email")

        if (order) {
            res.json(order)
        } 

    } catch(error) {
        res.status(404).json({error: error.message})
    }
    
}

// description: Update order to paid
// route PUT api/orders/:id/pay
// acccess: Private

const updateOrderToPaid = async(req, res) => {

    try {
        
        const order = await Order.findById(req.params.id)
        const payment = req.body.paymentResult
        
        if (order) {
            order.isPaid = true
            order.paidAt = Date.now()
           
            order.paymentResult = {
                id: payment.id,
                status: payment.status,
                update_time: payment.update_time,
                email_address: payment.payer.email_address
            }
            
            const updatedOrder = await order.save()
            res.json(updatedOrder)
            
        } 

    } catch(error) {
        res.status(404).json({error: error.message})
    }
    
}

// description: Update order to delivered
// route PUT api/orders/:id/deliver
// acccess: Private/Admin

const updateOrderToDelivered = async(req, res) => {

    try {
        
        const order = await Order.findById(req.params.id)
        
        if (order) {
            order.isDelivered = true
            order.deliveredAt = Date.now()
            const updatedOrder = await order.save()
            res.json(updatedOrder)
        } 

    } catch(error) {
        res.status(404).json({error: error.message})
    }
}

// description: Get logged in user orders
// route GET api/orders/myorders
// acccess: Private

const getMyOrders = async(req, res) => {

    try {
        const orders = await Order.find({user: req.user._id})
        res.json(orders)

    } catch(error) {
        res.status(404).json({error: error.message})
    }
    
}

// description: Get all  orders
// route GET api/orders
// acccess: Private/Admin

const getAllOrders = async(req, res) => {

    try {
        
        const orders = await Order.find({}).populate("user", "id name")
        res.json(orders)

    } catch(error) {
        res.status(404).json({error: error.message})
    }
    
}


module.exports = {addOrderItems, getOrderById, updateOrderToPaid, updateOrderToDelivered, getMyOrders, getAllOrders}