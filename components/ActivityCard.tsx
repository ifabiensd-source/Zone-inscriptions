
import React, { useState } from 'react';
import { Activity, LoggedInUser } from '../types';
import TrashIcon from './icons/TrashIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import PencilIcon from './icons/PencilIcon';
import TagIcon from './icons/TagIcon';

interface ActivityCardProps {
  activity: Activity;
  onRegister: (activity: Activity) => void;
  isAdmin: boolean;
  onDelete: (id: number, title: string) => void;
  onEdit: (activity: Activity) => void;
  loggedInUser: LoggedInUser | null;
}

const formatDateRange = (startDateString: string, endDateString: string) => {
  const start = new Date(startDateString);
  const end = new Date(endDateString || startDateString);

  // Timezone UTC to avoid off-by-one day errors
  const optionsSingle: Intl.DateTimeFormatOptions = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  };

  // If it's a single day
  if (start.getTime() === end.getTime() || !endDateString) {
    const formatted = new Intl.DateTimeFormat('fr-FR', optionsSingle).format(start);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  const optionsEnd: Intl.DateTimeFormatOptions = {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
  };

  // Du 15 au 18 juillet 2024
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    const startDay = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', timeZone: 'UTC' }).format(start);
    return `Du ${startDay} au ${new Intl.DateTimeFormat('fr-FR', optionsEnd).format(end)}`;
  }

  const optionsStart: Intl.DateTimeFormatOptions = {
    day: 'numeric', month: 'long', timeZone: 'UTC'
  };
  
  // Du 15 juillet au 18 août 2024
  if (start.getFullYear() === end.getFullYear()) {
     return `Du ${new Intl.DateTimeFormat('fr-FR', optionsStart).format(start)} au ${new Intl.DateTimeFormat('fr-FR', optionsEnd).format(end)}`;
  }

  // Du 15 décembre 2024 au 18 janvier 2025
  return `Du ${new Intl.DateTimeFormat('fr-FR', optionsEnd).format(start)} au ${new Intl.DateTimeFormat('fr-FR', optionsEnd).format(end)}`;
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onRegister, isAdmin, onDelete, onEdit, loggedInUser }) => {
  const { id, title, description, startDate, endDate, startTime, endTime, spots, registrations, serviceAllocations, ageRestriction } = activity;
  const [isExpanded, setIsExpanded] = useState(false);

  const isPublic = !serviceAllocations || serviceAllocations.length === 0;

  let displaySpots = spots;
  let displayRegisteredCount = registrations.length;
  let serviceInfoText: string;

  if (loggedInUser?.type === 'service' && !isPublic) {
    const serviceName = loggedInUser.service.name;
    const allocation = serviceAllocations.find(a => a.serviceName === serviceName);
    
    if (allocation) {
      displaySpots = allocation.spots;
      displayRegisteredCount = registrations.filter(r => r.department === serviceName).length;
      serviceInfoText = `${displayRegisteredCount} / ${displaySpots} pour votre service`;
    } else {
        serviceInfoText = `${registrations.length} / ${spots} inscrits`;
    }
  } else {
    serviceInfoText = `${registrations.length} / ${spots} inscrits`;
  }
  
  const isSoldOut = displayRegisteredCount >= displaySpots;
  const progressPercentage = displaySpots > 0 ? (displayRegisteredCount / displaySpots) * 100 : 0;
  
  const participantsToShow = isExpanded ? registrations : registrations.slice(0, 3);
  const remainingParticipants = registrations.length - 3;

  return (
    <div 
      className="bg-card rounded-2xl overflow-hidden shadow-lg flex flex-col relative border-2 border-[var(--color-border)] transition-all duration-300 hover:border-[var(--color-primary-accent)] hover:shadow-[var(--shadow-primary)]"
    >
      {isAdmin && (
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <button 
            onClick={() => onEdit(activity)}
            className="text-text-muted hover:text-primary-accent transition-colors p-1.5 bg-card/60 backdrop-blur-sm rounded-full"
            aria-label="Modifier l'activité"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDelete(id, title)}
            className="text-text-muted hover:text-danger transition-colors p-1.5 bg-card/60 backdrop-blur-sm rounded-full"
            aria-label="Supprimer l'activité"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="text-xl font-bold text-text flex-1 pr-20">{title}</h3>
            <div className="text-right flex-shrink-0">
                <p className="font-semibold text-sm text-[var(--color-primary-accent)]">{formatDateRange(startDate, endDate)}</p>
                <p className="text-sm text-text-muted">{startTime} - {endTime}</p>
            </div>
        </div>
        <p className="text-text-muted mt-2 text-sm">{description}</p>
        
        {ageRestriction && (
          <div className="mt-3 flex items-center gap-2 text-sm text-secondary-accent bg-secondary/10 px-3 py-1.5 rounded-lg w-fit">
            <TagIcon className="w-5 h-5" />
            <span className="font-semibold">{ageRestriction}</span>
          </div>
        )}

        <div className="mt-4">
          <div className="relative w-full h-6 bg-[var(--color-border)]/50 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: isSoldOut ? 'var(--color-danger)' : 'var(--color-success)',
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xs font-bold tracking-wider">
                {serviceInfoText}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-text-muted flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <UserGroupIcon className="w-5 h-5 text-text-muted/70" />
            <h4 className="font-semibold text-text">Participants</h4>
          </div>
          {registrations.length > 0 ? (
            <div className="pl-2 border-l-2 border-border">
               <div className={`space-y-1 ${isExpanded ? 'max-h-32 overflow-y-auto custom-scrollbar pr-2' : ''}`}>
                 {participantsToShow.map(reg => (
                    <p key={reg.id} className="text-text truncate" title={`${[reg.firstName, reg.lastName].filter(Boolean).join(' ')} (${reg.department})`}>
                      {[reg.firstName, reg.lastName].filter(Boolean).join(' ')} <span className="text-text-muted text-xs italic">({reg.department})</span>
                    </p>
                  ))}
               </div>
              {remainingParticipants > 0 && !isExpanded && (
                <button onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }} className="text-[var(--color-primary-accent)] hover:text-[var(--color-primary)] text-left w-full mt-1 text-sm font-semibold">
                  + {remainingParticipants} autre{remainingParticipants > 1 ? 's' : ''}
                </button>
              )}
              {isExpanded && (
                 <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} className="text-[var(--color-primary-accent)] hover:text-[var(--color-primary)] text-left w-full mt-1 text-sm font-semibold">
                  Voir moins
                </button>
              )}
            </div>
          ) : (
            <p className="pl-4 text-text-muted/70 italic">Sois le premier à t'inscrire !</p>
          )}
        </div>

        <button
          onClick={() => onRegister(activity)}
          disabled={isSoldOut}
          className={`
            mt-6 w-full font-bold py-3 px-4 rounded-lg text-white uppercase tracking-wider text-sm
            transition-all duration-300 transform hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-primary-accent
            ${isSoldOut
                ? 'bg-border cursor-not-allowed'
                : 'bg-primary hover:opacity-90'
            }
          `}
          aria-label={isSoldOut ? "Activité complète" : `S'inscrire à ${title}`}
        >
          {isSoldOut ? 'Complet' : "S'inscrire / Voir détails"}
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
