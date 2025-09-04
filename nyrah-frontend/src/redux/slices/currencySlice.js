// currencySlice.js
import { createSlice } from "@reduxjs/toolkit";

const currencySlice = createSlice({
  name: "currency",
  initialState: { selected: null },
  reducers: {
    setCurrency: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
