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

// 以各國 2026 年官方職籃結構為靈感，遊戲內統一顯示為「一軍／二軍」。
// 日本的 B.ONE 屬次級聯賽而非同隊預備軍；台灣二軍則為方便生涯玩法所做的養成層級。
const LEAGUE_SYSTEMS = {
  TW: { first: { label: '一軍', competition: '台灣頂級職籃', basis: '頂級職業聯盟級' }, second: { label: '二軍／養成', competition: '台灣養成聯賽', basis: '養成層級（遊戲化）' } },
  JP: { first: { label: '一軍', competition: '日本 PREMIER 級', basis: 'B.LEAGUE PREMIER 型' }, second: { label: '二軍／次級', competition: '日本 ONE 級', basis: 'B.LEAGUE ONE 型' } },
  KR: { first: { label: '一軍', competition: '韓國 KBL 級', basis: 'KBL 型' }, second: { label: '二軍', competition: '韓國 D-League 級', basis: 'KBL D-League 型' } },
  CN: { first: { label: '一軍', competition: '中國頂級職籃', basis: 'CBA 型' }, second: { label: '二軍', competition: '中國發展聯賽', basis: 'CBDL 型' } },
  US: { first: { label: '一軍', competition: '美國頂級聯賽', basis: 'NBA 型' }, second: { label: '二軍', competition: '美國發展聯賽', basis: 'NBA G League 型' } }
};

// 0–100 強度梯度以 2026 FIBA 國家隊排名與各國官方聯賽層級作為相對校準依據；
// 球隊與薪資仍是遊戲中的虛構設定，不代表真實球隊報價。
const TEAMS = {
  tw_ms: { id: 'tw_ms', country: 'TW', name: '新北潮生國中', league: '國中籃球聯賽', level: 'middle', difficulty: 46, prestige: 1, salary: 0, color: '#dfff00' },
  tw_high: { id: 'tw_high', country: 'TW', name: '霧城高中', league: '高中菁英聯賽', level: 'high', difficulty: 57, prestige: 2, salary: 0, entry: 54, color: '#dfff00' },
  jp_high: { id: 'jp_high', country: 'JP', name: '北辰學園', league: '日本高校聯賽', level: 'high', difficulty: 63, prestige: 3, salary: 0, entry: 61, color: '#ff6a72' },
  kr_high: { id: 'kr_high', country: 'KR', name: '漢城高陽高校', league: '韓國高校聯賽', level: 'high', difficulty: 62, prestige: 3, salary: 0, entry: 61, color: '#78a7ff' },
  cn_youth: { id: 'cn_youth', country: 'CN', name: '海浦青年隊', league: '菁英青年聯賽', level: 'high', difficulty: 65, prestige: 3, salary: 6, entry: 63, color: '#ff7057' },
  us_prep: { id: 'us_prep', country: 'US', name: 'Red Canyon Prep', league: 'US Prep Circuit', level: 'high', difficulty: 70, prestige: 4, salary: 0, entry: 67, color: '#65d9ff' },
  tw_uni: { id: 'tw_uni', country: 'TW', name: '北嶼大學', league: '大專公開一級', level: 'development', difficulty: 64, prestige: 3, salary: 8, entry: 60, contractStyle: 'standard', color: '#dfff00' },
  tw_rookie: { id: 'tw_rookie', country: 'TW', name: '台北夜航', league: '島嶼職業聯賽', level: 'development', difficulty: 72, prestige: 4, salary: 42, entry: 67, contractStyle: 'short', color: '#dfff00' },
  jp_uni: { id: 'jp_uni', country: 'JP', name: '湘南國際大學', league: '關東大學一部', level: 'development', difficulty: 69, prestige: 4, salary: 10, entry: 65, color: '#ff6a72' },
  kr_uni: { id: 'kr_uni', country: 'KR', name: '首爾東原大學', league: '韓國大學聯賽', level: 'development', difficulty: 69, prestige: 4, salary: 12, entry: 65, color: '#78a7ff' },
  cn_dev: { id: 'cn_dev', country: 'CN', name: '廣城體院', league: '全國大學聯賽', level: 'development', difficulty: 73, prestige: 4, salary: 16, entry: 68, color: '#ff7057' },
  us_juco: { id: 'us_juco', country: 'US', name: 'Lake Mesa College', league: 'US College Division II', level: 'development', difficulty: 74, prestige: 4, salary: 8, entry: 69, contractStyle: 'short', color: '#65d9ff' },
  us_ncaa: { id: 'us_ncaa', country: 'US', name: 'Pacific State', league: 'US College Division I', level: 'development', difficulty: 82, prestige: 6, salary: 18, entry: 76, color: '#65d9ff' },
  tw_pro: { id: 'tw_pro', country: 'TW', name: '基隆夜航', league: '台灣頂級職籃', level: 'pro', squad: 'first', difficulty: 78, prestige: 6, salary: 120, entry: 71, contractStyle: 'standard', color: '#dfff00' },
  tw_taoyuan: { id: 'tw_taoyuan', country: 'TW', name: '桃園飛行者', league: '台灣養成聯賽', level: 'pro', squad: 'second', difficulty: 71, prestige: 3, salary: 58, entry: 63, contractStyle: 'short', color: '#c8ee46' },
  tw_hsinchu: { id: 'tw_hsinchu', country: 'TW', name: '新竹工程師', league: '台灣養成聯賽', level: 'pro', squad: 'second', difficulty: 72, prestige: 4, salary: 65, entry: 64, contractStyle: 'short', color: '#b8df60' },
  tw_taichung: { id: 'tw_taichung', country: 'TW', name: '台中疾風', league: '台灣頂級職籃', level: 'pro', squad: 'first', difficulty: 79, prestige: 6, salary: 132, entry: 73, contractStyle: 'standard', color: '#e4f36a' },
  tw_tainan: { id: 'tw_tainan', country: 'TW', name: '台南赤焰', league: '台灣養成聯賽', level: 'pro', squad: 'second', difficulty: 70, prestige: 3, salary: 52, entry: 62, contractStyle: 'short', color: '#f4c95d' },
  tw_kaohsiung: { id: 'tw_kaohsiung', country: 'TW', name: '高雄港鯨', league: '台灣頂級職籃', level: 'pro', squad: 'first', difficulty: 81, prestige: 7, salary: 148, entry: 75, contractStyle: 'long', color: '#8fd7a8' },
  jp_pro: { id: 'jp_pro', country: 'JP', name: '東京流星', league: '日本 PREMIER 級', level: 'pro', squad: 'first', difficulty: 84, prestige: 7, salary: 190, entry: 77, contractStyle: 'standard', color: '#ff6a72' },
  jp_osaka: { id: 'jp_osaka', country: 'JP', name: '大阪飛龍', league: '日本 ONE 級', level: 'pro', squad: 'second', difficulty: 78, prestige: 4, salary: 115, entry: 71, contractStyle: 'short', color: '#ff826f' },
  jp_yokohama: { id: 'jp_yokohama', country: 'JP', name: '橫濱浪潮', league: '日本 ONE 級', level: 'pro', squad: 'second', difficulty: 77, prestige: 4, salary: 108, entry: 70, contractStyle: 'standard', color: '#ff8e9e' },
  jp_hokkaido: { id: 'jp_hokkaido', country: 'JP', name: '北海道冰原', league: '日本 PREMIER 級', level: 'pro', squad: 'first', difficulty: 85, prestige: 7, salary: 205, entry: 79, contractStyle: 'long', color: '#8ed8ff' },
  jp_nagoya: { id: 'jp_nagoya', country: 'JP', name: '名古屋齒輪', league: '日本 ONE 級', level: 'pro', squad: 'second', difficulty: 79, prestige: 5, salary: 128, entry: 73, contractStyle: 'standard', color: '#e591ff' },
  jp_fukuoka: { id: 'jp_fukuoka', country: 'JP', name: '福岡烈火', league: '日本 PREMIER 級', level: 'pro', squad: 'first', difficulty: 86, prestige: 8, salary: 225, entry: 81, contractStyle: 'long', color: '#ff6b4a' },
  kr_pro: { id: 'kr_pro', country: 'KR', name: '仁川鋼翼', league: '韓國 KBL 級', level: 'pro', squad: 'first', difficulty: 83, prestige: 7, salary: 205, entry: 77, contractStyle: 'long', color: '#78a7ff' },
  kr_seoul: { id: 'kr_seoul', country: 'KR', name: '首爾白虎', league: '韓國 KBL 級', level: 'pro', squad: 'first', difficulty: 85, prestige: 8, salary: 228, entry: 80, contractStyle: 'long', color: '#92b8ff' },
  kr_busan: { id: 'kr_busan', country: 'KR', name: '釜山防波堤', league: '韓國 D-League 級', level: 'pro', squad: 'second', difficulty: 76, prestige: 4, salary: 112, entry: 69, contractStyle: 'short', color: '#61c4e8' },
  kr_changwon: { id: 'kr_changwon', country: 'KR', name: '昌原黑鴉', league: '韓國 D-League 級', level: 'pro', squad: 'second', difficulty: 78, prestige: 4, salary: 130, entry: 72, contractStyle: 'standard', color: '#9a91ff' },
  kr_suwon: { id: 'kr_suwon', country: 'KR', name: '水原電光', league: '韓國 D-League 級', level: 'pro', squad: 'second', difficulty: 77, prestige: 4, salary: 120, entry: 70, contractStyle: 'standard', color: '#70d4ff' },
  kr_daegu: { id: 'kr_daegu', country: 'KR', name: '大邱暴風', league: '韓國 KBL 級', level: 'pro', squad: 'first', difficulty: 86, prestige: 8, salary: 238, entry: 81, contractStyle: 'long', color: '#667cff' },
  cn_pro: { id: 'cn_pro', country: 'CN', name: '上海引擎', league: '中國頂級職籃', level: 'pro', squad: 'first', difficulty: 87, prestige: 8, salary: 280, entry: 81, contractStyle: 'standard', color: '#ff7057' },
  cn_beijing: { id: 'cn_beijing', country: 'CN', name: '北京天幕', league: '中國頂級職籃', level: 'pro', squad: 'first', difficulty: 89, prestige: 9, salary: 340, entry: 84, contractStyle: 'long', color: '#ff8b5f' },
  cn_guangzhou: { id: 'cn_guangzhou', country: 'CN', name: '廣州南星', league: '中國發展聯賽', level: 'pro', squad: 'second', difficulty: 80, prestige: 5, salary: 180, entry: 74, contractStyle: 'standard', color: '#ff6a76' },
  cn_chengdu: { id: 'cn_chengdu', country: 'CN', name: '成都遠峰', league: '中國發展聯賽', level: 'pro', squad: 'second', difficulty: 79, prestige: 4, salary: 165, entry: 72, contractStyle: 'short', color: '#f69a56' },
  cn_shenzhen: { id: 'cn_shenzhen', country: 'CN', name: '深圳脈衝', league: '中國頂級職籃', level: 'pro', squad: 'first', difficulty: 88, prestige: 9, salary: 315, entry: 83, contractStyle: 'long', color: '#ff587f' },
  cn_nanjing: { id: 'cn_nanjing', country: 'CN', name: '南京城牆', league: '中國發展聯賽', level: 'pro', squad: 'second', difficulty: 81, prestige: 5, salary: 195, entry: 75, contractStyle: 'standard', color: '#d98955' },
  us_g: { id: 'us_g', country: 'US', name: '奧斯汀奔雷', league: '美國發展聯賽', level: 'pro', squad: 'second', difficulty: 90, prestige: 8, salary: 250, entry: 84, contractStyle: 'short', color: '#65d9ff' },
  us_phoenix: { id: 'us_phoenix', country: 'US', name: '鳳凰城電壓', league: '美國發展聯賽', level: 'pro', squad: 'second', difficulty: 89, prestige: 7, salary: 235, entry: 83, contractStyle: 'short', color: '#ff9565' },
  us_los_angeles: { id: 'us_los_angeles', country: 'US', name: '洛杉磯火人', league: '美國發展聯賽', level: 'pro', squad: 'second', difficulty: 88, prestige: 7, salary: 220, entry: 82, contractStyle: 'short', color: '#ff7048' },
  us_chicago: { id: 'us_chicago', country: 'US', name: '芝加哥熔爐', league: '美國頂級聯賽', level: 'pro', squad: 'first', difficulty: 93, prestige: 9, salary: 510, entry: 89, contractStyle: 'standard', color: '#82b8ff' },
  us_miami: { id: 'us_miami', country: 'US', name: '邁阿密浪潮', league: '美國頂級聯賽', level: 'pro', squad: 'first', difficulty: 92, prestige: 9, salary: 470, entry: 88, contractStyle: 'standard', color: '#61e6d2' },
  us_boston: { id: 'us_boston', country: 'US', name: '波士頓君王', league: '美國頂級聯賽', level: 'pro', squad: 'first', difficulty: 94, prestige: 10, salary: 560, entry: 91, contractStyle: 'long', color: '#86d07f' },
  us_elite: { id: 'us_elite', country: 'US', name: '西雅圖暴風', league: '美國頂級聯賽', level: 'pro', squad: 'first', difficulty: 95, prestige: 10, salary: 620, entry: 92, contractStyle: 'long', color: '#65d9ff' }
};

