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

const POSITIONS = {
  PG: { name: '控球後衛', desc: '創造與球商', number: 3, height: 174, bonus: { playmaking: 5, iq: 4, shooting: 1 } },
  SG: { name: '得分後衛', desc: '投射與終結', number: 7, height: 181, bonus: { shooting: 5, finish: 4, athletic: 1 } },
  SF: { name: '小前鋒', desc: '全能與防守', number: 13, height: 187, bonus: { defense: 3, finish: 3, athletic: 3, iq: 1 } },
  PF: { name: '大前鋒', desc: '對抗與空間', number: 21, height: 193, bonus: { finish: 4, defense: 3, athletic: 3 } },
  C: { name: '中鋒', desc: '護框與籃板', number: 34, height: 199, bonus: { defense: 5, athletic: 3, finish: 2 } }
};

const STYLES = {
  street: { name: '巷口魔術師', code: 'CREATOR', desc: '節奏 +8；擅長用不可預測的路線製造機會。', bonus: { playmaking: 4, finish: 2 }, pulse: { rhythm: 8 } },
  sniper: { name: '沉默射手', code: 'SNIPER', desc: '投射 +6；空間越小，出手越乾淨。', bonus: { shooting: 6 }, pulse: { rhythm: 3 } },
  stopper: { name: '黏人防線', code: 'STOPPER', desc: '防守 +5、體能 +2；先讓對位的人失去耐心。', bonus: { defense: 5, athletic: 2 }, pulse: { trust: 4 } },
  engine: { name: '球場引擎', code: 'ENGINE', desc: '球商 +4、組織 +3；永遠比比賽早一拍。', bonus: { iq: 4, playmaking: 3 }, pulse: { trust: 5 } }
};

const PLAYER_NAMES = [
  '林拓海', '陳昱安', '張凱翔', '李承恩', '王柏鈞', '吳宇辰', '劉冠廷', '黃子軒', '趙品睿', '周宥廷',
  '蔡沛洋', '楊哲宇', '鄭維新', '謝孟軒', '洪睿哲', '郭奕辰', '曾柏翰', '徐浩然', '賴彥廷', '蘇祐晨',
  '江品妤', '何語晴', '羅羽彤', '高宥蓁', '梁欣妍', '朱芷寧', '彭若希', '方語恩', '葉昕妤', '杜采潔'
];

const SEED_TRAITS = [
  { id: 'genius', code: 'GENIUS', name: '天才型', base: 3, growth: 1.12, load: 1, bonus: { iq: 2 }, desc: '起步能力較高，讀懂新技術的速度也比同齡球員快。' },
  { id: 'grinder', code: 'GRIND', name: '苦練型', base: -2, growth: 1.24, load: 1.06, bonus: {}, desc: '起點不突出，但每次訓練都能累積更多成長。' },
  { id: 'early', code: 'EARLY', name: '早熟型', base: 5, growth: .94, load: 1.02, bonus: {}, desc: '國中階段就有成熟即戰力，後續成長曲線較平穩。' },
  { id: 'late', code: 'LATE', name: '晚成型', base: -4, growth: 1.32, load: .96, bonus: {}, desc: '前期需要耐心，生涯越往後越能追過天賦差距。' },
  { id: 'iron', code: 'IRON', name: '鐵人型', base: 0, growth: 1.05, load: .72, bonus: { athletic: 3, defense: 1 }, desc: '身體恢復與耐受度出色，正向負荷累積降低 28%。' },
  { id: 'instinct', code: 'INSTINCT', name: '直覺型', base: 1, growth: 1.10, load: 1, bonus: { playmaking: 2, iq: 1 }, desc: '臨場理解敏銳，擅長能力在關鍵判定中更加可靠。' }
];

