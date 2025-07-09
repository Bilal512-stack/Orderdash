import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import socket from '../socket';

interface OrderSummary {
  id: string;
  senderName: string;
  recipientName: string;
  status?: string;
}

export default function OrdersList() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/orders', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      const ordersData = response.data.map((order: any) => ({
        id: order._id || order.id,
        senderName: order.pickup?.senderName || 'Expéditeur inconnu',
        recipientName: order.delivery?.recipientName || 'Destinataire inconnu',
        status: order.status,
      }));

      setOrders(ordersData);
    } catch (error) {
      console.error('Erreur récupération des commandes:', error);
    }
  };

  useEffect(() => {
    fetchOrders();

    // ⏺️ Mise à jour temps réel via socket.io
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

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Commandes disponibles</h1>
      <ul className="space-y-3">
        {orders.map((order) => (
          <li
            key={order.id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/TransportOrders/${order.id}`)}
          >
            <div className="font-semibold text-blue-700">
              {order.senderName} → {order.recipientName}
            </div>
            <div className="text-sm text-gray-600">ID : {order.id}</div>
            {order.status && (
              <div className="text-xs text-gray-500 italic">Statut : {order.status}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
