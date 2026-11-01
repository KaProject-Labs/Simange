<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import SimangeLogo from './SimangeLogo.vue';
import {
  IconLock,
  IconUser,
  IconMail,
  IconShieldCheck,
  IconKey,
  IconBolt,
  IconCheck,
} from '@tabler/icons-vue';

const authStore = useAuthStore();

// Form states
const usernameInput = ref('');
const passwordInput = ref('');
const twoFactorInput = ref('');
const rememberMe = ref(true);

const regUsername = ref('');
const regEmail = ref('');
const regRole = ref('Day Trader');
const regPassword = ref('');

const isLoading = ref(false);

function handleSignIn() {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    authStore.signIn(usernameInput.value, passwordInput.value, twoFactorInput.value);
  }, 450);
}

function handleRegister() {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    authStore.register(regUsername.value, regEmail.value, regRole.value);
  }, 450);
}

function handleGuest() {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    authStore.guestAccess();
  }, 350);
}

function selectPreset(preset: 'whale' | 'creator' | 'admin') {
  if (preset === 'whale') {
    usernameInput.value = 'CyberWhale_99';
    passwordInput.value = '••••••••';
    twoFactorInput.value = '849201';
  } else if (preset === 'creator') {
    usernameInput.value = 'StreamMaster_X';
    passwordInput.value = '••••••••';
    twoFactorInput.value = '419082';
  } else {
    usernameInput.value = 'KaProject_Admin';
    passwordInput.value = '••••••••';
    twoFactorInput.value = '999000';
  }
}
</script>

