
define(function (require, exports, module) {

    exports.setComDetailPage = function (title) {
       
        var homeUrl = window.location.href.split('#')[0] + "#", type;
        if (window.location.href.indexOf("timetype=day") != -1) {
            type = "day";
        }
        else if (window.location.href.indexOf("timetype=month") != -1) {
            type = "month";
        }
        else {
            type = "day";
        }
        window.location.href.indexOf("realtime")
        if (window.location.href.indexOf("realtime") != -1) {
            homeUrl += "/statistics/home/realtime";
            type = "day";
        } else {
            homeUrl += "/statistics/home/reports";
        }
   
        var curUrl = window.location.href;
        if (curUrl.indexOf('?') != -1) {
            curUrl = curUrl.split('?')[0];
        }
        token = getVal("token");
        companyCode = getVal("companyCode");
      
        curUrl += "?";
        var redirectUrl = curUrl + "timetype=" + type + "&companyCode=" + companyCode + "&token=" + token;
        redirectUrl = getVal("communityId") == "" ? redirectUrl : redirectUrl + "&communityId=" + getVal("communityId");

        var jsonStr = "{\"type\":\"" + type + "\",\"redirectUrl\":\"" + redirectUrl + "&\"}";
       // alert(jsonStr);
        $("body").append('<script>' +
            'var agent = navigator.userAgent.toLowerCase(); ' +
            'function _app_isDoBack(){' +
               'if(agent.indexOf("android")!=-1){' +
                ' if (typeof (UamaJSBridge._app_isJsDoReturn) != undefined && UamaJSBridge._app_isJsDoReturn != null)' +
                ' {UamaJSBridge._app_isJsDoReturn(true);}} ' +
                'return false;' +
            '};' +
            ' function _app_isDoBack_call_back() { var url="' + homeUrl + '?companyCode=' + companyCode + '&token=' + token +
            '";url = getVal("communityId") == "" ? url : url + "&communityId=" + getVal("communityId");'+
            ' window.location.href = url;} ' +
            '</script>'
         );
        
        $("body").append('<script> ' +
            'if(agent.indexOf("android")!=-1){' +
            'UamaJSBridge._app_setRightPannel(1,\'' + jsonStr + '\');}else{' +
            'window.webkit.messageHandlers.RemoteH5.postMessage({func:\'_app_setRightPannel\',params:{"type":1,"jdata":\'' + jsonStr + '\'}});'+
            '}' +
            '</script>'
         );
    

        $("body").append('<script>'+
             'if(agent.indexOf("android")!=-1){' +
             'UamaJSBridge._app_openCloseBtn(1);}else{' +
             'window.webkit.messageHandlers.RemoteH5.postMessage({func:\'_app_openCloseBtn\',params:1});' +
             '}'+
             '</script>');
        
       
        $("body").append('<script>' +
             'if(agent.indexOf("android")!=-1){' +
             'UamaJSBridge._app_setTitle("' + title + '");}else{' +
             'window.webkit.messageHandlers.RemoteH5.postMessage({func:\'_app_setTitle\',params:\'' + title + '\'});'+
             '}' +
             '</script>');
        
    }

    exports.setComHomePage = function (category) {
        type = (category == "realtime") ? "real" : "statistics";
        var homeUrl = window.location.href.split('#')[0] + "#";
        // alert(window.location.href);
        var parentUrl = getVal("parentUrl"), closeBtn = 0, iosReturn = true, androidReturn = false, homeTitle = "领导视图";
        homeTitle = decodeURI(getVal("communityName")) == "" ? homeTitle : decodeURI(getVal("communityName"));
        if (parentUrl != undefined && parentUrl != "" && parentUrl != null) {
            closeBtn = 1;
            iosReturn = false;
            androidReturn = true;
            homeUrl += parentUrl;
            
        }
        var jsonStr = "{\"type\":\"" + type + "\"}";
        console.log(homeTitle);
        $("body").append(
            '<script>' +
             'var agent = navigator.userAgent.toLowerCase(); ' +
                'function _app_isDoBack(){' +
                   'if(agent.indexOf("android")!=-1){' +
                    'UamaJSBridge._app_isJsDoReturn('+androidReturn+');}' +
                    'return  ' + iosReturn + ';}' +
                //' function _app_isDoBack_call_back() { var url="' + homeUrl + '?companyCode=' + companyCode + '&token=' + token +
                //'";url = getVal("communityId") == "" ? url : url + "&communityId=" + getVal("communityId");' +
                //' window.location.href = url;} ' +
                'if(agent.indexOf("android")!=-1){' +
                'UamaJSBridge._app_setTitle("' + homeTitle + '");' +
                'UamaJSBridge._app_openCloseBtn(' + closeBtn + ');' +
                'UamaJSBridge._app_setRightPannel(2,\'' + jsonStr + '\');}else{' +
                'window.webkit.messageHandlers.RemoteH5.postMessage({func:\'_app_setTitle\',params:\'' + homeTitle + '\'});' +
                'window.webkit.messageHandlers.RemoteH5.postMessage({func:\'_app_openCloseBtn\',params:' + closeBtn + '});' +
                'window.webkit.messageHandlers.RemoteH5.postMessage({func:\'_app_setRightPannel\',params:{"type":2,"jdata":\'' + jsonStr + '\'}});' +
                '}' +
            '</script>');
    }

});
