import React from 'react'
import Login from './components/login.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './components/register.jsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App