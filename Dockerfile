# Dockerfile para deploy no Coolify com Caddy
# Este Dockerfile garante que o Caddy esteja configurado corretamente para SPAs

FROM node:18-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm ci

# Copia o código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção com Caddy
FROM caddy:2-alpine

# Copia os arquivos buildados para o diretório do Caddy
COPY --from=builder /app/dist /app/dist

# Copia o Caddyfile com a configuração para SPA (history API fallback)
COPY Caddyfile /etc/caddy/Caddyfile

# Expõe as portas 80 e 443
EXPOSE 80
EXPOSE 443

# O Caddy inicia automaticamente usando o Caddyfile

