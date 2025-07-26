import { Image } from 'expo-image';
import { Platform, StyleSheet, Pressable, FlatList, View } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const SITES = [
  { id: 'netflix', name: 'Netflix', logo: require('@/assets/images/netflix-logo.png') },
  { id: 'prime', name: 'Prime Video', logo: require('@/assets/images/prime-logo.png') },
  { id: 'disney', name: 'Disney+', logo: require('@/assets/images/disney-logo.png') },
];

export default function MySitesScreen() {
  const [mySites, setMySites] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('mySites').then(data => {
      if (data) setMySites(JSON.parse(data));
    });
  }, []);

  const handleSitePress = (site) => {
    // Aqui você pode navegar para a tela de detalhes do site
    // Exemplo: router.push(`/site/${site.id}`)
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fff', dark: '#151718' }}
      headerImage={null}
    >
      <ThemedView style={{ marginBottom: 16 }}>
        <ThemedText type="title">Meus Sites</ThemedText>
        <ThemedText>Veja todos os sites de filmes e séries que você segue.</ThemedText>
      </ThemedView>
      <FlatList
        data={mySites}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleSitePress(item)} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, padding: 12 }}>
              <Image source={item.logo} style={{ width: 48, height: 48, borderRadius: 8, marginRight: 16 }} />
              <ThemedText type="subtitle">{item.name}</ThemedText>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<ThemedText>Você ainda não segue nenhum site. Vá em "Explorar" para adicionar!</ThemedText>}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
