import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { instance } from '../../config/api';

export default function MesPneus() {
    const [pneus, setPneus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPneu, setSelectedPneu] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [pneuData, setPneuData] = useState({
        usure: '',
        etat: '',
        pression: ''
    });
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchPneus();
    }, []);

    const fetchPneus = async () => {
        try {
            setLoading(true);
            const response = await instance.get('chauffeur/pneus');
            setPneus(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des pneus:', error);
        } finally {
            setLoading(false);
        }
    };

    const getEtatColor = (etat) => {
        switch (etat) {
            case 'Neuf':
                return 'bg-green-100 text-green-800';
            case 'Bon':
                return 'bg-blue-100 text-blue-800';
            case 'Usé':
                return 'bg-yellow-100 text-yellow-800';
            case 'À remplacer':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getUsureColor = (usure) => {
        if (usure <= 25) return 'bg-green-500';
        if (usure <= 50) return 'bg-yellow-500';
        if (usure <= 75) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getPressionColor = (pression) => {
        if (pression >= 8 && pression <= 10) return 'text-green-600';
        if (pression >= 6 && pression < 8) return 'text-yellow-600';
        return 'text-red-600';
    };

    const openModal = (pneu) => {
        setSelectedPneu(pneu);
        setPneuData({
            usure: pneu.usure || '',
            etat: pneu.etat || '',
            pression: pneu.pression || ''
        });
        setShowModal(true);
    };

    const handleUpdatePneu = async () => {
        try {
            await instance.put(
                `chauffeur/pneus/${selectedPneu._id}`,
                pneuData
            );
            setShowModal(false);
            fetchPneus();
            setPneuData({ usure: '', etat: '', pression: '' });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du pneu:', error);
        }
    };

    // Group pneus by vehicle
    const pneusByVehicle = pneus.reduce((acc, pneu) => {
        const vehicleId = pneu.vehiculeId._id;
        if (!acc[vehicleId]) {
            acc[vehicleId] = {
                vehicle: pneu.vehiculeId,
                pneus: []
            };
        }
        acc[vehicleId].pneus.push(pneu);
        return acc;
    }, {});

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
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mes Pneus</h2>
                <div className="text-sm text-gray-600">
                    Total: {pneus.length} pneus
                </div>
            </div>

            {/* Vehicles with their tires */}
            <div className="space-y-6">
                {Object.values(pneusByVehicle).map((vehicleGroup) => (
                    <div key={vehicleGroup.vehicle._id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {vehicleGroup.vehicle.marque} - {vehicleGroup.vehicle.immatriculation || vehicleGroup.vehicle.numeroSerie}
                                </h3>
                                <span className="text-sm text-gray-600">
                                    {vehicleGroup.pneus.length} pneus
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {vehicleGroup.pneus.map((pneu) => (
                                    <div key={pneu._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                         onClick={() => openModal(pneu)}>
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-medium text-gray-900">{pneu.position}</h4>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEtatColor(pneu.etat)}`}>
                                                {pneu.etat}
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            {/* Usure */}
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-sm text-gray-600">Usure</span>
                                                    <span className="text-sm font-medium text-gray-900">{pneu.usure}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${getUsureColor(pneu.usure)}`}
                                                        style={{ width: `${pneu.usure}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            
                                            {/* Pression */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Pression</span>
                                                <span className={`text-sm font-medium ${getPressionColor(pneu.pression)}`}>
                                                    {pneu.pression} bar
                                                </span>
                                            </div>
                                            
                                            {/* Marque et dimension */}
                                            <div className="text-xs text-gray-500">
                                                <div>{pneu.marque}</div>
                                                <div>{pneu.dimension}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                Mettre à jour
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {Object.keys(pneusByVehicle).length === 0 && (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun pneu</h3>
                    <p className="mt-1 text-sm text-gray-500">Aucun pneu trouvé pour vos véhicules assignés.</p>
                </div>
            )}

            {/* Update Modal */}
            {showModal && selectedPneu && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Mettre à jour le pneu - {selectedPneu.position}
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

                            <div className="space-y-4">
                                {/* Usure */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Usure (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={pneuData.usure}
                                        onChange={(e) => setPneuData({
                                            ...pneuData,
                                            usure: e.target.value
                                        })}
                                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0-100"
                                    />
                                </div>

                                {/* État */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        État
                                    </label>
                                    <select
                                        value={pneuData.etat}
                                        onChange={(e) => setPneuData({
                                            ...pneuData,
                                            etat: e.target.value
                                        })}
                                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Sélectionner un état</option>
                                        <option value="Neuf">Neuf</option>
                                        <option value="Bon">Bon</option>
                                        <option value="Usé">Usé</option>
                                        <option value="À remplacer">À remplacer</option>
                                    </select>
                                </div>

                                {/* Pression */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pression (bar)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="15"
                                        value={pneuData.pression}
                                        onChange={(e) => setPneuData({
                                            ...pneuData,
                                            pression: e.target.value
                                        })}
                                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: 8.5"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Recommandé: 8-10 bar
                                    </p>
                                </div>

                                {/* Informations du pneu */}
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Informations actuelles</h4>
                                    <div className="text-xs text-gray-600 space-y-1">
                                        <div>Marque: {selectedPneu.marque}</div>
                                        <div>Dimension: {selectedPneu.dimension}</div>
                                        <div>Position: {selectedPneu.position}</div>
                                        <div>Véhicule: {selectedPneu.vehiculeId.marque} - {selectedPneu.vehiculeId.immatriculation || selectedPneu.vehiculeId.numeroSerie}</div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleUpdatePneu}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Mettre à jour
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}