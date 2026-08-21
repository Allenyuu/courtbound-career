const SAVE_KEY = 'esports-player-simulator-v1';

const STAT_META = {
  mechanics: { label: '操作', icon: '⌁', code: 'MECH' },
  sense: { label: '讀局', icon: '◫', code: 'READ' },
  teamwork: { label: '協作', icon: '⌘', code: 'SYNC' },
  composure: { label: '心態', icon: '◇', code: 'MIND' }
};

const ROLES = {
  striker: { code: 'B01', name: '突破手', stat: 'mechanics', bonus: 4, desc: '用極限操作製造第一個缺口。' },
  caller: { code: 'C02', name: '指揮位', stat: 'sense', bonus: 4, desc: '比畫面更早讀到勝負條件。' },
  anchor: { code: 'A03', name: '支援位', stat: 'teamwork', bonus: 4, desc: '把五個人的失誤接成同一拍。' },
  closer: { code: 'K04', name: '終結者', stat: 'composure', bonus: 4, desc: '在所有人動搖時做最後決定。' }
};

const ORIGINS = {
  cafe: { code: '地下賽', name: '網咖奇兵', desc: '開局聲望 +2；沒有人知道你的上限。', resource: { reputation: 2 } },
  academy: { code: '青訓', name: '青訓遺珠', desc: '開局默契 +2；你懂體系，也懂被放棄。', resource: { bond: 2 } },
  campus: { code: '校隊', name: '校隊隊長', desc: '體力上限 +1；你習慣照顧賽場之外。', resource: { maxEnergy: 1, energy: 1 } }
};

const OATHS = {
  together: { code: 'OATH 01', name: '五個人一起抵達最後', desc: '結局時默契達 8、勝場達 7。' },
  spotlight: { code: 'OATH 02', name: '讓世界記住我的名字', desc: '結局時聲望達 12、操作達 50。' },
  unbroken: { code: 'OATH 03', name: '不把任何人當成燃料', desc: '結局時體力至少 3、壓力不超過 5。' }
};

const MISSIONS = [
  { id: 'debut', name: '第一個回音', desc: '取得職業生涯首勝', test: (s) => s.wins >= 1 },
  { id: 'streak', name: '連勝不是意外', desc: '達成三連勝', test: (s) => s.bestStreak >= 3 },
  { id: 'allround', name: '完整選手', desc: '四項能力都使用過', test: (s) => Object.values(s.usage).every((n) => n > 0) },
  { id: 'pressure', name: '紅區生存', desc: '壓力 6 以上仍判定成功', test: (s, c) => Boolean(c.success && s.stress >= 6) },
  { id: 'team', name: '第五個人不是工具', desc: '默契達到 8', test: (s) => s.bond >= 8 },
  { id: 'rewrite', name: '拒絕這個命運', desc: '用命運點重骰成功', test: (_s, c) => Boolean(c.rerolled && c.success) },
  { id: 'boss', name: '大場面選手', desc: '在章節決戰成功', test: (_s, c) => Boolean(c.success && c.boss) }
];

