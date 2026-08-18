(()=>{
 function esc(s){return String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]))}
 function currentQuestion(){
  const id=document.querySelector('#sourceBox')?.textContent?.match(/題號：([^\s]+)/)?.[1];
  if(id)return (window.MusicTeacherExam?.questions||window.LOCAL_QUESTIONS||[]).find(q=>String(q.id)===String(id));
  const stem=document.getElementById('questionText')?.textContent||'';
  return (window.MusicTeacherExam?.questions||window.LOCAL_QUESTIONS||[]).find(q=>q.question===stem);
 }
 function render(){
  const feedback=document.getElementById('feedback'),exp=document.getElementById('explanation');if(!feedback||!exp||feedback.classList.contains('hidden'))return;
  const q=currentQuestion();if(!q)return;
  let box=document.getElementById('optionExplanationBox');if(!box){box=document.createElement('div');box.id='optionExplanationBox';exp.insertAdjacentElement('afterend',box)}
  const rows=window.getMusicOptionExplanations?window.getMusicOptionExplanations(q):[];
  box.innerHTML=`<div class="feedback-title" style="margin-top:16px">🔎 四個選項逐項複習</div><div style="display:grid;gap:9px;margin-top:9px">${rows.map(x=>`<div style="padding:11px 12px;border:1px solid var(--line);border-radius:12px;line-height:1.6"><b>${x.correct?'✅':'▫️'} ${x.key}. ${esc(x.text)}</b><br><span>${esc(x.explanation)}</span></div>`).join('')}</div>${q.review_focus?`<div class="source-box" style="margin-top:10px"><b>🧠 本題複習核心：</b>${esc(q.review_focus)}</div>`:''}`;
 }
 const obs=new MutationObserver(()=>setTimeout(render,0));
 function mount(){const f=document.getElementById('feedback');if(f)obs.observe(f,{attributes:true,childList:true,subtree:true});document.addEventListener('click',e=>{if(e.target.closest('.option-btn,.unknown-btn'))setTimeout(render,20)})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();