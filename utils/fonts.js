import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
  });
}; 