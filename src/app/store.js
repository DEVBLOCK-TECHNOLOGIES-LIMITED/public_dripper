import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import commentReducer from "../features/comments/commentSlice";
import subscribeReducer from "../features/subscription/subscrptionSlice";
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";
import shippingFeeReducer from "../features/shipping/shippingSlice";
import orderReducer from "../features/orders/orderSlice";
import creditsReducer from "../features/credits/creditsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    comment: commentReducer,
    subscribe: subscribeReducer,
    products: productReducer,
    cart: cartReducer,
    shippingFee: shippingFeeReducer,
    orders: orderReducer,
    credits: creditsReducer,
  },
});
