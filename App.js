import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './contexts/ThemeContext';
import { StyleSheet } from 'react-native';

// Import screens
const MenuScreen = require('./screens/MenuScreen').default;
const CharacterSelectionScreen = require('./screens/CharacterSelectionScreen').default;
const SelectedCharacterScreen = require('./screens/SelectedCharacterScreen').default;
const MathBallCatcherGame = require('./screens/MathBallCatcherGame').default;
const CreateYourHero = require('./screens/CreateYourHero').default;
const HeroPreview = require('./screens/HeroPreview').default;

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Menu" 
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="CharacterSelection" component={CharacterSelectionScreen} />
          <Stack.Screen name="CreateYourHero" component={CreateYourHero} />
          <Stack.Screen name="HeroPreview" component={HeroPreview} />
          <Stack.Screen 
            name="SelectedCharacter" 
            component={SelectedCharacterScreen}
            options={{
              cardStyleInterpolator: ({ current: { progress } }) => ({
                cardStyle: {
                  opacity: progress
                }
              })
            }}
          />
          <Stack.Screen name="MathBallCatcherGame" component={MathBallCatcherGame} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
