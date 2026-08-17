(()=>{
  const qs=Array.isArray(window.LOCAL_QUESTIONS)?window.LOCAL_QUESTIONS:[];
  const reg=window.QUESTION_VERIFICATION||{};
  const esc=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const norm=s=>String(s||'').toLowerCase().replace(/[\s（）()，、,.:：；;「」『』〈〉《》'"\-_/]/g,'');
  const generic=new Set(['國中音樂','高中音樂','教育專業','世界音樂','臺灣音樂','台灣音樂','音樂史','和聲','曲式','歌劇','樂器學','二十世紀音樂','音樂教學法']);
  function concept(q){const tags=String(q.tags||'').split(';').map(x=>x.trim()).filter(Boolean);const specific=tags.find(x=>!generic.has(x)&&norm(x)!==norm(q.topic));return `${norm(q.topic)}|${norm(specific||q.answer||q.question.slice(0,18))}`}
  function state(q){const r=reg[q.id];if(r?.status==='official_verified')return'green';if(r?.status==='cross_checked'||r?.status==='source_confirmed')return'yellow';return'red'}
  const groups=new Map();qs.forEach(q=>{const k=concept(q);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(q)});
  const dups=[...groups.values()].filter(a=>a.length>1).sort((a,b)=>b.length-a.length);
  const counts={green:0,yellow:0,red:0};qs.forEach(q=>counts[state(q)]++);
  document.getElementById('qGreen').textContent=counts.green;document.getElementById('qYellow').textContent=counts.yellow;document.getElementById('qRed').textContent=counts.red;document.getElementById('qDup').textContent=dups.length;
  const badge=s=>`<span class="qc-badge ${s}">${s==='green'?'🟢 官方逐題核對':s==='yellow'?'🟡 已有證據':'🔴 待人工核對'}</span>`;
  function row(q){const s=state(q),r=reg[q.id]||{};return `<div class="qc-row">${badge(s)} <b>${esc(q.id||'')}</b>｜${esc(q.subject||'')}・${esc(q.topic||'')}<div style="margin-top:7px">${esc(q.question||'')}</div><small>目前答案：${esc(q.answer||'—')}｜${esc(q.exam||q.source_title||'未標示來源')}</small>${r.note?`<div class="qc-note">${esc(r.note)}${r.checked?`<br>核對日期：${esc(r.checked)}`:''}</div>`:''}${q.source_url?`<div><a href="${esc(q.source_url)}" target="_blank" rel="noopener">原題來源 ↗</a></div>`:''}${(r.evidence||[]).map((u,i)=>`<div><a href="${esc(u)}" target="_blank" rel="noopener">交叉證據 ${i+1} ↗</a></div>`).join('')}</div>`}
  function priority(){const arr=qs.slice().sort((a,b)=>({red:0,yellow:1,green:2}[state(a)]-({red:0,yellow:1,green:2}[state(b)]) || (b.source_type?.includes('官方')?1:0)-(a.source_type?.includes('官方')?1:0));return arr.slice(0,100).map(row).join('')||'<p>尚無題目。</p>'}
  function duplicate(){return dups.slice(0,50).map(g=>`<div class="qc-row"><span class="qc-badge blue">♻️ 同一考點 ${g.length} 題</span><b style="margin-left:6px">${esc(g[0].topic||'')}</b><div class="qc-note">${g.map(q=>`${esc(q.id)}｜${esc(q.question)}`).join('<br>')}</div><small>智慧出題會優先限制同一考點在同一輪只出現 1 題；已熟練者再額外降權。</small></div>`).join('')||'<p class="muted">目前未偵測到明顯重複群。</p>'}
  function verified(){const arr=qs.filter(q=>reg[q.id]).sort((a,b)=>String(reg[b.id].checked||'').localeCompare(String(reg[a.id].checked||'')));return arr.map(row).join('')||'<p class="muted">尚無人工核對紀錄。</p>'}
  const box=document.getElementById('qcList');function render(tab){box.innerHTML=tab==='duplicate'?duplicate():tab==='verified'?verified():priority()}
  document.querySelectorAll('[data-qc-tab]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-qc-tab]').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.qcTab)}));
  render('priority');
})();