<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconRocket,
  IconFlame,
  IconEyeOff,
  IconChevronDown,
  IconChevronUp,
  IconBroadcast,
} from '@tabler/icons-vue';
import AssetIcon from './AssetIcon.vue';

const store = useGameStore();
const isExpanded = ref(true);

const selectedAsset = computed(() => store.selectedAsset);
const magnitudePercent = computed(() => Math.round(store.creatorMagnitude * 100));

function setMagnitude(pct: number) {
  store.setCreatorMagnitude(pct / 100);
}

function triggerPump(customMag?: number) {
  store.triggerMarketPump(undefined, customMag);
}

function triggerDump(customMag?: number) {
  store.triggerMarketDump(undefined, customMag);
}
</script>

<template>
  <div>
    <!-- Screen Flash Shockwave Overlay on Pump or Dump -->
    <transition name="flash">
      <div
        v-if="store.creatorFlash"
        class="fixed inset-0 pointer-events-none z-40 transition-opacity flex items-center justify-center"
      >
        <!-- Border glow vignette -->
        <div
          class="absolute inset-0 transition duration-300"
          :class="[
            store.creatorFlash.direction === 'green'
              ? 'border-4 border-cyber-green/80 bg-cyber-green/5 shadow-[inset_0_0_80px_rgba(0,247,150,0.3)]'
              : 'border-4 border-cyber-red/80 bg-cyber-red/5 shadow-[inset_0_0_80px_rgba(255,51,102,0.3)]'
          ]"
        ></div>

        <!-- Dramatic High-Tech HUD Banner -->
        <div
          class="cyber-panel px-6 py-3 rounded-lg border-2 shadow-2xl flex items-center space-x-4 animate-bounce font-mono z-50 backdrop-blur-md"
          :class="[
            store.creatorFlash.direction === 'green'
              ? 'border-cyber-green bg-terminal-panel/95 text-cyber-green shadow-glow-green'
              : 'border-cyber-red bg-terminal-panel/95 text-cyber-red shadow-glow-red'
          ]"
        >
          <div class="text-2xl">
            <span v-if="store.creatorFlash.direction === 'green'">🚀</span>
            <span v-else>📉</span>
          </div>
          <div>
            <div class="text-[10px] tracking-widest uppercase opacity-80 flex items-center space-x-1.5">
              <span class="w-2 h-2 rounded-full animate-ping" :class="store.creatorFlash.direction === 'green' ? 'bg-cyber-green' : 'bg-cyber-red'"></span>
              <span>CONTENT CREATOR MARKET OVERRIDE</span>
            </div>
            <div class="text-base font-black tracking-wide">
              {{ store.creatorFlash.text }} [{{ store.creatorFlash.symbol }}]
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Floating Creator Dock / HUD (Visible when Creator Mode is ON and Stealth is OFF) -->
    <div
      v-if="store.creatorModeActive && !store.creatorStealthMode"
      class="fixed bottom-4 right-4 z-30 font-mono select-none"
    >
      <div class="cyber-panel border border-cyber-amber rounded-lg shadow-glow-amber overflow-hidden max-w-sm w-80 backdrop-blur-md bg-terminal-panel/95 transition-all">
        <!-- Dock Header -->
        <div class="px-3 py-2 bg-terminal-surface border-b border-terminal-border flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-cyber-red animate-pulse shadow-glow-red"></span>
            <span class="text-xs font-bold text-cyber-amber tracking-wider flex items-center space-x-1">
              <IconBroadcast :size="14" />
              <span>CREATOR MODE</span>
            </span>
            <span class="text-[10px] px-1 py-0.2 rounded bg-cyber-red/20 text-cyber-red border border-cyber-red/30">
              REC ●
            </span>
          </div>

          <div class="flex items-center space-x-1 text-terminal-muted">
            <button
              @click="store.toggleCreatorStealth()"
              class="p-1 hover:text-white rounded hover:bg-terminal-border/50 transition text-[11px]"
              title="Stealth Mode: Hide HUD for clean screen capture (Hotkeys remain active)"
            >
              <IconEyeOff :size="14" />
            </button>
            <button
              @click="isExpanded = !isExpanded"
              class="p-1 hover:text-white rounded hover:bg-terminal-border/50 transition"
              title="Collapse / Expand Creator Controls"
            >
              <IconChevronDown v-if="isExpanded" :size="14" />
              <IconChevronUp v-else :size="14" />
            </button>
          </div>
        </div>

        <!-- Collapsed Bar preview -->
        <div
          v-if="!isExpanded"
          @click="isExpanded = true"
          class="p-2 text-xs flex items-center justify-between cursor-pointer hover:bg-terminal-surface/40 transition"
        >
          <div class="flex items-center space-x-2">
            <AssetIcon v-if="selectedAsset" :symbol="selectedAsset.symbol" :size="16" />
            <span class="text-white font-bold">{{ selectedAsset?.symbol }}</span>
            <span class="text-[11px] text-terminal-muted">${{ selectedAsset?.current_price.toFixed(2) }}</span>
          </div>
          <div class="flex items-center space-x-1 text-[10px]">
            <span class="text-cyber-green font-bold">[Ctrl+G]</span>
            <span class="text-cyber-red font-bold">[Ctrl+R]</span>
          </div>
        </div>

        <!-- Expanded Control Panel -->
        <div v-else class="p-3 space-y-3 text-xs">
          <!-- Target Selector -->
          <div class="flex items-center justify-between bg-terminal-surface p-2 rounded border border-terminal-border">
            <div class="flex items-center space-x-2 min-w-0">
              <AssetIcon v-if="selectedAsset" :symbol="selectedAsset.symbol" :size="20" />
              <div class="truncate">
                <span class="text-white font-bold block leading-none">{{ selectedAsset?.symbol }}</span>
                <span class="text-[10px] text-terminal-muted">{{ selectedAsset?.name }}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold text-white text-xs">${{ selectedAsset?.current_price.toFixed(2) }}</div>
              <div
                class="text-[10px] font-bold"
                :class="(selectedAsset?.change_24h_pct ?? 0) >= 0 ? 'text-cyber-green' : 'text-cyber-red'"
              >
                {{ (selectedAsset?.change_24h_pct ?? 0) >= 0 ? '+' : '' }}{{ selectedAsset?.change_24h_pct.toFixed(2) }}%
              </div>
            </div>
          </div>

          <!-- Main Hotkey Buttons: Ctrl+G (Green) & Ctrl+R (Red) -->
          <div class="grid grid-cols-2 gap-2">
            <!-- PUMP GREEN BUTTON -->
            <button
              @click="triggerPump()"
              class="py-2.5 px-2 rounded bg-cyber-green/20 border border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-black font-bold transition flex flex-col items-center justify-center space-y-0.5 group shadow-glow-green"
              title="Shortcut: Press Ctrl + G to pump"
            >
              <div class="flex items-center space-x-1">
                <IconTrendingUp :size="16" class="group-hover:scale-125 transition" />
                <span class="text-xs">PUMP GREEN</span>
              </div>
              <div class="text-[10px] font-mono opacity-90">
                Ctrl + G <span class="text-[9px]">(+{{ magnitudePercent }}%)</span>
              </div>
            </button>

            <!-- DUMP RED BUTTON -->
            <button
              @click="triggerDump()"
              class="py-2.5 px-2 rounded bg-cyber-red/20 border border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-black font-bold transition flex flex-col items-center justify-center space-y-0.5 group shadow-glow-red"
              title="Shortcut: Press Ctrl + R to dump"
            >
              <div class="flex items-center space-x-1">
                <IconTrendingDown :size="16" class="group-hover:scale-125 transition" />
                <span class="text-xs">DUMP RED</span>
              </div>
              <div class="text-[10px] font-mono opacity-90">
                Ctrl + R <span class="text-[9px]">(-{{ magnitudePercent }}%)</span>
              </div>
            </button>
          </div>

          <!-- Power Presets -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-[10px] text-terminal-muted">
              <span>QUICK POWER PRESETS:</span>
              <span>Step: {{ magnitudePercent }}%</span>
            </div>
            <div class="grid grid-cols-4 gap-1.5 text-[11px] font-bold">
              <button
                @click="setMagnitude(2)"
                :class="magnitudePercent === 2 ? 'bg-cyber-blue text-black' : 'bg-terminal-surface text-terminal-text hover:text-white'"
                class="py-1 rounded border border-terminal-border transition"
              >
                2%
              </button>
              <button
                @click="setMagnitude(5)"
                :class="magnitudePercent === 5 ? 'bg-cyber-blue text-black' : 'bg-terminal-surface text-terminal-text hover:text-white'"
                class="py-1 rounded border border-terminal-border transition"
              >
                5% (Std)
              </button>
              <button
                @click="setMagnitude(15)"
                :class="magnitudePercent === 15 ? 'bg-cyber-blue text-black' : 'bg-terminal-surface text-terminal-text hover:text-white'"
                class="py-1 rounded border border-terminal-border transition"
              >
                15%
              </button>
              <button
                @click="setMagnitude(50)"
                :class="magnitudePercent === 50 ? 'bg-cyber-blue text-black' : 'bg-terminal-surface text-terminal-text hover:text-white'"
                class="py-1 rounded border border-terminal-border transition"
              >
                50% 🚀
              </button>
            </div>
          </div>

          <!-- Extreme Shock Actions: To The Moon & Rug Pull -->
          <div class="grid grid-cols-2 gap-2 pt-1 border-t border-terminal-border text-[10px]">
            <button
              @click="triggerPump(0.25)"
              class="py-1.5 px-2 rounded bg-terminal-surface border border-cyber-green/50 hover:border-cyber-green text-cyber-green hover:bg-cyber-green/10 transition flex items-center justify-center space-x-1 font-bold"
            >
              <IconRocket :size="12" />
              <span>TO THE MOON (+25%)</span>
            </button>
            <button
              @click="triggerDump(0.25)"
              class="py-1.5 px-2 rounded bg-terminal-surface border border-cyber-red/50 hover:border-cyber-red text-cyber-red hover:bg-cyber-red/10 transition flex items-center justify-center space-x-1 font-bold"
            >
              <IconFlame :size="12" />
              <span>RUG PULL (-25%)</span>
            </button>
          </div>

          <!-- Target All Toggle & Stealth Hint -->
          <div class="flex items-center justify-between text-[10px] text-terminal-muted pt-1 border-t border-terminal-border">
            <label class="flex items-center space-x-1.5 cursor-pointer hover:text-white transition">
              <input
                type="checkbox"
                v-model="store.creatorTargetAll"
                class="accent-cyber-amber rounded"
              />
              <span>Target All Markets</span>
            </label>

            <button
              @click="store.toggleCreatorStealth()"
              class="hover:text-cyber-amber transition"
              title="Hides this overlay while recording"
            >
              [Stealth Mode]
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Discrete Floating Button when in Stealth Mode to un-hide -->
    <div
      v-else-if="store.creatorModeActive && store.creatorStealthMode"
      class="fixed bottom-3 right-3 z-30 font-mono"
    >
      <button
        @click="store.toggleCreatorStealth()"
        class="flex items-center space-x-1 px-2 py-1 rounded bg-black/60 border border-cyber-amber/30 text-cyber-amber text-[10px] hover:border-cyber-amber transition opacity-40 hover:opacity-100"
        title="Creator Mode is running in Stealth Mode. Hotkeys Ctrl+G & Ctrl+R are live. Click to show HUD."
      >
        <span class="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse"></span>
        <span>REC (Ctrl+G / Ctrl+R)</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.flash-enter-active,
.flash-leave-active {
  transition: opacity 0.3s ease;
}

.flash-enter-from,
.flash-leave-to {
  opacity: 0;
}
</style>
