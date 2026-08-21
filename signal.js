"use strict";

const SAVE_KEY = "zero-ping-signal-chain-v1";

const ARCHETYPES = {
  spark: { name: "破口手", code: "F01", stats: { mechanics: 49, read: 37, link: 35, nerve: 41 } },
  oracle: { name: "讀局者", code: "R02", stats: { mechanics: 38, read: 49, link: 42, nerve: 40 } },
  anchor: { name: "連結者", code: "L03", stats: { mechanics: 39, read: 42, link: 49, nerve: 45 } }
};

const STAT_INFO = {
  mechanics: { name: "操作", icon: "⌁" },
  read: { name: "判讀", icon: "◫" },
  link: { name: "連動", icon: "⌘" },
  nerve: { name: "心態", icon: "◇" }
};

const SIGNAL_INFO = {
  force: { code: "FORCE", name: "強攻訊號", stat: "mechanics" },
  read: { code: "READ", name: "讀局訊號", stat: "read" },
  link: { code: "LINK", name: "連結訊號", stat: "link" }
};

const PERFECT_PREVIOUS = { force: "link", read: "force", link: "read" };

const SCENES = [
  {
    short: "TRY", stage: "01 · OPEN TRYOUT", title: "最後一個青訓席位", dc: 7,
    body: "公開試訓只剩一場。教練沒有要你交出漂亮數據，而是想知道隊伍陷入混亂時，你會發出什麼訊號。",
    actions: [
      { id: "force", title: "搶下對位主導權", desc: "用操作逼對手先交關鍵資源。", gain: 2, effects: { pressure: 7, health: -2 }, tags: ["操作 +2", "壓力 +7"] },
      { id: "read", title: "拆解教練的隱藏題", desc: "不追人頭，先找出真正的勝負條件。", gain: 2, effects: { pressure: 3, trust: 3 }, tags: ["判讀 +2", "信任 +3"] },
      { id: "link", title: "替陌生隊友補最後一拍", desc: "用一次無聲配合讓五個人開始同步。", gain: 2, effects: { trust: 8, pressure: 2 }, tags: ["連動 +2", "信任 +8"] }
    ]
  },
  {
    short: "SUB", stage: "02 · CHALLENGER", title: "沒有明星的先發名單", dc: 8,
    body: "次級聯賽首戰，分析師判定你們每條線都輸。Rook 把戰術板翻到空白頁：紙面劣勢，也代表沒人知道你們會怎麼打。",
    actions: [
      { id: "force", title: "把弱線變成引爆點", desc: "全隊資源集中在最敢開火的位置。", gain: 2, effects: { pressure: 8, trust: -2, fans: 500 }, tags: ["操作 +2", "粉絲 +500"] },
      { id: "read", title: "交換所有不對稱資源", desc: "不接正面碰撞，用地圖價值拖垮預測。", gain: 2, effects: { pressure: 4, health: -1 }, tags: ["判讀 +2", "壓力 +4"] },
      { id: "link", title: "五人共享同一個倒數", desc: "把每次進退壓進三秒口令。", gain: 2, effects: { trust: 7, nerve: 1 }, tags: ["連動 +2", "心態 +1"] }
    ]
  },
  {
    short: "META", stage: "03 · PRO LEAGUE", title: "版本在開賽前死亡", dc: 8,
    body: "大型更新讓你們準備六週的體系失效。對手選擇照著新答案走，但真正的版本理解往往誕生在第一個敢犯錯的人身上。",
    actions: [
      { id: "force", title: "用熟練度硬穿版本", desc: "保留招牌打法，只把節奏推得更快。", gain: 3, effects: { pressure: 9, health: -3, fans: 700 }, tags: ["操作 +3", "健康 -3"] },
      { id: "read", title: "現場重寫資源公式", desc: "把更新內容換算成全新的地圖交換。", gain: 3, effects: { pressure: 7, nerve: 1 }, tags: ["判讀 +3", "心態 +1"] },
      { id: "link", title: "讓每個人保留一個答案", desc: "不追求完美陣容，改用五個人的舒適區拼接。", gain: 2, effects: { trust: 9, pressure: 3 }, tags: ["連動 +2", "信任 +9"] }
    ]
  },
  {
    short: "LIVE", stage: "04 · SPOTLIGHT", title: "三十秒剪輯的風暴", dc: 9,
    body: "你在直播裡的一句玩笑被剪成熱搜。賽前記者會坐滿了人，而今晚的對手正在等你把注意力浪費在鏡頭前。",
    actions: [
      { id: "force", title: "把答案留在比分板", desc: "拒絕解釋，用勝負承擔所有聲音。", gain: 2, effects: { pressure: 10, nerve: 2, fans: 1100 }, tags: ["心態 +2", "粉絲 +1,100"] },
      { id: "read", title: "主動拆解完整脈絡", desc: "選擇最難被再次斷章取義的說法。", gain: 2, effects: { pressure: 5, trust: 3, fans: 400 }, tags: ["判讀 +2", "信任 +3"] },
      { id: "link", title: "讓全隊一起面對鏡頭", desc: "不把公關危機變成一個人的戰爭。", gain: 2, effects: { trust: 10, pressure: 4 }, tags: ["連動 +2", "信任 +10"] }
    ]
  },
  {
    short: "RIFT", stage: "05 · TEAM RIFT", title: "語音裡少了一個人", dc: 9,
    body: "連敗後，隊內語音只剩必要口令。教練要求你在明天前提出解法，但每個人其實都在等另一個人先承認害怕。",
    actions: [
      { id: "force", title: "指定唯一臨場核心", desc: "爭議先停，關鍵時刻只聽一個聲音。", gain: 2, effects: { trust: -5, pressure: 7, nerve: 2 }, tags: ["心態 +2", "信任 -5"] },
      { id: "read", title: "把爭執變成可驗證假設", desc: "用三場測試決定誰的判斷適合版本。", gain: 2, effects: { trust: 4, pressure: 4 }, tags: ["判讀 +2", "信任 +4"] },
      { id: "link", title: "關掉錄影，先談沒說的話", desc: "今晚不看數據，只修復彼此願不願意回應。", gain: 3, effects: { trust: 13, pressure: -4 }, tags: ["連動 +3", "壓力 -4"] }
    ]
  },
  {
    short: "MOVE", stage: "06 · TRANSFER WINDOW", title: "冠軍隊伍的空白合約", dc: 10,
    body: "世界冠軍隊伍送來沒有填薪資的合約，只要求你今晚答覆。母隊沒有加價，只把最初那張手寫戰術板放回你的桌上。",
    actions: [
      { id: "force", title: "簽下更大的舞台", desc: "把生涯押在更強的隊友與更高的期待。", gain: 3, effects: { trust: -9, pressure: 10, fans: 2500 }, tags: ["操作 +3", "粉絲 +2,500"] },
      { id: "read", title: "把報價換成訓練資源", desc: "不急著轉隊，先改變母隊的競爭條件。", gain: 3, effects: { trust: 3, pressure: 5, health: 5 }, tags: ["判讀 +3", "健康 +5"] },
      { id: "link", title: "留下完成共同語言", desc: "拒絕捷徑，讓這條訊號鏈走到最後。", gain: 3, effects: { trust: 15, pressure: 2 }, tags: ["連動 +3", "信任 +15"] }
    ]
  },
  {
    short: "ASIA", stage: "07 · ASIA MAJOR", title: "跨區賽的最後暫停", dc: 11,
    body: "準決賽決勝局，對手已連續破解兩次戰術。你們只剩一次暫停，場館的倒數聲讓每個人的呼吸開始不同步。",
    actions: [
      { id: "force", title: "把資源交給最熱的手", desc: "所有視野與經濟都服務一次極限突破。", gain: 3, effects: { pressure: 11, health: -4, fans: 1800 }, tags: ["操作 +3", "壓力 +11"] },
      { id: "read", title: "故意重演被破解的開局", desc: "讓對手相信第三次仍是同一個陷阱。", gain: 3, effects: { pressure: 8, nerve: 2 }, tags: ["判讀 +3", "心態 +2"] },
      { id: "link", title: "只留一句共同口令", desc: "刪掉所有複雜細節，讓五個人重新同時行動。", gain: 3, effects: { trust: 12, pressure: -2 }, tags: ["連動 +3", "壓力 -2"] }
    ]
  },
  {
    short: "FINAL", stage: "08 · WORLD FINAL", title: "世界決賽的第十二秒", dc: 12,
    body: "比分持平，終局資源即將刷新。八年的訓練濃縮成十二秒：你發出的最後一個訊號，會決定這支隊伍如何被記住。",
    actions: [
      { id: "force", title: "在所有鏡頭前先手", desc: "不等完美時機，成為那個讓決賽開始的人。", gain: 4, effects: { pressure: 12, health: -5, fans: 4000 }, tags: ["操作 +4", "粉絲 +4,000"] },
      { id: "read", title: "把十二秒拆成三個陷阱", desc: "用對手最相信的資訊完成最後一次誤導。", gain: 4, effects: { pressure: 9, nerve: 3 }, tags: ["判讀 +4", "心態 +3"] },
      { id: "link", title: "讓五個人同時按下答案", desc: "沒有英雄鏡頭，只有一條從青訓延伸至此的訊號。", gain: 4, effects: { trust: 14, pressure: 3 }, tags: ["連動 +4", "信任 +14"] }
    ]
  }
];

