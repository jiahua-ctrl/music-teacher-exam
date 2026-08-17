(() => {
  const STORE='musicTeacherExamWrittenPracticeV1';
  let currentKind='harmony';
  let current=null;
  let timerId=null;
  let secondsLeft=1200;

  const PROMPTS=[
    {id:'H-01',kind:'harmony',label:'四部和聲',level:'進階',source:'114 基隆高中公開試題結構延伸',time:25,
      prompt:'C 大調。以下列高音旋律為上聲部，完成 8～9 個和弦的 SATB 四部和聲：\nE4 – F4 – G4 – A4 – G4 – F4 – D4 – C4。\n要求：至少使用一次 ii6、一次 V7；結尾形成完全正格終止；標示每個和弦的羅馬數字與轉位。',
      paper:'建議拿五線譜紙實際寫四個聲部。網站文字區可先寫功能規劃，例如：I－ii6－V…，並記錄你最猶豫的配和弦位置。',
      check:['功能進行合理，沒有只逐音配和弦','導音與七和弦七音有適當解決','避免平行五度與平行八度','聲部音域與交叉控制合理','終止式清楚，羅馬數字與轉位標示完整']},
    {id:'H-02',kind:'harmony',label:'四部和聲',level:'進階',source:'近年高中音樂教甄題型改寫',time:25,
      prompt:'G 大調。以低音線 G2 – E2 – A2 – D3 – G2 為骨架，完成 SATB 和聲。\n要求：五個和弦依序呈現主功能－延伸／替代－下屬功能－屬功能－主功能；至少有一個第一轉位和弦，並說明各聲部最重要的傾向音解決。',
      paper:'先不要急著填內聲部。先決定功能與羅馬數字，再逐一處理 S/A/T 的共同音、級進與傾向音。',
      check:['先完成和聲功能規劃再配置聲部','第一轉位的低音與倍音選擇合理','導音向上、七音向下等傾向處理清楚','內聲部以共同音或級進為主','沒有因追求密集和弦造成聲部超出合理音域']},
    {id:'H-03',kind:'harmony',label:'調性／和聲分析',level:'高階',source:'高中教甄和聲實作延伸',time:30,
      prompt:'設計一個 8 小節的四部和聲片段，由 C 大調自然轉調到 G 大調。\n要求：使用共同和弦作樞紐和弦（pivot chord）；標示轉調前後的羅馬數字雙重分析；G 大調需在後半段獲得明確確認。',
      paper:'此題重點不是「突然出現 F♯」，而是能清楚指出哪個和弦在兩個調中都成立，並從何處開始以新調性理解。',
      check:['樞紐和弦在兩個調中都有合理功能','轉調點標示清楚','新調性的導音 F♯ 出現位置合理','後半段有足以確認 G 大調的屬－主進行','雙重羅馬數字分析一致且可解釋']},
    {id:'H-04',kind:'harmony',label:'和聲錯誤診斷',level:'進階',source:'高中教甄實作能力自編',time:15,
      prompt:'請寫出「批改四部和聲」時你會依序檢查的 8 個項目，並依嚴重程度分成：A. 必須修正、B. 視語境判斷。\n至少涵蓋：平行完全協和、聲部交叉、導音、七和弦七音、倍音、跳進與終止式。',
      paper:'這題不是背規則而已。每一項最好補一句「為什麼」或「什麼情況可能例外」。',
      check:['能區分硬性錯誤與風格性原則','平行五／八與直接五／八沒有混為一談','導音與和弦七音的處理說明正確','倍音原則能依和弦位置與功能調整','能用終止式與句法脈絡判斷和聲是否成立']},
    {id:'H-05',kind:'harmony',label:'小調四部和聲',level:'高階',source:'高中音樂教甄和聲題型延伸',time:30,
      prompt:'a 小調，設計 8 小節 SATB 和聲，結尾使用 i6/4－V7－i。\n要求：合理處理和聲小音階的 G♯、增二度風險與屬七和弦七音；至少使用一次 iv 或 iiø6。',
      paper:'先規劃前四小節與後四小節的句法，不要只把終止公式接在最後。',
      check:['G♯ 的使用與解決符合屬功能','避免不自然的增二度旋律進行','iiø6 或 iv 的配置與倍音合理','終止四六理解為屬功能裝飾而非獨立主和弦','V7－i 的聲部解決與終止感清楚']},

    {id:'F-01',kind:'form',label:'曲式分析',level:'進階',source:'114 基隆高中公開試題結構延伸',time:20,
      prompt:'某作品的段落資訊如下：\nmm.1–8：G 大調主題，m.8 PAC。\nmm.9–20：動機切割並轉向 D 大調。\nmm.21–28：D 大調新主題，較抒情。\nmm.29–36：D 大調結束群。\nmm.37–52：多調性序進、碎片化發展。\nmm.53 起：G 大調原主題回歸，後續第二主題也回到 G 大調。\n請判斷最可能的曲式，並標示各區段功能與至少 4 個判斷證據。',
      paper:'請用「段落位置＋調性＋主題材料＋終止」四條證據一起判斷，不要只寫「像奏鳴曲式」。',
      check:['正確辨識奏鳴曲式的大區段','能區分主題、過渡、第二主題與結束群','指出呈示部主副調關係','發展部證據包含碎片化／序進／調性游移','再現部的第二主題回主調有被指出']},
    {id:'F-02',kind:'form',label:'二段／三段曲式',level:'進階',source:'高中教甄曲式判讀自編',time:15,
      prompt:'某小品：A 段 8 小節，由 C 大調走向 G 大調並以半終止後續接；B 段先在 a 小調發展 A 的動機，之後回到 C 大調，最後 4 小節明確再現 A 開頭素材並 PAC 結束。\n請判斷「二段體、再現二段體、三段體」何者最合理，並說明判斷標準。',
      paper:'關鍵是「再現材料是否屬於 B 段內部回歸」以及兩大段是否各自反覆／對稱，不要只看到 A 回來就判三段體。',
      check:['能說明 rounded binary 與 ternary 的核心差異','有使用調性與終止式作證據','有處理 A 素材在 B 後段回歸的意義','不是只用段落長度判斷','結論與所列證據一致']},
    {id:'F-03',kind:'form',label:'賦格／對位',level:'高階',source:'近年高中音樂教甄對位題型延伸',time:20,
      prompt:'四聲部賦格呈示部資料：Soprano 在 c 小調呈示 Subject；Alto 隨後在 g 小調進入；Tenor 再回 c 小調；Bass 以 g 小調位置進入。其間同一固定旋律常與 Subject 同時出現。\n請說明 Subject、Answer、Countersubject、Exposition、Episode 的功能，並判斷哪些資訊可用來檢查 Answer 是 real answer 還是 tonal answer。',
      paper:'如果沒有實際樂譜，不能武斷說一定是 tonal 或 real；此題要寫「需要觀察哪些音程與主屬關係」。',
      check:['Subject／Answer／Countersubject 定義清楚','能說明呈示部四聲部進入邏輯','知道 Episode 通常不完整呈示主題','能區分 real answer 與 tonal answer 的判準','有說明為何僅憑調性名稱仍不足下最終判斷']},
    {id:'F-04',kind:'form',label:'輪旋曲',level:'進階',source:'高中音樂教甄曲式題型自編',time:15,
      prompt:'作品段落依序為 A–B–A–C–A–B–A，A 每次回歸都在主調，B 第一次在屬調、第二次經調整後回主調。\n請判斷最可能的曲式類型，並比較它與「奏鳴輪旋曲」之間還需要哪些證據才能進一步判定。',
      paper:'不要因為有 ABACABA 就立刻寫 sonata-rondo；還要看 B 的功能、C 是否像發展部，以及最後 B 回歸的調性／主題角色。',
      check:['能先辨識七段輪旋的表面結構','知道奏鳴輪旋需要奏鳴曲式功能證據','有討論 B 是否具有第二主題功能','有討論 C 是否具有發展部性格','能以調性配置支持或限制結論']},
    {id:'F-05',kind:'form',label:'分析寫作',level:'高階',source:'高中教甄樂曲分析題型延伸',time:25,
      prompt:'請寫一份「拿到陌生總譜後，15 分鐘內完成曲式初判」的分析流程。\n要求：依順序列出至少 7 個步驟，涵蓋調性、終止、主題／動機、織度、配器、段落比例與回歸關係，並說明哪些證據最可靠、哪些只能當輔助。',
      paper:'把它當成考場 SOP。目標不是分析到最細，而是先用高可信度線索建立可辯護的曲式假設。',
      check:['先找終止與調性骨架，而非從第一音逐小節描述','有辨識主題回歸與新材料','有把動機發展與段落功能連結','知道配器／織度是輔助而非唯一證據','最後會回頭檢查整體比例與曲式假設是否一致']},

    {id:'E-01',kind:'essay',label:'音樂史申論',level:'進階',source:'114 基隆高中公開考點延伸',time:20,
      prompt:'請解釋 Wagner 的「Infinite melody（無限旋律）」：包含其美學目的、與傳統封閉式詠唱調／段落感的差異，以及它如何與主導動機、和聲延宕或音樂戲劇連續性產生關聯。',
      paper:'建議用「定義－歷史背景－技法－作品或戲劇效果」四段式回答。',
      check:['定義不是只翻譯成「一直延續的旋律」','有比較傳統歌劇封閉曲式','有連結 Wagner 音樂戲劇觀','至少提到主導動機或和聲延宕其中之一','有作品／場景或具體音樂效果例證']},
    {id:'E-02',kind:'essay',label:'音樂史申論',level:'進階',source:'114 基隆高中公開考點延伸',time:20,
      prompt:'說明 18 世紀音樂中的 Sturm und Drang（狂飆風格）。請從歷史位置、調性、動態、節奏／休止、情緒表現與代表作曲家或作品切入，並說明它與成熟古典風格的關係。',
      paper:'避免把文學「狂飆突進運動」與音樂風格完全等同；可以說明概念關聯，但需回到實際音樂特徵。',
      check:['歷史時段定位合理','至少寫出三項可聽見的音樂特徵','能舉 Haydn 等具體例子','沒有把它誤寫成浪漫時期風格','有說明它與古典風格形成／情感表現的關係']},
    {id:'E-03',kind:'essay',label:'二十世紀音樂',level:'高階',source:'114 基隆高中公開考點延伸',time:20,
      prompt:'以 Hindemith《Ludus Tonalis》為核心，說明作品在二十世紀音樂史中的位置。可從調性觀、對位傳統、形式設計、與 Bach《平均律鍵盤曲集》的對話等面向回答。',
      paper:'如果記不起細節，不要亂填作品年份；優先把「作品如何回應傳統」寫清楚。',
      check:['正確連結 Hindemith','有提對位／前奏曲與賦格傳統','能說明與 Bach 傳統的對話','不把作品簡化成十二音列作品','有指出二十世紀調性語言或新古典傾向']},
    {id:'E-04',kind:'essay',label:'音樂史申論',level:'高階',source:'114 基隆高中公開考點延伸',time:25,
      prompt:'比較「奏鳴曲」從巴洛克、古典到浪漫時期的概念變化。至少處理 sonata da chiesa／sonata da camera、古典奏鳴曲式與器樂體裁、浪漫時期的形式擴張或循環統一等問題。',
      paper:'題目問的是「演變」，請用時間軸與對照，而不是分三段各寫三個互不相干的名詞。',
      check:['巴洛克時期兩類 sonata 基本特徵清楚','能區分「奏鳴曲」體裁與「奏鳴曲式」','古典時期的調性／主題對比有被說明','浪漫時期有具體擴張或統一手法','整體答案呈現連續演變而非孤立知識點']},
    {id:'E-05',kind:'essay',label:'臺灣音樂',level:'進階',source:'114 基隆高中公開考點延伸',time:20,
      prompt:'說明臺灣客家「老山歌」的音樂特色與文化功能。請至少處理旋律核心音、節奏／拖腔、演唱情境、即興性或歌詞互動，並思考若放進高中音樂課，如何避免只剩名詞背誦。',
      paper:'專業教甄答案可多一層「教學轉化」：從音樂本體特徵設計可聽辨、可模唱或比較的任務。',
      check:['能描述旋律與演唱特色','文化脈絡與實際演唱情境有被提及','沒有只列「La–Do–Mi」就結束','能提出具體聆聽／演唱教學任務','教學設計仍以音樂本體學習為核心']},
    {id:'E-06',kind:'essay',label:'世界音樂',level:'進階',source:'114 基隆高中公開考點延伸',time:20,
      prompt:'以韓國 Pansori 為例，說明其基本表演編制、聲音特色、敘事性與表演者／觀眾互動。最後提出一個高中音樂課的比較聆聽任務，可與歌劇、說唱、戲曲或其他敘事音樂比較。',
      paper:'比較的目的不是判斷誰比較高級，而是找「敘事如何透過聲音與表演被組織」的共同與差異。',
      check:['基本編制與表演角色正確','有處理聲音／節奏／敘事特色','有提現場互動或表演脈絡','比較任務有明確聆聽指標','避免以西方歌劇標準評價 Pansori']}
  ];

  const $=id=>document.getElementById(id);
  const loadHistory=()=>{try{return JSON.parse(localStorage.getItem(STORE))||[]}catch{return []}};
  const saveHistory=x=>localStorage.setItem(STORE,JSON.stringify(x));
  const pool=()=>currentKind==='all'?PROMPTS:PROMPTS.filter(x=>x.kind===currentKind);
  const kindName=k=>({harmony:'四部和聲',form:'曲式／對位',essay:'音樂專業申論'}[k]||'混合');

  function draw(){
    stopTimer();
    const p=pool();
    let choices=current?p.filter(x=>x.id!==current.id):p;
    if(!choices.length)choices=p;
    current=choices[Math.floor(Math.random()*choices.length)];
    secondsLeft=current.time*60;
    $('wpKind').textContent=current.label;
    $('wpLevel').textContent=current.level;
    $('wpSource').textContent=current.source;
    $('wpPrompt').textContent=current.prompt;
    $('wpPaperNote').textContent='✏️ '+current.paper;
    $('wpAnswer').value='';
    $('wpCheck').hidden=true;
    $('wpCheck').innerHTML='';
    $('wpStart').textContent='▶ 開始計時';
    paintTimer();
  }

  function timerText(){const m=Math.floor(secondsLeft/60),s=secondsLeft%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
  function paintTimer(){$('wpTimer').textContent=timerText()}
  function stopTimer(){if(timerId){clearInterval(timerId);timerId=null}}
  function startPause(){
    if(timerId){stopTimer();$('wpStart').textContent='▶ 繼續計時';return}
    if(secondsLeft<=0)secondsLeft=(current?.time||20)*60;
    $('wpStart').textContent='⏸ 暫停';
    timerId=setInterval(()=>{secondsLeft--;paintTimer();if(secondsLeft<=0){stopTimer();$('wpStart').textContent='⏰ 時間到'}},1000);
  }
  function resetTimer(){stopTimer();secondsLeft=(current?.time||20)*60;paintTimer();$('wpStart').textContent='▶ 開始計時'}

  function showCheck(){
    if(!current)return;
    $('wpCheck').hidden=false;
    $('wpCheck').innerHTML=`<h3>📋 自評檢核</h3><div class="written-checklist">${current.check.map((x,i)=>`<label><input type="checkbox" data-score="1"> <span>${i+1}. ${x}</span></label>`).join('')}</div><div class="written-score"><b>先自己勾選，再儲存</b><span id="wpLiveScore">0 / ${current.check.length}</span></div>`;
    $('wpCheck').querySelectorAll('input').forEach(x=>x.addEventListener('change',updateLiveScore));
    updateLiveScore();
  }
  function checkedScore(){return $('wpCheck')?.querySelectorAll('input:checked').length||0}
  function updateLiveScore(){if($('wpLiveScore'))$('wpLiveScore').textContent=`${checkedScore()} / ${current.check.length}`}

  function savePractice(){
    if(!current)return;
    if($('wpCheck').hidden)showCheck();
    const hist=loadHistory();
    hist.unshift({id:current.id,kind:current.kind,label:current.label,source:current.source,date:new Date().toISOString(),score:checkedScore(),max:current.check.length,answer:$('wpAnswer').value.trim(),secondsUsed:current.time*60-secondsLeft});
    saveHistory(hist.slice(0,60));
    renderHistory();
    $('wpSave').textContent='✅ 已儲存';
    setTimeout(()=>$('wpSave').textContent='💾 儲存這次練習',1200);
  }

  function renderHistory(){
    const hist=loadHistory();
    const scored=hist.filter(x=>Number.isFinite(x.score)&&x.max);
    const avg=scored.length?Math.round(scored.reduce((n,x)=>n+x.score/x.max*100,0)/scored.length):0;
    $('wpSummary').textContent=hist.length?`${hist.length} 次 · 平均 ${avg}%`:'0 次';
    if(!hist.length){$('wpHistory').innerHTML='<p class="written-empty">完成第一題後，這裡會開始累積你的書寫練習。</p>';return}
    $('wpHistory').innerHTML=hist.slice(0,8).map(x=>{const d=new Date(x.date);const ds=`${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;const pct=Math.round((x.score||0)/(x.max||1)*100);return `<div class="written-history-row"><div><b>${kindName(x.kind)}｜${x.id}</b><br><small>${ds} · ${x.source}</small></div><b>${pct}%</b></div>`}).join('');
  }

  function bind(){
    document.querySelectorAll('.written-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.written-tab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');currentKind=btn.dataset.kind;draw()}));
    $('wpNew').addEventListener('click',draw);
    $('wpStart').addEventListener('click',startPause);
    $('wpReset').addEventListener('click',resetTimer);
    $('wpShowCheck').addEventListener('click',showCheck);
    $('wpSave').addEventListener('click',savePractice);
  }

  document.addEventListener('DOMContentLoaded',()=>{bind();draw();renderHistory()});
})();
