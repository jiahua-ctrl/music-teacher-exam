(()=>{
  if(window.__DETAILED_ANSWER_UI__)return;window.__DETAILED_ANSWER_UI__=true;
  function loadScript(src,flag){
    const base=src.split('?')[0];
    if([...document.scripts].some(s=>(s.getAttribute('src')||'').split('?')[0]===base))return;
    const s=document.createElement('script');
    s.src=src;
    s.dataset[flag.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]='1';
    document.body.appendChild(s);
  }
  // 2.0：首屏只保留導覽與首頁整理；題庫、名詞、申論資料交給分層 lazy loader。
  loadScript('navigation_state.js?v=20260818aa','navigation-state');
  loadScript('home_organizer.js?v=20260818aa','home-organizer');
  loadScript('performance_data_loader_v2.js?v=20260820v2','performance-data-loader');
  function mount(){
    const byId=id=>document.getElementById(id);
    const esc=s=>String(s||'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt',"'":'&#39;','\"':'&quot;'}[c]));
    const para=s=>esc(s).replace(/\n/g,'<br>');
    const essayBtn=byId('showHintBtn');
    if(essayBtn&&!essayBtn.dataset.detailedAnswerReady){
      essayBtn.dataset.detailedAnswerReady='1';
      essayBtn.textContent='📚 看答題架構＋詳細擬答';
      essayBtn.addEventListener('click',()=>{
        const q=byId('essayQuestion')?.textContent||'';
        const item=(window.ESSAY_PROMPTS||[]).find(x=>x.question===q);
        if(!item)return;
        const answer=item.model_answer||'此題詳細擬答整理中。';
        byId('essayHint').innerHTML=`<div class="feedback-title">💡 答題架構</div><p>${para(item.hint||'')}</p><div class="feedback-title">📝 詳細擬答</div><p>${para(answer)}</p>`;
        byId('essayHint').classList.remove('hidden');
      });
    }
  }
  if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
