import type {Component} from "types/component";
import config from "../config";

// 定义全局uuid
let uid = 0;

export function initMixin(Vue: typeof Component){
    Vue.prototype._init = function (options?: Record<string, any>){
        // 保存当前实例对象
        const vm: Component = this;
        // 给当前实例添加uuid
        vm._uid = uid++;
        // 创建两个变量存储在内存中记录时间戳的名字
        let startTag, endTag;
        // 判断是不是开发环境
        if( __DEV__ && config.performance){
        }


    }


}
