(()=>{
  if(window.__DETAILED_ANSWER_UI__)return;window.__DETAILED_ANSWER_UI__=true;
  function loadScript(src,flag){const base=src.split('?')[0];if([...document.scripts].some(s=>(s.getAttribute('src')||'').split('?')[0]===base))return;const s=document.createElement('script');s.src=src;s.dataset[flag.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]='1';document.body.appendChild(s)}
  function loadBootTools(){
    loadScript('navigation_state.js?v=20260818aa','navigation-state');
    loadScript('home_organizer.js?v=20260818aa','home-organizer');
    loadScript('latest_loader_bootstrap.js?v=20260818aa','latest-loader');
    loadScript('term-learning.js?v=20260818d','term-learning');
    loadScript('bad-question.js?v=20260818a','bad-question');
    loadScript('nonchoice-center.js?v=20260819a','nonchoice-center');
    loadScript('nonchoice-progress.js?v=20260819b','nonchoice-progress');
    loadScript('trial-diagnosis.js?v=20260819a','trial-diagnosis');
    loadScript('ability-map.js?v=20260819b','ability-map');
    loadScript('daily-mission.js?v=20260819b','daily-mission');
    loadScript('learning-history.js?v=20260819a','learning-history');
    loadScript('weekly-summary.js?v=20260819a','weekly-summary');
    loadScript('weekly-review.js?v=20260819a','weekly-review');
    loadScript('home-layering.js?v=20260819b','home-layering');
    loadScript('mobile-home.js?v=20260819a','mobile-home');
  }
  loadBootTools();
  function mount(){
    const byId=id=>document.getElementById(id);
    const esc=s=>String(s||'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt',"'":'&#39;','\"':'&quot;'}[c]));
    const para=s=>esc(s).replace(/\n/g,'<br>');
    const essayBtn=byId('showHintBtn');
    if(essayBtn&&!essayBtn.dataset.detailedAnswerReady){essayBtn.dataset.detailedAnswerReady='1';essayBtn.textContent='📚 看答題架構＋詳細擬答';essayBtn.addEventListener('click',()=>{const q=byId('essayQuestion')?.textContent||'';const item=(window.ESSAY_PROMPTS||[]).find(x=>x.question===q);if(!item)return;const answer=item.model_answer||'此題詳細擬答整理中。';byId('essayHint').innerHTML=`<div class="feedback-title">💡 答題架構</div><p>${para(item.hint||'')}</p><div class="feedback-title">📝 詳細擬答</div><p>${para(answer)}</p>`;byId('essayHint').classList.remove('hidden')})}
    const termBtn=byId('showTermBtn');
    if(termBtn&&!termBtn.dataset.detailedAnswerReady){termBtn.dataset.detailedAnswerReady='1';termBtn.textContent='📖 看詳細擬答';termBtn.addEventListener('click',()=>{const name=byId('termName')?.textContent||'';const item=(window.TERM_PROMPTS||[]).find(x=>x.term===name);if(!item)return;byId('termAnswer').innerHTML=`<div class="feedback-title">📝 名詞解釋完整擬答</div><p>${para(item.model_answer||item.definition||'')}</p><div class="feedback-title">🎯 考場寫法提醒</div><p>建議順序：一句話定義 → 時代／文化脈絡 → 2～3項核心特徵 → 代表人物、作品或例證。若題目配分較低，可優先保留定義與兩個最具鑑別力的關鍵字。</p>`;byId('termAnswer').classList.remove('hidden')})}
  }
  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();