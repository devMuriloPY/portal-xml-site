// Configurações de ambiente
export const config = {
  // URL base da API - pode ser sobrescrita por variáveis de ambiente
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://gosks0kwskokowo08gokkow4.72.60.147.139.sslip.io",
  
  // Ambiente atual
  environment: import.meta.env.VITE_APP_ENV || "development",
  
  // URLs para diferentes ambientes (fallback)
  urls: {
    development: "http://gosks0kwskokowo08gokkow4.72.60.147.139.sslip.io",
    staging: "http://gosks0kwskokowo08gokkow4.72.60.147.139.sslip.io", // Substitua pela URL de staging
    production: "http://gosks0kwskokowo08gokkow4.72.60.147.139.sslip.io", // Substitua pela URL de produção
  }
};

// Função para obter a URL base baseada no ambiente
export const getApiBaseUrl = (): string => {
  // Se VITE_API_BASE_URL estiver definida, use ela
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Caso contrário, use a URL baseada no ambiente
  const env = config.environment as keyof typeof config.urls;
  return config.urls[env] || config.urls.development;
};

// Log da configuração atual (apenas em desenvolvimento)
if (config.environment === "development") {
  console.log("🔧 Configuração da API:", {
    environment: config.environment,
    apiBaseUrl: getApiBaseUrl(),
    viteApiBaseUrl: import.meta.env.VITE_API_BASE_URL
  });
}
