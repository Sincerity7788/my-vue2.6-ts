import Watcher from "../core/observer/watcher";
import { EffectScope } from "../v3/reactivity/effectScope";

export declare class Component {
  constructor(options?: any);
  static options: Record<string, any>;

  _init: Function;
  _uid: number;

  _isVue: true;
  __v_skip: true;
  _scope: EffectScope;

  _watcher: Watcher | null;
  _isBeingDestroyed: boolean;
}
