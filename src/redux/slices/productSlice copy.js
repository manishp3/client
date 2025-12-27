import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Get token helper
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: token };
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${REACT_APP_API_URL}products`, { headers: getAuthHeaders() });
      console.log('log of fetch prodcuts::', data.products);

      return data.products;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    console.log("log og manish for fetchProductById::", id);

    try {
      const { data } = await axios.get(`${REACT_APP_API_URL}products/${id}`, { headers: getAuthHeaders() });
      console.log("log of return prodcuts by id::", data);

      return data.product;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${REACT_APP_API_URL}products`,
        productData,
        { headers: getAuthHeaders() }
      );
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${REACT_APP_API_URL}products/${id}`,
        productData,
        { headers: getAuthHeaders() }
      );
      console.log("submti called on saga update::", data);

      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${REACT_APP_API_URL}products/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchAIInsights = createAsyncThunk(
  'products/fetchAIInsights',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`{${REACT_APP_API_URL}ai/insights}`, {
        headers: getAuthHeaders(),
      });
      console.log('log of AI insights::', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch AI insights');
    }
  }
);

// Slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    myProducts: [],
    currentProduct: null,
    aiInsights: null,
    insightsLoading: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {

        state.loading = false;
        state.myProducts = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.myProducts.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.myProducts[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p._id !== action.payload);
      })
      // Fetch AI Insights
      .addCase(fetchAIInsights.pending, (state) => {
        state.insightsLoading = true;
        state.error = null;
      })
      .addCase(fetchAIInsights.fulfilled, (state, action) => {
        state.insightsLoading = false;
        state.aiInsights = action.payload;
      })
      .addCase(fetchAIInsights.rejected, (state, action) => {
        state.insightsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;