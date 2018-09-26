// 详情页的tab
    var detailConfig = [{
        tab: "coverRateCompare",
        tabTitle: "覆盖率",
        api: "coverRateInfo",
        tabColums: ["截止月", "截止日"],
        tabId: ["month", "day"],
    },
    {
        tab: "activeRateCompare",
        tabTitle: "园区活跃率",
        api: "activeRateInfo",
        tabColums: ["月活跃率", "日活跃率"],
        tabId: ["month", "day"],

    },
    {
        tab: "installRateCompare",
        tabTitle: "安装率",
        api: "installRateInfo",
        tabColums: ["截止月", "截止日"],
        tabId: ["month", "day"],

    },
    {
        //单页面
        tab: "orderCompare",
        tabTitle: "订单月环比",
        api: "orderCompareInfo",
    },
    {
        tab: "inceptOrderRateCompare",
        tabTitle: "接单效率",
        api: "receiveOrderEfficiencyInfo",
        tabColums: ["月接单效率", "日接单效率"],
        tabId: ["month", "day"],

    },
    {
        tab: "serviceSpeedCompare",
        tabTitle: "服务速度",
        api: "serviceSpeedInfo",
        tabColums: ["月服务速度", "日服务速度"],
        tabId: ["month", "day"],
    },
    {
        tab: "serviceQualityCompare",
        tabTitle: "服务质量",
        api: "serviceQualityInfo",
        tabColums: ["月服务质量", "日服务质量"],
        tabId: ["month", "day"],
    },
    {
        tab: "assetOrderCompare",
        tabTitle: "人均订单数",
        api: "assetOrderInfo",
        tabColums: ["月人均订单数", "日人均订单数"],
        tabId: ["month", "day"],
    },
    {
        tab: "visitorCompare",
        tabTitle: "访客月环比",
        api: "visitorCompareInfo",
      
    },
    {
        tab: "qrcodeCompare",
        tabTitle: "访客通行使用率",
        api: "qrcodeCompareInfo",
        tabColums: ["月使用率", "日使用率"],
        tabId: ["month", "day"],
    },
    {
        tab: "expressReceiveCompare",
        tabTitle: "快递领取率",
        api: "expressGetRateInfo",
        tabColums: ["月领取率", "日领取率"],
        tabId: ["month", "day"],
    },
    {
        tab: "sweepCodeCompare",
        tabTitle: "扫码领取率",
        api: "sweepCodeCompareInfo",
        tabColums: ["月扫码领取率", "日扫码领取率"],
        tabId: ["month", "day"],
    },
    {
        tab: "carSubmitCompare",
        tabTitle: "登记月环比",
        api: "carCompareInfo",

    },
    {
        tab: "carSubmitInfo",
        tabTitle: "车辆登记量",
        api: "carSubmitInfo",
    },
];

