const SAVE_KEY = 'court-atlas-career-v1';
const UI_MODE_KEY = 'courtbound-interface-v1';

const STAT_META = {
  finish: { label: '終結', code: 'FIN', icon: '↗' },
  shooting: { label: '投射', code: 'SHT', icon: '◎' },
  playmaking: { label: '組織', code: 'PLY', icon: '⌁' },
  defense: { label: '防守', code: 'DEF', icon: '⊕' },
  athletic: { label: '體能', code: 'ATH', icon: 'ϟ' },
  iq: { label: '球商', code: 'IQ', icon: '◇' }
};

const STAT_TIERS = [
  { min: 90, label: '怪物級', bonus: 8 },
  { min: 80, label: '王牌級', bonus: 5 },
  { min: 70, label: '強項', bonus: 3 },
  { min: 60, label: '熟練', bonus: 1.5 },
  { min: 0, label: '成長中', bonus: 0 }
];

const POSITIONS = {
  PG: { name: '控球後衛', desc: '創造與球商', number: 3, height: 174, bonus: { playmaking: 5, iq: 4, shooting: 1 } },
  SG: { name: '得分後衛', desc: '投射與終結', number: 7, height: 181, bonus: { shooting: 5, finish: 4, athletic: 1 } },
  SF: { name: '小前鋒', desc: '全能與防守', number: 13, height: 187, bonus: { defense: 3, finish: 3, athletic: 3, iq: 1 } },
  PF: { name: '大前鋒', desc: '對抗與空間', number: 21, height: 193, bonus: { finish: 4, defense: 3, athletic: 3 } },
  C: { name: '中鋒', desc: '護框與籃板', number: 34, height: 199, bonus: { defense: 5, athletic: 3, finish: 2 } }
};

const STYLES = {
  street: { name: '巷口魔術師', code: 'CREATOR', desc: '節奏 +8；愛變速、愛傳妙球，防守很難猜。', bonus: { playmaking: 4, finish: 2 }, pulse: { rhythm: 8 } },
  sniper: { name: '沉默射手', code: 'SNIPER', desc: '投射 +6；只要有一點空間，就敢出手。', bonus: { shooting: 6 }, pulse: { rhythm: 3 } },
  stopper: { name: '黏人防線', code: 'STOPPER', desc: '防守 +5、體能 +2；黏緊對手，不給他好投。', bonus: { defense: 5, athletic: 2 }, pulse: { trust: 4 } },
  engine: { name: '球場引擎', code: 'ENGINE', desc: '球商 +4、組織 +3；看得懂場上狀況，知道下一球怎麼打。', bonus: { iq: 4, playmaking: 3 }, pulse: { trust: 5 } },
  none: { name: '尚未成形', code: 'OPEN', desc: '你的打法會由生涯中的選擇慢慢長出來。', bonus: {}, pulse: {} }
};

const PLAYER_NAMES = [
  '林拓海', '陳昱安', '張凱翔', '李承恩', '王柏鈞', '吳宇辰', '劉冠廷', '黃子軒', '趙品睿', '周宥廷',
  '蔡沛洋', '楊哲宇', '鄭維新', '謝孟軒', '洪睿哲', '郭奕辰', '曾柏翰', '徐浩然', '賴彥廷', '蘇祐晨',
  '江品妤', '何語晴', '羅羽彤', '高宥蓁', '梁欣妍', '朱芷寧', '彭若希', '方語恩', '葉昕妤', '杜采潔'
];

const SEED_TRAITS = [
  { id: 'genius', code: 'GENIUS', name: '天才型', base: 3, growth: 1.12, load: 1, bonus: { iq: 2 }, desc: '一開始就比別人強，學新招也很快。' },
  { id: 'grinder', code: 'GRIND', name: '苦練型', base: -2, growth: 1.24, load: 1.06, bonus: {}, desc: '起步普通，但每次練球都進步更多。' },
  { id: 'early', code: 'EARLY', name: '早熟型', base: 5, growth: .94, load: 1.02, bonus: {}, desc: '國中就很能打，前期比較容易搶到上場時間。' },
  { id: 'late', code: 'LATE', name: '晚成型', base: -4, growth: 1.32, load: .96, bonus: {}, desc: '前面比較慢，但越練越強，後期很有機會追上來。' },
  { id: 'iron', code: 'IRON', name: '鐵人型', base: 0, growth: 1.05, load: .72, bonus: { athletic: 3, defense: 1 }, desc: '不容易累，訓練增加的疲勞會少 28%。' },
  { id: 'instinct', code: 'INSTINCT', name: '直覺型', base: 1, growth: 1.10, load: 1, bonus: { playmaking: 2, iq: 1 }, desc: '反應很快，關鍵時刻更敢做自己會的事。' }
];

const COUNTRIES = {
  TW: { name: '台灣', flag: 'TW', accent: '#dfff00', style: '跑得快，每個人都能做很多事', opponent: ['北岸聯隊', '南城雷雨', '港都礦工', '東海岸獵人'] },
  JP: { name: '日本', flag: 'JP', accent: '#ff6a72', style: '跑位整齊，傳球速度很快', opponent: ['千葉白浪', '名古屋軸心', '大阪電塔', '秋田雪線'] },
  KR: { name: '韓國', flag: 'KR', accent: '#78a7ff', style: '身體對抗強，戰術很清楚', opponent: ['水原火線', '釜山港灣', '大邱黑鷹', '首爾北門'] },
  CN: { name: '中國', flag: 'CN', accent: '#ff7057', style: '球員高大，禁區壓力很大', opponent: ['廣州赤潮', '北京穹頂', '成都遠山', '上海重工'] },
  US: { name: '美國', flag: 'US', accent: '#65d9ff', style: '速度超快，單打機會很多', opponent: ['Mesa Falcons', 'Pacific Union', 'Brooklyn Forge', 'Austin Comets'] }
};

const TEAMS = {
  tw_ms: { id: 'tw_ms', country: 'TW', name: '新北潮生國中', league: '國中籃球聯賽', level: 'middle', difficulty: 48, prestige: 1, salary: 0, color: '#dfff00' },
  tw_high: { id: 'tw_high', country: 'TW', name: '霧城高中', league: '高中菁英聯賽', level: 'high', difficulty: 58, prestige: 2, salary: 0, entry: 54, color: '#dfff00' },
  jp_high: { id: 'jp_high', country: 'JP', name: '北辰學園', league: '日本高校聯賽', level: 'high', difficulty: 63, prestige: 3, salary: 0, entry: 61, color: '#ff6a72' },
  kr_high: { id: 'kr_high', country: 'KR', name: '漢城高陽高校', league: '韓國高校聯賽', level: 'high', difficulty: 64, prestige: 3, salary: 0, entry: 62, color: '#78a7ff' },
  cn_youth: { id: 'cn_youth', country: 'CN', name: '海浦青年隊', league: '菁英青年聯賽', level: 'high', difficulty: 65, prestige: 3, salary: 6, entry: 63, color: '#ff7057' },
  us_prep: { id: 'us_prep', country: 'US', name: 'Red Canyon Prep', league: 'US Prep Circuit', level: 'high', difficulty: 69, prestige: 4, salary: 0, entry: 66, color: '#65d9ff' },
  tw_uni: { id: 'tw_uni', country: 'TW', name: '北嶼大學', league: '大專公開一級', level: 'development', difficulty: 66, prestige: 3, salary: 8, entry: 60, color: '#dfff00' },
  tw_rookie: { id: 'tw_rookie', country: 'TW', name: '台北夜航', league: '島嶼職業聯賽', level: 'development', difficulty: 72, prestige: 4, salary: 42, entry: 67, color: '#dfff00' },
  jp_uni: { id: 'jp_uni', country: 'JP', name: '湘南國際大學', league: '關東大學一部', level: 'development', difficulty: 70, prestige: 4, salary: 10, entry: 66, color: '#ff6a72' },
  kr_uni: { id: 'kr_uni', country: 'KR', name: '首爾東原大學', league: '韓國大學聯賽', level: 'development', difficulty: 71, prestige: 4, salary: 12, entry: 67, color: '#78a7ff' },
  cn_dev: { id: 'cn_dev', country: 'CN', name: '廣城體院', league: '全國大學聯賽', level: 'development', difficulty: 72, prestige: 4, salary: 16, entry: 68, color: '#ff7057' },
  us_juco: { id: 'us_juco', country: 'US', name: 'Lake Mesa College', league: 'US College Division II', level: 'development', difficulty: 73, prestige: 4, salary: 8, entry: 69, color: '#65d9ff' },
  us_ncaa: { id: 'us_ncaa', country: 'US', name: 'Pacific State', league: 'US College Division I', level: 'development', difficulty: 78, prestige: 6, salary: 18, entry: 75, color: '#65d9ff' },
  tw_pro: { id: 'tw_pro', country: 'TW', name: '基隆夜航', league: '島嶼職業聯賽', level: 'pro', difficulty: 77, prestige: 5, salary: 115, entry: 70, color: '#dfff00' },
  jp_pro: { id: 'jp_pro', country: 'JP', name: '東京流星', league: '日本一級聯賽', level: 'pro', difficulty: 82, prestige: 6, salary: 190, entry: 76, color: '#ff6a72' },
  kr_pro: { id: 'kr_pro', country: 'KR', name: '仁川鋼翼', league: '韓國職業聯賽', level: 'pro', difficulty: 83, prestige: 6, salary: 205, entry: 77, color: '#78a7ff' },
  cn_pro: { id: 'cn_pro', country: 'CN', name: '上海引擎', league: '中國頂級聯賽', level: 'pro', difficulty: 85, prestige: 7, salary: 280, entry: 80, color: '#ff7057' },
  us_g: { id: 'us_g', country: 'US', name: 'Austin Stampede', league: 'US Development League', level: 'pro', difficulty: 86, prestige: 7, salary: 250, entry: 81, color: '#65d9ff' },
  us_elite: { id: 'us_elite', country: 'US', name: 'Seattle Tempest', league: 'US Elite League', level: 'pro', difficulty: 93, prestige: 10, salary: 620, entry: 91, color: '#65d9ff' }
};

