(()=>{
 if(window.__DAILY_MISSION_LOADED__)return;window.__DAILY_MISSION_LOADED__=true;
 const STATS='musicTeacherExamStatsV1',SRS='musicTeacherExamSpacedReviewV1';
 const load=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}};
 const qs=()=>window.MusicTeacherExam?.questions||[];
 const uniq=a=>[...new Map(a.filter(Boolean).map(q=>[q.id,q])).values()];
 const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 const subjects=['國中音樂','高中音樂','教育專業'];
 function build(){const s=load(STATS,{attempts:{},wrong:[],unknown:[],topics:{}}),r=load(SRS,{}),now=new Date(),all=qs(),used=new Set();
  const due=all.filter(q=>r[q.id]?.due&&new Date(r[q.id].due)<=now).sort((a,b)=>new Date(r[a.id].due)-new Date(r[b.id].due));
  const unknown=all.filter(q=>(s.unknown||[]).includes(q.id));
  const wrong=all.filter(q=>(s.wrong||[]).includes(q.id));
  const weakTopics=new Set(Object.entries(s.topics||{}).filter(([,v])=>v.total>=2&&v.correct/v.total<.7).map(([k])=>k));
  const weak=shuffle(all.filter(q=>weakTopics.has(q.topic)));
  const fresh=shuffle(all.filter(q=>!s.attempts?.[q.id]));
  const priority=uniq([...due,...unknown,...wrong,...weak,...fresh,...shuffle(all)]);
  const target={'國中音樂':7,'高中音樂':7,'教育專業':6},pool=[];
  const takeSubject=(sub,n)=>{for(const q of priority){if(pool.length>=20||pool.filter(x=>x.subject===sub).length>=n)break;if(q.subject===sub&&!used.has(q.id)){used.add(q.id);pool.push(q)}}};
  subjects.forEach(sub=>takeSubject(sub,target[sub]));
  for(const q of priority){if(pool.length>=20)break;if(!used.has(q.id)){used.add(q.id);pool.push(q)}}
  const sets={due:new Set(due.map(q=>q.id)),unknown:new Set(unknown.map(q=>q.id)),wrong:new Set(wrong.map(q=>q.id)),weak:new Set(weak.map(q=>q.id)),fresh:new Set(fresh.map(q=>q.id))};
  const parts=[['🧠 到期複習',pool.filter(q=>sets.due.has(q.id))],['❓ 尚未建立',pool.filter(q=>sets.unknown.has(q.id))],['❌ 錯題／弱點',pool.filter(q=>sets.wrong.has(q.id)||sets.weak.has(q.id))],['🆕 新題探索',pool.filter(q=>sets.fresh.has(q.id))]];
  const counts=Object.fromEntries(subjects.map(sub=>[sub,pool.filter(q=>q.subject===sub).length]));return{parts,pool:pool.slice(0,20),counts}}
 function render(){const home=document.getElementById('homeView');if(!home||document.getElementById('dailyMission'))return;const m=build(),sec=document.createElement('section');sec.id='dailyMission';sec.className='card section-card';sec.innerHTML=`<div class="section-title"><div><span class="eyebrow">不用自己決定今天刷什麼</span><h3>📅 今日上岸任務</h3></div><span class="pill">${m.pool.length} 題</span></div><p class="muted">優先回收到期、❓不知道與錯題，同時保護三科配比，避免單一科目把今天的練習全部吃掉。</p><div style="display:flex;gap:7px;flex-wrap:wrap;margin:10px 0 12px"><span class="pill">🎵 國中 ${m.counts['國中音樂']||0}</span><span class="pill">🎓 高中 ${m.counts['高中音樂']||0}</span><span class="pill">📚 教育 ${m.counts['教育專業']||0}</span></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px;margin:12px 0">${m.parts.map(([n,a])=>`<div style="border:1px solid var(--line);border-radius:12px;padding:10px"><b>${n}</b><div style="font-size:22px;font-weight:850;margin-top:4px">${a.length}<small style="font-size:12px;color:var(--muted)"> 題</small></div></div>`).join('')}</div><button id="startDailyMission" class="primary wide">🚀 開始今天的上岸任務</button>`;
  const first=home.querySelector('.stats-grid')?.nextElementSibling;first?.insertAdjacentElement('beforebegin',sec);document.getElementById('startDailyMission')?.addEventListener('click',()=>{const x=build();window.MusicTeacherExam?.startCustomQuiz(x.pool,'📅 今日上岸任務',20)});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,900));else setTimeout(render,100);
 window.DailyExamMission={build,render};
})();