import Dep from "core/observer/dep";

declare const RefSymbol: unique symbol;
export const RefFlag = `__v_isRef`;

export interface Ref<T = any> {
  value: T;
  /**
   * Type differentiator only.
   * We need this to be in public d.ts but don't want it to show up in IDE
   * autocomplete, so we use a private Symbol instead.
   * 仅类型微分器。
   * 我们需要它在公共 d.ts 中，但不希望它出现在 IDE 中
   * 自动完成，所以我们改用私有符号。
   */
  [RefSymbol]: true;
  dep?: Dep;
  [RefFlag]: true;
}

export function isRef<T>(r: Ref<T> | unknown): r is Ref<T>;
export function isRef(r: any): r is Ref {
  return !!(r && (r as Ref).__v_isRef === true);
}
