// context/player_context.tsx
import { Song } from "@/types";
import {
    setAudioModeAsync,
    useAudioPlayer,
    useAudioPlayerStatus,
} from "expo-audio";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

export type RepeatMode = "off" | "all" | "one";

type PlayerContextType = {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  position: number; // seconds
  duration: number; // seconds
  shuffle: boolean;
  repeat: RepeatMode;
  error: string | null;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  seekTo: (seconds: number) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");

  const currentSong = currentIndex >= 0 ? (queue[currentIndex] ?? null) : null;

  // Derived error: no state update needed
  const error =
    currentSong && !currentSong.audioUrl ? "This song has no audio file" : null;

  // Play audio even when the phone is on silent
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  // Load and play whenever the current song changes
  useEffect(() => {
    if (!currentSong?.audioUrl) return;
    try {
      player.replace({ uri: currentSong.audioUrl });
      player.play();
    } catch (e) {
      console.warn("Could not play song", e);
    }
  }, [currentSong?.id, currentSong?.audioUrl, player]);

  const playSong = useCallback((song: Song, newQueue?: Song[]) => {
    const list = newQueue && newQueue.length ? newQueue : [song];
    const index = list.findIndex((s) => s.id === song.id);
    setQueue(list);
    setCurrentIndex(index >= 0 ? index : 0);
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    if (status.playing) {
      player.pause();
    } else {
      // If the song ended, start from the beginning
      if (status.duration > 0 && status.currentTime >= status.duration - 0.5) {
        player.seekTo(0);
      }
      player.play();
    }
  }, [
    currentSong,
    status.playing,
    status.currentTime,
    status.duration,
    player,
  ]);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    if (shuffle && queue.length > 1) {
      let random = currentIndex;
      while (random === currentIndex) {
        random = Math.floor(Math.random() * queue.length);
      }
      setCurrentIndex(random);
    } else if (currentIndex < queue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (repeat === "all") {
      setCurrentIndex(0);
    } else {
      player.pause();
    }
  }, [queue.length, shuffle, currentIndex, repeat, player]);

  const previous = useCallback(() => {
    if (queue.length === 0) return;
    // After 3 seconds, "previous" restarts the current song
    if (status.currentTime > 3 || currentIndex === 0) {
      player.seekTo(0);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  }, [queue.length, status.currentTime, currentIndex, player]);

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);

  const cycleRepeat = useCallback(
    () => setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off")),
    [],
  );

  const seekTo = useCallback(
    (seconds: number) => {
      if (currentSong) player.seekTo(seconds);
    },
    [currentSong, player],
  );

  // Keep the latest "song finished" handler in a ref (updated inside an effect)
  const onFinishRef = useRef<() => void>(() => {});
  useEffect(() => {
    onFinishRef.current = () => {
      if (repeat === "one") {
        player.seekTo(0);
        player.play();
      } else {
        next();
      }
    };
  }, [repeat, next, player]);

  // Listen to the player: react when a song finishes
  // React when a song finishes
  useEffect(() => {
    if (status.didJustFinish) onFinishRef.current();
  }, [status.didJustFinish]);
  const value = useMemo(
    () => ({
      currentSong,
      queue,
      isPlaying: status.playing,
      position: status.currentTime || 0,
      duration: status.duration || currentSong?.duration || 0,
      shuffle,
      repeat,
      error,
      playSong,
      togglePlay,
      next,
      previous,
      toggleShuffle,
      cycleRepeat,
      seekTo,
    }),
    [
      currentSong,
      queue,
      status.playing,
      status.currentTime,
      status.duration,
      shuffle,
      repeat,
      error,
      playSong,
      togglePlay,
      next,
      previous,
      toggleShuffle,
      cycleRepeat,
      seekTo,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayerContext() {
  const ctx = useContext(PlayerContext);
  if (!ctx)
    throw new Error("usePlayerContext must be used inside PlayerProvider");
  return ctx;
}
