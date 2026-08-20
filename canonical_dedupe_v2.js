(()=>{
  if(window.__MUSIC_CANONICAL_DEDUPE_V2__)return;
  window.__MUSIC_CANONICAL_DEDUPE_V2__=true;

  const VERSION='20260820-v2';
  const GENERIC_STEM=/下列|何者|關於|正確|錯誤|最適切|不正確|不適切|敘述|選項|以下|其中|有關/g;
  const GENERIC_ANSWERS=new Set(['以上皆是','以上皆非','皆是','皆非','無法判斷','以上皆正確','以上皆錯誤']);
  const PRIORITY={EXACT_DUPLICATE:3,SOURCE_VARIANT:2,CONCEPT_DUPLICATE:1};

  const CONCEPT_RULES=[
    ['臺灣／本土音樂',/鄧雨賢|陳達|呂泉生|馬水龍|蕭泰然|許常惠|史惟亮|王雲峰|歌仔|南管|北管|客家|月琴|四月望雨|桃花泣血記/],
    ['原住民族音樂',/pasibutbut|祈禱小米豐收歌|pasta.?ay|矮靈祭|鼻笛|布農|排灣|阿美|原住民|五年祭/],
    ['世界音樂',/gamelan|raga|khoomei|呼麥|pansori|fado|kora|bunraku|tala|世界音樂/],
    ['音樂教育法',/kod[aá]ly|柯大宜|dalcroze|達克羅|eurhythm|orff|奧福|gordon|audiation|praxial|elliott|curwen/],
    ['中世紀音樂',/gregorian|plain.?chant|troubadour|guido|hexachord|ars nova|ars antiqua|notre dame|isorhythm/],
    ['文藝復興音樂',/cori spezzati|madrigal|dufay|franco.?flemish|文藝復興|ricercar/],
    ['巴洛克音樂',/passacaglia|ritornello|sonata da chiesa|sonata da camera|passion|vivaldi|bach|巴洛克|bwv/],
    ['古典／浪漫音樂',/gluck|schubert|lied|new german school|leitmotif|wagner|bayreuth|romantic|浪漫|古典時期/],
    ['20世紀音樂技法',/prepared piano|john cage|aleator|serial|musique concr[eè]te|microton|polyton|mystic chord|sprechstimme|gebrauchsmusik|wozzeck|penderecki|var[eè]se/],
    ['爵士／流行音樂',/ragtime|free jazz|cool jazz|bossa|funk|swing|jazz|爵士|hip.?hop|嘻哈/],
    ['和聲／調式',/neapolitan|增六|augmented sixth|dorian|mixolydian|cadence|終止|和聲外音|neighbor|suspension|半減七|和弦|調式/],
    ['曲式／動機技法',/binary|ternary|through.?composed|inversion|retrograde|sequence|augmentation|曲式|動機/],
    ['移調／樂器法',/移調|薩克斯|法國號|豎笛|總譜|c譜表|中音譜表|次中音譜表|樂器法/],
    ['音樂科技／AI',/spectrogram|聲譜|podcast|creative commons|audacity|sibelius|人工智慧|數位音樂|採樣率|analog recording|\bai\b/],
    ['雙語／CLIL',/clil|emi|immersion|雙語|multimodal|多模態/],
    ['議題／SDGs／SEL',/sdgs|sel|社會情緒|性別|人權|環境|海洋|媒體素養/],
    ['課綱／素養／評量',/核心素養|素養導向|藝術領域|學習表現|學習內容|多元評量|差異化|形成性評量|總結性評量/],
    ['歌劇／音樂劇／劇場',/opera|oratorio|takarazuka|triple threat|gesamtkunstwerk|音樂劇|歌劇|寶塚/],
    ['教育法規與制度',/學生輔導法|教師法|教育基本法|國民教育法|性別平等教育法|特殊教育法|校園霸凌|法規|行政程序|教師評審委員會|教評會/],
    ['教育心理學',/皮亞傑|piaget|維高斯基|vygotsky|鷹架|近側發展區|增強|制約|認知負荷|後設認知|自我效能|歸因|動機/],
    ['教育社會學',/文化資本|b口?ourdieu|再製|符應|標籤理論|功能論|衝突論|社會學/],
    ['教育哲學',/杜威|dewey|赫爾巴特|存在主義|實用主義|永恆主義|進步主義|教育哲學/],
    ['輔導與學生事務',/輔導|諮商|三級輔導|發展性輔導|介入性輔導|處遇性輔導|生涯|危機處理/],
    ['課程教學與評量',/課程|教學|評量|布魯姆|bloom|合作學習|探究|問題導向|差異化教學|素養導向/],
    ['班級經營',/班級經營|常規|親師溝通|教師期望|班級氣氛|管教/]
  ];

  const READABLE_REGISTRY=[
    {id:'C-TW-CHENDA-YUEQIN',label:'陳達－月琴',match:(q,a,t)=>/陳達/.test(t)&&/月琴/.test(a)},
    {id:'C-CN-ERHU-SAIMA',label:'《賽馬》－二胡',match:(q,a,t)=>/賽馬/.test(t)&&/二胡/.test(a)},
    {id:'C-NOTATION-MEZZOSOPRANO-CLEF',label:'中音譜表／C譜表定位',match:(q,a,t)=>/(中音譜表|c譜表|C譜表)/i.test(t)&&/(第三間|f|fa|第四線)/i.test(`${a} ${t}`)},
    {id:'C-BAROQUE-BACH-BWV596-VIVALDI',label:'Bach BWV 596－Vivaldi',match:(q,a,t)=>/bwv\s*596/i.test(t)&&/vivaldi|韋瓦第/i.test(`${a} ${t}`)}
  ];

  function qs(){return window.MusicTeacherExam?.questions||window.LOCAL_QUESTIONS||[];}
  function clean(s){return String(s??'').toLowerCase().normalize('NFKC').replace(GENERIC_STEM,'').replace(/[\s\p{P}\p{S}]/gu,'');}
  function loose(s){return String(s??'').toLowerCase().normalize('NFKC').replace(/[\s\p{P}\p{S}]/gu,'');}
  function stableHash(input){let h=2166136261>>>0;for(const ch of String(input||'')){h^=ch.codePointAt(0);h=Math.imul(h,16777619)>>>0;}return h.toString(36).toUpperCase();}
  function subjectCode(s){return s==='國中音樂'?'JH':s==='高中音樂'?'HS':s==='教育專業'?'EDU':'GEN';}
  function optionTexts(q){return [q.option_a,q.option_b,q.option_c,q.option_d].map(x=>String(x||''));}
  function answerText(q){
    const a=String(q.answer||'').trim();
    const idx={A:0,B:1,C:2,D:3}[a.toUpperCase()];
    if(idx!==undefined){const t=optionTexts(q)[idx];return t||a;}
    if(/^\d+$/.test(a)){const n=Number(a);if(n>=0&&n<=3)return optionTexts(q)[n]||a;if(n>=1&&n<=4)return optionTexts(q)[n-1]||a;}
    return a;
  }
  function inferConcept(q){
    if(q.canonical_concept&&q.canonical_concept!=='其他')return q.canonical_concept;
    const t=`${q.topic||''} ${q.question||''} ${q.explanation||''} ${q.tags||''}`;
    const hit=CONCEPT_RULES.find(([,re])=>re.test(t));
    return hit?.[0]||q.topic||q.subject||'其他';
  }
  function grams(s){
    const out=new Set();
    const raw=String(s||'').toLowerCase().normalize('NFKC');
    for(const m of raw.matchAll(/[a-z][a-z0-9.-]{1,}|\d{2,}/g))out.add(m[0]);
    for(const m of raw.matchAll(/[\p{Script=Han}]{2,}/gu)){
      const run=m[0];
      if(run.length<=4)out.add(run);
      for(let i=0;i<run.length-1;i++)out.add(run.slice(i,i+2));
      for(let i=0;i<run.length-2;i++)out.add(run.slice(i,i+3));
    }
    return out;
  }
  function jaccard(a,b){if(!a.size&&!b.size)return 1;let n=0;for(const x of a)if(b.has(x))n++;return n/(a.size+b.size-n||1);}
  function diceText(a,b){
    const x=clean(a),y=clean(b);if(!x&&!y)return 1;if(x===y)return 1;
    const bg=s=>{const m=new Map();for(let i=0;i<s.length-1;i++){const g=s.slice(i,i+2);m.set(g,(m.get(g)||0)+1)}return m};
    const A=bg(x),B=bg(y);let inter=0,total=0;for(const v of A.values())total+=v;for(const v of B.values())total+=v;for(const [k,v] of A)inter+=Math.min(v,B.get(k)||0);return total?2*inter/total:0;
  }
  function sourceKey(q){return [q.year||'',q.subject||'',loose(q.exam||q.source_title||q.source||'')].join('|');}
  function exactSig(q){return [clean(q.question),...optionTexts(q).map(clean),String(q.answer||'').toUpperCase()].join('|');}
  function answerNorm(q){return clean(answerText(q));}
  function textFor(q){return `${q.question||''} ${q.explanation||''} ${q.topic||''} ${q.tags||''}`;}
  function qualityScore(q){
    let s=0;if(q.quality_status==='verified')s+=20;if(q.quality_status==='invalid')s-=50;
    if(q.source_url)s+=6;if(q.source_type&&q.source_type!=='自編練習')s+=5;
    s+=Math.min(8,String(q.explanation||'').length/80);s+=Math.min(5,String(q.question||'').length/60);
    if(answerText(q))s+=3;return s;
  }
  function addEdge(edges,a,b,type,score){const key=a<b?`${a}|${b}`:`${b}|${a}`;const old=edges.get(key);if(!old||PRIORITY[type]>PRIORITY[old.type]||(PRIORITY[type]===PRIORITY[old.type]&&score>old.score))edges.set(key,{a,b,type,score});}
  class UF{constructor(n){this.p=Array.from({length:n},(_,i)=>i);this.r=Array(n).fill(0)}find(x){while(this.p[x]!==x){this.p[x]=this.p[this.p[x]];x=this.p[x]}return x}union(a,b){a=this.find(a);b=this.find(b);if(a===b)return;if(this.r[a]<this.r[b])[a,b]=[b,a];this.p[b]=a;if(this.r[a]===this.r[b])this.r[a]++}}
  function bucketPush(map,key,i){if(!key)return;if(!map.has(key))map.set(key,[]);map.get(key).push(i);}
  function pairBucket(group,fn){for(let a=0;a<group.length;a++)for(let b=a+1;b<group.length;b++)fn(group[a],group[b]);}
  function registryMatch(q){
    for(const rule of READABLE_REGISTRY){if(rule.match(q,answerText(q),textFor(q)))return rule;}
    return null;
  }
  function readableId(group,concept,ans){
    for(const rule of READABLE_REGISTRY){if(group.some(q=>rule.match(q,answerText(q),textFor(q))))return {id:rule.id,label:rule.label};}
    const anchors=[...group.map(q=>grams(`${q.question||''} ${answerText(q)}`)).reduce((acc,set)=>{
      if(acc===null)return new Set(set);return new Set([...acc].filter(x=>set.has(x)));
    },null)||[]].filter(x=>x.length>=2&&!/^\d+$/.test(x)).sort((a,b)=>b.length-a.length||a.localeCompare(b,'zh-Hant')).slice(0,3);
    const label=[concept,answerText(group.sort((a,b)=>qualityScore(b)-qualityScore(a))[0])].filter(Boolean).join('｜');
    const key=[concept,ans,anchors.join('|')].join('|');
    return {id:`C-${subjectCode(group[0]?.subject)}-${stableHash(key)}`,label:label||concept};
  }
  function scanRawIdCollisions(){
    const pools=[window.LOCAL_QUESTIONS,window.QUESTIONS,window.EXTRA_QUESTIONS,window.QUESTION_BANK].filter(Array.isArray);
    const byId=new Map();
    for(const pool of pools)for(const q of pool){const id=String(q?.id||'').trim();if(!id)continue;const sig=clean(q.question||q.q||'');if(!sig)continue;if(!byId.has(id))byId.set(id,new Set());byId.get(id).add(sig);}
    return [...byId.entries()].filter(([,s])=>s.size>1).map(([id,s])=>({id,variants:s.size}));
  }

  function rebuild(reason='manual'){
    const all=qs().filter(q=>q&&String(q.question||'').trim());
    all.forEach(q=>{
      q.canonical_concept=inferConcept(q);
      q.canonical_concepts=q.canonical_concepts?.length?q.canonical_concepts:[q.canonical_concept];
      delete q.canonical_id_v2;delete q.canonical_key_v2;delete q.canonical_group_size_v2;delete q.canonical_representative_v2;delete q.duplicate_status_v2;delete q.duplicate_rank_v2;
    });
    const uf=new UF(all.length),edges=new Map();
    const exact=new Map(),sourceAnswer=new Map(),conceptAnswer=new Map(),registryBuckets=new Map();
    all.forEach((q,i)=>{
      bucketPush(exact,exactSig(q),i);
      const ans=answerNorm(q),concept=inferConcept(q),registry=registryMatch(q);
      if(registry)bucketPush(registryBuckets,registry.id,i);
      if(ans&&!GENERIC_ANSWERS.has(answerText(q)))bucketPush(sourceAnswer,`${sourceKey(q)}|${ans}`,i);
      if(ans&&!GENERIC_ANSWERS.has(answerText(q))&&ans.length>=2)bucketPush(conceptAnswer,`${concept}|${ans}`,i);
    });
    for(const group of exact.values())if(group.length>1)pairBucket(group,(a,b)=>{addEdge(edges,a,b,'EXACT_DUPLICATE',1);uf.union(a,b)});
    // High-confidence knowledge keys override wording differences. Same source = rewrite variant; cross-source = recurring concept.
    for(const group of registryBuckets.values())if(group.length>1)pairBucket(group,(a,b)=>{
      const A=all[a],B=all[b],type=sourceKey(A)===sourceKey(B)?'SOURCE_VARIANT':'CONCEPT_DUPLICATE';
      addEdge(edges,a,b,type,1);uf.union(a,b);
    });
    for(const group of sourceAnswer.values())if(group.length>1)pairBucket(group,(a,b)=>{
      const A=all[a],B=all[b];if(exactSig(A)===exactSig(B))return;
      const d=diceText(A.question,B.question),j=jaccard(grams(textFor(A)),grams(textFor(B)));
      if(d>=0.72||j>=0.48){addEdge(edges,a,b,'SOURCE_VARIANT',Math.max(d,j));uf.union(a,b)}
    });
    for(const group of conceptAnswer.values())if(group.length>1)pairBucket(group,(a,b)=>{
      const A=all[a],B=all[b];if(uf.find(a)===uf.find(b))return;
      const d=diceText(A.question,B.question),j=jaccard(grams(textFor(A)),grams(textFor(B)));
      if(d>=0.60||j>=0.38){addEdge(edges,a,b,'CONCEPT_DUPLICATE',Math.max(d,j));uf.union(a,b)}
    });

    const groups=new Map();all.forEach((q,i)=>{const r=uf.find(i);if(!groups.has(r))groups.set(r,[]);groups.get(r).push(i)});
    const typeCount={EXACT_DUPLICATE:0,SOURCE_VARIANT:0,CONCEPT_DUPLICATE:0};
    let duplicateItems=0,duplicateGroups=0;
    const groupSummaries=[];
    for(const ids of groups.values()){
      const members=ids.map(i=>all[i]);
      const concept=inferConcept(members[0]),ans=answerNorm(members[0]);
      const rid=readableId([...members],concept,ans);
      const idSet=new Set(ids),edgeTypes=[...new Set([...edges.values()].filter(e=>idSet.has(e.a)&&idSet.has(e.b)).map(e=>e.type))];
      if(ids.length>1){duplicateGroups++;duplicateItems+=ids.length;for(const t of edgeTypes)typeCount[t]++;}
      const ranked=[...members].sort((a,b)=>qualityScore(b)-qualityScore(a)||String(a.id||'').localeCompare(String(b.id||'')));
      const representative=ranked[0];
      const relationToRepresentative=(q)=>{
        if(q===representative)return 'UNIQUE';
        if(exactSig(q)===exactSig(representative))return 'EXACT_DUPLICATE';
        if(sourceKey(q)===sourceKey(representative))return 'SOURCE_VARIANT';
        return 'CONCEPT_DUPLICATE';
      };
      ranked.forEach((q,rank)=>{
        const relation=relationToRepresentative(q);
        q.canonical_id=rid.id;q.canonical_id_v2=rid.id;q.canonical_label=rid.label;q.canonical_key_v2=`${concept}|${ans}`;
        q.canonical_group_size_v2=members.length;q.canonical_representative_v2=q===representative;
        q.duplicate_status=relation;q.duplicate_status_v2=relation;q.duplicate_rank_v2=rank+1;
        q.duplicate_group=members.length>1?`DUPV2-${rid.id}`:null;q.duplicate_rank=rank+1;
        q.related_concept_group=concept;
        q.quality_tags=[...new Set(q.quality_tags||[])];
        if(members.length>1&&rank>0&&!q.quality_tags.includes('♻️疑似重複'))q.quality_tags.push('♻️疑似重複');
        if(relation==='SOURCE_VARIANT'&&!q.quality_tags.includes('🧬同源改寫'))q.quality_tags.push('🧬同源改寫');
      });
      const groupType=edgeTypes.length>1?'MIXED':(edgeTypes[0]||'UNIQUE');
      groupSummaries.push({canonical_id:rid.id,label:rid.label,concept,type:groupType,edge_types:edgeTypes,size:members.length,representative_id:representative.id||'',member_ids:members.map(q=>q.id||'')});
    }
    const collisions=scanRawIdCollisions();
    const summary={
      version:VERSION,reason,total:all.length,canonicalCount:groups.size,duplicateGroups,duplicateItems,
      exactGroups:typeCount.EXACT_DUPLICATE,sourceVariantGroups:typeCount.SOURCE_VARIANT,conceptDuplicateGroups:typeCount.CONCEPT_DUPLICATE,
      idCollisions:collisions,reviewGroups:groupSummaries.filter(g=>g.type!=='UNIQUE'&&g.size>=2),groups:groupSummaries,
      thresholds:{sourceVariant:{stemDice:0.72,tokenJaccard:0.48},conceptDuplicate:{stemDice:0.60,tokenJaccard:0.38}}
    };
    window.MUSIC_CANONICAL_DEDUPE_V2=summary;
    window.MUSIC_CANONICAL_SUMMARY_V2=summary;
    window.dispatchEvent(new CustomEvent('musicCanonicalDedupeReady',{detail:summary}));
    // compatibility: duplicate_ladder_v2 listens to the old event name.
    window.dispatchEvent(new CustomEvent('musicTeacherCanonicalReady',{detail:summary}));
    return summary;
  }

  let timer=null;
  const schedule=(reason)=>{clearTimeout(timer);timer=setTimeout(()=>rebuild(reason),0);};
  window.addEventListener('musicExamDataSynced',e=>schedule(e.detail?.reason||'data-synced'));
  window.addEventListener('musicExamDataGroupReady',e=>schedule(e.detail?.name||'group-ready'));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule('dom-ready'),{once:true});
  else schedule('boot');

  window.MusicCanonicalDedupeV2={rebuild,clean,grams,jaccard,diceText,answerText,inferConcept,scanRawIdCollisions};
})();
