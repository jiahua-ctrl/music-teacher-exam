(()=>{
 const KEY='musicTeacherExamHomeSectionV1';
 const valid=new Set(['today','practice','radar','learning','written']);
 const get=()=>{const v=sessionStorage.getItem(KEY);return valid.has(v)?v:'today'};
 const set=v=>{if(valid.has(v))sessionStorage.setItem(KEY,v)};
 function activate(v=get()){
  const nav=document.getElementById('homeCategoryNav');
  if(!nav)return false;
  const btn=nav.querySelector(`button[data-g="${v}"]`)||nav.querySelector('button[data-g="today"]');
  if(!btn)return false;
  if(!btn.classList.contains('active'))btn.click();
  return true;
 }
 function wire(){
  const nav=document.getElementById('homeCategoryNav');
  if(!nav)return false;
  nav.addEventListener('click',e=>{const b=e.target.closest('button[data-g]');if(b)set(b.dataset.g)});
  activate();
  return true;
 }
 function restoreAfterHomeAction(){
  document.addEventListener('click',e=>{
   if(!e.target.closest('#homeBtn,#quitBtn,#termBackBtn,#essayBackBtn'))return;
   setTimeout(()=>activate(),100);
  });
 }
 document.addEventListener('DOMContentLoaded',()=>{
  let n=0;const timer=setInterval(()=>{n++;if(wire()||n>30)clearInterval(timer)},100);
  restoreAfterHomeAction();
 });
 window.HomeNavigationState={get,set,activate};
})();