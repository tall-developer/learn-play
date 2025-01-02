import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const ToggleIcon = ({ isDarkMode }) => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? '#fff' : '#000'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {isDarkMode ? (
      // Moon icon for dark mode
      <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    ) : (
      // Sun icon for light mode
      <>
        <Circle cx="12" cy="12" r="5" />
        <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </>
    )}
  </Svg>
);

export default ToggleIcon;