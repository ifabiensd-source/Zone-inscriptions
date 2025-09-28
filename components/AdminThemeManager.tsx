import React from 'react';
import { Theme } from '../types';
import PaintBrushIcon from './icons/PaintBrushIcon';
import { THEMES } from '../themes';

interface AdminThemeManagerProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const AdminThemeManager: React.FC<AdminThemeManagerProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-tertiary/30 h-full flex flex-col">
       <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
        <PaintBrushIcon className="w-6 h-6 text-tertiary-accent" />
        Personnaliser l'Apparence
      </h2>
      <p className="text-sm text-text-muted mb-4">
        Changez le look de l'application en un clic. Votre choix sera sauvegardé.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme)}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200
              ${currentTheme.id === theme.id ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-primary-accent'}
            `}
            aria-label={`Appliquer le thème ${theme.name}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.styles['--color-primary'] }}></div>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.styles['--color-secondary'] }}></div>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.styles['--color-tertiary'] }}></div>
            </div>
            <p className="font-semibold text-text text-sm text-left">{theme.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminThemeManager;