import {createSlice} from "@reduxjs/toolkit"

 const initialState = {
    loading: false,
    hasErrors: false,
    productData: [],
    errorMessage: ""
}

const productsSlice = createSlice({
    name: "data",
    initialState,
    reducers: {

        getProducts: state => {
            state.loading = true
        },

        getProductsSuccess: (state, {payload}) => {
            state.productData = payload
            state.loading = false
            state.hasErrors = false
        },

        getProductsFailure: (state, {payload}) => {
            state.loading = false
            state.hasErrors = true
            state.errorMessage = payload
        }
    }
})


export function fetchProducts (keyword="", pageNumber ="") {

    return async dispatch => {
        dispatch(getProducts())

   
        try {
            const response = await fetch(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`)
            const data = await response.json()
  
            dispatch(getProductsSuccess(data))
        } catch (error) {
         
            dispatch(getProductsFailure(error.message))
        }
    }
}

export const productsSelector = (state)=> state.data
export const { getProducts, getProductsSuccess, getProductsFailure } = productsSlice.actions
export default productsSlice.reducer
