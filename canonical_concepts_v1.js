(()=>{
 const qs=Array.isArray(window.LOCAL_QUESTIONS)?window.LOCAL_QUESTIONS:[];
 const norm=s=>String(s||'').toLowerCase().replace(/下列|何者|關於|正確|錯誤|最適切|不正確|不適切/g,'').replace(/[\s\p{P}\p{S}]/gu,'');
 const concepts=[
  ['臺灣／本土音樂',/鄧雨賢|陳達|呂泉生|馬水龍|蕭泰然|許常惠|史惟亮|王雲峰|歌仔|南管|北管|客家|月琴|四月望雨|桃花泣血記/],
  ['原住民族音樂',/pasibutbut|祈禱小米豐收歌|pasta.?ay|矮靈祭|鼻笛|布農|排灣|阿美|原住民|五年祭/],
  ['世界音樂',/gamelan|raga|khoomei|呼麥|pansori|fado|kora|bunraku|tala|世界音樂/],
  ['音樂教育法',/kod[aá]ly|柯大宜|dalcroze|達克羅|eurhythm|orff|奧福|gordon|audiation|praxial|elliott|curwen/],
  ['中世紀音樂',/gregorian|plain.?chant|troubadour|guido|hexachord|ars nova|ars antiqua|notre dame|isorhythm/],
  ['文藝復興音樂',/cori spezzati|madrigal|dufay|franco.?flemish|文藝復興|ricercar/],
  ['巴洛克音樂',/passacaglia|ritornello|sonata da chiesa|sonata da camera|passion|vivaldi|bach|巴洛克/],
  ['古典／浪漫音樂',/gluck|schubert|lied|new german school|leitmotif|wagner|bayreuth|romantic|浪漫|古典時期/],
  ['20世紀音樂技法',/prepared piano|john cage|aleator|serial|musique concr[eè]te|microton|polyton|mystic chord|sprechstimme|gebrauchsmusik|wozzeck|penderecki|var[eè]se/],
  ['爵士／流行音樂',/ragtime|free jazz|cool jazz|bossa|funk|swing|jazz|爵士|hip.?hop|嘻哈/],
  ['和聲／調式',/neapolitan|增六|augmented sixth|dorian|mixolydian|cadence|終止|和聲外音|neighbor|suspension|半減七|和弦/],
  ['曲式／動機技法',/binary|ternary|through.?composed|inversion|retrograde|sequence|augmentation|曲式|動機/],
  ['移調／樂器法',/移調|薩克斯|法國號|豎笛|總譜|c譜表|樂器法/],
  ['音樂科技／AI',/spectrogram|聲譜|podcast|creative commons|audacity|sibelius|ai|人工智慧|數位音樂|採樣率|analog recording/],
  ['雙語／CLIL',/clil|emi|immersion|雙語|multimodal|多模態/],
  ['議題／SDGs／SEL',/sdgs|sel|社會情緒|性別|人權|環境|海洋|媒體素養/],
  ['課綱／素養／評量',/核心素養|素養導向|藝術領域|學習表現|學習內容|多元評量|差異化/],
  ['歌劇／音樂劇／劇場',/opera|oratorio|takarazuka|triple threat|gesamtkunstwerk|音樂劇|歌劇|寶塚/]
 ];
 function level(q,conceptsFound){
  const t=`${q.question||''} ${q.explanation||''}`;
  if(/譜例|分析|推導|計算|設計|比較.*說明|情境|應用/.test(t))return 5;
  if(conceptsFound.length>=2)return 4;
  if(/比較|區分|何者.*不|錯誤|順序|關係/.test(t))return 3;
  if(/作品|人物|時期|地區|特色/.test(t))return 2;
  return 1;
 }
 const stemGroups=new Map();
 qs.forEach(q=>{
  const hay=`${q.topic||''} ${q.question||''} ${q.explanation||''} ${q.tags||''}`;
  const found=concepts.filter(([,re])=>re.test(hay)).map(([name])=>name);
  q.canonical_concepts=found.length?found:[q.topic||'其他'];
  q.canonical_concept=q.canonical_concepts[0];
  q.discrimination_level=q.discrimination_level||level(q,found);
  q.quality_tags=[...(q.quality_tags||[])];
  if(q.discrimination_level>=5&&!q.quality_tags.includes('💎高鑑別'))q.quality_tags.push('💎高鑑別');
  if(found.includes('音樂科技／AI')||found.includes('雙語／CLIL')||found.includes('議題／SDGs／SEL'))q.quality_tags.push('🔥近年升溫');
  const sig=norm(q.question);
  if(sig.length>12){if(!stemGroups.has(sig))stemGroups.set(sig,[]);stemGroups.get(sig).push(q);}
 });
 let duplicateGroups=0,duplicateItems=0;
 stemGroups.forEach(group=>{if(group.length<2)return;duplicateGroups++;group.forEach((q,i)=>{q.duplicate_group=`DUP-${duplicateGroups}`;q.duplicate_rank=i+1;if(i>0){q.quality_tags=q.quality_tags||[];q.quality_tags.push('♻️疑似重複')}});duplicateItems+=group.length;});
 const conceptStats={};qs.forEach(q=>(q.canonical_concepts||[]).forEach(c=>{conceptStats[c]=conceptStats[c]||{questions:0,years:new Set(),levels:new Set(),high:0};const s=conceptStats[c];s.questions++;if(q.year)s.years.add(String(q.year));if(q.subject)s.levels.add(q.subject);if((q.discrimination_level||0)>=4)s.high++;}));
 window.MUSIC_CANONICAL_SUMMARY={total:qs.length,duplicateGroups,duplicateItems,concepts:Object.entries(conceptStats).map(([concept,s])=>({concept,questions:s.questions,years:[...s.years].sort(),levels:[...s.levels],high:s.high})).sort((a,b)=>b.years.length-a.years.length||b.questions-a.questions)};
 window.dispatchEvent(new CustomEvent('musicTeacherCanonicalReady',{detail:window.MUSIC_CANONICAL_SUMMARY}));
})();