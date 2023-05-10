import type { Component } from "types/component";
import { popTarget, pushTarget } from "../observer/dep";
import { invokeWithErrorHandling } from "../util";
import { currentInstance, setCurrentInstance } from "../../v3/currentInstance";

export function lifecycleMixin(Vue: typeof Component) {
  console.log("lifecycleMixin 方法");
}

function isInInactiveTree(vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) return true;
  }
  return false;
}

export function activateChildComponent(vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return;
    }
  } else if (vm._directInactive) {
    return;
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (let i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, "activated");
  }
}

export function callHook(
  vm: Component,
  hook: string,
  args?: any[],
  setContext = true
) {
  // #7573 disable dep collection when invoking lifecycle hooks
  // 调用生命周期挂钩时禁用 dep 收集
  pushTarget();
  const prev = currentInstance;
  setContext && setCurrentInstance(vm);
  const handlers = vm.$options[hook];
  const info = `${hook} hook`;

  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, args || null, vm, info);
    }
  }

  if (vm._hasHookEvent) {
    vm.$emit("hook:" + hook);
  }
  setContext && setCurrentInstance(prev);
  popTarget();
}
