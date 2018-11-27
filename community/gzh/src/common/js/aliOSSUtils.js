import OSS from 'ali-oss';
import Cookie from './cookie'
import {jlDate, JString} from './utils'
const AliOSSUtil = {}

function generateKey (path, fileName) {
  let timeSuffix = jlDate.Dateformat2(new Date(), 'yyyyMMddhhmmss');
  let uuidSuffix = JString.replaceAll(Math.uuid().toLowerCase(), '-', '');
  let fileExt = '.' + fileName.split('.')[1];
  let objectKey = '';
  if (path) {
    objectKey += ('/' + path + '/' + timeSuffix + '/' + uuidSuffix + fileExt);
  } else {
    objectKey += ('/' + timeSuffix + '/' + uuidSuffix + fileExt);
  }
  return objectKey;
}

function getClient (func) {
  // 先从cookie获取oss-client,获取不到,则动态创建
  let clientConfig;
  let clientCookieContent = Cookie.get('sts_token');
  if (clientCookieContent) {
    clientConfig = JSON.parse(clientCookieContent);
    return func(clientConfig);
  }
  // 调用自有服务器获取ali-oss的sts配置
  return OSS.urllib.request(window.aliOSSServer, {
    method: 'GET'
  }).then(function (result) {
    var creds = JSON.parse(result.data);
    clientConfig = {
      region: window.commonConfig.aliOSSConfig.region,
      accessKeyId: creds.AccessKeyId,
      accessKeySecret: creds.AccessKeySecret,
      stsToken: creds.SecurityToken,
      bucket: window.commonConfig.aliOSSConfig.bucket
    }
    // sts配置过期时间
    let Expiration = creds.Expiration;
    // 将sts配置植入cookie
    Cookie.set('sts_token', JSON.stringify(clientConfig), {
      expires: new Date(Expiration)
    });
    return func(clientConfig);
  });
};

AliOSSUtil.uploadFile = function (files, path, cb, progressCB) {
  if (!files || !files.length) {
    console.error('文件数组不能为空');
    return;
  }
  let count = files.length;
  getClient(function (clientConfig) {
    let client = new OSS(clientConfig);
    // 定义上传方法
    async function multipartUpload (files) {
      // 循环上传
      for (let i = 0; i < count; i++) {
        let file = files[i];
        try {
          let objectKey = path ? path + '/' + file.name : file.name;
          let result = await client.multipartUpload(objectKey, file, {
            progress: async function (progress) {
              if (progressCB) {
                progressCB({
                  progress: progress,
                  index: i
                });
              }
            }
            // meta: file.type
          });
          var aliPath = result.name;
          var singleRes = {
            path: aliPath,
            name: file.name,
            fileSize: file.size,
            index: i
          }
          if (cb) cb(singleRes);
        } catch (e) {
          console.log(e);
        }
      }
    }
    multipartUpload(files);
  });
}

AliOSSUtil.uploadBlob = function (blobs, path, cb, progressCB, finishCB) {
  if (!blobs || !blobs.length) {
    console.error('blobs数组不能为空');
    return;
  }
  let count = blobs.length;
  getClient(function (clientConfig) {
    let client = new OSS(clientConfig);
    // 定义上传方法
    async function multipartUpload (blobs) {
      // 循环上传
      let resultList = [];
      for (let i = 0; i < count; i++) {
        let file = blobs[i];
        try {
          let objectKey = generateKey(path, file.fileName);
          let result = await client.put(objectKey, file.blob, {
            progress: async function (progress) {
              if (progressCB) {
                progressCB({
                  progress: progress,
                  index: i
                });
              }
            }
            // meta: file.type
          });
          var aliPath = result.name;
          var singleRes = {
            path: aliPath,
            fileName: file.fileName,
            index: i
          }
          if (cb) cb(singleRes);
          resultList.push(aliPath);
        } catch (e) {
          console.log(e);
        }
      }
      if (finishCB) {
        finishCB(resultList);
      }
    }
    multipartUpload(blobs);
  });
}

