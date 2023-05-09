// @ts-nocheck
import { popTarget, pushTarget } from "../observer/dep";
import config from "../config";
import { inBrowser } from "./env";
import { isPromise } from "../../shared/util";

export function handleError(err: Error, vm: any, info: string) {
  pushTarget();
  try {
    if (vm) {
      let cur = vm;
      while ((cur = cur.$parent)) {
        const hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (let i = 0; i < hooks.length; i++) {
            try {
              const capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) return;
            } catch (e: any) {
              globalHandleError(e, cur, "errorCaptured hook");
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

export function invokeWithErrorHandling(
  handler: Function,
  context: any,
  args: null | any[],
  vm: any,
  info: string
) {
  let res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res.isVue && isPromise(res) && !(res as any)._handled) {
      res.catch((e) => handleError(e, vm, info + ` (Promise/async)`));
      (res as any)._handled = true;
    }
  } catch (e: any) {
    handleError(e, vm, info);
  }
  return res;
}

function globalHandleError(err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info);
    } catch (e: any) {
      if (e !== err) {
        logError(e, null, "config.errorHandler");
      }
    }
  }
  logError(err, vm, info);
}

function logError(err, vm, info) {
  if (__DEV__) {
    console.warn(`Error in ${info}: "${err.toString()}"`, vm);
  }
  if (inBrowser && typeof console !== "undefined") {
    console.error(err);
  } else {
    throw err;
  }
}