const SCENES = [
  {
    act: 1, code: '01 / OPEN CALL', short: '01', title: '凌晨兩點的公開海選', dc: 8, time: '第 0 年', watermark: 'OPEN',
    story: '伺服器只剩六十七名觀眾。你和四個第一次說話的人，被要求在十分鐘內組成隊伍。輸掉的人不會有精華剪輯，甚至不會被記住。',
    npc: '臨時隊友夏彌：「如果場面亂掉，第一個開口的人就是隊長。」',
    actions: [
      { code: 'A', stat: 'mechanics', title: '把延遲當成自己的節拍', desc: '不等待磨合，直接用個人操作打出全場第一個缺口。', effect: { energy: -1, stress: 1 }, success: '你的速度迫使四個陌生人開始跟隨。賽後，教練記住了你的 ID。', failure: '你衝得比訊號更快。畫面很漂亮，但隊伍沒有任何人能接到下一拍。' },
      { code: 'B', stat: 'sense', title: '先讀懂四種不同的呼吸', desc: '用前兩回合觀察隊友習慣，再喊出所有人都聽得懂的路線。', effect: { bond: 1 }, success: '陌生人的動作第一次重疊。你沒有最高數據，卻讓整隊像練過一週。', failure: '你看見太多可能，卻慢了一秒說出口。機會從指縫裡消失。' },
      { code: 'C', stat: 'teamwork', title: '替第一次失誤的人擋下責任', desc: '把語音裡的責怪切斷，重新指定每個人的下一個任務。', effect: { bond: 2, stress: 1 }, success: '那名隊友在最後一輪替你守住背後。你們贏的不是配合，是信任。', failure: '氣氛安靜了，失誤卻沒有停止。你承擔了不屬於自己的重量。' }
    ]
  },
  {
    act: 1, code: '02 / FIRST SCRIM', short: '02', title: '第一場團練沒有重來鍵', dc: 9, time: '第 1 年', watermark: 'SCRIM',
    story: '你進入二線隊「灰盒」。團練被對手二十分鐘拆解，教練卻沒有責罵，只把空白戰術板推到你們面前：「誰願意先承認自己看錯？」',
    npc: '教練紀默：「檢討不是找兇手，是決定下一次誰能先救場。」',
    actions: [
      { code: 'A', stat: 'composure', title: '要求從最難看的回合重播', desc: '把自己的錯誤放到第一張畫面，逼全隊停止找藉口。', effect: { stress: -1, energy: -1 }, success: '你說完後，其他人也開始誠實。灰盒第一次有了能被修正的問題。', failure: '你的坦白被誤會成示弱。隊內的沉默比輸掉團練更難處理。' },
      { code: 'B', stat: 'sense', title: '畫出失誤發生前的時間軸', desc: '不討論最後一擊，回推三十秒內每一個錯誤訊號。', effect: { bond: 1, energy: -1 }, success: '真正的問題在交戰前就發生了。你替隊伍找到第一套共同語言。', failure: '圖表沒有錯，但沒有人聽懂。正確答案成了另一種噪音。' },
      { code: 'C', stat: 'teamwork', title: '把麥克風交給最沉默的人', desc: '讓從沒指揮過的支援位描述他看到的戰場。', effect: { bond: 2 }, success: '他的視角補上所有人的盲區。從今天起，語音裡不再只有明星。', failure: '他被突然的注意壓垮。你必須花更多時間把安全感重新建立。' }
    ]
  },
  {
    act: 1, code: '03 / CLIP STORM', short: '03', title: '三十秒剪輯決定了你是誰', dc: 10, time: '第 1 年', watermark: 'VIRAL',
    story: '一次失誤被剪成迷因，在一夜之間突破百萬觀看。沒有人在乎前面十一回合發生了什麼，贊助商只問你能不能把留言區安靜下來。',
    npc: '隊友洛河：「你不必證明那三十秒是假的，只要決定下一秒要做誰。」',
    actions: [
      { code: 'A', stat: 'composure', title: '關掉留言，只留下比賽資料', desc: '退出所有社群，把注意力交還給能控制的事。', effect: { stress: -2, reputation: -1 }, success: '安靜不是逃跑。你重新聽見自己的判斷，下一場乾淨得像新帳號。', failure: '螢幕關了，聲音仍留在腦中。壓抑沒有讓它消失。' },
      { code: 'B', stat: 'sense', title: '直播拆解那次失誤', desc: '把完整時間軸公開，承認錯誤，也說明每個看不見的選擇。', effect: { reputation: 2, stress: 1 }, success: '觀眾第一次看見職業選手如何思考。迷因變成一堂戰術課。', failure: '複雜說明敵不過一句標題。你的誠實再次被剪成十五秒。' },
      { code: 'C', stat: 'mechanics', title: '用下一場操作直接回答', desc: '不發聲明，把所有情緒壓進即將開始的正式賽。', effect: { energy: -2, reputation: 1 }, success: '新的精華片段蓋過舊笑話。聯盟開始用另一種語氣念你的名字。', failure: '你太想贏回畫面，反而又送出一個能被循環播放的瞬間。' }
    ]
  },
  {
    act: 1, code: '04 / PROMOTION', short: '04', title: '升降賽的第五張地圖', dc: 11, time: '第 2 年', watermark: 'ASCEND', boss: true,
    story: '灰盒距離頂級聯賽只差一勝。對面是由前冠軍組成的降級隊，他們擁有更好的設備、更長的暫停，以及所有人都預測你們會輸的安心。',
    npc: '教練紀默：「戰術本只有四頁。第五頁，現在由你們寫。」',
    actions: [
      { code: 'A', stat: 'mechanics', title: '第一輪就打破對位規則', desc: '拿出從未在正式賽使用的高風險模組，搶走主動權。', effect: { energy: -2, stress: 1 }, success: '老將還在辨認你的打法，比分已經失去控制。灰盒升上頂級聯賽。', failure: '驚喜只維持一輪。經驗豐富的對手很快把風險變成你的牢籠。' },
      { code: 'B', stat: 'sense', title: '藏住最後一次跨區轉點', desc: '前四張地圖故意留下錯誤習慣，決勝局才反向利用。', effect: { bond: 1, stress: 1 }, success: '對手讀到了你準備讓他讀到的答案。最後節點空得像預先排練。', failure: '你們把真正的節奏藏得太深，直到落後才發現已沒有時間翻頁。' },
      { code: 'C', stat: 'teamwork', title: '讓新人喊最後一個指令', desc: '把決勝權交給視角最好、資歷最淺的夏彌。', effect: { bond: 2, stress: 1 }, success: '她的聲音顫了一下，指令卻精準落地。五個無名選手一起升級。', failure: '那一秒的遲疑被對手抓住。你保護了未來，卻輸掉今天。' }
    ]
  },
  {
    act: 2, code: '05 / META ZERO', short: '05', title: '版本在開賽前一週死亡', dc: 11, time: '第 2 年', watermark: 'RESET',
    story: '開發團隊移除灰盒最擅長的核心模組。三個月的訓練筆記一夜失效，聯盟卻照常開賽。強隊在買分析師，灰盒只有一間沒有窗的會議室。',
    npc: '分析師阿尺：「版本不是答案被改了，是問題換了問法。」',
    actions: [
      { code: 'A', stat: 'mechanics', title: '搶練沒有人相信的新模組', desc: '把一週睡眠換成足以正式登場的肌肉記憶。', effect: { energy: -2, stress: 1 }, success: '你比版本說明更早理解它。第一週，所有隊伍都在抄你的配置。', failure: '練習量掩蓋不了方向錯誤。你帶著疲憊抵達一個不存在的終點。' },
      { code: 'B', stat: 'sense', title: '建立版本變化的因果地圖', desc: '不追熱門答案，先找出每個數值變動真正獎勵的行為。', effect: { bond: 1, stress: 1 }, success: '你找到了改版背後的設計意圖。灰盒不再追趕，而是提前埋伏。', failure: '地圖太完整，時間卻不夠。你理解世界時，賽程已經開始。' },
      { code: 'C', stat: 'teamwork', title: '把舊戰術拆成可移植語句', desc: '保留隊伍溝通骨架，只替換失效的操作部分。', effect: { bond: 2 }, success: '版本改掉工具，沒有改掉你們相信彼此的方式。灰盒快速完成轉型。', failure: '舊語言帶著過時假設。每個人都在同步執行同一個錯誤。' }
    ]
  },
  {
    act: 2, code: '06 / FRACTURE', short: '06', title: '語音裡少了一個人', dc: 12, time: '第 3 年', watermark: 'BREAK',
    story: '三連敗後，王牌洛河不再參加賽後會議。他照樣準時上線、照樣交出數據，卻像把自己從隊伍頻道裡靜音。管理層要你選：處理他，或取代他。',
    npc: '洛河：「我不是不相信你們。我只是不確定輸掉以後，還剩下哪個我。」',
    actions: [
      { code: 'A', stat: 'composure', title: '在會議裡說出真正的問題', desc: '停止討論戰術，公開承認大家都在害怕成為下一個被換掉的人。', effect: { bond: 2, stress: 1 }, success: '沒有人立刻變好，但麥克風重新亮了。隊伍第一次允許彼此脆弱。', failure: '真話落在沒有安全感的房間裡，變成另一種武器。裂痕更清楚了。' },
      { code: 'B', stat: 'teamwork', title: '私下逐一聽完每個人', desc: '犧牲個人訓練，把五段互相矛盾的故事拼回同一支隊伍。', effect: { energy: -1, bond: 2 }, success: '你沒有替任何人辯護，只讓每個人終於被完整聽見。洛河回到會議。', failure: '你承接太多情緒，卻沒有權力改變制度。疲憊開始從你身上滲出。' },
      { code: 'C', stat: 'mechanics', title: '用個人排名壓過所有爭論', desc: '證明隊伍仍有能贏的核心，讓結果暫時替關係止血。', effect: { reputation: 2, bond: -1, energy: -1 }, success: '你的連勝讓管理層收回換人命令，但大家更依賴你一個人扛住。', failure: '排名沒有治好任何人。當你也輸時，隊伍再也沒有遮雨的地方。' }
    ]
  },
  {
    act: 2, code: '07 / CONTRACT', short: '07', title: '冠軍隊伍寄來一份空白合約', dc: 12, time: '第 3 年', watermark: 'MOVE',
    story: '世界冠軍「白噪」邀請你轉隊，薪資是現在的五倍，位置也為你保留。合約沒有違約條款，像是在說：真正的代價不會寫在紙上。',
    npc: '經紀人：「職業生涯很短。忠誠不會替你支付下一次受傷。」',
    actions: [
      { code: 'A', stat: 'composure', title: '簽下明星合約', desc: '接受更大的舞台，承認職業選手也有權選擇自己的上限。', effect: { reputation: 3, bond: -2 }, success: '你沒有背叛任何人，只是踏進更殘酷的聚光燈。白噪把核心位置交給你。', failure: '新隊伍需要的是你的名字，不是你的聲音。豪華訓練室比灰盒更安靜。' },
      { code: 'B', stat: 'teamwork', title: '把邀約交給全隊表決', desc: '讓隊友參與一個本來只屬於你的決定。', effect: { bond: 3, reputation: -1 }, success: '他們叫你留下，不是因為需要明星，而是願意一起重談未來。', failure: '表決變成一場情緒審判。你留下了，卻不知道是不是出於自由。' },
      { code: 'C', stat: 'sense', title: '用邀約換取灰盒的訓練權', desc: '拒絕立刻答覆，要求管理層改善醫療、分析與輪替制度。', effect: { bond: 1, reputation: 1, stress: 1 }, success: '合約成為槓桿。灰盒第一次像真正的頂級隊伍那樣照顧選手。', failure: '管理層看穿你不想離開。談判失敗，白噪也收回了位置。' }
    ]
  },
  {
    act: 2, code: '08 / REGIONAL', short: '08', title: '洲際資格賽的最後暫停', dc: 13, time: '第 4 年', watermark: 'GATE', boss: true,
    story: '比分八比八。贏下這一輪，你們第一次走出賽區；輸掉，灰盒可能在休賽季被出售。暫停只剩四十三秒，教練的戰術板卻是一片空白。',
    npc: '教練紀默：「現在不要找最安全的答案。找你們願意一起承擔的答案。」',
    actions: [
      { code: 'A', stat: 'mechanics', title: '用零資源完成正面突破', desc: '要求全隊把僅有支援交給另一側，你獨自處理最難對位。', effect: { energy: -2, stress: 1 }, success: '你在沒有保護的地方活了下來。灰盒第一次拿到世界賽門票。', failure: '你差一個動作就成為英雄。賽場只記得結果，身體記得全部代價。' },
      { code: 'B', stat: 'sense', title: '用假節奏騙出對方的暫停答案', desc: '重複前三輪的起手，卻在對手反制前撤離整個區域。', effect: { stress: 1, reputation: 1 }, success: '對手完美執行了你預測的反制，卻發現戰場早已轉移。', failure: '他們沒有上鉤。你們把最後四十三秒花在等待不存在的反應。' },
      { code: 'C', stat: 'teamwork', title: '接受隊友最危險的臨場呼叫', desc: '放下準備好的所有答案，讓五個人同時相信一個瞬間。', effect: { bond: 2, stress: 1 }, success: '沒有任何戰術本記載這一輪。五道聲音在同一秒抵達世界賽。', failure: '信任是真的，判斷卻錯了。你們一起承擔一場沒有人能責怪誰的失敗。' }
    ]
  },
  {
    act: 3, code: '09 / JET LAG', short: '09', title: '世界賽城市沒有夜晚', dc: 13, time: '第 4 年', watermark: 'AWAY',
    story: '窗外巨型廣告牆整夜播放你的臉。訓練賽成績很好，你卻連續三天無法入睡。隊醫說數據正常，明天的開幕戰仍會準時開始。',
    npc: '夏彌：「我們來到世界賽，不代表一定要假裝自己不害怕。」',
    actions: [
      { code: 'A', stat: 'composure', title: '承認自己已經睡不著', desc: '停止扮演沒有弱點的選手，請隊伍一起調整開幕戰計畫。', effect: { stress: -2, bond: 1 }, success: '承認極限讓你重新取得控制。隊友接走了不必由你承擔的工作。', failure: '計畫改了，身體卻沒有立刻相信安全。你仍帶著疲倦走上舞台。' },
      { code: 'B', stat: 'mechanics', title: '加練到身體忘記時差', desc: '用熟悉的操作覆蓋陌生城市，讓肌肉替意識保持清醒。', effect: { energy: -3, reputation: 1 }, success: '開幕戰的你像精密機械。沒有人看見離場後顫抖的手。', failure: '反應速度在燈光下崩塌。你終於明白意志不能取代睡眠。' },
      { code: 'C', stat: 'teamwork', title: '召集五分鐘的無戰術聊天', desc: '關掉比賽畫面，只讓每個人說一件此刻最想念的事。', effect: { bond: 2, stress: -1 }, success: '房間重新有了重力。你們不是五個帳號，而是一起離家的人。', failure: '大家笑得太用力，像在迴避同一件事。夜晚仍舊沒有結束。' }
    ]
  },
  {
    act: 3, code: '10 / FALSE MAP', short: '10', title: '宿敵故意洩漏了一份假情報', dc: 14, time: '世界賽', watermark: 'DECOY',
    story: '匿名帳號傳來宿敵「王座」的完整戰術圖。檔案真實得可疑。分析師認為這是陷阱，但如果其中只有一半是真的，忽略它也可能輸掉系列賽。',
    npc: '分析師阿尺：「情報的價值，不只在真假，也在對方希望我們相信什麼。」',
    actions: [
      { code: 'A', stat: 'sense', title: '反餵一條只對王座成立的情報', desc: '設計一個可被偵測的假練習習慣，測試對方是否真的在觀察。', effect: { stress: 1, reputation: 1 }, success: '王座在比賽中提前反制了一個不存在的戰術。你確認了情報戰的方向。', failure: '你想測試鏡子，卻先暴露自己站在哪裡。對手得到更多答案。' },
      { code: 'B', stat: 'composure', title: '完全不碰那份外流資料', desc: '刪除檔案，接受不知道可能比錯誤的確定更安全。', effect: { bond: 1, stress: -1 }, success: '你們用自己的準備打完整場。王座等待的反制目標從未出現。', failure: '資訊真空讓每個意外都像證明。你開始懷疑刪掉的是否正是答案。' },
      { code: 'C', stat: 'teamwork', title: '把假情報變成隊內即興暗號', desc: '不採用內容，只借用其中術語建立對手聽不懂的新語言。', effect: { bond: 2, energy: -1 }, success: '陷阱成為你們的密碼。王座聽見熟悉詞彙，卻永遠慢一拍理解。', failure: '新暗號連自己人也混淆。最需要清楚的時候，語音變成謎語。' }
    ]
  },
  {
    act: 3, code: '11 / SEMIFINAL', short: '11', title: '四強賽點前的第九回合', dc: 15, time: '世界四強', watermark: 'MATCH', boss: true,
    story: '王座把系列賽拖進最後地圖。全世界都知道灰盒下一輪的標準答案，包括你們自己。教練問：要不要在最重要的時刻，刪掉最熟悉的戰術？',
    npc: '洛河：「我們花四年成為現在的樣子。也許冠軍需要我們再變一次。」',
    actions: [
      { code: 'A', stat: 'mechanics', title: '第九回合主動交換所有對位', desc: '讓每個人暫時離開最熟悉的位置，製造完全不同的攻擊角度。', effect: { energy: -2, stress: 1 }, success: '王座準備擊敗昨天的你們。今天的灰盒從另一個方向抵達決賽。', failure: '陌生位置放大了每個微小遲疑。勇敢沒有被轉換成可執行的答案。' },
      { code: 'B', stat: 'sense', title: '請教練刪掉準備好的答案', desc: '只保留判斷原則，讓比賽當下的資訊決定每一步。', effect: { stress: 1, bond: 1 }, success: '沒有腳本能被破解。你們在同一個瞬間讀懂王座，也讀懂彼此。', failure: '自由帶來太多分支。最後一刻，五個正確選擇指向不同方向。' },
      { code: 'C', stat: 'teamwork', title: '讓替補選手畫最後一張圖', desc: '相信整季坐在場下的人，看見了先發看不見的重複模式。', effect: { bond: 2, reputation: 1 }, success: '那張簡陋手繪圖命中王座唯一的習慣。灰盒全員一起走進世界決賽。', failure: '洞察是真的，轉換得太晚。替補的答案留給了沒有明天的賽後會議。' }
    ]
  },
  {
    act: 3, code: '12 / GRAND FINAL', short: '12', title: '世界決賽的最後十二秒', dc: 16, time: '世界決賽', watermark: 'FINAL', boss: true,
    story: '比分、資源、位置全部相同。場上只剩最後一個訊號節點會在十二秒後關閉。沒有暫停，沒有教練，所有職業生涯都收束成耳機裡的一次呼吸。',
    npc: '全隊語音：「聽你的。」',
    actions: [
      { code: 'A', stat: 'mechanics', title: '自己穿過沒有回程的缺口', desc: '用個人上限迫使對手轉身，為隊伍創造唯一的一秒。', effect: { energy: -3, stress: 2, reputation: 2 }, success: '你的畫面消失前，缺口已經打開。隊友穿過那一秒，把名字留在冠軍牆。', failure: '你抵達了操作的極限，卻差半步讓全隊跟上。全場在同一刻靜止。' },
      { code: 'B', stat: 'sense', title: '在十二秒內改寫全隊優先級', desc: '放棄眼前目標，把所有人送往對手認為不可能的第二答案。', effect: { stress: 2, bond: 1, reputation: 1 }, success: '對手守住了正確地點。你贏在更早決定，正確已經不重要。', failure: '你的答案需要十三秒。最後一道指令抵達時，節點剛好熄滅。' },
      { code: 'C', stat: 'teamwork', title: '把冠軍點交給一路被忽略的人', desc: '吸引所有注意，讓最少被報導的隊友完成最後動作。', effect: { bond: 3, stress: 1, reputation: 1 }, success: '鏡頭追著你，冠軍卻在畫面邊緣誕生。五個人的名字同時亮起。', failure: '對手最後一刻看穿了安排。你們仍一起走到終點，只差終點願不願意打開。' }
    ]
  }
];

