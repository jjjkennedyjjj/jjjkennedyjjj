/* ===== ESTILO CÓMIC — se añade AL FINAL de video.js =====
   Fondo azul pop con puntos de trama, contornos negros gruesos, colores planos, rótulos con borde negro,
   subtítulos en cajas amarillas con sombra dura, marco de viñeta. Sin brillos. */
BLOOM=0;GRAIN=0;VIG=0;
const INK='#0d0d12',YEL='#ffe14d';
function _pc(c){if(typeof c!=='string')return null;let m=c.match(/^#([0-9a-f]{6})$/i);if(m){const h=m[1];return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),1]}
 m=c.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);return m?[+m[1],+m[2],+m[3],m[4]==null?1:+m[4]]:null}
const _lum=a=>(.2126*a[0]+.7152*a[1]+.0722*a[2])/255;
const _hex=c=>'#'+c.slice(0,3).map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
function lin(x1,y1,x2,y2,stops){const g=ctx.createLinearGradient(x1,y1,x2,y2);stops.forEach(([p,c])=>g.addColorStop(p,c));g._c=stops.length===2?stops[0][1]:stops[1][1];return g}
function rad(x,y,r0,r1,stops){const g=ctx.createRadialGradient(x,y,r0,x,y,r1);stops.forEach(([p,c])=>g.addColorStop(p,c));g._c=stops.length===2?stops[0][1]:stops[1][1];return g}
function glow(){}
Object.defineProperty(CanvasRenderingContext2D.prototype,'shadowBlur',{configurable:true,get(){return 0},set(v){}});
(function(){const P=CanvasRenderingContext2D.prototype,F=P.fill,S=P.stroke,FT=P.fillText;
 P.fill=function(...a){const fs=this.fillStyle;const c=_pc(typeof fs==='string'?fs:(fs&&fs._c)||'');if(!c||c[3]<=.15)return F.apply(this,a);
  const dk=_lum(c)<.3;this.save();
  if(dk&&c[3]<.4){this.fillStyle='rgba(0,0,30,.22)';F.apply(this,a);this.restore();return}
  this.fillStyle=dk?'#141f55':_hex(c);if(!dk)this.globalAlpha*=Math.min(1,c[3]*1.3);F.apply(this,a);this.restore();
  this.save();this.strokeStyle=INK;this.lineWidth=7;this.lineJoin='round';S.call(this);this.restore()};
 P.fillText=function(s,x,y,m){const mm=/(\d+(?:\.\d+)?)px/.exec(this.font);const sz=mm?+mm[1]:30;
  const _fc=_pc(typeof this.fillStyle==='string'?this.fillStyle:'');if(sz>=26&&!this.__ns&&!(_fc&&_lum(_fc)<.3)){this.save();this.strokeStyle=INK;this.lineWidth=Math.max(5,sz*.17);this.lineJoin='round';this.strokeText(s,x,y);this.restore()}FT.call(this,s,x,y)}})();
function mapTex(){return asset('mapC',()=>bake(900,1000,g=>{g.fillStyle='#fff6d6';g.fillRect(0,0,900,1000);
 const xs=[0,150,450,750,900],ys=[0,200,500,800,1000],cols=['#8fd3ff','#ffd37a','#ff9ec4','#b9a8ff'];
 for(let i=0;i<4;i++)for(let j=0;j<4;j++){const x0=xs[i]+(i?16:-20),x1=xs[i+1]-(i<3?16:-20),y0=ys[j]+(j?(j===2?22:16):-20),y1=ys[j+1]-(j<3?(j===1?22:16):-20);
  const park=(i===2&&j===0);g.fillStyle=park?'#6fdc8c':cols[(i*2+j)%4];rr(x0,y0,x1-x0,y1-y0,12);g.fill();g.strokeStyle=INK;g.lineWidth=5;g.stroke()}
 g.strokeStyle='#ff3b30';g.lineWidth=8;g.setLineDash([24,16]);g.beginPath();g.moveTo(0,500);g.lineTo(900,500);g.stroke();g.setLineDash([])}))}
function _bgC(){return asset('bgC',()=>bake(W,H,g=>{g.fillStyle=lin(0,0,0,H,[[0,'#3a78ff'],[1,'#2152d9']]);g.fillRect(0,0,W,H);
 for(let y=0;y<H;y+=34)for(let x=((y/34)%2)*17;x<W;x+=34){const t=Math.pow(y/H,1.2);const r=1+t*10*(.4+.6*Math.abs(Math.sin(x*.004)));g.fillStyle='rgba(15,40,150,.55)';g.beginPath();g.arc(x,y,r,0,7);g.fill()}}))}
BGF=ta=>ctx.drawImage(_bgC(),0,0);
function post(fi){const g=X;g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.globalAlpha=1;g.drawImage(fb,0,0);
 g.strokeStyle=INK;g.lineWidth=28;g.strokeRect(14,14,W-28,H-28);g.strokeStyle='#ffffff';g.lineWidth=6;g.strokeRect(34,34,W-68,H-68)}
function drawSubs(ta){if(typeof SUBS==='undefined')return;const skip=GANCHO?GANCHO.n:0;
 for(let k=skip;k<SUBS.length;k++){const s=SUBS[k];const ini=s[0],fin=s[1];if(ta<ini-.12||ta>fin+.2)continue;{const nx=SUBS[k+1];if(nx&&nx[0]-fin<.4&&ta>=nx[0]-.1)continue}const a=ease(prog(ta,ini-.12,ini+.06))*(1-ease(prog(ta,fin+.01,fin+.2)));if(a<=0)continue;
  const g=ctx;g.save();g.__ns=1;const size=40,maxW=720;g.font=`800 ${size}px Montserrat,system-ui,sans-serif`;const sp=g.measureText(' ').width;
  const raw=s[2].split(' ');const words=raw.map((w,i)=>{const key=/^\*.*\*[.,;:!?…]*$/.test(w);const clean=w.replace(/\*/g,'').replace(/~/g,' ');return{s:clean,key,w:g.measureText(clean).width,t:s[3][i]}});
  const lines=[];let cur=[],cw=0;words.forEach(w=>{if(cur.length&&cw+sp+w.w>maxW){lines.push(cur);cur=[];cw=0}cur.push(w);cw+=(cur.length>1?sp:0)+w.w});if(cur.length)lines.push(cur);
  const lh=54,h=lines.length*lh+34,bw=Math.max(...lines.map(l=>l.reduce((q,w)=>q+w.w,0)+sp*(l.length-1)))+56,bx=XT-bw/2,by=1240-h/2;
  g.globalAlpha=a;g.fillStyle=INK;g.fillRect(bx+10,by+10,bw,h);g.fillStyle=YEL;g.fillRect(bx,by,bw,h);g.strokeStyle=INK;g.lineWidth=5;g.strokeRect(bx,by,bw,h);
  g.textBaseline='middle';g.textAlign='left';
  lines.forEach((ln,i)=>{const lw=ln.reduce((q,w)=>q+w.w,0)+sp*(ln.length-1);let x=XT-lw/2;const y=by+17+lh*(i+.5);ln.forEach(w=>{const lit=ta>=w.t-.02;g.globalAlpha=a*(lit?1:.42);g.fillStyle=w.key?'#d6001c':INK;g.fillText(w.s,x,y);x+=w.w+sp})});g.__ns=0;g.restore()}}
function drawGancho(ta,tv){if(!GANCHO)return;const tEnd=SUBS[GANCHO.n-1][1];const fo=GANCHO.fin==null?tEnd+.35:GANCHO.fin;const a=1-ease(prog(ta,fo,fo+.5));if(a<=0)return;
 const L=ganchoLayout(),lh=L.size*1.18,n=L.lines.length,y0=GANCHO.y-(n-1)*lh/2;const g=ctx;g.save();g.globalAlpha=a;
 g.beginPath();const cx=XT,cy=GANCHO.y,R1=470,R2=360,N=26,gs=.9+.1*ease(prog(ta,-.3,.3));for(let i=0;i<N*2;i++){const an=i/(N*2)*6.283,r=(i%2?R2:R1)*(1+.06*Math.sin(i*3.1))*gs;const px=cx+Math.cos(an)*r*1.0,py=cy+Math.sin(an)*r*1.12;i?g.lineTo(px,py):g.moveTo(px,py)}g.closePath();
 g.fillStyle='#ff3b6b';g.fill();g.fillStyle='rgba(255,225,77,.0)';
 g.font=`900 ${L.size}px Montserrat,system-ui,sans-serif`;g.textBaseline='middle';g.textAlign='left';
 L.lines.forEach((ln,i)=>{let x=XT-ln.W/2;const y=y0+i*lh;ln.forEach(w=>{const lit=ta>=w.t;const pp=prog(ta,w.t,w.t+.22);const pop=lit?1+.09*Math.sin(Math.PI*clamp(pp)):1;
  g.save();g.translate(x+w.w/2,y);g.scale(pop,pop);g.textAlign='center';g.globalAlpha=a*(lit?1:.35);g.lineJoin='round';g.lineWidth=16;g.strokeStyle=INK;g.strokeText(w.s,0,0);g.fillStyle=w.key?YEL:'#ffffff';g.fillText(w.s,0,0);g.restore();x+=w.w+L.sp})});g.restore()}
