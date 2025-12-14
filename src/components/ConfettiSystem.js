import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const NUM_CONFETTI = 50;
const COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

const ConfettiPiece = ({ index }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Random start position
  const startX = Math.random() * windowWidth;
  const startY = -Math.random() * windowHeight * 0.5 - 50; // Start above screen

  const translateY = useSharedValue(startY);
  const translateX = useSharedValue(startX);
  const rotateZ = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const duration = 3000 + Math.random() * 2000;
    const delay = Math.random() * 2000;

    // Y Animation (Falling)
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(windowHeight + 100, {
          duration: duration,
          easing: Easing.linear,
        }),
        -1, // Infinite repeat
        false // Do not reverse
      )
    );

    // X Animation (Wobble)
    const wobbleOffset = Math.random() * 50 - 25;
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(startX + wobbleOffset, { duration: duration / 2 }),
          withTiming(startX - wobbleOffset, { duration: duration / 2 })
        ),
        -1,
        true // Reverse for wobble
      )
    );

    // Rotation
    rotateZ.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: duration * 0.8 }),
        -1,
        false
      )
    );

    // Fade in initially logic can be complex with repeat, simplified to just always visible
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rotateZ.value}deg` },
        { rotateX: `${rotateZ.value}deg` }, // 3D spin effect
      ],
      opacity: opacity.value,
    };
  });

  const color = COLORS[index % COLORS.length];

  return (
    <Animated.View
      style={[
        styles.confetti,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

export const ConfettiSystem = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: NUM_CONFETTI }).map((_, index) => (
        <ConfettiPiece key={index} index={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  confetti: {
    width: 10,
    height: 10,
    position: 'absolute',
    borderRadius: 2,
  },
});
