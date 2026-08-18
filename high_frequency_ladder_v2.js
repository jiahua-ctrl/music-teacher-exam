(()=>{
 const qs=()=>window.MusicTeacherExam?.questions||(Array.isArray(window.LOCAL_QUESTIONS)?window.LOCAL_QUESTIONS:[]);
 const chains=[
  {id:'music-education',title:'音樂教育法',re:/kod[aá]ly|柯大宜|curwen|dalcroze|達克羅|eurhythm|orff|奧福|gordon|audiation|elliott|praxial|lowell mason|comprehensive musicianship|mmcp/i},
  {id:'taiwan-music',title:'臺灣／本土音樂',re:/鄧雨賢|呂泉生|王雲峰|郭芝苑|馬水龍|許常惠|史惟亮|歌仔|南管|北管|採茶|四月望雨|桃花泣血記/i},
  {id:'harmony-mode',title:'和聲／調式',re:/neapolitan|拿坡里|dorian|phrygian|lydian|mixolydian|終止|cadence|和聲外音|增六|半減七/i},
  {id:'jazz',title:'爵士／流行音樂',re:/ragtime|swing|bebop|cool jazz|free jazz|fusion|bossa|爵士/i},
  {id:'world',title:'世界／原住民族音樂',re:/raga|tala|pansori|gamelan|呼麥|khoomei|pasibutbut|布農|排灣|阿美|鼻笛|五年祭/i},
  {id:'medieval',title:'中世紀音樂',re:/gregorian|plain.?chant|guido|hexachord|notre dame|l[eé]onin|p[eé]rotin|ars antiqua|ars nova/i},
  {id:'modern',title:'20世紀音樂技法',re:/john cage|prepared piano|sprechstimme|十二音|serial|musique concr[eè]te|aleator|偶然音樂/i},
  {id:'instrument',title:'樂器學／移調',re:/移調|薩克斯|法國號|idiophone|aerophone|membranophone|chordophone|hornbostel/i}
 ];
 const role=q=>{const t=`${q.question||''} ${q.explanation||''}`;if(/教學|設計|情境|應用|推導|計算|譜例|分析/.test(t))return 5;if(/跨|整合|關係|排序|發展/.test(t))return 4;if(/比較|區分|不正確|錯誤|何者不|差異/.test(t))return 3;if(/作品|人物|時期|地區|特色|代表/.test(t))return 2;return 1};
 function apply(){
  const data=qs();
  data.forEach(q=>{const hay=`${q.topic||''} ${q.question||''} ${q.explanation||''}`;const c=chains.find(x=>x.re.test(hay));if(!c)return;q.high_frequency_chain=c.id;q.high_frequency_title=c.title;q.ladder_level=Math.max(Number(q.discrimination_level)||1,role(q));q.discrimination_level=q.ladder_level;q.quality_tags=[...(q.quality_tags||[])];if(!q.quality_tags.includes('📈十年能力鏈'))q.quality_tags.push('📈十年能力鏈');});
  const summary=chains.map(c=>{const items=data.filter(q=>q.high_frequency_chain===c.id);const lv=[0,0,0,0,0,0],years=new Set();items.forEach(q=>{lv[Math.max(1,Math.min(5,q.ladder_level||1))]++;if(q.year)years.add(String(q.year))});return{id:c.id,title:c.title,total:items.length,levels:lv.slice(1),years:[...years].sort(),coverage:lv.slice(1).filter(Boolean).length};}).filter(x=>x.total).sort((a,b)=>b.years.length-a.years.length||b.total-a.total);
  window.MUSIC_HIGH_FREQUENCY_LADDERS=summary;
  window.dispatchEvent(new CustomEvent('musicHighFrequencyLaddersReady',{detail:summary}));
 }
 apply();window.addEventListener('musicExamLatestModulesReady',apply);
})();