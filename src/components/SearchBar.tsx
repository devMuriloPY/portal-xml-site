import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nome ou CNPJ..."
        className="block w-full pl-11 pr-4 py-3 border-0 rounded-xl bg-white shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 transition-shadow duration-200"
      />
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-sm text-gray-400">
        Pressione Enter para buscar
      </div>
    </div>
  );
}