import React, { useState } from 'react';
import { CosmicSettings, ColorPreset } from '../types/cosmic';
import { COLOR_PRESETS } from '../utils/presets';
import { 
  Sliders, 
  Camera, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Trash2, 
  Sparkles, 
  Compass,
  ChevronDown,
  Info
} from 'lucide-react';

interface QuickHUDProps {
  settings: CosmicSettings;
  onUpdateSettings: (newSettings: CosmicSettings) => void;
  onTogglePanel: () => void;
  isPanelOpen: boolean;
  onCaptureScreenshot: () => void;
  onClearCanvas: () => void;
  particleCount: number;
}

export const QuickHUD: React.FC<QuickHUDProps> = ({
  settings,
  onUpdateSettings,
  onTogglePanel,
  isPanelOpen,
  onCaptureScreenshot,
  onClearCanvas,
  particleCount,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(true);

  const activePreset = COLOR_PRESETS.find(p => p.id === settings.activePresetId) || COLOR_PRESETS[0];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSelectPreset = (preset: ColorPreset) => {
    onUpdateSettings({
      ...settings,
      activePresetId: preset.id,
      customColors: [...preset.colors],
      colorMode: 'palette'
    });
    setIsPresetDropdownOpen(false);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-30 p-4 pointer-events-none flex items-center justify-between">
        {/* Brand & Active Galaxy Tag */}
        <div className="pointer-events-auto flex items-center space-x-3 bg-slate-950/70 backdrop-blur-xl border border-white/10 px-3.5 py-2 rounded-2xl shadow-xl">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold tracking-tight text-white font-['Space_Grotesk']">
                Cosmic Canvas
              </h1>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Alam Semesta
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center space-x-1.5">
              <span>Tema:</span>
              <span className="text-indigo-300 font-medium">{activePreset.name}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center space-x-2">
          {/* Preset Quick Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsPresetDropdownOpen(!isPresetDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-950/70 hover:bg-slate-900/90 backdrop-blur-xl border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-lg"
              title="Ganti Tema Warna Cepat"
            >
              <div className="flex -space-x-1">
                {activePreset.colors.slice(0, 3).map((c, i) => (
                  <span
                    key={i}
                    className="w-3 h-3 rounded-full border border-black/50"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <span className="hidden sm:inline">{activePreset.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isPresetDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/10 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-2.5 py-1">
                  Pilih Preset Galaksi
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-colors ${
                        settings.activePresetId === preset.id
                          ? 'bg-indigo-600/30 text-white font-medium border border-indigo-500/40'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{preset.name}</span>
                      <div className="flex -space-x-1 ml-2">
                        {preset.colors.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            className="w-2.5 h-2.5 rounded-full border border-black/60"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
            className={`p-2 rounded-xl backdrop-blur-xl border transition-all shadow-lg ${
              settings.soundEnabled
                ? 'bg-indigo-600/40 border-indigo-400/50 text-indigo-300'
                : 'bg-slate-950/70 border-white/10 text-slate-400 hover:text-white hover:bg-slate-900/80'
            }`}
            title={settings.soundEnabled ? 'Matikan Suara Harmoni' : 'Aktifkan Suara Harmoni Kosmik'}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Auto Mode Toggle */}
          <button
            onClick={() => onUpdateSettings({ ...settings, autoPlay: !settings.autoPlay })}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl backdrop-blur-xl border transition-all text-xs font-medium shadow-lg ${
              settings.autoPlay
                ? 'bg-emerald-600/30 border-emerald-400/50 text-emerald-300'
                : 'bg-slate-950/70 border-white/10 text-slate-400 hover:text-white hover:bg-slate-900/80'
            }`}
            title="Mode Bintang Otomatis (Screensaver)"
          >
            {settings.autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Auto</span>
          </button>

          {/* Capture Snapshot */}
          <button
            onClick={onCaptureScreenshot}
            className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-900/80 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white transition-all shadow-lg"
            title="Ambil Tangkapan Layar (Download Gambar HD)"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-900/80 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white transition-all shadow-lg"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Control Panel Toggle */}
          <button
            onClick={onTogglePanel}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl backdrop-blur-xl border transition-all text-xs font-medium shadow-lg ${
              isPanelOpen
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-indigo-500/30'
                : 'bg-indigo-600/80 hover:bg-indigo-600 text-white border-indigo-400/50 hover:shadow-indigo-500/20'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">Pengaturan</span>
          </button>
        </div>
      </header>

      {/* Bottom Floating Bar */}
      <footer className="fixed bottom-0 inset-x-0 z-30 p-4 pointer-events-none flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Interaction hints */}
        {showTips ? (
          <div className="pointer-events-auto flex items-center space-x-2.5 px-3.5 py-2 rounded-2xl bg-slate-950/70 backdrop-blur-xl border border-white/10 text-xs text-slate-300 shadow-xl">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span>
              <strong>Klik</strong> untuk partikel bintang • <strong>Tahan</strong> untuk Supernova • <strong>Geser</strong> untuk jejak stardust
            </span>
            <button
              onClick={() => setShowTips(false)}
              className="text-slate-400 hover:text-white text-[11px] ml-1"
              title="Tutup petunjuk"
            >
              ✕
            </button>
          </div>
        ) : (
          <div />
        )}

        {/* Particle Stats & Quick Clear */}
        <div className="pointer-events-auto flex items-center space-x-2 bg-slate-950/70 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl shadow-xl text-xs">
          <div className="flex items-center space-x-1.5 text-slate-300 pr-2 border-r border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-indigo-300 font-medium">{particleCount}</span>
            <span className="text-slate-400">bintang aktif</span>
          </div>

          <button
            onClick={onClearCanvas}
            className="flex items-center space-x-1 text-slate-400 hover:text-red-400 px-1.5 py-1 rounded-lg hover:bg-white/5 transition-colors"
            title="Bersihkan Semua Bintang di Layar"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">Bersihkan</span>
          </button>
        </div>
      </footer>
    </>
  );
};
