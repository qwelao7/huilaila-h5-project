var termConfig = [
    {
        tab:"app",
        tabTitle:"App用户",
        tabColums: ["覆盖率", "园区活跃率", "安装率"],
        tabId: ["coverRateCompare", "activeRateCompare", "installRateCompare"],
        tabTerm:[,"6","6"],
    },
    {
        tab: "order",
        tabTitle: "订单",
        tabColums: ["月同比", "接单效率", "服务速度","服务质量","人均订单数"],
        tabId: ["orderCompare", "inceptOrderRateCompare", "serviceSpeedCompare", "serviceQualityCompare", "assetOrderCompare"],
        tabTerm: ["3", "6", "6","6","6"],
    },
    {
        tab: "visitor",
        tabTitle: "访客",
        tabColums: ["月同比", "访客通行使用率"],
        tabId: ["visitorCompare", "qrcodeCompare"],
        tabTerm: ["3", "6"],
    },
    {
        tab: "express",
        tabTitle: "快递",
        tabColums: ["领取率", "扫码领取率"],
        tabId: ["expressReceiveCompare", "sweepCodeCompare"],
        tabTerm: ["6", "6"]
    },
    {
        tab: "car",
        tabTitle: "业主车辆",
        tabColums: ["月同比", "今日新增"],
        tabId: ["carSubmitCompare", "carSubmitInfo"],
        tabTerm: [ "3", "7"],
    }
];
var termTemplate = "./statistics/phase2/template/term/termDetail.html";
var moduleJs = "./statistics/phase2/module/term";
define(function (require, exports, module) {

    require("ko");
    require("frozencss");
    require("appcss");
    require("swipercss");

    var chart_, category_, app_;
    function renderPage_call_back() {
      
        var termPropertys = [];
        for (var idx in termConfig) {
            var category = termConfig[idx].tab
            if (category == category_) {//相同模块
                termPropertys = termConfig[idx];
                break;
            }
        }
        if (termPropertys.tabColums.length > 3) {
            $('#navBar').parent().addClass('narBox');
            $('#navBar').parent().html('' +
                '<div class="menu"><ul class=""><!-- ko foreach:Data --><li   data-bind="css:{\'active\':$index()==0}" ><div style="display: block;white-space:normal;word-break:break-all;" >' +
                                     '  <b  data-bind="text:$data"></b>     </div></li>  <!-- /ko --></ul><div class="unfold"><img width="44" src="./img/down.png" /></div></div>'
                );       
        }


        var templateStr = "";

        for (j = 0; j < termPropertys.tabId.length; j++) {
            //tab模板
            templateStr += ' <div class="swiper-slide">  <div class="content-slide" id="' + termPropertys.tabId[j] + '">  </div>  </div>';
        }

        $("body").append('<script type="text/html" id="columns-template">' + templateStr + '</script>');
     
        homePageinit(termPropertys.tabId[0], termPropertys.tabTerm[0]);

        for (var i = 1; i < termPropertys.tabId.length; i++) {
            var tabid = termPropertys.tabId[i], count = termPropertys.tabTerm[i];

            asyncData(tabid, count);
        }

        koBind(termPropertys);
        //加载swiper控件
        app_.setDetailPage(2, termPropertys.tabTitle, termPropertys.tab);
        $("body").append('<script src="./js/swiper-3.3.1.jquery.min.js"></script>');
        $("body").append('<script type="text/javascript">' + GetTermSwiper(termPropertys) + '</script>');
    }

    function koBind(propertys) {
        console.log(propertys);
        var viewModel = {
            Data: propertys.tabColums,
        }
        var div = document.getElementById('contain');
        ko.cleanNode(div);
        ko.applyBindings(viewModel, div);

        //导航的tab点击事件
        if (propertys.tabColums.length > 3) {
            var liWidth = 0;
            $('.narBox ul li').each(function () {
                console.log($(this).width());
                liWidth += ($(this).width()+20);
            });
            $('.narBox ul').width((liWidth+20) + 'px');
          //  $('.menu').width('320px');
            $(".narBox ul li").on('touchstart mousedown', function (e) {
                e.preventDefault()
                $(".active").removeClass('active');
                $(this).addClass('active');
                tabsSwiper.slideTo($(this).index());                
            });
            $(".narBox ul li").click(function (e) {
                e.preventDefault();
            });
            $('.unfold').on('touchstart mousedown', function (e) {
                $('#more').height('100%');
                $('#more ul li').eq($(".narBox .active").index()).addClass('active');
                $('#more').show();
                var height = $('#more').height() - 150;
                $('.lay').height(height+'px');
            });
            $("#more .banner-right").on('touchstart', function (e) {
                e.preventDefault();
                $('#more').hide();
            });
            $("#more ul li").on('touchstart mousedown', function (e) {
                e.preventDefault();
                console.log($(".active"));
                $(".active").removeClass('active');
                $(this).addClass('active');
                tabsSwiper.slideTo($(this).index());
                var Width = $('#more').width();
                var liwidth = $(".narBox ul li").eq($(this).index()).width() + $(".narBox ul li").eq($(this).index()).offset().left+20;
                if (liwidth > Width - 45) {
                    var left = liwidth - (Width - 45);
                    console.log(left);
                    // left = 100;
                    $(".menu ul").css('left', -left + 'px');
                }
                else {
                    $(".menu ul").css('left','0px');
                }
                //console.log("liwidth" + liwidth);
                //console.log(Width);
                //console.log($(".narBox ul li").eq($(this).index()).offset().left);
                $('#more').hide();
            });
            $('.lay').on('touchstart mousedown', function (e) {
                $('#more').hide();
            });
        }
        else {
            $("#navBar>li").on('touchstart mousedown', function (e) {
                e.preventDefault()
                $(".active").removeClass('active');
                $(this).addClass('active');
                tabsSwiper.slideTo($(this).index());
                $('body').scrollTop(0);
            });
            $("#navBar>li").click(function (e) {
                e.preventDefault()
            })
        }
    }

    function asyncData(id, compareCount) {
        require.async(["./../term", "./../chart/pieChart", "./../chart/barChart", "./../chart/lineChart"],
            function (term, pieChart, barChart, lineChart) {
                term.init(termTemplate, id, pieChart, barChart, lineChart, compareCount);
        });
    }

    exports.init = function (template, category, app) {
        category_ = category;
        app_ = app;
        $.get(template, function (result) {
            $("body").html(result);
            renderPage_call_back();

            // 异步加载多个模块，在加载完成时执行回调 
            //var propertys = [];
            //for (var idx in termConfig) {
            //    var tab = termConfig[idx].tab;
            //    if (category_ == tab) {//相同模块
            //        propertys = termConfig[idx];
            //        break;
            //    }
            //}
            //for (var i = 1; i < propertys.tabId.length; i++) {
            //    var tabid = propertys.tabId[i], count = propertys.tabTerm[i];

            //    asyncData(tabid,count);
            //}
       
        });
       
    }
  
});

