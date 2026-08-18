(()=>{
const rows=[
 {term:'十二年國教課綱／核心素養',year:115,level:'教育專業',exam:'115 中區國中教育專業科',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm'},
 {term:'教育法規與制度',year:115,level:'教育專業',exam:'115 新北市國中教育專業科',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm'},
 {term:'課程與教學',year:115,level:'教育專業',exam:'115 桃園市國中教育專業科',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm'},
 {term:'教育心理學',year:115,level:'教育專業',exam:'115 臺北市國中教育專業',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm'},
 {term:'輔導與管教',year:115,level:'教育專業',exam:'115 高雄市國中教育專業科目',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm'},
 {term:'教育測驗與評量',year:115,level:'教育專業',exam:'115 臺南市國中教育專業',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm'},
 {term:'班級經營',year:114,level:'教育專業',exam:'114 高雄市國中教育專業科目',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm'},
 {term:'教育法規與制度',year:114,level:'教育專業',exam:'114 新北市國中教育專業科',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm'},
 {term:'課程與教學',year:114,level:'教育專業',exam:'114 桃園市國中教育專業',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm'},
 {term:'教育心理學',year:114,level:'教育專業',exam:'114 臺北市國中教育專業',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm'},
 {term:'十二年國教課綱／核心素養',year:113,level:'教育專業',exam:'113 中區國中教育專業科目',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm?page=2'},
 {term:'教育測驗與評量',year:113,level:'教育專業',exam:'113 新北市國中教育專業科',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm?page=2'},
 {term:'班級經營',year:113,level:'教育專業',exam:'113 桃園市國中教育專業科',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm?page=2'},
 {term:'課程與教學',year:112,level:'教育專業',exam:'112 中區國中教育專業科目',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm?page=3'},
 {term:'教育法規與制度',year:112,level:'教育專業',exam:'112 新北市國中教育專業科',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm?page=3'},
 {term:'輔導與管教',year:112,level:'教育專業',exam:'112 桃園市國中教育專業',url:'https://yamol.tw/cat-%E6%95%99%E7%94%84%E2%97%86%E6%95%99%E8%82%B2%E5%B0%88%E6%A5%AD%E7%A7%91%E7%9B%AE%E4%B8%AD%E7%AD%89-4168.htm?page=3'}
];
window.PRECISE_EXAM_TERMS=window.PRECISE_EXAM_TERMS||[];window.PRECISE_EXAM_TERMS.push(...rows);
})();