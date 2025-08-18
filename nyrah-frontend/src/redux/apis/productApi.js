import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/axiosInstance";

// ───────────────────────────────────────────────────────────────────────────────
// 🔧 Helper: map UI params ➔ backend query keys
// ───────────────────────────────────────────────────────────────────────────────
const buildQuery = ({
  page,
  sortBy, // e.g. "price-descending"
  priceGte,
  priceLte,
  availability, // 1 (in‑stock) | 0 (out‑of‑stock)
}) => {
  const qs = {};
  if (page) qs.page = page;
  if (sortBy) qs.sort_by = sortBy;
  if (priceGte !== undefined) qs["filter.price.gte"] = priceGte;
  if (priceLte !== undefined) qs["filter.price.lte"] = priceLte;
  if (availability !== undefined) qs.availability = availability; // pass as "1" | "0"
  if (sortBy) qs.sort_by = sortBy;
  return qs;
};

// ───────────────────────────────────────────────────────────────────────────────
// 🛍 CREATE PRODUCT (no change)
// ───────────────────────────────────────────────────────────────────────────────
export const createProduct = createAsyncThunk(
  "product/create",
  async (payload, thunkAPI) => {
    try {
      const { data } = await API.post("/admin/product/new", payload);
      return data.product;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ───────────────────────────────────────────────────────────────────────────────
// 📦 GET GROUPED PRODUCTS with filters/sort/pagination
//    Usage: dispatch(getGroupedProducts({ page: 2, sortBy:"price-ascending" }))
// ───────────────────────────────────────────────────────────────────────────────
export const getGroupedProducts = createAsyncThunk(
  "product/getGrouped",
  async (params = {}, thunkAPI) => {
    try {
      const { data } = await API.get("/products", {
        params: buildQuery(params),
      });
      return {
        products: data.products,
        totalCount: data.totalCount,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ───────────────────────────────────────────────────────────────────────────────
// 🏷  GET PRODUCTS BY MAIN CATEGORY
//    params = { mainCategory:"rings", ...filters }
// ───────────────────────────────────────────────────────────────────────────────
export const getProductsByMain = createAsyncThunk(
  "product/getByMain",
  async ({ mainCategory, ...params }, thunkAPI) => {
    try {
      const { data } = await API.get(`/products/${mainCategory}`, {
        params: buildQuery(params),
      });
      return {
        products: data.products,
        totalCount: data.totalCount,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ───────────────────────────────────────────────────────────────────────────────
// 🏷  GET PRODUCTS BY SUB CATEGORY
//    params = { mainCategory:"rings", subCategory:"engagement", priceGte:5000 }
// ───────────────────────────────────────────────────────────────────────────────
export const getProductsBySub = createAsyncThunk(
  "product/getBySub",
  async ({ mainCategory, subCategory, ...params }, thunkAPI) => {
    try {
      const { data } = await API.get(
        `/products/${mainCategory}/${subCategory}`,
        {
          params: buildQuery(params),
        }
      );
      return {
        products: data.products,
        totalCount: data.totalCount,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ───────────────────────────────────────────────────────────────────────────────
// 🛠️  GET PRODUCTS BY MATERIAL TAG
//    e.g., /material/gold?priceGte=10000&sort=price
// ───────────────────────────────────────────────────────────────────────────────


export const getProductsByMaterialTag = createAsyncThunk(
  "product/getByMaterialTag",
  async ({ tag, ...params }, thunkAPI) => {
    try {
      const { data } = await API.get(`/material/${tag}`, {
        params: buildQuery(params),
      });
      return {
        products: data.products,
        totalCount: data.totalCount,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ───────────────────────────────────────────────────────────────────────────────
// 🛠️  GET PRODUCTS BY MATERIAL TAG + SUB
//    e.g., /material/gold/yellow?sort=latest
// ───────────────────────────────────────────────────────────────────────────────
export const getProductsByMaterialSub = createAsyncThunk(
  "product/getByMaterialSub",
  async ({ tag, sub, ...params }, thunkAPI) => {
    try {
      const { data } = await API.get(`/material/${tag}/${sub}`, {
        params: buildQuery(params),
      });
      return {
        products: data.products,
        totalCount: data.totalCount,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);


// ───────────────────────────────────────────────────────────────────────────────
// 🔄 GET VARIANTS of a PRODUCT GROUP with optional filters (rarely needed)
// ───────────────────────────────────────────────────────────────────────────────
export const getProductGroupVariants = createAsyncThunk(
  "product/getGroupVariants",
  async ({ groupId, ...params }, thunkAPI) => {
    try {
      const { data } = await API.get(`/product/group/${groupId}`, {
        params: buildQuery(params),
      });

      return { groupId, variants: data.variants };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ───────────────────────────────────────────────────────────────────────────────
// ✏️ UPDATE PRODUCT (unchanged)
// ───────────────────────────────────────────────────────────────────────────────
export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, updates }, thunkAPI) => {
    try {
      const { data } = await API.put(`/admin/product/${id}`, updates);
      return data.product;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// ───────────────────────────────────────────────────────────────────────────────
// ❌ DELETE PRODUCT (unchanged)
// ───────────────────────────────────────────────────────────────────────────────
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/admin/product/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
