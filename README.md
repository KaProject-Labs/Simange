# Simange (Simulation of Exchange)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Built with Tauri](https://img.shields.io/badge/Tauri-v2-24C8D8.svg?logo=tauri&logoColor=white)](https://tauri.app)
[![Powered by Bun](https://img.shields.io/badge/Bun-%23000000.svg?logo=bun&logoColor=white)](https://bun.sh)
[![Vue 3](https://img.shields.io/badge/Vue.js-3.5-4FC08D.svg?logo=vue.js&logoColor=white)](https://vuejs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Maintained by KaProject Labs](https://img.shields.io/badge/KaProject--Labs-Simange-00e5ff.svg)](https://github.com/KaProject-Labs/Simange)

**Simange** (Simulation of Exchange) is a Free and Open Source Software (FOSS) high-frequency financial trading terminal and market simulator developed and maintained by **KaProject Labs**. Featuring a cyberpunk Bloomberg-style terminal aesthetic, Simange pits players against volatile parody asset markets driven by real-time stochastic random walk models, Poisson jump diffusions, breaking hype/FUD news events, dynamic order books, and livestream market manipulation tools.

Repository: **[https://github.com/KaProject-Labs/Simange](https://github.com/KaProject-Labs/Simange)**  
Copyright: **© 2026 KaProject Labs. All rights reserved.**

---

## 🚀 Key Features

### 1. 17 Parody Assets with Simple Icons
Trade satire parodies of global cryptocurrencies and mega-cap tech stocks:

| Asset Name | Ticker | Category | Parody Of | Characteristics |
| :--- | :---: | :---: | :--- | :--- |
| **Bytecoin** | `BYTE` | Crypto | Bitcoin (BTC) | The pioneer digital store-of-value. High liquidity & macro-correlated. |
| **Aethereum** | `AETH` | Crypto | Ethereum (ETH) | Smart contract powerhouse subject to gas fee spikes & upgrade narratives. |
| **Solona** | `SOLA` | Crypto | Solana (SOL) | Ultra-fast Layer 1 with lightning throughput whenever validators stay up. |
| **MeowCoin** | `MEOW` | Crypto | Dogecoin (DOGE) | Feline community meme token subject to massive 800% pump & dump influencer shocks. |
| **USD-Fake** | `USDF` | Crypto | Tether (USDT) | Algorithmic stablecoin anchored at $1.00 with occasional mild depeg events. |
| **Pear Inc.** | `PEAR` | Stock | Apple (AAPL) | Consumer hardware & services giant. Stable dividend growth and reliable revenue. |
| **MicroHard** | `MHD` | Stock | Microsoft (MSFT) | Enterprise cloud & office AI juggernaut. Low volatility and consistent buybacks. |
| **MuskCar** | `TSLA-X` | Stock | Tesla (TSLA) | Autonomous EV & humanoid robot maker led by an eccentric memetic CEO. |
| **Nvidiot** | `PIXL` | Stock | Nvidia (NVDA) | GPU silicon monopolizer powering the global artificial intelligence bubble. |
| **Googol** | `GOOG` | Stock | Google Alphabet | Omnipresent search index & cloud datacenter monopoly. |
| **Mate Corp** | `MATE` | Stock | Meta Platforms | Social media attention economy driver and VR headset experimenter. |
| **XennonMobile** | `XOMM` | Stock | ExxonMobil | Fossil energy conglomerate and commodity dividend anchor. |
| **Sergei Manly** | `MS-M` | Stock | Morgan Stanley | Wall Street investment banking titan and prime liquidity provider. |
| **Baeing** | `BA-E` | Stock | Boeing | Aerospace defense contractor with turbulent quarterly engineering quality checks. |
| **CCN** | `CCN` | Stock | CNN / Media | 24/7 breaking panic broadcast conglomerate driving volatility. |
| **American Bank**| `AMBK` | Stock | Bank of America | Traditional retail banking & federal reserve repo window lender. |
| **Boreclay** | `BCLY` | Stock | Barclays | Transatlantic institutional credit issuer and forex dealer. |

---

### 2. Game Modes & Content Creator Isolation

1. **Stock Exchange Mode:** 12 stable corporate tech and banking equities. Slower macro pace, quarterly earnings reports, and dividend payouts. Starting Capital: **$25,000**.
2. **Cryptocurrency Mode:** 24/7 hyper-volatility with extreme swings (`BYTE`, `AETH`, `SOLA`, `MEOW`, `USDF`). Real-time Hype/FUD social feed shocks. Starting Capital: **$10,000**.
3. **Test Mode (Sandbox):** Unlimited capital ($100,000,000). All 17 cryptos and stocks active simultaneously. Time speed adjustable up to 5x.
4. **Custom Mode:** Fully configurable starting cash ($1,000 – $1,000,000), volatility multiplier slider (0.2x – 5.0x), and individual active asset selections.
5. **Content Creator Mode (Disabled in Default Setting):**
   - **Default Setting:** Content Creator Mode is **Disabled by Default** to protect organic simulation records and rankings.
   - **Session Isolation:** Attempting to activate Content Creator Mode (via Settings, Header Bar, Pause Menu, or hotkeys `Ctrl+Shift+C`, `Ctrl+G`, `Ctrl+R`) prompts the launch of a **New Simulation Session**!
   - **Market Universe Picker:** Choose whether to launch the Creator Session in the **Stock Exchange Universe** (12 stocks) or **Cryptocurrency Universe** (5 cryptos).
   - **Real-Time Market Controls:**
     - **`Ctrl + G` (Force Bull Pump):** Surge asset price upward (+5% to +50%).
     - **`Ctrl + R` (Force Bear Dump):** Trigger instant price crash (-5% to -50%).
     - **`Ctrl + Shift + C` (Stealth Mode Dock):** Hide the creator control HUD from OBS / video capture while hotkeys remain live.

---

### 3. Rebuilt Settings & Legal Directives

Simange includes a comprehensive 5-tab settings system:

- **1. General Setting:**
  - Web Audio API SFX toggle & volume
  - Official Soundtrack (OST BGM) toggle, volume, and playback
  - Retro CRT scanline phosphor shader toggle
  - Content Creator Mode status and New Session launcher
  - Local savegame storage inspection and data purge
- **2. Privacy Policy:**
  - 100% Client-Side execution guarantee: zero telemetries, no tracking cookies, no personal data collection or analytics. Full user data sovereignty.
- **3. Terms of Service:**
  - Educational simulation and satirical parody notice. All equities and cryptos are fictional commentary. Not financial advice. Free worldwide streaming/monetization rights.
- **4. Third-Party License:**
  - Complete legal attribution for Vue 3, Tauri v2, Simple Icons, Tabler Icons, Tailwind CSS, Bun, Vite, Pinia, and media assets.
- **5. About this Project:**
  - Architectural overview, KaProject Labs authorship, GNU GPL-3.0 copyleft terms, and repository links.

---

### 4. 🌐 Official Project Website & Prototype Login System

The official project website is built natively with **Vue 3** (`website.html` and embedded in the CyberNet in-game browser):
- **Prototype Login System:**
  - High-tech authentication modal with **Sign In**, **Register**, and **Instant Guest Access**.
  - Demo profiles for quick testing (`CyberWhale_99`, `StreamMaster_X`, `KaProject_Admin`).
  - Simulated 2FA TOTP token verification and persistent client session tokens in `localStorage`.
  - Reactive user badge displaying avatar, handle, role, and simulated wallet balance.
- **Interactive Candlestick Terminal Playground:**
  - Real-time live candlestick SVG graph with Web Audio synthesizers.
  - Interactive Bull Pump and Bear Dump buttons with hotkey listeners (`Ctrl+G`, `Ctrl+R`).
- **Parody Assets & Tech Stack Catalogs:**
  - Interactive grid displaying all 17 parody tickers with Simple Icons and stats.

---

## 🛠️ Development & Building

### Prerequisites
- [Bun](https://bun.sh) (v1.0+)
- [Rust](https://rustup.rs) (1.75+ recommended)
- Standard Tauri prerequisites for your OS (C++ build tools on Windows; `libwebkit2gtk-4.1-dev` on Linux)

### Setup & Run
```bash
# 1. Clone repository from KaProject Labs
git clone https://github.com/KaProject-Labs/Simange.git
cd Simange

# 2. Install dependencies with Bun
bun install

# 3. Launch in desktop development mode (Tauri + Vite)
bun run tauri dev

# Or launch frontend web preview only:
bun run dev

# Or launch the official standalone project website:
bun run website
```

### Build Desktop Binaries
```bash
bun run tauri build
```
Compiled installers (`.msi`, `.exe`, `.deb`, `.AppImage`) will be generated under `src-tauri/target/release/bundle/`.

---

## 📜 License & Copyright

Simange is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.  
**Copyright © 2026 KaProject Labs. All rights reserved.**  
See [LICENSE](LICENSE) for the full license text.
