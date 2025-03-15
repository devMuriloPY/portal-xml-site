import { Link } from "react-router-dom"
import {
  FileXIcon as FileXml,
  Users,
  ArrowRight,
  Shield,
  Clock,
  ChevronRight,
  Network,
  CheckCircle,
  Zap,
} from "lucide-react"

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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - Redesenhado sem imagem */}
        <div className="text-center max-w-4xl mx-auto mt-8 md:mt-16">
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
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/30 font-medium"
            >
              Começar agora
              <ArrowRight className="ml-2 h-5 w-5" />
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

        {/* Wave Divider */}
        <div className="w-full h-24 mt-16 mb-8 overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-blue-100"
            ></path>
          </svg>
        </div>

        {/* Features Section - Redesenhado */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20">
          <div className="bg-white p-8 rounded-xl shadow-lg shadow-blue-100 border border-blue-50 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
            <div className="p-3 bg-blue-50 rounded-lg inline-block mb-5 group-hover:bg-blue-100 transition-colors duration-300">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Acesso Simplificado</h3>
            <p className="text-gray-600">
              Login seguro com CNPJ e gerenciamento eficiente de documentos para todos os seus clientes.
            </p>
            <div className="mt-5 flex items-center text-blue-600 font-medium">
              <span className="text-sm">Saiba mais</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg shadow-blue-100 border border-blue-50 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
            <div className="p-3 bg-blue-50 rounded-lg inline-block mb-5 group-hover:bg-blue-100 transition-colors duration-300">
              <FileXml className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Arquivos XML</h3>
            <p className="text-gray-600">
              Solicite e gerencie arquivos XML de múltiplos clientes em um só lugar com facilidade.
            </p>
            <div className="mt-5 flex items-center text-blue-600 font-medium">
              <span className="text-sm">Saiba mais</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg shadow-blue-100 border border-blue-50 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
            <div className="p-3 bg-blue-50 rounded-lg inline-block mb-5 group-hover:bg-blue-100 transition-colors duration-300">
              <Network className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Conexão em Rede</h3>
            <p className="text-gray-600">
              Conecte-se com seus clientes em tempo real para solicitar e receber arquivos XML instantaneamente.
            </p>
            <div className="mt-5 flex items-center text-blue-600 font-medium">
              <span className="text-sm">Saiba mais</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 sm:p-10 shadow-xl mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-4xl font-bold text-white mb-2">+5000</div>
              <p className="text-blue-100">Contadores ativos</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-4xl font-bold text-white mb-2">+25000</div>
              <p className="text-blue-100">Arquivos processados</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <p className="text-blue-100">Disponibilidade</p>
            </div>
          </div>
        </div>

        {/* Seção de benefícios - Nova */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Por que escolher o Portal XML?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma foi desenvolvida pensando nas necessidades específicas dos contadores e escritórios de
              contabilidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
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
        </div>

        {/* Seção de depoimentos - Nova */}
        <div className="mb-20 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">O que nossos clientes dizem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Veja o que contadores e escritórios de contabilidade estão falando sobre o Portal XML.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center text-yellow-400 mb-4">
                <Zap className="h-5 w-5 fill-current" />
                <Zap className="h-5 w-5 fill-current" />
                <Zap className="h-5 w-5 fill-current" />
                <Zap className="h-5 w-5 fill-current" />
                <Zap className="h-5 w-5 fill-current" />
              </div>
              <p className="text-gray-700 mb-4">
                "O Portal XML revolucionou a forma como solicitamos documentos dos nossos clientes. Economizamos horas
                de trabalho toda semana."
              </p>
              <div className="font-medium">
                <p className="text-blue-600">Ana Silva</p>
                <p className="text-gray-500 text-sm">Contadora, Silva & Associados</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center text-yellow-400 mb-4">
                <Zap className="h-5 w-5 fill-current" />
                <Zap className="h-5 w-5 fill-current" />
                <Zap className="h-5 w-5 fill-current" />
                <Zap className="h-5 w-5 fill-current" />
                <Zap className="h-5 w-5 fill-current" />
              </div>
              <p className="text-gray-700 mb-4">
                "Interface intuitiva e suporte excepcional. Conseguimos integrar o Portal XML em nossos processos em
                questão de dias."
              </p>
              <div className="font-medium">
                <p className="text-blue-600">Carlos Mendes</p>
                <p className="text-gray-500 text-sm">Diretor, Contabilidade Moderna</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center text-yellow-400 mb-4">
                <Zap className="h-5 w-5 fill-current" />
                <Zap className="h-5 w-5 fill-current" />
                <Zap className="h-5 w-5 fill-current" />
                <Zap className="h-5 w-5 fill-current" />
                <Zap className="h-5 w-5 fill-current" />
              </div>
              <p className="text-gray-700 mb-4">
                "A segurança e confiabilidade do Portal XML nos deram tranquilidade para gerenciar documentos sensíveis
                dos nossos clientes."
              </p>
              <div className="font-medium">
                <p className="text-blue-600">Mariana Costa</p>
                <p className="text-gray-500 text-sm">Contadora Sênior, Grupo Fiscal</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Redesenhado */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 sm:p-10 md:p-12 shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Pronto para simplificar sua rotina?</h2>
            <p className="text-blue-100 text-lg mb-8">
              Junte-se a milhares de contadores que já estão otimizando seu fluxo de trabalho com o Portal XML.
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
      </main>

      {/* Footer - Redesenhado */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileXml className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">Portal XML</span>
              </div>
              <p className="text-gray-600 mb-4">
                A solução completa para contadores gerenciarem arquivos XML de seus clientes.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Produto</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Preços
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Depoimentos
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Empresa</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Parceiros
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Carreiras
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Suporte</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Documentação
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Termos de Serviço
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Portal XML. Todos os direitos reservados.
            </div>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                    Termos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                    Cookies
                  </a>
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

