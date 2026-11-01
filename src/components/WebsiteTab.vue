<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '../stores/gameStore';
import {
  IconArrowLeft,
  IconArrowRight,
  IconRefresh,
  IconExternalLink,
  IconBookmark,
  IconShieldCheck,
} from '@tabler/icons-vue';

import WebsiteApp from '../website/WebsiteApp.vue';

const store = useGameStore();

type PageType = 'simange' | 'pear' | 'nvidiot' | 'muskcar' | 'bytecoin';
const currentPage = ref<PageType>('simange');
const urlBar = ref('https://simange.org/terminal-network');

const bookmarks: { id: PageType; title: string; url: string; icon: string }[] = [
  { id: 'simange', title: 'Simange Portal & Docs', url: 'https://simange.org/terminal-network', icon: '🌐' },
  { id: 'pear', title: 'Pear Inc. Intranet', url: 'https://internal.pear.corp/leaks', icon: '🍏' },
  { id: 'nvidiot', title: 'Nvidiot AI Cloud', url: 'https://blackwell.nvidiot.ai/clusters', icon: '⚡' },
  { id: 'muskcar', title: 'MuskCar X-Doge', url: 'https://mars.muskcar.x/orders', icon: '🚀' },
  { id: 'bytecoin', title: 'Bytecoin Foundation', url: 'https://genesis.bytecoin.dao/halving', icon: '🪙' },
];

function navigateTo(page: PageType) {
  currentPage.value = page;
  const match = bookmarks.find((b) => b.id === page);
  if (match) urlBar.value = match.url;
}

function openExternalWebsite() {
  window.open('/website.html', '_blank');
}
</script>

