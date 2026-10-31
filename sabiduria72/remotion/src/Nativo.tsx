import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';

/* ESTILO «NATIVO REMOTION»: la misma narración (45–75 s del vídeo 06), pero animada como motion graphics
   en React/SVG: formas planas sin brillo, muelles (spring), tipografía cinética y cifras grandes.
   Los tiempos están en segundos de AUDIO (t = 45 + fotograma/30). */
const FPS = 30, T0 = 45;
const C = {bg: '#0e1530', cyan: '#5fe3ff', amber: '#ffc857', magenta: '#ff5fa2', green: '#4dffa6', red: '#ff4d6d', violet: '#a78bfa', white: '#eef4ff', dim: '#8d9bc0'};
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const pr = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const ease = (x: number) => x * x * (3 - 2 * x);
const sp = (t: number, a: number, damping = 11, stiffness = 120) => spring({frame: Math.max(0, (t - a) * FPS), fps: FPS, config: {damping, stiffness, mass: 0.8}});
const fio = (t: number, a: number, b: number, f = 0.35) => ease(pr(t, a, a + f)) * (1 - ease(pr(t, b - f, b)));
const fmt = (v: number, d = 0) => {
  const [i, f] = Math.abs(v).toFixed(d).split('.');
  return (v < 0 ? '−' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (f ? ',' + f : '');
};
type Sub = [number, number, string, number[]];

const Word: React.FC<{s: string; x?: number; y?: number; size: number; color: string; delay: number; t: number; w?: number}> = ({s, size, color, delay, t, w = 900}) => {
  const p = sp(t, delay, 14, 160);
  return <span style={{display: 'inline-block', fontSize: size, fontWeight: w, color, transform: `translateY(${(1 - p) * 70}px)`, opacity: clamp(p * 1.4), margin: '0 .13em'}}>{s}</span>;
};
const Title: React.FC<{t: number; a: number; b: number; text: string; color: string}> = ({t, a, b, text, color}) => {
  if (t < a || t > b + 0.4) return null;
  const o = 1 - ease(pr(t, b, b + 0.35));
  return (
    <div style={{position: 'absolute', top: 150, left: 70, width: 820, textAlign: 'center', opacity: o, lineHeight: 1.05}}>
      {text.split(' ').map((w, i) => (
        <React.Fragment key={i}><Word s={w} size={64} color={color} delay={a + i * 0.09} t={t} />{' '}</React.Fragment>
      ))}
      <div style={{height: 8, width: 600 * ease(pr(t, a + 0.3, a + 0.9)), background: color, borderRadius: 4, margin: '14px auto 0'}} />
    </div>
  );
};
const Captions: React.FC<{t: number; subs: Sub[]}> = ({t, subs}) => {
  const s = subs.find((q) => t >= q[0] - 0.12 && t <= q[1] + 0.2);
  if (!s) return null;
  const o = ease(pr(t, s[0] - 0.12, s[0] + 0.06)) * (1 - ease(pr(t, s[1] + 0.01, s[1] + 0.2)));
  const words = s[2].split(' ');
  return (
    <div style={{position: 'absolute', left: 120, top: 1160, width: 720, minHeight: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: o}}>
      <div style={{background: 'rgba(5,9,22,.55)', borderRadius: 22, padding: '14px 28px', textAlign: 'center', fontSize: 40, fontWeight: 800, lineHeight: 1.35}}>
        {words.map((w, i) => {
          const key = /^\*.*\*[.,;:!?…]*$/.test(w);
          const lit = t >= s[3][i] - 0.02;
          return <span key={i} style={{color: key ? C.amber : C.white, opacity: lit ? 1 : 0.42}}>{w.replace(/\*/g, '').replace(/~/g, ' ')}{' '}</span>;
        })}
      </div>
    </div>
  );
};

/* ---- A · la balanza ---- */
const Balanza: React.FC<{t: number}> = ({t}) => {
  const a = fio(t, 44.8, 57.6, 0.4);
  if (a <= 0) return null;
  const tilt = 11 * sp(t, 45.8, 9, 90);
  const dropR = sp(t, 45.1, 9, 150), dropL = sp(t, 44.95, 12, 150);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: a}}>
      <polygon points="540,640 465,930 615,930" fill="#34407a" />
      <rect x={400} y={925} width={280} height={22} rx={11} fill="#34407a" />
      <g transform={`translate(540 640) rotate(${tilt})`}>
        <rect x={-360} y={-14} width={720} height={28} rx={14} fill="#dfe6ff" />
        <g transform={`translate(-330 0) rotate(${-tilt})`}>
          <g transform={`translate(0 ${-(1 - dropL) * 500})`}>
            <rect x={-80} y={-130} width={160} height={116} rx={22} fill={C.red} />
            <text x={0} y={-56} fontSize={48} fontWeight={900} fill="#06101f" textAnchor="middle">−7 µs</text>
          </g>
        </g>
        <g transform={`translate(330 0) rotate(${-tilt})`}>
          <g transform={`translate(0 ${-(1 - dropR) * 600})`}>
            <rect x={-120} y={-200} width={240} height={186} rx={26} fill={C.green} />
            <text x={0} y={-90} fontSize={58} fontWeight={900} fill="#06101f" textAnchor="middle">+45 µs</text>
          </g>
        </g>
      </g>
      <circle cx={540} cy={640} r={22} fill={C.amber} />
      <text x={210} y={850} fontSize={36} fontWeight={900} fill={C.red} textAnchor="middle" opacity={ease(pr(t, 45.2, 45.8))}>velocidad</text>
      <text x={870} y={850} fontSize={36} fontWeight={900} fill={C.green} textAnchor="middle" opacity={ease(pr(t, 47.2, 47.8))}>gravedad</text>
      <g transform={`translate(540 ${430 + (1 - sp(t, 48.2, 10, 160)) * 40}) scale(${sp(t, 48.2, 10, 160)})`} opacity={fio(t, 48.2, 50.2, 0.3)}>
        <rect x={-210} y={-34} width={420} height={68} rx={34} fill={C.violet} />
        <text x={0} y={12} fontSize={34} fontWeight={900} fill="#06101f" textAnchor="middle">gana la gravedad</text>
      </g>
    </svg>
  );
};
const Resultado: React.FC<{t: number}> = ({t}) => {
  const a = fio(t, 50.3, 57.5, 0.4);
  if (a <= 0) return null;
  const v = 38 * (1 - Math.pow(1 - pr(t, 51.4, 55.4), 3));
  const pop = sp(t, 50.4, 11, 150);
  return (
    <div style={{position: 'absolute', left: 60, top: 890, width: 840, textAlign: 'center', opacity: a, transform: `scale(${0.8 + 0.2 * pop})`}}>
      <div style={{fontSize: 150, fontWeight: 900, color: C.green, lineHeight: 1}}>+{fmt(v)} µs</div>
      <div style={{fontSize: 38, fontWeight: 800, color: C.dim, marginTop: 4}}>al día · el reloj del satélite se adelanta</div>
    </div>
  );
};
const Ecuacion: React.FC<{t: number}> = ({t}) => {
  const a = fio(t, 57.4, 60.25, 0.3);
  if (a <= 0) return null;
  const s1 = sp(t, 57.6, 12, 150), s2 = sp(t, 58.3, 12, 150), s3 = sp(t, 59.2, 9, 130);
  const km = 11.4 * (1 - Math.pow(1 - pr(t, 59.2, 60.1), 3));
  return (
    <div style={{position: 'absolute', left: 60, top: 880, width: 840, textAlign: 'center', opacity: a}}>
      <div style={{fontSize: 90, fontWeight: 900, lineHeight: 1.1}}>
        <span style={{display: 'inline-block', color: C.green, transform: `scale(${s1})`}}>38 µs</span>
        <span style={{display: 'inline-block', color: C.white, margin: '0 22px', transform: `scale(${s2})`}}>×</span>
        <span style={{display: 'inline-block', color: C.cyan, fontSize: 66, transform: `scale(${s2})`}}>299.792 km/s</span>
      </div>
      <div style={{fontSize: 150, fontWeight: 900, color: C.amber, transform: `scale(${s3})`, lineHeight: 1.1}}>= {fmt(km, 1)} km</div>
    </div>
  );
};

