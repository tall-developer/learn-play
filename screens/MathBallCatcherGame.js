import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const generateMathProblem = () => {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  const problem = `${num1} ${operator} ${num2}`;
  const answer = eval(problem); // eslint-disable-line no-eval
  return { problem, answer };
};

const BallPopAnimation = ({ x, y, onComplete }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(onComplete);
  }, []);

  return (
    <Animated.View
      style={[
        styles.popAnimation,
        {
          left: x,
          top: y,
          transform: [{ scale }],
          opacity,
        },
      ]}
    />
  );
};

export default function MathBallCatcherGame({ route, navigation }) {
  const { character } = route.params;
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [mathProblem, setMathProblem] = useState(generateMathProblem());
  const [balls, setBalls] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const basketPosition = useRef(new Animated.Value(width / 2 - 50)).current;
  const { currentTheme } = useTheme();
  const [popAnimations, setPopAnimations] = useState([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const startNewGame = async () => {
    try {
      await AsyncStorage.removeItem('mathBallCatcherProgress');
      setGameStarted(true);
      setScore(0);
      setLives(3);
      setMathProblem(generateMathProblem());
      setBalls([]);
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  const continueGame = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('mathBallCatcherProgress');
      if (savedProgress) {
        const { savedScore, savedLives } = JSON.parse(savedProgress);
        setScore(savedScore);
        setLives(savedLives);
      }
      setGameStarted(true);
    } catch (error) {
      console.error('Error loading saved game:', error);
      startNewGame(); // Fallback to new game if loading fails
    }
  };

  // Save progress when game state changes
  useEffect(() => {
    if (gameStarted) {
      AsyncStorage.setItem('mathBallCatcherProgress', JSON.stringify({
        savedScore: score,
        savedLives: lives
      }));
    }
  }, [score, lives, gameStarted]);

  // Start game immediately when component mounts
  useEffect(() => {
    startNewGame();
  }, []);

  // Update ball dropping logic
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      const { answer } = mathProblem;
      const wrongAnswers = [
        answer + Math.floor(Math.random() * 5) + 1,
        answer - Math.floor(Math.random() * 5) - 1,
      ];
      const options = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
      
      const newBall = {
        id: Date.now(),
        value: options[0],
        x: Math.random() * (width - 100), // Adjusted for larger ball size
        y: new Animated.Value(-60), // Start higher for larger balls
      };

      Animated.timing(newBall.y, {
        toValue: height - 180, // Adjusted end position for larger balls
        duration: 4000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setBalls(prev => prev.filter(b => b.id !== newBall.id));
          if (newBall.value === mathProblem.answer) {
            setLives(prev => Math.max(0, prev - 1));
          }
        }
      });

      setBalls(prev => [...prev, newBall]);
    }, 2000);

    return () => clearInterval(interval);
  }, [gameStarted, mathProblem]);

  // Update collision detection with adjusted hero position
  useEffect(() => {
    const collisionInterval = setInterval(() => {
      const heroX = basketPosition._value;
      const heroWidth = 100;
      const heroHeadY = height - 180; // Adjusted to be lower
      const heroHeadHeight = 60;

      balls.forEach(ball => {
        const ballY = ball.y._value;
        const ballX = ball.x;
        const ballRadius = 30;

        // Check for ground collision first
        if (ballY >= height - 100) { // Adjusted ground level
          if (ball.value === mathProblem.answer) {
            setLives(prev => Math.max(0, prev - 1));
            shakeScreen();
          }
          setBalls(prev => prev.filter(b => b.id !== ball.id));
          return;
        }

        // Calculate distances for head collision
        const ballCenterX = ballX + ballRadius;
        const heroHeadCenterX = heroX + heroWidth / 2;

        const distanceX = Math.abs(ballCenterX - heroHeadCenterX);
        const distanceY = Math.abs(ballY + ballRadius - heroHeadY);

        // Check collision with hero's head
        if (distanceY < heroHeadHeight / 2 && distanceX < heroWidth / 2) {
          if (ball.value === mathProblem.answer) {
            setScore(prev => prev + 1);
            const popId = Date.now();
            setPopAnimations(prev => [
              ...prev,
              { id: popId, x: ballX, y: ballY },
            ]);
            setMathProblem(generateMathProblem());
          } else {
            setLives(prev => Math.max(0, prev - 1));
            shakeScreen();
          }
          setBalls(prev => prev.filter(b => b.id !== ball.id));
        }
      });
    }, 16);

    return () => clearInterval(collisionInterval);
  }, [balls, basketPosition]);

  // Game Over check
  useEffect(() => {
    if (lives <= 0) {
      Alert.alert(
        'Game Over!',
        `Final Score: ${score}`,
        [
          {
            text: 'Try Again',
            onPress: () => {
              setLives(3);
              setScore(0);
              setBalls([]);
              setMathProblem(generateMathProblem());
            },
          },
          {
            text: 'Exit',
            onPress: () => navigation.navigate('CharacterSelectionScreen'),
            style: 'cancel',
          },
        ]
      );
    }
  }, [lives]);

  // Handle hero movement
  const moveHero = (direction) => {
    const newPosition = direction === 'left' 
      ? Math.max(0, basketPosition._value - 50)
      : Math.min(width - 100, basketPosition._value + 50);

    Animated.spring(basketPosition, {
      toValue: newPosition,
      friction: 7,
      tension: 40,
      useNativeDriver: false,
    }).start();
  };

  // Add shake animation function
  const shakeScreen = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Game UI
  return (
    <LinearGradient
      colors={currentTheme.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.fixedHeader}>
        <View style={styles.scoreContainer}>
          <Text style={[styles.score, { color: currentTheme.text }]}>Score: {score}</Text>
          <Text style={[styles.lives, { color: currentTheme.text }]}>Lives: {lives}</Text>
        </View>
        <Text style={[styles.problem, { color: currentTheme.title }]}>
          {mathProblem.problem} = ?
        </Text>
      </View>

      <Animated.View
        style={[
          styles.gameContainer,
          {
            transform: [{ translateX: shakeAnimation }],
          },
        ]}
      >
        <View style={styles.gameArea}>
          {balls.map(ball => (
            <Animated.View
              key={ball.id}
              style={[
                styles.ball,
                {
                  left: ball.x,
                  top: ball.y,
                  backgroundColor: ball.value === mathProblem.answer ? '#4CAF50' : '#FF6B6B',
                  zIndex: 1,
                },
              ]}
            >
              <Text style={styles.ballText}>{ball.value}</Text>
            </Animated.View>
          ))}

          {popAnimations.map(pop => (
            <BallPopAnimation
              key={pop.id}
              x={pop.x}
              y={pop.y}
              onComplete={() => {
                setPopAnimations(prev => prev.filter(p => p.id !== pop.id));
              }}
            />
          ))}

          <Animated.View
            style={[
              styles.hero,
              { transform: [{ translateX: basketPosition }] },
            ]}
          >
            {character.svg}
          </Animated.View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => moveHero('left')}
          >
            <Text style={styles.controlButtonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => moveHero('right')}
          >
            <Text style={styles.controlButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
    paddingTop: 40, // Adjust for status bar
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  problem: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 100, // Add space for fixed header
  },
  gameArea: {
    flex: 1,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  ball: {
    position: 'absolute',
    width: 60, // Increased from 40
    height: 60, // Increased from 40
    borderRadius: 30, // Increased from 20
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  ballText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 24, // Increased from 16
  },
  hero: {
    position: 'absolute',
    bottom: 80, // Adjusted to be lower
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // Uncomment for debugging collision area
    // borderWidth: 1,
    // borderColor: 'rgba(255, 0, 0, 0.5)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(98, 0, 238, 0.8)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  popAnimation: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    zIndex: 2,
  },
});