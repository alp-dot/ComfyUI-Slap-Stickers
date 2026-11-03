import { app as Lt } from "../../scripts/app.js";
import { api as os } from "../../scripts/api.js";
/**
* @vue/shared v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function qn(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const i of e.split(",")) t[i] = 1;
  return (i) => i in t;
}
const ae = {}, It = [], rt = () => {
}, ls = () => !1, Gi = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), qi = (e) => e.startsWith("onUpdate:"), Se = Object.assign, Xn = (e, t) => {
  const i = e.indexOf(t);
  i > -1 && e.splice(i, 1);
}, Oo = Object.prototype.hasOwnProperty, ee = (e, t) => Oo.call(e, t), z = Array.isArray, xt = (e) => bi(e) === "[object Map]", Fi = (e) => bi(e) === "[object Set]", _r = (e) => bi(e) === "[object Date]", G = (e) => typeof e == "function", ue = (e) => typeof e == "string", st = (e) => typeof e == "symbol", re = (e) => e !== null && typeof e == "object", as = (e) => (re(e) || G(e)) && G(e.then) && G(e.catch), cs = Object.prototype.toString, bi = (e) => cs.call(e), Io = (e) => bi(e).slice(8, -1), fs = (e) => bi(e) === "[object Object]", Jn = (e) => ue(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ri = /* @__PURE__ */ qn(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), Xi = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((i) => t[i] || (t[i] = e(i)));
}, Do = /-\w/g, Ve = Xi(
  (e) => e.replace(Do, (t) => t.slice(1).toUpperCase())
), Lo = /\B([A-Z])/g, Mt = Xi(
  (e) => e.replace(Lo, "-$1").toLowerCase()
), us = Xi((e) => e.charAt(0).toUpperCase() + e.slice(1)), fn = Xi(
  (e) => e ? `on${us(e)}` : ""
), it = (e, t) => !Object.is(e, t), un = (e, ...t) => {
  for (let i = 0; i < e.length; i++)
    e[i](...t);
}, ds = (e, t, i, n = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: n,
    value: i
  });
}, Fo = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
};
let xr;
const Ji = () => xr || (xr = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function Yi(e) {
  if (z(e)) {
    const t = {};
    for (let i = 0; i < e.length; i++) {
      const n = e[i], r = ue(n) ? jo(n) : Yi(n);
      if (r)
        for (const s in r)
          t[s] = r[s];
    }
    return t;
  } else if (ue(e) || re(e))
    return e;
}
const Uo = /;(?![^(]*\))/g, No = /:([^]+)/, Bo = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function jo(e) {
  const t = {};
  return e.replace(Bo, (i) => i.startsWith("/*") ? "" : i).split(Uo).forEach((i) => {
    if (i) {
      const n = i.split(No);
      n.length > 1 && (t[n[0].trim()] = n[1].trim());
    }
  }), t;
}
function _i(e) {
  let t = "";
  if (ue(e))
    t = e;
  else if (z(e))
    for (let i = 0; i < e.length; i++) {
      const n = _i(e[i]);
      n && (t += n + " ");
    }
  else if (re(e))
    for (const i in e)
      e[i] && (t += i + " ");
  return t.trim();
}
const Ko = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly", $o = /* @__PURE__ */ qn(Ko);
function hs(e) {
  return !!e || e === "";
}
function Ho(e, t, i) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let r = 0; n && r < e.length; r++)
    n = Zi(e[r], t[r], i);
  return n;
}
function Sr(e, t, i) {
  if (e.size !== t.size) return !1;
  const n = Array.from(t), r = new Uint8Array(n.length);
  for (const s of e) {
    let o = -1;
    for (let l = 0; l < n.length; l++)
      if (!r[l] && Zi(s, n[l], i)) {
        o = l;
        break;
      }
    if (o < 0) return !1;
    r[o] = 1;
  }
  return !0;
}
function Wo(e, t, i) {
  let n = xt(e), r = xt(t);
  if (n || r || (n = Fi(e), r = Fi(t), n || r))
    return n && r ? Sr(e, t, i) : !1;
  const s = Object.keys(e).length, o = Object.keys(t).length;
  if (s !== o)
    return !1;
  for (const l in e) {
    const a = e.hasOwnProperty(l), f = t.hasOwnProperty(l);
    if (a && !f || !a && f || !Zi(e[l], t[l], i))
      return !1;
  }
  return String(e) === String(t);
}
function Er(e, t, i, n) {
  i || (i = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [r, s] = i;
  if (r.has(e) || s.has(t))
    return r.get(e) === t && s.get(t) === e;
  r.set(e, t), s.set(t, e);
  const o = n(e, t, i);
  return r.delete(e), s.delete(t), o;
}
function Zi(e, t, i) {
  if (e === t) return !0;
  let n = _r(e), r = _r(t);
  return n || r ? n && r ? e.getTime() === t.getTime() : !1 : (n = st(e), r = st(t), n || r ? e === t : (n = z(e), r = z(t), n || r ? n && r ? Er(e, t, i, Ho) : !1 : (n = re(e), r = re(t), n || r ? !n || !r ? !1 : Er(e, t, i, Wo) : String(e) === String(t))));
}
const ps = (e) => !!(e && e.__v_isRef === !0), ui = (e) => ue(e) ? e : e == null ? "" : z(e) || re(e) && (e.toString === cs || !G(e.toString)) ? ps(e) ? ui(e.value) : JSON.stringify(e, gs, 2) : String(e), gs = (e, t) => ps(t) ? gs(e, t.value) : xt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (i, [n, r], s) => (i[dn(n, s) + " =>"] = r, i),
    {}
  )
} : Fi(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((i) => dn(i))
} : st(t) ? dn(t) : re(t) && !z(t) && !fs(t) ? String(t) : t, dn = (e, t = "") => {
  var i;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    st(e) ? `Symbol(${(i = e.description) != null ? i : t})` : e
  );
};
/**
* @vue/reactivity v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let we;
class zo {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && we && (we.active ? (this.parent = we, this.index = (we.scopes || (we.scopes = [])).push(
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
        const n = this.scopes.slice();
        for (t = 0, i = n.length; t < i; t++)
          n[t].pause();
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
      const n = this.effects.slice();
      for (t = 0, i = n.length; t < i; t++)
        n[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const i = we;
      try {
        return we = this, t();
      } finally {
        we = i;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = we, we = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (we === this)
        we = this.prevScope;
      else {
        let t = we;
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
      let i, n;
      for (i = 0, n = this.effects.length; i < n; i++)
        this.effects[i].stop();
      for (this.effects.length = 0, i = 0, n = this.cleanups.length; i < n; i++)
        this.cleanups[i]();
      if (this.cleanups.length = 0, this.scopes) {
        const r = this.scopes.slice();
        for (i = 0, n = r.length; i < n; i++)
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
function Vo() {
  return we;
}
let le;
const hn = /* @__PURE__ */ new WeakSet();
class ms {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, we && (we.active ? we.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, hn.has(this) && (hn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || vs(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Tr(this), ws(this);
    const t = le, i = Ge;
    le = this, Ge = !0;
    try {
      return this.fn();
    } finally {
      bs(this), le = t, Ge = i, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Qn(t);
      this.deps = this.depsTail = void 0, Tr(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? hn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Rn(this) && this.run();
  }
  get dirty() {
    return Rn(this);
  }
}
let ys = 0, si, oi;
function vs(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = oi, oi = e;
    return;
  }
  e.next = si, si = e;
}
function Yn() {
  ys++;
}
function Zn() {
  if (--ys > 0)
    return;
  if (oi) {
    let t = oi;
    for (oi = void 0; t; ) {
      const i = t.next;
      t.next = void 0, t.flags &= -9, t = i;
    }
  }
  let e;
  for (; si; ) {
    let t = si;
    for (si = void 0; t; ) {
      const i = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (n) {
          e || (e = n);
        }
      t = i;
    }
  }
  if (e) throw e;
}
function ws(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function bs(e) {
  let t, i = e.depsTail, n = i;
  for (; n; ) {
    const r = n.prevDep;
    n.version === -1 ? (n === i && (i = r), Qn(n), Go(n)) : t = n, n.dep.activeLink = n.prevActiveLink, n.prevActiveLink = void 0, n = r;
  }
  e.deps = t, e.depsTail = i;
}
function Rn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (_s(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function _s(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === di) || (e.globalVersion = di, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Rn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, i = le, n = Ge;
  le = e, Ge = !0;
  try {
    ws(e);
    const r = e.fn(e._value);
    (t.version === 0 || it(r, e._value)) && (e.flags |= 128, e._value = r, t.version++);
  } catch (r) {
    throw t.version++, r;
  } finally {
    le = i, Ge = n, bs(e), e.flags &= -3;
  }
}
function Qn(e, t = !1) {
  const { dep: i, prevSub: n, nextSub: r } = e;
  if (n && (n.nextSub = r, e.prevSub = void 0), r && (r.prevSub = n, e.nextSub = void 0), i.subs === e && (i.subs = n, !n && i.computed)) {
    i.computed.flags &= -5;
    for (let s = i.computed.deps; s; s = s.nextDep)
      Qn(s, !0);
  }
  !t && !--i.sc && i.map && i.map.delete(i.key);
}
function Go(e) {
  const { prevDep: t, nextDep: i } = e;
  t && (t.nextDep = i, e.prevDep = void 0), i && (i.prevDep = t, e.nextDep = void 0);
}
let Ge = !0;
const xs = [];
function ot() {
  xs.push(Ge), Ge = !1;
}
function lt() {
  const e = xs.pop();
  Ge = e === void 0 ? !0 : e;
}
function Tr(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const i = le;
    le = void 0;
    try {
      t();
    } finally {
      le = i;
    }
  }
}
let di = 0;
class qo {
  constructor(t, i) {
    this.sub = t, this.dep = i, this.version = i.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class er {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!le || !Ge || le === this.computed)
      return;
    let i = this.activeLink;
    if (i === void 0 || i.sub !== le)
      i = this.activeLink = new qo(le, this), le.deps ? (i.prevDep = le.depsTail, le.depsTail.nextDep = i, le.depsTail = i) : le.deps = le.depsTail = i, Ss(i);
    else if (i.version === -1 && (i.version = this.version, i.nextDep)) {
      const n = i.nextDep;
      n.prevDep = i.prevDep, i.prevDep && (i.prevDep.nextDep = n), i.prevDep = le.depsTail, i.nextDep = void 0, le.depsTail.nextDep = i, le.depsTail = i, le.deps === i && (le.deps = n);
    }
    return i;
  }
  trigger(t) {
    this.version++, di++, this.notify(t);
  }
  notify(t) {
    Yn();
    try {
      for (let i = this.subs; i; i = i.prevSub)
        i.sub.notify() && i.sub.dep.notify();
    } finally {
      Zn();
    }
  }
}
function Ss(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let n = t.deps; n; n = n.nextDep)
        Ss(n);
    }
    const i = e.dep.subs;
    i !== e && (e.prevSub = i, i && (i.nextSub = e)), e.dep.subs = e;
  }
}
const Cn = /* @__PURE__ */ new WeakMap(), Ft = /* @__PURE__ */ Symbol(
  ""
), Pn = /* @__PURE__ */ Symbol(
  ""
), hi = /* @__PURE__ */ Symbol(
  ""
);
function _e(e, t, i) {
  if (Ge && le) {
    let n = Cn.get(e);
    n || Cn.set(e, n = /* @__PURE__ */ new Map());
    let r = n.get(i);
    r || (n.set(i, r = new er()), r.map = n, r.key = i), r.track();
  }
}
function pt(e, t, i, n, r, s) {
  const o = Cn.get(e);
  if (!o) {
    di++;
    return;
  }
  const l = (a) => {
    a && a.trigger();
  };
  if (Yn(), t === "clear")
    o.forEach(l);
  else {
    const a = z(e), f = a && Jn(i);
    if (a && i === "length") {
      const c = Number(n);
      o.forEach((d, v) => {
        (v === "length" || v === hi || !st(v) && v >= c) && l(d);
      });
    } else
      switch ((i !== void 0 || o.has(void 0)) && l(o.get(i)), f && l(o.get(hi)), t) {
        case "add":
          a ? f && l(o.get("length")) : (l(o.get(Ft)), xt(e) && l(o.get(Pn)));
          break;
        case "delete":
          a || (l(o.get(Ft)), xt(e) && l(o.get(Pn)));
          break;
        case "set":
          xt(e) && l(o.get(Ft));
          break;
      }
  }
  Zn();
}
function jt(e) {
  const t = /* @__PURE__ */ ne(e);
  return t === e || (_e(t, "iterate", hi), /* @__PURE__ */ Be(e)) ? t : /* @__PURE__ */ at(e) ? /* @__PURE__ */ St(e) ? t.map((i) => Et(je(i))) : t.map(Et) : t.map(je);
}
function Qi(e) {
  return _e(e = /* @__PURE__ */ ne(e), "iterate", hi), e;
}
function Qe(e, t) {
  return /* @__PURE__ */ at(e) ? Et(/* @__PURE__ */ St(e) ? je(t) : t) : je(t);
}
const Xo = {
  __proto__: null,
  [Symbol.iterator]() {
    return pn(this, Symbol.iterator, (e) => Qe(this, e));
  },
  concat(...e) {
    return jt(this).concat(
      ...e.map((t) => z(t) ? jt(t) : t)
    );
  },
  entries() {
    return pn(this, "entries", (e) => (e[1] = Qe(this, e[1]), e));
  },
  every(e, t) {
    return ut(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return ut(
      this,
      "filter",
      e,
      t,
      (i) => i.map((n) => Qe(this, n)),
      arguments
    );
  },
  find(e, t) {
    return ut(
      this,
      "find",
      e,
      t,
      (i) => Qe(this, i),
      arguments
    );
  },
  findIndex(e, t) {
    return ut(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return ut(
      this,
      "findLast",
      e,
      t,
      (i) => Qe(this, i),
      arguments
    );
  },
  findLastIndex(e, t) {
    return ut(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return ut(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return gn(this, "includes", e);
  },
  indexOf(...e) {
    return gn(this, "indexOf", e);
  },
  join(e) {
    return jt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return gn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return ut(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return qt(this, "pop");
  },
  push(...e) {
    return qt(this, "push", e);
  },
  reduce(e, ...t) {
    return Ar(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Ar(this, "reduceRight", e, t);
  },
  shift() {
    return qt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return ut(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return qt(this, "splice", e);
  },
  toReversed() {
    return jt(this).toReversed();
  },
  toSorted(e) {
    return jt(this).toSorted(e);
  },
  toSpliced(...e) {
    return jt(this).toSpliced(...e);
  },
  unshift(...e) {
    return qt(this, "unshift", e);
  },
  values() {
    return pn(this, "values", (e) => Qe(this, e));
  }
};
function pn(e, t, i) {
  const n = Qi(e), r = n[t], s = r.call(n);
  if (n !== e && !/* @__PURE__ */ Be(e)) {
    if (s[Symbol.toStringTag] === "Array Iterator") {
      const o = Object.create(Object.getPrototypeOf(s));
      return o.next = () => Mr(s.next(), i), r !== Es[t] && Object.defineProperties(o, {
        return: {
          get() {
            const l = s.return;
            return typeof l == "function" ? l.bind(s) : l;
          }
        },
        throw: {
          get() {
            const l = s.throw;
            return typeof l == "function" ? l.bind(s) : l;
          }
        }
      }), o;
    }
    s._next = s.next, s.next = () => Mr(s._next(), i);
  }
  return s;
}
function Mr(e, t) {
  return e.done || (e.value = t(e.value)), e;
}
const Es = Array.prototype;
function ut(e, t, i, n, r, s) {
  const o = Qi(e), l = o !== e && !/* @__PURE__ */ Be(e), a = o[t];
  if (a !== Es[t]) {
    const d = a.apply(e, s);
    return l ? je(d) : d;
  }
  let f = i;
  o !== e && (l ? f = function(d, v) {
    return i.call(this, Qe(e, d), v, e);
  } : i.length > 2 && (f = function(d, v) {
    return i.call(this, d, v, e);
  }));
  const c = a.call(o, f, n);
  return l && r ? r(c) : c;
}
function Ar(e, t, i, n) {
  const r = Qi(e), s = r !== e && !/* @__PURE__ */ Be(e);
  let o = i, l = !1;
  r !== e && (s ? (l = n.length === 0, o = function(f, c, d) {
    return l && (l = !1, f = Qe(e, f)), i.call(this, f, Qe(e, c), d, e);
  }) : i.length > 3 && (o = function(f, c, d) {
    return i.call(this, f, c, d, e);
  }));
  const a = r[t](o, ...n);
  return l ? Qe(e, a) : a;
}
function gn(e, t, i) {
  const n = /* @__PURE__ */ ne(e);
  _e(n, "iterate", hi);
  const r = n[t](...i);
  return (r === -1 || r === !1) && /* @__PURE__ */ rr(i[0]) ? (i[0] = /* @__PURE__ */ ne(i[0]), n[t](...i)) : r;
}
function qt(e, t, i = []) {
  ot(), Yn();
  const n = (/* @__PURE__ */ ne(e))[t].apply(e, i);
  return Zn(), lt(), n;
}
const Jo = /* @__PURE__ */ qn("__proto__,__v_isRef,__isVue"), Ts = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(st)
);
function Yo(e) {
  st(e) || (e = String(e));
  const t = /* @__PURE__ */ ne(this);
  return _e(t, "has", e), t.hasOwnProperty(e);
}
class Ms {
  constructor(t = !1, i = !1) {
    this._isReadonly = t, this._isShallow = i;
  }
  get(t, i, n) {
    if (i === "__v_skip") return t.__v_skip;
    const r = this._isReadonly, s = this._isShallow;
    if (i === "__v_isReactive")
      return !r;
    if (i === "__v_isReadonly")
      return r;
    if (i === "__v_isShallow")
      return s;
    if (i === "__v_raw")
      return n === (r ? s ? ll : Ps : s ? Cs : Rs).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(n) ? t : void 0;
    const o = z(t);
    if (!r) {
      let a;
      if (o && (a = Xo[i]))
        return a;
      if (i === "hasOwnProperty")
        return Yo;
    }
    const l = Reflect.get(
      t,
      i,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ xe(t) ? t : n
    );
    if ((st(i) ? Ts.has(i) : Jo(i)) || (r || _e(t, "get", i), s))
      return l;
    if (/* @__PURE__ */ xe(l)) {
      const a = o && Jn(i) ? l : l.value;
      return r && re(a) ? /* @__PURE__ */ On(a) : a;
    }
    return re(l) ? r ? /* @__PURE__ */ On(l) : /* @__PURE__ */ ir(l) : l;
  }
}
class As extends Ms {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, i, n, r) {
    let s = t[i];
    const o = z(t) && Jn(i);
    if (!this._isShallow) {
      const f = /* @__PURE__ */ at(s);
      if (!/* @__PURE__ */ Be(n) && !/* @__PURE__ */ at(n) && (s = /* @__PURE__ */ ne(s), n = /* @__PURE__ */ ne(n)), !o && /* @__PURE__ */ xe(s) && !/* @__PURE__ */ xe(n))
        return f || (s.value = n), !0;
    }
    const l = o ? Number(i) < t.length : ee(t, i), a = Reflect.set(
      t,
      i,
      n,
      /* @__PURE__ */ xe(t) ? t : r
    );
    return t === /* @__PURE__ */ ne(r) && a && (l ? it(n, s) && pt(t, "set", i, n) : pt(t, "add", i, n)), a;
  }
  deleteProperty(t, i) {
    const n = ee(t, i);
    t[i];
    const r = Reflect.deleteProperty(t, i);
    return r && n && pt(t, "delete", i, void 0), r;
  }
  has(t, i) {
    const n = Reflect.has(t, i);
    return (!st(i) || !Ts.has(i)) && _e(t, "has", i), n;
  }
  ownKeys(t) {
    return _e(
      t,
      "iterate",
      z(t) ? "length" : Ft
    ), Reflect.ownKeys(t);
  }
}
class Zo extends Ms {
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
const Qo = /* @__PURE__ */ new As(), el = /* @__PURE__ */ new Zo(), tl = /* @__PURE__ */ new As(!0);
const kn = (e) => e, Ti = (e) => Reflect.getPrototypeOf(e);
function il(e, t, i) {
  return function(...n) {
    const r = this.__v_raw, s = /* @__PURE__ */ ne(r), o = xt(s), l = e === "entries" || e === Symbol.iterator && o, a = e === "keys" && o, f = r[e](...n), c = i ? kn : t ? Et : je;
    return !t && _e(
      s,
      "iterate",
      a ? Pn : Ft
    ), Se(
      // inheriting all iterator properties
      Object.create(f),
      {
        // iterator protocol
        next() {
          const { value: d, done: v } = f.next();
          return v ? { value: d, done: v } : {
            value: l ? [c(d[0]), c(d[1])] : c(d),
            done: v
          };
        }
      }
    );
  };
}
function Mi(e) {
  return function(...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function nl(e, t) {
  const i = {
    get(r) {
      const s = this.__v_raw, o = /* @__PURE__ */ ne(s), l = /* @__PURE__ */ ne(r);
      e || (it(r, l) && _e(o, "get", r), _e(o, "get", l));
      const { has: a } = Ti(o), f = t ? kn : e ? Et : je;
      if (a.call(o, r))
        return f(s.get(r));
      if (a.call(o, l))
        return f(s.get(l));
      s !== o && s.get(r);
    },
    get size() {
      const r = this.__v_raw;
      return !e && _e(/* @__PURE__ */ ne(r), "iterate", Ft), r.size;
    },
    has(r) {
      const s = this.__v_raw, o = /* @__PURE__ */ ne(s), l = /* @__PURE__ */ ne(r);
      return e || (it(r, l) && _e(o, "has", r), _e(o, "has", l)), r === l ? s.has(r) : s.has(r) || s.has(l);
    },
    forEach(r, s) {
      const o = this, l = o.__v_raw, a = /* @__PURE__ */ ne(l), f = t ? kn : e ? Et : je;
      return !e && _e(a, "iterate", Ft), l.forEach((c, d) => r.call(s, f(c), f(d), o));
    }
  };
  return Se(
    i,
    e ? {
      add: Mi("add"),
      set: Mi("set"),
      delete: Mi("delete"),
      clear: Mi("clear")
    } : {
      add(r) {
        const s = /* @__PURE__ */ ne(this), o = Ti(s), l = /* @__PURE__ */ ne(r), a = !t && !/* @__PURE__ */ Be(r) && !/* @__PURE__ */ at(r) ? l : r;
        return o.has.call(s, a) || it(r, a) && o.has.call(s, r) || it(l, a) && o.has.call(s, l) || (s.add(a), pt(s, "add", a, a)), this;
      },
      set(r, s) {
        !t && !/* @__PURE__ */ Be(s) && !/* @__PURE__ */ at(s) && (s = /* @__PURE__ */ ne(s));
        const o = /* @__PURE__ */ ne(this), { has: l, get: a } = Ti(o);
        let f = l.call(o, r);
        f || (r = /* @__PURE__ */ ne(r), f = l.call(o, r));
        const c = a.call(o, r);
        return o.set(r, s), f ? it(s, c) && pt(o, "set", r, s) : pt(o, "add", r, s), this;
      },
      delete(r) {
        const s = /* @__PURE__ */ ne(this), { has: o, get: l } = Ti(s);
        let a = o.call(s, r);
        a || (r = /* @__PURE__ */ ne(r), a = o.call(s, r)), l && l.call(s, r);
        const f = s.delete(r);
        return a && pt(s, "delete", r, void 0), f;
      },
      clear() {
        const r = /* @__PURE__ */ ne(this), s = r.size !== 0, o = r.clear();
        return s && pt(
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
    i[r] = il(r, e, t);
  }), i;
}
function tr(e, t) {
  const i = nl(e, t);
  return (n, r, s) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_isShallow" ? t : r === "__v_raw" ? n : Reflect.get(
    ee(i, r) && r in n ? i : n,
    r,
    s
  );
}
const rl = {
  get: /* @__PURE__ */ tr(!1, !1)
}, sl = {
  get: /* @__PURE__ */ tr(!1, !0)
}, ol = {
  get: /* @__PURE__ */ tr(!0, !1)
};
const Rs = /* @__PURE__ */ new WeakMap(), Cs = /* @__PURE__ */ new WeakMap(), Ps = /* @__PURE__ */ new WeakMap(), ll = /* @__PURE__ */ new WeakMap();
function al(e) {
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
function ir(e) {
  return /* @__PURE__ */ at(e) ? e : nr(
    e,
    !1,
    Qo,
    rl,
    Rs
  );
}
// @__NO_SIDE_EFFECTS__
function ks(e) {
  return nr(
    e,
    !1,
    tl,
    sl,
    Cs
  );
}
// @__NO_SIDE_EFFECTS__
function On(e) {
  return nr(
    e,
    !0,
    el,
    ol,
    Ps
  );
}
function nr(e, t, i, n, r) {
  if (!re(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const s = r.get(e);
  if (s)
    return s;
  const o = al(Io(e));
  if (o === 0)
    return e;
  const l = new Proxy(
    e,
    o === 2 ? n : i
  );
  return r.set(e, l), l;
}
// @__NO_SIDE_EFFECTS__
function St(e) {
  return /* @__PURE__ */ at(e) ? /* @__PURE__ */ St(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function at(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Be(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function rr(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function ne(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ ne(t) : e;
}
function cl(e) {
  return !ee(e, "__v_skip") && Object.isExtensible(e) && ds(e, "__v_skip", !0), e;
}
const je = (e) => re(e) ? /* @__PURE__ */ ir(e) : e, Et = (e) => re(e) ? /* @__PURE__ */ On(e) : e;
// @__NO_SIDE_EFFECTS__
function xe(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function Ne(e) {
  return fl(e, !1);
}
function fl(e, t) {
  return /* @__PURE__ */ xe(e) ? e : new ul(e, t);
}
class ul {
  constructor(t, i) {
    this.dep = new er(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = i ? t : /* @__PURE__ */ ne(t), this._value = i ? t : je(t), this.__v_isShallow = i;
  }
  get value() {
    return this.dep.track(), this._value;
  }
  set value(t) {
    const i = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Be(t) || /* @__PURE__ */ at(t);
    t = n ? t : /* @__PURE__ */ ne(t), it(t, i) && (this._rawValue = t, this._value = n ? t : je(t), this.dep.trigger());
  }
}
function In(e) {
  return /* @__PURE__ */ xe(e) ? e.value : e;
}
const dl = {
  get: (e, t, i) => t === "__v_raw" ? e : In(Reflect.get(e, t, i)),
  set: (e, t, i, n) => {
    const r = e[t];
    return /* @__PURE__ */ xe(r) && !/* @__PURE__ */ xe(i) ? (r.value = i, !0) : Reflect.set(e, t, i, n);
  }
};
function Os(e) {
  return /* @__PURE__ */ St(e) ? e : new Proxy(e, dl);
}
class hl {
  constructor(t, i, n) {
    this.fn = t, this.setter = i, this._value = void 0, this.dep = new er(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = di - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !i, this.isSSR = n;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    le !== this)
      return vs(this, !0), !0;
  }
  get value() {
    const t = this.dep.track();
    return _s(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter && this.setter(t);
  }
}
// @__NO_SIDE_EFFECTS__
function pl(e, t, i = !1) {
  let n, r;
  return G(e) ? n = e : (n = e.get, r = e.set), new hl(n, r, i);
}
const Ai = {}, Ui = /* @__PURE__ */ new WeakMap();
let kt;
function gl(e, t = !1, i = kt) {
  if (i) {
    let n = Ui.get(i);
    n || Ui.set(i, n = []), n.push(e);
  }
}
function ml(e, t, i = ae) {
  const { immediate: n, deep: r, once: s, scheduler: o, augmentJob: l, call: a } = i, f = (S) => r ? S : /* @__PURE__ */ Be(S) || r === !1 || r === 0 ? wt(S, 1) : wt(S);
  let c, d, v, w, p = !1, b = !1;
  if (/* @__PURE__ */ xe(e) ? (d = () => e.value, p = /* @__PURE__ */ Be(e)) : /* @__PURE__ */ St(e) ? (d = () => f(e), p = !0) : z(e) ? (b = !0, p = e.some((S) => /* @__PURE__ */ St(S) || /* @__PURE__ */ Be(S)), d = () => e.map((S) => {
    if (/* @__PURE__ */ xe(S))
      return S.value;
    if (/* @__PURE__ */ St(S))
      return f(S);
    if (G(S))
      return a ? a(S, 2) : S();
  })) : G(e) ? t ? d = a ? () => a(e, 2) : e : d = () => {
    if (v) {
      ot();
      try {
        v();
      } finally {
        lt();
      }
    }
    const S = kt;
    kt = c;
    try {
      return a ? a(e, 3, [w]) : e(w);
    } finally {
      kt = S;
    }
  } : d = rt, t && r) {
    const S = d, R = r === !0 ? 1 / 0 : r;
    d = () => wt(S(), R);
  }
  const T = Vo(), y = () => {
    c.stop(), T && T.active && Xn(T.effects, c);
  };
  if (s && t) {
    const S = t;
    t = (...R) => {
      try {
        return S(...R);
      } finally {
        y();
      }
    };
  }
  let h = b ? new Array(e.length).fill(Ai) : Ai;
  const x = (S) => {
    if (!(!(c.flags & 1) || !c.dirty && !S))
      if (t) {
        const R = c.run();
        if (S || r || p || (b ? R.some((j, U) => it(j, h[U])) : it(R, h))) {
          const j = kt;
          ot();
          try {
            v && v(), kt = c;
            const U = [
              R,
              // pass undefined as the old value when it's changed for the first time
              h === Ai ? void 0 : b && h[0] === Ai ? [] : h,
              w
            ];
            h = R, a ? a(t, 3, U) : (
              // @ts-expect-error
              t(...U)
            );
          } finally {
            kt = j, lt();
          }
        }
      } else
        c.run();
  };
  return l && l(x), c = new ms(d), c.scheduler = o ? () => o(x, !1) : x, w = (S) => gl(S, !1, c), v = c.onStop = () => {
    const S = Ui.get(c);
    if (S) {
      if (a)
        a(S, 4);
      else
        for (const R of S) R();
      Ui.delete(c);
    }
  }, t ? n ? x(!0) : h = c.run() : o ? o(x.bind(null, !0), !0) : c.run(), y.pause = c.pause.bind(c), y.resume = c.resume.bind(c), y.stop = y, y;
}
function wt(e, t = 1 / 0, i) {
  if (t <= 0 || !re(e) || e.__v_skip || (i = i || /* @__PURE__ */ new Map(), (i.get(e) || 0) >= t))
    return e;
  if (i.set(e, t), t--, /* @__PURE__ */ xe(e))
    wt(e.value, t, i);
  else if (z(e))
    for (let n = 0; n < e.length; n++)
      wt(e[n], t, i);
  else if (Fi(e) || xt(e))
    e.forEach((n) => {
      wt(n, t, i);
    });
  else if (fs(e)) {
    for (const n in e)
      wt(e[n], t, i);
    for (const n of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, n) && wt(e[n], t, i);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function xi(e, t, i, n) {
  try {
    return n ? e(...n) : e();
  } catch (r) {
    en(r, t, i);
  }
}
function qe(e, t, i, n) {
  if (G(e)) {
    const r = xi(e, t, i, n);
    return r && as(r) && r.catch((s) => {
      en(s, t, i);
    }), r;
  }
  if (z(e)) {
    const r = [];
    for (let s = 0; s < e.length; s++)
      r.push(qe(e[s], t, i, n));
    return r;
  }
}
function en(e, t, i, n = !0) {
  const r = t ? t.vnode : null, { errorHandler: s, throwUnhandledErrorInProduction: o } = t && t.appContext.config || ae;
  if (t) {
    let l = t.parent;
    const a = t.proxy, f = `https://vuejs.org/error-reference/#runtime-${i}`;
    for (; l; ) {
      const c = l.ec;
      if (c) {
        for (let d = 0; d < c.length; d++)
          if (c[d](e, a, f) === !1)
            return;
      }
      l = l.parent;
    }
    if (s) {
      ot(), xi(s, null, 10, [
        e,
        a,
        f
      ]), lt();
      return;
    }
  }
  yl(e, i, r, n, o);
}
function yl(e, t, i, n = !0, r = !1) {
  if (r)
    throw e;
  console.error(e);
}
const Me = [];
let He = -1;
const et = [];
let yt = null, Kt = 0;
const Is = /* @__PURE__ */ Promise.resolve();
let Ni = null;
function tn(e) {
  const t = Ni || Is;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function vl(e) {
  let t = He + 1, i = Me.length;
  for (; t < i; ) {
    const n = t + i >>> 1, r = Me[n], s = pi(r);
    s < e || s === e && r.flags & 2 ? t = n + 1 : i = n;
  }
  return t;
}
function sr(e) {
  if (!(e.flags & 1)) {
    const t = pi(e), i = Me[Me.length - 1];
    !i || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= pi(i) ? Me.push(e) : Me.splice(vl(t), 0, e), e.flags |= 1, Ds();
  }
}
function Ds() {
  Ni || (Ni = Is.then(Us));
}
function wl(e) {
  if (!z(e))
    yt && e.id === -1 ? yt.splice(Kt + 1, 0, e) : e.flags & 1 || (et.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      et.push(e[t]);
  Ds();
}
function Ls(e, t, i, n = He + 1) {
  for (; n < Me.length; n++) {
    const r = Me[n];
    if (r && r.flags & 2) {
      if (e && r.id !== e.uid || t !== void 0 && !(r.id >= t))
        continue;
      Me.splice(n, 1), n = e ? n - 1 : He, r.flags & 4 && (r.flags &= -2), r(), r.flags & 4 || (r.flags &= -2);
    }
  }
}
function Fs(e, t, i = 0) {
  if (et.length) {
    let n = et, r = 0;
    if (t) {
      n = [];
      for (let o = 0; o < et.length; o++) {
        const l = et[o];
        (l.i !== void 0 ? !l.i || l.i.uid < i : t.has(l)) ? et[r++] = l : n.push(l);
      }
    }
    const s = [...new Set(n)].sort((o, l) => pi(o) - pi(l));
    if (et.length = r, yt) {
      for (let o = 0; o < s.length; o++)
        yt.push(s[o]);
      return;
    }
    for (yt = s, Kt = 0; Kt < yt.length; Kt++) {
      const o = yt[Kt];
      o.flags & 4 && (o.flags &= -2), o.flags & 8 || o(), o.flags &= -2;
    }
    yt = null, Kt = 0;
  }
}
let mn = !1;
function bl(e, t) {
  if (mn) {
    e();
    return;
  }
  const i = t === void 0 ? void 0 : new Set(et);
  e(), mn = !0;
  try {
    Ls(void 0, t), Fs(void 0, i, t);
  } finally {
    mn = !1;
  }
}
const pi = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Us(e) {
  try {
    for (He = 0; He < Me.length; He++) {
      const t = Me[He];
      t && !(t.flags & 8) && (t.flags & 4 && (t.flags &= -2), xi(
        t,
        t.i,
        t.i ? 15 : 14
      ), t.flags & 4 || (t.flags &= -2));
    }
  } finally {
    for (; He < Me.length; He++) {
      const t = Me[He];
      t && (t.flags &= -2);
    }
    He = -1, Me.length = 0, Fs(), Ni = null, (Me.length || et.length) && Us();
  }
}
let nt = null, Ns = null;
function Bi(e) {
  const t = nt;
  return nt = e, Ns = e && e.type.__scopeId || null, t;
}
function _l(e, t = nt, i) {
  if (!t || e._n)
    return e;
  const n = (...r) => {
    n._d && Hi(-1);
    const s = Bi(t), o = Ut.length;
    let l;
    try {
      l = e(...r);
    } finally {
      for (let a = Ut.length; a > o; a--) fo();
      Bi(s), n._d && Hi(1);
    }
    return l;
  };
  return n._n = !0, n._c = !0, n._d = !0, n;
}
function Ct(e, t, i, n) {
  const r = e.dirs, s = t && t.dirs;
  for (let o = 0; o < r.length; o++) {
    const l = r[o];
    s && (l.oldValue = s[o].value);
    let a = l.dir[n];
    a && (ot(), qe(a, i, 8, [
      e.el,
      l,
      e,
      t
    ]), lt());
  }
}
function xl(e, t) {
  if (Ae) {
    let i = Ae.provides;
    const n = Ae.parent && Ae.parent.provides;
    n === i && (i = Ae.provides = Object.create(n)), i[e] = t;
  }
}
function ki(e, t, i = !1) {
  const n = wa();
  if (n || Ht) {
    let r = Ht ? Ht._context.provides : n ? n.parent == null || n.ce ? n.vnode.appContext && n.vnode.appContext.provides : n.parent.provides : void 0;
    if (r && e in r)
      return r[e];
    if (arguments.length > 1)
      return i && G(t) ? t.call(n && n.proxy) : t;
  }
}
const Sl = /* @__PURE__ */ Symbol.for("v-scx"), El = () => ki(Sl);
function Oi(e, t, i) {
  return Bs(e, t, i);
}
function Bs(e, t, i = ae) {
  const { immediate: n, deep: r, flush: s, once: o } = i, l = Se({}, i), a = t && n || !t && s !== "post";
  let f;
  if (vi) {
    if (s === "sync") {
      const w = El();
      f = w.__watcherHandles || (w.__watcherHandles = []);
    } else if (!a) {
      const w = () => {
      };
      return w.stop = rt, w.resume = rt, w.pause = rt, w;
    }
  }
  const c = Ae;
  l.call = (w, p, b) => qe(w, c, p, b);
  let d = !1;
  s === "post" ? l.scheduler = (w) => {
    w.i = c, Te(w, c && c.suspense);
  } : s !== "sync" && (d = !0, l.scheduler = (w, p) => {
    p ? w() : sr(w);
  }), l.augmentJob = (w) => {
    t && (w.flags |= 4), d && (w.flags |= 2, c && (w.id = c.uid, w.i = c));
  };
  const v = ml(e, t, l);
  return vi && (f ? f.push(v) : a && v()), v;
}
function Tl(e, t, i) {
  const n = this.proxy, r = ue(e) ? e.includes(".") ? js(n, e) : () => n[e] : e.bind(n, n);
  let s;
  G(t) ? s = t : (s = t.handler, i = t);
  const o = Si(this), l = Bs(r, s.bind(n), i);
  return o(), l;
}
function js(e, t) {
  const i = t.split(".");
  return () => {
    let n = e;
    for (let r = 0; r < i.length && n; r++)
      n = n[i[r]];
    return n;
  };
}
const mt = /* @__PURE__ */ new WeakMap(), Ks = /* @__PURE__ */ Symbol("_vte"), nn = (e) => e.__isTeleport, Ot = (e) => e && (e.disabled || e.disabled === ""), Ml = (e) => e && (e.defer || e.defer === ""), Rr = (e) => typeof SVGElement < "u" && e instanceof SVGElement, Cr = (e) => typeof MathMLElement == "function" && e instanceof MathMLElement, Dn = (e, t) => {
  const i = e && e.to;
  return ue(i) ? t ? t(i) : null : i;
}, Al = {
  name: "Teleport",
  __isTeleport: !0,
  process(e, t, i, n, r, s, o, l, a, f) {
    const {
      mc: c,
      pc: d,
      pbc: v,
      o: { insert: w, querySelector: p, createText: b, createComment: T, parentNode: y }
    } = f, h = Ot(t.props);
    let { dynamicChildren: x } = t;
    const S = (U, N, W) => {
      U.shapeFlag & 16 && c(
        U.children,
        N,
        W,
        r,
        s,
        o,
        l,
        a
      );
    }, R = (U = t) => {
      const N = Ot(U.props), W = U.target = Dn(U.props, p), X = Ln(W, U, b, w);
      W && (o !== "svg" && Rr(W) ? o = "svg" : o !== "mathml" && Cr(W) && (o = "mathml"), r && r.isCE && (r.ce._teleportTargets || (r.ce._teleportTargets = /* @__PURE__ */ new Set())).add(W), N || (S(U, W, X), Zt(U, !1)));
    }, j = (U) => {
      const N = () => {
        if (mt.get(U) === N) {
          if (mt.delete(U), Ot(U.props)) {
            const W = y(U.el) || i;
            S(U, W, U.anchor), Zt(U, !0);
          }
          R(U);
        }
      };
      mt.set(U, N), Te(N, s);
    };
    if (e == null) {
      const U = t.el = b(""), N = t.anchor = b("");
      if (w(U, i, n), w(N, i, n), Ml(t.props) || s && s.pendingBranch) {
        j(t);
        return;
      }
      h && (S(t, i, N), Zt(t, !0)), R();
    } else {
      t.el = e.el;
      const U = t.anchor = e.anchor, N = mt.get(e);
      if (N) {
        N.flags |= 8, mt.delete(e), j(t);
        return;
      }
      t.targetStart = e.targetStart;
      const W = t.target = e.target, X = t.targetAnchor = e.targetAnchor, q = Ot(e.props), Q = q ? i : W, oe = q ? U : X;
      if (o === "svg" || Rr(W) ? o = "svg" : (o === "mathml" || Cr(W)) && (o = "mathml"), x ? (v(
        e.dynamicChildren,
        x,
        Q,
        r,
        s,
        o,
        l
      ), cr(e, t, !0)) : a || d(
        e,
        t,
        Q,
        oe,
        r,
        s,
        o,
        l,
        !1
      ), h)
        q ? t.props && e.props && t.props.to !== e.props.to && (t.props.to = e.props.to) : Ri(
          t,
          i,
          U,
          f,
          1
        );
      else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
        const I = Dn(t.props, p);
        I && (t.target = I, Ri(
          t,
          I,
          null,
          f,
          0
        ));
      } else q && Ri(
        t,
        W,
        X,
        f,
        1
      );
      Zt(t, h);
    }
  },
  remove(e, t, i, { um: n, o: { remove: r } }, s) {
    const {
      shapeFlag: o,
      children: l,
      anchor: a,
      targetStart: f,
      targetAnchor: c,
      target: d,
      props: v
    } = e, w = Ot(v), p = s || !w, b = mt.get(e);
    if (b && (b.flags |= 8, mt.delete(e)), d && (r(f), r(c)), s && r(a), !b && (w || d) && o & 16)
      for (let T = 0; T < l.length; T++) {
        const y = l[T];
        n(
          y,
          t,
          i,
          p,
          !!y.dynamicChildren
        );
      }
  },
  move: Ri,
  hydrate: Rl
};
function Ri(e, t, i, { o: { insert: n }, m: r }, s = 2) {
  s === 0 && (e.targetStart && n(e.targetStart, t, i), n(e.targetAnchor, t, i), i = e.targetAnchor);
  const { el: o, anchor: l, shapeFlag: a, children: f, props: c } = e, d = s === 2;
  if (d && n(o, t, i), !mt.has(e) && (!d || Ot(c)) && a & 16)
    for (let v = 0; v < f.length; v++)
      r(
        f[v],
        t,
        i,
        2
      );
  d && n(l, t, i);
}
function Rl(e, t, i, n, r, s, {
  o: { nextSibling: o, parentNode: l, querySelector: a, insert: f, createText: c }
}, d) {
  function v(T, y) {
    let h = y;
    for (; h; ) {
      if (h && h.nodeType === 8) {
        if (h.data === "teleport start anchor")
          t.targetStart = h;
        else if (h.data === "teleport anchor") {
          t.targetAnchor = h, T._lpa = t.targetAnchor && o(t.targetAnchor);
          break;
        }
      }
      h = o(h);
    }
  }
  function w(T, y) {
    y.anchor = d(
      o(T),
      y,
      l(T),
      i,
      n,
      r,
      s
    );
  }
  const p = t.target = Dn(
    t.props,
    a
  ), b = Ot(t.props);
  if (p) {
    const T = p._lpa || p.firstChild;
    t.shapeFlag & 16 && (b ? (w(e, t), v(p, T), t.targetAnchor || Ln(
      p,
      t,
      c,
      f,
      // if target is the same as the main view, insert anchors before current node
      // to avoid hydrating mismatch
      l(e) === p ? e : null
    )) : (t.anchor = o(e), v(p, T), t.targetAnchor || Ln(p, t, c, f), d(
      T && o(T),
      t,
      p,
      i,
      n,
      r,
      s
    ))), Zt(t, b);
  } else b && t.shapeFlag & 16 && (w(e, t), t.targetStart = e, t.targetAnchor = o(e));
  return t.anchor && o(t.anchor);
}
const Cl = Al;
function Zt(e, t) {
  const i = e.ctx;
  if (i && i.ut) {
    let n, r;
    for (t ? (n = e.el, r = e.anchor) : (n = e.targetStart, r = e.targetAnchor); n && n !== r; )
      n.nodeType === 1 && n.setAttribute("data-v-owner", i.uid), n = n.nextSibling;
    i.ut();
  }
}
function Ln(e, t, i, n, r = null) {
  const s = t.targetStart = i(""), o = t.targetAnchor = i("");
  return s[Ks] = o, e && (n(s, e, r), n(o, e, r)), o;
}
const yn = /* @__PURE__ */ Symbol("_leaveCb");
function Pl(e) {
  let t = e[0];
  if (e.length > 1) {
    for (const i of e)
      if (i.type !== Xe) {
        t = i;
        break;
      }
  }
  return t;
}
function $s(e) {
  if (!or(e))
    return nn(e.type) && e.children ? Pl(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: i } = e;
  if (i) {
    if (t & 16)
      return i[0];
    if (t & 32 && G(i.default))
      return i.default();
  }
}
function ji(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const i = e.component.subTree;
    ji(
      nn(i.type) && $s(i) || i,
      t
    );
  } else if (e.shapeFlag & 128)
    e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
  else if (e.transition = t, e.type === Ie && z(e.children)) {
    const i = Zs(e.children, !1);
    i && ji(i, t);
  }
}
function Fn(e) {
  if (e.component)
    return Fn(e.component.subTree);
  if (e.type === Ie) {
    const t = z(e.children) && Zs(e.children, !1);
    return t ? Fn(t) : void 0;
  }
  if (e.type !== Xe)
    return e;
}
function Hs(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
function Pr(e, t) {
  let i;
  return !!((i = Object.getOwnPropertyDescriptor(e, t)) && !i.configurable);
}
const Ki = /* @__PURE__ */ new WeakMap();
function li(e, t, i, n, r = !1) {
  if (z(e)) {
    e.forEach(
      (b, T) => li(
        b,
        t && (z(t) ? t[T] : t),
        i,
        n,
        r
      )
    );
    return;
  }
  if (ai(n) && !r) {
    n.shapeFlag & 512 && n.type.__asyncResolved && n.component.subTree.component && li(e, t, i, n.component.subTree);
    return;
  }
  const s = n.shapeFlag & 4 ? ur(n.component) : n.el, o = r ? null : s, { i: l, r: a } = e, f = t && t.r, c = l.refs === ae ? l.refs = {} : l.refs, d = l.setupState, v = /* @__PURE__ */ ne(d), w = d === ae ? ls : (b) => Pr(c, b) ? !1 : ee(v, b), p = (b, T) => !(T && Pr(c, T));
  if (f != null && f !== a) {
    if (kr(t), ue(f))
      c[f] = null, w(f) && (d[f] = null);
    else if (/* @__PURE__ */ xe(f)) {
      const b = t;
      p(f, b.k) && (f.value = null), b.k && (c[b.k] = null);
    }
  }
  if (G(a))
    xi(a, l, 12, [o, c]);
  else {
    const b = ue(a), T = /* @__PURE__ */ xe(a);
    if (b || T) {
      const y = () => {
        if (e.f) {
          const h = b ? w(a) ? d[a] : c[a] : p() || !e.k ? a.value : c[e.k];
          if (r)
            z(h) && Xn(h, s);
          else if (z(h))
            h.includes(s) || h.push(s);
          else if (b)
            c[a] = [s], w(a) && (d[a] = c[a]);
          else {
            const x = [s];
            p(a, e.k) && (a.value = x), e.k && (c[e.k] = x);
          }
        } else b ? (c[a] = o, w(a) && (d[a] = o)) : T && (p(a, e.k) && (a.value = o), e.k && (c[e.k] = o));
      };
      if (o) {
        const h = () => {
          y(), Ki.delete(e);
        };
        h.id = -1, Ki.set(e, h), Te(h, i);
      } else
        kr(e), y();
    }
  }
}
function kr(e) {
  const t = Ki.get(e);
  t && (t.flags |= 8, Ki.delete(e));
}
Ji().requestIdleCallback;
Ji().cancelIdleCallback;
const ai = (e) => !!e.type.__asyncLoader, or = (e) => e.type.__isKeepAlive;
function kl(e, t) {
  Ws(e, "a", t);
}
function Ol(e, t) {
  Ws(e, "da", t);
}
function Ws(e, t, i = Ae) {
  const n = e.__wdc || (e.__wdc = () => {
    let r = i;
    for (; r; ) {
      if (r.isDeactivated)
        return;
      r = r.parent;
    }
    return e();
  });
  if (rn(t, n, i), i) {
    let r = i.parent;
    for (; r && r.parent; )
      or(r.parent.vnode) && Il(n, t, i, r), r = r.parent;
  }
}
function Il(e, t, i, n) {
  const r = rn(
    t,
    e,
    n,
    !0
    /* prepend */
  );
  Vs(() => {
    Xn(n[t], r);
  }, i);
}
function rn(e, t, i = Ae, n = !1) {
  if (i) {
    const r = i[e] || (i[e] = []), s = t.__weh || (t.__weh = (...o) => {
      ot();
      const l = Si(i), a = qe(t, i, e, o);
      return l(), lt(), a;
    });
    return n ? r.unshift(s) : r.push(s), s;
  }
}
const gt = (e) => (t, i = Ae) => {
  (!vi || e === "sp") && rn(e, (...n) => t(...n), i);
}, Dl = gt("bm"), zs = gt("m"), Ll = gt(
  "bu"
), Fl = gt("u"), sn = gt(
  "bum"
), Vs = gt("um"), Ul = gt(
  "sp"
), Nl = gt("rtg"), Bl = gt("rtc");
function jl(e, t = Ae) {
  rn("ec", e, t);
}
const Kl = /* @__PURE__ */ Symbol.for("v-ndc");
function Gs(e, t, i, n) {
  let r;
  const s = i, o = z(e);
  if (o || ue(e)) {
    const l = o && /* @__PURE__ */ St(e);
    let a = !1, f = !1;
    l && (a = !/* @__PURE__ */ Be(e), f = /* @__PURE__ */ at(e), e = Qi(e)), r = new Array(e.length);
    for (let c = 0, d = e.length; c < d; c++)
      r[c] = t(
        a ? f ? Et(je(e[c])) : je(e[c]) : e[c],
        c,
        void 0,
        s
      );
  } else if (typeof e == "number")
    if (!Number.isInteger(e) || e < 0)
      r = [];
    else {
      r = new Array(e);
      for (let l = 0; l < e; l++)
        r[l] = t(l + 1, l, void 0, s);
    }
  else if (re(e))
    if (e[Symbol.iterator])
      r = Array.from(
        e,
        (l, a) => t(l, a, void 0, s)
      );
    else {
      const l = Object.keys(e);
      r = new Array(l.length);
      for (let a = 0, f = l.length; a < f; a++) {
        const c = l[a];
        r[a] = t(e[c], c, a, s);
      }
    }
  else
    r = [];
  return r;
}
const Un = (e) => e ? yo(e) ? ur(e) : Un(e.parent) : null, ci = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ Se(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => Un(e.parent),
    $root: (e) => Un(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Xs(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      sr(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = tn.bind(e.proxy)),
    $watch: (e) => Tl.bind(e)
  })
), vn = (e, t) => e !== ae && !e.__isScriptSetup && ee(e, t), $l = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: i, setupState: n, data: r, props: s, accessCache: o, type: l, appContext: a } = e;
    if (t[0] !== "$") {
      const v = o[t];
      if (v !== void 0)
        switch (v) {
          case 1:
            return n[t];
          case 2:
            return r[t];
          case 4:
            return i[t];
          case 3:
            return s[t];
        }
      else {
        if (vn(n, t))
          return o[t] = 1, n[t];
        if (r !== ae && ee(r, t))
          return o[t] = 2, r[t];
        if (ee(s, t))
          return o[t] = 3, s[t];
        if (i !== ae && ee(i, t))
          return o[t] = 4, i[t];
        Nn && (o[t] = 0);
      }
    }
    const f = ci[t];
    let c, d;
    if (f)
      return t === "$attrs" && _e(e.attrs, "get", ""), f(e);
    if (
      // css module (injected by vue-loader)
      (c = l.__cssModules) && (c = c[t])
    )
      return c;
    if (i !== ae && ee(i, t))
      return o[t] = 4, i[t];
    if (
      // global properties
      d = a.config.globalProperties, ee(d, t)
    )
      return d[t];
  },
  set({ _: e }, t, i) {
    const { data: n, setupState: r, ctx: s } = e;
    return vn(r, t) ? (r[t] = i, !0) : n !== ae && ee(n, t) ? (n[t] = i, !0) : ee(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (s[t] = i, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: i, ctx: n, appContext: r, props: s, type: o }
  }, l) {
    let a;
    return !!(i[l] || e !== ae && l[0] !== "$" && ee(e, l) || vn(t, l) || ee(s, l) || ee(n, l) || ee(ci, l) || ee(r.config.globalProperties, l) || (a = o.__cssModules) && a[l]);
  },
  defineProperty(e, t, i) {
    return i.get != null ? e._.accessCache[t] = 0 : ee(i, "value") && this.set(e, t, i.value, null), Reflect.defineProperty(e, t, i);
  }
};
function Or(e) {
  return z(e) ? e.reduce(
    (t, i) => (t[i] = null, t),
    {}
  ) : e;
}
let Nn = !0;
function Hl(e) {
  const t = Xs(e), i = e.proxy, n = e.ctx;
  Nn = !1, t.beforeCreate && Ir(t.beforeCreate, e, "bc");
  const {
    // state
    data: r,
    computed: s,
    methods: o,
    watch: l,
    provide: a,
    inject: f,
    // lifecycle
    created: c,
    beforeMount: d,
    mounted: v,
    beforeUpdate: w,
    updated: p,
    activated: b,
    deactivated: T,
    beforeDestroy: y,
    beforeUnmount: h,
    destroyed: x,
    unmounted: S,
    render: R,
    renderTracked: j,
    renderTriggered: U,
    errorCaptured: N,
    serverPrefetch: W,
    // public API
    expose: X,
    inheritAttrs: q,
    // assets
    components: Q,
    directives: oe,
    filters: I
  } = t;
  if (f && Wl(f, n, null), o)
    for (const Z in o) {
      const te = o[Z];
      G(te) && (n[Z] = te.bind(i));
    }
  if (r) {
    const Z = r.call(i, i);
    re(Z) && (e.data = /* @__PURE__ */ ir(Z));
  }
  if (Nn = !0, s)
    for (const Z in s) {
      const te = s[Z], Je = G(te) ? te.bind(i, i) : G(te.get) ? te.get.bind(i, i) : rt, Nt = !G(te) && G(te.set) ? te.set.bind(i) : rt, Ke = Dt({
        get: Je,
        set: Nt
      });
      Object.defineProperty(n, Z, {
        enumerable: !0,
        configurable: !0,
        get: () => Ke.value,
        set: (Ce) => Ke.value = Ce
      });
    }
  if (l)
    for (const Z in l)
      qs(l[Z], n, i, Z);
  if (a) {
    const Z = G(a) ? a.call(i) : a;
    Reflect.ownKeys(Z).forEach((te) => {
      xl(te, Z[te]);
    });
  }
  c && Ir(c, e, "c");
  function Y(Z, te) {
    z(te) ? te.forEach((Je) => Z(Je.bind(i))) : te && Z(te.bind(i));
  }
  if (Y(Dl, d), Y(zs, v), Y(Ll, w), Y(Fl, p), Y(kl, b), Y(Ol, T), Y(jl, N), Y(Bl, j), Y(Nl, U), Y(sn, h), Y(Vs, S), Y(Ul, W), z(X))
    if (X.length) {
      const Z = e.exposed || (e.exposed = {});
      X.forEach((te) => {
        Object.defineProperty(Z, te, {
          get: () => i[te],
          set: (Je) => i[te] = Je,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  R && e.render === rt && (e.render = R), q != null && (e.inheritAttrs = q), Q && (e.components = Q), oe && (e.directives = oe), W && Hs(e);
}
function Wl(e, t, i = rt) {
  z(e) && (e = Bn(e));
  for (const n in e) {
    const r = e[n];
    let s;
    re(r) ? "default" in r ? s = ki(
      r.from || n,
      r.default,
      !0
    ) : s = ki(r.from || n) : s = ki(r), /* @__PURE__ */ xe(s) ? Object.defineProperty(t, n, {
      enumerable: !0,
      configurable: !0,
      get: () => s.value,
      set: (o) => s.value = o
    }) : t[n] = s;
  }
}
function Ir(e, t, i) {
  qe(
    z(e) ? e.map((n) => n.bind(t.proxy)) : e.bind(t.proxy),
    t,
    i
  );
}
function qs(e, t, i, n) {
  let r = n.includes(".") ? js(i, n) : () => i[n];
  if (ue(e)) {
    const s = t[e];
    G(s) && Oi(r, s);
  } else if (G(e))
    Oi(r, e.bind(i));
  else if (re(e))
    if (z(e))
      e.forEach((s) => qs(s, t, i, n));
    else {
      const s = G(e.handler) ? e.handler.bind(i) : t[e.handler];
      G(s) && Oi(r, s, e);
    }
}
function Xs(e) {
  const t = e.type, { mixins: i, extends: n } = t, {
    mixins: r,
    optionsCache: s,
    config: { optionMergeStrategies: o }
  } = e.appContext, l = s.get(t);
  let a;
  return l ? a = l : !r.length && !i && !n ? a = t : (a = {}, r.length && r.forEach(
    (f) => $i(a, f, o, !0)
  ), $i(a, t, o)), re(t) && s.set(t, a), a;
}
function $i(e, t, i, n = !1) {
  const { mixins: r, extends: s } = t;
  s && $i(e, s, i, !0), r && r.forEach(
    (o) => $i(e, o, i, !0)
  );
  for (const o in t)
    if (!(n && o === "expose")) {
      const l = zl[o] || i && i[o];
      e[o] = l ? l(e[o], t[o]) : t[o];
    }
  return e;
}
const zl = {
  data: Dr,
  props: Lr,
  emits: Lr,
  // objects
  methods: Qt,
  computed: Qt,
  // lifecycle
  beforeCreate: Ee,
  created: Ee,
  beforeMount: Ee,
  mounted: Ee,
  beforeUpdate: Ee,
  updated: Ee,
  beforeDestroy: Ee,
  beforeUnmount: Ee,
  destroyed: Ee,
  unmounted: Ee,
  activated: Ee,
  deactivated: Ee,
  errorCaptured: Ee,
  serverPrefetch: Ee,
  // assets
  components: Qt,
  directives: Qt,
  // watch
  watch: Gl,
  // provide / inject
  provide: Dr,
  inject: Vl
};
function Dr(e, t) {
  return t ? e ? function() {
    return Se(
      G(e) ? e.call(this, this) : e,
      G(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function Vl(e, t) {
  return Qt(Bn(e), Bn(t));
}
function Bn(e) {
  if (z(e)) {
    const t = {};
    for (let i = 0; i < e.length; i++)
      t[e[i]] = e[i];
    return t;
  }
  return e;
}
function Ee(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Qt(e, t) {
  return e ? Se(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Lr(e, t) {
  return e ? z(e) && z(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : Se(
    /* @__PURE__ */ Object.create(null),
    Or(e),
    Or(t ?? {})
  ) : t;
}
function Gl(e, t) {
  if (!e) return t;
  if (!t) return e;
  const i = Se(/* @__PURE__ */ Object.create(null), e);
  for (const n in t)
    i[n] = Ee(e[n], t[n]);
  return i;
}
function Js() {
  return {
    app: null,
    config: {
      isNativeTag: ls,
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
let ql = 0;
function Xl(e, t) {
  return function(n, r = null) {
    G(n) || (n = Se({}, n)), r != null && !re(r) && (r = null);
    const s = Js(), o = /* @__PURE__ */ new WeakSet(), l = [];
    let a = !1;
    const f = s.app = {
      _uid: ql++,
      _component: n,
      _props: r,
      _container: null,
      _context: s,
      _instance: null,
      version: Ma,
      get config() {
        return s.config;
      },
      set config(c) {
      },
      use(c, ...d) {
        return o.has(c) || (c && G(c.install) ? (o.add(c), c.install(f, ...d)) : G(c) && (o.add(c), c(f, ...d))), f;
      },
      mixin(c) {
        return s.mixins.includes(c) || s.mixins.push(c), f;
      },
      component(c, d) {
        return d ? (s.components[c] = d, f) : s.components[c];
      },
      directive(c, d) {
        return d ? (s.directives[c] = d, f) : s.directives[c];
      },
      mount(c, d, v) {
        if (!a) {
          const w = f._ceVNode || fe(n, r);
          return w.appContext = s, v === !0 ? v = "svg" : v === !1 && (v = void 0), e(w, c, v), a = !0, f._container = c, c.__vue_app__ = f, ur(w.component);
        }
      },
      onUnmount(c) {
        l.push(c);
      },
      unmount() {
        a && (qe(
          l,
          f._instance,
          16
        ), e(null, f._container), delete f._container.__vue_app__);
      },
      provide(c, d) {
        return s.provides[c] = d, f;
      },
      runWithContext(c) {
        const d = Ht;
        Ht = f;
        try {
          return c();
        } finally {
          Ht = d;
        }
      }
    };
    return f;
  };
}
let Ht = null;
const Jl = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Ve(t)}Modifiers`] || e[`${Mt(t)}Modifiers`];
function Yl(e, t, ...i) {
  if (e.isUnmounted) return;
  const n = e.vnode.props || ae;
  let r = i;
  const s = t.startsWith("update:"), o = s && Jl(n, t.slice(7));
  o && (o.trim && (r = i.map((c) => ue(c) ? c.trim() : c)), o.number && (r = r.map(Fo)));
  let l, a = n[l = fn(t)] || // also try camelCase event handler (#2249)
  n[l = fn(Ve(t))];
  !a && s && (a = n[l = fn(Mt(t))]), a && qe(
    a,
    e,
    6,
    r
  );
  const f = n[l + "Once"];
  if (f) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, qe(
      f,
      e,
      6,
      r
    );
  }
}
const Zl = /* @__PURE__ */ new WeakMap();
function Ys(e, t, i = !1) {
  const n = i ? Zl : t.emitsCache, r = n.get(e);
  if (r !== void 0)
    return r;
  const s = e.emits;
  let o = {}, l = !1;
  if (!G(e)) {
    const a = (f) => {
      const c = Ys(f, t, !0);
      c && (l = !0, Se(o, c));
    };
    !i && t.mixins.length && t.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  return !s && !l ? (re(e) && n.set(e, null), null) : (z(s) ? s.forEach((a) => o[a] = null) : Se(o, s), re(e) && n.set(e, o), o);
}
function on(e, t) {
  return !e || !Gi(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), ee(e, t[0].toLowerCase() + t.slice(1)) || ee(e, Mt(t)) || ee(e, t));
}
function Fr(e) {
  const {
    type: t,
    vnode: i,
    proxy: n,
    withProxy: r,
    propsOptions: [s],
    slots: o,
    attrs: l,
    emit: a,
    render: f,
    renderCache: c,
    props: d,
    data: v,
    setupState: w,
    ctx: p,
    inheritAttrs: b
  } = e, T = Bi(e);
  let y, h;
  try {
    if (i.shapeFlag & 4) {
      const S = r || n, R = S;
      y = tt(
        f.call(
          R,
          S,
          c,
          d,
          w,
          v,
          p
        )
      ), h = l;
    } else {
      const S = t;
      y = tt(
        S.length > 1 ? S(
          d,
          { attrs: l, slots: o, emit: a }
        ) : S(
          d,
          null
        )
      ), h = t.props ? l : Ql(l);
    }
  } catch (S) {
    Ut.length = 0, en(S, e, 1), y = fe(Xe);
  }
  let x = y;
  if (h && b !== !1) {
    const S = Object.keys(h), { shapeFlag: R } = x;
    S.length && R & 7 && (s && S.some(qi) && (h = ea(
      h,
      s
    )), x = Wt(x, h, !1, !0));
  }
  if (i.dirs && (x = Wt(x, null, !1, !0), x.dirs = x.dirs ? x.dirs.concat(i.dirs) : i.dirs), i.transition) {
    const S = nn(x.type) && $s(x) || x;
    ji(S, i.transition);
  }
  return y = x, Bi(T), y;
}
function Zs(e, t = !0) {
  let i;
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    if (mi(r)) {
      if (r.type !== Xe || r.children === "v-if") {
        if (i)
          return;
        i = r;
      }
    } else
      return;
  }
  return i;
}
const Ql = (e) => {
  let t;
  for (const i in e)
    (i === "class" || i === "style" || Gi(i)) && ((t || (t = {}))[i] = e[i]);
  return t;
}, ea = (e, t) => {
  const i = {};
  for (const n in e)
    (!qi(n) || !(n.slice(9) in t)) && (i[n] = e[n]);
  return i;
};
function ta(e, t, i) {
  const { props: n, children: r, component: s } = e, { props: o, children: l, patchFlag: a } = t, f = s.emitsOptions;
  if (t.dirs || t.transition)
    return !0;
  if (i && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return n ? Ur(n, o, f) : !!o;
    if (a & 8) {
      const c = t.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        const v = c[d];
        if (Qs(o, n, v) && !on(f, v))
          return !0;
      }
    }
  } else
    return (r || l) && (!l || !l.$stable) ? !0 : n === o ? !1 : n ? o ? Ur(n, o, f) : !0 : !!o;
  return !1;
}
function Ur(e, t, i) {
  const n = Object.keys(t);
  if (n.length !== Object.keys(e).length)
    return !0;
  for (let r = 0; r < n.length; r++) {
    const s = n[r];
    if (!ee(e, s) || Qs(t, e, s) && !on(i, s))
      return !0;
  }
  return !1;
}
function Qs(e, t, i) {
  const n = e[i], r = t[i];
  return i === "style" && re(n) && re(r) ? !Zi(n, r) : n !== r;
}
function ia({ vnode: e, parent: t, suspense: i }, n) {
  for (; t; ) {
    const r = t.subTree;
    if (r.suspense && r.suspense.activeBranch === e && (r.suspense.vnode.el = r.el = n, e = r), r === e)
      (e = t.vnode).el = n, t = t.parent;
    else
      break;
  }
  i && i.activeBranch === e && (i.vnode.el = n);
}
const eo = {}, to = () => Object.create(eo), io = (e) => Object.getPrototypeOf(e) === eo;
function na(e, t, i, n = !1) {
  const r = {}, s = to();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), no(e, t, r, s);
  for (const o in e.propsOptions[0])
    o in r || (r[o] = void 0);
  i ? e.props = n ? r : /* @__PURE__ */ ks(r) : e.type.props ? e.props = r : e.props = s, e.attrs = s;
}
function ra(e, t, i, n) {
  const {
    props: r,
    attrs: s,
    vnode: { patchFlag: o }
  } = e, l = /* @__PURE__ */ ne(r), [a] = e.propsOptions;
  let f = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (n || o > 0) && !(o & 16)
  ) {
    if (o & 8) {
      const c = e.vnode.dynamicProps;
      for (let d = 0; d < c.length; d++) {
        let v = c[d];
        if (on(e.emitsOptions, v))
          continue;
        const w = t[v];
        if (a)
          if (ee(s, v))
            w !== s[v] && (s[v] = w, f = !0);
          else {
            const p = Ve(v);
            r[p] = jn(
              a,
              l,
              p,
              w,
              e,
              !1
            );
          }
        else
          w !== s[v] && (s[v] = w, f = !0);
      }
    }
  } else {
    no(e, t, r, s) && (f = !0);
    let c;
    for (const d in l)
      (!t || // for camelCase
      !ee(t, d) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((c = Mt(d)) === d || !ee(t, c))) && (a ? i && // for camelCase
      (i[d] !== void 0 || // for kebab-case
      i[c] !== void 0) && (r[d] = jn(
        a,
        l,
        d,
        void 0,
        e,
        !0
      )) : delete r[d]);
    if (s !== l)
      for (const d in s)
        (!t || !ee(t, d)) && (delete s[d], f = !0);
  }
  f && pt(e.attrs, "set", "");
}
function no(e, t, i, n) {
  const [r, s] = e.propsOptions;
  let o = !1, l;
  if (t)
    for (let a in t) {
      if (ri(a))
        continue;
      const f = t[a];
      let c;
      r && ee(r, c = Ve(a)) ? !s || !s.includes(c) ? i[c] = f : (l || (l = {}))[c] = f : on(e.emitsOptions, a) || (!(a in n) || f !== n[a]) && (n[a] = f, o = !0);
    }
  if (s) {
    const a = /* @__PURE__ */ ne(i), f = l || ae;
    for (let c = 0; c < s.length; c++) {
      const d = s[c];
      i[d] = jn(
        r,
        a,
        d,
        f[d],
        e,
        !ee(f, d)
      );
    }
  }
  return o;
}
function jn(e, t, i, n, r, s) {
  const o = e[i];
  if (o != null) {
    const l = ee(o, "default");
    if (l && n === void 0) {
      const a = o.default;
      if (o.type !== Function && !o.skipFactory && G(a)) {
        const { propsDefaults: f } = r;
        if (i in f)
          n = f[i];
        else {
          const c = Si(r);
          n = f[i] = a.call(
            null,
            t
          ), c();
        }
      } else
        n = a;
      r.ce && r.ce._setProp(i, n);
    }
    o[
      0
      /* shouldCast */
    ] && (s && !l ? n = !1 : o[
      1
      /* shouldCastTrue */
    ] && (n === "" || n === Mt(i)) && (n = !0));
  }
  return n;
}
const sa = /* @__PURE__ */ new WeakMap();
function ro(e, t, i = !1) {
  const n = i ? sa : t.propsCache, r = n.get(e);
  if (r)
    return r;
  const s = e.props, o = {}, l = [];
  let a = !1;
  if (!G(e)) {
    const c = (d) => {
      a = !0;
      const [v, w] = ro(d, t, !0);
      Se(o, v), w && l.push(...w);
    };
    !i && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  if (!s && !a)
    return re(e) && n.set(e, It), It;
  if (z(s))
    for (let c = 0; c < s.length; c++) {
      const d = Ve(s[c]);
      Nr(d) && (o[d] = ae);
    }
  else if (s)
    for (const c in s) {
      const d = Ve(c);
      if (Nr(d)) {
        const v = s[c], w = o[d] = z(v) || G(v) ? { type: v } : Se({}, v), p = w.type;
        let b = !1, T = !0;
        if (z(p))
          for (let y = 0; y < p.length; ++y) {
            const h = p[y], x = G(h) && h.name;
            if (x === "Boolean") {
              b = !0;
              break;
            } else x === "String" && (T = !1);
          }
        else
          b = G(p) && p.name === "Boolean";
        w[
          0
          /* shouldCast */
        ] = b, w[
          1
          /* shouldCastTrue */
        ] = T, (b || ee(w, "default")) && l.push(d);
      }
    }
  const f = [o, l];
  return re(e) && n.set(e, f), f;
}
function Nr(e) {
  return e[0] !== "$" && !ri(e);
}
const lr = (e) => e === "_" || e === "_ctx" || e === "$stable", ar = (e) => z(e) ? e.map(tt) : [tt(e)], oa = (e, t, i) => {
  if (t._n)
    return t;
  const n = _l((...r) => ar(t(...r)), i);
  return n._c = !1, n;
}, so = (e, t, i) => {
  const n = e._ctx;
  for (const r in e) {
    if (lr(r)) continue;
    const s = e[r];
    if (G(s))
      t[r] = oa(r, s, n);
    else if (s != null) {
      const o = ar(s);
      t[r] = () => o;
    }
  }
}, oo = (e, t) => {
  const i = ar(t);
  e.slots.default = () => i;
}, lo = (e, t, i) => {
  for (const n in t)
    (i || !lr(n)) && (e[n] = t[n]);
}, la = (e, t, i) => {
  const n = e.slots = to();
  if (e.vnode.shapeFlag & 32) {
    const r = t._;
    r ? (lo(n, t, i), i && ds(n, "_", r, !0)) : so(t, n);
  } else t && oo(e, t);
}, aa = (e, t, i) => {
  const { vnode: n, slots: r } = e;
  let s = !0, o = ae;
  if (n.shapeFlag & 32) {
    const l = t._;
    l ? i && l === 1 ? s = !1 : lo(r, t, i) : (s = !t.$stable, so(t, r)), o = t;
  } else t && (oo(e, t), o = { default: 1 });
  if (s)
    for (const l in r)
      !lr(l) && o[l] == null && delete r[l];
}, Te = ha;
function ca(e) {
  return fa(e);
}
function fa(e, t) {
  const i = Ji();
  i.__VUE__ = !0;
  const {
    insert: n,
    remove: r,
    patchProp: s,
    createElement: o,
    createText: l,
    createComment: a,
    setText: f,
    setElementText: c,
    parentNode: d,
    nextSibling: v,
    setScopeId: w = rt,
    insertStaticContent: p
  } = e, b = (u, g, E, P = null, M = null, C = null, L = void 0, F = null, D = !!g.dynamicChildren) => {
    if (u === g)
      return;
    u && !Xt(u, g) && (P = Ye(u), Ce(u, M, C, !0), u = null), g.patchFlag === -2 && (D = !1, g.dynamicChildren = null), g.dynamicChildren && u && u.dynamicChildren && u.dynamicChildren.hasOnce && (g.dynamicChildren === It && (g.dynamicChildren = []), g.dynamicChildren.hasOnce = !0);
    const { type: A, ref: K, shapeFlag: m } = g;
    switch (A) {
      case ln:
        T(u, g, E, P);
        break;
      case Xe:
        y(u, g, E, P);
        break;
      case bn:
        u == null && h(g, E, P, L);
        break;
      case Ie:
        Q(
          u,
          g,
          E,
          P,
          M,
          C,
          L,
          F,
          D
        );
        break;
      default:
        m & 1 ? R(
          u,
          g,
          E,
          P,
          M,
          C,
          L,
          F,
          D
        ) : m & 6 ? oe(
          u,
          g,
          E,
          P,
          M,
          C,
          L,
          F,
          D
        ) : (m & 64 || m & 128) && A.process(
          u,
          g,
          E,
          P,
          M,
          C,
          L,
          F,
          D,
          Pe
        );
    }
    K != null && M ? li(K, u && u.ref, C, g || u, !g) : K == null && u && u.ref != null && li(u.ref, null, C, u, !0);
  }, T = (u, g, E, P) => {
    if (u == null)
      n(
        g.el = l(g.children),
        E,
        P
      );
    else {
      const M = g.el = u.el;
      g.children !== u.children && f(M, g.children);
    }
  }, y = (u, g, E, P) => {
    u == null ? n(
      g.el = a(g.children || ""),
      E,
      P
    ) : g.el = u.el;
  }, h = (u, g, E, P) => {
    [u.el, u.anchor] = p(
      u.children,
      g,
      E,
      P,
      u.el,
      u.anchor
    );
  }, x = ({ el: u, anchor: g }, E, P) => {
    let M;
    for (; u && u !== g; )
      M = v(u), n(u, E, P), u = M;
    n(g, E, P);
  }, S = ({ el: u, anchor: g }) => {
    let E;
    for (; u && u !== g; )
      E = v(u), r(u), u = E;
    r(g);
  }, R = (u, g, E, P, M, C, L, F, D) => {
    if (g.type === "svg" ? L = "svg" : g.type === "math" && (L = "mathml"), u == null)
      j(
        g,
        E,
        P,
        M,
        C,
        L,
        F,
        D
      );
    else {
      const A = u.el && u.el._isVueCE ? u.el : null;
      try {
        A && A._beginPatch(), W(
          u,
          g,
          M,
          C,
          L,
          F,
          D
        );
      } finally {
        A && A._endPatch();
      }
    }
  }, j = (u, g, E, P, M, C, L, F) => {
    let D, A;
    const { props: K, shapeFlag: m, transition: _, dirs: k } = u;
    if (D = u.el = o(
      u.type,
      C,
      K && K.is,
      K
    ), m & 8 ? c(D, u.children) : m & 16 && N(
      u.children,
      D,
      null,
      P,
      M,
      wn(u, C),
      L,
      F
    ), k && Ct(u, null, P, "created"), U(D, u, u.scopeId, L, P), K) {
      for (const B in K)
        B !== "value" && !ri(B) && s(D, B, null, K[B], C, P);
      "value" in K && s(D, "value", null, K.value, C), (A = K.onVnodeBeforeMount) && Ze(A, P, u);
    }
    k && Ct(u, null, P, "beforeMount");
    const O = ua(M, _);
    O && _.beforeEnter(D), n(D, g, E), ((A = K && K.onVnodeMounted) || O || k) && Te(() => {
      try {
        A && Ze(A, P, u), O && _.enter(D), k && Ct(u, null, P, "mounted");
      } finally {
      }
    }, M);
  }, U = (u, g, E, P, M) => {
    if (E && w(u, E), P)
      for (let C = 0; C < P.length; C++)
        w(u, P[C]);
    if (M) {
      let C = M.subTree;
      if (g === C || co(C.type) && (C.ssContent === g || C.ssFallback === g)) {
        const L = M.vnode;
        U(
          u,
          L,
          L.scopeId,
          L.slotScopeIds,
          M.parent
        );
      }
    }
  }, N = (u, g, E, P, M, C, L, F, D = 0) => {
    for (let A = D; A < u.length; A++) {
      const K = u[A] = F ? ht(u[A]) : tt(u[A]);
      b(
        null,
        K,
        g,
        E,
        P,
        M,
        C,
        L,
        F
      );
    }
  }, W = (u, g, E, P, M, C, L) => {
    const F = g.el = u.el;
    let { patchFlag: D, dynamicChildren: A, dirs: K } = g;
    D |= u.patchFlag & 16;
    const m = u.props || ae, _ = g.props || ae;
    let k;
    if (E && Pt(E, !1), (k = _.onVnodeBeforeUpdate) && Ze(k, E, g, u), K && Ct(g, u, E, "beforeUpdate"), E && Pt(E, !0), // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    A && (!u.dynamicChildren || u.dynamicChildren.length !== A.length) && (D = 0, L = !1, A = null), (m.innerHTML && _.innerHTML == null || m.textContent && _.textContent == null) && c(F, ""), A ? X(
      u.dynamicChildren,
      A,
      F,
      E,
      P,
      wn(g, M),
      C
    ) : L || te(
      u,
      g,
      F,
      null,
      E,
      P,
      wn(g, M),
      C,
      !1
    ), D > 0) {
      if (D & 16)
        q(F, m, _, E, M);
      else if (D & 2 && m.class !== _.class && s(F, "class", null, _.class, M), D & 4 && s(F, "style", m.style, _.style, M), D & 8) {
        const O = g.dynamicProps;
        for (let B = 0; B < O.length; B++) {
          const H = O[B], V = m[H], J = _[H];
          (J !== V || H === "value") && s(F, H, V, J, M, E);
        }
      }
      D & 1 && u.children !== g.children && c(F, g.children);
    } else !L && A == null && q(F, m, _, E, M);
    ((k = _.onVnodeUpdated) || K) && Te(() => {
      k && Ze(k, E, g, u), K && Ct(g, u, E, "updated");
    }, P);
  }, X = (u, g, E, P, M, C, L) => {
    for (let F = 0; F < g.length; F++) {
      const D = u[F], A = g[F], K = D.el || Kn(D), m = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        K && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (D.type === Ie || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !Xt(D, A) || // - In the case of a component, it could contain anything.
        D.shapeFlag & 198) ? d(K) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          E
        )
      );
      b(
        D,
        A,
        m,
        null,
        P,
        M,
        C,
        L,
        !0
      );
    }
  }, q = (u, g, E, P, M) => {
    if (g !== E) {
      if (g !== ae)
        for (const C in g)
          !ri(C) && !(C in E) && s(
            u,
            C,
            g[C],
            null,
            M,
            P
          );
      for (const C in E) {
        if (ri(C)) continue;
        const L = E[C], F = g[C];
        L !== F && C !== "value" && s(u, C, F, L, M, P);
      }
      "value" in E && s(u, "value", g.value, E.value, M);
    }
  }, Q = (u, g, E, P, M, C, L, F, D) => {
    const A = g.el = u ? u.el : l(""), K = g.anchor = u ? u.anchor : l("");
    let { patchFlag: m, dynamicChildren: _, slotScopeIds: k } = g;
    k && (F = F ? F.concat(k) : k), u == null ? (n(A, E, P), n(K, E, P), N(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      g.children || [],
      E,
      K,
      M,
      C,
      L,
      F,
      D
    )) : m > 0 && m & 64 && _ && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    u.dynamicChildren && u.dynamicChildren.length === _.length ? (X(
      u.dynamicChildren,
      _,
      E,
      M,
      C,
      L,
      F
    ), // #2080 if the stable fragment has a key, it's a <template v-for> that may
    //  get moved around. Make sure all root level vnodes inherit el.
    // #2134 or if it's a component root, it may also get moved around
    // as the component is being moved.
    (g.key != null || M && g === M.subTree) && cr(
      u,
      g,
      !0
      /* shallow */
    )) : te(
      u,
      g,
      E,
      K,
      M,
      C,
      L,
      F,
      D
    );
  }, oe = (u, g, E, P, M, C, L, F, D) => {
    g.slotScopeIds = F, u == null ? g.shapeFlag & 512 ? M.ctx.activate(
      g,
      E,
      P,
      L,
      D
    ) : I(
      g,
      E,
      P,
      M,
      C,
      L,
      D
    ) : se(u, g, D);
  }, I = (u, g, E, P, M, C, L) => {
    const F = u.component = va(
      u,
      P,
      M
    );
    if (or(u) && (F.ctx.renderer = Pe), ba(F, !1, L), F.asyncDep) {
      if (M && M.registerDep(
        F,
        Y,
        L,
        C
      ), !u.el) {
        const D = F.subTree = fe(Xe);
        y(null, D, g, E), u.placeholder = D.el;
      }
    } else
      Y(
        F,
        u,
        g,
        E,
        M,
        C,
        L
      );
  }, se = (u, g, E) => {
    const P = g.component = u.component;
    if (ta(u, g, E))
      if (P.asyncDep && !P.asyncResolved) {
        g.el = u.el, g.placeholder = u.placeholder, Z(P, g, E);
        return;
      } else
        P.next = g, P.update();
    else
      g.el = u.el, g.placeholder = u.placeholder, P.vnode = g;
  }, Y = (u, g, E, P, M, C, L) => {
    const F = () => {
      if (u.isMounted) {
        let { next: m, bu: _, u: k, parent: O, vnode: B } = u;
        {
          const $ = ao(u);
          if ($) {
            m && (m.el = B.el, Z(u, m, L)), $.asyncDep.then(() => {
              Te(() => {
                u.isUnmounted || A();
              }, M);
            });
            return;
          }
        }
        let H = m, V;
        Pt(u, !1), m ? (m.el = B.el, Z(u, m, L)) : m = B, _ && un(_), (V = m.props && m.props.onVnodeBeforeUpdate) && Ze(V, O, m, B), Pt(u, !0);
        const J = Fr(u), ie = u.subTree;
        u.subTree = J, b(
          ie,
          J,
          // parent may have changed if it's in a teleport
          d(ie.el),
          // anchor may have changed if it's in a fragment
          Ye(ie),
          u,
          M,
          C
        ), m.el = J.el, H === null && ia(u, J.el), k && Te(k, M), (V = m.props && m.props.onVnodeUpdated) && Te(
          () => Ze(V, O, m, B),
          M
        );
      } else {
        let m;
        const { el: _, props: k } = g, { bm: O, m: B, parent: H, root: V, type: J } = u, ie = ai(g);
        Pt(u, !1), O && un(O), !ie && (m = k && k.onVnodeBeforeMount) && Ze(m, H, g), Pt(u, !0);
        {
          V.ce && V.ce._hasShadowRoot() && V.ce._injectChildStyle(
            J,
            u.parent ? u.parent.type : void 0
          );
          const $ = u.subTree = Fr(u);
          b(
            null,
            $,
            E,
            P,
            u,
            M,
            C
          ), g.el = $.el;
        }
        if (B && Te(B, M), !ie && (m = k && k.onVnodeMounted)) {
          const $ = g;
          Te(
            () => Ze(m, H, $),
            M
          );
        }
        (g.shapeFlag & 256 || H && ai(H.vnode) && H.vnode.shapeFlag & 256) && u.a && Te(u.a, M), u.isMounted = !0, g = E = P = null;
      }
    };
    u.scope.on();
    const D = u.effect = new ms(F);
    u.scope.off();
    const A = u.update = D.run.bind(D), K = u.job = D.runIfDirty.bind(D);
    K.i = u, K.id = u.uid, D.scheduler = () => sr(K), Pt(u, !0), A();
  }, Z = (u, g, E) => {
    g.component = u;
    const P = u.vnode.props;
    u.vnode = g, u.next = null, ra(u, g.props, P, E), aa(u, g.children, E), ot(), Ls(u), lt();
  }, te = (u, g, E, P, M, C, L, F, D = !1) => {
    const A = u && u.children, K = u ? u.shapeFlag : 0, m = g.children, { patchFlag: _, shapeFlag: k } = g;
    if (_ > 0) {
      if (_ & 128) {
        Nt(
          A,
          m,
          E,
          P,
          M,
          C,
          L,
          F,
          D
        );
        return;
      } else if (_ & 256) {
        Je(
          A,
          m,
          E,
          P,
          M,
          C,
          L,
          F,
          D
        );
        return;
      }
    }
    k & 8 ? (K & 16 && ct(A, M, C), m !== A && c(E, m)) : K & 16 ? k & 16 ? Nt(
      A,
      m,
      E,
      P,
      M,
      C,
      L,
      F,
      D
    ) : ct(A, M, C, !0) : (K & 8 && c(E, ""), k & 16 && N(
      m,
      E,
      P,
      M,
      C,
      L,
      F,
      D
    ));
  }, Je = (u, g, E, P, M, C, L, F, D) => {
    u = u || It, g = g || It;
    const A = u.length, K = g.length, m = Math.min(A, K);
    let _;
    for (_ = 0; _ < m; _++) {
      const k = g[_] = D ? ht(g[_]) : tt(g[_]);
      b(
        u[_],
        k,
        E,
        null,
        M,
        C,
        L,
        F,
        D
      );
    }
    A > K ? ct(
      u,
      M,
      C,
      !0,
      !1,
      m
    ) : N(
      g,
      E,
      P,
      M,
      C,
      L,
      F,
      D,
      m
    );
  }, Nt = (u, g, E, P, M, C, L, F, D) => {
    let A = 0;
    const K = g.length;
    let m = u.length - 1, _ = K - 1;
    for (; A <= m && A <= _; ) {
      const k = u[A], O = g[A] = D ? ht(g[A]) : tt(g[A]);
      if (Xt(k, O))
        b(
          k,
          O,
          E,
          null,
          M,
          C,
          L,
          F,
          D
        );
      else
        break;
      A++;
    }
    for (; A <= m && A <= _; ) {
      const k = u[m], O = g[_] = D ? ht(g[_]) : tt(g[_]);
      if (Xt(k, O))
        b(
          k,
          O,
          E,
          null,
          M,
          C,
          L,
          F,
          D
        );
      else
        break;
      m--, _--;
    }
    if (A > m) {
      if (A <= _) {
        const k = _ + 1, O = k < K ? g[k].el : P;
        for (; A <= _; )
          b(
            null,
            g[A] = D ? ht(g[A]) : tt(g[A]),
            E,
            O,
            M,
            C,
            L,
            F,
            D
          ), A++;
      }
    } else if (A > _)
      for (; A <= m; )
        Ce(u[A], M, C, !0), A++;
    else {
      const k = A, O = A, B = /* @__PURE__ */ new Map();
      for (A = O; A <= _; A++) {
        const ce = g[A] = D ? ht(g[A]) : tt(g[A]);
        ce.key != null && B.set(ce.key, A);
      }
      let H, V = 0;
      const J = _ - O + 1;
      let ie = !1, $ = 0;
      const de = new Array(J);
      for (A = 0; A < J; A++) de[A] = 0;
      for (A = k; A <= m; A++) {
        const ce = u[A];
        if (V >= J) {
          Ce(ce, M, C, !0);
          continue;
        }
        let ge;
        if (ce.key != null)
          ge = B.get(ce.key);
        else
          for (H = O; H <= _; H++)
            if (de[H - O] === 0 && Xt(ce, g[H])) {
              ge = H;
              break;
            }
        ge === void 0 ? Ce(ce, M, C, !0) : (de[ge - O] = A + 1, ge >= $ ? $ = ge : ie = !0, b(
          ce,
          g[ge],
          E,
          null,
          M,
          C,
          L,
          F,
          D
        ), V++);
      }
      const ke = ie ? da(de) : It;
      for (H = ke.length - 1, A = J - 1; A >= 0; A--) {
        const ce = O + A, ge = g[ce], ft = g[ce + 1], Gt = ce + 1 < K ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          ft.el || Kn(ft)
        ) : P;
        de[A] === 0 ? b(
          null,
          ge,
          E,
          Gt,
          M,
          C,
          L,
          F,
          D
        ) : ie && (H < 0 || A !== ke[H] ? Ke(ge, E, Gt, 2) : H--);
      }
    }
  }, Ke = (u, g, E, P, M = null) => {
    const { el: C, type: L, transition: F, children: D, shapeFlag: A } = u;
    if (A & 6) {
      Ke(u.component.subTree, g, E, P);
      return;
    }
    if (A & 128) {
      u.suspense.move(g, E, P);
      return;
    }
    if (A & 64) {
      L.move(u, g, E, Pe);
      return;
    }
    if (L === Ie) {
      n(C, g, E);
      for (let m = 0; m < D.length; m++)
        Ke(D[m], g, E, P);
      n(u.anchor, g, E);
      return;
    }
    if (L === bn) {
      x(u, g, E);
      return;
    }
    if (P !== 2 && A & 1 && F)
      if (P === 0)
        F.persisted && !C[yn] ? n(C, g, E) : (F.beforeEnter(C), n(C, g, E), Te(() => F.enter(C), M));
      else {
        const { leave: m, delayLeave: _, afterLeave: k } = F, O = () => {
          u.ctx.isUnmounted ? r(C) : n(C, g, E);
        }, B = () => {
          const H = C._isLeaving || !!C[yn];
          C._isLeaving && C[yn](
            !0
            /* cancelled */
          ), F.persisted && !H ? O() : m(C, () => {
            O(), k && k();
          });
        };
        _ ? _(C, O, B) : B();
      }
    else
      n(C, g, E);
  }, Ce = (u, g, E, P = !1, M = !1) => {
    const {
      type: C,
      props: L,
      ref: F,
      children: D,
      dynamicChildren: A,
      shapeFlag: K,
      patchFlag: m,
      dirs: _,
      cacheIndex: k,
      memo: O
    } = u;
    if ((m === -2 || A && A.hasOnce) && (M = !1), F != null && (ot(), li(F, null, E, u, !0), lt()), k != null && (!u.ctx || u.ctx === g) && (g.renderCache[k] = void 0), K & 256) {
      g.ctx.deactivate(u);
      return;
    }
    const B = K & 1 && _, H = !ai(u);
    let V;
    if (H && (V = L && L.onVnodeBeforeUnmount) && Ze(V, g, u), K & 6)
      Ei(u.component, E, P);
    else {
      if (K & 128) {
        u.suspense.unmount(E, P);
        return;
      }
      B && Ct(u, null, g, "beforeUnmount"), K & 64 ? u.type.remove(
        u,
        g,
        E,
        Pe,
        P
      ) : A && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !A.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (C !== Ie || m > 0 && m & 64) ? ct(
        A,
        g,
        E,
        !1,
        !0
      ) : (C === Ie && m & 384 || !M && K & 16) && ct(D, g, E), P && Vt(u);
    }
    const J = O != null && k == null;
    (H && (V = L && L.onVnodeUnmounted) || B || J) && Te(() => {
      V && Ze(V, g, u), B && Ct(u, null, g, "unmounted"), J && (u.el = null);
    }, E);
  }, Vt = (u) => {
    const { type: g, el: E, anchor: P, transition: M } = u, C = g === Ie;
    if (C && !M) {
      Bt(E, P);
      return;
    }
    if (g === bn) {
      S(u), M && !M.persisted && M.afterLeave && M.afterLeave();
      return;
    }
    const L = C ? Fn(u) : u, F = () => {
      C ? d(E) && Bt(E, P) : r(E), M && !M.persisted && M.afterLeave && M.afterLeave();
    };
    if (L && L.shapeFlag & 1 && M && !M.persisted) {
      const { leave: D, delayLeave: A } = M, K = L.el, m = () => D(K, F);
      A ? A(K, F, m) : m();
    } else
      F();
  }, Bt = (u, g) => {
    let E;
    for (; u !== g; )
      E = v(u), r(u), u = E;
    r(g);
  }, Ei = (u, g, E) => {
    const { bum: P, scope: M, job: C, subTree: L, um: F, m: D, a: A } = u;
    Br(D), Br(A), P && un(P), M.stop(), C ? (C.flags |= 8, Ce(L, u, g, E)) : u.vnode.el && L && (L.transition = u.vnode.transition, Ce(L, u, g, E)), F && Te(F, g), Te(() => {
      u.isUnmounted = !0;
    }, g);
  }, ct = (u, g, E, P = !1, M = !1, C = 0) => {
    for (let L = C; L < u.length; L++)
      Ce(u[L], g, E, P, M);
  }, Ye = (u) => {
    if (u.shapeFlag & 6)
      return Ye(u.component.subTree);
    if (u.shapeFlag & 128)
      return u.suspense.next();
    const g = v(u.anchor || u.el), E = g && g[Ks];
    return E ? v(E) : g;
  }, At = (u, g, E) => {
    const P = u && g._vnode ? void 0 : u && u.component ? u.component.uid : ya();
    bl(() => {
      u == null ? g._vnode && Ce(g._vnode, null, null, !0) : b(
        g._vnode || null,
        u,
        g,
        null,
        null,
        null,
        E
      ), g._vnode = u;
    }, P);
  }, Pe = {
    p: b,
    um: Ce,
    m: Ke,
    r: Vt,
    mt: I,
    mc: N,
    pc: te,
    pbc: X,
    n: Ye,
    o: e
  };
  return {
    render: At,
    hydrate: void 0,
    createApp: Xl(At)
  };
}
function wn({ type: e, props: t }, i) {
  return i === "svg" && e === "foreignObject" || i === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : i;
}
function Pt({ effect: e, job: t }, i) {
  i ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function ua(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function cr(e, t, i = !1) {
  const n = e.children, r = t.children;
  if (z(n) && z(r))
    for (let s = 0; s < n.length; s++) {
      const o = n[s];
      let l = r[s];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = r[s] = ht(r[s]), l.el = o.el), !i && l.patchFlag !== -2 && cr(o, l)), l.type === ln && (l.patchFlag === -1 && (l = r[s] = ht(l)), l.el = o.el), l.type === Xe && !l.el && (l.el = o.el);
    }
}
function da(e) {
  const t = e.slice(), i = [0];
  let n, r, s, o, l;
  const a = e.length;
  for (n = 0; n < a; n++) {
    const f = e[n];
    if (f !== 0) {
      if (r = i[i.length - 1], e[r] < f) {
        t[n] = r, i.push(n);
        continue;
      }
      for (s = 0, o = i.length - 1; s < o; )
        l = s + o >> 1, e[i[l]] < f ? s = l + 1 : o = l;
      f < e[i[s]] && (s > 0 && (t[n] = i[s - 1]), i[s] = n);
    }
  }
  for (s = i.length, o = i[s - 1]; s-- > 0; )
    i[s] = o, o = t[o];
  return i;
}
function ao(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : ao(t);
}
function Br(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function Kn(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  return t ? Kn(t.subTree) : null;
}
const co = (e) => e.__isSuspense;
function ha(e, t) {
  t && t.pendingBranch ? z(e) ? t.effects.push(...e) : t.effects.push(e) : wl(e);
}
const Ie = /* @__PURE__ */ Symbol.for("v-fgt"), ln = /* @__PURE__ */ Symbol.for("v-txt"), Xe = /* @__PURE__ */ Symbol.for("v-cmt"), bn = /* @__PURE__ */ Symbol.for("v-stc"), Ut = [];
let De = null;
function pe(e = !1) {
  Ut.push(De = e ? null : []);
}
function fo() {
  Ut.pop(), De = Ut[Ut.length - 1] || null;
}
let gi = 1;
function Hi(e, t = !1) {
  gi += e, e < 0 && De && t && (De.hasOnce = !0);
}
function uo(e) {
  return e.dynamicChildren = gi > 0 ? De || It : null, fo(), gi > 0 && De && De.push(e), e;
}
function ve(e, t, i, n, r, s) {
  return uo(
    ye(
      e,
      t,
      i,
      n,
      r,
      s,
      !0
    )
  );
}
function fr(e, t, i, n, r) {
  return uo(
    fe(
      e,
      t,
      i,
      n,
      r,
      !0
    )
  );
}
function mi(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Xt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const ho = ({ key: e }) => e ?? null, Ii = ({
  ref: e,
  ref_key: t,
  ref_for: i
}) => (typeof e == "number" && (e = "" + e), e != null ? ue(e) || /* @__PURE__ */ xe(e) || G(e) ? { i: nt, r: e, k: t, f: !!i } : e : null);
function ye(e, t = null, i = null, n = 0, r = null, s = e === Ie ? 0 : 1, o = !1, l = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && ho(t),
    ref: t && Ii(t),
    scopeId: Ns,
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
    shapeFlag: s,
    patchFlag: n,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: nt
  };
  return l ? (Wi(a, i), s & 128 && e.normalize(a)) : i && (a.shapeFlag |= ue(i) ? 8 : 16), gi > 0 && // avoid a block node from tracking itself
  !o && // has current parent block
  De && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || s & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && De.push(a), a;
}
const fe = pa;
function pa(e, t = null, i = null, n = 0, r = null, s = !1) {
  if ((!e || e === Kl) && (e = Xe), mi(e)) {
    const l = Wt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return i && Wi(l, i), gi > 0 && !s && De && (l.shapeFlag & 6 ? De[De.indexOf(e)] = l : De.push(l)), l.patchFlag = -2, l;
  }
  if (Ea(e) && (e = e.__vccOpts), t) {
    t = ga(t);
    let { class: l, style: a } = t;
    l && !ue(l) && (t.class = _i(l)), re(a) && (/* @__PURE__ */ rr(a) && !z(a) && (a = Se({}, a)), t.style = Yi(a));
  }
  const o = ue(e) ? 1 : co(e) ? 128 : nn(e) ? 64 : re(e) ? 4 : G(e) ? 2 : 0;
  return ye(
    e,
    t,
    i,
    n,
    r,
    o,
    s,
    !0
  );
}
function ga(e) {
  return e ? /* @__PURE__ */ rr(e) || io(e) ? Se({}, e) : e : null;
}
function Wt(e, t, i = !1, n = !1) {
  const { props: r, ref: s, patchFlag: o, children: l, transition: a } = e, f = t ? go(r || {}, t) : r, c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: f,
    key: f && ho(f),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      i && s ? z(s) ? s.concat(Ii(t)) : [s, Ii(t)] : Ii(t)
    ) : s,
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
    patchFlag: t && e.type !== Ie ? o === -1 ? 16 : o | 16 : o,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: a,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Wt(e.ssContent),
    ssFallback: e.ssFallback && Wt(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
    cacheIndex: e.cacheIndex
  };
  return a && n && ji(
    c,
    a.clone(c)
  ), c;
}
function po(e = " ", t = 0) {
  return fe(ln, null, e, t);
}
function fi(e = "", t = !1) {
  return t ? (pe(), fr(Xe, null, e)) : fe(Xe, null, e);
}
function tt(e) {
  return e == null || typeof e == "boolean" ? fe(Xe) : z(e) ? fe(
    Ie,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : mi(e) ? ht(e) : fe(ln, null, String(e));
}
function ht(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Wt(e);
}
function Wi(e, t) {
  let i = 0;
  const { shapeFlag: n } = e;
  if (t == null)
    t = null;
  else if (z(t))
    i = 16;
  else if (typeof t == "object")
    if (n & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), Wi(e, r()), r._c && (r._d = !0));
      return;
    } else {
      i = 32;
      const r = t._;
      !r && !io(t) ? t._ctx = nt : r === 3 && nt && (nt.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (G(t)) {
    if (n & 65) {
      Wi(e, { default: t });
      return;
    }
    t = { default: t, _ctx: nt }, i = 32;
  } else
    t = String(t), n & 64 ? (i = 16, t = [po(t)]) : i = 8;
  e.children = t, e.shapeFlag |= i;
}
function go(...e) {
  const t = {};
  for (let i = 0; i < e.length; i++) {
    const n = e[i];
    for (const r in n)
      if (r === "class")
        t.class !== n.class && (t.class = _i([t.class, n.class]));
      else if (r === "style")
        t.style = Yi([t.style, n.style]);
      else if (Gi(r)) {
        const s = t[r], o = n[r];
        o && s !== o && !(z(s) && s.includes(o)) ? t[r] = s ? [].concat(s, o) : o : o == null && s == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !qi(r) && (t[r] = o);
      } else r !== "" && (t[r] = n[r]);
  }
  return t;
}
function Ze(e, t, i, n = null) {
  qe(e, t, 7, [
    i,
    n
  ]);
}
const ma = Js();
let mo = 0;
function ya() {
  return mo;
}
function va(e, t, i) {
  const n = e.type, r = (t ? t.appContext : e.appContext) || ma, s = {
    uid: mo++,
    vnode: e,
    type: n,
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
    scope: new zo(
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
    propsOptions: ro(n, r),
    emitsOptions: Ys(n, r),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: ae,
    // inheritAttrs
    inheritAttrs: n.inheritAttrs,
    // state
    ctx: ae,
    data: ae,
    props: ae,
    attrs: ae,
    slots: ae,
    refs: ae,
    setupState: ae,
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
  return s.ctx = { _: s }, s.root = t ? t.root : s, s.emit = Yl.bind(null, s), e.ce && e.ce(s), s;
}
let Ae = null;
const wa = () => Ae || nt;
let zi, yi;
{
  const e = Ji(), t = (i, n) => {
    let r;
    return (r = e[i]) || (r = e[i] = []), r.push(n), (s) => {
      r.length > 1 ? r.forEach((o) => o(s)) : r[0](s);
    };
  };
  zi = t(
    "__VUE_INSTANCE_SETTERS__",
    (i) => Ae = i
  ), yi = t(
    "__VUE_SSR_SETTERS__",
    (i) => vi = i
  );
}
const Si = (e) => {
  const t = Ae;
  return zi(e), e.scope.on(), () => {
    e.scope.off(), zi(t);
  };
}, jr = () => {
  Ae && Ae.scope.off(), zi(null);
};
function yo(e) {
  return e.vnode.shapeFlag & 4;
}
let vi = !1;
function ba(e, t = !1, i = !1) {
  t && yi(t);
  const { props: n, children: r } = e.vnode, s = yo(e);
  na(e, n, s, t), la(e, r, i || t);
  const o = s ? _a(e, t) : void 0;
  return t && yi(!1), o;
}
function _a(e, t) {
  const i = e.type;
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, $l);
  const { setup: n } = i;
  if (n) {
    ot();
    const r = e.setupContext = n.length > 1 ? Sa(e) : null, s = Si(e), o = xi(
      n,
      e,
      0,
      [
        e.props,
        r
      ]
    ), l = as(o);
    if (lt(), s(), (l || e.sp) && !ai(e) && Hs(e), l) {
      if (o.then(jr, jr), t)
        return o.then((a) => {
          yi(!0);
          try {
            Kr(e, a, t);
          } finally {
            yi(!1);
          }
        }).catch((a) => {
          en(a, e, 0);
        });
      e.asyncDep = o;
    } else
      Kr(e, o);
  } else
    vo(e);
}
function Kr(e, t, i) {
  G(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : re(t) && (e.setupState = Os(t)), vo(e);
}
function vo(e, t, i) {
  const n = e.type;
  e.render || (e.render = n.render || rt);
  {
    const r = Si(e);
    ot();
    try {
      Hl(e);
    } finally {
      lt(), r();
    }
  }
}
const xa = {
  get(e, t) {
    return _e(e, "get", ""), e[t];
  }
};
function Sa(e) {
  const t = (i) => {
    e.exposed = i || {};
  };
  return {
    attrs: new Proxy(e.attrs, xa),
    slots: e.slots,
    emit: e.emit,
    expose: t
  };
}
function ur(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Os(cl(e.exposed)), {
    get(t, i) {
      if (i in t)
        return t[i];
      if (i in ci)
        return ci[i](e);
    },
    has(t, i) {
      return i in t || i in ci;
    }
  })) : e.proxy;
}
function Ea(e) {
  return G(e) && "__vccOpts" in e;
}
const Dt = (e, t) => /* @__PURE__ */ pl(e, t, vi);
function Ta(e, t, i) {
  try {
    Hi(-1);
    const n = arguments.length;
    return n === 2 ? re(t) && !z(t) ? mi(t) ? fe(e, null, [t]) : fe(e, t) : fe(e, null, t) : (n > 3 ? i = Array.prototype.slice.call(arguments, 2) : n === 3 && mi(i) && (i = [i]), fe(e, t, i));
  } finally {
    Hi(1);
  }
}
const Ma = "3.5.44";
/**
* @vue/runtime-dom v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let $n;
const $r = typeof window < "u" && window.trustedTypes;
if ($r)
  try {
    $n = /* @__PURE__ */ $r.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch {
  }
const wo = $n ? (e) => $n.createHTML(e) : (e) => e, Aa = "http://www.w3.org/2000/svg", Ra = "http://www.w3.org/1998/Math/MathML", dt = typeof document < "u" ? document : null, Hr = dt && /* @__PURE__ */ dt.createElement("template"), Ca = {
  insert: (e, t, i) => {
    t.insertBefore(e, i || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, i, n) => {
    const r = t === "svg" ? dt.createElementNS(Aa, e) : t === "mathml" ? dt.createElementNS(Ra, e) : i ? dt.createElement(e, { is: i }) : dt.createElement(e);
    return e === "select" && n && n.multiple != null && r.setAttribute("multiple", n.multiple), r;
  },
  createText: (e) => dt.createTextNode(e),
  createComment: (e) => dt.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => dt.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, i, n, r, s) {
    const o = i ? i.previousSibling : t.lastChild;
    if (r && (r === s || r.nextSibling))
      for (; t.insertBefore(r.cloneNode(!0), i), !(r === s || !(r = r.nextSibling)); )
        ;
    else {
      Hr.innerHTML = wo(
        n === "svg" ? `<svg>${e}</svg>` : n === "mathml" ? `<math>${e}</math>` : e
      );
      const l = Hr.content;
      if (n === "svg" || n === "mathml") {
        const a = l.firstChild;
        for (; a.firstChild; )
          l.appendChild(a.firstChild);
        l.removeChild(a);
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
}, Pa = /* @__PURE__ */ Symbol("_vtc");
function ka(e, t, i) {
  const n = e[Pa];
  n && (t = (t ? [t, ...n] : [...n]).join(" ")), t == null ? e.removeAttribute("class") : i ? e.setAttribute("class", t) : e.className = t;
}
const Wr = /* @__PURE__ */ Symbol("_vod"), Oa = /* @__PURE__ */ Symbol("_vsh"), Ia = /* @__PURE__ */ Symbol(""), Da = /(?:^|;)\s*display\s*:/;
function La(e, t, i) {
  const n = e.style, r = ue(i);
  let s = !1;
  if (i && !r) {
    if (t)
      if (ue(t))
        for (const o of t.split(";")) {
          const l = o.slice(0, o.indexOf(":")).trim();
          i[l] == null && ei(n, l, "");
        }
      else
        for (const o in t)
          i[o] == null && ei(n, o, "");
    for (const o in i) {
      o === "display" && (s = !0);
      const l = i[o];
      l != null ? Ua(
        e,
        o,
        !ue(t) && t ? t[o] : void 0,
        l
      ) || ei(n, o, l) : ei(n, o, "");
    }
  } else if (r) {
    if (t !== i) {
      const o = n[Ia];
      o && (i += ";" + o), n.cssText = i, s = Da.test(i);
    }
  } else t && e.removeAttribute("style");
  Wr in e && ((!r || t !== i) && (e[Wr] = s ? n.display : ""), e[Oa] && (n.display = "none"));
}
const Ci = /\s*!important$/;
function ei(e, t, i) {
  if (z(i))
    i.forEach((n) => ei(e, t, n));
  else if (i == null && (i = ""), t.startsWith("--"))
    Ci.test(i) ? e.setProperty(t, i.replace(Ci, ""), "important") : e.setProperty(t, i);
  else {
    const n = Fa(e, t);
    Ci.test(i) ? e.setProperty(
      Mt(n),
      i.replace(Ci, ""),
      "important"
    ) : e[n] = i;
  }
}
const zr = ["Webkit", "Moz", "ms"], _n = {};
function Fa(e, t) {
  const i = _n[t];
  if (i)
    return i;
  let n = Ve(t);
  if (n !== "filter" && n in e)
    return _n[t] = n;
  n = us(n);
  for (let r = 0; r < zr.length; r++) {
    const s = zr[r] + n;
    if (s in e)
      return _n[t] = s;
  }
  return t;
}
function Ua(e, t, i, n) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && ue(n) && i === n;
}
const Vr = "http://www.w3.org/1999/xlink";
function Gr(e, t, i, n, r, s = $o(t)) {
  n && t.startsWith("xlink:") ? i == null ? e.removeAttributeNS(Vr, t.slice(6, t.length)) : e.setAttributeNS(Vr, t, i) : i == null || s && !hs(i) ? e.removeAttribute(t) : e.setAttribute(
    t,
    s ? "" : st(i) ? String(i) : i
  );
}
function qr(e, t, i, n, r) {
  if (t === "innerHTML" || t === "textContent") {
    i != null && (e[t] = t === "innerHTML" ? wo(i) : i);
    return;
  }
  const s = e.tagName;
  if (t === "value" && s !== "PROGRESS" && // custom elements may use _value internally
  !s.includes("-")) {
    const l = s === "OPTION" ? e.getAttribute("value") || "" : e.value, a = i == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(i);
    (l !== a || !("_value" in e)) && (e.value = a), i == null && e.removeAttribute(t), e._value = i;
    return;
  }
  let o = !1;
  if (i === "" || i == null) {
    const l = typeof e[t];
    l === "boolean" ? i = hs(i) : i == null && l === "string" ? (i = "", o = !0) : l === "number" && (i = 0, o = !0);
  }
  try {
    e[t] = i;
  } catch {
  }
  o && e.removeAttribute(r || t);
}
function Na(e, t, i, n) {
  e.addEventListener(t, i, n);
}
function Ba(e, t, i, n) {
  e.removeEventListener(t, i, n);
}
const Xr = /* @__PURE__ */ Symbol("_vei");
function ja(e, t, i, n, r = null) {
  const s = e[Xr] || (e[Xr] = {}), o = s[t];
  if (n && o)
    o.value = n;
  else {
    const [l, a] = Ha(t);
    if (n) {
      const f = s[t] = Va(
        n,
        r
      );
      Na(e, l, f, a);
    } else o && (Ba(e, l, o, a), s[t] = void 0);
  }
}
const Ka = /(Once|Passive|Capture)$/, $a = /^on:?(?:Once|Passive|Capture)$/;
function Ha(e) {
  let t, i;
  for (; (i = e.match(Ka)) && !$a.test(e); )
    t || (t = {}), e = e.slice(0, e.length - i[1].length), t[i[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : Mt(e.slice(2)), t];
}
let xn = 0;
const Wa = /* @__PURE__ */ Promise.resolve(), za = () => xn || (Wa.then(() => xn = 0), xn = Date.now());
function Va(e, t) {
  const i = (n) => {
    if (!n._vts)
      n._vts = Date.now();
    else if (n._vts <= i.attached)
      return;
    const r = i.value;
    if (z(r)) {
      const s = n.stopImmediatePropagation;
      n.stopImmediatePropagation = () => {
        s.call(n), n._stopped = !0;
      };
      const o = r.slice(), l = [n];
      for (let a = 0; a < o.length && !n._stopped; a++) {
        const f = o[a];
        f && qe(
          f,
          t,
          5,
          l
        );
      }
    } else
      qe(
        r,
        t,
        5,
        [n]
      );
  };
  return i.value = e, i.attached = za(), i;
}
const Jr = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Ga = (e, t, i, n, r, s) => {
  const o = r === "svg";
  t === "class" ? ka(e, n, o) : t === "style" ? La(e, i, n) : Gi(t) ? qi(t) || ja(e, t, i, n, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : qa(e, t, n, o)) ? (qr(e, t, n), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Gr(e, t, n, o, s, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (Xa(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !ue(n))) ? qr(e, Ve(t), n, s, t) : (t === "true-value" ? e._trueValue = n : t === "false-value" && (e._falseValue = n), Gr(e, t, n, o));
};
function qa(e, t, i, n) {
  if (n)
    return !!(t === "innerHTML" || t === "textContent" || t in e && Jr(t) && G(i));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE")
      return !1;
  }
  return Jr(t) && ue(i) ? !1 : t in e;
}
function Xa(e, t) {
  const i = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!i)
    return !1;
  const n = Ve(t);
  return Array.isArray(i) ? i.some((r) => Ve(r) === n) : Object.keys(i).some((r) => Ve(r) === n);
}
const Ja = ["ctrl", "shift", "alt", "meta"], Ya = {
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
  exact: (e, t) => Ja.some((i) => e[`${i}Key`] && !t.includes(i))
}, bt = (e, t) => {
  if (!e) return e;
  const i = e._withMods || (e._withMods = {}), n = t.join(".");
  return i[n] || (i[n] = ((r, ...s) => {
    for (let o = 0; o < t.length; o++) {
      const l = Ya[t[o]];
      if (l && l(r, t)) return;
    }
    return e(r, ...s);
  }));
}, Za = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
}, dr = (e, t) => {
  const i = e._withKeys || (e._withKeys = {}), n = t.join(".");
  return i[n] || (i[n] = ((r) => {
    if (!("key" in r))
      return;
    const s = Mt(r.key);
    if (t.some(
      (o) => o === s || Za[o] === s
    ))
      return e(r);
  }));
}, Qa = /* @__PURE__ */ Se({ patchProp: Ga }, Ca);
let Yr;
function ec() {
  return Yr || (Yr = ca(Qa));
}
const tc = ((...e) => {
  const t = ec().createApp(...e), { mount: i } = t;
  return t.mount = (n) => {
    const r = nc(n);
    if (!r) return;
    const s = t._component;
    !G(s) && !s.render && !s.template && (s.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
    const o = i(r, !1, ic(r));
    return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), o;
  }, t;
});
function ic(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function nc(e) {
  return ue(e) ? document.querySelector(e) : e;
}
function rc(e, t, i) {
  const n = { scene: i, at: [...t.anchor, t.size, t.rotation], w: e.w, h: e.h };
  for (const r of ["p0", "n", "e1", "e2"]) n[r] = Array.from(e[r], (s) => s === 0 ? 0 : s);
  return e.field && (n.baseAnchor = e.baseAnchor, n.baseRotation = e.baseRotation, n.reach = e.reach, n.shift = e.offset ?? [0, 0], n.turn = e.turn ?? 0), n;
}
const sc = 0.03, Ue = (e, t) => e[0] * t[0] + e[1] * t[1] + e[2] * t[2], Sn = (e, t) => e.map((i, n) => i + t[n]), oc = (e, t) => e.map((i, n) => i - t[n]), Pi = (e, t) => e.map((i) => i * t), En = (e, t) => [e[1] * t[2] - e[2] * t[1], e[2] * t[0] - e[0] * t[2], e[0] * t[1] - e[1] * t[0]], Tn = (e, t) => e.map((i) => Ue(i, t));
function lc(e, t, i, n, r, s, o = [0, 0], l = [0.5, 0.5]) {
  const a = (h, x) => Sn(e, Sn(Pi(t, (h - l[0]) * n), Pi(i, (x - l[1]) * r))), f = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([h, x]) => a(h, x)), c = 0.05 * e[2], d = [], v = (h) => {
    const x = Tn(s, h);
    return [x[0] / x[2] + o[0], x[1] / x[2] + o[1]];
  };
  f.forEach((h, x) => {
    const S = f[(x + 1) % 4];
    h[2] >= c && d.push(h), h[2] >= c != S[2] >= c && d.push(Sn(h, Pi(oc(S, h), (c - h[2]) / (S[2] - h[2]))));
  });
  const w = a(0.5, 0.5), p = a(0.5, 0), b = v(w), T = Tn(s, w), y = Tn(s, Pi(i, -1));
  return { corners: d.map(v), handles: f.map((h) => h[2] >= c ? v(h) : null), center: b, top: p[2] >= c ? v(p) : null, up: [y[0] * T[2] - T[0] * y[2], y[1] * T[2] - T[1] * y[2]] };
}
function hr(e) {
  const t = [En(e[1], e[2]), En(e[2], e[0]), En(e[0], e[1])], i = Ue(e[0], t[0]);
  return [0, 1, 2].map((n) => [0, 1, 2].map((r) => t[r][n] / i));
}
function ac(e, t) {
  const i = t.grid_w, n = t.grid_h, r = i * n;
  if (t.format !== 1 || !Number.isInteger(i) || !Number.isInteger(n) || i < 1 || n < 1 || e.byteLength !== r * 25) throw new Error("The surface data is incomplete. Run the workflow again.");
  const s = new DataView(e), o = new Float32Array(r * 3), l = new Float32Array(r * 3);
  for (let a = 0; a < r * 3; a++)
    o[a] = s.getFloat32(a * 4, !0), l[a] = s.getFloat32(r * 12 + a * 4, !0);
  return { width: i, height: n, points: o, normals: l, valid: new Uint8Array(e.slice(r * 24)), intrinsics: t.intrinsics, key: t.geometry_key ?? t.key ?? "" };
}
function cc(e) {
  const { width: t, height: i, points: n, valid: r } = e, s = new Float32Array(t * i);
  for (let o = 0; o < i; o++) for (let l = 0; l < t; l++) {
    const a = o * t + l;
    if (!r[a]) continue;
    let f = n[a * 3 + 2], c = f;
    for (let d = -1; d <= 1; d++) for (let v = -1; v <= 1; v++) {
      const w = Math.max(0, Math.min(i - 1, o + d)) * t + Math.max(0, Math.min(t - 1, l + v));
      r[w] && (f = Math.min(f, n[w * 3 + 2]), c = Math.max(c, n[w * 3 + 2]));
    }
    s[a] = (c - f) / n[a * 3 + 2];
  }
  return s;
}
function an(e, t) {
  const i = e.anchor ? t.anchor.map((r, s) => r - e.anchor[s]) : [0, 0], n = (t.rotation - (e.rotation ?? t.rotation)) * Math.PI / 180;
  return { offset: i, scale: t.size / (e.size ?? t.size), cos: Math.cos(n), sin: Math.sin(n) };
}
function bo(e, t, i) {
  const n = an(e, t), r = n.cos, s = n.sin, o = [...e.p0], l = e.e1.map((b, T) => b * r + e.e2[T] * s), a = e.e2.map((b, T) => -e.e1[T] * s + b * r), f = e.w * n.scale, c = e.h * n.scale, d = lc(o, l, a, f, c, i, n.offset, e.pivot);
  if (!e.guide) return { ...e, ...d };
  const v = e.screenAspect ?? 1, w = e.anchor ?? t.anchor, p = (b) => {
    if (!b) return null;
    const T = b[0] - w[0], y = (b[1] - w[1]) / v;
    return [w[0] + n.offset[0] + n.scale * (T * r - y * s), w[1] + n.offset[1] + n.scale * (T * s + y * r) * v];
  };
  return {
    ...e,
    ...d,
    handles: e.guide.handles.map(p),
    corners: e.guide.handles.filter(Boolean).map(p),
    center: p(e.guide.center) ?? d.center,
    top: p(e.guide.top),
    bottom: p(e.guide.bottom)
  };
}
function Mn(e, t, i, n) {
  const r = an(e, t), s = i.map((b, T) => b - r.offset[T]);
  let o, l;
  if (e.field) {
    const [b, T] = e.gridSize, [y, h, x, S] = e.fieldRect, R = s[0] * b - 0.5 - y, j = s[1] * T - 0.5 - h, U = Math.floor(R), N = Math.floor(j);
    let W = 0, X = 0, q = 0;
    for (let Q = 0; Q < 2; Q++) for (let oe = 0; oe < 2; oe++) {
      const I = U + oe, se = N + Q;
      if (I < 0 || I >= x || se < 0 || se >= S) continue;
      const Y = (se * x + I) * 4, Z = (oe ? R - U : 1 - R + U) * (Q ? j - N : 1 - j + N) * e.field[Y + 3];
      W += e.field[Y] * Z, X += e.field[Y + 1] * Z, q += Z;
    }
    if (!q) return null;
    o = W / q, l = X / q;
  } else {
    const b = hr(n).map((R) => Ue(R, [...s, 1])), T = Ue(e.n, b), y = Ue(e.n, e.p0) / T;
    if (!(y > 0)) return null;
    const h = b.map((R, j) => R * y - e.p0[j]);
    o = Ue(h, e.e1), l = Ue(h, e.e2);
    const [x, S] = e.gridSize ?? [0, 0];
    if (x && S && !e.region[Math.min(S - 1, Math.max(0, Math.floor(s[1] * S))) * x + Math.min(x - 1, Math.max(0, Math.floor(s[0] * x)))]) return null;
  }
  const a = e.offset ?? [0, 0], f = e.turn ?? 0, c = Math.cos(f), d = Math.sin(f), v = o - a[0], w = l - a[1];
  o = v * c + w * d, l = -v * d + w * c;
  const p = e.pivot ?? [0.5, 0.5];
  return [(o * r.cos + l * r.sin) / (e.w * r.scale) + p[0], (-o * r.sin + l * r.cos) / (e.h * r.scale) + p[1]];
}
function _o(e, t, i = 1) {
  if (!t.handles && t.corners.length !== 4) return null;
  const n = ([p, b]) => [e.left + p * e.width, e.top + b * e.height], r = (t.handles ?? t.corners).map((p) => p ? n(p) : null), s = r.filter(Boolean);
  if (!s.length) return null;
  const o = t.center ? n(t.center) : s.reduce((p, b) => p.map((T, y) => T + b[y] / s.length), [0, 0]), l = (p, b) => p && b ? p.map((T, y) => (T + b[y]) / 2) : null, a = t.top ? n(t.top) : t.top === null ? null : l(r[0], r[1]), f = t.bottom ? n(t.bottom) : l(r[2], r[3]), c = 10 * i, d = 24 * i, v = (p) => p && p[0] >= e.left + c && p[0] <= e.left + e.width - c && p[1] >= e.top + c && p[1] <= e.top + e.height - c;
  for (const p of [a, f, l(r[0], r[3]), l(r[1], r[2])]) {
    if (!p) continue;
    const b = p.map((h, x) => h - o[x]), T = Math.hypot(...b) || 1, y = p.map((h, x) => h + b[x] / T * d);
    if (v(p) && v(y)) return { corners: s, handles: r, top: p, rotate: y };
  }
  const w = [
    Math.max(e.left + c, Math.min(e.left + e.width - c, (f ?? o)[0])),
    Math.max(e.top + c + d, Math.min(e.top + e.height - c, (f ?? [0, e.top + e.height])[1] + d))
  ];
  return { corners: s, handles: r, top: [w[0], w[1] - d], rotate: w };
}
const Di = /* @__PURE__ */ new WeakMap(), xo = new Float32Array(1), fc = new Uint32Array(xo.buffer);
function Zr(e) {
  xo[0] = e;
  const t = fc[0], i = t >>> 16 & 32768, n = (t >>> 23 & 255) - 127 + 15, r = t & 8388607;
  return n <= 0 ? n < -10 ? i : i | ((r | 8388608) >>> 1 - n) + 4096 >>> 13 : n >= 31 ? i | 31744 : i | (n << 10) + (r + 4096 >>> 13);
}
function uc(e) {
  if (Di.has(e)) return Di.get(e);
  const t = new OffscreenCanvas(e.width, e.height), i = t.getContext("2d");
  i.drawImage(e, 0, 0);
  const n = i.getImageData(0, 0, e.width, e.height).data, r = new Uint16Array(n.length), s = [0, 0, 0];
  let o = 0, l = 0, a = 0;
  const f = Array.from({ length: 256 }, (d, v) => (v /= 255, v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  for (let d = 0; d < n.length; d += 4) {
    const v = n[d + 3] / 255, w = [f[n[d]], f[n[d + 1]], f[n[d + 2]]], p = w[0] * 0.2126 + w[1] * 0.7152 + w[2] * 0.0722;
    o += v, l += p * v, a += p * p * v;
    for (let b = 0; b < 3; b++)
      s[b] += w[b] * v, r[d + b] = Zr(w[b] * v);
    r[d + 3] = Zr(v);
  }
  const c = { data: r, stats: [...s.map((d) => d / Math.max(o, 1e-6)), Math.sqrt(Math.max(0, a / Math.max(o, 1e-6) - (l / Math.max(o, 1e-6)) ** 2))] };
  return Di.set(e, c), c;
}
function dc(e) {
  var t;
  return (t = Di.get(e)) == null ? void 0 : t.data;
}
let be = null;
const hc = `#version 300 es
uniform mat3 transform;out vec2 uv;
void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));uv=p;vec3 q=transform*vec3(p,1.);gl_Position=vec4(q.x*2.-1.,1.-q.y*2.,0.,1.);}`, pc = `#version 300 es
precision highp float;in vec2 uv;out vec4 outputColor;uniform sampler2D picture;uniform bool encode;uniform float opacity;
vec3 linearize(vec3 v){return mix(v/12.92,pow((v+.055)/1.055,vec3(2.4)),step(vec3(.04045),v));}
vec3 srgb(vec3 v){return mix(v*12.92,1.055*pow(max(v,vec3(0.)),vec3(1./2.4))-.055,step(vec3(.0031308),v));}
void main(){if(any(lessThan(uv,vec2(0.)))||any(greaterThan(uv,vec2(1.))))discard;vec4 c=texture(picture,encode?vec2(uv.x,1.-uv.y):uv);if(encode)outputColor=vec4(srgb(c.rgb),c.a);else outputColor=vec4(linearize(c.a>0.?c.rgb/c.a:vec3(0.))*c.a,c.a)*opacity;}`;
function gc() {
  const e = new OffscreenCanvas(1, 1), t = e.getContext("webgl2", { alpha: !1, premultipliedAlpha: !0, antialias: !1 });
  if (!t || !t.getExtension("EXT_color_buffer_float")) throw new Error("Linear-light compositing needs WebGL2 with floating-point color buffers. Enable hardware acceleration.");
  const i = t.createProgram();
  for (const [n, r] of [[t.VERTEX_SHADER, hc], [t.FRAGMENT_SHADER, pc]]) {
    const s = t.createShader(n);
    if (t.shaderSource(s, r), t.compileShader(s), !t.getShaderParameter(s, t.COMPILE_STATUS)) throw new Error(t.getShaderInfoLog(s));
    t.attachShader(i, s), t.deleteShader(s);
  }
  if (t.linkProgram(i), !t.getProgramParameter(i, t.LINK_STATUS)) throw new Error(t.getProgramInfoLog(i));
  return { canvas: e, gl: t, program: i, textures: /* @__PURE__ */ new Map(), target: null, framebuffer: t.createFramebuffer(), transform: t.getUniformLocation(i, "transform"), encode: t.getUniformLocation(i, "encode"), opacity: t.getUniformLocation(i, "opacity") };
}
function mc(e) {
  const { gl: t, textures: i } = be;
  if (i.has(e)) return i.get(e);
  const n = t.createTexture();
  t.bindTexture(t.TEXTURE_2D, n), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
  const r = new OffscreenCanvas(e.width, e.height);
  return r.getContext("2d").drawImage(e, 0, 0), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, r), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), i.set(e, n), n;
}
function So(e) {
  be != null && be.textures.has(e) && (be.gl.deleteTexture(be.textures.get(e)), be.textures.delete(e));
}
function yc() {
  var t;
  if (!be) return;
  for (const i of be.textures.keys()) So(i);
  const { gl: e } = be;
  e.deleteTexture(be.target), e.deleteFramebuffer(be.framebuffer), e.deleteProgram(be.program), (t = e.getExtension("WEBGL_lose_context")) == null || t.loseContext(), be = null;
}
function vc(e, t, i, n) {
  be ?? (be = gc());
  const r = be, { gl: s } = r;
  if ((r.canvas.width !== n.width || r.canvas.height !== n.height || !r.target) && (r.canvas.width = n.width, r.canvas.height = n.height, s.deleteTexture(r.target), r.target = s.createTexture(), s.bindTexture(s.TEXTURE_2D, r.target), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MIN_FILTER, s.NEAREST), s.texParameteri(s.TEXTURE_2D, s.TEXTURE_MAG_FILTER, s.NEAREST), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA16F, n.width, n.height, 0, s.RGBA, s.HALF_FLOAT, null), s.bindFramebuffer(s.FRAMEBUFFER, r.framebuffer), s.framebufferTexture2D(s.FRAMEBUFFER, s.COLOR_ATTACHMENT0, s.TEXTURE_2D, r.target, 0), s.checkFramebufferStatus(s.FRAMEBUFFER) !== s.FRAMEBUFFER_COMPLETE))
    throw new Error("The linear-light image buffer is unavailable.");
  s.useProgram(r.program), s.viewport(0, 0, n.width, n.height), s.bindFramebuffer(s.FRAMEBUFFER, r.framebuffer), s.disable(s.BLEND), s.uniform1i(r.encode, 0);
  const o = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  function l(f, c, d) {
    s.bindTexture(s.TEXTURE_2D, mc(f)), s.uniformMatrix3fv(r.transform, !1, c), s.uniform1f(r.opacity, d), s.drawArrays(s.TRIANGLES, 0, 3);
  }
  l(e.image, o, 1), s.enable(s.BLEND), s.blendFunc(s.ONE, s.ONE_MINUS_SRC_ALPHA);
  const a = n.width / n.height;
  for (const f of t) {
    const c = i.get(f.id);
    if (!f.visible || !(c != null && c.bitmap)) continue;
    const d = an(c, f), v = c.anchor ?? f.anchor, w = d.cos * d.scale, p = d.sin * d.scale, b = c.bitmapRect[0] / c.bitmapBox[0], T = c.bitmapRect[1] / c.bitmapBox[1], y = c.bitmap.width / c.bitmapBox[0], h = c.bitmap.height / c.bitmapBox[1];
    l(c.bitmap, [w * y, p * a * y, 0, -p / a * h, w * h, 0, v[0] + d.offset[0] + w * (b - v[0]) - p / a * (T - v[1]), v[1] + d.offset[1] + p * a * (b - v[0]) + w * (T - v[1]), 1], f.opacity);
  }
  return s.disable(s.BLEND), s.bindFramebuffer(s.FRAMEBUFFER, null), s.bindTexture(s.TEXTURE_2D, r.target), s.uniformMatrix3fv(r.transform, !1, o), s.uniform1i(r.encode, 1), s.drawArrays(s.TRIANGLES, 0, 3), r.canvas;
}
let he = null;
const ze = /* @__PURE__ */ new Map(), Qr = /* @__PURE__ */ new WeakMap(), es = /* @__PURE__ */ new WeakMap(), ts = /* @__PURE__ */ new WeakMap(), Eo = "#141518", Hn = "#fff";
function wc(e, [t, i]) {
  if (t < 0 || t > 1 || i < 0 || i > 1) return Hn;
  let n = ts.get(e);
  if (!n) {
    const l = Math.min(1, 128 / Math.max(e.width, e.height)), a = Math.max(1, Math.round(e.width * l)), f = Math.max(1, Math.round(e.height * l)), c = new OffscreenCanvas(a, f), d = c.getContext("2d", { willReadFrequently: !0 });
    d.drawImage(e, 0, 0, a, f);
    const v = d.getImageData(0, 0, a, f).data, w = new Float32Array(a * f);
    for (let p = 0; p < w.length; p++) w[p] = 0.2126 * v[p * 4] + 0.7152 * v[p * 4 + 1] + 0.0722 * v[p * 4 + 2];
    n = { width: a, height: f, values: w }, ts.set(e, n);
  }
  const r = Math.min(n.width - 1, Math.floor(t * n.width)), s = Math.min(n.height - 1, Math.floor(i * n.height));
  let o = 0;
  for (let l = -1; l <= 1; l++) for (let a = -1; a <= 1; a++) o += n.values[Math.max(0, Math.min(n.height - 1, s + l)) * n.width + Math.max(0, Math.min(n.width - 1, r + a))];
  return o / 9 > 140 ? Eo : Hn;
}
function is(e) {
  let t = Qr.get(e);
  return t || (t = Uint8Array.from(e, (i) => i ? 255 : 0), Qr.set(e, t)), t;
}
const bc = `#version 300 es
out vec2 uv;
void main(){ vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2)); uv=vec2(p.x,1.-p.y); gl_Position=vec4(p*2.-1.,0.,1.); }`, _c = `#version 300 es
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
  if(!soft&&((!natural&&allowed<.5)||abs(dot(n,p-p0))>${sc}*p.z))discard;
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
function xc() {
  const e = typeof document > "u" ? new OffscreenCanvas(1, 1) : document.createElement("canvas"), t = e.getContext("webgl2", { alpha: !0, premultipliedAlpha: !0, antialias: !1, preserveDrawingBuffer: !0 });
  if (!t) throw new Error("WebGL2 is unavailable. Enable hardware acceleration and reload the page.");
  t.getExtension("EXT_color_buffer_float");
  const i = t.createProgram();
  for (const [s, o] of [[t.VERTEX_SHADER, bc], [t.FRAGMENT_SHADER, _c]]) {
    const l = t.createShader(s);
    if (t.shaderSource(l, o), t.compileShader(l), !t.getShaderParameter(l, t.COMPILE_STATUS)) throw new Error(t.getShaderInfoLog(l));
    t.attachShader(i, l), t.deleteShader(l);
  }
  if (t.linkProgram(i), !t.getProgramParameter(i, t.LINK_STATUS)) throw new Error(t.getProgramInfoLog(i));
  t.useProgram(i);
  const n = /* @__PURE__ */ new Map(), r = (s) => (n.has(s) || n.set(s, t.getUniformLocation(i, s)), n.get(s));
  return e.addEventListener("webglcontextlost", (s) => {
    s.preventDefault();
  }), { canvas: e, gl: t, program: i, location: r };
}
function Le(e, t, i, n, r = 4, s = !1) {
  const { gl: o } = he;
  if (ze.has(e)) return ze.get(e);
  const l = o.getParameter(o.TEXTURE_BINDING_2D), a = o.createTexture();
  if (o.bindTexture(o.TEXTURE_2D, a), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MIN_FILTER, s ? o.LINEAR : o.NEAREST), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MAG_FILTER, s ? o.LINEAR : o.NEAREST), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_S, o.CLAMP_TO_EDGE), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_T, o.CLAMP_TO_EDGE), o.pixelStorei(o.UNPACK_ALIGNMENT, 1), r === 4 && ArrayBuffer.isView(n)) {
    const f = n instanceof Float32Array, c = n instanceof Uint16Array;
    o.texImage2D(o.TEXTURE_2D, 0, c ? o.RGBA16F : f ? o.RGBA32F : o.RGBA, t, i, 0, o.RGBA, c ? o.HALF_FLOAT : f ? o.FLOAT : o.UNSIGNED_BYTE, n);
  } else if (r === 4) {
    const f = new OffscreenCanvas(t, i);
    f.getContext("2d").drawImage(n, 0, 0);
    const c = o.getParameter(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
    o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
    try {
      o.texImage2D(o.TEXTURE_2D, 0, o.RGBA, o.RGBA, o.UNSIGNED_BYTE, f);
    } finally {
      o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL, c);
    }
  } else {
    const f = n instanceof Float32Array;
    o.texImage2D(o.TEXTURE_2D, 0, r === 3 ? o.RGB32F : f ? o.R32F : o.R8, t, i, 0, r === 3 ? o.RGB : o.RED, f ? o.FLOAT : o.UNSIGNED_BYTE, n);
  }
  return ze.set(e, a), o.bindTexture(o.TEXTURE_2D, l), a;
}
function Fe(e, t, i) {
  const { gl: n, location: r } = he;
  n.activeTexture(n.TEXTURE0 + e), n.bindTexture(n.TEXTURE_2D, i), n.uniform1i(r(t), e);
}
function Re(e) {
  So(e), ze.has(e) && (he == null || he.gl.deleteTexture(ze.get(e)), ze.delete(e));
  const t = dc(e);
  t && ze.has(t) && (he == null || he.gl.deleteTexture(ze.get(t)), ze.delete(t));
}
function Sc(e) {
  Re(e.grid.points), Re(e.grid.valid), Re(e.light), Re(e.material), Re(e.spread), Re(e.grid.normals);
  for (const t of Object.values(e.appearance ?? {})) Re(t.data);
}
function Ec() {
  var e;
  if (yc(), !!he) {
    for (const t of [...ze.keys()]) Re(t);
    he.gl.deleteProgram(he.program), (e = he.gl.getExtension("WEBGL_lose_context")) == null || e.loseContext(), he = null;
  }
}
function Vi(e, t) {
  const i = Math.min(e.width / t.image_w, e.height / t.image_h), n = Math.round(t.image_w * i), r = Math.round(t.image_h * i);
  return { left: Math.round((e.width - n) / 2), top: Math.round((e.height - r) / 2), width: n, height: r };
}
function Tc(e, t, i, n, r) {
  const s = es.get(t), o = JSON.stringify([r.width, r.height, n.opacity, n.shading, n.edge, t.lref]);
  if ((s == null ? void 0 : s.key) === o && s.source === i) return s;
  he ?? (he = xc());
  const { gl: l, location: a } = he;
  if (l.isContextLost()) throw new Error("The image display stopped. Reload the page to restore it.");
  he.canvas.width !== r.width && (he.canvas.width = r.width), he.canvas.height !== r.height && (he.canvas.height = r.height), l.viewport(0, 0, r.width, r.height), l.useProgram(he.program), l.disable(l.SCISSOR_TEST), l.clearColor(0, 0, 0, 0), l.clear(l.COLOR_BUFFER_BIT), l.enable(l.BLEND), l.blendFuncSeparate(l.SRC_ALPHA, l.ONE_MINUS_SRC_ALPHA, l.ONE, l.ONE_MINUS_SRC_ALPHA);
  const f = hr(e.grid.intrinsics);
  l.uniformMatrix3fv(a("inverseK"), !1, new Float32Array([0, 1, 2].flatMap((N) => [0, 1, 2].map((W) => f[W][N])))), l.uniform2f(a("gridSize"), e.grid.width, e.grid.height);
  const c = !!(n.natural && e.appearance);
  l.uniform1i(a("natural"), c);
  const d = c && e.appearance.clip;
  if (l.uniform1i(a("hasMatte"), !!d), d && Fe(13, "photoClip", Le(d.data, d.width, d.height, d.data, 4, !0)), c) {
    const N = uc(i), W = !ze.has(N.data);
    if (Fe(0, "picture", Le(N.data, i.width, i.height, N.data, 4, !0)), W) {
      if (l.generateMipmap(l.TEXTURE_2D), l.getError() !== l.NO_ERROR) throw new Error("Linear image filtering is unavailable. Enable hardware acceleration.");
      l.texParameteri(l.TEXTURE_2D, l.TEXTURE_MIN_FILTER, l.LINEAR_MIPMAP_LINEAR);
    }
    l.uniform4fv(a("sourceStats"), N.stats);
    for (const [X, q, Q] of [[9, "photoDetail", "detail"], [10, "photoColor", "color"], [11, "photoFinish", "finish"]]) {
      const oe = e.appearance[Q];
      Fe(X, q, Le(oe.data, oe.width, oe.height, oe.data, 4, !0));
    }
    l.uniform2f(a("photoSize"), e.meta.image_w, e.meta.image_h), l.uniform1f(a("imagePixelScale"), r.width / e.meta.image_w), Fe(12, "normals", Le(e.grid.normals, e.grid.width, e.grid.height, e.grid.normals, 3));
  } else Fe(0, "picture", Le(i, i.width, i.height, i, 4, !0));
  Fe(1, "points", Le(e.grid.points, e.grid.width, e.grid.height, e.grid.points, 3)), Fe(2, "valid", Le(e.grid.valid, e.grid.width, e.grid.height, is(e.grid.valid), 1)), Fe(4, "light", Le(e.light, e.image.width, e.image.height, e.light, 1)), l.uniform1i(a("materialized"), !!e.material), e.material && Fe(7, "appearance", Le(e.material, e.image.width, e.image.height, e.material, 4)), e.spread ?? (e.spread = cc(e.grid)), Fe(6, "spread", Le(e.spread, e.grid.width, e.grid.height, e.spread, 1));
  const [v, w] = t.gridSize ?? [e.grid.width, e.grid.height];
  l.uniform1i(a("wrapped"), !!t.field), t.field && (l.uniform4fv(a("fieldRect"), t.fieldRect), l.uniform2f(a("mapGrid"), v, w), Fe(5, "warp", Le(t.field, t.fieldRect[2], t.fieldRect[3], t.field, 4))), Fe(3, "region", Le(t.region, v, w, is(t.region), 1));
  for (const N of ["p0", "n", "e1", "e2"]) l.uniform3fv(a(N), t[N]);
  l.uniform2f(a("size"), t.w, t.h), l.uniform2fv(a("pivot"), t.pivot ?? [0.5, 0.5]), l.uniform2fv(a("fieldOffset"), t.offset ?? [0, 0]), l.uniform2f(a("fieldRotation"), Math.cos(t.turn ?? 0), Math.sin(t.turn ?? 0));
  for (const [N, W] of Object.entries({ opacity: n.opacity, edge: n.edge, shading: n.shading, lref: t.lref ?? 1 })) l.uniform1f(a(N), W);
  const p = 2 + (c ? Math.ceil(3 * e.blurMax * n.shading * r.width / e.meta.image_w) : 0), b = t.bounds, T = Math.max(0, Math.floor(b[0] * r.width) - p), y = Math.min(r.width, Math.ceil(b[2] * r.width) + p), h = Math.max(0, Math.floor(b[1] * r.height) - p), x = Math.min(r.height, Math.ceil(b[3] * r.height) + p), S = Math.max(1, y - T), R = Math.max(1, x - h);
  l.enable(l.SCISSOR_TEST), l.scissor(T, r.height - x, S, R), l.drawArrays(l.TRIANGLES, 0, 3), l.disable(l.SCISSOR_TEST);
  const j = new OffscreenCanvas(S, R);
  j.getContext("2d").drawImage(he.canvas, T, h, S, R, 0, 0, S, R);
  const U = { key: o, source: i, canvas: j, left: T, top: h };
  return es.set(t, U), U;
}
function Mc(e, t, i, n, r, s, o = !1, l = null) {
  const a = Vi(e, t.meta), f = e.getContext("2d");
  if (f.clearRect(0, 0, e.width, e.height), f.imageSmoothingEnabled = !0, f.imageSmoothingQuality = "high", f.drawImage(t.image, a.left, a.top, a.width, a.height), [...n.values()].some((v) => v.natural)) f.drawImage(vc(t, i, n, a), a.left, a.top, a.width, a.height);
  else for (const v of i) {
    const w = n.get(v.id), p = r.get(v.id);
    if (!v.visible || !w || !p) continue;
    const b = w.bitmap ? { canvas: w.bitmap, left: w.bitmapRect[0] * a.width / w.bitmapBox[0], top: w.bitmapRect[1] * a.height / w.bitmapBox[1] } : Tc(t, w, p, v, a), T = an(w, v), y = w.anchor ?? v.anchor, h = y[0] * a.width, x = y[1] * a.height;
    f.save(), f.translate(a.left + h + T.offset[0] * a.width, a.top + x + T.offset[1] * a.height), f.globalAlpha = w.bitmap ? v.opacity : 1, f.rotate(Math.atan2(T.sin, T.cos)), f.scale(T.scale, T.scale), w.bitmap ? f.drawImage(b.canvas, b.left - h, b.top - x, b.canvas.width * a.width / w.bitmapBox[0], b.canvas.height * a.height / w.bitmapBox[1]) : f.drawImage(b.canvas, b.left - h, b.top - x), f.restore();
  }
  if (o) return;
  const d = l ? ["__drop"] : Array.isArray(s) ? s : [s];
  for (const v of d) {
    const w = v === "__drop" ? l : n.get(v), p = v === "__drop" ? { anchor: w.anchor, size: w.size, rotation: w.rotation } : i.find((R) => R.id === v);
    if (!w || !p) continue;
    const b = bo(w, p, t.grid.intrinsics), T = e.width / e.getBoundingClientRect().width, y = ([R, j]) => [a.left + R * a.width, a.top + j * a.height], h = _o(a, b, T);
    if (!h) continue;
    const x = new Map([Eo, Hn].map((R) => [R, { marks: new Path2D(), border: new Path2D() }])), S = (R) => wc(t.image, [(R[0] - a.left) / a.width, (R[1] - a.top) / a.height]);
    h.handles.forEach((R, j) => {
      if (!R) return;
      const U = x.get(S(R)).marks, N = h.handles[(j + 1) % 4];
      if (N) {
        const X = Math.max(1, Math.min(128, Math.ceil(Math.hypot(N[0] - R[0], N[1] - R[1]) / (24 * T))));
        for (let q = 0; q < X; q++) {
          const Q = (I) => R.map((se, Y) => se + (N[Y] - se) * I), oe = x.get(S(Q((q + 0.5) / X))).border;
          oe.moveTo(...Q(q / X)), oe.lineTo(...Q((q + 1) / X));
        }
      }
      const W = [h.handles[(j + 3) % 4], h.handles[(j + 1) % 4]].map((X) => {
        const q = X ?? y(b.center ?? p.anchor), Q = q.map((se, Y) => se - R[Y]), oe = Math.hypot(...Q) || 1, I = 18 * T;
        return [R[0] + Q[0] / oe * I, R[1] + Q[1] / oe * I];
      });
      U.moveTo(...W[0]), U.lineTo(...R), U.lineTo(...W[1]);
    }), f.save(), f.lineJoin = "miter", f.miterLimit = 2, f.lineCap = "butt", f.globalAlpha = p.locked ? 0.2 : 0.4, f.lineWidth = T;
    for (const [R, j] of x)
      f.strokeStyle = R, f.stroke(j.border);
    f.globalAlpha = p.locked ? 0.5 : 1, f.lineWidth = 3 * T;
    for (const [R, j] of x)
      f.strokeStyle = R, f.stroke(j.marks);
    !p.locked && d.length === 1 && v !== "__drop" && (f.strokeStyle = S(h.rotate), f.lineWidth = 1.25 * T, f.beginPath(), f.moveTo(...h.top), f.lineTo(...h.rotate), f.stroke(), f.beginPath(), f.arc(...h.rotate, 4.5 * T, 0, Math.PI * 2), f.fillStyle = f.strokeStyle, f.fill()), f.restore();
  }
}
const Ac = "The sticker data is damaged.", Wn = "The sticker source must stay inside ComfyUI/input.", zn = Object.freeze({ mode: "wrap", size: 0.25, rotation: 0, opacity: 1, shading: 0.8, edge: 0.04, visible: !0, locked: !1 }), To = { size: [0.01, 4], opacity: [0, 1], shading: [0, 1], edge: [5e-3, 0.5] }, Li = (e) => e !== null && typeof e == "object" && !Array.isArray(e), me = (e = Ac) => {
  throw new Error(e);
}, We = (e) => typeof e == "number" && Number.isFinite(e) ? e : me(), An = (e) => ((!Array.isArray(e) || e.length !== 2) && me(), e.map(We));
function Rc(e) {
  if (e.pivot = An(e.pivot ?? [0.5, 0.5]).map((t) => Math.min(1, Math.max(0, t))), delete e.erase, e.pose != null) {
    (!Li(e.pose) || typeof e.pose.scene != "string" || !Array.isArray(e.pose.at) || e.pose.at.length !== 4) && me(), e.pose.at = e.pose.at.map(We);
    for (const t of ["p0", "n", "e1", "e2"]) {
      const i = e.pose[t];
      (!Array.isArray(i) || i.length !== 3) && me(), i.forEach(We);
    }
    (We(e.pose.w) <= 0 || We(e.pose.h) <= 0 || e.pose.p0[2] <= 0) && me(), e.pose.baseAnchor && (e.pose.baseAnchor = An(e.pose.baseAnchor).map((t) => Math.max(0, Math.min(1, t))), e.pose.shift = An(e.pose.shift), We(e.pose.turn), We(e.pose.baseRotation), We(e.pose.reach) <= 0 && me());
  }
}
function pr() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (e) => e.toString(16).padStart(2, "0")).join("");
}
const gr = () => `st_${pr().slice(0, 12)}`;
function Vn(e, t) {
  const [i, n] = To[e];
  return Math.min(n, Math.max(i, We(t)));
}
function Mo(e) {
  const t = ((We(e) + 180) % 360 + 360) % 360 - 180;
  return t === -180 ? 180 : t;
}
const ns = (e, t = !1) => ((typeof e != "string" || /[\0\\:]/.test(e) || e.startsWith("/") || e.split("/").some((i) => i === "." || i === "..") || t && (!e || e.includes("/"))) && me(Wn), e);
function ti(e) {
  let t;
  try {
    t = e.trim() ? JSON.parse(e) : {};
  } catch {
    me();
  }
  Li(t) || me(), "version" in t || (t.version = 1), Number.isInteger(t.version) || me(), [1, 2].includes(t.version) || me("This workflow was saved by a newer Slap Stickers. Update the node."), t.version === 2 && (t.blend = Vn("shading", t.blend ?? 1)), "stickers" in t || (t.stickers = []), Array.isArray(t.stickers) || me();
  const i = /* @__PURE__ */ new Set();
  for (const n of t.stickers) {
    Li(n) || me(), "id" in n || (n.id = gr()), (typeof n.id != "string" || !n.id || i.has(n.id)) && me(), i.add(n.id), Li(n.source) || me(Wn), ns(n.source.filename, !0), "subfolder" in n.source || (n.source.subfolder = ""), ns(n.source.subfolder), "type" in n.source || (n.source.type = "input"), n.source.type !== "input" && me(Wn), "name" in n || (n.name = n.source.filename), typeof n.name != "string" && me();
    for (const [r, s] of Object.entries(zn)) r in n || (n[r] = s);
    (!["flat", "wrap"].includes(n.mode) || typeof n.visible != "boolean" || typeof n.locked != "boolean") && me(), "anchor" in n || (n.anchor = [0.5, 0.5]), (!Array.isArray(n.anchor) || n.anchor.length !== 2) && me(), t.version === 2 && [...n.anchor, n.size, n.rotation].some((r) => typeof r == "number" && !Number.isFinite(r)) && (Object.assign(n, { anchor: [0.5, 0.5], size: zn.size, rotation: 0, pivot: [0.5, 0.5], recovered: !0 }), delete n.pose), n.anchor = n.anchor.map((r) => Math.min(1, Math.max(0, We(r))));
    for (const r of Object.keys(To)) n[r] = Vn(r, n[r]);
    n.rotation = Mo(n.rotation), t.version === 2 && Rc(n);
  }
  return t;
}
function wi(e) {
  return JSON.stringify(e, (t, i) => typeof i != "number" ? i : (Number.isFinite(i) || me(), e.version === 2 ? i : Math.round(i * 1e6) / 1e6));
}
function rs(e, t, i) {
  return { id: gr(), name: t, source: e, anchor: i, ...zn };
}
const ii = (e) => ti(JSON.stringify({ ...e, version: 2, blend: e.blend ?? 1 }));
function Cc(e, t) {
  let i = null, n = 0, r = null;
  const s = [];
  function o(y, h, x, S) {
    y.addEventListener(h, x, S), s.push(() => y.removeEventListener(h, x, S));
  }
  function l(y) {
    if (!t.entry) return null;
    const h = e.getBoundingClientRect(), x = Vi(e, t.entry.meta);
    return [((y.clientX - h.left) * e.width / h.width - x.left) / x.width, ((y.clientY - h.top) * e.height / h.height - x.top) / x.height];
  }
  function a(y) {
    for (const h of [...t.model.state.stickers].reverse()) {
      const x = t.frames.get(h.id);
      if (!h.visible || !x || h.opacity <= 0) continue;
      const S = Mn(x, h, y, t.entry.grid.intrinsics);
      if (S && S.every((R) => R >= 0 && R <= 1)) return h;
    }
    return null;
  }
  function f() {
    cancelAnimationFrame(n), n = 0, r = null;
    const y = i;
    return i = null, t.endPreview(), t.model.dragging = !1, t.model.invalid = !1, e.style.cursor = "", y && e.hasPointerCapture(y.pointer) && e.releasePointerCapture(y.pointer), t.notify(), y;
  }
  function c() {
    const y = f();
    return y ? (t.replaceState(y.snapshot), t.update().catch(t.error), !0) : !1;
  }
  function d(y, h = null) {
    r = { id: i.id, changes: y, physical: h }, n || (n = requestAnimationFrame(() => {
      n = 0;
      const x = r;
      r = null, i && x && t.previewSticker(x.id, x.changes, x.physical).catch(t.error);
    }));
  }
  function v(y) {
    const h = t.model.state.stickers.find((N) => N.id === t.model.selected), x = h && t.frames.get(h.id);
    if (!h || h.locked || !h.visible || !x) return null;
    const S = e.getBoundingClientRect(), R = e.width / S.width, j = _o(Vi(e, t.entry.meta), bo(x, h, t.entry.grid.intrinsics), R);
    if (!j) return null;
    const U = [(y.clientX - S.left) * R, (y.clientY - S.top) * e.height / S.height];
    return Math.hypot(...U.map((N, W) => N - j.rotate[W])) < 11 * R ? { st: h, frame: x, type: "rotate" } : j.corners.some((N) => Math.hypot(...U.map((W, X) => W - N[X])) < 10 * R) ? { st: h, frame: x, type: "resize" } : null;
  }
  function w(y, h) {
    const x = hr(t.entry.grid.intrinsics).map((U) => Ue(U, [...y, 1])), S = Ue(h.n, x);
    if (Math.abs(S) < 1e-12) return null;
    const R = Ue(h.n, h.p0) / S;
    if (R <= 0) return null;
    const j = x.map((U, N) => U * R - h.p0[N]);
    return [Ue(j, h.e1), Ue(j, h.e2)];
  }
  function p(y, h, x) {
    const S = Mn(h, x, y, t.entry.grid.intrinsics);
    if (S) return [(S[0] - 0.5) * h.w, (S[1] - 0.5) * h.h];
    const R = w(y, h);
    if (!R) return null;
    const [j, U] = h.offset ?? [0, 0], N = Math.cos(h.turn ?? 0), W = Math.sin(h.turn ?? 0), X = R[0] - j, q = R[1] - U, Q = h.pivot ?? [0.5, 0.5];
    return [X * N + q * W + (Q[0] - 0.5) * h.w, -X * W + q * N + (Q[1] - 0.5) * h.h];
  }
  o(e, "pointerdown", (y) => {
    var U;
    if (y.button !== 0 || !t.entry) return;
    e.focus({ preventScroll: !0 });
    const h = l(y), x = v(y), S = (x == null ? void 0 : x.st) ?? a(h);
    if (t.select((S == null ? void 0 : S.id) ?? null, y.shiftKey), !S || (y.preventDefault(), y.stopPropagation(), y.shiftKey) || !S || S.locked) return;
    const R = t.frames.get(S.id), j = p(h, R, S);
    i = {
      id: S.id,
      pointer: y.pointerId,
      type: (x == null ? void 0 : x.type) ?? "move",
      frame: R,
      size: S.size,
      rotation: S.rotation,
      startAngle: j ? Math.atan2(j[1], j[0]) : 0,
      center: ((U = R.guide) == null ? void 0 : U.center) ?? S.anchor,
      st: S,
      grip: Mn(R, S, h, t.entry.grid.intrinsics),
      start: h,
      width: R.w,
      snapshot: t.model.state,
      before: wi(t.model.state)
    }, t.beginPreview(), t.model.dragging = !0, e.setPointerCapture(y.pointerId), e.style.cursor = i.type === "move" ? "grabbing" : i.type === "resize" ? "nwse-resize" : "crosshair";
  }), o(e, "pointermove", (y) => {
    if (!i) {
      const x = t.entry && v(y);
      e.style.cursor = (x == null ? void 0 : x.type) === "resize" ? "nwse-resize" : x ? "crosshair" : "";
      return;
    }
    if (y.pointerId !== i.pointer) return;
    const h = l(y);
    if (i.type === "move") {
      if (h.every((S, R) => Math.abs(S - i.start[R]) < 1e-12)) return;
      const x = h;
      t.model.invalid = !t.validAnchor(x), e.style.cursor = t.model.invalid ? "not-allowed" : "grabbing", t.model.invalid || d({ anchor: x, pivot: i.grip, size: i.size });
    } else {
      const x = p(h, i.frame, i.st);
      if (!x) return;
      if (i.type === "resize") {
        const S = Math.max(2 * Math.abs(x[0]) / i.frame.w, 2 * Math.abs(x[1]) / i.frame.h), R = Vn("size", i.size * S), j = R / i.size;
        d({ anchor: i.center, pivot: [0.5, 0.5], size: R }, { id: i.id, width: i.width * j });
      } else {
        let S = i.rotation + (Math.atan2(x[1], x[0]) - i.startAngle) * 180 / Math.PI;
        y.shiftKey && (S = Math.round(S / 15) * 15), d({ anchor: i.center, pivot: [0.5, 0.5], rotation: Mo(S) }, { id: i.id, width: i.width });
      }
    }
    t.notify(), y.stopPropagation();
  }), o(e, "pointerup", (y) => {
    if (!i || y.pointerId !== i.pointer) return;
    const h = f();
    y.stopPropagation(), wi(t.model.state) !== h.before && t.save();
  }), o(e, "pointercancel", c), o(e, "lostpointercapture", () => {
    i && c();
  }), o(window, "blur", c), o(e, "keydown", (y) => {
    y.key === "Escape" && c() && (y.preventDefault(), y.stopPropagation());
  });
  const b = (y) => {
    var h;
    return [...((h = y.dataTransfer) == null ? void 0 : h.items) ?? []].some((x) => x.kind === "file" && x.type.startsWith("image/"));
  }, T = (y) => {
    var h;
    return [...((h = y.dataTransfer) == null ? void 0 : h.types) ?? []].some((x) => ["text/uri-list", "text/html"].includes(x));
  };
  return o(e, "dragover", (y) => {
    !b(y) && !T(y) || (y.preventDefault(), y.stopImmediatePropagation(), y.dataTransfer.dropEffect = t.entry && t.validAnchor(l(y)) ? "copy" : "none", t.entry && t.previewDrop(l(y)));
  }, !0), o(e, "dragleave", () => t.clearDrop()), o(e, "drop", (y) => {
    var U, N, W, X;
    const h = [...((U = y.dataTransfer) == null ? void 0 : U.files) ?? []].filter((q) => q.type.startsWith("image/"));
    if (!h.length && !T(y)) return;
    y.preventDefault(), y.stopImmediatePropagation();
    const x = l(y) ?? [0.5, 0.5];
    t.clearDrop();
    const S = (N = y.dataTransfer) == null ? void 0 : N.getData("text/html"), R = (W = y.dataTransfer) == null ? void 0 : W.getData("text/uri-list"), j = S ? (X = new DOMParser().parseFromString(S, "text/html").querySelector("img")) == null ? void 0 : X.getAttribute("src") : null;
    (async () => {
      if (h.length)
        for (const q of h) await t.addFile(q, x);
      else {
        const q = j ?? (R == null ? void 0 : R.split(`
`).find((Q) => Q.trim() && !Q.startsWith("#")));
        q && await t.addUrl(q.trim(), x);
      }
    })().catch(t.error);
  }, !0), () => {
    c();
    for (const y of s) y();
  };
}
const Pc = {
  key: 0,
  class: "ss-recovery",
  role: "status"
}, kc = {
  key: 1,
  class: "ss-empty"
}, Oc = {
  key: 2,
  class: "ss-empty",
  role: "status"
}, Ic = {
  __name: "SsStage",
  props: { session: { type: Object, required: !0 } },
  setup(e) {
    const t = e, i = /* @__PURE__ */ Ne(null), n = /* @__PURE__ */ Ne(null);
    let r, s, o, l, a, f = 0, c = !0, d = [], v = 0, w = 0;
    function p() {
      const y = [];
      for (let h = n.value; h; h = h.parentElement) y.push(h);
      if (!(y.length === d.length && y.every((h, x) => h === d[x]))) {
        s.disconnect(), d = y;
        for (const h of d) s.observe(h, { attributes: !0, attributeFilter: ["style", "class"], childList: !0 });
      }
    }
    function b() {
      if (f = 0, !c) return;
      const y = performance.now(), h = i.value, x = n.value.getBoundingClientRect();
      if (x.width <= 0 || x.height <= 0) return;
      p(), v = x.width, w = x.height;
      const S = window.devicePixelRatio || 1, R = Math.round(x.width * S), j = Math.round(x.height * S);
      if ((h.width !== R || h.height !== j) && (h.width = R, h.height = j), t.session.setViewport(R, j), !!t.session.entry)
        try {
          Mc(h, t.session.entry, t.session.model.state.stickers, t.session.frames, t.session.sources, t.session.model.selection.length > 1 ? t.session.model.selection : t.session.model.selected, t.session.model.dragging, t.session.model.dropFrame), h.dataset.selectionReady = String(t.session.frames.has(t.session.model.selected));
          const U = t.session.model.state.stickers.find((N) => N.id === t.session.model.selected);
          h.dataset.renderedAnchor = (U == null ? void 0 : U.anchor.join(",")) ?? "", h.dataset.renderedAt = String(performance.now()), h.dataset.renderDuration = String(performance.now() - y);
        } catch (U) {
          t.session.error(U);
        }
    }
    function T() {
      !f && c && (f = requestAnimationFrame(b));
    }
    return zs(() => {
      l = Cc(i.value, t.session), a = t.session.subscribe(T), s = new MutationObserver(() => {
        if (p(), !c) return;
        const y = n.value.getBoundingClientRect();
        (y.width !== v || y.height !== w) && T();
      }), p(), window.addEventListener("resize", T), r = new ResizeObserver(T), r.observe(n.value), o = new IntersectionObserver((y) => {
        c = y[y.length - 1].isIntersecting, c && T();
      }), o.observe(n.value), T();
    }), sn(() => {
      l == null || l(), a == null || a(), r == null || r.disconnect(), s == null || s.disconnect(), o == null || o.disconnect(), window.removeEventListener("resize", T), cancelAnimationFrame(f);
    }), (y, h) => (pe(), ve("div", {
      ref_key: "host",
      ref: n,
      class: _i(["ss-stage", { "ss-drop-active": e.session.model.dropActive }])
    }, [
      ye("canvas", {
        ref_key: "canvas",
        ref: i,
        class: "ss-canvas",
        tabindex: "0",
        "data-testid": "surface-stage",
        "aria-label": "Image surface. Drop an image to add a sticker, then drag it to move it."
      }, null, 512),
      e.session.model.missing.length ? (pe(), ve("div", Pc, [
        ye("span", null, "Unavailable images: " + ui(e.session.model.missing.map((x) => x.name).join(", ")), 1),
        ye("button", {
          type: "button",
          class: "ss-button",
          onClick: h[0] || (h[0] = bt((...x) => e.session.removeUnavailable && e.session.removeUnavailable(...x), ["stop"]))
        }, "Remove unavailable images")
      ])) : fi("", !0),
      e.session.model.phase === "ready" && !e.session.model.state.stickers.length && !e.session.model.message ? (pe(), ve("span", kc, "Drop an image or press Add")) : fi("", !0),
      e.session.model.message ? (pe(), ve("span", Oc, ui(e.session.model.message), 1)) : fi("", !0)
    ], 2));
  }
}, Dc = {
  viewBox: "0 0 24 24",
  width: "18",
  height: "18",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true"
}, Lc = ["d"], Fc = {
  __name: "SsIcon",
  props: { name: String },
  setup(e) {
    const t = { add: ["M12 5v14M5 12h14"], duplicate: ["M9 9h11v11H9z", "M15 9V4H4v11h5"], delete: ["M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7M14 10v7"], front: ["M4 16h16M4 20h16", "M12 12V3m-4 4 4-4 4 4"], back: ["M4 4h16M4 8h16", "M12 12v9m-4-4 4 4 4-4"] };
    return t.opacity = ["M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16", "M12 4v16M15 5v14M18 8v8"], (i, n) => (pe(), ve("svg", Dc, [
      (pe(!0), ve(Ie, null, Gs(t[e.name] || [], (r, s) => (pe(), ve("path", {
        key: s,
        d: r
      }, null, 8, Lc))), 128))
    ]));
  }
}, Uc = ["aria-label", "aria-describedby"], $t = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "SsIconButton",
  props: { icon: String, label: String },
  setup(e) {
    const t = /* @__PURE__ */ Ne(null), i = /* @__PURE__ */ Ne(null), n = /* @__PURE__ */ Ne(!1), r = /* @__PURE__ */ Ne({ left: "-9999px", top: "0px" }), s = "ss-tip-" + pr();
    function o() {
      n.value = !1;
    }
    async function l() {
      var v, w;
      if (n.value = !0, await tn(), !n.value || !t.value || !i.value) return;
      (w = (v = i.value).showPopover) == null || w.call(v);
      const f = t.value.getBoundingClientRect(), c = i.value.getBoundingClientRect(), d = Math.max(8, Math.min(window.innerWidth - c.width - 8, f.left + (f.width - c.width) / 2));
      r.value = { left: d + "px", top: (f.top > c.height + 12 ? f.top - c.height - 8 : f.bottom + 8) + "px" };
    }
    function a(f) {
      f.target.matches(":focus-visible") && l();
    }
    return window.addEventListener("scroll", o, !0), sn(() => window.removeEventListener("scroll", o, !0)), (f, c) => (pe(), ve("span", {
      ref_key: "control",
      ref: t,
      class: "ss-icon-control",
      onPointerenter: l,
      onPointerleave: o
    }, [
      ye("button", go({
        type: "button",
        class: "ss-icon-button"
      }, f.$attrs, {
        "aria-label": e.label,
        "aria-describedby": n.value ? s : void 0,
        onFocus: a,
        onBlur: o,
        onPointerdown: o,
        onKeydown: dr(o, ["esc"])
      }), [
        fe(Fc, { name: e.icon }, null, 8, ["name"])
      ], 16, Uc),
      (pe(), fr(Cl, { to: "body" }, [
        n.value ? (pe(), ve("span", {
          key: 0,
          id: s,
          ref_key: "tip",
          ref: i,
          role: "tooltip",
          popover: "manual",
          class: "ss-tooltip",
          style: Yi(r.value)
        }, ui(e.label), 5)) : fi("", !0)
      ]))
    ], 544));
  }
}), Nc = ["onKeydown"], Bc = { class: "ss-opacity-label" }, jc = ["value", "aria-valuetext"], Kc = {
  __name: "SsOpacity",
  props: { session: { type: Object, required: !0 }, sticker: Object },
  setup(e) {
    const t = e, i = /* @__PURE__ */ Ne(null), n = /* @__PURE__ */ Ne(null), r = /* @__PURE__ */ Ne(!1), s = Dt(() => !t.sticker || t.sticker.locked || t.session.model.phase !== "ready" || t.session.model.dragging);
    let o = null;
    function l(w) {
      s.value || (o ?? (o = { id: t.sticker.id, opacity: t.sticker.opacity }), t.session.setSticker(o.id, { opacity: Number(w.target.value) / 100 }));
    }
    function a() {
      const w = o;
      if (o = null, !w) return;
      const p = t.session.model.state.stickers.find((b) => b.id === w.id);
      p && p.opacity !== w.opacity && t.session.save();
    }
    function f() {
      a(), r.value = !1;
    }
    function c() {
      const w = o;
      o = null, w && t.session.model.state.stickers.some((p) => p.id === w.id) && t.session.setSticker(w.id, { opacity: w.opacity }), r.value = !1;
    }
    async function d() {
      var w;
      if (r.value) {
        f();
        return;
      }
      r.value = !0, await tn(), (w = n.value) == null || w.focus({ preventScroll: !0 });
    }
    function v(w) {
      var p;
      r.value && !((p = i.value) != null && p.contains(w.target)) && f();
    }
    return document.addEventListener("pointerdown", v, !0), sn(() => document.removeEventListener("pointerdown", v, !0)), (w, p) => (pe(), ve("div", {
      ref_key: "root",
      ref: i,
      class: "ss-opacity-control"
    }, [
      fe($t, {
        icon: "opacity",
        label: "Opacity",
        disabled: s.value,
        "aria-expanded": r.value,
        onClick: d
      }, null, 8, ["disabled", "aria-expanded"]),
      r.value && !s.value ? (pe(), ve("div", {
        key: 0,
        class: "ss-opacity-popover",
        role: "group",
        "aria-label": "Sticker opacity",
        onKeydown: dr(bt(c, ["stop", "prevent"]), ["esc"])
      }, [
        ye("label", Bc, [
          p[0] || (p[0] = po("Opacity ", -1)),
          ye("input", {
            ref_key: "slider",
            ref: n,
            class: "ss-opacity-slider",
            type: "range",
            min: "0",
            max: "100",
            step: "1",
            value: Math.round(e.sticker.opacity * 100),
            "aria-valuetext": Math.round(e.sticker.opacity * 100) + "%",
            "aria-label": "Opacity",
            onInput: l,
            onChange: a,
            onBlur: a,
            onPointercancel: c
          }, null, 40, jc)
        ])
      ], 40, Nc)) : fi("", !0)
    ], 512));
  }
}, $c = ["aria-label", "aria-pressed", "title", "onClick"], Hc = ["src"], Wc = {
  key: 1,
  "aria-hidden": "true"
}, zc = {
  __name: "SsThumbnails",
  props: { session: Object },
  setup(e) {
    const t = e, i = /* @__PURE__ */ Ne(null), n = /* @__PURE__ */ new Map(), r = Dt(() => t.session.model.selection.length ? t.session.model.selection : t.session.model.selected ? [t.session.model.selected] : []);
    return Oi(() => t.session.model.selected, async (s) => {
      await tn();
      const o = n.get(s), l = i.value;
      if (!o || !l) return;
      const a = o.offsetLeft, f = a + o.offsetWidth;
      a < l.scrollLeft ? l.scrollLeft = a : f > l.scrollLeft + l.clientWidth && (l.scrollLeft = f - l.clientWidth);
    }), (s, o) => (pe(), ve("div", {
      ref_key: "strip",
      ref: i,
      class: "ss-thumbnails",
      role: "list",
      "aria-label": "Stickers"
    }, [
      (pe(!0), ve(Ie, null, Gs(e.session.model.state.stickers, (l) => (pe(), ve("span", {
        key: l.id,
        role: "listitem"
      }, [
        ye("button", {
          ref_for: !0,
          ref: (a) => a ? In(n).set(l.id, a) : In(n).delete(l.id),
          type: "button",
          class: _i(["ss-thumbnail", { "ss-thumbnail-hidden": !l.visible }]),
          "aria-label": l.name,
          "aria-pressed": r.value.includes(l.id),
          title: l.name,
          onClick: bt((a) => e.session.select(l.id, a.shiftKey), ["stop"])
        }, [
          e.session.model.thumbnails[l.id] ? (pe(), ve("img", {
            key: 0,
            src: e.session.model.thumbnails[l.id],
            alt: "",
            draggable: "false"
          }, null, 8, Hc)) : (pe(), ve("span", Wc, "!"))
        ], 10, $c)
      ]))), 128))
    ], 512));
  }
}, Vc = { class: "ss-blend" }, Gc = ["value", "disabled", "onKeydown"], qc = {
  __name: "SsBlend",
  props: { session: { type: Object, required: !0 } },
  setup(e) {
    const t = e;
    let i = null;
    function n(o) {
      i ?? (i = t.session.model.state), t.session.replaceState({ ...ii(t.session.model.state), blend: Number(o.target.value) }), t.session.update().catch(t.session.error);
    }
    function r() {
      const o = i;
      i = null, o && (o.blend ?? 1) !== t.session.model.state.blend && t.session.save();
    }
    function s() {
      const o = i;
      i = null, o && (t.session.replaceState(o), t.session.update().catch(t.session.error));
    }
    return (o, l) => (pe(), ve("label", Vc, [
      l[0] || (l[0] = ye("span", null, "Blend", -1)),
      ye("input", {
        class: "ss-opacity-slider",
        type: "range",
        min: "0",
        max: "1",
        step: "0.01",
        "aria-label": "Blend",
        value: e.session.model.state.blend ?? 1,
        disabled: e.session.model.phase !== "ready" || e.session.model.dragging,
        onInput: n,
        onChange: r,
        onBlur: r,
        onPointercancel: s,
        onKeydown: dr(bt(s, ["stop", "prevent"]), ["esc"])
      }, null, 40, Gc)
    ]));
  }
}, Xc = ["data-sticker-count"], Jc = { class: "ss-global-controls" }, Yc = { class: "ss-add-island" }, Zc = {
  class: "ss-selection-bar",
  role: "toolbar",
  "aria-label": "Selected sticker"
}, Qc = {
  __name: "SsSurface",
  props: { session: { type: Object, required: !0 }, canvasWheel: Function },
  setup(e) {
    const t = e, i = /* @__PURE__ */ Ne(null), n = /* @__PURE__ */ Ne(null), r = Dt(() => t.session.model.selection.length ? t.session.model.selection : t.session.model.selected ? [t.session.model.selected] : []), s = Dt(() => r.value.length === 1 ? t.session.model.state.stickers.find((p) => p.id === r.value[0]) : null), o = Dt(() => t.session.model.state.stickers.findIndex((p) => p.id === t.session.model.selected)), l = Dt(() => !!s.value && t.session.model.phase === "ready" && !t.session.model.dragging);
    function a(p) {
      t.canvasWheel && (p.preventDefault(), p.stopPropagation(), t.canvasWheel(p));
    }
    async function f(p) {
      var y;
      const b = (y = p.target.files) == null ? void 0 : y[0];
      if (p.target.value = "", !b) return;
      let T = [0.5, 0.5];
      if (!t.session.validAnchor(T) && t.session.entry) {
        const { grid: h } = t.session.entry;
        let x = -1, S = 1 / 0;
        for (let R = 0; R < h.valid.length; R++) if (h.valid[R]) {
          const j = (R % h.width - h.width / 2) ** 2 + (Math.floor(R / h.width) - h.height / 2) ** 2;
          j < S && (S = j, x = R);
        }
        x >= 0 && (T = [(x % h.width + 0.5) / h.width, (Math.floor(x / h.width) + 0.5) / h.height]);
      }
      try {
        await t.session.addFile(b, T);
      } catch (h) {
        t.session.error(h);
      }
    }
    function c() {
      !r.value.length || t.session.model.dragging || (t.session.setState(JSON.stringify({ ...t.session.model.state, stickers: t.session.model.state.stickers.filter((p) => !r.value.includes(p.id)) })), t.session.select(null), t.session.save());
    }
    function d() {
      if (!l.value || !t.session.entry) return;
      const p = n.value.$el.getBoundingClientRect(), b = Vi(p, t.session.entry.meta);
      let T = null;
      const y = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
      for (let x = 20; !T && x >= 20 / 1024; x /= 2)
        for (const [S, R] of y) {
          const j = [s.value.anchor[0] + S * x / b.width, s.value.anchor[1] + R * x / b.height];
          if (t.session.validAnchor(j)) {
            T = j;
            break;
          }
        }
      if (!T) {
        t.session.error(new Error("No nearby surface for a copy. Move the sticker onto a larger surface first."));
        return;
      }
      const h = { ...s.value, anchor: T, id: gr(), name: s.value.name + " copy" };
      t.session.setState(JSON.stringify({ ...t.session.model.state, stickers: [...t.session.model.state.stickers, h] })), t.session.select(h.id), t.session.save();
    }
    function v(p) {
      if (!l.value) return;
      const b = t.session.model.state.stickers.filter((T) => T.id !== s.value.id);
      p ? b.push(s.value) : b.unshift(s.value), t.session.replaceState({ ...t.session.model.state, stickers: b }), t.session.save(), t.session.update().catch(t.session.error);
    }
    function w(p) {
      if (p.target.matches("input,select,textarea")) {
        if (p.target.type === "range" && (p.ctrlKey || p.metaKey) && p.key.toLowerCase() === "z") {
          p.preventDefault(), p.stopPropagation(), p.currentTarget.focus({ preventScroll: !0 }), p.currentTarget.dispatchEvent(new KeyboardEvent("keydown", { key: p.key, code: p.code, ctrlKey: p.ctrlKey, metaKey: p.metaKey, shiftKey: p.shiftKey, altKey: p.altKey, bubbles: !0, cancelable: !0 }));
          return;
        }
        p.stopPropagation();
        return;
      }
      p.key === "Escape" && !t.session.model.dragging && t.session.model.selected && (p.preventDefault(), p.stopPropagation(), t.session.select(null)), (p.key === "Delete" || p.key === "Backspace") && (p.preventDefault(), p.stopPropagation(), c()), (p.ctrlKey || p.metaKey) && p.key.toLowerCase() === "d" && (p.preventDefault(), p.stopPropagation(), d());
    }
    return (p, b) => {
      var T;
      return pe(), ve("section", {
        class: "ss-surface",
        tabindex: "0",
        onKeydown: w,
        onWheel: a
      }, [
        ye("span", {
          class: "ss-status",
          "data-testid": "surface-status",
          role: "status",
          "data-sticker-count": e.session.model.phase === "ready" ? e.session.model.state.stickers.length : null
        }, ui(e.session.model.message), 9, Xc),
        fe(Ic, {
          ref_key: "stage",
          ref: n,
          session: e.session
        }, null, 8, ["session"]),
        ye("div", {
          class: "ss-action-dock",
          onPointerdown: b[3] || (b[3] = bt(() => {
          }, ["stop"]))
        }, [
          ye("div", Jc, [
            ye("div", Yc, [
              fe($t, {
                icon: "add",
                label: "Add image",
                disabled: e.session.model.phase !== "ready" || e.session.model.dragging,
                onClick: b[0] || (b[0] = bt((y) => i.value.click(), ["stop"]))
              }, null, 8, ["disabled"])
            ]),
            fe(qc, { session: e.session }, null, 8, ["session"])
          ]),
          ye("div", Zc, [
            fe($t, {
              icon: "duplicate",
              label: "Duplicate",
              disabled: !l.value,
              onClick: d
            }, null, 8, ["disabled"]),
            (pe(), fr(Kc, {
              key: ((T = s.value) == null ? void 0 : T.id) ?? "none",
              session: e.session,
              sticker: s.value
            }, null, 8, ["session", "sticker"])),
            b[5] || (b[5] = ye("span", { class: "ss-separator" }, null, -1)),
            fe($t, {
              icon: "back",
              label: "Send to back",
              disabled: !l.value || o.value <= 0,
              onClick: b[1] || (b[1] = (y) => v(!1))
            }, null, 8, ["disabled"]),
            fe($t, {
              icon: "front",
              label: "Bring to front",
              disabled: !l.value || o.value === e.session.model.state.stickers.length - 1,
              onClick: b[2] || (b[2] = (y) => v(!0))
            }, null, 8, ["disabled"]),
            b[6] || (b[6] = ye("span", { class: "ss-separator" }, null, -1)),
            fe($t, {
              icon: "delete",
              label: "Delete",
              disabled: !r.value.length || e.session.model.dragging || e.session.model.phase !== "ready",
              onClick: c
            }, null, 8, ["disabled"])
          ]),
          fe(zc, { session: e.session }, null, 8, ["session"])
        ], 32),
        ye("input", {
          ref_key: "file",
          ref: i,
          class: "ss-file",
          type: "file",
          accept: "image/*",
          onClick: b[4] || (b[4] = bt(() => {
          }, ["stop"])),
          onChange: bt(f, ["stop"])
        }, null, 544)
      ], 32);
    };
  }
};
let Oe = null, ef = 0;
const _t = /* @__PURE__ */ new Map();
function tf() {
  Oe || (Oe = new Worker(new URL(
    /* @vite-ignore */
    "" + new URL(".lazy/surface_worker-BgEeJNHv.js", import.meta.url).href,
    import.meta.url
  ), { type: "module" }), Oe.onmessage = ({ data: e }) => {
    const t = _t.get(e.id);
    t && (_t.delete(e.id), e.error ? t.reject(new Error(e.error)) : t.resolve(e.result));
  }, Oe.onerror = () => {
    for (const e of _t.values()) e.reject(new Error("Surface calculations stopped. Reload the page and run the workflow again."));
    _t.clear(), Oe == null || Oe.terminate(), Oe = null;
  });
}
function vt(e, t = []) {
  return tf(), new Promise((i, n) => {
    const r = ++ef;
    _t.set(r, { resolve: i, reject: n });
    try {
      Oe.postMessage({ ...e, id: r }, t);
    } catch (s) {
      _t.delete(r), n(s);
    }
  });
}
function nf() {
  Oe == null || Oe.terminate(), Oe = null;
  for (const e of _t.values()) e.reject(new DOMException("Surface released", "AbortError"));
  _t.clear();
}
const Jt = /* @__PURE__ */ new Map(), rf = (e) => {
  var t;
  return (t = (e == null ? void 0 : e.slap_stickers) ?? (e == null ? void 0 : e.surface_stickers)) == null ? void 0 : t[0];
};
function Ao(e) {
  const t = new URL("view", document.baseURI);
  return t.search = new URLSearchParams(e).toString(), t.href;
}
async function Gn(e) {
  try {
    return await createImageBitmap(e, { premultiplyAlpha: "none", colorSpaceConversion: "none" });
  } catch {
    throw new Error("This image could not be read. Choose a PNG, JPEG or WebP image.");
  }
}
function sf(e, t = Ao) {
  const i = e.meta.key;
  let n = Jt.get(i);
  n || (n = { refs: 0, key: i, promise: null }, n.promise = (async () => {
    const s = await Promise.all([fetch(t(e.grid)), fetch(t(e.preview))]);
    if (s.some((c) => !c.ok)) throw new Error("Surface data is gone — run the workflow again");
    const [o, l] = await Promise.all([s[0].arrayBuffer(), s[1].blob()]), a = ac(o, e.meta), f = await Gn(l);
    try {
      let c = null;
      if (e.sky) {
        const T = await fetch(t(e.sky));
        if (!T.ok) throw new Error("Sky data is gone — run the workflow again");
        if (c = new Uint8Array(await T.arrayBuffer()), c.length !== a.width * a.height) throw new Error("Sky data is incomplete — run the workflow again");
        a.sky = c;
      }
      const d = e.appearance ? Object.fromEntries(await Promise.all(Object.entries(e.appearance).map(async ([T, y]) => {
        const { width: h, height: x, ...S } = y, R = await fetch(t(S));
        if (!R.ok) throw new Error("Photo analysis is gone — run the workflow again");
        const j = new Uint16Array(await R.arrayBuffer());
        if (j.length !== h * x * 4) throw new Error("Photo analysis is incomplete — run the workflow again");
        return [T, { data: j, width: h, height: x }];
      }))) : null, v = new OffscreenCanvas(f.width, f.height), w = v.getContext("2d");
      w.drawImage(f, 0, 0);
      const p = w.getImageData(0, 0, f.width, f.height).data, b = await vt({ type: "register", key: i, buffer: o, meta: e.meta, pixels: p, width: f.width, height: f.height, appearance: d, sky: c }, [o, p.buffer, ...Object.values(d ?? {}).map((T) => T.data.buffer)]);
      return { key: i, grid: a, image: f, ...b, meta: e.meta };
    } catch (c) {
      throw f.close(), c;
    }
  })(), Jt.set(i, n)), n.refs++;
  let r = !1;
  return { ready: n.promise, release() {
    r || (r = !0, !(--n.refs > 0) && (Jt.delete(i), n.promise.then((s) => {
      Re(s.image), Sc(s), s.image.close(), Jt.has(i) || vt({ type: "release", key: i }).catch(() => {
      });
    }, () => {
    }).finally(() => {
      Jt.size || nf();
    })));
  } };
}
let ss = 0;
function of({ state: e = "", commit: t = () => {
}, upload: i, urlFor: n = Ao } = {}) {
  let r, s = null;
  try {
    r = ti(e), e.trim() || (r = ii(r));
  } catch (m) {
    r = { version: 1, stickers: [] }, s = m;
  }
  const o = pr() + ":";
  let l = null, a = !1, f = null, c = null, d = 0, v = 0, w = !1, p = null, b = 0, T = 0, y = 0, h = null, x = !1, S = 0, R = -1 / 0;
  const j = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Set(), q = /* @__PURE__ */ new Set();
  let Q = /* @__PURE__ */ new Map();
  const oe = (m) => JSON.stringify([m, Q.get(JSON.stringify(m))]), I = /* @__PURE__ */ ks({ state: r, phase: s ? "error" : "empty", message: (s == null ? void 0 : s.message) ?? "Run the workflow once to load the surface", missing: [], thumbnails: {}, selected: null, selection: [], invalid: !1, dragging: !1, dropFrame: null, dropActive: !1 });
  ss++;
  const se = () => {
    for (const m of X) m();
  };
  function Y(m) {
    !a && m.name !== "AbortError" && I.message !== m.message && (I.message = m.message, se());
  }
  function Z(m) {
    I.state = m, se();
  }
  function te() {
    a || t(wi(I.state));
  }
  const Je = (m, _, k) => JSON.stringify([m.anchor, m.size, m.rotation, m.edge, m.mode, _.width, _.height, k, m.pivot, m.pose]);
  function Nt() {
    T = ++b;
  }
  function Ke() {
    T = 0, clearTimeout(S), S = 0, p != null && p.preview && (p.resolve(), p = null);
  }
  function Ce(m, _, k = null) {
    if (!c || !T || a) return Promise.resolve();
    const O = ii(I.state), B = O.stickers.find((ie) => ie.id === m), H = _.anchor ?? B.anchor, { grid: V } = c, J = (ie) => {
      var $;
      return ($ = V.sky) == null ? void 0 : $[Math.min(V.height - 1, Math.max(0, Math.floor(ie[1] * V.height))) * V.width + Math.min(V.width - 1, Math.max(0, Math.floor(ie[0] * V.width)))];
    };
    return _.anchor && (J(B.anchor) || J(H)) && (k = null), O.stickers = O.stickers.map((ie) => ie.id === m ? { ...ie, ..._, ...ie.recovered ? { recovered: !1 } : {}, pose: void 0 } : ie), p && p.resolve(), new Promise((ie, $) => {
      p = { state: O, physical: k, coarse: !1, viewport: l, preview: T, target: m, resolve: ie, reject: $ }, At();
    });
  }
  function Vt(m, _ = !1) {
    const k = I.selection.length ? I.selection : I.selected ? [I.selected] : [];
    I.selection = _ ? k.includes(m) ? k.filter((O) => O !== m) : [...k, m] : m ? [m] : [], I.selected = I.selection.includes(m) ? m : I.selection.at(-1) ?? null, se();
  }
  function Bt(m) {
    var _;
    m && (Re(m.region), m.field && Re(m.field), Re(m.bitmap), (_ = m.bitmap) == null || _.close());
  }
  async function Ei(m, _, k) {
    const O = await createImageBitmap(_, { premultiplyAlpha: "none", colorSpaceConversion: "none" });
    if (a || N.get(m) !== _) {
      O.close();
      return;
    }
    if (await vt({ type: "source", key: o + m, bitmap: O }, [O]), a || N.get(m) !== _) return;
    const B = Math.min(1, 64 / Math.max(_.width, _.height)), H = new OffscreenCanvas(Math.max(1, Math.round(_.width * B)), Math.max(1, Math.round(_.height * B)));
    H.getContext("2d").drawImage(_, 0, 0, H.width, H.height);
    const V = await H.convertToBlob({ type: "image/png" });
    !a && N.get(m) === _ && (URL.revokeObjectURL(I.thumbnails[m]), I.thumbnails = { ...I.thumbnails, [m]: URL.createObjectURL(V) }, W.set(m, k));
  }
  async function ct() {
    if (!c || a) return;
    const m = d, _ = ++v, k = [];
    if (await Promise.all(I.state.stickers.map(async (O) => {
      const B = oe(O.source);
      if (W.get(O.id) === B) return;
      let H;
      try {
        const J = [...W].find(([ie, $]) => $ === B && N.has(ie));
        if (J) H = await createImageBitmap(N.get(J[0]), { premultiplyAlpha: "none", colorSpaceConversion: "none" });
        else {
          const ie = await fetch(n(O.source), { cache: "no-store" });
          if (!ie.ok) throw new Error(`Cannot read ${O.name}.`);
          H = await Gn(await ie.blob());
        }
      } catch {
        !a && m === d && _ === v && (k.push({ id: O.id, name: O.name }), Ye(O.id));
        return;
      }
      const V = I.state.stickers.find((J) => J.id === O.id);
      if (a || m !== d || _ !== v || !V || oe(V.source) !== B) {
        H.close();
        return;
      }
      Ye(O.id), N.set(O.id, H), await Ei(O.id, H, B);
    })), !(a || m !== d || _ !== v)) {
      for (const O of N.keys()) !q.has(O) && !I.state.stickers.some((B) => B.id === O) && Ye(O);
      I.missing = k;
    }
  }
  function Ye(m) {
    URL.revokeObjectURL(I.thumbnails[m]);
    const _ = { ...I.thumbnails };
    delete _[m], I.thumbnails = _;
    const k = N.get(m);
    k && (Re(k), k.close(), N.delete(m), vt({ type: "releaseSource", key: o + m }).catch(() => {
    })), W.delete(m), Bt(U.get(m)), U.delete(m), j.delete(m);
  }
  async function At() {
    var k, O, B, H;
    if (w || !p || !c || a) return;
    clearTimeout(S), S = 0;
    const m = p.preview ? R + 1e3 / 30 - performance.now() : 0;
    if (m > 0) {
      S = setTimeout(() => {
        S = 0, At();
      }, Math.ceil(m));
      return;
    }
    w = !0;
    const _ = p;
    p = null, _.preview && (R = performance.now());
    try {
      const V = d, J = await Promise.all(_.state.stickers.filter(($) => $.visible).map(async ($) => {
        var wr;
        const de = N.get($.id);
        if (!de || W.get($.id) !== oe($.source)) return null;
        const ke = ((wr = _.physical) == null ? void 0 : wr.id) === $.id ? _.physical.width : null, ce = Je($, de, ke), ge = JSON.stringify([_.viewport, $.shading, _.state.blend]), ft = _.state.version === 2 && c.appearanceReady, Gt = { ...$, shading: ft ? _.state.blend : $.shading, natural: ft }, vr = ce + (_.coarse ? "coarse" : "full"), cn = j.get($.id), $e = U.get($.id);
        if (cn === vr || _.coarse && cn === ce + "full") {
          if (!$e || $e.rasterKey === ge) return null;
          const br = { ...$e };
          delete br.bitmap;
          const ko = await vt({ type: "raster", key: c.key, frame: br, sticker: Gt, viewport: _.viewport, sourceKey: o + $.id });
          return { id: $.id, frame: { ...$e, ...ko, viewport: _.viewport, rasterKey: ge }, key: cn };
        }
        const Rt = await vt({ type: "flat", key: c.key, sticker: Gt, aspect: de.width / de.height, physicalWidth: ke, coarse: _.coarse, chart: _.state.version === 2, fieldToken: $e == null ? void 0 : $e.fieldToken, viewport: _.viewport, sourceKey: o + $.id });
        if (Rt) {
          if (Rt.reuseField) {
            if (Rt.fieldToken !== ($e == null ? void 0 : $e.fieldToken)) throw new Error("The surface chart changed. Move the sticker again.");
            Rt.field = $e.field;
          }
          Rt.viewport = _.viewport, Rt.rasterKey = ge;
        }
        return { id: $.id, frame: Rt, key: vr };
      })), ie = !a && V === d && (_.preview ? _.preview === T : _.state === I.state);
      if (!ie) {
        for (const $ of J) (O = (k = $ == null ? void 0 : $.frame) == null ? void 0 : k.bitmap) == null || O.close();
        !a && V === d && !_.preview && !p && Pe().catch(Y);
      }
      if (ie) {
        if (_.preview || _.state.version === 2 && _.state === I.state) {
          const $ = J.find((de) => (de == null ? void 0 : de.id) === _.target);
          if (_.preview && !($ != null && $.frame)) {
            I.invalid = !0, _.resolve();
            return;
          }
          _.state.stickers = _.state.stickers.map((de) => {
            const ke = J.find((ft) => (ft == null ? void 0 : ft.id) === de.id);
            if (!(ke != null && ke.frame)) return de;
            const ce = ke.frame, ge = { ...de, ..._.preview && de.id === _.target ? { size: ce.resolvedSize ?? ce.w * c.grid.intrinsics[0][0] / (ce.gripDepth ?? ce.p0[2]) } : {} };
            return ge.pose = rc(ce, ge, c.grid.key), ce.size = ge.size, ke.key = Je(ge, N.get(de.id), null) + "full", ge;
          }), I.state = _.state, I.invalid = !1, _.preview && I.message.startsWith("An invalid sticker position") && (I.message = "");
        }
        for (const $ of J) if ($) {
          if (!I.state.stickers.some((ke) => ke.id === $.id)) {
            (H = (B = $.frame) == null ? void 0 : B.bitmap) == null || H.close();
            continue;
          }
          const de = U.get($.id);
          Bt(de), $.frame ? U.set($.id, $.frame) : U.delete($.id), j.set($.id, $.key);
        }
        se();
      }
      _.resolve();
    } catch (V) {
      _.reject(V), Y(V);
    } finally {
      w = !1, p && At();
    }
  }
  function Pe(m = null) {
    return !c || a ? Promise.resolve() : (p && p.resolve(), new Promise((_, k) => {
      p = { state: I.state, physical: m, coarse: !1, viewport: l, resolve: _, reject: k }, At();
    }));
  }
  function yr(m, _) {
    (l == null ? void 0 : l[0]) === m && (l == null ? void 0 : l[1]) === _ || (l = [m, _], Pe().catch(Y));
  }
  async function u(m) {
    if (a) return;
    if (Ke(), s) {
      I.phase = "error", I.message = s.message, se();
      return;
    }
    if (Q = new Map((m.source_revisions ?? []).map((O) => [JSON.stringify(O.source), O.digest])), (c == null ? void 0 : c.key) === m.meta.key && I.phase === "ready") {
      d++, await ct(), await Pe(), se();
      return;
    }
    const _ = ++d;
    j.clear(), c = null, f == null || f.release(), f = null, I.phase = "loading", I.message = "Loading surface…", se();
    const k = sf(m, n);
    f = k;
    try {
      const O = await k.ready;
      if (a || _ !== d || (c = O, await ct(), a || _ !== d)) return;
      I.phase = "ready", I.message = I.state.stickers.some((B) => B.recovered) ? "An invalid sticker position was restored to the center. Select its thumbnail to reposition it." : c.grid.valid.some(Boolean) ? "" : "No usable surface in this image", await Pe(), se();
    } catch (O) {
      !a && _ === d && (I.phase = "error", Y(O));
    }
  }
  async function g(m, _ = [0.5, 0.5]) {
    if (!c || I.phase !== "ready") {
      I.message = "Run the workflow once to load the surface", se();
      return;
    }
    if (!/^image\//.test(m.type) && !/\.(png|jpe?g|webp|gif|bmp)$/i.test(m.name)) throw new Error("Choose an image file to add a sticker.");
    if (!L(_)) throw new Error("Drop the image on a usable surface.");
    const k = f, O = await Gn(m);
    let B;
    function H() {
      return !a && f === k ? !1 : (B ? Ye(B.id) : O.close(), a || (I.message = "The surface changed during upload. Add the image again.", se()), !0);
    }
    try {
      if (H()) return;
      if (!/\.(png|jpe?g|webp|gif|bmp)$/i.test(m.name)) {
        const J = new OffscreenCanvas(O.width, O.height);
        J.getContext("2d").drawImage(O, 0, 0), m = new File([await J.convertToBlob({ type: "image/png" })], m.name.replace(/\.[^.]*$/, "") + ".png", { type: "image/png" });
      }
      I.message = "Uploading image…", se();
      const V = await i(m);
      if (H() || (B = ti(JSON.stringify({ version: I.state.version, stickers: [rs({ filename: V.name, subfolder: V.subfolder ?? "", type: V.type }, m.name, _)] })).stickers[0], q.add(B.id), N.set(B.id, O), await Ei(B.id, O, oe(B.source)), H())) return;
      q.delete(B.id), Vt(B.id), I.message = "", Z({ ...I.state, stickers: [...I.state.stickers, B] }), te(), await Pe();
    } catch (V) {
      throw B && Ye(B.id), O.close(), I.message = "", Y(V), V;
    } finally {
      B && q.delete(B.id);
    }
  }
  async function E(m, _) {
    const k = new URL(m, document.baseURI);
    if (!["http:", "https:", "data:", "blob:"].includes(k.protocol) || k.protocol === "data:" && !m.startsWith("data:image/")) throw new Error("Drop an image URL.");
    let O;
    try {
      O = await fetch(k);
    } catch {
      throw new Error("This website does not allow image downloads. Save the image and drop the file instead.");
    }
    if (!O.ok) throw new Error("The image URL could not be read.");
    const B = await O.blob();
    if (!B.type.startsWith("image/")) throw new Error("That URL does not contain an image.");
    const H = decodeURIComponent(k.pathname.split("/").at(-1) || "image.png").replace(/[\\/:\0]/g, "_");
    await g(new File([B], H, { type: B.type }), _);
  }
  function P() {
    y++, h = null, I.dropFrame = null, I.dropActive = !1, se();
  }
  async function M() {
    if (x || !h || !c || a) return;
    x = !0;
    const { anchor: m, serial: _ } = h;
    h = null;
    const k = d;
    try {
      const O = { ...rs({ filename: "preview.png", type: "input", subfolder: "" }, "", m), pivot: [0.5, 0.5] }, B = await vt({ type: "flat", key: c.key, sticker: O, aspect: 1, chart: !0, guideOnly: !0, sourceKey: o + "drop" });
      !a && k === d && _ === y && (I.dropFrame = B, se());
    } catch (O) {
      Y(O);
    } finally {
      x = !1, h && M();
    }
  }
  function C(m) {
    if (I.dropActive = !0, !L(m)) {
      y++, I.dropFrame = null, se();
      return;
    }
    h = { anchor: m, serial: ++y }, M(), se();
  }
  function L([m, _]) {
    if (!c || m < 0 || m > 1 || _ < 0 || _ > 1) return !1;
    const { grid: k } = c;
    return !!k.valid[Math.min(k.height - 1, Math.floor(_ * k.height)) * k.width + Math.min(k.width - 1, Math.floor(m * k.width))];
  }
  function F(m, _) {
    const k = "pivot" in _ || "pose" in _ ? ii(I.state) : I.state, O = ["anchor", "size", "rotation", "pivot", "mode", "edge"].some((B) => B in _);
    Z(ti(wi({ ...k, stickers: k.stickers.map((B) => B.id === m ? { ...B, ..._, ...O && B.recovered ? { recovered: !1 } : {}, ...O && !("pose" in _) ? { pose: void 0 } : {} } : B) })));
  }
  function D(m) {
    if (!a) {
      Ke();
      try {
        const _ = ti(m);
        Z(m.trim() ? _ : ii(_)), s = null, I.phase !== "loading" && (I.phase = c ? "ready" : "empty", I.message = c ? "" : "Run the workflow once to load the surface"), ct().then(() => Pe()).catch(Y);
      } catch (_) {
        s = _, I.phase = "error", Y(_);
      }
    }
  }
  function A() {
    const m = new Set(I.missing.map((_) => _.id));
    D(JSON.stringify({ ...I.state, stickers: I.state.stickers.filter((_) => !m.has(_.id)) })), te();
  }
  function K() {
    if (!a) {
      a = !0, d++, p == null || p.resolve(), p = null, clearTimeout(S), S = 0, f == null || f.release(), f = null, c = null, N.size && vt({ type: "releaseSources", key: o }).catch(() => {
      });
      for (const m of U.values()) Bt(m);
      U.clear(), j.clear();
      for (const m of N.values())
        Re(m), m.close();
      N.clear(), X.clear();
      for (const m of Object.values(I.thumbnails)) URL.revokeObjectURL(m);
      I.thumbnails = {}, --ss === 0 && Ec();
    }
  }
  return {
    model: I,
    frames: U,
    sources: N,
    select: Vt,
    beginPreview: Nt,
    endPreview: Ke,
    previewSticker: Ce,
    previewDrop: C,
    clearDrop: P,
    sourceUrl: n,
    get entry() {
      return c;
    },
    load: u,
    addFile: g,
    addUrl: E,
    validAnchor: L,
    setSticker: F,
    setState: D,
    replaceState: Z,
    update: Pe,
    save: te,
    error: Y,
    dispose: K,
    removeUnavailable: A,
    setViewport: yr,
    subscribe(m) {
      return X.add(m), () => X.delete(m);
    },
    notify: se
  };
}
const Tt = /* @__PURE__ */ new WeakMap(), zt = /* @__PURE__ */ new Set();
let lf = 0;
const Yt = { minWidth: 600, minHeight: 320 }, mr = document.createElement("link");
mr.rel = "stylesheet";
mr.href = new URL("./slap_stickers.css", import.meta.url).href;
document.head.appendChild(mr);
const Ro = (e) => {
  var t;
  return (t = e.widgets) == null ? void 0 : t.find((i) => i.name === "state_json");
};
async function af(e) {
  const t = new FormData();
  t.append("image", e), t.append("type", "input"), t.append("subfolder", "slap_stickers");
  const i = await os.fetchApi("/upload/image", { method: "POST", body: t });
  if (!i.ok) throw new Error("The image could not be uploaded. Try adding it again.");
  return i.json();
}
function ni(e, t) {
  const i = Tt.get(e), n = rf(t);
  if (!i || !n) return;
  const r = JSON.stringify([n.meta.key, n.source_revisions]);
  if (i.key === r && (i.loading || i.session.model.phase === "ready" && !i.session.model.missing.length)) return;
  i.key = r;
  const s = i.session.load(JSON.parse(JSON.stringify(n)));
  i.loading = s, s.catch(i.session.error).finally(() => {
    i.loading === s && (i.loading = null);
  });
}
function cf(e, t) {
  return of({ state: t.value ?? "", upload: af, urlFor: (i) => os.apiURL(`/view?${new URLSearchParams(i)}`), commit: (i) => {
    var n, r, s, o, l, a, f, c, d, v;
    if (t.value !== i) {
      (r = (n = e.graph) == null ? void 0 : n.beforeChange) == null || r.call(n), (o = (s = Lt.canvas) == null ? void 0 : s.emitBeforeChange) == null || o.call(s);
      try {
        t.value = i, (l = t.callback) == null || l.call(t, i);
      } finally {
        (f = (a = e.graph) == null ? void 0 : a.afterChange) == null || f.call(a), (d = (c = Lt.canvas) == null ? void 0 : c.emitAfterChange) == null || d.call(c);
      }
      (v = e.setDirtyCanvas) == null || v.call(e, !0, !0);
    }
  } });
}
function ff(e, t, i, n = null) {
  const r = (l) => {
    var a;
    return (a = Lt.canvas) == null ? void 0 : a.canvas.dispatchEvent(new WheelEvent("wheel", { clientX: l.clientX, clientY: l.clientY, deltaX: l.deltaX, deltaY: l.deltaY, deltaMode: l.deltaMode, ctrlKey: l.ctrlKey, metaKey: l.metaKey, shiftKey: l.shiftKey, altKey: l.altKey, cancelable: !0 }));
  }, s = tc({ render: () => Ta(Qc, { session: t, canvasWheel: r }) }), o = { session: t, vue: s, dom: n, key: null };
  Tt.set(e, o), zt.add(e);
  try {
    s.mount(i);
  } catch (l) {
    throw Tt.delete(e), zt.delete(e), s.unmount(), l;
  }
  return o;
}
function Co(e) {
  var o, l, a;
  if (Tt.has(e)) return;
  const t = Ro(e);
  if (!t) return;
  t.hidden = !0;
  let i = (o = e.widgets) == null ? void 0 : o.find((f) => f.name === "Retry surface");
  i || (i = e.addWidget("button", "Retry surface", null, () => Co(e)), i.serialize = !1);
  let n, r, s;
  try {
    n = cf(e, t);
    const f = document.createElement("div");
    f.className = "ss-widget-root", f.style.cssText = `width:100%;height:100%;min-width:0;min-height:${Yt.minHeight}px;position:relative;overflow:hidden`, s = e.addDOMWidget("slap_stickers_surface", `slap-stickers:${++lf}`, f, { serialize: !1, hideOnZoom: !1, hideInPanel: !0, getMinHeight: () => Yt.minHeight, getHeight: () => Yt.minHeight }), s.serialize = !1;
    const c = (l = s.computeLayoutSize) == null ? void 0 : l.bind(s);
    s.computeLayoutSize = (b) => {
      const T = (c == null ? void 0 : c(b)) ?? {};
      return { ...T, minWidth: Math.max(Yt.minWidth, T.minWidth ?? 0), minHeight: Math.max(Yt.minHeight, T.minHeight ?? 0) };
    }, r = ff(e, n, f, s).vue, i.hidden = !0;
    const d = s.onRemove;
    let v = !1;
    s.onRemove = function(...b) {
      v || (v = !0, d == null || d.apply(this, b), Po(e));
    };
    const w = t.callback;
    t.callback = function(...b) {
      const T = w == null ? void 0 : w.apply(this, b), y = String(t.value ?? "");
      return b[0] !== void 0 && y !== wi(n.model.state) && n.setState(y), T;
    };
    const p = (a = Lt.nodeOutputs) == null ? void 0 : a[String(e.id)];
    p && ni(e, p);
  } catch (f) {
    Tt.delete(e), zt.delete(e), r == null || r.unmount(), n == null || n.dispose(), s && e.removeWidget(s), i.hidden = !1, console.error("[Slap Stickers] Could not attach the surface", f);
  }
}
function Po(e) {
  const t = Tt.get(e);
  t && (Tt.delete(e), zt.delete(e), t.vue.unmount(), t.session.dispose());
}
Lt.registerExtension({
  name: "alp-dot.SlapStickers",
  beforeRegisterNodeDef(e, t) {
    var o, l;
    if (t.name !== "SurfaceStickers") return;
    const i = e.prototype.onExecuted, n = e.prototype.onRemoved, r = e.prototype.onConfigure;
    e.prototype.onExecuted = function(a) {
      const f = i == null ? void 0 : i.apply(this, arguments);
      return ni(this, a), f;
    }, e.prototype.onRemoved = function() {
      return Po(this), n == null ? void 0 : n.apply(this, arguments);
    };
    const s = { ...(o = t.input) == null ? void 0 : o.required, ...(l = t.input) == null ? void 0 : l.optional };
    e.prototype.onConfigure = function() {
      var c, d, v, w;
      const a = r == null ? void 0 : r.apply(this, arguments);
      for (const p of this.inputs ?? []) {
        const b = (d = (c = s[p.name]) == null ? void 0 : c[1]) == null ? void 0 : d.display_name;
        b && (p.label = b);
      }
      const f = Tt.get(this);
      return f && (f.session.setState(String(((v = Ro(this)) == null ? void 0 : v.value) ?? "")), ni(this, (w = Lt.nodeOutputs) == null ? void 0 : w[String(this.id)])), a;
    };
  },
  nodeCreated(e) {
    e.comfyClass !== "SurfaceStickers" && e.constructor.comfyClass !== "SurfaceStickers" || (Co(e), e.setSize([Math.max(e.size[0], 640), Math.max(e.size[1], 600)]));
  },
  afterConfigureGraph() {
    var e;
    for (const t of zt) ni(t, (e = Lt.nodeOutputs) == null ? void 0 : e[String(t.id)]);
  },
  onNodeOutputsUpdated(e) {
    for (const t of zt) {
      const i = e == null ? void 0 : e[String(t.id)];
      i && ni(t, i);
    }
  }
});
