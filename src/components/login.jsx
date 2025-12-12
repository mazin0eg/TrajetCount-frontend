import React, { useEffect, useState } from 'react'
import { instance, userLogin } from '../config/api'
import { useDispatch, useSelector } from 'react-redux'
import { login, loginThunk } from '../redux/authSlicer';
import { Navigate, useNavigate } from 'react-router-dom';


  export default function Login() {

  const { user, isConnected, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate(); 
  const dispatch = useDispatch()

  // Check if user is already authenticated
  useEffect(() => {
    if (isConnected && user) {
      // Redirect based on user role
      if (user.role === "Chauffeur") {
        navigate("/", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [isConnected, user, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If user is authenticated, don't render login form (will redirect via useEffect)
  if (isConnected && user) {
    return null;
  }


    const [formData, setFormData] = useState({
      "email" : '',
      "password": ''
  })
 const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const clickHandler = async () => {
    dispatch(loginThunk({ formData, navigate }))  
  }





 /* return (
    <div className='flex flex-col'>
    <input className='bg-sky-100 border-2' type="email" value={formData.email} name="email" onChange={changeHandler} />
    <input className='bg-sky-100 border-2' type="password" value={formData.password} name="password" onChange={changeHandler} />
    <button className='bg-blue-400 border-2' onClick={clickHandler}>LOGIN</button>
    <a href="/register" className=''> if u dont have an a count </a>
    </div>
  ) */

    return (
  // Full page container: centered content, black background
  <div className="min-h-screen flex items-center justify-center bg-black px-4">
    
    {/* Login Card */}
    <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
      
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Login</h1>
        <p className="text-sm text-neutral-500 mt-2">Enter your details below</p>
      </div>

      {/* Form Container */}
      <div className="flex flex-col gap-5">
        
        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Email
          </label>
          <input 
            className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-neutral-700 transition-all" 
            type="email" 
            value={formData.email} 
            name="email" 
            onChange={changeHandler} 
            placeholder="you@example.com"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Password
          </label>
          <input 
            className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-neutral-700 transition-all" 
            type="password" 
            value={formData.password} 
            name="password" 
            onChange={changeHandler} 
            placeholder="••••••••"
          />
        </div>

        {/* Submit Button */}
        <button 
          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition-colors duration-200 mt-2" 
          onClick={clickHandler}
        >
          Sign In
        </button>

        {/* Footer Link */}
        <div className="text-center mt-4">
          <a 
            href="/register" 
            className="text-sm text-neutral-500 hover:text-orange-500 transition-colors"
          > 
            Don't have an account? <span className="text-white underline decoration-orange-600 decoration-2 underline-offset-4">Register</span> 
          </a>
        </div>

      </div>
    </div>
  </div>
)
}
