import {createSlice} from "@reduxjs/toolkit"
import {login} from "./logSlice"

const signSlice = createSlice({
    name:"sign",
    initialState: {
        loading: false,
        hasErrors: false,
        errorMessage:"",
        signErrorMessage: ""
    },

    reducers: {

        isLoading: state => {
            state.loading = true
            state.hasErrors = false
            state.errorMessage = ""
            state.signErrorMessage = ""
        },

        executeSignIn: (state, {payload}) => {
            state.loading = false
            state.hasErrors = false
            state.errorMessage = ""
            state.signErrorMessage = ""
        },

        executeSignFailure: (state, {payload}) => {
            state.loading = false
            state.hasErrors = true
            state.errorMessage = ""
            state.signErrorMessage = payload
        },

        executeFailure: (state, {payload}) => {
            state.loading = false
            state.hasErrors = true
            state.errorMessage = payload
            state.signErrorMessage = ""
        }
    }
})

export function signIn (name, email, password) {

     return async dispatch => {
            dispatch(isLoading())

         try {
            const personalData = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    email:email,
                    password: password
                })
            }   
             
                
            const response = await fetch("/api/users/signin", personalData)
            const data = await response.json()


            if(!data.error) {
                dispatch(executeSignIn(data))
                dispatch(login(email, password))
                
            } else if (data.error) {
                dispatch(executeSignFailure(data.error))
            }
            
                   
        } catch(error) {   
            dispatch(executeFailure(error.message))
        }     
    }   
}
    
export const {isLoading, executeSignIn, executeSignFailure, executeFailure} = signSlice.actions
export const signSelector = state => state.sign
export default signSlice.reducer