import { AccessibilityInfo } from 'react-native';
import { useState, useEffect } from 'react';
import { withSpring, withTiming, Easing } from 'react-native-reanimated';

export const springConfig = { damping: 15, stiffness: 150, mass: 0.8 };
export const gentleSpring = { damping: 20, stiffness: 120, mass: 1 };

export const TIMING_FAST = 150;
export const TIMING_NORMAL = 250;
export const TIMING_SLOW = 400;

export const STAGGER_DELAY = 60;
export const scalePressValue = 0.96;

export function useReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => {
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}

export function getEntranceDelay(index: number): number {
  return index * STAGGER_DELAY;
}
