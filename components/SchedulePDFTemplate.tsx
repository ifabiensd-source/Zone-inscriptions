

import React, { useMemo } from 'react';
import { Activity, Service, Theme } from '../types';
import UserCircleIcon from './icons/UserCircleIcon';
import TagIcon from './icons/TagIcon';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';
import KBanLogo from './icons/KBanLogo';
import BuildingOfficeIcon from './icons/BuildingOfficeIcon';

interface SchedulePDFTemplateProps {
  service: Service;
  activities: Activity[];
  theme: Theme;
}

// --- Helper Functions ---
const timeToMinutes = (timeStr: string): number => {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const detectOverlaps = (activities: Activity[]): Set<number> => {
    const overlappingIds = new Set<number>();
    if (activities.length < 2) return overlappingIds;

    const timedActivities = activities.map(act => ({
        id: act.id,
        startMin: timeToMinutes(act.startTime),
        endMin: timeToMinutes(act.endTime)
    }));

    for (let i = 0; i < timedActivities.length; i++) {
        for (let j = i + 1; j < timedActivities.length; j++) {
            const act1 = timedActivities[i];
            const act2 = timedActivities[j];

            if (act1.startMin < act2.endMin && act1.endMin > act2.startMin) {
                overlappingIds.add(act1.id);
                overlappingIds.add(act2.id);
            }
        }
    }
    return overlappingIds;
};

const SchedulePDFTemplate: React.FC<SchedulePDFTemplateProps> = ({ service, activities, theme }) => {
    const isGlobalSchedule = service.code === '__all__';

    // --- Monochrome Palette ---
    const brandColor = '#000000';
    const textColor = '#1d1d1f';
    const textMutedColor = '#6e6e73';
    const borderColor = '#d2d2d7';
    const cardBgColor = '#f5f5f7';
    const cardBorderColor = '#e5e5e5';
    // Using a system-safe font stack for maximum compatibility with html2canvas
    const safeFontFamily = 'Helvetica, Arial, sans-serif';

    const activitiesByDate = useMemo(() => {
        const groups = new Map<string, Activity[]>();
        activities.forEach(originalActivity => {
            const startDate = new Date(originalActivity.date + 'T00:00:00Z');
            const endDate = originalActivity.endDate ? new Date(originalActivity.endDate + 'T00:00:00Z') : startDate;
    
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                
                if (!groups.has(dateStr)) {
                    groups.set(dateStr, []);
                }
                const dateActivities = groups.get(dateStr)!;
                
                const activityForDay = { ...originalActivity };
    
                const insertIndex = dateActivities.findIndex(a => timeToMinutes(a.startTime) > timeToMinutes(activityForDay.startTime));
                if (insertIndex === -1) {
                    dateActivities.push(activityForDay);
                } else {
                    dateActivities.splice(insertIndex, 0, activityForDay);
                }
            }
        });
    
        return Array.from(groups.entries()).sort(
            (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
        );
    }, [activities]);
    
    const formatFullDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
        const formatted = new Intl.DateTimeFormat('fr-FR', options).format(date);
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };

    const formatDateShort = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00Z');
        return `${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
    };

    return (
        <div
          id="pdf-template"
          style={{
            fontFamily: safeFontFamily,
            backgroundColor: '#ffffff',
            color: textColor,
            width: '800px'
          }}
        >
          <div id="pdf-header">
            <header 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '30px 40px',
                borderBottom: `1px solid ${borderColor}`, 
              }}
            >
              <KBanLogo style={{ height: '24px', width: 'auto', color: brandColor }} />
              <div style={{ textAlign: 'right' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 600, margin: '0', color: textColor }}>{service.name}</h1>
                <p style={{ fontSize: '14px', margin: '4px 0 0', color: textMutedColor }}>Planning des Activités</p>
              </div>
            </header>
          </div>

          <main id="pdf-main-content" style={{ padding: '20px 40px' }}>
            {activitiesByDate.length > 0 ? activitiesByDate.map(([date, activitiesOnDate]) => {
              
              const overlappingActivityIds = detectOverlaps(activitiesOnDate);

              return (
                <div key={date} className="pdf-day-block" style={{ marginBottom: '20px' }}>
                  <h2 
                    style={{ 
                      fontSize: '24px', 
                      fontWeight: 700, 
                      color: brandColor,
                      paddingBottom: '12px',
                      borderBottom: `2px solid ${cardBorderColor}`,
                      marginBottom: '25px',
                    }}
                  >
                      {formatFullDate(date)}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {activitiesOnDate.map(activity => {
                      const isOverlapping = overlappingActivityIds.has(activity.id);
                      const isPublic = !activity.serviceAllocations || activity.serviceAllocations.length === 0;
                      const isMultiDay = activity.endDate && activity.endDate !== activity.date;

                      let spotText = '';
                      if (isPublic) {
                        spotText = `${activity.spots} places`;
                      } else if (isGlobalSchedule) {
                        spotText = `${activity.spots} places (par service)`;
                      } else {
                        const allocation = activity.serviceAllocations.find(a => a.serviceName === service.name);
                        spotText = allocation ? `${allocation.spots} place${allocation.spots > 1 ? 's' : ''} pour vous` : '';
                      }

                      return (
                        <div key={activity.id} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                          {/* Time Column */}
                          <div style={{ width: '100px', flexShrink: 0, textAlign: 'right', paddingTop: '2px' }}>
                              <p style={{ fontSize: '15px', fontWeight: 600, color: textColor, margin: 0 }}>{activity.startTime}</p>
                              <p style={{ fontSize: '13px', color: textMutedColor, margin: '2px 0 0' }}>à {activity.endTime}</p>
                              {isOverlapping && (
                                <div title="Chevauchement horaire" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                                  <ExclamationTriangleIcon style={{ width: '14px', height: '14px', color: brandColor }} />
                                  <span style={{ fontSize: '11px', color: brandColor, fontWeight: 500}}>Overlap</span>
                                </div>
                              )}
                          </div>
                          
                          {/* Activity Card */}
                          <div style={{ flexGrow: 1, borderLeft: `3px solid ${brandColor}`, paddingLeft: '20px' }}>
                            <div style={{ 
                                backgroundColor: cardBgColor,
                                border: `1px solid ${cardBorderColor}`,
                                borderRadius: '12px',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                             }}>
                              <h3 style={{ fontSize: '18px', fontWeight: 600, color: textColor, margin: 0, wordBreak: 'break-word' }}>
                                {activity.title}
                                {isMultiDay && <span style={{ fontWeight: 400, color: textMutedColor, fontSize: '14px' }}> (du {formatDateShort(activity.date)} au {formatDateShort(activity.endDate!)})</span>}
                              </h3>
                              
                              {activity.description && <p style={{ fontSize: '14px', color: textMutedColor, margin: '4px 0 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{activity.description}</p>}
                              
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px', borderTop: `1px solid ${cardBorderColor}`, paddingTop: '10px' }}>
                                {activity.ageRestriction && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: textColor }}>
                                        <TagIcon style={{ width: '16px', height: '16px', flexShrink: 0, color: textMutedColor }} />
                                        <span>{activity.ageRestriction}</span>
                                    </div>
                                )}
                                {spotText && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: textColor }}>
                                        <UserCircleIcon style={{ width: '16px', height: '16px', flexShrink: 0, color: textMutedColor }} />
                                        <span>{spotText}</span>
                                    </div>
                                )}
                              </div>

                              {isGlobalSchedule && !isPublic && (
                                <div style={{ borderTop: `1px solid ${cardBorderColor}`, paddingTop: '10px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: textMutedColor, marginBottom: '8px' }}>
                                    <BuildingOfficeIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                                    <span style={{ fontWeight: 500 }}>Services avec places allouées :</span>
                                  </div>
                                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: textColor, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {activity.serviceAllocations.map(alloc => (
                                      <li key={alloc.serviceName}>{alloc.serviceName} ({alloc.spots} places)</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: cardBgColor, borderRadius: '12px', border: `1px dashed ${borderColor}` }}>
                    <p style={{ fontSize: '16px', color: textMutedColor, margin: 0 }}>Aucune activité programmée pour ce service.</p>
                </div>
            )}
          </main>
        </div>
    );
};

export default SchedulePDFTemplate;