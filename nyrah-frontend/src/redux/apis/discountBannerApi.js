import { toast } from "react-toastify";
import API from "../../utils/axiosInstance.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 🔽 1. Get all Discount Banners
export const getAllDiscountBanners = createAsyncThunk("discountBanner/getAll", async (_, thunkAPI) => {
  try {
    const { data } = await API.get("/discountbanner");
    return data.banners; // Make sure controller returns `banners` key
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 2. Create new Discount Banner
export const createDiscountBanner = createAsyncThunk("discountBanner/create", async (formData, thunkAPI) => {
  try {
    const { data } = await API.post("/discountbanner", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success(data.message);
    return data.banner;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 3. Update Discount Banner
export const updateDiscountBanner = createAsyncThunk("discountBanner/update", async ({ id, formData }, thunkAPI) => {
  try {
    const { data } = await API.put(`/discountbanner/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success(data.message);
    return data.banner;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 4. Delete Discount Banner
export const deleteDiscountBanner = createAsyncThunk("discountBanner/delete", async (id, thunkAPI) => {
  try {
    const { data } = await API.delete(`/discountbanner/${id}`);
    toast.success(data.message);
    return id;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});
