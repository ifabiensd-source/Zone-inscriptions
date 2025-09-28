import React from 'react';

interface HeaderProps {
  isAdmin: boolean;
  onAdminAccess: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdmin, onAdminAccess }) => {
  return (
    <header className="relative p-4 sm:p-6 mb-8 text-center">
      <h1 
        style={{
          backgroundImage: `linear-gradient(to right, var(--gradient-start), var(--gradient-mid), var(--gradient-end))`
        }}
        className={`
          text-4xl sm:text-5xl font-bold text-transparent bg-clip-text
          transition-opacity duration-300
          ${isAdmin ? 'opacity-0 pointer-events-none' : 'opacity-100'}
        `}
        aria-hidden={isAdmin}
      >
        Zone-Inscriptions
      </h1>
      
      <div className="absolute top-4 right-4">
        <button 
          onClick={onAdminAccess}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 text-white ${
            isAdmin
              ? 'bg-[var(--color-danger)]'
              : 'bg-[var(--color-border)] hover:opacity-80'
          }`}
          style={{
             boxShadow: isAdmin ? '0 4px 14px 0 rgba(239, 68, 68, 0.3)' : 'none'
          }}
        >
          {isAdmin ? 'Quitter Mode Admin' : 'Mode Admin'}
        </button>
      </div>
    </header>
  );
};

export default Header;