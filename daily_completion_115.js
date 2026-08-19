// 115 首頁｜今日任務完成感與連續紀錄
(function(){
 if(window.__DAILY_DONE115__)return;window.__DAILY_DONE115__=true;
 var KEY='musicTeacherExamDaily115V1';
 function load(){try{return JSON.parse(localStorage.getItem(KEY))||{days:{}}}catch(e){return{days:{}}}}
 function save(s){localStorage.setItem(KEY,JSON.stringify(s||{days:{}}))}
 function today(){var d=new Date(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return d.getFullYear()+'-'+m+'-'+day}
 function ensure(){var s=load();s.days=s.days||{};s.days[today()]=s.days[today()]||{quiz:false,weak:false,grid:false,manual:false,updatedAt:Date.now()};return s}
 function mark(type){var s=ensure();s.days[today()][type]=true;s.days[today()].updatedAt=Date.now();save(s);render()}
 function dayDone(x){return !!(x&&(x.manual||x.quiz||(x.weak&&x.grid)))}
 function streak(){var s=load(),d=new Date(),n=0;for(var i=0;i<366;i++){var m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0'),k=d.getFullYear()+'-'+m+'-'+day;if(dayDone((s.days||{})[k]))n++;else if(i===0){}else break;d.setDate(d.getDate()-1)}return n}
 function progress(){var s=ensure(),x=s.days[today()],done=0,total=2;if(x.quiz)done++;if(x.weak||x.grid)done++;return{done:done,total:total,complete:dayDone(x),state:x}}
 function render(){var host=document.getElementById('hf115GuideStart');if(!host)return false;var old=document.getElementById('hf115DailyDone');if(old)old.remove();var p=progress(),box=document.createElement('div');box.id='hf115DailyDone';box.style.cssText='padding:14px;border-radius:16px;border:1px solid rgba(127,127,127,.16);background:rgba(127,127,127,.035);margin-bottom:12px';box.innerHTML=p.complete?'<span class="eyebrow">今天可以收工了</span><h3 style="margin:5px 0">✅ 今日任務完成</h3><p class="muted" style="margin:0">今天已完成足夠的主動提取／弱點補強，不需要把所有功能都做一遍。</p><div class="hf115-badges"><span class="hf115-badge">🔥 連續 '+streak()+' 天</span><span class="hf115-badge">今天 '+p.done+'/'+p.total+' 核心任務</span></div>':'<span class="eyebrow">今日任務</span><h3 style="margin:5px 0">'+p.done+'/'+p.total+' 已完成</h3><p class="muted" style="margin:0">今天只要完成「1次短測驗」＋「1次弱點補強」就夠了。完成後系統會明確告訴你可以停下來。</p><div class="hf115-badges"><span class="hf115-badge">'+(p.state.quiz?'✅':'⬜')+' 高頻短測驗</span><span class="hf115-badge">'+((p.state.weak||p.state.grid)?'✅':'⬜')+' 弱點補強</span></div><button id="hf115ManualDone" class="ghost" style="margin-top:8px">今天內容已足夠，手動標記完成</button>';
 var rec=document.getElementById('hf115DailyRec');if(rec)rec.after(box);else host.insertBefore(box,host.firstChild);var b=document.getElementById('hf115ManualDone');if(b)b.onclick=function(){mark('manual')};return true}
 function patch(){var api=window.MusicTeacherExam;if(api&&api.startCustomQuiz&&!api.__dailyDonePatched){var orig=api.startCustomQuiz;api.startCustomQuiz=function(pool,label,limit){if(String(label||'').includes('高頻'))mark('quiz');return orig.call(api,pool,label,limit)};api.__dailyDonePatched=true}
 var battle=document.getElementById('hf115BattleBtn');if(battle&&!battle.dataset.dailyDone){battle.dataset.dailyDone='1';battle.addEventListener('click',function(){mark('weak')})}
 var grid=document.getElementById('selfStudy115Btn');if(grid&&!grid.dataset.dailyDone){grid.dataset.dailyDone='1';grid.addEventListener('click',function(){mark('grid')})}}
 function boot(){var n=0,t=setInterval(function(){n++;patch();if(render()&&n>3)clearInterval(t);if(n>80)clearInterval(t)},180)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
 window.DailyCompletion115={load:load,mark:mark,progress:progress,streak:streak,render:render};
})();