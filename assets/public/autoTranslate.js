(function () {
    var DEBUG = false;

    var API = "https://api.mymemory.translated.net/get";
    var CACHE_PREFIX = "autodom:v3:";
    var ATTRS = ["placeholder", "title", "aria-label", "aria-placeholder"];
    var SKIP_TAGS = new Set(["SCRIPT","STYLE","NOSCRIPT","PRE","CODE","TEXTAREA","INPUT","SELECT","OPTION","SVG","LINK","META","IFRAME","CANVAS","TEMPLATE"]);
    var MAX_LEN = 160;
    var MAX_LINES = 2;
    var processed = new WeakMap();// mark processed text nodes to avoid repeats

    function log(){ if(DEBUG) try{ console.log.apply(console,arguments); }catch{} }

    function getLang() {
        try { return localStorage.getItem("lang") === "ar" ? "ar" : "en"; } catch { return "en"; }
    }
    function setDirLang(lng) {
        var isAR = lng === "ar";
        document.dir = isAR ? "rtl" : "ltr";
        document.documentElement.setAttribute("lang", isAR ? "ar" : "en");
    }
    function cacheKey(text, target, source) {
        return CACHE_PREFIX + (source || "en") + ":" + target + ":" + text;
    }
    function getCached(text, target, source) {
        try {
            var v = localStorage.getItem(cacheKey(text, target, source));
            return v ? JSON.parse(v) : null;
        } catch { return null; }
    }
    function setCached(text, target, source, val) {
        try { localStorage.setItem(cacheKey(text, target, source), JSON.stringify(val)); } catch {}
    }
    function sleep(ms){ return new Promise(function(r){ setTimeout(r,ms); }); }

    // Decide if a text is UI copy we want to translate
    function isTranslatableText(s) {
        if (!s) return false;
        var t = s.trim();
        if (!t) return false;
        if (t.length <= 1) return false;
        if (t.length > MAX_LEN) return false;
        if ((t.match(/\n/g)||[]).length > MAX_LINES) return false;

        // Heuristics: must contain letters (avoid pure symbols/numbers/CSS)
        if (!/[A-Za-z\u00C0-\u024F]/.test(t)) return false;

        // Looks like CSS/JS or code-y
        if (/[{};=<>]|https?:\/\//.test(t)) return false;
        if (/copyright|released on|license|swiper/i.test(t)) return false;

        // Too many symbols relative to letters
        var letters = (t.match(/[A-Za-z]/g)||[]).length;
        var nonLetters = t.length - letters;
        if (letters === 0 || nonLetters > letters * 2) return false;

        return true;
    }

    async function translateText(text, target, source) {
        if (!text || target === source) return text;
        var cached = getCached(text, target, source);
        if (cached) return cached;

        var url = API + "?q=" + encodeURIComponent(text) +
            "&langpair=" + encodeURIComponent(source) + "|" + encodeURIComponent(target) +
            "&de=" + encodeURIComponent("anonymous@edudu.local");

        try {
            await sleep(80);
            var res = await fetch(url, { mode: "cors" });
            if (!res.ok) throw new Error("HTTP " + res.status);
            var json = await res.json();
            var out = (json && json.responseData && json.responseData.translatedText) ||
                (json && json.matches && json.matches[0] && json.matches[0].translation) ||
                text;
            setCached(text, target, source, out);
            return out;
        } catch (e) {
            log("translate fail:", e);
            return text;
        }
    }

    function isGoodTextNode(node) {
        if (!node || node.nodeType !== 3 || !node.nodeValue) return false;
        var p = node.parentElement;
        if (!p) return false;
        if (SKIP_TAGS.has(p.tagName)) return false;
        if (p.closest("[data-no-autot]")) return false;
        if (processed.get(node)) return false;

        return isTranslatableText(node.nodeValue);
    }

    var queue = [];
    var working = false;

    async function worker() {
        if (working) return;
        working = true;
        var target = getLang();
        var source = "en";
        while (queue.length) {
            var job = queue.shift();
            if (!job) break;

            if (job.type === "text") {
                var node = job.node;
                if (!node || !node.isConnected) continue;
                if (!isGoodTextNode(node)) continue;
                var raw = node.nodeValue;
                var out = await translateText(raw, target, source);
                if (node.isConnected && node.nodeValue === raw) {
                    node.nodeValue = out;
                    processed.set(node, true);
                }
            } else if (job.type === "attr") {
                var el = job.el, attr = job.attr, rawAttr = job.raw;
                if (!el || !el.isConnected) continue;
                if (el.closest("[data-no-autot]")) continue;
                if (SKIP_TAGS.has(el.tagName)) continue;
                if (!isTranslatableText(rawAttr)) continue;

                var outAttr = await translateText(rawAttr, target, source);
                if (el.isConnected && el.getAttribute(attr) === rawAttr) {
                    el.setAttribute(attr, outAttr);
                }
            }
        }
        working = false;
    }
    function schedule(){ if (!working) setTimeout(worker, 0); }

    function scanNode(root) {
        if (!root || root.nodeType !== 1) return;
        if (root.closest && root.closest("[data-no-autot]")) return;
        if (SKIP_TAGS.has(root.tagName)) return;

        // text nodes
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) { return isGoodTextNode(n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }
        });
        var n; while ((n = walker.nextNode())) queue.push({ type:"text", node:n });

        // attributes
        for (var i=0;i<ATTRS.length;i++){
            var a = ATTRS[i];
            if (root.hasAttribute && root.hasAttribute(a)) {
                var raw = root.getAttribute(a);
                if (isTranslatableText(raw)) queue.push({ type:"attr", el:root, attr:a, raw:raw });
            }
        }
    }

    function fullScan() {
        var lng = getLang();
        setDirLang(lng);
        if (lng === "en") return;
        scanNode(document.body);
        schedule();
    }

    var obs = new MutationObserver(function (mut) {
        if (getLang() === "en") return;
        for (var i=0;i<mut.length;i++){
            var m = mut[i];
            if (m.type === "childList") {
                m.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) scanNode(node);
                    else if (node.nodeType === 3 && isGoodTextNode(node)) queue.push({
                        type:"text", node:node });
                });
            } else if (m.type === "attributes" && ATTRS.indexOf(m.attributeName) >= 0) {
                var el = m.target;
                var raw = el.getAttribute(m.attributeName);
                if (isTranslatableText(raw)) queue.push({ type:"attr", el:el, attr:m.attributeName, raw:raw });
            }
        }
        schedule();
    });

    function boot() {
        var lng = getLang();
        setDirLang(lng);

        fullScan();
        setTimeout(fullScan, 300);
        setTimeout(fullScan, 1000);
        setTimeout(fullScan, 2000);

        obs.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ATTRS
        });

        window.addEventListener("storage", function (e) {
            if (e.key === "lang") location.reload();
        });

         var __lastLang = lng;
        setInterval(function () {
            var now = getLang();
            if (now !== __lastLang) {
                __lastLang = now;
                setDirLang(now);
                if (now === "en") {
                     location.reload();
                } else {
                     fullScan();
                }
            }
        }, 250);

        window.__autoTranslatePing = function () {
            console.log("[autoTranslate] lang=", getLang(), "queue=", queue.length);
            return true;
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
