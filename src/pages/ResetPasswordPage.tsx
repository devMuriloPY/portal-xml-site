import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FileXIcon as FileXml, Send, Lock, Mail, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { auth } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [identifier, setIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", percentage: 0, color: "" };
    
    let strength = 0;
    
    // Comprimento mínimo
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    
    // Complexidade
    if (/[A-Z]/.test(password)) strength += 1; // Maiúsculas
    if (/[0-9]/.test(password)) strength += 1; // Números
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Caracteres especiais
    
    let label = "";
    let color = "";
    
    if (strength <= 2) {
      label = "Fraca";
      color = "bg-red-500";
    } else if (strength <= 4) {
      label = "Média";
      color = "bg-yellow-500";
    } else {
      label = "Forte";
      color = "bg-green-500";
    }
    
    return { 
      strength: Math.min(strength, 5), 
      label, 
      color,
      percentage: (strength / 5) * 100
    };
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await auth.solicitarRedefinicao(identifier);
      setSubmitted(true);
      toast.success('Se este e-mail ou CNPJ estiver cadastrado, enviaremos um link para redefinição.');
    } catch (error: any) {
      toast.error('Erro ao solicitar redefinição de senha');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setIsLoading(true);

    try {
      await auth.redefinirSenha(token!, newPassword, confirmPassword);
      toast.success('Senha alterada com sucesso!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Token inválido ou expirado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
        
        {/* Reset Password card */}
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
              Redefinir Senha
            </h2>
            <p className="text-center text-gray-500 mb-8">
              {token ? 'Crie uma nova senha para sua conta' : 'Enviaremos um link para redefinir sua senha'}
            </p>

            {token ? (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-4">
                  <div className={`relative ${focusedField === 'newPassword' ? 'ring-2 ring-blue-200 rounded-lg' : ''}`}>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setFocusedField('newPassword')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password strength indicator */}
                    {newPassword && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-500">Força da senha: {passwordStrength.label}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${passwordStrength.color}`} 
                            style={{ width: `${passwordStrength.percentage}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {passwordStrength.strength < 3 && "Use pelo menos 8 caracteres com letras maiúsculas, números e símbolos."}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={`relative ${focusedField === 'confirmPassword' ? 'ring-2 ring-blue-200 rounded-lg' : ''}`}>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password match indicator */}
                    {confirmPassword && (
                      <div className="mt-2 flex items-center">
                        {passwordsMatch ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-xs text-green-500">As senhas coincidem</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-xs text-red-500">As senhas não coincidem</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-500/20 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  } group`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Redefinindo...
                    </>
                  ) : (
                    <>
                      Redefinir Senha
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : !submitted ? (
              <form onSubmit={handleRequestReset} className="space-y-6">
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
                      onChange={(e) => setIdentifier(e.target.value)}
                      onFocus={() => setFocusedField('identifier')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Digite seu e-mail ou CNPJ"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-500/20 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
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
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Enviar Link de Redefinição
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="bg-green-50 text-green-800 p-6 rounded-lg mb-6 border border-green-100">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-green-800 font-medium mb-2">E-mail enviado com sucesso!</p>
                  <p className="text-green-700 text-sm">
                    Se este e-mail ou CNPJ estiver cadastrado, enviaremos um link para redefinição
                    de senha. Verifique sua caixa de entrada.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para o login
                </Link>
              </div>
            )}

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
                  Lembrou sua senha? Faça login
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

export default ResetPasswordPage;
