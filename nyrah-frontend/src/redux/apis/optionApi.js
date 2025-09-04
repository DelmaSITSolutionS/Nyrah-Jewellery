// optionApi.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

export const endpoints = {
  metalPurity: { base: "metal-purity", field: "name", all: "metal-purities" },
  metalTone: { base: "metal-tone", field: "name", all: "metal-tones" },
  ringSize: { base: "ring-size", field: "size", all: "ring-sizes" },
  stoneShape: { base: "stone-shape", field: "shape", all: "stone-shapes" },
  stoneQuality: {
    base: "stone-quality",
    field: "quality",
    all: "stone-qualities",
  },
  stoneCarat: { base: "stone-carat", field: "carat", all: "stone-carats" },
  finish: { base: "finish", field: "finish", all: "finishes" },
  necklaceSize: {
    base: "necklace-size",
    field: "necklaceSize",
    all: "necklace-sizes",
  },
  braceletSize:{
    base: "bracelet-size",
    field:"braceletSize",
    all: "bracelet-sizes"
  },
  chainLength: { base: "chain-length", field: "length", all: "chain-lengths" },
  earringSize: {
    base: "earring-size",
    field: "earringsize",
    all: "earring-sizes",
  },
  backType: { base: "backtype", field: "backtype", all: "backtypes" },
  stoneType: { base: "stonetype", field: "type", all: "stonetypes" },
  occasion: { base: "occasion", field: "occasion", all: "occasions" },
  pendantSize: {
    base: "pendant-size",
    field: "pendantsize",
    all: "pendant-sizes",
  },
   diamondSize: {
    base: "diamond-size",
    field: "diamondSize",
    all: "diamond-sizes",
  },
};

// This will hold all thunks like { ringSize: thunk, chainLength: thunk, ... }
export const getAllOptions = {};
export const createOption = {};
export const deleteOption = {};
export const updateOption = {};

// Loop through each key to create a thunk
Object.keys(endpoints).forEach((key) => {
  const endpoint = endpoints[key];

  getAllOptions[key] = createAsyncThunk(
    `options/getAll/${key}`,
    async (_, thunkAPI) => {
      try {
        const { data } = await API.get(`/${endpoint.all}`);
        return { key, data: data.data };
      } catch (err) {
        console.log(err)
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || err.message
        );
      }
    }
  );

  createOption[key] = createAsyncThunk(
    `options/create/${key}`,
    async (value, thunkAPI) => {
      try {
        const url = `/admin/${endpoint.base}`;

        if (value instanceof FormData) {
          const { data } = await API.post(url, value, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return { key, option: data.data };
        }

        const { data } = await API.post(url, { [endpoint.field]: value });
        return { key, option: data.data };
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || err.message
        );
      }
    }
  );

  updateOption[key] = createAsyncThunk(
    `options/update/${key}`,
    async ({ id, value }, thunkAPI) => {
      try {
        const url = `/admin/${endpoint.base}/${id}`;

        if (value instanceof FormData) {
          const { data } = await API.put(url, value, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return { key, option: data.data };
        }

        // Example: { stock: 5 } or { [endpoint.field]: "New Name" }
        const { data } = await API.put(url, value);
        return { key, option: data.data };
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || err.message
        );
      }
    }
  );

  deleteOption[key] = createAsyncThunk(
    `options/delete/${key}`,
    async (id, thunkAPI) => {
      try {
        await API.delete(`/admin/${endpoint.base}/${id}`);
        return { key, id };
      } catch (err) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.message || err.message
        );
      }
    }
  );
});
