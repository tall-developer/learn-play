import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveCustomHero = async (hero) => {
  try {
    const existingHeroes = await AsyncStorage.getItem('customHeroes');
    const heroes = existingHeroes ? JSON.parse(existingHeroes) : [];
    heroes.push(hero);
    await AsyncStorage.setItem('customHeroes', JSON.stringify(heroes));
  } catch (error) {
    console.error('Error saving custom hero:', error);
  }
};

export const getCustomHeroes = async () => {
  try {
    const heroes = await AsyncStorage.getItem('customHeroes');
    return heroes ? JSON.parse(heroes) : [];
  } catch (error) {
    console.error('Error getting custom heroes:', error);
    return [];
  }
};

export const deleteCustomHero = async (heroId) => {
  try {
    const existingHeroes = await AsyncStorage.getItem('customHeroes');
    if (!existingHeroes) return;
    
    const heroes = JSON.parse(existingHeroes);
    const updatedHeroes = heroes.filter((hero, index) => `custom-${index}` !== heroId);
    await AsyncStorage.setItem('customHeroes', JSON.stringify(updatedHeroes));
    return updatedHeroes;
  } catch (error) {
    console.error('Error deleting custom hero:', error);
    return null;
  }
}; 