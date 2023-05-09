// @ts-nocheck
import Watcher from "../../core/observer/watcher";

export let activeEffectScope: EffectScope | undefined;

export class EffectScope {
  active = true;
  effects: Watcher[] = [];
  cleanups: (() => void)[] = [];
  parent: EffectScope | undefined;
  scopes: EffectScope[] | undefined;
  _vm?: boolean;

  private index: number | undefined;

  // 实例的构造函数
  constructor(public detached = false) {
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      // 给当前 index 赋值如果activeEffectScope.scopes有值就直接push得到长度 没有就赋值一个数组，在push得到长度最后 - 1
      this.index =
        (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
    }
  }

  // 实例的 run 方法
  run<T>(fn: () => T): T | undefined {
    if (this.active) {
      // 保存一下当前的 activeEffectScope
      const currentEffectScope = activeEffectScope;
      try {
        // 将 activeEffectScope 赋值为当前run方法的调用者
        activeEffectScope = this;
        return fn();
      } finally {
        // 等待方法执行结束，将 activeEffectScope 赋值为上面 currentEffectScope 保存的内容
        activeEffectScope = currentEffectScope;
      }
    } else if (__DEV__) {
      // 如果是开发环境，提示一下  无法运行非活动效果范围
      console.warn(`cannot run an inactive effect scope.`);
    }
  }

  /**
   * 实例的 on 方法
   * This should only be called on non-detached scopes
   * 这应该只在非分离范围内调用
   * */
  on() {
    activeEffectScope = this;
  }

  /**
   * 实例的 off 方法
   * This should only be called on non-detached scopes
   * 这应该只在非分离范围内调用
   * */
  off() {
    activeEffectScope = this.parent;
  }
  /**
   * 实例的 stop 方法
   * @param [fromParent] 可选参数
   * */
  stop(fromParent?: boolean) {
    // 判断当前 active
    if (this.active) {
      // 创建两个临时变量
      let i, l;
      // 循环实例的 effects 数组
      for (i = 0, l = this.effects.length; i < l; i++) {
        // 调用数组中每一项的 teardown 方法
        this.effects[i].teardown();
      }
      // 循环实例的 cleanups 数组
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        // 执行数组中的每一项
        this.cleanups[i]();
      }
      // 判断实例的 scopes
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          // 执行数组中的每一项
          this.scopes[i].stop(true);
        }
      }
      // 判断当前实例在实例化接收到的 detached 参数，以及 parent 和 fromParent
      if (!this.detached && this.parent && !fromParent) {
        // 删除 parent 中的最后一项，拿到删除项保存
        const last = this.parent.scopes!.pop();
        // 判断是否有最后一项，判断最后一项是否等于当前调用者
        if (last && last !== this) {
          // 将 last 赋值给 this.parent.scopes 数组 this.index 位置
          this.parent.scopes![this.index!] = last;
          // 将当前  last.index 赋值为 this.index
          last.index = this.index!;
        }
      }
      // 将 parent 置为 undefined
      this.parent = undefined;
      this.active = false;
    }
  }
}

// 导出一个获取当前 EffectScope 的方法
export function effectScope(detached?: boolean) {
  return new EffectScope(detached);
}

// 导出一个给实例上的 effects 添加元素的方法
export function recordEffectScope(
  effect: Watcher,
  scope: EffectScope | undefined = activeEffectScope
) {
  // 判断传递进来的 scope的active是否为true
  if (scope && scope.active) {
    // 给  scope.effects 添加传递进来的 effect
    scope.effects.push(effect);
  }
}

// 导出一个获取当前 activeEffectScope 的方法
export function getCurrentScope() {
  return activeEffectScope;
}

// 暂时不知道干啥的，有点像activeEffectScope这个实例在清理的时候需要执行的方法，onScopeDispose方法就是给activeEffectScope.cleanup添加回调函数的方法
export function onScopeDispose(fn: () => void) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  } else if (__DEV__) {
    // onScopeDispose() 在没有活动效果范围时被调用与之关联。
    console.warn(
      `onScopeDispose() is called when there is no active effect scope` +
        ` to be associated with.`
    );
  }
}
