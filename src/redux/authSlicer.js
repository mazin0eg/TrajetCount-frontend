import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userLogin, verifyToken } from '../config/api';

const initialState = {
  isConnected: false,
  user: null,
  token: localStorage.getItem('auth_token') || null,
  isLoading: false
}

export const verificationThunk = createAsyncThunk('VERIFICATION', async (token) => {
  const data = await verifyToken(token);
  if(data)
    return data;
  throw new Error('Token verification failed')
})

export const loginThunk = createAsyncThunk("LOGIN",async ({ formData, navigate }, thunkAPI) => {
    try {
      const data = await userLogin(formData);
      localStorage.setItem('auth_token', data.token);

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Login failed");
    }
  }
);

export const authentificationSlicer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isConnected = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
    },
    logout: (state) => {
      state.isConnected = false;
      state.user = null;
      state.token = null;
      state.isLoading = false;
      localStorage.removeItem('auth_token');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verificationThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verificationThunk.fulfilled, (state, { payload }) => {
        if(payload?.username || payload?.user) {
          state.user = payload?.user || { email: payload?.username, role: payload?.role };
          state.isConnected = true;
          state.isLoading = false;
        }
      })
      .addCase(verificationThunk.rejected, (state) => {
        state.user = null;
        state.isConnected = false;
        state.isLoading = false;
        state.token = null;
        localStorage.removeItem('auth_token');
      })
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, (state, {payload}) => {
        if(payload && payload?.user && payload?.token) {
          state.user = payload?.user;
          state.token = payload?.token;
          state.isConnected = true;
          state.isLoading = false;
        }
      })
      .addCase(loginThunk.rejected, (state) => {
        state.isLoading = false;
      });
  },
})

export const { login, logout, setLoading } = authentificationSlicer.actions
export default authentificationSlicer.reducer