
"use strict";

var express = require("express"),
 seneca = require("seneca")(),
 session = require("express-session"),
 auth = require("./auth/auth-middleware"),
 bodyParser = require("body-parser"),


 passport = require("passport"),
 loginStrategies = require("./auth")(),

 mapfre = require("./mapfre"),
 argos = require("./argos"),
 app = express();

seneca.t({
    port: "43701",
    type: "tcp"
});

app.use(session({
  resave : false,
  saveUninitialized : false
}));

app.use(bodyParser.json());

passport.use(loginStrategies.localStrategy);
passport.serializeUser(loginStrategies.serializeUser);
passport.deserializeUser(loginStrategies.deserializeUser);
app.use(passport.initialize());
app.use(passport.session());

require('./auth/login')(app);

app.s("/layout/:company", function(e, r, a) {
    switch (e.q.h) {
      case "mapfre":
        e.h = "Mapfre";
        break;

      case "argos":
        e.h = "Argos";
        break;
    }
    a();
});

app.use("/layout/:company/", auth());

app.get("/layout/:company/months", function(e, a) {
    seneca.v({
        _: "insurances",
        C: "months",
        h: e.h
    }, function(e, r) {
        if (e) {
            return a.status(500).send(e);
        }
        a.T("Access-Control-Allow-Origin", "*");
        a.status(200).send(r);
    });
});

app.get("/layout/argos/:argosmonth/", function(t, s, e) {
    if (!/^\d{4}-\d{2}_\d{4}-\d{2}$/.test(t.q.S)) {
        return e();
    }

    argos(seneca, t.q.S, function(e, r) {
        var a;
        if (
e) {
            if (e.error === "undefined") {
                return s.status(404).send({
                    error: "The period of " + t.q.S + " does not contain data"
                });
            }
            return s.status(500).send(e);
        }
        a = "argos-" + t.q.S;
        s.setHeader('Content-Type', 'text/csv; charset=utf-8');
        s.setHeader('Content-Disposition', 'attachment; filename="' + a + '.csv"');
        s.status(200).send("\ufeff" + r);
    });
});

app.get("/layout/mapfre/:month/", function(t, s, e) {
    if (!/^\d{4}-\d{2}$/.test(t.q.A)) {
        return e();
    }

    mapfre(seneca, "Mapfre", t.q.A, function(e, r) {
        var a;
        if (e) {
            if (e.error === "undefined") {
                return s.status(404).send({
                    error: "That month does not contain data"
                });
            }
            return s.status(500).send(e);
        }
        a = "622262" + t.q.A.substr(2, 2) + t.q.A.substr(5, 2) + "M101";
        s.setHeader('Content-Type', 'text/csv; charset=utf-8');
        s.setHeader('Content-Disposition', 'attachment; filename="' + a + '.csv"');
        s.status(200).send("\ufeff" + r);
    });
});

app.use('/layout/:company', express.static(__dirname + '/static', { dotfiles : 'deny' }));
app.use('/layout/:company/bower_components', express.static(__dirname + '/bower_components', { dotfiles : 'deny' }));

app.listen(3e3);
