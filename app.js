"use strict";

const STORAGE_KEY = "zero-ping-save-v1";
const META_KEY = "zero-ping-meta-v1";

const GAMES = {
  core: {
    id: "core",
    icon: "CORE//5",
    title: "CROWN//CORE",
    zh: "王冠核心",
    desc: "五對五戰略團戰。資源營運、角色搭配與終局核心爭奪。",
    matchUnit: "局",
    scene: ["河道視野爭奪", "核心先鋒團", "終局王冠會戰"]
  },
  breach: {
    id: "breach",
    icon: "BRCH//5",
    title: "BREACH//ZERO",
    zh: "零號突破",
    desc: "五對五戰術射擊。攻防輪替、裝備經濟與情報博弈。",
    matchUnit: "圖",
    scene: ["手槍局交鋒", "中盤經濟博弈", "決勝點攻防"]
  }
};

const ROLES = {
  ace: { id: "ace", code: "ACE", name: "王牌輸出", desc: "相信操作能打破所有劇本。", bonus: "操作 +10｜抗壓 +4", stats: { mechanics: 10, nerve: 4, comms: -3 } },
  igl: { id: "igl", code: "IGL", name: "戰術指揮", desc: "你看見的不是畫面，是勝負條件。", bonus: "意識 +9｜溝通 +8", stats: { sense: 9, comms: 8, mechanics: -4 } },
  flex: { id: "flex", code: "FLEX", name: "全能補位", desc: "陣容缺的最後一塊，永遠由你補上。", bonus: "溝通 +5｜體能 +5", stats: { comms: 5, stamina: 5, sense: 4 } },
  clutch: { id: "clutch", code: "CLTCH", name: "關鍵先生", desc: "時間越少、壓力越大，你越冷靜。", bonus: "抗壓 +10｜操作 +5", stats: { nerve: 10, mechanics: 5, stamina: -3 } }
};

const GOALS = {
  champion: { id: "champion", icon: "◈", name: "世界冠軍", desc: "贏得最終賽事，生涯至少 5 勝。" },
  icon: { id: "icon", icon: "✦", name: "時代門面", desc: "聲量 75、粉絲 15 萬，留下文化印記。" },
  brain: { id: "brain", icon: "⌁", name: "戰術革命", desc: "意識 80、溝通 72，改變比賽版本。" },
  brotherhood: { id: "brotherhood", icon: "∞", name: "五人之魂", desc: "團隊默契 82、士氣 70，與隊友共進退。" }
};

const STAT_INFO = {
  mechanics: { name: "操作", icon: "⌁" },
  sense: { name: "意識", icon: "◫" },
  comms: { name: "溝通", icon: "⌘" },
  nerve: { name: "抗壓", icon: "◇" },
  stamina: { name: "體能", icon: "△" },
  fame: { name: "聲量", icon: "◎" }
};

const SEASONS = [
  { year: 2032, age: 18, tier: "OPEN", title: "地下海選", subtitle: "北環第七網咖 · 64 強公開賽", opponent: "STATIC RAIN", oppCode: "SR", difficulty: 11, prize: 2 },
  { year: 2032, age: 18, tier: "CHALLENGER", title: "次級聯賽", subtitle: "泛亞挑戰者聯盟 · 春季賽", opponent: "GLASSWING", oppCode: "GW", difficulty: 12, prize: 5 },
  { year: 2033, age: 19, tier: "PRO", title: "職業初登板", subtitle: "Pacific Circuit · 常規賽", opponent: "IRON TIDE", oppCode: "IT", difficulty: 13, prize: 12 },
  { year: 2033, age: 19, tier: "MAJOR", title: "破圈之夜", subtitle: "黎明盃邀請賽 · 八強", opponent: "RED SHIFT", oppCode: "RS", difficulty: 14, prize: 22 },
  { year: 2034, age: 20, tier: "INTERNATIONAL", title: "跨區風暴", subtitle: "亞洲聯合大師賽 · 準決賽", opponent: "SEOUL PHANTOM", oppCode: "SP", difficulty: 15, prize: 40 },
  { year: 2034, age: 20, tier: "WORLD FINAL", title: "零延遲", subtitle: "HORIZON 世界總決賽", opponent: "MERIDIAN FIVE", oppCode: "M5", difficulty: 17, prize: 100 }
];

const TRAINING = [
  { id: "mechanics", icon: "⌁", name: "極限操作訓練", desc: "把失誤壓進毫秒以下。高報酬，也最快耗損身體。", effects: { mechanics: 3, stress: 6, health: -3 }, tags: ["操作 +3", "壓力 +6", "健康 -3"] },
  { id: "review", icon: "◫", name: "錄像與戰術複盤", desc: "把輸掉的每個瞬間，變成下一場的答案。", effects: { sense: 3, stress: 4 }, tags: ["意識 +3", "壓力 +4"] },
  { id: "scrim", icon: "⌘", name: "高強度團隊團練", desc: "磨合呼吸、口令與臨場判斷，建立五個人的節奏。", effects: { comms: 2, synergy: 7, stress: 5, morale: 2 }, tags: ["溝通 +2", "默契 +7", "壓力 +5"] },
  { id: "ranked", icon: "◇", name: "深夜天梯衝分", desc: "在陌生隊友與逆風局裡，鍛鍊真正的穩定性。", effects: { nerve: 3, fame: 1, fans: 450, stress: 7 }, tags: ["抗壓 +3", "聲量 +1", "壓力 +7"] },
  { id: "media", icon: "◎", name: "直播與品牌經營", desc: "職業不只在賽場。讓觀眾記得你的名字與故事。", effects: { fame: 3, fans: 1800, stress: 5, credits: 1 }, tags: ["聲量 +3", "粉絲 +1,800", "收入 +1"] },
  { id: "recover", icon: "＋", name: "運動科學恢復", desc: "關掉螢幕、鬆開握滑鼠的手。休息也是訓練。", effects: { health: 12, stress: -13, stamina: 1 }, tags: ["健康 +12", "壓力 -13", "體能 +1"] }
];

