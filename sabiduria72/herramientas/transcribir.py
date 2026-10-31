#!/usr/bin/env python3
"""Transcribe la voz de Luisa cuando NO hay guion (Whisper small vía sherpa-onnx, sin internet salvo la 1.ª vez).

Uso:  python herramientas/transcribir.py videos/NN_tema/voz.mp3 [videos/NN_tema/frases_borrador.json]

* Parte la voz en frases por las pausas (las mismas que usa medir_tiempos.py).
* Escribe un BORRADOR de frases.json: hay que corregirlo a mano (nombres propios, cifras, tildes).
* El modelo (≈640 MB) se descarga de GitHub Releases a ~/.cache/sabiduria72/ (huggingface.co está
  bloqueado en el entorno de la nube). El contenedor se borra al terminar la sesión: si ya tienes
  el guion, escribe frases.json a mano y te ahorras la descarga.
"""
import json, subprocess, sys, tarfile, urllib.request, wave
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from medir_tiempos import silencios  # noqa: E402

URL = "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2"
CACHE = Path.home() / ".cache" / "sabiduria72"
MODELO = CACHE / "sherpa-onnx-whisper-small"


def modelo():
    if (MODELO / "small-encoder.int8.onnx").exists():
        return
    CACHE.mkdir(parents=True, exist_ok=True)
    tar = CACHE / "small.tar.bz2"
    print("Descargando el modelo Whisper small (≈640 MB)…")
    urllib.request.urlretrieve(URL, tar)
    with tarfile.open(tar) as t:
        t.extractall(CACHE)
    tar.unlink()


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    import sherpa_onnx
    mp3 = Path(sys.argv[1])
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else mp3.with_name("frases_borrador.json")
    modelo()
    wav = CACHE / "_voz16k.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp3), "-ar", "16000", "-ac", "1", str(wav)], check=True)
    w = wave.open(str(wav))
    a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    st, en, dur = silencios(mp3)
    tramos, b = [], 0.12
    for s, e in zip(st, en):
        tramos.append((b, s))
        b = e
    tramos.append((b, dur - 0.05))
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=str(MODELO / "small-encoder.int8.onnx"), decoder=str(MODELO / "small-decoder.int8.onnx"),
        tokens=str(MODELO / "small-tokens.txt"), language="es", task="transcribe", num_threads=4)
    res = []
    for ini, fin in tramos:
        if fin - ini < 0.3:
            continue
        x = a[int(max(0, ini - .15) * 16000):int(min(dur, fin + .15) * 16000)]
        s = rec.create_stream(); s.accept_waveform(16000, x); rec.decode_stream(s)
        res.append({"ini": round(ini, 2), "fin": round(fin, 2), "texto": s.result.text.strip()})
        print(f"{ini:7.2f} {fin:7.2f}  {res[-1]['texto']}")
    out.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
    print("Borrador:", out, "(corrígelo a mano)")


if __name__ == "__main__":
    main()
