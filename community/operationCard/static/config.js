/**
 * Created by muxi on 2017/10/10.
 */ (function() {
  var protocol, domain, port, homeURL;
  var webProtocol = document.location.protocol;
  /* 开发 */
  /*if (webProtocol === 'http:') {
   protocol = 'http'; // 协议
   domain = '192.168.20.200'; // 域名
   port = '7360'; // 端口
   homeURL = protocol + '://' + domain + ':' + port;
   } else if (webProtocol === 'https:') {
   protocol = 'https'; // 协议
   domain = 'shushuapi13.4001113900.com'; // 域名
   port = '443'; // 端口
   homeURL = protocol + '://' + domain + ':' + port;
   }*/

  /* 测试 */
  if (webProtocol === 'http:') {
    protocol = 'http'; // 协议
    domain = 'lmtest.afguanjia.com'; // 域名
    port = '7060'; // 端口
    homeURL = protocol + '://' + domain + ':' + port;
  } else if (webProtocol === 'https:') {
    protocol = 'https'; // 协议
    domain = 'apiv40.4001113900.com'; // 域名
    port = '7060'; // 端口
    homeURL = protocol + '://' + domain + ':' + port;
  }

  window.homeURL = homeURL;


  var commonConfig = {
    companyCode: 'hll',
    homeURL: homeURL,
    pageSize: 10
  };
  window.commonConfig = commonConfig;
})();
