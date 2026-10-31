#!/usr/bin/env python3
"""Monta el HTML de un vídeo de SABIDURÍA 72.

Uso:  python motor/build.py videos/NN_tema [noaudio]

Lee videos/NN_tema/{config.json, video.js, sfx.js, voz.mp3} y escribe:
  - <salida>.html   (con la voz incrustada en base64)
  - dev.html        (con «noaudio»: sin voz, para el control de calidad)
"""
import base64, json, subprocess, sys, tempfile
from pathlib import Path

KIT = Path(__file__).resolve().parent.parent          # carpeta sabiduria72/
ASSETS = KIT / "assets"


def b64(p: Path) -> str:
    return base64.b64encode(p.read_bytes()).decode()


def font_faces() -> str:
    out = []
    for w in (700, 800, 900):
        f = ASSETS / "fonts" / f"Montserrat-{w}.woff"
        out.append(
            "@font-face{font-family:'Montserrat';font-weight:%d;font-style:normal;"
            "src:url(data:font/woff;base64,%s) format('woff')}" % (w, b64(f))
        )
    return "\n".join(out)


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    folder = Path(sys.argv[1]).resolve()
    noaudio = "noaudio" in sys.argv[2:]
    cfg = json.loads((folder / "config.json").read_text(encoding="utf-8"))
    tpl = (KIT / "motor" / "plantilla_motor.html").read_text(encoding="utf-8")
    video = (folder / "video.js").read_text(encoding="utf-8")
    sfx = (folder / "sfx.js").read_text(encoding="utf-8") if (folder / "sfx.js").exists() else ""
    if (folder / "subs.js").exists() and "const SUBS" not in video:  # subtítulos alineados por medir_tiempos.py
        video = (folder / "subs.js").read_text(encoding="utf-8") + video

    audio_b64 = ""
    if not noaudio:
        mp3 = folder / cfg.get("mp3", "voz.mp3")
        atrim = float(cfg.get("atrim", 0) or 0)
        if atrim > 0:  # recorta el silencio inicial
            tmp = Path(tempfile.mkdtemp()) / "voz_trim.mp3"
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(atrim), "-i", str(mp3),
                            "-c:a", "libmp3lame", "-b:a", "128k", str(tmp)], check=True)
            mp3 = tmp
        audio_b64 = b64(mp3)

    html = tpl
    html = html.replace("__TITLE__", cfg["titulo"])
    html = html.replace("/*__FONT_FACES__*/", font_faces())
    html = html.replace("__EMO_B64__", b64(ASSETS / "emoji_infinito_noto.png"))
    html = html.replace("__OFF__", str(cfg["off"])).replace("__DUR__", str(cfg["dur"]))
    html = html.replace("/*__SFX_BLOCK__*/", sfx).replace("/*__VIDEO_BLOCK__*/", video)
    html = html.replace("__AUDIO_B64__", audio_b64)  # el audio va al final: es lo más grande

    out = folder / ("dev.html" if noaudio else cfg["salida"])
    out.write_text(html, encoding="utf-8")
    print(f"{out}  ({out.stat().st_size/1e6:.2f} MB)")


if __name__ == "__main__":
    main()
