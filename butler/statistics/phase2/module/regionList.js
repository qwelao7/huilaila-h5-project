var id_, navcategory_;
var curPage = null;
var hasMore = null;
define(function(require, exports, module) {

    require("./../../../js/iscroll-probe.js");
    require("./../../../css/isrcoll.css");

    var t1_R = null;//这个设置为全局
    function koBind(msg, param) {
        var jdat = JSON.parse(msg);
        var isPass = false;
        unLockSubmit();
        //var viewModel = {
        //    list: ko.observableArray([]),
        //    relist: ko.observableArray(),
        //}

        if (jdat.status == "100") {
            var viewModel = {
                list: ko.observableArray(jdat.data.resultList),
                relist: ko.observableArray(),
            }
            var div = document.getElementById(param.id);
            ko.cleanNode(div);
            ko.applyBindings(viewModel, div);


            var clentHeight = document.documentElement.clientHeight;
            $('#regionList .comlist .ui-whitespace').height(clentHeight - 60 + 'px');
            $('#regionList .comlist .ui-whitespace').css("overflow", "hidden");

            hasMore = jdat.data.hasMore;
            curPage = 2;
            if (jdat.data.hasMore == true) {
               
              //  $('#regionList .pullUp').addClass('loading').html('<span class="pullUpIcon" style="margin:0 auto;">&nbsp;</span><span class="pullUpLabel">Loading...</span>');
            } else {
                $('#regionList .pullUp').html('<span class="pullUpLabel">没有更多了</span>');
            }
            //检索
            $('#regionList .ui-searchbar').click(function() {

                $('#regionList .comlist .search').addClass('ui-whitespace');
                $('#regionList .comlist .search').css('overflow', 'auto');
                $('#regionList .ui-searchbar-wrap').css("z-index", "99999");
                $('#regionList #se').height(clentHeight-90 + 'px');
                $('#regionList #se').css("overflow-y", "hidden");
                $('#regionList #se').show();
                $('#regionList .ui-icon-search').eq(0).hide();
                $('#regionList .ui-icon-search').eq(1).show();
                $('#regionList .ui-searchbar-wrap').addClass('focus');
                $('#regionList .ui-searchbar-input input').focus();
            });
            $('#regionList input').keyup(function() {
                var slideId = "regionList";
                var value = $('#regionList input').val();
                console.log(value);
                if (typeof value == "string") {
                    value = value.trim();
                }
                if (!!value) {
                    var api = "wgAdminView2Action!regionList.action";
                    var searchdata = new Object();
                    console.log(postData);
                    console.log(searchdata);
                    for (var x in postData) {
                        searchdata[x] = postData[x];
                    }              
                    searchdata.regionName = value;
                    searchdata.pageSize = 100;
                    searchdata.curPage = 1;
                    
                    var reapi = api;
                    post(reapi, searchdata, searchRegionBind, viewModel);
                }
            });
            $('#regionList .ui-icon-close').click(function() {
                $('#regionList .ui-searchbar-input input').val("");
                $('#regionList .ui-searchbar-wrap').removeClass('focus');
                viewModel.relist([]);
            });
            $('#regionList .ui-searchbar-cancel').click(function() {
                $('#regionList #se').hide();
                $('#regionList .ui-searchbar-input input').val("");
                $('#regionList .ui-searchbar-wrap').removeClass('focus');
                viewModel.relist([]);
            });

            $(document).off("tap", '#regionList .list li');
            //跳转
            $(document).on("tap", '#regionList .list li', function () {
                if (t1_R == null) {
                    t1_R = new Date().getTime();
                } else {
                    var t2_R = new Date().getTime();
                    if (t2_R - t1_R < 500) {
                        t1_R = t2_R;
                        return;
                    } else {
                        t1_R = t2_R;
                    }
                }
                console.log(this);
             
                var parentUrl = window.location.href.split('#')[1].split('?')[0];
                if (param.id == "regionList") {
                    var regionid = $(this).find('p').attr('regionid');
                    var regionname = encodeURIComponent($(this).find('p').eq(0).html());
                    window.location.href = "./index.html#/statistics/phase/home/branch?parentUrl=" + parentUrl +
                        "&regionId=" + regionid +
                        "&token=" + token +
                        "&companyCode=" + companyCode +
                        "&regionName=" + regionname;
                } else if (param.id == "projectList") {
                    var communityid = $(this).find('p').attr('communityid');
                    var communityname = encodeURIComponent($(this).find('p').eq(0).html());
                    window.location.href = "./index.html#/statistics/home/realtime?parentUrl=" + parentUrl +
                        "&communityId=" + communityid +
                        "&token=" + token +
                        "&companyCode=" + companyCode +
                        "&communityName=" + communityname;
                }
               
            });
           
          
            var myScroll=null;

           
            var initReScroll = function () {
                intervalReTime = setInterval(function () {
                    var resultContentH = $("#regionList").height();
                    console.log(resultContentH);
                    if (resultContentH > 155) {
                    
                            clearInterval(intervalReTime);
                            myScroll = !myScroll?new IScroll('#regionList .wrapper', {
                                probeType:3,
                                tap: true,
                                click: false,
                                preventDefaultException: {
                                    tagName: /.*/
                                },
                                mouseWheel: true,
                                scrollbars: true,
                                fadeScrollbars: false,
                                interactiveScrollbars: false,
                                keyBindings: false,
                                deceleration: 0.0002,
                                preventDefault: true,
                                preventGhostClick: false, // prevent ghost clicks?防止2次点击

                                ghostClickTimeout: 500,   // timeout for ghost click prevention设置时间差
                                
                            }) : myScroll;
                            myScroll.on('scroll', function () {
                                console.log(this.y); console.log(unLockSubmit());
                                console.log(isLockSubmit());
                                if (this.y <= (this.maxScrollY + 300) && !isLockSubmit()) {
                                    lockSubmit();
                                    isPass = !isPass;
                                                                
                                }
                            });
                            myScroll.on('scrollEnd', function () {
                                console.log("scrollEnd");
                                console.log("isPass" + isPass);
                                if (!!isPass) {
                                    console.log(this.y);
                                    console.log(this.maxScrollY);
                                    try {
                                        console.log(hasMore);
                                        if (hasMore) {
                                            $('#regionList .pullUp').addClass('ui-loading-wrap').html('<p>加载中...</p><i class="ui-loading"></i>');
                                            regionMore(curPage, "regionList", "ui-whitespace", undefined, viewModel, function () {
                                                myScroll.refresh();
                                                isPass = false;
                                               
                                            });
                                        }

                                    } catch (ex) {
                                        unLockSubmit();
                                    } finally {
                                        return false; //防止冒泡
                                    }
                                }
                            });
                    }
                }, 200);
            }
            initReScroll();

     

            //下拉
            //$('#regionList .ui-whitespace').scroll(function () {
            //    if (jdat.data.hasMore == true) {
            //        console.log("锁定值1：" + _g_submit_lock);

            //        var clientHeight = $('#regionList .comlist .ui-whitespace').height();
            //        var offsetHeight = $('#regionList .comlist .ui-whitespace').find('ul').eq(0).get(0).offsetHeight;
            //        //  var scrollTop = $('#regionList .comlist .ui-whitespace ul').scrollTop();
            //        var scrollTop = $(this).scrollTop();
            //        console.log("高度" + scrollTop);
            //        console.log("高度" + clientHeight);
            //        console.log("高度" + offsetHeight);
            //        if (0 < scrollTop && scrollTop < (offsetHeight - clientHeight)) {
            //            //   if ($(document).height() - $(this).scrollTop() - $(this).height() - 44 < 60) {
            //            if (offsetHeight - clientHeight - scrollTop <= 50) {
            //                try {

            //                    if (isLockSubmit()) {
            //                        console.log("锁定值2：" + _g_submit_lock);
            //                        return false;
            //                    }

            //                    lockSubmit();//锁定

            //                    loadMore(curPage, param.id, "ui-whitespace", undefined, viewModel);
            //                    console.log("锁定值3：" + _g_submit_lock);
            //                } catch (ex) { }
            //                finally {
            //                    unLockSubmit();//解锁
            //                    return false;//防止冒泡
            //                }
            //            }
            //        }
            //    }

            //});


        }
        else {
            errorPage();
        }
    }

   // 查询绑定
    function searchRegionBind(msg, viewModel) {
        var jdat = JSON.parse(msg);
        relist = viewModel.relist;
        if (jdat.status == "100") {
            if (jdat.data.resultList.length > 0) {

                var relist_ = relist();
                var json = jdat.data.resultList;
                relist(json);

                //查询跳转
                $('#regionList .result li').each(function () {
                    $(this).bind("click", function () {
                        var parentUrl = window.location.href.split('#')[1].split('?')[0];
                        var regionid = $(this).find('p').eq(0).attr('regionid');
                        var regionname = encodeURIComponent($(this).find('p').eq(0).html());
                        window.location.href = "./index.html#/statistics/phase/home/branch?parentUrl=" + parentUrl +
                            "&regionId=" + regionid +
                            "&token=" + token +
                            "&companyCode=" + companyCode +
                            "&regionName=" + regionname;

                    });
                });
             
            } else {
                //查询无结果
                viewModel.relist([]);
            }
        } else {
            errorPage();
        }
    }

    exports.init = function(template, id, category) {
        var funParam = [];
        funParam.push({
            id: id,
            category: category
        });
        var api = "wgAdminView2Action!" + id + ".action";

        var jsondata = new Object();
        //console.log(jsondata);
        //jsondata.token = postData.token;
        //jsondata.companyCode = postData.companyCode;
        for (var x in postData)
        {
            jsondata[x] = postData[x];
        }
        console.log(postData);
        jsondata.pageSize = 20;
        jsondata.curPage = 1;
        if (category == "branch") {
            if (getVal("regionId") != "") {
                jsondata.regionId = getVal("regionId");
            }
        }
        $.get(template, function(result) {
            $('#regionList').html(result);

            post(api, jsondata, koBind, funParam[0]);


        });
      
    }

});


