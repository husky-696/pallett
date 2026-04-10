import { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Copy, Check, RefreshCw, Download, Sun, Moon } from 'lucide-react';
import { Button } from '@/client/components/ui/Button';
import { cn } from '@/client/lib/utils';

// Types
type PaletteColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
};

type PaletteStyle = 'nothing' | 'neon' | 'pastel' | 'earth' | 'ocean' | 'cyber';
type ThemeMode = 'dark' | 'light';

// Color utilities
function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function generatePaletteColors(style: PaletteStyle, mode: ThemeMode): PaletteColors {
  const baseHue = Math.floor(Math.random() * 360);
  const isDark = mode === 'dark';

  const generate = (config: {
    hueShift?: number;
    sat: number;
    satAccent?: number;
    lightPrimary: number;
    lightAccent: number;
  }) => {
    const { hueShift = 0, sat, satAccent = sat + 15, lightPrimary, lightAccent } = config;
    const h1 = baseHue;
    const h2 = (baseHue + 30 + Math.random() * 30) % 360;
    const h3 = (baseHue + hueShift + Math.random() * 60) % 360;

    if (isDark) {
      return {
        primary: hslToHex(h1, sat, lightPrimary),
        secondary: hslToHex(h2, sat - 10, lightPrimary - 10),
        accent: hslToHex(h3, satAccent, lightAccent),
        background: hslToHex(h1, 10 + Math.random() * 10, 6 + Math.random() * 4),
        surface: hslToHex(h1, 8 + Math.random() * 8, 12 + Math.random() * 4),
        text: hslToHex(h1, 5 + Math.random() * 10, 88 + Math.random() * 8),
      };
    } else {
      return {
        primary: hslToHex(h1, sat, lightPrimary - 10),
        secondary: hslToHex(h2, sat - 10, lightPrimary),
        accent: hslToHex(h3, satAccent, lightAccent - 5),
        background: hslToHex(h1, 10 + Math.random() * 15, 96 + Math.random() * 3),
        surface: hslToHex(h1, 5 + Math.random() * 10, 100),
        text: hslToHex(h1, 10 + Math.random() * 15, 10 + Math.random() * 10),
      };
    }
  };

  switch (style) {
    case 'nothing':
      return {
        primary: isDark ? '#FFFFFF' : '#000000',
        secondary: hslToHex(0, 0, isDark ? 60 + Math.random() * 20 : 30 + Math.random() * 20),
        accent: hslToHex(0 + Math.random() * 10, 85 + Math.random() * 15, 45 + Math.random() * 10),
        background: hslToHex(0, 0, isDark ? 2 + Math.random() * 4 : 98 - Math.random() * 3),
        surface: hslToHex(0, 0, isDark ? 8 + Math.random() * 6 : 94 + Math.random() * 4),
        text: isDark ? '#FFFFFF' : '#000000',
      };
    case 'neon':
      return generate({ hueShift: 120, sat: 100, satAccent: 100, lightPrimary: 55, lightAccent: 55 });
    case 'pastel':
      return generate({ hueShift: 90, sat: 50, satAccent: 55, lightPrimary: 75, lightAccent: 70 });
    case 'earth': {
      const earthHue = 20 + Math.random() * 40;
      return {
        primary: hslToHex(earthHue, 45 + Math.random() * 20, isDark ? 50 : 40),
        secondary: hslToHex(earthHue + 20, 35 + Math.random() * 15, isDark ? 40 : 50),
        accent: hslToHex(earthHue + 140, 50 + Math.random() * 20, isDark ? 55 : 45),
        background: hslToHex(earthHue, 15, isDark ? 8 : 96),
        surface: hslToHex(earthHue, 10, isDark ? 14 : 100),
        text: hslToHex(earthHue, 20, isDark ? 90 : 15),
      };
    }
    case 'ocean': {
      const oceanHue = 180 + Math.random() * 40;
      return {
        primary: hslToHex(oceanHue, 65 + Math.random() * 20, isDark ? 50 : 40),
        secondary: hslToHex(oceanHue + 30, 55 + Math.random() * 15, isDark ? 45 : 50),
        accent: hslToHex(oceanHue + 150, 60 + Math.random() * 20, isDark ? 55 : 45),
        background: hslToHex(oceanHue, 20, isDark ? 8 : 97),
        surface: hslToHex(oceanHue, 15, isDark ? 14 : 100),
        text: hslToHex(oceanHue, 15, isDark ? 92 : 12),
      };
    }
    case 'cyber': {
      const cyberHue = 260 + Math.random() * 40;
      return {
        primary: hslToHex(cyberHue, 90 + Math.random() * 10, isDark ? 60 : 50),
        secondary: hslToHex(180, 100, isDark ? 45 : 40),
        accent: hslToHex(50, 100, isDark ? 55 : 50),
        background: hslToHex(cyberHue, 30, isDark ? 6 : 97),
        surface: hslToHex(cyberHue, 25, isDark ? 12 : 100),
        text: hslToHex(180, 60, isDark ? 85 : 20),
      };
    }
    default:
      return generate({ hueShift: 180, sat: 65, lightPrimary: 50, lightAccent: 55 });
  }
}

