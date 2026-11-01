<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import * as simpleIcons from 'simple-icons';
const { siBitcoin, siEthereum, siSolana, siDogecoin, siTether, siApple, siMicrosoft, siTesla, siNvidia, siGoogle, siMeta, siVuedotjs, siBun, siRust, siTauri, siTailwindcss, siVite, siTypescript, siGithub, siYoutube, siTwitch, siTiktok, siDiscord } = simpleIcons as any;
const store = useGameStore();
const stealthMode = computed(() => store.creatorStealthMode);




// Audio Synthesizer for Website
const sfxEnabled = ref(true);
let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSynthPump() {
  if (!sfxEnabled.value) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
    gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + idx * 0.05);
    osc.stop(ctx.currentTime + idx * 0.05 + 0.18);
  });
}

function playSynthDump() {
  if (!sfxEnabled.value) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(580, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.32);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.32);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.32);
}

// Live Interactive Demo Candlestick State
interface DemoCandle {
  open: number;
  high: number;
  low: number;
  close: number;
}

const currentPrice = ref(68450.0);
const baseClose = 65000.0;
const trendBias = ref(0.0);
const candles = ref<DemoCandle[]>([]);
const flashMessage = ref<{ text: string; isGreen: boolean } | null>(null);
let timerId: ReturnType<typeof setInterval> | null = null;

// Initialize candles
let p = currentPrice.value * 0.95;
for (let i = 25; i >= 0; i--) {
  const delta = (Math.random() - 0.48) * (p * 0.015);
  const close = p + delta;
  const high = Math.max(p, close) * (1 + Math.random() * 0.006);
  const low = Math.min(p, close) * (1 - Math.random() * 0.006);
  candles.value.push({ open: p, high, low, close });
  p = close;
}
currentPrice.value = p;

function triggerPump(magnitude = 0.05) {
  currentPrice.value = Math.round(currentPrice.value * (1 + magnitude) * 100) / 100;
  trendBias.value += 0.35;
  const last = candles.value[candles.value.length - 1];
  if (last) {
    last.close = currentPrice.value;
    last.high = Math.max(last.high, currentPrice.value);
  }
  playSynthPump();
  flashNotice(`PUMP INJECTED! +${(magnitude * 100).toFixed(0)}% -> $${currentPrice.value.toFixed(2)}`, true);
}

function triggerDump(magnitude = 0.05) {
  currentPrice.value = Math.max(1.0, Math.round(currentPrice.value * (1 - magnitude) * 100) / 100);
  trendBias.value -= 0.35;
  const last = candles.value[candles.value.length - 1];
  if (last) {
    last.close = currentPrice.value;
    last.low = Math.min(last.low, currentPrice.value);
  }
  playSynthDump();
  flashNotice(`DUMP INJECTED! -${(magnitude * 100).toFixed(0)}% -> $${currentPrice.value.toFixed(2)}`, false);
}

function flashNotice(text: string, isGreen: boolean) {
  flashMessage.value = { text, isGreen };
  setTimeout(() => {
    if (flashMessage.value?.text === text) flashMessage.value = null;
  }, 2500);
}

function handleGlobalKey(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G')) {
    e.preventDefault();
    triggerPump(0.05);
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R')) {
    e.preventDefault(); // Prevents browser refresh!
    triggerDump(0.05);
  }
  // Ctrl+Shift+C for stealth mode toggle
  if (e.ctrlKey && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
    e.preventDefault();
    store.creatorStealthMode = !store.creatorStealthMode;
  }

  if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G')) {
    e.preventDefault();
    triggerPump(0.05);
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R')) {
    e.preventDefault(); // Prevents browser refresh!
    triggerDump(0.05);
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKey);
  timerId = setInterval(() => {
    const shock = (Math.random() - 0.49) * 0.008 + trendBias.value * 0.005;
    trendBias.value *= 0.9;
    currentPrice.value = Math.max(1.0, Math.round(currentPrice.value * (1 + shock) * 100) / 100);
    const last = candles.value[candles.value.length - 1];
    if (last) {
      last.close = currentPrice.value;
      last.high = Math.max(last.high, currentPrice.value);
      last.low = Math.min(last.low, currentPrice.value);
    }
  }, 1200);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKey);
  if (timerId) clearInterval(timerId);
});

