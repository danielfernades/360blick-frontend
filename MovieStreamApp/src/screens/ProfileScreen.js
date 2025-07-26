import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import UserService from '../services/userService';
import ServiceCard from '../components/ServiceCard';
import ContentCard from '../components/ContentCard';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState(null);
  const [userServices, setUserServices] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('services'); // services, watchlist, stats

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [profile, services, watchlistData, userStats] = await Promise.all([
        UserService.getUserProfile(),
        UserService.getUserServices(),
        UserService.getWatchlist(),
        UserService.getUserStats()
      ]);

      setUserProfile(profile);
      setUserServices(services);
      setWatchlist(watchlistData);
      setStats(userStats);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUserData();
  };

  const handleClearData = () => {
    Alert.alert(
      'Limpar Dados',
      'Tem certeza que deseja remover todos os seus dados? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            const success = await UserService.clearUserData();
            if (success) {
              Alert.alert('Sucesso', 'Dados limpos com sucesso!');
              loadUserData();
            }
          },
        },
      ]
    );
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
      onToggleFavorite={loadUserData}
    />
  );

  const renderContentCard = ({ item }) => (
    <ContentCard
      content={item}
      onPress={handleContentPress}
      onToggleWatchlist={loadUserData}
      size="small"
    />
  );

  const ProfileHeader = () => (
    <LinearGradient
      colors={['#FF6B6B', '#4ECDC4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerContainer}
    >
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{userProfile?.avatar || '👤'}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{userProfile?.name || 'Usuário'}</Text>
          <Text style={styles.joinDate}>
            Membro desde {new Date(userProfile?.joinDate || Date.now()).toLocaleDateString('pt-BR')}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.editButton}>
        <Ionicons name="create-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </LinearGradient>
  );

  const StatsOverview = () => (
    <View style={styles.statsOverviewContainer}>
      <LinearGradient
        colors={['#1E1E1E', '#2A2A2A']}
        style={styles.statItem}
      >
        <Ionicons name="tv" size={24} color="#FF6B6B" />
        <Text style={styles.statNumber}>{stats?.totalServices || 0}</Text>
        <Text style={styles.statLabel}>Serviços</Text>
      </LinearGradient>
      
      <LinearGradient
        colors={['#1E1E1E', '#2A2A2A']}
        style={styles.statItem}
      >
        <Ionicons name="bookmark" size={24} color="#4ECDC4" />
        <Text style={styles.statNumber}>{stats?.totalWatchlistItems || 0}</Text>
        <Text style={styles.statLabel}>Watchlist</Text>
      </LinearGradient>
      
      <LinearGradient
        colors={['#1E1E1E', '#2A2A2A']}
        style={styles.statItem}
      >
        <Ionicons name="film" size={24} color="#FFD700" />
        <Text style={styles.statNumber}>{stats?.totalMovies || 0}</Text>
        <Text style={styles.statLabel}>Filmes</Text>
      </LinearGradient>
      
      <LinearGradient
        colors={['#1E1E1E', '#2A2A2A']}
        style={styles.statItem}
      >
        <Ionicons name="tv-outline" size={24} color="#9C27B0" />
        <Text style={styles.statNumber}>{stats?.totalSeries || 0}</Text>
        <Text style={styles.statLabel}>Séries</Text>
      </LinearGradient>
    </View>
  );

  const TabButton = ({ id, title, icon, isActive, onPress }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        isActive && styles.tabButtonActive
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={20}
        color={isActive ? '#FFFFFF' : '#8E8E8E'}
      />
      <Text
        style={[
          styles.tabText,
          isActive && styles.tabTextActive
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const TabNavigation = () => (
    <View style={styles.tabContainer}>
      <TabButton
        id="services"
        title="Serviços"
        icon="tv"
        isActive={activeTab === 'services'}
        onPress={() => setActiveTab('services')}
      />
      <TabButton
        id="watchlist"
        title="Watchlist"
        icon="bookmark"
        isActive={activeTab === 'watchlist'}
        onPress={() => setActiveTab('watchlist')}
      />
      <TabButton
        id="stats"
        title="Estatísticas"
        icon="analytics"
        isActive={activeTab === 'stats'}
        onPress={() => setActiveTab('stats')}
      />
    </View>
  );

  const ServicesTab = () => (
    <View style={styles.tabContent}>
      {userServices.length > 0 ? (
        <FlatList
          data={userServices}
          renderItem={renderServiceCard}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.servicesGrid}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="tv-outline" size={64} color="#404040" />
          <Text style={styles.emptyTitle}>Nenhum serviço adicionado</Text>
          <Text style={styles.emptySubtitle}>
            Explore novos serviços de streaming na aba Home
          </Text>
        </View>
      )}
    </View>
  );

  const WatchlistTab = () => (
    <View style={styles.tabContent}>
      {watchlist.length > 0 ? (
        <FlatList
          data={watchlist}
          renderItem={renderContentCard}
          numColumns={3}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.watchlistGrid}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color="#404040" />
          <Text style={styles.emptyTitle}>Sua watchlist está vazia</Text>
          <Text style={styles.emptySubtitle}>
            Adicione filmes e séries que deseja assistir
          </Text>
        </View>
      )}
    </View>
  );

  const StatsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.detailedStatsContainer}>
        <View style={styles.statSection}>
          <Text style={styles.statSectionTitle}>Serviços por Categoria</Text>
          {stats?.servicesByCategory && Object.keys(stats.servicesByCategory).length > 0 ? (
            Object.entries(stats.servicesByCategory).map(([category, count]) => (
              <View key={category} style={styles.categoryStatRow}>
                <Text style={styles.categoryStatLabel}>{category}</Text>
                <Text style={styles.categoryStatValue}>{count}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>Nenhum dado disponível</Text>
          )}
        </View>
        
        <View style={styles.statSection}>
          <Text style={styles.statSectionTitle}>Distribuição de Conteúdo</Text>
          <View style={styles.contentDistribution}>
            <View style={styles.distributionItem}>
              <View style={[styles.distributionBar, { width: `${(stats?.totalMovies || 0) / Math.max((stats?.totalWatchlistItems || 1), 1) * 100}%`, backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.distributionLabel}>
                Filmes: {stats?.totalMovies || 0}
              </Text>
            </View>
            <View style={styles.distributionItem}>
              <View style={[styles.distributionBar, { width: `${(stats?.totalSeries || 0) / Math.max((stats?.totalWatchlistItems || 1), 1) * 100}%`, backgroundColor: '#4ECDC4' }]} />
              <Text style={styles.distributionLabel}>
                Séries: {stats?.totalSeries || 0}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearData}
        >
          <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          <Text style={styles.clearButtonText}>Limpar Todos os Dados</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'services':
        return <ServicesTab />;
      case 'watchlist':
        return <WatchlistTab />;
      case 'stats':
        return <StatsTab />;
      default:
        return <ServicesTab />;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando perfil...</Text>
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
        <ProfileHeader />
        <StatsOverview />
        <TabNavigation />
        {renderTabContent()}
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
    margin: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    fontSize: 30,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsOverviewContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#8E8E8E',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  tabText: {
    fontSize: 12,
    color: '#8E8E8E',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  servicesGrid: {
    gap: 8,
  },
  watchlistGrid: {
    gap: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
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
  detailedStatsContainer: {
    gap: 24,
  },
  statSection: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  statSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  categoryStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryStatLabel: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  categoryStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  noDataText: {
    fontSize: 14,
    color: '#8E8E8E',
    textAlign: 'center',
    paddingVertical: 20,
  },
  contentDistribution: {
    gap: 12,
  },
  distributionItem: {
    gap: 8,
  },
  distributionBar: {
    height: 8,
    borderRadius: 4,
  },
  distributionLabel: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    gap: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  bottomSpacing: {
    height: 100,
  },
});

export default ProfileScreen;