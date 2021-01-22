import {createSlice} from "@reduxjs/toolkit"
import {resetFetchOrderList} from "./fetchOrderListSlice"
import {orderReset} from "./orderSlice"
import {cartReset} from "./cartSlice"
import {getDetailsReset} from "./fetchUpdateProductSlice"

const userInfoFromStorage = localStorage.getItem("userInfo") === null ? [] : JSON.parse(localStorage.getItem("userInfo"))

const isLoggedStatus = userInfoFromStorage._id ? true : false

const logSlice = createSlice({
    name:"log",
    initialState: {
        loading: false,
        isLogged: isLoggedStatus,
        userInfo: userInfoFromStorage,
        errorMessage:"",
        logErrorMessage: "",
        hasErrors: false
    },
    reducers: {

        isLoading: state => {
            state.loading = true
            state.errorMessage = ""
            state.logErrorMessage = ""
            state.hasErrors = false
        },

        executeLogin: (state, {payload}) => {
            state.loading = false
            state.isLogged = true
            state.userInfo = payload
            state.errorMessage = ""
            state.logErrorMessage = ""
            state.hasErrors = false
        },

        executeLogout: state => {
            state.loading = false
            state.isLogged = false
            state.userInfo = []
            state.hasErrors = false
            state.errorMessage = ""
            state.logErrorMessage = ""
        },

        loginFailure: (state, {payload}) => {
            state.loading = false
            state.logErrorMessage = payload
            state.hasErrors = true
        },

        executeError: (state, {payload})=> {
            state.loading = false
            state.hasErrors = true
            state.errorMessage = payload
        }
    }
})


export function login (email, password) {

    return async dispatch => {
        dispatch(isLoading())

        try {

            const personalData = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                email:email,
                password: password
                })
            }
         
            
            const response = await fetch("/api/users/login", personalData)
            const data = await response.json()
               
            if(!data.error) {
                dispatch(executeLogin(data))
                localStorage.setItem("userInfo", JSON.stringify(data))
            }
            else if(!email && !password) {
                dispatch(executeLogout())
                dispatch(resetFetchOrderList())
                dispatch(orderReset())
                dispatch(cartReset())
                localStorage.removeItem("userInfo")
            }
            else if(data.error){
                dispatch(loginFailure(data.error))
                console.log(data.error)
            }

        } catch(error) {
            dispatch(executeError(error.message))
        }       
        
    }
}

export function update(name, email, password) {
    return async dispatch => {

        try {

            const token = userInfoFromStorage.token
            const personalData = {
                method: "PUT",
                headers: {
                     'Content-Type': 'application/json',
                     'auth-token': token },
                body: JSON.stringify({
                    name: name,
                    email:email,
                    password: password
                })
            }
         
            
            const response = await fetch("/api/users/profile", personalData)
            const data = await response.json()

            if(!data.error) {
                dispatch(executeLogin(data))
                localStorage.setItem("userInfo", JSON.stringify(data))
            } else if(data.error){
                dispatch(loginFailure(data.error))
            }

        } catch (error) {
            dispatch(executeError(error.message))
        }
    }
}


export const {isLoading, executeLogin, resetUser, executeLogout, loginFailure, executeError} = logSlice.actions
export const logSelector = state => state.log
export default logSlice.reducer