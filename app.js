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
  // 預估成年體型範圍以 2025–26 NBA 官方名單與選秀體測為基準，再放寬給台、日、韓、中、美多聯賽生涯。
  PG: { name: '控球後衛', desc: '創造與球商', number: 3, height: 188, weight: 84, heightRange: [170, 198], weightRange: [65, 100], bonus: { playmaking: 5, iq: 4, shooting: 1 }, caps: { finish: 9, shooting: 11, playmaking: 13, defense: 10, athletic: 11, iq: 13 } },
  SG: { name: '得分後衛', desc: '投射與終結', number: 7, height: 195, weight: 92, heightRange: [178, 205], weightRange: [72, 108], bonus: { shooting: 5, finish: 4, athletic: 1 }, caps: { finish: 12, shooting: 13, playmaking: 10, defense: 11, athletic: 11, iq: 10 } },
  SF: { name: '小前鋒', desc: '全能與防守', number: 13, height: 201, weight: 100, heightRange: [185, 211], weightRange: [78, 118], bonus: { defense: 3, finish: 3, athletic: 3, iq: 1 }, caps: { finish: 12, shooting: 11, playmaking: 10, defense: 12, athletic: 12, iq: 10 } },
  PF: { name: '大前鋒', desc: '對抗與空間', number: 21, height: 207, weight: 109, heightRange: [192, 218], weightRange: [85, 130], bonus: { finish: 4, defense: 3, athletic: 3 }, caps: { finish: 13, shooting: 10, playmaking: 8, defense: 13, athletic: 12, iq: 10 } },
  C: { name: '中鋒', desc: '護框與籃板', number: 34, height: 213, weight: 118, heightRange: [198, 226], weightRange: [92, 142], bonus: { defense: 5, athletic: 3, finish: 2 }, caps: { finish: 13, shooting: 8, playmaking: 7, defense: 14, athletic: 12, iq: 10 } }
};

const STYLES = {
  street: { name: '巷口魔術師', code: 'CREATOR', desc: '節奏 +8；愛變速、愛傳妙球，防守很難猜。', bonus: { playmaking: 4, finish: 2 }, pulse: { rhythm: 8 } },
  sniper: { name: '沉默射手', code: 'SNIPER', desc: '投射 +6；只要有一點空間，就敢出手。', bonus: { shooting: 6 }, pulse: { rhythm: 3 } },
  stopper: { name: '黏人防線', code: 'STOPPER', desc: '防守 +5、體能 +2；黏緊對手，不給他好投。', bonus: { defense: 5, athletic: 2 }, pulse: { trust: 4 } },
  engine: { name: '球場引擎', code: 'ENGINE', desc: '球商 +4、組織 +3；看得懂場上狀況，知道下一球怎麼打。', bonus: { iq: 4, playmaking: 3 }, pulse: { trust: 5 } },
  none: { name: '尚未成形', code: 'OPEN', desc: '你的打法會由生涯中的選擇慢慢長出來。', bonus: {}, pulse: {} }
};

const CAREER_MODES = {
  classic: {
    code: 'REAL', name: '真實征途', icon: '◎',
    short: '完整寫實平衡',
    desc: '沒有額外加成。從國中板凳一路拚到職業與名人堂，適合第一次玩。',
    objective: '完成 23 個年齡的故事'
  },
  odyssey: {
    code: 'WORLD', name: '五國遠征', icon: '↗',
    short: '旅外越多越有機會',
    desc: '跨國適應更快，海外門檻稍微降低；目標是踏上至少四個國家的球場。',
    objective: '造訪 4 個國家'
  },
  dynasty: {
    code: 'DYNASTY', name: '一城王朝', icon: '♜',
    short: '把一支隊伍變王朝',
    desc: '續留同隊能保留更多信任，長約更容易出現；目標是在同一職業隊打滿四季並奪冠。',
    objective: '同一職業隊 4 季＋1 冠'
  },
  underdog: {
    code: 'UPSET', name: '逆風翻盤', icon: 'ϟ',
    short: '低起點、高逆襲成長',
    desc: '開局能力較低，但失敗後成長更快，落後時還會累積逆風脈衝；目標是衝上 80 OVR。',
    objective: '從低起點練到 80 OVR'
  }
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
  { age: 20, year: 2046, stage: '養成', name: '站穩輪替', target: '把偶爾上場變成固定時間', pressure: 8 },
  { age: 21, year: 2047, stage: '養成', name: '關鍵一年', target: '讓職業隊願意投資你', pressure: 9 },
  { age: 22, year: 2048, stage: '養成', name: '選秀前夜', target: '拿到真正的職業合約', pressure: 10 },
  { age: 23, year: 2049, stage: '職業', name: '職業新秀', target: '證明你值得這份合約', pressure: 10 },
  { age: 24, year: 2050, stage: '職業', name: '第二年牆', target: '撐過被針對研究的球季', pressure: 11 },
  { age: 25, year: 2051, stage: '職業', name: '輪替核心', target: '成為教練不敢少用的人', pressure: 11 },
  { age: 26, year: 2052, stage: '職業', name: '巔峰起點', target: '第一次真正帶隊贏球', pressure: 12 },
  { age: 27, year: 2053, stage: '職業', name: '全盛時期', target: '打進年度獎項討論', pressure: 12 },
  { age: 28, year: 2054, stage: '職業', name: '合約大年', target: '用表現換到生涯最大合約', pressure: 13 },
  { age: 29, year: 2055, stage: '職業', name: '領袖責任', target: '帶著年輕隊友一起進步', pressure: 13 },
  { age: 30, year: 2056, stage: '職業', name: '爭冠時刻', target: '在能力下滑前拼下一冠', pressure: 14 },
  { age: 31, year: 2057, stage: '職業', name: '老將調整', target: '換一種打法留在場上', pressure: 14 },
  { age: 32, year: 2058, stage: '傳奇', name: '傳承球季', target: '一邊競爭、一邊帶出下一代', pressure: 15 },
  { age: 33, year: 2059, stage: '傳奇', name: '倒數計時', target: '讓球隊知道你還能打', pressure: 15 },
  { age: 34, year: 2060, stage: '傳奇', name: '最後衝刺', target: '把握最後一次爭冠窗口', pressure: 16 },
  { age: 35, year: 2061, stage: '傳奇', name: '最後一舞', target: '留下最像你的最後代表作', pressure: 17 }
];

const LEGACY_SEASON_AGES = [13, 14, 15, 16, 17, 18, 19, 21, 23, 26, 30, 34];
const AGE_CHAPTERS = ['年度自由規劃', '人生支線', '球隊日常', '機會邀請', '年度關鍵戰'];
const LIFE_PATHS = {
  family: { icon: '⌂', name: '家人優先', desc: '你會把重要的人一起放進生涯決定。' },
  crew: { icon: '∞', name: '夥伴連線', desc: '你習慣靠隊友與朋友一起扛壓力。' },
  study: { icon: '◇', name: '腦袋派', desc: '你願意為球場外的人生保留第二條路。' },
  mentor: { icon: '↟', name: '傳承線', desc: '你會向前輩學，也願意把經驗交給後輩。' },
  brand: { icon: '●', name: '聚光燈', desc: '你開始學會面對媒體、商業與大眾目光。' },
  self: { icon: 'ϟ', name: '自己扛', desc: '你相信準備與自律，先把能控制的做好。' }
};

