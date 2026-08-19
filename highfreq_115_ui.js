// 115 跨考區高頻考點｜首頁介面
(function(){
  if(window.__HF115_UI_LOADED__) return;
  window.__HF115_UI_LOADED__=true;

  function loadData(cb){
    if(Array.isArray(window.EXAM_HIGH_FREQUENCY)&&window.EXAM_HIGH_FREQUENCY.length){cb();return;}
    if(!document.querySelector('script[data-hf115-entry]')){
      var s=document.createElement('script');
      s.src='highfreq_115_cross_exam_batch1.js?v=20260819';
      s.dataset.hf115Entry='1';
      s.onload=function(){waitForData(cb,0)};
      document.head.appendChild(s);
    }else waitForData(cb,0);
  }
  function waitForData(cb,n){
    if(Array.isArray(window.EXAM_HIGH_FREQUENCY)&&window.EXAM_HIGH_FREQUENCY.length){setTimeout(cb,80);return;}
    if(n>30)return;
    setTimeout(function(){waitForData(cb,n+1)},100);
  }
  function esc(s){return String(s==null?'':s).replace(/[&<>\"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]});}
  function ensureStyles(){
    if(document.getElementById('hf115Style'))return;
    var st=document.createElement('style');st.id='hf115Style';st.textContent=`
      .hf115-wrap{display:grid;gap:14px}.hf115-actions{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}.hf115-btn{border:1px solid rgba(127,127,127,.2);border-radius:16px;padding:14px;text-align:left;background:var(--card,#fff);cursor:pointer}.hf115-btn b{display:block;font-size:1rem;margin-bottom:5px}.hf115-btn small{display:block;opacity:.72;line-height:1.45}.hf115-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px}.hf115-topic{border:1px solid rgba(127,127,127,.18);border-radius:16px;padding:14px;background:rgba(127,127,127,.04)}.hf115-rank{font-size:.78rem;opacity:.68}.hf115-badges{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.hf115-badge{font-size:.72rem;border-radius:999px;padding:4px 8px;background:rgba(107,79,163,.12)}.hf115-topic h4{margin:5px 0 8px}.hf115-topic p{margin:7px 0;line-height:1.55}.hf115-detail{display:none;margin-top:10px;padding-top:10px;border-top:1px dashed rgba(127,127,127,.25)}.hf115-topic.open .hf115-detail{display:block}.hf115-plan{display:none;margin-top:12px}.hf115-plan.open{display:block}.hf115-step{display:grid;grid-template-columns:72px 1fr;gap:10px;padding:10px 0;border-bottom:1px solid rgba(127,127,127,.12)}.hf115-step:last-child{border-bottom:0}.hf115-time{font-weight:700}.hf115-note{font-size:.9rem;opacity:.78}.dark .hf115-btn,.dark .hf115-topic{background:rgba(255,255,255,.04)}
    `;document.head.appendChild(st);
  }
  function render(){
    var home=document.getElementById('homeView');if(!home||document.getElementById('hf115Section'))return;
    ensureStyles();
    var data=(window.EXAM_HIGH_FREQUENCY||[]).slice().sort(function(a,b){return (a.rank||99)-(b.rank||99)});
    var sec=document.createElement('section');sec.id='hf115Section';sec.className='card section-card';
    sec.innerHTML=`<div class="section-title"><div><span class="eyebrow">115跨考區命題趨勢</span><h3>🔥 高頻衝刺</h3></div></div>
      <p class="muted">不是再多讀一份題庫，而是先抓「跨考區重複＋容易混淆＋能寫成名詞／申論」的核心。</p>
      <div class="hf115-wrap">
        <div class="hf115-actions">
          <button class="hf115-btn" id="hf115TopBtn"><b>🔥 先看必讀高頻</b><small>依★★★★★、★★★★☆與跨考區重複排序</small></button>
          <button class="hf115-btn" id="hf115SprintBtn"><b>⏱️ 考前只剩30分鐘</b><small>錯題急救 → 知識網 → 易混淆 → 名詞輸出</small></button>
        </div>
        <div id="hf115Plan" class="hf115-plan"></div>
        <div id="hf115Grid" class="hf115-grid"></div>
      </div>`;
    var weakness=home.querySelector('#weaknessList')?.closest('.section-card');
    if(weakness)home.insertBefore(sec,weakness);else home.appendChild(sec);

    var grid=sec.querySelector('#hf115Grid');
    grid.innerHTML=data.slice(0,12).map(function(x){
      var badges=(x.badges&&x.badges.length?x.badges:[x.level||'']).filter(Boolean);
      return `<article class="hf115-topic" tabindex="0"><div class="hf115-rank">#${esc(x.rank)} ${esc(x.level||'')}</div><h4>${esc(x.topic)}</h4><div class="hf115-badges">${badges.map(function(b){return `<span class="hf115-badge">${esc(b)}</span>`}).join('')}</div><p class="hf115-note">${esc((x.mustKnow||[]).slice(0,4).join(' → '))}</p><div class="hf115-detail"><p><b>👹 易錯：</b>${esc(x.trap||'')}</p><p><b>✍️ 擬答骨架：</b>${esc(x.answerFrame||'')}</p><p class="hf115-note"><b>出現：</b>${esc((x.appears||[]).join('、'))}</p></div></article>`;
    }).join('');
    grid.querySelectorAll('.hf115-topic').forEach(function(card){var toggle=function(){card.classList.toggle('open')};card.addEventListener('click',toggle);card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}})});

    var plan=sec.querySelector('#hf115Plan');
    sec.querySelector('#hf115SprintBtn').addEventListener('click',function(){
      var cfg=window.EXAM_SPRINT_CONFIG||{};var steps=cfg.thirtyMinutePlan||[];
      plan.innerHTML=`<div class="feedback-title">⏱️ ${esc(cfg.title||'30分鐘衝刺')}</div><p class="muted">${esc(cfg.description||'')}</p>${steps.map(function(s){return `<div class="hf115-step"><div class="hf115-time">${esc(s.minutes)}</div><div><b>${esc(s.task)}</b><div class="hf115-note">${esc(s.detail)}</div></div></div>`}).join('')}`;
      plan.classList.toggle('open');
    });
    sec.querySelector('#hf115TopBtn').addEventListener('click',function(){sec.querySelector('#hf115Grid').scrollIntoView({behavior:'smooth',block:'start'})});
  }
  function boot(){loadData(render)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
