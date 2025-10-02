import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, Search, Check, AlertCircle } from 'lucide-react';
import type { Client } from '../types';
import { useBatchRequests } from '../hooks/useBatchRequests';
import toast from 'react-hot-toast';

/** ---------- UI helpers (apenas visual + datas padrão) ---------- */
function toYMD(date: Date) {
  // garante YYYY-MM-DD sem fuso quebrando o input[type=date]
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getPreviousMonthRange(ref = new Date()) {
  // início: dia 1 do mês anterior
  // fim: último dia do mês anterior
  const start = new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
  const end = new Date(ref.getFullYear(), ref.getMonth(), 0);
  return { start: toYMD(start), end: toYMD(end) };
}

/** ---------- Item de cliente (apenas visual) ---------- */
const ClientItem = memo(({ client, isSelected, onToggle }: {
  client: Client;
  isSelected: boolean;
  onToggle: (id: string) => void;
}) => (
  <label
    className={`group flex items-center gap-3 px-4 py-3 cursor-pointer transition
                hover:bg-blue-50/60`}
  >
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => onToggle(client.id)}
      className="h-4 w-4 accent-blue-600 rounded border-gray-300 focus:ring-blue-500"
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-900 truncate">
          {client.name}
        </span>
        <span className="text-[10px] font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
          Online
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-0.5">
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

  /** ---------- Memós (sem mudar lógica) ---------- */
  const onlineClients = useMemo(
    () => clients.filter(client => client.isOnline),
    [clients]
  );

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return onlineClients;
    const searchLower = searchTerm.toLowerCase();
    return onlineClients.filter(client =>
      client.name.toLowerCase().includes(searchLower) ||
      client.cnpj.includes(searchTerm)
    );
  }, [onlineClients, searchTerm]);

  /** ---------- Validações (inalteradas) ---------- */
  const validateDates = () => {
    const newErrors: Record<string, string> = {};

    if (!dataInicio) newErrors.dataInicio = 'Data de início é obrigatória';
    if (!dataFim) newErrors.dataFim = 'Data de fim é obrigatória';

    if (dataInicio && dataFim && new Date(dataInicio) > new Date(dataFim)) {
      newErrors.dataFim = 'Data de fim deve ser posterior à data de início';
    }

    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      const diffInMonths = (fim.getFullYear() - inicio.getFullYear()) * 12 + (fim.getMonth() - inicio.getMonth());
      if (diffInMonths > 12) newErrors.dataFim = 'Período máximo permitido é de 12 meses';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  /** ---------- Handlers (inalterados) ---------- */
  const toggleClient = useCallback((clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId]
    );
    if (errors.clients) setErrors(prev => ({ ...prev, clients: '' }));
  }, [errors.clients]);

  const selectAll = useCallback(() => {
    const allFilteredIds = filteredClients.map(client => client.id);
    setSelectedClients(allFilteredIds);
    setErrors(prev => ({ ...prev, clients: '' }));
  }, [filteredClients]);

  const deselectAll = useCallback(() => {
    setSelectedClients([]);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDates() || !validateClients()) return;

    try {
      const clientIdsFormatted = selectedClients.map(String);
      if (clientIdsFormatted.length === 0) throw new Error('Nenhum cliente selecionado');
      if (!dataInicio || !dataFim) throw new Error('Datas de início e fim são obrigatórias');

      const response = await createBatch({
        client_ids: clientIdsFormatted,
        data_inicio: dataInicio,
        data_fim: dataFim
      });

      toast.success('Lote criado com sucesso!');
      onSuccess(response.batch_id);
      onClose();
    } catch (error: any) {
      console.error('❌ Erro no handleSubmit:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar lote');
    }
  }, [selectedClients, dataInicio, dataFim, createBatch, onSuccess, onClose]);

  /** ---------- Reset ao fechar (inalterado) ---------- */
  useEffect(() => {
    if (!isOpen) {
      setSelectedClients([]);
      setSearchTerm('');
      setDataInicio('');
      setDataFim('');
      setErrors({});
    }
  }, [isOpen]);

  /** ---------- Datas padrão: exatamente o mês anterior ---------- */
  useEffect(() => {
    if (isOpen && !dataInicio && !dataFim) {
      const { start, end } = getPreviousMonthRange(new Date());
      setDataInicio(start);
      setDataFim(end);
    }
  }, [isOpen, dataInicio, dataFim]);

  if (!isOpen) return null;

  /** =================== MARKUP (somente visual) =================== */
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop com sutil granulado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden border border-blue-50"
        >
          {/* Header sticky com nova hierarquia */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50 to-indigo-50/60 px-6 py-4 border-b border-blue-100/70 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl shadow-sm">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-800">
                    Solicitar XML em Lotes
                  </h3>
                  <p className="text-sm text-gray-600">
                    Selecione clientes online e defina o período
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-blue-100 rounded-xl transition-colors"
                aria-label="Fechar modal"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Período */}
              <section className="rounded-xl border border-blue-100/70 bg-blue-50/20 p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-blue-100">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </span>
                  Período
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Data de Início
                    </label>
                    <div className={`flex items-center rounded-lg border ${errors.dataInicio ? 'border-red-300' : 'border-gray-300'} bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500`}>
                      <div className="pl-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => {
                          setDataInicio(e.target.value);
                          if (errors.dataInicio) setErrors(prev => ({ ...prev, dataInicio: '' }));
                        }}
                        className="w-full px-3 py-2 rounded-lg outline-none bg-transparent"
                      />
                    </div>
                    {errors.dataInicio && (
                      <p className="text-xs text-red-600 mt-1">{errors.dataInicio}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Data de Fim
                    </label>
                    <div className={`flex items-center rounded-lg border ${errors.dataFim ? 'border-red-300' : 'border-gray-300'} bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500`}>
                      <div className="pl-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={dataFim}
                        onChange={(e) => {
                          setDataFim(e.target.value);
                          if (errors.dataFim) setErrors(prev => ({ ...prev, dataFim: '' }));
                        }}
                        className="w-full px-3 py-2 rounded-lg outline-none bg-transparent"
                      />
                    </div>
                    {errors.dataFim && (
                      <p className="text-xs text-red-600 mt-1">{errors.dataFim}</p>
                    )}
                  </div>
                </div>

                {/* hint do mês anterior */}
                <p className="mt-3 text-[11px] text-gray-500">
                  Dica: por padrão preenche com o mês anterior completo.
                </p>
              </section>

              {/* Seleção de Clientes */}
              <section className="rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
                      <Users className="h-4 w-4 text-blue-600" />
                    </span>
                    Clientes Online <span className="text-gray-500 font-normal">({onlineClients.length})</span>
                  </h4>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Selecionar Todos
                    </button>
                    <button
                      type="button"
                      onClick={deselectAll}
                      className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Limpar
                    </button>
                  </div>
                </div>

                {/* Busca */}
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou CNPJ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* Lista */}
                <div className="mt-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto bg-white">
                  {filteredClients.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
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

                {/* feedback */}
                <div className="mt-2 flex flex-col gap-1">
                  {errors.clients && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.clients}
                    </p>
                  )}
                  {selectedClients.length > 0 && (
                    <div className="inline-flex items-center gap-2">
                      <span className="text-[11px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                        {selectedClients.length} selecionado(s)
                      </span>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Footer sticky mais “clean” */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
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
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
