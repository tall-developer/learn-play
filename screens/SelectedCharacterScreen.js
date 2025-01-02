import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Circle, Path, Ellipse, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  Easing 
} from 'react-native-reanimated';

export default function SelectedCharacterScreen({ route, navigation }) {
  const { character } = route.params;
  const { currentTheme, isDarkMode } = useTheme();
  const bounceValue = useSharedValue(0);

  useEffect(() => {
    // Start bounce animation
    bounceValue.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.quad) })
      ),
      -1, // Infinite repeat
      true // Reverse each sequence
    );

    // Navigate to game after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('MathBallCatcherGame', { character });
    }, 2000);

    return () => {
      clearTimeout(timer);
      bounceValue.value = 0;
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: bounceValue.value }],
    };
  });

  return (
    <LinearGradient
      colors={currentTheme.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={[styles.title, { color: currentTheme.title }]}>
        Get Ready!
      </Text>

      <View style={[styles.characterCard, { backgroundColor: currentTheme.card }]}>
        <Animated.View style={[styles.characterImage, animatedStyle]}>
          {character.svg}
        </Animated.View>
        <Text style={[styles.characterName, { color: currentTheme.cardTitle }]}>
          {character.name}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  characterCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  characterImage: {
    marginBottom: 16,
    transform: [{ scale: 1.2 }], // Make character slightly larger
  },
  characterName: {
    fontSize: 24,
    fontWeight: '600',
  },
}); 