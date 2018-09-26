
var protocol = document.location.protocol;
if (protocol === 'http:') {
    /**正式环境**/
  //  var _HOME = "http://apiv36new.4001113900.com/";     //老接口 
  //  var _NewHome = "http://apiv37.4001113900.com:7001/" // h5接口
  //  var thirdBaseUrl = "http://192.168.20.200:3350/";   //第三方接口
  //  var _NewBaseUrl = "http://192.168.20.200:7000/";
  
  /**预发布环境**/
    // var _HOME = "http://h5.4001113900.com/";     //老接口 
    // var _NewHome = "http://apiv37.4001113900.com:7361/" //h5接口
    // var thirdBaseUrl = "http://apiv37.4001113900.com/";   //第三方接口
    // // var _NewBaseUrl = "http://192.168.20.200:7000/";
  
  /**开发环境**/
  var _HOME = "http://192.168.20.200:8100/lmweb/";  //老接口
  var _NewHome = "http://192.168.20.200:7360/";     // h5接口
  var thirdBaseUrl = "http://192.168.20.200:3350/"; //第三方接口

}else if (protocol === 'https:') {

    /**预发布环境**/
   var _HOME = "https://h5.4001113900.com/"; 	  //老接口
   var _NewHome = "https://apiv37.4001113900.com:7360/" //h5接口
   var thirdBaseUrl = "https://apiv37.4001113900.com/";    //第三方接口

    /**开发环境**/
  //  var _HOME = "http://192.168.20.200:8100/lmweb/"; 	  //老接口
  //  var _NewHome = "http://192.168.20.200:3360/" //h5接口
  //  var thirdBaseUrl = "http://192.168.20.200:3350/";    //第三方接口  
  
}


var _CLICK_MODEL = "click";//"touchstart";//
