#!/usr/bin/env python3
"""Mide la voz de Luisa y alinea los subtítulos con el guion.

Uso:
  python herramientas/medir_tiempos.py videos/NN_tema/voz.mp3 --silencios
      Lista los tramos de voz entre pausas (para armar frases.json).
  python herramientas/medir_tiempos.py videos/NN_tema/voz.mp3 videos/NN_tema/frases.json
      Alinea palabra a palabra y escribe subs.js junto a frases.json.

frases.json = [{"ini": seg, "fin": seg, "texto": "..."}]
  * *asteriscos* marcan palabras clave (ámbar).
  * 30{treinta}  → se muestra «30» pero se cuenta como «treinta» para repartir el tiempo.
  * ~ une dos palabras con un espacio duro (p. ej. «10~cm»).

Reparto: cada frase (entre dos pausas) se reparte por sílabas y cada frontera se ajusta
al mínimo de energía más cercano (±90 ms). Con la voz entrando a 0,3 s: OFF = 0,3 − inicio_voz.
"""
import json, math, re, subprocess, sys, tempfile, wave
from pathlib import Path

import numpy as np

STRONG, WEAK = set("aeoáéó"), set("iuü")


def silabas(palabra: str) -> int:
    w = re.sub(r"[^a-záéíóúüñ]", "", palabra.lower())
    if not w:
        return 0
    w = re.sub(r"(qu|gu)(?=[eiéí])", lambda m: m.group(1)[0], w)
    n, prev = 0, None
    for ch in w:
        if ch in "aeiouáéíóúü":
            if prev is None or (prev in STRONG and ch in STRONG) or ch in "íú" or prev in "íú":
                n += 1
            prev = ch
        else:
            prev = None
    return max(n, 1)


def wav16k(mp3: Path) -> np.ndarray:
    tmp = Path(tempfile.mkdtemp()) / "v.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(mp3), "-ar", "16000", "-ac", "1", str(tmp)], check=True)
    w = wave.open(str(tmp))
    return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768


def envolvente(a: np.ndarray, paso=160, ventana=480):
    n = len(a) // paso
    e = np.array([math.sqrt(float(np.mean(a[i * paso:i * paso + ventana] ** 2)) + 1e-12) for i in range(n)])
    k = np.ones(3) / 3
    return np.convolve(e, k, mode="same")  # 10 ms por muestra


def inicio_voz(env, umbral=0.012):
    for i, v in enumerate(env):
        if v > umbral:
            return i * 0.01
    return 0.0


def silencios(mp3: Path):
    out = subprocess.run(["ffmpeg", "-i", str(mp3), "-af", "silencedetect=noise=-38dB:d=0.25", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
    dur = float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).group(1)) * 3600 + \
        float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).group(2)) * 60 + \
        float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).group(3))
    return st, en, dur


def partir(tokens, maxc=52):
    """Parte una lista de palabras en trozos de ≤ maxc caracteres, mejor en puntuación."""
    txt = " ".join(t["m"] for t in tokens)
    if len(txt) <= maxc or len(tokens) < 2:
        return [tokens]
    mitad = len(txt) / 2
    mejor, mejor_d, pos = 1, 1e9, 0
    for i, t in enumerate(tokens[:-1]):
        pos += len(t["m"]) + 1
        d = abs(pos - mitad) - (14 if re.search(r"[,;:.…]$", t["m"]) else 0)
        if d < mejor_d:
            mejor, mejor_d = i + 1, d
    return partir(tokens[:mejor], maxc) + partir(tokens[mejor:], maxc)


def alinear(frases, env, pausa_sil=1.6, pausa_coma=0.8):
    subs, logo_t0 = [], None
    for fr in frases:
        toks = []
        for raw in fr["texto"].split():
            m = re.match(r"^(.*?)\{(.*)\}(.*)$", raw)
            if m:
                mostrar, hablado = m.group(1) + m.group(3), m.group(2)
            else:
                mostrar, hablado = raw, raw
            toks.append({"m": mostrar, "h": hablado})
        pesos = []
        for t in toks:
            s = sum(silabas(p) for p in re.split(r"[\s~]+", t["h"]))
            p = max(s, 1) + 0.35
            if re.search(r"…$", t["m"]):
                p += 2.4
            elif re.search(r"[.:;]$", t["m"]):
                p += pausa_sil * .5
            elif re.search(r",$", t["m"]):
                p += pausa_coma
            pesos.append(p)
        # los pesos de pausa van entre palabras: se cuentan al final de cada palabra
        tot = sum(pesos)
        ini, fin = fr["ini"], fr["fin"]
        acum, inicios = 0.0, []
        for p in pesos:
            inicios.append(ini + (fin - ini) * acum / tot)
            acum += p
        # ajuste fino a mínimos de energía
        med = float(np.median(env[int(ini * 100):int(fin * 100) + 1])) if fin > ini else 1.0
        for i in range(1, len(inicios)):
            c = int(inicios[i] * 100)
            lo, hi = max(c - 9, int(ini * 100)), min(c + 9, int(fin * 100))
            if hi <= lo:
                continue
            j = lo + int(np.argmin(env[lo:hi + 1]))
            if env[j] < 0.55 * med:
                inicios[i] = max(inicios[i - 1] + .09, j * 0.01 + .02)
        for k, t in enumerate(toks):
            t["t"] = inicios[k]
        for t in toks:
            if t["m"].replace("*", "").startswith("Sabiduría"):
                logo_t0 = t["t"]
        for trozo in partir(toks):
            idx0 = toks.index(trozo[0])
            idx1 = toks.index(trozo[-1])
            t_ini = trozo[0]["t"]
            t_fin = toks[idx1 + 1]["t"] if idx1 + 1 < len(toks) else fin
            subs.append([round(t_ini, 2), round(min(t_fin, fin), 2), " ".join(t["m"] for t in trozo),
                         [round(t["t"], 2) for t in trozo]])
    return subs, logo_t0


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    mp3 = Path(sys.argv[1])
    if sys.argv[2] == "--silencios":
        st, en, dur = silencios(mp3)
        b = 0.0
        for s, e in zip(st, en):
            print(f"{b:7.2f} {s:7.2f}   ({s - b:.2f} s)")
            b = e
        print(f"{b:7.2f} {dur:7.2f}   (final)")
        return
    frases = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
    a = wav16k(mp3)
    env = envolvente(a)
    v0 = inicio_voz(env)
    subs, logo = alinear(frases, env)
    off = round(0.3 - v0, 2)
    fin_voz = frases[-1]["fin"]
    dur = round(fin_voz + off + 2.5, 1)
    out = Path(sys.argv[2]).with_name("subs.js")
    lineas = ",\n".join("  " + json.dumps(s, ensure_ascii=False, separators=(",", ":")) for s in subs)
    out.write_text(f"const SUBS=[\n{lineas}\n];\n", encoding="utf-8")
    print(f"inicio de la voz: {v0:.2f} s   OFF = {off}   fin de la voz: {fin_voz:.2f} s   DUR = {dur}")
    print(f"LOGO_T0 (Sabiduría) = {logo:.2f}" if logo else "LOGO_T0: no encontrado")
    print(f"{len(subs)} SUBS escritos en {out}")
    for s in subs:
        if len(s[2]) > 52:
            print("!! subtítulo largo:", s[2])


if __name__ == "__main__":
    main()
