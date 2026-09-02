export const Colors = {
  // Brand Romantic Palette
  primary: '#FF6B8B',
  primaryDark: '#E84A6E',
  primaryLight: '#FFA8BD',
  secondary: '#FF8E53',
  lavender: '#B57EDC',
  champagne: '#FFE8D6',
  gold: '#FFD166',
  
  // Backgrounds & Surfaces
  background: '#FFF8FA',
  backgroundDark: '#120D16',
  surface: '#FFFFFF',
  surfaceSubtle: '#FFF0F5',
  card: 'rgba(255, 255, 255, 0.92)',
  cardDark: 'rgba(30, 22, 38, 0.92)',

  // Accents & Badges
  loveRed: '#FF4757',
  heartPink: '#FF3366',
  spicyOrange: '#FF7A00',
  emeraldGreen: '#2ED573',
  skyBlue: '#1E90FF',
  warmYellow: '#FFA502',

  // Text & Neutrals
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  textMuted: '#B2BEC3',
  textLight: '#FFFFFF',
  border: '#F0E2E7',
  borderDark: '#2E2236',

  // Gradients (tuples for expo-linear-gradient)
  gradients: {
    primary: ['#FF6B8B', '#FF8E53'] as const,
    spicy: ['#FA709A', '#FEE140'] as const,
    dream: ['#A18CD1', '#FBC2EB'] as const,
    ocean: ['#4FACFE', '#00F2FE'] as const,
    gold: ['#FFE259', '#FFA751'] as const,
    dark: ['#23192B', '#140E1B'] as const,
    cardBg: ['#FFFFFF', '#FFF5F8'] as const,
    romanticHero: ['#FF6584', '#FF8C68', '#FFAD7A'] as const,
  }
};
