import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { creditsService } from "./creditsService";

const initialState = {
  balance: 0,
  packages: [],
  transactions: [],
  transactionTotal: 0,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Get user's credit balance
export const getCredits = createAsyncThunk(
  "credits/getCredits",
  async (email, thunkAPI) => {
    try {
      const response = await creditsService.getCredits(email);
      return response.data;
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

// Get available credit packages
export const getPackages = createAsyncThunk(
  "credits/getPackages",
  async (_, thunkAPI) => {
    try {
      const response = await creditsService.getPackages();
      return response.data;
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

// Purchase credit package
export const purchaseCredits = createAsyncThunk(
  "credits/purchase",
  async (data, thunkAPI) => {
    try {
      // data already contains email, packageId, paymentMethod, and now idempotencyKey
      const response = await creditsService.purchaseCredits(data);
      return response.data;
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

// Spend credits
export const spendCredits = createAsyncThunk(
  "credits/spend",
  async (data, thunkAPI) => {
    try {
      const response = await creditsService.spendCredits(data);
      return response.data;
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

// Get transaction history
export const getHistory = createAsyncThunk(
  "credits/getHistory",
  async (data, thunkAPI) => {
    try {
      const response = await creditsService.getHistory(data);
      return response.data;
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

// Reward credits
export const rewardCredits = createAsyncThunk(
  "credits/reward",
  async (data, thunkAPI) => {
    try {
      const response = await creditsService.rewardCredits(data);
      return response.data;
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

const creditsSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    clearCredits: (state) => {
      state.balance = 0;
      state.transactions = [];
      state.transactionTotal = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Credits
      .addCase(getCredits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCredits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.balance = action.payload.balance;
      })
      // Get Packages
      .addCase(getPackages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packages = action.payload;
      })
      // Purchase Credits
      .addCase(purchaseCredits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(purchaseCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(purchaseCredits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.balance = action.payload.balance;
        if (action.payload.transaction) {
          state.transactions.unshift(action.payload.transaction);
        }
      })
      // Spend Credits
      .addCase(spendCredits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(spendCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(spendCredits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.balance = action.payload.balance;
        if (action.payload.transaction) {
          state.transactions.unshift(action.payload.transaction);
        }
      })
      // Get History
      .addCase(getHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
        state.transactions = action.payload.transactions;
        state.transactionTotal = action.payload.total;
      })
      // Reward Credits
      .addCase(rewardCredits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rewardCredits.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(rewardCredits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.balance = action.payload.balance;
        if (action.payload.transaction) {
          state.transactions.unshift(action.payload.transaction);
        }
      });
  },
});

export const { reset, clearCredits } = creditsSlice.actions;
export default creditsSlice.reducer;
