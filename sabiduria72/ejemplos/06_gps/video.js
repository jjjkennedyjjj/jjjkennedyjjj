BLOOM=.2;GRAIN=.04;
/* ===== SABIDURÍA 72 · Vídeo 06 · ¿Cómo hace un GPS para no equivocarse por la relatividad? =====
   Estilo ilustrado · cámara fija · metáfora continua: el PUNTO AZUL (empieza en tu calle, se aleja kilómetros
   y la corrección lo devuelve a casa; su recorrido se cierra en el ∞). Tiempos en segundos de AUDIO. */
const LOGO_T0=94.49;
const LOGO_SUB=['CIENCIA','QUE','ASOMBRA'];
const GANCHO={n:2,claves:['Einstein','kilómetros'],pre:.9,y:800,estilo:'chispa'};
const PRE=GANCHO.pre+OFF;           // desplaza solo las animaciones de entrada de la escena 1

/* ---------- utilidades del vídeo ---------- */
const S=(ta,a,b)=>ease(prog(ta,a,b));
const fio=(ta,a,b,f=.3)=>ease(prog(ta,a,a+f))*(1-ease(prog(ta,b-f,b)));
const ASSET={};const asset=(k,f)=>ASSET[k]||(ASSET[k]=f());
const BLUE=C.blue;
function blob(g,cx,cy,r,seed,n=9){const pts=[];for(let i=0;i<n;i++){const a=i/n*6.283,rr0=r*(.6+rnd(seed+i*3.3)*.6);pts.push([cx+Math.cos(a)*rr0,cy+Math.sin(a)*rr0*.8])}
 g.beginPath();for(let i=0;i<n;i++){const p0=pts[i],p1=pts[(i+1)%n];const mx=(p0[0]+p1[0])/2,my=(p0[1]+p1[1])/2;if(i===0)g.moveTo(mx,my);else g.quadraticCurveTo(p0[0],p0[1],mx,my)}g.closePath()}

/* mapa de ciudad horneado (900×1000): calles claras, manzanas azul marino, parque, río */
function mapTex(){return asset('map',()=>bake(900,1000,g=>{
 g.fillStyle='#8394cc';g.fillRect(0,0,900,1000);
 const xs=[0,150,450,750,900],ys=[0,200,500,800,1000];
 for(let i=0;i<4;i++)for(let j=0;j<4;j++){const hx=i===1?11:11,x0=xs[i]+(i?hx:-20),x1=xs[i+1]-(i<3?hx:-20);const hy=j===2?17:11,y0=ys[j]+(j?(j===2?17:11):-20),y1=ys[j+1]-(j<3?(j===1?17:11):-20);
  const park=(i===2&&j===0),water=(i===0&&j===3);
  g.fillStyle=park?'#1f6a5c':water?'#1f6fa8':((i+j)%2?'#1c3172':'#192b66');rr(x0,y0,x1-x0,y1-y0,16);g.fill();
  if(!park&&!water){for(let k=0;k<7;k++){const bw=26+rnd(i*9+j*5+k)*34,bh=22+rnd(i*7+j*3+k*2)*30;const bx=x0+14+rnd(i*5+j*11+k*4)*(x1-x0-bw-28),by=y0+14+rnd(i*3+j*13+k*6)*(y1-y0-bh-28);
    g.fillStyle='rgba(120,150,230,.22)';rr(bx,by,bw,bh,6);g.fill()}}
  if(park){for(let k=0;k<9;k++){g.fillStyle='rgba(60,190,130,.35)';g.beginPath();g.arc(x0+30+rnd(k*3)*(x1-x0-60),y0+30+rnd(k*5+2)*(y1-y0-60),14+rnd(k)*10,0,7);g.fill()}}}
 g.strokeStyle='#e6bd62';g.lineWidth=7;g.setLineDash([26,18]);g.beginPath();g.moveTo(0,500);g.lineTo(900,500);g.stroke();g.setLineDash([]);
 g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=3;g.setLineDash([16,16]);[150,450,750].forEach(x=>{g.beginPath();g.moveTo(x,0);g.lineTo(x,1000);g.stroke()});[200,800].forEach(y=>{g.beginPath();g.moveTo(0,y);g.lineTo(900,y);g.stroke()});g.setLineDash([])}))}
function mapView(x,y,w,h,cx,cy,k,r,fn){const g=ctx;g.save();rr(x,y,w,h,r);g.clip();g.translate(x+w/2,y+h/2);g.scale(k,k);g.translate(-cx,-cy);g.drawImage(mapTex(),0,0);if(fn)fn();g.restore()}
function house(x,y,s,lit=0){const g=ctx;g.save();g.translate(x,y);g.scale(s,s);
 g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(6,24,40,9,0,0,7);g.fill();
 g.fillStyle=lin(-34,-10,34,24,[[0,'#f4e6c4'],[1,'#c9b387']]);rr(-32,-10,64,34,4);g.fill();
 g.fillStyle=lin(-40,-44,40,-8,[[0,'#e56a5a'],[1,'#a93c3c']]);g.beginPath();g.moveTo(-42,-8);g.lineTo(0,-44);g.lineTo(42,-8);g.closePath();g.fill();
 g.fillStyle='#6b4a33';rr(-6,4,12,20,3);g.fill();
 g.fillStyle=lit?lin(0,-6,0,10,[[0,'#fff1b0'],[1,'#ffc857']]):'#3a4f86';rr(14,-2,12,12,2);g.fill();rr(-26,-2,12,12,2);g.fill();g.restore();
 if(lit)glow(x,y+2*s,70*s,C.amber,.55*lit)}
