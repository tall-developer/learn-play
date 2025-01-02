import React from 'react';
import Svg, { Circle, Text } from 'react-native-svg';

const MathIcon = () => (
  <Svg width="100" height="100" viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="40" fill="#FF6B6B" />
    <Text x="50" y="55" textAnchor="middle" fill="white" fontSize="20">
      1+2
    </Text>
  </Svg>
);

export default MathIcon;
