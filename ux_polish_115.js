// 115 UX 驗收第一輪｜首頁層級、手機版、第一次使用者
(function(){
 if(window.__UX_POLISH115__)return;window.__UX_POLISH115__=true;
 function q(s,r){return (r||document).querySelector(s)}
 function style(){if(q('#ux115Style'))return;var s=document.createElement('style');s.id='ux115Style';s.textContent=`
#hf115Section{scroll-margin-top:82px}.ux115-legacy-note{font-size:.82rem;opacity:.7;margin:6px 0 0}.ux115-firsttip{padding:10px 12px;border-radius:13px;background:rgba(107,79,163,.07);margin-top:10px;font-size:.9rem;line-height:1.5}.ux115-collapsed{display:none!important}
@media(max-width:680px){#hf115Section.card{padding:14px}.hf115-guide-main{gap:8px}.hf115-guide-card{min-height:auto}.hf115-guide-pane{padding:11px}.hf115-guide-actions button{width:100%}.hf115-badges{gap:4px}.hf115-badge{font-size:.68rem}.stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hero{gap:10px}.hero h2{font-size:1.35rem}.section-card{margin-top:12px}}
`;document.head.appendChild(s)}
 function movePriority(){var home=q('#homeView'),hero=q('.hero',home),hf=q('#hf115Section',home);if(!home||!hero||!hf)return false;if(hero.nextElementSibling!==hf)hero.after(hf);return true}
 function softenLegacy(){var home=q('#homeView');if(!home)return;var cards=[...home.querySelectorAll(':scope > .section-card')].filter(function(x){return x.id!=='hf115Section'});cards.forEach(function(card){var h=q('h3',card);if(!h)return;var t=h.textContent.trim();if(['每日任務','國中、高中分開準備','依年度／學段／主題刷題','名詞解釋','申論／試教挑戰'].includes(t)){card.dataset.legacy115='1'}});var first=cards.find(function(x){return x.dataset.legacy115==='1'});if(first&&!q('.ux115-legacy-note',first)){var p=document.createElement('p');p.className='ux115-legacy-note';p.textContent='以下保留完整題庫工具；第一次使用時，先完成上方「今天從哪裡開始？」即可。';first.prepend(p)}}
 function firstTip(){var g=q('#hf115Guide');if(!g||q('#ux115FirstTip'))return;var t=document.createElement('div');t.id='ux115FirstTip';t.className='ux115-firsttip';t.innerHTML='第一次使用建議：<b>只按「今天開始」即可。</b> 做完後再看系統是否有弱點建議，不需要先理解所有功能。';var head=g.firstElementChild;if(head)head.after(t)}
 function validateEmpty(){var weak=q('#hf115GuideWeakText');if(weak&&!weak.textContent.trim())weak.textContent='目前還沒有足夠作答資料。先完成一輪高頻10題，系統再幫你找真正弱點。'}
 function loadGuard(){if(document.querySelector('script[data-ux-guard115]'))return;var s=document.createElement('script');s.src='ux_guardrails_115.js?v=20260820';s.dataset.uxGuard115='1';document.head.appendChild(s)}
 function boot(){style();loadGuard();var n=0,t=setInterval(function(){n++;var ok=movePriority();softenLegacy();firstTip();validateEmpty();if(ok&&q('#hf115Guide')&&n>4)clearInterval(t);if(n>80)clearInterval(t)},180)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();