import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import UserService from '../services/userService';

const { width } = Dimensions.get('window');

const ServiceCard = ({ service, onPress, onToggleFavorite }) => {
  const [isInProfile, setIsInProfile] = useState(false);

  useEffect(() => {
    checkIfInProfile();
  }, [service.id]);

  const checkIfInProfile = async () => {
    const inProfile = await UserService.isServiceInProfile(service.id);
    setIsInProfile(inProfile);
  };

  const handleToggleFavorite = async () => {
    if (isInProfile) {
      const success = await UserService.removeServiceFromProfile(service.id);
      if (success) {
        setIsInProfile(false);
        onToggleFavorite && onToggleFavorite(service, false);
      }
    } else {
      const success = await UserService.addServiceToProfile(service);
      if (success) {
        setIsInProfile(true);
        onToggleFavorite && onToggleFavorite(service, true);
      }
    }
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

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(service)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[service.color + '20', service.color + '10']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{service.icon}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              isInProfile && styles.favoriteButtonActive
            ]}
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={isInProfile ? 'heart' : 'heart-outline'}
              size={20}
              color={isInProfile ? '#FF6B6B' : '#8E8E8E'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {service.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {service.description}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {(service.content.movies / 1000).toFixed(0)}k
              </Text>
              <Text style={styles.statLabel}>Filmes</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {(service.content.series / 100).toFixed(0)}00
              </Text>
              <Text style={styles.statLabel}>Séries</Text>
            </View>
          </View>

          <View style={styles.metaContainer}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(service.category) }]}>
              <Text style={styles.categoryText}>{service.category}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.rating}>{service.rating}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.43,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  gradient: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#404040',
  },
  icon: {
    fontSize: 24,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#404040',
  },
  favoriteButtonActive: {
    backgroundColor: '#FF6B6B20',
    borderColor: '#FF6B6B',
  },
  content: {
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#B0B0B0',
    lineHeight: 16,
  },
  footer: {
    gap: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 10,
    color: '#8E8E8E',
    marginTop: 2,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ServiceCard;