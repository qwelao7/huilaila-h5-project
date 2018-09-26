var rankDetail = [
    {
        title: "园区活跃率月排名",
        category: "activeRate",
        colums: ["全国排名", "分公司名", "数据"],
        colums1: ["全国排名", "项目名称",  "数据"],
        codes: ["ranking", "regionName", "data"],
        codes1: ["ranking", "communityName", "data"],
        codeid: ["regionId","regionName"],
        codeid1: ["communityId", "communityName"]
    },
    {
        title: "安装率月排名",
        category: "installRate",
        colums: ["全国排名", "分公司名", "数据"],
        colums1: ["全国排名", "项目名称", "数据"],
        codes: ["ranking", "regionName", "data"],
        codes1: ["ranking", "communityName", "data"],
        codeid: ["regionId", "regionName"],
        codeid1: ["communityId", "communityName"]
    },
    {
        title: "人均订单数排名",
        category: "assetOrder",
        colums: ["全国排名", "分公司名", "数据"],
        colums1: ["全国排名", "项目名称", "数据"],
        codes: ["ranking", "regionName", "data"],
        codes1: ["ranking", "communityName", "data"],
        codeid: ["regionId", "regionName"],
        codeid1: ["communityId", "communityName"]
    }]
var category_, companytype_, propertys_,app_,
    curPage =null, newOrder = getVal("newOrder") == "" ? 0 : getVal("newOrder");
var hasMore = null;