let setup = { handle: "Vanta", archetype: "spark", seed: makeSeed() };
let state = null;
let soundEnabled = true;
let audioCtx = null;

const routeEl = document.querySelector("#route");
const pilotEl = document.querySelector("#pilot-panel");
const decisionEl = document.querySelector("#decision-panel");
const intelEl = document.querySelector("#intel-panel");
const mobileHudEl = document.querySelector("#mobile-hud");
const setupDialog = document.querySelector("#setup-dialog");
const infoDialog = document.querySelector("#info-dialog");
const endingDialog = document.querySelector("#ending-dialog");
const endingContent = document.querySelector("#ending-content");

function clamp(value, min = 0, max = 100) { return Math.max(min, Math.min(max, value)); }
function makeSeed() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }
function formatNum(value) { return Math.round(value).toLocaleString("zh-TW"); }
function hashString(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function seededValue(seed, counter) { let a = hashString(`${seed}:${counter}`); a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }
function roll(max) { return Math.floor(seededValue(state.seed, state.rngCounter++) * max) + 1; }
function escapeHtml(value = "") { const div = document.createElement("div"); div.textContent = value; return div.innerHTML; }

function beep(kind = "click") {
  if (!soundEnabled) return;
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const map = { click: [190, .03], win: [560, .09], loss: [92, .13], chain: [760, .11] }[kind];
    osc.type = kind === "loss" ? "sawtooth" : "square";
    osc.frequency.value = map[0];
    gain.gain.setValueAtTime(.035, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + map[1]);
    osc.connect(gain).connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + map[1]);
  } catch (_) { /* sound is optional */ }
}

