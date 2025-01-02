import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Path, Circle, Ellipse, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { saveCustomHero } from '../utils/heroStorage';

export default function HeroPreview({ route, navigation }) {
  const { hero } = route.params;
  const { currentTheme, isDarkMode } = useTheme();

  useEffect(() => {
    const saveAndNavigate = async () => {
      try {
        await saveCustomHero(hero);
      } catch (error) {
        console.error('Error saving hero:', error);
      }
      // Wait 2 seconds then navigate to game
      const timer = setTimeout(() => {
        navigation.replace('MathBallCatcherGame', { character: hero });
      }, 2000);

      return () => clearTimeout(timer);
    };

    saveAndNavigate();
  }, []);

  // Function to render the hero with selected color and accessories
  const renderCustomHero = () => {
    const BodyType = () => {
      switch (hero.bodyType.id) {
        case 1: // Type A
          return (
            <>
              <Rect x={10} y={10} width={40} height={45} rx={5} fill={hero.color} />
              <Circle cx={25} cy={30} r={3} fill="white" />
              <Circle cx={35} cy={30} r={3} fill="white" />
              <Rect x={15} y={55} width={10} height={20} rx={3} fill={hero.color} />
              <Rect x={35} y={55} width={10} height={20} rx={3} fill={hero.color} />
            </>
          );
        case 2: // Type B
          return (
            <>
              <Ellipse cx={30} cy={35} rx={25} ry={25} fill={hero.color} />
              <Circle cx={20} cy={35} r={4} fill="white" />
              <Circle cx={40} cy={35} r={4} fill="white" />
              <Rect x={15} y={55} width={10} height={20} rx={5} fill={hero.color} />
              <Rect x={35} y={55} width={10} height={20} rx={5} fill={hero.color} />
            </>
          );
        case 3: // Type C
          return (
            <>
              <Rect x={10} y={10} width={40} height={45} rx={2} fill={hero.color} />
              <Rect x={20} y={25} width={6} height={8} rx={1} fill="white" />
              <Rect x={34} y={25} width={6} height={8} rx={1} fill="white" />
              <Rect x={15} y={55} width={10} height={20} rx={2} fill={hero.color} />
              <Rect x={35} y={55} width={10} height={20} rx={2} fill={hero.color} />
            </>
          );
        default:
          return null;
      }
    };

    return (
      <Svg width={200} height={266} viewBox="0 0 60 80">
        <BodyType />
        {hero.accessories.map((accessory, index) => {
          switch (accessory.id) {
            case 1: // Hat
              return (
                <Path 
                  key={index}
                  d="M 15 12 C 15 8 45 8 45 12 L 42 10 L 30 3 L 18 10 L 15 12"
                  fill="#FFFFFF"
                  stroke="#FFFFFF"
                  strokeWidth={3}
                />
              );
            case 2: // Glasses
              return (
                <G key={`glasses-${index}`}>
                  <Circle cx={22} cy={30} r={8} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
                  <Circle cx={38} cy={30} r={8} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
                  <Path d="M 28 30 L 32 30" stroke="#FFFFFF" strokeWidth={2.5} />
                  <Path d="M 14 30 L 10 28" stroke="#FFFFFF" strokeWidth={2.5} />
                  <Path d="M 46 30 L 50 28" stroke="#FFFFFF" strokeWidth={2.5} />
                </G>
              );
            case 3: // Shield
              return (
                <G key={`shield-${index}`}>
                  <Path 
                    d="M 30 15 L 45 20 L 42 45 L 30 55 L 18 45 L 15 20 Z" 
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={3}
                  />
                  <Path 
                    d="M 25 32 L 28 35 L 35 28" 
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </G>
              );
            default:
              return null;
          }
        })}
      </Svg>
    );
  };

  return (
    <LinearGradient
      colors={currentTheme.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={[
        styles.title, 
        { color: isDarkMode ? '#FFFFFF' : currentTheme.title }
      ]}>
        Get Ready!
      </Text>
      
      <View style={[styles.previewCard, { backgroundColor: currentTheme.card }]}>
        <View style={styles.heroImage}>
          {renderCustomHero()}
        </View>
        <Text style={[
          styles.heroName, 
          { color: isDarkMode ? '#FFFFFF' : currentTheme.cardTitle }
        ]}>
          {hero.name}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  previewCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 40,
  },
  heroImage: {
    marginBottom: 16,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    padding: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
  },
}); 