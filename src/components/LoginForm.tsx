import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      interface LoginResponse {
        token: string;
        // add other fields if needed
      }
      const res = await axios.post<LoginResponse>('http://localhost:5000/api/admin/login', { email, password });
      localStorage.setItem('token', res.data.token);
      console.log('Token stocké dans localStorage:', localStorage.getItem('token'));
      alert('Connexion réussie, token stocké !');

      // Redirection vers le dashboard après la connexion réussie
      navigate('/'); // Redirection vers le dashboard
    } catch (error) {
      console.error('Erreur de connexion :', error);
      alert('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Email</label>
        <input
          type="email"
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Entrez votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Mot de passe</label>
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Entrez votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium transition duration-200"
        disabled={loading}
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}
