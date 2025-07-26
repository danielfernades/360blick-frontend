import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoadingSpinner = ({ size = 40, color = '#FF6B6B' }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startSpinning = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startSpinning());
    };

    startSpinning();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <LinearGradient
          colors={[color, color + '50', 'transparent']}
          style={[styles.gradient, { width: size, height: size }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#FF6B6B',
  },
  gradient: {
    borderRadius: 100,
  },
});

export default LoadingSpinner;