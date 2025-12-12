import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userLogin, verifyToken } from '../config/api';


const initialState = {
  isConnected: false,
  user: null,
  token: localStorage.getItem('auth_token') || null,
  isLoading: true
}

export const verificationThunk = createAsyncThunk('VERIFICATION', async (token) => {
  const data = await verifyToken(token);
  if(data)
    return data;
  throw new Error('error')
})

/* export const loginThunk = createAsyncThunk('LOGIN', async (data) => { 
  return await userLogin(data)
}) */

export const loginThunk = createAsyncThunk("LOGIN",async ({ formData, navigate }, thunkAPI) => {
    try {
      const data = await userLogin(formData);

      // Store token in localStorage
      localStorage.setItem('auth_token', data.token);

      if (data.user.role === "Chauffeur") {
        navigate("/", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

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
      localStorage.removeItem('auth_token');
    },
    update: (state, action) => {
     
    },
    verifyUser: () => {
        
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      verificationThunk.fulfilled,
      (state, { payload }) => {
        if(payload?.username){
          state.user = { email : payload?.username}
          state.isConnected = true;
          state.isLoading = false
        }
        
      },
    ).addCase(loginThunk.fulfilled, (state, {payload}) => {
      if(payload && payload?.user && payload?.token)
      {
        state.user = payload?.user;
        state.token = payload?.token;
        state.isConnected = true;
        state.isLoading = false;
        localStorage.setItem('auth_token', payload.token);
      }

    }).addCase(verificationThunk.rejected,  (state, { payload }) => {
        
          state.user = null
          state.isConnected = false;
          state.isLoading = false
        
      })

  },
})

export const { login, logout, update, verifyUser } = authentificationSlicer.actions

export default authentificationSlicer.reducer