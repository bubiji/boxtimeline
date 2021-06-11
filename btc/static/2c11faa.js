(window.webpackJsonp = window.webpackJsonp || []).push([[23], {
  1003 : function(t, e, r) {
    "use strict";
    r(735)
  },
  1004 : function(t, e, r) {
    "use strict";
    r(736)
  },
  1006 : function(t, e, r) {
    "use strict";
    r(738)
  },
  1007 : function(t, e, r) {
    "use strict";
    r(739)
  },
  1008 : function(t, e, r) {
    "use strict";
    r(740)
  },
  1018 : function(t, e, r) {
    "use strict";
    r.r(e);
    r(99),
    r(70),
    r(216),
    r(100);
    var n = r(25),
    a = (r(71), r(18)),
    i = r(88),
    c = r.n(i),
    s = (r(151), r(154), r(316), r(496)),
    o = {
      data: function() {
        return {
          sound: null,
          playing: !1
        }
      },
      mounted: function() {
        var t = this;
        this.playAudio(),
        document.addEventListener("WeixinJSBridgeReady", (function() {
          t.playAudio()
        }), !1)
      },
      methods: {
        playAudio: function() {
          this.sound = document.getElementById("audio"),
          this.sound.paused && this.sound.play(),
          this.playing = !0
        },
        handlePlayMusic: function(t) {
          this.playing ? this.sound.pause() : this.sound.play(),
          this.playing = t
        },
      }
    },
    l = (r(1003), r(1004), r(86)),
    u = Object(l.a)(o, (function() {
      var t = this,
      e = t.$createElement,
      r = t._self._c || e;
      return r("div", {
        staticClass: "trend-tool--right"
      },
      [t._v(" "), r("span", [r("span", {
        directives: [{
          name: "show",
          rawName: "v-show",
          value: t.playing,
          expression: "playing"
        }],
        on: {
          click: function(e) {
            return t.handlePlayMusic(!1)
          }
        }
      },
      [r("i", {
        staticClass: "music-indicator music-indicator--play"
      })]), t._v(" "), r("span", {
        directives: [{
          name: "show",
          rawName: "v-show",
          value: !t.playing,
          expression: "!playing"
        }],
        on: {
          click: function(e) {
            return t.handlePlayMusic(!0)
          }
        }
      },
      [r("i", {
        staticClass: "music-indicator music-indicator--pause"
      })])]), t._v(" "), r("audio", {
        attrs: {
          preload: "auto",
          id: "audio",
          src: "/static/music.mp3",
          loop: "true"
        }
      })])
    }), [], !1, null, "0e759f36", null).exports,
    d = (r(126), {
      props: ["current", "coinData", "orientation", "scaleX", "scaleY"],
      data: function() {
        return {
          xScale: void 0,
          trackWidth: 635
        }
      },
      computed: {
        percent: function() {
          return this.current / this.coinData.length
        },
        translateX: function() {
          return this.percent * this.trackWidth
        }
      },
      methods: {
        renderThumb: function() {
          var coinData = this.coinData.slice();
          if (0 !== coinData.length) {
            var max = 0,
            min = 1 / 0;
            coinData.forEach((function(t) {
              t.value > max && (max = t.value),
              t.value < min && (min = t.value)
            }));
            var n = 3,
            a = 0,
            i = 635 - a - 0,
            c = 40 - n - 23,
            o = s.s("#thumb-chart-1").append("g").attr("transform", "translate(".concat(a, ", ").concat(n, ")")),
            l = s.r().domain([new Date(coinData[0].time), new Date(coinData[coinData.length - 1].time)]).range([0, i]),
            u = s.q().domain([min, max]).range([c, 0]),
            d = s.n().curve(s.f).x((function(t, e) {
              return l(t.time)
            })).y((function(t, e) {
              return u(t.value)
            }));
            o.append("g").attr("class", "axis thumb-axis--x-1").attr("transform", "translate(0, ".concat(u(min) + 3, ")")).call(s.c(l).tickValues([coinData[0].time, coinData[coinData.length - 1].time]).tickFormat(s.t("%y-%m-%d"))).call((function(t) {
              return t.selectAll(".tick line").remove()
            })).call((function(t) {
              var e = t.selectAll(".tick text");
              e.filter((function(t, e) {
                return 0 === e
              })).attr("text-anchor", "start"),
              e.filter((function(t, e) {
                return 1 === e
              })).attr("text-anchor", "end")
            })),
            o.append("g").append("path").datum(coinData).attr("id", "thumb-line").attr("fill", "none").attr("stroke", "#5C8BB8").attr("opacity", "0.2").attr("d", d),
            this.xScale = l
          }
        },
        bindDrag: function() {
          var t = this;
          s.s("#end-handler-1").classed("dragging", !0);
          s.i.on("drag", (function() {
            var e = s.i.x / t.scaleX;
            "v" === t.orientation && (e = s.i.y / t.scaleY);
            var r = e / t.trackWidth;
            r < 0 && (r = 0),
            r > 1 && (r = 1);
            var n = Math.round(t.coinData.length * r);
            t.$emit("current-change", n)
          }))
        },
        handleProgressClick: function(t) {
          var e, r = this.$refs.track.getBoundingClientRect(),
          n = r.left,
          a = r.width,
          i = r.top,
          c = r.height; (e = "v" === this.orientation ? (t.clientY - i) / c: (t.clientX - n) / a) < 0 && (e = 0),
          e > 1 && (e = 1);
          var s = Math.round(this.coinData.length * e);
          this.$emit("current-change", s)
        },
        renderChart: function() {
          this.renderThumb()
        }
      },
      watch: {
        current: function(t) {
          var e = this,
          r = this.xScale,
          n = this.coinData,
          a = this.current;
          s.s(".thumb-axis--x-1").call(s.c(r).tickValues([n[0].time, n[a].time, n[n.length - 1].time]).tickFormat(s.t("%y-%m-%d"))).call((function(t) {
            return t.selectAll(".tick line").remove()
          })).call((function(t) {
            var r = t.selectAll(".tick text");
            r.filter((function(t, e) {
              return 0 === e
            })).attr("text-anchor", "start").attr("opacity", (function() {
              return e.percent < .13 ? 0 : 1
            })),
            r.filter((function(t, e) {
              return 1 === e
            })).attr("text-anchor", (function() {
              return e.percent < .13 ? "start": e.percent > .87 ? "end": "middle"
            })).attr("opacity", 1),
            r.filter((function(t, e) {
              return 2 === e
            })).attr("text-anchor", "end").attr("opacity", (function() {
              return e.percent > .87 ? 0 : 1
            }))
          }))
        }
      },
      mounted: function() {
        this.renderChart(),
        s.s("#end-handler-1").call(s.g().on("start", this.bindDrag))
      },
      beforeDestroy: function() {
        s.s("#end-handler-1").on("drag", null)
      }
    });
    function f(t, e) {
      var r = Object.keys(t);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(t);
        e && (n = n.filter((function(e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable
        }))),
        r.push.apply(r, n)
      }
      return r
    }
    function p(t) {
      for (var e = 1; e < arguments.length; e++) {
        var r = null != arguments[e] ? arguments[e] : {};
        e % 2 ? f(Object(r), !0).forEach((function(e) {
          Object(n.a)(t, e, r[e])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : f(Object(r)).forEach((function(e) {
          Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e))
        }))
      }
      return t
    }
    var h = {
      components: {
        Progress: Object(l.a)(d, (function() {
          var t = this.$createElement,
          e = this._self._c || t;
          return e("div", {
            staticClass: "progress-container"
          },
          [e("div", {
            attrs: {
              id: "thumb-container-1"
            }
          },
          [e("div", {
            attrs: {
              id: "thumb-chart-bg-1"
            }
          }), this._v(" "), e("svg", {
            attrs: {
              id: "thumb-chart-1"
            }
          }), this._v(" "), e("div", {
            ref: "track",
            staticClass: "controller-container",
            on: {
              click: this.handleProgressClick
            }
          },
          [e("div", {
            attrs: {
              id: "start-handler-1"
            }
          }), this._v(" "), e("div", {
            staticClass: "controller-progress",
            style: {
              width: this.translateX + "px"
            }
          }), this._v(" "), e("div", {
            style: {
              transform: "translateX(" + this.translateX + "px)"
            },
            attrs: {
              id: "end-handler-1"
            }
          })])])])
        }), [], !1, null, null, null).exports,
        Tool: u
      },
      props: ["coinData", "milestones", "orientation", "scaleX", "scaleY"],
      data: function() {
        return {
          lineEl: void 0,
          width: 0,
          rawCurrent: 0
        }
      },
      computed: {
        coin: function() {
          return "btc"
        },
        partionData: function() {
          var t = this.rawCurrent;
          return t <= 180 ? this.coinData.slice(0, 180) : this.coinData.slice(t - 180, t + 1)
        },
        totalLen: function() {
          return this.coinData.length
        },
        currentTime: function() {
          return 0 === this.coinData.length ? "--": c()(this.coinData[this.rawCurrent].time).format("YYYY-MM-DD")
        },
        milestoneMap: function() {
          var t = {};
          return this.milestones.forEach((function(e) {
            e.inchart_h5 && (t[e.time] = e)
          })),
          t
        },
        computedMilestones: function() {
          var t = this.milestoneMap,
          e = [];
          return this.partionData.forEach((function(r) {
            t[r.time] && e.push(p(p({},
            r), t[r.time]))
          })),
          e
        }
      },
      methods: {
        normalizePrice: function(t) {
          var e, r = Math.abs(t);
          if (0 === r || r > 10) e = 2;
          else if (r > 1) e = 3;
          else {
            if (Math.floor(Math.log(t) / Math.LN10) > 4) return t;
            e = 4
          }
          return t.toFixed(e)
        },
        renderChart: function() {
          var t = this.partionData.slice();
          if (! (t.length < 2)) {
            var e = 0,
            r = 1 / 0;
            t.forEach((function(coin) {
              coin.value > e && (e = coin.value),
              coin.value < r && (r = coin.value)
            }));
            var n = s.u().duration(500).ease(s.h),
            a = s.s("#trend-chart-1"),
            i = 120,
            c = 50,
            o = 796.25 - c - 90,
            l = 347.5 - i - 40,
            u = a.append("g").attr("transform", "translate(".concat(c, ", ").concat(i, ")")),
            d = u.append("defs");
            d.append("clipPath").attr("id", "clip-1").append("rect").attr("id", "clipRect-1").attr("y", "-100").attr("width", 0).attr("height", l + 100),
            this.genDefs(d);
            var f = s.r().domain([new Date(t[0].time), new Date(t[t.length - 1].time)]).range([0, o]),
            p = s.q().domain([r, e]).range([l - 55, 0]),
            h = s.n().curve(s.f).x((function(coin) {
              return f(coin.time)
            })).y((function(coin) {
              return p(coin.value)
            })),
            m = s.b().curve(s.f).x((function(coin) {
              return f(coin.time)
            })).y0((function(coin) {
              return p(coin.value)
            })).y1((function() {
              return p(r)
            }));
            u.append("g").attr("class", "axis axis--x-1").attr("transform", "translate(0, ".concat(l, ")")).call(s.c(f).ticks(5).tickFormat(s.t("%Y-%m-%d"))).call((function(elem) {
              return elem.selectAll("text").attr("y", "16")
            })),
            u.append("g").attr("class", "axis axis--y-1").call(s.d(p).ticks(5)).call((function(elem) {
              return elem.selectAll(".tick line").attr("x2", o).attr("stroke", "#F3F0F7")
            }));
            var v = u.append("g").attr("clip-path", "url(#clip-1)").append("g").attr("id", "trans-group-1"),
            g = v.append("path").datum(t).attr("id", "trend-line-1").attr("fill", "none").attr("stroke", "url(#linearGradient1-1)").attr("stroke-width", "3").attr("d", h).attr("filter", "url(#lineShadow1-1)");
            v.append("path").datum(t).attr("id", "trend-area-1").attr("fill", "url(#linearGradient2-1)").attr("stroke", "none").attr("d", m);
            v.append("g").attr("id", "annotations-container-1"),
            this.renderMilestone(f, p);
            var w = u.append("g").attr("id", "currentPrice-1").attr("transform", "translate(".concat(f(this.coinData[this.rawCurrent].time), ", ").concat(p(this.coinData[this.rawCurrent].value), ")"));
            w.append("circle").attr("cx", "0").attr("cy", "0").attr("r", "20").attr("fill", "rgba(3, 133, 255, 0.05)"),
            w.append("circle").attr("id", "priceCircle-1").attr("cx", "0").attr("cy", "0").attr("r", "12").attr("fill", "rgba(3, 133, 255, 0.15)"),
            w.append("circle").attr("cx", "0").attr("cy", "0").attr("r", "5").attr("id", "priceCircle1-1").attr("fill", "rgba(3, 133, 255)"),
            w.append("circle").attr("cx", "0").attr("cy", "0").attr("r", "5").attr("fill", "rgba(3, 133, 255)"),
            w.append("text").attr("x", "21").attr("y", "0").attr("dy", "3").attr("id", "current-price-text-1").text("$ ".concat(this.normalizePrice(t[t.length - 1].value)));
            var b = this;
            n.select("#trans-group-1").on("start", (function() {
              s.s(this).datum(t).call((function() {
                n.select("#trend-line-1").attr("d", h),
                n.select("#trend-area-1").attr("d", m)
              })).attr("transform", null),
              s.a(this).transition().on("start", (function() {
                b.rawCurrent += 1
              }))
            })),
            this.xScale = f,
            this.yScale = p,
            this.lineEl = g,
            this.width = o
          }
        },
        genDefs: function(t) {
          t.append("linearGradient").attr("id", "linearGradient1-1").attr("x2", "100%").attr("y2", "0").call((function(t) {
            t.append("stop").attr("offset", "0").attr("stop-color", "#1EDFD7"),
            t.append("stop").attr("offset", "25%").attr("stop-color", "#0879FE"),
            t.append("stop").attr("offset", "50%").attr("stop-color", "#1EDFD7"),
            t.append("stop").attr("offset", "100%").attr("stop-color", "#0879FE")
          })),
          t.append("linearGradient").attr("id", "linearGradient2-1").attr("x2", "0").attr("y2", "100%").call((function(t) {
            t.append("stop").attr("offset", "0").attr("stop-color", "rgba(76, 106, 255, .2)"),
            t.append("stop").attr("offset", "100%").attr("stop-color", "rgba(102, 179, 255, 0)")
          })),
          t.append("linearGradient").attr("id", "linearGradientDown-1").attr("x2", "0").attr("y2", "100%").call((function(t) {
            t.append("stop").attr("offset", "0").attr("stop-color", "rgba(255, 74, 74, 1)"),
            t.append("stop").attr("offset", "100%").attr("stop-color", "rgba(255, 74, 74, 0)")
          })),
          t.append("linearGradient").attr("id", "linearGradientDownReverse-1").attr("x2", "0").attr("y2", "100%").call((function(t) {
            t.append("stop").attr("offset", "0").attr("stop-color", "rgba(255, 74, 74, 0)"),
            t.append("stop").attr("offset", "100%").attr("stop-color", "rgba(255, 74, 74, 1)")
          })),
          t.append("linearGradient").attr("id", "linearGradientGrow-1").attr("x2", "0").attr("y2", "100%").call((function(t) {
            t.append("stop").attr("offset", "0").attr("stop-color", "rgba(40, 173, 98, 1)"),
            t.append("stop").attr("offset", "100%").attr("stop-color", "rgba(40, 173, 98, 0)")
          })),
          t.append("linearGradient").attr("id", "linearGradientGrowReverse-1").attr("x2", "0").attr("y2", "100%").call((function(t) {
            t.append("stop").attr("offset", "0").attr("stop-color", "rgba(40, 173, 98, 0)"),
            t.append("stop").attr("offset", "100%").attr("stop-color", "rgba(40, 173, 98, 1)")
          })),
          t.append("filter").attr("id", "lineShadow1-1").call((function(t) {
            t.append("feOffset").attr("in", "SourceGraphic").attr("dy", "15").attr("dx", "1"),
            t.append("feGaussianBlur").attr("stdDeviation", "5"),
            t.append("feComponentTransfer").append("feFuncA").attr("type", "linear").attr("slope", "0.4"),
            t.append("feBlend").attr("in", "SourceGraphic").attr("mode", "normal")
          })),
          t.append("filter").attr("id", "annotationShadow-1").attr("x", "-1").attr("y", "-1").attr("width", "110%").attr("height", "110%").call((function(t) {
            t.append("feDropShadow").attr("in", "SourceGraphic").attr("dy", "3").attr("dx", "0").attr("flood-color", "rgba(29, 128, 72, 0.16)").attr("stdDeviation", "16")
          })),
          t.append("animate").attr("xlink:href", "#priceCircle").attr("attributeType", "XML").attr("attributeName", "r").attr("from", "12").attr("to", "20").attr("dur", "2s").attr("repeatCount", "indefinite"),
          t.append("animate").attr("xlink:href", "#priceCircle").attr("attributeType", "XML").attr("attributeName", "fill").attr("from", "rgba(3, 133, 255, 0.15)").attr("to", "rgba(3, 133, 255, 0)").attr("dur", "2s").attr("repeatCount", "indefinite"),
          t.append("animate").attr("xlink:href", "#priceCircle1").attr("attributeType", "XML").attr("attributeName", "r").attr("from", "5").attr("to", "12").attr("dur", "2s").attr("repeatCount", "indefinite"),
          t.append("animate").attr("xlink:href", "#priceCircle1").attr("attributeType", "XML").attr("attributeName", "fill").attr("from", "rgba(3, 133, 255, 1)").attr("to", "rgba(3, 133, 255, .15)").attr("dur", "2s").attr("repeatCount", "indefinite")
        },
        renderMilestone: function(t, e) {
          var r = document.getElementById("text-ruler");
          s.s("#annotations-container-1").selectAll("g.annotation-container-1").data(this.computedMilestones.slice(), (function(t) {
            return t.incident
          })).join((function(n) {
            n.append("g").attr("class", "annotation-container-1").attr("opacity", 0).attr("transform", (function(e, r) {
              return "translate(".concat(t(e.time), ", 0)")
            })).each((function() {
              var t = s.s(this).append("g"),
              e = "annotation-" + ("" + Math.random()).substring(2, 10),
              n = t.append("foreignObject").attr("y", (function(t) {
                return 100 <= t.offset_h5 ? (t.offset_h5 || 0) : -20 + (t.offset_h5 || 0)
              })).attr("x", -9).attr("height", 16);
              n.append("xhtml:div").attr("id", e).attr("class", (function(t) {
                return "annotation-text " + (t.bullish ? "annotation-text--up": "annotation-text--down")
              })).text((function(t) {
                return r.textContent = t.incident,
                t.incident
              }));
              var a = r.getBoundingClientRect(),
              i = a.height,
              c = a.width;
              c = Math.max(i, c),
              n.attr("width", c),
              t.attr("transform", (function(t) {
                return "translate(".concat( - c / 2 - (t.hoffset_h5 || 0), ", 0)")
              }))
            })).call((function(t) {
              var r = t.append("g");
              r.append("circle").attr("cx", "0").attr("cy", (function(t) {
                return 100 <= t.offset_h5 ? (t.offset_h5 || 0) : (t.offset_h5 || 0) - 5
              })).attr("r", "4").attr("fill", (function(t) {
                return t.bullish ? "rgba(40, 173, 98, 0.4)": "rgba(255, 74, 74, 0.4)"
              })),
              r.append("line").attr("x1", "0").attr("y1", (function(t) {
                return 100 <= t.offset_h5 ? 4 + (t.offset_h5 || 0) : (t.offset_h5 || 0) - 5
              })).attr("x2", "0.001").attr("y2", (function(t) {
                return e(t.value)
              })).attr("stroke-width", "2").attr("stroke", (function(t) {
                return t.bullish ? 100 <= t.offset_h5 ? "url(#linearGradientGrowReverse-1)": "url(#linearGradientGrow-1)": 100 <= t.offset_h5 ? "url(#linearGradientDownReverse-1)": "url(#linearGradientDown-1)"
              })),
              r.append("circle").attr("cx", "0").attr("cy", (function(t) {
                return 100 <= t.offset_h5 ? (t.offset_h5 || 0) : (t.offset_h5 || 0) - 5
              })).attr("r", "2").attr("stroke-width", "2").attr("stroke", "#FFF").attr("fill", (function(t) {
                return t.bullish ? "rgba(40, 173, 98, 1)": "rgba(255, 74, 74, 1)"
              }))
            })).call((function(t) {
              s.u().duration(400).selectAll(".annotation-container-1").attr("opacity", 1)
            }))
          }), (function(r) {
            r.attr("transform", (function(e, r) {
              return "translate(".concat(t(e.time), ", 0)")
            })),
            r.select("line").attr("y2", (function(t) {
              return e(t.value)
            }))
          }), (function(t) {
            t.remove()
          }))
        },
        updateChart: function() {
          var t = this,
          e = this.xScale,
          r = this.yScale,
          n = (this.xAxisTransition, this.yAxisTransition, this.lineEl, this.width),
          a = s.u().duration(100).ease(s.h),
          i = this.partionData.slice();
          if (! (i.length < 2)) {
            var c = 0,
            o = 1 / 0;
            i.forEach((function(t) {
              t.value > c && (c = t.value),
              t.value < o && (o = t.value)
            })),
            e.domain([new Date(i[0].time), new Date(i[i.length - 2].time)]),
            r.domain([o, c]);
            var l = s.n().curve(s.f).x((function(t, r) {
              return e(t.time)
            })).y((function(t, e) {
              return r(t.value)
            })),
            u = s.b().curve(s.f).x((function(t, r) {
              return e(t.time)
            })).y0((function(t, e) {
              return r(t.value)
            })).y1((function(t, e) {
              return r(o)
            })),
            d = this,
            f = d.rawCurrent;
            a.select(".axis--x-1").call(s.c(e).ticks(5).tickFormat(s.t("%Y-%m-%d"))).call((function(t) {
              return t.selectAll("text").attr("y", "16")
            })),
            a.select(".axis--y-1").call(s.d(r).ticks(5)).call((function(t) {
              return t.selectAll(".tick line").attr("x2", n).attr("stroke", "#F3F0F7")
            })),
            d.rawCurrent < 179 ? a.select("#currentPrice-1").call((function(n) {
              n.attr("transform", "translate(".concat(e(i[f].time), ", ").concat(r(i[f].value), ")")),
              n.select("#current-price-text-1").text("$ ".concat(t.normalizePrice(i[f].value)))
            })) : a.select("#currentPrice-1").call((function(n) {
              n.attr("transform", "translate(".concat(e(i[i.length - 1].time) - 5, ", ").concat(r(i[i.length - 1].value), ")")),
              n.select("#current-price-text-1").text("$ ".concat(t.normalizePrice(i[i.length - 1].value)))
            })),
            a.select("#trans-group-1").on("start", (function() {
              d.renderMilestone(e, r),
              f < 180 ? (s.s(this).datum(i).call((function(t) {
                s.s("#trend-line-1").datum(i).attr("d", l),
                s.s("#trend-area-1").datum(i).attr("d", u)
              })).attr("transform", null), s.u().duration(100).ease(s.h).select("#clipRect-1").attr("width", e(i[f].time)), s.a(this).transition().on("start", (function() {
                d.rawCurrent + 1 < d.totalLen && (d.rawCurrent += 1)
              }))) : (s.u().duration(100).ease(s.h).select("#clipRect-1").attr("width", n), s.s(this).datum(i).call((function(t) {
                s.s("#trend-line-1").datum(i).attr("d", l),
                s.s("#trend-area-1").datum(i).attr("d", u)
              })).attr("transform", null), s.a(this).attr("transform", "translate(".concat( - e(i[1].time), ", 0)")).transition().on("start", (function() {
                d.rawCurrent + 1 < d.totalLen && (d.rawCurrent += 1)
              })))
            }))
          }
        },
        handleCurrentChange: function(t) {
          t > this.totalLen - 1 && (t = this.totalLen - 1),
          t < 0 && (t = 0),
          this.rawCurrent = t
        }
      },
      watch: {
        partionData: function() {
          this.updateChart()
        }
      },
      mounted: function() {
        this.renderChart()
      }
    },
    m = (r(1006), r(1007), Object(l.a)(h, (function() {
      var t = this,
      e = t.$createElement,
      n = t._self._c || e;
      return n("div", {
        staticClass: "trend-container"
      },
      [n("div", {
        staticClass: "trend-desc"
      },
      [t._v(" "), n("h3", {
        staticClass: "trend-desc__time"
      },
      [n("span", [t._v("BTC")]), t._v("\n      " + t._s(t.currentTime) + "\n    ")]), t._v(" "), n("Tool")], 1), t._v(" "), n("div", {
        staticClass: "chart-container--outer"
      },
      [n("div", {
        attrs: {
          id: "chart-container-1"
        }
      },
      [n("svg", {
        attrs: {
          id: "trend-chart-1"
        }
      })])]), t._v(" "), n("div", {
        staticClass: "chart-controller"
      },
      [n("Progress", {
        attrs: {
          coinData: t.coinData,
          current: t.rawCurrent,
          orientation: t.orientation,
          scaleX: t.scaleX,
          scaleY: t.scaleY
        },
        on: {
          "current-change": t.handleCurrentChange
        }
      })], 1)])
    }), [], !1, null, "5f143f74", null).exports),
    v = r(503),
    g = r(490);
    function w(t, e) {
      var r = Object.keys(t);
      if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(t);
        e && (n = n.filter((function(e) {
          return Object.getOwnPropertyDescriptor(t, e).enumerable
        }))),
        r.push.apply(r, n)
      }
      return r
    }
    function b(t) {
      for (var e = 1; e < arguments.length; e++) {
        var r = null != arguments[e] ? arguments[e] : {};
        e % 2 ? w(Object(r), !0).forEach((function(e) {
          Object(n.a)(t, e, r[e])
        })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : w(Object(r)).forEach((function(e) {
          Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e))
        }))
      }
      return t
    }
    var x = {
      components: {
        Chart: m,
        Container: v.a,
        Loading: g.a
      },
      data: function() {
        return {
          loading: !0
        }
      },
      asyncData: function(t) {
        return Object(a.a)(regeneratorRuntime.mark((function e() {
          var r, n, a;
          return regeneratorRuntime.wrap((function(e) {
            for (;;) switch (e.prev = e.next) {
            case 0:
              return t.store,
              t.params,
              r = t.error,
              n = t.app,
              e.next = 3,
              n.$api.get("/api/w1/btc_10years").
              catch((function(t) {
                return r({
                  statusCode: t.code,
                  message: t.message
                })
              }));
            case 3:
              return a = e.sent,
              e.abrupt("return", {
                resData: a.data
              });
            case 5:
            case "end":
              return e.stop()
            }
          }), e)
        })))()
      },
      computed: {
        coin: function() {
          return "btc"
        },
        prices: function() {
          return this.resData.slice().map((function(t) {
            return {
              value: +t.price,
              time: 1e3 * t.time
            }
          }))
        },
        milestones: function() {
          var t = [];
          return this.resData.slice().forEach((function(e) {
            var r = e.incidents;
            r.length > 0 && r.forEach((function(r, n) {
              t.push(b(b({},
              r), {},
              {
                time: 1e3 * e.time,
                date: c.a.unix(e.time).format("YYYY-MM-DD")
              }))
            }))
          })),
          t.reverse()
        }
      },
      methods: {
        wxShareTimeline: function() {
        },
        wxShareAppMessage: function() {
        },
        wxRegCallback: function() {
          this.wxShareTimeline(),
          this.wxShareAppMessage()
        }
      },
      mounted: function() {
        this.$wxApi.wxRegister(this.wxRegCallback, this.$api)
      },
      head: function() {
        return {
          title: "BTC",
          meta: [{
            hid: "description",
            name: "description",
            content: "I DONT KNOWN"
          }]
        }
      }
    },
    y = (r(1008), Object(l.a)(x, (function() {
      var t = this,
      e = t.$createElement,
      r = t._self._c || e;
      return r("div", {
        staticClass: "full"
      },
      [r("Loading", {
        attrs: {
          loading: t.loading || 0 === t.prices.length
        }
      }), t._v(" "), r("Container", {
        directives: [{
          name: "show",
          rawName: "v-show",
          value: !t.loading,
          expression: "!loading"
        }],
        on: {
          loaded: function(e) {
            t.loading = !1
          }
        },
        scopedSlots: t._u([{
          key: "default",
          fn: function(e) {
            var n = e.orientation,
            a = e.scaleX,
            i = e.scaleY;
            return [r("Chart", {
              attrs: {
                coinData: t.prices,
                milestones: t.milestones,
                orientation: n,
                scaleX: a,
                scaleY: i
              }
            })]
          }
        }])
      }), t._v(" "), t._m(0)], 1)
    }), [function() {
      var t = this.$createElement,
      e = this._self._c || t;
      return e("div", {
        staticClass: "text-ruler__outer"
      },
      [e("div", {
        attrs: {
          id: "text-ruler"
        }
      })])
    }], !1, null, "4de431a2", null));
    e.
  default = y.exports
  },
  483 : function(t, e, r) {},
  489 : function(t, e, r) {
    "use strict";
    r(483)
  },
  490 : function(t, e, r) {
    "use strict";
    var n = {
      props: {
        loading: {
          type: Boolean,
        default:
          !1
        },
        size: {
          type: String,
        default:
          ""
        },
        isCenter: {
          type: Boolean,
        default:
          !1
        }
      }
    },
    a = (r(489), r(86)),
    i = Object(a.a)(n, (function() {
      var t = this.$createElement,
      e = this._self._c || t;
      return this.loading ? e("div", {
        staticClass: "x-loading"
      },
      [e("div", {
        staticClass: "loading-spinner",
        class: [this.size ? "loading-spinner--" + this.size: "", this.isCenter ? "loading-spinner--center": ""]
      },
      [this._m(0)])]) : this._e()
    }), [function() {
      var t = this,
      e = t.$createElement,
      r = t._self._c || e;
      return r("div", {
        staticClass: "sk-fading-circle"
      },
      [r("div", {
        staticClass: "sk-circle1 sk-circle"
      }), t._v(" "), r("div", {
        staticClass: "sk-circle2 sk-circle"
      }), t._v(" "), r("div", {
        staticClass: "sk-circle3 sk-circle"
      }), t._v(" "), r("div", {
        staticClass: "sk-circle4 sk-circle"
      }), t._v(" "), r("div", {
        staticClass: "sk-circle5 sk-circle"
      }), t._v(" "), r("div", {
        staticClass: "sk-circle6 sk-circle"
      }), t._v(" "), r("div", {
        staticClass: "sk-circle7 sk-circle"
      }), t._v(" "), r("div", {
        staticClass: "sk-circle8 sk-circle"
      }), t._v(" "), r("div", {
        staticClass: "sk-circle9 sk-circle"
      }), t._v(" "), r("div", {
        staticClass: "sk-circle10 sk-circle"
      }), t._v(" "), r("div", {
        staticClass: "sk-circle11 sk-circle"
      }), t._v(" "), r("div", {
        staticClass: "sk-circle12 sk-circle"
      })])
    }], !1, null, "e0a2332e", null);
    e.a = i.exports
  },
  492 : function(t, e, r) {},
  502 : function(t, e, r) {
    "use strict";
    r(492)
  },
  503 : function(t, e, r) {
    "use strict";
    r(35),
    r(127),
    r(71);
    var n = r(18),
    a00 = {
      data: function() {
        return {
          scaleX: 1,
          scaleY: 1,
          orientation: "v"
        }
      },
      methods: {
        handleScale: function() {
          var scaleX = Math.max(window.innerHeight, window.innerWidth) / 667,
          scaleY = Math.min(window.innerHeight, window.innerWidth) / 375;
          this.scaleX = scaleX,
          this.scaleY = scaleY
        },
        handleRotate: function(t) {
          var self = this;
          return Object(n.a)(regeneratorRuntime.mark((function t() {
            return regeneratorRuntime.wrap((function(step) {
              for (;;) switch (step.prev = step.next) {
              case 0:
                return ! 1,
                step.next = 3,
                new Promise((function(resolve) {
                  setTimeout((function() {
                    resolve()
                  }), 200)
                }));
              case 3:
                window.innerWidth > window.innerHeight ? (self.orientation = "h", self.$refs.rotateContainer.style.transform = "rotateZ(0deg)", self.$refs.scaleContainer.style.transformOrigin = "0 0") : (self.orientation = "v", self.$refs.rotateContainer.style.transform = "translateX(375px) rotateZ(90deg)", self.$refs.scaleContainer.style.transformOrigin = "0 100%"),
                self.handleScale();
              case 6:
              case "end":
                return step.stop()
              }
            }), t)
          })))()
        }
      },
      mounted: function() {
        var self = this;
        return Object(n.a)(regeneratorRuntime.mark((function e() {
          return regeneratorRuntime.wrap((function(step) {
            for (;;) switch (step.prev = step.next) {
            case 0:
              return self.$refs.rotateContainer.style.width = "667px",
              self.$refs.rotateContainer.style.height = "375px",
              self.$refs.rotateContainer.style.transform = "translateX(375px) rotateZ(90deg)",
              self.rotateCallback = self.handleRotate.bind(t),
              window.addEventListener("resize", self.rotateCallback),
              window.addEventListener("orientationchange", self.rotateCallback),
              step.next = 8,
              self.handleRotate();
            case 8:
              self.$emit("loaded");
            case 9:
            case "end":
              return step.stop()
            }
          }), e)
        })))()
      },
      beforeDestroy: function() {
        window.removeEventListener("resize", this.rotateCallback),
        window.removeEventListener("orientationchange", this.rotateCallback)
      }
    },
    i = (r(502), r(86)),
    c = Object(i.a)(a00, (function() {
      var createElement = this._self._c || this.$createElement;
      return createElement("div", {
        ref: "rotateContainer",
        staticClass: "rotate-container"
      },
      [createElement("div", {
        ref: "scaleContainer",
        staticClass: "scale-container",
        style: {
          transform: "scale(" + this.scaleX + ", " + this.scaleY + ")"
        }
      },
      [createElement("div", {
        staticClass: "main"
      },
      [this._t("default", null, {
        orientation: this.orientation,
        scaleX: this.scaleX,
        scaleY: this.scaleY
      })], 2)])])
    }), [], !1, null, "64b87518", null);
    e.a = c.exports
  },
  735 : function(t, e, r) {},
  736 : function(t, e, r) {},
  738 : function(t, e, r) {},
  739 : function(t, e, r) {},
  740 : function(t, e, r) {}
}]);
