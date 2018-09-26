
var config =  [
    {
        title: "活跃用户数",
        category: "appActiveUser",
        colums: ["日期", "活跃用户", "沉默用户", "用户总数"],
        codes: ["date", "activeUserCount", "silentUserCount", "userTotalCount"],
        chartColums: ["活跃用户", "沉默用户"],
        chartCodes: ["activeUserCountDraw", "silentUserCountDraw"],
        tip: ["activeUserCount", "silentUserCount"],
        tiptitle: ["活跃用户", "沉默用户"],
        tipmsg: ["当日启动过应用的业主（去重）", "当日未启动过应用的业主"],
    },
    {
        title: "人访",
        category: "peopleVisitor",
        colums: ["日期", "新增人访", "人访总量"],
        codes: ["date", "newVisitorCount", "visitorTotalCount"],
        chartColums: ["新增人访", "人访总量"],
        chartCodes: ["newVisitorCountDraw", "visitorTotalCountDraw"],
        tip: [],
        tipmsg:[],
    },
    {
        title: "公共维修",
        category: "commonServiceOrder",
        colums: ["日期", "新增维修", "公共维修总量"],
        codes: ["date", "newOrderCount", "orderTotalCount"],
        chartColums: ["新增维修", "公共维修总量"],
        chartCodes: ["newOrderCountDraw", "orderTotalCountDraw"],
        tip: [],
        tipmsg: [],
    },
    {
        title: "商家订单",
        category: "shopOrder",
        colums: ["日期", "新增订单", "新增金额", "商家订单总量", "总金额"],
        codes: ["date", "newOrderCount", "newOrderMoney", "orderTotalCount", "orderTotalMoney"],
        chartColums: ["新增订单", "商家订单总量"],
        chartCodes: ["newOrderCountDraw", "orderTotalCountDraw"],
        tip: [],
        tipmsg: [],
    },
    {
        title: "园区订单",
        category: "communityOrder",
        colums: ["日期", "新增订单", "新增金额", "园区订单总量", "总金额"],
        codes: ["date", "newOrderCount", "newOrderMoney", "orderTotalCount", "orderTotalMoney"],
        chartColums: ["新增订单", "园区订单总量"],
        chartCodes: ["newOrderCountDraw", "orderTotalCountDraw"],
        tip: [],
        tipmsg: [],
    },
    {
        title: "今日总订单",
        category: "totalOrder",
        colums: ["日期", "今日总订单", "今日总金额", "历史订单总量", "总金额"],
        codes: ["date", "newOrderCount", "newOrderMoney", "orderTotalCount", "orderTotalMoney"],
        chartColums: ["今日总订单", "历史订单总量"],
        chartCodes: ["newOrderCount", "orderTotalCount"],
        tip: [],
        tipmsg: [],
    },
    {
        title: "居家维修",
        category: "familyServiceOrder",
        colums: ["日期", "新增维修", "居家维修总量"],
        codes: ["date", "newOrderCount", "orderTotalCount"],
        chartColums: ["新增维修", "居家维修总量"],
        chartCodes: ["newOrderCountDraw", "orderTotalCountDraw"],
        tip: [],
        tipmsg: [],
    },
    {
        title: "快递量",
        category: "express",
        colums: ["日期", "新增快递", "快递总量"],
        codes: ["date", "newExpressCount", "expressTotalCount"],
        chartColums: ["新增快递", "快递总量"],
        chartCodes: ["newExpressCountDraw", "expressTotalCountDraw"],
        tip: [],
        tipmsg: [],
    },
    {
        title: "投诉单",
        category: "complaintOrder",
        colums: ["日期", "新增投诉", "投诉总量"],
        codes: ["date", "newOrderCount", "orderTotalCount"],
        chartColums: ["新增投诉", "投诉总量"],
        chartCodes: ["newOrderCountDraw", "orderTotalCountDraw"],
        tip: [],
        tipmsg: [],
    },
    {
        title: "服务质量",
        category: "serviceQuality",
        colums: ["日期", "质量总得分", "评价数", "服务质量"],
        codes: ["date", "serviceTotalPoint", "appraiseCount", "serviceQuality"],
        chartColums: ["服务质量"],
        chartCodes: ["serviceQuality"],
        tip: ["serviceQuality"],
        tiptitle: ["服务质量"],
        tipmsg: ["统计周期内，服务质量总得分/服务订单评价数"]
    },
    {
        title: "服务速度",
        category: "serviceSpeed",
        colums: ["日期", "速度总得分", "评价数", "服务速度"],
        codes: ["date", "serviceTotalPoint", "appraiseCount", "serviceSpeed"],
        chartColums: ["服务速度"],
        chartCodes: ["serviceSpeed"],
        tip: ["serviceSpeed"],
        tiptitle: ["服务速度"],
        tipmsg: ["统计周期内，服务速度总得分/服务订单评价数"]
    },
    {
        title: "快递未领取量",
        category: "noHostExpress",
        colums: ["日期", "当日未领取快递", "累计未领取快递"],
        codes: ["date", "newExpressCount", "expressTotalCount"],
        chartColums: ["当日未领取快递", "累计未领取快递"],
        chartCodes: ["newExpressCountDraw", "expressTotalCount"],
        tip: ["newExpressCount", "expressTotalCount"],
        tiptitle: ["当日未领取快递", "累计未领取快递"],
        tipmsg: ["特指当日接收快递中的当日未领取数", "指接收快递中的未领取数"],
    },
    {
        title: "注册用户数",
        category: "registerUser",
        colums: ["日期", "新增用户数", "注册用户数"],
        codes: ["date", "newUserCount", "userTotalCount"],
        chartColums: ["注册用户数", "新增用户数"],
        chartCodes: ["userTotalCountDraw", "newUserCountDraw"],
        tip: ["userTotalCount"],
        tiptitle: ["注册用户"],
        tipmsg: ["注册之后至少登录过一次的用户，未去重，1个用户注册2个住址算2个用户数；"],
 
    },
    {
        title: "注册户数",
        category: "registerAsset",
        colums: ["日期", "新增户数", "注册户数"],
        codes: ["date", "newAssetCount", "assetTotalCount"],
        chartColums: ["注册户数", "新增户数"],
        chartCodes: ["assetTotalCountDraw", "newAssetCountDraw", ],
        tip: ["assetTotalCount"],
        tiptitle: ["注册户"],
        tipmsg: ["房号中至少存在一个注册之后至少登录过一次的用户算1户（去重）"]
    },
    {
        title: "园区登记车辆数",
        category: "submitCar",
        colums: ["日期", "登记车辆总数"],
        codes: ["date", "carTotalCount"],
        chartColums: ["登记车辆总数"],
        chartCodes: ["carTotalCountDraw"],
        tip: [],
        tipmsg: [],
    },
    {
        title: "表扬单",
        category: "praiseOrder",
        colums: ["日期", "新增表扬", "表扬单总量"],
        codes: ["date", "newOrderCount", "orderTotalCount"],
        chartColums: ["新增表扬", "表扬单总量"],
        chartCodes: ["newOrderCountDraw", "orderTotalCountDraw"],
        tip: [],
        tipmsg: [],
    },
    {
        title: "订单完成率",
        category: "orderCompleteRate",
        colums: ["日期", "订单完成数", "订单完成率"],
        codes: ["date", "completeCount", "completeRate"],
        chartColums: ["订单完成率"],
        chartCodes: ["completeRate"],
        tip: [],
        tipmsg: [],
    },
    {
        title: "今日订单完成率",
        category: "orderCompleteRate_today",
        colums: ["日期", "当日完成数", "当日完成率"],
        codes: ["date", "completeCount", "completeRate"],
        chartColums: ["当日完成率"],
        chartCodes: ["completeRate"],
        tip: [],
        tipmsg:[],
    },
    {
        title: "订单评价满意度",
        category: "orderAppraisePassRate",
        colums: ["日期", "服务速度总得分", "服务质量总得分", "评价数", "订单评价满意度"],
        codes: ["date", "serviceSpeedTotalPoint", "serviseQualityTotalPoint", "appraiseCount", "orderAppraisePassRate"],
        chartColums: ["订单评价满意度"],
        chartCodes: ["orderAppraisePassRate"],
        tip: ["orderAppraisePassRate"],
        tiptitle: ["订单评价满意度"],
        tipmsg: ["统计周期内，（服务速度总得分+服务质量总得分）/（2*服务订单评价数）"],
    },
    {
        title: "访客",
        category: "visitor",
        colums: ["日期", "新增访客", "访客总量"],
        codes: ["date", "newVisitorCount", "visitorTotalCount"],
        chartColums: ["新增访客", "访客总量"],
        chartCodes: ["newVisitorCountDraw", "visitorTotalCountDraw"],
        tip: [],
        tipmsg: [],
    },
    {
        title: "车访",
        category: "carVisitor",
        colums: ["日期", "新增车访", "车访总量"],
        codes: ["date", "newVisitorCount", "visitorTotalCount"],
        chartColums: ["新增车访", "车访总量"],
        chartCodes: ["newVisitorCountDraw", "visitorTotalCountDraw"],
        tip: [],
        tipmsg: [],
    },
    {
        title: "送水单",
        category: "waterOrder",
        colums: ["日期", "今日送水单", "送水单总量"],
        codes: ["date", "newOrderCount", "orderTotalCount"],
        chartColums: ["今日送水单", "送水单总量"],
        chartCodes: ["newOrderCountDraw", "orderTotalCountDraw"],
        tip: [],
        tipmsg: [],
    },
        {
            title: "日安装率",
            title2: "月安装率",
            category: "installRate",
            colums: ["日期", "注册用户数", "入住户数", "安装率"],
            codes: ["date", "registerUserCount", "inLiveAssetCount", "installRate"],
            chartColums: ["安装率"],
            chartCodes: ["installRate"],
            tip: ["registerUserCount", "installRate"],
            tiptitle: ["注册用户","安装率"],
            tipmsg: ["注册之后至少登录过一次的用户，未去重，1个用户注册2个住址算2个用户数；", "截止统计日23点59分，注册用户数/入住户数；"],
        },
        {
            title: "日活跃率",
            title2: "月活跃率",
            category: "activeRate",
            colums: ["日期", "活跃用户数", "注册用户数", "活跃率"],
            codes: ["date", "activeUserCount", "registerUserCount", "activeRate"],
            chartColums: ["活跃率"],
            chartCodes: ["activeRate"],
            tip: ["activeUserCount", "registerUserCount", "activeRate"],
            tiptitle: ["活跃用户", "注册用户", "活跃率"],
            tipmsg: ["当日启动过应用的业主（去重）", "注册之后至少登录过一次的用户，未去重，1个用户注册2个住址算2个用户数；", "统计周期内，活跃用户数/注册用户数；"],
            tipmsg2: ["当月启动过应用的业主（去重）", "注册之后至少登录过一次的用户，未去重，1个用户注册2个住址算2个用户数；", "统计周期内，活跃用户数/注册用户数；"]
        },
        {
            title: "日户均订单",
            title2: "月户均订单",
            category: "assetOrder",
            colums: ["日期", "订单数", "注册用户数", "户均订单数"],
            codes: ["date", "orderCount", "registerUserCount", "assetOrderCount"],
            chartColums: ["户均订单数"],
            chartCodes: ["assetOrderCountDraw"],
            tip: ["orderCount", "registerUserCount", "assetOrderCount"],
            tiptitle: ["订单", "注册用户", "户均订单"],
            tipmsg: ["统计周期内，园区订单、商家订单、积分订单", "注册之后至少登录过一次的用户，未去重，1个用户注册2个住址算2个用户数；", "统计周期内，订单数（园区订单、商家订单、积分订单）/注册用户数"],
        },
        {
            title: "日覆盖率",
            title2: "月覆盖率",
            category: "coverRate",
            colums: ["日期", "注册户数", "入住户数", "覆盖率"],
            codes: ["date", "registerAssetCount", "inLiveAssetCount", "coverRate"],
            chartColums: ["覆盖率"],
            chartCodes: ["coverRate"],
            tip: ["registerAssetCount", "coverRate"],
            tiptitle: ["注册户", "覆盖率"],
            tipmsg: ["房号中至少存在一个注册之后至少登录过一次的用户算1户（去重）", "截止统计日23点59分，覆盖率=注册户数/入住户数"],
        },
        {
            title: "日接单效率",
            title2: "月接单效率",
            category: "receiveOrderEfficiency",
            colums: ["日期", "准时接单数", "总订单数", "接单效率"],
            codes: ["date", "receiveOrderOnTimeCount", "orderTotalCount", "receiveOrderEfficiency"],
            chartColums: ["接单效率"],
            chartCodes: ["receiveOrderEfficiency"],
            tip: ["receiveOrderOnTimeCount", "receiveOrderEfficiency"],
            tiptitle: ["准时接单", "接单效率"],
            tipmsg: ["统计周期内，15分钟内由物业服务中心负责接收的订单", "统计周期内，15分钟内由物业服务中心负责接收的订单数/物业服务中心接收的总订单数；"],
        },
        {
            title: "日快递领取率",
            title2: "月快递领取率",
            category: "expressGetRate",
            colums: ["日期", "当日领取快递", "当日接收快递", "快递领取率"],
            colums2: ["日期", "当月领取快递", "当月接收快递", "快递领取率"],
            codes: ["date", "getExpressCount", "receiveExpressCount", "expressGetRate"],
            chartColums: ["快递领取率"],
            chartCodes: ["expressGetRate"],
            tip: ["getExpressCount", "expressGetRate"],
            tiptitle: ["当日领取快递", "快递领取率"],
            tiptitle2: ["当月领取快递", "快递领取率"],
            tipmsg: ["特指当日接收快递中的当日领取数", "当日领取数(特指当日接收快递中的)/当日接收快递数"],
            tipmsg2: ["特指当月接收快递中的当月领取数", "当月领取数(特指当月接收快递中的)/当月接收快递数"],
        }
]



