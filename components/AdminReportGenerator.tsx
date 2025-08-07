
import React, { useCallback } from 'react';
import { Activity } from '../types';
import DocumentArrowDownIcon from './icons/DocumentArrowDownIcon';

interface AdminReportGeneratorProps {
  activities: Activity[];
}

const AdminReportGenerator: React.FC<AdminReportGeneratorProps> = ({ activities }) => {
  const hasRegistrations = activities.some(act => act.registrations.length > 0);

  const downloadReport = useCallback(() => {
    if (!hasRegistrations) {
      alert("Il n'y a aucun jeune inscrit à exporter.");
      return;
    }

    const headers = [
      'Activité',
      'Date de l\'activité',
      'Prénom du jeune',
      'Nom du jeune',
      'Âge',
      'Service / Structure',
      'Commentaire'
    ];

    const escapeCsvCell = (cellData: string | undefined): string => {
      if (cellData === undefined || cellData === null) {
        return '';
      }
      const stringData = String(cellData);
      // If the data contains a comma, a newline, or a double quote, wrap it in double quotes.
      if (stringData.includes(',') || stringData.includes('\n') || stringData.includes('"')) {
        // Escape existing double quotes by doubling them
        return `"${stringData.replace(/"/g, '""')}"`;
      }
      return stringData;
    };

    const rows = activities.flatMap(activity =>
      activity.registrations.map(reg => [
        escapeCsvCell(activity.title),
        escapeCsvCell(activity.date),
        escapeCsvCell(reg.firstName),
        escapeCsvCell(reg.lastName),
        escapeCsvCell(reg.youthAge),
        escapeCsvCell(reg.department),
        escapeCsvCell(reg.comment)
      ].join(','))
    );

    // Add BOM for Excel compatibility with UTF-8
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `rapport-inscriptions-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  }, [activities, hasRegistrations]);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-tertiary/30 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
        <DocumentArrowDownIcon className="w-6 h-6 text-tertiary" />
        Rapports & Exports
      </h2>
      <p className="text-sm text-text-muted mb-4 flex-grow">
        Téléchargez un fichier CSV contenant la liste de tous les jeunes inscrits à toutes les activités, avec leurs informations et commentaires.
      </p>
      <button
        onClick={downloadReport}
        disabled={!hasRegistrations}
        className="w-full bg-tertiary hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-border disabled:cursor-not-allowed disabled:transform-none"
        aria-label="Télécharger le rapport des inscriptions"
      >
        Télécharger le rapport
      </button>
       {!hasRegistrations && (
         <p className="text-xs text-center text-text-muted mt-2">Aucune inscription à exporter pour le moment.</p>
       )}
    </div>
  );
};

export default AdminReportGenerator;
