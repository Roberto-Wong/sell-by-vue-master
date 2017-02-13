/**
 * Created by roberto on 2016/02/13.
 */

// 存储seller的属性
export function saveToLocal(id, key, value) {
  // _seller_ 相当于名称空间
  let seller = window.localStorage._seller_;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
  }
  if (!seller[id]) {
    seller[id] = {};
  }
  seller[id][key] = value;
  window.localStorage._seller_ = JSON.stringify(seller);
};

// 读取seller的属性
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage._seller_;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def;
  }
  let ret = seller[key];
  return ret || def;
};
/* export function saveToLocal(id, key, val) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = val;
  window.localStorage.__seller__ = JSON.stringify(seller);
};

export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def;
  }
  let ret = seller[key];
  return ret || def;
}; */
