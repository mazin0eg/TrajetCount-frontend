import React, { useEffect, useState } from 'react'
import { verifyToken } from '../config/api';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({children }) {

  const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    useEffect(()=>{
      const token = localStorage.getItem("auth_token");
      verifyToken(token)
            .then(() => {
                setIsAuth(true);
            })
            .catch(() => {
                setIsAuth(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [])

     if (loading) return <p>Loading...</p>;
  return isAuth ? children : <Navigate to="/login" />
  
}
