import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: number;
  period: string;
  bgColor?: string;
  textColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  period,
  bgColor = 'bg-white',
  textColor = 'text-blue-600',
}) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className={`${bgColor} rounded-xl shadow-sm p-6 transition-transform duration-300 hover:shadow-md hover:-translate-y-1`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${textColor} bg-opacity-10`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span
          className={`flex items-center text-sm font-medium ${
            isPositive ? 'text-green-600' : isNeutral ? 'text-gray-500' : 'text-red-600'
          }`}
        >
          {isPositive && <ArrowUp size={16} className="mr-1" aria-label="Hausse" />}
          {!isPositive && !isNeutral && <ArrowDown size={16} className="mr-1" aria-label="Baisse" />}
          {Math.abs(change)}%
        </span>
        <span className="text-gray-500 text-sm ml-2">{period}</span>
      </div>
    </div>
  );
};

export default StatCard;
