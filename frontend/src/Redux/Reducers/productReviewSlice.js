import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    loading: false,
    hasErrors: false,
    productReview: {
        rating: 0,
        comment: ""
    },
    errorMessage: "",
    createErrorMessage: "",
    deleteErrorMessage: "",
    successMessage: "",
    deleteMessage: ""
}

const productReviewSlice = createSlice({
    name:"review",
    initialState,
    reducers: {

        isLoading: state => {
            state.loading = true
            state.hasErrors = false
            state.productReview = {}
            state.errorMessage = ""
            state.createErrorMessage = ""
            state.deleteErrorMessage = ""
            state.successMessage = ""
            state.deleteMessage = ""
        },

        serverError: (state, {payload}) => {
            state.loading = false
            state.hasErrors = true
            state.productReview = {}
            state.errorMessage = payload
            state.createErrorMessage = ""
            state.deleteErrorMessage = ""
            state.successMessage = ""
            state.deleteMessage = ""
        },

        fetchReviewSuccess: (state, {payload}) => {
            state.loading = false
            state.hasErrors = false
            state.productReview = {
                rating: payload.rating,
                comment: payload.comment
            }
            state.errorMessage = ""
            state.createErrorMessage = ""
            state.deleteErrorMessage = ""
            state.deleteMessage = ""
            state.successMessage = ""
        },

        fetchReviewFailure: (state, {payload}) => {
            state.loading = false
            state.hasErrors = false
            state.productReview = payload
            state.errorMessage = ""
            state.createErrorMessage = payload
            state.deleteMessage = ""
            state.deleteErrorMessage = ""
            state.successMessage = ""
        },

        createReviewSuccess: (state, {payload}) => {
            state.loading = false
            state.hasErrors = false
            state.productReview = {
                rating: payload.rating,
                comment: payload.comment
            }
            state.errorMessage = ""
            state.createErrorMessage = ""
            state.deleteErrorMessage = ""
            state.successMessage = "Review added!"
            state.deleteMessage = ""
        },

        createReviewFailure: (state, {payload}) => {
            state.loading = false
            state.hasErrors = true
            state.productReview = {}
            state.errorMessage = ""
            state.createErrorMessage = payload
            state.deleteErrorMessage = ""
            state.successMessage = ""
            state.deleteMessage = ""
        },

        deleteReviewSuccess: (state, {payload}) => {
            state.loading = false
            state.hasErrors = false
            state.productReview = {}
            state.errorMessage = ""
            state.createErrorMessage = ""
            state.deleteErrorMessage = ""
            state.successMessage = ""
            state.deleteMessage = payload
        },

        deleteReviewFailure: (state, {payload}) => {
            state.loading = false
            state.hasErrors = true
            state.errorMessage = ""
            state.createErrorMessage = ""
            state.deleteErrorMessage = payload
            state.successMessage = ""
            state.deleteMessage = ""
        },

        resetReview: state => {
            state.loading = false
            state.hasErrors = false
            state.productReview = {}
            state.errorMessage = ""
            state.createErrorMessage = ""
            state.deleteErrorMessage = ""
            state.successMessage = ""
            state.deleteMessage = ""
        }
    }
})

export function createReview(productId, rating, comment, token) {
    return async dispatch => {
        isLoading()

        try {
            
            const config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                },
                body: JSON.stringify({
                    rating: rating,
                    comment: comment,
                    productId: productId
                })
            }

            const response = await fetch(`/api/products/${productId}/reviews`, config)
            const data = await response.json()

            if (!data.error) {
                dispatch(createReviewSuccess(data))
            } else if (data.error) {
                dispatch(createReviewFailure(data.error))
            }
        } catch (error) {
            dispatch(serverError(error.message))
        }
    }
}

export function fetchReview(productId, token) {
    return async dispatch => {
        isLoading()

        try {
            
            const config = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            }

            const response = await fetch(`/api/products/${productId}/reviews`, config)
            const data = await response.json()

            if (!data.error) {
                dispatch(fetchReviewSuccess(data))
            } else if (data.error) {
                dispatch(fetchReviewFailure(data.error))
            }

        } catch (error) {
            dispatch(serverError(error.message))
        }
    }
}

export function deleteReview(productId, token) {
    return async dispatch => {
        isLoading()

        try {
            
            const config = {
                method: "DELETE",
                headers: {
                    "auth-token": token
                }
            }

            await fetch(`/api/products/${productId}/reviews`, config)
            dispatch(deleteReviewSuccess("Review successfully deleted!"))
        } catch (error) {
            dispatch(deleteReviewFailure("Something went wrong, please try again later."))
        }
    }
}

export const {
    isLoading, 
    serverError, 
    fetchReviewSuccess,
    fetchReviewFailure,
    createReviewSuccess, 
    createReviewFailure, 
    deleteReviewSuccess, 
    deleteReviewFailure,
    resetReview
} = productReviewSlice.actions

export const productReviewSelector = state => state.review

export default productReviewSlice.reducer