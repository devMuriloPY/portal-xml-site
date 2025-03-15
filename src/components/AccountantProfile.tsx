"use client"

import type React from "react"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Building, Mail, Phone, Users } from "lucide-react"
import type { Accountant } from "../types"

interface AccountantProfileProps {
  accountant: Accountant
  isOpen: boolean
  onClose: () => void
}

export const AccountantProfile: React.FC<AccountantProfileProps> = ({ accountant, isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return "CNPJ não informado"
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fundo escurecido */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Painel lateral */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-slate-900 dark:to-blue-950 shadow-xl z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-blue-100 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Perfil do Contador</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 p-6">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-blue-700" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{accountant.name}</h3>
                  <p className="text-blue-600 dark:text-blue-300 mt-1 font-medium">Contador</p>
                </div>

                <div className="space-y-6">
                  {/* Total de clientes */}
                  <div className="bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl p-4 flex items-center shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Total de Clientes</p>
                      <p className="text-xl font-semibold text-slate-800 dark:text-white">{accountant.totalClients}</p>
                    </div>
                  </div>

                  {/* Informações de Contato */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-white">Informações de Contato</h4>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Building className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-slate-500">CNPJ</p>
                          <p className="text-slate-800 dark:text-white">{formatCNPJ(accountant.cnpj)}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <a
                            href={`mailto:${accountant.email}`}
                            className="text-blue-700 hover:underline dark:text-blue-400"
                          >
                            {accountant.email}
                          </a>
                        </div>
                      </div>

                      {accountant.phone && (
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-slate-500">Telefone</p>
                            <a
                              href={`tel:${accountant.phone}`}
                              className="text-blue-700 hover:underline dark:text-blue-400"
                            >
                              {accountant.phone}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rodapé com botão */}
              <div className="p-6 border-t border-blue-100 dark:border-slate-700">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
