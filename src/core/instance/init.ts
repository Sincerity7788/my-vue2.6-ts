import type {Component} from "types/component";
import config from "../config";
import {mark} from "../util/perf";

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
          // 保存标记
          startTag = `vue-perf-start:${vm._uid}`
          endTag = `vue-perf-end:${vm._uid}`
          // 开始性能记录
          mark(startTag);
        }

        // 给 实例打上 vue 标记
        vm._isVue = true;
        // 避免实例被观察到
        vm.__v_skip = true;


    }


}
