import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../constants/theme';
import adService from '../services/adService';
import { useToast } from '../context/ToastContext';

const RewardedAdButton = ({ 
  onRewardEarned, 
  onAdFailed,
  title = "Assistir anúncio e ganhar recompensa",
  subtitle = "Ganhe benefícios exclusivos",
  icon = "gift",
  style,
  disabled = false
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    // Verificar se anúncio está pronto
    const checkAdStatus = () => {
      setIsReady(adService.isRewardedAdReady());
    };

    checkAdStatus();
    
    // Verificar periodicamente
    const interval = setInterval(checkAdStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handlePress = async () => {
    if (!isReady || isLoading || disabled) {
      showInfo('Anúncio não está disponível no momento');
      return;
    }

    setIsLoading(true);
    showInfo('Carregando anúncio...');

    try {
      const result = await adService.showRewardedAd();
      
      if (result.success && result.rewarded) {
        showSuccess('Recompensa ganha com sucesso!');
        onRewardEarned && onRewardEarned();
      } else if (result.success && !result.rewarded) {
        showError('Anúncio fechado antes do fim');
        onAdFailed && onAdFailed('Anúncio não foi completado');
      } else {
        showError('Erro ao carregar anúncio');
        onAdFailed && onAdFailed('Falha ao carregar anúncio');
      }
    } catch (error) {
      console.error('Erro no anúncio recompensado:', error);
      showError('Erro inesperado ao mostrar anúncio');
      onAdFailed && onAdFailed(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonColors = () => {
    if (disabled || !isReady) {
      return [Colors.textMuted, Colors.border];
    }
    return [Colors.warning, Colors.accent];
  };

  const getTextColor = () => {
    if (disabled || !isReady) {
      return Colors.textMuted;
    }
    return Colors.textPrimary;
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled || !isReady || isLoading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getButtonColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={isLoading ? "time" : icon} 
              size={24} 
              color={getTextColor()} 
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: getTextColor() }]}>
              {isLoading ? 'Carregando...' : title}
            </Text>
            <Text style={[styles.subtitle, { color: getTextColor() }]}>
              {isLoading ? 'Preparando anúncio' : subtitle}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            {isReady && !isLoading && (
              <View style={styles.readyIndicator}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              </View>
            )}
            {!isReady && !isLoading && (
              <View style={styles.notReadyIndicator}>
                <Ionicons name="time-outline" size={16} color={Colors.textMuted} />
              </View>
            )}
            {isLoading && (
              <View style={styles.loadingIndicator}>
                <Ionicons name="reload" size={16} color={getTextColor()} />
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: Spacing.sm,
  },
  gradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    opacity: 0.8,
  },
  statusContainer: {
    marginLeft: Spacing.sm,
  },
  readyIndicator: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notReadyIndicator: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RewardedAdButton;