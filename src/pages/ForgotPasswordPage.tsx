import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileXIcon as FileXml, Send, Mail, ArrowLeft } from 'lucide-react';
import { auth } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [cooldownTime, setCooldownTime] = useState(0);

  // Validação de email ou CNPJ
  const validateIdentifier = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cnpjRegex = /^\d{14}$/;
    const cnpjWithMaskRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    
    // Remove máscara do CNPJ para validação
    const cleanCnpj = value.replace(/\D/g, '');
    
    return emailRegex.test(value) || cnpjRegex.test(cleanCnpj) || cnpjWithMaskRegex.test(value);
  };

  // Normalizar CNPJ removendo máscara
  const normalizeCnpj = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  // Aplicar máscara de CNPJ durante digitação
  const formatCnpj = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Se parece com CNPJ (números), aplica máscara
    if (/^\d+$/.test(value.replace(/\D/g, '')) && value.replace(/\D/g, '').length <= 14) {
      setIdentifier(formatCnpj(value));
    } else {
      setIdentifier(value);
    }
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateIdentifier(identifier)) {
      toast.error('Por favor, insira um e-mail válido ou CNPJ válido');
      return;
    }

    setIsLoading(true);

    try {
      // Normalizar CNPJ se necessário
      const normalizedIdentifier = identifier.includes('@') 
        ? identifier 
        : normalizeCnpj(identifier);

      await auth.requestPasswordReset(normalizedIdentifier);
      
      // Salvar identifier no localStorage para usar na próxima tela
      localStorage.setItem('resetIdentifier', normalizedIdentifier);
      
      toast.success('Se existir uma conta, enviamos um código para o e-mail cadastrado.');
      navigate('/verify-code');
    } catch (error: any) {
      if (error.response?.status === 429) {
        toast.error('Aguarde um instante antes de solicitar outro código.');
        setCooldownTime(60);
        startCooldown();
      } else {
        toast.error('Erro ao solicitar código. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startCooldown = () => {
    const interval = setInterval(() => {
      setCooldownTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const isIdentifierValid = validateIdentifier(identifier);
  const isButtonDisabled = isLoading || cooldownTime > 0 || !isIdentifierValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
        
        {/* Forgot Password card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative z-10 border border-blue-50">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-800"></div>
          
          <div className="p-8">
            <Toaster 
              position="top-right" 
              toastOptions={{
                style: {
                  background: '#F9FAFB',
                  color: '#1F2937',
                  border: '1px solid #E5E7EB',
                },
                success: {
                  style: {
                    background: '#ECFDF5',
                    border: '1px solid #D1FAE5',
                  },
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  style: {
                    background: '#FEF2F2',
                    border: '1px solid #FEE2E2',
                  },
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
            
            <div className="flex justify-center mb-8">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <FileXml className="h-8 w-8 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-gray-800">Portal Contador</span>
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Esqueci minha senha
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Digite seu e-mail ou CNPJ para receber um código de verificação
            </p>

            <form onSubmit={handleRequestCode} className="space-y-6">
              <div className={`relative ${focusedField === 'identifier' ? 'ring-2 ring-blue-200 rounded-lg' : ''}`}>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail ou CNPJ
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="identifier"
                    value={identifier}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('identifier')}
                    onBlur={() => setFocusedField(null)}
                    placeholder=""
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                
                {/* Validação visual */}
                {identifier && (
                  <div className="mt-2">
                    {isIdentifierValid ? (
                      <p className="text-xs text-green-600">✓ Formato válido</p>
                    ) : (
                      <p className="text-xs text-red-600">✗ Insira um e-mail válido ou CNPJ válido</p>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isButtonDisabled}
                className={`w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-500/20 ${
                  isButtonDisabled ? 'opacity-70 cursor-not-allowed' : ''
                } group`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : cooldownTime > 0 ? (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Aguarde {cooldownTime}s
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Enviar código
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500">ou</span>
                </div>
              </div>

              <div className="mt-6">
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Lembrou sua senha? Faça login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Portal Contador. Todos os direitos reservados.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacidade" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
              Privacidade
            </Link>
            <Link to="/termos" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
