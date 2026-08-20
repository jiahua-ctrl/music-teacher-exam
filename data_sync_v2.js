(()=>{
  if(window.__MUSIC_EXAM_DATA_SYNC_V2__)return;
  window.__MUSIC_EXAM_DATA_SYNC_V2__=true;

  const api=window.MusicTeacherExam;
  if(!api)return;
  const coreQuestions=api.questions;
  const coreTerms=api.terms;
  const coreEssays=api.essays;
  const letters=['A','B','C','D'];

  const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const keyOf=(x,kind)=>{
    if(kind==='q')return String(x?.id||`${x?.question||''}|${x?.exam||''}`);
    if(kind==='t')return String(x?.id||`${x?.term||x?.name||''}|${x?.exam||x?.source||''}`);
    return String(x?.id||x?.question||x?.title||'');
  };
  function mergeInto(target,sources,kind,mapper=x=>x){
    const seen=new Set(target.map(x=>keyOf(x,kind)).filter(Boolean));
    let added=0;
    for(const source of sources){
      if(!Array.isArray(source))continue;
      for(const raw of source){
        const item=mapper(raw);
        if(!item)continue;
        const key=keyOf(item,kind);
        if(!key||seen.has(key))continue;
        target.push(item);seen.add(key);added++;
      }
    }
    return added;
  }
  function mapLegacyQuestion(x,i){
    if(!x)return null;
    if(x.option_a!==undefined)return x;
    const opts=Array.isArray(x.options)?x.options:[x.option_a,x.option_b,x.option_c,x.option_d];
    const answer=typeof x.answer==='number'?letters[x.answer]:(String(x.answer||'').toUpperCase());
    return {
      id:x.id||`V2-Q-${i}-${String(x.question||'').slice(0,18)}`,
      year:String(x.year||''),subject:x.subject||(x.level==='國中'?'國中音樂':x.level==='高中'?'高中音樂':x.level||'高中音樂'),
      level:x.difficulty||x.level||'中',topic:x.topic||x.category||'音樂專業',question:x.question||'',
      option_a:opts?.[0]||'',option_b:opts?.[1]||'',option_c:opts?.[2]||'',option_d:opts?.[3]||'',answer,
      explanation:x.explanation||x.answerExplanation||'',exam:x.exam||x.source||'',source_title:x.source_title||x.source||'',
      source_url:x.url||x.source_url||'',source_type:x.source_type||'歷屆考點改寫',tags:Array.isArray(x.tags)?x.tags.join('；'):(x.tags||'')
    };
  }
  function mapLegacyTerm(x,i){
    if(!x)return null;
    if(x.definition!==undefined&&x.term!==undefined)return x;
    return {
      id:x.id||`V2-T-${i}-${x.term||x.name||''}`,term:x.term||x.name||'',zh:x.zh||x.chinese||'',
      topic:x.topic||x.category||'音樂專業',level:x.level==='國中'?'國中音樂':x.level==='高中'?'高中音樂':(x.level||'高中音樂'),
      definition:x.definition||x.answer||'',exam:[x.year?`${x.year}年`:null,x.source,x.difficulty?`難度：${x.difficulty}`:null].filter(Boolean).join('｜'),
      related:Array.isArray(x.related)?x.related.join('；'):(x.related||x.examTips||x.keywords||''),model_answer:x.model_answer||x.fullAnswer||x.definition||x.answer||''
    };
  }
  function mapLegacyEssay(x,i){
    if(!x)return null;
    if(x.question!==undefined&&x.hint!==undefined)return x;
    const q=x.question||x.title||'';if(!q)return null;
    const outline=Array.isArray(x.outline)?x.outline.join('\n'):'';
    return {id:x.id||`V2-E-${i}`,level:x.level==='國中'?'國中音樂':x.level==='高中'?'高中音樂':(x.level||'高中音樂'),
      topic:x.topic||x.category||((x.keywords||[])[0])||'申論／試教',question:q,
      hint:outline||x.hint||'先寫核心概念，再以教學流程、學生任務、評量與反思具體展開。',
      model_answer:x.model_answer||x.fullAnswer||outline||'',source:x.source||'',year:x.year||''};
  }

  function refreshUi(){
    const total=document.getElementById('totalQuestions');if(total)total.textContent=coreQuestions.length;
    const status=document.getElementById('dataStatus');
    if(status){
      const sourced=coreQuestions.filter(q=>q.source_type&&q.source_type!=='自編練習').length;
      status.textContent=`目前 ${coreQuestions.length} 題選擇題＋${coreTerms.length} 題名詞解釋＋${coreEssays.length} 題申論／試教挑戰，其中 ${sourced} 題選擇題具近年考點來源標示。`;
    }
    const yearEl=document.getElementById('yearFilter'),topicEl=document.getElementById('topicFilter');
    if(yearEl&&topicEl){
      const y=yearEl.value,t=topicEl.value;
      const years=[...new Set(coreQuestions.map(q=>q.year).filter(Boolean))].sort((a,b)=>Number(b)-Number(a));
      const topics=[...new Set(coreQuestions.map(q=>q.topic).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'zh-Hant'));
      yearEl.innerHTML='<option value="">全部年度</option>'+years.map(v=>`<option value="${esc(v)}">${esc(v)} 年</option>`).join('');
      topicEl.innerHTML='<option value="">全部主題</option>'+topics.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');
      if(years.includes(y))yearEl.value=y;if(topics.includes(t))topicEl.value=t;
    }
    const count=document.getElementById('filterCount');if(count)count.textContent=`目前條件可練習 ${coreQuestions.length} 題；可再用年度／學段／主題縮小範圍。`;
  }

  function refresh(reason='lazy'){
    let added=0;
    added+=mergeInto(coreQuestions,[window.LOCAL_QUESTIONS], 'q', x=>x);
    added+=mergeInto(coreQuestions,[window.QUESTIONS,window.EXTRA_QUESTIONS], 'q', mapLegacyQuestion);
    added+=mergeInto(coreTerms,[window.TERM_PROMPTS], 't', x=>x);
    added+=mergeInto(coreTerms,[window.MUSIC_TEACHER_TERMS], 't', mapLegacyTerm);
    added+=mergeInto(coreEssays,[window.ESSAY_PROMPTS], 'e', x=>x);
    added+=mergeInto(coreEssays,[window.MUSIC_TEACHER_ESSAYS], 'e', mapLegacyEssay);
    window.LOCAL_QUESTIONS=coreQuestions;
    window.TERM_PROMPTS=coreTerms;
    window.ESSAY_PROMPTS=coreEssays;
    refreshUi();
    window.dispatchEvent(new CustomEvent('musicExamDataSynced',{detail:{reason,added,questions:coreQuestions.length,terms:coreTerms.length,essays:coreEssays.length}}));
    return added;
  }

  api.refreshData=refresh;
  window.addEventListener('musicExamDataGroupReady',e=>refresh(e.detail?.name||'group'));
  window.addEventListener('musicTeacherContentAdapted',()=>refresh('adapter'));
  refresh('boot');
  window.MusicExamDataSyncV2={refresh};
})();
