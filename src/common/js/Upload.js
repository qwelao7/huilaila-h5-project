/**
 * Created by fulin.liu on 2018/2/1.
 */

/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 * 用url方式表示的base64图片数据
 */
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
  let blob = new Blob(
    [new Uint8Array(content)],
    {type: mimeString});
  return {
    blob: blob,
    fileName: new Date().getTime() + '.jpg'
  };
}

let File = {
  dataURItoBlob: dataURItoBlob
}

export {
  File
}
