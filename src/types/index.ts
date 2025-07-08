import axios from 'axios';

// Types

export interface OTData {
  orderId: string;
  createdAt: string;
  sender: { name: string; address: string; phone: string };
  nature: string;
  transportMode: string;
  agreedPrice: number;
  loadingDate: string;
  loadingHour: string;
  route: { from: string; to: string };
  deliveryDate: string;
  deliveryHour: string;
  volume?: string;
  weight: string;
  commitments?: string;
  paymentConditions?: string;
  notes?: string;
}

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  dateInscription: string;
  derniereCommande: string | null;
  role: 'client' | 'admin';
  commandes: number;
  status: 'actif' | 'inactif';
}

export interface Order {
  _id: string;
  clientId: string;
  createdAt: string;
  montant: number;
  status: 'En_attente' | 'Assignée' | 'En_cours' | 'Livrée' | 'Annulée';

  pickup: {
    address: string;
    time: string;
  };

  delivery: {
    address: string;
    time: string;
  };

  transporterId?: string | null;
  transporterName?: string;

  weight: number;
  distance: number;
  nature: string;
  truckType: string;

  senderName?: string;
  senderPhone?: string;
  recipientName?: string;
  recipientPhone?: string;
}

export interface OrderProduct {
  id: number;
  nom: string;
  quantite: number;
  prix: number;
}

export interface Transporter {
  _id: string;
  name: string;
  phone: number;
  email?: string;
  truckType: string;
  licensePlate?: string;
  truckCapacity?: number;
  isAvailable: boolean;
  currentorderId: string;
  lastActive?: string;
  latitude?: number;
  longitude?: number;
}

export interface DashboardStats {
  ventes: {
    total: number;
    pourcentage: number;
    periode: string;
  };
  commandes: {
    total: number;
    pourcentage: number;
    periode: string;
  };
  clients: {
    total: number;
    nouveaux: number;
    pourcentage: number;
    periode: string;
  };
  commandesParStatut: {
    en_attente: number;
    en_preparation: number;
    expediee: number;
    livree: number;
    annulee: number;
  };
}

// Interface pour le formulaire d'ajout utilisateur
interface NewUserInput {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  adresse: string;
  statut?: 'actif' | 'inactif';
  role?: 'client' | 'admin';
}

// Fonction pour ajouter un utilisateur via le backend Express
export const addUser = async (userData: NewUserInput) => {
  try {
    const token = localStorage.getItem('token'); // Authentification

    const newUser = {
      ...userData,
      status: userData.statut || 'actif',
      role: userData.role || 'client',
      commandes: 0,
      dateInscription: new Date().toISOString(),
    };

    const response = await axios.post('http://localhost:5000/api/users', newUser, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Utilisateur ajouté avec ID:', response.data.userId);
    return response.data.userId;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un utilisateur :", error);
    throw error;
  }
};
