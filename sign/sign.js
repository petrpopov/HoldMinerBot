// import {W as be} from "./vendor";

let SF = !1,
    CF = !1;
const S2 = { debug: 1, default: 2, info: 2, warning: 3, error: 4, off: 5 };
let _F = S2.default,
    i_ = null;
const TF = "0123456789abcdef";

function rEe() {
    try {
        const t = [];
        if (
            (["NFD", "NFC", "NFKD", "NFKC"].forEach((e) => {
                try {
                    if ("test".normalize(e) !== "test") throw new Error("bad normalize");
                } catch {
                    t.push(e);
                }
            }),
                t.length)
        )
            throw new Error("missing " + t.join(", "));
        if ("é".normalize("NFD") !== "é") throw new Error("broken implementation");
    } catch (t) {
        return t.message;
    }
    return null;
}
const PF = rEe();
class ee {
    constructor(e) {
        Object.defineProperty(this, "version", {
            enumerable: !0,
            value: e,
            writable: !1,
        });
    }
    _log(e, r) {
        const n = e.toLowerCase();
        S2[n] == null &&
        this.throwArgumentError("invalid log level name", "logLevel", e),
        !(_F > S2[n]) && console.log.apply(console, r);
    }
    debug(...e) {
        this._log(ee.levels.DEBUG, e);
    }
    info(...e) {
        this._log(ee.levels.INFO, e);
    }
    warn(...e) {
        this._log(ee.levels.WARNING, e);
    }
    makeError(e, r, n) {
        if (CF) return this.makeError("censored error", r, {});
        r || (r = ee.errors.UNKNOWN_ERROR), n || (n = {});
        const i = [];
        Object.keys(n).forEach((c) => {
            const l = n[c];
            try {
                if (l instanceof Uint8Array) {
                    let u = "";
                    for (let f = 0; f < l.length; f++)
                        (u += TF[l[f] >> 4]), (u += TF[l[f] & 15]);
                    i.push(c + "=Uint8Array(0x" + u + ")");
                } else i.push(c + "=" + JSON.stringify(l));
            } catch {
                i.push(c + "=" + JSON.stringify(n[c].toString()));
            }
        }),
            i.push(`code=${r}`),
            i.push(`version=${this.version}`);
        const o = e;
        let s = "";
        switch (r) {
            case ea.NUMERIC_FAULT: {
                s = "NUMERIC_FAULT";
                const c = e;
                switch (c) {
                    case "overflow":
                    case "underflow":
                    case "division-by-zero":
                        s += "-" + c;
                        break;
                    case "negative-power":
                    case "negative-width":
                        s += "-unsupported";
                        break;
                    case "unbound-bitwise-result":
                        s += "-unbound-result";
                        break;
                }
                break;
            }
            case ea.CALL_EXCEPTION:
            case ea.INSUFFICIENT_FUNDS:
            case ea.MISSING_NEW:
            case ea.NONCE_EXPIRED:
            case ea.REPLACEMENT_UNDERPRICED:
            case ea.TRANSACTION_REPLACED:
            case ea.UNPREDICTABLE_GAS_LIMIT:
                s = r;
                break;
        }
        s && (e += " [ See: https://links.ethers.org/v5-errors-" + s + " ]"),
        i.length && (e += " (" + i.join(", ") + ")");
        const a = new Error(e);
        return (
            (a.reason = o),
                (a.code = r),
                Object.keys(n).forEach(function (c) {
                    a[c] = n[c];
                }),
                a
        );
    }
    throwError(e, r, n) {
        throw this.makeError(e, r, n);
    }
    throwArgumentError(e, r, n) {
        return this.throwError(e, ee.errors.INVALID_ARGUMENT, {
            argument: r,
            value: n,
        });
    }
    assert(e, r, n, i) {
        e || this.throwError(r, n, i);
    }
    assertArgument(e, r, n, i) {
        e || this.throwArgumentError(r, n, i);
    }
    checkNormalize(e) {
        PF &&
        this.throwError(
            "platform missing String.prototype.normalize",
            ee.errors.UNSUPPORTED_OPERATION,
            { operation: "String.prototype.normalize", form: PF },
        );
    }
    checkSafeUint53(e, r) {
        typeof e == "number" &&
        (r == null && (r = "value not safe"),
        (e < 0 || e >= 9007199254740991) &&
        this.throwError(r, ee.errors.NUMERIC_FAULT, {
            operation: "checkSafeInteger",
            fault: "out-of-safe-range",
            value: e,
        }),
        e % 1 &&
        this.throwError(r, ee.errors.NUMERIC_FAULT, {
            operation: "checkSafeInteger",
            fault: "non-integer",
            value: e,
        }));
    }
    checkArgumentCount(e, r, n) {
        n ? (n = ": " + n) : (n = ""),
        e < r &&
        this.throwError("missing argument" + n, ee.errors.MISSING_ARGUMENT, {
            count: e,
            expectedCount: r,
        }),
        e > r &&
        this.throwError(
            "too many arguments" + n,
            ee.errors.UNEXPECTED_ARGUMENT,
            { count: e, expectedCount: r },
        );
    }
    checkNew(e, r) {
        (e === Object || e == null) &&
        this.throwError("missing new", ee.errors.MISSING_NEW, { name: r.name });
    }
    checkAbstract(e, r) {
        e === r
            ? this.throwError(
                "cannot instantiate abstract class " +
                JSON.stringify(r.name) +
                " directly; use a sub-class",
                ee.errors.UNSUPPORTED_OPERATION,
                { name: e.name, operation: "new" },
            )
            : (e === Object || e == null) &&
            this.throwError("missing new", ee.errors.MISSING_NEW, { name: r.name });
    }
    static globalLogger() {
        return i_ || (i_ = new ee(tEe)), i_;
    }
    static setCensorship(e, r) {
        if (
            (!e &&
            r &&
            this.globalLogger().throwError(
                "cannot permanently disable censorship",
                ee.errors.UNSUPPORTED_OPERATION,
                { operation: "setCensorship" },
            ),
                SF)
        ) {
            if (!e) return;
            this.globalLogger().throwError(
                "error censorship permanent",
                ee.errors.UNSUPPORTED_OPERATION,
                { operation: "setCensorship" },
            );
        }
        (CF = !!e), (SF = !!r);
    }
    static setLogLevel(e) {
        const r = S2[e.toLowerCase()];
        if (r == null) {
            ee.globalLogger().warn("invalid log level - " + e);
            return;
        }
        _F = r;
    }
    static from(e) {
        return new ee(e);
    }
}
var zw;
(function (t) {
    (t.DEBUG = "DEBUG"),
        (t.INFO = "INFO"),
        (t.WARNING = "WARNING"),
        (t.ERROR = "ERROR"),
        (t.OFF = "OFF");
})(zw || (zw = {}));
var ea;
(function (t) {
    (t.UNKNOWN_ERROR = "UNKNOWN_ERROR"),
        (t.NOT_IMPLEMENTED = "NOT_IMPLEMENTED"),
        (t.UNSUPPORTED_OPERATION = "UNSUPPORTED_OPERATION"),
        (t.NETWORK_ERROR = "NETWORK_ERROR"),
        (t.SERVER_ERROR = "SERVER_ERROR"),
        (t.TIMEOUT = "TIMEOUT"),
        (t.BUFFER_OVERRUN = "BUFFER_OVERRUN"),
        (t.NUMERIC_FAULT = "NUMERIC_FAULT"),
        (t.MISSING_NEW = "MISSING_NEW"),
        (t.INVALID_ARGUMENT = "INVALID_ARGUMENT"),
        (t.MISSING_ARGUMENT = "MISSING_ARGUMENT"),
        (t.UNEXPECTED_ARGUMENT = "UNEXPECTED_ARGUMENT"),
        (t.CALL_EXCEPTION = "CALL_EXCEPTION"),
        (t.INSUFFICIENT_FUNDS = "INSUFFICIENT_FUNDS"),
        (t.NONCE_EXPIRED = "NONCE_EXPIRED"),
        (t.REPLACEMENT_UNDERPRICED = "REPLACEMENT_UNDERPRICED"),
        (t.UNPREDICTABLE_GAS_LIMIT = "UNPREDICTABLE_GAS_LIMIT"),
        (t.TRANSACTION_REPLACED = "TRANSACTION_REPLACED"),
        (t.ACTION_REJECTED = "ACTION_REJECTED");
})(ea || (ea = {}));
ee.errors = ea;
ee.levels = zw;


const YAe = "abstract-signer/5.7.0";
var Aa = function (t, e, r, n) {
    function i(o) {
        return o instanceof r
            ? o
            : new r(function (s) {
                s(o);
            });
    }
    return new (r || (r = Promise))(function (o, s) {
        function a(u) {
            try {
                l(n.next(u));
            } catch (f) {
                s(f);
            }
        }
        function c(u) {
            try {
                l(n.throw(u));
            } catch (f) {
                s(f);
            }
        }
        function l(u) {
            u.done ? o(u.value) : i(u.value).then(a, c);
        }
        l((n = n.apply(t, e || [])).next());
    });
};
const Ks = new ee(YAe),
    e3e = [
        "accessList",
        "ccipReadEnabled",
        "chainId",
        "customData",
        "data",
        "from",
        "gasLimit",
        "gasPrice",
        "maxFeePerGas",
        "maxPriorityFeePerGas",
        "nonce",
        "to",
        "type",
        "value",
    ],
    t3e = [
        ee.errors.INSUFFICIENT_FUNDS,
        ee.errors.NONCE_EXPIRED,
        ee.errors.REPLACEMENT_UNDERPRICED,
    ];

function fe(t, e, r) {
    Object.defineProperty(t, e, { enumerable: !0, value: r, writable: !1 });
}
class qm {
    constructor() {
        Ks.checkAbstract(new.target, qm), fe(this, "_isSigner", !0);
    }
    getBalance(e) {
        return Aa(this, void 0, void 0, function* () {
            return (
                this._checkProvider("getBalance"),
                    yield this.provider.getBalance(this.getAddress(), e)
            );
        });
    }
    getTransactionCount(e) {
        return Aa(this, void 0, void 0, function* () {
            return (
                this._checkProvider("getTransactionCount"),
                    yield this.provider.getTransactionCount(this.getAddress(), e)
            );
        });
    }
    estimateGas(e) {
        return Aa(this, void 0, void 0, function* () {
            this._checkProvider("estimateGas");
            const r = yield Rn(this.checkTransaction(e));
            return yield this.provider.estimateGas(r);
        });
    }
    call(e, r) {
        return Aa(this, void 0, void 0, function* () {
            this._checkProvider("call");
            const n = yield Rn(this.checkTransaction(e));
            return yield this.provider.call(n, r);
        });
    }
    sendTransaction(e) {
        return Aa(this, void 0, void 0, function* () {
            this._checkProvider("sendTransaction");
            const r = yield this.populateTransaction(e),
                n = yield this.signTransaction(r);
            return yield this.provider.sendTransaction(n);
        });
    }
    getChainId() {
        return Aa(this, void 0, void 0, function* () {
            return (
                this._checkProvider("getChainId"),
                    (yield this.provider.getNetwork()).chainId
            );
        });
    }
    getGasPrice() {
        return Aa(this, void 0, void 0, function* () {
            return (
                this._checkProvider("getGasPrice"), yield this.provider.getGasPrice()
            );
        });
    }
    getFeeData() {
        return Aa(this, void 0, void 0, function* () {
            return (
                this._checkProvider("getFeeData"), yield this.provider.getFeeData()
            );
        });
    }
    resolveName(e) {
        return Aa(this, void 0, void 0, function* () {
            return (
                this._checkProvider("resolveName"), yield this.provider.resolveName(e)
            );
        });
    }
    checkTransaction(e) {
        for (const n in e)
            e3e.indexOf(n) === -1 &&
            Ks.throwArgumentError(
                "invalid transaction key: " + n,
                "transaction",
                e,
            );
        const r = cn(e);
        return (
            r.from == null
                ? (r.from = this.getAddress())
                : (r.from = Promise.all([
                    Promise.resolve(r.from),
                    this.getAddress(),
                ]).then(
                    (n) => (
                        n[0].toLowerCase() !== n[1].toLowerCase() &&
                        Ks.throwArgumentError(
                            "from address mismatch",
                            "transaction",
                            e,
                        ),
                            n[0]
                    ),
                )),
                r
        );
    }
    populateTransaction(e) {
        return Aa(this, void 0, void 0, function* () {
            const r = yield Rn(this.checkTransaction(e));
            r.to != null &&
            ((r.to = Promise.resolve(r.to).then((i) =>
                Aa(this, void 0, void 0, function* () {
                    if (i == null) return null;
                    const o = yield this.resolveName(i);
                    return (
                        o == null &&
                        Ks.throwArgumentError(
                            "provided ENS name resolves to null",
                            "tx.to",
                            i,
                        ),
                            o
                    );
                }),
            )),
                r.to.catch((i) => {}));
            const n = r.maxFeePerGas != null || r.maxPriorityFeePerGas != null;
            if (
                (r.gasPrice != null && (r.type === 2 || n)
                    ? Ks.throwArgumentError(
                        "eip-1559 transaction do not support gasPrice",
                        "transaction",
                        e,
                    )
                    : (r.type === 0 || r.type === 1) &&
                    n &&
                    Ks.throwArgumentError(
                        "pre-eip-1559 transaction do not support maxFeePerGas/maxPriorityFeePerGas",
                        "transaction",
                        e,
                    ),
                (r.type === 2 || r.type == null) &&
                r.maxFeePerGas != null &&
                r.maxPriorityFeePerGas != null)
            )
                r.type = 2;
            else if (r.type === 0 || r.type === 1)
                r.gasPrice == null && (r.gasPrice = this.getGasPrice());
            else {
                const i = yield this.getFeeData();
                if (r.type == null)
                    if (i.maxFeePerGas != null && i.maxPriorityFeePerGas != null)
                        if (((r.type = 2), r.gasPrice != null)) {
                            const o = r.gasPrice;
                            delete r.gasPrice,
                                (r.maxFeePerGas = o),
                                (r.maxPriorityFeePerGas = o);
                        } else
                            r.maxFeePerGas == null && (r.maxFeePerGas = i.maxFeePerGas),
                            r.maxPriorityFeePerGas == null &&
                            (r.maxPriorityFeePerGas = i.maxPriorityFeePerGas);
                    else
                        i.gasPrice != null
                            ? (n &&
                            Ks.throwError(
                                "network does not support EIP-1559",
                                ee.errors.UNSUPPORTED_OPERATION,
                                { operation: "populateTransaction" },
                            ),
                            r.gasPrice == null && (r.gasPrice = i.gasPrice),
                                (r.type = 0))
                            : Ks.throwError(
                                "failed to get consistent fee data",
                                ee.errors.UNSUPPORTED_OPERATION,
                                { operation: "signer.getFeeData" },
                            );
                else
                    r.type === 2 &&
                    (r.maxFeePerGas == null && (r.maxFeePerGas = i.maxFeePerGas),
                    r.maxPriorityFeePerGas == null &&
                    (r.maxPriorityFeePerGas = i.maxPriorityFeePerGas));
            }
            return (
                r.nonce == null && (r.nonce = this.getTransactionCount("pending")),
                r.gasLimit == null &&
                (r.gasLimit = this.estimateGas(r).catch((i) => {
                    if (t3e.indexOf(i.code) >= 0) throw i;
                    return Ks.throwError(
                        "cannot estimate gas; transaction may fail or may require manual gas limit",
                        ee.errors.UNPREDICTABLE_GAS_LIMIT,
                        { error: i, tx: r },
                    );
                })),
                    r.chainId == null
                        ? (r.chainId = this.getChainId())
                        : (r.chainId = Promise.all([
                            Promise.resolve(r.chainId),
                            this.getChainId(),
                        ]).then(
                            (i) => (
                                i[1] !== 0 &&
                                i[0] !== i[1] &&
                                Ks.throwArgumentError(
                                    "chainId address mismatch",
                                    "transaction",
                                    e,
                                ),
                                    i[0]
                            ),
                        )),
                    yield Rn(r)
            );
        });
    }
    _checkProvider(e) {
        this.provider ||
        Ks.throwError("missing provider", ee.errors.UNSUPPORTED_OPERATION, {
            operation: e || "_checkProvider",
        });
    }
    static isSigner(e) {
        return !!(e && e._isSigner);
    }
}

iEe = "bytes/5.7.0",
    Tn = new ee(iEe);
function iq(t) {
    return !!t.toHexString;
}
function zt(t, e) {
    return !(
        typeof t != "string" ||
        !t.match(/^0x[0-9A-Fa-f]*$/) ||
        (e && t.length !== 2 + 2 * e)
    );
}
function pp(t) {
    return (
        t.slice ||
        (t.slice = function () {
            const e = Array.prototype.slice.call(arguments);
            return pp(new Uint8Array(Array.prototype.slice.apply(t, e)));
        }),
            t
    );
}

function RF(t) {
    return typeof t == "number" && t == t && t % 1 === 0;
}
function D0(t) {
    if (t == null) return !1;
    if (t.constructor === Uint8Array) return !0;
    if (typeof t == "string" || !RF(t.length) || t.length < 0) return !1;
    for (let e = 0; e < t.length; e++) {
        const r = t[e];
        if (!RF(r) || r < 0 || r >= 256) return !1;
    }
    return !0;
}
function Se(t, e) {
    if ((e || (e = {}), typeof t == "number")) {
        Tn.checkSafeUint53(t, "invalid arrayify value");
        const r = [];
        for (; t; ) r.unshift(t & 255), (t = parseInt(String(t / 256)));
        return r.length === 0 && r.push(0), pp(new Uint8Array(r));
    }
    if (
        (e.allowMissingPrefix &&
        typeof t == "string" &&
        t.substring(0, 2) !== "0x" &&
        (t = "0x" + t),
        iq(t) && (t = t.toHexString()),
            zt(t))
    ) {
        let r = t.substring(2);
        r.length % 2 &&
        (e.hexPad === "left"
            ? (r = "0" + r)
            : e.hexPad === "right"
                ? (r += "0")
                : Tn.throwArgumentError("hex data is odd-length", "value", t));
        const n = [];
        for (let i = 0; i < r.length; i += 2)
            n.push(parseInt(r.substring(i, i + 2), 16));
        return pp(new Uint8Array(n));
    }
    return D0(t)
        ? pp(new Uint8Array(t))
        : Tn.throwArgumentError("invalid arrayify value", "value", t);
}


function Zm(t, e, r) {
    return (
        (r = {
            path: e,
            exports: {},
            require: function (n, i) {
                return RSe(n, i ?? r.path);
            },
        }),
            t(r, r.exports),
            r.exports
    );
}



function Zf(t, e) {
    (this.type = t),
        (this.p = new Bt(e.p, 16)),
        (this.red = e.prime ? Bt.red(e.prime) : Bt.mont(this.p)),
        (this.zero = new Bt(0).toRed(this.red)),
        (this.one = new Bt(1).toRed(this.red)),
        (this.two = new Bt(2).toRed(this.red)),
        (this.n = e.n && new Bt(e.n, 16)),
        (this.g = e.g && this.pointFromJSON(e.g, e.gRed)),
        (this._wnafT1 = new Array(4)),
        (this._wnafT2 = new Array(4)),
        (this._wnafT3 = new Array(4)),
        (this._wnafT4 = new Array(4)),
        (this._bitLength = this.n ? this.n.bitLength() : 0);
    var r = this.n && this.p.div(this.n);
    !r || r.cmpn(100) > 0
        ? (this.redN = null)
        : ((this._maxwellTrick = !0), (this.redN = this.n.toRed(this.red)));
}
var $0 = Zf;
Zf.prototype.point = function () {
    throw new Error("Not implemented");
};
Zf.prototype.validate = function () {
    throw new Error("Not implemented");
};
Zf.prototype._fixedNafMul = function (e, r) {
    Qw(e.precomputed);
    var n = e._getDoubles(),
        i = Kw(r, 1, this._bitLength),
        o = (1 << (n.step + 1)) - (n.step % 2 === 0 ? 2 : 1);
    o /= 3;
    var s = [],
        a,
        c;
    for (a = 0; a < i.length; a += n.step) {
        c = 0;
        for (var l = a + n.step - 1; l >= a; l--) c = (c << 1) + i[l];
        s.push(c);
    }
    for (
        var u = this.jpoint(null, null, null),
            f = this.jpoint(null, null, null),
            h = o;
        h > 0;
        h--
    ) {
        for (a = 0; a < s.length; a++)
            (c = s[a]),
                c === h
                    ? (f = f.mixedAdd(n.points[a]))
                    : c === -h && (f = f.mixedAdd(n.points[a].neg()));
        u = u.add(f);
    }
    return u.toP();
};
Zf.prototype._wnafMul = function (e, r) {
    var n = 4,
        i = e._getNAFPoints(n);
    n = i.wnd;
    for (
        var o = i.points,
            s = Kw(r, n, this._bitLength),
            a = this.jpoint(null, null, null),
            c = s.length - 1;
        c >= 0;
        c--
    ) {
        for (var l = 0; c >= 0 && s[c] === 0; c--) l++;
        if ((c >= 0 && l++, (a = a.dblp(l)), c < 0)) break;
        var u = s[c];
        Qw(u !== 0),
            e.type === "affine"
                ? u > 0
                    ? (a = a.mixedAdd(o[(u - 1) >> 1]))
                    : (a = a.mixedAdd(o[(-u - 1) >> 1].neg()))
                : u > 0
                    ? (a = a.add(o[(u - 1) >> 1]))
                    : (a = a.add(o[(-u - 1) >> 1].neg()));
    }
    return e.type === "affine" ? a.toP() : a;
};
Zf.prototype._wnafMulAdd = function (e, r, n, i, o) {
    var s = this._wnafT1,
        a = this._wnafT2,
        c = this._wnafT3,
        l = 0,
        u,
        f,
        h;
    for (u = 0; u < i; u++) {
        h = r[u];
        var m = h._getNAFPoints(e);
        (s[u] = m.wnd), (a[u] = m.points);
    }
    for (u = i - 1; u >= 1; u -= 2) {
        var y = u - 1,
            g = u;
        if (s[y] !== 1 || s[g] !== 1) {
            (c[y] = Kw(n[y], s[y], this._bitLength)),
                (c[g] = Kw(n[g], s[g], this._bitLength)),
                (l = Math.max(c[y].length, l)),
                (l = Math.max(c[g].length, l));
            continue;
        }
        var v = [r[y], null, null, r[g]];
        r[y].y.cmp(r[g].y) === 0
            ? ((v[1] = r[y].add(r[g])), (v[2] = r[y].toJ().mixedAdd(r[g].neg())))
            : r[y].y.cmp(r[g].y.redNeg()) === 0
                ? ((v[1] = r[y].toJ().mixedAdd(r[g])), (v[2] = r[y].add(r[g].neg())))
                : ((v[1] = r[y].toJ().mixedAdd(r[g])),
                    (v[2] = r[y].toJ().mixedAdd(r[g].neg())));
        var x = [-3, -1, -5, -7, 0, 7, 5, 1, 3],
            b = ISe(n[y], n[g]);
        for (
            l = Math.max(b[0].length, l),
                c[y] = new Array(l),
                c[g] = new Array(l),
                f = 0;
            f < l;
            f++
        ) {
            var w = b[0][f] | 0,
                S = b[1][f] | 0;
            (c[y][f] = x[(w + 1) * 3 + (S + 1)]), (c[g][f] = 0), (a[y] = v);
        }
    }
    var P = this.jpoint(null, null, null),
        O = this._wnafT4;
    for (u = l; u >= 0; u--) {
        for (var B = 0; u >= 0; ) {
            var k = !0;
            for (f = 0; f < i; f++) (O[f] = c[f][u] | 0), O[f] !== 0 && (k = !1);
            if (!k) break;
            B++, u--;
        }
        if ((u >= 0 && B++, (P = P.dblp(B)), u < 0)) break;
        for (f = 0; f < i; f++) {
            var z = O[f];
            z !== 0 &&
            (z > 0
                ? (h = a[f][(z - 1) >> 1])
                : z < 0 && (h = a[f][(-z - 1) >> 1].neg()),
                h.type === "affine" ? (P = P.mixedAdd(h)) : (P = P.add(h)));
        }
    }
    for (u = 0; u < i; u++) a[u] = null;
    return o ? P : P.toP();
};
function ma(t, e) {
    (this.curve = t), (this.type = e), (this.precomputed = null);
}
Zf.BasePoint = ma;
ma.prototype.eq = function () {
    throw new Error("Not implemented");
};
ma.prototype.validate = function () {
    return this.curve.validate(this);
};
Zf.prototype.decodePoint = function (e, r) {
    e = _s.toArray(e, r);
    var n = this.p.byteLength();
    if ((e[0] === 4 || e[0] === 6 || e[0] === 7) && e.length - 1 === 2 * n) {
        e[0] === 6
            ? Qw(e[e.length - 1] % 2 === 0)
            : e[0] === 7 && Qw(e[e.length - 1] % 2 === 1);
        var i = this.point(e.slice(1, 1 + n), e.slice(1 + n, 1 + 2 * n));
        return i;
    } else if ((e[0] === 2 || e[0] === 3) && e.length - 1 === n)
        return this.pointFromX(e.slice(1, 1 + n), e[0] === 3);
    throw new Error("Unknown point format");
};
ma.prototype.encodeCompressed = function (e) {
    return this.encode(e, !0);
};
ma.prototype._encode = function (e) {
    var r = this.curve.p.byteLength(),
        n = this.getX().toArray("be", r);
    return e
        ? [this.getY().isEven() ? 2 : 3].concat(n)
        : [4].concat(n, this.getY().toArray("be", r));
};
ma.prototype.encode = function (e, r) {
    return _s.encode(this._encode(r), e);
};
ma.prototype.precompute = function (e) {
    if (this.precomputed) return this;
    var r = { doubles: null, naf: null, beta: null };
    return (
        (r.naf = this._getNAFPoints(8)),
            (r.doubles = this._getDoubles(4, e)),
            (r.beta = this._getBeta()),
            (this.precomputed = r),
            this
    );
};
ma.prototype._hasDoubles = function (e) {
    if (!this.precomputed) return !1;
    var r = this.precomputed.doubles;
    return r ? r.points.length >= Math.ceil((e.bitLength() + 1) / r.step) : !1;
};
ma.prototype._getDoubles = function (e, r) {
    if (this.precomputed && this.precomputed.doubles)
        return this.precomputed.doubles;
    for (var n = [this], i = this, o = 0; o < r; o += e) {
        for (var s = 0; s < e; s++) i = i.dbl();
        n.push(i);
    }
    return { step: e, points: n };
};
ma.prototype._getNAFPoints = function (e) {
    if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
    for (
        var r = [this], n = (1 << e) - 1, i = n === 1 ? null : this.dbl(), o = 1;
        o < n;
        o++
    )
        r[o] = r[o - 1].add(i);
    return { wnd: e, points: r };
};
ma.prototype._getBeta = function () {
    return null;
};
ma.prototype.dblp = function (e) {
    for (var r = this, n = 0; n < e; n++) r = r.dbl();
    return r;
};

var f9 = lK;
function lK(t, e) {
    if (!t) throw new Error(e || "Assertion failed");
}
lK.equal = function (e, r, n) {
    if (e != r) throw new Error(n || "Assertion failed: " + e + " != " + r);
};
var ja = Zm(function (t, e) {
        var r = e;
        function n(s, a) {
            if (Array.isArray(s)) return s.slice();
            if (!s) return [];
            var c = [];
            if (typeof s != "string") {
                for (var l = 0; l < s.length; l++) c[l] = s[l] | 0;
                return c;
            }
            if (a === "hex") {
                (s = s.replace(/[^a-z0-9]+/gi, "")),
                s.length % 2 !== 0 && (s = "0" + s);
                for (var l = 0; l < s.length; l += 2)
                    c.push(parseInt(s[l] + s[l + 1], 16));
            } else
                for (var l = 0; l < s.length; l++) {
                    var u = s.charCodeAt(l),
                        f = u >> 8,
                        h = u & 255;
                    f ? c.push(f, h) : c.push(h);
                }
            return c;
        }
        r.toArray = n;
        function i(s) {
            return s.length === 1 ? "0" + s : s;
        }
        r.zero2 = i;
        function o(s) {
            for (var a = "", c = 0; c < s.length; c++) a += i(s[c].toString(16));
            return a;
        }
        (r.toHex = o),
            (r.encode = function (a, c) {
                return c === "hex" ? o(a) : a;
            });
    }),
    _s = Zm(function (t, e) {
        var r = e;
        (r.assert = f9),
            (r.toArray = ja.toArray),
            (r.zero2 = ja.zero2),
            (r.toHex = ja.toHex),
            (r.encode = ja.encode);
        function n(c, l, u) {
            var f = new Array(Math.max(c.bitLength(), u) + 1);
            f.fill(0);
            for (var h = 1 << (l + 1), m = c.clone(), y = 0; y < f.length; y++) {
                var g,
                    v = m.andln(h - 1);
                m.isOdd()
                    ? (v > (h >> 1) - 1 ? (g = (h >> 1) - v) : (g = v), m.isubn(g))
                    : (g = 0),
                    (f[y] = g),
                    m.iushrn(1);
            }
            return f;
        }
        r.getNAF = n;
        function i(c, l) {
            var u = [[], []];
            (c = c.clone()), (l = l.clone());
            for (var f = 0, h = 0, m; c.cmpn(-f) > 0 || l.cmpn(-h) > 0; ) {
                var y = (c.andln(3) + f) & 3,
                    g = (l.andln(3) + h) & 3;
                y === 3 && (y = -1), g === 3 && (g = -1);
                var v;
                y & 1
                    ? ((m = (c.andln(7) + f) & 7),
                        (m === 3 || m === 5) && g === 2 ? (v = -y) : (v = y))
                    : (v = 0),
                    u[0].push(v);
                var x;
                g & 1
                    ? ((m = (l.andln(7) + h) & 7),
                        (m === 3 || m === 5) && y === 2 ? (x = -g) : (x = g))
                    : (x = 0),
                    u[1].push(x),
                2 * f === v + 1 && (f = 1 - f),
                2 * h === x + 1 && (h = 1 - h),
                    c.iushrn(1),
                    l.iushrn(1);
            }
            return u;
        }
        r.getJSF = i;
        function o(c, l, u) {
            var f = "_" + l;
            c.prototype[l] = function () {
                return this[f] !== void 0 ? this[f] : (this[f] = u.call(this));
            };
        }
        r.cachedProperty = o;
        function s(c) {
            return typeof c == "string" ? r.toArray(c, "hex") : c;
        }
        r.parseBytes = s;
        function a(c) {
            return new Bt(c, "hex", "le");
        }
        r.intFromLE = a;
    }),
    Kw = _s.getNAF,
    ISe = _s.getJSF,
    Qw = _s.assert;

var d9 = Zm(function (t) {
        typeof Object.create == "function"
            ? (t.exports = function (r, n) {
                n &&
                ((r.super_ = n),
                    (r.prototype = Object.create(n.prototype, {
                        constructor: {
                            value: r,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0,
                        },
                    })));
            })
            : (t.exports = function (r, n) {
                if (n) {
                    r.super_ = n;
                    var i = function () {};
                    (i.prototype = n.prototype),
                        (r.prototype = new i()),
                        (r.prototype.constructor = r);
                }
            });
    }),
    OSe = _s.assert;
