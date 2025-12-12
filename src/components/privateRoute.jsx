import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { verificationThunk } from '../redux/authSlicer'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const dispatch = useDispatch()
  const { isConnected, user, token, isLoading } = useSelector((state) => state.auth)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      if (token && !isConnected) {
        try {
          await dispatch(verificationThunk(token)).unwrap()
        } catch (error) {
          console.log('Token verification failed')
        }
      }
      setAuthChecked(true)
    }
    
    checkAuth()
  }, [token, isConnected, dispatch])

  if (!authChecked || isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-white">Loading...</div>
    </div>
  }

  if (!isConnected || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
