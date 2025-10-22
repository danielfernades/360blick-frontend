import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import UserService from '../services/userService';

const { width } = Dimensions.get('window');

const ContentCard = ({ content, onPress, onToggleWatchlist, size = 'medium' }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    checkIfInWatchlist();
  }, [content.id]);

  const checkIfInWatchlist = async () => {
    const inWatchlist = await UserService.isInWatchlist(content.id);
    setIsInWatchlist(inWatchlist);
  };

  const handleToggleWatchlist = async () => {
    if (isInWatchlist) {
      const success = await UserService.removeFromWatchlist(content.id);
      if (success) {
        setIsInWatchlist(false);
        onToggleWatchlist && onToggleWatchlist(content, false);
      }
    } else {
      const success = await UserService.addToWatchlist(content);
      if (success) {
        setIsInWatchlist(true);
        onToggleWatchlist && onToggleWatchlist(content, true);
      }
    }
  };

  const getCardWidth = () => {
    switch (size) {
      case 'small':
        return width * 0.28;
      case 'large':
        return width * 0.6;
      default:
        return width * 0.4;
    }
  };

  const getTypeIcon = () => {
    return content.type === 'movie' ? 'film' : 'tv';
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

  return (
    <TouchableOpacity
      style={[styles.container, { width: getCardWidth() }]}
      onPress={() => onPress && onPress(content)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: content.poster }}
          style={styles.poster}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        />
        
        <View style={styles.topActions}>
          <View style={[styles.typeBadge, { backgroundColor: getGenreColor(content.genre[0]) }]}>
            <Ionicons name={getTypeIcon()} size={12} color="#FFFFFF" />
            <Text style={styles.typeText}>
              {content.type === 'movie' ? 'Filme' : 'Série'}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.watchlistButton,
              isInWatchlist && styles.watchlistButtonActive
            ]}
            onPress={handleToggleWatchlist}
          >
            <Ionicons
              name={isInWatchlist ? 'bookmark' : 'bookmark-outline'}
              size={16}
              color={isInWatchlist ? '#FF6B6B' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {content.title}
          </Text>
          <View style={styles.metaInfo}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.rating}>{content.rating}</Text>
            </View>
            <Text style={styles.year}>{content.year}</Text>
          </View>
        </View>
      </View>

      {size !== 'small' && (
        <View style={styles.genreContainer}>
          {content.genre.slice(0, 2).map((genre, index) => (
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
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 6,
    marginVertical: 8,
  },
  imageContainer: {
    aspectRatio: 2/3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  topActions: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  typeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  watchlistButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
  bottomInfo: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rating: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  year: {
    fontSize: 11,
    color: '#B0B0B0',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 4,
  },
  genreBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  genreText: {
    fontSize: 9,
    fontWeight: '500',
  },
});

export default ContentCard;