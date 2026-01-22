import { Link } from "react-router-dom"
import { FileXIcon as FileXml, ArrowLeft, Mail, Phone, Clock } from "lucide-react"

const SuportePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      {/* Header/Navigation */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
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
                Login
              </Link>
              <Link
                to="/primeiro-acesso"
                className="px-5 py-2.5 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-300 font-medium shadow-lg shadow-blue-900/20 flex items-center"
              >
                Primeiro Acesso
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para a página inicial
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">Suporte ao Usuário</h1>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600 mb-6 text-lg">
              Oferecemos suporte para esclarecer dúvidas, registrar solicitações e auxiliar no uso de nossas soluções.
            </p>
            <p className="text-gray-600 mb-8">
              Nossa equipe está disponível para atender questões relacionadas ao funcionamento do sistema, acesso, configurações e utilização dos recursos disponíveis.
            </p>
            <p className="text-gray-600 mb-8">
              Caso precise de ajuda, entre em contato por um dos canais abaixo.
            </p>

            <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Informações de Contato</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">E-mail</p>
                    <a 
                      href="mailto:suporte@wmsistemas.inf.br" 
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      suporte@wmsistemas.inf.br
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Telefone e WhatsApp</p>
                    <a 
                      href="https://wa.me/553434238595" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      +55 34 3423-8595
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Horário de Atendimento</p>
                    <p className="text-gray-600">
                      Segunda a sexta-feira, das 08h30 às 17h30<br />
                      Sábado, das 08h30 às 11h30<br />
                      <span className="text-sm text-gray-500">(horário de Brasília)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Simplificado */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FileXml className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">Portal Contador</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Portal Contador. Todos os direitos reservados.
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
                <li>
                  <Link to="/suporte" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                    Suporte
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

export default SuportePage