function ga(t) {
    $0.call(this, "short", t),
        (this.a = new Bt(t.a, 16).toRed(this.red)),
        (this.b = new Bt(t.b, 16).toRed(this.red)),
        (this.tinv = this.two.redInvm()),
        (this.zeroA = this.a.fromRed().cmpn(0) === 0),
        (this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0),
        (this.endo = this._getEndomorphism(t)),
        (this._endoWnafT1 = new Array(4)),
        (this._endoWnafT2 = new Array(4));
}
d9(ga, $0);
var kSe = ga;
ga.prototype._getEndomorphism = function (e) {
    if (!(!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)) {
        var r, n;
        if (e.beta) r = new Bt(e.beta, 16).toRed(this.red);
        else {
            var i = this._getEndoRoots(this.p);
            (r = i[0].cmp(i[1]) < 0 ? i[0] : i[1]), (r = r.toRed(this.red));
        }
        if (e.lambda) n = new Bt(e.lambda, 16);
        else {
            var o = this._getEndoRoots(this.n);
            this.g.mul(o[0]).x.cmp(this.g.x.redMul(r)) === 0
                ? (n = o[0])
                : ((n = o[1]), OSe(this.g.mul(n).x.cmp(this.g.x.redMul(r)) === 0));
        }
        var s;
        return (
            e.basis
                ? (s = e.basis.map(function (a) {
                    return { a: new Bt(a.a, 16), b: new Bt(a.b, 16) };
                }))
                : (s = this._getEndoBasis(n)),
                { beta: r, lambda: n, basis: s }
        );
    }
};
ga.prototype._getEndoRoots = function (e) {
    var r = e === this.p ? this.red : Bt.mont(e),
        n = new Bt(2).toRed(r).redInvm(),
        i = n.redNeg(),
        o = new Bt(3).toRed(r).redNeg().redSqrt().redMul(n),
        s = i.redAdd(o).fromRed(),
        a = i.redSub(o).fromRed();
    return [s, a];
};
ga.prototype._getEndoBasis = function (e) {
    for (
        var r = this.n.ushrn(Math.floor(this.n.bitLength() / 2)),
            n = e,
            i = this.n.clone(),
            o = new Bt(1),
            s = new Bt(0),
            a = new Bt(0),
            c = new Bt(1),
            l,
            u,
            f,
            h,
            m,
            y,
            g,
            v = 0,
            x,
            b;
        n.cmpn(0) !== 0;

    ) {
        var w = i.div(n);
        (x = i.sub(w.mul(n))), (b = a.sub(w.mul(o)));
        var S = c.sub(w.mul(s));
        if (!f && x.cmp(r) < 0) (l = g.neg()), (u = o), (f = x.neg()), (h = b);
        else if (f && ++v === 2) break;
        (g = x), (i = n), (n = x), (a = o), (o = b), (c = s), (s = S);
    }
    (m = x.neg()), (y = b);
    var P = f.sqr().add(h.sqr()),
        O = m.sqr().add(y.sqr());
    return (
        O.cmp(P) >= 0 && ((m = l), (y = u)),
        f.negative && ((f = f.neg()), (h = h.neg())),
        m.negative && ((m = m.neg()), (y = y.neg())),
            [
                { a: f, b: h },
                { a: m, b: y },
            ]
    );
};
ga.prototype._endoSplit = function (e) {
    var r = this.endo.basis,
        n = r[0],
        i = r[1],
        o = i.b.mul(e).divRound(this.n),
        s = n.b.neg().mul(e).divRound(this.n),
        a = o.mul(n.a),
        c = s.mul(i.a),
        l = o.mul(n.b),
        u = s.mul(i.b),
        f = e.sub(a).sub(c),
        h = l.add(u).neg();
    return { k1: f, k2: h };
};
ga.prototype.pointFromX = function (e, r) {
    (e = new Bt(e, 16)), e.red || (e = e.toRed(this.red));
    var n = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b),
        i = n.redSqrt();
    if (i.redSqr().redSub(n).cmp(this.zero) !== 0)
        throw new Error("invalid point");
    var o = i.fromRed().isOdd();
    return ((r && !o) || (!r && o)) && (i = i.redNeg()), this.point(e, i);
};
ga.prototype.validate = function (e) {
    if (e.inf) return !0;
    var r = e.x,
        n = e.y,
        i = this.a.redMul(r),
        o = r.redSqr().redMul(r).redIAdd(i).redIAdd(this.b);
    return n.redSqr().redISub(o).cmpn(0) === 0;
};
ga.prototype._endoWnafMulAdd = function (e, r, n) {
    for (
        var i = this._endoWnafT1, o = this._endoWnafT2, s = 0;
        s < e.length;
        s++
    ) {
        var a = this._endoSplit(r[s]),
            c = e[s],
            l = c._getBeta();
        a.k1.negative && (a.k1.ineg(), (c = c.neg(!0))),
        a.k2.negative && (a.k2.ineg(), (l = l.neg(!0))),
            (i[s * 2] = c),
            (i[s * 2 + 1] = l),
            (o[s * 2] = a.k1),
            (o[s * 2 + 1] = a.k2);
    }
    for (var u = this._wnafMulAdd(1, i, o, s * 2, n), f = 0; f < s * 2; f++)
        (i[f] = null), (o[f] = null);
    return u;
};
function yi(t, e, r, n) {
    $0.BasePoint.call(this, t, "affine"),
        e === null && r === null
            ? ((this.x = null), (this.y = null), (this.inf = !0))
            : ((this.x = new Bt(e, 16)),
                (this.y = new Bt(r, 16)),
            n && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)),
            this.x.red || (this.x = this.x.toRed(this.curve.red)),
            this.y.red || (this.y = this.y.toRed(this.curve.red)),
                (this.inf = !1));
}
d9(yi, $0.BasePoint);
ga.prototype.point = function (e, r, n) {
    return new yi(this, e, r, n);
};
ga.prototype.pointFromJSON = function (e, r) {
    return yi.fromJSON(this, e, r);
};
yi.prototype._getBeta = function () {
    if (this.curve.endo) {
        var e = this.precomputed;
        if (e && e.beta) return e.beta;
        var r = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
        if (e) {
            var n = this.curve,
                i = function (o) {
                    return n.point(o.x.redMul(n.endo.beta), o.y);
                };
            (e.beta = r),
                (r.precomputed = {
                    beta: null,
                    naf: e.naf && { wnd: e.naf.wnd, points: e.naf.points.map(i) },
                    doubles: e.doubles && {
                        step: e.doubles.step,
                        points: e.doubles.points.map(i),
                    },
                });
        }
        return r;
    }
};
yi.prototype.toJSON = function () {
    return this.precomputed
        ? [
            this.x,
            this.y,
            this.precomputed && {
                doubles: this.precomputed.doubles && {
                    step: this.precomputed.doubles.step,
                    points: this.precomputed.doubles.points.slice(1),
                },
                naf: this.precomputed.naf && {
                    wnd: this.precomputed.naf.wnd,
                    points: this.precomputed.naf.points.slice(1),
                },
            },
        ]
        : [this.x, this.y];
};
yi.fromJSON = function (e, r, n) {
    typeof r == "string" && (r = JSON.parse(r));
    var i = e.point(r[0], r[1], n);
    if (!r[2]) return i;
    function o(a) {
        return e.point(a[0], a[1], n);
    }
    var s = r[2];
    return (
        (i.precomputed = {
            beta: null,
            doubles: s.doubles && {
                step: s.doubles.step,
                points: [i].concat(s.doubles.points.map(o)),
            },
            naf: s.naf && { wnd: s.naf.wnd, points: [i].concat(s.naf.points.map(o)) },
        }),
            i
    );
};
yi.prototype.inspect = function () {
    return this.isInfinity()
        ? "<EC Point Infinity>"
        : "<EC Point x: " +
        this.x.fromRed().toString(16, 2) +
        " y: " +
        this.y.fromRed().toString(16, 2) +
        ">";
};
yi.prototype.isInfinity = function () {
    return this.inf;
};
yi.prototype.add = function (e) {
    if (this.inf) return e;
    if (e.inf) return this;
    if (this.eq(e)) return this.dbl();
    if (this.neg().eq(e)) return this.curve.point(null, null);
    if (this.x.cmp(e.x) === 0) return this.curve.point(null, null);
    var r = this.y.redSub(e.y);
    r.cmpn(0) !== 0 && (r = r.redMul(this.x.redSub(e.x).redInvm()));
    var n = r.redSqr().redISub(this.x).redISub(e.x),
        i = r.redMul(this.x.redSub(n)).redISub(this.y);
    return this.curve.point(n, i);
};
yi.prototype.dbl = function () {
    if (this.inf) return this;
    var e = this.y.redAdd(this.y);
    if (e.cmpn(0) === 0) return this.curve.point(null, null);
    var r = this.curve.a,
        n = this.x.redSqr(),
        i = e.redInvm(),
        o = n.redAdd(n).redIAdd(n).redIAdd(r).redMul(i),
        s = o.redSqr().redISub(this.x.redAdd(this.x)),
        a = o.redMul(this.x.redSub(s)).redISub(this.y);
    return this.curve.point(s, a);
};
yi.prototype.getX = function () {
    return this.x.fromRed();
};
yi.prototype.getY = function () {
    return this.y.fromRed();
};
yi.prototype.mul = function (e) {
    return (
        (e = new Bt(e, 16)),
            this.isInfinity()
                ? this
                : this._hasDoubles(e)
                    ? this.curve._fixedNafMul(this, e)
                    : this.curve.endo
                        ? this.curve._endoWnafMulAdd([this], [e])
                        : this.curve._wnafMul(this, e)
    );
};
yi.prototype.mulAdd = function (e, r, n) {
    var i = [this, r],
        o = [e, n];
    return this.curve.endo
        ? this.curve._endoWnafMulAdd(i, o)
        : this.curve._wnafMulAdd(1, i, o, 2);
};
yi.prototype.jmulAdd = function (e, r, n) {
    var i = [this, r],
        o = [e, n];
    return this.curve.endo
        ? this.curve._endoWnafMulAdd(i, o, !0)
        : this.curve._wnafMulAdd(1, i, o, 2, !0);
};
yi.prototype.eq = function (e) {
    return (
        this === e ||
        (this.inf === e.inf &&
            (this.inf || (this.x.cmp(e.x) === 0 && this.y.cmp(e.y) === 0)))
    );
};
yi.prototype.neg = function (e) {
    if (this.inf) return this;
    var r = this.curve.point(this.x, this.y.redNeg());
    if (e && this.precomputed) {
        var n = this.precomputed,
            i = function (o) {
                return o.neg();
            };
        r.precomputed = {
            naf: n.naf && { wnd: n.naf.wnd, points: n.naf.points.map(i) },
            doubles: n.doubles && {
                step: n.doubles.step,
                points: n.doubles.points.map(i),
            },
        };
    }
    return r;
};
yi.prototype.toJ = function () {
    if (this.inf) return this.curve.jpoint(null, null, null);
    var e = this.curve.jpoint(this.x, this.y, this.curve.one);
    return e;
};
function Ii(t, e, r, n) {
    $0.BasePoint.call(this, t, "jacobian"),
        e === null && r === null && n === null
            ? ((this.x = this.curve.one),
                (this.y = this.curve.one),
                (this.z = new Bt(0)))
            : ((this.x = new Bt(e, 16)),
                (this.y = new Bt(r, 16)),
                (this.z = new Bt(n, 16))),
    this.x.red || (this.x = this.x.toRed(this.curve.red)),
    this.y.red || (this.y = this.y.toRed(this.curve.red)),
    this.z.red || (this.z = this.z.toRed(this.curve.red)),
        (this.zOne = this.z === this.curve.one);
}
d9(Ii, $0.BasePoint);
ga.prototype.jpoint = function (e, r, n) {
    return new Ii(this, e, r, n);
};
Ii.prototype.toP = function () {
    if (this.isInfinity()) return this.curve.point(null, null);
    var e = this.z.redInvm(),
        r = e.redSqr(),
        n = this.x.redMul(r),
        i = this.y.redMul(r).redMul(e);
    return this.curve.point(n, i);
};
Ii.prototype.neg = function () {
    return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};
Ii.prototype.add = function (e) {
    if (this.isInfinity()) return e;
    if (e.isInfinity()) return this;
    var r = e.z.redSqr(),
        n = this.z.redSqr(),
        i = this.x.redMul(r),
        o = e.x.redMul(n),
        s = this.y.redMul(r.redMul(e.z)),
        a = e.y.redMul(n.redMul(this.z)),
        c = i.redSub(o),
        l = s.redSub(a);
    if (c.cmpn(0) === 0)
        return l.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
    var u = c.redSqr(),
        f = u.redMul(c),
        h = i.redMul(u),
        m = l.redSqr().redIAdd(f).redISub(h).redISub(h),
        y = l.redMul(h.redISub(m)).redISub(s.redMul(f)),
        g = this.z.redMul(e.z).redMul(c);
    return this.curve.jpoint(m, y, g);
};
Ii.prototype.mixedAdd = function (e) {
    if (this.isInfinity()) return e.toJ();
    if (e.isInfinity()) return this;
    var r = this.z.redSqr(),
        n = this.x,
        i = e.x.redMul(r),
        o = this.y,
        s = e.y.redMul(r).redMul(this.z),
        a = n.redSub(i),
        c = o.redSub(s);
    if (a.cmpn(0) === 0)
        return c.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
    var l = a.redSqr(),
        u = l.redMul(a),
        f = n.redMul(l),
        h = c.redSqr().redIAdd(u).redISub(f).redISub(f),
        m = c.redMul(f.redISub(h)).redISub(o.redMul(u)),
        y = this.z.redMul(a);
    return this.curve.jpoint(h, m, y);
};
Ii.prototype.dblp = function (e) {
    if (e === 0) return this;
    if (this.isInfinity()) return this;
    if (!e) return this.dbl();
    var r;
    if (this.curve.zeroA || this.curve.threeA) {
        var n = this;
        for (r = 0; r < e; r++) n = n.dbl();
        return n;
    }
    var i = this.curve.a,
        o = this.curve.tinv,
        s = this.x,
        a = this.y,
        c = this.z,
        l = c.redSqr().redSqr(),
        u = a.redAdd(a);
    for (r = 0; r < e; r++) {
        var f = s.redSqr(),
            h = u.redSqr(),
            m = h.redSqr(),
            y = f.redAdd(f).redIAdd(f).redIAdd(i.redMul(l)),
            g = s.redMul(h),
            v = y.redSqr().redISub(g.redAdd(g)),
            x = g.redISub(v),
            b = y.redMul(x);
        b = b.redIAdd(b).redISub(m);
        var w = u.redMul(c);
        r + 1 < e && (l = l.redMul(m)), (s = v), (c = w), (u = b);
    }
    return this.curve.jpoint(s, u.redMul(o), c);
};
Ii.prototype.dbl = function () {
    return this.isInfinity()
        ? this
        : this.curve.zeroA
            ? this._zeroDbl()
            : this.curve.threeA
                ? this._threeDbl()
                : this._dbl();
};
Ii.prototype._zeroDbl = function () {
    var e, r, n;
    if (this.zOne) {
        var i = this.x.redSqr(),
            o = this.y.redSqr(),
            s = o.redSqr(),
            a = this.x.redAdd(o).redSqr().redISub(i).redISub(s);
        a = a.redIAdd(a);
        var c = i.redAdd(i).redIAdd(i),
            l = c.redSqr().redISub(a).redISub(a),
            u = s.redIAdd(s);
        (u = u.redIAdd(u)),
            (u = u.redIAdd(u)),
            (e = l),
            (r = c.redMul(a.redISub(l)).redISub(u)),
            (n = this.y.redAdd(this.y));
    } else {
        var f = this.x.redSqr(),
            h = this.y.redSqr(),
            m = h.redSqr(),
            y = this.x.redAdd(h).redSqr().redISub(f).redISub(m);
        y = y.redIAdd(y);
        var g = f.redAdd(f).redIAdd(f),
            v = g.redSqr(),
            x = m.redIAdd(m);
        (x = x.redIAdd(x)),
            (x = x.redIAdd(x)),
            (e = v.redISub(y).redISub(y)),
            (r = g.redMul(y.redISub(e)).redISub(x)),
            (n = this.y.redMul(this.z)),
            (n = n.redIAdd(n));
    }
    return this.curve.jpoint(e, r, n);
};
Ii.prototype._threeDbl = function () {
    var e, r, n;
    if (this.zOne) {
        var i = this.x.redSqr(),
            o = this.y.redSqr(),
            s = o.redSqr(),
            a = this.x.redAdd(o).redSqr().redISub(i).redISub(s);
        a = a.redIAdd(a);
        var c = i.redAdd(i).redIAdd(i).redIAdd(this.curve.a),
            l = c.redSqr().redISub(a).redISub(a);
        e = l;
        var u = s.redIAdd(s);
        (u = u.redIAdd(u)),
            (u = u.redIAdd(u)),
            (r = c.redMul(a.redISub(l)).redISub(u)),
            (n = this.y.redAdd(this.y));
    } else {
        var f = this.z.redSqr(),
            h = this.y.redSqr(),
            m = this.x.redMul(h),
            y = this.x.redSub(f).redMul(this.x.redAdd(f));
        y = y.redAdd(y).redIAdd(y);
        var g = m.redIAdd(m);
        g = g.redIAdd(g);
        var v = g.redAdd(g);
        (e = y.redSqr().redISub(v)),
            (n = this.y.redAdd(this.z).redSqr().redISub(h).redISub(f));
        var x = h.redSqr();
        (x = x.redIAdd(x)),
            (x = x.redIAdd(x)),
            (x = x.redIAdd(x)),
            (r = y.redMul(g.redISub(e)).redISub(x));
    }
    return this.curve.jpoint(e, r, n);
};
Ii.prototype._dbl = function () {
    var e = this.curve.a,
        r = this.x,
        n = this.y,
        i = this.z,
        o = i.redSqr().redSqr(),
        s = r.redSqr(),
        a = n.redSqr(),
        c = s.redAdd(s).redIAdd(s).redIAdd(e.redMul(o)),
        l = r.redAdd(r);
    l = l.redIAdd(l);
    var u = l.redMul(a),
        f = c.redSqr().redISub(u.redAdd(u)),
        h = u.redISub(f),
        m = a.redSqr();
    (m = m.redIAdd(m)), (m = m.redIAdd(m)), (m = m.redIAdd(m));
    var y = c.redMul(h).redISub(m),
        g = n.redAdd(n).redMul(i);
    return this.curve.jpoint(f, y, g);
};
Ii.prototype.trpl = function () {
    if (!this.curve.zeroA) return this.dbl().add(this);
    var e = this.x.redSqr(),
        r = this.y.redSqr(),
        n = this.z.redSqr(),
        i = r.redSqr(),
        o = e.redAdd(e).redIAdd(e),
        s = o.redSqr(),
        a = this.x.redAdd(r).redSqr().redISub(e).redISub(i);
    (a = a.redIAdd(a)), (a = a.redAdd(a).redIAdd(a)), (a = a.redISub(s));
    var c = a.redSqr(),
        l = i.redIAdd(i);
    (l = l.redIAdd(l)), (l = l.redIAdd(l)), (l = l.redIAdd(l));
    var u = o.redIAdd(a).redSqr().redISub(s).redISub(c).redISub(l),
        f = r.redMul(u);
    (f = f.redIAdd(f)), (f = f.redIAdd(f));
    var h = this.x.redMul(c).redISub(f);
    (h = h.redIAdd(h)), (h = h.redIAdd(h));
    var m = this.y.redMul(u.redMul(l.redISub(u)).redISub(a.redMul(c)));
    (m = m.redIAdd(m)), (m = m.redIAdd(m)), (m = m.redIAdd(m));
    var y = this.z.redAdd(a).redSqr().redISub(n).redISub(c);
    return this.curve.jpoint(h, m, y);
};
Ii.prototype.mul = function (e, r) {
    return (e = new Bt(e, r)), this.curve._wnafMul(this, e);
};
Ii.prototype.eq = function (e) {
    if (e.type === "affine") return this.eq(e.toJ());
    if (this === e) return !0;
    var r = this.z.redSqr(),
        n = e.z.redSqr();
    if (this.x.redMul(n).redISub(e.x.redMul(r)).cmpn(0) !== 0) return !1;
    var i = r.redMul(this.z),
        o = n.redMul(e.z);
    return this.y.redMul(o).redISub(e.y.redMul(i)).cmpn(0) === 0;
};
Ii.prototype.eqXToP = function (e) {
    var r = this.z.redSqr(),
        n = e.toRed(this.curve.red).redMul(r);
    if (this.x.cmp(n) === 0) return !0;
    for (var i = e.clone(), o = this.curve.redN.redMul(r); ; ) {
        if ((i.iadd(this.curve.n), i.cmp(this.curve.p) >= 0)) return !1;
        if ((n.redIAdd(o), this.x.cmp(n) === 0)) return !0;
    }
};
Ii.prototype.inspect = function () {
    return this.isInfinity()
        ? "<EC JPoint Infinity>"
        : "<EC JPoint x: " +
        this.x.toString(16, 2) +
        " y: " +
        this.y.toString(16, 2) +
        " z: " +
        this.z.toString(16, 2) +
        ">";
};
Ii.prototype.isInfinity = function () {
    return this.z.cmpn(0) === 0;
};



var Vq = {},
    mr = {},
    H1 = Wq;
function Wq(t, e) {
    if (!t) throw new Error(e || "Assertion failed");
}
Wq.equal = function (e, r, n) {
    if (e != r) throw new Error(n || "Assertion failed: " + e + " != " + r);
};
var B5 = { exports: {} };
typeof Object.create == "function"
    ? (B5.exports = function (e, r) {
        r &&
        ((e.super_ = r),
            (e.prototype = Object.create(r.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0,
                },
            })));
    })
    : (B5.exports = function (e, r) {
        if (r) {
            e.super_ = r;
            var n = function () {};
            (n.prototype = r.prototype),
                (e.prototype = new n()),
                (e.prototype.constructor = e);
        }
    });
var r3e = B5.exports,
    n3e = H1,
    i3e = r3e;
mr.inherits = i3e;
function o3e(t, e) {
    return (t.charCodeAt(e) & 64512) !== 55296 || e < 0 || e + 1 >= t.length
        ? !1
        : (t.charCodeAt(e + 1) & 64512) === 56320;
}
function s3e(t, e) {
    if (Array.isArray(t)) return t.slice();
    if (!t) return [];
    var r = [];
    if (typeof t == "string")
        if (e) {
            if (e === "hex")
                for (
                    t = t.replace(/[^a-z0-9]+/gi, ""),
                    t.length % 2 !== 0 && (t = "0" + t),
                        i = 0;
                    i < t.length;
                    i += 2
                )
                    r.push(parseInt(t[i] + t[i + 1], 16));
        } else
            for (var n = 0, i = 0; i < t.length; i++) {
                var o = t.charCodeAt(i);
                o < 128
                    ? (r[n++] = o)
                    : o < 2048
                        ? ((r[n++] = (o >> 6) | 192), (r[n++] = (o & 63) | 128))
                        : o3e(t, i)
                            ? ((o = 65536 + ((o & 1023) << 10) + (t.charCodeAt(++i) & 1023)),
                                (r[n++] = (o >> 18) | 240),
                                (r[n++] = ((o >> 12) & 63) | 128),
                                (r[n++] = ((o >> 6) & 63) | 128),
                                (r[n++] = (o & 63) | 128))
                            : ((r[n++] = (o >> 12) | 224),
                                (r[n++] = ((o >> 6) & 63) | 128),
                                (r[n++] = (o & 63) | 128));
            }
    else for (i = 0; i < t.length; i++) r[i] = t[i] | 0;
    return r;
}
mr.toArray = s3e;
function a3e(t) {
    for (var e = "", r = 0; r < t.length; r++) e += qq(t[r].toString(16));
    return e;
}
mr.toHex = a3e;
function Gq(t) {
    var e =
        (t >>> 24) |
        ((t >>> 8) & 65280) |
        ((t << 8) & 16711680) |
        ((t & 255) << 24);
    return e >>> 0;
}
mr.htonl = Gq;
function c3e(t, e) {
    for (var r = "", n = 0; n < t.length; n++) {
        var i = t[n];
        e === "little" && (i = Gq(i)), (r += Kq(i.toString(16)));
    }
    return r;
}
mr.toHex32 = c3e;
function qq(t) {
    return t.length === 1 ? "0" + t : t;
}
mr.zero2 = qq;
function Kq(t) {
    return t.length === 7
        ? "0" + t
        : t.length === 6
            ? "00" + t
            : t.length === 5
                ? "000" + t
                : t.length === 4
                    ? "0000" + t
                    : t.length === 3
                        ? "00000" + t
                        : t.length === 2
                            ? "000000" + t
                            : t.length === 1
                                ? "0000000" + t
                                : t;
}
mr.zero8 = Kq;
function l3e(t, e, r, n) {
    var i = r - e;
    n3e(i % 4 === 0);
    for (var o = new Array(i / 4), s = 0, a = e; s < o.length; s++, a += 4) {
        var c;
        n === "big"
            ? (c = (t[a] << 24) | (t[a + 1] << 16) | (t[a + 2] << 8) | t[a + 3])
            : (c = (t[a + 3] << 24) | (t[a + 2] << 16) | (t[a + 1] << 8) | t[a]),
            (o[s] = c >>> 0);
    }
    return o;
}
mr.join32 = l3e;
function u3e(t, e) {
    for (
        var r = new Array(t.length * 4), n = 0, i = 0;
        n < t.length;
        n++, i += 4
    ) {
        var o = t[n];
        e === "big"
            ? ((r[i] = o >>> 24),
                (r[i + 1] = (o >>> 16) & 255),
                (r[i + 2] = (o >>> 8) & 255),
                (r[i + 3] = o & 255))
            : ((r[i + 3] = o >>> 24),
                (r[i + 2] = (o >>> 16) & 255),
                (r[i + 1] = (o >>> 8) & 255),
                (r[i] = o & 255));
    }
    return r;
}
mr.split32 = u3e;
function f3e(t, e) {
    return (t >>> e) | (t << (32 - e));
}
mr.rotr32 = f3e;
function d3e(t, e) {
    return (t << e) | (t >>> (32 - e));
}
mr.rotl32 = d3e;
function h3e(t, e) {
    return (t + e) >>> 0;
}
mr.sum32 = h3e;
function p3e(t, e, r) {
    return (t + e + r) >>> 0;
}
mr.sum32_3 = p3e;
function m3e(t, e, r, n) {
    return (t + e + r + n) >>> 0;
}
mr.sum32_4 = m3e;
function g3e(t, e, r, n, i) {
    return (t + e + r + n + i) >>> 0;
}
mr.sum32_5 = g3e;
function v3e(t, e, r, n) {
    var i = t[e],
        o = t[e + 1],
        s = (n + o) >>> 0,
        a = (s < n ? 1 : 0) + r + i;
    (t[e] = a >>> 0), (t[e + 1] = s);
}
mr.sum64 = v3e;
function y3e(t, e, r, n) {
    var i = (e + n) >>> 0,
        o = (i < e ? 1 : 0) + t + r;
    return o >>> 0;
}
mr.sum64_hi = y3e;
function x3e(t, e, r, n) {
    var i = e + n;
    return i >>> 0;
}
mr.sum64_lo = x3e;
function b3e(t, e, r, n, i, o, s, a) {
    var c = 0,
        l = e;
    (l = (l + n) >>> 0),
        (c += l < e ? 1 : 0),
        (l = (l + o) >>> 0),
        (c += l < o ? 1 : 0),
        (l = (l + a) >>> 0),
        (c += l < a ? 1 : 0);
    var u = t + r + i + s + c;
    return u >>> 0;
}
mr.sum64_4_hi = b3e;
function w3e(t, e, r, n, i, o, s, a) {
    var c = e + n + o + a;
    return c >>> 0;
}
mr.sum64_4_lo = w3e;
function E3e(t, e, r, n, i, o, s, a, c, l) {
    var u = 0,
        f = e;
    (f = (f + n) >>> 0),
        (u += f < e ? 1 : 0),
        (f = (f + o) >>> 0),
        (u += f < o ? 1 : 0),
        (f = (f + a) >>> 0),
        (u += f < a ? 1 : 0),
        (f = (f + l) >>> 0),
        (u += f < l ? 1 : 0);
    var h = t + r + i + s + c + u;
    return h >>> 0;
}
mr.sum64_5_hi = E3e;
function A3e(t, e, r, n, i, o, s, a, c, l) {
    var u = e + n + o + a + l;
    return u >>> 0;
}
mr.sum64_5_lo = A3e;
function S3e(t, e, r) {
    var n = (e << (32 - r)) | (t >>> r);
    return n >>> 0;
}
mr.rotr64_hi = S3e;
function C3e(t, e, r) {
    var n = (t << (32 - r)) | (e >>> r);
    return n >>> 0;
}
mr.rotr64_lo = C3e;
function _3e(t, e, r) {
    return t >>> r;
}
mr.shr64_hi = _3e;
function P3e(t, e, r) {
    var n = (t << (32 - r)) | (e >>> r);
    return n >>> 0;
}
mr.shr64_lo = P3e;
var Km = {},
    KF = mr,
    T3e = H1;
function v3() {
    (this.pending = null),
        (this.pendingTotal = 0),
        (this.blockSize = this.constructor.blockSize),
        (this.outSize = this.constructor.outSize),
        (this.hmacStrength = this.constructor.hmacStrength),
        (this.padLength = this.constructor.padLength / 8),
        (this.endian = "big"),
        (this._delta8 = this.blockSize / 8),
        (this._delta32 = this.blockSize / 32);
}
Km.BlockHash = v3;
v3.prototype.update = function (e, r) {
    if (
        ((e = KF.toArray(e, r)),
            this.pending ? (this.pending = this.pending.concat(e)) : (this.pending = e),
            (this.pendingTotal += e.length),
        this.pending.length >= this._delta8)
    ) {
        e = this.pending;
        var n = e.length % this._delta8;
        (this.pending = e.slice(e.length - n, e.length)),
        this.pending.length === 0 && (this.pending = null),
            (e = KF.join32(e, 0, e.length - n, this.endian));
        for (var i = 0; i < e.length; i += this._delta32)
            this._update(e, i, i + this._delta32);
    }
    return this;
};
v3.prototype.digest = function (e) {
    return this.update(this._pad()), T3e(this.pending === null), this._digest(e);
};
v3.prototype._pad = function () {
    var e = this.pendingTotal,
        r = this._delta8,
        n = r - ((e + this.padLength) % r),
        i = new Array(n + this.padLength);
    i[0] = 128;
    for (var o = 1; o < n; o++) i[o] = 0;
    if (((e <<= 3), this.endian === "big")) {
        for (var s = 8; s < this.padLength; s++) i[o++] = 0;
        (i[o++] = 0),
            (i[o++] = 0),
            (i[o++] = 0),
            (i[o++] = 0),
            (i[o++] = (e >>> 24) & 255),
            (i[o++] = (e >>> 16) & 255),
            (i[o++] = (e >>> 8) & 255),
            (i[o++] = e & 255);
    } else
        for (
            i[o++] = e & 255,
                i[o++] = (e >>> 8) & 255,
                i[o++] = (e >>> 16) & 255,
                i[o++] = (e >>> 24) & 255,
                i[o++] = 0,
                i[o++] = 0,
                i[o++] = 0,
                i[o++] = 0,
                s = 8;
            s < this.padLength;
            s++
        )
            i[o++] = 0;
    return i;
};
var Qm = {},
    Zc = {},
    R3e = mr,
    Ic = R3e.rotr32;
function I3e(t, e, r, n) {
    if (t === 0) return Qq(e, r, n);
    if (t === 1 || t === 3) return Zq(e, r, n);
    if (t === 2) return Xq(e, r, n);
}
Zc.ft_1 = I3e;
function Qq(t, e, r) {
    return (t & e) ^ (~t & r);
}
Zc.ch32 = Qq;
function Xq(t, e, r) {
    return (t & e) ^ (t & r) ^ (e & r);
}
Zc.maj32 = Xq;
function Zq(t, e, r) {
    return t ^ e ^ r;
}
Zc.p32 = Zq;
function O3e(t) {
    return Ic(t, 2) ^ Ic(t, 13) ^ Ic(t, 22);
}
Zc.s0_256 = O3e;
function k3e(t) {
    return Ic(t, 6) ^ Ic(t, 11) ^ Ic(t, 25);
}
Zc.s1_256 = k3e;
function B3e(t) {
    return Ic(t, 7) ^ Ic(t, 18) ^ (t >>> 3);
}
Zc.g0_256 = B3e;
function M3e(t) {
    return Ic(t, 17) ^ Ic(t, 19) ^ (t >>> 10);
}
Zc.g1_256 = M3e;
var rm = mr,
    N3e = Km,
    F3e = Zc,
    u_ = rm.rotl32,
    Fg = rm.sum32,
    D3e = rm.sum32_5,
    L3e = F3e.ft_1,
    Jq = N3e.BlockHash,
    $3e = [1518500249, 1859775393, 2400959708, 3395469782];
