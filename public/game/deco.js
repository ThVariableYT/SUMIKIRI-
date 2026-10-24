// ============================================================================
// SUMIKIRI — DECO: THE DRESSED STAGE (update 2.8 威)
//
// The page knew weather and light; it did not know PROPS. This layer dresses
// every act in things a stage actually holds — things with a past, not filler:
//
//   · THE SET PIECES — baked once into the floor: scarecrows and sheaves in
//     the rice, a drowned bridge and a capsized sampan under the rain, stone
//     tōrō and shimenawa ropes in the bamboo court, snow-capped jizō on the
//     white road, a war camp of taiko, tate shields and spent arrows in the
//     storm, gorintō graves and charred gates in the ash, half-finished
//     sketches on the blank page — and the vermilion road's torii, red spider
//     lilies and the painter's own inkstone.
//   · THE LIVE SET — drawn while the game runs, all pure functions of the
//     clock: sashimono war banners whipping in the real wind, a water wheel
//     turning in the current, shide paper streamers swinging on their ropes,
//     smoke crawling off the burnt vents, dragonflies patrolling the fields,
//     a night lantern breathing on its post.
//   · THE AIR HAS DEPTH — a far scenery band above the arena's wall drifts
//     at a fraction of the camera's pace (distant hills, forest walls, the
//     moon road's pagoda), and a near silhouette band below the field slides
//     slightly faster than the world (tall grass, reeds, drifts) — the page
//     gains a foreground and a horizon without spending a frame's budget:
//     two cached canvases, two drawImages.
//
// Everything is seeded (nothing shuffles on redraw), view-culled, allocation
// free at draw time, and touch devices get the leaner counts. The engine
// calls, in order:
//   DECO.buildFloor(act,g,seed)  from buildFloor — set pieces onto the floor
//   DECO.build(act)              from startStage — far/near bands + live set
//   DECO.drawFar()               in renderWorld, right after the floor blit
//   DECO.drawLive(act)           after drawProps
//   DECO.drawNear()              after the weather — the closest thing on stage
// ============================================================================

window.DECO=(function(){
'use strict';
const D={};
const T2=Math.PI*2;

// engine globals (TAU, hash01, rnd, clamp, G, ctx, RW, RH, WALL, GRADE,
// IS_TOUCH, INK, RED, ...) resolve at call time — this file loads first.

// ---- small local vocabulary --------------------------------------------------
function ln(g,x0,y0,x1,y1,w,col){g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';
  g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();}
function sh(g,x,y,rx,ry,a){ // the ground shadow every dressed thing casts
  g.fillStyle='rgba(29,24,20,'+(a||.2)+')';
  g.beginPath();g.ellipse(x+rx*.18,y+ry*.28,rx,ry,0,0,T2);g.fill();}
function wob(x,seed){ // a seeded wobble so nothing repeats like a stamp
  const i=Math.floor(x),f=x-i;
  const a=hash01(i+seed*57.31),b=hash01(i+1+seed*57.31);
  const u=f*f*(3-2*f);return a+(b-a)*u;}
function farPos(act,i,n,seed){ // scatter set pieces, keep the spawn clear
  for(let tr=0;tr<5;tr++){
    let x=WALL+70+hash01(seed+tr*13.7+i*3.1)*(RW-WALL*2-140);
    let y=WALL+70+hash01(seed+tr*9.1+i*7.7+act)*(RH-WALL*2-160);
    if(dist(x,y,RW/2,RH*.68)>=170)return[x,y];}
  return[WALL+90,WALL+90];}

// ============================================================================
// BAKED SET PIECES — one painter per thing, each hand-weathered
// ============================================================================

// scarecrow: a cross, a straw body, a coat older than the war, a kasa
function pKakashi(g,x,y,s,seed){
  const h=86*s,wobS=seed*3.7;
  sh(g,x,y+4,26*s,10*s,.16);
  // the coat, first (behind the straw)
  g.fillStyle='#3a3630';
  g.beginPath();
  g.moveTo(x-20*s,y);g.lineTo(x-13*s,y-h*.62);g.lineTo(x-24*s,y-h*.30);
  g.lineTo(x-31*s,y-h*.05);g.lineTo(x-26*s,y+3);
  g.closePath();g.fill();
  g.fillStyle='#33302a';
  g.beginPath();
  g.moveTo(x+19*s,y);g.lineTo(x+13*s,y-h*.62);g.lineTo(x+25*s,y-h*.26);
  g.lineTo(x+30*s,y-h*.02);g.closePath();g.fill();
  // ragged hems — cut, not hemmed
  g.fillStyle='#3a3630';
  g.beginPath();
  g.moveTo(x-26*s,y+3);g.lineTo(x-22*s,y+11*s);g.lineTo(x-17*s,y+4);
  g.lineTo(x-13*s,y+13*s);g.lineTo(x-8*s,y+5);g.closePath();g.fill();
  // straw body
  g.fillStyle='#a8945c';
  g.beginPath();
  g.moveTo(x-15*s,y);g.quadraticCurveTo(x-9*s,y-h*.66,x+2*s,y-h*.72);
  g.quadraticCurveTo(x+12*s,y-h*.62,x+15*s,y);g.quadraticCurveTo(x,y+h*.1,x-15*s,y);
  g.closePath();g.fill();
  g.strokeStyle='#8a7648';g.lineWidth=1.1;
  for(let i=0;i<7;i++){const t=i/6;
    g.beginPath();g.moveTo(x-11*s+t*22*s,y);
    g.quadraticCurveTo(x-9*s+t*18*s,y-h*.5,x-6*s+t*14*s,y-h*(.6+wob(t,wobS)*.08));
    g.stroke();}
  // neck tie
  ln(g,x-8*s,y-h*.68,x+9*s,y-h*.64,3*s,'#6b5b3a');
  // the cross
  ln(g,x,y+4,x,y-h,4.4*s,'#4a3f28');
  ln(g,x-24*s,y-h*.62,x+25*s,y-h*.58,3.6*s,'#4a3f28');
  // sleeves of straw on the arms
  g.strokeStyle='#a8945c';g.lineWidth=3.2*s;g.lineCap='round';
  g.beginPath();g.moveTo(x-21*s,y-h*.6);g.lineTo(x-26*s,y-h*.44);g.stroke();
  g.beginPath();g.moveTo(x+21*s,y-h*.59);g.lineTo(x+27*s,y-h*.42);g.stroke();
  // the hat, low over where a face would be
  g.fillStyle='#6b5b3a';
  g.beginPath();g.ellipse(x+1*s,y-h*.86,17*s,7*s,-.06,0,T2);g.fill();
  g.fillStyle='#4a3f28';
  g.beginPath();g.ellipse(x+1*s,y-h*.92,9*s,5*s,0,0,T2);g.fill();
  g.strokeStyle='rgba(246,241,226,0.22)';g.lineWidth=1;
  g.beginPath();g.ellipse(x+1*s,y-h*.88,15*s,6*s,-.06,-.7,.4);g.stroke();}

// sheaves of rice, leaning in a tripod like tired men
function pSheaf(g,x,y,s,seed){
  const h=54*s;
  sh(g,x,y+3,17*s,7*s,.13);
  g.fillStyle='#c9a94e';
  g.beginPath();
  g.moveTo(x-11*s,y);g.quadraticCurveTo(x-12*s,y-h*.55,x-1*s,y-h);
  g.quadraticCurveTo(x+10*s,y-h*.55,x+11*s,y);g.quadraticCurveTo(x,y+6*s,x-11*s,y);
  g.closePath();g.fill();
  g.strokeStyle='#9c8038';g.lineWidth=.9;
  for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(x+i*4.5*s,y);
    g.quadraticCurveTo(x+i*3*s,y-h*.5,x+i*1.2*s,y-h*.92);g.stroke();}
  ln(g,x-6*s,y-h*.34,x+6*s,y-h*.30,2.6*s,'#6b5b3a'); // the tie
  g.strokeStyle='#c9a94e';g.lineWidth=2.2*s;g.lineCap='round'; // heads droop
  g.beginPath();g.moveTo(x-2*s,y-h);g.quadraticCurveTo(x-9*s,y-h-9*s,x-14*s,y-h-2*s);g.stroke();
  g.beginPath();g.moveTo(x+2*s,y-h);g.quadraticCurveTo(x+8*s,y-h-10*s,x+13*s,y-h-3*s);g.stroke();}

// an old well: stone ring, black water, posts, rope, a bucket
function pWell(g,x,y,s,seed){
  const r=30*s;
  sh(g,x,y+6,r*1.15,r*.4,.17);
  // stone ring
  g.fillStyle='#6a655e';
  g.beginPath();g.ellipse(x,y,r,r*.42,0,0,T2);g.fill();
  g.strokeStyle='#3c3934';g.lineWidth=2.4;
  g.beginPath();g.ellipse(x,y,r,r*.42,0,0,T2);g.stroke();
  g.strokeStyle='#57534e';g.lineWidth=1;
  for(let i=0;i<9;i++){const a=i/9*T2+seed;
    g.beginPath();g.moveTo(x+Math.cos(a)*r*.8,y+Math.sin(a)*r*.34);
    g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r*.42);g.stroke();}
  // the water, dark and honest
  g.fillStyle='#232c40';
  g.beginPath();g.ellipse(x,y,r*.76,r*.3,0,0,T2);g.fill();
  g.strokeStyle='rgba(150,170,200,0.25)';g.lineWidth=1;
  g.beginPath();g.ellipse(x,y,r*.5,r*.18,0,.6,2.4);g.stroke();
  // posts and crossbeam
  ln(g,x-r*.72,y+2,x-r*.62,y-58*s,4.5*s,'#4a3f28');
  ln(g,x+r*.72,y+2,x+r*.62,y-58*s,4.5*s,'#4a3f28');
  ln(g,x-r*.68,y-56*s,x+r*.68,y-56*s,4*s,'#4a3f28');
  // rope and bucket
  ln(g,x,y-56*s,x,y-16*s,1.2,'#2c2c26');
  g.fillStyle='#4a3f28';
  g.beginPath();g.moveTo(x-6*s,y-16*s);g.lineTo(x+6*s,y-16*s);g.lineTo(x+4.5*s,y-6*s);g.lineTo(x-4.5*s,y-6*s);g.closePath();g.fill();
  g.strokeStyle='#2c2c26';g.lineWidth=1;g.strokeRect(x-4*s,y-22*s,8*s,5*s);}

// bamboo fence segment, tied, leaning with age
function pFence(g,x,y,s,n,seed){
  sh(g,x,y+3,n*11*s,6*s,.1);
  for(let i=0;i<n;i++){
    const bx=x+(i-(n-1)/2)*11*s;
    const lean=(wob(i,seed)-.5)*7*s;
    ln(g,bx,y+3,bx+lean,y-42*s,3.4*s,'#7a5b34');
    g.strokeStyle='rgba(246,241,226,0.16)';g.lineWidth=.8;
    g.beginPath();g.moveTo(bx+1.4*s,y-4*s);g.lineTo(bx+lean+1.4*s,y-38*s);g.stroke();}
  ln(g,x-(n*.5)*11*s,y-13*s,x+(n*.5)*11*s,y-11*s,2.6*s,'#6b4e2e');
  ln(g,x-(n*.5)*11*s,y-30*s,x+(n*.5)*11*s,y-27*s,2.6*s,'#6b4e2e');
  // rope ties at each slat crossing
  g.strokeStyle='#4a3f28';g.lineWidth=1.4;
  for(let i=0;i<n;i++){const bx=x+(i-(n-1)/2)*11*s;
    g.beginPath();g.moveTo(bx-2.4*s,y-15*s);g.lineTo(bx+2.4*s,y-11*s);g.stroke();}}

// the drowned bridge: planks at an angle, some gone under
function pBridge(g,x,y,s,seed){
  const n=6;
  sh(g,x,y+8,86*s,26*s,.15);
  for(let i=0;i<n;i++){
    const t=i/(n-1);
    const px=x-80*s+t*160*s;
    const sink=t>.72?(t-.72)*90*s:0; // the far end is under
    const wobX=(wob(i,seed)-.5)*10*s;
    g.fillStyle=i%2?'#5c452c':'#54401f';
    g.save();g.translate(px+wobX,y-14*s+sink*.4);g.rotate(.06+(wob(i+9,seed)-.5)*.08);
    g.fillRect(-13*s,-5*s,26*s,10*s);
    g.strokeStyle='rgba(24,17,14,0.4)';g.lineWidth=1;g.strokeRect(-13*s,-5*s,26*s,10*s);
    g.strokeStyle='rgba(246,241,226,0.1)';g.beginPath();g.moveTo(-9*s,-2*s);g.lineTo(9*s,-2*s);g.stroke();
    g.restore();
    // posts under every other plank
    if(i%2===0&&t<.7)ln(g,px+wobX,y-8*s,px+wobX,y+16*s,4.4*s,'#3a2c1a');
    if(sink>4){ // water swallows it
      g.fillStyle='rgba(56,72,106,0.5)';
      g.beginPath();g.ellipse(px,y+2+sink*.5,20*s,7*s,0,0,T2);g.fill();
      g.strokeStyle='rgba(150,170,200,0.22)';g.lineWidth=1;
      g.beginPath();g.ellipse(px,y+2+sink*.5,24*s,8*s,0,0,T2);g.stroke();}}
  // rope rail, sagging, one end trailing in the water
  g.strokeStyle='#8c7a4e';g.lineWidth=2;
  g.beginPath();g.moveTo(x-84*s,y-34*s);
  g.quadraticCurveTo(x,y-14*s,x+80*s,y-26*s);g.stroke();}

