// ============================================================================
// SUMIKIRI — ANIM: THE LIVING BODIES (update 2.6 動)
//
// The engine bakes its cast as single sprites and steps them between stances
// — a hard lunge scale, a hard crouch offset, feet on their own clock. This
// layer gives every fighter a body that MOVES:
//
//   · THE POSE    — one small state per body, integrated every tick: idle
//                   breath, a walk cycle whose frequency follows the body's
//                   real speed (measured from the ground, so it works for
//                   velocity movers AND the bosses' direct steps), the coil
//                   of a windup (sink back, rise, tremble as it ripens), the
//                   committed lunge of the strike, the settle of recovery,
//                   the slump of a broken posture, the tremble of a lit fuse.
//   · THE SMEAR   — while a blade attack lands, two white after-images of the
//                   body sweep the arc behind it (the ink blur of a swing).
//   · THE ENTRANCE— bosses drop out of the sky onto their mark, ease-out-back
//                   scale, dust where the mountain sets down; every move they
//                   begin is announced by a committed step into the attack.
//   · THE FEET    — strides lift and plant, diagonal pairs trot for quads,
//                   and running bodies kick up dust where the foot lands.
//
// Everything eases with frame-rate-independent exponentials — nothing ever
// pops, nothing allocates per frame (one small object per body, forever).
//
// Loaded BEFORE the engine; every engine global resolves at call time.
// The engine calls:
//   ANIM.step(e,dt)   at the very top of updateEnemy / updateBoss
//   ANIM.pose(e)      lazily, from drawEnemy / drawFeet
// ============================================================================

