<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { musicPlayer } from '../utils/musicPlayer';
import SimangeLogo from './SimangeLogo.vue';
import {
  IconSettings,
  IconShieldLock,
  IconFileText,
  IconScale,
  IconInfoCircle,
  IconVolume,
  IconVolumeOff,
  IconMusic,
  IconDeviceTv,
  IconBroadcast,
  IconTrash,
  IconExternalLink,
} from '@tabler/icons-vue';

const store = useGameStore();

type SettingsTab = 'general' | 'privacy' | 'terms' | 'licenses' | 'about';
const activeTab = ref<SettingsTab>('general');

const isMusicPlaying = ref(musicPlayer.isPlaying());
const musicVolume = ref(0.45);
const confirmReset = ref(false);

function toggleMusic() {
  isMusicPlaying.value = musicPlayer.toggle();
}

function handleMusicVolumeChange(e: Event) {
  const val = Number((e.target as HTMLInputElement).value);
  musicVolume.value = val;
  musicPlayer.setVolume(val);
}

function handleClose() {
  store.showSettingsModal = false;
  confirmReset.value = false;
}

function clearLocalData() {
  if (!confirmReset.value) {
    confirmReset.value = true;
    return;
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('simange_savegame');
    localStorage.removeItem('simange_settings');
  }
  store.hasSaveFile = false;
  confirmReset.value = false;
  store.showNotification('Local simulation save data cleared successfully.', 'info');
}

function openCreatorSessionModal() {
  store.showCreatorSessionModal = true;
}

function openGithub() {
  window.open('https://github.com/KaProject-Labs/Simange', '_blank');
}
</script>

