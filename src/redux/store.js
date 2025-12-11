import { configureStore, createAsyncThunk, Tuple } from '@reduxjs/toolkit'
import authentificationReducer from './authSlicer'



export const store = configureStore({
  reducer: {
    auth : authentificationReducer
  }
})