/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CosmicCanvas } from './components/CosmicCanvas';
import { ControlPanel } from './components/ControlPanel';
import { QuickHUD } from './components/QuickHUD';
import { DEFAULT_SETTINGS } from './utils/presets';
import { CosmicSettings } from './types/cosmic';

export default function App() {
  const [settings, setSettings] = useState<CosmicSettings>(() => {
    try {
      const saved = localStorage.getItem('cosmic_canvas_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);
  const [particleCount, setParticleCount] = useState<number>(0);
  const [clearTrigger, setClearTrigger] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem('cosmic_canvas_settings', JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // Show temporary toast message
  const showToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 2500);
  }, []);

  // Capture canvas screenshot
  const handleCaptureScreenshot = useCallback(() => {
    const canvas = canvasElementRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `cosmic-canvas-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
      showToast('📸 Foto Semesta Kosmik Berhasil Disimpan!');
    } catch (e) {
      console.error(e);
      showToast('Gagal mengambil tangkapan layar');
    }
  }, [showToast]);

  // Clear canvas particles
  const handleClearCanvas = useCallback(() => {
    setClearTrigger((prev) => prev + 1);
    setParticleCount(0);
    showToast('✨ Layar Partikel Dibersihkan');
  }, [showToast]);

  // Reset settings
  const handleResetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    showToast('🔄 Pengaturan Dikembalikan ke Bawaan');
  }, [showToast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        // Dispatch synthetic click at center or random position
        const canvas = canvasElementRef.current;
        if (canvas) {
          const rx = window.innerWidth * (0.2 + Math.random() * 0.6);
          const ry = window.innerHeight * (0.2 + Math.random() * 0.6);
          const ev = new PointerEvent('pointerdown', {
            clientX: rx,
            clientY: ry,
            bubbles: true
          });
          canvas.dispatchEvent(ev);
        }
      } else if (e.key === 'c' || e.key === 'C') {
        handleClearCanvas();
      } else if (e.key === 's' || e.key === 'S') {
        setIsPanelOpen((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
      } else if (e.key === 'a' || e.key === 'A') {
        setSettings((prev) => ({ ...prev, autoPlay: !prev.autoPlay }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClearCanvas]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* Interactive Cosmos Canvas */}
      <CosmicCanvas
        settings={settings}
        clearTrigger={clearTrigger}
        onStatsUpdate={setParticleCount}
        canvasRefCallback={(canvas) => {
          canvasElementRef.current = canvas;
        }}
      />

      {/* Floating HUD Controls */}
      <QuickHUD
        settings={settings}
        onUpdateSettings={setSettings}
        onTogglePanel={() => setIsPanelOpen(!isPanelOpen)}
        isPanelOpen={isPanelOpen}
        onCaptureScreenshot={handleCaptureScreenshot}
        onClearCanvas={handleClearCanvas}
        particleCount={particleCount}
      />

      {/* Settings Drawer Modal */}
      <ControlPanel
        settings={settings}
        onChange={setSettings}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onReset={handleResetSettings}
      />

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900/90 text-white text-xs font-medium border border-indigo-500/40 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
          {notification}
        </div>
      )}
    </main>
  );
}
