import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import StreamingService from '../services/streamingService';
import UserService from '../services/userService';
import ServiceCard from '../components/ServiceCard';
import { useToast } from '../context/ToastContext';
import { AdMobIds } from '../constants/ads';
import adService from '../services/adService';

const MovieDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { content: initialContent } = route.params;
  const { showSuccess, showError } = useToast();

  const [content, setContent] = useState(initialContent);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContentDetails();
    checkIfInWatchlist();
    loadUserServices();
    
    // Tentar mostrar anúncio intersticial ao entrar na tela
    const showInterstitialAd = async () => {
      await adService.showInterstitialAd(AdMobIds.INTERSTITIAL_MOVIE_DETAILS);
    };
    
    showInterstitialAd();
  }, []);

  const loadContentDetails = async () => {
    try {
      setLoading(true);
      const contentDetails = await StreamingService.getContentDetails(content.id);
      if (contentDetails) {
        setContent(contentDetails);
        setAvailableServices(contentDetails.services || []);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do conteúdo:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfInWatchlist = async () => {
    const inWatchlist = await UserService.isInWatchlist(content.id);
    setIsInWatchlist(inWatchlist);
  };

  const loadUserServices = async () => {
    const services = await UserService.getUserServices();
    setUserServices(services);
  };

  const handleToggleWatchlist = async () => {
    if (isInWatchlist) {
      const success = await UserService.removeFromWatchlist(content.id);
      if (success) {
        setIsInWatchlist(false);
        showSuccess('Removido da sua watchlist');
      } else {
        showError('Erro ao remover da watchlist');
      }
    } else {
      const success = await UserService.addToWatchlist(content);
      if (success) {
        setIsInWatchlist(true);
        showSuccess('Adicionado à sua watchlist');
      } else {
        showError('Erro ao adicionar à watchlist');
      }
    }
  };

  const handleServicePress = (service) => {
    navigation.navigate('StreamingService', { service });
  };

  const getGenreColor = (genre) => {
    const colors = {
      'Ação': '#FF5722',
      'Aventura': '#FF9800',
      'Comédia': '#FFC107',
      'Drama': '#9C27B0',
      'Ficção Científica': '#3F51B5',
      'Horror': '#F44336',
      'Fantasia': '#E91E63',
      'Romance': '#E91E63',
      'Thriller': '#795548',
      'Animação': '#4CAF50',
    };
    return colors[genre] || '#757575';
  };

  const getAvailableInUserServices = () => {
    return availableServices.filter(service =>
      userServices.some(userService => userService.id === service.id)
    );
  };

  const getNotAvailableInUserServices = () => {
    return availableServices.filter(service =>
      !userServices.some(userService => userService.id === service.id)
    );
  };

  const renderServiceCard = ({ item }) => (
    <ServiceCard
      service={item}
      onPress={handleServicePress}
    />
  );

  const ContentHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.posterContainer}>
        <Image
          source={{ uri: content.poster }}
          style={styles.poster}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.posterOverlay}
        />
      </View>

      <View style={styles.contentInfo}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{content.title}</Text>
          <TouchableOpacity
            style={[
              styles.watchlistButton,
              isInWatchlist && styles.watchlistButtonActive
            ]}
            onPress={handleToggleWatchlist}
          >
            <Ionicons
              name={isInWatchlist ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isInWatchlist ? '#FF6B6B' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.metaInfo}>
          <View style={styles.typeContainer}>
            <Ionicons
              name={content.type === 'movie' ? 'film' : 'tv'}
              size={16}
              color="#FF6B6B"
            />
            <Text style={styles.typeText}>
              {content.type === 'movie' ? 'Filme' : 'Série'}
            </Text>
          </View>
          <Text style={styles.year}>{content.year}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{content.rating}</Text>
          </View>
        </View>

        <View style={styles.genresContainer}>
          {content.genre.map((genre, index) => (
            <View
              key={index}
              style={[
                styles.genreBadge,
                { backgroundColor: getGenreColor(genre) + '30' }
              ]}
            >
              <Text style={[styles.genreText, { color: getGenreColor(genre) }]}>
                {genre}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const AvailabilitySection = () => {
    const availableInUser = getAvailableInUserServices();
    const notAvailableInUser = getNotAvailableInUserServices();

    return (
      <View style={styles.availabilityContainer}>
        {availableInUser.length > 0 && (
          <View style={styles.availabilitySection}>
            <Text style={styles.availabilityTitle}>
              Disponível nos seus serviços ({availableInUser.length})
            </Text>
            <FlatList
              data={availableInUser}
              renderItem={renderServiceCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.servicesList}
            />
          </View>
        )}

        {notAvailableInUser.length > 0 && (
          <View style={styles.availabilitySection}>
            <Text style={styles.availabilityTitle}>
              Outros serviços disponíveis ({notAvailableInUser.length})
            </Text>
            <FlatList
              data={notAvailableInUser}
              renderItem={renderServiceCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.servicesList}
            />
          </View>
        )}

        {availableServices.length === 0 && (
          <View style={styles.noServicesContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#404040" />
            <Text style={styles.noServicesTitle}>Não disponível</Text>
            <Text style={styles.noServicesSubtitle}>
              Este conteúdo não está disponível em nenhum serviço conhecido
            </Text>
          </View>
        )}
      </View>
    );
  };

  const ActionButtons = () => (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.watchlistActionButton,
          isInWatchlist && styles.watchlistActionButtonActive
        ]}
        onPress={handleToggleWatchlist}
      >
        <Ionicons
          name={isInWatchlist ? 'bookmark' : 'bookmark-outline'}
          size={20}
          color="#FFFFFF"
        />
        <Text style={styles.actionButtonText}>
          {isInWatchlist ? 'Na Watchlist' : 'Adicionar à Watchlist'}
        </Text>
      </TouchableOpacity>

      {getAvailableInUserServices().length > 0 && (
        <TouchableOpacity
          style={[styles.actionButton, styles.watchButton]}
          onPress={() => {
            const firstService = getAvailableInUserServices()[0];
            handleServicePress(firstService);
          }}
        >
          <Ionicons name="play" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Assistir Agora</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ContentHeader />
        <ActionButtons />
        <AvailabilitySection />
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  headerContainer: {
    position: 'relative',
    height: 400,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterContainer: {
    flex: 1,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  contentInfo: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 16,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  watchlistButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  watchlistButtonActive: {
    backgroundColor: 'rgba(255,107,107,0.3)',
    borderColor: '#FF6B6B',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  year: {
    fontSize: 14,
    color: '#B0B0B0',
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  genreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  watchlistActionButton: {
    backgroundColor: '#FF6B6B',
  },
  watchlistActionButtonActive: {
    backgroundColor: '#4CAF50',
  },
  watchButton: {
    backgroundColor: '#4ECDC4',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  availabilityContainer: {
    paddingHorizontal: 16,
  },
  availabilitySection: {
    marginBottom: 24,
  },
  availabilityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  servicesList: {
    paddingHorizontal: 4,
  },
  noServicesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noServicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  noServicesSubtitle: {
    fontSize: 14,
    color: '#8E8E8E',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default MovieDetailScreen;