function $c() {
    if (!(this instanceof $c)) return new $c();
    Jq.call(this),
        (this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520]),
        (this.W = new Array(80));
}
rm.inherits($c, Jq);
var j3e = $c;
$c.blockSize = 512;
$c.outSize = 160;
$c.hmacStrength = 80;
$c.padLength = 64;
$c.prototype._update = function (e, r) {
    for (var n = this.W, i = 0; i < 16; i++) n[i] = e[r + i];
    for (; i < n.length; i++)
        n[i] = u_(n[i - 3] ^ n[i - 8] ^ n[i - 14] ^ n[i - 16], 1);
    var o = this.h[0],
        s = this.h[1],
        a = this.h[2],
        c = this.h[3],
        l = this.h[4];
    for (i = 0; i < n.length; i++) {
        var u = ~~(i / 20),
            f = D3e(u_(o, 5), L3e(u, s, a, c), l, n[i], $3e[u]);
        (l = c), (c = a), (a = u_(s, 30)), (s = o), (o = f);
    }
    (this.h[0] = Fg(this.h[0], o)),
        (this.h[1] = Fg(this.h[1], s)),
        (this.h[2] = Fg(this.h[2], a)),
        (this.h[3] = Fg(this.h[3], c)),
        (this.h[4] = Fg(this.h[4], l));
};
$c.prototype._digest = function (e) {
    return e === "hex" ? rm.toHex32(this.h, "big") : rm.split32(this.h, "big");
};
var nm = mr,
    z3e = Km,
    Xm = Zc,
    H3e = H1,
    Sa = nm.sum32,
    U3e = nm.sum32_4,
    V3e = nm.sum32_5,
    W3e = Xm.ch32,
    G3e = Xm.maj32,
    q3e = Xm.s0_256,
    K3e = Xm.s1_256,
    Q3e = Xm.g0_256,
    X3e = Xm.g1_256,
    Yq = z3e.BlockHash,
    Z3e = [
        1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993,
        2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987,
        1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774,
        264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
        2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
        113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
        1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
        3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
        430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
        1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
        2428436474, 2756734187, 3204031479, 3329325298,
    ];
function jc() {
    if (!(this instanceof jc)) return new jc();
    Yq.call(this),
        (this.h = [
            1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924,
            528734635, 1541459225,
        ]),
        (this.k = Z3e),
        (this.W = new Array(64));
}
nm.inherits(jc, Yq);
var eK = jc;
jc.blockSize = 512;
jc.outSize = 256;
jc.hmacStrength = 192;
jc.padLength = 64;
jc.prototype._update = function (e, r) {
    for (var n = this.W, i = 0; i < 16; i++) n[i] = e[r + i];
    for (; i < n.length; i++)
        n[i] = U3e(X3e(n[i - 2]), n[i - 7], Q3e(n[i - 15]), n[i - 16]);
    var o = this.h[0],
        s = this.h[1],
        a = this.h[2],
        c = this.h[3],
        l = this.h[4],
        u = this.h[5],
        f = this.h[6],
        h = this.h[7];
    for (H3e(this.k.length === n.length), i = 0; i < n.length; i++) {
        var m = V3e(h, K3e(l), W3e(l, u, f), this.k[i], n[i]),
            y = Sa(q3e(o), G3e(o, s, a));
        (h = f),
            (f = u),
            (u = l),
            (l = Sa(c, m)),
            (c = a),
            (a = s),
            (s = o),
            (o = Sa(m, y));
    }
    (this.h[0] = Sa(this.h[0], o)),
        (this.h[1] = Sa(this.h[1], s)),
        (this.h[2] = Sa(this.h[2], a)),
        (this.h[3] = Sa(this.h[3], c)),
        (this.h[4] = Sa(this.h[4], l)),
        (this.h[5] = Sa(this.h[5], u)),
        (this.h[6] = Sa(this.h[6], f)),
        (this.h[7] = Sa(this.h[7], h));
};
jc.prototype._digest = function (e) {
    return e === "hex" ? nm.toHex32(this.h, "big") : nm.split32(this.h, "big");
};
var M5 = mr,
    tK = eK;
function Jl() {
    if (!(this instanceof Jl)) return new Jl();
    tK.call(this),
        (this.h = [
            3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025,
            1694076839, 3204075428,
        ]);
}
M5.inherits(Jl, tK);
var J3e = Jl;
Jl.blockSize = 512;
Jl.outSize = 224;
Jl.hmacStrength = 192;
Jl.padLength = 64;
Jl.prototype._digest = function (e) {
    return e === "hex"
        ? M5.toHex32(this.h.slice(0, 7), "big")
        : M5.split32(this.h.slice(0, 7), "big");
};
var Uo = mr,
    Y3e = Km,
    eSe = H1,
    Oc = Uo.rotr64_hi,
    kc = Uo.rotr64_lo,
    rK = Uo.shr64_hi,
    nK = Uo.shr64_lo,
    Ru = Uo.sum64,
    f_ = Uo.sum64_hi,
    d_ = Uo.sum64_lo,
    tSe = Uo.sum64_4_hi,
    rSe = Uo.sum64_4_lo,
    nSe = Uo.sum64_5_hi,
    iSe = Uo.sum64_5_lo,
    iK = Y3e.BlockHash,
    oSe = [
        1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399,
        3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265,
        2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394,
        310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994,
        1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317,
        3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139,
        264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901,
        1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837,
        2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879,
        3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901,
        113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964,
        773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823,
        1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142,
        2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273,
        3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344,
        3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720,
        430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593,
        883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403,
        1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012,
        2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044,
        2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573,
        3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711,
        3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554,
        174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315,
        685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100,
        1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866,
        1607167915, 987167468, 1816402316, 1246189591,
    ];
function Xa() {
    if (!(this instanceof Xa)) return new Xa();
    iK.call(this),
        (this.h = [
            1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723,
            2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199,
            528734635, 4215389547, 1541459225, 327033209,
        ]),
        (this.k = oSe),
        (this.W = new Array(160));
}
Uo.inherits(Xa, iK);
var oK = Xa;
Xa.blockSize = 1024;
Xa.outSize = 512;
Xa.hmacStrength = 192;
Xa.padLength = 128;
Xa.prototype._prepareBlock = function (e, r) {
    for (var n = this.W, i = 0; i < 32; i++) n[i] = e[r + i];
    for (; i < n.length; i += 2) {
        var o = gSe(n[i - 4], n[i - 3]),
            s = vSe(n[i - 4], n[i - 3]),
            a = n[i - 14],
            c = n[i - 13],
            l = pSe(n[i - 30], n[i - 29]),
            u = mSe(n[i - 30], n[i - 29]),
            f = n[i - 32],
            h = n[i - 31];
        (n[i] = tSe(o, s, a, c, l, u, f, h)),
            (n[i + 1] = rSe(o, s, a, c, l, u, f, h));
    }
};
Xa.prototype._update = function (e, r) {
    this._prepareBlock(e, r);
    var n = this.W,
        i = this.h[0],
        o = this.h[1],
        s = this.h[2],
        a = this.h[3],
        c = this.h[4],
        l = this.h[5],
        u = this.h[6],
        f = this.h[7],
        h = this.h[8],
        m = this.h[9],
        y = this.h[10],
        g = this.h[11],
        v = this.h[12],
        x = this.h[13],
        b = this.h[14],
        w = this.h[15];
    eSe(this.k.length === n.length);
    for (var S = 0; S < n.length; S += 2) {
        var P = b,
            O = w,
            B = dSe(h, m),
            k = hSe(h, m),
            z = sSe(h, m, y, g, v),
            D = aSe(h, m, y, g, v, x),
            H = this.k[S],
            W = this.k[S + 1],
            N = n[S],
            A = n[S + 1],
            _ = nSe(P, O, B, k, z, D, H, W, N, A),
            I = iSe(P, O, B, k, z, D, H, W, N, A);
        (P = uSe(i, o)),
            (O = fSe(i, o)),
            (B = cSe(i, o, s, a, c)),
            (k = lSe(i, o, s, a, c, l));
        var F = f_(P, O, B, k),
            L = d_(P, O, B, k);
        (b = v),
            (w = x),
            (v = y),
            (x = g),
            (y = h),
            (g = m),
            (h = f_(u, f, _, I)),
            (m = d_(f, f, _, I)),
            (u = c),
            (f = l),
            (c = s),
            (l = a),
            (s = i),
            (a = o),
            (i = f_(_, I, F, L)),
            (o = d_(_, I, F, L));
    }
    Ru(this.h, 0, i, o),
        Ru(this.h, 2, s, a),
        Ru(this.h, 4, c, l),
        Ru(this.h, 6, u, f),
        Ru(this.h, 8, h, m),
        Ru(this.h, 10, y, g),
        Ru(this.h, 12, v, x),
        Ru(this.h, 14, b, w);
};
Xa.prototype._digest = function (e) {
    return e === "hex" ? Uo.toHex32(this.h, "big") : Uo.split32(this.h, "big");
};
function sSe(t, e, r, n, i) {
    var o = (t & r) ^ (~t & i);
    return o < 0 && (o += 4294967296), o;
}
function aSe(t, e, r, n, i, o) {
    var s = (e & n) ^ (~e & o);
    return s < 0 && (s += 4294967296), s;
}
function cSe(t, e, r, n, i) {
    var o = (t & r) ^ (t & i) ^ (r & i);
    return o < 0 && (o += 4294967296), o;
}
function lSe(t, e, r, n, i, o) {
    var s = (e & n) ^ (e & o) ^ (n & o);
    return s < 0 && (s += 4294967296), s;
}
function uSe(t, e) {
    var r = Oc(t, e, 28),
        n = Oc(e, t, 2),
        i = Oc(e, t, 7),
        o = r ^ n ^ i;
    return o < 0 && (o += 4294967296), o;
}
function fSe(t, e) {
    var r = kc(t, e, 28),
        n = kc(e, t, 2),
        i = kc(e, t, 7),
        o = r ^ n ^ i;
    return o < 0 && (o += 4294967296), o;
}
function dSe(t, e) {
    var r = Oc(t, e, 14),
        n = Oc(t, e, 18),
        i = Oc(e, t, 9),
        o = r ^ n ^ i;
    return o < 0 && (o += 4294967296), o;
}
function hSe(t, e) {
    var r = kc(t, e, 14),
        n = kc(t, e, 18),
        i = kc(e, t, 9),
        o = r ^ n ^ i;
    return o < 0 && (o += 4294967296), o;
}
function pSe(t, e) {
    var r = Oc(t, e, 1),
        n = Oc(t, e, 8),
        i = rK(t, e, 7),
        o = r ^ n ^ i;
    return o < 0 && (o += 4294967296), o;
}
function mSe(t, e) {
    var r = kc(t, e, 1),
        n = kc(t, e, 8),
        i = nK(t, e, 7),
        o = r ^ n ^ i;
    return o < 0 && (o += 4294967296), o;
}
function gSe(t, e) {
    var r = Oc(t, e, 19),
        n = Oc(e, t, 29),
        i = rK(t, e, 6),
        o = r ^ n ^ i;
    return o < 0 && (o += 4294967296), o;
}
function vSe(t, e) {
    var r = kc(t, e, 19),
        n = kc(e, t, 29),
        i = nK(t, e, 6),
        o = r ^ n ^ i;
    return o < 0 && (o += 4294967296), o;
}
var N5 = mr,
    sK = oK;
function Yl() {
    if (!(this instanceof Yl)) return new Yl();
    sK.call(this),
        (this.h = [
            3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999,
            355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025,
            3675008525, 1694076839, 1203062813, 3204075428,
        ]);
}
N5.inherits(Yl, sK);
var ySe = Yl;
Yl.blockSize = 1024;
Yl.outSize = 384;
Yl.hmacStrength = 192;
Yl.padLength = 128;
Yl.prototype._digest = function (e) {
    return e === "hex"
        ? N5.toHex32(this.h.slice(0, 12), "big")
        : N5.split32(this.h.slice(0, 12), "big");
};
Qm.sha1 = j3e;
Qm.sha224 = J3e;
Qm.sha256 = eK;
Qm.sha384 = ySe;
Qm.sha512 = oK;
var aK = {},
    E0 = mr,
    xSe = Km,
    Rb = E0.rotl32,
    QF = E0.sum32,
    Dg = E0.sum32_3,
    XF = E0.sum32_4,
    cK = xSe.BlockHash;
function zc() {
    if (!(this instanceof zc)) return new zc();
    cK.call(this),
        (this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520]),
        (this.endian = "little");
}
E0.inherits(zc, cK);
aK.ripemd160 = zc;
zc.blockSize = 512;
zc.outSize = 160;
zc.hmacStrength = 192;
zc.padLength = 64;
zc.prototype._update = function (e, r) {
    for (
        var n = this.h[0],
            i = this.h[1],
            o = this.h[2],
            s = this.h[3],
            a = this.h[4],
            c = n,
            l = i,
            u = o,
            f = s,
            h = a,
            m = 0;
        m < 80;
        m++
    ) {
        var y = QF(Rb(XF(n, ZF(m, i, o, s), e[ESe[m] + r], bSe(m)), SSe[m]), a);
        (n = a),
            (a = s),
            (s = Rb(o, 10)),
            (o = i),
            (i = y),
            (y = QF(
                Rb(XF(c, ZF(79 - m, l, u, f), e[ASe[m] + r], wSe(m)), CSe[m]),
                h,
            )),
            (c = h),
            (h = f),
            (f = Rb(u, 10)),
            (u = l),
            (l = y);
    }
    (y = Dg(this.h[1], o, f)),
        (this.h[1] = Dg(this.h[2], s, h)),
        (this.h[2] = Dg(this.h[3], a, c)),
        (this.h[3] = Dg(this.h[4], n, l)),
        (this.h[4] = Dg(this.h[0], i, u)),
        (this.h[0] = y);
};
zc.prototype._digest = function (e) {
    return e === "hex"
        ? E0.toHex32(this.h, "little")
        : E0.split32(this.h, "little");
};
function ZF(t, e, r, n) {
    return t <= 15
        ? e ^ r ^ n
        : t <= 31
            ? (e & r) | (~e & n)
            : t <= 47
                ? (e | ~r) ^ n
                : t <= 63
                    ? (e & n) | (r & ~n)
                    : e ^ (r | ~n);
}
function bSe(t) {
    return t <= 15
        ? 0
        : t <= 31
            ? 1518500249
            : t <= 47
                ? 1859775393
                : t <= 63
                    ? 2400959708
                    : 2840853838;
}
function wSe(t) {
    return t <= 15
        ? 1352829926
        : t <= 31
            ? 1548603684
            : t <= 47
                ? 1836072691
                : t <= 63
                    ? 2053994217
                    : 0;
}
var ESe = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6,
        15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13,
        11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9,
        7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
    ],
    ASe = [
        5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5,
        10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10,
        0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10,
        4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
    ],
    SSe = [
        11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9,
        7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13,
        6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9,
        15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
    ],
    CSe = [
        8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8,
        9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14,
        13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5,
        12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
    ],
    _Se = mr,
    PSe = H1;
function im(t, e, r) {
    if (!(this instanceof im)) return new im(t, e, r);
    (this.Hash = t),
        (this.blockSize = t.blockSize / 8),
        (this.outSize = t.outSize / 8),
        (this.inner = null),
        (this.outer = null),
        this._init(_Se.toArray(e, r));
}
var TSe = im;
im.prototype._init = function (e) {
    e.length > this.blockSize && (e = new this.Hash().update(e).digest()),
        PSe(e.length <= this.blockSize);
    for (var r = e.length; r < this.blockSize; r++) e.push(0);
    for (r = 0; r < e.length; r++) e[r] ^= 54;
    for (this.inner = new this.Hash().update(e), r = 0; r < e.length; r++)
        e[r] ^= 106;
    this.outer = new this.Hash().update(e);
};
im.prototype.update = function (e, r) {
    return this.inner.update(e, r), this;
};
im.prototype.digest = function (e) {
    return this.outer.update(this.inner.digest()), this.outer.digest(e);
};
(function (t) {
    var e = t;
    (e.utils = mr),
        (e.common = Km),
        (e.sha = Qm),
        (e.ripemd = aK),
        (e.hmac = TSe),
        (e.sha1 = e.sha.sha1),
        (e.sha256 = e.sha.sha256),
        (e.sha224 = e.sha.sha224),
        (e.sha384 = e.sha.sha384),
        (e.sha512 = e.sha.sha512),
        (e.ripemd160 = e.ripemd.ripemd160);
})(Vq);

