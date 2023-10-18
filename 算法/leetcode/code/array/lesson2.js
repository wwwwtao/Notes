// export default (arr) => {
//   // 存储每张卡牌的总数
//   // 修改排序的方式修改为直接统计每个相同字符的数量，思路不变（LeetCode测试用例）
//   let group = []
//   let tmp = {}
//   arr.forEach(item => {
//     tmp[item] = tmp[item] ? tmp[item] + 1 : 1
//   })
//   for (let v of Object.values(tmp)) {
//     group.push(v)
//   }
//   // 此时group已经存放的是每张牌的总数了（数组只遍历一遍，避免了排序和正则的耗时）
//   // 求两个数的最大公约数
//   let gcd = (a, b) => {
//     if (b === 0) {
//       return a
//     } else {
//       return gcd(b, a % b)
//     }
//   }
//   // 思想：只要所有的分组具有最大公约数(大于1)就满足条件
//   // 对所有的分组进行最大公约数验证，相邻两个分组的最大公约数，再与后面的公约数进行验证，以此类推，有一个最大公约数为1就退出
//   while (group.length > 1) {
//     let a = group.shift().length
//     let b = group.shift().length
//     let v = gcd(a, b)
//     if (v === 1) {
//       return false
//     } else {
//       // 将前两个分组的最大公约数推进数组与下一个分组再次验证是否有最大公约数
//       group.unshift('0'.repeat(v))
//     }
//   }
//   // 考虑边界['11']即只有一个分组的时候
//   return group.length ? group[0].length > 1 : false
// }


// 卡牌分组
// 可供断点调试的代码⬇️ 需要注释掉上面的代码

var hasGroupsSizeX = function(deck) {
  let getResult = (a, b) => {    //定义一个寻找公约数的方法
    if(b === 0)  return a;   
    return getResult(b, a % b)
  }
  const hash = deck.reduce((pre, num) => {    //统计出每种数字的数目
    if(!pre[num]) {
      pre[num] = 1
    }else{
      pre[num]++
    }
    return pre
  }, {})
  const numCount = Object.values(hash)     //将hash中的每项数值存入数组，便于后续遍历
  const min = numCount.sort((a, b) => a-b)[0];         //利用数组排序快速获取最小值
  if (min < 2) return false; //根据题意，如果最分组最小数量小于2，直接返回false
  return !numCount.some((item,index) => {
    if(index > 0) return getResult(item, min) === 1
  })
}

hasGroupsSizeX([1,1,2,2,2,2])
