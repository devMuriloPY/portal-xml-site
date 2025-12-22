# Configuração do Caddy para SPA React Router

## Problema Resolvido
Ao recarregar (F5) em rotas como `/dashboard`, a página ficava em branco porque o Caddy tentava servir a rota como arquivo real ao invés de fazer fallback para `index.html`.

## Solução Implementada

### Arquivos Criados/Atualizados

1. **`Caddyfile`** - Configuração principal do Caddy com o domínio específico
2. **`Caddyfile.port80`** - Versão alternativa sem amarrar ao domínio (use se o Coolify gerencia o domínio)
3. **`Dockerfile`** - Atualizado para usar Caddy ao invés de Nginx
4. **`vite.config.ts`** - Adicionado `base: "/"` para garantir que está na raiz

### Configuração do Caddyfile

O Caddyfile usa a diretiva `try_files` que:
- Tenta servir o arquivo solicitado (`{path}`)
- Se não encontrar, serve `/index.html`
- Isso permite que o React Router resolva as rotas no cliente

```caddy
portalcontador.wmsistemas.inf.br {
  root * /app/dist
  encode gzip zstd

  try_files {path} /index.html
  file_server
}
```

### Como Funciona

1. Usuário acessa `/dashboard` e pressiona F5
2. Caddy recebe a requisição para `/dashboard`
3. Tenta encontrar arquivo em `/app/dist/dashboard` (não existe)
4. `try_files` redireciona para `/index.html`
5. React Router carrega e renderiza a rota `/dashboard` corretamente

### Deploy no Coolify

1. Faça commit e push dos arquivos:
   - `Caddyfile`
   - `Dockerfile` (atualizado)
   - `vite.config.ts` (atualizado)

2. O Coolify deve detectar o Dockerfile e fazer o build

3. Se o Coolify já gerencia o domínio, você pode precisar usar `Caddyfile.port80` ao invés de `Caddyfile`

4. Após o deploy, teste:
   - Acesse `https://portalcontador.wmsistemas.inf.br/dashboard`
   - Pressione F5
   - A página deve carregar normalmente

### Verificação

Se ainda não funcionar, verifique no Coolify:
- O caminho do build está correto (`/app/dist`)
- O Caddyfile está sendo usado
- O domínio está configurado corretamente

