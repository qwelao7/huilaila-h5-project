(function (config) {
  (function (a, b) {
    function c(a) {
      var c = b.createElement("script");
      c.charset = "utf-8";
      c.src = a;
      (a = h || k) && a.appendChild(c)
    }

    function d() {
      var a = ["v=" + config[4], "key=" + config[0], "cache=0"];
      config[7] && a.push("plugin=" + config[7]);
      config[5] && a.push("callback=" + config[5]);
      for (var d = config[2] + "/maps?" + a.join("&"), a = config[2].split(",")[0], e = b.getElementsByTagName("script"), g, h = 0; h < e.length; h += 1) if (0 === e[h].src.indexOf(a.split(":")[1] + "/maps?")) {
        g = e[h];
        break
      }
      config[5] || g && g.async ? c(d) : (b.write('<script crossorigin="anonymous" id="amap_main_js" src="' +
        d + '" type="text/javascript">\x3c/script>'), setTimeout(function () {
        b.getElementById("amap_main_js") || c(d)
      }, 1))
    }

    function e() {
      for (var a in localStorage) localStorage.hasOwnProperty(a) && 0 === a.indexOf("_AMap_") && localStorage.removeItem(a)
    }

    var g = function () {
      var a = !1;
      try {
        var b = (new Date).getTime();
        localStorage.setItem("_test", b);
        localStorage.getItem("_test") == b && (a = !0)
      } catch (c) {
      }
      return a
    }(), h = b.head || b.getElementsByTagName("head")[0], k = b.body || b.getElementsByTagName("body")[0];
    if (g) try {
      var l = JSON.parse(localStorage.getItem("_AMap_raster"));
      if ("1519626657266" === l.version) config.Jw = !0, eval(l.script); else throw e(), Error("localStorage's version is " + l.version + ", but the latest version is 1519626657266");
    } catch (m) {
      d()
    } else d()
  })(window, document);
})(["78e2bfb982b0712db9793642e51454ce", [118.344933, 29.188757, 120.721945, 30.566516, 120.153576, 30.287459], "//webapi.amap.com", 1, "1.4.4", null, "330100", "", true, true, true, true, "1517923257-1"])
