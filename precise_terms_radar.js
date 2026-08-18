(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function build(level=''){
  const rows=(window.PRECISE_EXAM_TERMS||[]).filter(x=>!level||x.level===level),m=new Map();
  rows.forEach(x=>{if(!m.has(x.term))m.set(x.term,{term:x.term,count:0,years:new Set(),exams:new Map(),levels:new Set()});const a=m.get(x.term);a.count++;a.years.add(x.year);a.levels.add(x.level);a.exams.set(x.year+'|'+x.exam,x)});
  return [...m.values()].map(x=>({...x,yearN:x.years.size,examN:x.exams.size,score:x.years.size*5+x.exams.size*3+x.count})).sort((a,b)=>b.score-a.score||a.term.localeCompare(b.term,'zh-Hant'));
 }
 function render(level=''){
  const box=document.getElementById('preciseTermList'),meta=document.getElementById('preciseTermMeta');if(!box)return;const data=build(level);
  if(meta)meta.textContent=`目前已人工精標 ${data.length} 個具體名詞；資料只計入可追溯的阿摩考卷，會隨 106～115 年逐卷整理持續增加。`;
  box.innerHTML=data.slice(0,40).map((x,i)=>`<details style="border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin:7px 0"><summary style="cursor:pointer;font-weight:850">${i+1}. ${esc(x.term)} <small style="color:var(--muted)">｜${x.yearN} 年｜${x.examN} 卷</small></summary><div style="padding-top:8px;font-size:13px;line-height:1.7">${[...x.exams.values()].sort((a,b)=>Number(b.year)-Number(a.year)).map(e=>`<div><b>${esc(e.year)}｜${esc(e.level)}</b>｜<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.exam)}</a></div>`).join('')}</div></details>`).join('')||'<p class="muted">尚無資料。</p>';
 }
 function mount(){const home=document.getElementById('homeView');if(!home||document.getElementById('preciseTermRadar'))return;const s=document.createElement('section');s.id='preciseTermRadar';s.className='card section-card';s.innerHTML=`<div class="section-title"><div><span class="eyebrow">106～115 阿摩考古題人工精標</span><h3>🔬 精準名詞雷達</h3></div></div><p id="preciseTermMeta" class="muted"></p><div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px"><button class="ghost small ptr active" data-l="">全部</button><button class="ghost small ptr" data-l="國中音樂">國中音樂</button><button class="ghost small ptr" data-l="高中音樂">高中音樂</button><button class="ghost small ptr" data-l="教育專業">教育專業</button></div><div id="preciseTermList"></div>`;home.appendChild(s);s.querySelectorAll('.ptr').forEach(b=>b.onclick=()=>{s.querySelectorAll('.ptr').forEach(x=>x.classList.toggle('active',x===b));render(b.dataset.l)});render('')}
 function loadScript(src,next){const s=document.createElement('script');s.src=src;s.onload=()=>next&&next();document.body.appendChild(s)}
 function loadDetailedAnswers(){
   if(window.__DETAIL_ANSWERS_LOADING__)return;window.__DETAIL_ANSWERS_LOADING__=true;
   loadScript('detailed_answers.js?v=20260818d',()=>loadScript('detailed_answer_ui.js?v=20260818d'));
 }
 window.addEventListener('DOMContentLoaded',()=>{setTimeout(mount,300);setTimeout(loadDetailedAnswers,50)});window.PreciseTermRadar={build};
})();