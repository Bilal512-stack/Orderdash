import React, { useEffect, useState } from 'react';
import UsersTable from './UsersTable';
import { User } from '../types';
import api from '../axiosConfig';
import socket from '../socket';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token manquant, veuillez vous connecter.');
        setLoading(false);
        return;
      }

      const response = await api.get<User[]>('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const onUserCreated = (newUser: User) => {
      setUsers(prev => [newUser, ...prev]);
    };

    const onUserUpdated = (updatedUser: User) => {
      setUsers(prev => {
        const idx = prev.findIndex(u => u._id === updatedUser._id);
        if (idx === -1) return prev;
        const updatedUsers = [...prev];
        updatedUsers[idx] = updatedUser;
        return updatedUsers;
      });
    };

    socket.on('userCreated', onUserCreated);
    socket.on('userUpdated', onUserUpdated);

    return () => {
      socket.off('userCreated', onUserCreated);
      socket.off('userUpdated', onUserUpdated);
    };
  }, []);

  if (loading) {
    return <div className="p-4">Chargement des utilisateurs...</div>;
  }

  return <UsersTable users={users} />;
};

export default Users;

