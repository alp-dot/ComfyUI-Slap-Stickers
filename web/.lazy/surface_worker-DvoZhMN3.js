const K = (e, t) => e[0] * t[0] + e[1] * t[1] + e[2] * t[2], ue = (e, t) => e.map((a, c) => a + t[c]), we = (e, t) => e.map((a, c) => a - t[c]), k = (e, t) => e.map((a) => a * t), ye = (e) => Math.sqrt(K(e, e)) > 1e-12 ? k(e, 1 / Math.sqrt(K(e, e))) : [0, 0, 0], Ae = (e, t) => [e[1] * t[2] - e[2] * t[1], e[2] * t[0] - e[0] * t[2], e[0] * t[1] - e[1] * t[0]], Ee = (e, t) => e.map((a) => K(a, t));
function Oe(e, t, a, c, r, o, n = [0, 0]) {
  const i = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([h, u]) => ue(e, ue(k(t, h * c / 2), k(a, u * r / 2)))), s = 0.05 * e[2], g = [], M = (h) => {
    const u = Ee(o, h);
    return [u[0] / u[2] + n[0], u[1] / u[2] + n[1]];
  };
  i.forEach((h, u) => {
    const f = i[(u + 1) % 4];
    h[2] >= s && g.push(h), h[2] >= s != f[2] >= s && g.push(ue(h, k(we(f, h), (s - h[2]) / (f[2] - h[2]))));
  });
  const y = ue(e, k(a, -r / 2)), m = M(e), p = Ee(o, e), l = Ee(o, k(a, -1));
  return { corners: g.map(M), handles: i.map((h) => h[2] >= s ? M(h) : null), center: m, top: y[2] >= s ? M(y) : null, up: [l[0] * p[2] - p[0] * l[2], l[1] * p[2] - p[1] * l[2]] };
}
function Ne(e) {
  const t = [Ae(e[1], e[2]), Ae(e[2], e[0]), Ae(e[0], e[1])], a = K(e[0], t[0]);
  return [0, 1, 2].map((c) => [0, 1, 2].map((r) => t[r][c] / a));
}
function Ge(e) {
  const t = e.map((r) => [...r]), a = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let r = 0; r < 24 && !(Math.max(Math.abs(t[0][1]), Math.abs(t[0][2]), Math.abs(t[1][2])) <= 1e-14 * Math.max(1, Math.abs(t[0][0] + t[1][1] + t[2][2]))); r++)
    for (const [o, n] of [[0, 1], [0, 2], [1, 2]]) {
      if (Math.abs(t[o][n]) < 1e-30) continue;
      const i = 0.5 * Math.atan2(2 * t[o][n], t[n][n] - t[o][o]), s = Math.cos(i), g = Math.sin(i), M = t[o][o], y = t[n][n], m = t[o][n];
      for (let p = 0; p < 3; p++) {
        if (p !== o && p !== n) {
          const u = t[p][o], f = t[p][n];
          t[p][o] = t[o][p] = s * u - g * f, t[p][n] = t[n][p] = g * u + s * f;
        }
        const l = a[p][o], h = a[p][n];
        a[p][o] = s * l - g * h, a[p][n] = g * l + s * h;
      }
      t[o][o] = s * s * M - 2 * g * s * m + g * g * y, t[n][n] = g * g * M + 2 * g * s * m + s * s * y, t[o][n] = t[n][o] = 0;
    }
  let c = 0;
  for (let r = 1; r < 3; r++) t[r][r] < t[c][c] && (c = r);
  return ye(a.map((r) => r[c]));
}
function Ue(e, t, a, c = null, r = !1) {
  const { width: o, height: n, points: i, normals: s, valid: g } = e, M = (d) => [i[d * 3], i[d * 3 + 1], i[d * 3 + 2]], y = (d) => [s[d * 3], s[d * 3 + 1], s[d * 3 + 2]], [m, p] = t.anchor;
  let l = Math.min(n - 1, Math.floor(p * n)), h = Math.min(o - 1, Math.floor(m * o)), u = l * o + h;
  if (!g[u]) {
    let d = 1 / 0, T = -1;
    for (let N = 0; N < o * n; N++) if (g[N]) {
      const B = (Math.floor(N / o) - l) ** 2 + (N % o - h) ** 2;
      B < d && (d = B, T = N);
    }
    if (T < 0 || d > 100 ** 2) return null;
    u = T, l = Math.floor(u / o), h = u % o;
  }
  const f = t.edge, w = (d, T) => g[d] && g[T] && Math.abs(i[d * 3 + 2] - i[T * 3 + 2]) <= f * Math.min(i[d * 3 + 2], i[T * 3 + 2]), S = c !== null ? c * e.intrinsics[0][0] / i[u * 3 + 2] : t.size, _ = Math.min(32, Math.max(3, Math.floor(0.25 * Math.min(S * o, S * o / a) + 0.5))), x = Math.max(0, h - _), D = Math.min(o - 1, h + _), U = Math.max(0, l - _), ee = Math.min(n - 1, l + _);
  let z = [u];
  const te = new Set(z);
  for (let d = 0; d < z.length; d++) {
    const T = z[d], N = Math.floor(T / o), B = T % o;
    for (const [J, he] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const re = B + J, oe = N + he, Z = oe * o + re;
      re >= x && re <= D && oe >= U && oe <= ee && !te.has(Z) && w(T, Z) && (te.add(Z), z.push(Z));
    }
  }
  const $ = [...te].sort((d, T) => d - T);
  let X, R;
  if ($.length >= 6) {
    X = [0, 0, 0];
    for (const T of $) X = ue(X, M(T));
    X = k(X, 1 / $.length);
    const d = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (const T of $) {
      const N = we(M(T), X);
      for (let B = 0; B < 3; B++) for (let J = 0; J < 3; J++) d[B][J] += N[B] * N[J];
    }
    R = Ge(d);
  } else
    X = M(u), R = ye(y(u)), R.some(Boolean) || (R = k(ye(M(u)), -1));
  K(R, M(u)) > 0 && (R = k(R, -1));
  const Te = Ne(e.intrinsics), pe = Ee(Te, [m, p, 1]), Me = K(R, pe), ne = Math.abs(Me) / Math.sqrt(K(pe, pe)) < 0.05;
  let C = ne ? M(u) : k(pe, K(R, X) / Me);
  C[2] <= 0 && (C = M(u));
  const ae = Ee(Te, [m, p - 1 / n, 1]), se = K(R, ae), xe = Math.abs(se) > 1e-12 ? k(ae, K(R, X) / se) : [0, 0, 0];
  let H = ye(we(xe, C));
  (ne || xe[2] <= 0 || !H.some(Boolean)) && (H = we([0, -1, 0], k(R, K(R, [0, -1, 0]))), Math.sqrt(K(H, H)) < 1e-6 && (H = we([0, 0, 1], k(R, R[2]))), H = ye(H));
  const me = k(H, -1), ce = Ae(R, me), v = t.rotation * Math.PI / 180, E = Math.cos(v), b = Math.sin(v), A = ue(k(ce, E), k(me, b)), j = ue(k(ce, -b), k(me, E)), V = c ?? t.size * C[2] / e.intrinsics[0][0], O = V / a, { corners: I } = Oe(C, A, j, V, O, e.intrinsics), P = [Math.max(0, Math.min(...I.map((d) => d[0]))), Math.max(0, Math.min(...I.map((d) => d[1]))), Math.min(1, Math.max(...I.map((d) => d[0]))), Math.min(1, Math.max(...I.map((d) => d[1])))];
  if (r) return { p0: C, n: R, e1: A, e2: j, w: V, h: O, bounds: P, corners: I, cell: u };
  const [G, q, W, L] = [Math.floor(P[0] * o) - 2, Math.floor(P[1] * n) - 2, Math.ceil(P[2] * o) + 2, Math.ceil(P[3] * n) + 2], Q = new Uint8Array(o * n), Y = new Uint8Array(o * n);
  z = [u], Y[u] = 1;
  for (let d = 0; d < z.length; d++) {
    const T = z[d], N = Math.floor(T / o), B = T % o;
    if (!(B < G || B > W || N < q || N > L || Math.abs(K(R, we(M(T), C))) > 0.03 * i[T * 3 + 2])) {
      Q[T] = 1;
      for (let J = -1; J <= 1; J++) for (let he = -1; he <= 1; he++) {
        const re = B + he, oe = N + J, Z = oe * o + re;
        !he && !J || re < 0 || re >= o || oe < 0 || oe >= n || Y[Z] || !w(T, Z) || he && J && ![[T, N * o + re], [T, oe * o + B], [Z, N * o + re], [Z, oe * o + B]].every(([Ce, Be]) => w(Ce, Be)) || (Y[Z] = 1, z.push(Z));
      }
    }
  }
  return { p0: C, n: R, e1: A, e2: j, w: V, h: O, region: Q, bounds: P, corners: I, cell: u };
}
function qe(e, t) {
  const a = t.grid_w, c = t.grid_h, r = a * c;
  if (t.format !== 1 || !Number.isInteger(a) || !Number.isInteger(c) || a < 1 || c < 1 || e.byteLength !== r * 25) throw new Error("The surface data is incomplete. Run the workflow again.");
  const o = new DataView(e), n = new Float32Array(r * 3), i = new Float32Array(r * 3);
  for (let s = 0; s < r * 3; s++)
    n[s] = o.getFloat32(s * 4, !0), i[s] = o.getFloat32(r * 12 + s * 4, !0);
  return { width: a, height: c, points: n, normals: i, valid: new Uint8Array(e.slice(r * 24)), intrinsics: t.intrinsics };
}
const Ie = /* @__PURE__ */ new WeakMap(), Se = [-1, 0, 1, -1, 1, -1, 0, 1], _e = [-1, -1, -1, 0, 0, 1, 1, 1];
function be(e, t = 0.04) {
  const { width: a, height: c, points: r, valid: o } = e, n = a * c;
  let i = Ie.get(e);
  if (!i) {
    const f = new Float64Array(n * 3);
    for (let w = 0; w < n; w++) {
      const S = w * 3, _ = Math.hypot(e.normals[S], e.normals[S + 1], e.normals[S + 2]);
      if (_ > 1e-12) for (let x = 0; x < 3; x++) f[S + x] = e.normals[S + x] / _;
    }
    i = { entries: /* @__PURE__ */ new Map(), workspace: { normals: f, offsets: Se.map((w, S) => w + _e[S] * a), dist: new Float64Array(n), basis: new Float64Array(n * 6), heap: new Int32Array(n), positions: new Int32Array(n) } }, Ie.set(e, i);
  }
  const { entries: s, workspace: g } = i;
  if (s.has(t)) return s.get(t);
  const M = new Uint8Array(n), { normals: y } = g, m = (f, w) => o[f] && o[w] && Math.abs(r[f * 3 + 2] - r[w * 3 + 2]) <= t * Math.min(r[f * 3 + 2], r[w * 3 + 2]);
  for (let f = 0; f < c; f++) for (let w = 0; w < a; w++) {
    const S = f * a + w;
    if (o[S])
      for (let _ = 0; _ < 8; _++) {
        const x = w + Se[_], D = f + _e[_], U = D * a + x;
        x < 0 || x >= a || D < 0 || D >= c || !m(S, U) || Se[_] && _e[_] && !(m(S, f * a + x) && m(S, D * a + w) && m(U, f * a + x) && m(U, D * a + w)) || (M[S] |= 1 << _);
      }
  }
  let p = !!o[0];
  const l = y.subarray(0, 3), h = r.subarray ? r.subarray(0, 3) : r.slice(0, 3);
  for (let f = 0; p && f < n; f++) {
    if (!o[f] || Math.abs(l[0] * (r[f * 3] - h[0]) + l[1] * (r[f * 3 + 1] - h[1]) + l[2] * (r[f * 3 + 2] - h[2])) > 1e-7 * r[f * 3 + 2]) {
      p = !1;
      break;
    }
    if (y[f * 3] * l[0] + y[f * 3 + 1] * l[1] + y[f * 3 + 2] * l[2] < 1 - 1e-12) {
      p = !1;
      break;
    }
    (f % a < a - 1 && !(M[f] & 16) || Math.floor(f / a) < c - 1 && !(M[f] & 64)) && (p = !1);
  }
  const u = { links: M, planar: p, ...g };
  return s.set(t, u), u;
}
function Xe(e, t, a, c = null) {
  const r = performance.now(), o = Ue(e, t, a, c, !0);
  if (!o) return null;
  const { width: n, height: i, points: s } = e, g = n * i, { links: M, normals: y, offsets: m, dist: p, basis: l, heap: h, positions: u } = be(e, t.edge), f = new Float64Array(g * 2), w = new Uint8Array(g), S = new Uint8Array(g), _ = performance.now();
  p.fill(1 / 0), u.fill(-1);
  const x = o.cell, D = 0.5 * Math.hypot(o.w, o.h) * 1.25, { n: U, e1: ee, e2: z, p0: te } = o;
  f[x * 2] = ee[0] * (s[x * 3] - te[0]) + ee[1] * (s[x * 3 + 1] - te[1]) + ee[2] * (s[x * 3 + 2] - te[2]), f[x * 2 + 1] = z[0] * (s[x * 3] - te[0]) + z[1] * (s[x * 3 + 1] - te[1]) + z[2] * (s[x * 3 + 2] - te[2]);
  let $ = 0;
  const X = (v, E) => p[v] < p[E] || p[v] === p[E] && v < E;
  function R(v) {
    let E = u[v];
    for (E < 0 && (E = $++, h[E] = v, u[v] = E); E; ) {
      const b = E - 1 >> 1, A = h[b];
      if (!X(v, A)) break;
      h[E] = A, u[A] = E, E = b;
    }
    h[E] = v, u[v] = E;
  }
  function Te() {
    const v = h[0], E = h[--$];
    if (u[v] = -1, $) {
      let b = 0;
      for (; b * 2 + 1 < $; ) {
        let A = b * 2 + 1;
        if (A + 1 < $ && X(h[A + 1], h[A]) && A++, !X(h[A], E)) break;
        h[b] = h[A], u[h[b]] = b, b = A;
      }
      h[b] = E, u[E] = b;
    }
    return v;
  }
  function pe(v) {
    const E = v * 3, b = v * 6;
    let A = y[E], j = y[E + 1], V = y[E + 2];
    (v === x || !(A || j || V)) && (A = U[0], j = U[1], V = U[2]);
    const O = A * U[0] + j * U[1] + V * U[2];
    if (O < 0) return !1;
    const I = U[1] * V - U[2] * j, P = U[2] * A - U[0] * V, G = U[0] * j - U[1] * A, q = 1 + O;
    for (let W = 0; W < 2; W++) {
      const L = W ? z : ee, Q = P * L[2] - G * L[1], Y = G * L[0] - I * L[2], d = I * L[1] - P * L[0], T = b + W * 3;
      l[T] = L[0] + Q + (P * d - G * Y) / q, l[T + 1] = L[1] + Y + (G * Q - I * d) / q, l[T + 2] = L[2] + d + (I * Y - P * Q) / q;
    }
    return !0;
  }
  p[x] = 0, R(x);
  const Me = performance.now();
  let ne = n, C = i, ae = 0, se = 0;
  for (; $; ) {
    const v = Te(), E = p[v];
    if (E > D) break;
    if (!pe(v)) continue;
    const b = v * 3, A = M[v];
    if (v !== x) {
      let O = 0, I = 0, P = 0;
      for (let G = 0; G < 8; G++) if (A & 1 << G) {
        const q = v + m[G];
        if (!w[q]) continue;
        const W = q * 3, L = q * 6, Q = s[b] - s[W], Y = s[b + 1] - s[W + 1], d = s[b + 2] - s[W + 2], T = 1 / Math.max(Math.sqrt(Q * Q + Y * Y + d * d), 1e-12);
        O += (f[q * 2] + l[L] * Q + l[L + 1] * Y + l[L + 2] * d) * T, I += (f[q * 2 + 1] + l[L + 3] * Q + l[L + 4] * Y + l[L + 5] * d) * T, P += T;
      }
      if (!P) continue;
      f[v * 2] = O / P, f[v * 2 + 1] = I / P;
    }
    w[v] = 1, Math.abs(f[v * 2]) <= o.w / 2 && Math.abs(f[v * 2 + 1]) <= o.h / 2 && (S[v] = 1);
    const j = v % n, V = Math.floor(v / n);
    ne = Math.min(ne, j), ae = Math.max(ae, j), C = Math.min(C, V), se = Math.max(se, V);
    for (let O = 0; O < 8; O++) if (A & 1 << O) {
      const I = v + m[O];
      if (w[I]) continue;
      const P = I * 3, G = s[P] - s[b], q = s[P + 1] - s[b + 1], W = s[P + 2] - s[b + 2], L = E + Math.sqrt(G * G + q * q + W * W);
      L < p[I] && L <= D && (p[I] = L, R(I));
    }
  }
  const xe = performance.now(), H = ae - ne + 1, me = se - C + 1, ce = new Float32Array(H * me * 4);
  for (let v = C; v <= se; v++) for (let E = ne; E <= ae; E++) {
    const b = v * n + E, A = ((v - C) * H + E - ne) * 4;
    w[b] && (ce[A] = f[b * 2], ce[A + 1] = f[b * 2 + 1], ce[A + 2] = s[b * 3 + 2], ce[A + 3] = 1);
  }
  return { ...o, timings: { frame: _ - r, setup: Me - _, walk: xe - Me, pack: performance.now() - xe }, xy: f, reached: w, region: S, field: ce, fieldRect: [ne, C, H, me], gridSize: [n, i], bounds: [Math.max(0, (ne - 0.5) / n), Math.max(0, (C - 0.5) / i), Math.min(1, (ae + 1.5) / n), Math.min(1, (se + 1.5) / i)] };
}
function Ve(e) {
  const t = Math.ceil(e.width / 2), a = Math.ceil(e.height / 2), c = t * a, r = new Float32Array(c * 3), o = new Float32Array(c * 3), n = new Uint8Array(c);
  for (let i = 0; i < a; i++) for (let s = 0; s < t; s++) {
    const g = Math.min(e.width - 1, Math.floor((s + 0.5) * e.width / t)), M = Math.min(e.height - 1, Math.floor((i + 0.5) * e.height / a)), y = i * t + s, m = M * e.width + g;
    r.set(e.points.subarray(m * 3, m * 3 + 3), y * 3), o.set(e.normals.subarray(m * 3, m * 3 + 3), y * 3), n[y] = e.valid[m];
  }
  return { width: t, height: a, points: r, normals: o, valid: n, intrinsics: e.intrinsics };
}
function De(e) {
  const { width: t, height: a, points: c, valid: r } = e, o = new Float32Array(t * a);
  for (let n = 0; n < a; n++) for (let i = 0; i < t; i++) {
    const s = n * t + i;
    if (!r[s]) continue;
    let g = c[s * 3 + 2], M = g;
    for (let y = -1; y <= 1; y++) for (let m = -1; m <= 1; m++) {
      const p = Math.max(0, Math.min(a - 1, n + y)) * t + Math.max(0, Math.min(t - 1, i + m));
      r[p] && (g = Math.min(g, c[p * 3 + 2]), M = Math.max(M, c[p * 3 + 2]));
    }
    o[s] = (M - g) / c[s * 3 + 2];
  }
  return o;
}
function We(e, t, a, c = null) {
  if (t.mode !== "wrap") return Ue(e, t, a, c);
  if (!be(e, t.edge).planar) return Xe(e, t, a, c);
  const r = Ue(e, t, a, c);
  if (!r) return null;
  for (let o = 0; o < r.region.length; o++) if (r.region[o]) {
    const n = o * 3, i = e.points[n] - r.p0[0], s = e.points[n + 1] - r.p0[1], g = e.points[n + 2] - r.p0[2];
    (Math.abs(i * r.e1[0] + s * r.e1[1] + g * r.e1[2]) > r.w / 2 || Math.abs(i * r.e2[0] + s * r.e2[1] + g * r.e2[2]) > r.h / 2) && (r.region[o] = 0);
  }
  return r.planeShortcut = !0, r;
}
let F = null;
const ge = /* @__PURE__ */ new Map(), Pe = /* @__PURE__ */ new WeakMap(), ke = /* @__PURE__ */ new WeakMap();
function Fe(e) {
  let t = Pe.get(e);
  return t || (t = Uint8Array.from(e, (a) => a ? 255 : 0), Pe.set(e, t)), t;
}
const Ke = `#version 300 es
out vec2 uv;
void main(){ vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2)); uv=vec2(p.x,1.-p.y); gl_Position=vec4(p*2.-1.,0.,1.); }`, He = `#version 300 es
precision highp float;
in vec2 uv; out vec4 outputColor;
uniform sampler2D picture, points, valid, region, light, warp, spread, appearance;
uniform bool wrapped,materialized;
uniform mat3 inverseK;
uniform vec3 p0,n,e1,e2;
uniform vec2 size,gridSize,mapGrid;
uniform vec4 fieldRect;
uniform float opacity,edge,shading,lref;
vec4 mapTexel(ivec2 p){
 if(any(lessThan(p,ivec2(0)))||any(greaterThanEqual(p,ivec2(fieldRect.zw))))return vec4(0.);
 return texelFetch(warp,p,0);
}
vec4 mapAt(vec2 v){
 vec2 p=v*mapGrid-.5-fieldRect.xy,f=fract(p);ivec2 i=ivec2(floor(p));
 vec4 a=mapTexel(i),b=mapTexel(i+ivec2(1,0)),c=mapTexel(i+ivec2(0,1)),d=mapTexel(i+ivec2(1,1));
 return a*((1.-f.x)*(1.-f.y))+b*(f.x*(1.-f.y))+c*((1.-f.x)*f.y)+d*(f.x*f.y);
}
vec2 textureUV(vec2 v){
 vec2 xy;
 if(wrapped){vec4 q=mapAt(v);if(q.a<=0.)return vec2(-10.);xy=q.xy/q.a;}
 else{vec3 ray=inverseK*vec3(v,1.);float t=dot(n,p0)/dot(n,ray);if(t<=0.)return vec2(-10.);vec3 q=ray*t-p0;xy=vec2(dot(q,e1),dot(q,e2));}
 return xy/size+.5;
}
vec3 linearize(vec3 v){return mix(v/12.92,pow((v+.055)/1.055,vec3(2.4)),step(vec3(.04045),v));}
vec3 srgb(vec3 v){return mix(v*12.92,1.055*pow(max(v,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),v));}
void main(){
 vec2 geometryUV=uv;
 if(any(lessThan(geometryUV,vec2(0.)))||any(greaterThan(geometryUV,vec2(1.))))discard;
 if(texture(valid,geometryUV).r<.5)discard;
 vec3 p=texture(points,geometryUV).rgb;
 if(texture(spread,geometryUV).r>edge)discard;
 if(wrapped){vec4 q=mapAt(geometryUV);if(q.a<=0.||abs(p.z-q.z/q.a)>edge*p.z)discard;}
 else{
  float allowed=0.;ivec2 cell=ivec2(floor(geometryUV*gridSize));
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
   vec2 q=(vec2(clamp(cell+ivec2(x,y),ivec2(0),ivec2(gridSize)-1))+.5)/gridSize;
   allowed=max(allowed,texture(region,q).r);
  }
  if(allowed<.5||abs(dot(n,p-p0))>${0.03}*p.z)discard;
 }
 vec2 st=textureUV(uv),dx=dFdx(st),dy=dFdy(st);vec2 margin=abs(dx)+abs(dy);
 float coverage=all(greaterThan(st,margin))&&all(lessThan(st,vec2(1.)-margin))?1.:0.;
 // Subpixel coverage only at the outline; derivatives avoid repeated surface lookups.
 if(coverage==0.)for(int y=0;y<4;y++) for(int x=0;x<4;x++){
   vec2 sub=st+dx*(float(x)-1.5)*.25+dy*(float(y)-1.5)*.25;
   if(all(greaterThanEqual(sub,vec2(0.)))&&all(lessThanEqual(sub,vec2(1.)))) coverage+=.0625;
 }
 if(coverage<=0.) discard;
 vec4 color=texture(picture,clamp(st,vec2(0.),vec2(1.)));
 color.rgb=color.a>1e-6?color.rgb/color.a:vec3(0.);
 float k=1.+shading*(clamp(texture(light,uv).r/max(lref,.0001),0.,2.)-1.);
 vec3 gain=vec3(k);
 if(materialized){vec4 field=texture(appearance,uv);gain*=mix(vec3(1.),field.rgb,shading)*(1.+shading*(field.a-1.));}
 color.rgb=srgb(clamp(linearize(color.rgb)*gain,0.,1.));
 outputColor=vec4(color.rgb,color.a*coverage*opacity);
}`;
function je() {
  const e = typeof document > "u" ? new OffscreenCanvas(1, 1) : document.createElement("canvas"), t = e.getContext("webgl2", { alpha: !0, premultipliedAlpha: !0, antialias: !1, preserveDrawingBuffer: !0 });
  if (!t) throw new Error("WebGL2 is unavailable. Enable hardware acceleration and reload the page.");
  const a = t.createProgram();
  for (const [o, n] of [[t.VERTEX_SHADER, Ke], [t.FRAGMENT_SHADER, He]]) {
    const i = t.createShader(o);
    if (t.shaderSource(i, n), t.compileShader(i), !t.getShaderParameter(i, t.COMPILE_STATUS)) throw new Error(t.getShaderInfoLog(i));
    t.attachShader(a, i), t.deleteShader(i);
  }
  if (t.linkProgram(a), !t.getProgramParameter(a, t.LINK_STATUS)) throw new Error(t.getProgramInfoLog(a));
  t.useProgram(a);
  const c = /* @__PURE__ */ new Map(), r = (o) => (c.has(o) || c.set(o, t.getUniformLocation(a, o)), c.get(o));
  return e.addEventListener("webglcontextlost", (o) => {
    o.preventDefault();
  }), { canvas: e, gl: t, program: a, location: r };
}
function le(e, t, a, c, r = 4, o = !1) {
  const { gl: n } = F;
  if (ge.has(e)) return ge.get(e);
  const i = n.getParameter(n.TEXTURE_BINDING_2D), s = n.createTexture();
  if (n.bindTexture(n.TEXTURE_2D, s), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, o ? n.LINEAR : n.NEAREST), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, o ? n.LINEAR : n.NEAREST), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE), n.pixelStorei(n.UNPACK_ALIGNMENT, 1), r === 4 && ArrayBuffer.isView(c)) {
    const g = c instanceof Float32Array;
    n.texImage2D(n.TEXTURE_2D, 0, g ? n.RGBA32F : n.RGBA, t, a, 0, n.RGBA, g ? n.FLOAT : n.UNSIGNED_BYTE, c);
  } else if (r === 4) {
    const g = new OffscreenCanvas(t, a);
    g.getContext("2d").drawImage(c, 0, 0);
    const M = n.getParameter(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
    n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
    try {
      n.texImage2D(n.TEXTURE_2D, 0, n.RGBA, n.RGBA, n.UNSIGNED_BYTE, g);
    } finally {
      n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, M);
    }
  } else {
    const g = c instanceof Float32Array;
    n.texImage2D(n.TEXTURE_2D, 0, r === 3 ? n.RGB32F : g ? n.R32F : n.R8, t, a, 0, r === 3 ? n.RGB : n.RED, g ? n.FLOAT : n.UNSIGNED_BYTE, c);
  }
  return ge.set(e, s), n.bindTexture(n.TEXTURE_2D, i), s;
}
function fe(e, t, a) {
  const { gl: c, location: r } = F;
  c.activeTexture(c.TEXTURE0 + e), c.bindTexture(c.TEXTURE_2D, a), c.uniform1i(r(t), e);
}
function ie(e) {
  ge.has(e) && (F == null || F.gl.deleteTexture(ge.get(e)), ge.delete(e));
}
function Ye(e) {
  ie(e.grid.points), ie(e.grid.valid), ie(e.light), ie(e.material), ie(e.spread);
}
function Je() {
  var e;
  if (F) {
    for (const t of [...ge.keys()]) ie(t);
    F.gl.deleteProgram(F.program), (e = F.gl.getExtension("WEBGL_lose_context")) == null || e.loseContext(), F = null;
  }
}
function $e(e, t) {
  const a = Math.min(e.width / t.image_w, e.height / t.image_h), c = Math.round(t.image_w * a), r = Math.round(t.image_h * a);
  return { left: (e.width - c) / 2, top: (e.height - r) / 2, width: c, height: r };
}
function Qe(e, t, a, c, r) {
  const o = ke.get(t), n = [r.width, r.height, c.opacity, c.shading, c.edge, t.lref].join(",");
  if ((o == null ? void 0 : o.key) === n && o.source === a) return o;
  F ?? (F = je());
  const { gl: i, location: s } = F;
  if (i.isContextLost()) throw new Error("The image display stopped. Reload the page to restore it.");
  F.canvas.width !== r.width && (F.canvas.width = r.width), F.canvas.height !== r.height && (F.canvas.height = r.height), i.viewport(0, 0, r.width, r.height), i.useProgram(F.program), i.disable(i.SCISSOR_TEST), i.clearColor(0, 0, 0, 0), i.clear(i.COLOR_BUFFER_BIT), i.enable(i.BLEND), i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
  const g = Ne(e.grid.intrinsics);
  i.uniformMatrix3fv(s("inverseK"), !1, new Float32Array([0, 1, 2].flatMap((x) => [0, 1, 2].map((D) => g[D][x])))), i.uniform2f(s("gridSize"), e.grid.width, e.grid.height), fe(0, "picture", le(a, a.width, a.height, a, 4, !0)), fe(1, "points", le(e.grid.points, e.grid.width, e.grid.height, e.grid.points, 3)), fe(2, "valid", le(e.grid.valid, e.grid.width, e.grid.height, Fe(e.grid.valid), 1)), fe(4, "light", le(e.light, e.image.width, e.image.height, e.light, 1)), i.uniform1i(s("materialized"), !!e.material), e.material && fe(7, "appearance", le(e.material, e.image.width, e.image.height, e.material, 4)), e.spread ?? (e.spread = De(e.grid)), fe(6, "spread", le(e.spread, e.grid.width, e.grid.height, e.spread, 1));
  const [M, y] = t.gridSize ?? [e.grid.width, e.grid.height];
  i.uniform1i(s("wrapped"), !!t.field), t.field && (i.uniform4fv(s("fieldRect"), t.fieldRect), i.uniform2f(s("mapGrid"), M, y), fe(5, "warp", le(t.field, t.fieldRect[2], t.fieldRect[3], t.field, 4))), fe(3, "region", le(t.region, M, y, Fe(t.region), 1));
  for (const x of ["p0", "n", "e1", "e2"]) i.uniform3fv(s(x), t[x]);
  i.uniform2f(s("size"), t.w, t.h);
  for (const [x, D] of Object.entries({ opacity: c.opacity, edge: c.edge, shading: c.shading, lref: t.lref ?? 1 })) i.uniform1f(s(x), D);
  const m = t.bounds, p = Math.max(0, Math.floor(m[0] * r.width) - 2), l = Math.min(r.width, Math.ceil(m[2] * r.width) + 2), h = Math.max(0, Math.floor(m[1] * r.height) - 2), u = Math.min(r.height, Math.ceil(m[3] * r.height) + 2), f = Math.max(1, l - p), w = Math.max(1, u - h);
  i.enable(i.SCISSOR_TEST), i.scissor(p, r.height - u, f, w), i.drawArrays(i.TRIANGLES, 0, 3), i.disable(i.SCISSOR_TEST);
  const S = new OffscreenCanvas(f, w);
  S.getContext("2d").drawImage(F.canvas, p, h, f, w, 0, 0, f, w);
  const _ = { key: n, source: a, canvas: S, left: p, top: h };
  return ke.set(t, _), _;
}
function ze(e, t, a, c, r) {
  const o = $e({ width: r[0], height: r[1] }, e.meta), n = Qe(e, t, a, c, o), i = n.canvas.transferToImageBitmap();
  return ie(t.region), t.field && ie(t.field), { bitmap: i, bitmapRect: [n.left, n.top], bitmapBox: [o.width, o.height] };
}
const Re = Float32Array.from({ length: 256 }, (e, t) => (t /= 255) <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4);
function Ze(e, t, a) {
  const c = t * a, r = new Float32Array(c);
  let o = new Float32Array(c * 3), n = new Float32Array(c * 3);
  for (let l = 0; l < c; l++) {
    const h = Re[e[l * 4]], u = Re[e[l * 4 + 1]], f = Re[e[l * 4 + 2]];
    o[l * 3] = h, o[l * 3 + 1] = u, o[l * 3 + 2] = f, r[l] = 0.2126 * h + 0.7152 * u + 0.0722 * f;
  }
  const i = Math.min(t, a) * 0.015, s = Math.max(1, Math.ceil(i * 3)), g = Array.from({ length: s * 2 + 1 }, (l, h) => Math.exp(-((h - s) ** 2) / (2 * i * i))), M = g.reduce((l, h) => l + h, 0);
  for (let l = 0; l < g.length; l++) g[l] /= M;
  for (const l of [0, 1]) {
    for (let h = 0; h < a; h++) for (let u = 0; u < t; u++) {
      let f = 0, w = 0, S = 0;
      for (let x = -s; x <= s; x++) {
        const D = l === 0 ? Math.min(t - 1, Math.max(0, u + x)) : u, U = l === 1 ? Math.min(a - 1, Math.max(0, h + x)) : h, ee = (U * t + D) * 3, z = g[x + s];
        f += o[ee] * z, w += o[ee + 1] * z, S += o[ee + 2] * z;
      }
      const _ = (h * t + u) * 3;
      n[_] = f, n[_ + 1] = w, n[_ + 2] = S;
    }
    [o, n] = [n, o];
  }
  const y = new Float32Array(c), m = new Float32Array(c * 4), p = (l) => Math.min(1.25, Math.max(0.75, l));
  for (let l = 0; l < c; l++) {
    y[l] = 0.2126 * o[l * 3] + 0.7152 * o[l * 3 + 1] + 0.0722 * o[l * 3 + 2];
    const h = Math.max(y[l], 1e-4);
    for (let u = 0; u < 3; u++) m[l * 4 + u] = 1 + 0.35 * (p(o[l * 3 + u] / h) - 1);
    m[l * 4 + 3] = 1 + 0.5 * (p(r[l] / h) - 1);
  }
  return { light: y, material: m };
}
const de = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map();
function Le(e) {
  const t = ve.get(e);
  t && (ie(t), t.close(), ve.delete(e));
}
function et(e, t) {
  const { grid: a, light: c, width: r, height: o } = e, n = [];
  for (let m = 0; m < t.length; m++) if (t[m]) {
    const p = Math.min(r - 1, Math.floor((m % a.width + 0.5) * r / a.width)), l = Math.min(o - 1, Math.floor((Math.floor(m / a.width) + 0.5) * o / a.height));
    n.push(c[l * r + p]);
  }
  if (!n.length) return 1;
  function i(m) {
    let p = 0, l = n.length - 1;
    for (; p < l; ) {
      const h = n[p + l >> 1];
      let u = p, f = p, w = l;
      for (; f <= w; )
        n[f] < h ? ([n[f], n[u]] = [n[u], n[f]], f++, u++) : n[f] > h ? ([n[f], n[w]] = [n[w], n[f]], w--) : f++;
      if (m < u) l = u - 1;
      else if (m > w) p = w + 1;
      else return { value: n[m], equalStart: u };
    }
    return { value: n[m], equalStart: p };
  }
  const s = n.length >> 1, { value: g, equalStart: M } = i(s);
  if (n.length % 2 || s - 1 >= M) return Math.max(1e-4, g);
  let y = -1 / 0;
  for (let m = 0; m < s; m++) n[m] > y && (y = n[m]);
  return Math.max(1e-4, (y + g) / 2);
}
self.onmessage = ({ data: e }) => {
  const { id: t, type: a, key: c } = e;
  try {
    if (a === "source") {
      Le(c), ve.set(c, e.bitmap), self.postMessage({ id: t, result: null });
      return;
    } else if (a === "releaseSource") {
      Le(c), self.postMessage({ id: t, result: null });
      return;
    } else if (a === "releaseSources") {
      for (const r of ve.keys()) r.startsWith(c) && Le(r);
      self.postMessage({ id: t, result: null });
      return;
    } else if (a === "register") {
      const r = qe(e.buffer, e.meta), { light: o, material: n } = Ze(e.pixels, e.width, e.height), i = Ve(r);
      be(r), be(i);
      const s = De(r);
      de.set(c, { grid: r, coarse: i, light: o, material: n, width: e.width, height: e.height, image: { width: e.width, height: e.height }, meta: e.meta, spread: s });
      const g = { light: o.slice(), spread: s.slice() };
      self.postMessage({ id: t, result: g }, [g.light.buffer, g.spread.buffer]);
    } else if (a === "raster") {
      const r = de.get(c), o = ve.get(e.sourceKey);
      if (!r || !o) throw new Error("Surface data is gone — run the workflow again");
      const n = ze(r, e.frame, o, { ...e.sticker, opacity: 1 }, e.viewport);
      self.postMessage({ id: t, result: n }, [n.bitmap]);
    } else if (a === "flat") {
      const r = de.get(c);
      if (!r) throw new Error("Surface data is gone — run the workflow again");
      const o = performance.now(), n = e.coarse ? r.coarse : r.grid, i = We(n, e.sticker, e.aspect, e.physicalWidth);
      if (i) {
        i.geometryMs = performance.now() - o, i.lref = et({ ...r, grid: n }, i.region), i.referenceMs = performance.now() - o - i.geometryMs, i.anchor = e.sticker.anchor, i.size = e.sticker.size, i.rotation = e.sticker.rotation, i.gridSize = [n.width, n.height], i.computeMs = performance.now() - o;
        const g = ve.get(e.sourceKey);
        if (g) {
          const M = performance.now();
          Object.assign(i, ze(r, i, g, { ...e.sticker, opacity: 1 }, e.viewport ?? [r.width, r.height])), i.rasterMs = performance.now() - M;
        }
        delete i.xy, delete i.reached;
      }
      const s = i ? [i.region.buffer, ...i.field ? [i.field.buffer] : [], ...i.bitmap ? [i.bitmap] : []] : [];
      self.postMessage({ id: t, result: i }, s);
    } else if (a === "release") {
      const r = de.get(c);
      r && Ye(r), de.delete(c), de.size || Je(), self.postMessage({ id: t, result: null });
    }
  } catch (r) {
    self.postMessage({ id: t, error: r.message });
  }
};
