import React, { useEffect, useState } from 'react'
import Navbar from '../../layout/navbar'

export default function AdminChauffeurs() {
  const [chauffeurs, setChauffeurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statsModal, setStatsModal] = useState(false)
  const [selectedChauffeur, setSelectedChauffeur] = useState(null)
  const [chauffeurStats, setChauffeurStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(false)

  useEffect(() => {
    const fetchChauffeurs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/api/auth/chauffeurs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('Chauffeurs data:', data) 
          setChauffeurs(Array.isArray(data) ? data : data.chauffeurs || [])
        } else {
          console.error('Response not ok:', response.status)
          setError('Failed to fetch chauffeurs')
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Failed to fetch chauffeurs')
      } finally {
        setLoading(false)
      }
    }

    fetchChauffeurs()
  }, [])

  const handleViewStats = async (chauffeur) => {
    setSelectedChauffeur(chauffeur)
    setStatsModal(true)
    setLoadingStats(true)
    setChauffeurStats(null)
    
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/auth/chauffeurs/${chauffeur._id}/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      if (response.ok) {
        const stats = await response.json()
        setChauffeurStats(stats)
      } else {
        setError('Failed to fetch chauffeur stats')
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
      setError('Failed to fetch chauffeur stats')
    } finally {
      setLoadingStats(false)
    }
  }

  const handleCloseStatsModal = () => {
    setStatsModal(false)
    setSelectedChauffeur(null)
    setChauffeurStats(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatColor = (statName) => {
    switch (statName) {
      case 'trajetsEnCours': return 'text-blue-600'
      case 'trajetsPlanifies': return 'text-yellow-600'
      case 'trajetsTermines': return 'text-green-600'
      case 'trajetsAnnules': return 'text-red-600'
      default: return 'text-neutral-600'
    }
  }

  const getStatLabel = (statName) => {
    switch (statName) {
      case 'totalTrajets': return 'Total Trajets'
      case 'trajetsEnCours': return 'En Cours'
      case 'trajetsPlanifies': return 'Planifiés'
      case 'trajetsTermines': return 'Terminés'
      case 'trajetsAnnules': return 'Annulés'
      default: return statName
    }
  }

  const StatCard = ({ title, value, color = "text-neutral-600" }) => (
    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-400">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-white text-xl">Loading chauffeurs...</div>
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black pt-20 px-4">
        <div className="max-w-7xl mx-auto py-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Gestion des Chauffeurs</h1>
                <p className="text-neutral-400">Liste de tous les chauffeurs et leurs statistiques</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Nom d'utilisateur</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Date d'inscription</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Nombre de trajets</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {console.log('Rendering chauffeurs:', chauffeurs, 'Length:', chauffeurs.length)}
                  {chauffeurs.length > 0 ? (
                    chauffeurs.map((chauffeur, index) => {
                      console.log(`Rendering chauffeur ${index}:`, chauffeur)
                      return (
                        <tr key={chauffeur._id} className="hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {chauffeur.username || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {chauffeur.email || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {formatDate(chauffeur.createdAt) || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {chauffeur.nombreTrajets || 0} trajets
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewStats(chauffeur)}
                                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                title="Voir les statistiques"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Statistiques
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-neutral-500">
                        Aucun chauffeur trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Chauffeur Stats Modal */}
      {statsModal && selectedChauffeur && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                Statistiques - {selectedChauffeur.username}
              </h3>
              <button
                onClick={handleCloseStatsModal}
                className="text-neutral-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loadingStats ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-white text-lg">Chargement des statistiques...</div>
              </div>
            ) : chauffeurStats ? (
              <div className="space-y-6">
                {/* Chauffeur Info */}
                <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Informations du Chauffeur</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-neutral-400">Nom d'utilisateur</p>
                      <p className="text-white font-medium">{chauffeurStats.chauffeur.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">Email</p>
                      <p className="text-white font-medium">{chauffeurStats.chauffeur.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-400">Date d'inscription</p>
                      <p className="text-white font-medium">{formatDate(chauffeurStats.chauffeur.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Statistiques des Trajets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries(chauffeurStats.statistiques).map(([key, value]) => (
                      <StatCard
                        key={key}
                        title={getStatLabel(key)}
                        value={value}
                        color={getStatColor(key)}
                      />
                    ))}
                  </div>
                </div>

                {/* Performance Overview */}
                <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Aperçu des Performances</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-md font-medium text-neutral-300 mb-3">Taux de Réussite</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Trajets Terminés</span>
                          <span className="text-green-400">
                            {chauffeurStats.statistiques.trajetsTermines} / {chauffeurStats.statistiques.totalTrajets}
                          </span>
                        </div>
                        {chauffeurStats.statistiques.totalTrajets > 0 && (
                          <div className="w-full bg-neutral-700 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{
                                width: `${(chauffeurStats.statistiques.trajetsTermines / chauffeurStats.statistiques.totalTrajets) * 100}%`
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-md font-medium text-neutral-300 mb-3">Statut Actuel</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Trajets en Cours</span>
                          <span className="text-blue-400">{chauffeurStats.statistiques.trajetsEnCours}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Trajets Planifiés</span>
                          <span className="text-yellow-400">{chauffeurStats.statistiques.trajetsPlanifies}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-red-500 text-lg">Erreur lors du chargement des statistiques</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}