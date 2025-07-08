import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  PackageCheck,
  Truck,
  Settings,
  X,
  Command
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { name: 'Tableau de bord', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Utilisateurs', icon: <Users size={20} />, path: '/Users' },
    { name: 'Commandes', icon: <PackageCheck size={20} />, path: '/Orders' },
    { name: 'Transporteurs', icon: <Truck size={20} />, path: '/Carriers' },
    { name: 'Ordres de Transport', icon: <Command size={20} />, path: '/TransportOrders' },
        { name: 'Paramètres', icon: <Settings size={20} />, path: '/Settings' },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform md:translate-x-0 md:static md:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <PackageCheck className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">OrderDash</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md md:hidden hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'hover:bg-gray-100'
                    }`
                  }
                >
                  <span className="mr-3 text-blue-600">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;