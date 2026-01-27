import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import {
  addToCart,
  removeFromCart,
  deleteCart,
  deleteFromCart,
  getCart,
} from "../cart/cartSlice";
// import {
//   purchaseCredits,
//   spendCredits,
//   rewardCredits,
//   getCredits,
// } from "../credits/creditsSlice";

const user = JSON.parse(localStorage.getItem("public-dripper-user"));

const initialState = {
  user: user ? user : null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      return await authService.regUser(data);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() ||
        error.Error;
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    return authService.logout();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    return await authService.loginUser(data);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (token, thunkAPI) => {
    try {
      return await authService.googleLogin(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ email, profileData }, thunkAPI) => {
    try {
      return await authService.updateProfile(email, profileData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const addAddress = createAsyncThunk(
  "auth/addAddress",
  async ({ email, address }, thunkAPI) => {
    try {
      return await authService.addAddress(email, address);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const removeAddress = createAsyncThunk(
  "auth/removeAddress",
  async ({ email, id }, thunkAPI) => {
    try {
      return await authService.removeAddress(email, id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const addCard = createAsyncThunk(
  "auth/addCard",
  async ({ email, card }, thunkAPI) => {
    try {
      return await authService.addCard(email, card);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const removeCard = createAsyncThunk(
  "auth/removeCard",
  async ({ email, id }, thunkAPI) => {
    try {
      return await authService.removeCard(email, id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Do not set state.user here, as we require email verification
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(addCard.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(removeCard.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      // Sync Cart changes to User Profile
      .addCase(getCart.fulfilled, (state, action) => {
        if (state.user && state.user.data) {
          state.user.data.cart = action.payload.data;
        }
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        if (state.user && state.user.data) {
          state.user.data.cart = action.payload.data;
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (state.user && state.user.data) {
          state.user.data.cart = action.payload.data;
        }
      })
      .addCase(deleteFromCart.fulfilled, (state, action) => {
        if (state.user && state.user.data) {
          state.user.data.cart = action.payload.data;
        }
      })
      .addCase(deleteCart.fulfilled, (state, action) => {
        if (state.user && state.user.data) {
          state.user.data.cart = [];
        }
      });
    // // Sync Credits balance to User Profile
    // .addCase(getCredits.fulfilled, (state, action) => {
    //   if (state.user && state.user.data) {
    //     state.user.data.balance = action.payload.balance;
    //   }
    // })
    // .addCase(purchaseCredits.fulfilled, (state, action) => {
    //   if (state.user && state.user.data) {
    //     state.user.data.balance = action.payload.balance;
    //   }
    // })
    // .addCase(spendCredits.fulfilled, (state, action) => {
    //   if (state.user && state.user.data) {
    //     state.user.data.balance = action.payload.balance;
    //   }
    // })
    // .addCase(rewardCredits.fulfilled, (state, action) => {
    //   if (state.user && state.user.data) {
    //     state.user.data.balance = action.payload.balance;
    //   }
    // });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
