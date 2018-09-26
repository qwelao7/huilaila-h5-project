/**
 * Created by muxi on 2017/7/13.
 */
let canvasSupported = isCanvasSupported();

function dataURItoBlob (dataURI) {
  // convert base64 to raw binary data held in a string
  let byteString, mimeString;
  if (dataURI.split(',')[0].indexOf('base64') !== -1) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = decodeURI(dataURI.split(',')[1]);
  }
  mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  let content = [];
  for (let i = 0; i < byteString.length; i++) {
    content[i] = byteString.charCodeAt(i)
  }
  return new Blob(
    [new Uint8Array(content)],
    {type: mimeString});
}

function imgScale (src, scale, cb) {
  if (!src) {
    return cb(false);
  }
  let _canvas = document.createElement('canvas');
  let tImg = new Image();
  tImg.onload = function () {
    _canvas.height = tImg.height;
    _canvas.width = tImg.width;
    let _context = _canvas.getContext('2d');
    _context.drawImage(tImg, 0, 0);
    let type = 'image/jpeg';
    src = _canvas.toDataURL(type, scale);
    let blob = dataURItoBlob(src);
    cb(blob);
  };
  tImg.src = src
}

/**
 * 根据文件大小,动态计算压缩比例
 * @param fileSize
 * @returns {number}
 */
function getScaleByFileSize (fileSize) {
  let scale = 1;
  if (fileSize > 102400 && fileSize <= 307200) { // [100kb, 300kb]
    scale = 0.92; // 默认值
  } else if (fileSize > 307200 && fileSize <= 512000) { // [300kb, 500kb]
    scale = 0.5;
  } else if (fileSize > 512000 && fileSize <= 1024000) { // [500kb, 1mb]
    scale = 0.1;
  } else if (fileSize > 1024000) {
    scale = 0.01;
  }
  return scale;
}
/**
 * 是否支持canvas
 * @returns {boolean}
 */
function isCanvasSupported () {
  let ele = document.createElement('canvas');
  return !!(ele.getContext && ele.getContext('2d'));
}

exports.support = canvasSupported;

/**
 * 压缩图片
 * @param files 图片文件数组
 * @param opt 压缩选项(scale:压缩比例)
 * @param cb 压缩完成后的回调函数
 * @returns {*}
 */
exports.zip = function (files, opt, showPreviews, saveFile) {
  opt = opt || {}
  let scale = opt.scale;
  let zipedFiles = [];
  let previews = [];
  let filesCount = files.length;
  let previewCount = files.length;
  if (!canvasSupported || scale === 1) {
    for (let i = 0, j = files.length; i < j; i++) {
      let file = files[i];
      zipedFiles.push({
        file: file,
        fileName: file.name,
        type: 'unzipped'
      });
      let fReader = new FileReader();
      fReader.onload = function (e) {
        let result = e.target.result;
        result && previews.push(result);
        previewCount--;
        if (previewCount <= 0) {
          showPreviews(previews);
        }
      };
      fReader.readAsDataURL(files[i]);
    }
    saveFile(zipedFiles);
    return;
  }
  // 开始压缩
  for (let i = 0, j = files.length; i < j; i++) {
    let file = files[i];
    let fileName = file.name;
    let fileSize = file.size;
    scale = getScaleByFileSize(fileSize);
    let fReader = new FileReader();
    fReader.onload = function (e) {
      let result = e.target.result;
      result && previews.push(result);
      previewCount--;
      if (previewCount <= 0) {
        showPreviews(previews);
      }
      if (fileSize <= 102400) { // 小于100kb(100*1024)的文件,不进行压缩
        zipedFiles.push({
          file: file,
          fileName: fileName,
          type: 'unzipped'
        });
        filesCount--;
        if (filesCount <= 0) {
          saveFile && saveFile(zipedFiles);
        }
      } else {
        imgScale(result, scale, function (blob) {
          blob && zipedFiles.push({
            file: blob,
            fileName: fileName,
            type: 'zipped'
          });
          filesCount--;
          if (filesCount <= 0) {
            saveFile && saveFile(zipedFiles);
          }
        })
      }
    };
    fReader.readAsDataURL(files[i]);
  }
}