function gpsDot(x,y,r,t,col=BLUE){const g=ctx;const p=(t*.9)%1;g.save();g.globalAlpha*=.35*(1-p);g.fillStyle=col;g.beginPath();g.arc(x,y,r*(1.3+p*2.6),0,7);g.fill();g.restore();
 g.save();g.shadowColor=col;g.shadowBlur=18;g.fillStyle='#fff';g.beginPath();g.arc(x,y,r*1.28,0,7);g.fill();g.restore();ball(x,y,r,col)}
function phoneBody(x,y,w,h){const g=ctx;g.save();g.fillStyle='rgba(0,0,0,.35)';rr(x-w/2+10,y-h/2+16,w,h,64);g.fill();
 g.fillStyle=lin(x-w/2,y-h/2,x+w/2,y+h/2,[[0,'#2a3a6e'],[.5,'#18234a'],[1,'#0d1430']]);rr(x-w/2,y-h/2,w,h,62);g.fill();g.lineWidth=3;g.strokeStyle='rgba(150,175,255,.4)';g.stroke();
 g.fillStyle='#050912';rr(x-w/2+14,y-h/2+16,w-28,h-32,48);g.fill();g.restore()}
function clock(x,y,r,sec,o={}){const g=ctx;g.save();g.translate(x,y);const col=o.col||C.cyan;
 g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.arc(8,12,r,0,7);g.fill();
 g.fillStyle=rad(-r*.35,-r*.4,r*.05,r*1.2,[[0,'#2a3d7e'],[.5,'#17224f'],[1,'#0b1230']]);g.beginPath();g.arc(0,0,r,0,7);g.fill();g.lineWidth=r*.07;g.strokeStyle=col;g.shadowColor=col;g.shadowBlur=o.glow||0;g.stroke();g.shadowBlur=0;
 for(let i=0;i<12;i++){const a=i/12*6.283;g.strokeStyle=i%3?'rgba(220,235,255,.45)':'rgba(240,248,255,.9)';g.lineWidth=i%3?3:6;g.beginPath();g.moveTo(Math.sin(a)*r*.8,-Math.cos(a)*r*.8);g.lineTo(Math.sin(a)*r*.9,-Math.cos(a)*r*.9);g.stroke()}
 const hand=(a,len,w,c)=>{g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(-Math.sin(a)*r*.12,Math.cos(a)*r*.12);g.lineTo(Math.sin(a)*r*len,-Math.cos(a)*r*len);g.stroke()};
 if(o.ghost!=null)hand(o.ghost,.78,r*.045,'rgba(255,255,255,.28)');
 hand(sec/12,.5,r*.075,C.white);hand(sec,.78,r*.04,o.hand||C.amber);g.fillStyle=C.white;g.beginPath();g.arc(0,0,r*.07,0,7);g.fill();g.restore()}
function satellite(x,y,s,ang=0,t=0){const g=ctx;g.save();g.translate(x,y);g.rotate(ang);g.scale(s,s);
 [-1,1].forEach(sd=>{g.save();g.translate(sd*128,0);g.fillStyle=lin(-48,-72,48,72,[[0,'#3f90f4'],[1,'#12399a']]);rr(-46,-70,92,140,6);g.fill();
  g.strokeStyle='rgba(190,220,255,.5)';g.lineWidth=2;for(let i=1;i<3;i++){g.beginPath();g.moveTo(-46+i*30.7,-70);g.lineTo(-46+i*30.7,70);g.stroke()}for(let j=1;j<4;j++){g.beginPath();g.moveTo(-46,-70+j*35);g.lineTo(46,-70+j*35);g.stroke()}g.restore();
  g.strokeStyle='#a5b2d4';g.lineWidth=7;g.beginPath();g.moveTo(sd*42,0);g.lineTo(sd*82,0);g.stroke()});
 g.fillStyle=lin(-42,-52,42,52,[[0,'#ffd97e'],[.5,'#e3a52b'],[1,'#a86d14']]);rr(-42,-52,84,104,12);g.fill();g.fillStyle='rgba(0,0,0,.18)';rr(10,-52,32,104,12);g.fill();
 g.fillStyle='#2a3566';rr(-42,-8,84,16,3);g.fill();g.strokeStyle='#cfd8f0';g.lineWidth=5;g.beginPath();g.moveTo(0,-52);g.lineTo(0,-84);g.stroke();ball(0,-92,11,'#eaf2ff');g.restore();
 glow(x,y-92*s,44*s,C.cyan,.35+.25*Math.sin(t*7))}
