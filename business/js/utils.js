document.write("<script src=\"./js/config.js?vv=22\"></script>");
document.write("<script src=\"./js/config.js\"></script>");
var _g_submit_lock = false;

function post(uRlNoRoot, jsonData, fuc,fucParam) {
    DoAjax(uRlNoRoot, jsonData, undefined, true, fuc, fucParam);
}

function DoAjax(uRlNoRoot, jsonData, loadingContent, async, fuc, fucParam) {
    lockSubmit();
    showLoading(loadingContent);
    
    uRlNoRoot = uRlNoRoot + ((uRlNoRoot.indexOf("?")==-1)?"?":"&")+ "sign=9c19d8b9dfab1d41a99bc54dced3a9795dd033c8&fieds=version&version=2";
    if (async == undefined) {
        async = false;
    }
    var obj;
    console.log(_HOME + uRlNoRoot);
    console.log(jsonData);
    var req = $.ajax({
        type: "post", url: _HOME + uRlNoRoot,
        async: async,
        cache: false,
        data: jsonData,
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "text",
        success: function (msg) {
            if (fuc != undefined) {
                //console.log("DoAjax异步:" + _HOME + uRlNoRoot + "\n\r结果：" + msg);
                fuc(msg, fucParam);
            }

            obj = msg;
            msg = null;
           
        },
        /* complete: function (XHR, TS) { XHR.abort(); XHR = null; TS = null },*/
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert("获取数据接口失败！"+errorThrown);
            errorPage();
            console.log("获取数据接口失败！" + errorThrown)
        }
    });

    //if (req) {
    //    req.abort()
    //}

    try {
        
        removeLoading();
        return obj;
    }
    catch (e) {
    }
    finally {
        obj = null;
    }

}


function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return "";
}

function setCookie(c_name, value) {
    document.cookie = c_name + "=" + escape(value);
 
}


var _SUCCESSED = "100";

function getParam(name) {
    name = name.toLowerCase();
    var params = location.search.substring(1).toLowerCase();
    var paramList = [];
    var param = null;
    var parami;
    if (params.length > 0) {
        if (params.indexOf("&") >= 0) {
            paramList = params.split("&");
        } else {
            paramList[0] = params;
        }
        for (var i = 0, listLength = paramList.length; i < listLength; i++) {
            parami = paramList[i].indexOf(name + "=");
            if (parami >= 0) {
                param = paramList[i].substr(parami + (name + "=").length);
            }
        }
    }
    return param;
}

function getParam2(name) {
    var params = location.search.substring(1);
    var paramList = [];
    var param = null;
    var parami;
    if (params.length > 0) {
        if (params.indexOf("&") >= 0) {
            paramList = params.split("&");
        } else {
            paramList[0] = params;
        }
        for (var i = 0, listLength = paramList.length; i < listLength; i++) {
            parami = paramList[i].indexOf(name + "=");
            if (parami >= 0) {
                param = paramList[i].substr(parami + (name + "=").length);
            }
        }
    }
    return param;
}

function getRouterParam(name) {
    var params = window.location.href.split('?')[1];
    if (params == null || params == undefined || typeof (params) == undefined) {
        return "";
    }

    var paramList = [];
    var param = null;
    var parami;
    var theRequest = new Object();
    if (params.length > 0) {
        if (params.indexOf("&") >= 0) {
            paramList = params.split("&");
        } else {
            paramList[0] = params;
        }
        for (var i = 0; i < paramList.length; i++) {
            theRequest[paramList[i].split("=")[0]] = (paramList[i].split("=")[1]);
        }
        param = theRequest[name];
        //for (var i = 0, listLength = paramList.length; i < listLength; i++) {
        //    parami = paramList[i].indexOf(name + "=");
        //    if (parami >= 0) {
        //        param = paramList[i].substr(parami + (name + "=").length);
        //    }
        //}
    }
    return param;
}


function JData()
{
    if (this.arr) { this.arr = [] }

}
JData.prototype = {
    arr: new Array(),
    
    //添加JSON键对值
    add: function (key, value) {
        this.arr.push({
            key: key,
            value: value
        })

    },
    //添加JSON键&URL参数Key，这里不传具体的值!
    addParams: function (key, paramKey) {
        //略写 paramKey,默认等同 key值
        paramKey = (typeof (paramKey) == undefined || paramKey == undefined) ? key : paramKey;

        this.arr.push({
            key: key,
            value:decodeURI(getParam(paramKey))
        })

    },
    getJson: function () {
        var jd = {}

        for (var i in this.arr)
        {
            eval("jd." + this.arr[i].key + "='" + this.arr[i].value + "';");
        }

        return jd;
    }
}

function isPhone(mobile) {
    var reg = /^0?1[0-9]\d{9}$/;

    return reg.test(mobile);
}


function formCached() {
    $("input[memory]").each(function () {
        var id = $(this).attr("id");
        var val1 = $(this).val();
        var val2 = $(this).text();

        var value = "";
        if (val1 != "") {
            value = val1;
        }
        if (val2 != "") {
            value = val2;
        }

        setCookie(id,value);
    });
}

function formCacheBind() {
    $("input[memory]").each(function () {
        var id = $(this).attr("id");
        var value = getCookie(id);

        $(this).val(value == null ? "" : value);
        $(this).text(value == null ? "" : value);
    });
}


function isLockSubmit() {
   return _g_submit_lock;
}
function unLockSubmit(){
    _g_submit_lock = false;
}
function lockSubmit() {
    _g_submit_lock = true;
}

function showLoading(content) {
    if (content == undefined || content == null) {
        content = "提交中...";
    }

    var loadingHtml=
    "<div id='loading' class='ui-loading-block show'>"+
        "<div class='ui-loading-cnt'>"+
            "<i class='ui-loading-bright'></i>"+
            "<p>"+content+"</p>"+
        "</div>"+
    "</div>";

    $("body").append(loadingHtml);
}
function removeLoading() {
    $("#loading").remove();
}


function submitBind(id, fuc_) {
    $(id).on(_CLICK_MODEL, function () {
            fuc_();
    });
}

function formatDate(now) {
   // alert("time");
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    return year + "-" + month + "-" + date;
}

function errorPage() {
    var height = document.documentElement.clientHeight;
    var div = '<div id="error" style="background-color:#f0f2f2;width:100%;position:absolute;z-index:9999;text-align:center;padding-top:50%;">' +
        '<img  width=150 src="../webApp/img/error@2x.png" /><br />' +
        ' <label style="display:inline-block;color:#334455;font-size:18px;padding-top:20px">获取数据出错</label>' +
        '</div>'
    // $('body').append(div);
    $("body").height(height + 'px');
    $("body").css("overflow-y", "hidden");
    $('body').html(div);
}