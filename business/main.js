 var postData = new Object();
 window.token = getVal("token");
 window.companyCode = getVal("companyCode");
 //window.version = getVal("version");
 window.voteId = getVal("voteId");
 window.agent = navigator.userAgent.toLowerCase();
 window.sign = "9c19d8b9dfab1d41a99bc54dced3a9795dd033c8";
 window.fieds = "version";
 window.version = "2";


 if (window.localStorage) {
     localStorage.setItem("token", token);
     localStorage.setItem("companyCode", companyCode);
     localStorage.setItem("sign", sign);
     localStorage.setItem("fieds", fieds);
     localStorage.setItem("version", version);
 }

 if (window.localStorage.length > 0) {
     postData.token = localStorage.getItem("token");;
     postData.companyCode = localStorage.getItem("companyCode");
     postData.sign = localStorage.getItem("sign");
     postData.fieds = localStorage.getItem("fieds");
     postData.version = localStorage.getItem("version");
}
 else{
     postData.token=token;
     postData.companyCode = companyCode;
     postData.sign = sign;
     postData.fieds = fieds;
     postData.version = version;
 }

seajs.config({
    base: "./",
    alias: {
        "jquery": "js/jquery.min-cmd.js",
        "ko": "js/knockout.js",
        "echarts": "js/echarts.min.js",
        "layer": "layer-mobile/layer.js",
        "layercss": "layer-mobile/need/layer.css",
        "frozencss": "css/frozen.css",
        "appcss": "css/app.css",
        "aboutcss":"css/about.css",
        "swipercss": "css/swiper-3.3.1.min.css"
    }
})


function viewHome(category) {

    _HOME = _homes;
    $("#error").remove();

  
    if (window.localStorage.length > 0) {
        //webview里面不支持本地存储
        token = localStorage.getItem("token");
        companyCode = localStorage.getItem("companyCode");
    }
    var api, template, moduleJs;
    moduleJs = "./statistics/module/home";
    if (category == "realtime") {
        api = "wgAdminViewAction!mainPageCurrentData.action?token=" + token + "&companyCode=" + companyCode;
        api = getVal("communityId") == "" ? api : api + "&communityId=" + getVal("communityId");
        template = "./statistics/template/home/realtime.html?token=" + token + "&companyCode=" + companyCode;
        template = getVal("communityId") == "" ? template : template + "&communityId=" + getVal("communityId");
        template = getVal("parentUrl") == "" ? template : template + "&parentUrl=" + getVal("parentUrl");
    } else if (category == "reports") {
        api = "wgAdminViewAction!mainPageStatisticsData.action?token=" + token + "&companyCode=" + companyCode;
        template = "./statistics/template/home/reports.html?token=" + token + "&companyCode=" + companyCode;
        template = getVal("communityId") == "" ? template : template + "&communityId=" + getVal("communityId");
        template = getVal("parentUrl") == "" ? template : template + "&parentUrl=" + getVal("parentUrl");
    } else {
        //do nothing data
      
    }

    seajs.use([moduleJs, "./statistics/module/app"], function (home,comapp) {
        home.init(api, template, comapp, category);
    });
  
}

function getVal(key) {
    var value = getRouterParam(key);

    if (value == undefined || typeof (value) == undefined || value == null) {
        return "";
    }

    return value;
}


//--------------关于页面-------------------

 function viewAbout(category) {
     var api, template, moduleJs;
     version = getVal("version");
     moduleJs = "./about/module/home";
     if (category == "greenTown") {
         template = "./about/template/greenTown.html";      
         seajs.use([moduleJs], function (home) {
             home.init(api, template, category);
         });
     }
     else if (category == "butler") {
         template = "./about/template/aide.html";
         seajs.use([moduleJs], function (home) {
             home.init(api, template, category, version);
         });
     }
     else if (category == "merchan") {
         template = "./about/template/aide.html";
         seajs.use([moduleJs], function (home) {
             home.init(api, template, category, version);
         });
     }
     else if (category == "help") {
         template = "./about/template/help.html";
         seajs.use([moduleJs], function (home) {
             home.init(api, template, category);
         });
     }
 }

 function viewAboutdetail(category) {
     if (window.localStorage.length > 0) {
         //webview里面不支持本地存储
         token = localStorage.getItem("token");
         companyCode = localStorage.getItem("companyCode");
     }
     //token = "98f618aa-c59c-42d6-9935-36efde7e457c";
     //companyCode = "lc";
     var api, template, moduleJs,  sectype;
   
     if (category == "greenTown") {
         sectype = "05";
     }
     else if (category == "butler") {
         sectype = "06";
     }
     else if (category == "merchan")
     {
         sectype ="07";
     }
     else if (category == "aftersale") {
         sectype = "03";
     }
     else if (category == "problem") {
         sectype = "04";
     }
     else if (category == "onlinePay") {
         sectype = "01"
     }
     else if (category == "offlinePay") {
         sectype = "02"
     }
     api = "scInfomationAction!aboutDetail.action?token=" + token +
                                          "&companyCode=" + companyCode +
                                       "&type=5&sectype=" + sectype;
     moduleJs = "./about/module/detail";
         template = "./about/template/detail.html";
         seajs.use([moduleJs], function (detail) {
             detail.init(api, template);
         });
     
  
 }