function toast(message) {
  const el = document.querySelector("#signal-toast");
  el.textContent = message; el.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 2200);
}

function saveState() { if (state && !state.preview) localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
function loadState() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (_) { return null; } }
function clearState() { localStorage.removeItem(SAVE_KEY); }

function createState(preview = false) {
  const archetype = ARCHETYPES[setup.archetype];
  return {
    version: 1, preview,
    handle: (setup.handle.trim() || "Vanta").replace(/^@/, ""),
    archetype: setup.archetype,
    seed: (setup.seed.trim() || makeSeed()).toUpperCase(),
    rngCounter: 0, turn: 0, phase: "choice",
    stats: { ...archetype.stats },
    health: 90, pressure: 14, trust: 44, fans: 260,
    wins: 0, losses: 0, momentum: 0, chain: 0,
    lastSignal: null, result: null, champion: false,
    log: [{ title: "訊號上線", text: `@${setup.handle || "Vanta"} 進入 CROWN//CORE 公開試訓。` }]
  };
}

function ensureState() {
  state.stats ||= { ...ARCHETYPES[state.archetype].stats };
  state.log ||= [];
  state.chain ??= 0;
  state.momentum ??= 0;
}

function getOVR() { return Math.round(Object.values(state.stats).reduce((sum, value) => sum + value, 0) / 4); }

function chainBonus(nextSignal) {
  if (!state.lastSignal) return { value: 0, label: "起手訊號", perfect: false };
  if (state.lastSignal === nextSignal) return { value: -1, label: "重複 −1", perfect: false };
  if (PERFECT_PREVIOUS[nextSignal] === state.lastSignal) return { value: 2, label: "完美鏈 ＋2", perfect: true };
  return { value: 1, label: "換訊號 ＋1", perfect: false };
}

function render() {
  ensureState();
  renderRoute();
  renderPilot();
  renderDecision();
  renderIntel();
  renderMobileHud();
}

function renderRoute() {
  routeEl.innerHTML = SCENES.map((scene, index) => `<span class="route-node ${index < state.turn ? "done" : index === state.turn ? "active" : ""}" data-short="${scene.short}" title="${scene.title}"></span>`).join("");
}

