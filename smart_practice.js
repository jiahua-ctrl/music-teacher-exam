(()=>{
  const SMART_KEY='musicTeacherExamSmartV1';
  const STATS_KEY='musicTeacherExamStatsV1';
  const load=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const smart=()=>load(SMART_KEY,{items:{},manualMastered:[]});
  const stats=()=>load(STATS_KEY,{attempts:{},wrong:[],daily:{},topics:{}});
  const qs=()=>window.MusicTeacherExam?.questions||[];
  const norm=s=>String(s||'').toLowerCase().replace(/[\s（）()，、,.:：；;「」『』〈〉《》'"\-_/]/g,'');
  const generic=new Set(['國中音樂','高中音樂','教育專業','世界音樂','臺灣音樂','台灣音樂','音樂史','和聲','曲式','歌劇','樂器學','二十世紀音樂','音樂教學法']);
  function conceptKey(q){
    if(q.concept_key)return q.concept_key;
    const tags=String(q.tags||'').split(';').map(x=>x.trim()).filter(Boolean);
    const specific=tags.find(x=>!generic.has(x)&&norm(x)!==norm(q.topic));
    return `${norm(q.topic)}|${norm(specific||q.answer||q.question.slice(0,18))}`;
  }
  function difficulty(q){const x=String(q.level||'');if(/高階|進階|困難|3/.test(x))return 3;if(/理解|中階|2/.test(x))return 2;return 1}
  function itemState(q){
    const s=stats(),sm=smart(),a=s.attempts?.[q.id]||{total:0,correct:0},x=sm.items?.[q.id]||{};
    const acc=a.total?a.correct/a.total:0;
    const manual=(sm.manualMastered||[]).includes(q.id);
    const auto=a.total>=2&&acc>=.9&&(x.correctStreak||0)>=2;
    return {a,x,acc,manual,auto,mastered:manual||auto};
  }
  function weight(q,challenge=false){
    const s=stats(),st=itemState(q),now=Date.now();
    if(st.manual)return 0.01;
    let w=1;
    if(!st.a.total)w*=2.8;
    else if(st.acc<.5)w*=4.2;
    else if(st.acc<.75)w*=2.7;
    else if(st.acc<.9)w*=1.5;
    else w*=st.auto?.16:.55;
    if((s.wrong||[]).includes(q.id))w*=2.5;
    const age=st.x.lastSeen?now-new Date(st.x.lastSeen).getTime():Infinity;
    if(age<12*3600000)w*=.08; else if(age<48*3600000)w*=.32; else if(age<7*86400000)w*=.72;
    const d=difficulty(q);
    if(challenge)w*=d===3?3:d===2?1.35:.22; else w*=d===3?1.35:d===2?1.1:.8;
    if(String(q.source_type||'').includes('官方'))w*=1.15;
    return Math.max(.001,w);
  }
  function weightedPick(arr,challenge){
    const total=arr.reduce((n,q)=>n+weight(q,challenge),0);let r=Math.random()*total;
    for(const q of arr){r-=weight(q,challenge);if(r<=0)return q}return arr[arr.length-1];
  }
  function select(pool,limit=10,challenge=false,unseenOnly=false){
    let candidates=[...new Map((pool||[]).map(q=>[q.id,q])).values()];
    if(unseenOnly){const s=stats();const unseen=candidates.filter(q=>!(s.attempts?.[q.id]?.total));if(unseen.length)candidates=unseen;}
    if(challenge){const hard=candidates.filter(q=>difficulty(q)>=2&&!itemState(q).manual);if(hard.length>=Math.min(limit,6))candidates=hard;}
    const out=[],usedConcepts=new Set();
    for(let pass=0;pass<2&&out.length<Math.min(limit,candidates.length);pass++){
      while(out.length<Math.min(limit,candidates.length)){
        const remain=candidates.filter(q=>!out.some(x=>x.id===q.id)&&(pass===1||!usedConcepts.has(conceptKey(q))));
        if(!remain.length)break;
        const q=weightedPick(remain,challenge);out.push(q);usedConcepts.add(conceptKey(q));
      }
    }
    return out;
  }
  function launch(kind){
    if(!window.MusicTeacherExam?.startCustomQuiz)return;
    const all=qs();let pool=all,label='智慧 10 題',challenge=false,unseen=false;
    if(kind==='challenge'){label='鑑別度挑戰';challenge=true;pool=all.filter(q=>q.subject!=='教育專業'||difficulty(q)>=2)}
    if(kind==='unseen'){label='新題探索';unseen=true}
    const chosen=select(pool,10,challenge,unseen);
    if(!chosen.length){alert('目前沒有可用題目。');return}
    window.MusicTeacherExam.startCustomQuiz(chosen,label,chosen.length);
  }
  function summary(){const all=qs(),s=stats();let mastered=0,unseen=0,hard=0;all.forEach(q=>{const st=itemState(q);if(st.mastered)mastered++;if(!st.a.total)unseen++;if(difficulty(q)>=3)hard++});return {mastered,unseen,hard,total:all.length}}
  function styles(){if(document.getElementById('mtSmartStyles'))return;const x=document.createElement('style');x.id='mtSmartStyles';x.textContent=`.mt-smart{padding:24px;margin-bottom:18px}.mt-smart-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}.mt-smart-btn{border:1px solid var(--line);background:var(--panel);color:inherit;border-radius:14px;padding:14px;text-align:left;cursor:pointer}.mt-smart-btn b{display:block;margin-bottom:5px}.mt-smart-btn small{color:var(--muted);line-height:1.5}.mt-smart-btn.feature{background:var(--soft);border-color:var(--brand)}.mt-smart-summary{margin-top:12px;color:var(--muted);font-size:13px;line-height:1.6}.mt-master-btn{margin-top:10px;border:1px solid var(--line);background:var(--panel);color:inherit;border-radius:10px;padding:8px 11px;font-weight:750;cursor:pointer}@media(max-width:720px){.mt-smart-grid{grid-template-columns:1fr}}`;document.head.appendChild(x)}
  function panel(){
    const home=document.getElementById('homeView');if(!home||document.getElementById('mtSmart'))return;
    const s=summary(),el=document.createElement('section');el.id='mtSmart';el.className='card mt-smart';
    el.innerHTML=`<span class="eyebrow">避免一直考你已經會的</span><h3 style="margin:5px 0 0">🧠 智慧出題</h3><div class="mt-smart-grid"><button class="mt-smart-btn feature" data-smart="smart"><b>🎯 智慧 10 題</b><small>優先新題、錯題與低正確率；已熟練與剛做過的題目自動降權。</small></button><button class="mt-smart-btn" data-smart="challenge"><b>🔥 鑑別度挑戰</b><small>提高進階／高階、跨概念與推理題比例，基礎記憶題大幅降權。</small></button><button class="mt-smart-btn" data-smart="unseen"><b>🆕 新題探索</b><small>優先抽尚未做過的題目，避免被熟悉題目製造假性高分。</small></button></div><div class="mt-smart-summary">目前：已熟練 ${s.mastered} 題｜尚未作答 ${s.unseen} 題｜進階／高階 ${s.hard} 題。原本「今日 10 題」也已自動改用智慧出題。</div>`;
    const anchor=document.querySelector('.section-card');anchor?.insertAdjacentElement('afterend',el);
    el.querySelectorAll('[data-smart]').forEach(b=>b.addEventListener('click',()=>launch(b.dataset.smart)));
  }
  function toggleMaster(q,btn){const sm=smart(),set=new Set(sm.manualMastered||[]);if(set.has(q.id))set.delete(q.id);else set.add(q.id);sm.manualMastered=[...set];save(SMART_KEY,sm);btn.textContent=set.has(q.id)?'✅ 已標記：我會了（點擊取消）':'✅ 這題我會了，降低出現率'}
  function observe(){
    const fb=document.getElementById('feedback');if(!fb)return;
    const obs=new MutationObserver(()=>{
      if(fb.classList.contains('hidden'))return;
      const text=document.getElementById('questionText')?.textContent||'',q=qs().find(x=>x.question===text);if(!q)return;
      const title=document.getElementById('feedbackTitle')?.textContent||'',correct=title.includes('答對');
      const sm=smart();sm.items=sm.items||{};const old=sm.items[q.id]||{};sm.items[q.id]={...old,lastSeen:new Date().toISOString(),correctStreak:correct?(old.correctStreak||0)+1:0};save(SMART_KEY,sm);
      let b=document.getElementById('mtMasterBtn');if(!b){b=document.createElement('button');b.id='mtMasterBtn';b.className='mt-master-btn';document.getElementById('sourceBox')?.after(b)}
      const mastered=(smart().manualMastered||[]).includes(q.id);b.textContent=mastered?'✅ 已標記：我會了（點擊取消）':'✅ 這題我會了，降低出現率';b.onclick=()=>toggleMaster(q,b);
    });obs.observe(fb,{attributes:true,attributeFilter:['class']});
  }
  function intercept(){document.addEventListener('click',e=>{const b=e.target.closest?.('[data-mode="random10"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();launch('smart')},true)}
  document.addEventListener('DOMContentLoaded',()=>{styles();setTimeout(()=>{panel();observe();intercept()},120)});
  window.MusicTeacherSmart={select,conceptKey,itemState,summary};
})();