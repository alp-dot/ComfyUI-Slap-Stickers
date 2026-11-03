function Ne(e, t, l) {
  var n;
  const a = t.pose;
  if (!a || a.scene !== (e.key ?? "")) return null;
  const f = [...t.anchor, t.size, t.rotation];
  if (!((n = a.at) != null && n.every((s, i) => s === f[i])) || Math.abs(a.w / a.h / l - 1) > 1e-6) return null;
  for (const s of ["p0", "n", "e1", "e2"]) if (!Array.isArray(a[s]) || a[s].length !== 3 || !a[s].every(Number.isFinite)) return null;
  const r = (s, i) => s.reduce((p, d, x) => p + d * i[x], 0);
  for (const s of ["n", "e1", "e2"]) if (Math.abs(r(a[s], a[s]) - 1) > 2e-3) return null;
  return Math.abs(r(a.e1, a.e2)) > 2e-3 || Math.abs(r(a.n, a.e1)) > 2e-3 || Math.abs(r(a.n, a.e2)) > 2e-3 || !(a.w > 0 && a.h > 0 && a.p0[2] > 0) ? null : a;
}
const We = 0.03, et = 24, tt = 1e-14, nt = 0.05, Q = (e, t) => e[0] * t[0] + e[1] * t[1] + e[2] * t[2], we = (e, t) => e.map((l, a) => l + t[a]), Me = (e, t) => e.map((l, a) => l - t[a]), j = (e, t) => e.map((l) => l * t), Te = (e) => Math.sqrt(Q(e, e)) > 1e-12 ? j(e, 1 / Math.sqrt(Q(e, e))) : [0, 0, 0], Ie = (e, t) => [e[1] * t[2] - e[2] * t[1], e[2] * t[0] - e[0] * t[2], e[0] * t[1] - e[1] * t[0]], Re = (e, t) => e.map((l) => Q(l, t));
function it(e, t, l, a, f, r, n = [0, 0], s = [0.5, 0.5]) {
  const i = (g, v) => we(e, we(j(t, (g - s[0]) * a), j(l, (v - s[1]) * f))), p = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([g, v]) => i(g, v)), d = 0.05 * e[2], x = [], o = (g) => {
    const v = Re(r, g);
    return [v[0] / v[2] + n[0], v[1] / v[2] + n[1]];
  };
  p.forEach((g, v) => {
    const b = p[(v + 1) % 4];
    g[2] >= d && x.push(g), g[2] >= d != b[2] >= d && x.push(we(g, j(Me(b, g), (d - g[2]) / (b[2] - g[2]))));
  });
  const m = i(0.5, 0.5), c = i(0.5, 0), M = o(m), h = Re(r, m), u = Re(r, j(l, -1));
  return { corners: x.map(o), handles: p.map((g) => g[2] >= d ? o(g) : null), center: M, top: c[2] >= d ? o(c) : null, up: [u[0] * h[2] - h[0] * u[2], u[1] * h[2] - h[1] * u[2]] };
}
function He(e) {
  const t = [Ie(e[1], e[2]), Ie(e[2], e[0]), Ie(e[0], e[1])], l = Q(e[0], t[0]);
  return [0, 1, 2].map((a) => [0, 1, 2].map((f) => t[f][a] / l));
}
function ot(e) {
  const t = e.map((f) => [...f]), l = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let f = 0; f < et && !(Math.max(Math.abs(t[0][1]), Math.abs(t[0][2]), Math.abs(t[1][2])) <= tt * Math.max(1, Math.abs(t[0][0] + t[1][1] + t[2][2]))); f++)
    for (const [r, n] of [[0, 1], [0, 2], [1, 2]]) {
      if (Math.abs(t[r][n]) < 1e-30) continue;
      const s = 0.5 * Math.atan2(2 * t[r][n], t[n][n] - t[r][r]), i = Math.cos(s), p = Math.sin(s), d = t[r][r], x = t[n][n], o = t[r][n];
      for (let m = 0; m < 3; m++) {
        if (m !== r && m !== n) {
          const h = t[m][r], u = t[m][n];
          t[m][r] = t[r][m] = i * h - p * u, t[m][n] = t[n][m] = p * h + i * u;
        }
        const c = l[m][r], M = l[m][n];
        l[m][r] = i * c - p * M, l[m][n] = p * c + i * M;
      }
      t[r][r] = i * i * d - 2 * p * i * o + p * p * x, t[n][n] = p * p * d + 2 * p * i * o + i * i * x, t[r][n] = t[n][r] = 0;
    }
  let a = 0;
  for (let f = 1; f < 3; f++) t[f][f] < t[a][a] && (a = f);
  return Te(l.map((f) => f[a]));
}
function Fe(e, t, l, a = null, f = !1) {
  const { width: r, height: n, points: s, normals: i, valid: p } = e, d = (A) => [s[A * 3], s[A * 3 + 1], s[A * 3 + 2]], x = (A) => [i[A * 3], i[A * 3 + 1], i[A * 3 + 2]], o = Ne(e, t, l), [m, c] = (o == null ? void 0 : o.baseAnchor) ?? t.anchor;
  let M = Math.min(n - 1, Math.floor(c * n)), h = Math.min(r - 1, Math.floor(m * r)), u = M * r + h;
  if (!p[u]) {
    let A = 1 / 0, S = -1;
    for (let U = 0; U < r * n; U++) if (p[U]) {
      const B = (Math.floor(U / r) - M) ** 2 + (U % r - h) ** 2;
      B < A && (A = B, S = U);
    }
    if (S < 0 || A > 100 ** 2) return null;
    u = S, M = Math.floor(u / r), h = u % r;
  }
  const g = t.edge, v = (A, S) => p[A] && p[S] && Math.abs(s[A * 3 + 2] - s[S * 3 + 2]) <= g * Math.min(s[A * 3 + 2], s[S * 3 + 2]), b = a !== null ? a * e.intrinsics[0][0] / s[u * 3 + 2] : t.size, w = Math.min(32, Math.max(3, Math.floor(0.25 * Math.min(b * r, b * r / l) + 0.5))), y = Math.max(0, h - w), E = Math.min(r - 1, h + w), R = Math.max(0, M - w), I = Math.min(n - 1, M + w);
  let k = [u];
  const N = new Set(k);
  for (let A = 0; A < k.length; A++) {
    const S = k[A], U = Math.floor(S / r), B = S % r;
    for (const [X, te] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const $ = B + X, me = U + te, oe = me * r + $;
      $ >= y && $ <= E && me >= R && me <= I && !N.has(oe) && v(S, oe) && (N.add(oe), k.push(oe));
    }
  }
  const P = [...N].sort((A, S) => A - S);
  let L, z;
  if (o)
    L = o.p0, z = o.n;
  else if (P.length >= 6) {
    L = [0, 0, 0];
    for (const S of P) L = we(L, d(S));
    L = j(L, 1 / P.length);
    const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (const S of P) {
      const U = Me(d(S), L);
      for (let B = 0; B < 3; B++) for (let X = 0; X < 3; X++) A[B][X] += U[B] * U[X];
    }
    z = ot(A);
  } else
    L = d(u), z = Te(x(u)), z.some(Boolean) || (z = j(Te(d(u)), -1));
  Q(z, d(u)) > 0 && (z = j(z, -1));
  const K = He(e.intrinsics), O = Re(K, [m, c, 1]), G = Q(z, O), ye = Math.abs(G) / Math.sqrt(Q(O, O)) < nt;
  let se = o ? o.p0 : ye ? d(u) : j(O, Q(z, L) / G);
  se[2] <= 0 && (se = d(u));
  const _e = Re(K, [m, c - 1 / n, 1]), be = Q(z, _e), le = Math.abs(be) > 1e-12 ? j(_e, Q(z, L) / be) : [0, 0, 0];
  let V = Te(Me(le, se));
  (ye || le[2] <= 0 || !V.some(Boolean)) && (V = Me([0, -1, 0], j(z, Q(z, [0, -1, 0]))), Math.sqrt(Q(V, V)) < 1e-6 && (V = Me([0, 0, 1], j(z, z[2]))), V = Te(V));
  const fe = j(V, -1), ge = Ie(z, fe), Ae = t.rotation * Math.PI / 180, de = Math.cos(Ae), Ee = Math.sin(Ae), he = o ? o.e1 : we(j(ge, de), j(fe, Ee)), T = o ? o.e2 : we(j(ge, -Ee), j(fe, de)), _ = a ?? (o == null ? void 0 : o.w) ?? t.size * se[2] / e.intrinsics[0][0], D = o && a === null ? o.h : _ / l, F = t.pivot ?? [0.5, 0.5], Z = it(se, he, T, _, D, e.intrinsics, [0, 0], F), { corners: Y } = Z, ee = [Math.max(0, Math.min(...Y.map((A) => A[0]))), Math.max(0, Math.min(...Y.map((A) => A[1]))), Math.min(1, Math.max(...Y.map((A) => A[0]))), Math.min(1, Math.max(...Y.map((A) => A[1])))], ce = { offset: (o == null ? void 0 : o.shift) ?? [0, 0], turn: (o == null ? void 0 : o.turn) ?? 0, baseAnchor: (o == null ? void 0 : o.baseAnchor) ?? t.anchor, baseRotation: (o == null ? void 0 : o.baseRotation) ?? t.rotation, reach: o == null ? void 0 : o.reach };
  if (f) return { p0: se, n: z, e1: he, e2: T, w: _, h: D, bounds: ee, ...Z, pivot: F, cell: u, ...ce };
  const [ue, pe, J, W] = [Math.floor(ee[0] * r) - 2, Math.floor(ee[1] * n) - 2, Math.ceil(ee[2] * r) + 2, Math.ceil(ee[3] * n) + 2], q = new Uint8Array(r * n), H = new Uint8Array(r * n);
  k = [u], H[u] = 1;
  for (let A = 0; A < k.length; A++) {
    const S = k[A], U = Math.floor(S / r), B = S % r;
    if (!(B < ue || B > J || U < pe || U > W || Math.abs(Q(z, Me(d(S), se))) > We * s[S * 3 + 2])) {
      q[S] = 1;
      for (let X = -1; X <= 1; X++) for (let te = -1; te <= 1; te++) {
        const $ = B + te, me = U + X, oe = me * r + $;
        !te && !X || $ < 0 || $ >= r || me < 0 || me >= n || H[oe] || !v(S, oe) || te && X && ![[S, U * r + $], [S, me * r + B], [oe, U * r + $], [oe, me * r + B]].every(([Qe, Ze]) => v(Qe, Ze)) || (H[oe] = 1, k.push(oe));
      }
    }
  }
  return { p0: se, n: z, e1: he, e2: T, w: _, h: D, region: q, bounds: ee, ...Z, pivot: F, cell: u, ...ce };
}
function at(e, t) {
  const l = t.grid_w, a = t.grid_h, f = l * a;
  if (t.format !== 1 || !Number.isInteger(l) || !Number.isInteger(a) || l < 1 || a < 1 || e.byteLength !== f * 25) throw new Error("The surface data is incomplete. Run the workflow again.");
  const r = new DataView(e), n = new Float32Array(f * 3), s = new Float32Array(f * 3);
  for (let i = 0; i < f * 3; i++)
    n[i] = r.getFloat32(i * 4, !0), s[i] = r.getFloat32(f * 12 + i * 4, !0);
  return { width: l, height: a, points: n, normals: s, valid: new Uint8Array(e.slice(f * 24)), intrinsics: t.intrinsics, key: t.geometry_key ?? t.key ?? "" };
}
const Ce = /* @__PURE__ */ new WeakMap(), Pe = [-1, 0, 1, -1, 1, -1, 0, 1], ze = [-1, -1, -1, 0, 0, 1, 1, 1];
function qe(e, t = 0.04) {
  const { width: l, height: a, points: f, valid: r } = e, n = l * a;
  let s = Ce.get(e);
  if (!s) {
    const u = new Float64Array(n * 3);
    for (let g = 0; g < n; g++) {
      const v = g * 3, b = Math.hypot(e.normals[v], e.normals[v + 1], e.normals[v + 2]);
      if (b > 1e-12) for (let w = 0; w < 3; w++) u[v + w] = e.normals[v + w] / b;
    }
    s = { entries: /* @__PURE__ */ new Map(), workspace: { normals: u, offsets: Pe.map((g, v) => g + ze[v] * l), dist: new Float64Array(n), basis: new Float64Array(n * 6), heap: new Int32Array(n), positions: new Int32Array(n) } }, Ce.set(e, s);
  }
  const { entries: i, workspace: p } = s;
  if (i.has(t)) return i.get(t);
  const d = new Uint8Array(n), { normals: x } = p, o = (u, g) => r[u] && r[g] && Math.abs(f[u * 3 + 2] - f[g * 3 + 2]) <= t * Math.min(f[u * 3 + 2], f[g * 3 + 2]);
  for (let u = 0; u < a; u++) for (let g = 0; g < l; g++) {
    const v = u * l + g;
    if (r[v])
      for (let b = 0; b < 8; b++) {
        const w = g + Pe[b], y = u + ze[b], E = y * l + w;
        w < 0 || w >= l || y < 0 || y >= a || !o(v, E) || Pe[b] && ze[b] && !(o(v, u * l + w) && o(v, y * l + g) && o(E, u * l + w) && o(E, y * l + g)) || (d[v] |= 1 << b);
      }
  }
  let m = !!r[0];
  const c = x.subarray(0, 3), M = f.subarray ? f.subarray(0, 3) : f.slice(0, 3);
  for (let u = 0; m && u < n; u++) {
    if (!r[u] || Math.abs(c[0] * (f[u * 3] - M[0]) + c[1] * (f[u * 3 + 1] - M[1]) + c[2] * (f[u * 3 + 2] - M[2])) > 1e-7 * f[u * 3 + 2]) {
      m = !1;
      break;
    }
    if (x[u * 3] * c[0] + x[u * 3 + 1] * c[1] + x[u * 3 + 2] * c[2] < 1 - 1e-12) {
      m = !1;
      break;
    }
    (u % l < l - 1 && !(d[u] & 16) || Math.floor(u / l) < a - 1 && !(d[u] & 64)) && (m = !1);
  }
  const h = { links: d, planar: m, ...p };
  return i.set(t, h), h;
}
function rt(e, t, l, a = null, f = 1.25) {
  const r = performance.now(), n = Fe(e, t, l, a, !0);
  if (!n) return null;
  const { width: s, height: i, points: p } = e, d = s * i, { links: x, normals: o, offsets: m, dist: c, basis: M, heap: h, positions: u } = qe(e, t.edge), g = new Float64Array(d * 2), v = new Uint8Array(d), b = new Uint8Array(d), w = performance.now();
  c.fill(1 / 0), u.fill(-1);
  const y = n.cell, E = n.pivot ?? [0.5, 0.5], R = n.reach ?? Math.hypot(n.w * Math.max(E[0], 1 - E[0]), n.h * Math.max(E[1], 1 - E[1])) * f;
  n.reach = R;
  const I = n.offset ?? [0, 0], k = Math.cos(n.turn ?? 0), N = Math.sin(n.turn ?? 0), { n: P, e1: L, e2: z, p0: K } = n;
  g[y * 2] = L[0] * (p[y * 3] - K[0]) + L[1] * (p[y * 3 + 1] - K[1]) + L[2] * (p[y * 3 + 2] - K[2]), g[y * 2 + 1] = z[0] * (p[y * 3] - K[0]) + z[1] * (p[y * 3 + 1] - K[1]) + z[2] * (p[y * 3 + 2] - K[2]);
  let O = 0;
  const G = (T, _) => c[T] < c[_] || c[T] === c[_] && T < _;
  function ye(T) {
    let _ = u[T];
    for (_ < 0 && (_ = O++, h[_] = T, u[T] = _); _; ) {
      const D = _ - 1 >> 1, F = h[D];
      if (!G(T, F)) break;
      h[_] = F, u[F] = _, _ = D;
    }
    h[_] = T, u[T] = _;
  }
  function se() {
    const T = h[0], _ = h[--O];
    if (u[T] = -1, O) {
      let D = 0;
      for (; D * 2 + 1 < O; ) {
        let F = D * 2 + 1;
        if (F + 1 < O && G(h[F + 1], h[F]) && F++, !G(h[F], _)) break;
        h[D] = h[F], u[h[D]] = D, D = F;
      }
      h[D] = _, u[_] = D;
    }
    return T;
  }
  function _e(T) {
    const _ = T * 3, D = T * 6;
    let F = o[_], Z = o[_ + 1], Y = o[_ + 2];
    (T === y || !(F || Z || Y)) && (F = P[0], Z = P[1], Y = P[2]);
    const ee = F * P[0] + Z * P[1] + Y * P[2];
    if (ee < 0) return !1;
    const ce = P[1] * Y - P[2] * Z, ue = P[2] * F - P[0] * Y, pe = P[0] * Z - P[1] * F, J = 1 + ee;
    for (let W = 0; W < 2; W++) {
      const q = W ? z : L, H = ue * q[2] - pe * q[1], A = pe * q[0] - ce * q[2], S = ce * q[1] - ue * q[0], U = D + W * 3;
      M[U] = q[0] + H + (ue * S - pe * A) / J, M[U + 1] = q[1] + A + (pe * H - ce * S) / J, M[U + 2] = q[2] + S + (ce * A - ue * H) / J;
    }
    return !0;
  }
  c[y] = 0, ye(y);
  const be = performance.now();
  let le = s, V = i, fe = 0, ge = 0;
  for (; O; ) {
    const T = se(), _ = c[T];
    if (_ > R) break;
    if (!_e(T)) continue;
    const D = T * 3, F = x[T];
    if (T !== y) {
      let J = 0, W = 0, q = 0;
      for (let H = 0; H < 8; H++) if (F & 1 << H) {
        const A = T + m[H];
        if (!v[A]) continue;
        const S = A * 3, U = A * 6, B = p[D] - p[S], X = p[D + 1] - p[S + 1], te = p[D + 2] - p[S + 2], $ = 1 / Math.max(Math.sqrt(B * B + X * X + te * te), 1e-12);
        J += (g[A * 2] + M[U] * B + M[U + 1] * X + M[U + 2] * te) * $, W += (g[A * 2 + 1] + M[U + 3] * B + M[U + 4] * X + M[U + 5] * te) * $, q += $;
      }
      if (!q) continue;
      g[T * 2] = J / q, g[T * 2 + 1] = W / q;
    }
    v[T] = 1;
    const Z = g[T * 2] - I[0], Y = g[T * 2 + 1] - I[1], ee = (Z * k + Y * N) / n.w + E[0], ce = (-Z * N + Y * k) / n.h + E[1];
    ee >= 0 && ee <= 1 && ce >= 0 && ce <= 1 && (b[T] = 1);
    const ue = T % s, pe = Math.floor(T / s);
    le = Math.min(le, ue), fe = Math.max(fe, ue), V = Math.min(V, pe), ge = Math.max(ge, pe);
    for (let J = 0; J < 8; J++) if (F & 1 << J) {
      const W = T + m[J];
      if (v[W]) continue;
      const q = W * 3, H = p[q] - p[D], A = p[q + 1] - p[D + 1], S = p[q + 2] - p[D + 2], U = _ + Math.sqrt(H * H + A * A + S * S);
      U < c[W] && U <= R && (c[W] = U, ye(W));
    }
  }
  const Ae = performance.now(), de = fe - le + 1, Ee = ge - V + 1, he = new Float32Array(de * Ee * 4);
  for (let T = V; T <= ge; T++) for (let _ = le; _ <= fe; _++) {
    const D = T * s + _, F = ((T - V) * de + _ - le) * 4;
    v[D] && (he[F] = g[D * 2], he[F + 1] = g[D * 2 + 1], he[F + 2] = p[D * 3 + 2], he[F + 3] = 1);
  }
  return { ...n, timings: { frame: w - r, setup: be - w, walk: Ae - be, pack: performance.now() - Ae }, xy: g, reached: v, region: b, field: he, fieldRect: [le, V, de, Ee], gridSize: [s, i], bounds: [Math.max(0, (le - 0.5) / s), Math.max(0, (V - 0.5) / i), Math.min(1, (fe + 1.5) / s), Math.min(1, (ge + 1.5) / i)] };
}
function Ye(e) {
  const { width: t, height: l, points: a, valid: f } = e, r = new Float32Array(t * l);
  for (let n = 0; n < l; n++) for (let s = 0; s < t; s++) {
    const i = n * t + s;
    if (!f[i]) continue;
    let p = a[i * 3 + 2], d = p;
    for (let x = -1; x <= 1; x++) for (let o = -1; o <= 1; o++) {
      const m = Math.max(0, Math.min(l - 1, n + x)) * t + Math.max(0, Math.min(t - 1, s + o));
      f[m] && (p = Math.min(p, a[m * 3 + 2]), d = Math.max(d, a[m * 3 + 2]));
    }
    r[i] = (d - p) / a[i * 3 + 2];
  }
  return r;
}
function Oe(e, t, l, a = null, f = 1.25) {
  if (t.mode !== "wrap") return Fe(e, t, l, a);
  if (!qe(e, t.edge).planar) return rt(e, t, l, a, f);
  const r = Fe(e, t, l, a);
  if (!r) return null;
  for (let n = 0; n < r.region.length; n++) if (r.region[n]) {
    const s = n * 3, i = e.points[s] - r.p0[0], p = e.points[s + 1] - r.p0[1], d = e.points[s + 2] - r.p0[2], x = (i * r.e1[0] + p * r.e1[1] + d * r.e1[2]) / r.w + r.pivot[0], o = (i * r.e2[0] + p * r.e2[1] + d * r.e2[2]) / r.h + r.pivot[1];
    (x < 0 || x > 1 || o < 0 || o > 1) && (r.region[n] = 0);
  }
  return r.planeShortcut = !0, r;
}
const Ue = /* @__PURE__ */ new WeakMap(), Je = new Float32Array(1), st = new Uint32Array(Je.buffer);
function Be(e) {
  Je[0] = e;
  const t = st[0], l = t >>> 16 & 32768, a = (t >>> 23 & 255) - 127 + 15, f = t & 8388607;
  return a <= 0 ? a < -10 ? l : l | ((f | 8388608) >>> 1 - a) + 4096 >>> 13 : a >= 31 ? l | 31744 : l | (a << 10) + (f + 4096 >>> 13);
}
function lt(e) {
  if (Ue.has(e)) return Ue.get(e);
  const t = new OffscreenCanvas(e.width, e.height), l = t.getContext("2d");
  l.drawImage(e, 0, 0);
  const a = l.getImageData(0, 0, e.width, e.height).data, f = new Uint16Array(a.length), r = [0, 0, 0];
  let n = 0, s = 0, i = 0;
  const p = Array.from({ length: 256 }, (x, o) => (o /= 255, o <= 0.04045 ? o / 12.92 : ((o + 0.055) / 1.055) ** 2.4));
  for (let x = 0; x < a.length; x += 4) {
    const o = a[x + 3] / 255, m = [p[a[x]], p[a[x + 1]], p[a[x + 2]]], c = m[0] * 0.2126 + m[1] * 0.7152 + m[2] * 0.0722;
    n += o, s += c * o, i += c * c * o;
    for (let M = 0; M < 3; M++)
      r[M] += m[M] * o, f[x + M] = Be(m[M] * o);
    f[x + 3] = Be(o);
  }
  const d = { data: f, stats: [...r.map((x) => x / Math.max(n, 1e-6)), Math.sqrt(Math.max(0, i / Math.max(n, 1e-6) - (s / Math.max(n, 1e-6)) ** 2))] };
  return Ue.set(e, d), d;
}
function ct(e) {
  var t;
  return (t = Ue.get(e)) == null ? void 0 : t.data;
}
function ft(e) {
  const t = e & 32768 ? -1 : 1, l = e >> 10 & 31, a = e & 1023;
  return t * (l ? 2 ** (l - 15) * (1 + a / 1024) : a * 2 ** -24);
}
let C = null;
const re = /* @__PURE__ */ new Map(), Ge = /* @__PURE__ */ new WeakMap(), Xe = /* @__PURE__ */ new WeakMap();
function je(e) {
  let t = Ge.get(e);
  return t || (t = Uint8Array.from(e, (l) => l ? 255 : 0), Ge.set(e, t)), t;
}
const ht = `#version 300 es
out vec2 uv;
void main(){ vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2)); uv=vec2(p.x,1.-p.y); gl_Position=vec4(p*2.-1.,0.,1.); }`, ut = `#version 300 es
precision highp float;
in vec2 uv; out vec4 outputColor;
uniform sampler2D picture, points, valid, region, light, warp, spread, appearance,photoDetail,photoColor,photoFinish,normals,photoClip;
uniform bool wrapped,materialized,natural,hasMatte;
uniform vec4 sourceStats;
uniform vec2 photoSize;
uniform mat3 inverseK;
uniform vec3 p0,n,e1,e2;
uniform vec2 size,gridSize,mapGrid,pivot,fieldOffset,fieldRotation;
uniform vec4 fieldRect;
uniform float opacity,edge,shading,lref,imagePixelScale;
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
 xy-=fieldOffset;
 xy=vec2(xy.x*fieldRotation.x+xy.y*fieldRotation.y,-xy.x*fieldRotation.y+xy.y*fieldRotation.x);
 return xy/size+pivot;
}
vec3 linearize(vec3 v){return mix(v/12.92,pow((v+.055)/1.055,vec3(2.4)),step(vec3(.04045),v));}
vec3 srgb(vec3 v){return mix(v*12.92,1.055*pow(max(v,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),v));}
vec4 sourceAt(vec2 st,float lod,vec2 aa){vec2 edgeAlpha=clamp((min(st+aa*.5,vec2(1.))-max(st-aa*.5,vec2(0.)))/max(aa,vec2(.0000001)),0.,1.);return textureLod(picture,clamp(st,vec2(0.),vec2(1.)),lod)*edgeAlpha.x*edgeAlpha.y;}
float grain(ivec2 p){uint q=uint(p.x)*1973u+uint(p.y)*9277u+89173u;q=(q^(q>>16))*2246822519u;q=(q^(q>>13))*3266489917u;q^=q>>16;return (float(q&65535u)/65535.-.5)*3.464101615;}
void main(){
 vec2 geometryUV=uv;
 if(any(lessThan(geometryUV,vec2(0.)))||any(greaterThan(geometryUV,vec2(1.))))discard;
 if(texture(valid,geometryUV).r<.5)discard;
 vec3 p=texture(points,geometryUV).rgb;
 vec4 matte=hasMatte?texture(photoClip,uv):vec4(0.);bool soft=natural&&hasMatte&&matte.a>.5;float sceneCoverage=1.,expectedDepth;
 if(!soft&&texture(spread,geometryUV).r>edge)discard;
 if(wrapped){vec4 q=mapAt(geometryUV);if(q.a<=0.)discard;expectedDepth=q.z/q.a;if(!soft&&abs(p.z-expectedDepth)>edge*p.z)discard;}
 else{
  vec3 ray=inverseK*vec3(geometryUV,1.);expectedDepth=dot(n,p0)/dot(n,ray);
  float allowed=0.;ivec2 cell=ivec2(floor(geometryUV*gridSize));
  for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
   vec2 q=(vec2(clamp(cell+ivec2(x,y),ivec2(0),ivec2(gridSize)-1))+.5)/gridSize;
   allowed=max(allowed,texture(region,q).r);
  }
  if(!soft&&((!natural&&allowed<.5)||abs(dot(n,p-p0))>${We}*p.z))discard;
 }
 if(soft){vec2 depths=exp2(matte.rg);vec2 matchDepth=vec2(abs(expectedDepth-depths.x)<=edge*depths.x?1.:0.,abs(expectedDepth-depths.y)<=edge*depths.y?1.:0.);sceneCoverage=dot(matchDepth,vec2(matte.b,1.-matte.b));}
 vec2 st=textureUV(uv),dx=dFdx(st),dy=dFdy(st);vec2 margin=abs(dx)+abs(dy);
 float coverage=all(greaterThan(st,margin))&&all(lessThan(st,vec2(1.)-margin))?1.:0.;
 // Subpixel coverage only at the outline; derivatives avoid repeated surface lookups.
 if(coverage==0.)for(int y=0;y<4;y++) for(int x=0;x<4;x++){
   vec2 sub=st+dx*(float(x)-1.5)*.25+dy*(float(y)-1.5)*.25;
   if(all(greaterThanEqual(sub,vec2(0.)))&&all(lessThanEqual(sub,vec2(1.)))) coverage+=.0625;
 }
 if(coverage<=0.&&!natural) discard;
 vec4 color;
 if(natural){
  vec4 detail=texture(photoDetail,uv),local=texture(photoColor,uv),finish=texture(photoFinish,uv);
  vec2 dimensions=vec2(textureSize(picture,0));
  float footprint=max(length(dx*dimensions),length(dy*dimensions)),lod=max(0.,log2(max(footprint,1.)));
  // Account for the source's own enlargement blur before adding camera blur.
  float sigma=sqrt(max(0.,pow(detail.b*shading*imagePixelScale,2.)-.16/max(footprint*footprint,.000001)));
  vec2 sx=dx*sigma*1.414213562,sy=dy*sigma*1.414213562;
  color=vec4(0.);
  if(sigma<.15)color=sourceAt(st,lod,margin);
  else {lod+=log2(max(1.,sigma*.8));vec2 aa=margin*max(1.,sigma*.5);for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){float weight=float((x==0?2:1)*(y==0?2:1))/16.;color+=sourceAt(st+sx*float(x)+sy*float(y),lod,aa)*weight;}}
  coverage=1.;
  color.rgb=color.a>1e-6?color.rgb/color.a:vec3(0.);
  vec3 original=color.rgb;float luminance=dot(original,vec3(.2126,.7152,.0722));
  float contrast=clamp(local.a/max(sourceStats.a,.02),.65,1.2);
  vec3 adjusted=(original-sourceStats.rgb)*contrast+sourceStats.rgb+.12*(local.rgb-sourceStats.rgb);
  float saturation=(max(max(local.r,local.g),local.b)-min(min(local.r,local.g),local.b))/max(max(max(local.r,local.g),local.b),.005);
  adjusted=vec3(luminance)+(adjusted-vec3(luminance))*(.85+.15*saturation);
  float confidence=clamp((sourceStats.a-.005)/.015,0.,1.);
  adjusted=original+(adjusted-original)*clamp(4.*luminance*(1.-luminance),0.,1.)*confidence;
  adjusted=max(adjusted,vec3(0.))*detail.r*detail.g*finish.rgb+finish.a*.3;
  color.rgb=srgb(clamp(mix(original,clamp(adjusted,0.,1.),shading)+grain(ivec2(floor(uv*photoSize)))*detail.a*shading*min(1.,imagePixelScale),0.,1.));
  vec3 surfaceNormal=texture(normals,geometryUV).rgb;float facing=soft||length(surfaceNormal)<.000001?1.:dot(normalize(surfaceNormal),n);
  coverage*=smoothstep(.087155743,.422618262,facing);
 }else{
  color=texture(picture,clamp(st,vec2(0.),vec2(1.)));color.rgb=color.a>1e-6?color.rgb/color.a:vec3(0.);
  float k=1.+shading*(clamp(texture(light,uv).r/max(lref,.0001),0.,2.)-1.);vec3 gain=vec3(k);
  if(materialized){vec4 field=texture(appearance,uv);gain*=mix(vec3(1.),field.rgb,shading)*(1.+shading*(field.a-1.));}
  color.rgb=srgb(clamp(linearize(color.rgb)*gain,0.,1.));
 }
 outputColor=vec4(color.rgb,color.a*coverage*sceneCoverage*opacity);
}`;
function pt() {
  const e = typeof document > "u" ? new OffscreenCanvas(1, 1) : document.createElement("canvas"), t = e.getContext("webgl2", { alpha: !0, premultipliedAlpha: !0, antialias: !1, preserveDrawingBuffer: !0 });
  if (!t) throw new Error("WebGL2 is unavailable. Enable hardware acceleration and reload the page.");
  t.getExtension("EXT_color_buffer_float");
  const l = t.createProgram();
  for (const [r, n] of [[t.VERTEX_SHADER, ht], [t.FRAGMENT_SHADER, ut]]) {
    const s = t.createShader(r);
    if (t.shaderSource(s, n), t.compileShader(s), !t.getShaderParameter(s, t.COMPILE_STATUS)) throw new Error(t.getShaderInfoLog(s));
    t.attachShader(l, s), t.deleteShader(s);
  }
  if (t.linkProgram(l), !t.getProgramParameter(l, t.LINK_STATUS)) throw new Error(t.getProgramInfoLog(l));
  t.useProgram(l);
  const a = /* @__PURE__ */ new Map(), f = (r) => (a.has(r) || a.set(r, t.getUniformLocation(l, r)), a.get(r));
  return e.addEventListener("webglcontextlost", (r) => {
    r.preventDefault();
  }), { canvas: e, gl: t, program: l, location: f };
}
function ne(e, t, l, a, f = 4, r = !1) {
  const { gl: n } = C;
  if (re.has(e)) return re.get(e);
  const s = n.getParameter(n.TEXTURE_BINDING_2D), i = n.createTexture();
  if (n.bindTexture(n.TEXTURE_2D, i), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, r ? n.LINEAR : n.NEAREST), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, r ? n.LINEAR : n.NEAREST), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE), n.pixelStorei(n.UNPACK_ALIGNMENT, 1), f === 4 && ArrayBuffer.isView(a)) {
    const p = a instanceof Float32Array, d = a instanceof Uint16Array;
    n.texImage2D(n.TEXTURE_2D, 0, d ? n.RGBA16F : p ? n.RGBA32F : n.RGBA, t, l, 0, n.RGBA, d ? n.HALF_FLOAT : p ? n.FLOAT : n.UNSIGNED_BYTE, a);
  } else if (f === 4) {
    const p = new OffscreenCanvas(t, l);
    p.getContext("2d").drawImage(a, 0, 0);
    const d = n.getParameter(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
    n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
    try {
      n.texImage2D(n.TEXTURE_2D, 0, n.RGBA, n.RGBA, n.UNSIGNED_BYTE, p);
    } finally {
      n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, d);
    }
  } else {
    const p = a instanceof Float32Array;
    n.texImage2D(n.TEXTURE_2D, 0, f === 3 ? n.RGB32F : p ? n.R32F : n.R8, t, l, 0, f === 3 ? n.RGB : n.RED, p ? n.FLOAT : n.UNSIGNED_BYTE, a);
  }
  return re.set(e, i), n.bindTexture(n.TEXTURE_2D, s), i;
}
function ie(e, t, l) {
  const { gl: a, location: f } = C;
  a.activeTexture(a.TEXTURE0 + e), a.bindTexture(a.TEXTURE_2D, l), a.uniform1i(f(t), e);
}
function ae(e) {
  re.has(e) && (C == null || C.gl.deleteTexture(re.get(e)), re.delete(e));
  const t = ct(e);
  t && re.has(t) && (C == null || C.gl.deleteTexture(re.get(t)), re.delete(t));
}
function mt(e) {
  ae(e.grid.points), ae(e.grid.valid), ae(e.light), ae(e.material), ae(e.spread), ae(e.grid.normals);
  for (const t of Object.values(e.appearance ?? {})) ae(t.data);
}
function gt() {
  var e;
  if (C) {
    for (const t of [...re.keys()]) ae(t);
    C.gl.deleteProgram(C.program), (e = C.gl.getExtension("WEBGL_lose_context")) == null || e.loseContext(), C = null;
  }
}
function dt(e, t) {
  const l = Math.min(e.width / t.image_w, e.height / t.image_h), a = Math.round(t.image_w * l), f = Math.round(t.image_h * l);
  return { left: Math.round((e.width - a) / 2), top: Math.round((e.height - f) / 2), width: a, height: f };
}
function xt(e, t, l, a, f) {
  const r = Xe.get(t), n = JSON.stringify([f.width, f.height, a.opacity, a.shading, a.edge, t.lref]);
  if ((r == null ? void 0 : r.key) === n && r.source === l) return r;
  C ?? (C = pt());
  const { gl: s, location: i } = C;
  if (s.isContextLost()) throw new Error("The image display stopped. Reload the page to restore it.");
  C.canvas.width !== f.width && (C.canvas.width = f.width), C.canvas.height !== f.height && (C.canvas.height = f.height), s.viewport(0, 0, f.width, f.height), s.useProgram(C.program), s.disable(s.SCISSOR_TEST), s.clearColor(0, 0, 0, 0), s.clear(s.COLOR_BUFFER_BIT), s.enable(s.BLEND), s.blendFuncSeparate(s.SRC_ALPHA, s.ONE_MINUS_SRC_ALPHA, s.ONE, s.ONE_MINUS_SRC_ALPHA);
  const p = He(e.grid.intrinsics);
  s.uniformMatrix3fv(i("inverseK"), !1, new Float32Array([0, 1, 2].flatMap((R) => [0, 1, 2].map((I) => p[I][R])))), s.uniform2f(i("gridSize"), e.grid.width, e.grid.height);
  const d = !!(a.natural && e.appearance);
  s.uniform1i(i("natural"), d);
  const x = d && e.appearance.clip;
  if (s.uniform1i(i("hasMatte"), !!x), x && ie(13, "photoClip", ne(x.data, x.width, x.height, x.data, 4, !0)), d) {
    const R = lt(l), I = !re.has(R.data);
    if (ie(0, "picture", ne(R.data, l.width, l.height, R.data, 4, !0)), I) {
      if (s.generateMipmap(s.TEXTURE_2D), s.getError() !== s.NO_ERROR) throw new Error("Linear image filtering is unavailable. Enable hardware acceleration.");
      s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, s.LINEAR_MIPMAP_LINEAR);
    }
    s.uniform4fv(i("sourceStats"), R.stats);
    for (const [k, N, P] of [[9, "photoDetail", "detail"], [10, "photoColor", "color"], [11, "photoFinish", "finish"]]) {
      const L = e.appearance[P];
      ie(k, N, ne(L.data, L.width, L.height, L.data, 4, !0));
    }
    s.uniform2f(i("photoSize"), e.meta.image_w, e.meta.image_h), s.uniform1f(i("imagePixelScale"), f.width / e.meta.image_w), ie(12, "normals", ne(e.grid.normals, e.grid.width, e.grid.height, e.grid.normals, 3));
  } else ie(0, "picture", ne(l, l.width, l.height, l, 4, !0));
  ie(1, "points", ne(e.grid.points, e.grid.width, e.grid.height, e.grid.points, 3)), ie(2, "valid", ne(e.grid.valid, e.grid.width, e.grid.height, je(e.grid.valid), 1)), ie(4, "light", ne(e.light, e.image.width, e.image.height, e.light, 1)), s.uniform1i(i("materialized"), !!e.material), e.material && ie(7, "appearance", ne(e.material, e.image.width, e.image.height, e.material, 4)), e.spread ?? (e.spread = Ye(e.grid)), ie(6, "spread", ne(e.spread, e.grid.width, e.grid.height, e.spread, 1));
  const [o, m] = t.gridSize ?? [e.grid.width, e.grid.height];
  s.uniform1i(i("wrapped"), !!t.field), t.field && (s.uniform4fv(i("fieldRect"), t.fieldRect), s.uniform2f(i("mapGrid"), o, m), ie(5, "warp", ne(t.field, t.fieldRect[2], t.fieldRect[3], t.field, 4))), ie(3, "region", ne(t.region, o, m, je(t.region), 1));
  for (const R of ["p0", "n", "e1", "e2"]) s.uniform3fv(i(R), t[R]);
  s.uniform2f(i("size"), t.w, t.h), s.uniform2fv(i("pivot"), t.pivot ?? [0.5, 0.5]), s.uniform2fv(i("fieldOffset"), t.offset ?? [0, 0]), s.uniform2f(i("fieldRotation"), Math.cos(t.turn ?? 0), Math.sin(t.turn ?? 0));
  for (const [R, I] of Object.entries({ opacity: a.opacity, edge: a.edge, shading: a.shading, lref: t.lref ?? 1 })) s.uniform1f(i(R), I);
  const c = 2 + (d ? Math.ceil(3 * e.blurMax * a.shading * f.width / e.meta.image_w) : 0), M = t.bounds, h = Math.max(0, Math.floor(M[0] * f.width) - c), u = Math.min(f.width, Math.ceil(M[2] * f.width) + c), g = Math.max(0, Math.floor(M[1] * f.height) - c), v = Math.min(f.height, Math.ceil(M[3] * f.height) + c), b = Math.max(1, u - h), w = Math.max(1, v - g);
  s.enable(s.SCISSOR_TEST), s.scissor(h, f.height - v, b, w), s.drawArrays(s.TRIANGLES, 0, 3), s.disable(s.SCISSOR_TEST);
  const y = new OffscreenCanvas(b, w);
  y.getContext("2d").drawImage(C.canvas, h, g, b, w, 0, 0, b, w);
  const E = { key: n, source: l, canvas: y, left: h, top: g };
  return Xe.set(t, E), E;
}
function Ve(e, t, l, a, f) {
  const r = dt({ width: f[0], height: f[1] }, e.meta), n = xt(e, t, l, a, r), s = n.canvas.transferToImageBitmap();
  return ae(t.region), t.field && ae(t.field), { bitmap: s, bitmapRect: [n.left, n.top], bitmapBox: [r.width, r.height], natural: !!(a.natural && e.appearance) };
}
const Le = Float32Array.from({ length: 256 }, (e, t) => (t /= 255) <= 0.04045 ? t / 12.92 : ((t + 0.055) / 1.055) ** 2.4);
function $e(e, t, l) {
  const a = t * l, f = new Float32Array(a);
  let r = new Float32Array(a * 3), n = new Float32Array(a * 3);
  for (let c = 0; c < a; c++) {
    const M = Le[e[c * 4]], h = Le[e[c * 4 + 1]], u = Le[e[c * 4 + 2]];
    r[c * 3] = M, r[c * 3 + 1] = h, r[c * 3 + 2] = u, f[c] = 0.2126 * M + 0.7152 * h + 0.0722 * u;
  }
  const s = Math.min(t, l) * 0.015, i = Math.max(1, Math.ceil(s * 3)), p = Array.from({ length: i * 2 + 1 }, (c, M) => Math.exp(-((M - i) ** 2) / (2 * s * s))), d = p.reduce((c, M) => c + M, 0);
  for (let c = 0; c < p.length; c++) p[c] /= d;
  for (const c of [0, 1]) {
    for (let M = 0; M < l; M++) for (let h = 0; h < t; h++) {
      let u = 0, g = 0, v = 0;
      for (let w = -i; w <= i; w++) {
        const y = c === 0 ? Math.min(t - 1, Math.max(0, h + w)) : h, E = c === 1 ? Math.min(l - 1, Math.max(0, M + w)) : M, R = (E * t + y) * 3, I = p[w + i];
        u += r[R] * I, g += r[R + 1] * I, v += r[R + 2] * I;
      }
      const b = (M * t + h) * 3;
      n[b] = u, n[b + 1] = g, n[b + 2] = v;
    }
    [r, n] = [n, r];
  }
  const x = new Float32Array(a), o = new Float32Array(a * 4), m = (c) => Math.min(1.25, Math.max(0.75, c));
  for (let c = 0; c < a; c++) {
    x[c] = 0.2126 * r[c * 3] + 0.7152 * r[c * 3 + 1] + 0.0722 * r[c * 3 + 2];
    const M = Math.max(x[c], 1e-4);
    for (let h = 0; h < 3; h++) o[c * 4 + h] = 1 + 0.35 * (m(r[c * 3 + h] / M) - 1);
    o[c * 4 + 3] = 1 + 0.5 * (m(f[c] / M) - 1);
  }
  return { light: x, material: o };
}
function Mt(e, t) {
  const [l, a] = e.gridSize, [f, r, n, s] = e.fieldRect, i = e.field, p = t[0] * l - 0.5 - f, d = t[1] * a - 0.5 - r, x = Math.floor(p), o = Math.floor(d), m = [0, 0, 0];
  if (x < 0 || o < 0 || x + 1 >= n || o + 1 >= s) return null;
  for (let c = 0; c < 2; c++) for (let M = 0; M < 2; M++) {
    const h = ((o + c) * n + x + M) * 4;
    if (!i[h + 3]) return null;
    const u = (M ? p - x : 1 - p + x) * (c ? d - o : 1 - d + o);
    for (let g = 0; g < 3; g++) m[g] += i[h + g] * u;
  }
  return m;
}
function vt(e, t, l, a, f) {
  const r = Ne(t, l, a), n = Mt(e, l.anchor);
  if (!n) return null;
  const s = Math.min(t.height - 1, Math.floor(l.anchor[1] * t.height)) * t.width + Math.min(t.width - 1, Math.floor(l.anchor[0] * t.width));
  if (!t.valid[s] || Math.abs(t.points[s * 3 + 2] - n[2]) > l.edge * n[2]) return null;
  const i = f ?? (r == null ? void 0 : r.w) ?? l.size * n[2] / t.intrinsics[0][0], p = r && f == null ? r.h : i / a, d = l.pivot ?? [0.5, 0.5], x = (r == null ? void 0 : r.shift) ?? n.slice(0, 2), o = (r == null ? void 0 : r.turn) ?? (l.rotation - e.baseRotation) * Math.PI / 180, m = Math.cos(o), c = Math.sin(o);
  if (Math.max(...[[0, 0], [1, 0], [1, 1], [0, 1]].map(([k, N]) => {
    const P = (k - d[0]) * i, L = (N - d[1]) * p;
    return Math.hypot(x[0] + P * m - L * c, x[1] + P * c + L * m);
  })) + (e.blurPad ?? 0) > e.reach * 0.94) return null;
  const h = new Uint8Array(t.width * t.height), [u, g, v, b] = e.fieldRect, w = e.field;
  let y = t.width, E = t.height, R = 0, I = 0;
  for (let k = 0; k < b; k++) for (let N = 0; N < v; N++) {
    const P = (k * v + N) * 4;
    if (!w[P + 3]) continue;
    const L = w[P] - x[0], z = w[P + 1] - x[1], K = (L * m + z * c) / i + d[0], O = (-L * c + z * m) / p + d[1];
    K >= 0 && K <= 1 && O >= 0 && O <= 1 && (h[(k + g) * t.width + N + u] = 1, y = Math.min(y, N + u), R = Math.max(R, N + u), E = Math.min(E, k + g), I = Math.max(I, k + g));
  }
  return y > R || E > I ? null : {
    ...e,
    timings: { reused: !0 },
    w: i,
    h: p,
    pivot: d,
    offset: x,
    turn: o,
    gripDepth: n[2],
    region: h,
    bounds: [Math.max(0, (y - 2) / t.width), Math.max(0, (E - 2) / t.height), Math.min(1, (R + 3) / t.width), Math.min(1, (I + 3) / t.height)]
  };
}
const ke = /* @__PURE__ */ new WeakMap();
function wt(e) {
  if (!e.field) return null;
  if (ke.has(e.field)) return ke.get(e.field);
  const [t, l, a, f] = e.fieldRect, [r, n] = e.gridSize, s = Array.from({ length: 256 }, () => []), i = e.field, p = [1 / 0, 1 / 0], d = [-1 / 0, -1 / 0];
  for (let m = 0; m < i.length; m += 4) if (i[m + 3]) for (let c = 0; c < 2; c++)
    p[c] = Math.min(p[c], i[m + c]), d[c] = Math.max(d[c], i[m + c]);
  const x = (m, c) => Math.max(0, Math.min(15, Math.floor((m - p[c]) / Math.max(1e-12, d[c] - p[c]) * 16)));
  for (let m = 0; m < f - 1; m++) for (let c = 0; c < a - 1; c++) {
    const M = (m * a + c) * 4, h = M, u = M + 4, g = M + a * 4, v = g + 4;
    if (!i[h + 3] || !i[u + 3] || !i[g + 3] || !i[v + 3]) continue;
    const b = Math.min(i[h], i[u], i[g], i[v]), w = Math.max(i[h], i[u], i[g], i[v]), y = Math.min(i[h + 1], i[u + 1], i[g + 1], i[v + 1]), E = Math.max(i[h + 1], i[u + 1], i[g + 1], i[v + 1]);
    for (let R = x(y, 1); R <= x(E, 1); R++) for (let I = x(b, 0); I <= x(w, 0); I++) s[R * 16 + I].push(m * a + c);
  }
  const o = (m) => {
    for (const c of s[x(m[1], 1) * 16 + x(m[0], 0)]) {
      const M = { x: c % a, y: Math.floor(c / a) }, h = c * 4, u = h, g = h + 4, v = h + a * 4, b = v + 4;
      if (m[0] < Math.min(i[u], i[g], i[v], i[b]) - 1e-7 || m[0] > Math.max(i[u], i[g], i[v], i[b]) + 1e-7 || m[1] < Math.min(i[u + 1], i[g + 1], i[v + 1], i[b + 1]) - 1e-7 || m[1] > Math.max(i[u + 1], i[g + 1], i[v + 1], i[b + 1]) + 1e-7) continue;
      const w = [h, h + 4, h + a * 4, h + a * 4 + 4].map((I) => [i[I], i[I + 1], i[I + 2]]);
      let y = 0.5, E = 0.5;
      for (let I = 0; I < 7; I++) {
        const k = w[0].map((O, G) => O * (1 - y) * (1 - E) + w[1][G] * y * (1 - E) + w[2][G] * (1 - y) * E + w[3][G] * y * E), N = w[0].map((O, G) => (w[1][G] - O) * (1 - E) + (w[3][G] - w[2][G]) * E), P = w[0].map((O, G) => (w[2][G] - O) * (1 - y) + (w[3][G] - w[1][G]) * y), L = N[0] * P[1] - N[1] * P[0];
        if (Math.abs(L) < 1e-16) break;
        const z = k[0] - m[0], K = k[1] - m[1];
        if (y -= (z * P[1] - K * P[0]) / L, E -= (N[0] * K - N[1] * z) / L, y < -2 || y > 3 || E < -2 || E > 3) break;
      }
      if (y < -1e-5 || y > 1.00001 || E < -1e-5 || E > 1.00001) continue;
      const R = w[0].map((I, k) => I * (1 - y) * (1 - E) + w[1][k] * y * (1 - E) + w[2][k] * (1 - y) * E + w[3][k] * y * E);
      if (!(Math.hypot(R[0] - m[0], R[1] - m[1]) > 1e-5))
        return { uv: [(t + M.x + 0.5 + y) / r, (l + M.y + 0.5 + E) / n], depth: R[2] };
    }
    return null;
  };
  return ke.set(e.field, o), o;
}
function yt(e, t) {
  var d, x, o;
  const l = wt(t), a = t.pivot ?? [0.5, 0.5], f = t.offset ?? [0, 0], r = t.turn ?? 0, n = Math.cos(r), s = Math.sin(r);
  function i(m, c) {
    const M = (m - a[0]) * t.w, h = (c - a[1]) * t.h, u = [f[0] + M * n - h * s, f[1] + M * s + h * n];
    let g = l == null ? void 0 : l(u);
    if (!g) {
      const v = t.p0.map((w, y) => w + t.e1[y] * u[0] + t.e2[y] * u[1]);
      if (v[2] < t.p0[2] * 0.05) return null;
      const b = e.intrinsics.map((w) => w.reduce((y, E, R) => y + E * v[R], 0));
      g = { uv: [b[0] / b[2], b[1] / b[2]], depth: v[2] };
    }
    return g;
  }
  return { handles: [[0, 0], [1, 0], [1, 1], [0, 1]].map((m) => {
    var c;
    return ((c = i(...m)) == null ? void 0 : c.uv) ?? null;
  }), center: (d = i(0.5, 0.5)) == null ? void 0 : d.uv, top: ((x = i(0.5, 0)) == null ? void 0 : x.uv) ?? null, bottom: ((o = i(0.5, 1)) == null ? void 0 : o.uv) ?? null };
}
const bt = "The sticker data is damaged.", At = { size: [0.01, 4], opacity: [0, 1], shading: [0, 1], edge: [5e-3, 0.5] }, Et = (e = bt) => {
  throw new Error(e);
}, Tt = (e) => typeof e == "number" && Number.isFinite(e) ? e : Et();
function St(e, t) {
  const [l, a] = At[e];
  return Math.min(a, Math.max(l, Tt(t)));
}
const xe = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map();
let Rt = 0;
function Ke(e, t) {
  !t.natural && e.pixels && !e.material && Object.assign(e, $e(e.pixels, e.width, e.height));
}
function De(e) {
  const t = ve.get(e);
  t && (ae(t), t.close(), ve.delete(e), Se.delete(e));
}
function _t(e, t) {
  const { grid: l, light: a, width: f, height: r } = e, n = [];
  for (let o = 0; o < t.length; o++) if (t[o]) {
    const m = Math.min(f - 1, Math.floor((o % l.width + 0.5) * f / l.width)), c = Math.min(r - 1, Math.floor((Math.floor(o / l.width) + 0.5) * r / l.height));
    n.push(a[c * f + m]);
  }
  if (!n.length) return 1;
  function s(o) {
    let m = 0, c = n.length - 1;
    for (; m < c; ) {
      const M = n[m + c >> 1];
      let h = m, u = m, g = c;
      for (; u <= g; )
        n[u] < M ? ([n[u], n[h]] = [n[h], n[u]], u++, h++) : n[u] > M ? ([n[u], n[g]] = [n[g], n[u]], g--) : u++;
      if (o < h) c = h - 1;
      else if (o > g) m = g + 1;
      else return { value: n[o], equalStart: h };
    }
    return { value: n[o], equalStart: m };
  }
  const i = n.length >> 1, { value: p, equalStart: d } = s(i);
  if (n.length % 2 || i - 1 >= d) return Math.max(1e-4, p);
  let x = -1 / 0;
  for (let o = 0; o < i; o++) n[o] > x && (x = n[o]);
  return Math.max(1e-4, (x + p) / 2);
}
self.onmessage = ({ data: e }) => {
  var f, r;
  const { id: t, type: l, key: a } = e;
  try {
    if (l === "source") {
      De(a), ve.set(a, e.bitmap), self.postMessage({ id: t, result: null });
      return;
    } else if (l === "releaseSource") {
      De(a), self.postMessage({ id: t, result: null });
      return;
    } else if (l === "releaseSources") {
      for (const n of ve.keys()) n.startsWith(a) && De(n);
      self.postMessage({ id: t, result: null });
      return;
    } else if (l === "register") {
      const n = at(e.buffer, e.meta);
      e.sky && (n.sky = e.sky);
      const { light: s, material: i } = e.appearance ? { light: new Float32Array(e.width * e.height).fill(1), material: null } : $e(e.pixels, e.width, e.height);
      qe(n);
      const p = Ye(n);
      let d = 0;
      const x = (r = (f = e.appearance) == null ? void 0 : f.detail) == null ? void 0 : r.data;
      if (x) for (let m = 2; m < x.length; m += 4) d = Math.max(d, x[m]);
      d = ft(d), xe.set(a, { grid: n, light: s, material: i, blurMax: d, pixels: e.appearance ? e.pixels : null, appearance: e.appearance, width: e.width, height: e.height, image: { width: e.width, height: e.height }, meta: e.meta, spread: p });
      const o = { light: s.slice(), spread: p.slice(), appearanceReady: !!e.appearance };
      self.postMessage({ id: t, result: o }, [o.light.buffer, o.spread.buffer]);
    } else if (l === "raster") {
      const n = xe.get(a), s = ve.get(e.sourceKey);
      if (!n || !s) throw new Error("Surface data is gone — run the workflow again");
      Ke(n, e.sticker);
      const i = Ve(n, e.frame, s, { ...e.sticker, opacity: 1 }, e.viewport ?? [n.width, n.height]);
      self.postMessage({ id: t, result: i }, [i.bitmap]);
    } else if (l === "flat") {
      const n = xe.get(a);
      if (!n) throw new Error("Surface data is gone — run the workflow again");
      e.guideOnly || Ke(n, e.sticker);
      const s = performance.now(), i = n.grid, p = Se.get(e.sourceKey), d = Ne(i, e.sticker, e.aspect), x = !d || p && d.baseAnchor && ["p0", "n", "e1", "e2", "baseAnchor"].every((g) => d[g].every((v, b) => {
        var w;
        return v === ((w = p.frame[g]) == null ? void 0 : w[b]);
      })) && d.reach === p.frame.reach && d.baseRotation === p.frame.baseRotation;
      let o = e.chart && x && e.sticker.mode === "wrap" && (p == null ? void 0 : p.scene) === a && p.edge === e.sticker.edge ? vt(p.frame, i, e.sticker, e.aspect, e.physicalWidth) : null;
      const m = e.sticker.natural ? n.blurMax : 0, c = (g) => Math.max(e.chart ? 2 : 1.25, 1.25 + 6 * m / (g * n.meta.image_w));
      let M = !o;
      if (o || (o = Oe(i, e.sticker, e.aspect, e.physicalWidth, c(e.sticker.size))), o) {
        const g = o.gripDepth ?? o.p0[2], v = e.physicalWidth == null ? e.sticker.size : o.w * i.intrinsics[0][0] / g, b = St("size", v);
        b !== v && (o = Oe(i, { ...e.sticker, size: b, pose: void 0 }, e.aspect, b * g / i.intrinsics[0][0], c(b)), M = !0), o && (o.resolvedSize = b, o.blurPad = 3 * m * o.p0[2] / (i.intrinsics[0][0] * n.meta.image_w)), M && (o != null && o.field) && (delete o.xy, delete o.reached, o.fieldToken = ++Rt, Se.set(e.sourceKey, { scene: a, edge: e.sticker.edge, frame: { ...o } }));
      }
      if (o) {
        o.geometryMs = performance.now() - s, o.lref = e.sticker.natural || e.guideOnly ? 1 : _t({ ...n, grid: i }, o.region), o.referenceMs = performance.now() - s - o.geometryMs, o.anchor = e.sticker.anchor, o.size = e.sticker.size, o.rotation = e.sticker.rotation, o.gridSize = [i.width, i.height], o.guide = yt(i, o), o.screenAspect = n.meta.image_w / n.meta.image_h, o.computeMs = performance.now() - s;
        const g = ve.get(e.sourceKey);
        if (g) {
          const v = performance.now();
          Object.assign(o, Ve(n, o, g, { ...e.sticker, opacity: 1 }, e.viewport ?? [n.width, n.height])), o.rasterMs = performance.now() - v;
        }
        delete o.xy, delete o.reached;
      }
      const h = o ? { ...o } : null;
      if (e.guideOnly) {
        h && (delete h.field, delete h.region), self.postMessage({ id: t, result: h });
        return;
      }
      h != null && h.field && (e.fieldToken === h.fieldToken ? (delete h.field, h.reuseField = !0) : h.field = h.field.slice()), h != null && h.region && (h.region = h.region.slice());
      const u = h ? [h.region.buffer, ...h.field ? [h.field.buffer] : [], ...h.bitmap ? [h.bitmap] : []] : [];
      self.postMessage({ id: t, result: h }, u);
    } else if (l === "release") {
      const n = xe.get(a);
      n && mt(n), xe.delete(a);
      for (const [s, i] of Se) i.scene === a && Se.delete(s);
      xe.size || gt(), self.postMessage({ id: t, result: null });
    }
  } catch (n) {
    self.postMessage({ id: t, error: n.message });
  }
};
