import { Component } from "types/component";

export interface Config {
  performance: boolean;
  devtools: boolean;
  errorHandler?: (err: Error, vm: Component | null, info: string) => void;
  warnHandler?: (msg: string, vm: Component | null, trace: string) => void;
  // private
  async: boolean;
}

export default {
  performance: false,
  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,
  /**
   * Error handler for watcher errors
   */
  errorHandler: null,
  /**
   * Whether to enable devtools
   */
  devtools: __DEV__,
  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,
} as unknown as Config;
