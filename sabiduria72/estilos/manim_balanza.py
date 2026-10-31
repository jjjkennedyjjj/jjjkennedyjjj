"""ESTILO «MANIM / PIZARRA»: los mismos 30 s (45–75 s de audio) del vídeo 06 dibujados como en una pizarra:
trazos finos que se dibujan, números que cuentan y formas sin relleno.

Render (vídeo mudo; luego se mezcla con clip_mix.wav):
  /tmp/mvenv/bin/manim render -r 1080,1920 --fps 30 --media_dir <salida> estilos/manim_balanza.py Balanza
Manim se instala en un entorno virtual: ver estilos/README.md.
Los subtítulos se leen de videos/06_gps/estilos/subs_clip.json (no está en el repo).
"""
import json
import pathlib

import manimpango
import numpy as np
from manim import *

KIT = pathlib.Path(__file__).resolve().parent.parent
manimpango.register_font(str(KIT / "assets" / "fonts" / "Montserrat-900.ttf"))
config.pixel_width, config.pixel_height = 1080, 1920
config.frame_width, config.frame_height = 9, 16
config.frame_rate = 30
F = "Montserrat Black"
BG = "#070b18"
CY, AM, MG, GR, RD, VI, WH, DM = "#5fe3ff", "#ffc857", "#ff5fa2", "#4dffa6", "#ff4d6d", "#a78bfa", "#eef4ff", "#8d9bc0"
T0 = 45.0
SUBS = [(s[0] - T0, s[1] - T0, s[2], [w - T0 for w in s[3]]) for s in json.load(open(KIT / "videos" / "06_gps" / "estilos" / "subs_clip.json", encoding="utf-8"))]


def P(x, y):  # píxeles (1080×1920) → unidades de Manim
    return np.array([(x - 540) / 120, (960 - y) / 120, 0])


_EM = None


def fs(px):  # tamaño de fuente (px del vídeo) → font_size de Manim, calibrado con la altura de una «H»
    global _EM
    if _EM is None:
        _EM = Text("H", font=F, font_size=100).height / 0.70
    return 100 * (px / 120) / _EM


def T(s, px, color=WH, **kw):
    return Text(s, font=F, font_size=fs(px), color=color, **kw)


def fmt(v, d=0):
    a, _, b = f"{abs(v):.{d}f}".partition(".")
    a = f"{int(a):,}".replace(",", ".")
    return ("−" if v < 0 else "") + a + ("," + b if b else "")


