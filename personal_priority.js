(()=>{
 const STATS_KEY='musicTeacherExamStatsV1';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const norm=s=>String(s??'').toLowerCase().replace(/[\s\-_/／()（）・,.，。:：;；'"《》〈〉]/g,'');
 const loadStats=()=>{try{const s=JSON.parse(localStorage.getItem(STATS_KEY))||{};return{attempts:s.attempts||{},wrong:Array.isArray(s.wrong)?s.wrong:[],unknown:Array.isArray(s.unknown)?s.unknown:[],daily:s.daily||{},topics:s.topics||{}}}catch{return{attempts:{},wrong:[],unknown:[],daily:{},topics:{}}}};
 const qs=()=>window.MusicTeacherExam?.questions||[];
 function termRows(level=''){
  if(!window.PreciseTermRadar?.build)return[];
  const high=window.PreciseTermRadar.build(level,'high'),rising=window.PreciseTermRadar.build(level,'rising'),rare=window.PreciseTermRadar.build(level,'rare');
  const riseMap=new Map(rising.map(x=>[norm(x.term),x])),rareMap=new Map(rare.map(x=>[norm(x.term),x]));
  const stats=loadStats(),wrong=new Set(stats.wrong||[]),unknown=new Set(stats.unknown||[]),attempts=stats.attempts||{};
  return high.map(x=>{
   const tokens=[x.term,...(x.variants||[])].map(norm).filter(Boolean);
   const related=qs().filter(q=>{if(level&&q.subject!==level)return false;const text=norm(`${q.topic||''} ${q.tags||''} ${q.question||''} ${q.explanation||''}`);return tokens.some(t=>t.length>=2&&text.includes(t))});
   let wrongN=0,unknownN=0,attemptN=0,correctN=0,unknownAttempts=0,masteredQ=0,bestStreak=0;
   related.forEach(q=>{const a=attempts[q.id];if(a){attemptN+=a.total||0;correctN+=a.correct||0;unknownAttempts+=a.unknown||0;bestStreak=Math.max(bestStreak,a.streak||0);const acc=(a.total||0)?(a.correct||0)/(a.total||1):0;if((a.streak||0)>=3&&a.total>=3&&acc>=.8&&!wrong.has(q.id)&&!unknown.has(q.id))masteredQ++}if(wrong.has(q.id))wrongN++;if(unknown.has(q.id))unknownN++});
   const acc=attemptN?Math.round(correctN/attemptN*100):null;
   const topicWeak=related.reduce((n,q)=>{const t=stats.topics?.[q.topic];return n+(t&&t.total>=2&&t.correct/t.total<.7?1:0)},0);
   const risingHit=riseMap.get(norm(x.term)),rareHit=rareMap.get(norm(x.term));
   const personal=unknownN*32+unknownAttempts*7+wrongN*18+(acc!==null?Math.max(0,75-acc):4)+topicWeak*5;
   const masteryPenalty=unknownN||wrongN?0:Math.min(36,masteredQ*9+(bestStreak>=5?10:bestStreak>=3?5:0)+(acc!==null&&attemptN>=5&&acc>=85?8:0));
   const priority=x.score+personal+(risingHit?Math.min(20,risingHit.score/3):0)+(rareHit?6:0)-masteryPenalty;
   return {...x,related,wrongN,unknownN,unknownAttempts,attemptN,acc,masteredQ,bestStreak,masteryPenalty,personal,priority,rising:!!risingHit,rare:!!rareHit};
  }).sort((a,b)=>b.priority-a.priority||b.unknownN-a.unknownN||b.wrongN-a.wrongN||a.masteryPenalty-b.masteryPenalty||b.score-a.score);
 }
 function label(x){const a=[];if(x.unknownN)a.push(`❓ ${x.unknownN} 題目前不知道`);if(x.wrongN)a.push(`❌ ${x.wrongN} 題仍在錯題本`);if(x.acc!==null&&x.acc<70)a.push(`📉 相關題正確率 ${x.acc}%`);if(x.masteryPenalty>=10&&!x.unknownN&&!x.wrongN)a.push(`✅ 已熟練，降權 ${x.masteryPenalty}`);if(x.yearN>=3)a.push('🔥 十年高頻');if(x.rising)a.push('🚀 近年升溫');if(x.rare)a.push('🧊 高鑑別');if(!x.attemptN)a.push('🆕 尚未建立熟練度');return a.slice(0,5).join('　')}
 function render(level=''){
  const box=document.getElementById('personalPriorityList'),meta=document.getElementById('personalPriorityMeta');if(!box)return;
  const data=termRows(level).slice(0,15),s=loadStats(),attemptTotal=Object.values(s.attempts||{}).reduce((n,a)=>n+(a.total||0),0),unknownTotal=(s.unknown||[]).length,wrongTotal=(s.wrong||[]).length;
  if(meta)meta.textContent=attemptTotal?`已依 ${attemptTotal} 題次作答紀錄重新排序：❓不知道 ${unknownTotal} 題 > ❌錯題 ${wrongTotal} 題；連續答對且正確率穩定的考點會自動降權，不再一直佔據主要複習。`:'目前還沒有足夠個人作答紀錄，先依考古題重要度排序；開始刷題後會逐漸變成你的個人榜。';
  box.innerHTML=data.map((x,i)=>`<div style="border:1px solid var(--line);border-radius:13px;padding:12px 13px;margin:8px 0"><div style="display:flex;justify-content:space-between;gap:10px"><b>${i+1}. ${esc(x.term)}</b><small style="color:var(--muted);white-space:nowrap">${x.yearN}年 · ${x.examN}卷</small></div><div style="font-size:12px;line-height:1.7;margin-top:5px">${label(x)}</div>${x.related.length?`<button class="ghost small pp-practice" data-term="${esc(x.term)}" style="margin-top:7px">🎯 練這個考點</button>`:''}</div>`).join('')||'<p class="muted">目前資料不足。</p>';
  box.querySelectorAll('.pp-practice').forEach(btn=>btn.onclick=()=>{const x=data.find(r=>r.term===btn.dataset.term);if(x?.related?.length)window.MusicTeacherExam?.startCustomQuiz(x.related,`優先複習｜${x.term}`,10)});
 }
 function mount(){const home=document.getElementById('homeView');if(!home||document.getElementById('personalPriorityRadar'))return;const radar=document.getElementById('preciseTermRadar'),s=document.createElement('section');s.id='personalPriorityRadar';s.className='card section-card';s.innerHTML=`<div class="section-title"><div><span class="eyebrow">考古題重要度 × 你的作答紀錄</span><h3>🎯 我的上岸優先讀書清單</h3></div></div><p id="personalPriorityMeta" class="muted"></p><div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px"><button class="ghost small pp-level active" data-l="">全部</button><button class="ghost small pp-level" data-l="國中音樂">🎵 國中</button><button class="ghost small pp-level" data-l="高中音樂">🎓 高中</button><button class="ghost small pp-level" data-l="教育專業">📚 教育</button></div><div id="personalPriorityList"></div>`;(radar||home.lastElementChild)?.insertAdjacentElement(radar?'beforebegin':'afterend',s);let level='';s.querySelectorAll('.pp-level').forEach(b=>b.onclick=()=>{level=b.dataset.l;s.dataset.level=level;s.querySelectorAll('.pp-level').forEach(x=>x.classList.toggle('active',x===b));render(level)});s.dataset.level='';render(level)}
 function refreshAfterAnswer(){const fb=document.getElementById('feedback');if(!fb)return;new MutationObserver(()=>{if(!fb.classList.contains('hidden'))setTimeout(()=>{const s=document.getElementById('personalPriorityRadar');if(s)render(s.dataset.level||'')},80)}).observe(fb,{attributes:true,attributeFilter:['class']})}
 document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{mount();refreshAfterAnswer()},650));
 window.PersonalExamPriority={termRows,render};
})();