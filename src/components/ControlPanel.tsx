import React, { useState } from 'react';
import { CosmicSettings, StarShape, PhysicsMode } from '../types/cosmic';
import { COLOR_PRESETS } from '../utils/presets';
import { 
  Palette, 
  Sparkles, 
  Zap, 
  Globe2, 
  Volume2, 
  VolumeX, 
  X, 
  Plus, 
  Trash2, 
  RotateCcw,
  Sliders,
  Eye,
  Activity,
  Layers
} from 'lucide-react';

interface ControlPanelProps {
  settings: CosmicSettings;
  onChange: (newSettings: CosmicSettings) => void;
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

type TabType = 'color' | 'particles' | 'physics' | 'universe';

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  onChange,
  isOpen,
  onClose,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('color');
  const [newColorInput, setNewColorInput] = useState<string>('#38bdf8');

  if (!isOpen) return null;

  const updateSetting = <K extends keyof CosmicSettings>(key: K, value: CosmicSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const addCustomColor = () => {
    if (!settings.customColors.includes(newColorInput)) {
      updateSetting('customColors', [...settings.customColors, newColorInput]);
      updateSetting('colorMode', 'palette');
    }
  };

  const removeCustomColor = (colorToRemove: string) => {
    if (settings.customColors.length > 1) {
      updateSetting('customColors', settings.customColors.filter(c => c !== colorToRemove));
    }
  };

  const shapes: { id: StarShape; label: string; icon: string }[] = [
    { id: 'sparkle4', label: 'Bintang 4-Titik', icon: '✦' },
    { id: 'celestial5', label: 'Bintang Langit', icon: '★' },
    { id: 'diamond', label: 'Kristal Berlian', icon: '◆' },
    { id: 'orb', label: 'Debu Cahaya', icon: '◉' },
    { id: 'ring', label: 'Cincin Nova', icon: '◎' },
    { id: 'mixed', label: 'Campuran Acak', icon: '✹' },
  ];

  const physicsModes: { id: PhysicsMode; label: string; desc: string }[] = [
    { id: 'drift', label: 'Melayang Tenang', desc: 'Gerakan lembut tanpa bobot seperti di ruang hampa' },
    { id: 'supernova', label: 'Ledakan Supernova', desc: 'Pancaran cepat memancar lalu melambat anggun' },
    { id: 'vortex', label: 'Pusaran Galaksi', desc: 'Bintang berputar membentuk spiral cakrawala' },
    { id: 'antigravity', label: 'Anti-Gravitasi', desc: 'Melayang perlahan naik ke angkasa luar' },
    { id: 'wander', label: 'Berkelana Liar', desc: 'Gelombang halus berayun lembut tak menentu' },
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-slate-950/85 backdrop-blur-2xl border-l border-white/10 text-slate-100 flex flex-col shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/40">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-white tracking-wide text-base">Pengaturan Semesta</h2>
            <p className="text-xs text-slate-400">Kustomisasi visual & fisika bintang</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            title="Reset ke Bawaan"
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 px-2 bg-slate-900/20">
        <button
          onClick={() => setActiveTab('color')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-3 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'color'
              ? 'border-indigo-400 text-indigo-300 bg-white/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Warna</span>
        </button>

        <button
          onClick={() => setActiveTab('particles')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-3 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'particles'
              ? 'border-indigo-400 text-indigo-300 bg-white/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Partikel</span>
        </button>

        <button
          onClick={() => setActiveTab('physics')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-3 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'physics'
              ? 'border-indigo-400 text-indigo-300 bg-white/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Kecepatan</span>
        </button>

        <button
          onClick={() => setActiveTab('universe')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-3 text-xs font-medium border-b-2 transition-all ${
            activeTab === 'universe'
              ? 'border-indigo-400 text-indigo-300 bg-white/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>Semesta</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
        {/* ================= TAB 1: WARNA ================= */}
        {activeTab === 'color' && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Preset Galaksi Kosmik
                </label>
                <span className="text-[11px] text-indigo-400">{COLOR_PRESETS.length} Tema Siap Pakai</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {COLOR_PRESETS.map((p) => {
                  const isSelected = settings.activePresetId === p.id && settings.colorMode === 'palette';
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        updateSetting('activePresetId', p.id);
                        updateSetting('customColors', [...p.colors]);
                        updateSetting('colorMode', 'palette');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-950/40 ring-1 ring-indigo-400/50 shadow-lg'
                          : 'border-white/10 bg-slate-900/50 hover:border-white/20 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="text-xs font-medium text-slate-200 group-hover:text-white truncate mb-1.5">
                        {p.name}
                      </div>
                      <div className="flex items-center space-x-1">
                        {p.colors.map((c, idx) => (
                          <span
                            key={idx}
                            className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode Warna */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Mode Spektrum Warna
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'palette', label: 'Multiwarna', desc: 'Semua warna palet' },
                  { id: 'mono', label: 'Monokromatik', desc: 'Dominan & putih' },
                  { id: 'gradient', label: 'Kustom Acak', desc: 'Palet racikan' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => updateSetting('colorMode', mode.id as any)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      settings.colorMode === mode.id
                        ? 'border-indigo-400 bg-indigo-500/20 text-white font-medium'
                        : 'border-white/5 bg-black/20 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs">{mode.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Palet Kustom */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Palet Warna Aktif
                </label>
                <span className="text-[11px] text-slate-400">{settings.customColors.length} warna</span>
              </div>

              {/* Color chips */}
              <div className="flex flex-wrap gap-2">
                {settings.customColors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1.5 pl-2 pr-1.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs"
                  >
                    <span
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-[11px] text-slate-300">{color}</span>
                    {settings.customColors.length > 2 && (
                      <button
                        onClick={() => removeCustomColor(color)}
                        className="p-0.5 text-slate-500 hover:text-red-400 transition-colors"
                        title="Hapus warna"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add custom color */}
              <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                <input
                  type="color"
                  value={newColorInput}
                  onChange={(e) => setNewColorInput(e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={newColorInput}
                  onChange={(e) => setNewColorInput(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-indigo-400"
                />
                <button
                  onClick={addCustomColor}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PARTIKEL ================= */}
        {activeTab === 'particles' && (
          <div className="space-y-5">
            {/* Bentuk Bintang */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2.5">
                Bentuk Partikel Bintang
              </label>
              <div className="grid grid-cols-3 gap-2">
                {shapes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => updateSetting('starShape', s.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      settings.starShape === s.id
                        ? 'border-indigo-400 bg-indigo-950/40 text-white ring-1 ring-indigo-400/50 shadow-md'
                        : 'border-white/10 bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="text-lg mb-1">{s.icon}</span>
                    <span className="text-[11px] font-medium truncate w-full">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ukuran Partikel: Min & Max */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Ukuran Bintang Minimum</span>
                  <span className="font-mono text-indigo-400 font-semibold">{settings.minSize} px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={settings.minSize}
                  onChange={(e) => updateSetting('minSize', Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Ukuran Bintang Maksimum</span>
                  <span className="font-mono text-indigo-400 font-semibold">{settings.maxSize} px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="35"
                  step="1"
                  value={settings.maxSize}
                  onChange={(e) => updateSetting('maxSize', Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>

            {/* Jumlah Partikel per Klik */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Jumlah Partikel per Klik</span>
                <span className="font-mono text-indigo-400 font-semibold">{settings.particleCount} butir</span>
              </div>
              <input
                type="range"
                min="6"
                max="65"
                step="2"
                value={settings.particleCount}
                onChange={(e) => updateSetting('particleCount', Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Semakin banyak partikel, semakin tebal dan megah ledakan bintang saat diklik.
              </p>
            </div>

            {/* Intensitas Cahaya / Glow Bloom */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Pijar Cahaya / Glow Aura</span>
                <span className="font-mono text-indigo-400 font-semibold">{settings.glowIntensity} px</span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                step="2"
                value={settings.glowIntensity}
                onChange={(e) => updateSetting('glowIntensity', Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Menghasilkan kilauan luminescence magis di sekeliling setiap partikel bintang.
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 3: FISIKA & KECEPATAN ================= */}
        {activeTab === 'physics' && (
          <div className="space-y-5">
            {/* Mode Fisika */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2.5">
                Pola Gerakan Partikel
              </label>
              <div className="space-y-2">
                {physicsModes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => updateSetting('physicsMode', m.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                      settings.physicsMode === m.id
                        ? 'border-indigo-400 bg-indigo-950/40 ring-1 ring-indigo-400/50'
                        : 'border-white/10 bg-slate-900/50 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{m.label}</span>
                      {settings.physicsMode === m.id && (
                        <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Kecepatan Animasi */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Kecepatan Gerak / Drift</span>
                  <span className="font-mono text-indigo-400 font-semibold">
                    {settings.speedMultiplier.toFixed(1)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.8"
                  step="0.1"
                  value={settings.speedMultiplier}
                  onChange={(e) => updateSetting('speedMultiplier', Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Lambat (Meditatif)</span>
                  <span>Normal</span>
                  <span>Super Cepat</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-300 font-medium">Durasi Melayang / Masa Hidup</span>
                  <span className="font-mono text-indigo-400 font-semibold">
                    {settings.lifetimeMultiplier.toFixed(1)} detik
                  </span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="4.5"
                  step="0.1"
                  value={settings.lifetimeMultiplier}
                  onChange={(e) => updateSetting('lifetimeMultiplier', Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Menentukan berapa lama partikel mengapung sebelum perlahan memudar dari layar.
                </p>
              </div>
            </div>

            {/* Jejak Drag & Kelap-Kelip */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-slate-200">Jejak Bintang Saat Menggeser</div>
                  <div className="text-[11px] text-slate-400">Memunculkan partikel saat kursor/jari digeser</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableDragTrail}
                  onChange={(e) => updateSetting('enableDragTrail', e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-white/20 focus:ring-0"
                />
              </label>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300">Frekuensi Kelap-Kelip (Twinkle)</span>
                  <span className="font-mono text-indigo-400">{Math.round(settings.twinkleRate * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={settings.twinkleRate}
                  onChange={(e) => updateSetting('twinkleRate', Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: ALAM SEMESTA ================= */}
        {activeTab === 'universe' && (
          <div className="space-y-5">
            {/* Nebula Kosmik */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-slate-200">Kabut Nebula Kosmik</div>
                  <div className="text-[11px] text-slate-400">Gas kosmik bercahaya di latar belakang</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showNebula}
                  onChange={(e) => updateSetting('showNebula', e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-white/20 focus:ring-0"
                />
              </label>

              {settings.showNebula && (
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-300">Kepekatan Nebula</span>
                    <span className="font-mono text-indigo-400">{Math.round(settings.nebulaOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={settings.nebulaOpacity}
                    onChange={(e) => updateSetting('nebulaOpacity', Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Bintang Latar Belakang & Meteor */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-300 font-medium">Bintang Latar Belakang Jauh</span>
                  <span className="font-mono text-indigo-400">{settings.backgroundStarCount} bintang</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="350"
                  step="10"
                  value={settings.backgroundStarCount}
                  onChange={(e) => updateSetting('backgroundStarCount', Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-white/5">
                <div>
                  <div className="text-xs font-semibold text-slate-200">Hujan Meteor / Bintang Jatuh</div>
                  <div className="text-[11px] text-slate-400">Kilas cahaya meteor melintasi langit malam</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.shootingStarsEnabled}
                  onChange={(e) => updateSetting('shootingStarsEnabled', e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-white/20 focus:ring-0"
                />
              </label>
            </div>

            {/* Garis Konstelasi */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-slate-200">Hubungkan Garis Rasi Bintang</div>
                  <div className="text-[11px] text-slate-400">Jalin benang cahaya antara bintang yang berdekatan</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.connectConstellations}
                  onChange={(e) => updateSetting('connectConstellations', e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-white/20 focus:ring-0"
                />
              </label>
            </div>

            {/* Suara Harmoni Kosmik */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-2">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-500" />
                  )}
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Suara Lonceng Angkasa (Chimes)</div>
                    <div className="text-[11px] text-slate-400">Harmoni nada pentatonik saat bintang muncul</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-white/20 focus:ring-0"
                />
              </label>

              {settings.soundEnabled && (
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-300">Volume Suara</span>
                    <span className="font-mono text-indigo-400">{Math.round(settings.soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={settings.soundVolume}
                    onChange={(e) => updateSetting('soundVolume', Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-white/10 bg-slate-900/40 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Tekan <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">Spasi</kbd> untuk ledakan acak</span>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
        >
          Selesai
        </button>
      </div>
    </div>
  );
};