<template>
  <div
    v-if="authStore.showLoginModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none font-mono"
  >
    <div class="max-w-md w-full cyber-panel border-2 border-cyber-cyan p-6 rounded-xl shadow-glow-cyan space-y-5 animate-in fade-in duration-200 bg-terminal-panel/95">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-terminal-border pb-3">
        <div class="flex items-center space-x-2.5">
          <SimangeLogo :size="24" :showText="false" />
          <div>
            <div class="text-[10px] text-cyber-cyan font-bold tracking-widest uppercase flex items-center space-x-1.5">
              <span class="w-2 h-2 rounded-full bg-cyber-green animate-ping"></span>
              <span>KAPROJECT LABS // AUTHENTICATION</span>
            </div>
            <h2 class="text-base font-bold text-white tracking-wider">
              PROTOTYPE LOGIN SYSTEM
            </h2>
          </div>
        </div>
        <button
          @click="authStore.closeLoginModal"
          class="text-terminal-muted hover:text-white p-1 rounded transition text-base"
        >
          ✕
        </button>
      </div>

      <!-- Auth Notice Banner -->
      <transition name="fade">
        <div
          v-if="authStore.authNotice"
          :class="[
            'p-2.5 rounded text-xs flex items-center space-x-2 border',
            authStore.authNotice.isSuccess
              ? 'bg-cyber-green/15 border-cyber-green/40 text-cyber-green shadow-glow-green'
              : 'bg-cyber-red/15 border-cyber-red/40 text-cyber-red shadow-glow-red'
          ]"
        >
          <IconCheck v-if="authStore.authNotice.isSuccess" :size="16" />
          <span v-else>⚠️</span>
          <span>{{ authStore.authNotice.message }}</span>
        </div>
      </transition>

      <!-- Navigation Tabs (Sign In / Register / Guest) -->
      <div class="flex items-center space-x-1 bg-terminal-surface p-1 rounded-lg border border-terminal-border text-xs">
        <button
          @click="authStore.loginModalTab = 'signin'"
          :class="[
            'flex-1 py-1.5 rounded transition font-bold text-center',
            authStore.loginModalTab === 'signin'
              ? 'bg-cyber-blue text-black shadow-glow-blue'
              : 'text-terminal-muted hover:text-white'
          ]"
        >
          Sign In
        </button>
        <button
          @click="authStore.loginModalTab = 'register'"
          :class="[
            'flex-1 py-1.5 rounded transition font-bold text-center',
            authStore.loginModalTab === 'register'
              ? 'bg-cyber-blue text-black shadow-glow-blue'
              : 'text-terminal-muted hover:text-white'
          ]"
        >
          Register
        </button>
        <button
          @click="authStore.loginModalTab = 'guest'"
          :class="[
            'flex-1 py-1.5 rounded transition font-bold text-center',
            authStore.loginModalTab === 'guest'
              ? 'bg-cyber-blue text-black shadow-glow-blue'
              : 'text-terminal-muted hover:text-white'
          ]"
        >
          Instant Guest
        </button>
      </div>

      <!-- TAB 1: SIGN IN -->
      <form v-if="authStore.loginModalTab === 'signin'" @submit.prevent="handleSignIn" class="space-y-4 text-xs">
        <!-- Quick Preset Badges -->
        <div class="space-y-1.5">
          <span class="text-[10px] text-terminal-muted uppercase block">Quick Prototype Profiles:</span>
          <div class="grid grid-cols-3 gap-2 text-[10px]">
            <button
              type="button"
              @click="selectPreset('whale')"
              class="p-2 rounded bg-terminal-surface border border-terminal-border hover:border-cyber-blue text-left space-y-0.5 transition"
            >
              <div class="text-white font-bold flex items-center space-x-1">
                <span>🐋</span>
                <span class="truncate">Whale_99</span>
              </div>
              <div class="text-cyber-green">$5.0M Cap</div>
            </button>

            <button
              type="button"
              @click="selectPreset('creator')"
              class="p-2 rounded bg-terminal-surface border border-terminal-border hover:border-cyber-amber text-left space-y-0.5 transition"
            >
              <div class="text-white font-bold flex items-center space-x-1">
                <span>🎬</span>
                <span class="truncate">Creator_X</span>
              </div>
              <div class="text-cyber-amber">Stream VIP</div>
            </button>

            <button
              type="button"
              @click="selectPreset('admin')"
              class="p-2 rounded bg-terminal-surface border border-terminal-border hover:border-cyber-cyan text-left space-y-0.5 transition"
            >
              <div class="text-white font-bold flex items-center space-x-1">
                <span>🛡️</span>
                <span class="truncate">Ka_Admin</span>
              </div>
              <div class="text-cyber-cyan">Architect</div>
            </button>
          </div>
        </div>

        <!-- Handle Input -->
        <div class="space-y-1">
          <label class="text-[10px] text-terminal-muted uppercase">Terminal Callsign / Email</label>
          <div class="flex items-center space-x-2 bg-terminal-surface border border-terminal-border rounded px-3 py-2 focus-within:border-cyber-blue transition">
            <IconUser :size="14" class="text-terminal-muted" />
            <input
              v-model="usernameInput"
              type="text"
              placeholder="e.g. CyberWhale_99"
              class="bg-transparent text-white outline-none w-full text-xs font-mono"
              required
            />
          </div>
        </div>

        <!-- Passphrase Input -->
        <div class="space-y-1">
          <label class="text-[10px] text-terminal-muted uppercase">Security Key / Passphrase</label>
          <div class="flex items-center space-x-2 bg-terminal-surface border border-terminal-border rounded px-3 py-2 focus-within:border-cyber-blue transition">
            <IconLock :size="14" class="text-terminal-muted" />
            <input
              v-model="passwordInput"
              type="password"
              placeholder="••••••••••••"
              class="bg-transparent text-white outline-none w-full text-xs font-mono"
            />
          </div>
        </div>

        <!-- Simulated 2FA Token -->
        <div class="space-y-1">
          <label class="text-[10px] text-terminal-muted uppercase flex items-center justify-between">
            <span>Simulated 2FA Authenticator (Optional)</span>
            <span class="text-cyber-green text-[9px]">ENCRYPTED</span>
          </label>
          <div class="flex items-center space-x-2 bg-terminal-surface border border-terminal-border rounded px-3 py-2 focus-within:border-cyber-green transition">
            <IconShieldCheck :size="14" class="text-cyber-green" />
            <input
              v-model="twoFactorInput"
              type="text"
              maxlength="6"
              placeholder="6-digit TOTP (e.g. 849201)"
              class="bg-transparent text-white outline-none w-full text-xs font-mono tracking-widest"
            />
          </div>
        </div>

        <!-- Remember Me Toggle -->
        <div class="flex items-center justify-between text-[11px] text-terminal-muted pt-1">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" v-model="rememberMe" class="accent-cyber-blue rounded" />
            <span>Persist Client Session</span>
          </label>
          <span class="text-cyber-blue">KaProject Cloud Sync</span>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 rounded-lg bg-cyber-blue text-black font-bold uppercase tracking-wider hover:bg-cyber-blue/90 transition shadow-glow-blue flex items-center justify-center space-x-2 text-xs"
        >
          <span v-if="isLoading">AUTHENTICATING...</span>
          <span v-else>ACCESS TERMINAL ACCOUNT →</span>
        </button>
      </form>

      <!-- TAB 2: REGISTER -->
      <form v-else-if="authStore.loginModalTab === 'register'" @submit.prevent="handleRegister" class="space-y-3.5 text-xs">
        <div class="space-y-1">
          <label class="text-[10px] text-terminal-muted uppercase">Terminal Handle</label>
          <div class="flex items-center space-x-2 bg-terminal-surface border border-terminal-border rounded px-3 py-2">
            <IconUser :size="14" class="text-terminal-muted" />
            <input
              v-model="regUsername"
              type="text"
              placeholder="Choose unique trader tag"
              class="bg-transparent text-white outline-none w-full text-xs"
              required
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] text-terminal-muted uppercase">Encrypted Mail</label>
          <div class="flex items-center space-x-2 bg-terminal-surface border border-terminal-border rounded px-3 py-2">
            <IconMail :size="14" class="text-terminal-muted" />
            <input
              v-model="regEmail"
              type="email"
              placeholder="trader@simange.ka"
              class="bg-transparent text-white outline-none w-full text-xs"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] text-terminal-muted uppercase">Specialization Class</label>
          <select
            v-model="regRole"
            class="w-full bg-terminal-surface border border-terminal-border rounded px-3 py-2 text-white outline-none focus:border-cyber-blue text-xs font-mono"
          >
            <option value="Algorithmic Quantitative Trader">Algorithmic Quantitative Trader</option>
            <option value="Meme Token Degenerate">Meme Token Degenerate</option>
            <option value="Verified Content Creator VIP">Verified Content Creator VIP</option>
            <option value="Institutional Macro Hedge Fund">Institutional Macro Hedge Fund</option>
          </select>
        </div>

        <div class="space-y-1">
          <label class="text-[10px] text-terminal-muted uppercase">Passphrase</label>
          <div class="flex items-center space-x-2 bg-terminal-surface border border-terminal-border rounded px-3 py-2">
            <IconKey :size="14" class="text-terminal-muted" />
            <input
              v-model="regPassword"
              type="password"
              placeholder="Create secure passphrase"
              class="bg-transparent text-white outline-none w-full text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 rounded-lg bg-cyber-green text-black font-bold uppercase tracking-wider hover:bg-cyber-green/90 transition shadow-glow-green flex items-center justify-center space-x-2 text-xs"
        >
          <span v-if="isLoading">GENERATING SIMULATED WALLET...</span>
          <span v-else>INITIALIZE ACCOUNT &amp; WALLET</span>
        </button>
      </form>

      <!-- TAB 3: INSTANT GUEST -->
      <div v-else-if="authStore.loginModalTab === 'guest'" class="space-y-4 text-xs">
        <div class="cyber-panel p-4 rounded-lg border border-terminal-border bg-black/40 space-y-2">
          <div class="flex items-center space-x-2 text-cyber-blue font-bold">
            <IconBolt :size="18" />
            <span>ONE-CLICK ANONYMOUS GUEST ACCESS</span>
          </div>
          <p class="text-[11px] text-terminal-muted leading-relaxed">
            Instantly allocates a randomized cyberpunk callsign (e.g. <code class="text-white">Runner_4091</code>) with $25,000 in simulated sandbox funds. No credentials or registration required.
          </p>
        </div>

        <button
          @click="handleGuest"
          :disabled="isLoading"
          class="w-full py-3.5 rounded-lg bg-cyber-blue text-black font-bold uppercase tracking-wider hover:bg-cyber-blue/90 transition shadow-glow-blue flex items-center justify-center space-x-2 text-xs"
        >
          <span v-if="isLoading">ALLOCATING GUEST KEYS...</span>
          <span v-else>ENTER TERMINAL AS GUEST →</span>
        </button>
      </div>

      <!-- Footer Info -->
      <div class="text-[10px] text-terminal-muted text-center pt-2 border-t border-terminal-border/60">
        Simange Prototype Authentication • KaProject Labs Sovereign Architecture
      </div>
    </div>
  </div>
</template>
