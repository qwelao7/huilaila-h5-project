

define(function(require, exports, module) {

    require("ko");
    require("frozencss");
    require("appcss");

    

    function koBind(msg) {
        
        var jdat = JSON.parse(msg);

        if (jdat.status == "100") {
            var viewModel = {
                Data: jdat.data,

            }

            var div = document.getElementById("contain");
            ko.cleanNode(div);
            ko.applyBindings(viewModel, div);

            $("[module]").each(function () {
                $(this).bind("click", function () {
                    //
                  
                    var action = $(this).attr("module");
                    if (action != "") {
                        var url= "./index.html#/statistics/detail/realtime/" + action+"?token=" + token + "&companyCode=" + companyCode;
                        url=getVal("communityId") == "" ? url : url + "&communityId=" + getVal("communityId");
                        window.location.href = url;
                    }
                });
            });
        }
        //else if (jdat.status == "102") {
        //    var msg = (jdat.msg == "") ? "帐号已过期，请重新登录！" : jdat.msg;
        //    //msg = "test";
        //    if (agent.indexOf("android") != -1) {
        //        UamaJSBridge._app_tokenFailue();
        //    } else {
        //        window.webkit.messageHandlers.RemoteH5.postMessage({ func: '_app_tokenFailue' });
        //    }
        //}
        else {
            errorPage();
        }
       
       

        //UamaJSBridge._app_dismissLoadingAlert();
    }



    exports.init = function (api, template, app, category) {

        $.get(template, function (result) {
            $("body").html(result);
            app.setComHomePage(category);
            setTimeout(function () { window.location.reload(); }, 600000); //指定10分钟刷新一次
            console.log(postData);
            var maindata = new Object();
            for (var x in postData) {
                maindata[x] = postData[x];
            }
            if (getVal("communityId") != "") {
                maindata.communityId = getVal("communityId");
            }
            console.log(maindata);
            post(api, maindata, koBind);
        });
    }

});

//统计报表页的绑定
function locationDetail(timetype, data) {
    if (data != "") {
        window.location.href =getVal("communityId") != ""? "./index.html#/statistics/detail/reports/" + data.code + 
        "?timetype=" + timetype +
        "&companyCode=" + companyCode + 
        "&token=" + token+
        "&communityId=" + getVal("communityId"): "./index.html#/statistics/detail/reports/" + data.code +
        "?timetype=" + timetype +
        "&companyCode=" + companyCode + 
        "&token=" + token;
    }
}
//首页的跳转

function homeLocation(category) {
    if (category == "realtime") {
        var url="./index.html#/statistics/home/realtime?token=" + token + "&companyCode=" + companyCode;
        url = getVal("communityId") == "" ? url : url + "&communityId=" + getVal("communityId");
        url = getVal("communityName") == "" ? url : url + "&communityName=" + getVal("communityName");
        url = getVal("parentUrl") == "" ? url : url + "&parentUrl=" + getVal("parentUrl");
        window.location.href = url;
    
       
    } else {
        
        var url ="./index.html#/statistics/home/reports?token=" + token + "&companyCode=" + companyCode;
        url = getVal("communityId") == "" ? url : url + "&communityId=" + getVal("communityId");
        url = getVal("communityName") == "" ? url : url + "&communityName=" + getVal("communityName");
        url = getVal("parentUrl") == "" ? url : url + "&parentUrl=" + getVal("parentUrl");
        window.location.href = url;
    }
}
