import { Platform } from 'react-native';

// IDs de teste do AdMob (substitua pelos seus IDs em produção)
export const AdMobIds = {
  // Banner Ads
  BANNER_HOME: Platform.OS === 'ios' 
    ? 'ca-app-pub-3940256099942544/2934735716'  // iOS Test Banner
    : 'ca-app-pub-3940256099942544/6300978111', // Android Test Banner
    
  BANNER_SEARCH: Platform.OS === 'ios' 
    ? 'ca-app-pub-3940256099942544/2934735716'  // iOS Test Banner
    : 'ca-app-pub-3940256099942544/6300978111', // Android Test Banner

  // Interstitial Ads
  INTERSTITIAL_SERVICE_DETAILS: Platform.OS === 'ios'
    ? 'ca-app-pub-3940256099942544/4411468910'  // iOS Test Interstitial
    : 'ca-app-pub-3940256099942544/1033173712', // Android Test Interstitial
    
  INTERSTITIAL_MOVIE_DETAILS: Platform.OS === 'ios'
    ? 'ca-app-pub-3940256099942544/4411468910'  // iOS Test Interstitial
    : 'ca-app-pub-3940256099942544/1033173712', // Android Test Interstitial

  // Rewarded Ads
  REWARDED_PREMIUM_CONTENT: Platform.OS === 'ios'
    ? 'ca-app-pub-3940256099942544/1712485313'  // iOS Test Rewarded
    : 'ca-app-pub-3940256099942544/5224354917', // Android Test Rewarded
    
  REWARDED_WATCHLIST_BOOST: Platform.OS === 'ios'
    ? 'ca-app-pub-3940256099942544/1712485313'  // iOS Test Rewarded
    : 'ca-app-pub-3940256099942544/5224354917', // Android Test Rewarded

  // Native Ads
  NATIVE_CONTENT_LIST: Platform.OS === 'ios'
    ? 'ca-app-pub-3940256099942544/3986624511'  // iOS Test Native
    : 'ca-app-pub-3940256099942544/2247696110', // Android Test Native
};

// Configurações de anúncios
export const AdConfig = {
  // Frequência de anúncios intersticiais
  INTERSTITIAL_FREQUENCY: 3, // A cada 3 navegações
  
  // Tempo mínimo entre anúncios (em minutos)
  MIN_TIME_BETWEEN_ADS: 5,
  
  // Configuração de banner
  BANNER_SIZE: 'SMART_BANNER',
  
  // Configuração para desenvolvimento
  TEST_DEVICE_IDS: [
    '__DEVICE__', // ID do dispositivo atual em modo de teste
  ],
  
  // Keywords para targeting (opcional)
  KEYWORDS: [
    'movies',
    'series',
    'streaming',
    'entertainment',
    'films',
    'tv shows',
    'netflix',
    'cinema'
  ],
  
  // Configurações de consentimento (GDPR/CCPA)
  CONTENT_RATING: 'T', // Teen
  TAG_FOR_CHILD_DIRECTED_TREATMENT: false,
  TAG_FOR_UNDER_AGE_OF_CONSENT: false,
};

// IMPORTANTE: 
// Em produção, substitua todos os IDs de teste pelos seus IDs reais do AdMob
// Exemplo de formato real: 'ca-app-pub-1234567890123456/0987654321'