const COUNTRIES = {
  TW: { name: '台灣', flag: 'TW', accent: '#dfff00', style: '轉換快、角色彈性高', opponent: ['北岸聯隊', '南城雷雨', '港都礦工', '東海岸獵人'] },
  JP: { name: '日本', flag: 'JP', accent: '#ff6a72', style: '紀律輪轉與高速傳導', opponent: ['千葉白浪', '名古屋軸心', '大阪電塔', '秋田雪線'] },
  KR: { name: '韓國', flag: 'KR', accent: '#78a7ff', style: '強硬對抗與精密執行', opponent: ['水原火線', '釜山港灣', '大邱黑鷹', '首爾北門'] },
  CN: { name: '中國', flag: 'CN', accent: '#ff7057', style: '尺寸、深度與半場壓迫', opponent: ['廣州赤潮', '北京穹頂', '成都遠山', '上海重工'] },
  US: { name: '美國', flag: 'US', accent: '#65d9ff', style: '空間、速度與單點爆破', opponent: ['Mesa Falcons', 'Pacific Union', 'Brooklyn Forge', 'Austin Comets'] }
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
  { age: 13, year: 2039, stage: '國中', name: '菜鳥季', target: '爭取校隊輪替', pressure: 0 },
  { age: 14, year: 2040, stage: '國中', name: '主力競爭', target: '進入先發名單', pressure: 1 },
  { age: 15, year: 2041, stage: '國中', name: '全國國中盃', target: '拿到第一份跨國邀請', pressure: 3 },
  { age: 16, year: 2042, stage: '高中', name: '陌生體系', target: '在新舞台站穩腳步', pressure: 4 },
  { age: 17, year: 2043, stage: '高中', name: '先發之爭', target: '成為球隊不可替代的拼圖', pressure: 5 },
  { age: 18, year: 2044, stage: '高中', name: '畢業賽季', target: '把名字送進國際球探名單', pressure: 7 },
  { age: 19, year: 2045, stage: '養成', name: '成人賽場', target: '撐過尺寸與速度的跳級', pressure: 7 },
  { age: 21, year: 2047, stage: '養成', name: '門檻之年', target: '取得真正的職業席位', pressure: 9 },
  { age: 23, year: 2049, stage: '職業', name: '職業新秀', target: '證明合約不是市場誤判', pressure: 10 },
  { age: 26, year: 2052, stage: '職業', name: '黃金曲線', target: '成為能改變季後賽的核心', pressure: 12 },
  { age: 30, year: 2056, stage: '職業', name: '爭冠窗口', target: '把巔峰兌現成一座獎盃', pressure: 14 },
  { age: 34, year: 2060, stage: '傳奇', name: '最後一舞', target: '決定球場會怎麼記住你', pressure: 16 }
];

const BADGES = {
  attack: { label: '破框者', stat: 'finish', desc: '攻框選項脈衝 +3' },
  shooter: { label: '深距威脅', stat: 'shooting', desc: '投射選項脈衝 +3' },
  creator: { label: '節拍製造者', stat: 'playmaking', desc: '組織選項脈衝 +3' },
  stopper: { label: '進攻終止點', stat: 'defense', desc: '防守選項脈衝 +3' },
  iron: { label: '耐久核心', stat: 'athletic', desc: '體能選項脈衝 +3' },
  connector: { label: '更衣室連結者', stat: 'iq', desc: '團隊選項脈衝 +3' }
};

