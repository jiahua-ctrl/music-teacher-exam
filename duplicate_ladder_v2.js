(()=>{
 const qs=()=>window.MusicTeacherExam?.questions||window.LOCAL_QUESTIONS||[];
 const stats=()=>{try{return JSON.parse(localStorage.getItem('musicTeacherExamStatsV1'))||{}}catch{return {}}};
 const role=l=>l<=1?'辨識':l===2?'關聯':l===3?'比較':l===4?'整合':'應用／推理';
 function annotate(){
  const exactGroups=new Map(),conceptRoles=new Map(),conceptDepth=new Map();
  qs().forEach(q=>{
   const lv=Math.max(1,Math.min(5,Number(q.discrimination_level)||1));
   const c=q.canonical_concept||q.topic||'其他';
   q.ladder_role=role(lv);q.ladder_key=`${c}|${lv}`;q.progression_group=c;q.progression_role=q.ladder_role;
   if(!conceptDepth.has(c))conceptDepth.set(c,new Set());conceptDepth.get(c).add(lv);
   const cr=`${c}|${q.ladder_role}`;if(!conceptRoles.has(cr))conceptRoles.set(cr,[]);conceptRoles.get(cr).push(q);
   if(q.duplicate_group){if(!exactGroups.has(q.duplicate_group))exactGroups.set(q.duplicate_group,[]);exactGroups.get(q.duplicate_group).push(q)}
  });
  exactGroups.forEach(g=>{
   g.sort((a,b)=>(Number(b.discrimination_level)||1)-(Number(a.discrimination_level)||1)||String(a.id).localeCompare(String(b.id)));
   g.forEach((q,i)=>{q.duplicate_representative=i===0;q.duplicate_sampling_multiplier=i===0?1:.15;if(i>0){q.quality_tags=q.quality_tags||[];if(!q.quality_tags.includes('⬇️重複降權'))q.quality_tags.push('⬇️重複降權')}});
  });
  // 同一概念、同一能力角色若有很多題：保留不同題，但一般抽題時降低同角色連續佔位。
  conceptRoles.forEach(g=>{
   g.sort((a,b)=>(Number(b.discrimination_level)||1)-(Number(a.discrimination_level)||1)||String(a.id).localeCompare(String(b.id)));
   g.forEach((q,i)=>{q.role_variant_rank=i+1;q.role_variant_count=g.length;if(i>0&&g.length>=3){q.quality_tags=q.quality_tags||[];if(!q.quality_tags.includes('♻️同角色多題'))q.quality_tags.push('♻️同角色多題')}})
  });
  qs().forEach(q=>{const depth=[...(conceptDepth.get(q.progression_group)||[])].sort((a,b)=>a-b);q.progression_levels=depth;q.progression_has_growth=depth.length>=2});
  window.MUSIC_DUPLICATE_LADDER_SUMMARY={
   exactGroups:exactGroups.size,
   exactDemoted:[...exactGroups.values()].reduce((n,g)=>n+Math.max(0,g.length-1),0),
   conceptRoleGroups:[...conceptRoles.values()].filter(g=>g.length>=2).length,
   conceptsWithGrowth:[...conceptDepth.values()].filter(s=>s.size>=2).length
  };
 }
 function balanced(pool,limit=10){
  const s=stats(),wrong=new Set(s.wrong||[]),unknown=new Set(s.unknown||[]),usedExact=new Set(),usedRole=new Map(),conceptCount=new Map();
  const scored=[...pool].map(q=>{
   const lv=Number(q.discrimination_level)||1,c=q.canonical_concept||q.topic||'其他',attempt=s.attempts?.[q.id]||{},acc=attempt.total?(attempt.correct||0)/attempt.total:null;
   let score=Math.random()*2+(lv>=4?2.2:lv===3?1.25:.35);
   if(wrong.has(q.id))score+=8;if(unknown.has(q.id))score+=10;if(acc!==null&&acc<.7)score+=3.5;
   if(q.duplicate_group&&!q.duplicate_representative&&!wrong.has(q.id)&&!unknown.has(q.id))score-=5;
   if((q.role_variant_rank||1)>1&&!wrong.has(q.id)&&!unknown.has(q.id))score-=Math.min(2.4,(q.role_variant_rank-1)*.45);
   // 已熟練基礎題略降權，讓同概念更高階題浮上來。
   if(lv<=2&&attempt.total>=3&&acc!==null&&acc>=.8&&!wrong.has(q.id)&&!unknown.has(q.id))score-=2.2;
   return{q,score,c,role:q.ladder_role||role(lv)};
  }).sort((a,b)=>b.score-a.score);
  const out=[];
  for(const x of scored){
   if(out.length>=limit)break;const q=x.q;
   if(q.duplicate_group&&usedExact.has(q.duplicate_group)&&!wrong.has(q.id)&&!unknown.has(q.id))continue;
   const rk=`${x.c}|${x.role}`,rn=usedRole.get(rk)||0;
   if(rn>=1&&pool.length>limit*1.25&&!wrong.has(q.id)&&!unknown.has(q.id))continue;
   const cn=conceptCount.get(x.c)||0;if(cn>=2&&pool.length>limit*1.5&&!wrong.has(q.id)&&!unknown.has(q.id))continue;
   out.push(q);if(q.duplicate_group)usedExact.add(q.duplicate_group);usedRole.set(rk,rn+1);conceptCount.set(x.c,cn+1);
  }
  if(out.length<limit)for(const x of scored){if(out.length>=limit)break;if(!out.includes(x.q))out.push(x.q)}
  return out;
 }
 function poolFor(mode){const all=qs(),s=stats();if(mode==='junior')return all.filter(q=>q.subject==='國中音樂');if(mode==='senior')return all.filter(q=>q.subject==='高中音樂');if(mode==='education')return all.filter(q=>q.subject==='教育專業');if(mode==='all'||mode==='random10')return all;if(mode==='wrong')return all.filter(q=>(s.wrong||[]).includes(q.id));if(mode==='unknown')return all.filter(q=>(s.unknown||[]).includes(q.id));return null}
 function intercept(){document.addEventListener('click',e=>{const b=e.target.closest?.('[data-mode]');if(!b)return;const mode=b.dataset.mode;if(!['random10','junior','senior','education','all'].includes(mode))return;const pool=poolFor(mode);if(!pool?.length)return;e.preventDefault();e.stopImmediatePropagation();const lim=mode==='all'?Math.min(30,pool.length):10,chosen=balanced(pool,lim);window.MusicTeacherExam?.startCustomQuiz?.(chosen,mode==='random10'?'今日10題｜能力階梯去重配題':`${b.textContent.trim()}｜能力階梯去重配題`,chosen.length)},true)}
 function mountSummary(){const home=document.getElementById('homeView');if(!home)return;let el=document.getElementById('duplicateLadderSummary');if(!el){el=document.createElement('div');el.id='duplicateLadderSummary';el.className='source-box';el.style.margin='10px 0 16px';home.querySelector('.hero')?.insertAdjacentElement('afterend',el)}const d=window.MUSIC_DUPLICATE_LADDER_SUMMARY||{};el.innerHTML=`♻️ 能力階梯去重已啟用：${d.exactGroups||0} 組高度相似題已降權；${d.conceptRoleGroups||0} 組「同概念＋同能力角色」會避免在同一輪重複佔位；${d.conceptsWithGrowth||0} 個核心考點已具至少兩層難度。錯題與「不知道」仍優先保留。`}
 function boot(){annotate();intercept();setTimeout(mountSummary,350);window.getBalancedMusicQuestionPool=balanced;window.MusicDuplicateLadder={annotate,balanced}}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();window.addEventListener('musicTeacherCanonicalReady',()=>setTimeout(()=>{annotate();mountSummary()},0));
})();