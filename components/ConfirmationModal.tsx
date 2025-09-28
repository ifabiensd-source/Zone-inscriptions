import React from 'react';
import WarningIcon from './icons/WarningIcon';
import CloseIcon from './icons/CloseIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  confirmText?: string;
  confirmButtonClass?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  title = 'Confirmation requise',
  confirmText = 'Confirmer',
  confirmButtonClass = 'bg-[var(--color-danger)] hover:opacity-90',
}) => {
  if (!isOpen) return null;

  const isDestructive = confirmButtonClass.includes('danger');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
        <div className="p-6 relative">
          <button onClick={onCancel} className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors">
            <CloseIcon />
          </button>
          <div className="text-center">
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${isDestructive ? 'bg-danger/20' : 'bg-primary/20'} mb-4`}>
              <WarningIcon className={`h-6 w-6 ${isDestructive ? 'text-danger-accent' : 'text-primary-accent'}`} />
            </div>
            <h2 id="confirmation-title" className="text-xl font-bold text-text">{title}</h2>
            <p className="text-text-muted mt-2">{message}</p>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-6 py-2 rounded-lg font-semibold text-sm bg-border hover:opacity-80 text-text transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-2 rounded-lg font-semibold text-sm ${confirmButtonClass} text-white transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;