function earth(x,y,r){const R=Math.round(r);const im=asset('earth'+R,()=>bake(2*R+60,2*R+60,g=>{const c=R+30;g.save();g.beginPath();g.arc(c,c,R,0,7);g.clip();
  g.fillStyle=rad(c-R*.35,c-R*.4,R*.05,R*1.3,[[0,'#4aa0ff'],[.5,'#1d5fc4'],[1,'#0a2a6e']]);g.fillRect(0,0,2*c,2*c);
  for(let k=0;k<7;k++){const a=rnd(k*2.1)*6.283,d=rnd(k*3.7+1)*R*.7;g.fillStyle=k%2?'#3fb36f':'#56c97f';blob(g,c+Math.cos(a)*d,c+Math.sin(a)*d*.9,R*(.18+rnd(k)*.2),k*5+1);g.fill()}
  g.fillStyle=rad(c+R*.55,c+R*.5,R*.2,R*1.35,[[0,'rgba(2,6,22,0)'],[1,'rgba(2,6,22,.7)']]);g.fillRect(0,0,2*c,2*c);g.restore()}));
 ctx.drawImage(im,x-R-30,y-R-30);ctx.save();ctx.strokeStyle='rgba(120,200,255,.35)';ctx.lineWidth=6;ctx.beginPath();ctx.arc(x,y,R+3,Math.PI*1.05,Math.PI*1.95);ctx.stroke();ctx.restore()}
function gauge(x,y,r,val,max,col){const g=ctx;g.save();g.translate(x,y);g.lineCap='round';g.lineWidth=24;g.strokeStyle='rgba(255,255,255,.12)';g.beginPath();g.arc(0,0,r,Math.PI,2*Math.PI);g.stroke();
 const a=Math.PI+Math.PI*clamp(val/max);g.strokeStyle=col;g.shadowColor=col;g.shadowBlur=14;g.beginPath();g.arc(0,0,r,Math.PI,a);g.stroke();g.shadowBlur=0;
 for(let i=0;i<=5;i++){const aa=Math.PI+Math.PI*i/5;g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=3;g.beginPath();g.moveTo(Math.cos(aa)*(r-26),Math.sin(aa)*(r-26));g.lineTo(Math.cos(aa)*(r-40),Math.sin(aa)*(r-40));g.stroke()}
 g.rotate(a);g.fillStyle=C.white;g.beginPath();g.moveTo(r-34,0);g.lineTo(-6,-7);g.lineTo(-6,7);g.closePath();g.fill();g.restore();ball(x,y,13,col)}
function atom(x,y,r,t){const g=ctx;g.save();g.translate(x,y);for(let k=0;k<3;k++){g.save();g.rotate(k*Math.PI/3);g.strokeStyle='rgba(95,227,255,.55)';g.lineWidth=4;g.beginPath();g.ellipse(0,0,r,r*.36,0,0,7);g.stroke();
  const a=t*(2.2+k*.5)+k*2;g.fillStyle=C.cyan;g.shadowColor=C.cyan;g.shadowBlur=16;g.beginPath();g.arc(Math.cos(a)*r,Math.sin(a)*r*.36,10,0,7);g.fill();g.restore()}
 ball(0,0,r*.2,C.amber);ball(r*.07,r*.05,r*.12,C.magenta);g.restore()}
function ruler(x,y,len,ang,col,p=1){const g=ctx;g.save();g.translate(x,y);g.rotate(ang);g.globalAlpha*=clamp(p);const h=64;
 g.fillStyle=lin(0,-h/2,0,h/2,[[0,light(col,.35)],[1,dark(col,.25)]]);rr(-len/2,-h/2,len,h,10);g.fill();g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=3;
 const n=Math.round(len/20);for(let i=0;i<=n;i++){const xx=-len/2+14+(len-28)*i/n;g.beginPath();g.moveTo(xx,-h/2);g.lineTo(xx,-h/2+(i%5?14:26));g.stroke()}g.restore()}

