(()=>{
 const qs=()=>window.MusicTeacherExam?.questions||window.LOCAL_QUESTIONS||[];
 const stats=()=>{try{return JSON.parse(localStorage.getItem('musicTeacherExamStatsV1'))||{}}catch{return {}}};
 const role=l=>l<=1?'辨識':l===2?'關聯':l===3?'比較':l===4?'整合':'應用／推理';
 function annotate(){
  const groups=new Map();
  qs().forEach(q=>{
   const lv=Math.max(1,Math.min(5,Number(q.discrimination_level)||1));q.ladder_role=role(lv);
   const c=q.canonical_concept||q.topic||'其他';q.ladder_key=`${c}|${lv}`;
   if(q.duplicate_group){if(!groups.has(q.duplicate_group))groups.set(q.duplicate_group,[]);groups.get(q.duplicate_group).push(q)}
  });
  groups.forEach(g=>{
   g.sort((a,b)=>(Number(b.discrimination_level)||1)-(Number(a.discrimination_level)||1)||String(a.id).localeCompare(String(b.id)));
   g.forEach((q,i)=>{q.duplicate_representative=i===0;q.duplicate_sampling_multiplier=i===0?1:.18;if(i>0){q.quality_tags=q.quality_tags||[];if(!q.quality_tags.includes('⬇️重複降權'))q.quality_tags.push('⬇️重複降權')}});
  });
  window.MUSIC_DUPLICATE_LADDER_SUMMARY={groups:groups.size,demoted:[...groups.values()].reduce((n,g)=>n+Math.max(0,g.length-1),0)};
 }
 function balanced(pool,limit=10){
  const s=stats(),wrong=new Set(s.wrong||[]),unknown=new Set(s.unknown||[]),usedDup=new Set(),conceptCount=new Map();
  const scored=[...pool].map(q=>{
   const lv=Number(q.discrimination_level)||1,c=q.canonical_concept||q.topic||'其他',attempt=s.attempts?.[q.id]||{},acc=attempt.total?(attempt.correct||0)/attempt.total:null;
   let score=Math.random()*2+(lv>=4?1.8:lv===3?1.1:.3);
   if(wrong.has(q.id))score+=8;if(unknown.has(q.id))score+=10;if(acc!==null&&acc<.7)score+=3;
   if(q.duplicate_group&&!q.duplicate_representative&&!wrong.has(q.id)&&!unknown.has(q.id))score-=5;
   return{q,score,c};
  }).sort((a,b)=>b.score-a.score);
  const out=[];
  for(const x of scored){
   if(out.length>=limit)break;
   const q=x.q;
   if(q.duplicate_group&&usedDup.has(q.duplicate_group)&&!wrong.has(q.id)&&!unknown.has(q.id))continue;
   const n=conceptCount.get(x.c)||0;if(n>=2&&pool.length>limit*1.5&&!wrong.has(q.id)&&!unknown.has(q.id))continue;
   out.push(q);if(q.duplicate_group)usedDup.add(q.duplicate_group);conceptCount.set(x.c,n+1);
  }
  if(out.length<limit)for(const x of scored){if(out.length>=limit)break;if(!out.includes(x.q))out.push(x.q)}
  return out;
 }
 function poolFor(mode){const all=qs(),s=stats();if(mode==='junior')return all.filter(q=>q.subject==='國中音樂');if(mode==='senior')return all.filter(q=>q.subject==='高中音樂');if(mode==='education')return all.filter(q=>q.subject==='教育專業');if(mode==='all'||mode==='random10')return all;if(mode==='wrong')return all.filter(q=>(s.wrong||[]).includes(q.id));if(mode==='unknown')return all.filter(q=>(s.unknown||[]).includes(q.id));return null}
 function intercept(){
  document.addEventListener('click',e=>{
   const b=e.target.closest?.('[data-mode]');if(!b)return;const mode=b.dataset.mode;if(!['random10','junior','senior','education','all'].includes(mode))return;
   const pool=poolFor(mode);if(!pool?.length)return;e.preventDefault();e.stopImmediatePropagation();const lim=mode==='all'?Math.min(30,pool.length):10;const chosen=balanced(pool,lim);window.MusicTeacherExam?.startCustomQuiz?.(chosen,mode==='random10'?'今日10題｜去重進階配題':`${b.textContent.trim()}｜去重進階配題`,chosen.length);
  },true);
 }
 function mountSummary(){const home=document.getElementById('homeView');if(!home||document.getElementById('duplicateLadderSummary'))return;const d=window.MUSIC_DUPLICATE_LADDER_SUMMARY||{};const el=document.createElement('div');el.id='duplicateLadderSummary';el.className='source-box';el.style.margin='10px 0 16px';el.innerHTML=`♻️ 題庫去重已啟用：${d.groups||0} 組疑似重複題已整理，同組題目預設只抽代表題；${d.demoted||0} 題已降低一般練習權重。錯題與「不知道」不受降權影響。`;const target=home.querySelector('.hero');target?.insertAdjacentElement('afterend',el)}
 function boot(){annotate();intercept();setTimeout(mountSummary,350);window.getBalancedMusicQuestionPool=balanced;window.MusicDuplicateLadder={annotate,balanced}}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();window.addEventListener('musicTeacherCanonicalReady',()=>setTimeout(annotate,0));
})();