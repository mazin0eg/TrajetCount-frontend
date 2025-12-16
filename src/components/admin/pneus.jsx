import React, { useEffect, useState } from 'react'
import Navbar from '../../layout/navbar'

export default function AdminPneus() {
  const [pneus, setPneus] = useState([])
  const [camions, setCamions] = useState([])
  const [remorques, setRemorques] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [addForm, setAddForm] = useState({
    marque: '',
    taille: '',
    pression: '',
    usure: 0,
    etat: 'Neuf',
    vehiculeId: '',
    vehiculeType: '',
    position: ''
  })
  const [editForm, setEditForm] = useState({
    _id: '',
    marque: '',
    taille: '',
    pression: '',
    usure: 0,
    etat: 'Neuf',
    vehiculeId: '',
    vehiculeType: '',
    position: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch pneus
        const pneusResponse = await fetch('http://127.0.0.1:3000/api/pneus', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        // Fetch camions for dropdown
        const camionsResponse = await fetch('http://127.0.0.1:3000/api/camions', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })

        // Fetch remorques for dropdown
        const remorquesResponse = await fetch('http://127.0.0.1:3000/api/remorques', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (pneusResponse.ok) {
          const pneusData = await pneusResponse.json()
          console.log('Pneus data:', pneusData) 
          setPneus(Array.isArray(pneusData) ? pneusData : pneusData.pneus || [])
        } else {
          console.error('Pneus response not ok:', pneusResponse.status)
          setError('Failed to fetch pneus')
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

  const handleDeletePneu = async (pneuId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce pneu ?')) {
      try {
        const response = await fetch(`http://127.0.0.1:3000/api/pneus/${pneuId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (response.ok) {
          setPneus(pneus.filter(p => p._id !== pneuId))
        } else {
          alert('Erreur lors de la suppression du pneu')
        }
      } catch (err) {
        alert('Erreur lors de la suppression du pneu')
      }
    }
  }

  const handleOpenAddModal = () => {
    setAddModal(true)
  }

  const handleCloseAddModal = () => {
    setAddModal(false)
    setAddForm({
      marque: '',
      taille: '',
      pression: '',
      usure: 0,
      etat: 'Neuf',
      vehiculeId: '',
      vehiculeType: '',
      position: ''
    })
  }

  const handleOpenEditModal = (pneu) => {
    setEditForm({
      _id: pneu._id,
      marque: pneu.marque,
      taille: pneu.taille,
      pression: pneu.pression,
      usure: pneu.usure,
      etat: pneu.etat,
      vehiculeId: pneu.vehiculeId?._id || pneu.vehiculeId || '',
      vehiculeType: pneu.vehiculeType,
      position: pneu.position
    })
    setEditModal(true)
  }

  const handleCloseEditModal = () => {
    setEditModal(false)
    setEditForm({
      _id: '',
      marque: '',
      taille: '',
      pression: '',
      usure: 0,
      etat: 'Neuf',
      vehiculeId: '',
      vehiculeType: '',
      position: ''
    })
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddPneu = async (e) => {
    e.preventDefault()
    try {
      const pneuData = {
        marque: addForm.marque,
        taille: addForm.taille,
        pression: parseFloat(addForm.pression),
        usure: parseInt(addForm.usure) || 0,
        etat: addForm.etat,
        vehiculeId: addForm.vehiculeId || null,
        vehiculeType: addForm.vehiculeType || null,
        position: addForm.position
      }

      const response = await fetch('http://127.0.0.1:3000/api/pneus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(pneuData)
      })
      
      if (response.ok) {
        const responseData = await response.json()
        // Extract the pneu from the response since backend returns { message, pneu }
        const newPneu = responseData.pneu || responseData
        setPneus([...pneus, newPneu])
        handleCloseAddModal()
      } else {
        alert('Erreur lors de l\'ajout du pneu')
      }
    } catch (err) {
      alert('Erreur lors de l\'ajout du pneu')
    }
  }

  const handleUpdatePneu = async (e) => {
    e.preventDefault()
    try {
      const pneuData = {
        marque: editForm.marque,
        taille: editForm.taille,
        pression: parseFloat(editForm.pression),
        usure: parseInt(editForm.usure) || 0,
        etat: editForm.etat,
        vehiculeId: editForm.vehiculeId || null,
        vehiculeType: editForm.vehiculeType || null,
        position: editForm.position
      }

      const response = await fetch(`http://127.0.0.1:3000/api/pneus/${editForm._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(pneuData)
      })
      
      if (response.ok) {
        // Update the local state immediately with the edited data
        const updatedPneu = {
          ...editForm,
          pression: parseFloat(editForm.pression),
          usure: parseInt(editForm.usure) || 0
        }
        setPneus(prevPneus => 
          prevPneus.map(p => p._id === editForm._id ? updatedPneu : p)
        )
        handleCloseEditModal()
      } else {
        alert('Erreur lors de la modification du pneu')
      }
    } catch (err) {
      alert('Erreur lors de la modification du pneu')
    }
  }

  const getVehicleDisplayName = (pneu) => {
    if (!pneu.vehiculeId) return 'Non assigné'
    
    if (typeof pneu.vehiculeId === 'object') {
      // Populated data
      return `${pneu.vehiculeType} - ${pneu.vehiculeId.immatriculation || pneu.vehiculeId.numeroSerie || 'N/A'}`
    } else {
      // Just ID
      return `${pneu.vehiculeType} - ID: ${pneu.vehiculeId}`
    }
  }

  const getUsureColor = (usure) => {
    if (usure >= 80) return 'bg-red-100 text-red-800'
    if (usure >= 50) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getEtatColor = (etat) => {
    switch (etat) {
      case 'Neuf': return 'bg-blue-100 text-blue-800'
      case 'Bon': return 'bg-green-100 text-green-800'
      case 'Usé': return 'bg-yellow-100 text-yellow-800'
      case 'À remplacer': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-white text-xl">Loading pneus...</div>
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
                <h1 className="text-3xl font-bold text-white mb-2">Gestion des Pneus</h1>
                <p className="text-neutral-400">Liste de tous les pneus du parc</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter Pneu
              </button>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Marque</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Taille</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Pression</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Usure</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">État</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Véhicule</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {console.log('Rendering pneus:', pneus, 'Length:', pneus.length)}
                  {pneus.length > 0 ? (
                    pneus.map((pneu, index) => {
                      console.log(`Rendering pneu ${index}:`, pneu)
                      return (
                        <tr key={pneu._id} className="hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {pneu.marque || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {pneu.taille || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {pneu.position || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {pneu.pression || 0} PSI
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUsureColor(pneu.usure || 0)}`}>
                              {pneu.usure || 0}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEtatColor(pneu.etat)}`}>
                              {pneu.etat || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {getVehicleDisplayName(pneu)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleOpenEditModal(pneu)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Modifier"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeletePneu(pneu._id)}
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
                      <td colSpan="8" className="px-6 py-8 text-center text-neutral-500">
                        Aucun pneu trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Pneu Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Ajouter un Pneu</h3>
              <button
                onClick={handleCloseAddModal}
                className="text-neutral-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddPneu} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Marque</label>
                  <input
                    type="text"
                    name="marque"
                    value={addForm.marque}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Taille</label>
                  <input
                    type="text"
                    name="taille"
                    value={addForm.taille}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    placeholder="ex: 295/80R22.5"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Pression (PSI)</label>
                  <input
                    type="number"
                    name="pression"
                    value={addForm.pression}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Usure (%)</label>
                  <input
                    type="number"
                    name="usure"
                    value={addForm.usure}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Position</label>
                <select
                  name="position"
                  value={addForm.position}
                  onChange={handleFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="">Sélectionner une position</option>
                  <option value="Avant Gauche">Avant Gauche</option>
                  <option value="Avant Droite">Avant Droite</option>
                  <option value="Arrière Gauche">Arrière Gauche</option>
                  <option value="Arrière Droite">Arrière Droite</option>
                  <option value="Arrière Gauche Intérieur">Arrière Gauche Intérieur</option>
                  <option value="Arrière Droite Intérieur">Arrière Droite Intérieur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">État</label>
                <select
                  name="etat"
                  value={addForm.etat}
                  onChange={handleFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="Neuf">Neuf</option>
                  <option value="Bon">Bon</option>
                  <option value="Usé">Usé</option>
                  <option value="À remplacer">À remplacer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Type de Véhicule</label>
                <select
                  name="vehiculeType"
                  value={addForm.vehiculeType}
                  onChange={handleFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                >
                  <option value="">Aucun véhicule</option>
                  <option value="Camion">Camion</option>
                  <option value="Remorque">Remorque</option>
                </select>
              </div>

              {addForm.vehiculeType && (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    {addForm.vehiculeType === 'Camion' ? 'Camion' : 'Remorque'}
                  </label>
                  <select
                    name="vehiculeId"
                    value={addForm.vehiculeId}
                    onChange={handleFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Sélectionner un {addForm.vehiculeType.toLowerCase()}</option>
                    {addForm.vehiculeType === 'Camion' 
                      ? camions.map(camion => (
                          <option key={camion._id} value={camion._id}>
                            {camion.immatriculation} - {camion.marque}
                          </option>
                        ))
                      : remorques.map(remorque => (
                          <option key={remorque._id} value={remorque._id}>
                            {remorque.numeroSerie} - {remorque.marque}
                          </option>
                        ))
                    }
                  </select>
                </div>
              )}

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
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Pneu Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Modifier le Pneu</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-neutral-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdatePneu} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Marque</label>
                  <input
                    type="text"
                    name="marque"
                    value={editForm.marque}
                    onChange={handleEditFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Taille</label>
                  <input
                    type="text"
                    name="taille"
                    value={editForm.taille}
                    onChange={handleEditFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    placeholder="ex: 295/80R22.5"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Pression (PSI)</label>
                  <input
                    type="number"
                    name="pression"
                    value={editForm.pression}
                    onChange={handleEditFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Usure (%)</label>
                  <input
                    type="number"
                    name="usure"
                    value={editForm.usure}
                    onChange={handleEditFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Position</label>
                <select
                  name="position"
                  value={editForm.position}
                  onChange={handleEditFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="">Sélectionner une position</option>
                  <option value="Avant Gauche">Avant Gauche</option>
                  <option value="Avant Droite">Avant Droite</option>
                  <option value="Arrière Gauche">Arrière Gauche</option>
                  <option value="Arrière Droite">Arrière Droite</option>
                  <option value="Arrière Gauche Intérieur">Arrière Gauche Intérieur</option>
                  <option value="Arrière Droite Intérieur">Arrière Droite Intérieur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">État</label>
                <select
                  name="etat"
                  value={editForm.etat}
                  onChange={handleEditFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                >
                  <option value="Neuf">Neuf</option>
                  <option value="Bon">Bon</option>
                  <option value="Usé">Usé</option>
                  <option value="À remplacer">À remplacer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Type de Véhicule</label>
                <select
                  name="vehiculeType"
                  value={editForm.vehiculeType}
                  onChange={handleEditFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                >
                  <option value="">Aucun véhicule</option>
                  <option value="Camion">Camion</option>
                  <option value="Remorque">Remorque</option>
                </select>
              </div>

              {editForm.vehiculeType && (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    {editForm.vehiculeType === 'Camion' ? 'Camion' : 'Remorque'}
                  </label>
                  <select
                    name="vehiculeId"
                    value={editForm.vehiculeId}
                    onChange={handleEditFormChange}
                    className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  >
                    <option value="">Sélectionner un {editForm.vehiculeType.toLowerCase()}</option>
                    {editForm.vehiculeType === 'Camion' 
                      ? camions.map(camion => (
                          <option key={camion._id} value={camion._id}>
                            {camion.immatriculation} - {camion.marque}
                          </option>
                        ))
                      : remorques.map(remorque => (
                          <option key={remorque._id} value={remorque._id}>
                            {remorque.numeroSerie} - {remorque.marque}
                          </option>
                        ))
                    }
                  </select>
                </div>
              )}

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
    </>
  )
}