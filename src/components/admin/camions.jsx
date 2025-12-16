import React, { useEffect, useState } from 'react'
import Navbar from '../../layout/navbar'

export default function AdminCamions() {
  const [camions, setCamions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [addForm, setAddForm] = useState({
    marque: '',
    immatriculation: '',
    kilometrage: ''
  })
  const [editForm, setEditForm] = useState({
    _id: '',
    marque: '',
    immatriculation: '',
    kilometrage: '',
    disponible: true
  })

  useEffect(() => {
    const fetchCamions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/api/camions', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('Camions data:', data) 
          setCamions(Array.isArray(data) ? data : data.camions || [])
        } else {
          console.error('Response not ok:', response.status)
          setError('Failed to fetch camions')
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Failed to fetch camions')
      } finally {
        setLoading(false)
      }
    }

    fetchCamions()
  }, [])

  const handleDeleteCamion = async (camionId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce camion ?')) {
      try {
        const response = await fetch(`http://127.0.0.1:3000/api/camions/${camionId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (response.ok) {
          setCamions(camions.filter(c => c._id !== camionId))
        } else {
          alert('Erreur lors de la suppression du camion')
        }
      } catch (err) {
        alert('Erreur lors de la suppression du camion')
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
      immatriculation: '',
      kilometrage: ''
    })
  }

  const handleOpenEditModal = (camion) => {
    setEditForm({
      _id: camion._id,
      marque: camion.marque,
      immatriculation: camion.immatriculation,
      kilometrage: camion.kilometrage,
      disponible: camion.disponible
    })
    setEditModal(true)
  }

  const handleCloseEditModal = () => {
    setEditModal(false)
    setEditForm({
      _id: '',
      marque: '',
      immatriculation: '',
      kilometrage: '',
      disponible: true
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

  const handleAddCamion = async (e) => {
    e.preventDefault()
    try {
      const camionData = {
        marque: addForm.marque,
        immatriculation: addForm.immatriculation,
        kilometrage: addForm.kilometrage || 0
      }

      const response = await fetch('http://127.0.0.1:3000/api/camions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(camionData)
      })
      
      if (response.ok) {
        const newCamion = await response.json()
        setCamions([...camions, newCamion])
        handleCloseAddModal()
      } else {
        alert('Erreur lors de l\'ajout du camion')
      }
    } catch (err) {
      alert('Erreur lors de l\'ajout du camion')
    }
  }

  const handleUpdateCamion = async (e) => {
    e.preventDefault()
    try {
      const camionData = {
        marque: editForm.marque,
        immatriculation: editForm.immatriculation,
        kilometrage: editForm.kilometrage || 0,
        disponible: editForm.disponible
      }

      const response = await fetch(`http://127.0.0.1:3000/api/camions/${editForm._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(camionData)
      })
      
      if (response.ok) {
        const updatedCamion = {
          ...editForm,
          kilometrage: parseInt(editForm.kilometrage) || 0
        }
        setCamions(prevCamions => 
          prevCamions.map(c => c._id === editForm._id ? updatedCamion : c)
        )
        handleCloseEditModal()
      } else {
        alert('Erreur lors de la modification du camion')
      }
    } catch (err) {
      alert('Erreur lors de la modification du camion')
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-white text-xl">Loading camions...</div>
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
                <h1 className="text-3xl font-bold text-white mb-2">Gestion des Camions</h1>
                <p className="text-neutral-400">Liste de tous les camions du parc</p>
              </div>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter Camion
              </button>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Immatriculation</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Marque</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Kilométrage</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Disponible</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {console.log('Rendering camions:', camions, 'Length:', camions.length)}
                  {camions.length > 0 ? (
                    camions.map((camion, index) => {
                      console.log(`Rendering camion ${index}:`, camion)
                      return (
                        <tr key={camion._id} className="hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {camion.immatriculation || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {camion.marque || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                            {camion.kilometrage?.toLocaleString() || 0} km
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              camion.disponible 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {camion.disponible ? 'Disponible' : 'Indisponible'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleOpenEditModal(camion)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Modifier"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteCamion(camion._id)}
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
                        Aucun camion trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Camion Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Ajouter un Camion</h3>
              <button
                onClick={handleCloseAddModal}
                className="text-neutral-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddCamion} className="space-y-4">
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
                <label className="block text-sm font-medium text-neutral-300 mb-2">Immatriculation</label>
                <input
                  type="text"
                  name="immatriculation"
                  value={addForm.immatriculation}
                  onChange={handleFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Kilométrage</label>
                <input
                  type="number"
                  name="kilometrage"
                  value={addForm.kilometrage}
                  onChange={handleFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  min="0"
                  placeholder="0"
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
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Camion Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Modifier le Camion</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-neutral-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateCamion} className="space-y-4">
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
                <label className="block text-sm font-medium text-neutral-300 mb-2">Immatriculation</label>
                <input
                  type="text"
                  name="immatriculation"
                  value={editForm.immatriculation}
                  onChange={handleEditFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Kilométrage</label>
                <input
                  type="number"
                  name="kilometrage"
                  value={editForm.kilometrage}
                  onChange={handleEditFormChange}
                  className="w-full bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md focus:outline-none focus:border-orange-500"
                  min="0"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-neutral-300">
                  <input
                    type="checkbox"
                    name="disponible"
                    checked={editForm.disponible}
                    onChange={handleEditFormChange}
                    className="rounded border-neutral-700 bg-neutral-800 text-orange-600 focus:ring-orange-500 focus:ring-offset-black"
                  />
                  <span>Disponible</span>
                </label>
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