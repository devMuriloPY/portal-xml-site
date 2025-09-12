import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileXIcon as FileXml, ArrowLeft, ArrowRight, Clock, RefreshCw } from 'lucide-react';
import { auth } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const VerifyCodePage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos em segundos
  const [canResend, setCanResend] = useState(false);
  const [identifier, setIdentifier] = useState('');

  useEffect(() => {
    // Recuperar identifier do localStorage
    const savedIdentifier = localStorage.getItem('resetIdentifier');
    if (!savedIdentifier) {
      navigate('/forgot-password');
      return;
    }
    setIdentifier(savedIdentifier);

    // Timer de expiração
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Apenas um dígito por campo
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus no próximo campo
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length === 4) {
      const newCode = pastedData.split('');
      setCode(newCode);
      // Focus no último campo
      setTimeout(() => {
        const lastInput = document.getElementById('code-3');
        lastInput?.focus();
      }, 0);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      toast.error('Por favor, insira o código completo de 4 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      const response = await auth.verifyPasswordResetCode(identifier, fullCode);
      
      // Verificar se a resposta foi bem-sucedida
      if (response.status === 'ok' && response.reset_token) {
        // Salvar reset_token no localStorage
        localStorage.setItem('resetToken', response.reset_token);
        
        toast.success('Código verificado com sucesso!');
        navigate('/new-password');
      } else {
        throw new Error('Código inválido');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Código inválido ou expirado');
      // Limpar campos em caso de erro
      setCode(['', '', '', '']);
      const firstInput = document.getElementById('code-0');
      firstInput?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    
    try {
      await auth.requestPasswordReset(identifier);
      setTimeLeft(15 * 60);
      setCanResend(false);
      
      // Reiniciar timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast.success('Novo código enviado!');
    } catch (error: any) {
      if (error.response?.status === 429) {
        toast.error('Aguarde um instante antes de solicitar outro código.');
      } else {
        toast.error('Erro ao reenviar código. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
        
        {/* Verify Code card */}
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
                <span className="text-2xl font-bold text-gray-800">Portal XML</span>
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Verificar código
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Digite o código de 4 dígitos enviado para seu e-mail
            </p>

            {/* Timer */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Código expira em: {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 text-center">
                  Código de verificação
                </label>
                
                <div className="flex justify-center space-x-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isCodeComplete}
                className={`w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-500/20 ${
                  isLoading || !isCodeComplete ? 'opacity-70 cursor-not-allowed' : ''
                } group`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </>
                ) : (
                  <>
                    Verificar código
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Resend code */}
            <div className="mt-6 text-center">
              {canResend ? (
                <button
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reenviar código
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Não recebeu o código? Aguarde {formatTime(timeLeft)} para reenviar
                </p>
              )}
            </div>

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
                  to="/forgot-password" 
                  className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para solicitar código
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Portal XML. Todos os direitos reservados.</p>
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

export default VerifyCodePage;
