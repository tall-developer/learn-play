import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MathIcon from '../components/MathIcon';
import WordIcon from '../components/WordIcon';
import ScienceIcon from '../components/ScienceIcon';
import ToggleIcon from '../components/ToggleIcon';
import { useTheme } from '../contexts/ThemeContext';

export default function MenuScreen({ navigation }) {
  const { isDarkMode, toggleTheme, currentTheme } = useTheme();

  const renderCard = (icon, title, description, onPress) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { 
          backgroundColor: currentTheme.card,
          borderColor: currentTheme.cardBorder,
          transform: [{ scale: pressed ? 0.98 : 1 }],  // Subtle scale effect
          opacity: pressed ? 0.9 : 1,  // Subtle opacity change
        }
      ]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(128, 128, 128, 0.1)' }}  // Android ripple effect
    >
      <View style={styles.cardContent}>
        {icon}
        <Text style={[styles.cardTitle, { color: currentTheme.cardTitle }]}>
          {title}
        </Text>
        <Text style={[styles.cardDescription, { color: currentTheme.cardDescription }]}>
          {description}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={currentTheme.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        opacity={0.8}
      />
      <View style={styles.overlay}>
        <View style={[styles.menuHeader, { borderBottomColor: currentTheme.headerBorder }]}>
          <Text style={[styles.title, { color: currentTheme.title }]}>LearnPlay</Text>
          <Pressable 
            style={({ pressed }) => [
              styles.toggleButton,
              { opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={toggleTheme}
          >
            <ToggleIcon isDarkMode={isDarkMode} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          {renderCard(
            <MathIcon />,
            'Math Ball Catcher',
            'Catch the falling numbers and solve equations to win!',
            () => navigation.navigate('CharacterSelection')
          )}

          {renderCard(
            <WordIcon />,
            'Word Wizard',
            'Cast spells by forming words and defeat the vocabulary villains!',
            () => alert('Word Wizard coming soon!')
          )}

          {renderCard(
            <ScienceIcon />,
            'Science Quest',
            'Explore the world of science through exciting experiments and challenges!',
            () => alert('Science Quest coming soon!')
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    width: '100%',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        transform: [{ scale: 1 }],  // Enable hardware acceleration
      },
      android: {
        overflow: 'hidden',  // Required for ripple effect
      },
    }),
  },
  cardContent: {
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 20,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
    maxWidth: '90%',
    fontWeight: '400',
  },
});