// capsized sampan: ribs in the air, hull in the current
function pSampan(g,x,y,s,seed){
  sh(g,x,y+8,64*s,20*s,.16);
  g.fillStyle='#4a3a26';
  g.beginPath();
  g.moveTo(x-56*s,y-6*s);g.quadraticCurveTo(x-10*s,y-34*s,x+40*s,y-8*s);
  g.quadraticCurveTo(x+54*s,y-2*s,x+44*s,y+4*s);g.quadraticCurveTo(x-20*s,y+16*s,x-56*s,y-6*s);
  g.closePath();g.fill();
  g.strokeStyle='#241f1c';g.lineWidth=1.6;g.stroke();
  // the ribs standing off the keel
  g.strokeStyle='#6b4e2e';g.lineWidth=3.2*s;
  for(let i=0;i<5;i++){const t=.2+i*.16;
    const rx=x-46*s+t*84*s, ry=y-12*s-t*10*s;
    g.beginPath();g.moveTo(rx,ry+10*s);g.quadraticCurveTo(rx+4*s,ry-8*s,rx-2*s,ry-12*s-t*8*s);g.stroke();}
  ln(g,x-56*s,y-6*s,x+40*s,y-9*s,2.2*s,'#3a2c1a'); // the keel
  // water around it
  g.strokeStyle='rgba(150,170,200,0.28)';g.lineWidth=1.2;
  g.beginPath();g.ellipse(x-6*s,y+6*s,66*s,17*s,.05,0,T2);g.stroke();
  g.beginPath();g.ellipse(x+14*s,y+9*s,40*s,10*s,0,0,T2);g.stroke();}

// stone tōrō: pedestal, column, a lit box, a roof with upturned eaves
function pToro(g,x,y,s,seed,lit){
  const h=76*s;
  sh(g,x,y+4,20*s,8*s,.18);
  g.fillStyle='#5a544c';
  g.beginPath();g.ellipse(x,y,15*s,6.5*s,0,0,T2);g.fill();      // base
  g.fillStyle='#544e46';
  g.fillRect(x-6.5*s,y-h*.4,13*s,h*.36);                        // column
  g.strokeStyle='#3c3934';g.lineWidth=1;g.strokeRect(x-6.5*s,y-h*.4,13*s,h*.36);
  // the light box
  g.fillStyle='#4a453e';
  g.fillRect(x-9.5*s,y-h*.66,19*s,h*.22);
  g.strokeStyle='#332f2a';g.lineWidth=1.2;g.strokeRect(x-9.5*s,y-h*.66,19*s,h*.22);
  if(lit){
    g.fillStyle='#e8a854';
    g.fillRect(x-5*s,y-h*.63,10*s,h*.16);
    g.fillStyle='rgba(232,168,80,0.20)'; // the light it throws
    const gr=g.createRadialGradient(x,y-h*.55,0,x,y-h*.55,42*s);
    gr.addColorStop(0,'rgba(232,168,80,0.24)');gr.addColorStop(1,'rgba(232,168,80,0)');
    g.fillStyle=gr;g.beginPath();g.arc(x,y-h*.55,42*s,0,T2);g.fill();}
  else{g.fillStyle='#2c2c26';g.fillRect(x-5*s,y-h*.63,10*s,h*.16);}
  // roof: curved, capped
  g.fillStyle='#443f38';
  g.beginPath();
  g.moveTo(x-13*s,y-h*.68);g.quadraticCurveTo(x,y-h*.86,x+13*s,y-h*.68);
  g.lineTo(x+11*s,y-h*.62);g.quadraticCurveTo(x,y-h*.76,x-11*s,y-h*.62);
  g.closePath();g.fill();
  g.fillStyle='#3c3934';
  g.beginPath();g.ellipse(x,y-h*.86,3.4*s,4.6*s,0,0,T2);g.fill(); // finial
  // moss keeps the damp stone
  g.fillStyle='rgba(96,116,70,0.30)';
  g.beginPath();g.ellipse(x-6*s,y-h*.06,5*s,3*s,.3,0,T2);g.fill();
  g.beginPath();g.ellipse(x+7*s,y-h*.36,4*s,2.4*s,-.2,0,T2);g.fill();}

// shimenawa posts — rope and straw between two bamboo; papers live elsewhere
function pShimePosts(g,x,y,s,span,seed){
  sh(g,x,y+3,span*.62,8*s,.12);
  ln(g,x-span/2,y+3,x-span/2,y-64*s,4.5*s,'#4a3f28');
  ln(g,x+span/2,y+3,x+span/2,y-64*s,4.5*s,'#4a3f28');
  // the rope, sagging and twisted
  g.strokeStyle='#8c7a4e';g.lineWidth=4*s;
  g.beginPath();g.moveTo(x-span/2,y-58*s);
  g.quadraticCurveTo(x,y-38*s,x+span/2,y-58*s);g.stroke();
  g.strokeStyle='#6b5b3a';g.lineWidth=1.2;
  for(let i=1;i<8;i++){const t=i/8;
    const rx=x-span/2+t*span, ry=y-58*s+18*s*Math.sin(t*Math.PI);
    g.beginPath();g.moveTo(rx-2,ry-3);g.lineTo(rx+2,ry+3);g.stroke();}
  // straw tassels hang under the rope
  g.strokeStyle='#a8945c';g.lineWidth=1.8;
  for(let i=0;i<6;i++){const t=.12+i*.15;
    const rx=x-span/2+t*span, ry=y-58*s+18*s*Math.sin(t*3.14);
    g.beginPath();g.moveTo(rx,ry);g.lineTo(rx+(wob(i,seed)-.5)*6*s,ry+11*s);g.stroke();}}

// jizō: the roadside guardian, snow on his hood, a red bib
function pJizo(g,x,y,s,seed){
  const h=52*s;
  sh(g,x,y+3,15*s,6*s,.15);
  g.fillStyle='#6a655e';
  g.beginPath(); // the robed body, one soft shape
  g.moveTo(x-12*s,y);g.quadraticCurveTo(x-14*s,y-h*.5,x-7*s,y-h*.66);
  g.quadraticCurveTo(x,y-h*.78,x+7*s,y-h*.66);
  g.quadraticCurveTo(x+14*s,y-h*.5,x+12*s,y);g.closePath();g.fill();
  g.strokeStyle='#3c3934';g.lineWidth=1.4;g.stroke();
  // the hood
  g.fillStyle='#57534e';
  g.beginPath();g.arc(x,y-h*.66,8.4*s,3.14,0);g.closePath();g.fill();
  // closed eyes — he has seen enough
  g.strokeStyle='#3c3934';g.lineWidth=1.1;
  g.beginPath();g.moveTo(x-4.6*s,y-h*.64);g.lineTo(x-1.6*s,y-h*.62);g.stroke();
  g.beginPath();g.moveTo(x+1.6*s,y-h*.62);g.lineTo(x+4.6*s,y-h*.64);g.stroke();
  // the red bib, pinned, worn
  g.fillStyle=RED;
  g.beginPath();g.moveTo(x-6.5*s,y-h*.56);g.lineTo(x+6.5*s,y-h*.56);
  g.lineTo(x+4*s,y-h*.3);g.lineTo(x-4*s,y-h*.32);g.closePath();g.fill();
  g.strokeStyle='rgba(24,17,14,0.3)';g.lineWidth=.8;g.stroke();
  // snow on his shoulders and hood
  g.fillStyle='rgba(248,250,252,0.75)';
  g.beginPath();g.ellipse(x,y-h*.74,8.4*s,3*s,0,3.14,0);g.fill();
  g.beginPath();g.ellipse(x-8*s,y-h*.52,5*s,2*s,-.3,0,T2);g.fill();
  g.beginPath();g.ellipse(x+8*s,y-h*.5,4.4*s,1.8*s,.3,0,T2);g.fill();
  // pebble offerings
  g.fillStyle='#8a8578';
  g.beginPath();g.arc(x-16*s,y+2,2*s,0,T2);g.arc(x+15*s,y+2,1.6*s,0,T2);g.fill();}

// the war camp taiko: rim studs, rope lacing, a stand that has been hit
function pTaiko(g,x,y,s,seed){
  const r=34*s;
  sh(g,x,y+5,r*1.3,r*.4,.2);
  // stand first
  g.strokeStyle='#3a2c1a';g.lineWidth=6*s;
  g.beginPath();g.moveTo(x-r*.8,y+2);g.lineTo(x-r*.95,y-30*s);g.stroke();
  g.beginPath();g.moveTo(x+r*.8,y+2);g.lineTo(x+r*.95,y-30*s);g.stroke();
  g.beginPath();g.moveTo(x-r*.9,y-28*s);g.lineTo(x+r*.9,y-28*s);g.stroke();
  // the barrel
  g.fillStyle='#54331e';
  g.beginPath();g.ellipse(x,y-r*.62,r,r*.62,0,0,T2);g.fill();
  g.strokeStyle='#241f1c';g.lineWidth=3.4;g.stroke();
  // the skin
  g.fillStyle='#cfc2a2';
  g.beginPath();g.ellipse(x,y-r*.62,r*.74,r*.42,0,0,T2);g.fill();
  g.strokeStyle='#8c6d1f';g.lineWidth=2;g.stroke();
  g.strokeStyle='rgba(140,109,31,0.5)';g.lineWidth=1;
  g.beginPath();g.ellipse(x,y-r*.62,r*.5,r*.27,0,0,T2);g.stroke();
  // rim studs
  g.fillStyle='#241f1c';
  for(let i=0;i<10;i++){const a=i/10*T2;
    g.beginPath();g.arc(x+Math.cos(a)*r*.92,y-r*.62+Math.sin(a)*r*.56,2.4*s,0,T2);g.fill();}
  // rope lacing — X over the rim edge
  g.strokeStyle='#8c7a4e';g.lineWidth=2.2;
  for(let i=0;i<6;i++){const a=i/6*T2+.3;
    const px=x+Math.cos(a)*r,py=y-r*.62+Math.sin(a)*r*.62;
    g.beginPath();g.moveTo(px-3*s,py-4*s);g.lineTo(px+3*s,py+4*s);g.stroke();
    g.beginPath();g.moveTo(px+3*s,py-4*s);g.lineTo(px-3*s,py+4*s);g.stroke();}
  // mallets resting against it
  ln(g,x+r*1.05,y+2,x+r*1.3,y-r*.9,4*s,'#6b4e2e');
  g.fillStyle='#3a3430';
  g.beginPath();g.ellipse(x+r*1.3,y-r*.92,5*s,4*s,-.4,0,T2);g.fill();}

// tate: the standing arrow shield, planted in a lean
function pTate(g,x,y,s,seed){
  const h=64*s,lean=(wob(seed,3.7)-.5)*.14;
  sh(g,x,y+3,17*s,7*s,.16);
  g.save();g.translate(x,y);g.rotate(lean);
  g.fillStyle='#6b5b3a';
  g.beginPath();
  g.moveTo(-13*s,2);g.lineTo(-13*s,-h*.72);g.quadraticCurveTo(0,-h,13*s,-h*.72);
  g.lineTo(13*s,2);g.closePath();g.fill();
  g.strokeStyle='#3a2c1a';g.lineWidth=2.2;g.stroke();
  g.strokeStyle='rgba(24,17,14,0.35)';g.lineWidth=1.4;
  for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(i*5*s,-h*.7);g.lineTo(i*5*s,1);g.stroke();}
  ln(g,0,-h*.5,0,0,5*s,'#3a2c1a'); // the brace
  ln(g,-12*s,-h*.34,12*s,-h*.3,3.4*s,'#4a3f28'); // the crossbar
  // arrow wounds — spent shafts standing in the wood
  ln(g,-4*s,-h*.55,-6*s,-h*.55-16*s,1.6,'#2c2c26');
  ln(g,5*s,-h*.6,7.5*s,-h*.6-14*s,1.6,'#2c2c26');
  g.strokeStyle='#d8cbb0';g.lineWidth=2.4;g.lineCap='round';
  g.beginPath();g.moveTo(-7.5*s,-h*.55-12*s);g.lineTo(-4*s,-h*.55-15*s);g.stroke();
  g.beginPath();g.moveTo(6.5*s,-h*.6-10*s);g.lineTo(9.5*s,-h*.6-13.5*s);g.stroke();
  g.restore();}

// spent arrows in the ground, grouped
function pArrows(g,x,y,s,n,seed){
  sh(g,x,y+2,13*s*n*.4,4.5*s,.1);
  for(let i=0;i<n;i++){
    const ax=x+(i-(n-1)/2)*9*s, an=-.9+wob(i,seed)*.9, L=(20+wob(i+5,seed)*14)*s;
    ln(g,ax,y,ax+Math.cos(an)*L,y+Math.sin(an)*L,1.8,'#2c2c26');
    const fx=ax+Math.cos(an)*L,fy=y+Math.sin(an)*L;
    g.strokeStyle='#d8cbb0';g.lineWidth=2.6;
    g.beginPath();g.moveTo(fx-Math.cos(an-.5)*7*s,fy-Math.sin(an-.5)*7*s);g.lineTo(fx,fy);g.stroke();
    g.beginPath();g.moveTo(fx-Math.cos(an+.5)*7*s,fy-Math.sin(an+.5)*7*s);g.lineTo(fx,fy);g.stroke();}}