/* ===================== ESCENA 1 · gancho + «el GPS mide tiempo» (0–10,8) ===================== */
function sc1(ta){
 const e=prog(ta+PRE,0,.9),pop=back(e),k=.9+.1*pop;const px0=540,py0=720,pw=470,ph=840;
 const g=ctx;g.save();g.translate(px0,py0);g.scale(k,k);g.translate(-px0,-py0);
 phoneBody(px0,py0,pw,ph);const sx=px0-pw/2+18,sy=py0-ph/2+20,sw=pw-36,sh=ph-40;
 const home=[450,610],lost=[640,225];
 let dp=home,lostA=0;
 if(ta>=2.63&&ta<5.73){const p=ease(prog(ta,2.63,4.3));dp=[lerp(home[0],lost[0],p),lerp(home[1],lost[1],p)];if(ta>4.3){dp=[lost[0]+Math.sin(ta*9)*7,lost[1]+Math.cos(ta*7)*6]}lostA=1}
 else if(ta>=5.73&&ta<6.4){const p=ease(prog(ta,5.73,6.3));dp=[lerp(lost[0],home[0],p),lerp(lost[1],home[1],p)]}
 mapView(sx,sy,sw,sh,447,500,1,42,()=>{
  house(535,655,1.1,0);
  if(lostA){const p=Math.min(1,ease(prog(ta,2.63,4.3)));ctx.save();ctx.setLineDash([14,12]);ctx.strokeStyle=rgba(C.red,.9);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(home[0],home[1]);ctx.lineTo(dp[0],dp[1]);ctx.stroke();ctx.restore()}
  gpsDot(dp[0],dp[1],17,ta);
  if(ta>=4.6&&ta<5.75){const a=fio(ta,4.6,5.7);A(a,()=>{glass(dp[0]-140,dp[1]+36,150,52,{r:26,line:rgba(C.red,.8)});txt('± km',dp[0]-65,dp[1]+63,32,C.red,{w:900})})}});
 g.restore();
 /* regla tachada → reloj */
 const rA=fio(ta,6.25,9.35,.35),clA=S(ta,9.38,10.0)*(1-S(ta,10.4,10.8));
 if(rA>0){const sw2=S(ta,6.25,6.9);A(rA,()=>{ruler(540-(1-sw2)*500,740,640,-.35,C.amber,1);txt('regla',420,610,38,C.amber,{w:900,alpha:sw2,stroke:'#050912',sw:8})});
  if(ta>=8.0){const cp=prog(ta,8.0,8.55);A(rA,()=>crossM(540,720,300,C.red,cp,22))}}
 if(clA>0){const s2=back(prog(ta,9.38,9.95));A(clA,()=>{ctx.save();ctx.translate(540,720);ctx.scale(.4+.6*s2,.4+.6*s2);ctx.translate(-540,-720);clock(540,720,230,(ta-9.38)*6.283/60*40,{col:C.cyan,glow:24});txt('TIEMPO',540,990,54,C.cyan,{w:900,ls:6});ctx.restore()})}
 callout(sx+222,sy+600,sx+330,sy+560,'tu calle',C.green,1.15,ta,{side:'r'})}

/* ===================== ESCENA 2 · satélite, señal y relojes (10,8–25,8) ===================== */
function sc2(ta){
 const aA=fio(ta,10.9,19.6,.4),aB=fio(ta,19.5,21.9,.35),aC=fio(ta,21.8,25.8,.4);
 /* A: satélite → señal → móvil (un hueco central para: su hora → velocidad de la luz → 30 cm) */
 if(aA>0)A(aA,()=>{const sy=470,py=1030;
  const pp=S(ta,10.9,11.5);
  satellite(540,sy-(1-pp)*60,1.15,0,ta);
  ctx.save();ctx.translate(540,py);phoneBody(0,0,170,300);ctx.restore();
  ctx.save();rr(540-68,py-124,136,248,26);ctx.clip();ctx.fillStyle=rad(540,py,10,220,[[0,'#2b5fd0'],[1,'#10245c']]);ctx.fillRect(540-68,py-124,136,248);ctx.restore();gpsDot(540,py,13,ta);
  /* pulsos de señal */
  if(ta>12.8){for(let k=0;k<3;k++){const q=((ta-12.8)*.55+k/3)%1;const y=lerp(820,py-140,q);const w=lerp(70,210,q);ctx.save();ctx.globalAlpha*=Math.sin(q*Math.PI)*.9;ctx.strokeStyle=C.cyan;ctx.lineWidth=8;ctx.shadowColor=C.cyan;ctx.shadowBlur=14;ctx.beginPath();ctx.ellipse(540,y,w,w*.28,0,0,Math.PI);ctx.stroke();ctx.restore()}}
  /* a) su hora */
  const hA=fio(ta,10.95,12.9,.3);A(hA,()=>{glass(150,590,660,120,{r:36,line:rgba(C.amber,.6)});txt('hora del satélite',480,622,28,C.dim,{w:700});const ms=Math.floor((ta-10.9)*1000);txt('09:41:'+String(7+Math.floor(ms/1000)).padStart(2,'0')+','+String(ms%1000).padStart(3,'0'),480,670,56,C.amber,{w:900})});
  /* b) velocidad de la luz */
  const sA=fio(ta,12.9,15.8,.3);A(sA,()=>{glass(120,590,720,150,{r:36,line:rgba(C.cyan,.55)});txt('señal a la velocidad de la luz',480,626,30,C.dim,{w:700,maxW:620});txt(fmt(299792*easeOut(prog(ta,13.1,14.8)))+' km/s',480,688,66,C.cyan,{w:900,maxW:640})});
  /* c) 1 ns = 30 cm */
  const nA=fio(ta,15.7,19.6,.35);A(nA,()=>{glass(90,570,780,190,{r:36,line:rgba(C.amber,.55)});ruler(480,688,640,0,C.amber,1);
   const pr=((ta-16)*1.0)%1;if(ta>16){ctx.save();ctx.fillStyle='#fff';ctx.shadowColor='#fff';ctx.shadowBlur=24;ctx.beginPath();ctx.arc(190+pr*580,688,16,0,7);ctx.fill();ctx.restore()}
   txt('1 nanosegundo',260,610,30,C.white,{w:800});txt('30 cm',700,610,36,C.amber,{w:900})})}
 );
 /* B: reloj atómico */
 if(aB>0)A(aB,()=>{const s2=back(prog(ta,19.6,20.2));ctx.save();ctx.translate(540,700);ctx.scale(.6+.4*s2,.6+.4*s2);ctx.translate(-540,-700);atom(540,700,230,ta);ctx.restore();
  glass(150,960,660,110,{r:30,line:rgba(C.cyan,.5)});txt('átomo de cesio · reloj atómico',480,990,30,C.cyan,{w:800,maxW:600});txt('9.192.631.770 oscilaciones = 1 s',480,1034,30,C.white,{w:700,maxW:600})});
 /* C: el error se vuelve enorme */
 if(aC>0)A(aC,()=>{const rows=[['1 ns','30 cm',120,C.green],['1 µs','300 m',250,C.amber],['1 ms','300 km',390,C.red]];
  glass(80,420,800,640,{r:34});txt('un error de tiempo = distancia',480,480,34,C.white,{w:800,maxW:700});
  rows.forEach(([a,b,wd,col],i)=>{const t0=22.0+i*1.1,p=easeOut(prog(ta,t0,t0+.9));const y=590+i*150;txt(a,170,y,46,col,{w:900,a:'left'});
   ctx.fillStyle=rgba(col,.25);rr(310,y-26,wd+10,52,26);ctx.fill();ctx.fillStyle=col;rr(310,y-26,Math.max(8,wd*p),52,26);ctx.fill();txt(b,310+wd*p+22,y,44,col,{w:900,a:'left',alpha:p})});
  const sh=S(ta,24.3,24.8);A(sh,()=>{burst(790,740,16,24.3,ta,C.red,{v:150,r:7,seed:5});})})}

