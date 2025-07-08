import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';


interface Props {
isOpen: boolean;
onClose: () => void;
order: {
    _id: string;
    senderAddress: string;
    recipientAddress: string;
    // Ajoute d'autres propriétés si nécessaire
};
onAssigned?: () => void;
}

const AssignTransporterModal: React.FC<Props> = ({ isOpen, onClose, order, onAssigned }) => {
interface Transporter {
_id: string;
name: string;
phone: string;
isAvailable: boolean;
routes?: { from: string; to: string }[];
}

const [transporters, setTransporters] = useState<Transporter[]>([]);
const [loading, setLoading] = useState(false);

  // Filtrer les transporteurs compatibles
useEffect(() => {
    const fetchTransporters = async () => {
    const res = await fetch('http://localhost:5000/api/transporters');
    const data = await res.json();

    const compatibles = (data as Transporter[]).filter((t: Transporter) =>
        t.isAvailable &&
        t.routes?.some((r: { from: string; to: string }) =>
        r.from.toLowerCase() === order.senderAddress.toLowerCase() &&
        r.to.toLowerCase() === order.recipientAddress.toLowerCase()
        )
    );

    setTransporters(compatibles);
    };

    if (isOpen) fetchTransporters();
}, [isOpen, order]);

const handleAssign = async (transporterId: string) => {
  try {
    setLoading(true);
    const res = await fetch(`http://localhost:5000/api/assign-order/${order._id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transporterId }),
    });

    if (!res.ok) throw new Error('Erreur lors de l’assignation');
    if (onAssigned) onAssigned();
    onClose();
  } catch (err) {
    console.error(err);
    alert('Échec de l’assignation');
  } finally {
    setLoading(false);
  }
};


return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
            <X size={20} />
        </button>
        <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
            Assigner un transporteur
        </Dialog.Title>

        {transporters.length === 0 ? (
            <p className="text-gray-500">Aucun transporteur disponible pour cet itinéraire.</p>
        ) : (
            <ul className="space-y-3">
            {transporters.map((t) => (
                <li key={t._id} className="flex items-center justify-between border p-3 rounded">
                <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-sm text-gray-600">Tel: {t.phone}</p>
                </div>
                <button
                    onClick={() => handleAssign(t._id)}
                    disabled={loading}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                    Assigner
                </button>
                </li>
            ))}
            </ul>
        )}
        </div>
    </div>
    </Dialog>
);
};

export default AssignTransporterModal;
