import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Load user from localStorage
const userFromStorage = localStorage.getItem('authUser')
  ? JSON.parse(localStorage.getItem('authUser'))
  : null;

const tokenFromStorage = localStorage.getItem('token') || null;

// Async Thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${REACT_APP_API_URL}auth/register`, userData);
      console.log("log of register data::", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${REACT_APP_API_URL}auth/login`, credentials);
      console.log("log of login::", data);

      // localStorage.setItem('token', data.token);
      // localStorage.setItem('authUser', JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Login failed');
    }
  }
);
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {

      localStorage.removeItem('token');
      localStorage.removeItem('authUser');

      return true;
    } catch (error) {

      localStorage.removeItem('token');
      localStorage.removeItem('authUser');
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);
export const getMe = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log("log of token from mansih", token);

      const { data } = await axios.get(`${REACT_APP_API_URL}auth/me`, {
        headers: { Authorization: token },
      });
      console.log("datadatadatadatadata", data);
      if (data.status_code == 200) {
        await localStorage.setItem('authUser', JSON.stringify(data.autUser))
      }
      return data.autUser;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Fetch failed');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    token: tokenFromStorage,
    isAuthenticated: !!tokenFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    setAuthFromStorage: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action.payloadaction.payload", action.payload);

        state.user = action.payload;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;