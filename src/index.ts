import Vue from "./core";
import {parsePath} from "./core/util";
const fn = parsePath("aa.bb.cc")
const obj = {
  aa: {
    bb: {
      cc: "这个是最里层的数据"
    }
  }
}
console.log(fn, fn(obj))
console.log(Vue);
console.log("入口文件")
