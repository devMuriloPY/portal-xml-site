import React from 'react';
import { X, Building2, Users, Mail, Phone } from 'lucide-react';
import { Accountant } from '../types/index';

interface AccountantProfileProps {
  accountant: Accountant;
  isOpen: boolean;
  onClose: () => void;
}

export const AccountantProfile: React.FC<AccountantProfileProps> = ({
  accountant,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="relative p-6 pb-4">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">
                {accountant.name.charAt(0)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{accountant.name}</h2>
            <p className="text-sm text-gray-500 mt-1">Contador</p>
          </div>

          <div className="space-y-4 bg-gray-50 rounded-xl p-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">CNPJ</label>
              <div className="flex items-center text-gray-900">
                <Building2 className="w-4 h-4 mr-2 text-blue-500" />
                <span className="font-medium">{accountant.cnpj}</span>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Total de Clientes</label>
              <div className="flex items-center text-gray-900">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                <span className="font-medium">{accountant.totalClients} clientes ativos</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
              <Mail className="w-4 h-4" />
              <span className="font-medium">Enviar E-mail</span>
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-medium">Ligar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}