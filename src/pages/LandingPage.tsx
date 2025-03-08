import React from 'react';
import { Link } from 'react-router-dom';
import { FileX as FileXml, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <FileXml className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-800">Portal XML</span>
          </div>
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Login
            </Link>
            <Link
              to="/primeiro-acesso"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Primeiro Acesso
            </Link>
          </div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-20">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simplifique o acesso aos arquivos XML dos seus clientes
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              O Portal XML é a plataforma ideal para contadores acessarem e
              solicitarem arquivos XML de seus clientes de forma segura e
              eficiente. Centralize todas as suas demandas em um só lugar.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Começar agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              alt="Contador trabalhando"
              className="rounded-lg shadow-xl max-w-md w-full"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Users className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Acesso Simplificado</h3>
            <p className="text-gray-600">
              Login seguro com CNPJ e gerenciamento eficiente de documentos.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <FileXml className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Arquivos XML</h3>
            <p className="text-gray-600">
              Solicite e gerencie arquivos XML de múltiplos clientes em um só lugar.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Users className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Suporte Dedicado</h3>
            <p className="text-gray-600">
              Conte com nossa equipe para auxiliar em todas as suas necessidades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;