<template>
  <div
    v-if="store.showSettingsModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none"
  >
    <div class="max-w-4xl w-full h-[620px] cyber-panel border-2 border-cyber-blue rounded-xl shadow-glow-blue flex flex-col overflow-hidden animate-in fade-in duration-200">
      <!-- Top Title Header -->
      <div class="px-6 py-4 bg-terminal-panel border-b border-terminal-border flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <SimangeLogo :size="28" :showText="false" />
          <div>
            <h2 class="text-base font-bold text-white font-mono tracking-wider flex items-center space-x-2">
              <span>SYSTEM SETTINGS &amp; LEGAL DIRECTIVES</span>
            </h2>
            <p class="text-[11px] text-terminal-muted font-mono">
              SIMANGE // KaProject Labs Core Configuration
            </p>
          </div>
        </div>

        <button
          @click="handleClose"
          class="text-terminal-muted hover:text-white p-1.5 rounded transition text-lg"
          title="Close Settings (ESC)"
        >
          ✕
        </button>
      </div>

      <!-- Main Layout: Left Tabs Sidebar & Right Content Viewport -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Sidebar Navigation -->
        <aside class="w-64 bg-terminal-panel/80 border-r border-terminal-border p-3 flex flex-col space-y-1.5 font-mono text-xs">
          <button
            @click="activeTab = 'general'"
            :class="[
              'w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition font-semibold',
              activeTab === 'general'
                ? 'bg-cyber-blue text-black font-bold shadow-glow-blue'
                : 'text-terminal-text hover:text-white hover:bg-terminal-surface'
            ]"
          >
            <IconSettings :size="16" />
            <span>General Setting</span>
          </button>

          <button
            @click="activeTab = 'privacy'"
            :class="[
              'w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition font-semibold',
              activeTab === 'privacy'
                ? 'bg-cyber-blue text-black font-bold shadow-glow-blue'
                : 'text-terminal-text hover:text-white hover:bg-terminal-surface'
            ]"
          >
            <IconShieldLock :size="16" />
            <span>Privacy Policy</span>
          </button>

          <button
            @click="activeTab = 'terms'"
            :class="[
              'w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition font-semibold',
              activeTab === 'terms'
                ? 'bg-cyber-blue text-black font-bold shadow-glow-blue'
                : 'text-terminal-text hover:text-white hover:bg-terminal-surface'
            ]"
          >
            <IconFileText :size="16" />
            <span>Terms of Service</span>
          </button>

          <button
            @click="activeTab = 'licenses'"
            :class="[
              'w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition font-semibold',
              activeTab === 'licenses'
                ? 'bg-cyber-blue text-black font-bold shadow-glow-blue'
                : 'text-terminal-text hover:text-white hover:bg-terminal-surface'
            ]"
          >
            <IconScale :size="16" />
            <span>Third-Party License</span>
          </button>

          <button
            @click="activeTab = 'about'"
            :class="[
              'w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition font-semibold',
              activeTab === 'about'
                ? 'bg-cyber-blue text-black font-bold shadow-glow-blue'
                : 'text-terminal-text hover:text-white hover:bg-terminal-surface'
            ]"
          >
            <IconInfoCircle :size="16" />
            <span>About this Project</span>
          </button>

          <div class="flex-1"></div>

          <!-- Bottom Repository Link -->
          <div class="pt-3 border-t border-terminal-border space-y-1">
            <button
              @click="openGithub"
              class="w-full flex items-center justify-between px-3 py-2 rounded bg-terminal-surface hover:bg-terminal-border/80 text-cyber-blue transition text-[11px]"
            >
              <span>GitHub Repository</span>
              <IconExternalLink :size="14" />
            </button>
            <div class="text-[10px] text-terminal-muted text-center pt-1">
              © 2026 KaProject Labs
            </div>
          </div>
        </aside>

        <!-- Right Content Viewport -->
        <main class="flex-1 p-6 overflow-y-auto bg-terminal-bg font-mono text-xs">
          <!-- TAB 1: GENERAL SETTING -->
          <div v-if="activeTab === 'general'" class="space-y-6">
            <div class="border-b border-terminal-border pb-3">
              <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <IconSettings :size="18" class="text-cyber-blue" />
                <span>General Audio, Display &amp; Engine Preferences</span>
              </h3>
              <p class="text-[11px] text-terminal-muted mt-0.5">
                Configure local simulation sound synthesizer, graphical shaders, and default creator behavior.
              </p>
            </div>

            <div class="space-y-4">
              <!-- Audio Settings -->
              <div class="cyber-panel p-4 rounded-lg border border-terminal-border space-y-3">
                <div class="font-bold text-white text-xs flex items-center justify-between">
                  <span>AUDIO SYNTHESIZER &amp; SFX</span>
                  <button
                    @click="store.toggleSound()"
                    :class="store.soundEnabled ? 'text-cyber-green bg-cyber-green/10 border-cyber-green/40' : 'text-terminal-muted bg-terminal-surface border-terminal-border'"
                    class="px-2.5 py-1 rounded border text-[11px] font-bold transition flex items-center space-x-1"
                  >
                    <IconVolume v-if="store.soundEnabled" :size="14" />
                    <IconVolumeOff v-else :size="14" />
                    <span>{{ store.soundEnabled ? 'ENABLED' : 'MUTED' }}</span>
                  </button>
                </div>
                <p class="text-[11px] text-terminal-muted">
                  Interactive Web Audio API synthesizers for market order executions, rank promotions, and price alert chimes.
                </p>
              </div>

              <!-- Soundtrack BGM -->
              <div class="cyber-panel p-4 rounded-lg border border-terminal-border space-y-3">
                <div class="font-bold text-white text-xs flex items-center justify-between">
                  <span>OFFICIAL SOUNDTRACK (OST BGM)</span>
                  <button
                    @click="toggleMusic"
                    :class="isMusicPlaying ? 'text-cyber-green bg-cyber-green/10 border-cyber-green/40' : 'text-terminal-muted bg-terminal-surface border-terminal-border'"
                    class="px-2.5 py-1 rounded border text-[11px] font-bold transition flex items-center space-x-1"
                  >
                    <IconMusic :size="14" />
                    <span>{{ isMusicPlaying ? 'PLAYING' : 'MUTED' }}</span>
                  </button>
                </div>
                <div class="flex items-center space-x-4 pt-1">
                  <span class="text-[11px] text-terminal-muted">BGM Volume:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    :value="musicVolume"
                    @input="handleMusicVolumeChange"
                    class="flex-1 accent-cyber-blue h-1 cursor-pointer"
                  />
                  <span class="text-cyber-blue font-bold text-[11px] w-10 text-right">{{ Math.round(musicVolume * 100) }}%</span>
                </div>
              </div>

              <!-- CRT Shader -->
              <div class="cyber-panel p-4 rounded-lg border border-terminal-border space-y-3">
                <div class="font-bold text-white text-xs flex items-center justify-between">
                  <span>RETRO CRT SCANLINE SHADER</span>
                  <button
                    @click="store.toggleScanlines()"
                    :class="store.scanlinesEnabled ? 'text-cyber-green bg-cyber-green/10 border-cyber-green/40' : 'text-terminal-muted bg-terminal-surface border-terminal-border'"
                    class="px-2.5 py-1 rounded border text-[11px] font-bold transition flex items-center space-x-1"
                  >
                    <IconDeviceTv :size="14" />
                    <span>{{ store.scanlinesEnabled ? 'ACTIVE' : 'OFF' }}</span>
                  </button>
                </div>
                <p class="text-[11px] text-terminal-muted">
                  Simulates high-frequency Bloomberg / Cyberpunk cathode-ray tube phosphor scanlines across the viewport.
                </p>
              </div>

              <!-- Content Creator Mode Section -->
              <div class="cyber-panel p-4 rounded-lg border border-cyber-amber/50 bg-cyber-amber/5 space-y-3 shadow-glow-amber">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-2.5 h-2.5 rounded-full" :class="store.creatorModeActive ? 'bg-cyber-red animate-pulse' : 'bg-terminal-border'"></span>
                    <span class="font-bold text-cyber-amber text-xs">CONTENT CREATOR MODE</span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded bg-terminal-surface text-terminal-muted border border-terminal-border">
                      DEFAULT: DISABLED
                    </span>
                  </div>

                  <span
                    :class="store.creatorModeActive ? 'text-cyber-green font-bold' : 'text-terminal-muted'"
                    class="text-[11px]"
                  >
                    Current Status: {{ store.creatorModeActive ? 'ACTIVE IN SESSION' : 'DISABLED' }}
                  </span>
                </div>

                <p class="text-[11px] text-terminal-muted leading-relaxed">
                  Content Creator Mode is <strong class="text-white">Disabled in Default Setting</strong> to preserve standard market simulation integrity. Attempting to use Content Creator Mode will launch a <strong class="text-cyber-blue">New Dedicated Simulation Session</strong> with live market manipulation hotkeys (<span class="text-cyber-green font-bold">Ctrl+G</span> Bull Pump, <span class="text-cyber-red font-bold">Ctrl+R</span> Bear Dump).
                </p>

                <div class="pt-2 flex items-center justify-between">
                  <div class="text-[10px] text-terminal-muted">
                    Hotkeys: Ctrl+G (Pump) • Ctrl+R (Dump) • Ctrl+Shift+C (Toggle HUD)
                  </div>
                  <button
                    @click="openCreatorSessionModal"
                    class="px-4 py-2 rounded bg-cyber-amber text-black font-bold uppercase hover:bg-cyber-amber/90 transition shadow-glow-amber text-xs flex items-center space-x-1.5"
                  >
                    <IconBroadcast :size="14" />
                    <span>Launch Creator Session →</span>
                  </button>
                </div>
              </div>

              <!-- Storage & Cache -->
              <div class="cyber-panel p-4 rounded-lg border border-terminal-border space-y-3">
                <div class="font-bold text-white text-xs flex items-center justify-between">
                  <span>LOCAL SIMULATION DATA</span>
                  <span class="text-[11px] text-cyber-blue">
                    {{ store.hasSaveFile ? 'Savegame Detected' : 'No Savegame Stored' }}
                  </span>
                </div>
                <p class="text-[11px] text-terminal-muted">
                  Simulation state is maintained solely inside local storage and desktop files.
                </p>
                <div class="flex items-center space-x-3 pt-1">
                  <button
                    @click="clearLocalData"
                    :class="confirmReset ? 'bg-cyber-red text-white font-bold' : 'bg-terminal-surface text-cyber-red hover:bg-cyber-red/20'"
                    class="px-3 py-1.5 rounded border border-cyber-red/40 text-xs transition flex items-center space-x-1.5 font-bold"
                  >
                    <IconTrash :size="14" />
                    <span>{{ confirmReset ? 'Confirm: Wipe Saved Data' : 'Reset Saved Data' }}</span>
                  </button>
                  <span v-if="confirmReset" class="text-[10px] text-cyber-amber">Click again to confirm irreversible deletion</span>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: PRIVACY POLICY -->
          <div v-else-if="activeTab === 'privacy'" class="space-y-5 text-gray-300 leading-relaxed">
            <div class="border-b border-terminal-border pb-3">
              <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <IconShieldLock :size="18" class="text-cyber-green" />
                <span>KaProject Labs Privacy Policy</span>
              </h3>
              <p class="text-[11px] text-terminal-muted mt-0.5">
                Effective Date: October 2026 // Organization: KaProject Labs
              </p>
            </div>

            <div class="p-3 rounded bg-cyber-green/10 border border-cyber-green/30 text-cyber-green text-[11px] font-bold">
              ✓ 100% CLIENT-SIDE DATA PRIVACY GUARANTEE: ZERO TELEMETRY, ZERO TRACKING.
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-bold text-white uppercase">1. Zero Telemetry &amp; No Data Collection</h4>
              <p>
                KaProject Labs develops Simange as Free and Open Source Software (FOSS). We believe data privacy is a fundamental human right. Simange does not collect, record, transmit, monitor, or profile any personally identifiable information (PII), browsing behavior, IP addresses, keystrokes, or simulation trading performance.
              </p>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-bold text-white uppercase">2. Local Storage Sovereignty</h4>
              <p>
                All trading operations, order books, portfolio balances, and user preferences are calculated and stored 100% locally on your machine via standard web <code class="text-cyber-blue">localStorage</code> or local desktop application file structures. You have absolute sovereignty over this data and may purge it at any time from General Settings or your browser cache.
              </p>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-bold text-white uppercase">3. No Advertising &amp; No Third-Party Trackers</h4>
              <p>
                Simange contains zero external advertising networks, tracker scripts, analytics pixels, or commercial fingerprinting beacons. The software is distributed without monetized profiling dependencies.
              </p>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-bold text-white uppercase">4. Open Source Transparency</h4>
              <p>
                The complete source code of Simange is public and auditable at <a href="https://github.com/KaProject-Labs/Simange" target="_blank" class="text-cyber-blue underline">github.com/KaProject-Labs/Simange</a>. Independent security and privacy audits can inspect every line of network and state code.
              </p>
            </div>
          </div>

          <!-- TAB 3: TERMS OF SERVICE -->
          <div v-else-if="activeTab === 'terms'" class="space-y-5 text-gray-300 leading-relaxed">
            <div class="border-b border-terminal-border pb-3">
              <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <IconFileText :size="18" class="text-cyber-amber" />
                <span>Terms of Service &amp; Simulation Disclaimers</span>
              </h3>
              <p class="text-[11px] text-terminal-muted mt-0.5">
                Simange High-Frequency Terminal // KaProject Labs
              </p>
            </div>

            <div class="p-3 rounded bg-cyber-amber/10 border border-cyber-amber/30 text-amber-200 text-[11px] leading-relaxed">
              <strong>SATIRICAL PARODY &amp; NON-FINANCIAL ADVICE NOTICE:</strong><br />
              Simange is strictly an educational financial market simulation and satirical parody game. No real currency is traded or stored.
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-bold text-white uppercase">1. Fictional Satire &amp; Fair Use</h4>
              <p>
                All company names, ticker symbols, executive personas, and token brands (including Pear Inc., MicroHard, MuskCar, Nvidiot, Googol, Mate, Bytecoin, Aethereum, Solona, MeowCoin, Willy Bate, Elon Mowsk, John Ternas, and James Huang) are purely fictional satirical parodies created for gaming and educational commentary under applicable Fair Use doctrines.
              </p>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-bold text-white uppercase">2. No Investment Advice</h4>
              <p>
                Nothing contained within Simange constitutes financial, investment, legal, or tax advice. Market movements, volatility models, and price trajectories generated by Simange are stochastic mathematical simulations and do not reflect or predict real-world securities.
              </p>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-bold text-white uppercase">3. Content Creator &amp; Streaming Rights</h4>
              <p>
                Content creators, streamers, and educators are granted worldwide, royalty-free permission to stream, record, broadcast, monetize, and distribute gameplay and simulated market manipulation videos featuring Simange. Mentioning KaProject Labs and linking to <code class="text-cyber-blue">github.com/KaProject-Labs/Simange</code> is encouraged.
              </p>
            </div>

            <div class="space-y-3">
              <h4 class="text-xs font-bold text-white uppercase">4. Disclaimer of Warranties (GPL-3.0)</h4>
              <p class="uppercase text-[11px] text-terminal-muted">
                THE PROGRAM IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED. IN NO EVENT SHALL KAPROJECT LABS OR ITS CONTRIBUTORS BE LIABLE FOR ANY DAMAGES ARISING OUT OF THE USE OF THIS SOFTWARE.
              </p>
            </div>
          </div>

          <!-- TAB 4: THIRD-PARTY LICENSE -->
          <div v-else-if="activeTab === 'licenses'" class="space-y-5 text-gray-300 leading-relaxed">
            <div class="border-b border-terminal-border pb-3">
              <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <IconScale :size="18" class="text-cyber-blue" />
                <span>Third-Party Open Source Software Licenses</span>
              </h3>
              <p class="text-[11px] text-terminal-muted mt-0.5">
                Simange proudly builds on top of world-class FOSS libraries and assets.
              </p>
            </div>

            <div class="space-y-3">
              <div class="cyber-panel p-3.5 rounded border border-terminal-border space-y-1">
                <div class="flex items-center justify-between text-white font-bold">
                  <span>Vue.js (v3.5)</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-terminal-surface text-cyber-green font-mono">MIT License</span>
                </div>
                <div class="text-[11px] text-terminal-muted">Copyright © 2018-present Evan You &amp; Vue Core Contributors</div>
              </div>

              <div class="cyber-panel p-3.5 rounded border border-terminal-border space-y-1">
                <div class="flex items-center justify-between text-white font-bold">
                  <span>Tauri Desktop Framework (v2.0)</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-terminal-surface text-cyber-blue font-mono">MIT / Apache-2.0</span>
                </div>
                <div class="text-[11px] text-terminal-muted">Copyright © 2019-present Tauri Programme within The Commons Conservancy</div>
              </div>

              <div class="cyber-panel p-3.5 rounded border border-terminal-border space-y-1">
                <div class="flex items-center justify-between text-white font-bold">
                  <span>Simple Icons</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-terminal-surface text-cyber-purple font-mono">CC0 1.0 Universal</span>
                </div>
                <div class="text-[11px] text-terminal-muted">Brand vector icons distributed under Public Domain dedication</div>
              </div>

              <div class="cyber-panel p-3.5 rounded border border-terminal-border space-y-1">
                <div class="flex items-center justify-between text-white font-bold">
                  <span>Tabler Icons for Vue</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-terminal-surface text-cyber-green font-mono">MIT License</span>
                </div>
                <div class="text-[11px] text-terminal-muted">Copyright © 2020-present Paweł Kuna</div>
              </div>

              <div class="cyber-panel p-3.5 rounded border border-terminal-border space-y-1">
                <div class="flex items-center justify-between text-white font-bold">
                  <span>Tailwind CSS</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-terminal-surface text-cyber-green font-mono">MIT License</span>
                </div>
                <div class="text-[11px] text-terminal-muted">Copyright © Tailwind Labs, Inc.</div>
              </div>

              <div class="cyber-panel p-3.5 rounded border border-terminal-border space-y-1">
                <div class="flex items-center justify-between text-white font-bold">
                  <span>Bun Runtime &amp; Vite</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-terminal-surface text-cyber-green font-mono">MIT License</span>
                </div>
                <div class="text-[11px] text-terminal-muted">Copyright © Oven-sh Inc. and Yuxi (Evan) You</div>
              </div>

              <div class="cyber-panel p-3.5 rounded border border-terminal-border space-y-1">
                <div class="flex items-center justify-between text-white font-bold">
                  <span>Pinia State Store</span>
                  <span class="text-[10px] px-2 py-0.5 rounded bg-terminal-surface text-cyber-green font-mono">MIT License</span>
                </div>
                <div class="text-[11px] text-terminal-muted">Copyright © 2019-present Eduardo San Martin Morote</div>
              </div>
            </div>
          </div>

          <!-- TAB 5: ABOUT THIS PROJECT -->
          <div v-else-if="activeTab === 'about'" class="space-y-6">
            <div class="border-b border-terminal-border pb-3 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <IconInfoCircle :size="18" class="text-cyber-blue" />
                  <span>About Simange &amp; KaProject Labs</span>
                </h3>
                <p class="text-[11px] text-terminal-muted mt-0.5">
                  High-Frequency FOSS Cyberpunk Financial Market Simulator
                </p>
              </div>
              <span class="text-xs px-2.5 py-1 rounded bg-cyber-blue/15 text-cyber-blue border border-cyber-blue/40 font-bold">
                VERSION 0.1.0 BETA
              </span>
            </div>

            <!-- Project Card -->
            <div class="cyber-panel p-5 rounded-xl border border-cyber-blue/50 bg-black/50 space-y-4">
              <div class="flex items-center space-x-3">
                <SimangeLogo :size="40" :showText="false" />
                <div>
                  <div class="text-base font-black text-white tracking-widest">SIMANGE</div>
                  <div class="text-[11px] text-cyber-blue">SIMULATION OF EXCHANGE</div>
                </div>
              </div>

              <p class="text-gray-300 leading-relaxed text-xs">
                Simange is an open-source cyberpunk financial trading terminal and market simulator engineered by <strong class="text-white">KaProject Labs</strong>. It models real-time stochastic random walk dynamics, jump diffusions, microsecond limit order matching, dynamic market depth, and social media hype/FUD news feeds across 17 parody crypto and equity assets.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div class="p-3 rounded bg-terminal-surface border border-terminal-border space-y-1">
                  <span class="text-terminal-muted block text-[10px]">ORGANIZATION &amp; COPYRIGHT:</span>
                  <span class="text-white font-bold">KaProject Labs</span>
                  <span class="text-[10px] text-terminal-muted block">Copyright © 2026 KaProject Labs</span>
                </div>

                <div class="p-3 rounded bg-terminal-surface border border-terminal-border space-y-1">
                  <span class="text-terminal-muted block text-[10px]">OPEN SOURCE LICENSE:</span>
                  <span class="text-cyber-green font-bold">GNU General Public License v3.0</span>
                  <span class="text-[10px] text-terminal-muted block">GPL-3.0 Copyleft Protection</span>
                </div>

                <div class="p-3 rounded bg-terminal-surface border border-terminal-border space-y-1 sm:col-span-2">
                  <span class="text-terminal-muted block text-[10px]">SOURCE CODE REPOSITORY:</span>
                  <a
                    href="https://github.com/KaProject-Labs/Simange"
                    target="_blank"
                    class="text-cyber-blue hover:underline font-bold flex items-center space-x-1"
                  >
                    <span>https://github.com/KaProject-Labs/Simange</span>
                    <IconExternalLink :size="12" />
                  </a>
                </div>
              </div>
            </div>

            <!-- Architecture Specifications -->
            <div class="cyber-panel p-4 rounded-xl border border-terminal-border space-y-3">
              <h4 class="text-xs font-bold text-white uppercase tracking-wider">ENGINE ARCHITECTURE &amp; SPECS</h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div class="p-2 rounded bg-terminal-surface"><span class="text-terminal-muted">Desktop Core:</span> <span class="text-white font-bold">Tauri v2 + Rust</span></div>
                <div class="p-2 rounded bg-terminal-surface"><span class="text-terminal-muted">Frontend:</span> <span class="text-white font-bold">Vue 3 + TypeScript</span></div>
                <div class="p-2 rounded bg-terminal-surface"><span class="text-terminal-muted">Styling:</span> <span class="text-white font-bold">Tailwind CSS CRT</span></div>
                <div class="p-2 rounded bg-terminal-surface"><span class="text-terminal-muted">Package Tooling:</span> <span class="text-white font-bold">Bun Runtime + Vite</span></div>
                <div class="p-2 rounded bg-terminal-surface"><span class="text-terminal-muted">Icon Assets:</span> <span class="text-white font-bold">Simple Icons</span></div>
                <div class="p-2 rounded bg-terminal-surface"><span class="text-terminal-muted">State Management:</span> <span class="text-white font-bold">Pinia Store</span></div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- Modal Bottom Actions Bar -->
      <div class="px-6 py-3 bg-terminal-panel border-t border-terminal-border flex items-center justify-between text-xs font-mono">
        <span class="text-terminal-muted">github.com/KaProject-Labs/Simange</span>
        <button
          @click="handleClose"
          class="px-5 py-2 rounded bg-cyber-blue text-black font-bold uppercase hover:bg-cyber-blue/90 transition shadow-glow-blue"
        >
          Close Settings
        </button>
      </div>
    </div>
  </div>
</template>
