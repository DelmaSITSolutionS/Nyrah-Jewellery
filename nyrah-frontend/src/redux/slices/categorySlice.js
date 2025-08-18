import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCategories,
  createNewCategory,
  addNewSubcategory,
  removeSubCategory,
  deleteCategory,
  updateCategory,
} from "../apis/categoryApi";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createNewCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      .addCase(addNewSubcategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat.main === action.payload.main
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      .addCase(removeSubCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat.main === action.payload.main
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat.main !== action.payload
        );
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      });
  },
});

export default categorySlice.reducer;
