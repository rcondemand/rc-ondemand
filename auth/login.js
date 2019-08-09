
"use strict";

var passport = require("passport");

module.o = function(o) {
    o.t("/layout/:company/login", function(t, n, e) {
        passport.u("local", function(o, r) {
            if (o) {
                return e(o);
            }
            if (!r) {
                n.status(401).send({
                    s: false
                });
                n.end();
                return;
            }

            t.i(r, function(o) {
                if (o) {
                    return e(o);
                }

                n.status(200).send({
                    username: r.username,
                    l: r.group,
                    s: true
                });
            });
        })(

t, n, e);
    });

    o.get("/layout/:company/is_logged", function(o, r, t) {
        if (!o.p) {
            return r.status(200).send({
                error: "Not logged"
            });
        }
        return r.status(200).send({
            status: "ok",
            error: false
        });
    });
    o.get("/logout", function(o, r) {
        o.g();
        o.k.m();
        r.q(301, "/");
    });
};