function renderPilot() {
  const archetype = ARCHETYPES[state.archetype];
  pilotEl.innerHTML = `<div class="pilot-profile"><span class="pilot-avatar">${escapeHtml(state.handle.slice(0, 2).toUpperCase())}</span><div><small>@${escapeHtml(state.handle)} · ${archetype.code}</small><h2>${escapeHtml(state.handle)}</h2><p>${archetype.name}｜CROWN//CORE</p></div><div class="mobile-pulse"><span><b>${state.wins}-${state.losses}</b>戰績</span><span><b>${state.momentum}</b>聲勢</span></div></div>
    <div class="pilot-ratings">${Object.entries(STAT_INFO).map(([key, info]) => `<div class="rating"><span>${info.icon} ${info.name}</span><b>${Math.round(state.stats[key])}</b><small>/ 80</small></div>`).join("")}</div>
    <div class="meter-stack">${meter("健康", state.health, "health")}${meter("壓力", state.pressure, "pressure")}${meter("團隊信任", state.trust, "trust")}</div>
    <div class="pilot-footer"><div class="pilot-kpi"><b>${getOVR()}</b><small>綜合能力</small></div><div class="pilot-kpi"><b>${state.chain}</b><small>完美接續</small></div></div>`;
}

function meter(name, value, cls) {
  return `<div><div class="meter-head"><span>${name}</span><b>${Math.round(value)}</b></div><div class="meter ${cls}"><i style="width:${clamp(value)}%"></i></div></div>`;
}

function renderDecision() {
  const scene = SCENES[Math.min(state.turn, SCENES.length - 1)];
  const lastName = state.lastSignal ? SIGNAL_INFO[state.lastSignal].name : "尚未建立";
  const resultMode = state.phase === "result";
  decisionEl.innerHTML = `<div class="scene-block" data-watermark="${scene.short}"><div class="scene-top"><span class="scene-tag">${scene.stage}</span><span class="scene-dc">SIGNAL CHECK · DC ${scene.dc}</span></div><div class="scene-copy"><h1>${scene.title}</h1><p>${scene.body}</p></div><div class="scene-meta"><span>上一訊號 <b>${lastName}</b></span><span>完美接續 <b>${state.chain}</b></span><span>生涯戰績 <b>${state.wins}-${state.losses}</b></span><span>世界種子 <b>${state.seed}</b></span></div></div>
    ${resultMode ? renderResult() : renderActions(scene)}`;
  if (resultMode) document.querySelector("#next-scene").onclick = nextScene;
  else document.querySelectorAll("[data-signal]").forEach(button => button.onclick = () => chooseSignal(button.dataset.signal));
}

function renderActions(scene) {
  return `<div class="action-zone"><div class="zone-head"><div><span class="intel-label">CHOOSE ONE CALL</span><h2>發出這一幕的戰術訊號</h2></div><p>不同訊號可串接；重複使用會被讀懂。</p></div><div class="action-deck">${scene.actions.map(action => {
    const info = SIGNAL_INFO[action.id]; const bonus = chainBonus(action.id);
    return `<button class="signal-action ${action.id}" data-signal="${action.id}"><span class="action-code"><span>${info.code}</span><span class="chain-bonus">${bonus.label}</span></span><h3>${action.title}</h3><p>${action.desc}</p><span class="action-effects">${action.tags.map(tag => `<span class="${tag.includes("-") || tag.includes("壓力 +") ? "risk" : ""}">${tag}</span>`).join("")}</span></button>`;
  }).join("")}</div></div>`;
}

function renderResult() {
  const result = state.result;
  return `<div class="result-zone"><div class="result-card"><div class="d12">${result.roll}</div><div class="result-copy"><small>${result.signalCode} · ${result.chainLabel}</small><h2 class="${result.success ? "win" : "loss"}">${result.success ? "訊號接通｜PLAY LANDED" : "訊號斷裂｜CALL DENIED"}</h2><p>${result.flavor}</p><div class="result-math">D12 ${result.roll} ＋ 能力 ${signed(result.statMod)} ＋ 戰術鏈 ${signed(result.chainBonus)} ＋ 狀態 ${signed(result.conditionMod)} ＝ ${result.total} ／ DC ${result.dc}</div><button class="next-button" id="next-scene">${state.turn === SCENES.length - 1 ? "結算這段職業生涯" : `進入第 ${state.turn + 2} 幕`} ▸</button></div></div></div>`;
}

