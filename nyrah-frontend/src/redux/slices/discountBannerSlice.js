import { createSlice } from "@reduxjs/toolkit";
import {
  getAllDiscountBanners,
  createDiscountBanner,
  updateDiscountBanner,
  deleteDiscountBanner,
} from "../apis/discountBannerApi";

const discountBannerSlice = createSlice({
  name: "discountBanner",
  initialState: {
    banners: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(getAllDiscountBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDiscountBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(getAllDiscountBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createDiscountBanner.fulfilled, (state, action) => {
        state.banners.push(action.payload);
      })

      // Update
      .addCase(updateDiscountBanner.fulfilled, (state, action) => {
        const index = state.banners.findIndex(
          (banner) => banner._id === action.payload._id
        );
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteDiscountBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter(
          (banner) => banner._id !== action.payload
        );
      });
  },
});

export default discountBannerSlice.reducer;
