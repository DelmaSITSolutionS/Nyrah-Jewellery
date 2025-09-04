import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

// 🚀 Create Order After Payment
export const createOrder = createAsyncThunk(
  "order/create",
  async ({ cartItems, shippingInfo, paymentInfo,charges,totalAmount,symbol,currency }, thunkAPI) => {
    try {
      
      const { data } = await API.post("/order/new", {
        cartItems,
        symbol,
        currency,
        shippingInfo,
        paymentInfo,
        charges,
        totalAmount
      });
      return data.order;
    } catch (err) {
        console.log(err)
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 🛒 Get All Orders (Admin)
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/admin/orders");
      return data.orders;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/orders/my-orders");
      return res.data.orders;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

// 📦 Get One Order by ID (Admin)
export const getOrderDetails = createAsyncThunk(
  "order/getDetails",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await API.get(`/order/${orderId}`);
      return data.order;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 🔄 Update Order Status (Admin)
export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ orderId, status, message }, thunkAPI) => {
    try {
      console.log(orderId)
      const { data } = await API.put(`/admin/order/status/${orderId}`, {
        status,
        message,
      });
      return data.order;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
