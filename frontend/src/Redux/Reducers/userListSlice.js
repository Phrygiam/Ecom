import {createSlice} from "@reduxjs/toolkit"

const userInfoFromStorage = localStorage.getItem("userInfo") === null ? [] : JSON.parse(localStorage.getItem("userInfo"))

const initialState = {
    loading: false,
    users: [],
    hasErrors: false,
    message: ""
}

const userListSlice = createSlice({
    name: "users",
    initialState,
    reducers: {

        isLoading: state => {
            state.loading = true
            state.hasErrors = false
            state.message = ""
        },

        isSuccessful: (state, {payload}) => {
            state.loading = false
            state.hasErrors = false
            state.users = payload
            state.message = ""
        },

        isUnsuccessful: (state, {payload})=> {
            state.loading = false
            state.hasErrors = true
            state.message = payload
        },
        executeFailure: state => {
            state.loading = false
            state.message = "The information you have entered is not valid"
            state.hasErrors = false
        },
    }
})

export function fetchUsers(token) {
    return async dispatch => {
        dispatch(isLoading())

        try {
   
            const config = {
                method: "GET",
                headers: {'auth-token': token }
            }

            const response = await fetch("/api/users", config)
            const data = await response.json()
     
            dispatch(isSuccessful(data))
    
        } catch (error) {
            dispatch(isUnsuccessful(error.message))
        }
    }
}

export const {isLoading, isSuccessful, isUnsuccessful, executeFailure} = userListSlice.actions
export const userListSelector = state => state.users
export default userListSlice.reducer