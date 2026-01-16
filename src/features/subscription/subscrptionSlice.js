import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import subscriptionService from './subscriptionService'

const initialState = {
    isError : false,
    isLoading : false,
    isSuccess : false,
    message : ''
}

export const subscribe = createAsyncThunk('subscribe/subscribe', async(data, thunkAPI)=>{
    try {
        return await subscriptionService.subscribe(data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})

const subscriptionSlice = createSlice({
    name : 'subscribe',
    initialState,
    reducers : {
        reset : (state)=>{
            state.isError = false
            state.isLoading = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers : (builder)=>{
        builder
        .addCase(subscribe.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(subscribe.rejected, (state, action)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(subscribe.fulfilled, (state, action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload.message
        })
    }
})

export const {reset} = subscriptionSlice.actions
export default subscriptionSlice.reducer