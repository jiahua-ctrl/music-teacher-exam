// 115 高頻衝刺｜九宮格自學任務
(function(){
 if(window.__SELFSTUDY115__)return;window.__SELFSTUDY115__=true;
 var KEY='musicTeacherExamSelfStudy115V1';
 var tasks=[
  {id:'see',icon:'👀',title:'看辨析',type:'視覺',desc:'讀一次兩概念的一句話差異，圈出關鍵字。'},
  {id:'hear',icon:'👂',title:'聽自己說',type:'聽覺',desc:'不看答案，用手機或直接口述30秒差異。'},
  {id:'play',icon:'🎮',title:'反向挑戰',type:'玩樂',desc:'把正確敘述改成一個錯誤陷阱，再自己抓錯。'},
  {id:'think',icon:'🧠',title:'為什麼不同',type:'思考',desc:'說出兩者「分析層級／人物／族群／用途」真正不同在哪。'},
  {id:'read',icon:'📖',title:'讀高頻卡',type:'閱讀',desc:'回到高頻知識網，補一個相關人物、作品或背景。'},
  {id:'write',icon:'✍️',title:'一句定義',type:'書寫',desc:'各寫一句定義，限制每個概念30字左右。'},
  {id:'draw',icon:'🎨',title:'畫關係圖',type:'畫作',desc:'用箭頭、表格或小圖畫出兩概念的差異。'},
  {id:'create',icon:'🛠️',title:'自己出題',type:'創作',desc:'設計一題四選一，至少放一個很像真的干擾選項。'},
  {id:'teach',icon:'🧑‍🏫',title:'教別人',type:'整合',desc:'假裝學生問「差在哪？」用生活化例子在60秒內教會他。'}
 ];
 function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}}
 function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
 function key(pair){return String(pair||'').trim()}
 function state(pair){var s=load();return s[key(pair)]||{done:[],level:0}}
 function levelFor(n){return n>=7?3:n>=4?2:n>=2?1:0}
 function toggle(pair,id){var s=load(),k=key(pair),x=s[k]||{done:[],level:0},i=x.done.indexOf(id);if(i>=0)x.done.splice(i,1);else x.done.push(id);x.level=levelFor(x.done.length);x.updatedAt=Date.now();s[k]=x;save(s);if(window.Confusion115&&window.Confusion115.refresh)window.Confusion115.refresh();setTimeout(enhance,60);return x}
 function esc(s){return String(s||'').replace(/[&<>\"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]})}
 function render(pair){var sec=document.getElementById('hf115Section');if(!sec)return;var old=document.getElementById('selfStudy115');if(old)old.remove();var st=state(pair),box=document.createElement('div');box.id='selfStudy115';box.className='hf115-oral-card';box.style.marginTop='12px';var label=st.level===3?'🏆 已掌握':st.level===2?'🌱 穩定中':st.level===1?'🩹 急救中':'🚨 待開始';box.innerHTML='<span class="eyebrow">九宮格自學任務</span><h3>🧩 '+esc(pair)+'</h3><p class="muted">不用九格一次做完。從不同學習方式完成任務，讓「知道答案」慢慢變成「真的分得出來」。</p><div class="hf115-badges"><span class="hf115-badge">'+label+'</span><span class="hf115-badge">完成 '+st.done.length+'/9</span></div><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">'+tasks.map(function(t){var done=st.done.includes(t.id);return'<button data-mission="'+t.id+'" class="hf115-btn" style="padding:10px;min-height:108px;'+(done?'outline:2px solid rgba(74,160,100,.45)':'')+'"><b>'+t.icon+' '+t.title+(done?' ✓':'')+'</b><small>'+t.type+'｜'+t.desc+'</small></button>'}).join('')+'</div><p class="hf115-note" style="margin-top:10px">升級規則：完成2格＝🩹急救中；4格＝🌱穩定中；7格以上＝🏆已掌握。每升一級，系統會自動降低這組概念的「需加強指數」。</p>';var diag=document.getElementById('hf115Diagnosis');if(diag)diag.after(box);else sec.querySelector('.hf115-wrap').prepend(box);box.querySelectorAll('[data-mission]').forEach(function(b){b.onclick=function(){toggle(pair,b.dataset.mission);render(pair)}})}
 function topPair(){var c=window.Confusion115&&window.Confusion115.top?window.Confusion115.top():[];return c.length?c[0].pair:null}
 function enhance(){var sec=document.getElementById('hf115Section');if(!sec)return false;var diag=document.getElementById('hf115Diagnosis');if(!diag)return false;if(!diag.querySelector('#selfStudy115Btn')){var b=document.createElement('button');b.id='selfStudy115Btn';b.className='primary';b.style.marginTop='10px';b.textContent='🧩 開始弱點九宮格';b.onclick=function(){var p=topPair();if(p)render(p);else alert('目前沒有需要急救的混淆組；之後若在PK按「還會搞混」，系統會再建立任務。')};diag.appendChild(b)}return true}
 function loadInteractive(){if(document.querySelector('script[data-selfstudy115-interactive]'))return;var s=document.createElement('script');s.src='selfstudy_interactive_115.js?v=20260819';s.dataset.selfstudy115Interactive='1';document.head.appendChild(s)}
 function boot(){loadInteractive();var n=0,t=setInterval(function(){n++;if(enhance())clearInterval(t);if(n>60)clearInterval(t)},150)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
 window.SelfStudy115={tasks:tasks,state:state,render:render,levelFor:levelFor};
})();