#!/usr/bin/env node
// Control de calidad: renderiza fotogramas de un dev.html, los guarda como PNG y mide el coste.
// Uso: node herramientas/qa_fotogramas.js videos/NN_tema/dev.html <carpeta_salida> [t1,t2,...] [--sheet]
//   Sin lista de tiempos: 48 fotogramas repartidos por toda la duración.
//   Con --sheet crea hoja.png (8×6) con ffmpeg.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const [html, out, list] = process.argv.slice(2).filter(a => !a.startsWith('--'));
const sheet = process.argv.includes('--sheet');
if (!html || !out) { console.error('Uso: node qa_fotogramas.js dev.html salida [t1,t2,...] [--sheet]'); process.exit(1); }
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
  const problemas = new Set();
  page.on('pageerror', e => problemas.add('ERROR JS: ' + e.message));
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) problemas.add(m.type().toUpperCase() + ': ' + m.text()); });
  await page.goto('file://' + path.resolve(html) + '?t=0&cap=1');
  await page.waitForFunction(() => window.__listo === true, null, { timeout: 30000 });
  const dur = await page.evaluate(() => window.__qa.DUR);
  const tiempos = list ? list.split(',').map(Number) : Array.from({ length: 48 }, (_, i) => +(1 + i * (dur - 3) / 47).toFixed(2));
  let i = 0, total = 0;
  for (const t of tiempos) {
    const t0 = Date.now();
    const data = await page.evaluate(t => { window.renderFrame(t); return document.getElementById('cv').toDataURL('image/png'); }, t);
    total += Date.now() - t0;
    fs.writeFileSync(path.join(out, String(i).padStart(3, '0') + '_' + t.toFixed(2) + '.png'), Buffer.from(data.split(',')[1], 'base64'));
    i++;
  }
  // coste de dibujo (sin codificar PNG)
  const ms = await page.evaluate(() => { const r = []; for (let k = 0; k < 40; k++) { const t = 3 + k * 2.3; const a = performance.now(); window.renderFrame(t); r.push(performance.now() - a); } r.sort((a, b) => a - b); return { medio: r.reduce((a, b) => a + b, 0) / r.length, p90: r[Math.floor(r.length * .9)], max: r[r.length - 1] }; });
  console.log(`fotogramas: ${tiempos.length}  ms_medio: ${ms.medio.toFixed(1)}  p90: ${ms.p90.toFixed(1)}  max: ${ms.max.toFixed(1)}`);
  console.log(problemas.size ? [...problemas].join('\n') : 'sin errores ni avisos');
  await browser.close();
  if (sheet) {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-pattern_type', 'glob', '-i', path.join(out, '*.png'), '-vf', 'scale=270:480,tile=8x6', '-frames:v', '1', path.join(out, 'hoja.png')]);
    console.log('hoja:', path.join(out, 'hoja.png'));
  }
})().catch(e => { console.error(e); process.exit(1); });
