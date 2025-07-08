import React, { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import CarrierCard from '../components/CarrierCard';
import AddCarrierModal from '../components/AddCarrierModal';

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
  password?: string; // ✅ pour AddCarrierModal (non affiché)
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
      const response = await fetch('http://localhost:5000/api/transporters');
      const data = await response.json();

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
  }, []);

  const handleAvailabilityChange = (id: string, newStatus: boolean) => {
    setCarriers(prev =>
      prev.map(carrier =>
        carrier._id === id ? { ...carrier, isAvailable: newStatus } : carrier
      )
    );
  };

  const availableCarriers = carriers.filter(c => c.isAvailable);

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
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-gray-500 text-sm">Total transporteurs</p>
            <h2 className="text-3xl font-bold text-gray-800">{carriers.length}</h2>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mt-2 md:mt-0">
            <Truck size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-gray-500 text-sm">Transporteurs actifs</p>
            <h2 className="text-3xl font-bold text-green-600">{availableCarriers.length}</h2>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mt-2 md:mt-0">
            <Truck size={24} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-gray-500 text-sm">Transporteurs inactifs</p>
            <h2 className="text-3xl font-bold text-red-600">{carriers.length - availableCarriers.length}</h2>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mt-2 md:mt-0">
            <Truck size={24} className="text-red-600" />
          </div>
        </div>
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