// Chart SVG math computation
const chartStats = computed(() => {
  let min = Infinity;
  let max = -Infinity;
  candles.value.forEach((c) => {
    if (c.low < min) min = c.low;
    if (c.high > max) max = c.high;
  });
  const pad = (max - min) * 0.08;
  return { min: min - pad, max: max + pad, range: max - min + pad * 2 };
});

const svgWidth = 900;
const svgHeight = 320;
const padObj = { top: 20, right: 70, bottom: 25, left: 20 };

function getY(price: number): number {
  const innerH = svgHeight - padObj.top - padObj.bottom;
  return svgHeight - padObj.bottom - ((price - chartStats.value.min) / chartStats.value.range) * innerH;
}

const renderedCandles = computed(() => {
  const innerW = svgWidth - padObj.left - padObj.right;
  const step = innerW / Math.max(1, candles.value.length - 1);
  const candleW = Math.max(6, Math.min(22, step * 0.7));

  return candles.value.map((c, idx) => {
    const x = padObj.left + idx * step;
    const isBull = c.close >= c.open;
    const yHigh = getY(c.high);
    const yLow = getY(c.low);
    const yOpen = getY(c.open);
    const yClose = getY(c.close);
    const top = Math.min(yOpen, yClose);
    const bodyH = Math.max(2, Math.abs(yClose - yOpen));
    return { x, candleW, isBull, yHigh, yLow, top, bodyH };
  });
});

const priceLabels = computed(() => {
  const res: { price: number; y: number }[] = [];
  for (let i = 0; i <= 4; i++) {
    const p = chartStats.value.min + (chartStats.value.range / 4) * i;
    res.push({ price: p, y: getY(p) });
  }
  return res;
});

const change24hPct = computed(() => ((currentPrice.value - baseClose) / baseClose) * 100);

// Simple Icons Parody Asset Cards
const parodyList = [
  { ticker: 'BYTE', name: 'Bytecoin', parody: 'Bitcoin (BTC)', type: 'Crypto', price: '$68,450.00', icon: siBitcoin, color: '#f7931a' },
  { ticker: 'AETH', name: 'Aethereum', parody: 'Ethereum (ETH)', type: 'Crypto', price: '$3,620.00', icon: siEthereum, color: '#627eea' },
  { ticker: 'SOLA', name: 'Solona', parody: 'Solana (SOL)', type: 'Crypto', price: '$185.50', icon: siSolana, color: '#14f195' },
  { ticker: 'MEOW', name: 'MeowCoin', parody: 'Dogecoin (DOGE)', type: 'Crypto', price: '$0.1540', icon: siDogecoin, color: '#c2a633' },
  { ticker: 'USDF', name: 'USD-Fake', parody: 'Tether (USDT)', type: 'Crypto', price: '$1.0000', icon: siTether, color: '#26a17b' },
  { ticker: 'PEAR', name: 'Pear Inc.', parody: 'Apple (AAPL)', type: 'Stock', price: '$224.50', icon: siApple, color: '#a2aaad' },
  { ticker: 'MHD', name: 'MicroHard', parody: 'Microsoft (MSFT)', type: 'Stock', price: '$448.20', icon: siMicrosoft, color: '#00a4ef' },
  { ticker: 'TSLA-X', name: 'MuskCar', parody: 'Tesla (TSLA)', type: 'Stock', price: '$262.30', icon: siTesla, color: '#e82127' },
  { ticker: 'PIXL', name: 'Nvidiot', parody: 'Nvidia (NVDA)', type: 'Stock', price: '$132.80', icon: siNvidia, color: '#76b900' },
  { ticker: 'GOOG', name: 'Googol', parody: 'Alphabet (GOOG)', type: 'Stock', price: '$178.40', icon: siGoogle, color: '#4285f4' },
  { ticker: 'MATE', name: 'Mate', parody: 'Meta (META)', type: 'Stock', price: '$560.20', icon: siMeta, color: '#0668e1' },
];

// Tech stack badges using simple-icons
const techStack = [
  { icon: siVuedotjs, name: 'Vue 3', color: '#4fc08d' },
  { icon: siBun, name: 'Bun Runtime', color: '#fbf0df' },
  { icon: siRust, name: 'Rust Engine', color: '#dea584' },
  { icon: siTauri, name: 'Tauri v2', color: '#24c8d8' },
  { icon: siTailwindcss, name: 'Tailwind CSS', color: '#38b2ac' },
  { icon: siVite, name: 'Vite', color: '#646cff' },
  { icon: siTypescript, name: 'TypeScript', color: '#3178c6' },
  { icon: siGithub, name: 'GPL-3.0 FOSS', color: '#ffffff' },
];

const creatorPlatforms = [
  { icon: siYoutube, name: 'YouTube', color: '#ff0000' },
  { icon: siTwitch, name: 'Twitch', color: '#9146ff' },
  { icon: siTiktok, name: 'TikTok', color: '#00f2fe' },
  { icon: siDiscord, name: 'Discord', color: '#5865f2' },
];
</script>

<template>
  <div class="min-h-screen bg-terminal-bg text-terminal-text font-sans relative select-none selection:bg-cyber-blue selection:text-black">
    <!-- Cyber Background Grid -->
    <div class="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.08)_0%,transparent_60%)] pointer-events-none"></div>
    <div class="fixed inset-0 bg-[linear-gradient(rgba(31,41,61,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(31,41,61,0.2)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

    <!-- Live Ticker Tape Marquee -->
    <div class="bg-black/80 border-b border-terminal-border py-2 overflow-hidden whitespace-nowrap text-xs font-mono relative z-20">
      <div class="inline-block animate-[marquee_30s_linear_infinite]">
        <span class="text-cyber-green mr-8 font-bold">● BYTE $68,450.00 (+4.2%)</span>
        <span class="text-cyber-blue mr-8 font-bold">● PEAR $224.50 (+1.8%)</span>
        <span class="text-cyber-red mr-8 font-bold">● MEOW $0.1540 (-6.5%)</span>
        <span class="text-cyber-amber mr-8 font-bold">● TSLA-X $262.30 (+8.4%)</span>
        <span class="text-cyber-green mr-8 font-bold">● PIXL $132.80 (+12.6%)</span>
        <span class="text-cyber-blue mr-8 font-bold">● AETH $3,620.00 (+3.1%)</span>
        <span class="text-cyber-purple mr-8 font-bold">● MHD $448.20 (+0.9%)</span>
        <span class="text-cyber-green mr-8 font-bold">● BYTE $68,450.00 (+4.2%)</span>
        <span class="text-cyber-blue mr-8 font-bold">● PEAR $224.50 (+1.8%)</span>
        <span class="text-cyber-red mr-8 font-bold">● MEOW $0.1540 (-6.5%)</span>
      </div>
    </div>

    <!-- Navigation Bar -->
    <header class="sticky top-0 z-50 bg-terminal-bg/90 backdrop-blur-md border-b border-terminal-border">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <!-- Official Simange SVG Logo -->
        <a href="#" class="flex items-center space-x-3 text-white">
          <SimangeLogo :size="36" :showText="true" :glow="true" />
        </a>

        <!-- Nav Links -->
        <nav class="hidden md:flex items-center space-x-6 text-xs font-mono font-medium">
          <a href="#creator-mode" class="hover:text-cyber-amber transition">Creator Mode</a>
          <a href="#interactive-demo" class="hover:text-cyber-blue transition">Live Demo</a>
          <a href="#modes" class="hover:text-cyber-green transition">5 Game Modes</a>
          <a href="#parody-assets" class="hover:text-white transition">17 Assets</a>
          <a href="#tech-stack" class="hover:text-cyber-purple transition">Tech Stack</a>
          <a href="#quickstart" class="hover:text-white transition">Quickstart</a>
        </nav>

        <!-- Right Action Buttons -->
        <div class="flex items-center space-x-3 font-mono text-xs">
          <button
            @click="sfxEnabled = !sfxEnabled"
            class="px-2.5 py-1 rounded bg-terminal-surface border border-terminal-border hover:border-terminal-highlight text-terminal-muted hover:text-white transition text-[11px]"
          >
            SFX: {{ sfxEnabled ? 'ON 🔊' : 'OFF 🔇' }}
          </button>
          <a
            href="/"
            class="px-4 py-2 rounded-lg bg-cyber-blue text-black font-bold hover:bg-cyber-blue/90 transition shadow-glow-blue"
          >
            Launch Terminal →
          </a>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center relative z-10 space-y-6">
      <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-blue/15 border border-cyber-blue/40 text-cyber-blue text-xs font-mono font-semibold shadow-glow-blue">
        <span class="w-2 h-2 rounded-full bg-cyber-blue animate-ping"></span>
        <span>HIGH-FREQUENCY TRADING TERMINAL // VUE 3 + TAURI V2 + BUN</span>
      </div>

      <div class="space-y-3">
        <h1 class="text-4xl md:text-6xl font-black text-white font-mono tracking-tight leading-tight">
          Simulate Market Chaos.<br />
          <span class="text-cyber-blue drop-shadow-[0_0_35px_rgba(0,229,255,0.4)]">Control The Candlesticks.</span>
        </h1>
        <p class="text-sm md:text-base text-terminal-muted max-w-2xl mx-auto leading-relaxed">
          <strong>Simange</strong> is an open-source cyberpunk financial exchange terminal game. Experience stochastic brownian motion, order book depth, corporate dividends, and the new <strong>Content Creator Mode</strong> with instant <code class="font-mono text-cyber-green font-bold">Ctrl + G</code> (Green Pump) and <code class="font-mono text-cyber-red font-bold">Ctrl + R</code> (Red Dump) market manipulation.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-center gap-3 flex-wrap font-mono text-xs pt-2">
        <a
          href="/"
          class="px-6 py-3.5 rounded-lg bg-cyber-blue text-black font-bold uppercase tracking-wider hover:bg-cyber-blue/90 transition shadow-glow-blue flex items-center space-x-2"
        >
          <span>PLAY IN BROWSER NOW</span>
          <span>→</span>
        </a>
        <a
          href="#creator-mode"
          class="px-5 py-3.5 rounded-lg bg-terminal-surface border border-cyber-amber text-cyber-amber font-bold uppercase tracking-wider hover:bg-cyber-amber hover:text-black transition shadow-glow-amber"
        >
          <span>🎥 CONTENT CREATOR MODE</span>
        </a>
        <a
          href="https://github.com/username/simange"
          target="_blank"
          class="px-5 py-3.5 rounded-lg bg-terminal-surface border border-terminal-border text-white font-semibold hover:border-terminal-highlight transition flex items-center space-x-2"
        >
          <SimpleIcon :icon="siGithub" :size="16" />
          <span>GITHUB (GPL-3.0)</span>
        </a>
      </div>

      <!-- Live Interactive Candlestick Chart (Vue Playground) -->
      <div id="interactive-demo" class="cyber-panel border-2 border-terminal-border rounded-xl shadow-2xl overflow-hidden mt-8 text-left">
        <!-- Simulator Header -->
        <div class="px-5 py-3.5 bg-terminal-panel border-b border-terminal-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div class="flex items-center space-x-3">
            <SimpleIcon :icon="siBitcoin" :size="24" color="#f7931a" />
            <div>
              <div class="font-bold text-white text-sm">BYTE / USD</div>
              <div class="text-[10px] text-terminal-muted">Bytecoin Decentralized Reserve</div>
            </div>
          </div>

          <div class="flex items-center space-x-5">
            <div>
              <span class="text-[10px] text-terminal-muted block">LIVE PRICE</span>
              <span class="font-bold text-base num-mono" :class="change24hPct >= 0 ? 'text-cyber-green' : 'text-cyber-red'">
                ${{ currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </span>
            </div>
            <div>
              <span class="text-[10px] text-terminal-muted block">24H CHANGE</span>
              <span class="font-bold text-sm num-mono" :class="change24hPct >= 0 ? 'text-cyber-green' : 'text-cyber-red'">
                {{ change24hPct >= 0 ? '+' : '' }}{{ change24hPct.toFixed(2) }}%
              </span>
            </div>
            <div class="px-2.5 py-1 rounded bg-cyber-red/20 border border-cyber-red text-cyber-red text-[10px] font-bold">
              REC ● CREATOR READY
            </div>
          </div>
        </div>

        <!-- SVG Candlestick Graphic -->
        <div class="bg-terminal-bg p-4 relative">
          <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" class="w-full h-72 overflow-visible" preserveAspectRatio="none">
            <!-- Grid lines -->
            <g v-for="grid in priceLabels" :key="grid.y">
              <line :x1="padObj.left" :y1="grid.y" :x2="svgWidth - padObj.right" :y2="grid.y" stroke="#1f293d" stroke-dasharray="3 3" />
              <text :x="svgWidth - padObj.right + 8" :y="grid.y + 4" fill="#64748b" font-size="10" font-family="monospace">
                ${{ grid.price.toFixed(2) }}
              </text>
            </g>

            <!-- Candlesticks -->
            <g v-for="(c, i) in renderedCandles" :key="i">
              <line :x1="c.x" :y1="c.yHigh" :x2="c.x" :y2="c.yLow" :stroke="c.isBull ? '#00f796' : '#ff3366'" stroke-width="1.5" />
              <rect :x="c.x - c.candleW / 2" :y="c.top" :width="c.candleW" :height="c.bodyH" :fill="c.isBull ? '#00f796' : '#ff3366'" rx="1" />
            </g>
          </svg>

          <!-- Toast Flash Overlay -->
          <transition name="fade">
            <div
              v-if="flashMessage"
              class="absolute top-4 right-4 z-20 px-4 py-2 rounded-lg font-mono font-bold text-xs border shadow-lg backdrop-blur-md"
              :class="flashMessage.isGreen ? 'bg-terminal-panel/90 border-cyber-green text-cyber-green shadow-glow-green' : 'bg-terminal-panel/90 border-cyber-red text-cyber-red shadow-glow-red'"
            >
              <span>{{ flashMessage.isGreen ? '🚀' : '📉' }} {{ flashMessage.text }}</span>
            </div>
          </transition>
        </div>

        <!-- Simulator Interactive Controls -->
        <div class="px-5 py-3.5 bg-terminal-panel border-t border-terminal-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div class="flex items-center space-x-2 flex-wrap">
            <button
              @click="triggerPump(0.05)"
              class="px-4 py-2 rounded bg-cyber-green text-black font-bold hover:bg-cyber-green/90 transition shadow-glow-green flex items-center space-x-1.5"
            >
              <span>🟢 PUMP GREEN</span>
              <span class="text-[10px] opacity-80">[Ctrl + G]</span>
            </button>

            <button
              @click="triggerDump(0.05)"
              class="px-4 py-2 rounded bg-cyber-red text-black font-bold hover:bg-cyber-red/90 transition shadow-glow-red flex items-center space-x-1.5"
            >
              <span>🔴 DUMP RED</span>
              <span class="text-[10px] opacity-80">[Ctrl + R]</span>
            </button>

            <span class="text-terminal-border">|</span>

            <button
              @click="triggerPump(0.20)"
              class="px-3 py-1.5 rounded bg-terminal-surface border border-cyber-green/40 text-cyber-green hover:bg-cyber-green/10 transition"
            >
              🚀 Moon (+20%)
            </button>
            <button
              @click="triggerDump(0.20)"
              class="px-3 py-1.5 rounded bg-terminal-surface border border-cyber-red/40 text-cyber-red hover:bg-cyber-red/10 transition"
            >
              💥 Rug Pull (-20%)
            </button>
          </div>

          <div class="text-terminal-muted text-[11px]">
            Try pressing <span class="text-cyber-green font-bold">Ctrl + G</span> or <span class="text-cyber-red font-bold">Ctrl + R</span> on your keyboard right now!
          </div>
        </div>
      </div>
    </section>

    <!-- CONTENT CREATOR MODE SHOWCASE SECTION -->
    <section id="creator-mode" class="py-16 bg-black/50 border-t border-b border-terminal-border relative z-10">
      <div class="max-w-6xl mx-auto px-6 space-y-8">
        <div class="flex items-center space-x-3">
          <span class="w-3 h-3 rounded-full bg-cyber-red animate-pulse"></span>
          <span class="px-2.5 py-0.5 rounded bg-cyber-amber/20 border border-cyber-amber text-cyber-amber font-mono font-bold text-xs uppercase">
            FLAGSHIP NEW FEATURE
          </span>
          <span class="text-xs font-mono text-terminal-muted uppercase">Designed for Livestreamers & Creators</span>
        </div>

        <div class="space-y-3">
          <h2 class="text-3xl md:text-4xl font-black text-white font-mono">
            CONTENT CREATOR MODE
          </h2>
          <p class="text-sm text-terminal-muted max-w-2xl leading-relaxed">
            Content Creator Mode is now a first-class Game Mode in Simange! Choose whether to run in <strong>Stock Exchange Mode</strong> (12 equities) or <strong>Cryptocurrency Mode</strong> (5 cryptos), and control price action on command without relying on random market drift.
          </p>
        </div>

        <!-- 3 Feature Highlight Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          <div class="cyber-panel p-6 rounded-xl border border-cyber-green space-y-3 shadow-glow-green bg-terminal-surface/40">
            <div class="text-2xl">📈</div>
            <div class="text-xs font-bold text-cyber-green uppercase">Ctrl + G // GREEN BULL PUMP</div>
            <h3 class="text-lg font-bold text-white font-sans">Instant Bullish Momentum</h3>
            <p class="text-xs text-terminal-muted leading-relaxed font-sans">
              Instantly rockets the selected asset upward (+5% to +50%). Injects positive trend bias, buying depth, and energetic synthesized arpeggios for dramatic trade prediction reveals.
            </p>
          </div>

          <div class="cyber-panel p-6 rounded-xl border border-cyber-red space-y-3 shadow-glow-red bg-terminal-surface/40">
            <div class="text-2xl">📉</div>
            <div class="text-xs font-bold text-cyber-red uppercase">Ctrl + R // RED BEAR DUMP</div>
            <h3 class="text-lg font-bold text-white font-sans">Instant Flash Crash</h3>
            <p class="text-xs text-terminal-muted leading-relaxed font-sans">
              Plunges the stock into an immediate freefall (-5% to -50%). Automatic <code class="text-white bg-black px-1 rounded">preventDefault()</code> guarantees your recording window never reloads while streaming.
            </p>
          </div>

          <div class="cyber-panel p-6 rounded-xl border border-cyber-amber space-y-3 shadow-glow-amber bg-terminal-surface/40">
            <div class="text-2xl">🕶️</div>
            <div class="text-xs font-bold text-cyber-amber uppercase">Ctrl + Shift + C // STEALTH HUD</div>
            <h3 class="text-lg font-bold text-white font-sans">Clean Stream Capture</h3>
            <p class="text-xs text-terminal-muted leading-relaxed font-sans">
              Toggle the on-screen creator dock off so your viewers see an authentic, clean trading desk while your keyboard hotkeys remain fully armed and active in the background.
            </p>
          </div>
        </div>

        <!-- Creator Platforms Supported -->
        <div class="cyber-panel p-5 rounded-xl border border-terminal-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <span class="text-terminal-muted">COMPATIBLE STREAMING PLATFORMS:</span>
          <div class="flex items-center space-x-6">
            <div v-for="p in creatorPlatforms" :key="p.name" class="flex items-center space-x-2 text-white">
              <SimpleIcon :icon="p.icon" :size="18" :color="p.color" />
              <span>{{ p.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FIVE GAME MODES SECTION -->
    <section id="modes" class="py-16 max-w-6xl mx-auto px-6 space-y-8 relative z-10">
      <div class="space-y-2">
        <h2 class="text-3xl font-black text-white font-mono">FIVE STRATEGIC GAME MODES</h2>
        <p class="text-sm text-terminal-muted max-w-xl">
          From slow macroeconomic corporate equity trading to high-octane 24/7 meme coin hyper-volatility.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-mono text-xs">
        <!-- 1. Stock Exchange Mode -->
        <div class="cyber-panel p-5 rounded-xl border border-cyber-blue space-y-2">
          <div class="flex justify-between items-center text-cyber-blue font-bold">
            <span class="text-sm font-sans font-bold">Stock Exchange Mode</span>
            <span>12 STOCKS</span>
          </div>
          <p class="text-terminal-muted text-[11px] font-sans leading-relaxed">
            Trade Pear, MicroHard, MuskCar, Nvidiot, Googol, Mate, XennonMobile, Sergei Manly, Baeing, CCN, American Bank & Boreclay. Slower macro pace, earnings reports, quarterly dividends.
          </p>
          <div class="text-[10px] text-terminal-muted pt-2 border-t border-terminal-border">Starting Cash: $25,000</div>
        </div>

        <!-- 2. Cryptocurrency Mode -->
        <div class="cyber-panel p-5 rounded-xl border border-cyber-amber space-y-2">
          <div class="flex justify-between items-center text-cyber-amber font-bold">
            <span class="text-sm font-sans font-bold">Cryptocurrency Mode</span>
            <span>5 CRYPTOS</span>
          </div>
          <p class="text-terminal-muted text-[11px] font-sans leading-relaxed">
            24/7 hyper-volatility. Trade Bytecoin, Aethereum, Solona, MeowCoin & USD-Fake. Driven by social media pump & dump FUD alerts and liquidation spirals.
          </p>
          <div class="text-[10px] text-terminal-muted pt-2 border-t border-terminal-border">Starting Cash: $10,000</div>
        </div>

        <!-- 3. Test Mode -->
        <div class="cyber-panel p-5 rounded-xl border border-cyber-green space-y-2">
          <div class="flex justify-between items-center text-cyber-green font-bold">
            <span class="text-sm font-sans font-bold">Test Mode (Sandbox)</span>
            <span>ALL 17 ASSETS</span>
          </div>
          <p class="text-terminal-muted text-[11px] font-sans leading-relaxed">
            Unlimited cash ($100,000,000). All cryptos and all 12 corporate stocks active simultaneously. Fast-forward up to 5x for rapid algorithmic testing.
          </p>
          <div class="text-[10px] text-terminal-muted pt-2 border-t border-terminal-border">Starting Cash: $100M (Infinite)</div>
        </div>

        <!-- 4. Custom Mode -->
        <div class="cyber-panel p-5 rounded-xl border border-terminal-border space-y-2">
          <div class="flex justify-between items-center text-white font-bold">
            <span class="text-sm font-sans font-bold">Custom Mode</span>
            <span>CONFIGURABLE</span>
          </div>
          <p class="text-terminal-muted text-[11px] font-sans leading-relaxed">
            Configure your own starting balance ($1K - $1M), adjust volatility multipliers (0.2x - 5.0x), and toggle specific active assets on the terminal.
          </p>
          <div class="text-[10px] text-terminal-muted pt-2 border-t border-terminal-border">Fully Configurable</div>
        </div>

        <!-- 5. Content Creator Mode (Full width on 2-col) -->
        <div class="cyber-panel p-5 rounded-xl border-2 border-cyber-amber bg-cyber-amber/5 space-y-2 col-span-1 md:col-span-2 shadow-glow-amber">
          <div class="flex justify-between items-center text-cyber-amber font-bold">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-cyber-red animate-pulse"></span>
              <span class="text-sm font-sans font-bold text-white">Content Creator Mode</span>
              <span class="px-1.5 py-0.2 rounded bg-cyber-red text-white text-[9px] font-black">REC ● NEW</span>
            </div>
            <span>STOCKS OR CRYPTO</span>
          </div>
          <p class="text-terminal-text text-[11px] font-sans leading-relaxed">
            Choose whether to direct corporate equities or meme cryptocurrencies. Features infinite liquidity ($1M starting), on-screen streamer dock, stealth capture mode, and real-time market manipulation hotkeys (<strong class="text-cyber-green font-mono">Ctrl+G</strong> for Green pump, <strong class="text-cyber-red font-mono">Ctrl+R</strong> for Red dump).
          </p>
          <div class="flex justify-between text-[10px] text-terminal-muted pt-2 border-t border-terminal-border/60">
            <span>Special: Real-Time Candlestick Director Controls</span>
            <span class="text-cyber-amber font-bold">Choose Market Universe upon launch →</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 17 PARODY ASSETS DIRECTORY (WITH SIMPLE ICONS) -->
    <section id="parody-assets" class="py-16 bg-black/40 border-t border-b border-terminal-border relative z-10">
      <div class="max-w-6xl mx-auto px-6 space-y-8">
        <div class="space-y-2">
          <h2 class="text-3xl font-black text-white font-mono">17 PARODY ASSETS WITH SIMPLE ICONS</h2>
          <p class="text-sm text-terminal-muted max-w-xl">
            Satirical parody assets based on the world's most recognizable cryptocurrencies and tech conglomerates.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div
            v-for="asset in parodyList"
            :key="asset.ticker"
            class="cyber-panel p-4 rounded-xl border border-terminal-border hover:border-cyber-blue transition space-y-2 group"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2.5">
                <SimpleIcon :icon="asset.icon" :size="20" :color="asset.color" />
                <span class="font-bold text-white group-hover:text-cyber-blue text-sm">{{ asset.ticker }}</span>
              </div>
              <span
                class="text-[9px] px-1.5 py-0.5 rounded uppercase font-bold"
                :class="asset.type === 'Crypto' ? 'bg-cyber-blue/15 text-cyber-blue border border-cyber-blue/30' : 'bg-cyber-green/15 text-cyber-green border border-cyber-green/30'"
              >
                {{ asset.type }}
              </span>
            </div>
            <div class="text-[11px] text-white font-bold">{{ asset.name }}</div>
            <div class="text-[10px] text-terminal-muted italic">Parody of {{ asset.parody }}</div>
            <div class="text-xs font-bold text-cyber-green pt-1 border-t border-terminal-border">
              {{ asset.price }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TECH STACK (FEATURING SIMPLE ICONS) -->
    <section id="tech-stack" class="py-16 max-w-6xl mx-auto px-6 space-y-8 relative z-10">
      <div class="space-y-2">
        <h2 class="text-3xl font-black text-white font-mono">POWERED BY OPEN-SOURCE TECH</h2>
        <p class="text-sm text-terminal-muted max-w-xl">
          Built using modern, high-efficiency tools with zero bloat and sub-millisecond execution.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div
          v-for="tech in techStack"
          :key="tech.name"
          class="cyber-panel p-4 rounded-xl border border-terminal-border flex items-center space-x-3 hover:border-cyber-blue transition"
        >
          <SimpleIcon :icon="tech.icon" :size="24" :color="tech.color" />
          <span class="font-bold text-white">{{ tech.name }}</span>
        </div>
      </div>
    </section>

    <!-- QUICKSTART & DOWNLOAD SECTION -->
    <section id="quickstart" class="py-16 bg-black/60 border-t border-terminal-border relative z-10 text-center font-mono">
      <div class="max-w-3xl mx-auto px-6 space-y-6">
        <h2 class="text-3xl font-black text-white">GET STARTED WITH BUN</h2>
        <p class="text-xs text-terminal-muted max-w-lg mx-auto">
          Clone the repository and launch Simange locally in seconds.
        </p>

        <div class="cyber-panel p-5 rounded-xl border border-terminal-border text-left text-xs space-y-3 bg-terminal-bg">
          <div class="text-terminal-muted"># 1. Clone & install with Bun:</div>
          <div class="text-cyber-cyan font-bold select-all">git clone https://github.com/username/simange.git &amp;&amp; cd simange &amp;&amp; bun install</div>

          <div class="text-terminal-muted"># 2. Launch web development preview:</div>
          <div class="text-cyber-green font-bold select-all">bun run dev</div>

          <div class="text-terminal-muted"># 3. Launch desktop app with Tauri v2:</div>
          <div class="text-cyber-amber font-bold select-all">bun run tauri dev</div>
        </div>

        <div class="flex items-center justify-center gap-4 pt-2">
          <a
            href="/"
            class="px-6 py-3 rounded-lg bg-cyber-blue text-black font-bold text-xs uppercase tracking-wider hover:bg-cyber-blue/90 transition shadow-glow-blue"
          >
            Launch Browser Terminal
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-terminal-border py-8 bg-black text-center font-mono text-xs text-terminal-muted relative z-10 space-y-2">
      <div class="flex items-center justify-center space-x-2">
        <SimangeLogo :size="20" :showText="false" />
        <span class="text-white font-bold">SIMANGE // Simulation of Exchange</span>
      </div>
      <p>Free &amp; Open Source Software licensed under GNU General Public License v3.0 (GPL-3.0).</p>
      <p class="text-[10px]">All equity tickers, names, and personas are fictional satirical parodies. Not financial advice.</p>
    </footer>
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
