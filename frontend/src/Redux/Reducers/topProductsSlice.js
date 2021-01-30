import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    hasErrors: false,
    errorMessage: "",
    topProducts: []
}

const topProductsSlice = createSlice({
    name: "topProducts",
    initialState,
    reducers: {

        isLoading: state => {
            state.loading = true
            state.hasErrors = false
            state.errorMessage = ""
            state.topProducts = []
        },

        fetchIsSuccessful: (state, {payload}) => {
            state.loading = false
            state.hasErrors = false
            state.errorMessage = ""
            state.topProducts = payload
        },

        fetchIsUnsuccessful: (state, {payload}) => {
            state.loading = false
            state.hasErrors = true
            state.errorMessage = payload
            state.topProducts = []
        }
    }
})

export function fetchTopProducts () {
    return async dispatch => {
        isLoading()

        try {
            
            const response = await fetch("/api/products/topRated")
            const data = await response.json()

            dispatch(fetchIsSuccessful(data))
        } catch (error) {
            dispatch(fetchIsUnsuccessful("Could not find any top rated products"))
        }
    }
}

export const topRatedSelector = state => state.topProducts
export const {isLoading, fetchIsSuccessful, fetchIsUnsuccessful} = topProductsSlice.actions
export default topProductsSlice.reducer