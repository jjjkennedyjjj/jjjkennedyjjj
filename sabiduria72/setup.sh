#!/usr/bin/env bash
# Prepara un contenedor nuevo para producir vídeos de SABIDURÍA 72 (tarda ≈1 min).
# Uso: bash sabiduria72/setup.sh
set -euo pipefail
KIT="$(cd "$(dirname "$0")" && pwd)"
pip install -q -r "$KIT/requirements.txt" 2>&1 | tail -1 || true
(cd "$KIT/remotion" && npm install --no-audit --no-fund 2>&1 | tail -1)
command -v ffmpeg >/dev/null || { echo "Falta ffmpeg"; exit 1; }
node -e "require('playwright')" 2>/dev/null || { echo "Falta playwright (viene preinstalado en la nube)"; exit 1; }
echo "Listo. Siguiente paso: ver sabiduria72/README.md"
