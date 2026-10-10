// ============================================================================
// SUMIKIRI — MODELS: THE LIT FIGURES (update 2.2 影)
//
// The engine paints its cast as flat ink. This layer gives every figure a
// body — light with direction, weight, and heat:
//
//   · THE BAKE     — once at boot, every fighter sprite (inkmen, keepers, the
//                    second road's whole cast) is re-lit pixel by pixel:
//                    a blurred alpha field becomes height, height becomes
//                    surface, and the key light of the page (high, slightly
//                    left — it survives the sprite's left/right mirror) shades
//                    each body: lit slopes lift, away-slopes sink into cool
//                    shadow, silhouette edges facing the light carry a warm
//                    rim, near-white steel and eyes take specular, and warm
//                    pigment (red eyes, gold hardware, vermilion cloth) keeps
//                    a low ember. A soft contact shadow is blurred in beneath
//                    so each body sits ON the page. Nothing here costs a
//                    frame — it is all baked.
//   · THE LIFE     — while the game runs, each figure answers the act's real
//                    key light: a rim arc leans toward it, a glint rides the
//                    blade tip (gold when a cut is coming, red when it cannot
//                    be turned), fast foes drag white brush-ghosts, and light
//                    pools spill around every shadow (華).
//   · THE HERO     — her steel takes a sheen gradient and a traveling glint;
//                    her body carries its own rim; her lamp pools on the ground.
//   · THE PORTRAIT — the codex sketches get raking light, a vignette, a warm
//                    ground glow and drifting gold motes.
//
// Quality: SAVE.gfx — 0 墨 sumi (quiet paper), 1 絵 e (the lit page, default),
// 2 華 hana (everything, brightest). The engine reads MODELS.lo() to pick the
// original flat sprites on sumi; GFX.q scales the bloom to match.
//
// Loaded BEFORE the engine (like story2/gfx); every engine global resolves at
// call time. The engine calls:
//   MODELS.afterBake()            once, right after bakeBosses()
//   MODELS.pool(e) / ghosts(e)    inside drawEnemy (world / translated space)
//   MODELS.entityFX(e)            inside drawEnemy, after STORY2.drawExtra
//   MODELS.heroPool()             drawPlayer, before its shadow
//   MODELS.bladeFX(ctx,o)         drawPlayer, after the weapon
//   MODELS.bodyRim(ctx,la,a0)     drawPlayer, after the head
//   MODELS.portraitFX(g,w,h,type) drawCodexPortrait, last
// ============================================================================

