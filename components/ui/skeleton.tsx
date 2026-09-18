import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import type { ComponentProps } from "react";

import { Colors } from "@/constants/colors";
import { Theme } from "@/constants/theme";

/**
 * Skeleton — pulsing placeholder block (components/ui), for loading rows
 * / cards before their real content arrives.
 */

interface SkeletonProps {
  style?: ComponentProps<typeof Animated.View>["style"];
}

export function Skeleton({ style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 620, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 620, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return <Animated.View style={[styles.base, { opacity }, style]} />;
}

const styles = StyleSheet.create({
  base: { backgroundColor: Colors.skeletonBase, borderRadius: Theme.borderRadius.md },
});
