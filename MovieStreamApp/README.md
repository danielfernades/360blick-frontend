# MovieStreamApp 🎬📱

Um aplicativo mobile moderno e elegante para descobrir e gerenciar serviços de streaming de filmes e séries. Com design flat e interface intuitiva, o app permite que usuários explorem diferentes plataformas de streaming e organizem seu conteúdo favorito.

## ✨ Características Principais

### 🎯 Funcionalidades Core
- **Descoberta de Serviços**: Explore uma ampla variedade de serviços de streaming (Netflix, Disney+, Amazon Prime, etc.)
- **Busca Inteligente**: Encontre filmes, séries e serviços por nome, gênero ou categoria
- **Perfil Personalizado**: Adicione serviços ao seu perfil e gerencie sua watchlist
- **Detalhes Completos**: Veja informações detalhadas sobre filmes, séries e serviços
- **Navegação Intuitiva**: Interface limpa com navegação por abas

### 🎨 Design & UX
- **Flat Design Moderno**: Interface elegante com elementos flat
- **Tema Escuro**: Design otimizado para visualização noturna
- **Cores Vibrantes**: Paleta de cores atrativa (#FF6B6B, #4ECDC4)
- **Animações Suaves**: Transições e feedback visual responsivo
- **Responsivo**: Adaptado para diferentes tamanhos de tela

### 📱 Estrutura do App

#### Telas Principais:
1. **Home**: Dashboard com conteúdo personalizado e recomendações
2. **Search**: Busca avançada com filtros por categoria e gênero
3. **Profile**: Gerenciamento de conta, estatísticas e configurações

#### Telas de Detalhes:
- **Serviço de Streaming**: Informações completas e conteúdo disponível
- **Filme/Série**: Detalhes, disponibilidade e ações (watchlist)

## 🛠️ Tecnologias Utilizadas

### Framework e Ferramentas:
- **React Native**: Framework principal para desenvolvimento mobile
- **Expo**: Plataforma de desenvolvimento e build
- **React Navigation**: Navegação entre telas
- **AsyncStorage**: Armazenamento local de dados

### UI/UX:
- **Expo Linear Gradient**: Gradientes elegantes
- **Expo Vector Icons**: Ícones consistentes
- **React Native Reanimated**: Animações performáticas
- **React Native Gesture Handler**: Gestos nativos

### Arquitetura:
```
src/
├── components/          # Componentes reutilizáveis
│   ├── ServiceCard.js   # Card de serviço de streaming
│   └── ContentCard.js   # Card de filme/série
├── screens/             # Telas do aplicativo
│   ├── HomeScreen.js    # Tela inicial
│   ├── SearchScreen.js  # Tela de busca
│   ├── ProfileScreen.js # Tela de perfil
│   ├── StreamingServiceScreen.js # Detalhes do serviço
│   └── MovieDetailScreen.js      # Detalhes do conteúdo
├── services/            # Lógica de negócio
│   ├── streamingService.js # API de streaming
│   └── userService.js      # Gerenciamento do usuário
└── data/               # Dados e configurações
```

## 🚀 Como Executar

### Pré-requisitos:
- Node.js (v16 ou superior)
- npm ou yarn
- Expo CLI global: `npm install -g @expo/cli`

### Instalação:
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Navegue para o diretório
cd MovieStreamApp

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start
```

### Executar no Dispositivo:
1. **Android**: Escaneie o QR code com o app Expo Go
2. **iOS**: Escaneie o QR code com a câmera nativa
3. **Web**: Pressione 'w' no terminal para abrir no navegador

## 📋 Funcionalidades Detalhadas

### 🏠 Home Screen
- Header personalizado com saudação
- Estatísticas rápidas (serviços, watchlist, conteúdo)
- Seções organizadas:
  - Seus Serviços
  - Conteúdo em Alta
  - Serviços Recomendados
  - Filmes Populares
  - Séries em Destaque
- Pull-to-refresh para atualizar dados

### 🔍 Search Screen
- Barra de busca inteligente
- Filtros por tipo (Tudo, Serviços, Conteúdo)
- Filtros rápidos:
  - Categorias (Premium, Free, Freemium)
  - Gêneros (Ação, Comédia, Drama, etc.)
- Resultados organizados por tipo
- Estado vazio elegante quando não há resultados

### 👤 Profile Screen
- Informações do usuário
- Estatísticas detalhadas:
  - Total de serviços
  - Items na watchlist
  - Distribuição por tipo
- Abas organizadas:
  - Serviços do usuário
  - Watchlist
  - Estatísticas detalhadas
- Opção para limpar dados

### 📺 Streaming Service Screen
- Header com informações completas do serviço
- Estatísticas (filmes, séries, originais)
- Botões de ação (Adicionar/Remover, Visitar)
- Lista de conteúdo disponível
- Filtros por tipo de conteúdo
- Link direto para o serviço

### 🎬 Movie Detail Screen
- Header com poster em tela cheia
- Informações detalhadas (gênero, ano, rating)
- Botões de ação (Watchlist, Assistir)
- Disponibilidade nos serviços:
  - Serviços do usuário
  - Outros serviços disponíveis
- Estado quando não disponível

## 🎨 Paleta de Cores

```css
/* Cores Principais */
--primary-red: #FF6B6B      /* Cor principal - vermelho coral */
--primary-teal: #4ECDC4     /* Cor secundária - azul-verde */
--accent-gold: #FFD700      /* Destaque - dourado */
--accent-purple: #9C27B0    /* Destaque - roxo */

/* Tons de Cinza */
--background: #000000       /* Fundo principal */
--surface: #1E1E1E         /* Superfícies elevadas */
--surface-light: #2A2A2A   /* Superfícies mais claras */
--border: #333333          /* Bordas */

/* Texto */
--text-primary: #FFFFFF     /* Texto principal */
--text-secondary: #B0B0B0   /* Texto secundário */
--text-muted: #8E8E8E      /* Texto esmaecido */

/* Status */
--success: #4CAF50         /* Sucesso */
--warning: #FF9800         /* Aviso */
--error: #F44336          /* Erro */
```

## 📊 Dados Demo

O aplicativo inclui dados de demonstração com:
- **8 Serviços de Streaming** (Netflix, Disney+, Amazon Prime, etc.)
- **6 Filmes/Séries Populares** com metadados completos
- **3 Categorias** de serviços (Premium, Free, Freemium)
- **10 Gêneros** diferentes de conteúdo

## ✅ Melhorias Implementadas

### 🎨 UI/UX Avançadas:
- **Sistema de Toast**: Notificações elegantes em vez de alerts nativos
- **Loading Spinner Animado**: Indicador de carregamento personalizado
- **Debounce de Busca**: Otimização para evitar chamadas excessivas à API
- **Animações de Entrada**: Cards aparecem com animações suaves
- **Tema Consistente**: Sistema de cores e constantes centralizadas

### 🛠️ Melhorias Técnicas:
- **Context API**: Gerenciamento global de toast/notificações
- **Hooks Personalizados**: useDebounce para performance
- **Componentes Reutilizáveis**: AnimatedCard, LoadingSpinner, Toast
- **Utilitários**: Funções helpers para formatação e validação
- **Constantes de Tema**: Cores, espaçamentos e tipografia padronizadas

### 📱 Performance:
- **Busca Otimizada**: Debounce de 500ms reduz requisições desnecessárias
- **Animações Nativas**: Usando useNativeDriver para melhor performance
- **Componentes Lazy**: Carregamento otimizado de componentes

## 🔮 Futuras Melhorias

### Funcionalidades Planejadas:
- [ ] Integração com APIs reais de streaming
- [ ] Sistema de notificações push
- [ ] Recomendações baseadas em IA
- [ ] Compartilhamento social
- [ ] Modo offline
- [ ] Sincronização na nuvem
- [ ] Sistema de reviews e ratings
- [ ] Listas personalizadas
- [ ] Filtros avançados de disponibilidade
- [ ] Integração com calendário para lançamentos

### Melhorias Técnicas Futuras:
- [ ] Testes automatizados (Jest/Detox)
- [ ] CI/CD pipeline
- [ ] Monitoramento de performance
- [ ] Otimização de imagens
- [ ] Cache inteligente
- [ ] Logs e analytics
- [ ] Internacionalização (i18n)
- [ ] Acessibilidade (A11y)

## 📝 Licença

Este projeto é um exemplo educacional e pode ser usado livremente para aprendizado e desenvolvimento.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:
1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**MovieStreamApp** - Seu guia pessoal para o mundo do streaming! 🍿✨