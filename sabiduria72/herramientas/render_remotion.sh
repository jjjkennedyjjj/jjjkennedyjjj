#!/usr/bin/env bash
# Variante V-B: genera el MP4 de un vídeo con Remotion (voz + efectos de sonido incluidos).
# Uso: bash herramientas/render_remotion.sh videos/NN_tema [salida.mp4]
set -euo pipefail
KIT="$(cd "$(dirname "$0")/.." && pwd)"
V="$(cd "$1" && pwd)"
OUT="${2:-$V/$(basename "$V")_remotion.mp4}"

echo "1/5 Montando el motor sin audio…"
python3 "$KIT/motor/build.py" "$V" noaudio
echo "2/5 Efectos de sonido a WAV…"
node "$KIT/herramientas/sfx_offline.js" "$V/dev.html" "$V/sfx.wav"
echo "3/5 Mezcla de voz + efectos…"
read -r OFFMS DUR < <(python3 - "$V/config.json" <<'PY'
import json,sys
c=json.load(open(sys.argv[1]));print(int(round(c["off"]*1000)),c["dur"])
PY
)
mkdir -p "$KIT/remotion/public"
cp "$V/dev.html" "$V/config.json" "$KIT/remotion/public/"
ffmpeg -y -loglevel error -i "$V/$(python3 -c "import json;print(json.load(open('$V/config.json')).get('mp3','voz.mp3'))")" -i "$V/sfx.wav" \
  -filter_complex "[0:a]adelay=${OFFMS}|${OFFMS},apad[v];[v][1:a]amix=inputs=2:normalize=0:duration=longest[o]" \
  -map "[o]" -t "$DUR" -ar 44100 -ac 1 "$KIT/remotion/public/mix.wav"
echo "4/5 Dependencias de Remotion…"
cd "$KIT/remotion"
[ -d node_modules ] || npm install --no-audit --no-fund
BR="$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | head -1 || true)"
EXTRA=()
[ -n "$BR" ] && EXTRA+=(--browser-executable="$BR" --chrome-mode=headless-shell)
echo "5/5 Renderizando con Remotion…"
npx remotion render src/index.ts Video "$OUT" "${EXTRA[@]}" --concurrency="$(nproc)" --codec=h264 --crf=20
echo "Listo: $OUT"
