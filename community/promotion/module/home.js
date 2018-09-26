
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


                //设置title
                if (window.WebViewJavascriptBridge)
                {
                    window.WebViewJavascriptBridge.callHandler('_app_setTitle', jdat.data.name);
                }

                if (jdat.data.bgColor != null && jdat.data.bgColor != "")
                {
                    $('body').css("background-color", jdat.data.bgColor);
                }
                if (jdat.data.redPackets.length > 0)
                {
                    $('.redBag').show();

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
                   
                }
                console.log(jdat.data.redPackets);
                viewModel.redPackets(jdat.data.redPackets);
                viewModel.groups(jdat.data.groups);
                viewModel.bgPic(jdat.data.bgPic);
                viewModel.activityStatus(jdat.data.activityStatus);
                viewModel.startTime(jdat.data.activityBegintime);
                viewModel.endTime(jdat.data.activityEndtime);

                //红包点击事件
                $('.redBag li').bind(_CLICK_MODEL, function ()
                {
                    var rid = $(this).attr("rid");
                    var redData = new Object();
                    for (var x in postData)
                    {
                        redData[x] = postData[x];
                    }
                    redData.topicId = getVal("id");
                    redData.topicRedPacketId = rid;
                    // redData.sign = "9c19d8b9dfab1d41a99bc54dced3a9795dd033c8";
                    // redData.fieds = "version";
                    // redData.version = "2";
                    newPost("promotion/haveGetRedpacket",redData,haveGetRedpacket,redData);
                });
                function haveGetRedpacket(msg,data)
                {
                    var jdat = JSON.parse(msg);
                    if (jdat.status == "100")
                    {
                        if (jdat.data == 1)
                        {
                            alert("您已经领过该红包了");
                        }
                        else if (jdat.data == 0)
                        {
                            newPost("promotion/getRedpacket",data,getRedpacket);
                        }
                        else if (jdat.data == 2)
                        {
                            alert("手慢了,红包被已经领完了！");
                        }
                    }
                }

                function getRedpacket(msg)
                {
                    var jdat = JSON.parse(msg);
                    if (jdat.status == "100")
                    {
                        if (jdat.data == 0)
                        {
                            alert("领取成功");
                        }
                        else
                        {
                            alert("领取不成功");
                        }
                    }
                }

                $('.ui-halve li').bind(_CLICK_MODEL, function ()
                {
                   

                    if (window.WebViewJavascriptBridge)
                    { 
                          window.WebViewJavascriptBridge.callHandler('_app_getGoodsDetail', $(this).attr("id") );
                    }
                   
                });
            }
        }
    }

    exports.init = function (template) {
       // category_ = category; version_ = version;
        $.get(template, function (result) {
            $("body").html(result);
            $("body").append(
              '<script>' +
                 ' var WVJBIframe = document.createElement(\'iframe\');' +
                 ' WVJBIframe.style.display = \'none\';' +
                 ' WVJBIframe.src = \'wvjbscheme:/' +
                 '/__BRIDGE_LOADED__\';' +
                 ' document.documentElement.appendChild(WVJBIframe);' +
              '</script>');
            var pomotionData = new Object();
            for (var x in postData)
            {
                pomotionData[x] = postData[x];
            }
            pomotionData.id = getVal("id");
            pomotionData.sign = "9c19d8b9dfab1d41a99bc54dced3a9795dd033c8";
            pomotionData.fieds = "version";
            pomotionData.version = "2";
            pomotionData.storeIds = getVal("storeIds");
            newPost("promotion/getTopicDetail", pomotionData, renderPage_call_back);

        });
    }

});