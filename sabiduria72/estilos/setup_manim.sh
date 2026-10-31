#!/usr/bin/env bash
# Instala Manim en un entorno virtual (/tmp/mvenv). Necesita las librerías de cairo/pango del sistema (apt).
set -euo pipefail
apt-get update -qq && apt-get install -y -qq libcairo2-dev libpango1.0-dev pkg-config python3-dev
python3 -m venv /tmp/mvenv
/tmp/mvenv/bin/pip install -q --upgrade pip setuptools wheel
/tmp/mvenv/bin/pip install -q manim
/tmp/mvenv/bin/python -c "import manim; print('manim', manim.__version__)"
