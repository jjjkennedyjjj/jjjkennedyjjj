#!/usr/bin/env node
// Genera el WAV de efectos de sonido de un vídeo a partir de su dev.html.
// Uso: node herramientas/sfx_offline.js videos/NN_tema/dev.html salida_sfx.wav
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
const [html, out] = process.argv.slice(2);
if (!html || !out) { console.error('Uso: node sfx_offline.js dev.html sfx.wav'); process.exit(1); }
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  p.on('pageerror', e => console.error('ERROR JS:', e.message));
  await p.goto('file://' + path.resolve(html) + '?t=0&cap=1');
  await p.waitForFunction(() => window.__listo === true);
  const b64 = await p.evaluate(() => window.__sfxOffline(window.__qa.DUR));
  fs.writeFileSync(out, Buffer.from(b64, 'base64'));
  console.log('SFX:', out, (fs.statSync(out).size / 1e6).toFixed(2), 'MB');
  await b.close();
})();