/* ---- D · el mapa y el punto azul ---- */
const Mapa: React.FC<{t: number}> = ({t}) => {
  const a = fio(t, 60.1, 70.4, 0.4);
  if (a <= 0) return null;
  const kpx = 76, ang = (-28 * Math.PI) / 180;
  let days = 0;
  [61.2, 64.6, 65.5, 66.4, 67.3].forEach((s) => { days += sp(t, s, 12, 140); });
  days = Math.min(5, days);
  const hx = 200, hy = 940, dx = hx + Math.cos(ang) * days * kpx, dy = hy + Math.sin(ang) * days * kpx;
  const zoom = 1 + 0.28 * ease(pr(t, 68.2, 69.2));
  const dn = Math.max(1, Math.min(5, Math.floor(days + 0.35)));
  const pulse = (t * 1.2) % 1;
  const streets = [0, 1, 2, 3, 4];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: a}}>
      <defs><clipPath id="mapclip"><rect x={90} y={330} width={800} height={760} rx={44} /></clipPath></defs>
      <rect x={90} y={330} width={800} height={760} rx={44} fill="#16224d" />
      <g clipPath="url(#mapclip)">
        <g transform={`translate(${dx} ${dy}) scale(${zoom}) translate(${-dx} ${-dy})`}>
          {streets.map((i) => <rect key={'v' + i} x={150 + i * 170} y={300} width={22} height={820} fill="#2a3a7a" />)}
          {streets.map((i) => <rect key={'h' + i} x={80} y={420 + i * 150} width={840} height={22} fill="#2a3a7a" />)}
          <rect x={150 + 2 * 170 + 22} y={442} width={148} height={128} rx={14} fill="#1f6a5c" />
          <line x1={hx} y1={hy} x2={dx} y2={dy} stroke={C.red} strokeWidth={9} strokeDasharray="22 16" strokeLinecap="round" />
          <polygon points={`${hx - 34},${hy - 6} ${hx},${hy - 40} ${hx + 34},${hy - 6}`} fill="#e56a5a" />
          <rect x={hx - 26} y={hy - 6} width={52} height={38} rx={5} fill="#f4e6c4" />
          <circle cx={dx} cy={dy} r={26 + pulse * 46} fill={C.cyan} opacity={0.35 * (1 - pulse)} />
          <circle cx={dx} cy={dy} r={25} fill="#fff" />
          <circle cx={dx} cy={dy} r={19} fill="#4aa8ff" />
        </g>
      </g>
      <rect x={90} y={330} width={800} height={760} rx={44} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth={4} />
      <g opacity={ease(pr(t, 61.2, 61.7))} transform={`translate(${Math.min(dx * zoom - (zoom - 1) * dx + 40, 640)} ${Math.max(dy - 90, 380)})`}>
        <rect width={230} height={66} rx={33} fill={C.red} />
        <text x={115} y={46} fontSize={38} fontWeight={900} fill="#06101f" textAnchor="middle">{fmt(Math.round(days * 114) / 10, 1)} km</text>
      </g>
      <g opacity={ease(pr(t, 63.1, 63.5))} transform={`translate(120 360) scale(${0.85 + 0.15 * sp(t, 63.1 + (dn - 1) * 0.0, 14, 200)})`}>
        <rect width={220} height={72} rx={36} fill={C.amber} />
        <text x={110} y={50} fontSize={44} fontWeight={900} fill="#06101f" textAnchor="middle">DÍA {dn}</text>
      </g>
      <line x1={140} y1={1048} x2={207} y2={1048} stroke={C.white} strokeWidth={6} /><text x={173} y={1020} fontSize={26} fontWeight={800} fill={C.white} textAnchor="middle">10 km</text>
      <text x={540} y={1150} fontSize={1} fill="none" />
    </svg>
  );
};
const Solucion: React.FC<{t: number}> = ({t}) => {
  const a = fio(t, 70.2, 75.2, 0.4);
  if (a <= 0) return null;
  const rocket = sp(t, 72.1, 9, 90);
  const base = '10,23000000000', fin = '10,22999999543', p = pr(t, 74.0, 75.0);
  let s = ''; for (let i = 0; i < base.length; i++) s += p > i / base.length ? fin[i] : base[i];
  return (
    <div style={{position: 'absolute', left: 60, top: 420, width: 840, textAlign: 'center', opacity: a}}>
      <div style={{background: '#16224d', borderRadius: 40, padding: '34px 20px', transform: `scale(${0.9 + 0.1 * sp(t, 70.4, 12, 140)})`}}>
        <div style={{fontSize: 30, fontWeight: 800, color: C.dim, letterSpacing: 4}}>FRECUENCIA DEL RELOJ</div>
        <div style={{fontSize: 62, fontWeight: 900, color: C.cyan, marginTop: 14, whiteSpace: 'nowrap'}}>{s} MHz</div>
      </div>
      <svg width={840} height={420} style={{marginTop: 40}}>
        <g transform={`translate(420 ${300 - rocket * 120})`}>
          <path d="M0,-130 Q60,-60 44,70 L-44,70 Q-60,-60 0,-130Z" fill="#eef4ff" />
          <circle cx={0} cy={-30} r={20} fill={C.cyan} />
          <polygon points="-44,70 -92,120 -40,40" fill={C.red} /><polygon points="44,70 92,120 40,40" fill={C.red} />
          <polygon points={`-26,76 26,76 0,${110 + rocket * 70}`} fill={C.amber} opacity={rocket} />
        </g>
        <rect x={250} y={420 - 60 + 0} width={340} height={14} rx={7} fill="#34407a" />
      </svg>
    </div>
  );
};

