import {createSlice} from "@reduxjs/toolkit"
import {fetchUsers} from "./userListSlice"

const userInfoFromStorage = localStorage.getItem("userInfo") === null ? [] : JSON.parse(localStorage.getItem("userInfo"))

const initialState = {
    loading: false,
    hasErrors: false,
    message: "",
    user: []
}

const fetchUpdateUserSlice = createSlice({

    name: "user",
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
            state.user = payload
            state.message = ""
        },

        isUnsuccessful: (state, {payload})=> {
            state.loading = false
            state.hasErrors = true
            state.message = payload
        },

        deleteUserSuccess: state => {
            state.loading = false
            state.message = ""
            state.hasErrors = false
        },

        deleteUserFailure: (state, {payload}) => {
            state.loading = false
            state.message = payload
            state.hasErrors = true
        }
    }
})

export function fetchUser(id) {
    return async dispatch => {
        dispatch(isLoading())

        try {

            const token = userInfoFromStorage.token
            const config = {
                method: "GET",
                headers: {'auth-token': token }
            }

            const response = await fetch(`/api/users/${id}`, config)
            const data = await response.json()
    
            if (!data.error) {
                dispatch(isSuccessful(data))
            }
           
        } catch (error) {
            dispatch(isUnsuccessful(error.message))
        }
    }
}

export function updateUser(name, email, isAdmin, id) {
    return async dispatch => {
        dispatch(isLoading())

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
                    email: email,
                    isAdmin: isAdmin
                })
            }

            const response = await fetch(`/api/users/${id}`, config)
            const data = await response.json()

            if (!data.error) {
                dispatch(isSuccessful(data))
            }

        } catch(error) {
            dispatch(isUnsuccessful(error.message))
        }
    }
}

export function deleteUser(id) {
    return async dispatch => {
        dispatch(isLoading())

        try {

            const token = userInfoFromStorage.token

            const config = {
                method: "DELETE",
                headers: {'auth-token': token }
            }

            const response = await fetch(`/api/users/${id}`, config)
            const data = await response.json()

            if(!data.error) {
                dispatch(deleteUserSuccess())
                dispatch(fetchUsers())
            }

        } catch (error) {
            dispatch(deleteUserFailure(error))
        }
    }
}


export const {isLoading, isSuccessful, isUnsuccessful, deleteUserSuccess, deleteUserFailure} = fetchUpdateUserSlice.actions
export const fetchUpdateUserSelector = state => state.user
export default fetchUpdateUserSlice.reducer