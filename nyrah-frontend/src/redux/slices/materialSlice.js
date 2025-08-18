import { createSlice } from "@reduxjs/toolkit";
import {
  getAllMaterials,
  createNewMaterial,
  addNewSubMaterial,
  removeSubMaterial,
  deleteMaterial,
} from "../apis/materialApi";

const materialSlice = createSlice({
  name: "material",
  initialState: {
    materials: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 1. Get All
      .addCase(getAllMaterials.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload;
      })
      .addCase(getAllMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 2. Create New Material
      .addCase(createNewMaterial.fulfilled, (state, action) => {
        state.materials.push(action.payload);
      })

      // 3. Add Sub Material
      .addCase(addNewSubMaterial.fulfilled, (state, action) => {
        const index = state.materials.findIndex(m => m.tag === action.payload.tag);
        if (index !== -1) {
          state.materials[index] = action.payload;
        }
      })

      // 4. Remove Sub Material
      .addCase(removeSubMaterial.fulfilled, (state, action) => {
        const index = state.materials.findIndex(m => m.tag === action.payload.tag);
        if (index !== -1) {
          state.materials[index] = action.payload;
        }
      })

      // 5. Delete Material
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.materials = state.materials.filter(m => m.tag !== action.payload);
      });
  },
});

export default materialSlice.reducer;