const AGE_STORIES = {
  13: {
    title: '第一雙正式球鞋',
    scene: '校隊清單上寫著要準備室內球鞋。你知道家裡最近很省，這不是一句「買就好」那麼簡單。',
    prompt: '你打算怎麼處理？',
    choices: [
      { title: '先穿舊鞋撐著', desc: '把錢留給家裡，自己多注意腳底狀況。', path: 'family', primary: 'iq', secondary: 'defense', tag: 'connector', deltas: { trust: 3, load: 4 }, outcome: '你沒抱怨，只是更認真照顧那雙舊鞋。家人也看見你的體貼。' },
      { title: '拿零用錢補差額', desc: '想要的裝備，自己也出一份力。', path: 'self', primary: 'athletic', secondary: 'iq', tag: 'iron', deltas: { rhythm: 4 }, outcome: '你第一次為自己的目標存錢，球鞋穿起來特別有感。' },
      { title: '直接跟家人說清楚', desc: '不裝沒事，一起找能負擔的方法。', path: 'family', primary: 'playmaking', secondary: 'iq', tag: 'connector', deltas: { trust: 7, load: -3 }, outcome: '談完後壓力小很多。你們選了一雙不貴、但真的合腳的鞋。' },
      { title: '問學長有沒有二手鞋', desc: '開口不丟臉，先解決問題比較重要。', path: 'crew', primary: 'playmaking', secondary: 'defense', tag: 'creator', deltas: { trust: 6, reputation: 1 }, outcome: '學長真的翻出一雙只穿過幾次的鞋，你也記住這份人情。' }
    ]
  },
  14: {
    title: '一起打球的朋友要轉校',
    scene: '放學後，他說家裡要搬走。下學期開始，你們不會再穿同一件球衣。',
    prompt: '這段搭檔關係要怎麼繼續？',
    choices: [
      { title: '約好每週線上聊球', desc: '不同隊也能繼續交換比賽心得。', path: 'crew', primary: 'playmaking', secondary: 'iq', tag: 'creator', deltas: { trust: 6, rhythm: 3 }, outcome: '距離沒有讓你們斷線，反而多了一個懂你壓力的人。' },
      { title: '最後一週每天一起練', desc: '先不說捨不得，用球把最後幾天打滿。', path: 'self', primary: 'shooting', secondary: 'athletic', tag: 'shooter', deltas: { load: 8, rhythm: 5 }, outcome: '最後一次加練沒有很感傷，但你們都知道這段回憶會留很久。' },
      { title: '做一本戰術筆記送他', desc: '把你們最熟的配合全部寫下來。', path: 'study', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { trust: 4 }, outcome: '他帶走的不只一本筆記，還有你們一起練出來的默契。' },
      { title: '請教練幫忙介紹新球隊', desc: '難過歸難過，先讓朋友有地方繼續打。', path: 'mentor', primary: 'iq', secondary: 'defense', tag: 'connector', deltas: { trust: 8, reputation: 2 }, outcome: '教練答應幫忙。你第一次發現，球員也能替別人的生涯推一把。' }
    ]
  },
  15: {
    title: '升高中，不只看哪隊最強',
    scene: '桌上有本地強校、外縣市名校和海外學校的資料。每個選項都很好，也都有代價。',
    prompt: '你最在意哪一件事？',
    choices: [
      { title: '留在家附近', desc: '通勤比較穩，也能繼續陪家人。', path: 'family', primary: 'iq', secondary: 'defense', tag: 'connector', deltas: { trust: 7, load: -4 }, outcome: '你選擇把生活穩定放進考量，家裡也更能支持你的訓練。' },
      { title: '去競爭最硬的學校', desc: '就算先坐板凳，也想看看自己的極限。', path: 'self', primary: 'athletic', secondary: 'finish', tag: 'iron', deltas: { scout: 4, load: 8 }, outcome: '你把舒服放到後面，決定先去最難的地方試一次。' },
      { title: '認真研究海外學校', desc: '先查語言、學分和生活，不只看球隊名氣。', path: 'study', primary: 'iq', secondary: 'playmaking', tag: 'creator', deltas: { scout: 5, reputation: 2 }, outcome: '你整理出一份完整比較表，旅外第一次變成可以執行的計畫。' },
      { title: '找學長問真實生活', desc: '招生簡章很好看，但你想聽住過的人怎麼說。', path: 'mentor', primary: 'playmaking', secondary: 'iq', tag: 'connector', deltas: { trust: 5, scout: 2 }, outcome: '學長把宿舍、課業和板凳生活全說了，你的選擇更接近現實。' }
    ]
  },
  16: {
    title: '第一次離家住校',
    scene: '宿舍門關上後，房間突然很安靜。沒有人提醒你洗衣服，也沒有人叫你早點睡。',
    prompt: '第一晚，你會怎麼讓自己安定下來？',
    choices: [
      { title: '主動找室友聊天', desc: '先認識一起生活的人。', path: 'crew', primary: 'playmaking', secondary: 'iq', tag: 'connector', deltas: { trust: 7, rhythm: 4 }, outcome: '一包宵夜讓房間沒那麼陌生，之後也多了能互相提醒的人。' },
      { title: '整理自己的作息表', desc: '把洗衣、課業與訓練時間排好。', path: 'self', primary: 'iq', secondary: 'athletic', tag: 'iron', deltas: { load: -4, rhythm: 3 }, outcome: '你沒有等別人管，先把生活節奏抓回自己手上。' },
      { title: '打視訊回家', desc: '想家不用硬裝酷。', path: 'family', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { load: -8, trust: 4 }, outcome: '聊完以後，陌生感還在，但心裡穩很多。' },
      { title: '先讀完宿舍規則', desc: '少踩雷，就是替未來省麻煩。', path: 'study', primary: 'iq', secondary: 'defense', tag: 'connector', deltas: { reputation: 2, load: -2 }, outcome: '隔天別人還在找洗衣間，你已經把生活動線摸熟了。' }
    ]
  },
  17: {
    title: '你的比賽短片突然爆了',
    scene: '一段關鍵球短片一晚多了幾萬次觀看。有人誇你，也有人說只是運氣。',
    prompt: '你要怎麼面對突然來的流量？',
    choices: [
      { title: '把功勞分給全隊', desc: '剪進助攻、掩護和防守，不只放最後一球。', path: 'crew', primary: 'playmaking', secondary: 'iq', tag: 'connector', deltas: { trust: 9, reputation: 4 }, outcome: '隊友看見你沒有搶光鏡頭，休息室的氣氛更挺你。' },
      { title: '關掉通知，照表練球', desc: '先保護注意力，不跟留言區打比賽。', path: 'self', primary: 'athletic', secondary: 'iq', tag: 'iron', deltas: { load: -3, rhythm: 6 }, outcome: '熱度沒有控制你，隔天訓練的節奏一樣穩。' },
      { title: '自己拍片回應球迷', desc: '用簡單的話介紹那個戰術怎麼跑。', path: 'brand', primary: 'playmaking', secondary: 'shooting', tag: 'creator', deltas: { reputation: 9, scout: 3, load: 3 }, outcome: '大家發現你不只會打，還能把籃球說得很好懂。' },
      { title: '先問教練能不能發', desc: '球隊規定和同學隱私都要顧。', path: 'mentor', primary: 'iq', secondary: 'defense', tag: 'connector', deltas: { trust: 7, reputation: 2 }, outcome: '你避開了不必要的爭議，也學會流量不是想發什麼就發什麼。' }
    ]
  },
  18: {
    title: '畢業後的路，沒人能替你選',
    scene: '最後一學期，同學在談大學和工作，你的桌上則是球隊邀請、獎學金和語言成績。',
    prompt: '你想先把哪條路弄清楚？',
    choices: [
      { title: '先看大學與學分', desc: '籃球之外，也要知道四年後拿到什麼。', path: 'study', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { scout: 2, load: -3 }, outcome: '你沒有把升學當備胎，而是當成能一起走的路。' },
      { title: '準備直接挑戰職業', desc: '把身體、影片和經紀資料一次備齊。', path: 'self', primary: 'athletic', secondary: 'finish', tag: 'iron', deltas: { scout: 8, load: 8 }, outcome: '你開始用職業標準檢查自己，連休息也變成計畫的一部分。' },
      { title: '和家人開一次正式會議', desc: '費用、風險和退路都說清楚。', path: 'family', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { trust: 8, load: -6 }, outcome: '沒有人保證一定成功，但全家知道接下來怎麼一起扛。' },
      { title: '請學長拆解旅外生活', desc: '從簽證到板凳期，都先聽真話。', path: 'mentor', primary: 'iq', secondary: 'defense', tag: 'connector', deltas: { scout: 6, reputation: 2 }, outcome: '旅外不再只是帥氣照片，你也開始準備那些沒人看到的部分。' }
    ]
  },
  19: {
    title: '第一次自己管理一整年的錢',
    scene: '補助、獎學金和生活費進到同一個帳戶。金額不算大，但每一筆都要你自己決定。',
    prompt: '你先做哪件事？',
    choices: [
      { title: '先留緊急預備金', desc: '受傷或搬家時，不用立刻跟別人借。', path: 'study', primary: 'iq', secondary: 'defense', tag: 'connector', deltas: { load: -4 }, outcome: '帳戶裡多了一條安全線，你打球時也少一點後顧之憂。' },
      { title: '幫家裡分擔一點', desc: '不是逞強，只是想把支持還回去。', path: 'family', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { trust: 8, income: -2 }, outcome: '金額不大，家人卻知道你已經開始學著負責。' },
      { title: '投資一堂專項課', desc: '把錢換成自己最需要的技術。', path: 'self', primary: 'shooting', secondary: 'finish', tag: 'shooter', deltas: { income: -3, load: 5 }, outcome: '這筆錢沒有變成新衣服，而是變成更穩的一套腳步。' },
      { title: '和隊友一起學記帳', desc: '互相提醒，少在月底一起吃泡麵。', path: 'crew', primary: 'iq', secondary: 'playmaking', tag: 'creator', deltas: { trust: 6, load: -2 }, outcome: '你們做了一張超簡單的表格，居然真的撐過整個月。' }
    ]
  },
  20: {
    title: '語言聽得懂，文化還沒跟上',
    scene: '你已經能聽懂戰術，但聚餐笑點、休息室規矩和教練語氣還常常慢半拍。',
    prompt: '你要怎麼縮短適應期？',
    choices: [
      { title: '每天學五句當地用語', desc: '先從真的會用到的開始。', path: 'study', primary: 'iq', secondary: 'playmaking', tag: 'creator', deltas: { trust: 4, scout: 2 }, outcome: '你不再只會點頭，開始能主動問清楚戰術細節。' },
      { title: '接受隊友的聚餐邀請', desc: '少一次個人加練，換一次真正的相處。', path: 'crew', primary: 'playmaking', secondary: 'iq', tag: 'connector', deltas: { trust: 10, load: -4 }, outcome: '你終於聽懂幾個內梗，球場上的溝通也自然很多。' },
      { title: '先用比賽影片補差距', desc: '語言慢一點，就把畫面看得更熟。', path: 'self', primary: 'iq', secondary: 'defense', tag: 'stopper', deltas: { rhythm: 5, load: 2 }, outcome: '第二天教練還沒講完，你已經知道下一個站位在哪。' },
      { title: '找同國前輩聊一次', desc: '問那些沒寫在手冊裡的生存方法。', path: 'mentor', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { trust: 6, load: -5 }, outcome: '前輩的一小時，幫你少繞了好幾個月的路。' }
    ]
  },
  21: {
    title: '第一位經紀人坐到你面前',
    scene: '有人帶著漂亮簡報，有人只拿一本筆記。每個人都說能幫你進職業，但方法完全不同。',
    prompt: '你先用什麼標準判斷？',
    choices: [
      { title: '看資源最大的公司', desc: '人脈多，但你可能只是很多客戶之一。', path: 'brand', primary: 'playmaking', secondary: 'iq', tag: 'creator', deltas: { scout: 7, reputation: 4 }, outcome: '你看見更大的舞台，也知道自己必須主動爭取注意。' },
      { title: '選願意常陪你談的人', desc: '規模小一點，但溝通比較直接。', path: 'crew', primary: 'playmaking', secondary: 'iq', tag: 'connector', deltas: { trust: 7, scout: 3 }, outcome: '你選擇可以隨時講真話的合作方式。' },
      { title: '先自己讀懂合約', desc: '不急著簽，先知道每一條在寫什麼。', path: 'study', primary: 'iq', secondary: 'defense', tag: 'connector', deltas: { load: 2, reputation: 2 }, outcome: '第二次見面時，你問的問題讓對方不敢隨便帶過。' },
      { title: '請退休球員陪你面談', desc: '讓走過這條路的人幫你聽細節。', path: 'mentor', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { trust: 5, scout: 4 }, outcome: '前輩沒替你決定，但抓出了兩個你完全沒注意的風險。' }
    ]
  },
  22: {
    title: '家人問：如果沒被選上呢？',
    scene: '這不是潑冷水。大家只是知道，選秀和合約從來不保證努力一定有回報。',
    prompt: '你會怎麼回答？',
    choices: [
      { title: '把學位繼續完成', desc: '挑戰職業，也保留能走回去的路。', path: 'study', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { load: 2, trust: 5 }, outcome: '你把課表重新排好，夢想和退路不再互相打架。' },
      { title: '給自己一年全力衝刺', desc: '設定期限，也設定檢查點。', path: 'self', primary: 'athletic', secondary: 'finish', tag: 'iron', deltas: { load: 8, scout: 7 }, outcome: '你不是盲目硬衝，而是給自己一個有邊界的豪賭。' },
      { title: '把最壞情況說清楚', desc: '收入、受傷和沒球打，都一起討論。', path: 'family', primary: 'iq', secondary: 'defense', tag: 'connector', deltas: { load: -7, trust: 9 }, outcome: '談完沒比較輕鬆，但你不用再一個人假裝完全不怕。' },
      { title: '找教練評估真實行情', desc: '不要安慰，只要最直接的答案。', path: 'mentor', primary: 'iq', secondary: 'playmaking', tag: 'creator', deltas: { scout: 5, rhythm: 3 }, outcome: '教練把優缺點寫滿一張紙，你終於知道最後幾個月該補什麼。' }
    ]
  },
  23: {
    title: '第一筆職業薪水進帳',
    scene: '手機跳出入帳通知。這是你靠籃球真正賺到的第一筆大錢，也可能很快就花完。',
    prompt: '你先把錢放去哪裡？',
    choices: [
      { title: '先替家裡處理一件事', desc: '繳掉帳單，或換掉真的不能再用的家電。', path: 'family', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { income: -8, trust: 9, load: -4 }, outcome: '那天家裡沒有盛大慶祝，但每個人都笑得很安心。' },
      { title: '找專業的人做財務規劃', desc: '先搞懂稅、保險和緊急預備金。', path: 'study', primary: 'iq', secondary: 'defense', tag: 'connector', deltas: { income: -2, load: -5 }, outcome: '你第一次看懂合約上的數字，知道「賺到」和「留下」是兩件事。' },
      { title: '組一套自己的訓練團隊', desc: '把收入投回身體與技術。', path: 'self', primary: 'athletic', secondary: 'shooting', tag: 'iron', deltas: { income: -12, load: 4 }, outcome: '訓練不再東拼西湊，你有了一套真正屬於職業球員的日程。' },
      { title: '請一路陪你的朋友吃飯', desc: '不買名牌，先把這一刻跟重要的人分享。', path: 'crew', primary: 'playmaking', secondary: 'iq', tag: 'connector', deltas: { income: -3, trust: 7, rhythm: 5 }, outcome: '大家拿你以前的糗事開玩笑，你也記得自己不是一個人走到這裡。' }
    ]
  },
  24: {
    title: '板凳時間比想像中更長',
    scene: '你每天最早到、最晚走，但最近五場只打了零碎時間。努力沒有立刻換成上場。',
    prompt: '你準備怎麼處理？',
    choices: [
      { title: '直接約教練談角色', desc: '問清楚缺口，不用猜。', path: 'mentor', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { trust: 6, rhythm: 3 }, outcome: '答案不全是你想聽的，但至少接下來的訓練有明確方向。' },
      { title: '幫先發隊友做準備', desc: '一起看片、當陪練，先讓團隊需要你。', path: 'crew', primary: 'defense', secondary: 'iq', tag: 'stopper', deltas: { trust: 10, reputation: 2 }, outcome: '你沒有因為沒上場就消失，教練開始更放心把你放進輪替。' },
      { title: '加練自己的招牌技', desc: '先把一項武器練到誰都不能忽略。', path: 'self', primary: 'shooting', secondary: 'finish', tag: 'shooter', deltas: { load: 10, rhythm: 4 }, outcome: '你的身體有點累，但那個動作開始變成真正能在比賽用的武器。' },
      { title: '回家休息一晚', desc: '暫時離開球館，把情緒放下來。', path: 'family', primary: 'iq', secondary: 'athletic', tag: 'iron', growth: .25, deltas: { load: -18, rhythm: 5 }, outcome: '一頓家常菜沒有解決板凳問題，卻讓你重新有力氣面對它。' }
    ]
  },
  25: {
    title: '最好的朋友在人生另一條路上前進',
    scene: '朋友傳來婚禮或新工作的消息。你替他開心，也突然發現大家的人生已經不再同步。',
    prompt: '球季中，你會怎麼回應這份邀請？',
    choices: [
      { title: '排開行程親自到場', desc: '少一天訓練，但重要時刻只有一次。', path: 'family', primary: 'iq', secondary: 'playmaking', tag: 'connector', growth: .35, deltas: { trust: 5, load: -12, rhythm: 6 }, outcome: '你短暫離開球員身分，重新當回單純的朋友。' },
      { title: '請隊友幫忙調整訓練', desc: '行程不消失，但可以一起想辦法。', path: 'crew', primary: 'playmaking', secondary: 'athletic', tag: 'connector', deltas: { trust: 8, load: 2 }, outcome: '隊友幫你補上訓練內容，你也更願意在他需要時回頭幫忙。' },
      { title: '留隊完成訓練再視訊', desc: '承認自己不能到，但不讓關係斷掉。', path: 'self', primary: 'athletic', secondary: 'iq', tag: 'iron', deltas: { load: 7, rhythm: 2 }, outcome: '你沒有兩邊都做到完美，但至少誠實面對自己的選擇。' },
      { title: '準備一份有故事的禮物', desc: '把你們從小到大的球場回憶整理起來。', path: 'brand', primary: 'iq', secondary: 'playmaking', tag: 'creator', growth: .45, deltas: { reputation: 2, load: -3 }, outcome: '那份禮物沒有很貴，卻讓你們都想起最早的自己。' }
    ]
  },
  26: {
    title: '這座城市開始把你當自己人',
    scene: '學校邀你回去分享，社區也想請你帶小朋友打球。休假突然多了很多邀請。',
    prompt: '你想把時間留給哪一件事？',
    choices: [
      { title: '辦一場免費小型訓練營', desc: '名額不多，但每個孩子都能真的碰到球。', path: 'mentor', primary: 'playmaking', secondary: 'iq', tag: 'connector', deltas: { reputation: 9, trust: 4, load: 4 }, outcome: '你講到自己十三歲時，小朋友的眼睛整個亮起來。' },
      { title: '把假日完整留給恢復', desc: '公益很好，但身體也需要你負責。', path: 'self', primary: 'athletic', secondary: 'iq', tag: 'iron', growth: .2, deltas: { load: -22, rhythm: 5 }, outcome: '你沒有勉強排滿行程，下一週身體明顯更有力。' },
      { title: '帶家人重新逛這座城市', desc: '讓他們看看你現在生活的地方。', path: 'family', primary: 'iq', secondary: 'playmaking', tag: 'connector', growth: .35, deltas: { load: -12, trust: 6 }, outcome: '這座陌生城市第一次有了「家附近」的感覺。' },
      { title: '和品牌合辦公益活動', desc: '資源更大，也要接受更多鏡頭。', path: 'brand', primary: 'playmaking', secondary: 'shooting', tag: 'creator', deltas: { reputation: 13, income: 6, load: 6 }, outcome: '活動真的幫到更多人，你也學會怎麼不讓公益只剩廣告。' }
    ]
  },
  27: {
    title: '代言變多，大家開始替你說話',
    scene: '品牌想要你變得更有話題，團隊則擔心形象跑太快。你必須決定自己要被看成什麼樣子。',
    prompt: '你會怎麼守住自己的聲音？',
    choices: [
      { title: '只接真的會用的產品', desc: '少賺一點，但每句推薦都敢負責。', path: 'brand', primary: 'iq', secondary: 'shooting', tag: 'connector', deltas: { income: 12, reputation: 8 }, outcome: '合作數量沒有爆量，信任感卻慢慢變成你的招牌。' },
      { title: '讓隊友一起出現在企劃', desc: '不把所有鏡頭都留給自己。', path: 'crew', primary: 'playmaking', secondary: 'iq', tag: 'connector', deltas: { trust: 9, reputation: 6, income: 7 }, outcome: '廣告拍起來像真的球隊生活，隊友也沒有覺得你變遠了。' },
      { title: '請會計和律師先把關', desc: '學會看授權、稅務和長期風險。', path: 'study', primary: 'iq', secondary: 'defense', tag: 'connector', deltas: { income: 5, load: -4 }, outcome: '你避開一份看起來很香、實際上綁很久的合約。' },
      { title: '這季先降低曝光', desc: '把注意力拉回球場和身體。', path: 'self', primary: 'athletic', secondary: 'iq', tag: 'iron', growth: .45, deltas: { load: -12, rhythm: 6 }, outcome: '熱度降了一點，但你重新找回單純準備比賽的感覺。' }
    ]
  },
  28: {
    title: '大合約和安穩生活不一定同一邊',
    scene: '市場上有高薪遠方球隊，也有熟悉城市的續約。你的人生已經不只一個行李箱。',
    prompt: '談合約前，你先確認什麼？',
    choices: [
      { title: '先問家人的生活意願', desc: '學校、工作和搬家都要一起算。', path: 'family', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { trust: 8, load: -4 }, outcome: '你沒有把家人當附帶條件，談判也多了一條真正的底線。' },
      { title: '挑戰薪資最高的舞台', desc: '承擔壓力，也把生涯價值拉到最大。', path: 'brand', primary: 'shooting', secondary: 'finish', tag: 'shooter', deltas: { scout: 7, reputation: 7, load: 6 }, outcome: '你決定讓市場知道自己的價值，不再只求有球打。' },
      { title: '只看最適合的角色', desc: '先發、戰術和教練信任比數字重要。', path: 'self', primary: 'iq', secondary: 'defense', tag: 'connector', deltas: { rhythm: 7, scout: 3 }, outcome: '你把「會不會用我」放在報價前面，選擇變得更清楚。' },
      { title: '問隊友願不願意一起拚', desc: '有些冠軍窗口需要一群人共同決定。', path: 'crew', primary: 'playmaking', secondary: 'iq', tag: 'creator', deltas: { trust: 10, reputation: 3 }, outcome: '幾通電話讓你知道，這不只是自己的合約年。' }
    ]
  },
  29: {
    title: '身體好了，心裡還怕再受傷',
    scene: '檢查數字都正常，但每次落地你還是會多想半秒。那半秒在職業賽場很明顯。',
    prompt: '你怎麼處理這種看不見的怕？',
    choices: [
      { title: '找運動心理師談', desc: '把害怕拆開，不用靠硬撐。', path: 'study', primary: 'iq', secondary: 'athletic', tag: 'iron', deltas: { load: -9, rhythm: 8 }, outcome: '你學會幾個能在比賽中拉回注意力的方法，落地不再只想到最壞結果。' },
      { title: '找受過同樣傷的隊友', desc: '聽一個真的懂那種感覺的人。', path: 'crew', primary: 'playmaking', secondary: 'iq', tag: 'connector', deltas: { trust: 8, load: -6 }, outcome: '他沒有叫你勇敢，只是告訴你恢復本來就不是直線。' },
      { title: '多做一輪保護性訓練', desc: '用準備增加信心，但不過量。', path: 'self', primary: 'athletic', secondary: 'defense', tag: 'iron', deltas: { load: 4, rhythm: 5 }, outcome: '你重新相信自己的身體，不是因為忘記受傷，而是知道怎麼保護它。' },
      { title: '把不安告訴家人', desc: '不用每次通話都只說「很好」。', path: 'family', primary: 'iq', secondary: 'playmaking', tag: 'connector', growth: .3, deltas: { load: -12, trust: 5 }, outcome: '說出口後沒有變弱，反而不用再花力氣假裝沒事。' }
    ]
  },
  30: {
    title: '新人開始追著你的位置跑',
    scene: '新秀速度更快、恢復更快，媒體每天都在比較。你第一次明顯感覺到時間站在別人那邊。',
    prompt: '你怎麼面對這個年輕挑戰者？',
    choices: [
      { title: '把自己的閱讀教給他', desc: '競爭位置，也不藏真正有用的東西。', path: 'mentor', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { trust: 10, reputation: 5 }, outcome: '他進步得更快，但教練也更看見你的領袖價值。' },
      { title: '用訓練把位置搶回來', desc: '先不談傳承，場上自己說話。', path: 'self', primary: 'athletic', secondary: 'defense', tag: 'iron', deltas: { load: 11, rhythm: 6 }, outcome: '你沒有回到二十歲，但把每一分體能都用得更準。' },
      { title: '主動設計雙人搭配', desc: '與其互相吃時間，不如想辦法一起上。', path: 'crew', primary: 'playmaking', secondary: 'shooting', tag: 'creator', deltas: { trust: 9, rhythm: 5 }, outcome: '你們從競爭對手變成新的後場組合，球隊多了一種解法。' },
      { title: '和家人談生涯後半段', desc: '先知道自己為什麼還想繼續。', path: 'family', primary: 'iq', secondary: 'playmaking', tag: 'connector', growth: .35, deltas: { load: -8, rhythm: 5 }, outcome: '你找到一個比「不想輸」更長久的理由。' }
    ]
  },
  31: {
    title: '記者第一次直接問你退休',
    scene: '你只是打了一場普通比賽，賽後第一題卻是：「有想過什麼時候停嗎？」',
    prompt: '你要怎麼回答？',
    choices: [
      { title: '誠實說還沒決定', desc: '不喊口號，也不替未來做假保證。', path: 'brand', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { reputation: 7, load: -3 }, outcome: '答案沒有很戲劇化，卻讓大家感覺你很真。' },
      { title: '把問題拉回下一場', desc: '現在只處理能控制的事。', path: 'self', primary: 'iq', secondary: 'defense', tag: 'stopper', deltas: { rhythm: 6, reputation: 2 }, outcome: '你沒有被帶進倒數話題，休息室也很欣賞你的專注。' },
      { title: '先和家人談完再公開', desc: '重要的人不該從新聞知道。', path: 'family', primary: 'playmaking', secondary: 'iq', tag: 'connector', deltas: { trust: 7, load: -5 }, outcome: '你保留了家人的位置，也讓未來的決定不會只剩公關稿。' },
      { title: '打給曾帶過你的教練', desc: '問問他當年怎麼知道該停。', path: 'mentor', primary: 'iq', secondary: 'playmaking', tag: 'creator', deltas: { load: -6, rhythm: 4 }, outcome: '教練沒有給日期，只叫你每天確認「還想不想準備」。' }
    ]
  },
  32: {
    title: '母校想請你回去帶一天訓練',
    scene: '那座舊球館沒有變多少。現在換一群十三歲孩子抬頭看著你。',
    prompt: '你想怎麼回到夢開始的地方？',
    choices: [
      { title: '親自帶完整訓練', desc: '從熱身到收操，每個細節都不省。', path: 'mentor', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { reputation: 9, load: 5 }, outcome: '你在一個孩子身上看見以前的自己，也更明白經驗可以留下來。' },
      { title: '成立小額獎學金', desc: '先幫球鞋、交通和學費最吃緊的人。', path: 'study', primary: 'iq', secondary: 'defense', tag: 'connector', growth: .3, deltas: { income: -10, reputation: 10 }, outcome: '資助不大，卻讓幾個孩子不用因為費用先離開球場。' },
      { title: '帶家人一起回去', desc: '讓他們看看那些年你每天待到多晚。', path: 'family', primary: 'iq', secondary: 'playmaking', tag: 'connector', growth: .3, deltas: { load: -8, trust: 5 }, outcome: '家人第一次站在那條邊線上，很多以前沒說的事突然都懂了。' },
      { title: '婉拒活動，完整休養', desc: '不是每一份情感都要用出席證明。', path: 'self', primary: 'athletic', secondary: 'iq', tag: 'iron', growth: .2, deltas: { load: -20, rhythm: 5 }, outcome: '你寫了一封認真的回信，也替自己的身體保留需要的休息。' }
    ]
  },
  33: {
    title: '休息日開始比以前更珍貴',
    scene: '恢復要花更多時間，家人也更希望你在場。一天只有二十四小時，不能每邊都給滿。',
    prompt: '這個休息日要怎麼過？',
    choices: [
      { title: '整天留給家人', desc: '手機靜音，不把球館帶進餐桌。', path: 'family', primary: 'iq', secondary: 'playmaking', tag: 'connector', growth: .2, deltas: { load: -20, trust: 6, rhythm: 4 }, outcome: '你錯過一堂課，卻補回一段不能延期的相處。' },
      { title: '約隊友做低強度恢復', desc: '一邊保養身體，一邊聊球隊狀況。', path: 'crew', primary: 'athletic', secondary: 'playmaking', tag: 'iron', growth: .35, deltas: { load: -12, trust: 7 }, outcome: '這不像訓練，也不像休假，但剛好是老將需要的節奏。' },
      { title: '自己做一小時技術維持', desc: '不追爆量，只維持最重要的手感。', path: 'self', primary: 'shooting', secondary: 'iq', tag: 'shooter', deltas: { load: 2, rhythm: 6 }, outcome: '你學會少練一點不代表鬆懈，而是更知道該留下什麼。' },
      { title: '整理一份老將筆記', desc: '把恢復、閱讀與比賽小技巧記下來。', path: 'mentor', primary: 'iq', secondary: 'playmaking', tag: 'creator', deltas: { reputation: 4, load: -5 }, outcome: '那些以前只存在腦中的細節，第一次變成能交給別人的東西。' }
    ]
  },
  34: {
    title: '最後一份合約可能不是最高薪',
    scene: '爭冠隊、家鄉隊、海外球隊和教練兼球員的角色都來詢問。每一份都像不同結局。',
    prompt: '你最想替生涯保留什麼？',
    choices: [
      { title: '去最有機會奪冠的隊', desc: '接受角色變小，只為最後一次衝頂。', path: 'self', primary: 'defense', secondary: 'iq', tag: 'stopper', deltas: { scout: 5, load: 5, rhythm: 6 }, outcome: '你放下球權，保留競爭。最後一段路有了非常清楚的方向。' },
      { title: '回到最接近家的地方', desc: '讓重要的人能多到現場看你。', path: 'family', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { trust: 8, load: -7 }, outcome: '每場比賽看台上都有熟悉的人，最後幾年不再只剩飯店和飛機。' },
      { title: '接受帶年輕人的角色', desc: '上場時間少一點，影響力不一定變小。', path: 'mentor', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { trust: 10, reputation: 5 }, outcome: '你開始用一次提醒、一個暫停和一堂加練改變球隊。' },
      { title: '再去一個沒打過的國家', desc: '最後還想看看不同的籃球世界。', path: 'brand', primary: 'playmaking', secondary: 'shooting', tag: 'creator', deltas: { scout: 6, reputation: 7, load: 5 }, outcome: '你又收拾了一次行李。這次不是追名氣，而是不想留下「早知道」。' }
    ]
  },
  35: {
    title: '最後一舞之後，你想成為誰？',
    scene: '球季會結束，球員身分也會。更衣櫃前的名牌還在，但你已經開始想像下一個早晨。',
    prompt: '你想把籃球帶往哪個方向？',
    choices: [
      { title: '走上教練席', desc: '把閱讀比賽的方法交給下一代。', path: 'mentor', primary: 'iq', secondary: 'playmaking', tag: 'connector', deltas: { reputation: 8, trust: 8 }, outcome: '你開始寫第一份教案。球鞋還沒收起來，新的身分已經慢慢成形。' },
      { title: '做媒體與球賽內容', desc: '用自己的方式把籃球講給更多人聽。', path: 'brand', primary: 'playmaking', secondary: 'iq', tag: 'creator', deltas: { reputation: 12, income: 5 }, outcome: '鏡頭再次對著你，這次你不只回答問題，也開始提出觀點。' },
      { title: '進球隊管理與球探', desc: '學合約、建隊與長期規劃。', path: 'study', primary: 'iq', secondary: 'defense', tag: 'connector', deltas: { scout: 8, reputation: 5 }, outcome: '你開始從名單另一側看球員，也更理解當年那些殘酷決定。' },
      { title: '先把時間還給家人', desc: '不急著安排下一份工作，先回到生活。', path: 'family', primary: 'iq', secondary: 'athletic', tag: 'connector', growth: .15, deltas: { load: -25, trust: 8, rhythm: 5 }, outcome: '最後一場結束後，你沒有立刻趕往下一個行程。這次真的可以慢慢回家。' }
    ]
  }
};

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
  },
  {
    id: 'one_point_chase', clock: '9.7', title: '差一分的最後機會', score: '84：85', actionKeys: 'position',
    story: (opponent) => `對上「${opponent}」，第四節剩 9.7 秒，你們 84：85 落後。暫停後從前場發球，時間夠做一次完整進攻，但傳來傳去就會沒時間。`,
    quote: '教練：不用硬投三分，找到最舒服的兩分也能贏。', prompt: '落後 1 分，最後一波要交給哪種打法？', hint: '落後 1 分 · 我方球權 · 一次完整進攻', difficulty: 2
  },
  {
    id: 'protect_two', clock: '11.3', title: '別讓三分出手', score: '78：76', actionKeys: ['lock', 'switch', 'glass'],
    story: (opponent) => `你們對「${opponent}」以 78：76 領先，第四節剩 11.3 秒。對手還有一次暫停，可能搶三分直接逆轉，也可能先拿兩分追平。`,
    quote: '教練：先守住外線，籃板也一定要拿好。', prompt: '領先 2 分，這波防守你最在意什麼？', hint: '領先 2 分 · 對方球權 · 小心三分與二次進攻', difficulty: 2
  },
  {
    id: 'three_point_clock', clock: '19.6', title: '先把球搶回來', score: '89：92', actionKeys: ['foul', 'trap', 'deny'],
    story: (opponent) => `第四節剩 19.6 秒，你們對「${opponent}」以 89：92 落後，球還在對方手上。等進攻時間跑完一定來不及，現在每一秒都很貴。`,
    quote: '教練：全隊選同一種方式，才不會有人夾、有人退。', prompt: '落後 3 分又沒有球，怎麼製造最後機會？', hint: '落後 3 分 · 對方球權 · 必須立刻停表或搶球', difficulty: 3
  },
  {
    id: 'protect_one', clock: '7.1', title: '守住一分領先', score: '91：90', actionKeys: ['lock', 'switch', 'glass'],
    story: (opponent) => `你們對「${opponent}」以 91：90 領先，第四節剩 7.1 秒。對手後場發球，推進後大概只剩一次出手機會。`,
    quote: '教練：不要看比分發呆，先找到自己要守的人。', prompt: '只領先 1 分，最後防守要怎麼做？', hint: '領先 1 分 · 對方後場發球 · 一球定勝負', difficulty: 2
  },
  {
    id: 'tie_breaker', clock: '14.2', title: '平手不用亂衝', score: '75：75', actionKeys: 'position',
    story: (opponent) => `對上「${opponent}」，第四節剩 14.2 秒，比分 75：75。你們握有球權，時間足夠把戰術跑完，也能把最後一擊留在自己手上。`,
    quote: '教練：穩穩拿到好球，不要被倒數計時嚇到。', prompt: '平手的最後一攻，你準備怎麼處理？', hint: '比分平手 · 我方球權 · 控制最後出手時間', difficulty: 1
  }
];

