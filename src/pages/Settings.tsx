import React from 'react';
import { Settings as SettingsIcon, Lock, Bell, CreditCard, Globe, HelpCircle } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Paramètres généraux</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configurez les paramètres généraux de votre application
          </p>
        </div>
        
        <div className="p-6">
          <ul className="divide-y divide-gray-200">
            <li className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <SettingsIcon size={20} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-800">Paramètres généraux</h3>
                  <p className="text-xs text-gray-500 mt-1">Gérez les paramètres de base de votre boutique</p>
                </div>
              </div>
              <div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Modifier
                </button>
              </div>
            </li>
            
            <li className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lock size={20} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-800">Sécurité</h3>
                  <p className="text-xs text-gray-500 mt-1">Gérez les paramètres de sécurité et d'authentification</p>
                </div>
              </div>
              <div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Modifier
                </button>
              </div>
            </li>
            
            <li className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell size={20} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-800">Notifications</h3>
                  <p className="text-xs text-gray-500 mt-1">Gérez les paramètres de notification</p>
                </div>
              </div>
              <div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Modifier
                </button>
              </div>
            </li>
            
            <li className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard size={20} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-800">Paiements</h3>
                  <p className="text-xs text-gray-500 mt-1">Gérez les méthodes de paiement</p>
                </div>
              </div>
              <div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Modifier
                </button>
              </div>
            </li>
            
            <li className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe size={20} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-800">Internationalisation</h3>
                  <p className="text-xs text-gray-500 mt-1">Gérez les paramètres régionaux et les devises</p>
                </div>
              </div>
              <div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Modifier
                </button>
              </div>
            </li>
            
            <li className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <HelpCircle size={20} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-800">Support</h3>
                  <p className="text-xs text-gray-500 mt-1">Obtenir de l'aide et consulter la documentation</p>
                </div>
              </div>
              <div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Afficher
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;