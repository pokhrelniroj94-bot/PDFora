import type { KundaliResult } from "./kundali-calculator";

export const ASHTAKOOTA_SOURCE = "Muhurta Chintamani, Vivaha-prakarana (verses 21–37), Piyushadhara commentary and Kedar Datt Joshi Hindi tika; cross-checked with Nemichandra Shastri, Bharatiya Jyotish (1970), chapter 5, and B. V. Raman, Muhurtha (1948).";
export const ASHTAKOOTA_SOURCE_URL = "https://thetelugucalendar.com/marriage-matching/method/";

const SIGNS = ["मेष","वृष","मिथुन","कर्कट","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुम्भ","मीन"];
const SIGN_EN = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const NAKSHATRAS = ["अश्विनी","भरणी","कृत्तिका","रोहिणी","मृगशिरा","आर्द्रा","पुनर्वसु","पुष्य","आश्लेषा","मघा","पूर्वाफाल्गुनी","उत्तराफाल्गुनी","हस्त","चित्रा","स्वाती","विशाखा","अनुराधा","ज्येष्ठा","मूल","पूर्वाषाढा","उत्तराषाढा","श्रवण","धनिष्ठा","शतभिषा","पूर्वाभाद्रपदा","उत्तराभाद्रपदा","रेवती"];

const VARNA = ["Kshatriya","Vaishya","Shudra","Brahmin","Kshatriya","Vaishya","Shudra","Brahmin","Kshatriya","Vaishya","Shudra","Brahmin"];
const VASHYA = ["Chatushpada","Chatushpada","Dvipada","Jalachara","Chatushpada","Dvipada","Dvipada","Keeta","Chatushpada","Jalachara","Jalachara","Jalachara"];
const SIGN_LORD = ["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"];
const VASHYA_ORDER = ["Dvipada","Chatushpada","Jalachara","Keeta"];
const VASHYA_TABLE = [
  [2,.5,.5,1],
  [.5,2,2,2],
  [.5,2,2,2],
  [1,2,2,2],
];

const GRAHA_ORDER = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn"];
const GRAHA_TABLE = [
  [5,5,5,4,5,0,0],
  [5,5,4,1,4,.5,.5],
  [5,4,5,.5,5,3,.5],
  [4,1,.5,5,.5,5,4],
  [5,4,5,.5,5,.5,3],
  [0,.5,3,5,.5,5,5],
  [0,.5,.5,4,3,5,5],
];
const GANA = ["Deva","Manushya","Rakshasa","Manushya","Deva","Manushya","Deva","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva","Rakshasa","Deva","Rakshasa","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva","Rakshasa","Rakshasa","Manushya","Manushya","Deva"];
const GANA_ORDER = ["Deva","Manushya","Rakshasa"];
const GANA_TABLE = [[6,5,1],[6,6,0],[0,0,6]];
const NADI = ["Adi","Madhya","Antya","Antya","Madhya","Adi","Adi","Madhya","Antya","Antya","Madhya","Adi","Adi","Madhya","Antya","Antya","Madhya","Adi","Adi","Madhya","Antya","Antya","Madhya","Adi","Adi","Madhya","Antya"];
const YONI = ["Horse","Elephant","Sheep","Serpent","Serpent","Dog","Cat","Sheep","Cat","Rat","Rat","Cow","Buffalo","Tiger","Buffalo","Tiger","Deer","Deer","Dog","Monkey","Mongoose","Monkey","Lion","Horse","Lion","Cow","Elephant"];
const YONI_ORDER = ["Horse","Elephant","Sheep","Serpent","Dog","Cat","Rat","Cow","Buffalo","Tiger","Deer","Monkey","Mongoose","Lion"];
// Rows are bride yoni; columns are groom yoni. This is the corrected Muhurta Chintamani chart.
const YONI_TABLE = [
 [4,2,3,2,2,3,3,3,0,1,3,2,2,1],
 [2,4,3,2,2,3,3,3,3,2,2,2,2,0],
 [3,3,4,3,2,3,1,3,3,1,3,0,3,1],
 [2,2,3,4,2,2,1,1,2,2,2,2,0,2],
 [2,2,2,2,4,1,1,2,2,1,0,2,2,1],
 [2,2,3,2,1,4,0,2,2,1,2,2,2,2],
 [2,2,2,1,1,0,4,2,2,2,2,2,2,1],
 [3,2,3,1,2,2,2,4,3,0,3,2,3,1],
 [0,3,3,2,2,2,2,3,4,1,2,2,2,3],
 [1,2,1,2,1,1,2,0,1,4,2,1,2,2],
 [3,2,3,2,0,2,2,3,2,1,4,2,2,2],
 [2,3,0,2,2,2,2,2,2,1,2,4,2,3],
 [2,2,3,0,2,2,2,3,2,2,2,2,4,2],
 [1,0,1,2,1,2,1,1,3,2,2,2,2,4],
];

