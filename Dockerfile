# Dockerfile para deploy no Coolify
# Este Dockerfile é opcional - o Coolify pode detectar automaticamente projetos Vite

FROM nginx:alpine

# Copia os arquivos buildados para o diretório do Nginx
COPY dist /usr/share/nginx/html

# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]

