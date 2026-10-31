/* ===== ESTILO NEÓN (variante del motor) — se añade AL FINAL de video.js =====
   Todo lo que se rellena pasa a ser un interior oscuro y translúcido con contorno que brilla,
   el mapa es una rejilla neón y el fondo es negro con rejilla tenue. Bloom alto. */
function lin(x1,y1,x2,y2,stops){const g=ctx.createLinearGradient(x1,y1,x2,y2);stops.forEach(([p,c])=>g.addColorStop(p,c));g._c=stops.length===2?stops[0][1]:stops[1][1];return g}
function rad(x,y,r0,r1,stops){const g=ctx.createRadialGradient(x,y,r0,x,y,r1);stops.forEach(([p,c])=>g.addColorStop(p,c));g._c=stops.length===2?stops[0][1]:stops[1][1];return g}
(function(){const F=CanvasRenderingContext2D.prototype.fill;
 CanvasRenderingContext2D.prototype.fill=function(...a){const fs=this.fillStyle;const col=typeof fs==='string'?fs:(fs&&fs._c)||null;
  this.save();this.globalAlpha*=.32;F.apply(this,a);this.restore();
  if(col&&!/^rgba\(\s*[0-9]+,\s*[0-9]+,\s*[0-9]+,\s*0?\.[0-4]/.test(col)){this.save();this.strokeStyle=col;this.lineWidth=3.5;this.shadowColor=col;this.shadowBlur=16;this.lineJoin='round';this.stroke();this.restore()}}})();
function mapTex(){return asset('mapN',()=>bake(900,1000,g=>{
 g.fillStyle='#04060f';g.fillRect(0,0,900,1000);
 const xs=[0,150,450,750,900],ys=[0,200,500,800,1000];
 for(let i=0;i<4;i++)for(let j=0;j<4;j++){const x0=xs[i]+(i?16:-20),x1=xs[i+1]-(i<3?16:-20),y0=ys[j]+(j?(j===2?22:16):-20),y1=ys[j+1]-(j<3?(j===1?22:16):-20);
  const park=(i===2&&j===0);g.strokeStyle=park?'rgba(77,255,166,.75)':'rgba(95,227,255,.28)';g.lineWidth=park?3:2;rr(x0,y0,x1-x0,y1-y0,14);g.stroke();
  if(!park)for(let k=0;k<5;k++){const bw=26+rnd(i*9+j*5+k)*34,bh=22+rnd(i*7+j*3+k*2)*30;g.strokeStyle='rgba(255,95,162,.22)';g.lineWidth=2;g.strokeRect(x0+14+rnd(i*5+j*11+k*4)*(x1-x0-bw-28),y0+14+rnd(i*3+j*13+k*6)*(y1-y0-bh-28),bw,bh)}}
 g.save();g.shadowBlur=18;g.lineWidth=6;g.strokeStyle='#35e0ff';g.shadowColor='#35e0ff';[150,450,750].forEach(x=>{g.beginPath();g.moveTo(x,0);g.lineTo(x,1000);g.stroke()});[200,800].forEach(y=>{g.beginPath();g.moveTo(0,y);g.lineTo(900,y);g.stroke()});
 g.strokeStyle='#ffc857';g.shadowColor='#ffc857';g.lineWidth=8;g.beginPath();g.moveTo(0,500);g.lineTo(900,500);g.stroke();g.restore()}))}
function _neonBG(){return asset('bgN',()=>bake(W,H,g=>{g.fillStyle=lin(0,0,0,H,[[0,'#04060f'],[.5,'#070b1c'],[1,'#03050b']]);g.fillRect(0,0,W,H);
 g.strokeStyle='rgba(95,227,255,.10)';g.lineWidth=2;for(let x=0;x<=W;x+=90){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke()}for(let y=0;y<=H;y+=90){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}
 g.fillStyle=rad(540,800,0,900,[[0,'rgba(95,60,200,.18)'],[1,'rgba(95,60,200,0)']]);g.fillRect(0,0,W,H)}))}
BGF=ta=>ctx.drawImage(_neonBG(),0,0);
