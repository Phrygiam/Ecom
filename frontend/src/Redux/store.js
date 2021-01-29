import { configureStore } from "@reduxjs/toolkit"
import productsSlice  from "./Reducers/productsSlice"
import fetchUpdateProductSlice from "./Reducers/fetchUpdateProductSlice"
import cartSlice from "./Reducers/cartSlice"
import logSlice from "./Reducers/logSlice"
import signSlice from "./Reducers/signSlice"
import shippingSlice from "./Reducers/shippingSlice"
import paymentSlice from "./Reducers/paymentSlice"
import amountSlice from "./Reducers/amountSlice"
import orderSlice from "./Reducers/orderSlice"
import fetchOrderSlice from "./Reducers/fetchOrderSlice"
import orderPaySlice from "./Reducers/orderPaySlice"
import orderDeliverSlice from "./Reducers/orderDeliverSlice"
import fetchOrderListSlice from "./Reducers/fetchOrderListSlice"
import userListSlice from "./Reducers/userListSlice"
import fetchUpdateUserSlice from "./Reducers/fetchUpdateUserSlice"
import productReviewSlice from "./Reducers/productReviewSlice"
import topProductsSlice from "./Reducers/topProductsSlice"


const store = configureStore({
    reducer: {
        data: productsSlice,
        product: fetchUpdateProductSlice,
        cart: cartSlice,
        log: logSlice,
        sign: signSlice,
        shipping: shippingSlice,
        payment: paymentSlice,
        amount: amountSlice,
        order: orderSlice,
        fetchOrder: fetchOrderSlice,
        fetchOrderList: fetchOrderListSlice,
        orderPay: orderPaySlice,
        orderDeliver: orderDeliverSlice,
        user: fetchUpdateUserSlice,
        users: userListSlice,
        review: productReviewSlice,
        topProducts: topProductsSlice
    },
    devTools: false
})

export default store