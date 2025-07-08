import React from 'react';

interface OrderStatusTagProps {
  status: string;  // string plus souple pour éviter des erreurs TS
}

const OrderStatusTag: React.FC<OrderStatusTagProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'en attente':
        return {
          label: 'En attente',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
        };
      case 'assignée':
        return {
          label: 'Assignée',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
        };
      case 'en cours':
        return {
          label: 'En cours',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
        };
      case 'livrée':
        return {
          label: 'Livrée',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
        };
      default:
        return {
          label: 'Inconnu',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
        };
    }
  };

  const { label, bgColor, textColor } = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

export default OrderStatusTag;
