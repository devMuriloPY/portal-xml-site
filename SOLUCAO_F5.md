# Solução para Problema de Tela Branca ao Dar F5

## Problema
Ao recarregar (F5) em rotas como `/dashboard`, a página fica em branco.

## Causa
O servidor Nginx não está configurado para redirecionar rotas do React Router para `index.html`.

## Soluções (escolha uma)

### ✅ Solução 1: Configurar Manualmente no Painel do Coolify (MAIS RÁPIDA)

1. Acesse o painel do Coolify
2. Vá até seu aplicativo
3. Clique em **"Settings"** ou **"Configurações"**
4. Procure por **"Nginx Configuration"** ou **"Web Server Configuration"**
5. Na seção de configuração do Nginx, adicione ou modifique o bloco `location /`:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

6. Salve e faça o redeploy

### ✅ Solução 2: Usar o Dockerfile (Recomendada)

O `Dockerfile` já está configurado corretamente. No Coolify:

1. Vá em **Settings** do seu aplicativo
2. Em **"Build Settings"**, certifique-se de que:
   - **Build Pack**: Dockerfile (não "Static Site")
   - O Dockerfile está sendo detectado
3. Faça o redeploy

### ✅ Solução 3: Verificar se o Coolify está usando Static Site

Se o Coolify detectou como "Static Site":

1. Vá em **Settings**
2. Procure por **"Nginx Configuration"** ou **"Custom Nginx Config"**
3. Cole o conteúdo completo do arquivo `nginx.conf`
4. Salve e faça o redeploy

## Como Verificar se Funcionou

1. Acesse: `https://portalcontador.wmsistemas.inf.br/dashboard`
2. Pressione **F5**
3. A página deve carregar normalmente (não ficar em branco)

## Arquivos Importantes

- `nginx.conf` - Configuração do Nginx com `try_files`
- `Dockerfile` - Build completo com Nginx configurado
- `public/.htaccess` - Para servidores Apache (caso necessário)

## Nota Importante

O Coolify pode estar usando uma configuração padrão do Nginx que não tem o `try_files`. 
A **Solução 1** (configuração manual) é geralmente a mais rápida e eficaz.

