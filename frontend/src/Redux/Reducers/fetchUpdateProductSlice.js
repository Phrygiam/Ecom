import {createSlice} from "@reduxjs/toolkit"
import {fetchProducts} from "./productsSlice"

const userInfoFromStorage = localStorage.getItem("userInfo") === null ? [] : JSON.parse(localStorage.getItem("userInfo"))

const initialState = {
    loading: false,
    hasErrors: false,
    productDetails: {},
    errorMessage: "",
    createErrorMessage: "",
    updateErrorMessage: "",
    successMessage: ""
}

const fetchUpdateProductSlice = createSlice({
    name: "product",
    initialState,
    reducers: {

        getDetails: state => {
            state.loading = true
        },

        getDetailsSuccess: (state, {payload} )=> {
            state.loading = false
            state.hasErrors = false
            state.errorMessage = ""
            state.createErrorMessage = ""
            state.updateErrorMEssage = ""
            state.productDetails = payload
            state.successMessage = ""
        },

        getDetailsFailure: (state, {payload}) => {
            state.loading = false
            state.hasErrors = true
            state.errorMessage = payload
            state.createErrorMessage = ""
            state.updateErrorMessage = ""
            state.successMessage = ""
        },

        getDetailsReset : state => {
            state.loading = false
            state.hasErrors = false
            state.errorMessage = ""
            state.createErrorMessage = ""
            state.updateErrorMessage = ""
            state.productDetails = {}
            state.successMessage = ""
        },

        createProductSuccess: (state, {payload}) => {
            state.loading = false
            state.hasErrors = false
            state.errorMessage = ""
            state.createErrorMessage = ""
            state.updateErrorMEssage = ""
            state.productDetails = payload
            state.successMessage = "Item created Successfully"
        },

        createProductFailure: (state, {payload}) => {
            state.loading = false
            state.errorMessage = ""
            state.hasErrors = true
            state.createErrorMessage = payload
            state.updateErrorMessage = ""
            state.successMessage = ""
        },

        updateProductSuccess: (state, {payload}) => {
            state.loading = false
            state.hasErrors = false
            state.errorMessage = ""
            state.createErrorMessage = ""
            state.updateErrorMessage = ""
            state.productDetails = payload
            state.successMessage = "Item updated Successfully"
        },

        updateProductFailure: (state, {payload}) => {
            state.loading = false
            state.errorMessage = ""
            state.hasErrors = true
            state.createErrorMessage = ""
            state.updateErrorMessage = payload
            state.successMessage = ""
        },

        deleteProductSuccess: state => {
            state.loading = false
            state.hasErrors = false
            state.errorMessage = ""
            state.createErrorMessage = ""
            state.updateErrorMessage = ""
            state.successMessage = ""
        },

        deleteProductFailure: (state, {payload}) => {
            state.loading = false
            state.errorMessage = payload
            state.createErrorMessage = ""
            state.updateErrorMessage = ""
            state.hasErrors = true  
            state.successMessage = ""
        }
    }
})

export function fetchDetails (id) {
    return async dispatch => {
        dispatch(getDetails())

        try {
            const response = await fetch(`/api/products/${id}`)
            const data = await response.json()

            if(!data.error) {
                dispatch(getDetailsSuccess(data))
            } else if (data.error) {
                dispatch(getDetailsFailure(data.error))
            }
            
        } catch (error) {
            dispatch(getDetailsFailure(error.message))
        }
    }
}

export function deleteProduct(id) {
    return async dispatch => {
        dispatch(getDetails())

        try {
            const token = userInfoFromStorage.token
            const config = {
                method: "DELETE",
                headers: {'auth-token': token }
            }

            const response = await fetch(`/api/products/${id}`, config)
            const data = await response.json()

            if (!data.error) {
                dispatch(deleteProductSuccess(data))
                dispatch(fetchProducts())
            }
        } catch (error) {
            dispatch(deleteProductFailure(error.message))
        }
    }
}

export function createProduct(name, image, brand, category, countInStock, description, price) {
    return async dispatch => {
        dispatch(getDetails())

        try {

            const token = userInfoFromStorage.token
            const config = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({
                    name: name,                   
                    image: image,
                    brand: brand,
                    category: category,
                    countInStock: countInStock,
                    description: description,
                    price: price
                })
            }
            
            const response = await fetch("/api/products", config)
            const data = await response.json()

            if (!data.error) {
                dispatch(createProductSuccess(data))
            } else if(data.error){
                dispatch(createProductFailure(data.error))
            }
        } catch(error) {
            dispatch(createProductFailure(error.message))
        }
    }
}

export function updateProduct(name, image, brand, category, countInStock, description, price, productId) {
    return async dispatch => {
        dispatch (getDetails())

        try {

            const token = userInfoFromStorage.token
            const config = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                 },
                 body: JSON.stringify({
                    name: name,                   
                    image: image,
                    brand: brand,
                    category: category,
                    countInStock: countInStock,
                    description: description,
                    price: price
                 })
            }

            const response = await fetch(`/api/products/${productId}`, config)
            const data = await response.json()

            if (!data.error) {
                dispatch(updateProductSuccess(data))
            } else if(data.error){
                dispatch(updateProductFailure(data.error))
            }


        } catch(error) {
            dispatch(updateProductFailure(error.message))
        }
    }
}

export const {
    getDetails,
    getDetailsSuccess, 
    getDetailsFailure,
    getDetailsReset,
    createProductSuccess, 
    createProductFailure,
    updateProductSuccess,
    updateProductFailure,
    deleteProductSuccess, 
    deleteProductFailure
} = fetchUpdateProductSlice.actions

export const detailsSelector = state => state.product

export default fetchUpdateProductSlice.reducer