import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming, Extrapolation } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface CardProps {
  item: { id: number | string; title: string; image: any };
  index: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SwipeableCard: React.FC<CardProps> = ({ item, onSwipeLeft, onSwipeRight, index }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const direction = translateX.value > 0 ? 1 : -1;
        translateX.value = withTiming(direction * SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
          if (direction > 0) runOnJS(onSwipeRight)();
          else runOnJS(onSwipeLeft)();
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: withSpring(1 - index * 0.05) },
      ],
    };
  });

  const rightOpacity = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? Math.min(translateX.value / 100, 1) : 0,
  }));

  const leftOpacity = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? Math.min(-translateX.value / 100, 1) : 0,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, animatedCardStyle, { zIndex: index }]}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />

        {/* Swipe kanan → ceklis hijau */}
        <Animated.View style={[styles.label, styles.rightLabel, rightOpacity]}>
          <Ionicons name="checkmark-circle" size={50} color="#22c55e" />
          <Text style={{ color: '#22c55e', fontWeight: 'bold', marginLeft: 5 }}>Like</Text>
        </Animated.View>

        {/* Swipe kiri → tong sampah merah */}
        <Animated.View style={[styles.label, styles.leftLabel, leftOpacity]}>
          <Ionicons name="trash" size={50} color="#ef4444" />
          <Text style={{ color: '#ef4444', fontWeight: 'bold', marginLeft: 5 }}>Trash</Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.2,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  image: { width: '100%', height: '100%' },
  label: { position: 'absolute', top: 40, flexDirection: 'row', alignItems: 'center', gap: 10 },
  rightLabel: { right: 30, transform: [{ rotate: '-30deg' }] },
  leftLabel: { left: 30, transform: [{ rotate: '30deg' }] },
});

export default SwipeableCard;
