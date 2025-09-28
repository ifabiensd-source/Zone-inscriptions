import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import KBanLogo from './icons/KBanLogo';

interface ServiceLoginProps {
  onLogin: (serviceName: string, code: string) => void;
  onAdminClick: () => void;
  error: string | null;
  services: Service[];
}

const ServiceLogin: React.FC<ServiceLoginProps> = ({ onLogin, onAdminClick, error, services }) => {
  const [selectedService, setSelectedService] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if(services.length > 0 && !selectedService) {
        const sortedServices = [...services].sort((a,b) => a.name.localeCompare(b.name));
        setSelectedService(sortedServices[0].name);
    }
  }, [services, selectedService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedService) {
        onLogin(selectedService, code.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-bg flex justify-center items-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="service-login-title">
        <div className="p-8">
          <div className="text-center mb-6">
             <KBanLogo className="h-10 w-auto mx-auto" style={{ color: 'var(--color-primary)' }}/>
            <p id="service-login-title" className="text-text-muted mt-4">Accès au portail des activités.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {services.length > 0 ? (
            <>
                <div>
                    <label htmlFor="service-select" className="block text-sm font-medium text-text-muted mb-1 text-left">Choisir un service</label>
                    <select 
                        id="service-select"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        required
                        className="w-full bg-input-bg border-border rounded-lg p-3 text-text focus:ring-2 focus:ring-secondary focus:outline-none"
                    >
                        {[...services].sort((a,b) => a.name.localeCompare(b.name)).map(service => (
                            <option key={service.name} value={service.name}>{service.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                  <label htmlFor="service-code" className="sr-only">Code d'accès</label>
                  <input 
                    type="password"
                    id="service-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Code d'accès"
                    required
                    className="w-full bg-input-bg border-border rounded-lg p-3 text-text text-center text-lg focus:ring-2 focus:ring-secondary focus:outline-none"
                  />
                </div>
                {error && (
                    <p className="text-danger text-sm text-center">{error}</p>
                )}
                <button type="submit" className="w-full bg-secondary hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
                  Accéder
                </button>
            </>
            ) : (
                <p className="text-text-muted text-center py-4">Aucun service n'est configuré dans l'application.</p>
            )}
          </form>
          
          <div className="text-center mt-6 border-t border-border/50 pt-6">
            <button 
                type="button" 
                onClick={onAdminClick} 
                className="text-sm font-medium text-text-muted hover:text-primary-accent transition-colors duration-200"
            >
                Accéder au Mode Administrateur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceLogin;