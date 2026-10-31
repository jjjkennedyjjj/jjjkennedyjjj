/* ===== ESTILO PLANO TÉCNICO (blueprint) — se añade AL FINAL de video.js =====
   Fondo azul de plano con cuadrícula y cajetín, todo en trazo fino blanco, sin rellenos, textos claros. */
BLOOM=.12;GRAIN=.03;VIG=.45;CLOSE_BG='#0a3a8e';
function _pc(c){if(typeof c!=='string')return null;let m=c.match(/^#([0-9a-f]{6})$/i);if(m){const h=m[1];return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),1]}
 m=c.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);return m?[+m[1],+m[2],+m[3],m[4]==null?1:+m[4]]:null}
const _lum=a=>(.2126*a[0]+.7152*a[1]+.0722*a[2])/255;
function lin(x1,y1,x2,y2,stops){const g=ctx.createLinearGradient(x1,y1,x2,y2);stops.forEach(([p,c])=>g.addColorStop(p,c));g._c=stops.length===2?stops[0][1]:stops[1][1];return g}
function rad(x,y,r0,r1,stops){const g=ctx.createRadialGradient(x,y,r0,x,y,r1);stops.forEach(([p,c])=>g.addColorStop(p,c));g._c=stops.length===2?stops[0][1]:stops[1][1];return g}
(function(){const P=CanvasRenderingContext2D.prototype,F=P.fill,S=P.stroke,FT=P.fillText;
 P.fill=function(...a){const fs=this.fillStyle;const c=_pc(typeof fs==='string'?fs:(fs&&fs._c)||'');
  this.save();this.globalAlpha*=.09;this.fillStyle='#ffffff';F.apply(this,a);this.restore();
  if(c&&c[3]>.25){const col=_lum(c)<.3?'#a9c1ff':mix('#'+c.slice(0,3).map(v=>Math.round(v).toString(16).padStart(2,'0')).join(''),'#ffffff',.5);this.save();this.strokeStyle=col;this.lineWidth=2.4;this.lineJoin='round';S.call(this);this.restore()}};
 P.fillText=function(s,x,y,m){const c=_pc(typeof this.fillStyle==='string'?this.fillStyle:'');if(c&&_lum(c)<.3){this.save();this.fillStyle='#ffffff';FT.call(this,s,x,y);this.restore()}else FT.call(this,s,x,y)}})();
function mapTex(){return asset('mapP',()=>bake(900,1000,g=>{g.fillStyle='#0a3380';g.fillRect(0,0,900,1000);
 const xs=[0,150,450,750,900],ys=[0,200,500,800,1000];g.strokeStyle='rgba(235,245,255,.85)';g.lineWidth=2.5;
 for(let i=0;i<4;i++)for(let j=0;j<4;j++){const x0=xs[i]+(i?14:-20),x1=xs[i+1]-(i<3?14:-20),y0=ys[j]+(j?(j===2?20:14):-20),y1=ys[j+1]-(j<3?(j===1?20:14):-20);
  rr(x0,y0,x1-x0,y1-y0,6);g.stroke();g.save();rr(x0,y0,x1-x0,y1-y0,6);g.clip();g.strokeStyle='rgba(235,245,255,.16)';g.lineWidth=2;for(let k=-1000;k<1000;k+=18){g.beginPath();g.moveTo(x0+k,y1);g.lineTo(x0+k+(y1-y0),y0);g.stroke()}g.restore();g.strokeStyle='rgba(235,245,255,.85)'}
 g.strokeStyle='#ffd166';g.lineWidth=3;g.setLineDash([22,14]);g.beginPath();g.moveTo(0,500);g.lineTo(900,500);g.stroke();g.setLineDash([])}))}
function _bpBG(){return asset('bgP',()=>bake(W,H,g=>{g.fillStyle=lin(0,0,0,H,[[0,'#0d47a8'],[1,'#0a3a8e']]);g.fillRect(0,0,W,H);
 for(let x=0;x<=W;x+=30){g.strokeStyle=x%150?'rgba(255,255,255,.07)':'rgba(255,255,255,.18)';g.lineWidth=x%150?1:2;g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke()}
 for(let y=0;y<=H;y+=30){g.strokeStyle=y%150?'rgba(255,255,255,.07)':'rgba(255,255,255,.18)';g.lineWidth=y%150?1:2;g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}
 g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=3;g.strokeRect(36,36,W-72,H-72);g.lineWidth=1.5;g.strokeRect(50,50,W-100,H-100);
 g.lineWidth=2.5;g.strokeRect(420,1580,580,230);g.beginPath();g.moveTo(420,1660);g.lineTo(1000,1660);g.moveTo(420,1735);g.lineTo(1000,1735);g.moveTo(690,1735);g.lineTo(690,1810);g.stroke();
 g.fillStyle='#e8f1ff';g.textBaseline='middle';g.textAlign='left';g.font='900 38px Montserrat,sans-serif';g.fillText('SABIDURÍA 72',440,1620);
 g.font='800 24px Montserrat,sans-serif';g.fillText('PLANO N.º 06 · GPS Y RELATIVIDAD',440,1698);g.fillText('ESCALA 1:1',440,1772);g.fillText('REV. A',710,1772);g.fillText('HOJA 1/1',830,1772)}))}
BGF=ta=>ctx.drawImage(_bpBG(),0,0);

/* La Tierra como esfera de plano: círculo, meridianos, paralelos y contornos de continentes, sin relleno */
function earth(x,y,r){const g=ctx;g.save();g.fillStyle='rgba(12,63,148,.96)';g.beginPath();g.arc(x,y,r,0,7);F0(g);g.strokeStyle='rgba(235,245,255,.9)';g.lineWidth=3.5;g.beginPath();g.arc(x,y,r,0,7);g.stroke();
 g.beginPath();g.arc(x,y,r,0,7);g.clip();g.strokeStyle='rgba(235,245,255,.32)';g.lineWidth=2;
 for(let k=-2;k<=2;k++){g.beginPath();g.ellipse(x,y,Math.abs(k)*r/3+.01,r,0,0,7);g.stroke()}
 for(let k=-3;k<=3;k++){const yy=y+k*r/4,rx=Math.sqrt(Math.max(0,r*r-(k*r/4)*(k*r/4)));g.beginPath();g.ellipse(x,yy,rx,r*.08,0,0,7);g.stroke()}
 g.strokeStyle='rgba(255,209,102,.8)';g.lineWidth=3;for(let k=0;k<5;k++){const a=rnd(k*2.1)*6.283,d=rnd(k*3.7+1)*r*.6;blob(g,x+Math.cos(a)*d,y+Math.sin(a)*d*.9,r*(.14+rnd(k)*.14),k*5+1);g.stroke()}g.restore()}
function F0(g){CanvasRenderingContext2D.prototype.fill.call(g)}
