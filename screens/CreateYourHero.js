import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Path, Ellipse, Circle, G } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

const bodyTypes = [
  { 
    id: 1, 
    name: 'Type A', 
    svg: (
      <Svg width={50} height={50} viewBox="0 0 60 80">
        <Rect x={10} y={10} width={40} height={45} rx={5} fill="#FF6B6B" />
        <Circle cx={25} cy={30} r={3} fill="white" />
        <Circle cx={35} cy={30} r={3} fill="white" />
        <Rect x={15} y={55} width={10} height={20} rx={3} fill="#FF6B6B" />
        <Rect x={35} y={55} width={10} height={20} rx={3} fill="#FF6B6B" />
      </Svg>
    )
  },
  { 
    id: 2, 
    name: 'Type B', 
    svg: (
      <Svg width={50} height={50} viewBox="0 0 60 80">
        <Ellipse cx={30} cy={35} rx={25} ry={25} fill="#4A90E2" />
        <Circle cx={20} cy={35} r={4} fill="white" />
        <Circle cx={40} cy={35} r={4} fill="white" />
        <Rect x={15} y={55} width={10} height={20} rx={5} fill="#4A90E2" />
        <Rect x={35} y={55} width={10} height={20} rx={5} fill="#4A90E2" />
      </Svg>
    )
  },
  { 
    id: 3, 
    name: 'Type C', 
    svg: (
      <Svg width={50} height={50} viewBox="0 0 60 80">
        <Rect x={10} y={10} width={40} height={45} rx={2} fill="#50C878" />
        <Rect x={20} y={25} width={6} height={8} rx={1} fill="white" />
        <Rect x={34} y={25} width={6} height={8} rx={1} fill="white" />
        <Rect x={15} y={55} width={10} height={20} rx={2} fill="#50C878" />
        <Rect x={35} y={55} width={10} height={20} rx={2} fill="#50C878" />
      </Svg>
    )
  },
];

const colors = ['#FF6B6B', '#4A90E2', '#50C878', '#FFD700', '#9B59B6'];

const accessories = [
  { 
    id: 1, 
    name: 'Hat', 
    svg: (
      <Svg width={70} height={70} viewBox="0 0 60 80">
        <Path 
          d="M 15 12 C 15 8 45 8 45 12 L 42 10 L 30 3 L 18 10 L 15 12"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth={3}
        />
      </Svg>
    )
  },
  { 
    id: 2, 
    name: 'Glasses', 
    svg: (
      <Svg width={70} height={70} viewBox="0 0 60 80">
        <G key="glasses">
          <Circle cx={22} cy={30} r={8} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
          <Circle cx={38} cy={30} r={8} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
          <Path d="M 28 30 L 32 30" stroke="#FFFFFF" strokeWidth={2.5} />
          <Path d="M 14 30 L 10 28" stroke="#FFFFFF" strokeWidth={2.5} />
          <Path d="M 46 30 L 50 28" stroke="#FFFFFF" strokeWidth={2.5} />
        </G>
      </Svg>
    )
  },
  { 
    id: 3, 
    name: 'Cape', 
    svg: (
      <Svg width={70} height={70} viewBox="0 0 60 80">
        <Path 
          d="M 15 15 C 30 65 45 15 45 15 L 42 60 C 30 75 18 60 18 60 L 15 15"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={3}
        />
      </Svg>
    )
  },
];

export default function CreateHeroScreen({ navigation }) {
  const [heroName, setHeroName] = useState('');
  const [selectedBodyType, setSelectedBodyType] = useState(bodyTypes[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const { currentTheme, isDarkMode } = useTheme();

  const handleAccessoryToggle = (accessory) => {
    if (selectedAccessories.includes(accessory)) {
      setSelectedAccessories(selectedAccessories.filter((item) => item.id !== accessory.id));
    } else {
      setSelectedAccessories([...selectedAccessories, accessory]);
    }
  };

  const handleCreateHero = () => {
    const hero = {
      name: heroName || 'Custom Hero',
      bodyType: selectedBodyType,
      color: selectedColor,
      accessories: selectedAccessories,
    };
    navigation.navigate('HeroPreview', { hero });
  };

  return (
    <LinearGradient
      colors={currentTheme.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={[styles.title, { color: currentTheme.title }]}>Create Your Hero</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Hero Name Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Hero Name</Text>
          <TextInput
            style={[
              styles.nameInput,
              { 
                backgroundColor: currentTheme.card,
                color: isDarkMode ? '#FFFFFF' : currentTheme.text,
                borderColor: currentTheme.cardBorder
              }
            ]}
            placeholder="Enter hero name"
            placeholderTextColor={isDarkMode ? 'rgba(255, 255, 255, 0.6)' : currentTheme.cardDescription}
            value={heroName}
            onChangeText={setHeroName}
            maxLength={20}
          />
        </View>

        {/* Body Type Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Body Type</Text>
          <View style={styles.optionsContainer}>
            {bodyTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.optionCard,
                  selectedBodyType.id === type.id && styles.selectedOption,
                ]}
                onPress={() => setSelectedBodyType(type)}
              >
                <Svg width={50} height={50} viewBox="0 0 60 80">
                  {type.svg}
                </Svg>
                <Text style={[
                  styles.optionText, 
                  { color: isDarkMode ? '#FFFFFF' : currentTheme.text }
                ]}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Color</Text>
          <View style={styles.optionsContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        {/* Accessories Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Accessories</Text>
          <View style={styles.optionsContainer}>
            {accessories.map((accessory) => (
              <TouchableOpacity
                key={accessory.id}
                style={[
                  styles.optionCard,
                  selectedAccessories.includes(accessory) && styles.selectedOption,
                ]}
                onPress={() => handleAccessoryToggle(accessory)}
              >
                <Svg width={70} height={70} viewBox="0 0 60 80">
                  {accessory.svg}
                </Svg>
                <Text style={[
                  styles.optionText, 
                  { color: isDarkMode ? '#FFFFFF' : currentTheme.text }
                ]}>
                  {accessory.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[
          styles.createButton,
          { opacity: heroName.trim() ? 1 : 0.7 }
        ]} 
        onPress={handleCreateHero}
      >
        <Text style={styles.createButtonText}>Create Hero</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: (width - 48) / 3,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
    minHeight: 120,
    justifyContent: 'center',
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  optionText: {
    fontSize: 14,
    marginTop: 8,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 12,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  createButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameInput: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    marginTop: 8,
  },
});