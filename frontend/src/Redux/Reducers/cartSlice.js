import {createSlice} from "@reduxjs/toolkit"

const cartItemsFromStorage = localStorage.getItem("cartProducts") === null ? [] : JSON.parse(localStorage.getItem("cartProducts"))

const initialState = {
    loading: false,
    hasErrors: false,
    cartItems: cartItemsFromStorage,
    message: ""
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {

        getCart: state => {
            state.loading = true
        },

        getCartCreate: (state, {payload}) => {
            state.loading = false
            state.hasErrors = false
            state.cartItems.push(payload)
            localStorage.setItem("cartProducts", JSON.stringify(state.cartItems))
        },

        getCartUpdate: (state, {payload}) => {
            state.loading = false
            state.hasErrors = false
            state.cartItems.forEach(item => {
                if (item.product === payload.itemExists.product) {
                   item.quantity += payload.newQuantity
                   item.message = ""
                }
            })
            localStorage.setItem("cartProducts", JSON.stringify(state.cartItems))
        },

        getCartOrderMax: (state, {payload}) => {
            state.loading = false
            state.hasErrors = false
            state.cartItems.forEach(item => {
                if (item.product === payload.itemExists.product) {
                   item.quantity = payload.maxOrder
                   item.message = "You reached the maximum amount you can order"
                }
            })
            localStorage.setItem("cartProducts", JSON.stringify(state.cartItems))
        },

        getCartDelete: (state, {payload}) => {
            state.loading = false
            state.hasErrors = false
            state.cartItems= payload
            localStorage.setItem("cartProducts", JSON.stringify(state.cartItems))
        },

        cartReset: state => {
            state.loading = false
            state.hasErrors = false
            state.cartItems = []
            localStorage.removeItem("cartProducts")
        },

        getCartFailure: state => {
            state.loading = false
            state.hasErrors = true
            state.message = "Something went wrong while adding the item to the cart"
        }
    }
})
 

export function fetchCart (productId, newQuantity, cart) {

        return async dispatch => {
            dispatch(getCart())

            try {
                const response = await fetch(`/api/products/${productId}`)
                const data = await response.json()
                const allItems = cart.cartItems
                const itemExists = allItems.find(item => item.product === data._id)
                
                if (itemExists && itemExists.quantity+newQuantity >0 && data.countInStock > itemExists.quantity + newQuantity) { 
                    dispatch(getCartUpdate({itemExists, newQuantity}))
                }

                 else if(itemExists && itemExists.quantity + newQuantity < 1) {
                    const newCart = cart.cartItems.filter(item => 
                        item.product !== itemExists.product
                    )
                    dispatch(getCartDelete(newCart))
                    
                    }

                 else if (itemExists && newQuantity === "del") {
                    const newCart = cart.cartItems.filter(item => 
                        item.product !== itemExists.product
                    )
                    dispatch(getCartDelete(newCart))
                    
                    }
                
                else if (itemExists && data.countInStock <= itemExists.quantity + newQuantity) {
                    const maxOrder = data.countInStock
                    dispatch(getCartOrderMax({itemExists, maxOrder}))
                    
                }

                else {
                    const newItem = {
                        product: data._id,
                        name: data.name,
                        image: data.image,
                        price: data.price,
                        quantity:newQuantity,
                        message: ""
                    }
                    dispatch(getCartCreate(newItem))

                }
                
            } catch (error) {
                dispatch(getCartFailure())
                
            }
            
        }
}

export const { getCart, getCartCreate, getCartDelete, getCartUpdate, getCartOrderMax, cartReset, getCartFailure} = cartSlice.actions
export const cartSelector = state => state.cart
export default cartSlice.reducer
