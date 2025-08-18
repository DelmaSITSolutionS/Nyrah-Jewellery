// src/redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  addToCart,
  clearCartAPI,
  fetchCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../apis/cartApi";

const initialState = {
  items: [], // Array of cart item objects
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
    resetCart: (state) => {
      // same as clearCart, but for naming clarity post-payment
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* 🚚 FETCH CART */
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      });

    /* ➕ ADD ITEM */
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload || "Failed to add item";
      });

    /* ❌ REMOVE ITEM */
    builder
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const removedId = action.payload;
        state.items = state.items.filter((i) => i._id !== removedId);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload || "Failed to remove item";
      });

    /* 🔁 UPDATE QUANTITY */
    builder
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const { cartItemId, quantity } = action.meta.arg;
        const item = state.items.find((i) => i._id === cartItemId);
        if (item) item.quantity = quantity;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.error = action.payload || "Failed to update quantity";
      });

    builder
      .addCase(clearCartAPI.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearCartAPI.rejected, (state, action) => {
        state.error = action.payload || "Failed to clear cart";
      });
  },
});

export const { clearCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
