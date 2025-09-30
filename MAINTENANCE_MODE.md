# Modo de Manutenção - Portal Contador

## 📋 Visão Geral

Sistema de página de manutenção que substitui completamente o site quando ativado via variável de ambiente.

## 🚀 Como Ativar

### 1. Variável de Ambiente

Adicione no arquivo `.env`:

```env
VITE_MAINTENANCE_MODE=true
```

### 2. Reiniciar o Servidor

Após alterar a variável, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 🎨 Design e Funcionalidades

### Cores e Tipografia
- **Fundo**: Charcoal escuro `#0E0F13`
- **Texto principal**: Branco suave `#F5F7FA`
- **Texto secundário**: Cinza claro `#AAB2C8`
- **Acento 1**: Âmbar/laranja `#FFC24B` (cones/avisos)
- **Acento 2**: Azul `#4C9BFF` (links/ícones)
- **Fontes**: Plus Jakarta Sans (títulos), Inter (corpo)

### Animações
- **Guindaste**: Movendo bloco com animação suave
- **Engrenagens**: Rotação contínua em velocidades diferentes
- **Cones de obra**: Elementos estáticos temáticos
- **Faíscas**: Efeitos discretos de construção
- **Estrelas**: Piscando suavemente no fundo
- **Nuvem de poeira**: Efeito de movimento

### Funcionalidades
- **Botão Voltar**: Navegação no histórico do navegador
- **Acessar Portal Contador**: Link externo (placeholder)
- **Falar com o suporte**: Mailto com assunto pré-definido
- **Responsivo**: Mobile-first design
- **Acessível**: Suporte a `prefers-reduced-motion`

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   └── maintenance/
│       └── MaintenanceAnimation.tsx  # Animação SVG
├── pages/
│   └── MaintenancePage.tsx           # Página principal
├── hooks/
│   └── useMaintenance.tsx            # Lógica de verificação
└── App.tsx                           # Integração
```

## 🔧 Componentes

### MaintenanceAnimation.tsx
- Animação SVG com guindaste, engrenagens e efeitos
- Loop suave de 6-10 segundos
- Respeita `prefers-reduced-motion`
- Acessível com `aria-label`

### MaintenancePage.tsx
- Layout responsivo com grid
- Animações de entrada com Framer Motion
- Botões interativos com hover effects
- Rodapé com informações de contato

### useMaintenance.tsx
- Hook para verificar modo de manutenção
- Suporte a variável de ambiente
- Estado de loading
- Tratamento de erros

## 📱 Responsividade

- **Mobile**: Layout em coluna única
- **Tablet**: Grid adaptativo
- **Desktop**: Grid de duas colunas
- **Tipografia**: Escala responsiva

## ♿ Acessibilidade

- **Contraste**: AA/AAA compliant
- **Navegação**: Suporte a teclado
- **Screen readers**: Labels descritivos
- **Reduced motion**: Animações pausáveis
- **Foco visível**: Estados de foco claros

## 🚀 Performance

- **SVG otimizado**: Animações leves
- **Fontes**: Carregamento otimizado
- **Lighthouse**: Alvo ≥ 95
- **Bundle size**: Mínimo impacto

## 🔄 Fluxo de Funcionamento

1. **Verificação**: Hook `useMaintenance` verifica `VITE_MAINTENANCE_MODE`
2. **Renderização**: Se `true`, renderiza `MaintenancePage`
3. **Fallback**: Se `false`, renderiza aplicação normal
4. **Loading**: Estado intermediário durante verificação

## 📞 Informações de Contato

- **Empresa**: WM SISTEMAS DE GESTÃO
- **Produto**: Portal Contador
- **Email**: suporte@wmsistemas.inf.br
- **Telefone**: (34) 3423-8595

## 🛠️ Manutenção

Para desativar o modo de manutenção:

1. Altere `VITE_MAINTENANCE_MODE=false` no `.env`
2. Reinicie o servidor
3. O site voltará ao funcionamento normal

## 📝 Notas Técnicas

- **Build time**: Variável é resolvida em build time
- **Hot reload**: Funciona em desenvolvimento
- **Production**: Funciona em produção
- **SSR**: Compatível com renderização no servidor
