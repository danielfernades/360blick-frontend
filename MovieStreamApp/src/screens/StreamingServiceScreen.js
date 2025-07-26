import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import StreamingService from '../services/streamingService';
import UserService from '../services/userService';
import ContentCard from '../components/ContentCard';

const StreamingServiceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { service: initialService } = route.params;

  const [service, setService] = useState(initialService);
  const [availableContent, setAvailableContent] = useState([]);
  const [isInProfile, setIsInProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentFilter, setContentFilter] = useState('all'); // all, movies, series

  useEffect(() => {
    loadServiceDetails();
    checkIfInProfile();
  }, []);

  const loadServiceDetails = async () => {
    try {
      setLoading(true);
      const serviceDetails = await StreamingService.getServiceDetails(service.id);
      if (serviceDetails) {
        setService(serviceDetails);
        setAvailableContent(serviceDetails.availableContent || []);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do serviço:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfInProfile = async () => {
    const inProfile = await UserService.isServiceInProfile(service.id);
    setIsInProfile(inProfile);
  };

  const handleToggleService = async () => {
    if (isInProfile) {
      const success = await UserService.removeServiceFromProfile(service.id);
      if (success) {
        setIsInProfile(false);
        Alert.alert('Removido', 'Serviço removido do seu perfil');
      }
    } else {
      const success = await UserService.addServiceToProfile(service);
      if (success) {
        setIsInProfile(true);
        Alert.alert('Adicionado', 'Serviço adicionado ao seu perfil');
      }
    }
  };

  const handleOpenService = () => {
    Linking.openURL(service.url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o link');
    });
  };

  const handleContentPress = (content) => {
    navigation.navigate('MovieDetail', { content });
  };

  const getFilteredContent = () => {
    if (contentFilter === 'movies') {
      return availableContent.filter(c => c.type === 'movie');
    } else if (contentFilter === 'series') {
      return availableContent.filter(c => c.type === 'series');
    }
    return availableContent;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Premium':
        return '#FFD700';
      case 'Free':
        return '#4CAF50';
      case 'Freemium':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  const renderContentCard = ({ item }) => (
    <ContentCard
      content={item}
      onPress={handleContentPress}
      size="medium"
    />
  );

  const ServiceHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <LinearGradient
        colors={[service.color + '30', service.color + '10']}
        style={styles.serviceInfo}
      >
        <View style={styles.serviceHeader}>
          <View style={styles.iconContainer}>
            <Text style={styles.serviceIcon}>{service.icon}</Text>
          </View>
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <View style={styles.serviceMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(service.category) }]}>
                <Text style={styles.categoryText}>{service.category}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{service.rating}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {(service.content.movies / 1000).toFixed(0)}k
            </Text>
            <Text style={styles.statLabel}>Filmes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {(service.content.series / 100).toFixed(0)}00
            </Text>
            <Text style={styles.statLabel}>Séries</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {(service.content.originals / 100).toFixed(0)}00
            </Text>
            <Text style={styles.statLabel}>Originais</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.addButton,
              isInProfile && styles.addButtonActive
            ]}
            onPress={handleToggleService}
          >
            <Ionicons
              name={isInProfile ? 'checkmark' : 'add'}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.addButtonText}>
              {isInProfile ? 'No Perfil' : 'Adicionar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.visitButton}
            onPress={handleOpenService}
          >
            <Ionicons name="open-outline" size={20} color={service.color} />
            <Text style={[styles.visitButtonText, { color: service.color }]}>
              Visitar
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const ContentFilter = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.contentTitle}>
        Conteúdo Disponível ({getFilteredContent().length})
      </Text>
      
      <View style={styles.filterButtons}>
        {[
          { id: 'all', name: 'Tudo', icon: 'grid' },
          { id: 'movies', name: 'Filmes', icon: 'film' },
          { id: 'series', name: 'Séries', icon: 'tv' },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              contentFilter === filter.id && styles.filterButtonActive
            ]}
            onPress={() => setContentFilter(filter.id)}
          >
            <Ionicons
              name={filter.icon}
              size={16}
              color={contentFilter === filter.id ? '#FFFFFF' : '#8E8E8E'}
            />
            <Text
              style={[
                styles.filterText,
                contentFilter === filter.id && styles.filterTextActive
              ]}
            >
              {filter.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
        <ServiceHeader />
        <ContentFilter />
        
        {getFilteredContent().length > 0 ? (
          <FlatList
            data={getFilteredContent()}
            renderItem={renderContentCard}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.contentGrid}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="film-outline" size={64} color="#404040" />
            <Text style={styles.emptyTitle}>Nenhum conteúdo encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Não há conteúdo disponível para este filtro
            </Text>
          </View>
        )}

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
  serviceInfo: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#404040',
  },
  serviceIcon: {
    fontSize: 28,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
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
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333333',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E8E',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#333333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    gap: 8,
  },
  addButtonActive: {
    backgroundColor: '#4CAF50',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  visitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
    gap: 8,
  },
  visitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  filterText: {
    fontSize: 14,
    color: '#8E8E8E',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  contentGrid: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E8E',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default StreamingServiceScreen;