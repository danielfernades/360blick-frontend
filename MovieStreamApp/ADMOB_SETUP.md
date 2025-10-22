# 🚀 Guia de Configuração do AdMob - MovieStreamApp

Este guia mostra como configurar e personalizar os anúncios do Google AdMob no aplicativo MovieStreamApp para gerar receita.

## 📋 Pré-requisitos

1. **Conta Google AdMob**: [Criar conta no AdMob](https://admob.google.com/)
2. **App registrado no AdMob Console**
3. **Conta Google Play Console** (para Android)
4. **Conta App Store Connect** (para iOS)

## 🔧 Configuração Inicial

### 1. Criar App no AdMob Console

1. Acesse [AdMob Console](https://apps.admob.google.com/)
2. Clique em "Adicionar app"
3. Escolha "Sim" se o app já está publicado, ou "Não" se ainda não
4. Selecione a plataforma (Android/iOS)
5. Digite o nome do app: "MovieStreamApp"
6. Escolha categoria: "Entretenimento"

### 2. Obter IDs do App

Após criar o app, você receberá:
- **Android App ID**: `ca-app-pub-XXXXXXXXXX~XXXXXXXXXX`
- **iOS App ID**: `ca-app-pub-XXXXXXXXXX~XXXXXXXXXX`

## 🎯 Configurar Unidades de Anúncio

### 1. Banner Ads (4 unidades)

```javascript
// Home Screen Banner
BANNER_HOME: 'ca-app-pub-XXXXXXXXXX/XXXXXXXXXX'

// Search Screen Banner  
BANNER_SEARCH: 'ca-app-pub-XXXXXXXXXX/XXXXXXXXXX'
```

**Configuração no AdMob:**
- Formato: Banner
- Tamanho: Smart Banner
- Nome: "Home Banner" / "Search Banner"

### 2. Interstitial Ads (2 unidades)

```javascript
// Service Details Interstitial
INTERSTITIAL_SERVICE_DETAILS: 'ca-app-pub-XXXXXXXXXX/XXXXXXXXXX'

// Movie Details Interstitial
INTERSTITIAL_MOVIE_DETAILS: 'ca-app-pub-XXXXXXXXXX/XXXXXXXXXX'
```

**Configuração no AdMob:**
- Formato: Intersticial
- Nome: "Service Details" / "Movie Details"

### 3. Rewarded Ads (2 unidades)

```javascript
// Premium Content Rewarded
REWARDED_PREMIUM_CONTENT: 'ca-app-pub-XXXXXXXXXX/XXXXXXXXXX'

// Watchlist Boost Rewarded
REWARDED_WATCHLIST_BOOST: 'ca-app-pub-XXXXXXXXXX/XXXXXXXXXX'
```

**Configuração no AdMob:**
- Formato: Recompensado
- Nome: "Premium Content" / "Watchlist Boost"

## ⚙️ Configuração no Código

### 1. Atualizar IDs no arquivo `src/constants/ads.js`:

```javascript
export const AdMobIds = {
  // Substituir pelos seus IDs reais
  BANNER_HOME: Platform.OS === 'ios' 
    ? 'ca-app-pub-SEU_ID_AQUI/BANNER_IOS'
    : 'ca-app-pub-SEU_ID_AQUI/BANNER_ANDROID',
    
  // ... outros IDs
};
```

### 2. Atualizar `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "android_app_id": "ca-app-pub-SEU_ID_ANDROID~APP_ID",
          "ios_app_id": "ca-app-pub-SEU_ID_IOS~APP_ID"
        }
      ]
    ]
  }
}
```

## 📊 Estratégia de Monetização Implementada

### 🎯 Banner Ads
- **Localização**: Home e Search screens
- **Frequência**: Sempre visível
- **Receita**: Baixa, mas constante (CPM)

### ⚡ Interstitial Ads
- **Localização**: Ao navegar para detalhes
- **Frequência**: A cada 3 navegações + 5 min de intervalo
- **Receita**: Média-alta (CPM + CPC)

### 🎁 Rewarded Ads
- **Localização**: Home e Profile screens
- **Frequência**: Sob demanda do usuário
- **Receita**: Alta (eCPM)
- **Benefícios**: Premium temporário, funcionalidades extras

## 💡 Otimizações de Receita

### 1. Targeting e Keywords
```javascript
KEYWORDS: [
  'movies', 'series', 'streaming', 'entertainment',
  'films', 'tv shows', 'netflix', 'cinema'
]
```

### 2. Configurações de Audiência
```javascript
CONTENT_RATING: 'T', // Teen (13+)
TAG_FOR_CHILD_DIRECTED_TREATMENT: false,
TAG_FOR_UNDER_AGE_OF_CONSENT: false,
```

### 3. Controle de Frequência
- **Intersticiais**: Máximo 1 a cada 5 minutos
- **Banners**: Refresh automático (30-60s)
- **Recompensados**: Ilimitados (usuário escolhe)

## 🧪 Testes Durante Desenvolvimento

### IDs de Teste (já configurados):
```javascript
// Mantenha estes IDs durante desenvolvimento
iOS Banner: 'ca-app-pub-3940256099942544/2934735716'
Android Banner: 'ca-app-pub-3940256099942544/6300978111'
iOS Interstitial: 'ca-app-pub-3940256099942544/4411468910'
Android Interstitial: 'ca-app-pub-3940256099942544/1033173712'
iOS Rewarded: 'ca-app-pub-3940256099942544/1712485313'
Android Rewarded: 'ca-app-pub-3940256099942544/5224354917'
```

### Comandos para Teste:
```bash
# Executar em modo desenvolvimento
npm start