const PRO_TEAM_IDS = Object.values(TEAMS).filter((team) => team.level === 'pro').map((team) => team.id);

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
  pullup: { code: 'PULL', title: '借掩護急停出手', desc: '先壓住時間，等防守被擋到再投。', primary: 'shooting', secondary: 'iq', tag: 'shooter', deltas: { rhythm: 5, load: 4 }, success: '你等到防守被掩護卡住才急停。球進，回頭全隊也守住對手的倉促出手。', failure: '你提早半拍收球，防守追上來干擾。球彈框而出，對手抓下籃板。' },
  drive: { code: 'RIM', title: '拉開後直接切入', desc: '清空一側，用速度攻擊籃框，也準備吸引犯規。', primary: 'finish', secondary: 'athletic', tag: 'attack', deltas: { rhythm: 6, load: 8 }, success: '你等協防站位一歪才加速，扛住碰撞把球放進。剩下時間，全隊退防沒有漏人。', failure: '協防提早收進禁區，你的上籃角度被封住。球沒進，時間也所剩不多。' },
  create: { code: 'READ', title: '吸引協防再分球', desc: '先突破逼第二個人來守，再傳給真正的空檔。', primary: 'playmaking', secondary: 'iq', tag: 'creator', deltas: { trust: 7, rhythm: 2 }, success: '第二個防守者一靠近，你立刻把球送到底角。隊友投進，對手最後一次回應偏掉。', failure: '你多運了一下，傳球路線被看穿。對手抄走球，也帶走這次機會。' },
  screen: { code: 'LINK', title: '掩護後順下', desc: '把防守擋住，再往籃框跑，逼協防做選擇。', primary: 'iq', secondary: 'athletic', tag: 'connector', deltas: { trust: 7, load: 4 }, success: '你的掩護角度很準，順下又吸走協防。隊友得到乾淨空檔，命中後大家立刻退防。', failure: '你太早移動，被吹進攻犯規。球權直接交換，戰術還沒跑完就結束了。' },
  post: { code: 'POST', title: '低位要球單打', desc: '先站穩位置，再用一次轉身完成出手。', primary: 'finish', secondary: 'iq', tag: 'attack', deltas: { rhythm: 4, load: 7 }, success: '你接球後沒有急著撞，等對手重心偏掉才轉身擦板。球進，下一波也成功守下。', failure: '包夾在你第二次運球時到位。球被拍掉，已經沒有時間重新組織。' },
  crash: { code: 'CRASH', title: '衝進攻籃板', desc: '隊友出手時從弱邊切入，準備補進第二波。', primary: 'athletic', secondary: 'finish', tag: 'iron', deltas: { trust: 5, load: 8 }, success: '第一球沒進，你從弱邊衝進來抓到球，落地後馬上補進。全隊隨即退防守住比分。', failure: '球彈得比預期更遠，你撲空後來不及回防，對手用反擊結束比賽。' },
  lock: { code: 'LOCK', title: '單防對方主將', desc: '不輕易伸手，只封住他最習慣的突破方向。', primary: 'defense', secondary: 'athletic', tag: 'stopper', deltas: { trust: 5, load: 6 }, success: '你一路把他逼到不舒服的位置。他只能後仰出手，球偏掉，終場哨聲跟著響起。', failure: '你第一步被變速騙開，補防來不及。對手在哨聲前把球放進。' },
  switch: { code: 'SWITCH', title: '掩護就直接換防', desc: '先講清楚誰換誰，不讓對手靠掩護製造空檔。', primary: 'defense', secondary: 'iq', tag: 'connector', deltas: { trust: 7, load: 4 }, success: '對手連做兩次掩護都沒甩開你們，只能在遠處勉強出手。球沒進，籃板也收下了。', failure: '你和隊友同時追原本的人，底角因此空了。對手接球命中。' },
  glass: { code: 'GLASS', title: '先卡位再搶籃板', desc: '出手後先碰到自己的對位，不給對手補籃機會。', primary: 'athletic', secondary: 'defense', tag: 'iron', deltas: { trust: 5, load: 7 }, success: '球一出手你先完成卡位，再用雙手把籃板抱緊。對手沒有第二次機會，時間走完。', failure: '你只盯著球，漏掉從底線衝進來的人。對手補籃得分。' },
  foul: { code: 'FOUL', title: '接球後立刻犯規', desc: '只讓時間走一點點，再用暫停布置追分。', primary: 'iq', secondary: 'athletic', tag: 'connector', deltas: { trust: 3, load: 3 }, success: '你在接球後 1.2 秒就完成犯規。對手第二罰沒進，你們叫暫停推進球，最後一攻追平並在延長賽拿下比賽。', failure: '你慢了一步才犯規，白白多掉了五秒。對手兩罰都進，你們最後的出手只能勉強搶投。' },
  trap: { code: 'TRAP', title: '邊線夾擊搶球', desc: '先封住回傳路線，逼持球者往邊線走。', primary: 'defense', secondary: 'athletic', tag: 'stopper', deltas: { trust: 5, load: 7 }, success: '持球者被逼到邊線，你從另一側把球點掉。快攻追平後，你們在延長賽完成逆轉。', failure: '對手及時把球傳過夾擊，前場變成多打少。你們只能再次犯規，時間更少了。' },
  deny: { code: 'DENY', title: '封死第一接球點', desc: '全隊緊貼接球人，挑戰對手的邊線發球。', primary: 'defense', secondary: 'iq', tag: 'stopper', deltas: { trust: 7, load: 5 }, success: '你把第一接球點完全封住，隊友也跟上輪轉。對手五秒發球違例，你們拿回球權並追平比分。', failure: '你撲得太前面，對手一個反跑就接到長傳。戰術犯規只能送他上罰球線。' }
};

