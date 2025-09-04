import { createSlice } from "@reduxjs/toolkit";
import { endpoints, getAllOptions, createOption, deleteOption, updateOption } from "../apis/optionApi";

const initial = {};
Object.keys(endpoints).forEach((key) => {
  initial[key] = {
    list: [],
    loading: false,
    error: null,
  };
});

const optionsSlice = createSlice({
  name: "options",
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    Object.keys(endpoints).forEach((key) => {
      // GET ALL
      builder
        .addCase(getAllOptions[key].fulfilled, (state, { payload }) => {
          state[payload.key] = { list: payload.data, loading: false, error: null };
        })
        .addCase(getAllOptions[key].pending, (state) => {
          state[key].loading = true;
          state[key].error = null;
        })
        .addCase(getAllOptions[key].rejected, (state, { payload }) => {
          state[key].loading = false;
          state[key].error = payload;
        });

      // CREATE
      builder
        .addCase(createOption[key].fulfilled, (state, { payload }) => {
          state[payload.key].list.push(payload.option);
          state[payload.key].loading = false;
        })
        .addCase(createOption[key].pending, (state) => {
          state[key].loading = true;
          state[key].error = null;
        })
        .addCase(createOption[key].rejected, (state, { payload }) => {
          state[key].loading = false;
          state[key].error = payload;
        });

         // UPDATE ✅
    builder
      .addCase(updateOption[key].fulfilled, (state, { payload }) => {
        const { key, option } = payload;
        const index = state[key].list.findIndex((item) => item._id === option._id);
        if (index !== -1) {
          state[key].list[index] = option; // overwrite with updated object
        }
        state[key].loading = false;
      })
      .addCase(updateOption[key].pending, (state) => {
        state[key].loading = true;
        state[key].error = null;
      })
      .addCase(updateOption[key].rejected, (state, { payload }) => {
        state[key].loading = false;
        state[key].error = payload;
      });

      // DELETE
      builder
        .addCase(deleteOption[key].fulfilled, (state, { payload }) => {
          state[payload.key].list = state[payload.key].list.filter((item) => item._id !== payload.id);
          state[payload.key].loading = false;
        })
        .addCase(deleteOption[key].pending, (state) => {
          state[key].loading = true;
          state[key].error = null;
        })
        .addCase(deleteOption[key].rejected, (state, { payload }) => {
          state[key].loading = false;
          state[key].error = payload;
        });
    });
  },
});

export default optionsSlice.reducer;
