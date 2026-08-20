(()=>{
  if(window.__MUSIC_EXAM_DATA_LOADER_V2__)return;
  window.__MUSIC_EXAM_DATA_LOADER_V2__=true;

  const VERSION='20260820-v2b';
  const state=new Map();
  const loaded=new Set([...document.scripts].map(s=>(s.getAttribute('src')||'').split('?')[0]));

  const GROUPS={
    questionCore:[
      'questions_recent.js','questions_official_111_115.js','questions_batch_114_jh_music_edu.js','questions_batch_113_tainan.js','source_index.js','sources_115.js'
    ],
    questionArchive:[
      'questions_batch_114_newtaipei_tainan_ntnu_part7.js','questions_batch_114_kaohsiung_taipei_part8.js',
      'questions_batch_115_latest_part1.js','questions_batch_115_latest_part2.js','questions_batch_115_newtaipei_part3.js',
      'questions_rare_batch1.js','questions_rare_batch2.js','questions_rare_batch3.js','questions_rare_batch4.js','questions_rare_batch5.js','questions_rare_batch6.js','questions_rare_batch7.js','questions_rare_batch8.js',
      'questions_junior_111_batch1.js','questions_junior_112_115_batch2.js','questions_junior_112_115_batch3.js','questions_junior_113_114_batch4.js','questions_junior_113_batch5.js',
      'questions_junior_115_central_batch6.js','questions_junior_115_central_taoyuan_batch7.js','questions_junior_115_taoyuan_kaohsiung_batch8.js',
      'questions_junior_115_kaohsiung_batch9.js','questions_junior_115_kaohsiung_batch10.js','questions_junior_115_kaohsiung_batch11.js',
      'questions_115_moe_nonchoice_batch12.js','questions_115_moe_nonchoice_batch13.js','questions_115_chsh_nonchoice_batch14.js','questions_115_neihu_batch15.js',
      'questions_112_tcfsh_batch16.js','questions_112_nchu_batch17.js','questions_113_nchu_batch18.js','questions_113_moe_batch19.js','questions_113_newtaipei_batch20.js'
    ],
    termArchive:[
      'terms_110_113.js','terms_112_115_extra.js','terms_111_115_extra2.js',
      'terms_rare_batch3.js','terms_rare_batch4.js','terms_rare_batch5.js','terms_rare_batch6.js','terms_rare_batch7.js','terms_rare_batch8.js','terms_rare_batch9.js',
      'terms_115_cksh_batch10.js','terms_115_moe_batch11.js','terms_115_chsh_batch12.js','terms_115_hchs_batch13.js','terms_115_zsgsh_batch14.js',
      'terms_114_ntnu_batch15.js','terms_112_moe_batch16.js','terms_112_tcfsh_batch17.js','terms_112_nchu_batch18.js','terms_113_nchu_batch19.js','terms_113_moe_batch20.js','terms_113_newtaipei_batch21.js'
    ],
    essayArchive:[
      'essay_115_neihu_batch.js','essay_115_hchs_batch.js','essay_115_zsgsh_batch.js','essay_114_ntnu_batch.js',
      'essay_112_moe_batch.js','essay_112_tcfsh_batch.js','essay_112_nchu_batch.js','essay_113_nchu_batch.js','essay_113_moe_batch.js','essay_113_newtaipei_batch.js'
    ],
    studyCore:[
      'coach.js','spaced_review.js','advanced_practice.js',
      'precise_terms_106_110.js','precise_terms_106_109_batch2.js','precise_terms_106_110_part2.js','precise_terms_107_moe_batch4.js',
      'precise_terms_111_113_batch4.js','precise_terms_114_115_batch6.js','precise_terms_edu_112_115_batch1.js','precise_terms_edu_113_115_batch8.js',
      'precise_terms_edu_112_batch9.js','precise_terms_edu_109_111_batch10.js','precise_terms_edu_106_108_batch11.js','precise_terms_radar.js'
    ],
    legacyUi:[
      'frequency_analysis.js','smart_practice.js','refresh_button.js','review-collapse.js','term-dashboard.js',
      'highfreq_115_cross_exam_batch1.js','highfreq_115_cross_exam_batch2.js','highfreq_115_cross_exam_batch3.js','highfreq_115_ui.js',
      'homepage_flow_115.js','daily_recommendation_115.js','daily_completion_115.js','weekly_learning_rhythm_115.js','confusion_tracking_115.js',
      'selfstudy_mission_115.js','selfstudy_interactive_115.js','selfstudy_interactive2_115.js','selfstudy_interactive3_115.js','selfstudy_interactive4_115.js',
      'ux_guardrails_115.js','ux_polish_115.js','ux_freeze_115.js'
    ],
    advanced:['performance_loader_v1.js']
  };

  const idle=(timeout=900)=>new Promise(resolve=>{
    if('requestIdleCallback'in window)requestIdleCallback(()=>resolve(),{timeout});
    else setTimeout(resolve,32);
  });

  function loadScript(src){
    const base=src.split('?')[0];
    if(loaded.has(base)||[...document.scripts].some(s=>(s.getAttribute('src')||'').split('?')[0]===base)){
      loaded.add(base);return Promise.resolve(true);
    }
    return new Promise(resolve=>{
      const s=document.createElement('script');
      s.src=`${src}${src.includes('?')?'&':'?'}v=${VERSION}`;
      s.async=false;s.dataset.dataLazy='2';
      s.onload=()=>{loaded.add(base);resolve(true)};
      s.onerror=()=>resolve(false);
      document.body.appendChild(s);
    });
  }

  async function loadGroup(name,{yieldBetween=true}={}){
    if(state.has(name))return state.get(name);
    const job=(async()=>{
      for(const src of (GROUPS[name]||[])){
        if(yieldBetween)await idle(700);
        await loadScript(src);
      }
      refreshApp(name);
      window.dispatchEvent(new CustomEvent('musicExamDataGroupReady',{detail:{name}}));
      return true;
    })();
    state.set(name,job);return job;
  }

  function refreshApp(reason){
    try{
      window.MusicTeacherContentAdapter?.refresh?.();
      window.MusicTeacherExam?.refreshData?.(reason);
      window.dispatchEvent(new CustomEvent('musicExamDataChanged',{detail:{reason}}));
    }catch(e){console.warn('[data-loader-v2] refresh skipped',e)}
  }

  function intentFrom(target){
    const el=target?.closest?.('button,[data-mode],[data-g],select');if(!el)return;
    const id=el.id||'',mode=el.dataset?.mode||'',group=el.dataset?.g||'';
    if(mode||id==='filteredQuizBtn'||group==='practice'||group==='radar'){
      loadGroup('questionCore',{yieldBetween:false});loadGroup('questionArchive');
    }
    if(id==='termBtn'||id==='showTermBtn'||id==='nextTermBtn'||group==='written'){
      loadGroup('termArchive',{yieldBetween:false});loadGroup('studyCore');
    }
    if(id==='essayBtn'||id==='showHintBtn'||id==='nextEssayBtn'||group==='written')loadGroup('essayArchive',{yieldBetween:false});
    if(group==='learning')loadGroup('advanced');
  }

  document.addEventListener('pointerover',e=>intentFrom(e.target),{passive:true,capture:true});
  document.addEventListener('pointerdown',e=>intentFrom(e.target),{passive:true,capture:true});
  document.addEventListener('focusin',e=>intentFrom(e.target),{passive:true,capture:true});

  const warmCore=()=>loadGroup('questionCore');
  if('requestIdleCallback'in window)requestIdleCallback(warmCore,{timeout:2200});else setTimeout(warmCore,900);

  setTimeout(()=>loadGroup('termArchive'),6500);
  setTimeout(()=>loadGroup('essayArchive'),9000);
  setTimeout(()=>loadGroup('questionArchive'),12000);
  setTimeout(()=>loadGroup('studyCore'),15000);
  setTimeout(()=>loadGroup('advanced'),18000);
  setTimeout(()=>loadGroup('legacyUi'),22000);

  window.MusicExamDataLoaderV2={loadGroup,state,groups:GROUPS,refresh:refreshApp};
})();
