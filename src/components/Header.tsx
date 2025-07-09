import React, { useEffect, useRef, useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import socket from '../socket'; // ✅ Socket partagé

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface OrderNotification {
  id: string;
  senderName: string;
  recipientAddress: string;
  status: string;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Écoute socket.io pour recevoir les notifications
  useEffect(() => {
    if (!socket) return;

    socket.on('newOrderNotification', (notif: OrderNotification) => {
      console.log('🔔 Nouvelle notification reçue:', notif);
      setNotifications((prev) => [notif, ...prev]);
      setNotificationCount((prev) => prev + 1);
    });

    return () => {
      socket.off('newOrderNotification');
    };
  }, []);

  // ✅ Fermer dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Clic sur cloche → toggle + reset compteur
  const handleBellClick = () => {
    setOpen(!open);
    setNotificationCount(0);
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1 mr-4 rounded-md -ml-1 md:hidden hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">Gestion des Commandes</h1>
      </div>

      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={handleBellClick}
            className="p-1 rounded-full hover:bg-gray-100 relative"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                {notificationCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              <div className="p-3 font-semibold border-b">Notifications</div>
              {notifications.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">Aucune nouvelle notification</div>
              ) : (
                <ul>
                  {notifications.map((notif) => (
                    <li key={notif.id} className="p-3 border-b text-sm hover:bg-gray-50">
                      📦 Nouvelle commande de <strong>{notif.senderName}</strong> vers{' '}
                      <strong>{notif.recipientAddress}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
