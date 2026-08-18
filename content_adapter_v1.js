(()=>{
  const terms=window.TERM_PROMPTS=Array.isArray(window.TERM_PROMPTS)?window.TERM_PROMPTS:[];
  const termKeys=new Set(terms.map(x=>`${x.term||''}|${x.exam||''}`));
  (window.MUSIC_TEACHER_TERMS||[]).forEach((x,i)=>{
    const key=`${x.term||''}|${x.source||''}`;if(termKeys.has(key))return;
    terms.push({
      id:x.id||`TERM-BACKFILL-${String(i+1).padStart(3,'0')}`,
      term:x.term||x.name||'',zh:x.zh||x.chinese||'',
      topic:x.topic||x.category||'音樂專業',
      level:x.level==='國中'?'國中音樂':x.level==='高中'?'高中音樂':(x.level||'高中音樂'),
      definition:x.definition||x.answer||'',
      exam:[x.year?`${x.year}年`:null,x.source,x.difficulty?`難度：${x.difficulty}`:null].filter(Boolean).join('｜'),
      related:Array.isArray(x.related)?x.related.join('；'):(x.related||x.examTips||x.keywords||''),
      model_answer:x.model_answer||x.fullAnswer||x.definition||''
    });termKeys.add(key);
  });

  const essays=window.ESSAY_PROMPTS=Array.isArray(window.ESSAY_PROMPTS)?window.ESSAY_PROMPTS:[];
  const essayKeys=new Set(essays.map(x=>x.question||''));
  (window.MUSIC_TEACHER_ESSAYS||[]).forEach((x,i)=>{
    const q=x.question||x.title||'';if(!q||essayKeys.has(q))return;
    const outline=Array.isArray(x.outline)?x.outline.join('\n'):'';
    essays.push({
      id:x.id||`ESSAY-BACKFILL-${String(i+1).padStart(3,'0')}`,
      level:x.level==='國中'?'國中音樂':x.level==='高中'?'高中音樂':(x.level||'高中音樂'),
      topic:x.topic||x.category||((x.keywords||[])[0])||'申論／試教',
      question:q,
      hint:outline||x.hint||'先寫核心概念，再以教學流程、學生任務、評量與反思具體展開。',
      model_answer:x.model_answer||x.fullAnswer||outline||'',
      source:x.source||'',year:x.year||''
    });essayKeys.add(q);
  });

  window.dispatchEvent(new CustomEvent('musicTeacherContentAdapted',{detail:{terms:terms.length,essays:essays.length}}));
})();