import Dep, { cleanupDeps } from "./dep";
import type { Component } from "types/component";
import type Watcher from "./watcher";
import config from "../config";
import { devtools, nextTick } from "../util";
import { callHook, activateChildComponent } from "../instance/lifecycle";

export const MAX_UPDATE_COUNT = 100;
const activatedChildren: Array<Component> = [];
let has: { [key: number]: true | undefined | null } = {};
let circular: { [key: number]: number } = {};
let flushing = false;
let waiting = false;
let index = 0;

const queue: Array<Watcher> = [];

export let currentFlushTimestamp = 0;

let getNow: () => number = Date.now;

function resetSchedulerState() {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (__DEV__) {
    circular = {};
  }
  waiting = flushing = false;
}

const sortCompareFn = (a: Watcher, b: Watcher): number => {
  if (a.post) {
    if (!b.post) {
      return 1;
    }
  } else if (b.post) {
    return -1;
  }
  return a.id - b.id;
};

/**
 * Flush both queues and run the watchers.
 *
 * 刷新两个队列并运行观察者。
 */
function flushSchedulerQueue() {
  currentFlushTimestamp = getNow();
  flushing = true;
  let watcher, id;
  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  // 刷新前排序队列。
  // 这确保：
  // 1. 组件从父级更新到子级。 （因为父母总是
  // 在孩子之前创建）
  // 2. 组件的用户观察器在其渲染观察器之前运行（因为
  // 用户观察者在渲染观察者之前被创建）
  // 3. 如果一个组件在父组件的 watcher 运行期间被销毁，
  // 它的观察者可以被跳过。

  queue.sort(sortCompareFn);

  // do not cache length because more watchers might be pushed
  // as we run existing watchers

  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }

    id = watcher.id;
    // 从仓库中删除这个watcher
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.

    if (__DEV__ && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        console.warn(
          "You may have an infinite update loop " +
            (watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`),
          watcher.vm
        );
        break;
      }
    }
  }

  // keep copies of post queues before resetting state
  // 在重置状态之前保留发布队列的副本
  const activatedQueue = activatedChildren.slice();
  const updatedQueue = queue.slice();
  // 重置的方法
  resetSchedulerState();

  // call component updated and activated hooks
  // 调用组件更新和激活的钩子
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);
  cleanupDeps();

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit("flush");
  }
}

function callUpdatedHooks(queue: Watcher[]) {
  let i = queue.length;
  while (i--) {
    const watcher = queue[i];
    const vm = watcher.vm;
    if (vm && vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, "updated");
    }
  }
}

function callActivatedHooks(queue) {
  for (let i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 * 将观察者推入观察者队列。
 * 具有重复 ID 的作业将被跳过，除非它是
 * 在刷新队列时推送
 */

export function queueWatcher(watcher: Watcher) {
  const id = watcher.id;
  if (has[id] != null) {
    return;
  }

  if (watcher === Dep.target && watcher.noRecurse) {
    return;
  }

  has[id] = true;
  if (!flushing) {
    queue.push(watcher);
  } else {
    // if already flushing, splice the watcher based on its id
    // if already past its id, it will be run next immediately.
    let i = queue.length - 1;
    while (i > index && queue[i].id > watcher.id) {
      i--;
    }
    // 删除当前 i 位置
    queue.splice(i + 1, 0, watcher);
  }
  // queue the flush
  if (!waiting) {
    waiting = true;

    if (__DEV__ && !config.async) {
      flushSchedulerQueue();
      return;
    }
    nextTick(flushSchedulerQueue);
  }
}
