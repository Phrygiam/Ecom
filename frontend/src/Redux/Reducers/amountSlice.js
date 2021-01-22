import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0
}

const amountSlice = createSlice({
    name:"amount",
    initialState,
    reducers: {

        setPrice: (state, {payload}) => {
            state.itemsPrice = payload.itemsPrice
            state.shippingPrice = payload.shippingPrice
            state.taxPrice = payload.taxPrice
            state.totalPrice = payload.totalPrice
        }
    }
})

export function setAmount(itemsPrice, shippingPrice, taxPrice, totalPrice) {
    return dispatch => {
        dispatch(setPrice({itemsPrice, shippingPrice, taxPrice, totalPrice}))
    }
}

export const {setPrice} = amountSlice.actions
export const amountSelector = state => state.amount
export default amountSlice.reducer