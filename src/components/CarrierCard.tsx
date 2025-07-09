import React, { useState } from 'react';
import { Phone, Mail, Truck, Clock, BadgeCheck, GaugeCircle, MapPin, Package } from 'lucide-react';
import api from '../axiosConfig';
import socket from '../socket';

interface Route {
  from: string;
  to: string;
}

interface Vehicle {
  type: string;
}

interface Carrier {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  licensePlate?: string;
  truckCapacity?: number;
  isAvailable: boolean;
  currentorderId: string;
  lastActive?: string;
  routes?: Route[];
  vehicles?: Vehicle[];
}

interface Props {
  carrier: Carrier;
  onAvailabilityChange: (id: string, newStatus: boolean) => void;
}

const CarrierCard: React.FC<Props> = ({ carrier, onAvailabilityChange }) => {
  const [isAvailable, setIsAvailable] = useState(carrier.isAvailable);
  const [loading, setLoading] = useState(false);

  const handleToggleAvailability = async () => {
    setLoading(true);
    try {
      const res = await api.patch(`/transporters/${carrier._id}/availability`, {
        isAvailable: !isAvailable,
      });

      const newStatus = res.data.transporter.isAvailable;
      setIsAvailable(newStatus);
      onAvailabilityChange(carrier._id, newStatus);

      // ✅ Notifie seulement le dashboard admin et le transporteur concerné
      socket.emit('transporterAvailabilityChanged', {
        transporterId: carrier._id,
        isAvailable: newStatus,
      });

    } catch (error) {
      console.error('❌ Erreur mise à jour dispo :', error);
      alert("Erreur lors de la mise à jour de la disponibilité.");
    } finally {
      setLoading(false);
    }
  };

  if (!carrier) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300 p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xl font-bold">
            {carrier.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{carrier.name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Phone size={14} /> {carrier.phone}
            </p>
            {carrier.email && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Mail size={14} /> {carrier.email}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-sm font-semibold ${
              isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {isAvailable ? 'Disponible' : 'Indisponible'}
          </span>
          <button
            onClick={handleToggleAvailability}
            disabled={loading}
            aria-label={isAvailable ? 'Rendre indisponible' : 'Rendre disponible'}
            className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
              isAvailable ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isAvailable ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
        {/* Véhicules (liste) */}
              {carrier.vehicles && carrier.vehicles.length > 0 && (
          <div className="flex flex-col gap-1">
            <span>
              <strong>Véhicules :</strong>
            </span>
            <ul className="list-disc list-inside">
              {carrier.vehicles.map((v, i) => (
                <li key={i}>{v.type}</li>
              ))}
            </ul>
          </div>
        )}


                {/* Camion / truckType fallback */}
        {!carrier.vehicles && (
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-blue-600" />
            <span>
              <strong>Camion :</strong> {carrier.vehicles}
            </span>
          </div>
        )}

        {carrier.licensePlate && (
          <div className="flex items-center gap-2">
            <BadgeCheck size={16} className="text-blue-600" />
            <span>
              <strong>Plaque :</strong> {carrier.licensePlate}
            </span>
          </div>
        )}
                {/* Itinéraires */}
        {carrier.routes && carrier.routes.length > 0 && (
          <div className="col-span-1 sm:col-span-2">
            <strong>Itinéraires :</strong>
            <ul className="list-disc list-inside mt-1 text-gray-600">
              {carrier.routes.map((route, i) => (
                <li key={i}>
                  <MapPin size={14} className="inline mr-1 text-blue-500" />
                  {route.from} &rarr; {route.to}
                </li>
              ))}
            </ul>
          </div>
        )}

        {carrier.truckCapacity !== undefined && (
          <div className="flex items-center gap-2">
            <GaugeCircle size={16} className="text-blue-600" />
            <span>
              <strong>Capacité :</strong> {carrier.truckCapacity} tonnes
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
  <Package size={16} className="text-blue-600" />
  <span>
    <strong>Commande actuelle :</strong>{' '}
    {carrier.currentorderId ? carrier.currentorderId : 'Aucune'}
  </span>
</div>


        {carrier.lastActive && (
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            <span>
              <strong>Dernière activité :</strong>{' '}
              {new Date(carrier.lastActive).toLocaleString('fr-FR')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarrierCard;
