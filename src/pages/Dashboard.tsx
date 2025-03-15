"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "../components/Header"
import { SearchBar } from "../components/SearchBar"
import { ClientList } from "../components/ClientList"
import { AccountantProfile } from "../components/AccountantProfile"
import { api } from "../services/api"
import type { Client, Accountant } from "../types/index"
import { motion, AnimatePresence } from "framer-motion"

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [accountant, setAccountant] = useState<Accountant | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
        }))

        setClients(formattedClients)
        setFilteredClients(formattedClients)

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

  const handleSearch = (value: string) => {
    setSearchTerm(value)

    const normalizedText = value.toLowerCase().trim()
    const numericText = value.replace(/\D/g, "").trim()
    const isNumericSearch = /^\d+$/.test(numericText)

    const filtered = clients.filter((client) => {
      const name = String(client.name || "").toLowerCase().trim()
      const cnpj = String(client.cnpj || "").replace(/\D/g, "")
      return name.includes(normalizedText) || (isNumericSearch && cnpj.includes(numericText))
    })

    setFilteredClients(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onProfileClick={() => setIsProfileOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <SearchBar value={searchTerm} onChange={handleSearch} />
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
    </div>
  )
}

export default Dashboard
