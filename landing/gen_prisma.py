# -*- coding: utf-8 -*-
"""Genera el SVG del prisma resolviendo Snell en las dos caras."""
import math

def norm(v):
    m = math.hypot(*v); return (v[0]/m, v[1]/m)
def dot(a, b):
    return a[0]*b[0] + a[1]*b[1]
def refractar(I, N, eta):
    cosi = -dot(N, I)
    assert cosi > 0
    k = 1 - eta*eta*(1 - cosi*cosi)
    if k < 0: return None
    return norm((eta*I[0] + (eta*cosi - math.sqrt(k))*N[0],
                 eta*I[1] + (eta*cosi - math.sqrt(k))*N[1]))
def cruce(p, d, a, b):
    ex, ey = b[0]-a[0], b[1]-a[1]
    t = ((a[0]-p[0])*ey - (a[1]-p[1])*ex) / (d[0]*ey - d[1]*ex)
    return (p[0]+t*d[0], p[1]+t*d[1])

# --- prisma equilatero, vertice arriba -------------------------------------
CX, APEX_Y, SEMI = 330.0, 78.0, 58.0
APEX = (CX, APEX_Y)
BI = (CX-SEMI, APEX_Y + SEMI*math.sqrt(3))
BD = (CX+SEMI, APEX_Y + SEMI*math.sqrt(3))
N_IZQ = norm((-(BI[1]-APEX[1]), BI[0]-APEX[0]))
N_DER = norm((BD[1]-APEX[1], -(BD[0]-APEX[0])))

# --- rayo incidente ---------------------------------------------------------
THETA1 = math.radians(60.0)
phi = math.atan2(-N_IZQ[1], -N_IZQ[0]) - THETA1
D_IN = (math.cos(phi), math.sin(phi))
inc = math.degrees(math.acos(dot(D_IN, (-N_IZQ[0], -N_IZQ[1]))))
assert abs(inc - 60.0) < 1e-9, inc
ENTRADA = ((BI[0]+APEX[0])/2, (BI[1]+APEX[1])/2)

# n_azul > n_verde > n_rojo: el orden real. La separacion esta exagerada
# (en vidrio real seria ~0.01 y el abanico ~1 grado, invisible en un dibujo).
# Mismos tonos que la app pero un escalon mas claros, para no romper el
# pastel de la pagina: rojo/verde/azul 400 en vez de 500.
VIDRIOS = [("Key", "#f87171", 1.47), ("Value", "#4ade80", 1.59), ("Query", "#60a5fa", 1.71)]
X_PANT = 545.0

rayos = []
for nombre, color, n in VIDRIOS:
    d1 = refractar(D_IN, N_IZQ, 1.0/n); assert d1
    p2 = cruce(ENTRADA, d1, APEX, BD)
    d2 = refractar(d1, (-N_DER[0], -N_DER[1]), n)
    assert d2, "%s: reflexion total interna" % nombre
    t = (X_PANT - p2[0]) / d2[0]
    p3 = (p2[0] + t*d2[0], p2[1] + t*d2[1])
    rayos.append((nombre, color, n, p2, p3,
                  math.degrees(math.acos(dot(D_IN, d2)))))

# --- panel de entrada -------------------------------------------------------
LADO = 116.0
x_borde = 196.0
t = (x_borde - ENTRADA[0]) / D_IN[0]
INICIO = (ENTRADA[0] + t*D_IN[0], ENTRADA[1] + t*D_IN[1])
PX, PY = x_borde - LADO, INICIO[1] - LADO/2

# --- pantalla ---------------------------------------------------------------
ys = [r[4][1] for r in rayos]
SY0, SY1 = min(ys) - 34, max(ys) + 34
SX1 = 690.0

f = lambda v: ("%.1f" % v).rstrip("0").rstrip(".")
L = []
w = L.append

