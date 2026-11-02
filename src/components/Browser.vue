<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useGameStore } from '../stores/gameStore';

const store = useGameStore();

// Verified Fiction domains with diverse real TLDs (.org, .com, .net, .io, .ai)
const FICTION_DOMAINS = [
  'wikitrade.org',
  'pear.com',
  'pear.org',
  'microhard.com',
  'microhard.org',
  'nvidiot.ai',
  'nvidiot.org',
  'muskcar.com',
  'muskcar.org',
  'bytecoin.org',
  'aethereum.io',
  'aethereum.org',
  'meowcoin.net',
  'meowcoin.org',
  'solona.net',
  'solona.org',
  'apeswallstreet.com',
  'apeswallstreet.org',
  'exsearch.net',
  'exsearch.org',
  'bloomberg-wire.net',
  'bloomberg-wire.org',
  'simange.io',
  'simange.org',
  'bronomy.search',
  'bronomy://settings',
  'bronomy://about',
  'bronomy.settings',
  'bronomy.about',
];

function isFiction(url: string): boolean {
  try {
    if (url.startsWith('bronomy://')) return true;
    const clean = url.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    return FICTION_DOMAINS.some((d) => clean === d || clean.endsWith('.' + d) || url.includes(d));
  } catch {
    return false;
  }
}

// ── Multi-Tab Architecture ──────────────────────────────────────────
export interface BrowserTab {
  id: string;
  title: string;
  icon: string;
  url: string;
  history: string[];
  historyIdx: number;
  wikiArticle: string | null;
  exSearchQuery: string;
  exSearchTab: 'all' | 'stocks' | 'crypto' | 'news';
  exSearchResults: Array<{ title: string; desc: string; url: string; tag: string }>;
}

