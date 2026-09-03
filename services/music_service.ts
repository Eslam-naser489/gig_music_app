// services/musicService.ts
// ⚠️ ملف مشترك بين العضو التاني والرابع.
// دلوقتي بيرجع بيانات وهمية (Mock) بنفس الشكل اللي هيرجعه السيرفر الحقيقي،
// عشان تقدر تبني الواجهة وتستبدلها بطلب API حقيقي بعدين من غير ما تغيّر شكل البيانات.

import { Song, Playlist } from "../types";

const MOCK_SONGS: Song[] = [
  {
    id: "1",
    title: "Believer",
    artist: "Imagine Dragons",
    coverUrl: "https://picsum.photos/seed/believer/300",
    audioUrl: "",
    duration: 204,
  },
  {
    id: "2",
    title: "Shortwave",
    artist: "CODESIX",
    coverUrl: "https://picsum.photos/seed/shortwave/300",
    audioUrl: "",
    duration: 187,
  },
  {
    id: "3",
    title: "Monsters Go Bump",
    artist: "SmashUP",
    coverUrl: "https://picsum.photos/seed/monsters/300",
    audioUrl: "",
    duration: 210,
  },
  {
    id: "4",
    title: "Moment Apart",
    artist: "ODESZA",
    coverUrl: "https://picsum.photos/seed/moment/300",
    audioUrl: "",
    duration: 240,
  },
];

const MOCK_PLAYLIST: Playlist = {
  id: "p1",
  title: "My Playlist",
  coverUrl: "https://picsum.photos/seed/myplaylist/300",
  songs: MOCK_SONGS,
};

// محاكاة تأخير الشبكة عشان تختبر حالات التحميل (Loading) بشكل واقعي
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getRecommendedSongs(): Promise<Song[]> {
  await delay(500);
  return MOCK_SONGS;
}

export async function getMyPlaylist(): Promise<Playlist> {
  await delay(500);
  return MOCK_PLAYLIST;
}
