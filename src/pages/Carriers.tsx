import React, { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import CarrierCard from '../components/CarrierCard';
import AddCarrierModal from '../components/AddCarrierModal';
import api from '../axiosConfig'; // ✅ Axios config
import socket from '../socket'; // ✅ Socket partagé global

interface Route {
  from: string;
  to: string;
}

interface Vehicle {
  type: string;
}

interface Transporter {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  password?: string;
  truckType: string;
  licensePlate?: string;
  truckCapacity?: number;
  isAvailable: boolean;
  currentorderId: string;
  lastActive?: string;
  latitude?: number;
  longitude?: number;
  routes?: Route[];
  vehicles?: Vehicle[];
  workDays?: string[];
  workHours?: {
    start: string;
    end: string;
  };
}

const Carriers: React.FC = () => {
  const [carriers, setCarriers] = useState<Transporter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTransporters = async () => {
    try {
      const response = await api.get('/transporters');
      const data = response.data;

      if (Array.isArray(data)) {
        setCarriers(data);
      } else {
        console.error('Erreur: les transporteurs reçus ne sont pas un tableau', data);
        setCarriers([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des transporteurs :', error);
      setCarriers([]);
    }
  };

  useEffect(() => {
    fetchTransporters();

    if (!socket) return;

    // ✅ Écoute des événements socket
    socket.on('transporterAdded', (newCarrier: Transporter) => {
      setCarriers((prev) => [newCarrier, ...prev]);
    });

    socket.on('transporterUpdated', (updated: Transporter) => {
      setCarriers((prev) =>
        prev.map((carrier) => (carrier._id === updated._id ? updated : carrier))
      );
    });

    socket.on('transporterDeleted', (deletedId: string) => {
      setCarriers((prev) => prev.filter((carrier) => carrier._id !== deletedId));
    });

    return () => {
      socket.off('transporterAdded');
      socket.off('transporterUpdated');
      socket.off('transporterDeleted');
    };
  }, []);

  const handleAvailabilityChange = (id: string, newStatus: boolean) => {
    setCarriers((prev) =>
      prev.map((carrier) =>
        carrier._id === id ? { ...carrier, isAvailable: newStatus } : carrier
      )
    );
  };

  const availableCarriers = carriers.filter((c) => c.isAvailable);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des transporteurs</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Truck size={18} className="mr-2" />
          Nouveau transporteur
        </button>
        <AddCarrierModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchTransporters}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total transporteurs" value={carriers.length} color="blue" />
        <StatCard title="Transporteurs actifs" value={availableCarriers.length} color="green" />
        <StatCard
          title="Transporteurs inactifs"
          value={carriers.length - availableCarriers.length}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carriers.map((carrier) => (
          <CarrierCard
            key={carrier._id}
            carrier={carrier}
            onAvailabilityChange={handleAvailabilityChange}
          />
        ))}
      </div>
    </div>
  );
};

export default Carriers;

// Helper StatCard
const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: 'blue' | 'green' | 'red';
}) => {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center md:flex-row md:justify-between">
      <div className="flex flex-col items-center md:items-start">
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className={`text-3xl font-bold ${colorMap[color].split(' ')[0]}`}>{value}</h2>
      </div>
      <div className={`w-12 h-12 ${colorMap[color].split(' ')[1]} rounded-full flex items-center justify-center mt-2 md:mt-0`}>
        <Truck size={24} className={colorMap[color].split(' ')[0]} />
      </div>
    </div>
  );
};