const els = {
  route: document.querySelector('#career-route'),
  playerRail: document.querySelector('#player-rail'),
  story: document.querySelector('#story-stage'),
  careerRail: document.querySelector('#career-rail'),
  mobileHud: document.querySelector('#mobile-hud'),
  setup: document.querySelector('#setup-dialog'),
  setupForm: document.querySelector('#setup-form'),
  identityStep: document.querySelector('#setup-identity'),
  diceStep: document.querySelector('#setup-dice'),
  name: document.querySelector('#player-name'),
  seed: document.querySelector('#world-seed'),
  roleOptions: document.querySelector('#role-options'),
  originOptions: document.querySelector('#origin-options'),
  oathOptions: document.querySelector('#oath-options'),
  talentDice: document.querySelector('#talent-dice'),
  allocation: document.querySelector('#allocation-grid'),
  buildSummary: document.querySelector('#build-summary'),
  start: document.querySelector('#start-button'),
  continue: document.querySelector('#continue-button'),
  infoDialog: document.querySelector('#info-dialog'),
  infoContent: document.querySelector('#info-content'),
  endingDialog: document.querySelector('#ending-dialog'),
  endingContent: document.querySelector('#ending-content'),
  canvas: document.querySelector('#share-canvas'),
  toast: document.querySelector('#toast')
};

