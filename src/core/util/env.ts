
// 导出当前运行环境是否为浏览器
export const isBrowser = typeof window !== 'undefined'

// 导出判断当前是否在ssr环境中 isServerRendering
export function isServerRendering(){
    console.log("判断当前是否在ssr环境中")
}








