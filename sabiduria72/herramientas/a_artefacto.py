#!/usr/bin/env python3
"""Convierte el HTML final de un vídeo en la versión para publicar como artefacto de claude.ai
(sin <!doctype>, <html>, <head>, <body> ni metas: el publicador los añade) y le pone un <title> corto.

Uso: python herramientas/a_artefacto.py videos/NN_tema/salida.html "Sabiduría 72 · Vídeo NN" [videos/NN_tema/artefacto.html]
"""
import re, sys
from pathlib import Path

src, titulo = Path(sys.argv[1]), sys.argv[2]
out = Path(sys.argv[3]) if len(sys.argv) > 3 else src.with_name("artefacto.html")
h = src.read_text(encoding="utf-8")
h = re.sub(r"<title>.*?</title>", f"<title>{titulo}</title>", h, count=1)
for t in ("<!doctype html>\n", '<html lang="es">\n', "<head>\n", "</head>\n", "<body>\n", "</body>\n", "</html>\n", "</html>"):
    h = h.replace(t, "")
h = re.sub(r'<meta charset="utf-8">\n', "", h, count=1)
h = re.sub(r'<meta name="viewport"[^>]*>\n', "", h, count=1)
out.write_text(h, encoding="utf-8")
print(out, f"{len(h)/1e6:.2f} MB")
