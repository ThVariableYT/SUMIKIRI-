// ============================================================================
// SUMIKIRI — STORY 2: THE VERMILION ROAD 「朱路」
// update 2.0 · the second campaign
//
// Where the first story was black ink and a ronin's blade, this one is
// vermilion seal-paste and a brush. A different hand walks a different road:
// AKANE 茜, the brush-dancer — faster, lighter, hungry for momentum, her ki
// spent on tides of red ink instead of a spinning cut.
//
// This file is pure content + behavior, loaded BEFORE the engine script.
// Everything it needs from the engine is resolved lazily (at call time),
// and it is stitched into the base game through the small integration
// hooks the base file keeps for exactly this purpose.
//
// The whole story is gated behind story-2 act numbers 11..16, so the base
// game's seven acts are untouched.
// ============================================================================

window.STORY2=(function(){
'use strict';
const S={};

// ---- the story itself -------------------------------------------------------

S.meta={
  name:'THE VERMILION ROAD',kan:'朱',romaji:'SHURO',
  nActs:6,unlockField:'unlockedAct2',
  hero:{name:'AKANE',kan:'茜',title:'the brush-dancer',art:'紅潮 CRIMSON TIDE',passive:'朱勢 VERMILION MOMENTUM'}};

// ---- her weapon: the great brush 筆 ------------------------------------------

S.weapons={
  fude:{name:"Akane's Brush",kanji:'筆',
    desc:'A calligraphy brush the size of a spear. Wide vermilion sweeps — and the finisher flings its ink.',
    dmg:[9,11,16],rate:.21,range:98,arc:2.3,knock:130,cost:0}};

// ---- the new cast: eight foes, eight mechanics the first road never taught --

S.enemy={
  kitsune:{name:'Kitsune Whelp',k:'狐',hp:24,spd:152,r:14,dmg:9,ash:4,atk:'foxtackle',rng:200,wind:.42,rec:.55,chain:1,peril:.3,s2:1,evade:1},
  wisp:{name:'Hitodama Wisp',k:'灯',hp:26,spd:86,r:14,dmg:10,ash:6,atk:'spray',rng:310,wind:.7,rec:1.15,keep:230,s2:1},
  doro:{name:'Doro Golem',k:'泥',hp:125,spd:44,r:23,dmg:16,ash:12,atk:'slamwave',rng:112,wind:.8,rec:1.0,aoe:132,chain:2,s2:1,split:1},
  doroko:{name:'Doro Spawn',k:'泥',hp:30,spd:126,r:12,dmg:8,ash:3,atk:'melee',rng:74,wind:.4,rec:.5,chain:1,s2:1},
  suzume:{name:'Suzume Skirmisher',k:'雀',hp:38,spd:104,r:14,dmg:9,ash:8,atk:'darts',rng:999,wind:.62,rec:1.3,keep:330,s2:1},
  nekomata:{name:'Nekomata Stalker',k:'猫',hp:46,spd:166,r:15,dmg:13,ash:10,atk:'ambush',rng:260,wind:.5,rec:.8,chain:1,peril:.5,s2:1},
  kagura:{name:'Kagura Dancer',k:'神',hp:78,spd:72,r:17,dmg:11,ash:13,atk:'orbit',rng:999,wind:1.0,rec:1.4,s2:1},
  shishi:{name:'Shishi Drum',k:'獅',hp:88,spd:60,r:21,dmg:15,ash:11,atk:'cross',rng:150,wind:.85,rec:1.1,chain:2,s2:1}};

// ---- the six keepers of the vermilion road -----------------------------------

S.bosses={
  kodama:{name:'Kodama-hime, Root of the Hollow',kanji:'木',hp:560,r:34,spd:78,touch:8,s2:1,
    moves:['grasp','seedCone','bloomRings','summon'],summon:'kitsune'},
  akari:{name:'Akari, Warden of the Lantern River',kanji:'灯',hp:840,r:30,spd:88,touch:8,s2:1,
    moves:['orbitals','lanternRain','blinkVolley','pullWave']},
  kurogane:{name:'Kurogane, the Iron Brush',kanji:'鉄',hp:430,r:27,spd:124,touch:7,duel:1,s2:1,
    moves:['crossfire','blinkStrike','homingVolley','mirrorDash']},
  ginro:{name:'Ginro of the Silver Grass',kanji:'狼',hp:1040,r:32,spd:104,touch:9,s2:1,
    moves:['dashWeb','howlPull','lunarBolts','chainDash']},
  hibana:{name:'Hibana, Saint of the Ashfall',kanji:'火',hp:1260,r:31,spd:96,touch:9,s2:1,
    moves:['emberRain','novaChain','homingVolley','orbitals'],summon:'wisp'},
  shisho:{name:'Shisho, the Seal-Master',kanji:'印',hp:1580,r:32,spd:100,touch:9,phased:true,s2:1,
    moves:['stampRain','sealSpiral','pullWave','crossfire'],moves2:['stampStorm','orbitals','mirrorDash','homingVolley'],summon:'kitsune'}};

// ---- the six acts of the vermilion road (act numbers 11..16) -----------------

S.acts=[
{name:'The Vermilion Fields',kanji:'朱',intro:['The fields have turned the color of seals.','A brush wakes in red ink.','The foxes have been watching.'],stages:[
 {n:'Red Dawn',w:['kitsune*4','kitsune*5']},
 {n:'Foxes in the Grass',w:['kitsune*3,wisp*2','suzume*2,kitsune*4']},
 {n:'The Whelping Den',w:['kitsune*4,doro*1','nekomata*2,kitsune*3','wisp*2,suzume*2,kitsune*2']},
 {n:'Old Roots, Older Hunger',w:['doro*2,kitsune*4','nekomata*2,doro*1,suzume*2','doro*2,nekomata*2,wisp*3']},
 {n:'The Root Below',boss:'kodama'}]},
{name:'The Lantern River',kanji:'灯',intro:['A river of floating shrines.','Every lantern a kept promise','— someone is still paying.'],stages:[
 {n:'Wishes on the Water',w:['wisp*3,kitsune*3','wisp*4,suzume*1']},
 {n:'The Weir of Names',w:['doro*1,wisp*3,nekomata*1','suzume*2,wisp*3,kitsune*2']},
 {n:'Silt and Seals',w:['kagura*1,doro*2','nekomata*2,wisp*4','shishi*1,suzume*2,kitsune*3']},
 {n:'What the River Kept',w:['doro*2,nekomata*2,wisp*3','shishi*1,kagura*1,suzume*2','doro*2,kagura*1,shishi*1']},
 {n:'The Warden of Lanterns',boss:'akari'}]},
{name:'The Hollow Court',kanji:'木',intro:['Green dark, older green.','The trees remember every name','they were ever called.'],stages:[
 {n:'A Path of Soft Paws',w:['nekomata*3,kitsune*4','kagura*1,kitsune*4']},
 {n:"The Dancer's Grove",w:['kagura*2,nekomata*2','shishi*1,kagura*1,wisp*2']},
 {n:'Paper Walls, Brushed Men',w:['suzume*2,doro*2,nekomata*2','kagura*2,shishi*1,kitsune*4']},
 {n:'The Iron Argument',duel:'kurogane'}]},
{name:'The Silver Grass Sea',kanji:'銀',intro:['Grass to the edge of the page.','The wind combs it silver.','Something hunts in the combing.'],stages:[
 {n:'First Silver, First Fear',w:['suzume*2,kitsune*5','nekomata*3,kitsune*3']},
 {n:'The Long Grass',w:['kagura*2,shishi*1','nekomata*2,suzume*2,wisp*2']},
 {n:'Where the Grass Parts',w:['shishi*2,doro*2,nekomata*2','kagura*2,suzume*2,shishi*1']},
 {n:'The Parting Itself',boss:'ginro'}]},
{name:'The Ashfall Court',kanji:'灰',intro:['Ash falls like slow snow.','Under it, an ember court','keeps its old warm grudges.'],stages:[
 {n:'Cinder Walk',w:['wisp*4,doro*2','shishi*2,suzume*2']},
 {n:'The Smoke That Dances',w:['kagura*2,wisp*3','shishi*2,kagura*1,nekomata*2']},
 {n:'Harvest of Sparks',w:['doro*3,shishi*2,suzume*2','kagura*2,shishi*2,nekomata*2']},
 {n:'What Refuses to Cool',boss:'hibana'}]},
{name:'The Sealed Blank',kanji:'印',intro:['Past the story the ink told,','a blank page and a red stamp —','the hand that says YES.'],stages:[
 {n:'Where Seals Are Born',w:['nekomata*3,suzume*3','shishi*2,kagura*2,doro*2']},
 {n:'The Unstamped Army',w:['kagura*2,shishi*2,nekomata*3','doro*3,suzume*3,wisp*3']},
 {n:'The Margin of the Red',w:['shishi*3,kagura*2,nekomata*2','doro*3,kagura*2,suzume*3,shishi*1']},
 {n:'The Second Hand',boss:'shisho'}]}];

// ---- the codex: first-sight cards for the whole second road ------------------

S.codex={
  kitsune:{no:'22',cls:'WHELP · EVADER',st:[5,2,1],
    d:'A young fox that sold its patience for speed. It reads your swing before you finish it — and is simply elsewhere.',
    a:[['Fox Tackle','a quick lunge out of the grass — deflectable, if the nerve holds','d'],
      ['Sidestep','it slips aside the moment you commit to a cut — feint, or catch it recovering',''],
      ['Peril Pounce','the red pounce — never block it, dash through','p']]},
  wisp:{no:'23',cls:'FLAME · SPRAYER',st:[3,3,2],
    d:'A keeper of unhung lanterns — a cold flame with opinions. It floats just out of reach and argues in embers.',
    a:[['Ember Spray','a cone of slow fire — thread between the sparks',''],
      ['Peril Flare','the red cone will not be argued with — dash out of it','p']]},
  doro:{no:'24',cls:'GOLEM · SPLITTER',st:[1,4,5],
    d:'River mud pressed into a grudge. Break it and the grudge simply halves — the whole fight was hiding two smaller ones.',
    a:[['Mud Slam','a slow ring where the fist lands — leave the circle','d'],
      ['Amalgam Split','on death it divides into two spawns — plan your footwork for the twins','']]},
  doroko:{no:'25',cls:'SPAWN · SWARM',st:[4,1,1],
    d:'Half a grudge, still moving. It dies like everything dies — it just arrives twice.',
    a:[['Mud Nip','a small honest bite — turn it with the blade','d']]},
  suzume:{name:'Suzume',no:'26',cls:'SKIRMISHER · DARTS',st:[4,2,2],
    d:'A sparrow that learned needle-work. Its darts follow you like gossip — you cannot simply walk away from them.',
    a:[['Homing Darts','thrown darts that bend toward you — break the line of sight or cut them from the air','d'],
      ['Wing Step','flits back as you close — corner it or bring the long sweep','']]},
  nekomata:{no:'27',cls:'STALKER · AMBUSHER',st:[5,3,2],
    d:'A two-tailed cat that decided you were prey. It hunts almost-invisible — watch the grass part, not the cat.',
    a:[['Shadow Walk','fades to a shimmer while it circles — strike the ripple if you dare',''],
      ['Pounce','a telegraphed red leap from stealth — dash sideways, never backward','p']]},
  kagura:{no:'28',cls:'DANCER · ORBITALS',st:[3,3,3],
    d:'A shrine dancer that never stopped for the shrine to close. The blades orbit her like patience you do not have.',
    a:[['Orbit Blades','the ring around her cuts on contact — do not dance her dance, break the rhythm',''],
      ['Whirlflare','the blades flare outward in a circle — be outside it when they do','']]},
  shishi:{no:'29',cls:'GUARDIAN · CROSSFIRE',st:[2,4,4],
    d:'A guardian lion with a drum where its heart should be. Every beat lands as a cross of force — stand on no line.',
    a:[['Cross Beat','two crossed lines of force through your position — leave both lines',''],
      ['Drum Chain','the beat comes in twos, the second greedier','']]},
  kodama:{no:'30',cls:'ECHO · THE HOLLOW ROOT',st:[2,4,4],
    d:'Act one of the vermilion road. The hollow\'s oldest echo, wearing roots for a crown. The ground remembers her hands.',
    a:[['Root Grasp','hands erupt where you stood, in a chasing chain — keep ahead of the sequence','p'],
      ['Seed Cone','a spray of hard seeds — a deflect answers three','d'],
      ['Bloom Rings','three rings in slow succession — the second arrives where the first pushed you',''],
      ['Whelp Summons','foxes join the root — they die like all whelps','']]},
  akari:{no:'31',cls:'WARDEN · LANTERNS',st:[3,4,4],
    d:'Act two of the vermilion road. She kept every promise ever floated down the river, and lights them when cornered.',
    a:[['Lantern Orbit','blades of light circle her — the safe distance is not the safe distance',''],
      ['Lantern Rain','lit shrines fall across the field — the shadows are the gaps',''],
      ['Undertow Pull','the river drags you toward her while the wave builds — fight the current, or ride it','p'],
      ['Blink Volley','arrives firing — deflect the shards home','d']]},
  kurogane:{no:'32',cls:'DUELIST · IRON BRUSH',st:[4,4,4],
    d:'Act three of the vermilion road, a duel. Another brush-dancer — older, harder, wrong. Every trick you know, she bought first.',
    a:[['Crossfire','three ink-lines cross your position at once — only the seams are safe','p'],
      ['Blink Strike','arrives inside your guard — the gold flash is the only honest thing about her','d'],
      ['Seeking Shards','darts that follow your step — cut them or lose them','d'],
      ['Mirror Dash','a red dash through your position — dash with it, not against','p']]},
  ginro:{no:'33',cls:'ALPHA · SILVER GRASS',st:[5,4,5],
    d:'Act four of the vermilion road. The wolf the grass combs. He herds with lines of force and pulls with the howl.',
    a:[['Dash Web','a fan of red lines through the field — stand in a seam, not a line','p'],
      ['The Howl','dragged toward the jaws while the ring builds — momentum is yours, use it','p'],
      ['Lunar Bolts','pale bolts fall on your shadow, staggered wide',''],
      ['Chain Rush','red dashes in threes — the last one is the honest one','p']]},
  hibana:{no:'34',cls:'SAINT · ASHFALL',st:[3,5,5],
    d:'Act five of the vermilion road. She burned her court to keep it honest, and the ash still answers her warmth.',
    a:[['Ember Rain','sparks fall in a drifting field — the cool gaps move; move with them',''],
      ['Nova Chain','three expanding rings, each wider — the third is aimed where the first pushed you',''],
      ['Seeking Sparks','embers that bend toward you — outrun the bend','d'],
      ['Saint\'s Orbit','a ring of burning blades — her embrace is wider than it looks','']]},
  shisho:{no:'35',cls:'THE SEAL 印',st:[4,5,5],
    d:'The end of the vermilion road. The hand that stamps YES on every road ever walked — yours was stamped red long before you arrived. Past half: the second stamp.',
    a:[['Stamp Fall','seals slam down in sequence, each where you fled the last','p'],
      ['Seal Spiral','a turning spray of vermilion darts — walk the gaps, do not run them',''],
      ['Undertow Pull','the blank page drags you toward the stamp','p'],
      ['Crossfire','three ink-lines at once — the seams are the only mercy','p'],
      ['The Second Stamp','past half: burning orbits, mirror dashes, seeking shards — the stamp stops asking','']]}};

S.bestiary={
  kitsune:'Fast, frail, evasive. Feint it out of its sidestep, or catch it recovering.',
  wisp:'Hovers and sprays embers. The cone is slow — walk between the sparks.',
  doro:'A mud wall that splits on death. The twins are faster; the original is not.',
  doroko:'Half a grudge. It dies in one honest cut.',
  suzume:'Darts that follow you. Cut them from the air or break the line of sight.',
  nekomata:'Hunts nearly invisible. Watch the grass ripple — strike the shimmer.',
  kagura:'Blades orbit the dancer. Break the rhythm or stay outside it.',
  shishi:'Crossed lines of force. Stand in a seam, never on a line.',
  kodama:'Vermilion act 1. Root grasps chase your steps; bloom rings come in threes.',
  akari:'Vermilion act 2. Lantern orbits and the river\'s pull — fight the current.',
  kurogane:'Vermilion act 3, a duel. Your own art, bought first by someone crueler.',
  ginro:'Vermilion act 4. Herded by red lines and dragged by the howl.',
  hibana:'Vermilion act 5. Ember rain and chained novas — the third ring aims at your escape.',
  shisho:'The end of the vermilion road. The stamp that says YES. Past half, it stops asking.'};

// ---- light for the six acts (GRADE entries 11..16) ---------------------------

S.grade={
  11:{tint:'rgba(196,90,52,0.10)',lx:.85,ly:.5,shadow:'rgba(70,30,18,0.24)',vig:.36,amb:'vermilion dawn'},
  12:{tint:'rgba(38,64,96,0.13)',lx:-.6,ly:.6,shadow:'rgba(16,28,46,0.3)',vig:.44,amb:'lantern night'},
  13:{tint:'rgba(44,96,58,0.10)',lx:.15,ly:.8,shadow:'rgba(16,44,26,0.28)',vig:.38,amb:'hollow green'},
  14:{tint:'rgba(210,206,180,0.11)',lx:-.2,ly:.75,shadow:'rgba(84,82,66,0.2)',vig:.3,amb:'silver noon'},
  15:{tint:'rgba(96,84,74,0.13)',lx:.7,ly:.45,shadow:'rgba(38,32,28,0.32)',vig:.46,amb:'ashfall'},
  16:{tint:'rgba(250,246,236,0.15)',lx:.5,ly:.3,shadow:'rgba(60,60,70,0.12)',vig:.22,amb:'the sealed blank'}};

// ---- sprites: painted in the engine's own hand -------------------------------
// (painters run at bake time, long after the engine has defined its helpers)

S.painters={
  kitsune(g){ // a young fox: russet fur, cream chest, one clever eye
    g.fillStyle='#b5552c';
    g.beginPath();g.moveTo(-6,-7);g.quadraticCurveTo(-22,-13,-26,-4);g.quadraticCurveTo(-16,-1,-7,-3);g.closePath();g.fill();
    g.beginPath();g.moveTo(-6,7);g.quadraticCurveTo(-22,13,-26,4);g.quadraticCurveTo(-16,1,-7,3);g.closePath();g.fill();
    g.fillStyle='#8a3d1f';
    g.beginPath();g.moveTo(-5,-6);g.quadraticCurveTo(-18,-10,-21,-3);g.quadraticCurveTo(-13,-1,-5,-2);g.closePath();g.fill();
    oBlob(g,-3,0,13,10,'#b5552c');sheen(g,-3,-4,10,7,'rgba(246,241,226,0.2)');
    g.fillStyle='#e6d9c0';g.beginPath();g.ellipse(3,0,7,5.5,0,0,TAU);g.fill();
    oBlob(g,9,0,7,6,'#b5552c');
    g.fillStyle='#efe6d4';g.beginPath();g.moveTo(14,-3);g.lineTo(18,0);g.lineTo(14,3);g.closePath();g.fill();
    g.fillStyle=INK;g.beginPath();g.arc(10,-2.5,1.4,0,TAU);g.fill();
    g.fillStyle='#7a3018';
    g.beginPath();g.moveTo(3,-5.4);g.lineTo(6,-9.6);g.lineTo(7.5,-4.6);g.closePath();g.fill();
    g.beginPath();g.moveTo(3,5.4);g.lineTo(6,9.6);g.lineTo(7.5,4.6);g.closePath();g.fill();
    g.strokeStyle='rgba(120,60,30,0.7)';g.lineWidth=1.1;
    g.beginPath();g.moveTo(-16,-11);g.lineTo(-17,-15);g.stroke();
    g.beginPath();g.moveTo(-19,-10);g.lineTo(-22,-13);g.stroke();},
  wisp(g){ // a cold flame keeping an unhung lantern: teal core, paper shade
    g.globalAlpha=.92;
    g.fillStyle='rgba(74,126,140,0.55)';
    g.beginPath();g.moveTo(-4,-10);g.quadraticCurveTo(-16,-4,-11,2);g.quadraticCurveTo(-15,8,-3,10);g.closePath();g.fill();
    g.fillStyle='rgba(110,160,170,0.4)';
    g.beginPath();g.moveTo(4,-10);g.quadraticCurveTo(16,-4,11,2);g.quadraticCurveTo(15,8,3,10);g.closePath();g.fill();
    g.fillStyle='#a7c4c2';g.beginPath();g.ellipse(0,0,9,11,0,0,TAU);g.fill();
    g.fillStyle='#d8e4dd';g.beginPath();g.ellipse(1,0,5,7,0,0,TAU);g.fill();
    g.fillStyle='#c9762e';g.beginPath();g.arc(1,1,3.4,0,TAU);g.fill();
    g.fillStyle='#f0d27a';g.beginPath();g.arc(1,1,1.8,0,TAU);g.fill();
    g.strokeStyle='#8c3a20';g.lineWidth=1.2;
    g.beginPath();g.moveTo(-7,-9);g.lineTo(9,-9);g.stroke();
    g.globalAlpha=1;},
  doro(g){ // river mud pressed into a grudge: layered silt, stone eyes
    g.fillStyle='rgba(88,72,58,0.6)';
    g.beginPath();g.moveTo(-12,-9);g.quadraticCurveTo(-30,-16,-32,0);g.quadraticCurveTo(-30,16,-12,9);g.closePath();g.fill();
    g.fillStyle='rgba(110,92,72,0.5)';
    g.beginPath();g.moveTo(-10,-7);g.quadraticCurveTo(-26,-12,-27,0);g.quadraticCurveTo(-26,12,-10,7);g.closePath();g.fill();
    oBlob(g,-4,0,22,18,'#6a584a');sheen(g,-4,-6,18,14,'rgba(246,241,226,0.14)');
    g.strokeStyle='#544536';g.lineWidth=1.4;
    for(let i=0;i<4;i++){g.beginPath();g.ellipse(-4,0,19-i*4.5,15-i*3.6,0,0,TAU);g.stroke();}
    g.strokeStyle='#3f3327';g.lineWidth=2;
    g.beginPath();g.moveTo(-4,0);g.lineTo(6,0);g.stroke();
    g.fillStyle='#8a7a64';
    g.beginPath();g.arc(0,-6,2.2,0,TAU);g.arc(-2,4,1.8,0,TAU);g.arc(4,7,1.6,0,TAU);g.fill();
    oBlob(g,13,0,10,8.5,'#5a4a3c');
    g.fillStyle='#2c241c';
    g.beginPath();g.arc(15,-3,1.8,0,TAU);g.arc(15,3,1.8,0,TAU);g.fill();
    g.fillStyle='#c9762e';
    g.beginPath();g.arc(15,-3,0.9,0,TAU);g.arc(15,3,0.9,0,TAU);g.fill();},
  doroko(g){ // half a grudge, still moving
    g.fillStyle='rgba(88,72,58,0.55)';
    g.beginPath();g.moveTo(-6,-5);g.quadraticCurveTo(-17,-9,-18,0);g.quadraticCurveTo(-17,9,-6,5);g.closePath();g.fill();
    oBlob(g,-2,0,11,9,'#6a584a');
    g.strokeStyle='#544536';g.lineWidth=1.2;
    g.beginPath();g.ellipse(-2,0,9,7,0,0,TAU);g.stroke();
    oBlob(g,7,0,5.5,4.5,'#5a4a3c');
    g.fillStyle='#2c241c';
    g.beginPath();g.arc(8,-1.8,1.1,0,TAU);g.arc(8,1.8,1.1,0,TAU);g.fill();},
  suzume(g){ // needle-work sparrow: brown wings, a fan of darts
    g.fillStyle='#8a6a42';
    g.beginPath();g.moveTo(-3,-6);g.lineTo(-15,-13);g.lineTo(-5,-1);g.closePath();g.fill();
    g.beginPath();g.moveTo(-3,6);g.lineTo(-15,13);g.lineTo(-5,1);g.closePath();g.fill();
    g.strokeStyle='#6b4e2e';g.lineWidth=.9;
    for(let i=0;i<3;i++){g.beginPath();g.moveTo(-4-i*2,-7-i*2);g.lineTo(-13-i*1.5,-11-i*2.4);g.stroke();
      g.beginPath();g.moveTo(-4-i*2,7+i*2);g.lineTo(-13-i*1.5,11+i*2.4);g.stroke();}
    oBlob(g,-2,0,10,8.5,'#9c7850');sheen(g,-2,-3,8,6.5,'rgba(246,241,226,0.2)');
    oBlob(g,7,0,6,5.5,'#b08a5c');
    g.fillStyle='#2c241c';g.beginPath();g.arc(8,-1.8,1.2,0,TAU);g.arc(8,1.8,1.2,0,TAU);g.fill();
    g.fillStyle='#c9762e';g.beginPath();g.moveTo(12,0);g.lineTo(16,-1.4);g.lineTo(16,1.4);g.closePath();g.fill();
    g.strokeStyle='#54483a';g.lineWidth=1.6;g.lineCap='round';
    for(let i=0;i<3;i++){const a=-.5+i*.5;
      g.beginPath();g.moveTo(12,0);g.lineTo(12+Math.cos(a)*9,Math.sin(a)*9);g.stroke();}},
  nekomata(g){ // two-tailed stalker: charcoal fur, split tails, ember eyes
    g.fillStyle='#2e2a33';
    g.beginPath();g.moveTo(-4,-6);g.quadraticCurveTo(-24,-14,-30,-5);g.quadraticCurveTo(-26,-4,-20,-4);g.quadraticCurveTo(-26,0,-24,2);g.closePath();g.fill();
    g.beginPath();g.moveTo(-4,6);g.quadraticCurveTo(-24,14,-30,5);g.quadraticCurveTo(-26,4,-20,4);g.quadraticCurveTo(-26,0,-24,-2);g.closePath();g.fill();
    g.strokeStyle='#423d4c';g.lineWidth=1;
    g.beginPath();g.moveTo(-8,-7);g.quadraticCurveTo(-20,-12,-27,-6);g.stroke();
    g.beginPath();g.moveTo(-8,7);g.quadraticCurveTo(-20,12,-27,6);g.stroke();
    oBlob(g,-2,0,12,9.5,'#3a3542');sheen(g,-2,-4,9.5,7,'rgba(246,241,226,0.16)');
    g.fillStyle='#4a4556';g.beginPath();g.ellipse(2,0,7,5.5,0,0,TAU);g.fill();
    oBlob(g,9,0,6.5,5.5,'#3a3542');
    g.fillStyle=RED2;g.beginPath();g.arc(11,-2,1.5,0,TAU);g.arc(11,2,1.5,0,TAU);g.fill();
    g.fillStyle=RED;
    g.beginPath();g.moveTo(4,-4.8);g.lineTo(6.4,-8.4);g.lineTo(7.8,-3.8);g.closePath();g.fill();
    g.beginPath();g.moveTo(4,4.8);g.lineTo(6.4,8.4);g.lineTo(7.8,3.8);g.closePath();g.fill();},
  kagura(g){ // the dancer: white sleeves, red hakama, orbit blades suggested
    g.fillStyle='rgba(232,226,210,0.75)';
    g.beginPath();g.moveTo(-2,-9);g.quadraticCurveTo(-26,-22,-34,-10);g.quadraticCurveTo(-22,-6,-6,-4);g.closePath();g.fill();
    g.beginPath();g.moveTo(-2,9);g.quadraticCurveTo(-26,22,-34,10);g.quadraticCurveTo(-22,6,-6,4);g.closePath();g.fill();
    g.strokeStyle='#c2b8a0';g.lineWidth=1;
    for(let i=0;i<3;i++){g.beginPath();g.moveTo(-6-i*3,-8-i*4);g.lineTo(-24-i*2,-16-i*2);g.stroke();
      g.beginPath();g.moveTo(-6-i*3,8+i*4);g.lineTo(-24-i*2,16+i*2);g.stroke();}
    oBlob(g,-2,0,12,10,'#e2dac8');sheen(g,-2,-4,9.5,8,'rgba(246,241,226,0.35)');
    g.fillStyle='#b3372a';
    g.beginPath();g.moveTo(-10,-6);g.lineTo(-8,6);g.lineTo(8,6);g.lineTo(6,-6);g.closePath();g.fill();
    g.strokeStyle='rgba(140,43,31,0.6)';g.lineWidth=1;
    g.beginPath();g.moveTo(-9,0);g.lineTo(7,0);g.stroke();
    oBlob(g,10,0,7,6,'#e2dac8');
    g.fillStyle='#241f1c';g.beginPath();g.arc(11.5,-2,1.2,0,TAU);g.arc(11.5,2,1.2,0,TAU);g.fill();
    g.strokeStyle='#c9932a';g.lineWidth=1.4;
    g.beginPath();g.arc(0,0,17,-.4,.9);g.stroke();
    g.fillStyle='#c9932a';
    g.beginPath();g.moveTo(Math.cos(-.4)*17,Math.sin(-.4)*17);g.lineTo(Math.cos(-.4)*17+3,Math.sin(-.4)*17-1);g.lineTo(Math.cos(-.4)*17+1,Math.sin(-.4)*17+3);g.closePath();g.fill();},
  shishi(g){ // guardian lion with a drum heart: stone mane, drum ribs
    g.fillStyle='#6a5a44';
    g.beginPath();g.arc(-4,0,20,0,TAU);g.fill();
    g.strokeStyle='#4e4232';g.lineWidth=1.6;
    for(let i=0;i<8;i++){const a=i/8*TAU;
      g.beginPath();g.moveTo(-4+Math.cos(a)*20,Math.sin(a)*20);g.lineTo(-4+Math.cos(a)*25,Math.sin(a)*25);g.stroke();}
    g.fillStyle='#7c6a50';
    g.beginPath();g.arc(-4,0,15,0,TAU);g.fill();
    g.fillStyle='#8c7a5c';g.beginPath();g.ellipse(4,0,11,9,0,0,TAU);g.fill();
    oBlob(g,10,0,8,7,'#9c8a6a');
    g.fillStyle='#241f1c';
    g.beginPath();g.arc(12,-2.6,1.6,0,TAU);g.arc(12,2.6,1.6,0,TAU);g.fill();
    g.fillStyle=RED;g.beginPath();g.arc(12,-2.6,.8,0,TAU);g.arc(12,2.6,.8,0,TAU);g.fill();
    g.fillStyle='#5a4a36';g.beginPath();g.ellipse(12,0,4.4,4,0,0,TAU);g.fill();
    g.strokeStyle='#c9932a';g.lineWidth=1.2;
    g.beginPath();g.arc(0,0,24,2.2,3.2);g.stroke();
    g.beginPath();g.arc(0,0,24,5.4,6.4);g.stroke();
    g.fillStyle='#d8c04a';
    g.beginPath();g.arc(Math.cos(2.7)*24,Math.sin(2.7)*24,2.2,0,TAU);g.fill();
    g.beginPath();g.arc(Math.cos(5.9)*24,Math.sin(5.9)*24,2.2,0,TAU);g.fill();}};

S.bossPainters={
  kodama(g){ // root of the hollow: bark crown, moss mantle, kind ancient eyes
    g.strokeStyle='#5a4a34';g.lineWidth=5;g.lineCap='round';
    g.beginPath();g.moveTo(-10,-8);g.lineTo(-26,-24);g.stroke();
    g.beginPath();g.moveTo(-10,8);g.lineTo(-26,24);g.stroke();
    g.strokeStyle='#7a6648';g.lineWidth=2;
    g.beginPath();g.moveTo(-12,-6);g.quadraticCurveTo(-24,-12,-32,-8);g.stroke();
    g.beginPath();g.moveTo(-12,6);g.quadraticCurveTo(-24,12,-32,8);g.stroke();
    g.fillStyle='#4e5a3a';
    g.beginPath();g.ellipse(-6,0,30,24,0,0,TAU);g.fill();
    g.strokeStyle='#3a462c';g.lineWidth=1.6;
    for(let i=0;i<5;i++){g.beginPath();g.ellipse(-6,0,28-i*5.4,22-i*4.2,0,0,TAU);g.stroke();}
    oBlob(g,-4,0,24,19,'#5c6a44');sheen(g,-4,-7,20,15,'rgba(246,241,226,0.16)');
    g.fillStyle='#6e7c52';
    g.beginPath();g.arc(-14,-12,4,0,TAU);g.arc(2,-16,3.4,0,TAU);g.arc(-8,14,3.6,0,TAU);g.fill();
    oBlob(g,14,0,13,11,'#5c6a44');
    g.fillStyle='#e6dfcc';g.beginPath();g.ellipse(19,0,9,8,0,0,TAU);g.fill();
    g.fillStyle='#241f1c';g.beginPath();g.arc(21,-3,2.2,0,TAU);g.arc(21,3,2.2,0,TAU);g.fill();
    g.fillStyle='#c9932a';g.beginPath();g.arc(21,-3,1,0,TAU);g.arc(21,3,1,0,TAU);g.fill();
    g.strokeStyle='#b5552c';g.lineWidth=1.6;
    g.beginPath();g.moveTo(14,-8);g.quadraticCurveTo(20,-12,26,-8);g.stroke();
    caps(g,12,10,34,20,5,'#5c6a44');
    g.strokeStyle='#3a462c';g.lineWidth=1.4;
    g.beginPath();g.moveTo(16,12);g.lineTo(32,18);g.stroke();
    g.fillStyle='#8a7a5c';
    g.beginPath();g.arc(30,19,3.4,0,TAU);g.fill();},
  akari(g){ // warden of the lantern river: afloat on her own light, kimono of dark water
    g.strokeStyle='rgba(160,176,204,0.5)';g.lineWidth=1.4;
    g.beginPath();g.ellipse(-8,10,26,9,0,0,TAU);g.stroke();
    g.beginPath();g.ellipse(-8,13,18,6,0,0,TAU);g.stroke();
    g.fillStyle='#2c3550';
    g.beginPath();g.moveTo(-4,-10);g.quadraticCurveTo(-34,-26,-40,-8);g.quadraticCurveTo(-30,0,-10,-4);g.closePath();g.fill();
    g.beginPath();g.moveTo(-4,10);g.quadraticCurveTo(-34,26,-40,8);g.quadraticCurveTo(-30,0,-10,4);g.closePath();g.fill();
    g.strokeStyle='rgba(120,140,180,0.4)';g.lineWidth=1;
    for(let i=0;i<3;i++){g.beginPath();g.moveTo(-8-i*4,-11-i*4);g.lineTo(-30-i*2,-20-i*2);g.stroke();
      g.beginPath();g.moveTo(-8-i*4,11+i*4);g.lineTo(-30-i*2,20+i*2);g.stroke();}
    oBlob(g,-2,0,22,18,'#374262');sheen(g,-2,-6,18,14,'rgba(200,214,232,0.18)');
    g.strokeStyle='#c9932a';g.lineWidth=1.2;
    g.beginPath();g.moveTo(-14,-4);g.quadraticCurveTo(0,-9,12,-3);g.stroke();
    oBlob(g,13,0,11,9,'#374262');
    g.fillStyle='#e6dfcc';g.beginPath();g.ellipse(18,0,7.5,6.5,0,0,TAU);g.fill();
    g.fillStyle='#241f1c';g.beginPath();g.arc(20,-2.4,1.8,0,TAU);g.arc(20,2.4,1.8,0,TAU);g.fill();
    g.fillStyle='#d8b04a';g.beginPath();g.arc(2,4,3.2,0,TAU);g.fill();
    g.fillStyle='#f0d27a';g.beginPath();g.arc(2,4,1.6,0,TAU);g.fill();
    g.strokeStyle='#8c6d1f';g.lineWidth=1;
    g.beginPath();g.ellipse(2,4,5.4,7.2,0,0,TAU);g.stroke();
    caps(g,12,-10,28,-18,4,'#374262');
    g.fillStyle='#d8b04a';
    g.beginPath();g.arc(30,-18,5,0,TAU);g.fill();
    g.fillStyle='#f0d27a';g.beginPath();g.arc(30,-18,2.4,0,TAU);g.fill();},
  kurogane(g){ // the iron brush: mirrored dancer in black iron, red ribbon
    g.fillStyle='rgba(40,36,44,0.8)';
    g.beginPath();g.moveTo(-2,-9);g.quadraticCurveTo(-28,-24,-36,-10);g.quadraticCurveTo(-24,-4,-6,-3);g.closePath();g.fill();
    g.beginPath();g.moveTo(-2,9);g.quadraticCurveTo(-28,24,-36,10);g.quadraticCurveTo(-24,4,-6,3);g.closePath();g.fill();
    g.strokeStyle='#544c5c';g.lineWidth=1;
    for(let i=0;i<3;i++){g.beginPath();g.moveTo(-8-i*3,-9-i*4);g.lineTo(-28-i*2,-18-i*2);g.stroke();
      g.beginPath();g.moveTo(-8-i*3,9+i*4);g.lineTo(-28-i*2,18+i*2);g.stroke();}
    oBlob(g,-3,0,21,17,'#2c2830');sheen(g,-3,-6,17,13,'rgba(246,241,226,0.2)');
    g.strokeStyle='#8c8494';g.lineWidth=1.4;
    g.beginPath();g.ellipse(-3,0,19,15,0,-.8,.6);g.stroke();
    oBlob(g,12,0,10,8.5,'#2c2830');
    g.fillStyle='#e6dfcc';g.beginPath();g.ellipse(17,0,7,6,0,0,TAU);g.fill();
    g.fillStyle=RED;g.beginPath();g.arc(19,-2.4,1.8,0,TAU);g.arc(19,2.4,1.8,0,TAU);g.fill();
    g.fillStyle=RED;
    g.beginPath();g.moveTo(8,-8);g.lineTo(11,-12);g.lineTo(13,-7);g.closePath();g.fill();
    g.fillStyle='#8c8494';
    g.beginPath();g.moveTo(9,8);g.lineTo(21,4);g.lineTo(14,12);g.closePath();g.fill();
    g.strokeStyle='#b3372a';g.lineWidth=1.6;
    g.beginPath();g.moveTo(-2,-11);g.quadraticCurveTo(6,-22,16,-16);g.stroke();
    caps(g,14,10,52,22,5,'#2c2830');
    g.fillStyle='#1d1a16';
    g.beginPath();g.ellipse(56,23,4.4,3.4,0,0,TAU);g.fill();
    g.fillStyle='#b5552c';
    g.beginPath();g.ellipse(62,25,8,3.4,.6,0,TAU);g.fill();
    g.strokeStyle='#544c5c';g.lineWidth=1;
    g.beginPath();g.moveTo(52,21);g.lineTo(60,24);g.stroke();},
  ginro(g){ // the silver grass alpha: pale fur, dark mane, amber stare
    caps(g,-30,-22,-64,-34,12,'#4e4a52');caps(g,-30,22,-64,34,12,'#4e4a52');
    g.fillStyle='#aeb0ac';
    g.beginPath();g.moveTo(-6,-10);g.quadraticCurveTo(-40,-24,-48,-6);g.quadraticCurveTo(-36,0,-10,-4);g.closePath();g.fill();
    g.beginPath();g.moveTo(-6,10);g.quadraticCurveTo(-40,24,-48,6);g.quadraticCurveTo(-36,0,-10,4);g.closePath();g.fill();
    g.strokeStyle='#8c8e8a';g.lineWidth=1.1;
    for(let i=0;i<4;i++){g.beginPath();g.moveTo(-12-i*3,-10-i*3);g.lineTo(-40-i*1.6,-19-i*1.6);g.stroke();
      g.beginPath();g.moveTo(-12-i*3,10+i*3);g.lineTo(-40-i*1.6,19+i*1.6);g.stroke();}
    oBlob(g,-6,0,28,22,'#b8bab4');sheen(g,-6,-8,24,18,'rgba(246,241,226,0.3)');
    g.strokeStyle='#7c7e78';g.lineWidth=1.4;
    g.beginPath();g.ellipse(-6,0,25,19,0,0,TAU);g.stroke();
    oBlob(g,12,0,14,11,'#b8bab4');
    g.fillStyle='#5c5e58';g.beginPath();g.ellipse(20,0,10,8,0,0,TAU);g.fill();
    g.fillStyle=AMBER;g.beginPath();g.arc(22,-3.4,2.4,0,TAU);g.arc(22,3.4,2.4,0,TAU);g.fill();
    g.fillStyle='#241f1c';
    g.beginPath();g.moveTo(28,-5);g.lineTo(34,-2);g.lineTo(28,-1);g.closePath();g.fill();
    g.beginPath();g.moveTo(28,5);g.lineTo(34,2);g.lineTo(28,1);g.closePath();g.fill();
    g.strokeStyle='#5c5e58';g.lineWidth=2;
    g.beginPath();g.moveTo(4,-12);g.lineTo(12,-18);g.stroke();
    g.beginPath();g.moveTo(4,12);g.lineTo(12,18);g.stroke();
    g.strokeStyle=RED2;g.lineWidth=1.8;g.lineCap='round';
    g.beginPath();g.arc(0,0,30,.9,2.2);g.stroke();},
  hibana(g){ // saint of the ashfall: grey robes, ember mantle, burning heart
    g.fillStyle='rgba(120,80,60,0.55)';
    g.beginPath();g.moveTo(-6,-10);g.quadraticCurveTo(-38,-26,-44,-6);g.quadraticCurveTo(-30,0,-10,-4);g.closePath();g.fill();
    g.beginPath();g.moveTo(-6,10);g.quadraticCurveTo(-38,26,-44,6);g.quadraticCurveTo(-30,0,-10,4);g.closePath();g.fill();
    g.strokeStyle='#a86a4a';g.lineWidth=1.1;
    for(let i=0;i<3;i++){g.beginPath();g.moveTo(-12-i*3,-11-i*4);g.lineTo(-34-i*2,-20-i*2);g.stroke();
      g.beginPath();g.moveTo(-12-i*3,11+i*4);g.lineTo(-34-i*2,20+i*2);g.stroke();}
    oBlob(g,-4,0,24,19,'#6a655e');sheen(g,-4,-7,20,15,'rgba(246,241,226,0.15)');
    g.strokeStyle='#8c8478';g.lineWidth=1.4;
    for(let i=1;i<=3;i++)caps(g,-20,i*7,6,i*10,1.4,'#8c8478');
    oBlob(g,12,0,12,10,'#6a655e');
    g.fillStyle='#4c4842';g.beginPath();g.ellipse(18,0,9,7.5,0,0,TAU);g.fill();
    g.fillStyle='#f0d27a';g.beginPath();g.arc(20,-2.8,2,0,TAU);g.arc(20,2.8,2,0,TAU);g.fill();
    g.fillStyle=RED;g.beginPath();g.arc(0,2,5,0,TAU);g.fill();
    g.fillStyle='#f0d27a';g.beginPath();g.arc(0,2,2.4,0,TAU);g.fill();
    g.strokeStyle='#c9762e';g.lineWidth=1.6;
    g.beginPath();g.arc(0,2,9,0,TAU);g.stroke();
    g.strokeStyle=RED2;g.lineWidth=2.4;
    g.beginPath();g.arc(0,0,30,1.2,2.1);g.stroke();
    g.beginPath();g.arc(0,0,30,4.3,5.2);g.stroke();
    caps(g,14,10,40,20,5,'#6a655e');
    g.strokeStyle='#c9762e';g.lineWidth=2;
    g.beginPath();g.moveTo(40,18);g.lineTo(46,21);g.stroke();
    g.fillStyle='#f0d27a';g.beginPath();g.arc(46,21,2.4,0,TAU);g.fill();},
  shisho(g){ // the seal-master: blank robes, the red stamp held like a verdict
    g.fillStyle='rgba(246,241,226,0.9)';
    g.beginPath();g.moveTo(-4,-10);g.quadraticCurveTo(-36,-28,-44,-6);g.quadraticCurveTo(-30,2,-8,-4);g.closePath();g.fill();
    g.beginPath();g.moveTo(-4,10);g.quadraticCurveTo(-36,28,-44,6);g.quadraticCurveTo(-30,-2,-8,4);g.closePath();g.fill();
    g.strokeStyle='rgba(74,68,60,0.4)';g.lineWidth=1;
    for(let i=0;i<3;i++){g.beginPath();g.moveTo(-10-i*3,-11-i*4);g.lineTo(-36-i*2,-21-i*2);g.stroke();
      g.beginPath();g.moveTo(-10-i*3,11+i*4);g.lineTo(-36-i*2,21+i*2);g.stroke();}
    oBlob(g,-2,0,24,19,'#f0ead8');sheen(g,-2,-7,20,15,'rgba(255,255,255,0.4)');
    g.strokeStyle='#b3372a';g.lineWidth=1.2;
    g.beginPath();g.moveTo(-16,-6);g.quadraticCurveTo(0,-11,14,-5);g.stroke();
    g.strokeStyle=INK;g.lineWidth=2;
    g.strokeRect(-8,2,7,7);
    g.fillStyle=RED;g.fillRect(-8,2,7,7);
    oBlob(g,13,0,11,9.5,'#f0ead8');
    g.fillStyle='#3a3430';g.beginPath();g.ellipse(19,0,8,6.5,0,0,TAU);g.fill();
    g.fillStyle=RED;g.beginPath();g.arc(21,-2.6,1.8,0,TAU);g.arc(21,2.6,1.8,0,TAU);g.fill();
    g.strokeStyle=RED;g.lineWidth=1.6;
    g.beginPath();g.moveTo(16,-7);g.lineTo(20,1);g.lineTo(15,7);g.stroke();
    caps(g,14,10,46,22,5,'#f0ead8');
    g.fillStyle='#3a3430';
    g.beginPath();g.ellipse(50,24,5,4,0,0,TAU);g.fill();
    g.fillStyle=RED;
    g.beginPath();
    if(g.roundRect)g.roundRect(46,29,9,9,2);else g.rect(46,29,9,9);
    g.fill();
    g.fillStyle='#f0ead8';g.font='700 8px "Shippori Mincho",serif';g.textAlign='center';
    g.fillText('印',50.5,36.5);g.textAlign='left';}};

// ---- boss moves: mechanics the first road never drew --------------------------
// every move is {start(b), up(b,dt)} on the engine's clock, same as BOSSMOVES.

S.bossMoves={
  // chained hands from below — a sequence that chases the player's steps
  grasp:{start(b){b.mt=0;b.sub=0;b.n=0;},
    up(b,dt){if(b.sub===0&&b.mt>.3){b.sub=1;b.mt=0;b.n=0;b.px=P.x;b.py=P.y;}
      if(b.sub===1){b.fireT-=dt;
        if(b.fireT<=0&&b.n<(b.phase2?5:3)){b.fireT=.26;b.n++;
          const x=clamp(b.px+rnd(-40,40),WALL+40,RW-WALL-40),y=clamp(b.py+rnd(-40,40),WALL+40,RH-WALL-40);
          addTele({x,y,r:52,dur:.6,dmg:16*b.dmgS,peril:true,src:b});
          inkBurst(x,y,6,'#4e5a3a',.6);
          b.px=P.x;b.py=P.y;}}
      if(b.sub===1&&b.n>=(b.phase2?5:3)&&b.mt>1.5)bossEnd(b);}},
  // a hard seed cone — parryable arc plus real projectiles
  seedCone:{start(b){b.mt=0;b.sub=0;b.dir=null;},
    up(b,dt){if(b.dir===null&&b.mt>.12)b.dir=angTo(b.x,b.y,P.x,P.y);
      if(b.dir!==null)b.facing=lerp2(b.facing,b.dir,dt*5);
      if(b.sub===0&&b.mt>.55){b.sub=1;b.mt=0;
        addTele({kind:'arc',x:b.x,y:b.y,ang:b.dir,r:230,spread:1.5,dur:.62,dmg:17*b.dmgS,parry:true,src:b});
        for(let i=-2;i<=2;i++)eproj(b.x,b.y,b.dir+i*.17,300,10*b.dmgS,{kind:'shard',r:6,ttl:3});AU.swish();}
      if(b.mt>.8)bossEnd(b);}},
  // three rings, each wider, the third aimed at the escape
  bloomRings:{start(b){b.mt=0;b.sub=0;b.n=0;},
    up(b,dt){if(b.sub===0&&b.mt>.5){b.sub=1;b.mt=0;}
      if(b.sub===1){b.fireT-=dt;
        if(b.fireT<=0&&b.n<3){b.fireT=.55;b.n++;
          shockRing(b.x,b.y,16*b.dmgS,340+b.n*70,480+b.n*90);
          const off=rnd(TAU),m=10+b.n*4;
          for(let i=0;i<m;i++)eproj(b.x,b.y,off+i/m*TAU,170,9*b.dmgS,{kind:'orb'});}}
      if(b.n>=3&&b.mt>2.1)bossEnd(b);}},
  // blades of light orbit the boss for a while — the safe distance is a lie
  orbitals:{start(b){b.mt=0;b.orbs={t:b.phase2?4.6:3.6,ang:rnd(TAU),rad:b.r+34,cd:0,n:b.phase2?5:4};AU.roar();},
    up(b,dt){const o=b.orbs;o.ang+=dt*2.4;o.t-=dt;
      b.facing=lerp2(b.facing,angTo(b.x,b.y,P.x,P.y),dt*3);
      const d=dist(b.x,b.y,P.x,P.y);
      if(d>190){const a=angTo(b.x,b.y,P.x,P.y);b.x+=Math.cos(a)*b.spd*.6*dt;b.y+=Math.sin(a)*b.spd*.6*dt;}
      o.cd-=dt;
      if(o.cd<=0&&!P.dead)for(let i=0;i<o.n;i++){const a=o.ang+i/o.n*TAU;
        const ox=b.x+Math.cos(a)*o.rad,oy=b.y+Math.sin(a)*o.rad;
        if(dist(ox,oy,P.x,P.y)<13+P.r){o.cd=.6;damagePlayer(13*b.dmgS,b);trauma(.2);break;}}
      if(o.t<=0)bossEnd(b);}},
  // lit shrines fall across the field — the cool gaps drift
  lanternRain:{start(b){b.mt=0;b.sub=0;},
    up(b,dt){if(b.sub===0&&b.mt>.3){b.sub=1;b.mt=0;
      const n=b.phase2?11:8;
      for(let i=0;i<n;i++){const x=clamp(P.x+rnd(-360,360),WALL+50,RW-WALL-50),y=clamp(P.y+rnd(-280,280),WALL+50,RH-WALL-50);
        addTele({x,y,r:58,dur:.95,dmg:15*b.dmgS,delay:i*.12});
        setTimeoutGame(.95+i*.12,()=>{inkBurst(x,y,8,'#c9932a',.8);});}}
      if(b.sub===1&&b.mt>1.7)bossEnd(b);}},
  // the river drags the player in while a ring builds
  pullWave:{start(b){b.mt=0;b.sub=0;},
    up(b,dt){if(b.sub===0){ // the pull
      const a=angTo(P.x,P.y,b.x,b.y);
      P.vx+=Math.cos(a)*430*dt;P.vy+=Math.sin(a)*430*dt;
      b.facing=lerp2(b.facing,angTo(b.x,b.y,P.x,P.y),dt*4);
      if(b.mt>.85){b.sub=1;b.mt=0;shockRing(b.x,b.y,19*b.dmgS,380,520);AU.roar();trauma(.4);}}
      else if(b.mt>.7)bossEnd(b);}},
  // three ink-lines cross the player's position — the seams are mercy
  crossfire:{start(b){b.mt=0;b.sub=0;b.a0=rnd(TAU);},
    up(b,dt){if(b.sub===0&&b.mt>.4){b.sub=1;b.mt=0;
      for(let i=0;i<3;i++){const a=b.a0+i*PI/3;
        addTele({kind:'line',x:P.x,y:P.y,ang:a,len:520,w:34,dur:.72,vis:true,peril:true});}
      AU.zap();}
      if(b.mt>1.3)bossEnd(b);}},
  // darts that bend toward the player
  homingVolley:{start(b){b.mt=0;b.sub=0;b.fired=0;},
    up(b,dt){b.facing=lerp2(b.facing,angTo(b.x,b.y,P.x,P.y),dt*6);
      if(b.sub===0&&b.mt>.45){b.sub=1;b.mt=0;}
      if(b.sub===1){b.fireT-=dt;
        if(b.fireT<=0&&b.fired<(b.phase2?6:4)){b.fireT=.3;b.fired++;
          const a=angTo(b.x,b.y,P.x,P.y)+rnd(-.9,.9);
          eproj(b.x,b.y,a,235,11*b.dmgS,{kind:'shard',r:6,hom:true,ttl:4.5});AU.deflect();}}
      if(b.fired>=(b.phase2?6:4)&&b.mt>1.2)bossEnd(b);}},
  // a fan of red lines through the field — stand in a seam
  dashWeb:{start(b){b.mt=0;b.sub=0;},
    up(b,dt){if(b.sub===0&&b.mt>.5){b.sub=1;b.mt=0;
      const a0=angTo(b.x,b.y,P.x,P.y);
      for(let i=-2;i<=2;i++)addTele({kind:'line',x:b.x,y:b.y,ang:a0+i*.3,len:640,w:38,dur:.8,vis:true,peril:true});
      AU.roar();}
      if(b.mt>1.4)bossEnd(b);}},
  // the howl: dragged toward the jaws while the ring builds
  howlPull:{start(b){b.mt=0;b.sub=0;},
    up(b,dt){if(b.sub===0){const a=angTo(P.x,P.y,b.x,b.y);
      P.vx+=Math.cos(a)*520*dt;P.vy+=Math.sin(a)*520*dt;
      if((b.mt*13|0)!==b._hb){b._hb=b.mt*13|0;trauma(.12);AU.dash();}
      if(b.mt>.95){b.sub=1;b.mt=0;shockRing(b.x,b.y,20*b.dmgS,420,560);AU.roar();trauma(.5);}}
      else if(b.mt>.75)bossEnd(b);}},
  // pale bolts, staggered and wide
  lunarBolts:{start(b){b.mt=0;b.sub=0;b.n=0;},
    up(b,dt){if(b.sub===0&&b.mt>.5){b.sub=1;b.mt=0;b.n=0;}
      if(b.sub===1){b.fireT-=dt;
        if(b.fireT<=0&&b.n<(b.phase2?8:6)){b.fireT=.3;b.n++;
          addTele({x:clamp(P.x+rnd(-110,110),WALL+40,RW-WALL-40),y:clamp(P.y+rnd(-110,110),WALL+40,RH-WALL-40),r:64,dur:.75,dmg:16*b.dmgS,bolt:true});}}
      if(b.n>=(b.phase2?8:6)&&b.mt>2.2)bossEnd(b);}},
  // ember rain — the cool gaps drift with the wind
  emberRain:{start(b){b.mt=0;b.sub=0;},
    up(b,dt){if(b.sub===0&&b.mt>.25){b.sub=1;b.mt=0;
      const n=b.phase2?12:9;
      for(let i=0;i<n;i++){const x=clamp(P.x+rnd(-340,340),WALL+40,RW-WALL-40),y=clamp(P.y+rnd(-260,260),WALL+40,RH-WALL-40);
        addTele({x,y,r:52,dur:.9,dmg:13*b.dmgS,delay:i*.11});
        setTimeoutGame(.9+i*.11,()=>{inkBurst(x,y,6,'#c9762e',.7);});}}
      if(b.sub===1&&b.mt>1.5)bossEnd(b);}},
  // three expanding rings of embers, the third aimed wide
  novaChain:{start(b){b.mt=0;b.sub=0;b.n=0;},
    up(b,dt){if(b.sub===0&&b.mt>.45){b.sub=1;b.mt=0;}
      if(b.sub===1){b.fireT-=dt;
        if(b.fireT<=0&&b.n<3){b.fireT=.5;b.n++;
          const off=rnd(TAU),m=12+b.n*5;
          for(let i=0;i<m;i++)eproj(b.x,b.y,off+i/m*TAU,205+b.n*22,10*b.dmgS,{kind:'ember',r:6,ttl:2.6});
          AU.zap();trauma(.25);}}
      if(b.n>=3&&b.mt>1.9)bossEnd(b);}},
  // seals stamp down where the player fled
  stampRain:{start(b){b.mt=0;b.sub=0;b.n=0;},
    up(b,dt){if(b.sub===0&&b.mt>.35){b.sub=1;b.mt=0;b.n=0;b.px=P.x;b.py=P.y;}
      if(b.sub===1){b.fireT-=dt;
        if(b.fireT<=0&&b.n<(b.phase2?7:5)){b.fireT=.24;b.n++;
          const x=clamp(b.px+rnd(-50,50),WALL+40,RW-WALL-40),y=clamp(b.py+rnd(-50,50),WALL+40,RH-WALL-40);
          addTele({x,y,r:60,dur:.7,dmg:17*b.dmgS,peril:true});
          setTimeoutGame(.7,()=>{splat(x,y,false);inkBurst(x,y,8,'#b3372a',.9);AU.stamp();});
          b.px=P.x;b.py=P.y;}}
      if(b.n>=(b.phase2?7:5)&&b.mt>1.7)bossEnd(b);}},
  // a turning spiral of vermilion darts
  sealSpiral:{start(b){b.mt=0;b.sub=0;b.fireT=0;b.spir=rnd(TAU);b.dur=b.phase2?3.2:2.5;},
    up(b,dt){b.fireT-=dt;
      if(b.fireT<=0){b.fireT=.16;b.spir+=.56;
        for(let i=0;i<5;i++)eproj(b.x,b.y,b.spir+i/5*TAU,196,10*b.dmgS,{kind:'ember',r:6,ttl:2.6});}
      if(b.mt>b.dur)bossEnd(b);}},
  // phase-two storm: stamps and crossfire braided together
  stampStorm:{start(b){b.mt=0;b.sub=0;b.n=0;b.a0=rnd(TAU);},
    up(b,dt){if(b.sub===0&&b.mt>.3){b.sub=1;b.mt=0;b.px=P.x;b.py=P.y;}
      if(b.sub===1){b.fireT-=dt;
        if(b.fireT<=0&&b.n<6){b.fireT=.22;b.n++;
          const x=clamp(b.px+rnd(-46,46),WALL+40,RW-WALL-40),y=clamp(b.py+rnd(-46,46),WALL+40,RH-WALL-40);
          addTele({x,y,r:56,dur:.62,dmg:15*b.dmgS,peril:true});
          setTimeoutGame(.62,()=>{splat(x,y,false);inkBurst(x,y,7,'#b3372a',.8);});
          if(b.n===3)for(let i=0;i<3;i++)addTele({kind:'line',x:P.x,y:P.y,ang:b.a0+i*PI/3,len:520,w:30,dur:.8,vis:true,peril:true});
          b.px=P.x;b.py=P.y;}}
      if(b.n>=6&&b.mt>2)bossEnd(b);}}};

// ---- the new foe AI -----------------------------------------------------------
// STORY2 owns the whole state machine for its cast (states reuse the engine's
// names so every shared visual — gold windups, peril kanji, posture bars,
// lunge squash — keeps working without a single change).

S.updateEnemy=function(e,dt,dp,angP,move,keepDist){
  const fire=(o)=>addTele(o);
  const R=Math.random;
  switch(e.state){
  case 'seek':
    if(e.type==='kitsune'){
      // read the player's swing and simply be elsewhere
      if(e.evCd<=0&&dp<130&&P.swing&&P.swing.t<.12){
        e.evCd=1.15;const side=e.side||(e.side=R()<.5?1:-1);
        const a=angP+PI/2*side;
        e.vx=Math.cos(a)*430;e.vy=Math.sin(a)*430;AU.dash();
        addPart({x:e.x,y:e.y,life:.3,max:.3,size:3,color:'rgba(181,85,44,0.5)'});
        return true;}
      move(P.x+Math.sin(e.bob*.5)*90,P.y+Math.cos(e.bob*.4)*70,.92);
      e.facing=lerp2(e.facing,angP,dt*7);
      if(dp<e.def.rng&&e.cd<=0){e.state='windup';e.t=e.def.wind*e.wMul;e.aim=angP;e.atkDone=false;e.peril=R()<e.def.peril;e.chainLeft=e.def.chain||0;}
      return true;}
    if(e.type==='wisp'){keepDist(e.def.keep,1.2);e.facing=lerp2(e.facing,angP,dt*5);
      if(dp<e.def.rng&&e.cd<=0){e.state='windup';e.t=e.def.wind*e.wMul;e.aim=angP;e.peril=R()<.3;}
      return true;}
    if(e.type==='doro'||e.type==='shishi'){move(P.x,P.y);
      e.facing=lerp2(e.facing,angP,dt*4);
      if(dp<e.def.rng&&e.cd<=0){e.state='windup';e.t=e.def.wind*e.wMul;e.aim=angP;e.chainLeft=e.def.chain||0;
        e.peril=e.type==='shishi'?false:R()<.2;
        if(e.type==='shishi'){e.crossA=angTo(e.x,e.y,P.x,P.y);}}
      return true;}
    if(e.type==='doroko'){move(P.x,P.y);e.facing=lerp2(e.facing,angP,dt*7);
      if(dp<e.def.rng&&e.cd<=0){e.state='windup';e.t=e.def.wind*e.wMul;e.peril=R()<.2;e.chainLeft=e.def.chain||0;}
      return true;}
    if(e.type==='suzume'){keepDist(e.def.keep,1.15);
      if(dp<200&&e.cd<=0){const a=angP+PI+R()*.6-.3;e.vx=Math.cos(a)*330;e.vy=Math.sin(a)*330;e.cd=.9;}
      e.facing=lerp2(e.facing,angP,dt*6);
      if(dp<e.def.rng&&e.cd<=0){e.state='windup';e.t=e.def.wind*e.wMul;e.aim=angP;e.shots=0;}
      return true;}
    if(e.type==='nekomata'){
      if(!e.stealth){e.stealth=true;e.hidden=true;inkBurst(e.x,e.y,8,'#3a3542',.7);}
      // stalk a flank, not the face
      const flank=angP+PI/2*(e.side||(e.side=R()<.5?1:-1));
      e.vx=lerp(e.vx,Math.cos(flank)*e.spd,1-Math.exp(-4*dt));
      e.vy=lerp(e.vy,Math.sin(flank)*e.spd,1-Math.exp(-4*dt));
      e.facing=lerp2(e.facing,angP,dt*5);
      if(dp<e.def.rng&&e.cd<=0){e.hidden=false;e.stealth=false;
        e.state='windup';e.t=e.def.wind*e.wMul;e.aim=angP;e.peril=R()<e.def.peril;AU.dash();}
      return true;}
    if(e.type==='kagura'){
      e.orbA=(e.orbA||0)+dt*3.1;
      move(P.x,P.y,.6);
      e.facing=lerp2(e.facing,angP,dt*4);
      // the orbit blades cut on contact — the engine draws them in drawExtra
      e.orbCd=(e.orbCd||0)-dt;
      if(e.orbCd<=0&&!P.dead)for(let i=0;i<3;i++){const a=e.orbA+i/3*TAU;
        const ox=e.x+Math.cos(a)*(e.r+22),oy=e.y+Math.sin(a)*(e.r+22);
        if(dist(ox,oy,P.x,P.y)<10+P.r){e.orbCd=.7;damagePlayer(e.dmg,e);break;}}
      if(e.cd<=0){e.state='windup';e.t=e.def.wind*e.wMul;e.aim=angP;}
      return true;}
    return true;
  case 'windup':
    e.vx*=Math.exp(-6*dt);e.vy*=Math.exp(-6*dt);
    if(e.t>e.def.wind*.35)e.aim=lerp2(e.aim,angP,dt*4);
    e.facing=lerp2(e.facing,e.aim||angP,dt*6);
    e.t-=dt;
    if(e.t<=0){
      if(e.type==='doro'){
        fire({x:e.x,y:e.y,r:e.def.aoe,dur:.7,dmg:e.dmg*(e.peril?1.35:1),peril:e.peril,src:e});
        e.state='recover';e.t=e.def.rec*DIFFI().rec;}
      else if(e.type==='shishi'){ // the cross beat: two lines through the player
        const a=e.crossA;
        fire({kind:'line',x:e.x,y:e.y,ang:a,len:430,w:30,dur:.85,vis:true,peril:false,src:e});
        fire({kind:'line',x:e.x,y:e.y,ang:a+PI/2,len:430,w:30,dur:.85,vis:true,peril:false,src:e,delay:.14});
        AU.stamp();
        e.state='recover';e.t=e.def.rec*DIFFI().rec;}
      else if(e.type==='wisp'){
        if(e.peril)fire({kind:'arc',x:e.x,y:e.y,ang:e.aim,r:170,spread:1.25,dur:.6,dmg:e.dmg*1.45,peril:true,src:e});
        for(let i=-1;i<=1;i++)eproj(e.x,e.y,e.aim+i*.22,200,e.dmg,{kind:'ember',r:6,ttl:2.2});
        AU.deflect();
        e.state='recover';e.t=e.def.rec*DIFFI().rec;}
      else if(e.type==='suzume'){
        e.state='active';e.t=.42;e.fireT=0;e.atkDone=false;}
      else if(e.type==='nekomata'){
        e.state='charging';e.t=.5;e.atkDone=false;AU.dash();}
      else if(e.type==='kagura'){ // the whirlflare: blades flare outward
        e.state='active';e.t=.5;e.flare=1;
        fire({x:e.x,y:e.y,r:e.r+66,dur:.55,dmg:e.dmg*1.2,peril:false,src:e});AU.swish();}
      else{e.state='active';e.t=.16;e.atkDone=false;}}
    return true;
  case 'active':
    if(e.type==='suzume'){e.fireT-=dt;
      if(e.fireT<=0&&e.shots<2){e.fireT=.2;e.shots++;
        eproj(e.x,e.y,e.aim+rnd(-.25,.25),238,e.dmg,{kind:'shard',r:5,hom:true,ttl:4});AU.deflect();}}
    else if(e.type==='kagura'){e.vx*=Math.exp(-3*dt);e.vy*=Math.exp(-3*dt);}
    else if(e.type==='kitsune'||e.type==='doroko'){
      const sp=e.type==='doroko'?420:520;
      e.vx=Math.cos(e.aim)*(e.peril?sp*1.2:sp);e.vy=Math.sin(e.aim)*(e.peril?sp*1.2:sp);
      if(!e.atkDone&&dist(e.x,e.y,P.x,P.y)<e.r+P.r+8){
        if(!e.peril&&parryUp())parrySuccess(e);
        else damagePlayer(e.dmg*(e.peril?1.4:1),e);
        e.atkDone=true;}}
    e.t-=dt;
    if(e.t<=0){e.state='recover';e.t=e.def.rec*DIFFI().rec+rnd(.22);e.cd=e.def.rec*DIFFI().rec;e.atkDone=false;}
    return true;
  case 'charging': // nekomata pounce — a long red dash through the player's old spot
    e.vx=Math.cos(e.aim)*640;e.vy=Math.sin(e.aim)*640;
    if(!e.atkDone&&!P.dead&&dist(e.x,e.y,P.x,P.y)<e.r+P.r+8){
      if(!e.peril&&parryUp())parrySuccess(e);
      else damagePlayer(e.dmg*(e.peril?1.45:1),e);
      e.atkDone=true;}
    if((G.t*60|0)%3===0)addPart({x:e.x,y:e.y,life:.24,max:.24,size:2.6,color:'rgba(58,53,66,0.55)'});
    e.t-=dt;
    if(e.t<=0){e.state='recover';e.t=e.def.rec*DIFFI().rec+rnd(.2);e.cd=e.def.rec*DIFFI().rec;e.atkDone=false;}
    return true;
  case 'recover':
    e.vx*=Math.exp(-4*dt);e.vy*=Math.exp(-4*dt);e.t-=dt;
    if(e.t<=0){
      if(e.type==='nekomata'&&R()<.6){e.state='seek';e.cd=.5;return true;} // vanish again
      if(e.chainLeft>0&&dist(e.x,e.y,P.x,P.y)<e.def.rng*1.7&&R()<.7){
        e.chainLeft--;e.state='windup';e.atkDone=false;
        e.peril=R()<((e.def.peril||0)*.5);
        e.t=e.def.wind*e.wMul*.85;}
      else{e.state='seek';e.cd=e.def.rec*DIFFI().rec+rnd(.15);}}
    return true;}
  return false;};

// extra paint the shared drawEnemy cannot know about: orbits, flares, glows.
// NOTE: drawEnemy calls this inside its own translated context (origin at the
// enemy's feet, no facing rotation) — so every coordinate here is LOCAL.
S.drawExtra=function(e){
  if(!e||e.dead)return;
  if(e.type==='kagura'||(e.boss&&e.orbs)){
    const isK=e.type==='kagura';
    const n=isK?3:e.orbs.n,rad=isK?(e.r+22):e.orbs.rad,ang=isK?e.orbA:e.orbs.ang;
    for(let i=0;i<n;i++){const a=ang+i/n*TAU;
      ctx.save();ctx.translate(Math.cos(a)*rad,Math.sin(a)*rad);ctx.rotate(a+PI/2);
      ctx.globalAlpha=.9;
      ctx.fillStyle=isK?'#c9932a':'#e2c86a';
      ctx.beginPath();ctx.moveTo(9,0);ctx.lineTo(-3,-4.4);ctx.lineTo(0,0);ctx.lineTo(-3,4.4);ctx.closePath();ctx.fill();
      ctx.strokeStyle=isK?'#8c6d1f':'#a8862e';ctx.lineWidth=1;ctx.stroke();
      ctx.restore();}
    ctx.globalAlpha=1;}
  if(e.type==='kagura'&&e.state==='active'){ // the flare ring
    ctx.strokeStyle=RED2;ctx.globalAlpha=.55;ctx.lineWidth=2.4;
    ctx.beginPath();ctx.arc(0,0,(e.r+22)+16,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
  if(e.type==='wisp'){ctx.globalAlpha=.4+.25*Math.sin(e.bob*2);
    ctx.drawImage(glowEmber,-22,-26,44,44);ctx.globalAlpha=1;}
  if(e.type==='nekomata'&&e.hidden){ // the shimmer: a ripple in the grass
    const a=.12+.1*Math.sin(G.t*7+e.bob);
    ctx.strokeStyle='#7c8494';ctx.globalAlpha=a;ctx.lineWidth=1.4;
    ctx.beginPath();ctx.ellipse(0,0,10+Math.sin(G.t*5)*3,5,0,0,TAU);ctx.stroke();
    ctx.globalAlpha=a*.8;
    ctx.beginPath();ctx.ellipse(0,-4,6,2.6,0,0,TAU);ctx.stroke();
    ctx.globalAlpha=1;}
  if(e.type==='shishi'&&e.state==='windup'){ // the drum tightens
    const k=clamp(1-e.t/((e.def.wind||.85)*e.wMul),0,1);
    ctx.strokeStyle='#c9932a';ctx.globalAlpha=.3+.5*k;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(0,0,e.r+6+k*8,0,TAU);ctx.stroke();ctx.globalAlpha=1;}};

// the doro splits on death — the whole fight was hiding two smaller ones
S.onKill=function(e){
  if(e.type==='doro'&&!e.dorokoDone){
    const n=2;
    for(let i=0;i<n;i++){
      const a=rnd(TAU);
      G.marks.push({type:'doroko',x:clamp(e.x+Math.cos(a)*44,WALL+30,RW-WALL-30),
        y:clamp(e.y+Math.sin(a)*44,WALL+30,RH-WALL-30),elite:false,t:-i*.15,dur:.65});}
    addFloat(e.x,e.y-24,'泥 ×2',INK2,13);}};

// ---- AKANE 茜, the brush-dancer -----------------------------------------------

S.setupPlayer=function(p){
  if(!SAVE)return;
  if(!SAVE.weapons.fude){SAVE.weapons.fude=true;} // the brush is hers, always
  p.weapon='fude';
  p.ownedWeapons=['fude'].concat(WKEYS.filter(w=>SAVE.weapons[w]&&w!=='fude'));
};

// her body answers differently: lighter, faster, a shorter parry, momentum
S.recalc=function(p){
  p.maxhp=Math.round(p.maxhp*.9)-4; // the lighter walk
  p.st.spd*=1.13;
  p.st.parryW*=.88;
  if(p.hp>p.maxhp)p.hp=p.maxhp;};

S.momentum=function(){ // speed is her edge — standing still is her cost
  if(!P||!P.st)return 0;
  return clamp(Math.hypot(P.vx,P.vy)/(P.st.spd||258),0,1);};

S.doArt=function(){ // 紅潮 the crimson tide: three rows of red ink in a wide fan
  const base=P.facing;
  for(let row=0;row<3;row++)for(let i=-4;i<=4;i++){
    fproj(P.x,P.y,base+i*.16,380+row*70,row===2?16:11,{r:10});}
  G.slashes.push({ang:base,spread:2.6,range:150,t:0,dur:.3,flip:false});
  G.fx.push({kind:'kanji',txt:'紅',x:P.x,y:P.y-40,t:0,dur:.6});
  AU.zap();trauma(.4);};

// the great brush, drawn in her hand
S.drawFude=function(c,o){
  // haft of dark bamboo, then the loaded vermilion tuft
  const shx=Math.cos(o.ba)*(8-o.bl*.34),shy=Math.sin(o.ba)*(8-o.bl*.34);
  const hxx=Math.cos(o.ba)*(10+o.bl*.7),hyy=Math.sin(o.ba)*(10+o.bl*.7);
  caps(c,shx,shy,hxx,hyy,2.6,'#4a3f28');
  // ferrule: red cord
  for(let i=0;i<3;i++){const t=(i+1)/4;
    c.strokeStyle=RED;c.lineWidth=1.6;
    c.beginPath();
    c.moveTo(Math.cos(o.ba)*(10+o.bl*.6*t)-Math.sin(o.ba)*2.4,Math.sin(o.ba)*(10+o.bl*.6*t)+Math.cos(o.ba)*2.4);
    c.lineTo(Math.cos(o.ba)*(10+o.bl*.6*t)+Math.sin(o.ba)*2.4,Math.sin(o.ba)*(10+o.bl*.6*t)-Math.cos(o.ba)*2.4);
    c.stroke();}
  // the tuft itself: a tapered brush of red ink, darker at the tip
  const tx2=Math.cos(o.ba),ty2=Math.sin(o.ba),nx=-ty2,ny=tx2;
  c.fillStyle=o.gold?'#c9932a':RED;
  c.beginPath();
  c.moveTo(hxx+nx*4,hyy+ny*4);
  c.quadraticCurveTo(o.tx*.5+nx*6,o.ty*.5+ny*6,o.tx+tx2*6,o.ty+ty2*6);
  c.quadraticCurveTo(o.tx*.5-nx*6,o.ty*.5-ny*6,hxx-nx*4,hyy-ny*4);
  c.closePath();c.fill();
  c.fillStyle=o.gold?'#e0b45a':'#8c2b1f';
  c.beginPath();
  c.moveTo(o.tx*.62+nx*3.4,o.ty*.62+ny*3.4);
  c.quadraticCurveTo(o.tx+tx2*7,o.ty+ty2*7,o.tx*.62-nx*3.4,o.ty*.62-ny*3.4);
  c.quadraticCurveTo(o.tx*.7,o.ty*.7,o.tx*.62+nx*3.4,o.ty*.62+ny*3.4);
  c.closePath();c.fill();
  // a bead of ink at the tip when charged
  if(P.ki>=100){c.fillStyle=RED;c.globalAlpha=.6+.4*Math.sin(G.t*8);
    c.beginPath();c.arc(o.tx+tx2*8,o.ty+ty2*8,3.2,0,TAU);c.fill();c.globalAlpha=1;}};

// her palette: vermilion kimono, gold obi, black hair with the red ribbon
S.palette=function(){
  return{cloakA:'rgba(74,26,26,',cloakB:'rgba(56,20,20,',
    torso:'#8c3a2f',obi:GOLD,obiW:4.2,
    hair:'#241b1c',ribbon:RED};};

// her head: black hair, a bun, the ribbon — no straw hat
S.drawHead=function(c,fa,rimA){
  const kx=Math.cos(fa)*2.6,ky=Math.sin(fa)*2.6;
  const pal=S.palette();
  c.fillStyle=pal.hair;
  c.beginPath();c.ellipse(kx,ky,12.5,10.8,fa,0,TAU);c.fill();
  c.strokeStyle='rgba(246,241,226,0.22)';c.lineWidth=1.6;
  c.beginPath();c.ellipse(kx,ky,11.4,9.8,fa,rimA-fa-.6,rimA-fa+.6);c.stroke();
  // the bun, behind and above
  c.fillStyle=pal.hair;
  c.beginPath();c.arc(kx-Math.cos(fa)*4,ky-Math.sin(fa)*4-4,4.6,0,TAU);c.fill();
  // the ribbon answers the wind
  c.strokeStyle=pal.ribbon;c.lineWidth=2.2;c.lineCap='round';
  const wag=Math.sin(G.t*7)*.4;
  c.beginPath();
  c.moveTo(kx-Math.cos(fa)*6,ky-Math.sin(fa)*6-3);
  c.quadraticCurveTo(kx-Math.cos(fa)*13,ky-Math.sin(fa)*13-7+wag*4,kx-Math.cos(fa)*19,ky-Math.sin(fa)*19-10+wag*7);
  c.stroke();};

// ---- the floors of the vermilion road (acts 11..16) ---------------------------

S.buildFloor=function(act,g,seed){
  const TAU2=Math.PI*2;
  if(act===11){ // vermilion fields: warm wash + fallen leaves pressed into the page
    g.fillStyle='rgba(196,90,52,0.10)';g.fillRect(0,0,RW,RH);
    for(let i=0;i<26;i++){const x=hash01(seed+i*3)*RW,y=hash01(seed+i*7)*RH;
      g.save();g.translate(x,y);g.rotate(hash01(seed+i)*TAU2);
      g.fillStyle=i%3?'rgba(181,85,44,0.20)':'rgba(140,60,34,0.16)';
      g.beginPath();g.moveTo(6,0);g.quadraticCurveTo(1,-5,-6,-1);g.quadraticCurveTo(-2,2,6,0);g.closePath();g.fill();
      g.restore();}
    g.strokeStyle='rgba(150,120,70,0.3)';g.lineWidth=1.6;
    for(let i=0;i<12;i++){const x=hash01(seed+90+i*11)*RW,y=hash01(seed+91+i*13)*RH;
      for(let j=0;j<3;j++){g.beginPath();g.moveTo(x+j*6,y);
        g.quadraticCurveTo(x+j*6+rnd(-3,3),y-10,x+j*6+rnd(-4,4),y-rnd(16,26));g.stroke();}}}
  else if(act===12){ // the lantern river: indigo water, plank weirs, reflection pools
    g.fillStyle='rgba(36,48,76,0.30)';g.fillRect(0,0,RW,RH);
    for(let i=0;i<10;i++)inkBlob(g,hash01(seed+i*3)*RW,hash01(seed+i*7)*RH,rnd(70,150),'rgba(24,34,58,0.22)',seed+i);
    g.strokeStyle='rgba(160,176,204,0.14)';g.lineWidth=1.6;
    for(let i=0;i<16;i++){const x=hash01(seed+40+i*5)*RW,y=hash01(seed+41+i*9)*RH;
      g.beginPath();g.ellipse(x,y,rnd(26,72),rnd(7,16),0,0,TAU2);g.stroke();}
    g.strokeStyle='rgba(90,70,50,0.4)';g.lineWidth=3.4;
    for(let i=0;i<7;i++){const x=hash01(seed+80+i*7)*RW,y=hash01(seed+81+i*3)*RH;
      g.beginPath();g.moveTo(x-46,y);g.lineTo(x+46,y);g.stroke();}}
  else if(act===13){ // the hollow court: deep green shade, root-veined ground
    g.fillStyle='rgba(30,54,34,0.16)';g.fillRect(0,0,RW,RH);
    for(let i=0;i<20;i++){const x=hash01(seed+i*3)*RW,y=hash01(seed+i*7)*RH;
      g.strokeStyle='rgba(70,110,70,0.30)';g.lineWidth=rnd(4,8);g.lineCap='round';
      g.beginPath();g.moveTo(x,y-46);g.lineTo(x+rnd(-8,8),y+46);g.stroke();
      g.strokeStyle='rgba(46,84,52,0.28)';g.lineWidth=1.6;
      g.beginPath();g.moveTo(x-4,y-4);g.quadraticCurveTo(x-22,y,x-30,y+12);g.stroke();
      g.beginPath();g.moveTo(x+4,y+6);g.quadraticCurveTo(x+24,y+10,x+32,y+22);g.stroke();}}
  else if(act===14){ // the silver grass sea: pale wash, comb-rows of grass
    g.fillStyle='rgba(210,206,180,0.22)';g.fillRect(0,0,RW,RH);
    g.strokeStyle='rgba(150,148,120,0.4)';g.lineWidth=1.4;
    for(let i=0;i<30;i++){const x=hash01(seed+i*3)*RW,y=hash01(seed+i*7)*RH;
      for(let j=-2;j<=2;j++){g.beginPath();g.moveTo(x+j*5,y+10);
        g.quadraticCurveTo(x+j*5+rnd(-4,4),y-8,x+j*6+rnd(-6,6),y-rnd(14,24));g.stroke();}}
    g.strokeStyle='rgba(120,118,92,0.22)';g.lineWidth=2;
    for(let i=0;i<5;i++){const y=RH*(.15+i*.2);
      g.beginPath();g.moveTo(0,y);
      for(let x=0;x<=RW;x+=140)g.quadraticCurveTo(x+70,y+Math.sin(x*.01+i)*30,x+140,y);g.stroke();}}
  else if(act===15){ // the ashfall court: grey drifts, ember veins, scorch rings
    g.fillStyle='rgba(112,104,94,0.16)';g.fillRect(0,0,RW,RH);
    for(let i=0;i<22;i++)inkBlob(g,hash01(seed+i*3)*RW,hash01(seed+i*7)*RH,rnd(24,66),'rgba(88,82,74,0.14)',seed+i);
    g.strokeStyle='rgba(50,44,38,0.4)';g.lineWidth=2;
    for(let i=0;i<14;i++){const x=hash01(seed+60+i*5)*RW,y=hash01(seed+61+i*7)*RH;
      g.beginPath();g.moveTo(x,y);g.lineTo(x+rnd(-28,28),y-rnd(6,18));g.stroke();}
    for(let i=0;i<4;i++){const x=hash01(seed+95+i*17)*RW,y=hash01(seed+96+i*19)*RH;
      const gr=g.createRadialGradient(x,y,0,x,y,120);
      gr.addColorStop(0,'rgba(201,118,46,0.14)');gr.addColorStop(1,'rgba(201,118,46,0)');
      g.fillStyle=gr;g.beginPath();g.arc(x,y,120,0,TAU2);g.fill();}}
  else if(act===16){ // the sealed blank: white page, faint grid, red seals drying
    g.fillStyle='rgba(251,247,236,0.60)';g.fillRect(0,0,RW,RH);
    g.strokeStyle='rgba(70,70,84,0.08)';g.lineWidth=1;
    for(let i=0;i<9;i++){const x=hash01(seed+i*13)*RW,y=hash01(seed+i*17)*RH;
      g.strokeRect(x-16,y-22,32,44);}
    for(let i=0;i<7;i++){const x=hash01(seed+70+i*7)*RW,y=hash01(seed+71+i*11)*RH;
      g.save();g.translate(x,y);g.rotate(rnd(-.3,.3));
      g.strokeStyle='rgba(179,55,42,0.16)';g.lineWidth=2.4;
      g.strokeRect(-14,-14,28,28);
      g.fillStyle='rgba(179,55,42,0.10)';
      g.fillRect(-11,-11,22,22);g.restore();}
    g.strokeStyle='rgba(74,68,60,0.1)';g.lineWidth=1.2;
    g.beginPath();g.moveTo(RW*.1,RH*.5);g.quadraticCurveTo(RW*.5,RH*.42,RW*.9,RH*.52);g.stroke();}};

S.buildProps=function(act){
  const pr=[];
  const n=act===16?24:(act===14?46:36);
  for(let i=0;i<n;i++){
    const x=WALL+40+hash01(act*99+i*1.7)*(RW-WALL*2-80);
    const y=WALL+40+hash01(act*131+i*2.3)*(RH-WALL*2-80);
    if(dist(x,y,RW/2,RH*.68)<120)continue;
    const kind=act===11?'maple':act===12?'lreed':act===13?'hollow':act===14?'sgrass':act===15?'cinder':'sealstone';
    pr.push({x,y,ph:hash01(i*7.3)*TAU,h:kind==='hollow'?rnd(70,130):rnd(18,46),kind});}
  G.props=pr;
  G.fireflies=[];
  G.ripples=[];
  if(act===12||act===13||act===16){
    for(let i=0;i<(IS_TOUCH?6:9);i++)G.fireflies.push({x:rnd(WALL,RW-WALL),y:rnd(WALL,RH-WALL),ph:rnd(TAU),sp:rnd(.4,1)});}};

S.drawWeather=function(act){
  const n=Math.round((act===15?20:(act===11?16:(act===14?14:(act===12?14:(act===16?16:12)))))*(IS_TOUCH?.6:1));
  for(let i=0;i<n;i++){
    const seed=i*1.618;
    if(act===11){ // red maple leaves ride the dawn wind
      const t=(G.t*(30+hash01(seed)*24)+hash01(seed*3)*RH*2)%(RH+80);
      const x=hash01(seed*7)*RW+Math.sin(G.t*.7+seed)*54+G.wind*44;
      ctx.save();ctx.translate(x,RH-t);ctx.rotate(G.t*1.8+seed);
      ctx.globalAlpha=.5*(1-t/(RH+80));
      ctx.fillStyle=i%3?'#b5552c':RED;
      ctx.beginPath();ctx.moveTo(5,0);ctx.lineTo(0,-4.4);ctx.lineTo(-5,0);ctx.lineTo(0,4.4);ctx.closePath();ctx.fill();
      ctx.restore();}
    else if(act===12){ // pale spores drift over the water
      const t=(G.t*(20+hash01(seed)*14)+hash01(seed*3)*RH*2)%(RH+40);
      const x=hash01(seed*7)*RW+Math.sin(G.t*.5+seed)*30+G.wind*30;
      ctx.globalAlpha=.2+(1-t/(RH+40))*.2;
      ctx.fillStyle=i%2?'#c8d2e4':'#9aa8c4';
      ctx.beginPath();ctx.arc(x,t-20,1.2+hash01(seed)*1.6,0,TAU);ctx.fill();}
    else if(act===13){ // hollow leaves, dark green, slow
      const t=(G.t*(22+hash01(seed)*16)+hash01(seed*3)*RH*2)%(RH+60);
      const x=hash01(seed*7)*RW+Math.sin(G.t*.6+seed)*40;
      ctx.save();ctx.translate(x,RH-t);ctx.rotate(G.t*1.4+seed);
      ctx.globalAlpha=.4*(1-t/(RH+60));
      ctx.fillStyle=i%2?'#4c7a4c':'#6b9a5b';
      ctx.beginPath();ctx.ellipse(0,0,4,1.8,.5,0,TAU);ctx.fill();ctx.restore();}
    else if(act===14){ // silver pollen streams on the wind
      const t=(G.t*(36+hash01(seed)*26)+hash01(seed*3)*RH*2)%(RH+40);
      const x=hash01(seed*7)*RW+Math.sin(G.t*.8+seed)*36+G.wind*60;
      ctx.globalAlpha=.3*(1-t/(RH+40))+.08;
      ctx.fillStyle=i%2?'#d8d4b0':'#f0ead8';
      ctx.beginPath();ctx.arc(x,RH-t,.8+hash01(seed*2)*1.4,0,TAU);ctx.fill();}
    else if(act===15){ // ash falls, embers rise
      if(i%3===0){const t=(G.t*(34+i*2)+hash01(seed*3)*1300)%1300;
        ctx.globalAlpha=.55*(1-t/1300);ctx.fillStyle=RED;
        ctx.beginPath();ctx.arc(hash01(seed*7)*RW+Math.sin(G.t+seed)*26,RH-t,1.8,0,TAU);ctx.fill();}
      else{const t=(G.t*(26+hash01(seed)*20)+hash01(seed*3)*RH*2)%(RH+40);
        ctx.globalAlpha=.36*(1-t/(RH+40));
        ctx.fillStyle='#6a655c';
        ctx.beginPath();ctx.arc(hash01(seed*7)*RW+Math.sin(G.t*.4+seed)*26+G.wind*30,RH-t,1.4+hash01(seed)*1.8,0,TAU);ctx.fill();}}
    else{ // act 16: vermilion motes rise off the blank page
      const t=(G.t*(16+hash01(seed)*12)+hash01(seed*3)*RH*2)%(RH+40);
      const x=hash01(seed*7)*RW+Math.sin(G.t*.4+seed)*24+G.wind*24;
      ctx.globalAlpha=.2+(1-t/(RH+40))*.24;
      ctx.fillStyle=i%3?RED:RED2;
      ctx.beginPath();ctx.arc(x,t-20,1+hash01(seed)*1.5,0,TAU);ctx.fill();}}
  ctx.globalAlpha=1;
  if(act===12)drawRipples();};

// the HUD asks the story for its own label
S.roadLabel=function(run,sd){
  return 'THE VERMILION ROAD 朱 · act '+run.act+'/6 · '+(sd.n||'')+' · AKANE 茜';};

return S;})();