const SEASONS = [
  { age: 13, year: 2039, stage: '國中', name: '菜鳥季', target: '搶到第一次上場機會', pressure: 0 },
  { age: 14, year: 2040, stage: '國中', name: '主力競爭', target: '成為先發球員', pressure: 1 },
  { age: 15, year: 2041, stage: '國中', name: '全國國中盃', target: '拿到第一份跨國邀請', pressure: 3 },
  { age: 16, year: 2042, stage: '高中', name: '新環境', target: '快點適應新球隊', pressure: 4 },
  { age: 17, year: 2043, stage: '高中', name: '先發之爭', target: '搶下固定先發位置', pressure: 5 },
  { age: 18, year: 2044, stage: '高中', name: '畢業賽季', target: '讓國外球探記住你', pressure: 7 },
  { age: 19, year: 2045, stage: '養成', name: '大人賽場', target: '跟上更高、更快的對手', pressure: 7 },
  { age: 21, year: 2047, stage: '養成', name: '關鍵一年', target: '拿到職業合約', pressure: 9 },
  { age: 23, year: 2049, stage: '職業', name: '職業新秀', target: '證明你值得這份合約', pressure: 10 },
  { age: 26, year: 2052, stage: '職業', name: '巔峰時期', target: '帶隊打進季後賽', pressure: 12 },
  { age: 30, year: 2056, stage: '職業', name: '爭冠時刻', target: '拼下一座冠軍', pressure: 14 },
  { age: 34, year: 2060, stage: '傳奇', name: '最後一舞', target: '打出你的最後代表作', pressure: 16 }
];

const BADGES = {
  attack: { label: '破框者', stat: 'finish', desc: '攻框選項脈衝 +3' },
  shooter: { label: '深距威脅', stat: 'shooting', desc: '投射選項脈衝 +3' },
  creator: { label: '傳球高手', stat: 'playmaking', desc: '組織選項脈衝 +3' },
  stopper: { label: '防守大鎖', stat: 'defense', desc: '防守選項脈衝 +3' },
  iron: { label: '體能怪物', stat: 'athletic', desc: '體能選項脈衝 +3' },
  connector: { label: '團隊玩家', stat: 'iq', desc: '團隊選項脈衝 +3' }
};

const TACTICS = {
  pace: { code: 'PACE', title: '搶到球就快攻', desc: '趁防守還沒站好，直接往前衝。', primary: 'playmaking', secondary: 'athletic', tag: 'creator', deltas: { rhythm: 7, load: 6, trust: 1 }, success: '你衝得超快，再把球傳給空檔隊友。球進，這波很順！', failure: '你衝太快，隊友還沒跟上。快攻卡住了。' },
  pullup: { code: 'PULL', title: '有空檔就直接投', desc: '防守退了半步，現在就出手。', primary: 'shooting', secondary: 'iq', tag: 'shooter', deltas: { rhythm: 5, load: 4 }, success: '你一停、一跳，球空心進網。乾淨！', failure: '對手撞了你一下，球短了一點。' },
  drive: { code: 'RIM', title: '直接殺進禁區', desc: '不怕碰撞，往籃框衝。', primary: 'finish', secondary: 'athletic', tag: 'attack', deltas: { rhythm: 6, load: 8 }, success: '你扛住碰撞把球放進，還拿到加罰！', failure: '協防來得很快，你的上籃被干擾了。' },
  create: { code: 'READ', title: '吸引包夾再傳球', desc: '先把兩個防守者吸過來，再找空檔隊友。', primary: 'playmaking', secondary: 'iq', tag: 'creator', deltas: { trust: 7, rhythm: 2 }, success: '兩個人都來守你，隊友完全空了。助攻到手！', failure: '你看到空檔，但隊友還沒準備好，球傳出界。' },
  lock: { code: 'LOCK', title: '我要守住最後一球', desc: '緊貼對方主將，不讓他舒服出手。', primary: 'defense', secondary: 'athletic', tag: 'stopper', deltas: { trust: 5, load: 6 }, success: '你一路黏住他，時間到！他連球都沒投出去。', failure: '對手用身體頂開空間，成功出手。' },
  glass: { code: 'GLASS', title: '先把籃板抓下來', desc: '卡好位置，不給對手第二次進攻。', primary: 'athletic', secondary: 'defense', tag: 'iron', deltas: { trust: 5, load: 7 }, success: '你先卡位，再把籃板抱緊。這回合結束！', failure: '你卡住一個人，但另一個人衝進來搶走籃板。' },
  screen: { code: 'LINK', title: '幫隊友做一個好掩護', desc: '站好角度，讓持球隊友甩開防守。', primary: 'iq', secondary: 'athletic', tag: 'connector', deltas: { trust: 7, load: 4 }, success: '掩護成功，你接到回傳，再助攻隊友得分。', failure: '角度沒站好，防守直接繞了過去。' },
  post: { code: 'POST', title: '背框單打', desc: '用身體卡住對手，轉身打板。', primary: 'finish', secondary: 'iq', tag: 'attack', deltas: { rhythm: 4, load: 7 }, success: '你頂出空間，轉身擦板得分。穩！', failure: '協防太快，你一收球就被切掉。' }
};

let state = null;
let selectedPosition = 'PG';
let toastTimer = null;

const $ = (selector) => document.querySelector(selector);
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const statTier = (value) => STAT_TIERS.find((tier) => value >= tier.min) || STAT_TIERS.at(-1);
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

function hashSeed(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeSeedRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function randomIndex(length) {
  if (globalThis.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    globalThis.crypto.getRandomValues(value);
    return value[0] % length;
  }
  return Math.floor(Math.random() * length);
}

function generateSeedCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const chars = Array.from({ length: 8 }, () => alphabet[randomIndex(alphabet.length)]).join('');
  return `CB-${chars.slice(0, 4)}-${chars.slice(4)}`;
}

function normalizeSeedCode(value) {
  let compact = String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (compact.startsWith('CB')) compact = compact.slice(2);
  compact = compact.slice(0, 8);
  if (!compact) return '';
  return `CB-${compact.slice(0, 4)}${compact.length > 4 ? `-${compact.slice(4)}` : ''}`;
}

function buildSeedProfile(seedCode) {
  const code = normalizeSeedCode(seedCode) || generateSeedCode();
  const hash = hashSeed(code);
  const random = makeSeedRandom(hash);
  const trait = SEED_TRAITS[Math.floor(random() * SEED_TRAITS.length)];
  const specialties = Object.keys(STAT_META);
  for (let index = specialties.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [specialties[index], specialties[swapIndex]] = [specialties[swapIndex], specialties[index]];
  }
  const variance = Object.fromEntries(Object.keys(STAT_META).map((key) => [key, Math.floor(random() * 5) - 2]));
  return { code, hash, trait, specialties: specialties.slice(0, 2), variance };
}

