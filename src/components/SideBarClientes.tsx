"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Building2, Search, Users, X } from "lucide-react"
import { api } from "../services/api"

interface Cliente {
  id_cliente: number
  nome: string
  cnpj: string
  email: string
  telefone: string
}

interface SidebarClientesProps {
  clienteAtualId?: string
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  onClientSelect?: (clientId: string, client: Cliente) => void
  isMobile?: boolean
}

const SidebarClientes: React.FC<SidebarClientesProps> = ({
  clienteAtualId,
  isOpen: isOpenProp,
  onOpenChange,
  onClientSelect,
  isMobile: isMobileProp,
}) => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filtro, setFiltro] = useState<string>("")
  const [isMobile, setIsMobile] = useState(isMobileProp !== undefined ? isMobileProp : window.innerWidth < 1024)
  const [_isOpen, _setIsOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isMobileProp !== undefined) {
      setIsMobile(isMobileProp)
    }
  }, [isMobileProp])

  const isOpen = isOpenProp !== undefined ? isOpenProp : _isOpen
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value)
    } else {
      _setIsOpen(value)
    }
  }

  useEffect(() => {
    if (isMobileProp !== undefined) return
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024
      setIsMobile(newIsMobile)
      if (!newIsMobile) {
        setIsOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [onOpenChange, isMobileProp])

  useEffect(() => {
    const buscarClientes = async () => {
      try {
        const res = await api.get("/auth/clientes")
        setClientes(res.data)
      } catch (err) {
        console.error("Erro ao buscar clientes:", err)
      }
    }
    buscarClientes()
  }, [])

  const clientesFiltrados = clientes.filter((cliente) => {
    const termo = filtro.toLowerCase()
    const cnpjFormatado = cliente.cnpj.replace(/\D/g, "")
    const termoFormatado = filtro.replace(/\D/g, "")
    const clienteIdStr = String(cliente.id_cliente)

    return (
      clienteIdStr !== clienteAtualId &&
      (cliente.nome.toLowerCase().includes(termo) || cnpjFormatado.includes(termoFormatado))
    )
  })

  const handleClientClick = (cliente: Cliente) => {
    const clientId = String(cliente.id_cliente)

    if (onClientSelect) {
      onClientSelect(clientId, cliente)
    } else {
      navigate(`/clientes/${clientId}`, {
        state: { client: cliente },
      })
      if (isMobile) setIsOpen(false)
    }
  }

  return (
    <aside
      className={`bg-white border-r shadow-lg overflow-hidden transition-all duration-300 z-40 
        ${isMobile ? "w-[85%] max-w-[300px]" : "w-72"}
        ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}`}
      style={{ 
        position: 'fixed',
        top: '4rem',
        left: '0',
        height: 'calc(100vh - 4rem)',
        zIndex: 40,
        transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
        willChange: 'transform'
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-white" />
          <h2 className="font-semibold text-white">Lista de Clientes</h2>
        </div>
        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-white hover:bg-white/20 transition-colors"
            aria-label="Fechar sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        </div>

        <div className="p-4 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar cliente..."
            className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          />
        </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ overflowY: 'auto' }}>
        {clientesFiltrados.length > 0 ? (
          <ul className="divide-y">
            {clientesFiltrados.map((cliente) => (
              <li
                key={cliente.id_cliente}
                onClick={() => handleClientClick(cliente)}
                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors flex items-start gap-3"
              >
                <div className="bg-blue-100 text-blue-700 p-2 rounded-full flex-shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-gray-800 font-medium truncate">{cliente.nome}</p>
                  <p className="text-gray-500 text-xs">{cliente.cnpj}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="bg-gray-100 p-3 rounded-full mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Nenhum cliente encontrado</p>
            <p className="text-sm text-gray-400 mt-1">Tente outro termo de busca</p>
          </div>
        )}
        </div>

        {clienteAtualId && (
        <div className="p-4 border-t bg-blue-50">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-blue-700">Cliente atual</p>
              <p className="text-sm font-medium text-gray-800 truncate">
                {clientes.find((c) => String(c.id_cliente) === clienteAtualId)?.nome || `ID: ${clienteAtualId}`}
              </p>
            </div>
          </div>
        </div>
        )}
      </div>
    </aside>
  )
}

export default SidebarClientes
