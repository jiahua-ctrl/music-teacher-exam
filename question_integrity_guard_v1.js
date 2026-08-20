(()=>{
  if(window.__MUSIC_QUESTION_INTEGRITY_GUARD_V1__)return;
  window.__MUSIC_QUESTION_INTEGRITY_GUARD_V1__=true;

  const VERSION='20260820-v1';
  const SUBJECTS=['國中音樂','高中音樂','教育專業'];

  const str=v=>String(v??'').trim();
  const tagText=x=>Array.isArray(x)?x.join('；'):str(x);
  const clean=s=>str(s).toLowerCase().replace(/[\s\p{P}\p{S}]/gu,'');
  function stableHash(input){
    let h=2166136261>>>0;
    for(const ch of str(input)){h^=ch.codePointAt(0);h=Math.imul(h,16777619)>>>0;}
    return h.toString(36).toUpperCase();
  }
  function subjectCode(s){return s==='國中音樂'?'JH':s==='高中音樂'?'HS':s==='教育專業'?'EDU':'Q'}
  function metaText(x){
    return [x?.year,x?.subject,x?.level,x?.exam,x?.source,x?.source_title,x?.tag,tagText(x?.tags),x?.question,x?.q].map(str).filter(Boolean).join('｜');
  }
  function inferYear(x){
    const direct=Number(x?.year);
    if(direct>=106&&direct<=115)return String(direct);
    const m=metaText(x).match(/(?:^|\D)(10[6-9]|11[0-5])(?:\D|$)/);
    return m?m[1]:'';
  }
  function inferSubject(x,year){
    const direct=str(x?.subject);
    if(SUBJECTS.includes(direct))return direct;
    const level=str(x?.level),meta=metaText(x);
    if(level==='國中'||/國中.*音樂|音樂.*國中/.test(level))return '國中音樂';
    if(level==='高中'||/高中.*音樂|高級中等.*音樂|音樂.*高中/.test(level))return '高中音樂';
    if(/教育專業|教育學科|共同科目.*教育/.test(`${direct} ${level} ${meta}`))return '教育專業';
    if(/國中/.test(meta))return '國中音樂';
    if(/高中|高級中等/.test(meta))return '高中音樂';

    // Known compact legacy families with insufficient explicit metadata.
    const compact=!!x?.q && (Array.isArray(x?.opts)||Array.isArray(x?.options));
    const tags=`${str(x?.tag)} ${tagText(x?.tags)}`;
    if(compact&&year==='114'&&/114\s*中區/.test(tags))return '國中音樂';
    if(compact&&year==='115'&&/教育部/.test(tags))return '高中音樂';
    return direct||level||'';
  }
  function sourceDefaults(x,year,subject){
    const tags=`${str(x?.tag)} ${tagText(x?.tags)}`;
    if(year==='114'&&subject==='國中音樂'&&/114\s*中區/.test(tags)){
      x.exam=x.exam||'114 中區國中音樂';
      x.source=x.source||'114 中區縣市政府教師甄選策略聯盟 國中音樂';
      x.source_title=x.source_title||x.source;
      x.source_type=x.source_type||'歷屆考點改寫';
    }
    if(year==='115'&&subject==='高中音樂'&&/教育部/.test(tags)){
      x.exam=x.exam||'115 教育部高中聯招音樂科';
      x.source=x.source||'115 教育部受託辦理公立高級中等學校教師甄選 音樂科';
      x.source_title=x.source_title||x.source;
      x.source_type=x.source_type||'歷屆考點改寫';
    }
  }
  function normalizeRaw(x){
    if(!x||typeof x!=='object')return {changed:false,item:x};
    let changed=false;
    if(!str(x.question)&&str(x.q)){x.question=x.q;changed=true;}
    if(!Array.isArray(x.options)&&Array.isArray(x.opts)){x.options=x.opts;changed=true;}
    if(x.answer===undefined&&x.ans!==undefined){x.answer=x.ans;changed=true;}
    if(!str(x.explanation)&&str(x.ex)){x.explanation=x.ex;changed=true;}
    if((x.tags===undefined||x.tags===null||x.tags==='')&&str(x.tag)){x.tags=[x.tag];changed=true;}

    const year=inferYear(x);
    if(!str(x.year)&&year){x.year=year;changed=true;}
    const subject=inferSubject(x,year);
    if(!str(x.subject)&&SUBJECTS.includes(subject)){x.subject=subject;changed=true;}
    if(!str(x.level)&&subject==='國中音樂'){x.level='國中';changed=true;}
    if(!str(x.level)&&subject==='高中音樂'){x.level='高中';changed=true;}
    if(!str(x.level)&&subject==='教育專業'){x.level='教育專業';changed=true;}
    sourceDefaults(x,year,subject);

    if(!str(x.id)&&str(x.question)){
      x.id=`AUTO-${year||'NA'}-${subjectCode(subject)}-${stableHash(`${x.question}|${x.source||x.exam||''}`).slice(0,10)}`;
      changed=true;
    }
    return {changed,item:x};
  }
  function normalizeArray(arr){
    if(!Array.isArray(arr))return 0;
    let changed=0;
    for(const x of arr)if(normalizeRaw(x).changed)changed++;
    return changed;
  }
  function rawSignature(x){
    return `${str(x?.id)}|${clean(x?.question||x?.q)}|${clean(x?.source||x?.exam||x?.source_title)}`;
  }
  function mergeQuestionBank(){
    const bank=Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[];
    if(!bank.length)return 0;
    const extra=window.EXTRA_QUESTIONS=Array.isArray(window.EXTRA_QUESTIONS)?window.EXTRA_QUESTIONS:[];
    const seen=new Set(extra.map(rawSignature));
    let added=0;
    for(const q of bank){
      normalizeRaw(q);
      const sig=rawSignature(q);
      if(!clean(q?.question)||seen.has(sig))continue;
      extra.push(q);seen.add(sig);added++;
    }
    return added;
  }
  function repairLocalIdCollisions(){
    const local=Array.isArray(window.LOCAL_QUESTIONS)?window.LOCAL_QUESTIONS:[];
    const seen=new Map(),repairs=[];
    for(const q of local){
      normalizeRaw(q);
      const id=str(q?.id),sig=clean(q?.question);
      if(!id||!sig)continue;
      if(!seen.has(id)){seen.set(id,sig);continue;}
      if(seen.get(id)===sig)continue;
      const old=id;
      let next=`${old}~${stableHash(`${sig}|${q.source||q.exam||''}`).slice(0,6)}`;
      let n=2;
      while(seen.has(next)&&seen.get(next)!==sig)next=`${old}~${stableHash(sig).slice(0,5)}${n++}`;
      q.id=next;seen.set(next,sig);repairs.push({from:old,to:next,question:str(q.question)});
    }
    return repairs;
  }
  function invalidRawCounts(){
    const pools=[window.LOCAL_QUESTIONS,window.QUESTIONS,window.EXTRA_QUESTIONS,window.QUESTION_BANK].filter(Array.isArray);
    const all=pools.flat();
    return {
      missing_question:all.filter(x=>!str(x?.question||x?.q)).length,
      missing_answer:all.filter(x=>x?.answer===undefined&&x?.ans===undefined).length,
      missing_year:all.filter(x=>!inferYear(x)).length,
      missing_subject:all.filter(x=>!SUBJECTS.includes(inferSubject(x,inferYear(x)))).length
    };
  }
  let inRefresh=false;
  function refresh(reason='manual',{sync=true}={}){
    if(inRefresh)return window.MUSIC_QUESTION_INTEGRITY_SUMMARY_V1||null;
    inRefresh=true;
    try{
      let normalized=0;
      normalized+=normalizeArray(window.LOCAL_QUESTIONS);
      normalized+=normalizeArray(window.QUESTIONS);
      normalized+=normalizeArray(window.EXTRA_QUESTIONS);
      normalized+=normalizeArray(window.QUESTION_BANK);
      const questionBankAdded=mergeQuestionBank();
      normalized+=normalizeArray(window.EXTRA_QUESTIONS);
      const idRepairs=repairLocalIdCollisions();
      const summary={version:VERSION,reason,normalized,questionBankAdded,idRepairs,invalid:invalidRawCounts()};
      window.MUSIC_QUESTION_INTEGRITY_SUMMARY_V1=summary;
      window.dispatchEvent(new CustomEvent('musicQuestionIntegrityReady',{detail:summary}));
      if(sync&&(normalized||questionBankAdded||idRepairs.length))queueMicrotask(()=>window.MusicTeacherExam?.refreshData?.('integrity-guard'));
      return summary;
    }finally{inRefresh=false;}
  }

  // Loaded at the end of questionCore and again referenced near the end of questionArchive.
  // loadScript() de-duplicates the file; the listener below handles subsequently loaded archives.
  window.addEventListener('musicExamDataGroupReady',e=>refresh(e.detail?.name||'group-ready'));
  refresh('boot',{sync:false});
  window.MusicQuestionIntegrityGuardV1={refresh,normalizeRaw,inferYear,inferSubject,repairLocalIdCollisions,mergeQuestionBank};
})();
