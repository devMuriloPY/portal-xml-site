import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileX as FileXml, UserPlus } from 'lucide-react';
import { auth } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const FirstAccessPage = () => {
  const navigate = useNavigate();
  const [cnpj, setCnpj] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    
    if (cnpj.replace(/\D/g, '').length !== 14) {
      toast.error('CNPJ inválido');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Submitting form with CNPJ:', cnpj);
    
      const formattedCnpj = cnpj.replace(/\D/g, '')
        .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
    
      const response = await auth.primeiroAcesso(
        formattedCnpj,
        password,
        confirmPassword
      );
    
      // ✅ Garantir que a resposta tenha status de sucesso antes de continuar
      if (response && response.message) {
        toast.success(response.message);
        navigate('/login');
      } else {
        toast.error('Erro inesperado ao cadastrar a senha.');
      }
    
    } catch (error: any) {
      // ❗️ Verificar se foi erro de resposta da API ou erro genérico
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao cadastrar senha';
      console.error('Primeiro Acesso Error:', error);
      toast.error(errorMessage);
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
          Primeiro Acesso
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
              Nova Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <UserPlus className="h-5 w-5 mr-2" />
            {isLoading ? 'Cadastrando...' : 'Cadastrar Senha'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Já possui cadastro? Faça login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FirstAccessPage;