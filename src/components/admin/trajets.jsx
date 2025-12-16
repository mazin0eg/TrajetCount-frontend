import React, { useEffect, useState } from 'react'
import Navbar from '../../layout/navbar'

export default function AdminTrajets() {
  const [trajets, setTrajets] = useState([])
  const [chauffeurs, setChauffeurs] = useState([])
  const [camions, setCamions] = useState([])
  const [remorques, setRemorques] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [assignModal, setAssignModal] = useState(false)
  const [selectedTrajet, setSelectedTrajet] = useState(null)
  const [addForm, setAddForm] = useState({
    nom: '',
    pointDepart: '',
    pointArrivee: '',
    distance: '',
    dureeEstimee: '',
    chauffeur: '',
    camion: '',
    remorque: '',
    dateDepart: '',
    notes: ''
  })
  const [editForm, setEditForm] = useState({
    _id: '',
    nom: '',
    pointDepart: '',
    pointArrivee: '',
    distance: '',
    dureeEstimee: '',
    chauffeur: '',
    camion: '',
    remorque: '',
    dateDepart: '',
    notes: '',
    statut: 'Planifie'
  })
  const [assignForm, setAssignForm] = useState({
    trajetId: '',
    chauffeur: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trajets
        const trajetsResponse = await fetch('http://127.0.0.1:3000/api/trajets', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        // Fetch chauffeurs
        const chauffeursResponse = await fetch('http://127.0.0.1:3000/api/auth/chauffeurs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        // Fetch camions
        const camionsResponse = await fetch('http://127.0.0.1:3000/api/camions', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        // Fetch remorques
        const remorquesResponse = await fetch('http://127.0.0.1:3000/api/remorques', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (trajetsResponse.ok) {
          const trajetsData = await trajetsResponse.json()
          console.log('Trajets data:', trajetsData) 
          setTrajets(Array.isArray(trajetsData) ? trajetsData : trajetsData.trajets || [])
        } else {
          console.error('Trajets response not ok:', trajetsResponse.status)
          setError('Failed to fetch trajets')
        }

        if (chauffeursResponse.ok) {
          const chauffeursData = await chauffeursResponse.json()
          console.log('Chauffeurs data:', chauffeursData)
          setChauffeurs(Array.isArray(chauffeursData) ? chauffeursData : chauffeursData.chauffeurs || [])
        } else {
          console.error('Chauffeurs response not ok:', chauffeursResponse.status)
        }

        if (camionsResponse.ok) {
          const camionsData = await camionsResponse.json()
          setCamions(Array.isArray(camionsData) ? camionsData : camionsData.camions || [])
        }

        if (remorquesResponse.ok) {
          const remorquesData = await remorquesResponse.json()
          setRemorques(Array.isArray(remorquesData) ? remorquesData : remorquesData.remorques || [])
        }

      } catch (err) {
        console.error('Fetch error:', err)
        setError('Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDeleteTrajet = async (trajetId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
      try {
        const response = await fetch(`http://127.0.0.1:3000/api/trajets/${trajetId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (response.ok) {
          setTrajets(trajets.filter(t => t._id !== trajetId))
        } else {
          alert('Erreur lors de la suppression du trajet')
        }
      } catch (err) {
        alert('Erreur lors de la suppression du trajet')
      }
    }
  }

  const handleOpenAddModal = () => {
    setAddModal(true)
  }

  const handleCloseAddModal = () => {
    setAddModal(false)
    setAddForm({
      nom: '',
      pointDepart: '',
      pointArrivee: '',
      distance: '',
      dureeEstimee: '',
      chauffeur: '',
      camion: '',
      remorque: '',
      dateDepart: '',
      notes: ''
    })
  }

  const handleOpenEditModal = (trajet) => {
    setEditForm({
      _id: trajet._id,
      nom: trajet.nom,
      pointDepart: trajet.pointDepart,
      pointArrivee: trajet.pointArrivee,
      distance: trajet.distance,
      dureeEstimee: trajet.dureeEstimee,
      chauffeur: trajet.chauffeur?._id || trajet.chauffeur || '',
      camion: trajet.camion?._id || trajet.camion || '',
      remorque: trajet.remorque?._id || trajet.remorque || '',
      dateDepart: trajet.dateDepart ? new Date(trajet.dateDepart).toISOString().slice(0, 16) : '',
      notes: trajet.notes || '',
      statut: trajet.statut
    })
    setEditModal(true)
  }

  const handleCloseEditModal = () => {
    setEditModal(false)
    setEditForm({
      _id: '',
      nom: '',
      pointDepart: '',
      pointArrivee: '',
      distance: '',
      dureeEstimee: '',
      chauffeur: '',
      camion: '',
      remorque: '',
      dateDepart: '',
      notes: '',
      statut: 'Planifie'
    })
  }

  const handleOpenAssignModal = (trajet) => {
    setSelectedTrajet(trajet)
    setAssignForm({
      trajetId: trajet._id,
      chauffeur: ''
    })
    setAssignModal(true)
  }

  const handleCloseAssignModal = () => {
    setAssignModal(false)
    setSelectedTrajet(null)
    setAssignForm({
      trajetId: '',
      chauffeur: ''
    })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setAddForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAssignFormChange = (e) => {
    const { name, value } = e.target
    setAssignForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddTrajet = async (e) => {
    e.preventDefault()
    try {
      const trajetData = {
        nom: addForm.nom,
        pointDepart: addForm.pointDepart,
        pointArrivee: addForm.pointArrivee,
        distance: parseFloat(addForm.distance),
        dureeEstimee: parseFloat(addForm.dureeEstimee),
        chauffeur: addForm.chauffeur,
        camion: addForm.camion,
        remorque: addForm.remorque || null,
        dateDepart: addForm.dateDepart,
        notes: addForm.notes
      }

      const response = await fetch('http://127.0.0.1:3000/api/trajets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(trajetData)
      })
      
      if (response.ok) {
        const responseData = await response.json()
        const newTrajet = responseData.trajet || responseData
        setTrajets([newTrajet, ...trajets])
        handleCloseAddModal()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Erreur lors de l\'ajout du trajet')
      }
    } catch (err) {
      alert('Erreur lors de l\'ajout du trajet')
    }
  }

  const handleUpdateTrajet = async (e) => {
    e.preventDefault()
    try {
      const trajetData = {
        nom: editForm.nom,
        pointDepart: editForm.pointDepart,
        pointArrivee: editForm.pointArrivee,
        distance: parseFloat(editForm.distance),
        dureeEstimee: parseFloat(editForm.dureeEstimee),
        chauffeur: editForm.chauffeur,
        camion: editForm.camion,
        remorque: editForm.remorque || null,
        dateDepart: editForm.dateDepart,
        notes: editForm.notes,
        statut: editForm.statut
      }

      const response = await fetch(`http://127.0.0.1:3000/api/trajets/${editForm._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(trajetData)
      })
      
      if (response.ok) {
        const responseData = await response.json()
        const updatedTrajet = responseData.trajet || responseData
        setTrajets(prevTrajets => 
          prevTrajets.map(t => t._id === editForm._id ? updatedTrajet : t)
        )
        handleCloseEditModal()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Erreur lors de la modification du trajet')
      }
    } catch (err) {
      alert('Erreur lors de la modification du trajet')
    }
  }

  const handleAssignTrajet = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://127.0.0.1:3000/api/trajets/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(assignForm)
      })
      
      if (response.ok) {
        const responseData = await response.json()
        const updatedTrajet = responseData.trajet || responseData
        setTrajets(prevTrajets => 
          prevTrajets.map(t => t._id === assignForm.trajetId ? updatedTrajet : t)
        )
        handleCloseAssignModal()
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Erreur lors de l\'assignation du trajet')
      }
    } catch (err) {
      alert('Erreur lors de l\'assignation du trajet')
    }
  }

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Planifie': return 'bg-yellow-100 text-yellow-800'
      case 'En cours': return 'bg-blue-100 text-blue-800'
      case 'Termine': return 'bg-green-100 text-green-800'
      case 'Annule': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getChauffeurName = (trajet) => {
    if (!trajet.chauffeur) return 'Non assigné'
    if (typeof trajet.chauffeur === 'object') {
      return trajet.chauffeur.username || trajet.chauffeur.email
    }
    return 'ID: ' + trajet.chauffeur
  }

  const getCamionName = (trajet) => {
    if (!trajet.camion) return 'N/A'
    if (typeof trajet.camion === 'object') {
      return `${trajet.camion.marque} - ${trajet.camion.immatriculation}`
    }
    return 'ID: ' + trajet.camion
  }

  const getRemorqueName = (trajet) => {
    if (!trajet.remorque) return 'Aucune'
    if (typeof trajet.remorque === 'object') {
      return `${trajet.remorque.marque} - ${trajet.remorque.numeroSerie}`
    }
    return 'ID: ' + trajet.remorque
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-white text-xl">Loading trajets...</div>
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
                <h1 className="text-3xl font-bold text-white mb-2">Gestion des Trajets</h1>
                <p className="text-neutral-400">Planification et suivi des trajets</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Créer Trajet
              </button>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Trajet</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Chauffeur</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Véhicules</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Date Départ</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {console.log('Rendering trajets:', trajets, 'Length:', trajets.length)}
                  {trajets.length > 0 ? (
                    trajets.map((trajet, index) => {
                      console.log(`Rendering trajet ${index}:`, trajet)
                      return (
                        <tr key={trajet._id} className="hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {trajet.nom || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            <div>
                              <div className="font-medium">{trajet.pointDepart} → {trajet.pointArrivee}</div>
                              <div className="text-xs text-neutral-500">
                                {trajet.distance}km - {trajet.dureeEstimee}h
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {getChauffeurName(trajet)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            <div>
                              <div className="text-xs">{getCamionName(trajet)}</div>
                              <div className="text-xs text-neutral-500">{getRemorqueName(trajet)}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {formatDate(trajet.dateDepart)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutColor(trajet.statut)}`}>
                              {trajet.statut || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleOpenEditModal(trajet)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Modifier"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              {trajet.statut === 'Planifie' && (
                                <button
                                  onClick={() => handleOpenAssignModal(trajet)}
                                  className="text-green-400 hover:text-green-300 transition-colors"
                                  title="Réassigner"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                </button>
                              )}
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
                      )
                    })
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

      {/* Add Trajet Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Créer un Trajet</h3>
              <button
                onClick={handleCloseAddModal}
                className="text-neutral-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddTrajet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Nom du Trajet</label>
                <input
                  type="text"
                  name="nom"
                  value={addForm.nom}
                  onChange={handleFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Point de Départ</label>
                  <input
                    type="text"
                    name="pointDepart"
                    value={addForm.pointDepart}
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
                    value={addForm.pointArrivee}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Distance (km)</label>
                  <input
                    type="number"
                    name="distance"
                    value={addForm.distance}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Durée Estimée (heures)</label>
                  <input
                    type="number"
                    name="dureeEstimee"
                    value={addForm.dureeEstimee}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Date de Départ</label>
                <input
                  type="datetime-local"
                  name="dateDepart"
                  value={addForm.dateDepart}
                  onChange={handleFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Chauffeur</label>
                <select
                  name="chauffeur"
                  value={addForm.chauffeur}
                  onChange={handleFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="">Sélectionner un chauffeur</option>
                  {chauffeurs.map(chauffeur => (
                    <option key={chauffeur._id} value={chauffeur._id}>
                      {chauffeur.username} - {chauffeur.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Camion</label>
                <select
                  name="camion"
                  value={addForm.camion}
                  onChange={handleFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="">Sélectionner un camion</option>
                  {camions.filter(camion => camion.disponible).map(camion => (
                    <option key={camion._id} value={camion._id}>
                      {camion.marque} - {camion.immatriculation}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Remorque (Optionnel)</label>
                <select
                  name="remorque"
                  value={addForm.remorque}
                  onChange={handleFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                >
                  <option value="">Aucune remorque</option>
                  {remorques.map(remorque => (
                    <option key={remorque._id} value={remorque._id}>
                      {remorque.marque} - {remorque.numeroSerie}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={addForm.notes}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  placeholder="Notes additionnelles..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 rounded-md transition-colors"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Trajet Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Modifier le Trajet</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-neutral-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateTrajet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Nom du Trajet</label>
                <input
                  type="text"
                  name="nom"
                  value={editForm.nom}
                  onChange={handleEditFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Point de Départ</label>
                  <input
                    type="text"
                    name="pointDepart"
                    value={editForm.pointDepart}
                    onChange={handleEditFormChange}
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
                    onChange={handleEditFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Distance (km)</label>
                  <input
                    type="number"
                    name="distance"
                    value={editForm.distance}
                    onChange={handleEditFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Durée Estimée (heures)</label>
                  <input
                    type="number"
                    name="dureeEstimee"
                    value={editForm.dureeEstimee}
                    onChange={handleEditFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Date de Départ</label>
                <input
                  type="datetime-local"
                  name="dateDepart"
                  value={editForm.dateDepart}
                  onChange={handleEditFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Statut</label>
                <select
                  name="statut"
                  value={editForm.statut}
                  onChange={handleEditFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                >
                  <option value="Planifie">Planifié</option>
                  <option value="En cours">En cours</option>
                  <option value="Termine">Terminé</option>
                  <option value="Annule">Annulé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Chauffeur</label>
                <select
                  name="chauffeur"
                  value={editForm.chauffeur}
                  onChange={handleEditFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="">Sélectionner un chauffeur</option>
                  {chauffeurs.map(chauffeur => (
                    <option key={chauffeur._id} value={chauffeur._id}>
                      {chauffeur.username} - {chauffeur.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Camion</label>
                <select
                  name="camion"
                  value={editForm.camion}
                  onChange={handleEditFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="">Sélectionner un camion</option>
                  {camions.map(camion => (
                    <option key={camion._id} value={camion._id}>
                      {camion.marque} - {camion.immatriculation}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Remorque (Optionnel)</label>
                <select
                  name="remorque"
                  value={editForm.remorque}
                  onChange={handleEditFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                >
                  <option value="">Aucune remorque</option>
                  {remorques.map(remorque => (
                    <option key={remorque._id} value={remorque._id}>
                      {remorque.marque} - {remorque.numeroSerie}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={editForm.notes}
                  onChange={handleEditFormChange}
                  rows={3}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  placeholder="Notes additionnelles..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 rounded-md transition-colors"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Trajet Modal */}
      {assignModal && selectedTrajet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Réassigner le Trajet</h3>
              <button
                onClick={handleCloseAssignModal}
                className="text-neutral-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 p-4 bg-neutral-800 rounded-lg">
              <h4 className="font-medium text-white mb-2">{selectedTrajet.nom}</h4>
              <p className="text-sm text-neutral-400">
                {selectedTrajet.pointDepart} → {selectedTrajet.pointArrivee}
              </p>
              <p className="text-sm text-neutral-400">
                Chauffeur actuel: {getChauffeurName(selectedTrajet)}
              </p>
            </div>

            <form onSubmit={handleAssignTrajet} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Nouveau Chauffeur</label>
                <select
                  name="chauffeur"
                  value={assignForm.chauffeur}
                  onChange={handleAssignFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="">Sélectionner un chauffeur</option>
                  {chauffeurs.map(chauffeur => (
                    <option key={chauffeur._id} value={chauffeur._id}>
                      {chauffeur.username} - {chauffeur.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseAssignModal}
                  className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-500 rounded-md transition-colors"
                >
                  Réassigner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}