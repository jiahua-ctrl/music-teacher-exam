(()=>{
 if(window.__TOP_STATS_LABELS_V1__)return;window.__TOP_STATS_LABELS_V1__=true;
 const map=[['juniorAccuracy','🎼 國中題次正確率'],['seniorAccuracy','🎓 高中題次正確率'],['eduAccuracy','📚 教育題次正確率']];
 function apply(){
  map.forEach(([id,text])=>{const value=document.getElementById(id);const stat=value?.closest('.stat');const label=stat?.querySelector('.label');if(label)label.textContent=text;const small=value?.parentElement?.querySelector('small');if(small)small.textContent='%';if(stat)stat.title='這是每一次作答的累積正確率，不等於已掌握多少不同題。題目掌握率請看「📐 題次正確率 vs 題目掌握率」。'});
  const grid=document.querySelector('#homeView .stats-grid');if(grid&&!document.getElementById('topStatsMeaning')){const note=document.createElement('div');note.id='topStatsMeaning';note.className='muted';note.style.cssText='grid-column:1/-1;font-size:12px;line-height:1.6;padding:0 2px';note.innerHTML='※ 國中／高中／教育這三個百分比＝<b>累積題次正確率</b>；想看「到底學會多少不同題」，請看下方 📐 題目掌握率。';grid.appendChild(note)}
 }
 function watch(){apply();const home=document.getElementById('homeView');if(home&&!home.dataset.topStatsLabelsObserved){home.dataset.topStatsLabelsObserved='1';new MutationObserver(()=>apply()).observe(home,{childList:true,subtree:true})}window.addEventListener('musicExamLearningSynced',apply);window.addEventListener('pageshow',apply)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(watch,250),{once:true});else setTimeout(watch,100);
 window.TopStatsLabels={apply};
})();