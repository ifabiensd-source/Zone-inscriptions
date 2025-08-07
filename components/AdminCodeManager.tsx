import React from 'react';
import ShieldCheckIcon from './icons/ShieldCheckIcon';

interface AdminCodeManagerProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  onUpdate: () => void;
}

const AdminCodeManager: React.FC<AdminCodeManagerProps> = ({ code, onCodeChange, onUpdate }) => {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onUpdate();
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-success/30 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
        <ShieldCheckIcon className="w-6 h-6 text-success" />
        Gérer le Code d'Accès
      </h2>
      <p className="text-sm text-text-muted mb-4">Ce code est requis pour que les services puissent accéder à l'application.</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Code d'accès service"
          className="flex-grow bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-success focus:outline-none min-w-0"
        />
        <button
          onClick={onUpdate}
          className="bg-success hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 flex-shrink-0"
        >
          Mettre à jour
        </button>
      </div>
    </div>
  );
};

export default AdminCodeManager;