function statsForProfile(profile, seedProfile = buildSeedProfile(profile.seed)) {
  const stats = statTemplate(49 + seedProfile.trait.base);
  addMap(stats, seedProfile.variance);
  addMap(stats, seedProfile.trait.bonus);
  addMap(stats, { [seedProfile.specialties[0]]: 5, [seedProfile.specialties[1]]: 2 });
  addMap(stats, POSITIONS[profile.position].bonus);
  addMap(stats, STYLES[profile.style]?.bonus || {});
  Object.keys(stats).forEach((key) => { stats[key] = clamp(stats[key], 35, 72); });
  return stats;
}

function renderSeedPreview() {
  const input = $('#career-seed');
  const preview = $('#seed-preview');
  if (!input || !preview) return;
  if (!input.value) {
    preview.innerHTML = '<strong>?</strong><span><b>等待開獎</b><small>輸入種子碼，或按「重抽」交給命運決定。</small></span><em>能力保密</em>';
    return;
  }
  preview.innerHTML = `
    <strong>?</strong>
    <span><b>命運已鎖定</b><small>初始能力、隱藏專長與成長速度都不公開，進場後自己感受。</small></span>
    <em>開獎中</em>`;
}

function randomizeName() {
  const input = $('#player-name');
  let nextName = input.value;
  while (PLAYER_NAMES.length > 1 && nextName === input.value) nextName = PLAYER_NAMES[randomIndex(PLAYER_NAMES.length)];
  input.value = nextName;
}

function prepareNewProfile(randomName = false) {
  if (randomName) randomizeName();
  $('#career-seed').value = generateSeedCode();
  renderSeedPreview();
}

function statTemplate(value = 49) {
  return { finish: value, shooting: value, playmaking: value, defense: value, athletic: value, iq: value };
}

function addMap(target, additions = {}) {
  Object.entries(additions).forEach(([key, amount]) => {
    target[key] = (target[key] || 0) + amount;
  });
}

