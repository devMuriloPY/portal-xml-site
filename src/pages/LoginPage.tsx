"use client"

import type React from "react"
import { useEffect, useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  FileXIcon as FileXml,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileCheck2,
} from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { auth } from "../services/api"
import toast, { Toaster } from "react-hot-toast"

const TOAST_ID = "auth-status"

function useParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [prefersReduced])

  return pos
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const prefersReduced = useReducedMotion()

  const [cnpj, setCnpj] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [cnpjError, setCnpjError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)
  const [rememberCredentials, setRememberCredentials] = useState(false)

  const mouse = useParallax()

  useEffect(() => {
    const expired = localStorage.getItem("sessionExpired")
    if (expired === "true") {
      localStorage.removeItem("sessionExpired")
    }
    
    // Carregar credenciais salvas
    const savedCnpj = localStorage.getItem("savedCnpj")
    const savedPassword = localStorage.getItem("savedPassword")
    const rememberStatus = localStorage.getItem("rememberCredentials")
    
    if (savedCnpj && rememberStatus === "true") {
      setCnpj(savedCnpj)
      setRememberCredentials(true)
    }
    
    if (savedPassword && rememberStatus === "true") {
      setPassword(savedPassword)
    }
  }, [])

  // validação
  useEffect(() => {
    const digits = cnpj.replace(/\D/g, "")
    const okCnpj = digits.length === 14
    const okPass = password.length >= 6
    
    // Só atualizar erros de validação se não houver erro de servidor
    if (!cnpjError.includes("inválidos")) {
      setCnpjError(okCnpj ? "" : digits.length ? "CNPJ deve ter 14 dígitos" : "")
    }
    if (!passwordError.includes("inválidos")) {
      setPasswordError(okPass ? "" : password.length ? "Senha deve ter pelo menos 6 caracteres" : "")
    }
    
    setIsFormValid(okCnpj && okPass)
  }, [cnpj, password, cnpjError, passwordError])

  const formatCNPJ = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18)

  // Limpar erros quando usuário começar a digitar
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCNPJ(e.target.value)
    setCnpj(value)
    if (cnpjError.includes("inválidos")) {
      setCnpjError("")
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (passwordError.includes("inválidos")) {
      setPasswordError("")
    }
  }

  // animação de “pacotes XML” lado direito
  const packets = useMemo(
    () =>
      Array.from({ length: 4 }).map((_, i) => ({
        id: i,
        delay: i * 0.9,
      })),
    []
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Limpar erros anteriores
    setCnpjError("")
    setPasswordError("")

    try {
      const response = await auth.login(cnpj.replace(/\D/g, ""), password)
      localStorage.setItem("token", response.access_token)
      
      // Salvar credenciais se marcado
      if (rememberCredentials) {
        localStorage.setItem("savedCnpj", cnpj)
        localStorage.setItem("savedPassword", password)
        localStorage.setItem("rememberCredentials", "true")
      } else {
        // Limpar credenciais salvas se desmarcado
        localStorage.removeItem("savedCnpj")
        localStorage.removeItem("savedPassword")
        localStorage.removeItem("rememberCredentials")
      }
      
      toast.success("Login realizado com sucesso!", { id: TOAST_ID })
      navigate("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      
      // Tratar diferentes tipos de erro
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || "Erro ao fazer login"
      
      // Se for erro de credenciais, mostrar erro específico
      if (error.response?.status === 401 || error.response?.status === 403) {
        setPasswordError("CNPJ ou senha inválidos")
        toast.error("Credenciais inválidas", { id: TOAST_ID })
      } else {
        toast.error(errorMessage, { id: TOAST_ID })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
      {/* BACKDROP tecnológico sutil */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* grade fina */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,.5),transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.05)_1px,transparent_1px)] bg-[size:28px_28px]" />
        </div>
        {/* blobs com parallax leve */}
        <motion.div
          className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl bg-blue-300/30"
          animate={
            prefersReduced
              ? {}
              : { x: mouse.x / 40, y: mouse.y / 40, opacity: [0.75, 1, 0.75] }
          }
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl bg-indigo-300/30"
          animate={prefersReduced ? {} : { x: -mouse.x / 50, y: -mouse.y / 50 }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* feixes diagonais */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="beam" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
              <stop offset="35%" stopColor="#60A5FA" stopOpacity="0.65" />
              <stop offset="65%" stopColor="#818CF8" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2].map((i) => (
            <motion.path
              key={i}
              d={`M -100 ${120 + i * 120} C 300 ${40 + i * 120}, 900 ${280 + i * 120}, 1300 ${160 + i * 120}`}
              stroke="url(#beam)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={prefersReduced ? {} : { pathLength: 1, opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 7 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </svg>
      </div>

      {/* CONTAINER */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-white/30 bg-white/75 backdrop-blur-xl shadow-2xl">
          <div className="grid md:grid-cols-2">
            {/* LADO ESQUERDO: FORM */}
            <div className="p-8 md:p-10">
              <Toaster
                position="top-right"
                toastOptions={{
                  style: { background: "#F9FAFB", color: "#111827", border: "1px solid #E5E7EB" },
                  success: { style: { background: "#ECFDF5", border: "1px solid #D1FAE5" } },
                  error: { style: { background: "#FEF2F2", border: "1px solid #FEE2E2" } },
                }}
              />

              {/* Logo */}
              <div className="flex justify-center md:justify-start mb-8">
                <Link to="/" className="flex items-center space-x-3 group">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300 shadow-lg">
                    <FileXml className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  </div>
                  <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-800">
                    Portal Contador
                  </span>
                </Link>
              </div>

              <div className="mb-8 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Bem-vindo de volta</h1>
                <p className="text-gray-600 mt-2">
                  Acesse sua conta para gerenciar e baixar os XMLs integrados ao ERP.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo oculto para ajudar o navegador a entender o contexto */}
                <input type="hidden" name="form-type" value="login" />
                
                {/* CNPJ */}
                <div>
                  <label htmlFor="cnpj" className="block text-sm font-semibold text-gray-700 mb-2">
                    CNPJ
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User
                        className={`h-5 w-5 ${
                          focusedField === "cnpj" ? "text-blue-600" : cnpjError ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      id="cnpj"
                      type="text"
                      value={cnpj}
                      onChange={handleCnpjChange}
                      onFocus={() => setFocusedField("cnpj")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="00.000.000/0000-00"
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 outline-none transition-all ${
                        cnpjError
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : focusedField === "cnpj"
                          ? "border-blue-300 bg-blue-50 focus:border-blue-500"
                          : "border-gray-200 bg-white focus:border-blue-500"
                      } shadow-sm`}
                      required
                      inputMode="numeric"
                      autoComplete="username"
                      data-lpignore="false"
                      aria-invalid={!!cnpjError}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      {cnpj && (cnpjError ? <AlertCircle className="h-5 w-5 text-red-500" /> : <CheckCircle className="h-5 w-5 text-green-500" />)}
                    </div>
                  </div>
                  {cnpjError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {cnpjError}
                    </p>
                  )}
                </div>

                {/* Senha */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        className={`h-5 w-5 ${
                          focusedField === "password" ? "text-blue-600" : passwordError ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 outline-none transition-all ${
                        passwordError
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : focusedField === "password"
                          ? "border-blue-300 bg-blue-50 focus:border-blue-500"
                          : "border-gray-200 bg-white focus:border-blue-500"
                      } shadow-sm`}
                      required
                      autoComplete="current-password"
                      data-lpignore="true"
                      aria-invalid={!!passwordError}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {password && !passwordError && (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      )}
                      {passwordError && (
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="rounded-md p-1 text-gray-500 hover:text-blue-700 hover:bg-blue-50 transition"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  {passwordError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {passwordError}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberCredentials}
                      onChange={(e) => setRememberCredentials(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                      Lembrar CNPJ e senha
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm font-medium text-blue-700 hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                
                <div className="text-xs text-gray-500">
                  Login exclusivo para contadores parceiros.
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className={`w-full py-3.5 rounded-xl font-semibold text-lg flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
                    isLoading || !isFormValid
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  }`}
                >
                  {/* Animação de arquivos quando clicar */}
                  {isLoading && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex items-center gap-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="bg-white/20 rounded-lg p-1"
                            animate={{
                              y: [0, -8, 0],
                              scale: [1, 1.1, 1],
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                          >
                            <FileCheck2 className="h-4 w-4 text-white" />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-6 w-6 mr-3" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <div className="mt-2">
                    <Link
                      to="/primeiro-acesso"
                      className="inline-flex items-center justify-center w-full py-3.5 px-6 border-2 border-blue-200 rounded-xl text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition font-semibold"
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      Primeiro acesso? Cadastre-se aqui
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            {/* LADO DIREITO: ILUSTRAÇÃO/ANIMAÇÃO TEMA XML */}
            <div className="relative hidden md:block bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-10">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,.1),transparent_45%)]" />
              </div>

              <div className="relative z-10 h-full w-full text-white">
                <div className="flex items-center gap-3">
                  <FileXml className="h-7 w-7 text-white/90" />
                  <h2 className="text-xl font-semibold tracking-wide">Fluxo de Documentos</h2>
                </div>

                {/* Pipeline (Contador -> Portal -> Contador) */}
                <div className="mt-8">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span>Contador</span>
                    <span>Portal Contador</span>
                    <span>Contador</span>
                  </div>

                  <div className="relative mt-3 h-2 rounded-full bg-white/20 overflow-hidden">
                    {/* progress “enxuto” em loop */}
                    <motion.div
                      className="absolute top-0 left-0 h-2 bg-white"
                      initial={{ width: "0%" }}
                      animate={prefersReduced ? {} : { width: ["0%", "33.3%", "66.6%", "100%"] }}
                      transition={{ duration: 6.6, repeat: Infinity, ease: "linear", times: [0, 1 / 3, 2 / 3, 1] }}
                      style={{ boxShadow: "0 0 16px rgba(255,255,255,.45)" }}
                    />
                    {/* divisores */}
                    <span className="absolute top-0 left-[33.333%] h-2 w-0.5 bg-white/70 -translate-x-1/2" />
                    <span className="absolute top-0 left-[66.666%] h-2 w-0.5 bg-white/70 -translate-x-1/2" />
                    {/* cursor */}
                    <motion.div
                      className="absolute -top-1 h-4 w-4 rounded-full bg-white border border-white/60 shadow-sm -translate-x-1/2"
                      initial={{ left: "0%" }}
                      animate={prefersReduced ? {} : { left: ["0%", "33.333%", "66.666%", "100%"] }}
                      transition={{ duration: 6.6, repeat: Infinity, ease: "linear", times: [0, 1 / 3, 2 / 3, 1] }}
                    />
                  </div>

                  {/* Pacotes “XML” correndo na diagonal */}
                  <div className="relative mt-10 h-52">
                    {packets.map((p) => (
                      <motion.div
                        key={p.id}
                        className="absolute"
                        initial={{ x: "-10%", y: 20 + p.id * 30, opacity: 0 }}
                        animate={
                          prefersReduced
                            ? {}
                            : { x: "110%", opacity: [0, 1, 1, 0] }
                        }
                        transition={{ duration: 7, delay: p.delay, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="flex items-center gap-2 rounded-xl bg-white/90 text-indigo-700 px-3 py-1.5 shadow">
                          <FileCheck2 className="h-4 w-4" />
                          <span className="text-xs font-semibold">XML</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <p className="mt-8 text-white/80 text-sm leading-relaxed">
                    Integração direta com o ERP WM: solicite, processe e receba XMLs com segurança e rastreabilidade.
                  </p>
                </div>
              </div>
            </div>
            {/* /lado direito */}
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Portal Contador. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}

export default LoginPage
