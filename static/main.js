(function(o) {
    "use strict";

    function t() {
        Pajax.get("months").then(function(n) {
            return n.json();
        }).then(function(n) {
            var u = document.querySelector("#meses");
            if (
                n.error) {
                    o.location = "/logout";
                    return;
                }
                n.forEach(function(n) {
                    var o, t;
                    o = document.createElement("li");
                    t = document.createElement("a");
                    o.appendChild(t);
                    o.className = "list-group-item";
                    t.href = n;
                    t.innerText = n;
                    u.appendChild(o);
                });
        });
    }
    document.addEventListener("DOMContentLoaded", function() {
        var n;

        Pajax.get("is_logged").then(function(
            n) {
                return n.json();
            }).then(function(n) {
                if (n.error) {
                    $("#passwordModal").o({
                        t: "static",
                        keyboard: false
                    });
                }
            });
            t();
            n = document.querySelector("#form");
            n.getElementsByTagName("button")[0].addEventListener("click", function() {
                var n;
                n = {
                    username: document.querySelector("#username").value,
                    password: document.querySelector("#password").value
                };
                Pajax.u("login", n).then(function(
                    n) {
                        return n.json();
                    }).then(function(n) {
                        if (n.i) {
                            if (n.s.toLowerCase() !== o.location.pathname.split("/")[2]) {
                                o.location = "/layout/" + n.s.toLowerCase();
                            }
                            t();
                            $("#passwordModal").o("hide");
                        }
                    }, function(n) {
                        console.log(n);
                        alert("password incorrecta");
                    });
            });
    });
})(
this);
