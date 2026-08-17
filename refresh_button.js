document.write('<script src="questions_batch_114_newtaipei_tainan_ntnu_part7.js"><\/script>');
document.write('<script src="source_append_114_part7.js"><\/script>');
(()=>{
  function addRefresh(){
    const topbar=document.querySelector('.topbar');
    const brand=topbar?.querySelector('.brand');
    const theme=document.getElementById('themeBtn');
    if(!topbar||!brand||document.getElementById('refreshBtn')) return;

    const actions=document.createElement('div');
    actions.style.display='flex';
    actions.style.alignItems='center';
    actions.style.gap='8px';

    const btn=document.createElement('button');
    btn.id='refreshBtn';
    btn.className='ghost small';
    btn.type='button';
    btn.setAttribute('aria-label','重新整理頁面');
    btn.title='重新整理頁面（不會清除作答紀錄）';
    btn.textContent='↻ 重新整理';
    btn.addEventListener('click',()=>window.location.reload());

    if(theme){
      theme.remove();
      actions.append(btn,theme);
    }else{
      actions.append(btn);
    }
    topbar.append(actions);

    const style=document.createElement('style');
    style.textContent=`
      #refreshBtn{white-space:nowrap}
      @media(max-width:560px){
        #refreshBtn{font-size:0;width:38px;height:38px;padding:0}
        #refreshBtn::before{content:'↻';font-size:20px}
      }
    `;
    document.head.appendChild(style);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addRefresh);
  else addRefresh();
})();
