import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { verificationThunk } from './redux/authSlicer'
import Login from './components/login'
import Register from './components/register'
import Dashbord from './components/dashbord'
import Chauffeur from './components/chauffeur'
import PrivateRoute from './components/privateRoute'
import Unauthorized from './components/unauthorized'
import AdminCamions from './components/admin/camions'
import AdminRemorques from './components/admin/remorques'
import AdminPneus from './components/admin/pneus'
import AdminChauffeurs from './components/admin/chauffeurs'
import AdminTrajets from './components/admin/trajets'

function App() {
  const dispatch = useDispatch()
  const { token, isLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(verificationThunk(token))
    }
  }, [dispatch, token])

  if (isLoading && token) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-white">Loading...</div>
    </div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route 
          path="/" 
          element={
            <PrivateRoute allowedRoles={["Chauffeur"]}>
              <Chauffeur />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Dashbord />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/admin/camions" 
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminCamions />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/admin/remorques" 
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminRemorques />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/admin/pneus" 
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminPneus />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/admin/chauffeurs" 
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminChauffeurs />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/admin/trajets" 
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminTrajets />
            </PrivateRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App