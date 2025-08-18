import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

// 1. GET Charges
export const fetchCharges = createAsyncThunk(
  "charges/fetch",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/charges");
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// redux/apis/chargesApi.js
export const createCharges = createAsyncThunk(
  "charges/createCharges",
  async (payload, thunkAPI) => {
    try {
      const { data } = await API.post("/admin/charges", payload);
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 2. UPDATE Charges
export const updateCharges = createAsyncThunk(
  "charges/update",
  async (payload, thunkAPI) => {
    try {
      const { data } = await API.put("/admin/charges", payload);
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 3. Upsert International Shipping
export const upsertIntlRate = createAsyncThunk(
  "charges/upsertIntl",
  async (payload, thunkAPI) => {
    try {
      const { data } = await API.put("/admin/charges/international", payload);
      return data.data; // ✅ correct field from backend
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 4. Delete International Shipping
export const deleteIntlRate = createAsyncThunk(
  "charges/deleteIntl",
  async ({ country, courier }, thunkAPI) => {
    try {
      await API.delete(`/admin/charges/international/${country}/${courier}`);
      return { country, courier };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
