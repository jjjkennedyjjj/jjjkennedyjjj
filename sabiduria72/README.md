# Kit de SABIDURÍA 72

Todo lo necesario para producir un vídeo desde un MP3 de Luisa sin reinstalar ni reescribir nada.
El contenedor de la nube se borra al terminar la sesión; esta carpeta (en el repo) es lo que se conserva.

## Puesta en marcha (≈1 min, en un contenedor nuevo)

```bash
bash sabiduria72/setup.sh
```

Instala las dependencias de Python (`requirements.txt`) y de Remotion (`remotion/package.json`).
`ffmpeg` y Playwright vienen ya en la nube. No se guarda `node_modules` ni ningún modelo (pesan demasiado):
se reinstalan con el comando de arriba.

## Qué hay en cada carpeta

| Carpeta | Contenido |
|---|---|
| `motor/plantilla_motor.html` | Motor v2 de cámara fija (canvas 1080×1920, gancho, subtítulos, cierre ♾️, efectos, reproductor). Reconstruido el 31 oct 2026: no es el motor original del Proyecto. |
| `motor/build.py` | Monta el HTML: `python3 sabiduria72/motor/build.py sabiduria72/videos/NN_tema [noaudio]` |
| `herramientas/medir_tiempos.py` | Alinea subtítulos con la voz (sílabas + mínimos de energía). `--silencios` lista las frases. |
| `herramientas/transcribir.py` | Transcribe el MP3 cuando NO hay guion (Whisper small, descarga ≈640 MB desde GitHub). |
| `herramientas/qa_fotogramas.js` | Control de calidad: PNG de 48 fotogramas, hoja `--sheet`, errores de JS y coste por fotograma. |
| `herramientas/sfx_offline.js` | Efectos de sonido a WAV (para el MP4). |
| `herramientas/render_remotion.sh` | **Variante V-B**: MP4 con Remotion (voz + efectos). |
| `remotion/` | Proyecto de Remotion (`src/Frame.tsx` captura los fotogramas del motor). |
| `assets/` | Montserrat 700/800/900 (WOFF), TTF 900 y el emoji ♾️ de Noto. |
| `ejemplos/06_gps/` | `video.js`, `sfx.js` y `config.json` del vídeo 06, como referencia visual. Sin voz ni guion. |
| `videos/NN_tema/` | Carpeta de trabajo de cada vídeo. **Está en `.gitignore`**: el repo es público. |

## Flujo de un vídeo nuevo

1. `videos/NN_tema/voz.mp3` (y `guion.txt` si lo hay). Sin guion: `python3 sabiduria72/herramientas/transcribir.py videos/NN_tema/voz.mp3` y corregir el borrador.
2. Escribir `frases.json` (`ini`, `fin`, `texto`; ver el docstring de `medir_tiempos.py`) y ejecutar
   `python3 sabiduria72/herramientas/medir_tiempos.py videos/NN_tema/voz.mp3 videos/NN_tema/frases.json`.
   Da `OFF`, `DUR`, `LOGO_T0` y escribe `subs.js`.
3. Escribir `config.json`, `video.js` y `sfx.js` tomando `ejemplos/06_gps/` como modelo.
4. **V-A (HTML):** `python3 sabiduria72/motor/build.py videos/NN_tema` → un solo HTML con la voz incrustada.
   Control de calidad: `build.py … noaudio` y `node sabiduria72/herramientas/qa_fotogramas.js videos/NN_tema/dev.html salida --sheet`.
5. **V-B (MP4 con Remotion):** `bash sabiduria72/herramientas/render_remotion.sh videos/NN_tema salida.mp4`.

## Notas

* Los tiempos de `video.js` y `sfx.js` están en segundos de **audio**; el motor suma `OFF` para pasar a tiempo de vídeo.
* Con el motor reconstruido, hay dos diferencias conocidas respecto al kit original: la hoja de QA es un script de Node
  (`qa_fotogramas.js`, no `.py`) y no hay `portada.py` todavía.
* Las páginas publicadas como artefacto no llevan `<html>`/`<head>`; ver cómo se generó `artefacto.html` en la sesión del vídeo 06
  (se quitan esas etiquetas y se pone un `<title>` corto).