// init first page
function homePageinit(id, compareCount) {
    seajs.use(["./statistics/phase2/module/term", "./statistics/phase2/module/chart/pieChart", "./statistics/phase2/module/chart/barChart", "./statistics/phase2/module/chart/lineChart"],
        function (term, pieChart, barChart, lineChart) {
            term.init(termTemplate, id, pieChart, barChart, lineChart, compareCount);
        });
}


function GetTermSwiper() {
    var swiper = '';
    swiper =
       ' var tabsSwiper = new Swiper(\'.swiper-container\', {' +
       ' speed: 500,' +
       ' swipeHandler : \'.swipe-handler\',' +
       ' onInit: function(swiper){' +
            ' var slideHeight = $(".content-slide").eq(swiper.activeIndex).height();' +
            ' var clentHeight=document.documentElement.clientHeight;' +
            ' var height=580;' +
            '$(".swiper-slide").css(\'height\', height + \'px\');' +
            '$(".swiper-wrapper").css(\'height\', height + \'px\');' +
        '},' +
        ' onSlideChangeStart: function (swiper) {' +
        ' var slideHeight = $(".content-slide").eq(swiper.activeIndex).height();' +
        ' var clentHeight=document.documentElement.clientHeight;' +
        ' var height=slideHeight>clentHeight?\'100%\':(clentHeight+15)+\'px\';' +
        '     $(".swiper-slide").height(height);' +
        '     $(".swiper-wrapper").height(height);' +
        '     $(".active").removeClass(\'active\');' +
        '     $("ul li").eq(swiper.activeIndex).addClass(\'active\');' +
        '     $("#more ul li").eq(swiper.activeIndex).addClass(\'active\');' +
        ' }' +
    ' });'
    return swiper;
}