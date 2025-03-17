import { Link } from "react-router-dom"
import { FileXIcon as FileXml, Users, ArrowRight, Shield, Clock, ChevronRight, Network, CheckCircle, Download, BarChart3, FileCheck } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      {/* Header/Navigation */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <FileXml className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Portal XML</span>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link
                to="/login"
                className="px-5 py-2.5 text-white bg-blue-700/30 backdrop-blur-sm hover:bg-blue-700/50 rounded-lg font-medium transition-all duration-300 border border-white/20"
              >
                Login
              </Link>
              <Link
                to="/primeiro-acesso"
                className="px-5 py-2.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-300 font-medium shadow-lg shadow-blue-900/20 flex items-center"
              >
                Primeiro Acesso
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              Plataforma para Contadores
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Simplifique o acesso aos <span className="text-blue-600">arquivos XML</span> dos seus clientes
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              O Portal XML é a plataforma ideal para contadores acessarem e solicitarem arquivos XML de seus clientes de
              forma segura e eficiente. Centralize todas as suas demandas em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30 font-medium group"
              >
                Começar agora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/primeiro-acesso"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-blue-200 bg-white text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 font-medium"
              >
                Saiba mais
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <Shield className="h-4 w-4 text-blue-600 mr-2" />
                Seguro
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <Clock className="h-4 w-4 text-blue-600 mr-2" />
                Rápido
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <Users className="h-4 w-4 text-blue-600 mr-2" />
                Confiável
              </div>
            </div>
          </div>
        </section>

        {/* Wave Divider */}
        <div className="w-full h-24 overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-blue-100"
            ></path>
          </svg>
        </div>

        {/* Features Section */}
        <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como o Portal XML funciona</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Uma plataforma intuitiva projetada para otimizar o fluxo de trabalho contábil
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl shadow-lg shadow-blue-100 border border-blue-50 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
              <div className="p-3 bg-blue-50 rounded-lg inline-block mb-5 group-hover:bg-blue-100 transition-colors duration-300">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Acesso Simplificado</h3>
              <p className="text-gray-600">
                Login seguro com CNPJ e gerenciamento eficiente de documentos para todos os seus clientes.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg shadow-blue-100 border border-blue-50 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
              <div className="p-3 bg-blue-50 rounded-lg inline-block mb-5 group-hover:bg-blue-100 transition-colors duration-300">
                <FileXml className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Arquivos XML</h3>
              <p className="text-gray-600">
                Solicite e gerencie arquivos XML de múltiplos clientes em um só lugar com facilidade.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg shadow-blue-100 border border-blue-50 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
              <div className="p-3 bg-blue-50 rounded-lg inline-block mb-5 group-hover:bg-blue-100 transition-colors duration-300">
                <Network className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Conexão em Rede</h3>
              <p className="text-gray-600">
                Conecte-se com seus clientes em tempo real para solicitar e receber arquivos XML instantaneamente.
              </p>
            </div>
          </div>
        </section>

        {/* Seção de benefícios */}
        <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sobre o Portal XML</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma foi desenvolvida pensando nas necessidades específicas dos contadores.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Economia de tempo</h3>
                  <p className="text-gray-600">
                    Reduza o tempo gasto com solicitações manuais de arquivos XML. Nossa plataforma automatiza todo o
                    processo.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Segurança avançada</h3>
                  <p className="text-gray-600">
                    Seus dados e os de seus clientes estão protegidos com criptografia de ponta a ponta e autenticação
                    segura.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Interface intuitiva</h3>
                  <p className="text-gray-600">
                    Design moderno e fácil de usar, permitindo que você e sua equipe comecem a usar imediatamente.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Suporte especializado</h3>
                  <p className="text-gray-600">
                    Nossa equipe de suporte está disponível para ajudar com qualquer dúvida ou problema que você possa
                    ter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Funcionalidades adicionais */}
        <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Funcionalidades principais</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ferramentas que facilitam o dia a dia do contador
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-50 rounded-lg inline-block mb-4">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Download em Lote</h3>
              <p className="text-gray-600">
                Baixe múltiplos arquivos XML de uma só vez, economizando tempo e organizando automaticamente.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-50 rounded-lg inline-block mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Relatórios</h3>
              <p className="text-gray-600">
                Acompanhe todas as solicitações e downloads com relatórios completos sobre o status de cada documento.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-50 rounded-lg inline-block mb-4">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Validação Automática</h3>
              <p className="text-gray-600">
                Verificação automática da integridade e validade dos arquivos XML recebidos para garantir conformidade.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 sm:p-10 shadow-xl">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Pronto para simplificar sua rotina?</h2>
              <p className="text-blue-100 text-lg mb-8">
                Otimize seu fluxo de trabalho com o Portal XML e foque no que realmente importa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="px-8 py-3.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-300 font-medium shadow-lg"
                >
                  Fazer Login
                </Link>
                <Link
                  to="/primeiro-acesso"
                  className="px-8 py-3.5 bg-blue-700/30 backdrop-blur-sm text-white border border-white/20 rounded-lg hover:bg-blue-700/50 transition-all duration-300 font-medium"
                >
                  Criar Conta
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Simplificado */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FileXml className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">Portal XML</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Portal XML. Todos os direitos reservados.
            </div>
            <div className="mt-4 md:mt-0">
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
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
