import axios from "axios";
import { getApiBaseUrl } from "../config/environment";

const BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// ✅ Interceptor para adicionar o token automaticamente no Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token.replace("Bearer ", "")}`;
  } else {
    console.warn("⚠️ Nenhum token encontrado no localStorage!");
  }
  return config;
});

// ✅ Interceptor de resposta com tratamento para sessão expirada
api.interceptors.response.use(
  (response) => {
    console.log("✅ Resposta da API:", response);
    return response;
  },
  (error) => {
    console.error("❌ Erro na API:", error);

    if (!error.response) {
      return Promise.reject(new Error("Erro de conexão com o servidor"));
    }

    if (error.response.status === 401) {
      // 🔐 Sessão expirada
      localStorage.removeItem("token");
      localStorage.setItem("sessionExpired", "true"); // Flag pra avisar o login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const auth = {
  login: async (cnpj: string, senha: string) => {
    try {
      const formattedCnpj = cnpj.replace(/\D/g, "")
        .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");

      const response = await api.post("/auth/login", {
        cnpj: formattedCnpj,
        senha,
      });

      localStorage.setItem("token", `Bearer ${response.data.access_token}`);
      return response.data;
    } catch (error: any) {
      console.error("🔥 Login Error:", error.response?.data || error.message);
      throw error;
    }
  },

  primeiroAcesso: async (cnpj: string, senha: string, senha_confirmacao: string) => {
    try {
      const formattedCnpj = cnpj.replace(/\D/g, "")
        .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");

      const response = await api.post("/auth/primeiro-acesso", {
        cnpj: formattedCnpj,
        senha,
        senha_confirmacao,
      });

      console.log("🔍 Resposta da API:", response);
      return response.data;
    } catch (error: any) {
      console.error("❌ Erro na API:", error);

      if (!error.response) {
        throw new Error("Erro de conexão com o servidor");
      }

      throw new Error(error.response.data?.detail || "Erro ao cadastrar senha");
    }
  },

  // Novo fluxo OTP - Solicitar código
  requestPasswordReset: async (identifier: string) => {
    try {
      const response = await api.post("/auth/password/otp/request", {
        identifier
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ Request Password Reset Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Novo fluxo OTP - Verificar código
  verifyPasswordResetCode: async (identifier: string, code: string) => {
    try {
      const response = await api.post("/auth/password/otp/verify", {
        identifier,
        code
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ Verify Code Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Novo fluxo OTP - Definir nova senha usando reset_token
  resetPasswordWithToken: async (newPassword: string) => {
    try {
      const resetToken = localStorage.getItem('resetToken');
      if (!resetToken) {
        throw new Error('Token de redefinição não encontrado');
      }

      // Criar uma instância do axios sem interceptors para evitar conflito com token de login
      const resetApi = axios.create({
        baseURL: BASE_URL,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${resetToken}`
        }
      });

      const response = await resetApi.post("/auth/password/reset", {
        new_password: newPassword
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ Reset Password Error:", error.response?.data || error.message);
      
      // Se token inválido/expirado, limpar localStorage
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('resetToken');
        localStorage.removeItem('resetIdentifier');
        localStorage.removeItem('verifiedCode');
      }
      
      throw error;
    }
  },

  // Métodos antigos mantidos para compatibilidade (podem ser removidos depois)
  solicitarRedefinicao: async (input: string) => {
    try {
      const payload = { identificador: input }; // 👈 independente se é email ou CNPJ
      const response = await api.post("/auth/solicitar-redefinicao", payload);
      return response.data;
    } catch (error: any) {
      console.error("❌ Redefinição Error:", error.response?.data || error.message);
      throw error;
    }
  },
  

  redefinirSenha: async (token: string, nova_senha: string, confirmar_senha: string) => {
    try {
      const response = await api.post("/auth/redefinir-senha", {
        token,
        nova_senha,
        confirmar_senha,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ Redefinir Senha Error:", error.response?.data || error.message);
      throw error;
    }
  },
};