window.ANIM=(function(){
'use strict';
const PI=Math.PI,TAU=PI*2;
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function rr(a,b){return a+Math.random()*(b-a);}

// which attacks swing a blade (get the arc smear) and which shoot (recoil)
const SMEAR={melee:1,slam:1,poke:1,lunge:1,riposte:1,foxtackle:1,slamwave:1};
const RECOIL={volley:1,arrow:1,spray:1};
const HOVER={wraith:1,mirror:1,wisp:1};

// one small pose object per body — created once, mutated forever
function pose(e){
  let a=e._a;
  if(!a)a=e._a={lu:1,sq:1,swy:0,lift:0,tilt:0,sc:1,smear:0,ph:0,fA:0,imp:0,hk:0,
    seed:Math.random()*TAU};
  return a;}

function easeOutC(k){return 1-Math.pow(1-k,3);}
function easeOutBack(k){const c=1.70158;return 1+ (c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);}

function step(e,dt){
  const a=pose(e);
  if(!(dt>0))return a;

  // ---- the state clock: how long has this body held its current mind -----
  if(e.__ps!==e.state){e.__ps=e.state;e.__stT=0;}
  else e.__stT+=dt;

  // ---- honest ground speed (velocity movers and direct steppers both) ----
  if(e.__px===undefined){e.__px=e.x;e.__py=e.y;}
  const mvx=e.x-e.__px,mvy=e.y-e.__py;
  e.__px=e.x;e.__py=e.y;
  const spd=clamp(Math.sqrt(mvx*mvx+mvy*mvy)/Math.max(dt,.001),0,420);
  const moving=spd>26;

  // the walk phase: frequency rises with real speed; the amplitude eases
  // off on stopping, so feet finish their stride instead of freezing mid-air
  if(moving)a.ph+=dt*(1.9+spd*.0125);
  a.fA+=((moving?1:0)-a.fA)*(1-Math.exp(-9*dt));

  // ---- stance targets ------------------------------------------------------
  let tLu=1,tSq=1,tSwy=0,tLift=0,tTilt=0;
  const st=e.state,r=e.r||14,heavy=r>=20,def=e.def;
  const atk=def&&def.atk;

  if(st==='windup'||st==='aim'){
    // the coil: sink back, rise, blade arm read high
    tLu=heavy?.93:.90;tSq=1+(heavy?.05:.09);tSwy=-r*.30;tLift=-3.5;tTilt=-.055;
    if(st==='aim'){tLu=.95;tTilt=-.03;}
    // a tremble as the windup ripens — the flesh knows what is coming
    const windT=def&&def.wind?def.wind*(e.wMul||1):0;
    if(windT>0){const ripe=1-clamp(e.t/windT,0,1);
      tSwy+=Math.sin(e.__stT*30)*.9*ripe*ripe;}
  }else if(st==='active'||st==='charging'){
    tLu=1.15;tSq=heavy?.84:.88;tSwy=r*.42;tLift=2.5;tTilt=.09;
    if(RECOIL[atk]){tSwy=-r*.22;tLu=1.06;tTilt=-.03;} // shooters lean BACK into the release
  }else if(st==='recover'){
    tLu=.975;tSq=1.02;tSwy=r*.10;
  }else if(st==='channel'){
    tLu=1.03;tSq=1.05;tLift=-6; // the sorcerer rises while he summons
  }

  // ---- bosses: the entrance, the breath, the committed step ----------------
  if(e.boss){
    if(st==='intro'){
      if(e.__it0===undefined)e.__it0=e.stateT;
      const p=clamp((e.__it0-e.stateT)/.55,0,1);
      tLift-=150*(1-easeOutC(p));            // the drop out of the sky
      a.sc=.62+.38*easeOutBack(p);           // and the pop as it lands
      if(p>=1&&!a.landed){a.landed=true;     // dust where the mountain set down
        try{
          if(typeof addRing==='function')addRing(e.x,e.y,r*2.1,'rgba(74,68,60,0.45)');
          if(typeof addPart==='function')for(let i=0;i<10;i++){
            const aa=i/10*TAU;
            addPart({x:e.x+Math.cos(aa)*r*.7,y:e.y+Math.sin(aa)*r*.35,
              vx:Math.cos(aa)*rr(60,140),vy:Math.sin(aa)*rr(30,70)*.5-rr(10,40),
              life:rr(.3,.55),max:.55,size:rr(1.6,3.4),color:'rgba(110,100,82,0.5)',grav:180,drag:.9});}
          if(typeof trauma==='function')trauma(.14);
        }catch(err){}}
    }else{
      a.landed=false;
      a.sc+=(1-a.sc)*(1-Math.exp(-8*dt));}
    // idle: the great body breathes and drifts on its own slow clock
    if(st==='idle'){tSq+=Math.sin(G.t*1.05+a.seed)*.014;tLift+=Math.sin(G.t*1.1+a.seed)*2.6;}
    // every move begins with a committed step INTO the attack
    const ak=st+':'+(e.move||'')+':'+(e.sub||0);
    if(ak!==e.__ak){e.__ak=ak;
      if(st==='act'&&e.move)a.imp=1;}
    a.imp*=Math.exp(-5.5*dt);
    tLu+=.12*a.imp;tSwy+=r*.28*a.imp;tTilt+=.075*a.imp;
  }else{
    a.sc=1;
    // grounded fighters breathe at rest — the ink still has lungs
    tSq+=Math.sin(e.bob*.5+a.seed)*.011*(1-a.fA);
  }

  // hover types drift with a gentle roll — spirits never quite stand
  if(HOVER[e.type]){tTilt+=Math.sin(e.bob*.45+a.seed)*.045;tLift+=Math.sin(e.bob*.3)*1.5;}

  // ---- the walk cycle rides on top of the stance ---------------------------
  if(a.fA>.02&&(st==='seek'||st==='idle'||st==='channel'||st==='recover')){
    const amp=Math.min(3.6,r*.16)*a.fA;
    tSwy+=Math.sin(a.ph)*amp;               // weight shifts with the stride
    tTilt+=Math.sin(a.ph)*.05*a.fA;
    tLift-=Math.abs(Math.cos(a.ph))*1.4*a.fA; // the little bound of each step
  }

  // ---- the wound states ----------------------------------------------------
  if(e.broken){tLu*=.95;tLift+=2.5;tTilt+=.05;}   // a broken posture folds
  if(e.fused)tTilt+=Math.sin(e.life*34)*.03;      // the swallowed fire trembles

  // hit recoil fades with the engine's own hit timer (adds to its flinch)
  a.hk=e.hitT>0?clamp(e.hitT/.18,0,1):0;

  // the swing's bell: a smooth rise and fall through the active window
  a.smear=(st==='active'&&SMEAR[atk])?Math.sin(clamp(e.__stT/.26,0,1)*PI):0;

  // ---- integrate: independent, frame-rate-safe easing ----------------------
  const kA=1-Math.exp(-16*dt); // attack postures arrive fast
  const kB=1-Math.exp(-9*dt);  // sway settles gently
  a.lu+=(tLu-a.lu)*kA;
  a.sq+=(tSq-a.sq)*kA;
  a.swy+=(tSwy-a.swy)*kB;
  a.lift+=(tLift-a.lift)*kA;
  a.tilt+=(tTilt-a.tilt)*kB;

  // ---- dust where the sandals bite (fast grounded bodies only) -------------
  if(moving&&spd>150&&!e.boss&&!HOVER[e.type]&&
     !(typeof NOFEET!=='undefined'&&NOFEET[e.type])){
    const pi=Math.floor(a.ph/PI);
    if(pi!==e.__fs){e.__fs=pi;
      try{if(typeof addPart==='function')addPart({
        x:e.x+rr(-5,5),y:e.y+7,vx:rr(-14,14),vy:rr(-26,-8),
        life:rr(.25,.45),max:.45,size:rr(1.2,2.4),color:'rgba(120,110,88,0.5)',grav:120,drag:.92});}
      catch(err){}}}
  return a;}

return {pose:pose,step:step};
})();