const TACTICS = {
  pace: { code: 'PACE', title: '把節奏推到防守失去形狀', desc: '抓到球就推進，用第一道縫隙決定這個回合。', primary: 'playmaking', secondary: 'athletic', tag: 'creator', deltas: { rhythm: 7, load: 6, trust: 1 }, success: '你在對手完成站位前送出最後一傳，整座球館只來得及看見籃網翻起。', failure: '速度先於隊友的理解，快攻在最擁擠的位置停了下來。' },
  pullup: { code: 'PULL', title: '借半步空間直接拔起', desc: '不等戰術跑完，測試防守者願意退到哪裡。', primary: 'shooting', secondary: 'iq', tag: 'shooter', deltas: { rhythm: 5, load: 4 }, success: '防守只退了半步；這已經足夠。球穿過籃框時，他還停在錯誤的距離。', failure: '你讀對了空間，卻沒處理好落地前的對抗。短了一點。' },
  drive: { code: 'RIM', title: '對準禁區最窄的縫隙', desc: '把碰撞當成路線的一部分，攻擊護框者的重心。', primary: 'finish', secondary: 'athletic', tag: 'attack', deltas: { rhythm: 6, load: 8 }, success: '你沒有避開碰撞。哨聲與擦板聲幾乎同時抵達，回合被硬生生改寫。', failure: '第二道協防比球探報告快。球碰到籃板，沒有碰到框。' },
  create: { code: 'READ', title: '多等一拍，讓弱邊自己打開', desc: '吸住兩名防守者，再把球送進沒人看見的窗口。', primary: 'playmaking', secondary: 'iq', tag: 'creator', deltas: { trust: 7, rhythm: 2 }, success: '那條傳球路線只存在半秒。隊友接到球時，籃框前已經沒有第二種答案。', failure: '你看見了窗口，接球的人卻還沒準備好。球滑過他的指尖。' },
  lock: { code: 'LOCK', title: '接管對方最後一個箭頭', desc: '放掉數據，把整個回合押在一次防守站位。', primary: 'defense', secondary: 'athletic', tag: 'stopper', deltas: { trust: 5, load: 6 }, success: '你沒有抄到球，卻拿走了他所有想去的地方。二十四秒歸零。', failure: '第一次假動作沒有騙到你，第二次身體接觸卻讓路線斷開。' },
  glass: { code: 'GLASS', title: '把這個回合延長一次', desc: '不追第一個封阻，先卡死最危險的二次進攻。', primary: 'athletic', secondary: 'defense', tag: 'iron', deltas: { trust: 5, load: 7 }, success: '籃板落下前，你已經先贏了位置。對手的最後機會被抱進懷裡。', failure: '你卡住第一個人，弱邊卻飛進另一雙手。回合沒有結束。' },
  screen: { code: 'LINK', title: '用一次掩護改變四個人的站位', desc: '不急著碰球，先替持球者創造新的角度。', primary: 'iq', secondary: 'athletic', tag: 'connector', deltas: { trust: 7, load: 4 }, success: '防守換人慢了半拍，你在短擋拆區接球，下一傳把整條防線拆成兩半。', failure: '角度差了幾公分，防守者穿過掩護，戰術回到原點。' },
  post: { code: 'POST', title: '把低位變成你的房間', desc: '用肩膀確認重心，再選擇轉身的方向。', primary: 'finish', secondary: 'iq', tag: 'attack', deltas: { rhythm: 4, load: 7 }, success: '第二下運球逼出協防，你轉向底線，擦板角度乾淨得像練習。', failure: '協防來得更早，球在收球瞬間被切掉。' }
};

let state = null;
let selectedPosition = 'PG';
let selectedStyle = 'street';
let currentSeedProfile = null;
let toastTimer = null;

const $ = (selector) => document.querySelector(selector);
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));
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
  addMap(stats, STYLES[profile.style].bonus);
  Object.keys(stats).forEach((key) => { stats[key] = clamp(stats[key], 35, 72); });
  return stats;
}

function renderSeedPreview() {
  const input = $('#career-seed');
  const preview = $('#seed-preview');
  if (!input || !preview) return;
  if (!input.value) {
    currentSeedProfile = null;
    preview.innerHTML = '<strong>等待種子</strong><span><b>輸入任意英數代碼</b><small>完成輸入後會產生固定能力、專長與成長類型。</small></span>';
    return;
  }
  currentSeedProfile = buildSeedProfile(input.value);
  const stats = statsForProfile({ seed: currentSeedProfile.code, position: selectedPosition, style: selectedStyle }, currentSeedProfile);
  const [primary, secondary] = currentSeedProfile.specialties;
  preview.innerHTML = `
    <strong>${currentSeedProfile.trait.name}</strong>
    <span><b>${currentSeedProfile.trait.code} · 成長 ×${currentSeedProfile.trait.growth.toFixed(2)}</b><small>${currentSeedProfile.trait.desc}</small></span>
    <em>擅長 ${STAT_META[primary].label} ${Math.round(stats[primary])} · ${STAT_META[secondary].label} ${Math.round(stats[secondary])}</em>`;
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
    rhythm: clamp(48 + (STYLES[profile.style].pulse.rhythm || 0)),
    trust: clamp(22 + (STYLES[profile.style].pulse.trust || 0)),
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
  $('#style-grid').innerHTML = Object.entries(STYLES).map(([key, item]) => `
    <button type="button" data-style="${key}" class="${key === selectedStyle ? 'selected' : ''}">
      <small>${item.code}</small><b>${item.name}</b><span>${item.desc}</span>
    </button>`).join('');
  document.querySelectorAll('[data-position]').forEach((button) => button.addEventListener('click', () => {
    selectedPosition = button.dataset.position;
    renderSetupOptions();
  }));
  document.querySelectorAll('[data-style]').forEach((button) => button.addEventListener('click', () => {
    selectedStyle = button.dataset.style;
    renderSetupOptions();
  }));
  if ($('#career-seed')?.value) renderSeedPreview();
}

