/**
 * Created by muxi on 2017/8/16.
 */
(function () {
    var high_api = getParam('high_api');
    if(!high_api || high_api === ''){
        $("[sign='h']").remove();
    }
})()
function changeSlt(obj){
    var url = $(obj).attr("src");
    if(url.indexOf("chked") !== -1){
        $(obj).attr("src","img/unchk.png")
    }
    else{
        $(obj).attr("src","img/chked.png")
    }
}

function Oauth() {
    var url=$("#chk").attr("src");
    var appId = getParam2('appId');
    var code = getParam2('code');
    var redirect_url = getParam('redirect_url');
    var high_api = "";
    if(url && url.indexOf("chked") !== -1){
        high_api="true";
    }

    window.location.href = _HOME + "OauthAction!submitOauth.action?appid=" + appId + "&code=" + code + "&redirect_url=" + redirect_url + "&high_api=" + high_api;
}