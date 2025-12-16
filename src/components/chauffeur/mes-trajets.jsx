import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { instance } from '../../config/api';

export default function MesTrajets() {
    const [trajets, setTrajets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatut, setSelectedStatut] = useState('');
    const [selectedTrajet, setSelectedTrajet] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'view', 'start', 'complete'
    const [kilometrageData, setKilometrageData] = useState({
        kilometrageDepart: '',
        kilometrageArrivee: '',
        notes: ''
    });
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchTrajets();
    }, [selectedStatut]);

    const fetchTrajets = async () => {
        try {
            setLoading(true);
            const params = selectedStatut ? `?statut=${selectedStatut}` : '';
            const response = await instance.get(`chauffeur/trajets${params}`);
            setTrajets(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des trajets:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'Planifie':
                return 'bg-yellow-100 text-yellow-800';
            case 'En cours':
                return 'bg-blue-100 text-blue-800';
            case 'Termine':
                return 'bg-green-100 text-green-800';
            case 'Annule':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleStartTrip = async () => {
        try {
            await instance.patch(
                `trajets/${selectedTrajet._id}/start`,
                { kilometrageDepart: kilometrageData.kilometrageDepart }
            );
            setShowModal(false);
            fetchTrajets();
            setKilometrageData({ kilometrageDepart: '', kilometrageArrivee: '', notes: '' });
        } catch (error) {
            console.error('Erreur lors du démarrage du trajet:', error);
        }
    };

    const handleCompleteTrip = async () => {
        try {
            await instance.patch(
                `trajets/${selectedTrajet._id}/complete`,
                { 
                    kilometrageArrivee: kilometrageData.kilometrageArrivee,
                    notes: kilometrageData.notes 
                }
            );
            setShowModal(false);
            fetchTrajets();
            setKilometrageData({ kilometrageDepart: '', kilometrageArrivee: '', notes: '' });
        } catch (error) {
            console.error('Erreur lors de la finalisation du trajet:', error);
        }
    };

    const downloadPDF = async (trajetId) => {
        try {
            const response = await instance.get(
                `chauffeur/trajets/${trajetId}/pdf`,
                { responseType: 'blob' }
            );
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `trajet-${trajetId}.pdf`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors du téléchargement du PDF:', error);
        }
    };

    const openModal = (trajet, type) => {
        setSelectedTrajet(trajet);
        setModalType(type);
        setShowModal(true);
        if (type === 'start') {
            setKilometrageData({ 
                ...kilometrageData, 
                kilometrageDepart: trajet.camion?.kilometrage || '' 
            });
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header with filters */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mes Trajets</h2>
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedStatut}
                        onChange={(e) => setSelectedStatut(e.target.value)}
                        className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="Planifie">Planifiés</option>
                        <option value="En cours">En cours</option>
                        <option value="Termine">Terminés</option>
                        <option value="Annule">Annulés</option>
                    </select>
                </div>
            </div>

            {/* Trajets Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trajets.map((trajet) => (
                    <div key={trajet._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{trajet.nom}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trajet.statut)}`}>
                                    {trajet.statut}
                                </span>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {trajet.pointDepart}
                                </div>
                                <div className="flex items-center">
                                    <svg className="h-4 w-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {trajet.pointArrivee}
                                </div>
                                <div className="flex items-center">
                                    <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}
                                </div>
                                <div className="flex items-center">
                                    <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    {trajet.distance} km - {trajet.dureeEstimee}h
                                </div>
                                {trajet.camion && (
                                    <div className="flex items-center">
                                        <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h2m4-18h8a2 2 0 012 2v12a2 2 0 01-2 2h-8m-4 0V4m0 16h4m-4 0v-4m0 4h4v-4" />
                                        </svg>
                                        {trajet.camion.marque} - {trajet.camion.immatriculation}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    onClick={() => openModal(trajet, 'view')}
                                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-100 transition-colors"
                                >
                                    Détails
                                </button>
                                
                                {trajet.statut === 'Planifie' && (
                                    <button
                                        onClick={() => openModal(trajet, 'start')}
                                        className="bg-green-50 text-green-700 px-3 py-1 rounded-md text-sm hover:bg-green-100 transition-colors"
                                    >
                                        Démarrer
                                    </button>
                                )}
                                
                                {trajet.statut === 'En cours' && (
                                    <button
                                        onClick={() => openModal(trajet, 'complete')}
                                        className="bg-orange-50 text-orange-700 px-3 py-1 rounded-md text-sm hover:bg-orange-100 transition-colors"
                                    >
                                        Terminer
                                    </button>
                                )}
                                
                                {trajet.statut === 'Termine' && (
                                    <button
                                        onClick={() => downloadPDF(trajet._id)}
                                        className="bg-purple-50 text-purple-700 px-3 py-1 rounded-md text-sm hover:bg-purple-100 transition-colors"
                                    >
                                        PDF
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {trajets.length === 0 && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun trajet</h3>
                    <p className="mt-1 text-sm text-gray-500">Aucun trajet trouvé pour les critères sélectionnés.</p>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    {modalType === 'view' && 'Détails du trajet'}
                                    {modalType === 'start' && 'Démarrer le trajet'}
                                    {modalType === 'complete' && 'Terminer le trajet'}
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {modalType === 'view' && selectedTrajet && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nom du trajet</label>
                                            <p className="mt-1 text-sm text-gray-900">{selectedTrajet.nom}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Statut</label>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTrajet.statut)}`}>
                                                {selectedTrajet.statut}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Point de départ</label>
                                            <p className="mt-1 text-sm text-gray-900">{selectedTrajet.pointDepart}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Point d'arrivée</label>
                                            <p className="mt-1 text-sm text-gray-900">{selectedTrajet.pointArrivee}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Distance</label>
                                            <p className="mt-1 text-sm text-gray-900">{selectedTrajet.distance} km</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Durée estimée</label>
                                            <p className="mt-1 text-sm text-gray-900">{selectedTrajet.dureeEstimee} heures</p>
                                        </div>
                                    </div>
                                    
                                    {selectedTrajet.camion && (
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium text-gray-900 mb-2">Véhicule assigné</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Camion</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedTrajet.camion.marque}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Immatriculation</label>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedTrajet.camion.immatriculation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedTrajet.notes && (
                                        <div className="border-t pt-4">
                                            <label className="block text-sm font-medium text-gray-700">Notes</label>
                                            <p className="mt-1 text-sm text-gray-900">{selectedTrajet.notes}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {modalType === 'start' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Kilométrage de départ
                                        </label>
                                        <input
                                            type="number"
                                            value={kilometrageData.kilometrageDepart}
                                            onChange={(e) => setKilometrageData({
                                                ...kilometrageData,
                                                kilometrageDepart: e.target.value
                                            })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Entrez le kilométrage actuel"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={handleStartTrip}
                                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors"
                                        >
                                            Démarrer le trajet
                                        </button>
                                    </div>
                                </div>
                            )}

                            {modalType === 'complete' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Kilométrage d'arrivée
                                        </label>
                                        <input
                                            type="number"
                                            value={kilometrageData.kilometrageArrivee}
                                            onChange={(e) => setKilometrageData({
                                                ...kilometrageData,
                                                kilometrageArrivee: e.target.value
                                            })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Entrez le kilométrage final"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Notes (optionnel)
                                        </label>
                                        <textarea
                                            value={kilometrageData.notes}
                                            onChange={(e) => setKilometrageData({
                                                ...kilometrageData,
                                                notes: e.target.value
                                            })}
                                            rows={3}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Remarques sur le trajet (incidents, retards, etc.)"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={handleCompleteTrip}
                                            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 transition-colors"
                                        >
                                            Terminer le trajet
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}