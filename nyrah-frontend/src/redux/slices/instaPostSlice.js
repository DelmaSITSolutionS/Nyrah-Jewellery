import { createSlice } from "@reduxjs/toolkit";
import {
  getAllInstaPosts,
  createInstaPost,
  updateInstaPost,
  deleteInstaPost,
} from "../apis/instaPostApi";

const instaPostSlice = createSlice({
  name: "instaPost",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(getAllInstaPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllInstaPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(getAllInstaPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createInstaPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })

      // Update
      .addCase(updateInstaPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })

      // Delete
      .addCase(deleteInstaPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      });
  },
});

export default instaPostSlice.reducer;
