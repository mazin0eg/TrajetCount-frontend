import React , { useState, useEffect} from 'react'
import { instance } from '../config/api'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Register() {
    const { user, isConnected, isLoading } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    
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

   
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="text-white text-xl">Loading...</div>
        </div>
      );
    }

    
    if (isConnected && user) {
      return null;
    }
    
    const [formData, setFormData] = useState({
    "username": "",
    "email": "",
    "password": "",
    "confirmPassword": ""
})
    
    const changeHandler = (e) => {
        setFormData((prev) => {
            prev[e.target.name] = e.target.value;
            return {...prev};
        })
    }
    
    const clickHandler = async () => {
      try{
        const data = await instance.post('/auth/register', formData);
        console.log("user registred" ,data)
        navigate("/login")
      }catch(e){
        console.log(e)
      }
        
    }
    return (
        /*
        <div className='flex flex-col'>
            <input className='bg-sky-100 border-2' type="text" value={formData.username} name="username" onChange={changeHandler} />
            <input className='bg-sky-100 border-2' type="email" value={formData.email} name="email" onChange={changeHandler} />
            <input className='bg-sky-100 border-2' type="password" value={formData.password} name="password" onChange={changeHandler} />
            <input className='bg-sky-100 border-2' type="password" value={formData.confirmPassword} name="confirmPassword" onChange={changeHandler} />
            <button className='bg-blue-400 border-2' onClick={clickHandler}>REGISTER</button>
            <a href="/login" className=''> if u have an a count </a>
        </div>
      */

        <div className="min-h-screen flex items-center justify-center bg-black px-4">
    
    {/* Register Card */}
    <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
      
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
        <p className="text-sm text-neutral-500 mt-2">Join us and get started</p>
      </div>

      {/* Form Container */}
      <div className="flex flex-col gap-4">
        
        {/* Username */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Username</label>
          <input 
            className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-neutral-700 transition-all" 
            type="text" 
            value={formData.username} 
            name="username" 
            onChange={changeHandler}
            placeholder="johndoe" 
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email</label>
          <input 
            className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-neutral-700 transition-all" 
            type="email" 
            value={formData.email} 
            name="email" 
            onChange={changeHandler}
            placeholder="name@example.com" 
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Password</label>
          <input 
            className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-neutral-700 transition-all" 
            type="password" 
            value={formData.password} 
            name="password" 
            onChange={changeHandler}
            placeholder="••••••••" 
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Confirm Password</label>
          <input 
            className="w-full bg-neutral-950 border border-neutral-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder-neutral-700 transition-all" 
            type="password" 
            value={formData.confirmPassword} 
            name="confirmPassword" 
            onChange={changeHandler}
            placeholder="••••••••" 
          />
        </div>

        {/* Action Button */}
        <button 
          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 mt-2 rounded-lg transition-colors duration-200 shadow-lg shadow-orange-900/20" 
          onClick={clickHandler}
        >
          REGISTER
        </button>

        {/* Footer Link */}
        <div className="text-center mt-4">
          <a 
            href="/login" 
            className="text-sm text-neutral-500 hover:text-orange-500 transition-colors"
          > 
            Already have an account? <span className="text-white underline decoration-orange-600 decoration-2 underline-offset-4">Log in</span> 
          </a>
        </div>
        
      </div>
    </div>
  </div>
    )
}