function overall(playerState = state) {
  const values = Object.values(playerState.stats);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function currentSeason() {
  return SEASONS[state.seasonIndex];
}

function currentTeam() {
  return TEAMS[state.teamId] || TEAMS.tw_ms;
}

function seededValue() {
  state.rng = (state.rng * 1664525 + 1013904223) >>> 0;
  return state.rng / 4294967296;
}

function randomBetween(min, max) {
  return min + seededValue() * (max - min);
}

function pick(list) {
  return list[Math.floor(seededValue() * list.length) % list.length];
}

function createState(profile) {
  const seedProfile = buildSeedProfile(profile.seed);
  const fullProfile = {
    ...profile,
    seed: seedProfile.code,
    seedTrait: seedProfile.trait.id,
    seedTraitName: seedProfile.trait.name,
    seedSpecialties: seedProfile.specialties,
    growthModifier: seedProfile.trait.growth,
    loadModifier: seedProfile.trait.load
  };
  const stats = statsForProfile(fullProfile, seedProfile);
  return {
    version: 1,
    profile: fullProfile,
    stats,
    seasonIndex: 0,
    week: 0,
    teamId: 'tw_ms',
    rhythm: clamp(48 + (STYLES[profile.style]?.pulse.rhythm || 0)),
    trust: clamp(22 + (STYLES[profile.style]?.pulse.trust || 0)),
    load: 10,
    reputation: 0,
    scout: 4,
    income: 0,
    wins: 0,
    losses: 0,
    trophies: 0,
    careerPoints: 0,
    choices: { attack: 0, shooter: 0, creator: 0, stopper: 0, iron: 0, connector: 0 },
    badges: [],
    visited: ['TW'],
    history: [],
    seasonMargins: [],
    seasonSuccesses: 0,
    pendingResult: null,
    mode: 'event',
    rng: seedProfile.hash,
    createdAt: new Date().toISOString()
  };
}

function saveGame() {
  if (!state) return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!parsed || parsed.version !== 1 || !parsed.profile || !parsed.stats) return null;
    return parsed;
  } catch (_error) {
    return null;
  }
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function renderInterfaceSettings(mode) {
  document.querySelectorAll('[data-interface-mode]').forEach((button) => {
    const active = button.dataset.interfaceMode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const status = $('#interface-status');
  if (status) status.textContent = `目前使用：${mode === 'mobile' ? '手機版介面' : '電腦版介面'}`;
}

function applyInterfaceMode(mode, notify = false) {
  const selectedMode = mode === 'mobile' ? 'mobile' : 'desktop';
  document.body.classList.toggle('interface-mobile', selectedMode === 'mobile');
  document.body.classList.toggle('interface-desktop', selectedMode === 'desktop');
  localStorage.setItem(UI_MODE_KEY, selectedMode);
  renderInterfaceSettings(selectedMode);
  if (notify) showToast(`已切換為${selectedMode === 'mobile' ? '手機版' : '電腦版'}介面`);
}

function initialInterfaceMode() {
  const savedMode = localStorage.getItem(UI_MODE_KEY);
  if (savedMode === 'desktop' || savedMode === 'mobile') return savedMode;
  return window.matchMedia('(max-width: 760px)').matches ? 'mobile' : 'desktop';
}

function openSettings() {
  renderInterfaceSettings(document.body.classList.contains('interface-mobile') ? 'mobile' : 'desktop');
  $('#settings-dialog').showModal();
}

function renderSetupOptions() {
  $('#position-grid').innerHTML = Object.entries(POSITIONS).map(([key, item]) => `
    <button type="button" data-position="${key}" class="${key === selectedPosition ? 'selected' : ''}">
      <small>${key}</small><b>${item.name}</b><span>${item.desc}</span>
    </button>`).join('');
  document.querySelectorAll('[data-position]').forEach((button) => button.addEventListener('click', () => {
    selectedPosition = button.dataset.position;
    renderSetupOptions();
  }));
  if ($('#career-seed')?.value) renderSeedPreview();
}

function stageProgress() {
  const stages = ['國中', '高中', '養成', '職業', '傳奇'];
  const active = stages.indexOf(currentSeason().stage);
  $('#season-track').innerHTML = stages.map((stage, index) => `${index ? '<i></i>' : ''}<span class="${index === active ? 'active' : index < active ? 'done' : ''}">${stage}</span>`).join('');
}

function badgeBonus(tag, source = state) {
  return source.badges.includes(tag) ? 3 : 0;
}

function unlockedBadges() {
  const newBadges = [];
  Object.entries(state.choices).forEach(([tag, count]) => {
    if (count >= 3 && !state.badges.includes(tag)) {
      state.badges.push(tag);
      newBadges.push(BADGES[tag].label);
    }
  });
  return newBadges;
}

function renderPlayerPanel() {
  const season = currentSeason();
  const team = currentTeam();
  const ovr = overall();
  const badge = state.badges.length ? BADGES[state.badges[state.badges.length - 1]].label : '尚未形成打法';
  $('#player-panel').innerHTML = `
    <div class="eyebrow">PLAYER FILE / ${state.profile.seed || String(state.seasonIndex + 1).padStart(4, '0')}</div>
    <div class="player-card">
      <div class="jersey" style="--team:${team.color}">${POSITIONS[state.profile.position].number}</div>
      <div><h2>${escapeHtml(state.profile.name)}</h2><p>${COUNTRIES[team.country].name} · ${season.age} 歲 · ${state.profile.position}</p><small>${badge}</small></div>
    </div>
    <div class="rating-block"><span>綜合評分</span><strong>${ovr}</strong><small>OVR</small></div>
    <div class="stat-list">
      ${Object.entries(STAT_META).map(([key, meta]) => {
        const tier = statTier(state.stats[key]);
        const gain = state.pendingResult?.growth?.gains?.[key] || 0;
        return `<div class="stat-row ${gain ? 'stat-grew' : ''}"><i>${meta.icon}</i><span>${meta.label}<small>${meta.code} · ${tier.label}</small></span><b>${Math.round(state.stats[key])}</b>${gain ? `<ins>+${gain.toFixed(1)}</ins>` : ''}<em style="--fill:${state.stats[key]}%"></em></div>`;
      }).join('')}
    </div>
    <div class="pulse-meters">
      ${resourceMeter('近期節奏', state.rhythm, 'rhythm')}
      ${resourceMeter('教練信任', state.trust, 'trust')}
      ${resourceMeter('身體負荷', state.load, 'load')}
    </div>
    <div class="identity-strip"><small>MYSTERY SEED · ${state.profile.seed}</small><b>${badge}</b></div>`;
  $('#mobile-hud').innerHTML = `<span><small>${escapeHtml(state.profile.name)}</small><b>${ovr} OVR</b></span><span><small>${season.age} 歲</small><b>${COUNTRIES[team.country].flag} · ${team.name}</b></span><span><small>脈衝</small><b>${Math.round(state.rhythm)} / ${Math.round(state.trust)} / ${Math.round(state.load)}</b></span>`;
}

function resourceMeter(label, value, type) {
  const displayValue = Math.round(value);
  const danger = type === 'load' && value >= 70;
  return `<div class="meter ${danger ? 'danger' : ''}"><span>${label}<b>${displayValue}%</b></span><i style="--fill:${displayValue}%"></i></div>`;
}

function renderWorldPanel() {
  const team = currentTeam();
  const season = currentSeason();
  $('#world-panel').innerHTML = `
    <div class="eyebrow">WORLD BOARD / ${season.year}</div>
    <div class="world-title"><div><h2>五國生涯版圖</h2><p>${team.league}</p></div><span>${COUNTRIES[team.country].flag}</span></div>
    <div class="route-list">
      ${Object.entries(COUNTRIES).map(([key, country]) => {
        const visited = state.visited.includes(key);
        const active = team.country === key;
        return `<div class="${active ? 'open active-country' : visited ? 'open' : ''}"><i style="--country:${country.accent}">${country.flag}</i><span><b>${country.name}</b><small>${country.style}</small></span><em>${active ? '目前' : visited ? '到訪' : '球探鎖定'}</em></div>`;
      }).join('')}
    </div>
    <div class="market-score">
      <div><span>球探值</span><b>${Math.round(state.scout)}</b></div>
      <div><span>聲望</span><b>${Math.round(state.reputation)}</b></div>
      <div><span>收入</span><b>${Math.round(state.income)}<small>萬</small></b></div>
    </div>
    <div class="goal-card"><small>SEASON TARGET</small><b>${season.target}</b><p>${team.name} · ${season.name}</p></div>
    <div class="career-feed"><small>CAREER LOG</small>${state.history.slice(-3).reverse().map((item) => `<p><b>${item.year}</b><span>${COUNTRIES[item.country].flag} ${item.team}</span><em>${item.record}</em></p>`).join('') || '<p class="empty">第一筆紀錄會在賽季結束後出現。</p>'}</div>`;
}

function countryTrainingCopy(country) {
  return {
    TW: ['放學後再練一下', '大家都走了，你還留在球館。學長把球丟給你：「想上場，就把最弱的地方練好。」'],
    JP: ['早上六點四十分集合', '天還沒亮，全隊已經開始跑動。助教指著訓練表，要你選一項今天最想加強的能力。'],
    KR: ['晚餐後看比賽影片', '教練剪出你上一場的失誤。時間只有四十分鐘，你要先找出最重要的問題。'],
    CN: ['二十二人搶十二個位置', '青年隊有二十二人，但正式名單只有十二格。今天怎麼練，可能會決定你能不能留下。'],
    US: ['三組球探都在看', '球館裡有三組球探，每個人都想秀出最強的一招。輪到你了，你要先練什麼？']
  }[country];
}

function buildEvent() {
  const season = currentSeason();
  const team = currentTeam();
  const country = COUNTRIES[team.country];
  if (state.week === 0) {
    const copy = countryTrainingCopy(team.country);
    return {
      kicker: `WEEK 01 · ${country.flag} / DEVELOPMENT`, title: copy[0], story: copy[1], quote: '每天進步一點，久了就真的會變強。', value: '01', valueLabel: 'TRAINING', tint: team.color,
      actions: [
        { code: 'A', title: '狂練最弱的那一招', desc: '挑目前最低的能力，專心練到動作變順。', primary: weakestStat(), secondary: 'iq', tag: statTag(weakestStat()), difficulty: team.difficulty - 8, growth: 2.2, deltas: { load: 9, rhythm: 4 }, success: '最後十次都做對了。這個動作開始變成你的肌肉記憶。', failure: '你太累，動作開始跑掉。先停一下，明天再練會更有效。' },
        { code: 'B', title: '看影片研究對手', desc: '找出對手最常做的動作，先想好怎麼守。', primary: 'iq', secondary: 'playmaking', tag: 'creator', difficulty: team.difficulty - 10, growth: 1.8, deltas: { trust: 4, load: 2 }, success: '你發現對手每次都會先往右晃。下一場，你知道怎麼守了。', failure: '影片看太多，重點反而亂掉。你決定只記住最重要的一件事。' },
        { code: 'C', title: '練力量和體能', desc: '跟著教練做重訓，也練習安全落地。', primary: 'athletic', secondary: 'defense', tag: 'iron', difficulty: team.difficulty - 7, growth: 2, deltas: { load: 11, rhythm: -1 }, success: '最後一組還是很穩。你的身體越來越能扛住碰撞。', failure: '身體真的累了。你少做一組，避免受傷才是正解。' }
      ]
    };
  }
  if (state.week === 1) {
    return {
      kicker: `WEEK 02 · ${country.flag} / TEAM`, title: season.age < 19 ? '明天誰能上場？' : '球隊和合約，先選哪邊？',
      story: season.age < 19 ? '明天的出賽名單還沒公布。你要替自己加練，還是先幫球隊把戰術弄懂？' : '經紀人叫你去測試，隊友也找你一起加練。兩邊都很重要，你只能先選一個。',
      quote: '失誤沒關係。隊友在意的是，你下一球還敢不敢一起打。', value: '02', valueLabel: 'LOCKER ROOM', tint: '#dfff00',
      actions: [
        { code: 'A', title: '陪隊友把戰術練熟', desc: '留下來幫替補隊友，讓大家都知道該怎麼跑。', primary: 'playmaking', secondary: 'iq', tag: 'connector', difficulty: team.difficulty - 7, growth: 1.4, deltas: { trust: 10, load: 4, reputation: -1 }, success: '大家終於跑對位置。明天不管誰上場，球隊都更有默契。', failure: '大家都很累，戰術還是有點亂。但隊友知道你沒有先跑掉。' },
        { code: 'B', title: '去參加球探測試', desc: '秀出你最強的能力，讓更多球隊看到你。', primary: strongestStat(), secondary: 'athletic', tag: statTag(strongestStat()), difficulty: team.difficulty - 3, growth: 1.2, deltas: { scout: 9, reputation: 4, load: 6, trust: -2 }, success: '你的測試數字很亮眼。球探真的把你的名字記下來了。', failure: '今天沒有打出最好表現，但球探看到你失誤後有馬上調整。' },
        { code: 'C', title: '今天先好好休息', desc: '放下手機，讓身體和腦袋都充滿電。', primary: 'athletic', secondary: 'iq', tag: 'iron', difficulty: team.difficulty - 13, growth: .8, deltas: { load: -22, rhythm: -3, trust: 1 }, success: '你睡飽了，隔天整個人都輕很多。休息也是訓練的一部分。', failure: '你還是有點緊張，但身體沒那麼累了。先穩住就好。' }
      ]
    };
  }
  const opponent = country.opponent[(state.seasonIndex + state.profile.name.length + team.name.length) % country.opponent.length];
  return {
    kicker: `WEEK 03 · ${team.league.toUpperCase()}`, title: `${season.name} · 最後一球`, story: `對上「${opponent}」，只剩 31.8 秒，比分超接近。教練把戰術板交給你：「最後一球，你來決定。」`, quote: '球探提醒：對手猜你會往左切。', value: '31.8', valueLabel: 'SECONDS', tint: '#ff5a1f', game: true, actions: gameActions()
  };
}

function weakestStat() {
  return Object.keys(state.stats).sort((a, b) => state.stats[a] - state.stats[b])[0];
}

function strongestStat() {
  return Object.keys(state.stats).sort((a, b) => state.stats[b] - state.stats[a])[0];
}

function statTag(stat) {
  return ({ finish: 'attack', shooting: 'shooter', playmaking: 'creator', defense: 'stopper', athletic: 'iron', iq: 'connector' })[stat];
}

function gameActions() {
  const maps = {
    PG: ['pace', 'pullup', 'create'], SG: ['pullup', 'drive', 'lock'], SF: ['drive', 'lock', 'create'], PF: ['screen', 'glass', 'pullup'], C: ['post', 'glass', 'screen']
  };
  const keys = [...maps[state.profile.position]];
  const season = currentSeason();
  const team = currentTeam();
  return keys.map((key, index) => ({ ...TACTICS[key], difficulty: team.difficulty + season.pressure + index - (state.seasonIndex < 3 ? 3 : 0), growth: 1.2, game: true }));
}

function renderArena() {
  const event = buildEvent();
  const season = currentSeason();
  const team = currentTeam();
  $('#arena-head').innerHTML = `<div><span>${season.year} / ${COUNTRIES[team.country].flag} · ${team.league}</span><h1>${event.title}</h1></div><div class="week-chip">AGE <b>${season.age}</b><small>${season.name}</small></div>`;
  $('#court-scene').style.setProperty('--court-tint', event.tint);
  $('#scene-copy').innerHTML = `<small>${event.kicker}</small><p>${event.story}</p><blockquote>${event.quote}</blockquote>`;
  $('#scoreboard').innerHTML = `<span>${event.valueLabel}</span><b>${event.value}</b><small>${event.game ? 'CLUTCH' : `WEEK ${state.week + 1}`}</small>`;
  if (state.mode === 'summary') renderSummary();
  else if (state.pendingResult) renderResult();
  else renderDecisions(event);
}

function renderDecisions(event) {
  $('#decision-zone').innerHTML = `
    <div class="decision-head"><div><small>${event.game ? 'POSSESSION DECISION' : 'CAREER DECISION'} · PULSE ENGINE</small><h2>${event.game ? '最後一球，你要怎麼打？' : '這週要練什麼？'}</h2></div><p>看能力、手感、隊友信任和疲勞，再做選擇。</p></div>
    <div class="option-grid">
      ${event.actions.map((action, index) => {
        const forecast = estimateActionChance(action);
        const tierBonus = forecast.tier.bonus ? ` · ${forecast.tier.label} +${forecast.tier.bonus}` : '';
        return `<button type="button" data-action="${index}"><em>${action.code || String(index + 1).padStart(2, '0')}</em><b>${action.title}</b><span>${action.desc}</span><small><strong>${chanceLabel(forecast.chance)} · ${forecast.chance}%</strong>${STAT_META[action.primary].label} ＋ ${STAT_META[action.secondary].label}<i>${formatDeltas(action.deltas)}${tierBonus}</i></small></button>`;
      }).join('')}
    </div>`;
  document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => resolveAction(event.actions[Number(button.dataset.action)])));
}

