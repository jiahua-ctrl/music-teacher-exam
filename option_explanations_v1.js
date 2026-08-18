(()=>{
 const qs=Array.isArray(window.LOCAL_QUESTIONS)?window.LOCAL_QUESTIONS:[];
 const letters=['A','B','C','D'];
 const fields={A:'option_a',B:'option_b',C:'option_c',D:'option_d'};
 const clean=s=>String(s||'').trim();
 function explicit(q,k){
  const keys=[`option_${k.toLowerCase()}_explanation`,`explanation_${k.toLowerCase()}`,`why_${k.toLowerCase()}`];
  for(const key of keys)if(clean(q[key]))return clean(q[key]);
  if(q.option_explanations&&clean(q.option_explanations[k]))return clean(q.option_explanations[k]);
  return '';
 }
 function fallback(q,k){
  const text=clean(q[fields[k]]),isAnswer=k===q.answer,main=clean(q.explanation);
  if(isAnswer)return main||`此選項為本題正解。複習時請把「${text}」與題幹要求的核心概念建立連結。`;
  // 舊題若沒有逐項資料，不假裝知道錯誤選項的精確錯因；顯示待補核對，避免製造錯誤知識。
  return `此選項不是本題答案。舊題目前尚未建立「${text}」的獨立錯因詳解；先記住它與正解的差異，後續會依原始試題與可靠資料逐題補齊。`;
 }
 qs.forEach(q=>{
  q.option_explanations=q.option_explanations||{};
  letters.forEach(k=>{if(!clean(q.option_explanations[k]))q.option_explanations[k]=explicit(q,k)||fallback(q,k)});
  q.review_focus=q.review_focus||q.canonical_concept||q.topic||'';
 });
 window.getMusicOptionExplanations=q=>letters.map(k=>({key:k,text:clean(q?.[fields[k]]),correct:k===q?.answer,explanation:clean(q?.option_explanations?.[k])||fallback(q||{},k)}));
 window.MUSIC_OPTION_EXPLANATION_POLICY={version:1,rule:'每個選項都要說明；若舊題尚未核對錯因，明確標示待補，不自動杜撰。'};
})();