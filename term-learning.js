(()=>{
const KEY='musicTeacherTermLearningV1';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return{}}};
const save=x=>localStorage.setItem(KEY,JSON.stringify(x));
const norm=s=>String(s||'').toLowerCase().replace(/[\s\-–—／/、，。；：:()（）《》〈〉「」『』]/g,'');
const tokens=s=>String(s||'').split(/[；;、，,／/｜|\n]/).map(x=>x.trim()).filter(x=>x.length>=2);
const zhAnswers=t=>String(t.zh||'').split(/[／/、；;]/).map(x=>x.trim()).filter(Boolean);
const contains=(text,word)=>norm(text).includes(norm(word));
function inferDims(t){const text=`${t.definition||''} ${t.exam||''} ${t.related||''}`,dims=[];
 const rules=[
 ['🎵 What｜核心定義',tokens(t.definition).slice(0,4)],
 ['🕰️ When｜時代／年代',(text.match(/(?:\d{2,4}世紀|\d{3,4}年代|中世紀|文藝復興|巴洛克|古典時期|浪漫時期|20世紀|現代|當代)/g)||[])],
 ['🌍 Where｜地點／國家',(text.match(/(?:法國|德國|義大利|美國|日本|韓國|印度|葡萄牙|西非|中亞|威尼斯|巴黎|維也納|聖馬可大教堂|蒙古|圖瓦)/g)||[])],
 ['👤 Who｜人物',tokens(t.related).filter(x=>/[A-Za-zÀ-ž]{3,}/.test(x)||/[·・]/.test(x)).slice(0,4)],
 ['🎼 Works／例證',tokens(t.related).filter(x=>/《|Sonata|Passion|Prometheus|Birth|Pierrot|Symphonie|Wozzeck|opera|concerto/i.test(x)).slice(0,3)]
 ];
 rules.forEach(([label,ks])=>{ks=[...new Set(ks)].filter(Boolean);if(ks.length)dims.push([label,ks])});
 if(t.exam)dims.push(['🎯 Exam｜教甄高鑑別度',tokens(t.exam).filter(x=>!/^\d{3}/.test(x)).slice(0,4)]);
 return dims.slice(0,6);
}
function teacherIdeas(t){const topic=t.topic||'',ideas=[];
 if(/世界音樂|樂器|聲樂/.test(topic))ideas.push('🎧 先聽一小段代表聲響，不先公布名詞，請學生描述聽到的特徵。');
 else if(/曲式|樂理|和聲|織體|節奏/.test(topic))ideas.push('🧩 把結構或關鍵元素做成卡片，讓學生先分類、排列或找出差異。');
 else ideas.push('🎧 先用代表作品或聲音片段導入，讓學生從聽覺線索猜概念。');
 if(/中世紀|文藝復興|巴洛克|古典|浪漫|20世紀/.test(topic))ideas.push('🕰️ 把它放回音樂史時間軸，再連到同時期的人物、作品與社會背景。');
 if(t.related)ideas.push(`🔗 線索串聯：${t.related}。請學生說明這些線索為什麼和本名詞有關。`);
 ideas.push('✍️ 最後撤掉提示，用「是什麼＋關鍵背景＋代表人物／作品」寫成 3～5 句考場答案。');
 return ideas;
}
function scoreZh(t,input){if(!input.trim())return 0;return zhAnswers(t).some(a=>contains(input,a)||contains(a,input))?100:35}
function scoreExplain(t,input,dims){if(!input.trim())return 0;const hits=dims.filter(([,ks])=>ks.some(k=>contains(input,k))).length;return Math.round(hits/Math.max(1,dims.length)*100)}
function dueDays(score,confidence){if(confidence===0||score<45)return 1;if(score<70)return 3;if(score<90)return 7;return 14}
function installStyles(){if($('termLearningStyles'))return;const s=document.createElement('style');s.id='termLearningStyles';s.textContent=`.term-recall{margin:16px 0}.term-recall textarea,.term-recall input{width:100%;border:1px solid var(--line);border-radius:12px;padding:12px;font:inherit;background:var(--card);color:var(--text)}.term-recall textarea{min-height:150px}.term-confidence{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:8px 0 16px}.term-confidence button.active{outline:3px solid rgba(107,79,163,.28)}.term-diagnosis{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin:12px 0}.term-diag{padding:12px;border:1px solid var(--line);border-radius:12px}.term-diag.hit{background:#eef7f1}.term-diag.miss{background:#fff3f1}.term-score{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:14px 0}.term-score>div{text-align:center;padding:12px;border:1px solid var(--line);border-radius:12px}.term-score strong{font-size:24px;display:block}.term-teacher{padding:14px;border-radius:14px;background:#fbf8ef;margin-top:14px}.term-next-review{padding:12px;border-radius:12px;background:var(--soft);margin-top:12px;font-weight:700}@media(max-width:620px){.term-confidence,.term-diagnosis,.term-score{grid-template-columns:1fr}}`;document.head.appendChild(s)}
function setup(){const view=$('termView');if(!view)return;installStyles();const zh=$('termZh'),show=$('showTermBtn'),answer=$('termAnswer');if(zh)zh.style.display='none';
 const old=show?.parentElement?.querySelector('.term-recall');if(old)old.remove();
 const box=document.createElement('div');box.className='term-recall';box.innerHTML=`<p class="muted">先不要看答案。看到原文後，測試自己能不能從腦中主動提取。</p><b>① 第一眼熟悉度</b><div class="term-confidence"><button class="ghost" data-c="2">🟢 我知道</button><button class="ghost" data-c="1">🟡 有印象</button><button class="ghost" data-c="0">🔴 完全不知道</button></div><b>② 中文名稱</b><input id="termZhRecall" placeholder="請自己輸入中文名稱"><br><br><b>③ 教甄名詞解釋</b><textarea id="termExplainRecall" placeholder="請用考場會寫的方式回答。可想：是什麼？何時？哪裡？誰？為什麼？如何？代表作品？"></textarea>`;
 show?.before(box);if(show)show.textContent='🔍 完成作答，開始診斷';let confidence=null;
 box.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{confidence=Number(b.dataset.c);box.querySelectorAll('[data-c]').forEach(x=>x.classList.toggle('active',x===b))});
 show?.addEventListener('click',()=>setTimeout(()=>diagnose(confidence),0));
 $('nextTermBtn')?.addEventListener('click',()=>setTimeout(reset,0));
 $('termBackBtn')?.addEventListener('click',reset);
}
function reset(){const z=$('termZhRecall'),e=$('termExplainRecall');if(z)z.value='';if(e)e.value='';document.querySelectorAll('.term-confidence button').forEach(x=>x.classList.remove('active'));const zh=$('termZh');if(zh)zh.style.display='none'}
function diagnose(confidence){const t=window.MusicTeacherExam?.terms?.find(x=>x.term===$('termName')?.textContent);if(!t)return;const zi=$('termZhRecall')?.value||'',ei=$('termExplainRecall')?.value||'',dims=inferDims(t),rec=scoreZh(t,zi),exp=scoreExplain(t,ei,dims);const ans=$('termAnswer');if(!ans)return;
 const diag=dims.map(([label,ks])=>{const hit=ks.some(k=>contains(ei,k));return `<div class="term-diag ${hit?'hit':'miss'}"><b>${hit?'✓':'△'} ${esc(label)}</b><small>${hit?'你的答案有抓到這一塊':'這次可再補強'}${ks.length?`｜線索：${esc(ks.slice(0,3).join('、'))}`:''}</small></div>`}).join('');
 const ideas=teacherIdeas(t).map(x=>`<div>${esc(x)}</div>`).join('');const total=Math.round(rec*.35+exp*.65),days=dueDays(total,confidence),d=new Date();d.setDate(d.getDate()+days);const data=load();data[t.id]={recognition:rec,expression:exp,score:total,confidence,at:Date.now(),due:d.toISOString()};save(data);
 ans.innerHTML=`<div class="feedback-title">📖 ${esc(t.zh||'')}</div><p>${esc(t.definition||'')}</p><div class="feedback-title">🧭 人事時地物 × 得分點診斷</div><div class="term-diagnosis">${diag}</div><div class="feedback-title">🎯 教甄答題重點</div><p>${esc(t.exam||'')}</p><div class="source-box">相關：${esc(t.related||'')}</div><div class="term-score"><div>🧠 辨識力<strong>${rec}</strong><small>/100</small></div><div>✍️ 表達力<strong>${exp}</strong><small>/100</small></div></div><div class="term-teacher"><b>👩‍🏫 如果我是老師，我可以怎麼教？</b>${ideas}</div><div class="term-next-review">🧠 本題綜合 ${total} 分｜建議 ${days} 天後（${d.getMonth()+1}/${d.getDate()}）再做一次無提示回想。</div>`;ans.classList.remove('hidden');
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(setup,50));
})();