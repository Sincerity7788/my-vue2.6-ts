export function isObject(obj: any): boolean{
  return obj !== null && typeof obj === 'object'
}

export function isFunction(value: any): value is (...args : any[]) => any{
  return typeof value === 'function'
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */

export function noop(a?: any, b?: any, c?: any){}


/**
 * Remove an item from an array.
 */
export function remove(arr: Array<any>, item: any):Array<any> | void{
  const len = arr.length
  if( len ){
    // fast path for the only / last item 唯一/最后一项的快速路径
    // 如果传进来的item 等于数组的最后一项，就直接让长度 - 1，删除最后一项什么都不返回
    if( item === arr[len - 1] ){
      arr.length = len - 1
      return
    }
    // 如果不等于的清空下，就找到数组中对应的位置
    const index = arr.indexOf(item)
    if( index > -1 ){
      // 返回删除的那一项
      return arr.splice(index, 1)
    }
  }
}
