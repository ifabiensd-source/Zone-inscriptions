import React, { useState, useEffect } from 'react';
import { Activity, ActivityFormData, Service } from '../types';
import CloseIcon from './icons/CloseIcon';
import PencilIcon from './icons/PencilIcon';

interface EditActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onSave: (data: ActivityFormData) => void;
  services: Service[];
}

const EditActivityModal: React.FC<EditActivityModalProps> = ({ isOpen, onClose, activity, onSave, services }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [ageRestriction, setAgeRestriction] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [publicSpots, setPublicSpots] = useState(10);
  const [allocations, setAllocations] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (activity) {
      setTitle(activity.title);
      setDescription(activity.description);
      setDate(activity.date);
      setStartTime(activity.startTime);
      setEndTime(activity.endTime);
      setAgeRestriction(activity.ageRestriction || '');
      
      const hasEndDate = !!activity.endDate && activity.endDate !== activity.date;
      setIsMultiDay(hasEndDate);
      setEndDate(activity.endDate || activity.date);

      const isActivityPublic = !activity.serviceAllocations || activity.serviceAllocations.length === 0;
      setIsPublic(isActivityPublic);

      if (isActivityPublic) {
        setPublicSpots(activity.spots);
        setAllocations({});
      } else {
        const initialAllocations = activity.serviceAllocations.reduce((acc, alloc) => {
            acc[alloc.serviceName] = alloc.spots;
            return acc;
        }, {} as {[key: string]: number});
        setAllocations(initialAllocations);
        setPublicSpots(10); // reset public spots
      }
    }
  }, [activity]);

  useEffect(() => {
    if (!isMultiDay) {
      setEndDate(date);
    }
  }, [date, isMultiDay]);

  if (!isOpen || !activity) {
    return null;
  }
  
  const handleAllocationChange = (serviceName: string, value: string) => {
    const spots = parseInt(value, 10);
    setAllocations(prev => ({
      ...prev,
      [serviceName]: isNaN(spots) || spots < 0 ? 0 : spots,
    }));
  };

  // FIX: Use generic on reduce to ensure accumulator type is correctly inferred.
  const totalAllocatedSpots = Object.values(allocations).reduce<number>((sum, spots) => sum + Number(spots || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let activityData: ActivityFormData;
    if (isPublic) {
      if (!title || !date || !startTime || !endTime || publicSpots < 1) {
          alert("Veuillez remplir tous les champs obligatoires et vous assurer que le nombre de places est positif.");
          return;
      }
      activityData = {
        title,
        description,
        date,
        // FIX: Compare dates as Date objects for correctness instead of as strings.
        endDate: isMultiDay && new Date(endDate) > new Date(date) ? endDate : undefined,
        startTime,
        endTime,
        spots: publicSpots,
        serviceAllocations: [],
        ageRestriction: ageRestriction.trim(),
      };
    } else {
      // FIX: Use reduce for combined filter and map to ensure type safety.
      const serviceAllocations = Object.entries(allocations).reduce<
        { serviceName: string; spots: number }[]
      >((acc, [serviceName, spotsValue]) => {
        const spots = Number(spotsValue);
        if (spots > 0) {
          acc.push({ serviceName, spots });
        }
        return acc;
      }, []);

      if (!title || !date || !startTime || !endTime || serviceAllocations.length === 0) {
        alert("Veuillez remplir les champs obligatoires et allouer des places à au moins un service.");
        return;
      }
      activityData = {
        title,
        description,
        date,
        // FIX: Compare dates as Date objects for correctness instead of as strings.
        endDate: isMultiDay && new Date(endDate) > new Date(date) ? endDate : undefined,
        startTime,
        endTime,
        spots: totalAllocatedSpots,
        serviceAllocations,
        ageRestriction: ageRestriction.trim(),
      };
    }
    
    onSave(activityData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="edit-activity-title">
        <div className="p-6 relative">
           <div className="flex items-center mb-4">
             <div className="mr-3 flex-shrink-0 bg-primary/20 p-3 rounded-full">
                <PencilIcon className="h-6 w-6 text-primary-accent" />
             </div>
             <div>
                <h2 id="edit-activity-title" className="text-2xl font-bold text-text">Modifier l'activité</h2>
                <p className="text-text-muted">Ajustez les détails de l'activité ci-dessous.</p>
             </div>
           </div>

          <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                <label htmlFor="edit-title" className="block text-sm font-medium text-text-muted mb-1">Titre de l'activité</label>
                <input type="text" id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>

                <div className="md:col-span-2">
                <label htmlFor="edit-description" className="block text-sm font-medium text-text-muted mb-1">Description</label>
                <textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none"></textarea>
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="edit-ageRestriction" className="block text-sm font-medium text-text-muted mb-1">Restriction d'âge (optionnel)</label>
                    <input type="text" id="edit-ageRestriction" value={ageRestriction} onChange={(e) => setAgeRestriction(e.target.value)} placeholder="Ex: Plus de 12 ans, 10-14 ans..." className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                
                 <div className="md:col-span-2 flex items-center gap-4">
                    <div className="flex-1">
                        <label htmlFor="edit-date" className="block text-sm font-medium text-text-muted mb-1">{isMultiDay ? 'Date de début' : 'Date'}</label>
                        <input type="date" id="edit-date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none" />
                    </div>
                    {isMultiDay && (
                        <div className="flex-1 animate-fade-in">
                            <label htmlFor="edit-endDate" className="block text-sm font-medium text-text-muted mb-1">Date de fin</label>
                            <input type="date" id="edit-endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={date} required className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none" />
                        </div>
                    )}
                </div>

                <div className="md:col-span-2">
                    <div className="flex items-center">
                        <input type="checkbox" id="edit-isMultiDay" checked={isMultiDay} onChange={(e) => setIsMultiDay(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" style={{colorScheme: 'dark'}} />
                        <label htmlFor="edit-isMultiDay" className="ml-2 block text-sm text-text-muted">Activité sur plusieurs jours</label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                    <div>
                    <label htmlFor="edit-startTime" className="block text-sm font-medium text-text-muted mb-1">Heure de début</label>
                    <input type="time" id="edit-startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none" />
                    </div>
                    <div>
                    <label htmlFor="edit-endTime" className="block text-sm font-medium text-text-muted mb-1">Heure de fin</label>
                    <input type="time" id="edit-endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none" />
                    </div>
                </div>
            </div>

            <div className="border-t border-border/50 pt-4">
                <h3 className="text-lg font-semibold text-text mb-3">Gestion des Places</h3>
                <div className="flex items-center gap-4 bg-input-bg p-2 rounded-lg">
                    <button type="button" onClick={() => setIsPublic(true)} className={`flex-1 text-center py-2 px-4 rounded-md font-semibold transition-colors ${isPublic ? 'bg-primary text-white' : 'hover:bg-border'}`}>Activité Publique</button>
                    <button type="button" onClick={() => setIsPublic(false)} className={`flex-1 text-center py-2 px-4 rounded-md font-semibold transition-colors ${!isPublic ? 'bg-primary text-white' : 'hover:bg-border'}`}>Places par Service</button>
                </div>
            </div>

            {isPublic ? (
                <div className="animate-fade-in">
                    <label htmlFor="edit-spots" className="block text-sm font-medium text-text-muted mb-1">Nombre total de places</label>
                    <input type="number" id="edit-spots" value={publicSpots} onChange={(e) => setPublicSpots(parseInt(e.target.value, 10))} required min="1" className="w-full bg-input-bg border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
            ) : (
                <div className="animate-fade-in space-y-3">
                    <p className="text-sm text-text-muted">Allouez un nombre de places pour chaque service participant. Les services avec 0 place n'auront pas accès.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                        {services.map(service => (
                            <div key={service.name} className="flex items-center gap-3">
                                <label htmlFor={`edit-service-${service.code}`} className="flex-1 text-text font-medium truncate">{service.name}</label>
                                <input
                                    type="number"
                                    id={`edit-service-${service.code}`}
                                    value={allocations[service.name] || ''}
                                    onChange={(e) => handleAllocationChange(service.name, e.target.value)}
                                    min="0"
                                    placeholder="0"
                                    className="w-20 bg-input-bg/70 border-border rounded-lg p-2 text-text focus:ring-2 focus:ring-primary focus:outline-none text-center"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="text-right font-bold text-text pt-2 border-t border-border/50">
                        Total des places allouées : <span className="text-primary-accent">{totalAllocatedSpots}</span>
                    </div>
                </div>
            )}
            
            <div className="md:col-span-2 text-right pt-4 flex justify-end gap-3">
               <button type="button" onClick={onClose} className="bg-border hover:opacity-80 text-text font-bold py-2 px-6 rounded-lg transition-colors">
                Annuler
              </button>
              <button type="submit" className="bg-primary hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105">
                Sauvegarder
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditActivityModal;