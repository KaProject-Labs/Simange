<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { useAuthStore } from '../stores/authStore';
import * as simpleIcons from 'simple-icons';
import SimangeLogo from '../components/SimangeLogo.vue';
import SimpleIcon from '../components/SimpleIcon.vue';
import PrototypeLoginModal from '../components/PrototypeLoginModal.vue';
import SettingsModal from '../components/SettingsModal.vue';
import {
  IconArrowUpRight,
  IconLock,
  IconUser,
  IconVolume,
  IconVolumeOff,
  IconBrandGithub,
  IconPlayerPlay,
  IconLogout,
} from '@tabler/icons-vue';

const {
  siBitcoin,
  siEthereum,
  siSolana,
  siDogecoin,
  siTether,
  siApple,
  siMicrosoft,
  siTesla,
  siNvidia,
  siGoogle,
  siMeta,
  siVuedotjs,
  siBun,
  siRust,
  siTauri,
  siTailwindcss,
  siVite,
  siTypescript,
  siGithub,
} = simpleIcons as any;

const store = useGameStore();
const authStore = useAuthStore();

// Audio Synthesizer for Website
const sfxEnabled = ref(true);
let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
}

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.overflowY = 'auto';
    document.body.style.overflowY = 'auto';
    document.body.style.height = 'auto';
  }
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
    const height = Math.max(2, Math.abs(yClose - yOpen));

    return {
      x,
      candleW,
      isBull,
      yHigh,
      yLow,
      top,
      height,
    };
  });
});

const priceChangePercent = computed(() => {
  const pct = ((currentPrice.value - baseClose) / baseClose) * 100;
  return pct.toFixed(2);
});

// Parody Assets Catalog
const parodyList = [
  { ticker: 'BYTE', name: 'Bytecoin', type: 'Crypto', parody: 'Bitcoin (BTC)', price: '$68,450.00', icon: siBitcoin, color: '#F7931A' },
  { ticker: 'AETH', name: 'Aethereum', type: 'Crypto', parody: 'Ethereum (ETH)', price: '$2,740.00', icon: siEthereum, color: '#627EEA' },
  { ticker: 'SOLA', name: 'Solona', type: 'Crypto', parody: 'Solana (SOL)', price: '$178.50', icon: siSolana, color: '#14F195' },
  { ticker: 'MEOW', name: 'MeowCoin', type: 'Crypto', parody: 'Dogecoin (DOGE)', price: '$0.158', icon: siDogecoin, color: '#C2A633' },
  { ticker: 'USDF', name: 'USD-Fake', type: 'Crypto', parody: 'Tether (USDT)', price: '$1.000', icon: siTether, color: '#26A17B' },
  { ticker: 'PEAR', name: 'Pear Inc.', type: 'Stock', parody: 'Apple (AAPL)', price: '$224.50', icon: siApple, color: '#A2AAAD' },
  { ticker: 'MHD', name: 'MicroHard', type: 'Stock', parody: 'Microsoft (MSFT)', price: '$418.00', icon: siMicrosoft, color: '#00A4EF' },
  { ticker: 'TSLA-X', name: 'MuskCar', type: 'Stock', parody: 'Tesla (TSLA)', price: '$262.30', icon: siTesla, color: '#E82127' },
  { ticker: 'PIXL', name: 'Nvidiot', type: 'Stock', parody: 'Nvidia (NVDA)', price: '$132.80', icon: siNvidia, color: '#76B900' },
  { ticker: 'GOOG', name: 'Googol', type: 'Stock', parody: 'Google Alphabet', price: '$178.40', icon: siGoogle, color: '#4285F4' },
  { ticker: 'MATE', name: 'Mate Corp', type: 'Stock', parody: 'Meta Platforms', price: '$582.10', icon: siMeta, color: '#0668E1' },
];

// Open Source Tech Stack
const techStack = [
  { name: 'Vue 3.5', icon: siVuedotjs, color: '#42B883' },
  { name: 'Tauri v2', icon: siTauri, color: '#24C8D8' },
  { name: 'Rust Engine', icon: siRust, color: '#DEA584' },
  { name: 'Bun Runtime', icon: siBun, color: '#FBF0DF' },
  { name: 'Tailwind CSS', icon: siTailwindcss, color: '#06B6D4' },
  { name: 'Vite', icon: siVite, color: '#646CFF' },
  { name: 'TypeScript', icon: siTypescript, color: '#3178C6' },
  { name: 'GitHub Actions', icon: siGithub, color: '#FFFFFF' },
];

