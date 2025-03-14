import React, { useState } from 'react';
import { X, Building2, Users } from 'lucide-react';
import { Accountant } from '../types/index';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
          >
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

              <div className="mt-6">
                <button
                  onClick={() => setShowConfirmLogout(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors font-medium"
                >
                  Sair
                </button>
              </div>
            </div>
          </motion.div>

          {/* Modal de confirmação de logout */}
          <AnimatePresence>
            {showConfirmLogout && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              >
                <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Deseja realmente sair?</h3>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setShowConfirmLogout(false)}
                      className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};