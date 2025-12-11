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

export const loginThunk = createAsyncThunk('LOGIN', async (data) => {
  return await userLogin(data)
})

export const authentificationSlicer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isConnected = false;
      state.user = null;
      state.token = null;
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