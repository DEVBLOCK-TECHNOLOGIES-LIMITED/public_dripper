import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import shippingService from "./shippingService";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  shippingFee: "",
};

export const getShippingFee = createAsyncThunk(
  "shippingFee/get",
  async (data, thunkAPI) => {
    try {
      return await shippingService.getShippingFee(data);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const shippingFeeSlice = createSlice({
  name: "shippingFee",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.shippingFee = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getShippingFee.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getShippingFee.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.shippingFee = action.payload;
    });
    builder.addCase(getShippingFee.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

export const { reset } = shippingFeeSlice.actions;
export default shippingFeeSlice.reducer;
