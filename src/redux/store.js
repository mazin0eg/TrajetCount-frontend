import { configureStore, createAsyncThunk, Tuple } from '@reduxjs/toolkit'
import authentificationReducer from './authSlicer'
import { verifyToken } from '../config/api'


const thunk = createAsyncThunk('pre', async ({ getState, dispatch}) => {
       verifyToken(getState().auth.token).then((data) => {
            data.username
       }).catch(() => {
        localStorage.removeItem('auth_token')
       })
})
export const store = configureStore({
  reducer: {
    auth : authentificationReducer
  },
  middleware: (getDefault) => getDefault().concat(new Tuple(thunk))
})