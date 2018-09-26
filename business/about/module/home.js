content = [{
    category: "butler",
    codeimg: "./img/wg_erweima@2x.png",
    item_android: [{ name: "关于智慧管理APP", url: "./about/wg/aboutwg.html" },
                  { name: "软件许可使用协议", url: "./about/agreement/butlerAgree-android.html" },
                  { name: "回来啦社区APP下载", url: "./about/wg/lcload.html" }],
    item_ios: [{ name: "关于智慧物管APP", url: "./about/wg/aboutwg.html" },
     { name: "软件许可使用协议", url: "./about/agreement/butlerAgree-ios.html" },
     { name: "回来啦社区APP下载", url: "./about/wg/lcload.html" }],
},
{
    category: "merchan",
    codeimg: "./img/saler_erweima.png",
    item: [{ name: "软件许可使用协议", url: "./about/agreement/MerchantAgree.html" }],
},
{
    category: "greenTown",
    // 去除功能介绍
    item: [{name:"软件许可协议", url: "./about/agreement/greenTownAgree.html" },
          { name:"特别说明",url: "./about/special.html" }],
},
{
    category: "help",
    // 去除功能介绍
    item: [{ name: "软件许可协议", url: "./about/agreement/greenTownAgree.html" },
          { name: "特别说明", url: "./about/special.html" }],
}
];

var category_, version_;
define(function (require, exports, module) {

    require("ko");
    require("frozencss");
    require("appcss");


    function renderPage_call_back(category, version) {
        console.log(category);
        var propertys = []
        for (var idx in content) {
            var categorys = content[idx].category;
            if (categorys == category) {//相同模块
                propertys = content[idx];
                break;
            }
        }
        var item = propertys.item;
        if (category == "merchan") {
            item = propertys.item;
        }
        if (category == "butler") {
            var agent = navigator.userAgent.toLowerCase();
            if (agent.indexOf("android") != -1) {
                item = propertys.item_android;

            }
            else { item = propertys.item_ios; }
        }
        var viewModel = {
            item:item,
            imgsrc: propertys.codeimg,
            version: version
        }
        var div = document.getElementById("contain");
        ko.cleanNode(div);
        ko.applyBindings(viewModel, div);
        if (propertys.category == "help") {
            $("[sectype]").each(function () {
                $(this).bind("click", function () {
                    var action = $(this).attr("sectype");
                    if (action != "") {
                        window.location.href = "./index.html#/aboutdetail/" + action + "?token=" + token + "&companyCode=" + companyCode;
                    }
                });
            });
        }
        else {
            $('#list li').each(function () {
                $(this).bind("click", function () {
                    window.location.href = item[$(this).index()].url;
                });
            });
        }
    }

    exports.init = function (api, template, category,version) {
        category_ = category; version_ = version;
        $.get(template, function (result) {
            $("body").html(result);
            //if (category == "butler" || category == "merchan") {
            //    renderPage_call_back(category, version);
            //}
            renderPage_call_back(category, version);
         
        });
    }

});