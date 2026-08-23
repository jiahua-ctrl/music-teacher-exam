(()=>{
  if(window.__MUSIC_EXAM_LEARNING_LAZY_FIX__)return;
  window.__MUSIC_EXAM_LEARNING_LAZY_FIX__=true;

  const loaded=new Set([...document.scripts].map(s=>(s.getAttribute('src')||'').split('?')[0]));
  const groups={
    weak:['weakness_trend.js'],
    progress:['learning_progress.js'],
    mastery:['question_mastery_overview.js','mastery_dashboard.js'],
    priority:['personal_priority.js'],
    notes:['study_notes_library.js']
  };
  const inFlight=new Map();

  function loadOne(src){
    const base=src.split('?')[0];
    if(loaded.has(base)||[...document.scripts].some(s=>(s.getAttribute('src')||'').split('?')[0]===base))return Promise.resolve();
    if(inFlight.has(base))return inFlight.get(base);
    const p=new Promise(resolve=>{
      const s=document.createElement('script');
      s.src=`${src}?v=20260823-learning-fix1`;
      s.async=true;
      s.onload=()=>{loaded.add(base);inFlight.delete(base);resolve()};
      s.onerror=()=>{inFlight.delete(base);resolve()};
      document.body.appendChild(s);
    });
    inFlight.set(base,p);return p;
  }
  async function loadMode(mode){
    for(const src of (groups[mode]||[])){
      await new Promise(r=>setTimeout(r,40));
      await loadOne(src);
    }
    setTimeout(()=>window.HomeCategoryOrganizer?.apply?.(),30);
  }

  // 阻止 performance loader 對「我的學習」一次載入整包 learningUi。
  document.addEventListener('pointerdown',e=>{
    const btn=e.target?.closest?.('#homeCategoryNav [data-g="learning"]');
    if(!btn)return;
    e.stopImmediatePropagation();
  },true);

  // 分項才載入對應模組；預設進入我的學習時只載弱點。
  document.addEventListener('click',e=>{
    const top=e.target?.closest?.('#homeCategoryNav [data-g="learning"]');
    if(top){setTimeout(()=>loadMode('weak'),60);return;}
    const sub=e.target?.closest?.('#learningSubNav [data-v]');
    if(sub)loadMode(sub.dataset.v);
  },true);
})();