// gorintō: five stones stacked — one has lost its head
function pGorinto(g,x,y,s,seed){
  const w=17*s,broken=wob(seed,7.7)>.5;
  sh(g,x,y+3,w*1.5,6*s,.17);
  g.fillStyle='#5a544c';
  g.fillRect(x-w,y-w*.5,w*2,w);                     // 地 earth
  g.beginPath();g.ellipse(x,y-w*1.1,w*.86,w*.62,0,0,T2);g.fill(); // 水 water
  g.beginPath();g.moveTo(x-w*.6,y-w*1.5);g.lineTo(x,y-w*2.3);g.lineTo(x+w*.6,y-w*1.5);g.closePath();g.fill(); // 火 fire
  g.beginPath();g.arc(x,y-w*2.5,w*.5,3.14,0);g.closePath();g.fill();   // 風 wind
  g.fillStyle='#57534e';
  g.beginPath();g.arc(x,y-w*3.1,w*.34,0,T2);g.fill();  // 空 void
  g.strokeStyle='#332f2a';g.lineWidth=1.2;
  g.strokeRect(x-w,y-w*.5,w*2,w);
  if(broken){ // the void stone fell
    g.fillStyle='#57534e';
    g.beginPath();g.arc(x+w*1.6,y-w*.2,w*.3,0,T2);g.fill();
    g.strokeStyle='rgba(90,84,76,0.5)';g.lineWidth=1;
    g.beginPath();g.moveTo(x+w*1.6,y-w*.2);g.lineTo(x-w*.2,y-w*2.6);g.stroke();}}

// the burnt gate: two charred posts, a warped lintel
function pBurntGate(g,x,y,s,seed){
  const span=64*s;
  sh(g,x,y+5,span*1.1,20*s,.2);
  // right post, snapped halfway
  g.fillStyle='#33291f';
  g.beginPath();g.moveTo(x+span*.42,y);g.lineTo(x+span*.34,y-38*s);
  g.lineTo(x+span*.44,y-34*s);g.lineTo(x+span*.52,y);g.closePath();g.fill();
  // the fallen top
  g.save();g.translate(x+span*.55,y-6*s);g.rotate(.5);
  g.fillRect(-4*s,-30*s,8*s,30*s);g.restore();
  // left post, still standing, charred
  g.fillStyle='#3a2f24';
  g.beginPath();g.moveTo(x-span*.52,y);g.lineTo(x-span*.44,y-70*s);
  g.lineTo(x-span*.36,y-66*s);g.lineTo(x-span*.28,y);g.closePath();g.fill();
  // ember glow lives in the left post's crack
  const gr=g.createRadialGradient(x-span*.44,y-40*s,0,x-span*.44,y-40*s,26*s);
  gr.addColorStop(0,'rgba(201,118,46,0.28)');gr.addColorStop(1,'rgba(201,118,46,0)');
  g.fillStyle=gr;g.beginPath();g.arc(x-span*.44,y-40*s,26*s,0,T2);g.fill();
  g.strokeStyle='#c9762e';g.lineWidth=1.6;
  g.beginPath();g.moveTo(x-span*.44,y-26*s);g.lineTo(x-span*.42,y-48*s);g.stroke();
  // warped lintel
  g.strokeStyle='#2c241c';g.lineWidth=9*s;g.lineCap='round';
  g.beginPath();g.moveTo(x-span*.58,y-72*s);g.quadraticCurveTo(x,y-58*s,x+span*.3,y-66*s);g.stroke();
  g.strokeStyle='rgba(90,80,66,0.5)';g.lineWidth=2;
  g.beginPath();g.moveTo(x-span*.55,y-76*s);g.quadraticCurveTo(x,y-63*s,x+span*.28,y-70*s);g.stroke();}

// charred stump with roots out and embers in the heart
function pStump(g,x,y,s,seed){
  const r=22*s;
  sh(g,x,y+4,r*1.6,r*.5,.2);
  g.fillStyle='#2e2620';
  g.beginPath();g.ellipse(x,y,r,r*.55,0,0,T2);g.fill();
  g.strokeStyle='#1d1812';g.lineWidth=1.6;g.stroke();
  // roots
  g.strokeStyle='#2e2620';g.lineWidth=5*s;g.lineCap='round';
  for(let i=0;i<5;i++){const a=2.4+i/5*2.6;
    g.beginPath();g.moveTo(x+Math.cos(a)*r*.6,y+Math.sin(a)*r*.3);
    g.quadraticCurveTo(x+Math.cos(a)*r*1.4,y+Math.sin(a)*r*.6,x+Math.cos(a)*r*1.9,y+Math.sin(a)*r*.3);g.stroke();}
  // the split heart, still warm
  g.fillStyle='#241f1c';
  g.beginPath();g.ellipse(x,y-2,r*.62,r*.3,0,0,T2);g.fill();
  const gr=g.createRadialGradient(x,y-2,0,x,y-2,r*.7);
  gr.addColorStop(0,'rgba(230,110,40,0.4)');gr.addColorStop(1,'rgba(230,110,40,0)');
  g.fillStyle=gr;g.beginPath();g.arc(x,y-2,r*.7,0,T2);g.fill();
  g.strokeStyle='rgba(230,110,40,0.6)';g.lineWidth=1.4;
  g.beginPath();g.moveTo(x-r*.4,y-4);g.lineTo(x+r*.3,y);g.lineTo(x+r*.5,y-6);g.stroke();}

// the blank page's props: pencil ghosts, unfinished strokes
function pSketchTorii(g,x,y,s,seed){
  g.strokeStyle='rgba(29,26,22,0.20)';g.lineWidth=2;g.lineCap='round';
  const span=56*s,h=72*s;
  // the near pillar, fully there
  g.beginPath();g.moveTo(x-span*.4,y);g.lineTo(x-span*.38,y-h);g.stroke();
  // the far pillar, abandoned mid-stroke
  g.strokeStyle='rgba(29,26,22,0.10)';
  g.beginPath();g.moveTo(x+span*.38,y);g.lineTo(x+span*.40,y-h*.55);g.stroke();
  g.strokeStyle='rgba(29,26,22,0.16)';
  g.beginPath();g.moveTo(x-span*.55,y-h);g.quadraticCurveTo(x,y-h*1.1,x+span*.5,y-h*.98);g.stroke();
  g.beginPath();g.moveTo(x-span*.44,y-h*.8);g.lineTo(x+span*.42,y-h*.78);g.stroke();
  // a second ghost, drawn and erased — misregistered
  g.strokeStyle='rgba(29,26,22,0.07)';
  g.beginPath();g.moveTo(x-span*.4+5*s,y+3);g.lineTo(x-span*.38+5*s,y-h+4*s);g.stroke();
  g.beginPath();g.moveTo(x-span*.5+5*s,y-h+6*s);g.quadraticCurveTo(x+5*s,y-h*1.1+6*s,x+span*.5+5*s,y-h*.92+6*s);g.stroke();}

// higanbana — red spider lilies, the vermilion road's own flower
function pHigan(g,x,y,s,n,seed){
  for(let i=0;i<n;i++){
    const px=x+(i-(n-1)/2)*7*s+(wob(i,seed)-.5)*6*s;
    const lean=(wob(i+3,seed)-.5)*22*s;
    const h=(26+wob(i+7,seed)*20)*s;
    g.strokeStyle='#3f3327';g.lineWidth=1.5*s;
    g.beginPath();g.moveTo(px,y);
    g.quadraticCurveTo(px+lean*.4,y-h*.6,px+lean,y-h);g.stroke();
    const tx=px+lean,ty=y-h;
    // the umbel: petals curling back, stamens reaching out
    const m=4+((wob(i+11,seed)*3)|0);
    for(let j=0;j<m;j++){
      const a=-1.2+j/(m-1)*2.4;
      const bx=tx+Math.cos(a)*8*s,by=ty+Math.sin(a)*8*s;
      g.fillStyle=RED;
      g.beginPath();
      g.moveTo(bx,by);
      g.quadraticCurveTo(bx+Math.cos(a+1.3)*9*s,by+Math.sin(a+1.3)*9*s,bx+Math.cos(a+1.9)*6*s,by+Math.sin(a+1.9)*6*s);
      g.quadraticCurveTo(bx+Math.cos(a+.6)*5*s,by+Math.sin(a+.6)*5*s,bx,by);
      g.closePath();g.fill();
      // stamen
      g.strokeStyle=RED2;g.lineWidth=1*s;
      g.beginPath();g.moveTo(bx,by);
      g.lineTo(bx+Math.cos(a+.4)*11*s,by+Math.sin(a+.4)*11*s);g.stroke();
      g.fillStyle='#d0523c';
      g.beginPath();g.arc(bx+Math.cos(a+.4)*11*s,by+Math.sin(a+.4)*11*s,1.1*s,0,T2);g.fill();}}
  sh(g,x,y+2,n*5*s,4*s,.1);}

// torii — the vermilion road's gates, weathered dark wood
function pTorii(g,x,y,s,seed){
  const span=58*s,h=78*s;
  sh(g,x,y+4,span*1.2,10*s,.18);
  g.strokeStyle='#4a3a28';g.lineWidth=8*s;g.lineCap='round';
  g.beginPath();g.moveTo(x-span*.48,y);g.lineTo(x-span*.42,y-h);g.stroke();
  g.beginPath();g.moveTo(x+span*.48,y);g.lineTo(x+span*.42,y-h);g.stroke();
  // nuki — the lower tie
  g.lineWidth=5*s;
  g.beginPath();g.moveTo(x-span*.58,y-h*.72);g.lineTo(x+span*.58,y-h*.72);g.stroke();
  // kasagi — the curved cap, with its ridge
  g.strokeStyle='#33291f';g.lineWidth=7*s;
  g.beginPath();g.moveTo(x-span*.66,y-h*.94);g.quadraticCurveTo(x,y-h*1.12,x+span*.66,y-h*.94);g.stroke();
  g.strokeStyle='rgba(246,241,226,0.14)';g.lineWidth=1.6;
  g.beginPath();g.moveTo(x-span*.6,y-h*.97);g.quadraticCurveTo(x,y-h*1.14,x+span*.6,y-h*.97);g.stroke();
  // weathering: pale streaks down the pillars
  g.strokeStyle='rgba(246,241,226,0.10)';g.lineWidth=1.2;
  g.beginPath();g.moveTo(x-span*.44,y-h*.6);g.lineTo(x-span*.43,y-4*s);g.stroke();
  g.beginPath();g.moveTo(x+span*.47,y-h*.5);g.lineTo(x+span*.46,y-4*s);g.stroke();}

// ema — votive tablets on a rack, wishes facing the road
function pEma(g,x,y,s,seed){
  const n=4;
  sh(g,x,y+3,26*s,7*s,.13);
  ln(g,x-24*s,y+2,x-24*s,y-52*s,4*s,'#4a3f28');
  ln(g,x+24*s,y+2,x+24*s,y-52*s,4*s,'#4a3f28');
  ln(g,x-26*s,y-48*s,x+26*s,y-48*s,3.4*s,'#4a3f28');
  for(let i=0;i<n;i++){
    const tx=x-18*s+i*12*s+(wob(i,seed)-.5)*3*s;
    const ty=y-48*s+6*s;
    ln(g,tx,ty-2,tx,ty+6*s,1,'#6b5b3a'); // the cord
    g.fillStyle='#d8cbb0';
    g.beginPath();
    g.moveTo(tx-5*s,ty+5*s);g.lineTo(tx-5*s,ty+18*s);g.lineTo(tx,ty+24*s);
    g.lineTo(tx+5*s,ty+18*s);g.lineTo(tx+5*s,ty+5*s);g.closePath();g.fill();
    g.strokeStyle='#8a8574';g.lineWidth=.8;g.stroke();
    g.fillStyle='#8c2b1f';g.beginPath();g.arc(tx,ty+8*s,1.2*s,0,T2);g.fill();
    g.strokeStyle='rgba(74,68,60,0.5)';g.lineWidth=.8; // a wish, illegible
    g.beginPath();g.moveTo(tx-3*s,ty+14*s);g.lineTo(tx+2*s,ty+16*s);g.stroke();}}

// the painter's desk, spilled across the sealed page
function pInkstone(g,x,y,s,seed){
  sh(g,x,y+3,34*s,9*s,.12);
  g.fillStyle='#3a342c';
  g.beginPath();g.ellipse(x,y,30*s,13*s,-.1,0,T2);g.fill();
  g.strokeStyle='#241f1c';g.lineWidth=1.6;g.stroke();
  g.fillStyle='rgba(29,26,22,0.8)'; // the pool
  g.beginPath();g.ellipse(x-4*s,y-1,20*s,8*s,-.1,0,T2);g.fill();
  g.strokeStyle='rgba(246,241,226,0.14)';g.lineWidth=1;
  g.beginPath();g.ellipse(x-4*s,y-1,16*s,6*s,-.1,.5,2.5);g.stroke();
  // the brush, laid down pointing away
  ln(g,x+14*s,y-4*s,x+52*s,y-14*s,3.4*s,'#6b4e2e');
  g.fillStyle='#241f1c';
  g.beginPath();g.moveTo(x+52*s,y-14*s);g.quadraticCurveTo(x+62*s,y-18*s,x+66*s,y-12*s);
  g.quadraticCurveTo(x+60*s,y-10*s,x+52*s,y-12*s);g.closePath();g.fill();
  // one red seal, drying
  g.save();g.translate(x-38*s,y-14*s);g.rotate(-.12);
  g.strokeStyle='rgba(179,55,42,0.5)';g.lineWidth=2.2;g.strokeRect(-7*s,-7*s,14*s,14*s);
  g.fillStyle='rgba(179,55,42,0.22)';g.fillRect(-5*s,-5*s,10*s,10*s);
  g.restore();}