const EVENTS = [
  {
    tag: "THE INVITATION",
    title: "陌生帳號傳來的第五人邀請",
    body: "凌晨 02:17，一名叫 Rook 的退役選手私訊你。他正在組一支沒有贊助、沒有基地，甚至連隊名都還沒決定的隊伍。明天就是海選截止日。",
    choices: [
      { title: "立刻答應，今晚就加入團練", desc: "先相信彼此，再讓結果證明。", risk: "團隊路線", effects: { synergy: 12, stress: 7, comms: 2, flag: "rookTrust" } },
      { title: "要求先打一場試訓賽", desc: "信任很貴，你要先確認他們配得上。", risk: "D20 意識檢定", check: { stat: "sense", dc: 11, good: { sense: 3, synergy: 7 }, bad: { stress: 5, synergy: -3 } } },
      { title: "拒絕，繼續單排等待星探", desc: "一個人的履歷比較乾淨，也比較孤獨。", risk: "個人路線", effects: { fame: 3, fans: 800, synergy: -8, flag: "loneWolf" } }
    ]
  },
  {
    tag: "TEAM FRICTION",
    title: "隊內語音裡的第一道裂痕",
    body: "連敗後，隊友 Koi 當眾質疑 Rook 的指揮。語音頻道一片安靜，教練把決定權交給你：今晚的複盤，要談戰術，還是談人？",
    choices: [
      { title: "先讓每個人把話說完", desc: "輸贏要檢討，但人不能只剩數據。", risk: "溝通成長", effects: { comms: 4, synergy: 12, morale: 7, stress: 3 } },
      { title: "拿出數據，逐局釐清責任", desc: "把情緒關掉，問題才會露出形狀。", risk: "D20 溝通檢定", check: { stat: "comms", dc: 12, good: { sense: 4, synergy: 8 }, bad: { morale: -8, stress: 7 } } },
      { title: "不介入，專注把自己的數據打好", desc: "如果夠強，所有雜音最後都會閉嘴。", risk: "更衣室風險", effects: { mechanics: 3, synergy: -12, fame: 1, flag: "coldRoom" } }
    ]
  },
  {
    tag: "THE PATCH",
    title: "版本更新殺死了你的招牌打法",
    body: "聯盟在你職業初登板前一週發布大型更新。你苦練半年的核心體系被削弱，分析師建議整套重做；但觀眾正等著看你的成名絕技。",
    choices: [
      { title: "徹夜研究新版本，從零開始", desc: "不和版本爭論，成為版本本身。", risk: "高壓成長", effects: { sense: 5, stress: 12, health: -4 } },
      { title: "保留招牌，只調整關鍵細節", desc: "熟練度也是一種版本答案。", risk: "D20 操作檢定", check: { stat: "mechanics", dc: 13, good: { mechanics: 4, fame: 3, fans: 3000 }, bad: { stress: 8, reputation: -5 } } },
      { title: "把舞台讓給更適合版本的隊友", desc: "有時候，王牌的價值是知道何時不當王牌。", risk: "團隊大幅提升", effects: { synergy: 14, comms: 3, fame: -2, morale: 6, flag: "selfless" } }
    ]
  },
  {
    tag: "THE SPOTLIGHT",
    title: "一段失言剪輯衝上熱搜",
    body: "賽後直播中，你一句被截掉前後文的玩笑成了頭條。戰隊公關要你照稿道歉，粉絲則希望你直接開台反擊。每一分鐘，留言數都在上升。",
    choices: [
      { title: "照稿道歉，暫停直播一週", desc: "先讓風暴過去，別讓全隊陪你冒險。", risk: "穩健處理", effects: { reputation: 8, fame: -3, stress: -4, synergy: 4 } },
      { title: "直播說清完整脈絡", desc: "你願意承擔真話的所有後果。", risk: "D20 抗壓檢定", check: { stat: "nerve", dc: 14, good: { fame: 6, fans: 12000, reputation: 5 }, bad: { stress: 14, reputation: -12, fans: -2500 } } },
      { title: "把注意力導向下一場比賽", desc: "不解釋。所有回答都留在比分板上。", risk: "勝負加壓", effects: { nerve: 4, stress: 10, fame: 2, flag: "proveIt" } }
    ]
  },
  {
    tag: "CONTRACT WINDOW",
    title: "死敵送來三倍薪資的合約",
    body: "跨區賽前，豪門 MERIDIAN FIVE 提出三倍薪資與先發保證。他們是你下一場的潛在對手。Rook 沒有挽留，只說：『這是你的生涯。』",
    choices: [
      { title: "留下，和這群人打完未完的仗", desc: "有些價值，不會出現在合約數字裡。", risk: "忠誠路線", effects: { synergy: 16, morale: 10, reputation: 8, flag: "loyal" } },
      { title: "接受豪門合約，成為銀河戰艦一員", desc: "職業生涯很短，你不能永遠浪漫。", risk: "轉隊路線", effects: { credits: 25, fame: 5, synergy: -18, team: "MERIDIAN FIVE", teamCode: "M5", flag: "transfer" } },
      { title: "用報價要求母隊改善訓練資源", desc: "忠誠不是免費，信任也需要對等。", risk: "D20 溝通檢定", check: { stat: "comms", dc: 15, good: { credits: 10, stamina: 4, synergy: 6 }, bad: { synergy: -7, reputation: -4 } } }
    ]
  },
  {
    tag: "FINAL COMMS",
    title: "決賽前，教練要求換掉 Rook",
    body: "數據團隊認為 Rook 的打法已被對手讀透，臨時換指揮能提高紙面勝率。距離世界決賽只剩六小時。隊伍把最後一票交給你。",
    choices: [
      { title: "相信一路走來的團隊默契", desc: "不是最完美的五個人，卻是走到這裡的五個人。", risk: "默契決戰", effects: { synergy: 12, morale: 8, nerve: 3, flag: "finalTrust" } },
      { title: "接受數據建議，臨陣更換指揮", desc: "冠軍不獎勵感情，只獎勵正確答案。", risk: "戰術決戰", effects: { sense: 6, synergy: -15, stress: 7, flag: "dataFinal" } },
      { title: "提議雙指揮，自己接管關鍵回合", desc: "你願意把最重的決定背在自己身上。", risk: "D20 意識檢定", check: { stat: "sense", dc: 16, good: { sense: 4, comms: 5, synergy: 5 }, bad: { stress: 12, nerve: -4 } } }
    ]
  }
];

