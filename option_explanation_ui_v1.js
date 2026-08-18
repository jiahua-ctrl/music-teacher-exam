(()=>{
 if(window.__OPTION_EXPLANATION_UI_V2__)return;window.__OPTION_EXPLANATION_UI_V2__=true;
 const NOTE_KEY='musicTeacherExamOptionNotesV1';
 function esc(s){return String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]))}
 const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
 const allQuestions=()=>window.MusicTeacherExam?.questions||window.LOCAL_QUESTIONS||[];
 function visibleOptions(){return [...document.querySelectorAll('#options .option-btn')].map(b=>({key:b.dataset.choice,text:clean(b.textContent.replace(/^\s*[A-D][.．]\s*/,''))}))}
 function currentQuestion(){
  const id=document.querySelector('#sourceBox')?.textContent?.match(/題號：([^\s]+)/)?.[1];
  if(id){const hit=allQuestions().find(q=>String(q.id)===String(id));if(hit)return hit}
  const stem=clean(document.getElementById('questionText')?.textContent||''),opts=visibleOptions();
  const candidates=allQuestions().filter(q=>clean(q.question)===stem);
  if(candidates.length===1)return candidates[0];
  if(candidates.length>1&&opts.length){
   const exact=candidates.find(q=>opts.every(x=>clean(q[`option_${x.key.toLowerCase()}`])===x.text));if(exact)return exact;
  }
  if(opts.length){
   const exact=allQuestions().find(q=>clean(q.question)===stem&&opts.every(x=>clean(q[`option_${x.key.toLowerCase()}`])===x.text));if(exact)return exact;
  }
  return candidates[0]||null;
 }
 function loadNotes(){try{return JSON.parse(localStorage.getItem(NOTE_KEY))||{}}catch{return{}}}
 function saveNotes(x){localStorage.setItem(NOTE_KEY,JSON.stringify(x));}
 function getNote(qid,key){return loadNotes()?.[qid]?.[key]||''}
 function setNote(qid,key,value){const n=loadNotes();n[qid]=n[qid]||{};if(clean(value))n[qid][key]=value.trim();else delete n[qid][key];if(!Object.keys(n[qid]).length)delete n[qid];saveNotes(n)}
 function noteCount(){return Object.values(loadNotes()).reduce((n,x)=>n+Object.values(x||{}).filter(v=>clean(v)).length,0)}
 function exportNotes(){const notes=loadNotes(),payload={version:1,exported_at:new Date().toISOString(),notes:Object.entries(notes).map(([question_id,opts])=>{const q=allQuestions().find(x=>String(x.id)===String(question_id));return{question_id,question:q?.question||'',source:q?.source_title||q?.exam||'',options:Object.fromEntries(Object.entries(opts).filter(([,v])=>clean(v)))}}).filter(x=>Object.keys(x.options).length)};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`music-teacher-option-notes-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)}
 function render(){
  const feedback=document.getElementById('feedback'),exp=document.getElementById('explanation');if(!feedback||!exp||feedback.classList.contains('hidden'))return;
  const q=currentQuestion();if(!q)return;
  let box=document.getElementById('optionExplanationBox');if(!box){box=document.createElement('div');box.id='optionExplanationBox';exp.insertAdjacentElement('afterend',box)}
  const rows=window.getMusicOptionExplanations?window.getMusicOptionExplanations(q):[];
  box.dataset.questionId=q.id;
  box.innerHTML=`<div class="feedback-title" style="margin-top:16px">🔎 四個選項逐項複習</div><div class="source-box" style="margin:7px 0 9px"><b>目前核對題號：</b>${esc(q.id)}${q.source_title||q.exam?`｜${esc(q.source_title||q.exam)}`:''}</div><div style="display:grid;gap:9px">${rows.map(x=>`<div class="option-review-row" data-key="${x.key}" style="padding:11px 12px;border:1px solid var(--line);border-radius:12px;line-height:1.6"><b>${x.correct?'✅':'▫️'} ${x.key}. ${esc(x.text)}</b><div style="margin-top:4px">${esc(x.explanation)}</div><details style="margin-top:8px"><summary style="cursor:pointer;font-weight:800">📝 我的補充筆記${getNote(q.id,x.key)?' ✓':''}</summary><textarea class="option-note-input" data-key="${x.key}" rows="3" placeholder="例如：這個選項其實在考什麼？為什麼錯？和哪個名詞容易混淆？" style="width:100%;margin-top:8px;padding:9px 10px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--text);resize:vertical">${esc(getNote(q.id,x.key))}</textarea><div style="display:flex;gap:7px;justify-content:flex-end;margin-top:6px"><button class="ghost small option-note-clear" data-key="${x.key}" type="button">清除</button><button class="primary small option-note-save" data-key="${x.key}" type="button">💾 儲存筆記</button></div></details></div>`).join('')}</div>${q.review_focus?`<div class="source-box" style="margin-top:10px"><b>🧠 本題複習核心：</b>${esc(q.review_focus)}</div>`:''}<div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-top:12px;flex-wrap:wrap"><small class="muted">你的筆記只存在這個瀏覽器，不會覆蓋原題庫。</small><button id="exportOptionNotesBtn" class="ghost small" type="button">📦 匯出我的筆記（${noteCount()}則）</button></div>`;
  box.querySelectorAll('.option-note-save').forEach(btn=>btn.onclick=()=>{const input=box.querySelector(`.option-note-input[data-key="${btn.dataset.key}"]`);setNote(q.id,btn.dataset.key,input?.value||'');btn.textContent='✅ 已儲存';setTimeout(()=>{btn.textContent='💾 儲存筆記';render()},500)});
  box.querySelectorAll('.option-note-clear').forEach(btn=>btn.onclick=()=>{const input=box.querySelector(`.option-note-input[data-key="${btn.dataset.key}"]`);if(input)input.value='';setNote(q.id,btn.dataset.key,'');render()});
  box.querySelector('#exportOptionNotesBtn')?.addEventListener('click',exportNotes);
 }
 const obs=new MutationObserver(()=>setTimeout(render,0));
 function mount(){const f=document.getElementById('feedback');if(f&&!f.dataset.optionExplanationObserved){f.dataset.optionExplanationObserved='1';obs.observe(f,{attributes:true,childList:true,subtree:true})}document.addEventListener('click',e=>{if(e.target.closest('.option-btn,.unknown-btn'))setTimeout(render,20)})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
 window.MusicTeacherOptionNotes={load:loadNotes,save:setNote,export:exportNotes,count:noteCount};
})();