/* ===================== ESCENA 3 · el problema: velocidad y gravedad (25,8–45) ===================== */
function sc3(ta){
 /* Tierra y órbita (abajo) */
 const ex=540,ey=1500,er=470,orr=590;
 ctx.save();ctx.strokeStyle='rgba(95,227,255,.35)';ctx.setLineDash([16,16]);ctx.lineWidth=4;ctx.beginPath();ctx.arc(ex,ey,orr,Math.PI*1.18,Math.PI*1.82);ctx.stroke();ctx.restore();
 earth(ex,ey,er);
 const ang=-Math.PI/2+Math.sin((ta-25.8)*.35)*.34-(.17);
 const sx=ex+Math.cos(ang)*orr,sy=ey+Math.sin(ang)*orr;
 satellite(sx,sy,.5,ang+Math.PI/2,ta);
 /* altura */
 const alt=S(ta,27.5,28.3);A(alt,()=>{ctx.save();ctx.strokeStyle=C.amber;ctx.lineWidth=5;ctx.setLineDash([12,10]);ctx.beginPath();ctx.moveTo(ex+Math.cos(ang)*er,ey+Math.sin(ang)*er);ctx.lineTo(sx,sy+30);ctx.stroke();ctx.restore();
  glass(sx+70,sy+22,300,60,{r:30,line:rgba(C.amber,.7)});txt('20.000 km',sx+220,sy+53,34,C.amber,{w:900})});
 /* ¡problema! */
 const pr=fio(ta,26.1,27.4,.25);A(pr,()=>{const s2=back(prog(ta,26.1,26.6));ctx.save();ctx.translate(540,640);ctx.scale(.5+.5*s2,.5+.5*s2);ctx.translate(-540,-640);ball(540,640,120,C.red);txt('!',540,646,170,'#fff',{w:900});ctx.restore()});
 /* velocímetro */
 const gA=fio(ta,28.7,33.3,.4);A(gA,()=>{glass(190,330,700,300,{r:36});const v=3.9*easeOut(prog(ta,30.4,32.4));gauge(540,590,170,v,5,C.cyan);txt(fmt(v,1)+' km/s',540,620,52,C.white,{w:900});txt('velocidad del satélite',540,358,28,C.dim,{w:700})});
 /* dos relojes */
 const cA=fio(ta,33.2,45,.4);if(cA>0)A(cA,()=>{
  const lag=ta>34?Math.min(1,(ta-34)/5):0;
  const earthSec=(ta-33.2)*6.283/60*60;
  const satSec=earthSec*(1-.22*lag)+Math.max(0,ta-39.8)*6.283/60*60*.55*prog(ta,39.8,44.8);
  clock(300,520,112,earthSec,{col:C.green,glow:14,hand:C.green});txt('TIERRA',300,672,34,C.green,{w:900});
  clock(780,520,112,satSec,{col:ta<39.6?C.red:C.amber,glow:14,ghost:earthSec});txt('SATÉLITE',780,672,34,ta<39.6?C.red:C.amber,{w:900});
  const sA=S(ta,36.9,37.5)*(1-S(ta,39.4,39.7));A(sA,()=>{glass(560,730,420,86,{r:30,line:rgba(C.red,.8)});txt('−7 µs al día',770,773,46,C.red,{w:900})});
  const gR=S(ta,41,41.7);A(gR,()=>{glass(70,730,440,86,{r:30,line:rgba(C.violet,.8)});txt('como en el VÍDEO 02',290,773,28,C.violet,{w:900})})});
 /* gravedad más débil: campo */
 const gv=S(ta,40.4,41.2)*(1-S(ta,44.5,44.95));A(gv,()=>{for(let i=0;i<4;i++){const q=(i+.5)/4;ctx.save();ctx.globalAlpha*=.75-q*.5;ctx.strokeStyle=C.violet;ctx.lineWidth=5-i;ctx.beginPath();ctx.arc(ex,ey,er+34+i*i*20+i*32,Math.PI*1.2,Math.PI*1.8);ctx.stroke();ctx.restore()}
  txt('gravedad más débil',540,1110,34,C.violet,{w:900})})}

