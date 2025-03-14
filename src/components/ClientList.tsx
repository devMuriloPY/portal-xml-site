import React from 'react';
import { Phone, Mail, Building2, Eye } from 'lucide-react';
import { Client } from '../types/index';
import { Link } from 'react-router-dom';

interface ClientListProps {
  clients: Client[];
}

export const ClientList: React.FC<ClientListProps> = ({ clients }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <div
          key={client.id}
          className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {client.name}
            </h3>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
              <Building2 className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">{client.cnpj}</span>
            </div>
            <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <a href={`mailto:${client.email}`} className="text-sm">{client.email}</a>
            </div>
            <div className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <a href={`tel:${client.phone}`} className="text-sm">{client.phone}</a>
            </div>
          </div>

          <Link
            to={`/clientes/${client.id}`}
            state={{ client }} // ✅ envia os dados para a rota
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium"
          >
            <Eye className="w-5 h-5" />
            Visualizar
          </Link>
        </div>
      ))}
    </div>
  );
};
