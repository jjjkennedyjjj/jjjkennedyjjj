# Estilos de animación (pruebas de 30 s, vídeo 06, tramo 45–75 s de audio)

| Estilo | Cómo se hace | Archivos |
|---|---|---|
| 1 · Ilustrado | Motor de la serie (canvas) → MP4 con Remotion; el clip es un recorte del MP4 completo | `motor/`, `herramientas/render_remotion.sh` |
| 2 · Neón | El mismo `video.js` + `estilos/neon.js` añadido al final (contornos que brillan, mapa en rejilla, bloom alto); MP4 con Remotion y `--props='{"src":"dev_neon.html"}'` | `estilos/neon.js` |
| 3 · Nativo Remotion | Escenas reescritas en React/SVG con muelles (`spring`), cifras grandes y tipografía cinética | `remotion/src/Nativo.tsx` |
| 4 · Manim (pizarra) | Trazos finos sin relleno que se dibujan; Manim en un venv | `estilos/manim_balanza.py`, `estilos/setup_manim.sh` |

Cómo repetirlos (en un contenedor nuevo): `bash sabiduria72/setup.sh` y, para Manim, `bash sabiduria72/estilos/setup_manim.sh`.

* Clip de Remotion: `npx remotion render src/index.ts Nativo salida.mp4 --browser-executable=… --chrome-mode=headless-shell`
  (ver `herramientas/render_remotion.sh` para las opciones). Para recortar el motor: `--frames=1356-2255` (45,2–75,2 s).
* Manim: `/tmp/mvenv/bin/manim render --media_dir <salida> estilos/manim_balanza.py Balanza`; luego mezclar con el audio del clip
  con ffmpeg (el vídeo sale ≈1,4 s más largo: recortar a 30 s).
* Los clips usan `videos/06_gps/estilos/subs_clip.json` y `clip_mix.wav` (voz + efectos), que NO están en el repo.
