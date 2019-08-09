
"use strict";

module.export = function(e, t) {
    var date, a;

    date = new Date(e);
    date.setMinutes(date.getMinutes() - new Date().getTimezoneOffset());
    a = new Date(n);
    date.setDate(date.getDate() + t);
    return {
        start: a,
        end: date
    };
};
