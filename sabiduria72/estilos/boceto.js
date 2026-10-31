/* ===== ESTILO BOCETO A MANO — se añade AL FINAL de video.js =====
   Papel de cuaderno cuadriculado, trazo de tinta que tiembla (filtro de desplazamiento que «hierve» cada 3 fotogramas),
   colores de rotulador con rayado en lugar de relleno liso. Sin brillos. */
BLOOM=0;GRAIN=.05;VIG=.22;
const INK='#1b2340';
function _pc(c){if(typeof c!=='string')return null;let m=c.match(/^#([0-9a-f]{6})$/i);if(m){const h=m[1];return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),1]}
 m=c.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);return m?[+m[1],+m[2],+m[3],m[4]==null?1:+m[4]]:null}
const _lum=a=>(.2126*a[0]+.7152*a[1]+.0722*a[2])/255;
const _hex=c=>'#'+c.slice(0,3).map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
function lin(x1,y1,x2,y2,stops){const g=ctx.createLinearGradient(x1,y1,x2,y2);stops.forEach(([p,c])=>g.addColorStop(p,c));g._c=stops.length===2?stops[0][1]:stops[1][1];return g}
function rad(x,y,r0,r1,stops){const g=ctx.createRadialGradient(x,y,r0,x,y,r1);stops.forEach(([p,c])=>g.addColorStop(p,c));g._c=stops.length===2?stops[0][1]:stops[1][1];return g}
function glow(){}
Object.defineProperty(CanvasRenderingContext2D.prototype,'shadowBlur',{configurable:true,get(){return 0},set(v){}});
const _hp={};
function _hatch(col){return _hp[col]||(_hp[col]=(()=>{const c=mk(16,16),g=c.getContext('2d');g.strokeStyle=col;g.lineWidth=2.2;g.beginPath();g.moveTo(-2,18);g.lineTo(18,-2);g.moveTo(-2,10);g.lineTo(10,-2);g.moveTo(6,18);g.lineTo(18,6);g.stroke();return X.createPattern(c,'repeat')})())}
(function(){const P=CanvasRenderingContext2D.prototype,F=P.fill,S=P.stroke,FT=P.fillText;
 P.fill=function(...a){const fs=this.fillStyle;const c=_pc(typeof fs==='string'?fs:(fs&&fs._c)||'');if(!c||c[3]<=.15){return F.apply(this,a)}
  const dk=_lum(c)<.3;this.save();
  if(dk){if(c[3]>=.4){this.fillStyle='rgba(250,245,228,.9)'}else{this.fillStyle='rgba(60,70,100,.10)'}F.apply(this,a)}
  else{const hx=_hex(c);this.globalAlpha*=Math.min(1,c[3]*1.2);this.fillStyle=rgba(hx,.30);F.apply(this,a);this.fillStyle=_hatch(rgba(mix(hx,'#000000',.15),.75));F.apply(this,a)}
  this.restore();
  if(!(dk&&c[3]<.4)){this.save();this.strokeStyle=INK;this.lineWidth=3.2;this.lineJoin='round';S.call(this);this.restore()}};
 P.stroke=function(...a){const ss=this.strokeStyle;const c=_pc(typeof ss==='string'?ss:'');if(c&&c[3]>.2){const l=_lum(c);if(l>.72){this.save();this.strokeStyle=INK;S.apply(this,a);this.restore();return}else if(l>.4){this.save();this.strokeStyle=mix(_hex(c),'#000000',.3);S.apply(this,a);this.restore();return}}S.apply(this,a)};
 P.fillText=function(s,x,y,m){const c=_pc(typeof this.fillStyle==='string'?this.fillStyle:'');if(c){const l=_lum(c);if(l>.8){this.save();this.fillStyle=INK;FT.call(this,s,x,y);this.restore();return}if(l>.45){this.save();this.fillStyle=mix(_hex(c),'#000000',.38);FT.call(this,s,x,y);this.restore();return}}FT.call(this,s,x,y)}})();
function mapTex(){return asset('mapS',()=>bake(900,1000,g=>{g.fillStyle='#f6efdb';g.fillRect(0,0,900,1000);
 const xs=[0,150,450,750,900],ys=[0,200,500,800,1000];
 for(let i=0;i<4;i++)for(let j=0;j<4;j++){const x0=xs[i]+(i?14:-20),x1=xs[i+1]-(i<3?14:-20),y0=ys[j]+(j?(j===2?20:14):-20),y1=ys[j+1]-(j<3?(j===1?20:14):-20);
  const park=(i===2&&j===0);g.fillStyle=park?'rgba(77,200,130,.35)':'rgba(120,150,210,.16)';rr(x0,y0,x1-x0,y1-y0,10);g.fill();g.strokeStyle=INK;g.lineWidth=3;rr(x0,y0,x1-x0,y1-y0,10);g.stroke();
  if(park){g.save();rr(x0,y0,x1-x0,y1-y0,10);g.clip();g.strokeStyle='rgba(40,150,90,.6)';g.lineWidth=2;for(let k=-300;k<300;k+=14){g.beginPath();g.moveTo(x0+k,y1);g.lineTo(x0+k+(y1-y0),y0);g.stroke()}g.restore()}}
 g.strokeStyle='#d98a00';g.lineWidth=4;g.setLineDash([20,14]);g.beginPath();g.moveTo(0,500);g.lineTo(900,500);g.stroke();g.setLineDash([])}))}
