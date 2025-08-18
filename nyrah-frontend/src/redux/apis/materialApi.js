import { toast } from "react-toastify";
import API from "../../utils/axiosInstance.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 🔽 1. Get all materials
export const getAllMaterials = createAsyncThunk("material/getAll", async (_, thunkAPI) => {
  try {
    const { data } = await API.get("/materials");
    return data.materials; // assuming controller returns { materials }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 2. Create new main material tag (e.g., "silver")
export const createNewMaterial = createAsyncThunk("material/create", async (payload, thunkAPI) => {
  try {
    const { data } = await API.post("/admin/material", payload);
    toast(data.message);
    return data.material;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 3. Add a sub-material (e.g., "ring" under "silver")
export const addNewSubMaterial = createAsyncThunk("material/addSub", async (payload, thunkAPI) => {
  try {
    const { data } = await API.put("/admin/material/sub", payload);
    toast.success(data.message);
    return data.material;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 4. Remove a sub-material
export const removeSubMaterial = createAsyncThunk("material/removeSub", async (payload, thunkAPI) => {
  try {
    const { data } = await API.delete("/admin/material/sub", {
      data: payload,
    });
    toast.success(data.message);
    return data.material;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 5. Delete main material tag
export const deleteMaterial = createAsyncThunk("material/delete", async (tag, thunkAPI) => {
  try {
    const { data } = await API.delete(`/admin/material/${tag}`);
    toast.success(data.message);
    return tag;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});
