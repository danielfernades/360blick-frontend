import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import StreamingService from '../services/streamingService';
import ServiceCard from '../components/ServiceCard';
import ContentCard from '../components/ContentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useDebounce } from '../hooks/useDebounce';

const { width } = Dimensions.get('window');

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // all, services, content
  const [contentResults, setContentResults] = useState([]);
  const [serviceResults, setServiceResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [allContent, setAllContent] = useState([]);
  
  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const filters = [
    { id: 'all', name: 'Tudo', icon: 'grid' },
    { id: 'services', name: 'Serviços', icon: 'tv' },
    { id: 'content', name: 'Conteúdo', icon: 'film' },
  ];

  const categories = [
    { id: 'Premium', name: 'Premium', color: '#FFD700' },
    { id: 'Free', name: 'Gratuito', color: '#4CAF50' },
    { id: 'Freemium', name: 'Freemium', color: '#FF9800' },
  ];

  const genres = [
    'Ação', 'Aventura', 'Comédia', 'Drama', 'Ficção Científica',
    'Horror', 'Fantasia', 'Romance', 'Thriller', 'Animação'
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery.length > 0) {
      performSearch();
    } else {
      setContentResults([]);
      setServiceResults([]);
    }
  }, [debouncedSearchQuery, activeFilter]);

  const loadInitialData = async () => {
    try {
      const [services, content] = await Promise.all([
        StreamingService.getAvailableServices(),
        StreamingService.getPopularContent()
      ]);
      setAllServices(services);
      setAllContent(content);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const performSearch = async () => {
    if (debouncedSearchQuery.trim().length < 2) return;

    setLoading(true);
    try {
      if (activeFilter === 'all' || activeFilter === 'services') {
        const services = await StreamingService.searchServices(debouncedSearchQuery);
        setServiceResults(services);
      }
      
      if (activeFilter === 'all' || activeFilter === 'content') {
        const content = await StreamingService.searchContent(debouncedSearchQuery);
        setContentResults(content);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServicePress = (service) => {
    navigation.navigate('StreamingService', { service });
  };

  const handleContentPress = (content) => {
    navigation.navigate('MovieDetail', { content });
  };

  const handleCategoryPress = async (category) => {
    setLoading(true);
    try {
      const services = await StreamingService.getServicesByCategory(category);
      setServiceResults(services);
      setSearchQuery('');
      setActiveFilter('services');
    } catch (error) {
      console.error('Erro ao filtrar por categoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenrePress = (genre) => {
    const filtered = allContent.filter(content =>
      content.genre.includes(genre)
    );
    setContentResults(filtered);
    setSearchQuery('');
    setActiveFilter('content');
  };

  const renderServiceCard = ({ item }) => (
    <ServiceCard
      service={item}
      onPress={handleServicePress}
    />
  );

  const renderContentCard = ({ item }) => (
    <ContentCard
      content={item}
      onPress={handleContentPress}
      size="small"
    />
  );

  const FilterButton = ({ filter, isActive, onPress }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        isActive && styles.filterButtonActive
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={filter.icon}
        size={18}
        color={isActive ? '#FFFFFF' : '#8E8E8E'}
      />
      <Text
        style={[
          styles.filterText,
          isActive && styles.filterTextActive
        ]}
      >
        {filter.name}
      </Text>
    </TouchableOpacity>
  );

  const CategoryChip = ({ category, onPress }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        { borderColor: category.color }
      ]}
      onPress={onPress}
    >
      <Text style={[styles.categoryText, { color: category.color }]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const GenreChip = ({ genre, onPress }) => (
    <TouchableOpacity
      style={styles.genreChip}
      onPress={onPress}
    >
      <Text style={styles.genreText}>{genre}</Text>
    </TouchableOpacity>
  );

  const SearchHeader = () => (
    <View style={styles.searchContainer}>
      <LinearGradient
        colors={['#1E1E1E', '#2A2A2A']}
        style={styles.searchInputContainer}
      >
        <Ionicons name="search" size={20} color="#8E8E8E" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar serviços, filmes ou séries..."
          placeholderTextColor="#8E8E8E"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#8E8E8E" />
          </TouchableOpacity>
        )}
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <FilterButton
            key={filter.id}
            filter={filter}
            isActive={activeFilter === filter.id}
            onPress={() => setActiveFilter(filter.id)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const QuickFilters = () => (
    <View style={styles.quickFiltersContainer}>
      <Text style={styles.quickFiltersTitle}>Filtros Rápidos</Text>
      
      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>Categorias</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsContainer}
        >
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              category={category}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>Gêneros</Text>
        <View style={styles.genresGrid}>
          {genres.slice(0, 8).map((genre) => (
            <GenreChip
              key={genre}
              genre={genre}
              onPress={() => handleGenrePress(genre)}
            />
          ))}
        </View>
      </View>
    </View>
  );

  const SearchResults = () => {
    const hasResults = contentResults.length > 0 || serviceResults.length > 0;
    
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <LoadingSpinner size={40} />
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      );
    }

    if (searchQuery.length > 0 && !hasResults) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={64} color="#404040" />
          <Text style={styles.emptyTitle}>Nenhum resultado encontrado</Text>
          <Text style={styles.emptySubtitle}>
            Tente uma busca diferente ou explore as categorias
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.resultsContainer}>
        {serviceResults.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>
              Serviços ({serviceResults.length})
            </Text>
            <FlatList
              data={serviceResults}
              renderItem={renderServiceCard}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.resultsList}
            />
          </View>
        )}

        {contentResults.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>
              Conteúdo ({contentResults.length})
            </Text>
            <FlatList
              data={contentResults}
              renderItem={renderContentCard}
              numColumns={3}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.contentGrid}
            />
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchHeader />
      
      {searchQuery.length === 0 ? <QuickFilters /> : <SearchResults />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    marginHorizontal: -8,
  },
  filtersContent: {
    paddingHorizontal: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
  },
  filterButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  filterText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#8E8E8E',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  quickFiltersContainer: {
    flex: 1,
    padding: 16,
  },
  quickFiltersTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  chipsContainer: {
    marginHorizontal: -4,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
  },
  genreText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8E8E8E',
    fontSize: 16,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  resultsContainer: {
    flex: 1,
  },
  resultSection: {
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  resultsList: {
    paddingHorizontal: 10,
  },
  contentGrid: {
    paddingHorizontal: 16,
  },
});

export default SearchScreen;