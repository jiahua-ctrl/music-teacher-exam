(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
 const YEAR_MAX=115;
 function build(level=''){
  const rows=(window.PRECISE_EXAM_TERMS||[]).filter(x=>!level||x.level===level),m=new Map();
  rows.forEach(x=>{if(!m.has(x.term))m.set(x.term,{term:x.term,count:0,years:new Set(),exams:new Map(),levels:new Set(),latest:0});const a=m.get(x.term);a.count++;a.years.add(Number(x.year));a.levels.add(x.level);a.latest=Math.max(a.latest,Number(x.year)||0);a.exams.set(x.year+'|'+x.exam,x)});
  return [...m.values()].map(x=>{const yearN=x.years.size,examN=x.exams.size,recency=Math.max(0,6-(YEAR_MAX-x.latest)),crossLevel=x.levels.size>1?4:0;return {...x,yearN,examN,recency,crossLevel,score:yearN*8+examN*4+recency+crossLevel};}).sort((a,b)=>b.score-a.score||b.latest-a.latest||a.term.localeCompare(b.term,'zh-Hant'));
 }
 function badge(x){const b=[];if(x.yearN>=3)b.push('🔥跨年高頻');else if(x.yearN>=2)b.push('⭐跨年');if(x.levels.size>1)b.push('🎯跨學段');if(x.latest>=114)b.push('🆕近年再考');return b.join('　');}
 function render(level=''){
  const box=document.getElementById('preciseTermList'),meta=document.getElementById('preciseTermMeta');if(!box)return;const data=build(level);
  if(meta)meta.textContent=`目前已人工精標 ${data.length} 個具體名詞。排名優先看跨年度、不同考卷與近年再考；同一考卷重複標記不會被當成多份考卷。`;
  box.innerHTML=data.slice(0,30).map((x,i)=>`<details style="border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin:7px 0"><summary style="cursor:pointer;font-weight:850">${i+1}. ${esc(x.term)} <small style="color:var(--muted)">｜${x.yearN} 年｜${x.examN} 卷｜最近 ${x.latest} 年</small></summary><div style="padding-top:8px;font-size:13px;line-height:1.7"><div style="font-weight:800;margin-bottom:5px">${badge(x)||'持續蒐集'}</div>${[...x.exams.values()].sort((a,b)=>Number(b.year)-Number(a.year)).map(e=>`<div><b>${esc(e.year)}｜${esc(e.level)}</b>｜<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.exam)}</a></div>`).join('')}</div></details>`).join('')||'<p class="muted">尚無資料。</p>';
 }
 function mount(){const home=document.getElementById('homeView');if(!home||document.getElementById('preciseTermRadar'))return;const s=document.createElement('section');s.id='preciseTermRadar';s.className='card section-card';s.innerHTML=`<div class="section-title"><div><span class="eyebrow">106～115 阿摩考古題人工精標</span><h3>🔥 Top 30 精準高頻考點</h3></div></div><p id="preciseTermMeta" class="muted"></p><div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px"><button class="ghost small ptr active" data-l="">上岸總榜</button><button class="ghost small ptr" data-l="國中音樂">🎵 國中音樂</button><button class="ghost small ptr" data-l="高中音樂">🎓 高中音樂</button><button class="ghost small ptr" data-l="教育專業">📚 教育專業</button></div><div id="preciseTermList"></div>`;home.appendChild(s);s.querySelectorAll('.ptr').forEach(b=>b.onclick=()=>{s.querySelectorAll('.ptr').forEach(x=>x.classList.toggle('active',x===b));render(b.dataset.l)});render('')}
 function loadScript(src,next){const s=document.createElement('script');s.src=src;s.onload=()=>next&&next();document.body.appendChild(s)}
 function loadDetailedAnswers(){if(window.__DETAIL_ANSWERS_LOADING__)return;window.__DETAIL_ANSWERS_LOADING__=true;loadScript('detailed_answers.js?v=20260818d',()=>loadScript('detailed_answer_ui.js?v=20260818d'));}
 window.addEventListener('DOMContentLoaded',()=>{setTimeout(mount,300);setTimeout(loadDetailedAnswers,50)});window.PreciseTermRadar={build};
})();