/* ===================== ESCENA 4 · el balance (45–60,2) ===================== */
function sc4(ta){
 const px=540,py=700,L=330;
 const drop=bounce(prog(ta,45.1,45.8));
 const tilt=ta<45.8?0:.2*spring(prog(ta,45.8,47.3),7,.6)*(1);
 const leftBlock=S(ta,45,45.5);
 ctx.save();ctx.translate(px,py);
 ctx.fillStyle=lin(-60,0,60,300,[[0,'#8a97c6'],[1,'#3b4778']]);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-70,300);ctx.lineTo(70,300);ctx.closePath();ctx.fill();
 ctx.rotate(tilt);ctx.fillStyle=lin(-L,0,L,0,[[0,'#cfd8f0'],[1,'#8a97c6']]);rr(-L,-12,2*L,24,12);ctx.fill();
 [-1,1].forEach(sd=>{const isR=sd>0;const bx=sd*L,by=0;ctx.save();ctx.translate(bx,by);ctx.rotate(-tilt);
  ctx.strokeStyle='rgba(200,215,255,.6)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-80,110);ctx.moveTo(0,0);ctx.lineTo(80,110);ctx.stroke();
  ctx.fillStyle=lin(0,104,0,134,[[0,'#d6def5'],[1,'#7683b5']]);rr(-100,108,200,24,12);ctx.fill();
  const col=isR?C.green:C.red;const w=isR?150:80,h=isR?120:60;const yy=isR?(108-h-(1-drop)*260):108-h;
  if(isR||leftBlock>0){ctx.save();ctx.globalAlpha*=isR?1:leftBlock;ctx.fillStyle=lin(-w/2,yy,w/2,yy+h,[[0,light(col,.3)],[1,dark(col,.35)]]);rr(-w/2,yy,w,h,14);ctx.fill();
   txt(isR?'+45 µs':'−7 µs',0,yy+h/2+2,isR?44:34,'#06101f',{w:900,maxW:w-16});ctx.restore()}
  ctx.restore()});
 ball(0,0,22,C.amber);ctx.restore();
 txt('gravedad',px+L,py+250,34,C.green,{w:900,alpha:S(ta,47.2,47.8)});txt('velocidad',px-L,py+250,34,C.red,{w:900,alpha:S(ta,45.2,45.8)});
 const win=S(ta,48.2,48.8)*(1-S(ta,50.0,50.4));A(win,()=>{callout(px+L-30,py+150,px+L+150,py+260,'una le gana a la otra',C.green,48.25,ta,{size:26,side:'l'})});
 /* resultado */
 const rA=S(ta,50.3,51.0)*(1-S(ta,57.4,57.9));A(rA,()=>{glass(130,1000,700,130,{r:36,line:rgba(C.green,.7)});const v=38*easeOut(prog(ta,51.4,55.4));txt('+'+fmt(v)+' µs al día',480,1052,66,C.green,{w:900,maxW:620});txt('el reloj del satélite se adelanta',480,1102,26,C.dim,{w:700})});
 /* × velocidad de la luz */
 const mA=S(ta,57.5,58.1);if(mA>0){A(mA,()=>{ctx.save();ctx.fillStyle='rgba(6,10,26,.92)';rr(100,930,760,230,36);ctx.fill();ctx.restore();glass(100,930,760,230,{r:36,line:rgba(C.amber,.8)});
  txt('38 µs',250,1005,52,C.green,{w:900,alpha:1});txt('×',390,1005,56,C.white,{w:900,alpha:S(ta,58.3,58.8)});txt('299.792 km/s',600,1005,40,C.cyan,{w:900,alpha:S(ta,58.3,58.9),maxW:330});
  const e=S(ta,59.2,59.8);txt('=  '+fmt(11.4*easeOut(prog(ta,59.2,60.1)),1)+' km',480,1100,76,C.amber,{w:900,alpha:e,maxW:640})})}}