const STRATEGIES = [
  { id: "hands", name: "用操作撕開缺口", desc: "主動尋找對位突破，用上限逼迫對手犯錯。", statA: "mechanics", statB: "nerve", cost: { health: -3, stress: 5 }, tag: "操作＋抗壓" },
  { id: "read", name: "控制節奏與情報", desc: "放慢局勢，抓住資源差與輪轉時間。", statA: "sense", statB: "comms", cost: { stress: 3 }, tag: "意識＋溝通" },
  { id: "team", name: "相信隊友的連動", desc: "用默契補足個人極限，打出預先設計的配合。", statA: "comms", statB: "stamina", cost: { synergy: 2 }, tag: "溝通＋默契" },
  { id: "clutch", name: "拖入最後決勝", desc: "保存資源與精神，讓一切在最後十秒揭曉。", statA: "nerve", statB: "sense", cost: { stress: 7 }, tag: "抗壓＋意識" }
];

const ACHIEVEMENTS = [
  { id: "firstWin", name: "第一聲喝采", desc: "贏下生涯第一場系列賽。" },
  { id: "cleanSweep", name: "零封", desc: "以 2：0 贏下 BO3。" },
  { id: "reverseSweep", name: "逆轉訊號", desc: "先失一局後完成讓一追二。" },
  { id: "nat20", name: "神來一手", desc: "在檢定中擲出自然 20。" },
  { id: "nat1", name: "職業震撼教育", desc: "在檢定中擲出自然 1。" },
  { id: "ironMind", name: "鋼鐵心臟", desc: "抗壓能力達到 80。" },
  { id: "fiveAsOne", name: "五人一心", desc: "團隊默契達到 85。" },
  { id: "viral", name: "全網熱搜", desc: "累積 100,000 名粉絲。" },
  { id: "loyal", name: "不只是一紙合約", desc: "拒絕豪門報價，留在母隊。" },
  { id: "worlds", name: "地平線之巔", desc: "贏得 HORIZON 世界總決賽。" },
  { id: "goal", name: "我說到做到", desc: "完成開局選定的生涯目標。" },
  { id: "legend", name: "ZERO PING", desc: "以 S 級評價結束生涯。" }
];

const NAMES = ["林曜", "沈星宇", "陳以澈", "周若衡", "江行川", "顧安", "葉知秋", "夏沐恩", "許墨", "唐子晴"];
const HANDLES = ["Vanta", "Aster", "Kite", "Nox", "Mori", "Re:Zero", "Glint", "Echo7", "Lynx", "Serein"];

let setup = { name: "林曜", handle: "Vanta", game: "core", role: "ace", goal: "champion", seed: makeSeed() };
let state = null;
let audioEnabled = true;
let audioCtx = null;

const app = document.querySelector("#app");
const modal = document.querySelector("#modal");
const modalContent = document.querySelector("#modal-content");

function clamp(value, min = 0, max = 100) { return Math.max(min, Math.min(max, value)); }
function formatNum(value) { return Math.round(value).toLocaleString("zh-TW"); }
function makeSeed() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }
function hashString(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function seededValue(seed, counter) { let a = hashString(`${seed}:${counter}`); a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }
function roll(max = 20) { const value = Math.floor(seededValue(state.seed, state.rngCounter++) * max) + 1; saveGame(); return value; }

function beep(kind = "click") {
  if (!audioEnabled) return;
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const values = { click: [180, .025, .025], success: [520, .12, .055], fail: [92, .18, .05], roll: [260, .05, .03] }[kind];
    osc.type = kind === "fail" ? "sawtooth" : "square";
    osc.frequency.value = values[0];
    gain.gain.setValueAtTime(values[2], audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + values[1]);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + values[1]);
  } catch (_) { /* audio is optional */ }
}

function defaultMeta() { return { unlocked: [], careers: 0, bestRank: "—" }; }
function getMeta() { try { return { ...defaultMeta(), ...JSON.parse(localStorage.getItem(META_KEY)) }; } catch (_) { return defaultMeta(); } }
function saveMeta(meta) { localStorage.setItem(META_KEY, JSON.stringify(meta)); updateHallCount(); }
function unlock(id) {
  const meta = getMeta();
  if (meta.unlocked.includes(id)) return;
  meta.unlocked.push(id); saveMeta(meta);
  const achievement = ACHIEVEMENTS.find(a => a.id === id);
  toast(`成就解鎖｜<b>${achievement.name}</b>`);
}

function updateHallCount() { document.querySelector("#hall-count").textContent = `${getMeta().unlocked.length}/${ACHIEVEMENTS.length}`; }
function saveGame() { if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadGame() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (_) { return null; } }
function clearGame() { localStorage.removeItem(STORAGE_KEY); }

