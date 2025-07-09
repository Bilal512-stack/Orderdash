import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Carriers from './pages/Carriers';
import Settings from './pages/Settings';
import TransportOrders from './pages/TransportOrders';
import OrdersList from './pages/OrderList';
import AdminLogin from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css'; // Ou le nom de ton fichier CSS Tailwind


function App() {
  return (
    <Router>
      <Routes>
        {/* Route publique (login) */}
        <Route path="/login" element={<AdminLogin />} />
        {/* Routes protégées */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          <Route path="carriers" element={<Carriers />} />
          <Route path="TransportOrders" element={<OrdersList />} />
          <Route path="TransportOrders/:orderId" element={<TransportOrders />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
