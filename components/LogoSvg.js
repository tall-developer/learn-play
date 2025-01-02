import * as React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { StyleSheet } from 'react-native';

const LogoSvg = React.forwardRef((props, ref) => (
  <Svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    width={200}
    height={200}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <G>
      <Path d="M12 2L2 22h20L12 2z" />
    </G>
  </Svg>
));

export default LogoSvg;