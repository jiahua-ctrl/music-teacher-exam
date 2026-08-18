(()=>{
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const YEAR_MAX=115;
 const norm=s=>String(s??'').toLowerCase().replace(/[\s\-_/／()（）・,.，。:：;；'"《》〈〉]/g,'');
 function rawRows(){
  const a=(window.PRECISE_EXAM_TERMS||[]).map(x=>({...x,exam:x.exam||x.school||'未標示考卷',aliases:x.aliases||[]}));
  const b=(window.PRECISE_TERM_OCCURRENCES||[]).map(x=>({...x,exam:x.exam||x.school||'未標示考卷',aliases:x.aliases||[]}));
  return [...a,...b].filter(x=>x.term&&Number(x.year)>=106&&Number(x.year)<=115);
 }
 function canonicalize(rows){
  const parent=rows.map((_,i)=>i),find=i=>parent[i]===i?i:(parent[i]=find(parent[i]));
  const union=(a,b)=>{a=find(a);b=find(b);if(a!==b)parent[b]=a};
  const tokenOwner=new Map();
  rows.forEach((r,i)=>[r.term,...(r.aliases||[])].forEach(v=>{const k=norm(v);if(!k)return;if(tokenOwner.has(k))union(i,tokenOwner.get(k));else tokenOwner.set(k,i)}));
  const groups=new Map();rows.forEach((r,i)=>{const root=find(i);if(!groups.has(root))groups.set(root,[]);groups.get(root).push(r)});
  return [...groups.values()].map(g=>{
   const counts=new Map();g.forEach(r=>counts.set(r.term,(counts.get(r.term)||0)+1));
   const term=[...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].length-b[0].length)[0][0];
   const variants=[...new Set(g.flatMap(r=>[r.term,...(r.aliases||[])]) )].filter(v=>v!==term);
   return {term,variants,rows:g};
  });
 }
 function build(level='',mode='high'){
  let rows=rawRows().filter(x=>!level||x.level===level);
  return canonicalize(rows).map(g=>{
   const years=new Set(),recentYears=new Set(),exams=new Map(),recentExams=new Map(),levels=new Set();let latest=0,count=0;
   g.rows.forEach(x=>{count++;const y=Number(x.year);years.add(y);if(y>=113)recentYears.add(y);levels.add(x.level);latest=Math.max(latest,y||0);const key=y+'|'+x.exam;exams.set(key,x);if(y>=113)recentExams.set(key,x)});
   const yearN=years.size,examN=exams.size,recentYearN=recentYears.size,recentExamN=recentExams.size,recency=Math.max(0,6-(YEAR_MAX-latest)),crossLevel=levels.size>1?4:0;
   const highScore=yearN*8+examN*4+recency+crossLevel;
   const risingScore=recentYearN*12+recentExamN*7+recency*2+(latest===115?8:0)+crossLevel-Math.max(0,yearN-recentYearN)*2;
   const rareScore=(yearN===1?14:0)+(examN<=2?8:0)+(latest>=113?8:0)+(g.variants.length?2:0)+(crossLevel?3:0);
   return {...g,count,years,recentYears,exams,recentExams,levels,latest,yearN,examN,recentYearN,recentExamN,recency,crossLevel,score:mode==='rising'?risingScore:mode==='rare'?rareScore:highScore};
  }).filter(x=>mode!=='rare'||(x.yearN<=2&&x.examN<=3)).sort((a,b)=>b.score-a.score||b.latest-a.latest||a.term.localeCompare(b.term,'zh-Hant'));
 }
 function badge(x,mode){const b=[];if(mode==='rising'){if(x.recentYearN>=2)b.push('🚀近三年升溫');if(x.latest===115)b.push('⚡115仍在考');}else if(mode==='rare'){b.push('🧊冷門高鑑別');if(x.latest>=113)b.push('🆕近年出現');}else{if(x.yearN>=3)b.push('🔥跨年高頻');else if(x.yearN>=2)b.push('⭐跨年');}if(x.levels.size>1)b.push('🎯跨學段');return b.join('　');}
 function render(level='',mode='high'){
  const box=document.getElementById('preciseTermList'),meta=document.getElementById('preciseTermMeta');if(!box)return;const data=build(level,mode);
  if(meta)meta.textContent=mode==='rising'?'🚀 近三年快速升溫：優先看 113～115 年重複出現、115 仍在考的精準名詞。':mode==='rare'?'🧊 冷門高鑑別：只出現少數年份／考卷，但題目細、容易拉開差距；近年新出的冷門概念會提高順位。':'🔥 十年高頻必讀：106～115 跨年度、不同考卷與近年再考優先；教育專業與音樂資料已統一合併，同義詞不再拆開灌次數。';
  box.innerHTML=data.slice(0,30).map((x,i)=>`<details style="border:1px solid var(--line);border-radius:12px;padding:10px 12px;margin:7px 0"><summary style="cursor:pointer;font-weight:850">${i+1}. ${esc(x.term)} <small style="color:var(--muted)">${mode==='rising'?`｜近3年 ${x.recentYearN} 年｜${x.recentExamN} 卷`:`｜${x.yearN} 年｜${x.examN} 卷`}｜最近 ${x.latest} 年</small></summary><div style="padding-top:8px;font-size:13px;line-height:1.7"><div style="font-weight:800;margin-bottom:5px">${badge(x,mode)||'持續蒐集'}</div>${x.variants.length?`<div style="color:var(--muted);margin-bottom:5px">同義／相關寫法：${x.variants.slice(0,8).map(esc).join('、')}</div>`:''}${[...x.exams.values()].sort((a,b)=>Number(b.year)-Number(a.year)).map(e=>`<div><b>${esc(e.year)}｜${esc(e.level)}</b>｜${e.url?`<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.exam)}</a>`:esc(e.exam)}</div>`).join('')}</div></details>`).join('')||'<p class="muted">尚無資料。</p>';
 }
 function mount(){const home=document.getElementById('homeView');if(!home||document.getElementById('preciseTermRadar'))return;const s=document.createElement('section');s.id='preciseTermRadar';s.className='card section-card';s.innerHTML=`<div class="section-title"><div><span class="eyebrow">106～115 阿摩考古題人工精標</span><h3>📡 教甄精準考點雷達</h3></div></div><div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:8px"><button class="ghost small trend active" data-mode="high">🔥 十年高頻必讀</button><button class="ghost small trend" data-mode="rising">🚀 近三年快速升溫</button><button class="ghost small trend" data-mode="rare">🧊 冷門高鑑別</button></div><p id="preciseTermMeta" class="muted"></p><div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:10px"><button class="ghost small ptr active" data-l="">上岸總榜</button><button class="ghost small ptr" data-l="國中音樂">🎵 國中音樂</button><button class="ghost small ptr" data-l="高中音樂">🎓 高中音樂</button><button class="ghost small ptr" data-l="教育專業">📚 教育專業</button></div><div id="preciseTermList"></div>`;home.appendChild(s);let level='',mode='high';s.querySelectorAll('.ptr').forEach(b=>b.onclick=()=>{level=b.dataset.l;s.querySelectorAll('.ptr').forEach(x=>x.classList.toggle('active',x===b));render(level,mode)});s.querySelectorAll('.trend').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;s.querySelectorAll('.trend').forEach(x=>x.classList.toggle('active',x===b));render(level,mode)});render(level,mode)}
 function loadScript(src,next){const s=document.createElement('script');s.src=src;s.onload=()=>next&&next();document.body.appendChild(s)}
 function loadDetailedAnswers(){if(window.__DETAIL_ANSWERS_LOADING__)return;window.__DETAIL_ANSWERS_LOADING__=true;loadScript('detailed_answers.js?v=20260818d',()=>loadScript('detailed_answer_ui.js?v=20260818d'));}
 window.addEventListener('DOMContentLoaded',()=>{setTimeout(mount,300);setTimeout(loadDetailedAnswers,50)});window.PreciseTermRadar={build,rawRows};
})();