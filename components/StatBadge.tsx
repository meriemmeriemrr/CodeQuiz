
import React from 'react';

interface StatBadgeProps {
  icon: string;
  value: string | number;
  label: string;
  colorClass: string;
}

const StatBadge: React.FC<StatBadgeProps> = ({ icon, value, label, colorClass }) => {
  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-800 border border-slate-700 shadow-lg`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass} text-white text-lg`}>
        <i className={icon}></i>
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatBadge;