//分页
function regionMore(curPage1, actionid, resultdom, value, viewModel, cb) {
   //  alert("上啦加载");
    console.log("curPage1:" + curPage1);
    console.log("锁定值11：" + _g_submit_lock);
    var api = "wgAdminView2Action!regionList.action?sign=9c19d8b9dfab1d41a99bc54dced3a9795dd033c8&fieds=version&version=2";

    var list = viewModel.list;
    var scrollData = {
        token: token,
        companyCode: companyCode,
        curPage: curPage1,
        pageSize: 20,
    };
    if (value != undefined) {

        scrollData.regionName = value;

    }
    var obj;
    var curP;
    //lockSubmit();
    console.log("锁定值5：" + _g_submit_lock);
    var req = $.ajax({
        type: "post",
        url: _HOME + api,
        async: false,
        cache: false,
        data: scrollData,
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "text",
        success: function (msg) {

            var jdat = JSON.parse(msg);
            console.log(jdat.status);
            if (jdat.status == "100") {

                hasMore = jdat.data.hasMore;
                console.log("hasMore" + hasMore);
                if (jdat.data.resultList.length > 0) {
                    var json = jdat.data.resultList;
                    //   list = list

                    for (var i = 0, l = json.length; i < l; i++) {
                        list.push(json[i]);
                    }

                    if (jdat.data.hasMore == false) {
                        $('#regionList .pullUp').html('<span class="pullUpLabel">已全部加载完</span>');
                        lockSubmit();
                    } else {
                        unLockSubmit();
                    }
                    curP = jdat.data.curPage;
                    console.log("11:" + curP);
                    curPage = curP + 1;
                    console.log("22:" + curPage);
                    cb();
                } else {
                    $('#regionList .pullUp').html('<span class="pullUpLabel">已全部加载完</span>');
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