function toast(message) {
  const el = document.createElement("div"); el.className = "toast"; el.innerHTML = message;
  document.querySelector("#toast-region").appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function potentialFromSeed(seed) {
  const stats = {};
  Object.keys(STAT_INFO).forEach((key, i) => stats[key] = 76 + Math.floor(seededValue(seed, 100 + i) * 20));
  return stats;
}

function createState() {
  const base = { mechanics: 42, sense: 40, comms: 38, nerve: 39, stamina: 43, fame: 22 };
  Object.entries(ROLES[setup.role].stats).forEach(([key, val]) => base[key] += val);
  return {
    version: 1,
    name: setup.name.trim() || "林曜",
    handle: (setup.handle.trim() || "Vanta").replace(/^@/, ""),
    game: setup.game,
    role: setup.role,
    goal: setup.goal,
    seed: (setup.seed.trim() || makeSeed()).toUpperCase(),
    rngCounter: 0,
    season: 0,
    phase: "prep",
    ap: 3,
    stats: base,
    caps: potentialFromSeed(setup.seed),
    health: 88,
    stress: 14,
    synergy: 42,
    morale: 55,
    fans: 240,
    credits: 0,
    reputation: 50,
    team: "NEON FOX",
    teamCode: "NF",
    match: null,
    eventResult: null,
    flags: {},
    wins: 0,
    losses: 0,
    trophies: 0,
    log: [{ year: 2032, title: "選手註冊", text: `以 @${setup.handle || "Vanta"} 之名，進入 ${GAMES[setup.game].title} 職業賽道。` }]
  };
}

function renderStart() {
  state = null;
  const existing = loadGame();
  app.innerHTML = `
    <section class="start-layout">
      <div class="hero-panel">
        <div class="scan-art"></div>
        <div class="hero-copy">
          <div class="eyebrow">Esports career tabletop RPG · 2032</div>
          <h1>ZERO<br><span>PING</span></h1>
          <p class="lead">從網咖海選到世界決賽。<br>你要成為最強的選手，還是最難忘的隊友？</p>
        </div>
        <div class="hero-quote"><b>「天賦決定你能多快抵達，選擇決定抵達的人還是不是你。」</b>— 退役指揮 Rook</div>
      </div>
      <div class="setup-panel">
        <div class="setup-head">
          <div><div class="section-label">Player registration</div><h2>建立你的選手檔案</h2></div>
          <div class="step-count">CAREER // 01</div>
        </div>

        <div class="identity-grid">
          <label><span class="field-label">真實姓名</span><span class="input-wrap"><input id="player-name" maxlength="12" value="${escapeHtml(setup.name)}" autocomplete="off"><button class="randomize" id="random-name" title="隨機姓名">↻</button></span></label>
          <label><span class="field-label">選手 ID</span><span class="input-wrap"><input id="player-handle" maxlength="12" value="${escapeHtml(setup.handle)}" autocomplete="off"><button class="randomize" id="random-handle" title="隨機 ID">↻</button></span></label>
        </div>

        <div class="setup-section">
          <span class="field-label">選擇主戰項目</span>
          <div class="choice-grid two" id="game-choices">
            ${Object.values(GAMES).map(g => `<button class="choice-card ${setup.game === g.id ? "selected" : ""}" data-game="${g.id}"><span class="choice-icon">${g.icon}</span><b>${g.title}｜${g.zh}</b><small>${g.desc}</small></button>`).join("")}
          </div>
        </div>

        <div class="setup-section">
          <span class="field-label">選手原型</span>
          <div class="choice-grid four" id="role-choices">
            ${Object.values(ROLES).map(r => `<button class="choice-card ${setup.role === r.id ? "selected" : ""}" data-role="${r.id}"><span class="choice-icon">${r.code}</span><b>${r.name}</b><small>${r.desc}</small><small class="bonus">${r.bonus}</small></button>`).join("")}
          </div>
        </div>

        <div class="setup-section">
          <span class="field-label">生涯目標</span>
          <div class="goal-row" id="goal-choices">
            ${Object.values(GOALS).map(g => `<button class="choice-card goal-card ${setup.goal === g.id ? "selected" : ""}" data-goal="${g.id}"><span class="choice-icon">${g.icon} ${g.name}</span><small>${g.desc}</small></button>`).join("")}
          </div>
        </div>

        <div class="setup-section">
          <span class="field-label">世界種子碼</span>
          <div class="seed-row"><div class="input-wrap"><input id="world-seed" maxlength="10" value="${escapeHtml(setup.seed)}" autocomplete="off"></div><button class="seed-refresh" id="random-seed">換一個</button></div>
          <p class="microcopy">相同種子＋相同選擇＝相同職業生涯。種子同時決定六維潛力上限與每次檢定結果。</p>
        </div>

        <button class="primary-button" id="start-game">簽下第一份選手登錄表 <span>ENTER ↵</span></button>
        ${existing ? `<button class="primary-button continue-save" id="continue-game">繼續 @${escapeHtml(existing.handle)} 的生涯 <span>${SEASONS[existing.season]?.tier || "FINAL"}</span></button>` : ""}
      </div>
    </section>`;
  bindStart(); updateHallCount();
  window.scrollTo({ top: 0 });
}

function bindStart() {
  const sync = () => {
    setup.name = document.querySelector("#player-name").value;
    setup.handle = document.querySelector("#player-handle").value;
    setup.seed = document.querySelector("#world-seed").value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  };
  document.querySelector("#random-name").onclick = e => { e.preventDefault(); document.querySelector("#player-name").value = NAMES[Math.floor(Math.random() * NAMES.length)]; sync(); beep(); };
  document.querySelector("#random-handle").onclick = e => { e.preventDefault(); document.querySelector("#player-handle").value = HANDLES[Math.floor(Math.random() * HANDLES.length)]; sync(); beep(); };
  document.querySelector("#random-seed").onclick = () => { setup.seed = makeSeed(); document.querySelector("#world-seed").value = setup.seed; beep(); };
  document.querySelectorAll("[data-game]").forEach(btn => btn.onclick = () => { setup.game = btn.dataset.game; document.querySelectorAll("[data-game]").forEach(b => b.classList.toggle("selected", b === btn)); beep(); });
  document.querySelectorAll("[data-role]").forEach(btn => btn.onclick = () => { setup.role = btn.dataset.role; document.querySelectorAll("[data-role]").forEach(b => b.classList.toggle("selected", b === btn)); beep(); });
  document.querySelectorAll("[data-goal]").forEach(btn => btn.onclick = () => { setup.goal = btn.dataset.goal; document.querySelectorAll("[data-goal]").forEach(b => b.classList.toggle("selected", b === btn)); beep(); });
  document.querySelector("#start-game").onclick = () => {
    sync();
    if (!setup.name.trim() || !setup.handle.trim()) return toast("請先填入姓名與選手 ID。");
    if (setup.seed.length < 4) return toast("世界種子至少需要 4 個英數字元。");
    state = createState(); saveGame(); beep("success"); renderGame();
  };
  document.querySelector("#continue-game")?.addEventListener("click", () => { state = loadGame(); beep("success"); renderGame(); });
}

function escapeHtml(value = "") { const d = document.createElement("div"); d.textContent = value; return d.innerHTML; }

function applyEffects(effects = {}) {
  const statKeys = Object.keys(STAT_INFO);
  Object.entries(effects).forEach(([key, raw]) => {
    if (["flag", "team", "teamCode"].includes(key)) return;
    if (statKeys.includes(key)) state.stats[key] = clamp(state.stats[key] + raw, 1, state.caps[key]);
    else if (key === "fans") state.fans = Math.max(0, state.fans + raw);
    else if (key === "credits") state.credits = Math.max(0, state.credits + raw);
    else if (key === "reputation") state.reputation = clamp(state.reputation + raw);
    else if (["health", "stress", "synergy", "morale"].includes(key)) state[key] = clamp(state[key] + raw);
  });
  if (effects.flag) state.flags[effects.flag] = true;
  if (effects.team) state.team = effects.team;
  if (effects.teamCode) state.teamCode = effects.teamCode;
  checkPassiveAchievements();
}

function checkPassiveAchievements() {
  if (state.stats.nerve >= 80) unlock("ironMind");
  if (state.synergy >= 85) unlock("fiveAsOne");
  if (state.fans >= 100000) unlock("viral");
  if (state.flags.loyal) unlock("loyal");
}

function getOVR() {
  const values = Object.values(state.stats);
  return Math.round(values.reduce((a,b) => a+b, 0) / values.length);
}

function renderGame() {
  if (!state) return renderStart();
  if (state.phase === "ending") return renderEnding();
  const season = SEASONS[state.season];
  app.innerHTML = `<div class="game-shell">
    ${careerHeader(season)}
    ${phaseTrack()}
    <div class="game-grid">
      <section class="stage-card" id="stage">${renderStage()}</section>
      <aside class="side-stack">${renderSide()}</aside>
    </div>
  </div>`;
  bindGame(); updateHallCount();
  window.scrollTo({ top: 0 });
}

function careerHeader(season) {
  return `<header class="career-header">
    <div class="player-id"><div class="avatar">${escapeHtml(state.handle.slice(0,2).toUpperCase())}</div><div class="player-copy"><div class="handle">@${escapeHtml(state.handle)} · ${ROLES[state.role].code}</div><h2>${escapeHtml(state.name)}</h2><p>${state.team}｜${GAMES[state.game].title}</p></div></div>
    <div class="career-meta">
      <div class="meta-block"><b>${season.age}</b><small>AGE</small></div>
      <div class="meta-block"><b>${season.year}</b><small>SEASON</small></div>
      <div class="meta-block"><b>${getOVR()}</b><small>OVR</small></div>
    </div>
    <div class="header-actions"><button class="icon-button" id="save-info" title="存檔狀態">✓</button><button class="icon-button" id="career-menu" title="生涯選單">⋯</button></div>
  </header>`;
}

function phaseTrack() {
  const order = ["prep", "event", "match"];
  const current = state.phase === "eventResult" ? 1 : state.phase === "matchResult" ? 2 : order.indexOf(state.phase);
  return `<div class="phase-track">${["季初 · 訓練規劃", "賽季中 · 隊內事件", "季末 · BO3 賽事"].map((name, i) => `<div class="phase-step ${i < current ? "done" : i === current ? "active" : ""}"><span>0${i+1}</span>${name}</div>`).join("")}</div>`;
}

function stageHero(label, title, description, watermark = "ZP") {
  return `<div class="stage-hero" data-watermark="${watermark}"><div class="section-label">${label}</div><h1>${title}</h1><p>${description}</p></div>`;
}

function renderStage() {
  const season = SEASONS[state.season];
  if (state.phase === "prep") return renderPrep(season);
  if (state.phase === "event") return renderEvent(season);
  if (state.phase === "eventResult") return renderEventResult(season);
  if (state.phase === "match" || state.phase === "matchResult") return renderMatch(season);
  return "";
}

function renderPrep(season) {
  return `${stageHero(`${season.tier} · ${season.subtitle}`, season.title, `賽季開始前，你有 ${state.ap} 點行動點。能力會成長，身體與壓力也會記住每一次選擇。`, "TRAIN")}
    <div class="stage-body">
      <div class="resource-strip"><span class="resource-chip highlight"><b>${state.ap}</b> 行動點</span><span class="resource-chip">潛力上限已由種子 <b>${state.seed}</b> 決定</span><span class="resource-chip">自動存檔 <b>ON</b></span></div>
      <div class="action-grid">${TRAINING.map(action => `<button class="action-card" data-training="${action.id}" ${state.ap <= 0 ? "disabled" : ""}>
        <div class="action-top"><span class="action-icon">${action.icon}</span><span class="ap-cost">−1 AP</span></div><h3>${action.name}</h3><p>${action.desc}</p>
        <div class="effects">${action.tags.map(t => `<span class="${t.includes("壓力 +") || t.includes("健康 -") ? "negative" : ""}">${t}</span>`).join("")}</div>
      </button>`).join("")}</div>
      <button class="advance-button" id="to-event">${state.ap > 0 ? `保留 ${state.ap} AP 並進入賽季事件` : "訓練完成，進入賽季事件"} ▸</button>
    </div>`;
}

function renderEvent(season) {
  const event = EVENTS[state.season];
  return `${stageHero(`${season.tier} · STORY EVENT`, "更衣室之外，也是一場比賽", "每個選擇都會改變能力、人際關係與生涯路線。帶有 D20 的選項會依能力進行公開檢定。", "STORY")}
    <div class="stage-body"><article class="event-card"><div class="event-kicker">${event.tag}</div><h2>${event.title}</h2><p>${event.body}</p><div class="event-choices">
      ${event.choices.map((choice, i) => `<button class="event-choice" data-choice="${i}"><span class="choice-letter">${String.fromCharCode(65+i)}</span><span><b>${choice.title}</b><small>${choice.desc}</small></span><span class="risk-tag">${choice.risk}</span></button>`).join("")}
    </div></article></div>`;
}

function renderEventResult(season) {
  const r = state.eventResult;
  return `${stageHero(`${season.tier} · CONSEQUENCE`, "選擇已寫入生涯", "職業選手沒有讀檔鍵。你只能帶著結果，走向下一場比賽。", "RESULT")}
    <div class="stage-body"><div class="result-panel ${r.success === true ? "success" : r.success === false ? "failure" : ""}">
      <div class="event-kicker">${r.checkText || "NARRATIVE CHOICE"}</div><h2>${r.title}</h2><p>${r.text}</p>
      <div class="effects">${r.effectsText.map(t => `<span>${t}</span>`).join("")}</div>
    </div><button class="advance-button" id="to-match">前往 ${season.subtitle} ▸</button></div>`;
}

function initMatch() {
  state.match = { player: 0, opponent: 0, map: 0, history: [], pending: null };
  state.phase = "match"; saveGame();
}

function currentOpponent(season) {
  if (state.team === "MERIDIAN FIVE" && state.season === SEASONS.length - 1) {
    return { name: "NEON FOX", code: "NF" };
  }
  return { name: season.opponent, code: season.oppCode };
}

function renderMatch(season) {
  const game = GAMES[state.game];
  const m = state.match;
  const opponent = currentOpponent(season);
  const inResult = state.phase === "matchResult";
  const seriesOver = m.player === 2 || m.opponent === 2;
  return `${stageHero(`${season.tier} · BEST OF THREE`, season.subtitle, `${game.title}｜${game.scene[Math.min(m.map,2)]}。擲出 D20，將你的能力、團隊狀態與策略化成勝負。`, "MATCH")}
    <div class="match-stage">
      <div class="versus"><div class="team-block"><div><div class="team-logo"><span>${state.teamCode}</span></div><b>${state.team}</b><small>OVR ${getOVR()} · SYNC ${Math.round(state.synergy)}</small></div></div><div class="vs-mark">VS</div><div class="team-block away"><div><div class="team-logo"><span>${opponent.code}</span></div><b>${opponent.name}</b><small>DIFFICULTY ${season.difficulty}+</small></div></div></div>
      <div class="series-score">${[0,1,2].map((_, i) => `<span class="score-pip ${m.history[i] ? (m.history[i].win ? "win" : "loss") : ""}"></span>`).join("")}</div>
      ${inResult ? renderMapResult(season) : seriesOver ? renderSeriesResult(season) : renderStrategies(season)}
    </div>`;
}

function renderStrategies(season) {
  const m = state.match;
  return `<div class="match-brief"><div class="section-label">${GAMES[state.game].matchUnit} ${m.map + 1} · SCORE ${m.player}:${m.opponent}</div><h2>選擇這一${GAMES[state.game].matchUnit}的打法</h2><p>檢定公式：D20＋主能力修正＋副能力修正＋團隊狀態。健康過低或壓力過高會扣除修正。</p></div>
    <div class="strategy-grid">${STRATEGIES.map(s => `<button class="strategy-card" data-strategy="${s.id}"><b>${s.name}</b><p>${s.desc}</p><span>${s.tag}｜DC ${season.difficulty + m.map}</span></button>`).join("")}</div>`;
}

function renderMapResult() {
  const p = state.match.pending;
  return `<div class="dice-scene"><div class="d20">${p.roll}</div><div class="check-math">D20 <b>${p.roll}</b> ＋ 能力 ${p.statMod >= 0 ? "+" : ""}${p.statMod} ＋ 團隊 ${p.teamMod >= 0 ? "+" : ""}${p.teamMod} ${p.conditionMod ? `＋ 狀態 ${p.conditionMod}` : ""} ＝ <b>${p.total}</b> ／ DC ${p.dc}</div><h2 class="outcome-title ${p.win ? "win" : "loss"}">${p.win ? "回合掌握｜TAKE THE MAP" : "戰術失效｜MAP LOST"}</h2><p class="match-brief">${p.flavor}</p><button class="advance-button" id="next-map">${state.match.player === 2 || state.match.opponent === 2 ? "查看系列賽結果" : `進入下一${GAMES[state.game].matchUnit}`} ▸</button></div>`;
}

function renderSeriesResult(season) {
  const won = state.match.player === 2;
  const opponent = currentOpponent(season);
  return `<div class="dice-scene"><div class="section-label">SERIES COMPLETE</div><h2 class="outcome-title ${won ? "win" : "loss"}">${won ? `${state.match.player} : ${state.match.opponent}｜系列賽勝利` : `${state.match.player} : ${state.match.opponent}｜系列賽落敗`}</h2><p class="match-brief">${won ? `你們擊敗了 ${opponent.name}。鏡頭、掌聲與下一張門票同時朝你湧來。` : `${opponent.name} 在最後關頭守住勝利。輸掉的不是生涯，只是下一段故事的起點。`}</p><button class="advance-button" id="finish-season">${state.season === SEASONS.length - 1 ? "寫下職業生涯結局" : "結算賽季，前往下一章"} ▸</button></div>`;
}

function renderSide() {
  return `${conditionCard()}${statsCard()}${careerCard()}${timelineCard()}`;
}

function conditionCard() {
  return `<section class="side-card"><div class="side-card-title"><h3>身心狀態</h3><small>LIVE STATUS</small></div>
    ${meterRow("健康", state.health, "health")}${meterRow("壓力", state.stress, "stress")}${meterRow("團隊默契", state.synergy, "synergy")}${meterRow("隊伍士氣", state.morale, "")}
  </section>`;
}
function meterRow(name, value, cls) { return `<div class="meter-row"><div class="meter-head"><span>${name}</span><b>${Math.round(value)}</b></div><div class="meter ${cls}"><i style="width:${clamp(value)}%"></i></div></div>`; }

function statsCard() {
  return `<section class="side-card"><div class="side-card-title"><h3>六維能力</h3><small>CAP REVEALED</small></div><div class="stat-grid">${Object.entries(STAT_INFO).map(([key, info]) => `<div class="stat-cell ${state.stats[key] >= state.caps[key] ? "capped" : ""}"><small>${info.icon} ${info.name}</small><div><b>${Math.round(state.stats[key])}</b><em>/ ${state.caps[key]}</em></div></div>`).join("")}</div></section>`;
}

function careerCard() {
  const goal = GOALS[state.goal];
  return `<section class="side-card"><div class="side-card-title"><h3>生涯目標</h3><small>${state.seed}</small></div><div class="objective"><b>${goal.icon} ${goal.name}</b><p>${goal.desc}</p></div><div class="record-row"><div class="record-cell"><b>${state.wins}</b><small>勝場</small></div><div class="record-cell"><b>${formatNum(state.fans)}</b><small>粉絲</small></div><div class="record-cell"><b>${state.credits}萬</b><small>收入</small></div></div></section>`;
}

function timelineCard() {
  return `<section class="side-card"><div class="side-card-title"><h3>生涯紀錄</h3><small>RECENT</small></div><div class="timeline">${state.log.slice(-3).reverse().map((l,i) => `<div class="timeline-item ${i === 0 ? "latest" : ""}"><b>${l.year} · ${l.title}</b>${l.text}</div>`).join("")}</div></section>`;
}

function bindGame() {
  document.querySelectorAll("[data-training]").forEach(btn => btn.onclick = () => doTraining(btn.dataset.training));
  document.querySelector("#to-event")?.addEventListener("click", () => { state.phase = "event"; state.ap = 0; saveGame(); beep(); renderGame(); });
  document.querySelectorAll("[data-choice]").forEach(btn => btn.onclick = () => chooseEvent(Number(btn.dataset.choice)));
  document.querySelector("#to-match")?.addEventListener("click", () => { initMatch(); beep(); renderGame(); });
  document.querySelectorAll("[data-strategy]").forEach(btn => btn.onclick = () => performCheck(btn.dataset.strategy));
  document.querySelector("#next-map")?.addEventListener("click", () => { state.match.pending = null; state.phase = "match"; saveGame(); beep(); renderGame(); });
  document.querySelector("#finish-season")?.addEventListener("click", finishSeason);
  document.querySelector("#save-info")?.addEventListener("click", () => toast("<b>已自動存檔</b>｜每次選擇後都會保存進度。"));
  document.querySelector("#career-menu")?.addEventListener("click", openCareerMenu);
}

function doTraining(id) {
  if (state.ap <= 0) return;
  const action = TRAINING.find(a => a.id === id);
  applyEffects(action.effects); state.ap--;
  state.log.push({ year: SEASONS[state.season].year, title: action.name, text: action.tags.join("、") });
  saveGame(); beep("click"); renderGame();
}

function effectSummary(effects) {
  const names = { health: "健康", stress: "壓力", synergy: "默契", morale: "士氣", fans: "粉絲", credits: "收入", reputation: "口碑" };
  return Object.entries(effects).filter(([k]) => !["flag","team","teamCode"].includes(k)).map(([k,v]) => `${STAT_INFO[k]?.name || names[k]} ${v >= 0 ? "+" : ""}${formatNum(v)}${k === "credits" ? "萬" : ""}`);
}

function chooseEvent(index) {
  const event = EVENTS[state.season]; const choice = event.choices[index];
  let effects, success = null, checkText = "";
  if (choice.check) {
    const r = roll(20); const mod = Math.floor((state.stats[choice.check.stat] - 40) / 8); const total = r + mod;
    success = r === 20 || (r !== 1 && total >= choice.check.dc);
    effects = success ? choice.check.good : choice.check.bad;
    checkText = `D20 ${r} ${mod >= 0 ? "+" : ""}${mod} ＝ ${total} ／ DC ${choice.check.dc} · ${success ? "成功" : "失敗"}`;
    if (r === 20) unlock("nat20"); if (r === 1) unlock("nat1");
  } else effects = choice.effects;
  applyEffects(effects);
  const flavor = success === null ? "你的決定沒有標準答案，但所有人都會記得你在這一刻站在哪一邊。" : success ? "你穩穩接住了場面。這次冒險成了隊伍向前的推力。" : "局勢沒有照計畫發展。職業賽場不會溫柔，但你仍得帶著代價前進。";
  state.eventResult = { title: choice.title, text: flavor, success, checkText, effectsText: effectSummary(effects) };
  state.log.push({ year: SEASONS[state.season].year, title: event.title, text: choice.title });
  state.phase = "eventResult"; saveGame(); beep(success === false ? "fail" : "success"); renderGame();
}

function performCheck(strategyId) {
  const strategy = STRATEGIES.find(s => s.id === strategyId);
  const season = SEASONS[state.season]; const m = state.match;
  applyEffects(strategy.cost);
  const r = roll(20);
  const statMod = Math.floor((state.stats[strategy.statA] - 40) / 9) + Math.floor((state.stats[strategy.statB] - 40) / 12);
  const teamBase = strategy.id === "team" ? state.synergy : (state.synergy + state.morale) / 2;
  const teamMod = Math.floor((teamBase - 45) / 18);
  const conditionMod = (state.health < 35 ? -2 : state.health < 55 ? -1 : 0) + (state.stress > 85 ? -3 : state.stress > 65 ? -1 : 0);
  const dc = season.difficulty + m.map;
  const total = r + statMod + teamMod + conditionMod;
  const win = r === 20 || (r !== 1 && total >= dc);
  if (win) m.player++; else m.opponent++;
  const flavor = win ? (r === 20 ? "不可思議的極限處理！轉播席幾乎喊破了聲音。" : "策略被完整執行，隊伍在關鍵資源上取得決定性領先。") : (r === 1 ? "災難性的溝通斷線，最簡單的局面在眼前瓦解。" : "對手讀到了你們的意圖，反制比預期快了一拍。");
  m.history.push({ win, roll: r, strategy: strategyId });
  m.pending = { roll: r, statMod, teamMod, conditionMod, total, dc, win, flavor };
  m.map++;
  state.phase = "matchResult";
  if (r === 20) unlock("nat20"); if (r === 1) unlock("nat1");
  saveGame(); beep("roll");
  renderGame();
}

function finishSeason() {
  const season = SEASONS[state.season]; const won = state.match.player === 2; const opponent = currentOpponent(season);
  if (won) {
    state.wins++; state.credits += season.prize; state.fans += 1500 * (state.season + 1); state.reputation = clamp(state.reputation + 6); state.morale = clamp(state.morale + 8); unlock("firstWin");
    if (state.match.opponent === 0) unlock("cleanSweep");
    if (state.match.history[0] && !state.match.history[0].win && state.match.player === 2) unlock("reverseSweep");
    if (state.season >= 3) state.trophies++;
  } else {
    state.losses++; state.stress = clamp(state.stress + 8); state.morale = clamp(state.morale - 7); state.reputation = clamp(state.reputation - 3);
  }
  state.log.push({ year: season.year, title: `${season.subtitle} ${won ? "勝利" : "落敗"}`, text: `${state.match.player}：${state.match.opponent} ${won ? "擊敗" : "不敵"} ${opponent.name}` });
  if (state.season === SEASONS.length - 1) {
    if (won) unlock("worlds");
    state.phase = "ending"; clearGame(); concludeCareer(); beep(won ? "success" : "fail"); return renderEnding();
  }
  state.season++;
  state.phase = "prep";
  state.match = null;
  state.eventResult = null;
  state.ap = 3 + (state.health >= 75 && state.stress <= 40 ? 1 : 0);
  state.health = clamp(state.health + 5);
  state.stress = clamp(state.stress - 7);
  saveGame(); beep("success"); renderGame();
}

function goalComplete() {
  if (state.goal === "champion") return state.flags.worldChampion && state.wins >= 5;
  if (state.goal === "icon") return state.stats.fame >= 75 && state.fans >= 150000;
  if (state.goal === "brain") return state.stats.sense >= 80 && state.stats.comms >= 72;
  if (state.goal === "brotherhood") return state.synergy >= 82 && state.morale >= 70;
  return false;
}

function endingRank() {
  let score = state.wins * 9 + state.trophies * 8 + getOVR() * .45 + state.reputation * .12 + Math.min(12, state.fans / 12000);
  if (state.flags.worldChampion) score += 25;
  if (goalComplete()) score += 15;
  if (state.health < 30) score -= 8;
  if (score >= 104) return "S";
  if (score >= 86) return "A";
  if (score >= 67) return "B";
  return "C";
}

function concludeCareer() {
  state.flags.worldChampion = state.match?.player === 2;
  if (goalComplete()) unlock("goal");
  const rank = endingRank(); if (rank === "S") unlock("legend");
  const meta = getMeta(); meta.careers++;
  const ranks = ["—","C","B","A","S"]; if (ranks.indexOf(rank) > ranks.indexOf(meta.bestRank)) meta.bestRank = rank;
  saveMeta(meta);
}

function renderEnding() {
  const rank = endingRank(); const champion = state.flags.worldChampion; const complete = goalComplete();
  const title = champion ? "世界聽見你的名字" : state.wins >= 4 ? "離王座只差最後一步" : "聚光燈熄滅之後";
  const lead = champion ? `金色紙花落在你的鍵盤上。@${state.handle} 與 ${state.team} 把 HORIZON 獎盃留在了 2034 年的夜裡。有人記得你的操作，也有人只記得你賽後擁抱隊友的那一幕。` : `你沒有捧起最後的獎盃，但這段生涯從來不只是一張比分表。@${state.handle} 的每次選擇，都已成為下一代選手談論的故事。`;
  app.innerHTML = `<section class="ending-screen"><div class="section-label">CAREER COMPLETE · ${state.seed}</div><div class="rank-seal"><b>${rank}</b></div><h1>${title}</h1><p class="ending-lead">${lead}</p>
    <div class="ending-stats"><div class="ending-stat"><b>${state.wins}-${state.losses}</b><small>系列賽戰績</small></div><div class="ending-stat"><b>${getOVR()}</b><small>最終 OVR</small></div><div class="ending-stat"><b>${formatNum(state.fans)}</b><small>生涯粉絲</small></div><div class="ending-stat"><b>${state.credits}萬</b><small>生涯收入</small></div><div class="ending-stat"><b>${complete ? "達成" : "未達"}</b><small>${GOALS[state.goal].name}</small></div></div>
    <div class="ending-actions"><button class="primary-button" id="new-career">開啟新生涯</button><button class="secondary-button" id="show-recap">查看生涯年表</button></div></section>`;
  document.querySelector("#new-career").onclick = () => { setup.seed = makeSeed(); renderStart(); };
  document.querySelector("#show-recap").onclick = showRecap;
  updateHallCount(); window.scrollTo({ top: 0 });
}

function openCareerMenu() {
  modalContent.innerHTML = `<div class="section-label">CAREER MENU</div><h2>@${escapeHtml(state.handle)} 的生涯</h2><p class="modal-intro">進度已自動保存在這台裝置。你可以查看年表，或結束本輪重新開局。</p><div class="rules-grid"><button class="secondary-button" id="menu-recap">查看生涯年表</button><button class="secondary-button" id="menu-restart">清除存檔並重開</button></div>`;
  modal.showModal();
  document.querySelector("#menu-recap").onclick = showRecap;
  document.querySelector("#menu-restart").onclick = () => { if (confirm("確定要清除目前生涯嗎？此操作無法復原。")) { clearGame(); modal.close(); setup.seed = makeSeed(); renderStart(); } };
}

function showRecap() {
  modalContent.innerHTML = `<div class="section-label">CAREER TIMELINE</div><h2>@${escapeHtml(state.handle)} 生涯年表</h2><p class="modal-intro">${GAMES[state.game].title}｜${ROLES[state.role].name}｜世界種子 ${state.seed}</p><div class="timeline">${state.log.slice().reverse().map((l,i) => `<div class="timeline-item ${i===0?"latest":""}"><b>${l.year} · ${escapeHtml(l.title)}</b>${escapeHtml(l.text)}</div>`).join("")}</div>`;
  if (!modal.open) modal.showModal();
}

function showRules() {
  modalContent.innerHTML = `<div class="section-label">HOW TO PLAY</div><h2>三分鐘上手</h2><p class="modal-intro">《ZERO PING》是一款以選擇與 D20 檢定推進的電競生涯 TRPG。全程約 15–25 分鐘，系統會在每次決策後自動存檔。</p><div class="rules-grid">
    <div class="rule-card"><b>01｜季初訓練</b><p>每季有 3 AP；身心俱佳時會獎勵 1 AP。能力越高越容易通過比賽檢定，但不能超過潛力上限。</p></div>
    <div class="rule-card"><b>02｜隊內事件</b><p>有些選擇直接改變狀態，有些會擲 D20。自然 20 必定成功，自然 1 必定失敗。</p></div>
    <div class="rule-card"><b>03｜BO3 比賽</b><p>每局選一種策略。D20 加上相關能力與團隊修正，達到對手 DC 即獲勝，先取兩局者勝。</p></div>
    <div class="rule-card"><b>04｜多重結局</b><p>世界冠軍不是唯一答案。生涯目標、隊友關係、聲量、健康與重要選擇都會影響最終評級。</p></div>
  </div>`; modal.showModal();
}

function showHall() {
  const meta = getMeta();
  modalContent.innerHTML = `<div class="section-label">ACHIEVEMENT HALL</div><h2>成就殿堂 · ${meta.unlocked.length}/${ACHIEVEMENTS.length}</h2><p class="modal-intro">已完成 ${meta.careers} 段生涯｜最佳評級 ${meta.bestRank}</p><div class="achievement-grid">${ACHIEVEMENTS.map(a => `<div class="achievement ${meta.unlocked.includes(a.id) ? "unlocked" : ""}"><b>${meta.unlocked.includes(a.id) ? "◆" : "◇"} ${a.name}</b><small>${a.desc}</small></div>`).join("")}</div>`; modal.showModal();
}

document.querySelector("#modal-close").onclick = () => modal.close();
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });
document.querySelector("#how-to-button").onclick = showRules;
document.querySelector("#hall-button").onclick = showHall;
document.querySelector("#audio-button").onclick = () => { audioEnabled = !audioEnabled; document.querySelector("#audio-button").classList.toggle("audio-off", !audioEnabled); beep(); };
document.querySelector("#brand-home").onclick = e => { e.preventDefault(); if (!state || confirm("回到首頁？目前進度已自動保存。")) renderStart(); };

renderStart();

