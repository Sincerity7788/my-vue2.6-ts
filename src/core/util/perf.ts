// @ts-nocheck
import { inBrowser } from "./env";

export let mark;
export let measure;

// 判断是否是开发环境
if (__DEV__) {
  // 判断当前是否是浏览器环境，并且支持性能检测的浏览器
  const perf = inBrowser && window.performance;

  // 判断 perf 是否拿到了window.performance
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    // 赋值 mark 方法，使用给定名称timestamp在浏览器的性能条目缓冲区中创建一个。
    mark = (tag) => perf.mark(tag);
    // timestamp在浏览器的性能条目缓冲区中的两个指定标记（分别称为开始标记和结束标记）之间创建一个命名。
    measure = (name, startTag, endTag) => {
      perf.measure(name, startTag, endTag);
      // 从浏览器的性能条目缓冲区中删除给定的标记。
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
    };
  }
}