function stageProgress() {
  const stages = ['國中', '高中', '養成', '職業', '傳奇'];
  const active = stages.indexOf(currentSeason().stage);
  $('#season-track').innerHTML = stages.map((stage, index) => `${index ? '<i></i>' : ''}<span class="${index === active ? 'active' : index < active ? 'done' : ''}">${stage}</span>`).join('');
}

function badgeBonus(tag) {
  return state.badges.includes(tag) ? 3 : 0;
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
  const badge = state.badges.length ? BADGES[state.badges[state.badges.length - 1]].label : STYLES[state.profile.style].name;
  const seedTrait = state.profile.seedTraitName;
  $('#player-panel').innerHTML = `
    <div class="eyebrow">PLAYER FILE / ${state.profile.seed || String(state.seasonIndex + 1).padStart(4, '0')}</div>
    <div class="player-card">
      <div class="jersey" style="--team:${team.color}">${POSITIONS[state.profile.position].number}</div>
      <div><h2>${escapeHtml(state.profile.name)}</h2><p>${COUNTRIES[team.country].name} · ${season.age} 歲 · ${state.profile.position}</p><small>${badge}</small></div>
    </div>
    <div class="rating-block"><span>綜合評分</span><strong>${ovr}</strong><small>OVR</small></div>
    <div class="stat-list">
      ${Object.entries(STAT_META).map(([key, meta]) => `<div class="stat-row"><i>${meta.icon}</i><span>${meta.label}<small>${meta.code}</small></span><b>${Math.round(state.stats[key])}</b><em style="--fill:${state.stats[key]}%"></em></div>`).join('')}
    </div>
    <div class="pulse-meters">
      ${resourceMeter('近期節奏', state.rhythm, 'rhythm')}
      ${resourceMeter('教練信任', state.trust, 'trust')}
      ${resourceMeter('身體負荷', state.load, 'load')}
    </div>
    <div class="identity-strip"><small>${seedTrait ? `SEED TRAIT · ${state.profile.seed}` : 'PLAY IDENTITY'}</small><b>${seedTrait ? `${seedTrait} / ` : ''}${badge}</b></div>`;
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
    TW: ['沒有攝影機的星期一', '鐵門拉下後，體育館只剩球鞋摩擦聲。學長把最後一顆球推給你：「想進輪替，先讓教練知道你每天在改什麼。」'],
    JP: ['晨間練習第兩百次折返', '清晨六點四十分，全隊動作像同一支秒針。助教沒有叫你的名字，只把訓練表上的空格圈了起來。'],
    KR: ['宿舍門禁前的錄影室', '晚餐後只剩四十分鐘。教練把上一場被針對的十七個回合剪成一段，等你先說出答案。'],
    CN: ['基地裡的加練名單', '青年隊有二十二個人，正式名單只有十二格。體能教練把今天的負荷數據放在你面前，沒有催你選。'],
    US: ['空球館裡的個人時段', '訓練館同時有三組球探。沒有人告訴你他們想看什麼，只知道每個籃框前都有人排隊證明自己。']
  }[country];
}