// ============================================================================
// DECO.buildFloor — bake the set pieces into the floor canvas
// ============================================================================
D.buildFloor=function(act,g,seed){
  try{
  const S=1;
  if(act===1){ // the rice fields at dusk — worked, then abandoned
    const[kx,ky]=farPos(act,0,4,seed+911);pKakashi(g,kx,ky,S,seed+1);
    const[sx,sy]=farPos(act,1,4,seed+913);pSheaf(g,sx,sy,S,seed+2);
    pSheaf(g,sx+26,sy+8*S,.85,seed+3);
    pSheaf(g,sx-24,sy+14*S,.9,seed+4);
    const[wx,wy]=farPos(act,2,4,seed+917);pWell(g,wx,wy,S,seed+5);
    const[fx,fy]=farPos(act,3,4,seed+919);pFence(g,fx,fy,S,6,seed+6);
  }
  else if(act===2){ // the flooded bridge — everything the river claimed
    const[bx,by]=farPos(act,0,4,seed+921);pBridge(g,bx,by,S,seed+1);
    const[sx,sy]=farPos(act,1,4,seed+923);pSampan(g,sx,sy,S,seed+2);
    // mooring posts with rope
    const[mx,my]=farPos(act,2,4,seed+925);
    sh(g,mx,my+4,30*S,9*S,.14);
    ln(g,mx-18*S,my+2,mx-20*S,my-40*S,5*S,'#3a2c1a');
    ln(g,mx+18*S,my+2,mx+16*S,my-34*S,5*S,'#3a2c1a');
    g.strokeStyle='#8c7a4e';g.lineWidth=1.6;
    g.beginPath();g.moveTo(mx-19*S,my-34*S);g.quadraticCurveTo(mx,my+4*S,mx+17*S,my-28*S);g.stroke();
    g.beginPath();g.moveTo(mx-19*S,my-26*S);g.quadraticCurveTo(mx-2,my+10*S,mx+17*S,my-20*S);g.stroke();
  }
  else if(act===3){ // the bamboo court — a shrine someone keeps
    for(let i=0;i<3;i++){
      const x=hash01(seed+90+i*17)*RW,y=hash01(seed+91+i*23)*RH;
      if(dist(x,y,RW/2,RH*.68)<150)continue;
      pToro(g,x,y,.9+i*.15,seed+i,true);}
    const[px,py]=farPos(act,2,4,seed+931);pShimePosts(g,px,py,S,110,seed+3);
    // a stone basin waits at the court's edge
    const[cx,cy]=farPos(act,3,4,seed+933);
    sh(g,cx,cy+3,16*S,6*S,.14);
    g.fillStyle='#5a544c';g.beginPath();g.ellipse(cx,cy-8*S,13*S,6*S,0,0,T2);g.fill();
    g.fillStyle='#2c3548';g.beginPath();g.ellipse(cx,cy-10*S,9*S,3.6*S,0,0,T2);g.fill();
    g.strokeStyle='#3c3934';g.lineWidth=1.6;g.stroke();
    ln(g,cx+12*S,cy-14*S,cx+17*S,cy-9*S,1.6,'#6b4e2e'); // the ladle
    // a fallen bamboo stalk, cut and left
    const[lx,ly]=farPos(act,0,4,seed+935);
    sh(g,lx,ly+4,60*S,8*S,.12);
    g.strokeStyle='#4a6a44';g.lineWidth=8*S;g.lineCap='round';
    g.beginPath();g.moveTo(lx-56*S,ly);g.quadraticCurveTo(lx,ly-8*S,lx+52*S,ly-4*S);g.stroke();
    g.strokeStyle='rgba(246,241,226,0.16)';g.lineWidth=1.6;
    g.beginPath();g.moveTo(lx-52*S,ly-2);g.quadraticCurveTo(lx,ly-10*S,lx+48*S,ly-6*S);g.stroke();
  }
  else if(act===4){ // the white gale — guardians under the snow
    const[jx,jy]=farPos(act,0,4,seed+941);pJizo(g,jx,jy,1,seed+1);
    const[j2x,j2y]=farPos(act,1,4,seed+943);pJizo(g,j2x,j2y,.78,seed+2);
    // footprints, wandering off-stage
    g.fillStyle='rgba(74,84,104,0.30)';
    for(let i=0;i<16;i++){
      const fx=RW*.15+i*38+wob(i,seed)*16, fy=RH*.72+Math.sin(i*.6)*26;
      g.save();g.translate(fx,fy);g.rotate(wob(i+3,seed)*.8);
      g.beginPath();g.ellipse(0,0,4,2.2,0,0,T2);g.fill();g.restore();}
    // a snow-buried fence
    const[fx,fy]=farPos(act,2,4,seed+945);
    for(let i=0;i<5;i++){const bx=fx+(i-2)*11*S;
      ln(g,bx,fy+2,bx+(wob(i,seed)-.5)*4,fy-30*S,3*S,'#4a3f28');
      g.fillStyle='rgba(248,250,252,0.7)';
      g.beginPath();g.ellipse(bx,fy-30*S,4.4*S,3*S,0,0,T2);g.fill();}
    g.fillStyle='rgba(248,250,252,0.55)';
    g.beginPath();g.ellipse(fx,fy+2,34*S,9*S,0,0,T2);g.fill();
  }
  else if(act===5){ // the storm drum — a war camp caught mid-war
    const[tx,ty]=farPos(act,0,5,seed+951);pTaiko(g,tx,ty,1.1,seed+1);
    const[ax,ay]=farPos(act,1,5,seed+953);pArrows(g,ax,ay,1,5,seed+2);
    const[a2x,a2y]=farPos(act,2,5,seed+955);pArrows(g,a2x,a2y,1,3,seed+3);
    const[sx,sy]=farPos(act,3,5,seed+957);pTate(g,sx,sy,1,seed+4);
    pTate(g,sx+34,sy+16,.92,seed+5);
    pTate(g,sx-30,sy+22,.88,seed+6);
    // a spear rack
    const[rx,ry]=farPos(act,4,5,seed+959);
    ln(g,rx,ry+2,rx-8,ry-38*S,4*S,'#3a2c1a');
    ln(g,rx,ry+2,rx+12,ry-34*S,4*S,'#3a2c1a');
    ln(g,rx-8,ry-38*S,rx+12,ry-34*S,3*S,'#3a2c1a');
    ln(g,rx-4,ry-36*S,rx-14,ry-70*S,2.2,'#2c2c26');
    ln(g,rx+6,ry-33*S,rx-2,ry-64*S,2.2,'#2c2c26');
    ln(g,rx-14,ry-70*S,rx-10,ry-78*S,3.4,'#8795a5'); // steel tips
    ln(g,rx-2,ry-64*S,rx+2,ry-72*S,3.4,'#8795a5');
  }
  else if(act===6){ // the ash garden — graves and what the fire left
    const[gx,gy]=farPos(act,0,5,seed+961);pGorinto(g,gx,gy,1,seed+1);
    const[g2x,g2y]=farPos(act,1,5,seed+963);pGorinto(g,g2x,g2y,.8,seed+2);
    const[bx,by]=farPos(act,2,5,seed+965);pBurntGate(g,bx,by,1,seed+3);
    const[sx,sy]=farPos(act,3,5,seed+967);pStump(g,sx,sy,1,seed+4);
    const[s2x,s2y]=farPos(act,4,5,seed+969);pStump(g,s2x,s2y,.7,seed+5);
  }
  else if(act===7){ // the blank — the painter's pencil, left on the page
    const[tx,ty]=farPos(act,0,3,seed+971);pSketchTorii(g,tx,ty,1,seed+1);
    const[kx,ky]=farPos(act,1,3,seed+973);pSketchTorii(g,kx,ky,.7,seed+2);
    // registration marks, margin ticks
    g.strokeStyle='rgba(29,26,22,0.14)';g.lineWidth=1.2;
    for(let i=0;i<6;i++){
      const x=RW*(.12+i*.15),y=RH*(.2+hash01(seed+i)*.6);
      g.beginPath();g.moveTo(x-8,y);g.lineTo(x+8,y);g.moveTo(x,y-8);g.lineTo(x,y+8);g.stroke();}
  }
  else if(act===8){ // the abyss — offerings nobody sane made
    const[bx,by]=farPos(act,0,3,seed+981);
    sh(g,bx,by+4,20*S,7*S,.2);
    g.fillStyle='#2c2c2c';
    g.beginPath();g.moveTo(bx-16*S,by);g.lineTo(bx-14*S,by-20*S);
    g.quadraticCurveTo(bx,by-30*S,bx+14*S,by-20*S);g.lineTo(bx+16*S,by);g.closePath();g.fill();
    g.strokeStyle='#15130f';g.lineWidth=1.6;g.stroke();
    const gr=g.createRadialGradient(bx,by-16*S,0,bx,by-16*S,30*S);
    gr.addColorStop(0,'rgba(230,110,40,0.5)');gr.addColorStop(1,'rgba(230,110,40,0)');
    g.fillStyle=gr;g.beginPath();g.arc(bx,by-16*S,30*S,0,T2);g.fill();
    g.fillStyle='#e67328';
    for(let i=0;i<5;i++)g.fillRect(bx-10*S+i*4.6*S,by-14*S+hash01(seed+i)*6*S,2,2);
    // bones
    const[ox,oy]=farPos(act,1,3,seed+983);
    g.strokeStyle='#d8cbb0';g.lineWidth=2.6;g.lineCap='round';
    for(let i=0;i<4;i++){const a=hash01(seed+i*3)*T2;
      g.beginPath();g.moveTo(ox,oy);g.lineTo(ox+Math.cos(a)*14*S,oy+Math.sin(a)*7*S);g.stroke();}
    g.fillStyle='#d8cbb0';g.beginPath();g.ellipse(ox,oy-6*S,7*S,6*S,0,0,T2);g.fill();
    g.fillStyle='#2c2c2c';
    g.beginPath();g.arc(ox-2.4*S,oy-7*S,1.8*S,0,T2);g.arc(ox+2.4*S,oy-7*S,1.8*S,0,T2);g.fill();
  }
  else if(act===9){ // the night road — a pagoda keeps the moon company
    const[px,py]=farPos(act,0,3,seed+991);
    sh(g,px,py+4,26*S,9*S,.15);
    let w=26*S;
    for(let i=0;i<5;i++){
      const ty=py-i*16*S;
      g.fillStyle='#2c3038';
      g.beginPath();g.moveTo(px-w*.5,ty);g.quadraticCurveTo(px,ty-7*S,px+w*.5,ty);g.closePath();g.fill();
      g.fillStyle='#3c4250';g.fillRect(px-w*.34,ty-10*S,w*.68,10*S);
      g.strokeStyle='rgba(180,196,224,0.20)';g.lineWidth=1; // moonlight edge
      g.beginPath();g.moveTo(px-w*.5,ty);g.quadraticCurveTo(px,ty-7*S,px-w*.5,ty);g.stroke();
      w*=.82;}
    g.fillStyle='#22262e';g.fillRect(px-2*S,py-88*S,4*S,10*S);
  }
  else if(act===11){ // vermilion fields — gates and the red flowers
    const[tx,ty]=farPos(act,0,4,seed+1011);pTorii(g,tx,ty,1.35,seed+1);
    const[hx,hy]=farPos(act,1,4,seed+1013);pHigan(g,hx,hy,1.9,7,seed+2);
    const[h2x,h2y]=farPos(act,2,4,seed+1015);pHigan(g,h2x,h2y,1.5,5,seed+3);
    const[h3x,h3y]=farPos(act,3,4,seed+1019);pHigan(g,h3x,h3y,1.2,4,seed+5);
    const[ex,ey]=farPos(act,4,5,seed+1017);pEma(g,ex,ey,1.15,seed+4);
  }
  else if(act===12){ // the lantern river — torii posts in the water, a raft
    const[tx,ty]=farPos(act,0,4,seed+1021);
    sh(g,tx,ty+6,40*S,12*S,.13);
    g.strokeStyle='#33291f';g.lineWidth=9*S;g.lineCap='round';
    g.beginPath();g.moveTo(tx-26*S,ty);g.lineTo(tx-22*S,ty-46*S);g.stroke();
    g.beginPath();g.moveTo(tx+26*S,ty);g.lineTo(tx+22*S,ty-46*S);g.stroke();
    g.strokeStyle='#2c241c';g.lineWidth=6*S;
    g.beginPath();g.moveTo(tx-36*S,ty-52*S);g.quadraticCurveTo(tx,ty-64*S,tx+34*S,ty-52*S);g.stroke();
    g.strokeStyle='rgba(150,170,200,0.3)';g.lineWidth=1.2;
    g.beginPath();g.ellipse(tx-24*S,ty+4,22*S,7*S,0,0,T2);g.stroke();
    g.beginPath();g.ellipse(tx+24*S,ty+4,22*S,7*S,0,0,T2);g.stroke();
    // a moored lantern raft
    const[rx,ry]=farPos(act,1,4,seed+1023);
    sh(g,rx,ry+6,34*S,10*S,.12);
    g.strokeStyle='#4a3a26';g.lineWidth=7*S;g.lineCap='round';
    g.beginPath();g.moveTo(rx-28*S,ry);g.lineTo(rx+28*S,ry);g.stroke();
    g.strokeStyle='rgba(150,170,200,0.25)';g.lineWidth=1.4;
    g.beginPath();g.ellipse(rx,ry+5,34*S,9*S,0,0,T2);g.stroke();
    g.fillStyle='#d8cbb0';
    g.beginPath();g.ellipse(rx,ry-8*S,6*S,8*S,0,0,T2);g.fill();
    g.fillStyle='#e8a854';g.beginPath();g.ellipse(rx,ry-8*S,3*S,4*S,0,0,T2);g.fill();
    const gr=g.createRadialGradient(rx,ry-8*S,0,rx,ry-8*S,36*S);
    gr.addColorStop(0,'rgba(232,168,80,0.3)');gr.addColorStop(1,'rgba(232,168,80,0)');
    g.fillStyle=gr;g.beginPath();g.arc(rx,ry-8*S,36*S,0,T2);g.fill();
  }
  else if(act===13){ // the hollow court — a root arch, glow caps
    const[ax,ay]=farPos(act,0,4,seed+1031);
    sh(g,ax,ay+5,52*S,13*S,.16);
    g.strokeStyle='#2c3324';g.lineWidth=10*S;g.lineCap='round';
    g.beginPath();g.moveTo(ax-46*S,ay);g.quadraticCurveTo(ax-20*S,ay-64*S,ax+8*S,ay-58*S);
    g.quadraticCurveTo(ax+38*S,ay-50*S,ax+48*S,ay);g.stroke();
    g.strokeStyle='#1d2418';g.lineWidth=3*S;
    g.beginPath();g.moveTo(ax-30*S,ay-34*S);g.quadraticCurveTo(ax-10*S,ay-44*S,ax+4*S,ay-40*S);g.stroke();
    g.beginPath();g.moveTo(ax-40*S,ay-16*S);g.quadraticCurveTo(ax-16*S,ay-28*S,ax+16*S,ay-22*S);g.stroke();
    // glow caps in the shade
    for(let i=0;i<4;i++){
      const cx=ax+(hash01(seed+i*7)-.5)*80*S,cy=ay-hash01(seed+i*3)*30*S;
      g.fillStyle='rgba(150,210,170,0.25)';
      g.beginPath();g.arc(cx,cy,7*S,0,T2);g.fill();
      g.fillStyle='#9cc9a8';
      g.beginPath();g.ellipse(cx,cy,2.6*S,2*S,0,0,T2);g.fill();}
  }
  else if(act===14){ // the silver grass sea — one lone tree, bent by years
    const[lx,ly]=farPos(act,0,4,seed+1041);
    sh(g,lx,ly+5,34*S,11*S,.14);
    g.strokeStyle='#4a443a';g.lineWidth=8*S;g.lineCap='round';
    g.beginPath();g.moveTo(lx,ly);g.quadraticCurveTo(lx-8*S,ly-40*S,lx-26*S,ly-70*S);g.stroke();
    g.lineWidth=4*S;
    g.beginPath();g.moveTo(lx-8*S,ly-38*S);g.lineTo(lx+12*S,ly-52*S);g.stroke();
    g.beginPath();g.moveTo(lx-18*S,ly-56*S);g.lineTo(lx-30*S,ly-72*S);g.stroke();
    g.strokeStyle='#8c8e78';g.lineWidth=1.4; // wind-combed canopy
    for(let i=0;i<10;i++){
      const bx=lx-26*S+(hash01(seed+i*3)-.5)*34*S,by=ly-72*S+(hash01(seed+i*5)-.5)*18*S;
      g.beginPath();g.moveTo(bx,by);g.lineTo(bx+(hash01(seed+i*7)-.5)*30*S,by-9*S);g.stroke();}
  }
  else if(act===15){ // the ashfall court — a fallen bell, an offering stand
    const[bx,by]=farPos(act,0,4,seed+1051);
    sh(g,bx,by+6,36*S,11*S,.18);
    g.fillStyle='#6a5a30';
    g.beginPath();g.moveTo(bx-30*S,by);g.quadraticCurveTo(bx-26*S,by-34*S,bx+2*S,by-34*S);
    g.quadraticCurveTo(bx+28*S,by-32*S,bx+30*S,by);g.closePath();g.fill();
    g.strokeStyle='#33291f';g.lineWidth=2.2;g.stroke();
    g.fillStyle='#544620';
    g.beginPath();g.ellipse(bx,by,30*S,8*S,0,0,T2);g.fill();
    g.strokeStyle='#241f1c';g.lineWidth=1.6;
    g.beginPath();g.moveTo(bx-12*S,by-30*S);g.lineTo(bx-6*S,by-6*S);g.stroke(); // the crack
    g.strokeStyle='rgba(246,241,226,0.12)';g.lineWidth=1.4;
    g.beginPath();g.moveTo(bx-28*S,by-8*S);g.quadraticCurveTo(bx-14*S,by-26*S,bx+4*S,by-28*S);g.stroke();
    g.fillStyle='rgba(96,116,70,0.3)';
    g.beginPath();g.ellipse(bx+12*S,by-20*S,7*S,4*S,.4,0,T2);g.fill();
    // the offering stand
    const[ox,oy]=farPos(act,1,4,seed+1053);
    ln(g,ox,oy+2,ox,oy-24*S,5*S,'#3a3028');
    g.fillStyle='#5a544c';g.fillRect(ox-12*S,oy-32*S,24*S,8*S);
    g.fillStyle='#d8cbb0';
    g.beginPath();g.moveTo(ox-5*S,oy-32*S);g.lineTo(ox+5*S,oy-32*S);g.lineTo(ox+3*S,oy-24*S);g.lineTo(ox-3*S,oy-25*S);g.closePath();g.fill();
    g.strokeStyle='#8a8574';g.lineWidth=.8;g.stroke();
    ln(g,ox-2,oy-38*S,ox-3,oy-44*S,1,'#6b5b3a'); // dead incense
  }
  else if(act===16){ // the sealed blank — the painter's own desk
    const[ix,iy]=farPos(act,0,2,seed+1061);pInkstone(g,ix,iy,1,seed+1);
    const[tx,ty]=farPos(act,1,2,seed+1063);pSketchTorii(g,tx,ty,.9,seed+2);
  }
  else if(act===17){ // update 3.0 終 — the margin: a torii only half-committed to, a penciled fence
    const[tx,ty]=farPos(act,0,3,seed+1071);pSketchTorii(g,tx,ty,.85,seed+1);
    const[fx,fy]=farPos(act,1,3,seed+1073);pFence(g,fx,fy,1,5,seed+2);
    const[hx,hy]=farPos(act,2,3,seed+1077);pHigan(g,hx,hy,1,4,seed+3);
  }
  else if(act===18){ // update 3.0 終 — the parade: stone lanterns lit for the procession, red flowers at the roadside
    const[t1,t1y]=farPos(act,0,3,seed+1081);pToro(g,t1,t1y,1,seed+1,true);
    const[t2,t2y]=farPos(act,1,3,seed+1083);pToro(g,t2,t2y,.9,seed+2,true);
    const[hx,hy]=farPos(act,2,3,seed+1087);pHigan(g,hx,hy,1,6,seed+3);
  }
  else if(act===19){ // update 3.0 終 — the last page: the author's inkstone, and one wish left hanging
    const[ix,iy]=farPos(act,0,2,seed+1091);pInkstone(g,ix,iy,1.05,seed+1);
    const[ex,ey]=farPos(act,1,2,seed+1093);pEma(g,ex,ey,.95,seed+2);
  }
  }catch(e){/* a dressed stage must never break the game */}};

