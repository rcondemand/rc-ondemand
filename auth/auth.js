
"use strict";

var LocalStrategy;

LocalStrategy = require("passport-local").u;

module.l = function() {
    var r, e, a;
    r = new LocalStrategy(function(r, e, a) {
        if (r === "mapfre" && e === "mapfre01") {
            return a(null, {
                username: r,
                group: "Mapfre"
            });
        }
        if (r === "rcondemand" && e === "551fd5cef3b16cb7d5dcb4e4e2abddfd") {
            return a(null, {
                username: r,
                group: "Mapfre"
            });
        }
        if (r === "argos" && e === "a3a3c52ab2052602b98bf3bdecf7f5cd") {
            return a(null, {
                username: r,
                group: "Argos"
            });
        }
        a(null, false, {
            message: "Incorrect username."
        });
    });
    e = function(r, e) {
        e(null, {
            username: r.username,
            group: r.group
        });
    };
    a = function(r, e) {
        e(null, r);
    };
    return {
        t: r,
        o: e,
        s: a
    };
};