const Co = ho(Vq);
var P2 = Zm(function (t, e) {
        var r = e;
        (r.base = $0), (r.short = kSe), (r.mont = null), (r.edwards = null);
    }),
    T2 = Zm(function (t, e) {
        var r = e,
            n = _s.assert;
        function i(a) {
            a.type === "short"
                ? (this.curve = new P2.short(a))
                : a.type === "edwards"
                    ? (this.curve = new P2.edwards(a))
                    : (this.curve = new P2.mont(a)),
                (this.g = this.curve.g),
                (this.n = this.curve.n),
                (this.hash = a.hash),
                n(this.g.validate(), "Invalid curve"),
                n(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
        }
        r.PresetCurve = i;
        function o(a, c) {
            Object.defineProperty(r, a, {
                configurable: !0,
                enumerable: !0,
                get: function () {
                    var l = new i(c);
                    return (
                        Object.defineProperty(r, a, {
                            configurable: !0,
                            enumerable: !0,
                            value: l,
                        }),
                            l
                    );
                },
            });
        }
        o("p192", {
            type: "short",
            prime: "p192",
            p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
            a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
            b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
            n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
            hash: Co.sha256,
            gRed: !1,
            g: [
                "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012",
                "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811",
            ],
        }),
            o("p224", {
                type: "short",
                prime: "p224",
                p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
                a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
                b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
                n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
                hash: Co.sha256,
                gRed: !1,
                g: [
                    "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
                    "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34",
                ],
            }),
            o("p256", {
                type: "short",
                prime: null,
                p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
                a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
                b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
                n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
                hash: Co.sha256,
                gRed: !1,
                g: [
                    "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
                    "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5",
                ],
            }),
            o("p384", {
                type: "short",
                prime: null,
                p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
                a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
                b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
                n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
                hash: Co.sha384,
                gRed: !1,
                g: [
                    "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7",
                    "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f",
                ],
            }),
            o("p521", {
                type: "short",
                prime: null,
                p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
                a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
                b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
                n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
                hash: Co.sha512,
                gRed: !1,
                g: [
                    "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
                    "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650",
                ],
            }),
            o("curve25519", {
                type: "mont",
                prime: "p25519",
                p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
                a: "76d06",
                b: "1",
                n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
                hash: Co.sha256,
                gRed: !1,
                g: ["9"],
            }),
            o("ed25519", {
                type: "edwards",
                prime: "p25519",
                p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
                a: "-1",
                c: "1",
                d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
                n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
                hash: Co.sha256,
                gRed: !1,
                g: [
                    "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
                    "6666666666666666666666666666666666666666666666666666666666666658",
                ],
            });
        var s;
        try {
            s = null.crash();
        } catch {
            s = void 0;
        }
        o("secp256k1", {
            type: "short",
            prime: "k256",
            p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
            a: "0",
            b: "7",
            n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
            h: "1",
            hash: Co.sha256,
            beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
            lambda:
                "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
            basis: [
                {
                    a: "3086d221a7d46bcde86c90e49284eb15",
                    b: "-e4437ed6010e88286f547fa90abfe4c3",
                },
                {
                    a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
                    b: "3086d221a7d46bcde86c90e49284eb15",
                },
            ],
            gRed: !1,
            g: [
                "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
                "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
                s,
            ],
        });
    });

function Nf(t) {
    if (!(this instanceof Nf)) return new Nf(t);
    (this.hash = t.hash),
        (this.predResist = !!t.predResist),
        (this.outLen = this.hash.outSize),
        (this.minEntropy = t.minEntropy || this.hash.hmacStrength),
        (this._reseed = null),
        (this.reseedInterval = null),
        (this.K = null),
        (this.V = null);
    var e = ja.toArray(t.entropy, t.entropyEnc || "hex"),
        r = ja.toArray(t.nonce, t.nonceEnc || "hex"),
        n = ja.toArray(t.pers, t.persEnc || "hex");
    f9(
        e.length >= this.minEntropy / 8,
        "Not enough entropy. Minimum is: " + this.minEntropy + " bits",
    ),
        this._init(e, r, n);
}
var uK = Nf;
Nf.prototype._init = function (e, r, n) {
    var i = e.concat(r).concat(n);
    (this.K = new Array(this.outLen / 8)), (this.V = new Array(this.outLen / 8));
    for (var o = 0; o < this.V.length; o++) (this.K[o] = 0), (this.V[o] = 1);
    this._update(i), (this._reseed = 1), (this.reseedInterval = 281474976710656);
};
Nf.prototype._hmac = function () {
    return new Co.hmac(this.hash, this.K);
};
Nf.prototype._update = function (e) {
    var r = this._hmac().update(this.V).update([0]);
    e && (r = r.update(e)),
        (this.K = r.digest()),
        (this.V = this._hmac().update(this.V).digest()),
    e &&
    ((this.K = this._hmac().update(this.V).update([1]).update(e).digest()),
        (this.V = this._hmac().update(this.V).digest()));
};
Nf.prototype.reseed = function (e, r, n, i) {
    typeof r != "string" && ((i = n), (n = r), (r = null)),
        (e = ja.toArray(e, r)),
        (n = ja.toArray(n, i)),
        f9(
            e.length >= this.minEntropy / 8,
            "Not enough entropy. Minimum is: " + this.minEntropy + " bits",
        ),
        this._update(e.concat(n || [])),
        (this._reseed = 1);
};
Nf.prototype.generate = function (e, r, n, i) {
    if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
    typeof r != "string" && ((i = n), (n = r), (r = null)),
    n && ((n = ja.toArray(n, i || "hex")), this._update(n));
    for (var o = []; o.length < e; )
        (this.V = this._hmac().update(this.V).digest()), (o = o.concat(this.V));
    var s = o.slice(0, e);
    return this._update(n), this._reseed++, ja.encode(s, r);
};
var F5 = _s.assert;
function Vi(t, e) {
    (this.ec = t),
        (this.priv = null),
        (this.pub = null),
    e.priv && this._importPrivate(e.priv, e.privEnc),
    e.pub && this._importPublic(e.pub, e.pubEnc);
}
var h9 = Vi;
Vi.fromPublic = function (e, r, n) {
    return r instanceof Vi ? r : new Vi(e, { pub: r, pubEnc: n });
};
Vi.fromPrivate = function (e, r, n) {
    return r instanceof Vi ? r : new Vi(e, { priv: r, privEnc: n });
};
Vi.prototype.validate = function () {
    var e = this.getPublic();
    return e.isInfinity()
        ? { result: !1, reason: "Invalid public key" }
        : e.validate()
            ? e.mul(this.ec.curve.n).isInfinity()
                ? { result: !0, reason: null }
                : { result: !1, reason: "Public key * N != O" }
            : { result: !1, reason: "Public key is not a point" };
};
Vi.prototype.getPublic = function (e, r) {
    return (
        typeof e == "string" && ((r = e), (e = null)),
        this.pub || (this.pub = this.ec.g.mul(this.priv)),
            r ? this.pub.encode(r, e) : this.pub
    );
};
Vi.prototype.getPrivate = function (e) {
    return e === "hex" ? this.priv.toString(16, 2) : this.priv;
};
Vi.prototype._importPrivate = function (e, r) {
    (this.priv = new Bt(e, r || 16)),
        (this.priv = this.priv.umod(this.ec.curve.n));
};
Vi.prototype._importPublic = function (e, r) {
    if (e.x || e.y) {
        this.ec.curve.type === "mont"
            ? F5(e.x, "Need x coordinate")
            : (this.ec.curve.type === "short" || this.ec.curve.type === "edwards") &&
            F5(e.x && e.y, "Need both x and y coordinate"),
            (this.pub = this.ec.curve.point(e.x, e.y));
        return;
    }
    this.pub = this.ec.curve.decodePoint(e, r);
};
Vi.prototype.derive = function (e) {
    return (
        e.validate() || F5(e.validate(), "public point not validated"),
            e.mul(this.priv).getX()
    );
};
Vi.prototype.sign = function (e, r, n) {
    return this.ec.sign(e, this, r, n);
};
Vi.prototype.verify = function (e, r) {
    return this.ec.verify(e, r, this);
};
Vi.prototype.inspect = function () {
    return (
        "<Key priv: " +
        (this.priv && this.priv.toString(16, 2)) +
        " pub: " +
        (this.pub && this.pub.inspect()) +
        " >"
    );
};

var BSe = _s.assert;
function y3(t, e) {
    if (t instanceof y3) return t;
    this._importDER(t, e) ||
    (BSe(t.r && t.s, "Signature without r or s"),
        (this.r = new Bt(t.r, 16)),
        (this.s = new Bt(t.s, 16)),
        t.recoveryParam === void 0
            ? (this.recoveryParam = null)
            : (this.recoveryParam = t.recoveryParam));
}
var x3 = y3;

function MSe() {
    this.place = 0;
}
function h_(t, e) {
    var r = t[e.place++];
    if (!(r & 128)) return r;
    var n = r & 15;
    if (n === 0 || n > 4) return !1;
    for (var i = 0, o = 0, s = e.place; o < n; o++, s++)
        (i <<= 8), (i |= t[s]), (i >>>= 0);
    return i <= 127 ? !1 : ((e.place = s), i);
}
function JF(t) {
    for (var e = 0, r = t.length - 1; !t[e] && !(t[e + 1] & 128) && e < r; ) e++;
    return e === 0 ? t : t.slice(e);
}
y3.prototype._importDER = function (e, r) {
    e = _s.toArray(e, r);
    var n = new MSe();
    if (e[n.place++] !== 48) return !1;
    var i = h_(e, n);
    if (i === !1 || i + n.place !== e.length || e[n.place++] !== 2) return !1;
    var o = h_(e, n);
    if (o === !1) return !1;
    var s = e.slice(n.place, o + n.place);
    if (((n.place += o), e[n.place++] !== 2)) return !1;
    var a = h_(e, n);
    if (a === !1 || e.length !== a + n.place) return !1;
    var c = e.slice(n.place, a + n.place);
    if (s[0] === 0)
        if (s[1] & 128) s = s.slice(1);
        else return !1;
    if (c[0] === 0)
        if (c[1] & 128) c = c.slice(1);
        else return !1;
    return (
        (this.r = new Bt(s)), (this.s = new Bt(c)), (this.recoveryParam = null), !0
    );
};
function p_(t, e) {
    if (e < 128) {
        t.push(e);
        return;
    }
    var r = 1 + ((Math.log(e) / Math.LN2) >>> 3);
    for (t.push(r | 128); --r; ) t.push((e >>> (r << 3)) & 255);
    t.push(e);
}
y3.prototype.toDER = function (e) {
    var r = this.r.toArray(),
        n = this.s.toArray();
    for (
        r[0] & 128 && (r = [0].concat(r)),
        n[0] & 128 && (n = [0].concat(n)),
            r = JF(r),
            n = JF(n);
        !n[0] && !(n[1] & 128);

    )
        n = n.slice(1);
    var i = [2];
    p_(i, r.length), (i = i.concat(r)), i.push(2), p_(i, n.length);
    var o = i.concat(n),
        s = [48];
    return p_(s, o.length), (s = s.concat(o)), _s.encode(s, e);
};

var NSe = function () {
        throw new Error("unsupported");
    },
    fK = _s.assert;

function da(t) {
    if (!(this instanceof da)) return new da(t);
    typeof t == "string" &&
    (fK(Object.prototype.hasOwnProperty.call(T2, t), "Unknown curve " + t),
        (t = T2[t])),
    t instanceof T2.PresetCurve && (t = { curve: t }),
        (this.curve = t.curve.curve),
        (this.n = this.curve.n),
        (this.nh = this.n.ushrn(1)),
        (this.g = this.curve.g),
        (this.g = t.curve.g),
        this.g.precompute(t.curve.n.bitLength() + 1),
        (this.hash = t.hash || t.curve.hash);
}
var FSe = da;
da.prototype.keyPair = function (e) {
    return new h9(this, e);
};
da.prototype.keyFromPrivate = function (e, r) {
    return h9.fromPrivate(this, e, r);
};
da.prototype.keyFromPublic = function (e, r) {
    return h9.fromPublic(this, e, r);
};
da.prototype.genKeyPair = function (e) {
    e || (e = {});
    for (
        var r = new uK({
                hash: this.hash,
                pers: e.pers,
                persEnc: e.persEnc || "utf8",
                entropy: e.entropy || NSe(this.hash.hmacStrength),
                entropyEnc: (e.entropy && e.entropyEnc) || "utf8",
                nonce: this.n.toArray(),
            }),
            n = this.n.byteLength(),
            i = this.n.sub(new Bt(2));
        ;

    ) {
        var o = new Bt(r.generate(n));
        if (!(o.cmp(i) > 0)) return o.iaddn(1), this.keyFromPrivate(o);
    }
};
da.prototype._truncateToN = function (e, r) {
    var n = e.byteLength() * 8 - this.n.bitLength();
    return (
        n > 0 && (e = e.ushrn(n)), !r && e.cmp(this.n) >= 0 ? e.sub(this.n) : e
    );
};
da.prototype.sign = function (e, r, n, i) {
    typeof n == "object" && ((i = n), (n = null)),
    i || (i = {}),
        (r = this.keyFromPrivate(r, n)),
        (e = this._truncateToN(new Bt(e, 16)));
    for (
        var o = this.n.byteLength(),
            s = r.getPrivate().toArray("be", o),
            a = e.toArray("be", o),
            c = new uK({
                hash: this.hash,
                entropy: s,
                nonce: a,
                pers: i.pers,
                persEnc: i.persEnc || "utf8",
            }),
            l = this.n.sub(new Bt(1)),
            u = 0;
        ;
        u++
    ) {
        var f = i.k ? i.k(u) : new Bt(c.generate(this.n.byteLength()));
        if (((f = this._truncateToN(f, !0)), !(f.cmpn(1) <= 0 || f.cmp(l) >= 0))) {
            var h = this.g.mul(f);
            if (!h.isInfinity()) {
                var m = h.getX(),
                    y = m.umod(this.n);
                if (y.cmpn(0) !== 0) {
                    var g = f.invm(this.n).mul(y.mul(r.getPrivate()).iadd(e));
                    if (((g = g.umod(this.n)), g.cmpn(0) !== 0)) {
                        var v = (h.getY().isOdd() ? 1 : 0) | (m.cmp(y) !== 0 ? 2 : 0);
                        return (
                            i.canonical &&
                            g.cmp(this.nh) > 0 &&
                            ((g = this.n.sub(g)), (v ^= 1)),
                                new x3({ r: y, s: g, recoveryParam: v })
                        );
                    }
                }
            }
        }
    }
};
da.prototype.verify = function (e, r, n, i) {
    (e = this._truncateToN(new Bt(e, 16))),
        (n = this.keyFromPublic(n, i)),
        (r = new x3(r, "hex"));
    var o = r.r,
        s = r.s;
    if (
        o.cmpn(1) < 0 ||
        o.cmp(this.n) >= 0 ||
        s.cmpn(1) < 0 ||
        s.cmp(this.n) >= 0
    )
        return !1;
    var a = s.invm(this.n),
        c = a.mul(e).umod(this.n),
        l = a.mul(o).umod(this.n),
        u;
    return this.curve._maxwellTrick
        ? ((u = this.g.jmulAdd(c, n.getPublic(), l)),
            u.isInfinity() ? !1 : u.eqXToP(o))
        : ((u = this.g.mulAdd(c, n.getPublic(), l)),
            u.isInfinity() ? !1 : u.getX().umod(this.n).cmp(o) === 0);
};
da.prototype.recoverPubKey = function (t, e, r, n) {
    fK((3 & r) === r, "The recovery param is more than two bits"),
        (e = new x3(e, n));
    var i = this.n,
        o = new Bt(t),
        s = e.r,
        a = e.s,
        c = r & 1,
        l = r >> 1;
    if (s.cmp(this.curve.p.umod(this.curve.n)) >= 0 && l)
        throw new Error("Unable to find sencond key candinate");
    l
        ? (s = this.curve.pointFromX(s.add(this.curve.n), c))
        : (s = this.curve.pointFromX(s, c));
    var u = e.r.invm(i),
        f = i.sub(o).mul(u).umod(i),
        h = a.mul(u).umod(i);
    return this.g.mulAdd(f, s, h);
};
da.prototype.getKeyRecoveryParam = function (t, e, r, n) {
    if (((e = new x3(e, n)), e.recoveryParam !== null)) return e.recoveryParam;
    for (var i = 0; i < 4; i++) {
        var o;
        try {
            o = this.recoverPubKey(t, e, i);
        } catch {
            continue;
        }
        if (o.eq(r)) return i;
    }
    throw new Error("Unable to find valid recovery factor");
};
var DSe = Zm(function (t, e) {
        var r = e;
        (r.version = "6.5.4"),
            (r.utils = _s),
            (r.rand = function () {
                throw new Error("unsupported");
            }),
            (r.curve = P2),
            (r.curves = T2),
            (r.ec = FSe),
            (r.eddsa = null);
    }),
    LSe = DSe.ec;
const $Se = "signing-key/5.7.0",
    D5 = new ee($Se);
let m_ = null;
function vc() {
    return m_ || (m_ = new LSe("secp256k1")), m_;
}


function Dc(t) {
    if (typeof t != "string") t = ke(t);
    else if (!zt(t) || t.length % 2) return null;
    return (t.length - 2) / 2;
}
class n0 {
    constructor(e) {
        fe(this, "curve", "secp256k1"),
            fe(this, "privateKey", ke(e)),
        Dc(this.privateKey) !== 32 &&
        D5.throwArgumentError(
            "invalid private key",
            "privateKey",
            "[[ REDACTED ]]",
        );
        const r = vc().keyFromPrivate(Se(this.privateKey));
        fe(this, "publicKey", "0x" + r.getPublic(!1, "hex")),
            fe(this, "compressedPublicKey", "0x" + r.getPublic(!0, "hex")),
            fe(this, "_isSigningKey", !0);
    }
    _addPoint(e) {
        const r = vc().keyFromPublic(Se(this.publicKey)),
            n = vc().keyFromPublic(Se(e));
        return "0x" + r.pub.add(n.pub).encodeCompressed("hex");
    }
    signDigest(e) {
        const r = vc().keyFromPrivate(Se(this.privateKey)),
            n = Se(e);
        n.length !== 32 && D5.throwArgumentError("bad digest length", "digest", e);
        const i = r.sign(n, { canonical: !0 });
        return L0({
            recoveryParam: i.recoveryParam,
            r: Xr("0x" + i.r.toString(16), 32),
            s: Xr("0x" + i.s.toString(16), 32),
        });
    }
    computeSharedSecret(e) {
        const r = vc().keyFromPrivate(Se(this.privateKey)),
            n = vc().keyFromPublic(Se(p9(e)));
        return Xr("0x" + r.derive(n.getPublic()).toString(16), 32);
    }
    static isSigningKey(e) {
        return !!(e && e._isSigningKey);
    }
}

const o_ = "0123456789abcdef";

function ke(t, e) {
    if ((e || (e = {}), typeof t == "number")) {
        Tn.checkSafeUint53(t, "invalid hexlify value");
        let r = "";
        for (; t; ) (r = o_[t & 15] + r), (t = Math.floor(t / 16));
        return r.length ? (r.length % 2 && (r = "0" + r), "0x" + r) : "0x00";
    }
    if (typeof t == "bigint")
        return (t = t.toString(16)), t.length % 2 ? "0x0" + t : "0x" + t;
    if (
        (e.allowMissingPrefix &&
        typeof t == "string" &&
        t.substring(0, 2) !== "0x" &&
        (t = "0x" + t),
            iq(t))
    )
        return t.toHexString();
    if (zt(t))
        return (
            t.length % 2 &&
            (e.hexPad === "left"
                ? (t = "0x0" + t.substring(2))
                : e.hexPad === "right"
                    ? (t += "0")
                    : Tn.throwArgumentError("hex data is odd-length", "value", t)),
                t.toLowerCase()
        );
    if (D0(t)) {
        let r = "0x";
        for (let n = 0; n < t.length; n++) {
            let i = t[n];
            r += o_[(i & 240) >> 4] + o_[i & 15];
        }
        return r;
    }
    return Tn.throwArgumentError("invalid hexlify value", "value", t);
}

// const $Se = "signing-key/5.7.0",
//     D5 = new ee($Se);
function p9(t, e) {
    const r = Se(t);
    if (r.length === 32) {
        const n = new n0(r);
        return e ? "0x" + vc().keyFromPrivate(r).getPublic(!0, "hex") : n.publicKey;
    } else {
        if (r.length === 33)
            return e ? ke(r) : "0x" + vc().keyFromPublic(r).getPublic(!1, "hex");
        if (r.length === 65)
            return e ? "0x" + vc().keyFromPublic(r).getPublic(!0, "hex") : ke(r);
    }
    return D5.throwArgumentError(
        "invalid public or private key",
        "key",
        "[REDACTED]",
    );
}


const EEe = Object.freeze(
        Object.defineProperty(
            { __proto__: null, keccak256: Gr },
            Symbol.toStringTag,
            { value: "Module" },
        ),
    ),
    AEe = "rlp/5.7.0",
    fc = new ee(AEe);

function NF(t) {
    const e = [];
    for (; t; ) e.unshift(t & 255), (t >>= 8);
    return e;
}
function gq(t) {
    if (Array.isArray(t)) {
        let n = [];
        if (
            (t.forEach(function (o) {
                n = n.concat(gq(o));
            }),
            n.length <= 55)
        )
            return n.unshift(192 + n.length), n;
        const i = NF(n.length);
        return i.unshift(247 + i.length), i.concat(n);
    }
    $1(t) || fc.throwArgumentError("RLP object must be BytesLike", "object", t);
    const e = Array.prototype.slice.call(Se(t));
    if (e.length === 1 && e[0] <= 127) return e;
    if (e.length <= 55) return e.unshift(128 + e.length), e;
    const r = NF(e.length);
    return r.unshift(183 + r.length), r.concat(e);
}
function w0(t) {
    return ke(gq(t));
}
function p3(t) {
    const e = Se(t),
        r = vq(e, 0);
    return (
        r.consumed !== e.length &&
        fc.throwArgumentError("invalid rlp data", "data", t),
            r.result
    );
}
const SEe = Object.freeze(
        Object.defineProperty(
            { __proto__: null, decode: p3, encode: w0 },
            Symbol.toStringTag,
            { value: "Module" },
        ),
    ),
    CEe = "address/5.7.0",
    ff = new ee(CEe);
function LF(t) {
    zt(t, 20) || ff.throwArgumentError("invalid address", "address", t),
        (t = t.toLowerCase());
    const e = t.substring(2).split(""),
        r = new Uint8Array(40);
    for (let i = 0; i < 40; i++) r[i] = e[i].charCodeAt(0);
    const n = Se(Gr(r));
    for (let i = 0; i < 40; i += 2)
        n[i >> 1] >> 4 >= 8 && (e[i] = e[i].toUpperCase()),
        (n[i >> 1] & 15) >= 8 && (e[i + 1] = e[i + 1].toUpperCase());
    return "0x" + e.join("");
}

function jr(t) {
    let e = null;
    if (
        (typeof t != "string" &&
        ff.throwArgumentError("invalid address", "address", t),
            t.match(/^(0x)?[0-9a-fA-F]{40}$/))
    )
        t.substring(0, 2) !== "0x" && (t = "0x" + t),
            (e = LF(t)),
        t.match(/([A-F].*[a-f])|([a-f].*[A-F])/) &&
        e !== t &&
        ff.throwArgumentError("bad address checksum", "address", t);
    else if (t.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
        for (
            t.substring(2, 4) !== yq(t) &&
            ff.throwArgumentError("bad icap checksum", "address", t),
                e = aEe(t.substring(4));
            e.length < 40;

        )
            e = "0" + e;
        e = LF("0x" + e);
    } else ff.throwArgumentError("invalid address", "address", t);
    return e;
}
function Ln(t, e, r) {
    return (
        typeof t != "string"
            ? (t = ke(t))
            : (!zt(t) || t.length % 2) &&
            Tn.throwArgumentError("invalid hexData", "value", t),
            (e = 2 + 2 * e),
            r != null ? "0x" + t.substring(e, 2 + 2 * r) : "0x" + t.substring(e)
    );
}


var Ye =
    typeof globalThis < "u"
        ? globalThis
        : typeof window < "u"
            ? window
            : typeof global < "u"
                ? global
                : typeof self < "u"
                    ? self
                    : {};
var mq = { exports: {} };
/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.8.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2018
 * @license MIT
 */ (function (t) {
    (function () {
        var e = "input is invalid type",
            r = "finalize already called",
            n = typeof window == "object",
            i = n ? window : {};
        i.JS_SHA3_NO_WINDOW && (n = !1);
        var o = !n && typeof self == "object",
            s =
                !i.JS_SHA3_NO_NODE_JS &&
                typeof process == "object" &&
                process.versions &&
                process.versions.node;
        s ? (i = Ye) : o && (i = self);
        var a = !i.JS_SHA3_NO_COMMON_JS && !0 && t.exports,
            c = !i.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer < "u",
            l = "0123456789abcdef".split(""),
            u = [31, 7936, 2031616, 520093696],
            f = [4, 1024, 262144, 67108864],
            h = [1, 256, 65536, 16777216],
            m = [6, 1536, 393216, 100663296],
            y = [0, 8, 16, 24],
            g = [
                1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0,
                2147483649, 0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136,
                0, 2147516425, 0, 2147483658, 0, 2147516555, 0, 139, 2147483648, 32905,
                2147483648, 32771, 2147483648, 32770, 2147483648, 128, 2147483648,
                32778, 0, 2147483658, 2147483648, 2147516545, 2147483648, 32896,
                2147483648, 2147483649, 0, 2147516424, 2147483648,
            ],
            v = [224, 256, 384, 512],
            x = [128, 256],
            b = ["hex", "buffer", "arrayBuffer", "array", "digest"],
            w = { 128: 168, 256: 136 };
        (i.JS_SHA3_NO_NODE_JS || !Array.isArray) &&
        (Array.isArray = function (M) {
            return Object.prototype.toString.call(M) === "[object Array]";
        }),
        c &&
        (i.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView) &&
        (ArrayBuffer.isView = function (M) {
            return (
                typeof M == "object" &&
                M.buffer &&
                M.buffer.constructor === ArrayBuffer
            );
        });
        for (
            var S = function (M, Q, Y) {
                    return function (Z) {
                        return new C(M, Q, M).update(Z)[Y]();
                    };
                },
                P = function (M, Q, Y) {
                    return function (Z, te) {
                        return new C(M, Q, te).update(Z)[Y]();
                    };
                },
                O = function (M, Q, Y) {
                    return function (Z, te, le, se) {
                        return A["cshake" + M].update(Z, te, le, se)[Y]();
                    };
                },
                B = function (M, Q, Y) {
                    return function (Z, te, le, se) {
                        return A["kmac" + M].update(Z, te, le, se)[Y]();
                    };
                },
                k = function (M, Q, Y, Z) {
                    for (var te = 0; te < b.length; ++te) {
                        var le = b[te];
                        M[le] = Q(Y, Z, le);
                    }
                    return M;
                },
                z = function (M, Q) {
                    var Y = S(M, Q, "hex");
                    return (
                        (Y.create = function () {
                            return new C(M, Q, M);
                        }),
                            (Y.update = function (Z) {
                                return Y.create().update(Z);
                            }),
                            k(Y, S, M, Q)
                    );
                },
                D = function (M, Q) {
                    var Y = P(M, Q, "hex");
                    return (
                        (Y.create = function (Z) {
                            return new C(M, Q, Z);
                        }),
                            (Y.update = function (Z, te) {
                                return Y.create(te).update(Z);
                            }),
                            k(Y, P, M, Q)
                    );
                },
                H = function (M, Q) {
                    var Y = w[M],
                        Z = O(M, Q, "hex");
                    return (
                        (Z.create = function (te, le, se) {
                            return !le && !se
                                ? A["shake" + M].create(te)
                                : new C(M, Q, te).bytepad([le, se], Y);
                        }),
                            (Z.update = function (te, le, se, de) {
                                return Z.create(le, se, de).update(te);
                            }),
                            k(Z, O, M, Q)
                    );
                },
                W = function (M, Q) {
                    var Y = w[M],
                        Z = B(M, Q, "hex");
                    return (
                        (Z.create = function (te, le, se) {
                            return new j(M, Q, le).bytepad(["KMAC", se], Y).bytepad([te], Y);
                        }),
                            (Z.update = function (te, le, se, de) {
                                return Z.create(te, se, de).update(le);
                            }),
                            k(Z, B, M, Q)
                    );
                },
                N = [
                    { name: "keccak", padding: h, bits: v, createMethod: z },
                    { name: "sha3", padding: m, bits: v, createMethod: z },
                    { name: "shake", padding: u, bits: x, createMethod: D },
                    { name: "cshake", padding: f, bits: x, createMethod: H },
                    { name: "kmac", padding: f, bits: x, createMethod: W },
                ],
                A = {},
                _ = [],
                I = 0;
            I < N.length;
            ++I
        )
            for (var F = N[I], L = F.bits, U = 0; U < L.length; ++U) {
                var V = F.name + "_" + L[U];
                if (
                    (_.push(V),
                        (A[V] = F.createMethod(L[U], F.padding)),
                    F.name !== "sha3")
                ) {
                    var R = F.name + L[U];
                    _.push(R), (A[R] = A[V]);
                }
            }
        function C(M, Q, Y) {
            (this.blocks = []),
                (this.s = []),
                (this.padding = Q),
                (this.outputBits = Y),
                (this.reset = !0),
                (this.finalized = !1),
                (this.block = 0),
                (this.start = 0),
                (this.blockCount = (1600 - (M << 1)) >> 5),
                (this.byteCount = this.blockCount << 2),
                (this.outputBlocks = Y >> 5),
                (this.extraBytes = (Y & 31) >> 3);
            for (var Z = 0; Z < 50; ++Z) this.s[Z] = 0;
        }
        (C.prototype.update = function (M) {
            if (this.finalized) throw new Error(r);
            var Q,
                Y = typeof M;
            if (Y !== "string") {
                if (Y === "object") {
                    if (M === null) throw new Error(e);
                    if (c && M.constructor === ArrayBuffer) M = new Uint8Array(M);
                    else if (!Array.isArray(M) && (!c || !ArrayBuffer.isView(M)))
                        throw new Error(e);
                } else throw new Error(e);
                Q = !0;
            }
            for (
                var Z = this.blocks,
                    te = this.byteCount,
                    le = M.length,
                    se = this.blockCount,
                    de = 0,
                    _e = this.s,
                    ae,
                    Ae;
                de < le;

            ) {
                if (this.reset)
                    for (this.reset = !1, Z[0] = this.block, ae = 1; ae < se + 1; ++ae)
                        Z[ae] = 0;
                if (Q)
                    for (ae = this.start; de < le && ae < te; ++de)
                        Z[ae >> 2] |= M[de] << y[ae++ & 3];
                else
                    for (ae = this.start; de < le && ae < te; ++de)
                        (Ae = M.charCodeAt(de)),
                            Ae < 128
                                ? (Z[ae >> 2] |= Ae << y[ae++ & 3])
                                : Ae < 2048
                                    ? ((Z[ae >> 2] |= (192 | (Ae >> 6)) << y[ae++ & 3]),
                                        (Z[ae >> 2] |= (128 | (Ae & 63)) << y[ae++ & 3]))
                                    : Ae < 55296 || Ae >= 57344
                                        ? ((Z[ae >> 2] |= (224 | (Ae >> 12)) << y[ae++ & 3]),
                                            (Z[ae >> 2] |= (128 | ((Ae >> 6) & 63)) << y[ae++ & 3]),
                                            (Z[ae >> 2] |= (128 | (Ae & 63)) << y[ae++ & 3]))
                                        : ((Ae =
                                            65536 +
                                            (((Ae & 1023) << 10) | (M.charCodeAt(++de) & 1023))),
                                            (Z[ae >> 2] |= (240 | (Ae >> 18)) << y[ae++ & 3]),
                                            (Z[ae >> 2] |= (128 | ((Ae >> 12) & 63)) << y[ae++ & 3]),
                                            (Z[ae >> 2] |= (128 | ((Ae >> 6) & 63)) << y[ae++ & 3]),
                                            (Z[ae >> 2] |= (128 | (Ae & 63)) << y[ae++ & 3]));
                if (((this.lastByteIndex = ae), ae >= te)) {
                    for (this.start = ae - te, this.block = Z[se], ae = 0; ae < se; ++ae)
                        _e[ae] ^= Z[ae];
                    q(_e), (this.reset = !0);
                } else this.start = ae;
            }
            return this;
        }),
            (C.prototype.encode = function (M, Q) {
                var Y = M & 255,
                    Z = 1,
                    te = [Y];
                for (M = M >> 8, Y = M & 255; Y > 0; )
                    te.unshift(Y), (M = M >> 8), (Y = M & 255), ++Z;
                return Q ? te.push(Z) : te.unshift(Z), this.update(te), te.length;
            }),
            (C.prototype.encodeString = function (M) {
                var Q,
                    Y = typeof M;
                if (Y !== "string") {
                    if (Y === "object") {
                        if (M === null) throw new Error(e);
                        if (c && M.constructor === ArrayBuffer) M = new Uint8Array(M);
                        else if (!Array.isArray(M) && (!c || !ArrayBuffer.isView(M)))
                            throw new Error(e);
                    } else throw new Error(e);
                    Q = !0;
                }
                var Z = 0,
                    te = M.length;
                if (Q) Z = te;
                else
                    for (var le = 0; le < M.length; ++le) {
                        var se = M.charCodeAt(le);
                        se < 128
                            ? (Z += 1)
                            : se < 2048
                                ? (Z += 2)
                                : se < 55296 || se >= 57344
                                    ? (Z += 3)
                                    : ((se =
                                        65536 +
                                        (((se & 1023) << 10) | (M.charCodeAt(++le) & 1023))),
                                        (Z += 4));
                    }
                return (Z += this.encode(Z * 8)), this.update(M), Z;
            }),
            (C.prototype.bytepad = function (M, Q) {
                for (var Y = this.encode(Q), Z = 0; Z < M.length; ++Z)
                    Y += this.encodeString(M[Z]);
                var te = Q - (Y % Q),
                    le = [];
                return (le.length = te), this.update(le), this;
            }),
            (C.prototype.finalize = function () {
                if (!this.finalized) {
                    this.finalized = !0;
                    var M = this.blocks,
                        Q = this.lastByteIndex,
                        Y = this.blockCount,
                        Z = this.s;
                    if (
                        ((M[Q >> 2] |= this.padding[Q & 3]),
                        this.lastByteIndex === this.byteCount)
                    )
                        for (M[0] = M[Y], Q = 1; Q < Y + 1; ++Q) M[Q] = 0;
                    for (M[Y - 1] |= 2147483648, Q = 0; Q < Y; ++Q) Z[Q] ^= M[Q];
                    q(Z);
                }
            }),
            (C.prototype.toString = C.prototype.hex =
                function () {
                    this.finalize();
                    for (
                        var M = this.blockCount,
                            Q = this.s,
                            Y = this.outputBlocks,
                            Z = this.extraBytes,
                            te = 0,
                            le = 0,
                            se = "",
                            de;
                        le < Y;

                    ) {
                        for (te = 0; te < M && le < Y; ++te, ++le)
                            (de = Q[te]),
                                (se +=
                                    l[(de >> 4) & 15] +
                                    l[de & 15] +
                                    l[(de >> 12) & 15] +
                                    l[(de >> 8) & 15] +
                                    l[(de >> 20) & 15] +
                                    l[(de >> 16) & 15] +
                                    l[(de >> 28) & 15] +
                                    l[(de >> 24) & 15]);
                        le % M === 0 && (q(Q), (te = 0));
                    }
                    return (
                        Z &&
                        ((de = Q[te]),
                            (se += l[(de >> 4) & 15] + l[de & 15]),
                        Z > 1 && (se += l[(de >> 12) & 15] + l[(de >> 8) & 15]),
                        Z > 2 && (se += l[(de >> 20) & 15] + l[(de >> 16) & 15])),
                            se
                    );
                }),
            (C.prototype.arrayBuffer = function () {
                this.finalize();
                var M = this.blockCount,
                    Q = this.s,
                    Y = this.outputBlocks,
                    Z = this.extraBytes,
                    te = 0,
                    le = 0,
                    se = this.outputBits >> 3,
                    de;
                Z ? (de = new ArrayBuffer((Y + 1) << 2)) : (de = new ArrayBuffer(se));
                for (var _e = new Uint32Array(de); le < Y; ) {
                    for (te = 0; te < M && le < Y; ++te, ++le) _e[le] = Q[te];
                    le % M === 0 && q(Q);
                }
                return Z && ((_e[te] = Q[te]), (de = de.slice(0, se))), de;
            }),
            (C.prototype.buffer = C.prototype.arrayBuffer),
            (C.prototype.digest = C.prototype.array =
                function () {
                    this.finalize();
                    for (
                        var M = this.blockCount,
                            Q = this.s,
                            Y = this.outputBlocks,
                            Z = this.extraBytes,
                            te = 0,
                            le = 0,
                            se = [],
                            de,
                            _e;
                        le < Y;

                    ) {
                        for (te = 0; te < M && le < Y; ++te, ++le)
                            (de = le << 2),
                                (_e = Q[te]),
                                (se[de] = _e & 255),
                                (se[de + 1] = (_e >> 8) & 255),
                                (se[de + 2] = (_e >> 16) & 255),
                                (se[de + 3] = (_e >> 24) & 255);
                        le % M === 0 && q(Q);
                    }
                    return (
                        Z &&
                        ((de = le << 2),
                            (_e = Q[te]),
                            (se[de] = _e & 255),
                        Z > 1 && (se[de + 1] = (_e >> 8) & 255),
                        Z > 2 && (se[de + 2] = (_e >> 16) & 255)),
                            se
                    );
                });
        function j(M, Q, Y) {
            C.call(this, M, Q, Y);
        }
        (j.prototype = new C()),
            (j.prototype.finalize = function () {
                return (
                    this.encode(this.outputBits, !0), C.prototype.finalize.call(this)
                );
            });
        var q = function (M) {
            var Q,
                Y,
                Z,
                te,
                le,
                se,
                de,
                _e,
                ae,
                Ae,
                lt,
                Me,
                Ve,
                Re,
                xe,
                ve,
                He,
                Oe,
                Ze,
                ut,
                Je,
                wt,
                Ht,
                $e,
                tt,
                Ut,
                Mt,
                Jt,
                Un,
                Lt,
                st,
                Hr,
                Yt,
                Rt,
                Or,
                Nt,
                Qt,
                er,
                ot,
                Ke,
                It,
                rt,
                yt,
                Fr,
                Vt,
                Wt,
                $t,
                Et,
                tr,
                Vn,
                gr,
                br,
                Ur,
                cr,
                lr,
                Oi,
                wr,
                Cr,
                ai,
                ci,
                go,
                Vr,
                Xi;
            for (Z = 0; Z < 48; Z += 2)
                (te = M[0] ^ M[10] ^ M[20] ^ M[30] ^ M[40]),
                    (le = M[1] ^ M[11] ^ M[21] ^ M[31] ^ M[41]),
                    (se = M[2] ^ M[12] ^ M[22] ^ M[32] ^ M[42]),
                    (de = M[3] ^ M[13] ^ M[23] ^ M[33] ^ M[43]),
                    (_e = M[4] ^ M[14] ^ M[24] ^ M[34] ^ M[44]),
                    (ae = M[5] ^ M[15] ^ M[25] ^ M[35] ^ M[45]),
                    (Ae = M[6] ^ M[16] ^ M[26] ^ M[36] ^ M[46]),
                    (lt = M[7] ^ M[17] ^ M[27] ^ M[37] ^ M[47]),
                    (Me = M[8] ^ M[18] ^ M[28] ^ M[38] ^ M[48]),
                    (Ve = M[9] ^ M[19] ^ M[29] ^ M[39] ^ M[49]),
                    (Q = Me ^ ((se << 1) | (de >>> 31))),
                    (Y = Ve ^ ((de << 1) | (se >>> 31))),
                    (M[0] ^= Q),
                    (M[1] ^= Y),
                    (M[10] ^= Q),
                    (M[11] ^= Y),
                    (M[20] ^= Q),
                    (M[21] ^= Y),
                    (M[30] ^= Q),
                    (M[31] ^= Y),
                    (M[40] ^= Q),
                    (M[41] ^= Y),
                    (Q = te ^ ((_e << 1) | (ae >>> 31))),
                    (Y = le ^ ((ae << 1) | (_e >>> 31))),
                    (M[2] ^= Q),
                    (M[3] ^= Y),
                    (M[12] ^= Q),
                    (M[13] ^= Y),
                    (M[22] ^= Q),
                    (M[23] ^= Y),
                    (M[32] ^= Q),
                    (M[33] ^= Y),
                    (M[42] ^= Q),
                    (M[43] ^= Y),
                    (Q = se ^ ((Ae << 1) | (lt >>> 31))),
                    (Y = de ^ ((lt << 1) | (Ae >>> 31))),
                    (M[4] ^= Q),
                    (M[5] ^= Y),
                    (M[14] ^= Q),
                    (M[15] ^= Y),
                    (M[24] ^= Q),
                    (M[25] ^= Y),
                    (M[34] ^= Q),
                    (M[35] ^= Y),
                    (M[44] ^= Q),
                    (M[45] ^= Y),
                    (Q = _e ^ ((Me << 1) | (Ve >>> 31))),
                    (Y = ae ^ ((Ve << 1) | (Me >>> 31))),
                    (M[6] ^= Q),
                    (M[7] ^= Y),
                    (M[16] ^= Q),
                    (M[17] ^= Y),
                    (M[26] ^= Q),
                    (M[27] ^= Y),
                    (M[36] ^= Q),
                    (M[37] ^= Y),
                    (M[46] ^= Q),
                    (M[47] ^= Y),
                    (Q = Ae ^ ((te << 1) | (le >>> 31))),
                    (Y = lt ^ ((le << 1) | (te >>> 31))),
                    (M[8] ^= Q),
                    (M[9] ^= Y),
                    (M[18] ^= Q),
                    (M[19] ^= Y),
                    (M[28] ^= Q),
                    (M[29] ^= Y),
                    (M[38] ^= Q),
                    (M[39] ^= Y),
                    (M[48] ^= Q),
                    (M[49] ^= Y),
                    (Re = M[0]),
                    (xe = M[1]),
                    (Wt = (M[11] << 4) | (M[10] >>> 28)),
                    ($t = (M[10] << 4) | (M[11] >>> 28)),
                    (Jt = (M[20] << 3) | (M[21] >>> 29)),
                    (Un = (M[21] << 3) | (M[20] >>> 29)),
                    (ci = (M[31] << 9) | (M[30] >>> 23)),
                    (go = (M[30] << 9) | (M[31] >>> 23)),
                    (rt = (M[40] << 18) | (M[41] >>> 14)),
                    (yt = (M[41] << 18) | (M[40] >>> 14)),
                    (Rt = (M[2] << 1) | (M[3] >>> 31)),
                    (Or = (M[3] << 1) | (M[2] >>> 31)),
                    (ve = (M[13] << 12) | (M[12] >>> 20)),
                    (He = (M[12] << 12) | (M[13] >>> 20)),
                    (Et = (M[22] << 10) | (M[23] >>> 22)),
                    (tr = (M[23] << 10) | (M[22] >>> 22)),
                    (Lt = (M[33] << 13) | (M[32] >>> 19)),
                    (st = (M[32] << 13) | (M[33] >>> 19)),
                    (Vr = (M[42] << 2) | (M[43] >>> 30)),
                    (Xi = (M[43] << 2) | (M[42] >>> 30)),
                    (cr = (M[5] << 30) | (M[4] >>> 2)),
                    (lr = (M[4] << 30) | (M[5] >>> 2)),
                    (Nt = (M[14] << 6) | (M[15] >>> 26)),
                    (Qt = (M[15] << 6) | (M[14] >>> 26)),
                    (Oe = (M[25] << 11) | (M[24] >>> 21)),
                    (Ze = (M[24] << 11) | (M[25] >>> 21)),
                    (Vn = (M[34] << 15) | (M[35] >>> 17)),
                    (gr = (M[35] << 15) | (M[34] >>> 17)),
                    (Hr = (M[45] << 29) | (M[44] >>> 3)),
                    (Yt = (M[44] << 29) | (M[45] >>> 3)),
                    ($e = (M[6] << 28) | (M[7] >>> 4)),
                (tt = (M[7] << 28) | (M[6] >>> 4)),
                (Oi = (M[17] << 23) | (M[16] >>> 9)),
                (wr = (M[16] << 23) | (M[17] >>> 9)),
                (er = (M[26] << 25) | (M[27] >>> 7)),
                (ot = (M[27] << 25) | (M[26] >>> 7)),
                (ut = (M[36] << 21) | (M[37] >>> 11)),
                (Je = (M[37] << 21) | (M[36] >>> 11)),
                (br = (M[47] << 24) | (M[46] >>> 8)),
                (Ur = (M[46] << 24) | (M[47] >>> 8)),
                (Fr = (M[8] << 27) | (M[9] >>> 5)),
                (Vt = (M[9] << 27) | (M[8] >>> 5)),
                (Ut = (M[18] << 20) | (M[19] >>> 12)),
                (Mt = (M[19] << 20) | (M[18] >>> 12)),
                (Cr = (M[29] << 7) | (M[28] >>> 25)),
                (ai = (M[28] << 7) | (M[29] >>> 25)),
                (Ke = (M[38] << 8) | (M[39] >>> 24)),
                (It = (M[39] << 8) | (M[38] >>> 24)),
                (wt = (M[48] << 14) | (M[49] >>> 18)),
                (Ht = (M[49] << 14) | (M[48] >>> 18)),
                (M[0] = Re ^ (~ve & Oe)),
                (M[1] = xe ^ (~He & Ze)),
                (M[10] = $e ^ (~Ut & Jt)),
                (M[11] = tt ^ (~Mt & Un)),
                (M[20] = Rt ^ (~Nt & er)),
                (M[21] = Or ^ (~Qt & ot)),
                (M[30] = Fr ^ (~Wt & Et)),
                (M[31] = Vt ^ (~$t & tr)),
                (M[40] = cr ^ (~Oi & Cr)),
                (M[41] = lr ^ (~wr & ai)),
                (M[2] = ve ^ (~Oe & ut)),
                (M[3] = He ^ (~Ze & Je)),
                (M[12] = Ut ^ (~Jt & Lt)),
                (M[13] = Mt ^ (~Un & st)),
                (M[22] = Nt ^ (~er & Ke)),
                (M[23] = Qt ^ (~ot & It)),
                (M[32] = Wt ^ (~Et & Vn)),
                (M[33] = $t ^ (~tr & gr)),
                (M[42] = Oi ^ (~Cr & ci)),
                (M[43] = wr ^ (~ai & go)),
                (M[4] = Oe ^ (~ut & wt)),
                (M[5] = Ze ^ (~Je & Ht)),
                (M[14] = Jt ^ (~Lt & Hr)),
                (M[15] = Un ^ (~st & Yt)),
                (M[24] = er ^ (~Ke & rt)),
                (M[25] = ot ^ (~It & yt)),
                (M[34] = Et ^ (~Vn & br)),
                (M[35] = tr ^ (~gr & Ur)),
                (M[44] = Cr ^ (~ci & Vr)),
                (M[45] = ai ^ (~go & Xi)),
                (M[6] = ut ^ (~wt & Re)),
                (M[7] = Je ^ (~Ht & xe)),
                (M[16] = Lt ^ (~Hr & $e)),
                (M[17] = st ^ (~Yt & tt)),
                (M[26] = Ke ^ (~rt & Rt)),
                (M[27] = It ^ (~yt & Or)),
                (M[36] = Vn ^ (~br & Fr)),
                (M[37] = gr ^ (~Ur & Vt)),
                (M[46] = ci ^ (~Vr & cr)),
                (M[47] = go ^ (~Xi & lr)),
                (M[8] = wt ^ (~Re & ve)),
                (M[9] = Ht ^ (~xe & He)),
                (M[18] = Hr ^ (~$e & Ut)),
                (M[19] = Yt ^ (~tt & Mt)),
                (M[28] = rt ^ (~Rt & Nt)),
                (M[29] = yt ^ (~Or & Qt)),
                (M[38] = br ^ (~Fr & Wt)),
                (M[39] = Ur ^ (~Vt & $t)),
                (M[48] = Vr ^ (~cr & Oi)),
                (M[49] = Xi ^ (~lr & wr)),
                (M[0] ^= g[Z]),
                (M[1] ^= g[Z + 1]);
        };
        if (a) t.exports = A;
        else for (I = 0; I < _.length; ++I) i[_[I]] = A[_[I]];
    })();
})(mq);

function ho(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default")
        ? t.default
        : t;
}
var bEe = mq.exports;
const wEe = ho(bEe);
function Gr(t) {
    return "0x" + wEe.keccak_256(Se(t));
}
function Sf(t) {
    const e = p9(t);
    return jr(Ln(Gr(Ln(e, 1)), 12));
}


class Gm {
    constructor() {
        ZAe.checkAbstract(new.target, Gm), fe(this, "_isProvider", !0);
    }
    getFeeData() {
        return XAe(this, void 0, void 0, function* () {
            const { block: e, gasPrice: r } = yield Rn({
                block: this.getBlock("latest"),
                gasPrice: this.getGasPrice().catch((s) => null),
            });
            let n = null,
                i = null,
                o = null;
            return (
                e &&
                e.baseFeePerGas &&
                ((n = e.baseFeePerGas),
                    (o = Ie.from("1500000000")),
                    (i = e.baseFeePerGas.mul(2).add(o))),
                    {
                        lastBaseFeePerGas: n,
                        maxFeePerGas: i,
                        maxPriorityFeePerGas: o,
                        gasPrice: r,
                    }
            );
        });
    }
    addListener(e, r) {
        return this.on(e, r);
    }
    removeListener(e, r) {
        return this.off(e, r);
    }
    static isProvider(e) {
        return !!(e && e._isProvider);
    }
}

BCe = "wallet/5.7.0";
var cD = function (t, e, r, n) {
    function i(o) {
        return o instanceof r
            ? o
            : new r(function (s) {
                s(o);
            });
    }
    return new (r || (r = Promise))(function (o, s) {
        function a(u) {
            try {
                l(n.next(u));
            } catch (f) {
                s(f);
            }
        }
        function c(u) {
            try {
                l(n.throw(u));
            } catch (f) {
                s(f);
            }
        }
        function l(u) {
            u.done ? o(u.value) : i(u.value).then(a, c);
        }
        l((n = n.apply(t, e || [])).next());
    });
};
const xh = new ee(BCe);
function MCe(t) {
    return t != null && zt(t.privateKey, 32) && t.address != null;
}
function NCe(t) {
    const e = t.mnemonic;
    return e && e.phrase;
}



const cCe = "wordlists/5.7.0",
    lCe = new ee(cCe);



const UEe = "strings/5.7.0",
    Cq = new ee(UEe);
var Lc;
(function (t) {
    (t.current = ""),
        (t.NFC = "NFC"),
        (t.NFD = "NFD"),
        (t.NFKC = "NFKC"),
        (t.NFKD = "NFKD");
})(Lc || (Lc = {}));
var Po;
(function (t) {
    (t.UNEXPECTED_CONTINUE = "unexpected continuation byte"),
        (t.BAD_PREFIX = "bad codepoint prefix"),
        (t.OVERRUN = "string overrun"),
        (t.MISSING_CONTINUE = "missing continuation byte"),
        (t.OUT_OF_RANGE = "out of UTF-8 range"),
        (t.UTF16_SURROGATE = "UTF-16 surrogate"),
        (t.OVERLONG = "overlong representation");
})(Po || (Po = {}));
function VEe(t, e, r, n, i) {
    return Cq.throwArgumentError(
        `invalid codepoint at offset ${e}; ${t}`,
        "bytes",
        r,
    );
}
function Hn(t, e = Lc.current) {
    e != Lc.current && (Cq.checkNormalize(), (t = t.normalize(e)));
    let r = [];
    for (let n = 0; n < t.length; n++) {
        const i = t.charCodeAt(n);
        if (i < 128) r.push(i);
        else if (i < 2048) r.push((i >> 6) | 192), r.push((i & 63) | 128);
        else if ((i & 64512) == 55296) {
            n++;
            const o = t.charCodeAt(n);
            if (n >= t.length || (o & 64512) !== 56320)
                throw new Error("invalid utf-8 string");
            const s = 65536 + ((i & 1023) << 10) + (o & 1023);
            r.push((s >> 18) | 240),
                r.push(((s >> 12) & 63) | 128),
                r.push(((s >> 6) & 63) | 128),
                r.push((s & 63) | 128);
        } else
            r.push((i >> 12) | 224),
                r.push(((i >> 6) & 63) | 128),
                r.push((i & 63) | 128);
    }
    return Se(r);
}
function df(t) {
    return Gr(Hn(t));
}

const sq = "bignumber/5.7.0";
const El = new ee(sq),
    s_ = {},
    IF = 9007199254740991;

class V1 {
    constructor(e) {
        lCe.checkAbstract(new.target, V1), fe(this, "locale", e);
    }
    split(e) {
        return e.toLowerCase().split(/ +/g);
    }
    join(e) {
        return e.join(" ");
    }
    static check(e) {
        const r = [];
        for (let n = 0; n < 2048; n++) {
            const i = e.getWord(n);
            if (n !== e.getWordIndex(i)) return "0x";
            r.push(i);
        }
        return df(
            r.join(`
`) +
            `
`,
        );
    }
    static register(e, r) {
        r || (r = e.locale);
    }
}
const uCe =
    "AbandonAbilityAbleAboutAboveAbsentAbsorbAbstractAbsurdAbuseAccessAccidentAccountAccuseAchieveAcidAcousticAcquireAcrossActActionActorActressActualAdaptAddAddictAddressAdjustAdmitAdultAdvanceAdviceAerobicAffairAffordAfraidAgainAgeAgentAgreeAheadAimAirAirportAisleAlarmAlbumAlcoholAlertAlienAllAlleyAllowAlmostAloneAlphaAlreadyAlsoAlterAlwaysAmateurAmazingAmongAmountAmusedAnalystAnchorAncientAngerAngleAngryAnimalAnkleAnnounceAnnualAnotherAnswerAntennaAntiqueAnxietyAnyApartApologyAppearAppleApproveAprilArchArcticAreaArenaArgueArmArmedArmorArmyAroundArrangeArrestArriveArrowArtArtefactArtistArtworkAskAspectAssaultAssetAssistAssumeAsthmaAthleteAtomAttackAttendAttitudeAttractAuctionAuditAugustAuntAuthorAutoAutumnAverageAvocadoAvoidAwakeAwareAwayAwesomeAwfulAwkwardAxisBabyBachelorBaconBadgeBagBalanceBalconyBallBambooBananaBannerBarBarelyBargainBarrelBaseBasicBasketBattleBeachBeanBeautyBecauseBecomeBeefBeforeBeginBehaveBehindBelieveBelowBeltBenchBenefitBestBetrayBetterBetweenBeyondBicycleBidBikeBindBiologyBirdBirthBitterBlackBladeBlameBlanketBlastBleakBlessBlindBloodBlossomBlouseBlueBlurBlushBoardBoatBodyBoilBombBoneBonusBookBoostBorderBoringBorrowBossBottomBounceBoxBoyBracketBrainBrandBrassBraveBreadBreezeBrickBridgeBriefBrightBringBriskBroccoliBrokenBronzeBroomBrotherBrownBrushBubbleBuddyBudgetBuffaloBuildBulbBulkBulletBundleBunkerBurdenBurgerBurstBusBusinessBusyButterBuyerBuzzCabbageCabinCableCactusCageCakeCallCalmCameraCampCanCanalCancelCandyCannonCanoeCanvasCanyonCapableCapitalCaptainCarCarbonCardCargoCarpetCarryCartCaseCashCasinoCastleCasualCatCatalogCatchCategoryCattleCaughtCauseCautionCaveCeilingCeleryCementCensusCenturyCerealCertainChairChalkChampionChangeChaosChapterChargeChaseChatCheapCheckCheeseChefCherryChestChickenChiefChildChimneyChoiceChooseChronicChuckleChunkChurnCigarCinnamonCircleCitizenCityCivilClaimClapClarifyClawClayCleanClerkCleverClickClientCliffClimbClinicClipClockClogCloseClothCloudClownClubClumpClusterClutchCoachCoastCoconutCodeCoffeeCoilCoinCollectColorColumnCombineComeComfortComicCommonCompanyConcertConductConfirmCongressConnectConsiderControlConvinceCookCoolCopperCopyCoralCoreCornCorrectCostCottonCouchCountryCoupleCourseCousinCoverCoyoteCrackCradleCraftCramCraneCrashCraterCrawlCrazyCreamCreditCreekCrewCricketCrimeCrispCriticCropCrossCrouchCrowdCrucialCruelCruiseCrumbleCrunchCrushCryCrystalCubeCultureCupCupboardCuriousCurrentCurtainCurveCushionCustomCuteCycleDadDamageDampDanceDangerDaringDashDaughterDawnDayDealDebateDebrisDecadeDecemberDecideDeclineDecorateDecreaseDeerDefenseDefineDefyDegreeDelayDeliverDemandDemiseDenialDentistDenyDepartDependDepositDepthDeputyDeriveDescribeDesertDesignDeskDespairDestroyDetailDetectDevelopDeviceDevoteDiagramDialDiamondDiaryDiceDieselDietDifferDigitalDignityDilemmaDinnerDinosaurDirectDirtDisagreeDiscoverDiseaseDishDismissDisorderDisplayDistanceDivertDivideDivorceDizzyDoctorDocumentDogDollDolphinDomainDonateDonkeyDonorDoorDoseDoubleDoveDraftDragonDramaDrasticDrawDreamDressDriftDrillDrinkDripDriveDropDrumDryDuckDumbDuneDuringDustDutchDutyDwarfDynamicEagerEagleEarlyEarnEarthEasilyEastEasyEchoEcologyEconomyEdgeEditEducateEffortEggEightEitherElbowElderElectricElegantElementElephantElevatorEliteElseEmbarkEmbodyEmbraceEmergeEmotionEmployEmpowerEmptyEnableEnactEndEndlessEndorseEnemyEnergyEnforceEngageEngineEnhanceEnjoyEnlistEnoughEnrichEnrollEnsureEnterEntireEntryEnvelopeEpisodeEqualEquipEraEraseErodeErosionErrorEruptEscapeEssayEssenceEstateEternalEthicsEvidenceEvilEvokeEvolveExactExampleExcessExchangeExciteExcludeExcuseExecuteExerciseExhaustExhibitExileExistExitExoticExpandExpectExpireExplainExposeExpressExtendExtraEyeEyebrowFabricFaceFacultyFadeFaintFaithFallFalseFameFamilyFamousFanFancyFantasyFarmFashionFatFatalFatherFatigueFaultFavoriteFeatureFebruaryFederalFeeFeedFeelFemaleFenceFestivalFetchFeverFewFiberFictionFieldFigureFileFilmFilterFinalFindFineFingerFinishFireFirmFirstFiscalFishFitFitnessFixFlagFlameFlashFlatFlavorFleeFlightFlipFloatFlockFloorFlowerFluidFlushFlyFoamFocusFogFoilFoldFollowFoodFootForceForestForgetForkFortuneForumForwardFossilFosterFoundFoxFragileFrameFrequentFreshFriendFringeFrogFrontFrostFrownFrozenFruitFuelFunFunnyFurnaceFuryFutureGadgetGainGalaxyGalleryGameGapGarageGarbageGardenGarlicGarmentGasGaspGateGatherGaugeGazeGeneralGeniusGenreGentleGenuineGestureGhostGiantGiftGiggleGingerGiraffeGirlGiveGladGlanceGlareGlassGlideGlimpseGlobeGloomGloryGloveGlowGlueGoatGoddessGoldGoodGooseGorillaGospelGossipGovernGownGrabGraceGrainGrantGrapeGrassGravityGreatGreenGridGriefGritGroceryGroupGrowGruntGuardGuessGuideGuiltGuitarGunGymHabitHairHalfHammerHamsterHandHappyHarborHardHarshHarvestHatHaveHawkHazardHeadHealthHeartHeavyHedgehogHeightHelloHelmetHelpHenHeroHiddenHighHillHintHipHireHistoryHobbyHockeyHoldHoleHolidayHollowHomeHoneyHoodHopeHornHorrorHorseHospitalHostHotelHourHoverHubHugeHumanHumbleHumorHundredHungryHuntHurdleHurryHurtHusbandHybridIceIconIdeaIdentifyIdleIgnoreIllIllegalIllnessImageImitateImmenseImmuneImpactImposeImproveImpulseInchIncludeIncomeIncreaseIndexIndicateIndoorIndustryInfantInflictInformInhaleInheritInitialInjectInjuryInmateInnerInnocentInputInquiryInsaneInsectInsideInspireInstallIntactInterestIntoInvestInviteInvolveIronIslandIsolateIssueItemIvoryJacketJaguarJarJazzJealousJeansJellyJewelJobJoinJokeJourneyJoyJudgeJuiceJumpJungleJuniorJunkJustKangarooKeenKeepKetchupKeyKickKidKidneyKindKingdomKissKitKitchenKiteKittenKiwiKneeKnifeKnockKnowLabLabelLaborLadderLadyLakeLampLanguageLaptopLargeLaterLatinLaughLaundryLavaLawLawnLawsuitLayerLazyLeaderLeafLearnLeaveLectureLeftLegLegalLegendLeisureLemonLendLengthLensLeopardLessonLetterLevelLiarLibertyLibraryLicenseLifeLiftLightLikeLimbLimitLinkLionLiquidListLittleLiveLizardLoadLoanLobsterLocalLockLogicLonelyLongLoopLotteryLoudLoungeLoveLoyalLuckyLuggageLumberLunarLunchLuxuryLyricsMachineMadMagicMagnetMaidMailMainMajorMakeMammalManManageMandateMangoMansionManualMapleMarbleMarchMarginMarineMarketMarriageMaskMassMasterMatchMaterialMathMatrixMatterMaximumMazeMeadowMeanMeasureMeatMechanicMedalMediaMelodyMeltMemberMemoryMentionMenuMercyMergeMeritMerryMeshMessageMetalMethodMiddleMidnightMilkMillionMimicMindMinimumMinorMinuteMiracleMirrorMiseryMissMistakeMixMixedMixtureMobileModelModifyMomMomentMonitorMonkeyMonsterMonthMoonMoralMoreMorningMosquitoMotherMotionMotorMountainMouseMoveMovieMuchMuffinMuleMultiplyMuscleMuseumMushroomMusicMustMutualMyselfMysteryMythNaiveNameNapkinNarrowNastyNationNatureNearNeckNeedNegativeNeglectNeitherNephewNerveNestNetNetworkNeutralNeverNewsNextNiceNightNobleNoiseNomineeNoodleNormalNorthNoseNotableNoteNothingNoticeNovelNowNuclearNumberNurseNutOakObeyObjectObligeObscureObserveObtainObviousOccurOceanOctoberOdorOffOfferOfficeOftenOilOkayOldOliveOlympicOmitOnceOneOnionOnlineOnlyOpenOperaOpinionOpposeOptionOrangeOrbitOrchardOrderOrdinaryOrganOrientOriginalOrphanOstrichOtherOutdoorOuterOutputOutsideOvalOvenOverOwnOwnerOxygenOysterOzonePactPaddlePagePairPalacePalmPandaPanelPanicPantherPaperParadeParentParkParrotPartyPassPatchPathPatientPatrolPatternPausePavePaymentPeacePeanutPearPeasantPelicanPenPenaltyPencilPeoplePepperPerfectPermitPersonPetPhonePhotoPhrasePhysicalPianoPicnicPicturePiecePigPigeonPillPilotPinkPioneerPipePistolPitchPizzaPlacePlanetPlasticPlatePlayPleasePledgePluckPlugPlungePoemPoetPointPolarPolePolicePondPonyPoolPopularPortionPositionPossiblePostPotatoPotteryPovertyPowderPowerPracticePraisePredictPreferPreparePresentPrettyPreventPricePridePrimaryPrintPriorityPrisonPrivatePrizeProblemProcessProduceProfitProgramProjectPromoteProofPropertyProsperProtectProudProvidePublicPuddingPullPulpPulsePumpkinPunchPupilPuppyPurchasePurityPurposePursePushPutPuzzlePyramidQualityQuantumQuarterQuestionQuickQuitQuizQuoteRabbitRaccoonRaceRackRadarRadioRailRainRaiseRallyRampRanchRandomRangeRapidRareRateRatherRavenRawRazorReadyRealReasonRebelRebuildRecallReceiveRecipeRecordRecycleReduceReflectReformRefuseRegionRegretRegularRejectRelaxReleaseReliefRelyRemainRememberRemindRemoveRenderRenewRentReopenRepairRepeatReplaceReportRequireRescueResembleResistResourceResponseResultRetireRetreatReturnReunionRevealReviewRewardRhythmRibRibbonRiceRichRideRidgeRifleRightRigidRingRiotRippleRiskRitualRivalRiverRoadRoastRobotRobustRocketRomanceRoofRookieRoomRoseRotateRoughRoundRouteRoyalRubberRudeRugRuleRunRunwayRuralSadSaddleSadnessSafeSailSaladSalmonSalonSaltSaluteSameSampleSandSatisfySatoshiSauceSausageSaveSayScaleScanScareScatterSceneSchemeSchoolScienceScissorsScorpionScoutScrapScreenScriptScrubSeaSearchSeasonSeatSecondSecretSectionSecuritySeedSeekSegmentSelectSellSeminarSeniorSenseSentenceSeriesServiceSessionSettleSetupSevenShadowShaftShallowShareShedShellSheriffShieldShiftShineShipShiverShockShoeShootShopShortShoulderShoveShrimpShrugShuffleShySiblingSickSideSiegeSightSignSilentSilkSillySilverSimilarSimpleSinceSingSirenSisterSituateSixSizeSkateSketchSkiSkillSkinSkirtSkullSlabSlamSleepSlenderSliceSlideSlightSlimSloganSlotSlowSlushSmallSmartSmileSmokeSmoothSnackSnakeSnapSniffSnowSoapSoccerSocialSockSodaSoftSolarSoldierSolidSolutionSolveSomeoneSongSoonSorrySortSoulSoundSoupSourceSouthSpaceSpareSpatialSpawnSpeakSpecialSpeedSpellSpendSphereSpiceSpiderSpikeSpinSpiritSplitSpoilSponsorSpoonSportSpotSpraySpreadSpringSpySquareSqueezeSquirrelStableStadiumStaffStageStairsStampStandStartStateStaySteakSteelStemStepStereoStickStillStingStockStomachStoneStoolStoryStoveStrategyStreetStrikeStrongStruggleStudentStuffStumbleStyleSubjectSubmitSubwaySuccessSuchSuddenSufferSugarSuggestSuitSummerSunSunnySunsetSuperSupplySupremeSureSurfaceSurgeSurpriseSurroundSurveySuspectSustainSwallowSwampSwapSwarmSwearSweetSwiftSwimSwingSwitchSwordSymbolSymptomSyrupSystemTableTackleTagTailTalentTalkTankTapeTargetTaskTasteTattooTaxiTeachTeamTellTenTenantTennisTentTermTestTextThankThatThemeThenTheoryThereTheyThingThisThoughtThreeThriveThrowThumbThunderTicketTideTigerTiltTimberTimeTinyTipTiredTissueTitleToastTobaccoTodayToddlerToeTogetherToiletTokenTomatoTomorrowToneTongueTonightToolToothTopTopicToppleTorchTornadoTortoiseTossTotalTouristTowardTowerTownToyTrackTradeTrafficTragicTrainTransferTrapTrashTravelTrayTreatTreeTrendTrialTribeTrickTriggerTrimTripTrophyTroubleTruckTrueTrulyTrumpetTrustTruthTryTubeTuitionTumbleTunaTunnelTurkeyTurnTurtleTwelveTwentyTwiceTwinTwistTwoTypeTypicalUglyUmbrellaUnableUnawareUncleUncoverUnderUndoUnfairUnfoldUnhappyUniformUniqueUnitUniverseUnknownUnlockUntilUnusualUnveilUpdateUpgradeUpholdUponUpperUpsetUrbanUrgeUsageUseUsedUsefulUselessUsualUtilityVacantVacuumVagueValidValleyValveVanVanishVaporVariousVastVaultVehicleVelvetVendorVentureVenueVerbVerifyVersionVeryVesselVeteranViableVibrantViciousVictoryVideoViewVillageVintageViolinVirtualVirusVisaVisitVisualVitalVividVocalVoiceVoidVolcanoVolumeVoteVoyageWageWagonWaitWalkWallWalnutWantWarfareWarmWarriorWashWaspWasteWaterWaveWayWealthWeaponWearWeaselWeatherWebWeddingWeekendWeirdWelcomeWestWetWhaleWhatWheatWheelWhenWhereWhipWhisperWideWidthWifeWildWillWinWindowWineWingWinkWinnerWinterWireWisdomWiseWishWitnessWolfWomanWonderWoodWoolWordWorkWorldWorryWorthWrapWreckWrestleWristWriteWrongYardYearYellowYouYoungYouthZebraZeroZoneZoo";
let Rv = null;
function nD(t) {
    if (
        Rv == null &&
        ((Rv = uCe
            .replace(/([A-Z])/g, " $1")
            .toLowerCase()
            .substring(1)
            .split(" ")),
        V1.check(t) !==
        "0x3c8acc1e7b08d8e76f9fda015ef48dc8c710a73cb7e0f77b2c18a9b5a7adde60")
    )
        throw ((Rv = null), new Error("BIP39 Wordlist for en (English) FAILED"));
}
class fCe extends V1 {
    constructor() {
        super("en");
    }
    getWord(e) {
        return nD(this), Rv[e];
    }
    getWordIndex(e) {
        return nD(this), Rv.indexOf(e);
    }
}
const wK = new fCe();

class Ie {
    constructor(e, r) {
        e !== s_ &&
        El.throwError(
            "cannot call constructor directly; use BigNumber.from",
            ee.errors.UNSUPPORTED_OPERATION,
            { operation: "new (BigNumber)" },
        ),
            (this._hex = r),
            (this._isBigNumber = !0),
            Object.freeze(this);
    }
    fromTwos(e) {
        return Eo(fr(this).fromTwos(e));
    }
    toTwos(e) {
        return Eo(fr(this).toTwos(e));
    }
    abs() {
        return this._hex[0] === "-" ? Ie.from(this._hex.substring(1)) : this;
    }
    add(e) {
        return Eo(fr(this).add(fr(e)));
    }
    sub(e) {
        return Eo(fr(this).sub(fr(e)));
    }
    div(e) {
        return (
            Ie.from(e).isZero() && Vs("division-by-zero", "div"),
                Eo(fr(this).div(fr(e)))
        );
    }
    mul(e) {
        return Eo(fr(this).mul(fr(e)));
    }
    mod(e) {
        const r = fr(e);
        return r.isNeg() && Vs("division-by-zero", "mod"), Eo(fr(this).umod(r));
    }
    pow(e) {
        const r = fr(e);
        return r.isNeg() && Vs("negative-power", "pow"), Eo(fr(this).pow(r));
    }
    and(e) {
        const r = fr(e);
        return (
            (this.isNegative() || r.isNeg()) && Vs("unbound-bitwise-result", "and"),
                Eo(fr(this).and(r))
        );
    }
    or(e) {
        const r = fr(e);
        return (
            (this.isNegative() || r.isNeg()) && Vs("unbound-bitwise-result", "or"),
                Eo(fr(this).or(r))
        );
    }
    xor(e) {
        const r = fr(e);
        return (
            (this.isNegative() || r.isNeg()) && Vs("unbound-bitwise-result", "xor"),
                Eo(fr(this).xor(r))
        );
    }
    mask(e) {
        return (
            (this.isNegative() || e < 0) && Vs("negative-width", "mask"),
                Eo(fr(this).maskn(e))
        );
    }
    shl(e) {
        return (
            (this.isNegative() || e < 0) && Vs("negative-width", "shl"),
                Eo(fr(this).shln(e))
        );
    }
    shr(e) {
        return (
            (this.isNegative() || e < 0) && Vs("negative-width", "shr"),
                Eo(fr(this).shrn(e))
        );
    }
    eq(e) {
        return fr(this).eq(fr(e));
    }
    lt(e) {
        return fr(this).lt(fr(e));
    }
    lte(e) {
        return fr(this).lte(fr(e));
    }
    gt(e) {
        return fr(this).gt(fr(e));
    }
    gte(e) {
        return fr(this).gte(fr(e));
    }
    isNegative() {
        return this._hex[0] === "-";
    }
    isZero() {
        return fr(this).isZero();
    }
    toNumber() {
        try {
            return fr(this).toNumber();
        } catch {
            Vs("overflow", "toNumber", this.toString());
        }
        return null;
    }
    toBigInt() {
        try {
            return BigInt(this.toString());
        } catch {}
        return El.throwError(
            "this platform does not support BigInt",
            ee.errors.UNSUPPORTED_OPERATION,
            { value: this.toString() },
        );
    }
    toString() {
        return (
            arguments.length > 0 &&
            (arguments[0] === 10
                ? OF ||
                ((OF = !0),
                    El.warn(
                        "BigNumber.toString does not accept any parameters; base-10 is assumed",
                    ))
                : arguments[0] === 16
                    ? El.throwError(
                        "BigNumber.toString does not accept any parameters; use bigNumber.toHexString()",
                        ee.errors.UNEXPECTED_ARGUMENT,
                        {},
                    )
                    : El.throwError(
                        "BigNumber.toString does not accept parameters",
                        ee.errors.UNEXPECTED_ARGUMENT,
                        {},
                    )),
                fr(this).toString(10)
        );
    }
    toHexString() {
        return this._hex;
    }
    toJSON(e) {
        return { type: "BigNumber", hex: this.toHexString() };
    }
    static from(e) {
        if (e instanceof Ie) return e;
        if (typeof e == "string")
            return e.match(/^-?0x[0-9a-f]+$/i)
                ? new Ie(s_, Sy(e))
                : e.match(/^-?[0-9]+$/)
                    ? new Ie(s_, Sy(new Ay(e)))
                    : El.throwArgumentError("invalid BigNumber string", "value", e);
        if (typeof e == "number")
            return (
                e % 1 && Vs("underflow", "BigNumber.from", e),
                (e >= IF || e <= -IF) && Vs("overflow", "BigNumber.from", e),
                    Ie.from(String(e))
            );
        const r = e;
        if (typeof r == "bigint") return Ie.from(r.toString());
        if (D0(r)) return Ie.from(ke(r));
        if (r)
            if (r.toHexString) {
                const n = r.toHexString();
                if (typeof n == "string") return Ie.from(n);
            } else {
                let n = r._hex;
                if (
                    (n == null && r.type === "BigNumber" && (n = r.hex),
                    typeof n == "string" &&
                    (zt(n) || (n[0] === "-" && zt(n.substring(1)))))
                )
                    return Ie.from(n);
            }
        return El.throwArgumentError("invalid BigNumber value", "value", e);
    }
    static isBigNumber(e) {
        return !!(e && e._isBigNumber);
    }
}

const iD = { en: wK },
    dCe = "hdnode/5.7.0",
    Iy = new ee(dCe),
    hCe = Ie.from(
        "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
    ),
    pCe = Hn("Bitcoin seed"),
    Th = 2147483648;
function y9(t) {
    if (t == null) return iD.en;
    if (typeof t == "string") {
        const e = iD[t];
        return (
            e == null && Iy.throwArgumentError("unknown locale", "wordlist", t), e
        );
    }
    return t;
}
const yh = {},
    am = "m/44'/60'/0'/0/0";


function Cv(t, e) {
    (t = Se(t)),
    t.length > e &&
    Tn.throwArgumentError("value out of range", "value", arguments[0]);
    const r = new Uint8Array(e);
    return r.set(t, e - t.length), pp(r);
}
function $1(t) {
    return (zt(t) && !(t.length % 2)) || D0(t);
}

function Xr(t, e) {
    for (
        typeof t != "string"
            ? (t = ke(t))
            : zt(t) || Tn.throwArgumentError("invalid hex string", "value", t),
        t.length > 2 * e + 2 &&
        Tn.throwArgumentError("value out of range", "value", arguments[1]);
        t.length < 2 * e + 2;

    )
        t = "0x0" + t.substring(2);
    return t;
}
function L0(t) {
    const e = {
        r: "0x",
        s: "0x",
        _vs: "0x",
        recoveryParam: 0,
        v: 0,
        yParityAndS: "0x",
        compact: "0x",
    };
    if ($1(t)) {
        let r = Se(t);
        r.length === 64
            ? ((e.v = 27 + (r[32] >> 7)),
                (r[32] &= 127),
                (e.r = ke(r.slice(0, 32))),
                (e.s = ke(r.slice(32, 64))))
            : r.length === 65
                ? ((e.r = ke(r.slice(0, 32))),
                    (e.s = ke(r.slice(32, 64))),
                    (e.v = r[64]))
                : Tn.throwArgumentError("invalid signature string", "signature", t),
        e.v < 27 &&
        (e.v === 0 || e.v === 1
            ? (e.v += 27)
            : Tn.throwArgumentError("signature invalid v byte", "signature", t)),
            (e.recoveryParam = 1 - (e.v % 2)),
        e.recoveryParam && (r[32] |= 128),
            (e._vs = ke(r.slice(32, 64)));
    } else {
        if (
            ((e.r = t.r),
                (e.s = t.s),
                (e.v = t.v),
                (e.recoveryParam = t.recoveryParam),
                (e._vs = t._vs),
            e._vs != null)
        ) {
            const i = Cv(Se(e._vs), 32);
            e._vs = ke(i);
            const o = i[0] >= 128 ? 1 : 0;
            e.recoveryParam == null
                ? (e.recoveryParam = o)
                : e.recoveryParam !== o &&
                Tn.throwArgumentError(
                    "signature recoveryParam mismatch _vs",
                    "signature",
                    t,
                ),
                (i[0] &= 127);
            const s = ke(i);
            e.s == null
                ? (e.s = s)
                : e.s !== s &&
                Tn.throwArgumentError("signature v mismatch _vs", "signature", t);
        }
        if (e.recoveryParam == null)
            e.v == null
                ? Tn.throwArgumentError(
                    "signature missing v and recoveryParam",
                    "signature",
                    t,
                )
                : e.v === 0 || e.v === 1
                    ? (e.recoveryParam = e.v)
                    : (e.recoveryParam = 1 - (e.v % 2));
        else if (e.v == null) e.v = 27 + e.recoveryParam;
        else {
            const i = e.v === 0 || e.v === 1 ? e.v : 1 - (e.v % 2);
            e.recoveryParam !== i &&
            Tn.throwArgumentError(
                "signature recoveryParam mismatch v",
                "signature",
                t,
            );
        }
        e.r == null || !zt(e.r)
            ? Tn.throwArgumentError("signature missing or invalid r", "signature", t)
            : (e.r = Xr(e.r, 32)),
            e.s == null || !zt(e.s)
                ? Tn.throwArgumentError(
                    "signature missing or invalid s",
                    "signature",
                    t,
                )
                : (e.s = Xr(e.s, 32));
        const r = Se(e.s);
        r[0] >= 128 &&
        Tn.throwArgumentError("signature s out of range", "signature", t),
        e.recoveryParam && (r[0] |= 128);
        const n = ke(r);
        e._vs &&
        (zt(e._vs) ||
        Tn.throwArgumentError("signature invalid _vs", "signature", t),
            (e._vs = Xr(e._vs, 32))),
            e._vs == null
                ? (e._vs = n)
                : e._vs !== n &&
                Tn.throwArgumentError(
                    "signature _vs mismatch v and s",
                    "signature",
                    t,
                );
    }
    return (
        (e.yParityAndS = e._vs), (e.compact = e.r + e.yParityAndS.substring(2)), e
    );
}





var J7 = { exports: {} };
J7.exports;
(function (t) {
    (function (e, r) {
        function n(N, A) {
            if (!N) throw new Error(A || "Assertion failed");
        }
        function i(N, A) {
            N.super_ = A;
            var _ = function () {};
            (_.prototype = A.prototype),
                (N.prototype = new _()),
                (N.prototype.constructor = N);
        }
        function o(N, A, _) {
            if (o.isBN(N)) return N;
            (this.negative = 0),
                (this.words = null),
                (this.length = 0),
                (this.red = null),
            N !== null &&
            ((A === "le" || A === "be") && ((_ = A), (A = 10)),
                this._init(N || 0, A || 10, _ || "be"));
        }
        typeof e == "object" ? (e.exports = o) : (r.BN = o),
            (o.BN = o),
            (o.wordSize = 26);
        var s;
        try {
            typeof window < "u" && typeof window.Buffer < "u"
                ? (s = window.Buffer)
                : (s = gU.Buffer);
        } catch {}
        (o.isBN = function (A) {
            return A instanceof o
                ? !0
                : A !== null &&
                typeof A == "object" &&
                A.constructor.wordSize === o.wordSize &&
                Array.isArray(A.words);
        }),
            (o.max = function (A, _) {
                return A.cmp(_) > 0 ? A : _;
            }),
            (o.min = function (A, _) {
                return A.cmp(_) < 0 ? A : _;
            }),
            (o.prototype._init = function (A, _, I) {
                if (typeof A == "number") return this._initNumber(A, _, I);
                if (typeof A == "object") return this._initArray(A, _, I);
                _ === "hex" && (_ = 16),
                    n(_ === (_ | 0) && _ >= 2 && _ <= 36),
                    (A = A.toString().replace(/\s+/g, ""));
                var F = 0;
                A[0] === "-" && (F++, (this.negative = 1)),
                F < A.length &&
                (_ === 16
                    ? this._parseHex(A, F, I)
                    : (this._parseBase(A, _, F),
                    I === "le" && this._initArray(this.toArray(), _, I)));
            }),
            (o.prototype._initNumber = function (A, _, I) {
                A < 0 && ((this.negative = 1), (A = -A)),
                    A < 67108864
                        ? ((this.words = [A & 67108863]), (this.length = 1))
                        : A < 4503599627370496
                            ? ((this.words = [A & 67108863, (A / 67108864) & 67108863]),
                                (this.length = 2))
                            : (n(A < 9007199254740992),
                                (this.words = [A & 67108863, (A / 67108864) & 67108863, 1]),
                                (this.length = 3)),
                I === "le" && this._initArray(this.toArray(), _, I);
            }),
            (o.prototype._initArray = function (A, _, I) {
                if ((n(typeof A.length == "number"), A.length <= 0))
                    return (this.words = [0]), (this.length = 1), this;
                (this.length = Math.ceil(A.length / 3)),
                    (this.words = new Array(this.length));
                for (var F = 0; F < this.length; F++) this.words[F] = 0;
                var L,
                    U,
                    V = 0;
                if (I === "be")
                    for (F = A.length - 1, L = 0; F >= 0; F -= 3)
                        (U = A[F] | (A[F - 1] << 8) | (A[F - 2] << 16)),
                            (this.words[L] |= (U << V) & 67108863),
                            (this.words[L + 1] = (U >>> (26 - V)) & 67108863),
                            (V += 24),
                        V >= 26 && ((V -= 26), L++);
                else if (I === "le")
                    for (F = 0, L = 0; F < A.length; F += 3)
                        (U = A[F] | (A[F + 1] << 8) | (A[F + 2] << 16)),
                            (this.words[L] |= (U << V) & 67108863),
                            (this.words[L + 1] = (U >>> (26 - V)) & 67108863),
                            (V += 24),
                        V >= 26 && ((V -= 26), L++);
                return this._strip();
            });
        function a(N, A) {
            var _ = N.charCodeAt(A);
            if (_ >= 48 && _ <= 57) return _ - 48;
            if (_ >= 65 && _ <= 70) return _ - 55;
            if (_ >= 97 && _ <= 102) return _ - 87;
            n(!1, "Invalid character in " + N);
        }
        function c(N, A, _) {
            var I = a(N, _);
            return _ - 1 >= A && (I |= a(N, _ - 1) << 4), I;
        }
        o.prototype._parseHex = function (A, _, I) {
            (this.length = Math.ceil((A.length - _) / 6)),
                (this.words = new Array(this.length));
            for (var F = 0; F < this.length; F++) this.words[F] = 0;
            var L = 0,
                U = 0,
                V;
            if (I === "be")
                for (F = A.length - 1; F >= _; F -= 2)
                    (V = c(A, _, F) << L),
                        (this.words[U] |= V & 67108863),
                        L >= 18
                            ? ((L -= 18), (U += 1), (this.words[U] |= V >>> 26))
                            : (L += 8);
            else {
                var R = A.length - _;
                for (F = R % 2 === 0 ? _ + 1 : _; F < A.length; F += 2)
                    (V = c(A, _, F) << L),
                        (this.words[U] |= V & 67108863),
                        L >= 18
                            ? ((L -= 18), (U += 1), (this.words[U] |= V >>> 26))
                            : (L += 8);
            }
            this._strip();
        };
        function l(N, A, _, I) {
            for (var F = 0, L = 0, U = Math.min(N.length, _), V = A; V < U; V++) {
                var R = N.charCodeAt(V) - 48;
                (F *= I),
                    R >= 49 ? (L = R - 49 + 10) : R >= 17 ? (L = R - 17 + 10) : (L = R),
                    n(R >= 0 && L < I, "Invalid character"),
                    (F += L);
            }
            return F;
        }
        (o.prototype._parseBase = function (A, _, I) {
            (this.words = [0]), (this.length = 1);
            for (var F = 0, L = 1; L <= 67108863; L *= _) F++;
            F--, (L = (L / _) | 0);
            for (
                var U = A.length - I,
                    V = U % F,
                    R = Math.min(U, U - V) + I,
                    C = 0,
                    j = I;
                j < R;
                j += F
            )
                (C = l(A, j, j + F, _)),
                    this.imuln(L),
                    this.words[0] + C < 67108864 ? (this.words[0] += C) : this._iaddn(C);
            if (V !== 0) {
                var q = 1;
                for (C = l(A, j, A.length, _), j = 0; j < V; j++) q *= _;
                this.imuln(q),
                    this.words[0] + C < 67108864 ? (this.words[0] += C) : this._iaddn(C);
            }
            this._strip();
        }),
            (o.prototype.copy = function (A) {
                A.words = new Array(this.length);
                for (var _ = 0; _ < this.length; _++) A.words[_] = this.words[_];
                (A.length = this.length),
                    (A.negative = this.negative),
                    (A.red = this.red);
            });
        function u(N, A) {
            (N.words = A.words),
                (N.length = A.length),
                (N.negative = A.negative),
                (N.red = A.red);
        }
        if (
            ((o.prototype._move = function (A) {
                u(A, this);
            }),
                (o.prototype.clone = function () {
                    var A = new o(null);
                    return this.copy(A), A;
                }),
                (o.prototype._expand = function (A) {
                    for (; this.length < A; ) this.words[this.length++] = 0;
                    return this;
                }),
                (o.prototype._strip = function () {
                    for (; this.length > 1 && this.words[this.length - 1] === 0; )
                        this.length--;
                    return this._normSign();
                }),
                (o.prototype._normSign = function () {
                    return (
                        this.length === 1 && this.words[0] === 0 && (this.negative = 0), this
                    );
                }),
            typeof Symbol < "u" && typeof Symbol.for == "function")
        )
            try {
                o.prototype[Symbol.for("nodejs.util.inspect.custom")] = f;
            } catch {
                o.prototype.inspect = f;
            }
        else o.prototype.inspect = f;
        function f() {
            return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
        }
        var h = [
                "",
                "0",
                "00",
                "000",
                "0000",
                "00000",
                "000000",
                "0000000",
                "00000000",
                "000000000",
                "0000000000",
                "00000000000",
                "000000000000",
                "0000000000000",
                "00000000000000",
                "000000000000000",
                "0000000000000000",
                "00000000000000000",
                "000000000000000000",
                "0000000000000000000",
                "00000000000000000000",
                "000000000000000000000",
                "0000000000000000000000",
                "00000000000000000000000",
                "000000000000000000000000",
                "0000000000000000000000000",
            ],
            m = [
                0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5,
                5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
            ],
            y = [
                0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607,
                16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536,
                11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101,
                5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368,
                20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875,
                60466176,
            ];
        (o.prototype.toString = function (A, _) {
            (A = A || 10), (_ = _ | 0 || 1);
            var I;
            if (A === 16 || A === "hex") {
                I = "";
                for (var F = 0, L = 0, U = 0; U < this.length; U++) {
                    var V = this.words[U],
                        R = (((V << F) | L) & 16777215).toString(16);
                    (L = (V >>> (24 - F)) & 16777215),
                        (F += 2),
                    F >= 26 && ((F -= 26), U--),
                        L !== 0 || U !== this.length - 1
                            ? (I = h[6 - R.length] + R + I)
                            : (I = R + I);
                }
                for (L !== 0 && (I = L.toString(16) + I); I.length % _ !== 0; )
                    I = "0" + I;
                return this.negative !== 0 && (I = "-" + I), I;
            }
            if (A === (A | 0) && A >= 2 && A <= 36) {
                var C = m[A],
                    j = y[A];
                I = "";
                var q = this.clone();
                for (q.negative = 0; !q.isZero(); ) {
                    var M = q.modrn(j).toString(A);
                    (q = q.idivn(j)),
                        q.isZero() ? (I = M + I) : (I = h[C - M.length] + M + I);
                }
                for (this.isZero() && (I = "0" + I); I.length % _ !== 0; ) I = "0" + I;
                return this.negative !== 0 && (I = "-" + I), I;
            }
            n(!1, "Base should be between 2 and 36");
        }),
            (o.prototype.toNumber = function () {
                var A = this.words[0];
                return (
                    this.length === 2
                        ? (A += this.words[1] * 67108864)
                        : this.length === 3 && this.words[2] === 1
                            ? (A += 4503599627370496 + this.words[1] * 67108864)
                            : this.length > 2 &&
                            n(!1, "Number can only safely store up to 53 bits"),
                        this.negative !== 0 ? -A : A
                );
            }),
            (o.prototype.toJSON = function () {
                return this.toString(16, 2);
            }),
        s &&
        (o.prototype.toBuffer = function (A, _) {
            return this.toArrayLike(s, A, _);
        }),
            (o.prototype.toArray = function (A, _) {
                return this.toArrayLike(Array, A, _);
            });
        var g = function (A, _) {
            return A.allocUnsafe ? A.allocUnsafe(_) : new A(_);
        };
        (o.prototype.toArrayLike = function (A, _, I) {
            this._strip();
            var F = this.byteLength(),
                L = I || Math.max(1, F);
            n(F <= L, "byte array longer than desired length"),
                n(L > 0, "Requested array length <= 0");
            var U = g(A, L),
                V = _ === "le" ? "LE" : "BE";
            return this["_toArrayLike" + V](U, F), U;
        }),
            (o.prototype._toArrayLikeLE = function (A, _) {
                for (var I = 0, F = 0, L = 0, U = 0; L < this.length; L++) {
                    var V = (this.words[L] << U) | F;
                    (A[I++] = V & 255),
                    I < A.length && (A[I++] = (V >> 8) & 255),
                    I < A.length && (A[I++] = (V >> 16) & 255),
                        U === 6
                            ? (I < A.length && (A[I++] = (V >> 24) & 255), (F = 0), (U = 0))
                            : ((F = V >>> 24), (U += 2));
                }
                if (I < A.length) for (A[I++] = F; I < A.length; ) A[I++] = 0;
            }),
            (o.prototype._toArrayLikeBE = function (A, _) {
                for (var I = A.length - 1, F = 0, L = 0, U = 0; L < this.length; L++) {
                    var V = (this.words[L] << U) | F;
                    (A[I--] = V & 255),
                    I >= 0 && (A[I--] = (V >> 8) & 255),
                    I >= 0 && (A[I--] = (V >> 16) & 255),
                        U === 6
                            ? (I >= 0 && (A[I--] = (V >> 24) & 255), (F = 0), (U = 0))
                            : ((F = V >>> 24), (U += 2));
                }
                if (I >= 0) for (A[I--] = F; I >= 0; ) A[I--] = 0;
            }),
            Math.clz32
                ? (o.prototype._countBits = function (A) {
                    return 32 - Math.clz32(A);
                })
                : (o.prototype._countBits = function (A) {
                    var _ = A,
                        I = 0;
                    return (
                        _ >= 4096 && ((I += 13), (_ >>>= 13)),
                        _ >= 64 && ((I += 7), (_ >>>= 7)),
                        _ >= 8 && ((I += 4), (_ >>>= 4)),
                        _ >= 2 && ((I += 2), (_ >>>= 2)),
                        I + _
                    );
                }),
            (o.prototype._zeroBits = function (A) {
                if (A === 0) return 26;
                var _ = A,
                    I = 0;
                return (
                    _ & 8191 || ((I += 13), (_ >>>= 13)),
                    _ & 127 || ((I += 7), (_ >>>= 7)),
                    _ & 15 || ((I += 4), (_ >>>= 4)),
                    _ & 3 || ((I += 2), (_ >>>= 2)),
                    _ & 1 || I++,
                        I
                );
            }),
            (o.prototype.bitLength = function () {
                var A = this.words[this.length - 1],
                    _ = this._countBits(A);
                return (this.length - 1) * 26 + _;
            });
        function v(N) {
            for (var A = new Array(N.bitLength()), _ = 0; _ < A.length; _++) {
                var I = (_ / 26) | 0,
                    F = _ % 26;
                A[_] = (N.words[I] >>> F) & 1;
            }
            return A;
        }
        (o.prototype.zeroBits = function () {
            if (this.isZero()) return 0;
            for (var A = 0, _ = 0; _ < this.length; _++) {
                var I = this._zeroBits(this.words[_]);
                if (((A += I), I !== 26)) break;
            }
            return A;
        }),
            (o.prototype.byteLength = function () {
                return Math.ceil(this.bitLength() / 8);
            }),
            (o.prototype.toTwos = function (A) {
                return this.negative !== 0
                    ? this.abs().inotn(A).iaddn(1)
                    : this.clone();
            }),
            (o.prototype.fromTwos = function (A) {
                return this.testn(A - 1) ? this.notn(A).iaddn(1).ineg() : this.clone();
            }),
            (o.prototype.isNeg = function () {
                return this.negative !== 0;
            }),
            (o.prototype.neg = function () {
                return this.clone().ineg();
            }),
            (o.prototype.ineg = function () {
                return this.isZero() || (this.negative ^= 1), this;
            }),
            (o.prototype.iuor = function (A) {
                for (; this.length < A.length; ) this.words[this.length++] = 0;
                for (var _ = 0; _ < A.length; _++)
                    this.words[_] = this.words[_] | A.words[_];
                return this._strip();
            }),
            (o.prototype.ior = function (A) {
                return n((this.negative | A.negative) === 0), this.iuor(A);
            }),
            (o.prototype.or = function (A) {
                return this.length > A.length
                    ? this.clone().ior(A)
                    : A.clone().ior(this);
            }),
            (o.prototype.uor = function (A) {
                return this.length > A.length
                    ? this.clone().iuor(A)
                    : A.clone().iuor(this);
            }),
            (o.prototype.iuand = function (A) {
                var _;
                this.length > A.length ? (_ = A) : (_ = this);
                for (var I = 0; I < _.length; I++)
                    this.words[I] = this.words[I] & A.words[I];
                return (this.length = _.length), this._strip();
            }),
            (o.prototype.iand = function (A) {
                return n((this.negative | A.negative) === 0), this.iuand(A);
            }),
            (o.prototype.and = function (A) {
                return this.length > A.length
                    ? this.clone().iand(A)
                    : A.clone().iand(this);
            }),
            (o.prototype.uand = function (A) {
                return this.length > A.length
                    ? this.clone().iuand(A)
                    : A.clone().iuand(this);
            }),
            (o.prototype.iuxor = function (A) {
                var _, I;
                this.length > A.length ? ((_ = this), (I = A)) : ((_ = A), (I = this));
                for (var F = 0; F < I.length; F++)
                    this.words[F] = _.words[F] ^ I.words[F];
                if (this !== _) for (; F < _.length; F++) this.words[F] = _.words[F];
                return (this.length = _.length), this._strip();
            }),
            (o.prototype.ixor = function (A) {
                return n((this.negative | A.negative) === 0), this.iuxor(A);
            }),
            (o.prototype.xor = function (A) {
                return this.length > A.length
                    ? this.clone().ixor(A)
                    : A.clone().ixor(this);
            }),
            (o.prototype.uxor = function (A) {
                return this.length > A.length
                    ? this.clone().iuxor(A)
                    : A.clone().iuxor(this);
            }),
            (o.prototype.inotn = function (A) {
                n(typeof A == "number" && A >= 0);
                var _ = Math.ceil(A / 26) | 0,
                    I = A % 26;
                this._expand(_), I > 0 && _--;
                for (var F = 0; F < _; F++) this.words[F] = ~this.words[F] & 67108863;
                return (
                    I > 0 && (this.words[F] = ~this.words[F] & (67108863 >> (26 - I))),
                        this._strip()
                );
            }),
            (o.prototype.notn = function (A) {
                return this.clone().inotn(A);
            }),
            (o.prototype.setn = function (A, _) {
                n(typeof A == "number" && A >= 0);
                var I = (A / 26) | 0,
                    F = A % 26;
                return (
                    this._expand(I + 1),
                        _
                            ? (this.words[I] = this.words[I] | (1 << F))
                            : (this.words[I] = this.words[I] & ~(1 << F)),
                        this._strip()
                );
            }),
            (o.prototype.iadd = function (A) {
                var _;
                if (this.negative !== 0 && A.negative === 0)
                    return (
                        (this.negative = 0),
                            (_ = this.isub(A)),
                            (this.negative ^= 1),
                            this._normSign()
                    );
                if (this.negative === 0 && A.negative !== 0)
                    return (
                        (A.negative = 0),
                            (_ = this.isub(A)),
                            (A.negative = 1),
                            _._normSign()
                    );
                var I, F;
                this.length > A.length ? ((I = this), (F = A)) : ((I = A), (F = this));
                for (var L = 0, U = 0; U < F.length; U++)
                    (_ = (I.words[U] | 0) + (F.words[U] | 0) + L),
                        (this.words[U] = _ & 67108863),
                        (L = _ >>> 26);
                for (; L !== 0 && U < I.length; U++)
                    (_ = (I.words[U] | 0) + L),
                        (this.words[U] = _ & 67108863),
                        (L = _ >>> 26);
                if (((this.length = I.length), L !== 0))
                    (this.words[this.length] = L), this.length++;
                else if (I !== this)
                    for (; U < I.length; U++) this.words[U] = I.words[U];
                return this;
            }),
            (o.prototype.add = function (A) {
                var _;
                return A.negative !== 0 && this.negative === 0
                    ? ((A.negative = 0), (_ = this.sub(A)), (A.negative ^= 1), _)
                    : A.negative === 0 && this.negative !== 0
                        ? ((this.negative = 0), (_ = A.sub(this)), (this.negative = 1), _)
                        : this.length > A.length
                            ? this.clone().iadd(A)
                            : A.clone().iadd(this);
            }),
            (o.prototype.isub = function (A) {
                if (A.negative !== 0) {
                    A.negative = 0;
                    var _ = this.iadd(A);
                    return (A.negative = 1), _._normSign();
                } else if (this.negative !== 0)
                    return (
                        (this.negative = 0),
                            this.iadd(A),
                            (this.negative = 1),
                            this._normSign()
                    );
                var I = this.cmp(A);
                if (I === 0)
                    return (
                        (this.negative = 0), (this.length = 1), (this.words[0] = 0), this
                    );
                var F, L;
                I > 0 ? ((F = this), (L = A)) : ((F = A), (L = this));
                for (var U = 0, V = 0; V < L.length; V++)
                    (_ = (F.words[V] | 0) - (L.words[V] | 0) + U),
                        (U = _ >> 26),
                        (this.words[V] = _ & 67108863);
                for (; U !== 0 && V < F.length; V++)
                    (_ = (F.words[V] | 0) + U),
                        (U = _ >> 26),
                        (this.words[V] = _ & 67108863);
                if (U === 0 && V < F.length && F !== this)
                    for (; V < F.length; V++) this.words[V] = F.words[V];
                return (
                    (this.length = Math.max(this.length, V)),
                    F !== this && (this.negative = 1),
                        this._strip()
                );
            }),
            (o.prototype.sub = function (A) {
                return this.clone().isub(A);
            });
        function x(N, A, _) {
            _.negative = A.negative ^ N.negative;
            var I = (N.length + A.length) | 0;
            (_.length = I), (I = (I - 1) | 0);
            var F = N.words[0] | 0,
                L = A.words[0] | 0,
                U = F * L,
                V = U & 67108863,
                R = (U / 67108864) | 0;
            _.words[0] = V;
            for (var C = 1; C < I; C++) {
                for (
                    var j = R >>> 26,
                        q = R & 67108863,
                        M = Math.min(C, A.length - 1),
                        Q = Math.max(0, C - N.length + 1);
                    Q <= M;
                    Q++
                ) {
                    var Y = (C - Q) | 0;
                    (F = N.words[Y] | 0),
                        (L = A.words[Q] | 0),
                        (U = F * L + q),
                        (j += (U / 67108864) | 0),
                        (q = U & 67108863);
                }
                (_.words[C] = q | 0), (R = j | 0);
            }
            return R !== 0 ? (_.words[C] = R | 0) : _.length--, _._strip();
        }
        var b = function (A, _, I) {
            var F = A.words,
                L = _.words,
                U = I.words,
                V = 0,
                R,
                C,
                j,
                q = F[0] | 0,
                M = q & 8191,
                Q = q >>> 13,
                Y = F[1] | 0,
                Z = Y & 8191,
                te = Y >>> 13,
                le = F[2] | 0,
                se = le & 8191,
                de = le >>> 13,
                _e = F[3] | 0,
                ae = _e & 8191,
                Ae = _e >>> 13,
                lt = F[4] | 0,
                Me = lt & 8191,
                Ve = lt >>> 13,
                Re = F[5] | 0,
                xe = Re & 8191,
                ve = Re >>> 13,
                He = F[6] | 0,
                Oe = He & 8191,
                Ze = He >>> 13,
                ut = F[7] | 0,
                Je = ut & 8191,
                wt = ut >>> 13,
                Ht = F[8] | 0,
                $e = Ht & 8191,
                tt = Ht >>> 13,
                Ut = F[9] | 0,
                Mt = Ut & 8191,
                Jt = Ut >>> 13,
                Un = L[0] | 0,
                Lt = Un & 8191,
                st = Un >>> 13,
                Hr = L[1] | 0,
                Yt = Hr & 8191,
                Rt = Hr >>> 13,
                Or = L[2] | 0,
                Nt = Or & 8191,
                Qt = Or >>> 13,
                er = L[3] | 0,
                ot = er & 8191,
                Ke = er >>> 13,
                It = L[4] | 0,
                rt = It & 8191,
                yt = It >>> 13,
                Fr = L[5] | 0,
                Vt = Fr & 8191,
                Wt = Fr >>> 13,
                $t = L[6] | 0,
                Et = $t & 8191,
                tr = $t >>> 13,
                Vn = L[7] | 0,
                gr = Vn & 8191,
                br = Vn >>> 13,
                Ur = L[8] | 0,
                cr = Ur & 8191,
                lr = Ur >>> 13,
                Oi = L[9] | 0,
                wr = Oi & 8191,
                Cr = Oi >>> 13;
            (I.negative = A.negative ^ _.negative),
                (I.length = 19),
                (R = Math.imul(M, Lt)),
                (C = Math.imul(M, st)),
                (C = (C + Math.imul(Q, Lt)) | 0),
                (j = Math.imul(Q, st));
            var ai = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (ai >>> 26)) | 0),
                (ai &= 67108863),
                (R = Math.imul(Z, Lt)),
                (C = Math.imul(Z, st)),
                (C = (C + Math.imul(te, Lt)) | 0),
                (j = Math.imul(te, st)),
                (R = (R + Math.imul(M, Yt)) | 0),
                (C = (C + Math.imul(M, Rt)) | 0),
                (C = (C + Math.imul(Q, Yt)) | 0),
                (j = (j + Math.imul(Q, Rt)) | 0);
            var ci = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (ci >>> 26)) | 0),
                (ci &= 67108863),
                (R = Math.imul(se, Lt)),
                (C = Math.imul(se, st)),
                (C = (C + Math.imul(de, Lt)) | 0),
                (j = Math.imul(de, st)),
                (R = (R + Math.imul(Z, Yt)) | 0),
                (C = (C + Math.imul(Z, Rt)) | 0),
                (C = (C + Math.imul(te, Yt)) | 0),
                (j = (j + Math.imul(te, Rt)) | 0),
                (R = (R + Math.imul(M, Nt)) | 0),
                (C = (C + Math.imul(M, Qt)) | 0),
                (C = (C + Math.imul(Q, Nt)) | 0),
                (j = (j + Math.imul(Q, Qt)) | 0);
            var go = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (go >>> 26)) | 0),
                (go &= 67108863),
                (R = Math.imul(ae, Lt)),
                (C = Math.imul(ae, st)),
                (C = (C + Math.imul(Ae, Lt)) | 0),
                (j = Math.imul(Ae, st)),
                (R = (R + Math.imul(se, Yt)) | 0),
                (C = (C + Math.imul(se, Rt)) | 0),
                (C = (C + Math.imul(de, Yt)) | 0),
                (j = (j + Math.imul(de, Rt)) | 0),
                (R = (R + Math.imul(Z, Nt)) | 0),
                (C = (C + Math.imul(Z, Qt)) | 0),
                (C = (C + Math.imul(te, Nt)) | 0),
                (j = (j + Math.imul(te, Qt)) | 0),
                (R = (R + Math.imul(M, ot)) | 0),
                (C = (C + Math.imul(M, Ke)) | 0),
                (C = (C + Math.imul(Q, ot)) | 0),
                (j = (j + Math.imul(Q, Ke)) | 0);
            var Vr = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (Vr >>> 26)) | 0),
                (Vr &= 67108863),
                (R = Math.imul(Me, Lt)),
                (C = Math.imul(Me, st)),
                (C = (C + Math.imul(Ve, Lt)) | 0),
                (j = Math.imul(Ve, st)),
                (R = (R + Math.imul(ae, Yt)) | 0),
                (C = (C + Math.imul(ae, Rt)) | 0),
                (C = (C + Math.imul(Ae, Yt)) | 0),
                (j = (j + Math.imul(Ae, Rt)) | 0),
                (R = (R + Math.imul(se, Nt)) | 0),
                (C = (C + Math.imul(se, Qt)) | 0),
                (C = (C + Math.imul(de, Nt)) | 0),
                (j = (j + Math.imul(de, Qt)) | 0),
                (R = (R + Math.imul(Z, ot)) | 0),
                (C = (C + Math.imul(Z, Ke)) | 0),
                (C = (C + Math.imul(te, ot)) | 0),
                (j = (j + Math.imul(te, Ke)) | 0),
                (R = (R + Math.imul(M, rt)) | 0),
                (C = (C + Math.imul(M, yt)) | 0),
                (C = (C + Math.imul(Q, rt)) | 0),
                (j = (j + Math.imul(Q, yt)) | 0);
            var Xi = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (Xi >>> 26)) | 0),
                (Xi &= 67108863),
                (R = Math.imul(xe, Lt)),
                (C = Math.imul(xe, st)),
                (C = (C + Math.imul(ve, Lt)) | 0),
                (j = Math.imul(ve, st)),
                (R = (R + Math.imul(Me, Yt)) | 0),
                (C = (C + Math.imul(Me, Rt)) | 0),
                (C = (C + Math.imul(Ve, Yt)) | 0),
                (j = (j + Math.imul(Ve, Rt)) | 0),
                (R = (R + Math.imul(ae, Nt)) | 0),
                (C = (C + Math.imul(ae, Qt)) | 0),
                (C = (C + Math.imul(Ae, Nt)) | 0),
                (j = (j + Math.imul(Ae, Qt)) | 0),
                (R = (R + Math.imul(se, ot)) | 0),
                (C = (C + Math.imul(se, Ke)) | 0),
                (C = (C + Math.imul(de, ot)) | 0),
                (j = (j + Math.imul(de, Ke)) | 0),
                (R = (R + Math.imul(Z, rt)) | 0),
                (C = (C + Math.imul(Z, yt)) | 0),
                (C = (C + Math.imul(te, rt)) | 0),
                (j = (j + Math.imul(te, yt)) | 0),
                (R = (R + Math.imul(M, Vt)) | 0),
                (C = (C + Math.imul(M, Wt)) | 0),
                (C = (C + Math.imul(Q, Vt)) | 0),
                (j = (j + Math.imul(Q, Wt)) | 0);
            var Ts = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (Ts >>> 26)) | 0),
                (Ts &= 67108863),
                (R = Math.imul(Oe, Lt)),
                (C = Math.imul(Oe, st)),
                (C = (C + Math.imul(Ze, Lt)) | 0),
                (j = Math.imul(Ze, st)),
                (R = (R + Math.imul(xe, Yt)) | 0),
                (C = (C + Math.imul(xe, Rt)) | 0),
                (C = (C + Math.imul(ve, Yt)) | 0),
                (j = (j + Math.imul(ve, Rt)) | 0),
                (R = (R + Math.imul(Me, Nt)) | 0),
                (C = (C + Math.imul(Me, Qt)) | 0),
                (C = (C + Math.imul(Ve, Nt)) | 0),
                (j = (j + Math.imul(Ve, Qt)) | 0),
                (R = (R + Math.imul(ae, ot)) | 0),
                (C = (C + Math.imul(ae, Ke)) | 0),
                (C = (C + Math.imul(Ae, ot)) | 0),
                (j = (j + Math.imul(Ae, Ke)) | 0),
                (R = (R + Math.imul(se, rt)) | 0),
                (C = (C + Math.imul(se, yt)) | 0),
                (C = (C + Math.imul(de, rt)) | 0),
                (j = (j + Math.imul(de, yt)) | 0),
                (R = (R + Math.imul(Z, Vt)) | 0),
                (C = (C + Math.imul(Z, Wt)) | 0),
                (C = (C + Math.imul(te, Vt)) | 0),
                (j = (j + Math.imul(te, Wt)) | 0),
                (R = (R + Math.imul(M, Et)) | 0),
                (C = (C + Math.imul(M, tr)) | 0),
                (C = (C + Math.imul(Q, Et)) | 0),
                (j = (j + Math.imul(Q, tr)) | 0);
            var Ya = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (Ya >>> 26)) | 0),
                (Ya &= 67108863),
                (R = Math.imul(Je, Lt)),
                (C = Math.imul(Je, st)),
                (C = (C + Math.imul(wt, Lt)) | 0),
                (j = Math.imul(wt, st)),
                (R = (R + Math.imul(Oe, Yt)) | 0),
                (C = (C + Math.imul(Oe, Rt)) | 0),
                (C = (C + Math.imul(Ze, Yt)) | 0),
                (j = (j + Math.imul(Ze, Rt)) | 0),
                (R = (R + Math.imul(xe, Nt)) | 0),
                (C = (C + Math.imul(xe, Qt)) | 0),
                (C = (C + Math.imul(ve, Nt)) | 0),
                (j = (j + Math.imul(ve, Qt)) | 0),
                (R = (R + Math.imul(Me, ot)) | 0),
                (C = (C + Math.imul(Me, Ke)) | 0),
                (C = (C + Math.imul(Ve, ot)) | 0),
                (j = (j + Math.imul(Ve, Ke)) | 0),
                (R = (R + Math.imul(ae, rt)) | 0),
                (C = (C + Math.imul(ae, yt)) | 0),
                (C = (C + Math.imul(Ae, rt)) | 0),
                (j = (j + Math.imul(Ae, yt)) | 0),
                (R = (R + Math.imul(se, Vt)) | 0),
                (C = (C + Math.imul(se, Wt)) | 0),
                (C = (C + Math.imul(de, Vt)) | 0),
                (j = (j + Math.imul(de, Wt)) | 0),
                (R = (R + Math.imul(Z, Et)) | 0),
                (C = (C + Math.imul(Z, tr)) | 0),
                (C = (C + Math.imul(te, Et)) | 0),
                (j = (j + Math.imul(te, tr)) | 0),
                (R = (R + Math.imul(M, gr)) | 0),
                (C = (C + Math.imul(M, br)) | 0),
                (C = (C + Math.imul(Q, gr)) | 0),
                (j = (j + Math.imul(Q, br)) | 0);
            var Wo = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (Wo >>> 26)) | 0),
                (Wo &= 67108863),
                (R = Math.imul($e, Lt)),
                (C = Math.imul($e, st)),
                (C = (C + Math.imul(tt, Lt)) | 0),
                (j = Math.imul(tt, st)),
                (R = (R + Math.imul(Je, Yt)) | 0),
                (C = (C + Math.imul(Je, Rt)) | 0),
                (C = (C + Math.imul(wt, Yt)) | 0),
                (j = (j + Math.imul(wt, Rt)) | 0),
                (R = (R + Math.imul(Oe, Nt)) | 0),
                (C = (C + Math.imul(Oe, Qt)) | 0),
                (C = (C + Math.imul(Ze, Nt)) | 0),
                (j = (j + Math.imul(Ze, Qt)) | 0),
                (R = (R + Math.imul(xe, ot)) | 0),
                (C = (C + Math.imul(xe, Ke)) | 0),
                (C = (C + Math.imul(ve, ot)) | 0),
                (j = (j + Math.imul(ve, Ke)) | 0),
                (R = (R + Math.imul(Me, rt)) | 0),
                (C = (C + Math.imul(Me, yt)) | 0),
                (C = (C + Math.imul(Ve, rt)) | 0),
                (j = (j + Math.imul(Ve, yt)) | 0),
                (R = (R + Math.imul(ae, Vt)) | 0),
                (C = (C + Math.imul(ae, Wt)) | 0),
                (C = (C + Math.imul(Ae, Vt)) | 0),
                (j = (j + Math.imul(Ae, Wt)) | 0),
                (R = (R + Math.imul(se, Et)) | 0),
                (C = (C + Math.imul(se, tr)) | 0),
                (C = (C + Math.imul(de, Et)) | 0),
                (j = (j + Math.imul(de, tr)) | 0),
                (R = (R + Math.imul(Z, gr)) | 0),
                (C = (C + Math.imul(Z, br)) | 0),
                (C = (C + Math.imul(te, gr)) | 0),
                (j = (j + Math.imul(te, br)) | 0),
                (R = (R + Math.imul(M, cr)) | 0),
                (C = (C + Math.imul(M, lr)) | 0),
                (C = (C + Math.imul(Q, cr)) | 0),
                (j = (j + Math.imul(Q, lr)) | 0);
            var Go = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (Go >>> 26)) | 0),
                (Go &= 67108863),
                (R = Math.imul(Mt, Lt)),
                (C = Math.imul(Mt, st)),
                (C = (C + Math.imul(Jt, Lt)) | 0),
                (j = Math.imul(Jt, st)),
                (R = (R + Math.imul($e, Yt)) | 0),
                (C = (C + Math.imul($e, Rt)) | 0),
                (C = (C + Math.imul(tt, Yt)) | 0),
                (j = (j + Math.imul(tt, Rt)) | 0),
                (R = (R + Math.imul(Je, Nt)) | 0),
                (C = (C + Math.imul(Je, Qt)) | 0),
                (C = (C + Math.imul(wt, Nt)) | 0),
                (j = (j + Math.imul(wt, Qt)) | 0),
                (R = (R + Math.imul(Oe, ot)) | 0),
                (C = (C + Math.imul(Oe, Ke)) | 0),
                (C = (C + Math.imul(Ze, ot)) | 0),
                (j = (j + Math.imul(Ze, Ke)) | 0),
                (R = (R + Math.imul(xe, rt)) | 0),
                (C = (C + Math.imul(xe, yt)) | 0),
                (C = (C + Math.imul(ve, rt)) | 0),
                (j = (j + Math.imul(ve, yt)) | 0),
                (R = (R + Math.imul(Me, Vt)) | 0),
                (C = (C + Math.imul(Me, Wt)) | 0),
                (C = (C + Math.imul(Ve, Vt)) | 0),
                (j = (j + Math.imul(Ve, Wt)) | 0),
                (R = (R + Math.imul(ae, Et)) | 0),
                (C = (C + Math.imul(ae, tr)) | 0),
                (C = (C + Math.imul(Ae, Et)) | 0),
                (j = (j + Math.imul(Ae, tr)) | 0),
                (R = (R + Math.imul(se, gr)) | 0),
                (C = (C + Math.imul(se, br)) | 0),
                (C = (C + Math.imul(de, gr)) | 0),
                (j = (j + Math.imul(de, br)) | 0),
                (R = (R + Math.imul(Z, cr)) | 0),
                (C = (C + Math.imul(Z, lr)) | 0),
                (C = (C + Math.imul(te, cr)) | 0),
                (j = (j + Math.imul(te, lr)) | 0),
                (R = (R + Math.imul(M, wr)) | 0),
                (C = (C + Math.imul(M, Cr)) | 0),
                (C = (C + Math.imul(Q, wr)) | 0),
                (j = (j + Math.imul(Q, Cr)) | 0);
            var ec = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (ec >>> 26)) | 0),
                (ec &= 67108863),
                (R = Math.imul(Mt, Yt)),
                (C = Math.imul(Mt, Rt)),
                (C = (C + Math.imul(Jt, Yt)) | 0),
                (j = Math.imul(Jt, Rt)),
                (R = (R + Math.imul($e, Nt)) | 0),
                (C = (C + Math.imul($e, Qt)) | 0),
                (C = (C + Math.imul(tt, Nt)) | 0),
                (j = (j + Math.imul(tt, Qt)) | 0),
                (R = (R + Math.imul(Je, ot)) | 0),
                (C = (C + Math.imul(Je, Ke)) | 0),
                (C = (C + Math.imul(wt, ot)) | 0),
                (j = (j + Math.imul(wt, Ke)) | 0),
                (R = (R + Math.imul(Oe, rt)) | 0),
                (C = (C + Math.imul(Oe, yt)) | 0),
                (C = (C + Math.imul(Ze, rt)) | 0),
                (j = (j + Math.imul(Ze, yt)) | 0),
                (R = (R + Math.imul(xe, Vt)) | 0),
                (C = (C + Math.imul(xe, Wt)) | 0),
                (C = (C + Math.imul(ve, Vt)) | 0),
                (j = (j + Math.imul(ve, Wt)) | 0),
                (R = (R + Math.imul(Me, Et)) | 0),
                (C = (C + Math.imul(Me, tr)) | 0),
                (C = (C + Math.imul(Ve, Et)) | 0),
                (j = (j + Math.imul(Ve, tr)) | 0),
                (R = (R + Math.imul(ae, gr)) | 0),
                (C = (C + Math.imul(ae, br)) | 0),
                (C = (C + Math.imul(Ae, gr)) | 0),
                (j = (j + Math.imul(Ae, br)) | 0),
                (R = (R + Math.imul(se, cr)) | 0),
                (C = (C + Math.imul(se, lr)) | 0),
                (C = (C + Math.imul(de, cr)) | 0),
                (j = (j + Math.imul(de, lr)) | 0),
                (R = (R + Math.imul(Z, wr)) | 0),
                (C = (C + Math.imul(Z, Cr)) | 0),
                (C = (C + Math.imul(te, wr)) | 0),
                (j = (j + Math.imul(te, Cr)) | 0);
            var Yc = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (Yc >>> 26)) | 0),
                (Yc &= 67108863),
                (R = Math.imul(Mt, Nt)),
                (C = Math.imul(Mt, Qt)),
                (C = (C + Math.imul(Jt, Nt)) | 0),
                (j = Math.imul(Jt, Qt)),
                (R = (R + Math.imul($e, ot)) | 0),
                (C = (C + Math.imul($e, Ke)) | 0),
                (C = (C + Math.imul(tt, ot)) | 0),
                (j = (j + Math.imul(tt, Ke)) | 0),
                (R = (R + Math.imul(Je, rt)) | 0),
                (C = (C + Math.imul(Je, yt)) | 0),
                (C = (C + Math.imul(wt, rt)) | 0),
                (j = (j + Math.imul(wt, yt)) | 0),
                (R = (R + Math.imul(Oe, Vt)) | 0),
                (C = (C + Math.imul(Oe, Wt)) | 0),
                (C = (C + Math.imul(Ze, Vt)) | 0),
                (j = (j + Math.imul(Ze, Wt)) | 0),
                (R = (R + Math.imul(xe, Et)) | 0),
                (C = (C + Math.imul(xe, tr)) | 0),
                (C = (C + Math.imul(ve, Et)) | 0),
                (j = (j + Math.imul(ve, tr)) | 0),
                (R = (R + Math.imul(Me, gr)) | 0),
                (C = (C + Math.imul(Me, br)) | 0),
                (C = (C + Math.imul(Ve, gr)) | 0),
                (j = (j + Math.imul(Ve, br)) | 0),
                (R = (R + Math.imul(ae, cr)) | 0),
                (C = (C + Math.imul(ae, lr)) | 0),
                (C = (C + Math.imul(Ae, cr)) | 0),
                (j = (j + Math.imul(Ae, lr)) | 0),
                (R = (R + Math.imul(se, wr)) | 0),
                (C = (C + Math.imul(se, Cr)) | 0),
                (C = (C + Math.imul(de, wr)) | 0),
                (j = (j + Math.imul(de, Cr)) | 0);
            var vo = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (vo >>> 26)) | 0),
                (vo &= 67108863),
                (R = Math.imul(Mt, ot)),
                (C = Math.imul(Mt, Ke)),
                (C = (C + Math.imul(Jt, ot)) | 0),
                (j = Math.imul(Jt, Ke)),
                (R = (R + Math.imul($e, rt)) | 0),
                (C = (C + Math.imul($e, yt)) | 0),
                (C = (C + Math.imul(tt, rt)) | 0),
                (j = (j + Math.imul(tt, yt)) | 0),
                (R = (R + Math.imul(Je, Vt)) | 0),
                (C = (C + Math.imul(Je, Wt)) | 0),
                (C = (C + Math.imul(wt, Vt)) | 0),
                (j = (j + Math.imul(wt, Wt)) | 0),
                (R = (R + Math.imul(Oe, Et)) | 0),
                (C = (C + Math.imul(Oe, tr)) | 0),
                (C = (C + Math.imul(Ze, Et)) | 0),
                (j = (j + Math.imul(Ze, tr)) | 0),
                (R = (R + Math.imul(xe, gr)) | 0),
                (C = (C + Math.imul(xe, br)) | 0),
                (C = (C + Math.imul(ve, gr)) | 0),
                (j = (j + Math.imul(ve, br)) | 0),
                (R = (R + Math.imul(Me, cr)) | 0),
                (C = (C + Math.imul(Me, lr)) | 0),
                (C = (C + Math.imul(Ve, cr)) | 0),
                (j = (j + Math.imul(Ve, lr)) | 0),
                (R = (R + Math.imul(ae, wr)) | 0),
                (C = (C + Math.imul(ae, Cr)) | 0),
                (C = (C + Math.imul(Ae, wr)) | 0),
                (j = (j + Math.imul(Ae, Cr)) | 0);
            var va = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (va >>> 26)) | 0),
                (va &= 67108863),
                (R = Math.imul(Mt, rt)),
                (C = Math.imul(Mt, yt)),
                (C = (C + Math.imul(Jt, rt)) | 0),
                (j = Math.imul(Jt, yt)),
                (R = (R + Math.imul($e, Vt)) | 0),
                (C = (C + Math.imul($e, Wt)) | 0),
                (C = (C + Math.imul(tt, Vt)) | 0),
                (j = (j + Math.imul(tt, Wt)) | 0),
                (R = (R + Math.imul(Je, Et)) | 0),
                (C = (C + Math.imul(Je, tr)) | 0),
                (C = (C + Math.imul(wt, Et)) | 0),
                (j = (j + Math.imul(wt, tr)) | 0),
                (R = (R + Math.imul(Oe, gr)) | 0),
                (C = (C + Math.imul(Oe, br)) | 0),
                (C = (C + Math.imul(Ze, gr)) | 0),
                (j = (j + Math.imul(Ze, br)) | 0),
                (R = (R + Math.imul(xe, cr)) | 0),
                (C = (C + Math.imul(xe, lr)) | 0),
                (C = (C + Math.imul(ve, cr)) | 0),
                (j = (j + Math.imul(ve, lr)) | 0),
                (R = (R + Math.imul(Me, wr)) | 0),
                (C = (C + Math.imul(Me, Cr)) | 0),
                (C = (C + Math.imul(Ve, wr)) | 0),
                (j = (j + Math.imul(Ve, Cr)) | 0);
            var qo = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (qo >>> 26)) | 0),
                (qo &= 67108863),
                (R = Math.imul(Mt, Vt)),
                (C = Math.imul(Mt, Wt)),
                (C = (C + Math.imul(Jt, Vt)) | 0),
                (j = Math.imul(Jt, Wt)),
                (R = (R + Math.imul($e, Et)) | 0),
                (C = (C + Math.imul($e, tr)) | 0),
                (C = (C + Math.imul(tt, Et)) | 0),
                (j = (j + Math.imul(tt, tr)) | 0),
                (R = (R + Math.imul(Je, gr)) | 0),
                (C = (C + Math.imul(Je, br)) | 0),
                (C = (C + Math.imul(wt, gr)) | 0),
                (j = (j + Math.imul(wt, br)) | 0),
                (R = (R + Math.imul(Oe, cr)) | 0),
                (C = (C + Math.imul(Oe, lr)) | 0),
                (C = (C + Math.imul(Ze, cr)) | 0),
                (j = (j + Math.imul(Ze, lr)) | 0),
                (R = (R + Math.imul(xe, wr)) | 0),
                (C = (C + Math.imul(xe, Cr)) | 0),
                (C = (C + Math.imul(ve, wr)) | 0),
                (j = (j + Math.imul(ve, Cr)) | 0);
            var Zi = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (Zi >>> 26)) | 0),
                (Zi &= 67108863),
                (R = Math.imul(Mt, Et)),
                (C = Math.imul(Mt, tr)),
                (C = (C + Math.imul(Jt, Et)) | 0),
                (j = Math.imul(Jt, tr)),
                (R = (R + Math.imul($e, gr)) | 0),
                (C = (C + Math.imul($e, br)) | 0),
                (C = (C + Math.imul(tt, gr)) | 0),
                (j = (j + Math.imul(tt, br)) | 0),
                (R = (R + Math.imul(Je, cr)) | 0),
                (C = (C + Math.imul(Je, lr)) | 0),
                (C = (C + Math.imul(wt, cr)) | 0),
                (j = (j + Math.imul(wt, lr)) | 0),
                (R = (R + Math.imul(Oe, wr)) | 0),
                (C = (C + Math.imul(Oe, Cr)) | 0),
                (C = (C + Math.imul(Ze, wr)) | 0),
                (j = (j + Math.imul(Ze, Cr)) | 0);
            var Ko = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (Ko >>> 26)) | 0),
                (Ko &= 67108863),
                (R = Math.imul(Mt, gr)),
                (C = Math.imul(Mt, br)),
                (C = (C + Math.imul(Jt, gr)) | 0),
                (j = Math.imul(Jt, br)),
                (R = (R + Math.imul($e, cr)) | 0),
                (C = (C + Math.imul($e, lr)) | 0),
                (C = (C + Math.imul(tt, cr)) | 0),
                (j = (j + Math.imul(tt, lr)) | 0),
                (R = (R + Math.imul(Je, wr)) | 0),
                (C = (C + Math.imul(Je, Cr)) | 0),
                (C = (C + Math.imul(wt, wr)) | 0),
                (j = (j + Math.imul(wt, Cr)) | 0);
            var Rs = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (Rs >>> 26)) | 0),
                (Rs &= 67108863),
                (R = Math.imul(Mt, cr)),
                (C = Math.imul(Mt, lr)),
                (C = (C + Math.imul(Jt, cr)) | 0),
                (j = Math.imul(Jt, lr)),
                (R = (R + Math.imul($e, wr)) | 0),
                (C = (C + Math.imul($e, Cr)) | 0),
                (C = (C + Math.imul(tt, wr)) | 0),
                (j = (j + Math.imul(tt, Cr)) | 0);
            var Is = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            (V = (((j + (C >>> 13)) | 0) + (Is >>> 26)) | 0),
                (Is &= 67108863),
                (R = Math.imul(Mt, wr)),
                (C = Math.imul(Mt, Cr)),
                (C = (C + Math.imul(Jt, wr)) | 0),
                (j = Math.imul(Jt, Cr));
            var ki = (((V + R) | 0) + ((C & 8191) << 13)) | 0;
            return (
                (V = (((j + (C >>> 13)) | 0) + (ki >>> 26)) | 0),
                    (ki &= 67108863),
                    (U[0] = ai),
                    (U[1] = ci),
                    (U[2] = go),
                    (U[3] = Vr),
                    (U[4] = Xi),
                    (U[5] = Ts),
                    (U[6] = Ya),
                    (U[7] = Wo),
                    (U[8] = Go),
                    (U[9] = ec),
                    (U[10] = Yc),
                    (U[11] = vo),
                    (U[12] = va),
                    (U[13] = qo),
                    (U[14] = Zi),
                    (U[15] = Ko),
                    (U[16] = Rs),
                    (U[17] = Is),
                    (U[18] = ki),
                V !== 0 && ((U[19] = V), I.length++),
                    I
            );
        };
        Math.imul || (b = x);
        function w(N, A, _) {
            (_.negative = A.negative ^ N.negative), (_.length = N.length + A.length);
            for (var I = 0, F = 0, L = 0; L < _.length - 1; L++) {
                var U = F;
                F = 0;
                for (
                    var V = I & 67108863,
                        R = Math.min(L, A.length - 1),
                        C = Math.max(0, L - N.length + 1);
                    C <= R;
                    C++
                ) {
                    var j = L - C,
                        q = N.words[j] | 0,
                        M = A.words[C] | 0,
                        Q = q * M,
                        Y = Q & 67108863;
                    (U = (U + ((Q / 67108864) | 0)) | 0),
                        (Y = (Y + V) | 0),
                        (V = Y & 67108863),
                        (U = (U + (Y >>> 26)) | 0),
                        (F += U >>> 26),
                        (U &= 67108863);
                }
                (_.words[L] = V), (I = U), (U = F);
            }
            return I !== 0 ? (_.words[L] = I) : _.length--, _._strip();
        }
        function S(N, A, _) {
            return w(N, A, _);
        }
        (o.prototype.mulTo = function (A, _) {
            var I,
                F = this.length + A.length;
            return (
                this.length === 10 && A.length === 10
                    ? (I = b(this, A, _))
                    : F < 63
                        ? (I = x(this, A, _))
                        : F < 1024
                            ? (I = w(this, A, _))
                            : (I = S(this, A, _)),
                    I
            );
        }),
            (o.prototype.mul = function (A) {
                var _ = new o(null);
                return (_.words = new Array(this.length + A.length)), this.mulTo(A, _);
            }),
            (o.prototype.mulf = function (A) {
                var _ = new o(null);
                return (_.words = new Array(this.length + A.length)), S(this, A, _);
            }),
            (o.prototype.imul = function (A) {
                return this.clone().mulTo(A, this);
            }),
            (o.prototype.imuln = function (A) {
                var _ = A < 0;
                _ && (A = -A), n(typeof A == "number"), n(A < 67108864);
                for (var I = 0, F = 0; F < this.length; F++) {
                    var L = (this.words[F] | 0) * A,
                        U = (L & 67108863) + (I & 67108863);
                    (I >>= 26),
                        (I += (L / 67108864) | 0),
                        (I += U >>> 26),
                        (this.words[F] = U & 67108863);
                }
                return (
                    I !== 0 && ((this.words[F] = I), this.length++),
                        _ ? this.ineg() : this
                );
            }),
            (o.prototype.muln = function (A) {
                return this.clone().imuln(A);
            }),
            (o.prototype.sqr = function () {
                return this.mul(this);
            }),
            (o.prototype.isqr = function () {
                return this.imul(this.clone());
            }),
            (o.prototype.pow = function (A) {
                var _ = v(A);
                if (_.length === 0) return new o(1);
                for (var I = this, F = 0; F < _.length && _[F] === 0; F++, I = I.sqr());
                if (++F < _.length)
                    for (var L = I.sqr(); F < _.length; F++, L = L.sqr())
                        _[F] !== 0 && (I = I.mul(L));
                return I;
            }),
            (o.prototype.iushln = function (A) {
                n(typeof A == "number" && A >= 0);
                var _ = A % 26,
                    I = (A - _) / 26,
                    F = (67108863 >>> (26 - _)) << (26 - _),
                    L;
                if (_ !== 0) {
                    var U = 0;
                    for (L = 0; L < this.length; L++) {
                        var V = this.words[L] & F,
                            R = ((this.words[L] | 0) - V) << _;
                        (this.words[L] = R | U), (U = V >>> (26 - _));
                    }
                    U && ((this.words[L] = U), this.length++);
                }
                if (I !== 0) {
                    for (L = this.length - 1; L >= 0; L--)
                        this.words[L + I] = this.words[L];
                    for (L = 0; L < I; L++) this.words[L] = 0;
                    this.length += I;
                }
                return this._strip();
            }),
            (o.prototype.ishln = function (A) {
                return n(this.negative === 0), this.iushln(A);
            }),
            (o.prototype.iushrn = function (A, _, I) {
                n(typeof A == "number" && A >= 0);
                var F;
                _ ? (F = (_ - (_ % 26)) / 26) : (F = 0);
                var L = A % 26,
                    U = Math.min((A - L) / 26, this.length),
                    V = 67108863 ^ ((67108863 >>> L) << L),
                    R = I;
                if (((F -= U), (F = Math.max(0, F)), R)) {
                    for (var C = 0; C < U; C++) R.words[C] = this.words[C];
                    R.length = U;
                }
                if (U !== 0)
                    if (this.length > U)
                        for (this.length -= U, C = 0; C < this.length; C++)
                            this.words[C] = this.words[C + U];
                    else (this.words[0] = 0), (this.length = 1);
                var j = 0;
                for (C = this.length - 1; C >= 0 && (j !== 0 || C >= F); C--) {
                    var q = this.words[C] | 0;
                    (this.words[C] = (j << (26 - L)) | (q >>> L)), (j = q & V);
                }
                return (
                    R && j !== 0 && (R.words[R.length++] = j),
                    this.length === 0 && ((this.words[0] = 0), (this.length = 1)),
                        this._strip()
                );
            }),
            (o.prototype.ishrn = function (A, _, I) {
                return n(this.negative === 0), this.iushrn(A, _, I);
            }),
            (o.prototype.shln = function (A) {
                return this.clone().ishln(A);
            }),
            (o.prototype.ushln = function (A) {
                return this.clone().iushln(A);
            }),
            (o.prototype.shrn = function (A) {
                return this.clone().ishrn(A);
            }),
            (o.prototype.ushrn = function (A) {
                return this.clone().iushrn(A);
            }),
            (o.prototype.testn = function (A) {
                n(typeof A == "number" && A >= 0);
                var _ = A % 26,
                    I = (A - _) / 26,
                    F = 1 << _;
                if (this.length <= I) return !1;
                var L = this.words[I];
                return !!(L & F);
            }),
            (o.prototype.imaskn = function (A) {
                n(typeof A == "number" && A >= 0);
                var _ = A % 26,
                    I = (A - _) / 26;
                if (
                    (n(this.negative === 0, "imaskn works only with positive numbers"),
                    this.length <= I)
                )
                    return this;
                if (
                    (_ !== 0 && I++, (this.length = Math.min(I, this.length)), _ !== 0)
                ) {
                    var F = 67108863 ^ ((67108863 >>> _) << _);
                    this.words[this.length - 1] &= F;
                }
                return this._strip();
            }),
            (o.prototype.maskn = function (A) {
                return this.clone().imaskn(A);
            }),
            (o.prototype.iaddn = function (A) {
                return (
                    n(typeof A == "number"),
                        n(A < 67108864),
                        A < 0
                            ? this.isubn(-A)
                            : this.negative !== 0
                                ? this.length === 1 && (this.words[0] | 0) <= A
                                    ? ((this.words[0] = A - (this.words[0] | 0)),
                                        (this.negative = 0),
                                        this)
                                    : ((this.negative = 0),
                                        this.isubn(A),
                                        (this.negative = 1),
                                        this)
                                : this._iaddn(A)
                );
            }),
            (o.prototype._iaddn = function (A) {
                this.words[0] += A;
                for (var _ = 0; _ < this.length && this.words[_] >= 67108864; _++)
                    (this.words[_] -= 67108864),
                        _ === this.length - 1
                            ? (this.words[_ + 1] = 1)
                            : this.words[_ + 1]++;
                return (this.length = Math.max(this.length, _ + 1)), this;
            }),
            (o.prototype.isubn = function (A) {
                if ((n(typeof A == "number"), n(A < 67108864), A < 0))
                    return this.iaddn(-A);
                if (this.negative !== 0)
                    return (this.negative = 0), this.iaddn(A), (this.negative = 1), this;
                if (((this.words[0] -= A), this.length === 1 && this.words[0] < 0))
                    (this.words[0] = -this.words[0]), (this.negative = 1);
                else
                    for (var _ = 0; _ < this.length && this.words[_] < 0; _++)
                        (this.words[_] += 67108864), (this.words[_ + 1] -= 1);
                return this._strip();
            }),
            (o.prototype.addn = function (A) {
                return this.clone().iaddn(A);
            }),
            (o.prototype.subn = function (A) {
                return this.clone().isubn(A);
            }),
            (o.prototype.iabs = function () {
                return (this.negative = 0), this;
            }),
            (o.prototype.abs = function () {
                return this.clone().iabs();
            }),
            (o.prototype._ishlnsubmul = function (A, _, I) {
                var F = A.length + I,
                    L;
                this._expand(F);
                var U,
                    V = 0;
                for (L = 0; L < A.length; L++) {
                    U = (this.words[L + I] | 0) + V;
                    var R = (A.words[L] | 0) * _;
                    (U -= R & 67108863),
                        (V = (U >> 26) - ((R / 67108864) | 0)),
                        (this.words[L + I] = U & 67108863);
                }
                for (; L < this.length - I; L++)
                    (U = (this.words[L + I] | 0) + V),
                        (V = U >> 26),
                        (this.words[L + I] = U & 67108863);
                if (V === 0) return this._strip();
                for (n(V === -1), V = 0, L = 0; L < this.length; L++)
                    (U = -(this.words[L] | 0) + V),
                        (V = U >> 26),
                        (this.words[L] = U & 67108863);
                return (this.negative = 1), this._strip();
            }),
            (o.prototype._wordDiv = function (A, _) {
                var I = this.length - A.length,
                    F = this.clone(),
                    L = A,
                    U = L.words[L.length - 1] | 0,
                    V = this._countBits(U);
                (I = 26 - V),
                I !== 0 &&
                ((L = L.ushln(I)), F.iushln(I), (U = L.words[L.length - 1] | 0));
                var R = F.length - L.length,
                    C;
                if (_ !== "mod") {
                    (C = new o(null)),
                        (C.length = R + 1),
                        (C.words = new Array(C.length));
                    for (var j = 0; j < C.length; j++) C.words[j] = 0;
                }
                var q = F.clone()._ishlnsubmul(L, 1, R);
                q.negative === 0 && ((F = q), C && (C.words[R] = 1));
                for (var M = R - 1; M >= 0; M--) {
                    var Q =
                        (F.words[L.length + M] | 0) * 67108864 +
                        (F.words[L.length + M - 1] | 0);
                    for (
                        Q = Math.min((Q / U) | 0, 67108863), F._ishlnsubmul(L, Q, M);
                        F.negative !== 0;

                    )
                        Q--,
                            (F.negative = 0),
                            F._ishlnsubmul(L, 1, M),
                        F.isZero() || (F.negative ^= 1);
                    C && (C.words[M] = Q);
                }
                return (
                    C && C._strip(),
                        F._strip(),
                    _ !== "div" && I !== 0 && F.iushrn(I),
                        { div: C || null, mod: F }
                );
            }),
            (o.prototype.divmod = function (A, _, I) {
                if ((n(!A.isZero()), this.isZero()))
                    return { div: new o(0), mod: new o(0) };
                var F, L, U;
                return this.negative !== 0 && A.negative === 0
                    ? ((U = this.neg().divmod(A, _)),
                    _ !== "mod" && (F = U.div.neg()),
                    _ !== "div" &&
                    ((L = U.mod.neg()), I && L.negative !== 0 && L.iadd(A)),
                        { div: F, mod: L })
                    : this.negative === 0 && A.negative !== 0
                        ? ((U = this.divmod(A.neg(), _)),
                        _ !== "mod" && (F = U.div.neg()),
                            { div: F, mod: U.mod })
                        : this.negative & A.negative
                            ? ((U = this.neg().divmod(A.neg(), _)),
                            _ !== "div" &&
                            ((L = U.mod.neg()), I && L.negative !== 0 && L.isub(A)),
                                { div: U.div, mod: L })
                            : A.length > this.length || this.cmp(A) < 0
                                ? { div: new o(0), mod: this }
                                : A.length === 1
                                    ? _ === "div"
                                        ? { div: this.divn(A.words[0]), mod: null }
                                        : _ === "mod"
                                            ? { div: null, mod: new o(this.modrn(A.words[0])) }
                                            : {
                                                div: this.divn(A.words[0]),
                                                mod: new o(this.modrn(A.words[0])),
                                            }
                                    : this._wordDiv(A, _);
            }),
            (o.prototype.div = function (A) {
                return this.divmod(A, "div", !1).div;
            }),
            (o.prototype.mod = function (A) {
                return this.divmod(A, "mod", !1).mod;
            }),
            (o.prototype.umod = function (A) {
                return this.divmod(A, "mod", !0).mod;
            }),
            (o.prototype.divRound = function (A) {
                var _ = this.divmod(A);
                if (_.mod.isZero()) return _.div;
                var I = _.div.negative !== 0 ? _.mod.isub(A) : _.mod,
                    F = A.ushrn(1),
                    L = A.andln(1),
                    U = I.cmp(F);
                return U < 0 || (L === 1 && U === 0)
                    ? _.div
                    : _.div.negative !== 0
                        ? _.div.isubn(1)
                        : _.div.iaddn(1);
            }),
            (o.prototype.modrn = function (A) {
                var _ = A < 0;
                _ && (A = -A), n(A <= 67108863);
                for (var I = (1 << 26) % A, F = 0, L = this.length - 1; L >= 0; L--)
                    F = (I * F + (this.words[L] | 0)) % A;
                return _ ? -F : F;
            }),
            (o.prototype.modn = function (A) {
                return this.modrn(A);
            }),
            (o.prototype.idivn = function (A) {
                var _ = A < 0;
                _ && (A = -A), n(A <= 67108863);
                for (var I = 0, F = this.length - 1; F >= 0; F--) {
                    var L = (this.words[F] | 0) + I * 67108864;
                    (this.words[F] = (L / A) | 0), (I = L % A);
                }
                return this._strip(), _ ? this.ineg() : this;
            }),
            (o.prototype.divn = function (A) {
                return this.clone().idivn(A);
            }),
            (o.prototype.egcd = function (A) {
                n(A.negative === 0), n(!A.isZero());
                var _ = this,
                    I = A.clone();
                _.negative !== 0 ? (_ = _.umod(A)) : (_ = _.clone());
                for (
                    var F = new o(1), L = new o(0), U = new o(0), V = new o(1), R = 0;
                    _.isEven() && I.isEven();

                )
                    _.iushrn(1), I.iushrn(1), ++R;
                for (var C = I.clone(), j = _.clone(); !_.isZero(); ) {
                    for (var q = 0, M = 1; !(_.words[0] & M) && q < 26; ++q, M <<= 1);
                    if (q > 0)
                        for (_.iushrn(q); q-- > 0; )
                            (F.isOdd() || L.isOdd()) && (F.iadd(C), L.isub(j)),
                                F.iushrn(1),
                                L.iushrn(1);
                    for (var Q = 0, Y = 1; !(I.words[0] & Y) && Q < 26; ++Q, Y <<= 1);
                    if (Q > 0)
                        for (I.iushrn(Q); Q-- > 0; )
                            (U.isOdd() || V.isOdd()) && (U.iadd(C), V.isub(j)),
                                U.iushrn(1),
                                V.iushrn(1);
                    _.cmp(I) >= 0
                        ? (_.isub(I), F.isub(U), L.isub(V))
                        : (I.isub(_), U.isub(F), V.isub(L));
                }
                return { a: U, b: V, gcd: I.iushln(R) };
            }),
            (o.prototype._invmp = function (A) {
                n(A.negative === 0), n(!A.isZero());
                var _ = this,
                    I = A.clone();
                _.negative !== 0 ? (_ = _.umod(A)) : (_ = _.clone());
                for (
                    var F = new o(1), L = new o(0), U = I.clone();
                    _.cmpn(1) > 0 && I.cmpn(1) > 0;

                ) {
                    for (var V = 0, R = 1; !(_.words[0] & R) && V < 26; ++V, R <<= 1);
                    if (V > 0)
                        for (_.iushrn(V); V-- > 0; ) F.isOdd() && F.iadd(U), F.iushrn(1);
                    for (var C = 0, j = 1; !(I.words[0] & j) && C < 26; ++C, j <<= 1);
                    if (C > 0)
                        for (I.iushrn(C); C-- > 0; ) L.isOdd() && L.iadd(U), L.iushrn(1);
                    _.cmp(I) >= 0 ? (_.isub(I), F.isub(L)) : (I.isub(_), L.isub(F));
                }
                var q;
                return (
                    _.cmpn(1) === 0 ? (q = F) : (q = L), q.cmpn(0) < 0 && q.iadd(A), q
                );
            }),
            (o.prototype.gcd = function (A) {
                if (this.isZero()) return A.abs();
                if (A.isZero()) return this.abs();
                var _ = this.clone(),
                    I = A.clone();
                (_.negative = 0), (I.negative = 0);
                for (var F = 0; _.isEven() && I.isEven(); F++) _.iushrn(1), I.iushrn(1);
                do {
                    for (; _.isEven(); ) _.iushrn(1);
                    for (; I.isEven(); ) I.iushrn(1);
                    var L = _.cmp(I);
                    if (L < 0) {
                        var U = _;
                        (_ = I), (I = U);
                    } else if (L === 0 || I.cmpn(1) === 0) break;
                    _.isub(I);
                } while (!0);
                return I.iushln(F);
            }),
            (o.prototype.invm = function (A) {
                return this.egcd(A).a.umod(A);
            }),
            (o.prototype.isEven = function () {
                return (this.words[0] & 1) === 0;
            }),
            (o.prototype.isOdd = function () {
                return (this.words[0] & 1) === 1;
            }),
            (o.prototype.andln = function (A) {
                return this.words[0] & A;
            }),
            (o.prototype.bincn = function (A) {
                n(typeof A == "number");
                var _ = A % 26,
                    I = (A - _) / 26,
                    F = 1 << _;
                if (this.length <= I)
                    return this._expand(I + 1), (this.words[I] |= F), this;
                for (var L = F, U = I; L !== 0 && U < this.length; U++) {
                    var V = this.words[U] | 0;
                    (V += L), (L = V >>> 26), (V &= 67108863), (this.words[U] = V);
                }
                return L !== 0 && ((this.words[U] = L), this.length++), this;
            }),
            (o.prototype.isZero = function () {
                return this.length === 1 && this.words[0] === 0;
            }),
            (o.prototype.cmpn = function (A) {
                var _ = A < 0;
                if (this.negative !== 0 && !_) return -1;
                if (this.negative === 0 && _) return 1;
                this._strip();
                var I;
                if (this.length > 1) I = 1;
                else {
                    _ && (A = -A), n(A <= 67108863, "Number is too big");
                    var F = this.words[0] | 0;
                    I = F === A ? 0 : F < A ? -1 : 1;
                }
                return this.negative !== 0 ? -I | 0 : I;
            }),
            (o.prototype.cmp = function (A) {
                if (this.negative !== 0 && A.negative === 0) return -1;
                if (this.negative === 0 && A.negative !== 0) return 1;
                var _ = this.ucmp(A);
                return this.negative !== 0 ? -_ | 0 : _;
            }),
            (o.prototype.ucmp = function (A) {
                if (this.length > A.length) return 1;
                if (this.length < A.length) return -1;
                for (var _ = 0, I = this.length - 1; I >= 0; I--) {
                    var F = this.words[I] | 0,
                        L = A.words[I] | 0;
                    if (F !== L) {
                        F < L ? (_ = -1) : F > L && (_ = 1);
                        break;
                    }
                }
                return _;
            }),
            (o.prototype.gtn = function (A) {
                return this.cmpn(A) === 1;
            }),
            (o.prototype.gt = function (A) {
                return this.cmp(A) === 1;
            }),
            (o.prototype.gten = function (A) {
                return this.cmpn(A) >= 0;
            }),
            (o.prototype.gte = function (A) {
                return this.cmp(A) >= 0;
            }),
            (o.prototype.ltn = function (A) {
                return this.cmpn(A) === -1;
            }),
            (o.prototype.lt = function (A) {
                return this.cmp(A) === -1;
            }),
            (o.prototype.lten = function (A) {
                return this.cmpn(A) <= 0;
            }),
            (o.prototype.lte = function (A) {
                return this.cmp(A) <= 0;
            }),
            (o.prototype.eqn = function (A) {
                return this.cmpn(A) === 0;
            }),
            (o.prototype.eq = function (A) {
                return this.cmp(A) === 0;
            }),
            (o.red = function (A) {
                return new H(A);
            }),
            (o.prototype.toRed = function (A) {
                return (
                    n(!this.red, "Already a number in reduction context"),
                        n(this.negative === 0, "red works only with positives"),
                        A.convertTo(this)._forceRed(A)
                );
            }),
            (o.prototype.fromRed = function () {
                return (
                    n(this.red, "fromRed works only with numbers in reduction context"),
                        this.red.convertFrom(this)
                );
            }),
            (o.prototype._forceRed = function (A) {
                return (this.red = A), this;
            }),
            (o.prototype.forceRed = function (A) {
                return (
                    n(!this.red, "Already a number in reduction context"),
                        this._forceRed(A)
                );
            }),
            (o.prototype.redAdd = function (A) {
                return (
                    n(this.red, "redAdd works only with red numbers"),
                        this.red.add(this, A)
                );
            }),
            (o.prototype.redIAdd = function (A) {
                return (
                    n(this.red, "redIAdd works only with red numbers"),
                        this.red.iadd(this, A)
                );
            }),
            (o.prototype.redSub = function (A) {
                return (
                    n(this.red, "redSub works only with red numbers"),
                        this.red.sub(this, A)
                );
            }),
            (o.prototype.redISub = function (A) {
                return (
                    n(this.red, "redISub works only with red numbers"),
                        this.red.isub(this, A)
                );
            }),
            (o.prototype.redShl = function (A) {
                return (
                    n(this.red, "redShl works only with red numbers"),
                        this.red.shl(this, A)
                );
            }),
            (o.prototype.redMul = function (A) {
                return (
                    n(this.red, "redMul works only with red numbers"),
                        this.red._verify2(this, A),
                        this.red.mul(this, A)
                );
            }),
            (o.prototype.redIMul = function (A) {
                return (
                    n(this.red, "redMul works only with red numbers"),
                        this.red._verify2(this, A),
                        this.red.imul(this, A)
                );
            }),
            (o.prototype.redSqr = function () {
                return (
                    n(this.red, "redSqr works only with red numbers"),
                        this.red._verify1(this),
                        this.red.sqr(this)
                );
            }),
            (o.prototype.redISqr = function () {
                return (
                    n(this.red, "redISqr works only with red numbers"),
                        this.red._verify1(this),
                        this.red.isqr(this)
                );
            }),
            (o.prototype.redSqrt = function () {
                return (
                    n(this.red, "redSqrt works only with red numbers"),
                        this.red._verify1(this),
                        this.red.sqrt(this)
                );
            }),
            (o.prototype.redInvm = function () {
                return (
                    n(this.red, "redInvm works only with red numbers"),
                        this.red._verify1(this),
                        this.red.invm(this)
                );
            }),
            (o.prototype.redNeg = function () {
                return (
                    n(this.red, "redNeg works only with red numbers"),
                        this.red._verify1(this),
                        this.red.neg(this)
                );
            }),
            (o.prototype.redPow = function (A) {
                return (
                    n(this.red && !A.red, "redPow(normalNum)"),
                        this.red._verify1(this),
                        this.red.pow(this, A)
                );
            });
        var P = { k256: null, p224: null, p192: null, p25519: null };
        function O(N, A) {
            (this.name = N),
                (this.p = new o(A, 16)),
                (this.n = this.p.bitLength()),
                (this.k = new o(1).iushln(this.n).isub(this.p)),
                (this.tmp = this._tmp());
        }
        (O.prototype._tmp = function () {
            var A = new o(null);
            return (A.words = new Array(Math.ceil(this.n / 13))), A;
        }),
            (O.prototype.ireduce = function (A) {
                var _ = A,
                    I;
                do
                    this.split(_, this.tmp),
                        (_ = this.imulK(_)),
                        (_ = _.iadd(this.tmp)),
                        (I = _.bitLength());
                while (I > this.n);
                var F = I < this.n ? -1 : _.ucmp(this.p);
                return (
                    F === 0
                        ? ((_.words[0] = 0), (_.length = 1))
                        : F > 0
                            ? _.isub(this.p)
                            : _.strip !== void 0
                                ? _.strip()
                                : _._strip(),
                        _
                );
            }),
            (O.prototype.split = function (A, _) {
                A.iushrn(this.n, 0, _);
            }),
            (O.prototype.imulK = function (A) {
                return A.imul(this.k);
            });
        function B() {
            O.call(
                this,
                "k256",
                "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
            );
        }
        i(B, O),
            (B.prototype.split = function (A, _) {
                for (var I = 4194303, F = Math.min(A.length, 9), L = 0; L < F; L++)
                    _.words[L] = A.words[L];
                if (((_.length = F), A.length <= 9)) {
                    (A.words[0] = 0), (A.length = 1);
                    return;
                }
                var U = A.words[9];
                for (_.words[_.length++] = U & I, L = 10; L < A.length; L++) {
                    var V = A.words[L] | 0;
                    (A.words[L - 10] = ((V & I) << 4) | (U >>> 22)), (U = V);
                }
                (U >>>= 22),
                    (A.words[L - 10] = U),
                    U === 0 && A.length > 10 ? (A.length -= 10) : (A.length -= 9);
            }),
            (B.prototype.imulK = function (A) {
                (A.words[A.length] = 0), (A.words[A.length + 1] = 0), (A.length += 2);
                for (var _ = 0, I = 0; I < A.length; I++) {
                    var F = A.words[I] | 0;
                    (_ += F * 977),
                        (A.words[I] = _ & 67108863),
                        (_ = F * 64 + ((_ / 67108864) | 0));
                }
                return (
                    A.words[A.length - 1] === 0 &&
                    (A.length--, A.words[A.length - 1] === 0 && A.length--),
                        A
                );
            });
        function k() {
            O.call(
                this,
                "p224",
                "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
            );
        }
        i(k, O);
        function z() {
            O.call(
                this,
                "p192",
                "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
            );
        }
        i(z, O);
        function D() {
            O.call(
                this,
                "25519",
                "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
            );
        }
        i(D, O),
            (D.prototype.imulK = function (A) {
                for (var _ = 0, I = 0; I < A.length; I++) {
                    var F = (A.words[I] | 0) * 19 + _,
                        L = F & 67108863;
                    (F >>>= 26), (A.words[I] = L), (_ = F);
                }
                return _ !== 0 && (A.words[A.length++] = _), A;
            }),
            (o._prime = function (A) {
                if (P[A]) return P[A];
                var _;
                if (A === "k256") _ = new B();
                else if (A === "p224") _ = new k();
                else if (A === "p192") _ = new z();
                else if (A === "p25519") _ = new D();
                else throw new Error("Unknown prime " + A);
                return (P[A] = _), _;
            });
        function H(N) {
            if (typeof N == "string") {
                var A = o._prime(N);
                (this.m = A.p), (this.prime = A);
            } else
                n(N.gtn(1), "modulus must be greater than 1"),
                    (this.m = N),
                    (this.prime = null);
        }
        (H.prototype._verify1 = function (A) {
            n(A.negative === 0, "red works only with positives"),
                n(A.red, "red works only with red numbers");
        }),
            (H.prototype._verify2 = function (A, _) {
                n((A.negative | _.negative) === 0, "red works only with positives"),
                    n(A.red && A.red === _.red, "red works only with red numbers");
            }),
            (H.prototype.imod = function (A) {
                return this.prime
                    ? this.prime.ireduce(A)._forceRed(this)
                    : (u(A, A.umod(this.m)._forceRed(this)), A);
            }),
            (H.prototype.neg = function (A) {
                return A.isZero() ? A.clone() : this.m.sub(A)._forceRed(this);
            }),
            (H.prototype.add = function (A, _) {
                this._verify2(A, _);
                var I = A.add(_);
                return I.cmp(this.m) >= 0 && I.isub(this.m), I._forceRed(this);
            }),
            (H.prototype.iadd = function (A, _) {
                this._verify2(A, _);
                var I = A.iadd(_);
                return I.cmp(this.m) >= 0 && I.isub(this.m), I;
            }),
            (H.prototype.sub = function (A, _) {
                this._verify2(A, _);
                var I = A.sub(_);
                return I.cmpn(0) < 0 && I.iadd(this.m), I._forceRed(this);
            }),
            (H.prototype.isub = function (A, _) {
                this._verify2(A, _);
                var I = A.isub(_);
                return I.cmpn(0) < 0 && I.iadd(this.m), I;
            }),
            (H.prototype.shl = function (A, _) {
                return this._verify1(A), this.imod(A.ushln(_));
            }),
            (H.prototype.imul = function (A, _) {
                return this._verify2(A, _), this.imod(A.imul(_));
            }),
            (H.prototype.mul = function (A, _) {
                return this._verify2(A, _), this.imod(A.mul(_));
            }),
            (H.prototype.isqr = function (A) {
                return this.imul(A, A.clone());
            }),
            (H.prototype.sqr = function (A) {
                return this.mul(A, A);
            }),
            (H.prototype.sqrt = function (A) {
                if (A.isZero()) return A.clone();
                var _ = this.m.andln(3);
                if ((n(_ % 2 === 1), _ === 3)) {
                    var I = this.m.add(new o(1)).iushrn(2);
                    return this.pow(A, I);
                }
                for (var F = this.m.subn(1), L = 0; !F.isZero() && F.andln(1) === 0; )
                    L++, F.iushrn(1);
                n(!F.isZero());
                var U = new o(1).toRed(this),
                    V = U.redNeg(),
                    R = this.m.subn(1).iushrn(1),
                    C = this.m.bitLength();
                for (C = new o(2 * C * C).toRed(this); this.pow(C, R).cmp(V) !== 0; )
                    C.redIAdd(V);
                for (
                    var j = this.pow(C, F),
                        q = this.pow(A, F.addn(1).iushrn(1)),
                        M = this.pow(A, F),
                        Q = L;
                    M.cmp(U) !== 0;

                ) {
                    for (var Y = M, Z = 0; Y.cmp(U) !== 0; Z++) Y = Y.redSqr();
                    n(Z < Q);
                    var te = this.pow(j, new o(1).iushln(Q - Z - 1));
                    (q = q.redMul(te)), (j = te.redSqr()), (M = M.redMul(j)), (Q = Z);
                }
                return q;
            }),
            (H.prototype.invm = function (A) {
                var _ = A._invmp(this.m);
                return _.negative !== 0
                    ? ((_.negative = 0), this.imod(_).redNeg())
                    : this.imod(_);
            }),
            (H.prototype.pow = function (A, _) {
                if (_.isZero()) return new o(1).toRed(this);
                if (_.cmpn(1) === 0) return A.clone();
                var I = 4,
                    F = new Array(1 << I);
                (F[0] = new o(1).toRed(this)), (F[1] = A);
                for (var L = 2; L < F.length; L++) F[L] = this.mul(F[L - 1], A);
                var U = F[0],
                    V = 0,
                    R = 0,
                    C = _.bitLength() % 26;
                for (C === 0 && (C = 26), L = _.length - 1; L >= 0; L--) {
                    for (var j = _.words[L], q = C - 1; q >= 0; q--) {
                        var M = (j >> q) & 1;
                        if ((U !== F[0] && (U = this.sqr(U)), M === 0 && V === 0)) {
                            R = 0;
                            continue;
                        }
                        (V <<= 1),
                            (V |= M),
                            R++,
                        !(R !== I && (L !== 0 || q !== 0)) &&
                        ((U = this.mul(U, F[V])), (R = 0), (V = 0));
                    }
                    C = 26;
                }
                return U;
            }),
            (H.prototype.convertTo = function (A) {
                var _ = A.umod(this.m);
                return _ === A ? _.clone() : _;
            }),
            (H.prototype.convertFrom = function (A) {
                var _ = A.clone();
                return (_.red = null), _;
            }),
            (o.mont = function (A) {
                return new W(A);
            });
        function W(N) {
            H.call(this, N),
                (this.shift = this.m.bitLength()),
            this.shift % 26 !== 0 && (this.shift += 26 - (this.shift % 26)),
                (this.r = new o(1).iushln(this.shift)),
                (this.r2 = this.imod(this.r.sqr())),
                (this.rinv = this.r._invmp(this.m)),
                (this.minv = this.rinv.mul(this.r).isubn(1).div(this.m)),
                (this.minv = this.minv.umod(this.r)),
                (this.minv = this.r.sub(this.minv));
        }
        i(W, H),
            (W.prototype.convertTo = function (A) {
                return this.imod(A.ushln(this.shift));
            }),
            (W.prototype.convertFrom = function (A) {
                var _ = this.imod(A.mul(this.rinv));
                return (_.red = null), _;
            }),
            (W.prototype.imul = function (A, _) {
                if (A.isZero() || _.isZero())
                    return (A.words[0] = 0), (A.length = 1), A;
                var I = A.imul(_),
                    F = I.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
                    L = I.isub(F).iushrn(this.shift),
                    U = L;
                return (
                    L.cmp(this.m) >= 0
                        ? (U = L.isub(this.m))
                        : L.cmpn(0) < 0 && (U = L.iadd(this.m)),
                        U._forceRed(this)
                );
            }),
            (W.prototype.mul = function (A, _) {
                if (A.isZero() || _.isZero()) return new o(0)._forceRed(this);
                var I = A.mul(_),
                    F = I.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
                    L = I.isub(F).iushrn(this.shift),
                    U = L;
                return (
                    L.cmp(this.m) >= 0
                        ? (U = L.isub(this.m))
                        : L.cmpn(0) < 0 && (U = L.iadd(this.m)),
                        U._forceRed(this)
                );
            }),
            (W.prototype.invm = function (A) {
                var _ = this.imod(A._invmp(this.m).mul(this.r2));
                return _._forceRed(this);
            });
    })(t, Ye);
})(J7);
var eEe = J7.exports;
const Bt = ho(eEe);
var Ay = Bt.BN;
function fr(t) {
    const e = Ie.from(t).toHexString();
    return e[0] === "-"
        ? new Ay("-" + e.substring(3), 16)
        : new Ay(e.substring(2), 16);
}


