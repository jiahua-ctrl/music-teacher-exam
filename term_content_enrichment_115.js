// 115 功能凍結後｜核心名詞內容補強（不新增介面）
// 目的：把早期一句式 definition 補成可直接用於教甄名詞解釋、5W2H 與配分版作答的材料。
(function(){
  if(window.__TERM_CONTENT_ENRICHMENT115__) return;
  window.__TERM_CONTENT_ENRICHMENT115__=true;
  const data={
    'Prepared Piano':{
      definition:'Prepared Piano（預置鋼琴）是將螺絲、橡膠、金屬、木片等物件置於鋼琴弦之間或弦上，改變原本的音高、音色、共鳴與起音特性的作曲／演奏技法。20世紀美國作曲家 John Cage 於1940年代系統化發展此技法，使一台鋼琴能產生近似打擊樂團的多樣聲響。代表作品為《Sonatas and Interludes》（1946–48）。',
      exam:'115 教育部高中聯招名詞解釋。考場至少寫：John Cage、1940年代、在琴弦間放置物件改變音色、代表作《Sonatas and Interludes》。不要只寫「在鋼琴裡放東西」。',
      related:'John Cage；1940年代；Sonatas and Interludes；timbre；percussion-like sound'
    },
    'Cori Spezzati':{
      definition:'Cori Spezzati（分置合唱）是文藝復興晚期威尼斯樂派的重要複合合唱技法，將兩組或多組合唱團分置於教堂不同位置，利用空間距離形成交替、呼應、對答與全體合唱的立體聲響。16世紀威尼斯聖馬可大教堂的建築空間特別促成此種寫作，代表人物包括 Andrea Gabrieli 與 Giovanni Gabrieli。',
      exam:'115 教育部高中聯招。高鑑別點：16世紀威尼斯、聖馬可大教堂、分置多組合唱團、空間對答；可連結 polychoral style 與 Gabrieli。',
      related:'Venetian School；St. Mark’s Basilica；Andrea Gabrieli；Giovanni Gabrieli；polychoral style'
    },
    'Hexachord':{
      definition:'Hexachord 在中世紀音樂理論中指由六個音構成的 solmization 系統，以 ut–re–mi–fa–sol–la 六個唱名協助視唱與音程辨識。此系統與11世紀 Guido of Arezzo 的教學傳統密切相關，常分為 natural、hard、soft 三種六音列，並以 mutation 在不同 hexachord 間轉換。',
      exam:'115 教育部高中聯招、彰化高中。作答不要只寫「六個音」，要寫 Guido、ut re mi fa sol la、natural／hard／soft、mutation 或中世紀視唱功能。',
      related:'Guido of Arezzo；11世紀；solmization；natural hexachord；hard hexachord；soft hexachord；mutation'
    },
    'Polytonality':{
      definition:'Polytonality（多調性）是20世紀常見的和聲概念，指同一時間並置兩個或以上仍可辨識的調性中心；若明確為兩個調性中心，常稱 bitonality。重點在「多個調性同時存在」，因此不同於 atonality 的無中心傾向，也不同於 polychord 單純強調和弦垂直疊置。',
      exam:'115 教育部高中聯招。最重要的辨析：polytonality 看「調性中心」；polychord 看「和弦疊置」；atonality 則不建立傳統調性中心。',
      related:'20世紀和聲；bitonality；tonal center；atonality；polychord；Stravinsky；Milhaud'
    },
    'Mystic Chord':{
      definition:'Mystic Chord（神祕和弦）是與俄國作曲家 Alexander Scriabin 晚期作品密切相關的六音和弦集合，常以四度、增四度與減四度等音程疊置描述。它不只是傳統功能和聲中的單一和弦，而常作為音高材料與聲響色彩的核心來源。代表作品可連結《Prometheus: The Poem of Fire》。',
      exam:'115 教育部高中聯招。關鍵字：Scriabin、六音集合、四度型結構、非傳統功能和聲、《Prometheus》。',
      related:'Alexander Scriabin；Prometheus: The Poem of Fire；六音集合；quartal sonority；20世紀和聲'
    },
    'Spectrogram':{
      definition:'Spectrogram（聲譜圖）是把聲音隨時間變化的頻譜能量視覺化的圖像，通常橫軸表示時間、縱軸表示頻率，顏色或明暗表示能量／強度。它可用於觀察基頻、泛音、音色、噪音與共鳴峰等聲學資訊，也可在音樂科技課中協助學生把「聽見的音色」與可視化聲學證據連結。',
      exam:'115 中山女高。若問教學運用，可讓學生比較不同樂器或人聲的泛音分布、分析母音／音色、觀察錄音與環境聲。',
      related:'time；frequency；intensity；harmonics；timbre；acoustics；music technology'
    },
    'Kora':{
      definition:'Kora（科拉琴）是西非曼丁文化圈的重要多弦撥弦樂器，常具有21條弦，結構結合大型葫蘆共鳴箱、長頸與橋，常被分類為 bridge harp 或 harp-lute。它與 Mande 社會中的 jeli／griot 專業音樂家傳統密切相關，常用於歷史敘事、讚頌、家族記憶與社會儀式。',
      exam:'115 中山女高。答題至少寫：西非／Mande、21弦（常見）、jeli 或 griot、撥弦、敘事與社會記憶功能。',
      related:'West Africa；Mande；21 strings；jeli；griot；oral tradition；harp-lute'
    },
    'Pansori':{
      definition:'Pansori（盤索里）是韓國傳統長篇敘事聲樂，由一名歌者 sorikkun 與一名鼓手 gosu 為核心。歌者以唱腔、說白與身體動作敘事，鼓手以鼓點及口頭應和 chuimsae 支持演出。其特色包含強烈敘事性、長時間演唱、聲音技巧與觀眾互動，2003年列入 UNESCO 人類口述與非物質遺產代表作相關體系。',
      exam:'115 教育部高中聯招。核心編制一定要寫「一位歌者＋一位鼓手」；可再補 sorikkun、gosu、chuimsae、韓國敘事聲樂。',
      related:'Korea；sorikkun；gosu；chuimsae；narrative singing；UNESCO'
    },
    'Fado':{
      definition:'Fado（法朵）是19世紀形成於葡萄牙都市文化、特別與里斯本密切相關的歌唱傳統，以命運、離別、思念與 saudade 情感意涵著稱。典型演出由歌者搭配 Portuguese guitar（葡萄牙吉他）與古典吉他等伴奏。20世紀代表歌手包括 Amália Rodrigues。',
      exam:'115 教育部高中聯招。高頻得分點：葡萄牙／里斯本、saudade、Portuguese guitar、Amália Rodrigues。',
      related:'Portugal；Lisbon；19世紀；saudade；Portuguese guitar；Amália Rodrigues'
    },
    'Aleatory Music':{
      definition:'Aleatory Music（機遇音樂／偶然音樂）是20世紀音樂中把作品某些決策交由偶然程序、演奏者選擇或非固定排列的創作觀念，使作品每次實現可能不同。John Cage 常以 chance operations 代表「偶然程序」；歐洲作曲家也常討論 controlled aleatory 或 indeterminacy。',
      exam:'常見教甄考點。不要把 chance music、aleatory、indeterminacy 當完全同義；答題可先寫共同核心「部分結果不由作曲家事先完全固定」，再舉 Cage。',
      related:'20世紀；John Cage；chance operations；indeterminacy；controlled aleatory；open form'
    },
    'Hemiola':{
      definition:'Hemiola（赫米奧拉）是二拍與三拍的重音分組關係暫時互換或重解釋的節奏／節拍現象，典型可理解為「兩組三拍」被重新感知為「三組二拍」，形成3:2的重音張力。常見於文藝復興、巴洛克與後來的舞曲或終止段落。',
      exam:'115 彰化高中。作答必寫 3:2 與「重音重新分組」，不要只寫成三連音。',
      related:'3:2；metric regrouping；Renaissance；Baroque；cadential hemiola'
    },
    'Alberti Bass':{
      definition:'Alberti Bass（阿爾貝蒂低音）是18世紀古典時期常見的鍵盤伴奏音型，把和弦音持續分解反覆，典型次序為低－高－中－高。此音型能維持和聲支撐與律動，同時避免厚重柱式和弦遮蔽右手旋律，常見於 Mozart、Haydn、早期 Beethoven 的鍵盤作品。',
      exam:'高頻樂理／音樂史名詞。寫出「分解和弦」「低－高－中－高」「古典時期鍵盤伴奏」即可快速得分。',
      related:'18世紀；Classical period；broken chord；low-high-middle-high；Mozart；Haydn'
    },
    'Passion':{
      definition:'Passion（受難曲）是以《新約聖經》中耶穌受難與死亡敘事為核心的大型宗教聲樂體裁，在巴洛克時期尤其重要。常由 Evangelist（福音史家）以宣敘調敘事，搭配角色、詠嘆調、合唱與聖詠，形成敘事、反思與群眾場景。J. S. Bach《St. Matthew Passion》與《St. John Passion》為代表。',
      exam:'115 教育部高中聯招。核心：耶穌受難敘事、巴洛克、Evangelist／recitative、aria／chorale／chorus、Bach 代表作。',
      related:'Baroque；J. S. Bach；St. Matthew Passion；St. John Passion；Evangelist；recitative；chorale'
    },
    'Heterophony':{
      definition:'Heterophony（異音織體／支聲複音）是多個聲部同時以同一基本旋律為核心，但各自加入不同裝飾、節奏、音高細節或演奏變化所形成的織體。它不同於 homophony 的主旋律加和聲伴奏，也不同於 polyphony 的多條相對獨立旋律。世界音樂與傳統合奏中常見。',
      exam:'115 彰化高中。辨析題最常考：heterophony＝同一旋律的不同版本「同時」出現。',
      related:'texture；same melody；simultaneous variants；homophony；polyphony；world music'
    },
    'Gebrauchsmusik':{
      definition:'Gebrauchsmusik（實用音樂／功能音樂）是20世紀1920年代德語地區的重要音樂思潮，強調音樂應與社會、教育、業餘演奏、社區或實際功能重新連結，而不只服務於高度專業化的藝術音樂場域。Paul Hindemith 是最常被連結的代表人物之一。',
      exam:'115 彰化高中。關鍵：1920年代德國／威瑪時期、社會與教育功能、Hindemith。不要只翻譯成「有用途的音樂」。',
      related:'1920年代；Weimar Germany；Paul Hindemith；music education；amateur music-making；social function'
    },
    'Wozzeck':{
      definition:'《Wozzeck》（《伍采克》）是奧地利作曲家 Alban Berg 創作的三幕歌劇，1914年至1922年間完成，1925年於柏林首演，劇本改編自 Georg Büchner 的《Woyzeck》。作品常被視為表現主義歌劇代表，廣泛使用無調性語彙，但各場景又以 passacaglia、invention、suite 等嚴謹傳統形式組織。',
      exam:'115 彰化高中。高鑑別點：Alban Berg、Expressionism、atonality、Büchner、1925 Berlin premiere、以傳統曲式組織無調性材料。',
      related:'Alban Berg；Expressionism；Georg Büchner；1925 Berlin；atonality；passacaglia；invention'
    },
    'Eurhythmics':{
      definition:'Eurhythmics（達克羅士律動）是瑞士音樂教育家 Émile Jaques-Dalcroze 於19世紀末至20世紀初發展的音樂教育方法，以身體動作直接體驗節奏、拍感、速度、力度、樂句與音樂結構。Dalcroze 教學常與 solfège、improvisation 並列，核心是先透過身體感知再轉化為音樂理解與表現。',
      exam:'115 新北高中。至少寫 Dalcroze＋身體律動＋音樂感知；若問教學，可設計走拍、停走、重音位置與即興反應活動。',
      related:'Émile Jaques-Dalcroze；20世紀初；movement；rhythm；solfège；improvisation；embodied learning'
    },
    'Takarazuka Revue':{
      definition:'Takarazuka Revue（寶塚歌劇團）是1913年於日本兵庫縣寶塚創立的全女性歌舞劇團，以華麗舞台、音樂劇、舞蹈與大型群舞著稱。女性演員分為主要扮演男性角色的 otokoyaku 與主要扮演女性角色的 musumeyaku，形成獨特的性別角色表演傳統。',
      exam:'115 中山女高。關鍵：日本、1913、全女性、otokoyaku／musumeyaku、音樂劇與歌舞劇。',
      related:'Japan；1913；all-female troupe；otokoyaku；musumeyaku；musical theatre'
    },
    'Triple Threat':{
      definition:'Triple Threat 是音樂劇與商業劇場常用語，指表演者同時具備歌唱（singing）、舞蹈（dancing）與戲劇表演（acting）三項核心能力。其重點不是三種能力各自存在，而是能在角色塑造與舞台敘事中整合運用。',
      exam:'115 中山女高。極短名詞題直接寫 singing＋dancing＋acting；若要完整，可補「音樂劇表演者的整合性舞台能力」。',
      related:'musical theatre；singing；dancing；acting；integrated performance'
    },
    'Sprechstimme':{
      definition:'Sprechstimme（說唱式／語音式歌唱）是介於說話與歌唱之間的20世紀聲樂技法。演唱者依記譜音高起音後迅速離開該音高，保留語音輪廓與節奏，而非像一般歌唱持續固定音高。Arnold Schoenberg 在《Pierrot lunaire》（1912）中有代表性運用。',
      exam:'高頻20世紀名詞。要與一般 recitative／speech 區分；關鍵是「先觸及記譜音高，再迅速離開」，代表 Schoenberg《Pierrot lunaire》。',
      related:'Arnold Schoenberg；1912；Pierrot lunaire；speech-song；Expressionism；20世紀聲樂'
    }
  };
  function apply(){
    const sets=[window.TERM_PROMPTS,window.EXTRA_TERMS].filter(Array.isArray);
    sets.forEach(arr=>arr.forEach(t=>{
      const key=t.term||t.name;
      const x=data[key];
      if(!x)return;
      if('definition' in t){t.definition=x.definition;t.exam=x.exam;t.related=x.related;}
      else if('answer' in t){t.answer='【完整學習版】'+x.definition+'\n\n【考場鑑別】'+x.exam+'\n\n【關鍵字】'+x.related;}
    }));
  }
  apply();
  window.addEventListener('load',apply,{once:true});
  window.TermContentEnrichment115={apply,data};
})();