function renderIntel() {
  const lastSignal = state.lastSignal;
  intelEl.innerHTML = `<div><span class="intel-label">CAREER OBJECTIVE</span><div class="objective-box"><b>讓訊號抵達世界決賽</b><p>八幕後至少 5 勝、聲勢 10，即可把最後一次成功轉化為世界冠軍。</p><div class="objective-progress"><span>勝場 <b>${state.wins}/5</b></span><span>聲勢 <b>${state.momentum}/10</b></span></div></div></div>
    <div class="chain-box"><span class="intel-label">PERFECT SIGNAL LOOP</span><div class="chain-line">${["force","read","link"].map(id => `<span class="chain-node ${lastSignal === id ? "active" : ""}">${SIGNAL_INFO[id].code}</span>`).join("")}</div><p class="chain-note">強攻 → 讀局 → 連結 → 強攻。依環接續獲得 +2；切換其他訊號 +1；重複同一訊號 −1。</p></div>
    <div class="career-log"><span class="intel-label">CAREER FEED</span>${state.log.slice(-4).reverse().map((item, index) => `<div class="log-item ${index === 0 ? "latest" : ""}"><b>${escapeHtml(item.title)}</b>${escapeHtml(item.text)}</div>`).join("")}</div>
    <div class="intel-footer"><div class="intel-stat"><b>${formatNum(state.fans)}</b><small>支持者</small></div><div class="intel-stat"><b>${state.momentum}</b><small>生涯聲勢</small></div></div>`;
}

function renderMobileHud() {
  mobileHudEl.innerHTML = Object.entries(STAT_INFO).map(([key, info]) => `<div class="mobile-rating"><span>${info.icon} ${info.name}</span><b>${Math.round(state.stats[key])}</b><small>/ 80</small></div>`).join("");
}

function signed(value) { return value >= 0 ? `+${value}` : `${value}`; }

function applyEffects(effects = {}) {
  Object.entries(effects).forEach(([key, value]) => {
    if (STAT_INFO[key]) state.stats[key] = clamp(state.stats[key] + value, 10, 80);
    else if (key === "fans") state.fans = Math.max(0, state.fans + value);
    else if (["health","pressure","trust"].includes(key)) state[key] = clamp(state[key] + value);
  });
}

function chooseSignal(signalId) {
  if (state.phase !== "choice") return;
  const scene = SCENES[state.turn];
  const action = scene.actions.find(item => item.id === signalId);
  const signal = SIGNAL_INFO[signalId];
  const chain = chainBonus(signalId);
  const die = roll(12);
  const statMod = Math.floor((state.stats[signal.stat] - 34) / 7);
  const conditionMod = (state.health < 40 ? -2 : state.health < 65 ? -1 : 0) + (state.pressure > 82 ? -2 : state.pressure > 65 ? -1 : 0) + (signalId === "link" && state.trust >= 70 ? 1 : 0) + Math.floor((state.stats.nerve - 40) / 18);
  const total = die + statMod + chain.value + conditionMod;
  const success = die === 12 || (die !== 1 && total >= scene.dc);

  state.stats[signal.stat] = clamp(state.stats[signal.stat] + action.gain, 10, 80);
  applyEffects(action.effects);
  if (chain.perfect) state.chain += 1;
  else if (chain.value < 0) state.chain = Math.max(0, state.chain - 1);

  if (success) {
    state.wins += 1; state.momentum += 2; state.trust = clamp(state.trust + 3); state.fans += 650 * (state.turn + 1);
  } else {
    state.losses += 1; state.momentum = Math.max(0, state.momentum - 1); state.pressure = clamp(state.pressure + 7); state.health = clamp(state.health - 2);
  }

  const flavor = success
    ? (chain.perfect ? "上一幕留下的訊號在最關鍵的瞬間接上了。對手以為你們在換招，其實整條戰術鏈早已開始運作。" : "指令被隊伍完整接住。這不是最華麗的答案，卻讓局勢第一次朝你們預期的方向傾斜。")
    : (die === 1 ? "最簡單的訊息在高壓下失真。你們失去這一幕，但錯誤也成為下一個訊號必須回答的問題。" : "對手提早讀到了意圖，執行只差一拍。職業生涯沒有重來鍵，只能把代價帶進下一幕。" );

  state.lastSignal = signalId;
  state.result = { roll: die, statMod, chainBonus: chain.value, chainLabel: chain.label, conditionMod, total, dc: scene.dc, success, signalCode: signal.code, flavor };
  state.log.push({ title: `${scene.short}｜${action.title}`, text: `${success ? "成功" : "失敗"} · D12 ${die} · 聲勢 ${state.momentum}` });
  state.phase = "result";
  saveState(); beep(chain.perfect && success ? "chain" : success ? "win" : "loss"); render();
}

