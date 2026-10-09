// ============================================================================
// SUMIKIRI — HEAVY AMBIENCE LAYER (update 2.0)
//
// The world already breathes: light shafts, fireflies, mist, weather. This
// layer adds what a page needs to feel DEEP —
//   · cloud-shadows that drift over every battlefield (multiply blend)
//   · a slow bloom that follows each act's key light
//   · per-act ground life: shimmer on water, ember pools, seal-light
//   · foreground depth: big petals, floating lanterns, spirit wisps
//
// Everything is a pure function of the clock (stateless), camera-culled,
// and touch devices get roughly half of it. The base game calls these
// through three hooks: AMBI2.onFloor(act) right after the floor,
// AMBI2.overWorld(act) after the weather, AMBI2.onScreen() over the grade.
// ============================================================================

window.AMBI2=(function(){
'use strict';
const A={};
const TAU=Math.PI*2;

// where the camera is looking, in world coordinates, with margin
function inView(x,y,m){return Math.abs(x-G.cam.x)<W/Z/2+(m||120)&&Math.abs(y-G.cam.y)<H/Z/2+(m||120);}

// ---- cloud shadows: enormous soft shapes crossing the whole page --------------
// drawn with multiply right over the floor, so the ground itself gains
// weather that moves. six shadows, each on its own slow clock.
A.onFloor=function(act){
  const n=IS_TOUCH?3:6;
  ctx.save();
  ctx.globalCompositeOperation='multiply';
  for(let i=0;i<n;i++){
    const seed=i*3.7+2.1;
    const cx=((hash01(seed*7)*RW+G.t*(9+hash01(seed)*7))%(RW+900))-450;
    const cy=RH*(.1+hash01(seed*3)*.8)+Math.sin(G.t*.08+seed)*60;
    const w=260+hash01(seed*5)*300,h=w*.5;
    const a=.05+.04*Math.sin(G.t*.13+seed*2);
    if(a<=.005)continue;
    ctx.globalAlpha=a;
    ctx.fillStyle=act>=11&&act!==14?'#6a5550':'#5c5850';
    ctx.beginPath();
    ctx.ellipse(cx,cy,w,h,hash01(seed*9),0,TAU);
    ctx.ellipse(cx+w*.55,cy+h*.3,w*.6,h*.7,0,0,TAU);
    ctx.fill();}
  ctx.restore();
  // ground life per act
  if(act===2||act===12){ // water shimmer: quick bright dashes on the surface
    const m=IS_TOUCH?8:14;
    ctx.strokeStyle='rgba(214,226,240,0.5)';ctx.lineWidth=1.2;ctx.lineCap='round';
    for(let i=0;i<m;i++){
      const seed=i*4.3+1.7;
      const x=hash01(seed*7)*RW+Math.sin(G.t*.5+seed)*22;
      const y=hash01(seed*3)*RH;
      if(!inView(x,y,60))continue;
      const gl=.4+.6*Math.sin(G.t*2.2+seed*3);
      if(gl<=.05)continue;
      ctx.globalAlpha=gl*.35;
      ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x+5,y);
      ctx.moveTo(x-2,y+2.5);ctx.lineTo(x+7,y+2.5);ctx.stroke();}}
  if(act===15){ // ember pools breathe under the ash
    for(let i=0;i<4;i++){
      const seed=i*6.1+4.4;
      const x=hash01(seed*7)*RW,y=hash01(seed*3)*RH;
      if(!inView(x,y,150))continue;
      const br=.5+.5*Math.sin(G.t*(1.2+hash01(seed))+seed);
      ctx.globalAlpha=.06+.07*br;
      const r=90+hash01(seed*5)*70;
      const gr=ctx.createRadialGradient(x,y,0,x,y,r);
      gr.addColorStop(0,'rgba(201,118,46,0.5)');gr.addColorStop(1,'rgba(201,118,46,0)');
      ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}}
  if(act===16){ // the blank page glows faintly where the seals dried
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<5;i++){
      const seed=i*5.3+3.1;
      const x=hash01(seed*7)*RW,y=hash01(seed*3)*RH;
      if(!inView(x,y,140))continue;
      const br=.5+.5*Math.sin(G.t*.8+seed);
      ctx.globalAlpha=.05+.05*br;
      const gr=ctx.createRadialGradient(x,y,0,x,y,110);
      gr.addColorStop(0,'rgba(179,55,42,0.4)');gr.addColorStop(1,'rgba(179,55,42,0)');
      ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x,y,110,0,TAU);ctx.fill();}
    ctx.restore();}
  ctx.globalAlpha=1;};

// ---- the world's own weather, drawn over: depth and drifting bodies ----------

