import { defineStore } from 'pinia';

export interface UserSession {
  username: string;
  email: string;
  role: string;
  simulatedBalance: number;
  avatar: string;
  twoFactorEnabled: boolean;
  token: string;
  loginTime: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    let savedUser: UserSession | null = null;
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem('simange_auth_user');
        if (raw) savedUser = JSON.parse(raw);
      } catch (e) {
        console.warn('Failed to parse saved user session:', e);
      }
    }

    return {
      currentUser: savedUser,
      showLoginModal: false,
      loginModalTab: 'signin' as 'signin' | 'register' | 'guest',
      authNotice: null as { message: string; isSuccess: boolean } | null,
    };
  },

  getters: {
    isAuthenticated: (state) => state.currentUser !== null,
    displayName: (state) => state.currentUser?.username ?? 'Guest Trader',
    userRole: (state) => state.currentUser?.role ?? 'Unverified Terminal Guest',
    balance: (state) => state.currentUser?.simulatedBalance ?? 25000,
  },

  actions: {
    openLoginModal(tab: 'signin' | 'register' | 'guest' = 'signin') {
      this.loginModalTab = tab;
      this.showLoginModal = true;
      this.authNotice = null;
    },

    closeLoginModal() {
      this.showLoginModal = false;
      this.authNotice = null;
    },

    signIn(username: string, _pass?: string, _twoFactor?: string): boolean {
      if (!username || username.trim().length === 0) {
        this.authNotice = { message: 'Terminal Handle / Username is required.', isSuccess: false };
        return false;
      }

      const cleanUser = username.trim();
      let role = 'Registered Trader';
      let balance = 100000;
      let avatar = '👤';

      if (cleanUser.toLowerCase().includes('whale')) {
        role = 'Institutional Whale Chad';
        balance = 5000000;
        avatar = '🐋';
      } else if (cleanUser.toLowerCase().includes('stream') || cleanUser.toLowerCase().includes('creator')) {
        role = 'Verified Content Creator VIP';
        balance = 1000000;
        avatar = '🎬';
      } else if (cleanUser.toLowerCase().includes('admin') || cleanUser.toLowerCase().includes('ka')) {
        role = 'KaProject Core Architect';
        balance = 100000000;
        avatar = '🛡️';
      }

      const session: UserSession = {
        username: cleanUser,
        email: `${cleanUser.toLowerCase()}@terminal.simange.ka`,
        role,
        simulatedBalance: balance,
        avatar,
        twoFactorEnabled: true,
        token: `SIMANGE-JWT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        loginTime: new Date().toLocaleTimeString(),
      };

      this.currentUser = session;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('simange_auth_user', JSON.stringify(session));
      }

      this.authNotice = {
        message: `Welcome to Simange Terminal, ${cleanUser}! Authentication verified.`,
        isSuccess: true,
      };

      setTimeout(() => {
        this.closeLoginModal();
      }, 1000);

      return true;
    },

    register(username: string, email: string, role = 'Registered Trader'): boolean {
      if (!username || username.trim().length === 0) {
        this.authNotice = { message: 'Username cannot be blank.', isSuccess: false };
        return false;
      }

      const cleanUser = username.trim();
      const session: UserSession = {
        username: cleanUser,
        email: email || `${cleanUser.toLowerCase()}@simange.ka`,
        role: role || 'Pro Terminal Trader',
        simulatedBalance: 50000,
        avatar: '🚀',
        twoFactorEnabled: false,
        token: `SIMANGE-NEW-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        loginTime: new Date().toLocaleTimeString(),
      };

      this.currentUser = session;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('simange_auth_user', JSON.stringify(session));
      }

      this.authNotice = {
        message: `Simulated Account initialized! Registered as ${cleanUser}.`,
        isSuccess: true,
      };

      setTimeout(() => {
        this.closeLoginModal();
      }, 1000);

      return true;
    },

    quickLoginPreset(preset: 'whale' | 'creator' | 'admin') {
      if (preset === 'whale') {
        this.signIn('CyberWhale_99');
      } else if (preset === 'creator') {
        this.signIn('StreamMaster_X');
      } else {
        this.signIn('KaProject_Admin');
      }
    },

    guestAccess() {
      const randId = Math.floor(1000 + Math.random() * 9000);
      const guestName = `Runner_${randId}`;
      const session: UserSession = {
        username: guestName,
        email: `guest_${randId}@anonymous.local`,
        role: 'Temporary Guest Trader',
        simulatedBalance: 25000,
        avatar: '⚡',
        twoFactorEnabled: false,
        token: `GUEST-TEMP-${randId}`,
        loginTime: new Date().toLocaleTimeString(),
      };

      this.currentUser = session;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('simange_auth_user', JSON.stringify(session));
      }

      this.authNotice = {
        message: `Instant Guest Access granted as ${guestName}.`,
        isSuccess: true,
      };

      setTimeout(() => {
        this.closeLoginModal();
      }, 800);
    },

    signOut() {
      this.currentUser = null;
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('simange_auth_user');
      }
    },
  },
});
