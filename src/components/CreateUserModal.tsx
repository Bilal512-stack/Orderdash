import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';  // axios configuré avec URL Railway
import socket from '../socket';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    role: 'client',
    status: 'actif',
    derniereCommande: '',
    commandes: 0,
  });

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        adresse: '',
        ville: '',
        role: 'client',
        status: 'actif',
        derniereCommande: '',
        commandes: 0,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'commandes' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Token manquant. Veuillez vous reconnecter.');
      return;
    }

    try {
      const payload = {
        ...formData,
        dateInscription: new Date().toISOString(),
        derniereCommande: formData.derniereCommande || null,
      };

      const response = await api.post('/users/create-user', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optionnel : notifier le dashboard en temps réel si besoin
      socket.emit('newUserCreated', response.data);

      onUserCreated();
      onClose();
    } catch (error: any) {
      console.error("❌ Erreur lors de la création de l'utilisateur :", error);
      alert(error.response?.data?.error || "Erreur lors de la création de l'utilisateur.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-auto"
      >
        <h2 className="text-xl font-semibold mb-4">Créer un nouvel utilisateur</h2>

        <input
          type="text"
          name="prenom"
          placeholder="Prénom"
          value={formData.prenom}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
        <input
          type="tel"
          name="telephone"
          placeholder="Téléphone"
          value={formData.telephone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />

        <input
          type="text"
          name="adresse"
          placeholder="Adresse"
          value={formData.adresse}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />
        <input
          type="text"
          name="ville"
          placeholder="Ville"
          value={formData.ville}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        />

        <input
          type="date"
          name="derniereCommande"
          placeholder="Dernière commande"
          value={formData.derniereCommande}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />

        <input
          type="number"
          name="commandes"
          placeholder="Nombre de commandes"
          min={0}
          value={formData.commandes}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="client">Client</option>
          <option value="admin">Administrateur</option>
        </select>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>

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

export default CreateUserModal;
