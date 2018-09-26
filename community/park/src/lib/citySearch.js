(function (config) {
  var ba = navigator.userAgent.toLowerCase(), da = window, ea = document, ja = ea.documentElement;

  function e(a) {
    return -1 !== ba.indexOf(a)
  }

  var ka = /([a-z0-9]*\d+[a-z0-9]*)/;

  function la() {
    var a = ma;
    if (!a)return null;
    var a = a.toLowerCase(), b = null;
    if (b = a.match(/angle \((.*)\)/)) a = b[1], a = a.replace(/\s*direct3d.*$/, "");
    a = a.replace(/\s*\([^\)]*wddm[^\)]*\)/, "");
    if (0 <= a.indexOf("intel")) {
      b = ["Intel"];
      0 <= a.indexOf("mobile") && b.push("Mobile");
      (0 <= a.indexOf("gma") || 0 <= a.indexOf("graphics media accelerator")) && b.push("GMA");
      if (0 <= a.indexOf("haswell")) b.push("Haswell"); else if (0 <= a.indexOf("ivy")) b.push("HD 4000"); else if (0 <= a.indexOf("sandy")) b.push("HD 3000"); else if (0 <= a.indexOf("ironlake")) b.push("HD");
      else {
        0 <= a.indexOf("hd") && b.push("HD");
        var c = a.match(ka);
        c && b.push(c[1].toUpperCase())
      }
      return b = b.join(" ")
    }
    return 0 <= a.indexOf("nvidia") || 0 <= a.indexOf("quadro") || 0 <= a.indexOf("geforce") || 0 <= a.indexOf("nvs") ? (b = ["nVidia"], 0 <= a.indexOf("geforce") && b.push("geForce"), 0 <= a.indexOf("quadro") && b.push("Quadro"), 0 <= a.indexOf("nvs") && b.push("NVS"), a.match(/\bion\b/) && b.push("ION"), a.match(/gtx\b/) ? b.push("GTX") : a.match(/gts\b/) ? b.push("GTS") : a.match(/gt\b/) ? b.push("GT") : a.match(/gs\b/) ? b.push("GS") : a.match(/ge\b/) ?
      b.push("GE") : a.match(/fx\b/) && b.push("FX"), (c = a.match(ka)) && b.push(c[1].toUpperCase().replace("GS", "")), 0 <= a.indexOf("titan") ? b.push("TITAN") : 0 <= a.indexOf("ti") && b.push("Ti"), b = b.join(" ")) : 0 <= a.indexOf("amd") || 0 <= a.indexOf("ati") || 0 <= a.indexOf("radeon") || 0 <= a.indexOf("firegl") || 0 <= a.indexOf("firepro") ? (b = ["AMD"], 0 <= a.indexOf("mobil") && b.push("Mobility"), c = a.indexOf("radeon"), 0 <= c && b.push("Radeon"), 0 <= a.indexOf("firepro") ? b.push("FirePro") : 0 <= a.indexOf("firegl") && b.push("FireGL"), 0 <= a.indexOf("hd") &&
    b.push("HD"), 0 <= c && (a = a.substring(c)), (c = a.match(ka)) && b.push(c[1].toUpperCase().replace("HD", "")), b = b.join(" ")) : a.substring(0, 100)
  }

  var na = "microsoft basic render driver;vmware svga 3d;Intel 965GM;Intel B43;Intel G41;Intel G45;Intel G965;Intel GMA 3600;Intel Mobile 4;Intel Mobile 45;Intel Mobile 965".split(";"),
    pa = "ActiveXObject" in da,
    qa = "devicePixelRatio" in da && 1 < da.devicePixelRatio || pa && "matchMedia" in da && da.matchMedia("(min-resolution:144dpi)") && da.matchMedia("(min-resolution:144dpi)").matches,
    sa = e("windows nt"), ua = -1 !== ba.search(/windows nt [1-5]\./), va = -1 !== ba.search(/windows nt 5\.[12]/),
    wa = ua && !va;
  e("windows nt 10");
  var xa = e("windows phone"), ya = e("macintosh"), za = e("Mb2345Browser"), Aa = e("ipad;") || e("ipad "),
    Ba = Aa && qa, Ca = e("ipod touch;"), Da = e("iphone;") || e("iphone "), Fa = Da || Aa || Ca,
    Ga = Fa && -1 !== ba.search(/ os [456]_/);
  Fa && ba.search(/ os [4-8]_/);
  var Ha = Fa && -1 !== ba.search(/ os [78]_/);
  Fa && e("os 8_");
  var Ka = Fa && e("os 10_"), La = e("android"), Ma = -1 !== ba.search(/android [123]/), Na = e("android 4");
  La && -1 === ba.search(/android [1-4]/) || ba.search(/android 4.4/);
  var Oa = La ? "android" : Fa ? "ios" : sa ? "windows" : ya ? "mac" : "other", Pa = pa && !da.XMLHttpRequest,
    Qa = pa && !ea.querySelector, Ra = pa && !ea.addEventListener, Sa = pa && e("ie 9"), Ta = pa && e("msie 10"),
    Ua = pa && e("rv:11"), Wa = e("alipay") || La && Va, Xa = e("edge"), Ya = e("qtweb"), Va = e("ucbrowser"),
    Za = e("miuibrowser"), $a = e("micromessenger"), ab = e("mqqbrowser"), bb = e("baidubrowser"),
    chrome = (e("chrome") || e("crios")) && !$a && !bb && !ab && !Xa && !Za, cb = chrome && e("chromium"),
    db = chrome && !cb && 30 < parseInt(ba.split("chrome/")[1]), eb = e("firefox"), fb = eb &&
      27 < parseInt(ba.split("firefox/")[1]), gb = (ya || Fa) && e("safari") && e("version/"),
    hb = ya && gb && 7 < parseInt(ba.split("version/")[1]), ib = Fa && e("aliapp"),
    jb = Fa && (!ab && !Va && !$a && !chrome && !eb && !gb || ib), kb = La || Fa || xa || e("mobile"),
    lb = da.navigator && da.navigator.msPointerEnabled && !!da.navigator.msMaxTouchPoints,
    mb = da.navigator && da.navigator.pointerEnabled && !!da.navigator.maxTouchPoints, nb = mb || lb,
    ob = "ontouchstart" in ea || nb, pb = function () {
      if (!kb)return da.devicePixelRatio || 1;
      var a = document.getElementsByTagName("meta");
      if (window.parent && window.parent !== window)try {
        if (window.parent.location.origin == window.location.origin) a = window.parent.document.getElementsByTagName("meta"); else return 1
      } catch (b) {
        return 1
      }
      for (var c = a.length - 1; 0 <= c; c--)if ("viewport" === a[c].name) {
        var c = a[c].content, d;
        -1 !== c.indexOf("initial-scale") && (d = parseFloat(c.split("initial-scale=")[1]));
        a = -1 !== c.indexOf("minimum-scale") ? parseFloat(c.split("minimum-scale=")[1]) : 0;
        c = -1 !== c.indexOf("maximum-scale") ? parseFloat(c.split("maximum-scale=")[1]) : Infinity;
        if (d) {
          if (c >= a)return d > c ? c : d < a ? a : d
        } else if (c >= a)return 1 <= a ? 1 : Math.min(c, 1);
        console && console.log && console.log("viewport\u53c2\u6570\u4e0d\u5408\u6cd5");
        return null
      }
    }(), qb = pa && "transition" in ja.style,
    rb = !!ea.createElementNS && !!ea.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
    ub = ea.createElement("canvas"), vb = !(!ub || !ub.getContext), wb = window.URL || window.webkitURL,
    xb = !pa && !(Va && La) && window.Worker && wb && wb.createObjectURL && window.Blob, yb = "", ma = "", zb = {
      alpha: !0, antialias: !0, depth: !1, failIfMajorPerformanceCaveat: !0,
      preserveDrawingBuffer: !0, stencil: !1
    }, Ab = function () {
      if (!vb || !xb || jb)return !1;
      for (var a = ["webgl", "experimental-webgl", "moz-webgl"], b = null, c = 0; c < a.length; c += 1) {
        try {
          b = ub.getContext(a[c], zb)
        } catch (d) {
        }
        if (b) {
          if (b.drawingBufferWidth !== ub.width || b.drawingBufferHeight !== ub.height)break;
          if (!b.getShaderPrecisionFormat || !b.getParameter || !b.getExtension)break;
          if (23 > b.getShaderPrecisionFormat(35632, 36338).precision || 23 > b.getShaderPrecisionFormat(35633, 36338).precision)break;
          ma = b.getExtension("WEBGL_debug_renderer_info") ?
            b.getParameter(37446) : null;
          if ((b = la()) && -1 !== na.indexOf(b))break;
          yb = a[c];
          return !0
        }
      }
      return !1
    }(), Bb = Ab && !kb && (db || fb || hb) && ("mac" == Oa || "windows" == Oa),
    Cb = !vb || Ya || xa || kb && eb || Sa || Ga || Ba || Ca || Ma || e("gt-n710") || wa,
    Db = !Cb && !Bb && (Na || Ha || Fa && $a || !kb), Eb = Bb ? "vw" : Cb ? "d" : Db ? "dv" : "v", Fb = e("webkit"),
    Gb = "WebKitCSSMatrix" in da && "m11" in new window.WebKitCSSMatrix, Hb = "MozPerspective" in ja.style,
    Ib = "OTransition" in ja.style, Jb = qb || Gb || Hb || Ib, Kb = void 0 !== config[8] ? config[8] : !0,
    Lb = void 0 !== config[9] ? config[9] : !0, Mb =
      void 0 !== config[10] ? config[10] : !0, Nb = !rb && kb && vb, Ob = !1;
  try {
    Ob = "undefined" !== typeof da.localStorage
  } catch (Pb) {
  }
  config.j = {
    size: Da ? 100 : La ? 200 : 400,
    ru: ya,
    s7: sa,
    nK: Fa,
    pZ: Ka,
    wg: La,
    g4: Ma,
    lJ: Wa,
    $q: Oa,
    Wy: bb,
    q6: ab,
    qM: gb,
    K2: $a,
    Qn: pa,
    Dg: Pa,
    Iq: Qa,
    A5: Sa,
    bZ: Ta,
    ed: Ra,
    dZ: pa && !Ua,
    UZ: za,
    qu: Ob,
    geolocation: kb || pa && !Ra || Xa,
    pC: Va && !chrome,
    chrome: chrome,
    Bz: qa && chrome,
    gJ: eb,
    V: kb,
    Z5: kb && Fb,
    YZ: kb && Gb,
    Y5: kb && da.opera,
    Sc: qa,
    wC: pb,
    qa: qa && (!kb || !!pb && 1 <= pb),
    ud: ob,
    d_: lb,
    LL: mb,
    ML: nb,
    EW: 57 <= parseInt(ba.split("chrome/")[1]),
    I2: Fb,
    z5: qb,
    J2: Gb,
    S4: Hb,
    e6: Ib,
    LV: Jb,
    fj: rb,
    Nq: vb,
    zK: xb,
    zv: Mb,
    oW: Ab,
    Tn: Bb,
    F2: yb,
    G2: zb,
    QJ: ma,
    Y2: !1,
    VX: Kb,
    cf: Kb && !Cb,
    YV: Kb ?
      Eb : "d",
    Un: Lb && !!da.WebSocket && !bb,
    c6: Nb,
    C_: vb || Nb ? "c" : "d"
  };
  var da = window,
    Qb = {overlay: ["style"], "AMap.IndoorMap": ["AMap.CustomLayer", "cvector"], "AMap.MarkerList": ["AMap.TplUtils"]},
    Rb = "http map anip layers overlay0 brender mrender".split(" ");
  config.Fd = "main";
  config.j.ud && (Rb += ",touch", config.Fd += "t");
  config.j.V || (Rb += ",mouse", config.Fd += "m");
  config.Fd += "c";
  config.j.cf && (config.Fd += "v", Rb += ",vectorlayer,overlay", config.j.Tn ? (config.Fd += "w", Rb += ",wgl") : (config.Fd += "cg", Rb += ",cmng,cgl"));
  if (config[7]) {
    for (var Sb = [], Tb = config[7].split(","), V = 0; V < Tb.length; V += 1) {
      var Ub = Tb[V];
      Qb[Ub] && Sb.push.apply(Sb, Qb[Ub]);
      Sb.push(Ub)
    }
    Rb += "," + Sb.join(",");
    config.Fd += config[7].replace(",", "").replace(eval("/AMap./gi"), "")
  }
  config.Cn = Qb;
  Rb += ",sync";
  config.eN = Rb.split(",");
  window.AMap = window.AMap || {};
  window.AMap.zi = "1.3.27.6";
  var Vb = window.AMap.vC = {}, Wb = config[2].split(",")[0], Xb = Wb + "/theme/v" + config[4] + "/style1.3.27.6.css",
    Yb = document.head || document.getElementsByTagName("head")[0];
  if (Yb) {
    var lc = document.createElement("link");
    lc.setAttribute("rel", "stylesheet");
    lc.setAttribute("type", "text/css");
    lc.setAttribute("href", Xb);
    Yb.insertBefore(lc, Yb.firstChild)
  } else document.write("<link rel='stylesheet' href='" + Xb + "'/>");
  function mc(a) {
    var b = document, c = b.createElement("script");
    c.charset = "utf-8";
    c.src = a;
    (a = b.body || Yb) && a.appendChild(c)
  }

  function nc() {
    for (var a = Wb + "/maps/main?v=" + config[4] + "&key=" + config[0] + "&m=" + config.eN.join(",") + "&vrs=1.3.27.6",
           b = document.getElementsByTagName("script"), c,
           d = 0; d < b.length; d += 1)if (0 === b[d].src.indexOf(Wb.split(":")[1] + "/maps?")) {
      c = b[d];
      break
    }
    config[5] || c && c.async ? mc(a) : (document.write('<script id="amap_main_js" src=\'' + a + "' type='text/javascript'>\x3c/script>"), setTimeout(function () {
      document.getElementById("amap_main_js") || mc(a)
    }, 1))
  }

  var oc = (new Date).getTime();
  Vb.__load__ = function (a) {
    a(config, oc);
    Vb.__load__ = null
  };
  try {
    if (window.localStorage) {
      var pc = window.localStorage["_AMap_" + config.Fd], qc = !1;
      pc ? (pc = JSON.parse(pc), pc.version === window.AMap.zi ? (eval(pc.script), Vb.loaded = !0) : qc = !0) : qc = !0;
      if (qc)for (V in window.localStorage)window.localStorage.hasOwnProperty(V) && 0 === V.indexOf("_AMap_") && window.localStorage.removeItem(V)
    }
  } catch (rc) {
  }
  Vb.loaded || (nc(), config.eN = void 0);
})(["5f23a1eefb54d828bb23306a7d305b0a", [118.344933, 29.188757, 120.721945, 30.566516, 120.153576, 30.287459], "http://webapi.amap.com", 1, "1.3", null, "330100", "AMap.CitySearch", true, true, true])
