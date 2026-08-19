// 115 跨考區高頻｜第三批：考前衝刺與個人化優先級
window.EXAM_HIGH_FREQUENCY = window.EXAM_HIGH_FREQUENCY || [];
window.EXAM_SPRINT_CONFIG = {
  title:"考前只剩30分鐘，我該讀什麼？",
  description:"優先複習跨考區重複、容易混淆，而且自己曾答錯的內容。",
  rules:[
    {priority:1,label:"🔥 跨考區重複＋曾答錯",reason:"最可能再次失分，先修正錯誤記憶。"},
    {priority:2,label:"★★★★★ 高頻核心",reason:"多份115試卷從不同角度反覆命中。"},
    {priority:3,label:"👹 易混淆辨析",reason:"考場常用相似人物、術語或樂種互換製造陷阱。"},
    {priority:4,label:"✍️ 名詞／申論框架",reason:"確認自己能用完整句子輸出，而不只是認得答案。"}
  ],
  thirtyMinutePlan:[
    {minutes:"0–8",task:"🔥 錯題急救",detail:"先刷曾答錯的★★★★★／★★★★☆跨考區題，答完立刻看『為什麼錯』。"},
    {minutes:"8–16",task:"🕸️ 知識網快掃",detail:"Pasibutbut、南管、臺灣音樂人物、世界樂器、Minimalism等，用關聯鏈回想，不逐條死背。"},
    {minutes:"16–23",task:"👹 易混淆對決",detail:"Sampling vs Loop、Polytonality vs Polychord、Armstrong vs Goodman、Assessment as/of/for Learning。"},
    {minutes:"23–28",task:"✍️ 口述名詞",detail:"隨機抽2個名詞，用『一句定義＋人事時地物＋特色＋代表＋意義』在60–90秒內說完。"},
    {minutes:"28–30",task:"🎯 最後三題",detail:"只做自己最不穩的3題，不再開新範圍。"}
  ]
};

// 顯示用標籤：介面可依此欄位呈現🔥與高頻星等
window.EXAM_HIGH_FREQUENCY.forEach(function(item){
  item.badges = item.badges || [];
  if(item.level === '★★★★★') item.badges.push('🔥必讀');
  else if(item.level === '★★★★☆') item.badges.push('🔥高頻');
  if(item.appears && item.appears.length >= 3) item.badges.push('跨考區重複');
  if(item.trap) item.badges.push('👹易錯');
});

window.EXTRA_QUESTIONS=window.EXTRA_QUESTIONS||[];
window.EXTRA_QUESTIONS.push(
{year:"115",school:"考前30分鐘",category:"衝刺策略",question:"考前只剩30分鐘，而且你有一題『南管館閣』曾經答錯。下列哪個行動優先級最高？",options:["重新讀整本西洋音樂史","先重做南管高頻錯題並把館閣—指譜曲—UNESCO—林吳素霞連成知識網","隨機找一個從未讀過的作曲家","只背2009這個年份"],answer:1,explanation:"短時間衝刺應優先修正『高頻＋曾答錯』內容，並用知識網避免只修一個孤立答案。"},
{year:"115",school:"考前30分鐘",category:"衝刺策略",question:"下列哪一組最適合放入『👹易混淆對決』？",options:["Sampling／Loop","Bach／Mozart的出生年份","鋼琴／小提琴圖片","C大調音階／生日快樂歌"],answer:0,explanation:"Sampling與Loop概念相近、又常在數位音樂題交叉出現，非常適合用對照方式快速釐清。"},
{year:"115",school:"考前30分鐘",category:"名詞輸出",question:"名詞解釋若只有90秒，哪個結構最穩定？",options:["只寫中文翻譯","一句定義→Who/When/Where→核心特色→代表人物或作品→意義／辨析","把知道的全部無順序寫出","只寫自己的感想"],answer:1,explanation:"先下定義，再用5W2H中最關鍵資訊補脈絡，最後用代表與意義收束，最容易在有限時間形成完整答案。"}
);