const setup = {
  role: 'striker', origin: 'cafe', oath: 'together', rerolls: 0,
  dice: [], selectedDie: null,
  assignments: { mechanics: null, sense: null, teamwork: null, composure: null }
};

let state = loadState();
let audioEnabled = true;
let toastTimer;

if (new URLSearchParams(location.search).get('preview') === 'mobile') document.documentElement.classList.add('mobile-preview');

function makeSeed() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function hashNumber(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function dieFrom(key, sides) {
  return (hashNumber(key) % sides) + 1;
}

function initials(name) {
  return (name || 'EP').trim().slice(0, 2).toUpperCase();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function saveState() {
  if (!state) return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY));
    return parsed?.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

function clearState() {
  localStorage.removeItem(SAVE_KEY);
}

function beep(frequency = 420, duration = .045) {
  if (!audioEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const context = new AudioCtx();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.045, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  } catch { /* sound is optional */ }
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add('show');
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 1900);
}

function renderSetupChoices() {
  els.roleOptions.innerHTML = Object.entries(ROLES).map(([id, item]) => `
    <button type="button" class="setup-choice ${setup.role === id ? 'selected' : ''}" data-setup-role="${id}">
      <span>${item.code} · ${STAT_META[item.stat].label} +${item.bonus}</span><b>${item.name}</b><small>${item.desc}</small>
    </button>`).join('');
  els.originOptions.innerHTML = Object.entries(ORIGINS).map(([id, item]) => `
    <button type="button" class="setup-choice ${setup.origin === id ? 'selected' : ''}" data-setup-origin="${id}">
      <span>${item.code}</span><b>${item.name}</b><small>${item.desc}</small>
    </button>`).join('');
  els.oathOptions.innerHTML = Object.entries(OATHS).map(([id, item]) => `
    <button type="button" class="setup-choice ${setup.oath === id ? 'selected' : ''}" data-setup-oath="${id}">
      <span>${item.code}</span><b>${item.name}</b><small>${item.desc}</small>
    </button>`).join('');
}

function rollTalents() {
  setup.rerolls += 1;
  setup.dice = Array.from({ length: 4 }, (_, index) => ({ id: index, value: dieFrom(`${els.seed.value}:talent:${setup.rerolls}:${index}`, 6) }));
  setup.selectedDie = null;
  setup.assignments = { mechanics: null, sense: null, teamwork: null, composure: null };
  renderTalentAllocation();
  beep(540, .06);
}

function assignedDieIds() {
  return new Set(Object.values(setup.assignments).filter((value) => value !== null));
}

function finalBuildStats() {
  const role = ROLES[setup.role];
  return Object.fromEntries(Object.keys(STAT_META).map((key) => {
    const dieId = setup.assignments[key];
    const die = setup.dice.find((item) => item.id === dieId);
    return [key, die ? 32 + die.value * 3 + (role.stat === key ? role.bonus : 0) : null];
  }));
}

function renderTalentAllocation() {
  const assigned = assignedDieIds();
  els.talentDice.innerHTML = setup.dice.map((die) => `
    <button type="button" class="talent-die ${setup.selectedDie === die.id ? 'selected' : ''} ${assigned.has(die.id) ? 'assigned' : ''}" data-die-id="${die.id}" aria-label="天賦骰 ${die.value}">${die.value}</button>`).join('');
  const stats = finalBuildStats();
  els.allocation.innerHTML = Object.entries(STAT_META).map(([key, meta]) => {
    const dieId = setup.assignments[key];
    const die = setup.dice.find((item) => item.id === dieId);
    const roleBonus = ROLES[setup.role].stat === key ? ROLES[setup.role].bonus : 0;
    return `<button type="button" class="allocation-slot ${die ? 'filled' : ''}" data-allocate-stat="${key}">
      <small>${meta.code} · ${meta.icon}</small><b>${meta.label}${roleBonus ? ` + 定位 ${roleBonus}` : ''}${die ? `<strong>${stats[key]}</strong>` : ''}</b><small>${die ? `D6 ${die.value} 已配置｜點擊取回` : '等待一顆天賦骰'}</small>
    </button>`;
  }).join('');
  const ready = Object.values(setup.assignments).every((value) => value !== null);
  els.start.disabled = !ready;
  els.buildSummary.className = `build-summary ${ready ? 'ready' : ''}`;
  els.buildSummary.textContent = ready ? `角色完成｜${ROLES[setup.role].name} · ${ORIGINS[setup.origin].name} · ${OATHS[setup.oath].name}` : `尚有 ${Object.values(setup.assignments).filter((value) => value === null).length} 顆骰子未配置`;
}

function createCareer() {
  const origin = ORIGINS[setup.origin];
  const base = { energy: 8, maxEnergy: 8, stress: 1, bond: 2, reputation: 0 };
  Object.entries(origin.resource).forEach(([key, amount]) => { base[key] += amount; });
  return {
    version: 1,
    name: els.name.value.trim() || 'Rookie',
    seed: els.seed.value.trim().toUpperCase() || makeSeed(),
    role: setup.role,
    origin: setup.origin,
    oath: setup.oath,
    stats: finalBuildStats(),
    ...base,
    fate: 2,
    growth: 0,
    scene: 0,
    phase: 'decision',
    selected: null,
    currentOutcome: null,
    wins: 0,
    losses: 0,
    streak: 0,
    bestStreak: 0,
    usage: { mechanics: 0, sense: 0, teamwork: 0, composure: 0 },
    missions: {},
    history: [],
    feed: '你帶著四顆天賦骰進入灰盒公開海選。',
    ended: false,
    ending: null
  };
}

function statModifier(stat) {
  return clamp(Math.floor((state.stats[stat] - 40) / 4), -2, 8);
}

function conditionModifier() {
  let mod = 0;
  if (state.energy <= 2) mod -= 2;
  else if (state.energy <= 4) mod -= 1;
  if (state.stress >= 7) mod -= 2;
  else if (state.stress >= 5) mod -= 1;
  if (state.bond >= 7) mod += 1;
  return mod;
}

function applyEffect(effect = {}) {
  const maxByKey = { energy: state.maxEnergy, stress: 8, bond: 10, reputation: 99 };
  Object.entries(effect).forEach(([key, value]) => {
    state[key] = clamp(state[key] + value, key === 'reputation' ? -9 : 0, maxByKey[key] ?? 99);
  });
}

function effectTags(effect = {}) {
  const names = { energy: '體力', stress: '壓力', bond: '默契', reputation: '聲望' };
  const entries = Object.entries(effect);
  if (!entries.length) return '<span>無即時代價</span>';
  return entries.map(([key, value]) => `<span class="${(key === 'energy' && value < 0) || (key === 'stress' && value > 0) || (key === 'bond' && value < 0) ? 'risk' : ''}">${names[key]} ${value > 0 ? '+' : ''}${value}</span>`).join('');
}

