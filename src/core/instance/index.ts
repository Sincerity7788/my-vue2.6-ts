import { initMixin } from "./init";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { eventsMixin } from "./events";
import {lifecycleMixin} from "./lifecycle";

// 创建一个Vue方法
function Vue(){
    this._init();
}


//@ts-expect-error Vue has function type
initMixin(Vue)
// @ts-ignore
stateMixin(Vue)
// @ts-ignore
eventsMixin(Vue)
// @ts-ignore
lifecycleMixin(Vue)
// @ts-ignore
renderMixin(Vue)

Vue.prototype._init()
console.log(Vue.prototype)


// 导出Vue
export default Vue