// ============================================================================
// THE LIVE SET — sashimono, water wheels, shide, smoke, dragonflies, lanterns
// ============================================================================

D.build=function(act){
  try{
  const live=[];
  const cut=IS_TOUCH?.6:1;
  if(act===5||act===6||act===8){ // war banners: the storm's own flags
    const n=Math.round((act===5?4:2)*cut);
    for(let i=0;i<n;i++){
      const[x,y]=farPos(act,i,n,act*77+i*3.3);
      live.push({k:'sash',x,y,h:(150+hash01(i*9.1)*40),
        col:act===5?'#a03226':(act===8?'#5a1f1a':'#3a332c'),
        ph:hash01(i*7.7)*T2});}
    if(act===8){ // the abyss chain-lanterns breathe on their posts
      for(let i=0;i<2;i++){const[x,y]=farPos(act,i+8,2,act*77+i*5.1);
        live.push({k:'lpost',x,y,h:110+hash01(i*3.3)*30,ph:hash01(i*1.9)*T2});}}}
  if(act===2||act===12){ // water wheels turn in the current
    const n=act===2?2:1;
    for(let i=0;i<n;i++){
      const[x,y]=farPos(act,i+3,n+1,act*77+i*2.9);
      live.push({k:'wheel',x,y,r:44+hash01(i*4.4)*12,ph:hash01(i*6.1)*T2});}}
  if(act===3||act===11){ // shide papers swing on their ropes
    for(let i=0;i<2;i++){
      const[x,y]=farPos(act,i+5,2,act*77+i*8.8);
      live.push({k:'shide',x,y,span:90+hash01(i*2.2)*40,n:5+(i%2),ph:hash01(i*3.9)*T2});}}
  if(act===6||act===15){ // smoke crawls off the burnt vents
    for(let i=0;i<2;i++){
      const[x,y]=farPos(act,i+7,2,act*77+i*6.6);
      live.push({k:'smoke',x,y,ph:hash01(i*5.5)*T2});}}
  if(act===1||act===14){ // dragonflies hold the evening
    const n=Math.round(4*cut);
    for(let i=0;i<n;i++)
      live.push({k:'dfly',ax:WALL+120+hash01(i*3.1+i)*(RW-WALL*2-240),
        ay:WALL+120+hash01(i*7.7+act)*(RH-WALL*2-240),
        rx:60+hash01(i*4.4)*90,ry:26+hash01(i*6.6)*40,ph:hash01(i*9.9)*T2});}
  if(act===9){ // the night road's shrine lamp breathes
    live.push({k:'lpost',x:RW*.5+hash01(9.1)*200,y:RH*.3,h:120,ph:1.7});}
  if(act>=17){ // update 3.0 終: the last page — unpainted banners, and paper prayers
    const bn=act===18?2:1;
    for(let i=0;i<bn;i++){const[x,y]=farPos(act,i+2,bn+1,act*77+i*4.4);
      live.push({k:'sash',x,y,h:140+hash01(i*8.8)*36,
        col:act===18?'#a03226':'#e8e2d2',ph:hash01(i*2.7)*T2});}
    if(act===18)for(let i=0;i<2;i++){const[x,y]=farPos(act,i+6,3,act*77+i*6.2);
      live.push({k:'shide',x,y,span:80+hash01(i*3.3)*30,n:5+(i%2),ph:hash01(i*5.5)*T2});}}
  G.live=live;
  // far and near bands are baked once per stage
  D.farBake(act);
  D.nearBake(act);
  }catch(e){G.live=[];}};

// ---- sashimono: a war banner answering the real wind --------------------------
function dSash(c,o){
  const t=G.t,w=G.wind,H=o.h;
  // shadow + pole
  c.fillStyle='rgba(29,24,20,0.15)';
  c.beginPath();c.ellipse(o.x,o.y+4,10,4.5,0,0,T2);c.fill();
  c.strokeStyle='#241f1c';c.lineWidth=3.2;c.lineCap='round';
  c.beginPath();c.moveTo(o.x,o.y+2);c.lineTo(o.x,o.y-H);c.stroke();
  const cb=H*.16;
  c.lineWidth=2.2;
  c.beginPath();c.moveTo(o.x-cb/2,o.y-H+5);c.lineTo(o.x+cb/2,o.y-H+5);c.stroke();
  // the cloth: three control points, each drifting harder down its length
  const L=H*.58,cw=cb*.94;
  const off=[];
  for(let i=0;i<=3;i++){
    const fr=i/3;
    off[i]=Math.sin(t*3.1+o.ph+fr*2.3)*(0.14+0.30*Math.abs(w))*fr*L
          +w*0.26*fr*L
          +Math.sin(t*5.3+o.ph*2)*2.4*fr;}
  const y0=o.y-H+7;
  c.fillStyle=o.col;
  c.beginPath();
  c.moveTo(o.x-cw/2+off[0],y0);
  for(let i=1;i<=3;i++)
    c.lineTo(o.x-cw/2*(1-i*.05)+off[i],y0+L*i/3);
  // ragged tail
  const bx=off[3],yb=y0+L;
  c.lineTo(o.x-cw/2*.95+bx-3,yb+5);
  c.lineTo(o.x+bx*.6,yb+12);
  c.lineTo(o.x+cw/2*.95+bx+3,yb+4);
  for(let i=3;i>=0;i--)
    c.lineTo(o.x+cw/2*(1-i*.05)+off[i],y0+L*i/3);
  c.closePath();c.fill();
  c.strokeStyle='rgba(24,17,14,0.35)';c.lineWidth=1;c.stroke();
  // the mon — a crest the house can read across the field
  const mx=o.x+off[1]+off[2]*.5,my=y0+L*.42;
  c.fillStyle='rgba(230,223,204,0.85)';
  c.beginPath();c.arc(mx,my,cw*.19,0,T2);c.fill();
  c.fillStyle=o.col;
  c.beginPath();c.arc(mx,my,cw*.11,0,T2);c.fill();
  // the pole's rope tie
  c.strokeStyle='#8c7a4e';c.lineWidth=1.2;
  c.beginPath();c.moveTo(o.x+off[0]-cw/2,y0+2);c.lineTo(o.x,y0+4);c.stroke();}

