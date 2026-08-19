// 115 UX 驗收防呆｜不新增玩法，只保證流程不因選配模組失敗而卡住
(function(){
 if(window.__UX_GUARD115__)return;window.__UX_GUARD115__=true;
 function q(s,r){return (r||document).querySelector(s)}
 function style(){if(q('#uxGuard115Style'))return;var s=document.createElement('style');s.id='uxGuard115Style';s.textContent=`
@media(max-width:680px){button,.mode-card,.hf115-btn,.hf115-guide-card{min-height:44px}.hf115-guide-actions{display:grid;grid-template-columns:1fr}.hf115-guide-actions button{width:100%}.hf115-step{grid-template-columns:64px 1fr}.hf115-vs{grid-template-columns:1fr}.hf115-vsmark{transform:rotate(90deg);text-align:center}}
.dark #hf115DailyRec,.dark #hf115DailyDone,.dark #hf115WeeklyRhythm,.dark .hf115-guide-pane,.dark .ux115-firsttip{background:rgba(255,255,255,.045)!important}
.ux115-fallback{padding:13px;border:1px solid rgba(127,127,127,.18);border-radius:14px;background:rgba(127,127,127,.035);margin:12px 0}.ux115-fallback p{margin:5px 0 10px;line-height:1.55}
`;document.head.appendChild(s)}
 function coreQuiz(){var b=document.querySelector('[data-mode="random10"]');if(b){b.click();return true}try{if(window.MusicTeacherExam&&window.MusicTeacherExam.startQuiz){window.MusicTeacherExam.startQuiz('random10');return true}}catch(e){}return false}
 function fallback(){var home=q('#homeView'),hero=q('.hero',home);if(!home||!hero||q('#ux115Fallback'))return;var box=document.createElement('section');box.id='ux115Fallback';box.className='ux115-fallback';box.innerHTML='<b>🎯 今天先做10題就好</b><p class="muted">進階高頻／診斷工具目前沒有完整載入，但原本題庫仍可正常使用，不需要等它。</p><button id="ux115FallbackQuiz" class="primary">開始今日10題</button>';hero.after(box);q('#ux115FallbackQuiz',box).onclick=coreQuiz}
 function clearFallback(){var f=q('#ux115Fallback');if(f&&q('#hf115Guide'))f.remove()}
 function sanitize(){// 舊資料或不完整資料都不應讓畫面炸掉
  try{var s=JSON.parse(localStorage.getItem('musicTeacherExamDaily115V1')||'{}');if(s&&s.days&&!Array.isArray(s.days)&&typeof s.days==='object'){}else if(s&&Object.keys(s).length)localStorage.removeItem('musicTeacherExamDaily115V1')}catch(e){localStorage.removeItem('musicTeacherExamDaily115V1')}
  try{var w=JSON.parse(localStorage.getItem('musicTeacherExamWeeklyRhythm115V1')||'{}');if(w&&w.days&&!Array.isArray(w.days)&&typeof w.days==='object'){}else if(w&&Object.keys(w).length)localStorage.removeItem('musicTeacherExamWeeklyRhythm115V1')}catch(e){localStorage.removeItem('musicTeacherExamWeeklyRhythm115V1')}
 }
 function audit(){style();sanitize();if(q('#hf115Guide')){clearFallback();return true}return false}
 function boot(){var n=0,t=setInterval(function(){n++;if(audit()&&n>5){clearInterval(t);return}if(n===30)fallback();if(n>80)clearInterval(t)},200)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
 window.UXGuard115={audit:audit,coreQuiz:coreQuiz};
})();