// types/index.ts
// ⚠️ ملف مشترك — العضو الخامس مسؤول عن النسخة النهائية منه.
// دي نسخة مبدئية كافية عشان العضو التاني (والرابع) يبدأوا الشغل من غير انتظار.

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number; // بالثواني
}

export interface Playlist {
  id: string;
  title: string;
  coverUrl: string;
  songs: Song[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}