<template>
  <div class="flex-1 flex flex-col bg-terminal-bg overflow-hidden select-none">
    <!-- CyberNet Browser Navigation Bar -->
    <div class="px-4 py-2 bg-terminal-panel border-b border-terminal-border flex flex-col gap-2">
      <div class="flex items-center justify-between gap-3 text-xs">
        <!-- Back / Forward / Refresh -->
        <div class="flex items-center space-x-1 text-terminal-muted">
          <button class="p-1 rounded hover:bg-terminal-surface hover:text-white transition disabled:opacity-30">
            <IconArrowLeft :size="16" />
          </button>
          <button class="p-1 rounded hover:bg-terminal-surface hover:text-white transition disabled:opacity-30">
            <IconArrowRight :size="16" />
          </button>
          <button
            @click="navigateTo(currentPage)"
            class="p-1 rounded hover:bg-terminal-surface hover:text-white transition"
            title="Refresh Page"
          >
            <IconRefresh :size="16" />
          </button>
        </div>

        <!-- URL Address Input Bar -->
        <div class="flex-1 flex items-center bg-terminal-surface border border-terminal-border rounded px-3 py-1 text-xs font-mono">
          <IconShieldCheck :size="14" class="text-cyber-green mr-2 flex-shrink-0" />
          <span class="text-cyber-blue mr-1">SECURE //</span>
          <input
            v-model="urlBar"
            readonly
            class="bg-transparent text-white outline-none w-full font-mono text-xs select-all"
          />
        </div>

        <!-- Open External Button -->
        <button
          @click="openExternalWebsite"
          class="flex items-center space-x-1.5 px-3 py-1 rounded bg-cyber-blue/15 border border-cyber-blue/40 text-cyber-blue hover:bg-cyber-blue hover:text-black transition text-xs font-mono font-semibold"
          title="Open in new browser tab"
        >
          <span>Open Standalone Site</span>
          <IconExternalLink :size="14" />
        </button>
      </div>

      <!-- Quick Bookmarks Bar -->
      <div class="flex items-center space-x-2 text-xs font-mono overflow-x-auto pb-0.5">
        <span class="text-terminal-muted text-[10px] flex items-center space-x-1">
          <IconBookmark :size="12" />
          <span>NET:</span>
        </span>
        <button
          v-for="b in bookmarks"
          :key="b.id"
          @click="navigateTo(b.id)"
          :class="[
            'px-2.5 py-0.5 rounded text-[11px] flex items-center space-x-1.5 transition whitespace-nowrap',
            currentPage === b.id
              ? 'bg-cyber-blue text-black font-bold shadow-glow-blue'
              : 'bg-terminal-surface text-terminal-text hover:text-white hover:bg-terminal-border/60'
          ]"
        >
          <span>{{ b.icon }}</span>
          <span>{{ b.title }}</span>
        </button>
      </div>
    </div>

    <!-- Web Page Viewport Container -->
    <div class="flex-1 overflow-y-auto bg-terminal-bg text-terminal-text font-sans">
      <!-- 1. SIMANGE OFFICIAL PORTAL & PROJECT WEBSITE (VUE APP) -->
      <WebsiteApp v-if="currentPage === 'simange'" />

      <!-- 2. PEAR INC INTRANET -->
      <div v-else-if="currentPage === 'pear'" class="max-w-4xl mx-auto p-6 space-y-6">
        <div class="cyber-panel p-6 rounded-xl border border-gray-600 bg-black/60 space-y-4">
          <div class="flex items-center space-x-3 border-b border-gray-700 pb-4">
            <span class="text-3xl">🍏</span>
            <div>
              <h1 class="text-xl font-bold text-white">Pear Internal Developer Network</h1>
              <p class="text-xs text-gray-400">Classified // Strictly confidential titanium hardware blueprints</p>
            </div>
          </div>
          <div class="space-y-3 text-xs text-gray-300 leading-relaxed">
            <p class="text-sm font-semibold text-white">Project TitanPhone 17 Pro Ultra Max Max</p>
            <p>
              "We have eliminated the charging port, the screen, and the battery. The new device communicates directly with the user's subconscious through proprietary titanium vibrations. Retail price: $3,499."
            </p>
            <div class="p-3 bg-gray-900 rounded border border-gray-700 font-mono text-[11px]">
              <div>STOCK TICKER: PEAR</div>
              <div>CURRENT PRICE: ${{ store.assets.find(a => a.symbol === 'PEAR')?.current_price.toFixed(2) ?? '224.50' }}</div>
              <div>DIVIDEND YIELD: 1.6% Annual</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. NVIDIOT AI CLOUD -->
      <div v-else-if="currentPage === 'nvidiot'" class="max-w-4xl mx-auto space-y-6">
        <div class="cyber-panel p-6 rounded-xl border border-cyber-green bg-black/60 space-y-4 shadow-glow-green">
          <div class="flex items-center space-x-3 border-b border-cyber-green/40 pb-4">
            <span class="text-3xl">⚡</span>
            <div>
              <h1 class="text-xl font-bold text-white font-mono">Nvidiot AI Silicon Monopolizer</h1>
              <p class="text-xs text-cyber-green font-mono">Jensen Leather Jacket Cloud Cluster Allocation Portal</p>
            </div>
          </div>
          <div class="space-y-3 text-xs text-gray-300 leading-relaxed font-mono">
            <p class="text-sm font-bold text-cyber-green">100,000 H2000 Quantum Tensor Units Allocated</p>
            <p>
              "Every human will own 10,000 GPUs. If you don't buy GPUs today, you will be left behind in the post-silicon stone age. More you buy, more you save."
            </p>
            <div class="p-3 bg-terminal-surface rounded border border-cyber-green/30 text-[11px]">
              <div>STOCK TICKER: PIXL</div>
              <div>CURRENT PRICE: ${{ store.assets.find(a => a.symbol === 'PIXL')?.current_price.toFixed(2) ?? '132.80' }}</div>
              <div>MARKET IMPACT: AI Datacenter Bubble Driver</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. MUSKCAR X-DOGE -->
      <div v-else-if="currentPage === 'muskcar'" class="max-w-4xl mx-auto space-y-6">
        <div class="cyber-panel p-6 rounded-xl border border-cyber-amber bg-black/60 space-y-4 shadow-glow-amber">
          <div class="flex items-center space-x-3 border-b border-cyber-amber/40 pb-4">
            <span class="text-3xl">🚀</span>
            <div>
              <h1 class="text-xl font-bold text-white font-mono">MuskCar CyberTerminal</h1>
              <p class="text-xs text-cyber-amber font-mono">Autonomous EV, Mars Colony Shuttle & MeowCoin Reserve</p>
            </div>
          </div>
          <div class="space-y-3 text-xs text-gray-300 leading-relaxed font-mono">
            <p class="text-sm font-bold text-cyber-amber">CyberTruck Full Self-Driving v99.4 Status: 2 Weeks Away™</p>
            <p>
              "Robotaxi fleet will arrive next quarter. Also considering buying Twitter again for $800B using MeowCoin collateral. Funding secured."
            </p>
            <div class="p-3 bg-terminal-surface rounded border border-cyber-amber/30 text-[11px]">
              <div>STOCK TICKER: TSLA-X</div>
              <div>CURRENT PRICE: ${{ store.assets.find(a => a.symbol === 'TSLA-X')?.current_price.toFixed(2) ?? '262.30' }}</div>
              <div>ASSOCIATED MEME TOKEN: MEOW ($0.15)</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. BYTECOIN FOUNDATION -->
      <div v-else-if="currentPage === 'bytecoin'" class="max-w-4xl mx-auto space-y-6">
        <div class="cyber-panel p-6 rounded-xl border border-cyber-blue bg-black/60 space-y-4 shadow-glow-blue">
          <div class="flex items-center space-x-3 border-b border-cyber-blue/40 pb-4">
            <span class="text-3xl">🪙</span>
            <div>
              <h1 class="text-xl font-bold text-white font-mono">Bytecoin Decentralized Network</h1>
              <p class="text-xs text-cyber-blue font-mono">Genesis Block 0x00000000 // Sovereign Sound Digital Gold</p>
            </div>
          </div>
          <div class="space-y-3 text-xs text-gray-300 leading-relaxed font-mono">
            <p class="text-sm font-bold text-cyber-blue">Halving Countdown: 84 Blocks Remaining</p>
            <p>
              "Bytecoin is mathematically pure proof-of-work digital sovereignty. Fiat currencies are heading to zero against the infinite divisibility of bytes."
            </p>
            <div class="p-3 bg-terminal-surface rounded border border-cyber-blue/30 text-[11px]">
              <div>ASSET TICKER: BYTE</div>
              <div>CURRENT PRICE: ${{ store.assets.find(a => a.symbol === 'BYTE')?.current_price.toFixed(2) ?? '68,450.00' }}</div>
              <div>CIRCULATING SUPPLY: 21,000,000 BYTE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