// 球隊日常章節會從此池抽取；年度規劃、逐歲人生故事、可拒絕的邀請與關鍵戰由獨立章節系統處理。
// 抽取結果會寫進存檔，同一個生涯會先玩過未見情境，直到該類全數出現才重複。
const CAREER_SCENARIOS = [
  {
    id: 'train_weak_link', phase: 'training', title: '弱點被教練點名',
    story: ({ team }) => `練球結束後，${team.name} 的教練把你留下來。他沒有罵人，只說：「你現在最弱的地方，已經被對手看到了。」球館還能用四十分鐘。`,
    quote: '先把一個問題練好，比每一招都摸一下更有用。', prompt: '剩下四十分鐘，你要補哪一塊？', hint: '補弱點最直接，但疲勞也會比較高。', valueLabel: 'EXTRA WORK', tint: '#dfff00',
    actions: () => [
      careerAction('A', '把最弱的一招練到順', '只練目前最低能力，先把動作做穩。', weakestStat(), 'iq', statTag(weakestStat()), -8, 2.2, { load: 9, rhythm: 4 }, '最後十次都做對了，這招終於不再卡卡的。', '練到後面動作跑掉了，但你已經找到最常出錯的位置。'),
      careerAction('B', '請學長陪你拆動作', '慢慢做、慢慢問，先搞懂問題在哪。', 'iq', 'playmaking', 'connector', -10, 1.7, { trust: 5, load: 3 }, '學長一講你就懂，原來問題不是速度，而是起手太急。', '一下改太多細節，你反而有點亂；至少知道下次先改哪一個。'),
      careerAction('C', '先恢復，明天再補', '伸展、冰敷、早點睡，不硬撐。', 'athletic', 'defense', 'iron', -14, .9, { load: -18, rhythm: -2 }, '身體恢復得很好，隔天訓練的動作明顯更穩。', '你還是有點焦慮，但至少沒有把小疲勞拖成大問題。')
    ]
  },
  {
    id: 'train_shooting_map', phase: 'training', title: '投籃熱區測試',
    story: ({ country }) => `${country.name} 的助教在場上貼了五個標記，要你每個點投十球。測完後，他只讓你選一個區域繼續練。`,
    quote: '不是站得越遠越厲害，能穩定命中才是真的武器。', prompt: '你想把哪種投籃變成固定得分點？', hint: '選安全出手、遠距離，或先練出手節奏。', valueLabel: 'SHOT MAP', tint: '#f0b35a',
    actions: () => [
      careerAction('A', '練最穩的接球跳投', '先站熟悉的位置，把命中率拉高。', 'shooting', 'iq', 'shooter', -9, 2, { rhythm: 7, load: 5 }, '你的腳步越來越固定，球一到手就知道怎麼出手。', '前幾球一直踩錯步，但調慢速度後開始找到節奏。'),
      careerAction('B', '往後退一步練遠投', '難度更高，但練成後空間會更大。', 'shooting', 'athletic', 'shooter', -2, 2.3, { rhythm: 3, load: 9 }, '最後一組連進四球，助教終於點頭了。', '力量不夠時姿勢會歪，你決定先把下肢練好。'),
      careerAction('C', '練跑動後快速出手', '先跑位甩開防守，再接球出手。', 'athletic', 'shooting', 'iron', -5, 1.9, { trust: 4, load: 8 }, '你不只跑到空檔，停下來出手也沒有失去平衡。', '跑太快讓出手變形，但你開始知道什麼速度最適合自己。')
    ]
  },
  {
    id: 'train_contact_finish', phase: 'training', title: '禁區碰撞課',
    story: ({ team }) => `${team.name} 找來兩位大個子拿護墊守籃下。今天每一次上籃都會被撞，你得決定怎麼完成。`,
    quote: '對抗不是硬撞，先保護好球才有下一步。', prompt: '面對禁區碰撞，你想練哪一招？', hint: '硬吃、換手和傳球，會長出不同能力。', valueLabel: 'CONTACT', tint: '#ff7b52',
    actions: () => [
      careerAction('A', '扛住碰撞直接打進', '練核心力量，出手時不怕被推歪。', 'finish', 'athletic', 'attack', -4, 2.2, { load: 11, rhythm: 5 }, '你被撞開還是把球放進，落地也站得很穩。', '護墊一撞球就掉了，但你知道自己核心還要更強。'),
      careerAction('B', '空中換手躲封阻', '不比力氣，用角度避開長手。', 'finish', 'iq', 'attack', -6, 2, { rhythm: 6, load: 7 }, '你等防守手伸出來才換手，球漂亮擦板進框。', '換手太早被看穿，不過下一次你學會多等半拍。'),
      careerAction('C', '吸引人後傳到底角', '看見協防就分球，不一定自己硬上。', 'playmaking', 'iq', 'creator', -8, 1.7, { trust: 7, load: 4 }, '協防一靠近你就傳，隊友得到完全空檔。', '傳球角度太低被碰掉，但判斷方向其實是對的。')
    ]
  },
  {
    id: 'train_film_room', phase: 'training', title: '影片裡的三次失誤',
    story: ({ country }) => `${country.name} 教練剪出你上一場的三次失誤：一次漏人、一次傳球太慢、一次勉強出手。影片課只剩三十分鐘。`,
    quote: '犯錯不丟臉，同一種錯一直出現才麻煩。', prompt: '你要先研究哪一段？', hint: '看懂影片，下一場的判斷會真的不一樣。', valueLabel: 'FILM ROOM', tint: '#93b9c9',
    actions: () => [
      careerAction('A', '重看每一次防守站位', '找出自己什麼時候離對手太遠。', 'defense', 'iq', 'stopper', -10, 1.9, { trust: 4, load: 1 }, '你發現自己總是先看球，才會漏掉身後的人。', '畫面資訊太多，但教練幫你圈出最重要的站位。'),
      careerAction('B', '暫停畫面找傳球路線', '每一格都想一次，哪個隊友先空。', 'playmaking', 'iq', 'creator', -9, 2, { rhythm: 3, load: 1 }, '你看見原本忽略的底線空檔，下次不會再慢半拍。', '答案不只一個讓你有點亂，但閱讀速度已經開始變快。'),
      careerAction('C', '分析自己的出手選擇', '分清楚好球、勉強球和該多傳一次的球。', 'iq', 'shooting', 'connector', -11, 1.7, { rhythm: 4, reputation: 1 }, '你整理出三個簡單規則，下一場出手會更乾淨。', '有些球很難判斷，但你至少不會再只看有沒有投進。')
    ]
  },
  {
    id: 'train_defense_feet', phase: 'training', title: '不能用手的單防',
    story: ({ team }) => `${team.name} 今天玩一個狠規則：防守者不能伸手抄球，只能靠腳步擋住突破。全隊輪流挑戰你。`,
    quote: '先站住路線，再想抄球；被過掉就什麼都沒有。', prompt: '你準備怎麼守住第一步？', hint: '腳步、力量和預判，三種方法都能守人。', valueLabel: '1 ON 1', tint: '#78a7ff',
    actions: () => [
      careerAction('A', '壓低重心跟住腳步', '不亂跳，先把人留在身前。', 'defense', 'athletic', 'stopper', -7, 2.1, { load: 8, trust: 4 }, '你連守三球都沒失位，隊友開始認真起來。', '第一個假動作就讓你重心歪掉，但你很快調回來。'),
      careerAction('B', '先猜他最愛走哪邊', '用觀察縮小防守範圍。', 'iq', 'defense', 'connector', -8, 1.9, { rhythm: 4, load: 4 }, '你看出他每次都想走右邊，提前半步封住路線。', '你猜錯一次被直接過掉，現在知道不能只靠賭。'),
      careerAction('C', '用身體守住碰撞', '讓對手撞到你也不會失去位置。', 'athletic', 'defense', 'iron', -5, 2, { load: 10, trust: 3 }, '對手撞上來，你一步都沒退，最後只能停球。', '你站太直被頂開，但找到該怎麼用核心撐住。')
    ]
  },
  {
    id: 'train_conditioning', phase: 'training', title: '體能教練的新菜單',
    story: ({ season }) => `${season.age} 歲的你收到一張新菜單：衝刺、重訓和恢復各占一部分。今天只能加強其中一項。`,
    quote: '體能不是一直操，能在比賽最後還做對動作才有用。', prompt: '你今天把時間放在哪裡？', hint: '爆發、力量或恢復，會影響不同的場上感覺。', valueLabel: 'BODY LAB', tint: '#c8ee46',
    actions: () => [
      careerAction('A', '短距離爆發衝刺', '每組時間很短，但每一步都要全力。', 'athletic', 'finish', 'iron', -5, 2.1, { load: 12, rhythm: 4 }, '最後一組速度沒有掉，你的第一步明顯更快。', '後半段速度掉了，但教練抓到你的起跑姿勢問題。'),
      careerAction('B', '練核心和下肢力量', '增加對抗，也讓投籃落地更穩。', 'athletic', 'defense', 'iron', -8, 1.9, { load: 9, trust: 2 }, '重量沒有亂加，每一下都做得很標準。', '你想太快加重，姿勢差點跑掉，還好教練及時叫停。'),
      careerAction('C', '做完整恢復課', '伸展、按摩和睡眠都算今天的功課。', 'iq', 'athletic', 'connector', -14, 1, { load: -24, rhythm: 2 }, '隔天起床身體很輕，訓練品質也跟著變好。', '疲勞沒有一次消失，但你沒有再硬撐下去。')
    ]
  },
  {
    id: 'train_empty_gym', phase: 'training', title: '球館只剩你一個',
    story: ({ team }) => `${team.name} 的燈準備關了，管理員說還能再給你二十分鐘。沒有人看，你可以練招牌，也可以補基本功。`,
    quote: '沒人看的練習，最後也會出現在有人看的比賽。', prompt: '最後二十分鐘，你想留下什麼？', hint: '強化招牌最有感，基本功則更穩。', valueLabel: 'AFTER HOURS', tint: '#b7b3a8',
    actions: () => [
      careerAction('A', '把招牌動作再磨快一點', '專練目前最強能力，讓優點更難被守。', strongestStat(), 'iq', statTag(strongestStat()), -4, 2, { rhythm: 8, load: 7 }, '你的招牌動作又快了一拍，連自己都覺得順。', '想加速反而失去細節，你決定先回到原本節奏。'),
      careerAction('B', '做最普通的基本功', '傳球、運球、腳步，每樣都不偷懶。', 'playmaking', 'iq', 'creator', -11, 1.6, { trust: 3, load: 4 }, '看起來不炫，但每一下都更乾淨了。', '重複動作很無聊，不過你還是把整組做完。'),
      careerAction('C', '錄影檢查自己的動作', '用手機慢放，自己找出不順的地方。', 'iq', strongestStat(), 'connector', -10, 1.5, { rhythm: 3, scout: 1, load: 2 }, '慢動作一看就懂，你找到平常完全沒注意的小問題。', '角度拍得不好看不清楚，下次你知道鏡頭該放哪裡。')
    ]
  },
  {
    id: 'train_new_playbook', phase: 'training', title: '戰術本突然變厚',
    story: ({ country }) => `球隊加入一套${country.style}的新戰術。助教說明天就要實戰，你今晚只能先記熟自己的工作。`,
    quote: '戰術不是背路線，是知道隊友下一步會去哪。', prompt: '新戰術來了，你先搞懂什麼？', hint: '持球、無球和防守溝通都會影響教練信任。', valueLabel: 'PLAYBOOK', tint: '#93b9c9',
    actions: () => [
      careerAction('A', '先背熟持球選擇', '知道什麼時候傳、什麼時候自己打。', 'playmaking', 'iq', 'creator', -8, 2, { trust: 5, load: 3 }, '你把每個閱讀順序寫成簡單口訣，隔天完全沒跑錯。', '選項太多一時記不住，但你先抓住第一個判斷。'),
      careerAction('B', '練無球跑位和掩護', '沒有拿球也能幫球隊製造空檔。', 'iq', 'athletic', 'connector', -9, 1.8, { trust: 7, load: 5 }, '你每次都提早到位置，整套戰術突然跑得很順。', '有兩次擋到隊友路線，但你很快弄懂站位。'),
      careerAction('C', '負責喊出防守輪轉', '用聲音提醒隊友誰該補位。', 'defense', 'iq', 'stopper', -7, 1.8, { trust: 8, rhythm: 2 }, '你的提醒讓全隊少漏兩次人，教練直接點名稱讚。', '你喊得有點慢，但隊友開始願意回應你。')
    ]
  },
  {
    id: 'train_free_throw_noise', phase: 'training', title: '全隊圍著你罰球',
    story: ({ team }) => `${team.name} 練習結束前玩壓力罰球：投進全隊下課，沒進大家就再跑一組。現在球交到你手上。`,
    quote: '壓力不會消失，但你可以把動作做得跟平常一樣。', prompt: '大家都在看，你怎麼處理這兩罰？', hint: '例行動作、呼吸和硬練，各有不同效果。', valueLabel: 'PRESSURE', tint: '#ffcf66',
    actions: () => [
      careerAction('A', '照平常節奏直接投', '不多想，做完固定的三個動作。', 'shooting', 'iq', 'shooter', -8, 1.9, { rhythm: 8, trust: 3 }, '兩球都空心，全隊大叫著衝回休息室。', '第一球彈框，但你第二球沒有改動作，穩穩投進。'),
      careerAction('B', '先深呼吸再出手', '把心跳放慢，只盯著籃框後緣。', 'iq', 'shooting', 'connector', -11, 1.6, { rhythm: 5, load: -3 }, '你把外面的聲音都關掉，兩次出手像在空球館。', '還是聽得到隊友起鬨，但你的手沒有那麼僵了。'),
      careerAction('C', '主動加碼投十球', '不管前兩球結果，再多練一組壓力球。', 'shooting', 'athletic', 'shooter', -5, 2.1, { load: 7, trust: 5 }, '你最後連進七球，隊友以後真的敢把技術犯規罰球交給你。', '命中率普通，但大家看見你願意扛。')
    ]
  },
  {
    id: 'train_scrimmage_role', phase: 'training', title: '隊內賽只剩五分鐘',
    story: ({ team }) => `${team.name} 的隊內賽剩五分鐘，你這組落後 6 分。教練沒有喊戰術，只想看誰能把比賽拉回來。`,
    quote: '接管比賽不一定是一直投，也可能是讓每個人都做對事。', prompt: '最後五分鐘，你要扮演什麼角色？', hint: '得分、控場或防守，都可能讓教練記住你。', valueLabel: 'SCRIMMAGE', tint: '#ff7057',
    actions: () => [
      careerAction('A', '連續攻擊籃框', '用最直接的方式追分，也承擔碰撞。', 'finish', 'athletic', 'attack', -3, 2.1, { rhythm: 7, load: 10, trust: 2 }, '你連拿 6 分，把比分真的追了回來。', '第一球被封阻，但你沒有停下來，下一波找到更好角度。'),
      careerAction('B', '把每一球都組織好', '叫隊友站位，挑最好的出手機會。', 'playmaking', 'iq', 'creator', -6, 1.9, { trust: 8, load: 5 }, '全隊連續三次打出空檔，教練一直在場邊點頭。', '大家一開始聽不懂你的手勢，但後兩波配合順多了。'),
      careerAction('C', '全場黏住對面主力', '先靠防守把節奏搶回來。', 'defense', 'athletic', 'stopper', -5, 2, { trust: 6, load: 9, rhythm: 3 }, '你逼出兩次失誤，落後分數一下就不見了。', '對手還是進了一球，但每次出手都被你逼得很難。')
    ]
  },
  {
    id: 'train_personal_trainer', phase: 'training', title: '訓練師先拆掉你的壞習慣',
    story: ({ season }) => `${season.age < 19 ? '學校介紹的' : '經紀團隊找來的'}訓練師沒有先叫你狂操，而是拍下起步、急停和落地動作。他說今天只改一個細節，練好才往下走。`,
    quote: '練得累不一定有進步，動作做對才算真的升級。', prompt: '一對一檢測後，你最想先修哪一項？', hint: '訓練師會針對腳步、出手或身體控制給你專屬菜單。', valueLabel: 'SKILL LAB', tint: '#65d9ff',
    actions: () => [
      careerAction('A', '重做第一步和急停腳步', '降低重心，學會不多踩那一下。', 'athletic', 'finish', 'attack', -8, 2.35, { rhythm: 6, load: 7 }, '訓練師把動作拆成三段，你的啟動更快，停下來也不再東倒西歪。', '改動作的前幾組很卡，但你終於知道速度為什麼一直上不去。'),
      careerAction('B', '校正出手路線', '從手肘、手腕到落地，一格一格修。', 'shooting', 'iq', 'shooter', -9, 2.3, { rhythm: 7, load: 4 }, '慢動作畫面變得乾淨，連續出手也能維持同一條路線。', '新姿勢暫時不順，訓練師要你先求穩，不准急著投遠。'),
      careerAction('C', '練碰撞後的身體控制', '不是硬撞，先學會核心出力和安全落地。', 'finish', 'athletic', 'iron', -6, 2.25, { load: 9, trust: 2 }, '你被護墊撞到還能保住球，落地也沒有亂跨一步。', '碰撞後球還是掉了，但你沒有用危險姿勢硬撐。')
    ]
  },
  {
    id: 'train_pro_camp', phase: 'training', title: '職業球員夏令營開放挑戰',
    story: ({ country, season }) => `一名在${country.name}打球的職業球員舉辦夏令營。${season.age < 19 ? '現場有各校好手，教練也在場邊記名字。' : '不少職業球員休季也來練，強度比一般團練更快。'}你拿到一整天的入場證。`,
    quote: '先看懂高手怎麼準備，再想著跟他單挑。', prompt: '難得進到職業球員的訓練場，你要抓住什麼？', hint: '挑戰高手曝光高；學角色和看影片比較穩定。', valueLabel: 'PRO CAMP', tint: '#e591ff',
    actions: () => [
      careerAction('A', '排隊挑戰營隊主將', '直接跟最強的人對位，看看差距有多大。', strongestStat(), 'athletic', statTag(strongestStat()), -1, 2.1, { scout: 8, reputation: 5, load: 10 }, '你沒有每球都贏，但打出一個漂亮回合，全場都記住你的名字。', '對方連續抓到你的弱點；有點痛，但這堂課比剪輯精華更真實。'),
      careerAction('B', '跟著職業角色球員練', '觀察他怎麼跑位、溝通和搶上場時間。', 'iq', 'defense', 'connector', -10, 2.05, { trust: 5, scout: 4, load: 5 }, '你發現職業球員每個小動作都有理由，回隊後馬上更會站位置。', '資訊很多記不完，但你先帶走三個能直接用的習慣。'),
      careerAction('C', '拿自己的影片去問診', '請營隊教練指出最該先改的一段。', 'iq', weakestStat(), 'creator', -11, 1.95, { scout: 5, rhythm: 5, load: 1 }, '教練沒有講空話，直接圈出一個影響你上場時間的問題。', '問到的答案不太好聽，但至少比自己亂練省下很多時間。')
    ]
  },
  {
    id: 'team_roster_board', phase: 'team', title: '名單板上少一個名字',
    story: ({ season }) => `${season.age < 19 ? '明天的十二人名單' : '下一場登錄名單'} 還差最後一格。教練說今天的團練表現會直接影響決定。`,
    quote: '想上場就要讓教練知道，把你放進去能解決什麼問題。', prompt: '最後一個名額，你要怎麼搶？', hint: '秀強項、幫全隊或降低疲勞，都是一種選擇。', valueLabel: 'ROSTER', tint: '#dfff00',
    actions: () => [
      careerAction('A', '把最強能力秀給教練看', '用你的招牌證明自己能馬上幫忙。', strongestStat(), 'athletic', statTag(strongestStat()), -3, 1.6, { trust: 5, reputation: 3, load: 7 }, '你的優點非常清楚，教練在名單板上寫下你的名字。', '今天沒有完全打出來，但教練知道你能提供什麼。'),
      careerAction('B', '幫全隊把戰術跑順', '不搶鏡，專心補位、傳球和提醒。', 'playmaking', 'iq', 'connector', -8, 1.5, { trust: 10, load: 4 }, '你讓每一組都跑得更順，隊友第一個替你說話。', '戰術還是有點亂，但沒有人懷疑你的態度。'),
      careerAction('C', '坦白說身體需要休息', '不硬撐，避免上場後反而拖累球隊。', 'iq', 'athletic', 'connector', -13, .8, { load: -20, trust: 2, rhythm: -2 }, '教練尊重你的誠實，也說健康後機會還在。', '你怕失去機會，但身體確實需要這一天。')
    ]
  },
  {
    id: 'team_language_gap', phase: 'team', title: '戰術聽懂一半',
    story: ({ country }) => `在${country.name} 的戰術會議上，教練講得很快，你只聽懂一半。隊友已經準備離開，明天就要比賽。`,
    quote: '不懂就問，裝懂才會在場上一起迷路。', prompt: '語言卡住了，你要怎麼補救？', hint: '問隊友、畫戰術或自己猜，結果會差很多。', valueLabel: 'ADAPT', tint: '#93b9c9',
    actions: () => [
      careerAction('A', '請隊友用最簡單的話重講', '直接承認沒聽懂，一個位置一個位置問。', 'playmaking', 'iq', 'connector', -10, 1.6, { trust: 9, load: 2 }, '隊友不只重講，還陪你在場上走了一遍。', '有些詞還是不熟，但你至少敢在場上繼續問。'),
      careerAction('B', '把戰術畫成自己的圖', '用箭頭和顏色整理每一個輪轉。', 'iq', 'playmaking', 'creator', -9, 1.8, { rhythm: 4, load: 3 }, '圖畫完後整套戰術突然變簡單，你也能講給別人聽。', '第一張圖畫太亂，重畫後終於抓到重點。'),
      careerAction('C', '先記住自己的第一步', '資訊太多，先確保開局不跑錯。', 'athletic', 'iq', 'iron', -7, 1.2, { rhythm: 3, trust: 2 }, '至少開局站位完全正確，後面也能跟著隊友調整。', '第二段變化還是慢了，但沒有整套戰術一起崩掉。')
    ]
  },
  {
    id: 'team_new_competitor', phase: 'team', title: '同位置來了新人',
    story: ({ team }) => `${team.name} 新來一名跟你同位置的球員。第一堂訓練，他速度很快，教練也一直跟他說話。`,
    quote: '競爭不是把隊友踩下去，是逼自己拿出更好的東西。', prompt: '新競爭者出現，你怎麼回應？', hint: '正面單挑、合作或默默加練，會走出不同路線。', valueLabel: 'COMPETE', tint: '#ff7b52',
    actions: () => [
      careerAction('A', '主動約他一對一', '正面比一次，看看自己的差距。', 'defense', 'finish', 'stopper', -3, 1.9, { rhythm: 6, load: 8, trust: 2 }, '你們互有輸贏，彼此也都摸清楚該進步哪裡。', '他今天佔上風，但你把每個被過的方式都記下來了。'),
      careerAction('B', '先跟他一起練', '交換招式，也學他做得好的地方。', 'playmaking', 'iq', 'connector', -8, 1.6, { trust: 10, load: 5 }, '你們的競爭沒有變少，球隊配合卻直接變好。', '一開始有點尷尬，但至少沒有變成互相不傳球。'),
      careerAction('C', '留下來加練自己的招牌', '不比較嘴巴，用場上表現回答。', strongestStat(), 'athletic', statTag(strongestStat()), -5, 2, { rhythm: 5, load: 10, reputation: 2 }, '你的招牌更穩了，隔天教練也把目光拉回你身上。', '疲勞讓效果沒有想像中好，但競爭心真的被點燃了。')
    ]
  },
  {
    id: 'team_bench_call', phase: 'team', title: '板凳最後一個叫到你',
    story: ({ team }) => `${team.name} 的比賽打到第三節，先發球員陷入犯規麻煩。助教突然轉頭：「準備，下一個死球換你。」`,
    quote: '機會不會先提醒你，板凳上的每一秒都要跟著比賽。', prompt: '臨時被叫上場，你先做哪件事？', hint: '安全、進攻或防守，第一印象很重要。', valueLabel: 'CHECK IN', tint: '#ffcf66',
    actions: () => [
      careerAction('A', '先打一個最安全的回合', '不搶戲，先把戰術跑對。', 'iq', 'playmaking', 'connector', -9, 1.6, { trust: 9, rhythm: 3 }, '你一上場就站對位置，教練放心讓你多打幾分鐘。', '第一個回合有點緊，但沒有送出無謂失誤。'),
      careerAction('B', '第一個空檔就果斷出手', '讓對手知道不能放你。', 'shooting', 'iq', 'shooter', -3, 1.9, { rhythm: 8, trust: 3, reputation: 2 }, '你接球沒有猶豫，第一球就乾淨命中。', '球沒進，但出手選擇沒問題，教練要你繼續相信自己。'),
      careerAction('C', '全力守住對面主力', '用防守證明自己能留在場上。', 'defense', 'athletic', 'stopper', -5, 1.9, { trust: 8, load: 7 }, '你連續守住兩波，換人牌又被教練放回桌上。', '第一次對位被速度嚇到，但第二波你已經跟上。')
    ]
  },
  {
    id: 'team_losing_streak', phase: 'team', title: '休息室安靜到不行',
    story: ({ team }) => `${team.name} 吞下三連敗。練習結束後沒有人說話，有隊友開始互相怪罪，教練還沒走進來。`,
    quote: '連敗時最容易各打各的，也最需要有人先把話說清楚。', prompt: '氣氛快爆了，你會做什麼？', hint: '開口、用訓練帶動，或先冷靜整理問題。', valueLabel: 'LOCKER ROOM', tint: '#78847c',
    actions: () => [
      careerAction('A', '把大家叫在一起講清楚', '不抓戰犯，只說下一場能改什麼。', 'playmaking', 'iq', 'connector', -8, 1.5, { trust: 12, rhythm: 3 }, '大家終於把真話講出來，氣氛沒有立刻變好，但方向一致了。', '一開始還是有人不爽，不過至少沒有繼續互相酸。'),
      careerAction('B', '直接開始下一組加練', '少說話，用行動把隊友拉回球場。', 'athletic', 'defense', 'iron', -6, 1.8, { trust: 7, load: 9, rhythm: 4 }, '兩個隊友跟著你留下，最後整隊都回到場上。', '不是每個人都留下，但教練看見你沒有放掉。'),
      careerAction('C', '整理三場失分原因', '先把情緒放旁邊，用影片找問題。', 'iq', 'defense', 'connector', -10, 1.7, { trust: 5, load: 1, scout: 1 }, '你找出共同問題：退防太慢。答案終於不是「誰打不好」。', '數據沒有唯一答案，但至少讓討論回到比賽本身。')
    ]
  },
  {
    id: 'team_scout_invite', phase: 'team', title: '球探測試撞上團練',
    story: ({ season }) => `${season.age < 19 ? '外地學校' : '另一支球隊'} 臨時邀請你參加測試，但時間跟團練完全重疊。最後還是要由你自己決定。`,
    quote: '曝光能打開下一扇門，信任則決定你現在能不能上場。', prompt: '同一個下午，你要去哪裡？', hint: '球探、球隊或折衷，都有明確代價。', valueLabel: 'CHOICE', tint: '#e591ff',
    actions: () => [
      careerAction('A', '去參加球探測試', '把最強能力秀給更多球隊看。', strongestStat(), 'athletic', statTag(strongestStat()), -2, 1.5, { scout: 10, reputation: 5, trust: -3, load: 6 }, '你的測試數字很亮眼，幾位球探真的把名字記下來了。', '沒有打出最好表現，但至少更多人知道你是誰。'),
      careerAction('B', '留下完成整堂團練', '先守住現在的輪替位置和隊友信任。', 'playmaking', 'iq', 'connector', -9, 1.5, { trust: 11, scout: -1, load: 5 }, '你幫全隊把戰術跑順，教練當場多給你一組輪替。', '訓練普通，隊友還是知道你把球隊擺在前面。'),
      careerAction('C', '請對方改成線上訪談', '不缺席團練，也試著保留曝光。', 'iq', 'playmaking', 'creator', -7, 1.2, { scout: 5, trust: 5, load: 3 }, '訪談和團練都完成，雖然不算完美，但兩邊都沒斷線。', '時間排得很趕，你兩邊都只做到及格。')
    ]
  },
  {
    id: 'team_teammate_slump', phase: 'team', title: '隊友投到不敢出手',
    story: ({ team }) => `${team.name} 的射手連三場手感低迷。今天他在空檔接到球，卻又傳了回來。練習後，他一個人坐在場邊。`,
    quote: '真正的隊友不是只在對方進球時拍手。', prompt: '你要怎麼幫他找回感覺？', hint: '陪練、聊天或場上創造空檔，都能建立默契。', valueLabel: 'TEAMMATE', tint: '#93b9c9',
    actions: () => [
      careerAction('A', '留下陪他投一百球', '只負責傳球和撿球，讓他慢慢找節奏。', 'playmaking', 'shooting', 'creator', -10, 1.5, { trust: 12, load: 5 }, '最後二十球他進了十七球，離開時終於笑了。', '命中率還沒回來，但他知道不是自己一個人在撐。'),
      careerAction('B', '跟他聊自己低潮的經驗', '不教訓，只告訴他你也曾經懷疑自己。', 'iq', 'playmaking', 'connector', -12, 1.3, { trust: 10, load: -2, rhythm: 2 }, '他沒有立刻變開心，但說明天會繼續投。', '你不太會安慰人，不過陪著坐一下也有用。'),
      careerAction('C', '下一場一直幫他做空檔', '用掩護和傳球給他最舒服的出手機會。', 'iq', 'athletic', 'connector', -7, 1.7, { trust: 11, load: 6, reputation: 1 }, '你連續創造兩個大空檔，他第二球終於投進了。', '他還是沒進，但出手已經不像之前那麼猶豫。')
    ]
  },
  {
    id: 'team_role_change', phase: 'team', title: '教練要你換一種打法',
    story: ({ team }) => `${team.name} 的教練說球隊現在缺的不是更多得分，而是有人能防守、傳球和穩住節奏。他問你願不願意改角色。`,
    quote: '改角色不是放棄自己，是多一種留在場上的理由。', prompt: '面對新角色，你怎麼選？', hint: '接受、保留招牌或要求更多說明。', valueLabel: 'NEW ROLE', tint: '#d9ed83',
    actions: () => [
      careerAction('A', '直接接受新任務', '先把球隊缺的工作做好。', 'defense', 'iq', 'stopper', -8, 1.8, { trust: 12, rhythm: 1 }, '你第一堂就全力執行，教練馬上把你排進新輪替。', '新工作比想像中難，但態度讓教練願意繼續教。'),
      careerAction('B', '保留招牌，也增加傳球', '不完全改掉自己，慢慢變得更全面。', 'playmaking', strongestStat(), 'creator', -5, 1.7, { trust: 7, rhythm: 5, load: 4 }, '你既沒有消失，也讓隊友拿到更多好球。', '兩種任務一起做有點亂，但方向是對的。'),
      careerAction('C', '請教練把要求講清楚', '先確認上場時最重要的前三件事。', 'iq', 'playmaking', 'connector', -11, 1.5, { trust: 8, load: 1 }, '教練列出三個簡單目標，你終於知道怎麼搶時間。', '教練講得還是很快，但你至少問到最重要的一件事。')
    ]
  },
  {
    id: 'team_road_trip', phase: 'team', title: '客場行李不見了',
    story: ({ country }) => `球隊抵達${country.name}客場後，你的行李沒有跟著出來。球鞋、護具和換洗衣物都在裡面，晚上的訓練照常。`,
    quote: '旅外不只是在場上打球，場外的小事也要自己處理。', prompt: '行李找不到，你先怎麼處理？', hint: '求助、自己買或調整訓練，會影響不同狀態。', valueLabel: 'ROAD TRIP', tint: '#65d9ff',
    actions: () => [
      careerAction('A', '馬上請領隊和隊友幫忙', '把資料準備好，分頭找行李和借裝備。', 'iq', 'playmaking', 'connector', -12, 1.2, { trust: 9, load: -2 }, '大家很快幫你借齊裝備，行李也在隔天送到。', '流程比想像中慢，但你沒有一個人亂跑。'),
      careerAction('B', '自己去附近買基本裝備', '花錢換時間，確保不缺席訓練。', 'athletic', 'iq', 'iron', -9, 1.3, { reputation: 2, trust: 5, load: 3 }, '你準時回到球館，教練只說了一句：「處理得不錯。」', '尺寸不完全合，但至少沒有錯過整堂訓練。'),
      careerAction('C', '改做低強度影片和伸展', '沒有自己的鞋就不硬練，先保護身體。', 'iq', 'defense', 'connector', -13, 1.1, { load: -14, rhythm: -1, trust: 3 }, '你把不能練球的時間用來整理對手，身體也得到休息。', '手感有點掉，但避免穿不合腳的鞋受傷更重要。')
    ]
  },
  {
    id: 'team_contract_pressure', phase: 'team', title: '未來去向傳來消息',
    story: ({ season }) => `${season.age < 19 ? '下一階段的邀請' : '目前合約'}突然傳來消息，條件沒有想像中穩。偏偏明天就是重要比賽，你的腦袋一直想到未來。`,
    quote: '未來很重要，但你真正能控制的還是下一次上場。', prompt: '壓力跑進腦袋，你怎麼整理？', hint: '專心比賽、研究條件或請人協助。', valueLabel: 'FUTURE', tint: '#e591ff',
    actions: () => [
      careerAction('A', '先請信任的人幫忙', '把手機交給家人或經紀人，比賽前不再看消息。', 'iq', 'athletic', 'connector', -10, 1.4, { rhythm: 9, load: -4, trust: 3 }, '通知沒有消失，但你的注意力真的回到球場。', '還是會想到未來，但至少沒有一直刷新手機。'),
      careerAction('B', '把條件全部研究清楚', '先知道風險，心裡才不會一直猜。', 'iq', 'playmaking', 'creator', -7, 1.5, { scout: 4, reputation: 2, load: 4, rhythm: -2 }, '你整理出真正要問的三個問題，不再被一堆數字嚇到。', '資訊越看越多，但至少知道自己還缺什麼。'),
      careerAction('C', '找教練談現在的定位', '直接問怎麼做才能得到更多機會。', 'playmaking', 'iq', 'connector', -8, 1.5, { trust: 9, scout: 2, load: 1 }, '教練沒有保證合約，但把你下一步該做什麼講得很清楚。', '答案不算好聽，不過比自己亂猜更有用。')
    ]
  },
  {
    id: 'team_local_sponsor', phase: 'team', title: '在地品牌想拍你的第一支短片',
    story: ({ season }) => `虛構運動飲料品牌「VOLT+」看上你最近的表現，想拍一支球館短片。${season.age < 19 ? '家長和學校都要先同意，酬勞不高，但同齡球迷會看到。' : '球隊同意合作，只提醒你別影響訓練。'}`,
    quote: '曝光不是白送的，每一次合作也都在累積你的形象。', prompt: '第一個品牌邀請來了，你怎麼回覆？', hint: '合作能增加收入和曝光，也可能吃掉休息與訓練時間。', valueLabel: 'BRAND CALL', tint: '#ffcf66',
    actions: ({ season }) => {
      const income = season.age < 19 ? 2 : 10;
      return [
        careerAction('A', '接下球館短片', '把訓練日常拍得真實，不硬演。', 'iq', 'shooting', 'connector', -7, 1.35, { income, reputation: 7, scout: 3, load: 4 }, '成品沒有浮誇台詞，球迷反而喜歡你的真實感，合作也順利上線。', '鏡頭前有點僵，但品牌仍留下可用畫面。', { endorsement: { brand: 'VOLT+', type: '運動飲料短片' } }),
        careerAction('B', '改成全隊一起入鏡', '把曝光分給隊友，也讓內容更自然。', 'playmaking', 'iq', 'connector', -10, 1.25, { income: Math.max(1, Math.round(income * .7)), reputation: 4, trust: 9, load: 2 }, '隊友玩得很開心，影片像真正的球隊日常，品牌也願意再合作。', '大家時間難喬，最後只拍到簡單片段。', { endorsement: { brand: 'VOLT+', type: '球隊聯名短片' } }),
        careerAction('C', '先拒絕，保留休息時間', '這週身體太累，不勉強接工作。', 'athletic', 'iq', 'iron', -13, .85, { load: -14, rhythm: 3 }, '你把休息補回來，隔天訓練的速度明顯更好。', '品牌機會先離開了，但你的身體沒有被硬榨。')
      ];
    }
  },
  {
    id: 'team_endorsement_pitch', phase: 'team', eligible: ({ season }) => season.age >= 16, title: '品牌簡報要你選個人形象',
    story: ({ season }) => `虛構機能服品牌「NORTH ARC」帶著三套提案來球隊。${season.age < 19 ? '這是校園合作，監護人會一起審合約。' : '這份季中合作會直接影響你的收入和市場曝光。'}品牌只問：你希望大家記得哪一面的你？`,
    quote: '代言不是換一件衣服而已，球迷會從內容認識你。', prompt: '你要把品牌合作做成什麼樣子？', hint: '訓練、團隊或潮流路線，會吸引不同目光。', valueLabel: 'PITCH DAY', tint: '#93b9c9',
    actions: ({ season }) => {
      const income = season.age < 19 ? 4 : 18;
      return [
        careerAction('A', '拍「苦練日常」企劃', '紀錄清晨訓練，不需要演戲。', 'athletic', 'iq', 'iron', -6, 1.5, { income, reputation: 8, scout: 4, load: 7 }, '你真的完成清晨訓練，片子上線後大家開始用「很拚」形容你。', '早起讓狀態有點差，還好拍攝沒有拖太久。', { endorsement: { brand: 'NORTH ARC', type: '機能服訓練企劃' } }),
        careerAction('B', '拍「隊友讓我變強」', '讓助攻、防守和休息室互動成為主角。', 'playmaking', 'iq', 'connector', -9, 1.35, { income: Math.round(income * .9), reputation: 6, trust: 10, load: 3 }, '隊友願意幫忙，品牌片不只好看，球隊氣氛也被更多人看見。', '片子節奏普通，但隊友很在意你沒有只拍自己。', { endorsement: { brand: 'NORTH ARC', type: '團隊形象企劃' } }),
        careerAction('C', '拍場外穿搭內容', '風格最搶眼，籃球內容則比較少。', 'shooting', 'iq', 'shooter', -3, 1.15, { income: Math.round(income * 1.15), reputation: 12, scout: 1, load: 4 }, '照片快速被轉發，你的場外辨識度一下拉高。', '造型很有話題，籃球圈的評價卻沒有明顯改變。', { endorsement: { brand: 'NORTH ARC', type: '場外形象企劃' } })
      ];
    }
  },
  {
    id: 'team_shoe_trial', phase: 'team', eligible: ({ season }) => season.age >= 19, title: '球鞋品牌送來三雙測試鞋',
    story: () => '虛構球鞋品牌「NOVA STEP」想簽一份短期體驗合作。合約還不是明星等級，但會提供裝備、拍攝費和曝光。品牌要求你實戰穿鞋，再交出真實回饋。',
    quote: '好裝備是幫助，不會替你投進下一球。', prompt: '球鞋體驗合作，你要怎麼測？', hint: '實戰、科學測試或只收裝備，收益與口碑都不同。', valueLabel: 'SHOE DEAL', tint: '#dfff00',
    actions: ({ season }) => {
      const income = season.age >= 23 ? 35 : 12;
      return [
        careerAction('A', '重要比賽直接實戰穿', '曝光最高，但新鞋需要馬上適應。', 'athletic', 'finish', 'attack', -1, 1.45, { income, reputation: 12, scout: 6, load: 7, rhythm: -2 }, '鞋子撐住整場，你也打出一次漂亮切入，品牌把畫面剪進主廣告。', '鞋感還不熟影響第一步，品牌仍接受你的真實回饋。', { endorsement: { brand: 'NOVA STEP', type: '球鞋實戰體驗' } }),
        careerAction('B', '先做完整體測再上場', '測抓地、緩震和落地，安全後才比賽。', 'iq', 'athletic', 'iron', -10, 1.5, { income: Math.round(income * .85), reputation: 7, scout: 3, load: 2 }, '你的回饋非常具體，品牌把你列進下一輪長約觀察名單。', '測試沒有爆點，但避免了不合腳就硬上的風險。', { endorsement: { brand: 'NOVA STEP', type: '球鞋性能測試' } }),
        careerAction('C', '只接受裝備，不拍廣告', '收入較少，保留自己的使用空間。', 'iq', 'defense', 'connector', -12, 1.15, { income: Math.max(3, Math.round(income * .3)), reputation: 2, load: -2 }, '品牌尊重你的選擇，你也拿到一季裝備支援。', '合作沒有太多聲量，但至少沒有打亂場上準備。', { endorsement: { brand: 'NOVA STEP', type: '裝備支援' } })
      ];
    }
  },
  {
    id: 'team_brand_content', phase: 'team', eligible: ({ season }) => season.age >= 16, title: '品牌日撞上球隊恢復課',
    story: () => '虛構耳機品牌「ECHO RUN」臨時想加拍一支社群短片，時間剛好和球隊恢復課重疊。經紀人說收入不錯，體能教練則提醒你最近負荷偏高。',
    quote: '能接工作不代表每一份都要接，長期生涯要會排時間。', prompt: '收入、曝光和身體撞在一起，你怎麼排？', hint: '全拍、縮短或婉拒，會留下不同的品牌與球隊評價。', valueLabel: 'MEDIA DAY', tint: '#65d9ff',
    actions: ({ season }) => {
      const income = season.age >= 23 ? 28 : 7;
      return [
        careerAction('A', '照原企劃全部拍完', '收入最高，但恢復課只能缺席。', 'shooting', 'iq', 'shooter', -2, 1.2, { income, reputation: 14, scout: 3, load: 12, trust: -3 }, '成品很有話題，你的追蹤數明顯上升，身體卻需要多一天恢復。', '拍攝拖太久，隔天訓練狀態明顯不在線。', { endorsement: { brand: 'ECHO RUN', type: '社群影音合作' } }),
        careerAction('B', '把內容縮成三十分鐘', '少賺一點，恢復課也不缺席。', 'iq', 'playmaking', 'connector', -10, 1.35, { income: Math.round(income * .65), reputation: 7, trust: 6, load: 3 }, '你準時收工，品牌拿到素材，球隊也沒被放鳥。', '時間很趕，影片普通但行程至少沒有爆掉。', { endorsement: { brand: 'ECHO RUN', type: '精簡社群合作' } }),
        careerAction('C', '這次先婉拒拍攝', '把恢復和下一場比賽放在前面。', 'athletic', 'iq', 'iron', -13, .9, { load: -18, trust: 7, rhythm: 4 }, '品牌沒有翻臉，體能教練也幫你把身體拉回好狀態。', '少了一筆收入，但下一場的雙腿很有感。')
      ];
    }
  }
];

