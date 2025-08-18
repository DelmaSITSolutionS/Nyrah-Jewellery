import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCharges,
  updateCharges,
  upsertIntlRate,
  deleteIntlRate,
} from "../apis/chargesApi";

const initialState = {
  loading: false,
  error: null,
  data: null,
};

const chargesSlice = createSlice({
  name: "charges",
  initialState,
  reducers: {
    clearChargesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharges.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.data = payload;
      })
      .addCase(fetchCharges.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(updateCharges.fulfilled, (state, { payload }) => {
        state.data = payload;
      })

      .addCase(upsertIntlRate.fulfilled, (state, { payload }) => {
        const index = state.data.internationalShipping.findIndex(
          (r) => r.country === payload.country && r.courier === payload.courier
        );
        if (index !== -1) {
          state.data.internationalShipping[index] = payload;
        } else {
          state.data.internationalShipping.push(payload);
        }
      })

      .addCase(deleteIntlRate.fulfilled, (state, { payload }) => {
        state.data.internationalShipping = state.data.internationalShipping.filter(
          (r) => !(r.country === payload.country && r.courier === payload.courier)
        );
      });
  },
});

export const { clearChargesError } = chargesSlice.actions;
export default chargesSlice.reducer;