function formatDeltas(deltas = {}) {
  const labels = { rhythm: '節奏', trust: '信任', load: '負荷', scout: '球探', reputation: '聲望' };
  return Object.entries(deltas).map(([key, value]) => `${labels[key] || key} ${value > 0 ? '+' : ''}${value}`).join(' · ');
}

function pulseBase(action, source = state) {
  const primary = source.stats[action.primary];
  const secondary = source.stats[action.secondary];
  const skill = primary * .62 + secondary * .22 + source.stats.iq * .08;
  const rhythm = (source.rhythm - 50) * .11;
  const trust = (source.trust - 50) * .07;
  const load = -Math.max(0, source.load - 28) * .10;
  const identity = badgeBonus(action.tag, source);
  const seedSpecialty = source.profile.seedSpecialties?.includes(action.primary) ? 1.5 : 0;
  const mastery = statTier(primary).bonus;
  const difficulty = clamp(action.difficulty, 36, 96);
  const baseTotal = skill + rhythm + trust + load + identity + seedSpecialty + mastery;
  return { primary, secondary, skill, rhythm, trust, load, identity, seedSpecialty, mastery, baseTotal, difficulty };
}

function pulseCalculation(action) {
  const base = pulseBase(action);
  const variation = randomBetween(-5.5, 5.5);
  const total = base.baseTotal + variation;
  return { ...base, variation, total, margin: total - base.difficulty };
}

function estimateActionChance(action, source = state) {
  const base = pulseBase(action, source);
  const chance = Math.round(clamp(((base.baseTotal - base.difficulty + 5.5) / 11) * 100, 5, 95));
  return { chance, tier: statTier(base.primary) };
}

function chanceLabel(chance) {
  if (chance >= 70) return '很有把握';
  if (chance >= 45) return '有機會';
  return '高難度';
}

function applyDeltas(deltas = {}) {
  Object.entries(deltas).forEach(([key, amount]) => {
    const adjustedAmount = key === 'load' && amount > 0 ? amount * (state.profile.loadModifier || 1) : amount;
    if (key === 'load' || key === 'rhythm' || key === 'trust') state[key] = clamp(state[key] + adjustedAmount);
    else state[key] = Math.max(0, (state[key] || 0) + amount);
  });
}

function resolveAction(action) {
  if (state.pendingResult) return;
  const beforeSource = { ...state, stats: { ...state.stats }, badges: [...state.badges] };
  const primaryBefore = state.stats[action.primary];
  const secondaryBefore = state.stats[action.secondary];
  const chanceBefore = estimateActionChance(action, beforeSource).chance;
  const calc = pulseCalculation(action);
  const success = calc.margin >= 0;
  applyDeltas(action.deltas);
  const specialtyGrowth = state.profile.seedSpecialties?.includes(action.primary) ? 1.08 : 1;
  const growth = action.growth * 1.35 * (state.profile.growthModifier || 1) * specialtyGrowth * (success ? 1 : .7);
  state.stats[action.primary] = clamp(state.stats[action.primary] + growth, 0, 99);
  state.stats[action.secondary] = clamp(state.stats[action.secondary] + growth * .42, 0, 99);
  const primaryAfter = state.stats[action.primary];
  const secondaryAfter = state.stats[action.secondary];
  const afterStatsSource = { ...beforeSource, stats: { ...state.stats } };
  const chanceAfter = estimateActionChance(action, afterStatsSource).chance;
  const tierBefore = statTier(primaryBefore);
  const tierAfter = statTier(primaryAfter);
  const tierUp = tierAfter.min > tierBefore.min ? { stat: action.primary, label: tierAfter.label, bonus: tierAfter.bonus } : null;
  state.rhythm = clamp(state.rhythm + (success ? 3 : -4));
  state.trust = clamp(state.trust + (success && action.game ? 4 : action.game ? -2 : 0));
  state.choices[action.tag] = (state.choices[action.tag] || 0) + 1;
  state.seasonMargins.push(calc.margin);
  if (success) state.seasonSuccesses += 1;
  if (action.game) {
    if (success) { state.wins += 1; state.reputation += 3; state.scout += 4; state.careerPoints += Math.round(12 + calc.margin / 3); }
    else { state.losses += 1; state.careerPoints += Math.max(4, Math.round(8 + calc.margin / 5)); }
  }
  const badges = unlockedBadges();
  const gains = {
    [action.primary]: primaryAfter - primaryBefore,
    [action.secondary]: action.primary === action.secondary ? primaryAfter - primaryBefore : secondaryAfter - secondaryBefore
  };
  state.pendingResult = {
    action, calc, success, badges, game: Boolean(action.game),
    growth: { primaryBefore, primaryAfter, secondaryBefore, secondaryAfter, chanceBefore, chanceAfter, tierUp, gains }
  };
  saveGame();
  renderAll();
}