let state = null;
let selectedPosition = 'PG';
let selectedCareerMode = 'classic';
let selectedHeight = POSITIONS.PG.height;
let selectedWeight = POSITIONS.PG.weight;
let setupDiceRoll = null;
let setupAllocations = { finish: 0, shooting: 0, playmaking: 0, defense: 0, athletic: 0, iq: 0 };
let toastTimer = null;
let shareCardDataUrl = '';
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

function emptyAllocations() {
  return { finish: 0, shooting: 0, playmaking: 0, defense: 0, athletic: 0, iq: 0 };
}

function diceRollForSeed(seedCode) {
  const code = normalizeSeedCode(seedCode) || generateSeedCode();
  const random = makeSeedRandom(hashSeed(`${code}|DICE-DRAFT-V1`));
  const count = 1 + Math.floor(random() * 6);
  const faces = Array.from({ length: count }, () => 1 + Math.floor(random() * 6));
  return { count, faces, total: faces.reduce((sum, face) => sum + face, 0) };
}

function physicalModifiers(profile) {
  const position = POSITIONS[profile.position] || POSITIONS.PG;
  const height = clamp(Number(profile.height) || position.height, position.heightRange[0], position.heightRange[1]);
  const weight = clamp(Number(profile.weight) || position.weight, position.weightRange[0], position.weightRange[1]);
  const heightUnits = (height - position.height) / 7;
  const weightUnits = (weight - position.weight) / 12;
  const round = (value) => Math.round(value * 10) / 10;
  return {
    height,
    weight,
    bonuses: {
      finish: round(heightUnits * .55 + weightUnits * .7),
      shooting: round(-Math.max(0, weightUnits) * .25),
      playmaking: round(-heightUnits * .45 - weightUnits * .28),
      defense: round(heightUnits * .75 + weightUnits * .35),
      athletic: round(-Math.max(0, weightUnits) * .75 + Math.max(0, -weightUnits) * .35 - Math.max(0, heightUnits) * .15),
      iq: 0
    }
  };
}

