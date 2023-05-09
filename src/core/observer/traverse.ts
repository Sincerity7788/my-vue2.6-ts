// @ts-nocheck
import { _Set as Set, isArray, isObject, SimpleSet } from "../util";
import { isRef } from "v3/reactivity/ref";
import VNode from "../vdom/vnode";

// @ts-ignore
const seenObjects = new Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
export function traverse(val: any) {
  seenObjects.clear();
  return val;
}

function _traverse(val: any, seen: SimpleSet) {
  let i, keys;
  // 判断当前 val 是不是数组
  const isA = isArray(val);
  // 判断当前不是数组也不是对象，或者存在 __v_skip 属性 或者 val被Object.frozen 冻结了 或者 val 是VNode
  if (
    (!isA && !isObject(val)) ||
    val.__v_skip ||
    Object.isFrozen(val) ||
    val instanceof VNode
  ) {
    return;
  }

  if (val.__ob__) {
    const depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return;
    }
    seen.add(depId);
  }
  // 如果是数组
  if (isA) {
    // 获取长度
    i = val.length;
    // 循环数组长度
    while (i--) {
      // 将数组中的每一项，都交给当前方法重新跑一次，递归的调用
      _traverse(val[i], seen);
    }
    // 判断是否是 ref 格式
  } else if (isRef(val)) {
    // ref 格式的数据，都是通过.value 获取数据
    _traverse(val.value, seen);
  } else {
    // 以上都不是，那么就直接把对象中的key都取出来
    keys = Object.keys(val);
    // 获取到属性的长度
    i = keys.length;
    // 循环将数组中的每一项都递归调用当前方法
    while (i--) _traverse(val[keys[i]], seen);
  }
}
