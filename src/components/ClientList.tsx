"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Phone, Mail, Building, User, Eye } from "lucide-react"
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
        <motion.div
          key={client.id}
          variants={item}
          whileHover={{ y: -4, scale: 1.01 }}
          className="bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 truncate">{client.name}</h3>
                <div className="mt-2 flex items-center text-sm text-slate-500">
                  <Building className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{formatCNPJ(client.cnpj) || "CNPJ não informado"}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            </div>

            <div className="mt-5 border-t border-blue-100 pt-4 space-y-2">
              <a
                href={`mailto:${client.email}`}
                className="flex items-center text-sm text-slate-600 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2 text-blue-400" />
                <span className="truncate">{client.email || "Email não informado"}</span>
              </a>

              <a
                href={client.phone ? `tel:${client.phone}` : "#"}
                className={`flex items-center text-sm ${
                  client.phone ? "text-slate-600 hover:text-blue-600" : "text-slate-400"
                } transition-colors`}
              >
                <Phone className="w-4 h-4 mr-2 text-blue-400" />
                <span>{client.phone || "Telefone não informado"}</span>
              </a>
            </div>
          </div>

          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-100 rounded-b-2xl flex justify-end">
            <Link
              to={`/clientes/${client.id}`}
              state={{ client }}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Ver detalhes
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
