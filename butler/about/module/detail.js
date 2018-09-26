

define(function (require, exports, module) {

    require("ko");

    function koBind(msg) {
        var jdat = JSON.parse(msg);

        if (jdat.status == "100") {
            if (jdat.data != null) {
                var viewModel = {
                    Data: jdat.data,
                }
                var div = document.getElementById("contain");
                ko.cleanNode(div);
                ko.applyBindings(viewModel, div);

                fixImg();
            }
            else {
                $('#contain').html('<div style="width:100%;height:100%;padding-top:50%;text-align:center"><img width="100" src="./img/nomsg.png" /><p style="color:#aaaaaa">暂无相关信息</p></div>');
            }
        }
        else {
            errorPage();
        }

    }

    function fixImg() {
        $("#content").find("img").each(function () {
            //when cached
            var imgWidth = $(this).width();
            var bodyWidth = $(window).width() - 30;

            if (imgWidth > bodyWidth) {
                $(this).css("background-size", "contain").css("width", bodyWidth + "px");
            }

            //when first load
            $(this).load(function () {
                var imgWidth = $(this).width();
                var bodyWidth = $(window).width() - 30;

                if (imgWidth > bodyWidth) {
                    $(this).css("background-size", "contain").css("width", bodyWidth + "px");
                }
            })
        });
    }

    exports.init = function (api, template) {

        $.get(template, function (result) {
            $("body").html(result);
            //  app.setHomePage(category);
            // setTimeout(function () { window.location.reload(); }, 600000); //指定10分钟刷新一次
           
             post(api, undefined, koBind);
        });
    }

});