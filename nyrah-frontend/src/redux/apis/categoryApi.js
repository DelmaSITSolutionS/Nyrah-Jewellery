import { toast } from "react-toastify";
import API from "../../utils/axiosInstance.js";
import { createAsyncThunk } from "@reduxjs/toolkit";


// 🔽 1. Get all categories
export const getAllCategories = createAsyncThunk("category/getAll", async (_, thunkAPI) => {
  try {
    const { data } = await API.get("/categories");
    return data.categories;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 2. Create new main category
export const createNewCategory = createAsyncThunk("category/create", async (payload, thunkAPI) => {
  try {
    const { data } = await API.post("/admin/category", payload);
    toast(data.message)
    return data.category;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message)
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 3. Add a subcategory to an existing main category
export const addNewSubcategory = createAsyncThunk("category/addSub", async (payload, thunkAPI) => {
  try {
    const { data } = await API.put("/admin/category/sub", payload);
    toast.success(data.message)
    return data.category;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message)
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 4. Remove a subcategory
export const removeSubCategory = createAsyncThunk("category/removeSub", async (payload, thunkAPI) => {
  try {
    const { data } = await API.delete("/admin/category/sub", {
        data:payload
    });
    toast.success(data.message)
    return data.category;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message)
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 5. Delete main category
export const deleteCategory = createAsyncThunk("category/delete", async (main, thunkAPI) => {
  try {
    const {data} = await API.delete(`/admin/category/${main}`);
    toast.success(data.message)
    return main;
  } catch (err) {
    console.log(err)
    toast.error(err.response?.data?.message || err.message)
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

// 🔽 6. Update a main category or its subcategories
export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, main, sub }, thunkAPI) => {
    try {
      const payload = { main, sub };
      const { data } = await API.patch(`/admin/category/${id}`, payload);
      toast.success(data.message);
      return data.category;
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
