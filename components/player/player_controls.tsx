// components/player/player_controls.tsx
import { usePlayer } from "@/hooks/use_player";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

const ACCENT = "#FF5A3C";
const MUTED = "#999";

interface PlayerControlsProps {
  // Optional — when passed, a heart/like button renders at the right end
  // of the same row as the rest of the transport controls.
  isLiked?: boolean;
  onLikePress?: () => void;
}

export default function PlayerControls({ isLiked, onLikePress }: PlayerControlsProps) {
  const {
    isPlaying,
    shuffle,
    repeat,
    togglePlay,
    next,
    previous,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={toggleShuffle}
        hitSlop={10}
        accessibilityLabel="Shuffle"
      >
        <Ionicons name="shuffle" size={24} color={shuffle ? ACCENT : MUTED} />
      </Pressable>

      <Pressable onPress={previous} hitSlop={10} accessibilityLabel="Previous">
        <Ionicons name="play-skip-back" size={32} color="#171827" />
      </Pressable>

      <Pressable
        onPress={togglePlay}
        accessibilityLabel={isPlaying ? "Pause" : "Play"}
      >
        <Ionicons
          name={isPlaying ? "pause-circle" : "play-circle"}
          size={72}
          color={ACCENT}
        />
      </Pressable>

      <Pressable onPress={next} hitSlop={10} accessibilityLabel="Next">
        <Ionicons name="play-skip-forward" size={32} color="#171827" />
      </Pressable>

      <Pressable onPress={cycleRepeat} hitSlop={10} accessibilityLabel="Repeat">
        <View>
          <Ionicons
            name="repeat"
            size={24}
            color={repeat === "off" ? MUTED : ACCENT}
          />
          {repeat === "one" && <Text style={styles.badge}>1</Text>}
        </View>
      </Pressable>

      {onLikePress ? (
        <Pressable
          onPress={onLikePress}
          hitSlop={10}
          accessibilityLabel={isLiked ? "Unlike" : "Like"}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? ACCENT : MUTED}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    fontSize: 10,
    fontWeight: "700",
    color: ACCENT,
  },
});
