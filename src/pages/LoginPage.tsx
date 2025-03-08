import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileX as FileXml, Lock } from 'lucide-react';
import { auth } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [cnpj, setCnpj] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await auth.login(cnpj.replace(/\D/g, ''), password);
      localStorage.setItem('token', response.access_token);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <Toaster position="top-right" />
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <FileXml className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-800">Portal XML</span>
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Acesse sua conta
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ
            </label>
            <input
              type="text"
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
              placeholder="00.000.000/0000-00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Lock className="h-5 w-5 mr-2" />
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link
            to="/redefinir-senha"
            className="block text-indigo-600 hover:text-indigo-700"
          >
            Esqueceu a senha?
          </Link>
          <Link
            to="/primeiro-acesso"
            className="block text-indigo-600 hover:text-indigo-700"
          >
            Primeiro acesso? Cadastre-se aqui
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;