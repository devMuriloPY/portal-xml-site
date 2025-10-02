import { Link } from "react-router-dom"
import { FileXIcon as FileXml, ArrowLeft } from "lucide-react"

const PrivacidadePage = () => {
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

    <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>

    <div className="prose prose-blue max-w-none">
      <p className="text-gray-600 mb-4">Última atualização: {new Date().toLocaleDateString()}</p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">1. Introdução</h2>
      <p className="text-gray-600 mb-4">
        O <strong>Portal Contador</strong> está comprometido com a proteção dos dados e a privacidade dos usuários. Esta Política de
        Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos as informações fornecidas ao utilizar
        nossa plataforma.
      </p>
      <p className="text-gray-600 mb-4">
        O uso do Portal Contador implica na aceitação desta Política. Recomendamos a leitura completa antes de continuar a
        navegação ou uso do sistema.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">2. Origem dos Dados XML</h2>
      <p className="text-gray-600 mb-4">
        O <strong>Portal Contador</strong> não realiza a coleta direta de informações fiscais da Sefaz. Os arquivos XML de NF-e e NFC-e
        disponíveis na plataforma são provenientes de <strong>integrações com os sistemas ICThUS ou WM Chef</strong>, oferecidos pela
        <strong> WM Sistemas de Gestão</strong>. Esses sistemas são responsáveis por realizar a captura e armazenamento dos documentos
        fiscais dos contribuintes.
      </p>
      <p className="text-gray-600 mb-4">
        O Portal Contador atua exclusivamente como um meio de acesso e visualização dos dados, permitindo que contadores
        previamente autorizados por seus clientes possam consultar, organizar e exportar os XMLs já processados pelos
        sistemas integrados.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">3. Dados Pessoais Coletados</h2>
      <p className="text-gray-600 mb-4">
        Para autenticação e funcionamento adequado da plataforma, podemos coletar as seguintes informações:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-600">
        <li>Nome e e-mail do contador</li>
        <li>Nome e CNPJ das empresas vinculadas</li>
        <li>Informações de login e atividade</li>
      </ul>
      <p className="text-gray-600 mb-4">
        Os dados coletados são utilizados exclusivamente para fins operacionais e nunca são comercializados ou compartilhados
        com terceiros sem consentimento.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">4. Segurança da Informação</h2>
      <p className="text-gray-600 mb-4">
        Implementamos medidas técnicas e organizacionais adequadas para garantir a proteção dos dados tratados na
        plataforma, incluindo:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-600">
        <li>Criptografia de dados em trânsito</li>
        <li>Autenticação por login com senha</li>
        <li>Controle de acesso aos dados por perfil</li>
        <li>Monitoramento e backups periódicos</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">5. Compartilhamento de Informações</h2>
      <p className="text-gray-600 mb-4">
        Não compartilhamos informações pessoais com terceiros, exceto nos casos em que:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-600">
        <li>Haja consentimento do usuário</li>
        <li>Seja necessário para cumprimento de obrigações legais</li>
        <li>O compartilhamento seja com prestadores de serviço diretamente relacionados à operação do Portal Contador</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">6. Cookies</h2>
      <p className="text-gray-600 mb-4">
        O Portal Contador utiliza cookies estritamente funcionais para manter sessões autenticadas e melhorar a navegação. Nenhum
        dado de rastreamento de terceiros é coletado com fins publicitários ou analíticos externos.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">7. Direitos dos Usuários</h2>
      <p className="text-gray-600 mb-4">
        De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-600">
        <li>Confirmar a existência de tratamento de dados</li>
        <li>Acessar seus dados</li>
        <li>Corrigir dados incompletos ou desatualizados</li>
        <li>Solicitar a exclusão de dados (quando aplicável)</li>
        <li>Revogar consentimentos dados anteriormente</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">8. Atualizações desta Política</h2>
      <p className="text-gray-600 mb-4">
        Esta política pode ser atualizada a qualquer momento para refletir melhorias ou mudanças legais. Quando
        alterações relevantes forem feitas, notificaremos os usuários por meio da própria plataforma.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">9. Contato</h2>
      <p className="text-gray-600 mb-4">
        Para dúvidas, sugestões ou solicitações relacionadas à privacidade e proteção de dados, entre em contato:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-600">
        <li><strong>Email:</strong> suporte@wmsistemas.inf.br</li>
      </ul>
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
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PrivacidadePage

