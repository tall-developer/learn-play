import React from 'react';
import Svg, { Rect, Text as SvgText, Path } from 'react-native-svg';

const WordIcon = () => (
  <Svg width="100" height="100" viewBox="0 0 100 100">
    <Rect x="20" y="20" width="60" height="60" fill="#4A90E2" />
    <SvgText x="50" y="55" textAnchor="middle" fill="white" fontSize="20">
      ABC
    </SvgText>
    <Path d="M 40 70 L 50 20 L 60 70" stroke="white" fill="none" strokeWidth="5" />
  </Svg>
);

export default WordIcon;
