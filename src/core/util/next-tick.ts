import { handleError } from "./error";
let pending = false;

let timerFunc;

const callbacks: Array<Function> = [];

export function nextTick(): Promise<void>;
export function nextTick<T>(
  this: T,
  cb: (this: T, ...args: any[]) => any
): void;
export function nextTick<T>(cb: (this: T, ...args: any[]) => any, ctx: T): void;

export function nextTick(cb?: (...args: any[]) => any, ctx?: object) {
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e: any) {
        handleError(e, ctx, "nextTick");
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== "undefined") {
    return new Promise((resolve) => {
      _resolve = resolve;
    });
  }
}