window.MODELS=(function(){
'use strict';
const A={};
const TAU=Math.PI*2;
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function mk(w,h){const c=document.createElement('canvas');c.width=Math.max(2,w|0);c.height=Math.max(2,h|0);return c;}

// ---- quality --------------------------------------------------------------------
function Q(){try{const g=(typeof SAVE!=='undefined')?SAVE.gfx:1;return (g===undefined||g===null)?1:g;}catch(e){return 1;}}
A.lo=function(){return Q()===0;}; // sumi: the paper stays quiet

// canvas 2D filter support (Safari elders fall back to stacked draws)
let CANF=null;
function canF(){if(CANF===null){try{const g=mk(4,4).getContext('2d');g.filter='blur(1px)';CANF=(g.filter==='blur(1px)');}catch(e){CANF=false;}}return CANF;}

// separable box blur over a float field (the height model of every body)
function blurF(src,w,h,r){
  const tmp=new Float32Array(w*h),out=new Float32Array(w*h);
  const n=2*r+1;
  for(let y=0;y<h;y++){const row=y*w;let acc=0;
    for(let x=-r;x<=r;x++)acc+=src[row+clamp(x,0,w-1)];
    for(let x=0;x<w;x++){tmp[row+x]=acc/n;
      acc+=src[row+clamp(x+r+1,0,w-1)]-src[row+clamp(x-r,0,w-1)];}}
  for(let x=0;x<w;x++){let acc=0;
    for(let y=-r;y<=r;y++)acc+=tmp[clamp(y,0,h-1)*w+x];
    for(let y=0;y<h;y++){out[y*w+x]=acc/n;
      acc+=tmp[clamp(y+r+1,0,h-1)*w+x]-tmp[clamp(y-r,0,h-1)*w+x];}}
  return out;}

// ============================================================================
// THE BAKE — every sprite learns light
// ============================================================================
// key light: high and slightly left, a little toward the viewer. mostly
// vertical on purpose — the engine mirrors sprites left/right, and a light
// that leans hard sideways would lie after the mirror. high light survives.
const LX=-.22,LY=-.95,LZ=.24;
const LN=Math.hypot(LX,LY,LZ),Lxn=LX/LN,Lyn=LY/LN,Lzn=LZ/LN;

function bakeLight(kit,boss){
  if(!kit||!kit.n||kit.o)return; // already lit, or nothing to light
  try{
    const src=kit.n,S=src.width;
    const PAD=8,PS=S+PAD*2;
    // the lit canvas (padded so the contact shadow never clips)
    const lit=mk(PS,PS),lg=lit.getContext('2d');
    lg.drawImage(src,PAD,PAD);

    // ---- pixel light pass -------------------------------------------------------
    const id=lg.getImageData(0,0,PS,PS),d=id.data;
    const w=PS,h=PS;
    const alpha=new Float32Array(w*h);
    for(let i=0;i<w*h;i++)alpha[i]=d[i*4+3];
    const hgt=blurF(blurF(alpha,w,h,2),w,h,2); // the body as terrain

    // rim colour: keepers burn warmer than inkmen
    const rr=boss?70:56,rg=boss?38:48,rb=boss?24:34;      // rim add (warm)
    const K=110;                                          // slope constant

    for(let y=0;y<h;y++){
      const ym=(y>0?y-1:y)*w,yp=(y<h-1?y+1:y)*w,row=y*w;
      for(let x=0;x<w;x++){
        const i4=(row+x)*4,a=d[i4+3];
        if(a<=6)continue;
        // pseudo-normal from the height field
        const xm=x>0?x-1:x,xp=x<w-1?x+1:x;
        const gx=(hgt[row+xp]-hgt[row+xm])*.9;
        const gy=(hgt[yp+x]-hgt[ym+x])*.9;
        const gl=Math.hypot(gx,gy,K);
        const lam=(-gx*Lxn-gy*Lyn+K*Lzn)/gl;              // diffuse, flat ≈ .24
        const shade=clamp(.60+Math.max(0,lam)*.74,0,1.42); // .60 dark … 1.34 lit
        // crisp rim on silhouette edges that face the light (raw alpha slope)
        const rgx=alpha[row+xp]-alpha[row+xm];
        const rgy=alpha[yp+x]-alpha[ym+x];
        const rgl=Math.hypot(rgx,rgy);
        let rim=0;
        if(rgl>70){
          const face=(rgx*LX+rgy*LY)/rgl;                  // -1..1 toward light
          if(face>0)rim=Math.pow(face,1.6)*clamp(rgl/255,0,1);}

        let r=d[i4],g2=d[i4+1],b=d[i4+2];
        // diffuse + cool shadows
        r*=shade;g2*=shade;
        b*=shade*(shade<.86?1+(.86-shade)*.5:1);           // shadow breathes blue
        // rim light
        if(rim>0){r+=rim*rr;g2+=rim*rg;b+=rim*rb;}
        // specular — near-white steel, teeth, and paper catch the sun
        const mx=Math.max(r,g2,b);
        if(a>200&&mx>188){const sp=(mx-188)/67;r+=sp*74;g2+=sp*70;b+=sp*62;}
        // ember — warm pigment burns low: red eyes, gold, vermilion cloth
        if(a>140&&r>110&&r-b>62){const em=clamp((r-b-62)/95,0,1);r+=em*72;g2+=em*22;}

        d[i4]=r>255?255:r;d[i4+1]=g2>255?255:g2;d[i4+2]=b>255?255:b;}
    }
    lg.putImageData(id,0,0);

    // ---- flash variant (before the shadow, so a flash never shadows) -----------
    const fC=mk(PS,PS),fg=fC.getContext('2d');
    fg.drawImage(lit,0,0);
    fg.globalCompositeOperation='source-atop';
    fg.fillStyle='rgba(250,247,236,0.92)';
    fg.fillRect(0,0,PS,PS);

    // ---- the contact shadow, blurred under the body ----------------------------
    const nC=mk(PS,PS),ng=nC.getContext('2d');
    const sil=mk(PS,PS),sg=sil.getContext('2d');
    sg.drawImage(lit,0,0);
    sg.globalCompositeOperation='source-in';
    sg.fillStyle='#17120e';
    sg.fillRect(0,0,PS,PS);
    if(canF()){
      ng.save();ng.filter='blur(2.2px)';ng.globalAlpha=.34;
      ng.drawImage(sil,PAD*.28,PAD*.42);
      ng.restore();}
    else{
      ng.save();ng.globalAlpha=.085;
      for(let i=0;i<4;i++)ng.drawImage(sil,PAD*.28+i*.7,PAD*.42+i*.7);
      ng.restore();}
    ng.drawImage(lit,0,0);

    // ---- hand the kit its new clothes ------------------------------------------
    kit.o=src;          // the flat original (sumi draws this)
    kit.of=kit.f||fC;   // the flat flash original
    kit.n=nC;           // lit body + contact shadow
    kit.f=fC;           // lit flash
    kit.p=PAD/(typeof SS!=='undefined'?SS:2.2); // world-space padding
  }catch(e){/* a tainted or odd sprite keeps its flat ink */}}

// idempotent: the engine re-bakes when fonts land, and fresh kits (no .o)
// are re-lit on the spot — the call is safe from anywhere, any number of times
A.afterBake=function(){
  try{
    if(typeof ESPR!=='undefined')for(const k in ESPR)bakeLight(ESPR[k],false);
    if(typeof BSPR!=='undefined')for(const k in BSPR)bakeLight(BSPR[k],true);
  }catch(e){}};

// ============================================================================
// THE LIFE — per-frame answers to the act's real key light
// ============================================================================

// a four-ray sparkle: the language of steel catching sun
function star(c,x,y,s,a,col){
  if(a<=.01)return;
  c.save();
  c.globalCompositeOperation='lighter';
  c.strokeStyle='rgba('+col+','+a+')';c.lineWidth=1;
  c.beginPath();
  c.moveTo(x-s*2.1,y);c.lineTo(x+s*2.1,y);
  c.moveTo(x,y-s*2.1);c.lineTo(x,y+s*2.1);c.stroke();
  c.strokeStyle='rgba('+col+','+(a*.5)+')';c.lineWidth=.8;
  c.beginPath();
  c.moveTo(x-s*1.2,y-s*1.2);c.lineTo(x+s*1.2,y+s*1.2);
  c.moveTo(x+s*1.2,y-s*1.2);c.lineTo(x-s*1.2,y+s*1.2);c.stroke();
  c.fillStyle='rgba('+col+','+Math.min(1,a*1.35)+')';
  c.beginPath();c.arc(x,y,Math.max(.6,s*.4),0,TAU);c.fill();
  c.restore();}

// the act's key-light angle (toward the sun of the page)
function lightAng(){
  try{
    if(typeof GRAD!=='undefined'&&GRAD)
      return Math.atan2(GRAD.ly||0,GRAD.lx||0);
  }catch(e){}
  return -2.1;}

// ---- enemy/keeper overlays: rim arc + blade glint + orbit motes -----------------
// called with ctx translated to the entity's origin, unrotated
A.entityFX=function(e){
  if(Q()<1||!e||e.dead||e.hidden)return;
  const r=e.r||14;
  const boss=!!e.boss;
  const s2=e.def&&e.def.s2;

  // rim arc — the body leans toward the page's sun (two strokes: halo + core)
  const la=lightAng();
  const pulse=.75+.25*Math.sin(G.t*2.4+e.bob*.7);
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  ctx.strokeStyle=boss?'rgba(255,150,110,0.15)':'rgba(255,228,180,0.13)';
  ctx.lineWidth=4.6;
  ctx.beginPath();ctx.arc(0,0,r*1.12,la-.85,la+.85);ctx.stroke();
  ctx.strokeStyle=boss?'rgba(255,198,152,0.5)':'rgba(255,240,210,0.42)';
  ctx.lineWidth=1.5*pulse;
  ctx.beginPath();ctx.arc(0,0,r*1.17,la-.6,la+.6);ctx.stroke();
  ctx.restore();

  // the glint rides the steel: gold when the cut can be turned, red when not
  const tip=r*1.62;
  const gx=Math.cos(e.facing)*tip,gy=Math.sin(e.facing)*tip;
  const hot=(e.state==='windup'||e.state==='aim'||e.state==='active');
  const col=hot?(e.peril?'255,96,72':(s2?'255,172,92':'255,208,122')):'250,244,226';
  star(ctx,gx,gy,hot?4.4:2.9,(hot?.9:.55)*(.7+.3*Math.sin(G.t*6+e.bob)),col);

  // 華: elites and keepers orbit a little gold dust
  if(Q()>=2&&(e.elite||e.boss)){
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    for(let i=0;i<3;i++){
      const a=G.t*1.7+i*TAU/3+e.bob*.31;
      const rr=r*1.5+3*Math.sin(G.t*3+i*2.1);
      ctx.fillStyle='rgba(234,196,120,'+(.42+.3*Math.sin(G.t*4+i*1.7))+')';
      ctx.beginPath();ctx.arc(Math.cos(a)*rr,Math.sin(a)*rr*.62,1.3,0,TAU);ctx.fill();}
    ctx.restore();}};

// ---- white brush-ghosts behind fast movement (華) -------------------------------
// called with ctx translated to the entity's origin, unrotated, before the sprite
A.ghosts=function(e){
  if(Q()<2||!e)return;
  const sp=Math.hypot(e.vx||0,e.vy||0);
  if(sp<185)return;
  let kit=null;
  try{kit=e.boss?BSPR[e.id]:ESPR[e.type];}catch(err){}
  if(!kit||!kit.f)return;
  const S=kit.s,P=kit.p||0;
  const k=clamp((sp-185)/170,0,1);
  ctx.save();
  for(let i=0;i<2;i++){
    const dt=.05+i*.048;
    ctx.globalAlpha=(.15-i*.07)*k;
    ctx.drawImage(kit.f,-e.vx*dt-S/2-P,-e.vy*dt-S/2-P,S+2*P,S+2*P);}
  ctx.restore();
  ctx.globalAlpha=1;};

// ---- a pool of light spilling around the shadow (華) ----------------------------
// called in world space, before the engine's shadowBlob
A.pool=function(e){
  if(Q()<2||!e||e.dead||e.hidden)return;
  const r=e.r||14;
  const boss=!!e.boss,s2=e.def&&e.def.s2;
  const rr=r*(boss?3.3:2.5);
  const col=boss?'255,124,74':(s2?'255,172,102':'255,216,152');
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  const gr=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,rr);
  gr.addColorStop(0,'rgba('+col+','+(boss?.09:.055)+')');
  gr.addColorStop(1,'rgba('+col+',0)');
  ctx.fillStyle=gr;
  ctx.beginPath();ctx.ellipse(e.x,e.y,rr,rr*.6,0,0,TAU);ctx.fill();
  ctx.restore();};

// ============================================================================
// THE HERO — her steel, her rim, her lamp on the ground
// ============================================================================

// called in world space, before drawPlayer's shadowBlob
A.heroPool=function(){
  if(Q()<2)return;
  try{
    if(!P||P.dead||P.x===undefined)return;
    const warm=!!(G.run&&G.run.story===2);
    const rr=(warm?96:80)*(.94+.06*Math.sin(G.t*9.3));
    const col=warm?'255,168,116':'255,226,178';
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    const gr=ctx.createRadialGradient(P.x,P.y,0,P.x,P.y,rr);
    gr.addColorStop(0,'rgba('+col+','+(warm?.14:.10)+')');
    gr.addColorStop(.6,'rgba('+col+','+(warm?.05:.04)+')');
    gr.addColorStop(1,'rgba('+col+',0)');
    ctx.fillStyle=gr;
    ctx.beginPath();ctx.ellipse(P.x,P.y,rr,rr*.62,0,0,TAU);ctx.fill();
    ctx.restore();}
  catch(e){}};

// the weapon: a sheen gradient along the steel + a glint that travels it.
// o: {hx,hy,tx,ty, prog(0..1 while swinging|undefined), baseA, gold}
A.bladeFX=function(c,o){
  if(Q()<1||!o)return;
  const a0=o.baseA===undefined?1:o.baseA;
  const hx=o.hx,hy=o.hy,tx=o.tx,ty=o.ty;
  const dx=tx-hx,dy=ty-hy,len=Math.hypot(dx,dy)||1;
  const nx=-dy/len,ny=dx/len;
  c.save();
  // sheen: the steel reads as lit along its spine
  const gr=c.createLinearGradient(hx,hy,tx,ty);
  gr.addColorStop(0,'rgba(250,248,240,0)');
  gr.addColorStop(.62,'rgba(250,248,240,'+(.15*a0)+')');
  gr.addColorStop(1,'rgba(255,252,244,'+(.32*a0)+')');
  c.strokeStyle=gr;c.lineWidth=1.1;c.lineCap='round';
  c.beginPath();
  c.moveTo(hx+nx*1.5,hy+ny*1.5);
  c.lineTo(tx+nx*1.5,ty+ny*1.5);
  c.stroke();
  // the glint: rides the edge at rest, leads the cut in a swing
  const prog=(o.prog!==undefined&&o.prog!==null)?o.prog:(.5+.5*Math.sin(G.t*2.1));
  const gx=hx+dx*prog,gy=hy+dy*prog;
  const hot=(o.prog!==undefined&&o.prog!==null);
  star(c,gx,gy,hot?4.2:2.5,(hot?.9:.5)*a0,o.gold?'255,216,144':'250,246,232');
  c.restore();};

// her body's own rim light (called after the head, local space)
A.bodyRim=function(c,la,a0){
  if(Q()<1)return;
  const al=a0===undefined?1:a0;
  c.save();
  c.globalCompositeOperation='lighter';
  c.strokeStyle='rgba(255,236,200,'+(.15*al)+')';c.lineWidth=4.2;
  c.beginPath();c.arc(0,0,12.6,la-.8,la+.8);c.stroke();
  c.strokeStyle='rgba(255,244,214,'+(.4*al)+')';c.lineWidth=1.4;
  c.beginPath();c.arc(0,0,13,la-.55,la+.55);c.stroke();
  c.restore();};

// ============================================================================
// THE PORTRAIT — the codex sketch, pinned under raking light
// ============================================================================
A.portraitFX=function(g,WC,HC,type){
  try{
    let sd=7;
    const t=String(type||'');
    for(let i=0;i<t.length;i++)sd=(sd*31+t.charCodeAt(i))&0xffff;
    const hsh=n=>{const x=Math.sin(sd*12.9898+n*78.233)*43758.5453;return x-Math.floor(x);};

    // warm ground glow under the figure
    g.save();
    g.globalCompositeOperation='lighter';
    let gr=g.createRadialGradient(WC/2,HC*.64,0,WC/2,HC*.64,WC*.44);
    gr.addColorStop(0,'rgba(255,212,146,0.15)');
    gr.addColorStop(1,'rgba(255,212,146,0)');
    g.fillStyle=gr;g.fillRect(0,0,WC,HC);

    // raking light sweeping from the upper-left, like a lamp over a desk
    const L=Math.hypot(WC,HC);
    g.translate(WC/2,HC/2);g.rotate(-.5);
    gr=g.createLinearGradient(-L*.24,0,L*.3,0);
    gr.addColorStop(0,'rgba(255,238,200,0)');
    gr.addColorStop(.4,'rgba(255,238,200,0.08)');
    gr.addColorStop(.5,'rgba(255,246,218,0.15)');
    gr.addColorStop(.6,'rgba(255,238,200,0.08)');
    gr.addColorStop(1,'rgba(255,238,200,0)');
    g.fillStyle=gr;g.fillRect(-L,-L,L*2,L*2);
    g.restore();

    // gold motes, pinned where the seed left them
    g.save();
    g.globalCompositeOperation='lighter';
    for(let i=0;i<6;i++){
      const x=WC*(.14+hsh(i)* .72),y=HC*(.12+hsh(i+9)*.76);
      const s=1+hsh(i+20)*1.6;
      g.fillStyle='rgba(232,190,118,'+(.3+.35*hsh(i+31))+')';
      g.beginPath();g.arc(x,y,s,0,TAU);g.fill();}
    g.restore();

    // the vignette: corners fall into the page's own dusk
    gr=g.createRadialGradient(WC/2,HC/2,Math.min(WC,HC)*.34,WC/2,HC/2,Math.max(WC,HC)*.66);
    gr.addColorStop(0,'rgba(20,16,12,0)');
    gr.addColorStop(1,'rgba(20,16,12,0.28)');
    g.fillStyle=gr;g.fillRect(0,0,WC,HC);}
  catch(e){}};

return A;
})();
