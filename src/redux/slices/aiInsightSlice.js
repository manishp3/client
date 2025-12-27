import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { Authorization: token };
};

export const fetchAIInsights = createAsyncThunk(
  'aiInsights/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${REACT_APP_API_URL}ai/insights`, {
        headers: getAuthHeaders(),
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const aiInsightSlice = createSlice({
  name: 'aiInsights',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearInsights: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAIInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInsights } = aiInsightSlice.actions;
export default aiInsightSlice.reducer;