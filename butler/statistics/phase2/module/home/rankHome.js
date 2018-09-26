var rankConfig = [
    {
        companytype: "company",
        title: "分公司月排名",
        tabColums: ["园区活跃率", "安装率", "人均订单数"],
        tabId: ["activeRateRanking", "installRateRanking", "assetOrderRanking"],
    },
    {
        companytype: "project",
        title: "项目月排名",
        tabColums: ["园区活跃率", "安装率", "人均订单数"],
        tabId: ["activeRateMonthRanking", "installRateMonthRanking", "assetOrderMonthRanking"],
    }

];
var template = "./statistics/phase2/template/rank/rank.html";
var companytype_, app_;
define(function (require, exports, module) {

    require("ko");
    require("frozencss");
    require("appcss");
    require("swipercss");

    function renderPage_call_back(companytype_) {
    
        var rankPropertys = [];
        for (var idx in rankConfig) {
            var companytype = rankConfig[idx].companytype;
            if (companytype == companytype_) {//相同模块
                rankPropertys = rankConfig[idx];
                break;
            }
        }
        console.log(rankPropertys);
        var templateStr = "";

        for (j = 0; j < rankPropertys.tabId.length; j++) {
            //标题模板
            templateStr += ' <div class="swiper-slide">  <div class="content-slide" id="' + rankPropertys.tabId[j] + '">  </div>  </div>';
       
        }

        $("body").append('<script type="text/html" id="columns-template">' + templateStr + '</script>');
        rankPageinit(rankPropertys);

        // 加载多个模块，在加载完成时执行回调 
        for (var i = 1; i < rankPropertys.tabId.length; i++) {
            var tabid = rankPropertys.tabId[i];
            asyncData(rankPropertys.companytype, tabid, tabid);
        }
      
        koBind(rankPropertys);
       
        $("body").append('<script src="js/swiper-3.3.1.jquery.min.js"></script>');
        $("body").append('<script type="text/javascript">' + GetSwiper(getVal("initialSlide")) + '</script>');
        app_.setDetailPage(3, rankPropertys.title, getVal("initialSlide"));
    }

    function koBind(propertys) {

        var viewModel = {
            Data: propertys.tabColums,
        }
        var div = document.getElementById('contain');
        ko.cleanNode(div);
        ko.applyBindings(viewModel, div);
       
        $("#navBar>li").on('touchstart mousedown', function (e) {
            e.preventDefault()
            $(".active").removeClass('active');
            $(this).addClass('active');
            tabsSwiper.slideTo($(this).index());
            var curUrl = window.location.href;
            if (curUrl.indexOf('?') != -1) {
                curUrl = curUrl.split('?')[0];
            }
            curUrl += "?";
            var type = "desc";
            if (window.location.href.indexOf("order=0") != -1) {
                type = "desc";
            }
            else if (window.location.href.indexOf("order=1") != -1) {
                type = "asc";
            }
            var redirectUrl = curUrl + "companyCode=" + companyCode + "&token=" + token + "&initialSlide=" + $(this).index();
            redirectUrl = getVal("regionId") == "" ? redirectUrl : redirectUrl + "&regionId=" + getVal("regionId");
            jsonStr = "{\"type\":\"" + type + "\",\"redirectUrl\":\"" + redirectUrl + "&\"}";
            //console.log(jsonStr);
           
            if (agent.indexOf("android") != -1) {
                UamaJSBridge._app_setRightPannel(3, jsonStr);
            } else {
            
                window.webkit.messageHandlers.RemoteH5.postMessage({ func: '_app_setRightPannel', params: { "type": 3, "jdata": jsonStr } });
            }
            $('body').scrollTop(0);
           
        });
        $("#navBar li").click(function (e) {
            e.preventDefault();

        })
    }
    function asyncData(companytype, category, id) {
        require.async(["./../rank"], function (rank) {

            rank.init(companytype, category, id);
        });
    }


    exports.init = function (template, category, app) {
        app_ = app, companytype_ = category;
        $.get(template, function (result) {

            $("body").html(result);
            renderPage_call_back(companytype_);

        });
        // 异步加载多个模块，在加载完成时执行回调 
       
    }

});

// init first page
function rankPageinit(propertys) {
    var id = propertys.tabId[0];
    seajs.use(["./statistics/phase2/module/rank"], function (rank) {
       //console.log(new rank.init());
        rank.init(propertys.companytype, id, id);
    });
 
}


function GetSwiper(initNum) {
    var n = 0;
    n = initNum == "" ? n : initNum;
    var swiper = '';
    swiper = 
       ' var tabsSwiper = new Swiper(\'.swiper-container\', {' +
       ' initialSlide : ' + n + ',' +
       ' speed: 500,' +
       'swipeHandler : \'.swipe-handler\',' +
        'onInit: function(swiper){' +
            ' var slideHeight = $(".content-slide").eq(swiper.activeIndex).height();' +
            ' var clentHeight=document.documentElement.clientHeight;' +
            ' var height=slideHeight>clentHeight?\'slideHeight\':clentHeight-44;' +
            'height=595;' +
        '     $(".swiper-slide").height(height+ \'px\');' +
        '     $(".swiper-wrapper").height(height+ \'px\');' +
       
        '},' +
        ' onSlideChangeStart: function (swiper) {' +
        ' var slideHeight = $(".content-slide").eq(swiper.activeIndex).height();' +
        ' var clentHeight=document.documentElement.clientHeight;' +
        ' var height=slideHeight>clentHeight?slideHeight:clentHeight-44;' +
        '     height=595;' +
        '     $(".swiper-slide").css(\'height\', height + \'px\');' +
        '     $(".swiper-wrapper").css(\'height\', height + \'px\');' +
        '     $(".active").removeClass(\'active\');' +
        '     $("#navBar li").eq(swiper.activeIndex).addClass(\'active\');' +
       ' }' +
    ' });'
    return swiper;
}