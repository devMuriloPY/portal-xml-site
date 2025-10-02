"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Header } from "../components/Header"
import { SearchBar } from "../components/SearchBar"
import { ClientList } from "../components/ClientList"
import { AccountantProfile } from "../components/AccountantProfile"
import { FeedbackModal } from "../components/FeedbackModal"
import BatchRequestModal from "../components/BatchRequestModal"
import BatchProgressModal from "../components/BatchProgressModal"
import { api } from "../services/api"
import type { Client, Accountant } from "../types/index"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Users } from "lucide-react"
import { useClientesOnline } from "../hooks/useClientesOnline"

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [accountant, setAccountant] = useState<Accountant | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false)
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [isBatchProgressOpen, setIsBatchProgressOpen] = useState(false)
  const [isBatchProgressMinimized, setIsBatchProgressMinimized] = useState(() => {
    // Recuperar estado do localStorage
    const saved = localStorage.getItem('batchProgressMinimized')
    return saved === 'true'
  })
  const [currentBatchId, setCurrentBatchId] = useState<string | null>(() => {
    // Recuperar batchId do localStorage
    return localStorage.getItem('currentBatchId')
  })
  const [isLoading, setIsLoading] = useState(true)

  // Hook para verificar status online dos clientes
  const { isClienteOnline } = useClientesOnline(clients)

  // Restaurar estado do modal minimizado ao carregar
  useEffect(() => {
    const savedBatchId = localStorage.getItem('currentBatchId')
    const savedMinimized = localStorage.getItem('batchProgressMinimized')
    
    if (savedBatchId && savedMinimized === 'true') {
      setCurrentBatchId(savedBatchId)
      setIsBatchProgressMinimized(true)
      setIsBatchProgressOpen(true) // Garantir que o modal está "aberto" mas minimizado
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const clientsResponse = await api.get("/auth/clientes")
        const formattedClients: Client[] = clientsResponse.data.map((cliente: any) => ({
          id: cliente.id_cliente.toString(),
          name: cliente.nome,
          cnpj: cliente.cnpj,
          email: cliente.email,
          phone: cliente.telefone,
          isOnline: false, // Será atualizado pelo hook
        }))

        setBaseClients(formattedClients)

        const accountantResponse = await api.get("/auth/me")
        const data = accountantResponse.data

        const formattedAccountant: Accountant = {
          id: data.id_contador.toString(),
          name: data.nome,
          cnpj: data.cnpj,
          email: data.email,
          phone: data.telefone || "",
          totalClients: data.total_clientes,
        }

        setAccountant(formattedAccountant)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Estado para clientes base (sem status online)
  const [baseClients, setBaseClients] = useState<Client[]>([]);

  // Memoizar clientes com status online para evitar re-renderizações desnecessárias
  const clientsWithOnlineStatus = useMemo(() => {
    if (baseClients.length === 0) return [];
    
    return baseClients.map(client => ({
      ...client,
      isOnline: isClienteOnline(client.id)
    }));
  }, [baseClients, isClienteOnline]);

  // Memoizar filtro de clientes para evitar recálculos desnecessários
  const filteredClientsMemo = useMemo(() => {
    if (!searchTerm.trim()) return clientsWithOnlineStatus;
    
    const normalizedText = searchTerm.toLowerCase().trim();
    const numericText = searchTerm.replace(/\D/g, "").trim();
    const isNumericSearch = /^\d+$/.test(numericText);
    
    return clientsWithOnlineStatus.filter((client) => {
      const name = String(client.name || "").toLowerCase().trim();
      const cnpj = String(client.cnpj || "").replace(/\D/g, "");
      
      return name.includes(normalizedText) || (isNumericSearch && cnpj.includes(numericText));
    });
  }, [clientsWithOnlineStatus, searchTerm]);

  // Atualizar estados apenas quando necessário
  useEffect(() => {
    setClients(clientsWithOnlineStatus);
    setFilteredClients(filteredClientsMemo);
  }, [clientsWithOnlineStatus, filteredClientsMemo]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleBatchSuccess = useCallback((batchId: string) => {
    setCurrentBatchId(batchId);
    setIsBatchProgressOpen(true);
    // Salvar no localStorage
    localStorage.setItem('currentBatchId', batchId);
  }, []);

  const handleCloseBatchProgress = useCallback(() => {
    setIsBatchProgressOpen(false);
    setIsBatchProgressMinimized(false);
    setCurrentBatchId(null);
    // Limpar localStorage
    localStorage.removeItem('currentBatchId');
    localStorage.removeItem('batchProgressMinimized');
  }, []);

  const handleMinimizeBatchProgress = useCallback(() => {
    setIsBatchProgressMinimized(true);
    // Salvar no localStorage
    localStorage.setItem('batchProgressMinimized', 'true');
  }, []);

  const handleMaximizeBatchProgress = useCallback(() => {
    setIsBatchProgressMinimized(false);
    setIsBatchProgressOpen(true);
    // Remover do localStorage
    localStorage.removeItem('batchProgressMinimized');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onProfileClick={() => setIsProfileOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              <SearchBar value={searchTerm} onChange={handleSearch} />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsBatchModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Users className="h-4 w-4" />
              Solicitar em Lotes
            </motion.button>
          </div>
        </motion.div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-20"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                  <p className="mt-4 text-gray-500 font-medium">Carregando clientes...</p>
                </div>
              </motion.div>
            ) : filteredClients.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center py-16 px-4 rounded-2xl bg-white shadow-sm border border-gray-100"
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum cliente encontrado</h3>
                  <p className="text-gray-500 max-w-md">
                    Não encontramos clientes com os critérios de busca. Tente outro nome ou CNPJ.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ClientList clients={filteredClients} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {accountant && isProfileOpen && (
          <AccountantProfile accountant={accountant} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        )}
      </AnimatePresence>

      {/* Botão de Feedback Flutuante */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl z-40"
        title="Enviar Feedback"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Modal de Feedback */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Modal de Solicitação em Lotes - Lazy Loading */}
      {isBatchModalOpen && (
        <BatchRequestModal
          isOpen={isBatchModalOpen}
          onClose={() => setIsBatchModalOpen(false)}
          onSuccess={handleBatchSuccess}
          clients={clients}
        />
      )}

      {/* Modal de Progresso do Lote - Lazy Loading */}
      {currentBatchId && isBatchProgressOpen && !isBatchProgressMinimized && (
        <BatchProgressModal
          isOpen={isBatchProgressOpen}
          onClose={handleCloseBatchProgress}
          onMinimize={handleMinimizeBatchProgress}
          batchId={currentBatchId}
        />
      )}

      {/* Botão para maximizar modal minimizado */}
      {currentBatchId && isBatchProgressMinimized && (
        <button
          onClick={handleMaximizeBatchProgress}
          className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl z-40 flex items-center gap-2"
          title="Maximizar progresso do lote"
        >
          <Users className="w-5 h-5" />
          <span className="text-sm font-medium">Lote em Processo</span>
        </button>
      )}
    </div>
  )
}

export default Dashboard