const POSITION_CLUTCH_ACTIONS = {
  PG: ['pullup', 'drive', 'create'],
  SG: ['pullup', 'drive', 'create'],
  SF: ['drive', 'pullup', 'create'],
  PF: ['screen', 'post', 'pullup'],
  C: ['post', 'screen', 'crash']
};

const CLUTCH_SCENARIOS = [
  {
    id: 'one_shot', clock: '8.6', title: '最後一攻', score: '72：72', actionKeys: 'position',
    story: (opponent) => `對上「${opponent}」，第四節剩 8.6 秒，比分 72：72。你們在前場邊線發球，這個時間真的只夠跑一個戰術。`,
    quote: '教練：先看清楚防守，再決定自己投或傳。', prompt: '8.6 秒，只夠一波進攻。你要怎麼打？', hint: '比分平手 · 我方球權 · 沒有下一次重新組織', difficulty: 1
  },
  {
    id: 'two_way', clock: '31.8', title: '兩波決勝', score: '73：74', actionKeys: 'position',
    story: (opponent) => `對上「${opponent}」，第四節剩 31.8 秒，你們 73：74 落後並握有球權。進攻鐘還有 24 秒，這不是單純的最後一球：先得分，接著還要守對手一次。`,
    quote: '教練：不用搶投，但別把二十四秒全部耗光。', prompt: '31.8 秒，至少還有兩段攻防。第一波怎麼打？', hint: '落後 1 分 · 我方球權 · 得分後還要退防', difficulty: 2
  },
  {
    id: 'last_stop', clock: '6.4', title: '守住這球', score: '81：80', actionKeys: ['lock', 'switch', 'glass'],
    story: (opponent) => `你們對「${opponent}」以 81：80 領先。第四節剩 6.4 秒，對手前場發球；他們只能完成一次快速進攻，但一次漏人就可能被逆轉。`,
    quote: '教練：先溝通換防，球出手後一定要卡位。', prompt: '領先 1 分，對手握有最後球權。你守哪一件事？', hint: '領先 1 分 · 對方球權 · 防守成功就贏', difficulty: 1
  },
  {
    id: 'clock_game', clock: '22.4', title: '搶回球權', score: '70：72', actionKeys: ['foul', 'trap', 'deny'],
    story: (opponent) => `第四節剩 22.4 秒，你們對「${opponent}」以 70：72 落後，球權還在對方手上。正常等完一次進攻就來不及了，現在要用犯規或壓迫防守搶時間。`,
    quote: '教練：先想好要搶球，還是立刻停表，不要兩邊都做一半。', prompt: '落後 2 分又沒有球權，怎麼把時間搶回來？', hint: '落後 2 分 · 對方球權 · 必須快速停表或製造失誤', difficulty: 3
  },
  {
    id: 'answer_now', clock: '18.4', title: '追平或逆轉', score: '66：68', actionKeys: 'position',
    story: (opponent) => `對上「${opponent}」，第四節剩 18.4 秒，你們 66：68 落後並有一次暫停。時間足夠完成一波進攻；如果太早出手，對手還能拿到球，拖太久則沒有補救機會。`,
    quote: '教練：兩分可以追平，三分可以領先，重點是拿到好出手。', prompt: '18.4 秒，兩分追平、三分逆轉。你怎麼選？', hint: '落後 2 分 · 我方球權 · 還有一次暫停', difficulty: 2
  }
];

let state = null;
let selectedPosition = 'PG';
let toastTimer = null;
let offerCountryFilter = 'ALL';
let offerSquadFilter = 'ALL';

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

function teamSquadProfile(team) {
  if (!team || team.level !== 'pro') return null;
  const key = team.squad === 'second' ? 'second' : 'first';
  return { key, ...LEAGUE_SYSTEMS[team.country][key] };
}

function countryProExperience(country, source = state) {
  const entries = (source?.history || []).filter((item) => {
    const team = TEAMS[item.teamId] || Object.values(TEAMS).find((candidate) => candidate.name === item.team);
    return (team?.level === 'pro' || item.squad) && (item.country || team?.country) === country;
  });
  const squadFor = (item) => item.squad || TEAMS[item.teamId]?.squad || null;
  const secondSeasons = entries.filter((item) => squadFor(item) === 'second').length;
  const firstSeasons = entries.filter((item) => squadFor(item) === 'first').length;
  const current = TEAMS[source?.teamId];
  const legacyFirstTeam = current?.level === 'pro' && current.country === country && current.squad === 'first';
  return {
    seasons: entries.length,
    secondSeasons,
    firstSeasons,
    unlocked: secondSeasons > 0 || firstSeasons > 0 || legacyFirstTeam
  };
}

function firstTeamPathStatus(team, source = state) {
  if (!team || team.level !== 'pro') return { unlocked: true, reason: '', seasons: 0, secondSeasons: 0, firstSeasons: 0 };
  const experience = countryProExperience(team.country, source);
  if (team.squad !== 'first') return { ...experience, unlocked: true, short: '二軍入口開放', reason: `目前已有 ${experience.seasons} 季當地職業經驗` };
  const secondLabel = LEAGUE_SYSTEMS[team.country].second.label;
  return {
    ...experience,
    unlocked: experience.unlocked,
    short: experience.unlocked ? '一軍資格已開放' : '需當地二軍資歷',
    reason: experience.unlocked ? `已有 ${experience.seasons} 季當地職業經驗` : `先在${COUNTRIES[team.country].name}${secondLabel}完成 1 季，才能挑戰一軍`
  };
}

function buildRosterStatus(team, { source = state, transfer = false, previousTeamId = source?.teamId, season = SEASONS[source?.seasonIndex || 0] } = {}) {
  const playerOvr = overall(source);
  const gap = playerOvr - team.difficulty;
  const trust = source?.trust ?? 45;
  const previousSummary = source?.summary || source?.history?.at(-1);
  const recentForm = previousSummary?.averageMargin || 0;
  const performance = gap + recentForm * .75 + (trust - 45) * .08;

  if (team.level !== 'pro') {
    const label = gap >= 3 ? '校隊先發' : gap >= -7 ? '校隊輪替' : '板凳競爭';
    return { teamId: team.id, seasonYear: season?.year, code: 'school_rotation', label, minutes: label === '校隊先發' ? 29 : label === '校隊輪替' ? 21 : 12, benchRisk: label === '板凳競爭' ? 58 : 20, reason: '校隊角色會隨能力與教練信任調整', newEnvironment: transfer };
  }

  if (team.squad === 'first' && (transfer || previousTeamId !== team.id)) {
    const minutes = Math.round(clamp(10 + (gap + 8) * .25, 8, 18));
    return {
      teamId: team.id, seasonYear: season?.year, code: 'first_bench_observation', label: '一軍板凳觀察', minutes,
      benchRisk: Math.round(clamp(68 - gap * .65 - (trust - 45) * .12, 42, 85)),
      reason: '剛升上一軍或換到新球隊，先從板凳熟悉戰術與輪替', newEnvironment: true
    };
  }

  if (team.squad === 'first') {
    if (performance >= 5) return { teamId: team.id, seasonYear: season?.year, code: 'first_starter', label: '一軍先發', minutes: 31, benchRisk: 12, reason: '能力、近況與教練信任已達先發標準', newEnvironment: false };
    if (performance >= -3) return { teamId: team.id, seasonYear: season?.year, code: 'first_rotation', label: '一軍輪替', minutes: 21, benchRisk: 32, reason: '已站穩主要輪替，但先發位置還要競爭', newEnvironment: false };
    return { teamId: team.id, seasonYear: season?.year, code: 'first_bench', label: '一軍板凳', minutes: 11, benchRisk: 64, reason: '目前實力與近況還沒有擠進固定輪替', newEnvironment: false };
  }

  if (performance >= 4) return { teamId: team.id, seasonYear: season?.year, code: 'second_starter', label: '二軍主力', minutes: 30, benchRisk: 14, reason: '在養成層級已能扛主要上場時間', newEnvironment: transfer };
  if (performance >= -5) return { teamId: team.id, seasonYear: season?.year, code: 'second_rotation', label: '二軍輪替', minutes: 22, benchRisk: 34, reason: '先從二軍輪替熟悉當地球風', newEnvironment: transfer };
  return { teamId: team.id, seasonYear: season?.year, code: 'second_bench', label: '二軍板凳', minutes: 13, benchRisk: 66, reason: '即使在二軍也要先搶到固定上場時間', newEnvironment: transfer };
}