const styleDescriptions: Record<PaletteStyle, string> = {
  nothing: 'Monochrome + red',
  neon: 'Vibrant & bright',
  pastel: 'Soft & muted',
  earth: 'Warm naturals',
  ocean: 'Cool blues',
  cyber: 'Purple & cyan',
};

// Dot logo SVG inline
function PalletLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="8" fill="#0a0a0f"/>
      <circle cx="9" cy="9" r="4" fill="#8B5CF6"/>
      <circle cx="19" cy="9" r="4" fill="#06B6D4"/>
      <circle cx="9" cy="19" r="4" fill="#F43F5E"/>
      <circle cx="19" cy="19" r="4" fill="#F59E0B"/>
    </svg>
  );
}

// Color Swatch
function ColorSwatch({ color, label }: { color: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    toast.success(`Copied ${color}`);
    setTimeout(() => setCopied(false), 1200);
  }, [color]);

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-all"
    >
      <div className="w-8 h-8 rounded-lg shadow-inner border border-white/20" style={{ backgroundColor: color }} />
      <div className="text-left">
        <div className="text-xs font-medium text-gray-300">{label}</div>
        <div className="text-xs font-mono text-gray-400 group-hover:text-white transition-colors flex items-center gap-1">
          {color.toUpperCase()}
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100" />}
        </div>
      </div>
    </button>
  );
}

// Mini Preview
function MiniPreview({ colors }: { colors: PaletteColors }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl" style={{ backgroundColor: colors.background }}>
      <div className="px-3 py-2 flex items-center justify-between" style={{ backgroundColor: colors.surface }}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.primary }} />
          <span className="text-xs font-medium" style={{ color: colors.text }}>App</span>
        </div>
        <div className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: colors.primary, color: colors.background }}>
          Sign Up
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: colors.surface }}>
          <div className="text-sm font-semibold" style={{ color: colors.text }}>Dashboard</div>
          <div className="text-xs opacity-60" style={{ color: colors.text }}>Welcome back</div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 p-2 rounded-lg text-center" style={{ backgroundColor: colors.surface }}>
            <div className="text-sm font-bold" style={{ color: colors.accent }}>2.4k</div>
            <div className="text-xs opacity-50" style={{ color: colors.text }}>Users</div>
          </div>
          <div className="flex-1 p-2 rounded-lg text-center" style={{ backgroundColor: colors.surface }}>
            <div className="text-sm font-bold" style={{ color: colors.primary }}>$12k</div>
            <div className="text-xs opacity-50" style={{ color: colors.text }}>Sales</div>
          </div>
        </div>
        <button className="w-full py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: colors.accent, color: colors.background }}>
          View More
        </button>
      </div>
    </div>
  );
}

// Export formats
function generateExport(colors: PaletteColors, format: 'css' | 'tailwind' | 'json'): string {
  if (format === 'css') {
    return `:root {\n  --primary: ${colors.primary};\n  --secondary: ${colors.secondary};\n  --accent: ${colors.accent};\n  --background: ${colors.background};\n  --surface: ${colors.surface};\n  --text: ${colors.text};\n}`;
  }
  if (format === 'tailwind') {
    return `colors: {\n  primary: '${colors.primary}',\n  secondary: '${colors.secondary}',\n  accent: '${colors.accent}',\n  background: '${colors.background}',\n  surface: '${colors.surface}',\n  text: '${colors.text}',\n}`;
  }
  return JSON.stringify({ colors }, null, 2);
}

