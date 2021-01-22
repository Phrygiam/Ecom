import {createSlice} from "@reduxjs/toolkit"

const userInfoFromStorage = localStorage.getItem("userInfo") === null ? [] : JSON.parse(localStorage.getItem("userInfo"))

const initialState = {
    loading: false,
    message: "",
    hasErrors: false,
    orderInfo: []
}

const orderSlice = createSlice({
    name:"order",
    initialState,
    reducers: {

        isLoading: state => {
            state.loading = true
            state.message = ""
            state.hasErrors = false
        },

        createOrderSuccess: (state, {payload}) => {
            state.loading = false
            state.message= ""
            state.hasErrors = false
            state.orderInfo = payload
        },

        orderReset: state => {
            state.loading = false
            state.message= ""
            state.hasErrors = false
            state.orderInfo = []
        },

        createOrderFailure: (state, {payload}) => {
            state.loading = false
            state.message = payload
            state.hasErrors = true
        }
    }
})


export function placeOrder(order) {
    return async dispatch => {
        dispatch(isLoading())

        try {
        
            const token = userInfoFromStorage.token
            const orderData = {
                method: "POST",
                headers: {
                     'Content-Type': 'application/json',
                     'auth-token': token},
                body: JSON.stringify({order})
            }
            
            const response = await fetch("/api/orders", orderData)
            const data = await response.json()

            if(!data.error) {
                dispatch(createOrderSuccess(data))
            }

        } catch (error) {
            dispatch(createOrderFailure(error.message))
        }
    }
}

export const {isLoading, createOrderSuccess, orderReset, createOrderFailure} = orderSlice.actions
export const orderSelector = state => state.order
export default orderSlice.reducer