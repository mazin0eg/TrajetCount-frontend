import React, { useEffect, useState } from 'react'
import Navbar from '../../layout/navbar'

export default function AdminRemorques() {
  const [remorques, setRemorques] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [addForm, setAddForm] = useState({
    marque: '',
    numeroSerie: '',
    capaciteCharge: '',
    etat: 'Bon'
  })
  const [editForm, setEditForm] = useState({
    _id: '',
    marque: '',
    numeroSerie: '',
    capaciteCharge: '',
    etat: 'Bon'
  })

  useEffect(() => {
    const fetchRemorques = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/api/remorques', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('Remorques data:', data) 
          setRemorques(Array.isArray(data) ? data : data.remorques || [])
        } else {
          console.error('Response not ok:', response.status)
          setError('Failed to fetch remorques')
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Failed to fetch remorques')
      } finally {
        setLoading(false)
      }
    }

    fetchRemorques()
  }, [])

  const handleDeleteRemorque = async (remorqueId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette remorque ?')) {
      try {
        const response = await fetch(`http://127.0.0.1:3000/api/remorques/${remorqueId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (response.ok) {
          setRemorques(remorques.filter(r => r._id !== remorqueId))
        } else {
          alert('Erreur lors de la suppression de la remorque')
        }
      } catch (err) {
        alert('Erreur lors de la suppression de la remorque')
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
      numeroSerie: '',
      capaciteCharge: '',
      etat: 'Bon'
    })
  }

  const handleOpenEditModal = (remorque) => {
    setEditForm({
      _id: remorque._id,
      marque: remorque.marque,
      numeroSerie: remorque.numeroSerie,
      capaciteCharge: remorque.capaciteCharge,
      etat: remorque.etat
    })
    setEditModal(true)
  }

  const handleCloseEditModal = () => {
    setEditModal(false)
    setEditForm({
      _id: '',
      marque: '',
      numeroSerie: '',
      capaciteCharge: '',
      etat: 'Bon'
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

  const handleAddRemorque = async (e) => {
    e.preventDefault()
    try {
      const remorqueData = {
        marque: addForm.marque,
        numeroSerie: addForm.numeroSerie,
        capaciteCharge: addForm.capaciteCharge || 0,
        etat: addForm.etat
      }

      const response = await fetch('http://127.0.0.1:3000/api/remorques', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(remorqueData)
      })
      
      if (response.ok) {
        const responseData = await response.json()
        const newRemorque = responseData.remorque || responseData
        setRemorques([...remorques, newRemorque])
        handleCloseAddModal()
      } else {
        alert('Erreur lors de l\'ajout de la remorque')
      }
    } catch (err) {
      alert('Erreur lors de l\'ajout de la remorque')
    }
  }

  const handleUpdateRemorque = async (e) => {
    e.preventDefault()
    try {
      const remorqueData = {
        marque: editForm.marque,
        numeroSerie: editForm.numeroSerie,
        capaciteCharge: editForm.capaciteCharge || 0,
        etat: editForm.etat
      }

      const response = await fetch(`http://127.0.0.1:3000/api/remorques/${editForm._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(remorqueData)
      })
      
      if (response.ok) {
        const updatedRemorque = {
          ...editForm,  
          capaciteCharge: parseInt(editForm.capaciteCharge) || 0
        }
        setRemorques(prevRemorques => 
          prevRemorques.map(r => r._id === editForm._id ? updatedRemorque : r)
        )
        handleCloseEditModal()
      } else {
        alert('Erreur lors de la modification de la remorque')
      }
    } catch (err) {
      alert('Erreur lors de la modification de la remorque')
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-white text-xl">Loading remorques...</div>
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
                <h1 className="text-3xl font-bold text-white mb-2">Gestion des Remorques</h1>
                <p className="text-neutral-400">Liste de toutes les remorques du parc</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter Remorque
              </button>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Numéro de Série</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Marque</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Capacité de Charge (T)</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">État</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {console.log('Rendering remorques:', remorques, 'Length:', remorques.length)}
                  {remorques.length > 0 ? (
                    remorques.map((remorque, index) => {
                      console.log(`Rendering remorque ${index}:`, remorque)
                      return (
                        <tr key={remorque._id} className="hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {remorque.numeroSerie || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {remorque.marque || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {remorque.capaciteCharge || 0} T
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              remorque.etat === 'Bon' 
                                ? 'bg-green-100 text-green-800' 
                                : remorque.etat === 'En reparation'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {remorque.etat || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleOpenEditModal(remorque)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Modifier"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteRemorque(remorque._id)}
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
                      <td colSpan="5" className="px-6 py-8 text-center text-neutral-500">
                        Aucune remorque trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Remorque Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Ajouter une Remorque</h3>
              <button
                onClick={handleCloseAddModal}
                className="text-neutral-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddRemorque} className="space-y-4">
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
                <label className="block text-sm font-medium text-neutral-300 mb-2">Numéro de Série</label>
                <input
                  type="text"
                  name="numeroSerie"
                  value={addForm.numeroSerie}
                  onChange={handleFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Capacité de Charge (Tonnes)</label>
                <input
                  type="number"
                  name="capaciteCharge"
                  value={addForm.capaciteCharge}
                  onChange={handleFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  min="0"
                  step="0.1"
                  placeholder="0"
                />
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
                  <option value="Bon">Bon</option>
                  <option value="Mauvais">Mauvais</option>
                  <option value="En reparation">En réparation</option>
                </select>
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
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Remorque Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Modifier la Remorque</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-neutral-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateRemorque} className="space-y-4">
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
                <label className="block text-sm font-medium text-neutral-300 mb-2">Numéro de Série</label>
                <input
                  type="text"
                  name="numeroSerie"
                  value={editForm.numeroSerie}
                  onChange={handleEditFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Capacité de Charge (Tonnes)</label>
                <input
                  type="number"
                  name="capaciteCharge"
                  value={editForm.capaciteCharge}
                  onChange={handleEditFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  min="0"
                  step="0.1"
                />
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
                  <option value="Bon">Bon</option>
                  <option value="Mauvais">Mauvais</option>
                  <option value="En reparation">En réparation</option>
                </select>
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
    </>
  )
}