function _paper(){return asset('paper',()=>bake(W,H,g=>{g.fillStyle='#f3ebd6';g.fillRect(0,0,W,H);
 for(let i=0;i<60;i++){g.fillStyle=`rgba(150,120,70,${.015+rnd(i*3)*.03})`;g.beginPath();g.arc(rnd(i*1.3)*W,rnd(i*2.9)*H,60+rnd(i*5)*140,0,7);g.fill()}
 g.strokeStyle='rgba(90,130,210,.28)';g.lineWidth=2;for(let x=0;x<=W;x+=54){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke()}for(let y=0;y<=H;y+=54){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}
 g.strokeStyle='rgba(230,80,80,.45)';g.lineWidth=3;g.beginPath();g.moveTo(54,0);g.lineTo(54,H);g.stroke();
 g.fillStyle='rgba(60,60,80,.35)';for(let i=0;i<5;i++){g.beginPath();g.arc(26,260+i*420,12,0,7);g.fill()}}))}
BGF=ta=>ctx.clearRect(0,0,W,H);
document.body.insertAdjacentHTML('beforeend','<svg width="0" height="0" style="position:absolute"><filter id="wob" x="0" y="0" width="100%" height="100%"><feTurbulence id="wobT" type="fractalNoise" baseFrequency=".014" numOctaves="2" seed="1"/><feDisplacementMap in="SourceGraphic" scale="10"/></filter></svg>');
function post(fi){const g=X;g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;g.filter='none';g.drawImage(_paper(),0,0);
 const wt=document.getElementById('wobT');if(wt)wt.setAttribute('seed',String(1+Math.floor(fi/3)%6));
 g.filter='url(#wob)';g.drawImage(fb,0,0);g.filter='none';
 if(VIG>0){g.globalAlpha=VIG;g.drawImage(vigTex(),0,0);g.globalAlpha=1}
 if(GRAIN>0){g.save();g.globalAlpha=GRAIN;g.globalCompositeOperation='multiply';const ox=Math.floor(rnd(fi*1.3)*256),oy=Math.floor(rnd(fi*2.7)*256);g.translate(-ox,-oy);g.fillStyle=g.createPattern(grainTex(),'repeat');g.fillRect(ox,oy,W,H);g.restore()}}
function drawGancho(ta,tv){if(!GANCHO)return;const tEnd=SUBS[GANCHO.n-1][1];const fo=GANCHO.fin==null?tEnd+.35:GANCHO.fin;const a=1-ease(prog(ta,fo,fo+.5));if(a<=0)return;
 const L=ganchoLayout(),lh=L.size*1.18,n=L.lines.length,y0=GANCHO.y-(n-1)*lh/2;const g=ctx;g.save();
 g.globalAlpha=a;g.fillStyle=lin(0,y0-lh,0,y0+n*lh,[[0,'rgba(250,245,228,0)'],[.18,'rgba(250,245,228,.8)'],[.82,'rgba(250,245,228,.8)'],[1,'rgba(250,245,228,0)']]);g.fillRect(0,y0-lh*.9,W,(n+.8)*lh);
 g.font=`900 ${L.size}px Montserrat,system-ui,sans-serif`;g.textBaseline='middle';g.textAlign='left';
 L.lines.forEach((ln,i)=>{let x=XT-ln.W/2;const y=y0+i*lh;ln.forEach(w=>{const lit=ta>=w.t;const pp=prog(ta,w.t,w.t+.22);const pop=lit?1+.09*Math.sin(Math.PI*clamp(pp)):1;
  g.save();g.translate(x+w.w/2,y);g.scale(pop,pop);g.textAlign='center';g.globalAlpha=a*(lit?1:.3);g.fillStyle=w.key?'#c26a00':INK;g.fillText(w.s,0,0);
  if(lit){g.strokeStyle=w.key?'#c26a00':INK;g.lineWidth=5;g.beginPath();g.moveTo(-w.w/2,L.size*.52);g.lineTo(w.w/2,L.size*.52+(i%2?4:-4));g.stroke()}g.restore();x+=w.w+L.sp})});g.restore()}
