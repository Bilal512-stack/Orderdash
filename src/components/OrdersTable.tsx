import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import socket from '../socket';
import { Order } from '../types';
import OrderStatusTag from './OrderStatusTag';
import { Search, Filter, ChevronDown } from 'lucide-react';

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      alert('Aucun token trouvé, veuillez vous connecter.');
      return;
    }

    try {
      const response = await api.get('/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
      } else {
        throw new Error('Format de données inattendu.');
      }
    } catch (err: any) {
      console.error('Erreur récupération des commandes:', err);
      setError('Erreur lors de la récupération des commandes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const onOrderUpdated = (updatedOrder: Order) => {
      setOrders(prev => {
        const idx = prev.findIndex(o => o._id === updatedOrder._id);
        if (idx === -1) return prev;
        const newOrders = [...prev];
        newOrders[idx] = updatedOrder;
        return newOrders;
      });
    };

    const onOrderCreated = (newOrder: Order) => {
      setOrders(prev => [newOrder, ...prev]);
    };

    socket.on('orderUpdated', onOrderUpdated);
    socket.on('orderCreated', onOrderCreated);

    return () => {
      socket.off('orderUpdated', onOrderUpdated);
      socket.off('orderCreated', onOrderCreated);
    };
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchText = searchTerm.toLowerCase();

    const matchesSearch =
      order._id.toLowerCase().includes(searchText) ||
      order?.pickup?.address?.toLowerCase().includes(searchText) ||
      order?.delivery?.address?.toLowerCase().includes(searchText);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleAutoAssign = async (orderId: string) => {
    try {
      setAssigningOrderId(orderId);
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Aucun token trouvé, veuillez vous reconnecter.');
        return;
      }

      const res = await api.post(`/api/assign-order/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 200) {
        alert('✅ Commande assignée automatiquement avec succès.');
        fetchOrders();
      } else {
        alert('Erreur lors de l’assignation automatique.');
      }
    } catch (error: any) {
      console.error('Erreur assignation auto:', error);
      alert(error.response?.data?.error || 'Erreur lors de l’assignation automatique.');
    } finally {
      setAssigningOrderId(null);
    }
  };

  if (loading) return <p>Chargement des commandes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
 return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Liste des commandes</h2>
        <div className="flex items-center w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une commande..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="flex items-center">
              <Filter size={18} className="text-gray-400 mr-2" />
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none"
                value={statusFilter}
                onChange={(e) => {
                  setCurrentPage(1);
                  setStatusFilter(e.target.value);
                }}
              >
                <option value="all">Tous les statuts</option>
                <option value="en attente">En attente</option>
                <option value="assignée">Assignée</option>
                <option value="en cours">En cours</option>
                <option value="livrée">Livrée</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Commande</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transporteur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{order._id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {order.clientId ? `${order.clientId.prenom} ${order.clientId.nom}` : 'Client inconnu'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date inconnue'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(order.montant || 0)}
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusTag status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {order.transporterName || order.transporterId || 'Non assigné'}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button className="text-blue-600 hover:text-blue-900 font-medium mr-2">Détails</button>
                    {!order.transporterId && (
                      <button
                        onClick={() => handleAutoAssign(order._id)}
                        className="text-green-600 hover:text-green-900 font-medium"
                        disabled={assigningOrderId === order._id}
                      >
                        {assigningOrderId === order._id ? 'Chargement...' : 'Assigner '}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucune commande trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default OrdersTable;