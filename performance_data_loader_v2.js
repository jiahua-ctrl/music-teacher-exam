(()=>{
  if(window.__MUSIC_EXAM_DATA_LOADER_V2__)return;
  window.__MUSIC_EXAM_DATA_LOADER_V2__=true;

  const VERSION='20260820-v2c';
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
      'questions_112_tcfsh_batch16.js','questions_112_nchu_batch17.js','questions_113_nchu_batch18.js','questions_113_moe_batch19.js','questions_113_newtaipei_batch20.js',
      'questions_108_110_backfill_batch21.js','questions_106_107_backfill_batch22.js','questions_107_highschool_depth_batch23.js','questions_107_music_education_batch24.js',
      'questions_108_highschool_depth_batch25.js','questions_111_112_highschool_depth_batch26.js','questions_112_113_highschool_depth_batch27.js','questions_114_junior_senior_depth_batch28.js',
      'questions_115_junior_senior_depth_batch29.js','questions_115_analysis_depth_batch30.js','content_adapter_v1.js'
    ],
    termArchive:[
      'terms_110_113.js','terms_112_115_extra.js','terms_111_115_extra2.js',
      'terms_rare_batch3.js','terms_rare_batch4.js','terms_rare_batch5.js','terms_rare_batch6.js','terms_rare_batch7.js','terms_rare_batch8.js','terms_rare_batch9.js',
      'terms_115_cksh_batch10.js','terms_115_moe_batch11.js','terms_115_chsh_batch12.js','terms_115_hchs_batch13.js','terms_115_zsgsh_batch14.js',
      'terms_114_ntnu_batch15.js','terms_112_moe_batch16.js','terms_112_tcfsh_batch17.js','terms_112_nchu_batch18.js','terms_113_nchu_batch19.js','terms_113_moe_batch20.js','terms_113_newtaipei_batch21.js',
      'terms_108_110_backfill.js','terms_109_highschool_backfill.js','terms_110_highschool_depth.js','terms_111_112_highschool_backfill.js','terms_113_highschool_backfill.js','terms_115_highschool_depth.js','terms_115_moe_changhua_batch31.js'
    ],
    essayArchive:[
      'essay_115_neihu_batch.js','essay_115_hchs_batch.js','essay_115_zsgsh_batch.js','essay_114_ntnu_batch.js',
      'essay_112_moe_batch.js','essay_112_tcfsh_batch.js','essay_112_nchu_batch.js','essay_113_nchu_batch.js','essay_113_moe_batch.js','essay_113_newtaipei_batch.js',
      'essay_107_lioujia_backfill.js','essay_108_changhua_girls_detailed.js','essay_110_highschool_detailed.js','essay_111_112_highschool_detailed.js',
      'essay_113_highschool_detailed.js','essay_114_highschool_detailed.js','essay_115_junior_senior_detailed.js','essay_115_moe_changhua_batch31.js'
    ],
    todayUi:[
      'home-layering.js','mobile-home.js','score-hierarchy.js','daily_mission.js',
      'daily_recommendation_115.js','daily_completion_115.js','weekly_learning_rhythm_115.js'
    ],
    practiceUi:[
      'smart_practice.js','advanced_practice.js','review-collapse.js','refresh_button.js',
      'question_quality_rules_v1.js','canonical_concepts_v1.js','high_frequency_ladder_v2.js','difficulty_ladder_v1.js','concept_mastery_v1.js','duplicate_ladder_v2.js',
      'option_explanations_curated_115_batch1.js','option_explanations_curated_115_batch2.js','option_explanations_curated_114_batch2.js','option_explanations_curated_112_113_batch4.js',
      'option_explanations_curated_111_batch5.js','option_explanations_curated_108_110_batch6.js','option_explanations_curated_108_depth_batch7.js','option_explanations_curated_107_depth_batch8.js',
      'option_explanations_curated_107_education_batch9.js','option_explanations_curated_106_107_backfill_batch10.js','option_explanations_v1.js','option_explanation_ui_v1.js',
      'wrong_book_views.js','unknown_book_views.js'
    ],
    radarUi:[
      'frequency_analysis.js','precise_terms_106_110.js','precise_terms_106_109_batch2.js','precise_terms_106_110_part2.js','precise_terms_107_moe_batch4.js',
      'precise_terms_111_113_batch4.js','precise_terms_114_115_batch6.js','precise_terms_edu_112_115_batch1.js','precise_terms_edu_113_115_batch8.js',
      'precise_terms_edu_112_batch9.js','precise_terms_edu_109_111_batch10.js','precise_terms_edu_106_108_batch11.js','precise_terms_radar.js',
      'highfreq_115_cross_exam_batch1.js','highfreq_115_cross_exam_batch2.js','highfreq_115_cross_exam_batch3.js','highfreq_115_ui.js','radar_106_115_priority_v1.js'
    ],
    learningUi:[
      'ability-map.js','learning-history.js','weekly-summary.js','weekly-review.js','confusion_tracking_115.js',
      'study_notes_library.js','weakness_trend.js','personal_priority.js','learning_progress.js','question_mastery_overview.js','mastery_dashboard.js','top_stats_labels.js','learning_compact_ui.js','learning_sync.js',
      'selfstudy_mission_115.js','selfstudy_interactive_115.js','selfstudy_interactive2_115.js','selfstudy_interactive3_115.js','selfstudy_interactive4_115.js'
    ],
    writtenUi:[
      'term_content_enrichment_115.js','term-learning.js','term-ux-fix.js','bad-question.js','nonchoice-center.js','nonchoice-progress.js','trial-diagnosis.js',
      'term-mastery-ladder.js','term-answer-structure.js','term-points-mode.js','term-next-action.js','term-readiness-summary.js','term-daily-plan.js','term-daily-runner.js','term-daily-resume.js',
      'concept_knowledge_pages.js','concept_trial_teaching.js','trial_teaching_challenge.js','trial_teaching_reflection.js','trial_teaching_focus_banner.js','trial_teaching_focus_reflection.js',
      'trial_teaching_learning_summary.js','trial_teaching_milestones.js'
    ],
    polishUi:['ux_guardrails_115.js','ux_polish_115.js','ux_freeze_115.js']
  };

  const idle=(timeout=800)=>new Promise(resolve=>{
    if('requestIdleCallback'in window)requestIdleCallback(()=>resolve(),{timeout});
    else setTimeout(resolve,24);
  });

  function loadScript(src){
    const base=src.split('?')[0];
    if(loaded.has(base)||[...document.scripts].some(s=>(s.getAttribute('src')||'').split('?')[0]===base)){
      loaded.add(base);return Promise.resolve(true);
    }
    return new Promise(resolve=>{
      const s=document.createElement('script');
      s.src=`${src}${src.includes('?')?'&':'?'}v=${VERSION}`;
      s.async=false;
      s.dataset.dataLazy='2';
      s.onload=()=>{loaded.add(base);resolve(true)};
      s.onerror=()=>resolve(false);
      document.body.appendChild(s);
    });
  }

  async function loadGroup(name,{yieldBetween=true}={}){
    if(state.has(name))return state.get(name);
    const job=(async()=>{
      for(const src of (GROUPS[name]||[])){
        if(yieldBetween)await idle(650);
        await loadScript(src);
      }
      refreshApp(name);
      window.dispatchEvent(new CustomEvent('musicExamDataGroupReady',{detail:{name}}));
      return true;
    })();
    state.set(name,job);
    return job;
  }

  function refreshApp(reason){
    try{
      window.MusicTeacherContentAdapter?.refresh?.();
      window.MusicTeacherExam?.refreshData?.(reason);
      window.dispatchEvent(new CustomEvent('musicExamDataChanged',{detail:{reason}}));
    }catch(e){console.warn('[data-loader-v2] refresh skipped',e)}
  }

  function loadForGroup(group){
    if(group==='today'){
      loadGroup('todayUi');
      return;
    }
    if(group==='practice'){
      loadGroup('questionCore',{yieldBetween:false});
      loadGroup('practiceUi');
      loadGroup('questionArchive');
      return;
    }
    if(group==='radar'){
      loadGroup('questionArchive');
      loadGroup('termArchive');
      loadGroup('radarUi');
      return;
    }
    if(group==='learning'){
      loadGroup('learningUi');
      return;
    }
    if(group==='written'){
      loadGroup('termArchive',{yieldBetween:false});
      loadGroup('essayArchive',{yieldBetween:false});
      loadGroup('writtenUi');
    }
  }

  function intentFrom(target){
    const el=target?.closest?.('button,[data-mode],[data-g],select');
    if(!el)return;
    const id=el.id||'',mode=el.dataset?.mode||'',group=el.dataset?.g||'';
    if(group)loadForGroup(group);

    if(mode){
      loadGroup('questionCore',{yieldBetween:false});
      loadGroup('practiceUi');
      // 進入刷題後再慢慢補完整歷屆庫，不阻塞第一題顯示。
      loadGroup('questionArchive');
    }
    if(id==='yearFilter'||id==='subjectFilter'||id==='topicFilter'||id==='filteredQuizBtn'){
      loadGroup('questionArchive');
    }
    if(id==='termBtn'||id==='showTermBtn'||id==='nextTermBtn'){
      loadGroup('termArchive',{yieldBetween:false});
      loadGroup('writtenUi');
    }
    if(id==='essayBtn'||id==='showHintBtn'||id==='nextEssayBtn'){
      loadGroup('essayArchive',{yieldBetween:false});
      loadGroup('writtenUi');
    }
  }

  document.addEventListener('pointerover',e=>intentFrom(e.target),{passive:true,capture:true});
  document.addEventListener('pointerdown',e=>intentFrom(e.target),{passive:true,capture:true});
  document.addEventListener('focusin',e=>intentFrom(e.target),{passive:true,capture:true});

  // 2.0 穩定模式：首屏只暖最常用的小型資料與今日 UI。
  // 不再以 6.5～22 秒定時器自動把所有大模組塞回主執行緒。
  const warm=()=>{
    loadGroup('questionCore');
    loadGroup('todayUi');
    loadGroup('polishUi');
  };
  if('requestIdleCallback'in window)requestIdleCallback(warm,{timeout:1800});
  else setTimeout(warm,700);

  window.MusicExamDataLoaderV2={loadGroup,loadForGroup,state,groups:GROUPS,refresh:refreshApp};
})();
