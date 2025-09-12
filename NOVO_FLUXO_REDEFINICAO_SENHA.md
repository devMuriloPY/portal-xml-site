# Novo Fluxo de Redefinição de Senha com OTP

## Visão Geral

Foi implementado um novo fluxo de redefinição de senha que utiliza códigos OTP (One-Time Password) de 4 dígitos enviados por e-mail, substituindo o sistema anterior baseado em tokens.

## Fluxo Implementado

### 1. Solicitação de Código (`/forgot-password`)
- **Página**: `ForgotPasswordPage.tsx`
- **Funcionalidades**:
  - Campo para e-mail ou CNPJ com validação
  - Máscara automática para CNPJ (formato: 00.000.000/0001-00)
  - Validação em tempo real (e-mail válido ou CNPJ de 14 dígitos)
  - Normalização do CNPJ (remove máscara) antes de enviar para API
  - Rate limiting com cooldown de 60 segundos
  - Resposta genérica para segurança (anti-enumeração)

### 2. Verificação de Código (`/verify-code`)
- **Página**: `VerifyCodePage.tsx`
- **Funcionalidades**:
  - 4 campos separados para inserção do código
  - Auto-focus entre campos
  - Suporte a paste de código completo
  - Timer de expiração (15 minutos)
  - Opção de reenvio após expiração
  - Validação do código com feedback visual

### 3. Definição de Nova Senha (`/new-password`)
- **Página**: `NewPasswordPage.tsx`
- **Funcionalidades**:
  - Campo para nova senha com indicador de força
  - Campo de confirmação com validação de correspondência
  - Validação de senha (mínimo 6 caracteres)
  - Indicadores visuais de força da senha
  - Botões para mostrar/ocultar senha

## Endpoints da API

### 1. Solicitar Código OTP
```
POST /auth/password/otp/request
Body: { "identifier": "email@exemplo.com" | "12345678000100" }
```

### 2. Verificar Código OTP
```
POST /auth/password/otp/verify
Body: { "identifier": "email@exemplo.com", "code": "1234" }
Resposta: { "status": "ok", "reset_token": "jwt_token" }
```

### 3. Redefinir Senha com Token
```
POST /auth/password/reset
Header: Authorization: Bearer jwt_token
Body: { "new_password": "novaSenha123" }
Resposta: { "message": "Senha atualizada." }
```

## Características de Segurança

- **Anti-enumeração**: Resposta sempre genérica independente da existência da conta
- **Rate Limiting**: Cooldown de 60 segundos entre solicitações
- **Expiração**: Códigos OTP expiram em 15 minutos, Reset Token em 30 minutos
- **Validação**: Códigos são de 4 dígitos numéricos
- **Normalização**: CNPJ é normalizado no frontend para melhor UX
- **Token JWT**: Reset token usado no header Authorization com formato "Bearer token"
- **Limite de tentativas**: Máximo 5 tentativas por código OTP

## Navegação

- **Login** → "Esqueceu a senha?" → `/forgot-password`
- **Forgot Password** → Sucesso → `/verify-code`
- **Verify Code** → Sucesso → `/new-password`
- **New Password** → Sucesso → `/login`

## Arquivos Criados/Modificados

### Novos Arquivos
- `src/pages/ForgotPasswordPage.tsx` - Solicitação de código
- `src/pages/VerifyCodePage.tsx` - Verificação de código
- `src/pages/NewPasswordPage.tsx` - Definição de nova senha

### Arquivos Modificados
- `src/services/api.ts` - Novos métodos para fluxo OTP com reset_token
- `src/types/index.ts` - Tipos TypeScript para novo fluxo
- `src/App.tsx` - Novas rotas
- `src/pages/LoginPage.tsx` - Link atualizado para nova rota
- `src/pages/VerifyCodePage.tsx` - Salva reset_token no localStorage
- `src/pages/NewPasswordPage.tsx` - Usa reset_token do localStorage

### Arquivos Removidos
- `src/pages/ResetPasswordPage.tsx` - Página antiga removida

## Compatibilidade

Os métodos antigos foram mantidos no `api.ts` para compatibilidade, mas podem ser removidos após confirmação de que não são mais necessários.

## Validações Implementadas

### Frontend
- E-mail: Regex padrão para validação
- CNPJ: Aceita 14 dígitos ou formato com máscara
- Senha: Mínimo 6 caracteres com indicador de força
- Código: Exatamente 4 dígitos numéricos

### UX/UI
- Loading states em todos os botões
- Feedback visual para validações
- Mensagens de erro amigáveis
- Auto-focus e navegação por teclado
- Responsividade para mobile

## Tratamento de Erros

### Token Inválido/Expirado
- Status 401/403: Limpa localStorage e redireciona para `/forgot-password`
- Mensagem: "Token expirado. Solicite um novo código."

### Código OTP Incorreto
- Máximo 5 tentativas por código
- Limpa campos e foca no primeiro campo
- Mensagem: "Código inválido ou expirado"

### Rate Limiting
- Status 429: Ativa cooldown de 60 segundos
- Mensagem: "Aguarde um instante antes de solicitar outro código."

### Armazenamento Seguro
- `resetToken`: Salvo após verificação bem-sucedida do OTP
- `resetIdentifier`: Mantido durante todo o fluxo
- Limpeza automática após sucesso ou erro de token
