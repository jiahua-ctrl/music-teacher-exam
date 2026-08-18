(()=>{
  const questions=()=>window.MusicTeacherExam?.questions || (Array.isArray(window.LOCAL_QUESTIONS)?window.LOCAL_QUESTIONS:[]);
  const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const uniq=arr=>[...new Map(arr.map(q=>[q.id||q.question,q])).values()];
  const stats=()=>{try{return JSON.parse(localStorage.getItem('musicTeacherExamStatsV1'))||{}}catch{return {}}};

  function start(pool,label,limit=10){
    pool=uniq(pool);
    if(!pool.length){alert('目前這個難度層級還沒有足夠題目，請先換另一個層級。');return;}
    if(window.MusicTeacherExam?.startCustomQuiz){
      window.MusicTeacherExam.startCustomQuiz(pool,label,Math.min(limit,pool.length));
    }else alert('題組功能還在載入，請重新整理後再試一次。');
  }

  function conceptRows(){
    const map=new Map();
    questions().forEach(q=>{
      const c=q.canonical_concept||q.topic||'其他';
      if(!map.has(c))map.set(c,{concept:c,total:0,lv:[0,0,0,0,0,0],wrong:0});
      const row=map.get(c);row.total++;
      const l=Math.max(1,Math.min(5,Number(q.discrimination_level)||1));row.lv[l]++;
    });
    const wrong=new Set(stats().wrong||[]);
    questions().forEach(q=>{if(wrong.has(q.id)){const c=q.canonical_concept||q.topic||'其他';const row=map.get(c);if(row)row.wrong++;}});
    return [...map.values()].sort((a,b)=>b.wrong-a.wrong || (b.lv[4]+b.lv[5])-(a.lv[4]+a.lv[5]) || b.total-a.total);
  }

  function ensureStyle(){
    if(document.getElementById('mtLadderStyle'))return;
    const s=document.createElement('style');s.id='mtLadderStyle';s.textContent=`
      .mt-ladder{padding:24px;margin-bottom:18px}.mt-ladder h3{margin:4px 0 0}.mt-ladder-note{margin:9px 0 14px;color:var(--muted);font-size:13px;line-height:1.65}
      .mt-ladder-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.mt-ladder-tabs button{border:1px solid var(--line);background:var(--panel);color:inherit;border-radius:999px;padding:7px 11px;font-weight:800;cursor:pointer}.mt-ladder-tabs button.active{background:var(--brand);color:#fff;border-color:var(--brand)}
      .mt-ladder-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px}.mt-concept-card{border:1px solid var(--line);border-radius:14px;padding:13px;background:var(--panel)}.mt-concept-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.mt-concept-head b{line-height:1.35}.mt-concept-head small{color:var(--muted);white-space:nowrap}
      .mt-levels{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin:10px 0 8px}.mt-lv{border-radius:8px;background:var(--soft);padding:6px 2px;text-align:center;font-size:11px}.mt-lv strong{display:block;font-size:13px}.mt-concept-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.mt-concept-actions button{border:1px solid var(--line);background:var(--soft);color:inherit;border-radius:9px;padding:7px 5px;font-size:11px;font-weight:800;cursor:pointer}.mt-concept-actions button:hover{border-color:var(--brand)}
      .mt-ladder-summary{padding:11px 13px;border-radius:12px;background:var(--soft);font-size:13px;line-height:1.55;margin-bottom:10px}
      @media(max-width:640px){.mt-concept-actions{grid-template-columns:1fr}.mt-levels{gap:3px}}
    `;document.head.appendChild(s);
  }

  let filter='priority';
  function visibleRows(){
    const rows=conceptRows();
    if(filter==='advanced')return rows.filter(r=>r.lv[4]+r.lv[5]>0).sort((a,b)=>(b.lv[4]+b.lv[5])-(a.lv[4]+a.lv[5])||b.total-a.total);
    if(filter==='wrong')return rows.filter(r=>r.wrong>0).sort((a,b)=>b.wrong-a.wrong||b.total-a.total);
    if(filter==='all')return rows.sort((a,b)=>b.total-a.total);
    return rows.slice(0,12);
  }

  function renderGrid(){
    const grid=document.getElementById('mtLadderGrid');if(!grid)return;
    const rows=visibleRows();
    grid.innerHTML=rows.length?rows.map(r=>`<div class="mt-concept-card" data-concept="${esc(r.concept)}"><div class="mt-concept-head"><b>${esc(r.concept)}</b><small>${r.total}題${r.wrong?` · 錯${r.wrong}`:''}</small></div><div class="mt-levels">${[1,2,3,4,5].map(l=>`<div class="mt-lv"><span>Lv.${l}</span><strong>${r.lv[l]}</strong></div>`).join('')}</div><div class="mt-concept-actions"><button data-range="basic">基礎 Lv1–2</button><button data-range="compare">比較 Lv3</button><button data-range="advanced">進階 Lv4–5</button></div></div>`).join(''):'<p class="muted">這個分類目前還沒有可顯示的題目。</p>';
  }

  function mount(){
    const home=document.getElementById('homeView');if(!home||document.getElementById('mtDifficultyLadder'))return;
    ensureStyle();
    const rows=conceptRows(),high=rows.reduce((n,r)=>n+r.lv[4]+r.lv[5],0),wrong=rows.reduce((n,r)=>n+r.wrong,0);
    const card=document.createElement('section');card.id='mtDifficultyLadder';card.className='card mt-ladder';
    card.innerHTML=`<span class="eyebrow">同一考點，往更難一層</span><h3>概念難度階梯</h3><p class="mt-ladder-note">不再只是一直做相似的辨識題。系統把同一核心考點拆成 Lv.1 基礎辨識、Lv.2 人物／作品關聯、Lv.3 比較判斷、Lv.4 跨概念整合、Lv.5 譜例／情境／應用。</p><div class="mt-ladder-summary">目前共整理 ${rows.length} 個核心考點；Lv.4–5 進階題 ${high} 題${wrong?`；你的錯題目前分布於 ${rows.filter(r=>r.wrong).length} 個核心考點。`:''}</div><div class="mt-ladder-tabs"><button class="active" data-filter="priority">🎯 優先</button><button data-filter="wrong">❌ 我的錯題</button><button data-filter="advanced">💎 進階題多</button><button data-filter="all">全部考點</button></div><div id="mtLadderGrid" class="mt-ladder-grid"></div>`;
    const anchor=document.getElementById('mtHighSchoolCenter')||document.getElementById('mtWeakTraining')||home.querySelector('.section-card');
    if(anchor?.parentNode)anchor.parentNode.insertBefore(card,anchor.nextSibling);else home.appendChild(card);
    renderGrid();

    card.addEventListener('click',e=>{
      const tab=e.target.closest?.('[data-filter]');
      if(tab){filter=tab.dataset.filter;card.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===tab));renderGrid();return;}
      const btn=e.target.closest?.('[data-range]');if(!btn)return;
      const concept=btn.closest('.mt-concept-card')?.dataset.concept;if(!concept)return;
      let pool=questions().filter(q=>(q.canonical_concept||q.topic||'其他')===concept);
      const range=btn.dataset.range;
      if(range==='basic')pool=pool.filter(q=>(Number(q.discrimination_level)||1)<=2);
      if(range==='compare')pool=pool.filter(q=>(Number(q.discrimination_level)||1)===3);
      if(range==='advanced')pool=pool.filter(q=>(Number(q.discrimination_level)||1)>=4);
      const label=`${concept}｜${range==='basic'?'基礎 Lv1–2':range==='compare'?'比較 Lv3':'進階 Lv4–5'}`;
      start(pool,label,10);
    });
  }

  function boot(){setTimeout(mount,180);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.addEventListener('musicTeacherCanonicalReady',()=>setTimeout(()=>{if(!document.getElementById('mtDifficultyLadder'))mount();else renderGrid();},0));
})();