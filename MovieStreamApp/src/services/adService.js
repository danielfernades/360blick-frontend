import mobileAds, {
  InterstitialAd,
  RewardedAd,
  BannerAd,
  BannerAdSize,
  TestIds,
  AdsConsent,
  AdsConsentStatus,
  RewardedAdEventType,
  InterstitialAdEventType,
} from 'react-native-google-mobile-ads';
import { AdMobIds, AdConfig } from '../constants/ads';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AdService {
  constructor() {
    this.interstitialAd = null;
    this.rewardedAd = null;
    this.navigationCount = 0;
    this.lastAdTime = 0;
    this.isInitialized = false;
    
    this.initializeAds();
  }

  // Inicializar AdMob
  async initializeAds() {
    try {
      // Inicializar SDK do AdMob
      await mobileAds().initialize();
      
      // Configurar para desenvolvimento
      if (__DEV__) {
        await mobileAds().openAdInspector();
      }
      
      // Verificar consentimento (GDPR/CCPA)
      await this.checkConsent();
      
      // Pré-carregar anúncios
      this.preloadInterstitialAd();
      this.preloadRewardedAd();
      
      this.isInitialized = true;
      console.log('AdMob inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar AdMob:', error);
    }
  }

  // Verificar consentimento do usuário
  async checkConsent() {
    try {
      const consentInfo = await AdsConsent.requestInfoUpdate();
      
      if (consentInfo.isConsentFormAvailable && consentInfo.status === AdsConsentStatus.REQUIRED) {
        const formResult = await AdsConsent.showForm();
        console.log('Consent form result:', formResult);
      }
    } catch (error) {
      console.error('Erro ao verificar consentimento:', error);
    }
  }

  // Pré-carregar anúncio intersticial
  preloadInterstitialAd(adUnitId = AdMobIds.INTERSTITIAL_SERVICE_DETAILS) {
    if (this.interstitialAd) {
      this.interstitialAd = null;
    }

    this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: false,
      keywords: AdConfig.KEYWORDS,
    });

    this.interstitialAd.addAdEventListener(InterstitialAdEventType.LOADED, () => {
      console.log('Anúncio intersticial carregado');
    });

    this.interstitialAd.addAdEventListener(InterstitialAdEventType.ERROR, (error) => {
      console.error('Erro no anúncio intersticial:', error);
    });

    this.interstitialAd.addAdEventListener(InterstitialAdEventType.CLOSED, () => {
      // Pré-carregar próximo anúncio
      this.preloadInterstitialAd(adUnitId);
    });

    this.interstitialAd.load();
  }

  // Pré-carregar anúncio recompensado
  preloadRewardedAd(adUnitId = AdMobIds.REWARDED_PREMIUM_CONTENT) {
    if (this.rewardedAd) {
      this.rewardedAd = null;
    }

    this.rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: false,
      keywords: AdConfig.KEYWORDS,
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('Anúncio recompensado carregado');
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.ERROR, (error) => {
      console.error('Erro no anúncio recompensado:', error);
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.CLOSED, () => {
      // Pré-carregar próximo anúncio
      this.preloadRewardedAd(adUnitId);
    });

    this.rewardedAd.load();
  }

  // Verificar se pode mostrar anúncio intersticial
  async canShowInterstitialAd() {
    const now = Date.now();
    const timeDiff = (now - this.lastAdTime) / (1000 * 60); // em minutos
    
    return (
      this.isInitialized &&
      this.navigationCount >= AdConfig.INTERSTITIAL_FREQUENCY &&
      timeDiff >= AdConfig.MIN_TIME_BETWEEN_ADS &&
      this.interstitialAd?.loaded
    );
  }

  // Mostrar anúncio intersticial
  async showInterstitialAd(adUnitId = AdMobIds.INTERSTITIAL_SERVICE_DETAILS) {
    try {
      if (await this.canShowInterstitialAd()) {
        await this.interstitialAd.show();
        this.navigationCount = 0;
        this.lastAdTime = Date.now();
        await this.saveAdData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao mostrar anúncio intersticial:', error);
      return false;
    }
  }

  // Mostrar anúncio recompensado
  async showRewardedAd(adUnitId = AdMobIds.REWARDED_PREMIUM_CONTENT) {
    return new Promise((resolve) => {
      if (!this.rewardedAd?.loaded) {
        resolve({ success: false, rewarded: false });
        return;
      }

      let rewarded = false;

      this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('Recompensa ganha:', reward);
        rewarded = true;
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.CLOSED, () => {
        resolve({ success: true, rewarded });
      });

      this.rewardedAd.show().catch((error) => {
        console.error('Erro ao mostrar anúncio recompensado:', error);
        resolve({ success: false, rewarded: false });
      });
    });
  }

  // Incrementar contador de navegação
  incrementNavigationCount() {
    this.navigationCount++;
  }

  // Salvar dados de anúncios no AsyncStorage
  async saveAdData() {
    try {
      const adData = {
        navigationCount: this.navigationCount,
        lastAdTime: this.lastAdTime,
      };
      await AsyncStorage.setItem('@ad_data', JSON.stringify(adData));
    } catch (error) {
      console.error('Erro ao salvar dados de anúncios:', error);
    }
  }

  // Carregar dados de anúncios do AsyncStorage
  async loadAdData() {
    try {
      const adData = await AsyncStorage.getItem('@ad_data');
      if (adData) {
        const parsed = JSON.parse(adData);
        this.navigationCount = parsed.navigationCount || 0;
        this.lastAdTime = parsed.lastAdTime || 0;
      }
    } catch (error) {
      console.error('Erro ao carregar dados de anúncios:', error);
    }
  }

  // Verificar se anúncio recompensado está disponível
  isRewardedAdReady() {
    return this.rewardedAd?.loaded || false;
  }

  // Obter configuração de banner
  getBannerAdProps(adUnitId) {
    return {
      unitId: adUnitId,
      size: BannerAdSize.SMART_BANNER,
      requestOptions: {
        requestNonPersonalizedAdsOnly: false,
        keywords: AdConfig.KEYWORDS,
      },
    };
  }

  // Resetar dados de anúncios (para testes)
  async resetAdData() {
    this.navigationCount = 0;
    this.lastAdTime = 0;
    await this.saveAdData();
  }
}

// Singleton instance
const adService = new AdService();
export default adService;