function nextScene() {
  if (state.turn === SCENES.length - 1) return finishCareer();
  state.turn += 1; state.phase = "choice"; state.result = null;
  state.health = clamp(state.health + 3); state.pressure = clamp(state.pressure - 4);
  saveState(); beep("click"); render();
}

function careerRank() {
  const score = state.wins * 9 + state.momentum * 3 + state.chain * 4 + getOVR() * .5 + state.trust * .1 - state.pressure * .06;
  if (score >= 108) return "S";
  if (score >= 91) return "A";
  if (score >= 72) return "B";
  return "C";
}

function finishCareer() {
  const finalSuccess = state.result?.success;
  state.champion = Boolean(finalSuccess && state.wins >= 5 && state.momentum >= 10);
  const rank = careerRank();
  clearState();
  endingContent.innerHTML = `<div class="dialog-kicker">CAREER SIGNAL COMPLETE · ${state.seed}</div><div class="ending-rank">${rank}</div><h2>${state.champion ? "訊號抵達世界之巔" : "鏈路在終點留下回聲"}</h2><p>${state.champion ? `最後十二秒，@${escapeHtml(state.handle)} 的訊號被另外四個人同時接住。CROWN//CORE 的世界冠軍不是一次神蹟，而是八幕選擇留下的共同語言。` : `你沒有把最後一個訊號轉化為冠軍，但 @${escapeHtml(state.handle)} 的每次接續都已成為隊伍下一代戰術手冊的一部分。`}</p><div class="ending-grid"><div><b>${state.wins}-${state.losses}</b><small>生涯戰績</small></div><div><b>${state.momentum}</b><small>最終聲勢</small></div><div><b>${state.chain}</b><small>完美接續</small></div><div><b>${formatNum(state.fans)}</b><small>支持者</small></div></div><div class="ending-actions"><button id="restart-career">再開一條訊號鏈</button><button id="back-classic">回到經典模式</button></div>`;
  endingDialog.showModal();
  document.querySelector("#restart-career").onclick = () => { endingDialog.close(); openSetup(false); };
  document.querySelector("#back-classic").onclick = () => { window.location.href = "index.html"; };
  beep(state.champion ? "chain" : "click");
}

function openSetup(hasSave = Boolean(loadState())) {
  setup.seed = makeSeed();
  document.querySelector("#setup-seed").value = setup.seed;
  document.querySelector("#continue-button").hidden = !hasSave;
  if (!setupDialog.open) setupDialog.showModal();
}

document.querySelector("#archetype-grid").addEventListener("click", event => {
  const button = event.target.closest("[data-archetype]"); if (!button) return;
  setup.archetype = button.dataset.archetype;
  document.querySelectorAll("[data-archetype]").forEach(item => item.classList.toggle("selected", item === button));
  beep("click");
});

document.querySelector("#reroll-seed").onclick = () => {
  setup.seed = makeSeed(); document.querySelector("#setup-seed").value = setup.seed; beep("click");
};

document.querySelector("#setup-form").addEventListener("submit", event => {
  event.preventDefault();
  setup.handle = document.querySelector("#setup-handle").value;
  setup.seed = document.querySelector("#setup-seed").value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!setup.handle.trim()) return toast("請輸入選手 ID");
  if (setup.seed.length < 4) return toast("世界種子至少需要 4 個字元");
  state = createState(false); saveState(); setupDialog.close(); beep("win"); render();
});

document.querySelector("#continue-button").onclick = () => {
  const saved = loadState(); if (!saved) return;
  state = saved; setupDialog.close(); beep("win"); render();
};

document.querySelector("#rules-button").onclick = () => infoDialog.showModal();
document.querySelector("#info-close").onclick = () => infoDialog.close();
document.querySelector("#sound-button").onclick = () => { soundEnabled = !soundEnabled; document.querySelector("#sound-button").textContent = soundEnabled ? "▥" : "□"; beep("click"); };

if (new URLSearchParams(window.location.search).get("preview") === "mobile") document.documentElement.classList.add("mobile-preview");
setup.seed = makeSeed();
state = loadState() || createState(true);
render();
openSetup(Boolean(loadState()));
