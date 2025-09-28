import React, { useState, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';
import KeyIcon from './icons/KeyIcon';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  error: string | null;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSubmit, error }) => {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPassword(''); // Reset password on open
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors">
            <CloseIcon />
          </button>

          <div className="text-center">
             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 mb-4">
                <KeyIcon className="h-6 w-6 text-primary-accent" />
             </div>
            <h2 id="admin-login-title" className="text-2xl font-bold text-text">Accès Administrateur</h2>
            <p className="text-text-muted mt-1">Veuillez entrer le mot de passe.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-password" className="sr-only">Mot de passe</label>
              <input 
                type="password"
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-input-bg border-border rounded-lg p-3 text-text text-center text-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            {error && (
                <p className="text-danger text-sm text-center">{error}</p>
            )}
            <button type="submit" className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
              Se Connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;