AliOSSUtil.uploadBlobProfile = function (blobs, path, cb, progressCB, finishCB) {
  if (!blobs || !blobs.length) {
    console.error('blobs数组不能为空');
    return;
  }
  let count = blobs.length;
  getClient(function (clientConfig) {
    let client = new OSS(clientConfig);
    // 定义上传方法
    async function multipartUpload (blobs) {
      // 循环上传
      let resultList = [];
      for (let i = 0; i < count; i++) {
        let file = blobs[i];
        try {
          let objectKey = generateKey(path, file.fileName);
          let result = await client.put(objectKey, file.blob, {
            progress: async function (progress) {
              if (progressCB) {
                progressCB({
                  progress: progress,
                  index: i
                });
              }
            }
            // meta: file.type
          });
          var aliPath = result.name;
          var singleRes = {
            path: aliPath,
            fileName: file.fileName,
            index: i
          }
          var singleRes1 = {
            profilePath: aliPath,
            profileName: file.fileName,
            profileSize: 0
          }
          if (cb) cb(singleRes);
          resultList.push(singleRes1);
        } catch (e) {
          console.log(e);
        }
      }
      if (finishCB) {
        finishCB(resultList);
      }
    }
    multipartUpload(blobs);
  });
}

AliOSSUtil.download = function (objectKey, filename, cb) {
  // 兼容老版本,返回绝对路径的情况
  if (objectKey.indexOf('.com/') !== -1) {
    let tmpRes = objectKey.split('.com/');
    let len = tmpRes.length;
    if (len === 2) {
      objectKey = tmpRes[1];
    } else if (len === 3) { // 兼容后台拼错,出现两个图片域名的情况
      objectKey = tmpRes[2];
    } else if (len === 4) { // 兼容后台拼错,出现两个图片域名的情况
      objectKey = tmpRes[3];
    }
  }
  getClient(function (clientConfig) {
    let client = new OSS(clientConfig);
    let result = client.signatureUrl(objectKey, {
      response: {
        'content-disposition': 'attachment; filename="' + filename + '"'
      }
    });
    result = window.aliyunHome + result.split('.com')[1];
    cb(result);
  });
}

/***
 * 对图片适配处理
 * @param objectKey 图片key
 * @param width 图片宽度,默认值100
 * @param height 图片高度,默认值100
 */
AliOSSUtil.fitImg = function (objectKey, cb, width = 100, height = 100) {
  // 图片适配不同机型(等价于rem布局)
  let htmlFontSize = getComputedStyle(window.document.documentElement)['font-size'];
  let remRate = parseFloat(htmlFontSize.substring(0, (htmlFontSize.length - 2)));
  let remWidth = width / window.commonConfig.baseSize;
  let remHeight = height / window.commonConfig.baseSize;
  let fitWidth = (remWidth * remRate).toFixed(0);
  let fitHeight = (remHeight * remRate).toFixed(0);
  if (objectKey.indexOf('://') === -1) { // 返回相对路径(ali-oss的key)
    getClient(function (clientConfig) {
      let client = new OSS(clientConfig);
      // 增加图片处理逻辑(固定宽高，自动裁剪) (默认100*100)
      let result = client.signatureUrl(objectKey, {
        process: `image/resize,m_fill,w_${fitWidth},h_${fitHeight},limit_0`
      });
      cb(result);
    });
  } else if (objectKey.indexOf('aliyuncs.com/') !== -1) { // 兼容老版本,返回多个图片域名的情况
    let tmpRes = objectKey.split('aliyuncs.com/');
    let len = tmpRes.length;
    if (len === 2) {
      objectKey = tmpRes[1];
    } else if (len === 3) { // 兼容后台拼错,出现两个图片域名的情况
      objectKey = tmpRes[2];
    } else if (len === 4) { // 兼容后台拼错,出现两个图片域名的情况
      objectKey = tmpRes[3];
    }
    getClient(function (clientConfig) {
      let client = new OSS(clientConfig);
      // 增加图片处理逻辑(固定宽高，自动裁剪) (默认100*100)
      let result = client.signatureUrl(objectKey, {
        process: `image/resize,m_fill,w_${fitWidth},h_${fitHeight},limit_0`
      });
      cb(result);
    });
  } else {
    cb(objectKey);
  }
}

/***
 * 将图片适配成小图(100 * 100)
 * @param objectKey 图片key
 */
AliOSSUtil.fitImgSmall = function (objectKey, cb) {
  this.fitImg(objectKey, cb);
}

/***
 * 将图片适配成小图(150 * 150)
 * @param objectKey 图片key
 */
AliOSSUtil.fitImgMid = function (objectKey, cb) {
  this.fitImg(objectKey, cb, 120, 120);
}

/***
 * 将图片适配成小图(350 * 350)
 * @param objectKey 图片key
 */
AliOSSUtil.fitImgBig = function (objectKey, cb) {
  this.fitImg(objectKey, cb, 350, 350);
}

export default AliOSSUtil
