"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Phone, Mail, Building, Wifi, WifiOff } from "lucide-react"
import type { Client } from "../types"
import { Link } from "react-router-dom"

interface ClientListProps {
  clients: Client[]
}

export const ClientList: React.FC<ClientListProps> = ({ clients }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return ""
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {clients.map((client) => (
        <Link
          key={client.id}
          to={`/clientes/${client.id}`}
          state={{ client }}
          className="block"
        >
          <motion.div
            variants={item}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3
              }
            }}
            className="bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-lg cursor-pointer"
          >
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-800 truncate">{client.name}</h3>
                    {/* Indicador de status online/offline */}
                    <div className="flex items-center gap-1">
                      {client.isOnline ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Wifi className="w-4 h-4" />
                          <span className="text-xs font-medium">Online</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-500">
                          <WifiOff className="w-4 h-4" />
                          <span className="text-xs font-medium">Offline</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-slate-500">
                    <Building className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{formatCNPJ(client.cnpj) || "CNPJ não informado"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-blue-100 pt-4 space-y-2">
                <div className="flex items-center text-sm text-slate-600">
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="truncate">{client.email || "Email não informado"}</span>
                </div>

                <div className={`flex items-center text-sm ${
                  client.phone ? "text-slate-600" : "text-slate-400"
                }`}>
                  <Phone className="w-4 h-4 mr-2 text-blue-400" />
                  <span>{client.phone || "Telefone não informado"}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-100 rounded-b-2xl">
              {/* Status online/offline na parte inferior */}
              <div className="flex items-center justify-center gap-2">
                {client.isOnline ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Conectado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs font-medium">Desconectado</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  )
}
