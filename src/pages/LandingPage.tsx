// imports (ajuste aqui)
import { Link } from "react-router-dom"
import { useEffect, useState } from "react" 
import { motion } from "framer-motion"
import {
  FileX2 as FileXml,
  Users,
  ArrowRight,
  Shield,
  Clock,
  ChevronRight,
  Network,
  CheckCircle,
  Download,
  BarChart3,
  FileCheck,
} from "lucide-react"

function TechBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,.6),transparent_70%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      <motion.div
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl bg-blue-300/30"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-16 h-[28rem] w-[28rem] rounded-full blur-3xl bg-indigo-300/30"
        animate={{ x: [0, -25, 0], y: [0, -18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}


/** Pipeline animado: Contador → Portal Contador → Contador (loop) */
function DataFlowProcess() {
  // etapa ativa: 0 = Contador (Solicitando), 1 = Portal (Processando), 2 = Contador (Recebendo)
  const [step, setStep] = useState(0)

  // Durações (mantenha total = segments * SEG_MS)
  const SEG_MS = 2400 // tempo por etapa
  const TOTAL_MS = SEG_MS * 3

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 3), SEG_MS)
    return () => clearInterval(id)
  }, [])

  const labelBase = "text-xs md:text-sm font-medium"
  const muted = "text-gray-500"
  const active = "text-gray-900"

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl">
      <div className="relative rounded-2xl border border-white/50 bg-white/70 p-5 backdrop-blur-xl shadow-lg">
        {/* Cabeçalho com ícones alinhados aos nós */}
        <div className="grid grid-cols-3 items-center mb-4">
          <div className="flex items-center gap-2 justify-start">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-md transition-colors ${step===0 ? "bg-blue-600" : "bg-blue-100"}`}>
              <Users className={`h-5 w-5 ${step===0 ? "text-white" : "text-blue-600"}`} />
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] text-gray-500">Origem</p>
              <p className={`text-sm font-semibold ${step===0 ? "text-gray-900" : "text-gray-700"}`}>Contador</p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <div className={`h-12 w-12 rounded-full border flex items-center justify-center shadow-md transition-colors ${step===1 ? "bg-white border-blue-300" : "bg-white border-blue-100"}`}>
              <FileXml className={`h-6 w-6 ${step===1 ? "text-blue-700" : "text-blue-500"}`} />
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] text-gray-500">Processamento</p>
              <p className={`text-sm font-semibold ${step===1 ? "text-gray-900" : "text-gray-700"}`}>Portal Contador</p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-md transition-colors ${step===2 ? "bg-indigo-600" : "bg-indigo-100"}`}>
              <FileCheck className={`h-5 w-5 ${step===2 ? "text-white" : "text-indigo-600"}`} />
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] text-gray-500">Destino</p>
              <p className={`text-sm font-semibold ${step===2 ? "text-gray-900" : "text-gray-700"}`}>Contador</p>
            </div>
          </div>
        </div>

        {/* Barra de pipeline (3 segmentos) */}
        <div className="relative">
          {/* Trilha */}
          <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-100 via-blue-100 to-indigo-100 overflow-hidden" />

          {/* Fill animado (0% → 100% em TOTAL_MS) */}
          <motion.div
            className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "33.333%", "66.666%", "100%"] }}
            transition={{ duration: TOTAL_MS / 1000, repeat: Infinity, ease: "linear", times: [0, 1/3, 2/3, 1] }}
            style={{ boxShadow: "0 0 12px rgba(99,102,241,.45)" }}
          />

          {/* Cursor/packet que percorre o pipeline */}
          <motion.div
            className="absolute -top-1 h-4 w-4 rounded-full bg-white border border-blue-300 shadow-md"
            initial={{ left: "0%" }}
            animate={{ left: ["0%", "33.333%", "66.666%", "100%"] }}
            transition={{ duration: TOTAL_MS / 1000, repeat: Infinity, ease: "linear", times: [0, 1/3, 2/3, 1] }}
          >
            <div className="absolute inset-0 rounded-full bg-blue-500/15" />
          </motion.div>

          {/* Divisores dos segmentos */}
          <div className="absolute inset-0 flex justify-between">
            <span className="h-2 w-0.5 bg-white/80 translate-x-[calc(33.333%-1px)] rounded" />
            <span className="h-2 w-0.5 bg-white/80 translate-x-[calc(66.666%-1px)] rounded" />
          </div>
        </div>

        {/* Rótulos das etapas */}
        <div className="mt-3 grid grid-cols-3 text-center">
          <div className={`${labelBase} ${step===0 ? active : muted}`}>Solicitando</div>
          <div className={`${labelBase} ${step===1 ? active : muted}`}>Processando</div>
          <div className={`${labelBase} ${step===2 ? active : muted}`}>Devolvendo</div>
        </div>
      </div>
    </div>
  )
}


