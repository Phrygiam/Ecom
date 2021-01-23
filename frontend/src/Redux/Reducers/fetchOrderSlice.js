import {createSlice} from "@reduxjs/toolkit"

const userInfoFromStorage = localStorage.getItem("userInfo") === null ? [] : JSON.parse(localStorage.getItem("userInfo"))

const fetchOrderSlice = createSlice({
    name:"fetchOrder",
    initialState: {
        loading: true,
        message: "",
        hasErrors: false,
        orderInfo: []
    },
    reducers: {

        isLoading: state => {
            state.loading = true
            state.message = ""
            state.hasErrors = false
        },

        fetchOrderSuccess: (state, {payload}) => {
            state.loading = false
            state.message= ""
            state.hasErrors = false
            state.orderInfo = payload
        },

        fetchOrderFailure: (state, {payload}) => {
            state.loading = false
            state.message = payload
            state.hasErrors = true
        }
    }
})

export function fetchOrder(id, token) {

    return async dispatch => {
        dispatch(isLoading())

        try {

            const orderData = {
                method: "GET",
                headers: {'auth-token': token}
            }

            const response = await fetch(`/api/orders/${id}`, orderData)
            const data = await response.json()

            
            if(!data.error) {
                dispatch(fetchOrderSuccess(data))
            } else {
                dispatch(fetchOrderFailure("Order not found"))
            }

        } catch (error) {
            dispatch(fetchOrderFailure(error.message))
        }
    }
}

export const {isLoading, fetchOrderSuccess, fetchOrderFailure} = fetchOrderSlice.actions
export const fetchOrderSelector = state => state.fetchOrder
export default fetchOrderSlice.reducer