/**
 * author: maoyouwei
 */
document.write("<script src=\"./js/config.js\"></script>");
document.write("<script src=\"../js/config.js\"></script>");
document.write("<script src=\"../../js/config.js\"></script>");
function DoAjax(uRlNoRoot, jsonData)
{
    uRlNoRoot = uRlNoRoot + "?sign=9c19d8b9dfab1d41a99bc54dced3a9795dd033c8&fieds=version&version=2";
    var obj;
    var req = $.ajax({
        type: "post", url: _HOME+ uRlNoRoot,
        async: false,
        cache: false,
        data: jsonData,
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        dataType: "text",
        success: function (msg) { obj = msg; msg = null; },
        /* complete: function (XHR, TS) { XHR.abort(); XHR = null; TS = null },*/
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert("获取数据接口失败！"+errorThrown);
        }
    });

    if (req) {
        req.abort()
    }

    try {
        return obj;
    }
    catch (e) {
    }
    finally {
        obj = null;
    }
}


//json处理类（仅仅一级json键对值）/*使用方法：var jd=new  JData();jd.add("1","22");jd.add("33","55");alert(jd.toJson());*/
function JData() { }
JData.prototype = {
    data: '',
    pdata: '',
    add: function (key, value,keyQueue) {
        if (typeof (value) == undefined || value == null || value == undefined) {
            value = "";
        }
 
        this.pdata += '&' + key + '=' + encodeURI(value);//url need encode again

        if (this.data != '') { this.data += ","; }

        if (isNaN(value)) {
            value=value.replace(/\"/g, "'").replace(/\'/g, "'");
        }

        if (typeof (keyQueue) != undefined && keyQueue != null && keyQueue != undefined) {
            key = "\"" + key + "\"";
        }

        this.data += '' + key + ':"' + value + '"';
    },
    /*sdf */
    addChildren: function (key, value) {
        if (this.data != '') { this.data += ","; }
        this.data += '' + key + ':[' + value + ']';
    },
    addChildren2: function (key, value) {
        if (this.data != '') { this.data += ","; }
        this.data += '' + key + ':"[' + value + ']"';
    },
    toJson: function () {
        return '{' + this.data + '}';
    },
    toCJson: function () {
        return '{' + this.data.replace(/\"/g, "'") + '}';
    },
    toUrlParams: function () {
        return this.pdata;
    },
    clear: function () {
        this.data = '';
        this.pdata = '';
    }, initRequestHead: function (requestHead) {
        this.data = requestHead;
    }
}
 

function ReplaceQuote(jdata) {
    return "[" + jdata.replace(/\"/g, "'") + "]";
}

function ReplaceQuote(jdata) {
    return "[" + jdata.replace(/\"/g, "'") + "]";
}
function toCJson(jdata) {
    return "[" + jdata + "]";
}
function getRequestHead() {
    return 'token:"' + getParam2("token") + '",version:"' + getParam2("version") + '",companyCode:"' + getParam2("companyCode") + '",fieds:"' + getParam2("fieds") + '",sign:"' + getParam2("sign") + '"';
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