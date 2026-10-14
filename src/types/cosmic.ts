export type StarShape = 'sparkle4' | 'celestial5' | 'diamond' | 'orb' | 'ring' | 'mixed';

export type PhysicsMode = 'drift' | 'supernova' | 'vortex' | 'antigravity' | 'wander';

export interface ColorPreset {
  id: string;
  name: string;
  colors: string[];
  nebulaGradient: [string, string, string];
  bgTint: string;
}

export interface CosmicSettings {
  // Color settings
  activePresetId: string;
  customColors: string[];
  colorMode: 'palette' | 'gradient' | 'mono';
  
  // Particle size & count
  minSize: number;
  maxSize: number;
  particleCount: number;
  glowIntensity: number; // 0 - 30
  starShape: StarShape;
  
  // Animation speed & physics
  speedMultiplier: number; // 0.2 - 3.0
  lifetimeMultiplier: number; // 0.5 - 3.0 (in seconds, duration of particles)
  physicsMode: PhysicsMode;
  twinkleRate: number; // 0 - 1
  trailStrength: number; // 0.05 - 0.5 (canvas clear alpha)
  
  // Interaction
  enableDragTrail: boolean;
  trailSpawnRate: number;
  connectConstellations: boolean;
  constellationDistance: number;
  
  // Universe environment
  backgroundStarCount: number;
  showNebula: boolean;
  nebulaOpacity: number;
  shootingStarsEnabled: boolean;
  
  // Sound
  soundEnabled: boolean;
  soundVolume: number;
  
  // Auto mode
  autoPlay: boolean;
  autoPlayInterval: number; // ms
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape: StarShape;
  rotation: number;
  rotationSpeed: number;
  twinklePhase: number;
  twinkleSpeed: number;
  glow: number;
  trailPoints?: { x: number; y: number; alpha: number }[];
}

export interface BackgroundStar {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  baseAlpha: number;
}

export interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}
