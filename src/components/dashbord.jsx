import React, { useEffect, useState } from 'react'
import Navbar from '../layout/navbar'
import { getDashboardStats } from '../config/api'

export default function Dashbord() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </>
    )
  }

  const StatsCard = ({ title, value, subtitle, color = "orange" }) => {
    const colorClasses = {
      orange: "text-orange-500",
      blue: "text-blue-500", 
      green: "text-green-500",
      purple: "text-purple-500"
    }
    
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-all">
        <h3 className="text-neutral-400 text-sm font-medium mb-2">{title}</h3>
        <p className={`text-3xl font-bold ${colorClasses[color]} mb-1`}>{value}</p>
        {subtitle && <p className="text-neutral-500 text-sm">{subtitle}</p>}
      </div>
    )
  }

  const StatusCard = ({ title, available, total, inUse, maintenance, color = "blue" }) => {
    const colorClasses = {
      orange: "text-orange-500",
      blue: "text-blue-500", 
      green: "text-green-500",
      purple: "text-purple-500"
    }
    
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-all">
        <h3 className="text-neutral-400 text-sm font-medium mb-4">{title}</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-neutral-300">Total</span>
            <span className="text-white font-semibold">{total}</span>
          </div>
          {inUse !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-neutral-300">In Use</span>
              <span className={`${colorClasses[color]} font-semibold`}>{inUse}</span>
            </div>
          )}
          {available !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-neutral-300">Available</span>
              <span className="text-green-500 font-semibold">{available}</span>
            </div>
          )}
          {maintenance !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-neutral-300">Need Maintenance</span>
              <span className="text-red-500 font-semibold">{maintenance}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-7xl mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-neutral-400">Overview of fleet and personnel statistics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Camions" 
              value={stats.totals.camions} 
              color="orange"
            />
            <StatsCard 
              title="Total Remorques" 
              value={stats.totals.remorques} 
              color="blue"
            />
            <StatsCard 
              title="Total Pneus" 
              value={stats.totals.pneus} 
              color="green"
            />
            <StatsCard 
              title="Total Chauffeurs" 
              value={stats.totals.chauffeurs} 
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatusCard 
              title="Camions Status"
              total={stats.totals.camions}
              inUse={stats.status.camionsWithChauffeur}
              available={stats.status.camionsAvailable}
              color="orange"
            />
            <StatusCard 
              title="Remorques Status"
              total={stats.totals.remorques}
              inUse={stats.status.remorquesAttached}
              available={stats.status.remorquesAvailable}
              color="blue"
            />
            <StatusCard 
              title="Pneus Status"
              total={stats.totals.pneus}
              maintenance={stats.status.pneusNeedingMaintenance}
              color="green"
            />
          </div>
        </div>
      </div>
    </>
  )
}
