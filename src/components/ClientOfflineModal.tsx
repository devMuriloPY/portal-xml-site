import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, WifiOff, Phone, AlertTriangle } from 'lucide-react';
import type { Client } from '../types';

interface ClientOfflineModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

const ClientOfflineModal: React.FC<ClientOfflineModalProps> = ({ isOpen, onClose, client }) => {
  if (!client) return null;

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return "";
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-red-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <WifiOff className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Cliente Offline</h3>
                    <p className="text-sm text-gray-600">Ação necessária</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Client Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">{client.name}</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">CNPJ:</span> {formatCNPJ(client.cnpj) || "Não informado"}
                </p>
                {client.phone && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Telefone:</span> {client.phone}
                  </p>
                )}
              </div>

              {/* Warning Message */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-amber-800 mb-2">Cliente Desconectado</h5>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Este cliente está offline no momento. Para acessar os dados fiscais, é necessário 
                    que o computador do cliente esteja ligado e conectado à internet.
                  </p>
                </div>
              </div>

              {/* Action Required */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-blue-800 mb-2">Próximos Passos</h5>
                    <p className="text-sm text-blue-700 leading-relaxed mb-3">
                      Entre em contato com o cliente para solicitar que:
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        Ligue o computador
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        Verifique a conexão com a internet
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Entendi
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ClientOfflineModal;
