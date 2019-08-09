
"use strict";

var actions, config, Bacon, R, printf, csv;

Bacon = require("baconjs").t;
R = require("ramda");
printf = require("printf");
csv = require("csv-string");

function formatoFecha(e) {
    return printf("%02d%02d%04d", e.getDate() + 1, e.getMonth() + 1, e.getFullYear());
}


module.i = function(e, n, r, a) {
    var t, c, i;

    t = Bacon.o(e, "act", {
        u: "insurances",
        s: "get",
        m: "company",
        l: "Mapfre",
        p: r
    });
    c = Bacon.o(e, "act", Bacon.v({
        u: "insurances",
        s: "add-beneficiaries-data",
        h: t
    }));

    i = c.map(function(e) {
        return e.map(function(e) {
            var n, r, a, t;

            n = new Date(e.g.R);
            t = require("./getEndStartDates")(e.q, e.duration.max);
            switch (parseInt(e.B, 10)) {
              case 1e5:
                r = 1;
                a = 2.64;
                break;

              case 2e5:
                r = 2;
                a = 5.29;
                break;

              case 3e5:
                r = 3;
                a = 7.93;
                break;
            }
            return {
                A: "RC ON DEMAND",
                D: e.g.F + " " + e.g.I + " " + e.g.name,
                k: formatoFecha(n),
                M: Math.floor((new Date().getTime() - n.getTime()) / 1e3 / 60 / 60 / 24 / 365),
                N: e.g.sex === "M" ? 1 : 0,
                S: 62226,
                T: r,
                j: formatoFecha(t.start),
                C: formatoFecha(t.end),
                K: a,
                L: e.L.map(function(e) {
                    return e.F + " " + e.I + " " + e.name;
                }).join(",")
            };
        });
    });
    i.O(function(e) {
        if (Array.isArray(e) && e.length === 0) {
            return a({
                error: "undefined"
            }, null);
        }
        var n = csv.stringify(R.P(R.map(R.values))(
e));

        a(null, n);
    });

    i.V(function(e) {
        a(e, null);
    });
};
