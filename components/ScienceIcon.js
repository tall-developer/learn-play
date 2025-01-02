import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const ScienceIcon = () => (
  <Svg width="100" height="100" viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="40" fill="#50C878" />
    <Path d="M 35 60 Q 50 30 65 60" stroke="white" fill="white" strokeWidth="2" />
    <Circle cx="50" cy="45" r="8" fill="white" />
  </Svg>
);

export default ScienceIcon;
