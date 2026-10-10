// ============================================================================
// SUMIKIRI — GFX: THE PAINTED LIGHT (update 2.1)
//
// The engine paints in ink on paper. This layer gives that painting LIGHT:
//
//   · BLOOM      — a glow-accumulation post-process. While the world renders,
//                  every glow sprite the engine paints (fireflies, embers,
//                  orbs, lantern flames, the sun) is mirrored into a small
//                  additive buffer; post() then feeds that buffer the rest of
//                  the light it knows about — the hero's lamp, slashes,
//                  telegraphs, auras, kanji stamps, the act's key light —
//                  blurs it through a downscale chain, and adds it back over
//                  the frame in two radii (tight glow + wide halo). No pixel
//                  readback ever happens: the pipeline never stalls, and
//                  bright PAPER can never bloom — only light does.
//   · NIGHT      — a light-map for the dark acts (abyss, moon, lantern river,
//                  ashfall): the world is multiplied down to ambient dusk,
//                  then every real light punches warmth back through it.
//                  Lights bloom because the bloom runs after.
//   · ATMOS      — screen-space depth haze: the far edge of every page
//                  recedes behind a breath of tinted air.
//   · SHADOWS    — soft contact shadows under every body, so the cast stands
//                  ON the ground instead of printed over it.
//   · TITLE RAYS — slow god-rays leaning out of the title's low sun.
//
// Loaded BEFORE the engine (like story2/ambient2); everything resolves at
// call time. The engine calls:
//   GFX.beginCapture()   at the top of render()
//   GFX.entityShadows()  inside renderWorld, before the entity queue (world space)
//   GFX.night() GFX.atmos()  screen space, right after the grade layer
//   GFX.post()           after the petals / after the title scene — the bloom
//   GFX.titleFX()        the last breath of drawTitleScene
// ============================================================================

