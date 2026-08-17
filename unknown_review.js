(()=>{
  const STORAGE_KEY='musicTeacherExamStatsV1';
  const qs=()=>window.MusicTeacherExam?.questions||[];
  const load=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{attempts:{},wrong:[],daily:{},topics:{}}}catch{return {attempts:{},wrong:[],daily:{},topics:{}}}};
  const save=s=>localStorage.setItem(STORAGE_KEY,JSON.stringify(s));
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));

  function currentQuestion(){
    const text=document.getElementById('questionText')?.textContent||'';
    return qs().find(q=>q.question===text);
  }

  function ensureStyle(){
    if(document.getElementById('unknownReviewStyle'))return;
    const st=document.createElement('style');
    st.id='unknownReviewStyle';
    st.textContent=`
      .unknown-wrap{display:flex;justify-content:center;margin:12px 0 4px}
      .unknown-btn{width:100%;border:1px dashed var(--line);background:var(--soft);color:inherit;border-radius:12px;padding:11px 14px;font-weight:800;cursor:pointer}
      .unknown-btn:hover{border-color:var(--brand)}
      .unknown-btn:disabled{opacity:.55;cursor:not-allowed}
      .unknown-note{font-size:12px;color:var(--muted);margin-top:6px;text-align:center}
    `;
    document.head.appendChild(st);
  }

  function markUnknown(q){
    const stats=load();
    stats.attempts=stats.attempts||{};
    stats.attempts[q.id]=stats.attempts[q.id]||{total:0,correct:0,unknown:0};
    stats.attempts[q.id].total=(stats.attempts[q.id].total||0)+1;
    stats.attempts[q.id].unknown=(stats.attempts[q.id].unknown||0)+1;
    stats.topics=stats.topics||{};
    stats.topics[q.topic]=stats.topics[q.topic]||{total:0,correct:0,unknown:0};
    stats.topics[q.topic].total=(stats.topics[q.topic].total||0)+1;
    stats.topics[q.topic].unknown=(stats.topics[q.topic].unknown||0)+1;
    stats.daily=stats.daily||{};
    stats.daily[today()]=(stats.daily[today()]||0)+1;
    const wrong=new Set(stats.wrong||[]);wrong.add(q.id);stats.wrong=[...wrong];
    const unknown=new Set(stats.unknown||[]);unknown.add(q.id);stats.unknown=[...unknown];
    save(stats);
  }

  function showUnknownFeedback(q){
    document.querySelectorAll('.option-btn').forEach(btn=>{
      btn.disabled=true;
      if(btn.dataset.choice===q.answer)btn.classList.add('correct');
    });
    const title=document.getElementById('feedbackTitle');
    const exp=document.getElementById('explanation');
    const source=document.getElementById('sourceBox');
    const feedback=document.getElementById('feedback');
    const next=document.getElementById('nextBtn');
    if(title)title.textContent=`❓ 不知道｜已加入錯題本・正確答案是 ${q.answer}`;
    if(exp)exp.textContent=q.explanation||'';
    const meta=[q.year?`${q.year}年`:null,q.exam,q.source_type].filter(Boolean).map(esc).join('｜');
    const sourceTitle=esc(q.source_title||'練習題');
    const sourceLink=q.source_url?`<br><a href="${esc(q.source_url)}" target="_blank" rel="noopener noreferrer">🔗 查看來源／核對考點</a>`:'';
    if(source)source.innerHTML=`${meta?`<b>${meta}</b><br>`:''}來源標示：${sourceTitle}<br>題號：${esc(q.id)}${sourceLink}`;
    feedback?.classList.remove('hidden');
    next?.classList.remove('hidden');
  }

  function inject(){
    const options=document.getElementById('options');
    if(!options||document.getElementById('unknownBtn'))return;
    const wrap=document.createElement('div');wrap.className='unknown-wrap';
    wrap.innerHTML='<button id="unknownBtn" class="unknown-btn" type="button">❓ 我不知道｜加入錯題本並看解析</button>';
    options.insertAdjacentElement('afterend',wrap);
    const note=document.createElement('div');note.className='unknown-note';note.textContent='不知道不是跳過：系統會把它當成知識缺口，之後優先複習。';wrap.insertAdjacentElement('afterend',note);
    document.getElementById('unknownBtn')?.addEventListener('click',()=>{
      const q=currentQuestion();if(!q)return;
      const btn=document.getElementById('unknownBtn');if(btn)btn.disabled=true;
      markUnknown(q);showUnknownFeedback(q);
      window.dispatchEvent(new CustomEvent('musicTeacherUnknown',{detail:{id:q.id}}));
    });
  }

  function resetForNewQuestion(){
    document.querySelector('.unknown-wrap')?.remove();
    const note=document.querySelector('.unknown-note');note?.remove();
    inject();
  }

  document.addEventListener('click',e=>{
    if(e.target.closest?.('.option-btn')){const b=document.getElementById('unknownBtn');if(b)b.disabled=true;}
  },true);

  document.addEventListener('DOMContentLoaded',()=>{
    ensureStyle();
    setTimeout(inject,120);
    const text=document.getElementById('questionText');
    if(text)new MutationObserver(()=>setTimeout(resetForNewQuestion,0)).observe(text,{childList:true,subtree:true,characterData:true});
  });
})();