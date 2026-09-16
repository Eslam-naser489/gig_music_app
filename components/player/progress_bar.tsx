// components/player/progress_bar.tsx
import { formatTime } from "@/utils/format_time";
import { useState } from "react";
import {
    GestureResponderEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
  position: number;
  duration: number;
  onSeek: (seconds: number) => void;
};

export default function ProgressBar({ position, duration, onSeek }: Props) {
  const [width, setWidth] = useState(0);
  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;

  const handlePress = (e: GestureResponderEvent) => {
    if (width <= 0 || duration <= 0) return;
    const ratio = Math.max(0, Math.min(e.nativeEvent.locationX / width, 1));
    onSeek(ratio * duration);
  };

  return (
    <View>
      <Pressable
        style={styles.touchArea}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        onPress={handlePress}
      >
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={[styles.thumb, { left: progress * width - 7 }]} />
      </Pressable>
      <View style={styles.times}>
        <Text style={styles.time}>{formatTime(position)}</Text>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  touchArea: { height: 24, justifyContent: "center" },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FBE9E4",
    overflow: "hidden",
  },
  fill: { height: 4, backgroundColor: "#FF5A3C" },
  thumb: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FF5A3C",
  },
  times: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  time: { fontSize: 12, color: "#888" },
});