function chooseAction(index) {
  state.selected = index;
  state.phase = 'roll';
  state.currentOutcome = null;
  saveState();
  render();
  beep(460);
}

function checkMissions(context) {
  const unlocked = [];
  MISSIONS.forEach((mission) => {
    if (!state.missions[mission.id] && mission.test(state, context)) {
      state.missions[mission.id] = true;
      state.growth += 1;
      unlocked.push(mission.name);
    }
  });
  return unlocked;
}

function resolveRoll(rerolled = false) {
  const scene = SCENES[state.scene];
  const action = scene.actions[state.selected];
  const rollKey = `${state.seed}:scene:${state.scene}:${rerolled ? 'rewrite' : 'first'}`;
  const roll = dieFrom(rollKey, 20);
  const ability = statModifier(action.stat);
  const condition = conditionModifier();
  const total = roll + ability + condition;
  const success = roll === 20 || (roll !== 1 && total >= scene.dc);
  const preStreak = rerolled ? state.currentOutcome.preStreak : state.streak;

  if (!rerolled) {
    applyEffect(action.effect);
    state.usage[action.stat] += 1;
    if (success) {
      state.wins += 1;
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.reputation += scene.boss ? 2 : 1;
    } else {
      state.losses += 1;
      state.streak = 0;
      state.stress = clamp(state.stress + 1, 0, 8);
    }
  } else {
    state.fate -= 1;
    if (success) {
      state.losses = Math.max(0, state.losses - 1);
      state.wins += 1;
      state.stress = Math.max(0, state.stress - 1);
      state.streak = preStreak + 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      state.reputation += scene.boss ? 2 : 1;
    }
  }

  const context = { success, rerolled, boss: scene.boss };
  const unlocked = checkMissions(context);
  state.currentOutcome = {
    roll, ability, condition, total, success, rerolled, preStreak,
    text: success ? action.success : action.failure,
    unlocked
  };
  state.phase = 'result';
  state.feed = `${scene.code}｜${action.title}｜${success ? '成功' : '失敗'}${unlocked.length ? `｜任務：${unlocked.join('、')}` : ''}`;
  saveState();
  render();
  beep(success ? 720 : 170, .09);
}

function allocateGrowth(stat) {
  if (state.growth <= 0 || !STAT_META[stat] || state.stats[stat] >= 80) return;
  state.stats[stat] = Math.min(80, state.stats[stat] + 2);
  state.growth -= 1;
  saveState();
  render();
  if (els.infoDialog.open) showCharacterSheet();
  showToast(`${STAT_META[stat].label} +2`);
  beep(620);
}

function advanceScene() {
  const scene = SCENES[state.scene];
  const action = scene.actions[state.selected];
  state.history.push({
    scene: state.scene,
    code: scene.short,
    title: scene.title,
    action: action.title,
    stat: action.stat,
    roll: state.currentOutcome.roll,
    success: state.currentOutcome.success,
    rerolled: state.currentOutcome.rerolled
  });

  if (state.scene === SCENES.length - 1) {
    finishCareer();
    return;
  }

  if (state.scene === 3 || state.scene === 7) {
    state.energy = clamp(state.energy + 3, 0, state.maxEnergy);
    state.stress = clamp(state.stress - 2, 0, 8);
    state.fate = clamp(state.fate + 1, 0, 3);
    state.feed = '章節休整｜體力 +3、壓力 -2、命運點 +1。';
  }
  state.scene += 1;
  state.phase = 'decision';
  state.selected = null;
  state.currentOutcome = null;
  saveState();
  render();
  beep(520);
}

function oathAchieved() {
  if (state.oath === 'together') return state.bond >= 8 && state.wins >= 7;
  if (state.oath === 'spotlight') return state.reputation >= 12 && state.stats.mechanics >= 50;
  return state.energy >= 3 && state.stress <= 5;
}

function buildEnding() {
  const avg = Object.values(state.stats).reduce((sum, value) => sum + value, 0) / 4;
  const finalSuccess = state.currentOutcome.success;
  const missionCount = Object.keys(state.missions).length;
  const score = Math.round(state.wins * 8 + state.reputation * 3 + state.bond * 2 + avg - state.stress * 2 + state.energy + missionCount * 3 + (finalSuccess ? 10 : 0));
  const rank = score >= 150 ? 'S+' : score >= 130 ? 'S' : score >= 110 ? 'A' : score >= 90 ? 'B' : 'C';
  let title = '下一季仍有你的席位';
  let copy = '世界沒有立刻記住你，但更衣室裡仍有人替你保留座位。職業生涯不是童話，它允許未完成。';
  if (state.wins >= 9 && finalSuccess) {
    title = '世界冠軍｜訊號沒有延遲';
    copy = '最後一道指令被五個人同時接住。你沒有獨自成為傳奇，而是讓整支隊伍抵達同一秒。';
  } else if (state.bond >= 8 && state.wins >= 7) {
    title = '五人同頻｜新世代指揮官';
    copy = '數據不總把你排在第一，但所有重要回合都從你的聲音開始。聯盟開始重新定義核心選手。';
  } else if (state.reputation >= 12 && state.stats.mechanics >= Math.max(...Object.values(state.stats))) {
    title = '無法忽視的聯盟明星';
    copy = '鏡頭追著你的每次操作。名字成為版本的一部分，而真正的考驗是下一季仍願不願意相信自己。';
  } else if (state.stress >= 7 || state.energy <= 1) {
    title = '燃燒過的名字';
    copy = '你曾把自己照得像冠軍，代價是沒有留下足夠的力氣慶祝。休息不是失敗，是下一段人生的第一場勝利。';
  } else if (state.wins >= 7) {
    title = '長留頂級聯賽';
    copy = '你沒有靠奇蹟生存，而是把一次次正確的小選擇累積成長久的位置。這比一夜成名更難。';
  }
  return { score, rank, title, copy, oath: oathAchieved(), finalSuccess, missionCount };
}

function finishCareer() {
  state.ended = true;
  state.ending = buildEnding();
  state.phase = 'ended';
  saveState();
  render();
  showEnding();
}

function renderRoute() {
  els.route.innerHTML = SCENES.map((scene, index) => {
    const history = state?.history?.find((item) => item.scene === index);
    const className = index === state?.scene && !state?.ended ? 'active' : history ? (history.success ? 'done' : 'fail') : '';
    return `<span class="route-node ${className} ${index === 4 || index === 8 ? 'act-start' : ''}" data-label="${scene.short}" title="${escapeHtml(scene.title)}"></span>`;
  }).join('');
}

function playerCardHtml() {
  const role = ROLES[state.role];
  return `<div class="player-card">
    <div class="avatar">${escapeHtml(initials(state.name))}</div>
    <div><small>@${escapeHtml(state.name)} · ${role.code}</small><h2>${escapeHtml(state.name)}</h2><p>${role.name}｜ECHO//ARENA</p></div>
    <div class="mobile-pulse"><span><b>${state.wins}-${state.losses}</b>戰績</span><span><b>${state.fate}</b>命運</span><span><b>${state.growth}</b>成長</span></div>
  </div>`;
}