export const Nativo: React.FC<{subs: Sub[]}> = ({subs}) => {
  const f = useCurrentFrame();
  const t = T0 + f / FPS;
  const [h] = useState(() => delayRender('fuentes'));
  useEffect(() => {
    Promise.all([700, 800, 900].map((w) => new FontFace('Montserrat', `url(${staticFile('fonts/Montserrat-' + w + '.woff')})`, {weight: String(w)}).load().then((ff) => document.fonts.add(ff)))).then(() => continueRender(h));
  }, [h]);
  const g = 0.5 + 0.5 * Math.sin(t * 0.4);
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: 'Montserrat, system-ui, sans-serif', overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 900, height: 900, borderRadius: '50%', background: C.violet, opacity: 0.10, left: -300 + g * 40, top: 300}} />
      <div style={{position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: C.cyan, opacity: 0.08, left: 520, top: 900 - g * 40}} />
      <Title t={t} a={45.2} b={60.1} text="EL BALANCE DEL TIEMPO" color={C.green} />
      <Title t={t} a={60.4} b={70.0} text="11 KM DE ERROR AL DÍA" color={C.magenta} />
      <Title t={t} a={70.4} b={75.0} text="LA SOLUCIÓN: AJUSTAR EL RELOJ" color={C.cyan} />
      <Balanza t={t} /><Resultado t={t} /><Ecuacion t={t} /><Mapa t={t} /><Solucion t={t} />
      <Captions t={t} subs={subs} />
      <div style={{position: 'absolute', left: 0, width: 960, top: 1346, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, opacity: 0.32, fontWeight: 900, fontSize: 36, color: '#cfe6ff', letterSpacing: 3}}>
        <Img src={staticFile('emoji.png')} style={{width: 46, height: 46}} />SABIDURÍA 72<Img src={staticFile('emoji.png')} style={{width: 46, height: 46}} />
      </div>
      <Audio src={staticFile('clip_mix.wav')} />
    </AbsoluteFill>
  );
};
