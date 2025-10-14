

import React, { useState, FormEvent, useEffect } from 'react';
import { Activity, Registration, RegistrationFormData } from '../types';
import CloseIcon from './icons/CloseIcon';
import TrashIcon from './icons/TrashIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';
import { playSuccessSound } from '../utils/audio';
import TagIcon from './icons/TagIcon';

interface RegistrationModalProps {
  activity: Activity | null;
  onClose: () => void;
  onRegister: (registrationData: RegistrationFormData) => void;
  isOpen: boolean;
  departments: string[];
  isAdmin: boolean;
  onUnregister: (activityId: number, registrationId: number, youthName: string) => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ activity, onClose, onRegister, isOpen, departments, isAdmin, onUnregister }) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    youthAge: '',
    department: departments[0] || 'Autre',
    comment: '',
  });

  const isServiceUserWithOneChoice = !isAdmin && departments.length === 1;

  useEffect(() => {
    if (isOpen && departments.length > 0) {
       setFormData({
        firstName: '',
        lastName: '',
        youthAge: '',
        department: departments[0] || 'Autre',
        comment: '',
      });
    }
  }, [isOpen, departments]);

  if (!isOpen || !activity) {
    return null;
  }

  const registeredCount = activity.registrations.length;
  const spotsAvailable = activity.spots > registeredCount;
  const getYouthName = (reg: { firstName: string, lastName?: string }) => `${reg.firstName} ${reg.lastName || ''}`.trim();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.youthAge.trim()) {
        alert("Veuillez remplir au moins le prénom et l'âge du jeune.");
        return;
    }
    playSuccessSound();
    onRegister({
      ...formData,
      lastName: formData.lastName?.trim() || undefined,
    });
  };

  const handleUnregisterClick = (registration: Registration) => {
    onUnregister(activity.id, registration.id, getYouthName(registration));
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl animate-fade-in flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative border-b border-border">
          <h2 className="text-2xl font-bold text-text">{activity.title}</h2>
           {activity.ageRestriction && (
            <div className="mt-2 flex items-center gap-2 text-sm text-secondary-accent bg-secondary/10 px-3 py-1.5 rounded-lg w-fit">
              <TagIcon className="w-5 h-5" />
              <span className="font-semibold">{activity.ageRestriction}</span>
            </div>
          )}
          <p className="text-primary-accent text-sm mt-2">{new Date(activity.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
          <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors">
            <CloseIcon />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <div className="p-6">
            
            <h3 className="text-lg font-semibold text-text mb-3">Liste des Inscrits ({registeredCount}/{activity.spots})</h3>
            {activity.registrations.length > 0 ? (
                <ul className="space-y-2">
                    {activity.registrations.map(reg => (
                        <li key={reg.id} className="bg-input-bg/50 rounded-lg p-3">
                            <div className="flex justify-between items-center gap-4">
                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-text truncate">{getYouthName(reg)}</p>
                                    <p className="text-sm text-text-muted">{reg.youthAge} ans • <span className="font-medium text-primary-accent">{reg.department}</span></p>
                                </div>
                                
                                {/* Right side content */}
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {/* Comment */}
                                    {reg.comment && (
                                        <div className="flex items-center gap-2 bg-input-bg p-2 rounded-lg text-sm max-w-xs" title={reg.comment}>
                                            <InformationCircleIcon className="w-5 h-5 text-secondary-accent flex-shrink-0" />
                                            <p className="text-text-muted truncate">{reg.comment}</p>
                                        </div>
                                    )}
                                    
                                    {/* Admin Action */}
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleUnregisterClick(reg)}
                                            className="text-text-muted hover:text-danger transition-colors p-1"
                                            aria-label={`Désinscrire ${getYouthName(reg)}`}
                                            title={`Désinscrire ${getYouthName(reg)}`}
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-text-muted/70 italic text-center py-4">Aucun jeune inscrit pour le moment.</p>
            )}
          </div>
          
          {spotsAvailable && departments.length > 0 && (
            <div className="p-6 border-t border-border">
              <h3 className="text-lg font-semibold text-text mb-4">Inscrire un jeune</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-text-muted mb-1">Prénom</label>
                  <input type="text" id="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                 <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-text-muted mb-1">Nom (optionnel)</label>
                  <input type="text" id="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="youthAge" className="block text-sm font-medium text-text-muted mb-1">Âge</label>
                  <input type="number" id="youthAge" value={formData.youthAge} onChange={(e) => setFormData({ ...formData, youthAge: e.target.value })} required className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-text-muted mb-1">Service / Structure</label>
                  <select 
                    id="department" 
                    value={formData.department} 
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })} 
                    required 
                    disabled={isServiceUserWithOneChoice}
                    className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed">
                    {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="comment" className="block text-sm font-medium text-text-muted mb-1">Commentaire (optionnel)</label>
                  <textarea id="comment" value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} rows={2} className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none" placeholder="Allergies, autorisation spéciale, etc."></textarea>
                </div>
                <div className="sm:col-span-2 text-right mt-2">
                  <button type="submit" className="bg-primary hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105">
                    Confirmer l'inscription
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
