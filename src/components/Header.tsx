import React from 'react';
import { UserCircle } from 'lucide-react';

interface HeaderProps {
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  return (
    <header className="bg-gradient-to-r from-primary to-secondary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Portal XML
            </h1>
            <p className="text-blue-100 text-sm mt-1">Gerenciamento de Clientes</p>
          </div>
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200 border border-white/20 backdrop-blur-sm"
          >
            <UserCircle className="w-5 h-5" />
            <span className="font-medium">Meu Perfil</span>
          </button>
        </div>
      </div>
    </header>
  );
}