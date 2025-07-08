import { User, Order, Carrier, DashboardStats } from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    telephone: '06 12 34 56 78',
    adresse: '15 rue de Paris',
    ville: 'Lyon',
    dateInscription: '2023-05-12',
    derniereCommande: '2023-10-05',
    role: 'client',
    commandes: 12,
    statut: 'actif'
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@example.com',
    telephone: '07 98 76 54 32',
    adresse: '8 avenue Victor Hugo',
    ville: 'Paris',
    dateInscription: '2023-06-24',
    derniereCommande: '2023-10-15',
    role: 'client',
    commandes: 8,
    statut: 'actif'
  },
  {
    id: 3,
    nom: 'Bernard',
    prenom: 'Philippe',
    email: 'philippe.bernard@example.com',
    telephone: '06 45 12 78 90',
    adresse: '23 boulevard Gambetta',
    ville: 'Marseille',
    dateInscription: '2023-04-18',
    derniereCommande: null,
    role: 'client',
    commandes: 3,
    statut: 'inactif'
  },
  {
    id: 4,
    nom: 'Petit',
    prenom: 'Marie',
    email: 'marie.petit@example.com',
    telephone: '07 23 45 67 89',
    adresse: '45 rue de la République',
    ville: 'Bordeaux',
    dateInscription: '2023-07-30',
    derniereCommande: '2023-10-12',
    role: 'client',
    commandes: 5,
    statut: 'actif'
  },
  {
    id: 5,
    nom: 'Robert',
    prenom: 'Luc',
    email: 'luc.robert@example.com',
    telephone: '06 78 90 12 34',
    adresse: '12 place de la Mairie',
    ville: 'Nantes',
    dateInscription: '2023-03-14',
    derniereCommande: '2023-09-28',
    role: 'admin',
    commandes: 0,
    statut: 'actif'
  }
];

export const mockOrders: Order[] = [
  {
    id: 1,
    numero: 'CMD-2023-10001',
    client: {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean'
    },
    date: '2023-10-15',
    montant: 120.50,
    statut: 'livree',
    transporteur: 'Chronopost',
    adresseLivraison: '15 rue de Paris, 69000 Lyon',
    produits: [
      { id: 1, nom: 'Chaise de bureau', quantite: 1, prix: 89.90 },
      { id: 2, nom: 'Lampe de bureau', quantite: 1, prix: 30.60 }
    ]
  },
  {
    id: 2,
    numero: 'CMD-2023-10002',
    client: {
      id: 2,
      nom: 'Martin',
      prenom: 'Sophie'
    },
    date: '2023-10-15',
    montant: 215.80,
    statut: 'en_preparation',
    transporteur: 'Colissimo',
    adresseLivraison: '8 avenue Victor Hugo, 75016 Paris',
    produits: [
      { id: 3, nom: 'Table basse', quantite: 1, prix: 149.90 },
      { id: 4, nom: 'Vase décoratif', quantite: 2, prix: 32.95 }
    ]
  },
  {
    id: 3,
    numero: 'CMD-2023-10003',
    client: {
      id: 4,
      nom: 'Petit',
      prenom: 'Marie'
    },
    date: '2023-10-12',
    montant: 65.30,
    statut: 'expediée',
    transporteur: 'DPD',
    adresseLivraison: '45 rue de la République, 33000 Bordeaux',
    produits: [
      { id: 5, nom: 'Coussin décoratif', quantite: 3, prix: 21.75 }
    ]
  },
  {
    id: 4,
    numero: 'CMD-2023-10004',
    client: {
      id: 3,
      nom: 'Bernard',
      prenom: 'Philippe'
    },
    date: '2023-09-29',
    montant: 320.00,
    statut: 'annulee',
    transporteur: 'Chronopost',
    adresseLivraison: '23 boulevard Gambetta, 13001 Marseille',
    produits: [
      { id: 6, nom: 'Canapé 2 places', quantite: 1, prix: 320.00 }
    ]
  },
  {
    id: 5,
    numero: 'CMD-2023-10005',
    client: {
      id: 2,
      nom: 'Martin',
      prenom: 'Sophie'
    },
    date: '2023-10-16',
    montant: 78.45,
    statut: 'en_attente',
    transporteur: 'Non assigné',
    adresseLivraison: '8 avenue Victor Hugo, 75016 Paris',
    produits: [
      { id: 7, nom: 'Étagère murale', quantite: 1, prix: 45.50 },
      { id: 8, nom: 'Cadre photo', quantite: 2, prix: 16.45 }
    ]
  }
];

export const mockCarriers: Carrier[] = [
  {
    id: 1,
    nom: 'Chronopost',
    logo: 'https://images.pexels.com/photos/5025504/pexels-photo-5025504.jpeg?auto=compress&cs=tinysrgb&w=100',
    delaiLivraison: '24h',
    tarif: 12.50,
    disponible: true,
    note: 4.2,
    commandesLivrees: 358
  },
  {
    id: 2,
    nom: 'Colissimo',
    logo: 'https://images.pexels.com/photos/6169056/pexels-photo-6169056.jpeg?auto=compress&cs=tinysrgb&w=100',
    delaiLivraison: '48h-72h',
    tarif: 7.90,
    disponible: true,
    note: 3.8,
    commandesLivrees: 421
  },
  {
    id: 3,
    nom: 'DPD',
    logo: 'https://images.pexels.com/photos/4498162/pexels-photo-4498162.jpeg?auto=compress&cs=tinysrgb&w=100',
    delaiLivraison: '24h-48h',
    tarif: 9.90,
    disponible: true,
    note: 4.0,
    commandesLivrees: 287
  },
  {
    id: 4,
    nom: 'UPS',
    logo: 'https://images.pexels.com/photos/4391481/pexels-photo-4391481.jpeg?auto=compress&cs=tinysrgb&w=100',
    delaiLivraison: '48h',
    tarif: 11.50,
    disponible: false,
    note: 4.5,
    commandesLivrees: 156
  },
  {
    id: 5,
    nom: 'GLS',
    logo: 'https://images.pexels.com/photos/7203694/pexels-photo-7203694.jpeg?auto=compress&cs=tinysrgb&w=100',
    delaiLivraison: '48h-72h',
    tarif: 8.90,
    disponible: true,
    note: 3.7,
    commandesLivrees: 194
  }
];

export const mockDashboardStats: DashboardStats = {
  ventes: {
    total: 15680.25,
    pourcentage: 12.5,
    periode: 'ce mois'
  },
  commandes: {
    total: 124,
    pourcentage: 8.2,
    periode: 'ce mois'
  },
  clients: {
    total: 256,
    nouveaux: 18,
    pourcentage: 5.7,
    periode: 'ce mois'
  },
  commandesParStatut: {
    en_attente: 15,
    en_preparation: 32,
    expediee: 48,
    livree: 86,
    annulee: 8
  }
};