export const ASHTAKOOTA_REFERENCE_TABLES = {
 vashya: { labels: VASHYA_ORDER, values: VASHYA_TABLE },
 grahaMaitri: { labels: GRAHA_ORDER, values: GRAHA_TABLE },
 gana: { labels: GANA_ORDER, values: GANA_TABLE },
 yoni: { labels: YONI_ORDER, values: YONI_TABLE },
 rashis: SIGNS.map((name,index)=>({name,varna:VARNA[index],vashya:VASHYA[index],lord:SIGN_LORD[index]})),
 nakshatras: NAKSHATRAS.map((name,index)=>({name,gana:GANA[index],nadi:NADI[index],yoni:YONI[index]})),
};
const FRIENDS: Record<string,string[]> = {
 Sun:["Moon","Mars","Jupiter"], Moon:["Sun","Mercury"], Mars:["Sun","Moon","Jupiter"],
 Mercury:["Sun","Venus"], Jupiter:["Sun","Moon","Mars"], Venus:["Mercury","Saturn"], Saturn:["Mercury","Venus"],
};
const ENEMIES: Record<string,string[]> = {
 Sun:["Venus","Saturn"], Moon:[], Mars:["Mercury"], Mercury:["Moon"], Jupiter:["Mercury","Venus"],
 Venus:["Sun","Moon"], Saturn:["Sun","Moon","Mars"],
};
function naturalRelation(a:string,b:string):"same"|"friend"|"neutral"|"enemy" {
 if(a===b) return "same";
 if(FRIENDS[a]?.includes(b) && FRIENDS[b]?.includes(a)) return "friend";
 if(ENEMIES[a]?.includes(b) && ENEMIES[b]?.includes(a)) return "enemy";
 return "neutral";
}
function lookup(table:number[][], rowOrder:string[], row:string, colOrder:string[], col:string):number {
 const ri=rowOrder.indexOf(row), ci=colOrder.indexOf(col);
 if(ri<0||ci<0) throw new Error("Unsupported traditional matching category.");
 return table[ri][ci];
}
function taraValue(brideIndex:number,groomIndex:number):number {
 const count=(from:number,to:number)=>((to-from+27)%27)+1;
 const tara=(n:number)=>n%9===0?9:n%9;
 const a=tara(count(brideIndex,groomIndex)), b=tara(count(groomIndex,brideIndex));
 const good=(n:number)=>![3,5,7].includes(n);
 return good(a)&&good(b)?3:good(a)||good(b)?1.5:0;
}
function rashiIndex(name:string):number {
 const index=SIGNS.indexOf(name);
 if(index>=0) return index;
 return SIGN_EN.indexOf(name);
}
export interface GunaPersonInput {
 name: string;
 dateSystem: "AD"|"BS";
 birthDate: string;
 birthTime: string;
 placeId: string;
 placeName?: string;
 latitude?: number;
 longitude?: number;
 timeZone?: string;
}
export interface GunaKootaScore { key:string; ne:string; hi:string; en:string; score:number; max:number; brideValue:string; groomValue:string; note:string; }
export interface GunaMilanResult {
 bride: KundaliResult;
 groom: KundaliResult;
 scores: GunaKootaScore[];
 total:number;
 exceptions:string[];
 method:string;
}

