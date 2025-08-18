import { createSlice } from "@reduxjs/toolkit";
import {
  sendOtp,
  verifyOtp,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  adminUpdateUser,
  adminDeleteUser,
  fetchAllUsers,
} from "../apis/userApi";

const initialState = {
  loading: false,
  user: null,
  isAuthenticated: false,
  otpSent: false,
  error: null,
  adminUsers: [],
  adminLoading: false,
  adminError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
    clearAdminError(state) {
      state.adminError = null;
    },
  },
  extraReducers: (builder) => {
    // ─── GET ALL USERS (admin) ─────────────────
    builder
      .addCase(fetchAllUsers.pending, (s) => {
        s.adminLoading = true;
        s.adminError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (s, { payload }) => {
        s.adminLoading = false;
        s.adminUsers = payload;
      })
      .addCase(fetchAllUsers.rejected, (s, { payload }) => {
        s.adminLoading = false;
        s.adminError = payload;
      });

    /** LOGIN **/
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    /** LOGOUT **/
    builder.addCase(logoutUser.fulfilled, () => initialState);

    /** GET SELF PROFILE **/
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    /** UPDATE SELF PROFILE **/
    builder
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      });

    /** ADMIN UPDATE USER **/
    builder.addCase(adminUpdateUser.fulfilled, (state, action) => {
      const updatedUser = action.payload;
      const index = state.adminUsers.findIndex((u) => u._id === updatedUser._id);
      if (index !== -1) {
        state.adminUsers[index] = { ...state.adminUsers[index], ...updatedUser };
      }
    });

    /** ADMIN DELETE USER **/
    builder.addCase(adminDeleteUser.fulfilled, (state, action) => {
      if (state.user && state.user._id === action.payload) {
        // if admin deletes self, force logout
        return initialState;
      }
    });
  },
});

export default userSlice.reducer;
