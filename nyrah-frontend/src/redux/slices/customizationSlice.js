import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCustomizations,
  createCustomization,
  getCustomizationsByGroup,
  updateCustomization,
  deleteCustomization,
} from "../apis/customizationApi";

const customizationSlice = createSlice({
  name: "customization",
  initialState: {
    customizations: [], // for admin list
    customizationByProductGroup: null, // for frontend usage
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearCustomizationError: (state) => {
      state.error = null;
    },
    resetCustomizationSuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Create
    builder
      .addCase(createCustomization.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCustomization.fulfilled, (state, action) => {
        state.loading = false;
        state.customizations.push(action.payload);
        state.success = "Customization created successfully";
      })
      .addCase(createCustomization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get all
    builder
      .addCase(getAllCustomizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCustomizations.fulfilled, (state, action) => {
        state.loading = false;
        state.customizations = action.payload;
      })
      .addCase(getAllCustomizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get by product group (frontend usage)
    builder
      .addCase(getCustomizationsByGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCustomizationsByGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.customizationByProductGroup = action.payload;
      })
      .addCase(getCustomizationsByGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update
    builder
      .addCase(updateCustomization.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomization.fulfilled, (state, action) => {
        state.loading = false;
        state.customizations = state.customizations.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
        state.success = "Customization updated successfully";
      })
      .addCase(updateCustomization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete
    builder
      .addCase(deleteCustomization.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCustomization.fulfilled, (state, action) => {
        state.loading = false;
        state.customizations = state.customizations.filter(
          (c) => c._id !== action.payload
        );
        state.success = "Customization deleted successfully";
      })
      .addCase(deleteCustomization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCustomizationError, resetCustomizationSuccess } =
  customizationSlice.actions;

export default customizationSlice.reducer;