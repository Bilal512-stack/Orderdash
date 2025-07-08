import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DashboardStats } from '../types';

interface StatusChartProps {
  stats?: DashboardStats | null;
  darkMode: boolean;
}

const StatusChart: React.FC<StatusChartProps> = ({ stats, darkMode }) => {
  if (!stats || !stats.commandesParStatut) {
    return <div className="text-center p-6">Chargement des statistiques...</div>;
  }

  const { commandesParStatut } = stats;
  console.log('📊 Statut des commandes:', stats.commandesParStatut);
  const total = Object.values(commandesParStatut).reduce((acc, value) => acc + value, 0);

  const statusColors: { [key: string]: string } = {
    'En attente': '#EFD75ED4', // Jaune
    'Assignée': '#3B82F6', // Bleu
    'En cours': '#8B5CF6', // Violet
    'Livrée': '#10B981', // Vert
    'Annulée': '#EF4444', // Rouge
  };

  const data = Object.entries(commandesParStatut)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: key, // le nom affiché tel quel
      value,
      rawKey: key,
    }));

  if (total === 0) {
    return <div className="text-center p-6">Aucune donnée disponible pour cette période.</div>;
  }

  return (
    <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <h3 className="text-lg font-semibold text-center mb-6">Répartition des Commandes</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={statusColors[entry.rawKey] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1F2937' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusChart;