// ---- the water wheel: honest work, still turning -------------------------------
function dWheel(c,o){
  const a=G.t*.6+o.ph,r=o.r;
  // posts and axle
  c.fillStyle='rgba(29,24,20,0.14)';
  c.beginPath();c.ellipse(o.x,o.y+8,r*.9,r*.24,0,0,T2);c.fill();
  c.strokeStyle='#3a2c1a';c.lineWidth=6;
  c.beginPath();c.moveTo(o.x-r*.42,o.y+8);c.lineTo(o.x-r*.42,o.y-r*.8);c.stroke();
  c.beginPath();c.moveTo(o.x+r*.42,o.y+8);c.lineTo(o.x+r*.42,o.y-r*.8);c.stroke();
  c.strokeStyle='#241f1c';c.lineWidth=4;
  c.beginPath();c.moveTo(o.x-r*.42,o.y-r*.55);c.lineTo(o.x+r*.42,o.y-r*.55);c.stroke();
  // the wheel
  c.strokeStyle='#4a3a28';c.lineWidth=4.4;
  c.beginPath();c.arc(o.x,o.y-r*.55,r,0,T2);c.stroke();
  c.strokeStyle='#6b4e2e';c.lineWidth=2;
  c.beginPath();c.arc(o.x,o.y-r*.55,r*.88,0,T2);c.stroke();
  for(let i=0;i<8;i++){const an=a+i/8*T2;
    const cx=o.x+Math.cos(an)*r*.88,cy=o.y-r*.55+Math.sin(an)*r*.88;
    ln(c,o.x,o.y-r*.55,cx,cy,2,'#3a2c1a');
    // paddles ride the rim
    const px=o.x+Math.cos(an)*r,py=o.y-r*.55+Math.sin(an)*r;
    c.strokeStyle='#5c452c';c.lineWidth=4.4;c.lineCap='round';
    c.beginPath();c.moveTo(px,py);
    c.lineTo(px+Math.cos(an)*r*.26,py+Math.sin(an)*r*.26);c.stroke();}
  c.fillStyle='#241f1c';
  c.beginPath();c.arc(o.x,o.y-r*.55,r*.14,0,T2);c.fill();
  // where the rim dips, it kicks the water
  const dip=.5+.5*Math.sin(a*8);
  c.strokeStyle='rgba(170,190,220,'+(.12+.2*dip)+')';c.lineWidth=1.4;
  c.beginPath();c.ellipse(o.x+Math.cos(a)*r,o.y+6,r*.2,r*.06,0,0,T2);c.stroke();
  c.beginPath();c.ellipse(o.x+Math.cos(a+1)*r*.7,o.y+8,r*.14,r*.045,0,0,T2);c.stroke();}

// ---- shide: zigzag paper on a rope, swinging ----------------------------------
function dShide(c,o){
  const t=G.t;
  c.strokeStyle='#4a3f28';c.lineWidth=4.4;c.lineCap='round';
  ln(c,o.x-o.span/2,o.y+2,o.x-o.span/2,o.y-60,4.4,'#4a3f28');
  ln(c,o.x+o.span/2,o.y+2,o.x+o.span/2,o.y-60,4.4,'#4a3f28');
  c.strokeStyle='#8c7a4e';c.lineWidth=3.4;
  c.beginPath();c.moveTo(o.x-o.span/2,o.y-56);
  c.quadraticCurveTo(o.x,o.y-34,o.x+o.span/2,o.y-56);c.stroke();
  for(let i=0;i<o.n;i++){
    const t2=.1+i/(o.n-1)*.8;
    const sx=o.x-o.span/2+t2*o.span;
    const sy=o.y-56+22*Math.sin(t2*3.14);
    const sw=Math.sin(t*1.7+o.ph+i*1.3)*.16;
    c.save();c.translate(sx,sy);c.rotate(sw);
    c.fillStyle='#f2ecd9';
    c.beginPath();
    const h=26,w=7;
    c.moveTo(0,0);c.lineTo(-w*.5,h*.28);c.lineTo(w*.5,h*.42);
    c.lineTo(-w*.5,h*.7);c.lineTo(w*.4,h*.85);c.lineTo(0,h);
    c.lineTo(w*.3,h*.72);c.lineTo(-w*.4,h*.55);c.lineTo(w*.5,h*.3);
    c.closePath();c.fill();
    c.strokeStyle='rgba(74,68,60,0.4)';c.lineWidth=.6;c.stroke();
    c.restore();}}

// ---- smoke: three breaths crawling up off a vent --------------------------------
function dSmoke(c,o){
  const t=G.t;
  for(let j=0;j<3;j++){
    const p=(t*.13+o.ph+j/3)%1;
    const y=o.y-p*74;
    const x=o.x+Math.sin(t*.8+o.ph+j*2.1)*9*p;
    const a=(1-p)*.16;
    if(a<=.01)continue;
    c.fillStyle='rgba(120,112,100,'+a.toFixed(3)+')';
    c.beginPath();
    c.ellipse(x,y,4+p*15,3+p*11,Math.sin(t*.5+j)*.3,0,T2);c.fill();}}

// ---- dragonfly: a held hover, a dart, a return ----------------------------------
function dDfly(c,o){
  const t=G.t*.55+o.ph;
  const x=o.ax+Math.sin(t)*o.rx;
  const y=o.ay+Math.sin(t*2.3)*o.ry;
  const vx=Math.cos(t)*o.rx*.55,vy=Math.cos(t*2.3)*o.ry*1.2;
  const an=Math.atan2(vy,vx);
  c.save();c.translate(x,y);c.rotate(an);
  c.strokeStyle='#24201c';c.lineWidth=1.4;c.lineCap='round';
  c.beginPath();c.moveTo(-3,0);c.lineTo(6,0);c.stroke();
  c.lineWidth=.8;
  c.beginPath();c.moveTo(-3,0);c.lineTo(-9,0);c.stroke();
  c.fillStyle='#24201c';
  c.beginPath();c.arc(7,0,1.5,0,T2);c.fill();
  const fl=.3+.25*Math.sin(G.t*46+o.ph*9); // wings flicker past reading
  c.strokeStyle='rgba(246,241,226,'+fl.toFixed(2)+')';c.lineWidth=1.6;
  c.beginPath();c.moveTo(3,-1);c.lineTo(6.5,-6.5);c.stroke();
  c.beginPath();c.moveTo(3,1);c.lineTo(6.5,6.5);c.stroke();
  c.restore();}

// ---- the night lantern: a post, an arm, paper and flame -------------------------
function dLpost(c,o){
  const t=G.t,sw=Math.sin(t*.9+o.ph)*.1;
  c.fillStyle='rgba(29,24,20,0.16)';
  c.beginPath();c.ellipse(o.x,o.y+4,12,5,0,0,T2);c.fill();
  c.strokeStyle='#241f1c';c.lineWidth=4;c.lineCap='round';
  c.beginPath();c.moveTo(o.x,o.y+2);c.lineTo(o.x,o.y-o.h);c.stroke();
  c.beginPath();c.moveTo(o.x,o.y-o.h);c.lineTo(o.x+22,o.y-o.h+8);c.stroke();
  c.save();c.translate(o.x+22,o.y-o.h+8);c.rotate(sw);
  const br=.6+.4*Math.sin(t*3+o.ph);
  c.save();c.globalCompositeOperation='lighter';
  c.globalAlpha=.5*br;
  c.drawImage(glowEmber,-30,-24,60,60);
  c.restore();c.globalAlpha=1;
  c.strokeStyle='#2c2c26';c.lineWidth=1;
  c.beginPath();c.moveTo(0,0);c.lineTo(0,7);c.stroke();
  c.fillStyle='#d8cbb0';
  c.beginPath();c.ellipse(0,14,7,9,0,0,T2);c.fill();
  c.strokeStyle='#8c6d1f';c.lineWidth=.9;
  for(let j=-1;j<=1;j++){c.beginPath();c.ellipse(0,14+j*4.5,7*(1-Math.abs(j)*.12),1.8,0,0,T2);c.stroke();}
  c.fillStyle='#e8a854';
  c.beginPath();c.ellipse(0,14,3.2,4.4,0,0,T2);c.fill();
  c.fillStyle='#f0d27a';
  c.beginPath();c.arc(0,14,1.6*br,0,T2);c.fill();
  c.restore();}

D.drawLive=function(act){
  try{
  const live=G.live;
  if(!live||!live.length)return;
  const v=G.view;
  if(!v)return;
  for(let i=0;i<live.length;i++){
    const o=live[i];
    const m=o.k==='sash'?o.h+40:(o.k==='wheel'?o.r*3:(o.k==='dfly'?60:(o.k==='shide'?90:60)));
    if(o.x<v.x0-m||o.x>v.x1+m||o.y<v.y0-m||o.y>v.y1+m)continue;
    if(o.k==='sash')dSash(ctx,o);
    else if(o.k==='wheel')dWheel(ctx,o);
    else if(o.k==='shide')dShide(ctx,o);
    else if(o.k==='smoke')dSmoke(ctx,o);
    else if(o.k==='dfly')dDfly(ctx,o);
    else if(o.k==='lpost')dLpost(ctx,o);}
  }catch(e){}};

// ============================================================================
// THE AIR HAS DEPTH — far scenery band (slow parallax) + near silhouette band
// ============================================================================
const FARH=210,NEARH=160;
let farC=null, farAct=-1, nearC=null, nearAct=-1;

D.farBake=function(act){
  farC=null;farAct=-1;
  try{
  const FS=IS_TOUCH?1:2;
  const c=mkCanvas((RW+64)*FS,FARH*FS),g=c.getContext('2d');
  g.scale(FS,FS);
  paintFar(g,act);
  farC=c;farAct=act;
  }catch(e){farC=null;}};

