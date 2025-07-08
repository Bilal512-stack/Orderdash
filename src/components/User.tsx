import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UsersTable from './UsersTable';
import { User } from '../types';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-4">Chargement des utilisateurs...</div>;
  }

  return <UsersTable users={users} />;
};

export default Users;
