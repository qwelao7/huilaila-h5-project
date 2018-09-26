
var protocol = document.location.protocol;
if (protocol === 'http:') {
  //预发布环境
   var _HOME = "http://h5.4001113900.com/"; 
  //测试环境
 // var _HOME = "https://api.4001113900.com:6080/"; 
   //开发环境
   //var _HOME = "http://192.168.20.200:8100/lmweb/";  

}else if (protocol === 'https:') {
  //预发布环境
  var _HOME = "https://h5.4001113900.com/"; 
  //测试环境
  // var _HOME = "http://api.4001113900.com:6080/"; 
  //开发环境
  //var _HOME = "http://192.168.20.200:8100/lmweb/";  
  
}




//开发环境
var _CLICK_MODEL = "click";//"touchstart";//