function paintFar(g,act){
  const W2=RW+64,H2=FARH;
  const seed=act*13.7;
  // every scene melts into the arena below it — no hard seam, ever
  const fade=(col)=>{const gr=g.createLinearGradient(0,H2*.55,0,H2);
    gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');return gr;};
  g.save();
  g.beginPath();g.rect(0,0,W2,H2);g.clip();
  const ground=(fill,base)=>{ // the band's own ground + fog into the page
    g.fillStyle=fill;
    g.beginPath();g.moveTo(0,H2);
    for(let x=0;x<=W2;x+=90)g.lineTo(x,base+Math.sin(x*.011+seed)*8);
    g.lineTo(W2,H2);g.closePath();g.fill();};
  if(act===1){ // dusk hills, terraces, roofs, one cypress line
    g.fillStyle='rgba(196,150,90,0.20)';g.fillRect(0,0,W2,H2);
    g.fillStyle='rgba(120,110,74,0.5)';
    g.beginPath();g.moveTo(0,96);
    for(let x=0;x<=W2;x+=120)g.lineTo(x,96+vnoiseFar(x*.004+seed)*34);
    g.lineTo(W2,H2);g.lineTo(0,H2);g.closePath();g.fill();
    g.fillStyle='rgba(96,88,58,0.55)';
    g.beginPath();g.moveTo(0,128);
    for(let x=0;x<=W2;x+=120)g.lineTo(x,128+vnoiseFar(x*.006+seed*2)*26);
    g.lineTo(W2,H2);g.lineTo(0,H2);g.closePath();g.fill();
    // terrace lines on the near hill
    g.strokeStyle='rgba(74,68,52,0.3)';g.lineWidth=1.2;
    for(let i=0;i<4;i++){g.beginPath();g.moveTo(0,136+i*14);
      for(let x=0;x<=W2;x+=110)g.lineTo(x,136+i*14+vnoiseFar(x*.008+i+seed)*7);
      g.stroke();}
    // farmhouse roofs
    for(let i=0;i<4;i++){
      const rx=(i*.23+.08)*W2+vnoiseFar(i*9+seed)*60, ry=124+vnoiseFar(i*7+seed)*14;
      g.fillStyle='rgba(42,38,30,0.75)';
      g.beginPath();g.moveTo(rx-16,ry);g.lineTo(rx,ry-11);g.lineTo(rx+16,ry);g.closePath();g.fill();
      g.fillStyle='rgba(64,58,46,0.7)';
      g.fillRect(rx-12,ry,24,8);}
    g.fillStyle=fade('rgba(196,150,90,0.16)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===2){ // drowned trees, rain haze, a far bridge arc
    g.fillStyle='rgba(88,104,134,0.25)';g.fillRect(0,0,W2,H2);
    g.strokeStyle='rgba(52,62,88,0.55)';g.lineWidth=4;
    for(let i=0;i<7;i++){const x=(i*.14+.05)*W2,y=118+vnoiseFar(i*4+seed)*18;
      g.beginPath();g.moveTo(x,y);g.lineTo(x,y-26-vnoiseFar(i*8+seed)*16);g.stroke();
      g.lineWidth=1.6;
      g.beginPath();g.moveTo(x,y-16);g.lineTo(x-9,y-26);g.stroke();
      g.beginPath();g.moveTo(x,y-22);g.lineTo(x+8,y-32);g.stroke();
      g.lineWidth=4;}
    g.strokeStyle='rgba(70,80,104,0.5)';g.lineWidth=6;
    g.beginPath();g.moveTo(0,150);
    g.quadraticCurveTo(W2*.5,128,W2,152);g.stroke();
    g.fillStyle=fade('rgba(88,104,134,0.22)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===3){ // a bamboo wall, leaves ticking the top
    for(let i=0;i<44;i++){
      const x=hash01(seed+i*1.3)*W2,lean=(hash01(seed+i*2.1)-.5)*10;
      const top=14+hash01(seed+i*3.7)*44;
      g.strokeStyle='rgba(52,92,54,0.5)';g.lineWidth=3+hash01(seed+i*5.5)*2.5;
      g.beginPath();g.moveTo(x,H2);g.lineTo(x+lean,top);g.stroke();
      g.strokeStyle='rgba(80,126,80,0.28)';g.lineWidth=1;
      g.beginPath();g.moveTo(x+1,top);g.lineTo(x+lean+9,top-10);g.stroke();
      g.beginPath();g.moveTo(x+1,top+10);g.lineTo(x+lean-9,top+1);g.stroke();}
    g.fillStyle=fade('rgba(64,116,64,0.16)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===4){ // the white ridge, pine tips, snow light
    g.fillStyle='rgba(206,216,234,0.4)';g.fillRect(0,0,W2,H2);
    g.fillStyle='rgba(150,168,196,0.5)';
    g.beginPath();g.moveTo(0,86);
    for(let x=0;x<=W2;x+=130)g.lineTo(x,86+vnoiseFar(x*.003+seed)*30);
    g.lineTo(W2,H2);g.lineTo(0,H2);g.closePath();g.fill();
    g.strokeStyle='rgba(38,44,60,0.55)';g.lineWidth=3.4;
    for(let i=0;i<9;i++){const x=(i*.11+.04)*W2,y=140+vnoiseFar(i*6+seed)*14;
      g.beginPath();g.moveTo(x,y);g.lineTo(x,y-22);g.stroke();
      g.lineWidth=1.6;
      g.beginPath();g.moveTo(x,y-14);g.lineTo(x-8,y-21);g.stroke();
      g.beginPath();g.moveTo(x,y-18);g.lineTo(x+8,y-25);g.stroke();
      g.lineWidth=3.4;}
    g.fillStyle=fade('rgba(206,216,234,0.35)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===5){ // storm massifs under a bruised sky
    g.fillStyle='rgba(70,60,96,0.3)';g.fillRect(0,0,W2,H2);
    g.fillStyle='rgba(48,42,66,0.55)';
    g.beginPath();g.moveTo(0,104);
    for(let x=0;x<=W2;x+=140)g.lineTo(x,104+vnoiseFar(x*.005+seed)*38);
    g.lineTo(W2,H2);g.lineTo(0,H2);g.closePath();g.fill();
    g.fillStyle='rgba(34,30,50,0.65)';
    g.beginPath();g.moveTo(0,142);
    for(let x=0;x<=W2;x+=140)g.lineTo(x,142+vnoiseFar(x*.007+seed*3)*26);
    g.lineTo(W2,H2);g.lineTo(0,H2);g.closePath();g.fill();
    g.strokeStyle='rgba(26,22,40,0.5)';g.lineWidth=3;
    for(let i=0;i<7;i++){const x=(i*.13+.05)*W2,y=150+vnoiseFar(i*5+seed)*10;
      g.beginPath();g.moveTo(x,y);g.lineTo(x,y-26-vnoiseFar(i*9+seed)*8);g.stroke();}
    g.fillStyle=fade('rgba(70,60,96,0.24)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===6){ // the burnt forest, smoke standing where trees were
    g.fillStyle='rgba(90,82,74,0.25)';g.fillRect(0,0,W2,H2);
    g.strokeStyle='rgba(48,42,38,0.6)';g.lineWidth=4;
    for(let i=0;i<10;i++){const x=(i*.10+.04)*W2,y=138+vnoiseFar(i*7+seed)*16;
      const h=30+vnoiseFar(i*11+seed)*22;
      g.beginPath();g.moveTo(x,y);g.lineTo(x+(hash01(seed+i)-.5)*6,y-h);g.stroke();
      g.lineWidth=1.6;
      g.beginPath();g.moveTo(x,y-h*.6);g.lineTo(x-8,y-h*.9);g.stroke();
      g.beginPath();g.moveTo(x,y-h*.8);g.lineTo(x+7,y-h*1.1);g.stroke();
      g.lineWidth=4;}
    for(let i=0;i<3;i++){ // standing smoke
      const x=(i*.3+.2)*W2;
      const gr=g.createLinearGradient(x,60,x,150);
      gr.addColorStop(0,'rgba(120,112,104,0)');gr.addColorStop(.5,'rgba(120,112,104,0.25)');gr.addColorStop(1,'rgba(120,112,104,0)');
      g.fillStyle=gr;g.fillRect(x-16,60,32,90);}
    g.fillStyle=fade('rgba(90,82,74,0.24)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===7){ // the blank margin — one line, half an idea
    g.strokeStyle='rgba(29,26,22,0.10)';g.lineWidth=1.4;
    g.beginPath();g.moveTo(W2*.1,118);
    g.quadraticCurveTo(W2*.5,100,W2*.86,124);g.stroke();
    g.strokeStyle='rgba(29,26,22,0.06)';
    g.beginPath();g.moveTo(W2*.3,150);g.lineTo(W2*.42,150);g.stroke();
  }
  else if(act===8){ // the abyss — red murk and black shapes
    g.fillStyle='rgba(60,22,18,0.4)';g.fillRect(0,0,W2,H2);
    g.fillStyle='rgba(30,12,10,0.7)';
    g.beginPath();g.moveTo(0,120);
    for(let x=0;x<=W2;x+=140)g.lineTo(x,120+vnoiseFar(x*.006+seed)*40);
    g.lineTo(W2,H2);g.lineTo(0,H2);g.closePath();g.fill();
    g.strokeStyle='rgba(179,55,42,0.16)';g.lineWidth=2;
    g.beginPath();g.moveTo(0,70);
    for(let x=0;x<=W2;x+=160)g.lineTo(x,70+vnoiseFar(x*.005+seed*2)*30);
    g.stroke();
    g.fillStyle=fade('rgba(60,22,18,0.3)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===9){ // the moon road — indigo, a pagoda, stars
    g.fillStyle='rgba(30,38,58,0.5)';g.fillRect(0,0,W2,H2);
    g.fillStyle='rgba(236,238,242,0.5)';
    for(let i=0;i<20;i++)g.fillRect(hash01(seed+i*3.3)*W2,hash01(seed+i*7.7)*80,1.4,1.4);
    const mx=W2*.22,my=34;
    g.drawImage(glowWhite,mx-40,my-40,80,80);
    g.fillStyle='rgba(240,242,246,0.75)';
    g.beginPath();g.arc(mx,my,16,0,T2);g.fill();
    g.fillStyle='rgba(44,58,94,0.35)';
    g.beginPath();g.arc(mx+6,my-4,4,0,T2);g.fill();
    // the pagoda on the far hill
    let px=W2*.76,py=150,w=40;
    g.fillStyle='rgba(26,30,40,0.8)';
    for(let i=0;i<4;i++){
      const ty=py-i*24;
      g.beginPath();g.moveTo(px-w*.5,ty);g.quadraticCurveTo(px,ty-10,px+w*.5,ty);g.closePath();g.fill();
      g.fillRect(px-w*.34,ty-13,w*.68,13);w*=.82;}
    g.fillRect(px-2,py-112,4,10);
    g.fillStyle='rgba(24,30,44,0.85)';
    g.beginPath();g.moveTo(0,156);
    for(let x=0;x<=W2;x+=140)g.lineTo(x,156+vnoiseFar(x*.005+seed)*22);
    g.lineTo(W2,H2);g.lineTo(0,H2);g.closePath();g.fill();
    g.fillStyle=fade('rgba(30,38,58,0.4)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===11){ // vermilion — the maple wall
    g.fillStyle='rgba(150,70,44,0.2)';g.fillRect(0,0,W2,H2);
    g.strokeStyle='rgba(70,42,30,0.55)';g.lineWidth=5;
    for(let i=0;i<16;i++){const x=(i*.062+.02)*W2,lean=(hash01(seed+i)-.5)*12;
      g.beginPath();g.moveTo(x,H2);g.lineTo(x+lean,40+hash01(seed+i*3)*40);g.stroke();}
    g.fillStyle='rgba(140,52,32,0.5)'; // the canopy
    for(let i=0;i<24;i++){
      const x=hash01(seed+i*5.1)*W2,y=30+hash01(seed+i*9.3)*56;
      g.beginPath();g.ellipse(x,y,26+hash01(seed+i*7.7)*22,14+hash01(seed+i*3.3)*10,0,0,T2);g.fill();}
    g.fillStyle='rgba(181,85,44,0.4)';
    for(let i=0;i<14;i++){
      const x=hash01(seed+i*2.2)*W2,y=44+hash01(seed+i*6.6)*60;
      g.beginPath();g.ellipse(x,y,14+hash01(seed+i*4.4)*12,7+hash01(seed+i*8.8)*6,0,0,T2);g.fill();}
    g.fillStyle=fade('rgba(150,70,44,0.24)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===12){ // lantern night — dark water, far lights
    g.fillStyle='rgba(24,34,58,0.5)';g.fillRect(0,0,W2,H2);
    g.fillStyle='rgba(18,26,46,0.85)';
    g.beginPath();g.moveTo(0,132);
    for(let x=0;x<=W2;x+=140)g.lineTo(x,132+vnoiseFar(x*.006+seed)*16);
    g.lineTo(W2,H2);g.lineTo(0,H2);g.closePath();g.fill();
    g.strokeStyle='rgba(140,160,200,0.14)';g.lineWidth=1.2;
    for(let i=0;i<5;i++){g.beginPath();g.moveTo(0,146+i*12);
      for(let x=0;x<=W2;x+=120)g.lineTo(x,146+i*12+vnoiseFar(x*.01+i+seed)*4);g.stroke();}
    for(let i=0;i<4;i++){ // far lanterns riding the dark
      const x=(i*.24+.12)*W2,y=150+vnoiseFar(i*9+seed)*10;
      g.drawImage(glowEmber,x-13,y-13,26,26);
      g.fillStyle='#e8a854';g.beginPath();g.arc(x,y,2.2,0,T2);g.fill();}
    g.fillStyle=fade('rgba(24,34,58,0.4)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===13){ // the hollow — twisted trunks, hanging roots
    g.fillStyle='rgba(24,44,28,0.35)';g.fillRect(0,0,W2,H2);
    g.strokeStyle='rgba(20,34,20,0.7)';g.lineWidth=6;
    for(let i=0;i<9;i++){const x=(i*.11+.05)*W2,y=140+vnoiseFar(i*8+seed)*14;
      g.beginPath();g.moveTo(x,y);
      g.quadraticCurveTo(x+(hash01(seed+i)-.5)*20,y-40,x+(hash01(seed+i*3)-.5)*34,y-70-vnoiseFar(i*5+seed)*30);g.stroke();}
    g.strokeStyle='rgba(20,34,20,0.4)';g.lineWidth=1.6;
    for(let i=0;i<12;i++){const x=(i*.09+.04)*W2,y=60+hash01(seed+i*7)*40;
      g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+6,y+22,x-2,y+38);g.stroke();}
    for(let i=0;i<4;i++){ // wisps in the shade
      const x=hash01(seed+i*13)*W2,y=100+hash01(seed+i*17)*40;
      g.drawImage(glowBlue,x-12,y-12,24,24);}
    g.fillStyle=fade('rgba(24,44,28,0.3)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===14){ // the silver sea runs to the horizon
    g.fillStyle='rgba(226,220,190,0.4)';g.fillRect(0,0,W2,H2);
    g.strokeStyle='rgba(180,172,132,0.5)';g.lineWidth=1.6;
    for(let i=0;i<7;i++){const y=70+i*16;
      g.beginPath();g.moveTo(0,y);
      for(let x=0;x<=W2;x+=100)g.lineTo(x,y+vnoiseFar(x*.008+i*3+seed)*7);g.stroke();}
    g.strokeStyle='rgba(140,136,104,0.55)';g.lineWidth=2.4; // plume tips
    for(let i=0;i<22;i++){const x=hash01(seed+i*3.1)*W2,y=130+hash01(seed+i*7.7)*40;
      g.beginPath();g.moveTo(x,y);g.lineTo(x+(hash01(seed+i*1.7)-.5)*8,y-10-hash01(seed+i*5.5)*10);g.stroke();}
    g.fillStyle=fade('rgba(226,220,190,0.35)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===15){ // ashfall — ruins dissolving into fog
    g.fillStyle='rgba(110,102,94,0.3)';g.fillRect(0,0,W2,H2);
    g.fillStyle='rgba(74,66,60,0.6)';
    g.beginPath();g.moveTo(0,128);
    for(let x=0;x<=W2;x+=140)g.lineTo(x,128+vnoiseFar(x*.005+seed)*28);
    g.lineTo(W2,H2);g.lineTo(0,H2);g.closePath();g.fill();
    g.strokeStyle='rgba(48,42,38,0.6)';g.lineWidth=5;
    for(let i=0;i<6;i++){const x=(i*.16+.08)*W2,y=132+vnoiseFar(i*9+seed)*10;
      const h=20+vnoiseFar(i*4+seed)*24;
      g.beginPath();g.moveTo(x,y);g.lineTo(x+(hash01(seed+i)-.5)*5,y-h);g.stroke();
      if(hash01(seed+i*3)>.5)ln(g,x,y-h,x+9,y-h+6,3,'rgba(48,42,38,0.5)');}
    g.fillStyle=fade('rgba(110,102,94,0.3)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===16){ // 16 — the sealed blank: a grid and a ghost of a mountain
    g.strokeStyle='rgba(70,70,84,0.07)';g.lineWidth=1;
    for(let i=0;i<9;i++){const x=(i+1)*W2/10;
      g.beginPath();g.moveTo(x,30);g.lineTo(x,H2*.7);g.stroke();}
    g.strokeStyle='rgba(29,26,22,0.08)';g.lineWidth=1.6;
    g.beginPath();g.moveTo(W2*.1,120);
    g.quadraticCurveTo(W2*.5,96,W2*.88,120);g.stroke();
    g.fillStyle='rgba(179,55,42,0.10)';
    g.beginPath();g.arc(W2*.7,70,10,0,T2);g.fill();
  }
  else if(act===17){ // 17 — the unwritten margin: pencil ghosts of mountains
    g.fillStyle='rgba(246,243,232,0.55)';g.fillRect(0,0,W2,H2);
    for(let L=0;L<2;L++){ // two half-erased ridge lines, no fill
      g.strokeStyle=L?'rgba(29,26,22,0.14)':'rgba(29,26,22,0.22)';
      g.lineWidth=L?1.2:1.7;
      g.beginPath();g.moveTo(0,116+L*24);
      let pen=true;
      for(let x=0;x<=W2;x+=90){
        const y=116+L*24+vnoiseFar(x*.006+seed+L*7)*(24+L*10);
        if(pen)g.lineTo(x,y);else g.moveTo(x+14,y);
        pen=hash01(seed+x*.01+L)>.28; // the line forgets itself
      }
      g.stroke();}
    g.strokeStyle='rgba(29,26,22,0.10)';g.lineWidth=1;
    g.beginPath();g.moveTo(W2*.12,148);g.lineTo(W2*.44,148);g.stroke();
    g.fillStyle='rgba(179,55,42,0.08)'; // one seal drying in the sky
    g.beginPath();g.arc(W2*.82,54,8,0,T2);g.fill();
  }
  else if(act===18){ // 18 — the hundred parade: a dark procession line under dusk
    g.fillStyle='rgba(38,34,52,0.34)';g.fillRect(0,0,W2,H2);
    g.fillStyle='rgba(26,24,38,0.6)';
    g.beginPath();g.moveTo(0,140);
    for(let x=0;x<=W2;x+=140)g.lineTo(x,140+vnoiseFar(x*.005+seed)*22);
    g.lineTo(W2,H2);g.lineTo(0,H2);g.closePath();g.fill();
    // the walkers: a long line of small dark silhouettes, lanterns among them
    for(let i=0;i<26;i++){
      const x=(i*.05+.015)*W2+Math.sin(i*2.7)*6,y=136+vnoiseFar(i*3+seed)*16;
      g.fillStyle='rgba(22,20,32,0.8)';
      g.beginPath();g.arc(x,y,3.4,0,T2);g.fill();
      g.beginPath();g.moveTo(x-3,y+2);g.lineTo(x+3,y+2);g.lineTo(x,y+14);g.closePath();g.fill();
      if(i%5===2){g.drawImage(glowEmber,x-11,y-8,22,22);
        g.fillStyle='#e8a854';g.beginPath();g.arc(x,y-8,1.8,0,T2);g.fill();}}
    g.fillStyle=fade('rgba(38,34,52,0.35)');g.fillRect(0,H2*.5,W2,H2*.5);
  }
  else if(act===19){ // 19 — the last page: almost nothing, and one red verdict
    g.fillStyle='rgba(250,248,240,0.7)';g.fillRect(0,0,W2,H2);
    g.strokeStyle='rgba(70,70,84,0.06)';g.lineWidth=1;
    for(let i=0;i<7;i++){const x=(i+1)*W2/8;
      g.beginPath();g.moveTo(x,26);g.lineTo(x,H2*.6);g.stroke();}
    g.strokeStyle='rgba(29,26,22,0.10)';g.lineWidth=1.4; // the unfinished enso
    g.beginPath();g.arc(W2*.5,110,44,.6,5.4);g.stroke();
    g.fillStyle='rgba(179,55,42,0.30)'; // the author's seal, waiting
    g.save();g.translate(W2*.5,110);g.rotate(.3);
    g.fillRect(-9,-9,18,18);g.restore();
  }
  g.restore();
  // every far scene ends in mist so the band never cuts the page
  g.fillStyle='rgba(233,225,205,0.0)';
  }

function vnoiseFar(x){const i=Math.floor(x),f=x-i;
  const a=hash01(i*57.31),b=hash01((i+1)*57.31);
  const u=f*f*(3-2*f);return a+(b-a)*u;}

D.drawFar=function(){
  try{
  if(!farC)return;
  const px=-(G.cam.x-RW/2)*.12, py=-(G.cam.y-RH/2)*.05;
  ctx.drawImage(farC,-32+px,-8+py,RW+64,FARH);
  // the arena's top border restated over the scenery — the frame survives
  const act=curAct();
  ctx.strokeStyle=act===7?'#8a8894':INK;ctx.lineCap='butt';
  ctx.lineWidth=7;
  ctx.beginPath();ctx.moveTo(WALL-6,WALL-6);ctx.lineTo(RW-WALL+6,WALL-6);ctx.stroke();
  ctx.lineWidth=2.5;
  ctx.beginPath();ctx.moveTo(WALL-16,WALL-16);ctx.lineTo(RW-WALL+16,WALL-16);ctx.stroke();
  }catch(e){}};

// ---- the near band: silhouettes at the world's hem ------------------------------
D.nearBake=function(act){
  nearC=null;nearAct=-1;
  try{
  const FS=IS_TOUCH?1:2;
  const c=mkCanvas((RW+80)*FS,NEARH*FS),g=c.getContext('2d');
  g.scale(FS,FS);
  const seed=act*29.3;
  const ink='rgba(29,26,22,0.42)';
  const tall=(x,h,col,lean)=>{ // a seeded silhouette stalk
    g.strokeStyle=col;g.lineWidth=2.6;
    g.beginPath();g.moveTo(x,NEARH);
    g.quadraticCurveTo(x+lean*.3,NEARH-h*.6,x+lean,NEARH-h);g.stroke();};
  const tuft=(x,col)=>{ // grass tuft: 3-5 blades
    g.strokeStyle=col;g.lineWidth=1.8;g.lineCap='round';
    const n=3+(hash01(seed+x)*3|0);
    for(let i=0;i<n;i++){
      const lean=(hash01(seed+i*7+x)-.5)*26;
      g.beginPath();g.moveTo(x,NEARH);
      g.quadraticCurveTo(x+lean*.3,NEARH-24,x+lean,NEARH-34-hash01(seed+i*3+x)*16);g.stroke();}};
  if(act===1||act===8){
    for(let i=0;i<26;i++)tall(WALL+30+hash01(seed+i*1.7)*(RW-60),46+hash01(seed+i*3.1)*36,
      act===8?'rgba(70,30,24,0.5)':ink,(hash01(seed+i*5.3)-.5)*34);}
  else if(act===2||act===12){
    for(let i=0;i<20;i++)tall(WALL+30+hash01(seed+i*2.3)*(RW-60),40+hash01(seed+i*4.7)*30,
      act===12?'rgba(28,40,64,0.5)':'rgba(44,58,84,0.5)',(hash01(seed+i*6.1)-.5)*30);
    // wet stones
    g.fillStyle='rgba(60,70,90,0.4)';
    for(let i=0;i<6;i++){const x=hash01(seed+i*9.1)*RW;
      g.beginPath();g.ellipse(x,NEARH-6,14+hash01(seed+i*3.3)*10,6,0,0,T2);g.fill();}}
  else if(act===3){
    // bamboo leaf fans, dark and close
    for(let i=0;i<10;i++){
      const x=WALL+40+hash01(seed+i*3.7)*(RW-80),y=NEARH-hash01(seed+i*5.5)*50;
      g.strokeStyle='rgba(40,74,42,0.55)';g.lineWidth=2.2;
      for(let j=0;j<5;j++){const a=-.4+j*.2;
        g.beginPath();g.moveTo(x,y);
        g.lineTo(x+Math.cos(a)*(20+hash01(seed+j+i*7)*10),y+Math.sin(a)*10);g.stroke();}}}
  else if(act===4){
    g.fillStyle='rgba(232,238,246,0.65)';
    g.beginPath();g.moveTo(0,NEARH-26);
    for(let x=0;x<=RW+80;x+=140)g.lineTo(x,NEARH-26-vnoiseFar(x*.01+seed)*12);
    g.lineTo(RW+80,NEARH);g.lineTo(0,NEARH);g.closePath();g.fill();
    for(let i=0;i<14;i++)tall(WALL+30+hash01(seed+i*2.1)*(RW-60),30+hash01(seed+i*6.3)*22,
      'rgba(120,134,158,0.5)',(hash01(seed+i*4.1)-.5)*22);}
  else if(act===5||act===15){
    for(let i=0;i<22;i++)tuft(WALL+30+hash01(seed+i*1.9)*(RW-60),
      act===15?'rgba(90,82,74,0.55)':'rgba(40,36,54,0.5)');
  }
  else if(act===6){
    g.strokeStyle='rgba(44,38,32,0.55)';
    for(let i=0;i<12;i++){const x=WALL+30+hash01(seed+i*4.3)*(RW-60);
      const h=30+hash01(seed+i*8.7)*36;
      g.lineWidth=2.2;
      g.beginPath();g.moveTo(x,NEARH);g.lineTo(x+(hash01(seed+i)-.5)*8,NEARH-h);g.stroke();
      g.lineWidth=1.2;
      g.beginPath();g.moveTo(x,NEARH-h*.6);g.lineTo(x-7,NEARH-h*.85);g.stroke();}}
  else if(act===9||act===14){
    // pampas plumes, heavy-headed
    for(let i=0;i<18;i++){
      const x=WALL+30+hash01(seed+i*2.7)*(RW-60),h=36+hash01(seed+i*5.9)*30;
      const lean=(hash01(seed+i*7.1)-.5)*40;
      g.strokeStyle='rgba(120,116,92,0.5)';g.lineWidth=1.6;
      g.beginPath();g.moveTo(x,NEARH);g.quadraticCurveTo(x+lean*.3,NEARH-h*.6,x+lean,NEARH-h);g.stroke();
      g.fillStyle=act===9?'rgba(168,164,140,0.5)':'rgba(200,196,164,0.55)';
      g.beginPath();g.ellipse(x+lean,NEARH-h-3,8,14,lean*.01,0,T2);g.fill();}}
  else if(act===11){
    // a maple bough leaning over the road
    for(let i=0;i<3;i++){
      const bx=WALL+120+hash01(seed+i*9.7)*(RW-WALL*2-240);
      g.strokeStyle='rgba(60,34,24,0.6)';g.lineWidth=5;
      g.beginPath();g.moveTo(bx-40,NEARH);
      g.quadraticCurveTo(bx,NEARH-50,bx+46,NEARH-58-hash01(seed+i)*20);g.stroke();
      g.fillStyle='rgba(140,52,32,0.5)';
      for(let j=0;j<6;j++){
        const t=j/5,lx=bx-40+t*86,ly=NEARH-t*56-hash01(seed+j*3+i)*12;
        g.beginPath();g.moveTo(lx,ly);
        g.quadraticCurveTo(lx+3,ly-8,lx+10,ly-6);
        g.quadraticCurveTo(lx+5,ly,lx,ly);g.closePath();g.fill();}}
    for(let i=0;i<12;i++)tuft(WALL+30+hash01(seed+i*3.3)*(RW-60),'rgba(90,44,30,0.5)');}
  else if(act===13){
    // hanging roots off the world's edge
    g.strokeStyle='rgba(20,34,20,0.5)';
    for(let i=0;i<16;i++){const x=hash01(seed+i*5.1)*RW;
      g.lineWidth=2;
      g.beginPath();g.moveTo(x,0);
      g.quadraticCurveTo(x+(hash01(seed+i)-.5)*14,26,x+(hash01(seed+i*3)-.5)*20,44+hash01(seed+i*7)*22);g.stroke();}}
  else if(act===16){
    g.strokeStyle='rgba(70,70,84,0.08)';g.lineWidth=1;
    for(let i=0;i<8;i++){const x=hash01(seed+i*11)*RW;
      g.beginPath();g.moveTo(x-6,NEARH-10);g.lineTo(x+6,NEARH-10);g.moveTo(x,NEARH-16);g.lineTo(x,NEARH-4);g.stroke();}}
  else if(act===17){ // update 3.0 終: pencil grass at the margin's hem
    for(let i=0;i<14;i++)tuft(WALL+30+hash01(seed+i*2.6)*(RW-60),'rgba(74,68,60,0.35)');
    g.strokeStyle='rgba(29,26,22,0.16)';g.lineWidth=1.6;
    g.beginPath();g.moveTo(RW*.1,NEARH-14);
    g.quadraticCurveTo(RW*.5,NEARH-20,RW*.9,NEARH-12);g.stroke();}
  else if(act===18){ // update 3.0 終: ink drips hang off the parade's hem
    g.strokeStyle='rgba(22,20,32,0.5)';
    for(let i=0;i<16;i++){const x=hash01(seed+i*4.1)*RW;
      g.lineWidth=1.6+(hash01(seed+i)*2|0);
      g.beginPath();g.moveTo(x,0);
      g.quadraticCurveTo(x+(hash01(seed+i*3)-.5)*12,24,x+(hash01(seed+i*7)-.5)*16,38+hash01(seed+i*5)*22);g.stroke();
      g.fillStyle='rgba(22,20,32,0.5)';
      g.beginPath();g.arc(x+(hash01(seed+i*7)-.5)*16,40+hash01(seed+i*5)*22,1.6,0,T2);g.fill();}}
  // act 7 keeps a clean hem on purpose
  nearC=c;nearAct=act;
  }catch(e){nearC=null;}};

D.drawNear=function(){
  try{
  if(!nearC)return;
  const act=curAct();
  if(act===7)return;
  const px=(G.cam.x-RW/2)*.09, py=(G.cam.y-RH/2)*.04;
  ctx.globalAlpha=.9;
  ctx.drawImage(nearC,-40-px,RH-NEARH+6+py,RW+80,NEARH);
  ctx.globalAlpha=1;
  }catch(e){}};

return D;})();
