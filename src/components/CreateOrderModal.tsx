import React, { useState } from 'react';
import api from '../axiosConfig';
import socket from '../socket';

interface CreateOrderModalProps {
  onClose: () => void;
  onOrderCreated: () => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ onClose, onOrderCreated }) => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    truckType: 'Camion frigorifique',
    weight: '',
    distance: '',
    nature: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const weightNum = parseFloat(formData.weight);
    const distanceNum = parseFloat(formData.distance);

    if (isNaN(weightNum) || weightNum <= 0) {
      alert('Poids invalide');
      return;
    }

    if (isNaN(distanceNum) || distanceNum <= 0) {
      alert('Distance invalide');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token manquant');
      return;
    }

    try {
      const payload = {
        pickup: {
          senderName: formData.senderName,
          senderPhone: formData.senderPhone,
          address: formData.senderAddress,
        },
        delivery: {
          recipientName: formData.recipientName,
          recipientPhone: formData.recipientPhone,
          address: formData.recipientAddress,
        },
        truckType: formData.truckType,
        weight: weightNum,
        distance: distanceNum,
        nature: formData.nature,
      };

      const response = await api.post('/orders', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdOrder = response.data;

      // ✅ Notifie les dashboards/admins connectés en temps réel
      socket.emit('newOrderCreated', createdOrder);

      alert('Commande créée avec succès');
      onOrderCreated();
      onClose();
    } catch (err: any) {
      console.error('Erreur création commande :', err);
      alert(err?.response?.data?.error || 'Erreur lors de la création de la commande');
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold mb-4">Créer une nouvelle commande</h2>

        {[ // Champs de base
          { label: 'Nom expéditeur', name: 'senderName' },
          { label: 'Téléphone expéditeur', name: 'senderPhone' },
          { label: 'Adresse expéditeur', name: 'senderAddress' },
          { label: 'Nom destinataire', name: 'recipientName' },
          { label: 'Téléphone destinataire', name: 'recipientPhone' },
          { label: 'Adresse destinataire', name: 'recipientAddress' },
        ].map((field) => (
          <input
            key={field.name}
            type="text"
            name={field.name}
            placeholder={field.label}
            value={(formData as any)[field.name]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        ))}

        <select
          name="truckType"
          value={formData.truckType}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="Camion frigorifique">Camion frigorifique</option>
          <option value="Camion benne">Camion benne</option>
          <option value="Camion plateau">Camion plateau</option>
          <option value="Camion-citerne">Camion-citerne</option>
        </select>

        <input
          type="number"
          name="weight"
          placeholder="Poids (kg)"
          value={formData.weight}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />

        <input
          type="number"
          name="distance"
          placeholder="Distance (km)"
          value={formData.distance}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />

        <input
          type="text"
          name="nature"
          placeholder="Nature du colis"
          value={formData.nature}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md"
          >
            Créer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrderModal;
