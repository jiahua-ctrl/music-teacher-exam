(()=>{
  const qs=window.MusicTeacherExam?.questions||window.LOCAL_QUESTIONS||[];
  const years=Array.from({length:10},(_,i)=>String(106+i));
  const subjects=['國中音樂','高中音樂','教育專業'];
  const valid=q=>String(q?.question||'').trim()&&String(q?.answer??'').trim()&&years.includes(String(q?.year||''))&&subjects.includes(String(q?.subject||''));
  const duplicates=new Map();
  for(const q of qs){const id=String(q?.id||'');if(!id)continue;if(!duplicates.has(id))duplicates.set(id,[]);duplicates.get(id).push(q);}
  const badIds=[...duplicates.entries()].filter(([,g])=>new Set(g.map(q=>String(q.question||''))).size>1).map(([id,g])=>({id,count:g.length}));
  const result={
    total:qs.length,valid:qs.filter(valid).length,invalid:qs.filter(q=>!valid(q)).length,
    byYearSubject:Object.fromEntries(years.flatMap(y=>subjects.map(s=>[`${y}|${s}`,qs.filter(q=>String(q.year)===y&&q.subject===s&&valid(q)).length]))),
    unresolvedIdCollisions:badIds,
    integrity:window.MUSIC_QUESTION_INTEGRITY_SUMMARY_V1||null,
    canonical:{
      count:window.MUSIC_CANONICAL_DEDUPE_V2?.canonicalCount??null,
      duplicateGroups:window.MUSIC_CANONICAL_DEDUPE_V2?.duplicateGroups??null,
      duplicateItems:window.MUSIC_CANONICAL_DEDUPE_V2?.duplicateItems??null
    },
    reviewQueue:{
      total:window.MUSIC_CANONICAL_REVIEW_QUEUE_V1?.total??null,
      p0:window.MUSIC_CANONICAL_REVIEW_QUEUE_V1?.p0??null,
      p1:window.MUSIC_CANONICAL_REVIEW_QUEUE_V1?.p1??null
    },
    inventory:window.MUSIC_INVENTORY_106_115?.totals||null
  };
  window.MUSIC_RUNTIME_AUDIT_106_115=result;
  console.table(result.byYearSubject);
  console.log('[music-exam runtime audit]',result);
  return result;
})();
