import {createSlice} from "@reduxjs/toolkit"

const userInfoFromStorage = localStorage.getItem("userInfo") === null ? [] : JSON.parse(localStorage.getItem("userInfo"))

const orderDeliverSlice = createSlice({
    name:"orderDeliver",
    initialState: {
        loadingDeliver: false,
        deliverHasErrors: false,
        deliverMessage: "",
        isDelivered: false
    },
    reducers: {

        isLoading: state => {
            state.loadingDeliver = true
            state.deliverHasErrors = false
            state.deliverMessage = ""
            state.isDelivered = false
        },

        deliverSuccess: state => {
            state.loadingDeliver = false
            state.deliverHasErrors = false
            state.deliverMessage= ""
            state.isDelivered = true
        },

        deliverFailure: (state, {payload}) => {
            state.loadingDeliver = false
            state.deliverHasErrors = true
            state.deliverMessage= payload
            state.isDelivered = false
        }
    }
})

export function deliverOrder(orderId) {
    return async dispatch => {
        dispatch(isLoading())

        try {

            const token = userInfoFromStorage.token
            const config = {
                method: "PUT",
                headers: {'auth-token': token}
            }
            
            const response = await fetch(`/api/orders/${orderId}/deliver`, config)
            const data = await response.json()

            if(!data.error) {
                dispatch(deliverSuccess())
            } else if(data.error){
                dispatch(deliverFailure(data.error))
            }
            
        } catch (error) {
            dispatch(deliverFailure(error.message))
        }
    }
}
export const {isLoading, deliverSuccess, deliverFailure} = orderDeliverSlice.actions
export const orderDeliverSelector = state => state.orderDeliver
export default orderDeliverSlice.reducer