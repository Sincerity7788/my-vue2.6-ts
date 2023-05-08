
/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 * 用于解析 html 标签、组件名称和属性路径的 unicode 字母。
 * 使用 https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * 跳过 \u10000-\uEFFFF 因为它冻结了 PhantomJS
 */

export const unicodeRegExp =
  /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

/**
 * Parse simple path.
 */

const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
export function parsePath(path: string): any{
  if( bailRE.test(path) ){
    return
  }
  // 根据小数点分割 path 成数组
  const segments = path.split(".")
  // 返回函数接收一个参数
  return function (obj){
    // 循环上面分割出来的数组
    for( let i = 0; i < segments.length;i++ ){
      // 如果发现obj为空或者undefined 就直接结束函数
      if( !obj ) return
      // 将obj一直赋值为最后一项
      obj = obj[segments[i]]
    }
    return obj
  }
}