export function calculateAshtakoota(bride:KundaliResult,groom:KundaliResult):GunaMilanResult {
 const bi=NAKSHATRAS.indexOf(bride.janmaNakshatra), gi=NAKSHATRAS.indexOf(groom.janmaNakshatra);
 const br=rashiIndex(bride.moonSign), gr=rashiIndex(groom.moonSign);
 if(bi<0||gi<0||br<0||gr<0) throw new Error("Could not resolve Moon sign or birth nakshatra for traditional matching.");
 const vOrder=["Brahmin","Kshatriya","Vaishya","Shudra"];
 const vScore=vOrder.indexOf(VARNA[gr])<=vOrder.indexOf(VARNA[br])?1:0;
 const vashyaScore=lookup(VASHYA_TABLE,VASHYA_ORDER,VASHYA[br],VASHYA_ORDER,VASHYA[gr]);
 const taraScore=taraValue(bi,gi);
 const yoniScore=lookup(YONI_TABLE,YONI_ORDER,YONI[bi],YONI_ORDER,YONI[gi]);
 const grahaScore=lookup(GRAHA_TABLE,GRAHA_ORDER,SIGN_LORD[br],GRAHA_ORDER,SIGN_LORD[gr]);
 const ganaScore=lookup(GANA_TABLE,GANA_ORDER,GANA[bi],GANA_ORDER,GANA[gi]);
 const distance=(gr-br+12)%12;
 const bhakootDosha=[1,11,4,8,5,7].includes(distance);
 const sameRashiLord=SIGN_LORD[br]===SIGN_LORD[gr];
 const mutualFriends=naturalRelation(SIGN_LORD[br],SIGN_LORD[gr])==="friend";
 const bhakootCancelled=bhakootDosha&&(sameRashiLord||mutualFriends)&&(!nadiDosha||nadiCancelled);
 const bhakootScore=bhakootDosha?0:7;
 const nadiDosha=NADI[bi]===NADI[gi];
 const sameRashiDifferentNakshatra=br===gr&&bi!==gi;
 const sameNakshatraDifferentRashi=bi===gi&&br!==gr;
 const nadiCancelled=nadiDosha&&(sameRashiDifferentNakshatra||sameNakshatraDifferentRashi);
 const brideMoonNavamsa=bride.planets.find((planet)=>planet.key==="Moon")?.navamsaSign ?? "";
 const groomMoonNavamsa=groom.planets.find((planet)=>planet.key==="Moon")?.navamsaSign ?? "";
 const brideNavamsaIndex=rashiIndex(brideMoonNavamsa), groomNavamsaIndex=rashiIndex(groomMoonNavamsa);
 const rashiNakshatraParihara=sameRashiDifferentNakshatra||sameNakshatraDifferentRashi;
 const ganaCancelled=rashiNakshatraParihara || (naturalRelation(SIGN_LORD[br],SIGN_LORD[gr])==="friend" && brideNavamsaIndex>=0 && groomNavamsaIndex>=0 && naturalRelation(SIGN_LORD[brideNavamsaIndex],SIGN_LORD[groomNavamsaIndex])==="friend");
 const nadiScore=nadiDosha?0:8;
 const scores:GunaKootaScore[]=[
  {key:"varna",ne:"वर्ण",hi:"वर्ण",en:"Varna",score:vScore,max:1,brideValue:VARNA[br],groomValue:VARNA[gr],note:"Moon-sign varna; groom's class equal to or higher than bride's receives 1."},
  {key:"vashya",ne:"वश्य",hi:"वश्य",en:"Vashya",score:vashyaScore,max:2,brideValue:VASHYA[br],groomValue:VASHYA[gr],note:"Muhurta Chintamani four-class Vashya matrix."},
  {key:"tara",ne:"तारा",hi:"तारा",en:"Tara",score:taraScore,max:3,brideValue:String(((((gi-bi+27)%27)+1-1)%9)+1),groomValue:String(((((bi-gi+27)%27)+1-1)%9)+1),note:"Count both directions; Vipat (3), Pratyak (5) and Naidhana (7) are unfavourable."},
  {key:"yoni",ne:"योनि",hi:"योनि",en:"Yoni",score:yoniScore,max:4,brideValue:YONI[bi],groomValue:YONI[gi],note:"Corrected Muhurta Chintamani 14×14 matrix; table variants exist in other editions."},
  {key:"grahaMaitri",ne:"ग्रह मैत्री",hi:"ग्रह मैत्री",en:"Graha Maitri",score:grahaScore,max:5,brideValue:SIGN_LORD[br],groomValue:SIGN_LORD[gr],note:"Natural friendship of the two Moon-sign lords."},
  {key:"gana",ne:"गण",hi:"गण",en:"Gana",score:ganaScore,max:6,brideValue:GANA[bi],groomValue:GANA[gi],note:"Bride row / groom column; do not transpose this directional table."},
  {key:"bhakoot",ne:"भकूट",hi:"भकूट",en:"Bhakoot",score:bhakootScore,max:7,brideValue:SIGN_EN[br],groomValue:SIGN_EN[gr],note:bhakootDosha?"2/12, 5/9 or 6/8 sign relationship. Cancellation is reported separately.":"No 2/12, 5/9 or 6/8 relationship."},
  {key:"nadi",ne:"नाडी",hi:"नाड़ी",en:"Nadi",score:nadiScore,max:8,brideValue:NADI[bi],groomValue:NADI[gi],note:nadiDosha?"Same Nadi; cancellation is reported separately.":"Different Nadis."},
 ];
 const exceptions:string[]=[];
 if(bhakootCancelled) exceptions.push("Bhakoot parihara: Moon-sign lords are the same or mutual friends. The raw score remains 0; the traditional exception is displayed separately.");
 if(rashiNakshatraParihara) exceptions.push("Rashi/Nakshatra parihara: same Rashi with different Nakshatras, or same Nakshatra in different Rashis; the tradition cancels both Nadi and Gana dosha. Raw koota scores remain unchanged.");
 else if(ganaCancelled) exceptions.push("Gana parihara: Rashi lords and Navamsa lords are mutual friends. The raw score remains unchanged; the traditional exception is displayed separately.");
 if(nadiCancelled&&!rashiNakshatraParihara) exceptions.push("Nadi parihara: same Rashi with different Nakshatras, or same Nakshatra in different Rashis. The raw score remains 0; the traditional exception is displayed separately.");
 if(br===gr&&bi===gi&&bride.janmaPada!==groom.janmaPada) exceptions.push("Same Rashi and Nakshatra but different padas: the cited source describes this as an auspicious exception.");
 if(br===gr&&bi===gi&&bride.janmaPada===groom.janmaPada) exceptions.push("Same Rashi, Nakshatra and pada: the cited source does not describe this as the different-pada exception.");
 const total=Number(scores.reduce((sum,item)=>sum+item.score,0).toFixed(2));
 if(total>36||scores.some(s=>s.score<0||s.score>s.max)) throw new Error("Internal Ashtakoota score validation failed.");
 return {bride,groom,scores,total,exceptions,method:"Ashtakoota / 36 Guna · Muhurta Chintamani table convention · Lahiri-approximation Moon sign and nakshatra from PDFora Janma Kundali engine"};
}
