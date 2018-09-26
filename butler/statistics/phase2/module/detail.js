var Detail = [
    {
        title: "活跃用户数",
        category: "activeRateInfo",
        colums: ["日期", "月活跃用户", "注册用户数", "月活跃率"],
        colums1: ["日期", "日活跃用户", "注册用户数", "日活跃率"],
        codes: ["date", "activeUserCount", "registerUserCount", "activeRate"],
        chartColums: ["活跃率"],
        chartCodes: ["activeRate"],
    },
      {
          title: "覆盖率",
          category: "coverRateInfo",
          colums: ["日期", "注册户数", "入住户数", "覆盖率"],
          colums1: ["日期", "注册户数", "入住户数", "覆盖率"],
          codes: ["date", "registerAssetCount", "inLiveAssetCount", "coverRate"],
          chartColums: ["覆盖率"],
          chartCodes: ["coverRate"],
      },
    {
        title: "安装率",
        category: "installRateInfo",
        colums: ["日期", "注册用户数", "入住户数", "安装率"],
        colums1: ["日期", "注册用户数", "入住户数", "安装率"],
        codes: ["date", "registerUserCount", "inLiveAssetCount", "installRate"],
        chartColums: ["安装率"],
        chartCodes: ["installRate"],
    },
    {
        title: "订单月环比",
        category: "orderCompareInfo",
        colums: ["日期", "月订单数", "月环比"],
        codes: ["date", "orderCount", "compareRate"],
        chartColums: ["月订单数", "月环比"],
        chartCodes: ["orderCountDraw", "compareRate"],
    },
    {
        title: "接单效率",
        category: "receiveOrderEfficiencyInfo",
        colums: ["日期", "月准时接单数", "总订单数", "月接单效率"],
        colums1: ["日期", "日准时接单数", "总订单数", "日接单效率"],
        codes: ["date", "receiveOrderOnTimeCount", "orderTotalCount", "receiveOrderEfficiency"],
        chartColums: ["接单效率"],
        chartCodes: ["receiveOrderEfficiency"],

    },
    {
        title: "服务质量",
        category: "serviceQualityInfo",
        colums: ["日期", "月质量总得分", "月评价数", "月服务质量"],
        colums1: ["日期", "日质量总得分", "日评价数", "日服务质量"],
        codes: ["date", "serviceTotalPoint", "appraiseCount", "serviceQuality"],
        chartColums: ["服务质量"],
        chartCodes: ["serviceQuality"],
    },
    {
        title: "服务速度",
        category: "serviceSpeedInfo",
        colums: ["日期", "月速度总得分", "月评价数", "月服务速度"],
        colums1: ["日期", "日速度总得分", "日评价数", "日服务速度"],
        codes: ["date", "serviceTotalPoint", "appraiseCount", "serviceSpeed"],
        chartColums: ["服务速度"],
        chartCodes: ["serviceSpeed"],
    },
    {
        title: "人均订单",
        category: "assetOrderInfo",
        colums: ["日期", "月订单数", "注册用户数", "月人均订单数"],
        colums1: ["日期", "日订单数", "注册用户数", "日人均订单数"],
        codes: ["date", "orderCount", "registerUserCount", "assetOrderCount"],
        chartColums: ["人均订单数"],
        chartCodes: ["assetOrderCountDraw"],
    },
    {
        title: "访客月环比",
        category: "visitorCompareInfo",
        colums: ["日期", "月访客数", "月环比"],
        colums1: ["日期", "月访客数", "月环比"],
        codes: ["date", "visitorCount", "compareRate"],
        chartColums: ["访客数", "环比"],
        chartCodes: ["visitorCountDraw", "compareRate"],
    },
    {
        title: "访客通行使用率",
        category: "qrcodeCompareInfo",
        colums: ["日期", "月使用数", "月访客总数", "月使用率"],
        colums1: ["日期", "日使用数", "日访客总数", "日使用率"],
        codes: ["date", "userCount", "visitorCount", "userRate"],
        chartColums: ["使用率"],
        chartCodes: ["userRate"],

    },
    {
        title: "快递领取率",
        category: "expressGetRateInfo",
        colums: ["日期", "当月领取量", "月接收总量", "领取率"],
        colums1: ["日期", "当日领取量", "日接收总量", "领取率"],
        codes: ["date", "getExpressCount", "receiveExpressCount", "expressGetRate"],
        chartColums: ["领取率"],
        chartCodes: ["expressGetRate"],
    },
    {
        title: "扫码领取率",
        category: "sweepCodeCompareInfo",
        colums: ["日期", "当月扫码量", "当月领取量", "月扫码率"],
        colums1: ["日期", "当日扫码量", "当日领取量", "日扫码率"],
        codes: ["date", "userCount", "getCount", "userRate"],
        chartColums: ["扫码率"],
        chartCodes: ["userRate"],
    },
    {
        title: "登记月环比",
        category: "carCompareInfo",
        colums: ["日期", "月车辆登记数", "月环比"],
        codes: ["date", "carCount", "compareRate"],
        chartColums: ["车辆登记数", "环比"],
        chartCodes: ["carCountDraw", "compareRate"],
    },
    {
        title: "车辆登记量",
        category: "carSubmitInfo",
        colums: ["日期", "新增登记量", "累计登记总量"],
        codes: ["date", "submitCount", "yearSubmitCount"],
        chartColums: ["新增登记量", "累计登记总量"],
        chartCodes: ["submitCountDraw", "yearSubmitCountDraw"],
    }
];


