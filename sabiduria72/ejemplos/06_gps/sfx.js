/* Efectos sintetizados (Web Audio) · van en pares acción + consecuencia · volumen ≈0,5 */
const SFX={
 WHOOSH:()=>{noise(.7,.5,300,3200,0,'bandpass');tone(300,.6,'sawtooth',.14,900)},
 SNAP:()=>{tone(700,.12,'square',.2,1500);tone(1500,.18,'sine',.3,2400,.05)},
 NO:()=>{tone(180,.28,'sawtooth',.28,110);tone(150,.28,'sawtooth',.25,90,.18)},
 TICK:()=>{tone(1500,.05,'square',.2);tone(1100,.05,'square',.16,null,.32);tone(1500,.05,'square',.2,null,.64)},
 PING:()=>{tone(1320,.7,'sine',.34);tone(1976,.5,'sine',.16,null,.04)},
 ZAP:()=>{noise(.35,.4,6000,900,0,'highpass');tone(2400,.35,'sawtooth',.14,300)},
 ATOM:()=>{[523,659,784,988,1319].forEach((f,i)=>tone(f,.28,'triangle',.22,null,i*.07))},
 RISE:()=>{tone(150,1.1,'sawtooth',.22,900);noise(1.1,.22,400,4500,0,'bandpass')},
 WARN:()=>{tone(220,.3,'square',.26,200);tone(220,.3,'square',.26,200,.4)},
 GAUGE:()=>{for(let i=0;i<9;i++)tone(900+i*70,.05,'square',.14,null,i*.11)},
 SLOW:()=>{tone(700,1.2,'sine',.3,160);noise(.5,.12,800,200,0,'lowpass')},
 FAST:()=>{tone(220,1.0,'sine',.3,1100);tone(330,1.0,'triangle',.14,1650)},
 THUD:()=>{tone(130,.45,'sine',.8,50);noise(.18,.45,600,120,0,'lowpass')},
 CALC:()=>{for(let i=0;i<7;i++)tone(1100,.05,'square',.14,null,i*.13);tone(1760,.5,'sine',.3,null,.95)},
 JUMP:()=>{tone(300,.28,'sine',.5,1200);tone(1500,.1,'triangle',.18,null,.22)},
 ALERT:()=>{for(let i=0;i<3;i++)tone(1250,.12,'square',.22,null,i*.2)},
 OK:()=>{tone(880,.22,'sine',.34);tone(1318,.5,'sine',.34,null,.16)},
 ARRIVE:()=>{tone(523,.7,'sine',.28);tone(659,.7,'sine',.24,null,.1);tone(784,.9,'sine',.24,null,.2)},
 LOGO:()=>{tone(110,1.6,'sine',.5);tone(220,1.4,'triangle',.22);tone(880,1.2,'sine',.2,null,.25);tone(1320,1.1,'sine',.14,null,.45)}
};
const CUES=[[2.65,'WHOOSH'],[5.75,'SNAP'],[8.05,'NO'],[9.45,'TICK'],[12.9,'PING'],[15.9,'ZAP'],[19.8,'ATOM'],[22.0,'RISE'],
 [26.1,'WARN'],[30.5,'GAUGE'],[36.9,'SLOW'],[41.0,'FAST'],[45.1,'THUD'],[51.4,'CALC'],[60.9,'JUMP'],[68.3,'ALERT'],
 [80.5,'NO'],[83.7,'OK'],[92.8,'ARRIVE'],[94.5,'LOGO']];
