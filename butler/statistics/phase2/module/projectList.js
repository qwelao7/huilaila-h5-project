var id_, navcategory_;
var curPage_P = null;
var hasMore_P = null;
var ajaxFlag=null;
define(function(require, exports, module) {
    require("./../../../js/iscroll-probe.js");
    require("./../../../css/isrcoll.css");
    var t1_P = null;//这个设置为全局

    function koBind(msg, param) {
        var jdat = JSON.parse(msg);
        var isPass_P = false;

        if (jdat.status == "100") {
            var viewModel = {
                list: ko.observableArray(jdat.data.resultList),
                relist: ko.observableArray(),

            }
            var div = document.getElementById('projectList');
            ko.cleanNode(div);
            ko.applyBindings(viewModel, div);

            console.log(div);
            var clentHeight = document.documentElement.clientHeight;
            $('#projectList .comlist .ui-whitespace').height(clentHeight - 60 + 'px');
            $('#projectList .comlist .ui-whitespace').css("overflow", "hidden");
    
            hasMore_P = jdat.data.hasMore;
            curPage_P = 2;
            if (jdat.data.hasMore == true) {
               
            } else {
                $('#projectList .pullUp').addClass('loading').html('<span class="pullUpLabel">没有更多了</span>');
            }
            //检索
            $('#projectList .ui-searchbar').click(function() {
                
                //$('#projectList').height(clentHeight + 'px');
              
                $('#projectList .comlist .search').addClass('ui-whitespace');
                $('#projectList .comlist .search').css('overflow','auto');
                $('#projectList .ui-searchbar-wrap').css("z-index","99999");
                $('#projectList #se').height(clentHeight-90 + 'px');
                $('#projectList #se').css("overflow-y", "hidden");
                $('#projectList #se').show();
                $('#projectList .ui-icon-search').eq(0).hide();
                $('#projectList .ui-icon-search').eq(1).show();
                $('#projectList .ui-searchbar-wrap').addClass('focus');
                $('#projectList .ui-searchbar-input input').focus();
            });
            $('#projectList input').keyup(function() {
                var slideId = param.id;
                var value = $('#projectList input').val();
                console.log(value);
                if (typeof value == "string") {
                    value = value.trim();
                }
                if (!!value) {
                    var api = "wgAdminView2Action!" + slideId + ".action";
                    var searchdata = new Object();
                    console.log(postData);
                    console.log(searchdata);
                    for (var x in postData) {
                        searchdata[x] = postData[x];
                    }
                  
                    searchdata.communityName = value;
                    searchdata.pageSize = 100;
                    searchdata.curPage = 1;
                  
                    searchdata.regionId = getVal("regionId") || undefined;
                    var reapi = api;
                    post(reapi, searchdata, searchResultBind, viewModel);
                }
            });
            $('#projectList .ui-icon-close').click(function() {
                $('#projectList .ui-searchbar-input input').val("");
                $('#projectList .ui-searchbar-wrap').removeClass('focus');
                viewModel.relist([]);
            });
            $('#projectList .ui-searchbar-cancel').click(function() {
                $('#projectList #se').hide();
                $('#projectList .ui-searchbar-input input').val("");
                $('#projectList .ui-searchbar-wrap').removeClass('focus');
                viewModel.relist([]);
            });

            $(document).off("tap", '#projectList .list li');
            //跳转
            $(document).on("tap", '#projectList .list li', function () {
                    if (t1_P == null) {
                        t1_P = new Date().getTime();
                    } else {
                        var t2_P = new Date().getTime();
                        if (t2_P - t1_P < 500) {
                            t1_P = t2_P;
                            return;
                        } else {
                            t1_P = t2_P;
                        }
                    }
                    var parentUrl = window.location.href.split('#')[1].split('?')[0];
                    var communityid = $(this).find('p').attr('communityid');
                    var communityname = encodeURIComponent($(this).find('p').eq(0).html());
                    window.location.href = "./index.html#/statistics/home/realtime?parentUrl=" + parentUrl +
                        "&communityId=" + communityid +
                        "&token=" + token +
                        "&companyCode=" + companyCode +
                        "&communityName=" + communityname;

            });
            
         

            var count_p = 0;
            ajaxFlag= false;
            var myScroll=null;
            var initScroll = function () {
                intervalTime = setInterval(function () {
                    if(count_p == 10){
                        clearInterval(intervalTime);
                    }
                    var resultContentH = $("#projectList").height();
                    console.log(resultContentH);
                    if (resultContentH > 155) {
                       
                            clearInterval(intervalTime);
                            myScroll = !myScroll?new IScroll('#projectList .wrapper', {
                                probeType:3,
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
                                preventDefault: true,
                                preventGhostClick: false, // prevent ghost clicks?防止2次点击
                                ghostClickTimeout: 500,   // timeout for ghost click prevention设置时间差
                                // startY: (parseInt(offset) * (-1))
                            }) : myScroll;
                            myScroll.on('scroll', function () {
                                console.log(this.y);
                            
                                if (this.y <= (this.maxScrollY + 300) && !ajaxFlag) {              
                                    ajaxFlag = true;
                                    isPass_P = !isPass_P;
                                }
                            });
                            myScroll.on('scrollEnd', function () {
                                console.log("scrollEnd");
                               
                                if (!!isPass_P) {
                                    console.log(this.y);
                                    console.log(this.maxScrollY);
                                    try {
                                        if (hasMore_P) {
                                            $('#projectList .pullUp').addClass('ui-loading-wrap').html('<p>加载中...</p><i class="ui-loading"></i>');
                                            //  lockSubmit();
                                            console.log($('#projectList .pullUp'));
                                            loadMore(curPage_P, "projectList", "ui-whitespace", undefined, viewModel, function () {
                                                myScroll.refresh();
                                                isPass_P = false;
                                              
                                            });
                                        }

                                    } catch (ex) {
                                      //  unLockSubmit();
                                        ajaxFlag = false;
                                    } finally {
                                        return false; //防止冒泡
                                    }
                                }


                            });
                    }
                    count_p++;
                }, 200);
            }
            initScroll();
            //下拉
            //$('#projectList .ui-whitespace').scroll(function () {
            //    if (jdat.data.hasMore == true) {
            //        console.log("锁定值1：" + _g_submit_lock);

            //        var clientHeight = $('#projectList .comlist .ui-whitespace').height();
            //        var offsetHeight = $('#projectList .comlist .ui-whitespace').find('ul').eq(0).get(0).offsetHeight;
            //        //  var scrollTop = $('#projectList .comlist .ui-whitespace ul').scrollTop();
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
    //查询绑定
    function searchResultBind(msg, viewModel) {
        var jdat = JSON.parse(msg);
        relist = viewModel.relist;
        if (jdat.status == "100") {
            if (jdat.data.resultList.length > 0) {
                var relist_ = relist();
                var json = jdat.data.resultList;
                relist(json);
             
                //查询跳转
                $('#projectList .result li').each(function () {
                    $(this).bind("click", function () {
                        var parentUrl = window.location.href.split('#')[1].split('?')[0];

                        var communityid = $(this).find('p').eq(0).attr('communityid');
                        var communityname = encodeURIComponent($(this).find('p').eq(0).html());
                        window.location.href = "./index.html#/statistics/home/realtime?parentUrl=" + parentUrl +
                            "&communityId=" + communityid +
                            "&token=" + token +
                            "&companyCode=" + companyCode +
                            "&communityName=" + communityname;

                    });
                });

                $('#projectList .search-lay').scroll(function () {
                    var scrollTop = $(this).scrollTop();
                    console.log("高度" + scrollTop);
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
        var api = "wgAdminView2Action!projectList.action";

        var jsondata = new Object();
        //console.log(jsondata);
        //jsondata.token = postData.token;
        //jsondata.companyCode = postData.companyCode;
        console.log(postData);
        for (var x in postData)
        {
            jsondata[x] = postData[x];
        }
        jsondata.pageSize = 20;
        jsondata.curPage = 1;
        if (category == "branch") {
            if (getVal("regionId") != "") {
                jsondata.regionId = getVal("regionId");
            }
        }
        $.get(template, function(result) {
            $('#' + id).html(result);
             post(api, jsondata, koBind, funParam[0]);
        });
    }

});


//分页
function loadMore(curPage1, actionid, resultdom, value, viewModel, cb) {
    // alert("上啦加载");
    console.log("curPage1:" + curPage1);
    console.log("锁定值11：" + ajaxFlag);
    var api = "wgAdminView2Action!" + actionid + ".action?sign=9c19d8b9dfab1d41a99bc54dced3a9795dd033c8&fieds=version&version=2";

    var list = viewModel.list;
    var scrollData = {
        token: token,
        companyCode: companyCode,
        curPage: curPage1,
        pageSize: 20,
    };
    if (value != undefined) {
     
       scrollData.communityName = value;
       
    }
    if (getVal("regionId") != "") {
        scrollData.regionId = getVal("regionId");
    }
    var obj;
    var curP;
    //lockSubmit();
    console.log("锁定值5：" + ajaxFlag);
    var req = $.ajax({
        type: "post",
        url: _HOME + api,
        async: false,
        cache: false,
        data: scrollData,
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "text",
        success: function(msg) {

            var jdat = JSON.parse(msg);
            console.log(jdat.status);
            if (jdat.status == "100") {
                hasMore_P = jdat.data.hasMore;
              //  console.log("hasMore" + hasMore);
                if (jdat.data.resultList.length > 0) {
                    var json = jdat.data.resultList;
                    //   list = list

                    for (var i = 0, l = json.length; i < l; i++) {
                        list.push(json[i]);
                    }
                    ////给新加载的数据 绑定跳转
                    //$('#projectList .list li').each(function () {
                    //    $(this).bind("click", function () {
                    //        var parentUrl = window.location.href.split('#')[1].split('?')[0];

                    //        var communityid = $(this).find('p').attr('communityid');
                    //        var communityname = encodeURIComponent($(this).find('p').attr('communityname'));
                    //        window.location.href = "./index.html#/statistics/home/realtime?parentUrl=" + parentUrl +
                    //            "&communityId=" + communityid +
                    //            "&token=" + token +
                    //            "&companyCode=" + companyCode +
                    //            "&communityName=" + communityname;

                    //    });
                    //});

                    if (jdat.data.hasMore == false) {
                        $('#projectList .pullUp').html('<span class="pullUpLabel">已全部加载完</span>');
                      //  lockSubmit();
                        ajaxFlag = true;
                    } else {
                      //  unLockSubmit();
                        ajaxFlag = false;
                    }
                    curP = jdat.data.curPage;
                    console.log("11:" + curP);
                    curPage_P = curP + 1;
                    console.log("22:" + curPage_P);
                 
                    cb();
                } else {
                    $('#projectList .pullUp').html('<span class="pullUpLabel">已全部加载完</span>');
                   // lockSubmit();
                    ajaxFlag = true;
                }

            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //alert("获取数据接口失败！"+errorThrown);
        }
    });
    console.log("锁定值4：" + ajaxFlag);
}


