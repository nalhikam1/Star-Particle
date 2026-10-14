import React, { useRef, useEffect, useCallback } from 'react';
import { CosmicSettings, Particle, BackgroundStar, ShootingStar, StarShape } from '../types/cosmic';
import { COLOR_PRESETS } from '../utils/presets';
import { celestialAudio } from '../utils/audio';

interface CosmicCanvasProps {
  settings: CosmicSettings;
  clearTrigger?: number;
  onStatsUpdate?: (particleCount: number) => void;
  canvasRefCallback?: (canvas: HTMLCanvasElement | null) => void;
}

export const CosmicCanvas: React.FC<CosmicCanvasProps> = ({
  settings,
  clearTrigger,
  onStatsUpdate,
  canvasRefCallback
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Clear particles when clearTrigger updates
  useEffect(() => {
    if (clearTrigger !== undefined && clearTrigger > 0) {
      particlesRef.current = [];
      if (onStatsUpdate) onStatsUpdate(0);
    }
  }, [clearTrigger, onStatsUpdate]);
  const bgStarsRef = useRef<BackgroundStar[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const isPointerDownRef = useRef<boolean>(false);
  const lastPointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const pointerHoldTimerRef = useRef<number>(0);
  const autoPlayTimerRef = useRef<number>(0);

  // Get current active color list
  const getActiveColors = useCallback((): string[] => {
    if (settings.colorMode === 'palette' || settings.colorMode === 'mono') {
      const preset = COLOR_PRESETS.find(p => p.id === settings.activePresetId);
      if (preset) {
        return settings.colorMode === 'mono' ? [preset.colors[0], '#ffffff'] : preset.colors;
      }
    }
    return settings.customColors.length > 0 ? settings.customColors : ['#38bdf8', '#818cf8', '#ffffff'];
  }, [settings.colorMode, settings.activePresetId, settings.customColors]);

  const getRandomColor = useCallback((): string => {
    const colors = getActiveColors();
    return colors[Math.floor(Math.random() * colors.length)];
  }, [getActiveColors]);

  // Spawn star particles at (x, y)
  const spawnStarParticles = useCallback((
    x: number,
    y: number,
    customCount?: number,
    isBurst: boolean = true
  ) => {
    const count = customCount ?? (isBurst ? settings.particleCount : settings.trailSpawnRate);
    const newParticles: Particle[] = [];

    // Trigger celestial audio
    if (settings.soundEnabled) {
      const width = canvasRef.current?.width || window.innerWidth;
      celestialAudio.playStarChime(x / width, settings.soundVolume);
    }

    for (let i = 0; i < count; i++) {
      const baseSize = settings.minSize + Math.random() * (settings.maxSize - settings.minSize);
      const angle = Math.random() * Math.PI * 2;
      
      let speed = (0.5 + Math.random() * 2.5) * settings.speedMultiplier;
      let vx = 0;
      let vy = 0;

      // Apply physics mode on creation
      switch (settings.physicsMode) {
        case 'supernova': {
          const burstSpeed = (2.0 + Math.random() * 5.0) * settings.speedMultiplier;
          vx = Math.cos(angle) * burstSpeed;
          vy = Math.sin(angle) * burstSpeed;
          break;
        }
        case 'antigravity': {
          vx = (Math.random() - 0.5) * 1.8 * settings.speedMultiplier;
          vy = -(1.2 + Math.random() * 2.5) * settings.speedMultiplier;
          break;
        }
        case 'vortex': {
          const dist = 10 + Math.random() * 60;
          const tangentialAngle = angle + Math.PI / 2;
          const vSpeed = (1.5 + Math.random() * 3.0) * settings.speedMultiplier;
          vx = Math.cos(tangentialAngle) * vSpeed + Math.cos(angle) * 0.8;
          vy = Math.sin(tangentialAngle) * vSpeed + Math.sin(angle) * 0.8;
          break;
        }
        case 'wander': {
          vx = (Math.random() - 0.5) * 2.2 * settings.speedMultiplier;
          vy = (Math.random() - 0.5) * 2.2 * settings.speedMultiplier;
          break;
        }
        case 'drift':
        default: {
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
          break;
        }
      }

      // Determine shape
      let shape: StarShape = settings.starShape;
      if (shape === 'mixed') {
        const shapes: StarShape[] = ['sparkle4', 'celestial5', 'diamond', 'orb', 'ring'];
        shape = shapes[Math.floor(Math.random() * shapes.length)];
      }

      const maxLife = (settings.lifetimeMultiplier * (1.2 + Math.random() * 1.5)); // seconds

      newParticles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx,
        vy,
        size: baseSize,
        baseSize,
        color: getRandomColor(),
        alpha: 1,
        life: 0,
        maxLife,
        shape,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 2 + Math.random() * 4 * settings.twinkleRate,
        glow: settings.glowIntensity,
        trailPoints: []
      });
    }

    particlesRef.current.push(...newParticles);
  }, [settings, getRandomColor]);

  // Supernova burst with huge particles & shockwave
  const triggerSupernova = useCallback((x: number, y: number) => {
    if (settings.soundEnabled) {
      celestialAudio.playSupernovaSound(settings.soundVolume);
    }
    // Massive burst of 60-80 stars
    spawnStarParticles(x, y, Math.min(80, settings.particleCount * 2.5), true);
  }, [settings, spawnStarParticles]);

  // Initialize background distant stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    const stars: BackgroundStar[] = [];
    const colors = ['#ffffff', '#e0f2fe', '#fef3c7', '#ede9fe'];

    for (let i = 0; i < settings.backgroundStarCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.6 + Math.random() * 1.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.2 + Math.random() * 0.7,
        baseAlpha: 0.2 + Math.random() * 0.7,
        twinkleSpeed: 0.5 + Math.random() * 2.0,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
    bgStarsRef.current = stars;
  }, [settings.backgroundStarCount]);

  // Handle canvas resize with High DPR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (canvasRefCallback) {
      canvasRefCallback(canvas);
    }

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRefCallback]);

  // Main drawing helpers for different star shapes
  const drawStarParticle = (
    ctx: CanvasRenderingContext2D,
    p: Particle,
    scale: number,
    alpha: number
  ) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    const r = Math.max(0.5, p.baseSize * scale);
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle = p.color;

    // Glowing aura
    if (p.glow > 0) {
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.glow * scale;
    }

    switch (p.shape) {
      case 'sparkle4': {
        // Sparkling 4-point Diamond Star with elegant curved spikes
        ctx.beginPath();
        const spikes = 4;
        const outerRadius = r * 1.6;
        const innerRadius = r * 0.22;
        let rot = -Math.PI / 2;
        const step = Math.PI / spikes;

        ctx.moveTo(0, -outerRadius);
        for (let i = 0; i < spikes; i++) {
          let x = Math.cos(rot) * outerRadius;
          let y = Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += step;

          x = Math.cos(rot) * innerRadius;
          y = Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(0, -outerRadius);
        ctx.closePath();
        ctx.fill();

        // Bright white star core
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        break;
      }
      case 'celestial5': {
        // Classic 5-point celestial star
        ctx.beginPath();
        const points = 5;
        const outer = r * 1.4;
        const inner = r * 0.55;
        for (let i = 0; i < points * 2; i++) {
          const radius = i % 2 === 0 ? outer : inner;
          const a = (i * Math.PI) / points - Math.PI / 2;
          const x = Math.cos(a) * radius;
          const y = Math.sin(a) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        break;
      }
      case 'diamond': {
        // Crystal diamond rhombus
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.5);
        ctx.lineTo(r * 0.7, 0);
        ctx.lineTo(0, r * 1.5);
        ctx.lineTo(-r * 0.7, 0);
        ctx.closePath();
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        break;
      }
      case 'ring': {
        // Cosmic ring / shockwave nova
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.2, 0, Math.PI * 2);
        ctx.lineWidth = Math.max(1, r * 0.25);
        ctx.strokeStyle = p.color;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        break;
      }
      case 'orb':
      default: {
        // Glowing stardust sphere with radial gradient
        const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.3);
        radGrad.addColorStop(0, '#ffffff');
        radGrad.addColorStop(0.35, p.color);
        radGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r * 1.3, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  };

  // Main Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      // Handle Auto Play mode (idle cosmic explosions)
      if (settings.autoPlay) {
        autoPlayTimerRef.current += dt * 1000;
        if (autoPlayTimerRef.current >= settings.autoPlayInterval) {
          autoPlayTimerRef.current = 0;
          const rx = width * 0.15 + Math.random() * width * 0.7;
          const ry = height * 0.15 + Math.random() * height * 0.7;
          spawnStarParticles(rx, ry, settings.particleCount, true);
        }
      }

      // Handle pointer hold charging
      if (isPointerDownRef.current && lastPointerPosRef.current) {
        pointerHoldTimerRef.current += dt;
        // spawn mini stardust while holding
        if (Math.random() < 0.3) {
          spawnStarParticles(
            lastPointerPosRef.current.x + (Math.random() - 0.5) * 20,
            lastPointerPosRef.current.y + (Math.random() - 0.5) * 20,
            2,
            false
          );
        }
      }

      // Find active preset config
      const preset = COLOR_PRESETS.find(p => p.id === settings.activePresetId) || COLOR_PRESETS[0];

      // Draw background space
      ctx.save();
      // Trail effect fade
      ctx.globalAlpha = 1;
      ctx.fillStyle = preset.bgTint || '#030712';
      ctx.fillRect(0, 0, width, height);

      // Render cosmic nebula dust if enabled
      if (settings.showNebula) {
        const t = time * 0.0003;
        const [n1, n2, n3] = preset.nebulaGradient;
        
        ctx.globalAlpha = settings.nebulaOpacity;
        ctx.globalCompositeOperation = 'screen';

        // Nebula cloud 1
        const g1 = ctx.createRadialGradient(
          width * 0.3 + Math.sin(t) * 80,
          height * 0.4 + Math.cos(t * 0.8) * 60,
          20,
          width * 0.3,
          height * 0.4,
          Math.max(width, height) * 0.55
        );
        g1.addColorStop(0, n1);
        g1.addColorStop(1, 'transparent');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);

        // Nebula cloud 2
        const g2 = ctx.createRadialGradient(
          width * 0.75 + Math.cos(t * 0.9) * 90,
          height * 0.65 + Math.sin(t * 0.7) * 70,
          30,
          width * 0.75,
          height * 0.65,
          Math.max(width, height) * 0.6
        );
        g2.addColorStop(0, n2);
        g2.addColorStop(1, 'transparent');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, width, height);

        // Nebula cloud 3 (center subtle)
        const g3 = ctx.createRadialGradient(
          width * 0.5,
          height * 0.5,
          10,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.4
        );
        g3.addColorStop(0, n3);
        g3.addColorStop(1, 'transparent');
        ctx.fillStyle = g3;
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'source-over';
      }

      // Draw twinkling background stars
      ctx.globalCompositeOperation = 'source-over';
      const bgStars = bgStarsRef.current;
      for (let i = 0; i < bgStars.length; i++) {
        const star = bgStars[i];
        star.twinklePhase += dt * star.twinkleSpeed;
        const currentAlpha = star.baseAlpha * (0.4 + 0.6 * Math.sin(star.twinklePhase));

        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, currentAlpha);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Handle shooting stars (meteors)
      if (settings.shootingStarsEnabled) {
        // Randomly spawn shooting star
        if (Math.random() < 0.015 && shootingStarsRef.current.length < 3) {
          const startX = Math.random() * width;
          const startY = Math.random() * (height * 0.4);
          const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3; // 45 degree angle
          const speed = 400 + Math.random() * 300;
          shootingStarsRef.current.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: 80 + Math.random() * 120,
            alpha: 1,
            color: Math.random() > 0.5 ? '#ffffff' : '#67e8f9',
            life: 0,
            maxLife: 0.8 + Math.random() * 0.6
          });
        }

        // Draw and update shooting stars
        for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
          const s = shootingStarsRef.current[i];
          s.life += dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.alpha = Math.max(0, 1 - s.life / s.maxLife);

          if (s.life >= s.maxLife || s.x > width + 200 || s.y > height + 200) {
            shootingStarsRef.current.splice(i, 1);
            continue;
          }

          // Draw shooting star tail
          const tailX = s.x - (s.vx / 400) * s.length;
          const tailY = s.y - (s.vy / 400) * s.length;

          const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(1, s.color);

          ctx.save();
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.2;
          ctx.globalAlpha = s.alpha;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();

          // Bright head point
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Constellation lines connection (if enabled)
      const particles = particlesRef.current;
      if (settings.connectConstellations && particles.length > 1) {
        ctx.save();
        ctx.lineWidth = 0.8;
        const maxDist = settings.constellationDistance;
        const maxDistSq = maxDist * maxDist;

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
              const dist = Math.sqrt(distSq);
              const lineAlpha = (1 - dist / maxDist) * 0.35 * Math.min(p1.alpha, p2.alpha);
              ctx.strokeStyle = p1.color;
              ctx.globalAlpha = lineAlpha;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      // Update and Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;

        // Progress 0.0 -> 1.0
        const progress = p.life / p.maxLife;

        if (progress >= 1.0) {
          particles.splice(i, 1);
          continue;
        }

        // Apply physical drag / deceleration
        const drag = 0.985;
        p.vx *= drag;
        p.vy *= drag;

        // Physics behavior based on mode
        switch (settings.physicsMode) {
          case 'antigravity':
            p.vy -= 18 * dt; // upward drift
            p.vx += Math.sin(time * 0.003 + p.twinklePhase) * 12 * dt;
            break;
          case 'vortex': {
            // subtle centripetal sway
            const swirl = 0.5 * settings.speedMultiplier;
            const curVx = p.vx;
            p.vx = curVx - p.vy * swirl * dt;
            p.vy = p.vy + curVx * swirl * dt;
            break;
          }
          case 'wander':
            p.vx += (Math.sin(time * 0.004 + p.twinklePhase) * 35) * dt;
            p.vy += (Math.cos(time * 0.004 + p.twinklePhase) * 35) * dt;
            break;
          case 'drift':
          default:
            // subtle wave floating
            p.vy += Math.sin(time * 0.002 + p.twinklePhase) * 4 * dt;
            break;
        }

        // Move particle
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Fade calculation: quick rise, lingering glow, soft ease-out decay
        let alpha = 1;
        if (progress < 0.1) {
          alpha = progress / 0.1;
        } else {
          // Quadratic ease-out fade
          const remaining = 1 - progress;
          alpha = Math.pow(remaining, 1.4);
        }

        // Twinkle oscillation
        p.twinklePhase += dt * p.twinkleSpeed;
        const twinkleScale = 0.8 + 0.35 * Math.sin(p.twinklePhase);
        const currentScale = twinkleScale * (1 - progress * 0.3);

        p.alpha = alpha;

        // Render particle
        drawStarParticle(ctx, p, currentScale, alpha);
      }

      ctx.restore();

      // Notify parent about particle count for HUD stats
      if (onStatsUpdate && Math.random() < 0.1) {
        onStatsUpdate(particles.length);
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [settings, onStatsUpdate, spawnStarParticles]);

  // Pointer event handlers (Mouse & Touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = true;
    pointerHoldTimerRef.current = 0;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPointerPosRef.current = { x, y };

    // Initial burst on tap/click
    spawnStarParticles(x, y, settings.particleCount, true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPointerPosRef.current = { x, y };

    // Continuous stardust trail if moving with pointer down or if dragTrail is enabled
    if (isPointerDownRef.current && settings.enableDragTrail) {
      spawnStarParticles(x, y, settings.trailSpawnRate, false);
    }
  };

  const handlePointerUp = () => {
    // If held for more than 0.6 seconds, unleash Supernova burst!
    if (isPointerDownRef.current && pointerHoldTimerRef.current > 0.6 && lastPointerPosRef.current) {
      triggerSupernova(lastPointerPosRef.current.x, lastPointerPosRef.current.y);
    }
    isPointerDownRef.current = false;
    pointerHoldTimerRef.current = 0;
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="fixed inset-0 w-full h-full cursor-crosshair touch-none"
    />
  );
};
