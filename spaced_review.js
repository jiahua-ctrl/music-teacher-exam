(() => {
  const REVIEW_KEY='musicTeacherExamSpacedReviewV1';
  const STATS_KEY='musicTeacherExamStatsV1';
  const load=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const questions=()=>Array.isArray(window.LOCAL_QUESTIONS)?window.LOCAL_QUESTIONS:[];
  const stats=()=>{const s=load(STATS_KEY,{});return{attempts:s.attempts||{},wrong:Array.isArray(s.wrong)?s.wrong:[],unknown:Array.isArray(s.unknown)?s.unknown:[],daily:s.daily||{},topics:s.topics||{}}};
  const addHours=(d,h)=>new Date(d.getTime()+h*3600000),addDays=(d,x)=>addHours(d,x*24);
  const fmt=d=>d?`${d.getMonth()+1}/${d.getDate()}`:'—';
  const intervalFor=n=>n<=1?3:n===2?7:n===3?14:n===4?30:n===5?60:90;

  function bootstrap(){
    const r=load(REVIEW_KEY,{}),s=stats(),unknown=new Set(s.unknown||[]);let changed=false;
    questions().forEach(q=>{
      const a=s.attempts?.[q.id];if(!a?.total)return;
      if(!r[q.id]){
        const acc=(a.correct||0)/a.total,isUnknown=unknown.has(q.id)||(a.unknown||0)>0;
        r[q.id]={due:new Date().toISOString(),correctStreak:isUnknown?0:(acc===1?1:0),lastResult:isUnknown?'unknown':(acc===1?'correct':'wrong'),hadWrong:isUnknown||acc<1,lastReviewed:null,intervalDays:0};changed=true;
      } else if(unknown.has(q.id)&&r[q.id].lastResult!=='unknown'){
        r[q.id]={...r[q.id],due:new Date().toISOString(),correctStreak:0,lastResult:'unknown',intervalDays:0};changed=true;
      }
    });
    if(changed)save(REVIEW_KEY,r);return r;
  }
  function stateOf(q,r,s,now=new Date()){
    const a=s.attempts?.[q.id];if(!a?.total)return'new';
    const x=r[q.id],acc=(a.correct||0)/a.total,unknown=new Set(s.unknown||[]),wrong=new Set(s.wrong||[]);
    if(unknown.has(q.id)||wrong.has(q.id)||!x||x.lastResult==='wrong'||x.lastResult==='unknown'||acc<.6)return'red';
    if((x.correctStreak||0)>=3&&new Date(x.due)>now)return'green';
    return'yellow';
  }
  function summary(){
    const r=bootstrap(),s=stats(),now=new Date(),out={green:0,yellow:0,red:0,new:0,due:[],next:null,seen:0};
    questions().forEach(q=>{const st=stateOf(q,r,s,now);out[st]++;if(st!=='new')out.seen++;const x=r[q.id];if(x?.due){const d=new Date(x.due);if(d<=now)out.due.push({q,state:st,due:d});else if(!out.next||d<out.next)out.next=d}});
    out.due.sort((a,b)=>({red:0,yellow:1,green:2,new:3}[a.state]-({red:0,yellow:1,green:2,new:3}[b.state])||a.due-b.due);return out;
  }
  function update(q,correct,status='answer'){
    const r=bootstrap(),prev=r[q.id]||{correctStreak:0,hadWrong:false,lastResult:null},now=new Date();let due;
    if(status==='unknown'){
      due=addDays(now,1);r[q.id]={...prev,due:due.toISOString(),correctStreak:0,hadWrong:true,lastResult:'unknown',lastReviewed:now.toISOString(),intervalDays:1};
    } else if(!correct){
      const repeated=prev.lastResult==='wrong'||prev.lastResult==='unknown';due=repeated?addDays(now,1):addHours(now,4);r[q.id]={...prev,due:due.toISOString(),correctStreak:0,hadWrong:true,lastResult:'wrong',lastReviewed:now.toISOString(),intervalDays:repeated?1:0};
    } else {
      const n=(prev.correctStreak||0)+1,days=intervalFor(n);due=addDays(now,days);r[q.id]={...prev,due:due.toISOString(),correctStreak:n,lastResult:'correct',lastReviewed:now.toISOString(),intervalDays:days};
    }
    save(REVIEW_KEY,r);return due;
  }
  function phase(sum){const total=Math.max(1,questions().length),coverage=sum.seen/total;if(coverage<.4)return{name:'實力累積期',text:'先建立主要考點的理解與題感；新內容讀完立刻做題。'};if(coverage<.8)return{name:'記憶複習期',text:'開始把看懂的內容轉成能主動提取的記憶，增加到期複習與錯題回收。'};return{name:'大量做題期',text:'題庫覆蓋已高，改以混合題、限時作答與輸出練習檢查能不能用得出來。'};}
  function ensureStyles(){if(document.getElementById('mtSrsStyles'))return;const x=document.createElement('style');x.id='mtSrsStyles';x.textContent=`.mt-srs{padding:24px;margin-bottom:18px}.mt-srs-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.mt-phase{padding:7px 10px;border-radius:999px;background:var(--soft);color:var(--brand);font-size:12px;font-weight:800}.mt-srs-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:16px;margin-top:15px}.mt-due{padding:18px;border-radius:16px;background:var(--soft)}.mt-due strong{font-size:42px;color:var(--brand)}.mt-due p{font-size:13px;color:var(--muted);line-height:1.55}.mt-review-btn{display:inline-block;text-decoration:none;padding:10px 13px;border-radius:11px;background:var(--brand);color:#fff;font-weight:800}.mt-memory{display:grid;grid-template-columns:1fr 1fr;gap:9px}.mt-state{padding:12px;border:1px solid var(--line);border-radius:12px}.mt-state b{display:block;font-size:22px}.mt-state small{color:var(--muted)}.mt-srs-foot{margin-top:13px;color:var(--muted);font-size:13px;line-height:1.6}.mt-next-review{margin:10px 0;padding:9px 11px;border-radius:10px;background:var(--soft);font-size:13px;font-weight:700}@media(max-width:720px){.mt-srs-grid{grid-template-columns:1fr}}`;document.head.appendChild(x)}
  function render(){const home=document.getElementById('homeView');if(!home)return;let p=document.getElementById('mtSrs');if(!p){p=document.createElement('section');p.id='mtSrs';p.className='card mt-srs';const anchor=document.getElementById('mtCoach')||document.querySelector('.section-card');anchor?.insertAdjacentElement('afterend',p)}const s=summary(),ph=phase(s),due=s.due.length;p.innerHTML=`<div class="mt-srs-head"><div><span class="eyebrow">間隔複習 3→7→14→30→60→90 天</span><h3 style="margin:4px 0 0">🧠 記憶狀態</h3></div><span class="mt-phase">${ph.name}</span></div><div class="mt-srs-grid"><div class="mt-due"><small>今日到期複習</small><div><strong>${due}</strong> 題</div><p>${due?'這些題目現在最值得重新想一次；答對後，下一次出現會依熟練度自動往後延。':`今天沒有到期題目。${s.next?'下一批約 '+fmt(s.next)+'。':'先做新題建立第一批複習排程。'}`}</p>${due?`<a class="mt-review-btn" href="review.html">🧠 開始今日到期複習</a>`:''}</div><div class="mt-memory"><div class="mt-state"><small>🟢 已掌握</small><b>${s.green}</b></div><div class="mt-state"><small>🟡 待複習</small><b>${s.yellow}</b></div><div class="mt-state"><small>🔴 容易忘記／不知道</small><b>${s.red}</b></div><div class="mt-state"><small>🆕 尚未練習</small><b>${s.new}</b></div></div></div><div class="mt-srs-foot"><b>${ph.name}</b>｜${ph.text}<br>答對會依序延長為 3、7、14、30、60、90 天；答錯會縮短到 4 小時或 1 天，按「❓不知道」則隔天優先再見一次。</div>`;}
  function observe(){const fb=document.getElementById('feedback');if(!fb)return;const obs=new MutationObserver(()=>{if(fb.classList.contains('hidden')){fb.dataset.srs='';return}const title=document.getElementById('feedbackTitle')?.textContent||'',isUnknown=title.includes('我不知道'),correct=title.includes('答對'),wrong=title.includes('正確答案');if(!correct&&!wrong&&!isUnknown)return;const text=document.getElementById('questionText')?.textContent||'',q=questions().find(x=>x.question===text);if(!q)return;const a=stats().attempts?.[q.id]?.total||0,key=`${q.id}:${a}`;if(fb.dataset.srs===key)return;fb.dataset.srs=key;const due=update(q,correct,isUnknown?'unknown':'answer');let note=document.getElementById('mtNextReview');if(!note){note=document.createElement('div');note.id='mtNextReview';note.className='mt-next-review';document.getElementById('sourceBox')?.before(note)}note.textContent=isUnknown?`❓ 已排入明日優先複習：${fmt(due)}。`:correct?`🧠 下一次複習：${fmt(due)}。連續答對後，間隔會拉到 7、14、30、60、90 天。`:`🧠 這題會在 ${fmt(due)} 再安排一次，不用現在把整章重讀。`;setTimeout(render,0)});obs.observe(fb,{attributes:true,attributeFilter:['class']});}
  function integrateTermLearning(){
    const btn=document.getElementById('termBtn');if(!btn)return;
    btn.textContent='🧠 開始音樂名詞主動提取';
    const card=btn.closest('.section-card');
    const title=card?.querySelector('h3');if(title)title.textContent='音樂名詞｜從會認到會寫、會教';
    const desc=card?.querySelector('p.muted');if(desc)desc.textContent='只看原文先主動回想，再寫教甄名詞解釋；系統診斷人、時、地、作品等缺漏，並加入相似名詞辨析與教師教學轉化。';
    btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();location.href='term-prototype-v3.html';},true);
  }
  document.addEventListener('DOMContentLoaded',()=>{ensureStyles();bootstrap();integrateTermLearning();setTimeout(()=>{render();observe()},30)});
  window.MusicTeacherSRS={summary,update,bootstrap,stateOf,intervalFor};
})();