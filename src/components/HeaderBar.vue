<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { musicPlayer } from '../utils/musicPlayer';
import SimangeLogo from './SimangeLogo.vue';
import {
  IconChartCandle,
  IconBriefcase,
  IconNews,
  IconBuildingBank,
  IconTrophy,
  IconPlayerPause,
  IconPlayerPlay,
  IconVolume,
  IconVolumeOff,
  IconDeviceTv,
  IconMusic,
  IconWorld,
  IconBroadcast,
  IconSettings,
  IconLockOpen,
} from '@tabler/icons-vue';

const store = useGameStore();
const isMusicPlaying = ref(musicPlayer.isPlaying());

function toggleBgm() {
  isMusicPlaying.value = musicPlayer.toggle();
}

const rank = computed(() => store.currentRank);
const netWorth = computed(() => store.netWorth);
const cash = computed(() => store.cash);
const unrealizedPnl = computed(() => store.portfolio?.unrealized_pnl ?? 0);

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}
</script>

<template>
  <header class="bg-terminal-panel border-b border-terminal-border px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-sm select-none">
    <!-- Left: Title & Mode & Rank Badge -->
    <div class="flex items-center space-x-3">
      <div class="flex items-center space-x-2">
        <SimangeLogo :size="24" :showText="false" />
        <span class="font-bold text-cyber-blue tracking-wider text-base font-mono">SIMANGE</span>
        <span
          class="text-xs px-2 py-0.5 rounded border uppercase font-mono font-bold"
          :class="[
            store.gameMode === 'ContentCreator'
              ? 'bg-cyber-amber/20 border-cyber-amber text-cyber-amber shadow-glow-amber'
              : 'bg-terminal-surface border-terminal-border text-terminal-muted'
          ]"
        >
          <span v-if="store.gameMode === 'ContentCreator'" class="mr-1 text-cyber-red">●</span>
          {{
            store.gameMode === 'ContentCreator'
              ? `CREATOR (${store.creatorSubMode === 'StockExchange' ? 'STOCKS' : 'CRYPTO'})`
              : store.gameMode
          }}
        </span>
      </div>

      <!-- Rank Tier Badge -->
      <div
        v-if="rank"
        @click="store.activeTab = 'ranks'"
        class="cursor-pointer group flex items-center space-x-2 px-2.5 py-1 rounded bg-terminal-surface border border-terminal-border hover:border-terminal-highlight transition"
      >
        <span
          class="w-2.5 h-2.5 rounded-full animate-pulse"
          :style="{ backgroundColor: rank.badge_color, boxShadow: `0 0 8px ${rank.badge_color}` }"
        ></span>
        <span class="font-semibold text-xs text-white">{{ rank.title }}</span>
        <span class="text-[11px] text-terminal-muted">({{ Math.round(rank.progress_pct) }}%)</span>
      </div>
    </div>

    <!-- Center: Navigation Tabs -->
    <nav class="flex items-center space-x-1 bg-terminal-surface p-1 rounded border border-terminal-border">
      <button
        @click="store.activeTab = 'terminal'"
        :class="[
          'flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition',
          store.activeTab === 'terminal'
            ? 'bg-terminal-border text-cyber-blue shadow-glow-blue'
            : 'text-terminal-text hover:text-white hover:bg-terminal-panel'
        ]"
      >
        <IconChartCandle :size="16" />
        <span>Terminal</span>
      </button>

      <button
        @click="store.activeTab = 'portfolio'"
        :class="[
          'flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition',
          store.activeTab === 'portfolio'
            ? 'bg-terminal-border text-cyber-green shadow-glow-green'
            : 'text-terminal-text hover:text-white hover:bg-terminal-panel'
        ]"
      >
        <IconBriefcase :size="16" />
        <span>Portfolio</span>
      </button>

      <button
        @click="store.activeTab = 'news'"
        :class="[
          'flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium relative transition',
          store.activeTab === 'news'
            ? 'bg-terminal-border text-cyber-amber shadow-glow-amber'
            : 'text-terminal-text hover:text-white hover:bg-terminal-panel'
        ]"
      >
        <IconNews :size="16" />
        <span>Hype & News</span>
        <span
          v-if="store.unreadNewsCount > 0"
          class="w-2 h-2 rounded-full bg-cyber-red animate-ping absolute -top-0.5 -right-0.5"
        ></span>
      </button>

      <button
        @click="store.activeTab = 'bank'"
        :class="[
          'flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition',
          store.activeTab === 'bank'
            ? 'bg-terminal-border text-white'
            : 'text-terminal-text hover:text-white hover:bg-terminal-panel'
        ]"
      >
        <IconBuildingBank :size="16" />
        <span>Bank / Loans</span>
      </button>

      <button
        @click="store.activeTab = 'ranks'"
        :class="[
          'flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition',
          store.activeTab === 'ranks'
            ? 'bg-terminal-border text-cyber-purple'
            : 'text-terminal-text hover:text-white hover:bg-terminal-panel'
        ]"
      >
        <IconTrophy :size="16" />
        <span>Ranks</span>
      </button>

      <button
        @click="store.activeTab = 'browser'"
        :class="[
          'flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium transition',
          store.activeTab === 'browser'
            ? 'bg-terminal-border text-cyber-blue shadow-glow-blue'
            : 'text-terminal-text hover:text-white hover:bg-terminal-panel'
        ]"
      >
        <IconWorld :size="16" />
        <span>Browser</span>
      </button>
      <button
        v-if="store.browserLocked"
        @click="store.unlockBrowser()"
        class="ml-1 flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition bg-cyber-amber/20 border border-cyber-amber text-cyber-amber hover:bg-cyber-amber/40"
      >
        <IconLockOpen :size="14" />
        <span>Unlock Browser</span>
      </button>
    </nav>

    <!-- Right: Financial Figures & Game Controls -->
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-3 text-xs num-mono">
        <div>
          <span class="text-terminal-muted block text-[10px]">NET WORTH</span>
          <span class="text-white font-bold text-sm">{{ formatCurrency(netWorth) }}</span>
        </div>
        <div class="border-l border-terminal-border pl-3">
          <span class="text-terminal-muted block text-[10px]">CASH</span>
          <span class="text-cyber-green font-bold text-sm">{{ formatCurrency(cash) }}</span>
        </div>
        <div class="border-l border-terminal-border pl-3">
          <span class="text-terminal-muted block text-[10px]">UNREALIZED PnL</span>
          <span
            :class="unrealizedPnl >= 0 ? 'text-cyber-green' : 'text-cyber-red'"
            class="font-bold text-sm"
          >
            {{ unrealizedPnl >= 0 ? '+' : '' }}{{ formatCurrency(unrealizedPnl) }}
          </span>
        </div>
      </div>

      <!-- Time Speed Controls -->
      <div class="flex items-center space-x-1 bg-terminal-surface px-1 py-0.5 rounded border border-terminal-border">
        <button
          v-for="speed in [1, 2, 5]"
          :key="speed"
          @click="store.setTimeSpeed(speed)"
          :class="[
            'px-1.5 py-0.5 text-[11px] rounded transition font-mono',
            store.timeSpeed === speed ? 'bg-cyber-blue text-black font-bold' : 'text-terminal-muted hover:text-white'
          ]"
        >
          {{ speed }}x
        </button>
      </div>

      <!-- Utilities: Audio, CRT, Pause -->
      <div class="flex items-center space-x-1.5 text-terminal-muted">
        <!-- Content Creator Mode Toggle / Session Trigger -->
        <button
          @click="store.requestCreatorMode()"
          :class="[
            'flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-mono font-bold transition border',
            store.creatorModeActive
              ? 'bg-cyber-amber/15 border-cyber-amber text-cyber-amber shadow-glow-amber'
              : 'bg-terminal-surface border-terminal-border text-terminal-muted hover:text-white'
          ]"
          title="Content Creator Mode (Ctrl+G: Bull Pump | Ctrl+R: Bear Dump)"
        >
          <span v-if="store.creatorModeActive" class="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse"></span>
          <IconBroadcast :size="14" />
          <span class="text-[11px]">{{ store.creatorModeActive ? 'CREATOR [ON]' : 'CREATOR' }}</span>
        </button>

        <button
          @click="store.showSettingsModal = true"
          class="p-1 rounded hover:bg-terminal-surface hover:text-white transition"
          title="System Settings & Legal Directives"
        >
          <IconSettings :size="16" />
        </button>

        <button
          @click="toggleBgm"
          class="p-1 rounded hover:bg-terminal-surface hover:text-white transition"
          :title="isMusicPlaying ? 'Pause Soundtrack BGM' : 'Play Soundtrack BGM'"
        >
          <IconMusic :size="16" :class="isMusicPlaying ? 'text-cyber-green' : 'text-terminal-muted'" />
        </button>

        <button
          @click="store.toggleSound()"
          class="p-1 rounded hover:bg-terminal-surface hover:text-white transition"
          :title="store.soundEnabled ? 'Mute SFX' : 'Enable SFX'"
        >
          <IconVolume v-if="store.soundEnabled" :size="16" class="text-cyber-blue" />
          <IconVolumeOff v-else :size="16" />
        </button>

        <button
          @click="store.toggleScanlines()"
          class="p-1 rounded hover:bg-terminal-surface hover:text-white transition"
          :title="store.scanlinesEnabled ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'"
        >
          <IconDeviceTv :size="16" :class="store.scanlinesEnabled ? 'text-cyber-green' : 'text-terminal-muted'" />
        </button>

        <button
          @click="store.togglePause()"
          class="flex items-center space-x-1 px-2 py-1 rounded bg-terminal-surface border border-terminal-border hover:border-terminal-highlight text-white text-xs font-mono transition"
        >
          <IconPlayerPlay v-if="store.isPaused" :size="14" class="text-cyber-green" />
          <IconPlayerPause v-else :size="14" class="text-cyber-amber" />
          <span>ESC</span>
        </button>
      </div>
    </div>
  </header>
</template>
