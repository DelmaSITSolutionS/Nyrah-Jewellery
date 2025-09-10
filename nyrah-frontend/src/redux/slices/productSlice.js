import { createSlice } from "@reduxjs/toolkit";
import {
  createProduct,
  getGroupedProducts,
  getProductsByMain,
  getProductsBySub,
  getProductGroupVariants,
  updateProduct,
  deleteProduct,
  getProductsByMaterialTag,
  getProductsByMaterialSub,
  getProductById,
} from "../apis/productApi";

const initialState = {
  list: [],
  product: null,
  loading: false,
  error: null,
  totalCount: 0,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Grouped Products
      .addCase(getGroupedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroupedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.products;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getGroupedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by Main Category
      .addCase(getProductsByMain.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsByMain.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.products;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getProductsByMain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by Sub Category
      .addCase(getProductsBySub.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsBySub.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.products;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getProductsBySub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by Material Tag
      .addCase(getProductsByMaterialTag.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsByMaterialTag.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.products;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getProductsByMaterialTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get by Material Sub Tag
      .addCase(getProductsByMaterialSub.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsByMaterialSub.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.products;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getProductsByMaterialSub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Group Variants
      .addCase(getProductById.fulfilled, (state, action) => {
        state.product = action.payload.product;
      })

      // Get Group Variants
      .addCase(getProductGroupVariants.fulfilled, (state, action) => {
        state.groupVariants = action.payload;
      })

      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.list.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
