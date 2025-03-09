import axios from "axios";

const BASE_URL = "https://portal-xml-api-new-portal-xml-api.up.railway.app";

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
    config.headers.Authorization = token;
  } else {
    console.warn("⚠️ Nenhum token encontrado no localStorage!");
  }
  return config;
});

// ✅ Interceptor de resposta corrigido para evitar erro com 201 Created
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

      localStorage.setItem("token", `Bearer ${response.data.access_token}`); // ✅ Agora salva com "Bearer "
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

  solicitarRedefinicao: async (email: string) => {
    try {
      const response = await api.post("/auth/solicitar-redefinicao", { email });
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
