
define(function (require, exports, module) {

    require("ko");
    require("frozencss");
  //  require("appcss");


    function renderPage_call_back(msg) {
      
        var jdat = JSON.parse(msg);
         $(".promotion").show();
         $(".ui-loading-wrap").remove();
         var viewModel = {
            activityStatus: ko.observable(),
            startTime: ko.observable(),
            endTime: ko.observable(),
            bgPic: ko.observable(),
            groups: ko.observableArray([]),
            redPackets: ko.observableArray([]),
        }
        var div = document.getElementById("contain");
        ko.cleanNode(div);
        ko.applyBindings(viewModel, div);
        if (jdat.status == "100")
        {
            if (jdat.data)
            {
                if (jdat.data.bgColor != null && jdat.data.bgColor != "")
                {
                    $('body').css("background-color", jdat.data.bgColor);
                }
                if (jdat.data.groups!=null)
                {
                    for (var n in jdat.data.groups)
                    {
                        var price_before, price_after;
                        for (var x in jdat.data.groups[n].goods)
                        {
                            var price = jdat.data.groups[n].goods[x].price;
                            if (price.toString().indexOf('.') == -1)
                            {
                                price_before = price;
                                price_after = '00';
                            }
                            else
                            {
                                price_before = (jdat.data.groups[n].goods[x].price).toString().split('.')[0];
                                price_after = (jdat.data.groups[n].goods[x].price).toString().split('.')[1] ? (jdat.data.groups[n].goods[x].price).toString().split('.')[1] : "00";
                            }
                            jdat.data.groups[n].goods[x].price = price_before;
                            jdat.data.groups[n].goods[x].price_dec=price_after;
                        }
                    }

                    if (jdat.data.redPackets.length == 0)
                    {
                        $('.redBag').css('height', 0);
                        $('.redBag').css('padding', 0);
                    }
                }
                console.log(jdat.data.groups.goods);
                viewModel.redPackets(jdat.data.redPackets);
                viewModel.groups(jdat.data.groups);
                viewModel.bgPic(jdat.data.bgPic);
                viewModel.activityStatus(jdat.data.activityStatus);
                viewModel.startTime(jdat.data.activityBeginTime);
                viewModel.endTime(jdat.data.activityEndtime);
            }
        }
    }

    exports.init = function (template) {
       // category_ = category; version_ = version;
        $.get(template, function (result) {
            $("body").html(result);
            $("body").css('zoom', '0.8');
            $('body').find(".top").css('height', '180px');
            post("smPromotionAction!topicDetail.action" , {id: getVal("id")}, renderPage_call_back);

        });
    }

});