


define(function (require, exports, module) {
    require("ko");
    require("frozencss");
    require("appcss");

    var rank = [{
        companyType: "company",
        colums: ["全国排名", "分公司名", "数据"],
        codes: ["ranking", "regionName", "data"],
        codeid: ["regionId", "regionName"]
    }, {
        companyType: "project",
        colums: ["全国排名", "项目名称", "数据"],
        codes: ["ranking", "communityName", "data"],
        codeid: ["communityId", "communityName"]

    }]

    function renderPage_call_back(responseText, param) {
        var jdat = JSON.parse(responseText);
        var rankPropertys = [];
        for (var idx in rank) {
            var companyType = rank[idx].companyType;
            if (companyType == param.companytype) {//相同模块
                rankPropertys = rank[idx];
                break;
            }
        }
        console.log(rankPropertys);
        var codes;
        var ranktemplateStr = "";
        codes = rankPropertys.codes;
        for (j = 0; j < codes.length; j++) {
            //标题模板
            if (j == codes.length - 1) {//最后一列不要竖线
                ranktemplateStr += '<li class="ui-col ui-col-25 ui-flex-pack-center  "><div class="ui-txt-justify" style="line-height:44px;height:44px;text-align:center" data-bind="text:' + codes[j] + ',style:{color:changeValue>0 ? \'#00ae08\':\'#c6444c\'}"></div></li>';
            }
            else if (j == 0) {
                ranktemplateStr += '<li class="ui-col ui-col-25 ui-flex-pack-center ui-border-r" data-bind="attr:{' + rankPropertys.codeid[0] + ':' + rankPropertys.codeid[0] + ',' + rankPropertys.codeid[1] + ':' + rankPropertys.codeid[1] + '}"><div style="width: 100%; height: 44px;  display: table;">' +
                    '<div class="li-div-txt" style="text-align:center;width:30%"><p class="ui-txt-justify" style="color:#334455;float:right"data-bind="text:' + codes[j] + '"></p></div>' +
                    '<div class="li-div-txt" style="width:35%;padding-left:10px"> <p style="" data-bind="css:{\'arrow-up\':changeValue>0,\'arrow-down\':changeValue<0 }" ></p></div>' +
                    '<div class="li-div-txt" style="text-align:center;width:35%"><div data-bind="if:changeValue==0"> <p style="font-size:11px;float:left" class="arrow-level" ></p></div>' +
                    '<div data-bind="if:changeValue!=0"> <p style="font-size:11px;float:left" data-bind="text:changeValue,style:{color:changeValue>0?\'#00ae08\':\'#c6444c\'}"></p></div></div>' +
                    '</div></li>';
            }
            else {
                ranktemplateStr += '<li class="ui-col ui-col-50  ui-flex-pack-center ui-border-r"><div class="ui-txt-justify" style="color:#334455;font-size:13px;line-height:44px;height:44px;text-align:center;text-decoration:underline" data-bind="text:' + codes[j] + '"></div></li>';
            }
        }
      
        if ($('#columns-ranktemplate').html() == undefined) {
            $('#' + param.id).append('<script type="text/html" id="columns-ranktemplate">' + ranktemplateStr + '</script>');
        }
        else {
            $('#' + param.id+' #columns-ranktemplate').html(ranktemplateStr);
        }
       
        
      //  $("#columns-ranktemplate").attr(ranktemplateStr);
        koBind(jdat, param.companytype, rankPropertys, param);

        $('body').css("overflow", "auto");
    }

    function koBind(jdat,companytype, propertys,param) {
   
        if (jdat.status == "100") {
            var orderStr = (getVal("order") == 0) ? "指标数据排名前10名" : "指标数据倒数10名";

            var viewModel = {
                date: jdat.data.date,
                list: jdat.data.resultList,
                colums: propertys.colums,
                order: orderStr,              
            }

            var div = document.getElementById(param.id);
            ko.cleanNode(div);
            ko.applyBindings(viewModel, div);
            //跳转
            $('#' + param.id + ' #list ul').each(function () {
                $(this).bind("click", function () {
                    var parentUrl = window.location.href.split('#')[1].split('?')[0];
                    if (companytype == "company") {
                        var regionid = $(this).find('li').eq(0).attr('regionId');
                        var regionname =  encodeURIComponent($(this).find('li').eq(0).attr('regionName'));
                        window.location.href = "./index.html#/statistics/phase/home/branch?parentUrl=" + parentUrl +
                                                                                                  "&regionId=" + regionid +
                                                                                                  "&token=" + token +
                                                                                                  "&companyCode=" + companyCode +
                                                                                                  "&regionName=" + regionname;
                    }
                    else if (companytype == "project") {
                        var communityid = $(this).find('li').eq(0).attr('communityId');
                        var communityname =  encodeURIComponent($(this).find('li').eq(0).attr('communityName'));
                        window.location.href = "./index.html#/statistics/home/realtime?parentUrl=" + parentUrl +
                                                                                           "&communityId=" + communityid +
                                                                                           "&token=" + token +
                                                                                           "&companyCode=" + companyCode +
                                                                                           "&communityName=" + communityname;
                    }
                });
            });
       
         
       
         
            $('#' + param.id + ' button').bind("touchstart",  function () {
                console.log("11111111");
                var parentUrl = window.location.href.split('#')[1].split('?')[0];
                var url=  "./index.html#/statistics/phase/rankdetail/" + companytype + "/" + param.id +
                    "?token=" + token +
                    "&parentUrl=" + parentUrl+
                    "&companyCode=" + companyCode +
                    "&newOrder=" + (getVal("order") == "" ? 0 : getVal("order"));
                window.location.href = getVal("regionId") == "" ? url : url + "&regionId=" + getVal("regionId");
            });
            $('#' + param.id + ' button').click(function (e) {
                e.preventDefault();
            })
           

        }
       
        else {
            errorPage();
        }
    }
    module.exports = {
        init: function (companytype, category, id) {
            var fucParam = [];
            fucParam.push({ id: id, category: category, companytype: companytype });


            $.get("./statistics/phase2/template/rank/rank.html", function (result) {
                $('#' + id).html(result);
                var api = "wgAdminView2Action!" + category + ".action";
                var order = 0;
                order = window.location.href.indexOf("order=0") != -1 ? 0 : -1;
                var rankdata = new Object();
                for (var x in postData) {
                    rankdata[x] = postData[x];
                }
                rankdata.pageSize = 10;
                rankdata.order = getVal("order") == "" ? 0 : getVal("order");
                rankdata.curPage = 1;
                rankdata.date = formatDate(new Date());
                if (getVal("regionId") != "") {
                    rankdata.regionId = getVal("regionId");
                }
               
                post(api, rankdata, renderPage_call_back, fucParam[0]);
            });
        }
    }
});

