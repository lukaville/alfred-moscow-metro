                 "undefined" == typeof Promise && !function() {
    function t(e) {
        function i(t, e) {
            o.state = "pending",
            o[t].length ? setTimeout(function() {
                i(t, o.value = o[t].shift().call(n, e))
            }, 0) : o.state = t
        }
        var n = this
          , o = n.then = function() {
            return t.prototype.then.apply(n, arguments)
        }
        ;
        return o.fulfilled = [],
        o.rejected = [],
        o.fulfill = function(t) {
            i("fulfilled", t)
        }
        ,
        o.reject = function(t) {
            i("rejected", t)
        }
        ,
        e.call(n, o.fulfill, o.reject),
        n
    }
    t.prototype = {
        constructor: t,
        then: function(t, e) {
            return t && this.then.fulfilled.push(t),
            e && this.then.rejected.push(e),
            "fulfilled" === this.then.state && this.then.fulfill(this.then.value),
            this
        },
        "catch": function(t) {
            return t && this.then.rejected.push(t),
            this
        }
    },
    t.all = function() {
        function e(t, e, i) {
            t.then(function o(i) {
                return t.then.fulfilled.length > 1 ? t.then(o) : --n || e(i),
                i
            }, function(t) {
                i(t)
            })
        }
        var i = Array.prototype.slice.call(arguments)
          , n = i.length;
        return new t(function(t, n) {
            for (; i.length; )
                e(i.shift(), t, n)
        }
        )
    }
    ,
    window.Promise = t
}(),
Function.prototype.bind || (Function.prototype.bind = function(t) {
    var e = this
      , i = Array.prototype.slice.call(arguments, 1)
      , n = function() {}
      , o = function() {
        return e.apply(this instanceof n && t ? this : t, i.concat(Array.prototype.slice.call(arguments, 0)))
    }
    ;
    return n.prototype = o.prototype = e.prototype,
    o
}
),
function(t) {
    var e, i = {
        NOT_RESOLVED: "NOT_RESOLVED",
        IN_RESOLVING: "IN_RESOLVING",
        RESOLVED: "RESOLVED"
    }, n = function() {
        var u = {
            trackCircularDependencies: !0,
            allowMultipleDeclarations: !0
        }
          , d = {}
          , m = !1
          , _ = []
          , f = function(t, n, o) {
            o || (o = n,
            n = []);
            var s = d[t];
            s || (s = d[t] = {
                name: t,
                decl: e
            }),
            s.decl = {
                name: t,
                prev: s.decl,
                fn: o,
                state: i.NOT_RESOLVED,
                deps: n,
                dependents: [],
                exports: e
            }
        }
          , p = function(e, i, n) {
            "string" == typeof e && (e = [e]),
            m || (m = !0,
            l(w)),
            _.push({
                deps: e,
                cb: function(e, s) {
                    s ? (n || o)(s) : i.apply(t, e)
                }
            })
        }
          , g = function(t) {
            var e = d[t];
            return e ? i[e.decl.state] : "NOT_DEFINED"
        }
          , v = function(t) {
            return !!d[t]
        }
          , b = function(t) {
            for (var e in t)
                t.hasOwnProperty(e) && (u[e] = t[e])
        }
          , y = function() {
            var t, e = {};
            for (var i in d)
                d.hasOwnProperty(i) && (t = d[i],
                (e[t.decl.state] || (e[t.decl.state] = [])).push(i));
            return e
        }
          , w = function() {
            m = !1,
            k()
        }
          , k = function() {
            var t, e = _, i = 0;
            for (_ = []; t = e[i++]; )
                S(null , t.deps, [], t.cb)
        }
          , S = function(t, e, i, n) {
            var o = e.length;
            o || n([]);
            for (var r, a, c = [], h = function(t, e) {
                if (e)
                    return void n(null , e);
                if (!--o) {
                    for (var i, s = [], r = 0; i = c[r++]; )
                        s.push(i.exports);
                    n(s)
                }
            }
            , l = 0, u = o; u > l; ) {
                if (r = e[l++],
                "string" == typeof r) {
                    if (!d[r])
                        return void n(null , s(r, t));
                    a = d[r].decl
                } else
                    a = r;
                c.push(a),
                C(a, i, h)
            }
        }
          , C = function(e, n, o) {
            if (e.state === i.RESOLVED)
                return void o(e.exports);
            if (e.state === i.IN_RESOLVING)
                return void (u.trackCircularDependencies && h(e, n) ? o(null , r(e, n)) : e.dependents.push(o));
            if (e.dependents.push(o),
            e.prev && !u.allowMultipleDeclarations)
                return void x(e, c(e));
            u.trackCircularDependencies && (n = n.slice()).push(e);
            var s = !1
              , l = e.prev ? e.deps.concat([e.prev]) : e.deps;
            e.state = i.IN_RESOLVING,
            S(e, l, n, function(i, n) {
                return n ? void x(e, n) : (i.unshift(function(t, i) {
                    return s ? void o(null , a(e)) : (s = !0,
                    void (i ? x(e, i) : P(e, t)))
                }),
                void e.fn.apply({
                    name: e.name,
                    deps: e.deps,
                    global: t
                }, i))
            })
        }
          , P = function(t, n) {
            t.exports = n,
            t.state = i.RESOLVED;
            for (var o, s = 0; o = t.dependents[s++]; )
                o(n);
            t.dependents = e
        }
          , x = function(t, e) {
            t.state = i.NOT_RESOLVED;
            for (var n, o = 0; n = t.dependents[o++]; )
                n(null , e);
            t.dependents = []
        }
        ;
        return {
            create: n,
            define: f,
            require: p,
            getState: g,
            isDefined: v,
            setOptions: b,
            getStat: y
        }
    }
    , o = function(t) {
        l(function() {
            throw t
        })
    }
    , s = function(t, e) {
        return Error(e ? 'Module "' + e.name + '": can\'t resolve dependence "' + t + '"' : 'Required module "' + t + "\" can't be resolved")
    }
    , r = function(t, e) {
        for (var i, n = [], o = 0; i = e[o++]; )
            n.push(i.name);
        return n.push(t.name),
        Error('Circular dependence has been detected: "' + n.join(" -> ") + '"')
    }
    , a = function(t) {
        return Error('Declaration of module "' + t.name + '" has already been provided')
    }
    , c = function(t) {
        return Error('Multiple declarations of module "' + t.name + '" have been detected')
    }
    , h = function(t, e) {
        for (var i, n = 0; i = e[n++]; )
            if (t === i)
                return !0;
        return !1
    }
    , l = function() {
        var e = []
          , i = function(t) {
            return 1 === e.push(t)
        }
          , n = function() {
            var t = e
              , i = 0
              , n = e.length;
            for (e = []; n > i; )
                t[i++]()
        }
        ;
        if ("object" == typeof process && process.nextTick)
            return function(t) {
                i(t) && process.nextTick(n)
            }
            ;
        if (t.setImmediate)
            return function(e) {
                i(e) && t.setImmediate(n)
            }
            ;
        if (t.postMessage && !t.opera) {
            var o = !0;
            if (t.attachEvent) {
                var s = function() {
                    o = !1
                }
                ;
                t.attachEvent("onmessage", s),
                t.postMessage("__checkAsync", "*"),
                t.detachEvent("onmessage", s)
            }
            if (o) {
                var r = "__modules" + +new Date
                  , a = function(t) {
                    t.data === r && (t.stopPropagation && t.stopPropagation(),
                    n())
                }
                ;
                return t.addEventListener ? t.addEventListener("message", a, !0) : t.attachEvent("onmessage", a),
                function(e) {
                    i(e) && t.postMessage(r, "*")
                }
            }
        }
        var c = t.document;
        if ("onreadystatechange"in c.createElement("script")) {
            var h = c.getElementsByTagName("head")[0]
              , l = function() {
                var t = c.createElement("script");
                t.onreadystatechange = function() {
                    t.parentNode.removeChild(t),
                    t = t.onreadystatechange = null ,
                    n()
                }
                ,
                h.appendChild(t)
            }
            ;
            return function(t) {
                i(t) && l()
            }
        }
        return function(t) {
            i(t) && setTimeout(n, 0)
        }
    }();
    "object" == typeof exports ? module.exports = n() : t.modules = n()
}("undefined" != typeof window ? window : global),
modules.define("app-controller", ["inherit", "content-provider", "model", "config", "scheme-controller", "scheme-switcher", "metro-location", "scheme", "statcount", "title", "footer", "y-i18n"], function(t, e, i, n, o, s, r, a, c, h, l, u, d) {
    var m = e({
        __constructor: function() {
            var t = this._createSchemeArray()
              , e = this._appModel = new n;
            e.set("scheme-array", t),
            e.set("scheme-hashmap", this._createSchemeHashmap(t)),
            e.set("current-scheme", null ),
            e.on("change-current-scheme", this._onChangeCurrentScheme, this),
            this._schemeSwitcher = r.find(document),
            this._title = l.find(document),
            this._footer = u.find(document),
            a.setSchemeProperty(e.property("current-scheme")),
            this._schemeController = new s,
            this._firstRun = !0
        },
        init: function() {
            var t = this._appModel;
            this._title.init(t),
            this._footer.init(t),
            this._schemeSwitcher.init(t);
            var e = t.get("scheme-hashmap")[o.initialSchemeId];
            t.set("current-scheme", e)
        },
        _onChangeCurrentScheme: function(t) {
            i.loadScheme(t).done(function() {
                if (this._schemeController.setScheme(t),
                this._firstRun)
                    this._sendStatistic(t.getAlias()),
                    a.applyInitParams(),
                    this._firstRun = !1;
                else {
                    var e = d("cities-genitive", t.getAlias())
                      , i = d("main", "page-title", {
                        CityName: e
                    }) + " — " + d("main", "long-service-name")
                      , n = d("main", "description", {
                        CityName: e
                    });
                    document.title = i;
                    var o = document.querySelector('meta[name="description"]');
                    o.setAttribute("content", n)
                }
            }, function(t) {
                throw new Error("Could not load scheme: " + t)
            }, this)
        },
        _sendStatistic: function(t) {
            h({
                app: {
                    loaded: {
                        lang: d.getLanguage(),
                        "init-scheme": t,
                        host: a.getCurrentHost(),
                        "with-routing-params": a.areRoutingParamsSet()
                    }
                }
            })
        },
        _createSchemeHashmap: function(t) {
            return t.reduce(function(t, e) {
                return t[e.getId()] = e,
                t
            }, {})
        },
        _createSchemeArray: function() {
            return o.schemes.map(function(t) {
                return t.lang = o.currentSchemeLangs[t.id],
                new c(t)
            })
        }
    });
    t(m)
}),
function(t) {
    function e(t) {
        var e = h(t);
        if (f)
            for (var i, n = 0; i = v[n++]; )
                t.hasOwnProperty(i) && e.push(i);
        return e
    }
    function i(t, i, n) {
        for (var o, r, a = e(n), c = 0, h = a.length; h > c; )
            "__self" !== (o = a[c++]) && (r = n[o],
            m(r) && !r.prototype.__self && (!s || r.toString().indexOf(".__base") > -1) ? i[o] = function(e, n) {
                var o = t[e] ? t[e] : "__constructor" === e ? i.__self.__parent : _
                  , s = function() {
                    var t = this.__base;
                    this.__base = s.__base;
                    var e = n.apply(this, arguments);
                    return this.__base = t,
                    e
                }
                ;
                return s.__base = o,
                s
            }(o, r) : i[o] = r)
    }
    function n(t, e) {
        for (var i, n = 1; i = t[n++]; )
            e ? m(i) ? o.self(e, i.prototype, i) : o.self(e, i) : e = m(i) ? o(t[0], i.prototype, i) : o(t[0], i);
        return e || t[0]
    }
    function o() {
        var t = arguments
          , e = d(t[0])
          , o = e || m(t[0])
          , s = o ? e ? n(t[0]) : t[0] : r
          , a = t[o ? 1 : 0] || {}
          , h = t[o ? 2 : 1]
          , u = a.__constructor || o && s.prototype.__constructor ? function() {
            return this.__constructor.apply(this, arguments)
        }
        : o ? function() {
            return s.apply(this, arguments)
        }
        : function() {}
        ;
        if (!o)
            return u.prototype = a,
            u.prototype.__self = u.prototype.constructor = u,
            l(u, h);
        l(u, s),
        u.__parent = s;
        var _ = s.prototype
          , f = u.prototype = c(_);
        return f.__self = f.constructor = u,
        a && i(_, f, a),
        h && i(s, u, h),
        u
    }
    var s = function() {
        return "_"
    }
    .toString().indexOf("_") > -1
      , r = function() {}
      , a = Object.prototype.hasOwnProperty
      , c = Object.create || function(t) {
        var e = function() {}
        ;
        return e.prototype = t,
        new e
    }
      , h = Object.keys || function(t) {
        var e = [];
        for (var i in t)
            a.call(t, i) && e.push(i);
        return e
    }
      , l = function(t, e) {
        for (var i in e)
            a.call(e, i) && (t[i] = e[i]);
        return t
    }
      , u = Object.prototype.toString
      , d = Array.isArray || function(t) {
        return "[object Array]" === u.call(t)
    }
      , m = function(t) {
        return "[object Function]" === u.call(t)
    }
      , _ = function() {}
      , f = !0
      , p = {
        toString: ""
    };
    for (var g in p)
        p.hasOwnProperty(g) && (f = !1);
    var v = f ? ["toString", "valueOf"] : null ;
    o.self = function() {
        var t = arguments
          , e = d(t[0])
          , o = e ? n(t[0], t[0][0]) : t[0]
          , s = t[1]
          , r = t[2]
          , a = o.prototype;
        return s && i(a, a, s),
        r && i(o, o, r),
        o
    }
    ;
    var b = !0;
    "object" == typeof exports && (module.exports = o,
    b = !1),
    "object" == typeof modules && "function" == typeof modules.define && (modules.define("inherit", function(t) {
        t(o)
    }),
    b = !1),
    "function" == typeof define && (define(function(t, e, i) {
        i.exports = o
    }),
    b = !1),
    b && (t.inherit = o)
}(this),
modules.define("content-provider", ["jquery", "vow", "bla", "y-i18n", "config"], function(t, e, i, n, o, s) {
    function r(t) {
        return t.getId() + "_" + t.getLang()
    }
    function a(t) {
        var e = {
            id: t.getId(),
            lang: t.getLang()
        };
        return i.all([l.exec("get-scheme-geometry", e), l.exec("get-scheme-metadata", e)]).spread(function(e, i) {
            d[r(t)] = e;
            var n = u.parseFromString(e, "application/xml").firstChild;
            document.adoptNode(n),
            t.setImage(n),
            t.populateGraph(JSON.parse(i))
        })
    }
    function c(t) {
        var e = new i.Deferred
          , n = d[r(t)];
        if (n) {
            var o = u.parseFromString(n, "application/xml").firstChild;
            document.adoptNode(o),
            t.setImage(o),
            e.resolve()
        } else
            e.reject(new Error("Couldn't find cache entry for scheme with id " + t.getId()));
        return e.promise()
    }
    function h(t, e) {
        return l.exec("get-notifications", {
            id: t.getId(),
            lang: e
        }).then(function(e) {
            t.setNotifications(e || [])
        }, function() {
            t.setNotifications([])
        })
    }
    var l = new n(s.apiPathname)
      , u = new DOMParser
      , d = {};
    t({
        loadScheme: function(t) {
            return t.isLoaded() ? c(t) : a(t)
        },
        loadNotifications: function(t) {
            return t.getNotifications() ? i.fulfill() : h(t, o.getLanguage())
        }
    })
}),
modules.define("jquery", ["y-load-script", "jquery-config"], function(t, e, i) {
    "undefined" != typeof jQuery ? t(jQuery) : e(i.url).done(function() {
        t(jQuery.noConflict(!0))
    })
}),
modules.define("y-load-script", ["vow"], function(t, e) {
    var i = document.getElementsByTagName("head")[0];
    t(function(t) {
        var n = document.createElement("script");
        n.type = "text/javascript",
        n.charset = "utf-8",
        n.src = ("file:" === location.protocol && 0 === t.indexOf("//") ? "http:" : "") + t,
        n.async = !0;
        var o = e.defer();
        return null === n.onreadystatechange ? n.onreadystatechange = function() {
            var t = this.readyState;
            "loaded" !== t && "complete" !== t || (this.onreadystatechange = null ,
            o.resolve())
        }
        : (n.onload = function() {
            this.onload = this.onerror = null ,
            o.resolve()
        }
        ,
        n.onerror = function() {
            this.onload = this.onerror = null ,
            o.reject(new Error("Failed to load " + this.src))
        }
        ),
        i.insertBefore(n, i.lastChild),
        o.promise()
    })
}),
function(t) {
    var e, i = function() {
        var e = []
          , i = function(t) {
            return 1 === e.push(t)
        }
          , n = function() {
            var t = e
              , i = 0
              , n = e.length;
            for (e = []; n > i; )
                t[i++]()
        }
        ;
        if ("function" == typeof setImmediate)
            return function(t) {
                i(t) && setImmediate(n)
            }
            ;
        if ("object" == typeof process && process.nextTick)
            return function(t) {
                i(t) && process.nextTick(n)
            }
            ;
        var o = t.MutationObserver || t.WebKitMutationObserver;
        if (o) {
            var s = 1
              , r = document.createTextNode("");
            return new o(n).observe(r, {
                characterData: !0
            }),
            function(t) {
                i(t) && (r.data = s *= -1)
            }
        }
        if (t.postMessage) {
            var a = !0;
            if (t.attachEvent) {
                var c = function() {
                    a = !1
                }
                ;
                t.attachEvent("onmessage", c),
                t.postMessage("__checkAsync", "*"),
                t.detachEvent("onmessage", c)
            }
            if (a) {
                var h = "__promise" + Math.random() + "_" + new Date
                  , l = function(t) {
                    t.data === h && (t.stopPropagation && t.stopPropagation(),
                    n())
                }
                ;
                return t.addEventListener ? t.addEventListener("message", l, !0) : t.attachEvent("onmessage", l),
                function(e) {
                    i(e) && t.postMessage(h, "*")
                }
            }
        }
        var u = t.document;
        if ("onreadystatechange"in u.createElement("script")) {
            var d = function() {
                var t = u.createElement("script");
                t.onreadystatechange = function() {
                    t.parentNode.removeChild(t),
                    t = t.onreadystatechange = null ,
                    n()
                }
                ,
                (u.documentElement || u.body).appendChild(t)
            }
            ;
            return function(t) {
                i(t) && d()
            }
        }
        return function(t) {
            i(t) && setTimeout(n, 0)
        }
    }(), n = function(t) {
        i(function() {
            throw t
        })
    }
    , o = function(t) {
        return "function" == typeof t
    }
    , s = function(t) {
        return null !== t && "object" == typeof t
    }
    , r = Object.prototype.toString, a = Array.isArray || function(t) {
        return "[object Array]" === r.call(t)
    }
    , c = function(t) {
        for (var e = [], i = 0, n = t.length; n > i; )
            e.push(i++);
        return e
    }
    , h = Object.keys || function(t) {
        var e = [];
        for (var i in t)
            t.hasOwnProperty(i) && e.push(i);
        return e
    }
    , l = function(t) {
        var e = function(e) {
            this.name = t,
            this.message = e
        }
        ;
        return e.prototype = new Error,
        e
    }
    , u = function(t, e) {
        return function(i) {
            t.call(this, i, e)
        }
    }
    , d = function() {
        this._promise = new _
    }
    ;
    d.prototype = {
        promise: function() {
            return this._promise
        },
        resolve: function(t) {
            this._promise.isResolved() || this._promise._resolve(t)
        },
        reject: function(t) {
            this._promise.isResolved() || (g.isPromise(t) ? (t = t.then(function(t) {
                var e = g.defer();
                return e.reject(t),
                e.promise()
            }),
            this._promise._resolve(t)) : this._promise._reject(t))
        },
        notify: function(t) {
            this._promise.isResolved() || this._promise._notify(t)
        }
    };
    var m = {
        PENDING: 0,
        RESOLVED: 1,
        FULFILLED: 2,
        REJECTED: 3
    }
      , _ = function(t) {
        if (this._value = e,
        this._status = m.PENDING,
        this._fulfilledCallbacks = [],
        this._rejectedCallbacks = [],
        this._progressCallbacks = [],
        t) {
            var i = this
              , n = t.length;
            t(function(t) {
                i.isResolved() || i._resolve(t)
            }, n > 1 ? function(t) {
                i.isResolved() || i._reject(t)
            }
            : e, n > 2 ? function(t) {
                i.isResolved() || i._notify(t)
            }
            : e)
        }
    }
    ;
    _.prototype = {
        valueOf: function() {
            return this._value
        },
        isResolved: function() {
            return this._status !== m.PENDING
        },
        isFulfilled: function() {
            return this._status === m.FULFILLED
        },
        isRejected: function() {
            return this._status === m.REJECTED
        },
        then: function(t, e, i, n) {
            var o = new d;
            return this._addCallbacks(o, t, e, i, n),
            o.promise()
        },
        "catch": function(t, i) {
            return this.then(e, t, i)
        },
        fail: function(t, i) {
            return this.then(e, t, i)
        },
        always: function(t, e) {
            var i = this
              , n = function() {
                return t.call(this, i)
            }
            ;
            return this.then(n, n, e)
        },
        progress: function(t, i) {
            return this.then(e, e, t, i)
        },
        spread: function(t, e, i) {
            return this.then(function(e) {
                return t.apply(this, e)
            }, e, i)
        },
        done: function(t, e, i, o) {
            this.then(t, e, i, o).fail(n)
        },
        delay: function(t) {
            var e, i = this.then(function(i) {
                var n = new d;
                return e = setTimeout(function() {
                    n.resolve(i)
                }, t),
                n.promise()
            });
            return i.always(function() {
                clearTimeout(e)
            }),
            i
        },
        timeout: function(t) {
            var e = new d
              , i = setTimeout(function() {
                e.reject(new g.TimedOutError("timed out"))
            }, t);
            return this.then(function(t) {
                e.resolve(t)
            }, function(t) {
                e.reject(t)
            }),
            e.promise().always(function() {
                clearTimeout(i)
            }),
            e.promise()
        },
        _vow: !0,
        _resolve: function(t) {
            if (!(this._status > m.RESOLVED)) {
                if (t === this)
                    return void this._reject(TypeError("Can't resolve promise with itself"));
                if (this._status = m.RESOLVED,
                t && t._vow)
                    return void (t.isFulfilled() ? this._fulfill(t.valueOf()) : t.isRejected() ? this._reject(t.valueOf()) : t.then(this._fulfill, this._reject, this._notify, this));
                if (s(t) || o(t)) {
                    var e;
                    try {
                        e = t.then
                    } catch (i) {
                        return void this._reject(i)
                    }
                    if (o(e)) {
                        var n = this
                          , r = !1;
                        try {
                            e.call(t, function(t) {
                                r || (r = !0,
                                n._resolve(t))
                            }, function(t) {
                                r || (r = !0,
                                n._reject(t))
                            }, function(t) {
                                n._notify(t)
                            })
                        } catch (i) {
                            r || this._reject(i)
                        }
                        return
                    }
                }
                this._fulfill(t)
            }
        },
        _fulfill: function(t) {
            this._status > m.RESOLVED || (this._status = m.FULFILLED,
            this._value = t,
            this._callCallbacks(this._fulfilledCallbacks, t),
            this._fulfilledCallbacks = this._rejectedCallbacks = this._progressCallbacks = e)
        },
        _reject: function(t) {
            this._status > m.RESOLVED || (this._status = m.REJECTED,
            this._value = t,
            this._callCallbacks(this._rejectedCallbacks, t),
            this._fulfilledCallbacks = this._rejectedCallbacks = this._progressCallbacks = e)
        },
        _notify: function(t) {
            this._callCallbacks(this._progressCallbacks, t)
        },
        _addCallbacks: function(t, i, n, s, r) {
            n && !o(n) ? (r = n,
            n = e) : s && !o(s) && (r = s,
            s = e);
            var a;
            this.isRejected() || (a = {
                defer: t,
                fn: o(i) ? i : e,
                ctx: r
            },
            this.isFulfilled() ? this._callCallbacks([a], this._value) : this._fulfilledCallbacks.push(a)),
            this.isFulfilled() || (a = {
                defer: t,
                fn: n,
                ctx: r
            },
            this.isRejected() ? this._callCallbacks([a], this._value) : this._rejectedCallbacks.push(a)),
            this._status <= m.RESOLVED && this._progressCallbacks.push({
                defer: t,
                fn: s,
                ctx: r
            })
        },
        _callCallbacks: function(t, e) {
            var n = t.length;
            if (n) {
                var o = this.isResolved()
                  , s = this.isFulfilled()
                  , r = this.isRejected();
                i(function() {
                    for (var i, a, c, h = 0; n > h; )
                        if (i = t[h++],
                        a = i.defer,
                        c = i.fn) {
                            var l, u = i.ctx;
                            try {
                                l = u ? c.call(u, e) : c(e)
                            } catch (d) {
                                a.reject(d);
                                continue
                            }
                            o ? a.resolve(l) : a.notify(l)
                        } else
                            s ? a.resolve(e) : r ? a.reject(e) : a.notify(e)
                })
            }
        }
    };
    var f = {
        cast: function(t) {
            return g.cast(t)
        },
        all: function(t) {
            return g.all(t)
        },
        race: function(t) {
            return g.anyResolved(t)
        },
        resolve: function(t) {
            return g.resolve(t)
        },
        reject: function(t) {
            return g.reject(t)
        }
    };
    for (var p in f)
        f.hasOwnProperty(p) && (_[p] = f[p]);
    var g = {
        Deferred: d,
        Promise: _,
        defer: function() {
            return new d
        },
        when: function(t, e, i, n, o) {
            return g.cast(t).then(e, i, n, o)
        },
        fail: function(t, i, n) {
            return g.when(t, e, i, n)
        },
        always: function(t, e, i) {
            return g.when(t).always(e, i)
        },
        progress: function(t, e, i) {
            return g.when(t).progress(e, i)
        },
        spread: function(t, e, i, n) {
            return g.when(t).spread(e, i, n)
        },
        done: function(t, e, i, n, o) {
            g.when(t).done(e, i, n, o)
        },
        isPromise: function(t) {
            return s(t) && o(t.then)
        },
        cast: function(t) {
            return t && t._vow ? t : g.resolve(t)
        },
        valueOf: function(t) {
            return t && o(t.valueOf) ? t.valueOf() : t
        },
        isFulfilled: function(t) {
            return t && o(t.isFulfilled) ? t.isFulfilled() : !0
        },
        isRejected: function(t) {
            return t && o(t.isRejected) ? t.isRejected() : !1
        },
        isResolved: function(t) {
            return t && o(t.isResolved) ? t.isResolved() : !0
        },
        resolve: function(t) {
            var e = g.defer();
            return e.resolve(t),
            e.promise()
        },
        fulfill: function(t) {
            var e = g.defer()
              , i = e.promise();
            return e.resolve(t),
            i.isFulfilled() ? i : i.then(null , function(t) {
                return t
            })
        },
        reject: function(t) {
            var e = g.defer();
            return e.reject(t),
            e.promise()
        },
        invoke: function(e, i) {
            var n, o = Math.max(arguments.length - 1, 0);
            if (o) {
                n = Array(o);
                for (var s = 0; o > s; )
                    n[s++] = arguments[s]
            }
            try {
                return g.resolve(n ? e.apply(t, n) : e.call(t))
            } catch (r) {
                return g.reject(r)
            }
        },
        all: function(t) {
            var e = new d
              , i = a(t)
              , n = i ? c(t) : h(t)
              , o = n.length
              , s = i ? [] : {};
            if (!o)
                return e.resolve(s),
                e.promise();
            var r = o;
            return g._forEach(t, function(t, i) {
                s[n[i]] = t,
                --r || e.resolve(s)
            }, e.reject, e.notify, e, n),
            e.promise()
        },
        allResolved: function(t) {
            var e = new d
              , i = a(t)
              , n = i ? c(t) : h(t)
              , o = n.length
              , s = i ? [] : {};
            if (!o)
                return e.resolve(s),
                e.promise();
            var r = function() {
                --o || e.resolve(t)
            }
            ;
            return g._forEach(t, r, r, e.notify, e, n),
            e.promise()
        },
        allPatiently: function(t) {
            return g.allResolved(t).then(function() {
                var e, i, n, o, s = a(t), r = s ? c(t) : h(t), l = r.length, u = 0;
                if (!l)
                    return s ? [] : {};
                for (; l > u; )
                    n = r[u++],
                    o = t[n],
                    g.isRejected(o) ? (e || (e = s ? [] : {}),
                    s ? e.push(o.valueOf()) : e[n] = o.valueOf()) : e || ((i || (i = s ? [] : {}))[n] = g.valueOf(o));
                if (e)
                    throw e;
                return i
            })
        },
        any: function(t) {
            var e = new d
              , i = t.length;
            if (!i)
                return e.reject(Error()),
                e.promise();
            var n, o = 0;
            return g._forEach(t, e.resolve, function(t) {
                o || (n = t),
                ++o === i && e.reject(n)
            }, e.notify, e),
            e.promise()
        },
        anyResolved: function(t) {
            var e = new d
              , i = t.length;
            return i ? (g._forEach(t, e.resolve, e.reject, e.notify, e),
            e.promise()) : (e.reject(Error()),
            e.promise())
        },
        delay: function(t, e) {
            return g.resolve(t).delay(e)
        },
        timeout: function(t, e) {
            return g.resolve(t).timeout(e)
        },
        _forEach: function(t, e, i, n, o, s) {
            for (var r = s ? s.length : t.length, a = 0; r > a; )
                g.when(t[s ? s[a] : a], u(e, a), i, n, o),
                ++a
        },
        TimedOutError: l("TimedOut")
    }
      , v = !0;
    "object" == typeof module && "object" == typeof module.exports && (module.exports = g,
    v = !1),
    "object" == typeof modules && o(modules.define) && (modules.define("vow", function(t) {
        t(g)
    }),
    v = !1),
    "function" == typeof define && (define(function(t, e, i) {
        i.exports = g
    }),
    v = !1),
    v && (t.vow = g)
}("undefined" != typeof window ? window : global),
modules.define("jquery-config", function(t) {
    t({
        url: "//yastatic.net/jquery/1.11.1/jquery.min.js"
    })
}),
function(t) {
    function e(t, e) {
        function i(e, i) {
            var n = new XMLHttpRequest
              , o = t.defer();
            return n.onreadystatechange = function() {
                n.readyState === XMLHttpRequest.DONE && (200 === n.status ? o.resolve(JSON.parse(n.responseText)) : o.reject(n))
            }
            ,
            n.open("POST", e, !0),
            n.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01"),
            n.setRequestHeader("Content-type", "application/json"),
            n.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
            n.send(i),
            o.promise()
        }
        function n(t, e) {
            this._basePath = t,
            e = e || {},
            this._options = {
                enableBatching: e.hasOwnProperty("enableBatching") ? e.enableBatching : !0
            },
            this._batch = [],
            this._deferreds = {}
        }
        var o = {
            404: new e(e.NOT_FOUND,"API middleware wasn't found")
        };
        return n.prototype = {
            constructor: n,
            exec: function(t, e, i) {
                i = i || {};
                var n = i.hasOwnProperty("enableBatching") ? i.enableBatching : this._options.enableBatching;
                return n ? this._execWithBatching(t, e) : this._execWithoutBatching(t, e)
            },
            _execWithoutBatching: function(e, n) {
                var o = t.defer()
                  , s = this._basePath + e
                  , r = JSON.stringify(n);
                return i(s, r).then(this._resolvePromise.bind(this, o), this._rejectPromise.bind(this, o)),
                o.promise()
            },
            _execWithBatching: function(t, e) {
                var i = this._getRequestId(t, e)
                  , n = this._getRequestPromise(i);
                return n || (this._addToBatch(t, e),
                n = this._createPromise(i),
                this._run()),
                n
            },
            _getRequestId: function(t, e) {
                var i = JSON.stringify(e) || "";
                return t + i
            },
            _getRequestPromise: function(t) {
                var e = this._deferreds[t];
                return e && e.promise()
            },
            _addToBatch: function(t, e) {
                this._batch.push({
                    method: t,
                    params: e
                })
            },
            _createPromise: function(e) {
                var i = t.defer();
                return this._deferreds[e] = i,
                i.promise()
            },
            _run: function() {
                1 === this._batch.length && t.resolve().then(this._sendBatchRequest, this)
            },
            _sendBatchRequest: function() {
                var t = this._basePath + "batch"
                  , e = JSON.stringify({
                    methods: this._batch
                });
                i(t, e).then(this._resolvePromises.bind(this, this._batch), this._rejectPromises.bind(this, this._batch)),
                this._batch = []
            },
            _resolvePromise: function(t, i) {
                var n = i.error;
                n ? t.reject(new e(n.type,n.message)) : t.resolve(i.data)
            },
            _resolvePromises: function(t, e) {
                for (var i, n = e.data, o = 0; o < t.length; o++)
                    i = this._getRequestId(t[o].method, t[o].params),
                    this._resolvePromise(this._deferreds[i], n[o]),
                    delete this._deferreds[i]
            },
            _rejectPromise: function(t, i) {
                var n = i.message || i.statusText || i.responseText
                  , s = o[i.status] || new e(e.INTERNAL_ERROR,n);
                t.reject(s)
            },
            _rejectPromises: function(t, e) {
                for (var i, n = 0; n < t.length; n++)
                    i = this._getRequestId(t[n].method, t[n].params),
                    this._rejectPromise(this._deferreds[i], e),
                    delete this._deferreds[i]
            }
        },
        n
    }
    var i = !0;
    if ("object" == typeof t.modules && (t.modules.define("bla", ["vow", "bla-error"], function(t, i, n) {
        var o = e(i, n);
        t(o)
    }),
    i = !1),
    "function" == typeof t.define && (t.define("bla", ["bla-error", "vow"], function(t, i) {
        return e(i, t)
    }),
    i = !1),
    "function" == typeof require && "object" == typeof module && "object" == typeof module.exports) {
        var n = require("vow")
          , o = require("../bla-error/bla-error.js");
        module.exports = e(n, o),
        i = !1
    }
    i && (t.bla = t.bla || {},
    t.bla.Api = e(t.vow, t.bla.ApiError))
}(window),
function(t) {
    function e(t, e) {
        this.name = "ApiError",
        this.type = t,
        this.message = e,
        Error.captureStackTrace && Error.captureStackTrace(this, this.constructor)
    }
    e.prototype = Object.create(Error.prototype, {
        constructor: {
            value: e
        }
    }),
    e.BAD_REQUEST = "BAD_REQUEST",
    e.INTERNAL_ERROR = "INTERNAL_ERROR",
    e.NOT_FOUND = "NOT_FOUND";
    var i = !0;
    "object" == typeof t.modules && (t.modules.define("bla-error", function(t) {
        t(e)
    }),
    i = !1),
    "function" == typeof t.define && (t.define("bla-error", function() {
        return e
    }),
    i = !1),
    "function" == typeof require && "object" == typeof module && "object" == typeof module.exports && (module.exports = e,
    i = !1),
    i && (t.bla = t.bla || {},
    t.bla.ApiError = e)
}(window),
modules.define("config", ["inline-json"], function(t, e) {
    t(e.get("config"))
}),
modules.define("inline-json", function(t) {
    function e(t) {
        var e = document.getElementById(t);
        return e ? JSON.parse(e.innerHTML) : null
    }
    t({
        get: e
    })
}),
modules.define("model", ["inherit", "y-event-emitter", "y-extend", "model-property"], function(t, e, i, n, o) {
    var s = e(i, {
        __constructor: function(t) {
            this._attributes = t || {},
            this._properties = {}
        },
        destruct: function() {
            this.offAll(),
            Object.keys(this._properties).forEach(function(t) {
                this._properties[t].destruct()
            }, this),
            this._properties = null ,
            this._attributes = null
        },
        set: function(t, e) {
            var i;
            "string" == typeof t ? (i = {},
            i[t] = e) : i = t,
            this._set(i)
        },
        assign: function(t) {
            var e = this._attributes
              , i = n({}, t)
              , o = Object.prototype.hasOwnProperty;
            Object.keys(e).forEach(function(t) {
                o.call(i, t) || (i[t] = void 0)
            }),
            this._set(i)
        },
        get: function(t) {
            return this._attributes[t]
        },
        toJson: function() {
            return this._attributes
        },
        has: function(t) {
            return void 0 !== this._attributes[t]
        },
        remove: function(t) {
            var e = {};
            "string" == typeof t ? e[t] = void 0 : t.forEach(function(t) {
                e[t] = void 0
            }),
            this._set(e)
        },
        property: function(t) {
            var e = this._properties[t];
            return e || (this._properties[t] = e = new o(this,t)),
            e
        },
        _set: function(t) {
            var e = !1
              , i = {};
            Object.keys(t).forEach(function(n) {
                var o = this._attributes[n]
                  , s = t[n];
                o !== s && (e = !0,
                i[n] = s,
                this._attributes[n] = s,
                void 0 === s ? (delete this._attributes[n],
                this.emit("remove-" + n)) : void 0 !== o ? this.emit("update-" + n, s) : this.emit("add-" + n, s),
                this.emit("change-" + n, s))
            }, this),
            e && this.emit("change", i)
        }
    });
    t(s)
}),
modules.define("y-event-emitter", ["inherit"], function(t, e) {
    var i = Array.prototype.slice
      , n = e({
        on: function(t, e, i) {
            if ("function" != typeof e)
                throw new Error("YEventEmitter#on(): `callback` must be a function.");
            this._events || (this._events = {});
            var n = {
                callback: e,
                context: i
            }
              , o = this._events[t];
            return o ? o.push(n) : (this._events[t] = [n],
            this._onAddEvent(t)),
            this
        },
        once: function(t, e, i) {
            function n() {
                o.off(t, n, i),
                e.apply(i, arguments)
            }
            if ("function" != typeof e)
                throw new Error("YEventEmitter#once(): `callback` must be a function.");
            var o = this;
            return n._callback = e,
            this.on(t, n, i),
            this
        },
        off: function(t, e, i) {
            if ("function" != typeof e)
                throw new Error("YEventEmitter#off(): `callback` must be a function.");
            if (!this._events)
                return this;
            var n = this._events[t];
            if (!n)
                return this;
            for (var o = n.length, s = 0; o > s; s++) {
                var r = n[s]
                  , a = r.callback;
                if ((a === e || a._callback === e) && r.context === i) {
                    1 === o ? (delete this._events[t],
                    this._onRemoveEvent(t)) : n.splice(s, 1);
                    break
                }
            }
            return this
        },
        offAll: function(t) {
            if (this._events)
                if (t)
                    this._events[t] && (delete this._events[t],
                    this._onRemoveEvent(t));
                else {
                    for (t in this._events)
                        this._events.hasOwnProperty(t) && this._onRemoveEvent(t);
                    delete this._events
                }
            return this
        },
        emit: function(t) {
            if (!this._events)
                return this;
            var e = this._events[t];
            if (!e)
                return this;
            var n, o = e.slice(0), s = o.length, r = -1;
            switch (arguments.length) {
            case 1:
                for (; ++r < s; )
                    n = o[r],
                    n.callback.call(n.context);
                break;
            case 2:
                for (; ++r < s; )
                    n = o[r],
                    n.callback.call(n.context, arguments[1]);
                break;
            case 3:
                for (; ++r < s; )
                    n = o[r],
                    n.callback.call(n.context, arguments[1], arguments[2]);
                break;
            default:
                for (var a = i.call(arguments, 1); ++r < s; )
                    n = o[r],
                    n.callback.apply(n.context, a)
            }
            return this
        },
        _onAddEvent: function() {},
        _onRemoveEvent: function() {}
    });
    t(n)
}),
modules.define("y-extend", function(t) {
    function e(t) {
        return !("[object Object]" !== n.call(t) || t.nodeType || t.window === window)
    }
    var i = Object.prototype.hasOwnProperty
      , n = Object.prototype.toString;
    t(function o() {
        var t, n, s = arguments[0];
        for ("boolean" == typeof s ? (t = s,
        s = arguments[1],
        n = 2) : (t = !1,
        n = 1); n < arguments.length; n++) {
            var r = arguments[n];
            if (r)
                for (var a in r)
                    if (i.call(r, a)) {
                        var c = r[a]
                          , h = !1;
                        if (t && c && (e(c) || (h = Array.isArray(c)))) {
                            var l, u = s[a];
                            l = h ? u && Array.isArray(u) ? u : [] : u && e(u) ? u : {},
                            s[a] = o(t, l, c)
                        } else
                            s[a] = c
                    }
        }
        return s
    })
}),
modules.define("model-property", ["inherit", "property"], function(t, e, i) {
    var n = e(i, {
        __constructor: function(t, e) {
            this._model = t,
            this._attrName = e,
            this._model.on("change-" + e, this._changeHandler, this)
        },
        destruct: function() {
            this._model.off("change-" + this._attrName, this._changeHandler, this),
            this._model = null
        },
        get: function() {
            return this._model.get(this._attrName)
        },
        set: function(t) {
            this._model.set(this._attrName, t)
        },
        _changeHandler: function(t) {
            this.emit("change", t)
        }
    });
    t(n)
}),
modules.define("property", ["inherit", "y-event-emitter"], function(t, e, i) {
    var n = e(i, {
        get: function() {
            return null
        },
        set: function() {},
        destruct: function() {}
    });
    t(n)
}),
modules.define("scheme-controller", ["inherit", "model", "scheme-view", "zoom-control", "title", "from-to-suggest", "routing-hint", "route-list", "route-details-block", "route-permalink-block", "adv-block", "notification-view", "sidebar", "router", "find-boarding-positions", "metro-location", "content-provider", "config", "statcount"], function(t, e, i, n, o, s, r, a, c, h, l, u, d, m, _, f, p, g, v, b) {
    var y = 10
      , w = e({
        __constructor: function() {
            var t = document.body;
            this._schemeView = n.find(t),
            this._suggest = r.find(t),
            this._zoomControl = o.find(t),
            this._routingHint = a.find(t),
            this._routeList = c.find(t),
            this._routeDetailsBlock = h.find(t),
            this._routePermalinkBlock = l.find(t),
            this._notificationView = d.find(t),
            this._titleBlock = s.find(t);
            var e = this._schemeModel = new i;
            this._resetModel(),
            this._schemeView.init(e, v),
            this._suggest.init(e),
            this._zoomControl.init(e),
            this._routingHint.init(e),
            this._routeList.init(e),
            this._routeDetailsBlock.init(e),
            this._routePermalinkBlock.init(e),
            p.setRoutingProperties(e),
            this._router = new _,
            this._active = !1,
            this._routeBuilt = !1
        },
        setScheme: function(t) {
            this._resetModel(),
            this._deactivate(),
            this._suggest.setStations(t.getStationArray()),
            this._schemeView.loadScheme(t),
            this._activate(),
            g.loadNotifications(t).then(function() {
                this._notificationView.showNotifications(t.getNotifications()),
                this._resizeAdvBlock(),
                this._resizeDetailsBlock()
            }
            .bind(this)),
            p.areRoutingParamsSet() || this._showAdvBlock()
        },
        _createAdvBlock: function() {
            var t = new u
              , e = m.find(document);
            return t.getDomNode().appendTo(e.getDomNode()),
            t
        },
        _showAdvBlock: function() {
            var t = this._advBlock;
            t || (t = this._advBlock = this._createAdvBlock()),
            this._resizeAdvBlock(),
            t.render().then(function() {
                t.show()
            }).fail(function() {
                t.hide()
            })
        },
        _resetModel: function() {
            var t = this._schemeModel;
            t.set("route-array", null ),
            t.set("selected-route", null ),
            t.set("initial-selected-route-index", 0),
            t.set("from-station", null ),
            t.set("to-station", null ),
            t.set("no-route-found", !1)
        },
        _activate: function() {
            this._active || (this._schemeModel.on("change-from-station", this._onChangeSelectedStation, this),
            this._schemeModel.on("change-to-station", this._onChangeSelectedStation, this),
            this._schemeModel.on("change-selected-route", this._onChangeSelectedRoute, this),
            this._schemeView.on("viewport-dimensions-changed", this._onViewportDimensionsChanged, this),
            this._routeList.on("shown", this._onShownRouteList, this),
            this._schemeView.activate(),
            this._suggest.activate(),
            this._routeList.activate(),
            this._active = !0)
        },
        _deactivate: function() {
            this._active && (this._schemeModel.off("change-from-station", this._onChangeSelectedStation, this),
            this._schemeModel.off("change-to-station", this._onChangeSelectedStation, this),
            this._schemeModel.off("change-selected-route", this._onChangeSelectedRoute, this),
            this._schemeView.off("viewport-dimensions-changed", this._onViewportDimensionsChanged, this),
            this._routeList.off("shown", this._onShownRouteList, this),
            this._schemeView.deactivate(),
            this._suggest.deactivate(),
            this._routeList.deactivate(),
            this._active = !1)
        },
        _onChangeSelectedRoute: function(t) {
            t && this._advBlock && this._advBlock.hide()
        },
        _onShownRouteList: function() {
            this._resizeDetailsBlock()
        },
        _onViewportDimensionsChanged: function() {
            this._routeDetailsBlock.isHidden() || this._resizeDetailsBlock(),
            this._advBlock && !this._advBlock.isHidden() && this._resizeAdvBlock()
        },
        _resizeDetailsBlock: function() {
            var t = this._schemeView.getDomNode().innerHeight()
              , e = this._titleBlock.getDomNode().outerHeight()
              , i = this._suggest.getDomNode().outerHeight()
              , n = this._routePermalinkBlock.getDomNode().outerHeight()
              , o = this._routeList.getDomNode().outerHeight()
              , s = this._notificationView.isHidden() ? 0 : this._notificationView.getDomNode().outerHeight();
            this._routeDetailsBlock.setMaxHeight(t - e - i - o - n - s - 2 * y)
        },
        _resizeAdvBlock: function() {
            if (this._advBlock) {
                var t = this._schemeView.getDomNode().innerHeight()
                  , e = this._titleBlock.getDomNode().outerHeight()
                  , i = this._suggest.getDomNode().outerHeight()
                  , n = this._routingHint.getDomNode().outerHeight()
                  , o = this._notificationView.isHidden() ? 0 : this._notificationView.getDomNode().outerHeight();
                this._advBlock.setMaxHeight(t - e - i - n - o - 3 * y)
            }
        },
        _onChangeSelectedStation: function() {
            var t = this._schemeModel
              , e = t.get("from-station")
              , i = t.get("to-station");
            if (e && i) {
                if (t.set("selected-route", null ),
                e.isClosed())
                    return void t.set("from-station", null );
                if (i.isClosed())
                    return void t.set("to-station", null );
                var n = this._router.findRoutes(e, i);
                n && n.length ? (this._sendRouteStatistic(),
                n.forEach(function(t) {
                    var e = f(t);
                    t.setBoardingPositions(e)
                }),
                t.set("route-array", n),
                t.set("selected-route", n[this._getInitialSelectedIndex()]),
                t.set("initial-selected-route-index", 0)) : t.set("no-route-found", !0)
            } else
                t.set("selected-route", null ),
                t.set("route-array", null ),
                t.set("no-route-found", !1)
        },
        _sendRouteStatistic: function() {
            this._routeBuilt || p.areRoutingParamsSet() || (b({
                router: "route-built"
            }),
            this._routeBuilt = !0)
        },
        _getInitialSelectedIndex: function() {
            var t = this._schemeModel
              , e = t.get("initial-selected-route-index")
              , i = t.get("route-array");
            return i.length > e ? e : i.length - 1
        }
    });
    t(w)
}),
modules.define("scheme-view", ["inherit", "y-block", "y-popup", "scheme-view-popup", "jquery", "svg-tools", "ymaps", "scheme-layer", "hotspot-manager", "statcount", "y-throttle"], function(t, e, i, n, o, s, r, a, c, h, l, u) {
    var d = "selected-label"
      , m = "selected-from-label"
      , _ = "selected-to-label"
      , f = "highlighted-label"
      , p = 50
      , g = 300
      , v = 50
      , b = 10
      , y = .2
      , w = 200
      , k = 700
      , S = 50
      , C = "linear"
      , P = 1024
      , x = [512, 512]
      , I = [2.25, 2, 1.75, 1.5]
      , T = 1
      , E = 3
      , N = "#fff"
      , D = .7;
    t(e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._containerDomNode = this._findElement("container"),
            this._spinnerDomNode = this._findElement("spinner"),
            this._hasHighlightedRoute = !1,
            this._active = !1,
            this._bindTo(s(window), "resize", this._handleWindowResize);
            var t = window.navigator.userAgent.toLowerCase();
            this._browserHasScalingArtifacts = -1 !== t.indexOf("firefox") || -1 !== t.indexOf("opera") && -1 !== t.indexOf("12.16");
            var e = this._getOptions()["zoom-settings"];
            this._minZoom = e.minZoom,
            this._maxZoom = e.maxZoom,
            this._zoomStep = e.zoomStep,
            this._browserIsIE = -1 !== t.indexOf("trident")
        },
        init: function(t, e) {
            this._zoomLevelProperty = t.property("zoom-level"),
            this._fromStationProperty = t.property("from-station"),
            this._toStationProperty = t.property("to-station"),
            this._selectedRouteProperty = t.property("selected-route"),
            this._routeArrayProperty = t.property("route-array"),
            this._noRouteFoundProperty = t.property("no-route-found"),
            this._mapWheelCallback = e.isInternal ? u(this._handleMapWheelInternal, v) : this._handleMapWheel,
            this._schemeViewPopup = new o({
                showArrow: !1,
                padding: 0,
                position: "bottom-right"
            })
        },
        loadScheme: function(t) {
            this._spinnerDomNode.show(),
            this._scheme = t;
            var e = t.getCanvasSize();
            this._imageWidth = e.width,
            this._imageHeight = e.height,
            this._updateViewportDimensions(),
            this._map || (this._createMap(),
            this._hotspotManager = new h(this._map)),
            this._updateMapBounds(),
            this._mapSchemeLayer.hideContent(),
            this._loadImage(t.getImage()),
            this._mapImageDomNodes(t),
            this._renderLabelBackgrounds(),
            this._spinnerDomNode.hide();
            var i = this._getInitialZoomLevel(this._mapViewportWidth, this._mapViewportHeight, this._imageWidth, this._imageHeight);
            this._map.setZoom(i),
            this._zoomLevelProperty.set(i),
            this._setMapCenter(t.getCanvasCenter(), i, !0),
            this._currZoom = 0,
            this._currScaleRatio = 0,
            this._currOffset = {
                top: 0,
                left: 0
            },
            this._scaleAndOffsetImage(),
            this._browserHasScalingArtifacts && this._removeScalingArtifacts(),
            this._hotspotManager.update(this._currScaleRatio),
            this._mapSchemeLayer.showContent(k)
        },
        _renderLabelBackgrounds: function() {
            var t = this._scheme;
            t.getLabelArray().forEach(function(t) {
                var e = t.getId()
                  , i = this._domMap.labels[e]
                  , n = r.getBBox(i)
                  , o = T
                  , s = r.createRect({
                    x: n.x - o,
                    y: n.y - o,
                    width: n.width + 2 * o,
                    height: n.height + 2 * o,
                    rx: E,
                    ry: E,
                    fill: N,
                    opacity: D
                });
                r.prepend(i, s)
            }, this)
        },
        _getInitialZoomLevel: function(t, e, i, n) {
            var o = this._defaultZoom;
            return I.some(function(s) {
                var r = this._calculateScaleRatio(s)
                  , a = i * r
                  , c = n * r;
                return o = s,
                t >= a && e >= c
            }, this),
            o
        },
        _setMapCenter: function(t, e, i) {
            if (this._map.setCenter([t.y, t.x], e),
            i) {
                var n = 310
                  , o = -this._mapPane.getOriginOffset()[0]
                  , s = this._mapViewportWidth - n
                  , r = this._map.options.get("projection").toGlobalPixels([t.y, t.x], e)[0] + o
                  , a = n + s / 2 - r;
                a *= this._calculateScaleRatio(e),
                this._map.setCenter([t.y, t.x - a], e)
            }
        },
        _updateViewportDimensions: function() {
            this._mapViewportWidth = this.getDomNode().width(),
            this._mapViewportHeight = this.getDomNode().height(),
            this._containerDomNode.height(this._mapViewportHeight + "px"),
            this._containerDomNode.width(this._mapViewportWidth + "px")
        },
        _createMap: function() {
            this._containerDomNode.empty(),
            this._map = new a.Map(this._containerDomNode[0],{
                behaviors: ["drag", "multiTouch", "dblClickZoom"],
                controls: [],
                type: null ,
                center: x,
                zoom: this._defaultZoom
            },{
                backgroundVisible: !1,
                copyrightLogoVisible: !1,
                maxZoom: this._maxZoom,
                minZoom: this._minZoom,
                autoFitToViewport: "always",
                avoidFractionalZoom: !1,
                projection: new a.projection.Cartesian([[P, 0], [0, P]])
            });
            var t = this._map.behaviors.get("drag");
            t.options.set("tremor", b),
            this._map.panes.get("copyrights").getElement().textContent = "",
            this._mapSchemeLayer = new c,
            this._map.layers.add(this._mapSchemeLayer),
            this._mapPane = this._mapSchemeLayer.getPane(),
            this._map.events.add("wheel", this._handleMapWheelStat, this),
            this._map.events.add("dblclick", this._handleMapDblclickStat, this),
            t.events.add("dragstart", this._handleMapDragStat, this)
        },
        isActive: function() {
            return this._active
        },
        activate: function() {
            this.isActive() || (this._mapPane.events.add("zoomchange", this._handleMapZoomchange, this),
            this._mapPane.events.add("viewportchange", this._handleMapViewportchange, this),
            this._mapPane.events.add("actionend", this._handleMapActionend, this),
            this._map.events.add("wheel", this._mapWheelCallback, this),
            this._map.events.add("mousedown", this._handleMapMousedown, this),
            this._hotspotManager.on("click", this._handleHotspotClick, this),
            this._hotspotManager.on("click", this._handleHotspotStatClick, this),
            this._hotspotManager.on("mouseenter", this._handleHotspotMouseEnter, this),
            this._hotspotManager.on("mouseleave", this._handleHotspotMouseLeave, this),
            this._bindTo(this._zoomLevelProperty, "change", this._handleZoomLevelPropertyChange),
            this._bindTo(this._fromStationProperty, "change", this._handleFromStationPropertyChange),
            this._bindTo(this._toStationProperty, "change", this._handleToStationPropertyChange),
            this._bindTo(this._selectedRouteProperty, "change", this._handleSelectedRoutePropertyChange),
            this._bindTo(this._noRouteFoundProperty, "change", this._handleNoRouteFoundPropertyChange),
            this._bindTo(this._schemeViewPopup, "item-clicked", this._handlePopupItemClicked),
            this._active = !0)
        },
        deactivate: function() {
            this.isActive() && (this._mapPane.events.remove("zoomchange", this._handleMapZoomchange, this),
            this._mapPane.events.remove("viewportchange", this._handleMapViewportchange, this),
            this._mapPane.events.remove("actionend", this._handleMapActionend, this),
            this._map.events.remove("wheel", this._mapWheelCallback, this),
            this._map.events.remove("mousedown", this._handleMapMousedown, this),
            this._hotspotManager.off("click", this._handleHotspotClick, this),
            this._hotspotManager.off("click", this._handleHotspotStatClick, this),
            this._hotspotManager.off("mouseenter", this._handleHotspotMouseEnter, this),
            this._hotspotManager.off("mouseleave", this._handleHotspotMouseLeave, this),
            this._unbindFrom(this._zoomLevelProperty, "change", this._handleZoomLevelPropertyChange),
            this._unbindFrom(this._fromStationProperty, "change", this._handleFromStationPropertyChange),
            this._unbindFrom(this._toStationProperty, "change", this._handleToStationPropertyChange),
            this._unbindFrom(this._selectedRouteProperty, "change", this._handleSelectedRoutePropertyChange),
            this._unbindFrom(this._noRouteFoundProperty, "change", this._handleNoRouteFoundPropertyChange),
            this._unbindFrom(this._schemeViewPopup, "item-clicked", this._handlePopupItemClicked),
            this._active = !1)
        },
        _updateMapBounds: function() {
            var t = this._calculateScaleRatio(this._minZoom)
              , e = this._imageWidth * t
              , i = this._imageHeight * t
              , n = Math.abs(this._mapViewportWidth - e) / t
              , o = Math.abs(this._mapViewportHeight - i) / t;
            this._map.options.set("restrictMapArea", [[-o, -n], [this._imageHeight + o, this._imageWidth + n]])
        },
        _scaleAndOffsetImage: function() {
            this._tryUpdateScaleRatio() && (this._hotspotManager.hideAll(),
            this._schemeViewPopup.hide(),
            this._zoomLevelProperty.set(this._mapPane.getZoom()),
            this._scaleImageDomNode(this._currScaleRatio),
            this._browserHasScalingArtifacts && this._removeScalingArtifacts()),
            this._tryUpdateOffset() && this._offsetImageDomNode(this._currOffset)
        },
        _tryUpdateScaleRatio: function() {
            return this._mapPane.getZoom() === this._currZoom ? !1 : (this._currZoom = this._mapPane.getZoom(),
            this._currScaleRatio = this._calculateScaleRatio(this._currZoom),
            this._currScaleRatio = Math.round(1e3 * this._currScaleRatio) / 1e3,
            !0)
        },
        _tryUpdateOffset: function() {
            var t = this._mapPane.getOriginOffset();
            return this._currOffset.left === -t[0] && this._currOffset.top === -t[1] ? !1 : (this._currOffset.left = -t[0],
            this._currOffset.top = -t[1],
            !0)
        },
        _calculateScaleRatio: function(t) {
            return Math.pow(2, 8 + t) / P
        },
        _scaleImageDomNode: function(t) {
            this._transform.setScale(t, t)
        },
        _offsetImageDomNode: function(t) {
            this._imageDomNode.css("left", t.left),
            this._imageDomNode.css("top", t.top)
        },
        _loadImage: function(t) {
            if (this._mapSchemeLayer.empty(),
            this._mapSchemeLayer.setImageDomNode(t),
            this._imageDomNode = this._mapSchemeLayer.getImageDomNode(),
            this._transform = r.getTransformProperty(this._imageDomNode.find("#transform-wrapper")),
            this._imageDomNode.css("position", "absolute"),
            !this._browserIsIE) {
                var e = this._calculateScaleRatio(this._maxZoom);
                this._imageDomNode.attr("height", this._imageHeight * e),
                this._imageDomNode.attr("width", this._imageWidth * e)
            }
        },
        _mapImageDomNodes: function() {
            this._schemeLayer = this._imageDomNode.find("#scheme-layer"),
            this._sLinksDomNode = this._imageDomNode.find("#scheme-layer-links"),
            this._sLabelsDomNode = this._imageDomNode.find("#scheme-layer-labels"),
            this._sStationsDomNode = this._imageDomNode.find("#scheme-layer-stations"),
            this._sTransfersDomNode = this._imageDomNode.find("#scheme-layer-transfers"),
            this._highlightLayer = this._imageDomNode.find("#highlight-layer"),
            this._hLinksDomNode = this._imageDomNode.find("#highlight-layer-links"),
            this._hLabelsDomNode = this._imageDomNode.find("#highlight-layer-labels"),
            this._hStationsDomNode = this._imageDomNode.find("#highlight-layer-stations"),
            this._hTransfersDomNode = this._imageDomNode.find("#highlight-layer-transfers"),
            this._domMap = {
                stations: {},
                labels: {},
                links: {},
                transfers: {}
            };
            var t = this._scheme
              , e = [];
            t.getStationArray().forEach(function(t) {
                var i = t.getId()
                  , n = t.getLabelId();
                this._domMap.stations[i] = this._imageDomNode.find("#station-" + i),
                e.push({
                    bBox: r.getBBox(this._domMap.stations[i]),
                    data: {
                        id: i,
                        type: "station",
                        labelId: n
                    }
                }),
                this._domMap.stations[i].removeAttr("id")
            }, this),
            t.getLabelArray().forEach(function(t) {
                var i = t.getId();
                this._domMap.labels[i] = this._imageDomNode.find("#label-" + i),
                e.push({
                    bBox: r.getBBox(this._domMap.labels[i]),
                    data: {
                        id: i,
                        type: "label",
                        labelId: i
                    }
                }),
                this._domMap.labels[i].removeAttr("id")
            }, this),
            this._hotspotManager.removeAll(),
            this._hotspotManager.setActiveObjects(e),
            this._hotspotManager.update(this._currScaleRatio),
            t.getLinkArray().forEach(function(t) {
                var e = t.getId();
                this._domMap.links[e] = this._imageDomNode.find("#link-" + e),
                this._domMap.links[e] && this._domMap.links[e].removeAttr("id")
            }, this),
            t.getTransferArray().forEach(function(t) {
                var e = t.getId();
                this._domMap.transfers[e] = this._imageDomNode.find("#transfer-" + e),
                this._domMap.transfers[e].removeAttr("id")
            }, this)
        },
        _handleWindowResize: function() {
            this._updateViewportDimensions(),
            this._map && this._updateMapBounds(),
            this.emit("viewport-dimensions-changed")
        },
        _handleHotspotClick: function(t) {
            if ("label" === t.type) {
                var e = this._scheme.getLabelById(t.id);
                if (e.isMultiStation()) {
                    var i = this._processLabelStations(e.getStations());
                    i.length > 1 ? this._schemeViewPopup.showAt(this._domMap.labels[e.getId()], i) : 1 === i.length && this._selectStation(i[0])
                } else
                    this._selectStation(e.getStations()[0])
            } else
                this._selectStationId(t.id)
        },
        _handleHotspotStatClick: function(t) {
            l("label" === t.type ? {
                "scheme-view": {
                    "station-selected": "label"
                }
            } : {
                "scheme-view": {
                    "station-selected": "icon"
                }
            })
        },
        _selectStationId: function(t) {
            this._selectStation(this._scheme.getStationById(t))
        },
        _selectStation: function(t) {
            var e = this._fromStationProperty
              , i = this._toStationProperty
              , n = e.get()
              , o = i.get()
              , s = t.getId();
            return t.isClosed() ? void (t.getHint() && this._showInfoPopup(this._domMap.labels[t.getLabelId()], t.getHint())) : void (n && n.getId() === s || o && o.getId() === s || ((n || o) && n ? o ? i.set(t) : i.set(t) : e.set(t)))
        },
        _processLabelStations: function(t) {
            var e = this._fromStationProperty.get()
              , i = this._toStationProperty.get()
              , n = t.filter(function(t) {
                return !(e && e.getId() === t.getId() || i && i.getId() === t.getId())
            });
            return n.length < 2 ? n : this._sortStationsVertically(n)
        },
        _sortStationsVertically: function(t) {
            var e = this._domMap.stations;
            return t.sort(function(t, i) {
                return r.getBBox(e[t.getId()]).y - r.getBBox(e[i.getId()]).y
            })
        },
        _handleSelectedRoutePropertyChange: function(t) {
            this._hasHighlightedRoute && !t && (this.clearRoute(),
            this._map.events.remove("click", this._handleMapClick, this)),
            this._hasHighlightedRoute && t && (this._flushHighlightedLayer(),
            this.drawRoute(t)),
            !this._hasHighlightedRoute && t && (this.drawRoute(t),
            this._hotspotManager.hideAll(),
            this._map.events.add("click", this._handleMapClick, this))
        },
        _handleNoRouteFoundPropertyChange: function(t) {
            t ? (this._hotspotManager.hideAll(),
            this._map.events.add("click", this._handleMapClick, this)) : (this._hotspotManager.update(this._currScaleRatio),
            this._map.events.remove("click", this._handleMapClick, this))
        },
        _handlePopupItemClicked: function(t) {
            this._selectStationId(t.target.getId()),
            this._schemeViewPopup.hide()
        },
        _handleHotspotMouseEnter: function(t) {
            r.addClass(this._domMap.labels[t.labelId], f)
        },
        _handleHotspotMouseLeave: function(t) {
            r.removeClass(this._domMap.labels[t.labelId], f)
        },
        _handleMapZoomchange: function() {
            this._scaleAndOffsetImage()
        },
        _handleMapViewportchange: function() {
            this._scaleAndOffsetImage()
        },
        _handleMapActionend: function() {
            this._scaleAndOffsetImage(),
            this._hasHighlightedRoute || this._hotspotManager.update(this._currScaleRatio)
        },
        _handleMapClick: function() {
            this._clickTimeout ? this._isSingleClick = !1 : (this._isSingleClick = !0,
            this._clickTimeout = setTimeout(function() {
                this._isSingleClick && (this._fromStationProperty.set(null ),
                this._toStationProperty.set(null ),
                this._selectedRouteProperty.set(null ),
                this._routeArrayProperty.set(null )),
                this._clickTimeout = null
            }
            .bind(this), g))
        },
        _handleMapWheelStat: function() {
            l({
                "scheme-view": "mouse-wheel-used"
            }),
            this._map.events.remove("wheel", this._handleMapWheelStat, this)
        },
        _handleMapDragStat: function() {
            l({
                "scheme-view": "dragged"
            }),
            this._map.behaviors.get("drag").events.remove("dragstart", this._handleMapDragStat, this)
        },
        _handleMapDblclickStat: function() {
            l({
                "scheme-view": "double-clicked"
            }),
            this._map.events.remove("dblclick", this._handleMapDblclickStat, this)
        },
        _handleMapWheel: function(t) {
            if (!this._map.action.getCurrentState().isTicking) {
                var e = t.get("delta") < 0 ? -1 : 1
                  , i = Math.max(Math.min(this._map.getZoom() + this._zoomStep * e, this._map.options.get("maxZoom")), this._map.options.get("minZoom"));
                if (Math.abs(i - this._map.getZoom()) > 1e-7) {
                    var n = this._map.options.get("projection").toGlobalPixels(t.get("coords"), this._map.getZoom());
                    this._setMapZoom(i, n)
                }
            }
        },
        _handleMapWheelInternal: function(t) {
            if (!this._map.action.getCurrentState().isTicking) {
                var e = t.get("deltaY")
                  , i = this._map.getGlobalPixelCenter()
                  , n = p;
                if (0 !== e) {
                    var o = 0 > e ? -1 : 1;
                    i[1] -= n * o * this._currScaleRatio,
                    this._map.setGlobalPixelCenter(i),
                    t.getSourceEvent().preventDefault()
                }
            }
        },
        _handleMapMousedown: function() {
            this._schemeViewPopup.hide(),
            this._hideInfoPopup()
        },
        _handleFromStationPropertyChange: function(t) {
            this._changeSelectedStation(t, m)
        },
        _handleToStationPropertyChange: function(t) {
            this._changeSelectedStation(t, _)
        },
        _changeSelectedStation: function(t, e) {
            var i = this._containerDomNode.find("." + e);
            if (r.removeClass(i, e),
            r.removeClass(i, d),
            t && this._domMap.labels[t.getLabelId()]) {
                var n = this._domMap.labels[t.getLabelId()];
                r.addClass(n, e),
                r.addClass(n, d)
            }
        },
        _handleZoomLevelPropertyChange: function(t) {
            t !== this._mapPane.getZoom() && this._setMapZoom(t)
        },
        _animateMapZoom: function(t, e) {
            this._map.setGlobalPixelCenter(t, e, {
                duration: S,
                timingFunction: C
            })
        },
        _setMapZoom: function(t, e) {
            var i = this._map.action.getCurrentState().globalPixelCenter;
            e = e || i;
            var n = t - this._map.getZoom()
              , o = Math.pow(2, n)
              , s = this._fixedToCenter(i, e, o);
            this._map.setGlobalPixelCenter(s, t)
        },
        _removeScalingArtifacts: function() {
            r.append(this._schemeLayer, this._sLabelsDomNode),
            this._hasHighlightedRoute && r.append(this._highlightLayer, this._hLabelsDomNode)
        },
        _fixedToCenter: function(t, e, i) {
            var n = (i - 1) / i
              , o = [(e[0] - t[0]) * n, (e[1] - t[1]) * n];
            return [(t[0] + o[0]) * i, (t[1] + o[1]) * i]
        },
        markLabelAsSelected: function(t) {
            r.addClass(this._domMap.labels[t.getLabelId()], d)
        },
        markLabelAsNotSelected: function(t) {
            r.removeClass(this._domMap.labels[t.getLabelId()], d)
        },
        flushSelectedLabels: function() {
            r.removeClass(this._containerDomNode.find("." + d), d)
        },
        _flushHighlightedLabels: function() {
            r.removeClass(this._containerDomNode.find("." + f), f)
        },
        drawRoute: function(t) {
            this._flushHighlightedLayer(),
            this._dimSchemeLayer(),
            this._flushHighlightedLabels(),
            t.getStations().forEach(function(t) {
                r.append(this._hStationsDomNode, this._domMap.stations[t.getId()]),
                r.append(this._hLabelsDomNode, this._domMap.labels[t.getLabelId()])
            }, this),
            t.getLinks().forEach(function(t) {
                t.isTransfer() ? r.append(this._hTransfersDomNode, this._domMap.transfers[t.getTransferId()]) : r.append(this._hLinksDomNode, this._domMap.links[t.getId()])
            }, this),
            this._hasHighlightedRoute = !0
        },
        clearRoute: function() {
            this._undimSchemeLayer(),
            this._flushHighlightedLayer(),
            this._hotspotManager.update(this._currScaleRatio),
            this._hasHighlightedRoute = !1
        },
        _dimSchemeLayer: function() {
            this._schemeLayer.fadeTo(w, y)
        },
        _undimSchemeLayer: function() {
            this._schemeLayer.fadeTo(w, 1)
        },
        _flushHighlightedLayer: function() {
            r.moveChildren(this._hLinksDomNode, this._sLinksDomNode),
            r.moveChildren(this._hStationsDomNode, this._sStationsDomNode),
            r.moveChildren(this._hLabelsDomNode, this._sLabelsDomNode),
            r.moveChildren(this._hTransfersDomNode, this._sTransfersDomNode)
        },
        _showInfoPopup: function(t, e) {
            this._infoPopup || (this._infoPopup = new n({
                showArrow: !1,
                position: "bottom-right"
            })),
            this._infoPopup.showAt(t),
            this._infoPopup.setContent(e)
        },
        _hideInfoPopup: function() {
            this._infoPopup && this._infoPopup.isShown() && this._infoPopup.hide()
        }
    }, {
        getBlockName: function() {
            return "scheme-view"
        }
    }))
}),
modules.define("y-block", ["inherit", "y-event-emitter", "y-event-manager", "y-block-event", "jquery", "vow", "bt", "y-extend"], function(t, e, i, n, o, s, r, a, c) {
    function h(t) {
        return "string" == typeof t ? "" === t && (t = !1) : t = "number" == typeof t ? String(t) : Boolean(t),
        t
    }
    var l = e(i, {
        __constructor: function(t, e) {
            null === t || t instanceof s || (e = t,
            t = null ),
            t || (e = e || {},
            t = this._createBlockDomNode(e)),
            e ? e.__complete || (e = c(e, this.__self._getDomNodeOptions(t).options || {})) : e = this.__self._getDomNodeOptions(t).options || {},
            t.addClass(this.__self._autoInitCssClass),
            this.__self._getDomNodeDataStorage(t).block = this,
            this._initOptions = e,
            this._node = t,
            this._eventManager = new n(this),
            this._stateCache = null ,
            this.__self._liveInitIfRequired(),
            this._cachedViewName = null
        },
        destruct: function() {
            var t;
            if (this._node && (t = this.__self._getDomNodeDataStorage(this._node)),
            !t || !t.block)
                throw new Error("Block `" + this.__self.getBlockName() + "` was already destroyed");
            delete t.block,
            this.__self.destructDomTree(this.getDomNode()),
            this.offAll(),
            this._eventManager.unbindAll(),
            this._eventManager = null ,
            this._node.remove(),
            this._node = null ,
            this._initOptions = null ,
            this._stateCache = null
        },
        getDomNode: function() {
            return this._node
        },
        _bindTo: function(t, e, i) {
            return this._eventManager.bindTo(t, e, i),
            this
        },
        _unbindFrom: function(t, e, i) {
            return this._eventManager.unbindFrom(t, e, i),
            this
        },
        emit: function(t, e) {
            if ("string" == typeof t && (t = new o(t)),
            t.data = e,
            t.target = this,
            this.__base(t.type, t),
            !t.isPropagationStopped()) {
                var i = s.Event(this.__self._getPropagationEventName(t.type));
                t._jqEvent = i;
                var n = this.getDomNode();
                n && this.getDomNode().trigger(i, t)
            }
            return this
        },
        _proxyEvent: function(t, e, i) {
            if (!(t instanceof l))
                throw new Error("YBlock#_proxyEvent(): The first argument should be an instance of `YBlock`");
            this._bindTo(t, e, function(t) {
                i && (e = i),
                this.emit(e, t.data)
            })
        },
        getView: function() {
            if (null === this._cachedViewName) {
                var t = this.getDomNode().attr("class");
                t ? this._cachedViewName = t.split(" ").shift().split("_")[1] : this._cachedViewName = void 0
            }
            return this._cachedViewName
        },
        _setState: function(t, e) {
            1 === arguments.length && (e = !0),
            e = h(e);
            var i = this.getDomNode();
            this._stateCache || (this._stateCache = this._parseStateCssClasses(i));
            var n = this._stateCache[t] || !1;
            return e !== n && (this._stateCache[t] = e,
            n && i.removeClass("_" + t + (n === !0 ? "" : "_" + n)),
            e && i.addClass("_" + t + (e === !0 ? "" : "_" + e))),
            this
        },
        _removeState: function(t) {
            return this._setState(t, !1)
        },
        _getState: function(t) {
            return this._stateCache || (this._stateCache = this._parseStateCssClasses(this.getDomNode())),
            this._stateCache[t] || !1
        },
        _toggleState: function(t, e, i) {
            e = h(e),
            i = h(i);
            var n = this._getState(t);
            return n === e ? this._setState(t, i) : n === i && this._setState(t, e),
            this
        },
        _setElementState: function(t, e, i) {
            if (!t)
                throw new Error("`domNode` should be specified for `_setElementState` method.");
            t = s(t),
            2 === arguments.length && (i = !0),
            i = h(i);
            var n = this._parseStateCssClasses(t)
              , o = n[e];
            return o && t.removeClass("_" + e + (o === !0 ? "" : "_" + o)),
            i && t.addClass("_" + e + (i === !0 ? "" : "_" + i)),
            this
        },
        _removeElementState: function(t, e) {
            return this._setElementState(t, e, !1)
        },
        _getElementState: function(t, e) {
            if (t)
                return t = s(t),
                this._parseStateCssClasses(t)[e] || !1;
            throw new Error("`domNode` should be specified for `_getElementState` method.")
        },
        _toggleElementState: function(t, e, i, n) {
            i = h(i),
            n = h(n);
            var o = this._getElementState(t, e);
            return o === i ? this._setElementState(t, e, n) : o === n && this._setElementState(t, e, i),
            this
        },
        _findElement: function(t, e) {
            return this._findAllElements(t, e)[0]
        },
        _findAllElements: function(t, e) {
            e = e ? s(e) : this.getDomNode();
            for (var i = this.getView(), n = e.find("." + this.__self.getBlockName() + (i ? "_" + i : "") + "__" + t), o = [], r = n.length, a = 0; r > a; a++)
                o.push(s(n[a]));
            return o
        },
        _findAllParentElements: function(t, e) {
            if (e) {
                e = s(e);
                for (var i = this.getView(), n = e.parents("." + this.__self.getBlockName() + (i ? "_" + i : "") + "__" + t), o = [], r = n.length, a = 0; r > a; a++)
                    o.push(s(n[a]));
                return o
            }
            throw new Error("`childElement` should be specified for `_findAllParentElements` method.")
        },
        _findParentElement: function(t, e) {
            if (e)
                return this._findAllParentElements(t, e)[0];
            throw new Error("`childElement` should be specified for `_findParentElement` method.")
        },
        _createElement: function(t) {
            return "string" == typeof t && (t = {
                elem: t
            }),
            s(a.apply(c({
                view: this.getView()
            }, t, {
                block: this.__self.getBlockName()
            })))
        },
        _getOptions: function() {
            return this._initOptions
        },
        _getElementOptions: function(t) {
            if (t) {
                t = s(t);
                var e = this._getElementName(t);
                if (e)
                    return this.__self._getDomNodeOptions(t).options || {};
                throw new Error("Unable to get BEM Element name from DOM Node.")
            }
            throw new Error("`domNode` should be specified for `_getElementOptions` method.")
        },
        _createBlockDomNode: function(t) {
            return s(a.apply(c({}, t, {
                block: this.__self.getBlockName()
            })))
        },
        _parseStateCssClasses: function(t) {
            var e = {}
              , i = t.attr("class");
            if (i)
                for (var n = i.split(" "), o = n.length - 1; o >= 0; o--)
                    if ("_" === n[o].charAt(0)) {
                        var s = n[o].substr(1).split("_");
                        2 === s.length ? e[s[0]] = s[1] : e[s[0]] = !0
                    }
            return e
        },
        _getElementName: function(t) {
            var e = this.getView()
              , i = (t[0].className || "").match(new RegExp(this.__self.getBlockName() + (e ? "_" + e : "") + "__([a-zA-Z0-9-]+)(?:\\s|$)"));
            return i ? i[1] : null
        }
    }, {
        getBlockName: function() {
            return "y-block"
        },
        fromDomNode: function(t, e) {
            if (!t)
                throw new Error("`domNode` should be specified for `findDomNode` method");
            var i = this.getBlockName();
            if (t = s(t),
            !t.length)
                throw new Error('Cannot initialize "' + i + '" from empty jQuery object');
            var n = this._getDomNodeDataStorage(t).block;
            if (!n) {
                void 0 === e && (e = this._getDomNodeOptions(t).options || {}),
                e.__complete = !0;
                var o = this;
                n = new o(t,e)
            }
            return n
        },
        initOnDomNode: function(t, e) {
            var i;
            if (this._liveInit) {
                if (this._liveInitIfRequired(),
                i = !1,
                this._instantInitHandlers)
                    for (var n = 0, o = this._instantInitHandlers.length; o > n; n++)
                        if (this._instantInitHandlers[n](e, t)) {
                            i = !0;
                            break
                        }
            } else
                i = !0;
            return i ? (t = s(t),
            this.fromDomNode(t, e)) : null
        },
        _liveInitIfRequired: function() {
            var t = this.getBlockName();
            !this._liveInit || this._liveInitialized && this._liveInitialized[t] || (this._liveInit(),
            (this._liveInitialized = this._liveInitialized || {})[t] = !0)
        },
        _liveInit: null ,
        _instantInitIf: function(t) {
            this._instantInitHandlers || (this._instantInitHandlers = []),
            this._instantInitHandlers.push(t)
        },
        _liveBind: function(t, e) {
            var i = this;
            this._getLiveEventsScopeElement().on(t, '[data-block="' + this.getBlockName() + '"]', function(t) {
                e.call(i.fromDomNode(t.currentTarget), t)
            })
        },
        _liveBindToElement: function(t, e, i) {
            var n = this
              , o = this.getBlockName()
              , r = ['[class^="' + o + '_"][class$="__' + t + '"]', '[class^="' + o + '_"][class*="__' + t + ' "]'];
            this._getLiveEventsScopeElement().on(e, r.join(", "), function(t) {
                i.call(n.fromDomNode(s(t.currentTarget).closest('[data-block="' + o + '"]')), t)
            })
        },
        _getLiveEventsScopeElement: function() {
            return s(document.body)
        },
        find: function(t) {
            return this.findAll(t)[0]
        },
        findAll: function(t) {
            if (!t)
                throw new Error("`parentElement` should be specified for `findAll` method");
            t = this._getDomNodeFrom(t);
            var e = t.find("[data-block=" + this.getBlockName() + "]");
            if (e.length) {
                for (var i = [], n = e.length, o = 0; n > o; o++) {
                    var r = s(e[o]);
                    i.push(this.fromDomNode(r))
                }
                return i
            }
            return []
        },
        initDomTree: function(t) {
            function e(t) {
                var e = r.defer();
                return modules.isDefined(t) ? (modules.require([t], function(i) {
                    n[t] = i,
                    e.resolve()
                }),
                e.promise()) : null
            }
            if (!t)
                throw new Error("`domNode` should be specified for `initDomTree` method");
            t = this._getDomNodeFrom(t);
            var i = "." + this._autoInitCssClass
              , n = {}
              , o = t.find(i);
            t.is(i) && Array.prototype.unshift.call(o, t);
            for (var a = [], c = o.length, h = 0; c > h; h++) {
                var l = s(o[h])
                  , u = this._getDomNodeOptions(l) || {}
                  , d = l.attr("data-block");
                if (d) {
                    a.push({
                        node: l,
                        className: d,
                        options: u.options || {},
                        isMixin: !1
                    }),
                    n[d] = null ;
                    var m = u.mixins;
                    if (m)
                        for (var _ = 0, f = m.length; f > _; _++) {
                            var p = m[_];
                            p && p.name && (a.push({
                                node: l,
                                className: p.name,
                                blockName: d,
                                options: p,
                                isMixin: !0
                            }),
                            n[p.name] = null )
                        }
                }
            }
            return r.fulfill().then(function() {
                return r.all(Object.keys(n).map(function(t) {
                    return e(t)
                })).then(function() {
                    for (var t = a.length, e = 0; t > e; e++) {
                        var i = a[e]
                          , o = i.node
                          , s = i.className
                          , r = i.options
                          , c = n[s];
                        if (c)
                            try {
                                if (i.isMixin) {
                                    var h = n[i.blockName];
                                    h && c.fromBlock(h.fromDomNode(o), r)
                                } else
                                    c.initOnDomNode(o, r)
                            } catch (l) {
                                throw l.message = s + " init error: " + l.message,
                                l
                            }
                    }
                })
            })
        },
        destructDomTree: function(t) {
            if (!t)
                throw new Error("`domNode` should be specified for `destructDomTree` method");
            t = this._getDomNodeFrom(t);
            var e = "." + this._autoInitCssClass + ",." + this._delegateEventsCssClass
              , i = t.find(e);
            t.is(e) && Array.prototype.unshift.call(i, t);
            for (var n = 0; n < i.length; n++) {
                var o = s(i[n])
                  , r = this._getDomNodeDataStorage(o, !0);
                if (r) {
                    r.block && r.block.destruct();
                    var a, c = r.blockEvents;
                    for (a in c)
                        c.hasOwnProperty(a) && c[a].offAll();
                    r.blockEvents = {}
                }
            }
        },
        getEmitter: function(t) {
            t = this._getDomNodeFrom(t);
            var e = this._getDomNodeDataStorage(t)
              , i = this.getBlockName()
              , n = e.blockEvents[i];
            return n || (t.addClass(this._delegateEventsCssClass),
            n = new u(this,t),
            e.blockEvents[i] = n),
            n
        },
        _getDomNodeFrom: function(t) {
            if (!t)
                throw new Error("jQuery element, DOM Element or YBlock instance should be specified");
            return t instanceof l && (t = t.getDomNode()),
            t = s(t)
        },
        _getDomNodeOptions: function(t) {
            var e = t.attr("data-options");
            return e ? JSON.parse(e) : {}
        },
        _getDomNodeDataStorage: function(t, e) {
            var i = t.data("y-block");
            return i || e || (i = {
                blockEvents: {}
            },
            t.data("y-block", i)),
            i
        },
        _getPropagationEventName: function(t) {
            return "y-block/" + this.getBlockName() + "/" + t
        },
        _autoInitCssClass: "_init",
        _delegateEventsCssClass: "_live-events"
    })
      , u = e(i, {
        __constructor: function(t, e) {
            this._blockClass = t,
            this._domNode = e,
            this._listeners = {}
        },
        _onAddEvent: function(t) {
            function e(e, n) {
                i.emit(t, n),
                n.isPropagationStopped() && e.stopPropagation()
            }
            var i = this
              , n = this._blockClass._getPropagationEventName(t);
            this._domNode.on(n, e),
            this._listeners[t] = e
        },
        _onRemoveEvent: function(t) {
            var e = this._blockClass._getPropagationEventName(t);
            this._domNode.off(e, this._listeners[t]),
            delete this._listeners[t]
        }
    });
    t(l)
}),
modules.define("y-event-manager", ["inherit", "y-event-emitter", "jquery"], function(t, e, i, n) {
    var o = e({
        __constructor: function(t) {
            this._owner = t,
            this._listeners = []
        },
        bindTo: function(t, e, o) {
            if (void 0 === t || null === t)
                throw new Error("EventManager#bindTo(): `emitter` must be not be null or undefined.");
            if (t instanceof i)
                this._listeners.push({
                    type: "islets",
                    emitter: t.on(e, o, this._owner),
                    event: e,
                    callback: o
                });
            else {
                if (!(t instanceof n))
                    throw new Error("YEventManager#bindTo(): Unsupported emitter type.");
                var s = o.bind(this._owner);
                this._listeners.push({
                    type: "jquery",
                    emitter: t.on(e, s),
                    event: e,
                    callback: o,
                    proxy: s
                })
            }
            return this
        },
        unbindFrom: function(t, e, i) {
            if (void 0 === t || null === t)
                throw new Error("YEventManager#unbindFrom(): `emitter` must be not be null or undefined.");
            for (var n = 0; n < this._listeners.length; n++) {
                var o = this._listeners[n];
                if (o.emitter === t && o.event === e && o.callback === i) {
                    this._unbind(o),
                    this._listeners.splice(n, 1);
                    break
                }
            }
            return this
        },
        unbindAll: function() {
            for (; this._listeners.length; ) {
                var t = this._listeners.pop();
                this._unbind(t)
            }
            return this
        },
        _unbind: function(t) {
            switch (t.type) {
            case "islets":
                t.emitter.off(t.event, t.callback, this._owner);
                break;
            case "jquery":
                t.emitter.off(t.event, t.proxy)
            }
        }
    });
    t(o)
}),
modules.define("y-block-event", ["inherit"], function(t, e) {
    var i = e({
        __constructor: function(t, e, i) {
            this.type = t,
            this._isPropagationStopped = Boolean(e),
            this._isDefaultPrevented = Boolean(i)
        },
        isPropagationStopped: function() {
            return this._isPropagationStopped
        },
        isDefaultPrevented: function() {
            return this._isDefaultPrevented
        },
        stopPropagation: function() {
            this._isPropagationStopped = !0
        },
        preventDefault: function() {
            this._isDefaultPrevented = !0
        }
    });
    t(i)
}),
modules.define("y-popup", ["inherit", "y-block", "y-extend", "jquery", "y-next-tick"], function(t, e, i, n, o, s) {
    function r(t, e) {
        var i = Math.max(0, Math.min(t.right, e.right) - Math.max(t.left, e.left)) * Math.max(0, Math.min(t.bottom, e.bottom) - Math.max(t.top, e.top));
        return Math.round(i)
    }
    function a() {
        var t = document.documentElement
          , e = window.pageXOffset || t.scrollLeft
          , i = window.pageYOffset || t.scrollTop
          , n = t.clientWidth
          , o = t.clientHeight
          , s = Math.max(t.scrollHeight, o)
          , r = s - o;
        return i > r && (i = r),
        {
            top: i,
            right: e + n,
            bottom: i + o,
            left: e
        }
    }
    var c = {
        bottom: {
            vertical: !0,
            bottom: !0,
            center: !0
        },
        "bottom-left": {
            vertical: !0,
            bottom: !0,
            left: !0
        },
        "bottom-right": {
            vertical: !0,
            bottom: !0,
            right: !0
        },
        top: {
            vertical: !0,
            top: !0,
            center: !0
        },
        "top-left": {
            vertical: !0,
            top: !0,
            left: !0
        },
        "top-right": {
            vertical: !0,
            top: !0,
            right: !0
        },
        left: {
            horizontal: !0,
            left: !0,
            middle: !0
        },
        "left-top": {
            horizontal: !0,
            left: !0,
            top: !0
        },
        "left-bottom": {
            horizontal: !0,
            left: !0,
            bottom: !0
        },
        right: {
            horizontal: !0,
            right: !0,
            middle: !0
        },
        "right-top": {
            horizontal: !0,
            right: !0,
            top: !0
        },
        "right-bottom": {
            horizontal: !0,
            right: !0,
            bottom: !0
        }
    }
      , h = ["bottom", "bottom-right", "bottom-left", "right-bottom", "right", "right-top", "top", "top-right", "top-left", "left", "left-bottom", "left-top"]
      , l = o(window)
      , u = o(document)
      , d = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments);
            var t = n({
                position: "bottom",
                showArrow: !0,
                hideOnClickOutside: !0,
                hideOnEsc: !0
            }, this._getOptions());
            t.content && this.setContent(t.content),
            void 0 !== t.padding && this._findElement("content").css("padding", t.padding),
            void 0 !== t.zIndex && this.getDomNode().css("z-index", t.zIndex),
            this._options = t,
            this._isShown = !1,
            this._arrow = this._findElement("arrow")
        },
        destruct: function() {
            this.hide(),
            this._options = null ,
            this.__base()
        },
        showAt: function(t, e) {
            if (!this._isShown) {
                "number" == typeof t ? this._target = {
                    left: t,
                    top: e
                } : this._target = t;
                var i = this.getDomNode();
                i.appendTo(document.body),
                this.reposition(),
                this._setState("shown"),
                this._isShown = !0,
                this.emit("show"),
                this._options.hideOnClickOutside && s(function() {
                    this._isShown && this._bindTo(u, "click", this._onClickOutside)
                }
                .bind(this)),
                this._options.hideOnEsc && this._bindTo(u, "keyup", this._onKeyup),
                this._bindTo(l, "scroll", this.reposition),
                this._bindTo(l, "resize", this.reposition)
            }
        },
        hide: function() {
            this._isShown && (this._options.hideOnClickOutside && this._unbindFrom(u, "click", this._onClickOutside),
            this._options.hideOnEsc && this._unbindFrom(u, "keyup", this._onKeyup),
            this._unbindFrom(l, "scroll", this.reposition),
            this._unbindFrom(l, "resize", this.reposition),
            this._removeState("shown"),
            this._isShown = !1,
            this._target = null ,
            this.emit("hide"))
        },
        isShown: function() {
            return this._isShown
        },
        setContent: function(t) {
            this._findElement("content").html(t)
        },
        _getArrowDimensions: function() {
            var t = this._arrow ? this._arrow.outerWidth() : 0
              , e = t * Math.sqrt(2);
            return {
                baseWidth: e,
                height: e / 2,
                edge: t
            }
        },
        _getPopupSize: function() {
            var t = this.getDomNode();
            return {
                width: t.outerWidth(),
                height: t.outerHeight()
            }
        },
        _getTargetRect: function() {
            var t = this._target
              , e = t instanceof o
              , i = e ? t.offset() : t;
            return {
                top: i.top,
                right: i.left + (e ? t.outerWidth() : 0),
                bottom: i.top + (e ? t.outerHeight() : 0),
                left: i.left
            }
        },
        reposition: function() {
            if (this._target) {
                for (var t, e = a(), i = this._getTargetRect(), n = this._getPopupSize(), s = this._getArrowDimensions(), l = -s.edge / 2, u = s.baseWidth / 2, d = n.width * n.height, m = [this._options.position].concat(h), _ = 0; _ < m.length; _++) {
                    var f = c[m[_]]
                      , p = {}
                      , g = {
                        top: "auto",
                        right: "auto",
                        bottom: "auto",
                        left: "auto"
                    };
                    f.horizontal ? (f.left ? (p.left = i.left - n.width - s.height,
                    g.right = l) : f.right && (p.left = i.right + s.height,
                    g.left = l),
                    f.middle ? p.top = (i.top + i.bottom - n.height) / 2 : f.top ? p.top = Math.max(i.bottom - n.height, (i.top + i.bottom + s.baseWidth) / 2 + u - n.height) : f.bottom && (p.top = Math.min(i.top, (i.top + i.bottom - s.baseWidth) / 2 - u)),
                    g.top = (i.top + i.bottom - s.edge) / 2 - p.top) : f.vertical && (f.top ? (p.top = i.top - n.height - s.height,
                    g.bottom = l) : f.bottom && (p.top = i.bottom + s.height,
                    g.top = l),
                    f.center ? p.left = (i.left + i.right - n.width) / 2 : f.left ? p.left = Math.max(i.right - n.width, (i.left + i.right + s.baseWidth) / 2 + u - n.width) : f.right && (p.left = Math.min(i.left, (i.left + i.right - s.baseWidth) / 2 - u)),
                    g.left = (i.left + i.right - s.edge) / 2 - p.left),
                    p.bottom = p.top + n.height,
                    p.right = p.left + n.width;
                    var v = r(p, e);
                    if ((!t || v > t.square) && (t = {
                        popupPos: {
                            left: p.left,
                            top: p.top
                        },
                        arrowPos: g,
                        square: v
                    }),
                    v === d)
                        break
                }
                var b = o(document.body).offset()
                  , y = t.popupPos
                  , w = {
                    left: y.left - b.left,
                    top: y.top - b.top
                };
                this.getDomNode().css(w),
                this._arrow && this._arrow.css(t.arrowPos)
            }
        },
        _onClickOutside: function(t) {
            var e = this.getDomNode()
              , i = t.target;
            e.has(i).length || e.is(i) || this.hide()
        },
        _onKeyup: function(t) {
            27 === t.keyCode && this.hide()
        }
    }, {
        getBlockName: function() {
            return "y-popup"
        }
    });
    t(d)
}),
modules.define("y-zindexes", ["bt"], function(t, e) {
    t(e.lib.zIndexes)
}),
modules.define("y-next-tick", function(t) {
    var e = this.global
      , i = []
      , n = function(t) {
        return 1 === i.push(t)
    }
      , o = function() {
        var t = i
          , e = 0
          , n = i.length;
        for (i = []; n > e; )
            t[e++]()
    }
    ;
    if ("object" == typeof process && process.nextTick)
        return t(function(t) {
            n(t) && process.nextTick(o)
        });
    if (e.setImmediate)
        return t(function(t) {
            n(t) && e.setImmediate(o)
        });
    if (e.postMessage) {
        var s = !0;
        if (e.attachEvent) {
            var r = function() {
                s = !1
            }
            ;
            e.attachEvent("onmessage", r),
            e.postMessage("__checkAsync", "*"),
            e.detachEvent("onmessage", r)
        }
        if (s) {
            var a = "__nextTick" + +new Date
              , c = function(t) {
                t.data === a && (t.stopPropagation && t.stopPropagation(),
                o())
            }
            ;
            return e.addEventListener ? e.addEventListener("message", c, !0) : e.attachEvent("onmessage", c),
            t(function(t) {
                n(t) && e.postMessage(a, "*")
            })
        }
    }
    var h = e.document;
    if ("onreadystatechange"in h.createElement("script")) {
        var l = function() {
            var t = h.createElement("script");
            t.onreadystatechange = function() {
                t.parentNode.removeChild(t),
                t = t.onreadystatechange = null ,
                o()
            }
            ,
            (h.documentElement || h.body).appendChild(t)
        }
        ;
        return t(function(t) {
            n(t) && l()
        })
    }
    t(function(t) {
        n(t) && setTimeout(o, 0)
    })
}),
modules.define("scheme-view-popup", ["inherit", "y-popup", "y-event-emitter", "y-event-manager", "station-label", "bt"], function(t, e, i, n, o, s, r) {
    var a = e(n, {
        __constructor: function(t) {
            t = t || {},
            this._popup = new i(t),
            this._eventManager = new o(this)
        },
        destruct: function() {
            this._eventManager.unbindAll(),
            this._popup.destruct()
        },
        showAt: function(t, e) {
            var i = e.map(function(t) {
                var e = [t.getName(), " (", t.getLine().getName(), ")"].join("");
                return {
                    block: "station-label",
                    text: e,
                    id: t.getId(),
                    color: t.getLine().getColor(),
                    closed: t.isClosed()
                }
            }, this)
              , n = {
                block: "list",
                items: i
            };
            this._popup.setContent(r.apply(n)),
            s.findAll(this._popup.getDomNode()).forEach(function(t) {
                this._eventManager.bindTo(t, "mouseup", this._handleItemMouseup)
            }, this),
            this._popup.showAt(t)
        },
        hide: function() {
            this._popup.hide(),
            this._eventManager.unbindAll()
        },
        _handleItemMouseup: function(t) {
            this.emit("item-clicked", t)
        }
    });
    t(a)
}),
modules.define("station-label", ["inherit", "y-block"], function(t, e, i) {
    var n = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._id = this._getOptions().id,
            this._closed = this._getState("closed"),
            this._proxyDomEvent("mouseenter")._proxyDomEvent("mouseleave")._proxyDomEvent("mousedown")._proxyDomEvent("mouseup")._proxyDomEvent("click")
        },
        _proxyDomEvent: function(t) {
            if (!t)
                throw new Error("To proxy a DOM event you should specify it's name.");
            return this._bindTo(this.getDomNode(), t, function(e) {
                this.emit(t, e.data)
            }),
            this
        },
        getId: function() {
            return this._id
        },
        isClosed: function() {
            return this._closed
        },
        highlight: function() {
            this._setState("highlighted")
        },
        unhighlight: function() {
            this._removeState("highlighted")
        }
    }, {
        getBlockName: function() {
            return "station-label"
        }
    });
    t(n)
}),
modules.define("svg-tools", ["jquery"], function(t, e) {
    var i = function(t, e) {
        if (t.classList)
            t.classList.add(e);
        else {
            var i = t.className.baseVal.split(" ");
            -1 === i.indexOf(e) && i.push(e),
            t.className.baseVal = i.join(" ")
        }
    }
      , n = function(t, e) {
        if (t.classList)
            t.classList.remove(e);
        else {
            var i = t.className.baseVal.split(" ")
              , n = i.indexOf(e);
            -1 !== n && i.splice(n, 1),
            t.className.baseVal = i.join(" ")
        }
    }
      , o = function(t) {
        return t instanceof e ? t[0] : t
    }
      , s = function(t, e) {
        return t = o(t),
        e = e || !1,
        t.cloneNode(e)
    }
      , r = function(t) {
        return document.createElementNS("http://www.w3.org/2000/svg", t)
    }
    ;
    t({
        addClass: function(t, n) {
            t instanceof e ? t.each(function() {
                i(this, n)
            }) : i(t, n)
        },
        removeClass: function(t, i) {
            t instanceof e ? t.each(function() {
                n(this, i)
            }) : n(t, i)
        },
        clone: function(t) {
            return s(t, !1)
        },
        cloneDeep: function(t) {
            return s(t, !0)
        },
        append: function(t, e) {
            t = o(t),
            e = o(e),
            t.appendChild(e)
        },
        prepend: function(t, e) {
            t = o(t),
            e = o(e),
            t.insertBefore(e, t.firstChild)
        },
        moveChildren: function(t, e) {
            for (t = o(t),
            e = o(e); t.firstChild; )
                e.appendChild(t.firstChild)
        },
        getCtm: function(t) {
            return t = o(t),
            t.transform.baseVal.getItem(0).matrix
        },
        getTransformProperty: function(t) {
            return t = o(t),
            t.transform.baseVal.getItem(0)
        },
        empty: function(t) {
            for (t = o(t); t.firstChild; )
                t.removeChild(t.firstChild)
        },
        getBBox: function(t) {
            return t = o(t),
            t.getBBox()
        },
        createRect: function(t) {
            var e = r("rect");
            return e.setAttribute("x", t.x),
            e.setAttribute("y", t.y),
            e.setAttribute("width", t.width),
            e.setAttribute("height", t.height),
            e.setAttribute("rx", t.rx),
            e.setAttribute("ry", t.ry),
            e.setAttribute("fill", t.fill),
            e.setAttribute("opacity", t.opacity),
            e
        }
    })
}),
modules.define("ymaps", ["y-load-script", "config", "y-i18n"], function(t, e, i, n) {
    var o = {
        ru: "ru_RU",
        uk: "uk_UA",
        en: "en_US",
        tr: "tr_TR"
    }
      , s = o[n.getLanguage()] || "ru_RU"
      , r = i.ymaps.modules.join(",")
      , a = [i.hosts.ymaps, i.ymaps.version, "/?lang=", s, "&load=", r];
    i.ymaps.mode && (a.push("&mode="),
    a.push(i.ymaps.mode)),
    e(a.join("")).then(function() {
        ymaps.ready(function() {
            t(ymaps)
        })
    })
}),
modules.define("scheme-layer", ["inherit", "ymaps", "jquery"], function(t, e, i, n) {
    var o = i.collection.Item
      , s = e(o, {
        __constructor: function() {
            o.call(this)
        },
        onAddToMap: function(t) {
            o.prototype.onAddToMap.call(this, t),
            this._pane = this.options.get("pane", t.panes.get("ground")),
            this._containerDomNode = n(document.createElement("div")),
            this._containerDomNode.addClass("ymaps-scheme-layer"),
            this._pane.getElement().appendChild(this._containerDomNode[0])
        },
        getPane: function() {
            return this._pane
        },
        hideContent: function(t) {
            t = t || 0,
            this._containerDomNode.fadeTo(t, 0)
        },
        showContent: function(t) {
            t = t || 0,
            this._containerDomNode.fadeTo(t, 1)
        },
        onRemoveFromMap: function() {
            this._containerDomNode[0].removeChild(this._containerDomNode.firstChild),
            this._pane.getElement().removeChild(this._containerDomNode),
            o.prototype.onRemoveFromMap.call(this)
        },
        empty: function() {
            this._containerDomNode.empty()
        },
        setImageDomNode: function(t) {
            this._imageDomNode = n(t),
            this._containerDomNode.append(this._imageDomNode)
        },
        getImageDomNode: function() {
            return this._imageDomNode
        }
    });
    t(s)
}),
modules.define("hotspot-manager", ["inherit", "ymaps", "y-event-emitter"], function(t, e, i, n) {
    var o = e(n, {
        __constructor: function(t) {
            this.__base(),
            this._map = t,
            this._currentScaleRatio = -1,
            this._dummyGeometry = new i.geometry.pixel.Rectangle([[0, 0], [0, 0]])
        },
        setActiveObjects: function(t) {
            this._hotspotCount = t.length,
            this._hotspots = this._getHotspotArray(t),
            this._bboxes = this._getBboxArray(t),
            this._geometryCache = {}
        },
        update: function(t) {
            if (this._currScaleRatio !== t) {
                this._currScaleRatio = t,
                this._geometryCache[t] || (this._geometryCache[t] = this._getScaledGeometryArray(t));
                for (var e = 0; e < this._hotspotCount; e++)
                    this._hotspots[e].setGeometry(this._geometryCache[t][e])
            }
        },
        hideAll: function() {
            -1 !== this._currScaleRatio && (this._hotspots.forEach(function(t) {
                t.setGeometry(this._dummyGeometry)
            }, this),
            this._currScaleRatio = -1)
        },
        removeAll: function() {
            this._hotspots && this._hotspots.forEach(function(t) {
                t.events.remove("click", this._handleClick, this).remove("mouseenter", this._handleMouseEnter, this).remove("mouseleave", this._handleMouseLeave, this),
                t.setMap(null )
            }, this)
        },
        destruct: function() {
            this.removeAll(),
            this._hotspots = null ,
            this._bboxes = null ,
            this._geometryCache = null ,
            this._dummyGeometry = null
        },
        _getHotspotArray: function(t) {
            return t.map(function(t) {
                var e = new i.overlay.hotspot.Rectangle(this._dummyGeometry,t.data,{
                    cursor: "pointer",
                    pane: "places",
                    eventsPane: "events",
                    interactivityModel: "default#layer"
                });
                return e.events.add("click", this._handleClick, this).add("mouseenter", this._handleMouseEnter, this).add("mouseleave", this._handleMouseLeave, this),
                e.setMap(this._map),
                e
            }, this)
        },
        _getBboxArray: function(t) {
            return t.map(function(t) {
                return t.bBox
            })
        },
        _getScaledGeometryArray: function(t) {
            return this._bboxes.map(function(e) {
                return new i.geometry.pixel.Rectangle([[e.x * t, e.y * t], [(e.x + e.width) * t, (e.y + e.height) * t]])
            })
        },
        _handleClick: function(t) {
            this.emit("click", t.get("target").getData())
        },
        _handleMouseEnter: function(t) {
            this.emit("mouseenter", t.get("target").getData())
        },
        _handleMouseLeave: function(t) {
            this.emit("mouseleave", t.get("target").getData())
        }
    });
    t(o)
}),
modules.define("statcount", ["config"], function(t, e) {
    function i(t) {
        var e = window["yaCounter" + n];
        e && e.params(t)
    }
    var n = e.metrikaId;
    t(i)
}),
modules.define("y-throttle", function(t) {
    t(function(t, e, i) {
        var n, o, s, r = null , a = 0;
        i = i || {};
        var c = function() {
            a = i.leading === !1 ? 0 : Date.now(),
            r = null ,
            s = t.apply(n, o)
        }
        ;
        return function() {
            var h = Date.now();
            a || i.leading !== !1 || (a = h);
            var l = e - (h - a);
            return n = this,
            o = arguments,
            0 >= l ? (clearTimeout(r),
            r = null ,
            a = h,
            s = t.apply(n, o)) : r || i.trailing === !1 || (r = setTimeout(c, l)),
            s
        }
    })
}),
modules.define("zoom-control", ["inherit", "y-block", "statcount"], function(t, e, i, n) {
    var o = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._plus = this._findElement("plus"),
            this._minus = this._findElement("minus");
            var t = this._getOptions()["zoom-settings"];
            this._minZoom = t.minZoom,
            this._maxZoom = t.maxZoom,
            this._zoomStep = t.zoomStep,
            this._bindTo(this._plus, "mousedown", this._handlePlusStatMouseDown),
            this._bindTo(this._minus, "mousedown", this._handleMinusStatMouseDown)
        },
        init: function(t) {
            this._zoomLevelProperty = t.property("zoom-level"),
            this._updateControlElements(this._zoomLevelProperty.get()),
            this.enable()
        },
        enable: function() {
            this._updateControlElements(this._zoomLevelProperty.get()),
            this._activate(),
            this._removeState("disabled")
        },
        disable: function() {
            this._deactivate(),
            this._setState("disabled")
        },
        destruct: function() {
            this._deactivate(),
            this.__base()
        },
        _activate: function() {
            this._bindTo(this._plus, "mousedown", this._handlePlusMouseDown),
            this._bindTo(this._plus, "mouseup", this._handlePlusMouseUp),
            this._bindTo(this._plus, "mouseout", this._handlePlusMouseOut),
            this._bindTo(this._minus, "mousedown", this._handleMinusMouseDown),
            this._bindTo(this._minus, "mouseup", this._handleMinusMouseUp),
            this._bindTo(this._minus, "mouseout", this._handleMinusMouseOut),
            this._bindTo(this._zoomLevelProperty, "change", this._handleZoomLevelPropertyChange)
        },
        _deactivate: function() {
            this._unbindFrom(this._plus, "mousedown", this._handlePlusMouseDown),
            this._unbindFrom(this._plus, "mouseup", this._handlePlusMouseUp),
            this._unbindFrom(this._plus, "mouseout", this._handlePlusMouseOut),
            this._unbindFrom(this._minus, "mousedown", this._handleMinusMouseDown),
            this._unbindFrom(this._minus, "mouseup", this._handleMinusMouseUp),
            this._unbindFrom(this._minus, "mouseout", this._handleMinusMouseOut),
            this._unbindFrom(this._zoomLevelProperty, "change", this._handleZoomLevelPropertyChange)
        },
        _handlePlusMouseDown: function() {
            this._plusDisabled || this._setState("plus-pressed")
        },
        _handlePlusMouseUp: function() {
            if (!this._plusDisabled) {
                var t = Math.min(this._zoomLevelProperty.get() + this._zoomStep, this._maxZoom);
                this._zoomLevelProperty.set(t),
                this._removeState("plus-pressed")
            }
        },
        _handlePlusMouseOut: function() {
            this._removeState("plus-pressed")
        },
        _handleMinusMouseDown: function() {
            this._minusDisabled || this._setState("minus-pressed")
        },
        _handleMinusMouseUp: function() {
            if (!this._minusDisabled) {
                var t = Math.max(this._zoomLevelProperty.get() - this._zoomStep, this._minZoom);
                this._zoomLevelProperty.set(t),
                this._removeState("minus-pressed")
            }
        },
        _handleMinusMouseOut: function() {
            this._removeState("minus-pressed")
        },
        _handleZoomLevelPropertyChange: function(t) {
            this._updateControlElements(t)
        },
        _updateControlElements: function(t) {
            t >= this._maxZoom && (this._setState("plus-disabled"),
            this._plusDisabled = !0),
            t <= this._minZoom && (this._setState("minus-disabled"),
            this._minusDisabled = !0),
            this._plusDisabled && t < this._maxZoom && (this._removeState("plus-disabled"),
            this._plusDisabled = !1),
            this._minusDisabled && t > this._minZoom && (this._removeState("minus-disabled"),
            this._minusDisabled = !1)
        },
        _handlePlusStatMouseDown: function() {
            this._plusDisabled || (n({
                "zoom-control": {
                    clicked: "plus"
                }
            }),
            this._unbindFrom(this._plus, "mousedown", this._handlePlusStatMouseDown))
        },
        _handleMinusStatMouseDown: function() {
            this._minusDisabled || (n({
                "zoom-control": {
                    clicked: "minus"
                }
            }),
            this._unbindFrom(this._minus, "mousedown", this._handleMinusStatMouseDown))
        }
    }, {
        getBlockName: function() {
            return "zoom-control"
        }
    });
    t(o)
}),
modules.define("title", ["inherit", "y-block", "y-i18n"], function(t, e, i, n) {
    t(e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments)
        },
        init: function(t) {
            t.on("change-current-scheme", this._onChangeCurrentScheme, this)
        },
        _onChangeCurrentScheme: function(t) {
            var e = n("cities-genitive", t.getAlias());
            this.getDomNode().text(n("main", "page-title", {
                CityName: e
            }))
        }
    }, {
        getBlockName: function() {
            return "title"
        }
    }))
}),
modules.define("from-to-suggest", ["inherit", "y-block", "station-suggest", "statcount"], function(t, e, i, n, o) {
    var s = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._fromSuggest = n.find(this._findElement("from-field")),
            this._toSuggest = n.find(this._findElement("to-field")),
            this._active = !1,
            this._bindTo(this._fromSuggest, "selected", this._sendFromStatistic),
            this._bindTo(this._toSuggest, "selected", this._sendToStatistic)
        },
        init: function(t) {
            this._fromStationProperty = t.property("from-station"),
            this._toStationProperty = t.property("to-station"),
            this._fromSuggest.init(this._fromStationProperty),
            this._toSuggest.init(this._toStationProperty)
        },
        setStations: function(t) {
            this._fromSuggest.setStations(t),
            this._toSuggest.setStations(t)
        },
        activate: function() {
            this._active || (this._fromStationProperty.on("change", this._onFromStationChange, this),
            this._toStationProperty.on("change", this._onToStationChange, this),
            this._fromSuggest.activate(),
            this._toSuggest.activate(),
            this._active = !0)
        },
        deactivate: function() {
            this._active && (this._fromStationProperty.off("change", this._onFromStationChange, this),
            this._toStationProperty.off("change", this._onToStationChange, this),
            this._fromSuggest.deactivate(),
            this._toSuggest.deactivate(),
            this._active = !1)
        },
        blur: function() {
            this._fromSuggest.blur(),
            this._toSuggest.blur()
        },
        _onFromStationChange: function(t) {
            t ? this._toSuggest.excludeStation(t) : this._toSuggest.dropExcludedStation()
        },
        _onToStationChange: function(t) {
            t ? this._fromSuggest.excludeStation(t) : this._fromSuggest.dropExcludedStation()
        },
        _sendFromStatistic: function(t) {
            t.data && (o({
                suggest: {
                    "station-selected": "from"
                }
            }),
            this._unbindFrom(this._fromSuggest, "selected", this._sendFromStatistic))
        },
        _sendToStatistic: function(t) {
            t.data && (o({
                suggest: {
                    "station-selected": "to"
                }
            }),
            this._unbindFrom(this._toSuggest, "selected", this._sendToStatistic))
        }
    }, {
        getBlockName: function() {
            return "from-to-suggest"
        }
    });
    t(s)
}),
modules.define("station-suggest", ["inherit", "y-block", "y-input", "y-suggest", "y-suggest-drop", "y-popup", "vow", "bt", "station-suggest-data-provider", "station-suggest-drop-item"], function(t, e, i, n, o, s, r, a, c, h, l) {
    var u = 15
      , d = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._iconContainer = this._findElement("icon-container"),
            this._input = n.find(this.getDomNode()),
            this._active = !1
        },
        init: function(t) {
            this._property = t,
            this._dataProvider = new h({
                maxDropItemCount: u
            }),
            this._drop = new s({
                itemClass: l
            }),
            this._suggest = new o({
                inputBlock: this._input,
                dataProvider: this._dataProvider,
                drop: this._drop,
                insertionTextExtractor: this._insertionTextExtractor.bind(this)
            }),
            this.getDomNode().append(this._suggest.getDomNode())
        },
        setStations: function(t) {
            this._stationByIdHash = this._createStationByIdHash(t),
            this._dataProvider.setStations(t)
        },
        excludeStation: function(t) {
            this._suggest.getDataProvider().setExcludeId(t.getId())
        },
        dropExcludedStation: function() {
            this._suggest.getDataProvider().removeExcludeId()
        },
        activate: function() {
            if (!this._active) {
                var t = this._suggest
                  , e = this._input;
                this._bindTo(this._property, "change", this._onPropertyChange)._bindTo(t, "apply", this._onSuggestApply)._bindTo(t, "response-success", this._onResponseSuccessful)._bindTo(e, "change", this._onInputChanged)._bindTo(e, "keydown", this._onInputKeydown)._bindTo(e, "clear", this._onInputClear),
                this._active = !0
            }
        },
        deactivate: function() {
            if (this._active) {
                var t = this._suggest
                  , e = this._input;
                this._unbindFrom(this._property, "change", this._onPropertyChange)._unbindFrom(t, "apply", this._onSuggestApply)._unbindFrom(t, "response-success", this._onResponseSuccessful)._unbindFrom(e, "change", this._onInputChanged)._unbindFrom(e, "keydown", this._onInputKeydown)._unbindFrom(e, "clear", this._onInputClear),
                this._active = !1
            }
        },
        blur: function() {
            this._input.blur()
        },
        _createStationByIdHash: function(t) {
            var e = {};
            return t.forEach(function(t) {
                e[t.getId()] = t
            }),
            e
        },
        _insertionTextExtractor: function(t) {
            return this._fillInput(this._stationByIdHash[t.getOptions().id]),
            t.getText()
        },
        _fillInput: function(t) {
            this._renderIcon(t.getLine().getColor()),
            this._suggest.setInputText(t.getName()),
            t.isClosed() ? (this._setState("selected-closed-station"),
            t.getHint() && this._showInfoPopup(t.getHint())) : (this._removeState("selected-closed-station"),
            this._hideInfoPopup())
        },
        _stripInput: function() {
            this._removeState("selected-closed-station"),
            this._hideInfoPopup(),
            this._clearIcon()
        },
        _resetInput: function() {
            this._suggest.setInputText(""),
            this._stripInput()
        },
        _renderIcon: function(t) {
            this._iconContainer.html(c.apply({
                block: "station-label",
                elem: "icon",
                color: t
            }))
        },
        _clearIcon: function() {
            this._iconContainer.empty()
        },
        _showInfoPopup: function(t) {
            this._infoPopup || (this._infoPopup = new r({
                position: "right",
                hideOnClickOutside: !1
            })),
            this._infoPopup.setContent(t),
            this._infoPopup.showAt(this._input.getDomNode())
        },
        _hideInfoPopup: function() {
            var t = this._infoPopup;
            t && t.isShown() && t.hide()
        },
        _selectStationById: function(t) {
            var e = this._stationByIdHash[t];
            return e && e.isClosed() ? void this._fillInput(e) : (this._property.set(e),
            void this.emit("selected", e))
        },
        _onPropertyChange: function(t) {
            t ? (this._fillInput(t),
            this._input.disable()) : (this._resetInput(),
            this._input.enable())
        },
        _onSuggestApply: function(t) {
            t.data.item && this._selectStationById(t.data.item.getOptions().id)
        },
        _onResponseSuccessful: function(t) {
            this._drop.getCurrentResponseItem() && t.data && 0 !== t.data.getItemCount() || this._stripInput()
        },
        _onInputChanged: function() {
            this._drop.getCurrentResponseItem() || this._property.get() || this._stripInput()
        },
        _onInputClear: function() {
            this._property.get() ? this._selectStationById(-1) : this._resetInput()
        },
        _onInputKeydown: function(t) {
            switch (t.data.keyCode) {
            case 9:
                var e = this._drop.getCurrentResponseItem();
                e && this._selectStationById(e.getOptions().id);
                break;
            case 27:
                this._resetInput()
            }
        }
    }, {
        getBlockName: function() {
            return "station-suggest"
        }
    });
    t(d)
}),
modules.define("y-input", ["y-block", "inherit", "jquery", "y-dom", "y-block-event"], function(t, e, i, n, o, s) {
    var r = i(e, {
        __constructor: function() {
            this.__base.apply(this, arguments);
            var t = this._control = this._findElement("control");
            this._bindTo(t, "change", this._onChange),
            this._bindTo(t, "keyup", this._onChange),
            this._bindTo(t, "input", this._onChange),
            this._bindTo(t, "keydown", this._onKeyDown),
            this._bindTo(t, "keypress", this._onKeyPress),
            this._bindTo(this.getDomNode(), "click", this._onOuterClick),
            this._clearElement = this._findElement("clear"),
            this._clearElement && (this._bindTo(this._clearElement, "click", this._onClearClick),
            "" !== this._control.val() && this._setElementState(this._clearElement, "visible")),
            this._prevValue = t.val()
        },
        _onChange: function() {
            var t = this._control.val();
            t !== this._prevValue && (this._prevValue = t,
            this._clearElement && ("" !== t ? this._setElementState(this._clearElement, "visible") : this._removeElementState(this._clearElement, "visible")),
            this.emit("change"))
        },
        _onKeyDown: function(t) {
            var e = new s("keydown");
            e.stopPropagation(),
            this.emit(e, t),
            e.isDefaultPrevented() && t.preventDefault()
        },
        _onKeyPress: function(t) {
            var e = new s("keypress");
            e.stopPropagation(),
            this.emit(e, t),
            e.isDefaultPrevented() && t.preventDefault()
        },
        _onOuterClick: function(t) {
            t.target === this.getDomNode()[0] && this.focus()
        },
        _onClearClick: function() {
            this.setValue(""),
            this.focus(),
            this.emit("clear")
        },
        focus: function() {
            return this.isEnabled() && this._control.focus(),
            this
        },
        isFocused: function() {
            return o.focus.isFocused(this.getDomNode())
        },
        blur: function() {
            return this._control.blur(),
            this
        },
        isEnabled: function() {
            return !this._getState("disabled")
        },
        disable: function() {
            return this.isEnabled() && (this.blur(),
            this._control.attr("disabled", "disabled"),
            this._setState("disabled")),
            this
        },
        enable: function() {
            return this.isEnabled() || (this._control.removeAttr("disabled"),
            this._removeState("disabled")),
            this
        },
        select: function() {
            return this._control.select(),
            this
        },
        getName: function() {
            return this._control.attr("name")
        },
        getValue: function() {
            return this._control.val()
        },
        setValue: function(t) {
            return this._control.val(t),
            this._onChange(),
            this
        },
        getCaretPosition: function() {
            return o.selection.getInputCaretPosition(this._control)
        },
        disableAutocomplete: function() {
            return this._control.attr("autocomplete", "off"),
            this
        },
        enableAutocomplete: function() {
            return this._control.removeAttr("autocomplete"),
            this
        },
        isAutocompleteEnabled: function() {
            return "off" !== this._control.attr("autocomplete")
        },
        disableAutocorrect: function() {
            return this._control.attr("autocorrect", "off"),
            this
        },
        enableAutocorrect: function() {
            return this._control.removeAttr("autocorrect"),
            this
        },
        isAutocorrectEnabled: function() {
            return "off" !== this._control.attr("autocorrect")
        },
        getLeftIcon: function(t) {
            var e, i = this._findElement("icons-left");
            return i && this._findAllElements("icon", i).some(function(i) {
                return i.data("name") === t ? (e = i,
                !0) : void 0
            }),
            e
        },
        addLeftIcon: function(t, e) {
            var i = this._createElement({
                elem: "icon",
                name: t
            });
            i.append(e);
            var n = this._findElement("icons-left");
            n || (n = this._createElement("icons-left"),
            this._findElement("context").before(n)),
            n.append(i)
        },
        removeLeftIcon: function(t) {
            var e = this.getLeftIcon(t);
            e && e.remove()
        },
        setPlaceholder: function(t) {
            this._control.attr("placeholder", t)
        },
        getPlaceholder: function() {
            return this._control.attr("placeholder")
        }
    }, {
        getBlockName: function() {
            return "y-input"
        },
        _liveInit: function() {
            this._liveBindToElement("control", "focusin", function() {
                this._setState("focused"),
                this.emit("focus")
            }),
            this._liveBindToElement("control", "focusout", function() {
                this._removeState("focused"),
                this.emit("blur")
            })
        }
    });
    t(r)
}),
modules.define("y-dom", ["jquery", "y-block"], function(t, e, i) {
    t({
        detach: function(t) {
            t = this._getDomElement(t);
            for (var e = t.length, i = 0; e > i; i++) {
                var n = t[i];
                n.parentNode && n.parentNode.removeChild(n)
            }
        },
        replace: function(t, e) {
            t = this._getDomElement(t),
            e = this._getDomElement(e),
            e.insertBefore(t),
            this.detach(t)
        },
        insertBefore: function(t, e) {
            t = this._getDomElement(t),
            e = this._getDomElement(e),
            e.insertBefore(t)
        },
        insertAfter: function(t, e) {
            t = this._getDomElement(t),
            e = this._getDomElement(e),
            e.insertAfter(t)
        },
        append: function(t, i) {
            t = e(t),
            t.append(this._getDomElement(i))
        },
        prepend: function(t, i) {
            t = e(t),
            t.prepend(this._getDomElement(i))
        },
        replaceContents: function(t, i) {
            t = e(t),
            i = this._getDomElement(i);
            var n = t.contents();
            n.length ? this.replace(n, i) : t.append(i)
        },
        _getDomElement: function(t) {
            if (t instanceof i && (t = t.getDomNode()),
            "string" == typeof t) {
                var n = e("<div></div>");
                return n.html(t),
                n.contents()
            }
            return e(t)
        },
        html: {
            escape: function(t) {
                return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            }
        },
        focus: {
            isFocusable: function(t) {
                switch (t = e(t)[0],
                t.nodeName.toLowerCase()) {
                case "iframe":
                    return !0;
                case "input":
                case "button":
                case "textarea":
                case "select":
                    return !t.hasAttribute("disabled");
                case "a":
                    return t.hasAttribute("href");
                default:
                    return t.hasAttribute("tabindex")
                }
            },
            isFocused: function(t) {
                t = e(t)[0];
                var i = document.activeElement;
                if (i)
                    for (var n = i; n; ) {
                        if (n === t)
                            return !0;
                        n = n.parentNode
                    }
                return !1
            }
        },
        selection: {
            getInputCaretPosition: function(t) {
                t = e(t)[0];
                var i = 0;
                if (document.selection) {
                    t.focus();
                    var n = document.selection.createRange();
                    n.moveStart("character", -t.value.length),
                    i = n.text.length
                } else
                    (t.selectionStart || 0 === t.selectionStart) && (i = t.selectionStart);
                return i
            }
        }
    })
}),
modules.define("y-suggest", ["y-block", "inherit", "y-suggest-insertion-text-extractor"], function(t, e, i, n) {
    var o = i(e, {
        __constructor: function() {
            this.__base.apply(this, arguments);
            var t = this._getOptions();
            this.setInput(t.inputBlock),
            this.getDomNode().append(this._input.getDomNode()),
            this._dataProvider = t.dataProvider,
            this.setDrop(t.drop),
            this.setInsertionTextExtractor(t.insertionTextExtractor || n),
            this._requestNumber = 0,
            this._insertionTextExtractor || this.setInsertionTextExtractor(function(t) {
                return t.getText()
            })
        },
        destruct: function() {
            this._cancelRequireCallbacks = !0,
            this._requestNumber++,
            this.__base()
        },
        _setupInput: function(t) {
            this._userText = t.getValue() || "",
            this._bindTo(t, "keydown", this._onKeyDown),
            this._bindTo(t, "change", this._onChange),
            this._bindTo(t, "blur", this._onBlur),
            this._bindTo(t, "focus", this._onFocus)
        },
        _teardownInput: function(t) {
            this._userText = "",
            this._unbindFrom(t, "keydown", this._onKeyDown),
            this._unbindFrom(t, "change", this._onChange),
            this._unbindFrom(t, "blur", this._onBlur),
            this._unbindFrom(t, "focus", this._onFocus)
        },
        getInsertionTextExtractor: function() {
            return this._insertionTextExtractor
        },
        setInsertionTextExtractor: function(t) {
            return this._insertionTextExtractor = t,
            this
        },
        getDrop: function() {
            return this._drop
        },
        setDrop: function(t) {
            return this._teardownInput(this._input),
            this._setDrop(t),
            this._setupInput(this._input),
            this
        },
        _setDrop: function(t) {
            this._drop && this._unbindFrom(this._drop, "click", this._onClick),
            this._drop = t,
            this._bindTo(t, "click", this._onClick),
            t.getDomNode().appendTo(this.getDomNode())
        },
        getInputText: function() {
            return this._input ? this._input.getValue() : void 0
        },
        setInputText: function(t) {
            return this._fillText(t),
            this
        },
        getInput: function() {
            return this._input
        },
        setInput: function(t) {
            return this._input = t,
            this._input.disableAutocomplete(),
            this._input.disableAutocorrect(),
            this._setupInput(this._input),
            this
        },
        getDataProvider: function() {
            return this._dataProvider
        },
        setDataProvider: function(t) {
            return this._dataProvider = t,
            this
        },
        _onClick: function(t) {
            this._fillText(this._insertionTextExtractor(t.data));
            var e = this.getInputText();
            this.emit("click", t.data),
            this.emit("select", {
                item: t.data,
                text: e
            }),
            this.emit("apply", {
                item: t.data,
                text: e
            })
        },
        _onBlur: function() {
            this._hideDrop()
        },
        _onFocus: function() {
            this._input.getValue().trim().length && this._requestDataProvider()
        },
        _onKeyDown: function(t) {
            var e = t.data;
            switch (e.keyCode) {
            case 13:
                if (this._drop.isVisible()) {
                    var i = this._drop.getCurrentResponseItem()
                      , n = this.getInputText();
                    i ? (this._fillText(this._insertionTextExtractor(i)),
                    this.emit("select", {
                        item: i,
                        text: n
                    })) : i = this._getMatchingResponseItem(n),
                    this.emit("apply", {
                        item: i,
                        text: n
                    }),
                    e.stopPropagation()
                }
                this._hideDrop();
                break;
            case 27:
                this._hideDrop();
                break;
            case 38:
                t.preventDefault(),
                this._drop.isVisible() && (this._drop.selectPreviousResult(),
                this._fillTextFromDrop());
                break;
            case 40:
                t.preventDefault(),
                this._drop.isVisible() && (this._drop.selectNextResult(),
                this._fillTextFromDrop())
            }
        },
        _getMatchingResponseItem: function(t) {
            if (!this._lastResponse || 0 === this._lastResponse.getItemCount())
                return null ;
            t = t.toLowerCase();
            var e = null ;
            return this._lastResponse.getGroups().some(function(i) {
                return i.getItems().some(function(i) {
                    return i.getText().toLowerCase() === t ? (e = i,
                    !0) : void 0
                }, this) ? !0 : void 0
            }, this),
            e
        },
        _fillTextFromDrop: function() {
            var t = this._drop.getCurrentResponseItem();
            t ? this._fillText(this._insertionTextExtractor(t)) : this._fillText(this._userText)
        },
        _fillText: function(t) {
            if (!this._input)
                throw new Error("Input is not loaded for y-suggest yet.");
            this._unbindFrom(this._input, "change", this._onChange),
            this._input.setValue(t),
            this._bindTo(this._input, "change", this._onChange)
        },
        _hideDrop: function() {
            this._requestNumber++,
            this._drop.isVisible() && this._drop.hide()
        },
        _onResponse: function(t) {
            0 === t.getItemCount() ? (this._hideDrop(),
            this._lastResponse = null ) : (this._drop.render(t),
            this._showDrop(),
            this._lastResponse = t)
        },
        _showDrop: function() {
            this._drop.isVisible() || this._drop.show()
        },
        _onChange: function() {
            this._userText = this._input.getValue(),
            this._input.isFocused() && (this._input.getValue().trim().length ? this._requestDataProvider() : this._hideDrop())
        },
        _requestDataProvider: function() {
            this._requestNumber++;
            var t = this._requestNumber;
            this._dataProvider.query(this._input.getValue(), this._input.getCaretPosition()).done(function(e) {
                t === this._requestNumber && (this._onResponse(e),
                this.emit("response-success", this._lastResponse))
            }, function(e) {
                t === this._requestNumber && this.emit("response-error", e)
            }, this)
        }
    }, {
        getBlockName: function() {
            return "y-suggest"
        }
    });
    t(o)
}),
modules.define("y-suggest-drop", ["y-block", "inherit", "bt", "jquery"], function(t, e, i, n, o) {
    var s = o(window)
      , r = i(e, {
        __constructor: function() {
            this.__base.apply(this, arguments);
            var t = this._getOptions();
            this._content = o(n.apply({
                block: this.__self.getBlockName(),
                elem: "content",
                view: this.getView()
            })),
            this._content.appendTo(document.body),
            this._content.hide(),
            this._setItemClass(t.itemClass),
            this._wide = t.wide,
            this._itemView = t.itemView,
            this._items = [],
            this._responseItems = [],
            this._selectedIndex = null ,
            this._bindTo(this._content, "mouseleave", function() {
                this._selectItem(null )
            }),
            this._isVisible = !1
        },
        destruct: function() {
            this._content.remove(),
            this.__base()
        },
        _setItemClass: function(t) {
            this._itemClass = t;
            var e = t.getEmitter(this._content);
            this._bindTo(e, "mouseenter", this._onItemMouseEnter),
            this._bindTo(e, "click", this._onItemClick)
        },
        _onItemMouseEnter: function(t) {
            this._selectItem(this._items.indexOf(t.target))
        },
        _onItemClick: function(t) {
            var e = this._items.indexOf(t.target);
            -1 !== e && this.emit("click", this._responseItems[e])
        },
        isVisible: function() {
            return this._isVisible
        },
        show: function() {
            return this._isVisible = !0,
            this._content.show(),
            this._bindTo(s, "resize", this._drawContent),
            this._drawContent(),
            this
        },
        hide: function() {
            return this._isVisible = !1,
            this._content.hide(),
            this._unbindFrom(s, "resize", this._drawContent),
            this
        },
        _drawContent: function() {
            var t = this.getDomNode()
              , e = t.offset()
              , i = o(document.body).offset()
              , n = {
                top: e.top - i.top
            };
            this._wide || (n.left = e.left - i.left,
            n.width = t.width()),
            this._content.css(n)
        },
        selectPreviousResult: function() {
            var t = this._selectedIndex;
            return null === t ? t = this._items.length - 1 : t--,
            this._selectItem(t),
            this
        },
        selectNextResult: function() {
            var t = this._selectedIndex;
            return null === t ? t = 0 : t++,
            this._selectItem(t),
            this
        },
        _selectItem: function(t) {
            null !== this._selectedIndex && this._items[this._selectedIndex] && this._items[this._selectedIndex].deselect(),
            this._selectedIndex = t,
            null !== t && this._items[t] ? (this._items[t].select(),
            this._selectedIndex = t) : this._selectedIndex = null
        },
        getCurrentResponseItem: function() {
            return null !== this._selectedIndex ? this._responseItems[this._selectedIndex] || null : null
        },
        render: function(t) {
            this._selectedIndex = null ;
            var i = this._content.contents();
            e.destructDomTree(i),
            i.remove();
            var o = this._itemClass
              , s = []
              , r = t.getGroups().map(function(t) {
                return {
                    block: this.__self.getBlockName(),
                    view: this.getView(),
                    elem: "group",
                    type: t.getType(),
                    items: t.getItems().map(function(t) {
                        return s.push(t),
                        {
                            block: o.getBlockName(),
                            view: this._itemView,
                            text: t.getText(),
                            type: t.getType(),
                            params: t.getParams(),
                            options: t.getOptions()
                        }
                    }, this)
                }
            }, this);
            return this._responseItems = s,
            this._content.html(n.apply(r)),
            this._items = o.findAll(this._content),
            this._drawContent(),
            this
        }
    }, {
        getBlockName: function() {
            return "y-suggest-drop"
        }
    });
    t(r)
}),
modules.define("y-suggest-insertion-text-extractor", function(t) {
    var e = function(t) {
        return t.getText()
    }
    ;
    t(e)
}),
modules.define("station-suggest-data-provider", ["inherit", "vow", "y-suggest-response-item", "y-suggest-response-group", "y-suggest-response"], function(t, e, i, n, o, s) {
    function r(t, e) {
        return t > e ? 1 : e > t ? -1 : 0
    }
    function a(t) {
        return t.toLowerCase().replace("ё", "е")
    }
    var c = e({
        __constructor: function(t) {
            this._defaultGroupType = "stations",
            this._maxDropItemCount = t.maxDropItemCount
        },
        setStations: function(t) {
            this._stations = this._getResponseItemArray(t)
        },
        setExcludeId: function(t) {
            this._excludeId = t
        },
        removeExcludeId: function() {
            this._excludeId = null
        },
        query: function(t) {
            if (this._stations) {
                var e = new o
                  , n = a(t);
                return this._stations.filter(function(t) {
                    var e = t.getOptions().normName.indexOf(n);
                    return e > -1 ? this._excludeId && t.getOptions().id === this._excludeId ? !1 : (t.index = e,
                    !0) : void 0
                }, this).sort(function(t, e) {
                    var i = t.index - e.index;
                    return i ? i : r(t.getText(), e.getText())
                }).slice(0, this._maxDropItemCount).forEach(function(t) {
                    e.addItem(t)
                }),
                i.fulfill(new s(t,[e],{}))
            }
        },
        _getResponseItemArray: function(t) {
            return t.map(function(t) {
                return new n(this._defaultGroupType,t.getName(),[],{
                    normName: a(t.getName()),
                    id: t.getId(),
                    color: t.getLine().getColor(),
                    text: t.getName(),
                    closed: t.isClosed()
                })
            }, this).sort(function(t, e) {
                return r(t.getText(), e.getText())
            })
        }
    });
    t(c)
}),
modules.define("y-suggest-response-item", ["inherit"], function(t, e) {
    var i = e({
        __constructor: function(t, e, i, n) {
            this._type = t,
            this._text = e,
            this._params = i || [],
            this._options = n || {}
        },
        getType: function() {
            return this._type
        },
        getText: function() {
            return this._text
        },
        getParams: function() {
            return this._params
        },
        getOptions: function() {
            return this._options
        }
    });
    t(i)
}),
modules.define("y-suggest-response-group", ["inherit"], function(t, e) {
    var i = e({
        __constructor: function(t, e) {
            this._type = t,
            this._items = e ? [].concat(e) : []
        },
        getType: function() {
            return this._type
        },
        getItems: function() {
            return this._items
        },
        addItem: function(t) {
            this._items.push(t)
        }
    });
    t(i)
}),
modules.define("y-suggest-response", ["inherit"], function(t, e) {
    var i = e({
        __constructor: function(t, e, i) {
            this._query = t,
            this._groups = e,
            this._params = i
        },
        getQuery: function() {
            return this._query
        },
        getGroups: function() {
            return this._groups
        },
        getParams: function() {
            return this._params
        },
        getItemCount: function() {
            var t = 0;
            return this._groups.forEach(function(e) {
                t += e.getItems().length
            }),
            t
        }
    });
    t(i)
}),
modules.define("station-suggest-drop-item", ["inherit", "y-block", "station-label"], function(t, e, i, n) {
    var o = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._label = n.find(this.getDomNode()),
            this._bindTo(this._label, "mousedown", this._handleMousedown)
        },
        _handleMousedown: function(t) {
            this.emit("click"),
            t.stopPropagation()
        },
        getId: function() {
            return this._label.getId()
        },
        select: function() {
            this._label.highlight()
        },
        deselect: function() {
            this._label.unhighlight()
        }
    }, {
        getBlockName: function() {
            return "station-suggest-drop-item"
        }
    });
    t(o)
}),
modules.define("routing-hint", ["inherit", "y-block", "y-i18n"], function(t, e, i, n) {
    var o = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments)
        },
        init: function(t) {
            this._fromStationProperty = t.property("from-station"),
            this._toStationProperty = t.property("to-station"),
            this._bindTo(this._fromStationProperty, "change", this._handleSelectedStationChange),
            this._bindTo(this._toStationProperty, "change", this._handleSelectedStationChange),
            this._bindTo(t.property("route-array"), "change", this._handleRouteArrayChange),
            this._bindTo(t.property("no-route-found"), "change", this._handleNoRouteFoundChange)
        },
        _handleSelectedStationChange: function() {
            var t = this._fromStationProperty.get()
              , e = this._toStationProperty.get()
              , i = this.getDomNode();
            t || e ? t && !e ? i.html(n("routing-hint", "select-to")) : !t && e && i.html(n("routing-hint", "select-from")) : i.html(n("routing-hint", "select-from-to"))
        },
        _handleRouteArrayChange: function(t) {
            t ? this._setState("hidden") : this._removeState("hidden")
        },
        _handleNoRouteFoundChange: function(t) {
            t ? (this._setState("display-error"),
            this.getDomNode().html(n("routing-hint", "error-no-route-found"))) : this._removeState("display-error")
        }
    }, {
        getBlockName: function() {
            return "routing-hint"
        }
    });
    t(o)
}),
modules.define("route-list", ["inherit", "y-block", "route-list-item", "bt", "statcount"], function(t, e, i, n, o, s) {
    var r = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._selectedId = -1,
            this._active = !1,
            this._blockUsed = !1
        },
        init: function(t) {
            this._routeArrayProperty = t.property("route-array"),
            this._selectedRouteProperty = t.property("selected-route")
        },
        activate: function() {
            this._active || (this._bindTo(this._routeArrayProperty, "change", this._handleRouteArrayChange),
            this._bindTo(this._selectedRouteProperty, "change", this._handleSelectedRouteChange),
            this._bindTo(n.getEmitter(this.getDomNode()), "click", this._handleItemClick),
            this._active = !0)
        },
        deactivate: function() {
            this._active && (this._unbindFrom(this._routeArrayProperty, "change", this._handleRouteArrayChange),
            this._unbindFrom(this._selectedRouteProperty, "change", this._handleSelectedRouteChange),
            this._unbindFrom(n.getEmitter(this.getDomNode()), "click", this._handleItemClick),
            this._active = !1)
        },
        _renderItems: function(t) {
            var e = t.map(function(t) {
                return {
                    block: "route-list-item",
                    routeId: t.getId(),
                    time: t.getMetrics().time,
                    transfers: t.getMetrics().transfers
                }
            }, this);
            this.getDomNode().html(o.apply(e))
        },
        _handleItemClick: function(t) {
            var e = this._routeArrayProperty.get();
            if (e) {
                var i = e.filter(function(e) {
                    return e.getId() === t.target.getId()
                })[0];
                this._selectedRouteProperty.set(i),
                this._sendStatistic()
            }
        },
        _sendStatistic: function() {
            this._blockUsed || (s({
                router: "alt-route-selected"
            }),
            this._blockUsed = !0)
        },
        _handleRouteArrayChange: function(t) {
            t ? (this._renderItems(t),
            this._buildHash(n.findAll(this.getDomNode())),
            this._removeState("hidden"),
            this.emit("shown")) : (this._dropHash(),
            this.getDomNode().empty(),
            this._setState("hidden"),
            this.emit("hidden"))
        },
        _handleSelectedRouteChange: function(t) {
            var e = this._hash
              , i = this._selectedId;
            e && e[i] && e[i].deselect(),
            i = -1,
            t && e[t.getId()] && (i = t.getId(),
            e[i].select()),
            this._selectedId = i
        },
        _buildHash: function(t) {
            t && (this._hash = t.reduce(function(t, e) {
                return t[e.getId()] = e,
                t
            }, {}))
        },
        _dropHash: function() {
            this._hash = null
        }
    }, {
        getBlockName: function() {
            return "route-list"
        }
    });
    t(r)
}),
modules.define("route-list-item", ["inherit", "y-block"], function(t, e, i) {
    var n = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._routeId = this._getOptions().routeId,
            this._bindTo(this.getDomNode(), "click", this._handleClick)
        },
        _handleClick: function() {
            this.emit("click")
        },
        select: function() {
            this._setState("selected")
        },
        deselect: function() {
            this._removeState("selected")
        },
        getId: function() {
            return this._routeId
        }
    }, {
        getBlockName: function() {
            return "route-list-item"
        }
    });
    t(n)
}),
modules.define("route-details-block", ["inherit", "y-block", "scrollable-block", "bt"], function(t, e, i, n, o) {
    var s = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._listElement = this._findElement("station-list"),
            this._scrollableBlock = n.find(this.getDomNode())
        },
        init: function(t) {
            this._bindTo(t.property("selected-route"), "change", this._onRoutePropertyChange)
        },
        isHidden: function() {
            return Boolean(this._getState("hidden"))
        },
        setMaxHeight: function(t) {
            this._scrollableBlock.setMaxHeight(t)
        },
        _onRoutePropertyChange: function(t) {
            t ? (this._renderRoute(t),
            this._removeState("hidden")) : (this._clearRoute(),
            this._setState("hidden"))
        },
        _renderRoute: function(t) {
            for (var e = [], i = t.getStations(), n = t.getLinks(), s = !1, r = 0; r < i.length; r++) {
                var a = i[r]
                  , c = n[r]
                  , h = a.getLine().getColor()
                  , l = 0 === r || r === i.length - 1;
                if (e.push({
                    block: "route-details-block",
                    elem: "station-list-item",
                    closed: a.isClosed(),
                    iconElement: {
                        elem: this._getStationElementName(a, c, s),
                        color: h
                    },
                    rightSideElement: {
                        elem: l ? "terminal-station" : "station",
                        name: a.getName()
                    }
                }),
                (a.isClosed() || l) && a.getHint() && e.push({
                    block: "route-details-block",
                    elem: "station-list-item",
                    iconElement: {
                        elem: this._getHintIconElementName(c),
                        color: h
                    },
                    rightSideElement: {
                        elem: "hint",
                        content: a.getHint()
                    }
                }),
                c) {
                    var u = 0 === r || s ? t.getStationBoardingPositions(a.getId()) : null ;
                    e.push({
                        block: "route-details-block",
                        elem: "station-list-item",
                        iconElement: {
                            elem: this._getLinkElementName(c, u),
                            color: h
                        },
                        rightSideElement: u ? {
                            elem: "boarding-scheme",
                            positions: u
                        } : null
                    }),
                    s = c.isTransfer()
                }
            }
            this._listElement.html(o.apply(e)),
            this._scrollableBlock.update()
        },
        _getLinkElementName: function(t, e) {
            return e ? "icon-link-long" : t.isTransfer() ? "icon-link-transfer" : "icon-link"
        },
        _getHintIconElementName: function(t) {
            return t ? t.isTransfer() ? "icon-link-transfer-empty" : "icon-link-avg" : "icon-empty"
        },
        _getStationElementName: function(t, e, i) {
            switch (Boolean(!0)) {
            case e && e.isTransfer() && !i:
                return "icon-station-transfer-start";
            case e && e.isTransfer() && i:
                return "icon-station-transfer-inner";
            case e && !e.isTransfer() && i:
            case !e && i:
                return "icon-station-transfer-end";
            default:
                return "icon-station"
            }
        },
        _clearRoute: function() {
            this._listElement.empty()
        }
    }, {
        getBlockName: function() {
            return "route-details-block"
        }
    });
    t(s)
}),
modules.define("sidebar", ["inherit", "y-block"], function(t, e, i) {
    var n = e(i, {}, {
        getBlockName: function() {
            return "sidebar"
        }
    });
    t(n)
}),
modules.define("scrollable-block", ["inherit", "y-block", "y-next-tick", "jquery"], function(t, e, i, n, o) {
    var s = o(document)
      , r = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._containerElement = this._findElement("container"),
            this._barElement = this._findElement("bar"),
            this._bindTo(this._barElement, "mousedown", this._onBarElementMouseDown),
            this._bindTo(this._containerElement, "scroll", this._onContainerScroll),
            "ontouchstart"in document.documentElement ? this._setState("touch-behavior") : this._setState("desktop-behavior")
        },
        update: function() {
            n(this._update.bind(this))
        },
        setMaxHeight: function(t) {
            t = 0 > t ? 0 : t,
            this._containerElement.css("max-height", t),
            this.update()
        },
        _setBarOffset: function(t) {
            0 > t ? t = 0 : t > this._maxBarOffset && (t = this._maxBarOffset),
            this._barElement.css("top", t)
        },
        _update: function() {
            this._containerElement.prop("scrollTop", 0),
            this._setBarOffset(0);
            var t = this._containerElement.prop("clientHeight")
              , e = this._containerElement.prop("scrollHeight");
            this._containerBarRatio = e ? t / e : 1 / 0,
            this._containerBarRatio < 1 ? (this._barElement.css("height", this._toBarHeight(t)),
            this._maxBarOffset = this._toBarHeight(e - t),
            this._removeState("bar-hidden")) : this._setState("bar-hidden")
        },
        _toBarHeight: function(t) {
            return Math.round(t * this._containerBarRatio)
        },
        _fromBarHeight: function(t) {
            return Math.round(t / this._containerBarRatio)
        },
        _onBarElementMouseDown: function(t) {
            t.preventDefault(),
            t.stopPropagation(),
            this._setState("bar-pressed"),
            this._prevPageY = t.pageY,
            this._bindTo(s, "mousemove", this._onDocumentMouseMove),
            this._bindTo(s, "mouseup", this._onDocumentMouseUp)
        },
        _onDocumentMouseMove: function(t) {
            var e = this._fromBarHeight(t.pageY - this._prevPageY);
            this._prevPageY = t.pageY;
            var i = this._containerElement.prop("scrollTop");
            this._containerElement.prop("scrollTop", i + e)
        },
        _onDocumentMouseUp: function() {
            this._removeState("bar-pressed"),
            this._unbindFrom(s, "mousemove", this._onDocumentMouseMove),
            this._unbindFrom(s, "mouseup", this._onDocumentMouseUp)
        },
        _onContainerScroll: function(t) {
            t.stopPropagation(),
            this._setBarOffset(this._toBarHeight(this._containerElement.prop("scrollTop")))
        }
    }, {
        getBlockName: function() {
            return "scrollable-block"
        }
    });
    t(r)
}),
modules.define("route-permalink-block", ["inherit", "y-block"], function(t, e, i) {
    var n = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._isTablet = this._getOptions().isTablet
        },
        init: function(t) {
            this._isTablet || this._bindTo(t.property("selected-route"), "change", this._onSelectedRouteChange)
        },
        _onSelectedRouteChange: function(t) {
            t ? this._removeState("hidden") : this._setState("hidden")
        }
    }, {
        getBlockName: function() {
            return "route-permalink-block"
        }
    });
    t(n)
}),
modules.define("metro-location", ["inherit", "location"], function(t, e, i) {
    var n = window.location
      , o = n.protocol
      , s = n.host
      , r = e({
        __constructor: function() {
            this._location = new i,
            this._initParams = this._location.getUrl().getParams()
        },
        applyInitParams: function() {
            var t = this._schemeProperty.get();
            if (t) {
                var e = this._initParams
                  , i = e.from ? t.getStationById(e.from) : null
                  , n = e.to ? t.getStationById(e.to) : null
                  , o = this._parseRouteParam(e.route);
                i && n && i.getId() !== n.getId() && (this._selectedRouteIndexProperty.set(o),
                this._fromStationProperty.set(i),
                this._toStationProperty.set(n))
            }
        },
        setSchemeProperty: function(t) {
            this._schemeProperty = t,
            this._schemeProperty.on("change", this._onSchemePropertyChange, this)
        },
        setRoutingProperties: function(t) {
            this._fromStationProperty = t.property("from-station"),
            this._toStationProperty = t.property("to-station"),
            this._selectedRouteProperty = t.property("selected-route"),
            this._selectedRouteIndexProperty = t.property("initial-selected-route-index"),
            this._routeArrayProperty = t.property("route-array"),
            this._selectedRouteProperty.on("change", this._onSelectedRoutePropertyChange, this)
        },
        getCurrentUrl: function() {
            return o + "//" + s + "/" + this._location.getUrl().render()
        },
        getCurrentHost: function() {
            return s
        },
        getParam: function(t) {
            return this._location.getUrl().getParam(t)
        },
        getCurrentTld: function() {
            var t = /\.(ru|by|ua|kz|com|com.tr|net)$/.exec(n.hostname);
            return t ? t[0].split(".")[1] : "ru"
        },
        areRoutingParamsSet: function() {
            return Boolean(this.getParam("from") && this.getParam("to"))
        },
        loadUrl: function(t) {
            n.href = t
        },
        _parseRouteParam: function(t) {
            var e = t ? parseInt(t, 10) : 0;
            return e = isNaN(e) ? 0 : e,
            e = 0 > e ? 0 : e
        },
        _onSchemePropertyChange: function(t) {
            var e = this._location;
            e.rewrite(e.getUrl().getParams(), t.getAlias())
        },
        _onSelectedRoutePropertyChange: function(t) {
            var e = this._location;
            if (t) {
                var i = {
                    from: this._fromStationProperty.get().getId(),
                    to: this._toStationProperty.get().getId(),
                    route: this._getRouteIndex()
                };
                e.rewrite(i)
            } else
                e.rewrite({})
        },
        _getRouteIndex: function() {
            var t = 0
              , e = this._routeArrayProperty.get()
              , i = this._selectedRouteProperty.get()
              , n = i ? i.getId() : 0;
            return e && e.forEach(function(e, i) {
                e.getId() === n && (t = i)
            }),
            t
        }
    });
    t(new r)
}),
modules.define("location", ["inherit", "y-event-emitter", "url", "jquery"], function(t, e, i, n, o) {
    var s = window.history
      , r = Boolean(s.pushState)
      , a = e(i, {
        __constructor: function(t) {
            if (t ? (this._url = n.parse("/?" + t),
            s.replaceState(null , document.title, this._url.render())) : this._url = n.parse(window.location.pathname + window.location.search),
            this._url.on("change", function() {
                this.emit("change")
            }, this),
            r) {
                var e = this;
                o(window).on("popstate", function() {
                    var t = n.parse(window.location.pathname + window.location.search);
                    e._url.setPath(t.getPath()),
                    e._url.replaceParams(t.getParams())
                })
            }
        },
        getUrl: function() {
            return this._url
        },
        rewrite: function(t, e) {
            e && this._url.setPath(e),
            this._url.replaceParams(t),
            r && s.replaceState(null , document.title, this._url.render())
        },
        navigate: function(t, e) {
            e && this._url.setPath(e),
            this._url.replaceParams(t),
            r && s.pushState(null , document.title, this._url.render())
        }
    });
    t(a)
}),
modules.define("url", ["inherit", "y-event-emitter", "y-extend", "querystring"], function(t, e, i, n, o) {
    var s = Object.prototype.hasOwnProperty
      , r = e(i, {
        __constructor: function() {
            this._path = "",
            this._params = {}
        },
        getPath: function() {
            return this._path
        },
        setPath: function(t) {
            this._path !== t && (this._path = t,
            this.emit("change"))
        },
        getParam: function(t) {
            return this._params[t]
        },
        setParam: function(t, e) {
            this._params[t] !== e && (this._params[t] = e,
            this.emit("change"))
        },
        removeParam: function(t) {
            s.call(this._params, t) && (delete this._params[t],
            this.emit("change"))
        },
        getParams: function() {
            return n({}, this._params)
        },
        setParams: function(t) {
            var e = !1
              , i = this._params;
            Object.keys(t).forEach(function(n) {
                i[n] !== t[n] && (i[n] = t[n],
                e = !0)
            }),
            e && this.emit("change")
        },
        replaceParams: function(t) {
            var e = !1
              , i = this._params;
            Object.keys(i).forEach(function(n) {
                s.call(t, n) || (e = !0,
                delete i[n])
            }),
            Object.keys(t).forEach(function(n) {
                i[n] !== t[n] && (i[n] = t[n],
                e = !0)
            }),
            e && this.emit("change")
        },
        render: function() {
            var t = o.stringify(this._params);
            return this._path + (t ? "?" + t : "")
        }
    }, {
        parse: function(t) {
            var e = new r
              , i = t.split("?");
            return e.setPath(i[0]),
            2 === i.length && e.setParams(o.parse(i[1])),
            e
        }
    });
    t(r)
}),
modules.define("querystring", function(t) {
    function e(t, e, i) {
        t.push(encodeURIComponent(e) + "=" + (null == i ? "" : encodeURIComponent(i)))
    }
    t({
        parse: function(t) {
            if (!t)
                return {};
            var e = Object.prototype.hasOwnProperty;
            return t.split("&").reduce(function(t, i) {
                if (i) {
                    var n, o, s = i.indexOf("=");
                    s >= 0 ? (n = i.substr(0, s),
                    o = i.substr(s + 1)) : (n = i,
                    o = ""),
                    n = decodeURIComponent(n),
                    o = decodeURIComponent(o),
                    e.call(t, n) ? Array.isArray(t[n]) ? t[n].push(o) : t[n] = [t[n], o] : t[n] = o
                }
                return t
            }, {})
        },
        stringify: function(t) {
            return Object.keys(t).reduce(function(i, n) {
                var o = t[n];
                return Array.isArray(o) ? o.forEach(function(t) {
                    e(i, n, t)
                }) : e(i, n, o),
                i
            }, []).join("&")
        }
    })
}),
modules.define("adv-block", ["inherit", "y-block", "vow", "scrollable-block", "y-load-script", "config"], function(t, e, i, n, o, s, r) {
    var a = "yandexContextAsyncCallbacks"
      , c = {
        0: "R-124536-3",
        250: "R-124536-3",
        300: "R-124536-2",
        400: "R-124536-1"
    }
      , h = "yandex_ad_"
      , l = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._scrollableBlock = o.find(this.getDomNode()),
            this._rendered = new n.Deferred
        },
        render: function() {
            var t = this._rendered.promise();
            return t.isResolved() || this._load(),
            t
        },
        show: function() {
            this._removeState("hidden")
        },
        hide: function() {
            this._setState("hidden")
        },
        isHidden: function() {
            return Boolean(this._getState("hidden"))
        },
        setMaxHeight: function(t) {
            t = 0 > t ? 0 : t,
            this._node.css("max-height", t),
            this._scrollableBlock.setMaxHeight(t),
            this._maxHeight = t
        },
        _load: function() {
            var t;
            Object.keys(c).forEach(function(e) {
                var i = parseInt(e, 10);
                this._maxHeight >= i && (t = c[e])
            }, this);
            var e = this._onContentRendered.bind(this)
              , i = this._rtbAltCallback.bind(this)
              , n = h + t;
            this._findElement("inner-container").get(0).id = n,
            window[a] = window[a] || [],
            window[a].push(function() {
                window.Ya.Context.AdvManager.render({
                    blockId: t,
                    renderTo: n,
                    async: !0,
                    onRender: e
                }, i)
            }),
            s(r.hosts.yaContext)
        },
        _onContentRendered: function() {
            this._setState("rendered"),
            this._scrollableBlock.update(),
            this._rendered.resolve()
        },
        _rtbAltCallback: function() {
            this._rendered.reject()
        }
    }, {
        getBlockName: function() {
            return "adv-block"
        }
    });
    t(l)
}),
modules.define("notification-view", ["inherit", "y-block", "bt"], function(t, e, i, n) {
    var o = e(i, {
        isHidden: function() {
            return Boolean(this._getState("hidden"))
        },
        showNotifications: function(t) {
            t && t.length > 0 ? (this._renderNotifications(t),
            this._removeState("hidden")) : this._setState("hidden")
        },
        _renderNotifications: function(t) {
            this.getDomNode().html(n.apply(t.map(function(t) {
                return {
                    block: "notification-view",
                    elem: "notification",
                    text: t
                }
            })))
        }
    }, {
        getBlockName: function() {
            return "notification-view"
        }
    });
    t(o)
}),
modules.define("router", ["inherit", "route", "filter"], function(t, e, Route, n) {
    var o = {
        transferToleranceCount: 1,
        hopToleranceRatio: 2,
        timeToleranceRatio: 2,
        lineGraphMaxDepth: 3,
        filterConfig: [{
            name: "CheckForDirectRoute"
        }, {
            name: "RemoveDoubleTransferRoutes"
        }, {
            name: "Genarcho",
            args: {
                timeToleranceRatio: 1.2,
                transferToleranceCount: 1
            }
        }]
    };
    t(e({
        __constructor: function() {
            this._optimal = {},
            this._limit = {},
            this._currRouteId = 0,
            this._filter = new n(o.filterConfig)
        },
        _resetLimits: function() {
            this._optimal.time = 1 / 0,
            this._optimal.transfers = o.lineGraphMaxDepth + o.transferToleranceCount,
            this._optimal.hops = 1 / 0,
            this._limit.time = 1 / 0,
            this._limit.transfers = o.lineGraphMaxDepth + o.transferToleranceCount,
            this._limit.hops = 1 / 0
        },
        _isWithinLimits: function(t) {
            return t.transfers <= this._limit.transfers && t.time <= this._optimal.time || t.transfers <= this._optimal.transfers && t.time <= this._limit.time || t.transfers <= this._limit.transfers && t.hops <= this._optimal.hops
        },
        _updateLimits: function(t) {
            t.transfers < this._optimal.transfers && (this._optimal.transfers = t.transfers,
            0 === this._optimal.transfers && (this._limit.transfers = 0)),
            t.time < this._optimal.time && (this._optimal.time = t.time,
            this._limit.time = this._optimal.time * o.timeToleranceRatio),
            t.hops < this._optimal.hops && (this._optimal.hops = t.hops,
            this._limit.hops = this._optimal.hops * o.hopToleranceRatio)
        },
        _recursiveRoutingCall: function(from_station, to_station, route) {
            var routes = [];
            if (this._isWithinLimits(route.getMetrics())) {
                if (from_station.getId() === to_station.getId()) {
                    return route = route || new Route,
                        route.addStation(from_station),
                        route.setId(this._currRouteId++),
                        this._updateLimits(route.getMetrics()),
                        routes.push(route),
                        routes
                } else {
                    return route = route || new Route,
                        route.addStation(from_station),
                        from_station.getLinks().forEach(function (i) {
                            var s = i.getOppositeStation(from_station);
                            if (!s.isFullyClosed() && !route.isStationVisited(s)) {
                                var r = route.clone();
                                r.goThroughLink(i);
                                var a = this._recursiveRoutingCall(s, to_station, r);
                                a.length > 0 && (routes = routes.concat(a))
                            }
                        }, this),
                        routes
                }
            } else {
                return route = route || new Route,
                    route.addStation(from_station),
                    routes
            }
        },
        findRoutes: function(t, e) {
            return this._resetLimits(),
            this._filter.process(this._recursiveRoutingCall(t, e))
        }
    }))
}),
modules.define("route", ["inherit"], function(t, e) {
    var i = e({
        __constructor: function(t) {
            t = t || {},
            this._metrics = {
                time: t.metricsTime || 0,
                transfers: t.metricsTransfers || 0,
                hops: t.metricsHops || 0
            },
            this._stations = t.stations || [],
            this._links = t.links || [],
            this._stationIds = t.stationIds || [],
            this._sealed = t.sealed || !1
        },
        _isSealed: function() {
            return this._sealed
        },
        addStation: function(t) {
            this._isSealed() || (this._stations.push(t),
            this._stationIds.push(t.getId()),
            this._metrics.hops++)
        },
        goThroughLink: function(t) {
            this._isSealed() || (this._links.push(t),
            this._metrics.time += t.getWeightTime(),
            this._metrics.transfers += t.getWeightTransfers())
        },
        finalize: function() {
            this._metrics.displayTransfers = this._metrics.transfers,
            this._links[0] && this._links[0].isTransfer() && this._metrics.transfers > 0 && this._metrics.transfers--;
            var t = this._links.length - 1;
            this._links[t] && this._links[t].isTransfer() && this._metrics.transfers > 0 && this._metrics.transfers--
        },
        getStationBoardingPositions: function(t) {
            return this._boardPositions && this._boardPositions[t]
        },
        setBoardingPositions: function(t) {
            this._boardPositions = t.reduce(function(t, e) {
                return t[e.stationId] = e.positions,
                t
            }, {})
        },
        isStationVisited: function(t) {
            return -1 !== this._stationIds.indexOf(t.getId())
        },
        setId: function(t) {
            this._isSealed() || (this._id = t)
        },
        getId: function() {
            return this._id
        },
        getStations: function() {
            return this._stations
        },
        getLinks: function() {
            return this._links
        },
        seal: function() {
            this._sealed = !0
        },
        unseal: function() {
            this._sealed = !1
        },
        clone: function() {
            return new i({
                metricsTime: this._metrics.time,
                metricsTransfers: this._metrics.transfers,
                metricsHops: this._metrics.hops,
                stations: this._stations.slice(),
                stationIds: this._stationIds.slice(),
                links: this._links.slice(),
                sealed: this._sealed
            })
        },
        getMetrics: function() {
            return this._metrics
        }
    });
    t(i)
}),
modules.define("filter", ["inherit", "atomic-filters-ns", "route-sorter"], function(t, e, i, n) {
    t(e({
        __constructor: function(t) {
            var e = {
                sort: (new n).sort
            };
            this._filters = t.map(function(t) {
                if (!i[t.name])
                    throw new Error("No filter with name " + t.name + " in the atomic-filters module");
                return new i[t.name](e,t.args)
            }, this)
        },
        process: function(t) {
            var e = t.slice();
            return this._filters.forEach(function(t) {
                return e.length < 2 ? e : void (e = t.process(e))
            }, this),
            e
        },
        extract: function(t) {
            var e = [];
            this._filters.forEach(function(i) {
                e = i.process(t).concat(e)
            }, this);
            var i = [];
            return e.filter(function(t) {
                return -1 === i.indexOf(t.getId()) ? (i.push(t.getId()),
                !0) : !1
            })
        }
    }))
}),
modules.define("atomic-filters-ns", ["check-for-direct-route", "fastest-routes", "least-amount-of-transfers", "remove-redundant-routes", "remove-double-transfer-routes", "genarcho", "transfer-penalty-sort", "trim-results"], function(t, e, i, n, o, s, r, a, c) {
    t({
        CheckForDirectRoute: e,
        FastestRoutes: i,
        LeastAmountOfTransfers: n,
        RemoveRedundantRoutes: o,
        RemoveDoubleTransferRoutes: s,
        Genarcho: r,
        TransferPenaltySort: a,
        TrimResults: c
    })
}),
modules.define("check-for-direct-route", ["inherit"], function(t, e) {
    t(e({
        __constructor: function(t) {
            this._ctx = t
        },
        process: function(t) {
            var e = this._ctx.sort(t, "transfersTime");
            return 0 === e[0].getMetrics().transfers ? [e[0]] : e
        }
    }))
}),
modules.define("fastest-routes", ["inherit"], function(t, e) {
    t(e({
        __constructor: function(t) {
            this._ctx = t
        },
        process: function(t) {
            return this._ctx.sort(t, "timeTransfers")
        }
    }))
}),
modules.define("least-amount-of-transfers", ["inherit"], function(t, e) {
    t(e({
        __constructor: function(t) {
            this._ctx = t
        },
        process: function(t) {
            return this._ctx.sort(t, "transfersTime")
        }
    }))
}),
modules.define("remove-redundant-routes", ["inherit"], function(t, e) {
    t(e({
        __constructor: function(t, e) {
            this._ctx = t,
            this._timeToleranceRatio = e.timeToleranceRatio,
            this._transferToleranceAndCount = e.transferToleranceCount
        },
        process: function(t) {
            var e = this._ctx.sort(t, "time")[0].getMetrics().time * this._timeToleranceRatio
              , i = this._ctx.sort(t, "transfers")[0].getMetrics().transfers + this._transferToleranceAndCount;
            return t.filter(function(t) {
                return !(t.getMetrics().time > e || t.getMetrics().transfers > i)
            }, this)
        }
    }))
}),
modules.define("remove-double-transfer-routes", ["inherit"], function(t, e) {
    t(e({
        __constructor: function(t) {
            this._ctx = t
        },
        process: function(routes) {
            return routes.filter(function(route) {
                if (route.getMetrics().transfers < 2)
                    return !0;
                var station_id = route.getStations()[0].getId()
                  , station_line_id = route.getStations()[0].getLine().getId()
                  , visited_station_ids = [];
                return route.getStations().every(function(station) {
                    var line_id = station.getLine().getId();
                    if (line_id !== station_line_id) {
                        if (visited_station_ids.push(station_id),
                        visited_station_ids.length > 1)
                            return station.getLinks().every(function(link) {
                                return link.getFromStation().getId() !== visited_station_ids[0] && link.getToStation().getId() !== visited_station_ids[0]
                            })
                    } else {
                        visited_station_ids.length > 0 && (visited_station_ids = []);
                    }
                    return station_line_id = line_id,
                    station_id = station.getId(),
                    !0
                }, this)
            }, this)
        }
    }))
}),
modules.define("genarcho", ["inherit"], function(t, e) {
    var i = e({
        __constructor: function(t, e) {
            this._ctx = t,
            this._timeToleranceRatio = e.timeToleranceRatio,
            this._transferToleranceCount = e.transferToleranceCount
        },
        process: function(routes) {
            var time_transfers_sorted = this._ctx.sort(routes, "timeTransfers")
              , transfers_time_sorted = this._ctx.sort(routes, "transfersTime")
              , route_ids = [];
            route_ids.push(time_transfers_sorted[0].getId()),
            route_ids.push(transfers_time_sorted[0].getId());
            var time_tolerance = time_transfers_sorted[0].getMetrics().time * this._timeToleranceRatio
              , transfer_tolerance = time_transfers_sorted[0].getMetrics().transfers + this._transferToleranceCount;
            time_transfers_sorted.some(function(route) {
                if (route.getId() !== time_transfers_sorted[0].getId() && route.getId() !== transfers_time_sorted[0].getId() && route.getMetrics().time <= time_tolerance && route.getMetrics().transfers <= transfer_tolerance) {
                    return route_ids.push(route.getId()),
                        !0
                } else {
                    return !1
                }
            });
            var visited_ids = []
              , result_routes = [];
            return route_ids.forEach(function(route_id) {
                if (-1 === visited_ids.indexOf(route_id)) {
                    var founded_route;
                    routes.some(function(route) {
                        return route.getId() === route_id && (founded_route = route)
                    }),
                    founded_route && result_routes.push(founded_route),
                    visited_ids.push(route_id)
                }
            }),
            this._ctx.sort(result_routes, "roundedTimeTransfers")
        }
    });
    t(i)
}),
modules.define("transfer-penalty-sort", ["inherit"], function(t, e) {
    var i = e({
        __constructor: function(t, e) {
            this._ctx = t,
            this._penaltyRatio = e.penaltyRatio
        },
        process: function(t) {
            var e = t.map(function(t) {
                var e = 1 + t.getMetrics().transfers * this._penaltyRatio;
                return {
                    id: t.getId(),
                    time: e * t.getMetrics().time,
                    transfers: t.getMetrics().transfers
                }
            }, this).sort(function(t, e) {
                var i = t.time - e.time;
                return i ? i : t.transfers - e.transfers
            })
              , i = []
              , n = [];
            return e.forEach(function(e) {
                if (-1 === i.indexOf(e.id)) {
                    var o;
                    t.some(function(t) {
                        return t.getId() === e.id && (o = t)
                    }),
                    o && n.push(o),
                    i.push(e.id)
                }
            }),
            n
        }
    });
    t(i)
}),
modules.define("trim-results", ["inherit"], function(t, e) {
    t(e({
        __constructor: function(t, e) {
            this._ctx = t,
            this._sliceCount = e.sliceCount
        },
        process: function(t) {
            return t.slice(0, this._sliceCount)
        }
    }))
}),
modules.define("route-sorter", ["inherit"], function(t, e) {
    var i = {
        transfers: function(t, e) {
            return t.getMetrics().transfers - e.getMetrics().transfers
        },
        time: function(t, e) {
            return t.getMetrics().time - e.getMetrics().time
        },
        transfersTime: function(t, e) {
            var n = i.transfers(t, e);
            return n ? n : i.time(t, e)
        },
        timeTransfers: function(t, e) {
            var n = i.time(t, e);
            return n ? n : i.transfers(t, e)
        },
        roundedTimeTransfers: function(t, e) {
            var n = Math.round(t.getMetrics().time / 60)
              , o = Math.floor(n / 60)
              , s = Math.round(e.getMetrics().time / 60)
              , r = Math.floor(s / 60)
              , a = o - r;
            if (a)
                return a;
            var c = n - s;
            return c ? c : i.transfers(t, e)
        }
    };
    t(e({
        sort: function(t, e) {
            if (!t.sort)
                throw new Error("The provided object is not an array");
            if (!i[e])
                throw new Error("No such sorting method");
            return t.slice().sort(i[e])
        }
    }))
}),
modules.define("find-boarding-positions", ["sort-by-similarity"], function(t, e) {
    function i(t) {
        return o + s - t
    }
    function n(t) {
        for (var n = [], o = t.getStations(), s = t.getLinks(), r = o[0], a = s[0], c = a.isTransfer() ? o[1] : o[0], h = 1; h < o.length; h++) {
            var l = o[h]
              , u = o[h + 1]
              , d = o[h + 2];
            if (!u || l.getLine().getId() !== u.getLine().getId()) {
                var m = l.getBoardInfo();
                if (m && !a.isTransfer()) {
                    var _ = u ? m.transfer : m.exit;
                    if (_) {
                        var f = {
                            prevSt: r.getId(),
                            toSt: u && u.getId(),
                            nextSt: d && d.getId()
                        }
                          , p = e(f, _)[0]
                          , g = a.getFromStation().getId() === r.getId()
                          , v = g || -1 !== p.matchNames.indexOf("prevSt") ? p.object.pos : p.object.pos.map(i);
                        n.push({
                            stationId: c.getId(),
                            positions: v
                        })
                    }
                }
                c = u
            }
            r = l,
            a = s[h]
        }
        return n
    }
    var o = 1
      , s = 5;
    t(n)
}),
modules.define("sort-by-similarity", function(t) {
    function e(t, e) {
        return t && Array.isArray(e) ? e.map(function(e) {
            var i = e ? Object.keys(e).filter(function(i) {
                return t[i] && e[i] === t[i]
            }) : [];
            return {
                matchCount: i.length,
                matchNames: i,
                model: t,
                object: e
            }
        }).sort(function(t, e) {
            return e.matchCount - t.matchCount
        }) : []
    }
    t(e)
}),
modules.define("scheme-switcher", ["inherit", "y-block", "y-i18n", "select", "statcount"], function(t, e, i, n, o, s) {
    var r = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._select = o.find(this.getDomNode())
        },
        init: function(t) {
            this._currentSchemeProperty = t.property("current-scheme"),
            this._schemeHashmap = t.get("scheme-hashmap"),
            this._setSchemes(t.get("scheme-array")),
            this._bindTo(this._currentSchemeProperty, "change", this._onCurrentSchemePropertyChange),
            this._bindTo(this._select, "select", this._onSelectSelect);
            var e = t.get("current-scheme");
            e && this._select.selectItem(e.getId())
        },
        _setSchemes: function(t) {
            this._select.setItems(t.reduce(function(t, e) {
                return t[e.getId()] = n("cities", e.getAlias()),
                t
            }, {}, this))
        },
        _onSelectSelect: function(t) {
            var e = t.data
              , i = this._currentSchemeProperty.get()
              , n = this._schemeHashmap[e];
            this._currentSchemeProperty.set(n),
            s({
                "scheme-switcher": {
                    switched: i.getAlias() + "->" + n.getAlias()
                }
            })
        },
        _onCurrentSchemePropertyChange: function(t) {
            t && this._select.selectItem(t.getId())
        }
    }, {
        getBlockName: function() {
            return "scheme-switcher"
        }
    });
    t(r)
}),
modules.define("select", ["inherit", "y-block", "y-popup", "bt", "jquery", "select-item"], function(t, e, i, n, o, s, r) {
    var a = "mousedown MSPointerDown pointerdown touchstart"
      , c = s(window)
      , h = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments);
            var t = this._getOptions();
            this._itemView = t.itemView,
            this._text = this._findElement("text"),
            this._button = this._findElement("button"),
            this._popup = new n({
                zIndex: t.dropZIndex,
                showArrow: t.dropShowArrow,
                position: t.dropPosition,
                padding: 0,
                hideOnClickOutside: !1
            }),
            this._bindTo(this._button, "mousedown", this._onButtonMouseDown),
            this._bindTo(this._popup, "show", this._onPopupShow),
            this._bindTo(this._popup, "hide", this._onPopupHide),
            t.items && this.setItems(t.items)
        },
        _onPopupShow: function() {
            this._setState("drop-visible"),
            this._bindTo(c, a, this._onWinActionOutside)
        },
        _onPopupHide: function() {
            this._removeState("drop-visible"),
            this._unbindFrom(c, a, this._onWinActionOutside)
        },
        _onButtonMouseDown: function() {
            this._setState("pressed"),
            this._bindTo(c, "mouseup", this._onWinMouseUp);
            var t = this._popup;
            t.isShown() ? t.hide() : t.showAt(this.getDomNode())
        },
        _onWinMouseUp: function() {
            this._removeState("pressed"),
            this._unbindFrom(c, "mouseup", this._onWinMouseUp)
        },
        _onWinActionOutside: function(t) {
            var e = this._button
              , i = this._popup.getDomNode()
              , n = t.target;
            !this._popup.isShown() || i.has(n).length || i.is(n) || e.has(n).length || e.is(n) || this._popup.hide()
        },
        _onItemSelect: function(t) {
            var e = t.data;
            this.emit("select", e),
            this._popup.hide()
        },
        _setText: function(t) {
            this._text.html(t)
        },
        _registerItems: function() {
            var t = this._popup.getDomNode();
            this._items = r.findAll(t),
            this._bindTo(r.getEmitter(t), "select", this._onItemSelect)
        },
        setItems: function(t, e) {
            t = t || {},
            e = e ? e.toString() : "";
            var i = {
                block: "select",
                elem: "drop",
                items: Object.keys(t).map(function(i) {
                    return {
                        block: "select-item",
                        view: this._itemView,
                        text: t[i],
                        key: i,
                        selected: e === i
                    }
                }, this)
            };
            this._popup.setContent(o.apply(i)),
            this._registerItems()
        },
        selectItem: function(t) {
            this._items && (t = t.toString(),
            this._items.forEach(function(e) {
                e.isSelected() && e.markAsNotSelected(),
                e.getKey() === t && (e.markAsSelected(),
                this._setText(e.getText()))
            }, this))
        }
    }, {
        getBlockName: function() {
            return "select"
        }
    });
    t(h)
}),
modules.define("select-item", ["inherit", "y-block"], function(t, e, i) {
    var n = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._bindTo(this.getDomNode(), "mouseup", this._onMouseUp),
            this._key = this._getOptions().key,
            this._textContainer = this.getDomNode()
        },
        getKey: function() {
            return this._key
        },
        getText: function() {
            return this._textContainer.text()
        },
        _onMouseUp: function() {
            this.emit("select", this._key)
        },
        markAsSelected: function() {
            this._setState("selected")
        },
        markAsNotSelected: function() {
            this._removeState("selected")
        },
        isSelected: function() {
            return Boolean(this._getState("selected"))
        }
    }, {
        getBlockName: function() {
            return "select-item"
        }
    });
    t(n)
}),
modules.define("scheme", ["inherit", "scheme-line", "scheme-station", "scheme-link", "scheme-label", "scheme-transfer"], function(t, e, i, n, o, s, r) {
    var a = e({
        __constructor: function(t) {
            this._id = t.id,
            this._lang = t.lang,
            this._alias = t.alias
        },
        populateGraph: function(t) {
            this._lines = this._createLineList(t.lines),
            this._lineArray = this._getArrayFromList(this._lines),
            this._links = this._createLinkList(t.links),
            this._linkArray = this._getArrayFromList(this._links),
            this._stations = this._createStationList(t.stations),
            this._stationArray = this._getArrayFromList(this._stations),
            this._labels = this._createLabelList(t.labels),
            this._labelArray = this._getArrayFromList(this._labels),
            this._transfers = this._createTransferList(t.transfers),
            this._transferArray = this._getArrayFromList(this._transfers),
            this._populateLinksStationFields(t.links),
            this._graphPopulated = !0
        },
        setImage: function(t) {
            this._image = t,
            this._setImageMetadata({
                width: parseInt(t.getAttribute("width"), 10),
                height: parseInt(t.getAttribute("height"), 10)
            })
        },
        _setImageMetadata: function(t, e) {
            this._canvasSize = t,
            e && e.x && e.y ? this._canvasCenter = e : this._canvasCenter = {
                x: t.width / 2,
                y: t.height / 2
            }
        },
        isLoaded: function() {
            return Boolean(this._graphPopulated && this._image && this._canvasSize && this._canvasCenter)
        },
        setNotifications: function(t) {
            this._notifications = t
        },
        getNotifications: function() {
            return this._notifications
        },
        _createLineList: function(t) {
            return Object.keys(t).reduce(function(e, n) {
                return e[n] = new i({
                    id: parseInt(n, 10),
                    name: t[n].name,
                    color: t[n].color
                }),
                e
            }, {})
        },
        _createLinkList: function(t) {
            return Object.keys(t).reduce(function(e, i) {
                return e[i] = new o({
                    id: parseInt(i, 10),
                    weightTime: t[i].weightTime,
                    weightTransfers: t[i].weightTransfer,
                    fromStation: null ,
                    toStation: null ,
                    transferId: t[i].transferId
                }),
                e
            }, {})
        },
        _createLabelList: function(t) {
            var e = this._stations;
            return Object.keys(t).reduce(function(i, n) {
                var o = t[n].stationIds.map(function(t) {
                    return e[t]
                });
                return i[n] = new s({
                    id: parseInt(n, 10),
                    stations: o
                }),
                i
            }, {});
        },
        _createStationList: function(t) {
            if (!this._links || !this._lines)
                throw new Error("Init the lines and the links first");
            var e, i = this;
            return Object.keys(t).reduce(function(o, s) {
                return e = t[s].linkIds.map(function(t) {
                    return i._links[t]
                }),
                o[s] = new n({
                    id: parseInt(s, 10),
                    name: t[s].name,
                    links: e,
                    line: i._lines[t[s].lineId],
                    labelId: t[s].labelId,
                    boardInfo: t[s].boardInfo,
                    changes: t[s].changes
                }),
                o
            }, {})
        },
        _createTransferList: function(t) {
            return Object.keys(t).reduce(function(e, i) {
                return e[i] = new r({
                    id: parseInt(i, 10),
                    stationIds: t[i].stationIds,
                    linkIds: t[i].linkIds
                }),
                e
            }, {})
        },
        _populateLinksStationFields: function(t) {
            if (!this._links || !this._stations)
                throw new Error("Init the links and the stations link first");
            Object.keys(this._links).forEach(function(e) {
                this._links[e].setFromStation(this._stations[t[e].fromStationId]),
                this._links[e].setToStation(this._stations[t[e].toStationId])
            }, this)
        },
        _getArrayFromList: function(t) {
            return Object.keys(t).map(function(e) {
                return t[e]
            })
        },
        getImage: function() {
            return this._image
        },
        getId: function() {
            return this._id
        },
        getAlias: function() {
            return this._alias
        },
        getLang: function() {
            return this._lang
        },
        getCanvasSize: function() {
            return this._canvasSize
        },
        getCanvasCenter: function() {
            return this._canvasCenter
        },
        getLineById: function(t) {
            return this._lines[t]
        },
        getStationById: function(t) {
            return this._stations[t]
        },
        getLinkById: function(t) {
            return this._links[t]
        },
        getLabelById: function(t) {
            return this._labels[t]
        },
        getTransferById: function(t) {
            return this._transfers[t]
        },
        getLineArray: function() {
            return this._lineArray
        },
        getStationArray: function() {
            return this._stationArray
        },
        getLinkArray: function() {
            return this._linkArray
        },
        getLabelArray: function() {
            return this._labelArray
        },
        getTransferArray: function() {
            return this._transferArray
        }
    });
    t(a)
}),
modules.define("scheme-line", ["inherit"], function(t, e) {
    t(e({
        __constructor: function(t) {
            this._id = t.id,
            this._name = t.name,
            this._color = t.color
        },
        getId: function() {
            return this._id
        },
        getName: function() {
            return this._name
        },
        getColor: function() {
            return this._color
        }
    }))
}),
modules.define("scheme-station", ["inherit", "config"], function(t, e, i) {
    var n = i.closedStationTypes;
    t(e({
        __constructor: function(t) {
            this._id = t.id,
            this._name = t.name,
            this._links = t.links,
            this._line = t.line,
            this._labelId = t.labelId,
            this._boardInfo = t.boardInfo,
            this._parseChanges(t.changes)
        },
        _parseChanges: function(t) {
            t && (t.closed && (this._closed = t.closed && -1 !== n.entrance.indexOf(t.closed.type),
            this._fullyClosed = t.closed && -1 !== n.passage.indexOf(t.closed.type),
            this._visible = t.closed ? t.closed.visible : !0),
            t.hint && (this._hint = t.hint))
        },
        getId: function() {
            return this._id
        },
        getName: function() {
            return this._name
        },
        getLabelId: function() {
            return this._labelId
        },
        getLinks: function() {
            return this._links
        },
        getLine: function() {
            return this._line
        },
        getBoardInfo: function() {
            return this._boardInfo
        },
        isClosed: function() {
            return Boolean(this._closed)
        },
        isFullyClosed: function() {
            return Boolean(this._fullyClosed)
        },
        isVisible: function() {
            return this._visible
        },
        getHint: function() {
            return this._hint
        }
    }))
}),
modules.define("scheme-link", ["inherit"], function(t, e) {
    t(e({
        __constructor: function(t) {
            this._id = t.id,
            this._weightTime = t.weightTime,
            this._weightTransfers = t.weightTransfers,
            this._toStation = t.toStation,
            this._fromStation = t.fromStation,
            this._transferId = t.transferId
        },
        getId: function() {
            return this._id
        },
        getWeightTime: function() {
            return this._weightTime
        },
        getWeightTransfers: function() {
            return this._weightTransfers
        },
        isTransfer: function() {
            return 0 !== this._weightTransfers
        },
        setFromStation: function(t) {
            this._fromStation = t
        },
        getFromStation: function() {
            return this._fromStation
        },
        setToStation: function(t) {
            this._toStation = t
        },
        getToStation: function() {
            return this._toStation
        },
        getTransferId: function() {
            return this._transferId
        },
        getOppositeStation: function(t) {
            return t.getId() === this._fromStation.getId() ? this._toStation : this._fromStation
        }
    }))
}),
modules.define("scheme-label", ["inherit"], function(t, e) {
    var i = e({
        __constructor: function(t) {
            this._id = t.id,
            this._stations = t.stations,
            this._isMultiStation = this._stations.length > 1
        },
        getId: function() {
            return this._id
        },
        getStations: function() {
            return this._stations
        },
        isMultiStation: function() {
            return this._isMultiStation
        }
    });
    t(i)
}),
modules.define("scheme-transfer", ["inherit"], function(t, e) {
    var i = e({
        __constructor: function(t) {
            this._id = t.id,
            this._stationIds = t.stationIds
        },
        getId: function() {
            return this._id
        },
        getStationIds: function() {
            return this._stationIds
        }
    });
    t(i)
}),
modules.define("footer", ["inherit", "y-block", "y-i18n", "statcount"], function(t, e, i, n, o) {
    var s = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._findAllElements("link-item").forEach(function(t) {
                var e = t.attr("data-counter");
                e && t.on("click", function() {
                    o({
                        links: {
                            clicked: e
                        }
                    })
                })
            }),
            this._findElement("get-mobile-app-link").on("click", function() {
                o({
                    links: {
                        clicked: "mobile-app-promo"
                    }
                })
            })
        },
        init: function(t) {
            t.on("change-current-scheme", this._onChangeCurrentScheme, this)
        },
        _onChangeCurrentScheme: function(t) {
            var e = n("cities-genitive", t.getAlias());
            this._findElement("mobile-link").find("a").text(n("footer", "get-mobile-app", {
                CityName: e
            }))
        }
    }, {
        getBlockName: function() {
            return "footer"
        }
    });
    t(s)
}),
modules.define("lang-switcher", ["inherit", "y-block", "select", "config", "metro-location", "sprintf", "y-i18n", "statcount"], function(t, e, i, n, o, s, r, a, c) {
    var h = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._bindTo(n.find(this.getDomNode()), "select", this._selectItemSelect)
        },
        _selectItemSelect: function(t) {
            var e = t.data;
            e !== a.getLanguage() && (c({
                "lang-switcher": {
                    switched: a.getLanguage() + "->" + e
                }
            }),
            s.loadUrl(r(o.hosts.switchLang, s.getCurrentTld(), e, encodeURIComponent(s.getCurrentUrl()), o.sk)))
        }
    }, {
        getBlockName: function() {
            return "lang-swicher"
        }
    });
    t(h)
}),
modules.define("sprintf", function(t) {
    function e(t) {
        if (!t)
            return "";
        for (var e = 1, i = "", n = 0; n < t.length; n++)
            if ("%" === t[n]) {
                switch (t[n + 1]) {
                case "s":
                    i += arguments[e++] || "";
                    break;
                case "%":
                    i += "%";
                    break;
                default:
                    i += ""
                }
                n++
            } else
                i += t[n];
        return i
    }
    t(e)
}),
modules.define("header", ["inherit", "y-block", "fog", "bt", "statcount"], function(t, e, i, n, o, s) {
    t(e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._bindTo(this._findElement("board-call-button"), "click", this._handleBoardCallClick),
            this._bindTo(this._findElement("controls"), "mousedown", this._closeServicesBoard),
            this._fog = null
        },
        _closeServicesBoard: function() {
            this._getState("board-visible") && (this._removeState("board-visible"),
            this._fog.hide())
        },
        _createServicesBoard: function() {
            var t = this._findElement("board")
              , e = this._getOptions()
              , i = e.boardOptions;
            t.is(":empty") && t.append(o.apply({
                block: "services-board",
                services: i.services,
                serviceHosts: i.serviceHosts,
                currTld: e.currTld
            }))
        },
        _handleBoardCallClick: function(t) {
            t.preventDefault(),
            this._getState("board-visible") ? (this._removeState("board-visible"),
            this._fog.hide()) : (this._fog || (this._fog = new n,
            this._fog.getDomNode().appendTo(document.body),
            this._bindTo(this._fog, "click", this._closeServicesBoard)),
            this._createServicesBoard(),
            this._setState("board-visible"),
            this._fog.show(),
            s({
                links: {
                    clicked: "show-services-board"
                }
            }))
        }
    }, {
        getBlockName: function() {
            return "header"
        }
    }))
}),
modules.define("y-button", ["y-block", "inherit", "y-dom", "y-block-event"], function(t, e, i, n, o) {
    var s = i(e, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._text = this._findElement("text"),
            this._href = void 0,
            this._tabIndex = void 0
        },
        getText: function() {
            return this._text.contents()
        },
        setText: function(t) {
            return n.replaceContents(this._text, t),
            this
        },
        setUrl: function(t) {
            return this.isEnabled() ? this.getDomNode().attr("href", t) : this._href = t,
            this
        },
        getUrl: function() {
            return this.isEnabled() ? this.getDomNode().attr("href") : this._href
        },
        focus: function() {
            return this.isEnabled() && this.getDomNode().focus(),
            this
        },
        isFocused: function() {
            return n.focus.isFocused(this.getDomNode())
        },
        blur: function() {
            return this.getDomNode().blur(),
            this
        },
        isEnabled: function() {
            return !this._getState("disabled")
        },
        disable: function() {
            if (!this._getState("disabled")) {
                this.blur();
                var t = this.getDomNode();
                t.attr("disabled", "disabled");
                var e = t.attr("href");
                e && (this._href = e,
                t.removeAttr("href"));
                var i = t.attr("tabindex");
                i && (this._tabIndex = i,
                t.removeAttr("tabindex")),
                this._removeState("pressed"),
                this._setState("disabled")
            }
            return this
        },
        enable: function() {
            if (this._getState("disabled")) {
                var t = this.getDomNode();
                t.removeAttr("disabled"),
                void 0 !== this._href && (t.attr("href", this._href),
                this._href = void 0),
                void 0 !== this._tabIndex && (t.attr("tabindex", this._tabIndex),
                this._tabIndex = void 0),
                this._removeState("disabled")
            }
            return this
        },
        pinLeft: function() {
            return this._setState("pin-left"),
            this
        },
        pinRight: function() {
            return this._setState("pin-right"),
            this
        },
        pinBoth: function() {
            return this._setState("pin-left"),
            this._setState("pin-right"),
            this
        },
        unpinLeft: function() {
            return this._removeState("pin-left"),
            this
        },
        unpinRight: function() {
            return this._removeState("pin-right"),
            this
        },
        unpinBoth: function() {
            return this._removeState("pin-left"),
            this._removeState("pin-right"),
            this
        }
    }, {
        getBlockName: function() {
            return "y-button"
        },
        _liveInit: function() {
            this._liveBind("click", function(t) {
                if (this.isEnabled()) {
                    var e = new o("click");
                    this.emit(e, t),
                    e.isDefaultPrevented() && t.preventDefault()
                }
            }),
            this._liveBind("mousedown", function() {
                this.isEnabled() && this._setState("pressed")
            }),
            this._liveBind("focusin", function() {
                this._getState("pressed") && this.getDomNode().blur()
            }),
            this._liveBind("mouseup", function() {
                this._removeState("pressed")
            }),
            this._liveBind("mouseout", function() {
                this._removeState("pressed")
            })
        }
    });
    t(s)
}),
modules.define("fog", ["y-block", "inherit"], function(t, e, i) {
    var n = i(e, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._visible = !1,
            this.getDomNode().hide(),
            this._bindTo(this.getDomNode(), "click", function() {
                this.emit("click")
            })
        },
        hide: function() {
            this._visible = !1,
            this.getDomNode().hide()
        },
        show: function() {
            this._visible = !0,
            this.getDomNode().show()
        },
        isVisible: function() {
            return this._visible
        }
    }, {
        getBlockName: function() {
            return "fog"
        }
    });
    t(n)
}),
modules.define("counters", ["inherit", "y-block", "y-load-script"], function(t, e, i, n) {
    var o = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments);
            var t = this._getOptions()
              , e = this._config = t.config
              , i = t.scriptUrls;
            switch (n(i.metrika).then(this._onMetrikaLoaded, this),
            n(i.tns).then(this._onTnsLoaded, this),
            t.countryCode) {
            case "ua":
                this._loadGemius(i.gemius, e.gemius.idUa);
                break;
            case "by":
                this._loadGemius(i.gemius, e.gemius.idBy)
            }
        },
        _onMetrikaLoaded: function() {
            var t = this._config.metrika;
            try {
                window["yaCounter" + t.id] = new Ya.Metrika({
                    id: t.id,
                    webvisor: t.webvisor
                })
            } catch (e) {}
        },
        _onTnsLoaded: function() {
            var t = this._config.tns;
            try {
                window.tnsCounterYandexRu = new TNS.TnsCounter({
                    account: t.account,
                    tmsec: t.tmsec
                })
            } catch (e) {}
        },
        _assignGemiusHandlers: function() {
            this._createGemiusHandler("gemius_hit"),
            this._createGemiusHandler("gemius_event"),
            this._createGemiusHandler("pp_gemius_hit"),
            this._createGemiusHandler("pp_gemius_event")
        },
        _createGemiusHandler: function(t) {
            window[t] = window[t] || function() {
                var e = window[t + "_pdata"] = window[t + "_pdata"] || [];
                e[e.length] = arguments
            }
        },
        _loadGemius: function(t, e) {
            window.pp_gemius_identifier = e,
            this._assignGemiusHandlers(),
            n(t)
        }
    }, {
        getBlockName: function() {
            return "counters"
        }
    });
    t(o)
}),
modules.require(["jquery", "y-block", "app-controller"], function(t, e, i) {
    t(function() {
        e.initDomTree(document.body).done(function() {
            var t = new i;
            t.init()
        })
    })
}),
modules.define("permalink-container", ["inherit", "y-block", "y-popup", "y-input", "bt", "metro-location"], function(t, e, i, n, o, s, r) {
    var a = e(i, {
        __constructor: function() {
            this.__base.apply(this, arguments),
            this._popup = this._createPopup(),
            this._input = o.find(this._popup.getDomNode()),
            this._inputControlElement = this._input.getDomNode().find("input"),
            this._inputControlElement.attr("readonly", !0),
            this._textElement = this._findElement("text"),
            this._bindTo(this._textElement, "click", this._handleTextElementClick)
        },
        destruct: function() {
            this.__base(),
            this._popup.destruct()
        },
        _handleTextElementClick: function() {
            this._input.setValue(r.getCurrentUrl()),
            this._popup.showAt(this._textElement),
            this._inputControlElement.select(),
            this._input.focus()
        },
        _createPopup: function() {
            var t = new n({
                showArrow: !0,
                padding: 10,
                position: "right"
            });
            return t.setContent(s.apply({
                block: "permalink-container",
                elem: "link"
            })),
            t
        }
    }, {
        getBlockName: function() {
            return "permalink-container"
        }
    });
    t(a)
}),
modules.define("bt", ["y-i18n"], function(t, e) {
    function i(t) {
        return Object.keys(t).reduce(function(e, i) {
            return e[i] = {
                block: "lang-switcher",
                elem: "item",
                code: i,
                text: t[i]
            },
            e
        }, {})
    }
    var n = function() {
        function t() {
            this._lastMatchId = 0,
            this._matchers = {},
            this._defaultViews = {},
            this._infiniteLoopDetection = !1,
            this.lib = {},
            this._options = {},
            this.utils = {
                _side: "undefined" == typeof window ? "s" : "c",
                bt: this,
                getPosition: function() {
                    var t = this.node;
                    return "_content" === t.index ? 1 : t.index + 1
                },
                isFirst: function() {
                    var t = this.node;
                    return "_content" === t.index || 0 === t.index
                },
                isLast: function() {
                    var t = this.node;
                    return "_content" === t.index || t.index === t.arr.length - 1
                },
                setTag: function(t) {
                    return this.ctx._tag = t,
                    this
                },
                getTag: function() {
                    return this.ctx._tag
                },
                setAttr: function(t, e) {
                    if (this.ctx._attrs || (this.ctx._attrs = {}),
                    "string" == typeof t)
                        this.ctx._attrs[t] = e;
                    else
                        for (var i in t)
                            this.ctx._attrs[i] = t[i];
                    return this
                },
                getAttr: function(t) {
                    return this.ctx._attrs ? this.ctx._attrs[t] : void 0
                },
                disableCssClassGeneration: function() {
                    return this.ctx._disableCssGeneration = !0,
                    this
                },
                enableCssClassGeneration: function() {
                    return this.ctx._disableCssGeneration = !1,
                    this
                },
                isCssClassGenerationEnabled: function() {
                    return !Boolean(this.ctx._disableCssGeneration)
                },
                disableDataAttrGeneration: function() {
                    return this.ctx._disableDataAttrGeneration = !0,
                    this
                },
                enableDataAttrGeneration: function() {
                    return this.ctx._disableDataAttrGeneration = !1,
                    this
                },
                isDataAttrGenerationEnabled: function() {
                    return !Boolean(this.ctx._disableDataAttrGeneration)
                },
                getState: function(t) {
                    return this.ctx._state ? this.ctx._state[t] : void 0
                },
                setState: function(t, e) {
                    return (this.ctx._state || (this.ctx._state = {}))[t] = 1 === arguments.length ? !0 : e,
                    this
                },
                getParam: function(t) {
                    return this.ctx[t]
                },
                getView: function() {
                    return this.ctx.view
                },
                getBlockName: function() {
                    return this.ctx.block
                },
                getElementName: function() {
                    return this.ctx.elem
                },
                setContent: function(t) {
                    return this.ctx._content = t,
                    this
                },
                getContent: function() {
                    return this.ctx._content
                },
                getMixins: function() {
                    return this.ctx.mixins
                },
                addMixin: function(t) {
                    return (this.ctx.mixins || (this.ctx.mixins = [])).push(t),
                    this
                },
                enableAutoInit: function() {
                    return this.ctx.autoInit !== !1 && (this.ctx.autoInit = !0),
                    this
                },
                isAutoInitEnabled: function() {
                    return Boolean(this.ctx.autoInit)
                },
                setInitOption: function(t, e) {
                    return (this.ctx._initOptions || (this.ctx._initOptions = {}))[t] = e,
                    this
                },
                getInitOption: function(t) {
                    return this.ctx._initOptions ? this.ctx._initOptions[t] : void 0
                },
                generateId: function() {
                    return "uniq" + this._side + e++
                },
                stop: function() {
                    return this.ctx._stop = !0,
                    this
                },
                applyTemplates: function() {
                    var t = this.ctx
                      , e = this.node
                      , i = this.bt.processBtJson(this.ctx, this.ctx.block, !0);
                    return i !== t && (this.newCtx = i),
                    this.ctx = t,
                    this.node = e,
                    this
                },
                getJson: function() {
                    return this.newCtx || this.ctx
                },
                escapeHtml: n
            }
        }
        var e = 0;
        t.prototype = {
            enableInfiniteLoopDetection: function(t) {
                return this._infiniteLoopDetection = t,
                this
            },
            apply: function(t) {
                return this.toHtml(this.processBtJson(t))
            },
            match: function(t, e) {
                if (e.__id = "__func" + this._lastMatchId++,
                Array.isArray(t))
                    for (var i = 0, n = t.length; n > i; i++)
                        (this._matchers[t[i]] || (this._matchers[t[i]] = [])).unshift(e);
                else
                    (this._matchers[t] || (this._matchers[t] = [])).unshift(e);
                return this
            },
            setDefaultView: function(t, e) {
                return this._defaultViews[t] = e,
                this
            },
            processBtJson: function(t, e, i) {
                function n() {
                    this.ctx = null ,
                    this.newCtx = null
                }
                var o, s, r, a, c, h, l, u, d, m = [t], _ = [{
                    json: t,
                    arr: m,
                    index: 0,
                    blockName: e
                }], f = this._matchers, p = !i, g = this._infiniteLoopDetection;
                n.prototype = this.utils;
                for (var v = new n; o = _.shift(); ) {
                    if (s = o.json,
                    r = o.blockName,
                    a = o.blockView,
                    Array.isArray(s))
                        for (c = 0,
                        h = s.length; h > c; c++)
                            u = s[c],
                            u !== !1 && null != u && "object" == typeof u && _.push({
                                json: u,
                                arr: s,
                                index: c,
                                blockName: r,
                                blockView: a
                            });
                    else {
                        var b, y = !1;
                        if (s.elem ? s.block && s.block !== r ? (r = s.block,
                        a = s.view = s.view || this._defaultViews[r]) : (r = s.block = s.block || r,
                        a = s.view = s.view || a || this._defaultViews[r]) : s.block && (r = s.block,
                        a = s.view = s.view || this._defaultViews[r]),
                        s.block) {
                            if (g && (s.__processCounter = (s.__processCounter || 0) + 1,
                            s.__processCounter > 100))
                                throw new Error('Infinite loop detected at "' + s.block + (s.elem ? "__" + s.elem : "") + '".');
                            if (d = null ,
                            !s._stop) {
                                v.node = o,
                                v.ctx = s;
                                var w = s.elem ? "__" + s.elem : ""
                                  , k = f[s.block + (s.view ? "_" + s.view : "") + w];
                                if (!k && s.view && (k = f[s.block + "_" + s.view.split("-")[0] + "*" + w]),
                                k || (k = f[s.block + "*" + w]),
                                k)
                                    for (c = 0,
                                    h = k.length; h > c; c++) {
                                        var S = k[c]
                                          , C = S.__id;
                                        if (!s[C]) {
                                            if (s[C] = !0,
                                            d = S(v),
                                            null != d) {
                                                s = d,
                                                o.json = s,
                                                o.blockName = r,
                                                o.blockView = a,
                                                _.push(o),
                                                y = !0;
                                                break
                                            }
                                            if (s._stop)
                                                break
                                        }
                                    }
                            }
                        }
                        if (!y)
                            if (Array.isArray(s))
                                o.json = s,
                                o.blockName = r,
                                o.blockView = a,
                                _.push(o);
                            else if (p && null != (b = s._content))
                                if (Array.isArray(b)) {
                                    var P;
                                    do {
                                        for (P = !1,
                                        c = 0,
                                        h = b.length; h > c; c++)
                                            if (Array.isArray(b[c])) {
                                                P = !0;
                                                break
                                            }
                                        P && (s._content = b = b.concat.apply([], b))
                                    } while (P);for (c = 0,
                                    h = b.length,
                                    l = h - 1; h > c; c++)
                                        u = b[c],
                                        u !== !1 && null != u && "object" == typeof u && _.push({
                                            json: u,
                                            arr: b,
                                            index: c,
                                            blockName: r,
                                            blockView: a
                                        })
                                } else
                                    _.push({
                                        json: b,
                                        arr: s,
                                        index: "_content",
                                        blockName: r,
                                        blockView: a
                                    })
                    }
                    o.arr[o.index] = s
                }
                return m[0]
            },
            toHtml: function(t) {
                var e, s, r, a;
                if (t === !1 || null == t)
                    return "";
                if ("object" != typeof t)
                    return n(t);
                if (Array.isArray(t)) {
                    for (e = "",
                    s = 0,
                    r = t.length; r > s; s++)
                        a = t[s],
                        a !== !1 && null != a && (e += this.toHtml(a));
                    return e
                }
                if (t.block) {
                    var c, h, l = t._disableDataAttrGeneration || t.elem || !t.block ? "" : ' data-block="' + t.block + '"';
                    if (c = t._attrs)
                        for (s in c) {
                            var u = c[s];
                            u === !0 ? l += " " + s : null != u && (l += " " + s + '="' + o(c[s]) + '"')
                        }
                    t._initOptions && ((h = {}).options = t._initOptions);
                    var d = t.mixins;
                    d && d.length && ((h || (h = {})).mixins = d),
                    h && (l += ' data-options="' + o(JSON.stringify(h)) + '"');
                    var m, _ = t._tag || "div";
                    if (e = "<" + _,
                    !t._disableCssGeneration) {
                        e += ' class="',
                        e += t.block + (t.view ? "_" + t.view : "") + (t.elem ? "__" + t.elem : "");
                        var f = t._state;
                        if (f)
                            for (s in f) {
                                var p = f[s];
                                null != p && "" !== p && p !== !1 && (e += p === !0 ? " _" + s : " _" + s + "_" + p)
                            }
                        (t.autoInit || d && d.length > 0) && (e += " _init"),
                        e += '"'
                    }
                    if (e += l,
                    i[_])
                        e += "/>";
                    else {
                        if (e += ">",
                        null != (m = t._content))
                            if (Array.isArray(m))
                                for (s = 0,
                                r = m.length; r > s; s++)
                                    a = m[s],
                                    a !== !1 && null != a && (e += this.toHtml(a));
                            else
                                e += this.toHtml(m);
                        e += "</" + _ + ">"
                    }
                    return e
                }
                return t.hasOwnProperty("raw") ? t.raw : void 0
            }
        };
        var i = {
            area: 1,
            base: 1,
            br: 1,
            col: 1,
            command: 1,
            embed: 1,
            hr: 1,
            img: 1,
            input: 1,
            keygen: 1,
            link: 1,
            meta: 1,
            param: 1,
            source: 1,
            wbr: 1
        }
          , n = function(t) {
            return ("" + t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;")
        }
          , o = function(t) {
            return t += "",
            ~t.indexOf("&") && (t = t.replace(/&/g, "&amp;")),
            ~t.indexOf('"') && (t = t.replace(/"/g, "&quot;")),
            t
        }
        ;
        return t
    }();
    "undefined" != typeof module && (module.exports = n);
    var o = new n;
    o.lib.i18n = e;
    var s = {
        zIndexes: {
            unit: "literal",
            values: {
                headFog: 999,
                headBoard: 1e3,
                headWrapper: 1001,
                switcherPopup: 1002
            }
        },
        dimensions: {
            unit: "px",
            values: {
                headerHeight: 70,
                footerHeight: 45,
                sidebarWidth: 302,
                sidebarOffset: 8,
                stationIconDiameter: 12
            }
        },
        boardingPositions: {
            unit: "Number",
            values: {
                first: 1,
                last: 5
            }
        }
    }
      , r = {
        fromSuggest: 1,
        toSuggest: 2,
        scheme: 3,
        switcher: 4,
        services: 5
    }
      , a = {
        maxZoom: 3,
        minZoom: 1,
        defaultZoom: 2,
        zoomStep: .25
    };
    if (!o)
        return s;
    o.lib = o.lib || {},
    o.lib.styles = Object.keys(s).reduce(function(t, e) {
        return t[e] = s[e].values,
        t
    }, {}),
    o.lib.tabIndexes = r,
    o.lib.zoomSettings = a,
    o.match("config", function(t) {
        return {
            block: "inline-json",
            name: "config",
            source: t.getParam("source")
        }
    }),
    o.match("inline-json", function(t) {
        t.disableCssClassGeneration(),
        t.setTag("script"),
        t.setAttr("id", t.getParam("name")),
        t.setAttr("type", "text/json"),
        t.setContent({
            raw: JSON.stringify(t.getParam("source"))
        })
    }),
    o.match("scheme-view", function(t) {
        t.setInitOption("zoom-settings", o.lib.zoomSettings),
        t.setAttr("tabindex", o.lib.tabIndexes.scheme),
        t.setContent([{
            elem: "container"
        }, {
            elem: "spinner"
        }])
    }),
    o.setDefaultView("y-popup", "islet"),
    o.match("y-popup_islet*", function(t) {
        var e = [];
        (void 0 === t.getParam("showArrow") || t.getParam("showArrow")) && e.push({
            elem: "arrow"
        }),
        e.push({
            elem: "content",
            content: t.getParam("content")
        }),
        t.setContent(e)
    }),
    o.match("y-popup_islet*__content", function(t) {
        t.setContent(t.getParam("content"))
    });
    var c = {
        header: 1e3,
        dialog: 2e3,
        popup: 3e3,
        suggest: 4e3
    };
    if (!o)
        return c;
    o.lib.zIndexes = c,
    o.match("list", function(t) {
        t.setTag("ul");
        var e = t.getParam("items") || [];
        t.setContent(e.map(function(t) {
            return {
                elem: "item",
                content: t
            }
        }))
    }),
    o.match("list__item", function(t) {
        t.setTag("li"),
        t.setContent(t.getParam("content"))
    });
    var h = o.lib.styles.dimensions.stationIconDiameter
      , l = h / 2
      , u = 1
      , d = h + 2 * u
      , m = l + u
      , _ = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="{imgSize}px" height="{imgSize}px"><circle fill="{color}" r="{iconRadius}" cx="{imgCenter}" cy="{imgCenter}" /></svg>';
    _ = _.replace(/{imgSize}/g, d).replace(/{iconRadius}/g, l).replace(/{imgCenter}/g, m);
    var f = function(t) {
        return t ? _.replace(/{color}/g, t) : ""
    }
    ;
    o.match("station-label", function(t) {
        t.setContent([{
            elem: "icon-container",
            color: t.getParam("color")
        }, {
            elem: "text",
            text: t.getParam("text")
        }]),
        t.getParam("closed") && t.setState("closed"),
        t.setInitOption("id", t.getParam("id"))
    }),
    o.match("station-label__icon-container", function(t) {
        t.setTag("span"),
        t.setContent({
            elem: "icon",
            color: t.getParam("color")
        })
    }),
    o.match("station-label__text", function(t) {
        t.setTag("span"),
        t.setContent(t.getParam("text"))
    }),
    o.match("station-label__icon", function(t) {
        t.setContent({
            raw: f(t.getParam("color"))
        })
    }),
    o.match("zoom-control", function(t) {
        t.setState("disabled"),
        t.setAttr("unselectable", "on"),
        t.setInitOption("zoom-settings", o.lib.zoomSettings),
        t.setContent([{
            elem: "plus"
        }, {
            elem: "minus"
        }])
    }),
    o.match("zoom-control__plus", function(t) {
        t.setTag("button"),
        t.setAttr("type", "button")
    }),
    o.match("zoom-control__minus", function(t) {
        t.setTag("button"),
        t.setAttr("type", "button")
    }),
    o.match("title", function(t) {
        t.setTag("h1"),
        t.setContent(o.lib.i18n("main", "page-title", {
            CityName: t.getParam("cityName")
        }))
    }),
    o.match("from-to-suggest", function(t) {
        t.setContent({
            elem: "container"
        })
    }),
    o.match("from-to-suggest__container", function(t) {
        t.setContent([{
            elem: "from-field"
        }, {
            elem: "to-field"
        }])
    }),
    o.match("from-to-suggest__from-field", function(t) {
        t.setContent([{
            block: "station-suggest",
            placeholder: o.lib.i18n("suggest", "from-placeholder"),
            tabindex: o.lib.tabIndexes.fromSuggest
        }])
    }),
    o.match("from-to-suggest__to-field", function(t) {
        t.setContent([{
            block: "station-suggest",
            placeholder: o.lib.i18n("suggest", "to-placeholder"),
            tabindex: o.lib.tabIndexes.toSuggest
        }])
    }),
    o.match("station-suggest", function(t) {
        t.setContent({
            block: "y-input",
            view: "islet",
            leftIcons: [{
                name: "station-icon",
                icon: {
                    block: t.getBlockName(),
                    elem: "icon-container"
                }
            }],
            showClear: !0,
            placeholder: t.getParam("placeholder"),
            tabindex: t.getParam("tabindex")
        })
    }),
    o.setDefaultView("y-input", "islet"),
    o.match("y-input_islet*", function(t) {
        t.setTag("span"),
        t.enableAutoInit(),
        t.getParam("disabled") && t.setState("disabled");
        var e = []
          , i = t.getParam("leftIcons");
        i && i.forEach(function(t) {
            var i = {
                elem: "icon",
                icon: t.icon,
                name: t.name
            };
            e.push(i)
        }),
        t.setContent([e.length > 0 && {
            elem: "icons-left",
            content: e
        }, t.getParam("showClear") && {
            elem: "clear"
        }, {
            elem: "context",
            content: {
                elem: "control",
                type: t.getParam("type"),
                id: t.getParam("id"),
                name: t.getParam("name"),
                value: t.getParam("value"),
                tabindex: t.getParam("tabindex"),
                disabled: t.getParam("disabled"),
                readonly: t.getParam("readonly"),
                autocomplete: t.getParam("autocomplete"),
                autocorrect: t.getParam("autocorrect"),
                maxlength: t.getParam("maxlength"),
                placeholder: t.getParam("placeholder"),
                min: t.getParam("min"),
                max: t.getParam("max"),
                step: t.getParam("step")
            }
        }])
    }),
    o.match("y-input_islet*__context", function(t) {
        t.setTag("span"),
        t.setContent(t.getParam("content"))
    }),
    o.match("y-input_islet*__icons-left", function(t) {
        t.setTag("span"),
        t.setContent(t.getParam("content"))
    }),
    o.match("y-input_islet*__icon", function(t) {
        t.setTag("span"),
        t.setContent(t.getParam("icon")),
        t.setAttr("data-name", t.getParam("name"))
    }),
    o.match("y-input_islet*__control", function(t) {
        t.setTag("input"),
        t.setAttr({
            id: t.getParam("id") || t.generateId(),
            type: t.getParam("type"),
            name: t.getParam("name"),
            value: t.getParam("value"),
            tabindex: t.getParam("tabindex"),
            disabled: t.getParam("disabled"),
            readonly: t.getParam("readonly"),
            autocomplete: t.getParam("autocomplete"),
            autocorrect: t.getParam("autocorrect"),
            maxlength: t.getParam("maxlength"),
            placeholder: t.getParam("placeholder"),
            min: t.getParam("min"),
            max: t.getParam("max"),
            step: t.getParam("step")
        })
    }),
    o.setDefaultView("y-suggest", "islet"),
    o.match("y-suggest_islet*", function(t) {
        var e = t.getParam("input");
        e && t.setContent(e)
    }),
    o.setDefaultView("y-suggest-drop", "islet"),
    o.match("y-suggest-drop_islet*", function(t) {
        t.setContent(t.getParam("groups"))
    }),
    o.match("y-suggest-drop_islet-header", function(t) {
        t.setContent(t.getParam("groups")),
        t.setInitOption("wide", !0)
    }),
    o.match("y-suggest-drop_islet*__group", function(t) {
        t.setContent({
            elem: "items",
            items: t.getParam("items")
        })
    }),
    o.match("y-suggest-drop_islet-header__group", function(t) {
        t.setContent([{
            elem: "group-title",
            type: t.getParam("type")
        }, {
            elem: "items",
            items: t.getParam("items")
        }])
    }),
    o.match("y-suggest-drop_islet-header__group-title", function(t) {
        t.setContent(o.lib.i18n("y-suggest-drop", "group-type-" + t.getParam("type")))
    }),
    o.match("y-suggest-drop_islet*__content", function(t) {
        t.setContent(t.getParam("groups"))
    }),
    o.match("y-suggest-drop_islet*__items", function(t) {
        t.setTag("ul"),
        t.setContent(t.getParam("items"))
    }),
    o.match("station-suggest-drop-item", function(t) {
        var e = t.getParam("options");
        t.setTag("li"),
        t.setContent({
            block: "station-label",
            id: e.id,
            color: e.color,
            closed: e.closed,
            text: e.text
        })
    }),
    o.match("routing-hint", function(t) {
        t.setContent({
            raw: o.lib.i18n("routing-hint", "select-from-to")
        }),
        t.enableAutoInit()
    }),
    o.match("route-list", function(t) {
        t.setTag("ul"),
        t.setContent(t.getParam("items")),
        t.setState("hidden")
    }),
    o.match("route-list-item", function(t) {
        t.setTag("li"),
        t.setContent([{
            elem: "transfers",
            transfers: t.getParam("transfers")
        }, {
            elem: "time",
            time: t.getParam("time")
        }]),
        t.setInitOption("routeId", t.getParam("routeId"))
    }),
    o.match("route-list-item__transfers", function(t) {
        t.setTag("span");
        var e = t.getParam("transfers")
          , i = "";
        0 === e ? i += o.lib.i18n("route-list-item", "no-transfers") : 1 === e ? i += "1 " + o.lib.i18n("route-list-item", "transfer-singular") : e > 1 && (i += e + " " + o.lib.i18n("route-list-item", "transfer-plural")),
        t.setContent({
            raw: i
        })
    }),
    o.match("route-list-item__time", function(t) {
        t.setTag("span");
        var e = t.getParam("time")
          , i = Math.round(e / 60)
          , n = Math.floor(i / 60)
          , s = "&asymp;&nbsp;";
        n > 0 && (i %= 60,
        s += n + " " + o.lib.i18n("route-list-item", "hour-abr")),
        i > 0 && (n > 0 && (s += "&nbsp;"),
        s += i + " " + o.lib.i18n("route-list-item", "minute-abr")),
        t.setContent({
            raw: s
        })
    }),
    o.match("route-details-block", function(t) {
        t.setContent([{
            block: "sidebar",
            elem: "box-inner-separator"
        }, {
            block: "scrollable-block",
            content: {
                block: "route-details-block",
                elem: "station-list"
            }
        }]),
        t.setState("hidden")
    }),
    o.match("route-details-block__station-list", function(t) {
        t.setTag("ul")
    }),
    o.match("route-details-block__station-list-item", function(t) {
        t.setTag("li");
        var e = [{
            elem: "left",
            content: t.getParam("iconElement")
        }]
          , i = t.getParam("rightSideElement");
        i && e.push({
            elem: "right",
            content: i
        }),
        t.getParam("closed") && t.setState("closed"),
        t.setContent(e)
    }),
    o.match("route-details-block__left", function(t) {
        t.setContent({
            elem: "icon",
            content: t.getParam("content")
        })
    }),
    o.match("route-details-block__icon", function(t) {
        t.setContent(t.getParam("content"))
    }),
    o.match("route-details-block__right", function(t) {
        t.setContent(t.getParam("content"))
    }),
    o.match(["route-details-block__station", "route-details-block__terminal-station"], function(t) {
        t.setContent({
            raw: t.getParam("name")
        })
    }),
    o.match("route-details-block__hint", function(t) {
        t.setContent({
            raw: t.getParam("content")
        })
    }),
    o.match("route-details-block__boarding-scheme", function(t) {
        t.setContent({
            block: "boarding-scheme",
            positions: t.getParam("positions")
        })
    }),
    o.match("route-details-block__icon-link", function(t) {
        t.setContent({
            elem: "icon-bar",
            color: t.getParam("color")
        })
    }),
    o.match("route-details-block__icon-link-avg", function(t) {
        t.setContent({
            elem: "icon-bar-avg",
            color: t.getParam("color")
        })
    }),
    o.match("route-details-block__icon-link-long", function(t) {
        t.setContent({
            elem: "icon-bar-long",
            color: t.getParam("color")
        })
    }),
    o.match("route-details-block__icon-link-transfer", function(t) {
        t.setContent([{
            elem: "icon-walk"
        }, {
            elem: "icon-two-bars"
        }])
    }),
    o.match("route-details-block__icon-link-transfer-empty", function(t) {
        t.setContent({
            elem: "icon-two-bars"
        })
    }),
    o.match("route-details-block__icon-station", function(t) {
        t.setContent({
            elem: "icon-circle",
            color: t.getParam("color")
        })
    }),
    o.match("route-details-block__icon-station-transfer-start", function(t) {
        t.setContent([{
            elem: "icon-circle-white-stroke",
            color: t.getParam("color")
        }, {
            elem: "icon-top-arc"
        }])
    }),
    o.match("route-details-block__icon-station-transfer-end", function(t) {
        t.setContent([{
            elem: "icon-circle-white-stroke",
            color: t.getParam("color")
        }, {
            elem: "icon-bottom-arc"
        }])
    }),
    o.match("route-details-block__icon-station-transfer-inner", function(t) {
        t.setContent([{
            elem: "icon-circle-white-stroke",
            color: t.getParam("color")
        }, {
            elem: "icon-two-bars"
        }])
    }),
    o.match(["route-details-block__icon-circle", "route-details-block__icon-circle-white-stroke", "route-details-block__icon-bar", "route-details-block__icon-bar-avg", "route-details-block__icon-bar-long"], function(t) {
        t.setAttr("style", "background-color: " + t.getParam("color"))
    }),
    o.match("sidebar", function(t) {
        t.setContent(t.getParam("content"))
    }),
    o.match("sidebar__box", function(t) {
        t.setContent(t.getParam("content"))
    }),
    o.match("scrollable-block", function(t) {
        t.setContent([{
            elem: "container",
            content: t.getParam("content")
        }, {
            elem: "bar"
        }]),
        t.setState("bar-hidden")
    }),
    o.match("scrollable-block__container", function(t) {
        t.setContent({
            elem: "content",
            content: t.getParam("content")
        })
    }),
    o.match("scrollable-block__content", function(t) {
        t.setContent(t.getParam("content"))
    }),
    o.match("boarding-scheme", function(t) {
        for (var e = o.lib.styles.boardingPositions.first, i = o.lib.styles.boardingPositions.last, n = t.getParam("positions") || [], s = [], r = e; i >= r; r++)
            s.push({
                elem: "wagon",
                position: r,
                highlighted: -1 !== n.indexOf(r)
            });
        t.setContent(s)
    }),
    o.match("boarding-scheme__wagon", function(t) {
        var e = t.getParam("position");
        t.setState("position", e),
        t.getParam("highlighted") && (t.setState("highlighted"),
        t.setAttr("title", o.lib.i18n("boarding-scheme", "position-" + e)))
    }),
    o.match("route-permalink-block", function(t) {
        t.setContent([{
            block: "sidebar",
            elem: "box-inner-separator"
        }, {
            elem: "padded-container"
        }]),
        t.setState("hidden");
        var e = t.getParam("isTablet");
        t.setInitOption("isTablet", e),
        e && t.setState("tablet-behavior")
    }),
    o.match("route-permalink-block__padded-container", function(t) {
        t.setContent({
            block: "permalink-container",
            clickableText: o.lib.i18n("route-permalink-block", "get-link-to-route")
        })
    }),
    o.match("adv-block", function(t) {
        t.setContent({
            block: "scrollable-block",
            content: {
                block: "adv-block",
                elem: "inner-container"
            }
        })
    }),
    o.match("notification-view", function(t) {
        t.setTag("ul");
        var e = t.getParam("notifications");
        !e || e.length < 1 ? t.setState("hidden") : t.setContent(e.map(function(t) {
            return {
                elem: "notification",
                text: t
            }
        }))
    }),
    o.match("notification-view__notification", function(t) {
        t.setTag("li"),
        t.setContent({
            raw: t.getParam("text")
        })
    }),
    o.match("scheme-switcher", function(t) {
        t.setContent({
            block: "select",
            initialText: t.getParam("initialText"),
            zIndex: o.lib.styles.zIndexes.switcherPopup,
            tabIndex: o.lib.tabIndexes.switcher
        })
    }),
    o.setDefaultView("select", "metro"),
    o.match("select_metro*", function(t) {
        var e = t.getParam("items");
        t.setContent([{
            elem: "button",
            text: t.getParam("initialText") || "",
            tabIndex: t.getParam("tabIndex")
        }]);
        var i = t.getParam("dropShowArrow") || !1
          , n = t.getParam("dropPosition") || "bottom-right";
        t.setInitOption("items", e ? e : null ),
        t.setInitOption("itemView", t.getParam("itemView")),
        t.setInitOption("dopZIndex", t.getParam("dropZIndex") || 3e3),
        t.setInitOption("dropShowArrow", i),
        t.setInitOption("dropPosition", n),
        i || t.setState(n.split("-")[0] + "-drop-offset"),
        t.enableAutoInit()
    }),
    o.match("select_metro__button", function(t) {
        t.setTag("button"),
        t.setAttr("type", "button");
        var e = t.getParam("tabIndex");
        e && t.setAttr("tabindex", e),
        t.setContent([{
            elem: "text",
            content: t.getParam("text")
        }, {
            elem: "tick"
        }])
    }),
    o.match("select_metro__text", function(t) {
        t.setTag("span"),
        t.setContent(t.getParam("content"))
    }),
    o.match("select_metro-borderless__button", function(t) {
        t.setTag("button"),
        t.setAttr("type", "button"),
        t.setContent(t.getParam("text"))
    }),
    o.match("select_metro*__drop", function(t) {
        t.setTag("ul"),
        t.setContent(t.getParam("items"))
    }),
    o.setDefaultView("select-item", "metro"),
    o.match("select-item_metro*", function(t) {
        t.setTag("li"),
        t.setInitOption("key", t.getParam("key")),
        t.setContent([{
            elem: "label",
            text: t.getParam("text")
        }, {
            elem: "check"
        }]),
        Boolean(t.getParam("selected")) && t.setState("selected")
    }),
    o.match("select-item_metro*__label", function(t) {
        t.setTag("span"),
        t.setContent(t.getParam("text"))
    }),
    o.match("footer", function(t) {
        t.setTag("footer"),
        t.setContent({
            elem: "wrapper",
            currTld: t.getParam("currTld"),
            cityName: t.getParam("cityName"),
            langSwitcherLangs: t.getParam("langSwitcherLangs"),
            langSwitcherCurrLang: t.getParam("langSwitcherCurrLang")
        }),
        t.enableAutoInit()
    }),
    o.match("footer__wrapper", function(t) {
        t.setContent([{
            elem: "left",
            currTld: t.getParam("currTld"),
            cityName: t.getParam("cityName")
        }, {
            elem: "right",
            currTld: t.getParam("currTld"),
            langSwitcherLangs: t.getParam("langSwitcherLangs"),
            langSwitcherCurrLang: t.getParam("langSwitcherCurrLang")
        }])
    }),
    o.match("footer__left", function(t) {
        t.setContent([{
            elem: "get-mobile-app-link",
            currTld: t.getParam("currTld"),
            cityName: t.getParam("cityName")
        }])
    }),
    o.match("footer__right", function(t) {
        t.setContent([{
            elem: "link-list",
            currTld: t.getParam("currTld"),
            langSwitcherLangs: t.getParam("langSwitcherLangs"),
            langSwitcherCurrLang: t.getParam("langSwitcherCurrLang")
        }])
    }),
    o.match("footer__get-mobile-app-link", function(t) {
        t.setContent([{
            elem: "mobile-icon"
        }, {
            elem: "mobile-link",
            currTld: t.getParam("currTld"),
            cityName: t.getParam("cityName")
        }])
    }),
    o.match("footer__mobile-link", function(t) {
        var e = t.getParam("currTld");
        t.setContent({
            elem: "link",
            text: o.lib.i18n("footer", "get-mobile-app", {
                CityName: t.getParam("cityName")
            }),
            href: "//mobile.yandex." + ("by" === e || "com" === e ? "ru" : e) + "/apps/android/metro/?from=metro"
        })
    }),
    o.match("footer__link-list", function(t) {
        var e = t.getParam("currTld");
        t.setTag("ul"),
        t.setContent([{
            elem: "lang-switcher",
            langSwitcherLangs: t.getParam("langSwitcherLangs"),
            langSwitcherCurrLang: t.getParam("langSwitcherCurrLang")
        }, {
            elem: "link-item",
            text: o.lib.i18n("footer", "feedback"),
            href: "//feedback2.yandex." + e + "/metro",
            counterName: "feedback"
        }, {
            elem: "link-item",
            text: o.lib.i18n("footer", "help"),
            href: "//help.yandex." + e + "/metro",
            counterName: "help"
        }, {
            elem: "link-item",
            text: o.lib.i18n("footer", "ads"),
            href: "//advertising.yandex." + ("en" === o.lib.i18n.getLanguage() ? "com" : e) + "/",
            counterName: "advertising"
        }, {
            elem: "link-item",
            text: o.lib.i18n("footer", "user-agreement"),
            href: "//legal.yandex." + ("en" === o.lib.i18n.getLanguage() ? "com" : e) + "/rules",
            counterName: "user-agreement"
        }, {
            elem: "yandex-copyright",
            currTld: e
        }])
    }),
    o.match("footer__link-item", function(t) {
        t.setTag("li");
        var e = t.getParam("counterName");
        e && t.setAttr("data-counter", e),
        t.setContent({
            elem: "link",
            text: t.getParam("text"),
            href: t.getParam("href")
        })
    }),
    o.match("footer__link", function(t) {
        t.setTag("a"),
        t.setAttr("target", "_blank"),
        t.setAttr("href", t.getParam("href")),
        t.setContent({
            raw: t.getParam("text")
        })
    });
    var p = 2004;
    o.match("footer__yandex-copyright", function(t) {
        t.setTag("li"),
        t.setContent([{
            elem: "copy-sign"
        }, {
            elem: "copyright-years"
        }, {
            elem: "company-link",
            currTld: t.getParam("currTld")
        }])
    }),
    o.match("footer__copy-sign", function(t) {
        t.setTag("span"),
        t.setContent({
            raw: "&copy;"
        })
    }),
    o.match("footer__copyright-years", function(t) {
        t.setTag("span"),
        t.setContent({
            raw: [p, "&#8212;", (new Date).getFullYear(), ","].join("")
        })
    }),
    o.match("footer__company-link", function(t) {
        t.setTag("a"),
        t.setAttr("href", "//yandex." + t.getParam("currTld")),
        t.setContent({
            raw: o.lib.i18n("footer", "yandex-company-name")
        })
    }),
    o.match("footer__lang-switcher", function(t) {
        t.setTag("li"),
        t.setContent({
            block: "lang-switcher",
            langs: t.getParam("langSwitcherLangs"),
            currLang: t.getParam("langSwitcherCurrLang")
        })
    }),
    o.match("lang-switcher", function(t) {
        var e = t.getParam("currLang")
          , n = t.getParam("langs")
          , o = Object.keys(n).filter(function(t) {
            return t !== e
        }).reduce(function(t, e) {
            return t[e] = n[e],
            t
        }, {});
        t.setContent({
            block: "select",
            view: "metro-borderless",
            initialText: {
                block: "lang-switcher",
                elem: "selected-item",
                code: e,
                text: n[e]
            },
            dropPosition: "top",
            dropShowArrow: !0,
            itemView: "metro-plain",
            items: i(o)
        }),
        t.enableAutoInit()
    }),
    o.match(["lang-switcher__item", "lang-switcher__selected-item"], function(t) {
        t.setTag("span"),
        t.setContent([{
            elem: "item-flag",
            code: t.getParam("code")
        }, {
            elem: "item-text",
            text: t.getParam("text")
        }])
    }),
    o.match("lang-switcher__item-text", function(t) {
        t.setTag("span"),
        t.setContent(t.getParam("text"))
    }),
    o.match("lang-switcher__item-flag", function(t) {
        t.setTag("span"),
        t.setState("lang-code", t.getParam("code"))
    }),
    o.setDefaultView("header", "islet"),
    o.match("header_islet*", function(t) {
        t.setTag("header"),
        t.setContent([{
            elem: "wrapper",
            showBoard: t.getParam("showBoard"),
            serviceName: t.getParam("serviceName"),
            controlsBt: t.getParam("controlsBt"),
            currTld: t.getParam("currTld")
        }, t.getParam("showBoard") ? {
            elem: "board"
        } : null ]),
        t.setInitOption("currTld", t.getParam("currTld")),
        t.setInitOption("boardOptions", t.getParam("boardOptions")),
        t.enableAutoInit()
    }),
    o.match("header_islet__wrapper", function(t) {
        var e = t.getParam("showBoard");
        t.setContent([{
            elem: "logo",
            currTld: t.getParam("currTld")
        }, {
            elem: "info",
            content: e ? {
                elem: "board-call",
                currTld: t.getParam("currTld")
            } : null
        }, {
            elem: "service",
            serviceName: t.getParam("serviceName"),
            currTld: t.getParam("currTld")
        }, {
            elem: "controls",
            controlsBt: t.getParam("controlsBt")
        }])
    }),
    o.match("header_islet__controls", function(t) {
        t.setContent(t.getParam("controlsBt"))
    }),
    o.match("header_islet__service", function(t) {
        t.setContent([{
            elem: "service-name",
            serviceUrl: "//metro.yandex." + t.getParam("currTld"),
            content: t.getParam("serviceName")
        }, {
            elem: "service-arrow"
        }])
    }),
    o.match("header_islet__logo", function(t) {
        t.setTag("a"),
        t.setState("lang", o.lib.i18n.getLanguage()),
        t.setAttr("href", "//yandex." + ("en" === o.lib.i18n.getLanguage() ? "com" : t.getParam("currTld"))),
        t.setContent({
            elem: "logo-img"
        })
    }),
    o.match("header_islet__service-name", function(t) {
        t.getParam("serviceUrl") ? (t.setTag("a"),
        t.setAttr("href", t.getParam("serviceUrl"))) : t.setTag("h1"),
        t.setContent(t.getParam("content"))
    }),
    o.match("header_islet__board-call", function(t) {
        t.setTag("div"),
        t.setContent({
            elem: "board-call-button",
            url: "//yandex." + t.getParam("currTld") + "/all"
        })
    }),
    o.match("header_islet__board-call-button", function(t) {
        t.setTag("a"),
        t.setAttr("tabindex", o.lib.tabIndexes.services),
        t.setAttr("href", t.getParam("url")),
        t.setContent({
            elem: "board-call-icon"
        })
    }),
    o.match("header_islet__board-call-icon", function(t) {
        t.setTag("span")
    }),
    o.match("header_islet__info", function(t) {
        t.setContent(t.getParam("content"))
    }),
    o.setDefaultView("y-button", "islet"),
    o.match("y-button_islet*", function(t) {
        var e = t.getParam("disabled");
        e && t.setState("disabled");
        var i = t.getParam("url");
        i ? t.setTag("a") : t.setTag("button"),
        t.enableAutoInit();
        var n = t.getParam("tabindex");
        if (n && t.setAttr("tabindex", n),
        i || (e && t.setAttr("disabled", !0),
        t.setAttr("type", t.getParam("type") || "button")),
        i) {
            t.setAttr("role", "button"),
            e && t.setAttr("aria-disabled", !0);
            var o = t.getParam("target");
            o && t.setAttr("target", o),
            t.setAttr("href", i)
        }
        var s = t.getParam("title");
        s && t.setAttr("title", s);
        var r = t.getParam("icon")
          , a = t.getParam("text");
        t.setContent([r ? {
            elem: "icon",
            name: r
        } : null , a ? {
            elem: "text",
            content: a
        } : null ]),
        t.getParam("pinLeft") && t.setState("pin-left"),
        t.getParam("pinRight") && t.setState("pin-right")
    }),
    o.match("y-button_islet*__icon", function(t) {
        t.setTag("span"),
        t.setContent(t.getParam("name"))
    }),
    o.match("y-button_islet*__text", function(t) {
        t.setTag("span"),
        t.setContent(t.getParam("content"))
    }),
    o.match("services-board", function(t) {
        t.setTag("ul");
        var e = t.getParam("services")
          , i = t.getParam("serviceHosts");
        t.setContent([e.map(function(t) {
            return {
                elem: "item",
                name: o.lib.i18n("services-board", t),
                service: t,
                url: i[t]
            }
        }), {
            elem: "all",
            name: o.lib.i18n("services-board", "all-services"),
            url: i["all-services"]
        }])
    }),
    o.match("services-board__item", function(t) {
        t.setTag("li"),
        t.setContent({
            elem: "link",
            name: t.getParam("name"),
            service: t.getParam("service"),
            url: t.getParam("url")
        })
    }),
    o.match("services-board__all", function(t) {
        t.setTag("li"),
        t.setContent({
            block: "y-button",
            view: "islet-pseudo",
            text: t.getParam("name"),
            url: t.getParam("url")
        })
    }),
    o.match("services-board__link", function(t) {
        t.setTag("a"),
        t.setAttr("href", t.getParam("url")),
        t.setAttr("data-service-name", t.getParam("service")),
        t.setContent(t.getParam("name"))
    }),
    o.match("counters", function(t) {
        t.setInitOption("countryCode", t.getParam("countryCode")),
        t.setInitOption("config", t.getParam("config")),
        t.setInitOption("scriptUrls", t.getParam("scriptUrls"));
        var e = t.getParam("noscriptUrls");
        e && e.length && t.setContent(e.map(function(t) {
            return {
                elem: "noscript",
                url: t
            }
        })),
        t.enableAutoInit()
    }),
    o.match("counters__noscript", function(t) {
        t.setTag("noscript"),
        t.setContent({
            elem: "noscript-img",
            src: t.getParam("url")
        })
    }),
    o.match("counters__noscript-img", function(t) {
        t.setTag("img"),
        t.setAttr("alt", ""),
        t.setAttr("style", "position: absolute; left: -9999px;"),
        t.setAttr("src", t.getParam("src"))
    }),
    o.match("favicon-link", function(t) {
        t.disableCssClassGeneration(),
        t.disableDataAttrGeneration(),
        t.setTag("link"),
        t.setAttr("rel", "icon"),
        t.setAttr("type", t.getParam("type")),
        t.setAttr("sizes", t.getParam("sizes")),
        t.setAttr("href", t.getParam("href"))
    }),
    o.setDefaultView("y-page", "islet"),
    o.match("y-page_islet*", function(t) {
        var e, i = t.getParam("styles");
        i && (e = i.map(function(t) {
            return {
                elem: "css",
                url: t.url,
                ie: t.ie,
                media: t.media
            }
        }));
        var n, o = t.getParam("meta");
        o && (n = o.map(function(t) {
            return {
                elem: "meta",
                name: t.name,
                property: t.property,
                content: t.content,
                "http-equiv": t["http-equiv"]
            }
        }));
        var s, r = t.getParam("links");
        return r && (s = r.map(function(t) {
            return {
                elem: "link",
                rel: t.rel,
                type: t.type,
                href: t.href,
                title: t.title
            }
        })),
        [{
            raw: t.getParam("doctype") || "<!DOCTYPE html>"
        }, {
            elem: "html",
            namespaces: t.getParam("namespaces"),
            content: [{
                elem: "head",
                content: [[{
                    elem: "meta",
                    charset: "utf-8"
                }, t.getParam("x-ua-compatible") === !1 ? !1 : {
                    elem: "meta",
                    "http-equiv": "X-UA-Compatible",
                    content: t.getParam("x-ua-compatible") || "IE=edge"
                }, {
                    elem: "title",
                    content: t.getParam("title")
                }, t.getParam("favicon") ? {
                    elem: "favicon",
                    url: t.getParam("favicon")
                } : ""], n, s, e, t.getParam("head")]
            }, t.getJson()]
        }]
    }),
    o.match("y-page_islet*", function(t) {
        t.setTag("body"),
        t.enableAutoInit();
        var e, i = t.getParam("scripts");
        i && (e = i.map(function(t) {
            return {
                elem: "js",
                url: t.url ? t.url.replace("{lang}", o.lib.i18n.getLanguage()) : void 0,
                source: t.source,
                async: t.async,
                defer: t.defer
            }
        })),
        t.setContent([t.getParam("body"), e])
    }),
    o.match("y-page_islet*__title", function(t) {
        t.disableCssClassGeneration(),
        t.setTag("title"),
        t.setContent(t.getParam("content"))
    }),
    o.match("y-page_islet*__html", function(t) {
        t.setTag("html"),
        t.disableCssClassGeneration();
        var e = t.getParam("namespaces");
        if (e) {
            var i = Object.keys(e).map(function(t) {
                return t + ": " + e[t]
            }).join(" ");
            t.setAttr("prefix", i)
        }
        t.setContent(t.getParam("content"))
    }),
    o.match("y-page_islet*__head", function(t) {
        t.setTag("head"),
        t.disableCssClassGeneration(),
        t.setContent(t.getParam("content"))
    }),
    o.match("y-page_islet*__meta", function(t) {
        t.setTag("meta"),
        t.disableCssClassGeneration(),
        t.setAttr("name", t.getParam("name")),
        t.setAttr("property", t.getParam("property")),
        t.setAttr("http-equiv", t.getParam("http-equiv")),
        t.setAttr("content", t.getParam("content")),
        t.setAttr("charset", t.getParam("charset"))
    }),
    o.match("y-page_islet*__link", function(t) {
        t.setTag("link"),
        t.disableCssClassGeneration(),
        t.setAttr({
            rel: t.getParam("rel"),
            type: t.getParam("type"),
            href: t.getParam("href"),
            title: t.getParam("title")
        })
    }),
    o.match("y-page_islet*__favicon", function(t) {
        t.disableCssClassGeneration(),
        t.setTag("link"),
        t.setAttr("rel", "shortcut icon"),
        t.setAttr("href", t.getParam("url"))
    }),
    o.match("y-page_islet*__js", function(t) {
        t.disableCssClassGeneration(),
        t.setTag("script");
        var e = t.getParam("url");
        e && t.setAttr("src", e);
        var i = t.getParam("source");
        i && t.setContent({
            raw: i
        }),
        t.getParam("async") && t.setAttr("async", !0),
        t.getParam("defer") && t.setAttr("defer", !0),
        t.setAttr("type", "text/javascript")
    }),
    o.match("y-page_islet*__css", function(t) {
        t.disableCssClassGeneration();
        var e = t.getParam("url");
        e ? (t.setTag("link"),
        t.setAttr("rel", "stylesheet"),
        t.setAttr("href", e)) : t.setTag("style");
        var i = t.getParam("media");
        i && t.setAttr("media", i);
        var n = t.getParam("ie");
        return void 0 !== n ? n === !0 ? [{
            raw: "<!--[if IE]>"
        }, t.getJson(), {
            raw: "<![endif]-->"
        }] : n === !1 ? [{
            raw: "<!--[if !IE]> -->"
        }, t.getJson(), {
            raw: "<!-- <![endif]-->"
        }] : [{
            raw: "<!--[if " + n + "]>"
        }, t.getJson(), {
            raw: "<![endif]-->"
        }] : void 0
    }),
    o.match("permalink-container", function(t) {
        t.setContent({
            elem: "text",
            clickableText: t.getParam("clickableText")
        }),
        t.enableAutoInit()
    }),
    o.match("permalink-container__text", function(t) {
        t.setTag("span"),
        t.setContent(t.getParam("clickableText"))
    }),
    o.match("permalink-container__link", function(t) {
        t.setContent({
            block: "y-input"
        })
    }),
    t(o)
}),
function() {
    function t(t) {
        return t && "function" == typeof t || (t = function() {
            function t() {
                var t = function(e, i, n) {
                    var o = t._keysets[e];
                    if (!o)
                        throw new Error('Keyset "' + e + '" was not found.');
                    var s = o[i];
                    if (void 0 === s)
                        throw new Error('Key "' + i + '" in keyset "' + e + '" was not found.');
                    return "function" == typeof s ? s(n || {}) : s
                }
                ;
                return t._keysets = {},
                t._language = "ru",
                t.add = function(e, i) {
                    return t._keysets[e] = i,
                    t
                }
                ,
                t.setLanguage = function(t) {
                    return this._language = t,
                    this
                }
                ,
                t.getLanguage = function() {
                    return this._language
                }
                ,
                t.utils = {
                    plural: function(t) {
                        var e = t.count
                          , i = t.one
                          , n = t.some
                          , o = t.many;
                        void 0 === o ? o = n : void 0 === n && (n = o);
                        var s = e % 10
                          , r = e % 100;
                        return 1 === s && 11 !== r ? i : s > 1 && 5 > s && (10 > r || r > 20) ? n : o
                    },
                    include: function(e) {
                        var i = {};
                        for (var n in e)
                            e.hasOwnProperty(n) && "key" !== n && "keyset" !== n && (i[n] = e[n]);
                        return t(e.keyset, e.key, i)
                    }
                },
                t
            }
            return t()
        }()),
        t.add("boarding-scheme", {
            "position-1": "Садитесь в первый вагон",
            "position-2": "Садитесь ближе к началу",
            "position-3": "Садитесь ближе к центру",
            "position-4": "Садитесь ближе к концу",
            "position-5": "Садитесь в последний вагон"
        }),
        t.add("cities", {
            istanbul: "Стамбул",
            kharkov: "Харьков",
            kiev: "Киев",
            minsk: "Минск",
            moscow: "Москва",
            spb: "Санкт-Петербург"
        }),
        t.add("cities-genitive", {
            kharkov: "Харькова",
            kiev: "Киева",
            minsk: "Минска",
            moscow: "Москвы",
            spb: "Санкт-Петербурга"
        }),
        t.add("footer", {
            ads: "Реклама",
            feedback: "Обратная связь",
            "get-mobile-app": function(t) {
                return "Схема метро " + t.CityName + " в вашем мобильном"
            },
            help: "Помощь",
            "user-agreement": "Пользовательское соглашение",
            "yandex-company-name": "Яндекс"
        }),
        t.add("main", {
            description: function(t) {
                return "Яндекс.Метро — интерактивная карта метро " + t.CityName + " с расчётом времени и прокладкой маршрутов с учётом данных о закрытии станций и вестибюлей."
            },
            "long-service-name": "Яндекс.Метро",
            "page-title": function(t) {
                return "Схема метро " + t.CityName
            },
            "service-name": "Метро"
        }),
        t.add("route-list-item", {
            "hour-abr": "ч.",
            "minute-abr": "мин.",
            "no-transfers": "без пересадок",
            "transfer-plural": "пересадки",
            "transfer-singular": "пересадка"
        }),
        t.add("route-permalink-block", {
            "get-link-to-route": "Получить ссылку на маршрут"
        }),
        t.add("routing-hint", {
            "error-no-route-found": "Не найден маршрут между выбранными станциями",
            "select-from": "Выберите начальную станцию",
            "select-from-to": "Выберите начальную<br /> и конечную станции",
            "select-to": "Выберите конечную станцию"
        }),
        t.add("services-board", {
            afisha: "Афиша",
            "all-services": "Все сервисы",
            auto: "Авто",
            blogs: "Блоги",
            browser: "Браузер",
            disk: "Диск",
            images: "Картинки",
            mail: "Почта",
            maps: "Карты",
            market: "Маркет",
            money: "Деньги",
            music: "Музыка",
            news: "Новости",
            search: "Поиск",
            taxi: "Такси",
            translate: "Перевод",
            video: "Видео"
        }),
        t.add("suggest", {
            "from-placeholder": "Откуда",
            "to-placeholder": "Куда"
        }),
        t.add("y-suggest-drop", {
            "group-type-search": "Поиск",
            "group-type-personal": "Вы искали",
            "group-type-nav": "Сайт"
        }),
        t.setLanguage("ru"),
        t
    }
    "undefined" != typeof modules ? modules.define("y-i18n", function(e, i) {
        e(t(i))
    }) : "undefined" != typeof module ? module.exports = function() {
        return t()
    }
    : "undefined" != typeof window ? window.i18n = t() : i18n = t()
}(),
function() {
    var t = window.Modernizr;
    try {
        delete window.Modernizr
    } catch (e) {}
    modules.define("modernizr", function(e) {
        e(t)
    })
}();