function completeRosterSeason(team, averageMargin) {
  const season = currentSeason();
  const initial = state.rosterStatus || buildRosterStatus(team, { source: state, season });
  const professional = team.level === 'pro';
  const performance = averageMargin * .72 + state.seasonSuccesses * 1.2 + (state.trust - 45) * .08 + (overall() - team.difficulty) * .2;
  let minutes = professional ? clamp(initial.minutes + performance * .48, 4, 36) : clamp(initial.minutes + performance * .3, 8, 34);
  if (initial.code === 'first_bench_observation') minutes = Math.min(minutes, 24);
  minutes = Math.round(minutes * 10) / 10;

  let label = initial.label;
  if (team.squad === 'first') label = minutes >= 29 ? '一軍先發' : minutes >= 18 ? '一軍輪替' : minutes >= 8 ? '一軍板凳' : '一軍名單邊緣';
  else if (team.squad === 'second') label = minutes >= 28 ? '二軍主力' : minutes >= 18 ? '二軍輪替' : minutes >= 8 ? '二軍板凳' : '二軍名單邊緣';

  const scheduledGames = season.age < 19 ? 14 : 24;
  const availability = professional ? clamp(.62 + minutes / 95 + state.trust / 500 + averageMargin / 160, .38, 1) : 1;
  const gamesPlayed = Math.max(1, Math.round(scheduledGames * availability));
  const benchRisk = professional ? Math.round(clamp(74 - minutes * 1.55 + Math.max(0, team.difficulty - overall()) * .55 - averageMargin * .7, 5, 86)) : Math.round(clamp(55 - minutes * 1.2 - averageMargin, 4, 70));

  let movement = '角色維持';
  if (team.squad === 'second') movement = label === '二軍主力' ? '打出二軍主力表現，一軍資格已解鎖' : '完成當地養成季，一軍資格已解鎖';
  else if (initial.code === 'first_bench_observation' && label === '一軍輪替') movement = '從板凳觀察搶進一軍輪替';
  else if (initial.code === 'first_bench_observation' && label === '一軍先發') movement = '從板凳觀察搶下一軍先發';
  else if (label.includes('名單邊緣')) movement = '跌出主要輪替，進入名單危險區';
  else if (label.includes('板凳')) movement = '仍在板凳等待機會';
  else if (label.includes('先發') || label.includes('主力')) movement = '站穩主要上場位置';
  else if (label.includes('輪替')) movement = '站穩固定輪替';

  return { ...initial, label, minutes, gamesPlayed, benchRisk, movement, startedAs: initial.label, statFactor: professional ? clamp(minutes / 30, .2, 1.08) : 1 };
}

function leagueStrengthLabel(difficulty) {
  if (difficulty >= 93) return '世界頂級';
  if (difficulty >= 88) return '國際頂級';
  if (difficulty >= 82) return '一級職業';
  if (difficulty >= 75) return '高強度';
  if (difficulty >= 66) return '菁英級';
  if (difficulty >= 56) return '區域強權';
  return '養成入門';
}

function playerStrengthProfile(value = overall()) {
  if (value >= 90) return { label: '世界級球星', short: '世界級' };
  if (value >= 84) return { label: '聯賽王牌', short: '王牌級' };
  if (value >= 76) return { label: '核心戰力', short: '核心級' };
  if (value >= 68) return { label: '穩定先發', short: '先發級' };
  if (value >= 60) return { label: '輪替戰力', short: '輪替級' };
  return { label: '養成球員', short: '養成中' };
}

function roleAgainstLeague(playerOvr, difficulty) {
  const gap = playerOvr - difficulty;
  if (gap >= 10) return '聯賽王牌';
  if (gap >= 3) return '穩定先發';
  if (gap >= -4) return '輪替競爭';
  if (gap >= -10) return '名單邊緣';
  return '越級挑戰';
}

function roundMoney(value) {
  return Math.round(Number(value || 0) * 10) / 10;
}

function moneyLabel(value, empty = '無') {
  if (!value) return empty;
  return `${Number(value).toLocaleString('zh-TW', { maximumFractionDigits: 1 })} 萬`;
}

function startingContract(teamId = 'tw_ms', seasonIndex = 0) {
  const team = TEAMS[teamId] || TEAMS.tw_ms;
  const season = SEASONS[seasonIndex] || SEASONS[0];
  const squad = teamSquadProfile(team);
  const annualSalary = roundMoney(team.salary || 0);
  const student = season.age <= 18;
  return {
    id: `${team.id}-${season.year}-START`, teamId: team.id, type: student ? '一年校隊名額' : season.age <= 22 ? '一年養成約' : '一年過渡約',
    yearsTotal: 1, yearsLeft: 1, annualSalary, monthlySalary: roundMoney(annualSalary / 12), signingBonus: 0,
    guaranteedRate: student ? 0 : 25, cutRisk: student ? 12 : 24, status: 'active', signedYear: season.year,
    squad: team.squad || null, squadLabel: squad?.label || ''
  };
}

function contractForOffer(team, nextSeason, score) {
  const entry = team.entry || 0;
  const margin = score - entry;
  const random = makeSeedRandom(hashSeed(`${state.profile.seed}|${nextSeason.year}|${team.id}|CONTRACT`));
  const aging = state.agingHistory?.find((item) => item.year === nextSeason.year);
  const trendPenalty = aging?.salaryPenalty || 0;
  const squad = teamSquadProfile(team);
  const secondTeam = nextSeason.age > 22 && squad?.key === 'second';
  let years = 1;
  let type = '一年校隊名額';

  if (nextSeason.age <= 18) {
    years = 1;
    type = team.salary ? '一年青年培訓約' : '一年校隊名額';
  } else if (nextSeason.age <= 22) {
    if (team.contractStyle !== 'short' && nextSeason.age === 19 && margin >= 2 && random() > .25) years = 2;
    type = years === 2 ? '兩年養成約' : '短期測試約';
  } else if (secondTeam) {
    years = margin >= 6 && random() > .45 ? 2 : 1;
    type = team.country === 'US' ? '二軍雙向約' : team.country === 'JP' ? '次級聯賽合約' : '二軍養成約';
  } else {
    if (margin >= 5 && team.contractStyle === 'standard') years = 2;
    else if (margin >= 0 && team.contractStyle === 'long') years = margin >= 12 && random() > .35 ? 4 : 3;
    else if (margin >= 5 && !team.contractStyle) years = 2;
    type = years >= 3 ? '球隊長約' : years === 2 ? '標準合約' : '一年證明約';
  }

  const salaryMultiplier = clamp(.82 + margin * .025 + random() * .08, .68, 1.38) * (years === 1 ? 1.08 : years >= 3 ? .96 : 1) * (1 - trendPenalty);
  const annualSalary = roundMoney((team.salary || 0) * salaryMultiplier);
  const bonusRate = nextSeason.age <= 18 ? 0 : years >= 3 ? .2 : years === 2 ? .1 : .04;
  const guaranteedRate = nextSeason.age <= 18 ? 0 : secondTeam ? (years === 2 ? 45 : 20) : years >= 3 ? 80 : years === 2 ? 55 : 25;
  const baseRisk = nextSeason.age <= 18 ? 16 : secondTeam ? (years === 2 ? 20 : 32) : years >= 3 ? 8 : years === 2 ? 15 : 27;
  const cutRisk = Math.round(clamp(baseRisk + (team.difficulty - score) * 1.15, 3, 72));
  return {
    id: `${team.id}-${nextSeason.year}-${hashSeed(`${state.profile.seed}|${team.id}|${nextSeason.year}`).toString(36).slice(0, 5)}`,
    teamId: team.id, type, yearsTotal: years, yearsLeft: years, annualSalary, monthlySalary: roundMoney(annualSalary / 12),
    signingBonus: roundMoney(annualSalary * bonusRate * (1 - trendPenalty * .5)), guaranteedRate, cutRisk, status: 'active', signedYear: nextSeason.year,
    squad: team.squad || null, squadLabel: squad?.label || '',
    abilityAtSigning: overall(), abilityTrend: aging ? -aging.drop : 0, salaryTrendPenalty: Math.round(trendPenalty * 100)
  };
}