A.overWorld=function(act){
  // foreground maple petals for the vermilion fields (big, close, blurred by speed)
  if(act===11||act===13){
    const n=(act===11?5:4)-(IS_TOUCH?1:0);
    for(let i=0;i<n;i++){
      const seed=i*3.7+11.3;
      const t=(G.t*(26+hash01(seed)*22)+hash01(seed*3)*(H+240))%(H+240);
      const x=hash01(seed*7)*W+Math.sin(G.t*.55+seed)*70+G.wind*52;
      ctx.save();ctx.translate(x,t-120);
      ctx.rotate((G.t*(.7+hash01(seed*2)*.7)+seed)*((i%2)?1:-1));
      const s=1.7+hash01(seed*5)*1.3;ctx.scale(s,s);
      ctx.globalAlpha=.22+.12*hash01(seed*9);
      ctx.fillStyle=i%3?'#b5552c':RED;
      ctx.beginPath();ctx.moveTo(6,0);ctx.quadraticCurveTo(1,-5,-6,-1);ctx.quadraticCurveTo(-2,2,6,0);ctx.closePath();ctx.fill();
      ctx.restore();}}
  // floating lanterns over the river: paper bodies riding the current
  if(act===12){
    const n=IS_TOUCH?4:7;
    for(let i=0;i<n;i++){
      const seed=i*4.9+7.7;
      const x=((hash01(seed*7)*RW+G.t*(16+hash01(seed)*10))%(RW+200))-100;
      const y=RH*(.18+hash01(seed*3)*.62)+Math.sin(G.t*.5+seed*2)*18;
      if(!inView(x,y,140))continue;
      ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(G.t*.6+seed)*.12);
      // the light first — additive so it reads as a flame
      ctx.save();ctx.globalCompositeOperation='lighter';
      const fl=.7+.3*Math.sin(G.t*5+seed*3);
      const gr=ctx.createRadialGradient(0,2,0,0,2,46*fl);
      gr.addColorStop(0,'rgba(232,168,80,0.22)');gr.addColorStop(1,'rgba(232,168,80,0)');
      ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,2,46*fl,0,TAU);ctx.fill();
      ctx.restore();
      // the paper body
      ctx.fillStyle='#d8cbb0';
      ctx.beginPath();ctx.ellipse(0,0,8,11,0,0,TAU);ctx.fill();
      ctx.strokeStyle='#8c6d1f';ctx.lineWidth=.9;
      for(let j=-1;j<=1;j++){ctx.beginPath();ctx.ellipse(0,j*4,8*(1-Math.abs(j)*.15),2,0,0,TAU);ctx.stroke();}
      ctx.fillStyle='#e8a854';
      ctx.beginPath();ctx.ellipse(0,2,3.4,4.4,0,0,TAU);ctx.fill();
      ctx.fillStyle='#241f1c';
      ctx.fillRect(-2,-14,4,3);
      ctx.restore();}}
  // spirit wisps: pale orbs with tails, crossing the hollow and the blank
  if(act===13||act===16){
    const n=IS_TOUCH?4:6;
    for(let i=0;i<n;i++){
      const seed=i*5.7+9.1;
      const t=(G.t*(10+hash01(seed)*8)+hash01(seed*3)*RH*2)%(RH+60);
      const x=hash01(seed*7)*RW+Math.sin(G.t*.35+seed*2)*54+G.wind*30;
      const y=t-30;
      if(!inView(x,y,80))continue;
      const br=.5+.5*Math.sin(G.t*1.6+seed*4);
      ctx.save();ctx.globalCompositeOperation='lighter';
      ctx.globalAlpha=.16+.2*br;
      const col=act===16?'rgba(214,120,110,0.6)':'rgba(190,220,190,0.6)';
      const gr=ctx.createRadialGradient(x,y,0,x,y,26);
      gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x,y,26,0,TAU);ctx.fill();
      // the tail: three fading echoes behind the drift
      for(let j=1;j<=3;j++){
        ctx.globalAlpha=(.16+.2*br)*(1-j*.3);
        ctx.beginPath();ctx.arc(x-Math.sin(G.t*.35+seed*2)*j*7,y-j*3.4,6-j*1.4,0,TAU);ctx.fill();}
      ctx.restore();}}
  // the silver grass breathes: long combs of light run with the wind
  if(act===14){
    ctx.save();ctx.globalCompositeOperation='lighter';
    const n=IS_TOUCH?5:8;
    for(let i=0;i<n;i++){
      const seed=i*4.1+6.6;
      const ph=((G.t*(.05+hash01(seed)*.04)+hash01(seed*3))%1);
      const x=ph*(RW+400)-200;
      const y=RH*(.1+hash01(seed*5)*.8);
      if(!inView(x,y,240))continue;
      const a=Math.sin(ph*PI)*.05;
      ctx.globalAlpha=a;
      const gr=ctx.createLinearGradient(x-160,y,x+160,y);
      gr.addColorStop(0,'rgba(240,234,216,0)');gr.addColorStop(.5,'rgba(240,234,216,0.6)');gr.addColorStop(1,'rgba(240,234,216,0)');
      ctx.fillStyle=gr;
      ctx.save();ctx.translate(x,y);ctx.rotate(.1+hash01(seed)*.12);
      ctx.fillRect(-160,-26,320,52);ctx.restore();}
    ctx.restore();}
  ctx.globalAlpha=1;};

// ---- screen-space: the bloom that follows the key light -----------------------

A.onScreen=function(){
  const act=curAct();
  const gr=GRADE[act]||GRADE[1];
  if(!gr)return;
  const lx=clamp(gr.lx,0,1)*W,ly=clamp(gr.ly,0,1)*H*.8;
  const br=.5+.5*Math.sin(G.t*.23); // a very slow breath
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.globalAlpha=.05+.04*br;
  const r=Math.max(W,H)*.5;
  const gg=ctx.createRadialGradient(lx,ly,0,lx,ly,r);
  const warm=act>=11;
  gg.addColorStop(0,warm?'rgba(214,120,64,0.35)':'rgba(240,234,216,0.3)');
  gg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=gg;ctx.fillRect(0,0,W,H);
  ctx.restore();
  ctx.globalAlpha=1;};

return A;})();