function getDomainMeta(url: string, article?: string | null): { title: string; icon: string } {
  const clean = url.toLowerCase();
  if (clean.includes('bronomy://settings') || clean.includes('bronomy.settings')) {
    return { title: 'Bronomy Settings', icon: '⚙' };
  }
  if (clean.includes('bronomy://about') || clean.includes('bronomy.about')) {
    return { title: 'About Bronomy — The Stock Tech Company Inc.', icon: '⚡' };
  }
  if (clean.includes('wikitrade.org')) {
    return {
      title: article ? `WikiTrade: ${article}` : 'WikiTrade: Main Page',
      icon: '📖',
    };
  }
  if (clean.includes('pear.com') || clean.includes('pear.org')) {
    return { title: 'Pear.com: TitanPhone 17 Pro', icon: '🍏' };
  }
  if (clean.includes('nvidiot.ai') || clean.includes('nvidiot.org')) {
    return { title: 'Nvidiot.ai: Blackwell Supercomputing', icon: '🟩' };
  }
  if (clean.includes('muskcar.com') || clean.includes('muskcar.org')) {
    return { title: 'MuskCar.com: CyberTruck & Mars', icon: '🚀' };
  }
  if (clean.includes('bytecoin.org')) {
    return { title: 'Bytecoin.org: Sovereign Digital Gold', icon: '₿' };
  }
  if (clean.includes('aethereum.io') || clean.includes('aethereum.org')) {
    return { title: 'Aethereum.io: World Computer', icon: '💎' };
  }
  if (clean.includes('meowcoin.net') || clean.includes('meowcoin.org')) {
    return { title: 'MeowCoin.net: Feline Currency', icon: '🐱' };
  }
  if (clean.includes('apeswallstreet.com') || clean.includes('apeswallstreet.org')) {
    return { title: 'r/ApesOfWallStreet Forum', icon: '🦍' };
  }
  if (clean.includes('microhard.com') || clean.includes('microhard.org')) {
    return { title: 'MicroHard.com: Enterprise Cloud', icon: '💻' };
  }
  if (clean.includes('solona.net') || clean.includes('solona.org')) {
    return { title: 'Solona.net: High-Throughput L1', icon: '🟣' };
  }
  if (clean.includes('exsearch.net') || clean.includes('exsearch.org') || clean.includes('bronomy.search')) {
    return { title: 'Bronomy Search (powered by ExSearch)', icon: '🔍' };
  }
  if (clean.includes('bloomberg-wire.net') || clean.includes('bloomberg-wire.org')) {
    return { title: 'Bloomberg Wire: Real-time Terminal', icon: '📡' };
  }
  if (clean.includes('simange.io') || clean.includes('simange.org')) {
    return { title: 'Simange.io: Terminal Portal', icon: '🎮' };
  }
  return { title: clean.replace(/^https?:\/\//, ''), icon: '🌐' };
}

function createTab(initialUrl = 'https://bronomy.search/'): BrowserTab {
  const meta = getDomainMeta(initialUrl);
  return {
    id: 'tab_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title: meta.title,
    icon: meta.icon,
    url: initialUrl,
    history: [initialUrl],
    historyIdx: 0,
    wikiArticle: null,
    exSearchQuery: '',
    exSearchTab: 'all',
    exSearchResults: [],
  };
}

const tabs = ref<BrowserTab[]>([
  createTab('https://bronomy.search/'),
  createTab('https://wikitrade.org/'),
]);
const activeTabId = ref<string>(tabs.value[0].id);

const activeTab = computed(() => {
  return tabs.value.find((t) => t.id === activeTabId.value) || tabs.value[0];
});

const urlInput = ref(activeTab.value.url);

watch(
  () => activeTab.value,
  (t) => {
    if (t) {
      urlInput.value = t.url;
    }
  },
  { immediate: true }
);

function switchTab(id: string) {
  activeTabId.value = id;
}

function newTab(url = 'https://bronomy.search/') {
  const t = createTab(url);
  tabs.value.push(t);
  activeTabId.value = t.id;
}

function closeTab(id: string) {
  if (tabs.value.length === 1) {
    const only = tabs.value[0];
    only.url = 'https://bronomy.search/';
    only.history = ['https://bronomy.search/'];
    only.historyIdx = 0;
    only.wikiArticle = null;
    const meta = getDomainMeta(only.url);
    only.title = meta.title;
    only.icon = meta.icon;
    return;
  }

  const idx = tabs.value.findIndex((t) => t.id === id);
  if (idx !== -1) {
    const wasActive = activeTabId.value === id;
    tabs.value.splice(idx, 1);
    if (wasActive) {
      const nextIdx = Math.max(0, idx - 1);
      activeTabId.value = tabs.value[nextIdx].id;
    }
  }
}

// ── Bronomy Setup Wizard State ──────────────────────────────────────
const showBronomySetup = ref(false);
const setupStep = ref(1);
const setupSearchEngine = ref('Bronomy Search (powered by ExSearch)');
const setupAirGapEnforced = ref(true);

function completeSetup() {
  localStorage.setItem('bronomy_setup_completed', 'true');
  showBronomySetup.value = false;
  if (activeTab.value.url.includes('setup')) {
    navigateTo('https://bronomy.search/');
  }
}

function restartSetup() {
  setupStep.value = 1;
  showBronomySetup.value = true;
}

// ── Bronomy Settings & About State (The Stock Tech Company Inc.) ─────
const bronomySettingsTab = ref<'general' | 'security' | 'appearance' | 'about'>('general');
const defaultSearchEngine = ref('Bronomy Search (powered by ExSearch)');
const startupPageOption = ref('https://bronomy.search/');
const tabDensity = ref<'comfortable' | 'compact'>('comfortable');
const isCheckingUpdates = ref(false);
const updateCheckMessage = ref<string | null>(null);

function checkForUpdates() {
  isCheckingUpdates.value = true;
  updateCheckMessage.value = null;
  setTimeout(() => {
    isCheckingUpdates.value = false;
    updateCheckMessage.value = 'Bronomy is up to date — v1.4.2-sim (Build 2026.11) by The Stock Tech Company Inc.';
  }, 1200);
}

function clearBrowsingHistory() {
  tabs.value.forEach((t) => {
    t.history = [t.url];
    t.historyIdx = 0;
  });
  alert('Bronomy browsing history and session cache cleared successfully.');
}

// ── Shared Sub-Page & Widget States ─────────────────────────────────
const wikiSearchQuery = ref('');
const aethStakeInput = ref<number>(10);
const liveTps = ref(3240);
const isTpsStressed = ref(false);
let tpsInterval: ReturnType<typeof setInterval> | null = null;

// Bytecoin Halving Simulator
const halvingBlockHeight = ref(839916);
const halvingTarget = 840000;
const halvingSubsidy = computed(() => (halvingBlockHeight.value >= 840000 ? '3.125 BYTE' : '6.25 BYTE'));
const halvingConfetti = ref(false);

function advanceHalvingBlock() {
  halvingBlockHeight.value += 12;
  if (halvingBlockHeight.value >= halvingTarget) {
    halvingBlockHeight.value = halvingTarget;
    halvingConfetti.value = true;
    setTimeout(() => {
      halvingConfetti.value = false;
    }, 3000);
  }
}

// Pear.com interactive customizer
const titanStorage = ref('1TB');
const titanColor = ref('Space Titanium');
const titanEngraving = ref('');
const titanPrice = computed(() => {
  let base = 2499;
  if (titanStorage.value === '4TB') base += 600;
  if (titanStorage.value === '16TB Neural') base += 1800;
  return base;
});

// Nvidiot.ai Cluster Configurator
const gpuCount = ref(64);
const clusterPower = computed(() => (gpuCount.value * 0.85).toFixed(1));
const clusterCost = computed(() => (gpuCount.value * 35000).toLocaleString());

// MuskCar Random Tweet Generator
const elonTweets = [
  'Considering buying the Federal Reserve and converting it into a Proof-of-Stake validator on Mars. Funding secured.',
  'Next update for CyberTruck will allow it to serve as a floating yacht during sudden market liquidation floods.',
  'MeowCoin is technically the only currency that will function in zero gravity. The physics check out.',
  'FSD v42.0.69 is feature-complete. It now automatically buys 0DTE PEAR calls whenever you approach a red light.',
  'Selling all my physical possessions except for my flamethrower and 50,000 Bytecoins.',
  'If humanity cannot colonize Mars by 2030, I will personally buy all shares of MicroHard and make Clippy the CEO.',
];
const currentElonTweet = ref(elonTweets[0]);

function generateElonTweet() {
  const others = elonTweets.filter((t) => t !== currentElonTweet.value);
  currentElonTweet.value = others[Math.floor(Math.random() * others.length)];
}

// MeowSwap DEX Simulator
const meowSwapFrom = ref(100);
const meowSwapCurrency = ref('USDF');
const meowSwapOutput = computed(() => {
  const rate = meowSwapCurrency.value === 'USDF' ? 649.35 : 444480;
  return (meowSwapFrom.value * rate).toLocaleString(undefined, { maximumFractionDigits: 0 });
});

// MicroHard Enterprise CloudVault Calculator & Copilot
const mhEnterpriseSeats = ref(25000);
const mhCloudMonthlyUSD = computed(() => mhEnterpriseSeats.value * 18);
const mhCloudMonthlyBYTE = computed(() => (mhCloudMonthlyUSD.value / 68450).toFixed(2));

const mhCopilotPrompt = ref('Draft synergy reduction announcement for Q4');
const mhCopilotResponse = ref<string | null>(null);
const mhIsGeneratingCopilot = ref(false);

const copilotResponses = [
  'EXECUTIVE MEMO: "Team, as part of our synergistic cloud alignment, we are optimizing 14,000 human workstations into automated Copilot loops while increasing executive equity compensation by 38%. CloudVault uptime remains sovereign."',
  'TREASURY UPDATE: "Board of Directors has unanimously approved allocating $6.2 Billion of corporate liquidity into Bytecoin (BYTE) reserves to hedge against macroeconomic fiat gravity. Willy Bate sends his regards."',
  'PRODUCTIVITY ALERT: "MicroHard Teams has successfully generated 142,000,000 unread message notifications today across enterprise domains, ensuring exactly zero actual work was accomplished."',
];

function generateMhCopilot() {
  mhIsGeneratingCopilot.value = true;
  mhCopilotResponse.value = null;
  setTimeout(() => {
    mhIsGeneratingCopilot.value = false;
    mhCopilotResponse.value = copilotResponses[Math.floor(Math.random() * copilotResponses.length)];
  }, 1000);
}

// BloombergWire Terminal Command State
const bloombergCommand = ref('TOP');
const bloombergActiveSection = ref<'top' | 'commodities' | 'rumors' | 'macro'>('top');

function executeBloombergCmd() {
  const cmd = bloombergCommand.value.trim().toUpperCase();
  if (cmd.includes('COMM')) bloombergActiveSection.value = 'commodities';
  else if (cmd.includes('RUMOR')) bloombergActiveSection.value = 'rumors';
  else if (cmd.includes('MACRO')) bloombergActiveSection.value = 'macro';
  else bloombergActiveSection.value = 'top';
}

// ApesWallStreet Interactive Posts & Comments
const forumPosts = ref([
  {
    id: 1,
    title: '[YOLO] Took out a $100k Bank Loan on Simange and put it 100% into 0DTE PEAR Calls 🚀🚀🚀',
    author: 'DiamondHands_Chad',
    time: '2 hours ago',
    flair: 'YOLO',
    flairColor: '#ff4500',
    upvotes: 4821,
    userVoted: 0,
    comments: [
      { author: 'LossEnjoyer', text: 'Godspeed ape. If John Ternas announces titanium vibrations you are buying a yacht.', time: '1h ago' },
      { author: 'MarginCallReaper', text: 'The bank interest APR is going to eat you alive by Friday lmao.', time: '30m ago' },
    ],
    body: 'John Ternas is announcing the TitanPhone 17 with subconscious vibrations tomorrow. If this prints, I am buying a real MuskCar CyberBeast. If it crashes, I will see you behind the Wendy\'s dumpster.',
  },
  {
    id: 2,
    title: '[Loss Porn] Accidentally hit Ctrl+R during my Twitch livestream and liquidated my $145,000 account',
    author: 'GiggleTrader',
    time: '5 hours ago',
    flair: 'Loss',
    flairColor: '#dc2626',
    upvotes: 8930,
    userVoted: 0,
    comments: [
      { author: 'StreamSniper_99', text: 'I WAS THERE! The red candlestick pierced straight through the bottom of the chart!', time: '4h ago' },
      { author: 'SatoshiGhost', text: 'Always use Stealth Mode (Ctrl+Shift+C) before streaming, rookie mistake.', time: '2h ago' },
    ],
    body: 'I was trying to show my chat how Content Creator mode works, forgot I had a 10x margin long open on BYTE, and hammered Ctrl+R. Red candlestick went straight down into the mantle of the earth. F in the chat.',
  },
  {
    id: 3,
    title: '[DD] Mathematical proof that Bytecoin is hitting $1,000,000 before the 2027 Halving',
    author: 'SatoshiApprentice',
    time: '8 hours ago',
    flair: 'DD',
    flairColor: '#3b82f6',
    upvotes: 3104,
    userVoted: 0,
    comments: [
      { author: 'MathWhale', text: 'The 21 million supply cap against 500 million enterprise accounts is indisputable.', time: '6h ago' },
    ],
    body: 'Listen closely apes: MicroHard is integrating BYTE into CloudVault for 500 million enterprise users. 21 million supply divided by 500 million is 0.042 BYTE per user. We are so early it is actually illegal.',
  },
  {
    id: 4,
    title: 'Nvidiot CEO James Huang spotted at a Wendy\'s wearing his leather jacket in 95°F heat',
    author: 'SiliconBeast',
    time: '12 hours ago',
    flair: 'Meme',
    flairColor: '#10b981',
    upvotes: 6420,
    userVoted: 0,
    comments: [
      { author: 'LeatherJacketStalker', text: 'Did he whisper "The more you buy, the more you save" to the cashier?', time: '11h ago' },
    ],
    body: 'He ordered 50,000 Frosties and told the cashier: "The more Frosties you buy, the more you save." Truly the leather jacket visionary of our generation.',
  },
]);

const newCommentInputs = ref<{ [key: number]: string }>({});

function addComment(post: any) {
  const text = (newCommentInputs.value[post.id] || '').trim();
  if (!text) return;
  post.comments.push({
    author: 'You (Trader_Anon)',
    text,
    time: 'Just now',
  });
  newCommentInputs.value[post.id] = '';
}

function toggleVote(post: any, delta: number) {
  if (post.userVoted === delta) {
    post.upvotes -= delta;
    post.userVoted = 0;
  } else {
    post.upvotes += delta - post.userVoted;
    post.userVoted = delta;
  }
}

// Meow Purr interactive counter
const meowClicks = ref(0);
const meowFloatingPuffs = ref<{ id: number; text: string; x: number; y: number }[]>([]);

function petMeow(e: MouseEvent) {
  meowClicks.value++;
  const id = Date.now() + Math.random();
  const slogans = ['+1 MEOW!', 'MUCH VOLATILITY!', 'VERY CANDLESTICK!', 'TO THE MOON! 🚀', 'WOW! ✨', 'PUMP THE CAT! 🐾', 'ELON TWEETED! 🐦'];
  const text = slogans[Math.floor(Math.random() * slogans.length)];
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  meowFloatingPuffs.value.push({
    id,
    text,
    x: e.clientX - rect.left - 20,
    y: e.clientY - rect.top - 20,
  });
  setTimeout(() => {
    meowFloatingPuffs.value = meowFloatingPuffs.value.filter((p) => p.id !== id);
  }, 1200);
}

// Solona Stress Test Button
function triggerSolonaStress() {
  isTpsStressed.value = true;
  liveTps.value = 65420;
  setTimeout(() => {
    isTpsStressed.value = false;
  }, 3500);
}

// Smart Contract Deployer
const deployedContractHash = ref<string | null>(null);
const isDeployingContract = ref(false);

function deploySmartContract() {
  isDeployingContract.value = true;
  deployedContractHash.value = null;
  setTimeout(() => {
    isDeployingContract.value = false;
    deployedContractHash.value = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }, 1600);
}

// Bookmarks roster featuring real varied TLDs (.org, .com, .net, .io, .ai)
const bookmarks = [
  { name: 'Bronomy Search', url: 'https://bronomy.search/', icon: '⚡' },
  { name: 'WikiTrade', url: 'https://wikitrade.org/', icon: '📖' },
  { name: 'Pear.com', url: 'https://pear.com/', icon: '🍏' },
  { name: 'Nvidiot.ai', url: 'https://nvidiot.ai/', icon: '🟩' },
  { name: 'MuskCar.com', url: 'https://muskcar.com/', icon: '🚀' },
  { name: 'Bytecoin.org', url: 'https://bytecoin.org/', icon: '₿' },
  { name: 'Aethereum.io', url: 'https://aethereum.io/', icon: '💎' },
  { name: 'MeowCoin.net', url: 'https://meowcoin.net/', icon: '🐱' },
  { name: 'ApesWallStreet.com', url: 'https://apeswallstreet.com/', icon: '🦍' },
  { name: 'MicroHard.com', url: 'https://microhard.com/', icon: '💻' },
  { name: 'Solona.net', url: 'https://solona.net/', icon: '🟣' },
  { name: 'BloombergWire.net', url: 'https://bloomberg-wire.net/', icon: '📡' },
  { name: 'Settings', url: 'bronomy://settings', icon: '⚙' },
];

// Lock only applies to real (non-fiction) external URLs
const realWebLocked = computed(() => store.browserLocked && !isFiction(activeTab.value.url));

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return 'https://bronomy.search/';

  const lower = trimmed.toLowerCase();
  // Quick shorthand shortcuts
  if (lower === 'settings' || lower === 'bronomy://settings' || lower === 'bronomy.settings') return 'bronomy://settings';
  if (lower === 'about' || lower === 'bronomy://about' || lower === 'bronomy.about') return 'bronomy://about';
  if (lower === 'search' || lower === 'bronomy' || lower === 'home') return 'https://bronomy.search/';
  if (lower === 'wikitrade' || lower === 'wiki') return 'https://wikitrade.org/';
  if (lower === 'simange' || lower === 'portal') return 'https://simange.io/';
  if (lower === 'bytecoin' || lower === 'btc' || lower === 'byte') return 'https://bytecoin.org/';
  if (lower === 'pear' || lower === 'apple' || lower === 'titanphone') return 'https://pear.com/';
  if (lower === 'nvidiot' || lower === 'nvidia' || lower === 'jensen') return 'https://nvidiot.ai/';
  if (lower === 'muskcar' || lower === 'tesla' || lower === 'spacex') return 'https://muskcar.com/';
  if (lower === 'aethereum' || lower === 'eth' || lower === 'aeth') return 'https://aethereum.io/';
  if (lower === 'meowcoin' || lower === 'meow' || lower === 'doge') return 'https://meowcoin.net/';
  if (lower === 'apeswallstreet' || lower === 'wsb' || lower === 'wallstreetbets') return 'https://apeswallstreet.com/';
  if (lower === 'microhard' || lower === 'microsoft' || lower === 'mhd') return 'https://microhard.com/';
  if (lower === 'solona' || lower === 'sol' || lower === 'solana') return 'https://solona.net/';
  if (lower === 'exsearch') return 'https://exsearch.net/';
  if (lower === 'bloomberg' || lower === 'bloomberg-wire' || lower === 'wire') return 'https://bloomberg-wire.net/';

  if (trimmed.startsWith('bronomy://')) {
    return trimmed;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return 'https://' + trimmed;
}

function navigateTo(url: string, pushHistory = true) {
  const finalUrl = normalizeUrl(url);
  const cur = activeTab.value;
  cur.wikiArticle = null;
  cur.url = finalUrl;
  urlInput.value = finalUrl;

  const meta = getDomainMeta(finalUrl, cur.wikiArticle);
  cur.title = meta.title;
  cur.icon = meta.icon;

  if (pushHistory) {
    if (cur.historyIdx < cur.history.length - 1) {
      cur.history = cur.history.slice(0, cur.historyIdx + 1);
    }
    cur.history.push(finalUrl);
    cur.historyIdx = cur.history.length - 1;
  }
}

function handleUrlEnter() {
  navigateTo(urlInput.value);
}

function goBack() {
  const cur = activeTab.value;
  if (cur.historyIdx > 0) {
    cur.historyIdx--;
    const prev = cur.history[cur.historyIdx];
    navigateTo(prev, false);
  }
}

function goForward() {
  const cur = activeTab.value;
  if (cur.historyIdx < cur.history.length - 1) {
    cur.historyIdx++;
    const next = cur.history[cur.historyIdx];
    navigateTo(next, false);
  }
}

function reloadPage() {
  navigateTo(activeTab.value.url, false);
}

function openWikiArticle(slug: string) {
  const cur = activeTab.value;
  cur.wikiArticle = slug;
  cur.url = `https://wikitrade.org/wiki/${slug.toLowerCase().replace(/[\s()]+/g, '_')}`;
  urlInput.value = cur.url;

  const meta = getDomainMeta(cur.url, slug);
  cur.title = meta.title;
  cur.icon = meta.icon;

  cur.history.push(cur.url);
  cur.historyIdx = cur.history.length - 1;
}

function executeBronomySearch(queryText?: string) {
  const cur = activeTab.value;
  const q = (queryText || cur.exSearchQuery).trim().toLowerCase();
  if (!q) return;

  cur.exSearchQuery = queryText || cur.exSearchQuery;
  const results: Array<{ title: string; desc: string; url: string; tag: string }> = [];

  // Match against game assets
  store.assets.forEach((a) => {
    if (a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q)) {
      results.push({
        title: `${a.name} (${a.symbol}) — Live Market Quote`,
        desc: `Current trading price: $${a.current_price.toFixed(2)}. 24h Change: ${a.change_24h_pct >= 0 ? '+' : ''}${a.change_24h_pct.toFixed(2)}%. High-frequency limit order book and algorithmic market depth.`,
        url: a.category === 'Crypto' ? 'https://bytecoin.org/' : 'https://pear.com/',
        tag: a.category.toUpperCase(),
      });
    }
  });

  // Predefined encyclopedic articles & topics
  const topics = [
    { title: 'The Stock Tech Company Inc. Corporate Dossier', desc: 'Creators of Bronomy Browser. Institutional trading infrastructure and simulation software.', url: 'bronomy://about', tag: 'CORPORATE' },
    { title: 'Bytecoin (BYTE) Sovereign Whitepaper', desc: 'Decentralized peer-to-peer SHA-3K proof-of-work digital gold. 21M hard cap.', url: 'https://bytecoin.org/', tag: 'CRYPTO' },
    { title: 'Pear Inc. TitanPhone 17 Pro Launch', desc: 'Titanium micro-architecture and subconscious mind link. No ports, no screen, $2,499.', url: 'https://pear.com/', tag: 'EQUITY' },
    { title: 'Nvidiot AI Blackwell Supercomputing', desc: '100,000 H2000 Quantum Tensor clusters deployed for AI training workloads.', url: 'https://nvidiot.ai/', tag: 'SILICON' },
    { title: 'MuskCar CyberTruck & Mars Starship', desc: 'Autonomous EV, Full Self Driving v42 guaranteed in 2 weeks, and Mars shuttle tickets.', url: 'https://muskcar.com/', tag: 'TECH' },
    { title: 'MicroHard CloudVault with Bytecoin Settlement', desc: '500M enterprise accounts with sovereign proof-of-work treasury allocation.', url: 'https://microhard.com/', tag: 'CLOUD' },
    { title: 'Apes of Wall Street 0DTE Options Debacle', desc: 'Apes discuss leveraging 10x margin on PEAR and suffering instant margin calls.', url: 'https://apeswallstreet.com/', tag: 'FORUM' },
    { title: 'Bloomberg Wire Real-Time Financial Wire', desc: 'Live commodity indexes, central bank discount window, and breaking sentiment.', url: 'https://bloomberg-wire.net/', tag: 'WIRE' },
  ];

  topics.forEach((t) => {
    if (t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)) {
      results.push(t);
    }
  });

  if (results.length === 0) {
    results.push({
      title: `No direct hits for "${q}" — Search WikiTrade`,
      desc: 'No exact company records found. Click below to query the WikiTrade decentralized financial encyclopedia.',
      url: 'https://wikitrade.org/',
      tag: 'ENCYCLOPEDIA',
    });
  }

  cur.exSearchResults = results;
}

