(()=>{
 if(window.__DAILY_MISSION_V2__)return;window.__DAILY_MISSION_V2__=true;
 const STATS='musicTeacherExamStatsV1',SRS='musicTeacherExamSpacedReviewV1',FOCUS='musicTeacherExamNoteFocusV1';
 const load=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}};
 const qs=()=>window.MusicTeacherExam?.questions||[];
 const uniq=a=>[...new Map(a.filter(Boolean).map(q=>[q.id,q])).values()];
 const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const subjects=['國中音樂','高中音樂','教育專業'];
 function build(){
  const s=load(STATS,{attempts:{},wrong:[],unknown:[],topics:{}}),r=load(SRS,{}),focus=load(FOCUS,{}),now=new Date(),all=qs(),used=new Set();
  const unknownSet=new Set(s.unknown||[]),wrongSet=new Set(s.wrong||[]),focusSet=new Set(Object.keys(focus||{}));
  const dueSet=new Set(all.filter(q=>r[q.id]?.due&&new Date(r[q.id].due)<=now).map(q=>q.id));
  const weakTopics=new Set(Object.entries(s.topics||{}).filter(([,v])=>v.total>=2&&v.correct/v.total<.7).map(([k])=>k));
  const weakSet=new Set(all.filter(q=>weakTopics.has(q.topic)).map(q=>q.id));
  const freshSet=new Set(all.filter(q=>!s.attempts?.[q.id]).map(q=>q.id));
  function reason(q){
   const id=q.id;
   if(unknownSet.has(id))return{key:'unknown',label:'❓ 不知道',detail:'你曾按過「不知道」，今天優先重新建立概念。',rank:0};
   if(wrongSet.has(id))return{key:'wrong',label:'❌ 錯題',detail:'最近仍在錯題本，先把錯因釐清。',rank:1};
   if(focusSet.has(String(id))||r[id]?.noteFocus)return{key:'focus',label:'⭐ 我的重點',detail:'你從自己的筆記標記為重點。',rank:2};
   if(dueSet.has(id))return{key:'due',label:'🧠 間隔到期',detail:'已到適合再次提取的時間。',rank:3};
   if(weakSet.has(id))return{key:'weak',label:'🩹 弱點主題',detail:'這個主題近期正確率偏低。',rank:4};
   if(freshSet.has(id))return{key:'fresh',label:'🆕 新題探索',detail:'尚未作答，用來擴大題庫覆蓋。',rank:5};
   return{key:'mix',label:'🎯 綜合維持',detail:'補足三科配比與題感。',rank:6};
  }
  const prioritized=all.map(q=>({q,why:reason(q)})).sort((a,b)=>a.why.rank-b.why.rank||(dueSet.has(a.q.id)&&dueSet.has(b.q.id)?new Date(r[a.q.id].due)-new Date(r[b.q.id].due):0));
  const buckets=new Map();for(const x of prioritized){if(!buckets.has(x.why.rank))buckets.set(x.why.rank,[]);buckets.get(x.why.rank).push(x)}
  const ordered=[];[...buckets.keys()].sort((a,b)=>a-b).forEach(k=>ordered.push(...shuffle(buckets.get(k))));
  const target={'國中音樂':7,'高中音樂':7,'教育專業':6},pool=[];
  const takeSubject=(sub,n)=>{for(const x of ordered){if(pool.length>=20||pool.filter(y=>y.q.subject===sub).length>=n)break;if(x.q.subject===sub&&!used.has(x.q.id)){used.add(x.q.id);pool.push(x)}}};
  subjects.forEach(sub=>takeSubject(sub,target[sub]));for(const x of ordered){if(pool.length>=20)break;if(!used.has(x.q.id)){used.add(x.q.id);pool.push(x)}}
  const groups=[
   ['unknown','❓ 不知道'],['wrong','❌ 錯題'],['focus','⭐ 我的重點'],['due','🧠 間隔到期'],['weak','🩹 弱點主題'],['fresh','🆕 新題探索'],['mix','🎯 綜合維持']
  ].map(([key,label])=>({key,label,items:pool.filter(x=>x.why.key===key)})).filter(x=>x.items.length);
  const counts=Object.fromEntries(subjects.map(sub=>[sub,pool.filter(x=>x.q.subject===sub).length]));
  return{pool:pool.map(x=>x.q),items:pool,groups,counts};
 }
 function render(){
  const home=document.getElementById('homeView');if(!home)return;const m=build(),slot=document.getElementById('todayPrimarySlot');let sec=document.getElementById('dailyMission');if(!sec){sec=document.createElement('section');sec.id='dailyMission';sec.className='card section-card'}
  sec.innerHTML=`<div class="section-title"><div><span class="eyebrow">每題只算一次，顯示最主要原因</span><h3>📅 今日上岸任務</h3></div><span class="pill">${m.pool.length} 題</span></div><p class="muted">優先順序：❓不知道 → ❌錯題 → ⭐我的重點 → 🧠間隔到期 → 🩹弱點 → 🆕新題。即使同一題同時符合多個條件，也只會放進一個主要分類。</p><div style="display:flex;gap:7px;flex-wrap:wrap;margin:10px 0 12px"><span class="pill">🎵 國中 ${m.counts['國中音樂']||0}</span><span class="pill">🎓 高中 ${m.counts['高中音樂']||0}</span><span class="pill">📚 教育 ${m.counts['教育專業']||0}</span></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px;margin:12px 0">${m.groups.map(g=>`<div style="border:1px solid var(--line);border-radius:12px;padding:10px"><b>${g.label}</b><div style="font-size:22px;font-weight:850;margin-top:4px">${g.items.length}<small style="font-size:12px;color:var(--muted)"> 題</small></div></div>`).join('')}</div>${m.items.length?`<details style="margin:10px 0"><summary style="cursor:pointer;font-weight:800">查看今天前 8 題為什麼被選中</summary><div style="display:grid;gap:7px;margin-top:8px">${m.items.slice(0,8).map(x=>`<div style="padding:8px 10px;border:1px solid var(--line);border-radius:10px"><b>${x.why.label}</b>｜${x.q.topic||x.q.subject}<div class="muted" style="font-size:12px;margin-top:2px">${x.why.detail}</div></div>`).join('')}</div></details>`:''}<button id="startDailyMission" class="primary wide">🚀 開始今天的上岸任務</button>`;
  if(slot){slot.innerHTML='';slot.appendChild(sec)}else if(!sec.isConnected){const first=home.querySelector('.stats-grid')?.nextElementSibling;first?.insertAdjacentElement('beforebegin',sec)}
  sec.querySelector('#startDailyMission')?.addEventListener('click',()=>{const x=build();window.MusicTeacherExam?.startCustomQuiz(x.pool,'📅 今日上岸任務',20)});window.HomeCategoryOrganizer?.apply?.();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,900));else setTimeout(render,100);
 window.DailyExamMission={build,render};
})();