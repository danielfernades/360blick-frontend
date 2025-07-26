import { Image } from 'expo-image';
import { Platform, StyleSheet, Pressable, FlatList, View } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

const SITES = [
  { id: 'netflix', name: 'Netflix', logo: require('@/assets/images/netflix-logo.png') },
  { id: 'prime', name: 'Prime Video', logo: require('@/assets/images/prime-logo.png') },
  { id: 'disney', name: 'Disney+', logo: require('@/assets/images/disney-logo.png') },
];

export default function ExploreScreen() {
  const [mySites, setMySites] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('mySites').then(data => {
      if (data) setMySites(JSON.parse(data));
    });
  }, []);

  const handleToggleSite = async (site) => {
    let updatedSites;
    if (mySites.find(s => s.id === site.id)) {
      updatedSites = mySites.filter(s => s.id !== site.id);
    } else {
      updatedSites = [...mySites, site];
    }
    setMySites(updatedSites);
    await AsyncStorage.setItem('mySites', JSON.stringify(updatedSites));
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fff', dark: '#151718' }}
      headerImage={null}
    >
      <ThemedView style={{ marginBottom: 16 }}>
        <ThemedText type="title">Explorar</ThemedText>
        <ThemedText>Adicione sites de filmes e séries ao seu perfil para ver os conteúdos disponíveis.</ThemedText>
      </ThemedView>
      <FlatList
        data={SITES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isAdded = mySites.find(s => s.id === item.id);
          return (
            <Pressable onPress={() => handleToggleSite(item)} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, padding: 12, opacity: isAdded ? 0.5 : 1 }}>
                <Image source={item.logo} style={{ width: 48, height: 48, borderRadius: 8, marginRight: 16 }} />
                <ThemedText type="subtitle">{item.name}</ThemedText>
                <ThemedText style={{ marginLeft: 'auto', color: isAdded ? '#0a7ea4' : '#687076' }}>{isAdded ? 'Adicionado' : 'Adicionar'}</ThemedText>
              </View>
            </Pressable>
          );
        }}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
