(()=>{
  if(window.__MUSIC_EXAM_PERFORMANCE_LOADER_V1__)return;
  window.__MUSIC_EXAM_PERFORMANCE_LOADER_V1__=true;

  const VERSION='20260820a';
  const groupState=new Map();
  const GROUPS={
    shell:[
      'home-layering.js?v=20260819c',
      'mobile-home.js?v=20260819a',
      'score-hierarchy.js?v=20260819a'
    ],
    today:[
      'daily-mission.js?v=20260819b'
    ],
    learning:[
      'ability-map.js?v=20260819b',
      'learning-history.js?v=20260819a',
      'weekly-summary.js?v=20260819b',
      'weekly-review.js?v=20260819c'
    ],
    written:[
      'term_content_enrichment_115.js?v=20260820',
      'term-learning.js?v=20260818d',
      'term-ux-fix.js?v=20260819a',
      'bad-question.js?v=20260818a',
      'nonchoice-center.js?v=20260819b',
      'nonchoice-progress.js?v=20260819b',
      'trial-diagnosis.js?v=20260819a',
      'term-mastery-ladder.js?v=20260819d',
      'term-answer-structure.js?v=20260819a',
      'term-points-mode.js?v=20260819a',
      'term-next-action.js?v=20260819a',
      'term-readiness-summary.js?v=20260819b',
      'term-daily-plan.js?v=20260819f',
      'term-daily-runner.js?v=20260819f',
      'term-daily-resume.js?v=20260819d'
    ],
    latest:[
      'latest_loader_bootstrap.js?v='+VERSION
    ]
  };

  const baseOf=src=>src.split('?')[0];
  const existing=()=>new Map([...document.scripts].map(s=>[baseOf(s.getAttribute('src')||''),s]));
  const idle=()=>new Promise(resolve=>{
    if('requestIdleCallback'in window){
      requestIdleCallback(()=>resolve(),{timeout:700});
    }else{
      setTimeout(resolve,24);
    }
  });

  function loadScript(src){
    const base=baseOf(src),found=existing().get(base);
    if(found)return Promise.resolve();
    return new Promise(resolve=>{
      const s=document.createElement('script');
      s.src=src;
      s.async=true;
      s.dataset.performanceLazy='1';
      s.onload=s.onerror=()=>resolve();
      document.body.appendChild(s);
    });
  }

  function loadGroup(name){
    if(groupState.has(name))return groupState.get(name);
    const files=GROUPS[name]||[];
    const job=(async()=>{
      for(const src of files){
        await idle();
        await loadScript(src);
      }
      window.dispatchEvent(new CustomEvent('musicExamLazyGroupReady',{detail:{name}}));
    })();
    groupState.set(name,job);
    return job;
  }

  function prefetchFromTarget(target){
    const el=target?.closest?.('button,[data-g]');
    if(!el)return;
    const id=el.id||'';
    const group=el.dataset?.g||'';
    if(group==='learning')loadGroup('learning');
    if(group==='written'||id==='termBtn'||id==='essayBtn'||id==='showTermBtn'||id==='showHintBtn')loadGroup('written');
    if(group==='practice'||group==='radar')loadGroup('latest');
  }

  // 先讓首屏完成繪製，再逐步補上首頁必要的視覺整理與今日任務。
  const afterFirstPaint=()=>{
    loadGroup('shell');
    loadGroup('today');
  };
  if('requestIdleCallback'in window)requestIdleCallback(afterFirstPaint,{timeout:900});
  else setTimeout(afterFirstPaint,120);

  // 使用者即將操作某區時，優先載入該區；不再一開站就把所有模組塞進主執行緒。
  document.addEventListener('pointerover',e=>prefetchFromTarget(e.target),{passive:true,capture:true});
  document.addEventListener('pointerdown',e=>prefetchFromTarget(e.target),{passive:true,capture:true});
  document.addEventListener('click',e=>prefetchFromTarget(e.target),{passive:true,capture:true});

  // 完整歷屆補充與進階模組仍會在背景補齊，但改成真正的閒置工作。
  const queueLatest=()=>loadGroup('latest');
  if('requestIdleCallback'in window)requestIdleCallback(queueLatest,{timeout:6500});
  else setTimeout(queueLatest,4500);

  window.MusicExamPerformanceLoader={loadGroup,state:groupState};
})();
