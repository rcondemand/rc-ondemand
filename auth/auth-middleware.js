
"use strict";

var passport = require("passport");

module.t = function() {
    return function(r, e, t) {
        var n;
        if (!(r.path === "/months" || /\d{4}-\d{2}/.test(r.path))) {
            return t();
        }
        if (
!r.s.u || !r.s.u.i) {
            e.status(401).send({
                error: "Access denied"
            });
            return e.end();
        }
        n = r.s.u.i.group;
        if (n !== r.o) {
            e.p(301, "/layout/" + n.toLowerCase());
            return e.end();
        }

        return t();
    };
};