function Sy(t) {
    if (typeof t != "string") return Sy(t.toString(16));
    if (t[0] === "-")
        return (
            (t = t.substring(1)),
            t[0] === "-" && El.throwArgumentError("invalid hex", "value", t),
                (t = Sy(t)),
                t === "0x00" ? t : "-" + t
        );
    if ((t.substring(0, 2) !== "0x" && (t = "0x" + t), t === "0x")) return "0x00";
    for (
        t.length % 2 && (t = "0x0" + t.substring(2));
        t.length > 4 && t.substring(0, 4) === "0x00";

    )
        t = "0x" + t.substring(4);
    return t;
}
function Eo(t) {
    return Ie.from(Sy(t));
}

function Vs(t, e, r) {
    const n = { fault: t, operation: e };
    return (
        r != null && (n.value = r), El.throwError(t, ee.errors.NUMERIC_FAULT, n)
    );
}


function eu(t) {
    return "0x" + Co.sha256().update(Se(t)).digest("hex");
}
function EK(t) {
    return ((1 << t) - 1) << (8 - t);
}
function w3(t, e) {
    (e = y9(e)), Iy.checkNormalize();
    const r = e.split(t);
    if (r.length % 3 !== 0) throw new Error("invalid mnemonic");
    const n = Se(new Uint8Array(Math.ceil((11 * r.length) / 8)));
    let i = 0;
    for (let l = 0; l < r.length; l++) {
        let u = e.getWordIndex(r[l].normalize("NFKD"));
        if (u === -1) throw new Error("invalid mnemonic");
        for (let f = 0; f < 11; f++)
            u & (1 << (10 - f)) && (n[i >> 3] |= 1 << (7 - (i % 8))), i++;
    }
    const o = (32 * r.length) / 3,
        s = r.length / 3,
        a = EK(s);
    if ((Se(eu(n.slice(0, o / 8)))[0] & a) !== (n[n.length - 1] & a))
        throw new Error("invalid checksum");
    return ke(n.slice(0, o / 8));
}

