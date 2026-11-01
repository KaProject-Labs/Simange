<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number | string;
    showText?: boolean;
    showSubtitle?: boolean;
    glow?: boolean;
  }>(),
  {
    size: 36,
    showText: true,
    showSubtitle: true,
    glow: true,
  }
);
</script>

<template>
  <div class="inline-flex items-center space-x-2 select-none font-mono">
    <!-- SVG Emblem Badge -->
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="flex-shrink-0 transition-transform hover:scale-105"
    >
      <defs>
        <linearGradient id="logoSgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00e5ff" />
          <stop offset="50%" stop-color="#00f796" />
          <stop offset="100%" stop-color="#00b4d8" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Hex Frame -->
      <polygon
        points="50,3 93,26 93,74 50,97 7,74 7,26"
        fill="#111827"
        stroke="url(#logoSgGrad)"
        stroke-width="3"
        stroke-linejoin="round"
        :filter="glow ? 'url(#logoGlow)' : undefined"
      />

      <!-- Grid ticks -->
      <line x1="25" y1="30" x2="75" y2="30" stroke="#243048" stroke-width="1" stroke-dasharray="2 2" />
      <line x1="18" y1="50" x2="82" y2="50" stroke="#243048" stroke-width="1" stroke-dasharray="2 2" />
      <line x1="25" y1="70" x2="75" y2="70" stroke="#243048" stroke-width="1" stroke-dasharray="2 2" />

      <!-- Candlestick Bar 1 (Red) -->
      <line x1="30" y1="38" x2="30" y2="70" stroke="#ff3366" stroke-width="1.8" />
      <rect x="27" y="46" width="6" height="16" fill="#ff3366" rx="1" />

      <!-- Candlestick Bar 2 (Cyan) -->
      <line x1="50" y1="24" x2="50" y2="76" stroke="#00e5ff" stroke-width="1.8" />
      <rect x="47" y="32" width="6" height="30" fill="#00e5ff" rx="1" />

      <!-- Candlestick Bar 3 (Green) -->
      <line x1="70" y1="14" x2="70" y2="60" stroke="#00f796" stroke-width="1.8" />
      <rect x="67" y="18" width="6" height="30" fill="#00f796" rx="1" />

      <!-- Dynamic Market Wave (S Curve) -->
      <path
        d="M 18,72 Q 40,78 50,50 T 82,24"
        fill="none"
        stroke="url(#logoSgGrad)"
        stroke-width="3.5"
        stroke-linecap="round"
        :filter="glow ? 'url(#logoGlow)' : undefined"
      />

      <!-- Wave Nodes -->
      <circle cx="18" cy="72" r="3" fill="#ff3366" />
      <circle cx="50" cy="50" r="3.5" fill="#00e5ff" />
      <circle cx="82" cy="24" r="4.5" fill="#00f796" />
    </svg>

    <!-- Typography (Optional) -->
    <div v-if="showText" class="flex flex-col leading-none">
      <div class="flex items-center space-x-1.5">
        <span class="font-black text-white tracking-widest text-base">SIMANGE</span>
        <span class="text-[9px] px-1.5 py-0.5 rounded bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30 font-bold">
          FOSS
        </span>
      </div>
      <span v-if="showSubtitle" class="text-[10px] text-terminal-muted tracking-wider mt-0.5 uppercase">
        Simulation of Exchange
      </span>
    </div>
  </div>
</template>
