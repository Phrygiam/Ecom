import {createSlice} from "@reduxjs/toolkit"

const fetchOrderListSlice = createSlice({
    name:"fetchOrderList",
    initialState: {
        listLoading: true,
        listMessage: "",
        listHasErrors: false,
        orderList: []
    },
    reducers: {

        isLoading: state => {
            state.listLoading = true
            state.listMessage = ""
            state.listHasErrors = false
        },

        fetchOrderListSuccess: (state, {payload}) => {
            state.listLoading = false
            state.listMessage = ""
            state.listHasErrors = false
            state.orderList = payload
        },

        resetFetchOrderList: state => {
            state.listLoading = false
            state.listMessage = ""
            state.listHasErrors = false
            state.orderList = []
        },

        fetchOrderListFailure: (state, {payload}) => {
            state.listLoading = false
            state.listMessage = payload
            state.listHasErrors = true
        }

    }
})

export function listMyOrders(token) {
    return async dispatch => {
        dispatch(isLoading())

        try {
            
            const config = {
                method: "GET",
                headers: {'auth-token': token}
            }

            
            const response = await fetch("/api/orders/myorders", config)
            const data = await response.json()

            if(!data.error) {
                dispatch(fetchOrderListSuccess(data))
            }
            
        } catch (error) {
            dispatch(fetchOrderListFailure(error.message))
        }
    }
}

export function listAllOrders(token) {
    return async dispatch => {
        dispatch(isLoading())

        try {

            const config = {
                method: "GET",
                headers: {'auth-token': token}
            }

            const response = await fetch("/api/orders", config)
            const data = await response.json()

            dispatch(fetchOrderListSuccess(data))

        } catch (error) {
            dispatch(fetchOrderListFailure(error.message))
        }
    }
}


export const {isLoading, fetchOrderListSuccess, resetFetchOrderList, fetchOrderListFailure} = fetchOrderListSlice.actions
export const fetchOrderListSelector = state => state.fetchOrderList
export default fetchOrderListSlice.reducer