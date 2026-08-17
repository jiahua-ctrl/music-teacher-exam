const QUESTIONS = Array.isArray(window.LOCAL_QUESTIONS) ? window.LOCAL_QUESTIONS : [];
const ESSAYS = Array.isArray(window.ESSAY_PROMPTS) ? window.ESSAY_PROMPTS : [];
const STORAGE_KEY = 'musicTeacherExamStatsV1';
const THEME_KEY = 'musicTeacherExamThemeV1';

const $ = id => document.getElementById(id);
const views = ['homeView','quizView','essayView','resultView'];
let quiz = [];
let quizIndex = 0;
let quizCorrect = 0;
let lastMode = 'random10';
let currentEssay = null;

function defaultStats(){
  return { attempts:{}, wrong:[], daily:{}, topics:{} };
}
function loadStats(){
  try { return {...defaultStats(), ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {})}; }
  catch { return defaultStats(); }
}
function saveStats(stats){ localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)); }
function todayKey(){
  const d = new Date();
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function shuffle(items){
  const a=[...items];
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function showView(id){
  views.forEach(v => $(v)?.classList.toggle('active', v===id));
  window.scrollTo({top:0,behavior:'smooth'});
}
function trackOf(q){
  if(q.subject==='國中音樂') return 'junior';
  if(q.subject==='高中音樂') return 'senior';
  return 'education';
}
function calcAccuracy(filter){
  const stats=loadStats();
  let correct=0,total=0;
  QUESTIONS.filter(filter).forEach(q=>{
    const a=stats.attempts[q.id];
    if(a){ correct+=a.correct||0; total+=a.total||0; }
  });
  return total ? Math.round(correct/total*100) : null;
}
function renderHome(){
  const stats=loadStats();
  $('totalQuestions').textContent=QUESTIONS.length;
  const sourced=QUESTIONS.filter(q=>q.source_type && q.source_type!=='自編練習').length;
  $('dataStatus').textContent=`目前 ${QUESTIONS.length} 題選擇題＋${ESSAYS.length} 題申論／試教挑戰，其中 ${sourced} 題具近年考點來源標示。`;
  $('todayPractice').textContent=stats.daily?.[todayKey()] || 0;
  const ja=calcAccuracy(q=>q.subject==='國中音樂');
  const ha=calcAccuracy(q=>q.subject==='高中音樂');
  const ea=calcAccuracy(q=>q.subject==='教育專業');
  $('juniorAccuracy').textContent=ja ?? '--';
  $('seniorAccuracy').textContent=ha ?? '--';
  $('eduAccuracy').textContent=ea ?? '--';
  $('wrongCount').textContent=(stats.wrong||[]).length;

  const topicEntries=Object.entries(stats.topics||{}).filter(([,v])=>v.total>0)
    .map(([topic,v])=>({topic,total:v.total,correct:v.correct,acc:Math.round(v.correct/v.total*100)}))
    .sort((a,b)=>a.acc-b.acc || b.total-a.total);
  $('weakestTopic').textContent=topicEntries.length ? `${topicEntries[0].topic} ${topicEntries[0].acc}%` : '尚無資料';

  const box=$('weaknessList');
  if(!topicEntries.length){ box.innerHTML='<p class="muted">作答後會開始分析。</p>'; return; }
  box.innerHTML=topicEntries.slice(0,8).map(x=>`<div class="weak-row"><div class="weak-label">${escapeHtml(x.topic)}</div><div class="weak-bar"><span style="width:${x.acc}%"></span></div><div class="weak-score">${x.acc}% · ${x.total}題次</div></div>`).join('');
}
function escapeHtml(s=''){
  return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function startQuiz(mode){
  lastMode=mode;
  const stats=loadStats();
  let pool=QUESTIONS;
  if(mode==='junior') pool=QUESTIONS.filter(q=>q.subject==='國中音樂');
  if(mode==='senior') pool=QUESTIONS.filter(q=>q.subject==='高中音樂');
  if(mode==='education') pool=QUESTIONS.filter(q=>q.subject==='教育專業');
  if(mode==='wrong') pool=QUESTIONS.filter(q=>(stats.wrong||[]).includes(q.id));
  if(mode==='wrong' && !pool.length){ alert('目前沒有錯題，先去做幾題吧！'); return; }
  quiz=shuffle(pool);
  if(mode==='random10') quiz=quiz.slice(0,Math.min(10,quiz.length));
  quizIndex=0; quizCorrect=0;
  showView('quizView');
  renderQuestion();
}
function renderQuestion(){
  const q=quiz[quizIndex];
  if(!q){ finishQuiz(); return; }
  $('questionProgress').textContent=`${quizIndex+1} / ${quiz.length}`;
  $('quizScore').textContent=`答對 ${quizCorrect}`;
  $('progressBar').style.width=`${quizIndex/quiz.length*100}%`;
  $('questionSubject').textContent=q.subject;
  $('questionTopic').textContent=q.topic;
  $('questionLevel').textContent=q.year ? `${q.level} · ${q.year}年` : q.level;
  $('questionText').textContent=q.question;
  $('feedback').classList.add('hidden');
  $('nextBtn').classList.add('hidden');
  const options=[['A',q.option_a],['B',q.option_b],['C',q.option_c],['D',q.option_d]];
  $('options').innerHTML=options.map(([k,t])=>`<button class="option-btn" data-choice="${k}"><b>${k}.</b> ${escapeHtml(t)}</button>`).join('');
  document.querySelectorAll('.option-btn').forEach(btn=>btn.addEventListener('click',()=>answerQuestion(btn.dataset.choice)));
}
function answerQuestion(choice){
  const q=quiz[quizIndex];
  const correct=choice===q.answer;
  if(correct) quizCorrect++;
  document.querySelectorAll('.option-btn').forEach(btn=>{
    btn.disabled=true;
    if(btn.dataset.choice===q.answer) btn.classList.add('correct');
    if(btn.dataset.choice===choice && !correct) btn.classList.add('wrong');
  });
  $('feedbackTitle').textContent=correct ? '✅ 答對了' : `❌ 正確答案是 ${q.answer}`;
  $('explanation').textContent=q.explanation;
  const meta=[q.year?`${q.year}年`:null,q.exam,q.source_type].filter(Boolean).map(escapeHtml).join('｜');
  const sourceTitle=escapeHtml(q.source_title||'練習題');
  const sourceLink=q.source_url ? `<br><a href="${escapeHtml(q.source_url)}" target="_blank" rel="noopener noreferrer">🔗 查看來源／核對考點</a>` : '';
  $('sourceBox').innerHTML=`${meta?`<b>${meta}</b><br>`:''}來源標示：${sourceTitle}<br>題號：${escapeHtml(q.id)}${sourceLink}`;
  $('feedback').classList.remove('hidden');
  $('nextBtn').classList.remove('hidden');
  recordAttempt(q,correct);
}
function recordAttempt(q,correct){
  const stats=loadStats();
  stats.attempts[q.id]=stats.attempts[q.id]||{total:0,correct:0};
  stats.attempts[q.id].total++;
  if(correct) stats.attempts[q.id].correct++;
  stats.topics[q.topic]=stats.topics[q.topic]||{total:0,correct:0};
  stats.topics[q.topic].total++;
  if(correct) stats.topics[q.topic].correct++;
  stats.daily=stats.daily||{};
  stats.daily[todayKey()]=(stats.daily[todayKey()]||0)+1;
  const wrong=new Set(stats.wrong||[]);
  if(correct) wrong.delete(q.id); else wrong.add(q.id);
  stats.wrong=[...wrong];
  saveStats(stats);
}
function nextQuestion(){
  quizIndex++;
  if(quizIndex>=quiz.length) finishQuiz(); else renderQuestion();
}
function finishQuiz(){
  const pct=quiz.length ? Math.round(quizCorrect/quiz.length*100) : 0;
  $('resultScore').textContent=pct;
  $('resultEmoji').textContent=pct>=90?'🏆':pct>=70?'🎉':pct>=50?'💪':'🌱';
  $('resultTitle').textContent=pct>=80?'這輪很穩！':'完成一輪了！';
  $('resultSummary').textContent=`本次 ${quiz.length} 題，答對 ${quizCorrect} 題。錯題已自動加入錯題本。`;
  $('progressBar').style.width='100%';
  showView('resultView');
  renderHome();
}
function drawEssay(){
  if(!ESSAYS.length) return;
  const choices=ESSAYS.filter(x=>!currentEssay || x.id!==currentEssay.id);
  currentEssay=(choices.length?choices:ESSAYS)[Math.floor(Math.random()*(choices.length||ESSAYS.length))];
  $('essayLevel').textContent=currentEssay.level;
  $('essayTopic').textContent=currentEssay.topic;
  $('essayQuestion').textContent=currentEssay.question;
  $('essayAnswer').value='';
  $('essayHint').classList.add('hidden');
  $('essayHint').innerHTML='';
}
function openEssay(){ drawEssay(); showView('essayView'); }
function showEssayHint(){
  if(!currentEssay) return;
  $('essayHint').innerHTML=`<div class="feedback-title">💡 答題提示</div><p>${escapeHtml(currentEssay.hint)}</p>`;
  $('essayHint').classList.remove('hidden');
}
function applyTheme(){
  const dark=localStorage.getItem(THEME_KEY)==='dark';
  document.body.classList.toggle('dark',dark);
  $('themeBtn').textContent=dark?'☀️':'🌙';
}
function toggleTheme(){
  localStorage.setItem(THEME_KEY,document.body.classList.contains('dark')?'light':'dark');
  applyTheme();
}

window.addEventListener('DOMContentLoaded',()=>{
  applyTheme(); renderHome();
  document.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>startQuiz(btn.dataset.mode)));
  $('nextBtn').addEventListener('click',nextQuestion);
  $('quitBtn').addEventListener('click',()=>{showView('homeView');renderHome();});
  $('homeBtn').addEventListener('click',()=>{showView('homeView');renderHome();});
  $('retryBtn').addEventListener('click',()=>startQuiz(lastMode));
  $('essayBtn').addEventListener('click',openEssay);
  $('essayBackBtn').addEventListener('click',()=>{showView('homeView');renderHome();});
  $('showHintBtn').addEventListener('click',showEssayHint);
  $('nextEssayBtn').addEventListener('click',drawEssay);
  $('themeBtn').addEventListener('click',toggleTheme);
  $('resetBtn').addEventListener('click',()=>{
    if(confirm('確定要清除這個裝置上的所有作答紀錄嗎？')){ localStorage.removeItem(STORAGE_KEY); renderHome(); }
  });
});