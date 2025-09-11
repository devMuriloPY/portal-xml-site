"use client"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { ArrowLeft, Building2, Calendar, Mail, Phone, Wifi, WifiOff, Menu, X, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"
import SidebarClientes from "../components/SideBarClientes"
import { useCliente } from "../hooks/useCliente"
import { useHistoricoSolicitacoes } from "../hooks/useHistoricoSolicitacoes"
import { SolicitacaoItem } from "../components/SolicitacaoItem"
import { AccountantProfile } from "../components/AccountantProfile"
import { api } from "../services/api"
import type { Accountant } from "../types"

const ClientDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [quantidadeVisivel, setQuantidadeVisivel] = useState(3)
  const [dataInicial, setDataInicial] = useState("")
  const [dataFinal, setDataFinal] = useState("")
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [isLoading, setIsLoading] = useState(false)

  // ✅ Passamos o fallbackCliente vindo da Dashboard (caso tenha sido enviado)
  const { cliente, isOnline, refetch } = useCliente(id, location.state?.client || null)
  const { solicitacoes, setSolicitacoes, carregar } = useHistoricoSolicitacoes(id)

  // ✅ Recuperar contador do localStorage
  const accountantRaw = localStorage.getItem("accountant")
  const accountant: Accountant | null = accountantRaw ? JSON.parse(accountantRaw) : null

  // Detect if we're on mobile based on screen width
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1024
      setIsMobile(newIsMobile)
      // Auto-close sidebar on resize to desktop
      if (!newIsMobile) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Efeito para recarregar os dados quando o ID do cliente mudar
  useEffect(() => {
    if (!id) return

    console.log("🔄 Carregando dados do cliente", { id, clientFromState: location.state?.client })

    setIsLoading(true)
    // 🗓️ Define automaticamente datas do mês anterior
    const hoje = new Date()
    const primeiroDiaMesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
    const ultimoDiaMesPassado = new Date(hoje.getFullYear(), hoje.getMonth(), 0)

    setDataInicial(primeiroDiaMesPassado.toISOString().split("T")[0])
    setDataFinal(ultimoDiaMesPassado.toISOString().split("T")[0])

    setQuantidadeVisivel(3)

    const carregarTudo = async () => {
      try {
        await refetch()
        const solicitacoesAtualizadas = await carregar()
        setSolicitacoes(solicitacoesAtualizadas)
      } catch (error) {
        console.error("Erro ao carregar dados do cliente:", error)
        toast.error("Erro ao carregar dados do cliente")
      } finally {
        setIsLoading(false)
      }
    }

    carregarTudo()
  }, [id]) // ✅ apenas 'id' como dependência!

  const handleSolicitacao = async () => {
    if (!dataInicial || !dataFinal) {
      toast.error("Preencha as duas datas para continuar.")
      return
    }
    if (new Date(dataInicial) > new Date(dataFinal)) {
      toast.error("A data inicial deve ser menor ou igual à data final.")
      return
    }
    if (!isOnline) {
      toast.error("O cliente precisa estar online para enviar a solicitação.")
      return
    }

    try {
      const payload = {
        id_cliente: Number(id),
        data_inicio: dataInicial,
        data_fim: dataFinal,
      }
      const res = await api.post("/auth/solicitacoes", payload)
      if (res.data?.id_solicitacao) {
        toast.success("📨 Solicitação registrada com sucesso!")
        setDataInicial("")
        setDataFinal("")
        const atualizadas = await carregar()
        setSolicitacoes(atualizadas)
        setQuantidadeVisivel(3)
      }
    } catch {
      toast.error("Erro ao enviar solicitação.")
    }
  }

  const handleExcluir = async (id_solicitacao: number) => {
    try {
      await api.delete("/auth/solicitacoes", { data: { id_solicitacao } })
      toast.success("🗑️ Solicitação excluída com sucesso!")
      const atualizadas = await carregar()
      setSolicitacoes(atualizadas)
    } catch {
      toast.error("Erro ao excluir solicitação.")
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Função para lidar com a mudança de cliente na sidebar
  const handleClientChange = async (newClientId: string, newClient: any) => {
    navigate(`/clientes/${newClientId}`, {
      state: { client: newClient },
    })

    setDataInicial("")
    setDataFinal("")
    setQuantidadeVisivel(3)
    setIsSidebarOpen(false)
  }

  // Custom Header Component
  const CustomHeader = () => {
    return (
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 border-b sticky top-0 z-20 px-4 shadow-md">
        <div className="flex items-center justify-between h-16">
          {/* Título à esquerda */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-lg font-bold text-white whitespace-nowrap hover:text-blue-200 transition-colors cursor-pointer"
            >
              Portal XML
            </button>
          </div>

          {/* Hamburger menu button - only visible on mobile and when sidebar is closed */}
          {isMobile && !isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-opacity-50"
              aria-label="Abrir menu de clientes"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>
    )
  }

  // Mobile sidebar overlay with close button
  const MobileSidebarOverlay = () => {
    if (!isMobile || !isSidebarOpen) return null

    return (
      <div className="fixed inset-0 bg-black/10 z-50 lg:hidden top-16" onClick={toggleSidebar}>
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white text-gray-700 shadow-lg"
          onClick={(e) => {
            e.stopPropagation()
            toggleSidebar()
          }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarClientes
          clienteAtualId={id}
          isOpen={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          onClientSelect={handleClientChange}
          isMobile={isMobile} // Pass isMobile prop if your SidebarClientes component accepts it
        />
        <div className="flex-1 flex flex-col">
          <CustomHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Carregando dados do cliente...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-6 sm:p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Cliente não encontrado</h2>
          <p className="text-gray-500 mt-2 mb-6">Não foi possível encontrar os dados deste cliente.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao painel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header que ocupa toda a largura */}
      <CustomHeader />
      
      <div className="flex">
        {/* Pass the open state to SidebarClientes */}
        <SidebarClientes
          clienteAtualId={id}
          isOpen={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          onClientSelect={handleClientChange}
          isMobile={isMobile} // Pass isMobile prop if your SidebarClientes component accepts it
        />

        {/* Overlay with close button when sidebar is open on mobile */}
        {isMobile && isSidebarOpen && <MobileSidebarOverlay />}

        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-3 sm:p-6 lg:ml-72 overflow-x-hidden">
            <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Detalhes do Cliente</h1>
                <p className="text-sm text-gray-500">Visualize e gerencie informações do cliente</p>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-medium rounded-lg border border-blue-100 hover:bg-blue-50 transition shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header com status */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="max-w-full">
                    <h2 className="text-xl sm:text-2xl font-bold text-white break-words max-w-full overflow-hidden">
                      {cliente.name || cliente.name}
                    </h2>
                    <p className="text-blue-100 mt-1 text-sm">ID: {id}</p>
                  </div>
                  {isOnline ? (
                    <div className="flex-shrink-0 flex items-center gap-2 bg-green-500 px-4 py-2 rounded-lg text-white shadow-lg">
                      <Wifi className="w-5 h-5 animate-pulse" />
                      <span className="font-medium">Online</span>
                    </div>
                  ) : (
                    <div className="flex-shrink-0 flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg text-white shadow-lg">
                      <WifiOff className="w-5 h-5" />
                      <span className="font-medium">Offline</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Informações do cliente - versão compacta */}
              <div className="p-4 sm:p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Informações do Cliente</h3>
                <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-500 mr-1">CNPJ:</span>
                    <span className="text-sm font-medium text-gray-800">{cliente.cnpj}</span>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg w-full sm:w-auto overflow-hidden">
                    <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-gray-500 mr-1 flex-shrink-0">Email:</span>
                    <span className="text-sm font-medium text-gray-800 truncate">{cliente.email}</span>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-500 mr-1">Telefone:</span>
                    <span className="text-sm font-medium text-gray-800">{cliente.phone || "Não informado"}</span>
                  </div>
                </div>
              </div>

              {/* Solicitar XML */}
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Solicitar XML</h3>
                
                {/* Cards de datas padrão */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-3">Períodos rápidos:</p>
                  <div className="flex gap-3">
                    {(() => {
                      const hoje = new Date()
                      const meses = []
                      
                      // Gerar os últimos 4 meses (sem contar o atual)
                      for (let i = 4; i >= 1; i--) {
                        const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1)
                        const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() - i + 1, 0)
                        meses.push({ mes, ultimoDiaMes })
                      }
                      
                      const formatarMes = (data: Date) => {
                        const nomeMes = data.toLocaleDateString('pt-BR', { month: 'long' })
                        const ano = data.getFullYear()
                        return `${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)} ${ano}`
                      }
                      
                      const aplicarPeriodo = (dataInicial: string, dataFinal: string) => {
                        setDataInicial(dataInicial)
                        setDataFinal(dataFinal)
                      }
                      
                      return meses.map(({ mes, ultimoDiaMes }, index) => (
                        <button
                          key={index}
                          onClick={() => aplicarPeriodo(
                            mes.toISOString().split('T')[0],
                            ultimoDiaMes.toISOString().split('T')[0]
                          )}
                          className="flex-1 p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-lg transition-colors text-left"
                        >
                          <div className="text-sm font-medium mb-1">
                            {formatarMes(mes)}
                          </div>
                          <div className="text-xs text-blue-600">
                            {mes.toLocaleDateString('pt-BR')} - {ultimoDiaMes.toLocaleDateString('pt-BR')}
                          </div>
                        </button>
                      ))
                    })()}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          value={dataInicial}
                          onChange={(e) => setDataInicial(e.target.value)}
                          className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          value={dataFinal}
                          onChange={(e) => setDataFinal(e.target.value)}
                          className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleSolicitacao}
                        disabled={!isOnline}
                        className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium transition-colors ${
                          isOnline
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-red-300 text-white cursor-not-allowed"
                        }`}
                      >
                        {isOnline ? "Solicitar" : "Cliente Offline"}
                      </button>
                    </div>
                  </div>
                  {!isOnline && (
                    <p className="mt-2 text-sm text-red-500">
                      O cliente precisa estar online para enviar solicitações.
                    </p>
                  )}
                </div>
              </div>

              {/* Histórico de Solicitações */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Histórico de Solicitações</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    {solicitacoes.length === 0 
                      ? "Nenhuma solicitação" 
                      : solicitacoes.length === 1 
                        ? "1 solicitação" 
                        : `${solicitacoes.length} solicitações`
                    }
                  </span>
                </div>

                {solicitacoes.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">Nenhuma solicitação encontrada</p>
                    <p className="text-sm text-gray-400 mt-1">
                      As solicitações de XML aparecerão aqui quando forem criadas.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 overflow-x-auto">
                    {solicitacoes.slice(0, quantidadeVisivel).map((item) => (
                      <SolicitacaoItem key={item.id_solicitacao} item={item} onDelete={handleExcluir} />
                    ))}

                    {solicitacoes.length > quantidadeVisivel && (
                      <div className="text-center pt-4">
                        <button
                          onClick={() => setQuantidadeVisivel((prev) => prev + 3)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Mostrar mais ({solicitacoes.length - quantidadeVisivel} restantes)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Floating status indicator for better visibility */}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-10">
              {isOnline ? (
                <div className="flex items-center gap-2 bg-green-500 px-3 sm:px-4 py-2 sm:py-3 rounded-full text-white shadow-lg">
                  <Wifi className="w-5 h-5 animate-pulse" />
                  <span className="font-medium text-sm sm:text-base">Cliente Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-full text-white shadow-lg">
                  <WifiOff className="w-5 h-5" />
                  <span className="font-medium text-sm sm:text-base">Cliente Offline</span>
                </div>
              )}
            </div>
          </div>
        </main>
        </div>
      </div>

      {isProfileOpen && accountant && (
        <AccountantProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} accountant={accountant} />
      )}
    </div>
  )
}

export default ClientDetails