function renderPlayerRail() {
  els.playerRail.innerHTML = `${playerCardHtml()}
    <div class="rail-label"><span>CHARACTER SHEET</span><b>${state.growth ? `成長點 ${state.growth}` : '能力值'}</b></div>
    <div class="stat-list">${Object.entries(STAT_META).map(([key, meta]) => `
      <div class="stat-row"><span class="stat-icon">${meta.icon}</span><div class="stat-copy"><span><b>${meta.label}</b><small>修正 ${statModifier(key) >= 0 ? '+' : ''}${statModifier(key)}</small></span><i style="--fill:${state.stats[key]}%"></i></div>${state.growth > 0 ? `<button class="grow-button" data-grow="${key}" aria-label="提升${meta.label}">+</button>` : `<strong class="stat-value">${state.stats[key]}</strong>`}</div>`).join('')}</div>
    <div class="resource-grid">
      <div class="resource ${state.energy <= 3 ? 'danger' : ''}"><span>體力</span><b>${state.energy}/${state.maxEnergy}</b></div>
      <div class="resource ${state.stress >= 6 ? 'danger' : ''}"><span>壓力</span><b>${state.stress}/8</b></div>
      <div class="resource ${state.bond >= 7 ? 'good' : ''}"><span>隊伍默契</span><b>${state.bond}/10</b></div>
      <div class="resource"><span>聯盟聲望</span><b>${state.reputation}</b></div>
    </div>
    <div class="oath-card"><small>CAREER OATH</small><b>${OATHS[state.oath].name}</b></div>`;
}

function oathProgressText() {
  if (state.oath === 'together') return `默契 ${state.bond}/8 · 勝場 ${state.wins}/7`;
  if (state.oath === 'spotlight') return `聲望 ${state.reputation}/12 · 操作 ${state.stats.mechanics}/50`;
  return `體力 ${state.energy}/3 · 壓力 ${state.stress}/5 以下`;
}

function renderCareerRail() {
  els.careerRail.innerHTML = `
    <div class="goal-box"><small>CAREER GOAL · ACT ${SCENES[state.scene]?.act || 3}</small><b>${OATHS[state.oath].name}</b><p>${oathProgressText()}</p></div>
    <div class="career-score"><div class="score-cell"><b>${state.wins}-${state.losses}</b><span>生涯戰績</span></div><div class="score-cell"><b>${state.reputation}</b><span>聲望</span></div><div class="score-cell"><b>${state.fate}</b><span>命運點</span></div></div>
    <div class="mission-list"><div class="rail-label"><span>SPECIAL MISSIONS</span><b>${Object.keys(state.missions).length}/${MISSIONS.length}</b></div>${MISSIONS.map((mission) => `
      <div class="mission ${state.missions[mission.id] ? 'done' : ''}"><i>${state.missions[mission.id] ? '✓' : '·'}</i><div><b>${mission.name}</b><small>${mission.desc}｜獎勵：成長點 1</small></div></div>`).join('')}</div>
    <div class="feed"><small>CAREER RECORD</small><p>${escapeHtml(state.feed)}</p></div>`;
}

function renderMobileHud() {
  els.mobileHud.innerHTML = Object.entries(STAT_META).map(([key, meta]) => `<div class="hud-stat" data-grow="${state.growth > 0 ? key : ''}"><span>${meta.icon} ${meta.label}</span><b>${state.stats[key]}</b><small>${state.growth > 0 ? '點擊 +2' : `修正 ${statModifier(key) >= 0 ? '+' : ''}${statModifier(key)}`}</small></div>`).join('');
}

function sceneIntroHtml(scene) {
  return `<div class="scene-intro" data-watermark="${scene.watermark}">
    <div class="scene-meta"><span class="act-chip">ACT ${scene.act} · ${scene.code}</span><span class="time-chip">${scene.time}</span><span class="dc-chip">CHECK DC ${scene.dc}</span></div>
    <h1>${scene.title}</h1><p>${scene.story}</p><div class="npc-line">${scene.npc}</div>
  </div>`;
}

function renderDecision(scene) {
  return `<div class="decision-zone"><div class="zone-heading"><div><small>MAKE A CAREER CHOICE</small><h2>你要怎麼回應這一幕？</h2></div><p>選擇會改變資源、關係與結局；下一步才擲 D20。</p></div>
    <div class="action-grid">${scene.actions.map((action, index) => `<button class="action-card" data-action="${index}" data-code="${action.code}">
      <div class="action-top"><span>${action.code} · ${STAT_META[action.stat].code}</span><span>${STAT_META[action.stat].label}判定</span></div><h3>${action.title}</h3><p>${action.desc}</p><div class="effect-tags">${effectTags(action.effect)}</div>
    </button>`).join('')}</div></div>`;
}

function renderRoll(scene) {
  const action = scene.actions[state.selected];
  const ability = statModifier(action.stat);
  const condition = conditionModifier();
  return `<div class="roll-zone"><div class="chosen-action"><small>LOCKED CHOICE · ${STAT_META[action.stat].label.toUpperCase()} CHECK</small><h2>${action.title}</h2><p>${action.desc}</p>
    <div class="check-formula"><span>D20 <b>?</b></span><span>${STAT_META[action.stat].label}修正 <b>${ability >= 0 ? '+' : ''}${ability}</b></span><span>狀態修正 <b>${condition >= 0 ? '+' : ''}${condition}</b></span><span>難度 <b>${scene.dc}</b></span></div></div>
    <div class="dice-console"><div class="d20-display">?</div><p>命運點可在失敗後重骰一次。</p><button class="roll-button" data-roll>擲出 D20</button><button class="back-choice" data-back-choice>重新選擇</button></div></div>`;
}

function renderGrowthPrompt() {
  if (!state.growth) return '';
  return `<div class="growth-prompt"><span>可用成長點 ${state.growth}：</span>${Object.entries(STAT_META).map(([key, meta]) => `<button data-grow="${key}">${meta.label} +2</button>`).join('')}</div>`;
}

function renderResult(scene) {
  const outcome = state.currentOutcome;
  const canRewrite = !outcome.success && !outcome.rerolled && state.fate > 0;
  return `<div class="result-zone"><div class="result-die"><div class="d20-display ${outcome.success ? 'success' : 'failure'}">${outcome.roll}</div><small>${outcome.rerolled ? 'FATE REWRITTEN' : 'D20 RESULT'}</small></div>
    <div class="result-copy"><small>${outcome.success ? 'CHECK PASSED' : 'CHECK FAILED'} · ${scene.code}</small><h2>${outcome.success ? '這一次，訊號抵達了' : '代價比答案更早抵達'}</h2><p>${outcome.text}</p>
      <div class="result-math">D20 ${outcome.roll} ＋ 能力 ${outcome.ability >= 0 ? '+' : ''}${outcome.ability} ＋ 狀態 ${outcome.condition >= 0 ? '+' : ''}${outcome.condition} ＝ ${outcome.total} ／ DC ${scene.dc}</div>
      ${outcome.unlocked.length ? `<div class="growth-prompt">特殊任務完成：${outcome.unlocked.join('、')}｜獲得成長點</div>` : ''}${renderGrowthPrompt()}
      <div class="result-actions">${canRewrite ? `<button class="fate-button" data-reroll>花 1 命運點重骰</button>` : ''}<button class="next-button" data-next>${state.scene === SCENES.length - 1 ? '完成生涯結算' : `進入第 ${state.scene + 2} 幕`} ▸</button></div>
    </div></div>`;
}

function renderStory() {
  if (state.ended) {
    const scene = SCENES[SCENES.length - 1];
    els.story.innerHTML = `<div class="scene-view">${sceneIntroHtml(scene)}<div class="result-zone"><div class="result-die"><div class="d20-display success">${state.ending.rank}</div><small>CAREER COMPLETE</small></div><div class="result-copy"><small>FINAL RANK · ${state.ending.score}</small><h2>${state.ending.title}</h2><p>${state.ending.copy}</p><div class="result-actions"><button class="next-button" data-show-ending>查看結算與分享卡 ▸</button></div></div></div></div>`;
    return;
  }
  const scene = SCENES[state.scene];
  const zone = state.phase === 'decision' ? renderDecision(scene) : state.phase === 'roll' ? renderRoll(scene) : renderResult(scene);
  els.story.innerHTML = `<div class="scene-view">${sceneIntroHtml(scene)}${zone}</div>`;
}

function render() {
  if (!state) return;
  renderRoute();
  renderPlayerRail();
  renderStory();
  renderCareerRail();
  renderMobileHud();
}