function openSettings(_tab?: string) {
  store.showSettingsModal = true;
}
</script>

<template>
  <div class="min-h-screen bg-terminal-bg text-terminal-text font-sans antialiased selection:bg-cyber-blue selection:text-black">
    <!-- PROTOTYPE LOGIN MODAL COMPONENT -->
    <PrototypeLoginModal />

    <!-- SYSTEM SETTINGS & LEGAL MODAL COMPONENT -->
    <SettingsModal />

    <!-- Ambient Glowing Grid Background -->
    <div class="fixed inset-0 bg-[radial-gradient(#1a263d_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none"></div>
    <div class="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-cyber-blue/10 blur-[130px] rounded-full pointer-events-none"></div>

    <!-- Navigation Header -->
    <header class="sticky top-0 z-40 backdrop-blur-md bg-terminal-panel/85 border-b border-terminal-border">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <!-- Brand Logo -->
        <a href="/" class="flex items-center space-x-3 group">
          <SimangeLogo :size="30" :showText="false" :glow="true" />
          <div class="flex flex-col">
            <span class="text-base font-black tracking-widest text-white group-hover:text-cyber-blue transition font-mono">
              SIMANGE
            </span>
            <span class="text-[9px] text-cyber-blue font-mono tracking-wider -mt-1 font-bold">
              KAPROJECT LABS
            </span>
          </div>
        </a>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center space-x-6 text-xs font-mono font-semibold">
          <a href="#live-demo" class="text-terminal-muted hover:text-white transition">Market Demo</a>
          <a href="#parody-assets" class="text-terminal-muted hover:text-white transition">17 Parody Tickers</a>
          <a href="#creator-mode" class="text-terminal-muted hover:text-cyber-amber transition flex items-center space-x-1">
            <span class="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse"></span>
            <span>Creator Mode</span>
          </a>
          <a href="#tech-stack" class="text-terminal-muted hover:text-white transition">Tech Stack</a>
          <a href="#quickstart" class="text-terminal-muted hover:text-white transition">Quickstart</a>
        </nav>

        <!-- Right Action Items: Prototype Login & GitHub -->
        <div class="flex items-center space-x-3 text-xs font-mono">
          <!-- Audio Synthesizer Toggle -->
          <button
            @click="sfxEnabled = !sfxEnabled"
            class="p-2 rounded-lg bg-terminal-surface border border-terminal-border text-terminal-muted hover:text-white transition"
            :title="sfxEnabled ? 'Mute Web Audio Synth' : 'Enable Web Audio Synth'"
          >
            <IconVolume v-if="sfxEnabled" :size="15" class="text-cyber-blue" />
            <IconVolumeOff v-else :size="15" />
          </button>

          <!-- PROTOTYPE LOGIN / USER ACCOUNT BUTTON -->
          <template v-if="authStore.isAuthenticated">
            <div
              class="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-cyber-blue/15 border border-cyber-blue/50 text-white transition shadow-glow-blue cursor-pointer group"
              @click="authStore.openLoginModal('signin')"
            >
              <span class="text-base">{{ authStore.currentUser?.avatar }}</span>
              <div class="flex flex-col text-left">
                <span class="font-bold text-cyber-blue leading-tight truncate max-w-[110px]">
                  {{ authStore.displayName }}
                </span>
                <span class="text-[9px] text-terminal-muted leading-tight">
                  ${{ authStore.balance.toLocaleString() }}
                </span>
              </div>
              <button
                @click.stop="authStore.signOut()"
                class="ml-1 p-1 rounded hover:bg-cyber-red/20 text-terminal-muted hover:text-cyber-red transition"
                title="Sign Out"
              >
                <IconLogout :size="13" />
              </button>
            </div>
          </template>

          <template v-else>
            <button
              @click="authStore.openLoginModal('signin')"
              class="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-terminal-surface border border-cyber-cyan/50 text-cyber-cyan font-bold hover:bg-cyber-cyan hover:text-black transition shadow-glow-cyan text-xs"
            >
              <IconLock :size="13" />
              <span>LOGIN (PROTOTYPE)</span>
            </button>
          </template>

          <!-- GitHub Repo Link -->
          <a
            href="https://github.com/KaProject-Labs/Simange"
            target="_blank"
            class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-terminal-surface border border-terminal-border hover:border-white text-white transition text-xs"
          >
            <IconBrandGithub :size="15" />
            <span class="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative pt-20 pb-16 max-w-7xl mx-auto px-6 text-center space-y-6">
      <!-- High-Tech Sovereign Tag -->
      <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue text-xs font-mono font-semibold tracking-wider shadow-glow-blue">
        <span class="w-2 h-2 rounded-full bg-cyber-green animate-ping"></span>
        <span>KAPROJECT LABS // FOSS FINANCIAL TRADING SIMULATOR</span>
      </div>

      <h1 class="text-5xl md:text-7xl font-black tracking-tight text-white font-mono drop-shadow-[0_0_40px_rgba(0,229,255,0.35)]">
        SIMULATION OF EXCHANGE
      </h1>

      <p class="max-w-2xl mx-auto text-base text-terminal-muted leading-relaxed font-sans">
        A high-frequency desktop trading terminal game modeling stochastic random walks, dynamic order books, CEO meme shocks, and content creator market overrides across 17 parody crypto and tech assets.
      </p>

      <!-- CTA Action Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-4 pt-3 font-mono text-xs">
        <a
          href="/"
          class="px-6 py-3.5 rounded-lg bg-cyber-blue text-black font-bold uppercase tracking-wider hover:bg-cyber-blue/90 transition shadow-glow-blue flex items-center space-x-2"
        >
          <IconPlayerPlay :size="16" />
          <span>Launch Web Simulator</span>
        </a>

        <button
          @click="authStore.openLoginModal('signin')"
          class="px-5 py-3.5 rounded-lg cyber-panel border border-cyber-cyan text-cyber-cyan font-bold uppercase tracking-wider hover:bg-cyber-cyan/10 transition shadow-glow-cyan flex items-center space-x-2"
        >
          <IconUser :size="15" />
          <span>Try Prototype Login</span>
        </button>

        <a
          href="https://github.com/KaProject-Labs/Simange"
          target="_blank"
          class="px-5 py-3.5 rounded-lg cyber-panel border border-terminal-border hover:border-terminal-highlight text-white font-semibold uppercase tracking-wider transition flex items-center space-x-2"
        >
          <IconBrandGithub :size="16" />
          <span>KaProject-Labs/Simange</span>
          <IconArrowUpRight :size="14" class="text-terminal-muted" />
        </a>
      </div>

      <!-- Quick Highlights Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-8 font-mono text-xs text-left">
        <div class="cyber-panel p-3.5 rounded-lg border border-terminal-border">
          <div class="text-[10px] text-terminal-muted uppercase">ASSET UNIVERSE</div>
          <div class="text-sm font-bold text-white mt-0.5">17 Parody Tickers</div>
          <div class="text-[10px] text-cyber-blue">5 Cryptos • 12 Stocks</div>
        </div>

        <div class="cyber-panel p-3.5 rounded-lg border border-terminal-border">
          <div class="text-[10px] text-terminal-muted uppercase">MARKET ENGINE</div>
          <div class="text-sm font-bold text-white mt-0.5">Sub-MS Limit Books</div>
          <div class="text-[10px] text-cyber-green">Jump-Diffusion Stochastic</div>
        </div>

        <div class="cyber-panel p-3.5 rounded-lg border border-cyber-amber/50 bg-cyber-amber/5">
          <div class="text-[10px] text-cyber-amber uppercase font-bold">CREATOR MODE</div>
          <div class="text-sm font-bold text-white mt-0.5">Default: Disabled</div>
          <div class="text-[10px] text-cyber-amber">Ctrl+G / Ctrl+R New Sessions</div>
        </div>

        <div class="cyber-panel p-3.5 rounded-lg border border-terminal-border">
          <div class="text-[10px] text-terminal-muted uppercase">OPEN SOURCE</div>
          <div class="text-sm font-bold text-white mt-0.5">GPL-3.0 License</div>
          <div class="text-[10px] text-terminal-muted">100% Client-Side Privacy</div>
        </div>
      </div>
    </section>

    <!-- LIVE INTERACTIVE MARKET TERMINAL DEMO -->
    <section id="live-demo" class="py-12 max-w-6xl mx-auto px-6 space-y-6 relative z-10">
      <div class="cyber-panel border-2 border-cyber-blue rounded-xl p-6 shadow-glow-blue bg-terminal-panel/90 space-y-5">
        <!-- Interactive Chart Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-terminal-border pb-4">
          <div class="flex items-center space-x-3 font-mono">
            <SimpleIcon :icon="siBitcoin" :size="28" color="#F7931A" />
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xl font-bold text-white">BYTE // Bytecoin</span>
                <span class="text-xs px-2 py-0.5 rounded bg-cyber-blue/15 text-cyber-blue border border-cyber-blue/40 font-bold">
                  LIVE INTERACTIVE DEMO
                </span>
              </div>
              <div class="text-xs text-terminal-muted">
                Genesis Block Parody Digital Gold • Real-time Stochastic Simulation
              </div>
            </div>
          </div>

          <!-- Price & Performance Metrics -->
          <div class="flex items-center space-x-6 font-mono text-right">
            <div>
              <span class="text-[10px] text-terminal-muted block">CURRENT PRICE</span>
              <span class="text-2xl font-black text-white num-mono">
                ${{ currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </span>
            </div>
            <div>
              <span class="text-[10px] text-terminal-muted block">SESSION CHANGE</span>
              <span
                :class="Number(priceChangePercent) >= 0 ? 'text-cyber-green' : 'text-cyber-red'"
                class="text-base font-bold num-mono"
              >
                {{ Number(priceChangePercent) >= 0 ? '+' : '' }}{{ priceChangePercent }}%
              </span>
            </div>
          </div>
        </div>

        <!-- SVG Candlestick Chart Viewport -->
        <div class="relative w-full h-[320px] bg-terminal-bg rounded-lg border border-terminal-border overflow-hidden select-none">
          <!-- Notification Shockwave Badge -->
          <transition name="fade">
            <div
              v-if="flashMessage"
              class="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-md font-mono text-xs font-bold border shadow-xl flex items-center space-x-2"
              :class="flashMessage.isGreen ? 'bg-terminal-panel border-cyber-green text-cyber-green shadow-glow-green' : 'bg-terminal-panel border-cyber-red text-cyber-red shadow-glow-red'"
            >
              <span>{{ flashMessage.isGreen ? '🚀' : '📉' }}</span>
              <span>{{ flashMessage.text }}</span>
            </div>
          </transition>

          <!-- SVG Candlesticks -->
          <svg :viewBox="`0 0 ${svgWidth} ${svgHeight}`" preserveAspectRatio="none" class="w-full h-full">
            <!-- Grid Lines -->
            <line
              v-for="i in 5"
              :key="i"
              :x1="padObj.left"
              :y1="padObj.top + ((svgHeight - padObj.top - padObj.bottom) / 4) * (i - 1)"
              :x2="svgWidth - padObj.right"
              :y2="padObj.top + ((svgHeight - padObj.top - padObj.bottom) / 4) * (i - 1)"
              stroke="#1a2538"
              stroke-width="1"
              stroke-dasharray="3,3"
            />

            <!-- Candlesticks -->
            <g v-for="(c, idx) in renderedCandles" :key="idx">
              <!-- Wick -->
              <line
                :x1="c.x + c.candleW / 2"
                :y1="c.yHigh"
                :x2="c.x + c.candleW / 2"
                :y2="c.yLow"
                :stroke="c.isBull ? '#00f796' : '#ff3366'"
                stroke-width="1.5"
              />
              <!-- Body -->
              <rect
                :x="c.x"
                :y="c.top"
                :width="c.candleW"
                :height="c.height"
                :fill="c.isBull ? '#00f796' : '#ff3366'"
                :stroke="c.isBull ? '#00f796' : '#ff3366'"
                stroke-width="1"
                rx="1"
              />
            </g>
          </svg>
        </div>

        <!-- Interactive Control Console (Pump & Dump Controls) -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-2 font-mono text-xs">
          <div class="flex items-center space-x-2 text-terminal-muted">
            <span class="text-cyber-blue font-bold">HOTKEYS:</span>
            <span class="px-2 py-0.5 rounded bg-terminal-surface text-white border border-terminal-border">Ctrl + G (Pump)</span>
            <span class="px-2 py-0.5 rounded bg-terminal-surface text-white border border-terminal-border">Ctrl + R (Dump)</span>
          </div>

          <div class="flex items-center space-x-3">
            <button
              @click="triggerPump(0.05)"
              class="px-4 py-2 rounded-lg bg-cyber-green text-black font-bold uppercase hover:bg-cyber-green/90 transition shadow-glow-green flex items-center space-x-1.5"
            >
              <span>🟢</span>
              <span>INJECT BULL PUMP (+5%)</span>
            </button>

            <button
              @click="triggerDump(0.05)"
              class="px-4 py-2 rounded-lg bg-cyber-red text-white font-bold uppercase hover:bg-cyber-red/90 transition shadow-glow-red flex items-center space-x-1.5"
            >
              <span>🔴</span>
              <span>INJECT BEAR DUMP (-5%)</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTENT CREATOR MODE EXPLAINER & ARCHITECTURE -->
    <section id="creator-mode" class="py-16 max-w-6xl mx-auto px-6 space-y-8 relative z-10 font-mono">
      <div class="cyber-panel p-8 rounded-2xl border-2 border-cyber-amber bg-black/60 shadow-glow-amber space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-terminal-border pb-4">
          <div class="flex items-center space-x-3">
            <span class="w-4 h-4 rounded-full bg-cyber-red animate-pulse"></span>
            <div>
              <h2 class="text-2xl font-black text-white">CONTENT CREATOR MODE ARCHITECTURE</h2>
              <p class="text-xs text-cyber-amber">Engineered for livestreamers, video creators &amp; interactive demos</p>
            </div>
          </div>
          <span class="text-xs px-3 py-1 rounded bg-terminal-surface text-white border border-cyber-amber font-bold">
            DEFAULT SETTING: DISABLED
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-300 leading-relaxed">
          <div class="space-y-2 cyber-panel p-4 rounded-xl border border-terminal-border bg-terminal-surface/40">
            <h3 class="font-bold text-white text-sm flex items-center space-x-1.5">
              <span>🛡️</span>
              <span>Isolated Simulation Sessions</span>
            </h3>
            <p>
              To protect organic market trading, Content Creator Mode is <strong class="text-white">Disabled in Default Setting</strong>. Attempting to activate Creator Mode prompts the creation of a <strong class="text-cyber-blue">Brand New Simulation Session</strong> so your normal gameplay stats and high scores remain uncompromised.
            </p>
          </div>

          <div class="space-y-2 cyber-panel p-4 rounded-xl border border-terminal-border bg-terminal-surface/40">
            <h3 class="font-bold text-white text-sm flex items-center space-x-1.5">
              <span>⚡</span>
              <span>Hotkeys &amp; Shockwaves</span>
            </h3>
            <p>
              Direct live market action with sub-millisecond precision. Use <strong class="text-cyber-green">Ctrl + G</strong> to force instant bullish pumps (+5% to +50%) and <strong class="text-cyber-red">Ctrl + R</strong> to trigger catastrophic market panic dumps (-5% to -50%).
            </p>
          </div>

          <div class="space-y-2 cyber-panel p-4 rounded-xl border border-terminal-border bg-terminal-surface/40">
            <h3 class="font-bold text-white text-sm flex items-center space-x-1.5">
              <span>🕶️</span>
              <span>Stealth Mode Dock (Ctrl+Shift+C)</span>
            </h3>
            <p>
              Hide all creator HUD controls and dock panels from screen recorders (OBS, Twitch, YouTube). Your market manipulation hotkeys continue functioning seamlessly in the background without viewer detection.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 17 PARODY ASSETS CATALOG -->
    <section id="parody-assets" class="py-16 max-w-6xl mx-auto px-6 space-y-8 relative z-10 font-mono">
      <div class="space-y-2">
        <h2 class="text-3xl font-black text-white">17 PARODY ASSETS WITH SIMPLE ICONS</h2>
        <p class="text-sm text-terminal-muted max-w-xl font-sans">
          Satirical parody equities and memetic cryptocurrencies modeled after the world's most recognizable assets.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
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
    </section>

    <!-- TECH STACK -->
    <section id="tech-stack" class="py-16 max-w-6xl mx-auto px-6 space-y-8 relative z-10 font-mono">
      <div class="space-y-2">
        <h2 class="text-3xl font-black text-white">POWERED BY OPEN-SOURCE TECH</h2>
        <p class="text-sm text-terminal-muted max-w-xl font-sans">
          Engineered by KaProject Labs with ultra-fast modern compilation and runtime primitives.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
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

    <!-- QUICKSTART & GITHUB SECTION -->
    <section id="quickstart" class="py-16 bg-black/60 border-t border-terminal-border relative z-10 text-center font-mono">
      <div class="max-w-3xl mx-auto px-6 space-y-6">
        <h2 class="text-3xl font-black text-white">GET STARTED IN SECONDS</h2>
        <p class="text-xs text-terminal-muted max-w-lg mx-auto font-sans">
          Clone the official repository from KaProject Labs and launch Simange locally with Bun.
        </p>

        <div class="cyber-panel p-5 rounded-xl border border-terminal-border text-left text-xs space-y-3 bg-terminal-bg">
          <div class="text-terminal-muted"># 1. Clone repository from KaProject Labs:</div>
          <div class="text-cyber-cyan font-bold select-all">git clone https://github.com/KaProject-Labs/Simange.git &amp;&amp; cd Simange</div>

          <div class="text-terminal-muted"># 2. Install dependencies with Bun:</div>
          <div class="text-cyber-blue font-bold select-all">bun install</div>

          <div class="text-terminal-muted"># 3. Launch browser development server:</div>
          <div class="text-cyber-green font-bold select-all">bun run dev</div>

          <div class="text-terminal-muted"># 4. Launch native desktop application with Tauri v2:</div>
          <div class="text-cyber-amber font-bold select-all">bun run tauri dev</div>
        </div>

        <div class="flex items-center justify-center gap-4 pt-2">
          <a
            href="/"
            class="px-6 py-3 rounded-lg bg-cyber-blue text-black font-bold text-xs uppercase tracking-wider hover:bg-cyber-blue/90 transition shadow-glow-blue"
          >
            Launch Trading Terminal
          </a>
          <a
            href="https://github.com/KaProject-Labs/Simange"
            target="_blank"
            class="px-6 py-3 rounded-lg cyber-panel border border-terminal-border text-white font-bold text-xs uppercase hover:border-white transition flex items-center space-x-1.5"
          >
            <IconBrandGithub :size="15" />
            <span>GitHub Repository</span>
          </a>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="border-t border-terminal-border py-10 bg-black font-mono text-xs text-terminal-muted relative z-10 space-y-4">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Logo & Copyright -->
        <div class="flex items-center space-x-3">
          <SimangeLogo :size="24" :showText="false" />
          <div class="text-left">
            <div class="text-white font-bold text-sm">SIMANGE // Simulation of Exchange</div>
            <div class="text-[11px] text-terminal-muted">
              Developed by <strong class="text-white">KaProject Labs</strong> • Copyright &copy; 2026 KaProject Labs. All rights reserved.
            </div>
          </div>
        </div>

        <!-- Legal Links -->
        <div class="flex flex-wrap items-center gap-4 text-[11px]">
          <button @click="openSettings('privacy')" class="hover:text-cyber-blue transition">Privacy Policy</button>
          <span>•</span>
          <button @click="openSettings('terms')" class="hover:text-cyber-blue transition">Terms of Service</button>
          <span>•</span>
          <button @click="openSettings('licenses')" class="hover:text-cyber-blue transition">Third-Party Licenses</button>
          <span>•</span>
          <button @click="openSettings('about')" class="hover:text-cyber-blue transition">About this Project</button>
          <span>•</span>
          <a href="https://github.com/KaProject-Labs/Simange" target="_blank" class="text-cyber-blue hover:underline">
            github.com/KaProject-Labs/Simange
          </a>
        </div>
      </div>

      <div class="text-center text-[10px] text-terminal-muted pt-2 border-t border-terminal-border/40">
        Free &amp; Open Source Software licensed under GNU General Public License v3.0 (GPL-3.0). All company tickers and tokens are satirical parody entities.
      </div>
    </footer>
  </div>
</template>

<style scoped>
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
