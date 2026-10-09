// ============================================================================
// SUMIKIRI — MENU FX: THE LIVING PAPER (update 2.1)
//
// Every menu in the game sits on living paper. This layer runs a small canvas
// ABOVE the DOM screens (pointer-events:none — it never blocks a click) and
// keeps the air moving:
//
//   · gold firefly motes drifting through the dusk of every page
//   · ink petals falling with the wind, red and black
//   · big soft ink-clouds breathing behind the light
//   · an ink ripple + gold sparks wherever a finger or click lands
//
// It is a self-contained loop (its own rAF), gated on a screen being open,
// paused when the tab hides, priced for touch. The entrance choreography of
// the menus themselves lives in menufx.css — this canvas is only the weather.
// ============================================================================

(function(){
'use strict';
const IS_TOUCH=(()=>{try{return matchMedia('(pointer:coarse)').matches||'ontouchstart' in window;}catch(e){return false;}})();
const REDUCE=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}})();

const cv=document.createElement('canvas');
cv.id='mfx';
document.body.appendChild(cv);
const g=cv.getContext('2d');
let W=innerWidth,H=innerHeight,DPR=1;
function resize(){
  W=innerWidth;H=innerHeight;
  DPR=Math.min(IS_TOUCH?1.5:2,devicePixelRatio||1);
  cv.width=Math.max(2,W*DPR|0);cv.height=Math.max(2,H*DPR|0);
  g.setTransform(DPR,0,0,DPR,0,0);}
resize();
addEventListener('resize',resize,{passive:true});

// ---- sprites -------------------------------------------------------------------
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
const glowGold=mk(28,28);
{const gg=glowGold.getContext('2d');
  const gr=gg.createRadialGradient(14,14,0,14,14,13);
  gr.addColorStop(0,'rgba(234,196,120,0.9)');gr.addColorStop(1,'rgba(234,196,120,0)');
  gg.fillStyle=gr;gg.beginPath();gg.arc(14,14,13,0,Math.PI*2);gg.fill();}
const cloud=mk(260,140);
{const gc=cloud.getContext('2d');
  const gr=gc.createRadialGradient(130,70,10,130,70,130);
  gr.addColorStop(0,'rgba(74,64,54,0.5)');gr.addColorStop(1,'rgba(74,64,54,0)');
  gc.fillStyle=gr;gc.beginPath();gc.ellipse(130,70,128,64,0,0,Math.PI*2);gc.fill();}

// ---- the weather ----------------------------------------------------------------
const parts=[];
const N=REDUCE?0:(IS_TOUCH?11:20);
function spawnPetals(){
  for(const p of parts)if(p.kind==='petal'&&p.y<-40&&p.y>-400)p.y=H+30; // recycle quietly
  if(parts.filter(p=>p.kind==='petal').length>=(IS_TOUCH?6:10))return;
  parts.push({kind:'petal',x:Math.random()*W,y:-30,
    vy:16+Math.random()*26,ph:Math.random()*Math.PI*2,r:2.6+Math.random()*3,
    rot:Math.random()*Math.PI*2,vr:(Math.random()-.5)*1.6,
    red:Math.random()<.4,layer:Math.random()});}
function spawnGold(){
  if(parts.filter(p=>p.kind==='gold').length>=(IS_TOUCH?5:9))return;
  parts.push({kind:'gold',x:Math.random()*W,y:H*(.15+Math.random()*.8),
    ph:Math.random()*Math.PI*2,sp:.5+Math.random()*.9,
    vx:(Math.random()-.5)*10,vy:-4-Math.random()*8,life:6+Math.random()*7});}
for(let i=0;i<N;i++){spawnPetals();spawnGold();}

const ripples=[];
document.addEventListener('pointerdown',e=>{
  if(!document.querySelector('.screen.on'))return;
  ripples.push({x:e.clientX,y:e.clientY,t:0});
  if(ripples.length>7)ripples.shift();
},{passive:true});

// ---- the loop -------------------------------------------------------------------
let last=0,cleared=false;
function frame(ts){
  requestAnimationFrame(frame);
  const now=ts/1000;
  const dt=Math.min(.05,now-(last||now-.016));last=now;
  const open=document.querySelector('.screen.on')&&!document.hidden&&!REDUCE;
  if(!open){
    if(!cleared){g.clearRect(0,0,W,H);cleared=true;}
    return;}
  cleared=false;
  g.clearRect(0,0,W,H);

  // ink clouds: two enormous slow bodies, breathing behind everything
  g.globalAlpha=.05;
  for(let i=0;i<2;i++){
    const t=now*.02+i*3.1;
    const x=W*(.5+.34*Math.sin(t+i)),y=H*(.4+.3*Math.cos(t*.8));
    const s=1.4+.5*Math.sin(now*.1+i*2);
    g.drawImage(cloud,x-130*s,y-70*s,260*s,140*s);}
  g.globalAlpha=1;

  // petals + gold motes
  for(let i=parts.length-1;i>=0;i--){
    const p=parts[i];
    if(p.kind==='petal'){
      p.y+=p.vy*dt;p.x+=Math.sin(now*.7+p.ph)*.5+(p.red?.2:.35);
      p.rot+=p.vr*dt;
      if(p.y>H+40){parts.splice(i,1);spawnPetals();continue;}
      g.save();g.translate(p.x,p.y);g.rotate(p.rot);
      g.globalAlpha=.3+.14*p.layer;
      g.fillStyle=p.red?'#b3372a':'#4a443c';
      g.beginPath();g.ellipse(0,0,p.r,p.r*.55,0,0,Math.PI*2);g.fill();
      g.restore();}
    else if(p.kind==='gold'){
      p.life-=dt;
      p.x+=p.vx*dt+Math.sin(now*p.sp+p.ph)*.45;
      p.y+=p.vy*dt;
      if(p.life<=0||p.y<-30){parts.splice(i,1);spawnGold();continue;}
      const a=.32+.4*Math.sin(now*2.2+p.ph);
      if(a<=.05)continue;
      g.globalAlpha=a;
      g.drawImage(glowGold,p.x-14,p.y-14,28,28);
      g.fillStyle='#e6c478';
      g.beginPath();g.arc(p.x,p.y,1.4,0,Math.PI*2);g.fill();
      g.globalAlpha=1;}}

  // ink ripples where the hand landed
  for(let i=ripples.length-1;i>=0;i--){
    const r=ripples[i];r.t+=dt;
    const q=r.t/.55;
    if(q>=1){ripples.splice(i,1);continue;}
    const fade=1-q;
    g.save();g.translate(r.x,r.y);
    g.strokeStyle=`rgba(179,55,42,${.5*fade})`;
    g.lineWidth=2;
    g.beginPath();g.arc(0,0,6+q*46,0,Math.PI*2);g.stroke();
    g.strokeStyle=`rgba(29,26,22,${.3*fade})`;
    g.lineWidth=1.2;
    g.beginPath();g.arc(0,0,3+q*30,0,Math.PI*2);g.stroke();
    // gold sparks scattering off the touch
    for(let s=0;s<6;s++){
      const a=s/6*Math.PI*2+r.t*3;
      const rr=10+q*40;
      g.fillStyle=`rgba(214,178,90,${.5*fade})`;
      g.beginPath();g.arc(Math.cos(a)*rr,Math.sin(a)*rr,1.3,0,Math.PI*2);g.fill();}
    g.restore();}
  g.globalAlpha=1;}

requestAnimationFrame(frame);
})();
