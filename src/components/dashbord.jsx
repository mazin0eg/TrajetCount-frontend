import React, { useEffect, useState } from 'react'
import Navbar from '../layout/navbar'
import { getDashboardStats, getRecentTrajets, deleteTrajet } from '../config/api'

export default function Dashbord() {
  const [stats, setStats] = useState(null)
  const [trajets, setTrajets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editModal, setEditModal] = useState({ isOpen: false, trajet: null })
  const [editForm, setEditForm] = useState({
    nom: '',
    pointDepart: '',
    pointArrivee: '',
    distance: '',
    dureeEstimee: '',
    dateDepart: '',
    statut: 'Planifie',
    notes: ''
  })

  const handleDeleteTrajet = async (trajetId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
      try {
        await deleteTrajet(trajetId)
        setTrajets(trajets.filter(t => t._id !== trajetId))
      } catch (err) {
        alert('Erreur lors de la suppression du trajet')
      }
    }
  }

  const handleEditTrajet = (trajet) => {
    setEditForm({
      nom: trajet.nom,
      pointDepart: trajet.pointDepart,
      pointArrivee: trajet.pointArrivee,
      distance: trajet.distance,
      dureeEstimee: trajet.dureeEstimee,
      dateDepart: new Date(trajet.dateDepart).toISOString().slice(0, 16),
      statut: trajet.statut,
      notes: trajet.notes || ''
    })
    setEditModal({ isOpen: true, trajet })
  }

  const handleCloseModal = () => {
    setEditModal({ isOpen: false, trajet: null })
    setEditForm({
      nom: '',
      pointDepart: '',
      pointArrivee: '',
      distance: '',
      dureeEstimee: '',
      dateDepart: '',
      statut: 'Planifie',
      notes: ''
    })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateTrajet = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/trajets/${editModal.trajet._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(editForm)
      })
      
      if (response.ok) {
        const updatedTrajet = await response.json()
        setTrajets(trajets.map(t => t._id === editModal.trajet._id ? updatedTrajet.trajet : t))
        handleCloseModal()
      } else {
        alert('Erreur lors de la mise à jour du trajet')
      }
    } catch (err) {
      alert('Erreur lors de la mise à jour du trajet')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, trajetsData] = await Promise.all([
          getDashboardStats(),
          getRecentTrajets(5)
        ])
        setStats(statsData)
        setTrajets(trajetsData)
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
      purple: "text-purple-500",
      cyan: "text-cyan-500"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
            <StatsCard 
              title="Total Trajets" 
              value={stats.totals.trajets || 0} 
              color="cyan"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatusCard 
              title="Camions Status"
              total={stats.totals.camions}
              inUse={stats.status.camionsEnUtilisation}
              available={stats.status.camionsDisponibles}
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

          <div className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Recent Trajets</h2>
              <p className="text-neutral-400">Latest trajets created in the system</p>
            </div>
            
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Chauffeur</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Distance</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Date Départ</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {trajets.length > 0 ? (
                      trajets.map((trajet) => (
                        <tr key={trajet._id} className="hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {trajet.nom}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {trajet.pointDepart} → {trajet.pointArrivee}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {trajet.chauffeur?.username || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              trajet.statut === 'Termine' ? 'bg-green-100 text-green-800' :
                              trajet.statut === 'En cours' ? 'bg-blue-100 text-blue-800' :
                              trajet.statut === 'Planifie' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {trajet.statut}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {trajet.distance} km
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditTrajet(trajet)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Modifier"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteTrajet(trajet._id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                                title="Supprimer"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-neutral-500">
                          Aucun trajet trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Modifier le Trajet</h3>
              <button
                onClick={handleCloseModal}
                className="text-neutral-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateTrajet} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={editForm.nom}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Statut</label>
                  <select
                    name="statut"
                    value={editForm.statut}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  >
                    <option value="Planifie">Planifié</option>
                    <option value="En cours">En cours</option>
                    <option value="Termine">Terminé</option>
                    <option value="Annule">Annulé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Point de Départ</label>
                  <input
                    type="text"
                    name="pointDepart"
                    value={editForm.pointDepart}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Point d'Arrivée</label>
                  <input
                    type="text"
                    name="pointArrivee"
                    value={editForm.pointArrivee}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Distance (km)</label>
                  <input
                    type="number"
                    name="distance"
                    value={editForm.distance}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Durée Estimée (heures)</label>
                  <input
                    type="number"
                    name="dureeEstimee"
                    value={editForm.dureeEstimee}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Date de Départ</label>
                  <input
                    type="datetime-local"
                    name="dateDepart"
                    value={editForm.dateDepart}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={editForm.notes}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 rounded-md transition-colors"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
