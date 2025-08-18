// src/redux/apis/cartApi.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";    // <- axios baseURL already set

// ➊ Add to cart
export const addToCart = createAsyncThunk(
  "cart/add",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/cart", payload);
      return data.cartItem;          // returns new cart document
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cartItemId, quantity }, thunkAPI) => {
    const { data } = await axios.put(`/cart/${cartItemId}`, { quantity });
    return data;
  }
);

// ➋ Get current user cart
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/cart");
      return data.cart;              // array of cart items
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

// ➌ Remove item
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (itemId, { rejectWithValue }) => {
    try {
      await axios.delete(`/cart/${itemId}`);
      return itemId;                 // return deleted id so slice can filter
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const clearCartAPI = createAsyncThunk(
  "cart/clearAll",
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete("/clear");
      return true;
    } catch (err) {
      console.log(err)
      return rejectWithValue(
        err.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);
