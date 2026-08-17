(() => {
  const STORE='musicTeacherExamMockHistoryV1';
  const questions=()=>Array.isArray(window.LOCAL_QUESTIONS)?window.LOCAL_QUESTIONS.filter(q=>q.subject==='高中音樂'):[];
  const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
  const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  let paper=null,timer=null,seconds=3600,submitted=false;

  const WRITTEN=[
    {id:'MW1',topic:'四部和聲',prompt:'C 大調。請規劃 8 個和弦的 SATB 和聲，至少使用一次 ii6 與 V7，並以完全正格終止結束。請在五線譜紙完成四部，網站文字區寫出羅馬數字規劃與你檢查平行五／八度的方法。',checks:['功能進行合理','導音與七音解決正確','避免平行五／八度','聲部音域與交叉合理','終止式與羅馬數字標示完整']},
    {id:'MW2',topic:'曲式分析',prompt:'某作品呈示主題後轉往屬調出現新主題，接著經碎片化、序進與多調性發展，最後主題與第二主題皆回到主調。請判斷最可能的曲式，並以「主題、調性、終止、段落功能」至少列 5 點證據。',checks:['辨識大區段正確','能說明主副調關係','能指出發展部證據','能說明再現部調性回歸','結論與證據一致']},
    {id:'MW3',topic:'音樂史申論',prompt:'請說明 Sturm und Drang 在十八世紀音樂中的美學意義、常見音樂特徵與歷史位置，並舉至少兩位作曲家或作品作為例證。',checks:['名詞時代定位正確','音樂特徵具體','至少兩個例證','能連結古典時期美學','不是只有名詞定義']},
    {id:'MW4',topic:'二十世紀音樂',prompt:'請比較 Hindemith 的 Ludus Tonalis 與巴赫平均律鍵盤曲集在「調性／組織觀念、教學或技術意義、曲集結構」上的異同。',checks:['兩部作品背景正確','比較維度清楚','能說明調性觀念差異','能談結構與技術意義','有具體音樂術語']},
    {id:'MW5',topic:'臺灣音樂',prompt:'請以「老山歌」為核心，說明其文化脈絡、音樂特徵與在高中音樂課中可如何轉化為聆聽或演唱教學活動。',checks:['文化脈絡清楚','音樂本體特徵具體','教學活動可操作','有聽辨或演唱任務','能連結素養導向']},
    {id:'MW6',topic:'世界音樂',prompt:'請介紹韓國 Pansori 的表演編制、音樂與敘事特色，並設計一個讓高中生能從聆聽證據辨識其特色的課堂任務。',checks:['表演編制正確','敘事與聲腔特色清楚','聆聽證據具體','課堂任務可操作','避免只做文化介紹']}
  ];

  function build(){
    const pool=shuffle(questions());
    const picked=pool.slice(0,Math.min(30,pool.length));
    const written=shuffle(WRITTEN).slice(0,2);
    paper={mc:picked,written};submitted=false;seconds=3600;paintTimer();renderPaper();
  }
  function renderPaper(){
    const mc=document.getElementById('mcQuestions');
    mc.innerHTML=paper.mc.map((q,i)=>`<div class="mock-q"><div class="mock-note">${i+1}. ${esc(q.topic)}${q.year?`｜${esc(q.year)}年`:''}</div><h3>${esc(q.question)}</h3><div class="mock-options">${[['A',q.option_a],['B',q.option_b],['C',q.option_c],['D',q.option_d]].map(([k,t])=>`<label><input type="radio" name="mc${i}" value="${k}"><span><b>${k}.</b> ${esc(t)}</span></label>`).join('')}</div></div>`).join('');
    const w=document.getElementById('writtenQuestions');
    w.innerHTML=paper.written.map((q,i)=>`<div class="mock-q mock-written"><div class="mock-note">第 ${i+1} 題｜${esc(q.topic)}｜20 分</div><h3>${esc(q.prompt)}</h3><textarea id="mwAns${i}" placeholder="先列架構，再補具體內容。和聲題建議搭配五線譜紙。"></textarea><details style="margin-top:10px"><summary style="cursor:pointer;font-weight:800">交卷後自評規準</summary><div class="mock-checks">${q.checks.map((c,j)=>`<label><input type="checkbox" data-write="${i}" data-point="4" disabled><span>${esc(c)}（4分）</span></label>`).join('')}</div></details></div>`).join('');
    document.getElementById('mockPaper').classList.remove('mock-hidden');
    document.getElementById('mockResult').classList.add('mock-hidden');
    document.getElementById('mockStatus').textContent=`作答中｜${paper.mc.length} 題選擇＋2 題書寫`;
  }
  function startTimer(){if(timer)return;timer=setInterval(()=>{seconds--;paintTimer();if(seconds<=0){clearInterval(timer);timer=null;submit(true)}},1000)}
  function paintTimer(){const m=Math.floor(seconds/60),s=seconds%60;document.getElementById('mockTimer').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
  function start(){if(!paper)build();startTimer();document.getElementById('mockStart').textContent='⏱️ 計時中';}
  function submit(auto=false){
    if(submitted)return;submitted=true;if(timer){clearInterval(timer);timer=null}
    let correct=0;const topicMap={};const wrong=[];
    paper.mc.forEach((q,i)=>{const chosen=document.querySelector(`input[name="mc${i}"]:checked`)?.value||'';const ok=chosen===q.answer;if(ok)correct++;topicMap[q.topic]=topicMap[q.topic]||{c:0,t:0};topicMap[q.topic].t++;if(ok)topicMap[q.topic].c++;else wrong.push({q,chosen});document.querySelectorAll(`input[name="mc${i}"]`).forEach(x=>x.disabled=true)});
    document.querySelectorAll('[data-write]').forEach(x=>x.disabled=false);
    const mcScore=Math.round(correct/Math.max(1,paper.mc.length)*60);
    document.getElementById('mcScore').textContent=mcScore;
    document.getElementById('writtenScore').textContent='待自評';document.getElementById('totalScore').textContent=mcScore;
    document.getElementById('mockSummary').textContent=`${auto?'時間到，自動交卷。':'已交卷。'} 選擇題答對 ${correct}/${paper.mc.length}。勾選下方兩題書寫自評規準後，系統會補上書寫分數。`;
    const rows=Object.entries(topicMap).map(([topic,v])=>({topic,acc:Math.round(v.c/v.t*100),t:v.t})).sort((a,b)=>a.acc-b.acc||b.t-a.t);
    document.getElementById('topicReport').innerHTML=rows.map(x=>`<div class="mock-topic"><span>${esc(x.topic)}</span><b>${x.acc}% <small>(${x.t}題)</small></b></div>`).join('');
    document.getElementById('wrongReview').innerHTML=wrong.length?wrong.map((x,i)=>`<details class="mock-q"><summary>${i+1}. ${esc(x.q.topic)}｜你的答案 ${esc(x.chosen||'未作答')}｜正解 ${esc(x.q.answer)}</summary><p>${esc(x.q.question)}</p><p class="mock-note">${esc(x.q.explanation||'')}</p></details>`).join(''):'<p class="mock-note">選擇題全對，這份很穩。</p>';
    document.getElementById('mockResult').classList.remove('mock-hidden');
    document.getElementById('mockStatus').textContent='已交卷｜請完成書寫題自評';
    bindWriteScoring(mcScore,rows,correct);
    document.getElementById('mockResult').scrollIntoView({behavior:'smooth'});
  }
  function bindWriteScoring(mcScore,rows,correct){
    const update=()=>{let w=0;document.querySelectorAll('[data-write]:checked').forEach(x=>w+=Number(x.dataset.point||0));document.getElementById('writtenScore').textContent=w;document.getElementById('totalScore').textContent=mcScore+w;saveHistory(mcScore,w,rows,correct)};
    document.querySelectorAll('[data-write]').forEach(x=>x.addEventListener('change',update));update();
  }
  function saveHistory(mc,w,rows,correct){
    const h=JSON.parse(localStorage.getItem(STORE)||'[]');const key=paper.mc.map(x=>x.id).join('|')+'#'+paper.written.map(x=>x.id).join('|');const item={key,date:new Date().toISOString(),mc,w,total:mc+w,correct,topics:rows.slice(0,3)};const idx=h.findIndex(x=>x.key===key);if(idx>=0)h[idx]=item;else h.unshift(item);localStorage.setItem(STORE,JSON.stringify(h.slice(0,20)));
  }
  function reset(){if(timer){clearInterval(timer);timer=null}build();document.getElementById('mockStart').textContent='▶ 開始新模擬卷';}
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('mockStart').addEventListener('click',start);
    document.getElementById('mockReset').addEventListener('click',reset);
    document.getElementById('mockSubmit').addEventListener('click',()=>submit(false));
    document.getElementById('mockAgain').addEventListener('click',()=>{reset();start();window.scrollTo({top:0,behavior:'smooth'})});
  });
})();