define(function (require, exports, module) {

    var barChart = require("././../chart/barChart");
    var detailpropertys_;
    function renderPage_call_back(responseText,param) {
        var jdat = JSON.parse(responseText);
        console.log(param);
        if (jdat.status == "100") {
            var depropertys = [];
            depropertys = detailpropertys_;

            var detailtemplateStr = "";
            //  for (var idx in propertys.codes) {
            for (j = 0; j < depropertys.codes.length; j++) {
                //标题模板
                if (depropertys.codes.length == 3) {
                    depropertys.colors = ['#334455', '#00ae08', '#3191fd', ]
                }
                else {
                    depropertys.colors = ['#334455', '#e9a400', '#6083a5', '#3191fd', '#6083a5'];
                }
                if (j == depropertys.codes.length - 1) {//最后一列不要竖线
                    detailtemplateStr += '<li class="ui-col ui-flex ui-flex-pack-center "><div class="ui-txt-justify" style="color:' + depropertys.colors[j] +
                        ' "data-bind="text:$data.' + depropertys.codes[j] + '==null?\'-\':' + depropertys.codes[j] +
                        ',style:{color:(parseFloat(($data.' + depropertys.codes[j] + '==null)?0:$data.' + depropertys.codes[j] + '.toString().replace(\'%\',\'\'))-($data.kpi == undefined ? 0: parseFloat($data.kpi.toString().replace(\'%\',\'\'))))<0? \'red\':\'' + depropertys.colors[j] + '\'}  ' +
                        '"></div></li>';
                }
                else {
                    detailtemplateStr += '<li class="ui-col ui-flex ui-flex-pack-center ui-border-r"><div class="ui-txt-justify" style="color:' + depropertys.colors[j] + ' "data-bind="text:' + depropertys.codes[j] + '"></div></li>';
                }
            }

            if ($("#columns-detemplate").html() == undefined) {
                $("body").append('<script type="text/html" id="columns-detemplate">' + detailtemplateStr + '</script>');               
            }
            else {
                $("#columns-detemplate").html(detailtemplateStr);
            }
           
            console.log(detailtemplateStr);
            //没有数据提示
            if (jdat.data.dataList.length == 0) {
                $("#notice").css('display', "");
            }
           
            koBind(jdat, depropertys, param);
            //图表
            if (depropertys.category == "visitorCompareInfo" || depropertys.category == "carCompareInfo"||depropertys.category =="orderCompareInfo") {
                //柱状图
                renderBarChart(jdat, depropertys, param);
            }
            else {
                //折线图
                renderChart(jdat, depropertys, param);
            }
           
        }
        else if (jdat.status == "102") {
            var msg = (jdat.msg == "") ? "帐号已过期，请重新登录！" : jdat.msg;
            //msg = "test";
            if (agent.indexOf("android") != -1) {
                UamaJSBridge._app_tokenFailue();
            } else {
                window.webkit.messageHandlers.RemoteH5.postMessage({ func: '_app_tokenFailue' });
            }
        }
        else {
            errorPage();
        }
    }


    function koBind(jdat, propertys,param) {
        var colums = propertys.colums;
      
        if (param.timetype == "day") {
            colums = propertys.colums1;
        }
      
        var viewModel = {
            list: jdat.data.dataList,
            colums: colums,

        };
        console.log(param.id);
        var div = document.getElementById(param.id);
        ko.cleanNode(div);
        ko.applyBindings(viewModel, div);
    }

    function renderChart(jdat, propertys,param) {

        var chartColums = propertys.chartColums;
        var chartCodes = propertys.chartCodes;
        var x = [], max;
        var isformat = true;//数据是否百分比

        var list = jdat.data.dataList.slice(0, jdat.data.dataList.length);//补点会导致数据重复

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
                if (eval("item." + code) == null) {
                    lines[j].push("-");
                }
                else {
                    isformat = eval("item." + code).toString().indexOf('%') == -1 ? true : false;

                    lines[j].push(eval("item." + code).toString().indexOf('%') == -1 ? eval("item." + code) : eval("item." + code).toString().replace('%', ''));
                }
            }
        }


        var title = jdat.data.timeScope;

        var selectedMode = "single";//默认单选
        if (jdat.data.dataList.length > 0) {
            if (jdat.data.dataList[0].kpi != undefined) {
                selectedMode = "multiple";//多选

                var len = lines.length;
                lines.push(new Array());

                //   for (var j in jdat.data.dataList) {
                for (var j in list) {
                    var kpi = list[j].kpi;
                    lines[len].push(kpi.toString().indexOf('%') == -1 ? kpi : kpi.toString().replace('%', ''));
                }
            }
        }
        if (propertys.category == "appActiveUser") {
            selectedMode = "multiple";//活跃用户多选
        }

        //y轴最大值
        var y = lines.join(",").split(",");//转化为一维数组  
        max = Math.max.apply(null, y);//最大值 
        if (propertys.category == "assetOrderInfo") {
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
        var colors = [];
        for (var k in propertys.codes) {
            var code = propertys.codes[k];
            for (var m in propertys.chartCodes) {
                var chartCode = propertys.chartCodes[m];
                if (chartCode.indexOf(code)!=-1) {
                    colors.push(propertys.colors[k]);
                }
            }
        }
       
        //var id = (param.timetype ==undefined) ? param.id : param.id + param.timetype;
        //console.log(id);
        param.lineChart.init(param.id + " .chart", "line", title, x, lines, isformat, max, chartColums, chartCodes, selectedMode, colors);
    }

    //barChart
    function renderBarChart(jdat, propertys, param) {

        var chartColums = propertys.chartColums;
        var chartCodes = propertys.chartCodes;
        var x = [], max, list;
        var isformat = true;//数据是否百分比

        list = jdat.data.dataList.slice(0, jdat.data.dataList.length);//补点会导致数据重复

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
        if (propertys.categorys == "assetOrderInfo") {
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

        barChart.init(param.id + " .chart", "line", title, x, lines, isformat, max, chartColums, chartCodes, selectedMode, colors);
    }


    exports.detailinit = function (template, api, lineChart,timetype) {
        var detailParam = new Object();
        detailParam.id=(timetype==undefined)?api:timetype;
        detailParam.lineChart=lineChart;
        detailParam.timetype = timetype;

        console.log(detailParam);
        var detail = [];
        for (var idx in Detail) {
            var category = Detail[idx].category;
            //  console.log(category);
            if (api == category) {//相同模块
                detail = Detail[idx];
                break;
            }
        }
        detailpropertys_ = detail;
        //console.log(detailpropertys_);
        //var timetype = "month", startTime, endTime;
        //timetype = ((id.toString().indexOf("Month") == -1 && id.toString().indexOf("Day") == -1) || id.toString().indexOf("Month") != -1) ? "month" : "day";
        timestamp = new Date().getTime();
        var day_endTime, day_startTime, month_endTime, month_startTime;
        if (timetype == "day") {
            day_endTime = formatDate(new Date(timestamp - 1 * 24 * 3600 * 1000));
            day_startTime = formatDate(new Date(timestamp - 7 * 24 * 3600 * 1000));
        } else {
            if (api == "carSubmitInfo") {
                month_endTime = formatDate(new Date(timestamp - 1 * 24 * 3600 * 1000));
                month_startTime = formatDate(new Date(timestamp - 7 * 24 * 3600 * 1000));
            }
            else {
                var n = 6;
                n = (api == "orderCompareInfo" || api == "carCompareInfo" || api == "visitorCompareInfo") ? 3 : n;
                month_startTime = formatDate(new Date(new Date().setMonth(new Date().getMonth() -n)));
                month_endTime = formatDate(new Date(new Date().setMonth(new Date().getMonth()-1)));
            }
        }
        $.get(template, function (result) {
            console.log(api);
            $('#' + detailParam.id).html(result);
            if (timetype==undefined) {
                $("#contain div").eq(0).height('0px');
            }
            var apiStr = "wgAdminView2Action!" + api + ".action";
            var postdata = new Object();
            for (var x in postData) {
                postdata[x] = postData[x];
            }
         //  postdata.timeType = (timetype==undefined)?"month":timetype;
            //postdata.startTime = startTime;
            //postdata.endTime = endTime;
            if (timetype == "day" && window.location.href.indexOf("timetype=day") != -1) {
                postdata.timeType = "day";
                postdata.startTime = (getVal("startTime") == "") ? day_startTime : getVal("startTime");
                postdata.endTime = (getVal("endTime") == "") ? day_endTime : getVal("endTime");
            }
            else if (timetype == "day" && window.location.href.indexOf("timetype=day") == -1) {
                postdata.timeType = "day";
                postdata.startTime = day_startTime ;
                postdata.endTime =  day_endTime;
            }
            else if (timetype == "month" && window.location.href.indexOf("timetype=month") == -1) {
                postdata.timeType = "month";
                postdata.startTime = month_startTime ;
                postdata.endTime =  month_endTime;
            }
            else if (timetype == "month" && window.location.href.indexOf("timetype=month") != -1) {
                postdata.timeType = "month";
                postdata.startTime = (getVal("startTime") == "") ? month_startTime : getVal("startTime");
                postdata.endTime = (getVal("endTime") == "") ? month_endTime : getVal("endTime");
            }
            else {
                postdata.timeType = (api == "carSubmitInfo")?"day":"month";
                postdata.startTime = (getVal("startTime") == "") ? month_startTime : getVal("startTime");
                postdata.endTime = (getVal("endTime") == "") ? month_endTime : getVal("endTime");
            }
            if (window.location.href.indexOf("regionId") != -1) {
                postdata.regionId = getVal("regionId");
            }
            post(apiStr, postdata, renderPage_call_back, detailParam);
        });
    }
});

