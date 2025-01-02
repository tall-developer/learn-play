import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const theme = {
  light: {
    gradient: ['#4158D0', '#C850C0', '#FFCC70'],
    card: 'rgba(255, 255, 255, 0.95)',
    cardBorder: 'rgba(255, 255, 255, 0.3)',
    title: '#000000',
    text: '#1C1C1E',
    cardTitle: '#1C1C1E',
    cardDescription: '#8E8E93',
    headerBorder: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    gradient: ['#1A1A1A', '#2D2D2D', '#3D3D3D'],
    card: 'rgba(45, 45, 45, 0.95)',
    cardBorder: 'rgba(255, 255, 255, 0.1)',
    title: '#FFFFFF',
    text: '#FFFFFF',
    cardTitle: '#FFFFFF',
    cardDescription: '#FFFFFF',
    headerBorder: 'rgba(255, 255, 255, 0.1)',
  }
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    // Load saved theme preference
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('themePreference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 