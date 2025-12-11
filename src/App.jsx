import React from 'react'
import Login from './components/login.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './components/register.jsx';
import { Provider, useSelector } from 'react-redux';
import { store } from './redux/store.js';
import NotFound from './components/notfound.jsx';
import { verifyToken } from './config/api.js';
import { verificationThunk } from './redux/authSlicer.js';
import Dashbord from './components/dashbord.jsx';

store.dispatch(verificationThunk(localStorage.getItem('auth_token')))

const App = () => {
  const { isLoading } = useSelector((state) => state.auth)
  return (
   
  <> { isLoading ? <h1>Loading...</h1> : <BrowserRouter>
        <Routes >
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/' element={<Dashbord/>}/>
        </Routes>
      </BrowserRouter>}</>
 
  )
}

export default App