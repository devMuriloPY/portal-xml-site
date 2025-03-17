"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FileXIcon as FileXml, Lock, Eye, EyeOff, ArrowRight, Shield, User } from "lucide-react"
import { auth } from "../services/api"
import toast, { Toaster } from "react-hot-toast"

const LoginPage = () => {
  const navigate = useNavigate()
  const [cnpj, setCnpj] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => {
    const expired = localStorage.getItem("sessionExpired")
    if (expired === "true") {
      toast.error("⚠️ Sua sessão expirou. Faça login novamente.")
      localStorage.removeItem("sessionExpired")
    }
  }, [])

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative z-10 border border-blue-50">
          <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-800"></div>

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
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <FileXml className="h-8 w-8 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-gray-800">Portal XML</span>
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Bem-vindo de volta</h2>
            <p className="text-center text-gray-500 mb-8">Acesse sua conta para gerenciar seus arquivos XML</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className={`relative ${focusedField === "cnpj" ? "ring-2 ring-blue-200 rounded-lg" : ""}`}>
                  <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                    CNPJ
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="cnpj"
                      value={cnpj}
                      onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                      onFocus={() => setFocusedField("cnpj")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="00.000.000/0000-00"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className={`relative ${focusedField === "password" ? "ring-2 ring-blue-200 rounded-lg" : ""}`}>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/redefinir-senha"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-500/20 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                } group`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
                  to="/primeiro-acesso"
                  className="inline-flex items-center justify-center w-full py-3 px-4 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Primeiro acesso? Cadastre-se aqui
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
  )
}

export default LoginPage

