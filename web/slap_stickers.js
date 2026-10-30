import { app as Mt } from "../../scripts/app.js";
import { api as Br } from "../../scripts/api.js";
/**
* @vue/shared v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function Ps(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const i of e.split(",")) t[i] = 1;
  return (i) => i in t;
}
const ie = {}, Et = [], Xe = () => {
}, $r = () => !1, Fi = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Ni = (e) => e.startsWith("onUpdate:"), he = Object.assign, Os = (e, t) => {
  const i = e.indexOf(t);
  i > -1 && e.splice(i, 1);
}, fo = Object.prototype.hasOwnProperty, V = (e, t) => fo.call(e, t), U = Array.isArray, gt = (e) => ui(e) === "[object Map]", Si = (e) => ui(e) === "[object Set]", nr = (e) => ui(e) === "[object Date]", K = (e) => typeof e == "function", se = (e) => typeof e == "string", Ye = (e) => typeof e == "symbol", J = (e) => e !== null && typeof e == "object", Hr = (e) => (J(e) || K(e)) && K(e.then) && K(e.catch), Wr = Object.prototype.toString, ui = (e) => Wr.call(e), uo = (e) => ui(e).slice(8, -1), Vr = (e) => ui(e) === "[object Object]", ks = (e) => se(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Jt = /* @__PURE__ */ Ps(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Li = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((i) => t[i] || (t[i] = e(i)));
}, ho = /-\w/g, Ne = Li(
  (e) => e.replace(ho, (t) => t.slice(1).toUpperCase())
), po = /\B([A-Z])/g, wt = Li(
  (e) => e.replace(po, "-$1").toLowerCase()
), zr = Li((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ji = Li(
  (e) => e ? `on${zr(e)}` : ""
), qe = (e, t) => !Object.is(e, t), Xi = (e, ...t) => {
  for (let i = 0; i < e.length; i++)
    e[i](...t);
}, Gr = (e, t, i, s = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: s,
    value: i
  });
}, go = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let or;
const Ui = () => or || (or = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function ji(e) {
  if (U(e)) {
    const t = {};
    for (let i = 0; i < e.length; i++) {
      const s = e[i], r = se(s) ? wo(s) : ji(s);
      if (r)
        for (const n in r)
          t[n] = r[n];
    }
    return t;
  } else if (se(e) || J(e))
    return e;
}
const mo = /;(?![^(]*\))/g, yo = /:([^]+)/, bo = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function wo(e) {
  const t = {};
  return e.replace(bo, (i) => i.startsWith("/*") ? "" : i).split(mo).forEach((i) => {
    if (i) {
      const s = i.split(yo);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function Is(e) {
  let t = "";
  if (se(e))
    t = e;
  else if (U(e))
    for (let i = 0; i < e.length; i++) {
      const s = Is(e[i]);
      s && (t += s + " ");
    }
  else if (J(e))
    for (const i in e)
      e[i] && (t += i + " ");
  return t.trim();
}
const vo = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly", _o = /* @__PURE__ */ Ps(vo);
function qr(e) {
  return !!e || e === "";
}
function xo(e, t, i) {
  if (e.length !== t.length) return !1;
  let s = !0;
  for (let r = 0; s && r < e.length; r++)
    s = Ki(e[r], t[r], i);
  return s;
}
function lr(e, t, i) {
  if (e.size !== t.size) return !1;
  const s = Array.from(t), r = new Uint8Array(s.length);
  for (const n of e) {
    let o = -1;
    for (let l = 0; l < s.length; l++)
      if (!r[l] && Ki(n, s[l], i)) {
        o = l;
        break;
      }
    if (o < 0) return !1;
    r[o] = 1;
  }
  return !0;
}
function So(e, t, i) {
  let s = gt(e), r = gt(t);
  if (s || r || (s = Si(e), r = Si(t), s || r))
    return s && r ? lr(e, t, i) : !1;
  const n = Object.keys(e).length, o = Object.keys(t).length;
  if (n !== o)
    return !1;
  for (const l in e) {
    const c = e.hasOwnProperty(l), d = t.hasOwnProperty(l);
    if (c && !d || !c && d || !Ki(e[l], t[l], i))
      return !1;
  }
  return String(e) === String(t);
}
function cr(e, t, i, s) {
  i || (i = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [r, n] = i;
  if (r.has(e) || n.has(t))
    return r.get(e) === t && n.get(t) === e;
  r.set(e, t), n.set(t, e);
  const o = s(e, t, i);
  return r.delete(e), n.delete(t), o;
}
function Ki(e, t, i) {
  if (e === t) return !0;
  let s = nr(e), r = nr(t);
  return s || r ? s && r ? e.getTime() === t.getTime() : !1 : (s = Ye(e), r = Ye(t), s || r ? e === t : (s = U(e), r = U(t), s || r ? s && r ? cr(e, t, i, xo) : !1 : (s = J(e), r = J(t), s || r ? !s || !r ? !1 : cr(e, t, i, So) : String(e) === String(t))));
}
const Jr = (e) => !!(e && e.__v_isRef === !0), si = (e) => se(e) ? e : e == null ? "" : U(e) || J(e) && (e.toString === Wr || !K(e.toString)) ? Jr(e) ? si(e.value) : JSON.stringify(e, Xr, 2) : String(e), Xr = (e, t) => Jr(t) ? Xr(e, t.value) : gt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (i, [s, r], n) => (i[Yi(s, n) + " =>"] = r, i),
    {}
  )
} : Si(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((i) => Yi(i))
} : Ye(t) ? Yi(t) : J(t) && !U(t) && !Vr(t) ? String(t) : t, Yi = (e, t = "") => {
  var i;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    Ye(e) ? `Symbol(${(i = e.description) != null ? i : t})` : e
  );
};
/**
* @vue/reactivity v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let fe;
class To {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && fe && (fe.active ? (this.parent = fe, this.index = (fe.scopes || (fe.scopes = [])).push(
      this
    ) - 1) : (this._active = !1, this._warnOnRun = !1));
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, i;
      if (this.scopes) {
        const s = this.scopes.slice();
        for (t = 0, i = s.length; t < i; t++)
          s[t].pause();
      }
      for (t = 0, i = this.effects.length; t < i; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, i;
      if (this.scopes) {
        const r = this.scopes.slice();
        for (t = 0, i = r.length; t < i; t++)
          r[t].resume();
      }
      const s = this.effects.slice();
      for (t = 0, i = s.length; t < i; t++)
        s[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const i = fe;
      try {
        return fe = this, t();
      } finally {
        fe = i;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = fe, fe = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (fe === this)
        fe = this.prevScope;
      else {
        let t = fe;
        for (; t; ) {
          if (t.prevScope === this) {
            t.prevScope = this.prevScope;
            break;
          }
          t = t.prevScope;
        }
      }
      this.prevScope = void 0;
    }
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let i, s;
      for (i = 0, s = this.effects.length; i < s; i++)
        this.effects[i].stop();
      for (this.effects.length = 0, i = 0, s = this.cleanups.length; i < s; i++)
        this.cleanups[i]();
      if (this.cleanups.length = 0, this.scopes) {
        const r = this.scopes.slice();
        for (i = 0, s = r.length; i < s; i++)
          r[i].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop();
        r && r !== this && (this.parent.scopes[this.index] = r, r.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function Eo() {
  return fe;
}
let te;
const Zi = /* @__PURE__ */ new WeakSet();
class Yr {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, fe && (fe.active ? fe.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Zi.has(this) && (Zi.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Qr(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, ar(this), en(this);
    const t = te, i = Le;
    te = this, Le = !0;
    try {
      return this.fn();
    } finally {
      tn(this), te = t, Le = i, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Ns(t);
      this.deps = this.depsTail = void 0, ar(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Zi.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    hs(this) && this.run();
  }
  get dirty() {
    return hs(this);
  }
}
let Zr = 0, Xt, Yt;
function Qr(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Yt, Yt = e;
    return;
  }
  e.next = Xt, Xt = e;
}
function Ds() {
  Zr++;
}
function Fs() {
  if (--Zr > 0)
    return;
  if (Yt) {
    let t = Yt;
    for (Yt = void 0; t; ) {
      const i = t.next;
      t.next = void 0, t.flags &= -9, t = i;
    }
  }
  let e;
  for (; Xt; ) {
    let t = Xt;
    for (Xt = void 0; t; ) {
      const i = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = i;
    }
  }
  if (e) throw e;
}
function en(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function tn(e) {
  let t, i = e.depsTail, s = i;
  for (; s; ) {
    const r = s.prevDep;
    s.version === -1 ? (s === i && (i = r), Ns(s), Mo(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = r;
  }
  e.deps = t, e.depsTail = i;
}
function hs(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (sn(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function sn(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === ri) || (e.globalVersion = ri, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !hs(e))))
    return;
  e.flags |= 2;
  const t = e.dep, i = te, s = Le;
  te = e, Le = !0;
  try {
    en(e);
    const r = e.fn(e._value);
    (t.version === 0 || qe(r, e._value)) && (e.flags |= 128, e._value = r, t.version++);
  } catch (r) {
    throw t.version++, r;
  } finally {
    te = i, Le = s, tn(e), e.flags &= -3;
  }
}
function Ns(e, t = !1) {
  const { dep: i, prevSub: s, nextSub: r } = e;
  if (s && (s.nextSub = r, e.prevSub = void 0), r && (r.prevSub = s, e.nextSub = void 0), i.subs === e && (i.subs = s, !s && i.computed)) {
    i.computed.flags &= -5;
    for (let n = i.computed.deps; n; n = n.nextDep)
      Ns(n, !0);
  }
  !t && !--i.sc && i.map && i.map.delete(i.key);
}
function Mo(e) {
  const { prevDep: t, nextDep: i } = e;
  t && (t.nextDep = i, e.prevDep = void 0), i && (i.prevDep = t, e.nextDep = void 0);
}
let Le = !0;
const rn = [];
function Ze() {
  rn.push(Le), Le = !1;
}
function Qe() {
  const e = rn.pop();
  Le = e === void 0 ? !0 : e;
}
function ar(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const i = te;
    te = void 0;
    try {
      t();
    } finally {
      te = i;
    }
  }
}
let ri = 0;
class Ao {
  constructor(t, i) {
    this.sub = t, this.dep = i, this.version = i.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Ls {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!te || !Le || te === this.computed)
      return;
    let i = this.activeLink;
    if (i === void 0 || i.sub !== te)
      i = this.activeLink = new Ao(te, this), te.deps ? (i.prevDep = te.depsTail, te.depsTail.nextDep = i, te.depsTail = i) : te.deps = te.depsTail = i, nn(i);
    else if (i.version === -1 && (i.version = this.version, i.nextDep)) {
      const s = i.nextDep;
      s.prevDep = i.prevDep, i.prevDep && (i.prevDep.nextDep = s), i.prevDep = te.depsTail, i.nextDep = void 0, te.depsTail.nextDep = i, te.depsTail = i, te.deps === i && (te.deps = s);
    }
    return i;
  }
  trigger(t) {
    this.version++, ri++, this.notify(t);
  }
  notify(t) {
    Ds();
    try {
      for (let i = this.subs; i; i = i.prevSub)
        i.sub.notify() && i.sub.dep.notify();
    } finally {
      Fs();
    }
  }
}
function nn(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        nn(s);
    }
    const i = e.dep.subs;
    i !== e && (e.prevSub = i, i && (i.nextSub = e)), e.dep.subs = e;
  }
}
const ps = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ Symbol(
  ""
), gs = /* @__PURE__ */ Symbol(
  ""
), ni = /* @__PURE__ */ Symbol(
  ""
);
function ue(e, t, i) {
  if (Le && te) {
    let s = ps.get(e);
    s || ps.set(e, s = /* @__PURE__ */ new Map());
    let r = s.get(i);
    r || (s.set(i, r = new Ls()), r.map = s, r.key = i), r.track();
  }
}
function ot(e, t, i, s, r, n) {
  const o = ps.get(e);
  if (!o) {
    ri++;
    return;
  }
  const l = (c) => {
    c && c.trigger();
  };
  if (Ds(), t === "clear")
    o.forEach(l);
  else {
    const c = U(e), d = c && ks(i);
    if (c && i === "length") {
      const f = Number(s);
      o.forEach((g, h) => {
        (h === "length" || h === ni || !Ye(h) && h >= f) && l(g);
      });
    } else
      switch ((i !== void 0 || o.has(void 0)) && l(o.get(i)), d && l(o.get(ni)), t) {
        case "add":
          c ? d && l(o.get("length")) : (l(o.get(At)), gt(e) && l(o.get(gs)));
          break;
        case "delete":
          c || (l(o.get(At)), gt(e) && l(o.get(gs)));
          break;
        case "set":
          gt(e) && l(o.get(At));
          break;
      }
  }
  Fs();
}
function Ot(e) {
  const t = /* @__PURE__ */ q(e);
  return t === e || (ue(t, "iterate", ni), /* @__PURE__ */ Re(e)) ? t : /* @__PURE__ */ et(e) ? /* @__PURE__ */ mt(e) ? t.map((i) => yt(Pe(i))) : t.map(yt) : t.map(Pe);
}
function Bi(e) {
  return ue(e = /* @__PURE__ */ q(e), "iterate", ni), e;
}
function Ve(e, t) {
  return /* @__PURE__ */ et(e) ? yt(/* @__PURE__ */ mt(e) ? Pe(t) : t) : Pe(t);
}
const Co = {
  __proto__: null,
  [Symbol.iterator]() {
    return Qi(this, Symbol.iterator, (e) => Ve(this, e));
  },
  concat(...e) {
    return Ot(this).concat(
      ...e.map((t) => U(t) ? Ot(t) : t)
    );
  },
  entries() {
    return Qi(this, "entries", (e) => (e[1] = Ve(this, e[1]), e));
  },
  every(e, t) {
    return st(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return st(
      this,
      "filter",
      e,
      t,
      (i) => i.map((s) => Ve(this, s)),
      arguments
    );
  },
  find(e, t) {
    return st(
      this,
      "find",
      e,
      t,
      (i) => Ve(this, i),
      arguments
    );
  },
  findIndex(e, t) {
    return st(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return st(
      this,
      "findLast",
      e,
      t,
      (i) => Ve(this, i),
      arguments
    );
  },
  findLastIndex(e, t) {
    return st(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return st(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return es(this, "includes", e);
  },
  indexOf(...e) {
    return es(this, "indexOf", e);
  },
  join(e) {
    return Ot(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return es(this, "lastIndexOf", e);
  },
  map(e, t) {
    return st(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Kt(this, "pop");
  },
  push(...e) {
    return Kt(this, "push", e);
  },
  reduce(e, ...t) {
    return ur(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return ur(this, "reduceRight", e, t);
  },
  shift() {
    return Kt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return st(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Kt(this, "splice", e);
  },
  toReversed() {
    return Ot(this).toReversed();
  },
  toSorted(e) {
    return Ot(this).toSorted(e);
  },
  toSpliced(...e) {
    return Ot(this).toSpliced(...e);
  },
  unshift(...e) {
    return Kt(this, "unshift", e);
  },
  values() {
    return Qi(this, "values", (e) => Ve(this, e));
  }
};
function Qi(e, t, i) {
  const s = Bi(e), r = s[t], n = r.call(s);
  if (s !== e && !/* @__PURE__ */ Re(e)) {
    if (n[Symbol.toStringTag] === "Array Iterator") {
      const o = Object.create(Object.getPrototypeOf(n));
      return o.next = () => fr(n.next(), i), r !== on[t] && Object.defineProperties(o, {
        return: {
          get() {
            const l = n.return;
            return typeof l == "function" ? l.bind(n) : l;
          }
        },
        throw: {
          get() {
            const l = n.throw;
            return typeof l == "function" ? l.bind(n) : l;
          }
        }
      }), o;
    }
    n._next = n.next, n.next = () => fr(n._next(), i);
  }
  return n;
}
function fr(e, t) {
  return e.done || (e.value = t(e.value)), e;
}
const on = Array.prototype;
function st(e, t, i, s, r, n) {
  const o = Bi(e), l = o !== e && !/* @__PURE__ */ Re(e), c = o[t];
  if (c !== on[t]) {
    const g = c.apply(e, n);
    return l ? Pe(g) : g;
  }
  let d = i;
  o !== e && (l ? d = function(g, h) {
    return i.call(this, Ve(e, g), h, e);
  } : i.length > 2 && (d = function(g, h) {
    return i.call(this, g, h, e);
  }));
  const f = c.call(o, d, s);
  return l && r ? r(f) : f;
}
function ur(e, t, i, s) {
  const r = Bi(e), n = r !== e && !/* @__PURE__ */ Re(e);
  let o = i, l = !1;
  r !== e && (n ? (l = s.length === 0, o = function(d, f, g) {
    return l && (l = !1, d = Ve(e, d)), i.call(this, d, Ve(e, f), g, e);
  }) : i.length > 3 && (o = function(d, f, g) {
    return i.call(this, d, f, g, e);
  }));
  const c = r[t](o, ...s);
  return l ? Ve(e, c) : c;
}
function es(e, t, i) {
  const s = /* @__PURE__ */ q(e);
  ue(s, "iterate", ni);
  const r = s[t](...i);
  return (r === -1 || r === !1) && /* @__PURE__ */ Bs(i[0]) ? (i[0] = /* @__PURE__ */ q(i[0]), s[t](...i)) : r;
}
function Kt(e, t, i = []) {
  Ze(), Ds();
  const s = (/* @__PURE__ */ q(e))[t].apply(e, i);
  return Fs(), Qe(), s;
}
const Ro = /* @__PURE__ */ Ps("__proto__,__v_isRef,__isVue"), ln = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Ye)
);
function Po(e) {
  Ye(e) || (e = String(e));
  const t = /* @__PURE__ */ q(this);
  return ue(t, "has", e), t.hasOwnProperty(e);
}
class cn {
  constructor(t = !1, i = !1) {
    this._isReadonly = t, this._isShallow = i;
  }
  get(t, i, s) {
    if (i === "__v_skip") return t.__v_skip;
    const r = this._isReadonly, n = this._isShallow;
    if (i === "__v_isReactive")
      return !r;
    if (i === "__v_isReadonly")
      return r;
    if (i === "__v_isShallow")
      return n;
    if (i === "__v_raw")
      return s === (r ? n ? Ko : dn : n ? un : fn).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const o = U(t);
    if (!r) {
      let c;
      if (o && (c = Co[i]))
        return c;
      if (i === "hasOwnProperty")
        return Po;
    }
    const l = Reflect.get(
      t,
      i,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ de(t) ? t : s
    );
    if ((Ye(i) ? ln.has(i) : Ro(i)) || (r || ue(t, "get", i), n))
      return l;
    if (/* @__PURE__ */ de(l)) {
      const c = o && ks(i) ? l : l.value;
      return r && J(c) ? /* @__PURE__ */ ys(c) : c;
    }
    return J(l) ? r ? /* @__PURE__ */ ys(l) : /* @__PURE__ */ js(l) : l;
  }
}
class an extends cn {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, i, s, r) {
    let n = t[i];
    const o = U(t) && ks(i);
    if (!this._isShallow) {
      const d = /* @__PURE__ */ et(n);
      if (!/* @__PURE__ */ Re(s) && !/* @__PURE__ */ et(s) && (n = /* @__PURE__ */ q(n), s = /* @__PURE__ */ q(s)), !o && /* @__PURE__ */ de(n) && !/* @__PURE__ */ de(s))
        return d || (n.value = s), !0;
    }
    const l = o ? Number(i) < t.length : V(t, i), c = Reflect.set(
      t,
      i,
      s,
      /* @__PURE__ */ de(t) ? t : r
    );
    return t === /* @__PURE__ */ q(r) && c && (l ? qe(s, n) && ot(t, "set", i, s) : ot(t, "add", i, s)), c;
  }
  deleteProperty(t, i) {
    const s = V(t, i);
    t[i];
    const r = Reflect.deleteProperty(t, i);
    return r && s && ot(t, "delete", i, void 0), r;
  }
  has(t, i) {
    const s = Reflect.has(t, i);
    return (!Ye(i) || !ln.has(i)) && ue(t, "has", i), s;
  }
  ownKeys(t) {
    return ue(
      t,
      "iterate",
      U(t) ? "length" : At
    ), Reflect.ownKeys(t);
  }
}
class Oo extends cn {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, i) {
    return !0;
  }
  deleteProperty(t, i) {
    return !0;
  }
}
const ko = /* @__PURE__ */ new an(), Io = /* @__PURE__ */ new Oo(), Do = /* @__PURE__ */ new an(!0);
const ms = (e) => e, gi = (e) => Reflect.getPrototypeOf(e);
function Fo(e, t, i) {
  return function(...s) {
    const r = this.__v_raw, n = /* @__PURE__ */ q(r), o = gt(n), l = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, d = r[e](...s), f = i ? ms : t ? yt : Pe;
    return !t && ue(
      n,
      "iterate",
      c ? gs : At
    ), he(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: g, done: h } = d.next();
          return h ? { value: g, done: h } : {
            value: l ? [f(g[0]), f(g[1])] : f(g),
            done: h
          };
        }
      }
    );
  };
}
function mi(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function No(e, t) {
  const i = {
    get(r) {
      const n = this.__v_raw, o = /* @__PURE__ */ q(n), l = /* @__PURE__ */ q(r);
      e || (qe(r, l) && ue(o, "get", r), ue(o, "get", l));
      const { has: c } = gi(o), d = t ? ms : e ? yt : Pe;
      if (c.call(o, r))
        return d(n.get(r));
      if (c.call(o, l))
        return d(n.get(l));
      n !== o && n.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !e && ue(/* @__PURE__ */ q(r), "iterate", At), r.size;
    },
    has(r) {
      const n = this.__v_raw, o = /* @__PURE__ */ q(n), l = /* @__PURE__ */ q(r);
      return e || (qe(r, l) && ue(o, "has", r), ue(o, "has", l)), r === l ? n.has(r) : n.has(r) || n.has(l);
    },
    forEach(r, n) {
      const o = this, l = o.__v_raw, c = /* @__PURE__ */ q(l), d = t ? ms : e ? yt : Pe;
      return !e && ue(c, "iterate", At), l.forEach((f, g) => r.call(n, d(f), d(g), o));
    }
  };
  return he(
    i,
    e ? {
      add: mi("add"),
      set: mi("set"),
      delete: mi("delete"),
      clear: mi("clear")
    } : {
      add(r) {
        const n = /* @__PURE__ */ q(this), o = gi(n), l = /* @__PURE__ */ q(r), c = !t && !/* @__PURE__ */ Re(r) && !/* @__PURE__ */ et(r) ? l : r;
        return o.has.call(n, c) || qe(r, c) && o.has.call(n, r) || qe(l, c) && o.has.call(n, l) || (n.add(c), ot(n, "add", c, c)), this;
      },
      set(r, n) {
        !t && !/* @__PURE__ */ Re(n) && !/* @__PURE__ */ et(n) && (n = /* @__PURE__ */ q(n));
        const o = /* @__PURE__ */ q(this), { has: l, get: c } = gi(o);
        let d = l.call(o, r);
        d || (r = /* @__PURE__ */ q(r), d = l.call(o, r));
        const f = c.call(o, r);
        return o.set(r, n), d ? qe(n, f) && ot(o, "set", r, n) : ot(o, "add", r, n), this;
      },
      delete(r) {
        const n = /* @__PURE__ */ q(this), { has: o, get: l } = gi(n);
        let c = o.call(n, r);
        c || (r = /* @__PURE__ */ q(r), c = o.call(n, r)), l && l.call(n, r);
        const d = n.delete(r);
        return c && ot(n, "delete", r, void 0), d;
      },
      clear() {
        const r = /* @__PURE__ */ q(this), n = r.size !== 0, o = r.clear();
        return n && ot(
          r,
          "clear",
          void 0,
          void 0
        ), o;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((r) => {
    i[r] = Fo(r, e, t);
  }), i;
}
function Us(e, t) {
  const i = No(e, t);
  return (s, r, n) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_isShallow" ? t : r === "__v_raw" ? s : Reflect.get(
    V(i, r) && r in s ? i : s,
    r,
    n
  );
}
const Lo = {
  get: /* @__PURE__ */ Us(!1, !1)
}, Uo = {
  get: /* @__PURE__ */ Us(!1, !0)
}, jo = {
  get: /* @__PURE__ */ Us(!0, !1)
};
const fn = /* @__PURE__ */ new WeakMap(), un = /* @__PURE__ */ new WeakMap(), dn = /* @__PURE__ */ new WeakMap(), Ko = /* @__PURE__ */ new WeakMap();
function Bo(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
// @__NO_SIDE_EFFECTS__
function js(e) {
  return /* @__PURE__ */ et(e) ? e : Ks(
    e,
    !1,
    ko,
    Lo,
    fn
  );
}
// @__NO_SIDE_EFFECTS__
function hn(e) {
  return Ks(
    e,
    !1,
    Do,
    Uo,
    un
  );
}
// @__NO_SIDE_EFFECTS__
function ys(e) {
  return Ks(
    e,
    !0,
    Io,
    jo,
    dn
  );
}
function Ks(e, t, i, s, r) {
  if (!J(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const n = r.get(e);
  if (n)
    return n;
  const o = Bo(uo(e));
  if (o === 0)
    return e;
  const l = new Proxy(
    e,
    o === 2 ? s : i
  );
  return r.set(e, l), l;
}
// @__NO_SIDE_EFFECTS__
function mt(e) {
  return /* @__PURE__ */ et(e) ? /* @__PURE__ */ mt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function et(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Re(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Bs(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function q(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ q(t) : e;
}
function $o(e) {
  return !V(e, "__v_skip") && Object.isExtensible(e) && Gr(e, "__v_skip", !0), e;
}
const Pe = (e) => J(e) ? /* @__PURE__ */ js(e) : e, yt = (e) => J(e) ? /* @__PURE__ */ ys(e) : e;
// @__NO_SIDE_EFFECTS__
function de(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Fe(e) {
  return Ho(e, !1);
}
function Ho(e, t) {
  return /* @__PURE__ */ de(e) ? e : new Wo(e, t);
}
class Wo {
  constructor(t, i) {
    this.dep = new Ls(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = i ? t : /* @__PURE__ */ q(t), this._value = i ? t : Pe(t), this.__v_isShallow = i;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const i = this._rawValue, s = this.__v_isShallow || /* @__PURE__ */ Re(t) || /* @__PURE__ */ et(t);
    t = s ? t : /* @__PURE__ */ q(t), qe(t, i) && (this._rawValue = t, this._value = s ? t : Pe(t), this.dep.trigger());
  }
}
function Vo(e) {
  return /* @__PURE__ */ de(e) ? e.value : e;
}
const zo = {
  get: (e, t, i) => t === "__v_raw" ? e : Vo(Reflect.get(e, t, i)),
  set: (e, t, i, s) => {
    const r = e[t];
    return /* @__PURE__ */ de(r) && !/* @__PURE__ */ de(i) ? (r.value = i, !0) : Reflect.set(e, t, i, s);
  }
};
function pn(e) {
  return /* @__PURE__ */ mt(e) ? e : new Proxy(e, zo);
}
class Go {
  constructor(t, i, s) {
    this.fn = t, this.setter = i, this._value = void 0, this.dep = new Ls(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = ri - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !i, this.isSSR = s;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    te !== this)
      return Qr(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return sn(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function qo(e, t, i = !1) {
  let s, r;
  return K(e) ? s = e : (s = e.get, r = e.set), new Go(s, r, i);
}
const yi = {}, Ti = /* @__PURE__ */ new WeakMap();
let xt;
function Jo(e, t = !1, i = xt) {
  if (i) {
    let s = Ti.get(i);
    s || Ti.set(i, s = []), s.push(e);
  }
}
function Xo(e, t, i = ie) {
  const { immediate: s, deep: r, once: n, scheduler: o, augmentJob: l, call: c } = i, d = (M) => r ? M : /* @__PURE__ */ Re(M) || r === !1 || r === 0 ? ht(M, 1) : ht(M);
  let f, g, h, u, m = !1, y = !1;
  if (/* @__PURE__ */ de(e) ? (g = () => e.value, m = /* @__PURE__ */ Re(e)) : /* @__PURE__ */ mt(e) ? (g = () => d(e), m = !0) : U(e) ? (y = !0, m = e.some((M) => /* @__PURE__ */ mt(M) || /* @__PURE__ */ Re(M)), g = () => e.map((M) => {
    if (/* @__PURE__ */ de(M))
      return M.value;
    if (/* @__PURE__ */ mt(M))
      return d(M);
    if (K(M))
      return c ? c(M, 2) : M();
  })) : K(e) ? t ? g = c ? () => c(e, 2) : e : g = () => {
    if (h) {
      Ze();
      try {
        h();
      } finally {
        Qe();
      }
    }
    const M = xt;
    xt = f;
    try {
      return c ? c(e, 3, [u]) : e(u);
    } finally {
      xt = M;
    }
  } : g = Xe, t && r) {
    const M = g, N = r === !0 ? 1 / 0 : r;
    g = () => ht(M(), N);
  }
  const w = Eo(), T = () => {
    f.stop(), w && w.active && Os(w.effects, f);
  };
  if (n && t) {
    const M = t;
    t = (...N) => {
      try {
        return M(...N);
      } finally {
        T();
      }
    };
  }
  let E = y ? new Array(e.length).fill(yi) : yi;
  const I = (M) => {
    if (!(!(f.flags & 1) || !f.dirty && !M))
      if (t) {
        const N = f.run();
        if (M || r || m || (y ? N.some((Z, O) => qe(Z, E[O])) : qe(N, E))) {
          const Z = xt;
          Ze();
          try {
            h && h(), xt = f;
            const O = [
              N,
              // pass undefined as the old value when it's changed for the first time
              E === yi ? void 0 : y && E[0] === yi ? [] : E,
              u
            ];
            E = N, c ? c(t, 3, O) : (
              // @ts-expect-error
              t(...O)
            );
          } finally {
            xt = Z, Qe();
          }
        }
      } else
        f.run();
  };
  return l && l(I), f = new Yr(g), f.scheduler = o ? () => o(I, !1) : I, u = (M) => Jo(M, !1, f), h = f.onStop = () => {
    const M = Ti.get(f);
    if (M) {
      if (c)
        c(M, 4);
      else
        for (const N of M) N();
      Ti.delete(f);
    }
  }, t ? s ? I(!0) : E = f.run() : o ? o(I.bind(null, !0), !0) : f.run(), T.pause = f.pause.bind(f), T.resume = f.resume.bind(f), T.stop = T, T;
}
function ht(e, t = 1 / 0, i) {
  if (t <= 0 || !J(e) || e.__v_skip || (i = i || /* @__PURE__ */ new Map(), (i.get(e) || 0) >= t))
    return e;
  if (i.set(e, t), t--, /* @__PURE__ */ de(e))
    ht(e.value, t, i);
  else if (U(e))
    for (let s = 0; s < e.length; s++)
      ht(e[s], t, i);
  else if (Si(e) || gt(e))
    e.forEach((s) => {
      ht(s, t, i);
    });
  else if (Vr(e)) {
    for (const s in e)
      ht(e[s], t, i);
    for (const s of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, s) && ht(e[s], t, i);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function di(e, t, i, s) {
  try {
    return s ? e(...s) : e();
  } catch (r) {
    $i(r, t, i);
  }
}
function Ue(e, t, i, s) {
  if (K(e)) {
    const r = di(e, t, i, s);
    return r && Hr(r) && r.catch((n) => {
      $i(n, t, i);
    }), r;
  }
  if (U(e)) {
    const r = [];
    for (let n = 0; n < e.length; n++)
      r.push(Ue(e[n], t, i, s));
    return r;
  }
}
function $i(e, t, i, s = !0) {
  const r = t ? t.vnode : null, { errorHandler: n, throwUnhandledErrorInProduction: o } = t && t.appContext.config || ie;
  if (t) {
    let l = t.parent;
    const c = t.proxy, d = `https://vuejs.org/error-reference/#runtime-${i}`;
    for (; l; ) {
      const f = l.ec;
      if (f) {
        for (let g = 0; g < f.length; g++)
          if (f[g](e, c, d) === !1)
            return;
      }
      l = l.parent;
    }
    if (n) {
      Ze(), di(n, null, 10, [
        e,
        c,
        d
      ]), Qe();
      return;
    }
  }
  Yo(e, i, r, s, o);
}
function Yo(e, t, i, s = !0, r = !1) {
  if (r)
    throw e;
  console.error(e);
}
const be = [];
let Ie = -1;
const ze = [];
let dt = null, kt = 0;
const gn = /* @__PURE__ */ Promise.resolve();
let Ei = null;
function $s(e) {
  const t = Ei || gn;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Zo(e) {
  let t = Ie + 1, i = be.length;
  for (; t < i; ) {
    const s = t + i >>> 1, r = be[s], n = oi(r);
    n < e || n === e && r.flags & 2 ? t = s + 1 : i = s;
  }
  return t;
}
function Hs(e) {
  if (!(e.flags & 1)) {
    const t = oi(e), i = be[be.length - 1];
    !i || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= oi(i) ? be.push(e) : be.splice(Zo(t), 0, e), e.flags |= 1, mn();
  }
}
function mn() {
  Ei || (Ei = gn.then(wn));
}
function Qo(e) {
  if (!U(e))
    dt && e.id === -1 ? dt.splice(kt + 1, 0, e) : e.flags & 1 || (ze.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      ze.push(e[t]);
  mn();
}
function yn(e, t, i, s = Ie + 1) {
  for (; s < be.length; s++) {
    const r = be[s];
    if (r && r.flags & 2) {
      if (e && r.id !== e.uid || t !== void 0 && !(r.id >= t))
        continue;
      be.splice(s, 1), s = e ? s - 1 : Ie, r.flags & 4 && (r.flags &= -2), r(), r.flags & 4 || (r.flags &= -2);
    }
  }
}
function bn(e, t, i = 0) {
  if (ze.length) {
    let s = ze, r = 0;
    if (t) {
      s = [];
      for (let o = 0; o < ze.length; o++) {
        const l = ze[o];
        (l.i !== void 0 ? !l.i || l.i.uid < i : t.has(l)) ? ze[r++] = l : s.push(l);
      }
    }
    const n = [...new Set(s)].sort((o, l) => oi(o) - oi(l));
    if (ze.length = r, dt) {
      for (let o = 0; o < n.length; o++)
        dt.push(n[o]);
      return;
    }
    for (dt = n, kt = 0; kt < dt.length; kt++) {
      const o = dt[kt];
      o.flags & 4 && (o.flags &= -2), o.flags & 8 || o(), o.flags &= -2;
    }
    dt = null, kt = 0;
  }
}
let ts = !1;
function el(e, t) {
  if (ts) {
    e();
    return;
  }
  const i = t === void 0 ? void 0 : new Set(ze);
  e(), ts = !0;
  try {
    yn(void 0, t), bn(void 0, i, t);
  } finally {
    ts = !1;
  }
}
const oi = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function wn(e) {
  try {
    for (Ie = 0; Ie < be.length; Ie++) {
      const t = be[Ie];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), di(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; Ie < be.length; Ie++) {
      const t = be[Ie];
      t && (t.flags &= -2);
    }
    Ie = -1, be.length = 0, bn(), Ei = null, (be.length || ze.length) && wn();
  }
}
let Je = null, vn = null;
function Mi(e) {
  const t = Je;
  return Je = e, vn = e && e.type.__scopeId || null, t;
}
function tl(e, t = Je, i) {
  if (!t || e._n)
    return e;
  const s = (...r) => {
    s._d && Pi(-1);
    const n = Mi(t), o = Ct.length;
    let l;
    try {
      l = e(...r);
    } finally {
      for (let c = Ct.length; c > o; c--) Vn();
      Mi(n), s._d && Pi(1);
    }
    return l;
  };
  return s._n = !0, s._c = !0, s._d = !0, s;
}
function vt(e, t, i, s) {
  const r = e.dirs, n = t && t.dirs;
  for (let o = 0; o < r.length; o++) {
    const l = r[o];
    n && (l.oldValue = n[o].value);
    let c = l.dir[s];
    c && (Ze(), Ue(c, i, 8, [
      e.el,
      l,
      e,
      t
    ]), Qe());
  }
}
function il(e, t) {
  if (we) {
    let i = we.provides;
    const s = we.parent && we.parent.provides;
    s === i && (i = we.provides = Object.create(s)), i[e] = t;
  }
}
function _i(e, t, i = !1) {
  const s = ec();
  if (s || Ft) {
    let r = Ft ? Ft._context.provides : s ? s.parent == null || s.ce ? s.vnode.appContext && s.vnode.appContext.provides : s.parent.provides : void 0;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return i && K(t) ? t.call(s && s.proxy) : t;
  }
}
const sl = /* @__PURE__ */ Symbol.for("v-scx"), rl = () => _i(sl);
function is(e, t, i) {
  return _n(e, t, i);
}
function _n(e, t, i = ie) {
  const { immediate: s, deep: r, flush: n, once: o } = i, l = he({}, i), c = t && s || !t && n !== "post";
  let d;
  if (fi) {
    if (n === "sync") {
      const u = rl();
      d = u.__watcherHandles || (u.__watcherHandles = []);
    } else if (!c) {
      const u = () => {
      };
      return u.stop = Xe, u.resume = Xe, u.pause = Xe, u;
    }
  }
  const f = we;
  l.call = (u, m, y) => Ue(u, f, m, y);
  let g = !1;
  n === "post" ? l.scheduler = (u) => {
    u.i = f, ge(u, f && f.suspense);
  } : n !== "sync" && (g = !0, l.scheduler = (u, m) => {
    m ? u() : Hs(u);
  }), l.augmentJob = (u) => {
    t && (u.flags |= 4), g && (u.flags |= 2, f && (u.id = f.uid, u.i = f));
  };
  const h = Xo(e, t, l);
  return fi && (d ? d.push(h) : c && h()), h;
}
function nl(e, t, i) {
  const s = this.proxy, r = se(e) ? e.includes(".") ? xn(s, e) : () => s[e] : e.bind(s, s);
  let n;
  K(t) ? n = t : (n = t.handler, i = t);
  const o = hi(this), l = _n(r, n.bind(s), i);
  return o(), l;
}
function xn(e, t) {
  const i = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < i.length && s; r++)
      s = s[i[r]];
    return s;
  };
}
const ut = /* @__PURE__ */ new WeakMap(), Sn = /* @__PURE__ */ Symbol("_vte"), Hi = (e) => e.__isTeleport, St = (e) => e && (e.disabled || e.disabled === ""), ol = (e) => e && (e.defer || e.defer === ""), dr = (e) => typeof SVGElement < "u" && e instanceof SVGElement, hr = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, bs = (e, t) => {
  const i = e && e.to;
  return se(i) ? t ? t(i) : null : i;
}, ll = {
  name: "Teleport",
  __isTeleport: !0,
  process(e, t, i, s, r, n, o, l, c, d) {
    const {
      mc: f,
      pc: g,
      pbc: h,
      o: { insert: u, querySelector: m, createText: y, createComment: w, parentNode: T }
    } = d, E = St(t.props);
    let { dynamicChildren: I } = t;
    const M = (O, B, W) => {
      O.shapeFlag & 16 && f(
        O.children,
        B,
        W,
        r,
        n,
        o,
        l,
        c
      );
    }, N = (O = t) => {
      const B = St(O.props), W = O.target = bs(O.props, m), re = ws(W, O, y, u);
      W && (o !== "svg" && dr(W) ? o = "svg" : o !== "mathml" && hr(W) && (o = "mathml"), r && r.isCE && (r.ce._teleportTargets || (r.ce._teleportTargets = /* @__PURE__ */ new Set())).add(W), B || (M(O, W, re), Vt(O, !1)));
    }, Z = (O) => {
      const B = () => {
        if (ut.get(O) === B) {
          if (ut.delete(O), St(O.props)) {
            const W = T(O.el) || i;
            M(O, W, O.anchor), Vt(O, !0);
          }
          N(O);
        }
      };
      ut.set(O, B), ge(B, n);
    };
    if (e == null) {
      const O = t.el = y(""), B = t.anchor = y("");
      if (u(O, i, s), u(B, i, s), ol(t.props) || n && n.pendingBranch) {
        Z(t);
        return;
      }
      E && (M(t, i, B), Vt(t, !0)), N();
    } else {
      t.el = e.el;
      const O = t.anchor = e.anchor, B = ut.get(e);
      if (B) {
        B.flags |= 8, ut.delete(e), Z(t);
        return;
      }
      t.targetStart = e.targetStart;
      const W = t.target = e.target, re = t.targetAnchor = e.targetAnchor, _e = St(e.props), Oe = _e ? i : W, tt = _e ? O : re;
      if (o === "svg" || dr(W) ? o = "svg" : (o === "mathml" || hr(W)) && (o = "mathml"), I ? (h(
        e.dynamicChildren,
        I,
        Oe,
        r,
        n,
        o,
        l
      ), Gs(e, t, !0)) : c || g(
        e,
        t,
        Oe,
        tt,
        r,
        n,
        o,
        l,
        !1
      ), E)
        _e ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : bi(
          t,
          i,
          O,
          d,
          1
        );
      else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
        const ke = bs(t.props, m);
        ke && (t.target = ke, bi(
          t,
          ke,
          null,
          d,
          0
        ));
      } else _e && bi(
        t,
        W,
        re,
        d,
        1
      );
      Vt(t, E);
    }
  },
  remove(e, t, i, { um: s, o: { remove: r } }, n) {
    const {
      shapeFlag: o,
      children: l,
      anchor: c,
      targetStart: d,
      targetAnchor: f,
      target: g,
      props: h
    } = e, u = St(h), m = n || !u, y = ut.get(e);
    if (y && (y.flags |= 8, ut.delete(e)), g && (r(d), r(f)), n && r(c), !y && (u || g) && o & 16)
      for (let w = 0; w < l.length; w++) {
        const T = l[w];
        s(
          T,
          t,
          i,
          m,
          !!T.dynamicChildren
        );
      }
  },
  move: bi,
  hydrate: cl
};
function bi(e, t, i, { o: { insert: s }, m: r }, n = 2) {
  n === 0 && (e.targetStart && s(e.targetStart, t, i), s(e.targetAnchor, t, i), i = e.targetAnchor);
  const { el: o, anchor: l, shapeFlag: c, children: d, props: f } = e, g = n === 2;
  if (g && s(o, t, i), !ut.has(e) && (!g || St(f)) && c & 16)
    for (let h = 0; h < d.length; h++)
      r(
        d[h],
        t,
        i,
        2
      );
  g && s(l, t, i);
}
function cl(e, t, i, s, r, n, {
  o: { nextSibling: o, parentNode: l, querySelector: c, insert: d, createText: f }
}, g) {
  function h(w, T) {
    let E = T;
    for (; E; ) {
      if (E && E.nodeType === 8) {
        if (E.data === "teleport start anchor")
          t.targetStart = E;
        else if (E.data === "teleport anchor") {
          t.targetAnchor = E, w._lpa = t.targetAnchor && o(t.targetAnchor);
          break;
        }
      }
      E = o(E);
    }
  }
  function u(w, T) {
    T.anchor = g(
      o(w),
      T,
      l(w),
      i,
      s,
      r,
      n
    );
  }
  const m = t.target = bs(
    t.props,
    c
  ), y = St(t.props);
  if (m) {
    const w = m._lpa || m.firstChild;
    t.shapeFlag & 16 && (y ? (u(e, t), h(m, w), t.targetAnchor || ws(
      m,
      t,
      f,
      d,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      l(e) === m ? e : null
    )) : (t.anchor = o(e), h(m, w), t.targetAnchor || ws(m, t, f, d), g(
      w && o(w),
      t,
      m,
      i,
      s,
      r,
      n
    ))), Vt(t, y);
  } else y && t.shapeFlag & 16 && (u(e, t), t.targetStart = e, t.targetAnchor = o(e));
  return t.anchor && o(t.anchor);
}
const al = ll;
function Vt(e, t) {
  const i = e.ctx;
  if (i && i.ut) {
    let s, r;
    for (t ? (s = e.el, r = e.anchor) : (s = e.targetStart, r = e.targetAnchor); s && s !== r; )
      s.nodeType === 1 && s.setAttribute("data-v-owner", i.uid), s = s.nextSibling;
    i.ut();
  }
}
function ws(e, t, i, s, r = null) {
  const n = t.targetStart = i(""), o = t.targetAnchor = i("");
  return n[Sn] = o, e && (s(n, e, r), s(o, e, r)), o;
}
const ss = /* @__PURE__ */ Symbol("_leaveCb");
function fl(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const i of e)
      if (i.type !== je) {
        t = i;
        break;
      }
  }
  return t;
}
function Tn(e) {
  if (!Ws(e))
    return Hi(e.type) && e.children ? fl(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: i } = e;
  if (i) {
    if (t & 16)
      return i[0];
    if (t & 32 && K(i.default))
      return i.default();
  }
}
function Ai(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const i = e.component.subTree;
    Ai(
      Hi(i.type) && Tn(i) || i,
      t
    );
  } else if (e.shapeFlag & 128)
    e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
  else if (e.transition = t, e.type === Me && U(e.children)) {
    const i = In(e.children, !1);
    i && Ai(i, t);
  }
}
function vs(e) {
  if (e.component)
    return vs(e.component.subTree);
  if (e.type === Me) {
    const t = U(e.children) && In(e.children, !1);
    return t ? vs(t) : void 0;
  }
  if (e.type !== je)
    return e;
}
function En(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function pr(e, t) {
  let i;
  return !!((i = Object.getOwnPropertyDescriptor(e, t)) && !i.configurable);
}
const Ci = /* @__PURE__ */ new WeakMap();
function Zt(e, t, i, s, r = !1) {
  if (U(e)) {
    e.forEach(
      (y, w) => Zt(
        y,
        t && (U(t) ? t[w] : t),
        i,
        s,
        r
      )
    );
    return;
  }
  if (Qt(s) && !r) {
    s.shapeFlag & 512 && s.type.__asyncResolved && s.component.subTree.component && Zt(e, t, i, s.component.subTree);
    return;
  }
  const n = s.shapeFlag & 4 ? Js(s.component) : s.el, o = r ? null : n, { i: l, r: c } = e, d = t && t.r, f = l.refs === ie ? l.refs = {} : l.refs, g = l.setupState, h = /* @__PURE__ */ q(g), u = g === ie ? $r : (y) => pr(f, y) ? !1 : V(h, y), m = (y, w) => !(w && pr(f, w));
  if (d != null && d !== c) {
    if (gr(t), se(d))
      f[d] = null, u(d) && (g[d] = null);
    else if (/* @__PURE__ */ de(d)) {
      const y = t;
      m(d, y.k) && (d.value = null), y.k && (f[y.k] = null);
    }
  }
  if (K(c))
    di(c, l, 12, [o, f]);
  else {
    const y = se(c), w = /* @__PURE__ */ de(c);
    if (y || w) {
      const T = () => {
        if (e.f) {
          const E = y ? u(c) ? g[c] : f[c] : m() || !e.k ? c.value : f[e.k];
          if (r)
            U(E) && Os(E, n);
          else if (U(E))
            E.includes(n) || E.push(n);
          else if (y)
            f[c] = [n], u(c) && (g[c] = f[c]);
          else {
            const I = [n];
            m(c, e.k) && (c.value = I), e.k && (f[e.k] = I);
          }
        } else y ? (f[c] = o, u(c) && (g[c] = o)) : w && (m(c, e.k) && (c.value = o), e.k && (f[e.k] = o));
      };
      if (o) {
        const E = () => {
          T(), Ci.delete(e);
        };
        E.id = -1, Ci.set(e, E), ge(E, i);
      } else
        gr(e), T();
    }
  }
}
function gr(e) {
  const t = Ci.get(e);
  t && (t.flags |= 8, Ci.delete(e));
}
Ui().requestIdleCallback;
Ui().cancelIdleCallback;
const Qt = (e) => !!e.type.__asyncLoader, Ws = (e) => e.type.__isKeepAlive;
function ul(e, t) {
  Mn(e, "a", t);
}
function dl(e, t) {
  Mn(e, "da", t);
}
function Mn(e, t, i = we) {
  const s = e.__wdc || (e.__wdc = () => {
    let r = i;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return e();
  });
  if (Wi(t, s, i), i) {
    let r = i.parent;
    for (; r && r.parent; )
      Ws(r.parent.vnode) && hl(s, t, i, r), r = r.parent;
  }
}
function hl(e, t, i, s) {
  const r = Wi(
    t,
    e,
    s,
    !0
    /* prepend */
  );
  Cn(() => {
    Os(s[t], r);
  }, i);
}
function Wi(e, t, i = we, s = !1) {
  if (i) {
    const r = i[e] || (i[e] = []), n = t.__weh || (t.__weh = (...o) => {
      Ze();
      const l = hi(i), c = Ue(t, i, e, o);
      return l(), Qe(), c;
    });
    return s ? r.unshift(n) : r.push(n), n;
  }
}
const lt = (e) => (t, i = we) => {
  (!fi || e === "sp") && Wi(e, (...s) => t(...s), i);
}, pl = lt("bm"), An = lt("m"), gl = lt(
  "bu"
), ml = lt("u"), Vi = lt(
  "bum"
), Cn = lt("um"), yl = lt(
  "sp"
), bl = lt("rtg"), wl = lt("rtc");
function vl(e, t = we) {
  Wi("ec", e, t);
}
const _l = /* @__PURE__ */ Symbol.for("v-ndc");
function xl(e, t, i, s) {
  let r;
  const n = i, o = U(e);
  if (o || se(e)) {
    const l = o && /* @__PURE__ */ mt(e);
    let c = !1, d = !1;
    l && (c = !/* @__PURE__ */ Re(e), d = /* @__PURE__ */ et(e), e = Bi(e)), r = new Array(e.length);
    for (let f = 0, g = e.length; f < g; f++)
      r[f] = t(
        c ? d ? yt(Pe(e[f])) : Pe(e[f]) : e[f],
        f,
        void 0,
        n
      );
  } else if (typeof e == "number")
    if (!Number.isInteger(e) || e < 0)
      r = [];
    else {
      r = new Array(e);
      for (let l = 0; l < e; l++)
        r[l] = t(l + 1, l, void 0, n);
    }
  else if (J(e))
    if (e[Symbol.iterator])
      r = Array.from(
        e,
        (l, c) => t(l, c, void 0, n)
      );
    else {
      const l = Object.keys(e);
      r = new Array(l.length);
      for (let c = 0, d = l.length; c < d; c++) {
        const f = l[c];
        r[c] = t(e[f], f, c, n);
      }
    }
  else
    r = [];
  return r;
}
const _s = (e) => e ? Yn(e) ? Js(e) : _s(e.parent) : null, ei = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ he(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => _s(e.parent),
    $root: (e) => _s(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Pn(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      Hs(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = $s.bind(e.proxy)),
    $watch: (e) => nl.bind(e)
  })
), rs = (e, t) => e !== ie && !e.__isScriptSetup && V(e, t), Sl = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: i, setupState: s, data: r, props: n, accessCache: o, type: l, appContext: c } = e;
    if (t[0] !== "$") {
      const h = o[t];
      if (h !== void 0)
        switch (h) {
          case 1:
            return s[t];
          case 2:
            return r[t];
          case 4:
            return i[t];
          case 3:
            return n[t];
        }
      else {
        if (rs(s, t))
          return o[t] = 1, s[t];
        if (r !== ie && V(r, t))
          return o[t] = 2, r[t];
        if (V(n, t))
          return o[t] = 3, n[t];
        if (i !== ie && V(i, t))
          return o[t] = 4, i[t];
        xs && (o[t] = 0);
      }
    }
    const d = ei[t];
    let f, g;
    if (d)
      return t === "$attrs" && ue(e.attrs, "get", ""), d(e);
    if (
      // css module (injected by vue-loader)
      (f = l.__cssModules) && (f = f[t])
    )
      return f;
    if (i !== ie && V(i, t))
      return o[t] = 4, i[t];
    if (
      // global properties
      g = c.config.globalProperties, V(g, t)
    )
      return g[t];
  },
  set({ _: e }, t, i) {
    const { data: s, setupState: r, ctx: n } = e;
    return rs(r, t) ? (r[t] = i, !0) : s !== ie && V(s, t) ? (s[t] = i, !0) : V(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (n[t] = i, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: i, ctx: s, appContext: r, props: n, type: o }
  }, l) {
    let c;
    return !!(i[l] || e !== ie && l[0] !== "$" && V(e, l) || rs(t, l) || V(n, l) || V(s, l) || V(ei, l) || V(r.config.globalProperties, l) || (c = o.__cssModules) && c[l]);
  },
  defineProperty(e, t, i) {
    return i.get != null ? e._.accessCache[t] = 0 : V(i, "value") && this.set(e, t, i.value, null), Reflect.defineProperty(e, t, i);
  }
};
function mr(e) {
  return U(e) ? e.reduce(
    (t, i) => (t[i] = null, t),
    {}
  ) : e;
}
let xs = !0;
function Tl(e) {
  const t = Pn(e), i = e.proxy, s = e.ctx;
  xs = !1, t.beforeCreate && yr(t.beforeCreate, e, "bc");
  const {
    // state
    data: r,
    computed: n,
    methods: o,
    watch: l,
    provide: c,
    inject: d,
    // lifecycle
    created: f,
    beforeMount: g,
    mounted: h,
    beforeUpdate: u,
    updated: m,
    activated: y,
    deactivated: w,
    beforeDestroy: T,
    beforeUnmount: E,
    destroyed: I,
    unmounted: M,
    render: N,
    renderTracked: Z,
    renderTriggered: O,
    errorCaptured: B,
    serverPrefetch: W,
    // public API
    expose: re,
    inheritAttrs: _e,
    // assets
    components: Oe,
    directives: tt,
    filters: ke
  } = t;
  if (d && El(d, s, null), o)
    for (const z in o) {
      const X = o[z];
      K(X) && (s[z] = X.bind(i));
    }
  if (r) {
    const z = r.call(i, i);
    J(z) && (e.data = /* @__PURE__ */ js(z));
  }
  if (xs = !0, n)
    for (const z in n) {
      const X = n[z], it = K(X) ? X.bind(i, i) : K(X.get) ? X.get.bind(i, i) : Xe, Pt = !K(X) && K(X.set) ? X.set.bind(i) : Xe, Ke = ii({
        get: it,
        set: Pt
      });
      Object.defineProperty(s, z, {
        enumerable: !0,
        configurable: !0,
        get: () => Ke.value,
        set: (xe) => Ke.value = xe
      });
    }
  if (l)
    for (const z in l)
      Rn(l[z], s, i, z);
  if (c) {
    const z = K(c) ? c.call(i) : c;
    Reflect.ownKeys(z).forEach((X) => {
      il(X, z[X]);
    });
  }
  f && yr(f, e, "c");
  function le(z, X) {
    U(X) ? X.forEach((it) => z(it.bind(i))) : X && z(X.bind(i));
  }
  if (le(pl, g), le(An, h), le(gl, u), le(ml, m), le(ul, y), le(dl, w), le(vl, B), le(wl, Z), le(bl, O), le(Vi, E), le(Cn, M), le(yl, W), U(re))
    if (re.length) {
      const z = e.exposed || (e.exposed = {});
      re.forEach((X) => {
        Object.defineProperty(z, X, {
          get: () => i[X],
          set: (it) => i[X] = it,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  N && e.render === Xe && (e.render = N), _e != null && (e.inheritAttrs = _e), Oe && (e.components = Oe), tt && (e.directives = tt), W && En(e);
}
function El(e, t, i = Xe) {
  U(e) && (e = Ss(e));
  for (const s in e) {
    const r = e[s];
    let n;
    J(r) ? "default" in r ? n = _i(
      r.from || s,
      r.default,
      !0
    ) : n = _i(r.from || s) : n = _i(r), /* @__PURE__ */ de(n) ? Object.defineProperty(t, s, {
      enumerable: !0,
      configurable: !0,
      get: () => n.value,
      set: (o) => n.value = o
    }) : t[s] = n;
  }
}
function yr(e, t, i) {
  Ue(
    U(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy),
    t,
    i
  );
}
function Rn(e, t, i, s) {
  let r = s.includes(".") ? xn(i, s) : () => i[s];
  if (se(e)) {
    const n = t[e];
    K(n) && is(r, n);
  } else if (K(e))
    is(r, e.bind(i));
  else if (J(e))
    if (U(e))
      e.forEach((n) => Rn(n, t, i, s));
    else {
      const n = K(e.handler) ? e.handler.bind(i) : t[e.handler];
      K(n) && is(r, n, e);
    }
}
function Pn(e) {
  const t = e.type, { mixins: i, extends: s } = t, {
    mixins: r,
    optionsCache: n,
    config: { optionMergeStrategies: o }
  } = e.appContext, l = n.get(t);
  let c;
  return l ? c = l : !r.length && !i && !s ? c = t : (c = {}, r.length && r.forEach(
    (d) => Ri(c, d, o, !0)
  ), Ri(c, t, o)), J(t) && n.set(t, c), c;
}
function Ri(e, t, i, s = !1) {
  const { mixins: r, extends: n } = t;
  n && Ri(e, n, i, !0), r && r.forEach(
    (o) => Ri(e, o, i, !0)
  );
  for (const o in t)
    if (!(s && o === "expose")) {
      const l = Ml[o] || i && i[o];
      e[o] = l ? l(e[o], t[o]) : t[o];
    }
  return e;
}
const Ml = {
  data: br,
  props: wr,
  emits: wr,
  // objects
  methods: zt,
  computed: zt,
  // lifecycle
  beforeCreate: pe,
  created: pe,
  beforeMount: pe,
  mounted: pe,
  beforeUpdate: pe,
  updated: pe,
  beforeDestroy: pe,
  beforeUnmount: pe,
  destroyed: pe,
  unmounted: pe,
  activated: pe,
  deactivated: pe,
  errorCaptured: pe,
  serverPrefetch: pe,
  // assets
  components: zt,
  directives: zt,
  // watch
  watch: Cl,
  // provide / inject
  provide: br,
  inject: Al
};
function br(e, t) {
  return t ? e ? function() {
    return he(
      K(e) ? e.call(this, this) : e,
      K(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Al(e, t) {
  return zt(Ss(e), Ss(t));
}
function Ss(e) {
  if (U(e)) {
    const t = {};
    for (let i = 0; i < e.length; i++)
      t[e[i]] = e[i];
    return t;
  }
  return e;
}
function pe(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function zt(e, t) {
  return e ? he(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function wr(e, t) {
  return e ? U(e) && U(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : he(
    /* @__PURE__ */ Object.create(null),
    mr(e),
    mr(t ?? {})
  ) : t;
}
function Cl(e, t) {
  if (!e) return t;
  if (!t) return e;
  const i = he(/* @__PURE__ */ Object.create(null), e);
  for (const s in t)
    i[s] = pe(e[s], t[s]);
  return i;
}
function On() {
  return {
    app: null,
    config: {
      isNativeTag: $r,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Rl = 0;
function Pl(e, t) {
  return function(s, r = null) {
    K(s) || (s = he({}, s)), r != null && !J(r) && (r = null);
    const n = On(), o = /* @__PURE__ */ new WeakSet(), l = [];
    let c = !1;
    const d = n.app = {
      _uid: Rl++,
      _component: s,
      _props: r,
      _container: null,
      _context: n,
      _instance: null,
      version: lc,
      get config() {
        return n.config;
      },
      set config(f) {
      },
      use(f, ...g) {
        return o.has(f) || (f && K(f.install) ? (o.add(f), f.install(d, ...g)) : K(f) && (o.add(f), f(d, ...g))), d;
      },
      mixin(f) {
        return n.mixins.includes(f) || n.mixins.push(f), d;
      },
      component(f, g) {
        return g ? (n.components[f] = g, d) : n.components[f];
      },
      directive(f, g) {
        return g ? (n.directives[f] = g, d) : n.directives[f];
      },
      mount(f, g, h) {
        if (!c) {
          const u = d._ceVNode || ne(s, r);
          return u.appContext = n, h === !0 ? h = "svg" : h === !1 && (h = void 0), e(u, f, h), c = !0, d._container = f, f.__vue_app__ = d, Js(u.component);
        }
      },
      onUnmount(f) {
        l.push(f);
      },
      unmount() {
        c && (Ue(
          l,
          d._instance,
          16
        ), e(null, d._container), delete d._container.__vue_app__);
      },
      provide(f, g) {
        return n.provides[f] = g, d;
      },
      runWithContext(f) {
        const g = Ft;
        Ft = d;
        try {
          return f();
        } finally {
          Ft = g;
        }
      }
    };
    return d;
  };
}
let Ft = null;
const Ol = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Ne(t)}Modifiers`] || e[`${wt(t)}Modifiers`];
function kl(e, t, ...i) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || ie;
  let r = i;
  const n = t.startsWith("update:"), o = n && Ol(s, t.slice(7));
  o && (o.trim && (r = i.map((f) => se(f) ? f.trim() : f)), o.number && (r = r.map(go)));
  let l, c = s[l = Ji(t)] || // also try camelCase event handler (#2249)
  s[l = Ji(Ne(t))];
  !c && n && (c = s[l = Ji(wt(t))]), c && Ue(
    c,
    e,
    6,
    r
  );
  const d = s[l + "Once"];
  if (d) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, Ue(
      d,
      e,
      6,
      r
    );
  }
}
const Il = /* @__PURE__ */ new WeakMap();
function kn(e, t, i = !1) {
  const s = i ? Il : t.emitsCache, r = s.get(e);
  if (r !== void 0)
    return r;
  const n = e.emits;
  let o = {}, l = !1;
  if (!K(e)) {
    const c = (d) => {
      const f = kn(d, t, !0);
      f && (l = !0, he(o, f));
    };
    !i && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  return !n && !l ? (J(e) && s.set(e, null), null) : (U(n) ? n.forEach((c) => o[c] = null) : he(o, n), J(e) && s.set(e, o), o);
}
function zi(e, t) {
  return !e || !Fi(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), V(e, t[0].toLowerCase() + t.slice(1)) || V(e, wt(t)) || V(e, t));
}
function vr(e) {
  const {
    type: t,
    vnode: i,
    proxy: s,
    withProxy: r,
    propsOptions: [n],
    slots: o,
    attrs: l,
    emit: c,
    render: d,
    renderCache: f,
    props: g,
    data: h,
    setupState: u,
    ctx: m,
    inheritAttrs: y
  } = e, w = Mi(e);
  let T, E;
  try {
    if (i.shapeFlag & 4) {
      const M = r || s, N = M;
      T = Ge(
        d.call(
          N,
          M,
          f,
          g,
          u,
          h,
          m
        )
      ), E = l;
    } else {
      const M = t;
      T = Ge(
        M.length > 1 ? M(
          g,
          { attrs: l, slots: o, emit: c }
        ) : M(
          g,
          null
        )
      ), E = t.props ? l : Dl(l);
    }
  } catch (M) {
    Ct.length = 0, $i(M, e, 1), T = ne(je);
  }
  let I = T;
  if (E && y !== !1) {
    const M = Object.keys(E), { shapeFlag: N } = I;
    M.length && N & 7 && (n && M.some(Ni) && (E = Fl(
      E,
      n
    )), I = Nt(I, E, !1, !0));
  }
  if (i.dirs && (I = Nt(I, null, !1, !0), I.dirs = I.dirs ? I.dirs.concat(i.dirs) : i.dirs), i.transition) {
    const M = Hi(I.type) && Tn(I) || I;
    Ai(M, i.transition);
  }
  return T = I, Mi(w), T;
}
function In(e, t = !0) {
  let i;
  for (let s = 0; s < e.length; s++) {
    const r = e[s];
    if (ci(r)) {
      if (r.type !== je || r.children === "v-if") {
        if (i)
          return;
        i = r;
      }
    } else
      return;
  }
  return i;
}
const Dl = (e) => {
  let t;
  for (const i in e)
    (i === "class" || i === "style" || Fi(i)) && ((t || (t = {}))[i] = e[i]);
  return t;
}, Fl = (e, t) => {
  const i = {};
  for (const s in e)
    (!Ni(s) || !(s.slice(9) in t)) && (i[s] = e[s]);
  return i;
};
function Nl(e, t, i) {
  const { props: s, children: r, component: n } = e, { props: o, children: l, patchFlag: c } = t, d = n.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (i && c >= 0) {
    if (c & 1024)
      return !0;
    if (c & 16)
      return s ? _r(s, o, d) : !!o;
    if (c & 8) {
      const f = t.dynamicProps;
      for (let g = 0; g < f.length; g++) {
        const h = f[g];
        if (Dn(o, s, h) && !zi(d, h))
          return !0;
      }
    }
  } else
    return (r || l) && (!l || !l.$stable) ? !0 : s === o ? !1 : s ? o ? _r(s, o, d) : !0 : !!o;
  return !1;
}
function _r(e, t, i) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length)
    return !0;
  for (let r = 0; r < s.length; r++) {
    const n = s[r];
    if (!V(e, n) || Dn(t, e, n) && !zi(i, n))
      return !0;
  }
  return !1;
}
function Dn(e, t, i) {
  const s = e[i], r = t[i];
  return i === "style" && J(s) && J(r) ? !Ki(s, r) : s !== r;
}
function Ll({ vnode: e, parent: t, suspense: i }, s) {
  for (; t; ) {
    const r = t.subTree;
    if (r.suspense && r.suspense.activeBranch === e && (r.suspense.vnode.el = r.el = s, e = r), r === e)
      (e = t.vnode).el = s, t = t.parent;
    else
      break;
  }
  i && i.activeBranch === e && (i.vnode.el = s);
}
const Fn = {}, Nn = () => Object.create(Fn), Ln = (e) => Object.getPrototypeOf(e) === Fn;
function Ul(e, t, i, s = !1) {
  const r = {}, n = Nn();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), Un(e, t, r, n);
  for (const o in e.propsOptions[0])
    o in r || (r[o] = void 0);
  i ? e.props = s ? r : /* @__PURE__ */ hn(r) : e.type.props ? e.props = r : e.props = n, e.attrs = n;
}
function jl(e, t, i, s) {
  const {
    props: r,
    attrs: n,
    vnode: { patchFlag: o }
  } = e, l = /* @__PURE__ */ q(r), [c] = e.propsOptions;
  let d = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (s || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const f = e.vnode.dynamicProps;
      for (let g = 0; g < f.length; g++) {
        let h = f[g];
        if (zi(e.emitsOptions, h))
          continue;
        const u = t[h];
        if (c)
          if (V(n, h))
            u !== n[h] && (n[h] = u, d = !0);
          else {
            const m = Ne(h);
            r[m] = Ts(
              c,
              l,
              m,
              u,
              e,
              !1
            );
          }
        else
          u !== n[h] && (n[h] = u, d = !0);
      }
    }
  } else {
    Un(e, t, r, n) && (d = !0);
    let f;
    for (const g in l)
      (!t || // for camelCase
      !V(t, g) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((f = wt(g)) === g || !V(t, f))) && (c ? i && // for camelCase
      (i[g] !== void 0 || // for kebab-case
      i[f] !== void 0) && (r[g] = Ts(
        c,
        l,
        g,
        void 0,
        e,
        !0
      )) : delete r[g]);
    if (n !== l)
      for (const g in n)
        (!t || !V(t, g)) && (delete n[g], d = !0);
  }
  d && ot(e.attrs, "set", "");
}
function Un(e, t, i, s) {
  const [r, n] = e.propsOptions;
  let o = !1, l;
  if (t)
    for (let c in t) {
      if (Jt(c))
        continue;
      const d = t[c];
      let f;
      r && V(r, f = Ne(c)) ? !n || !n.includes(f) ? i[f] = d : (l || (l = {}))[f] = d : zi(e.emitsOptions, c) || (!(c in s) || d !== s[c]) && (s[c] = d, o = !0);
    }
  if (n) {
    const c = /* @__PURE__ */ q(i), d = l || ie;
    for (let f = 0; f < n.length; f++) {
      const g = n[f];
      i[g] = Ts(
        r,
        c,
        g,
        d[g],
        e,
        !V(d, g)
      );
    }
  }
  return o;
}
function Ts(e, t, i, s, r, n) {
  const o = e[i];
  if (o != null) {
    const l = V(o, "default");
    if (l && s === void 0) {
      const c = o.default;
      if (o.type !== Function && !o.skipFactory && K(c)) {
        const { propsDefaults: d } = r;
        if (i in d)
          s = d[i];
        else {
          const f = hi(r);
          s = d[i] = c.call(
            null,
            t
          ), f();
        }
      } else
        s = c;
      r.ce && r.ce._setProp(i, s);
    }
    o[
      0
      /* shouldCast */
    ] && (n && !l ? s = !1 : o[
      1
      /* shouldCastTrue */
    ] && (s === "" || s === wt(i)) && (s = !0));
  }
  return s;
}
const Kl = /* @__PURE__ */ new WeakMap();
function jn(e, t, i = !1) {
  const s = i ? Kl : t.propsCache, r = s.get(e);
  if (r)
    return r;
  const n = e.props, o = {}, l = [];
  let c = !1;
  if (!K(e)) {
    const f = (g) => {
      c = !0;
      const [h, u] = jn(g, t, !0);
      he(o, h), u && l.push(...u);
    };
    !i && t.mixins.length && t.mixins.forEach(f), e.extends && f(e.extends), e.mixins && e.mixins.forEach(f);
  }
  if (!n && !c)
    return J(e) && s.set(e, Et), Et;
  if (U(n))
    for (let f = 0; f < n.length; f++) {
      const g = Ne(n[f]);
      xr(g) && (o[g] = ie);
    }
  else if (n)
    for (const f in n) {
      const g = Ne(f);
      if (xr(g)) {
        const h = n[f], u = o[g] = U(h) || K(h) ? { type: h } : he({}, h), m = u.type;
        let y = !1, w = !0;
        if (U(m))
          for (let T = 0; T < m.length; ++T) {
            const E = m[T], I = K(E) && E.name;
            if (I === "Boolean") {
              y = !0;
              break;
            } else I === "String" && (w = !1);
          }
        else
          y = K(m) && m.name === "Boolean";
        u[
          0
          /* shouldCast */
        ] = y, u[
          1
          /* shouldCastTrue */
        ] = w, (y || V(u, "default")) && l.push(g);
      }
    }
  const d = [o, l];
  return J(e) && s.set(e, d), d;
}
function xr(e) {
  return e[0] !== "$" && !Jt(e);
}
const Vs = (e) => e === "_" || e === "_ctx" || e === "$stable", zs = (e) => U(e) ? e.map(Ge) : [Ge(e)], Bl = (e, t, i) => {
  if (t._n)
    return t;
  const s = tl((...r) => zs(t(...r)), i);
  return s._c = !1, s;
}, Kn = (e, t, i) => {
  const s = e._ctx;
  for (const r in e) {
    if (Vs(r)) continue;
    const n = e[r];
    if (K(n))
      t[r] = Bl(r, n, s);
    else if (n != null) {
      const o = zs(n);
      t[r] = () => o;
    }
  }
}, Bn = (e, t) => {
  const i = zs(t);
  e.slots.default = () => i;
}, $n = (e, t, i) => {
  for (const s in t)
    (i || !Vs(s)) && (e[s] = t[s]);
}, $l = (e, t, i) => {
  const s = e.slots = Nn();
  if (e.vnode.shapeFlag & 32) {
    const r = t._;
    r ? ($n(s, t, i), i && Gr(s, "_", r, !0)) : Kn(t, s);
  } else t && Bn(e, t);
}, Hl = (e, t, i) => {
  const { vnode: s, slots: r } = e;
  let n = !0, o = ie;
  if (s.shapeFlag & 32) {
    const l = t._;
    l ? i && l === 1 ? n = !1 : $n(r, t, i) : (n = !t.$stable, Kn(t, r)), o = t;
  } else t && (Bn(e, t), o = { default: 1 });
  if (n)
    for (const l in r)
      !Vs(l) && o[l] == null && delete r[l];
}, ge = ql;
function Wl(e) {
  return Vl(e);
}
function Vl(e, t) {
  const i = Ui();
  i.__VUE__ = !0;
  const {
    insert: s,
    remove: r,
    patchProp: n,
    createElement: o,
    createText: l,
    createComment: c,
    setText: d,
    setElementText: f,
    parentNode: g,
    nextSibling: h,
    setScopeId: u = Xe,
    insertStaticContent: m
  } = e, y = (a, p, b, _ = null, v = null, S = null, P = void 0, R = null, C = !!p.dynamicChildren) => {
    if (a === p)
      return;
    a && !Bt(a, p) && (_ = j(a), xe(a, v, S, !0), a = null), p.patchFlag === -2 && (C = !1, p.dynamicChildren = null), p.dynamicChildren && a && a.dynamicChildren && a.dynamicChildren.hasOnce && (p.dynamicChildren === Et && (p.dynamicChildren = []), p.dynamicChildren.hasOnce = !0);
    const { type: x, ref: D, shapeFlag: k } = p;
    switch (x) {
      case Gi:
        w(a, p, b, _);
        break;
      case je:
        T(a, p, b, _);
        break;
      case os:
        a == null && E(p, b, _, P);
        break;
      case Me:
        Oe(
          a,
          p,
          b,
          _,
          v,
          S,
          P,
          R,
          C
        );
        break;
      default:
        k & 1 ? N(
          a,
          p,
          b,
          _,
          v,
          S,
          P,
          R,
          C
        ) : k & 6 ? tt(
          a,
          p,
          b,
          _,
          v,
          S,
          P,
          R,
          C
        ) : (k & 64 || k & 128) && x.process(
          a,
          p,
          b,
          _,
          v,
          S,
          P,
          R,
          C,
          $
        );
    }
    D != null && v ? Zt(D, a && a.ref, S, p || a, !p) : D == null && a && a.ref != null && Zt(a.ref, null, S, a, !0);
  }, w = (a, p, b, _) => {
    if (a == null)
      s(
        p.el = l(p.children),
        b,
        _
      );
    else {
      const v = p.el = a.el;
      p.children !== a.children && d(v, p.children);
    }
  }, T = (a, p, b, _) => {
    a == null ? s(
      p.el = c(p.children || ""),
      b,
      _
    ) : p.el = a.el;
  }, E = (a, p, b, _) => {
    [a.el, a.anchor] = m(
      a.children,
      p,
      b,
      _,
      a.el,
      a.anchor
    );
  }, I = ({ el: a, anchor: p }, b, _) => {
    let v;
    for (; a && a !== p; )
      v = h(a), s(a, b, _), a = v;
    s(p, b, _);
  }, M = ({ el: a, anchor: p }) => {
    let b;
    for (; a && a !== p; )
      b = h(a), r(a), a = b;
    r(p);
  }, N = (a, p, b, _, v, S, P, R, C) => {
    if (p.type === "svg" ? P = "svg" : p.type === "math" && (P = "mathml"), a == null)
      Z(
        p,
        b,
        _,
        v,
        S,
        P,
        R,
        C
      );
    else {
      const x = a.el && a.el._isVueCE ? a.el : null;
      try {
        x && x._beginPatch(), W(
          a,
          p,
          v,
          S,
          P,
          R,
          C
        );
      } finally {
        x && x._endPatch();
      }
    }
  }, Z = (a, p, b, _, v, S, P, R) => {
    let C, x;
    const { props: D, shapeFlag: k, transition: F, dirs: L } = a;
    if (C = a.el = o(
      a.type,
      S,
      D && D.is,
      D
    ), k & 8 ? f(C, a.children) : k & 16 && B(
      a.children,
      C,
      null,
      _,
      v,
      ns(a, S),
      P,
      R
    ), L && vt(a, null, _, "created"), O(C, a, a.scopeId, P, _), D) {
      for (const Q in D)
        Q !== "value" && !Jt(Q) && n(C, Q, null, D[Q], S, _);
      "value" in D && n(C, "value", null, D.value, S), (x = D.onVnodeBeforeMount) && We(x, _, a);
    }
    L && vt(a, null, _, "beforeMount");
    const H = zl(v, F);
    H && F.beforeEnter(C), s(C, p, b), ((x = D && D.onVnodeMounted) || H || L) && ge(() => {
      try {
        x && We(x, _, a), H && F.enter(C), L && vt(a, null, _, "mounted");
      } finally {
      }
    }, v);
  }, O = (a, p, b, _, v) => {
    if (b && u(a, b), _)
      for (let S = 0; S < _.length; S++)
        u(a, _[S]);
    if (v) {
      let S = v.subTree;
      if (p === S || Wn(S.type) && (S.ssContent === p || S.ssFallback === p)) {
        const P = v.vnode;
        O(
          a,
          P,
          P.scopeId,
          P.slotScopeIds,
          v.parent
        );
      }
    }
  }, B = (a, p, b, _, v, S, P, R, C = 0) => {
    for (let x = C; x < a.length; x++) {
      const D = a[x] = R ? nt(a[x]) : Ge(a[x]);
      y(
        null,
        D,
        p,
        b,
        _,
        v,
        S,
        P,
        R
      );
    }
  }, W = (a, p, b, _, v, S, P) => {
    const R = p.el = a.el;
    let { patchFlag: C, dynamicChildren: x, dirs: D } = p;
    C |= a.patchFlag & 16;
    const k = a.props || ie, F = p.props || ie;
    let L;
    if (b && _t(b, !1), (L = F.onVnodeBeforeUpdate) && We(L, b, p, a), D && vt(p, a, b, "beforeUpdate"), b && _t(b, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    x && (!a.dynamicChildren || a.dynamicChildren.length !== x.length) && (C = 0, P = !1, x = null), (k.innerHTML && F.innerHTML == null || k.textContent && F.textContent == null) && f(R, ""), x ? re(
      a.dynamicChildren,
      x,
      R,
      b,
      _,
      ns(p, v),
      S
    ) : P || X(
      a,
      p,
      R,
      null,
      b,
      _,
      ns(p, v),
      S,
      !1
    ), C > 0) {
      if (C & 16)
        _e(R, k, F, b, v);
      else if (C & 2 && k.class !== F.class && n(R, "class", null, F.class, v), C & 4 && n(R, "style", k.style, F.style, v), C & 8) {
        const H = p.dynamicProps;
        for (let Q = 0; Q < H.length; Q++) {
          const Y = H[Q], oe = k[Y], ae = F[Y];
          (ae !== oe || Y === "value") && n(R, Y, oe, ae, v, b);
        }
      }
      C & 1 && a.children !== p.children && f(R, p.children);
    } else !P && x == null && _e(R, k, F, b, v);
    ((L = F.onVnodeUpdated) || D) && ge(() => {
      L && We(L, b, p, a), D && vt(p, a, b, "updated");
    }, _);
  }, re = (a, p, b, _, v, S, P) => {
    for (let R = 0; R < p.length; R++) {
      const C = a[R], x = p[R], D = C.el || Es(C), k = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        D && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (C.type === Me || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Bt(C, x) || // - In the case of a component, it could contain anything.
        C.shapeFlag & 198) ? g(D) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          b
        )
      );
      y(
        C,
        x,
        k,
        null,
        _,
        v,
        S,
        P,
        !0
      );
    }
  }, _e = (a, p, b, _, v) => {
    if (p !== b) {
      if (p !== ie)
        for (const S in p)
          !Jt(S) && !(S in b) && n(
            a,
            S,
            p[S],
            null,
            v,
            _
          );
      for (const S in b) {
        if (Jt(S)) continue;
        const P = b[S], R = p[S];
        P !== R && S !== "value" && n(a, S, R, P, v, _);
      }
      "value" in b && n(a, "value", p.value, b.value, v);
    }
  }, Oe = (a, p, b, _, v, S, P, R, C) => {
    const x = p.el = a ? a.el : l(""), D = p.anchor = a ? a.anchor : l("");
    let { patchFlag: k, dynamicChildren: F, slotScopeIds: L } = p;
    L && (R = R ? R.concat(L) : L), a == null ? (s(x, b, _), s(D, b, _), B(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      p.children || [],
      b,
      D,
      v,
      S,
      P,
      R,
      C
    )) : k > 0 && k & 64 && F && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    a.dynamicChildren && a.dynamicChildren.length === F.length ? (re(
      a.dynamicChildren,
      F,
      b,
      v,
      S,
      P,
      R
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (p.key != null || v && p === v.subTree) && Gs(
      a,
      p,
      !0
      /* shallow */
    )) : X(
      a,
      p,
      b,
      D,
      v,
      S,
      P,
      R,
      C
    );
  }, tt = (a, p, b, _, v, S, P, R, C) => {
    p.slotScopeIds = R, a == null ? p.shapeFlag & 512 ? v.ctx.activate(
      p,
      b,
      _,
      P,
      C
    ) : ke(
      p,
      b,
      _,
      v,
      S,
      P,
      C
    ) : ct(a, p, C);
  }, ke = (a, p, b, _, v, S, P) => {
    const R = a.component = Ql(
      a,
      _,
      v
    );
    if (Ws(a) && (R.ctx.renderer = $), tc(R, !1, P), R.asyncDep) {
      if (v && v.registerDep(
        R,
        le,
        P,
        S
      ), !a.el) {
        const C = R.subTree = ne(je);
        T(null, C, p, b), a.placeholder = C.el;
      }
    } else
      le(
        R,
        a,
        p,
        b,
        v,
        S,
        P
      );
  }, ct = (a, p, b) => {
    const _ = p.component = a.component;
    if (Nl(a, p, b))
      if (_.asyncDep && !_.asyncResolved) {
        p.el = a.el, p.placeholder = a.placeholder, z(_, p, b);
        return;
      } else
        _.next = p, _.update();
    else
      p.el = a.el, p.placeholder = a.placeholder, _.vnode = p;
  }, le = (a, p, b, _, v, S, P) => {
    const R = () => {
      if (a.isMounted) {
        let { next: k, bu: F, u: L, parent: H, vnode: Q } = a;
        {
          const $e = Hn(a);
          if ($e) {
            k && (k.el = Q.el, z(a, k, P)), $e.asyncDep.then(() => {
              ge(() => {
                a.isUnmounted || x();
              }, v);
            });
            return;
          }
        }
        let Y = k, oe;
        _t(a, !1), k ? (k.el = Q.el, z(a, k, P)) : k = Q, F && Xi(F), (oe = k.props && k.props.onVnodeBeforeUpdate) && We(oe, H, k, Q), _t(a, !0);
        const ae = vr(a), Be = a.subTree;
        a.subTree = ae, y(
          Be,
          ae,
          // parent may have changed if it's in a teleport
          g(Be.el),
          // anchor may have changed if it's in a fragment
          j(Be),
          a,
          v,
          S
        ), k.el = ae.el, Y === null && Ll(a, ae.el), L && ge(L, v), (oe = k.props && k.props.onVnodeUpdated) && ge(
          () => We(oe, H, k, Q),
          v
        );
      } else {
        let k;
        const { el: F, props: L } = p, { bm: H, m: Q, parent: Y, root: oe, type: ae } = a, Be = Qt(p);
        _t(a, !1), H && Xi(H), !Be && (k = L && L.onVnodeBeforeMount) && We(k, Y, p), _t(a, !0);
        {
          oe.ce && oe.ce._hasShadowRoot() && oe.ce._injectChildStyle(
            ae,
            a.parent ? a.parent.type : void 0
          );
          const $e = a.subTree = vr(a);
          y(
            null,
            $e,
            b,
            _,
            a,
            v,
            S
          ), p.el = $e.el;
        }
        if (Q && ge(Q, v), !Be && (k = L && L.onVnodeMounted)) {
          const $e = p;
          ge(
            () => We(k, Y, $e),
            v
          );
        }
        (p.shapeFlag & 256 || Y && Qt(Y.vnode) && Y.vnode.shapeFlag & 256) && a.a && ge(a.a, v), a.isMounted = !0, p = b = _ = null;
      }
    };
    a.scope.on();
    const C = a.effect = new Yr(R);
    a.scope.off();
    const x = a.update = C.run.bind(C), D = a.job = C.runIfDirty.bind(C);
    D.i = a, D.id = a.uid, C.scheduler = () => Hs(D), _t(a, !0), x();
  }, z = (a, p, b) => {
    p.component = a;
    const _ = a.vnode.props;
    a.vnode = p, a.next = null, jl(a, p.props, _, b), Hl(a, p.children, b), Ze(), yn(a), Qe();
  }, X = (a, p, b, _, v, S, P, R, C = !1) => {
    const x = a && a.children, D = a ? a.shapeFlag : 0, k = p.children, { patchFlag: F, shapeFlag: L } = p;
    if (F > 0) {
      if (F & 128) {
        Pt(
          x,
          k,
          b,
          _,
          v,
          S,
          P,
          R,
          C
        );
        return;
      } else if (F & 256) {
        it(
          x,
          k,
          b,
          _,
          v,
          S,
          P,
          R,
          C
        );
        return;
      }
    }
    L & 8 ? (D & 16 && A(x, v, S), k !== x && f(b, k)) : D & 16 ? L & 16 ? Pt(
      x,
      k,
      b,
      _,
      v,
      S,
      P,
      R,
      C
    ) : A(x, v, S, !0) : (D & 8 && f(b, ""), L & 16 && B(
      k,
      b,
      _,
      v,
      S,
      P,
      R,
      C
    ));
  }, it = (a, p, b, _, v, S, P, R, C) => {
    a = a || Et, p = p || Et;
    const x = a.length, D = p.length, k = Math.min(x, D);
    let F;
    for (F = 0; F < k; F++) {
      const L = p[F] = C ? nt(p[F]) : Ge(p[F]);
      y(
        a[F],
        L,
        b,
        null,
        v,
        S,
        P,
        R,
        C
      );
    }
    x > D ? A(
      a,
      v,
      S,
      !0,
      !1,
      k
    ) : B(
      p,
      b,
      _,
      v,
      S,
      P,
      R,
      C,
      k
    );
  }, Pt = (a, p, b, _, v, S, P, R, C) => {
    let x = 0;
    const D = p.length;
    let k = a.length - 1, F = D - 1;
    for (; x <= k && x <= F; ) {
      const L = a[x], H = p[x] = C ? nt(p[x]) : Ge(p[x]);
      if (Bt(L, H))
        y(
          L,
          H,
          b,
          null,
          v,
          S,
          P,
          R,
          C
        );
      else
        break;
      x++;
    }
    for (; x <= k && x <= F; ) {
      const L = a[k], H = p[F] = C ? nt(p[F]) : Ge(p[F]);
      if (Bt(L, H))
        y(
          L,
          H,
          b,
          null,
          v,
          S,
          P,
          R,
          C
        );
      else
        break;
      k--, F--;
    }
    if (x > k) {
      if (x <= F) {
        const L = F + 1, H = L < D ? p[L].el : _;
        for (; x <= F; )
          y(
            null,
            p[x] = C ? nt(p[x]) : Ge(p[x]),
            b,
            H,
            v,
            S,
            P,
            R,
            C
          ), x++;
      }
    } else if (x > F)
      for (; x <= k; )
        xe(a[x], v, S, !0), x++;
    else {
      const L = x, H = x, Q = /* @__PURE__ */ new Map();
      for (x = H; x <= F; x++) {
        const Se = p[x] = C ? nt(p[x]) : Ge(p[x]);
        Se.key != null && Q.set(Se.key, x);
      }
      let Y, oe = 0;
      const ae = F - H + 1;
      let Be = !1, $e = 0;
      const jt = new Array(ae);
      for (x = 0; x < ae; x++) jt[x] = 0;
      for (x = L; x <= k; x++) {
        const Se = a[x];
        if (oe >= ae) {
          xe(Se, v, S, !0);
          continue;
        }
        let He;
        if (Se.key != null)
          He = Q.get(Se.key);
        else
          for (Y = H; Y <= F; Y++)
            if (jt[Y - H] === 0 && Bt(Se, p[Y])) {
              He = Y;
              break;
            }
        He === void 0 ? xe(Se, v, S, !0) : (jt[He - H] = x + 1, He >= $e ? $e = He : Be = !0, y(
          Se,
          p[He],
          b,
          null,
          v,
          S,
          P,
          R,
          C
        ), oe++);
      }
      const ir = Be ? Gl(jt) : Et;
      for (Y = ir.length - 1, x = ae - 1; x >= 0; x--) {
        const Se = H + x, He = p[Se], sr = p[Se + 1], rr = Se + 1 < D ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          sr.el || Es(sr)
        ) : _;
        jt[x] === 0 ? y(
          null,
          He,
          b,
          rr,
          v,
          S,
          P,
          R,
          C
        ) : Be && (Y < 0 || x !== ir[Y] ? Ke(He, b, rr, 2) : Y--);
      }
    }
  }, Ke = (a, p, b, _, v = null) => {
    const { el: S, type: P, transition: R, children: C, shapeFlag: x } = a;
    if (x & 6) {
      Ke(a.component.subTree, p, b, _);
      return;
    }
    if (x & 128) {
      a.suspense.move(p, b, _);
      return;
    }
    if (x & 64) {
      P.move(a, p, b, $);
      return;
    }
    if (P === Me) {
      s(S, p, b);
      for (let k = 0; k < C.length; k++)
        Ke(C[k], p, b, _);
      s(a.anchor, p, b);
      return;
    }
    if (P === os) {
      I(a, p, b);
      return;
    }
    if (_ !== 2 && x & 1 && R)
      if (_ === 0)
        R.persisted && !S[ss] ? s(S, p, b) : (R.beforeEnter(S), s(S, p, b), ge(() => R.enter(S), v));
      else {
        const { leave: k, delayLeave: F, afterLeave: L } = R, H = () => {
          a.ctx.isUnmounted ? r(S) : s(S, p, b);
        }, Q = () => {
          const Y = S._isLeaving || !!S[ss];
          S._isLeaving && S[ss](
            !0
            /* cancelled */
          ), R.persisted && !Y ? H() : k(S, () => {
            H(), L && L();
          });
        };
        F ? F(S, H, Q) : Q();
      }
    else
      s(S, p, b);
  }, xe = (a, p, b, _ = !1, v = !1) => {
    const {
      type: S,
      props: P,
      ref: R,
      children: C,
      dynamicChildren: x,
      shapeFlag: D,
      patchFlag: k,
      dirs: F,
      cacheIndex: L,
      memo: H
    } = a;
    if ((k === -2 || x && x.hasOnce) && (v = !1), R != null && (Ze(), Zt(R, null, b, a, !0), Qe()), L != null && (!a.ctx || a.ctx === p) && (p.renderCache[L] = void 0), D & 256) {
      p.ctx.deactivate(a);
      return;
    }
    const Q = D & 1 && F, Y = !Qt(a);
    let oe;
    if (Y && (oe = P && P.onVnodeBeforeUnmount) && We(oe, p, a), D & 6)
      qi(a.component, b, _);
    else {
      if (D & 128) {
        a.suspense.unmount(b, _);
        return;
      }
      Q && vt(a, null, p, "beforeUnmount"), D & 64 ? a.type.remove(
        a,
        p,
        b,
        $,
        _
      ) : x && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !x.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (S !== Me || k > 0 && k & 64) ? A(
        x,
        p,
        b,
        !1,
        !0
      ) : (S === Me && k & 384 || !v && D & 16) && A(C, p, b), _ && Ut(a);
    }
    const ae = H != null && L == null;
    (Y && (oe = P && P.onVnodeUnmounted) || Q || ae) && ge(() => {
      oe && We(oe, p, a), Q && vt(a, null, p, "unmounted"), ae && (a.el = null);
    }, b);
  }, Ut = (a) => {
    const { type: p, el: b, anchor: _, transition: v } = a, S = p === Me;
    if (S && !v) {
      pi(b, _);
      return;
    }
    if (p === os) {
      M(a), v && !v.persisted && v.afterLeave && v.afterLeave();
      return;
    }
    const P = S ? vs(a) : a, R = () => {
      S ? g(b) && pi(b, _) : r(b), v && !v.persisted && v.afterLeave && v.afterLeave();
    };
    if (P && P.shapeFlag & 1 && v && !v.persisted) {
      const { leave: C, delayLeave: x } = v, D = P.el, k = () => C(D, R);
      x ? x(D, R, k) : k();
    } else
      R();
  }, pi = (a, p) => {
    let b;
    for (; a !== p; )
      b = h(a), r(a), a = b;
    r(p);
  }, qi = (a, p, b) => {
    const { bum: _, scope: v, job: S, subTree: P, um: R, m: C, a: x } = a;
    Sr(C), Sr(x), _ && Xi(_), v.stop(), S ? (S.flags |= 8, xe(P, a, p, b)) : a.vnode.el && P && (P.transition = a.vnode.transition, xe(P, a, p, b)), R && ge(R, p), ge(() => {
      a.isUnmounted = !0;
    }, p);
  }, A = (a, p, b, _ = !1, v = !1, S = 0) => {
    for (let P = S; P < a.length; P++)
      xe(a[P], p, b, _, v);
  }, j = (a) => {
    if (a.shapeFlag & 6)
      return j(a.component.subTree);
    if (a.shapeFlag & 128)
      return a.suspense.next();
    const p = h(a.anchor || a.el), b = p && p[Sn];
    return b ? h(b) : p;
  }, G = (a, p, b) => {
    const _ = a && p._vnode ? void 0 : a && a.component ? a.component.uid : Zl();
    el(() => {
      a == null ? p._vnode && xe(p._vnode, null, null, !0) : y(
        p._vnode || null,
        a,
        p,
        null,
        null,
        null,
        b
      ), p._vnode = a;
    }, _);
  }, $ = {
    p: y,
    um: xe,
    m: Ke,
    r: Ut,
    mt: ke,
    mc: B,
    pc: X,
    pbc: re,
    n: j,
    o: e
  };
  return {
    render: G,
    hydrate: void 0,
    createApp: Pl(G)
  };
}
function ns({ type: e, props: t }, i) {
  return i === "svg" && e === "foreignObject" || i === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : i;
}
function _t({ effect: e, job: t }, i) {
  i ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function zl(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Gs(e, t, i = !1) {
  const s = e.children, r = t.children;
  if (U(s) && U(r))
    for (let n = 0; n < s.length; n++) {
      const o = s[n];
      let l = r[n];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = r[n] = nt(r[n]), l.el = o.el), !i && l.patchFlag !== -2 && Gs(o, l)), l.type === Gi && (l.patchFlag === -1 && (l = r[n] = nt(l)), l.el = o.el), l.type === je && !l.el && (l.el = o.el);
    }
}
function Gl(e) {
  const t = e.slice(), i = [0];
  let s, r, n, o, l;
  const c = e.length;
  for (s = 0; s < c; s++) {
    const d = e[s];
    if (d !== 0) {
      if (r = i[i.length - 1], e[r] < d) {
        t[s] = r, i.push(s);
        continue;
      }
      for (n = 0, o = i.length - 1; n < o; )
        l = n + o >> 1, e[i[l]] < d ? n = l + 1 : o = l;
      d < e[i[n]] && (n > 0 && (t[s] = i[n - 1]), i[n] = s);
    }
  }
  for (n = i.length, o = i[n - 1]; n-- > 0; )
    i[n] = o, o = t[o];
  return i;
}
function Hn(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : Hn(t);
}
function Sr(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function Es(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? Es(t.subTree) : null;
}
const Wn = (e) => e.__isSuspense;
function ql(e, t) {
  t && t.pendingBranch ? U(e) ? t.effects.push(...e) : t.effects.push(e) : Qo(e);
}
const Me = /* @__PURE__ */ Symbol.for("v-fgt"), Gi = /* @__PURE__ */ Symbol.for("v-txt"), je = /* @__PURE__ */ Symbol.for("v-cmt"), os = /* @__PURE__ */ Symbol.for("v-stc"), Ct = [];
let Ee = null;
function ve(e = !1) {
  Ct.push(Ee = e ? null : []);
}
function Vn() {
  Ct.pop(), Ee = Ct[Ct.length - 1] || null;
}
let li = 1;
function Pi(e, t = !1) {
  li += e, e < 0 && Ee && t && (Ee.hasOnce = !0);
}
function zn(e) {
  return e.dynamicChildren = li > 0 ? Ee || Et : null, Vn(), li > 0 && Ee && Ee.push(e), e;
}
function Ce(e, t, i, s, r, n) {
  return zn(
    ye(
      e,
      t,
      i,
      s,
      r,
      n,
      !0
    )
  );
}
function qs(e, t, i, s, r) {
  return zn(
    ne(
      e,
      t,
      i,
      s,
      r,
      !0
    )
  );
}
function ci(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Bt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Gn = ({ key: e }) => e ?? null, xi = ({
  ref: e,
  ref_key: t,
  ref_for: i
}) => (typeof e == "number" && (e = "" + e), e != null ? se(e) || /* @__PURE__ */ de(e) || K(e) ? { i: Je, r: e, k: t, f: !!i } : e : null);
function ye(e, t = null, i = null, s = 0, r = null, n = e === Me ? 0 : 1, o = !1, l = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Gn(t),
    ref: t && xi(t),
    scopeId: vn,
    slotScopeIds: null,
    children: i,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: n,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: Je
  };
  return l ? (Oi(c, i), n & 128 && e.normalize(c)) : i && (c.shapeFlag |= se(i) ? 8 : 16), li > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  Ee && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (c.patchFlag > 0 || n & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  c.patchFlag !== 32 && Ee.push(c), c;
}
const ne = Jl;
function Jl(e, t = null, i = null, s = 0, r = null, n = !1) {
  if ((!e || e === _l) && (e = je), ci(e)) {
    const l = Nt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return i && Oi(l, i), li > 0 && !n && Ee && (l.shapeFlag & 6 ? Ee[Ee.indexOf(e)] = l : Ee.push(l)), l.patchFlag = -2, l;
  }
  if (nc(e) && (e = e.__vccOpts), t) {
    t = Xl(t);
    let { class: l, style: c } = t;
    l && !se(l) && (t.class = Is(l)), J(c) && (/* @__PURE__ */ Bs(c) && !U(c) && (c = he({}, c)), t.style = ji(c));
  }
  const o = se(e) ? 1 : Wn(e) ? 128 : Hi(e) ? 64 : J(e) ? 4 : K(e) ? 2 : 0;
  return ye(
    e,
    t,
    i,
    s,
    r,
    o,
    n,
    !0
  );
}
function Xl(e) {
  return e ? /* @__PURE__ */ Bs(e) || Ln(e) ? he({}, e) : e : null;
}
function Nt(e, t, i = !1, s = !1) {
  const { props: r, ref: n, patchFlag: o, children: l, transition: c } = e, d = t ? Jn(r || {}, t) : r, f = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: d,
    key: d && Gn(d),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      i && n ? U(n) ? n.concat(xi(t)) : [n, xi(t)] : xi(t)
    ) : n,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: l,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Me ? o === -1 ? 16 : o | 16 : o,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: c,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Nt(e.ssContent),
    ssFallback: e.ssFallback && Nt(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
    cacheIndex: e.cacheIndex
  };
  return c && s && Ai(
    f,
    c.clone(f)
  ), f;
}
function qn(e = " ", t = 0) {
  return ne(Gi, null, e, t);
}
function ti(e = "", t = !1) {
  return t ? (ve(), qs(je, null, e)) : ne(je, null, e);
}
function Ge(e) {
  return e == null || typeof e == "boolean" ? ne(je) : U(e) ? ne(
    Me,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : ci(e) ? nt(e) : ne(Gi, null, String(e));
}
function nt(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Nt(e);
}
function Oi(e, t) {
  let i = 0;
  const { shapeFlag: s } = e;
  if (t == null)
    t = null;
  else if (U(t))
    i = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), Oi(e, r()), r._c && (r._d = !0));
      return;
    } else {
      i = 32;
      const r = t._;
      !r && !Ln(t) ? t._ctx = Je : r === 3 && Je && (Je.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (K(t)) {
    if (s & 65) {
      Oi(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Je }, i = 32;
  } else
    t = String(t), s & 64 ? (i = 16, t = [qn(t)]) : i = 8;
  e.children = t, e.shapeFlag |= i;
}
function Jn(...e) {
  const t = {};
  for (let i = 0; i < e.length; i++) {
    const s = e[i];
    for (const r in s)
      if (r === "class")
        t.class !== s.class && (t.class = Is([t.class, s.class]));
      else if (r === "style")
        t.style = ji([t.style, s.style]);
      else if (Fi(r)) {
        const n = t[r], o = s[r];
        o && n !== o && !(U(n) && n.includes(o)) ? t[r] = n ? [].concat(n, o) : o : o == null && n == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !Ni(r) && (t[r] = o);
      } else r !== "" && (t[r] = s[r]);
  }
  return t;
}
function We(e, t, i, s = null) {
  Ue(e, t, 7, [
    i,
    s
  ]);
}
const Yl = On();
let Xn = 0;
function Zl() {
  return Xn;
}
function Ql(e, t, i) {
  const s = e.type, r = (t ? t.appContext : e.appContext) || Yl, n = {
    uid: Xn++,
    vnode: e,
    type: s,
    parent: t,
    appContext: r,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new To(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(r.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: jn(s, r),
    emitsOptions: kn(s, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: ie,
    // inheritAttrs
    inheritAttrs: s.inheritAttrs,
    // state
    ctx: ie,
    data: ie,
    props: ie,
    attrs: ie,
    slots: ie,
    refs: ie,
    setupState: ie,
    setupContext: null,
    // suspense related
    suspense: i,
    suspenseId: i ? i.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return n.ctx = { _: n }, n.root = t ? t.root : n, n.emit = kl.bind(null, n), e.ce && e.ce(n), n;
}
let we = null;
const ec = () => we || Je;
let ki, ai;
{
  const e = Ui(), t = (i, s) => {
    let r;
    return (r = e[i]) || (r = e[i] = []), r.push(s), (n) => {
      r.length > 1 ? r.forEach((o) => o(n)) : r[0](n);
    };
  };
  ki = t(
    "__VUE_INSTANCE_SETTERS__",
    (i) => we = i
  ), ai = t(
    "__VUE_SSR_SETTERS__",
    (i) => fi = i
  );
}
const hi = (e) => {
  const t = we;
  return ki(e), e.scope.on(), () => {
    e.scope.off(), ki(t);
  };
}, Tr = () => {
  we && we.scope.off(), ki(null);
};
function Yn(e) {
  return e.vnode.shapeFlag & 4;
}
let fi = !1;
function tc(e, t = !1, i = !1) {
  t && ai(t);
  const { props: s, children: r } = e.vnode, n = Yn(e);
  Ul(e, s, n, t), $l(e, r, i || t);
  const o = n ? ic(e, t) : void 0;
  return t && ai(!1), o;
}
function ic(e, t) {
  const i = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Sl);
  const { setup: s } = i;
  if (s) {
    Ze();
    const r = e.setupContext = s.length > 1 ? rc(e) : null, n = hi(e), o = di(
      s,
      e,
      0,
      [
        e.props,
        r
      ]
    ), l = Hr(o);
    if (Qe(), n(), (l || e.sp) && !Qt(e) && En(e), l) {
      if (o.then(Tr, Tr), t)
        return o.then((c) => {
          ai(!0);
          try {
            Er(e, c, t);
          } finally {
            ai(!1);
          }
        }).catch((c) => {
          $i(c, e, 0);
        });
      e.asyncDep = o;
    } else
      Er(e, o);
  } else
    Zn(e);
}
function Er(e, t, i) {
  K(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : J(t) && (e.setupState = pn(t)), Zn(e);
}
function Zn(e, t, i) {
  const s = e.type;
  e.render || (e.render = s.render || Xe);
  {
    const r = hi(e);
    Ze();
    try {
      Tl(e);
    } finally {
      Qe(), r();
    }
  }
}
const sc = {
  get(e, t) {
    return ue(e, "get", ""), e[t];
  }
};
function rc(e) {
  const t = (i) => {
    e.exposed = i || {};
  };
  return {
    attrs: new Proxy(e.attrs, sc),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function Js(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(pn($o(e.exposed)), {
    get(t, i) {
      if (i in t)
        return t[i];
      if (i in ei)
        return ei[i](e);
    },
    has(t, i) {
      return i in t || i in ei;
    }
  })) : e.proxy;
}
function nc(e) {
  return K(e) && "__vccOpts" in e;
}
const ii = (e, t) => /* @__PURE__ */ qo(e, t, fi);
function oc(e, t, i) {
  try {
    Pi(-1);
    const s = arguments.length;
    return s === 2 ? J(t) && !U(t) ? ci(t) ? ne(e, null, [t]) : ne(e, t) : ne(e, null, t) : (s > 3 ? i = Array.prototype.slice.call(arguments, 2) : s === 3 && ci(i) && (i = [i]), ne(e, t, i));
  } finally {
    Pi(1);
  }
}
const lc = "3.5.44";
/**
* @vue/runtime-dom v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let Ms;
const Mr = typeof window < "u" && window.trustedTypes;
if (Mr)
  try {
    Ms = /* @__PURE__ */ Mr.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const Qn = Ms ? (e) => Ms.createHTML(e) : (e) => e, cc = "http://www.w3.org/2000/svg", ac = "http://www.w3.org/1998/Math/MathML", rt = typeof document < "u" ? document : null, Ar = rt && /* @__PURE__ */ rt.createElement("template"), fc = {
  insert: (e, t, i) => {
    t.insertBefore(e, i || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, i, s) => {
    const r = t === "svg" ? rt.createElementNS(cc, e) : t === "mathml" ? rt.createElementNS(ac, e) : i ? rt.createElement(e, { is: i }) : rt.createElement(e);
    return e === "select" && s && s.multiple != null && r.setAttribute("multiple", s.multiple), r;
  },
  createText: (e) => rt.createTextNode(e),
  createComment: (e) => rt.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => rt.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, i, s, r, n) {
    const o = i ? i.previousSibling : t.lastChild;
    if (r && (r === n || r.nextSibling))
      for (; t.insertBefore(r.cloneNode(!0), i), !(r === n || !(r = r.nextSibling)); )
        ;
    else {
      Ar.innerHTML = Qn(
        s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e
      );
      const l = Ar.content;
      if (s === "svg" || s === "mathml") {
        const c = l.firstChild;
        for (; c.firstChild; )
          l.appendChild(c.firstChild);
        l.removeChild(c);
      }
      t.insertBefore(l, i);
    }
    return [
      // first
      o ? o.nextSibling : t.firstChild,
      // last
      i ? i.previousSibling : t.lastChild
    ];
  }
}, uc = /* @__PURE__ */ Symbol("_vtc");
function dc(e, t, i) {
  const s = e[uc];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")), t == null ? e.removeAttribute("class") : i ? e.setAttribute("class", t) : e.className = t;
}
const Cr = /* @__PURE__ */ Symbol("_vod"), hc = /* @__PURE__ */ Symbol("_vsh"), pc = /* @__PURE__ */ Symbol(""), gc = /(?:^|;)\s*display\s*:/;
function mc(e, t, i) {
  const s = e.style, r = se(i);
  let n = !1;
  if (i && !r) {
    if (t)
      if (se(t))
        for (const o of t.split(";")) {
          const l = o.slice(0, o.indexOf(":")).trim();
          i[l] == null && Gt(s, l, "");
        }
      else
        for (const o in t)
          i[o] == null && Gt(s, o, "");
    for (const o in i) {
      o === "display" && (n = !0);
      const l = i[o];
      l != null ? bc(
        e,
        o,
        !se(t) && t ? t[o] : void 0,
        l
      ) || Gt(s, o, l) : Gt(s, o, "");
    }
  } else if (r) {
    if (t !== i) {
      const o = s[pc];
      o && (i += ";" + o), s.cssText = i, n = gc.test(i);
    }
  } else t && e.removeAttribute("style");
  Cr in e && ((!r || t !== i) && (e[Cr] = n ? s.display : ""), e[hc] && (s.display = "none"));
}
const wi = /\s*!important$/;
function Gt(e, t, i) {
  if (U(i))
    i.forEach((s) => Gt(e, t, s));
  else if (i == null && (i = ""), t.startsWith("--"))
    wi.test(i) ? e.setProperty(t, i.replace(wi, ""), "important") : e.setProperty(t, i);
  else {
    const s = yc(e, t);
    wi.test(i) ? e.setProperty(
      wt(s),
      i.replace(wi, ""),
      "important"
    ) : e[s] = i;
  }
}
const Rr = ["Webkit", "Moz", "ms"], ls = {};
function yc(e, t) {
  const i = ls[t];
  if (i)
    return i;
  let s = Ne(t);
  if (s !== "filter" && s in e)
    return ls[t] = s;
  s = zr(s);
  for (let r = 0; r < Rr.length; r++) {
    const n = Rr[r] + s;
    if (n in e)
      return ls[t] = n;
  }
  return t;
}
function bc(e, t, i, s) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && se(s) && i === s;
}
const Pr = "http://www.w3.org/1999/xlink";
function Or(e, t, i, s, r, n = _o(t)) {
  s && t.startsWith("xlink:") ? i == null ? e.removeAttributeNS(Pr, t.slice(6, t.length)) : e.setAttributeNS(Pr, t, i) : i == null || n && !qr(i) ? e.removeAttribute(t) : e.setAttribute(
    t,
    n ? "" : Ye(i) ? String(i) : i
  );
}
function kr(e, t, i, s, r) {
  if (t === "innerHTML" || t === "textContent") {
    i != null && (e[t] = t === "innerHTML" ? Qn(i) : i);
    return;
  }
  const n = e.tagName;
  if (t === "value" && n !== "PROGRESS" && // custom elements may use _value internally
  !n.includes("-")) {
    const l = n === "OPTION" ? e.getAttribute("value") || "" : e.value, c = i == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(i);
    (l !== c || !("_value" in e)) && (e.value = c), i == null && e.removeAttribute(t), e._value = i;
    return;
  }
  let o = !1;
  if (i === "" || i == null) {
    const l = typeof e[t];
    l === "boolean" ? i = qr(i) : i == null && l === "string" ? (i = "", o = !0) : l === "number" && (i = 0, o = !0);
  }
  try {
    e[t] = i;
  } catch {
  }
  o && e.removeAttribute(r || t);
}
function wc(e, t, i, s) {
  e.addEventListener(t, i, s);
}
function vc(e, t, i, s) {
  e.removeEventListener(t, i, s);
}
const Ir = /* @__PURE__ */ Symbol("_vei");
function _c(e, t, i, s, r = null) {
  const n = e[Ir] || (e[Ir] = {}), o = n[t];
  if (s && o)
    o.value = s;
  else {
    const [l, c] = Tc(t);
    if (s) {
      const d = n[t] = Ac(
        s,
        r
      );
      wc(e, l, d, c);
    } else o && (vc(e, l, o, c), n[t] = void 0);
  }
}
const xc = /(Once|Passive|Capture)$/, Sc = /^on:?(?:Once|Passive|Capture)$/;
function Tc(e) {
  let t, i;
  for (; (i = e.match(xc)) && !Sc.test(e); )
    t || (t = {}), e = e.slice(0, e.length - i[1].length), t[i[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : wt(e.slice(2)), t];
}
let cs = 0;
const Ec = /* @__PURE__ */ Promise.resolve(), Mc = () => cs || (Ec.then(() => cs = 0), cs = Date.now());
function Ac(e, t) {
  const i = (s) => {
    if (!s._vts)
      s._vts = Date.now();
    else if (s._vts <= i.attached)
      return;
    const r = i.value;
    if (U(r)) {
      const n = s.stopImmediatePropagation;
      s.stopImmediatePropagation = () => {
        n.call(s), s._stopped = !0;
      };
      const o = r.slice(), l = [s];
      for (let c = 0; c < o.length && !s._stopped; c++) {
        const d = o[c];
        d && Ue(
          d,
          t,
          5,
          l
        );
      }
    } else
      Ue(
        r,
        t,
        5,
        [s]
      );
  };
  return i.value = e, i.attached = Mc(), i;
}
const Dr = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Cc = (e, t, i, s, r, n) => {
  const o = r === "svg";
  t === "class" ? dc(e, s, o) : t === "style" ? mc(e, i, s) : Fi(t) ? Ni(t) || _c(e, t, i, s, n) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : Rc(e, t, s, o)) ? (kr(e, t, s), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Or(e, t, s, o, n, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Pc(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !se(s))) ? kr(e, Ne(t), s, n, t) : (t === "true-value" ? e._trueValue = s : t === "false-value" && (e._falseValue = s), Or(e, t, s, o));
};
function Rc(e, t, i, s) {
  if (s)
    return !!(t === "innerHTML" || t === "textContent" || t in e && Dr(t) && K(i));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return Dr(t) && se(i) ? !1 : t in e;
}
function Pc(e, t) {
  const i = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!i)
    return !1;
  const s = Ne(t);
  return Array.isArray(i) ? i.some((r) => Ne(r) === s) : Object.keys(i).some((r) => Ne(r) === s);
}
const Oc = ["ctrl", "shift", "alt", "meta"], kc = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => Oc.some((i) => e[`${i}Key`] && !t.includes(i))
}, Dt = (e, t) => {
  if (!e) return e;
  const i = e._withMods || (e._withMods = {}), s = t.join(".");
  return i[s] || (i[s] = ((r, ...n) => {
    for (let o = 0; o < t.length; o++) {
      const l = kc[t[o]];
      if (l && l(r, t)) return;
    }
    return e(r, ...n);
  }));
}, Ic = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, eo = (e, t) => {
  const i = e._withKeys || (e._withKeys = {}), s = t.join(".");
  return i[s] || (i[s] = ((r) => {
    if (!("key" in r))
      return;
    const n = wt(r.key);
    if (t.some(
      (o) => o === n || Ic[o] === n
    ))
      return e(r);
  }));
}, Dc = /* @__PURE__ */ he({ patchProp: Cc }, fc);
let Fr;
function Fc() {
  return Fr || (Fr = Wl(Dc));
}
const Nc = ((...e) => {
  const t = Fc().createApp(...e), { mount: i } = t;
  return t.mount = (s) => {
    const r = Uc(s);
    if (!r) return;
    const n = t._component;
    !K(n) && !n.render && !n.template && (n.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const o = i(r, !1, Lc(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), o;
  }, t;
});
function Lc(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function Uc(e) {
  return se(e) ? document.querySelector(e) : e;
}
const jc = 0.03, Ae = (e, t) => e[0] * t[0] + e[1] * t[1] + e[2] * t[2], vi = (e, t) => e.map((i, s) => i + t[s]), Kc = (e, t) => e.map((i, s) => i - t[s]), $t = (e, t) => e.map((i) => i * t), as = (e, t) => [e[1] * t[2] - e[2] * t[1], e[2] * t[0] - e[0] * t[2], e[0] * t[1] - e[1] * t[0]], fs = (e, t) => e.map((i) => Ae(i, t));
function Bc(e, t, i, s, r, n, o = [0, 0]) {
  const l = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([y, w]) => vi(e, vi($t(t, y * s / 2), $t(i, w * r / 2)))), c = 0.05 * e[2], d = [], f = (y) => {
    const w = fs(n, y);
    return [w[0] / w[2] + o[0], w[1] / w[2] + o[1]];
  };
  l.forEach((y, w) => {
    const T = l[(w + 1) % 4];
    y[2] >= c && d.push(y), y[2] >= c != T[2] >= c && d.push(vi(y, $t(Kc(T, y), (c - y[2]) / (T[2] - y[2]))));
  });
  const g = vi(e, $t(i, -r / 2)), h = f(e), u = fs(n, e), m = fs(n, $t(i, -1));
  return { corners: d.map(f), handles: l.map((y) => y[2] >= c ? f(y) : null), center: h, top: g[2] >= c ? f(g) : null, up: [m[0] * u[2] - u[0] * m[2], m[1] * u[2] - u[1] * m[2]] };
}
function Xs(e) {
  const t = [as(e[1], e[2]), as(e[2], e[0]), as(e[0], e[1])], i = Ae(e[0], t[0]);
  return [0, 1, 2].map((s) => [0, 1, 2].map((r) => t[r][s] / i));
}
function $c(e, t) {
  const i = t.grid_w, s = t.grid_h, r = i * s;
  if (t.format !== 1 || !Number.isInteger(i) || !Number.isInteger(s) || i < 1 || s < 1 || e.byteLength !== r * 25) throw new Error("The surface data is incomplete. Run the workflow again.");
  const n = new DataView(e), o = new Float32Array(r * 3), l = new Float32Array(r * 3);
  for (let c = 0; c < r * 3; c++)
    o[c] = n.getFloat32(c * 4, !0), l[c] = n.getFloat32(r * 12 + c * 4, !0);
  return { width: i, height: s, points: o, normals: l, valid: new Uint8Array(e.slice(r * 24)), intrinsics: t.intrinsics };
}
function Hc(e) {
  const { width: t, height: i, points: s, valid: r } = e, n = new Float32Array(t * i);
  for (let o = 0; o < i; o++) for (let l = 0; l < t; l++) {
    const c = o * t + l;
    if (!r[c]) continue;
    let d = s[c * 3 + 2], f = d;
    for (let g = -1; g <= 1; g++) for (let h = -1; h <= 1; h++) {
      const u = Math.max(0, Math.min(i - 1, o + g)) * t + Math.max(0, Math.min(t - 1, l + h));
      r[u] && (d = Math.min(d, s[u * 3 + 2]), f = Math.max(f, s[u * 3 + 2]));
    }
    n[c] = (f - d) / s[c * 3 + 2];
  }
  return n;
}
function Ys(e, t) {
  const i = e.anchor ? t.anchor.map((r, n) => r - e.anchor[n]) : [0, 0], s = (t.rotation - (e.rotation ?? t.rotation)) * Math.PI / 180;
  return { offset: i, scale: t.size / (e.size ?? t.size), cos: Math.cos(s), sin: Math.sin(s) };
}
function to(e, t, i) {
  const s = Ys(e, t), r = s.cos, n = s.sin, o = [...e.p0], l = e.e1.map((g, h) => g * r + e.e2[h] * n), c = e.e2.map((g, h) => -e.e1[h] * n + g * r), d = e.w * s.scale, f = e.h * s.scale;
  return { ...e, ...Bc(o, l, c, d, f, i, s.offset) };
}
function Wc(e, t, i, s) {
  const r = Ys(e, t), n = i.map((c, d) => c - r.offset[d]);
  let o, l;
  if (e.field) {
    const [c, d] = e.gridSize, [f, g, h, u] = e.fieldRect, m = n[0] * c - 0.5 - f, y = n[1] * d - 0.5 - g, w = Math.floor(m), T = Math.floor(y);
    let E = 0, I = 0, M = 0;
    for (let N = 0; N < 2; N++) for (let Z = 0; Z < 2; Z++) {
      const O = w + Z, B = T + N;
      if (O < 0 || O >= h || B < 0 || B >= u) continue;
      const W = (B * h + O) * 4, re = (Z ? m - w : 1 - m + w) * (N ? y - T : 1 - y + T) * e.field[W + 3];
      E += e.field[W] * re, I += e.field[W + 1] * re, M += re;
    }
    if (!M) return null;
    o = E / M, l = I / M;
  } else {
    const c = Xs(s).map((m) => Ae(m, [...n, 1])), d = Ae(e.n, c), f = Ae(e.n, e.p0) / d;
    if (!(f > 0)) return null;
    const g = c.map((m, y) => m * f - e.p0[y]);
    o = Ae(g, e.e1), l = Ae(g, e.e2);
    const [h, u] = e.gridSize ?? [0, 0];
    if (h && u && !e.region[Math.min(u - 1, Math.max(0, Math.floor(n[1] * u))) * h + Math.min(h - 1, Math.max(0, Math.floor(n[0] * h)))]) return null;
  }
  return [(o * r.cos + l * r.sin) / (e.w * r.scale) + 0.5, (-o * r.sin + l * r.cos) / (e.h * r.scale) + 0.5];
}
function io(e, t, i = 1) {
  if (!t.handles && t.corners.length !== 4) return null;
  const s = ([g, h]) => [e.left + g * e.width, e.top + h * e.height], r = (t.handles ?? t.corners).filter(Boolean).map(s);
  if (!r.length) return null;
  const n = t.center ? s(t.center) : r[0].map((g, h) => (g + r[2][h]) / 2), o = t.top === null, l = t.top ? s(t.top) : o ? n : r[0].map((g, h) => (g + r[1][h]) / 2), c = o ? [t.up[0] * e.width, t.up[1] * e.height] : l.map((g, h) => g - n[h]), d = Math.hypot(...c) || 1, f = o ? Math.hypot(e.width, e.height) / 4 : 24 * i;
  return { corners: r, top: l, rotate: l.map((g, h) => g + c[h] / d * f) };
}
let ce = null;
const Rt = /* @__PURE__ */ new Map(), Nr = /* @__PURE__ */ new WeakMap(), Lr = /* @__PURE__ */ new WeakMap();
function Ur(e) {
  let t = Nr.get(e);
  return t || (t = Uint8Array.from(e, (i) => i ? 255 : 0), Nr.set(e, t)), t;
}
const Vc = `#version 300 es
out vec2 uv;
void main(){ vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2)); uv=vec2(p.x,1.-p.y); gl_Position=vec4(p*2.-1.,0.,1.); }`, zc = `#version 300 es
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
  if(allowed<.5||abs(dot(n,p-p0))>${jc}*p.z)discard;
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
function Gc() {
  const e = typeof document > "u" ? new OffscreenCanvas(1, 1) : document.createElement("canvas"), t = e.getContext("webgl2", { alpha: !0, premultipliedAlpha: !0, antialias: !1, preserveDrawingBuffer: !0 });
  if (!t) throw new Error("WebGL2 is unavailable. Enable hardware acceleration and reload the page.");
  const i = t.createProgram();
  for (const [n, o] of [[t.VERTEX_SHADER, Vc], [t.FRAGMENT_SHADER, zc]]) {
    const l = t.createShader(n);
    if (t.shaderSource(l, o), t.compileShader(l), !t.getShaderParameter(l, t.COMPILE_STATUS)) throw new Error(t.getShaderInfoLog(l));
    t.attachShader(i, l), t.deleteShader(l);
  }
  if (t.linkProgram(i), !t.getProgramParameter(i, t.LINK_STATUS)) throw new Error(t.getProgramInfoLog(i));
  t.useProgram(i);
  const s = /* @__PURE__ */ new Map(), r = (n) => (s.has(n) || s.set(n, t.getUniformLocation(i, n)), s.get(n));
  return e.addEventListener("webglcontextlost", (n) => {
    n.preventDefault();
  }), { canvas: e, gl: t, program: i, location: r };
}
function at(e, t, i, s, r = 4, n = !1) {
  const { gl: o } = ce;
  if (Rt.has(e)) return Rt.get(e);
  const l = o.getParameter(o.TEXTURE_BINDING_2D), c = o.createTexture();
  if (o.bindTexture(o.TEXTURE_2D, c), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MIN_FILTER, n ? o.LINEAR : o.NEAREST), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MAG_FILTER, n ? o.LINEAR : o.NEAREST), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_S, o.CLAMP_TO_EDGE), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_T, o.CLAMP_TO_EDGE), o.pixelStorei(o.UNPACK_ALIGNMENT, 1), r === 4 && ArrayBuffer.isView(s)) {
    const d = s instanceof Float32Array;
    o.texImage2D(o.TEXTURE_2D, 0, d ? o.RGBA32F : o.RGBA, t, i, 0, o.RGBA, d ? o.FLOAT : o.UNSIGNED_BYTE, s);
  } else if (r === 4) {
    const d = new OffscreenCanvas(t, i);
    d.getContext("2d").drawImage(s, 0, 0);
    const f = o.getParameter(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
    o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
    try {
      o.texImage2D(o.TEXTURE_2D, 0, o.RGBA, o.RGBA, o.UNSIGNED_BYTE, d);
    } finally {
      o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL, f);
    }
  } else {
    const d = s instanceof Float32Array;
    o.texImage2D(o.TEXTURE_2D, 0, r === 3 ? o.RGB32F : d ? o.R32F : o.R8, t, i, 0, r === 3 ? o.RGB : o.RED, d ? o.FLOAT : o.UNSIGNED_BYTE, s);
  }
  return Rt.set(e, c), o.bindTexture(o.TEXTURE_2D, l), c;
}
function ft(e, t, i) {
  const { gl: s, location: r } = ce;
  s.activeTexture(s.TEXTURE0 + e), s.bindTexture(s.TEXTURE_2D, i), s.uniform1i(r(t), e);
}
function De(e) {
  Rt.has(e) && (ce == null || ce.gl.deleteTexture(Rt.get(e)), Rt.delete(e));
}
function qc(e) {
  De(e.grid.points), De(e.grid.valid), De(e.light), De(e.material), De(e.spread);
}
function Jc() {
  var e;
  if (ce) {
    for (const t of [...Rt.keys()]) De(t);
    ce.gl.deleteProgram(ce.program), (e = ce.gl.getExtension("WEBGL_lose_context")) == null || e.loseContext(), ce = null;
  }
}
function Ii(e, t) {
  const i = Math.min(e.width / t.image_w, e.height / t.image_h), s = Math.round(t.image_w * i), r = Math.round(t.image_h * i);
  return { left: (e.width - s) / 2, top: (e.height - r) / 2, width: s, height: r };
}
function Xc(e, t, i, s, r) {
  const n = Lr.get(t), o = [r.width, r.height, s.opacity, s.shading, s.edge, t.lref].join(",");
  if ((n == null ? void 0 : n.key) === o && n.source === i) return n;
  ce ?? (ce = Gc());
  const { gl: l, location: c } = ce;
  if (l.isContextLost()) throw new Error("The image display stopped. Reload the page to restore it.");
  ce.canvas.width !== r.width && (ce.canvas.width = r.width), ce.canvas.height !== r.height && (ce.canvas.height = r.height), l.viewport(0, 0, r.width, r.height), l.useProgram(ce.program), l.disable(l.SCISSOR_TEST), l.clearColor(0, 0, 0, 0), l.clear(l.COLOR_BUFFER_BIT), l.enable(l.BLEND), l.blendFuncSeparate(l.SRC_ALPHA, l.ONE_MINUS_SRC_ALPHA, l.ONE, l.ONE_MINUS_SRC_ALPHA);
  const d = Xs(e.grid.intrinsics);
  l.uniformMatrix3fv(c("inverseK"), !1, new Float32Array([0, 1, 2].flatMap((N) => [0, 1, 2].map((Z) => d[Z][N])))), l.uniform2f(c("gridSize"), e.grid.width, e.grid.height), ft(0, "picture", at(i, i.width, i.height, i, 4, !0)), ft(1, "points", at(e.grid.points, e.grid.width, e.grid.height, e.grid.points, 3)), ft(2, "valid", at(e.grid.valid, e.grid.width, e.grid.height, Ur(e.grid.valid), 1)), ft(4, "light", at(e.light, e.image.width, e.image.height, e.light, 1)), l.uniform1i(c("materialized"), !!e.material), e.material && ft(7, "appearance", at(e.material, e.image.width, e.image.height, e.material, 4)), e.spread ?? (e.spread = Hc(e.grid)), ft(6, "spread", at(e.spread, e.grid.width, e.grid.height, e.spread, 1));
  const [f, g] = t.gridSize ?? [e.grid.width, e.grid.height];
  l.uniform1i(c("wrapped"), !!t.field), t.field && (l.uniform4fv(c("fieldRect"), t.fieldRect), l.uniform2f(c("mapGrid"), f, g), ft(5, "warp", at(t.field, t.fieldRect[2], t.fieldRect[3], t.field, 4))), ft(3, "region", at(t.region, f, g, Ur(t.region), 1));
  for (const N of ["p0", "n", "e1", "e2"]) l.uniform3fv(c(N), t[N]);
  l.uniform2f(c("size"), t.w, t.h);
  for (const [N, Z] of Object.entries({ opacity: s.opacity, edge: s.edge, shading: s.shading, lref: t.lref ?? 1 })) l.uniform1f(c(N), Z);
  const h = t.bounds, u = Math.max(0, Math.floor(h[0] * r.width) - 2), m = Math.min(r.width, Math.ceil(h[2] * r.width) + 2), y = Math.max(0, Math.floor(h[1] * r.height) - 2), w = Math.min(r.height, Math.ceil(h[3] * r.height) + 2), T = Math.max(1, m - u), E = Math.max(1, w - y);
  l.enable(l.SCISSOR_TEST), l.scissor(u, r.height - w, T, E), l.drawArrays(l.TRIANGLES, 0, 3), l.disable(l.SCISSOR_TEST);
  const I = new OffscreenCanvas(T, E);
  I.getContext("2d").drawImage(ce.canvas, u, y, T, E, 0, 0, T, E);
  const M = { key: o, source: i, canvas: I, left: u, top: y };
  return Lr.set(t, M), M;
}
function Yc(e, t, i, s, r, n, o = !1) {
  const l = Ii(e, t.meta), c = e.getContext("2d");
  c.clearRect(0, 0, e.width, e.height), c.imageSmoothingEnabled = !0, c.imageSmoothingQuality = "high", c.drawImage(t.image, l.left, l.top, l.width, l.height);
  for (const h of i) {
    const u = s.get(h.id), m = r.get(h.id);
    if (!h.visible || !u || !m) continue;
    const y = u.bitmap ? { canvas: u.bitmap, left: u.bitmapRect[0] * l.width / u.bitmapBox[0], top: u.bitmapRect[1] * l.height / u.bitmapBox[1] } : Xc(t, u, m, h, l), w = Ys(u, h), T = u.anchor ?? h.anchor, E = T[0] * l.width, I = T[1] * l.height;
    c.save(), c.translate(l.left + E + w.offset[0] * l.width, l.top + I + w.offset[1] * l.height), c.globalAlpha = u.bitmap ? h.opacity : 1, c.rotate(Math.atan2(w.sin, w.cos)), c.scale(w.scale, w.scale), u.bitmap ? c.drawImage(y.canvas, y.left - E, y.top - I, y.canvas.width * l.width / u.bitmapBox[0], y.canvas.height * l.height / u.bitmapBox[1]) : c.drawImage(y.canvas, y.left - E, y.top - I), c.restore();
  }
  const d = s.get(n), f = i.find((h) => h.id === n), g = d && f ? to(d, f, t.grid.intrinsics) : null;
  if (g && f.visible && !o) {
    const h = e.width / e.getBoundingClientRect().width;
    c.save();
    const u = g.corners.map(([y, w]) => [l.left + y * l.width, l.top + w * l.height]);
    c.lineWidth = 1.5 * h, c.lineCap = "round", c.lineJoin = "round", c.strokeStyle = f.locked ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.95)", c.shadowColor = "rgba(0,0,0,.6)", c.shadowBlur = 2 * h, c.beginPath(), u.forEach((y, w) => {
      if (g.handles && !g.handles.some((E) => E && l.left + E[0] * l.width === y[0] && l.top + E[1] * l.height === y[1])) return;
      const T = [u[(w + u.length - 1) % u.length], u[(w + 1) % u.length]].map((E) => {
        const I = E[0] - y[0], M = E[1] - y[1], N = Math.hypot(I, M) || 1, Z = Math.min(10 * h, N * 0.25);
        return [y[0] + I / N * Z, y[1] + M / N * Z];
      });
      c.moveTo(...T[0]), c.lineTo(...y), c.lineTo(...T[1]);
    }), c.stroke();
    const m = io(l, g, h);
    if (m && !f.locked) {
      const [y, w] = m.rotate, T = 5 * h, E = Math.PI * 0.15;
      c.beginPath(), c.arc(y, w, T, Math.PI * 0.65, Math.PI * 2 + E), c.stroke();
      const I = [y + Math.cos(E) * T, w + Math.sin(E) * T], M = E - Math.PI / 2;
      c.beginPath(), c.moveTo(I[0] + Math.cos(M - 0.65) * 3 * h, I[1] + Math.sin(M - 0.65) * 3 * h), c.lineTo(...I), c.lineTo(I[0] + Math.cos(M + 0.65) * 3 * h, I[1] + Math.sin(M + 0.65) * 3 * h), c.stroke();
    }
    c.restore();
  }
}
const Zc = "The sticker data is damaged.", As = "The sticker source must stay inside ComfyUI/input.", so = Object.freeze({ mode: "wrap", size: 0.25, rotation: 0, opacity: 1, shading: 0.8, edge: 0.04, visible: !0, locked: !1 }), ro = { size: [0.01, 4], opacity: [0, 1], shading: [0, 1], edge: [5e-3, 0.5] }, us = (e) => e !== null && typeof e == "object" && !Array.isArray(e), me = (e = Zc) => {
  throw new Error(e);
}, Zs = (e) => typeof e == "number" && Number.isFinite(e) ? e : me();
function Qs() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
}
const er = () => `st_${Qs().slice(0, 12)}`;
function Cs(e, t) {
  const [i, s] = ro[e];
  return Math.min(s, Math.max(i, Zs(t)));
}
function no(e) {
  const t = ((Zs(e) + 180) % 360 + 360) % 360 - 180;
  return t === -180 ? 180 : t;
}
const jr = (e, t = !1) => ((typeof e != "string" || /[\0\\:]/.test(e) || e.startsWith("/") || e.split("/").some((i) => i === "." || i === "..") || t && (!e || e.includes("/"))) && me(As), e);
function ds(e) {
  let t;
  try {
    t = e.trim() ? JSON.parse(e) : {};
  } catch {
    me();
  }
  us(t) || me(), "version" in t || (t.version = 1), Number.isInteger(t.version) || me(), t.version !== 1 && me("This workflow was saved by a newer Slap Stickers. Update the node."), "stickers" in t || (t.stickers = []), Array.isArray(t.stickers) || me();
  const i = /* @__PURE__ */ new Set();
  for (const s of t.stickers) {
    us(s) || me(), "id" in s || (s.id = er()), (typeof s.id != "string" || !s.id || i.has(s.id)) && me(), i.add(s.id), us(s.source) || me(As), jr(s.source.filename, !0), "subfolder" in s.source || (s.source.subfolder = ""), jr(s.source.subfolder), "type" in s.source || (s.source.type = "input"), s.source.type !== "input" && me(As), "name" in s || (s.name = s.source.filename), typeof s.name != "string" && me();
    for (const [r, n] of Object.entries(so)) r in s || (s[r] = n);
    (!["flat", "wrap"].includes(s.mode) || typeof s.visible != "boolean" || typeof s.locked != "boolean") && me(), "anchor" in s || (s.anchor = [0.5, 0.5]), (!Array.isArray(s.anchor) || s.anchor.length !== 2) && me(), s.anchor = s.anchor.map((r) => Math.min(1, Math.max(0, Zs(r))));
    for (const r of Object.keys(ro)) s[r] = Cs(r, s[r]);
    s.rotation = no(s.rotation);
  }
  return t;
}
function Di(e) {
  return JSON.stringify(e, (t, i) => typeof i != "number" ? i : (Number.isFinite(i) || me(), Math.round(i * 1e6) / 1e6));
}
function Qc(e, t, i) {
  return { id: er(), name: t, source: e, anchor: i, ...so };
}
function ea(e, t) {
  let i = null;
  const s = [];
  function r(h, u, m, y) {
    h.addEventListener(u, m, y), s.push(() => h.removeEventListener(u, m, y));
  }
  function n(h) {
    if (!t.entry) return null;
    const u = e.getBoundingClientRect(), m = Ii(e, t.entry.meta);
    return [((h.clientX - u.left) * e.width / u.width - m.left) / m.width, ((h.clientY - u.top) * e.height / u.height - m.top) / m.height];
  }
  function o(h) {
    for (const u of [...t.model.state.stickers].reverse()) {
      const m = t.frames.get(u.id);
      if (!u.visible || !m || u.opacity <= 0) continue;
      const y = Wc(m, u, h, t.entry.grid.intrinsics);
      if (y && y.every((w) => w >= 0 && w <= 1)) return u;
    }
    return null;
  }
  function l() {
    const h = i;
    return i = null, t.model.dragging = !1, t.model.invalid = !1, e.style.cursor = "", h && e.hasPointerCapture(h.pointer) && e.releasePointerCapture(h.pointer), t.notify(), h;
  }
  function c() {
    const h = l();
    return h ? (t.replaceState(h.snapshot), t.update().catch(t.error), !0) : !1;
  }
  function d(h) {
    const u = t.model.state.stickers.find((I) => I.id === t.model.selected), m = u && t.frames.get(u.id);
    if (!u || u.locked || !u.visible || !m) return null;
    const y = e.getBoundingClientRect(), w = e.width / y.width, T = io(Ii(e, t.entry.meta), to(m, u, t.entry.grid.intrinsics), w);
    if (!T) return null;
    const E = [(h.clientX - y.left) * w, (h.clientY - y.top) * e.height / y.height];
    return Math.hypot(...E.map((I, M) => I - T.rotate[M])) < 11 * w ? { st: u, frame: m, type: "rotate" } : T.corners.some((I) => Math.hypot(...E.map((M, N) => M - I[N])) < 10 * w) ? { st: u, frame: m, type: "resize" } : null;
  }
  function f(h, u) {
    const m = Xs(t.entry.grid.intrinsics).map((E) => Ae(E, [...h, 1])), y = Ae(u.n, m);
    if (Math.abs(y) < 1e-12) return null;
    const w = Ae(u.n, u.p0) / y;
    if (w <= 0) return null;
    const T = m.map((E, I) => E * w - u.p0[I]);
    return [Ae(T, u.e1), Ae(T, u.e2)];
  }
  r(e, "pointerdown", (h) => {
    if (h.button !== 0 || !t.entry) return;
    e.focus({ preventScroll: !0 });
    const u = n(h), m = d(h), y = (m == null ? void 0 : m.st) ?? o(u);
    if (t.model.selected = (y == null ? void 0 : y.id) ?? null, t.notify(), h.preventDefault(), h.stopPropagation(), !y || y.locked) return;
    const w = t.frames.get(y.id), T = f(u, w);
    i = {
      id: y.id,
      pointer: h.pointerId,
      type: (m == null ? void 0 : m.type) ?? "move",
      frame: w,
      size: y.size,
      rotation: y.rotation,
      startAngle: T ? Math.atan2(T[1], T[0]) : 0,
      offset: y.anchor.map((E, I) => E - u[I]),
      width: w.w,
      snapshot: t.model.state,
      before: Di(t.model.state)
    }, t.model.dragging = !0, e.setPointerCapture(h.pointerId), e.style.cursor = i.type === "move" ? "grabbing" : i.type === "resize" ? "nwse-resize" : "crosshair";
  }), r(e, "pointermove", (h) => {
    if (!i) {
      const m = t.entry && d(h);
      e.style.cursor = (m == null ? void 0 : m.type) === "resize" ? "nwse-resize" : m ? "crosshair" : "";
      return;
    }
    if (h.pointerId !== i.pointer) return;
    const u = n(h);
    if (i.type === "move") {
      const m = u.map((y, w) => y + i.offset[w]);
      t.model.invalid = !t.validAnchor(m), e.style.cursor = t.model.invalid ? "not-allowed" : "grabbing", t.model.invalid || (t.setSticker(i.id, { anchor: m }), t.update({ id: i.id, width: i.width }).catch(t.error));
    } else {
      const m = f(u, i.frame);
      if (!m) return;
      if (i.type === "resize") {
        const y = Math.max(2 * Math.abs(m[0]) / i.frame.w, 2 * Math.abs(m[1]) / i.frame.h);
        t.setSticker(i.id, { size: Cs("size", i.size * y) });
      } else {
        let y = i.rotation + (Math.atan2(m[1], m[0]) - i.startAngle) * 180 / Math.PI;
        h.shiftKey && (y = Math.round(y / 15) * 15), t.setSticker(i.id, { rotation: no(y) });
      }
      t.update().catch(t.error);
    }
    t.notify(), h.stopPropagation();
  }), r(e, "pointerup", async (h) => {
    if (!i || h.pointerId !== i.pointer) return;
    const u = l();
    h.stopPropagation();
    try {
      await t.update(u.type === "move" ? { id: u.id, width: u.width } : null);
      const m = t.frames.get(u.id);
      if (m && u.type === "move") {
        const y = Cs("size", u.width * t.entry.grid.intrinsics[0][0] / m.p0[2]);
        t.setSticker(u.id, { size: y }), m.size = y;
      }
      Di(t.model.state) !== u.before && t.save();
    } catch (m) {
      t.error(m);
    }
  }), r(e, "pointercancel", c), r(e, "lostpointercapture", () => {
    i && c();
  }), r(window, "blur", c), r(e, "keydown", (h) => {
    h.key === "Escape" && c() && (h.preventDefault(), h.stopPropagation());
  });
  const g = (h) => {
    var u;
    return [...((u = h.dataTransfer) == null ? void 0 : u.items) ?? []].some((m) => m.kind === "file" && m.type.startsWith("image/"));
  };
  return r(e, "dragover", (h) => {
    g(h) && (h.preventDefault(), h.stopImmediatePropagation(), h.dataTransfer.dropEffect = t.entry && t.validAnchor(n(h)) ? "copy" : "none");
  }, !0), r(e, "drop", (h) => {
    var y;
    const u = [...((y = h.dataTransfer) == null ? void 0 : y.files) ?? []].filter((w) => w.type.startsWith("image/"));
    if (!u.length) return;
    h.preventDefault(), h.stopImmediatePropagation();
    const m = n(h) ?? [0.5, 0.5];
    (async () => {
      for (const w of u) await t.addFile(w, m);
    })().catch(t.error);
  }, !0), () => {
    c();
    for (const h of s) h();
  };
}
const ta = {
  key: 0,
  class: "ss-recovery",
  role: "status"
}, ia = {
  key: 1,
  class: "ss-empty"
}, sa = {
  key: 2,
  class: "ss-empty",
  role: "status"
}, ra = {
  __name: "SsStage",
  props: { session: { type: Object, required: !0 } },
  setup(e) {
    const t = e, i = /* @__PURE__ */ Fe(null), s = /* @__PURE__ */ Fe(null);
    let r, n, o, l, c = 0, d = !0;
    function f() {
      if (c = 0, !d) return;
      const h = performance.now(), u = i.value, m = s.value.getBoundingClientRect();
      if (m.width <= 0 || m.height <= 0) return;
      const y = window.devicePixelRatio || 1, w = Math.round(m.width * y), T = Math.round(m.height * y);
      if ((u.width !== w || u.height !== T) && (u.width = w, u.height = T), t.session.setViewport(w, T), !!t.session.entry)
        try {
          Yc(u, t.session.entry, t.session.model.state.stickers, t.session.frames, t.session.sources, t.session.model.selected, t.session.model.dragging), u.dataset.selectionReady = String(t.session.frames.has(t.session.model.selected));
          const E = t.session.model.state.stickers.find((I) => I.id === t.session.model.selected);
          u.dataset.renderedAnchor = (E == null ? void 0 : E.anchor.join(",")) ?? "", u.dataset.renderedAt = String(performance.now()), u.dataset.renderDuration = String(performance.now() - h);
        } catch (E) {
          t.session.error(E);
        }
    }
    function g() {
      !c && d && (c = requestAnimationFrame(f));
    }
    return An(() => {
      o = ea(i.value, t.session), l = t.session.subscribe(g), r = new ResizeObserver(g), r.observe(s.value), n = new IntersectionObserver((h) => {
        d = h[h.length - 1].isIntersecting, d && g();
      }), n.observe(s.value), g();
    }), Vi(() => {
      o == null || o(), l == null || l(), r == null || r.disconnect(), n == null || n.disconnect(), cancelAnimationFrame(c);
    }), (h, u) => (ve(), Ce("div", {
      ref_key: "host",
      ref: s,
      class: "ss-stage"
    }, [
      ye("canvas", {
        ref_key: "canvas",
        ref: i,
        class: "ss-canvas",
        tabindex: "0",
        "data-testid": "surface-stage",
        "aria-label": "Image surface. Drop an image to add a sticker, then drag it to move it."
      }, null, 512),
      e.session.model.missing.length ? (ve(), Ce("div", ta, [
        ye("span", null, "Unavailable images: " + si(e.session.model.missing.map((m) => m.name).join(", ")), 1),
        ye("button", {
          type: "button",
          class: "ss-button",
          onClick: u[0] || (u[0] = Dt((...m) => e.session.removeUnavailable && e.session.removeUnavailable(...m), ["stop"]))
        }, "Remove unavailable images")
      ])) : ti("", !0),
      e.session.model.phase === "ready" && !e.session.model.state.stickers.length && !e.session.model.message ? (ve(), Ce("span", ia, "Drop an image or press Add")) : ti("", !0),
      e.session.model.message ? (ve(), Ce("span", sa, si(e.session.model.message), 1)) : ti("", !0)
    ], 512));
  }
}, na = {
  viewBox: "0 0 24 24",
  width: "18",
  height: "18",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, oa = ["d"], la = {
  __name: "SsIcon",
  props: { name: String },
  setup(e) {
    const t = { add: ["M12 5v14M5 12h14"], duplicate: ["M9 9h11v11H9z", "M15 9V4H4v11h5"], delete: ["M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7M14 10v7"], front: ["M4 16h16M4 20h16", "M12 12V3m-4 4 4-4 4 4"], back: ["M4 4h16M4 8h16", "M12 12v9m-4-4 4 4 4-4"] };
    return t.opacity = ["M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16", "M12 4v16M15 5v14M18 8v8"], (i, s) => (ve(), Ce("svg", na, [
      (ve(!0), Ce(Me, null, xl(t[e.name] || [], (r, n) => (ve(), Ce("path", {
        key: n,
        d: r
      }, null, 8, oa))), 128))
    ]));
  }
}, ca = ["aria-label", "aria-describedby"], It = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "SsIconButton",
  props: { icon: String, label: String },
  setup(e) {
    const t = /* @__PURE__ */ Fe(null), i = /* @__PURE__ */ Fe(null), s = /* @__PURE__ */ Fe(!1), r = /* @__PURE__ */ Fe({ left: "-9999px", top: "0px" }), n = "ss-tip-" + Qs();
    function o() {
      s.value = !1;
    }
    async function l() {
      if (s.value = !0, await $s(), !s.value || !t.value || !i.value) return;
      const d = t.value.getBoundingClientRect(), f = i.value.getBoundingClientRect(), g = Math.max(8, Math.min(window.innerWidth - f.width - 8, d.left + (d.width - f.width) / 2));
      r.value = { left: g + "px", top: (d.top > f.height + 12 ? d.top - f.height - 8 : d.bottom + 8) + "px" };
    }
    function c(d) {
      d.target.matches(":focus-visible") && l();
    }
    return window.addEventListener("scroll", o, !0), Vi(() => window.removeEventListener("scroll", o, !0)), (d, f) => (ve(), Ce("span", {
      ref_key: "control",
      ref: t,
      class: "ss-icon-control",
      onPointerenter: l,
      onPointerleave: o
    }, [
      ye("button", Jn({
        type: "button",
        class: "ss-icon-button"
      }, d.$attrs, {
        "aria-label": e.label,
        "aria-describedby": s.value ? n : void 0,
        onFocus: c,
        onBlur: o,
        onPointerdown: o,
        onKeydown: eo(o, ["esc"])
      }), [
        ne(la, { name: e.icon }, null, 8, ["name"])
      ], 16, ca),
      (ve(), qs(al, { to: "body" }, [
        s.value ? (ve(), Ce("span", {
          key: 0,
          id: n,
          ref_key: "tip",
          ref: i,
          role: "tooltip",
          class: "ss-tooltip",
          style: ji(r.value)
        }, si(e.label), 5)) : ti("", !0)
      ]))
    ], 544));
  }
}), aa = ["onKeydown"], fa = { class: "ss-opacity-label" }, ua = ["value", "aria-valuetext"], da = {
  __name: "SsOpacity",
  props: { session: { type: Object, required: !0 }, sticker: Object },
  setup(e) {
    const t = e, i = /* @__PURE__ */ Fe(null), s = /* @__PURE__ */ Fe(null), r = /* @__PURE__ */ Fe(!1), n = ii(() => !t.sticker || t.sticker.locked || t.session.model.phase !== "ready" || t.session.model.dragging);
    let o = null;
    function l(u) {
      n.value || (o ?? (o = { id: t.sticker.id, opacity: t.sticker.opacity }), t.session.setSticker(o.id, { opacity: Number(u.target.value) / 100 }));
    }
    function c() {
      const u = o;
      if (o = null, !u) return;
      const m = t.session.model.state.stickers.find((y) => y.id === u.id);
      m && m.opacity !== u.opacity && t.session.save();
    }
    function d() {
      c(), r.value = !1;
    }
    function f() {
      const u = o;
      o = null, u && t.session.model.state.stickers.some((m) => m.id === u.id) && t.session.setSticker(u.id, { opacity: u.opacity }), r.value = !1;
    }
    async function g() {
      var u;
      if (r.value) {
        d();
        return;
      }
      r.value = !0, await $s(), (u = s.value) == null || u.focus({ preventScroll: !0 });
    }
    function h(u) {
      var m;
      r.value && !((m = i.value) != null && m.contains(u.target)) && d();
    }
    return document.addEventListener("pointerdown", h, !0), Vi(() => document.removeEventListener("pointerdown", h, !0)), (u, m) => (ve(), Ce("div", {
      ref_key: "root",
      ref: i,
      class: "ss-opacity-control"
    }, [
      ne(It, {
        icon: "opacity",
        label: "Opacity",
        disabled: n.value,
        "aria-expanded": r.value,
        onClick: g
      }, null, 8, ["disabled", "aria-expanded"]),
      r.value && !n.value ? (ve(), Ce("div", {
        key: 0,
        class: "ss-opacity-popover",
        role: "group",
        "aria-label": "Sticker opacity",
        onKeydown: eo(Dt(f, ["stop", "prevent"]), ["esc"])
      }, [
        ye("label", fa, [
          m[0] || (m[0] = qn("Opacity ", -1)),
          ye("input", {
            ref_key: "slider",
            ref: s,
            class: "ss-opacity-slider",
            type: "range",
            min: "0",
            max: "100",
            step: "1",
            value: Math.round(e.sticker.opacity * 100),
            "aria-valuetext": Math.round(e.sticker.opacity * 100) + "%",
            "aria-label": "Opacity",
            onInput: l,
            onChange: c,
            onBlur: c,
            onPointercancel: f
          }, null, 40, ua)
        ])
      ], 40, aa)) : ti("", !0)
    ], 512));
  }
}, ha = ["data-sticker-count"], pa = { class: "ss-action-dock" }, ga = { class: "ss-add-island" }, ma = {
  class: "ss-selection-bar",
  role: "toolbar",
  "aria-label": "Selected sticker"
}, ya = {
  __name: "SsSurface",
  props: { session: { type: Object, required: !0 }, canvasWheel: Function },
  setup(e) {
    const t = e, i = /* @__PURE__ */ Fe(null), s = /* @__PURE__ */ Fe(null), r = ii(() => t.session.model.state.stickers.find((u) => u.id === t.session.model.selected)), n = ii(() => t.session.model.state.stickers.findIndex((u) => u.id === t.session.model.selected)), o = ii(() => !!r.value && t.session.model.phase === "ready" && !t.session.model.dragging);
    function l(u) {
      t.canvasWheel && (u.preventDefault(), u.stopPropagation(), t.canvasWheel(u));
    }
    async function c(u) {
      var w;
      const m = (w = u.target.files) == null ? void 0 : w[0];
      if (u.target.value = "", !m) return;
      let y = [0.5, 0.5];
      if (!t.session.validAnchor(y) && t.session.entry) {
        const { grid: T } = t.session.entry;
        let E = -1, I = 1 / 0;
        for (let M = 0; M < T.valid.length; M++) if (T.valid[M]) {
          const N = (M % T.width - T.width / 2) ** 2 + (Math.floor(M / T.width) - T.height / 2) ** 2;
          N < I && (I = N, E = M);
        }
        E >= 0 && (y = [(E % T.width + 0.5) / T.width, (Math.floor(E / T.width) + 0.5) / T.height]);
      }
      try {
        await t.session.addFile(m, y);
      } catch (T) {
        t.session.error(T);
      }
    }
    function d() {
      o.value && (t.session.setState(JSON.stringify({ ...t.session.model.state, stickers: t.session.model.state.stickers.filter((u) => u.id !== r.value.id) })), t.session.model.selected = null, t.session.save());
    }
    function f() {
      if (!o.value || !t.session.entry) return;
      const u = s.value.$el.getBoundingClientRect(), m = Ii(u, t.session.entry.meta);
      let y = null;
      const w = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
      for (let E = 20; !y && E >= 20 / 1024; E /= 2)
        for (const [I, M] of w) {
          const N = [r.value.anchor[0] + I * E / m.width, r.value.anchor[1] + M * E / m.height];
          if (t.session.validAnchor(N)) {
            y = N;
            break;
          }
        }
      if (!y) {
        t.session.error(new Error("No nearby surface for a copy. Move the sticker onto a larger surface first."));
        return;
      }
      const T = { ...r.value, anchor: y, id: er(), name: r.value.name + " copy" };
      t.session.setState(JSON.stringify({ ...t.session.model.state, stickers: [...t.session.model.state.stickers, T] })), t.session.model.selected = T.id, t.session.save();
    }
    async function g(u) {
      if (!o.value) return;
      const m = t.session.model.state.stickers.filter((y) => y.id !== r.value.id);
      u ? m.push(r.value) : m.unshift(r.value), t.session.replaceState({ ...t.session.model.state, stickers: m }), await t.session.update(), t.session.save();
    }
    function h(u) {
      if (u.target.matches("input,select,textarea")) {
        if (u.target.type === "range" && (u.ctrlKey || u.metaKey) && u.key.toLowerCase() === "z") {
          u.preventDefault(), u.stopPropagation(), u.currentTarget.focus({ preventScroll: !0 }), u.currentTarget.dispatchEvent(new KeyboardEvent("keydown", { key: u.key, code: u.code, ctrlKey: u.ctrlKey, metaKey: u.metaKey, shiftKey: u.shiftKey, altKey: u.altKey, bubbles: !0, cancelable: !0 }));
          return;
        }
        u.stopPropagation();
        return;
      }
      u.key === "Escape" && !t.session.model.dragging && t.session.model.selected && (u.preventDefault(), u.stopPropagation(), t.session.model.selected = null, t.session.notify()), (u.key === "Delete" || u.key === "Backspace") && (u.preventDefault(), u.stopPropagation(), d()), (u.ctrlKey || u.metaKey) && u.key.toLowerCase() === "d" && (u.preventDefault(), u.stopPropagation(), f());
    }
    return (u, m) => {
      var y;
      return ve(), Ce("section", {
        class: "ss-surface",
        tabindex: "0",
        onKeydown: h,
        onPointerdown: m[4] || (m[4] = Dt(() => {
        }, ["stop"])),
        onWheel: l
      }, [
        ye("span", {
          class: "ss-status",
          "data-testid": "surface-status",
          role: "status",
          "data-sticker-count": e.session.model.phase === "ready" ? e.session.model.state.stickers.length : null
        }, si(e.session.model.message), 9, ha),
        ne(ra, {
          ref_key: "stage",
          ref: s,
          session: e.session
        }, null, 8, ["session"]),
        ye("div", pa, [
          ye("div", ga, [
            ne(It, {
              icon: "add",
              label: "Add image",
              disabled: e.session.model.phase !== "ready" || e.session.model.dragging,
              onClick: m[0] || (m[0] = Dt((w) => i.value.click(), ["stop"]))
            }, null, 8, ["disabled"])
          ]),
          ye("div", ma, [
            ne(It, {
              icon: "duplicate",
              label: "Duplicate",
              disabled: !o.value,
              onClick: f
            }, null, 8, ["disabled"]),
            (ve(), qs(da, {
              key: ((y = r.value) == null ? void 0 : y.id) ?? "none",
              session: e.session,
              sticker: r.value
            }, null, 8, ["session", "sticker"])),
            m[5] || (m[5] = ye("span", { class: "ss-separator" }, null, -1)),
            ne(It, {
              icon: "back",
              label: "Send to back",
              disabled: !o.value || n.value <= 0,
              onClick: m[1] || (m[1] = (w) => g(!1))
            }, null, 8, ["disabled"]),
            ne(It, {
              icon: "front",
              label: "Bring to front",
              disabled: !o.value || n.value === e.session.model.state.stickers.length - 1,
              onClick: m[2] || (m[2] = (w) => g(!0))
            }, null, 8, ["disabled"]),
            m[6] || (m[6] = ye("span", { class: "ss-separator" }, null, -1)),
            ne(It, {
              icon: "delete",
              label: "Delete",
              disabled: !o.value,
              onClick: d
            }, null, 8, ["disabled"])
          ])
        ]),
        ye("input", {
          ref_key: "file",
          ref: i,
          class: "ss-file",
          type: "file",
          accept: "image/*",
          onClick: m[3] || (m[3] = Dt(() => {
          }, ["stop"])),
          onChange: Dt(c, ["stop"])
        }, null, 544)
      ], 32);
    };
  }
};
let Te = null, ba = 0;
const pt = /* @__PURE__ */ new Map();
function wa() {
  Te || (Te = new Worker(new URL(
    /* @vite-ignore */
    "" + new URL(".lazy/surface_worker-DvoZhMN3.js", import.meta.url).href,
    import.meta.url
  ), { type: "module" }), Te.onmessage = ({ data: e }) => {
    const t = pt.get(e.id);
    t && (pt.delete(e.id), e.error ? t.reject(new Error(e.error)) : t.resolve(e.result));
  }, Te.onerror = () => {
    for (const e of pt.values()) e.reject(new Error("Surface calculations stopped. Reload the page and run the workflow again."));
    pt.clear(), Te == null || Te.terminate(), Te = null;
  });
}
function Tt(e, t = []) {
  return wa(), new Promise((i, s) => {
    const r = ++ba;
    pt.set(r, { resolve: i, reject: s });
    try {
      Te.postMessage({ ...e, id: r }, t);
    } catch (n) {
      pt.delete(r), s(n);
    }
  });
}
function va() {
  Te == null || Te.terminate(), Te = null;
  for (const e of pt.values()) e.reject(new DOMException("Surface released", "AbortError"));
  pt.clear();
}
const Ht = /* @__PURE__ */ new Map(), _a = (e) => {
  var t;
  return (t = (e == null ? void 0 : e.slap_stickers) ?? (e == null ? void 0 : e.surface_stickers)) == null ? void 0 : t[0];
};
function oo(e) {
  const t = new URL("view", document.baseURI);
  return t.search = new URLSearchParams(e).toString(), t.href;
}
async function Rs(e) {
  try {
    return await createImageBitmap(e, { premultiplyAlpha: "none", colorSpaceConversion: "none" });
  } catch {
    throw new Error("This image could not be read. Choose a PNG, JPEG or WebP image.");
  }
}
function xa(e, t = oo) {
  const i = e.meta.key;
  let s = Ht.get(i);
  s || (s = { refs: 0, key: i, promise: null }, s.promise = (async () => {
    const n = await Promise.all([fetch(t(e.grid)), fetch(t(e.preview))]);
    if (n.some((f) => !f.ok)) throw new Error("Surface data is gone — run the workflow again");
    const [o, l] = await Promise.all([n[0].arrayBuffer(), n[1].blob()]), c = $c(o, e.meta), d = await Rs(l);
    try {
      const f = new OffscreenCanvas(d.width, d.height), g = f.getContext("2d");
      g.drawImage(d, 0, 0);
      const h = g.getImageData(0, 0, d.width, d.height).data, u = await Tt({ type: "register", key: i, buffer: o, meta: e.meta, pixels: h, width: d.width, height: d.height }, [o, h.buffer]);
      return { key: i, grid: c, image: d, ...u, meta: e.meta };
    } catch (f) {
      throw d.close(), f;
    }
  })(), Ht.set(i, s)), s.refs++;
  let r = !1;
  return { ready: s.promise, release() {
    r || (r = !0, !(--s.refs > 0) && (Ht.delete(i), s.promise.then((n) => {
      De(n.image), qc(n), n.image.close(), Ht.has(i) || Tt({ type: "release", key: i }).catch(() => {
      });
    }, () => {
    }).finally(() => {
      Ht.size || va();
    })));
  } };
}
let Kr = 0;
function Sa({ state: e = "", commit: t = () => {
}, upload: i, urlFor: s = oo } = {}) {
  let r, n = null;
  try {
    r = ds(e);
  } catch (A) {
    r = { version: 1, stickers: [] }, n = A;
  }
  const o = Qs() + ":";
  let l = null, c = !1, d = null, f = null, g = 0, h = 0, u = !1, m = null;
  const y = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Set();
  let N = /* @__PURE__ */ new Map();
  const Z = (A) => JSON.stringify([A, N.get(JSON.stringify(A))]), O = /* @__PURE__ */ hn({ state: r, phase: n ? "error" : "empty", message: (n == null ? void 0 : n.message) ?? "Run the workflow once to load the surface", missing: [], selected: null, invalid: !1, dragging: !1 });
  Kr++;
  const B = () => {
    for (const A of I) A();
  };
  function W(A) {
    !c && A.name !== "AbortError" && O.message !== A.message && (O.message = A.message, B());
  }
  function re(A) {
    O.state = A, B();
  }
  function _e() {
    c || t(Di(O.state));
  }
  function Oe(A) {
    var j;
    A && (De(A.region), A.field && De(A.field), (j = A.bitmap) == null || j.close());
  }
  async function tt(A, j) {
    const G = await createImageBitmap(j, { premultiplyAlpha: "none", colorSpaceConversion: "none" });
    if (c || T.get(A) !== j) {
      G.close();
      return;
    }
    await Tt({ type: "source", key: o + A, bitmap: G }, [G]);
  }
  async function ke() {
    if (!f || c) return;
    const A = g, j = ++h, G = [];
    if (await Promise.all(O.state.stickers.map(async ($) => {
      const ee = Z($.source);
      if (E.get($.id) === ee) return;
      let a;
      try {
        const b = [...E].find(([_, v]) => v === ee && T.has(_));
        if (b) a = await createImageBitmap(T.get(b[0]), { premultiplyAlpha: "none", colorSpaceConversion: "none" });
        else {
          const _ = await fetch(s($.source), { cache: "no-store" });
          if (!_.ok) throw new Error(`Cannot read ${$.name}.`);
          a = await Rs(await _.blob());
        }
      } catch {
        !c && A === g && j === h && (G.push({ id: $.id, name: $.name }), ct($.id));
        return;
      }
      const p = O.state.stickers.find((b) => b.id === $.id);
      if (c || A !== g || j !== h || !p || Z(p.source) !== ee) {
        a.close();
        return;
      }
      ct($.id), T.set($.id, a), E.set($.id, ee), await tt($.id, a);
    })), !(c || A !== g || j !== h)) {
      for (const $ of T.keys()) !M.has($) && !O.state.stickers.some((ee) => ee.id === $) && ct($);
      O.missing = G;
    }
  }
  function ct(A) {
    const j = T.get(A);
    j && (De(j), j.close(), T.delete(A), Tt({ type: "releaseSource", key: o + A }).catch(() => {
    })), E.delete(A), Oe(w.get(A)), w.delete(A), y.delete(A);
  }
  async function le() {
    var j, G, $, ee;
    if (u || !m || !f || c) return;
    u = !0;
    const A = m;
    m = null;
    try {
      const a = g, p = await Promise.all(A.state.stickers.filter((b) => b.visible).map(async (b) => {
        var k;
        const _ = T.get(b.id);
        if (!_) return null;
        const v = ((k = A.physical) == null ? void 0 : k.id) === b.id ? A.physical.width : null, S = JSON.stringify([b.anchor, b.size, b.rotation, b.edge, b.mode, _.width, _.height, v, b.source, b.shading]), P = S + (A.coarse ? "coarse" : "full"), R = y.get(b.id), C = w.get(b.id);
        if (R === P || A.coarse && R === S + "full") {
          if (!C || JSON.stringify(C.viewport) === JSON.stringify(A.viewport)) return null;
          const F = { ...C };
          delete F.bitmap;
          const L = await Tt({ type: "raster", key: f.key, frame: F, sticker: b, viewport: A.viewport, sourceKey: o + b.id });
          return { id: b.id, frame: { ...C, ...L, viewport: A.viewport }, key: R };
        }
        const D = await Tt({ type: "flat", key: f.key, sticker: b, aspect: _.width / _.height, physicalWidth: v, coarse: A.coarse, viewport: A.viewport, sourceKey: o + b.id });
        return D && (D.viewport = A.viewport), { id: b.id, frame: D, key: P };
      }));
      if (c || a !== g)
        for (const b of p) (G = (j = b == null ? void 0 : b.frame) == null ? void 0 : j.bitmap) == null || G.close();
      if (!c && a === g) {
        for (const b of p) if (b) {
          if (!O.state.stickers.some((v) => v.id === b.id)) {
            (ee = ($ = b.frame) == null ? void 0 : $.bitmap) == null || ee.close();
            continue;
          }
          const _ = w.get(b.id);
          Oe(_), b.frame ? w.set(b.id, b.frame) : w.delete(b.id), y.set(b.id, b.key);
        }
        B();
      }
      A.resolve();
    } catch (a) {
      A.reject(a), W(a);
    } finally {
      u = !1, m && le();
    }
  }
  function z(A = null) {
    return !f || c ? Promise.resolve() : (m && m.resolve(), new Promise((j, G) => {
      m = { state: O.state, physical: A, coarse: O.dragging, viewport: l, resolve: j, reject: G }, le();
    }));
  }
  function X(A, j) {
    (l == null ? void 0 : l[0]) === A && (l == null ? void 0 : l[1]) === j || (l = [A, j], z().catch(W));
  }
  async function it(A) {
    if (c) return;
    if (n) {
      O.phase = "error", O.message = n.message, B();
      return;
    }
    if (N = new Map((A.source_revisions ?? []).map(($) => [JSON.stringify($.source), $.digest])), (f == null ? void 0 : f.key) === A.meta.key && O.phase === "ready") {
      g++, await ke(), await z(), B();
      return;
    }
    const j = ++g;
    y.clear(), f = null, d == null || d.release(), d = null, O.phase = "loading", O.message = "Loading surface…", B();
    const G = xa(A, s);
    d = G;
    try {
      const $ = await G.ready;
      if (c || j !== g || (f = $, await ke(), c || j !== g)) return;
      O.phase = "ready", O.message = f.grid.valid.some(Boolean) ? "" : "No usable surface in this image", await z(), B();
    } catch ($) {
      !c && j === g && (O.phase = "error", W($));
    }
  }
  async function Pt(A, j = [0.5, 0.5]) {
    if (!f || O.phase !== "ready") {
      O.message = "Run the workflow once to load the surface", B();
      return;
    }
    if (!/^image\//.test(A.type) && !/\.(png|jpe?g|webp|gif|bmp)$/i.test(A.name)) throw new Error("Choose an image file to add a sticker.");
    if (!Ke(j)) throw new Error("Drop the image on a usable surface.");
    const G = d, $ = await Rs(A);
    let ee;
    function a() {
      return !c && d === G ? !1 : (ee ? ct(ee.id) : $.close(), c || (O.message = "The surface changed during upload. Add the image again.", B()), !0);
    }
    try {
      if (a()) return;
      O.message = "Uploading image…", B();
      const p = await i(A);
      if (a() || (ee = ds(JSON.stringify({ stickers: [Qc({ filename: p.name, subfolder: p.subfolder ?? "", type: p.type }, A.name, j)] })).stickers[0], M.add(ee.id), T.set(ee.id, $), E.set(ee.id, Z(ee.source)), await tt(ee.id, $), a())) return;
      M.delete(ee.id), O.selected = ee.id, O.message = "", re({ ...O.state, stickers: [...O.state.stickers, ee] }), _e(), await z();
    } catch (p) {
      throw ee && ct(ee.id), $.close(), O.message = "", W(p), p;
    } finally {
      ee && M.delete(ee.id);
    }
  }
  function Ke([A, j]) {
    if (!f || A < 0 || A > 1 || j < 0 || j > 1) return !1;
    const { grid: G } = f;
    return !!G.valid[Math.min(G.height - 1, Math.floor(j * G.height)) * G.width + Math.min(G.width - 1, Math.floor(A * G.width))];
  }
  function xe(A, j) {
    re({ ...O.state, stickers: O.state.stickers.map((G) => G.id === A ? { ...G, ...j } : G) });
  }
  function Ut(A) {
    if (!c)
      try {
        re(ds(A)), n = null, O.phase !== "loading" && (O.phase = f ? "ready" : "empty", O.message = f ? "" : "Run the workflow once to load the surface"), ke().then(() => z()).catch(W);
      } catch (j) {
        n = j, O.phase = "error", W(j);
      }
  }
  function pi() {
    const A = new Set(O.missing.map((j) => j.id));
    Ut(JSON.stringify({ ...O.state, stickers: O.state.stickers.filter((j) => !A.has(j.id)) })), _e();
  }
  function qi() {
    if (!c) {
      c = !0, g++, m == null || m.resolve(), m = null, d == null || d.release(), d = null, f = null, T.size && Tt({ type: "releaseSources", key: o }).catch(() => {
      });
      for (const A of w.values()) Oe(A);
      w.clear(), y.clear();
      for (const A of T.values())
        De(A), A.close();
      T.clear(), I.clear(), --Kr === 0 && Jc();
    }
  }
  return {
    model: O,
    frames: w,
    sources: T,
    get entry() {
      return f;
    },
    load: it,
    addFile: Pt,
    validAnchor: Ke,
    setSticker: xe,
    setState: Ut,
    replaceState: re,
    update: z,
    save: _e,
    error: W,
    dispose: qi,
    removeUnavailable: pi,
    setViewport: X,
    subscribe(A) {
      return I.add(A), () => I.delete(A);
    },
    notify: B
  };
}
const bt = /* @__PURE__ */ new WeakMap(), Lt = /* @__PURE__ */ new Set();
let Ta = 0;
const Wt = { minWidth: 260, minHeight: 320 }, tr = document.createElement("link");
tr.rel = "stylesheet";
tr.href = new URL("./slap_stickers.css", import.meta.url).href;
document.head.appendChild(tr);
const lo = (e) => {
  var t;
  return (t = e.widgets) == null ? void 0 : t.find((i) => i.name === "state_json");
};
async function Ea(e) {
  const t = new FormData();
  t.append("image", e), t.append("type", "input"), t.append("subfolder", "slap_stickers");
  const i = await Br.fetchApi("/upload/image", { method: "POST", body: t });
  if (!i.ok) throw new Error("The image could not be uploaded. Try adding it again.");
  return i.json();
}
function qt(e, t) {
  const i = bt.get(e), s = _a(t);
  if (!i || !s) return;
  const r = JSON.stringify([s.meta.key, s.source_revisions]);
  if (i.key === r && (i.loading || i.session.model.phase === "ready" && !i.session.model.missing.length)) return;
  i.key = r;
  const n = i.session.load(JSON.parse(JSON.stringify(s)));
  i.loading = n, n.catch(i.session.error).finally(() => {
    i.loading === n && (i.loading = null);
  });
}
function Ma(e, t) {
  return Sa({ state: t.value ?? "", upload: Ea, urlFor: (i) => Br.apiURL(`/view?${new URLSearchParams(i)}`), commit: (i) => {
    var s, r, n, o, l, c, d, f, g, h;
    if (t.value !== i) {
      (r = (s = e.graph) == null ? void 0 : s.beforeChange) == null || r.call(s), (o = (n = Mt.canvas) == null ? void 0 : n.emitBeforeChange) == null || o.call(n);
      try {
        t.value = i, (l = t.callback) == null || l.call(t, i);
      } finally {
        (d = (c = e.graph) == null ? void 0 : c.afterChange) == null || d.call(c), (g = (f = Mt.canvas) == null ? void 0 : f.emitAfterChange) == null || g.call(f);
      }
      (h = e.setDirtyCanvas) == null || h.call(e, !0, !0);
    }
  } });
}
function Aa(e, t, i, s = null) {
  const r = (l) => {
    var c;
    return (c = Mt.canvas) == null ? void 0 : c.canvas.dispatchEvent(new WheelEvent("wheel", { clientX: l.clientX, clientY: l.clientY, deltaX: l.deltaX, deltaY: l.deltaY, deltaMode: l.deltaMode, ctrlKey: l.ctrlKey, metaKey: l.metaKey, shiftKey: l.shiftKey, altKey: l.altKey, cancelable: !0 }));
  }, n = Nc({ render: () => oc(ya, { session: t, canvasWheel: r }) }), o = { session: t, vue: n, dom: s, key: null };
  bt.set(e, o), Lt.add(e);
  try {
    n.mount(i);
  } catch (l) {
    throw bt.delete(e), Lt.delete(e), n.unmount(), l;
  }
  return o;
}
function co(e) {
  var o, l, c;
  if (bt.has(e)) return;
  const t = lo(e);
  if (!t) return;
  t.hidden = !0;
  let i = (o = e.widgets) == null ? void 0 : o.find((d) => d.name === "Retry surface");
  i || (i = e.addWidget("button", "Retry surface", null, () => co(e)), i.serialize = !1);
  let s, r, n;
  try {
    s = Ma(e, t);
    const d = document.createElement("div");
    d.className = "ss-widget-root", d.style.cssText = `width:100%;height:100%;min-width:0;min-height:${Wt.minHeight}px;position:relative;overflow:hidden`, n = e.addDOMWidget("slap_stickers_surface", `slap-stickers:${++Ta}`, d, { serialize: !1, hideOnZoom: !1, hideInPanel: !0, getMinHeight: () => Wt.minHeight, getHeight: () => Wt.minHeight }), n.serialize = !1;
    const f = (l = n.computeLayoutSize) == null ? void 0 : l.bind(n);
    n.computeLayoutSize = (y) => {
      const w = (f == null ? void 0 : f(y)) ?? {};
      return { ...w, minWidth: Math.max(Wt.minWidth, w.minWidth ?? 0), minHeight: Math.max(Wt.minHeight, w.minHeight ?? 0) };
    }, r = Aa(e, s, d, n).vue, i.hidden = !0;
    const g = n.onRemove;
    let h = !1;
    n.onRemove = function(...y) {
      h || (h = !0, g == null || g.apply(this, y), ao(e));
    };
    const u = t.callback;
    t.callback = function(...y) {
      const w = u == null ? void 0 : u.apply(this, y), T = String(t.value ?? "");
      return y[0] !== void 0 && T !== Di(s.model.state) && s.setState(T), w;
    };
    const m = (c = Mt.nodeOutputs) == null ? void 0 : c[String(e.id)];
    m && qt(e, m);
  } catch (d) {
    bt.delete(e), Lt.delete(e), r == null || r.unmount(), s == null || s.dispose(), n && e.removeWidget(n), i.hidden = !1, console.error("[Slap Stickers] Could not attach the surface", d);
  }
}
function ao(e) {
  const t = bt.get(e);
  t && (bt.delete(e), Lt.delete(e), t.vue.unmount(), t.session.dispose());
}
Mt.registerExtension({
  name: "alp-dot.SlapStickers",
  beforeRegisterNodeDef(e, t) {
    var o, l;
    if (t.name !== "SurfaceStickers") return;
    const i = e.prototype.onExecuted, s = e.prototype.onRemoved, r = e.prototype.onConfigure;
    e.prototype.onExecuted = function(c) {
      const d = i == null ? void 0 : i.apply(this, arguments);
      return qt(this, c), d;
    }, e.prototype.onRemoved = function() {
      return ao(this), s == null ? void 0 : s.apply(this, arguments);
    };
    const n = { ...(o = t.input) == null ? void 0 : o.required, ...(l = t.input) == null ? void 0 : l.optional };
    e.prototype.onConfigure = function() {
      var f, g, h, u;
      const c = r == null ? void 0 : r.apply(this, arguments);
      for (const m of this.inputs ?? []) {
        const y = (g = (f = n[m.name]) == null ? void 0 : f[1]) == null ? void 0 : g.display_name;
        y && (m.label = y);
      }
      const d = bt.get(this);
      return d && (d.session.setState(String(((h = lo(this)) == null ? void 0 : h.value) ?? "")), qt(this, (u = Mt.nodeOutputs) == null ? void 0 : u[String(this.id)])), c;
    };
  },
  nodeCreated(e) {
    e.comfyClass !== "SurfaceStickers" && e.constructor.comfyClass !== "SurfaceStickers" || (co(e), e.setSize([Math.max(e.size[0], 640), Math.max(e.size[1], 600)]));
  },
  afterConfigureGraph() {
    var e;
    for (const t of Lt) qt(t, (e = Mt.nodeOutputs) == null ? void 0 : e[String(t.id)]);
  },
  onNodeOutputsUpdated(e) {
    for (const t of Lt) {
      const i = e == null ? void 0 : e[String(t.id)];
      i && qt(t, i);
    }
  }
});
