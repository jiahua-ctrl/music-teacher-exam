// 115 高雄國中聯甄｜第二批可由選擇題升級的詳細名詞
window.EXTRA_TERMS = window.EXTRA_TERMS || [];
window.EXTRA_TERMS.push(
{term:"Self-Determination Theory（自我決定理論）",year:"115",school:"高雄國中聯甄",rarity:"🔥教育理論",definition:"Deci與Ryan提出的動機理論，認為自主（autonomy）、勝任（competence）、關係／歸屬（relatedness）三項基本心理需求獲得支持時，較有利於內在動機、自主調節與持續投入。",keywords:["Deci","Ryan","autonomy","competence","relatedness","intrinsic motivation"],confusion:"『讓學生自由選曲』最直接支持autonomy；『適度挑戰＋具體回饋＋成功經驗』偏competence；『合作、被接納、師生連結』偏relatedness。自主也不等於完全放任，教師仍可提供結構與有限選擇。",teaching:"設計『三條任務路線』：學生可從演奏、編曲、數位創作中選一條完成同一學習目標（自主）；每條分Level 1～3並提供即時回饋（勝任）；最後兩人互評與合奏（關係）。Exit Ticket要求指出哪一設計最讓自己願意繼續學。",answer:"【定義】自我決定理論（Self-Determination Theory, SDT）主要由Edward Deci與Richard Ryan發展，是探討人類動機、自主調節與心理需求的重要理論。其核心指出，當學習環境能支持自主（autonomy）、勝任（competence）與關係／歸屬（relatedness）三項基本心理需求時，較能促進內在動機與持續投入。\n\n【三需求】自主指個體感到自己的行動具有選擇與意願；勝任指感到自己能有效完成挑戰並持續進步；關係需求則指感受到與他人連結、被理解與接納。\n\n【音樂教學】例如教師讓學生在數首難度相近的作品中選曲，可支持自主；以分級任務、具體回饋讓學生看見進步，可支持勝任；安排合作創作與同儕支持，可增進關係需求。\n\n【辨析】自主支持不是毫無規範的自由，而是在清楚目標與適當結構下提供有意義的選擇，使學生逐漸從『老師要我做』轉向『我理解並願意投入』。"},
{term:"Fugue（賦格）",year:"115",school:"高雄國中聯甄",rarity:"🔥西洋音樂史",definition:"以模仿對位為核心的作曲技法與作品類型，通常由主題（subject）在不同聲部依序進入，並透過答題（answer）、插部（episode）、密接和應（stretto）等方式發展。",keywords:["subject","answer","exposition","episode","stretto","contrapuntal imitation"],confusion:"Fugue不是Rondo，也不是Theme and Variations；不能只背成『固定曲式』。其高度辨識特徵是主題在不同聲部的依序模仿進入與後續對位發展。",teaching:"『主題追逐戰』：四組各代表一個聲部。第一組唱2小節主題，第二組延遲進入，再逐組加入；第二輪加入自由插部，第三輪縮短進入距離形成類stretto。學生最後畫出subject進入時間軸。",answer:"【定義】Fugue（賦格）是以模仿對位為核心的重要作曲技法與作品類型，在巴洛克時期尤其成熟，J. S. Bach為代表人物之一。\n\n【結構】作品常由exposition開始，subject先在一聲部出現，其他聲部依序以answer回應；之後透過episode、轉調、主題再現、倒影或stretto等方式發展。\n\n【辨析】賦格不能簡化為固定的ABA或輪旋曲式，其核心是主題在多聲部中的模仿、追逐與對位組織。\n\n【教學】可將班級分成三至四組，用同一短旋律依序錯開進入，再逐步縮短進入距離，讓學生先用身體與聽覺感受多聲部追逐，再連結subject、answer與stretto等術語。"}
);

// 載入第三批高雄國中選擇題與詳細名詞
(function(){
  ["questions_115_kaohsiung_jhs_batch45.js","terms_115_kaohsiung_jhs_batch50.js"].forEach(function(src){
    var s=document.createElement("script"); s.src=src; document.head.appendChild(s);
  });
})();