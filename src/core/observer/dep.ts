import { DebuggerEventExtraInfo, DebuggerOptions } from "v3/debug";
import config from "../config";

let uid = 0;

const pendingCleanupDeps: Dep[] = [];

export interface DepTarget extends DebuggerOptions {
  id: number;
  addDep(dep: Dep): void;
  update(): void;
}

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * @internal
 */
export default class Dep {
  static target?: DepTarget | null;
  id: number;
  subs: Array<DepTarget | null>;
  _pending = false;

  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  addSub(sub: DepTarget) {
    this.subs.push(sub);
  }

  removeSub(sub: DepTarget) {
    // #12696 deps with massive amount of subscribers are extremely slow to
    // clean up in Chromium
    // to workaround this, we unset the sub for now, and clear them on
    // next scheduler flush.
    this.subs[this.subs.indexOf(sub)] = null;
    if (!this._pending) {
      this._pending = true;
      pendingCleanupDeps.push(this);
    }
  }

  depend(info?: DebuggerEventExtraInfo) {
    if (Dep.target) {
      Dep.target.addDep(this);
      if (__DEV__ && info && Dep.target.onTrack) {
        Dep.target.onTrack({
          effect: Dep.target,
          ...info,
        });
      }
    }
  }

  notify(info?: DebuggerEventExtraInfo) {
    // stabilize the subscriber list first
    const subs = this.subs.filter((s) => s) as DepTarget[];
    if (__DEV__ && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id);
    }
    for (let i = 0, l = subs.length; i < l; i++) {
      const sub = subs[i];
      if (__DEV__ && info) {
        sub.onTrigger &&
          sub.onTrigger({
            effect: subs[i],
            ...info,
          });
      }
      sub.update();
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.

const targetStack: Array<DepTarget | null | undefined> = [];

export function pushTarget(target?: DepTarget | null) {
  targetStack.push(target);
}

export function popTarget() {
  targetStack.pop();
}