/* ===================== ESCENA 5 · momento estrella: el punto azul se aleja (60,2–70,2) ===================== */
function sc5(ta){
 const vx=120,vy=360,vw=820,vh=720,house0=[-290,210],dir=[Math.cos(-.49),Math.sin(-.49)];
 const kpx=114;                             // 11,4 km = 114 px  (10 km = 100 px)
 let days=0;[61.2,64.6,65.5,66.4,67.3].forEach((t,i)=>{days+=spring(prog(ta,t,t+.6),8,.7)*(i?1:1)});
 days=Math.min(5.0,days);
 const cx=vx+vw/2,cy=vy+vh/2;const hx=cx+house0[0],hy=cy+house0[1];
 const dx=hx+dir[0]*days*kpx,dy=hy+dir[1]*days*kpx;
 const climax=S(ta,68.2,69.2);
 const k=1+.28*climax;
 glass(vx-10,vy-10,vw+20,vh+20,{r:48});
 mapView(vx,vy,vw,vh,450,500,.62,40,()=>{
  /* en coordenadas del mapa (escala .62): convertimos desde pantalla */
  const inv=1/.62;const mx=(x)=>450+(x-cx)*inv,my=(y)=>500+(y-cy)*inv;
  ctx.save();ctx.setLineDash([20,16]);ctx.strokeStyle=rgba(C.red,.95);ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(mx(hx),my(hy));ctx.lineTo(mx(dx),my(dy));ctx.stroke();ctx.restore();
  house(mx(hx),my(hy),1.7,0);});
 /* punto + etiquetas (en pantalla, con acercar en el clímax) */
 ctx.save();ctx.beginPath();rr(vx,vy,vw,vh,40);ctx.clip();
 acercar(dx,dy,k,()=>{glow(dx,dy,120*(1+climax),C.red,.35+.4*climax);gpsDot(dx,dy,22,ta);burst(dx,dy,22,68.2,ta,C.red,{v:200,r:7,seed:9,d:1.1})});
 ctx.restore();
 /* distancia */
 if(ta>=61.2){const km=Math.round(days*11.4*10)/10;const lx=Math.min(dx+36,vx+vw-250),ly=Math.max(dy-70,vy+60);A(S(ta,61.2,61.7),()=>{glass(lx,ly,230,64,{r:32,line:rgba(C.red,.85)});txt(fmt(km,1)+' km',lx+115,ly+33,38,C.red,{w:900})})}
 /* escala */
 ctx.save();ctx.strokeStyle=C.white;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(vx+50,vy+vh-48);ctx.lineTo(vx+150,vy+vh-48);ctx.moveTo(vx+50,vy+vh-58);ctx.lineTo(vx+50,vy+vh-38);ctx.moveTo(vx+150,vy+vh-58);ctx.lineTo(vx+150,vy+vh-38);ctx.stroke();ctx.restore();
 txt('10 km',vx+100,vy+vh-78,28,C.white,{w:800});
 /* día */
 const dn=Math.max(1,Math.min(5,Math.floor(days+.35)));A(S(ta,63.1,63.6),()=>{glass(vx+20,vy+20,230,74,{r:37,line:rgba(C.amber,.8)});txt('DÍA '+dn,vx+135,vy+58,44,C.amber,{w:900})});
 /* tu calle */
 A(S(ta,60.3,60.8)*(1-S(ta,64.5,65)),()=>callout(hx,hy+20,hx+120,hy+110,'tu calle',C.green,60.3,ta,{size:28}))}

