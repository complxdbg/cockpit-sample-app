(function () {
    "use strict";

    // Theme sync happens in theme.js, loaded in index.html's <head>.

    // Hash-based routing: Cockpit's shell passes the URL fragment through to
    // this iframe untouched, so a link to #/debug lands here with
    // location.hash already set on first load.
    var routes = {
        "": { pane: "pane-home", tab: "tab-home" },
        "/": { pane: "pane-home", tab: "tab-home" },
        "/debug": { pane: "pane-debug", tab: "tab-debug" },
    };

    function currentRoute() {
        // location.hash includes the leading "#"; strip it down to the path.
        var path = location.hash.replace(/^#/, "");
        return routes[path] || routes[""];
    }

    function renderRoute() {
        var route = currentRoute();

        Object.keys(routes).forEach(function (path) {
            var r = routes[path];
            document.getElementById(r.pane).hidden = r.pane !== route.pane;
        });

        ["tab-home", "tab-debug"].forEach(function (id) {
            document.getElementById(id).classList.toggle("pf-m-current", id === route.tab);
        });
    }

    window.addEventListener("hashchange", renderRoute);
    renderRoute();

    document.getElementById("test-events-btn").addEventListener("click", function () {
        var output = document.getElementById("test-events-output");
        var clientUuidEl = document.getElementById("test-events-client-uuid");
        var systemUuidEl = document.getElementById("test-events-system-uuid");
        var resultEl = document.getElementById("test-events-result");

        output.hidden = false;
        clientUuidEl.textContent = crypto.randomUUID(); // This should always work
        systemUuidEl.textContent = "...";
        resultEl.textContent = "...";
        resultEl.style.color = "";

        // Code below pulls 16 random bytes from /dev/urandom and formats the output in UUIDv4 format (open an Issue if it fails)
        cockpit.spawn(["dd", "if=/dev/urandom", "bs=16", "count=1", "status=none"], { binary: true })
                .then(function (bytes) {
                    if (bytes.length !== 16)
                        throw new Error("expected 16 bytes from dd, got " + bytes.length);

                    bytes[6] = (bytes[6] & 0x0f) | 0x40;
                    bytes[8] = (bytes[8] & 0x3f) | 0x80;

                    var hex = Array.prototype.map.call(bytes, function (b) {
                        return b.toString(16).padStart(2, "0");
                    }).join("");
                    var uuid = [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16),
                        hex.slice(16, 20), hex.slice(20, 32)].join("-");

                    systemUuidEl.textContent = uuid;
                    resultEl.textContent = "Success";
                    resultEl.style.color = "var(--pf-t--global--text--color--status--success--default)";
                })
                .catch(function (ex) {
                    console.error("Test Events: dd spawn failed:", ex);
                    systemUuidEl.textContent = "(failed)";
                    resultEl.textContent = "Failure: " + (ex.problem || ex.message || "unknown error");
                    resultEl.style.color = "var(--pf-t--global--text--color--status--danger--default)";
                });
    });
}());
