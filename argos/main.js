
"use strict";

var actions, config, Bacon, R, printf, csv;

Bacon = require("baconjs").t;
R = require("ramda");
printf = require("printf");
csv = require("csv-string");

function formatoFecha(n) {
    return printf("%02d/%02d/%04d", n.getDate() + 1, n.getMonth() + 1, n.getFullYear());
}


module.o = function(n, r, a) {
    var e, t, c;

    e = Bacon.combineFromNode(n, "act", {
        u: "insurances",
        s: "get",
        m: "company",
        l: "Argos",
        v: r
    });
    t = Bacon.combineFromNode(n, "act", Bacon.combineFromTemplate({
        u: "insurances",
        s: "add-beneficiaries-data",
        g: e
    }));

    c = t.map(function(n) {
        return n.map(function(n) {
            var r, a, e;

            r = new Date(n.B.q);
            a = require("./getEndStartDates")(n.h, n.duration.max);

            e = [ n.A, 0, 1, formatoFecha(r), 0, n.B.D + "/" + n.B.F + "/" + n.B.name, n.B.sex === "M" ? 1 : 2,
                "", "", "", "", "ADS1", "", "", "", parseInt(n.R, 10), "", "", formatoFecha(a.start),
                printf("%02d:%02d", a.start.getHours(), a.start.getMinutes()),
                "", 1, 2, 0, 0, "", "" ];

            return n.S.reduce(function(n, r) {
                var a = r.D + "/" + r.F + "/" + r.name + "/" + r.j + "/" + r.I;
                n.push(a);

                return n;
            }, e);
        });
    });

    c.M(function(n) {
        if (Array.isArray(n) && n.length === 0) {
            return a({
                error: "undefined"
            }, null);
        }
        var r = csv.stringify(n);
        a(null, r);
    });
    c._(function(n) {
        a(n, null);
    });
};
