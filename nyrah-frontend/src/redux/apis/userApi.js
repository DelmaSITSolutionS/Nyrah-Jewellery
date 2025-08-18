import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance"; // your central Axios client

// 1) AUTH USER
export const sendOtp = createAsyncThunk(
  "user/sendOtp",
  async ({ email, password }, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/send-otp", { email, password });
      return data.message;
    } catch (err) {
      
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async ({ email, otp }, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/verify-otp", { email, otp });
      return data.user;
    } catch (err) {
        console.log(err.response?.data?.message || err.message)

      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 2)  LOGOUT (clears cookie server‑side)
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      await API.get("/logout");
      return true; // simply signals success
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 3)  GET SELF PROFILE  ➜  GET /me
export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/me");
      return data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 4)  UPDATE SELF PROFILE  ➜  PUT /me/update
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (updates, thunkAPI) => {
    try {
      const { data } = await API.put("/me/update", updates);
      return data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 5)  ADMIN‑ONLY UPDATE ANY USER  ➜  PUT /admin/user/:id
export const adminUpdateUser = createAsyncThunk(
  "user/adminUpdate",
  async ({ id, updates }, thunkAPI) => {
    try {
      const { data } = await API.put(`/admin/user/${id}`, updates);
      return data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 6)  ADMIN‑ONLY DELETE USER  ➜  DELETE /admin/user/:id
export const adminDeleteUser = createAsyncThunk(
  "user/adminDelete",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/admin/user/${id}`);
      return id; // return deleted user id
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// GET all users (admin)
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/admin/users");
      return data.users;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
