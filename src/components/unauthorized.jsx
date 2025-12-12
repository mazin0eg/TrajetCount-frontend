import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Unauthorized() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleGoBack = () => {
    if (user?.role === "Chauffeur") {
      navigate("/", { replace: true })
    } else {
      navigate("/dashboard", { replace: true })
    }
  }

  return (
  <div className="min-h-screen bg-black flex items-center justify-center px-4">
    
    
    <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-2xl shadow-2xl text-center max-w-md w-full">
      
      
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-orange-500/10 rounded-full border border-orange-500/20">
          <svg 
            className="w-12 h-12 text-orange-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>

     
      <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">403</h1>
      <h2 className="text-xl font-semibold text-orange-500 mb-4 uppercase tracking-wider">Access Denied</h2>
      
      <p className="text-neutral-400 mb-8 leading-relaxed">
        You do not have the necessary permissions to view this resource.
      </p>

      
      <button
        onClick={handleGoBack}
        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg shadow-orange-900/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:-translate-y-0.5"
      >
        Go Back to Dashboard
      </button>

    </div>
  </div>
)
}