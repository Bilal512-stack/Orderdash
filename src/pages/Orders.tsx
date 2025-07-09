import React, { useEffect, useState } from 'react';
import OrdersTable from '../components/OrdersTable';
import StatusChart from '../components/StatusChart';
import { Calendar, PackageCheck } from 'lucide-react';
import CreateOrderModal from '../components/CreateOrderModal';
import dayjs from 'dayjs';
import api from '../axiosConfig';
import socket from '../socket';

export interface Order {
  clientId: string;
  date: string;
  montant: number;
  status: 'En_attente' | 'Assignée' | 'En_cours' | 'Livrée' | 'Annulée';
  recipientAddress: string;
  recipientName: string;
  recipientPhone: string;
  senderAddress: string;
  senderName: string;
  senderPhone: string;
  id: string;
  weight: number;
  distance: number;
  nature: string;
  truckType: string;
  transporterName: string;
}

interface StatCardProps {
  title: string;
  color: string;
  value: number;
}

type Period = 'today' | 'week' | 'month' | 'all';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('all');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const periods = [
    { value: 'today', label: "Aujourd'hui" },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'all', label: 'Toutes les périodes' },
  ];

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/orders', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      setOrders(res.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
      setError('Erreur lors du chargement des commandes');
    }
  };

  useEffect(() => {
    fetchOrders();

    if (!socket) return;

    socket.on('newOrderNotification', fetchOrders);
    socket.on('orderUpdated', fetchOrders);
    socket.on('orderDeleted', fetchOrders);

    return () => {
      socket.off('newOrderNotification', fetchOrders);
      socket.off('orderUpdated', fetchOrders);
      socket.off('orderDeleted', fetchOrders);
    };
  }, []);

  const filterOrdersByPeriod = (orders: Order[], period: Period): Order[] => {
    const now = dayjs();
    if (period === 'all') return orders;

    return orders.filter((order) => {
      const orderDate = dayjs(order.date);
      switch (period) {
        case 'today':
          return orderDate.isSame(now, 'day');
        case 'week':
          return orderDate.isAfter(now.subtract(7, 'day'));
        case 'month':
          return orderDate.isSame(now, 'month');
        default:
          return true;
      }
    });
  };

  const filteredOrders = filterOrdersByPeriod(orders, selectedPeriod);

  const commandesParStatut = {
    En_attente: filteredOrders.filter((o) => o.status === 'En_attente').length,
    Assignée: filteredOrders.filter((o) => o.status === 'Assignée').length,
    En_cours: filteredOrders.filter((o) => o.status === 'En_cours').length,
    Livrée: filteredOrders.filter((o) => o.status === 'Livrée').length,
    Annulée: filteredOrders.filter((o) => o.status === 'Annulée').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des commandes</h1>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm bg-white px-3 py-2 rounded-md shadow-sm">
            <Calendar size={16} className="text-gray-500" />
            <select
              className="bg-transparent text-gray-600 pr-8 focus:outline-none border-none"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as Period)}
            >
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PackageCheck size={16} className="mr-2" />
            Nouvelle commande
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total commandes" color="blue" value={filteredOrders.length} />
        <StatCard title="En attente" color="yellow" value={commandesParStatut.En_attente} />
        <StatCard title="Annulées" color="red" value={commandesParStatut.Annulée} />
        <StatCard title="Livrées" color="green" value={commandesParStatut.Livrée} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <StatusChart stats={{ commandesParStatut }} />
        <OrdersTable orders={filteredOrders} />
      </div>

      {showModal && (
        <CreateOrderModal
          onClose={() => setShowModal(false)}
          onOrderCreated={async () => {
            await fetchOrders();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

const StatCard = ({ title, color, value }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center md:items-start w-full">
      <div className="flex items-center justify-between w-full">
        <p className="text-gray-500 text-sm">{title}</p>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${color}-100`}>
          <span className={`text-${color}-600 font-medium`}>{value}</span>
        </div>
      </div>
    </div>
  );
};

export default Orders;

