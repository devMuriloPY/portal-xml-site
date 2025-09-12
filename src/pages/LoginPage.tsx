"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FileXIcon as FileXml, Lock, Eye, EyeOff, ArrowRight, Shield, User, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { auth } from "../services/api"
import toast, { Toaster } from "react-hot-toast"

const LoginPage = () => {
  const navigate = useNavigate()
  const [cnpj, setCnpj] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [cnpjError, setCnpjError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const expired = localStorage.getItem("sessionExpired")
    if (expired === "true") {
      toast.error("⚠️ Sua sessão expirou. Faça login novamente.")
      localStorage.removeItem("sessionExpired")
    }
  }, [])

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Form validation
  useEffect(() => {
    const validateForm = () => {
      const cnpjDigits = cnpj.replace(/\D/g, "")
      const isValidCnpj = cnpjDigits.length === 14
      const isValidPassword = password.length >= 6
      
      setCnpjError(isValidCnpj ? "" : cnpjDigits.length > 0 ? "CNPJ deve ter 14 dígitos" : "")
      setPasswordError(isValidPassword ? "" : password.length > 0 ? "Senha deve ter pelo menos 6 caracteres" : "")
      
      setIsFormValid(isValidCnpj && isValidPassword)
    }
    
    validateForm()
  }, [cnpj, password])

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await auth.login(cnpj.replace(/\D/g, ""), password)
      localStorage.setItem("token", response.access_token)
      toast.success("Login realizado com sucesso!")
      navigate("/dashboard")
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x / 50}px`,
            top: `${mousePosition.y / 50}px`,
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Login card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-white/20 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
          <div className="h-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-purple-400/50 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>

          <div className="p-8">
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#F9FAFB",
                  color: "#1F2937",
                  border: "1px solid #E5E7EB",
                },
                success: {
                  style: {
                    background: "#ECFDF5",
                    border: "1px solid #D1FAE5",
                  },
                  iconTheme: {
                    primary: "#10B981",
                    secondary: "#FFFFFF",
                  },
                },
                error: {
                  style: {
                    background: "#FEF2F2",
                    border: "1px solid #FEE2E2",
                  },
                  iconTheme: {
                    primary: "#EF4444",
                    secondary: "#FFFFFF",
                  },
                },
              }}
            />

            <div className="flex justify-center mb-8">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl">
                  <FileXml className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                  Portal XML
                </span>
              </Link>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 animate-fade-in">
                Bem-vindo de volta
              </h2>
              <p className="text-gray-500 text-lg animate-fade-in-delay">
                Acesse sua conta para gerenciar seus arquivos XML
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
                <div className="relative group">
                  <label htmlFor="cnpj" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
                    CNPJ
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                      <User className={`h-5 w-5 transition-colors ${focusedField === "cnpj" ? "text-blue-500" : cnpjError ? "text-red-500" : "text-gray-400"}`} />
                    </div>
                    <input
                      type="text"
                      id="cnpj"
                      value={cnpj}
                      onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                      onFocus={() => setFocusedField("cnpj")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="00.000.000/0000-00"
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                        cnpjError 
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                          : focusedField === "cnpj"
                          ? "border-blue-300 bg-blue-50 focus:border-blue-500 focus:ring-blue-200"
                          : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      } shadow-sm hover:shadow-md focus:shadow-lg`}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      {cnpj && (
                        <div className="transition-all duration-300">
                          {cnpjError ? (
                            <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500 animate-bounce" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {cnpjError && (
                    <p className="mt-2 text-sm text-red-600 animate-fade-in flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {cnpjError}
                    </p>
                  )}
                </div>

                <div className="relative group">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                      <Lock className={`h-5 w-5 transition-colors ${focusedField === "password" ? "text-blue-500" : passwordError ? "text-red-500" : "text-gray-400"}`} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                        passwordError 
                          ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                          : focusedField === "password"
                          ? "border-blue-300 bg-blue-50 focus:border-blue-500 focus:ring-blue-200"
                          : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      } shadow-sm hover:shadow-md focus:shadow-lg`}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center space-x-2">
                      {password && (
                        <div className="transition-all duration-300">
                          {passwordError ? (
                            <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500 animate-bounce" />
                          )}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  {passwordError && (
                    <p className="mt-2 text-sm text-red-600 animate-fade-in flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300 hover:scale-105 font-medium"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className={`w-full py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center font-semibold text-lg group relative overflow-hidden ${
                  isLoading || !isFormValid
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {!isLoading && isFormValid && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                )}
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-6 w-6 mr-3" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Entrar</span>
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform relative z-10" />
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
                  <span className="px-4 bg-white/80 text-sm text-gray-500 font-medium">ou</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/primeiro-acesso"
                  className="inline-flex items-center justify-center w-full py-4 px-6 border-2 border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 font-semibold group hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                >
                  <Shield className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                  Primeiro acesso? Cadastre-se aqui
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p className="mb-3">© {new Date().getFullYear()} Portal XML. Todos os direitos reservados.</p>
          <div className="flex justify-center space-x-6">
            <Link 
              to="/privacidade" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300 hover:scale-105 font-medium"
            >
              Privacidade
            </Link>
            <Link 
              to="/termos" 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300 hover:scale-105 font-medium"
            >
              Termos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

