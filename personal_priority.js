(()=>{
 const STATS_KEY='musicTeacherExamStatsV1';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const norm=s=>String(s??'').toLowerCase().replace(/[\s\-_/／()（）・,.，。:：;；'"《》〈〉]/g,'');
 const loadStats=()=>{try{return JSON.parse(localStorage.getItem(STATS_KEY))||{attempts:{},wrong:[],daily:{},topics:{}}}catch{return{attempts:{},wrong:[],daily:{},topics:{}}}};
 const qs=()=>window.MusicTeacherExam?.questions||[];
 function termRows(level=''){
  if(!window.PreciseTermRadar?.build)return[];
  const high=window.PreciseTermRadar.build(level,'high'),rising=window.PreciseTermRadar.build(level,'rising'),rare=window.PreciseTermRadar.build(level,'rare');
  const riseMap=new Map(rising.map(x=>[norm(x.term),x])),rareMap=new Map(rare.map(x=>[norm(x.term),x]));
  const stats=loadStats(),wrong=new Set(stats.wrong||[]),attempts=stats.attempts||{};
  return high.map(x=>{
   const tokens=[x.term,...(x.variants||[])].map(norm).filter(Boolean);
   const related=qs().filter(q=>{if(level&&q.subject!==level)return false;const text=norm(`${q.topic||''} ${q.tags||''} ${q.question||''} ${q.explanation||''}`);return tokens.some(t=>t.length>=2&&text.includes(t))});
   let wrongN=0,attemptN=0,correctN=0;related.forEach(q=>{const a=attempts[q.id];if(a){attemptN+=a.total||0;correctN+=a.correct||0}if(wrong.has(q.id))wrongN++});
   const acc=attemptN?Math.round(correctN/attemptN*100):null;
   const topicWeak=related.reduce((n,q)=>{const t=stats.topics?.[q.topic];return n+(t&&t.total>=2&&t.correct/t.total<.7?1:0)},0);
   const risingHit=riseMap.get(norm(x.term)),rareHit=rareMap.get(norm(x.term));
   const personal=wrongN*18+(acc!==null?Math.max(0,75-acc):4)+topicWeak*5;
   const priority=x.score+personal+(risingHit?Math.min(20,risingHit.score/3):0)+(rareHit?6:0);
   return {...x,related,wrongN,attemptN,acc,personal,priority,rising:!!risingHit,rare:!!rareHit};
  }).sort((a,b)=>b.priority-a.priority||b.wrongN-a.wrongN||b.score-a.score);
 }
 function label(x){const a=[];if(x.wrongN)a.push(`❌ ${x.wrongN} 題仍在錯題本`);if(x.acc!==null&&x.acc<70)a.push(`📉 相關題正確率 ${x.acc}%`);if(x.yearN>=3)a.push('🔥 十年高頻');if(x.rising)a.push('🚀 近年升溫');if(x.rare)a.push('🧊 高鑑別');if(!x.attemptN)a.push('🆕 尚未建立熟練度');return a.slice(0,4).join('　')}
 function render(level=''){
  const box=document.getElementById('personalPriorityList'),meta=document.getElementById('personalPriorityMeta');if(!box)return;
  const data=termRows(level).slice(0,15);const s=loadStats(),attemptTotal=Object.values(s.attempts||{}).reduce((n,a)=>n+(a.total||0),0);
  if(meta)meta.textContent=attemptTotal?`已依你這個裝置累積的 ${attemptTotal} 題次作答紀錄，疊加十年高頻、近三年升溫與高鑑別度重新排序。`:'目前還沒有足夠個人作答紀錄，先依考古題重要度排序；開始刷題後會逐漸變成你的個人榜。';
  box.innerHTML=data.map((x,i)=>`<div style="border:1px solid var(--line);border-radius:13px;padding:12px 13px;margin:8px 0"><div style="display:flex;justify-content:space-between;gap:10px"><b>${i+1}. ${esc(x.term)}</b><small style="color:var(--muted);white-space:nowrap">${x.yearN}年 · ${x.examN}卷</small></div><div style="font-size:12px;line-height:1.7;margin-top:5px">${label(x)}</div>${x.related.length?`<button class="ghost small pp-practice" data-term="${esc(x.term)}" style="margin-top:7px">🎯 練這個考點</button>`:''}</div>`).join('')||'<p class="muted">目前資料不足。</p>';
  box.querySelectorAll('.pp-practice').forEach(btn=>btn.onclick=()=>{const x=data.find(r=>r.term===btn.dataset.term);if(x?.related?.length)window.MusicTeacherExam?.startCustomQuiz(x.related,`優先複習｜${x.term}`,10)});
 }
 function mount(){const home=document.getElementById('homeView');if(!home||document.getElementById('personalPriorityRadar'))return;const radar=document.getElementById('preciseTermRadar'),s=document.createElement('section');s.id='personalPriorityRadar';s.className='card section-card';s.innerHTML=`<div class="section-title"><div><span class="eyebrow">考古題重要度 × 你的作答紀錄</span><h3>🎯 我的上岸優先讀書清單</h3></div></div><p id="personalPriorityMeta" class="muted"></p><div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px"><button class="ghost small pp-level active" data-l="">全部</button><button class="ghost small pp-level" data-l="國中音樂">🎵 國中</button><button class="ghost small pp-level" data-l="高中音樂">🎓 高中</button><button class="ghost small pp-level" data-l="教育專業">📚 教育</button></div><div id="personalPriorityList"></div>`;(radar||home.lastElementChild)?.insertAdjacentElement(radar?'beforebegin':'afterend',s);let level='';s.querySelectorAll('.pp-level').forEach(b=>b.onclick=()=>{level=b.dataset.l;s.querySelectorAll('.pp-level').forEach(x=>x.classList.toggle('active',x===b));render(level)});render(level)}
 document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,650));
 window.PersonalExamPriority={termRows,render};
})();