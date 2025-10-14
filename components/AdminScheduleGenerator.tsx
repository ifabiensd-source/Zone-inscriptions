import React, { useState, useMemo } from 'react';
import { Activity, Service, Theme } from '../types';
import ArrowDownTrayIcon from './icons/ArrowDownTrayIcon';
import EyeIcon from './icons/EyeIcon';
import CalendarDaysIcon from './icons/CalendarDaysIcon';
import { generateSchedulePdf } from '../services/pdfService';
import Spinner from './Spinner';
import PreviewModal from './PreviewModal';
import SchedulePDFTemplate from './SchedulePDFTemplate';

interface AdminScheduleGeneratorProps {
  activities: Activity[];
  services: Service[];
  theme: Theme;
}

const AdminScheduleGenerator: React.FC<AdminScheduleGeneratorProps> = ({ activities, services, theme }) => {
  const ALL_SERVICES_OPTION: Readonly<Service> = { name: 'Toutes les activités', code: '__all__' };
  
  const allAvailableServices = useMemo(() => 
    [ALL_SERVICES_OPTION, ...services.sort((a,b) => a.name.localeCompare(b.name))], 
    [services, ALL_SERVICES_OPTION]
  );
  
  const [selectedService, setSelectedService] = useState<string>(allAvailableServices[0]?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const serviceActivities = useMemo(() => {
    const sorter = (a: Activity, b: Activity) => {
        const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateComparison !== 0) {
            return dateComparison;
        }
        return a.startTime.localeCompare(b.startTime);
    };

    if (selectedService === ALL_SERVICES_OPTION.name) {
        return [...activities].sort(sorter);
    }
    
    const service = services.find(s => s.name === selectedService);
    if (!service) return [];
    
    return activities.filter(act =>
        (act.serviceAllocations || []).length === 0 ||
        (act.serviceAllocations || []).some(alloc => alloc.serviceName === service.name)
    ).sort(sorter);
  }, [activities, selectedService, services, ALL_SERVICES_OPTION.name]);

  const currentServiceForPreview = useMemo(() => {
    if (selectedService === ALL_SERVICES_OPTION.name) {
        return ALL_SERVICES_OPTION;
    }
    return services.find(s => s.name === selectedService);
  }, [selectedService, services, ALL_SERVICES_OPTION]);

  const handleGenerateClick = async () => {
    const serviceToUse = currentServiceForPreview;
    if (!serviceToUse) {
      alert("Veuillez sélectionner une option valide.");
      return;
    }
    
    setIsLoading(true);

    try {
        await generateSchedulePdf(serviceToUse, serviceActivities, theme);
    } catch (error) {
        console.error("PDF generation failed:", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-primary/30 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
        <CalendarDaysIcon className="w-6 h-6 text-primary" />
        Générer un Planning
      </h2>
      <p className="text-sm text-text-muted mb-4">
        Créez un magnifique planning d'activités au format PDF pour un service spécifique ou pour toutes les activités.
      </p>

      <div className="mb-4 flex-grow">
        <label htmlFor="service-schedule-select" className="block text-sm font-medium text-text-muted mb-1">Planning pour</label>
        <select
          id="service-schedule-select"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          disabled={isLoading}
          className="w-full bg-input-bg border-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
          aria-label="Sélectionner un planning"
        >
          {allAvailableServices.map(service => (
            <option key={service.name} value={service.name}>{service.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-auto">
        <button
          onClick={() => setIsPreviewOpen(true)}
          disabled={isLoading || !selectedService}
          className="flex items-center justify-center gap-2 w-full sm:w-auto flex-grow bg-border hover:opacity-80 text-text font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <EyeIcon className="w-5 h-5" />
          <span>Prévisualiser</span>
        </button>
        <button
          onClick={handleGenerateClick}
          disabled={isLoading || !selectedService}
          className="flex items-center justify-center gap-2 w-full sm:w-auto flex-grow bg-primary hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-border disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
                <Spinner />
                <span className="ml-2">Génération...</span>
            </>
          ) : (
            <>
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>Générer le PDF</span>
            </>
          )}
        </button>
      </div>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={`Prévisualisation du Planning - ${selectedService}`}
      >
        {currentServiceForPreview && (
            <SchedulePDFTemplate
                service={currentServiceForPreview}
                activities={serviceActivities}
                theme={theme}
            />
        )}
      </PreviewModal>
    </div>
  );
};

export default AdminScheduleGenerator;