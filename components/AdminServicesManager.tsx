
import React, { useState, useEffect } from 'react';
import TrashIcon from './icons/TrashIcon';
import { Service } from '../types';
import PencilIcon from './icons/PencilIcon';
import CloseIcon from './icons/CloseIcon';
import KeyIcon from './icons/KeyIcon';

// =================================================================
// EditServiceModal Component
// =================================================================
interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onSave: (serviceName: string, newCode: string) => void;
}

const EditServiceModal: React.FC<EditServiceModalProps> = ({ isOpen, onClose, service, onSave }) => {
  const [newCode, setNewCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNewCode('');
      setConfirmCode('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !service) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newCode.trim() || !confirmCode.trim()) {
      setError("Veuillez remplir les deux champs de code d'accès.");
      return;
    }

    if (newCode.trim() !== confirmCode.trim()) {
      setError("Les codes d'accès ne correspondent pas.");
      return;
    }
    
    onSave(service.name, newCode.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="edit-service-title">
        <div className="p-6 relative">
          <div className="flex items-center mb-4">
            <div className="mr-4 flex-shrink-0 bg-secondary/20 p-3 rounded-full">
              <KeyIcon className="h-6 w-6 text-secondary-accent" />
            </div>
            <div>
              <h2 id="edit-service-title" className="text-2xl font-bold text-text">Modifier le Service</h2>
              <p className="text-text-muted">Changer le code d'accès pour <span className="font-bold text-text">{service.name}</span>.</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          <div>
            <label htmlFor="edit-service-new-code" className="block text-sm font-medium text-text-muted mb-1">Nouveau code d'accès</label>
            <input
              type="password"
              id="edit-service-new-code"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              required
              className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-secondary focus:outline-none"
              placeholder="Nouveau code"
            />
          </div>
          <div>
            <label htmlFor="edit-service-confirm-code" className="block text-sm font-medium text-text-muted mb-1">Confirmer le nouveau code</label>
            <input
              type="password"
              id="edit-service-confirm-code"
              value={confirmCode}
              onChange={(e) => setConfirmCode(e.target.value)}
              required
              className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-secondary focus:outline-none"
              placeholder="Confirmer le code"
            />
          </div>

          {error && (
            <p className="text-danger text-sm text-center">{error}</p>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-border hover:opacity-80 text-text font-bold py-2 px-6 rounded-lg transition-colors">
              Annuler
            </button>
            <button type="submit" className="bg-secondary hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105">
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =================================================================
// AdminServicesManager Component
// =================================================================
interface AdminServicesManagerProps {
  services: Service[];
  onAddService: (service: Service) => void;
  onDeleteService: (serviceName: string) => void;
  onUpdateService: (serviceName: string, newCode: string) => void;
}

const AdminServicesManager: React.FC<AdminServicesManagerProps> = ({ services, onAddService, onDeleteService, onUpdateService }) => {
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCode, setNewServiceCode] = useState('');
  const [confirmServiceCode, setConfirmServiceCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleAdd = () => {
    setError(null);
    if (!newServiceName.trim() || !newServiceCode.trim() || !confirmServiceCode.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (newServiceCode.trim() !== confirmServiceCode.trim()) {
      setError("Les codes d'accès ne correspondent pas.");
      return;
    }

    onAddService({ name: newServiceName.trim(), code: newServiceCode.trim() });
    setNewServiceName('');
    setNewServiceCode('');
    setConfirmServiceCode('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditingService(null);
    setIsEditModalOpen(false);
  };

  const handleSaveService = (serviceName: string, newCode: string) => {
    onUpdateService(serviceName, newCode);
    handleCloseEditModal();
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-secondary/30 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-text mb-4">Gérer les Services</h2>
      <div className="flex flex-col gap-3 mb-2">
          <input
            type="text"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nom du nouveau service..."
            className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-secondary focus:outline-none"
            aria-label="Nom du nouveau service"
          />
          <input
            type="password"
            value={newServiceCode}
            onChange={(e) => setNewServiceCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Code d'accès du service..."
            className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-secondary focus:outline-none"
            aria-label="Code d'accès du service"
          />
          <input
            type="password"
            value={confirmServiceCode}
            onChange={(e) => setConfirmServiceCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Confirmer le code d'accès..."
            className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-secondary focus:outline-none"
            aria-label="Confirmer le code d'accès"
          />
      </div>
      {error && <p className="text-danger text-sm text-center mb-3">{error}</p>}
      <button
        onClick={handleAdd}
        className="w-full bg-secondary hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
      >
        Ajouter le Service
      </button>

      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 mt-4">
        <ul className="space-y-3">
          {services.sort((a,b) => a.name.localeCompare(b.name)).map(service => (
            <li key={service.name} className="bg-input-bg/50 rounded-lg p-3 flex justify-between items-center text-text-muted animate-fade-in gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text truncate" title={service.name}>{service.name}</p>
                <p className="text-sm text-text-muted">Code : <code className="text-secondary-accent font-mono bg-card px-1.5 py-0.5 rounded-md">{service.code}</code></p>
              </div>
              <div className="flex items-center flex-shrink-0">
                <button
                  onClick={() => handleOpenEditModal(service)}
                  className="text-text-muted hover:text-primary-accent transition-colors p-1"
                  aria-label={`Modifier ${service.name}`}
                  title={`Modifier ${service.name}`}
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDeleteService(service.name)}
                  className="text-text-muted hover:text-danger transition-colors p-1"
                  aria-label={`Supprimer ${service.name}`}
                  title={`Supprimer ${service.name}`}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
          {services.length === 0 && (
            <p className="text-text-muted/70 text-center py-4">Aucun service défini.</p>
          )}
        </ul>
      </div>
      
      <EditServiceModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        service={editingService}
        onSave={handleSaveService}
      />
    </div>
  );
};

export default AdminServicesManager;