var detailtemplate = "./statistics/phase2/template/term/detail.html";
var moduleJs = "./../detail";
define(function (require, exports, module) {

    require("ko");
    require("frozencss");
    require("appcss");
    require("swipercss");

    var chart_, tab_, app_;
    function renderPage_call_back() {
   
        var termPropertys = [];
        for (var idx in detailConfig) {
            var tab = detailConfig[idx].tab;
            if (tab == tab_) {//相同模块
                detailPropertys = detailConfig[idx];
                break;
            }
        }
        console.log(detailPropertys);
        var templateStr = "";
        if (detailPropertys.tabId != undefined) {
            for (j = 0; j < detailPropertys.tabId.length; j++) {
                //标题模板
                templateStr += '  <div class="swiper-slide">  <div class="content-slide" id="' + detailPropertys.tabId[j] + '"> </div>  </div>';
                
            }

            $("body").append('<script type="text/html" id="columns-template">' + templateStr + '</script>');

            detailPageinit(detailPropertys);

            if (detailPropertys.tabId != undefined) {
                var i = window.location.href.indexOf("timetype=day") == -1 ? 1 : 0;
                var api = detailPropertys.api;
                var async_timetype = (detailPropertys.tabId == undefined) ? undefined : detailPropertys.tabId[i];
                require.async([moduleJs, "./../chart/lineChart"], function (detail, chart) {
                    detail.detailinit(detailtemplate, api, chart, async_timetype);
                });
            }

            koBind(detailPropertys);
            console.log(GetDetailSwiper());
            $("body").append('<script src="./js/swiper-3.3.1.jquery.min.js"></script>');
            $("body").append('<script type="text/javascript">' + GetDetailSwiper(detailPropertys.api) + '</script>');
            var timetype = "month";
            timetype=window.location.href.indexOf("timetype=day") == -1?"month":"day";
           
            app_.setDetailPage(1, detailPropertys.tabTitle, timetype);
        }
        else {
            detailPageinit(detailPropertys);
            $("#narBar").remove();
            $(".swiper-container").remove();
            $("#contain").append('<div id="' + detailPropertys.api + '"> <p class="txt"></p> </div> ');
            var timetype = undefined;
            if (detailPropertys.tab == "carSubmitInfo") {
                timetype = "day";
            }
            app_.setDetailPage(1, detailPropertys.tabTitle,timetype);
        }
        
     
    }

    function koBind(propertys) {

        var viewModel = {
            Data: propertys.tabColums,

        }
        var div = document.getElementById('contain');
        ko.cleanNode(div);
        ko.applyBindings(viewModel, div);

        if (window.location.href.indexOf("timetype=day") != -1) {
            $("#navBar li").eq(0).removeClass('active');
            $("#navBar li").eq(1).addClass('active');
        }
        //导航tab的点击事件
        $("#navBar>li").on('touchstart mousedown', function (e) {
            e.preventDefault()
            $(".active").removeClass('active');
            $(this).addClass('active');
            tabsSwiper.slideTo($(this).index());
            $('body').scrollTop(0);
            var curUrl = window.location.href;
            if (curUrl.indexOf('?') != -1) {
                curUrl = curUrl.split('?')[0];
            }
            curUrl += "?";
            var timetype_ = $(this).index() == 0 ? "month" : "day";
            var redirectUrl = curUrl + "timetype=" + timetype_ + "&companyCode=" + companyCode + "&token=" + token;
            redirectUrl = getVal("regionId") == "" ? redirectUrl : redirectUrl + "&regionId=" + getVal("regionId");
            jsonStr = "{\"type\":\"" + timetype_ + "\",\"redirectUrl\":\"" + redirectUrl + "&\"}";
            console.log(jsonStr);
            if (agent.indexOf("android") != -1) {
                UamaJSBridge._app_setRightPannel(1, jsonStr);
            } else {
              
                window.webkit.messageHandlers.RemoteH5.postMessage({ func: '_app_setRightPannel', params: { "type": 1, "jdata": jsonStr } });
            }
        });
        $("#navBar li").click(function (e) {
            e.preventDefault()
        })

    }

    exports.init = function (template, tab,app) {
        // chart_ = chart;
        tab_ = tab, app_=app;
        console.log(app_);
        $.get(template, function (result) {
            $("body").html(result);
            renderPage_call_back();
        });
        //// 异步加载多个模块，在加载完成时执行回调 
        //for (var idx in detailConfig) {
        //    var tabs = detailConfig[idx].tab;
        //    if (tab == tabs) {
        //        propertys = detailConfig[idx];
        //        break;
        //    }
        //}
        //if (propertys.tabId != undefined) {
        //    var i = window.location.href.indexOf("timetype=day") == -1 ? 1 : 0;
        //    var api = propertys.api;
        //    var timetype = (propertys.tabId == undefined) ? undefined : propertys.tabId[i];
        //    require.async([moduleJs, "./statistics/phase2/module/chart/lineChart"], function (detail, chart) {
        //        detail.detailinit(detailtemplate, api, chart,timetype);
        //    });
        //}
    }

});

// init first page
function detailPageinit(propertys) {
    console.log(propertys.tabId);
    var i = window.location.href.indexOf("timetype=day") == -1 ? 0 : 1;
    var api = propertys.api;
    var timetype = (propertys.tabId == undefined) ? undefined : propertys.tabId[i];
    seajs.use(["./statistics/phase2/module/detail", "./statistics/phase2/module/chart/lineChart"], function (detail, chart) {
        detail.detailinit(detailtemplate, api, chart, timetype);
    });

}


function GetDetailSwiper(id) {
    var swiper = '';
    swiper = 'var n = 0;'+
    'if (window.location.href.indexOf("timetype=day") != -1) {'+
    '    n = 1;'+
    '}'+
    'console.log("n的值" + n);'+
    'var tabsSwiper = new Swiper(\'.swiper-container\', {'+
    '    speed : 500,'+
    '    initialSlide : n,'+
    '    swipeHandler : \'.swipe-handler\','+
    '    onInit : function (swiper) {'+
    '        var slideHeight = $(".content-slide").eq(swiper.activeIndex).height();'+
    '        var clentHeight = document.documentElement.clientHeight;'+
    '        var height = slideHeight > clentHeight ? slideHeight : clentHeight;' +
    '        $(".swiper-slide").height(\'100%\');' +
    '        $(".swiper-wrapper").height(\'100%\');' +
    '    },'+
    '    onSlideChangeStart : function (swiper) {' +
    //'       if(n==0){'+
    '         console.log("触发了onchange"); '+
    '        var slideHeight = $(".content-slide").eq(swiper.activeIndex).height();' +
    '        var clentHeight = document.documentElement.clientHeight;'+
    '        var height = slideHeight > clentHeight ? slideHeight : clentHeight;' +
    '        $(".swiper-slide").height(height+\'px\');' +
    '        $(".swiper-wrapper").height(height+\'px\');' +
    '        $(".active").removeClass(\'active\');'+
    '        $("#navBar li").eq(swiper.activeIndex).addClass(\'active\');' +
    //'        var timetype=(swiper.activeIndex==0)?"month":"day"; ' +
    //'            seajs.use(["./statistics/phase2/module/detail", "./statistics/phase2/module/chart/lineChart"], function (detail, chart) {' +
    //'               detail.detailinit("./statistics/phase2/template/term/detail.html", "' + id + '", chart,timetype);' +
    //'              });'+
   // '         }'+
    '    }'+
   ' });'

    return swiper;
}