define(function (require, exports, module) {
     
    require("ko");
    require("frozencss");
    require("appcss");

    var chart_, category_,app_;

    function renderPage_call_back(responseText) {
        var jdat = JSON.parse(responseText);
        if (jdat.status == "100") {
            var propertys = [];
            for (var idx in config) {
                var category = config[idx].category;
                if (category == category_) {//相同模块
                    propertys = config[idx];
                    break;
                }
            }


            var templateStr = "";
            //  for (var idx in propertys.codes) {
            for (j = 0; j < propertys.codes.length; j++) {
                //标题模板
                if (propertys.codes.length == 3) {
                    propertys.colors = ['#334455', '#00ae08', '#3191fd', ]
                }
                else {
                    propertys.colors = ['#334455', '#e9a400', '#6083a5', '#3191fd', '#6083a5'];
                }
                if (j == propertys.codes.length - 1) {//最后一列不要竖线
                    templateStr += '<li class="ui-col ui-flex ui-flex-pack-center "><div class="ui-txt-justify" style="color:' + propertys.colors[j] +'"data-bind="text:' + propertys.codes[j] +
                       ',style:{color:(parseFloat($data.' + propertys.codes[j] + '.toString().replace(\'%\',\'\'))-($data.kpi == undefined ? 0: parseFloat($data.kpi.toString().replace(\'%\',\'\'))))<0? \'red\':\'' + propertys.colors[j] + '\'}  ' +
                        '"></div></li>';
                }
                else {
                    templateStr += '<li class="ui-col ui-flex ui-flex-pack-center ui-border-r"><div class="ui-txt-justify" style="color:' + propertys.colors[j] + ' "data-bind="text:' + propertys.codes[j] + '"></div></li>';
                }
            }
       
            $("body").append('<script type="text/html" id="columns-template">' + templateStr + '</script>');

            //没有数据提示
            if (jdat.data.dataList.length == 0) {
                $("#notice").css('display', "");
            }
            var title = propertys.title;
            if (window.location.href.indexOf("timetype=month") != -1) {
                title = propertys.title2;
            }
            app_.setComDetailPage(title);
            renderChart(jdat, propertys);
            koBind(jdat, propertys);

            UamaJSBridge._app_dismissLoadingAlert();
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


    function koBind(jdat, propertys) {
        var colums = propertys.colums;
        if(propertys.category == "expressGetRate"){
            if (window.location.href.indexOf("timetype=day") != -1) {
                colums = propertys.colums;
            }
            else {
                colums = propertys.colums2;
            }
        }
        var viewModel = {
            list: jdat.data.dataList,
            colums: colums,
            tip: propertys.tip,
            
        };

        var div = document.getElementById("contain");
        ko.cleanNode(div);
        ko.applyBindings(viewModel, div);
        $("#bar").find("li").each(function(idx,obj) {      
            var idx = idx;
            var category = propertys.category;
            var code = propertys.codes[idx];
            for(var i in propertys.tip){
                var tip = propertys.tip[i];           
                if (tip == code) {
                    var tiptitle, tipmsg;
                    tiptitle = propertys.tiptitle[i];
                    if (category == "expressGetRate" && window.location.href.indexOf("timetype=month") != -1) {
                        tiptitle = propertys.tiptitle2[i];
                    }
                   tipmsg = propertys.tipmsg[i];
                   if (window.location.href.indexOf("timetype=month") != -1 && propertys.tipmsg2 != undefined) {
                       tipmsg = propertys.tipmsg2[i];
                   }
                  // tipmsg = (window.location.href.indexOf("timetype=day") == -1 && propertys.tipmsg2 == undefined) ? propertys.tipmsg[i] : propertys.tipmsg2[i];
                   

                    $(this).click(function () {
                        //获取tip的名称   
                        if (agent.indexOf("android") != -1) {
                            UamaJSBridge._app_showMessage(tiptitle, tipmsg, "");
                        } else {
                           // UamaJSBridge._app_showMessage(tiptitle, tipmsg, "");
                            window.webkit.messageHandlers.RemoteH5.postMessage({ func: '_app_showMessage', params: { "title": tiptitle, "content": tipmsg } });
                        }
                      
                    });
                    $(this).find("span").html('<img style="height:16px;width:16px;display:inline-block;vertical-align:middle;" src="./img/explain.png" />');
                }
            }

        })
    }


    function renderChart(jdat, propertys) {

        var chartColums = propertys.chartColums;
        var chartCodes = propertys.chartCodes;
        var x = [],max;
        var isformat=true;//数据是否百分比

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
        else if (list.length >=7 && list.length < 12) {
            interval = 2;
        } else {
            interval = 5;
        }

        
        var lines = new Array();
        for (var idx = 0;idx<chartCodes.length;idx++) {
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
                 isformat =eval("item." + code).toString().indexOf('%') == -1 ? true:false;

                lines[j].push(eval("item." + code).toString().indexOf('%') == -1 ? eval("item." + code) : eval("item." + code).toString().replace('%', ''));
            }
        }


        var title = jdat.data.timeScope;

        var selectedMode = "single";//默认单选
        if (jdat.data.dataList.length> 0) {
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
        var  y=lines.join(",").split(",");//转化为一维数组  
        max = Math.max.apply(null, y);//最大值 
        if (propertys.category == "assetOrder") {
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
        var colors=[];
        for(var k in propertys.codes){
            var code=propertys.codes[k];
            for(var m in propertys.chartCodes){
                var chartCode=propertys.chartCodes[m];
                if (chartCode.indexOf(code) != -1) {
                    colors.push(propertys.colors[k]);
                }
            }
        }
        
        chart_.init(title, x, lines, isformat,max, chartColums, chartCodes, interval, selectedMode, colors);
    }

   

    exports.init = function (api, template,category, chart,app) {
        chart_ = chart;
        category_ = category;
        app_ = app;
       
        $.get(template, function (result) {
            $("body").html(result);
            console.log(postData);
            var postdata = new Object();
            for (var x in postData) {
                postdata[x] = postData[x];
            }
            if (getVal("communityId") != "") {
                postdata.communityId = getVal("communityId");
            }
            post(api, postdata, renderPage_call_back);
        });
    }

});

