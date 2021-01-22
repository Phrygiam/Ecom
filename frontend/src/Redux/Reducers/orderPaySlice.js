import {createSlice} from "@reduxjs/toolkit"
import {cartReset} from "./cartSlice"
import {orderReset} from "./orderSlice"

const userInfoFromStorage = localStorage.getItem("userInfo") === null ? [] : JSON.parse(localStorage.getItem("userInfo"))

const orderPaySlice = createSlice({
    name:"orderPay",
    initialState: {
        loadingPay: false,
        hasErrors: false,
        message: "",
        isSuccessful: false
    },
    reducers: {

        isLoading: state => {
            state.loadingPay = true
            state.hasErrors = false
            state.message = ""
            state.isSuccessful = false
        },

        paymentSuccess: state => {
            state.loadingPay = false
            state.hasErrors = false
            state.message= ""
            state.isSuccessful = true
        },

        paymentFailure: (state, {payload}) => {
            state.loadingPay = false
            state.hasErrors = true
            state.message= payload
            state.isSuccessful = false
        }
    }
})

export function payOrder(orderId, paymentResult) {
    return async dispatch => {
        dispatch(isLoading())

        try {

            const token = userInfoFromStorage.token
            const paymentData = {
                method: "PUT",
                headers: {
                     'Content-Type': 'application/json',
                     'auth-token': token},
                body:JSON.stringify({paymentResult})
            }
            
            const response = await fetch(`/api/orders/${orderId}/pay`, paymentData)
            const data = await response.json()

            if(!data.error) {
                dispatch(paymentSuccess())
                dispatch(cartReset())
                dispatch(orderReset())
            } else {
                dispatch(paymentFailure("Something went wrong"))
            }
            
        } catch (error) {
            dispatch(paymentFailure(error))
        }
    }
}
export const {isLoading, paymentSuccess, paymentFailure} = orderPaySlice.actions
export const orderPaySelector = state => state.orderPay
export default orderPaySlice.reducer