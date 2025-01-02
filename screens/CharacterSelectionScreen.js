import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Alert, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  useAnimatedScrollHandler,
  interpolate,
  useAnimatedProps,
  withTiming
} from 'react-native-reanimated';
import Svg, { Rect, Circle, Path, Ellipse, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { getCustomHeroes, deleteCustomHero } from '../utils/heroStorage';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // Two cards per row with padding

const characters = [
  {
    id: 1,
    name: 'Bobby Bounce',
    svg: (
      <Svg viewBox="0 0 60 80" width={100} height={133}>
        <Rect x={10} y={10} width={40} height={45} rx={5} fill="#FF6B6B" />
        <Circle cx={25} cy={25} r={5} fill="white" />
        <Circle cx={35} cy={25} r={5} fill="white" />
        <Path d="M 20 40 Q 30 50 40 40" stroke="white" fill="none" strokeWidth={3} />
        <Rect x={15} y={55} width={10} height={20} rx={3} fill="#FF6B6B" />
        <Rect x={35} y={55} width={10} height={20} rx={3} fill="#FF6B6B" />
      </Svg>
    ),
  },
  {
    id: 2,
    name: 'Robo Catcher',
    svg: (
      <Svg viewBox="0 0 60 80" width={100} height={133}>
        <Rect x={10} y={10} width={40} height={45} rx={2} fill="#4A90E2" />
        <Rect x={20} y={20} width={8} height={8} fill="red" />
        <Rect x={32} y={20} width={8} height={8} fill="red" />
        <Rect x={20} y={40} width={20} height={3} fill="white" />
        <Rect x={5} y={30} width={5} height={20} fill="#4A90E2" />
        <Rect x={50} y={30} width={5} height={20} fill="#4A90E2" />
        <Rect x={15} y={55} width={10} height={20} rx={2} fill="#4A90E2" />
        <Rect x={35} y={55} width={10} height={20} rx={2} fill="#4A90E2" />
      </Svg>
    ),
  },
  {
    id: 3,
    name: 'Cosmic Collector',
    svg: (
      <Svg viewBox="0 0 60 80" width={100} height={133}>
        <Ellipse cx={30} cy={35} rx={25} ry={25} fill="#50C878" />
        <Circle cx={20} cy={30} r={8} fill="black" />
        <Circle cx={40} cy={30} r={8} fill="black" />
        <Path d="M 15 45 Q 30 55 45 45" stroke="black" fill="none" strokeWidth={3} />
        <Path d="M 30 10 L 25 0 M 30 10 L 35 0" stroke="#50C878" strokeWidth={3} />
        <Rect x={15} y={55} width={10} height={20} rx={5} fill="#50C878" />
        <Rect x={35} y={55} width={10} height={20} rx={5} fill="#50C878" />
      </Svg>
    ),
  },
];

const CharacterCard = ({ character, isSelected, onPress, theme, isCustom, onDelete }) => {
  const scale = useSharedValue(1);
  const isCreateCard = character.id === 4;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(1.05);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleLongPress = () => {
    if (isCustom) {
      Alert.alert(
        'Delete Hero',
        `Are you sure you want to delete ${character.name}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => onDelete(character.id),
            style: 'destructive',
          },
        ]
      );
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      delayLongPress={500}
      style={{ width: CARD_WIDTH }}
    >
      <Animated.View
        style={[
          styles.characterCard,
          animatedStyle,
          isSelected && styles.selectedCard,
          { backgroundColor: theme.card },
          isCustom && styles.customCard,
        ]}
      >
        <View style={styles.characterImage}>
          {character.svg}
        </View>
        <Text 
          style={[
            styles.characterName, 
            { color: theme.cardTitle },
            isCustom && styles.customText
          ]}
        >
          {character.name}
        </Text>
        {isCustom && (
          <Text style={[styles.customBadge, { color: theme.cardDescription }]}>
            Custom • Long press to delete
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

export default function CharacterSelectionScreen({ navigation }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [allCharacters, setAllCharacters] = useState(characters);
  const { currentTheme } = useTheme();
  
  const scrollY = useSharedValue(0);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const fabStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollY.value,
      [0, 50],
      [140, 56], // Start with full width (icon + text + padding) and end with just icon width
      'clamp'
    );

    return {
      width,
    };
  });

  const fabTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 40], // Slightly faster text fade
      [1, 0],
      'clamp'
    );

    const maxWidth = interpolate(
      scrollY.value,
      [0, 40],
      [80, 0], // Max width for text
      'clamp'
    );

    return {
      opacity,
      maxWidth,
      marginLeft: 8,
    };
  });

  useEffect(() => {
    loadCustomHeroes();
  }, []);

  const loadCustomHeroes = async () => {
    const customHeroes = await getCustomHeroes();
    const customCharacters = customHeroes.map((hero, index) => ({
      id: `custom-${index}`,
      name: hero.name,
      svg: (
        <Svg viewBox="0 0 60 80" width={100} height={133}>
          {hero.bodyType.id === 1 && (
            <>
              <Rect x={10} y={10} width={40} height={45} rx={5} fill={hero.color} />
              <Circle cx={25} cy={30} r={3} fill="white" />
              <Circle cx={35} cy={30} r={3} fill="white" />
              <Rect x={15} y={55} width={10} height={20} rx={3} fill={hero.color} />
              <Rect x={35} y={55} width={10} height={20} rx={3} fill={hero.color} />
            </>
          )}
          {hero.bodyType.id === 2 && (
            <>
              <Ellipse cx={30} cy={35} rx={25} ry={25} fill={hero.color} />
              <Circle cx={20} cy={35} r={4} fill="white" />
              <Circle cx={40} cy={35} r={4} fill="white" />
              <Rect x={15} y={55} width={10} height={20} rx={5} fill={hero.color} />
              <Rect x={35} y={55} width={10} height={20} rx={5} fill={hero.color} />
            </>
          )}
          {hero.bodyType.id === 3 && (
            <>
              <Rect x={10} y={10} width={40} height={45} rx={2} fill={hero.color} />
              <Rect x={20} y={25} width={6} height={8} rx={1} fill="white" />
              <Rect x={34} y={25} width={6} height={8} rx={1} fill="white" />
              <Rect x={15} y={55} width={10} height={20} rx={2} fill={hero.color} />
              <Rect x={35} y={55} width={10} height={20} rx={2} fill={hero.color} />
            </>
          )}
          {hero.accessories.map((accessory, accIndex) => (
            <G key={`acc-${accIndex}`}>
              {accessory.id === 1 && (
                <Path 
                  d="M 15 12 C 15 8 45 8 45 12 L 42 10 L 30 3 L 18 10 L 15 12"
                  fill="#FFFFFF"
                  stroke="#FFFFFF"
                  strokeWidth={3}
                />
              )}
              {accessory.id === 2 && (
                <>
                  <Circle cx={22} cy={30} r={8} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
                  <Circle cx={38} cy={30} r={8} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
                  <Path d="M 28 30 L 32 30" stroke="#FFFFFF" strokeWidth={2.5} />
                  <Path d="M 14 30 L 10 28" stroke="#FFFFFF" strokeWidth={2.5} />
                  <Path d="M 46 30 L 50 28" stroke="#FFFFFF" strokeWidth={2.5} />
                </>
              )}
              {accessory.id === 3 && (
                <G>
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
              )}
            </G>
          ))}
        </Svg>
      ),
      isCustom: true,
      ...hero
    }));
    setAllCharacters([...characters, ...customCharacters]);
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character.id);
    setTimeout(() => {
      navigation.navigate('SelectedCharacter', { character });
    }, 200);
  };

  const handleDeleteHero = async (heroId) => {
    try {
      const updatedHeroes = await deleteCustomHero(heroId);
      if (updatedHeroes !== null) {
        const updatedCustomCharacters = updatedHeroes.map((hero, index) => ({
          id: `custom-${index}`,
          name: hero.name,
          svg: (
            <Svg viewBox="0 0 60 80" width={100} height={133}>
              {hero.bodyType.id === 1 && (
                <>
                  <Rect x={10} y={10} width={40} height={45} rx={5} fill={hero.color} />
                  <Circle cx={25} cy={30} r={3} fill="white" />
                  <Circle cx={35} cy={30} r={3} fill="white" />
                  <Rect x={15} y={55} width={10} height={20} rx={3} fill={hero.color} />
                  <Rect x={35} y={55} width={10} height={20} rx={3} fill={hero.color} />
                </>
              )}
              {hero.bodyType.id === 2 && (
                <>
                  <Ellipse cx={30} cy={35} rx={25} ry={25} fill={hero.color} />
                  <Circle cx={20} cy={35} r={4} fill="white" />
                  <Circle cx={40} cy={35} r={4} fill="white" />
                  <Rect x={15} y={55} width={10} height={20} rx={5} fill={hero.color} />
                  <Rect x={35} y={55} width={10} height={20} rx={5} fill={hero.color} />
                </>
              )}
              {hero.bodyType.id === 3 && (
                <>
                  <Rect x={10} y={10} width={40} height={45} rx={2} fill={hero.color} />
                  <Rect x={20} y={25} width={6} height={8} rx={1} fill="white" />
                  <Rect x={34} y={25} width={6} height={8} rx={1} fill="white" />
                  <Rect x={15} y={55} width={10} height={20} rx={2} fill={hero.color} />
                  <Rect x={35} y={55} width={10} height={20} rx={2} fill={hero.color} />
                </>
              )}
              {hero.accessories.map((accessory, accIndex) => (
                <G key={`acc-${accIndex}`}>
                  {accessory.id === 1 && (
                    <Path 
                      d="M 15 12 C 15 8 45 8 45 12 L 42 10 L 30 3 L 18 10 L 15 12"
                      fill="#FFFFFF"
                      stroke="#FFFFFF"
                      strokeWidth={3}
                    />
                  )}
                  {accessory.id === 2 && (
                    <>
                      <Circle cx={22} cy={30} r={8} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
                      <Circle cx={38} cy={30} r={8} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
                      <Path d="M 28 30 L 32 30" stroke="#FFFFFF" strokeWidth={2.5} />
                      <Path d="M 14 30 L 10 28" stroke="#FFFFFF" strokeWidth={2.5} />
                      <Path d="M 46 30 L 50 28" stroke="#FFFFFF" strokeWidth={2.5} />
                    </>
                  )}
                  {accessory.id === 3 && (
                    <G>
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
                  )}
                </G>
              ))}
            </Svg>
          ),
          isCustom: true,
          ...hero
        }));
        setAllCharacters([...characters, ...updatedCustomCharacters]);
      }
    } catch (error) {
      console.error('Error deleting hero:', error);
      Alert.alert('Error', 'Failed to delete hero. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={currentTheme.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Text style={[styles.title, { color: currentTheme.title }]}>
          Select your Hero
        </Text>
      <View style={styles.charactersContainer}>
          {allCharacters.map((character) => (
            <CharacterCard
            key={character.id}
              character={character}
              isSelected={selectedCharacter === character.id}
            onPress={() => handleCharacterSelect(character)}
              theme={currentTheme}
              isCustom={character.isCustom}
              onDelete={handleDeleteHero}
            />
          ))}
        </View>
      </Animated.ScrollView>

      <View style={styles.fabContainer}>
        <Animated.View style={[styles.fab, fabStyle, { backgroundColor: '#6200ee' }]}>
          <TouchableOpacity
            style={styles.fabContent}
            onPress={() => navigation.navigate('CreateYourHero')}
          >
            <View style={styles.fabIconContainer}>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 4V20M4 12H20"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
            <Animated.Text 
              style={[styles.fabLabel, fabTextStyle]}
            >
              Create Hero
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  charactersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  characterCard: {
    width: CARD_WIDTH,
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#6200ee', // Highlight selected card
  },
  characterImage: {
    width: 100,
    height: 133,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterName: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  createCard: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  createCardText: {
    opacity: 0.8,
  },
  customCard: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'rgba(98, 0, 238, 0.3)',
  },
  customBadge: {
    fontSize: 11,
    opacity: 0.7,
    marginTop: 4,
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
  },
  fab: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6200ee',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    overflow: 'hidden',
  },
  fabContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  fabIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});