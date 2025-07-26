import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import axios from 'axios';

const PROVIDER_IDS = {
  netflix: 8,
  prime: 119,
  disney: 337,
};

export default function SiteDetailScreen() {
  const { id, name } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        // Usando a API do TMDB para buscar filmes por provedor
        const providerId = PROVIDER_IDS[id as string];
        const res = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
          params: {
            api_key: 'demo', // Troque por sua chave TMDB
            with_watch_providers: providerId,
            watch_region: 'BR',
            sort_by: 'popularity.desc',
          },
        });
        setMovies(res.data.results);
      } catch (e) {
        setMovies([]);
      }
      setLoading(false);
    }
    fetchMovies();
  }, [id]);

  return (
    <ParallaxScrollView headerBackgroundColor={{ light: '#fff', dark: '#151718' }} headerImage={null}>
      <ThemedView style={{ marginBottom: 16 }}>
        <ThemedText type="title">{name}</ThemedText>
        <ThemedText>Filmes populares disponíveis neste site:</ThemedText>
      </ThemedView>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#f5f5f5', borderRadius: 12, padding: 12 }}>
              <Image source={{ uri: `https://image.tmdb.org/t/p/w92${item.poster_path}` }} style={{ width: 48, height: 72, borderRadius: 8, marginRight: 16 }} />
              <View style={{ flex: 1 }}>
                <ThemedText type="subtitle">{item.title}</ThemedText>
                <ThemedText numberOfLines={2}>{item.overview}</ThemedText>
              </View>
            </View>
          )}
          ListEmptyComponent={<ThemedText>Nenhum filme encontrado para este site.</ThemedText>}
        />
      )}
    </ParallaxScrollView>
  );
}