function showRules() {
  els.infoContent.innerHTML = `<div class="dialog-kicker">HOW TO PLAY · ORIGINAL SOLO TRPG</div><h2>十二幕，一段會記住代價的職業人生</h2>
    <div class="info-grid">
      <article><b>01｜先選擇，再擲骰</b><p>每幕有三個原創抉擇。鎖定後擲 D20，加上能力與狀態修正，達到該幕 DC 即成功。</p></article>
      <article><b>02｜四項能力自由配骰</b><p>開局擲 4 顆 D6，自由分配給操作、讀局、協作、心態。定位提供一項額外加成。</p></article>
      <article><b>03｜失敗不會讀檔</b><p>失敗會留下壓力與紀錄，也可能開出另一種結局。命運點可在失敗後重骰，但數量有限。</p></article>
      <article><b>04｜特殊任務與成長</b><p>首勝、三連勝、全能力使用等任務會給成長點。每點可讓任一能力永久 +2。</p></article>
      <article><b>05｜三章十二幕</b><p>從公開海選、升降賽、隊內裂痕一路走到世界決賽。完整遊玩約 30–45 分鐘並自動存檔。</p></article>
      <article><b>06｜結局可以帶走</b><p>最終結算會產生 1080×1350 PNG 分享卡，可下載或使用手機原生分享。</p></article>
    </div>
    <p class="reference-note">原創：<a href="https://www.threads.com/@mr.themost" target="_blank" rel="noopener">最先生 Mr.TheMost</a>。生涯節奏與資訊呈現參考 <a href="https://football-life.pages.dev/?seed=msg8kq59-8tqtam" target="_blank" rel="noopener">Football Life</a>、<a href="https://www.yakyolife.com/" target="_blank" rel="noopener">YaKyoLife</a>、<a href="https://jarvanthevoyager.github.io/CheerLife/" target="_blank" rel="noopener">CheerLife</a>；世界觀、角色、事件、規則與文字皆為原創。</p>`;
  els.infoDialog.showModal();
}

function showCharacterSheet() {
  if (!state) return;
  const recent = state.history.slice(-5).map((item) => `${item.code} ${item.title}｜${item.action}｜${item.success ? '成功' : '失敗'}${item.rerolled ? '（改寫）' : ''}`).join('<br>') || '生涯尚未留下正式紀錄。';
  els.infoContent.innerHTML = `<div class="dialog-kicker">CHARACTER SHEET · AUTO SAVED</div><h2>@${escapeHtml(state.name)} 的角色資料</h2><div class="sheet-grid">
    ${Object.entries(STAT_META).map(([key, meta]) => `<div class="sheet-block"><small>${meta.code}</small><b>${meta.icon} ${meta.label} ${state.stats[key]}｜修正 ${statModifier(key) >= 0 ? '+' : ''}${statModifier(key)} ${state.growth ? `<button class="grow-button" data-grow="${key}">+</button>` : ''}</b></div>`).join('')}
    <div class="sheet-block"><small>ROLE / ORIGIN</small><b>${ROLES[state.role].name} · ${ORIGINS[state.origin].name}</b></div><div class="sheet-block"><small>RESOURCES</small><b>體力 ${state.energy}/${state.maxEnergy} · 壓力 ${state.stress}/8 · 默契 ${state.bond}/10 · 命運 ${state.fate}</b></div>
    <div class="sheet-block"><small>CAREER OATH</small><b>${OATHS[state.oath].name}｜${oathProgressText()}</b></div><div class="sheet-block"><small>GROWTH</small><b>可用成長點 ${state.growth} · 任務 ${Object.keys(state.missions).length}/${MISSIONS.length}</b></div>
    <div class="sheet-block career-log"><small>CAREER LOG</small><p>${recent}</p></div></div>`;
  els.infoDialog.showModal();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const chars = [...text];
  let line = '';
  const lines = [];
  chars.forEach((char) => {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = char; } else line = test;
  });
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((value, index) => ctx.fillText(value, x, y + index * lineHeight));
}

