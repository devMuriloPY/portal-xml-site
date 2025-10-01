import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Search, Check, AlertCircle } from 'lucide-react';
import type { Client } from '../types';
import { useBatchRequests } from '../hooks/useBatchRequests';
import toast from 'react-hot-toast';

// Componente otimizado para item de cliente
const ClientItem = memo(({ client, isSelected, onToggle }: {
  client: Client;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) => (
  <label className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => onToggle(client.id)}
      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <div className="ml-3 flex-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">
          {client.name}
        </span>
        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
          Online
        </span>
      </div>
      <p className="text-xs text-gray-500">
        CNPJ: {client.cnpj}
      </p>
    </div>
  </label>
));

interface BatchRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (batchId: string) => void;
  clients: Client[];
}

const BatchRequestModal: React.FC<BatchRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  clients
}) => {
  const { createBatch, isLoading } = useBatchRequests();
  
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtrar apenas clientes online (memoizado)
  const onlineClients = useMemo(() => 
    clients.filter(client => client.isOnline), 
    [clients]
  );

  // Filtrar clientes por termo de busca (memoizado)
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return onlineClients;
    
    const searchLower = searchTerm.toLowerCase();
    return onlineClients.filter(client =>
      client.name.toLowerCase().includes(searchLower) ||
      client.cnpj.includes(searchTerm)
    );
  }, [onlineClients, searchTerm]);

  // Validar datas
  const validateDates = () => {
    const newErrors: Record<string, string> = {};

    if (!dataInicio) {
      newErrors.dataInicio = 'Data de início é obrigatória';
    }

    if (!dataFim) {
      newErrors.dataFim = 'Data de fim é obrigatória';
    }

    if (dataInicio && dataFim && new Date(dataInicio) > new Date(dataFim)) {
      newErrors.dataFim = 'Data de fim deve ser posterior à data de início';
    }

    // Validar período máximo de 12 meses
    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      const diffInMonths = (fim.getFullYear() - inicio.getFullYear()) * 12 + (fim.getMonth() - inicio.getMonth());
      
      if (diffInMonths > 12) {
        newErrors.dataFim = 'Período máximo permitido é de 12 meses';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar seleção de clientes
  const validateClients = () => {
    if (selectedClients.length === 0) {
      setErrors(prev => ({ ...prev, clients: 'Selecione pelo menos um cliente' }));
      return false;
    }

    if (selectedClients.length > 50) {
      setErrors(prev => ({ ...prev, clients: 'Máximo de 50 clientes por lote' }));
      return false;
    }

    setErrors(prev => ({ ...prev, clients: '' }));
    return true;
  };

  // Selecionar/deselecionar cliente (memoizado)
  const toggleClient = useCallback((clientId: string) => {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
    // Limpar erro de clientes ao selecionar
    if (errors.clients) {
      setErrors(prev => ({ ...prev, clients: '' }));
    }
  }, [errors.clients]);

  // Selecionar todos os clientes filtrados (memoizado)
  const selectAll = useCallback(() => {
    const allFilteredIds = filteredClients.map(client => client.id);
    setSelectedClients(allFilteredIds);
    setErrors(prev => ({ ...prev, clients: '' }));
  }, [filteredClients]);

  // Deselecionar todos (memoizado)
  const deselectAll = useCallback(() => {
    setSelectedClients([]);
  }, []);

  // Submeter formulário (memoizado)
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDates() || !validateClients()) {
      return;
    }

    try {
      console.log("🔍 Dados antes do envio:", {
        selectedClients,
        dataInicio,
        dataFim,
        selectedClientsLength: selectedClients.length
      });

      // Garantir formato correto das datas (YYYY-MM-DD)
      const dataInicioFormat = dataInicio; // Já está no formato correto
      const dataFimFormat = dataFim; // Já está no formato correto
      
      // Garantir que client_ids sejam array de strings
      const clientIdsFormatted = selectedClients.map(id => String(id));
      
      console.log("📅 Datas formatadas:", { 
        dataInicio: dataInicioFormat, 
        dataFim: dataFimFormat 
      });
      
      console.log("🆔 Client IDs formatados:", {
        original: selectedClients,
        formatted: clientIdsFormatted,
        count: clientIdsFormatted.length,
        firstIdType: typeof clientIdsFormatted[0]
      });

      // Validar dados antes do envio
      if (clientIdsFormatted.length === 0) {
        throw new Error('Nenhum cliente selecionado');
      }
      
      if (!dataInicioFormat || !dataFimFormat) {
        throw new Error('Datas de início e fim são obrigatórias');
      }

      const response = await createBatch({
        client_ids: clientIdsFormatted,
        data_inicio: dataInicioFormat,
        data_fim: dataFimFormat
      });

      toast.success('Lote criado com sucesso!');
      onSuccess(response.batch_id);
      onClose();
    } catch (error: any) {
      console.error("❌ Erro no handleSubmit:", error);
      toast.error(error.response?.data?.message || 'Erro ao criar lote');
    }
  }, [selectedClients, dataInicio, dataFim, createBatch, onSuccess, onClose]);

  // Limpar formulário ao fechar
  useEffect(() => {
    if (!isOpen) {
      setSelectedClients([]);
      setSearchTerm('');
      setDataInicio('');
      setDataFim('');
      setErrors({});
    }
  }, [isOpen]);

  // Definir datas padrão (último mês)
  useEffect(() => {
    if (isOpen && !dataInicio && !dataFim) {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      
      setDataInicio(lastMonth.toISOString().split('T')[0]);
      setDataFim(today.toISOString().split('T')[0]);
    }
  }, [isOpen, dataInicio, dataFim]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Solicitar XML em Lotes</h3>
                  <p className="text-sm text-gray-600">Selecione os clientes e período desejado</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[calc(90vh-80px)]">
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Período */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Período
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      value={dataInicio}
                      onChange={(e) => {
                        setDataInicio(e.target.value);
                        if (errors.dataInicio) {
                          setErrors(prev => ({ ...prev, dataInicio: '' }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.dataInicio ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.dataInicio && (
                      <p className="text-xs text-red-600 mt-1">{errors.dataInicio}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Fim
                    </label>
                    <input
                      type="date"
                      value={dataFim}
                      onChange={(e) => {
                        setDataFim(e.target.value);
                        if (errors.dataFim) {
                          setErrors(prev => ({ ...prev, dataFim: '' }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.dataFim ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.dataFim && (
                      <p className="text-xs text-red-600 mt-1">{errors.dataFim}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Seleção de Clientes */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Clientes Online ({onlineClients.length})
                  </h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Selecionar Todos
                    </button>
                    <button
                      type="button"
                      onClick={deselectAll}
                      className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Limpar
                    </button>
                  </div>
                </div>

                {/* Busca */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou CNPJ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Lista de Clientes */}
                <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente online disponível'}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredClients.map((client) => (
                        <ClientItem
                          key={client.id}
                          client={client}
                          isSelected={selectedClients.includes(client.id)}
                          onToggle={toggleClient}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {errors.clients && (
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.clients}
                  </p>
                )}

                {selectedClients.length > 0 && (
                  <p className="text-xs text-blue-600 mt-2">
                    {selectedClients.length} cliente(s) selecionado(s)
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || selectedClients.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Criar Lote
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BatchRequestModal;
