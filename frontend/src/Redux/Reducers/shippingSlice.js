import {createSlice} from "@reduxjs/toolkit"

const shippingInfoFromStorage = localStorage.getItem("shippingInfo") === null ? [] : JSON.parse(localStorage.getItem("shippingInfo"))

const initialState = {
    loading: false,
    hasErrors: false,
    shippingInfo: shippingInfoFromStorage,
    message: ""
}

const shippingSlice = createSlice({
    name:"shipping",
    initialState,
    reducers: {

        getShippingInfoSuccess: (state, {payload}) => {
            state.loading = false
            state.message = ""
            state.hasErrors = false
            state.shippingInfo = payload
        },

        getShippingInfoFailure: (state, {payload}) => {
            state.loading = false
            state.message = payload
            state.hasErrors = false
        }
    }
})

export function shipping (address, city, postalCode, country) {
    return dispatch => {
        
        try {

            
                const info = {
                    address: address,
                    city: city,
                    postalCode: postalCode,
                    country: country
                }
                dispatch(getShippingInfoSuccess(info))
                localStorage.setItem("shippingInfo", JSON.stringify(info))
            

        } catch (error) {
            dispatch(getShippingInfoFailure(error))
        }
    }
}

export const {getShippingInfoSuccess, getShippingInfoFailure} = shippingSlice.actions
export const shippingSelector = state => state.shipping
export default shippingSlice.reducer