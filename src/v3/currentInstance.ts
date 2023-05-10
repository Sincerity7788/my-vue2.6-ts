import { Component } from "../types/component";

export let currentInstance: Component | null = null;

export function getCurrentInstance(): { proxy: Component } | null {
  return currentInstance && { proxy: currentInstance };
}

/**
 * @internal
 */
export function setCurrentInstance(vm: Component | null = null) {
  if (!vm) currentInstance && currentInstance._scope.off();
  currentInstance = vm;
  vm && vm._scope.on();
}