/* ===================== ESCENA 6 · la solución y el regreso a casa (70,2–95) ===================== */
function sc6(ta){
 /* a) ajuste previo al lanzamiento */
 const a6=fio(ta,70.3,79.5,.45);if(a6>0)A(a6,()=>{
  /* cohete en la rampa */
  const rx=800,ry=1010;ctx.save();ctx.translate(rx,ry);ctx.fillStyle=lin(-30,0,30,0,[[0,'#f2f5ff'],[1,'#8e9bc4']]);ctx.beginPath();ctx.moveTo(0,-130);ctx.quadraticCurveTo(46,-60,34,60);ctx.lineTo(-34,60);ctx.quadraticCurveTo(-46,-60,0,-130);ctx.fill();
  ctx.fillStyle=C.red;ctx.beginPath();ctx.moveTo(-34,60);ctx.lineTo(-70,100);ctx.lineTo(-30,40);ctx.fill();ctx.beginPath();ctx.moveTo(34,60);ctx.lineTo(70,100);ctx.lineTo(30,40);ctx.fill();ball(0,-40,16,C.cyan);ctx.restore();
  txt('antes del lanzamiento',rx-60,ry+130,28,C.dim,{w:700,a:'center',maxW:380});
  /* panel del reloj */
  glass(100,360,760,380,{r:40});txt('FRECUENCIA DEL RELOJ',480,410,28,C.dim,{w:800,ls:3});
  const p=S(ta,76.7,78.4);const base='10,23000000000';const fin='10,22999999543';let s='';
  for(let i=0;i<base.length;i++){const ch=fin[i],bc=base[i];const flip=p>(i/base.length)?ch:bc;s+=flip}
  txt(s+' MHz',480,520,58,C.cyan,{w:900,maxW:720});
  /* perilla */
  const knob=(ta<72.1?0:spring(prog(ta,72.2,73.8),6,.6))*.06+(ta>76.6?-.28*S(ta,76.6,78.4):0)-.0;
  ctx.save();ctx.translate(250,650);ctx.rotate(knob*6.283);ball(0,0,64,'#c7d1ee');ctx.strokeStyle='#33406e';ctx.lineWidth=8;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-50);ctx.stroke();ctx.restore();
  txt('ajuste',250,740,26,C.dim,{w:700,small:0});
  const m=S(ta,76.6,77.3);A(m,()=>{glass(420,610,420,100,{r:30,line:rgba(C.amber,.8)});txt('−0,0046 Hz',630,648,48,C.amber,{w:900});txt('menos de 5 milésimas',630,688,26,C.dim,{w:700})})});
 /* b) en la Tierra va mal / en el espacio va perfecto */
 const b6=fio(ta,79.6,85.2,.4);if(b6>0)A(b6,()=>{
  glass(80,360,380,640,{r:40});glass(500,360,380,640,{r:40});
  txt('EN LA TIERRA',270,410,32,C.red,{w:900});txt('EN EL ESPACIO',690,410,32,C.green,{w:900});
  const sec=(ta-79.6)*6.283/60*60;
  clock(270,600,110,sec*.93,{col:C.red,glow:12,ghost:sec,hand:C.red});clock(690,600,110,sec,{col:C.green,glow:12,ghost:sec,hand:C.green});
  const x1=S(ta,80.4,80.95);if(x1>0)crossM(270,840,120,C.red,prog(ta,80.4,81.0),18);
  A(S(ta,81.3,81.8),()=>{txt('a propósito',270,935,32,C.amber,{w:900})});
  const ok=prog(ta,83.5,84.2);if(ok>0)checkM(690,850,130,C.green,ok,20);A(S(ta,82.6,83.2),()=>{txt('en hora',690,935,32,C.green,{w:900})})});
 /* c) cada vez que abres un mapa */
 const c6=fio(ta,85.1,91.5,.45);if(c6>0)A(c6,()=>{
  const px0=540,py0=720,pw=430,ph=770;phoneBody(px0,py0,pw,ph);const sx=px0-pw/2+18,sy=py0-ph/2+20,sw=pw-36,sh=ph-40;
  mapView(sx,sy,sw,sh,447,500,1,42,()=>{house(535,655,1.1,0);gpsDot(450,610,17,ta)});
  const t1=S(ta,86.6,87.3);A(t1,()=>{glass(40,380,340,150,{r:30,line:rgba(C.red,.8)});txt('1905',210,418,40,C.red,{w:900});txt('relatividad especial',210,462,24,C.white,{w:800,maxW:276});txt('−7 µs/día',210,502,34,C.red,{w:900})});
  const t2=S(ta,87.6,88.3);A(t2,()=>{glass(600,900,360,150,{r:30,line:rgba(C.green,.8)});txt('1915',780,938,40,C.green,{w:900});txt('relatividad general',780,980,24,C.white,{w:800,maxW:326});txt('+45 µs/día',780,1020,34,C.green,{w:900})});
  A(S(ta,88.98,89.5),()=>{glass(160,1105,520,62,{r:31,line:rgba(C.violet,.7)});txt('Einstein: GPS = relatividad',420,1137,30,C.violet,{w:900,maxW:480})})});
 /* d) te guía a casa */
 const d6=S(ta,91.3,91.8)*(1-S(ta,93.1,93.7));if(d6>0)A(d6,()=>{
  const px0=540,py0=700,pw=440,ph=780;phoneBody(px0,py0,pw,ph);const sx=px0-pw/2+18,sy=py0-ph/2+20,sw=pw-36,sh=ph-40;
  const p=ease(prog(ta,91.6,92.9));
  mapView(sx,sy,sw,sh,447,640,1,42,()=>{const x=450,y=lerp(500,660,p);
   ctx.save();ctx.strokeStyle=rgba(BLUE,.75);ctx.lineWidth=12;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(450,500);ctx.lineTo(x,y);ctx.stroke();ctx.restore();
   house(535,655,1.15,S(ta,92.8,93.3));gpsDot(x,y,17,ta);if(p>.98)burst(450,660,14,92.85,ta,C.amber,{v:90,r:6,seed:3})})})}

/* ---------- títulos, transiciones y escenas ---------- */
const TITLES=[
 [6.3,10.6,'EL GPS MIDE TIEMPO',C.cyan],
 [10.95,25.5,'UN SATÉLITE, UN RELOJ',C.amber],
 [26.0,44.8,'EL PROBLEMA: RELATIVIDAD',C.red],
 [45.2,60.1,'EL BALANCE DEL TIEMPO',C.green],
 [60.4,70.0,'11 KM DE ERROR AL DÍA',C.magenta],
 [70.4,91.0,'LA SOLUCIÓN: AJUSTAR EL RELOJ',C.cyan]];
const TRANS=[[10.8,'whip'],[25.8,'zoom'],[45.0,'flash'],[60.2,'glitch'],[70.2,'whip']];
const SCENES=[[0,10.8,sc1,.5],[10.8,25.8,sc2,.6],[25.8,45.0,sc3,.6],[45.0,60.2,sc4,.6],[60.2,70.2,sc5,.6],[70.2,95.5,sc6,.6]];
