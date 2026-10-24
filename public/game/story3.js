// ============================================================================
// SUMIKIRI — STORY 3: THE LAST PAGE 「終路」
// update 3.0 · the final campaign — the road every road was pointing at
//
// Both stories are walked, both inks are dry — and the page itself wakes.
// Everything it ever drew comes back in one last parade, and at the end of
// the margin stands the AUTHOR: the hand that draws both roads, holding a
// brush in one hand and a blade in the other. The last page is walked by
// whichever hand the player trusts — the ronin's steel or Akane's tide —
// because the author writes for both.
//
// Gated behind story-3 act numbers 17..19. The cast is drawn from BOTH
// roads (the page remembers everything), so no new foot-soldiers are
// needed — only three keepers:
//   · UZU, REDRAWN      — the first duel the page ever drew, called back rougher
//   · GINRO, HALF-ERASED — the silver alpha, recalled in cheaper ink
//   · HAKUSHI 白紙        — the author of the blank page. the true end.
//
// Like story2.js: pure content + behavior, loaded BEFORE the engine script,
// everything engine-side resolved lazily.
// ============================================================================

window.STORY3=(function(){
'use strict';
const S={};

// ---- the story itself -------------------------------------------------------

S.meta={
  name:'THE LAST PAGE',kan:'終',romaji:'SHŪNO MICHI',
  nActs:3,
  note:'the finale — walk it with the hand you trust'};

// ---- the three acts of the last page (act numbers 17..19) ---------------------
//
// act i — the unwritten margin: the quiet rim of the page, where both
//          roads' small hours come back to see who is still walking.
// act ii — the hundred parade: everything the ink ever drew, walking at
//          once, in rougher strokes than it was born with.
// act iii— the last page: no more road. the author's desk, the inkstone,
//          and the hand that writes.

S.acts=[
{name:'The Unwritten Margin',kanji:'白',intro:['The roads end. The page begins.','Both inks stir at once —','the margin remembers you.'],stages:[
 {n:'Waking Margins',w:['kappa*3,kitsune*2','hound*3,suzume*2']},
 {n:'The First Strokes',w:['wisp*2,kappa*2,hound*2','nekomata*2,suzume*2,kitsune*3']},
 {n:'The Sketch Returns',w:['tengu*2,doro*1,wisp*2','archer*2,shishi*1,nekomata*2']},
 {n:'The Whirlpool, Redrawn',duel:'uzu3'}]},
{name:'The Hundred Parade',kanji:'百',intro:['Everything the page ever drew','walks tonight, in one parade —','and all of it knows your name.'],stages:[
 {n:'Everything Drawn, Walking',w:['oni*2,ronin*1,archer*2','kagura*2,shishi*1,doro*2']},
 {n:'The Long Procession',w:['ronin*2,mirror*1,sorc*2,hound*2','nekomata*3,kagura*2,suzume*3']},
 {n:"The Parade's Edge",w:['oni*2,kagura*2,archer*3,shishi*1','mirror*2,ronin*2,wisp*3,tengu*2']},
 {n:'The Alpha, Half-Erased',boss:'ginro3'}]},
{name:'The Last Page',kanji:'終',intro:['No more road. No more ink.','Only the hand that writes,','and the hand that cuts.'],stages:[
 {n:'The Margin Thins',w:['ronin!*1,oni*2,mirror*2,kitsune*2','kagura*2,shishi*2,sorc*2,archer*2']},
 {n:"The Author's Escort",w:['tengu*3,ronin*2,kagura*2,nekomata*2','oni*3,mirror*2,kagura*2,suzume*3']},
 {n:'The Author of the Blank',boss:'hakushi'}]}];

// ---- the keepers of the last page --------------------------------------------

S.bosses={
  uzu3:{name:'Uzu, the Whirlpool Redrawn',kanji:'渦',hp:440,r:26,spd:126,touch:7,duel:1,s3:1,
    moves:['blinkStrike','gust','chainDash','mirrorDash']},
  ginro3:{name:'Ginro, the Alpha Half-Erased',kanji:'狼',hp:800,r:32,spd:112,touch:9,s3:1,
    moves:['dashWeb','howlPull','lunarBolts','chainDash','mirrorDash']},
  hakushi:{name:'Hakushi, the Author of the Blank',kanji:'白',hp:1850,r:34,spd:106,touch:10,phased:true,s3:1,
    summon:'mirror',
    moves:['blinkStrike','stampRain','lunarBolts','orbitals','inkRain'],
    moves2:['stampStorm','novaChain','mirrorDash','homingVolley','spiralBurst','inkRain','wave']}};

// ---- one mechanic the author keeps for itself ---------------------------------
// ink rain: the page itself is stamped blank in a falling field, wider and
// heavier than any rain either road knew. it is the author, erasing.

S.bossMoves={
  inkRain:{start(b){b.mt=0;b.sub=0;},
    up(b,dt){
      if(b.sub===0&&b.mt>.5){b.sub=1;b.mt=0;
        const n=b.phase2?13:9;
        for(let i=0;i<n;i++)addTele({x:clamp(P.x+rnd(-340,340),WALL+50,RW-WALL-50),
          y:clamp(P.y+rnd(-260,260),WALL+50,RH-WALL-50),r:60,dur:.92,dmg:16*b.dmgS,delay:i*.09});
        AU.roar();}
      if(b.sub===1&&b.mt>1.7)bossEnd(b);}}};

// ---- the painters -------------------------------------------------------------
// the first two keepers are REDRAWN from the page's own memory: their old
// sprites are re-stamped, then partly erased with the author's rubber —
// paper shows through the wounds, a red seal is pressed where they broke,
// and the sketch lines that held them survive. hakushi is painted whole.

S.bossPainters={};

// redrawn(src): stamp the old baked sprite, then erase and re-seal it
function redrawn(src){
  return function(g){
    const sp=(typeof BSPR!=='undefined'&&BSPR&&BSPR[src])?BSPR[src]:null;
    const sz=sp?sp.s:150;
    if(sp)g.drawImage(sp.n,-sz/2,-sz/2,sz,sz);
    // the rubber passes: soft paper holes where the memory failed
    g.save();
    g.globalCompositeOperation='destination-out';
    const holes=[[-38,-16,17],[-28,22,13],[46,-26,9],[8,34,11],[-12,-34,8]];
    for(const[hx,hy,hr]of holes){
      const gr=g.createRadialGradient(hx,hy,0,hx,hy,hr);
      gr.addColorStop(0,'rgba(0,0,0,0.85)');gr.addColorStop(1,'rgba(0,0,0,0)');
      g.fillStyle=gr;g.beginPath();g.arc(hx,hy,hr,0,TAU);g.fill();}
    g.restore();
    // sketch lines hold what the eraser missed — the rougher redraw
    g.strokeStyle='rgba(29,26,22,0.34)';g.lineWidth=1.1;g.lineCap='round';
    g.beginPath();g.ellipse(-2,0,30,21,0,-.5,1.1);g.stroke();
    g.beginPath();g.ellipse(-2,0,30,21,0,2.2,3.6);g.stroke();
    g.beginPath();g.moveTo(30,-24);g.lineTo(44,-30);g.stroke();
    // the red seal pressed where it cracked — every redrawn thing carries it
    g.save();g.translate(-6,6);g.rotate(-.22);
    g.strokeStyle='rgba(179,55,42,0.72)';g.lineWidth=1.8;g.strokeRect(-7,-7,14,14);
    g.fillStyle='rgba(179,55,42,0.26)';g.fillRect(-5,-5,10,10);
    g.restore();
    // one wet stroke of the author's vermilion across the shoulder
    g.strokeStyle='rgba(179,55,42,0.5)';g.lineWidth=2.6;g.lineCap='round';
    g.beginPath();g.moveTo(26,-14);g.quadraticCurveTo(40,-6,50,2);g.stroke();};
}
S.bossPainters.uzu3=redrawn('uzu');
S.bossPainters.ginro3=redrawn('ginro');

// hakushi 白紙 — the author of the blank page: a tall calligrapher in white,
// brush in the high hand, steel in the low one, a black hood-ring around a
// blank mask with one red seal for an eye, an unfinished enso for a halo.
S.bossPainters.hakushi=function(g){
  // the halo: the enso it never finished — the whole fight is inside one stroke
  g.strokeStyle='rgba(179,55,42,0.30)';g.lineWidth=3.2;g.lineCap='round';
  g.beginPath();g.arc(-2,0,36,.5,5.7);g.stroke();
  g.strokeStyle='rgba(29,26,22,0.10)';g.lineWidth=5;
  g.beginPath();g.arc(-2,0,36,.4,.55);g.stroke();
  // the sleeves that trail into strokes — ragged, longer than any keeper's
  g.fillStyle='rgba(240,234,216,0.92)';
  g.beginPath();g.moveTo(-6,-11);g.quadraticCurveTo(-46,-30,-62,-16);
  g.quadraticCurveTo(-44,-10,-8,-4);g.closePath();g.fill();
  g.beginPath();g.moveTo(-6,11);g.quadraticCurveTo(-46,30,-62,16);
  g.quadraticCurveTo(-44,10,-8,4);g.closePath();g.fill();
  g.strokeStyle='rgba(29,26,22,0.30)';g.lineWidth=1;
  for(let i=0;i<3;i++){
    g.beginPath();g.moveTo(-14-i*6,-12-i*4);g.quadraticCurveTo(-38-i*4,-20-i*4,-58-i*2,-14-i*3);g.stroke();
    g.beginPath();g.moveTo(-14-i*6,12+i*4);g.quadraticCurveTo(-38-i*4,20+i*4,-58-i*2,14+i*3);g.stroke();}
  // the torn hem: cloth cut to points, not hemmed
  g.fillStyle='rgba(240,234,216,0.6)';
  g.beginPath();g.moveTo(-10,-8);g.lineTo(-18,-14);g.lineTo(-15,-6);g.closePath();g.fill();
  g.beginPath();g.moveTo(-10,8);g.lineTo(-18,14);g.lineTo(-15,6);g.closePath();g.fill();
  // the body: white robe, ink collar, vermilion obi
  oBlob(g,-2,0,26,20,'#f0ead8');
  sheen(g,-4,-7,22,16,'rgba(255,255,255,0.32)');
  g.strokeStyle='rgba(29,26,22,0.5)';g.lineWidth=1.4;
  g.beginPath();g.ellipse(-2,0,24,18,0,.8,2.3);g.stroke();
  g.strokeStyle='rgba(179,55,42,0.62)';g.lineWidth=2;
  g.beginPath();g.moveTo(-16,-7);g.quadraticCurveTo(0,-12,16,-6);g.stroke();
  // the head: black hood-ring, blank paper mask, one seal for an eye
  oBlob(g,8,0,14.5,11.5,'#1d1a16');
  oBlob(g,14,0,10.5,8.5,'#fbf7ec');
  g.strokeStyle='rgba(29,26,22,0.44)';g.lineWidth=1.1;
  g.beginPath();g.ellipse(14,0,10.5,8.5,0,0,TAU);g.stroke();
  // the seal-eye: vermilion paste, pressed crooked
  g.save();g.translate(16,0);g.rotate(-.3);
  g.fillStyle=RED;g.fillRect(-2.6,-2.6,5.2,5.2);
  g.restore();
  glare(g,17,0,1.5,RED,2.2); // it looks with a stamp
  // the high hand: the great brush, drawn last night and never cleaned
  caps(g,18,9,52,24,4.2,'#241f1c');
  for(let i=0;i<3;i++){const t=(i+1)/4;
    g.strokeStyle=RED;g.lineWidth=1.5;
    g.beginPath();
    g.moveTo(18+34*t-2,9+15*t+2);g.lineTo(18+34*t+2,9+15*t-2);
    g.stroke();}
  const bx=52,by=24,tx=72,ty=32,nx=-(ty-by),ny=tx-bx,ll=Math.hypot(nx,ny);
  g.fillStyle=RED;
  g.beginPath();
  g.moveTo(bx+nx/ll*4.6,by+ny/ll*4.6);
  g.quadraticCurveTo(bx+(tx-bx)*.5+nx/ll*7,by+(ty-by)*.5+ny/ll*7,tx+ (tx-bx)/ll*6,ty+(ty-by)/ll*6);
  g.quadraticCurveTo(bx+(tx-bx)*.5-nx/ll*7,by+(ty-by)*.5-ny/ll*7,bx-nx/ll*4.6,by-ny/ll*4.6);
  g.closePath();g.fill();
  g.fillStyle=RED2;
  g.beginPath();
  g.moveTo(tx+(tx-bx)/ll*4,ty+(ty-by)/ll*4);
  g.quadraticCurveTo(tx+(tx-bx)/ll*8,ty+(ty-by)/ll*8,bx+(tx-bx)*.72-nx/ll*3.4,by+(ty-by)*.72-ny/ll*3.4);
  g.quadraticCurveTo(bx+(tx-bx)*.72,by+(ty-by)*.72,tx+(tx-bx)/ll*4,ty+(ty-by)/ll*4);
  g.closePath();g.fill();
  // ink drips off the tuft — the author is writing while it fights
  g.fillStyle='rgba(29,26,22,0.55)';
  g.beginPath();g.arc(66,38,1.6,0,TAU);g.fill();
  g.beginPath();g.arc(61,44,1.1,0,TAU);g.fill();
  // the low hand: the blade it kept from the first road
  steel(g,16,-8,46,-22,3.2);
  oBlob(g,20,-10,2.6,2.2,'#1d1a16'); // the tsuba
  // the verdict it carries, unstamped: a red square, floating empty
  g.save();g.translate(8,18);g.rotate(.18);
  g.strokeStyle=RED;g.lineWidth=1.6;g.strokeRect(-6,-6,12,12);
  g.restore();};

// ---- the codex: the last three cards the page will file ----------------------

S.codex={
  uzu3:{no:'36',cls:'DUEL · REDRAWN',st:[4,3,4],
    d:'The first duel the page ever drew, called back from the margin in rougher ink. Half of it is eraser-holes and sketch lines — it fights faster for what it lost.',
    a:[['Blink Strike','it arrives beside you mid-breath — the gold flash can be turned','d'],
      ['Chain Dash','three red dashes in a row — dash through, never away','p'],
      ['Mirror Dash','it did not know this one on the ink road — the page redraws with everything it has since learned','d']]},
  ginro3:{no:'37',cls:'KEEPER · HALF-ERASED',st:[4,4,4],
    d:'The silver alpha, recalled in cheaper ink. The eraser took its flank and one shoulder; the red seal is pressed where it cracked. It still herds. It still howls.',
    a:[['Dash Web','red lines pin the field — the gaps are the only road','p'],
      ['Howl Pull','the howl drags you toward its teeth — dash against the pull','p'],
      ['Lunar Bolts','the cold volley bends toward where you were',''],
      ['Chain Dash','learned from the ink road — the parade shares now','p']]},
  hakushi:{no:'38',cls:'THE AUTHOR 白',st:[5,5,5],
    d:'The hand that draws both roads. It holds the brush that wrote the vermilion and the blade that bled the ink, and it writes the fight while you fight it. Past half, the pen grows impatient.',
    a:[['Ink Rain','the page itself is stamped blank in a falling field — wider than any rain either road knew',''],
      ['Stamp Fall','vermilion seals slam down in sequence, each where you fled the last','p'],
      ['Lunar Orbit','a cold ring of blades borrowed from the silver grass',''],
      ['Mirror Servants','it sketches your own reflection to hold your blade',''],
      ['The Second Draft','past half: burning orbits, mirror dashes, seeking shards, waves of blank — the stamp stops asking','']]}};

// ---- field notes for the bestiary ---------------------------------------------

S.bestiary={
  uzu3:'The last page, act i — a duel. The redrawn fight faster than the drawn.',
  ginro3:'The last page, act ii. What the eraser missed still hunts in packs.',
  hakushi:'The end of everything the page ever meant. Break its posture twice — it writes a second draft.'};

// ---- light for the three acts (GRADE entries 17..19) ---------------------------

S.grade={
  17:{tint:'rgba(248,246,238,0.22)',lx:.15,ly:.7,shadow:'rgba(70,70,84,0.10)',vig:.24,amb:'the unwritten margin'},
  18:{tint:'rgba(34,30,48,0.16)',lx:-.3,ly:.6,shadow:'rgba(22,20,32,0.30)',vig:.42,amb:'the hundred parade'},
  19:{tint:'rgba(250,248,240,0.26)',lx:.5,ly:.3,shadow:'rgba(60,60,70,0.10)',vig:.3,amb:'the last page'}};

// ---- the floors of the last page (acts 17..19) ---------------------------------

S.buildFloor=function(act,g,seed){
  const TAU2=Math.PI*2;
  if(act===17){ // the margin: ruled paper, half-finished strokes, pencil ghosts
    g.fillStyle='rgba(251,247,236,0.55)';g.fillRect(0,0,RW,RH);
    g.strokeStyle='rgba(70,70,84,0.07)';g.lineWidth=1;
    for(let i=0;i<11;i++){const x=hash01(seed+i*13)*RW,y=hash01(seed+i*17)*RH;
      g.strokeRect(x-18,y-26,36,52);}
    g.strokeStyle='rgba(74,68,60,0.13)';g.lineWidth=1.2;g.lineCap='round';
    for(let i=0;i<14;i++){const x=hash01(seed+40+i*5)*RW,y=hash01(seed+41+i*7)*RH;
      g.beginPath();g.moveTo(x-14,y);
      g.quadraticCurveTo(x,y-rnd(8,18),x+rnd(10,22),y+rnd(-8,8));g.stroke();}
    for(let i=0;i<5;i++){const x=hash01(seed+80+i*7)*RW,y=hash01(seed+81+i*11)*RH;
      g.save();g.translate(x,y);g.rotate(rnd(-.4,.4));
      g.strokeStyle='rgba(179,55,42,0.14)';g.lineWidth=2.2;g.strokeRect(-12,-12,24,24);
      g.restore();}}
  else if(act===18){ // the parade: a dark processional washed over pale paper
    g.fillStyle='rgba(38,34,52,0.20)';g.fillRect(0,0,RW,RH);
    for(let i=0;i<14;i++)inkBlob(g,hash01(seed+i*3)*RW,hash01(seed+i*7)*RH,rnd(40,110),'rgba(26,24,38,0.16)',seed+i);
    for(let i=0;i<8;i++){const x=hash01(seed+60+i*9)*RW,y=hash01(seed+61+i*13)*RH;
      g.save();g.translate(x,y);g.rotate(hash01(seed+i)*TAU2);
      g.fillStyle='rgba(240,234,216,0.10)';
      g.fillRect(-12,-16,24,32);
      g.strokeStyle='rgba(240,234,216,0.14)';g.lineWidth=1;g.strokeRect(-12,-16,24,32);
      g.restore();}
    g.strokeStyle='rgba(179,55,42,0.10)';g.lineWidth=2;
    g.beginPath();g.moveTo(0,RH*.62);
    for(let x=0;x<=RW;x+=160)g.quadraticCurveTo(x+80,RH*.62+rnd(-26,26),x+160,RH*.62);
    g.stroke();}
  else{ // act 19: the last page — near blank, one vast enso, red filings
    g.fillStyle='rgba(252,250,242,0.68)';g.fillRect(0,0,RW,RH);
    g.strokeStyle='rgba(29,26,22,0.07)';g.lineWidth=7;g.lineCap='round';
    g.beginPath();g.arc(RW*.5,RH*.52,RW*.3,.4,5.9);g.stroke();
    g.strokeStyle='rgba(29,26,22,0.05)';g.lineWidth=1.2;
    g.beginPath();g.moveTo(RW*.12,RH*.5);g.quadraticCurveTo(RW*.5,RH*.44,RW*.88,RH*.52);g.stroke();
    for(let i=0;i<9;i++){const x=hash01(seed+i*11)*RW,y=hash01(seed+i*23)*RH;
      g.fillStyle='rgba(179,55,42,0.10)';
      g.beginPath();g.arc(x,y,rnd(1.4,2.8),0,TAU2);g.fill();}
    for(let i=0;i<6;i++){const x=hash01(seed+70+i*5)*RW,y=hash01(seed+71+i*9)*RH;
      g.save();g.translate(x,y);g.rotate(rnd(-.3,.3));
      g.strokeStyle='rgba(70,70,84,0.06)';g.lineWidth=1;g.strokeRect(-16,-22,32,44);
      g.restore();}}};

// sparse by design — the margin is almost empty, the parade crowded only
// with its walkers, the last page holding almost nothing at all
S.buildProps=function(act){
  const pr=[];
  const n=act===17?26:(act===18?40:16);
  for(let i=0;i<n;i++){
    const x=WALL+40+hash01(act*99+i*1.7)*(RW-WALL*2-80);
    const y=WALL+40+hash01(act*131+i*2.3)*(RH-WALL*2-80);
    if(dist(x,y,RW/2,RH*.68)<120)continue;
    const kind=act===17?'speck':(act===18?'wisp':'speck');
    pr.push({x,y,ph:hash01(i*7.3)*TAU,h:rnd(18,40),kind});}
  G.props=pr;
  G.fireflies=[];
  G.ripples=[];
  if(act===19){ // a few cold lights keep the last page company
    for(let i=0;i<(IS_TOUCH?4:6);i++)G.fireflies.push({x:rnd(WALL,RW-WALL),y:rnd(WALL,RH-WALL),ph:rnd(TAU),sp:rnd(.4,1)});}};

// the weather of the last page: pencil shavings on the margin wind, ink
// petals over the parade, and on the last page almost nothing — white motes
// and the occasional red spark, rising
S.drawWeather=function(act){
  const n=Math.round((act===18?18:(act===17?14:10)))*(IS_TOUCH?.6:1);
  for(let i=0;i<n;i++){
    const seed=i*1.618;
    if(act===17){ // pencil shavings tumble along the margin
      const t=(G.t*(24+hash01(seed)*16)+hash01(seed*3)*RH*2)%(RH+60);
      const x=hash01(seed*7)*RW+Math.sin(G.t*.6+seed)*40+G.wind*36;
      ctx.save();ctx.translate(x,RH-t);ctx.rotate(G.t*2.2+seed);
      ctx.globalAlpha=.34*(1-t/(RH+60));
      ctx.strokeStyle='#7a746a';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(-4,0);ctx.lineTo(4,0);ctx.stroke();
      ctx.restore();
      if(i%4===0){ // pale dust keeps the margin breathing
        const t2=(G.t*(14+hash01(seed*2)*10)+hash01(seed*5)*RH*2)%(RH+40);
        ctx.globalAlpha=.14+(1-t2/(RH+40))*.1;
        ctx.fillStyle='#b8b2a4';
        ctx.beginPath();ctx.arc(hash01(seed*11)*RW+Math.sin(G.t*.4+seed)*22,t2-16,1+hash01(seed)*1.4,0,TAU);
        ctx.fill();}}
    else if(act===18){ // ink petals fall over the parade
      const t=(G.t*(30+hash01(seed)*20)+hash01(seed*3)*RH*2)%(RH+70);
      const x=hash01(seed*7)*RW+Math.sin(G.t*.7+seed)*46+G.wind*40;
      ctx.save();ctx.translate(x,RH-t);ctx.rotate(G.t*1.6+seed);
      ctx.globalAlpha=.42*(1-t/(RH+70));
      ctx.fillStyle=i%3?'#2c2838':RED;
      ctx.beginPath();ctx.ellipse(0,0,4.4,1.9,.5,0,TAU);ctx.fill();
      ctx.restore();}
    else{ // act 19: white motes rise off the blank, some of them red
      const t=(G.t*(15+hash01(seed)*11)+hash01(seed*3)*RH*2)%(RH+40);
      const x=hash01(seed*7)*RW+Math.sin(G.t*.4+seed)*24+G.wind*20;
      ctx.globalAlpha=.16+(1-t/(RH+40))*.2;
      const red=i%7===0;
      ctx.fillStyle=red?RED:'#a8a294';
      ctx.beginPath();ctx.arc(x,t-18,red?1.6:(1+hash01(seed)*1.3),0,TAU);ctx.fill();}}
  ctx.globalAlpha=1;};

return S;})();