# la caja tiene que contener todo: vertice, panel de entrada y pantalla
vb_y0 = min(APEX_Y, PY, SY0) - 22
vb_y1 = max(PY + LADO, SY1) + 12
w('<svg class="prisma" viewBox="0 %s 700 %s" role="img" aria-labelledby="tit-prisma">'
  % (f(vb_y0), f(vb_y1 - vb_y0)))
w('  <title id="tit-prisma">Las letras Q, K y V superpuestas entran a un prisma como un solo haz'
  ' y salen separadas: Key en rojo, Value en verde y Query en azul, cada una desviada segun su'
  ' indice de refraccion.</title>')
w('  <defs>')
w('    <linearGradient id="haz" gradientUnits="userSpaceOnUse" x1="%s" y1="%s" x2="%s" y2="%s">'
  % (f(INICIO[0]), f(INICIO[1]), f(ENTRADA[0]), f(ENTRADA[1])))
w('      <stop offset="0" stop-color="#e6ecf4" /><stop offset="1" stop-color="#c9d4e2" />')
w('    </linearGradient>')
w('  </defs>')

# panel de entrada: las tres letras superpuestas, mezcladas en modo aditivo
# Entrada: las tres letras superpuestas, en triangulo, translucidas. Sobre
# fondo claro no se puede hacer suma aditiva (screen sobre blanco da blanco),
# asi que los cruces se ven por transparencia y no por mezcla de luz.
cx_p, cy_p = PX + LADO/2, PY + LADO/2
RADIO = 13.0
import math as _m
_pos = [("K", VIDRIOS[0][1], 90.0), ("V", VIDRIOS[1][1], 210.0), ("Q", VIDRIOS[2][1], 330.0)]
for letra, color, ang in _pos:
    dx = RADIO * _m.cos(_m.radians(ang))
    dy = -RADIO * _m.sin(_m.radians(ang))
    w('  <text x="%s" y="%s" class="letra" fill="%s" opacity="0.72">%s</text>'
      % (f(cx_p + dx), f(cy_p + dy), color, letra))

# haz de entrada
w('  <path d="M%s %s L%s %s" stroke="url(#haz)" stroke-width="11" stroke-linecap="round" fill="none" />'
  % (f(INICIO[0]), f(INICIO[1]), f(ENTRADA[0]), f(ENTRADA[1])))

# cuerpo del prisma
w('  <path d="M%s %s L%s %s L%s %s Z" fill="rgba(255,255,255,.35)" stroke="#b8c4d4" stroke-width="2" stroke-linejoin="round" />'
  % (f(APEX[0]), f(APEX[1]), f(BD[0]), f(BD[1]), f(BI[0]), f(BI[1])))

# rayos: tramo interno + tramo de salida, y la letra proyectada
for nombre, color, n, p2, p3, dev in rayos:
    w('  <path d="M%s %s L%s %s L%s %s" stroke="%s" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" />'
      % (f(ENTRADA[0]), f(ENTRADA[1]), f(p2[0]), f(p2[1]), f(p3[0]), f(p3[1]), color))
for nombre, color, n, p2, p3, dev in rayos:
    w('  <text x="%s" y="%s" class="letra proyectada" fill="%s">%s</text>'
      % (f(p3[0] + 38), f(p3[1]), color, nombre[0]))
    w('  <text x="%s" y="%s" class="rotulo" fill="%s">%s</text>'
      % (f(p3[0] + 72), f(p3[1]), color, nombre))
w('</svg>')

open("prisma.svg", "w", encoding="utf-8").write("\n".join(L) + "\n")

print("incidencia %.1f grados" % inc)
for nombre, color, n, p2, p3, dev in rayos:
    print("  %-6s n=%.3f  desviacion %.2f grados  ->  y=%.1f" % (nombre, n, dev, p3[1]))
print("orden vertical:", " / ".join(r[0] for r in sorted(rayos, key=lambda r: r[4][1])))
print("viewBox 0 %s 700 %s" % (f(vb_y0), f(vb_y1-vb_y0)))
