import LoginForm from '../components/LoginForm';

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Bienvenue sur OrderDash</h1>
        <p className="text-center text-gray-600 mb-6">Connectez-vous pour accéder à votre espace administrateur</p>
        <LoginForm />
      </div>
    </div>
  );
}
