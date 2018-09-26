var homeConfig = [
    {
        //集团
        tab: "head",
        tabColums: ["集团视图", "分公司列表", "项目列表"],
        tabId: ["nav", "regionList", "projectList"],
        tabApi: [, "appActiveUser", "projectList"],
    },
    {
        //分公司
        tab: "branch",
        tabColums: ["分公司视图", "项目列表"],
        tabId: ["nav", "projectList"],
        tabApi: ["appActiveUser", "peopleVisitor"],
    },
];
    
define(function (require, exports, module) {

    require("ko");
    require("frozencss");
    require("appcss");
    require("swipercss");

    function renderPage_call_back() {



        var propertys = []
        for (var idx in homeConfig) {
            var category = homeConfig[idx].tab;
            if (category == category_) {//相同模块
                propertys = homeConfig[idx];
                break;
            }
        }        
        var templateStr = "";       
        for (j = 0; j < propertys.tabId.length; j++) {
            //标题模板
            if (j == 0) {
                templateStr = '  <div class="swiper-slide">  <div class="content-slide" id="' + propertys.tabId[j] + '" >  </div>  </div>';

            }
            else {
                templateStr += '  <div class="swiper-slide">  <div class="content-slide" id="' + propertys.tabId[j] + '">  </div>  </div>';
            }
        }      
        $("body").append('<script type="text/html" id="columns-template">' + templateStr + '</script>');


       pageinit(propertys);

        for (var i = 1; i < propertys.tabId.length; i++) {
            var b = propertys.tabId[i];
            var template = b == "regionList" ? "./statistics/phase2/template/home/regionList.html" : "./statistics/phase2/template/home/projectList.html";
            var moduleJS = b == "regionList" ? "./../regionList" : "./../projectList";
            asyncData(b, moduleJS, template, category);
        }

        koBind(propertys);
        $('body').css("-webkit-touch-callout", "none");
        $('body').css("-webkit-user-select", "none");
        $("body").append('<script src="./js/swiper-3.3.1.jquery.min.js"></script>');
        $("body").append('<script type="text/javascript">' + GetSwiper(getVal("initialSlide")) + '</script>');
        if (getVal("initialSlide") > 0) {
            $('body').css("overflow", "hidden");

        }
        else {
            $('body').css("overflow", "auto");
        }
    }

    function koBind(propertys) {

        var viewModel = {
            Data: propertys.tabColums,
        }
        var div = document.getElementById('contain');
        ko.cleanNode(div);
        ko.applyBindings(viewModel, div);
     
        //导航tab的点击事件
        $("#navBar>li").on('touchstart mousedown', function (e) {
             e.preventDefault()
            $(".active").removeClass('active');
            $(this).addClass('active');
            tabsSwiper.slideTo($(this).index());
            if (category_ == "head") {
                changeURL($(this).index());
            }
            $('body').scrollTop(0);
            if ($(this).index() > 0) {
               
               $('body').css("overflow", "hidden");
           
               //alert( $('body').css("-webkit-touch-callout"));
               //alert($('body').css("-webkit-user-select"));
            }
            else {
               $('body').css("overflow", "auto");
             
            }
        });
        $("#navBar li").click(function (e) {
            e.preventDefault()
        })
    }

    function asyncData(id, moduleJS, listtemplate, category) {
        require.async([moduleJS], function (loadmore) {
            //var listtemplate = "./statistics/phase2/template/home/companyList.html";
            //console.log(id); 
            loadmore.init(listtemplate, id, category);
        });
    }

    exports.init = function (template, postData, category, app) {
        //(function () {
        //    var c = document.createElement("script");
        //    c.id = "navhome";
        //    if ($("head [scriptId='navhome']").length > 0) return;
        //    c.type = "text/html";
        //    $(c).load("./statistics/phase2/template/home/nav.html", function () {
        //        $(document.getElementsByTagName("body")[0]).append(c);
        //    });
        //})()

        category_ = category;
        app_ = app;
        $.get(template, function (result) {
           
            $("body").html(result);
            app.setHomePage(category);
            renderPage_call_back();
          
        });
        // 异步加载多个模块，在加载完成时执行回调 
        //for (var idx in homeConfig) {
        //    var tab = homeConfig[idx].tab;
        //    if (category == tab) {//相同模块
        //        propertys = homeConfig[idx];
        //        break;
        //    }
        //}
        //var id = "";
        //for (var i = 1; i < propertys.tabId.length; i++) {
        //    var b = propertys.tabId[i];
        //    var template = b == "regionList" ? "./statistics/phase2/template/home/regionList.html" : "./statistics/phase2/template/home/projectList.html";
        //    var moduleJS = b == "regionList" ? "./statistics/phase2/module/regionList" : "./statistics/phase2/module/projectList";
        //    asyncData(b, moduleJS, template, category);
        //}
    }

  
   

});

// init first page
function pageinit(propertys) {
    seajs.use(["./statistics/phase2/module/home"], function (home) {
        home.init(propertys.tab);
    });
}

function GetSwiper(initNum) {
    var n = 0;
    n = initNum == "" ? n : initNum;
    var swiper = '';
    swiper = ' var tabsSwiper = new Swiper(\'.swiper-container\', {' +
       ' speed: 500,' +
       ' initialSlide : ' + n + ',' +
       'swipeHandler : \'.swipe-handler\',' +
        'onInit: function(swiper){' +
            ' var slideHeight = $(".content-slide").eq(swiper.activeIndex).height();' +
            ' var clentHeight=document.documentElement.clientHeight-46;' +
            ' var height=clentHeight>548?clentHeight+\'px\':548+\'px\';' +
        '     $(".swiper-slide").height(height);' +
        '     $(".swiper-wrapper").height(height);' +
        '},' +
        ' onSlideChangeStart: function (swiper) {' +
        ' var slideHeight = $(".content-slide").eq(swiper.activeIndex).height();' +
        ' var clentHeight=document.documentElement.clientHeight-44;' +
        '   var height = slideHeight > clentHeight ? slideHeight : clentHeight+\'px\';' +
        '     $(".swiper-slide").height(height);' +    
        '     $(".swiper-wrapper").height(height);' +
        '     $(".active").removeClass(\'active\');' +
        '     $("#navBar li").eq(swiper.activeIndex).addClass(\'active\');' +
       ' }'+
    ' });'
    return swiper;
}


function changeURL(n) {
    var url = window.location.href;
    if (url.indexOf('?') == -1) {
        url += "?initialSlide=" + n;
    }
    else {
        if (url.indexOf('initialSlide=') == -1) {
            url += "&initialSlide=" + n;
        }
        else {
            var re = eval('/(initialSlide=)([^&]*)/gi');
            url = url.replace(re, 'initialSlide=' + n);
        }
    }
    window.history.pushState({}, 0, url);
}