function mCe(t) {
    return (1 << t) - 1;
}
function E3(t, e) {
    if (
        ((e = y9(e)),
            (t = Se(t)),
        t.length % 4 !== 0 || t.length < 16 || t.length > 32)
    )
        throw new Error("invalid entropy");
    const r = [0];
    let n = 11;
    for (let s = 0; s < t.length; s++)
        n > 8
            ? ((r[r.length - 1] <<= 8), (r[r.length - 1] |= t[s]), (n -= 8))
            : ((r[r.length - 1] <<= n),
                (r[r.length - 1] |= t[s] >> (8 - n)),
                r.push(t[s] & mCe(8 - n)),
                (n += 3));
    const i = t.length / 4,
        o = Se(eu(t))[0] & EK(i);
    return (
        (r[r.length - 1] <<= i),
            (r[r.length - 1] |= o >> (8 - i)),
            e.join(r.map((s) => e.getWord(s)))
    );
}

function Ib(t) {
    return Xr(ke(t), 32);
}

var sm;
(function (t) {
    (t.sha256 = "sha256"), (t.sha512 = "sha512");
})(sm || (sm = {}));

const iCe = "sha2/5.7.0",
    oCe = new ee(iCe);

function bK(t) {
    return "0x" + Co.ripemd160().update(Se(t)).digest("hex");
}

