// 把组合的key放入结果集SKUResult
function add2SKUResult (SKUResult, combArrItem, sku) {
  var key = combArrItem.join(';');
  if (SKUResult[key]) { // SKU信息key属性
    SKUResult[key].count += parseInt(sku.productStock);
    SKUResult[key].prices.push(sku.productPrice);
    SKUResult[key].products.push(sku);
  } else {
    SKUResult[key] = {
      count: parseInt(sku.productStock),
      prices: [sku.productPrice],
      products: [sku]
    };
  }
  return SKUResult;
}

/**
 * 从数组中生成指定长度的组合
 * 方法: 先生成[0,1...]形式的数组, 然后根据0,1从原数组取元素，得到组合数组
 */
function combInArray (aData) {
  if (!aData || !aData.length) {
    return [];
  }

  var len = aData.length;
  var aResult = [];

  for (var n = 1; n < len; n++) {
    var aaFlags = getCombFlags(len, n);
    while (aaFlags.length) {
      var aFlag = aaFlags.shift();
      var aComb = [];
      for (var i = 0; i < len; i++) {
        aFlag[i] && aComb.push(aData[i]);
      }
      aResult.push(aComb);
    }
  }

  return aResult;
}

/**
 * 得到从 m 元素中取 n 元素的所有组合
 * 结果为[0,1...]形式的数组, 1表示选中，0表示不选
 */
function getCombFlags (m, n) {
  if (!n || n < 1) {
    return [];
  }

  var aResult = [];
  var aFlag = [];
  var bNext = true;
  var i, j, iCnt1;

  for (i = 0; i < m; i++) {
    aFlag[i] = i < n ? 1 : 0;
  }

  aResult.push(aFlag.concat());

  while (bNext) {
    iCnt1 = 0;
    for (i = 0; i < m - 1; i++) {
      if (aFlag[i] === 1 && aFlag[i + 1] === 0) {
        for (j = 0; j < i; j++) {
          aFlag[j] = j < iCnt1 ? 1 : 0;
        }
        aFlag[i] = 0;
        aFlag[i + 1] = 1;
        var aTmp = aFlag.concat();
        aResult.push(aTmp);
        if (aTmp.slice(-n).join('').indexOf('0') === -1) {
          bNext = false;
        }
        break;
      }
      aFlag[i] === 1 && iCnt1++;
    }
  }
  return aResult;
}

// 初始化处理原始的sku商品组合数据
function initSKU (productInfoList) {
  var SKUResult = {};
  var i;
  for (var product of productInfoList) {
    // propertyValueId: ['414', '420'],
    var sku = product;
    var skuKeyAttrs = product.propertyValueId;
    // 排序待确定是否需要，好像需要，
    skuKeyAttrs.sort(function (value1, value2) {
      return parseInt(value1) - parseInt(value2);
    });
    var combArr = combInArray(skuKeyAttrs);
    for (i = 0; i < combArr.length; i++) {
      add2SKUResult(SKUResult, combArr[i], sku);
    }
    SKUResult[skuKeyAttrs.join(';')] = {
      count: parseInt(sku.productStock),
      prices: [sku.productPrice],
      products: [sku]
    }
  }
  return SKUResult;
}

export {
  initSKU
}
