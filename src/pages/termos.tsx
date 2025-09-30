import { Link } from "react-router-dom"
import { FileXIcon as FileXml, ArrowLeft } from "lucide-react"

const TermosPage = () => {
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

    <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos de Uso</h1>

    <div className="prose prose-blue max-w-none">
      <p className="text-gray-600 mb-4">Última atualização: {new Date().toLocaleDateString()}</p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">1. Aceitação dos Termos</h2>
      <p className="text-gray-600 mb-4">
        Ao utilizar o <strong>Portal Contador</strong>, você concorda com estes Termos de Uso. Caso não esteja de acordo com qualquer cláusula
        aqui presente, recomendamos que não utilize a plataforma.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">2. Sobre o Portal Contador</h2>
      <p className="text-gray-600 mb-4">
        O <strong>Portal Contador</strong> é uma plataforma de apoio voltada para contadores e escritórios contábeis. Seu objetivo é
        centralizar e facilitar o acesso aos arquivos XML de documentos fiscais eletrônicos (NF-e e NFC-e) emitidos ou
        recebidos pelos clientes dos contadores.
      </p>
      <p className="text-gray-600 mb-4">
        A recuperação dos arquivos XML é feita <strong>a partir de integrações com os sistemas ICThUS ou WM Chef</strong>, ambos
        oferecidos pela <strong>WM Sistemas de Gestão</strong>, que são responsáveis por coletar e armazenar os documentos fiscais
        dos contribuintes. O <strong>Portal Contador</strong> atua apenas como uma camada de visualização e solicitação de dados já previamente organizados
        por esses sistemas.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">3. Contas e Acesso</h2>
      <p className="text-gray-600 mb-4">
        Para utilizar o <strong>Portal Contador</strong>, é necessário possuir uma conta de acesso. O usuário é responsável por manter suas
        credenciais seguras e não compartilhar informações com terceiros.
      </p>
      <p className="text-gray-600 mb-4">
        O contador também é responsável por garantir que possui <strong>autorização formal</strong> de seus clientes para acessar e
        gerenciar os arquivos fiscais disponibilizados na plataforma.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">4. Integração com Sistemas Terceiros</h2>
      <p className="text-gray-600 mb-4">
        O <strong>Portal Contador</strong> não coleta diretamente informações da Sefaz ou de qualquer outro órgão governamental. Toda a base de
        dados disponível na plataforma é proveniente da <strong>integração com os sistemas da WM Sistemas de Gestão</strong> (ICThUS ou WM Chef),
        previamente contratados e configurados pelo cliente emissor.
      </p>
      <p className="text-gray-600 mb-4">
        A exatidão, frequência de atualização e completude dos arquivos XML apresentados no Portal dependem exclusivamente
        da integração correta com os sistemas da WM Sistemas.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">5. Uso Permitido</h2>
      <p className="text-gray-600 mb-4">É proibido utilizar o <strong>Portal Contador</strong> para:</p>
      <ul className="list-disc pl-6 mb-4 text-gray-600">
        <li>Consultar informações de empresas sem autorização expressa</li>
        <li>Distribuir ou manipular dados fiscais de forma indevida</li>
        <li>Realizar qualquer tipo de engenharia reversa, cópia ou exploração indevida da plataforma</li>
        <li>Violar leis fiscais, regulatórias ou de proteção de dados</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">6. Limitação de Responsabilidade</h2>
      <p className="text-gray-600 mb-4">
        O <strong>Portal Contador</strong> não se responsabiliza por falhas na entrega, exibição ou precisão dos documentos XML fornecidos
        pelos sistemas integrados. A plataforma atua como um <strong>meio técnico</strong> de acesso aos dados já coletados por terceiros,
        sendo o contador e os sistemas integradores os responsáveis pela origem, integridade e autorização de acesso aos dados.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">7. Cancelamento e Rescisão</h2>
      <p className="text-gray-600 mb-4">
        O <strong>Portal Contador</strong> se reserva o direito de suspender ou encerrar o acesso de usuários que violem estes termos,
        sem aviso prévio. O usuário pode encerrar sua conta a qualquer momento por meio do suporte.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">8. Alterações nestes Termos</h2>
      <p className="text-gray-600 mb-4">
        Estes Termos de Uso podem ser alterados periodicamente. Notificações relevantes serão enviadas aos usuários,
        quando aplicável. O uso contínuo do sistema após atualizações será considerado como aceite das novas condições.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">9. Legislação Aplicável</h2>
      <p className="text-gray-600 mb-4">
        Estes termos serão interpretados de acordo com as leis da <strong>República Federativa do Brasil</strong>. Qualquer litígio
        relacionado ao uso da plataforma deverá ser resolvido no foro da comarca de domicílio da empresa responsável pelo
        <strong>Portal Contador</strong>.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">10. Contato</h2>
      <p className="text-gray-600 mb-4">
        Para dúvidas ou solicitações, entre em contato:
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-600">
        <li><strong>Email:</strong> suporte@portalxml.com.br</li>
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

export default TermosPage

