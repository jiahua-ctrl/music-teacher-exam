(() => {
  const STATS_KEY='musicTeacherExamStatsV1';
  let timerId=null;
  let secondsLeft=600;

  const loadStats=()=>{try{return JSON.parse(localStorage.getItem(STATS_KEY))||{attempts:{},wrong:[],daily:{},topics:{}}}catch{return {attempts:{},wrong:[],daily:{},topics:{}}}};
  const questions=()=>window.MusicTeacherExam?.questions || (Array.isArray(window.LOCAL_QUESTIONS)?window.LOCAL_QUESTIONS:[]);
  const uniq=arr=>[...new Map(arr.map(x=>[x.id,x])).values()];
  const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));

  const TRIAL_PROMPTS=[
    {level:'國中',topic:'流行音樂與節奏',prompt:'請以「從學生熟悉的流行音樂辨識節奏型」為主題，設計10分鐘試教。需包含引起動機、可觀察的學習目標、學生實際操作與形成性評量。'},
    {level:'國中',topic:'臺灣音樂',prompt:'請以臺灣歌謠為素材進行10分鐘試教，讓學生不只知道作品背景，也能從旋律、語言或演唱方式聽出音樂特色。'},
    {level:'國中',topic:'世界音樂',prompt:'請以 Pansori、Gamelan 或 Reggae 任選一項設計10分鐘試教，並安排一個學生能實際聽辨或模仿的任務。'},
    {level:'國中',topic:'音樂教學法',prompt:'請將 Kodály、Orff、Dalcroze 或 Gordon 的核心理念實際轉化成10分鐘課堂活動，不可只介紹教學法名詞。'},
    {level:'高中',topic:'二十世紀音樂',prompt:'請以一位20世紀作曲家或一種現代音樂技法設計10分鐘試教，讓學生透過聆聽證據說出作品特色。'},
    {level:'高中',topic:'曲式分析',prompt:'請設計10分鐘曲式分析試教，引導學生從聽覺與樂譜線索判斷段落，而不是由教師直接公布 A、B、A。'},
    {level:'高中',topic:'和聲',prompt:'請以終止式、屬七和弦或和弦功能為題設計10分鐘試教，必須包含「聽覺－符號－應用」三個層次。'},
    {level:'高中',topic:'臺灣音樂',prompt:'請以臺灣傳統或近現代音樂為題設計10分鐘試教，兼顧音樂本體分析與文化脈絡，最後安排一個素養導向任務。'},
    {level:'高中',topic:'科技融入',prompt:'請設計一段10分鐘音樂試教，合理使用數位工具或AI，但必須說明科技如何幫助學生更深入聆聽、創作或回饋，而不是為用科技而用。'},
    {level:'高中',topic:'跨域與素養',prompt:'請以一首作品連結文學、歷史、社會或視覺藝術設計10分鐘試教，並清楚指出音樂科本身的核心學習目標。'}
  ];

  function frequencyRows(){
    const map=new Map();
    questions().filter(q=>q.year && q.exam && q.subject!=='教育專業').forEach(q=>{
      if(!map.has(q.topic)) map.set(q.topic,{topic:q.topic,sources:new Set(),questions:0,levels:new Set()});
      const x=map.get(q.topic);
      x.sources.add(`${q.year}|${q.exam}`);
      x.questions++;
      x.levels.add(q.subject==='高中音樂'?'高中':'國中');
    });
    return [...map.values()].map(x=>({...x,sourceCount:x.sources.size,levels:[...x.levels]})).sort((a,b)=>b.sourceCount-a.sourceCount || b.questions-a.questions || a.topic.localeCompare(b.topic,'zh-Hant'));
  }
  function weakTopics(){
    const entries=Object.entries(loadStats().topics||{}).filter(([,v])=>(v.total||0)>0).map(([topic,v])=>({topic,total:v.total||0,correct:v.correct||0,acc:Math.round((v.correct||0)/(v.total||1)*100)}));
    return entries.sort((a,b)=>a.acc-b.acc || b.total-a.total);
  }
  function weakPool(){
    const qs=questions(),stats=loadStats(),weak=weakTopics().slice(0,3).map(x=>x.topic),wrong=new Set(stats.wrong||[]);
    let pool=qs.filter(q=>wrong.has(q.id) || weak.includes(q.topic));
    if(!pool.length){
      const frequent=frequencyRows().slice(0,3).map(x=>x.topic);
      pool=qs.filter(q=>frequent.includes(q.topic));
    }
    return uniq(pool);
  }
  function hsPool(kind){
    const hs=questions().filter(q=>q.subject==='高中音樂');
    if(kind==='all') return hs;
    const text=q=>`${q.topic||''};${q.tags||''}`;
    if(kind==='harmony') return hs.filter(q=>/和聲|終止|和弦|屬七/.test(text(q)));
    if(kind==='form') return hs.filter(q=>/曲式|對位|賦格|奏鳴/.test(text(q)));
    if(kind==='history') return hs.filter(q=>/音樂史|巴洛克|古典|浪漫|二十世紀|現代|歌劇/.test(text(q)));
    if(kind==='taiwan') return hs.filter(q=>/臺灣|台灣|客家|歌仔|南管|北管|原住民/.test(text(q)));
    if(kind==='world') return hs.filter(q=>/世界音樂|Pansori|Gamelan|Reggae|民族/.test(text(q)));
    return hs;
  }
  function startPool(pool,label,limit=10){
    if(!window.MusicTeacherExam?.startCustomQuiz){alert('題組功能載入中，請重新整理後再試一次。');return;}
    window.MusicTeacherExam.startCustomQuiz(pool,label,limit);
  }

  function ensureStyles(){
    if(document.getElementById('mtAdvancedStyles'))return;
    const s=document.createElement('style');s.id='mtAdvancedStyles';s.textContent=`
      .mt-advanced{padding:24px;margin-bottom:18px}.mt-advanced h3{margin:4px 0 0}.mt-advanced-note{margin:10px 0 15px;color:var(--muted);font-size:13px;line-height:1.6}
      .mt-frequency{display:grid;gap:9px}.mt-freq-row{display:grid;grid-template-columns:minmax(120px,1fr) 2fr auto;gap:12px;align-items:center;padding:10px 12px;border:1px solid var(--line);border-radius:12px}.mt-freq-row b{font-size:13px}.mt-freq-bar{height:8px;border-radius:99px;background:var(--line);overflow:hidden}.mt-freq-bar i{display:block;height:100%;border-radius:99px;background:var(--brand)}.mt-freq-row small{color:var(--muted);white-space:nowrap}
      .mt-action-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mt-action{border:1px solid var(--line);background:var(--panel);color:inherit;border-radius:14px;padding:14px;text-align:left;cursor:pointer}.mt-action:hover{border-color:var(--brand)}.mt-action b{display:block;margin-bottom:4px}.mt-action small{color:var(--muted);line-height:1.45}
      .mt-weak-summary{padding:13px 15px;border-radius:13px;background:var(--soft);margin-bottom:12px;line-height:1.55}.mt-primary-action{width:100%;border:0;border-radius:12px;padding:12px 14px;background:var(--brand);color:white;font-weight:800;cursor:pointer}
      .mt-trial{padding:16px;border:1px solid var(--line);border-radius:16px}.mt-trial-meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}.mt-mini-pill{padding:5px 9px;border-radius:999px;background:var(--soft);font-size:12px;font-weight:800}.mt-trial-prompt{font-size:16px;font-weight:750;line-height:1.7;min-height:82px}.mt-timer{font-size:38px;font-weight:900;letter-spacing:1px;margin:12px 0;color:var(--brand)}.mt-trial-actions{display:flex;gap:8px;flex-wrap:wrap}.mt-trial-actions button{border:1px solid var(--line);background:var(--panel);color:inherit;border-radius:10px;padding:9px 12px;font-weight:750;cursor:pointer}.mt-trial-actions .go{background:var(--brand);color:#fff;border-color:var(--brand)}
      @media(max-width:720px){.mt-action-grid{grid-template-columns:1fr}.mt-freq-row{grid-template-columns:1fr auto}.mt-freq-bar{grid-column:1/-1;grid-row:2}.mt-timer{font-size:32px}}
    `;document.head.appendChild(s);
  }
  function card(title,eyebrow,body,id){const x=document.createElement('section');x.className='card mt-advanced';if(id)x.id=id;x.innerHTML=`<span class="eyebrow">${eyebrow}</span><h3>${title}</h3>${body}`;return x}
  function insertPanels(){
    const home=document.getElementById('homeView');if(!home||document.getElementById('mtFrequency'))return;
    const anchor=document.getElementById('mtSrs') || document.getElementById('mtCoach') || home.querySelector('.stats-grid');
    const rows=frequencyRows().slice(0,6),max=Math.max(1,...rows.map(x=>x.sourceCount));
    const freqBody=`<p class="mt-advanced-note">依「目前已收錄的 111～115 題目來源」計算，同一年度／同一招考只算一次，避免延伸題灌高次數。這是本站收錄趨勢，不代表全國所有教甄的完整統計。</p><div class="mt-frequency">${rows.map((x,i)=>`<div class="mt-freq-row"><b>${i+1}. ${esc(x.topic)}</b><div class="mt-freq-bar"><i style="width:${Math.max(14,Math.round(x.sourceCount/max*100))}%"></i></div><small>${x.sourceCount} 份來源 · ${x.levels.join('＋')}</small></div>`).join('')}</div>`;
    const freq=card('近五年高頻考點','111～115 題庫趨勢',freqBody,'mtFrequency');

    const weak=weakTopics(),wp=weak.slice(0,3);const weakText=wp.length?wp.map(x=>`${x.topic} ${x.acc}%`).join('、'):'尚未累積足夠作答紀錄，會先用高頻考點配題';
    const weakBody=`<p class="mt-advanced-note">系統會優先混合「你的低正確率主題」與「目前錯題」，不需要自己找下一章要讀什麼。</p><div class="mt-weak-summary">🎯 ${esc(weakText)}</div><button id="mtWeakQuiz" class="mt-primary-action">🧠 開始弱點特訓 10 題</button>`;
    const weakCard=card('自動弱點配題','依你的作答紀錄',weakBody,'mtWeakTraining');

    const hsKinds=[['all','🎓 高中綜合','隨機10題'],['harmony','🎹 和聲','終止式、和弦功能、屬七'],['form','🧩 曲式／對位','曲式、賦格、奏鳴'],['history','🎼 音樂史','巴洛克至20世紀'],['taiwan','🇹🇼 臺灣音樂','歌謠、傳統音樂、文化脈絡'],['world','🌍 世界音樂','跨文化聆聽與辨識']];
    const hsBody=`<p class="mt-advanced-note">高中教甄的專業題常需要比「知道答案」更深入，這裡先把選擇題依能力域拆開，後續再加書寫與分析題。</p><div class="mt-action-grid">${hsKinds.map(([key,title,sub])=>{const n=hsPool(key).length;return `<button class="mt-action" data-hs-kind="${key}"><b>${title}</b><small>${sub} · 目前 ${n} 題</small></button>`}).join('')}</div>`;
    const hsCard=card('高中音樂專業特訓','專業科目拆解',hsBody,'mtHighSchoolCenter');

    const trialBody=`<p class="mt-advanced-note">抽題後先用 1 分鐘想「目標－活動－評量」，再開始 10 分鐘計時。練的是口語結構與課堂節奏，不是背完整教案。</p><div class="mt-trial"><div class="mt-trial-meta"><span id="mtTrialLevel" class="mt-mini-pill"></span><span id="mtTrialTopic" class="mt-mini-pill"></span></div><div id="mtTrialPrompt" class="mt-trial-prompt"></div><div id="mtTrialTimer" class="mt-timer">10:00</div><div class="mt-trial-actions"><button id="mtTrialNew">🎲 換一題</button><button id="mtTrialStart" class="go">▶ 開始10分鐘</button><button id="mtTrialReset">↺ 重設</button></div></div>`;
    const trial=card('10 分鐘試教模擬','口試／試教輸出',trialBody,'mtTrialTeaching');

    [freq,weakCard,hsCard,trial].forEach(x=>anchor?.insertAdjacentElement('afterend',x));
    // insertAdjacentElement(afterend) reverses order, so restore intended order.
    if(anchor){anchor.after(freq,weakCard,hsCard,trial)}
  }

  function drawTrial(){
    const p=TRIAL_PROMPTS[Math.floor(Math.random()*TRIAL_PROMPTS.length)];
    document.getElementById('mtTrialLevel').textContent=p.level;
    document.getElementById('mtTrialTopic').textContent=p.topic;
    document.getElementById('mtTrialPrompt').textContent=p.prompt;
    resetTimer();
  }
  function timerText(){const m=Math.floor(secondsLeft/60),s=secondsLeft%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
  function paintTimer(){const x=document.getElementById('mtTrialTimer');if(x)x.textContent=timerText()}
  function startTimer(){
    if(timerId)return;
    if(secondsLeft<=0)secondsLeft=600;
    const btn=document.getElementById('mtTrialStart');if(btn)btn.textContent='⏸ 計時中';
    timerId=setInterval(()=>{secondsLeft--;paintTimer();if(secondsLeft<=0){clearInterval(timerId);timerId=null;const b=document.getElementById('mtTrialStart');if(b)b.textContent='⏰ 時間到';}},1000);
  }
  function resetTimer(){if(timerId){clearInterval(timerId);timerId=null}secondsLeft=600;paintTimer();const btn=document.getElementById('mtTrialStart');if(btn)btn.textContent='▶ 開始10分鐘'}
  function bind(){
    document.getElementById('mtWeakQuiz')?.addEventListener('click',()=>startPool(weakPool(),'弱點特訓',10));
    document.querySelectorAll('[data-hs-kind]').forEach(btn=>btn.addEventListener('click',()=>startPool(hsPool(btn.dataset.hsKind),btn.querySelector('b')?.textContent||'高中專業',10)));
    document.getElementById('mtTrialNew')?.addEventListener('click',drawTrial);
    document.getElementById('mtTrialStart')?.addEventListener('click',startTimer);
    document.getElementById('mtTrialReset')?.addEventListener('click',resetTimer);
  }
  document.addEventListener('DOMContentLoaded',()=>{ensureStyles();setTimeout(()=>{insertPanels();bind();drawTrial()},80)});
})();