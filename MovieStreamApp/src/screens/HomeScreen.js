import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import StreamingService from '../services/streamingService';
import UserService from '../services/userService';
import ServiceCard from '../components/ServiceCard';
import ContentCard from '../components/ContentCard';
import LoadingSpinner from '../components/LoadingSpinner';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [popularContent, setPopularContent] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [content, services, profile, userSvcs] = await Promise.all([
        StreamingService.getPopularContent(),
        StreamingService.getAvailableServices(),
        UserService.getUserProfile(),
        UserService.getUserServices()
      ]);

      setPopularContent(content);
      setAllServices(services);
      setUserProfile(profile);
      setUserServices(userSvcs);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleServicePress = (service) => {
    navigation.navigate('StreamingService', { service });
  };

  const handleContentPress = (content) => {
    navigation.navigate('MovieDetail', { content });
  };

  const renderServiceCard = ({ item }) => (
    <ServiceCard
      service={item}
      onPress={handleServicePress}
      onToggleFavorite={loadData}
    />
  );

  const renderContentCard = ({ item }) => (
    <ContentCard
      content={item}
      onPress={handleContentPress}
      onToggleWatchlist={loadData}
      size="medium"
    />
  );

  const CategoryFilter = ({ title, data, renderItem, horizontal = true }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Ver tudo</Text>
          <Ionicons name="chevron-forward" size={16} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );

  const WelcomeHeader = () => (
    <LinearGradient
      colors={['#FF6B6B', '#4ECDC4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.welcomeContainer}
    >
      <View style={styles.welcomeContent}>
        <View>
          <Text style={styles.welcomeText}>
            Olá, {userProfile?.name || 'Usuário'}! 👋
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Descubra novos serviços de streaming
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileAvatar}>
            {userProfile?.avatar || '👤'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const QuickStats = () => (
    <View style={styles.statsContainer}>
      <LinearGradient
        colors={['#1E1E1E', '#2A2A2A']}
        style={styles.statCard}
      >
        <Ionicons name="tv" size={24} color="#FF6B6B" />
        <Text style={styles.statNumber}>{userServices.length}</Text>
        <Text style={styles.statLabel}>Serviços</Text>
      </LinearGradient>
      
      <LinearGradient
        colors={['#1E1E1E', '#2A2A2A']}
        style={styles.statCard}
      >
        <Ionicons name="bookmark" size={24} color="#4ECDC4" />
        <Text style={styles.statNumber}>
          {popularContent.filter(c => userServices.some(s => c.availableOn.includes(s.id))).length}
        </Text>
        <Text style={styles.statLabel}>Disponível</Text>
      </LinearGradient>
      
      <LinearGradient
        colors={['#1E1E1E', '#2A2A2A']}
        style={styles.statCard}
      >
        <Ionicons name="trending-up" size={24} color="#FFD700" />
        <Text style={styles.statNumber}>{popularContent.length}</Text>
        <Text style={styles.statLabel}>Popular</Text>
      </LinearGradient>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={60} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF6B6B']}
            tintColor="#FF6B6B"
          />
        }
      >
        <WelcomeHeader />
        <QuickStats />

        {userServices.length > 0 && (
          <CategoryFilter
            title="Seus Serviços"
            data={userServices}
            renderItem={renderServiceCard}
          />
        )}

        <CategoryFilter
          title="Em Alta"
          data={popularContent.slice(0, 10)}
          renderItem={renderContentCard}
        />

        <CategoryFilter
          title="Serviços Recomendados"
          data={allServices.filter(s => !userServices.some(us => us.id === s.id)).slice(0, 8)}
          renderItem={renderServiceCard}
        />

        <CategoryFilter
          title="Filmes Populares"
          data={popularContent.filter(c => c.type === 'movie')}
          renderItem={renderContentCard}
        />

        <CategoryFilter
          title="Séries em Destaque"
          data={popularContent.filter(c => c.type === 'series')}
          renderItem={renderContentCard}
        />

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
    marginTop: 16,
  },
  welcomeContainer: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatar: {
    fontSize: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E8E',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default HomeScreen;