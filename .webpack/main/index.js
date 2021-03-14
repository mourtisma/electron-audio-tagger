module.exports = (function (e) {
  var t = {};
  function r(n) {
    if (t[n]) return t[n].exports;
    var o = (t[n] = { i: n, l: !1, exports: {} });
    return e[n].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
  }
  return (
    (r.m = e),
    (r.c = t),
    (r.d = function (e, t, n) {
      r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
    }),
    (r.r = function (e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (r.t = function (e, t) {
      if ((1 & t && (e = r(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var n = Object.create(null);
      if (
        (r.r(n),
        Object.defineProperty(n, 'default', { enumerable: !0, value: e }),
        2 & t && 'string' != typeof e)
      )
        for (var o in e)
          r.d(
            n,
            o,
            function (t) {
              return e[t];
            }.bind(null, o),
          );
      return n;
    }),
    (r.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return r.d(t, 'a', t), t;
    }),
    (r.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (r.p = ''),
    r((r.s = 3))
  );
})([
  function (e, t) {
    e.exports = require('electron');
  },
  function (e, t, r) {
    e.exports = function (e) {
      function t(e) {
        let r,
          o = null;
        function s(...e) {
          if (!s.enabled) return;
          const n = s,
            o = Number(new Date()),
            i = o - (r || o);
          (n.diff = i),
            (n.prev = r),
            (n.curr = o),
            (r = o),
            (e[0] = t.coerce(e[0])),
            'string' != typeof e[0] && e.unshift('%O');
          let c = 0;
          (e[0] = e[0].replace(/%([a-zA-Z%])/g, (r, o) => {
            if ('%%' === r) return '%';
            c++;
            const s = t.formatters[o];
            if ('function' == typeof s) {
              const t = e[c];
              (r = s.call(n, t)), e.splice(c, 1), c--;
            }
            return r;
          })),
            t.formatArgs.call(n, e);
          (n.log || t.log).apply(n, e);
        }
        return (
          (s.namespace = e),
          (s.useColors = t.useColors()),
          (s.color = t.selectColor(e)),
          (s.extend = n),
          (s.destroy = t.destroy),
          Object.defineProperty(s, 'enabled', {
            enumerable: !0,
            configurable: !1,
            get: () => (null === o ? t.enabled(e) : o),
            set: (e) => {
              o = e;
            },
          }),
          'function' == typeof t.init && t.init(s),
          s
        );
      }
      function n(e, r) {
        const n = t(this.namespace + (void 0 === r ? ':' : r) + e);
        return (n.log = this.log), n;
      }
      function o(e) {
        return e
          .toString()
          .substring(2, e.toString().length - 2)
          .replace(/\.\*\?$/, '*');
      }
      return (
        (t.debug = t),
        (t.default = t),
        (t.coerce = function (e) {
          if (e instanceof Error) return e.stack || e.message;
          return e;
        }),
        (t.disable = function () {
          const e = [
            ...t.names.map(o),
            ...t.skips.map(o).map((e) => '-' + e),
          ].join(',');
          return t.enable(''), e;
        }),
        (t.enable = function (e) {
          let r;
          t.save(e), (t.names = []), (t.skips = []);
          const n = ('string' == typeof e ? e : '').split(/[\s,]+/),
            o = n.length;
          for (r = 0; r < o; r++)
            n[r] &&
              ('-' === (e = n[r].replace(/\*/g, '.*?'))[0]
                ? t.skips.push(new RegExp('^' + e.substr(1) + '$'))
                : t.names.push(new RegExp('^' + e + '$')));
        }),
        (t.enabled = function (e) {
          if ('*' === e[e.length - 1]) return !0;
          let r, n;
          for (r = 0, n = t.skips.length; r < n; r++)
            if (t.skips[r].test(e)) return !1;
          for (r = 0, n = t.names.length; r < n; r++)
            if (t.names[r].test(e)) return !0;
          return !1;
        }),
        (t.humanize = r(9)),
        (t.destroy = function () {
          console.warn(
            'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.',
          );
        }),
        Object.keys(e).forEach((r) => {
          t[r] = e[r];
        }),
        (t.names = []),
        (t.skips = []),
        (t.formatters = {}),
        (t.selectColor = function (e) {
          let r = 0;
          for (let t = 0; t < e.length; t++)
            (r = (r << 5) - r + e.charCodeAt(t)), (r |= 0);
          return t.colors[Math.abs(r) % t.colors.length];
        }),
        t.enable(t.load()),
        t
      );
    };
  },
  function (e, t) {
    e.exports = require('tty');
  },
  function (e, t, r) {
    'use strict';
    Object.defineProperty(t, '__esModule', { value: !0 });
    var n = r(0);
    r(4) && n.app.quit();
    var o = function () {
      var e = new n.BrowserWindow({ height: 600, width: 800 });
      e.loadURL(
        'file://' +
          require('path').resolve(
            __dirname,
            '..',
            'renderer',
            'main_window',
            'index.html',
          ),
      ),
        e.webContents.openDevTools();
    };
    n.app.on('ready', o),
      n.app.on('window-all-closed', function () {
        'darwin' !== process.platform && n.app.quit();
      }),
      n.app.on('activate', function () {
        0 === n.BrowserWindow.getAllWindows().length && o();
      });
  },
  function (e, t, r) {
    var n = r(5),
      o = r(6).spawn,
      s = r(7)('electron-squirrel-startup'),
      i = r(0).app,
      c = function (e, t) {
        var r = n.resolve(n.dirname(process.execPath), '..', 'Update.exe');
        s('Spawning `%s` with args `%s`', r, e),
          o(r, e, { detached: !0 }).on('close', t);
      };
    e.exports = (function () {
      if ('win32' === process.platform) {
        var e = process.argv[1];
        s('processing squirrel command `%s`', e);
        var t = n.basename(process.execPath);
        if ('--squirrel-install' === e || '--squirrel-updated' === e)
          return c(['--createShortcut=' + t], i.quit), !0;
        if ('--squirrel-uninstall' === e)
          return c(['--removeShortcut=' + t], i.quit), !0;
        if ('--squirrel-obsolete' === e) return i.quit(), !0;
      }
      return !1;
    })();
  },
  function (e, t) {
    e.exports = require('path');
  },
  function (e, t) {
    e.exports = require('child_process');
  },
  function (e, t, r) {
    'undefined' == typeof process ||
    'renderer' === process.type ||
    !0 === process.browser ||
    process.__nwjs
      ? (e.exports = r(8))
      : (e.exports = r(10));
  },
  function (e, t, r) {
    (t.formatArgs = function (t) {
      if (
        ((t[0] =
          (this.useColors ? '%c' : '') +
          this.namespace +
          (this.useColors ? ' %c' : ' ') +
          t[0] +
          (this.useColors ? '%c ' : ' ') +
          '+' +
          e.exports.humanize(this.diff)),
        !this.useColors)
      )
        return;
      const r = 'color: ' + this.color;
      t.splice(1, 0, r, 'color: inherit');
      let n = 0,
        o = 0;
      t[0].replace(/%[a-zA-Z%]/g, (e) => {
        '%%' !== e && (n++, '%c' === e && (o = n));
      }),
        t.splice(o, 0, r);
    }),
      (t.save = function (e) {
        try {
          e ? t.storage.setItem('debug', e) : t.storage.removeItem('debug');
        } catch (e) {}
      }),
      (t.load = function () {
        let e;
        try {
          e = t.storage.getItem('debug');
        } catch (e) {}
        !e &&
          'undefined' != typeof process &&
          'env' in process &&
          (e = process.env.DEBUG);
        return e;
      }),
      (t.useColors = function () {
        if (
          'undefined' != typeof window &&
          window.process &&
          ('renderer' === window.process.type || window.process.__nwjs)
        )
          return !0;
        if (
          'undefined' != typeof navigator &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
        )
          return !1;
        return (
          ('undefined' != typeof document &&
            document.documentElement &&
            document.documentElement.style &&
            document.documentElement.style.WebkitAppearance) ||
          ('undefined' != typeof window &&
            window.console &&
            (window.console.firebug ||
              (window.console.exception && window.console.table))) ||
          ('undefined' != typeof navigator &&
            navigator.userAgent &&
            navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
            parseInt(RegExp.$1, 10) >= 31) ||
          ('undefined' != typeof navigator &&
            navigator.userAgent &&
            navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
        );
      }),
      (t.storage = (function () {
        try {
          return localStorage;
        } catch (e) {}
      })()),
      (t.destroy = (() => {
        let e = !1;
        return () => {
          e ||
            ((e = !0),
            console.warn(
              'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.',
            ));
        };
      })()),
      (t.colors = [
        '#0000CC',
        '#0000FF',
        '#0033CC',
        '#0033FF',
        '#0066CC',
        '#0066FF',
        '#0099CC',
        '#0099FF',
        '#00CC00',
        '#00CC33',
        '#00CC66',
        '#00CC99',
        '#00CCCC',
        '#00CCFF',
        '#3300CC',
        '#3300FF',
        '#3333CC',
        '#3333FF',
        '#3366CC',
        '#3366FF',
        '#3399CC',
        '#3399FF',
        '#33CC00',
        '#33CC33',
        '#33CC66',
        '#33CC99',
        '#33CCCC',
        '#33CCFF',
        '#6600CC',
        '#6600FF',
        '#6633CC',
        '#6633FF',
        '#66CC00',
        '#66CC33',
        '#9900CC',
        '#9900FF',
        '#9933CC',
        '#9933FF',
        '#99CC00',
        '#99CC33',
        '#CC0000',
        '#CC0033',
        '#CC0066',
        '#CC0099',
        '#CC00CC',
        '#CC00FF',
        '#CC3300',
        '#CC3333',
        '#CC3366',
        '#CC3399',
        '#CC33CC',
        '#CC33FF',
        '#CC6600',
        '#CC6633',
        '#CC9900',
        '#CC9933',
        '#CCCC00',
        '#CCCC33',
        '#FF0000',
        '#FF0033',
        '#FF0066',
        '#FF0099',
        '#FF00CC',
        '#FF00FF',
        '#FF3300',
        '#FF3333',
        '#FF3366',
        '#FF3399',
        '#FF33CC',
        '#FF33FF',
        '#FF6600',
        '#FF6633',
        '#FF9900',
        '#FF9933',
        '#FFCC00',
        '#FFCC33',
      ]),
      (t.log = console.debug || console.log || (() => {})),
      (e.exports = r(1)(t));
    const { formatters: n } = e.exports;
    n.j = function (e) {
      try {
        return JSON.stringify(e);
      } catch (e) {
        return '[UnexpectedJSONParseError]: ' + e.message;
      }
    };
  },
  function (e, t) {
    var r = 1e3,
      n = 6e4,
      o = 60 * n,
      s = 24 * o;
    function i(e, t, r, n) {
      var o = t >= 1.5 * r;
      return Math.round(e / r) + ' ' + n + (o ? 's' : '');
    }
    e.exports = function (e, t) {
      t = t || {};
      var c = typeof e;
      if ('string' === c && e.length > 0)
        return (function (e) {
          if ((e = String(e)).length > 100) return;
          var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
            e,
          );
          if (!t) return;
          var i = parseFloat(t[1]);
          switch ((t[2] || 'ms').toLowerCase()) {
            case 'years':
            case 'year':
            case 'yrs':
            case 'yr':
            case 'y':
              return 315576e5 * i;
            case 'weeks':
            case 'week':
            case 'w':
              return 6048e5 * i;
            case 'days':
            case 'day':
            case 'd':
              return i * s;
            case 'hours':
            case 'hour':
            case 'hrs':
            case 'hr':
            case 'h':
              return i * o;
            case 'minutes':
            case 'minute':
            case 'mins':
            case 'min':
            case 'm':
              return i * n;
            case 'seconds':
            case 'second':
            case 'secs':
            case 'sec':
            case 's':
              return i * r;
            case 'milliseconds':
            case 'millisecond':
            case 'msecs':
            case 'msec':
            case 'ms':
              return i;
            default:
              return;
          }
        })(e);
      if ('number' === c && isFinite(e))
        return t.long
          ? (function (e) {
              var t = Math.abs(e);
              if (t >= s) return i(e, t, s, 'day');
              if (t >= o) return i(e, t, o, 'hour');
              if (t >= n) return i(e, t, n, 'minute');
              if (t >= r) return i(e, t, r, 'second');
              return e + ' ms';
            })(e)
          : (function (e) {
              var t = Math.abs(e);
              if (t >= s) return Math.round(e / s) + 'd';
              if (t >= o) return Math.round(e / o) + 'h';
              if (t >= n) return Math.round(e / n) + 'm';
              if (t >= r) return Math.round(e / r) + 's';
              return e + 'ms';
            })(e);
      throw new Error(
        'val is not a non-empty string or a valid number. val=' +
          JSON.stringify(e),
      );
    };
  },
  function (e, t, r) {
    const n = r(2),
      o = r(11);
    (t.init = function (e) {
      e.inspectOpts = {};
      const r = Object.keys(t.inspectOpts);
      for (let n = 0; n < r.length; n++)
        e.inspectOpts[r[n]] = t.inspectOpts[r[n]];
    }),
      (t.log = function (...e) {
        return process.stderr.write(o.format(...e) + '\n');
      }),
      (t.formatArgs = function (r) {
        const { namespace: n, useColors: o } = this;
        if (o) {
          const t = this.color,
            o = '[3' + (t < 8 ? t : '8;5;' + t),
            s = `  ${o};1m${n} [0m`;
          (r[0] = s + r[0].split('\n').join('\n' + s)),
            r.push(o + 'm+' + e.exports.humanize(this.diff) + '[0m');
        } else
          r[0] =
            (function () {
              if (t.inspectOpts.hideDate) return '';
              return new Date().toISOString() + ' ';
            })() +
            n +
            ' ' +
            r[0];
      }),
      (t.save = function (e) {
        e ? (process.env.DEBUG = e) : delete process.env.DEBUG;
      }),
      (t.load = function () {
        return process.env.DEBUG;
      }),
      (t.useColors = function () {
        return 'colors' in t.inspectOpts
          ? Boolean(t.inspectOpts.colors)
          : n.isatty(process.stderr.fd);
      }),
      (t.destroy = o.deprecate(() => {},
      'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.')),
      (t.colors = [6, 2, 3, 4, 5, 1]);
    try {
      const e = r(12);
      e &&
        (e.stderr || e).level >= 2 &&
        (t.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221,
        ]);
    } catch (e) {}
    (t.inspectOpts = Object.keys(process.env)
      .filter((e) => /^debug_/i.test(e))
      .reduce((e, t) => {
        const r = t
          .substring(6)
          .toLowerCase()
          .replace(/_([a-z])/g, (e, t) => t.toUpperCase());
        let n = process.env[t];
        return (
          (n =
            !!/^(yes|on|true|enabled)$/i.test(n) ||
            (!/^(no|off|false|disabled)$/i.test(n) &&
              ('null' === n ? null : Number(n)))),
          (e[r] = n),
          e
        );
      }, {})),
      (e.exports = r(1)(t));
    const { formatters: s } = e.exports;
    (s.o = function (e) {
      return (
        (this.inspectOpts.colors = this.useColors),
        o
          .inspect(e, this.inspectOpts)
          .split('\n')
          .map((e) => e.trim())
          .join(' ')
      );
    }),
      (s.O = function (e) {
        return (
          (this.inspectOpts.colors = this.useColors),
          o.inspect(e, this.inspectOpts)
        );
      });
  },
  function (e, t) {
    e.exports = require('util');
  },
  function (e, t, r) {
    'use strict';
    const n = r(13),
      o = r(2),
      s = r(14),
      { env: i } = process;
    let c;
    function u(e) {
      return (
        0 !== e && { level: e, hasBasic: !0, has256: e >= 2, has16m: e >= 3 }
      );
    }
    function a(e, t) {
      if (0 === c) return 0;
      if (s('color=16m') || s('color=full') || s('color=truecolor')) return 3;
      if (s('color=256')) return 2;
      if (e && !t && void 0 === c) return 0;
      const r = c || 0;
      if ('dumb' === i.TERM) return r;
      if ('win32' === process.platform) {
        const e = n.release().split('.');
        return Number(e[0]) >= 10 && Number(e[2]) >= 10586
          ? Number(e[2]) >= 14931
            ? 3
            : 2
          : 1;
      }
      if ('CI' in i)
        return [
          'TRAVIS',
          'CIRCLECI',
          'APPVEYOR',
          'GITLAB_CI',
          'GITHUB_ACTIONS',
          'BUILDKITE',
        ].some((e) => e in i) || 'codeship' === i.CI_NAME
          ? 1
          : r;
      if ('TEAMCITY_VERSION' in i)
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(i.TEAMCITY_VERSION) ? 1 : 0;
      if ('truecolor' === i.COLORTERM) return 3;
      if ('TERM_PROGRAM' in i) {
        const e = parseInt((i.TERM_PROGRAM_VERSION || '').split('.')[0], 10);
        switch (i.TERM_PROGRAM) {
          case 'iTerm.app':
            return e >= 3 ? 3 : 2;
          case 'Apple_Terminal':
            return 2;
        }
      }
      return /-256(color)?$/i.test(i.TERM)
        ? 2
        : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
            i.TERM,
          ) || 'COLORTERM' in i
        ? 1
        : r;
    }
    s('no-color') || s('no-colors') || s('color=false') || s('color=never')
      ? (c = 0)
      : (s('color') || s('colors') || s('color=true') || s('color=always')) &&
        (c = 1),
      'FORCE_COLOR' in i &&
        (c =
          'true' === i.FORCE_COLOR
            ? 1
            : 'false' === i.FORCE_COLOR
            ? 0
            : 0 === i.FORCE_COLOR.length
            ? 1
            : Math.min(parseInt(i.FORCE_COLOR, 10), 3)),
      (e.exports = {
        supportsColor: function (e) {
          return u(a(e, e && e.isTTY));
        },
        stdout: u(a(!0, o.isatty(1))),
        stderr: u(a(!0, o.isatty(2))),
      });
  },
  function (e, t) {
    e.exports = require('os');
  },
  function (e, t, r) {
    'use strict';
    e.exports = (e, t = process.argv) => {
      const r = e.startsWith('-') ? '' : 1 === e.length ? '-' : '--',
        n = t.indexOf(r + e),
        o = t.indexOf('--');
      return -1 !== n && (-1 === o || n < o);
    };
  },
]);
//# sourceMappingURL=index.js.map
