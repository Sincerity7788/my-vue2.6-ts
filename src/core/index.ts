import Vue from "./instance/index"
import { initGlobalAPI } from "./global-api";
import { isServerRendering } from "./util/env";
import { FunctionalRenderContext } from "./vdom/create-functional-component";
import { version } from "v3";

// 初始化Vue全局信息
// initGlobalAPI(Vue);

// 在 Vue 的原型上添加属性


Object.defineProperty(Vue.prototype, "$isServer", {
    get: isServerRendering
})


Object.defineProperty(Vue.prototype, "$ssrContext", {
    get(){
        return this.$vnode && this.$vnode.ssrContext
    }
})

Object.defineProperty(Vue.prototype, "FunctionalRenderContext", {
    get: FunctionalRenderContext
})


// Vue.version = version;



// 导出
export default Vue



