import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { Colors } from '../constants/theme';
import adService from '../services/adService';

const { width } = Dimensions.get('window');

const AdBanner = ({ 
  adUnitId, 
  size = BannerAdSize.SMART_BANNER,
  style,
  onError,
  onLoaded,
  showBackground = true 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleAdLoaded = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoaded && onLoaded();
  };

  const handleAdError = (error) => {
    setHasError(true);
    setIsLoaded(false);
    console.warn('Banner ad error:', error);
    onError && onError(error);
  };

  // Não renderizar se não tem ID ou se houve erro persistente
  if (!adUnitId || hasError) {
    return null;
  }

  return (
    <View style={[
      styles.container,
      showBackground && styles.backgroundContainer,
      style
    ]}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          keywords: [
            'movies',
            'series',
            'streaming',
            'entertainment',
            'films',
            'tv shows'
          ],
        }}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backgroundContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginVertical: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

export default AdBanner;