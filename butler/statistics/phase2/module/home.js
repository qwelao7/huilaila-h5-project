var index = [{
    code: "app",
    item: "APP<br />用户",
    colums: "*注册用户总数",
    yearCount: "222",
    monthCount: "",
    monthCompare: "",
    css: "ui-animation1"
}, {
    code: "order",
    item: "订单",
    colums: "*本年订单总数",
    yearCount: "222",
    monthCount: "",
    monthCompare: "",
    css: "ui-animation2"
}, {
    code: "visitor",
    item: "访客",
    colums: "*本年访客总数",
    yearCount: "222",
    monthCount: "",
    monthCompare: "",
    css: "ui-animation3"
}, {
    code: "express",
    item: "快递",
    colums: "*本年快递总量",
    yearCount: "222",
    monthCount: "",
    monthCompare: "",
    css: "ui-animation4"
}, {
    code: "car",
    item: "业主<br />车辆",
    colums: "*登记业主车辆总数",
    yearCount: "222",
    monthCount: "",
    monthCompare: "",
 css: "ui-animation5"
}]


define(function(require, exports, module) {
    require("ko");

    function renderPage(msg) {
     
        //$('#nav').attr('data-bind', "template: { name: 'nav-home', foreach: list }");
        koBind(msg);
    }


    function koBind(msg) {
        
        var jdat = JSON.parse(msg);

        if (jdat.status == "100") {
            var viewModel = {
                list:ko.observableArray("") ,
            }
            var datalist = jdat.data.dataList;
            console.log('datalist::::', datalist);
            for (var i in index) {
                var code = index[i].code;
                for (var j in datalist) {
                    if (code == datalist[j].code) {
                        index[i].yearCount = datalist[j].yearCount;
                        index[i].monthCount = datalist[j].monthCount;
                        index[i].monthCompare = datalist[j].monthCompare;
                    }
                }
            }
            console.log('index::::', index);
       
            viewModel.list(index);
            $('#nav ul li').css("display","");
            var div = document.getElementById("nav");
            ko.cleanNode(div);
            ko.applyBindings(viewModel,div);
   
         
         
            $("[term]").each(function() {
                $(this).bind("click", function() {
                    var action = $(this).attr("term");
                    var parentUrl = window.location.href.split('#')[1].split('?')[0],
                        url;
                    if (action != "") {
                        url = "./index.html#/statistics/phase/term/" + action + "?parentUrl=" + parentUrl + "&token=" + token + "&companyCode=" + companyCode;
                    }
                    if (window.location.href.indexOf("regionId") != -1) {
                        url = url + "&regionId=" + getVal("regionId");
                    }
                    window.location.href = url;
                });
            });
        }
    
        else {
            errorPage();
        }
    }

    exports.init = function (category) {


        $.get("./statistics/phase2/template/home/nav.html", function (result) {
           // $('#nav').html(result);
            $('#nav').html(result);
            var api = "wgAdminView2Action!annualStatisticsInfo.action";
            var homedata = new Object();
            if (category == "branch") {
                if (getVal("regionId") != "") {
                    homedata.regionId = getVal("regionId");
                }
            }
            for (var x in postData) {
                homedata[x] = postData[x];
            }
            console.log(postData);
            post(api, homedata, koBind);

        });
      

    }
});
