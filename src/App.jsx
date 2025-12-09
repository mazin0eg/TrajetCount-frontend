import React from 'react'
import Login from './components/login.jsx'
import { BrowserRouter, Routes , Route } from "react-router-dom";
import Register from './components/register.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App