function renderResult() {
  const result = state.pendingResult;
  const margin = result.calc.margin;
  const action = result.action;
  $('#decision-zone').innerHTML = `
    <div class="result-zone ${result.success ? 'success' : 'failure'}">
      <div class="pulse-gauge">
        <small>PULSE TRACE</small><strong>${Math.round(result.calc.total)}</strong><span>門檻 ${Math.round(result.calc.difficulty)}</span>
        <i><b style="--score:${clamp(result.calc.total)}%"></b><em style="--gate:${clamp(result.calc.difficulty)}%"></em></i>
      </div>
      <div class="result-copy">
        <small>${result.success ? 'READ COMPLETE' : 'READ BROKEN'} · ${margin >= 0 ? '+' : ''}${margin.toFixed(1)}</small>
        <h2>${result.success ? '成功！這波有料。' : '沒成功，再調整就好。'}</h2>
        <p>${result.success ? action.success : action.failure}</p>
        <div class="formula-strip"><span>技術 <b>${result.calc.skill.toFixed(1)}</b></span><span>節奏 <b>${signed(result.calc.rhythm)}</b></span><span>信任 <b>${signed(result.calc.trust)}</b></span><span>負荷 <b>${signed(result.calc.load)}</b></span><span>打法 <b>+${result.calc.identity}</b></span>${result.calc.mastery ? `<span>能力階級 <b>+${result.calc.mastery}</b></span>` : ''}${result.calc.seedSpecialty ? '<span>神秘種子 <b>?</b></span>' : ''}<span>臨場 <b>${signed(result.calc.variation)}</b></span></div>
        ${result.growth ? `<div class="growth-feedback"><small>這次真的變強了</small><div><span><b>${STAT_META[action.primary].label}</b><em>${result.growth.primaryBefore.toFixed(1)} → ${result.growth.primaryAfter.toFixed(1)}</em></span>${action.secondary !== action.primary ? `<span><b>${STAT_META[action.secondary].label}</b><em>${result.growth.secondaryBefore.toFixed(1)} → ${result.growth.secondaryAfter.toFixed(1)}</em></span>` : ''}<span><b>同類選擇</b><em>${result.growth.chanceBefore}% → ${result.growth.chanceAfter}%</em></span></div></div>` : ''}
        ${result.growth?.tierUp ? `<div class="mastery-unlock">能力突破：<b>${STAT_META[result.growth.tierUp.stat].label} · ${result.growth.tierUp.label}</b>，之後同類選擇永久 +${result.growth.tierUp.bonus}</div>` : ''}
        ${result.badges.length ? `<div class="badge-unlock">打法印記解鎖：<b>${result.badges.join('、')}</b></div>` : ''}
        <button type="button" class="next-button" id="next-button">${state.week === 2 ? '結算本季' : '進入下一週'} <b>→</b></button>
      </div>
    </div>`;
  $('#next-button').addEventListener('click', advanceAfterResult);
}

