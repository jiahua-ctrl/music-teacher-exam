(()=>{
  if(window.__DETAILED_ANSWER_UI__)return;window.__DETAILED_ANSWER_UI__=true;
  function loadScript(src,flag){const base=src.split('?')[0];if([...document.scripts].some(s=>(s.getAttribute('src')||'').split('?')[0]===base))return;const s=document.createElement('script');s.src=src;s.dataset[flag.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]='1';document.body.appendChild(s)}
  function loadBootTools(){
    loadScript('navigation_state.js?v=20260818aa','navigation-state');
    loadScript('home_organizer.js?v=20260818aa','home-organizer');
    loadScript('latest_loader_bootstrap.js?v=20260818aa','latest-loader');
    loadScript('term-learning.js?v=20260818d','term-learning');
    loadScript('term-ux-fix.js?v=20260819a','term-ux-fix');
    loadScript('bad-question.js?v=20260818a','bad-question');
    loadScript('nonchoice-center.js?v=20260819b','nonchoice-center');
    loadScript('nonchoice-progress.js?v=20260819b','nonchoice-progress');
    loadScript('trial-diagnosis.js?v=20260819a','trial-diagnosis');
    loadScript('ability-map.js?v=20260819b','ability-map');
    loadScript('daily-mission.js?v=20260819b','daily-mission');
    loadScript('learning-history.js?v=20260819a','learning-history');
    loadScript('weekly-summary.js?v=20260819a','weekly-summary');
    loadScript('weekly-review.js?v=20260819a','weekly-review');
    loadScript('home-layering.js?v=20260819b','home-layering');
    loadScript('mobile-home.js?v=20260819a','mobile-home');
    loadScript('score-hierarchy.js?v=20260819a','score-hierarchy');
    loadScript('term-mastery-ladder.js?v=20260819a','term-mastery-ladder');
  }
  loadBootTools();
  function mount(){
    const byId=id=>document.getElementById(id);
    const esc=s=>String(s||'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt',"'":'&#39;','\"':'&quot;'}[c]));
    const para=s=>esc(s).replace(/\n/g,'<br>');
    const essayBtn=byId('showHintBtn');
    if(essayBtn&&!essayBtn.dataset.detailedAnswerReady){essayBtn.dataset.detailedAnswerReady='1';essayBtn.textContent='📚 看答題架構＋詳細擬答';essayBtn.addEventListener('click',()=>{const q=byId('essayQuestion')?.textContent||'';const item=(window.ESSAY_PROMPTS||[]).find(x=>x.question===q);if(!item)return;const answer=item.model_answer||'此題詳細擬答整理中。';byId('essayHint').innerHTML=`<div class="feedback-title">💡 答題架構</div><p>${para(item.hint||'')}</p><div class="feedback-title">📝 詳細擬答</div><p>${para(answer)}</p>`;byId('essayHint').classList.remove('hidden')})}
  }
  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();