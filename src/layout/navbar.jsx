import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/authSlicer'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { isConnected } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
         
          <div className="shrink-0">
            <a href="/" className="text-2xl font-bold text-white tracking-tighter hover:text-orange-500 transition-colors">
              Brand<span className="text-orange-500">Name</span>
            </a>
          </div>

          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-sm font-medium text-neutral-300 hover:text-white hover:border-b-2 hover:border-orange-500 transition-all duration-100 h-8 flex items-center">
              Home
            </a>
            <a href="/features" className="text-sm font-medium text-neutral-300 hover:text-white hover:border-b-2 hover:border-orange-500 transition-all duration-100 h-8 flex items-center">
              Features
            </a>
            <a href="/about" className="text-sm font-medium text-neutral-300 hover:text-white hover:border-b-2 hover:border-orange-500 transition-all duration-100 h-8 flex items-center">
              About
            </a>
          </div>

          
          <div className="flex items-center gap-4">
            {isConnected ? (
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <a 
                  href="/login" 
                  className="text-sm font-medium text-neutral-300 hover:text-orange-500 transition-colors"
                >
                  Login
                </a>
                <a 
                  href="/register" 
                  className="px-4 py-2 text-sm font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-500 shadow-lg shadow-orange-900/20 transition-all duration-200"
                >
                  Get Started
                </a>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}
