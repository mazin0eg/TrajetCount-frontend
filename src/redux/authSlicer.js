import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  isConnected: false,
  user: null,
  token: localStorage.getItem('auth_token') || null,
}

export const authentificationSlicer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, {payload}) => {
        state.user = payload.user;
        state.token = payload.token;
        state.isConnected = true;      
    },
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
})

export const { login, logout, update, verifyUser } = authentificationSlicer.actions

export default authentificationSlicer.reducer