
define(function (require, exports, module) {

    //1—选择周期  2—字段解释弹框  3—排序  4—指标排名

    exports.setDetailPage = function (Type, title, category) {

        var homeUrl = window.location.href.split('#')[0] + "#", type, jsonStr;
        parentUrl = getVal("parentUrl");
        if (parentUrl != undefined) {
            homeUrl += parentUrl;
        }
        if (parentUrl == undefined ||parentUrl == ""||parentUrl==null) {
            if (window.location.href.indexOf("term") != -1 && window.location.href.indexOf("detail") == -1) {
                homeUrl += "/statistics/phase/home/head";
            }
        }

        var curUrl = window.location.href;
        if (curUrl.indexOf('?') != -1) {
            curUrl = curUrl.split('?')[0];
        }
        token = getVal("token");
        companyCode = getVal("companyCode");
        curUrl += "?";

        if (Type == 1) {
            if (category!=undefined) {
                type = category;
            }
            else {
                type = "circle";
            }
            var redirectUrl = curUrl + "timetype=" + type + "&companyCode=" + companyCode + "&token=" + token;
            redirectUrl = getVal("regionId") == "" ? redirectUrl : redirectUrl + "&regionId=" + getVal("regionId");
            jsonStr = "{\"type\":\"" + type + "\",\"redirectUrl\":\"" + redirectUrl + "&\"}";
            console.log(jsonStr);
        }
        else if (Type == 2) {
            type = category;
            jsonStr = "{\"type\":\"" + type + "\"}";
        }
        else if (Type == 3) {
            category = (category == undefined || category == "") ? 0 : category;
            if (window.location.href.indexOf("order=0") != -1) {
                type = "desc";
            }
            else if (window.location.href.indexOf("order=1") != -1) {
                type = "asc";
            }
            else {
                type = "desc";
            }
            var redirectUrl = curUrl + "companyCode=" + companyCode + "&token=" + token + "&initialSlide=" + category;
            redirectUrl = getVal("regionId") == "" ? redirectUrl : redirectUrl + "&regionId=" + getVal("regionId");
            jsonStr = "{\"type\":\"" + type + "\",\"redirectUrl\":\"" + redirectUrl + "&\"}";//(category这里当做slide的页数)
        
        }
        else if (Type == 4) {
            category = (category == undefined || category == "") ? 0 : category;
            if (window.location.href.indexOf("newOrder=0") != -1) {
                type = "desc";
            }
            else if (window.location.href.indexOf("newOrder=1") != -1) {
                type = "asc";
            }
            else {
                type = "desc";
            }
            var redirectUrl = homeUrl + "?companyCode=" + companyCode + "&token=" + token;
            redirectUrl = getVal("regionId") == "" ? redirectUrl : redirectUrl + "&regionId=" + getVal("regionId");
            jsonStr = "{\"type\":\"" + type + "\",\"redirectUrl\":\"" + redirectUrl + "&\"}";//(category这里当做slide的页数)
            Type = 3;
        }
   
        console.log(jsonStr);

        //var jsonStr = "{\"type\":\"" + type + "\",\"redirectUrl\":\"" + curUrl + "timetype=" + type + "&companyCode=" + companyCode + "&token=" + token + "&\"}";
        //  alert(homeUrl);
        var isDoBack, setRightPannel, openCloseBtn, setTitle;
        isDoBack = 'var agent = navigator.userAgent.toLowerCase(); ' +
                    'function _app_isDoBack(){' +
                       'if(agent.indexOf("android")!=-1){' +
                        ' if (typeof (UamaJSBridge._app_isJsDoReturn) != undefined && UamaJSBridge._app_isJsDoReturn != null)' +
                        ' {UamaJSBridge._app_isJsDoReturn(true);}} ' +
                        'return false;' +
                    '};' +
                   ' function _app_isDoBack_call_back() { var url="' + homeUrl + '?companyCode=' + companyCode + '&token=' + token +
               '";url = getVal("regionId") == "" ? url : url + "&regionId=" + getVal("regionId");' +
               ' window.location.href = url;} ';
         setRightPannel = 'if(agent.indexOf("android")!=-1){' +
                        'UamaJSBridge._app_setRightPannel(' + Type + ',\'' + jsonStr + '\');}else{' +
                       'window.webkit.messageHandlers.RemoteH5.postMessage({func:\'_app_setRightPannel\',params:{"type":'+Type+',"jdata":\'' + jsonStr + '\'}});'+
                        '}';
         openCloseBtn = 'if(agent.indexOf("android")!=-1){' +
                         'UamaJSBridge._app_openCloseBtn(1);}else{' +
                            'window.webkit.messageHandlers.RemoteH5.postMessage({func:\'_app_openCloseBtn\',params:1});' +
                          '}';
         setTitle = 'if(agent.indexOf("android")!=-1){' +
                    'UamaJSBridge._app_setTitle("' + title + '");}else{' +
                       'window.webkit.messageHandlers.RemoteH5.postMessage({func:\'_app_setTitle\',params:\'' + title + '\'});'+
                    '}';
         if ($("#isDoBack").html() == undefined) {
             $("body").append('<script id=isDoBack>' + isDoBack + '</script>');
         }
         else {
             $("#isDoBack").html(isDoBack);
         }
        
      
   
        if ($("#setRightPannel").html() == undefined) {
            $("body").append('<script id=setRightPannel>' + setRightPannel + '</script>');
        }
        else {
            $("#setRightPannel").html(setRightPannel);
        }
         
        //关闭按钮
         if ($("#openCloseBtn").html() == undefined) {
             $("body").append('<script id=openCloseBtn>' + openCloseBtn + '</script>');
         }
         else {
             $("#openCloseBtn").html(openCloseBtn);
         }
        //set标题
         if ($("#setTitle").html() == undefined) {
             $("body").append('<script id=setTitle>' + setTitle + '</script>');
         }
         else {
             $("#setTitle").html(setTitle);
         }
      
    }

    exports.setHomePage = function (category) {
        var parenturl = getVal("parentUrl"), closeBtn = 0, iosReturn = true, androidReturn = false;
        var homeTitle = "领导视图";
           homeTitle = decodeURI(getVal("regionName")) == "" ? homeTitle : decodeURI(getVal("regionName"));
        if (parenturl != undefined && parenturl != "" && parenturl != null) {
            closeBtn = 1;
            iosReturn = false;
            androidReturn = true;
         
        }
        var parentUrl,redirectCompany, redirectProject;
        var homeUrl = window.location.href.split('#')[0] + "#";
        //从首页的指标排名
        if (category == "head") {       
            redirectCompany = homeUrl + "/statistics/phase/rank/company";
            redirectProject = homeUrl + "/statistics/phase/rank/project";
            parentUrl = "/statistics/phase/home/head";
            homeUrl += "/statistics/phase/home/head";
        }      
        else {
            redirectProject = homeUrl + "/statistics/phase/rank/project";
            homeUrl += "/statistics/phase/rank/project";
            parentUrl = "/statistics/phase/home/branch";
        }
        
        redirectCompany += "?";
        redirectProject += "?";
        homeUrl += "?";
        var jsonStr = "";
        if (category == "head") {
            jsonStr = "[{\"type\":\"分公司月排名\",\"redirectUrl\":\"" + redirectCompany + "companyCode=" + companyCode + "&token=" + token + "&parentUrl=" + parentUrl + "&order=0\"},{\"type\":\"项目月排名\",\"redirectUrl\":\"" + redirectProject + "companyCode=" + companyCode + "&token=" + token + "&parentUrl=" + parentUrl + "&order=0\"}]";
        }
        else {
            if (getVal("regionId") == "") {
                jsonStr = "[{\"type\":\"项目月排名\",\"redirectUrl\":\"" + redirectProject + "companyCode=" + companyCode + "&token=" + token + "&parentUrl=" + parentUrl + "&order=0\"}]";
            } else {
                jsonStr = "[{\"type\":\"项目月排名\",\"redirectUrl\":\"" + redirectProject + "companyCode=" + companyCode + "&token=" + token + "&parentUrl=" + parentUrl + "&regionId=" + getVal("regionId") + "&order=0\"}]";
            }
        }
        console.log(jsonStr);
        console.log(homeTitle);
        $("body").append(
            '<script>' +
             'var agent = navigator.userAgent.toLowerCase(); ' +
               'function _app_isDoBack(){' +
                'if(agent.indexOf("android")!=-1){' +
                ' if (typeof (UamaJSBridge._app_isJsDoReturn) != undefined && UamaJSBridge._app_isJsDoReturn != null)' +
                '{UamaJSBridge._app_isJsDoReturn(' + androidReturn + ');}}' +
                'return  ' + iosReturn + ';}' +
                //' function _app_isDoBack_call_back() { window.location.href = "' + homeUrl + 'companyCode=' + companyCode + '&token=' + token + '";} '+
                'if(agent.indexOf("android")!=-1){' +
                'UamaJSBridge._app_setTitle("' + homeTitle + '");' +
                'UamaJSBridge._app_openCloseBtn(' + closeBtn + ');' +
                'UamaJSBridge._app_setRightPannel(4,\'' + jsonStr + '\');' +
                '}else{' +
                'window.webkit.messageHandlers.RemoteH5.postMessage({func:\'_app_setTitle\',params:\'' + homeTitle + '\'});' +
                'window.webkit.messageHandlers.RemoteH5.postMessage({func:\'_app_openCloseBtn\',params:' + closeBtn + '});' +
                'window.webkit.messageHandlers.RemoteH5.postMessage({func:\'_app_setRightPannel\',params:{"type":4,"jdata":\'' + jsonStr + '\'}});'+
                '}' +
            '</script>');
    }

});