function signed(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}`;
}

function advanceAfterResult() {
  state.pendingResult = null;
  if (state.week < 2) {
    state.week += 1;
    state.load = clamp(state.load - 3);
    state.mode = 'event';
  } else {
    finishSeason();
  }
  saveGame();
  renderAll();
}

function finishSeason() {
  const season = currentSeason();
  const team = currentTeam();
  const averageMargin = state.seasonMargins.reduce((sum, value) => sum + value, 0) / Math.max(1, state.seasonMargins.length);
  const winRate = clamp(.42 + averageMargin / 55 + state.trust / 500, .18, .88);
  const games = season.age < 19 ? 14 : 24;
  const wins = Math.round(games * winRate);
  const losses = games - wins;
  const role = clamp((overall() - team.difficulty + 18) / 32, .2, 1);
  const ppg = (2 + state.stats.finish * .13 + state.stats.shooting * .14 + role * 4 + randomBetween(-1, 1)).toFixed(1);
  const rpg = (.5 + (state.stats.athletic + state.stats.defense) * .055 + (['PF', 'C'].includes(state.profile.position) ? 2.2 : 0)).toFixed(1);
  const apg = (.5 + (state.stats.playmaking + state.stats.iq) * .05 + (state.profile.position === 'PG' ? 2.2 : 0)).toFixed(1);
  const champion = winRate > .72 && state.seasonSuccesses >= 2;
  if (champion) state.trophies += 1;
  state.reputation += Math.round(team.prestige * 2 + winRate * 6 + (champion ? 8 : 0));
  state.scout += Math.round(team.prestige * 2 + Math.max(0, averageMargin / 3));
  state.income += team.salary;
  state.load = clamp(state.load - 18);
  const summary = {
    year: season.year, age: season.age, stage: season.stage, teamId: team.id, country: team.country, team: team.name, league: team.league,
    record: `${wins}–${losses}`, wins, losses, ppg, rpg, apg, champion, ovr: overall(), averageMargin
  };
  state.history.push(summary);
  state.summary = summary;
  state.mode = 'summary';
}

function renderSummary() {
  const summary = state.summary;
  $('#decision-zone').innerHTML = `
    <div class="summary-zone">
      <div class="summary-mark ${summary.champion ? 'champion' : ''}"><small>${summary.champion ? 'CHAMPION' : 'SEASON COMPLETE'}</small><b>${summary.record}</b><span>${summary.league}</span></div>
      <div class="summary-copy"><small>${summary.year} · AGE ${summary.age}</small><h2>${summary.champion ? '冠軍拿到了！這季真的頂。' : '球季結束，來看看你打得怎麼樣。'}</h2>
        <div class="box-score"><span><b>${summary.ppg}</b> PTS</span><span><b>${summary.rpg}</b> REB</span><span><b>${summary.apg}</b> AST</span><span><b>${summary.ovr}</b> OVR</span></div>
        <p>${seasonSummaryLine(summary)}</p>
        <button type="button" class="next-button" id="market-button">${state.seasonIndex === SEASONS.length - 1 ? '完成生涯' : '查看下一站邀請'} <b>→</b></button>
      </div>
    </div>`;
  $('#market-button').addEventListener('click', () => {
    if (state.seasonIndex === SEASONS.length - 1) showEnding();
    else showOffers();
  });
}

function seasonSummaryLine(summary) {
  if (summary.champion) return '你拿到冠軍，更多國家的球隊開始注意你。下一份邀請會更好。';
  if (summary.averageMargin > 3) return '你在關鍵時刻很穩，已經有國外球探來看你。';
  if (summary.averageMargin > -4) return '這季沒有大爆發，但你一直有進步。換個環境也許更適合你。';
  return '這季有點卡，但你已經知道要練什麼。下季再來！';
}

function marketScore() {
  return overall() + state.scout * .14 + state.reputation * .06 + state.trophies * 1.5;
}

function offerPool(nextAge) {
  if (nextAge <= 15) return ['tw_ms'];
  if (nextAge <= 18) return ['tw_high', 'jp_high', 'kr_high', 'cn_youth', 'us_prep'];
  if (nextAge <= 22) return ['tw_uni', 'tw_rookie', 'jp_uni', 'kr_uni', 'cn_dev', 'us_juco', 'us_ncaa'];
  return ['tw_pro', 'jp_pro', 'kr_pro', 'cn_pro', 'us_g', 'us_elite'];
}

function generateOffers() {
  const nextAge = SEASONS[state.seasonIndex + 1].age;
  const pool = offerPool(nextAge).map((id) => TEAMS[id]);
  const score = marketScore();
  const current = currentTeam();
  const sorted = [...pool].sort((a, b) => {
    const aAffinity = a.country === current.country ? 4 : 0;
    const bAffinity = b.country === current.country ? 4 : 0;
    return Math.abs((a.entry || 0) - score) - aAffinity - (Math.abs((b.entry || 0) - score) - bAffinity);
  });
  const selected = [];
  const local = pool.find((team) => team.country === 'TW' && score >= team.entry - 5) || pool[0];
  selected.push(local);
  sorted.forEach((team) => { if (selected.length < 5 && !selected.includes(team)) selected.push(team); });
  return selected;
}

function showOffers() {
  const offers = generateOffers();
  const score = marketScore();
  const nextSeason = SEASONS[state.seasonIndex + 1];
  $('#offer-count').textContent = `${offers.filter((team) => score >= team.entry).length} OPEN / ${offers.length}`;
  $('#offer-title').textContent = nextSeason.age >= 23 ? '職業球隊來找你了' : '下一站要去哪？';
  $('#offer-lead').textContent = `市場評級 ${score.toFixed(1)}。球隊會看 OVR，也會看球探值、聲望和重要比賽表現。`;
  $('#offer-grid').innerHTML = offers.map((team) => {
    const eligible = score >= (team.entry || 0) || team.id === 'tw_ms';
    const country = COUNTRIES[team.country];
    return `<button type="button" data-offer="${team.id}" class="${eligible ? '' : 'locked'}" ${eligible ? '' : 'disabled'} style="--offer:${team.color}">
      <div><i>${country.flag}</i><span>${country.name}</span><em>${eligible ? 'OFFER' : `需 ${team.entry}`}</em></div>
      <h3>${team.name}</h3><p>${team.league}</p>
      <dl><div><dt>聯賽強度</dt><dd>${team.difficulty}</dd></div><div><dt>曝光</dt><dd>${'●'.repeat(Math.min(5, Math.ceil(team.prestige / 2)))}${'○'.repeat(5 - Math.min(5, Math.ceil(team.prestige / 2)))}</dd></div><div><dt>年收入</dt><dd>${team.salary ? `${team.salary} 萬` : '學生'}</dd></div></dl>
      <small>${eligible ? `${country.style} · 點擊簽約` : '目前市場評級不足'}</small>
    </button>`;
  }).join('');
  document.querySelectorAll('[data-offer]:not(:disabled)').forEach((button) => button.addEventListener('click', () => acceptOffer(button.dataset.offer)));
  $('#offer-dialog').showModal();
}

function acceptOffer(teamId) {
  const team = TEAMS[teamId];
  state.teamId = teamId;
  if (!state.visited.includes(team.country)) state.visited.push(team.country);
  state.seasonIndex += 1;
  state.week = 0;
  state.mode = 'event';
  state.pendingResult = null;
  state.summary = null;
  state.seasonMargins = [];
  state.seasonSuccesses = 0;
  state.rhythm = clamp(48 + (state.rhythm - 50) * .35);
  state.trust = team.country === state.history.at(-1)?.country ? clamp(state.trust * .7) : 20;
  state.load = clamp(state.load - 12);
  saveGame();
  $('#offer-dialog').close();
  renderAll();
  showToast(`已簽約：${team.name}`);
}

function renderAll() {
  if (!state) return;
  stageProgress();
  renderPlayerPanel();
  renderWorldPanel();
  renderArena();
}

function legacyScore() {
  return overall() + state.trophies * 5 + state.visited.length * 3 + state.wins * 1.5 + state.reputation * .08;
}

function hallOfFameProfile() {
  const score = legacyScore();
  const finalSeason = SEASONS.at(-1);
  const careerComplete = state.seasonIndex === SEASONS.length - 1 && state.history.some((item) => item.year === finalSeason.year);
  const inducted = careerComplete && score >= 125;
  let label = '尚未進入討論';
  let note = '繼續累積冠軍、旅外經歷與關鍵戰勝場。';
  if (careerComplete) {
    label = inducted ? '正式入選名人堂' : '名人堂遺珠';
    note = inducted ? '你的生涯成就已經通過名人堂門檻。' : '生涯已結束，最終履歷差一點進入名人堂。';
  } else if (score >= 125) {
    label = '名人堂等級';
    note = '目前履歷已經達標，完成生涯就有機會正式入選。';
  } else if (score >= 108) {
    label = '名人堂熱門候選';
    note = '再補上冠軍或更多關鍵戰勝場，就很接近了。';
  } else if (score >= 92) {
    label = '開始受到討論';
    note = '球迷已經開始討論，但履歷還需要一座代表作。';
  }
  return { score, careerComplete, inducted, label, note, progress: clamp((score / 125) * 100) };
}

function careerRouteEntries() {
  const route = state.history.map((item) => {
    const team = TEAMS[item.teamId] || Object.values(TEAMS).find((candidate) => candidate.name === item.team);
    const season = SEASONS.find((candidate) => candidate.year === item.year);
    return {
      year: item.year,
      stage: item.stage || season?.stage || (team?.level === 'pro' ? '職業' : '養成'),
      country: item.country || team?.country || 'TW',
      team: item.team || team?.name || '未知球隊',
      record: item.record || '—',
      champion: Boolean(item.champion),
      current: false
    };
  });
  const season = currentSeason();
  const team = currentTeam();
  const alreadyRecorded = route.some((item) => item.year === season.year && item.team === team.name);
  if (!alreadyRecorded) {
    route.push({ year: season.year, stage: season.stage, country: team.country, team: team.name, record: '進行中', champion: false, current: true });
  }
  return route;
}

function careerAchievements(hall = hallOfFameProfile()) {
  const achievements = [
    { unlocked: true, title: '13 歲開打', desc: '從台灣國中校隊開始生涯' },
    { unlocked: state.history.length >= 1, title: '完成第一季', desc: '正式留下第一筆球季紀錄' },
    { unlocked: state.visited.length >= 2, title: '旅外第一站', desc: `已踏上 ${state.visited.length} 個國家的球場` },
    { unlocked: state.visited.length >= 5, title: '五國行者', desc: '完成台、日、韓、中、美生涯版圖' },
    { unlocked: state.trophies >= 1, title: `${state.trophies} 座冠軍`, desc: '把球季打到最後並拿下獎盃' },
    { unlocked: state.wins >= 5, title: '關鍵戰專家', desc: `關鍵回合累積 ${state.wins} 勝` },
    { unlocked: overall() >= 70, title: '70 OVR CLUB', desc: `目前綜合評分 ${overall()}` },
    { unlocked: state.badges.length >= 3, title: '打法收藏家', desc: `已解鎖 ${state.badges.length} 個打法印記` },
    { unlocked: hall.inducted, title: '名人堂成員', desc: '生涯履歷正式通過名人堂門檻' }
  ];
  return achievements.filter((item) => item.unlocked);
}

function renderCard() {
  const team = currentTeam();
  const season = currentSeason();
  const route = careerRouteEntries();
  const hall = hallOfFameProfile();
  const achievements = careerAchievements(hall);
  const seedIdentity = `<span><b>神秘種子</b><em>${state.profile.seed} · 隱藏能力會在生涯中慢慢展現</em></span>`;
  const playIdentity = state.badges.map((badge) => `<span><b>${BADGES[badge].label}</b><em>${BADGES[badge].desc}</em></span>`).join('') || '<span><b>打法尚未成形</b><em>持續做選擇，三次後會形成你的打法印記。</em></span>';
  $('#card-content').innerHTML = `
    <div class="card-kicker"><span>COURTBOUND / ${state.profile.seed || 'PLAYER DOSSIER'}</span><b>${overall()}</b></div>
    <div class="big-player-name"><small>${state.profile.position} · ${POSITIONS[state.profile.position].name}</small><h2>${escapeHtml(state.profile.name)}</h2><p>${state.profile.hometown}出身 · ${state.profile.hand} · ${season.age} 歲 · ${team.name}</p></div>
    <div class="card-stat-grid">${Object.entries(STAT_META).map(([key, meta]) => `<div><small>${meta.code}</small><b>${Math.round(state.stats[key])}</b><span>${meta.label}</span></div>`).join('')}</div>
    <section class="hall-card ${hall.inducted ? 'inducted' : ''}">
      <div><small>HALL OF FAME WATCH</small><h3>${hall.label}</h3><p>${hall.note}</p></div>
      <strong>${Math.round(hall.score)}<small>/ 125</small></strong>
      <i style="--hof:${hall.progress}%"><b></b></i>
    </section>
    <div class="card-columns">
      <section><small>MYSTERY SEED & PLAY IDENTITY</small><div class="badge-list">${seedIdentity}${playIdentity}</div></section>
      <section><small>CAREER NUMBERS</small><dl><div><dt>球季</dt><dd>${state.history.length}</dd></div><div><dt>國家</dt><dd>${state.visited.length}</dd></div><div><dt>冠軍</dt><dd>${state.trophies}</dd></div><div><dt>關鍵勝負</dt><dd>${state.wins}–${state.losses}</dd></div><div><dt>生涯得分</dt><dd>${state.careerPoints || 0}</dd></div><div><dt>生涯收入</dt><dd>${Math.round(state.income)} 萬</dd></div></dl></section>
    </div>
    <div class="career-card-details">
      <section><small>SCHOOLS & TEAMS / 生涯學校與球隊</small><div class="career-path-list">${route.map((item) => `<div class="${item.current ? 'current' : ''}"><i>${item.year}</i><b>${COUNTRIES[item.country]?.flag || item.country}</b><span><strong>${escapeHtml(item.team)}</strong><small>${item.stage} · ${item.record}${item.champion ? ' · 冠軍' : ''}</small></span></div>`).join('')}</div></section>
      <section><small>ACHIEVEMENTS / 生涯成就</small><div class="achievement-grid">${achievements.map((item, index) => `<div><i>${String(index + 1).padStart(2, '0')}</i><span><b>${item.title}</b><small>${item.desc}</small></span></div>`).join('')}</div></section>
    </div>`;
  $('#card-dialog').showModal();
}

function endingProfile() {
  const score = legacyScore();
  let grade = 'B';
  if (score >= 145) grade = 'S+';
  else if (score >= 125) grade = 'S';
  else if (score >= 108) grade = 'A';
  const topTag = Object.entries(state.choices).sort((a, b) => b[1] - a[1])[0][0];
  const titles = {
    attack: '禁區就是你的遊樂場', shooter: '一有空檔就會進', creator: '全隊都跟著你的節奏', stopper: '王牌看到你就頭痛', iron: '跑到最後還有力', connector: '讓隊友一起變強'
  };
  return { score, grade, title: titles[topTag] };
}

function showEnding() {
  const ending = endingProfile();
  const hall = hallOfFameProfile();
  const first = state.history[0];
  const last = state.history.at(-1);
  $('#ending-content').innerHTML = `
    <div class="ending-grade"><small>CAREER GRADE</small><b>${ending.grade}</b><span>${Math.round(ending.score)} LEGACY</span></div>
    <div class="ending-copy"><small>2060 · CAREER COMPLETE</small><h2>${ending.title}</h2><p>${escapeHtml(state.profile.name)} 從 ${first.team} 開始打球，最後來到 ${last.team}。你去過 ${state.visited.length} 個國家、拿到 ${state.trophies} 座冠軍。每一站、每一個選擇，都是你自己決定的。名人堂評選：${hall.label}。</p></div>
    <div class="ending-numbers"><span><b>${overall()}</b> 最終 OVR</span><span><b>${state.wins}–${state.losses}</b> 關鍵回合</span><span><b>${state.trophies}</b> 冠軍</span><span><b>${state.visited.length}</b> 國家</span></div>
    <div class="ending-route">${state.history.map((item) => `<div><i>${item.year}</i><b>${COUNTRIES[item.country].flag}</b><span>${item.team}<small>${item.record} · ${item.ppg} PTS</small></span></div>`).join('')}</div>
    <div class="ending-actions"><button type="button" id="download-card">下載生涯卡</button><button type="button" id="restart-ending">再走一條路</button></div>`;
  $('#ending-dialog').showModal();
  $('#download-card').addEventListener('click', downloadCareerCard);
  $('#restart-ending').addEventListener('click', restartGame);
}

function downloadCareerCard() {
  const canvas = $('#share-canvas');
  canvas.width = 1080;
  canvas.height = 1750;
  const ctx = canvas.getContext('2d');
  const ending = endingProfile();
  const hall = hallOfFameProfile();
  const route = careerRouteEntries();
  const achievements = careerAchievements(hall);
  ctx.fillStyle = '#11110e'; ctx.fillRect(0, 0, 1080, 1750);
  ctx.fillStyle = '#ff5a1f'; ctx.fillRect(56, 56, 968, 18);
  ctx.fillStyle = '#dfff00'; ctx.font = '700 28px sans-serif'; ctx.fillText('籃途 / COURTBOUND', 68, 132);
  ctx.fillStyle = '#f1efe8'; ctx.font = '900 88px sans-serif'; ctx.fillText(state.profile.name, 68, 255);
  ctx.fillStyle = '#8b8980'; ctx.font = '500 28px sans-serif'; ctx.fillText(`${state.profile.position} · ${POSITIONS[state.profile.position].name} · ${state.visited.length} 國生涯`, 72, 310);
  ctx.fillStyle = '#ff5a1f'; ctx.font = '900 280px sans-serif'; ctx.fillText(ending.grade, 62, 595);
  ctx.fillStyle = '#f1efe8'; ctx.font = '800 47px sans-serif'; ctx.fillText(ending.title, 72, 680);
  const labels = [['目前 OVR', overall()], ['冠軍', state.trophies], ['關鍵勝負', `${state.wins}–${state.losses}`], ['生涯國家', state.visited.length]];
  labels.forEach(([label, value], index) => {
    const x = 68 + (index % 2) * 480; const y = 755 + Math.floor(index / 2) * 145;
    ctx.strokeStyle = '#393934'; ctx.strokeRect(x, y, 440, 120);
    ctx.fillStyle = '#8b8980'; ctx.font = '600 22px sans-serif'; ctx.fillText(label, x + 22, y + 35);
    ctx.fillStyle = '#f1efe8'; ctx.font = '900 50px sans-serif'; ctx.fillText(String(value), x + 22, y + 91);
  });
  ctx.fillStyle = hall.inducted ? '#dfff00' : '#ff5a1f'; ctx.fillRect(68, 1060, 944, 112);
  ctx.fillStyle = '#11110e'; ctx.font = '800 20px sans-serif'; ctx.fillText('HALL OF FAME WATCH', 90, 1096);
  ctx.font = '900 36px sans-serif'; ctx.fillText(hall.label, 90, 1143, 700);
  ctx.textAlign = 'right'; ctx.font = '900 44px sans-serif'; ctx.fillText(`${Math.round(hall.score)} / 125`, 990, 1139);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#dfff00'; ctx.font = '800 22px sans-serif'; ctx.fillText('生涯學校 / 球隊', 68, 1228);
  const routeLines = [];
  for (let index = 0; index < route.length; index += 3) {
    routeLines.push(route.slice(index, index + 3).map((item) => `${item.year} ${item.team}${item.champion ? ' ★' : ''}`).join('  →  '));
  }
  ctx.fillStyle = '#f1efe8'; ctx.font = '600 23px sans-serif';
  routeLines.slice(-4).forEach((line, index) => ctx.fillText(line, 68, 1272 + index * 39, 944));

  const achievementStart = 1450;
  ctx.fillStyle = '#ff5a1f'; ctx.font = '800 22px sans-serif'; ctx.fillText('生涯成就', 68, achievementStart);
  const achievementLines = [];
  for (let index = 0; index < achievements.length; index += 3) achievementLines.push(achievements.slice(index, index + 3).map((item) => item.title).join('  ·  '));
  ctx.fillStyle = '#f1efe8'; ctx.font = '600 23px sans-serif';
  achievementLines.slice(0, 3).forEach((line, index) => ctx.fillText(line, 68, achievementStart + 43 + index * 38, 944));

  ctx.fillStyle = '#8b8980'; ctx.font = '500 22px sans-serif'; ctx.fillText(`球季 ${state.history.length} · 生涯收入 ${Math.round(state.income)} 萬 · 13 歲開打，每一站都由你自己選。`, 68, 1670, 944);
  ctx.fillStyle = '#dfff00'; ctx.fillRect(68, 1705, 944, 8);
  const link = document.createElement('a');
  link.download = `${state.profile.name}-籃途生涯卡.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('生涯卡已下載');
}

