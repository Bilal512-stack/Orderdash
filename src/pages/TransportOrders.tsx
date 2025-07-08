import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { OTDownloadButton } from '../components/OTDocument';

interface Order {
  pickup: {
    senderName: string;
    senderAddress: string;
    senderPhone: string;
  };
  delivery: {
    recipientName: string;
    recipientAddress: string;
    recipientPhone: string;
  };
  nature: string;
  weight: number;
  volume?: number | null;
  truckType?: string;
  montant?: number;
}

export default function TransportOrders() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [agreedPrice, setAgreedPrice] = useState('');
  const [shippingDate, setShippingDate] = useState('');
  const [loadingDate, setLoadingDate] = useState('');
  const [loadingHour, setLoadingHour] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryHour, setDeliveryHour] = useState('');
  const [transportType, setTransportType] = useState('');
  const [commitments, setCommitments] = useState('');
  const [paymentConditions, setPaymentConditions] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  interface GeneratedOT {
    orderId: string | undefined;
    createdAt: string;
    sender: {
      name: string;
      address: string;
      phone: string;
    };
    recipient: {
      name: string;
      address: string;
      phone: string;
    };
    nature: string;
    weight: number;
    volume: number | null;
    transportMode: string;
    route: {
      from: string;
      to: string;
    };
    estimatedByClient: number;
    agreedPrice: number;
    shippingDate: string;
    loadingDate: string;
    loadingHour: string;
    deliveryDate: string;
    deliveryHour: string;
    commitments: string;
    paymentConditions: string;
    notes: string;
  }

  const [generatedOT, setGeneratedOT] = useState<GeneratedOT | null>(null);

  // 🔗 Chargement de la commande depuis le backend
  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const token = localStorage.getItem('token');
          console.log('🔑 Token utilisé:', token);

          const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
            headers: { Authorization: token ? `Bearer ${token}` : '' }
          });

          console.log('📦 Commande récupérée:', response.data);
          setOrder(response.data);
        } catch (error) {
          console.error('❌ Erreur lors du chargement de la commande:', error);
        }
      };

      fetchOrder();
    }
  }, [orderId]);

  // 🔗 Création de l'Ordre de Transport
  const handleSubmit = async () => {
    if (!order || !agreedPrice || !shippingDate) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const otData: GeneratedOT = {
        orderId,
        createdAt: new Date().toLocaleDateString('fr-FR'),
        sender: {
          name: order.pickup.senderName,
          address: order.pickup.senderAddress,
          phone: order.pickup.senderPhone
        },
        recipient: {
          name: order.delivery.recipientName,
          address: order.delivery.recipientAddress,
          phone: order.delivery.recipientPhone
        },
        nature: order.nature,
        weight: order.weight,
        volume: order.volume || null,
        transportMode: order.truckType || transportType || 'Routier',
        route: {
          from: order.pickup.senderAddress,
          to: order.delivery.recipientAddress
        },
        estimatedByClient: order.montant || 0,
        agreedPrice: Number(agreedPrice),
        shippingDate,
        loadingDate,
        loadingHour,
        deliveryDate,
        deliveryHour,
        commitments,
        paymentConditions,
        notes
      };

      console.log('📄 Données OT à envoyer:', otData);

      await axios.post('http://localhost:5000/api/transport-orders', otData, {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });

      alert('Ordre de Transport créé avec succès.');
      setGeneratedOT(otData);
    } catch (err) {
      console.error('❌ Erreur lors de la création de l\'OT:', err);
      alert("Erreur lors de la création de l'OT.");
    } finally {
      setLoading(false);
    }
  };

  if (!orderId) return <p className="text-center mt-10">Aucun ID de commande fourni.</p>;
  if (!order) return <p className="text-center mt-10">Chargement de la commande...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ordre de Transport – Commande #{orderId}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Prix négocié (FCFA)</label>
          <input type="number" value={agreedPrice} onChange={e => setAgreedPrice(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="text-sm font-medium">Date d'expédition</label>
          <input type="date" value={shippingDate} onChange={e => setShippingDate(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="text-sm font-medium">Date de chargement</label>
          <input type="date" value={loadingDate} onChange={e => setLoadingDate(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="text-sm font-medium">Heure de chargement</label>
          <input type="time" value={loadingHour} onChange={e => setLoadingHour(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="text-sm font-medium">Date de livraison</label>
          <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="text-sm font-medium">Heure de livraison</label>
          <input type="time" value={deliveryHour} onChange={e => setDeliveryHour(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Type de transport (Savoyarde, Tautliner...)</label>
        <input type="text" value={transportType} onChange={e => setTransportType(e.target.value)} className="w-full border px-3 py-2 rounded" />
      </div>

      <div>
        <label className="text-sm font-medium">Engagements du transporteur</label>
        <textarea value={commitments} onChange={e => setCommitments(e.target.value)} rows={4} className="w-full border px-3 py-2 rounded" placeholder="Respect des horaires, propreté, sécurité..."></textarea>
      </div>

      <div>
        <label className="text-sm font-medium">Conditions de paiement</label>
        <input type="text" value={paymentConditions} onChange={e => setPaymentConditions(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="60 jours fin de mois, etc." />
      </div>

      <div>
        <label className="text-sm font-medium">Notes / Conditions spéciales</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full border px-3 py-2 rounded"></textarea>
      </div>

      <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        {loading ? 'Création en cours...' : "Valider l'ordre de transport"}
      </button>

      {generatedOT && <OTDownloadButton data={generatedOT} />}
    </div>
  );
}
