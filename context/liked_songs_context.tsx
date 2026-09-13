import { getLikedSongs, toggleLikeApi } from "@/services/liked_service";
import { createContext, useContext, useEffect, useState } from "react";

type LikedSongsContextType = {
  likedIds: number[];
  toggleLike: (id: number) => void;
  error: string;
};

const LikedSongsContext = createContext<LikedSongsContextType>({
  likedIds: [],
  toggleLike: () => {},
  error: "",
});

export function LikedSongsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [likedIds, setLikedIds] = useState<number[]>([]);
const [error, setError] = useState("");
  useEffect(() => {
    getLikedSongs()
      .then((data) => {
        setLikedIds(data.map((s: any) => s.id));
      })
      .catch((e) => {
        console.log("PROVIDER ERROR:", e);
        setError("فشل تحميل الأغاني");
      });
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
    <LikedSongsContext.Provider value={{ likedIds, toggleLike, error }}>
      {children}
    </LikedSongsContext.Provider>
  );
}

export function useLikedSongs() {
  return useContext(LikedSongsContext);
}
