import axios from 'axios';

const BASE_URL = 'https://portal-xml-api-new-portal-xml-api.up.railway.app';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Ensure credentials are included
  withCredentials: true
});

// Request interceptor for logging and token handling
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request details
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (cnpj: string, senha: string) => {
    try {
      const formattedCnpj = cnpj.replace(/\D/g, '')
        .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
      
      const response = await api.post('/auth/login', {
        cnpj: formattedCnpj,
        senha
      });
      return response.data;
    } catch (error: any) {
      console.error('Login Error:', error.response?.data || error.message);
      throw error;
    }
  },

  primeiroAcesso: async (cnpj: string, senha: string, senha_confirmacao: string) => {
    try {
        const formattedCnpj = cnpj.replace(/\D/g, '')
          .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');

        const response = await api.post('/auth/primeiro-acesso', {
          cnpj: formattedCnpj,
          senha,
          senha_confirmacao
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Se a resposta for 201, retorna sucesso
        if (response.status === 201) {
          return response.data || { message: "Senha cadastrada com sucesso!" };
        }

        // Se o status for diferente de 201, trata como erro
        throw new Error(response.data?.message || "Erro desconhecido ao cadastrar");
        
      } catch (error: any) {
        console.error('Primeiro Acesso Error:', error.response?.data || error.message);
        throw error;
      }
  },

  solicitarRedefinicao: async (email: string) => {
    try {
      const response = await api.post('/auth/solicitar-redefinicao', { email });
      return response.data;
    } catch (error: any) {
      console.error('Solicitar Redefinição Error:', error.response?.data || error.message);
      throw error;
    }
  },

  redefinirSenha: async (token: string, nova_senha: string, confirmar_senha: string) => {
    try {
      const response = await api.post('/auth/redefinir-senha', {
        token,
        nova_senha,
        confirmar_senha
      });
      return response.data;
    } catch (error: any) {
      console.error('Redefinir Senha Error:', error.response?.data || error.message);
      throw error;
    }
  }
};