// Main Component
export default function HomePage() {
  const [style, setStyle] = useState<PaletteStyle>('nothing');
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [colors, setColors] = useState<PaletteColors>(() => generatePaletteColors('nothing', 'dark'));
  const [exportFormat, setExportFormat] = useState<'css' | 'tailwind' | 'json'>('css');
  const [copiedExport, setCopiedExport] = useState(false);

  const regenerate = useCallback(() => {
    setColors(generatePaletteColors(style, mode));
  }, [style, mode]);

  const handleStyleChange = useCallback((newStyle: PaletteStyle) => {
    setStyle(newStyle);
    setColors(generatePaletteColors(newStyle, mode));
  }, [mode]);

  const handleModeChange = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    setColors(generatePaletteColors(style, newMode));
  }, [style]);

  const exportCode = useMemo(() => generateExport(colors, exportFormat), [colors, exportFormat]);

  const copyExport = useCallback(() => {
    navigator.clipboard.writeText(exportCode);
    setCopiedExport(true);
    toast.success('Copied!');
    setTimeout(() => setCopiedExport(false), 1500);
  }, [exportCode]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PalletLogo />
            <span className="font-bold text-lg tracking-tight">Pallet</span>
          </div>
          <p className="text-sm text-gray-500 hidden sm:block">Generate · Preview · Export</p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-12 gap-6">

          {/* Left: Controls */}
          <div className="lg:col-span-4 space-y-4">
            {/* Generate */}
            <div className="bg-gray-900 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Generate</h2>
                <Button onClick={regenerate} size="sm" className="gap-1.5 bg-white/10 hover:bg-white/20 border-0">
                  <RefreshCw className="w-3.5 h-3.5" /> New
                </Button>
              </div>

              {/* Theme Toggle */}
              <div className="flex gap-1 p-1 bg-gray-800 rounded-xl mb-3">
                <button
                  onClick={() => handleModeChange('dark')}
                  className={cn("flex-1 py-1.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-all", mode === 'dark' ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white")}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                </button>
                <button
                  onClick={() => handleModeChange('light')}
                  className={cn("flex-1 py-1.5 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-all", mode === 'light' ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white")}
                >
                  <Sun className="w-3.5 h-3.5" /> Light
                </button>
              </div>

              {/* Style Pills */}
              <div className="grid grid-cols-3 gap-1.5">
                {(['nothing', 'neon', 'pastel', 'earth', 'ocean', 'cyber'] as PaletteStyle[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStyleChange(s)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all text-left",
                      style === s
                        ? "bg-violet-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                    )}
                  >
                    <span className="block">{s}</span>
                    <span className="block text-[10px] opacity-60">{styleDescriptions[s]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="bg-gray-900 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">Palette</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <ColorSwatch color={colors.primary} label="Primary" />
                <ColorSwatch color={colors.secondary} label="Secondary" />
                <ColorSwatch color={colors.accent} label="Accent" />
                <ColorSwatch color={colors.background} label="Background" />
                <ColorSwatch color={colors.surface} label="Surface" />
                <ColorSwatch color={colors.text} label="Text" />
              </div>
            </div>
          </div>

          {/* Middle: Preview */}
          <div className="lg:col-span-4">
            <div className="bg-gray-900 rounded-2xl p-4 border border-white/10 h-full">
              <h2 className="font-semibold mb-3">Preview</h2>
              <MiniPreview colors={colors} />
            </div>
          </div>

          {/* Right: Export */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-gray-900 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold flex items-center gap-2">
                  <Download className="w-4 h-4 text-gray-500" /> Export
                </h2>
                <Button onClick={copyExport} size="sm" variant="ghost" className="gap-1 text-gray-400 hover:text-white">
                  {copiedExport ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />} Copy
                </Button>
              </div>

              <div className="flex gap-1.5 mb-3">
                {(['css', 'tailwind', 'json'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setExportFormat(f)}
                    className={cn("px-2.5 py-1 rounded-full text-xs font-medium uppercase transition-all", exportFormat === f ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-500 hover:bg-gray-700")}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <pre className="text-xs text-gray-300 bg-gray-950 rounded-xl p-3 max-h-64 overflow-y-auto font-mono">
                {exportCode}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
