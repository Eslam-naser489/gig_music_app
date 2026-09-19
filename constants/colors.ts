// Side Menu colors are shared by both palettes — the drawer is always-dark
// by design (per Figma), independent of the app's own light/dark theme.
const menuSurfaceColors = {
  menuSurface: '#171827',
  menuSurfaceText: '#FFFFFF',
  menuSurfaceTextSoft: 'rgba(255, 255, 255, 0.72)',
  menuSurfaceBorder: 'rgba(255, 255, 255, 0.1)',
};

export const LightColors = {
  // Backgrounds
  background: '#FAF8F5',       // warm off-white
  surface: '#FFFFFF',
  surfaceElevated: '#F5F2EE',

  // Text
  textPrimary: '#1A1D2E',      // deep navy
  textSecondary: '#6B7085',
  textTertiary: '#9CA3B8',
  textInverse: '#FFFFFF',

  // Accent
  accent: '#E8563A',           // orange-red
  accentLight: '#FFF0EC',
  accentDark: '#C44428',

  // Borders & Dividers
  border: '#E8E5E0',
  divider: '#F0EDE8',

  // States
  error: '#DC3545',
  errorLight: '#FFF0F0',
  success: '#28A745',

  // Skeleton
  skeletonBase: '#F0EDE8',
  skeletonHighlight: '#FAF8F5',

  // Shadows
  shadowColor: '#1A1D2E',

  // Overlay
  overlay: 'rgba(26, 29, 46, 0.5)',

  ...menuSurfaceColors,
};

// Dark-mode palette — currently applied to the screens the Infrastructure
// & Layout member owns (Settings, Contact Us, Learn More) via useTheme().
// Same keys as LightColors so any screen can swap in either one.
export const DarkColors = {
  // Backgrounds
  background: '#121320',
  surface: '#1E2030',
  surfaceElevated: '#262940',

  // Text
  textPrimary: '#F5F4F2',
  textSecondary: '#B8BCD0',
  textTertiary: '#7E8299',
  textInverse: '#FFFFFF',

  // Accent — brand color stays the same across themes
  accent: '#E8563A',
  accentLight: 'rgba(232, 86, 58, 0.18)',
  accentDark: '#FF8A6B',

  // Borders & Dividers
  border: '#2E3148',
  divider: '#232540',

  // States
  error: '#FF6B6B',
  errorLight: 'rgba(255, 107, 107, 0.14)',
  success: '#4CD964',

  // Skeleton
  skeletonBase: '#232540',
  skeletonHighlight: '#2E3148',

  // Shadows
  shadowColor: '#000000',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',

  ...menuSurfaceColors,
};

export type AppColors = typeof LightColors;

// Default export — the app's original always-light palette. Left unchanged
// so every screen that isn't theme-aware yet keeps looking exactly as
// before; only screens that opt in via `useTheme().colors` go dark.
export const Colors = LightColors;