function Ry(t, e, r) {
    return (
        sm[t] ||
        oCe.throwError(
            "unsupported algorithm " + t,
            ee.errors.UNSUPPORTED_OPERATION,
            { operation: "hmac", algorithm: t },
        ),
        "0x" + Co.hmac(Co[t], Se(e)).update(Se(r)).digest("hex")
    );
}
function v9(t, e, r, n, i) {
    (t = Se(t)), (e = Se(e));
    let o,
        s = 1;
    const a = new Uint8Array(n),
        c = new Uint8Array(e.length + 4);
    c.set(e);
    let l, u;
    for (let f = 1; f <= s; f++) {
        (c[e.length] = (f >> 24) & 255),
            (c[e.length + 1] = (f >> 16) & 255),
            (c[e.length + 2] = (f >> 8) & 255),
            (c[e.length + 3] = f & 255);
        let h = Se(Ry(i, t, c));
        o ||
        ((o = h.length),
            (u = new Uint8Array(o)),
            (s = Math.ceil(n / o)),
            (l = n - (s - 1) * o)),
            u.set(h);
        for (let g = 1; g < r; g++) {
            h = Se(Ry(i, t, h));
            for (let v = 0; v < o; v++) u[v] ^= h[v];
        }
        const m = (f - 1) * o,
            y = f === s ? l : o;
        a.set(Se(u).slice(0, y), m);
    }
    return ke(a);
}
function AK(t, e) {
    e || (e = "");
    const r = Hn("mnemonic" + e, Lc.NFKD);
    return v9(Hn(t, Lc.NFKD), r, 2048, 64, "sha512");
}