window.GFX=(function(){
'use strict';
const A={};
const TAU=Math.PI*2;
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function mk(w,h){const c=document.createElement('canvas');c.width=Math.max(2,w|0);c.height=Math.max(2,h|0);return c;}

// ---- act families -------------------------------------------------------------
// which acts carry a night light-map (multiplied ambient + punched lights)
const NIGHT={8:'#96827a',9:'#99a2c2',12:'#b0a08a',15:'#a08a78'};
// which acts run clean and bright (bloom trimmed)
const BRIGHT={7:1,14:1,16:1};
// depth-haze tints per act (the air the page is painted in)
const HAZE={
  1:'150,120,70',2:'96,116,150',3:'96,140,96',4:'170,186,210',5:'104,96,124',
  6:'120,110,100',7:'190,186,176',8:'110,80,72',9:'110,124,164',
  11:'168,100,64',12:'96,124,164',13:'96,140,104',14:'186,182,156',15:'120,104,94',16:'196,192,182'};

// ---- buffers (all rebuilt lazily) ---------------------------------------------
let bA=null,bAC=null;        // glow accumulation, ~1/4 res
let bB=null,bBC=null;        // wide halo, ~1/12 res
let lightC=null,lightCC=null;// night light-map, 1/2 res
let atmosC=null,atmosAct=-1; // cached depth haze
let shadowC=null;            // contact shadow sprite
let rayC=null;               // title god-ray sprite

// ---- CAPTURE: mirroring the engine's own glow sprites --------------------------
// The engine already paints its lamps as radial glow sprites. While the world
// renders, every one of those draws is mirrored (same transform, same alpha)
// into the quarter-res additive buffer. This is the only "sampling" the bloom
// ever does — and it costs one small drawImage per glow, on a tiny canvas.

let wrapped=false;
let lightSprites=null;

A.beginCapture=function(){
  if(document.hidden)return;
  // quarter-res buffer, rebuilt on resize
  const div=IS_TOUCH?5:4;
  const qw=Math.max(80,Math.round(W/div)),qh=Math.max(45,Math.round(qw*H/Math.max(1,W)));
  const qw2=Math.max(48,(qw/3)|0),qh2=Math.max(27,(qh/3)|0);
  if(!bA||bA.width!==qw||bA.height!==qh){
    bA=mk(qw,qh);bAC=bA.getContext('2d');
    bB=mk(qw2,qh2);bBC=bB.getContext('2d');}
  // resolve the glow sprites by name each frame (they are engine globals;
  // if the engine ever rebuilds them, identity checks stay honest)
  try{lightSprites=[glowRed,glowGold,glowWhite,glowEmber,glowBlue];}catch(e){lightSprites=null;}
  if(!wrapped&&lightSprites){
    wrapped=true;
    const native=ctx.drawImage.bind(ctx);
    ctx.drawImage=function(img){
      native.apply(ctx,arguments);
      if(!A.__cap||!bA)return;
      if(!lightSprites||lightSprites.indexOf(img)<0)return;
      try{
        const m=ctx.getTransform();
        const s=bA.width/W;
        bAC.save();
        bAC.setTransform(1,0,0,1,0,0);
        bAC.scale(s,s);
        bAC.transform(m.a,m.b,m.c,m.d,m.e,m.f);
        bAC.globalCompositeOperation='lighter';
        bAC.globalAlpha=Math.min(1,ctx.globalAlpha*1.25);
        if(arguments.length===3)bAC.drawImage(img,arguments[1],arguments[2]);
        else if(arguments.length===5)bAC.drawImage(img,arguments[1],arguments[2],arguments[3],arguments[4]);
        else bAC.drawImage(img,arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6],arguments[7],arguments[8]);
        bAC.restore();
      }catch(err){}};}
  bAC.setTransform(1,0,0,1,0,0);
  bAC.clearRect(0,0,bA.width,bA.height);
  A.__cap=true;
};

// ---- POST: feed the rest of the light, blur, composite --------------------------

A.q=1; // paint quality answers the brush: 墨 .55 · 絵 1 · 華 1.15 (set by settings)

A.post=function(){
  A.__cap=false;                    // nothing after this point feeds the bloom
  if(!bA||document.hidden)return;
  const inGame=!!(G.floorC&&G.run);
  const act=inGame?curAct():0;
  const bright=!inGame?false:!!BRIGHT[act];
  const dark=!inGame?false:!!NIGHT[act];
  const s=bA.width/W;
  const q=bA.width,qh=bA.height;

  let budget=42;
  const feed=(x,y,r,col,a)=>{
    if(budget--<=0)return;
    const rr=Math.max(1.5,r*s);
    if(x<-rr||x>W+rr||y<-rr||y>H+rr)return;
    const gr=bAC.createRadialGradient(x*s,y*s,0,x*s,y*s,rr);
    gr.addColorStop(0,`rgba(${col},${a})`);
    gr.addColorStop(.55,`rgba(${col},${a*.4})`);
    gr.addColorStop(1,`rgba(${col},0)`);
    bAC.fillStyle=gr;
    bAC.beginPath();bAC.arc(x*s,y*s,rr,0,TAU);bAC.fill();};

  if(inGame){
    const zp=Z*(1+(G.zp+(G.codexCur?G.zpC:0))*.32);
    const toS=(wx,wy)=>[(wx-G.cam.x)*zp+W/2+G.shakeX,(wy-G.cam.y)*zp+H/2+G.shakeY];
    const warm=(G.run&&G.run.story===2);

    // the act's key light
    const gr0=GRADE[act]||GRADE[1];
    feed(clamp(gr0.lx,-1,1)*W*.5+W*.5,clamp(gr0.ly,0,1)*H*.8,Math.max(W,H)*.34,
      act===12?'232,178,110':warm?'214,140,90':'240,234,216',bright?.07:dark?.13:.1);

    // the hero's lamp
    if(P&&!P.dead&&P.x!==undefined){
      const [x,y]=toS(P.x,P.y);
      const fl=.9+.1*Math.sin(G.t*9.3);
      feed(x,y,(warm?150:126)*zp,warm?'255,168,116':'255,226,178',warm?.3:.24);}

    // slashes: the page's brightest steel — feed the whole arc
    if(G.slashes)for(const sl of G.slashes){
      if(P.x===undefined)continue;
      const [x,y]=toS(P.x,P.y);
      const p=clamp(sl.t/sl.dur,0,1);
      feed(x,y,(sl.range||100)*zp,(sl.art?'179,55,42':(warm?'255,120,80':'246,241,226')),.3*(1-p));}

    // telegraphs are honest light — gold reads, peril burns
    if(G.teles)for(const t of G.teles){
      if(t.t<0)continue;
      const col=t.parry?'234,196,120':(t.peril?'214,70,50':'214,178,90');
      if(t.kind==='line'){
        for(let i=0;i<3;i++){
          const [x,y]=toS(t.x+Math.cos(t.ang)*t.len*i*.5,t.y+Math.sin(t.ang)*t.len*i*.5);
          feed(x,y,Math.max(40,(t.w||26)*3.4)*zp,col,.13);}}
      else{const [x,y]=toS(t.x,t.y);
        feed(x,y,(t.r||60)*1.25*zp,col,t.kind==='arc'?.12:.15);}}

    // every foe carries its faint aura — presence, not headlights
    if(G.enemies){let n=0;
      for(const en of G.enemies){
        if(en.hidden||en.dead)continue;
        if(n++>16)break;
        const [x,y]=toS(en.x,en.y);
        const s2=en.def&&en.def.s2;
        feed(x,y,(en.r||14)*(en.boss?4.6:3.1)*zp,
          en.boss?'214,70,50':(s2?'201,118,46':'150,120,110'),
          en.boss?.16:(s2?.09:.07));}}

    // fireflies (also sprite-captured — doubled on purpose, they are tiny)
    if(G.fireflies)for(const f of G.fireflies){
      const br=.5+.5*Math.sin(G.t*2.2+f.ph);if(br<.3)continue;
      const [x,y]=toS(f.x,f.y);
      feed(x,y,34*zp,'234,196,120',.28*br);}

    // a wounded hound is a lantern about to go out
    if(G.enemies)for(const en of G.enemies){
      if(!en.fused||en.dead)continue;
      const [x,y]=toS(en.x,en.y);
      feed(x,y,80*zp,'214,60,40',.3+.2*Math.sin(G.t*26));}

    // the great moments: kanji stamps, parry rings, booms
    if(G.fx)for(const f of G.fx){
      if(f.kind==='kanji')feed(f.x,f.y,110,'179,55,42',.3);
      else if(f.kind==='pring')feed(f.x,f.y,120,'234,196,120',.24);
      else if(f.kind==='spark')feed(f.x,f.y,90,'234,196,120',.22);
      else if(f.kind==='boom')feed(f.x,f.y,(f.r||140)*1.1,'214,70,50',.26);}
  }else{
    // the title: the low sun is already sprite-captured; warm the whole dusk
    feed(W*.68,H*.30,Math.max(W,H)*.5,'224,146,72',.14);
  }

  // blur chain: the wide halo is the tight glow, downscaled and dreamed
  bBC.setTransform(1,0,0,1,0,0);
  bBC.clearRect(0,0,bB.width,bB.height);
  bBC.drawImage(bA,0,0,bB.width,bB.height);

  // composite: light added back over the world
  const Q=(typeof A.q==='number'&&A.q>0)?A.q:1;
  ctx.save();
  ctx.imageSmoothingEnabled=true;
  ctx.globalCompositeOperation='lighter';
  ctx.globalAlpha=(bright?.32:dark?.46:.38)*Q;
  ctx.drawImage(bA,0,0,W,H);
  ctx.globalAlpha=(bright?.2:dark?.34:.26)*Q;
  ctx.drawImage(bB,0,0,W,H);
  ctx.restore();
  ctx.globalAlpha=1;
};

// ---- NIGHT: the light-map of the dark acts -------------------------------------

function ensureLight(){
  const div=IS_TOUCH?3:2;
  const lw=Math.max(64,(W/div)|0),lh=Math.max(36,(H/div)|0);
  if(!lightC||lightC.width!==lw||lightC.height!==lh){
    lightC=mk(lw,lh);lightCC=lightC.getContext('2d');}
}

A.night=function(){
  const act=curAct();
  const amb=NIGHT[act];
  if(!amb||!G.floorC||!G.run)return;
  ensureLight();
  const g=lightCC,lw=lightC.width,lh=lightC.height,k=lw/W;
  g.globalCompositeOperation='source-over';
  g.fillStyle=amb;g.fillRect(0,0,lw,lh);
  g.globalCompositeOperation='lighter';

  const zp=Z*(1+(G.zp+(G.codexCur?G.zpC:0))*.32);
  const toS=(wx,wy)=>[((wx-G.cam.x)*zp+W/2+G.shakeX)*k,((wy-G.cam.y)*zp+H/2+G.shakeY)*k];
  let budget=26; // gradients are cheap, but not infinite
  const light=(x,y,r,col)=>{
    if(budget--<=0||x<-r||x>lw+r||y<-r||y>lh+r)return;
    const gr=g.createRadialGradient(x,y,0,x,y,r);
    gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();};

  // the act's key light: moon, or the lantern river's paper sky
  const gr0=GRADE[act]||GRADE[1];
  light(clamp(gr0.lx,0,1)*lw,clamp(gr0.ly,0,1)*lh*.8,Math.max(lw,lh)*.62,
    act===12?'rgba(232,178,110,0.5)':'rgba(198,208,232,0.42)');

  // the hero's lamp — a brush-dancer carries warm vermilion, the ronin cool paper
  if(P&&!P.dead&&P.x!==undefined){
    const [x,y]=toS(P.x,P.y);
    const fl=.92+.08*Math.sin(G.t*9.3)+.04*Math.sin(G.t*23.7);
    light(x,y,(158+26*Math.sin(G.t*1.3))*zp*k*fl,
      (G.run&&G.run.story===2)?'rgba(255,168,116,0.72)':'rgba(255,226,178,0.8)');}

  // fireflies are embers of the meadow
  if(G.fireflies)for(const f of G.fireflies){
    const br=.5+.5*Math.sin(G.t*2.2+f.ph);if(br<.28)continue;
    const [x,y]=toS(f.x,f.y);light(x,y,30*zp*k,`rgba(255,214,120,${.5*br})`);}

  // projectiles carry their own weather
  if(G.projs)for(const pr of G.projs){
    if(pr.dead)continue;
    const [x,y]=toS(pr.x,pr.y);
    if(pr.kind==='ember')light(x,y,46*zp*k,'rgba(255,150,70,0.55)');
    else if(pr.kind==='orb')light(x,y,38*zp*k,'rgba(196,140,255,0.42)');
    else if(pr.friendly)light(x,y,42*zp*k,'rgba(179,55,42,0.5)');
    else if(pr.kind==='shard')light(x,y,26*zp*k,'rgba(232,200,120,0.3)');}

  // ash orbs, wisps, bosses
  if(G.pickups)for(const pk of G.pickups)if(pk.kind==='orb'){
    const [x,y]=toS(pk.x,pk.y);light(x,y,58*zp*k,'rgba(255,90,70,0.5)');}
  if(G.enemies)for(const en of G.enemies){
    if(en.dead||en.hidden)continue;
    if(en.type==='wisp'){const [x,y]=toS(en.x,en.y);light(x,y,62*zp*k,'rgba(255,160,80,0.5)');}
    else if(en.boss){const [x,y]=toS(en.x,en.y);light(x,y,118*zp*k,'rgba(255,110,80,0.28)');}}

  // telegraphs must stay legible in the dark — they are honest light
  if(G.teles)for(const t of G.teles){
    if(t.t<0)continue;
    const [x,y]=toS(t.x,t.y);
    light(x,y,(t.r||60)*zp*k,t.peril?'rgba(255,80,60,0.22)':'rgba(255,220,140,0.15)');}

  // a swing is a flash of the page
  if(P&&P.swing&&P.x!==undefined){
    const [x,y]=toS(P.x,P.y);
    light(x,y,140*zp*k,(G.run&&G.run.story===2)?'rgba(255,140,100,0.45)':'rgba(240,234,216,0.36)');}

  ctx.save();
  ctx.imageSmoothingEnabled=true;
  ctx.globalCompositeOperation='multiply';
  ctx.drawImage(lightC,0,0,W,H);
  ctx.restore();
};

// ---- ATMOS: the air between you and the far edge --------------------------------

A.atmos=function(){
  if(!G.floorC||!G.run)return;
  const act=curAct();
  if(!atmosC||atmosAct!==act||atmosC.width!==W||atmosC.height!==H){
    atmosAct=act;atmosC=mk(W,H);
    const g=atmosC.getContext('2d');
    const col=HAZE[act]||'120,116,104';
    // the far (upper) page recedes behind tinted breath
    const gr=g.createLinearGradient(0,0,0,H*.72);
    gr.addColorStop(0,`rgba(${col},0.15)`);
    gr.addColorStop(.55,`rgba(${col},0.055)`);
    gr.addColorStop(1,`rgba(${col},0)`);
    g.fillStyle=gr;g.fillRect(0,0,W,H*.72);
    // and the very top carries the sky's own weather
    const gr2=g.createLinearGradient(0,0,0,H*.15);
    gr2.addColorStop(0,`rgba(${col},0.2)`);
    gr2.addColorStop(1,`rgba(${col},0)`);
    g.fillStyle=gr2;g.fillRect(0,0,W,H*.15);
    // the near (lower) edge grounds slightly cooler
    const gr3=g.createLinearGradient(0,H,0,H*.8);
    gr3.addColorStop(0,`rgba(64,58,50,0.08)`);
    gr3.addColorStop(1,`rgba(64,58,50,0)`);
    g.fillStyle=gr3;g.fillRect(0,H*.8,W,H*.2);}
  ctx.drawImage(atmosC,0,0);
};

// ---- SHADOWS: every body stands on the ground -----------------------------------

A.entityShadows=function(){
  if(!G.run||!G.enemies)return;
  if(!shadowC){
    shadowC=mk(64,64);
    const g=shadowC.getContext('2d');
    const gr=g.createRadialGradient(32,32,3,32,32,30);
    gr.addColorStop(0,'rgba(29,24,20,0.72)');
    gr.addColorStop(.5,'rgba(29,24,20,0.34)');
    gr.addColorStop(.8,'rgba(29,24,20,0.1)');
    gr.addColorStop(1,'rgba(29,24,20,0)');
    g.fillStyle=gr;g.beginPath();g.arc(32,32,30,0,TAU);g.fill();}
  ctx.save();
  for(const en of G.enemies){
    if(en.hidden||en.dead)continue;
    const w=(en.r||14)*(en.boss?2.9:2.5);
    const air=en.h?clamp(1-en.h/240,0,1):1;   // a leaping boss sheds its shadow
    ctx.globalAlpha=(en.boss?.6:.52)*air;
    ctx.drawImage(shadowC,en.x-w*.6,en.y-w*.22,w*1.2,w*.62);}
  if(P&&P.x!==undefined&&!P.dead){
    ctx.globalAlpha=.56;
    ctx.drawImage(shadowC,P.x-26,P.y-11,52,28);}
  ctx.restore();
  ctx.globalAlpha=1;
};

// ---- TITLE: god-rays leaning out of the low sun ----------------------------------

A.titleFX=function(){
  if(!rayC){
    rayC=mk(300,640);
    const g=rayC.getContext('2d');
    const gr=g.createLinearGradient(0,0,0,640);
    gr.addColorStop(0,'rgba(224,146,72,0.5)');
    gr.addColorStop(.5,'rgba(224,146,72,0.16)');
    gr.addColorStop(1,'rgba(224,146,72,0)');
    g.fillStyle=gr;
    g.beginPath();g.moveTo(150,0);g.lineTo(300,0);g.lineTo(30,640);g.lineTo(-30,640);g.closePath();g.fill();
    // a brighter core thread down the middle
    const gr2=g.createLinearGradient(0,0,0,640);
    gr2.addColorStop(0,'rgba(250,196,120,0.5)');gr2.addColorStop(1,'rgba(250,196,120,0)');
    g.fillStyle=gr2;
    g.beginPath();g.moveTo(150,0);g.lineTo(210,0);g.lineTo(90,640);g.lineTo(50,640);g.closePath();g.fill();}
  const sx=W*.68,sy=H*.30;
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  for(let i=0;i<5;i++){
    const ph=G.t*.05+i*1.257;
    const lean=.34*Math.sin(ph)+.18;                 // slow honest sway
    const a=.05+.035*Math.sin(G.t*.31+i*2.1);
    if(a<=.004)continue;
    ctx.save();
    ctx.translate(sx,sy);
    ctx.rotate(lean+i*.19-.38);
    ctx.globalAlpha=a;
    const len=H*(.9+.1*hash01(i*7.7));
    ctx.drawImage(rayC,-80-i*30,-40,160+i*60,len);
    ctx.restore();}
  ctx.restore();
  ctx.globalAlpha=1;
};

return A;
})();
