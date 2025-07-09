import React, { useEffect, useState } from 'react';
import { ShoppingCart, CreditCard, Users, Calendar, Package } from 'lucide-react';
import StatCard from '../components/StatCard';
import StatusChart from '../components/StatusChart';
import OrdersTable from '../components/OrdersTable';
import api from '../axiosConfig';
import socket from '../socket';

interface Stats {
  ventes: { total: number; pourcentage: number; periode: string };
  commandes: { total: number; pourcentage: number; periode: string };
  clients: { total: number; pourcentage: number; periode: string };
  commandesParStatut: { [statut: string]: number };
}

interface Order {
  id: string;
  senderName: string;
  recipientName: string;
  date: string;
  status: string;
  montant: number;
  pickup?: {
    senderName?: string;
  };
  delivery?: {
    recipientName?: string;
  };
  createdAt?: string;
  _id?: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get<Stats>('/stats'),
        api.get<Order[]>('/orders'),
      ]);

      setStats(statsRes.data);
      setOrders(
        ordersRes.data
          .map((order) => ({
            id: order._id ?? 'id-inconnu',
            senderName: order.pickup?.senderName || 'Expéditeur inconnu',
            recipientName: order.delivery?.recipientName || 'Destinataire inconnu',
            date: order.createdAt || new Date().toISOString(),
            status: order.status || 'En attente',
            montant: order.montant || 0,
          }))
          .reverse()
      );
      setError(null);
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
      setError('Erreur lors du chargement du dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    if (!socket) return;

    socket.on('connect', () => {
      console.log('✅ Socket connecté :', socket.id);
    });

    socket.on('newOrderNotification', () => {
      console.log('📦 Nouvelle commande reçue');
      fetchDashboardData();
    });

    socket.on('orderUpdated', () => {
      console.log('✏️ Commande mise à jour');
      fetchDashboardData();
    });

    socket.on('orderDeleted', () => {
      console.log('🗑️ Commande supprimée');
      fetchDashboardData();
    });

    return () => {
      socket.off('newOrderNotification');
      socket.off('orderUpdated');
      socket.off('orderDeleted');
    };
  }, []);

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!stats) return <div className="p-4 text-red-600">Impossible de charger les statistiques.</div>;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <div className="flex items-center space-x-2 text-sm">
          <Calendar size={16} className="text-gray-500" />
          <span className="text-gray-500">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Ventes totales"
          value={`${stats.ventes.total.toLocaleString('fr-FR')} €`}
          icon={<CreditCard size={24} />}
          change={stats.ventes.pourcentage}
          period={stats.ventes.periode}
          textColor="text-green-600"
        />
        <StatCard
          title="Commandes"
          value={stats.commandes.total}
          icon={<ShoppingCart size={24} />}
          change={stats.commandes.pourcentage}
          period={stats.commandes.periode}
          textColor="text-blue-600"
        />
        <StatCard
          title="Clients"
          value={stats.clients.total}
          icon={<Users size={24} />}
          change={stats.clients.pourcentage}
          period={stats.clients.periode}
          textColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StatusChart stats={stats} darkMode={false} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Activité récente</h3>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-start">
                  <div className="flex-shrink-0 rounded-full bg-green-100 p-2">
                    <Package size={16} className="text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">
                      Commande de {order.senderName} vers {order.recipientName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Aucune activité récente.</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <OrdersTable orders={orders} refreshDashboard={fetchDashboardData} />
      </div>
    </div>
  );
};

export default Dashboard;
