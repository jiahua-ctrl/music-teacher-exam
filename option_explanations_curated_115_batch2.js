(()=>{
 const bank={
 '115-analysis-001':{A:'Inversion（倒影／反行）把音程方向上下顛倒，例如原本上行三度改為下行三度；節奏可維持，因此符合題意。',B:'Retrograde（逆行）是把音的先後順序倒過來，不是把每個音程方向上下翻轉。',C:'Sequence（模進）是將動機或樂句移到另一音高層次重複，輪廓通常保留。',D:'Augmentation（增值）主要把節奏時值按比例拉長，處理的是時間長度而非音程方向。'},
 '115-analysis-002':{A:'Inversion 改變的是音程方向；題目強調「最後一音往第一音」的順序反轉，因此不是倒影。',B:'Retrograde 就是逆行：將原來的事件順序由後往前重現，因此為正解。',C:'Sequence 是模進，把同一動機移到不同音高位置重複，並不反轉時間順序。',D:'Diminution（減值）是把節奏時值按比例縮短，不涉及音高順序反轉。'},
 '115-analysis-003':{A:'Sequence（模進）保留動機或樂句的相對輪廓，再整體移至另一音高層次重複，正符合題意。',B:'Retrograde 是把音的時間順序反過來，並非平移到另一音高層次。',C:'Augmentation 是延長節奏時值，重點在時間比例，不在音高移位。',D:'Pedal point（持續低音／持續音）是在和聲變化時長時間維持某一音，與動機移位重複不同。'},
 '115-analysis-004':{A:'Diminution（減值）是把原有時值按比例縮短，例如四分音符變八分音符，方向與題意相反。',B:'Augmentation（增值）把節奏時值按固定比例拉長，例如變為兩倍，因此為正解。',C:'Inversion 是音程方向上下顛倒，主要處理音高關係，不是時值比例。',D:'Stretto（緊接）常見於賦格，指後一聲部在前一主題尚未結束前提早進入，並非單純延長時值。'},
 '115-analysis-005':{A:'Neighbor tone（鄰音）從某和弦音級進離開，再級進回到同一和弦音，正符合題意。',B:'Suspension（掛留音）通常是前一和弦的和弦音延留到下一和弦形成不協和，再向下級進解決；結構與鄰音不同。',C:'Anticipation（先現音）提早出現下一和弦的和弦音，通常在和聲真正到達前先出現。',D:'Appoggiatura（倚音）常以跳進到非和弦音，再級進解決；與「級進離開又回原音」的鄰音模式不同。'},
 '115-analysis-006':{A:'Escape tone（逸音）一般由和弦音級進到非和弦音，再跳進離開；不具典型的準備－掛留－解決三階段。',B:'Suspension（掛留音）是前一和弦音延留到新和聲成為不協和，之後多向下級進解決，因此為正解。',C:'Anticipation（先現音）是下一和弦的音提早出現，通常先於和聲變換出現，不是延留舊和弦音。',D:'Passing tone（經過音）通常以級進連接兩個不同的和弦音，重點是「經過」而不是延留後解決。'}
 };
 (window.LOCAL_QUESTIONS||[]).forEach(q=>{if(bank[q.id])q.option_explanations={...(q.option_explanations||{}),...bank[q.id]}});
 window.MUSIC_OPTION_EXPLANATION_CURATED=window.MUSIC_OPTION_EXPLANATION_CURATED||{};Object.assign(window.MUSIC_OPTION_EXPLANATION_CURATED,bank);
})();