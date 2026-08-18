(()=>{
 const KEY='musicTeacherExamStatsV1';
 const qs=()=>window.MusicTeacherExam?.questions || (Array.isArray(window.LOCAL_QUESTIONS)?window.LOCAL_QUESTIONS:[]);
 const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{attempts:{}}}catch{return {attempts:{}}}};
 const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
 const uniq=arr=>[...new Map(arr.map(q=>[q.id||q.question,q])).values()];

 function bucket(level){level=Number(level)||1;return level<=2?'basic':level===3?'compare':'advanced'}
 function report(){
  const attempts=load().attempts||{},map=new Map();
  qs().forEach(q=>{
   const c=q.canonical_concept||q.topic||'其他',b=bucket(q.discrimination_level);
   if(!map.has(c))map.set(c,{concept:c,pool:{basic:[],compare:[],advanced:[]},done:{basic:0,compare:0,advanced:0},correct:{basic:0,compare:0,advanced:0}});
   const r=map.get(c);r.pool[b].push(q);
   const a=attempts[q.id]||{};r.done[b]+=a.total||0;r.correct[b]+=a.correct||0;
  });
  return [...map.values()].map(r=>{
   const acc=b=>r.done[b]?Math.round(r.correct[b]/r.done[b]*100):null;
   const basic=acc('basic'),compare=acc('compare'),advanced=acc('advanced');
   let next='basic',reason='先建立基本辨識與人物／作品關聯';
   if(r.done.basic>=3 && basic>=80 && r.pool.compare.length){next='compare';reason='基礎已穩定，進入比較與辨析';}
   if((!r.pool.compare.length || (r.done.compare>=2 && compare>=75)) && r.done.basic>=3 && basic>=80 && r.pool.advanced.length){next='advanced';reason='比較判斷已具基礎，開始跨概念與應用';}
   if(next==='advanced' && r.done.advanced>=3 && advanced>=75){reason='進階表現不錯，持續用高鑑別題保持輸出';}
   const targetAcc=next==='basic'?basic:next==='compare'?compare:advanced;
   const score=(targetAcc==null?45:100-targetAcc)+(next==='advanced'?20:next==='compare'?10:0)+(r.pool[next].length?10:0);
   return {...r,basic,compare,advanced,next,reason,score};
  }).filter(r=>r.pool[r.next].length).sort((a,b)=>b.score-a.score);
 }
 function start(r){
  let pool=uniq(r.pool[r.next]);
  if(!pool.length)return;
  if(window.MusicTeacherExam?.startCustomQuiz)window.MusicTeacherExam.startCustomQuiz(pool,`${r.concept}｜自動進階`,Math.min(10,pool.length));
  else alert('題組功能還在載入，請重新整理後再試一次。');
 }
 function ensureStyle(){if(document.getElementById('mtMasteryStyle'))return;const s=document.createElement('style');s.id='mtMasteryStyle';s.textContent=`
  .mt-mastery{padding:24px;margin-bottom:18px}.mt-mastery h3{margin:4px 0 0}.mt-mastery-note{color:var(--muted);font-size:13px;line-height:1.6;margin:9px 0 13px}.mt-mastery-list{display:grid;gap:9px}.mt-mastery-row{display:grid;grid-template-columns:minmax(145px,1fr) auto auto;gap:10px;align-items:center;border:1px solid var(--line);border-radius:13px;padding:11px 12px}.mt-mastery-row b{display:block;font-size:13px}.mt-mastery-row small{color:var(--muted);line-height:1.45}.mt-stage{padding:5px 8px;border-radius:999px;background:var(--soft);font-size:11px;font-weight:850;white-space:nowrap}.mt-mastery-row button{border:0;background:var(--brand);color:white;border-radius:9px;padding:8px 10px;font-weight:800;cursor:pointer}.mt-acc{font-variant-numeric:tabular-nums}.mt-mastery-all{width:100%;margin-top:10px;border:1px solid var(--line);background:var(--panel);color:inherit;border-radius:11px;padding:10px;font-weight:800;cursor:pointer}@media(max-width:650px){.mt-mastery-row{grid-template-columns:1fr auto}.mt-mastery-row button{grid-column:1/-1}}
 `;document.head.appendChild(s)}
 function render(){
  const box=document.getElementById('mtMasteryList');if(!box)return;const rows=report().slice(0,6);
  box.innerHTML=rows.length?rows.map((r,i)=>{const label=r.next==='basic'?'Lv1–2 基礎':r.next==='compare'?'Lv3 比較':'Lv4–5 進階';const acc=r.next==='basic'?r.basic:r.next==='compare'?r.compare:r.advanced;return `<div class="mt-mastery-row" data-index="${i}"><div><b>${esc(r.concept)}</b><small>${esc(r.reason)}${acc==null?'':' · 目前 '+acc+'%'}</small></div><span class="mt-stage">${label}</span><button>開始</button></div>`}).join(''):'<p class="muted">目前題庫資料正在整理，稍後重新整理即可看到推薦。</p>';
  box.dataset.snapshot=Date.now();window.__MT_MASTERY_ROWS=rows;
 }
 function mount(){
  const home=document.getElementById('homeView');if(!home||document.getElementById('mtMastery'))return;ensureStyle();
  const card=document.createElement('section');card.id='mtMastery';card.className='card mt-mastery';card.innerHTML=`<span class="eyebrow">依你的表現，自動決定下一階</span><h3>下一步該練什麼？</h3><p class="mt-mastery-note">同一考點不必永遠從簡單題重來。當基礎正確率穩定後，系統會把你往比較題、整合題與應用題推進；答錯多的概念則優先回補。</p><div id="mtMasteryList" class="mt-mastery-list"></div><button id="mtMasteryRefresh" class="mt-mastery-all">↻ 依最新作答重新計算</button>`;
  const ladder=document.getElementById('mtDifficultyLadder');if(ladder?.parentNode)ladder.parentNode.insertBefore(card,ladder);else home.appendChild(card);render();
  card.addEventListener('click',e=>{if(e.target.id==='mtMasteryRefresh'){render();return;}const row=e.target.closest?.('.mt-mastery-row');if(!row||!e.target.closest('button'))return;const r=(window.__MT_MASTERY_ROWS||[])[Number(row.dataset.index)];if(r)start(r);});
 }
 const boot=()=>setTimeout(mount,240);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
 window.addEventListener('musicTeacherUnknown',()=>setTimeout(render,50));
})();