# Verificar anúncios no Ad Inspector (automático em __DEV__)
# Acessível via shake do dispositivo
```

## 📈 Métricas e Otimização

### KPIs Principais:
- **eCPM** (Effective Cost Per Mille)
- **Fill Rate** (Taxa de preenchimento)
- **CTR** (Click Through Rate)
- **Impressions** (Impressões)

### Monitoramento Recomendado:
1. **AdMob Console**: Métricas detalhadas
2. **Firebase Analytics**: Comportamento do usuário
3. **App Store/Play Console**: Reviews sobre anúncios

## 🚨 Políticas e Compliance

### ✅ Implementações de Compliance:
- **GDPR/CCPA**: Consentimento automático implementado
- **COPPA**: Configurado para teen (13+)
- **Transparência**: Anúncios claramente identificados

### ❌ Evitar:
- Cliques acidentais em anúncios
- Anúncios em posições enganosas
- Frequência excessiva de intersticiais
- Anúncios em conteúdo inadequado

## 🔄 Deploy e Produção

### 1. Antes do Deploy:
```bash
# 1. Substituir TODOS os IDs de teste pelos reais
# 2. Remover logs de debug
# 3. Testar em dispositivos reais
# 4. Verificar políticas do AdMob
```

### 2. Checklist Pré-Publicação:
- [ ] IDs de produção configurados
- [ ] App IDs corretos no app.json
- [ ] Testes em iOS e Android
- [ ] Compliance com policies
- [ ] Documentação atualizada

### 3. Após Publicação:
- [ ] Monitorar métricas primeiras 48h
- [ ] Verificar Fill Rate
- [ ] Acompanhar reviews de usuários
- [ ] Otimizar baseado nos dados

## 💰 Estimativa de Receita

### Fatores que Influenciam:
- **Geografia**: Países desenvolvidos = maior eCPM
- **Demografia**: Usuários 18-35 = melhor targeting
- **Engajamento**: Maior tempo no app = mais impressões
- **Sazonalidade**: Feriados = maior competição por anúncios

### Projeção Conservadora (1000 usuários ativos/dia):
- **Banner Ads**: $5-15/dia
- **Interstitial Ads**: $10-30/dia  
- **Rewarded Ads**: $5-20/dia
- **Total Estimado**: $20-65/dia

*Valores variam significativamente baseado na qualidade do tráfego e localização dos usuários.*

## 🛠️ Troubleshooting

### Problemas Comuns:

**Anúncios não aparecem:**
- Verificar IDs corretos
- Checar conexão com internet
- Aguardar 24h após criar unidades

**Fill Rate baixo:**
- Aumentar targeting keywords
- Verificar configurações de mediação
- Contatar suporte AdMob

**App rejeitado:**
- Revisar políticas do AdMob
- Verificar compliance GDPR/COPPA
- Testar em dispositivos reais

## 📞 Suporte

- **AdMob Help Center**: https://support.google.com/admob
- **Firebase Console**: https://console.firebase.google.com
- **Community Forums**: https://groups.google.com/forum/#!forum/google-admob-ads-sdk

---

**Nota**: Este guia usa IDs de teste. SEMPRE substitua pelos IDs reais antes de publicar na loja de aplicativos.