function ensureStateSchema(parsed) {
  parsed.version = 3;
  parsed.contractHistory = Array.isArray(parsed.contractHistory) ? parsed.contractHistory : [];
  parsed.agingHistory = Array.isArray(parsed.agingHistory) ? parsed.agingHistory : [];
  const upgradeSummary = (item) => {
    if (!item) return item;
    const team = TEAMS[item.teamId] || Object.values(TEAMS).find((candidate) => candidate.name === item.team) || TEAMS.tw_ms;
    const squad = item.squad || team.squad || null;
    const rosterLabel = item.rosterLabel || (squad === 'first' ? '一軍輪替' : squad === 'second' ? '二軍輪替' : item.role || '校隊輪替');
    const minutes = item.minutes ?? (rosterLabel.includes('先發') || rosterLabel.includes('主力') ? 30 : rosterLabel.includes('輪替') ? 21 : 11);
    return {
      ...item,
      squad,
      squadLabel: item.squadLabel || teamSquadProfile(team)?.label || '',
      gamesPlayed: item.gamesPlayed ?? (item.age < 19 ? 14 : 24),
      minutes,
      rosterLabel,
      rosterStartedAs: item.rosterStartedAs || rosterLabel,
      rosterMovement: item.rosterMovement || '舊版生涯紀錄',
      benchRisk: item.benchRisk ?? (rosterLabel.includes('板凳') || rosterLabel.includes('邊緣') ? 62 : 28)
    };
  };
  parsed.history = Array.isArray(parsed.history) ? parsed.history.map(upgradeSummary) : [];
  parsed.summary = upgradeSummary(parsed.summary);
  parsed.careerStatus = parsed.careerStatus || 'active';
  if (!parsed.contract) {
    parsed.contract = startingContract(parsed.teamId, parsed.seasonIndex);
    if (parsed.mode === 'summary') {
      parsed.contract.yearsLeft = 0;
      parsed.contract.status = 'expired';
    }
  }
  if (!parsed.contractHistory.length) parsed.contractHistory.push({ ...parsed.contract });
  if (!parsed.rosterStatus) {
    const team = TEAMS[parsed.teamId] || TEAMS.tw_ms;
    parsed.rosterStatus = buildRosterStatus(team, { source: parsed, transfer: false, season: SEASONS[parsed.seasonIndex] });
  }
  return parsed;
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
  const contract = startingContract('tw_ms', 0);
  const rosterStatus = buildRosterStatus(TEAMS.tw_ms, { source: { stats, trust: 22, history: [], seasonIndex: 0 }, transfer: false, season: SEASONS[0] });
  return {
    version: 3,
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
    contract,
    contractHistory: [{ ...contract }],
    agingHistory: [],
    rosterStatus,
    careerStatus: 'active',
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
    if (!parsed || ![1, 2, 3].includes(parsed.version) || !parsed.profile || !parsed.stats) return null;
    return ensureStateSchema(parsed);
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
  const squad = teamSquadProfile(team);
  const roster = state.rosterStatus;
  const ovr = overall();
  const ageTrend = state.agingHistory?.find((item) => item.year === season.year);
  const badge = state.badges.length ? BADGES[state.badges[state.badges.length - 1]].label : '尚未形成打法';
  $('#player-panel').innerHTML = `
    <div class="eyebrow">PLAYER FILE / ${state.profile.seed || String(state.seasonIndex + 1).padStart(4, '0')}</div>
    <div class="player-card">
      <div class="jersey" style="--team:${team.color}">${POSITIONS[state.profile.position].number}</div>
      <div><h2>${escapeHtml(state.profile.name)}</h2><p>${COUNTRIES[team.country].name} · ${season.age} 歲 · ${state.profile.position}${squad ? ` · ${squad.label}` : ''}</p><small>${badge}${roster ? ` · ${roster.label}` : ''}</small></div>
    </div>
    <div class="rating-block"><span>綜合評分</span><strong>${ovr}</strong><small>${ageTrend ? `年齡曲線 ${ageTrend.before}→${ageTrend.after}` : 'OVR'}</small></div>
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
  $('#mobile-hud').innerHTML = `<span><small>${escapeHtml(state.profile.name)}</small><b>${ovr} OVR</b></span><span><small>${season.age} 歲 · ${roster?.label || '競爭中'}</small><b>${COUNTRIES[team.country].flag} · ${team.name}</b></span><span><small>脈衝</small><b>${Math.round(state.rhythm)} / ${Math.round(state.trust)} / ${Math.round(state.load)}</b></span>`;
}

function resourceMeter(label, value, type) {
  const displayValue = Math.round(value);
  const danger = type === 'load' && value >= 70;
  return `<div class="meter ${danger ? 'danger' : ''}"><span>${label}<b>${displayValue}%</b></span><i style="--fill:${displayValue}%"></i></div>`;
}

function renderWorldPanel() {
  const team = currentTeam();
  const season = currentSeason();
  const squad = teamSquadProfile(team);
  const roster = state.rosterStatus;
  const contract = state.contract || startingContract(team.id, state.seasonIndex);
  const contractStatus = { active: '合約中', expired: '到期', released: '被釋出', eliminated: '遭淘汰' }[contract.status] || '待確認';
  $('#world-panel').innerHTML = `
    <div class="eyebrow">WORLD BOARD / ${season.year}</div>
    <div class="world-title"><div><h2>五國生涯版圖</h2><p>${team.league}${squad ? ` · ${squad.label}` : ''}</p></div><span>${COUNTRIES[team.country].flag}</span></div>
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
    <div class="contract-card ${contract.status !== 'active' ? 'contract-alert' : ''}">
      <div><small>CONTRACT / ${contractStatus}${squad ? ` · ${squad.label}` : ''}</small><b>${contract.type}</b></div>
      <dl><div><dt>剩餘</dt><dd>${contract.yearsLeft} 年</dd></div><div><dt>月薪</dt><dd>${moneyLabel(contract.monthlySalary, '學生')}</dd></div><div><dt>淘汰風險</dt><dd>${contract.cutRisk}%</dd></div></dl>
    </div>
    <div class="roster-card ${roster?.benchRisk >= 55 ? 'roster-alert' : ''}"><div><small>ROTATION / 隊內角色</small><b>${roster?.label || '等待定位'}</b></div><p>預估場均 ${roster?.minutes || '—'} 分鐘 · 板凳風險 ${roster?.benchRisk ?? '—'}%</p><span>${roster?.reason || '教練會依表現安排上場時間'}</span></div>
    <div class="goal-card"><small>SEASON TARGET</small><b>${season.target}</b><p>${team.name} · ${season.name}</p></div>
    <div class="career-feed"><small>CAREER LOG</small>${state.history.slice(-3).reverse().map((item) => `<p><b>${item.year}</b><span>${COUNTRIES[item.country].flag} ${item.team}</span><em>${item.record}</em></p>`).join('') || '<p class="empty">第一筆紀錄會在賽季結束後出現。</p>'}</div>`;
}

function countryTrainingCopy(country) {
  return {
    TW: ['放學後的空球館', '隊友先去搭車了，你還留在球館。學長把球傳過來：「別什麼都練，今天先把最弱的地方做好。」'],
    JP: ['早上六點四十分集合', '天還沒亮，全隊已經開始跑戰術。助教把個人訓練表交給你，要你先選一個最需要改善的問題。'],
    KR: ['晚餐後的影片課', '教練剪出你上一場的三次失誤。影片課只剩四十分鐘，你得先找出最常重複的那個問題。'],
    CN: ['二十二人搶十二個位置', '青年隊有二十二人，但正式名單只有十二格。今天教練會記錄每一組訓練，你得讓自己的優點被看見。'],
    US: ['三組球探坐在場邊', '球探沒有一直看得分，他們也在記錄傳球、防守和失誤後的反應。輪到你上場前，你要先準備哪一項？']
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
      story: season.age < 19 ? '明天的十二人名單還沒公布。你可以留下來幫全隊跑熟戰術，也可以去加強自己最有機會被教練看見的能力。' : '經紀人安排了臨時測試，隊友同時約你留下加練。測試會增加曝光，團練則會影響你在隊內的信任。',
      quote: '教練：一次選擇不會決定全部，但隊友會記得你有沒有一起扛。', value: '02', valueLabel: 'LOCKER ROOM', tint: '#dfff00',
      actions: [
        { code: 'A', title: '陪隊友把戰術練熟', desc: '留下來幫替補隊友，讓大家都知道該怎麼跑。', primary: 'playmaking', secondary: 'iq', tag: 'connector', difficulty: team.difficulty - 7, growth: 1.4, deltas: { trust: 10, load: 4, reputation: -1 }, success: '大家終於跑對位置。明天不管誰上場，球隊都更有默契。', failure: '大家都很累，戰術還是有點亂。但隊友知道你沒有先跑掉。' },
        { code: 'B', title: '去參加球探測試', desc: '秀出你最強的能力，讓更多球隊看到你。', primary: strongestStat(), secondary: 'athletic', tag: statTag(strongestStat()), difficulty: team.difficulty - 3, growth: 1.2, deltas: { scout: 9, reputation: 4, load: 6, trust: -2 }, success: '你的測試數字很亮眼。球探真的把你的名字記下來了。', failure: '今天沒有打出最好表現，但球探看到你失誤後有馬上調整。' },
        { code: 'C', title: '今天先好好休息', desc: '放下手機，讓身體和腦袋都充滿電。', primary: 'athletic', secondary: 'iq', tag: 'iron', difficulty: team.difficulty - 13, growth: .8, deltas: { load: -22, rhythm: -3, trust: 1 }, success: '你睡飽了，隔天整個人都輕很多。休息也是訓練的一部分。', failure: '你還是有點緊張，但身體沒那麼累了。先穩住就好。' }
      ]
    };
  }
  const opponent = country.opponent[(state.seasonIndex + state.profile.name.length + team.name.length) % country.opponent.length];
  const scenarioIndex = hashSeed(`${state.profile.seed}|${season.year}|${team.id}|CLUTCH`) % CLUTCH_SCENARIOS.length;
  const scenario = CLUTCH_SCENARIOS[scenarioIndex];
  return {
    kicker: `WEEK 03 · ${team.league.toUpperCase()}`, title: `${season.name} · ${scenario.title}`, story: scenario.story(opponent), quote: scenario.quote,
    value: scenario.clock, valueLabel: 'SECONDS', tint: '#ff5a1f', game: true, prompt: scenario.prompt, hint: scenario.hint, score: scenario.score,
    actions: gameActions(scenario)
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

function gameActions(scenario) {
  const keys = scenario.actionKeys === 'position' ? POSITION_CLUTCH_ACTIONS[state.profile.position] : scenario.actionKeys;
  const season = currentSeason();
  const team = currentTeam();
  return keys.map((key, index) => ({
    ...TACTICS[key],
    difficulty: team.difficulty + season.pressure + scenario.difficulty + index - (state.seasonIndex < 3 ? 3 : 0),
    growth: 1.2,
    game: true
  }));
}

function renderArena() {
  const event = buildEvent();
  const season = currentSeason();
  const team = currentTeam();
  $('#arena-head').innerHTML = `<div><span>${season.year} / ${COUNTRIES[team.country].flag} · ${team.league}</span><h1>${event.title}</h1></div><div class="week-chip">AGE <b>${season.age}</b><small>${season.name}</small></div>`;
  $('#court-scene').style.setProperty('--court-tint', event.tint);
  $('#scene-copy').innerHTML = `<small>${event.kicker}</small><p>${event.story}</p><blockquote>${event.quote}</blockquote>`;
  $('#scoreboard').innerHTML = `<span>${event.valueLabel}</span><b>${event.value}</b><small>${event.game ? event.score : `WEEK ${state.week + 1}`}</small>`;
  if (state.mode === 'summary') renderSummary();
  else if (state.pendingResult) renderResult();
  else renderDecisions(event);
}

function renderDecisions(event) {
  $('#decision-zone').innerHTML = `
    <div class="decision-head"><div><small>${event.game ? 'CLUTCH DECISION' : 'CAREER DECISION'} · PULSE ENGINE</small><h2>${event.game ? event.prompt : '這週要練什麼？'}</h2></div><p>${event.game ? event.hint : '看能力、手感、隊友信任和疲勞，再做選擇。'}</p></div>
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
        <h2>${result.game ? (result.success ? '關鍵攻防拿下了！' : '這波沒能守住。') : (result.success ? '成功，訓練有收到效果。' : '這次沒做好，但問題更清楚了。')}</h2>
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

function resolveContractOutcome(team, averageMargin, roster) {
  const contract = state.contract || startingContract(team.id, state.seasonIndex);
  const playerGap = overall() - team.difficulty;
  const rosterPressure = team.level === 'pro' ? ((roster?.benchRisk || 35) - 35) * .16 : 0;
  const pressureRisk = contract.cutRisk - averageMargin * 1.6 - playerGap * .55 - (state.trust - 45) * .12 - state.reputation * .015 + (state.load >= 75 ? 5 : 0) + rosterPressure;
  const risk = Math.round(clamp(pressureRisk, 2, 82));
  const finalSeason = state.seasonIndex === SEASONS.length - 1;
  const released = !finalSeason && randomBetween(0, 100) < risk;
  contract.yearsLeft = Math.max(0, contract.yearsLeft - 1);

  let eliminated = false;
  if (released && currentSeason().age >= 19 && SEASONS[state.seasonIndex + 1]) {
    const nextAge = SEASONS[state.seasonIndex + 1].age;
    const nextMinimum = Math.min(...offerPool(nextAge).map((id) => TEAMS[id].entry || 0));
    const scoreGap = nextMinimum - marketScore();
    const eliminationChance = clamp(18 + risk * .45 + Math.max(0, scoreGap) * 2, 18, 68);
    eliminated = scoreGap >= 7 && randomBetween(0, 100) < eliminationChance;
  }

  if (eliminated) contract.status = 'eliminated';
  else if (released) contract.status = 'released';
  else if (contract.yearsLeft <= 0 || finalSeason) contract.status = 'expired';
  else contract.status = 'active';

  state.contract = contract;
  state.careerStatus = eliminated ? 'eliminated' : released ? 'free_agent' : 'active';
  const result = eliminated ? '遭到淘汰' : released ? '被球隊釋出' : contract.status === 'expired' ? '合約到期' : roster?.label?.includes('板凳') || roster?.label?.includes('邊緣') ? '留隊但仍在板凳' : risk >= 35 ? '驚險留隊' : '安全留隊';
  return { risk, released, eliminated, continues: contract.status === 'active' && contract.yearsLeft > 0, result };
}

function finishSeason() {
  const season = currentSeason();
  const team = currentTeam();
  const averageMargin = state.seasonMargins.reduce((sum, value) => sum + value, 0) / Math.max(1, state.seasonMargins.length);
  const winRate = clamp(.42 + averageMargin / 55 + state.trust / 500, .18, .88);
  const games = season.age < 19 ? 14 : 24;
  const wins = Math.round(games * winRate);
  const losses = games - wins;
  const roster = completeRosterSeason(team, averageMargin);
  state.rosterStatus = roster;
  const role = clamp((overall() - team.difficulty + 18) / 32, .2, 1);
  const ppg = Math.max(.6, (2 + state.stats.finish * .13 + state.stats.shooting * .14 + role * 4 + randomBetween(-1, 1)) * roster.statFactor).toFixed(1);
  const rpg = Math.max(.2, (.5 + (state.stats.athletic + state.stats.defense) * .055 + (['PF', 'C'].includes(state.profile.position) ? 2.2 : 0)) * roster.statFactor).toFixed(1);
  const apg = Math.max(.2, (.5 + (state.stats.playmaking + state.stats.iq) * .05 + (state.profile.position === 'PG' ? 2.2 : 0)) * roster.statFactor).toFixed(1);
  const champion = winRate > .72 && state.seasonSuccesses >= 2;
  if (champion) state.trophies += 1;
  const exposure = team.level === 'pro' ? clamp(roster.minutes / 28, .32, 1.08) : 1;
  state.reputation += Math.round((team.prestige * 2 + winRate * 6 + (champion ? 8 : 0)) * exposure);
  state.scout += Math.round((team.prestige * 2 + Math.max(0, averageMargin / 3)) * exposure);
  const earned = roundMoney(state.contract?.annualSalary ?? team.salary);
  state.income = roundMoney(state.income + earned);
  const contractOutcome = resolveContractOutcome(team, averageMargin, roster);
  state.load = clamp(state.load - 18);
  const playerOvr = overall();
  const summary = {
    year: season.year, age: season.age, stage: season.stage, teamId: team.id, country: team.country, team: team.name, league: team.league,
    squad: team.squad || null, squadLabel: teamSquadProfile(team)?.label || '',
    record: `${wins}–${losses}`, wins, losses, ppg, rpg, apg, champion, ovr: playerOvr, averageMargin,
    gamesPlayed: roster.gamesPlayed, minutes: roster.minutes, rosterLabel: roster.label, rosterStartedAs: roster.startedAs, rosterMovement: roster.movement, benchRisk: roster.benchRisk,
    progress: `${state.seasonIndex + 1} / ${SEASONS.length}`, leagueDifficulty: team.difficulty, leagueStrength: leagueStrengthLabel(team.difficulty),
    playerStrength: playerStrengthProfile(playerOvr).label, role: roleAgainstLeague(playerOvr, team.difficulty), marketScore: marketScore(),
    earned, totalIncome: state.income, contract: { ...state.contract }, contractRisk: contractOutcome.risk,
    contractResult: contractOutcome.result, contractContinues: contractOutcome.continues, released: contractOutcome.released, eliminated: contractOutcome.eliminated
  };
  state.history.push(summary);
  state.summary = summary;
  state.mode = 'summary';
}

function renderSummary() {
  const summary = state.summary;
  const careerEnded = summary.eliminated || state.careerStatus === 'eliminated';
  const finalSeason = state.seasonIndex === SEASONS.length - 1;
  const nextAction = careerEnded ? '生涯遭淘汰 · 查看結果' : finalSeason ? '完成生涯' : summary.contractContinues ? `履行長約 · 剩 ${summary.contract.yearsLeft} 年` : summary.released ? '成為自由球員 · 尋找機會' : '查看下一站合約';
  $('#decision-zone').innerHTML = `
    <div class="summary-zone">
      <div class="summary-mark ${summary.champion ? 'champion' : ''} ${careerEnded ? 'eliminated' : ''}"><small>${careerEnded ? 'CAREER CUT' : summary.champion ? 'CHAMPION' : 'SEASON COMPLETE'}</small><b>${summary.record}</b><span>${summary.league}</span></div>
      <div class="summary-copy"><small>${summary.year} · AGE ${summary.age} · 進度 ${summary.progress}</small><h2>${careerEnded ? '這次真的被淘汰了，生涯在這裡停下。' : summary.champion ? '冠軍拿到了！這季真的頂。' : '球季結束，這是你的進度報告。'}</h2>
        <div class="box-score"><span><b>${summary.ppg}</b> PTS</span><span><b>${summary.rpg}</b> REB</span><span><b>${summary.apg}</b> AST</span><span><b>${summary.ovr}</b> OVR</span></div>
        <div class="season-report-grid">
          <span><small>自身強度</small><b>${summary.playerStrength}</b></span><span><small>聯賽難度</small><b>${summary.leagueStrength} · ${summary.leagueDifficulty}</b></span><span><small>目前定位</small><b>${summary.role}</b></span>
          <span class="${summary.benchRisk >= 55 ? 'danger' : ''}"><small>隊內角色 · 板凳風險 ${summary.benchRisk}%</small><b>${summary.rosterLabel}</b></span><span><small>出賽／場均時間</small><b>${summary.gamesPlayed} 場 · ${summary.minutes} 分</b></span><span><small>角色變化</small><b>${summary.rosterMovement}</b></span>
          <span><small>市場評級</small><b>${summary.marketScore.toFixed(1)}</b></span><span class="${summary.released || summary.eliminated ? 'danger' : ''}"><small>合約結果 · 風險 ${summary.contractRisk}%</small><b>${summary.contractResult}</b></span><span><small>本季／生涯收入</small><b>${moneyLabel(summary.earned, '學生')}／${moneyLabel(summary.totalIncome, '0 萬')}</b></span>
        </div>
        <p>${seasonSummaryLine(summary)}</p>
        <button type="button" class="next-button" id="market-button">${nextAction} <b>→</b></button>
      </div>
    </div>`;
  $('#market-button').addEventListener('click', () => {
    if (careerEnded || finalSeason) showEnding();
    else if (summary.contractContinues) continueCurrentContract();
    else showOffers();
  });
}

function seasonSummaryLine(summary) {
  if (summary.eliminated) return '自由球員市場關閉前，沒有球隊願意再提供名額。這次生涯到此結束，但走過的學校、球隊與成就都會留在生涯卡。';
  if (summary.released) return `球隊在 ${summary.contract.type} 尚未走完前決定釋出你。接下來會以自由球員身分找隊，市場評級將直接影響你能拿到的合約。`;
  if (summary.squad === 'second') return `${summary.rosterMovement}。你已完成 ${COUNTRIES[summary.country].name} 的養成資歷；下一次進入轉隊市場時，當地一軍會開放，但仍要達到球隊要求的市場評級。`;
  if (summary.squad === 'first' && (summary.rosterLabel.includes('板凳') || summary.rosterLabel.includes('邊緣'))) return `你從「${summary.rosterStartedAs}」開始，本季最後是「${summary.rosterLabel}」，場均 ${summary.minutes} 分鐘。合約還在不代表位置安全，下一季要靠表現搶進固定輪替。`;
  if (summary.squad === 'first') return `${summary.rosterMovement}，本季出賽 ${summary.gamesPlayed} 場、場均 ${summary.minutes} 分鐘。升上一軍只是拿到機會，角色還是每季重新競爭。`;
  if (summary.contractContinues) return `你達成球隊本季要求，保住名單位置。${summary.contract.type} 還剩 ${summary.contract.yearsLeft} 年，下一季將留在原隊。`;
  if (summary.contractResult === '合約到期') return '這份合約已經完整跑完。下一站除了球隊強度，也要一起比較年薪、簽約金、保障比例與淘汰風險。';
  if (summary.champion) return '你們贏下本季最後一場並拿到冠軍。球隊聲望提高，其他國家的球探也開始把你列入觀察名單。';
  if (summary.averageMargin > 3) return '你在本季三次重要選擇中大多執行成功，教練給了更多球權，海外球探的評價也往上升。';
  if (summary.averageMargin > -4) return '表現沒有大爆發，但失誤與疲勞都在可控範圍。你仍在輪替競爭內，也有機會換到更適合的環境。';
  return '本季在高強度比賽中吃了不少虧。能力沒有消失，但下一季要先處理最弱的一項技術與疲勞問題。';
}

function marketScore() {
  return overall() + state.scout * .14 + state.reputation * .06 + state.trophies * 1.5;
}

function applyAgeCurve(nextSeason) {
  if (!nextSeason || nextSeason.age < 30) return null;
  state.agingHistory = Array.isArray(state.agingHistory) ? state.agingHistory : [];
  const existing = state.agingHistory.find((item) => item.year === nextSeason.year);
  if (existing) return existing;

  const before = overall();
  const baseDecline = nextSeason.age >= 34 ? 2.8 : 1.45;
  const fatigueDecline = Math.max(0, state.load - 55) * .018;
  const ironProtection = state.profile.seedTrait === 'iron' ? .72 : 1;
  const declineWeights = { finish: .9, shooting: .45, playmaking: .35, defense: .75, athletic: 1.25, iq: .15 };
  const changes = {};

  Object.entries(declineWeights).forEach(([stat, weight]) => {
    const loss = Math.round((baseDecline * weight + fatigueDecline) * ironProtection * 10) / 10;
    const oldValue = state.stats[stat];
    state.stats[stat] = clamp(oldValue - loss, 35, 99);
    changes[stat] = Math.round((state.stats[stat] - oldValue) * 10) / 10;
  });

  const after = overall();
  const drop = Math.max(0, before - after);
  const salaryPenalty = clamp(drop * .055 + (nextSeason.age >= 34 ? .015 : 0), 0, .24);
  const record = { year: nextSeason.year, age: nextSeason.age, before, after, drop, salaryPenalty, changes };
  state.agingHistory.push(record);
  saveGame();
  return record;
}

function offerPool(nextAge) {
  if (nextAge <= 15) return ['tw_ms'];
  if (nextAge <= 18) return ['tw_high', 'jp_high', 'kr_high', 'cn_youth', 'us_prep'];
  if (nextAge <= 22) return ['tw_uni', 'tw_rookie', 'jp_uni', 'kr_uni', 'cn_dev', 'us_juco', 'us_ncaa'];
  return PRO_TEAM_IDS;
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
  if (nextAge >= 23) return sorted;
  const selected = [];
  const local = pool.find((team) => team.country === 'TW' && score >= team.entry - 5) || pool[0];
  selected.push(local);
  sorted.forEach((team) => { if (selected.length < 5 && !selected.includes(team)) selected.push(team); });
  return selected;
}

function offerThreshold(team) {
  const base = team.entry || 0;
  if (team.id === 'tw_ms') return 0;
  const localAdjustment = team.country === 'TW' ? (state.careerStatus === 'free_agent' ? 12 : 5) : 0;
  const secondTeamAdjustment = team.squad === 'second' ? 3 : 0;
  return Math.max(0, base - localAdjustment - secondTeamAdjustment);
}

function offerEligibility(team, score) {
  const threshold = offerThreshold(team);
  const path = firstTeamPathStatus(team);
  if (!path.unlocked) return { eligible: false, threshold, path, short: '需二軍資歷', reason: path.reason };
  if (score < threshold) return { eligible: false, threshold, path, short: `評級需 ${threshold}`, reason: `目前市場評級不足，至少需要 ${threshold}` };
  return { eligible: true, threshold, path, short: '可以簽約', reason: path.reason };
}

function isOfferEligible(team, score) {
  return offerEligibility(team, score).eligible;
}

function renderOfferMarket() {
  const offers = generateOffers();
  const score = marketScore();
  const nextSeason = SEASONS[state.seasonIndex + 1];
  const proMarket = nextSeason.age >= 23;
  const countryOffers = proMarket && offerCountryFilter !== 'ALL' ? offers.filter((team) => team.country === offerCountryFilter) : offers;
  const visibleOffers = proMarket && offerSquadFilter !== 'ALL' ? countryOffers.filter((team) => team.squad === offerSquadFilter) : countryOffers;
  const aging = state.agingHistory?.find((item) => item.year === nextSeason.year);
  $('#offer-count').textContent = `${visibleOffers.filter((team) => isOfferEligible(team, score)).length} OPEN / ${visibleOffers.length}${proMarket ? ` · TOTAL ${offers.length}` : ''}`;
  $('#offer-title').textContent = nextSeason.age >= 23 ? '職業球隊來找你了' : '下一站要去哪？';
  $('#offer-lead').textContent = `市場評級 ${score.toFixed(1)}。第一次進入某國職業環境，只能先選當地二軍／次級；完成一季後才解鎖該國一軍。就算升上一軍，第一季也會從板凳觀察開始。${aging ? `進入 ${aging.age} 歲球季，能力從 ${aging.before} 降到 ${aging.after} OVR；新合約的月薪與簽約金已套用約 ${Math.round(aging.salaryPenalty * 100)}% 的下滑影響。` : ''}`;
  $('#offer-country-filter').hidden = !proMarket;
  $('#offer-country-filter').innerHTML = proMarket ? ['ALL', ...Object.keys(COUNTRIES)].map((key) => {
    const count = key === 'ALL' ? offers.length : offers.filter((team) => team.country === key).length;
    const label = key === 'ALL' ? '全部' : COUNTRIES[key].name;
    return `<button type="button" data-offer-country="${key}" class="${offerCountryFilter === key ? 'active' : ''}">${label}<b>${count}</b></button>`;
  }).join('') : '';
  $('#offer-squad-filter').hidden = !proMarket;
  $('#offer-squad-filter').innerHTML = proMarket ? [
    { key: 'ALL', label: '全部層級' },
    { key: 'first', label: '一軍' },
    { key: 'second', label: '二軍／次級' }
  ].map(({ key, label }) => {
    const count = key === 'ALL' ? countryOffers.length : countryOffers.filter((team) => team.squad === key).length;
    return `<button type="button" data-offer-squad="${key}" class="${offerSquadFilter === key ? 'active' : ''}">${label}<b>${count}</b></button>`;
  }).join('') : '';
  $('#offer-grid').innerHTML = visibleOffers.map((team) => {
    const eligibility = offerEligibility(team, score);
    const eligible = eligibility.eligible;
    const country = COUNTRIES[team.country];
    const squad = teamSquadProfile(team);
    const contract = contractForOffer(team, nextSeason, score);
    const predictedRoster = buildRosterStatus(team, { source: state, transfer: true, previousTeamId: currentTeam().id, season: nextSeason });
    const squadNote = squad?.key === 'second' ? '完成當地二軍一季，才會開放該國一軍' : '簽進一軍先從板凳觀察，不會直接變先發';
    return `<button type="button" data-offer="${team.id}" class="${eligible ? '' : 'locked'}" ${eligible ? '' : 'disabled'} style="--offer:${team.color}">
      <div><i>${country.flag}</i><span>${country.name} · ${squad?.label || '職業隊'}</span><em>${eligible ? contract.type : eligibility.short}</em></div>
      <h3>${team.name}</h3><p>${team.league} · ${squad?.basis || '職業層級'}</p>
      <dl><div><dt>球隊層級</dt><dd>${squad?.label || '職業隊'}</dd></div><div><dt>當地職業資歷</dt><dd>${eligibility.path?.seasons || 0} 季</dd></div><div><dt>預計隊內角色</dt><dd>${predictedRoster.label}</dd></div><div><dt>預估場均時間</dt><dd>${predictedRoster.minutes} 分鐘</dd></div><div><dt>聯賽強度</dt><dd>${leagueStrengthLabel(team.difficulty)} · ${team.difficulty}</dd></div><div><dt>合約長度</dt><dd>${contract.yearsTotal} 年</dd></div><div><dt>年薪／月薪</dt><dd>${moneyLabel(contract.annualSalary, '學生')}／${moneyLabel(contract.monthlySalary, '—')}</dd></div><div><dt>簽約金</dt><dd>${moneyLabel(contract.signingBonus)}</dd></div><div><dt>簽約時能力</dt><dd>${contract.abilityAtSigning} OVR</dd></div><div><dt>能力走勢</dt><dd>${contract.abilityTrend < 0 ? `${contract.abilityTrend} · 薪資 -${contract.salaryTrendPenalty}%` : '持平'}</dd></div><div><dt>薪資保障</dt><dd>${contract.guaranteedRate}%</dd></div><div><dt>預估淘汰風險</dt><dd>${contract.cutRisk}%</dd></div></dl>
      <small>${eligible ? `${squadNote} · 點擊簽約` : eligibility.reason}</small>
    </button>`;
  }).join('');
  document.querySelectorAll('[data-offer-country]').forEach((button) => button.addEventListener('click', () => {
    offerCountryFilter = button.dataset.offerCountry;
    renderOfferMarket();
  }));
  document.querySelectorAll('[data-offer-squad]').forEach((button) => button.addEventListener('click', () => {
    offerSquadFilter = button.dataset.offerSquad;
    renderOfferMarket();
  }));
  document.querySelectorAll('[data-offer]:not(:disabled)').forEach((button) => button.addEventListener('click', () => acceptOffer(button.dataset.offer)));
}

function showOffers() {
  const nextSeason = SEASONS[state.seasonIndex + 1];
  applyAgeCurve(nextSeason);
  offerCountryFilter = nextSeason.age >= 23 ? currentTeam().country : 'ALL';
  offerSquadFilter = 'ALL';
  renderOfferMarket();
  $('#offer-dialog').showModal();
}

function acceptOffer(teamId) {
  const team = TEAMS[teamId];
  const nextSeason = SEASONS[state.seasonIndex + 1];
  const eligibility = offerEligibility(team, marketScore());
  if (!eligibility.eligible) {
    showToast(eligibility.reason);
    return;
  }
  const contract = contractForOffer(team, nextSeason, marketScore());
  state.contract = contract;
  state.contractHistory.push({ ...contract });
  state.income = roundMoney(state.income + contract.signingBonus);
  state.careerStatus = 'active';
  startNextSeason(team, true);
  $('#offer-dialog').close();
  showToast(`已簽下 ${contract.yearsTotal} 年合約：${team.name} · ${state.rosterStatus.label}`);
}

function continueCurrentContract() {
  const team = currentTeam();
  const nextSeason = SEASONS[state.seasonIndex + 1];
  const aging = applyAgeCurve(nextSeason);
  startNextSeason(team, false);
  showToast(aging ? `續留 ${team.name} · ${state.rosterStatus.label} · 能力 ${aging.before} → ${aging.after}` : `續留 ${team.name} · ${state.rosterStatus.label}`);
}

function startNextSeason(team, transfer) {
  const previousTeam = currentTeam();
  const previousCountry = state.history.at(-1)?.country;
  const nextSeason = SEASONS[state.seasonIndex + 1];
  applyAgeCurve(nextSeason);
  const rosterStatus = buildRosterStatus(team, { source: state, transfer, previousTeamId: previousTeam.id, season: nextSeason });
  state.teamId = team.id;
  if (!state.visited.includes(team.country)) state.visited.push(team.country);
  state.seasonIndex += 1;
  state.week = 0;
  state.mode = 'event';
  state.pendingResult = null;
  state.summary = null;
  state.seasonMargins = [];
  state.seasonSuccesses = 0;
  state.rosterStatus = rosterStatus;
  state.rhythm = clamp(48 + (state.rhythm - 50) * .35);
  state.trust = transfer ? (team.country === previousCountry ? clamp(state.trust * .7) : 20) : clamp(state.trust * .82 + 6);
  state.load = clamp(state.load - 12);
  saveGame();
  renderAll();
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
  const careerComplete = state.careerStatus === 'eliminated' || (state.seasonIndex === SEASONS.length - 1 && state.history.some((item) => item.year === finalSeason.year));
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
      squadLabel: item.squadLabel || teamSquadProfile(team)?.label || '',
      rosterLabel: item.rosterLabel || '',
      minutes: item.minutes,
      record: item.record || '—',
      champion: Boolean(item.champion),
      current: false
    };
  });
  const season = currentSeason();
  const team = currentTeam();
  const alreadyRecorded = route.some((item) => item.year === season.year && item.team === team.name);
  if (!alreadyRecorded) {
    route.push({ year: season.year, stage: season.stage, country: team.country, team: team.name, squadLabel: teamSquadProfile(team)?.label || '', rosterLabel: state.rosterStatus?.label || '', minutes: state.rosterStatus?.minutes, record: '進行中', champion: false, current: true });
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
    { unlocked: state.contractHistory?.some((contract) => contract.yearsTotal >= 3), title: '長約到手', desc: '用表現換到至少三年的球隊保障' },
    { unlocked: state.income >= 500, title: '五百萬俱樂部', desc: `生涯收入累積 ${Math.round(state.income)} 萬` },
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
  const contractHistory = state.contractHistory || [];
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
      <section><small>SCHOOLS & TEAMS / 生涯學校與球隊</small><div class="career-path-list">${route.map((item) => `<div class="${item.current ? 'current' : ''}"><i>${item.year}</i><b>${COUNTRIES[item.country]?.flag || item.country}</b><span><strong>${escapeHtml(item.team)}</strong><small>${item.stage}${item.squadLabel ? ` · ${item.squadLabel}` : ''}${item.rosterLabel ? ` · ${item.rosterLabel}` : ''}${item.minutes != null ? ` ${item.minutes} MPG` : ''} · ${item.record}${item.champion ? ' · 冠軍' : ''}</small></span></div>`).join('')}</div></section>
      <section><small>ACHIEVEMENTS / 生涯成就</small><div class="achievement-grid">${achievements.map((item, index) => `<div><i>${String(index + 1).padStart(2, '0')}</i><span><b>${item.title}</b><small>${item.desc}</small></span></div>`).join('')}</div></section>
      <section class="contract-ledger"><small>CONTRACTS / 生涯合約</small><div>${contractHistory.map((contract) => { const contractTeam = TEAMS[contract.teamId] || TEAMS.tw_ms; const squadLabel = contract.squadLabel || teamSquadProfile(contractTeam)?.label || ''; const trend = contract.salaryTrendPenalty ? ` · 能力下滑影響 -${contract.salaryTrendPenalty}%` : ''; return `<span><i>${contract.signedYear}</i><b>${escapeHtml(contractTeam.name)}</b><em>${contract.type}${squadLabel ? ` · ${squadLabel}` : ''} · ${contract.yearsTotal} 年 · 年薪 ${moneyLabel(contract.annualSalary, '學生')} · 月薪 ${moneyLabel(contract.monthlySalary, '—')} · 簽約金 ${moneyLabel(contract.signingBonus)}${trend}</em></span>`; }).join('')}</div></section>
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
  const wasEliminated = state.careerStatus === 'eliminated';
  const endingYear = last?.year || currentSeason().year;
  const routeCopy = first && last ? `${escapeHtml(state.profile.name)} 從 ${escapeHtml(first.team)} 開始打球，最後來到 ${escapeHtml(last.team)}。` : `${escapeHtml(state.profile.name)} 完成了這段籃球旅程。`;
  $('#ending-content').innerHTML = `
    <div class="ending-grade"><small>CAREER GRADE</small><b>${ending.grade}</b><span>${Math.round(ending.score)} LEGACY</span></div>
    <div class="ending-copy"><small>${endingYear} · ${wasEliminated ? 'CAREER CUT' : 'CAREER COMPLETE'}</small><h2>${wasEliminated ? '這次沒守住名單，但你的紀錄都還在。' : ending.title}</h2><p>${routeCopy}你去過 ${state.visited.length} 個國家、拿到 ${state.trophies} 座冠軍。${wasEliminated ? '職業世界很硬，短約和表現真的會決定能不能留下。' : '每一站、每一個選擇，都是你自己決定的。'}名人堂評選：${hall.label}。</p></div>
    <div class="ending-numbers"><span><b>${overall()}</b> 最終 OVR</span><span><b>${state.wins}–${state.losses}</b> 關鍵回合</span><span><b>${state.trophies}</b> 冠軍</span><span><b>${state.visited.length}</b> 國家</span></div>
    <div class="ending-route">${state.history.map((item) => `<div><i>${item.year}</i><b>${COUNTRIES[item.country].flag}</b><span>${item.team}<small>${item.record} · ${item.rosterLabel || item.role} · ${item.minutes ?? '—'} MPG · ${item.ppg} PTS</small></span></div>`).join('')}</div>
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