class Balanza(Scene):
    def at(self, t):
        d = t - self.clk.get_value()
        if d > 1 / 60:
            self.wait(d)

    def construct(self):
        self.camera.background_color = BG
        self.clk = ValueTracker(0)
        self.clk.add_updater(lambda m, dt: m.increment_value(dt))
        self.add(self.clk)
        self.captions()
        self.brand()
        self.balanza()
        self.mapa()
        self.solucion()
        self.at(30.0)

    # ---------- subtítulos y marca ----------
    def captions(self):
        groups = []
        for (a, b, txt, wt) in SUBS:
            words = [T(w.replace("*", "").replace("~", " "), 40, WH) for w in txt.split(" ")]
            keys = [bool(__import__("re").match(r"^\*.*\*[.,;:!?…]*$", w)) for w in txt.split(" ")]
            lines, cur, cw = [], [], 0
            for w in words:
                if cur and cw + w.width + 0.12 > 6.0:
                    lines.append(cur); cur, cw = [], 0
                cur.append(w); cw += w.width + 0.12
            lines.append(cur)
            rows = VGroup(*[VGroup(*l).arrange(RIGHT, buff=0.12) for l in lines]).arrange(DOWN, buff=0.12)
            rows.move_to(P(480, 1240))
            box = RoundedRectangle(corner_radius=0.2, width=rows.width + 0.5, height=rows.height + 0.35, fill_color="#05091a", fill_opacity=0.6, stroke_width=0).move_to(rows)
            groups.append((a, b, wt, words, keys, box))
        everything = VGroup(*[VGroup(g[5], *g[3]) for g in groups])
        everything.set_opacity(0)

        def upd(_):
            t = self.clk.get_value()
            for (a, b, wt, words, keys, box) in groups:
                o = 0.0
                if a - 0.12 <= t <= b + 0.2:
                    o = min(1, max(0, (t - (a - 0.12)) / 0.18)) * min(1, max(0, (b + 0.2 - t) / 0.2))
                box.set_fill(opacity=0.6 * o)
                for w, k, tw in zip(words, keys, wt):
                    w.set_color(AM if k else WH)
                    w.set_opacity(o * (1 if t >= tw - 0.02 else 0.42))

        everything.add_updater(upd)
        self.add(everything)

    def brand(self):
        emo = "emoji_infinito_noto.png"
        path = str(KIT / "assets" / emo)
        a, b = ImageMobject(path).scale_to_fit_height(0.4), ImageMobject(path).scale_to_fit_height(0.4)
        t = T("SABIDURÍA 72", 34, "#cfe6ff")
        g = Group(a, t, b)
        g.arrange(RIGHT, buff=0.18).move_to(P(480, 1372))
        t.set_opacity(0.32); a.set_opacity(0.32); b.set_opacity(0.32)
        self.add(g)

    def title(self, txt, color, t_in, *extra):
        self.at(t_in)
        tt = T(txt, 60, color).move_to(P(480, 215))
        if tt.width > 6.6:
            tt.scale_to_fit_width(6.6)
        ln = Line(tt.get_left() + DOWN * 0.45, tt.get_right() + DOWN * 0.45, color=color, stroke_width=6)
        self.play(FadeIn(tt, shift=UP * 0.3), Create(ln), *extra, run_time=0.5)
        return VGroup(tt, ln)

    # ---------- A · la balanza ----------
    def balanza(self):
        piv = P(540, 600)
        tilt, dropR, dropL = ValueTracker(0), ValueTracker(1), ValueTracker(0)
        post = Polygon(piv, piv + np.array([-0.62, -2.4, 0]), piv + np.array([0.62, -2.4, 0]), color=VI, stroke_width=4)
        base = Line(piv + np.array([-1.0, -2.4, 0]), piv + np.array([1.0, -2.4, 0]), color=VI, stroke_width=6)

        def beam():
            a = np.radians(tilt.get_value())  # positivo = baja el lado derecho
            l = piv + np.array([-3 * np.cos(a), 3 * np.sin(a), 0])
            r = piv + np.array([3 * np.cos(a), -3 * np.sin(a), 0])
            return Line(l, r, color=WH, stroke_width=10)

        def card(sd, w, h, col, txt, size, drop):
            def f():
                a = np.radians(tilt.get_value())
                e = piv + np.array([sd * 3 * np.cos(a), -sd * 3 * np.sin(a), 0])
                rect = RoundedRectangle(corner_radius=0.18, width=w, height=h, color=col, stroke_width=6)
                lab = T(txt, size, col).move_to(rect)
                g = VGroup(rect, lab).move_to(e + UP * (h / 2 + 0.12) + UP * drop())
                return g
            return always_redraw(f)

        left = card(-1, 1.45, 1.0, RD, "−7 µs", 40, lambda: 0)
        right = card(1, 2.0, 1.55, GR, "+45 µs", 52, lambda: dropR.get_value() * 5)
        beam_m = always_redraw(beam)
        pivot_dot = Dot(piv, radius=0.14, color=AM)
        lab_l = T("velocidad", 34, RD).move_to(P(210, 810))
        lab_r = T("gravedad", 34, GR).move_to(P(870, 810))
        self.add(post, base, beam_m, pivot_dot, left)
        self.at(0.0)
        tt = self.title("EL BALANCE DEL TIEMPO", GR, 0.2)
        self.at(0.1) if self.clk.get_value() < 0.1 else None
        self.add(right)
        self.play(dropR.animate(rate_func=rate_functions.ease_out_bounce).set_value(0), FadeIn(lab_l), run_time=0.7)
        self.at(0.8)
        self.play(tilt.animate(rate_func=rate_functions.ease_out_back).set_value(11), FadeIn(lab_r), run_time=1.3)
        self.at(3.2)
        chip = VGroup(RoundedRectangle(corner_radius=0.3, width=3.9, height=0.62, color=VI, fill_color=VI, fill_opacity=1, stroke_width=0), T("gana la gravedad", 32, "#06101f"))
        chip[1].move_to(chip[0])
        chip.move_to(P(540, 400))
        self.play(FadeIn(chip, scale=0.7), run_time=0.35)
        self.at(5.2)
        self.play(FadeOut(chip), run_time=0.3)
        # resultado
        self.at(5.3)
        val = ValueTracker(0)
        big = always_redraw(lambda: T("+" + fmt(val.get_value()) + " µs", 130, GR).move_to(P(480, 990)))
        sub = T("al día · el reloj del satélite se adelanta", 32, DM).move_to(P(480, 1085))
        self.add(big)
        self.play(FadeIn(sub), run_time=0.4)
        self.at(6.4)
        self.play(val.animate(rate_func=rate_functions.ease_out_cubic).set_value(38), run_time=4.0)
        # × velocidad de la luz
        self.at(12.4)
        self.play(FadeOut(VGroup(post, base, pivot_dot, lab_l, lab_r, sub)), FadeOut(beam_m), FadeOut(left), FadeOut(right), FadeOut(big), FadeOut(tt), run_time=0.5)
        e1 = T("38 µs", 100, GR).move_to(P(240, 700))
        e2 = T("×", 90, WH).move_to(P(440, 700))
        e3 = T("299.792 km/s", 62, CY).move_to(P(700, 700))
        self.play(FadeIn(e1, scale=0.6), run_time=0.4)
        self.at(13.3)
        self.play(FadeIn(e2, scale=0.6), Write(e3), run_time=0.7)
        self.at(14.2)
        km = ValueTracker(0)
        res = always_redraw(lambda: T("= " + fmt(km.get_value(), 1) + " km", 140, AM).move_to(P(480, 900)))
        self.add(res)
        self.play(km.animate.set_value(11.4), run_time=0.9)
        self.at(14.8)
        self.play(FadeOut(VGroup(e1, e2, e3)), FadeOut(res), run_time=0.3)

    # ---------- D · el mapa ----------
    def mapa(self):
        cx, cy, w, h = 490, 710, 800, 760
        frame = RoundedRectangle(corner_radius=0.35, width=w / 120, height=h / 120, color=WH, stroke_width=3).move_to(P(cx, cy))
        grid = VGroup()
        for i in range(5):
            grid.add(Line(P(150 + i * 170, 330), P(150 + i * 170, 1090), color="#35508f", stroke_width=3))
        for i in range(5):
            grid.add(Line(P(90, 420 + i * 150), P(890, 420 + i * 150), color="#35508f", stroke_width=3))
        park = Rectangle(width=1.3, height=1.05, color=GR, stroke_width=3).move_to(P(150 + 2 * 170 + 90, 505))
        hx, hy = 200, 940
        house = VGroup(Polygon(P(hx - 34, hy - 6), P(hx, hy - 40), P(hx + 34, hy - 6), color=RD, stroke_width=4), Rectangle(width=0.43, height=0.32, color=AM, stroke_width=4).move_to(P(hx, hy + 14)))
        kpx, ang = 76, np.radians(-28)
        days = ValueTracker(0)

        def dpos():
            d = days.get_value()
            return P(hx + np.cos(ang) * d * kpx, hy + np.sin(ang) * d * kpx)

        dot = always_redraw(lambda: VGroup(Circle(radius=0.26, color=WH, fill_color="#4aa8ff", fill_opacity=1, stroke_width=5), Circle(radius=0.42, color=CY, stroke_width=2).set_opacity(0.4)).move_to(dpos()))
        trail = always_redraw(lambda: DashedLine(P(hx, hy), dpos(), color=RD, stroke_width=6, dash_length=0.18) if days.get_value() > 0.02 else VGroup())
        kmlab = always_redraw(lambda: T(fmt(round(days.get_value() * 114) / 10, 1) + " km", 36, RD).next_to(dpos(), UR, buff=0.18) if days.get_value() > 0.02 else VGroup())
        dn = always_redraw(lambda: T("DÍA " + str(max(1, min(5, int(days.get_value() + 0.35)))), 44, AM).move_to(P(210, 395)))
        scale = VGroup(Line(P(140, 1048), P(207, 1048), color=WH, stroke_width=4), T("10 km", 26, WH).move_to(P(173, 1020)))
        mp = VGroup(frame, grid, park, house, scale)
        tt = self.title("11 KM DE ERROR AL DÍA", MG, 15.1, Create(frame), Create(grid), FadeIn(park), FadeIn(house), FadeIn(scale))
        self.add(trail, dot, kmlab)
        self.at(16.2)
        self.play(days.animate(rate_func=rate_functions.ease_out_back).set_value(1), FadeIn(dn), run_time=0.6)
        for t, v in [(19.6, 2), (20.5, 3), (21.4, 4), (22.3, 5)]:
            self.at(t)
            self.play(days.animate(rate_func=rate_functions.ease_out_back).set_value(v), run_time=0.6)
        self.at(23.2)
        self.play(Flash(dpos(), color=RD, flash_radius=1.2, run_time=0.8), mp.animate.scale(1.0), run_time=0.9)
        self.at(24.7)
        self.play(FadeOut(VGroup(mp, trail, dot, kmlab, dn, tt)), run_time=0.3)

    # ---------- E · la solución ----------
    def solucion(self):
        panel = RoundedRectangle(corner_radius=0.35, width=7.0, height=2.1, color=CY, stroke_width=4).move_to(P(480, 560))
        lab = T("FRECUENCIA DEL RELOJ", 30, DM).move_to(P(480, 500))
        dig = T("10,23000000000 MHz", 62, CY).move_to(P(480, 610))
        tt = self.title("LA SOLUCIÓN: AJUSTAR EL RELOJ", CY, 25.1, Create(panel), FadeIn(lab), Write(dig))
        self.at(27.1)
        rocket = VGroup(
            Polygon(P(0, -130), P(46, -60), P(40, 70), P(-40, 70), P(-46, -60), color=WH, stroke_width=5),
            Circle(radius=0.17, color=CY, stroke_width=5).move_to(P(0, -30)),
            Polygon(P(-40, 70), P(-90, 120), P(-36, 40), color=RD, stroke_width=4),
            Polygon(P(40, 70), P(90, 120), P(36, 40), color=RD, stroke_width=4),
        ).move_to(P(480, 960))
        flame = Polygon(P(-26, 76), P(26, 76), P(0, 140), color=AM, stroke_width=4).next_to(rocket, DOWN, buff=-0.15)
        self.play(FadeIn(rocket, shift=UP * 0.3), run_time=0.5)
        self.play(rocket.animate.shift(UP * 1.0), FadeIn(flame), run_time=1.0)
        self.at(29.0)
        self.play(Transform(dig, T("10,22999999543 MHz", 62, CY).move_to(dig)), run_time=0.8)
