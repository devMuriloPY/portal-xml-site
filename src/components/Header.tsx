"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Menu, X } from "lucide-react"

interface HeaderProps {
  onProfileClick: () => void
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      } bg-gradient-to-r from-blue-500 to-blue-600`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Título do sistema */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xl font-bold text-white"
          >
            Portal XML
          </motion.div>

          {/* Ações à direita */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onProfileClick}
              className="p-2 rounded-full text-white hover:bg-blue-500/30 transition-colors"
              aria-label="Abrir perfil"
            >
              <User className="h-5 w-5" />
            </motion.button>

            {/* Botão de menu mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-white hover:bg-blue-500/30 transition-colors"
              aria-label="Abrir menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu (vazio por enquanto) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-blue-600"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {/* Espaço reservado para menu futuro */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
