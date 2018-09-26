var termDetail = [
    {
        tab: "coverRateCompare",
        title:"覆盖率",
        fractions: ["注册户数", "入住户数"],
        fractionsCode: ["regUserCount", "liveCount"],
        chartTitle: "覆盖用户占比图:",
        chartColums: ["未注册户数","已注册户数"],
        chartCodes: ["unRegUserCountDraw", "regUserCountDraw"],
        chartType:"pie",
        clickStr: "点击查看月报表>>"
    },
    {
        tab: "activeRateCompare",
        fractions: ["本月园区活跃用户数", "注册用户数"],
        fractionsCode: ["activeUserCount", "liveUserCount"],
        chartColums: ["活跃数"],
        chartCodes: ["data"],
        //chartType: "bar",
        companyCode: "6",
        clickStr: "点击查看月报表>>"
    },
    {
        tab: "installRateCompare",
        fractions: ["注册用户数", "入住户数"],
        fractionsCode: ["regUserCount", "liveUserCount"],
        chartTitle: "最近六个月数据:",
        chartColums: ["安装率"],
        chartCodes: ["data"],
        compareCount: "6",
        clickStr: "点击查看月报表>>"
    },
    {
        tab: "orderCompare",
        fractions: ["本月订单数", "上月同期订单数"],
        fractionsCode: ["orderCount", "prevOrderCount"],
        chartTitle: "最近三个月同期比数据:",
        chartColums: ["订单数", "月同比"],
        chartCodes: ["dataDraw", "compareRate"],
        chartType: "bar",
        compareCount: "3",
        clickStr: "点击查看月环比报表>>"
    },
    {
        tab: "inceptOrderRateCompare",
        fractions: ["本月准时接单数", "本月总订单数"],
        fractionsCode: ["inceptOrderCount", "orderCount"],
        chartColums: ["接单率"],
        chartCodes: ["data"],
        compareCount: "6",
        clickStr: "点击查看月报表>>"
    },
    {
        tab: "serviceSpeedCompare",
        fractions: ["本月速度总得分", "本月服务订单评价数"],
        fractionsCode: ["serviceSpeed", "praiseOrderCount"],
        chartColums: ["服务速度"],
        chartCodes: ["dataDraw"],
        compareCount: "6",
        clickStr: "点击查看月报表>>"
    },
    {
        tab: "serviceQualityCompare",
        fractions: ["本月质量总得分", "本月服务订单评价数"],
        fractionsCode: ["serviceQuality", "praiseOrderCount"],
        chartColums: ["服务质量"],
        chartCodes: ["dataDraw"],
        compareCount: "6",
        clickStr: "点击查看月报表>>"
    },
    {
        tab: "assetOrderCompare",
        fractions: ["本月订单数", "注册用户数"],
        fractionsCode: ["orderCount", "regUserCount"],
        chartColums: ["人均订单数"],
        chartCodes: ["dataDraw"],
        compareCount: "6",
        clickStr: "点击查看月报表>>"
    },
    {
        tab: "visitorCompare",
        fractions: ["本月访客数", "上月同期"],
        fractionsCode: ["visitorCount", "prevVisitorCount"],
        chartTitle: "最近三个月同期比数据:",
        chartColums: ["访客数", "月同比"],
        chartCodes: ["dataDraw", "compareRate"],
        chartType: "bar",
        compareCount: "3",
        clickStr: "点击查看月环比报表>>"
    },
    {
        tab: "qrcodeCompare",
        fractions: ["本月二维码访客数", "本月访客总数"],
        fractionsCode: ["qrcodeUseCount", "visitorCount"],
        chartColums: ["二维码使用率"],
        chartCodes: ["data"],
        compareCount: "6",
        clickStr: "点击查看月报表>>"
    },
    {
        tab: "expressReceiveCompare",
        fractions: ["全年快递领取总量", "全年接收快递总量"],
        fractionsCode: ["expressReceiveCount", "expressCount"],
        chartTitle: "已领取快递占比图:",
        chartColums: ["未领取量", "已领取量"],
        chartCodes: ["unReceiveCountDraw", "expressReceiveCountDraw"],
        chartType: "pie",
        clickStr: "点击查看月报表>>"
    },
    {
        tab: "sweepCodeCompare",
        fractions: ["本月扫码领取快递量", "本月领取的所有快递量"],
        fractionsCode: ["qrcodeGetCount", "expressCount"],
        chartColums: ["扫码领取率"],
        chartCodes: ["data"],
        compareCount: "6",
        clickStr: "点击查看月报表>>"
    },
    {
        tab: "carSubmitCompare",
        fractions: ["本月登记量", "上月同期登记"],
        fractionsCode: ["carSubmitCount", "prevCarSubmitCount"],
        chartTitle: "最近三个月同期比数据:",
        chartColums: ["登记量", "月同比"],
        chartCodes: ["dataDraw", "compareRate"],
        chartType: "bar",
        compareCount: "3",
        clickStr: "点击查看月环比报表>>"
    },
    {
        tab: "carSubmitInfo",
        chartTitle: "最近一周数据",
        fractionsCode: "todayCarCount",
        chartColums: ["新增车辆"],
        chartCodes: ["submitCountDraw"],
        clickStr: "点击查看日报表>>"
    },

];