function restartGame() {
  const shouldRestart = window.confirm('確定要結束目前生涯並建立新球員嗎？');
  if (!shouldRestart) return;
  localStorage.removeItem(SAVE_KEY);
  state = null;
  document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close());
  $('#continue-button').hidden = true;
  prepareNewProfile(true);
  $('#setup-dialog').showModal();
}

function bindStaticEvents() {
  $('#setup-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('#player-name').value.trim() || '未命名新秀';
    const seed = normalizeSeedCode($('#career-seed').value) || generateSeedCode();
    $('#career-seed').value = seed;
    state = createState({ name, seed, hometown: $('#hometown').value, hand: $('#hand').value, position: selectedPosition, style: 'none' });
    saveGame();
    $('#setup-dialog').close();
    renderAll();
    showToast('球員檔案建立完成');
  });
  $('#random-name-button').addEventListener('click', randomizeName);
  $('#random-seed-button').addEventListener('click', () => prepareNewProfile(false));
  $('#career-seed').addEventListener('input', (event) => {
    event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    renderSeedPreview();
  });
  $('#career-seed').addEventListener('blur', (event) => {
    event.target.value = normalizeSeedCode(event.target.value) || generateSeedCode();
    renderSeedPreview();
  });
  $('#continue-button').addEventListener('click', () => {
    state = loadGame();
    if (!state) return;
    $('#setup-dialog').close();
    renderAll();
    showToast('已讀取上次生涯');
  });
  $('#rules-button').addEventListener('click', () => $('#info-dialog').showModal());
  $('#card-button').addEventListener('click', () => state && renderCard());
  $('#settings-button').addEventListener('click', openSettings);
  $('#restart-career-button').addEventListener('click', restartGame);
  $('#close-settings-button').addEventListener('click', () => $('#settings-dialog').close());
  document.querySelectorAll('[data-interface-mode]').forEach((button) => button.addEventListener('click', () => applyInterfaceMode(button.dataset.interfaceMode, true)));
  document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => $(`#${button.dataset.close}`).close()));
}

function init() {
  applyInterfaceMode(initialInterfaceMode());
  renderSetupOptions();
  bindStaticEvents();
  prepareNewProfile(false);
  const saved = loadGame();
  $('#continue-button').hidden = !saved;
  if (saved) {
    state = saved;
    renderAll();
  }
  $('#setup-dialog').showModal();
}

init();