function allocationCap(stat, positionKey = selectedPosition, height = selectedHeight, weight = selectedWeight) {
  const position = POSITIONS[positionKey] || POSITIONS.PG;
  const tall = height >= position.height + 6;
  const short = height <= position.height - 6;
  const heavy = weight >= position.weight + 10;
  let cap = position.caps[stat] || 10;
  if (tall && ['finish', 'defense'].includes(stat)) cap += 1;
  if (tall && ['playmaking', 'athletic'].includes(stat)) cap -= 1;
  if (short && ['playmaking', 'athletic'].includes(stat)) cap += 1;
  if (heavy && ['finish', 'defense'].includes(stat)) cap += 1;
  if (heavy && stat === 'athletic') cap -= 1;
  return clamp(cap, 6, 15);
}

function bodyAtAge(profile, age) {
  const position = POSITIONS[profile.position] || POSITIONS.PG;
  const adultHeight = Number(profile.height) || position.height;
  const adultWeight = Number(profile.weight) || position.weight;
  const progress = clamp((age - 13) / 5, 0, 1);
  const heightGap = clamp(10 + (adultHeight - 180) * .22, 10, 22);
  const weightGap = clamp(16 + (adultWeight - 80) * .2, 15, 30);
  return {
    height: Math.round(adultHeight - heightGap * (1 - progress)),
    weight: Math.round(adultWeight - weightGap * (1 - progress)),
    adultHeight,
    adultWeight
  };
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
  addMap(stats, physicalModifiers(profile).bonuses);
  addMap(stats, profile.allocations || {});
  addMap(stats, STYLES[profile.style]?.bonus || {});
  Object.keys(stats).forEach((key) => { stats[key] = clamp(stats[key], 35, 78); });
  return stats;
}

