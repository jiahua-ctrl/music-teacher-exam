(()=>{
 if(window.__LEARNING_SYNC__)return;window.__LEARNING_SYNC__=true;
 let timer=null;
 function sync(reason='manual'){
  clearTimeout(timer);timer=setTimeout(()=>{
   window.MusicTeacherSRS?.render?.();
   window.DailyExamMission?.render?.();
   window.LearningProgress?.render?.();
   window.StudyNotesLibrary?.render?.();
   const pp=document.getElementById('personalPriorityRadar');
   if(pp)window.PersonalExamPriority?.render?.(pp.dataset.level||'');
   window.HomeCategoryOrganizer?.apply?.();
   window.dispatchEvent(new CustomEvent('musicExamLearningSynced',{detail:{reason,at:Date.now()}}));
  },80)
 }
 window.addEventListener('pageshow',e=>sync(e.persisted?'bfcache-return':'pageshow'));
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')sync('visible')});
 window.addEventListener('focus',()=>sync('focus'));
 window.addEventListener('storage',e=>{if(['musicTeacherExamStatsV1','musicTeacherExamSpacedReviewV1','musicTeacherExamOptionNotesV1','musicTeacherExamQuestionNotesV1','musicTeacherExamNoteFocusV1'].includes(e.key))sync('storage')});
 window.addEventListener('musicExamLatestModulesReady',()=>sync('modules-ready'),{once:true});
 window.MusicExamLearningSync={sync};
})();