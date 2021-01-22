import {createSlice} from "@reduxjs/toolkit"

const paymentInfoFromStorage = localStorage.getItem("paymentInfo") === null ? "PayPal" : JSON.parse(localStorage.getItem("paymentInfo"))

const initialState = {
    hasErrors: false,
    paymentInfo: paymentInfoFromStorage,
    message: ""
}

const paymentSlice = createSlice({
    name:"payment",
    initialState,
    reducers: {

        getPaymentInfoSuccess: (state, {payload}) => {
            state.message = ""
            state.hasErrors = false
            state.paymentInfo = payload
        },

        getPaymentInfoFailure: (state, {payload}) => {
            state.message = payload
            state.hasErrors = false
        }
    }
})

export function savePaymentMethod (paymentMethod) {
    return dispatch => {
        
        try {
                dispatch(getPaymentInfoSuccess(paymentMethod))
                localStorage.setItem("paymentInfo", JSON.stringify(paymentMethod))
            

        } catch (error) {
            dispatch(getPaymentInfoFailure(error))
        }
    }
}

export const {getPaymentInfoSuccess, getPaymentInfoFailure} = paymentSlice.actions
export const paymentSelector = state => state.payment
export default paymentSlice.reducer