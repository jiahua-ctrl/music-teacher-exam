(()=>{
  const getQuestions=()=>Array.isArray(window.LOCAL_QUESTIONS)?[...new Map(window.LOCAL_QUESTIONS.filter(Boolean).map(q=>[q.id||q.question,q])).values()]:[];
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=s=>String(s||'').trim().replace(/台灣/g,'臺灣').replace(/\s+/g,' ');
  const generic=new Set(['國中音樂','高中音樂','教育專業','音樂','理解','基礎','進階','高階','困難','自編練習','官方原題考點改寫','公開題庫考點改寫']);
  const alias={
    'pansori':'Pansori／盤索里','盤索里':'Pansori／盤索里','khoomei':'Khoomei／呼麥','khöömei':'Khoomei／呼麥','呼麥':'Khoomei／呼麥',
    'neapolitan':'拿坡里六和弦','neapolitan sixth':'拿坡里六和弦','十二平均律':'十二平均律／新法密率','新法密率':'十二平均律／新法密率',
    'gordon':'Gordon／Audiation','audiation':'Gordon／Audiation','kodály':'Kodály','kodaly':'Kodály'
  };
  function canonical(x){
    const t=norm(x).replace(/^#/, '');
    const low=t.toLowerCase();
    return alias[low]||alias[t]||t;
  }
  function keywords(q){
    const out=new Set();
    const raw=String(q.tags||'').split(/[;,；、|]/).map(canonical).filter(Boolean);
    raw.forEach(k=>{if(k.length>=2&&!generic.has(k)&&k!==q.subject)out.add(k)});
    const topic=canonical(q.topic||'');
    if(topic&&!generic.has(topic)&&topic!==q.subject)out.add(topic);
    return [...out];
  }
  function sourceLabel(q){return norm(q.exam||q.source_title||q.source_type||'未標示來源')}
  function build(subject=''){
    const qs=getQuestions().filter(q=>!subject||q.subject===subject);
    const map=new Map();
    qs.forEach(q=>{
      const src=sourceLabel(q),year=norm(q.year||'未標年份');
      keywords(q).forEach(k=>{
        if(!map.has(k))map.set(k,{key:k,count:0,years:new Set(),sources:new Set(),subjects:new Set(),items:[]});
        const x=map.get(k);x.count++;x.years.add(year);x.sources.add(src);x.subjects.add(q.subject||'');x.items.push(q);
      });
    });
    return [...map.values()].map(x=>{
      const yearN=[...x.years].filter(y=>y!=='未標年份').length,sourceN=x.sources.size;
      const score=x.count + yearN*3 + sourceN*2;
      const tier=yearN>=3||sourceN>=4?'A':yearN>=2||sourceN>=3?'B':'C';
      return {...x,yearN,sourceN,score,tier};
    }).filter(x=>x.count>=2||x.yearN>=2||x.sourceN>=2).sort((a,b)=>b.score-a.score||b.yearN-a.yearN||b.sourceN-a.sourceN||b.count-a.count);
  }
  function styles(){
    if(document.getElementById('freqStyles'))return;
    const s=document.createElement('style');s.id='freqStyles';s.textContent=`
      .freq-card{padding:24px;margin-bottom:18px}.freq-head{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}.freq-controls{display:flex;gap:7px;flex-wrap:wrap;margin:14px 0}.freq-filter{border:1px solid var(--line);background:var(--panel);color:inherit;border-radius:999px;padding:8px 11px;font-weight:800;cursor:pointer}.freq-filter.active{background:var(--brand);color:white;border-color:var(--brand)}
      .freq-list{display:grid;gap:9px}.freq-row{border:1px solid var(--line);border-radius:13px;overflow:hidden}.freq-main{width:100%;border:0;background:var(--panel);color:inherit;padding:13px 14px;display:grid;grid-template-columns:minmax(130px,1.3fr) .55fr .65fr .65fr auto;gap:10px;align-items:center;text-align:left;cursor:pointer}.freq-key{font-weight:900}.freq-num{font-weight:850;text-align:center}.freq-small{font-size:12px;color:var(--muted);text-align:center}.freq-tier{font-size:11px;font-weight:900;padding:4px 7px;border-radius:999px;background:var(--soft);white-space:nowrap}.freq-detail{padding:13px 15px;background:var(--soft);border-top:1px solid var(--line);line-height:1.65}.freq-source{padding:7px 0;border-bottom:1px dashed var(--line)}.freq-source:last-child{border-bottom:0}.freq-note{font-size:12px;color:var(--muted);line-height:1.6}.freq-empty{color:var(--muted)}
      @media(max-width:720px){.freq-head{display:block}.freq-main{grid-template-columns:1fr auto auto}.freq-main .freq-hide-mobile{display:none}.freq-small{text-align:right}}
    `;document.head.appendChild(s);
  }
  function render(subject=''){
    const box=document.getElementById('freqList');if(!box)return;
    const data=build(subject).slice(0,20);
    const total=getQuestions().filter(q=>!subject||q.subject===subject).length;
    const meta=document.getElementById('freqMeta');
    if(meta)meta.textContent=`分析 ${total} 題；排名優先考慮「跨年份＋跨來源」，避免單一考卷大量重複造成假高頻。`;
    if(!data.length){box.innerHTML='<p class="freq-empty">目前資料量還不足以形成高頻排名。</p>';return}
    box.innerHTML=data.map((x,i)=>{
      const years=[...x.years].sort((a,b)=>Number(b)-Number(a)).join('、');
      const grouped=new Map();x.items.forEach(q=>{const label=`${q.year||'—'}｜${sourceLabel(q)}`;if(!grouped.has(label))grouped.set(label,[]);grouped.get(label).push(q)});
      const sources=[...grouped.entries()].map(([label,items])=>`<div class="freq-source"><b>${esc(label)}</b><div class="freq-note">${items.slice(0,3).map(q=>`• ${esc(q.question)}`).join('<br>')}${items.length>3?`<br>…另 ${items.length-3} 題`:''}</div></div>`).join('');
      const tierText=x.tier==='A'?'🔥 跨年高頻':x.tier==='B'?'⭐ 多來源':'↻ 重複考點';
      return `<div class="freq-row"><button class="freq-main" data-freq="${i}"><span class="freq-key">${i+1}. ${esc(x.key)}</span><span><div class="freq-num">${x.count}</div><div class="freq-small">題</div></span><span class="freq-hide-mobile"><div class="freq-num">${x.yearN}</div><div class="freq-small">年份</div></span><span class="freq-hide-mobile"><div class="freq-num">${x.sourceN}</div><div class="freq-small">來源</div></span><span class="freq-tier">${tierText}</span></button><div class="freq-detail" id="freqDetail${i}" hidden><div><b>出現年份：</b>${esc(years||'未標示')}</div><div style="margin-top:7px"><b>出處與題目：</b></div>${sources}</div></div>`;
    }).join('');
    box.querySelectorAll('[data-freq]').forEach(btn=>btn.addEventListener('click',()=>{const d=document.getElementById('freqDetail'+btn.dataset.freq);if(d)d.hidden=!d.hidden}));
  }
  function mount(){
    if(document.getElementById('freqRadar'))return;
    styles();
    const home=document.getElementById('homeView');if(!home)return;
    const section=document.createElement('section');section.id='freqRadar';section.className='card freq-card';
    section.innerHTML=`<div class="freq-head"><div><span class="eyebrow">從考古題找真正值得讀的</span><h3 style="margin:5px 0 0">📊 高頻考點雷達</h3></div><span class="freq-tier">跨年 × 跨來源</span></div><p id="freqMeta" class="freq-note"></p><div class="freq-controls"><button class="freq-filter active" data-fsubject="">全部</button><button class="freq-filter" data-fsubject="國中音樂">國中音樂</button><button class="freq-filter" data-fsubject="高中音樂">高中音樂</button><button class="freq-filter" data-fsubject="教育專業">教育專業</button></div><div id="freqList" class="freq-list"></div>`;
    const sourceIndex=document.getElementById('sourceIndex');
    const anchor=sourceIndex?.closest('section.card')||home.querySelector('.section-card:nth-last-of-type(2)')||home.lastElementChild;
    if(anchor)anchor.insertAdjacentElement('afterend',section);else home.appendChild(section);
    section.querySelectorAll('[data-fsubject]').forEach(b=>b.addEventListener('click',()=>{section.querySelectorAll('[data-fsubject]').forEach(x=>x.classList.toggle('active',x===b));render(b.dataset.fsubject)}));
    render('');
  }
  window.addEventListener('DOMContentLoaded',()=>setTimeout(mount,220));
  window.MusicTeacherFrequency={build,keywords};
})();