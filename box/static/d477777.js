!function(e) {
	function a(a) {
		for (var n, d, o = a[0], c = a[1], i = a[2], p = 0, f = []; p < o.length; p++) d = o[p],
		Object.prototype.hasOwnProperty.call(r, d) && r[d] && f.push(r[d][0]),
		r[d] = 0;
		for (n in c) Object.prototype.hasOwnProperty.call(c, n) && (e[n] = c[n]);
		for (g && g(a); f.length;) f.shift()();
		return s.push.apply(s, i || []),
		t()
	}
	function t() {
		for (var e, a = 0; a < s.length; a++) {
			for (var t = s[a], n = !0, d = 1; d < t.length; d++) {
				var c = t[d];
				0 !== r[c] && (n = !1)
			}
			n && (s.splice(a--, 1), e = o(o.s = t[0]))
		}
		return e
	}
	var n = {},
	d = {
		29 : 0
	},
	r = {
		29 : 0
	},
	s = [];
	function o(a) {
		if (n[a]) return n[a].exports;
		var t = n[a] = {
			i: a,
			l: !1,
			exports: {}
		};
		return e[a].call(t.exports, t, t.exports, o),
		t.l = !0,
		t.exports
	}
	o.e = function(e) {
		var a = [],
		t = function() {
			try {
				return document.createElement("link").relList.supports("preload")
			} catch(e) {
				return ! 1
			}
		} ();
		d[e] ? a.push(d[e]) : 0 !== d[e] && {
			2 : 1,
			3 : 1,
			7 : 1,
			8 : 1,
			9 : 1,
			11 : 1,
			12 : 1,
			13 : 1,
			14 : 1,
			15 : 1,
			17 : 1,
			18 : 1,
			19 : 1,
			20 : 1,
			21 : 1,
			22 : 1,
			23 : 1,
			25 : 1,
			27 : 1,
			28 : 1
		} [e] && a.push(d[e] = new Promise((function(a, n) {
			for (var r = ({
				0 : "vendors/pages/data/_slug/_coin/pages/data/ahr999/_coin/pages/data/bullcycle/pages/data/daily/pages/d/8bb2c911",
				1 : "vendors/pages/data/2020-top10/index/pages/data/defi-top10/index/pages/data/halve/_coin/pages/data/in/e3f50f4c",
				2 : "pages/data/_slug/_coin/pages/data/index/pages/data/main_funds/_coin/pages/data/market_heat/_coin",
				3 : "pages/data/_slug/_coin/pages/data/main_funds/_coin/pages/data/market_heat/_coin",
				6 : "pages/bbt-trend",
				7 : "pages/data/2020-top10/index",
				8 : "pages/data/_slug/_coin",
				9 : "pages/data/ahr999/_coin",
				10 : "pages/data/ahr999/index",
				11 : "pages/data/bullcycle",
				12 : "pages/data/daily",
				13 : "pages/data/defi-top10/index",
				14 : "pages/data/grayscale",
				15 : "pages/data/halve/_coin",
				16 : "pages/data/halve/index",
				17 : "pages/data/index",
				18 : "pages/data/investment-top10/index",
				19 : "pages/data/main_funds/_coin",
				20 : "pages/data/market-ratio",
				21 : "pages/data/market_heat/_coin",
				22 : "pages/data/top10",
				23 : "pages/data/trend/_coin",
				24 : "pages/data/trend/index",
				25 : "pages/group",
				26 : "pages/index",
				27 : "pages/us/privacy",
				28 : "pages/us/terms",
				31 : "vendors/pages/data/daily"
			} [e] || e) + "." + {
				0 : "31d6cfe",
				1 : "31d6cfe",
				2 : "030af87",
				3 : "4279929",
				6 : "31d6cfe",
				7 : "3bf2923",
				8 : "1809da7",
				9 : "e140c00",
				10 : "31d6cfe",
				11 : "f6a6eb4",
				12 : "e2aeda5",
				13 : "0a5ed1a",
				14 : "17b41c6",
				15 : "0b0447c",
				16 : "31d6cfe",
				17 : "7f03b21",
				18 : "e3962bb",
				19 : "a8c7e65",
				20 : "fb56d1a",
				21 : "2d9d75f",
				22 : "b56d743",
				23 : "806c7ae",
				24 : "31d6cfe",
				25 : "3833f52",
				26 : "31d6cfe",
				27 : "9e12674",
				28 : "b04f20d",
				31 : "31d6cfe"
			} [e] + ".css", s = o.p + r, c = document.getElementsByTagName("link"), i = 0; i < c.length; i++) {
				var p = (f = c[i]).getAttribute("data-href") || f.getAttribute("href");
				if (! ("stylesheet" !== f.rel && "preload" !== f.rel || p !== r && p !== s)) return a()
			}
			var g = document.getElementsByTagName("style");
			for (i = 0; i < g.length; i++) {
				var f;
				if ((p = (f = g[i]).getAttribute("data-href")) === r || p === s) return a()
			}
			var l = document.createElement("link");
			l.rel = t ? "preload": "stylesheet",
			t ? l.as = "style": l.type = "text/css",
			l.onload = a,
			l.onerror = function(a) {
				var t = a && a.target && a.target.src || s,
				r = new Error("Loading CSS chunk " + e + " failed.\n(" + t + ")");
				r.code = "CSS_CHUNK_LOAD_FAILED",
				r.request = t,
				delete d[e],
				l.parentNode.removeChild(l),
				n(r)
			},
			l.href = s,
			document.getElementsByTagName("head")[0].appendChild(l)
		})).then((function() {
			if (d[e] = 0, t) {
				var a = document.createElement("link");
				a.href = o.p + "" + ({
					0 : "vendors/pages/data/_slug/_coin/pages/data/ahr999/_coin/pages/data/bullcycle/pages/data/daily/pages/d/8bb2c911",
					1 : "vendors/pages/data/2020-top10/index/pages/data/defi-top10/index/pages/data/halve/_coin/pages/data/in/e3f50f4c",
					2 : "pages/data/_slug/_coin/pages/data/index/pages/data/main_funds/_coin/pages/data/market_heat/_coin",
					3 : "pages/data/_slug/_coin/pages/data/main_funds/_coin/pages/data/market_heat/_coin",
					6 : "pages/bbt-trend",
					7 : "pages/data/2020-top10/index",
					8 : "pages/data/_slug/_coin",
					9 : "pages/data/ahr999/_coin",
					10 : "pages/data/ahr999/index",
					11 : "pages/data/bullcycle",
					12 : "pages/data/daily",
					13 : "pages/data/defi-top10/index",
					14 : "pages/data/grayscale",
					15 : "pages/data/halve/_coin",
					16 : "pages/data/halve/index",
					17 : "pages/data/index",
					18 : "pages/data/investment-top10/index",
					19 : "pages/data/main_funds/_coin",
					20 : "pages/data/market-ratio",
					21 : "pages/data/market_heat/_coin",
					22 : "pages/data/top10",
					23 : "pages/data/trend/_coin",
					24 : "pages/data/trend/index",
					25 : "pages/group",
					26 : "pages/index",
					27 : "pages/us/privacy",
					28 : "pages/us/terms",
					31 : "vendors/pages/data/daily"
				} [e] || e) + "." + {
					0 : "31d6cfe",
					1 : "31d6cfe",
					2 : "030af87",
					3 : "4279929",
					6 : "31d6cfe",
					7 : "3bf2923",
					8 : "1809da7",
					9 : "e140c00",
					10 : "31d6cfe",
					11 : "f6a6eb4",
					12 : "e2aeda5",
					13 : "0a5ed1a",
					14 : "17b41c6",
					15 : "0b0447c",
					16 : "31d6cfe",
					17 : "7f03b21",
					18 : "e3962bb",
					19 : "a8c7e65",
					20 : "fb56d1a",
					21 : "2d9d75f",
					22 : "b56d743",
					23 : "806c7ae",
					24 : "31d6cfe",
					25 : "3833f52",
					26 : "31d6cfe",
					27 : "9e12674",
					28 : "b04f20d",
					31 : "31d6cfe"
				} [e] + ".css",
				a.rel = "stylesheet",
				a.type = "text/css",
				document.body.appendChild(a)
			}
		})));
		var n = r[e];
		if (0 !== n) if (n) a.push(n[2]);
		else {
			var s = new Promise((function(a, t) {
				n = r[e] = [a, t]
			}));
			a.push(n[2] = s);
			var c, i = document.createElement("script");
			i.charset = "utf-8",
			i.timeout = 120,
			o.nc && i.setAttribute("nonce", o.nc),
			i.src = function(e) {
				return o.p + "" + {
					0 : "13dfade",
					1 : "a6925f0",
					2 : "ba28dca",
					3 : "55063bb",
					6 : "ecdbb56",
					7 : "a48c146",
					8 : "010c2a2",
					9 : "f1bd67f",
					10 : "311e4bd",
					11 : "db420fb",
					12 : "9923e39",
					13 : "207b72c",
					14 : "a07d1f3",
					15 : "ebb4fa1",
					16 : "59e84c1",
					17 : "7cc649f",
					18 : "34abe8f",
					19 : "e1a9c0e",
					20 : "193184b",
					21 : "80e3ad5",
					22 : "5aebcc6",
					23 : "2c11faa",
					24 : "a241662",
					25 : "4a18cea",
					26 : "58a3db8",
					27 : "f0e4885",
					28 : "0a0b362",
					31 : "8778f1d"
				} [e] + ".js"
			} (e);
			var p = new Error;
			c = function(a) {
				i.onerror = i.onload = null,
				clearTimeout(g);
				var t = r[e];
				if (0 !== t) {
					if (t) {
						var n = a && ("load" === a.type ? "missing": a.type),
						d = a && a.target && a.target.src;
						p.message = "Loading chunk " + e + " failed.\n(" + n + ": " + d + ")",
						p.name = "ChunkLoadError",
						p.type = n,
						p.request = d,
						t[1](p)
					}
					r[e] = void 0
				}
			};
			var g = setTimeout((function() {
				c({
					type: "timeout",
					target: i
				})
			}), 12e4);
			i.onerror = i.onload = c,
			document.head.appendChild(i)
		}
		return Promise.all(a)
	},
	o.m = e,
	o.c = n,
	o.d = function(e, a, t) {
		o.o(e, a) || Object.defineProperty(e, a, {
			enumerable: !0,
			get: t
		})
	},
	o.r = function(e) {
		"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
			value: "Module"
		}),
		Object.defineProperty(e, "__esModule", {
			value: !0
		})
	},
	o.t = function(e, a) {
		if (1 & a && (e = o(e)), 8 & a) return e;
		if (4 & a && "object" == typeof e && e && e.__esModule) return e;
		var t = Object.create(null);
		if (o.r(t), Object.defineProperty(t, "default", {
			enumerable: !0,
			value: e
		}), 2 & a && "string" != typeof e) for (var n in e) o.d(t, n,
		function(a) {
			return e[a]
		}.bind(null, n));
		return t
	},
	o.n = function(e) {
		var a = e && e.__esModule ?
		function() {
			return e.
		default
		}:
		function() {
			return e
		};
		return o.d(a, "a", a),
		a
	},
	o.o = function(e, a) {
		return Object.prototype.hasOwnProperty.call(e, a)
	},
	o.p = "/static/",
	o.oe = function(e) {
		throw e
	};
	var c = window.webpackJsonp = window.webpackJsonp || [],
	i = c.push.bind(c);
	c.push = a,
	c = c.slice();
	for (var p = 0; p < c.length; p++) a(c[p]);
	var g = i;
	t()
} ([]);