onMounted(() => {
  const completed = localStorage.getItem('bronomy_setup_completed');
  if (!completed) {
    showBronomySetup.value = true;
  }

  tpsInterval = setInterval(() => {
    if (!isTpsStressed.value) {
      liveTps.value = Math.floor(3100 + Math.random() * 450);
    }
  }, 1000);
});

onUnmounted(() => {
  if (tpsInterval) clearInterval(tpsInterval);
});

function getAssetPrice(symbol: string, fallback: string): string {
  const asset = store.assets.find((a) => a.symbol === symbol);
  return asset ? `$${asset.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : fallback;
}

function getAssetChange(symbol: string, fallback: string): { text: string; isPositive: boolean } {
  const asset = store.assets.find((a) => a.symbol === symbol);
  if (!asset) return { text: fallback, isPositive: true };
  const pct = asset.change_24h_pct;
  return {
    text: `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`,
    isPositive: pct >= 0,
  };
}
</script>

<template>
  <div class="flex flex-col h-full bg-terminal-bg text-terminal-text overflow-hidden" style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px;">

    <!-- ── BRONOMY BROWSER TAB BAR (MULTI-TABS) ────────────────────────── -->
    <div class="flex items-center bg-[#070a0f] border-b border-terminal-border px-2 pt-1.5 gap-1 shrink-0 select-none overflow-x-auto no-scrollbar">
      <!-- Bronomy Brand Logo / Home Icon -->
      <div
        @click="navigateTo('https://bronomy.search/')"
        class="flex items-center gap-1.5 px-2.5 py-1 mr-1 text-xs font-mono font-bold text-cyber-blue cursor-pointer hover:bg-terminal-surface rounded transition"
        title="Bronomy (Browser for Economy) by The Stock Tech Company Inc."
      >
        <span class="text-sm">⚡</span>
        <span class="tracking-wider">BRONOMY</span>
      </div>

      <!-- Tab Items -->
      <div
        v-for="tab in tabs"
        :key="tab.id"
        @click="switchTab(tab.id)"
        class="flex items-center gap-2 px-3 py-1.5 rounded-t-lg border-t border-l border-r text-xs transition cursor-pointer max-w-[200px] min-w-[120px] group relative"
        :class="activeTabId === tab.id
          ? 'bg-terminal-panel border-terminal-border text-white font-semibold shadow-sm'
          : 'bg-[#0b0f17] border-transparent text-terminal-muted hover:text-white hover:bg-[#101622]'"
      >
        <span class="text-xs shrink-0">{{ tab.icon }}</span>
        <span class="truncate text-[11px] flex-1 font-mono">{{ tab.title }}</span>

        <!-- Close Tab Button -->
        <button
          @click.stop="closeTab(tab.id)"
          class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-terminal-muted hover:bg-cyber-red/20 hover:text-cyber-red transition shrink-0 opacity-70 group-hover:opacity-100"
          title="Close Tab"
        >
          ✕
        </button>
      </div>

      <!-- New Tab Button -->
      <button
        @click="newTab('https://bronomy.search/')"
        class="w-7 h-7 rounded-lg hover:bg-terminal-surface text-terminal-muted hover:text-cyber-blue flex items-center justify-center text-base font-bold transition ml-1"
        title="Open New Tab (Bronomy Search)"
      >
        +
      </button>

      <div class="flex-1"></div>

      <!-- Settings & About Fast Links -->
      <button
        @click="navigateTo('bronomy://settings')"
        class="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono text-terminal-muted hover:text-white hover:bg-terminal-surface transition"
        title="Bronomy Settings"
      >
        <span>⚙</span>
        <span class="hidden lg:inline">Settings</span>
      </button>

      <button
        @click="navigateTo('bronomy://about')"
        class="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono text-cyber-blue hover:text-white hover:bg-terminal-surface transition"
        title="About Bronomy by The Stock Tech Company Inc."
      >
        <span>ℹ️</span>
        <span class="hidden lg:inline">About</span>
      </button>

      <button
        @click="restartSetup"
        class="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono text-cyber-amber hover:bg-terminal-surface transition"
        title="Run Setup Wizard"
      >
        <span>⚡</span>
        <span class="hidden md:inline">Setup</span>
      </button>
    </div>

    <!-- ── Browser Chrome & Control Bar ───────────────────────────────── -->
    <div class="flex items-center gap-1.5 px-3 py-2 bg-terminal-panel border-b border-terminal-border shrink-0 select-none">
      <!-- Back / Forward / Refresh Buttons -->
      <button
        @click="goBack"
        :disabled="activeTab.historyIdx <= 0"
        class="w-7 h-7 rounded hover:bg-terminal-surface text-terminal-muted hover:text-white flex items-center justify-center text-base leading-none transition disabled:opacity-25 disabled:hover:bg-transparent"
        title="Back"
      >
        ‹
      </button>
      <button
        @click="goForward"
        :disabled="activeTab.historyIdx >= activeTab.history.length - 1"
        class="w-7 h-7 rounded hover:bg-terminal-surface text-terminal-muted hover:text-white flex items-center justify-center text-base leading-none transition disabled:opacity-25 disabled:hover:bg-transparent"
        title="Forward"
      >
        ›
      </button>
      <button
        @click="reloadPage"
        class="w-7 h-7 rounded hover:bg-terminal-surface text-terminal-muted hover:text-white flex items-center justify-center text-xs leading-none transition"
        title="Reload Current Page"
      >
        ↻
      </button>

      <!-- URL Address Bar with Security Badge -->
      <div class="flex-1 flex items-center bg-terminal-surface border border-terminal-border rounded-md px-3 py-1 gap-2 shadow-inner">
        <span
          class="text-xs flex items-center gap-1 font-mono font-bold"
          :class="isFiction(activeTab.url) ? 'text-cyber-green' : 'text-cyber-amber'"
        >
          <span>{{ isFiction(activeTab.url) ? '🔒' : '⚠️' }}</span>
          <span class="text-[9px] uppercase tracking-wider hidden sm:inline">
            {{ isFiction(activeTab.url) ? 'BRONOMY SECURE' : 'EXTERNAL' }}
          </span>
        </span>

        <input
          v-model="urlInput"
          @keyup.enter="handleUrlEnter"
          class="flex-1 bg-transparent focus:outline-none text-xs text-white font-mono select-all"
          placeholder="Search with Bronomy or enter domain (e.g. wikitrade.org, pear.com, bronomy://settings)..."
        />

        <button
          v-if="urlInput !== activeTab.url"
          @click="handleUrlEnter"
          class="px-2 py-0.5 text-[10px] font-bold rounded bg-cyber-blue text-black font-mono hover:bg-cyber-blue/80 transition"
        >
          GO
        </button>
      </div>

      <!-- Home Action -->
      <button
        @click="navigateTo('https://bronomy.search/')"
        class="px-2.5 py-1 text-[11px] font-bold rounded bg-terminal-surface hover:bg-terminal-border text-terminal-text hover:text-white transition flex items-center gap-1 font-mono"
        title="Bronomy Home / Search"
      >
        <span>⚡</span>
        <span class="hidden md:inline">Home</span>
      </button>
    </div>

    <!-- ── Bookmarks Quick Bar (Varied Real TLDs: .org, .com, .net, .io, .ai) ── -->
    <div class="flex items-center gap-1.5 px-3 py-1.5 bg-[#090d14] border-b border-terminal-border shrink-0 overflow-x-auto select-none no-scrollbar">
      <span class="text-[9px] text-terminal-muted uppercase font-mono tracking-widest mr-1 shrink-0 font-bold">
        PINNED:
      </span>

      <button
        v-for="b in bookmarks"
        :key="b.name"
        @click="navigateTo(b.url)"
        class="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] shrink-0 transition font-mono"
        :class="activeTab.url.includes(b.url.replace('https://','').replace('bronomy://',''))
          ? 'text-cyber-blue bg-terminal-surface border border-cyber-blue/40 font-bold shadow-glow-blue'
          : 'text-terminal-muted hover:text-white hover:bg-terminal-surface/60 border border-transparent'"
      >
        <span>{{ b.icon }}</span>
        <span>{{ b.name }}</span>
      </button>
    </div>

    <!-- ── Page Viewport ──────────────────────────────────────────────── -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden relative bg-terminal-bg">

      <!-- ============================================================== -->
      <!-- 0. BRONOMY FIRST-TIME SETUP WIZARD MODAL                       -->
      <!-- ============================================================== -->
      <div v-if="showBronomySetup" class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
        <div class="max-w-xl w-full cyber-panel border-2 border-cyber-blue p-6 rounded-2xl shadow-glow-blue space-y-6">
          <div class="flex items-center justify-between border-b border-terminal-border pb-3">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-cyber-blue/20 border border-cyber-blue flex items-center justify-center text-xl shadow-glow-blue">
                ⚡
              </div>
              <div>
                <h2 class="text-base font-black text-white font-mono tracking-wider">
                  BRONOMY SETUP WIZARD
                </h2>
                <p class="text-[11px] text-terminal-muted">Browser for Economy // The Stock Tech Company Inc.</p>
              </div>
            </div>
            <span class="text-xs font-mono text-cyber-blue font-bold">Step {{ setupStep }} of 3</span>
          </div>

          <div v-if="setupStep === 1" class="space-y-4">
            <div class="p-4 bg-terminal-surface rounded-xl border border-terminal-border space-y-2">
              <h3 class="font-bold text-white text-sm">Welcome to Bronomy Browser</h3>
              <p class="text-xs text-terminal-muted leading-relaxed">
                Bronomy is the dedicated institutional trading browser engineered by <strong>The Stock Tech Company Inc.</strong> specifically for high-frequency algorithmic traders and simulation terminals.
              </p>
              <ul class="text-xs text-terminal-text space-y-1.5 list-disc pl-5 pt-1">
                <li><strong class="text-cyber-green">Multi-Tab Architecture</strong>: Open multiple isolated trading portals simultaneously.</li>
                <li><strong class="text-cyber-blue">Bronomy Search (powered by ExSearch)</strong>: Real-time intelligence search across all 17 parody equities.</li>
                <li><strong class="text-cyber-amber">Air-Gap Security</strong>: Sovereign sandbox protection blocking external trackers and accidental page refreshes.</li>
              </ul>
            </div>
            <div class="flex justify-end pt-2">
              <button @click="setupStep = 2" class="px-5 py-2.5 rounded-lg bg-cyber-blue text-black font-bold text-xs font-mono hover:bg-cyber-blue/90">
                Continue to Search Engine Setup →
              </button>
            </div>
          </div>

          <div v-else-if="setupStep === 2" class="space-y-4">
            <h3 class="font-bold text-white text-sm">Choose Your Default Financial Search Engine</h3>
            <div class="space-y-2.5">
              <div
                @click="setupSearchEngine = 'Bronomy Search (powered by ExSearch)'"
                class="p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between"
                :class="setupSearchEngine.includes('Bronomy') ? 'bg-cyber-blue/15 border-cyber-blue text-white' : 'bg-terminal-surface border-terminal-border text-terminal-muted'"
              >
                <div>
                  <div class="font-bold text-xs text-white">⚡ Bronomy Search (powered by ExSearch)</div>
                  <div class="text-[11px] text-terminal-muted">Instant intelligence indexing all stocks, cryptos, and news. (Recommended)</div>
                </div>
                <span v-if="setupSearchEngine.includes('Bronomy')" class="text-cyber-blue text-base font-bold">✓</span>
              </div>

              <div
                @click="setupSearchEngine = 'WikiTrade Direct Search'"
                class="p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between"
                :class="setupSearchEngine.includes('WikiTrade') ? 'bg-cyber-blue/15 border-cyber-blue text-white' : 'bg-terminal-surface border-terminal-border text-terminal-muted'"
              >
                <div>
                  <div class="font-bold text-xs text-white">📖 WikiTrade Encyclopedia Direct</div>
                  <div class="text-[11px] text-terminal-muted">Direct queries against the decentralized market encyclopedia.</div>
                </div>
                <span v-if="setupSearchEngine.includes('WikiTrade')" class="text-cyber-blue text-base font-bold">✓</span>
              </div>
            </div>

            <div class="flex justify-between pt-2">
              <button @click="setupStep = 1" class="px-4 py-2 rounded-lg bg-terminal-surface text-terminal-text text-xs font-mono">
                ← Back
              </button>
              <button @click="setupStep = 3" class="px-5 py-2.5 rounded-lg bg-cyber-blue text-black font-bold text-xs font-mono hover:bg-cyber-blue/90">
                Continue to Security Setup →
              </button>
            </div>
          </div>

          <div v-else-if="setupStep === 3" class="space-y-4">
            <h3 class="font-bold text-white text-sm">Air-Gap Simulation Sandbox Security</h3>
            <div class="p-4 bg-terminal-surface rounded-xl border border-cyber-green/40 space-y-2">
              <div class="flex items-center gap-2 text-cyber-green font-bold text-xs">
                <span>🛡️</span>
                <span>AIR-GAP FIREWALL LOCKDOWN ACTIVE</span>
              </div>
              <p class="text-xs text-terminal-muted leading-relaxed">
                By default, Bronomy locks access to external real-world websites to guarantee complete simulation sandbox integrity and offline privacy.
              </p>
              <label class="flex items-center space-x-2 text-xs pt-1 cursor-pointer text-white">
                <input type="checkbox" v-model="setupAirGapEnforced" class="accent-cyber-blue" />
                <span>Enforce Air-Gap Sandbox Isolation (Recommended)</span>
              </label>
            </div>

            <div class="flex justify-between pt-2">
              <button @click="setupStep = 2" class="px-4 py-2 rounded-lg bg-terminal-surface text-terminal-text text-xs font-mono">
                ← Back
              </button>
              <button @click="completeSetup" class="px-6 py-2.5 rounded-lg bg-cyber-blue text-black font-bold text-xs font-mono hover:bg-cyber-blue/90 shadow-glow-blue flex items-center gap-1.5">
                <span>Launch Bronomy Browser</span>
                <span>⚡</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 1. BRONOMY SETTINGS (bronomy://settings)                       -->
      <!-- ============================================================== -->
      <div v-if="activeTab.url.includes('bronomy://settings') || activeTab.url.includes('bronomy.settings')" class="min-h-full bg-[#080c14] text-gray-200 font-sans p-6 pb-20">
        <div class="max-w-4xl mx-auto space-y-6">
          <div class="flex items-center justify-between border-b border-terminal-border pb-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-cyber-blue/20 border border-cyber-blue flex items-center justify-center text-xl shadow-glow-blue">⚙</div>
              <div>
                <h1 class="text-2xl font-black text-white font-mono tracking-wider">BRONOMY SETTINGS</h1>
                <p class="text-[11px] text-terminal-muted font-mono">Configuration &amp; Security Manager // The Stock Tech Company Inc.</p>
              </div>
            </div>
            <button @click="navigateTo('bronomy://about')" class="px-3 py-1.5 rounded-lg bg-terminal-surface border border-terminal-border text-cyber-blue font-mono text-xs hover:border-cyber-blue transition">
              About Bronomy →
            </button>
          </div>

          <!-- Settings Tab Navigation -->
          <div class="flex gap-2 border-b border-terminal-border pb-2 text-xs font-mono">
            <button
              v-for="st in [
                { id: 'general', label: '⚙ General' },
                { id: 'security', label: '🛡️ Air-Gap & Privacy' },
                { id: 'appearance', label: '🎨 Tabs & Layout' }
              ]"
              :key="st.id"
              @click="bronomySettingsTab = st.id as any"
              class="px-4 py-1.5 rounded-lg transition"
              :class="bronomySettingsTab === st.id ? 'bg-cyber-blue text-black font-bold' : 'text-terminal-muted hover:text-white hover:bg-terminal-surface'"
            >
              {{ st.label }}
            </button>
          </div>

          <!-- General Tab -->
          <div v-if="bronomySettingsTab === 'general'" class="space-y-4 font-mono text-xs">
            <div class="p-5 bg-terminal-panel rounded-xl border border-terminal-border space-y-3">
              <div class="font-bold text-white text-sm">Default Financial Search Engine</div>
              <div class="space-y-2">
                <label v-for="eng in ['Bronomy Search (powered by ExSearch)', 'WikiTrade Direct Search', 'Bloomberg Wire Terminal']" :key="eng" class="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input type="radio" v-model="defaultSearchEngine" :value="eng" class="accent-cyber-blue" />
                  <span>{{ eng }}</span>
                </label>
              </div>
            </div>

            <div class="p-5 bg-terminal-panel rounded-xl border border-terminal-border space-y-3">
              <div class="font-bold text-white text-sm">On Startup / New Tab Open:</div>
              <div class="space-y-2">
                <label v-for="hp in [
                  { url: 'https://bronomy.search/', label: 'Bronomy Search Home (Default)' },
                  { url: 'https://wikitrade.org/', label: 'WikiTrade Encyclopedia' },
                  { url: 'https://bloomberg-wire.net/', label: 'Bloomberg Wire Terminal' }
                ]" :key="hp.url" class="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input type="radio" v-model="startupPageOption" :value="hp.url" class="accent-cyber-blue" />
                  <span>{{ hp.label }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Air-Gap & Privacy Tab -->
          <div v-else-if="bronomySettingsTab === 'security'" class="space-y-4 font-mono text-xs">
            <div class="p-5 bg-terminal-panel rounded-xl border border-cyber-green/40 space-y-3">
              <div class="flex items-center gap-2 text-cyber-green font-bold text-sm">
                <span>🛡️</span>
                <span>Air-Gap Sandbox Enforcement</span>
              </div>
              <p class="text-terminal-muted leading-relaxed">
                Prevents accidental internet egress and stops external domains from loading unless developer mode is toggled. Keeps all 13 in-game fiction domains active.
              </p>
              <div class="pt-2 flex gap-3">
                <button @click="clearBrowsingHistory" class="px-4 py-2 bg-terminal-surface border border-terminal-border hover:border-cyber-red hover:text-cyber-red text-white font-bold rounded-lg transition">
                  🗑 Clear Bronomy Session History
                </button>
                <button @click="restartSetup" class="px-4 py-2 bg-terminal-surface border border-cyber-amber text-cyber-amber font-bold rounded-lg transition">
                  ⚡ Re-run First-Time Setup Wizard
                </button>
              </div>
            </div>
          </div>

          <!-- Appearance Tab -->
          <div v-else class="space-y-4 font-mono text-xs">
            <div class="p-5 bg-terminal-panel rounded-xl border border-terminal-border space-y-3">
              <div class="font-bold text-white text-sm">Tab Bar Density</div>
              <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="tabDensity" value="comfortable" class="accent-cyber-blue" />
                  <span>Comfortable (Default)</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="radio" v-model="tabDensity" value="compact" class="accent-cyber-blue" />
                  <span>Compact High-Density</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 2. ABOUT BRONOMY (bronomy://about) BY THE STOCK TECH COMPANY   -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('bronomy://about') || activeTab.url.includes('bronomy.about')" class="min-h-full bg-[#06090f] text-gray-200 font-sans p-6 pb-20">
        <div class="max-w-4xl mx-auto space-y-8 pt-4">
          <!-- Corporate Banner -->
          <div class="p-8 rounded-2xl bg-gradient-to-r from-[#0d1424] via-[#09111f] to-[#070b14] border-2 border-cyber-blue shadow-glow-blue space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-14 h-14 rounded-2xl bg-cyber-blue text-black font-black flex items-center justify-center text-3xl shadow-lg">⚡</div>
                <div>
                  <h1 class="text-3xl font-black text-white font-mono tracking-wider">
                    BRONOMY
                  </h1>
                  <p class="text-xs text-cyber-blue font-mono font-bold tracking-widest uppercase">
                    BROWSER FOR ECONOMY // THE STOCK TECH COMPANY INC.
                  </p>
                </div>
              </div>
              <div class="text-right font-mono text-xs">
                <div class="text-gray-400">VERSION</div>
                <div class="text-white font-bold">v1.4.2-sim (Build 2026.11)</div>
              </div>
            </div>

            <p class="text-xs text-gray-300 leading-relaxed max-w-2xl font-mono">
              Bronomy is the sovereign, air-gapped financial browser engineered by <strong>The Stock Tech Company Inc.</strong> Designed to deliver zero-latency execution, isolated multi-tab buffers, and 100% offline simulation sandbox integrity.
            </p>

            <div class="pt-2 flex items-center gap-4 font-mono text-xs">
              <button
                @click="checkForUpdates"
                :disabled="isCheckingUpdates"
                class="px-5 py-2.5 rounded-lg bg-cyber-blue text-black font-bold hover:bg-cyber-blue/90 transition shadow-glow-blue flex items-center gap-2"
              >
                <span>{{ isCheckingUpdates ? 'Checking The Stock Tech Co. Servers...' : 'Check for Updates' }}</span>
                <span>↻</span>
              </button>
              <span v-if="updateCheckMessage" class="text-cyber-green font-bold animate-pulse">
                {{ updateCheckMessage }}
              </span>
            </div>
          </div>

          <!-- The Stock Tech Company Inc. Dossier -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div class="p-5 bg-terminal-panel rounded-xl border border-terminal-border space-y-2.5">
              <div class="font-bold text-white text-sm border-b border-terminal-border pb-2 flex items-center gap-2">
                <span>🏢</span>
                <span>The Stock Tech Company Inc. Profile</span>
              </div>
              <div class="text-gray-300 space-y-1.5 leading-relaxed">
                <div>• <b>Headquarters</b>: 140 Wall Street, Floor 42, New York, NY / Simange CyberNet</div>
                <div>• <b>Corporate Entity</b>: The Stock Tech Company Inc. (NASDAQ Parody: STK-TECH)</div>
                <div>• <b>Division</b>: High-Frequency Browser &amp; Simulation Infrastructure</div>
                <div>• <b>Guaranteed SLA</b>: Sub-millisecond tab switching &amp; zero memory leaks.</div>
              </div>
            </div>

            <div class="p-5 bg-terminal-panel rounded-xl border border-terminal-border space-y-2.5">
              <div class="font-bold text-white text-sm border-b border-terminal-border pb-2 flex items-center gap-2">
                <span>🛡️</span>
                <span>Architecture &amp; Security Specs</span>
              </div>
              <div class="text-gray-300 space-y-1.5 leading-relaxed">
                <div>• <b>Engine</b>: Multi-Tab Virtual V8 Container</div>
                <div>• <b>Sandbox</b>: Air-Gap Simulation Level 5 Egress Shield</div>
                <div>• <b>Telemetry</b>: 0% (Pure Client-Side Local Storage)</div>
                <div>• <b>Integration</b>: Simange Terminal by KaProject Labs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 3. REAL / EXTERNAL WEB LOCKED AIR-GAP FIREWALL SCREEN          -->
      <!-- ============================================================== -->
      <div v-else-if="realWebLocked" class="flex flex-col items-center justify-center min-h-full text-center px-6 py-12 space-y-6 max-w-3xl mx-auto">
        <div class="w-20 h-20 rounded-2xl bg-cyber-amber/10 border-2 border-cyber-amber flex items-center justify-center text-4xl shadow-glow-amber animate-pulse">
          🛡️
        </div>

        <div class="space-y-2">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-amber/20 border border-cyber-amber/40 text-cyber-amber text-[10px] font-mono font-bold tracking-widest uppercase">
            <span>AIR-GAP FIREWALL ACTIVE // EXTERNAL WEB LOCKED</span>
          </div>
          <h1 class="text-2xl font-black text-white font-mono tracking-wider">
            EXTERNAL INTERNET ACCESS RESTRICTED
          </h1>
          <p class="text-xs text-terminal-muted max-w-xl mx-auto leading-relaxed">
            You are attempting to access <code class="text-cyber-amber font-mono font-bold">{{ activeTab.url }}</code>.
            By default, <strong>Bronomy</strong> operates in a strictly air-gapped simulation environment. External web connections and real-world network requests are disabled to preserve 100% offline simulation integrity and protect privacy.
          </p>
        </div>

        <!-- Verified In-Game Domains Directory -->
        <div class="w-full bg-terminal-panel/90 border border-terminal-border rounded-xl p-5 text-left space-y-4">
          <div class="flex items-center justify-between border-b border-terminal-border pb-2.5">
            <span class="text-xs font-bold text-white font-mono flex items-center gap-2">
              <span class="text-cyber-green">●</span>
              <span>VERIFIED IN-UNIVERSE FICTION DOMAINS (.COM, .ORG, .NET, .IO, .AI)</span>
            </span>
            <span class="text-[10px] font-mono text-terminal-muted">13 ACTIVE DOMAINS</span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs font-mono">
            <button
              v-for="b in bookmarks"
              :key="b.name"
              @click="navigateTo(b.url)"
              class="flex items-center gap-2 p-2.5 rounded-lg bg-terminal-surface hover:bg-cyber-blue/10 border border-terminal-border hover:border-cyber-blue transition text-left group"
            >
              <span class="text-lg">{{ b.icon }}</span>
              <div class="min-w-0">
                <div class="font-bold text-white group-hover:text-cyber-blue truncate text-[11px]">{{ b.name }}</div>
                <div class="text-[9px] text-terminal-muted truncate">{{ b.url.replace('https://','').replace('bronomy://','') }}</div>
              </div>
            </button>
          </div>
        </div>

        <!-- Settings Unlock Notice -->
        <div class="flex items-center justify-center gap-3 pt-2 text-xs font-mono">
          <button
            @click="navigateTo('https://bronomy.search/')"
            class="px-5 py-2.5 rounded-lg bg-cyber-blue text-black font-bold hover:bg-cyber-blue/90 transition shadow-glow-blue flex items-center gap-2"
          >
            <span>Return to Bronomy Search</span>
            <span>→</span>
          </button>

          <button
            @click="navigateTo('bronomy://settings')"
            class="px-4 py-2.5 rounded-lg bg-terminal-surface border border-cyber-amber/50 text-cyber-amber font-semibold hover:bg-cyber-amber/15 transition flex items-center gap-1.5"
          >
            <span>⚙</span>
            <span>Bronomy Air-Gap Settings</span>
          </button>
        </div>
      </div>

      <!-- Real Web IFrame (only when user explicitly toggled lock in settings) -->
      <div v-else-if="!isFiction(activeTab.url)" class="w-full h-full flex flex-col">
        <div class="bg-cyber-amber/10 border-b border-cyber-amber/30 px-4 py-2 flex items-center justify-between text-xs font-mono">
          <span class="text-cyber-amber font-bold">⚠️ EXTERNAL WEB ACCESS UNLOCKED (DEVELOPER MODE)</span>
          <span class="text-terminal-muted text-[10px]">Note: External sites that forbid iframes (X-Frame-Options) will fail to load.</span>
        </div>
        <iframe
          :src="activeTab.url"
          class="w-full flex-1 border-none"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>

      <!-- ============================================================== -->
      <!-- 4. BRONOMY SEARCH HOME PAGE (POWERED BY EXSEARCH)              -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('bronomy.search') || activeTab.url.includes('exsearch.net') || activeTab.url.includes('exsearch.org')" class="min-h-full bg-[#0a0e17] text-gray-200 font-sans p-6 pb-20">
        <div class="max-w-4xl mx-auto space-y-8 pt-6">
          <div class="text-center space-y-3">
            <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyber-blue/15 border border-cyber-blue/40 text-cyber-blue text-[10px] font-mono font-bold tracking-widest uppercase shadow-glow-blue">
              <span>POWERED BY EXSEARCH INTELLIGENCE ENGINE // THE STOCK TECH CO.</span>
            </div>
            <h1 class="text-5xl font-black text-white font-mono tracking-wider drop-shadow-[0_0_35px_rgba(0,229,255,0.4)]">
              ⚡ BRONOMY SEARCH
            </h1>
            <p class="text-xs text-gray-400 font-mono">The Official Search Engine for Simulated Global Markets</p>
          </div>

          <!-- Main Search Bar -->
          <div class="space-y-3">
            <div class="flex gap-2">
              <input
                v-model="activeTab.exSearchQuery"
                @keyup.enter="executeBronomySearch()"
                placeholder="Search stocks, crypto, CEOs (e.g. BYTE, PEAR, Jensen, Elon, TitanPhone)..."
                class="flex-1 bg-black/80 border-2 border-cyber-blue/50 rounded-xl px-5 py-3 text-sm text-white font-mono outline-none focus:border-cyber-blue shadow-glow-blue"
              />
              <button
                @click="executeBronomySearch()"
                class="px-8 py-3 bg-cyber-blue text-black font-black text-xs rounded-xl font-mono hover:bg-cyber-blue/90 shadow-glow-blue transition"
              >
                SEARCH
              </button>
            </div>

            <!-- Suggestion Pills -->
            <div class="flex items-center gap-2 flex-wrap text-[11px] font-mono">
              <span class="text-gray-500">Popular:</span>
              <button
                v-for="pill in ['PEAR Stock', 'BYTE Whitepaper', 'Jensen Leather Jacket', 'Elon Tweet', 'MicroHard CloudVault', 'Bloomberg Wire', '0DTE YOLO']"
                :key="pill"
                @click="executeBronomySearch(pill)"
                class="px-2.5 py-1 rounded-full bg-terminal-surface hover:bg-cyber-blue/20 hover:text-cyber-blue text-gray-400 border border-terminal-border transition"
              >
                {{ pill }}
              </button>
            </div>
          </div>

          <!-- Results Listing (If Search Executed) -->
          <div v-if="activeTab.exSearchResults.length > 0" class="space-y-3 pt-2 font-mono">
            <div class="text-xs text-cyber-blue font-bold border-b border-terminal-border pb-2">
              Found {{ activeTab.exSearchResults.length }} Intelligence Record(s):
            </div>
            <div
              v-for="(res, idx) in activeTab.exSearchResults"
              :key="idx"
              class="p-4 bg-terminal-surface/70 border border-terminal-border hover:border-cyber-blue rounded-xl space-y-1.5 transition"
            >
              <div class="flex items-center gap-2">
                <span class="text-[9px] bg-cyber-blue/20 text-cyber-blue px-2 py-0.5 rounded font-bold">{{ res.tag }}</span>
                <span class="text-xs text-gray-400">{{ res.url }}</span>
              </div>
              <h3 @click="navigateTo(res.url)" class="text-sm font-bold text-white hover:text-cyber-blue cursor-pointer transition">
                {{ res.title }}
              </h3>
              <p class="text-xs text-gray-300 leading-relaxed">{{ res.desc }}</p>
            </div>
          </div>

          <!-- Quick Navigation Cards Grid -->
          <div class="pt-4 space-y-3">
            <div class="text-xs font-mono font-bold text-gray-400">FAVORITE FINANCIAL DESTINATIONS:</div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div
                v-for="b in bookmarks.slice(1)"
                :key="b.name"
                @click="navigateTo(b.url)"
                class="p-3.5 rounded-xl bg-terminal-surface/60 border border-terminal-border hover:border-cyber-blue hover:bg-cyber-blue/10 cursor-pointer transition text-left group"
              >
                <div class="text-2xl mb-1.5">{{ b.icon }}</div>
                <div class="text-xs font-bold text-white group-hover:text-cyber-blue truncate font-mono">{{ b.name }}</div>
                <div class="text-[10px] text-gray-500 truncate font-mono">{{ b.url.replace('https://','').replace('bronomy://','') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 5. WIKITRADE.ORG (DEEP WIKIPEDIA MEDIAWIKI STYLE)             -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('wikitrade.org')" class="min-h-full bg-white text-[#202122]" style="font-family: 'Linux Libertine', Georgia, Times, serif;">
        <nav class="bg-white border-b border-[#a2a9b1] px-6 py-2.5 flex items-center gap-4 sticky top-0 z-20 shadow-sm" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div class="flex items-center gap-2 cursor-pointer" @click="navigateTo('https://wikitrade.org/')">
            <span class="text-2xl font-black text-[#202122] tracking-tighter">Wiki<span class="text-[#3366cc]">Trade</span></span>
            <span class="text-[10px] text-[#72777d] italic">The Free Financial Encyclopedia</span>
          </div>

          <div class="flex-1 flex gap-4 text-xs text-[#555] font-normal ml-4">
            <span class="cursor-pointer hover:text-[#3366cc]" @click="activeTab.wikiArticle = null; navigateTo('https://wikitrade.org/')">Main Page</span>
            <span class="cursor-pointer hover:text-[#3366cc]" @click="openWikiArticle('Pear Inc.')">Pear Inc.</span>
            <span class="cursor-pointer hover:text-[#3366cc]" @click="openWikiArticle('MicroHard Corporation')">MicroHard</span>
            <span class="cursor-pointer hover:text-[#3366cc]" @click="openWikiArticle('Nvidiot')">Nvidiot</span>
            <span class="cursor-pointer hover:text-[#3366cc]" @click="openWikiArticle('MuskCar')">MuskCar</span>
            <span class="cursor-pointer hover:text-[#3366cc]" @click="openWikiArticle('Bytecoin')">Bytecoin</span>
          </div>

          <div class="flex items-center gap-1.5">
            <input
              v-model="wikiSearchQuery"
              @keyup.enter="wikiSearchQuery ? openWikiArticle(wikiSearchQuery) : null"
              placeholder="Search WikiTrade articles..."
              class="border border-[#a2a9b1] rounded px-3 py-1 text-xs w-56 text-[#202122] outline-none focus:border-[#3366cc]"
            />
            <button
              @click="wikiSearchQuery ? openWikiArticle(wikiSearchQuery) : null"
              class="bg-[#f8f9fa] border border-[#a2a9b1] hover:bg-[#eaf3fb] rounded px-3 py-1 text-xs font-semibold cursor-pointer text-[#202122]"
            >
              Search
            </button>
          </div>
        </nav>

        <div v-if="!activeTab.wikiArticle" class="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div class="lg:col-span-3 space-y-5">
            <div class="bg-[#eaf3fb] border border-[#a2a9b1] rounded p-4 space-y-2">
              <h1 class="text-2xl font-normal border-b border-[#a2a9b1] pb-2 text-[#202122]">
                Welcome to <b>WikiTrade</b>
              </h1>
              <p class="text-sm text-[#202122] leading-relaxed">
                WikiTrade is a free, decentralized encyclopedia covering all aspects of simulated financial markets, cryptocurrency protocols, corporate monopolies, and algorithmic trading dynamics. Currently maintaining <b>42,817 articles</b>.
              </p>
            </div>

            <div class="border border-[#a2a9b1] rounded overflow-hidden">
              <div class="bg-[#cee0f2] px-4 py-2 font-bold text-sm text-[#202122] border-b border-[#a2a9b1] flex items-center justify-between">
                <span>📰 Featured Article of the Day: Bytecoin (BYTE)</span>
                <span class="text-xs font-normal text-[#555]">Simange Simulation Archive</span>
              </div>
              <div class="p-4 text-sm leading-relaxed space-y-3">
                <p>
                  <b><span @click="openWikiArticle('Bytecoin')" class="text-[#3366cc] hover:underline cursor-pointer">Bytecoin (BYTE)</span></b> is a decentralized, proof-of-work cryptocurrency founded in 2018 by the pseudonymous <i>Satoshi-K</i> collective. Operating with a strict cap of <b>21,000,000 BYTE</b>, it implements the ASIC-resistant SHA-3K algorithm.
                </p>
                <div class="pt-1">
                  <span @click="openWikiArticle('Bytecoin')" class="text-xs text-[#3366cc] font-bold hover:underline cursor-pointer">Read full comprehensive article →</span>
                </div>
              </div>
            </div>

            <div class="border border-[#a2a9b1] rounded overflow-hidden">
              <div class="bg-[#cee0f2] px-4 py-2 font-bold text-sm text-[#202122] border-b border-[#a2a9b1]">
                📚 Market Topics &amp; Financial Categories
              </div>
              <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h3 class="font-bold text-[#202122] mb-1.5">📈 Global Equities &amp; Corporations</h3>
                  <ul class="list-disc pl-5 space-y-1 text-[#3366cc]">
                    <li><span @click="openWikiArticle('Pear Inc.')" class="hover:underline cursor-pointer">Pear Inc. (PEAR) — Consumer Titanium Tech</span></li>
                    <li><span @click="openWikiArticle('MicroHard Corporation')" class="hover:underline cursor-pointer">MicroHard Corporation (MHD) — Cloud &amp; AI</span></li>
                    <li><span @click="openWikiArticle('Nvidiot')" class="hover:underline cursor-pointer">Nvidiot (PIXL) — GPU Datacenter Clusters</span></li>
                    <li><span @click="openWikiArticle('MuskCar')" class="hover:underline cursor-pointer">MuskCar (TSLA-X) — Autonomous EV &amp; Robotics</span></li>
                  </ul>
                </div>
                <div>
                  <h3 class="font-bold text-[#202122] mb-1.5">🏢 Financial Infrastructure &amp; Tooling</h3>
                  <ul class="list-disc pl-5 space-y-1 text-[#3366cc]">
                    <li><span @click="navigateTo('bronomy://about')" class="hover:underline cursor-pointer">The Stock Tech Company Inc. — Creators of Bronomy</span></li>
                    <li><span @click="openWikiArticle('Order Book')" class="hover:underline cursor-pointer">Limit Order Book — Bids, Asks &amp; Spreads</span></li>
                    <li><span @click="openWikiArticle('Short Squeeze')" class="hover:underline cursor-pointer">Short Squeezes &amp; Liquidation Cascades</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="border border-[#a2a9b1] rounded overflow-hidden">
              <div class="bg-[#f8eaba] px-3 py-1.5 font-bold text-xs text-[#202122] border-b border-[#a2a9b1]">
                📊 Live Simange Quotes
              </div>
              <div class="p-3 text-xs divide-y divide-[#eaecf0]">
                <div v-for="sym in ['BYTE', 'PEAR', 'PIXL', 'TSLA-X', 'AETH', 'MEOW', 'SOLA', 'MHD']" :key="sym" class="py-1.5 flex justify-between items-center">
                  <span class="font-bold text-[#202122] cursor-pointer hover:text-[#3366cc]" @click="openWikiArticle(sym)">{{ sym }}</span>
                  <span class="font-mono text-[#555]">{{ getAssetPrice(sym, '$100.00') }}</span>
                  <span class="font-mono text-[11px] font-bold" :class="getAssetChange(sym, '+0%').isPositive ? 'text-[#006400]' : 'text-[#8b0000]'">
                    {{ getAssetChange(sym, '+0%').text }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Article Detail -->
        <div v-else class="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div class="lg:col-span-3 space-y-4">
            <div class="text-xs text-[#3366cc] hover:underline cursor-pointer" @click="activeTab.wikiArticle = null">
              ← Return to WikiTrade Main Page
            </div>
            <h1 class="text-3xl font-normal border-b border-[#a2a9b1] pb-2 text-[#202122]">{{ activeTab.wikiArticle }}</h1>
            <div class="text-sm leading-relaxed text-[#202122] space-y-4">
              <p><b>{{ activeTab.wikiArticle }}</b> is extensively documented within the Simange economic universe.</p>
              <p>Traders utilize real-time price feeds, order books, and hedge lines to manage volatility.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 6. PEAR.COM (APPLE MINIMALIST LUXURY PARODY)                   -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('pear.com') || activeTab.url.includes('pear.org')" class="min-h-full bg-[#fbfbfd] text-[#1d1d1f] font-sans pb-16">
        <nav class="bg-[#fbfbfd]/90 backdrop-blur-md border-b border-gray-200 px-8 py-3 flex items-center justify-between sticky top-0 z-20">
          <div class="flex items-center space-x-2 cursor-pointer" @click="navigateTo('https://pear.com/')">
            <span class="text-2xl">🍏</span>
            <span class="font-bold tracking-tight text-base text-[#1d1d1f]">Pear</span>
          </div>
          <div class="flex space-x-6 text-xs text-gray-500 font-medium">
            <span class="cursor-pointer hover:text-black">TitanPhone 17</span>
            <span class="cursor-pointer hover:text-black">PearBook M5</span>
            <span class="cursor-pointer hover:text-black">PearWatch 3</span>
            <span class="cursor-pointer hover:text-black">Polishing Cloth ($149)</span>
          </div>
          <div class="text-xs font-mono text-gray-600 font-semibold">
            PEAR: {{ getAssetPrice('PEAR', '$224.50') }}
          </div>
        </nav>

        <div class="max-w-4xl mx-auto pt-10 px-6 text-center space-y-6">
          <div class="text-xs font-semibold text-[#b32400] tracking-widest uppercase">NEW REVOLUTIONARY HARDWARE</div>
          <h1 class="text-5xl md:text-6xl font-black tracking-tight text-black">
            TitanPhone 17 Pro Ultra Max Max
          </h1>
          <p class="text-lg text-gray-600 max-w-lg mx-auto font-light leading-relaxed">
            Titanium micro-architecture. Zero ports. Subconscious thought vibrations. From ${{ titanPrice.toLocaleString() }}.
          </p>

          <!-- Interactive Customizer -->
          <div class="max-w-md mx-auto p-5 bg-white border border-gray-200 rounded-2xl shadow-lg text-left space-y-4">
            <div class="text-xs font-bold text-gray-900 border-b pb-2">CUSTOMIZE YOUR TITANPHONE:</div>
            <div>
              <span class="text-[11px] text-gray-500 block mb-1">Storage:</span>
              <div class="grid grid-cols-3 gap-2 text-xs">
                <button
                  v-for="s in ['1TB', '4TB', '16TB Neural']"
                  :key="s"
                  @click="titanStorage = s"
                  class="py-2 rounded-lg border font-medium text-center transition"
                  :class="titanStorage === s ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3] font-bold' : 'border-gray-200 text-gray-700'"
                >
                  {{ s }}
                </button>
              </div>
            </div>

            <div>
              <span class="text-[11px] text-gray-500 block mb-1">Finish:</span>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <button
                  v-for="c in ['Natural Titanium', 'Space Titanium', 'Black Hole Black', 'Bankruptcy Gold']"
                  :key="c"
                  @click="titanColor = c"
                  class="py-1.5 px-2 rounded-lg border text-xs text-center transition"
                  :class="titanColor === c ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3] font-bold' : 'border-gray-200 text-gray-700'"
                >
                  {{ c }}
                </button>
              </div>
            </div>

            <div>
              <span class="text-[11px] text-gray-500 block mb-1">Laser Engraving:</span>
              <input v-model="titanEngraving" placeholder="e.g. HODL OR DIE" maxlength="20" class="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-black outline-none focus:border-[#0071e3]" />
            </div>

            <div class="pt-2 border-t flex justify-between items-center">
              <div>
                <span class="text-[10px] text-gray-400 block">PRICE:</span>
                <span class="text-xl font-black text-black">${{ titanPrice.toLocaleString() }}</span>
              </div>
              <button class="px-5 py-2 rounded-full bg-[#0071e3] text-white text-xs font-bold hover:bg-[#0077ed]">
                Pre-order Now
              </button>
            </div>
          </div>

          <!-- Product Line Showcase -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left text-xs">
            <div class="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
              <span class="text-2xl">💻</span>
              <h3 class="font-bold text-sm text-black">PearBook M5 Extreme</h3>
              <p class="text-gray-500">256 GPU cores. Liquid nitrogen cooling sold separately for $899.</p>
              <div class="font-bold text-black pt-1">$3,899</div>
            </div>
            <div class="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
              <span class="text-2xl">🥽</span>
              <h3 class="font-bold text-sm text-black">PearVision Pro 2</h3>
              <p class="text-gray-500">Spatial computing headset designed to project your portfolio loss in 8K.</p>
              <div class="font-bold text-black pt-1">$4,499</div>
            </div>
            <div class="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
              <span class="text-2xl">✨</span>
              <h3 class="font-bold text-sm text-black">Pear Polishing Cloth Pro</h3>
              <p class="text-gray-500">Woven with real nano-titanium fibers. Cleans subconscious residue.</p>
              <div class="font-bold text-black pt-1">$149</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 7. MICROHARD.COM (RICH ENTERPRISE CLOUD & COPILOT SUITE)       -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('microhard.com') || activeTab.url.includes('microhard.org')" class="min-h-full bg-white text-[#1a1a1a] font-sans pb-16">
        <nav class="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between sticky top-0 z-20">
          <div class="flex items-center space-x-2 cursor-pointer" @click="navigateTo('https://microhard.com/')">
            <span class="text-2xl text-[#0078d4]">💻</span>
            <span class="text-xl font-black text-[#0078d4]">MicroHard</span>
          </div>
          <div class="flex space-x-6 text-xs text-gray-500 font-medium">
            <span class="cursor-pointer hover:text-[#0078d4]">CloudVault</span>
            <span class="cursor-pointer hover:text-[#0078d4]">MH Office 365</span>
            <span class="cursor-pointer hover:text-[#0078d4]">Copilot AI</span>
            <span class="cursor-pointer hover:text-[#0078d4]">ByteStudio</span>
          </div>
          <div class="text-xs font-mono text-gray-500">
            MHD: {{ getAssetPrice('MHD', '$448.20') }}
          </div>
        </nav>

        <div class="max-w-5xl mx-auto p-6 space-y-8">
          <!-- CloudVault Banner -->
          <div class="bg-gradient-to-r from-[#003087] to-[#0078d4] text-white p-8 rounded-2xl shadow-xl space-y-3">
            <span class="text-[10px] text-blue-200 uppercase tracking-widest font-mono">ENTERPRISE HYBRID CLOUD</span>
            <h2 class="text-3xl font-black">CloudVault with Native Bytecoin Settlement</h2>
            <p class="text-xs text-blue-100 max-w-xl leading-relaxed">
              Powering 500 million enterprise accounts worldwide with automated treasury billing in sovereign decentralized bytes.
            </p>
          </div>

          <!-- Interactive Cloud Calculator & Copilot Prompt -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Cloud Calculator -->
            <div class="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
              <h3 class="font-bold text-sm text-gray-900 flex items-center gap-2">
                <span>☁️</span>
                <span>Enterprise CloudVault Seat Estimator</span>
              </h3>
              <div class="space-y-1">
                <div class="flex justify-between text-xs text-gray-600">
                  <span>Seats:</span>
                  <span class="font-bold text-[#0078d4]">{{ mhEnterpriseSeats.toLocaleString() }} Corporate Users</span>
                </div>
                <input v-model.number="mhEnterpriseSeats" type="range" min="1000" max="100000" step="1000" class="w-full accent-[#0078d4]" />
              </div>
              <div class="p-3 bg-white border border-gray-200 rounded-xl space-y-1 text-xs">
                <div class="flex justify-between text-gray-600">
                  <span>Monthly Billing (USD):</span>
                  <span class="font-bold text-black">${{ mhCloudMonthlyUSD.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Monthly Billing (BYTE):</span>
                  <span class="font-bold text-[#0078d4]">≈ {{ mhCloudMonthlyBYTE }} BYTE</span>
                </div>
              </div>
            </div>

            <!-- Copilot AI Simulator -->
            <div class="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-3 text-xs">
              <h3 class="font-bold text-sm text-gray-900 flex items-center gap-2">
                <span>🤖</span>
                <span>MicroHard Copilot Executive Memo Generator</span>
              </h3>
              <p class="text-gray-500">Ask Copilot to draft a corporate memo or earnings excuse:</p>
              <input v-model="mhCopilotPrompt" class="w-full border border-gray-300 rounded-lg p-2 text-xs" />
              <button
                @click="generateMhCopilot"
                :disabled="mhIsGeneratingCopilot"
                class="w-full py-2 bg-[#0078d4] text-white font-bold rounded-lg hover:bg-[#0060aa] transition"
              >
                {{ mhIsGeneratingCopilot ? 'Generating Corporate Synergies...' : 'Generate Copilot Memo' }}
              </button>
              <div v-if="mhCopilotResponse" class="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 italic leading-relaxed">
                {{ mhCopilotResponse }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 8. BLOOMBERG-WIRE.NET (DEEP REAL-TIME AMBER FINANCIAL WIRE)     -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('bloomberg-wire.net') || activeTab.url.includes('bloomberg-wire.org')" class="min-h-full bg-black text-[#f59e0b] font-mono p-6 pb-20">
        <div class="max-w-5xl mx-auto space-y-6">
          <div class="border-b-2 border-[#f59e0b] pb-3 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <span class="text-3xl">📡</span>
              <div>
                <h1 class="text-2xl font-black text-[#f59e0b]">BLOOMBERG WIRE // TERMINAL FEED</h1>
                <p class="text-[10px] text-gray-400">High-Frequency Market Intelligence &amp; Global Commodities</p>
              </div>
            </div>
            <div class="text-right text-xs">
              <span class="bg-[#f59e0b]/20 px-2.5 py-1 rounded font-bold border border-[#f59e0b]/40">
                FEAR &amp; GREED: 78 (EXTREME GREED)
              </span>
            </div>
          </div>

          <!-- Command Terminal Bar -->
          <div class="flex gap-2">
            <span class="text-white py-1">CMD &gt;</span>
            <input
              v-model="bloombergCommand"
              @keyup.enter="executeBloombergCmd"
              placeholder="Type TOP, COMM, RUMOR, or MACRO and press enter..."
              class="flex-1 bg-black border border-[#f59e0b]/50 rounded px-3 py-1 text-xs text-white uppercase outline-none focus:border-[#f59e0b]"
            />
            <button @click="executeBloombergCmd" class="px-4 py-1 bg-[#f59e0b] text-black font-bold text-xs rounded">
              EXECUTE &lt;GO&gt;
            </button>
          </div>

          <!-- Live Commodities Board -->
          <div class="p-4 bg-[#0d0903] border border-[#f59e0b]/40 rounded-xl space-y-2">
            <div class="text-xs font-bold text-white flex justify-between border-b border-[#f59e0b]/30 pb-1.5">
              <span>GLOBAL INDUSTRIAL COMMODITIES // REAL-TIME SPOT</span>
              <span class="text-[#f59e0b]">UPDATED REALTIME</span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs pt-1">
              <div class="p-2 bg-black/60 border border-[#f59e0b]/20 rounded">
                <div class="text-gray-400 text-[10px]">CRUDE OIL (WTI)</div>
                <div class="text-white font-bold">$74.20 / bbl</div>
                <div class="text-cyber-green text-[10px]">+1.4%</div>
              </div>
              <div class="p-2 bg-black/60 border border-[#f59e0b]/20 rounded">
                <div class="text-gray-400 text-[10px]">GOLD BULLION</div>
                <div class="text-white font-bold">$2,745.50 / oz</div>
                <div class="text-cyber-green text-[10px]">+0.8%</div>
              </div>
              <div class="p-2 bg-black/60 border border-[#f59e0b]/20 rounded">
                <div class="text-gray-400 text-[10px]">TITANIUM SPONGE</div>
                <div class="text-white font-bold">$48.50 / kg</div>
                <div class="text-cyber-green text-[10px]">+3.2%</div>
              </div>
              <div class="p-2 bg-black/60 border border-[#f59e0b]/20 rounded">
                <div class="text-gray-400 text-[10px]">3NM SILICON WAFERS</div>
                <div class="text-white font-bold">$18,400 / wfr</div>
                <div class="text-cyber-green text-[10px]">+5.6%</div>
              </div>
              <div class="p-2 bg-black/60 border border-[#f59e0b]/20 rounded">
                <div class="text-gray-400 text-[10px]">ELECTRIC GRID</div>
                <div class="text-white font-bold">$92.40 / MWh</div>
                <div class="text-cyber-green text-[10px]">+2.1%</div>
              </div>
            </div>
          </div>

          <!-- Breaking Headlines Stream -->
          <div class="space-y-2">
            <div class="text-xs font-bold text-white border-b border-[#f59e0b]/30 pb-1">BREAKING FINANCIAL DISPATCHES:</div>
            <div
              v-for="item in store.newsFeed.slice(0, 8)"
              :key="item.id"
              class="p-3 bg-[#110d05] border border-[#f59e0b]/30 rounded flex justify-between items-center text-xs"
            >
              <span class="text-white leading-relaxed">{{ item.headline }}</span>
              <span class="text-[10px] text-gray-400 font-mono ml-4 shrink-0">{{ new Date(item.timestamp).toLocaleTimeString() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 9. NVIDIOT.AI (NVIDIA ELECTRIC GREEN GPU SILICON PARODY)       -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('nvidiot.ai') || activeTab.url.includes('nvidiot.org')" class="min-h-full bg-black text-gray-200 font-mono p-6 pb-20">
        <div class="max-w-5xl mx-auto space-y-8">
          <div class="flex items-center justify-between border-b border-[#76b900]/40 pb-4">
            <div class="flex items-center space-x-3 cursor-pointer" @click="navigateTo('https://nvidiot.ai/')">
              <span class="text-3xl text-[#76b900]">🟩</span>
              <div>
                <h1 class="text-2xl font-black text-[#76b900] tracking-wider">NVIDIOT.AI</h1>
                <p class="text-[10px] text-gray-400">The Global GPU Monopolizer // Jensen Leather Jacket Computing</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs text-gray-400">STOCK PIXL:</span>
              <span class="text-base font-bold text-[#76b900] ml-1">{{ getAssetPrice('PIXL', '$132.80') }}</span>
            </div>
          </div>

          <div class="p-6 rounded-xl bg-gradient-to-r from-black via-[#0d1f05] to-black border-2 border-[#76b900] shadow-[0_0_30px_rgba(118,185,0,0.3)] space-y-4">
            <div class="inline-block px-3 py-1 bg-[#76b900]/20 text-[#76b900] text-xs font-bold rounded">
              GTC 2026 KEYNOTE REVEAL
            </div>
            <h2 class="text-3xl font-black text-white">
              "The More You Buy, The More You Save™"
            </h2>
            <p class="text-xs text-gray-300 leading-relaxed max-w-2xl">
              Announcing the Blackwell H2000 Quantum Tensor Cluster. Delivering 10,000,000 synthetic TFLOPs of raw computational leverage directly into simulated datacenter racks worldwide.
            </p>
          </div>

          <div class="p-6 bg-[#0a0f05] border border-[#76b900]/40 rounded-xl space-y-4">
            <h3 class="text-base font-bold text-[#76b900]">⚡ H2000 Quantum Supercomputer Rack Configurator</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-xs">
                <span>GPU Cluster Size:</span>
                <span class="text-[#76b900] font-bold">{{ gpuCount }} Quantum GPUs</span>
              </div>
              <input v-model.number="gpuCount" type="range" min="8" max="1024" step="8" class="w-full accent-[#76b900] cursor-pointer" />
            </div>

            <div class="grid grid-cols-3 gap-3 text-center pt-2">
              <div class="p-3 bg-black/80 border border-[#76b900]/30 rounded">
                <div class="text-lg font-bold text-[#76b900]">{{ clusterPower }} MW</div>
                <div class="text-[10px] text-gray-400">POWER CONSUMPTION</div>
              </div>
              <div class="p-3 bg-black/80 border border-[#76b900]/30 rounded">
                <div class="text-lg font-bold text-white">${{ clusterCost }}</div>
                <div class="text-[10px] text-gray-400">TOTAL CAPITAL COST</div>
              </div>
              <div class="p-3 bg-black/80 border border-[#76b900]/30 rounded">
                <div class="text-lg font-bold text-cyber-green">100%</div>
                <div class="text-[10px] text-gray-400">JENSEN JACKET APPROVAL</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 10. MUSKCAR.COM (TESLA & STARSHIP PARODY)                      -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('muskcar.com') || activeTab.url.includes('muskcar.org')" class="min-h-full bg-black text-white font-mono p-6 pb-20">
        <div class="max-w-5xl mx-auto space-y-8">
          <div class="flex items-center justify-between border-b border-[#e82127]/40 pb-4">
            <div class="flex items-center space-x-3 cursor-pointer" @click="navigateTo('https://muskcar.com/')">
              <span class="text-3xl text-[#e82127]">🚀</span>
              <div>
                <h1 class="text-2xl font-black text-white tracking-widest">MUSKCAR // MARS</h1>
                <p class="text-[10px] text-gray-400">Autonomous CyberTruck &amp; Mars Shuttle Network</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-xs text-gray-400">TSLA-X:</span>
              <span class="text-base font-bold text-[#e82127] ml-1">{{ getAssetPrice('TSLA-X', '$262.30') }}</span>
            </div>
          </div>

          <div class="p-5 rounded-xl bg-[#0f0f0f] border border-[#e82127]/50 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-[#e82127] font-bold">🐦 3:00 AM ELON MOWSK TWEET FEED</span>
              <button @click="generateElonTweet" class="px-3 py-1 bg-[#e82127] text-white text-[10px] font-bold rounded hover:bg-[#c5171d]">
                GENERATE NEW TWEET
              </button>
            </div>
            <div class="p-3 bg-black rounded border border-gray-800 text-sm italic text-gray-200">
              "{{ currentElonTweet }}"
            </div>
          </div>

          <div class="p-6 bg-[#0a0a0a] border border-[#e82127] rounded-xl text-center space-y-4">
            <h2 class="text-2xl font-black uppercase tracking-tight">One-Way Mars Shuttle Ticket Booking</h2>
            <p class="text-xs text-gray-400 max-w-md mx-auto">
              Seats are payable in MeowCoin (MEOW) or Bytecoin (BYTE). Cryo-sleep pods include complimentary high-speed Starlink trading terminals.
            </p>
            <div class="flex justify-center gap-4 text-xs">
              <button class="px-6 py-2.5 bg-[#e82127] text-white font-bold rounded hover:bg-[#c5171d]">
                Book with 50 BYTE
              </button>
              <button class="px-6 py-2.5 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300">
                Book with 5,000,000 MEOW
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 11. BYTECOIN.ORG (SOVEREIGN DIGITAL GOLD FOUNDATION)           -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('bytecoin.org')" class="min-h-full bg-[#0a0a0f] text-gray-200 font-sans p-6 pb-20">
        <div class="max-w-5xl mx-auto space-y-8">
          <nav class="flex items-center justify-between border-b border-[#f7931a]/30 pb-4">
            <div class="flex items-center space-x-3 cursor-pointer" @click="navigateTo('https://bytecoin.org/')">
              <div class="w-10 h-10 rounded-full bg-[#f7931a] text-black font-black flex items-center justify-center text-2xl shadow-lg">₿</div>
              <div>
                <h1 class="text-2xl font-black text-[#f7931a] tracking-tight">BYTECOIN FOUNDATION</h1>
                <p class="text-[10px] text-gray-400">Open Source Sovereign Sound Digital Gold // Established 2018</p>
              </div>
            </div>
            <div class="text-right font-mono">
              <div class="text-xs text-gray-400">LIVE BYTE PRICE</div>
              <div class="text-base font-bold text-[#f7931a]">{{ getAssetPrice('BYTE', '$68,450.00') }}</div>
            </div>
          </nav>

          <div class="p-6 rounded-2xl bg-gradient-to-b from-[#1a1205] to-[#0d0d14] border border-[#f7931a]/40 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-white flex items-center gap-2">
                <span>⏳</span>
                <span>Interactive Halving Countdown Simulator</span>
              </h3>
              <span class="text-xs text-[#f7931a] font-mono font-bold">TARGET: BLOCK 840,000</span>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between text-xs font-mono text-gray-400">
                <span>Current Simulated Block: {{ halvingBlockHeight }}</span>
                <span>Block Reward Subsidy: <strong class="text-white">{{ halvingSubsidy }}</strong></span>
              </div>
              <div class="w-full bg-black/60 h-3 rounded-full overflow-hidden border border-[#f7931a]/40">
                <div
                  class="bg-[#f7931a] h-full transition-all duration-300"
                  :style="{ width: ((halvingBlockHeight - 839900) / (840000 - 839900) * 100) + '%' }"
                ></div>
              </div>
            </div>

            <div class="flex justify-between items-center pt-2">
              <button
                @click="advanceHalvingBlock"
                class="px-4 py-2 bg-[#f7931a] hover:bg-[#ffa940] text-black font-bold text-xs rounded-lg font-mono transition"
              >
                ⛏️ Mine Next Blocks (+12 Blocks)
              </button>
              <span v-if="halvingConfetti" class="text-cyber-green font-bold text-xs font-mono animate-bounce">
                🎉 HALVING COMPLETE! REWARD HALVED TO 3.125 BYTE!
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 12. AETHEREUM.IO (WEB3 & SMART CONTRACT PARODY)                -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('aethereum.io') || activeTab.url.includes('aethereum.org')" class="min-h-full bg-[#0b0e1e] text-gray-200 font-sans p-6 pb-20">
        <div class="max-w-5xl mx-auto space-y-8">
          <div class="flex items-center justify-between border-b border-indigo-500/30 pb-4">
            <div class="flex items-center space-x-3 cursor-pointer" @click="navigateTo('https://aethereum.io/')">
              <span class="text-3xl text-indigo-400">💎</span>
              <div>
                <h1 class="text-2xl font-black text-indigo-400 tracking-wider">AETHEREUM.IO</h1>
                <p class="text-[10px] text-gray-400">The Global Programmable Value Settlement Machine</p>
              </div>
            </div>
            <div class="text-right font-mono">
              <div class="text-xs text-gray-400">AETH PRICE</div>
              <div class="text-base font-bold text-indigo-400">{{ getAssetPrice('AETH', '$3,620.00') }}</div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="cyber-panel p-5 rounded-xl border border-indigo-500/50 space-y-3 font-mono text-xs">
              <h3 class="font-bold text-white text-sm">⛽ Real-Time Simulated Gas Tracker</h3>
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-2 bg-black/50 border border-indigo-500/30 rounded">
                  <div class="text-cyber-green font-bold">12 Gwei</div>
                  <div class="text-[9px] text-gray-400">SLOW</div>
                </div>
                <div class="p-2 bg-black/50 border border-indigo-500/30 rounded">
                  <div class="text-cyber-blue font-bold">24 Gwei</div>
                  <div class="text-[9px] text-gray-400">STANDARD</div>
                </div>
                <div class="p-2 bg-black/50 border border-indigo-500/30 rounded">
                  <div class="text-cyber-red font-bold">75 Gwei</div>
                  <div class="text-[9px] text-gray-400">DEGEN</div>
                </div>
              </div>

              <div class="pt-2 border-t border-indigo-500/30 space-y-1.5">
                <div class="flex justify-between items-center text-[11px]">
                  <span>Stake AETH:</span>
                  <input v-model.number="aethStakeInput" type="number" min="1" max="1000" class="w-16 bg-black border border-indigo-500/40 rounded px-1.5 py-0.5 text-center text-white" />
                </div>
                <div class="text-[10px] text-cyber-green">
                  Estimated 4.2% APR Yield: ~{{ (aethStakeInput * 0.042).toFixed(3) }} AETH/year
                </div>
              </div>
            </div>

            <div class="cyber-panel p-5 rounded-xl border border-indigo-500/50 space-y-3 font-mono text-xs">
              <h3 class="font-bold text-white text-sm">📜 Interactive Smart Contract Deployer</h3>
              <p class="text-[11px] text-gray-400">Simulate deploying a decentralized token on the Aethereum VM.</p>
              <button
                @click="deploySmartContract"
                :disabled="isDeployingContract"
                class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded transition"
              >
                {{ isDeployingContract ? 'Broadcasting & Verifying Bytecode...' : 'Deploy Smart Contract (24 Gwei)' }}
              </button>
              <div v-if="deployedContractHash" class="p-2 bg-black/80 rounded border border-indigo-500/40 text-[10px] break-all text-cyber-green">
                SUCCESS: Deployed at {{ deployedContractHash }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 13. MEOWCOIN.NET (DOGECOIN MEME COIN PARODY)                   -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('meowcoin.net') || activeTab.url.includes('meowcoin.org')" class="min-h-full bg-gradient-to-b from-[#2a1d00] to-[#120d00] text-yellow-300 font-sans p-6 select-none relative pb-20">
        <div
          v-for="puff in meowFloatingPuffs"
          :key="puff.id"
          class="absolute font-black text-sm text-yellow-400 pointer-events-none animate-bounce"
          :style="{ left: puff.x + 'px', top: puff.y + 'px' }"
        >
          {{ puff.text }}
        </div>

        <div class="max-w-4xl mx-auto text-center space-y-6">
          <div class="text-6xl animate-pulse">🐱</div>
          <h1 class="text-4xl md:text-5xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]">
            MEOWCOIN.NET
          </h1>
          <p class="text-sm text-yellow-200/80 max-w-md mx-auto">
            Much Volatility. Very Liquidation. Such Candlestick. 100 Trillion tokens backed purely by feline internet vibes.
          </p>

          <div class="max-w-sm mx-auto p-5 bg-black/80 border-2 border-yellow-400 rounded-2xl text-left space-y-3 font-mono text-xs shadow-xl">
            <div class="text-yellow-400 font-bold border-b border-yellow-400/40 pb-2">🔄 MEOWSWAP DEX SIMULATOR</div>
            <div>
              <span class="text-gray-400 text-[10px]">PAY:</span>
              <div class="flex gap-2">
                <input v-model.number="meowSwapFrom" type="number" min="1" class="bg-black border border-yellow-400/50 rounded px-2 py-1 text-white flex-1" />
                <select v-model="meowSwapCurrency" class="bg-black border border-yellow-400/50 rounded px-2 py-1 text-yellow-300">
                  <option value="USDF">USDF</option>
                  <option value="BYTE">BYTE</option>
                </select>
              </div>
            </div>
            <div>
              <span class="text-gray-400 text-[10px]">RECEIVE (ESTIMATED):</span>
              <div class="text-lg font-black text-yellow-400 bg-black/60 p-2 rounded border border-yellow-400/30">
                ≈ {{ meowSwapOutput }} MEOW
              </div>
            </div>
            <button
              @click="petMeow($event)"
              class="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-lg transition"
            >
              🐾 Swap &amp; Pump Meow! (Total Purrs: {{ meowClicks }})
            </button>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 14. APESWALLSTREET.COM (REDDIT WSB FORUM PARODY)               -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('apeswallstreet.com') || activeTab.url.includes('apeswallstreet.org')" class="min-h-full bg-[#0e1113] text-[#d7dadc] font-sans pb-20">
        <header class="bg-[#1a1a1b] border-b border-[#343536] px-6 py-2.5 flex items-center justify-between sticky top-0 z-20">
          <div class="flex items-center space-x-2 cursor-pointer" @click="navigateTo('https://apeswallstreet.com/')">
            <span class="text-2xl">🦍</span>
            <span class="font-black text-white text-base">r/ApesOfWallStreet</span>
            <span class="text-[10px] bg-[#ff4500] text-white px-2 py-0.5 rounded-full font-bold">DEGEN FORUM</span>
          </div>
          <div class="text-xs text-gray-400 font-mono">
            <span>2.8M Apes Online</span> • <span>Loss Porn Allowed</span>
          </div>
        </header>

        <div class="max-w-4xl mx-auto p-6 space-y-4">
          <div
            v-for="post in forumPosts"
            :key="post.id"
            class="bg-[#1a1a1b] border border-[#343536] hover:border-gray-500 rounded-lg p-4 flex gap-4 transition"
          >
            <div class="flex flex-col items-center justify-start text-xs font-mono font-bold shrink-0">
              <button
                @click="toggleVote(post, 1)"
                class="p-1 hover:text-[#ff4500] transition text-base"
                :class="post.userVoted === 1 ? 'text-[#ff4500]' : 'text-gray-400'"
              >
                ▲
              </button>
              <span :class="post.userVoted === 1 ? 'text-[#ff4500]' : post.userVoted === -1 ? 'text-[#7193ff]' : 'text-white'">
                {{ post.upvotes }}
              </span>
              <button
                @click="toggleVote(post, -1)"
                class="p-1 hover:text-[#7193ff] transition text-base"
                :class="post.userVoted === -1 ? 'text-[#7193ff]' : 'text-gray-400'"
              >
                ▼
              </button>
            </div>

            <div class="space-y-2 flex-1 min-w-0">
              <div class="flex items-center gap-2 text-[10px] text-gray-400">
                <span :style="{ backgroundColor: post.flairColor + '22', color: post.flairColor, borderColor: post.flairColor }" class="px-2 py-0.5 rounded font-bold border">
                  {{ post.flair }}
                </span>
                <span>Posted by u/{{ post.author }}</span>
                <span>•</span>
                <span>{{ post.time }}</span>
              </div>
              <h3 class="text-sm font-bold text-white leading-snug">
                {{ post.title }}
              </h3>
              <p class="text-xs text-gray-300 leading-relaxed">
                {{ post.body }}
              </p>

              <div class="pt-2 space-y-1.5 border-t border-[#343536]">
                <div v-for="(c, cidx) in post.comments" :key="cidx" class="text-[11px] p-2 bg-[#121417] rounded border border-gray-800">
                  <span class="font-bold text-cyber-blue">u/{{ c.author }}</span>
                  <span class="text-gray-500 text-[10px] ml-2">{{ c.time }}</span>
                  <p class="text-gray-300 mt-0.5">{{ c.text }}</p>
                </div>
              </div>

              <div class="flex gap-2 pt-1">
                <input
                  v-model="newCommentInputs[post.id]"
                  @keyup.enter="addComment(post)"
                  placeholder="Add your degen comment..."
                  class="flex-1 bg-[#121417] border border-gray-700 rounded px-3 py-1 text-xs text-white outline-none focus:border-[#ff4500]"
                />
                <button
                  @click="addComment(post)"
                  class="px-3 py-1 bg-[#ff4500] hover:bg-[#e03d00] text-white font-bold text-xs rounded"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 15. SOLONA.NET (SOLANA HIGH SPEED TPS PARODY)                  -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('solona.net') || activeTab.url.includes('solona.org')" class="min-h-full bg-[#0a0518] text-white font-mono p-6 pb-20">
        <div class="max-w-5xl mx-auto space-y-8 text-center">
          <div class="text-4xl">🟣</div>
          <h1 class="text-4xl font-black bg-gradient-to-r from-[#00ffa3] to-[#dc1fff] bg-clip-text text-transparent">
            SOLONA.NET // HIGH THROUGHPUT L1
          </h1>
          <p class="text-xs text-gray-400">Proof of History. 400ms Block Times. Zero Congestion.</p>

          <div class="max-w-md mx-auto p-6 bg-black/60 border border-[#dc1fff]/50 rounded-2xl space-y-3">
            <div class="text-xs text-gray-400">LIVE TELEMETRY THROUGHPUT</div>
            <div class="text-4xl font-black" :class="isTpsStressed ? 'text-[#ff007a] animate-pulse' : 'text-[#00ffa3]'">
              {{ liveTps.toLocaleString() }} TPS
            </div>
            <div class="text-[10px]" :class="isTpsStressed ? 'text-[#ff007a] font-bold' : 'text-gray-500'">
              {{ isTpsStressed ? '⚠️ NETWORK UNDER 100,000 TPS ARBITRAGE STRESS!' : 'Status: 99.2% Uptime (Scheduled reboot 2h ago)' }}
            </div>
            <button
              @click="triggerSolonaStress"
              class="px-4 py-2 bg-gradient-to-r from-[#00ffa3] to-[#dc1fff] text-black font-black text-xs rounded-lg hover:opacity-90 transition"
            >
              🚀 Inject 50,000 Transactions Stress Test
            </button>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 16. SIMANGE.IO / SIMANGE.ORG (OFFICIAL PORTAL)                 -->
      <!-- ============================================================== -->
      <div v-else-if="activeTab.url.includes('simange.io') || activeTab.url.includes('simange.org')" class="min-h-full bg-[#080a0f] text-gray-200 font-mono p-6 pb-20">
        <div class="max-w-5xl mx-auto space-y-8">
          <div class="flex items-center justify-between border-b border-cyber-blue/30 pb-4">
            <div class="flex items-center space-x-3 cursor-pointer" @click="navigateTo('https://simange.io/')">
              <div class="w-10 h-10 rounded-lg bg-cyber-blue/20 border border-cyber-blue flex items-center justify-center text-xl shadow-glow-blue">⚡</div>
              <div>
                <h1 class="text-2xl font-black text-white tracking-widest text-cyber-blue drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                  SIMANGE.IO
                </h1>
                <p class="text-[11px] text-terminal-muted">Official Project Portal &amp; Documentation // KaProject Labs</p>
              </div>
            </div>
          </div>

          <div class="cyber-panel p-6 rounded-xl border-2 border-cyber-blue/60 shadow-glow-blue space-y-4">
            <h2 class="text-3xl font-black text-white">Simulate Market Chaos. Control the Candlesticks.</h2>
            <p class="text-xs text-terminal-muted leading-relaxed max-w-2xl">
              Simange is an open-source cyberpunk financial market simulator engineered with Tauri v2, Rust, Vue 3, and Web Audio synthesis.
            </p>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- 17. DEFAULT 404 FALLBACK IN SIMANGE UNIVERSE                   -->
      <!-- ============================================================== -->
      <div v-else class="flex flex-col items-center justify-center min-h-full text-center space-y-4 p-8">
        <div class="text-5xl">🌐</div>
        <h2 class="text-lg font-bold text-terminal-muted font-mono">Page Not Found in SIMANGE Universe</h2>
        <p class="text-terminal-muted text-xs max-w-sm leading-relaxed font-mono">
          The address <code class="text-cyber-blue">{{ activeTab.url }}</code> is not a registered in-game fiction site.
        </p>
        <button
          @click="navigateTo('https://bronomy.search/')"
          class="px-4 py-2 rounded bg-cyber-blue text-black font-bold text-xs font-mono"
        >
          Return to Bronomy Search
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

/* Custom minimal scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>