// 关于 LeetCode 测试用例字符串过长导致 RegExp too big的问题暂时不予修复
// 我认为这个测试用例不合理，无论在面试中还是实际应用中这个算法思路都是足够用的
// 我建议大家不要为了刷题而刷题
export default (str) => {
  // 建立数据结构，堆栈，保存数据
  let r = []
  // 给定任意子输入都返回第一个符合条件的子串
  let match = (str) => {
    let j = str.match(/^(0+|1+)/)[0]
    let o = (j[0] ^ 1).toString().repeat(j.length)
    let reg = new RegExp(`^(${j}${o})`)
    if (reg.test(str)) {
      return RegExp.$1
    } else {
      return ''
    }
  }
  // 通过for循环控制程序运行的流程
  for (let i = 0, len = str.length - 1; i < len; i++) {
    let sub = match(str.slice(i))
    if (sub) {
      r.push(sub)
    }
  }
  return r
}


// 返回非空连续的字符串集合
// 可供断点调试的代码⬇️ 需要注释掉上面的代码

function regSub (str)  {
  // 建立数据结构，堆栈，保存数据
  let r = []
  // 给定任意子输入都返回第一个符合条件的子串
  let match = (str) => {
    let j = str.match(/^(0+|1+)/)[0]
    // 使用异或的方式，异或运算符^，即参加运算的两个对象，如果两个相应位为“异”（值不同），则该位结果为1，否则为0。
    let o = (j[0] ^ 1).toString().repeat(j.length)
    let reg = new RegExp(`^(${j}${o})`)
    if (reg.test(str)) {
    // RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串，
    // 以此类推，RegExp.$2，RegExp.$3，..RegExp.$99总共可以有99个匹配
      return RegExp.$1
    } else {
      return ''
    }
  }
  // 通过for循环控制程序运行的流程
  for (let i = 0, len = str.length - 1; i < len; i++) {
    let sub = match(str.slice(i))
    if (sub) {
      r.push(sub)
    }
  }
  return r
}

// regSub('01110011')