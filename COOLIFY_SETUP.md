# Configuração do Coolify para SPA React Router

## Problema
Ao recarregar (F5) em rotas como `/dashboard`, a página fica em branco porque o servidor não está redirecionando para `index.html`.

## Solução

### Opção 1: Configuração via Painel do Coolify (Recomendado)

1. Acesse o painel do Coolify
2. Vá até a configuração do seu aplicativo
3. Na seção **"Nginx Configuration"** ou **"Web Server Configuration"**, adicione:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Opção 2: Usar o arquivo nginx.conf

O arquivo `nginx.conf` na raiz do projeto já está configurado. No Coolify:

1. Vá em **Settings** do seu aplicativo
2. Procure por **"Nginx Configuration"** ou **"Custom Nginx Config"**
3. Cole o conteúdo do arquivo `nginx.conf` ou aponte para o arquivo

### Opção 3: Dockerfile (se necessário)

Se o Coolify não detectar automaticamente, você pode criar um `Dockerfile`:

```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Verificação

Após o deploy, teste:
- Acesse `https://portalcontador.wmsistemas.inf.br/dashboard`
- Pressione F5
- A página deve carregar normalmente (não ficar em branco)

