// Renderiza index.html a fotogramas PNG (30 fps, 20 s) y luego a MP4 con ffmpeg.
// Uso: node render.js <directorio_de_fotogramas> <salida.mp4>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

const framesDir = process.argv[2];
const out = process.argv[3];
if (!framesDir || !out) { console.error('Uso: node render.js <frames_dir> <salida.mp4>'); process.exit(1); }
fs.mkdirSync(framesDir, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.resolve(__dirname, 'index.html'));
  const canvas = await page.$('#c');
  const { FPS, DUR } = await page.evaluate(() => ({ FPS: window.FPS, DUR: window.DUR }));
  const total = FPS * DUR;
  for (let i = 0; i < total; i++) {
    await page.evaluate(t => window.render(t), i / FPS);
    await canvas.screenshot({ path: path.join(framesDir, String(i).padStart(4, '0') + '.png') });
  }
  await browser.close();
  execFileSync('ffmpeg', ['-y', '-framerate', String(FPS), '-i', path.join(framesDir, '%04d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', out],
    { stdio: 'inherit' });
  console.log('Listo:', out, `(${total} fotogramas)`);
})().catch(e => { console.error(e); process.exit(1); });
