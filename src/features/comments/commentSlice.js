import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import commentService from './commentService'

const initialState = {
    isError : false,
    isLoading : false,
    isSuccess : false,
    message : ''
}

export const sendComment = createAsyncThunk('comment/send', async(data, thunkAPI)=>{
    try {
        return await commentService.sendComment(data)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})

const commentSlice = createSlice({
    name : 'comment',
    initialState,
    reducers : {
        reset : (state)=>{
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = ''
        }
    },
    extraReducers : (builder)=>{
        builder
        .addCase(sendComment.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(sendComment.rejected, (state, action)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(sendComment.fulfilled, (state, action)=>{
            state.isLoading = false
            state.isSuccess = true
        })
    }
})

export const {reset} = commentSlice.actions
export default commentSlice.reducer