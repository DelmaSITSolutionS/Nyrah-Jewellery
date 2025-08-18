import { toast } from "react-toastify";
import API from "../../utils/axiosInstance.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 🔽 1. Get all Insta Posts
export const getAllInstaPosts = createAsyncThunk("insta/getAll", async (_, thunkAPI) => {
  try {
    const { data } = await API.get("/instapost");
    return data.posts;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 2. Create new Insta Post
export const createInstaPost = createAsyncThunk("insta/create", async (formData, thunkAPI) => {
  try {
    const { data } = await API.post("/instapost", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success(data.message);
    return data.instaPost;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 3. Update Insta Post
export const updateInstaPost = createAsyncThunk("insta/update", async ({ id, formData }, thunkAPI) => {
  try {
    const { data } = await API.put(`/instapost/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success(data.message);
    return data.instaPost;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 4. Delete Insta Post
export const deleteInstaPost = createAsyncThunk("insta/delete", async (id, thunkAPI) => {
  try {
    const { data } = await API.delete(`/instapost/${id}`);
    toast.success(data.message);
    return id;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});
