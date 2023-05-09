// @ts-nocheck
// 导出当前运行环境是否为浏览器
export const inBrowser = typeof window !== "undefined";

// 导出判断当前是否在ssr环境中 isServerRendering
export function isServerRendering() {
  console.log("判断当前是否在ssr环境中");
}

export function isNative(Ctor: any): boolean {
  return typeof Ctor === "function" && /native code/.test(Ctor.toString());
}

let _Set; // $flow-disable-line
if (typeof Set !== "undefined" && isNative(Set)) {
  console.log("是进入到了这么", Set);
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = class Set implements SimpleSet {
    set: Record<string, boolean> = Object.create(null);
    has(key: string | number) {
      return this.set[key] === true;
    }
    add(key: string | number) {
      return (this.set[key] = true);
    }
    clear() {
      this.set = Object.create(null);
    }
  };
}

export interface SimpleSet {
  has(key: string | number): boolean;
  add(key: string | number): any;
  clear(): void;
}

export { _Set };
