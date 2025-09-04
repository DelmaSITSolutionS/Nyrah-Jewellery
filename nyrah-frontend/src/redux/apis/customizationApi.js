import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";    // <- axios baseURL already set

// Create Customization
export const createCustomization = createAsyncThunk(
  "customization/create",
  async (customizationData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/admin/customization/new",
        customizationData,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create customization"
      );
    }
  }
);

// Get All Customizations (Admin only)
export const getAllCustomizations = createAsyncThunk(
  "customization/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/admin/customization", {
        withCredentials: true,
      });
      return data.customizations;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch customizations"
      );
    }
  }
);

// Get Customizations By Product Group (Public)
export const getCustomizationsByGroup = createAsyncThunk(
  "customization/getByGroup",
  async (productGroup, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/customization/${productGroup}`
      );
      return data.customization;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch group customizations"
      );
    }
  }
);

// Update Customization
export const updateCustomization = createAsyncThunk(
  "customization/update",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/admin/customization/${id}`,
        updateData,
        { withCredentials: true }
      );
      return data.customization;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update customization"
      );
    }
  }
);

// Delete Customization
export const deleteCustomization = createAsyncThunk(
  "customization/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/admin/customization/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete customization"
      );
    }
  }
);