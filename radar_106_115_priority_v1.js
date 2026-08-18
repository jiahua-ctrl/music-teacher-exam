// 106-115 音樂教甄十年考點雷達 v1
// 目的：不只統計字面重複，而是依「概念家族」整併跨年、跨題型考點。
// 注意：frequencyYears 為目前已整理批次中的跨年證據；後續逐卷核對後再更新精確次數。

window.MUSIC_EXAM_RADAR = window.MUSIC_EXAM_RADAR || [];
window.MUSIC_EXAM_RADAR.push(
 {topic:'臺灣／本土音樂',tags:['🔥跨年高頻','⬆️命題升級'],frequencyYears:['106','107','108','109','110','111','112','113','114','115'],priority:5,why:'從人物作品辨識一路升級到文化脈絡、教材轉化與跨域申論。',study:'人物＋作品＋年代地點＋文化背景＋可如何教。'},
 {topic:'原住民族音樂',tags:['🔥跨年高頻','⚠️易混淆'],frequencyYears:['108','110','111','112','113','114','115'],priority:5,why:'Pasibutbut、paSta’ay、鼻笛、祭典與族群文化反覆出現。',study:'族群／祭典／唱法或樂器／功能／代表採錄與當代轉化。'},
 {topic:'世界音樂',tags:['🔥跨年高頻','💎高鑑別'],frequencyYears:['109','110','111','112','113','114','115'],priority:5,why:'Gamelan、Raga、Khoomei、Pansori、Fado、Kora 等逐年擴張。',study:'國家地區＋文化功能＋聲音特色＋代表樂器／唱法。'},
 {topic:'Aleatory／偶然音樂',tags:['🔥跨年高頻','⬆️命題升級'],frequencyYears:['110','112','113'],priority:5,why:'跨年重複，從名詞辨識到作品與教學應用。',study:'定義、Cage、控制與不確定性的程度、與序列音樂比較。'},
 {topic:'音樂教育法',tags:['🔥跨年高頻','⚠️易混淆'],frequencyYears:['107','108','111','114','115'],priority:5,why:'Kodály、Dalcroze、Gordon、Orff、Praxialism 等反覆考。',study:'人物→核心概念→典型活動→容易混淆法。'},
 {topic:'雙語／CLIL／EMI／多模態',tags:['🔥近年升溫','⬆️命題升級'],frequencyYears:['111','112','113','115'],priority:5,why:'從概念辨識升級為完整教案與差異化鷹架。',study:'音樂目標優先、語言鷹架、sentence frames、多模態與評量。'},
 {topic:'AI／數位音樂／媒體素養',tags:['🔥近年升溫','⬆️命題升級'],frequencyYears:['111','113','114','115'],priority:5,why:'著作權、Podcast、AI創作、設計思考與數位工具已進正式教甄。',study:'工具只是手段；一定補著作權、查證、AI倫理與學習證據。'},
 {topic:'議題融入／SDGs／SEL',tags:['🔥近年升溫','⬆️命題升級'],frequencyYears:['108','109','112','113','115'],priority:5,why:'性平、環境、人權、族群、SDGs、SEL逐漸與音樂教學綁定。',study:'避免硬塞議題；用聲音文本、任務與反思讓議題真正發生。'},
 {topic:'和聲／調式／移調／譜例分析',tags:['🔥高中核心','💎高鑑別'],frequencyYears:['107','108','110','111','112','114','115'],priority:5,why:'高中非選題長期穩定出現，且無法只靠背誦。',study:'每日短量實作：調式、增六／拿坡里、移調、非和弦音、動機變形。'},
 {topic:'中世紀－文藝復興名詞',tags:['🔥跨年高頻','⚠️易混淆'],frequencyYears:['107','108','109','110','112','115'],priority:4,why:'Gregorian chant、Ars Nova、Guido、Hexachord、Cori spezzati等持續出現。',study:'年代＋地點＋人物＋技法＋前後時期差異。'},
 {topic:'20世紀音樂技法',tags:['🔥跨年高頻','💎高鑑別'],frequencyYears:['107','108','109','110','113','114','115'],priority:5,why:'Serialism、musique concrète、prepared piano、polytonality、mystic chord等高密度出現。',study:'技法定義＋代表作曲家＋聲響特徵＋看譜辨識。'},
 {topic:'歌劇／音樂劇／劇場',tags:['🔥跨年高頻','⬆️教材轉化'],frequencyYears:['108','110','113','114','115'],priority:4,why:'Opera seria、Gluck、Gesamtkunstwerk、Triple Threat、臺灣音樂劇等跨類型出現。',study:'歷史類型＋人物作品＋劇場特徵＋當代／課堂連結。'}
);

window.getMusicExamRadarPriority = function(topic){
 const item=(window.MUSIC_EXAM_RADAR||[]).find(x=>x.topic===topic);
 return item ? item.priority : 0;
};
