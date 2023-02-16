/* @flow */

/**
 * unicode letters used for parsing html tags, component names and property paths. (用于解析html标记、组件名称和属性路径的unicode字母。)
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS (*跳过\u10000-\uEFFF，因为它冻结了PhantomJS)
 */
export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

/**
 * Check if a string starts with $ or _ (检查字符串是否以$或_)
 * @description 在Vue中不允许使用以$或_开头的字符串作为data数据的字段名, isReserved 函数用来检测一个字符串是否以$ 或者 _ 开头。
   它的实现方式是通过字符串的 charCodeAt 方法获得该字符串第一个字符的 unicode，然后与 0x24 和 0x5F 作比较。其中 $ 对应的 unicode 码为 36，对应的十六进制值为 0x24；_ 对应的 unicode 码为 95，对应的十六进制值为 0x5F。
 */
export function isReserved (str: string): boolean {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

/**
 * Parse simple path. 解析一个简单路径
 */
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
export function parsePath (path: string): any {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