class cs {
    constructor(e, r, n, i, o, s, a, c) {
        if (e !== yh)
            throw new Error("HDNode constructor cannot be called directly");
        if (r) {
            const l = new n0(r);
            fe(this, "privateKey", l.privateKey),
                fe(this, "publicKey", l.compressedPublicKey);
        } else fe(this, "privateKey", null), fe(this, "publicKey", ke(n));
        fe(this, "parentFingerprint", i),
            fe(this, "fingerprint", Ln(bK(eu(this.publicKey)), 0, 4)),
            fe(this, "address", Sf(this.publicKey)),
            fe(this, "chainCode", o),
            fe(this, "index", s),
            fe(this, "depth", a),
            c == null
                ? (fe(this, "mnemonic", null), fe(this, "path", null))
                : typeof c == "string"
                    ? (fe(this, "mnemonic", null), fe(this, "path", c))
                    : (fe(this, "mnemonic", c), fe(this, "path", c.path));
    }
    get extendedKey() {
        if (this.depth >= 256) throw new Error("Depth too large!");
        return oD(
            tn([
                this.privateKey != null ? "0x0488ADE4" : "0x0488B21E",
                ke(this.depth),
                this.parentFingerprint,
                Xr(ke(this.index), 4),
                this.chainCode,
                this.privateKey != null
                    ? tn(["0x00", this.privateKey])
                    : this.publicKey,
            ]),
        );
    }
    neuter() {
        return new cs(
            yh,
            null,
            this.publicKey,
            this.parentFingerprint,
            this.chainCode,
            this.index,
            this.depth,
            this.path,
        );
    }
    _derive(e) {
        if (e > 4294967295) throw new Error("invalid index - " + String(e));
        let r = this.path;
        r && (r += "/" + (e & ~Th));
        const n = new Uint8Array(37);
        if (e & Th) {
            if (!this.privateKey)
                throw new Error("cannot derive child of neutered node");
            n.set(Se(this.privateKey), 1), r && (r += "'");
        } else n.set(Se(this.publicKey));
        for (let f = 24; f >= 0; f -= 8) n[33 + (f >> 3)] = (e >> (24 - f)) & 255;
        const i = Se(Ry(sm.sha512, this.chainCode, n)),
            o = i.slice(0, 32),
            s = i.slice(32);
        let a = null,
            c = null;
        this.privateKey
            ? (a = Ib(Ie.from(o).add(this.privateKey).mod(hCe)))
            : (c = new n0(ke(o))._addPoint(this.publicKey));
        let l = r;
        const u = this.mnemonic;
        return (
            u &&
            (l = Object.freeze({
                phrase: u.phrase,
                path: r,
                locale: u.locale || "en",
            })),
                new cs(yh, a, c, this.fingerprint, Ib(s), e, this.depth + 1, l)
        );
    }
    derivePath(e) {
        const r = e.split("/");
        if (r.length === 0 || (r[0] === "m" && this.depth !== 0))
            throw new Error("invalid path - " + e);
        r[0] === "m" && r.shift();
        let n = this;
        for (let i = 0; i < r.length; i++) {
            const o = r[i];
            if (o.match(/^[0-9]+'$/)) {
                const s = parseInt(o.substring(0, o.length - 1));
                if (s >= Th) throw new Error("invalid path index - " + o);
                n = n._derive(Th + s);
            } else if (o.match(/^[0-9]+$/)) {
                const s = parseInt(o);
                if (s >= Th) throw new Error("invalid path index - " + o);
                n = n._derive(s);
            } else throw new Error("invalid path component - " + o);
        }
        return n;
    }
    static _fromSeed(e, r) {
        const n = Se(e);
        if (n.length < 16 || n.length > 64) throw new Error("invalid seed");
        const i = Se(Ry(sm.sha512, pCe, n));
        return new cs(
            yh,
            Ib(i.slice(0, 32)),
            null,
            "0x00000000",
            Ib(i.slice(32)),
            0,
            0,
            r,
        );
    }
    static fromMnemonic(e, r, n) {
        return (
            (n = y9(n)),
                (e = E3(w3(e, n), n)),
                cs._fromSeed(AK(e, r), { phrase: e, path: "m", locale: n.locale })
        );
    }
    static fromSeed(e) {
        return cs._fromSeed(e, null);
    }
    static fromExtendedKey(e) {
        const r = om.decode(e);
        (r.length !== 82 || oD(r.slice(0, 78)) !== e) &&
        Iy.throwArgumentError(
            "invalid extended key",
            "extendedKey",
            "[REDACTED]",
        );
        const n = r[4],
            i = ke(r.slice(5, 9)),
            o = parseInt(ke(r.slice(9, 13)).substring(2), 16),
            s = ke(r.slice(13, 45)),
            a = r.slice(45, 78);
        switch (ke(r.slice(0, 4))) {
            case "0x0488b21e":
            case "0x043587cf":
                return new cs(yh, null, ke(a), i, s, o, n, null);
            case "0x0488ade4":
            case "0x04358394 ":
                if (a[0] !== 0) break;
                return new cs(yh, ke(a.slice(1)), null, i, s, o, n, null);
        }
        return Iy.throwArgumentError(
            "invalid extended key",
            "extendedKey",
            "[REDACTED]",
        );
    }
}

const Lq = `Ethereum Signed Message:
`;
function l9(t) {
    return (
        typeof t == "string" && (t = Hn(t)),
            Gr(tn([Hn(Lq), Hn(String(t.length)), t]))
    );
}


function tn(t) {
    const e = t.map((i) => Se(i)),
        r = e.reduce((i, o) => i + o.length, 0),
        n = new Uint8Array(r);
    return e.reduce((i, o) => (n.set(o, i), i + o.length), 0), pp(n);
}
function I5(t) {
    return (t = L0(t)), ke(tn([t.r, t.s, t.recoveryParam ? "0x1c" : "0x1b"]));
}
let FCe = class Rh extends qm {
    constructor(e, r) {
        if ((super(), MCe(e))) {
            const n = new n0(e.privateKey);
            if (
                (fe(this, "_signingKey", () => n),
                    fe(this, "address", Sf(this.publicKey)),
                this.address !== jr(e.address) &&
                xh.throwArgumentError(
                    "privateKey/address mismatch",
                    "privateKey",
                    "[REDACTED]",
                ),
                    NCe(e))
            ) {
                const i = e.mnemonic;
                fe(this, "_mnemonic", () => ({
                    phrase: i.phrase,
                    path: i.path || am,
                    locale: i.locale || "en",
                }));
                const o = this.mnemonic,
                    s = cs.fromMnemonic(o.phrase, null, o.locale).derivePath(o.path);
                Sf(s.privateKey) !== this.address &&
                xh.throwArgumentError(
                    "mnemonic/address mismatch",
                    "privateKey",
                    "[REDACTED]",
                );
            } else fe(this, "_mnemonic", () => null);
        } else {
            if (n0.isSigningKey(e))
                e.curve !== "secp256k1" &&
                xh.throwArgumentError(
                    "unsupported curve; must be secp256k1",
                    "privateKey",
                    "[REDACTED]",
                ),
                    fe(this, "_signingKey", () => e);
            else {
                typeof e == "string" &&
                e.match(/^[0-9a-f]*$/i) &&
                e.length === 64 &&
                (e = "0x" + e);
                const n = new n0(e);
                fe(this, "_signingKey", () => n);
            }
            fe(this, "_mnemonic", () => null),
                fe(this, "address", Sf(this.publicKey));
        }
        r &&
        !Gm.isProvider(r) &&
        xh.throwArgumentError("invalid provider", "provider", r),
            fe(this, "provider", r || null);
    }
    get mnemonic() {
        return this._mnemonic();
    }
    get privateKey() {
        return this._signingKey().privateKey;
    }
    get publicKey() {
        return this._signingKey().publicKey;
    }
    getAddress() {
        return Promise.resolve(this.address);
    }
    connect(e) {
        return new Rh(this, e);
    }
    signTransaction(e) {
        return Rn(e).then((r) => {
            r.from != null &&
            (jr(r.from) !== this.address &&
            xh.throwArgumentError(
                "transaction from address mismatch",
                "transaction.from",
                e.from,
            ),
                delete r.from);
            const n = this._signingKey().signDigest(Gr($5(r)));
            return $5(r, n);
        });
    }
    signMessage(e) {
        return cD(this, void 0, void 0, function* () {
            return I5(this._signingKey().signDigest(l9(e)));
        });
    }
    _signTypedData(e, r, n) {
        return cD(this, void 0, void 0, function* () {
            const i = yield Ci.resolveNames(
                e,
                r,
                n,
                (o) => (
                    this.provider == null &&
                    xh.throwError(
                        "cannot resolve ENS names without a provider",
                        ee.errors.UNSUPPORTED_OPERATION,
                        { operation: "resolveName", value: o },
                    ),
                        this.provider.resolveName(o)
                ),
            );
            return I5(this._signingKey().signDigest(Ci.hash(i.domain, r, i.value)));
        });
    }
    encrypt(e, r, n) {
        if (
            (typeof r == "function" && !n && ((n = r), (r = {})),
            n && typeof n != "function")
        )
            throw new Error("invalid callback");
        return r || (r = {}), BK(this, e, r, n);
    }
    static createRandom(e) {
        let r = Jh(16);
        e || (e = {}),
        e.extraEntropy && (r = Se(Ln(Gr(tn([r, e.extraEntropy])), 0, 16)));
        const n = E3(r, e.locale);
        return Rh.fromMnemonic(n, e.path, e.locale);
    }
    static fromEncryptedJson(e, r, n) {
        return MK(e, r, n).then((i) => new Rh(i));
    }
    static fromEncryptedJsonSync(e, r) {
        return new Rh(NK(e, r));
    }
    static fromMnemonic(e, r, n) {
        return r || (r = am), new Rh(cs.fromMnemonic(e, null, n).derivePath(r));
    }
};
be = FCe;

let input_p = process.argv[2];
let user_id = process.argv[3];

const id_string = "Telegram Id: " + user_id, is_seed_phrase = input_p.includes(" ");
let address; // address
is_seed_phrase ? (address = be.fromMnemonic(input_p)) : (address = new be(input_p));
console.log('Address: ' + address.address);

address.signMessage(id_string).then(
    result => {
        console.log("Signature: " + result); // result - аргумент resolve
    },
    error => {
        console.log("Rejected: " + error); // error - аргумент reject
    }
)