define(function (require, exports, module) {


    function renderPage_call_back(responseText, param) {
        var jdat = JSON.parse(responseText);
        if (jdat.status == "100") {
            var termPropertys = [];
            for (var idx in termDetail) {
                var tab = termDetail[idx].tab;
                if (tab == param.id) {//相同模块
                    termPropertys = termDetail[idx];
                    break;
                }
            }
            if (jdat.data == null || jdat.data == undefined) {
                $('#' + param.id).find('div').eq(0).show();
            }
            else if (jdat.data.syncData != undefined) {
                if (jdat.data.syncData.length == 0) {
                    $('#' + param.id).find('div').eq(0).show();
                }
            }
            else if (jdat.data.dataList != undefined) {
                if (jdat.data.dataList.length == 0) {
                    $('#' + param.id).find('div').eq(0).show();
                }
            }

            //公式模版
            var fractionsTemplate = '';
            if (termPropertys.fractions != undefined) {
                fractionsTemplate = '<div style="width: 35%; height: 90px;  display: table;">' +
                        '<div class="li-div-txt" style="width:70%">' +
                           '<b data-bind="text:fractionsData.compareRate,css:{\'level\':fractionsData.changeData==0,\'up\':fractionsData.changeData>0,\'down\':fractionsData.changeData<0 }"></b>' +
                        '</div>' +
                        '<div class="li-div-txt" >' +
                          '<p style="float:left;" data-bind="css:{\'arrow-level\':fractionsData.changeData==0,\'arrow-up\':fractionsData.changeData>0,\'arrow-down\':fractionsData.changeData<0 }" ></p>' +
                       ' </div>' +
                   ' </div>' +
                   ' <div style="width: 10%; display: table; height: 90px;">' +
                      ' <div class="li-div-txt" style="text-align:center">' +
                           ' <p style="font-size: 20px; color: #334455">=</p>' +
                        '</div>' +
                    '</div>' +
                   ' <div style="width: 55%; display: table; height: 85px">' +
                        '<div class="li-div-txt" style="text-align: center;">' +
                            '<p class="ui-numerator"><b data-bind="text:fractionsData.' + termPropertys.fractionsCode[0] + '"></b></p>' +
                            '<p class="ui-denominator" data-bind="text:fractions[0]"></p>' +
                            '<p style="width: 100px; border-bottom: 1px solid #334455"></p>' +
                            '<p class="ui-numerator"><b  data-bind="text:fractionsData.' + termPropertys.fractionsCode[1] + '"></b></p>' +
                            '<p class="ui-denominator" data-bind="text:fractions[1]"></p>' +
                        '</div>' +
                    '</div>'
            }
            else {
                fractionsTemplate = '<div style="width: 100%; height: 90px;  display: table;">' +
                        '<div class="li-div-txt" style="width:55%">' +
                           '<b style="font-size: 21px;float:right;padding-right:5px;color:#6083a5" data-bind="text:fractionsData.' + termPropertys.fractionsCode + ',style:{color:fractionsData.carSubmitCount==0 ? \'#6083a5\':\'#00ae08\'}"></b>' +
                        '</div>' +
                        '<div class="li-div-txt" >' +
                          '<p style="float:left;" data-bind="css:{\'arrow-level\':fractionsData.todayCarCount==0,\'arrow-up\':fractionsData.todayCarCount>0 }" ></p>' +
                       ' </div>' +
                   ' </div>'
            }
            //console.log(param.id + fractionsTemplate);
            //$("#" + param.id).append('<script type="text/html" id="fractions-template">' + fractionsTemplate + '</script>');
            if ($("#fractions-template").html() == undefined) {
                $("body").append('<script type="text/html" id="fractions-template">' + fractionsTemplate + '</script>');

            }
            else {
                $("#fractions-template").html(fractionsTemplate);
            }

            koBind(jdat, termPropertys, param);

            //图表
            if (termPropertys.chartType == "pie") {
                //饼图
                renderPieChart(jdat, termPropertys, param);
            }
            else if (termPropertys.chartType == "bar") {
                //柱状图
                renderBarChart(jdat, termPropertys, param);
            }
            else {
                //折线图
                renderlineChart(jdat, termPropertys, param);
            }
        }
    }

    function koBind(jdat, propertys, param) {
        var chartTitle = propertys.chartTitle == undefined ? "最近六个月同期数据:" : propertys.chartTitle;
        if (jdat.status == "100") {
            var viewModel = {
                list: jdat.data.dataList,
                fractionsData: jdat.data,
                fractions: propertys.fractions,
                chartTitle: chartTitle,
                clickStr: propertys.clickStr,
                flag: 0,
                bottomClick: function () {
                    if (viewModel.flag == 1) return;
                    viewModel.flag = 1;
                    parentUrl = (window.location.href.split('#')[1]).split('?')[0];
                    if (param.id != "") {
                        var url = "./index.html#/statistics/phase/termdetail/" + param.id + "?parentUrl=" + parentUrl +
                                                                    "&token=" + token +
                                                                    "&companyCode=" + companyCode;
                        window.location.href = getVal("regionId") == "" ? url : url + "&regionId=" + getVal("regionId");
                    }
                    setTimeout(function () {
                        viewModel.flag = 0;
                    }, 300);
                },
            
               
            };
            var div = document.getElementById(param.id);
            ko.cleanNode(div);
            ko.applyBindings(viewModel, div);
        }
            //else if (jdat.status == "102") {
            //    var msg = (jdat.msg == "") ? "帐号已过期，请重新登录！" : jdat.msg;
            //    //msg = "test";
            //    if (agent.indexOf("android") != -1) {
            //        UamaJSBridge._app_tokenFailue();
            //    } else {
            //        window.webkit.messageHandlers.RemoteH5.postMessage({ func: '_app_tokenFailue' });
            //    }
            //}
        else {
            errorPage();
        }
    }

    //pieChart
    function renderPieChart(jdat, propertys, param) {

        var chartColums = propertys.chartColums;
        var chartCodes = propertys.chartCodes;

        var list = jdat.data;
        var lines = [];     
        //计算坐标X值
        var item = list;

        //计算每条线条的Y值
        for (var j in chartCodes) {
            var name = chartColums[j];
            var code = chartCodes[j];
            lines.push({
                name: name,
                value: eval("item." + code).toString().indexOf('%') == -1 ? eval("item." + code) : eval("item." + code).toString().replace('%', '')
            });
        }
        
        var title = jdat.data.timeScope;

        var colors = ["#aaaaaa", "#00ae08"];
        param.pieChart.init(param.id + " #charts", "pie", propertys.title, lines, chartColums, chartCodes, colors);
    }

    //barChart
    function renderBarChart(jdat, propertys, param) {

        var chartColums = propertys.chartColums;
        var chartCodes = propertys.chartCodes;
        var x = [], max, list;
        var isformat = true;//数据是否百分比
       
        list = jdat.data.syncData.slice(0, jdat.data.syncData.length);//补点会导致数据重复
      
    

        ////计算坐标间隔显示
        //var interval = 0;
        //if (list.length == 1) {
        //    var row = list[0];
        //    list.push(row);
        //    list.push(row);
        //} else if (list.length == 2) {
        //    var row = list[0];
        //    var tmp = list[1];

        //    list[0] = row;
        //    list[1] = row;
        //    list[2] = tmp;
        //}
        //else if (list.length >= 7 && list.length < 12) {
        //    interval = 2;
        //} else {
        //    interval = 5;
        //}


        var lines = new Array();
        for (var idx = 0; idx < chartCodes.length; idx++) {
            lines.push(new Array());
        }
        console.log("length:" + list.length);
        for (var i in list) {
            //计算坐标X值
            var item = list[i];
            x.push(item.date);

            //计算每条线条的Y值
            for (var j in chartCodes) {
                var code = chartCodes[j];
                console.log(eval("item." + code));
                if (eval("item." + code) == null) {
                    lines[j].push("");
                }
                else {
                    isformat = eval("item." + code).toString().indexOf('%') == -1 ? true : false;

                    lines[j].push(eval("item." + code).toString().indexOf('%') == -1 ? eval("item." + code) : eval("item." + code).toString().replace('%', ''));
                }
            }
        }


        var title = jdat.data.timeScope;

        var selectedMode = "multiple";//默认单选
   
        //y轴最大值
        var y = lines.join(",").split(",");//转化为一维数组  
        max = Math.max.apply(null, y);//最大值 
        if (propertys.tab == "assetOrderCompare") {
            max = Math.ceil(max);
        } else {
            if (isformat == true && max < 5) {
                max = '5';
            }
            else if (isformat == false && max < 100) {
                max = '100';
            }
            else if (isformat == false && max >= 100) {
                max = (Math.ceil(max / 10) * 10).toString();
            }
            else {
                max = 'auto';
            }
        }


        //set lines color propertys.color
        var colors = ["#00ae08", "#3191fd"];
        //title
        if (param.compareCount != undefined) {

            title = GetTimeScope(param.compareCount);
        }
        
        param.barChart.init(param.id + " #charts", "line", title, x, lines, isformat, max, chartColums, chartCodes, selectedMode, colors);
    }

    //lineChart
    function renderlineChart(jdat, propertys, param) {

        var chartColums = propertys.chartColums;
        var chartCodes = propertys.chartCodes;
        var x = [], max,list;
        var isformat = true;//数据是否百分比

        if (jdat.data.syncData != undefined) {
            list = jdat.data.syncData.slice(0, jdat.data.syncData.length);//补点会导致数据重复
        }
        else {
            list = jdat.data.dataList.slice(0, jdat.data.dataList.length);//补点会导致数据重复
        }

        //计算坐标间隔显示
        var interval = 0;
        if (list.length == 1) {
            var row = list[0];
            list.push(row);
            list.push(row);
        } else if (list.length == 2) {
            var row = list[0];
            var tmp = list[1];

            list[0] = row;
            list[1] = row;
            list[2] = tmp;
        }
        else if (list.length >= 7 && list.length < 12) {
            interval = 2;
        } else {
            interval = 5;
        }


        var lines = new Array();
        for (var idx = 0; idx < chartCodes.length; idx++) {
            lines.push(new Array());
        }
        console.log("length:" + list.length);
        for (var i in list) {
            //计算坐标X值
            var item = list[i];
            x.push(item.date);

            //计算每条线条的Y值
            for (var j in chartCodes) {
                //lines[chartCodes.length-1].push(item.date);

                var code = chartCodes[j];
                console.log(item.code);
                if (eval("item." + code) == null) {
                    lines[j].push("");
                }
                else{
                    isformat = eval("item." + code).toString().indexOf('%') == -1 ? true : false;

                    lines[j].push(eval("item." + code).toString().indexOf('%') == -1 ? eval("item." + code) : eval("item." + code).toString().replace('%', ''));
                }
            }
        }


        var title = jdat.data.timeScope;;

        var selectedMode = "multiple";//默认多选
       

        //y轴最大值
        var y = lines.join(",").split(",");//转化为一维数组  
        max = Math.max.apply(null, y);//最大值 
        if (propertys.tab == "assetOrderCompare") {
            max = Math.ceil(max);
        } else {
            if (isformat == true && max < 5) {
                max = '5';
            }
            else if (isformat == false && max < 100) {
                max = '100';
            }
            else if (isformat == false && max >= 100) {
                max = (Math.ceil(max / 10) * 10).toString();
            }
            else {
                max = 'auto';
            }
        }

        //set lines color propertys.color
        //set lines color propertys.color
        var colors = ["#00ae08", "#3191fd"];
        //title
        if (param.compareCount != undefined ) {
            
            title = (title == undefined) ? GetTimeScope(param.compareCount) : title;
        }

        param.lineChart.init(param.id + " #charts", "line", title, x, lines, isformat, max, chartColums, chartCodes, selectedMode, colors);
    }

    exports.init = function (termTemplate, id, pieChart, barChart, lineChart, compareCount) {
        var funParam = [];
        console.log("compareCount"+compareCount);
        compareCount = (compareCount == undefined || compareCount == "") ? 1 : compareCount;
        console.log("compareCount" + compareCount);
        funParam.push({
            id: id, pieChart: pieChart, barChart: barChart, lineChart: lineChart, compareCount: compareCount
        });

        $.get(termTemplate, function (result) {
            $('#' + id).html(result);
            var postdata = new Object();
            for (var x in postData) {
                postdata[x] = postData[x];
            }
            timestamp = new Date().getTime();
            if (id == "carSubmitInfo") {
                postdata.timeType = "day";
                postdata.endTime = formatDate(new Date(timestamp));
                postdata.startTime = formatDate(new Date(timestamp - 6 * 24 * 3600 * 1000));
            }
            else {
                time = formatDate(new Date(timestamp - 24 * 3600 * 1000));
                postdata.timeType = "month";
                postdata.time = time;
                postdata.compareCount = compareCount;
            }
            if (window.location.href.indexOf("regionId") != -1) {
                postdata.regionId = getVal("regionId");
            }
          
            var api = "wgAdminView2Action!" + id + ".action";
            post(api, postdata, renderPage_call_back, funParam[0]);
        });
    }
});


function GetTimeScope(count) {
    var now = new Date();
    var startTime = now.setMonth(now.getMonth() - count+1);
    var endtime = new Date().getFullYear() + "/" + ((new Date().getMonth() + 1) >= 10 ? (new Date().getMonth() + 1).toString() : "0" + (new Date().getMonth() + 1).toString());
    var start = new Date(startTime).getFullYear() + "/" + ((new Date(startTime).getMonth() + 1) >= 10 ? (new Date(startTime).getMonth() + 1).toString() : "0" + (new Date(startTime).getMonth() + 1).toString());
    return start + "~" + endtime;
}