function renderSeedPreview() {
  const input = $('#career-seed');
  const preview = $('#seed-preview');
  if (!input || !preview) return;
  if (!input.value) {
    preview.innerHTML = '<strong>?</strong><span><b>隱藏天賦未生成</b><small>輸入種子碼，或按「重抽」產生新的隱藏能力。</small></span><em>能力保密</em>';
    return;
  }
  preview.innerHTML = `
    <strong>?</strong>
    <span><b>隱藏天賦不公開</b><small>種子碼控制底層專長與成長速度；你仍能用骰點打造自己的球員。</small></span>
    <em>${setupDiceRoll ? `${setupDiceRoll.count} 顆骰子` : '等待擲骰'}</em>`;
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
  setupDiceRoll = null;
  setupAllocations = emptyAllocations();
  selectedHeight = POSITIONS[selectedPosition].height;
  selectedWeight = POSITIONS[selectedPosition].weight;
  renderSeedPreview();
  renderBuildLab();
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

function activeCareerMode(source = state) {
  return CAREER_MODES[source?.profile?.careerMode] || CAREER_MODES.classic;
}

function dominantLifePath(source = state) {
  const entries = Object.keys(LIFE_PATHS).map((key) => ({ key, ...LIFE_PATHS[key], count: Number(source?.lifePaths?.[key]) || 0 }));
  entries.sort((a, b) => b.count - a.count || Object.keys(LIFE_PATHS).indexOf(a.key) - Object.keys(LIFE_PATHS).indexOf(b.key));
  return entries[0]?.count ? entries[0] : { key: 'self', ...LIFE_PATHS.self, count: 0 };
}

function recordStoryBranch(action) {
  if (!action.lifePath || !LIFE_PATHS[action.lifePath]) return;
  state.lifePaths = state.lifePaths || Object.fromEntries(Object.keys(LIFE_PATHS).map((key) => [key, 0]));
  state.storyFlags = Array.isArray(state.storyFlags) ? state.storyFlags : [];
  state.lifePaths[action.lifePath] = (state.lifePaths[action.lifePath] || 0) + 1;
  const season = currentSeason();
  const record = {
    year: season.year,
    age: season.age,
    chapter: state.week,
    path: action.lifePath,
    label: action.branchLabel || action.title,
    outcome: action.branchOutcome || action.success || ''
  };
  const existingIndex = state.storyFlags.findIndex((item) => item.year === record.year && item.chapter === record.chapter);
  if (existingIndex >= 0) state.storyFlags[existingIndex] = record;
  else state.storyFlags.push(record);
}

function longestProTeamStay(source = state) {
  const counts = {};
  (source?.history || []).forEach((item) => {
    const team = TEAMS[item.teamId] || Object.values(TEAMS).find((candidate) => candidate.name === item.team);
    if (team?.level === 'pro') counts[team.id] = (counts[team.id] || 0) + 1;
  });
  return Math.max(0, ...Object.values(counts));
}

function careerModeProgress(source = state) {
  const key = source?.profile?.careerMode || 'classic';
  const mode = CAREER_MODES[key] || CAREER_MODES.classic;
  const sourceOverall = source?.stats ? overall(source) : 0;
  let value = 0;
  let label = '0%';
  let detail = mode.objective;

  if (key === 'odyssey') {
    const countries = source?.visited?.length || 1;
    value = clamp((countries / 4) * 100);
    label = `${countries} / 4 國`;
    detail = countries >= 4 ? '遠征完成，世界都看過你的球。' : `再踏上 ${Math.max(0, 4 - countries)} 個國家的球場。`;
  } else if (key === 'dynasty') {
    const stay = longestProTeamStay(source);
    const trophies = source?.trophies || 0;
    value = clamp((Math.min(stay, 4) / 4) * 75 + (trophies > 0 ? 25 : 0));
    label = `${stay} / 4 季 · ${trophies} 冠`;
    detail = value >= 100 ? '你真的把球隊打成了王朝。' : '同隊累積季數，再補上一座冠軍。';
  } else if (key === 'underdog') {
    value = clamp(((sourceOverall - 42) / 38) * 100);
    label = `${sourceOverall} / 80 OVR`;
    detail = sourceOverall >= 80 ? '逆襲完成，低起點也能練成王牌。' : `距離逆襲目標還差 ${Math.max(0, 80 - sourceOverall)} OVR。`;
  } else {
    const seasons = source?.history?.length || 0;
    value = clamp((seasons / SEASONS.length) * 100);
    label = `${seasons} / ${SEASONS.length} 個年齡`;
    detail = seasons >= SEASONS.length ? '完整生涯已通關。' : `還有 ${Math.max(0, SEASONS.length - seasons)} 個年齡故事。`;
  }

  return { key, mode, value, label, detail, complete: value >= 100 };
}

function careerModeGrowthMultiplier(success) {
  const key = state?.profile?.careerMode || 'classic';
  if (key === 'underdog') return success ? 1.04 : 1.24;
  if (key === 'odyssey' && currentTeam().country !== 'TW') return 1.08;
  if (key === 'dynasty' && state.history.at(-1)?.teamId === state.teamId) return 1.06;
  return 1;
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

  if (state.profile.careerMode === 'dynasty' && team.level === 'pro' && team.id === state.teamId && margin >= 0 && years < 3) {
    years += 1;
    type = years >= 3 ? '王朝核心長約' : '續留標準合約';
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
  const previousVersion = Number(parsed.version) || 1;
  if (previousVersion <= 4) {
    const legacyAge = parsed.mode === 'summary' && parsed.summary?.age
      ? parsed.summary.age
      : LEGACY_SEASON_AGES[parsed.seasonIndex] || parsed.history?.at(-1)?.age || 13;
    const migratedIndex = SEASONS.findIndex((season) => season.age === legacyAge);
    parsed.seasonIndex = migratedIndex >= 0 ? migratedIndex : 0;
  }
  parsed.version = 5;
  parsed.contractHistory = Array.isArray(parsed.contractHistory) ? parsed.contractHistory : [];
  parsed.agingHistory = Array.isArray(parsed.agingHistory) ? parsed.agingHistory : [];
  parsed.endorsements = Array.isArray(parsed.endorsements) ? parsed.endorsements : [];
  parsed.seenScenarioIds = Array.isArray(parsed.seenScenarioIds) ? parsed.seenScenarioIds : [];
  parsed.seasonScenarioIds = Array.isArray(parsed.seasonScenarioIds) ? parsed.seasonScenarioIds : [];
  parsed.storyFlags = Array.isArray(parsed.storyFlags) ? parsed.storyFlags : [];
  parsed.lifePaths = Object.fromEntries(Object.keys(LIFE_PATHS).map((key) => [key, Number(parsed.lifePaths?.[key]) || 0]));
  const savedPosition = POSITIONS[parsed.profile.position] || POSITIONS.PG;
  parsed.profile.height = Number(parsed.profile.height) || savedPosition.height;
  parsed.profile.weight = Number(parsed.profile.weight) || savedPosition.weight;
  parsed.profile.allocations = parsed.profile.allocations || emptyAllocations();
  parsed.profile.diceRoll = parsed.profile.diceRoll || { count: 0, faces: [], total: 0 };
  parsed.profile.careerMode = CAREER_MODES[parsed.profile.careerMode] ? parsed.profile.careerMode : 'classic';
  parsed.startingOvr = Number(parsed.startingOvr) || overall(parsed);
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
      benchRisk: item.benchRisk ?? (rosterLabel.includes('板凳') || rosterLabel.includes('邊緣') ? 62 : 28),
      chaptersCompleted: item.chaptersCompleted ?? (previousVersion <= 4 ? 3 : AGE_CHAPTERS.length),
      ageBranches: Array.isArray(item.ageBranches) ? item.ageBranches : [],
      lifeBranch: item.lifeBranch || '舊版生涯紀錄',
      lifePath: item.lifePath || { key: 'self', name: LIFE_PATHS.self.name, icon: LIFE_PATHS.self.icon, count: 0 }
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
  if (fullProfile.careerMode === 'underdog') {
    Object.keys(stats).forEach((key) => { stats[key] = clamp(stats[key] - 3, 35, 99); });
  }
  const contract = startingContract('tw_ms', 0);
  const rosterStatus = buildRosterStatus(TEAMS.tw_ms, { source: { stats, trust: 22, history: [], seasonIndex: 0 }, transfer: false, season: SEASONS[0] });
  return {
    version: 5,
    profile: fullProfile,
    stats,
    startingOvr: Math.round(Object.values(stats).reduce((sum, value) => sum + value, 0) / Object.keys(stats).length),
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
    endorsements: [],
    storyFlags: [],
    lifePaths: Object.fromEntries(Object.keys(LIFE_PATHS).map((key) => [key, 0])),
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
    seenScenarioIds: [],
    seasonScenarioIds: [],
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
    if (!parsed || ![1, 2, 3, 4, 5].includes(parsed.version) || !parsed.profile || !parsed.stats) return null;
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

function allocationSpent() {
  return Object.values(setupAllocations).reduce((sum, value) => sum + value, 0);
}

function allocationRemaining() {
  return Math.max(0, (setupDiceRoll?.total || 0) - allocationSpent());
}

function normalizeAllocationsToCaps() {
  Object.keys(setupAllocations).forEach((stat) => {
    setupAllocations[stat] = clamp(setupAllocations[stat], 0, allocationCap(stat));
  });
}

function renderBuildLab() {
  const position = POSITIONS[selectedPosition];
  const heightInput = $('#player-height');
  const weightInput = $('#player-weight');
  if (!position || !heightInput || !weightInput) return;

  heightInput.min = position.heightRange[0];
  heightInput.max = position.heightRange[1];
  heightInput.value = selectedHeight;
  weightInput.min = position.weightRange[0];
  weightInput.max = position.weightRange[1];
  weightInput.value = selectedWeight;
  $('#height-value').textContent = `${selectedHeight} cm`;
  $('#weight-value').textContent = `${selectedWeight} kg`;

  const physical = physicalModifiers({ position: selectedPosition, height: selectedHeight, weight: selectedWeight });
  const impact = Object.entries(physical.bonuses)
    .filter(([, value]) => Math.abs(value) >= .2)
    .map(([stat, value]) => `${STAT_META[stat].label} ${value > 0 ? '+' : ''}${value.toFixed(1)}`);
  const heightStyle = selectedHeight >= position.height + 6 ? '高大型' : selectedHeight <= position.height - 6 ? '低重心' : '標準身材';
  const weightStyle = selectedWeight >= position.weight + 10 ? '厚實' : selectedWeight <= position.weight - 10 ? '輕量' : '均衡';
  $('#body-archetype').textContent = `${heightStyle} · ${weightStyle} · ${position.name}`;
  $('#body-impact').textContent = impact.length ? `體型影響：${impact.join(' · ')}` : '標準體型：沒有額外能力加減。';

  normalizeAllocationsToCaps();

  const dice = $('#dice-result');
  const diceFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  if (setupDiceRoll) {
    dice.innerHTML = `<div>${setupDiceRoll.faces.map((face) => `<i aria-label="${face} 點">${diceFaces[face - 1]}</i>`).join('')}</div><b>總共 ${setupDiceRoll.total} 點 · 剩下 ${allocationRemaining()} 點</b><small>${setupDiceRoll.count} 顆骰子，每一點都由你自己分配。</small>`;
  } else {
    dice.innerHTML = '<b>尚未擲骰</b><small>隨機 1–6 顆骰子，每顆會出現 1–6 點。</small>';
  }
  $('#roll-dice-button').disabled = Boolean(setupDiceRoll);
  $('#roll-dice-button').textContent = setupDiceRoll ? '骰點已開出' : '擲骰開點';

  $('#attribute-builder').innerHTML = Object.entries(STAT_META).map(([stat, meta]) => {
    const value = setupAllocations[stat];
    const cap = allocationCap(stat);
    const canAdd = setupDiceRoll && allocationRemaining() > 0 && value < cap;
    return `<div class="attribute-pick"><span><i>${meta.code}</i><b>${meta.label}</b><small>上限 +${cap}</small></span><div><button type="button" data-allocate="${stat}" data-direction="-1" ${value <= 0 ? 'disabled' : ''}>−</button><strong>+${value}</strong><button type="button" data-allocate="${stat}" data-direction="1" ${canAdd ? '' : 'disabled'}>＋</button></div></div>`;
  }).join('');
  document.querySelectorAll('[data-allocate]').forEach((button) => button.addEventListener('click', () => {
    const stat = button.dataset.allocate;
    const direction = Number(button.dataset.direction);
    if (direction > 0 && (!setupDiceRoll || allocationRemaining() <= 0 || setupAllocations[stat] >= allocationCap(stat))) return;
    setupAllocations[stat] = clamp(setupAllocations[stat] + direction, 0, allocationCap(stat));
    renderBuildLab();
  }));

  const startButton = $('#setup-form .start-button');
  if (startButton) {
    const ready = Boolean(setupDiceRoll) && allocationRemaining() === 0;
    startButton.disabled = !ready;
    startButton.title = ready ? '建立球員檔案' : setupDiceRoll ? `還有 ${allocationRemaining()} 點尚未分配` : '請先擲骰';
  }
  renderSeedPreview();
}

function rollBuildDice() {
  const seedInput = $('#career-seed');
  const seed = normalizeSeedCode(seedInput.value) || generateSeedCode();
  seedInput.value = seed;
  setupDiceRoll = diceRollForSeed(seed);
  setupAllocations = emptyAllocations();
  renderBuildLab();
}

function renderCareerModeOptions() {
  const grid = $('#career-mode-grid');
  const preview = $('#career-mode-preview');
  if (!grid || !preview) return;
  grid.innerHTML = Object.entries(CAREER_MODES).map(([key, mode]) => `
    <button type="button" data-career-mode="${key}" class="${key === selectedCareerMode ? 'selected' : ''}" aria-pressed="${key === selectedCareerMode}">
      <i>${mode.icon}</i><span><b>${mode.name}</b><small>${mode.short}</small></span><em>${mode.code}</em>
    </button>`).join('');
  const selected = CAREER_MODES[selectedCareerMode];
  preview.innerHTML = `<b>${selected.name}</b><span>${selected.desc}</span><em>劇本任務：${selected.objective}</em>`;
  document.querySelectorAll('[data-career-mode]').forEach((button) => button.addEventListener('click', () => {
    selectedCareerMode = button.dataset.careerMode;
    renderCareerModeOptions();
  }));
}

function renderSetupOptions() {
  $('#position-grid').innerHTML = Object.entries(POSITIONS).map(([key, item]) => `
    <button type="button" data-position="${key}" class="${key === selectedPosition ? 'selected' : ''}">
      <small>${key}</small><b>${item.name}</b><span>${item.desc}</span>
    </button>`).join('');
  document.querySelectorAll('[data-position]').forEach((button) => button.addEventListener('click', () => {
    selectedPosition = button.dataset.position;
    selectedHeight = POSITIONS[selectedPosition].height;
    selectedWeight = POSITIONS[selectedPosition].weight;
    setupAllocations = emptyAllocations();
    renderSetupOptions();
  }));
  renderCareerModeOptions();
  renderBuildLab();
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
  const body = bodyAtAge(state.profile, season.age);
  const ageTrend = state.agingHistory?.find((item) => item.year === season.year);
  const badge = state.badges.length ? BADGES[state.badges[state.badges.length - 1]].label : '尚未形成打法';
  const lifePath = dominantLifePath();
  $('#player-panel').innerHTML = `
    <div class="eyebrow">PLAYER FILE / ${state.profile.seed || String(state.seasonIndex + 1).padStart(4, '0')}</div>
    <div class="player-card">
      <div class="jersey" style="--team:${team.color}">${POSITIONS[state.profile.position].number}</div>
      <div><h2>${escapeHtml(state.profile.name)}</h2><p>${COUNTRIES[team.country].name} · ${season.age} 歲 · ${state.profile.position}${squad ? ` · ${squad.label}` : ''}</p><small>${body.height} cm · ${body.weight} kg · ${badge}${roster ? ` · ${roster.label}` : ''}</small></div>
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
    <div class="identity-strip"><small>MYSTERY SEED · ${state.profile.seed}</small><b>${badge} · ${lifePath.icon} ${lifePath.name}</b></div>`;
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
  const modeProgress = careerModeProgress();
  const lifePath = dominantLifePath();
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
    <div class="career-mode-card ${modeProgress.complete ? 'complete' : ''}"><div><small>CAREER SCRIPT / ${modeProgress.mode.code}</small><b>${modeProgress.mode.icon} ${modeProgress.mode.name}</b><em>${modeProgress.label}</em></div><p>${modeProgress.detail}</p><i style="--mode-progress:${modeProgress.value}%"><span></span></i></div>
    <div class="storyline-card"><div><small>LIFE STORY · CHAPTER ${state.week + 1}/${AGE_CHAPTERS.length}</small><b>${lifePath.icon} ${lifePath.name}</b><em>${AGE_CHAPTERS[state.week] || '年度結算'}</em></div><p>${lifePath.count ? `你已做出 ${lifePath.count} 次「${lifePath.name}」路線選擇。` : '第一條人生支線，現在由你自己選。'}</p></div>
    <div class="goal-card"><small>SEASON TARGET</small><b>${season.target}</b><p>${team.name} · ${season.name}</p></div>
    <div class="career-feed"><small>CAREER LOG</small>${state.history.slice(-3).reverse().map((item) => `<p><b>${item.year}</b><span>${COUNTRIES[item.country].flag} ${item.team}</span><em>${item.record}</em></p>`).join('') || '<p class="empty">第一筆紀錄會在賽季結束後出現。</p>'}</div>`;
}

function careerAction(code, title, desc, primary, secondary, tag, difficultyOffset, growth, deltas, success, failure, extras = {}) {
  return { code, title, desc, primary, secondary, tag, difficulty: currentTeam().difficulty + difficultyOffset, growth, deltas, success, failure, ...extras };
}

function freeChoiceAction(code, title, desc, primary, secondary, tag, growth, deltas, outcome, extras = {}) {
  return careerAction(code, title, desc, primary, secondary, tag, -18, growth, deltas, outcome, outcome, {
    guaranteed: true,
    countsForSeason: false,
    ...extras
  });
}

function buildAnnualPlanEvent() {
  const season = currentSeason();
  const team = currentTeam();
  const weak = weakestStat();
  const strong = strongestStat();
  const trainerCost = season.age < 19 ? 0 : season.age < 23 ? -2 : -6;
  return {
    kicker: `CHAPTER 01 · AGE ${season.age} / YOUR PLAN`,
    title: `${season.age} 歲年度行程表`,
    story: `${team.name} 的新年度開始了。第一個空白時段沒有教練替你安排，也沒有活動突然把你抓走；這段時間完全由你決定。`,
    quote: '練球、休息、找專家或陪家人，都會把生涯帶往不一樣的方向。',
    value: '01', valueLabel: 'CHAPTER', tint: '#d9ed83',
    prompt: '今年第一段自由時間，你想怎麼用？', hint: '這裡沒有標準答案；恢復與生活也是生涯的一部分。',
    actions: [
      freeChoiceAction('A', '自主訓練', `自己排課表，先補目前最弱的「${STAT_META[weak].label}」。`, weak, 'iq', statTag(weak), 1.45, { load: 8, rhythm: 5 }, `你關掉通知，把「${STAT_META[weak].label}」拆成小動作慢慢練，離開球館時順多了。`, { lifePath: 'self', branchLabel: '自己排自主訓練' }),
      freeChoiceAction('B', '完整休息', '睡飽、拉筋、好好吃飯，今天不碰高強度訓練。', 'athletic', 'iq', 'iron', 0, { load: -24, rhythm: 6 }, '你真的讓身體停下來。隔天沒有罪惡感，只有久違的輕鬆。', { lifePath: 'family', branchLabel: '替身體保留完整休息' }),
      freeChoiceAction('C', '找私人訓練師', `花${trainerCost ? `${Math.abs(trainerCost)} 萬` : '校隊資源'}做一對一檢查，修正最有效率的細節。`, strong, weak, statTag(strong), 1.7, { income: trainerCost, load: 5, scout: 2 }, '訓練師沒有塞給你一百個動作，只留下三個真的能每天做到的修正。', { lifePath: 'mentor', branchLabel: '請訓練師客製課表' }),
      freeChoiceAction('D', '看片做戰術筆記', '研究自己的失誤和下一個對手，讓腦袋先跑一次比賽。', 'iq', 'playmaking', 'connector', 1.25, { load: -5, rhythm: 3, trust: 3 }, '你剪出幾段最常出錯的畫面，也寫下下一次要提早看到的訊號。', { lifePath: 'study', branchLabel: '用影片和筆記準備球季' }),
      freeChoiceAction('E', '陪家人／處理生活', '把課業、帳單、家人和一直拖著的事先顧好。', 'iq', 'playmaking', 'connector', .25, { load: -14, trust: 5, rhythm: 3 }, '球技沒有突然暴增，但生活安定下來後，你進球館時更能專心。', { lifePath: 'family', branchLabel: '先把家人與生活顧好' })
    ]
  };
}

function buildAgeStoryEvent() {
  const season = currentSeason();
  const story = AGE_STORIES[season.age];
  const previous = [...(state.storyFlags || [])].reverse().find((item) => item.chapter === 1 && item.age < season.age);
  const echo = previous ? ` 去年你選了「${previous.label}」，那個決定也讓你更知道自己在乎什麼。` : '';
  return {
    kicker: `CHAPTER 02 · LIFE STORY / AGE ${season.age}`,
    title: story.title,
    story: `${story.scene}${echo}`,
    quote: '場外怎麼生活，也會決定你最後成為哪種球員。',
    value: '02', valueLabel: 'CHAPTER', tint: '#93b9c9',
    prompt: story.prompt, hint: '四條支線都能繼續生涯，但之後的人生主線會記得你的選擇。',
    actions: story.choices.map((choice, index) => freeChoiceAction(
      String.fromCharCode(65 + index), choice.title, choice.desc, choice.primary, choice.secondary, choice.tag,
      choice.growth ?? .7, choice.deltas || {}, choice.outcome,
      { lifePath: choice.path, branchLabel: choice.title, branchOutcome: choice.outcome }
    ))
  };
}

function buildOpportunityEvent() {
  const season = currentSeason();
  const team = currentTeam();
  const weak = weakestStat();
  const strong = strongestStat();
  const campName = season.age <= 15 ? '地區菁英體驗營' : season.age <= 18 ? '職業球員夏令營' : season.age <= 22 ? '職業隊聯合測試' : '國際休賽季邀請營';
  const trainerCost = season.age < 19 ? 0 : season.age < 23 ? -3 : -8;
  return {
    kicker: `CHAPTER 04 · INVITATION / AGE ${season.age}`,
    title: `${campName}的邀請`,
    story: `${team.name} 收到一封「${campName}」邀請，週末有一天名額。這只是詢問，你還沒答應，也不會被自動報名。`,
    quote: '有邀請不代表一定要去；知道自己現在需要什麼，也是職業的一部分。',
    value: '04', valueLabel: 'CHAPTER', tint: '#f0b45a',
    prompt: '這次邀請，你要怎麼安排？', hint: '參加能增加曝光但會累；婉拒後，你仍可休息、自練或另找訓練師。',
    actions: [
      careerAction('A', `接受，參加${campName}`, '親自到場和陌生高手對練，結果仍要看臨場表現。', strong, 'athletic', statTag(strong), 2, 1.4, { scout: 8, reputation: 4, load: 12 }, `你確實參加了${campName}，對抗也打得很亮眼，球探把你的名字畫了兩次。`, `你確實參加了${campName}，只是這天手感普通。至少你看清楚下一層強度差在哪。`, { lifePath: 'brand', branchLabel: `接受${campName}邀請`, countsForSeason: true }),
      freeChoiceAction('B', '婉拒，完整休息', '禮貌回覆主辦方，把這一天完整留給身體恢復。', 'athletic', 'iq', 'iron', 0, { load: -24, rhythm: 6 }, '你婉拒了邀請，也沒有偷偷加練。睡醒後，身體終於不再一直發緊。', { lifePath: 'self', branchLabel: `婉拒${campName}並休息` }),
      freeChoiceAction('C', '婉拒，改成自主訓練', `不去活動，留在熟悉球館補「${STAT_META[weak].label}」。`, weak, 'iq', statTag(weak), 1.45, { load: 8, rhythm: 5 }, `你婉拒了邀請，把一整天花在「${STAT_META[weak].label}」上；沒有鏡頭，但進步很實在。`, { lifePath: 'self', branchLabel: `婉拒${campName}並自主訓練` }),
      freeChoiceAction('D', '婉拒，約私人訓練師', `不跑大型活動，花${trainerCost ? `${Math.abs(trainerCost)} 萬` : '校隊資源'}做更貼近自己的課表。`, strong, weak, statTag(strong), 1.7, { income: trainerCost, load: 5, scout: 2 }, '你婉拒大型活動，訓練師則用數據抓出一個以前沒注意到的動作問題。', { lifePath: 'mentor', branchLabel: `婉拒${campName}並找訓練師` }),
      freeChoiceAction('E', '婉拒，陪家人／顧課業', '把週末留給家人、朋友、作業或生活中的重要事。', 'iq', 'playmaking', 'connector', .25, { load: -15, trust: 5, rhythm: 3 }, '你婉拒了邀請，也把一直欠著的陪伴和生活小事補回來。', { lifePath: 'family', branchLabel: `婉拒${campName}並處理生活` })
    ]
  };
}

function scenarioPoolForWeek(week = state.week) {
  if (week === AGE_CHAPTERS.length - 1) return CLUTCH_SCENARIOS;
  const context = { season: currentSeason(), team: currentTeam(), country: COUNTRIES[currentTeam().country] };
  return CAREER_SCENARIOS.filter((scenario) => scenario.phase === 'team' && (!scenario.eligible || scenario.eligible(context)));
}

function selectWeeklyScenario() {
  const pool = scenarioPoolForWeek();
  const savedId = state.seasonScenarioIds?.[state.week];
  const savedScenario = pool.find((scenario) => scenario.id === savedId);
  if (savedScenario) return savedScenario;

  const seasonIds = state.seasonScenarioIds || (state.seasonScenarioIds = []);
  const seenIds = state.seenScenarioIds || (state.seenScenarioIds = []);
  const unused = pool.filter((scenario) => !seenIds.includes(scenario.id));
  const candidates = unused.length ? unused : pool.filter((scenario) => !seasonIds.includes(scenario.id));
  const drawPool = candidates.length ? candidates : pool;
  const season = currentSeason();
  const index = hashSeed(`${state.profile.seed}|${season.year}|${currentTeam().id}|${state.week}|WEEKLY-${seenIds.length}`) % drawPool.length;
  const selected = drawPool[index];
  seasonIds[state.week] = selected.id;
  if (!seenIds.includes(selected.id)) seenIds.push(selected.id);
  saveGame();
  return selected;
}

function buildEvent() {
  const season = currentSeason();
  const team = currentTeam();
  const country = COUNTRIES[team.country];
  if (state.week === 0) return buildAnnualPlanEvent();
  if (state.week === 1) return buildAgeStoryEvent();
  if (state.week === 3) return buildOpportunityEvent();
  const scenario = selectWeeklyScenario();
  if (state.week === 2) {
    const context = { season, team, country };
    return {
      kicker: `CHAPTER 03 · ${country.flag} / TEAM LIFE`,
      title: typeof scenario.title === 'function' ? scenario.title(context) : scenario.title,
      story: typeof scenario.story === 'function' ? scenario.story(context) : scenario.story,
      quote: scenario.quote, value: '03', valueLabel: 'CHAPTER', tint: scenario.tint || team.color,
      prompt: scenario.prompt, hint: scenario.hint, scenarioId: scenario.id, actions: scenario.actions(context)
    };
  }
  const opponent = country.opponent[(state.seasonIndex + state.profile.name.length + team.name.length) % country.opponent.length];
  return {
    kicker: `CHAPTER 05 · ${team.league.toUpperCase()}`, title: `${season.name} · ${scenario.title}`, story: scenario.story(opponent), quote: scenario.quote,
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
  $('#scoreboard').innerHTML = `<span>${event.valueLabel}</span><b>${event.value}</b><small>${event.game ? event.score : `CHAPTER ${state.week + 1} / ${AGE_CHAPTERS.length}`}</small>`;
  if (state.mode === 'summary') renderSummary();
  else if (state.pendingResult) renderResult();
  else renderDecisions(event);
}

function renderDecisions(event) {
  $('#decision-zone').innerHTML = `
    <div class="decision-head"><div><small>${event.game ? 'CLUTCH DECISION' : 'LIFE DECISION'} · CHAPTER ${state.week + 1}/${AGE_CHAPTERS.length}</small><h2>${event.prompt || '這一章要怎麼選？'}</h2></div><p>${event.hint || '看能力、手感、隊友信任和疲勞，再做選擇。'}</p></div>
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
  const labels = { rhythm: '節奏', trust: '信任', load: '負荷', scout: '球探', reputation: '聲望', income: '收入' };
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
  const storyMode = source.profile?.careerMode === 'underdog'
    ? clamp(Math.max(0, (source.losses || 0) - (source.wins || 0)) * .75 + (source.rhythm < 45 ? 1 : 0), 0, 4)
    : 0;
  const difficulty = clamp(action.difficulty, 36, 96);
  const baseTotal = skill + rhythm + trust + load + identity + seedSpecialty + mastery + storyMode;
  return { primary, secondary, skill, rhythm, trust, load, identity, seedSpecialty, mastery, storyMode, baseTotal, difficulty };
}

function pulseCalculation(action) {
  const base = pulseBase(action);
  const variation = randomBetween(-5.5, 5.5);
  const total = base.baseTotal + variation;
  return { ...base, variation, total, margin: total - base.difficulty };
}

function estimateActionChance(action, source = state) {
  const base = pulseBase(action, source);
  if (action.guaranteed) return { chance: 100, tier: statTier(base.primary) };
  const chance = Math.round(clamp(((base.baseTotal - base.difficulty + 5.5) / 11) * 100, 5, 95));
  return { chance, tier: statTier(base.primary) };
}

function chanceLabel(chance) {
  if (chance >= 100) return '自由安排';
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
  const base = pulseBase(action);
  const calc = action.guaranteed
    ? { ...base, variation: 0, total: base.difficulty + 1, margin: 1 }
    : pulseCalculation(action);
  const success = action.guaranteed || calc.margin >= 0;
  applyDeltas(action.deltas);
  recordStoryBranch(action);
  if (action.endorsement) {
    state.endorsements = state.endorsements || [];
    state.endorsements.push({
      year: currentSeason().year,
      brand: action.endorsement.brand,
      type: action.endorsement.type,
      income: action.deltas?.income || 0,
      exposure: (action.deltas?.scout || 0) + (action.deltas?.reputation || 0)
    });
  }
  const specialtyGrowth = state.profile.seedSpecialties?.includes(action.primary) ? 1.08 : 1;
  const growth = action.growth * 1.35 * (state.profile.growthModifier || 1) * specialtyGrowth * careerModeGrowthMultiplier(success) * (success ? 1 : .7);
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
  if (action.countsForSeason !== false) {
    state.seasonMargins.push(calc.margin);
    if (success) state.seasonSuccesses += 1;
  }
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
        <small>${action.guaranteed ? 'CHOICE SAVED' : result.success ? 'READ COMPLETE' : 'READ BROKEN'}${action.guaranteed ? '' : ` · ${margin >= 0 ? '+' : ''}${margin.toFixed(1)}`}</small>
        <h2>${action.guaranteed ? '你的安排已記錄。' : result.game ? (result.success ? '關鍵攻防拿下了！' : '這波沒能守住。') : (result.success ? '這次執行成功。' : '結果不理想，但路還能繼續。')}</h2>
        <p>${result.success ? action.success : action.failure}</p>
        ${action.guaranteed ? `<div class="formula-strip choice-impact"><span>這章的影響 <b>${formatDeltas(action.deltas) || '人生支線更新'}</b></span><span>結果 <b>由你決定</b></span></div>` : `<div class="formula-strip"><span>技術 <b>${result.calc.skill.toFixed(1)}</b></span><span>節奏 <b>${signed(result.calc.rhythm)}</b></span><span>信任 <b>${signed(result.calc.trust)}</b></span><span>負荷 <b>${signed(result.calc.load)}</b></span><span>打法 <b>+${result.calc.identity}</b></span>${result.calc.storyMode ? `<span>逆風脈衝 <b>+${result.calc.storyMode.toFixed(1)}</b></span>` : ''}${result.calc.mastery ? `<span>能力階級 <b>+${result.calc.mastery}</b></span>` : ''}${result.calc.seedSpecialty ? '<span>神秘種子 <b>?</b></span>' : ''}<span>臨場 <b>${signed(result.calc.variation)}</b></span></div>`}
        ${result.growth && action.growth > 0 ? `<div class="growth-feedback"><small>這次真的變強了</small><div><span><b>${STAT_META[action.primary].label}</b><em>${result.growth.primaryBefore.toFixed(1)} → ${result.growth.primaryAfter.toFixed(1)}</em></span>${action.secondary !== action.primary ? `<span><b>${STAT_META[action.secondary].label}</b><em>${result.growth.secondaryBefore.toFixed(1)} → ${result.growth.secondaryAfter.toFixed(1)}</em></span>` : ''}<span><b>同類選擇</b><em>${result.growth.chanceBefore}% → ${result.growth.chanceAfter}%</em></span></div></div>` : '<div class="rest-feedback">這次選擇的重點是恢復與生活，不會硬塞能力成長。</div>'}
        ${action.lifePath ? `<div class="story-branch-unlock">人生支線：<b>${LIFE_PATHS[action.lifePath].icon} ${LIFE_PATHS[action.lifePath].name}</b> · ${action.branchLabel || action.title}</div>` : ''}
        ${result.growth?.tierUp ? `<div class="mastery-unlock">能力突破：<b>${STAT_META[result.growth.tierUp.stat].label} · ${result.growth.tierUp.label}</b>，之後同類選擇永久 +${result.growth.tierUp.bonus}</div>` : ''}
        ${result.badges.length ? `<div class="badge-unlock">打法印記解鎖：<b>${result.badges.join('、')}</b></div>` : ''}
        <button type="button" class="next-button" id="next-button"><span>${state.week === AGE_CHAPTERS.length - 1 ? `結算 ${currentSeason().age} 歲球季` : `進入下一章：${AGE_CHAPTERS[state.week + 1]}`}</span><b aria-hidden="true">→</b></button>
      </div>
    </div>`;
  $('#next-button').addEventListener('click', advanceAfterResult);
}

function signed(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}`;
}

function advanceAfterResult() {
  state.pendingResult = null;
  if (state.week < AGE_CHAPTERS.length - 1) {
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
  const ageBranches = (state.storyFlags || []).filter((item) => item.age === season.age);
  const lifePath = dominantLifePath();
  const summary = {
    year: season.year, age: season.age, stage: season.stage, teamId: team.id, country: team.country, team: team.name, league: team.league,
    squad: team.squad || null, squadLabel: teamSquadProfile(team)?.label || '',
    record: `${wins}–${losses}`, wins, losses, ppg, rpg, apg, champion, ovr: playerOvr, averageMargin,
    gamesPlayed: roster.gamesPlayed, minutes: roster.minutes, rosterLabel: roster.label, rosterStartedAs: roster.startedAs, rosterMovement: roster.movement, benchRisk: roster.benchRisk,
    progress: `${state.seasonIndex + 1} / ${SEASONS.length}`, leagueDifficulty: team.difficulty, leagueStrength: leagueStrengthLabel(team.difficulty),
    playerStrength: playerStrengthProfile(playerOvr).label, role: roleAgainstLeague(playerOvr, team.difficulty), marketScore: marketScore(),
    earned, totalIncome: state.income, contract: { ...state.contract }, contractRisk: contractOutcome.risk,
    contractResult: contractOutcome.result, contractContinues: contractOutcome.continues, released: contractOutcome.released, eliminated: contractOutcome.eliminated,
    chaptersCompleted: AGE_CHAPTERS.length, ageBranches, lifeBranch: ageBranches.find((item) => item.chapter === 1)?.label || ageBranches.at(-1)?.label || '自由規劃',
    lifePath: { key: lifePath.key, name: lifePath.name, icon: lifePath.icon, count: lifePath.count }
  };
  state.history.push(summary);
  summary.modeQuest = careerModeProgress();
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
          <span><small>年度章節</small><b>${summary.chaptersCompleted} / ${AGE_CHAPTERS.length} 完成</b></span><span><small>年度人生支線</small><b>${summary.lifeBranch}</b></span><span><small>目前人生主線</small><b>${summary.lifePath?.icon || ''} ${summary.lifePath?.name || dominantLifePath().name}</b></span>
          <span class="mode-report ${summary.modeQuest?.complete ? 'complete' : ''}"><small>${summary.modeQuest?.mode.name || activeCareerMode().name} · 劇本任務</small><b>${summary.modeQuest?.label || careerModeProgress().label}</b></span>
        </div>
        <p>${seasonSummaryLine(summary)}</p>
        <button type="button" class="next-button" id="market-button"><span>${nextAction}</span><b aria-hidden="true">→</b></button>
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
  if (summary.averageMargin > 3) return `你完成了 5 個年度章節，球隊事件與關鍵戰大多執行成功；「${summary.lifeBranch}」也成為今年最重要的人生支線。`;
  if (summary.averageMargin > -4) return '表現沒有大爆發，但失誤與疲勞都在可控範圍。你仍在輪替競爭內，也有機會換到更適合的環境。';
  return '本季在高強度比賽中吃了不少虧。能力沒有消失，但下一季要先處理最弱的一項技術與疲勞問題。';
}

function marketScore() {
  const key = state.profile.careerMode || 'classic';
  const modeBonus = key === 'odyssey'
    ? Math.max(0, state.visited.length - 1) * 1.8
    : key === 'dynasty'
      ? longestProTeamStay() * 1.1
      : key === 'underdog'
        ? Math.max(0, overall() - (state.startingOvr || overall())) * .12
        : 0;
  return overall() + state.scout * .14 + state.reputation * .06 + state.trophies * 1.5 + modeBonus;
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
  const odysseyAdjustment = state.profile.careerMode === 'odyssey' && team.country !== currentTeam().country ? 2 : 0;
  return Math.max(0, base - localAdjustment - secondTeamAdjustment - odysseyAdjustment);
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
  $('#offer-lead').textContent = proMarket
    ? `市場評級 ${score.toFixed(1)}。第一次進入某國職業環境，只能先選當地二軍／次級；完成一季後才解鎖該國一軍。就算升上一軍，第一季也會從板凳觀察開始。${aging ? `進入 ${aging.age} 歲球季，能力從 ${aging.before} 降到 ${aging.after} OVR；新合約的月薪與簽約金已套用約 ${Math.round(aging.salaryPenalty * 100)}% 的下滑影響。` : ''}`
    : `下一章是 ${nextSeason.age} 歲。現在比較學校、養成環境與上場機會；完成選擇後，會直接開始這個年齡的 5 個故事章節。`;
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
    const levelLabel = squad?.label || ({ middle: '國中校隊', high: '高中／青年隊', development: '大專／養成隊' }[team.level] || '球隊');
    const levelBasis = squad?.basis || ({ middle: '學生籃球', high: '菁英學生籃球', development: '大專與養成層級' }[team.level] || '球隊層級');
    const contract = contractForOffer(team, nextSeason, score);
    const predictedRoster = buildRosterStatus(team, { source: state, transfer: true, previousTeamId: currentTeam().id, season: nextSeason });
    const squadNote = !squad ? `選定後開始 ${nextSeason.age} 歲的 5 個章節` : squad.key === 'second' ? '完成當地二軍一季，才會開放該國一軍' : '簽進一軍先從板凳觀察，不會直接變先發';
    return `<button type="button" data-offer="${team.id}" class="${eligible ? '' : 'locked'}" ${eligible ? '' : 'disabled'} style="--offer:${team.color}">
      <div><i>${country.flag}</i><span>${country.name} · ${levelLabel}</span><em>${eligible ? contract.type : eligibility.short}</em></div>
      <h3>${team.name}</h3><p>${team.league} · ${levelBasis}</p>
      <dl><div><dt>球隊層級</dt><dd>${levelLabel}</dd></div>${squad ? `<div><dt>當地職業資歷</dt><dd>${eligibility.path?.seasons || 0} 季</dd></div>` : ''}<div><dt>預計隊內角色</dt><dd>${predictedRoster.label}</dd></div><div><dt>預估場均時間</dt><dd>${predictedRoster.minutes} 分鐘</dd></div><div><dt>聯賽強度</dt><dd>${leagueStrengthLabel(team.difficulty)} · ${team.difficulty}</dd></div><div><dt>合約長度</dt><dd>${contract.yearsTotal} 年</dd></div><div><dt>年薪／月薪</dt><dd>${moneyLabel(contract.annualSalary, '學生')}／${moneyLabel(contract.monthlySalary, '—')}</dd></div><div><dt>簽約金</dt><dd>${moneyLabel(contract.signingBonus)}</dd></div><div><dt>簽約時能力</dt><dd>${contract.abilityAtSigning} OVR</dd></div><div><dt>能力走勢</dt><dd>${contract.abilityTrend < 0 ? `${contract.abilityTrend} · 薪資 -${contract.salaryTrendPenalty}%` : '持平'}</dd></div><div><dt>薪資保障</dt><dd>${contract.guaranteedRate}%</dd></div><div><dt>預估淘汰風險</dt><dd>${contract.cutRisk}%</dd></div></dl>
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
  state.seasonScenarioIds = [];
  state.rosterStatus = rosterStatus;
  state.rhythm = clamp(48 + (state.rhythm - 50) * .35);
  const modeKey = state.profile.careerMode || 'classic';
  if (transfer) {
    state.trust = team.country === previousCountry
      ? clamp(state.trust * .7)
      : modeKey === 'odyssey' ? 28 : 20;
  } else {
    state.trust = modeKey === 'dynasty' ? clamp(state.trust * .92 + 8) : clamp(state.trust * .82 + 6);
  }
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
  const modeQuest = careerModeProgress();
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
    { unlocked: state.endorsements?.length >= 1, title: '第一份代言', desc: `已完成 ${state.endorsements?.length || 0} 次品牌合作` },
    { unlocked: state.income >= 500, title: '五百萬俱樂部', desc: `生涯收入累積 ${Math.round(state.income)} 萬` },
    { unlocked: hall.inducted, title: '名人堂成員', desc: '生涯履歷正式通過名人堂門檻' },
    { unlocked: modeQuest.complete, title: `${modeQuest.mode.name}通關`, desc: modeQuest.mode.objective }
  ];
  return achievements.filter((item) => item.unlocked);
}

function renderCard() {
  const team = currentTeam();
  const season = currentSeason();
  const body = bodyAtAge(state.profile, season.age);
  const route = careerRouteEntries();
  const hall = hallOfFameProfile();
  const achievements = careerAchievements(hall);
  const contractHistory = state.contractHistory || [];
  const endorsements = state.endorsements || [];
  const modeQuest = careerModeProgress();
  const lifePath = dominantLifePath();
  const storylineEntries = (state.storyFlags || []).filter((item) => item.chapter === 1);
  const seedIdentity = `<span><b>神秘種子</b><em>${state.profile.seed} · 隱藏能力會在生涯中慢慢展現</em></span>`;
  const modeIdentity = `<span><b>${modeQuest.mode.icon} ${modeQuest.mode.name} · ${modeQuest.label}</b><em>${modeQuest.detail}</em></span>`;
  const lifeIdentity = `<span><b>${lifePath.icon} 人生主線：${lifePath.name}</b><em>${lifePath.desc} · 累積 ${lifePath.count} 次相關選擇</em></span>`;
  const playIdentity = state.badges.map((badge) => `<span><b>${BADGES[badge].label}</b><em>${BADGES[badge].desc}</em></span>`).join('') || '<span><b>打法尚未成形</b><em>持續做選擇，三次後會形成你的打法印記。</em></span>';
  $('#card-content').innerHTML = `
    <div class="card-kicker"><span>COURTBOUND / ${state.profile.seed || 'PLAYER DOSSIER'}</span><b>${overall()}</b></div>
    <div class="big-player-name"><small>${state.profile.position} · ${POSITIONS[state.profile.position].name}</small><h2>${escapeHtml(state.profile.name)}</h2><p>${state.profile.hometown}出身 · ${state.profile.hand} · ${season.age} 歲 · ${body.height} cm / ${body.weight} kg · 預估成年 ${body.adultHeight} cm / ${body.adultWeight} kg · ${team.name}</p></div>
    <div class="card-stat-grid">${Object.entries(STAT_META).map(([key, meta]) => `<div><small>${meta.code}</small><b>${Math.round(state.stats[key])}</b><span>${meta.label}</span></div>`).join('')}</div>
    <section class="hall-card ${hall.inducted ? 'inducted' : ''}">
      <div><small>HALL OF FAME WATCH</small><h3>${hall.label}</h3><p>${hall.note}</p></div>
      <strong>${Math.round(hall.score)}<small>/ 125</small></strong>
      <i style="--hof:${hall.progress}%"><b></b></i>
    </section>
    <div class="card-columns">
      <section><small>MYSTERY SEED & CAREER SCRIPT</small><div class="badge-list">${seedIdentity}${modeIdentity}${lifeIdentity}${playIdentity}</div></section>
      <section><small>CAREER NUMBERS</small><dl><div><dt>球季</dt><dd>${state.history.length}</dd></div><div><dt>故事支線</dt><dd>${storylineEntries.length}</dd></div><div><dt>國家</dt><dd>${state.visited.length}</dd></div><div><dt>冠軍</dt><dd>${state.trophies}</dd></div><div><dt>關鍵勝負</dt><dd>${state.wins}–${state.losses}</dd></div><div><dt>生涯得分</dt><dd>${state.careerPoints || 0}</dd></div><div><dt>生涯收入</dt><dd>${Math.round(state.income)} 萬</dd></div></dl></section>
    </div>
    <div class="career-card-details">
      <section><small>SCHOOLS & TEAMS / 生涯學校與球隊</small><div class="career-path-list">${route.map((item) => `<div class="${item.current ? 'current' : ''}"><i>${item.year}</i><b>${COUNTRIES[item.country]?.flag || item.country}</b><span><strong>${escapeHtml(item.team)}</strong><small>${item.stage}${item.squadLabel ? ` · ${item.squadLabel}` : ''}${item.rosterLabel ? ` · ${item.rosterLabel}` : ''}${item.minutes != null ? ` ${item.minutes} MPG` : ''} · ${item.record}${item.champion ? ' · 冠軍' : ''}</small></span></div>`).join('')}</div></section>
      <section><small>ACHIEVEMENTS / 生涯成就</small><div class="achievement-grid">${achievements.map((item, index) => `<div><i>${String(index + 1).padStart(2, '0')}</i><span><b>${item.title}</b><small>${item.desc}</small></span></div>`).join('')}</div></section>
      <section><small>LIFE STORY / 逐歲人生支線</small><div class="storyline-ledger">${storylineEntries.length ? storylineEntries.map((item) => `<div><i>${item.age}<small>歲</small></i><span><b>${LIFE_PATHS[item.path]?.icon || '·'} ${escapeHtml(item.label)}</b><small>${escapeHtml(item.outcome || LIFE_PATHS[item.path]?.name || '')}</small></span></div>`).join('') : '<p>完成「人生支線」章節後，這裡會留下每個年齡的故事選擇。</p>'}</div></section>
      <section class="contract-ledger"><small>CONTRACTS / 生涯合約</small><div>${contractHistory.map((contract) => { const contractTeam = TEAMS[contract.teamId] || TEAMS.tw_ms; const squadLabel = contract.squadLabel || teamSquadProfile(contractTeam)?.label || ''; const trend = contract.salaryTrendPenalty ? ` · 能力下滑影響 -${contract.salaryTrendPenalty}%` : ''; return `<span><i>${contract.signedYear}</i><b>${escapeHtml(contractTeam.name)}</b><em>${contract.type}${squadLabel ? ` · ${squadLabel}` : ''} · ${contract.yearsTotal} 年 · 年薪 ${moneyLabel(contract.annualSalary, '學生')} · 月薪 ${moneyLabel(contract.monthlySalary, '—')} · 簽約金 ${moneyLabel(contract.signingBonus)}${trend}</em></span>`; }).join('')}</div></section>
      ${endorsements.length ? `<section class="contract-ledger endorsement-ledger"><small>ENDORSEMENTS / 品牌合作</small><div>${endorsements.map((deal) => `<span><i>${deal.year}</i><b>${escapeHtml(deal.brand)}</b><em>${escapeHtml(deal.type)} · 收入 ${moneyLabel(deal.income)} · 曝光 +${deal.exposure || 0}</em></span>`).join('')}</div></section>` : ''}
    </div>
    <div class="card-share-bar"><span><small>SHARE RECAP / 1080 × 1920</small><b>生成詳細生涯結算圖</b><em>能力曲線、球隊旅程、合約收入、成就與名人堂一次整理。</em></span><button type="button" id="download-share-card">下載 PNG</button></div>`;
  $('#card-dialog').showModal();
  $('#download-share-card').addEventListener('click', downloadCareerCard);
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
  const modeQuest = careerModeProgress();
  const lifePath = dominantLifePath();
  const first = state.history[0];
  const last = state.history.at(-1);
  const wasEliminated = state.careerStatus === 'eliminated';
  const endingYear = last?.year || currentSeason().year;
  const routeCopy = first && last ? `${escapeHtml(state.profile.name)} 從 ${escapeHtml(first.team)} 開始打球，最後來到 ${escapeHtml(last.team)}。` : `${escapeHtml(state.profile.name)} 完成了這段籃球旅程。`;
  $('#ending-content').innerHTML = `
    <div class="ending-grade"><small>CAREER GRADE</small><b>${ending.grade}</b><span>${Math.round(ending.score)} LEGACY</span></div>
    <div class="ending-copy"><small>${endingYear} · ${wasEliminated ? 'CAREER CUT' : 'CAREER COMPLETE'}</small><h2>${wasEliminated ? '這次沒守住名單，但你的紀錄都還在。' : ending.title}</h2><p>${routeCopy}你去過 ${state.visited.length} 個國家、拿到 ${state.trophies} 座冠軍。${wasEliminated ? '職業世界很硬，短約和表現真的會決定能不能留下。' : '每一站、每一個選擇，都是你自己決定的。'}人生主線是「${lifePath.name}」；劇本「${modeQuest.mode.name}」進度 ${modeQuest.label}；名人堂評選：${hall.label}。</p></div>
    <div class="ending-numbers"><span><b>${overall()}</b> 最終 OVR</span><span><b>${Math.max(overall(), ...state.history.map((item) => item.ovr || 0))}</b> 巔峰 OVR</span><span><b>${state.wins}–${state.losses}</b> 關鍵回合</span><span><b>${state.trophies}</b> 冠軍</span><span><b>${state.history.length}</b> 球季</span><span><b>${state.visited.length}</b> 國家</span><span><b>${Math.round(state.income)}</b> 收入（萬）</span><span><b>${Math.round(hall.score)}</b> 名人堂分數</span></div>
    <div class="ending-route">${state.history.map((item) => `<div><i>${item.year}</i><b>${COUNTRIES[item.country].flag}</b><span>${item.team}<small>${item.record} · ${item.rosterLabel || item.role} · ${item.minutes ?? '—'} MPG · ${item.ppg} PTS</small></span></div>`).join('')}</div>
    <div class="ending-actions"><button type="button" id="download-card">下載詳細結算圖</button><button type="button" id="restart-ending">再走一條路</button></div>`;
  $('#ending-dialog').showModal();
  $('#download-card').addEventListener('click', downloadCareerCard);
  $('#restart-ending').addEventListener('click', restartGame);
}

function sharePanel(ctx, x, y, width, height, fill = '#171d18', stroke = '#334036') {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
}

function shareFitText(ctx, value, x, y, maxWidth) {
  const text = String(value);
  if (ctx.measureText(text).width <= maxWidth) {
    ctx.fillText(text, x, y);
    return;
  }
  let clipped = text;
  while (clipped.length > 1 && ctx.measureText(`${clipped}…`).width > maxWidth) clipped = clipped.slice(0, -1);
  ctx.fillText(`${clipped}…`, x, y);
}

function downloadCareerCard() {
  const canvas = $('#share-canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  const fontFamily = `'Noto Sans TC','Microsoft JhengHei',sans-serif`;
  const ending = endingProfile();
  const hall = hallOfFameProfile();
  const modeQuest = careerModeProgress();
  const lifePath = dominantLifePath();
  const achievements = careerAchievements(hall);
  const currentOvr = overall();
  const peakOvr = Math.max(currentOvr, state.startingOvr || currentOvr, ...state.history.map((item) => item.ovr || 0));
  const highestSalary = Math.max(0, ...(state.contractHistory || []).map((contract) => contract.annualSalary || 0));
  const totalSigningBonus = (state.contractHistory || []).reduce((sum, contract) => sum + (contract.signingBonus || 0), 0);
  const longestContract = Math.max(0, ...(state.contractHistory || []).map((contract) => contract.yearsTotal || 0));
  const last = state.history.at(-1);
  const body = bodyAtAge(state.profile, currentSeason().age);

  const background = ctx.createLinearGradient(0, 0, 1080, 1920);
  background.addColorStop(0, '#202b22');
  background.addColorStop(.5, '#101510');
  background.addColorStop(1, '#171713');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 1080, 1920);
  ctx.fillStyle = '#d9ed83';
  ctx.fillRect(48, 42, 984, 12);
  ctx.fillStyle = '#ff7654';
  ctx.fillRect(48, 54, 235, 6);

  ctx.fillStyle = '#d9ed83';
  ctx.font = `800 27px ${fontFamily}`;
  ctx.fillText('籃途 / COURTBOUND', 64, 112);
  ctx.fillStyle = '#91a095';
  ctx.font = `700 17px ${fontFamily}`;
  ctx.fillText('CAREER RECAP · v0.1', 64, 143);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f5f1e7';
  ctx.font = `800 19px ${fontFamily}`;
  ctx.fillText(`${modeQuest.mode.code} / ${state.profile.seed}`, 1016, 112);
  ctx.fillStyle = modeQuest.complete ? '#d9ed83' : '#ff7654';
  ctx.fillText(`${modeQuest.mode.name} · ${modeQuest.label}`, 1016, 143);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#f5f1e7';
  ctx.font = `900 68px ${fontFamily}`;
  shareFitText(ctx, state.profile.name, 64, 232, 670);
  ctx.fillStyle = '#aeb8b0';
  ctx.font = `600 22px ${fontFamily}`;
  shareFitText(ctx, `${state.profile.position} ${POSITIONS[state.profile.position].name} · ${body.height} cm / ${body.weight} kg · ${state.profile.hometown} · ${state.profile.hand}`, 68, 274, 780);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ff7654';
  ctx.font = `900 58px ${fontFamily}`;
  ctx.fillText(`${currentOvr} OVR`, 1016, 242);
  ctx.fillStyle = '#91a095';
  ctx.font = `700 17px ${fontFamily}`;
  ctx.fillText(`${currentSeason().age} 歲 · ${currentTeam().name}`, 1016, 274);
  ctx.textAlign = 'left';

  sharePanel(ctx, 64, 314, 270, 250, modeQuest.complete ? '#d9ed83' : '#ff7654', 'transparent');
  ctx.fillStyle = '#101510';
  ctx.font = `800 18px ${fontFamily}`;
  ctx.fillText('CAREER GRADE', 86, 353);
  ctx.font = `900 142px ${fontFamily}`;
  ctx.fillText(ending.grade, 82, 498);
  ctx.font = `800 20px ${fontFamily}`;
  ctx.fillText(`${Math.round(ending.score)} LEGACY`, 86, 538);

  sharePanel(ctx, 354, 314, 662, 250);
  ctx.fillStyle = '#ff7654';
  ctx.font = `800 17px ${fontFamily}`;
  ctx.fillText('CAREER VERDICT', 382, 352);
  ctx.fillStyle = '#f5f1e7';
  ctx.font = `900 36px ${fontFamily}`;
  shareFitText(ctx, ending.title || '這段生涯由你打出來', 382, 400, 592);
  ctx.fillStyle = '#aeb8b0';
  ctx.font = `600 18px ${fontFamily}`;
  shareFitText(ctx, `${state.history.length} 季 · ${state.visited.length} 國 · ${state.trophies} 冠 · 關鍵回合 ${state.wins}–${state.losses}`, 382, 438, 592);
  ctx.fillStyle = hall.inducted ? '#d9ed83' : '#f5f1e7';
  ctx.font = `800 25px ${fontFamily}`;
  shareFitText(ctx, `名人堂：${hall.label}`, 382, 486, 440);
  ctx.textAlign = 'right';
  ctx.fillStyle = hall.inducted ? '#d9ed83' : '#ff7654';
  ctx.font = `900 32px ${fontFamily}`;
  ctx.fillText(`${Math.round(hall.score)} / 125`, 986, 486);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#263128';
  ctx.fillRect(382, 515, 604, 16);
  ctx.fillStyle = hall.inducted ? '#d9ed83' : '#ff7654';
  ctx.fillRect(382, 515, 604 * clamp(hall.progress / 100), 16);

  const metrics = [
    ['球季', state.history.length], ['巔峰 OVR', peakOvr], ['冠軍', state.trophies], ['國家', state.visited.length],
    ['生涯收入', `${Math.round(state.income)} 萬`], ['生涯得分', state.careerPoints || 0], ['代言合作', (state.endorsements || []).length], ['最高年薪', `${Math.round(highestSalary)} 萬`]
  ];
  metrics.forEach(([label, value], index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const x = 64 + column * 244;
    const y = 592 + row * 104;
    sharePanel(ctx, x, y, 226, 86, '#151b16', '#2c382f');
    ctx.fillStyle = '#91a095';
    ctx.font = `700 15px ${fontFamily}`;
    ctx.fillText(label, x + 17, y + 27);
    ctx.fillStyle = '#f5f1e7';
    ctx.font = `900 30px ${fontFamily}`;
    shareFitText(ctx, value, x + 17, y + 65, 192);
  });

  sharePanel(ctx, 64, 820, 454, 350);
  ctx.fillStyle = '#d9ed83';
  ctx.font = `800 18px ${fontFamily}`;
  ctx.fillText('PLAYER BUILD / 六維能力', 88, 855);
  Object.entries(STAT_META).forEach(([key, meta], index) => {
    const value = Math.round(state.stats[key]);
    const y = 893 + index * 43;
    ctx.fillStyle = '#aeb8b0';
    ctx.font = `700 16px ${fontFamily}`;
    ctx.fillText(`${meta.code}  ${meta.label}`, 88, y);
    ctx.fillStyle = '#2b362e';
    ctx.fillRect(220, y - 14, 236, 15);
    ctx.fillStyle = value >= 80 ? '#ff7654' : '#d9ed83';
    ctx.fillRect(220, y - 14, 236 * value / 99, 15);
    ctx.fillStyle = '#f5f1e7';
    ctx.font = `900 18px ${fontFamily}`;
    ctx.textAlign = 'right';
    ctx.fillText(value, 488, y);
    ctx.textAlign = 'left';
  });

  sharePanel(ctx, 538, 820, 478, 350);
  ctx.fillStyle = '#ff7654';
  ctx.font = `800 18px ${fontFamily}`;
  ctx.fillText('OVR CURVE / 生涯能力曲線', 562, 855);
  const curve = [{ year: '起點', ovr: state.startingOvr || currentOvr }, ...state.history.map((item) => ({ year: item.year, ovr: item.ovr || currentOvr }))];
  if (!curve.length || curve.at(-1).ovr !== currentOvr) curve.push({ year: currentSeason().year, ovr: currentOvr });
  const plot = { x: 574, y: 892, width: 404, height: 205 };
  ctx.strokeStyle = '#2e3a31';
  ctx.lineWidth = 1;
  [40, 60, 80, 99].forEach((score) => {
    const y = plot.y + plot.height - ((score - 35) / 64) * plot.height;
    ctx.beginPath(); ctx.moveTo(plot.x, y); ctx.lineTo(plot.x + plot.width, y); ctx.stroke();
    ctx.fillStyle = '#718078'; ctx.font = `600 12px ${fontFamily}`; ctx.fillText(score, plot.x - 3, y - 5);
  });
  ctx.strokeStyle = '#d9ed83';
  ctx.lineWidth = 6;
  ctx.beginPath();
  curve.forEach((item, index) => {
    const x = plot.x + (curve.length === 1 ? 0 : index / (curve.length - 1)) * plot.width;
    const y = plot.y + plot.height - ((clamp(item.ovr, 35, 99) - 35) / 64) * plot.height;
    if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  curve.forEach((item, index) => {
    const x = plot.x + (curve.length === 1 ? 0 : index / (curve.length - 1)) * plot.width;
    const y = plot.y + plot.height - ((clamp(item.ovr, 35, 99) - 35) / 64) * plot.height;
    ctx.fillStyle = index === curve.length - 1 ? '#ff7654' : '#f5f1e7';
    ctx.beginPath(); ctx.arc(x, y, index === curve.length - 1 ? 7 : 4, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = '#91a095';
  ctx.font = `600 14px ${fontFamily}`;
  ctx.fillText(`起點 ${state.startingOvr || currentOvr}  →  巔峰 ${peakOvr}  →  最終 ${currentOvr}`, 574, 1136);

  ctx.fillStyle = '#f5f1e7';
  ctx.font = `900 25px ${fontFamily}`;
  ctx.fillText('生涯旅程 / CAREER JOURNEY', 64, 1220);
  const journey = state.history.length ? state.history : [{
    year: currentSeason().year, country: currentTeam().country, team: currentTeam().name, record: '進行中', rosterLabel: state.rosterStatus?.label || '競爭中', ppg: '—'
  }];
  journey.forEach((item, index) => {
    const column = Math.floor(index / 8);
    const row = index % 8;
    const x = 64 + column * 320;
    const y = 1252 + row * 36;
    sharePanel(ctx, x, y, 304, 30, '#141a15', '#29342c');
    ctx.fillStyle = item.champion ? '#d9ed83' : '#ff7654';
    ctx.font = `800 12px ${fontFamily}`;
    ctx.fillText(`${String(item.year).slice(-2)} ${COUNTRIES[item.country]?.flag || item.country}`, x + 9, y + 19);
    ctx.fillStyle = '#f5f1e7';
    ctx.font = `800 12px ${fontFamily}`;
    shareFitText(ctx, `${item.team}${item.champion ? ' ★' : ''}`, x + 58, y + 13, 150);
    ctx.fillStyle = '#91a095';
    ctx.font = `600 9px ${fontFamily}`;
    shareFitText(ctx, `${item.record} · ${item.rosterLabel || item.role || '輪替'} · ${item.ppg ?? '—'} PTS`, x + 58, y + 25, 228);
  });

  sharePanel(ctx, 64, 1564, 952, 244, '#151b16', '#344137');
  ctx.fillStyle = modeQuest.complete ? '#d9ed83' : '#ff7654';
  ctx.font = `800 17px ${fontFamily}`;
  ctx.fillText(`CAREER SCRIPT / ${modeQuest.mode.name}`, 88, 1600);
  ctx.fillStyle = '#f5f1e7';
  ctx.font = `900 25px ${fontFamily}`;
  shareFitText(ctx, `${modeQuest.label} · ${modeQuest.detail}`, 88, 1635, 875);
  ctx.fillStyle = '#29342c';
  ctx.fillRect(88, 1655, 864, 14);
  ctx.fillStyle = modeQuest.complete ? '#d9ed83' : '#ff7654';
  ctx.fillRect(88, 1655, 864 * clamp(modeQuest.value / 100), 14);
  ctx.fillStyle = '#91a095';
  ctx.font = `700 14px ${fontFamily}`;
  ctx.fillText('人生主線 / LIFE STORY', 88, 1703);
  ctx.fillStyle = '#f5f1e7';
  ctx.font = `700 17px ${fontFamily}`;
  shareFitText(ctx, `${lifePath.icon} ${lifePath.name} · ${lifePath.desc} · ${(state.storyFlags || []).filter((item) => item.chapter === 1).length} 個逐歲故事`, 88, 1732, 875);
  ctx.fillStyle = '#91a095';
  ctx.font = `700 14px ${fontFamily}`;
  ctx.fillText('成就、合約與商業', 88, 1767);
  ctx.fillStyle = '#f5f1e7';
  ctx.font = `700 17px ${fontFamily}`;
  shareFitText(ctx, `${achievements.slice(-3).map((item) => item.title).join(' · ') || '累積中'} · 最長 ${longestContract} 年約 · 最高年薪 ${Math.round(highestSalary)} 萬 · 簽約金 ${Math.round(totalSigningBonus)} 萬 · ${(state.endorsements || []).length} 次代言`, 88, 1794, 875);

  ctx.fillStyle = '#91a095';
  ctx.font = `600 16px ${fontFamily}`;
  ctx.fillText(`最後一季：${last ? `${last.year} ${last.team} · ${last.record} · ${last.ppg} PTS / ${last.rpg} REB / ${last.apg} AST` : '生涯剛開始'}`, 64, 1852);
  ctx.fillStyle = '#d9ed83';
  ctx.fillRect(64, 1873, 952, 6);
  ctx.fillStyle = '#f5f1e7';
  ctx.font = `800 17px ${fontFamily}`;
  ctx.fillText('allenyuu.github.io/courtbound-career/', 64, 1905);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#91a095';
  ctx.fillText('13–35 歲，每一章都由你自己選。', 1016, 1905);
  ctx.textAlign = 'left';

  shareCardDataUrl = canvas.toDataURL('image/png');
  $('#share-preview-image').src = shareCardDataUrl;
  $('#share-dialog').showModal();
  showToast('1080 × 1920 詳細結算圖預覽完成');
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
    if (!setupDiceRoll || allocationRemaining() > 0) {
      showToast(setupDiceRoll ? `還有 ${allocationRemaining()} 點尚未分配` : '請先擲骰，再分配能力點數');
      return;
    }
    const name = $('#player-name').value.trim() || '未命名新秀';
    const seed = normalizeSeedCode($('#career-seed').value) || generateSeedCode();
    $('#career-seed').value = seed;
    state = createState({
      name, seed, hometown: $('#hometown').value, hand: $('#hand').value, position: selectedPosition, style: 'none',
      careerMode: selectedCareerMode,
      height: selectedHeight, weight: selectedWeight, allocations: { ...setupAllocations }, diceRoll: { ...setupDiceRoll, faces: [...setupDiceRoll.faces] }
    });
    saveGame();
    $('#setup-dialog').close();
    renderAll();
    showToast('球員檔案建立完成');
  });
  $('#random-name-button').addEventListener('click', randomizeName);
  $('#random-seed-button').addEventListener('click', () => prepareNewProfile(false));
  $('#roll-dice-button').addEventListener('click', rollBuildDice);
  $('#player-height').addEventListener('input', (event) => {
    selectedHeight = Number(event.target.value);
    normalizeAllocationsToCaps();
    renderBuildLab();
  });
  $('#player-weight').addEventListener('input', (event) => {
    selectedWeight = Number(event.target.value);
    normalizeAllocationsToCaps();
    renderBuildLab();
  });
  $('#career-seed').addEventListener('input', (event) => {
    event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setupDiceRoll = null;
    setupAllocations = emptyAllocations();
    renderBuildLab();
  });
  $('#career-seed').addEventListener('blur', (event) => {
    event.target.value = normalizeSeedCode(event.target.value) || generateSeedCode();
    renderBuildLab();
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
  $('#confirm-download-share').addEventListener('click', () => {
    if (!shareCardDataUrl || !state) return;
    const link = document.createElement('a');
    link.download = `${state.profile.name}-籃途詳細結算圖.png`;
    link.href = shareCardDataUrl;
    link.click();
    showToast('詳細結算圖已下載');
  });
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