define(function (require, exports, module) {
    require("ko");
    require("frozencss");
    require("appcss");

    require("./js/iscroll-probe.js");
    require("./css/isrcoll.css");

   // var  category_,companytype_;
    var t1 = null;//这个设置为全局
    function renderPage_call_back(responseText) {
        var jdat = JSON.parse(responseText);
        var rankdetailPropertys = [];
        for (var idx in rankDetail) {
            var category = rankDetail[idx].category;
            if (category_.indexOf(category)!=-1) {//相同模块
                rankdetailPropertys = rankDetail[idx];
                break;
            }
        }
        propertys_ = rankdetailPropertys;
        console.log(rankdetailPropertys);
        var codes;
        var ranktemplateStr = "";
        codes = (companytype_ == "company") ? rankdetailPropertys.codes : rankdetailPropertys.codes1;
        codeid = (companytype_ == "company") ? rankdetailPropertys.codeid : rankdetailPropertys.codeid1;
        console.log(codeid);
        for (j = 0; j < codes.length; j++) {
            
            //标题模板
                if (j == codes.length - 1) {//最后一列不要竖线
                    ranktemplateStr += '<li class="ui-col ui-col-25 ui-flex-pack-center "><div class="ui-txt-justify" style="line-height:44px;height:44px;text-align:center;font-size:12px" data-bind="text:' + codes[j] + ',style:{color:changeValue>0 ? \'#00ae08\':\'#c6444c\'}"></div></li>';
                }
                else if (j == 0) {
                    ranktemplateStr += '<li class="ui-col ui-col-25 ui-flex-pack-center ui-border-r" data-bind="attr:{' + codeid[0] + ':' + codeid[0] +',' + codeid[1]+ ':' + codeid[1]+'}"><div style="width: 100%; height: 44px;  display: table;">' +
                        '<div class="li-div-txt" style="text-align:center;width:30%"><p class="ui-txt-justify" style="color:#334455;float:right;font-size:12px"data-bind="text:' + codes[j] + '"></p></div>' +
                        '<div class="li-div-txt" style="width:35%;padding-left:10px"> <p style="" data-bind="css:{\'arrow-up\':changeValue>0,\'arrow-down\':changeValue<0 }" ></p></div>' +
                        '<div class="li-div-txt" style="text-align:center;width:35%"><div data-bind="if:changeValue==0"> <p style="font-size:11px;float:left" class="arrow-level" ></p></div>' +
                        '<div data-bind="if:changeValue!=0"> <p style="font-size:11px;float:left" data-bind="text:changeValue,style:{color:changeValue>0?\'#00ae08\':\'#c6444c\'}"></p></div></div>' +
                        '</div></li>';
                }
                else {
                    ranktemplateStr += '<li class="ui-col ui-col-50  ui-flex-pack-center ui-border-r"><div class="ui-txt-justify" style="color:#334455;font-size:13px;line-height:44px;height:44px;text-align:center;text-decoration:underline" data-bind="text:' + codes[j] + ',attr"></div></li>';
                }

        }

            $("body").append('<script type="text/html" id="columns-ranktemplate">' + ranktemplateStr + '</script>');

        //    console.log(ranktemplateStr);
            //if (agent.indexOf("android") != -1) {
            //    UamaJSBridge._app_setTitle(rankdetailPropertys.title);
            //} else {
            //    app_.setDetailPage(0, rankdetailPropertys.title);
            //}
            app_.setDetailPage(4, rankdetailPropertys.title);
            koBind(jdat, companytype_, rankdetailPropertys);
    }


    function koBind(jdat, companytype, propertys) {
        var isPass = false;
        if (jdat.status == "100") {
            var viewModel = {
               // list: jdat.data.resultList,
                list: ko.observableArray(jdat.data.resultList),
                relist: ko.observableArray(),
                colums: (companytype == "company") ? propertys.colums : propertys.colums1,              
            }

            var div = document.getElementById('contain');
            //alert(div);
            ko.cleanNode(div);
            ko.applyBindings(viewModel, div);

            //防止弹出键盘的，webview已经改变高度了，做的自适应
            $('body').css("overflow", "hidden");
            $('body').css("-webkit-touch-callout", "none");
            $('body').css("-webkit-user-select", "none");

            hasMore = jdat.data.hasMore;
            curPage = 2;
            if (jdat.data.hasMore == false) {
           
                $('.datalist .pullUp').html('<p>已全部加载完</p>');
            }
         
            //检索
            $('.ui-searchbar').click(function () {
                var clentHeight = document.documentElement.clientHeight;
                //$('body').height(clentHeight + 'px');
             //   $('body').css("overflow", "hidden");
                //$('.test').css("overflow", "hidden");
                $('#se').height('100%');
                $('#se').css("overflow-y", "auto");
                $('#se').show();
                $('.ui-icon-search').eq(0).hide();
                $('.ui-icon-search').eq(1).show();
                $('.ui-searchbar-wrap').addClass('focus');
                $('.ui-searchbar-input input').focus();
            });
            $('input').keyup(function () {
                var value = $('input').val();
                console.log(value);
                if (typeof value == "string") {
                    value = value.trim();
                }
                if (!!value) {
                    var apiId = (companytype == 'company') ? (propertys.category + 'Ranking') : propertys.category + 'MonthRanking';
                    var api = "wgAdminView2Action!" + apiId + ".action";
                    var searchdata = new Object();
                    console.log(postData);

                    for (var x in postData) {
                        searchdata[x] = postData[x];
                    }
                    searchdata.date = formatDate(new Date());
                    searchdata.order=getVal("newOrder") == "" ? 0 : getVal("newOrder")
                    if (companytype == "project") {
                        searchdata.communityName = value;
                        searchdata.pageSize = 100;
                        searchdata.curPage = 1;
                    }
                    else {
                        searchdata.regionName = value;
                        searchdata.pageSize = 100;
                        searchdata.curPage = 1;
                    }
                    searchdata.regionId = getVal("regionId") || undefined;
                    var reapi = api;
                    post(reapi, searchdata, searchRankResultBind, viewModel);
                }
                else {
                    viewModel.relist([]);
                }
            });
            $('.ui-icon-close').click(function () {
                $('.ui-searchbar-input input').val("");
                $('.ui-searchbar-wrap').removeClass('focus');
                // $("#result").empty();
                viewModel.relist([]);
            });
            $('.ui-searchbar-cancel').click(function () {
                $('#se').hide();
                $('.ui-searchbar-input input').val("");
                $('.ui-searchbar-wrap').removeClass('focus');
                viewModel.relist([]);
            });
            //跳转
            $(document).off("tap", '.datalist .list ul');
            //跳转
            $(document).on("tap", '.datalist .list ul', function () {
                    if (t1 == null) {
                        t1 = new Date().getTime();
                    } else {
                        var t2 = new Date().getTime();
                        if (t2 - t1 < 500) {
                            t1 = t2;
                            return;
                        } else {
                            t1 = t2;
                        }
                    }
                    var parentUrl = window.location.href.split('#')[1].split('?')[0];
                    if (companytype_ == "company") {
                        var regionid = $(this).find('li').eq(0).attr('regionId');
                        var regionname = encodeURIComponent($(this).find('li').eq(0).attr('regionName'));
                        window.location.href = "./index.html#/statistics/phase/home/branch?parentUrl=" + parentUrl + "&regionId=" + regionid + "&token=" + token + "&companyCode=" + companyCode+"&regionName="+regionname;
                    }
                    else if (companytype_ == "project") {
                        var communityid = $(this).find('li').eq(0).attr('communityId');
                        var communityname = encodeURIComponent($(this).find('li').eq(0).attr('communityName'));
                        window.location.href = "./index.html#/statistics/home/realtime?parentUrl=" + parentUrl + "&communityId=" + communityid + "&token=" + token + "&companyCode=" + companyCode+ "&communityName=" + communityname;
                    }
          
            });
           

            unLockSubmit();
            var rankScroll = null;
            rankScroll = new IScroll('.datalist', {
                 probeType: 3,
                 tap: true,
                 click: false,
                 preventDefaultException: {
                     tagName: /.*/
                 },
                 mouseWheel: true,
                 scrollbars: true,
                 fadeScrollbars: true,
                 interactiveScrollbars: false,
                 keyBindings: false,
                 deceleration: 0.0002,
                 preventDefault: true
                     // startY: (parseInt(offset) * (-1))
             });
            rankScroll.on('scroll', function () {
                 console.log("scroll" + this.y);
                 if (this.y <= (this.maxScrollY + 300) && !isLockSubmit()) {
                     lockSubmit();
                     isPass = !isPass;
                     if (hasMore) {
                         $('.datalist .pullUp').addClass('ui-loading-wrap').html('<p>加载中...</p><i class="ui-loading"></i>');
                     }
                 }
             });
            rankScroll.on('scrollEnd', function () {
                 console.log("scrollEnd");
                 if (!!isPass) {
                     console.log(this.y);
                     console.log(this.maxScrollY);
                     try {
                         if (hasMore) {
                             console.log(category_);
                            
                             rankLoadMore(curPage, category_, "ui-whitespace", undefined, viewModel, function () {
                                 rankScroll.refresh();
                                 isPass = false;
                                 // $('.pullUp').removeClass('loading').html('');
                             });
                         }

                     } catch (ex) {
                         unLockSubmit();
                     } finally {
                         return false; //防止冒泡
                     }
                 }
             });
            


            //////下拉
            //$('.test').scroll(function () {
            //   var clientHeight = $('.test').height();
            //   var offsetHeight = $('.list').get(0).offsetHeight;
            //   //  var scrollTop = $('#' + param.id + ' .comlist .ui-whitespace ul').scrollTop();
            //   var scrollTop = $(this).scrollTop();
            //   console.log("高度scrollTop" + scrollTop);
            //   console.log("高度clientHeight" + clientHeight);
            //   console.log("高度offsetHeight" + offsetHeight);
            //   if (0 < scrollTop && scrollTop < (offsetHeight - clientHeight)) {
            //       var value = $('#contain input').val();
            //       unLockSubmit();
            //       console.log("锁定值1：" + _g_submit_lock);
            //       if (offsetHeight - clientHeight - scrollTop <= 50) {
            //           try {
            //               if (isLockSubmit()) {
            //                   console.log("锁定值2：" + _g_submit_lock);
            //                   return false;
            //               }

            //               lockSubmit();
            //               if (hasMore) {
            //                   loadMore(curPage, category_, "result", undefined, viewModel);
            //               }
            //               console.log("锁定值3：" + _g_submit_lock);
            //           } catch (ex) { }
            //           finally {
            //               unLockSubmit();
            //               return false;//防止冒泡
            //           }
            //       }
            //   }
            //});
        }
        else {
            errorPage();
        }
    }

    exports.init = function (ranktemplate,companytype, category,app) {
        category_ = category; companytype_ = companytype; app_ = app;
        //  var ranktemplate = "./statistics/phase2/template/rank/rank.html";
       
        $.get(ranktemplate, function (result) {
            $('#contain').html(result);
            var api = "wgAdminView2Action!" + category + ".action?token="+token+"&companyCode="+companyCode;
            var rankdetaildata = new Object();
            for (var x in postData)
            {
                rankdetaildata[x] = postData[x];
            }
            rankdetaildata.pageSize = 20;
            rankdetaildata.curPage = 1;
            rankdetaildata.date = formatDate(new Date());
            rankdetaildata.order = getVal("newOrder") == "" ? 0 : getVal("newOrder");
            if (getVal("regionId") != "") {
                rankdetaildata.regionId = getVal("regionId");
            }
            post(api, rankdetaildata, renderPage_call_back);
        });
    }
});




