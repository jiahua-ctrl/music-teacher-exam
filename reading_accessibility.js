(()=>{
  if(window.__MUSIC_EXAM_READING_ACCESSIBILITY__)return;
  window.__MUSIC_EXAM_READING_ACCESSIBILITY__=true;
  const KEY='musicTeacherExamReadingSizeV1';
  const order=['normal','large','xlarge'];
  const labels={normal:'標準',large:'大字',xlarge:'特大'};

  let current='large';
  try{current=localStorage.getItem(KEY)||'large'}catch(e){}
  if(!order.includes(current))current='large';
  document.documentElement.dataset.readingSize=current;

  const style=document.createElement('style');
  style.textContent=`
    .reading-size-btn{white-space:nowrap;min-height:42px;padding:8px 11px!important;font-size:14px!important}
    html[data-reading-size="large"] body{font-size:18px}
    html[data-reading-size="large"] .brand h1{font-size:20px}
    html[data-reading-size="large"] .brand p{font-size:14px}
    html[data-reading-size="large"] .eyebrow{font-size:14px}
    html[data-reading-size="large"] .muted{font-size:17px}
    html[data-reading-size="large"] .stat .label{font-size:15px}
    html[data-reading-size="large"] .stat .value small{font-size:15px}
    html[data-reading-size="large"] .mode-card b{font-size:19px}
    html[data-reading-size="large"] .mode-card small{font-size:16px;line-height:1.55}
    html[data-reading-size="large"] .section-title h3{font-size:23px}
    html[data-reading-size="large"] .question-card h2{font-size:28px!important;line-height:1.6}
    html[data-reading-size="large"] .option-btn{font-size:20px;line-height:1.65;padding:18px 17px}
    html[data-reading-size="large"] .feedback{font-size:18px;line-height:1.75;padding:19px}
    html[data-reading-size="large"] .source-box{font-size:15px;line-height:1.65}
    html[data-reading-size="large"] .pill{font-size:14px}
    html[data-reading-size="large"] .primary,html[data-reading-size="large"] .ghost{font-size:16px;min-height:46px}
    html[data-reading-size="large"] select,html[data-reading-size="large"] label{font-size:17px}
    html[data-reading-size="large"] textarea{font-size:18px;line-height:1.7}

    html[data-reading-size="xlarge"] body{font-size:20px}
    html[data-reading-size="xlarge"] .brand h1{font-size:22px}
    html[data-reading-size="xlarge"] .brand p{font-size:16px}
    html[data-reading-size="xlarge"] .eyebrow{font-size:15px}
    html[data-reading-size="xlarge"] .muted{font-size:19px}
    html[data-reading-size="xlarge"] .stat .label{font-size:17px}
    html[data-reading-size="xlarge"] .stat .value small{font-size:17px}
    html[data-reading-size="xlarge"] .mode-card b{font-size:21px}
    html[data-reading-size="xlarge"] .mode-card small{font-size:18px;line-height:1.6}
    html[data-reading-size="xlarge"] .section-title h3{font-size:25px}
    html[data-reading-size="xlarge"] .question-card h2{font-size:32px!important;line-height:1.65}
    html[data-reading-size="xlarge"] .option-btn{font-size:23px;line-height:1.7;padding:21px 19px}
    html[data-reading-size="xlarge"] .feedback{font-size:21px;line-height:1.8;padding:21px}
    html[data-reading-size="xlarge"] .source-box{font-size:17px;line-height:1.7}
    html[data-reading-size="xlarge"] .pill{font-size:16px;padding:7px 11px}
    html[data-reading-size="xlarge"] .primary,html[data-reading-size="xlarge"] .ghost{font-size:18px;min-height:50px}
    html[data-reading-size="xlarge"] select,html[data-reading-size="xlarge"] label{font-size:19px}
    html[data-reading-size="xlarge"] textarea{font-size:20px;line-height:1.75}

    @media(max-width:680px){
      .reading-size-btn{min-height:40px!important;padding:7px 9px!important;font-size:13px!important}
      html[data-reading-size="large"] .hero .muted{font-size:15px!important;line-height:1.55}
      html[data-reading-size="large"] .mode-card b{font-size:18px!important}
      html[data-reading-size="large"] .mode-card small{font-size:15px!important;margin-left:0!important}
      html[data-reading-size="large"] .question-card h2{font-size:26px!important}
      html[data-reading-size="large"] .option-btn{font-size:19px!important;padding:17px 15px!important}
      html[data-reading-size="xlarge"] .hero .muted{font-size:17px!important;line-height:1.6}
      html[data-reading-size="xlarge"] .mode-card b{font-size:20px!important}
      html[data-reading-size="xlarge"] .mode-card small{font-size:17px!important;margin-left:0!important}
      html[data-reading-size="xlarge"] .question-card h2{font-size:29px!important}
      html[data-reading-size="xlarge"] .option-btn{font-size:22px!important;padding:20px 16px!important}
    }
  `;
  document.head.appendChild(style);

  function save(size){
    current=size;
    document.documentElement.dataset.readingSize=size;
    try{localStorage.setItem(KEY,size)}catch(e){}
    updateButton();
  }
  function updateButton(){
    const btn=document.getElementById('readingSizeBtn');
    if(btn){
      btn.textContent=`Aa ${labels[current]}`;
      btn.title=`目前字級：${labels[current]}。點一下切換字級`;
      btn.setAttribute('aria-label',`目前字級${labels[current]}，點一下切換`);
    }
  }
  function mount(){
    const topbar=document.querySelector('.topbar');
    if(!topbar||document.getElementById('readingSizeBtn'))return;
    const btn=document.createElement('button');
    btn.id='readingSizeBtn';
    btn.type='button';
    btn.className='ghost small reading-size-btn';
    btn.addEventListener('click',()=>{
      const next=order[(order.indexOf(current)+1)%order.length];
      save(next);
    });
    const theme=document.getElementById('themeBtn');
    if(theme)topbar.insertBefore(btn,theme);else topbar.appendChild(btn);
    updateButton();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();
