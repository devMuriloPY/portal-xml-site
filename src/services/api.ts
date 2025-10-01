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

// Serviços para solicitação em lotes
export const batchRequests = {
  // Criar solicitação em lote
  createBatch: async (data: { client_ids: string[]; data_inicio: string; data_fim: string }) => {
    try {
      // Validar dados antes do envio
      if (!data.client_ids || data.client_ids.length === 0) {
        throw new Error('Lista de clientes não pode estar vazia');
      }
      
      if (!data.data_inicio || !data.data_fim) {
        throw new Error('Datas de início e fim são obrigatórias');
      }

      console.log("📤 Enviando dados para API:", {
        client_ids: data.client_ids,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
        client_ids_count: data.client_ids.length,
        client_ids_type: typeof data.client_ids[0],
        data_inicio_type: typeof data.data_inicio,
        data_fim_type: typeof data.data_fim,
        payload: JSON.stringify(data, null, 2)
      });
      
      const response = await api.post("/auth/solicitacoes/batch", data);
      console.log("✅ Resposta da API:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Create Batch Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        fullError: error
      });
      
      // Log detalhado para 422
      if (error.response?.status === 422) {
        console.error("🔍 Detalhes do erro 422:", {
          validationErrors: error.response?.data?.detail || error.response?.data?.errors,
          body: error.response?.data
        });
      }
      
      throw error;
    }
  },

  // Consultar status do lote
  getBatchStatus: async (batchId: string) => {
    try {
      const response = await api.get(`/auth/solicitacoes/batch/${batchId}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ Get Batch Status Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Listar lotes do usuário
  getBatches: async (page: number = 1, limit: number = 10, status?: string) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && status !== 'all' && { status })
      });
      
      const response = await api.get(`/auth/solicitacoes/batch?${params}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ Get Batches Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // Cancelar lote
  cancelBatch: async (batchId: string) => {
    try {
      const response = await api.delete(`/auth/solicitacoes/batch/${batchId}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ Cancel Batch Error:", error.response?.data || error.message);
      throw error;
    }
  },
};
