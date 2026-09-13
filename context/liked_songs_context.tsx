import { createContext, useContext, useEffect, useState } from "react";
import { getLikedSongs, toggleLikeApi } from "@/services/liked_service";

type LikedSongsContextType = {
  likedIds: number[];
  toggleLike: (id: number) => void;
};

const LikedSongsContext = createContext<LikedSongsContextType>({
  likedIds: [],
  toggleLike: () => {},
});

export function LikedSongsProvider({ children }: { children: React.ReactNode }) {
  const [likedIds, setLikedIds] = useState<number[]>([]);

  useEffect(() => {
    getLikedSongs()
      .then((data) => setLikedIds(data.map((s: any) => s.id)))
      .catch(() => {});
  }, []);

  const toggleLike = (id: number) => {
    if (likedIds.includes(id)) {
      setLikedIds(likedIds.filter((x) => x !== id));
    } else {
      setLikedIds([...likedIds, id]);
    }
    toggleLikeApi(id).catch(() => {});
  };

  return (
    <LikedSongsContext.Provider value={{ likedIds, toggleLike }}>
      {children}
    </LikedSongsContext.Provider>
  );
}

export function useLikedSongs() {
  return useContext(LikedSongsContext);
}