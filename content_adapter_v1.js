(()=>{
  const questions=window.LOCAL_QUESTIONS=Array.isArray(window.LOCAL_QUESTIONS)?window.LOCAL_QUESTIONS:[];
  const questionIds=new Set(questions.map(x=>String(x.id||'')));
  const letters=['A','B','C','D'];
  (window.EXTRA_QUESTIONS||[]).forEach((x,i)=>{
    const id=String(x.id||`Q-BACKFILL-${String(i+1).padStart(3,'0')}`);if(questionIds.has(id))return;
    const opts=Array.isArray(x.options)?x.options:[x.option_a,x.option_b,x.option_c,x.option_d];
    const ans=typeof x.answer==='number'?letters[x.answer]:(String(x.answer||'').toUpperCase());
    questions.push({
      id,year:String(x.year||''),
      subject:x.subject||(x.level==='國中'?'國中音樂':x.level==='高中'?'高中音樂':(x.level||'高中音樂')),
      level:x.difficulty||x.level||'中',topic:x.topic||x.category||'音樂專業',
      question:x.question||'',option_a:opts[0]||'',option_b:opts[1]||'',option_c:opts[2]||'',option_d:opts[3]||'',answer:ans,
      explanation:x.explanation||x.answerExplanation||'',
      exam:x.exam||x.source||'',source_title:x.source_title||x.source||'',source_url:x.url||x.source_url||'',source_type:x.source_type||'歷屆考點改寫',
      tags:Array.isArray(x.tags)?x.tags.join('；'):(x.tags||''),
      option_explanations:x.option_explanations||{},discrimination_level:x.discrimination_level||null
    });questionIds.add(id);
  });

  const terms=window.TERM_PROMPTS=Array.isArray(window.TERM_PROMPTS)?window.TERM_PROMPTS:[];
  const termKeys=new Set(terms.map(x=>`${x.term||''}|${x.exam||''}`));
  (window.MUSIC_TEACHER_TERMS||[]).forEach((x,i)=>{
    const key=`${x.term||''}|${x.source||''}`;if(termKeys.has(key))return;
    terms.push({id:x.id||`TERM-BACKFILL-${String(i+1).padStart(3,'0')}`,term:x.term||x.name||'',zh:x.zh||x.chinese||'',topic:x.topic||x.category||'音樂專業',level:x.level==='國中'?'國中音樂':x.level==='高中'?'高中音樂':(x.level||'高中音樂'),definition:x.definition||x.answer||'',exam:[x.year?`${x.year}年`:null,x.source,x.difficulty?`難度：${x.difficulty}`:null].filter(Boolean).join('｜'),related:Array.isArray(x.related)?x.related.join('；'):(x.related||x.examTips||x.keywords||''),model_answer:x.model_answer||x.fullAnswer||x.definition||''});termKeys.add(key);
  });

  const essays=window.ESSAY_PROMPTS=Array.isArray(window.ESSAY_PROMPTS)?window.ESSAY_PROMPTS:[];
  const essayKeys=new Set(essays.map(x=>x.question||''));
  (window.MUSIC_TEACHER_ESSAYS||[]).forEach((x,i)=>{
    const q=x.question||x.title||'';if(!q||essayKeys.has(q))return;const outline=Array.isArray(x.outline)?x.outline.join('\n'):'';
    essays.push({id:x.id||`ESSAY-BACKFILL-${String(i+1).padStart(3,'0')}`,level:x.level==='國中'?'國中音樂':x.level==='高中'?'高中音樂':(x.level||'高中音樂'),topic:x.topic||x.category||((x.keywords||[])[0])||'申論／試教',question:q,hint:outline||x.hint||'先寫核心概念，再以教學流程、學生任務、評量與反思具體展開。',model_answer:x.model_answer||x.fullAnswer||outline||'',source:x.source||'',year:x.year||''});essayKeys.add(q);
  });
  window.dispatchEvent(new CustomEvent('musicTeacherContentAdapted',{detail:{questions:questions.length,terms:terms.length,essays:essays.length}}));
})();