function drawShareCard() {
  const canvas = els.canvas;
  const ctx = canvas.getContext('2d');
  const ending = state.ending;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
  gradient.addColorStop(0, '#071110');
  gradient.addColorStop(.55, '#0c1716');
  gradient.addColorStop(1, '#11190e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1350);
  ctx.fillStyle = 'rgba(200,255,61,.035)';
  for (let x = 0; x < 1080; x += 54) ctx.fillRect(x, 0, 1, 1350);
  for (let y = 0; y < 1350; y += 54) ctx.fillRect(0, y, 1080, 1);
  ctx.fillStyle = '#c8ff3d';
  ctx.fillRect(64, 64, 14, 1222);
  ctx.fillStyle = '#f3f8f3';
  ctx.font = '900 34px sans-serif';
  ctx.fillText('電競選手模擬器', 116, 112);
  ctx.fillStyle = '#92a29d';
  ctx.font = '700 16px sans-serif';
  ctx.fillText('ESPORTS PLAYER SIMULATOR · CAREER RESULT', 116, 143);
  ctx.fillStyle = '#51e5d2';
  ctx.font = '800 18px sans-serif';
  ctx.fillText(`@${state.name} · ${ROLES[state.role].name} · ${ORIGINS[state.origin].name}`, 116, 205);
  ctx.fillStyle = '#f3f8f3';
  ctx.font = '900 64px sans-serif';
  wrapCanvasText(ctx, ending.title, 116, 290, 800, 76, 2);

  roundRect(ctx, 796, 188, 206, 205, 26);
  ctx.fillStyle = '#c8ff3d';
  ctx.fill();
  ctx.fillStyle = '#07100f';
  ctx.font = '800 17px sans-serif';
  ctx.fillText('FINAL RANK', 834, 235);
  ctx.font = '900 102px sans-serif';
  ctx.fillText(ending.rank, 832, 342);

  ctx.fillStyle = '#aab7b2';
  ctx.font = '500 22px sans-serif';
  wrapCanvasText(ctx, ending.copy, 116, 430, 850, 36, 3);

  const statY = 590;
  ctx.font = '800 17px sans-serif';
  ctx.fillStyle = '#92a29d';
  ctx.fillText('FINAL CHARACTER SHEET', 116, statY - 34);
  Object.entries(STAT_META).forEach(([key, meta], index) => {
    const y = statY + index * 85;
    ctx.fillStyle = '#f3f8f3';
    ctx.font = '700 22px sans-serif';
    ctx.fillText(meta.label, 116, y);
    ctx.fillStyle = '#172321';
    roundRect(ctx, 230, y - 22, 500, 22, 11);
    ctx.fill();
    const bar = ctx.createLinearGradient(230, 0, 730, 0);
    bar.addColorStop(0, '#51e5d2');
    bar.addColorStop(1, '#c8ff3d');
    ctx.fillStyle = bar;
    roundRect(ctx, 230, y - 22, 500 * (state.stats[key] / 80), 22, 11);
    ctx.fill();
    ctx.fillStyle = '#f3f8f3';
    ctx.font = '900 25px sans-serif';
    ctx.fillText(String(state.stats[key]), 755, y);
  });

  const facts = [
    [`${state.wins}-${state.losses}`, '生涯戰績'],
    [String(state.reputation), '聯盟聲望'],
    [`${ending.missionCount}/${MISSIONS.length}`, '特殊任務'],
    [String(ending.score), '生涯總分']
  ];
  facts.forEach(([value, label], index) => {
    const x = 116 + index * 220;
    roundRect(ctx, x, 945, 196, 105, 16);
    ctx.fillStyle = '#101b1a';
    ctx.fill();
    ctx.strokeStyle = '#2a3936';
    ctx.stroke();
    ctx.fillStyle = '#f3f8f3';
    ctx.font = '900 34px sans-serif';
    ctx.fillText(value, x + 18, 991);
    ctx.fillStyle = '#92a29d';
    ctx.font = '600 16px sans-serif';
    ctx.fillText(label, x + 18, 1024);
  });

  ctx.fillStyle = '#92a29d';
  ctx.font = '800 17px sans-serif';
  ctx.fillText('TWELVE SCENES', 116, 1114);
  state.history.forEach((item, index) => {
    const x = 130 + index * 72;
    ctx.beginPath();
    ctx.arc(x, 1168, 19, 0, Math.PI * 2);
    ctx.fillStyle = item.success ? '#75e59c' : '#ff667d';
    ctx.fill();
    ctx.fillStyle = '#07100f';
    ctx.font = '900 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(index + 1), x, 1173);
  });
  ctx.textAlign = 'left';
  ctx.fillStyle = ending.oath ? '#ffc857' : '#92a29d';
  ctx.font = '800 19px sans-serif';
  ctx.fillText(`${ending.oath ? '✓' : '○'} 職業誓言｜${OATHS[state.oath].name}`, 116, 1235);
  ctx.fillStyle = '#92a29d';
  ctx.font = '600 14px sans-serif';
  ctx.fillText('原創：最先生 Mr.TheMost  ·  allenyuu.github.io/zero-ping', 116, 1274);
  return canvas.toDataURL('image/png');
}

function canvasBlob() {
  return new Promise((resolve) => els.canvas.toBlob(resolve, 'image/png'));
}

function fileName() {
  return `電競選手模擬器_${state.name}_${state.ending.rank}.png`;
}

async function downloadResult() {
  const blob = await canvasBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName();
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('PNG 結算卡已下載');
}

async function shareResult() {
  const blob = await canvasBlob();
  const file = new File([blob], fileName(), { type: 'image/png' });
  if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
    try {
      await navigator.share({ title: `電競選手模擬器｜${state.ending.title}`, text: `我的生涯評級是 ${state.ending.rank}，戰績 ${state.wins}-${state.losses}。`, files: [file] });
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }
  await downloadResult();
  showToast('此瀏覽器不支援檔案分享，已改為下載 PNG');
}

function showEnding() {
  const preview = drawShareCard();
  const ending = state.ending;
  els.endingContent.innerHTML = `<div class="dialog-kicker">CAREER COMPLETE · SHAREABLE PNG</div><h2>${ending.title}</h2><p>${ending.copy}</p>
    <div class="ending-layout"><div class="share-preview"><img src="${preview}" alt="${escapeHtml(state.name)} 的電競選手模擬器結算卡預覽"></div><div class="ending-stats">
      <div class="ending-rank"><span>FINAL RANK · SCORE ${ending.score}</span><strong>${ending.rank}</strong></div>
      <div class="ending-facts"><div><b>${state.wins}-${state.losses}</b><span>戰績</span></div><div><b>${state.reputation}</b><span>聲望</span></div><div><b>${ending.missionCount}/${MISSIONS.length}</b><span>任務</span></div><div><b>${ending.oath ? '完成' : '未竟'}</b><span>誓言</span></div></div>
      <div class="ending-actions"><button class="download-button" data-download>下載 PNG 結算卡</button><button class="share-button" data-share>分享戰績</button><button data-restart>開始全新生涯</button></div>
    </div></div>`;
  els.endingDialog.showModal();
}

function openSetup(hasSave = false) {
  els.seed.value = makeSeed();
  els.continue.hidden = !hasSave;
  els.continue.textContent = state?.ended ? '查看上次生涯結算' : '繼續上次生涯';
  els.identityStep.classList.add('active');
  els.diceStep.classList.remove('active');
  renderSetupChoices();
  els.setup.showModal();
}

function restartCareer() {
  clearState();
  state = null;
  els.endingDialog.close();
  setup.rerolls = 0;
  setup.dice = [];
  setup.assignments = { mechanics: null, sense: null, teamwork: null, composure: null };
  openSetup(false);
}

document.addEventListener('click', (event) => {
  const role = event.target.closest('[data-setup-role]');
  const origin = event.target.closest('[data-setup-origin]');
  const oath = event.target.closest('[data-setup-oath]');
  const die = event.target.closest('[data-die-id]');
  const slot = event.target.closest('[data-allocate-stat]');
  const action = event.target.closest('[data-action]');
  const grow = event.target.closest('[data-grow]');
  const close = event.target.closest('[data-close-dialog]');
  if (role) { setup.role = role.dataset.setupRole; renderSetupChoices(); if (setup.dice.length) renderTalentAllocation(); }
  if (origin) { setup.origin = origin.dataset.setupOrigin; renderSetupChoices(); }
  if (oath) { setup.oath = oath.dataset.setupOath; renderSetupChoices(); renderTalentAllocation(); }
  if (die) { setup.selectedDie = Number(die.dataset.dieId); renderTalentAllocation(); }
  if (slot) {
    const key = slot.dataset.allocateStat;
    if (setup.assignments[key] !== null) {
      setup.assignments[key] = null;
    } else if (setup.selectedDie !== null && !assignedDieIds().has(setup.selectedDie)) {
      setup.assignments[key] = setup.selectedDie;
      setup.selectedDie = null;
    }
    renderTalentAllocation();
    beep(510);
  }
  if (action) chooseAction(Number(action.dataset.action));
  if (grow?.dataset.grow) allocateGrowth(grow.dataset.grow);
  if (event.target.closest('[data-roll]')) resolveRoll(false);
  if (event.target.closest('[data-reroll]')) resolveRoll(true);
  if (event.target.closest('[data-next]')) advanceScene();
  if (event.target.closest('[data-back-choice]')) { state.phase = 'decision'; state.selected = null; saveState(); render(); }
  if (event.target.closest('[data-show-ending]')) showEnding();
  if (event.target.closest('[data-download]')) downloadResult();
  if (event.target.closest('[data-share]')) shareResult();
  if (event.target.closest('[data-restart]')) restartCareer();
  if (close) document.querySelector(`#${close.dataset.closeDialog}`).close();
});

document.querySelector('#to-dice-button').addEventListener('click', () => {
  els.identityStep.classList.remove('active');
  els.diceStep.classList.add('active');
  rollTalents();
});
document.querySelector('#dice-back-button').addEventListener('click', () => {
  els.diceStep.classList.remove('active');
  els.identityStep.classList.add('active');
});
document.querySelector('#reroll-talents').addEventListener('click', rollTalents);
document.querySelector('#seed-button').addEventListener('click', () => { els.seed.value = makeSeed(); setup.rerolls = 0; if (setup.dice.length) rollTalents(); });
document.querySelector('#rules-button').addEventListener('click', showRules);
document.querySelector('#sheet-button').addEventListener('click', showCharacterSheet);
document.querySelector('#sound-button').addEventListener('click', (event) => {
  audioEnabled = !audioEnabled;
  event.currentTarget.textContent = audioEnabled ? '▥' : '×';
  showToast(audioEnabled ? '音效已開啟' : '音效已關閉');
});
els.continue.addEventListener('click', () => {
  els.setup.close();
  render();
  if (state.ended) showEnding();
});
els.setupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (Object.values(setup.assignments).some((value) => value === null)) return;
  state = createCareer();
  saveState();
  els.setup.close();
  render();
  beep(660, .09);
});

if (state) render();
else {
  state = {
    version: 1, name: 'Rookie', seed: 'PREVIEW', role: 'striker', origin: 'cafe', oath: 'together',
    stats: { mechanics: 46, sense: 41, teamwork: 40, composure: 43 }, energy: 8, maxEnergy: 8, stress: 1, bond: 2, reputation: 0, fate: 2, growth: 0,
    scene: 0, phase: 'decision', selected: null, currentOutcome: null, wins: 0, losses: 0, streak: 0, bestStreak: 0,
    usage: { mechanics: 0, sense: 0, teamwork: 0, composure: 0 }, missions: {}, history: [], feed: '等待建立全新生涯。', ended: false, ending: null
  };
  render();
  state = null;
}
openSetup(Boolean(loadState()));
