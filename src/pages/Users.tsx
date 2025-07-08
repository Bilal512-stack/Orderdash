import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UsersTable from '../components/UsersTable';
import { UserPlus, Users as UsersIcon } from 'lucide-react';
import CreateUserModal from '../components/CreateUserModal';

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  adresse: string;
  telephone: string;
  ville: string;
  derniereCommande: string | null;
  role: 'client' | 'admin';
  commandes: number;
  status: 'actif' | 'inactif';
  dateInscription: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

const fetchUsers = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token manquant dans localStorage');
    return;
  }
  try {
    const response = await axios.get<User[]>('http://localhost:5000/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,  // <-- bien mettre ici
      },
    });
    setUsers(response.data);
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs :', error);
  }
};
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleUserCreated = () => {
    fetchUsers(); // Recharger les utilisateurs
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus size={16} className="mr-2" />
          Nouvel utilisateur
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total utilisateurs" count={users.length} color="blue" />
        <StatCard
          title="Utilisateurs actifs"
          count={users.filter(user => user.status === 'actif').length}
          color="green"
        />
        <StatCard
          title="Administrateurs"
          count={users.filter(user => user.role === 'admin').length}
          color="purple"
        />
      </div>

      <div>
        <UsersTable users={users} />
      </div>

      {isModalOpen && (
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUserCreated={handleUserCreated}
        />
      )}
    </div>
  );
};

export default Users;

// Composant réutilisable pour les stats
const StatCard = ({
  title,
  count,
  color,
}: {
  title: string;
  count: number;
  color: 'blue' | 'green' | 'purple';
}) => {
  const bgColor = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  }[color];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center md:flex-row md:justify-between">
      <div className="flex flex-col items-center md:items-start">
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-3xl font-bold text-gray-800">{count}</h2>
      </div>
      <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center mt-2 md:mt-0`}>
        <UsersIcon size={24} />
      </div>
    </div>
  );
};