//分页
function rankLoadMore(curPage1, actionid, dom, value, viewModel,cb) {
   //  alert("上啦加载");
    console.log("curPage1:" + curPage1);
    var api = "wgAdminView2Action!" + actionid + ".action?sign=9c19d8b9dfab1d41a99bc54dced3a9795dd033c8&fieds=version&version=2";
    console.log(_HOME + api);
    var list = viewModel.list;
    var scrolldata = new Object();
    scrolldata = {
        token: token,
        companyCode: companyCode,
        curPage: curPage1,
        pageSize: 20,
        date: formatDate(new Date()),
        order: getVal("newOrder") == "" ? 0 : getVal("newOrder")

    };
    if (value != undefined) {
        if (actionid == "project") {
            scrolldata.communityName = value;
        }
        else {
            scrolldata.regionName = value;
        }
    }

    console.log(scrolldata);
    if (getVal("regionId") != "") {
        scrolldata.regionId = getVal("regionId");
    }
    var obj; var curP;
    //lockSubmit();
    console.log("锁定值5：" + _g_submit_lock);
    var req = $.ajax({
        type: "post", url: _HOME + api,
        async: false,
        cache: false,
        data: scrolldata,
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "text",
        success: function (msg) {

            var jdat = JSON.parse(msg);
            console.log(jdat.status);
            if (jdat.status == "100") {
                hasMore = jdat.data.hasMore;
                if (jdat.data.resultList.length > 0) {
                    var json = jdat.data.resultList;
                    for (var i = 0, l = json.length; i < l; i++) {
                        list.push(json[i]);
                    }
                    

                    if (jdat.data.hasMore == false) {
                        $(".datalist .pullUp").html('<p>已全部加载完</p>');
                        lockSubmit();
                    }
                    else {
                        unLockSubmit();
                    }
                    curP = jdat.data.curPage;
                    console.log("11:" + curP);
                    curPage = curP + 1;
                    console.log("22:" + curPage);
                    cb();
                }
                else {
                    $(".datalist .pullUp").html('<p>已全部加载完</p>');
                    lockSubmit();
                }

            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert("获取数据接口失败！"+errorThrown);
        }
    });
    console.log("锁定值4：" + _g_submit_lock);
}

function searchRankResultBind(msg, viewModel) {
    var jdat = JSON.parse(msg);
    relist = viewModel.relist;
    if (jdat.status == "100") {
        if (jdat.data.resultList.length > 0) {       
            var relist_ = relist();
            var json = jdat.data.resultList;
            relist(json);

            $("#result ul").on("click", function () {
                    var parentUrl = window.location.href.split('#')[1].split('?')[0];
                    if (companytype_ == "company") {
                        var regionid = $(this).find('li').eq(0).attr('regionId');
                        var regionname = encodeURIComponent($(this).find('li').eq(0).attr('regionName'));
                        window.location.href = "./index.html#/statistics/phase/home/branch?parentUrl=" + parentUrl + "&regionId=" + regionid + "&token=" + token + "&companyCode=" + companyCode + "&regionName=" + regionname;
                    }
                    else if (companytype_ == "project") {
                        var communityid = $(this).find('li').eq(0).attr('communityid');
                        var communityname = encodeURIComponent($(this).find('li').eq(0).attr('communityname'));
                        window.location.href = "./index.html#/statistics/home/realtime?parentUrl=" + parentUrl + "&communityId=" + communityid + "&token=" + token + "&companyCode=" + companyCode + "&communityName=" + communityname;
                    }
            });
            $('#se').scroll(function () {
                var clientHeight = $('#se').height();
                var offsetHeight = $('.list').get(0).offsetHeight;
                var scrollTop = $(this).scrollTop();
                console.log("高度scrollTop" + scrollTop);
                console.log("高度clientHeight" + clientHeight);
                console.log("高度offsetHeight" + offsetHeight);
                if (0 < scrollTop && scrollTop < (offsetHeight - clientHeight)) {
                    var value = $('#contain input').val();
                    unLockSubmit();
                    console.log("锁定值1：" + _g_submit_lock);
                    if (offsetHeight - clientHeight - scrollTop <= 50) {
                        try {
                            if (isLockSubmit()) {
                                console.log("锁定值2：" + _g_submit_lock);
                                return false;
                            }

                            lockSubmit();

                            loadMore(curPage, category_, "result", value, viewModel);
                            console.log("锁定值3：" + _g_submit_lock);
                        } catch (ex) { }
                        finally {
                            unLockSubmit();
                            return false;//防止冒泡
                        }
                    }
                }
            });
        }
        else {
            //查询无结果
            relist([]);
        }
    }
    else {
        errorPage();
    }
}


//跳转
function locationUrl(companytype, regionid, communityid) {
    var parentUrl = window.location.href.split('#')[1].split('?')[0];
    if (companytype == "company") {
        window.location.href = "./index.html#/statistics/phase/home/branch?parentUrl=" + parentUrl +
                                                                    "&regionId=" + regionid +
                                                                    "&token=" + token +
                                                                    "&companyCode=" + companyCode;
    }
    else if (companytype == "project") {
        window.location.href = "./index.html#/statistics/home/realtime?parentUrl=" + parentUrl +
                                                                     "&communityId=" + communityid +
                                                                     "&token=" + token +
                                                                     "&companyCode=" + companyCode;
    }
}