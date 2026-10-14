import { ColorPreset, CosmicSettings } from '../types/cosmic';

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'andromeda',
    name: 'Andromeda Neon',
    colors: ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#ffffff'],
    nebulaGradient: ['rgba(56, 189, 248, 0.15)', 'rgba(192, 132, 252, 0.18)', 'rgba(244, 114, 182, 0.1)'],
    bgTint: '#030712'
  },
  {
    id: 'supernova_gold',
    name: 'Supernova Emas',
    colors: ['#fbbf24', '#f59e0b', '#f97316', '#fef08a', '#ffffff'],
    nebulaGradient: ['rgba(251, 191, 36, 0.15)', 'rgba(249, 115, 22, 0.15)', 'rgba(254, 240, 138, 0.08)'],
    bgTint: '#090501'
  },
  {
    id: 'orion_nebula',
    name: 'Nebula Orion',
    colors: ['#a855f7', '#ec4899', '#6366f1', '#e0e7ff', '#ffffff'],
    nebulaGradient: ['rgba(168, 85, 247, 0.2)', 'rgba(236, 72, 153, 0.18)', 'rgba(99, 102, 241, 0.12)'],
    bgTint: '#050214'
  },
  {
    id: 'aurora_borealis',
    name: 'Aurora Borealis',
    colors: ['#34d399', '#10b981', '#2dd4bf', '#a7f3d0', '#67e8f9'],
    nebulaGradient: ['rgba(52, 211, 153, 0.18)', 'rgba(45, 212, 191, 0.15)', 'rgba(103, 232, 249, 0.1)'],
    bgTint: '#020d09'
  },
  {
    id: 'solar_flare',
    name: 'Solar Flare (Api Surya)',
    colors: ['#ef4444', '#f97316', '#fbbf24', '#f43f5e', '#ffffff'],
    nebulaGradient: ['rgba(239, 68, 68, 0.18)', 'rgba(249, 115, 22, 0.16)', 'rgba(251, 191, 36, 0.1)'],
    bgTint: '#120404'
  },
  {
    id: 'deep_crystal',
    name: 'Kristal Berlian Kosmik',
    colors: ['#ffffff', '#e2e8f0', '#93c5fd', '#bfdbfe', '#c7d2fe'],
    nebulaGradient: ['rgba(147, 197, 253, 0.12)', 'rgba(199, 210, 254, 0.14)', 'rgba(255, 255, 255, 0.08)'],
    bgTint: '#020617'
  },
  {
    id: 'cyber_synth',
    name: 'Cyberpunk Nova',
    colors: ['#06b6d4', '#f43f5e', '#eab308', '#a855f7', '#ffffff'],
    nebulaGradient: ['rgba(6, 182, 212, 0.18)', 'rgba(244, 63, 94, 0.18)', 'rgba(168, 85, 247, 0.12)'],
    bgTint: '#080112'
  },
  {
    id: 'mystic_emerald',
    name: 'Zamrud Mistik',
    colors: ['#10b981', '#065f46', '#6ee7b7', '#f0fdf4', '#a7f3d0'],
    nebulaGradient: ['rgba(16, 185, 129, 0.16)', 'rgba(110, 231, 183, 0.12)', 'rgba(6, 95, 70, 0.1)'],
    bgTint: '#020b06'
  }
];

export const DEFAULT_SETTINGS: CosmicSettings = {
  activePresetId: 'andromeda',
  customColors: ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#ffffff'],
  colorMode: 'palette',
  
  minSize: 3,
  maxSize: 14,
  particleCount: 26,
  glowIntensity: 18,
  starShape: 'sparkle4',
  
  speedMultiplier: 1.0,
  lifetimeMultiplier: 1.8,
  physicsMode: 'drift',
  twinkleRate: 0.6,
  trailStrength: 0.2,
  
  enableDragTrail: true,
  trailSpawnRate: 3,
  connectConstellations: false,
  constellationDistance: 90,
  
  backgroundStarCount: 180,
  showNebula: true,
  nebulaOpacity: 0.8,
  shootingStarsEnabled: true,
  
  soundEnabled: false,
  soundVolume: 0.4,
  
  autoPlay: false,
  autoPlayInterval: 1400,
};
