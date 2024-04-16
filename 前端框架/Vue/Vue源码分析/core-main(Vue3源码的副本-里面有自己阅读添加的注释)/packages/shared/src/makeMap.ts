/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * IMPORTANT: all calls of this function must be prefixed with
 * \/\*#\_\_PURE\_\_\*\/
 * So that rollup can tree-shake them if necessary.
 */

/*! #__NO_SIDE_EFFECTS__ */
export function makeMap(
  str: string,
  expectsLowerCase?: boolean,
): (key: string) => boolean {
  const set = new Set(str.split(','))
  return expectsLowerCase
    ? val => set.has(val.toLowerCase())
    : val => set.has(val)
}

// 这段代码是一个函数 makeMap，主要用于创建一个映射并返回一个函数，用于检查某个键是否在映射中。让我们来逐步解释这个函数的主要逻辑：

// 1. 函数参数：
//    - str: 一个字符串，用逗号分隔不同的键，表示要创建映射的内容
//    - expectsLowerCase: 一个可选的布尔值参数，表示是否期望键是小写的

// 2. 创建映射：
//    - 首先将输入的字符串 str 使用逗号分隔，并通过 Set 构造函数创建一个新的 Set 集合 set，其中集合中的元素就是分隔后的键

// 3. 返回一个函数：
//    - 返回一个函数，这个函数接受一个字符串参数 key，用于检查 key 是否在映射中
//    - 如果 expectsLowerCase 为 true，则返回的函数会将传入的 key 转换为小写后再检查是否在映射中
//    - 如果 expectsLowerCase 为 false 或未提供，则返回的函数直接检查传入的 key 是否在映射中

// 4. 使用注意事项：
//    - 代码中注释提到，所有调用这个函数的地方必须在调用前添加注释  `/*#__PURE__*/` ，以便 Rollup 在需要时进行树摇优化
//    - 函数声明上方的注释  `/*! #__NO_SIDE_EFFECTS__ */`  表示这个函数没有副作用

// 总的来说，这个函数的作用是创建一个映射，并返回一个函数用于检查某个键是否在映射中。可以根据 expectsLowerCase 参数来决定是否忽略大小写进行匹配。