function buildEvent() {
  const season = currentSeason();
  const team = currentTeam();
  const country = COUNTRIES[team.country];
  if (state.week === 0) {
    const copy = countryTrainingCopy(team.country);
    return {
      kicker: `WEEK 01 · ${country.flag} / DEVELOPMENT`, title: copy[0], story: copy[1], quote: '能力不是加上去的，是每天把錯誤減掉一點。', value: '01', valueLabel: 'TRAINING', tint: team.color,
      actions: [
        { code: 'A', title: '把一個動作磨到沒有雜音', desc: '選擇目前最弱的技術，進行高密度個人訓練。', primary: weakestStat(), secondary: 'iq', tag: statTag(weakestStat()), difficulty: team.difficulty - 8, growth: 2.2, deltas: { load: 9, rhythm: 4 }, success: '最後十次動作像同一段影格。你終於不必思考每一個細節。', failure: '疲勞讓動作變形，你及時停下，至少知道問題真正卡在哪裡。' },
        { code: 'B', title: '拆解下一個對手的習慣', desc: '把訓練時間交給影片、筆記與情境推演。', primary: 'iq', secondary: 'playmaking', tag: 'creator', difficulty: team.difficulty - 10, growth: 1.8, deltas: { trust: 4, load: 2 }, success: '影片裡重複出現的半步成了線索。比賽還沒開始，你已經找到第一個答案。', failure: '資訊太多，答案反而模糊。你決定把筆記縮成一件真正能執行的事。' },
        { code: 'C', title: '把重量留在腿裡', desc: '跟著體能教練完成力量與落地控制課表。', primary: 'athletic', secondary: 'defense', tag: 'iron', difficulty: team.difficulty - 7, growth: 2, deltas: { load: 11, rhythm: -1 }, success: '最後一組落地仍然穩定。你的身體開始追上腦中想做的動作。', failure: '負荷逼近紅線。你減少一組，避免今天的努力變成下週的傷勢。' }
      ]
    };
  }
  if (state.week === 1) {
    return {
      kicker: `WEEK 02 · ${country.flag} / TEAM`, title: season.age < 19 ? '輪替名單公布前一晚' : '合約與更衣室之間',
      story: season.age < 19 ? '助教把明天的輪替表蓋在桌上。你可以為自己多爭一個回合，也可以先處理球隊最近開始出現的裂縫。' : '經紀人帶來新的市場消息；同一時間，隊友傳來訊息，希望你留下來把最後一套戰術走完。職業選擇從來不只發生在球場。',
      quote: '被信任不是因為你從不失誤，而是失誤之後仍有人願意把球交給你。', value: '02', valueLabel: 'LOCKER ROOM', tint: '#dfff00',
      actions: [
        { code: 'A', title: '留下來陪替補組跑完戰術', desc: '把個人曝光換成全隊都能理解的節奏。', primary: 'playmaking', secondary: 'iq', tag: 'connector', difficulty: team.difficulty - 7, growth: 1.4, deltas: { trust: 10, load: 4, reputation: -1 }, success: '替補控衛終於喊出正確口令。明天不論誰上場，球隊都多了一種活法。', failure: '大家很累，練習沒有突然變好；但更衣室知道你沒有先離開。' },
        { code: 'B', title: '接受球探安排的單獨測試', desc: '把最好的動作交給市場，也承擔被放大檢視的壓力。', primary: strongestStat(), secondary: 'athletic', tag: statTag(strongestStat()), difficulty: team.difficulty - 3, growth: 1.2, deltas: { scout: 9, reputation: 4, load: 6, trust: -2 }, success: '測試表上的數字讓房間安靜了幾秒。下一站開始把你的名字寫進名單。', failure: '你沒有打出最好的一組，但球探看見了你如何在失手後修正。' },
        { code: 'C', title: '關掉手機，完整休息一天', desc: '不追趕任何人，讓身體重新成為可靠的隊友。', primary: 'athletic', secondary: 'iq', tag: 'iron', difficulty: team.difficulty - 13, growth: .8, deltas: { load: -22, rhythm: -3, trust: 1 }, success: '隔天起床時，膝蓋沒有先替你發出聲音。慢下來也可以是一種投資。', failure: '焦慮沒有立刻消失，但疲勞退了一點。你至少拿回一次完整呼吸。' }
      ]
    };
  }
  const opponent = country.opponent[(state.seasonIndex + state.profile.name.length + team.name.length) % country.opponent.length];
  return {
    kicker: `WEEK 03 · ${team.league.toUpperCase()}`, title: `${season.name} · 決勝回合`, story: `對上「${opponent}」，比賽剩下 31.8 秒，雙方只差一個球權。暫停結束前，教練看向你：這個回合要用你的方式解。`, quote: `對手球探：他們會逼你走左邊，然後從底角收網。`, value: '31.8', valueLabel: 'SECONDS', tint: '#ff5a1f', game: true, actions: gameActions()
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
  const signature = ({ street: 'pace', sniper: 'pullup', stopper: 'lock', engine: 'create' })[state.profile.style];
  if (!keys.includes(signature)) keys[2] = signature;
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
    <div class="decision-head"><div><small>${event.game ? 'POSSESSION DECISION' : 'CAREER DECISION'} · PULSE ENGINE</small><h2>${event.game ? '最後一個球權，你相信哪一種自己？' : '這一週，你把時間投資在哪裡？'}</h2></div><p>主要能力 × 次要能力 × 三條脈衝軌道。選擇後立即推演。</p></div>
    <div class="option-grid">
      ${event.actions.map((action, index) => `<button type="button" data-action="${index}"><em>${action.code || String(index + 1).padStart(2, '0')}</em><b>${action.title}</b><span>${action.desc}</span><small>${STAT_META[action.primary].label} ＋ ${STAT_META[action.secondary].label}<i>${formatDeltas(action.deltas)}</i></small></button>`).join('')}
    </div>`;
  document.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', () => resolveAction(event.actions[Number(button.dataset.action)])));
}

function formatDeltas(deltas = {}) {
  const labels = { rhythm: '節奏', trust: '信任', load: '負荷', scout: '球探', reputation: '聲望' };
  return Object.entries(deltas).map(([key, value]) => `${labels[key] || key} ${value > 0 ? '+' : ''}${value}`).join(' · ');
}

function pulseCalculation(action) {
  const primary = state.stats[action.primary];
  const secondary = state.stats[action.secondary];
  const skill = primary * .62 + secondary * .22 + state.stats.iq * .08;
  const rhythm = (state.rhythm - 50) * .11;
  const trust = (state.trust - 50) * .07;
  const load = -Math.max(0, state.load - 28) * .10;
  const identity = badgeBonus(action.tag);
  const seedSpecialty = state.profile.seedSpecialties?.includes(action.primary) ? 1.5 : 0;
  const variation = randomBetween(-5.5, 5.5);
  const total = skill + rhythm + trust + load + identity + seedSpecialty + variation;
  const difficulty = clamp(action.difficulty, 36, 96);
  return { primary, secondary, skill, rhythm, trust, load, identity, seedSpecialty, variation, total, difficulty, margin: total - difficulty };
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
  const calc = pulseCalculation(action);
  const success = calc.margin >= 0;
  applyDeltas(action.deltas);
  const specialtyGrowth = state.profile.seedSpecialties?.includes(action.primary) ? 1.08 : 1;
  const growth = action.growth * (state.profile.growthModifier || 1) * specialtyGrowth * (success ? 1 : .55);
  state.stats[action.primary] = clamp(state.stats[action.primary] + growth, 0, 99);
  state.stats[action.secondary] = clamp(state.stats[action.secondary] + growth * .42, 0, 99);
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
  state.pendingResult = { action, calc, success, badges, game: Boolean(action.game) };
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
        <h2>${result.success ? '這個選擇站住了。' : '球場把答案推了回來。'}</h2>
        <p>${result.success ? action.success : action.failure}</p>
        <div class="formula-strip"><span>技術 <b>${result.calc.skill.toFixed(1)}</b></span><span>節奏 <b>${signed(result.calc.rhythm)}</b></span><span>信任 <b>${signed(result.calc.trust)}</b></span><span>負荷 <b>${signed(result.calc.load)}</b></span><span>打法 <b>+${result.calc.identity}</b></span>${result.calc.seedSpecialty ? `<span>種子專長 <b>+${result.calc.seedSpecialty}</b></span>` : ''}<span>臨場 <b>${signed(result.calc.variation)}</b></span></div>
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
  const ppg = (4 + state.stats.finish * .10 + state.stats.shooting * .11 + role * 5 + randomBetween(-1, 1)).toFixed(1);
  const rpg = (1 + (state.stats.athletic + state.stats.defense) * .045 + (['PF', 'C'].includes(state.profile.position) ? 2.2 : 0)).toFixed(1);
  const apg = (1 + (state.stats.playmaking + state.stats.iq) * .04 + (state.profile.position === 'PG' ? 2.2 : 0)).toFixed(1);
  const champion = winRate > .72 && state.seasonSuccesses >= 2;
  if (champion) state.trophies += 1;
  state.reputation += Math.round(team.prestige * 2 + winRate * 6 + (champion ? 8 : 0));
  state.scout += Math.round(team.prestige * 2 + Math.max(0, averageMargin / 3));
  state.income += team.salary;
  state.load = clamp(state.load - 18);
  const summary = {
    year: season.year, age: season.age, country: team.country, team: team.name, league: team.league,
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
      <div class="summary-copy"><small>${summary.year} · AGE ${summary.age}</small><h2>${summary.champion ? '你把這一季留在了旗幟上。' : '一季結束，市場開始重新估價。'}</h2>
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
  if (summary.champion) return '這座冠軍提高了你的跨國能見度，也讓下一份合約不再只談潛力。';
  if (summary.averageMargin > 3) return '你在關鍵回合的穩定度已被多國球探注意，旅外窗口正在打開。';
  if (summary.averageMargin > -4) return '沒有爆發式躍升，但你的能力曲線仍在上升。下一站會更在意你如何適應。';
  return '這季留下了幾道裂縫。好消息是，你已經知道下一次訓練該先修哪裡。';
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
  $('#offer-title').textContent = nextSeason.age >= 23 ? '職業市場，等你簽名' : '下一站，由你簽名';
  $('#offer-lead').textContent = `市場評級 ${score.toFixed(1)}。門檻不是單看 OVR，也包含球探值、聲望與大場面履歷。`;
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

function renderCard() {
  const team = currentTeam();
  const season = currentSeason();
  const seedIdentity = state.profile.seedTraitName ? `<span><b>${state.profile.seedTraitName}</b><em>${state.profile.seed} · 擅長 ${state.profile.seedSpecialties.map((key) => STAT_META[key].label).join('、')} · 成長 ×${state.profile.growthModifier.toFixed(2)}</em></span>` : '';
  $('#card-content').innerHTML = `
    <div class="card-kicker"><span>COURTBOUND / ${state.profile.seed || 'PLAYER DOSSIER'}</span><b>${overall()}</b></div>
    <div class="big-player-name"><small>${state.profile.position} · ${POSITIONS[state.profile.position].name}</small><h2>${escapeHtml(state.profile.name)}</h2><p>${state.profile.hometown}出身 · ${state.profile.hand} · ${season.age} 歲 · ${team.name}</p></div>
    <div class="card-stat-grid">${Object.entries(STAT_META).map(([key, meta]) => `<div><small>${meta.code}</small><b>${Math.round(state.stats[key])}</b><span>${meta.label}</span></div>`).join('')}</div>
    <div class="card-columns">
      <section><small>SEED & PLAY IDENTITY</small><div class="badge-list">${seedIdentity}${state.badges.map((badge) => `<span><b>${BADGES[badge].label}</b><em>${BADGES[badge].desc}</em></span>`).join('') || `<span><b>${STYLES[state.profile.style].name}</b><em>持續選擇，三次後形成新的打法印記。</em></span>`}</div></section>
      <section><small>CAREER NUMBERS</small><dl><div><dt>國家</dt><dd>${state.visited.length}</dd></div><div><dt>冠軍</dt><dd>${state.trophies}</dd></div><div><dt>關鍵勝負</dt><dd>${state.wins}–${state.losses}</dd></div><div><dt>生涯收入</dt><dd>${Math.round(state.income)} 萬</dd></div></dl></section>
    </div>`;
  $('#card-dialog').showModal();
}

function endingProfile() {
  const score = overall() + state.trophies * 5 + state.visited.length * 3 + state.wins * 1.5 + state.reputation * .08;
  let grade = 'B';
  if (score >= 145) grade = 'S+';
  else if (score >= 125) grade = 'S';
  else if (score >= 108) grade = 'A';
  const topTag = Object.entries(state.choices).sort((a, b) => b[1] - a[1])[0][0];
  const titles = {
    attack: '穿過所有縫隙的人', shooter: '讓半步成為射程的人', creator: '替球場改寫節拍的人', stopper: '讓王牌沉默的人', iron: '比時間更耐久的人', connector: '把五個人連成一隊的人'
  };
  return { score, grade, title: titles[topTag] };
}

function showEnding() {
  const ending = endingProfile();
  const first = state.history[0];
  const last = state.history.at(-1);
  $('#ending-content').innerHTML = `
    <div class="ending-grade"><small>CAREER GRADE</small><b>${ending.grade}</b><span>${Math.round(ending.score)} LEGACY</span></div>
    <div class="ending-copy"><small>2060 · CAREER COMPLETE</small><h2>${ending.title}</h2><p>${escapeHtml(state.profile.name)} 從 ${first.team} 的木地板出發，最後在 ${last.team} 留下生涯終章。走過 ${state.visited.length} 個國家、拿下 ${state.trophies} 座冠軍，沒有一段路是系統預先替你選的。</p></div>
    <div class="ending-numbers"><span><b>${overall()}</b> 最終 OVR</span><span><b>${state.wins}–${state.losses}</b> 關鍵回合</span><span><b>${state.trophies}</b> 冠軍</span><span><b>${state.visited.length}</b> 國家</span></div>
    <div class="ending-route">${state.history.map((item) => `<div><i>${item.year}</i><b>${COUNTRIES[item.country].flag}</b><span>${item.team}<small>${item.record} · ${item.ppg} PTS</small></span></div>`).join('')}</div>
    <div class="ending-actions"><button type="button" id="download-card">下載生涯卡</button><button type="button" id="restart-ending">再走一條路</button></div>`;
  $('#ending-dialog').showModal();
  $('#download-card').addEventListener('click', downloadCareerCard);
  $('#restart-ending').addEventListener('click', restartGame);
}

function downloadCareerCard() {
  const canvas = $('#share-canvas');
  const ctx = canvas.getContext('2d');
  const ending = endingProfile();
  ctx.fillStyle = '#11110e'; ctx.fillRect(0, 0, 1080, 1350);
  ctx.fillStyle = '#ff5a1f'; ctx.fillRect(56, 56, 968, 18);
  ctx.fillStyle = '#dfff00'; ctx.font = '700 28px sans-serif'; ctx.fillText('籃途 / COURTBOUND', 68, 132);
  ctx.fillStyle = '#f1efe8'; ctx.font = '900 88px sans-serif'; ctx.fillText(state.profile.name, 68, 255);
  ctx.fillStyle = '#8b8980'; ctx.font = '500 28px sans-serif'; ctx.fillText(`${state.profile.position} · ${POSITIONS[state.profile.position].name} · ${state.visited.length} 國生涯`, 72, 310);
  ctx.fillStyle = '#ff5a1f'; ctx.font = '900 280px sans-serif'; ctx.fillText(ending.grade, 62, 595);
  ctx.fillStyle = '#f1efe8'; ctx.font = '800 47px sans-serif'; ctx.fillText(ending.title, 72, 680);
  const labels = [['最終 OVR', overall()], ['冠軍', state.trophies], ['關鍵勝負', `${state.wins}–${state.losses}`], ['生涯收入', `${Math.round(state.income)} 萬`]];
  labels.forEach(([label, value], index) => {
    const x = 68 + (index % 2) * 480; const y = 790 + Math.floor(index / 2) * 155;
    ctx.strokeStyle = '#393934'; ctx.strokeRect(x, y, 440, 120);
    ctx.fillStyle = '#8b8980'; ctx.font = '600 22px sans-serif'; ctx.fillText(label, x + 22, y + 35);
    ctx.fillStyle = '#f1efe8'; ctx.font = '900 50px sans-serif'; ctx.fillText(String(value), x + 22, y + 91);
  });
  ctx.fillStyle = '#8b8980'; ctx.font = '500 22px sans-serif'; ctx.fillText('從國中開始。每一條路，都是你親手選的。', 68, 1235);
  ctx.fillStyle = '#dfff00'; ctx.fillRect(68, 1270, 944, 8);
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
    state = createState({ name, seed, hometown: $('#hometown').value, hand: $('#hand').value, position: selectedPosition, style: selectedStyle });
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

