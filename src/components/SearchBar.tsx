"use client"

import type React from "react"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative rounded-xl shadow-md bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
        {/* Ícone de busca */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-blue-600" />
        </div>

        {/* Campo de busca */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar por nome ou CNPJ..."
          className="w-full pl-12 pr-10 py-3 rounded-xl bg-transparent text-blue-900 placeholder-blue-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200"
        />

        {/* Botão de limpar */}
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-blue-600 transition-colors"
            aria-label="Limpar busca"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  )
}
