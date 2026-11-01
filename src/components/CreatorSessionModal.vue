<script setup lang="ts">
import { useGameStore } from '../stores/gameStore';
import AssetIcon from './AssetIcon.vue';

const store = useGameStore();

function handleStart(submode: 'StockExchange' | 'Cryptocurrency') {
  store.startCreatorSession(submode);
}

function handleClose() {
  store.showCreatorSessionModal = false;
}
</script>

<template>
  <div
    v-if="store.showCreatorSessionModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none"
  >
    <div class="max-w-xl w-full cyber-panel border-2 border-cyber-amber p-6 rounded-lg shadow-glow-amber space-y-5 animate-in fade-in duration-200">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-terminal-border pb-3">
        <div>
          <div class="text-xs font-mono text-cyber-amber font-bold flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-cyber-red animate-pulse"></span>
            <span>CONTENT CREATOR MODE // NEW SESSION REQUIRED</span>
          </div>
          <h2 class="text-lg font-bold text-white tracking-wider font-mono mt-0.5">
            LAUNCH CONTENT CREATOR SIMULATION
          </h2>
        </div>
        <button
          @click="handleClose"
          class="text-terminal-muted hover:text-white text-base transition p-1 rounded"
        >
          ✕
        </button>
      </div>

      <!-- Explanatory Banner -->
      <div class="p-3 rounded bg-cyber-amber/10 border border-cyber-amber/30 text-xs text-amber-200/90 leading-relaxed font-mono">
        <p class="font-bold text-cyber-amber flex items-center space-x-1 mb-1">
          <span>⚠️</span>
          <span>DEFAULT SETTING NOTICE:</span>
        </p>
        <p>
          Content Creator Mode is <span class="text-white font-bold underline">Disabled by Default</span> to protect organic market simulations. Activating Content Creator Mode initiates a fresh, isolated simulation session equipped with real-time market manipulation overrides:
        </p>
        <div class="mt-2 grid grid-cols-2 gap-2 text-[11px] text-white">
          <div class="bg-black/40 p-1.5 rounded border border-cyber-green/40 flex items-center space-x-1.5">
            <span class="text-cyber-green font-bold">[Ctrl + G]</span>
            <span>Force Bull Pump (+5%)</span>
          </div>
          <div class="bg-black/40 p-1.5 rounded border border-cyber-red/40 flex items-center space-x-1.5">
            <span class="text-cyber-red font-bold">[Ctrl + R]</span>
            <span>Force Bear Dump (-5%)</span>
          </div>
        </div>
      </div>

      <p class="text-xs text-terminal-muted font-mono">
        Select which market universe to launch for your stream or video recording session:
      </p>

      <!-- Submode Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Stock Exchange -->
        <div
          @click="handleStart('StockExchange')"
          class="cyber-panel p-4 rounded-lg border border-terminal-border hover:border-cyber-blue cursor-pointer transition space-y-3 group bg-terminal-surface/60"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-white group-hover:text-cyber-blue text-sm font-mono">Stock Exchange</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-terminal-bg text-cyber-blue font-mono font-bold">12 STOCKS</span>
          </div>
          <p class="text-[11px] text-terminal-muted leading-relaxed">
            Corporate titans: Pear, MicroHard, MuskCar, Nvidiot, Googol, Mate &amp; institutional banks.
          </p>
          <div class="flex items-center space-x-1 py-1">
            <AssetIcon symbol="PEAR" :size="16" />
            <AssetIcon symbol="MHD" :size="16" />
            <AssetIcon symbol="TSLA-X" :size="16" />
            <AssetIcon symbol="PIXL" :size="16" />
            <AssetIcon symbol="GOOG" :size="16" />
          </div>
          <button
            class="w-full py-2.5 rounded bg-cyber-blue text-black font-bold font-mono text-xs uppercase group-hover:bg-cyber-blue/90 transition shadow-glow-blue"
          >
            Launch Stocks Session →
          </button>
        </div>

        <!-- Cryptocurrency -->
        <div
          @click="handleStart('Cryptocurrency')"
          class="cyber-panel p-4 rounded-lg border border-terminal-border hover:border-cyber-amber cursor-pointer transition space-y-3 group bg-terminal-surface/60"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-white group-hover:text-cyber-amber text-sm font-mono">Cryptocurrency</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-terminal-bg text-cyber-amber font-mono font-bold">5 CRYPTOS</span>
          </div>
          <p class="text-[11px] text-terminal-muted leading-relaxed">
            Hyper-volatile meme tokens &amp; crypto: Bytecoin, Aethereum, Solona, MeowCoin &amp; USD-Fake.
          </p>
          <div class="flex items-center space-x-1 py-1">
            <AssetIcon symbol="BYTE" :size="16" />
            <AssetIcon symbol="AETH" :size="16" />
            <AssetIcon symbol="SOLA" :size="16" />
            <AssetIcon symbol="MEOW" :size="16" />
            <AssetIcon symbol="USDF" :size="16" />
          </div>
          <button
            class="w-full py-2.5 rounded bg-cyber-amber text-black font-bold font-mono text-xs uppercase group-hover:bg-cyber-amber/90 transition shadow-glow-amber"
          >
            Launch Crypto Session →
          </button>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex items-center justify-between pt-2 border-t border-terminal-border/60 text-xs font-mono">
        <span class="text-terminal-muted text-[11px]">Simange // KaProject Labs</span>
        <button
          @click="handleClose"
          class="px-4 py-1.5 rounded bg-terminal-surface hover:bg-terminal-border text-terminal-text hover:text-white transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
