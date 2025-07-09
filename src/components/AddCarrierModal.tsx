import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import api from '../axiosConfig';
import socket from '../socket';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddCarrierModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [truckCapacity, setTruckCapacity] = useState<number | ''>('');
  const [lastActive, setLastActive] = useState<string>('');
  const [routes, setRoutes] = useState([{ from: '', to: '' }]);
  const [workDays, setWorkDays] = useState<string[]>([]);
  const [workHours, setWorkHours] = useState('');
  const [vehicles, setVehicles] = useState(['']);
  const [isAvailable, setIsAvailable] = useState(true);

  const handleAddRoute = () => setRoutes([...routes, { from: '', to: '' }]);
  const handleRouteChange = (i: number, field: 'from' | 'to', value: string) => {
    const updated = [...routes];
    updated[i][field] = value;
    setRoutes(updated);
  };

  const toggleWorkDay = (day: string) => {
    setWorkDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleVehicleChange = (i: number, value: string) => {
    const updated = [...vehicles];
    updated[i] = value;
    setVehicles(updated);
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setPassword('');
    setLicensePlate('');
    setTruckCapacity('');
    setLastActive('');
    setIsAvailable(true);
    setRoutes([{ from: '', to: '' }]);
    setWorkDays([]);
    setWorkHours('');
    setVehicles(['']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const plateRegex = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{8,14}$/;

    if (!name.trim()) return alert('Le nom est requis.');
    if (!emailRegex.test(email)) return alert('Email invalide.');
    if (!phoneRegex.test(phone)) return alert('Téléphone invalide.');
    if (!plateRegex.test(licensePlate)) return alert('Plaque non conforme.');
    if (truckCapacity === '' || truckCapacity < 0) return alert('Capacité invalide.');
    if (!password || password.length < 6) return alert('Mot de passe requis (6 caractères min).');

    for (const route of routes) {
      if (!route.from.trim() || !route.to.trim()) {
        return alert("Tous les itinéraires doivent être remplis.");
      }
    }

    const selectedDate = new Date(lastActive);
    if (selectedDate > new Date()) return alert('La date ne peut pas être dans le futur.');

    const vehicleObjects = vehicles.filter(v => v.trim()).map(v => ({ type: v.trim() }));

    const formData = {
      name,
      phone,
      email,
      password,
      licensePlate,
      truckCapacity,
      lastActive,
      isAvailable,
      routes,
      workDays,
      workHours: {
        start: workHours.split(' - ')[0] || '',
        end: workHours.split(' - ')[1] || '',
      },
      vehicles: vehicleObjects,
    };

    try {
      const response = await api.post('/transporters', formData);

      if (response.status === 201 || response.status === 200) {
        const newCarrier = response.data;
        socket.emit('transporterAdded', newCarrier); // ✅ notification live
        if (onSuccess) onSuccess();
        resetForm();
        onClose();
      } else {
        alert('Erreur serveur : transporteur non ajouté');
      }
    } catch (err: any) {
      console.error('Erreur lors de la création :', err);
      alert(err?.response?.data?.error || 'Erreur serveur.');
    }
  };
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
        <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
            <X size={20} />
          </button>

          <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
            Ajouter un transporteur
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded" required />
            <input type="tel" placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border px-3 py-2 rounded" required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" required />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" required />
            <input type="text" placeholder="Plaque (AB-123-CD)" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value.toUpperCase())} className="w-full border px-3 py-2 rounded" required />
            <input type="number" placeholder="Capacité du camion (en tonnes)" value={truckCapacity} onChange={(e) => { const val = Number(e.target.value); if (val >= 0) setTruckCapacity(val);}} className="w-full border px-3 py-2 rounded" required min={0}/>
            <input type="datetime-local" value={lastActive} onChange={(e) => setLastActive(e.target.value)} className="w-full border px-3 py-2 rounded" required />

            <select value={isAvailable ? 'oui' : 'non'} onChange={(e) => setIsAvailable(e.target.value === 'oui')} className="w-full border px-3 py-2 rounded">
              <option value="oui">Disponible</option>
              <option value="non">Indisponible</option>
            </select>

            {/* Routes */}
            <div className="space-y-2">
              <label className="font-semibold">Itinéraires</label>
              {routes.map((route, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" placeholder="De" value={route.from} onChange={(e) => handleRouteChange(i, 'from', e.target.value)} className="w-full border px-3 py-2 rounded" required />
                  <input type="text" placeholder="À" value={route.to} onChange={(e) => handleRouteChange(i, 'to', e.target.value)} className="w-full border px-3 py-2 rounded" required />
                </div>
              ))}
              <button type="button" onClick={handleAddRoute} className="text-blue-600 text-sm">+ Ajouter un itinéraire</button>
            </div>

            {/* Work Days */}
            <div>
              <label className="font-semibold">Jours de travail</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(day => (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleWorkDay(day)}
                    className={`px-3 py-1 rounded-full border ${workDays.includes(day) ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Work Hours */}
            <div className="space-y-2">
              <label className="font-semibold">Horaires de travail</label>
              <div className="flex gap-2">
                <select value={workHours.split(' - ')[0] || ''} onChange={(e) => {
                  const end = workHours.split(' - ')[1] || '';
                  setWorkHours(`${e.target.value} - ${end}`);
                }} className="w-full border px-3 py-2 rounded" required>
                  <option value="">Heure début</option>
                  {Array.from({ length: 24 }, (_, i) => ['00', '15', '30', '45'].map(m => `${String(i).padStart(2, '0')}:${m}`)).flat().map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
                <select value={workHours.split(' - ')[1] || ''} onChange={(e) => {
                  const start = workHours.split(' - ')[0] || '';
                  setWorkHours(`${start} - ${e.target.value}`);
                }} className="w-full border px-3 py-2 rounded" required>
                  <option value="">Heure fin</option>
                  {Array.from({ length: 24 }, (_, i) => ['00', '15', '30', '45'].map(m => `${String(i).padStart(2, '0')}:${m}`)).flat().map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Vehicles */}
          <div className="space-y-2">
  <label className="font-semibold">Types de véhicules</label>
  {vehicles.map((v, i) => (
    <select
      key={i}
      value={v}
      onChange={(e) => handleVehicleChange(i, e.target.value)}
      className="w-full border px-3 py-2 rounded"
      required
    >
      <option value="">-- Sélectionnez un type --</option>
      <option value="Tautliner">Tautliner</option>
      <option value="Frigorifique">Camion Frigorifique</option>
      <option value="Benne">Camion Benne</option>
      <option value="Citerne">Camion Citerne</option>
      <option value="Savoyarde">Savoyarde</option>
      <option value="Porte-conteneur">Porte-conteneur</option>
      <option value="Plateau">Camion Plateau</option>
      <option value="Fourgon">Fourgon</option>
    </select>
  ))}
  <button
    type="button"
    onClick={() => setVehicles([...vehicles, ''])}
    className="text-blue-600 text-sm"
  >
    + Ajouter un véhicule
  </button>
</div>


            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default AddCarrierModal;
