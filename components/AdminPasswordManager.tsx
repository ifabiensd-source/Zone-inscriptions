
import React, { useState } from 'react';
import ShieldCheckIcon from './icons/ShieldCheckIcon';

interface AdminPasswordManagerProps {
  onPasswordChange: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AdminPasswordManager: React.FC<AdminPasswordManagerProps> = ({ onPasswordChange }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 6) {
        setError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
        return;
    }

    try {
      await onPasswordChange(currentPassword, newPassword);
      setSuccess("Mot de passe mis à jour avec succès !");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur est survenue.");
      }
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-danger/30 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
        <ShieldCheckIcon className="w-6 h-6 text-danger" />
        Mot de Passe Admin
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-grow">
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-text-muted mb-1">Mot de passe actuel</label>
          <input
            type="password"
            id="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-danger focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-text-muted mb-1">Nouveau mot de passe</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-danger focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-text-muted mb-1">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-danger focus:outline-none"
          />
        </div>
        
        <div className="mt-auto pt-2">
            {error && <p className="text-danger text-sm text-center mb-2 animate-fade-in">{error}</p>}
            {success && <p className="text-success text-sm text-center mb-2 animate-fade-in">{success}</p>}

            <button type="submit" className="w-full bg-danger hover:bg-danger-accent text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                Mettre à jour le mot de passe
            </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPasswordManager;