const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      <TechBackdrop />

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <FileXml className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Portal Contador</span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link
                to="/login"
                className="px-5 py-2.5 text-white bg-blue-700/30 backdrop-blur-sm hover:bg-blue-700/50 rounded-lg font-medium transition-all duration-300 border border-white/20"
              >
                Acessar Portal
              </Link>
              <Link
                to="/primeiro-acesso"
                className="px-5 py-2.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-300 font-medium shadow-lg shadow-blue-900/20 flex items-center"
              >
                Solicitar Acesso
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl p-6 md:p-10 shadow-xl">
            <div className="text-center max-w-4xl mx-auto">
              <div
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-6"
              >
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2" />
                WM Sistemas de Gestão
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Acesse os <span className="text-blue-600">XMLs dos seus clientes</span> integrados ao nosso ERP
              </h1>

              <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
                Portal exclusivo para contadores parceiros da WM Sistemas. Seus clientes já estão vinculados
                automaticamente — busque e baixe os XMLs com praticidade e segurança.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30 font-medium"
                >
                  Acessar Portal
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/primeiro-acesso"
                  className="inline-flex items-center justify-center px-8 py-3.5 border border-blue-200 bg-white text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 font-medium"
                >
                  Solicitar Acesso
                </Link>
              </div>

              {/* Substitui a barra: diagrama de fluxo de dados */}
              <DataFlowProcess />
            </div>
          </div>
        </section>

        {/* Wave Divider */}
        <div className="w-full h-20 overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-blue-100"
            />
          </svg>
        </div>

        {/* Como funciona */}
        <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como funciona a integração</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Solução integrada ao ERP da WM Sistemas para máxima praticidade
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl shadow-lg shadow-blue-100 border border-blue-50 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
              <div className="p-3 bg-blue-50 rounded-lg inline-block mb-5">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Clientes Pré-Vinculados</h3>
              <p className="text-gray-600">Seus clientes que já utilizam o ERP da WM aparecem automaticamente no seu acesso.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg shadow-blue-100 border border-blue-50 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
              <div className="p-3 bg-blue-50 rounded-lg inline-block mb-5">
                <FileXml className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">XMLs Sempre Atualizados</h3>
              <p className="text-gray-600">Sincronização contínua com dados fiscais mais recentes direto do ERP.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg shadow-blue-100 border border-blue-50 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
              <div className="p-3 bg-blue-50 rounded-lg inline-block mb-5">
                <Network className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Integração Total</h3>
              <p className="text-gray-600">Consistência e confiabilidade ponta a ponta entre Portal e Sistema de Gestão.</p>
            </div>
          </div>
        </section>

        {/* Vantagens */}
        <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Vantagens da parceria WM Sistemas</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Um portal exclusivo desenvolvido para otimizar o trabalho dos contadores parceiros.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Sem configurações complexas", text: "Clientes vinculados automaticamente — zero fricção na entrada." },
              { title: "Dados direto do ERP", text: "Autenticidade e integridade garantidas na origem." },
              { title: "Interface familiar", text: "Design alinhado ao ecossistema WM para uso imediato." },
              { title: "Suporte especializado WM", text: "Equipe que conhece seu contexto e prioridades." },
            ].map((b) => (
              <div key={b.title} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{b.title}</h3>
                    <p className="text-gray-600">{b.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recursos */}
        <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recursos do Portal Contador</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ferramentas desenvolvidas especificamente para contadores parceiros
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-50 rounded-lg inline-block mb-4">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Download Inteligente</h3>
              <p className="text-gray-600">Período, cliente ou tipo de doc. Pastas e nomes padronizados.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-50 rounded-lg inline-block mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Histórico Completo</h3>
              <p className="text-gray-600">Acompanhe acessos e downloads com filtros por cliente e período.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-50 rounded-lg inline-block mb-4">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Validação Integrada</h3>
              <p className="text-gray-600">Conformidade fiscal validada no ERP para reduzir retrabalho.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 sm:p-10 shadow-xl">
            <div className="relative max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Pronto para acessar seus clientes WM?</h2>
              <p className="text-blue-100 text-lg mb-8">
                Faça login e encontre seus clientes já vinculados automaticamente. Praticidade e integração total.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="px-8 py-3.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-300 font-medium shadow-lg"
                >
                  Acessar Portal
                </Link>
                <Link
                  to="/primeiro-acesso"
                  className="px-8 py-3.5 bg-blue-700/30 backdrop-blur-sm text-white border border-white/20 rounded-lg hover:bg-blue-700/50 transition-all duration-300 font-medium"
                >
                  Solicitar Acesso
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/90 backdrop-blur border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <FileXml className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">Portal Contador</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} WM Sistemas de Gestão. Todos os direitos reservados.
            </div>
            <ul className="flex space-x-6">
              <li>
                <Link to="/privacidade" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  Termos
                </Link>
              </li>
              <li>
                <Link to="/suporte" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                  Suporte
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
